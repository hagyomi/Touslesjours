import assert from 'node:assert/strict';

const target = await fetch('http://127.0.0.1:9333/json/new?about:blank', { method: 'PUT' }).then(r => r.json());
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
const errors = [];
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
  const request = pending.get(message.id);
  if (request) {
    pending.delete(message.id);
    message.error ? request.reject(message.error) : request.resolve(message.result);
  }
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
try {
  await send('Runtime.enable');
  for (const width of [1440, 390]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
    const metrics = await evaluate(`(async () => {
      const wait = ms => new Promise(r => setTimeout(r, ms));
      for (let i = 0; i < 100 && !document.querySelector('.gift__card--0'); i++) await wait(100);
      await document.fonts.ready;
      const results = [];
      for (const card of document.querySelectorAll('.gift__grid .gift-card')) {
        card.scrollIntoView({ block: 'center', behavior: 'instant' });
        const bounds = card.getBoundingClientRect();
        const scroll = scrollY;
        card.click();
        await wait(180);
        const clone = document.querySelector('.detail-dialog__card-transition');
        const mid = clone.getBoundingClientRect();
        const during = getComputedStyle(document.querySelector('.detail-dialog__content')).opacity;
        await wait(900);
        const full = clone.getBoundingClientRect();
        const opacity = getComputedStyle(document.querySelector('.detail-dialog__content')).opacity;
        const hidden = getComputedStyle(card).visibility;
        document.querySelector('.detail-dialog__close').click();
        await wait(180);
        const reversing = !!document.querySelector('dialog[open]');
        await wait(950);
        const restored = card.getBoundingClientRect();
        results.push({ midWidth: mid.width, originalWidth: bounds.width, during, fullWidth: full.width, fullHeight: full.height, opacity, hidden, reversing, closed: !document.querySelector('dialog'), restored: Math.abs(restored.width - bounds.width) < 1 && Math.abs(restored.top - bounds.top) < 1, scrollStable: scrollY === scroll, visible: getComputedStyle(card).visibility, unlocked: document.body.style.overflow !== 'hidden' });
      }
      return results;
    })()`);
    for (const item of metrics) {
      assert(item.midWidth > item.originalWidth && item.midWidth < width, JSON.stringify(item));
      assert.equal(Number(item.during), 0);
      assert(Math.abs(item.fullWidth - width) < 1);
      assert(Math.abs(item.fullHeight - 900) < 1);
      assert.equal(Number(item.opacity), 1);
      assert.equal(item.hidden, 'hidden');
      assert(item.reversing && item.closed && item.restored && item.scrollStable && item.unlocked, JSON.stringify(item));
      assert.equal(item.visible, 'visible');
    }
    console.log(JSON.stringify({ width, cards: metrics.length, passed: true }));
  }
  assert.equal(errors.length, 0, JSON.stringify(errors));
} finally {
  await send('Page.close');
  ws.close();
}
