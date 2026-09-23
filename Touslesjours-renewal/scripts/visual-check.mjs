import {chromium} from '@playwright/test';import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
await fs.mkdir('artifacts',{recursive:true});
await page.goto('http://127.0.0.1:5173/');
await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await document.fonts.ready;});
await page.screenshot({path:'artifacts/home-desktop.png',fullPage:true});
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/home-mobile.png',fullPage:true});
await page.goto('http://127.0.0.1:5173/login');await page.getByRole('button',{name:'테스트 계정으로 로그인',exact:true}).click();await page.waitForURL('**/mypage');await page.goto('http://127.0.0.1:5173/mypage/profile');await page.getByRole('button',{name:'주소 검색',exact:true}).click();
try{await page.locator('.address-search__embed iframe').waitFor({timeout:20000});console.log('Live Kakao postcode iframe: loaded');await page.screenshot({path:'artifacts/postcode-mobile.png',fullPage:true});console.log('Frames:',page.frames().map(f=>f.url()));}catch{console.log('Live Kakao postcode:',await page.locator('.field__error').allTextContents());}
await browser.close();

