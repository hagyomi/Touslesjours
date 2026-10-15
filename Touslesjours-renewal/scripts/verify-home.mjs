import { writeFile, mkdir, readFile, stat } from 'node:fs/promises';

const targets = await fetch('http://127.0.0.1:9333/json').then(r => r.json());
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let sequence = 0;
const requests = new Map();
const errors = [];
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
  if (message.id) { const pending = requests.get(message.id); requests.delete(message.id); message.error ? pending.reject(message.error) : pending.resolve(message.result); }
});
function send(method, params = {}) { return new Promise((resolve, reject) => { const id = ++sequence; requests.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); }); }
async function evaluate(expression) { const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails)); return result.result.value; }
async function settle() { await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))'); }
function assert(condition, message) { if (!condition) throw new Error(message); }
await mkdir('artifacts', { recursive: true });
await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
await evaluate(`new Promise((resolve,reject) => { const timeout = setTimeout(() => { clearInterval(timer); reject(new Error('React page did not load within 15 seconds')); },15000); const timer = setInterval(() => { if (document.querySelector('.store')) { clearInterval(timer); clearTimeout(timeout); resolve(true); } }, 100); })`);
await evaluate(`(async () => { document.querySelectorAll('img').forEach(img => img.loading = 'eager'); await document.fonts.ready; await Promise.all(Array.from(document.images, img => img.decode().catch(() => {}))); return true; })()`);
const report = { desktop: await evaluate(`({ width: innerWidth, pageWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, images: Array.from(document.images, img => ({ src: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0, width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height })), sections: Array.from(document.querySelectorAll('main > section,header,footer'), el => ({ name: el.className, top: el.getBoundingClientRect().top, height: el.getBoundingClientRect().height })) })`) };
const manifest = JSON.parse(await readFile('scripts/figma-assets.json','utf8'));
for (const asset of manifest) {
  assert((await stat(`public/images/figma/${asset.file}`)).size > 0, `Empty asset: ${asset.file}`);
  assert(report.desktop.images.some(img => img.src === `/images/figma/${asset.file}` && img.width > 0 && img.height > 0), `Missing design slot: ${asset.file}`);
}
assert(report.desktop.images.every(img => img.loaded), 'A design asset did not load');
assert(report.desktop.pageWidth <= 1920, `Desktop horizontal overflow: ${report.desktop.pageWidth}`);
const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1920, height: report.desktop.height, scale: 1 } });
await writeFile('artifacts/home-desktop.png', Buffer.from(screenshot.data, 'base64'));
for (const section of report.desktop.sections.filter(item => ['header', 'gift', 'story', 'store'].includes(item.name))) {
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: section.top, width: 1920, height: section.name === 'header' ? 923 : section.height, scale: .65 } });
  await writeFile(`artifacts/${section.name}-desktop.png`, Buffer.from(shot.data, 'base64'));
}
await evaluate(`document.querySelector('#menu-tab-0').click()`);
await settle();
assert(await evaluate(`document.querySelectorAll('.menu__grid > .menu__item').length === 8`), 'Bread tab failed');
await evaluate(`document.querySelector('#menu-tab-0').click()`);
await settle();
await evaluate(`document.querySelector('.menu-card__button').click()`);
await settle();
assert(await evaluate(`document.querySelector('dialog').open && document.querySelector('#detail-title').textContent === '쌀맛나는 케이크'`), 'Product detail failed');
await evaluate(`document.querySelector('.detail-dialog__close').click()`);
await settle();
await evaluate(`Array.from(document.querySelectorAll('.header__link')).find(el => el.textContent === 'Search').click()`);
await settle();
await evaluate(`const input = document.querySelector('input[type=search]'); const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(input, '흑임자'); input.dispatchEvent(new Event('input', { bubbles: true }));`);
await evaluate(`new Promise(resolve => setTimeout(resolve, 100))`);
assert(await evaluate(`document.querySelectorAll('.detail-dialog__results button').length === 1`), 'Search filter failed');
await evaluate(`document.querySelector('.detail-dialog__close').click()`);
await settle();
await evaluate(`document.querySelector('.gift__card--1').click()`);
await settle();
assert(await evaluate(`document.querySelectorAll('.detail-dialog__results button').length === 2`), 'Gift collection failed');
await evaluate(`document.querySelector('.detail-dialog__close').click()`);
await settle();
await evaluate(`document.querySelector('.event__card').click()`);
await settle();
assert(await evaluate(`document.querySelector('dialog').open && document.querySelector('#detail-title').textContent.includes('네이버페이')`), 'Event detail failed');
await send('Input.dispatchKeyEvent',{ type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27 });
await send('Input.dispatchKeyEvent',{ type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27 });
await settle();
assert(await evaluate(`!document.querySelector('dialog')`),'Escape dismissal failed');
await evaluate(`document.querySelector('.picks__controls button:last-child').click()`);
await evaluate(`new Promise(resolve=>setTimeout(resolve,600))`);
assert(await evaluate(`document.querySelector('.picks__track').swiper.realIndex === 1`),'Picks navigation failed');
for (let index = 0; index < 5; index++) {
  await evaluate(`document.querySelector('.picks__controls button:last-child').click()`);
  await evaluate(`new Promise(resolve=>setTimeout(resolve,600))`);
}
assert(await evaluate(`document.querySelector('.picks__track').swiper.realIndex === 0`),'Picks forward loop failed');
await evaluate(`document.querySelector('.picks__controls button:first-child').click()`);
await evaluate(`new Promise(resolve=>setTimeout(resolve,600))`);
assert(await evaluate(`document.querySelector('.picks__track').swiper.realIndex === 5`),'Picks backward loop failed');
report.mobile = [];
for (const width of [375, 390, 767, 768, 1023, 1024, 1440]) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
  const metrics = await evaluate(`({ width: innerWidth, pageWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight })`);
  assert(metrics.pageWidth <= width, `Horizontal overflow at ${width}px: ${metrics.pageWidth}`);
  report.mobile.push(metrics);
  if (width === 390) { const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: metrics.height, scale: 1 } }); await writeFile('artifacts/home-mobile.png', Buffer.from(shot.data, 'base64')); }
}
assert(errors.length === 0, 'Browser runtime error');
report.interactions = ['category tabs', 'product detail', 'search filter', 'gift collection', 'event detail', 'Escape dismissal', 'picks navigation'];
report.errors = errors;
await writeFile('artifacts/verification.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ sections: report.desktop.sections, imageCount: report.desktop.images.length, widths: report.mobile, interactions: report.interactions, errors }));
ws.close();
