import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { chromium } from '@playwright/test';
import { createProductionServer } from './server.mjs';

// Synthetic CMS records for the two Drive originals identified by the user.
// The saved titles, CMS IDs, grouping IDs and categories intentionally differ.
const mapAssets = [
  {id:'test-world-map-ai',title:'202610_WorldMap_ver1.1.ai',assetGroupId:'separate-ai',brand:'LegalOn',fileFormat:'AI',assetType:'その他',driveId:'1HqgEQBCfFBTjuBQvlb4PTV72y4uY119E'},
  {id:'test-world-map-png',title:'Global Map',assetGroupId:'separate-png',brand:'Shared',fileFormat:'PNG',assetType:'図表',driveId:'14XR2usJdmPEQUcNVySFyiP6FMeMWxwU8'},
].map(asset=>({...asset,status:'current',publication:'published',assetDomain:asset.fileFormat==='AI'?'brand':'corporate',updatedAt:'2026-11-16',tags:['地図'],driveUrl:`https://drive.google.com/file/d/${asset.driveId}/view`}));

test('viewers and editors retain product order, WorldMap format selection and TOP logout', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'editor-browser-'));
  const config = { origin:'https://portal.example.test', clientId:'test-client', clientSecret:'not-a-real-credential', domains:['example.test'], editorEmails:['editor@example.test'], dataDir:root };
  let email, nonce;
  const provider = {
    authorizationUrl(state, value) { nonce=value; return `https://accounts.example.test/login?state=${state}`; },
    async exchangeAndVerify() { return {iss:'https://accounts.google.com',aud:config.clientId,sub:email,email,email_verified:true,hd:'example.test',nonce,exp:Math.floor(Date.now()/1000)+3600}; },
  };
  const seed=JSON.parse(await fs.readFile('cms-seed.json','utf8'));
  const products=['LegalOn','GovernOn','WorkOn','DealOn','LearningOn','DocumentOn','TrustOn','On Technologies','Shared'].map((id,order)=>({id,label:id==='Shared'?'全社共通':id,state:'active',order}));
  await fs.writeFile(path.join(root,'catalog.json'),JSON.stringify({revision:0,products,assets:[...seed,{...mapAssets[1],id:'test-private-draft',driveId:'private-draft',driveUrl:'https://drive.google.com/file/d/private-draft/view',title:'Private draft remains intact',publication:'draft'}],appliedSeedUpdates:['truston-drive-2026-10-09','truston-potx-template-2026-11-16']}));
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
      let failSearch=false;
      let logoutRequests=0;
      let mapCase='both';
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
        if(url.pathname==='/api/brand-assets/search' && failSearch) { await route.fulfill({status:503,json:{error:'test read failure'}}); return; }
        try {
          // The HTTPS test bridge can reuse a loopback socket closed by Node.
          // Retry ECONNRESET only for reads, never assertions, HTTP errors or writes.
          const response=await route.fetch({url:`${base}${url.pathname}${url.search}`,maxRedirects:0,maxRetries:request.method()==='GET'?2:0});
          if(url.pathname==='/api/brand-assets/search' && request.method()==='GET' && response.ok()) {
            const catalog=await response.json();
            // Simulate a saved catalogue whose order differs from the requested sidebar.
            catalog.products=catalog.products.map((product,index)=>({...product,order:99-index})).reverse();
            // Replace shipped map seed records with these edited CMS fixtures.
            catalog.assets=catalog.assets.filter(asset=>!mapAssets.some(map=>map.driveId===asset.driveId));
            catalog.assets.push(...mapAssets.filter(asset=>mapCase!=='png-only'||asset.fileFormat==='PNG').map(asset=>mapCase==='draft-ai'&&asset.fileFormat==='AI'?{...asset,publication:'draft'}:asset));
            if(mapCase==='with-unrelated') catalog.assets.push({...mapAssets[1],id:'test-unrelated-map',title:'Different Map',driveId:'another-map-version',driveUrl:'https://drive.google.com/file/d/another-map-version/view'});
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
      // No bundled snapshot is visible before company authentication.
      await expect(page.getByPlaceholder(/例.*ロゴ/)).toHaveCount(0);
      await expect(page.getByText('Global Map',{exact:true})).toHaveCount(0);
      assert.deepEqual(await page.evaluate(async()=>{
        const session=await(await fetch('/api/auth/session')).json();
        return {authenticated:session.authenticated,canEdit:session.canEdit,catalogueStatus:(await fetch('/api/brand-assets/catalog')).status,searchStatus:(await fetch('/api/brand-assets/search')).status};
      }),{authenticated:false,canEdit:false,catalogueStatus:401,searchStatus:401});
      await page.reload();
      await expect(header.getByRole('button',{name:'会社のGoogleアカウントでログイン',exact:true})).toBeVisible();
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
      await expect(page.getByRole('combobox',{name:'領域',exact:true})).toHaveText('すべて');
      const search=page.getByPlaceholder(/例.*ロゴ/);
      await search.fill('地図');
      await expect(page.getByText('1件の結果',{exact:true})).toBeVisible();
      await expect(page.getByText('Global Map',{exact:true})).toHaveCount(1);
      await page.getByText('Global Map',{exact:true}).click();
      const dialog=page.getByRole('dialog');
      const formats=dialog.getByRole('combobox');
      await expect(formats).toHaveText(/^PNG/);
      await page.evaluate(()=>{
        window.testMapDownloads=[]; window.testMapOpens=[];
        HTMLAnchorElement.prototype.click=function(){window.testMapDownloads.push({url:this.href,name:this.download});};
        window.open=(url)=>{window.testMapOpens.push(String(url));return null;};
      });
      for(const [format,driveId] of [['AI',mapAssets[0].driveId],['PNG',mapAssets[1].driveId]]) {
        await formats.click();
        await expect.poll(async()=> (await page.getByRole('option').allTextContents()).map(text=>text.trim().split(' · ')[0])).toEqual(['AI','PNG']);
        await page.getByRole('option',{name:new RegExp(`^${format} ·`)}).click();
        await expect(formats).toHaveText(new RegExp(`^${format}`));
        await expect(dialog.getByText('Global Map',{exact:true}).first()).toBeVisible();
        await dialog.getByRole('button',{name:'Direct download',exact:true}).click();
        await dialog.getByRole('button',{name:'Open in Google Drive',exact:true}).click();
        const download=await page.evaluate(()=>window.testMapDownloads.at(-1));
        assert.equal(new URL(download.url).searchParams.get('id'),driveId);
        assert.ok(download.name.toLowerCase().endsWith(`.${format.toLowerCase()}`));
        assert.equal(new URL(await page.evaluate(()=>window.testMapOpens.at(-1))).pathname,`/file/d/${driveId}/view`);
      }
      await dialog.getByRole('button',{name:'閉じる',exact:true}).click();
      for(const product of ['LegalOn','全社共通']) {
        const checkbox=page.getByRole('checkbox',{name:new RegExp(`^${product}`)}).locator('..');
        await checkbox.click();
        await expect(page.getByText('1件の結果',{exact:true})).toBeVisible();
        await checkbox.click();
      }
      for(const name of ['ブランド','コーポレート','すべて']) {
        await page.getByRole('combobox',{name:'領域',exact:true}).click();
        await page.getByRole('option',{name,exact:true}).click();
        await expect(page.getByText('1件の結果',{exact:true})).toBeVisible();
      }
      for(const format of ['AI','PNG']) {
        const checkbox=page.getByRole('checkbox',{name:format,exact:true}).locator('..');
        await checkbox.click();
        await expect(page.getByText('1件の結果',{exact:true})).toBeVisible();
        await checkbox.click();
      }
      await search.fill('202610_WorldMap_ver1.1.ai');
      await expect(page.getByText('Global Map',{exact:true})).toHaveCount(1);
      for(mapCase of ['draft-ai','png-only','with-unrelated']) {
        await page.reload();
        await search.fill('地図');
        await expect(page.getByText(`${mapCase==='with-unrelated'?2:1}件の結果`,{exact:true})).toBeVisible();
        await page.getByText('Global Map',{exact:true}).click();
        await formats.click();
        await expect(page.getByRole('option')).toHaveCount(mapCase==='with-unrelated'?2:1);
        await page.keyboard.press('Escape');
        await dialog.getByRole('button',{name:'閉じる',exact:true}).click();
      }
      mapCase='both';
      await page.reload();
      await page.getByPlaceholder(/例.*ロゴ/).fill('TrustOn POTX');
      await page.getByRole('checkbox',{name:/TrustOn/}).locator('..').click();
      await page.getByRole('checkbox',{name:'PPT',exact:true}).locator('..').click();
      await expect(page.getByText('TrustOn PowerPoint Template',{exact:true})).toBeVisible();
      await expect(page.getByText('1件の結果',{exact:true})).toBeVisible();
      failSearch=true;
      await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
      await expect(page.getByText('共有カタログを取得できませんでした',{exact:true})).toBeVisible();
      await expect(page.getByPlaceholder(/例.*ロゴ/)).toHaveCount(0);
      await expect(page.getByText('TrustOn PowerPoint Template',{exact:true})).toHaveCount(0);
      failSearch=false;
      await page.getByRole('button',{name:'再読み込み',exact:true}).click();
      await expect(page.getByText('TrustOn PowerPoint Template',{exact:true})).toBeVisible();
      if(email.startsWith('editor')) {
        await page.getByRole('button',{name:'アセット管理',exact:true}).click();
        await page.getByRole('button',{name:'アセットを登録',exact:true}).click();
        const productSelect=page.getByRole('combobox').first();
        await productSelect.click();
        await expect.poll(async()=> (await page.getByRole('option').allTextContents()).map(label=>label.trim())).toEqual(expected);
        await page.getByRole('option',{name:'TrustOn',exact:true}).click();
        await expect(productSelect).toHaveText('TrustOn');
        await page.getByRole('textbox',{name:/^アセット名/}).fill('Shared UI registration');
        await page.getByRole('textbox',{name:/^Google Driveのファイルリンク/}).fill('https://drive.google.com/file/d/test-ui-shared-asset/view');
        await page.getByRole('combobox',{name:'公開状態',exact:true}).click();
        await page.getByRole('option',{name:'公開',exact:true}).click();
        await page.getByRole('button',{name:'保存して反映',exact:true}).click();
        await expect(page.getByText('保存しました。公開データとフィルターに反映されています。',{exact:true})).toBeVisible();
        const persisted=JSON.parse(await fs.readFile(path.join(root,'catalog.json'),'utf8'));
        assert.ok(persisted.assets.some(asset=>asset.id==='test-private-draft' && asset.publication==='draft'),'UI save must preserve excluded drafts');
        assert.ok(persisted.assets.some(asset=>asset.title==='Shared UI registration' && asset.publication==='published'));
        await page.getByRole('button',{name:'ポータルへ戻る',exact:true}).click();
        await expect(page.getByPlaceholder(/例.*ロゴ/)).toBeVisible();
        await page.getByRole('button',{name:'条件をクリア',exact:true}).first().click();
        await page.getByPlaceholder(/例.*ロゴ/).fill('Shared UI registration');
        await expect(page.getByText('Shared UI registration',{exact:true})).toHaveCount(1);
      }
      if(email.startsWith('editor')) {
        await page.getByRole('button',{name:'アセット管理',exact:true}).click();
        await expect(page.getByRole('button',{name:'最新データを読み込む',exact:true})).toBeVisible();
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
      if(email.startsWith('editor')) await page.getByRole('button',{name:'ポータルへ戻る',exact:true}).click();
      await expect(page.getByPlaceholder(/例.*ロゴ/)).toHaveCount(0);
      await expect(page.getByText('Global Map',{exact:true})).toHaveCount(0);
      await page.reload();
      await expect(header.getByRole('button',{name:'会社のGoogleアカウントでログイン',exact:true})).toBeVisible();
      await expect(page.getByPlaceholder(/例.*ロゴ/)).toHaveCount(0);
      await context.close();
    }
  } finally {
    await browser?.close();
    server.closeAllConnections();
    await new Promise(resolve=>server.close(resolve));
    await fs.rm(root,{recursive:true,force:true});
  }
});
