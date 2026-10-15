import { mkdir, writeFile, stat } from 'node:fs/promises';
import { deliProducts } from '../src/data/deli.js';

const targets = await fetch('http://127.0.0.1:9333/json').then(r => r.json());
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  if (!data.id) return;
  const request = pending.get(data.id);
  pending.delete(data.id);
  data.error ? request.reject(data.error) : request.resolve(data.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  pending.set(++id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params }));
});
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const assert = (value, message) => { if (!value) throw new Error(message); };
try {
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5176/' });
  await evaluate(`(async () => {
    for (let i = 0; i < 100 && !document.querySelector('#menu-tab-2'); i++) await new Promise(r => setTimeout(r, 100));
    document.querySelector('#menu-tab-2').click();
    await new Promise(r => setTimeout(r, 600));
    document.querySelectorAll('.menu img').forEach(img => img.loading = 'eager');
    await document.fonts.ready;
    await Promise.all(Array.from(document.querySelectorAll('.menu img'), img => img.decode()));
  })()`);
  for (const item of deliProducts) assert((await stat('public' + item.image)).size > 0, item.image);
  assert(await evaluate(`!Array.from(document.querySelectorAll('.menu__tab')).some(tab => tab.textContent === 'New') && document.querySelector('.menu__tab[aria-selected="true"]').textContent === 'Deli'`), 'Deli selected and New absent');

  const metrics = await evaluate(`(() => {
    const section = document.querySelector('.menu');
    const rect = section.getBoundingClientRect();
    return { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height,
      cards: Array.from(section.querySelectorAll('.menu-card'), card => {
        const r = card.getBoundingClientRect();
        const img = card.querySelector('.menu-card__image');
        return { title: card.querySelector('h3').textContent, image: img.getAttribute('src'),
          loaded: img.naturalWidth > 0, width: r.width, height: r.height,
          x: r.x - rect.x, y: r.y - rect.y, crop: [img.style.width, img.style.height, img.style.left, img.style.top] };
      }), badge: !!section.querySelector('.menu__cake-badge')?.naturalWidth };
  })()`);
  assert(metrics.cards.length === 8, 'Eight deli items');
  metrics.cards.forEach((card, index) => {
    assert(card.loaded && card.image === deliProducts[index].image && card.title === deliProducts[index].name, 'Deli slot ' + index);
    assert(Math.abs(card.width - 337) < .1 && Math.abs(card.height - 553) < .1, 'Card geometry ' + index);
    assert(Math.abs(card.y - (index < 4 ? 202 : 830)) < .1, 'Card row ' + index);
    assert(card.crop.every((value, i) => Math.abs(parseFloat(value) - deliProducts[index].crop[i]) < .01), 'Crop ' + index);
  });
  await mkdir('artifacts', { recursive: true });
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
    clip: { x: metrics.x, y: metrics.y, width: metrics.width, height: metrics.height, scale: .65 } });
  await writeFile('artifacts/menu-deli-desktop.png', Buffer.from(shot.data, 'base64'));
  await evaluate(`document.querySelector('.menu-card__button').click()`);
  await evaluate(`new Promise(r => setTimeout(r, 600))`);
  assert(await evaluate(`!!document.querySelector('dialog[open]')`), 'Detail dialog');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
  await evaluate(`new Promise(r => setTimeout(r, 600))`);
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const mobile = await evaluate(`({ width: innerWidth, pageWidth: document.documentElement.scrollWidth, cards: document.querySelectorAll('.menu__grid > .menu-card').length, menuWidth: document.querySelector('.menu').getBoundingClientRect().width })`);
  assert(mobile.menuWidth <= mobile.width && mobile.cards === 8, 'Mobile layout: ' + JSON.stringify(mobile));
  console.log(JSON.stringify({ cards: metrics.cards, detail: true, mobile }));
} finally {
  ws.close();
}


