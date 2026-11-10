import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const base = (process.env.VERIFY_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const debug = `http://127.0.0.1:${process.env.VERIFY_DEBUG_PORT || 9333}`;
const stage = process.argv[2] || 'check';
assert.ok(['before', 'after', 'check'].includes(stage));
const target = await fetch(`${debug}/json/new?about:blank`, { method: 'PUT' }).then(response => response.json());
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
let sequence = 0;
const pending = new Map();
const errors = [];
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  clearTimeout(request.timeout);
  message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
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
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function ready(selector) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(`!!document.querySelector(${JSON.stringify(selector)})`)) return;
    await wait(100);
  }
  throw new Error(`Missing ${selector}`);
}
const report = { frames: [], interactions: [] };
try {
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const [route, selector] of [['/', '.home'], ['/menu', '.menu-page'], ['/menu/products', '.menu-page'], ['/login', '.login-card'], ['/store', '.store-finder']]) {
    for (const width of [375, 390, 767, 768, 1023, 1024, 1440, 1920]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: `${base}${route}` });
      await ready(selector);
      await evaluate(`(async () => { await document.fonts.ready; document.querySelectorAll('img').forEach(img => img.loading = 'eager'); await Promise.all(Array.from(document.images, img => img.decode().catch(() => {}))); })()`);
      await wait(100);
      const frame = await evaluate(`(() => {
        const selectors = ['.header','.header__list','.hero__title','.hero__description','.gift__title','.gift__description','.gift__cake-art img','.gift__roll-art img','.gift__set-art img','.store__title','.store__description','.menu-card','.menu-card__title','.login-card__form input','.login-card__button','.store-finder__search','.store-finder__item','.store-finder__details'];
        const properties = ['display','position','width','height','margin','padding','border','border-radius','background-color','color','font-family','font-size','font-weight','line-height','text-align','gap','overflow'];
        return { width: innerWidth, pageWidth: document.documentElement.scrollWidth, styles: Object.fromEntries(selectors.map(selector => [selector, Array.from(document.querySelectorAll(selector), el => { const css = getComputedStyle(el); return Object.fromEntries(properties.map(property => [property, css.getPropertyValue(property)])); })])) };
      })()`);
      assert.ok(frame.pageWidth <= width, `${route}: overflow at ${width}px (${frame.pageWidth})`);
      const broken = await evaluate(`Array.from(document.images).filter(img => !img.complete || !img.naturalWidth).map(img => img.getAttribute('src'))`);
      assert.deepEqual(broken, [], `${route}: broken images`);
      report.frames.push({ route, ...frame });
    }
  }
  assert.equal(await evaluate(`document.querySelector('.header__link[aria-current=page]').textContent`), 'Store');
  await evaluate(`(() => { const input = document.querySelector('.store-finder__keyword input'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'마포'); input.dispatchEvent(new Event('input',{bubbles:true})); })()`);
  await wait(100);
  await evaluate(`document.querySelector('.store-finder__search').requestSubmit()`);
  await wait(100);
  assert.equal(await evaluate(`document.querySelectorAll('.store-finder__item').length`), 1);
  await evaluate(`document.querySelector('.store-finder__reset').click()`);
  await wait(100);
  assert.equal(await evaluate(`document.querySelectorAll('.store-finder__item').length`), 6);
  report.interactions.push('store search and reset');
  await send('Page.navigate', { url: `${base}/login` });
  await ready('.login-card');
  await evaluate(`document.querySelector('.login-card__form button[type=button]').click()`);
  await ready('.login-card__success');
  report.interactions.push('test login');
  await send('Page.navigate', { url: `${base}/menu` });
  await ready('.menu__tab');
  await evaluate(`document.querySelector('#menu-tab-1').click()`);
  await wait(100);
  assert.equal(await evaluate(`document.querySelector('#menu-tab-1').getAttribute('aria-selected')`), 'true');
  await evaluate(`document.querySelector('.menu-card__button').click()`);
  await ready('dialog[open]');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await wait(200);
  assert.equal(await evaluate(`!!document.querySelector('dialog[open]')`), false);
  report.interactions.push('menu category, modal and Escape');
  await evaluate(`window.scrollTo({ top: 700, behavior: 'instant' })`);
  await ready('.scroll-to-top');
  await evaluate(`document.querySelector('.scroll-to-top').click()`);
  await wait(100);
  assert.equal(await evaluate('window.scrollY'), 0);
  report.interactions.push('scroll to top');
  await send('Page.navigate', { url: `${base}/` });
  await ready('.home');
  for (let category = 0; category < 6; category++) {
    await evaluate(`document.querySelector('#menu-tab-${category}').click()`);
    await wait(100);
    assert.equal(await evaluate(`document.querySelectorAll('.menu__item').length`), 8);
  }
  await evaluate(`Array.from(document.querySelectorAll('.header__link')).find(el => el.textContent === 'Search').click()`);
  await ready('input[type=search]');
  await evaluate(`(() => { const input = document.querySelector('input[type=search]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'no-such-product-123'); input.dispatchEvent(new Event('input',{bubbles:true})); })()`);
  await wait(100);
  assert.equal(await evaluate(`document.querySelectorAll('.detail-dialog__results button').length`), 0);
  await evaluate(`document.querySelector('.detail-dialog__close').click()`);
  await wait(100);
  for (let index = 0; index < 3; index++) {
    await evaluate(`document.querySelector('.gift__card--${index}').click()`);
    await ready('.detail-dialog__products');
    assert.ok(await evaluate(`document.querySelectorAll('.detail-dialog__products .menu-card').length > 0`));
    await evaluate(`document.querySelector('.detail-dialog__close').click()`);
    await wait(100);
  }
  for (let index = 0; index < 4; index++) {
    await evaluate(`document.querySelectorAll('.event__card')[${index}].click()`);
    await ready('dialog[open]');
    await evaluate(`document.querySelector('.detail-dialog__close').click()`);
    await wait(100);
  }
  assert.equal(await evaluate(`document.querySelector('.event__more .button').tagName`), 'BUTTON');
  assert.equal(await evaluate(`document.querySelector('.store .button').getAttribute('href')`), '/store');
  assert.equal(await evaluate(`Array.from(document.querySelectorAll('.header__link')).some(el => el.textContent === 'Membership')`), false);
  report.interactions.push('all categories, empty search, gift collections, events and internal store link');

  // Preview entry files are under the child project, not the Vite root.
  const sourceHtml = await fetch(`${base}/`).then(response => response.text());
  const previewPrefix = sourceHtml.match(/src="([^"]+)\/src\/js\/main\.js"/)?.[1];
  assert.ok(previewPrefix, 'Cannot locate preview directory');
  for (const name of ['button', 'card', 'menucard', 'pickcard', 'giftcard', 'eventcard']) {
    await send('Page.navigate', { url: `${base}${previewPrefix}/${name}-preview.html` });
    await ready(`#root .${({ button: 'button', card: 'card', menucard: 'menu-card', pickcard: 'pick-card', giftcard: 'gift-card', eventcard: 'event-card' })[name]}`);
    await evaluate(`Promise.all(Array.from(document.images, img => img.decode().catch(() => {})))`);
    assert.deepEqual(await evaluate(`Array.from(document.images).filter(img => !img.naturalWidth).map(img => img.src)`), []);
  }
  report.interactions.push('six component preview entries');

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: `${base}/` });
  await ready('.picks--pinned');
  await evaluate('document.fonts.ready');
  await wait(500);
  const beforePick = await evaluate(`new DOMMatrix(getComputedStyle(document.querySelector('.picks__track')).transform).m41`);
  await evaluate(`document.querySelector('.picks__controls button:last-child').click()`);
  await wait(1800);
  const afterPick = await evaluate(`new DOMMatrix(getComputedStyle(document.querySelector('.picks__track')).transform).m41`);
  assert.ok(afterPick < beforePick - 10, 'Normal motion Picks navigation did not move');
  report.interactions.push('normal motion GSAP pin and Picks navigation');

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await mkdir('artifacts', { recursive: true });
  for (const [name, route, selector] of [['home', '/', '.home'], ['menu', '/menu', '.menu-page'], ['login', '/login', '.login-card'], ['store', '/store', '.store-finder']]) {
    for (const [device, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 900]]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: `${base}${route}` });
      await ready(selector);
      await evaluate(`(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images, img => img.decode().catch(() => {}))); })()`);
      await wait(150);
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      await writeFile(`artifacts/review-${name}-${device}.png`, Buffer.from(shot.data, 'base64'));
    }
  }
  assert.deepEqual(errors, [], 'Browser runtime errors');
  if (stage === 'after') {
    const before = JSON.parse(await readFile('artifacts/layout-before.json', 'utf8'));
    assert.deepEqual(report.frames, before.frames, 'Computed layout changed');
  }
  await mkdir('artifacts', { recursive: true });
  await writeFile(`artifacts/layout-${stage}.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ stage, frames: report.frames.length, interactions: report.interactions, runtimeErrors: errors.length }));
} finally {
  ws.close();
  await fetch(`${debug}/json/close/${target.id}`);
}
