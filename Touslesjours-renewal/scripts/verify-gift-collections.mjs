import { mkdir, writeFile, stat } from 'node:fs/promises';
import { giftMenuProducts } from '../src/data/giftMenu.js';

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
  await send('Page.navigate', { url: 'http://127.0.0.1:5176/' });
  await evaluate(`(async () => { for (let i = 0; i < 100 && !document.querySelector('#gift'); i++) await new Promise(r => setTimeout(r, 100)); })()`);
  const report = [];
  for (const [index, expected] of [77, 7, 22].entries()) {
    await evaluate(`document.querySelector('#gift .gift__card--${index}').click()`);
    await evaluate('new Promise(r => setTimeout(r, 1100))');
    const result = await evaluate(`({ title: document.querySelector('dialog[open] #detail-title').textContent, images: Array.from(document.querySelectorAll('dialog[open] .detail-dialog__results img, dialog[open] .detail-dialog__products .menu-card__image'), img => img.getAttribute('src')) })`);
    assert(result.images.length === expected, 'Collection count: ' + JSON.stringify(result));
    assert(result.images.every(src => src.startsWith(index === 0 ? '/images/official-cakes/' : index === 1 ? '/images/official-rolls/' : '/images/official-gifts/')), 'Outdated menu present');
    assert(new Set(result.images).size === expected, 'Duplicate products');
    report.push({ title: result.title, count: result.images.length });
    await evaluate(`document.querySelector('dialog[open] .detail-dialog__close').click()`);
    await evaluate('new Promise(r => setTimeout(r, 1100))');
  }
  console.log(JSON.stringify(report));
} finally { ws.close(); }

