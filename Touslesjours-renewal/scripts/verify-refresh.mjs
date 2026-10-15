import assert from 'node:assert/strict';

const base = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:5173';
for (const path of ['/', '/menu', '/menu/products', '/login']) {
  const response = await fetch(`${base}${path}`, {
    headers: { Accept: 'text/html' },
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(response.status, 200, `${path} must serve the SPA entry`);
  assert.match(await response.text(), /src\/js\/main\.js/);
}

// Use a separate tab so verification does not change the user's current page.
const target = await fetch('http://127.0.0.1:9333/json/new?about:blank', {
  method: 'PUT', signal: AbortSignal.timeout(5000),
}).then(response => response.json());
const ws = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const errors = [];
let loaded;
let sequence = 0;
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Page.loadEventFired') loaded?.();
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
  if (message.method === 'Network.loadingFailed') errors.push(message.params);
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error'
    && message.params.entry.url !== `${base}/favicon.ico`) errors.push(message.params.entry);
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  clearTimeout(request.timeout);
  message.error ? request.reject(new Error(JSON.stringify(message.error))) : request.resolve(message.result);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 20000);
    pending.set(id, { resolve, reject, timeout });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function load(method, params) {
  let timeout;
  const event = new Promise((resolve, reject) => {
    loaded = resolve;
    timeout = setTimeout(() => reject(new Error('Page load timed out')), 20000);
  });
  try {
    const result = await send(method, params);
    await event;
    return result;
  } finally { clearTimeout(timeout); loaded = undefined; }
}
async function pageState() {
  const result = await send('Runtime.evaluate', {
    expression: `new Promise((resolve, reject) => {
      const deadline = Date.now() + 15000;
      const timer = setInterval(() => {
        if (document.querySelector('main') && document.querySelector('.header')) {
          clearInterval(timer);
          resolve({ url: location.href, sections: document.querySelectorAll('main section').length });
        } else if (Date.now() > deadline) { clearInterval(timer); reject(new Error('React did not render')); }
      }, 100);
    })`,
    awaitPromise: true, returnByValue: true,
  });
  if (result.exceptionDetails) {
    const diagnostic = await send('Runtime.evaluate', { expression: '({url:location.href,html:document.body.innerHTML.slice(0,3000)})', returnByValue: true });
    throw new Error(JSON.stringify({ page: diagnostic.result.value, errors, exception: result.exceptionDetails }));
  }
  return result.result.value;
}
try {
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Log.enable');
  await send('Page.enable');
  for (const path of ['/', '/#menu', '/menu', '/menu/products', '/login']) {
    await load('Page.navigate', { url: 'about:blank' });
    const navigation = await load('Page.navigate', { url: `${base}${path}` });
    assert.ok(!navigation.errorText, navigation.errorText);
    const before = await pageState();
    for (let count = 0; count < 3; count++) {
      await load('Page.reload', { ignoreCache: true });
      assert.deepEqual(await pageState(), before);
      assert.equal((await fetch(base, { signal: AbortSignal.timeout(5000) })).status, 200);
    }
    console.log(`PASS: ${path} direct navigation and 3 browser reloads`);
  }
  assert.deepEqual(errors, [], 'Browser runtime exceptions');
} finally {
  ws.close();
  await fetch(`http://127.0.0.1:9333/json/close/${target.id}`);
}
