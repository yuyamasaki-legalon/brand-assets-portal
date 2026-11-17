import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createProductionServer } from './server.mjs';

const asset = (id, extra={}) => ({id,title:`Asset ${id}`,brand:'LegalOn',fileFormat:'PNG',status:'current',publication:'published',assetType:'ロゴ',updatedAt:'2026-11-17',tags:[id],driveId:id,driveUrl:`https://drive.google.com/file/d/${id}/view`,...extra});
const product={id:'LegalOn',label:'LegalOn',state:'active',order:0};
const markers=['truston-drive-2026-10-09','truston-potx-template-2026-11-16'];

async function fixture() {
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'shared-catalog-'));
  const dataDir=path.join(root,'data'), seedPath=path.join(root,'seed.json'), importsPath=path.join(root,'cms-imports.json');
  await fs.mkdir(dataDir);
  await fs.writeFile(seedPath,JSON.stringify([asset('seed-only')]));
  await fs.writeFile(importsPath,'[]');
  const file=path.join(dataDir,'catalog.json');
  const config={origin:'https://portal.example.test',clientId:'test-client',clientSecret:'not-a-real-credential',domains:['example.test'],editorEmails:['editor@example.test'],dataDir};
  let email,nonce,server,base;
  const provider={authorizationUrl(state,value){nonce=value;return `https://accounts.google.com/test?state=${state}`;},async exchangeAndVerify(){return{iss:'https://accounts.google.com',aud:config.clientId,sub:email,email,email_verified:true,hd:email.endsWith('@example.test')?'example.test':'other.test',nonce,exp:Math.floor(Date.now()/1000)+3600};}};
  async function start(){server=createProductionServer(config,path.resolve('public'),seedPath,provider);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${server.address().port}`;}
  async function stop(){if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));server=undefined;}}
  async function login(value){email=value;const start=await fetch(`${base}/api/auth/google/start`,{redirect:'manual'});const state=new URL(start.headers.get('location')).searchParams.get('state');const result=await fetch(`${base}/api/auth/google/callback?state=${state}&code=test`,{redirect:'manual',headers:{Cookie:start.headers.getSetCookie()[0].split(';')[0]}});if(result.status!==302)return{status:result.status};const cookie=result.headers.getSetCookie().find(value=>value.startsWith('__Host-brand_cms_session=')).split(';')[0];const session=await(await fetch(`${base}/api/auth/session`,{headers:{Cookie:cookie}})).json();return{status:302,cookie,headers:{Cookie:cookie,Origin:config.origin,'X-CSRF-Token':session.csrfToken,'Content-Type':'application/json'}};}
  async function request(route,user,body){return fetch(`${base}/api/brand-assets/${route}`,{method:body?'PUT':'GET',headers:user?.headers,body:body?JSON.stringify(body):undefined});}
  async function read(route,user){const response=await request(route,user);assert.equal(response.status,200,await response.clone().text());assert.match(response.headers.get('cache-control'),/no-store/);return response.json();}
  return {root,file,seedPath,importsPath,start,stop,login,request,read,staticRequest:(route,user)=>fetch(`${base}${route}`,{headers:user?.headers}),async cleanup(){await stop();await fs.rm(root,{recursive:true,force:true});}};
}

test('anonymous visitors and company readers share published content, while drafts and writes stay editor-only',async()=>{
  const f=await fixture();
  const saved={revision:4,products:[product,{...product,id:'Ended',label:'Ended',state:'ended'}],assets:[asset('public',{owner:'internal owner',internalNote:'private',previousVersionId:'draft'}),asset('draft',{publication:'draft'}),asset('archived',{status:'archived'}),asset('expired',{expiresAt:'2000-01-01'}),asset('ended',{brand:'Ended'})],appliedSeedUpdates:markers,lastChange:{actorId:'private-actor',at:'2026-11-17'}};
  await fs.writeFile(f.file,JSON.stringify(saved));
  try {
    await f.start();
    assert.equal((await f.request('search')).status,200);
    assert.equal((await f.request('catalog')).status,401);
    assert.equal((await f.login('outsider@other.test')).status,403);
    const viewer=await f.login('viewer@example.test'),editor=await f.login('editor@example.test');
    const portalHtml=await(await f.staticRequest('/brand-asset-portal/index.html',viewer)).text();
    const privateEntry=new URL(portalHtml.match(/src="([^"]+\.js)"/)[1],'https://portal.example.test/brand-asset-portal/index.html').pathname;
    assert.equal((await f.staticRequest(privateEntry)).status,200);
    const privateScript=await f.staticRequest(privateEntry,viewer);assert.equal(privateScript.status,200);assert.equal(privateScript.headers.get('cache-control'),'public, max-age=3600');
    assert.equal((await f.request('catalog',viewer)).status,403);
    const initial=await f.read('search',viewer);
    assert.deepEqual(initial,await f.read('search',editor));
    assert.deepEqual(initial,await f.read('search'));
    assert.equal((await f.request('search',undefined,saved)).status,403,'origin-less writes remain rejected');
    assert.equal((await f.request('catalog',undefined,saved)).status,403,'origin-less writes remain rejected');
    assert.deepEqual(initial.assets.map(a=>a.id),['public']);
    assert.deepEqual(initial.products,[product]);
    for(const key of ['owner','internalNote','previousVersionId']) assert.equal(key in initial.assets[0],false);
    for(const key of ['lastChange','appliedSeedUpdates']) assert.equal(key in initial,false);
    assert.deepEqual(await f.read('catalog',editor),saved);
    assert.equal((await f.request('search',viewer,saved)).status,405);
    assert.equal((await f.request('catalog',viewer,saved)).status,403);
    let full=await f.read('catalog',editor);
    full.assets.push(asset('cms-published'),asset('cms-draft',{publication:'draft'}));
    let response=await f.request('catalog',editor,full);assert.equal(response.status,200);
    let updated=await response.json();
    assert.equal(updated.lastChange.actorId,'editor@example.test');
    assert.equal((await f.request('catalog',editor,full)).status,409);
    let search=await f.read('search',viewer);
    assert.deepEqual(search,await f.read('search',editor));
    assert.deepEqual(search,await f.read('search'));
    assert.deepEqual(search.assets.map(a=>a.id),['public','cms-published']);
    // Publication, archival, expiry and product ending are enforced at the server.
    for(const change of [{publication:'draft'},{status:'archived'},{expiresAt:'2000-01-01'}]) {
      const next={...updated,assets:updated.assets.map(a=>a.id==='cms-published'?{...a,...change}:a)};
      response=await f.request('catalog',editor,next);assert.equal(response.status,200);const hidden=await response.json();
      assert.equal((await f.read('search',viewer)).assets.some(a=>a.id==='cms-published'),false);
      response=await f.request('catalog',editor,{...updated,revision:hidden.revision});assert.equal(response.status,200);updated=await response.json();
    }
    response=await f.request('catalog',editor,{...updated,products:updated.products.map(p=>({...p,state:'ended'}))});assert.equal(response.status,200);
    const ended=await response.json();assert.deepEqual((await f.read('search',viewer)).assets,[]);
    response=await f.request('catalog',editor,{...updated,revision:ended.revision,assets:updated.assets.filter(a=>a.id!=='cms-published'),deletedAssetIds:['cms-published']});assert.equal(response.status,200);
    const after=await f.read('search',viewer);assert.deepEqual(after.assets.map(a=>a.id),['public']);
    await f.stop();await f.start();
    assert.deepEqual(await f.read('search',viewer),after,'expired sessions must not change public content');
    assert.equal((await f.request('catalog',editor)).status,401,'restart still invalidates management sessions');
    const nextViewer=await f.login('viewer@example.test');assert.deepEqual(await f.read('search',nextViewer),after);
    // Changing the seed must never restore deleted assets or replace saved edits.
    await fs.writeFile(f.seedPath,JSON.stringify([asset('seed-only'),asset('cms-published')]));
    await f.stop();await f.start();assert.deepEqual(await f.read('search',await f.login('viewer@example.test')),after);
  } finally {await f.cleanup();}
});

test('repository/Chat batches use the same store exactly once, preserve edits and deletions, and retry safely',async()=>{
  const f=await fixture();
  const existing=asset('existing',{title:'CMS edited title',driveId:undefined,driveUrl:'https://drive.google.com/file/d/shared-drive-id/view'});
  await fs.writeFile(f.file,JSON.stringify({revision:7,products:[product],assets:[existing],appliedSeedUpdates:markers}));
  const batches=[{id:'test-chat-registration',assets:[asset('duplicate-drive',{driveUrl:existing.driveUrl}),asset('existing',{title:'Must not overwrite'}),asset('chat-published'),asset('chat-draft',{publication:'draft'})]}];
  await fs.writeFile(f.importsPath,JSON.stringify(batches));
  try {
    await f.start();const viewer=await f.login('viewer@example.test'),editor=await f.login('editor@example.test');
    const [a,b,anonymous]=await Promise.all([f.read('search',viewer),f.read('search',editor),f.read('search')]);
    assert.deepEqual(a,anonymous);
    assert.deepEqual(a,b);assert.equal(a.revision,8);assert.deepEqual(a.assets.map(a=>a.id),['existing','chat-published']);
    assert.equal(a.assets[0].title,'CMS edited title');
    const full=await f.read('catalog',editor);assert.equal(full.assets.length,3);assert.ok(full.appliedSeedUpdates.includes(batches[0].id));
    assert.equal((await fs.readdir(path.join(f.root,'data/history'))).length,1);
    assert.equal((await f.request('catalog',editor,{...full,assets:full.assets.filter(a=>a.id!=='chat-published'),deletedAssetIds:['chat-published'],appliedSeedUpdates:[]})).status,200);
    await f.stop();await f.start();
    const next=await f.login('viewer@example.test');
    assert.deepEqual((await f.read('search',next)).assets.map(a=>a.id),['existing']);
    assert.ok(JSON.parse(await fs.readFile(f.file,'utf8')).appliedSeedUpdates.includes(batches[0].id));
    // Inject a failure before rename: no partial commit, GET fails closed, retry succeeds.
    batches.push({id:'test-next-chat-registration',assets:[asset('chat-next')]});
    await fs.writeFile(f.importsPath,JSON.stringify(batches));
    await f.stop();await f.start();const retryUser=await f.login('viewer@example.test');
    const rename=fs.rename, readdir=fs.readdir;
    try {
      fs.rename=async(from,to)=>{if(to===f.file)throw new Error('test pre-commit failure');return rename(from,to);};
      assert.equal((await f.request('search',retryUser)).status,500);
      assert.equal(JSON.parse(await fs.readFile(f.file,'utf8')).revision,9);
    } finally {fs.rename=rename;}
    try {
      fs.readdir=async(dir,...args)=>{if(String(dir)===path.join(f.root,'data/history'))throw new Error('test cleanup failure');return readdir(dir,...args);};
      const committed=await f.read('search',retryUser);assert.equal(committed.revision,10);assert.deepEqual(committed.assets.map(a=>a.id),['existing','chat-next']);
    } finally {fs.readdir=readdir;}
    assert.equal((await f.read('search',retryUser)).revision,10);
  } finally {await f.cleanup();}
});

test('first catalogue read persists a single seed across releases',async()=>{
  const f=await fixture();
  try {
    await f.start();const user=await f.login('viewer@example.test');
    const first=await f.read('search',user);assert.deepEqual(first.assets.map(a=>a.id),['seed-only']);
    assert.equal(JSON.parse(await fs.readFile(f.file,'utf8')).revision,0);
    await fs.writeFile(f.seedPath,JSON.stringify([asset('different-seed')]));
    await f.stop();await f.start();assert.deepEqual(await f.read('search',await f.login('viewer@example.test')),first);
  } finally {await f.cleanup();}
});
