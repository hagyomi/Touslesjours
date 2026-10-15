import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:5173';
const stage = process.argv[2] || 'after';
const target = await fetch('http://127.0.0.1:9333/json/new?about:blank', { method: 'PUT' }).then(r => r.json());
const ws = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const errors = [];
let sequence = 0;
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
  const request = pending.get(message.id);
  if (request) {
    pending.delete(message.id);
    clearTimeout(request.timeout);
    message.error ? request.reject(new Error(JSON.stringify(message.error))) : request.resolve(message.result);
  }
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 20000);
    pending.set(id, { resolve, reject, timeout });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const report = { stage, screens: [], interactions: [], errors };
const waitForDialogClose = () => evaluate(`new Promise((resolve, reject) => { const start = Date.now(); const timer = setInterval(() => { if (!document.querySelector('dialog[open]')) { clearInterval(timer); resolve(); } else if (Date.now() - start > 3000) { clearInterval(timer); reject(new Error('Dialog did not close')); } }, 20); })`);
try {
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await mkdir('artifacts', { recursive: true });
  for (const path of ['/', '/menu', '/menu/products', '/login']) {
    await send('Page.navigate', { url: `${base}${path}` });
    await evaluate(`new Promise((resolve, reject) => { const start = Date.now(); const timer = setInterval(() => { if (document.querySelector('main') && location.pathname === ${JSON.stringify(path)}) { clearInterval(timer); resolve(); } else if (Date.now() - start > 10000) { clearInterval(timer); reject(new Error('Page did not render')); } }, 50); })`);
    await evaluate(`(async () => { document.querySelectorAll('img').forEach(img => img.loading = 'eager'); await document.fonts.ready; await Promise.all([...document.images].map(img => img.decode().catch(() => {}))); })()`);
    for (const width of [320, 375, 390, 768, 960, 1024, 1280, 1440, 1920]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1080, deviceScaleFactor: 1, mobile: false });
      await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
      const metrics = await evaluate(`({ path: location.pathname, width: innerWidth, pageWidth: document.documentElement.scrollWidth, images: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.getAttribute('src')), sections: [...document.querySelectorAll('header, main > section, footer')].map(el => {const r=el.getBoundingClientRect(); return {name:el.className,x:r.x,y:r.y,width:r.width,height:r.height};}), overflow: [...document.querySelectorAll('body *')].filter(el => {const r=el.getBoundingClientRect(); const s=getComputedStyle(el); return r.width>0 && r.right>innerWidth+1 && s.position!=='absolute' && !el.closest('.picks__track,.menu__tabs');}).slice(0,15).map(el => el.className), styles: [...document.querySelectorAll('.hero__title,.hero__description,.gift__title,.gift-card__title,.event-card__title,.store__arch-glyph,.footer__middle p')].map(el=> {const s=getComputedStyle(el);const r=el.getBoundingClientRect();return {class:el.className,text:el.textContent,font:s.font,color:s.color,transform:s.transform,x:r.x,y:r.y,width:r.width,height:r.height};}) })`);
      report.screens.push(metrics);
      if (stage !== 'before') {
        const viewportWidth = await evaluate('document.documentElement.clientWidth');
        assert.ok(metrics.pageWidth <= viewportWidth, `${path} overflows at ${width}px: ${metrics.pageWidth} > ${viewportWidth}`);
        assert.deepEqual(metrics.images, [], `${path} has broken images`);
      }
      if (path === '/' && [390, 1920].includes(width)) {
        const height = await evaluate('document.documentElement.scrollHeight');
        const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height, scale: 1 } });
        await writeFile(`artifacts/css-audit-${stage}-${width}.png`, Buffer.from(shot.data, 'base64'));
        for (const selector of ['.hero', '.gift', '.store', '.footer']) {
          const clip = await evaluate(`(() => { const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return {x:0,y:r.top+scrollY,width:innerWidth,height:Math.min(r.height,1200),scale:1}; })()`);
          const section = await send('Page.captureScreenshot', { format:'png',captureBeyondViewport:true,clip });
          await writeFile(`artifacts/css-audit-${stage}-${width}-${selector.slice(1)}.png`, Buffer.from(section.data,'base64'));
        }
      }
    }
    if (stage === 'before') continue;
    if (path === '/' || path === '/menu') {
      await evaluate(`document.querySelector('#menu-tab-0').focus(); document.querySelector('#menu-tab-0').dispatchEvent(new KeyboardEvent('keydown', {key:'ArrowRight',bubbles:true}));`);
      assert.equal(await evaluate(`document.activeElement.id`), 'menu-tab-1');
      await evaluate(`document.querySelector('#menu-tab-0').click(); document.querySelector('.menu-card__button').click();`);
      assert.ok(await evaluate(`document.querySelector('dialog').open`));
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
      await waitForDialogClose();
      assert.ok(await evaluate(`!document.querySelector('dialog')`));
      await evaluate(`document.querySelector('button.header__link').click()`);
      assert.ok(await evaluate(`document.querySelector('dialog input[type=search]') !== null`));
      await evaluate(`document.querySelector('.detail-dialog__close').click()`);
      await waitForDialogClose();
      report.interactions.push(`${path}: keyboard tabs, product dialog, Escape, search`);
    }
    if (path === '/') {
      await evaluate(`document.querySelector('.gift__card').click()`);
      assert.ok(await evaluate(`document.querySelector('dialog').open`));
      await evaluate(`document.querySelector('.detail-dialog__close').click()`);
      await waitForDialogClose();
      await evaluate(`document.querySelector('.event__card').click()`);
      assert.ok(await evaluate(`document.querySelector('dialog').open`));
      await evaluate(`document.querySelector('.detail-dialog__close').click()`);
      await waitForDialogClose();
      await evaluate(`document.querySelector('.picks__controls button:last-child').click()`);
      await evaluate(`new Promise(resolve => setTimeout(resolve, 600))`);
      assert.ok(await evaluate(`document.querySelector('.picks__viewport').scrollLeft > 0`));
      report.interactions.push('home: gift and event dialogs, picks scroll');
    }
    if (path === '/login') {
      await evaluate(`document.querySelector('.login-card__form button:last-child').click()`);
      assert.ok(await evaluate(`document.querySelector('.login-card__success') !== null`));
      report.interactions.push('login: demo login');
    }
  }
  if (stage !== 'before') {
    for (const name of ['button', 'card', 'menucard', 'pickcard', 'giftcard', 'eventcard']) {
      await send('Page.navigate', { url: `${base}/${name}-preview.html` });
      await evaluate(`new Promise((resolve,reject)=>{const start=Date.now();const timer=setInterval(()=>{if(document.querySelector('#root')?.children.length){clearInterval(timer);resolve();}else if(Date.now()-start>10000){clearInterval(timer);reject(new Error('Preview did not render'));}},50);})`);
      const broken = await evaluate(`(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));return [...document.images].filter(img=>!img.complete||!img.naturalWidth).map(img=>img.getAttribute('src'));})()`);
      assert.deepEqual(broken, [], `${name} preview has broken images`);
      report.interactions.push(`${name}: preview rendered with assets`);
    }
    await send('Page.navigate', { url: `${base}/` });
    await evaluate(`new Promise(resolve=>{const timer=setInterval(()=>{if(document.querySelector('.hero__photo--visible')){clearInterval(timer);resolve();}},50);})`);
    await evaluate(`(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));})()`);
    await send('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion',value:'no-preference' }] });
    const initialPhoto = await evaluate(`document.querySelector('.hero__photo--visible').getAttribute('src')`);
    await evaluate(`new Promise(resolve=>setTimeout(resolve,3300))`);
    assert.notEqual(await evaluate(`document.querySelector('.hero__photo--visible').getAttribute('src')`),initialPhoto,'Hero carousel did not advance');
    assert.notEqual(await evaluate(`getComputedStyle(document.querySelector('.hero__character')).transform`),'none','Hero scroll motion not initialized');
    await evaluate(`document.querySelector('.gift').scrollIntoView()`);
    await evaluate(`new Promise(resolve=>setTimeout(resolve,300))`);
    assert.notEqual(await evaluate(`getComputedStyle(document.querySelector('.gift__decoration--5')).transform`),'none','Gift leaf motion not initialized');
    report.interactions.push('normal motion: hero carousel, character and gift leaf transforms');
  }
  assert.deepEqual(errors, [], 'Browser runtime exceptions');
  console.log(JSON.stringify({ screens: report.screens.length, overflows: report.screens.filter(s => s.pageWidth > s.width).map(s => ({path:s.path,width:s.width,pageWidth:s.pageWidth,overflow:s.overflow})), interactions: report.interactions, errors }));
} finally {
  await writeFile(`artifacts/css-audit-${stage}.json`, JSON.stringify(report, null, 2));
  ws.close();
  await fetch(`http://127.0.0.1:9333/json/close/${target.id}`);
}
