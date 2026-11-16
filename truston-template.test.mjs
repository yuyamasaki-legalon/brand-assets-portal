import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createProductionServer } from './server.mjs';

test('POTX addition preserves saved edits, deduplicates, retries failures and never resurrects deletion', async () => {
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'truston-potx-'));
  const seed=JSON.parse(await fs.readFile('cms-seed.json','utf8'));
  const template=seed.find(asset=>asset.id==='truston-powerpoint-template-potx');
  assert.equal(template.fileFormat,'PPT');
  assert.equal(template.driveId,'1ycsMOAX4bNwisqDO4DrKcJpzYiGbfFz7');
  assert.match(template.description,/POTX/);
  const marker='truston-potx-template-2026-11-16';
  const product={id:'TrustOn',label:'Edited TrustOn',state:'ended',order:42};
  const old={revision:10,products:[product],assets:[{...seed.find(a=>a.brand==='TrustOn'),title:'Edited logo'}],appliedSeedUpdates:['truston-drive-2026-10-09']};
  const file=path.join(root,'catalog.json');
  const config={origin:'https://portal.example.test',clientId:'test-client',clientSecret:'not-a-real-credential',domains:['example.test'],editorEmails:['staff@example.test'],dataDir:root};
  let server,nonce;
  const provider={authorizationUrl(state,value){nonce=value;return `https://accounts.google.com/test?state=${state}`;},async exchangeAndVerify(){return{iss:'https://accounts.google.com',aud:config.clientId,sub:'employee',email:'staff@example.test',email_verified:true,hd:'example.test',nonce,exp:Math.floor(Date.now()/1000)+3600};}};
  async function stop(){if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));server=undefined;}}
  async function open(){
    await stop();
    server=createProductionServer(config,path.resolve('public'),path.resolve('cms-seed.json'),provider);
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const base=`http://127.0.0.1:${server.address().port}`;
    const start=await fetch(base+'/api/auth/google/start',{redirect:'manual'});
    const state=new URL(start.headers.get('location')).searchParams.get('state');
    const callback=await fetch(base+`/api/auth/google/callback?code=test-code&state=${state}`,{redirect:'manual',headers:{Cookie:start.headers.getSetCookie()[0].split(';')[0]}});
    const cookie=callback.headers.getSetCookie().find(value=>value.startsWith('__Host-brand_cms_session=')).split(';')[0];
    const session=await(await fetch(base+'/api/auth/session',{headers:{Cookie:cookie}})).json();
    const headers={Cookie:cookie,Origin:config.origin,'X-CSRF-Token':session.csrfToken,'Content-Type':'application/json'};
    const endpoint=base+'/api/brand-assets/catalog';
    return{endpoint,headers,read:async()=>{const r=await fetch(endpoint,{headers});assert.equal(r.status,200);return r.json();}};
  }
  try{
    await fs.writeFile(file,JSON.stringify(old));
    let client=await open();
    assert.equal((await fetch(client.endpoint)).status,401);
    assert.deepEqual(JSON.parse(await fs.readFile(file,'utf8')),old,'unauthenticated GET cannot apply import');
    const imported=await client.read();
    assert.equal(imported.revision,11);
    assert.deepEqual(imported.products,[product]);
    assert.deepEqual(imported.assets,[...old.assets,template]);
    assert.ok(imported.appliedSeedUpdates.includes(marker));
    assert.equal(imported.lastChange.actorId,'system:truston-template-import');
    const history=await fs.readdir(path.join(root,'history'));
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(root,'history',history[0]),'utf8')),old);
    client=await open();
    assert.deepEqual(await client.read(),imported,'restart does not add twice');
    const deleted={...imported,assets:old.assets,deletedAssetIds:[template.id]};
    const saved=await fetch(client.endpoint,{method:'PUT',headers:client.headers,body:JSON.stringify(deleted)});
    assert.equal(saved.status,200);
    client=await open();
    assert.deepEqual((await client.read()).assets,old.assets,'explicit deletion remains deleted');
    for(const existing of [{...template,id:'custom-template',title:'Custom template',publication:'draft'},{...template,driveId:'other-file',title:'Custom ID'}]){
      await stop();
      await fs.writeFile(file,JSON.stringify({...old,assets:[...old.assets,existing]}));
      client=await open();
      assert.deepEqual((await client.read()).assets,[...old.assets,existing],'existing ID or Drive link is not overwritten or duplicated');
    }
    // A failed pre-commit history write must leave the old catalogue readable.
    await stop();
    const isolated=await fs.mkdtemp(path.join(root,'failure-'));
    config.dataDir=isolated;
    await fs.writeFile(path.join(isolated,'catalog.json'),JSON.stringify(old));
    await fs.writeFile(path.join(isolated,'history'),'test-only blocker');
    client=await open();
    assert.deepEqual(await client.read(),old);
    await fs.unlink(path.join(isolated,'history'));
    assert.equal((await client.read()).assets.length,old.assets.length+1,'next read retries safely');
    // A blocked legacy batch must not prevent the independent one-file addition.
    await stop();
    config.dataDir=await fs.mkdtemp(path.join(root,'capacity-'));
    const large={...old,appliedSeedUpdates:[],assets:Array.from({length:9995},(_,index)=>({...old.assets[0],id:`legacy-${index}`,driveId:`legacy-${index}`}))};
    await fs.writeFile(path.join(config.dataDir,'catalog.json'),JSON.stringify(large));
    client=await open();
    const withTemplate=await client.read();
    assert.equal(withTemplate.assets.length,9996);
    assert.equal(withTemplate.assets.filter(asset=>asset.driveId===template.driveId).length,1);
    assert.ok(withTemplate.appliedSeedUpdates.includes(marker));
    assert.ok(!withTemplate.appliedSeedUpdates.includes('truston-drive-2026-10-09'));
    assert.equal((await client.read()).revision,withTemplate.revision,'pending logo import does not duplicate template on retry');
    // Free capacity, then verify the original batch was left retryable.
    const trim=await fetch(client.endpoint,{method:'PUT',headers:client.headers,body:JSON.stringify({...withTemplate,assets:withTemplate.assets.slice(10),deletedAssetIds:withTemplate.assets.slice(0,10).map(asset=>asset.id)})});
    assert.equal(trim.status,200);
    const completed=await client.read();
    assert.ok(completed.appliedSeedUpdates.includes('truston-drive-2026-10-09'));
    assert.equal(completed.assets.filter(asset=>asset.driveId===template.driveId).length,1);
  }finally{await stop();await fs.rm(root,{recursive:true,force:true});}
});
