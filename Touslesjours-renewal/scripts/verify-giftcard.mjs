import { writeFile } from 'node:fs/promises';

const targets = await fetch('http://127.0.0.1:9333/json').then(r => r.json());
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  if (data.id) { const request = pending.get(data.id); pending.delete(data.id); data.error ? request.reject(data.error) : request.resolve(data.result); }
});
const send = (method, params = {}) => new Promise((resolve, reject) => { pending.set(++id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
await send('Page.enable');
await send('Page.navigate', { url: 'http://127.0.0.1:5175/giftcard-preview.html' });
const result = await send('Runtime.evaluate', { expression: `(async () => {
  for (let i = 0; i < 100 && !document.querySelector('.gift-card'); i++) await new Promise(r => setTimeout(r, 100));
  await document.fonts.ready;
  await document.querySelector('.gift-card__arrow').decode();
  const card = document.querySelector('.gift-card').getBoundingClientRect();
  const arrow = document.querySelector('.gift-card__arrow').getBoundingClientRect();
  return { width: card.width, height: card.height, arrowWidth: arrow.width, arrowHeight: arrow.height, arrowTop: arrow.top - card.top, arrowLeft: arrow.left - card.left, lines: document.querySelectorAll('.gift-card__description > span').length };
})()`, awaitPromise: true, returnByValue: true });
if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
const metrics = result.result.value;
if (Math.abs(metrics.width - 365.504) > .02 || metrics.height !== 273 || metrics.arrowWidth !== 32 || metrics.arrowHeight !== 32 || metrics.arrowTop !== 17 || Math.abs(metrics.arrowLeft - 309) > .02 || metrics.lines !== 4) throw new Error(JSON.stringify(metrics));
const screenshot = await send('Page.captureScreenshot', { format: 'png' });
await writeFile('artifacts/giftcard-preview.png', Buffer.from(screenshot.data, 'base64'));
console.log(JSON.stringify(metrics));
ws.close();
