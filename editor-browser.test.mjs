import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { chromium } from '@playwright/test';
import { createProductionServer } from './server.mjs';

test('TOP logout is visible and works for viewers and editors without granting editing rights', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'editor-browser-'));
  const config = { origin:'https://portal.example.test', clientId:'test-client', clientSecret:'not-a-real-credential', domains:['example.test'], editorEmails:['editor@example.test'], dataDir:root };
  let email, nonce;
  const provider = {
    authorizationUrl(state, value) { nonce=value; return `https://accounts.example.test/login?state=${state}`; },
    async exchangeAndVerify() { return {iss:'https://accounts.google.com',aud:config.clientId,sub:email,email,email_verified:true,hd:'example.test',nonce,exp:Math.floor(Date.now()/1000)+3600}; },
  };
  const server = createProductionServer(config, path.resolve('public'), path.resolve('cms-seed.json'), provider);
  let browser;
  try {
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const base=`http://127.0.0.1:${server.address().port}`;
    browser=await chromium.launch({headless:true});
    for (email of ['viewer@example.test','editor@example.test']) {
      const context=await browser.newContext();
      await context.addInitScript(()=>localStorage.setItem('brand-asset-portal.thumbnail-sign-in-notice-dismissed.v1','true'));
      let failedLogout=true;
      let logoutRequests=0;
      await context.route('**/*', async route=>{
        const request=route.request(), url=new URL(request.url());
        if(url.href==='https://accounts.google.com/gsi/client') { await route.fulfill({status:200,contentType:'text/javascript',body:'window.google={accounts:{oauth2:{initTokenClient(){return {requestAccessToken(){}}}}}};'}); return; }
        if (url.origin==='https://accounts.example.test') {
          await route.fulfill({status:302,headers:{location:`${config.origin}/api/auth/google/callback?code=test-code&state=${url.searchParams.get('state')}`}});
          return;
        }
        if (url.origin!==config.origin) { await route.abort(); return; }
        if (url.pathname==='/api/auth/logout') {
          logoutRequests++;
          assert.equal(request.method(),'POST');
          assert.equal(request.headers().origin,config.origin);
          assert.ok(request.headers()['x-csrf-token']);
          if (failedLogout) { await route.fulfill({status:503,json:{error:'test failure'}}); return; }
        }
        try {
          const response=await route.fetch({url:`${base}${url.pathname}${url.search}`,maxRedirects:0});
          if(url.pathname==='/api/brand-assets/catalog' && request.method()==='GET' && response.ok()) {
            const catalog=await response.json();
            // Simulate a saved catalogue whose order differs from the requested sidebar.
            catalog.products=catalog.products.map((product,index)=>({...product,order:99-index})).reverse();
            await route.fulfill({response,json:catalog});
            return;
          }
          await route.fulfill({response});
        } catch (error) {
          if (!/closed|aborted|cancelled|interrupted/i.test(String(error))) throw error;
        }
      });
      const page=await context.newPage();
      const { expect }=await import('@playwright/test');
      await page.goto(`${config.origin}/brand-asset-portal/index.html`);
      // Aegis Header renders a layout container, not a semantic <header>.
      const header=page;
      await expect(header.getByRole('button',{name:'会社のGoogleアカウントでログイン',exact:true})).toBeVisible();
      await expect(header.getByRole('button',{name:'ログアウト',exact:true})).toHaveCount(0);
      // Complete real server-side OAuth handling with the fake provider, then
      // install its genuine Secure/HttpOnly session cookie on the HTTPS test origin.
      const start=await fetch(`${base}/api/auth/google/start`,{redirect:'manual'});
      const state=new URL(start.headers.get('location')).searchParams.get('state');
      const callback=await fetch(`${base}/api/auth/google/callback?code=test-code&state=${state}`,{redirect:'manual',headers:{Cookie:start.headers.getSetCookie()[0].split(';')[0]}});
      assert.equal(callback.status,302);
      const sessionCookie=callback.headers.getSetCookie().find(value=>value.startsWith('__Host-brand_cms_session=')).split(';')[0];
      const separator=sessionCookie.indexOf('=');
      await context.addCookies([{name:sessionCookie.slice(0,separator),value:sessionCookie.slice(separator+1),url:config.origin,secure:true,httpOnly:true,sameSite:'Lax'}]);
      await page.reload();
      await expect(header.getByRole('button',{name:'ログアウト',exact:true})).toBeVisible();
      await expect(header.getByRole('button',{name:'アセット管理',exact:true})).toHaveCount(email.startsWith('editor')?1:0);
      const expected=['LegalOn','GovernOn','DocumentOn','TrustOn','WorkOn','DealOn','LearningOn','On Technologies','全社共通'];
      await expect.poll(()=>page.getByRole('checkbox').evaluateAll((inputs,labels)=>inputs.map(input=>input.parentElement.innerText.split('\n')[0]).filter(label=>labels.includes(label)),expected)).toEqual(expected);
      await page.getByPlaceholder(/例.*ロゴ/).fill('TrustOn POTX');
      await page.getByRole('checkbox',{name:/TrustOn/}).locator('..').click();
      await page.getByRole('checkbox',{name:'PPT',exact:true}).locator('..').click();
      await expect(page.getByText('TrustOn PowerPoint Template',{exact:true})).toBeVisible();
      await expect(page.getByText('1件の結果',{exact:true})).toBeVisible();
      if(email.startsWith('editor')) {
        await page.getByRole('button',{name:'アセット管理',exact:true}).click();
        await page.getByRole('button',{name:'アセットを登録',exact:true}).click();
        const productSelect=page.getByRole('combobox').first();
        await productSelect.click();
        await expect.poll(async()=> (await page.getByRole('option').allTextContents()).map(label=>label.trim())).toEqual(expected);
        await page.getByRole('option',{name:'TrustOn',exact:true}).click();
        await expect(productSelect).toHaveText('TrustOn');
        await page.getByRole('button',{name:'キャンセル',exact:true}).click();
        await page.getByRole('button',{name:'ポータルへ戻る',exact:true}).click();
      }
      await header.getByRole('button',{name:'ログアウト',exact:true}).click();
      await expect.poll(()=>logoutRequests).toBe(1);
      await expect(header.getByRole('button',{name:'ログアウト',exact:true})).toBeVisible();
      failedLogout=false;
      await header.getByRole('button',{name:'ログアウト',exact:true}).click();
      await expect(header.getByRole('button',{name:'ログアウト',exact:true})).toHaveCount(0);
      await expect(header.getByRole('button',{name:'会社のGoogleアカウントでログイン',exact:true})).toBeVisible();
      assert.equal(logoutRequests,2);
      assert.equal((await page.evaluate(async()=> (await fetch('/api/auth/session')).json())).authenticated,false);
      await context.close();
    }
  } finally {
    await browser?.close();
    server.closeAllConnections();
    await new Promise(resolve=>server.close(resolve));
    await fs.rm(root,{recursive:true,force:true});
  }
});
