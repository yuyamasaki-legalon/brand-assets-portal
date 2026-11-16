import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createProductionServer } from './server.mjs';

test('editor restriction preserves frontend, downloads, thumbnail module and catalogue storage', async () => {
  const source = await fs.readFile('server.mjs', 'utf8');
  const storage = source.split('//#region scripts/brand-asset-cms-api.ts\n')[1].split('//#endregion')[0];
  assert.equal(createHash('sha256').update(storage).digest('hex'), '94ad8036cebe4ac77aaed3aa47f186502324a6d13f37bc37c1e79aa416a97ce1');
  for (const [file, hash] of [
    ['public/assets/index-BMZMSjyV.js', 'd3c408843f5e8189af7d588fe66cef2b1006a37abb10c2fa785e2cd77cdbd2da'],
    ['public/assets/index-DyZz37-B.css', '73fbb77c23092f62f3dc285f656cf21e9ce0bf64beb748145322cfba2053125f'],
    ['public/brand-asset-portal/index.html', '07c63cb4b2d4496ca45a14afc42cee1c5e91de7ad0eca86bedf99703e4541842'],
    ['drive-thumbnail.mjs', 'b8d80578acef7a8c27cf54f8472a0e8c29670ab2a5a8f450ff7005d0dc7b81c8'],
  ]) assert.equal(createHash('sha256').update(await fs.readFile(file)).digest('hex'), hash, file);
  assert.equal(createHash('sha256').update(await fs.readFile('cms-seed.json')).digest('hex'), '6943226b4a5845e160ee4590d544c01042f79e9d33bff635ec850720bb2b4c59');
});

test('private thumbnail route preserves employee authentication and never grants anonymous editing', async () => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'thumbnail-release-test-'));
  const config = { origin:'https://portal.example.test', clientId:'test-client', clientSecret:'not-a-real-credential', domains:['example.test'], dataDir };
  let nonce;
  const provider = {
    authorizationUrl(state, value) { nonce = value; return `https://accounts.google.com/test?state=${state}`; },
    async exchangeAndVerify() { return { iss:'https://accounts.google.com',aud:config.clientId,sub:'employee',email:'staff@example.test',email_verified:true,hd:'example.test',nonce,exp:Math.floor(Date.now()/1000)+3600 }; },
  };
  const nativeFetch = globalThis.fetch;
  let googleCalls = 0;
  let cancelled = 0;
  function unread(status, headers = {}) {
    return new Response(new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(10)); }, cancel() { cancelled++; } }), {status,headers});
  }
  let mode = 'image';
  globalThis.fetch = async (url, options) => {
    const target = String(url);
    if (target.startsWith('https://www.googleapis.com/drive/v3/files/')) {
      googleCalls++;
      assert.equal(options.headers.Authorization, 'Bearer test-only-token');
      assert.equal(options.redirect,'error');
      if (mode === 'forbidden') return unread(403);
      if (mode === 'metadata-large-header') return unread(200, {'content-length':'20000'});
      if (mode === 'missing') return Response.json({});
      return Response.json({thumbnailLink:mode === 'unsafe'?'https://evil.example.test/private':'https://lh3.googleusercontent.com/fixture'});
    }
    if (target.startsWith('https://lh3.googleusercontent.com/')) {
      googleCalls++;
      assert.equal(options.headers.Authorization,'Bearer test-only-token');
      if (mode === 'html') return unread(200, {'content-type':'text/html'});
      if (mode === 'image-forbidden') return unread(403, {'content-type':'image/png'});
      if (mode === 'large-header') return unread(200, {'content-type':'image/png','content-length':'3000000'});
      return new Response(new Uint8Array(mode==='large'?2*1024*1024+1:10),{headers:{'content-type':'image/png'}});
    }
    return nativeFetch(url,options);
  };
  const server = createProductionServer(config,path.resolve('public'),path.resolve('cms-seed.json'),provider);
  try {
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const base=`http://127.0.0.1:${server.address().port}`;
    const thumbnail=`${base}/api/brand-assets/thumbnail/test-file-id-123`;
    const anon=await (await fetch(`${base}/api/auth/session`)).json();
    assert.equal(anon.canEdit,false);
    assert.equal((await fetch(thumbnail,{headers:{Authorization:'Bearer test-only-token'}})).status,401);
    assert.equal(googleCalls,0);
    const start=await fetch(`${base}/api/auth/google/start`,{redirect:'manual'});
    const state=new URL(start.headers.get('location')).searchParams.get('state');
    const callback=await fetch(`${base}/api/auth/google/callback?code=test-code&state=${state}`,{redirect:'manual',headers:{Cookie:start.headers.getSetCookie()[0].split(';')[0]}});
    assert.equal(callback.status,302);
    const cookie=callback.headers.getSetCookie().find(value=>value.startsWith('__Host-brand_cms_session=')).split(';')[0];
    const session=await (await fetch(`${base}/api/auth/session`,{headers:{Cookie:cookie}})).json();
    assert.equal(session.authenticated,true);
    assert.equal(session.canEdit,false,'Employees outside the editor list remain viewers');
    assert.equal((await fetch(thumbnail,{headers:{Cookie:cookie}})).status,401);
    const headers={Cookie:cookie,Authorization:'Bearer test-only-token'};
    const image=await fetch(thumbnail,{headers});
    assert.equal(image.status,200);
    assert.equal(image.headers.get('cache-control'),'private, no-store');
    assert.match((await image.json()).dataUrl,/^data:image\/png;base64,/);
    for (const [nextMode,status,shouldCancel] of [['forbidden',404,true],['missing',404,false],['unsafe',404,false],['html',404,true],['large',502,false],['image-forbidden',404,true],['large-header',502,true],['metadata-large-header',502,true]]) {
      const priorCancelled=cancelled;
      mode=nextMode; assert.equal((await fetch(thumbnail,{headers})).status,status,nextMode);
      if (shouldCancel) assert.equal(cancelled,priorCancelled+1,`${nextMode} must release its upstream body`);
    }
    const before=googleCalls;
    assert.equal((await fetch(`${base}/api/brand-assets/thumbnail/invalid!id`,{headers})).status,400);
    assert.equal((await fetch(thumbnail,{method:'POST',headers})).status,405);
    assert.equal(googleCalls,before);
    assert.equal((await fetch(`${base}/api/brand-assets/catalog`,{method:'PUT',headers:{Cookie:cookie,'Content-Type':'application/json'},body:'{}'})).status,403,'CSRF unchanged');
  } finally {
    globalThis.fetch=nativeFetch;
    await new Promise(resolve=>server.close(resolve));
    await fs.rm(dataDir,{recursive:true,force:true});
  }
});
