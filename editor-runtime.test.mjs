import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createProductionServer, readProductionConfig } from './server.mjs';

const settings = { CMS_PUBLIC_ORIGIN:'https://portal.example.test', GOOGLE_OAUTH_CLIENT_ID:'test-client', GOOGLE_OAUTH_CLIENT_SECRET:'not-a-real-credential', GOOGLE_ALLOWED_DOMAINS:'example.test', CMS_DATA_DIR:'/private/test-data' };

test('editor config normalizes exact company addresses, rejects invalid entries, and defaults to nobody', () => {
  assert.deepEqual(readProductionConfig(settings).editorEmails, []);
  assert.deepEqual(readProductionConfig({...settings,CMS_EDITOR_EMAILS:' Staff@Example.Test , staff@example.test, ,second@example.test '}).editorEmails, ['staff@example.test','second@example.test']);
  for (const value of ['invalid','staff@other.test','a@@example.test','a@example.test b@example.test']) {
    assert.throws(()=>readProductionConfig({...settings,CMS_EDITOR_EMAILS:value}),/CMS_EDITOR_EMAILS/);
  }
});

test('only listed employees may save or delete; other employees may read and log out', async () => {
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'cms-editor-test-'));
  const config={origin:'https://portal.example.test',clientId:'test-client',clientSecret:'not-a-real-credential',domains:['example.test'],editorEmails:['staff@example.test'],dataDir:root};
  let email='staff@example.test',nonce;
  const provider={
    authorizationUrl(state,value){nonce=value;return `https://accounts.google.com/test?state=${state}`;},
    async exchangeAndVerify(){return{iss:'https://accounts.google.com',aud:config.clientId,sub:email,email,email_verified:true,hd:'example.test',nonce,exp:Math.floor(Date.now()/1000)+3600};},
  };
  const server=createProductionServer(config,path.resolve('public'),path.resolve('cms-seed.json'),provider);
  try {
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const base=`http://127.0.0.1:${server.address().port}`;
    async function login(nextEmail){
      email=nextEmail;
      const start=await fetch(`${base}/api/auth/google/start`,{redirect:'manual'});
      const state=new URL(start.headers.get('location')).searchParams.get('state');
      const callback=await fetch(`${base}/api/auth/google/callback?code=test-code&state=${state}`,{redirect:'manual',headers:{Cookie:start.headers.getSetCookie()[0].split(';')[0]}});
      assert.equal(callback.status,302);
      const cookie=callback.headers.getSetCookie().find(value=>value.startsWith('__Host-brand_cms_session=')).split(';')[0];
      const session=await(await fetch(`${base}/api/auth/session`,{headers:{Cookie:cookie}})).json();
      return {cookie,session,headers:{Cookie:cookie,Origin:config.origin,'X-CSRF-Token':session.csrfToken,'Content-Type':'application/json'}};
    }
    const viewer=await login('viewer@example.test');
    assert.equal(viewer.session.authenticated,true);
    assert.equal(viewer.session.canEdit,false);
    const read=await fetch(`${base}/api/brand-assets/catalog`,{headers:{Cookie:viewer.cookie}});
    assert.equal(read.status,200);
    const catalog=await read.json();
    for(const payload of [catalog,{...catalog,assets:catalog.assets.slice(1),deletedAssetIds:[catalog.assets[0].id]},{...catalog,products:catalog.products.map(p=>({...p,state:'ended'}))}]) {
      assert.equal((await fetch(`${base}/api/brand-assets/catalog`,{method:'PUT',headers:viewer.headers,body:JSON.stringify(payload)})).status,403);
    }
    await assert.rejects(fs.access(path.join(root,'catalog.json')));
    const editor=await login('STAFF@example.test');
    assert.equal(editor.session.canEdit,true);
    const saved=await fetch(`${base}/api/brand-assets/catalog`,{method:'PUT',headers:editor.headers,body:JSON.stringify(catalog)});
    assert.equal(saved.status,200);
    assert.equal((await saved.json()).revision,catalog.revision+1);
    const reread=await(await fetch(`${base}/api/brand-assets/catalog`,{headers:{Cookie:viewer.cookie}})).json();
    assert.equal(reread.revision,catalog.revision+1);
    const published=await fetch(`${base}/brand-asset-portal/index.html`);
    assert.equal(published.status,200);
    assert.equal((await fetch(`${base}/api/auth/logout`,{method:'POST',headers:viewer.headers})).status,200);
    assert.equal((await fetch(`${base}/api/brand-assets/catalog`,{headers:{Cookie:viewer.cookie}})).status,401);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve=>server.close(resolve));
    await fs.rm(root,{recursive:true,force:true});
  }
});
