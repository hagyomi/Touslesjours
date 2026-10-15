import { writeFile, mkdir, stat } from 'node:fs/promises';

const targets = await fetch('http://127.0.0.1:9333/json').then(r => r.json());
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  if (data.id) {
    const request = pending.get(data.id);
    pending.delete(data.id);
    data.error ? request.reject(data.error) : request.resolve(data.result);
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
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5176/' });
  await evaluate(`(async () => {
    for (let i = 0; i < 100 && !document.querySelector('.gift__card--0'); i++) await new Promise(r => setTimeout(r, 100));
    await document.fonts.ready;
    await document.querySelector('.gift__card--0 .gift-card__arrow').decode();
    await document.querySelector('.gift__card--0 .gift__cake-art img').decode();
  })()`);
  await evaluate(`(async () => {
    document.querySelector('.gift__card--0').scrollIntoView({ block: 'center', behavior: 'instant' });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  })()`);
  const metrics = await evaluate(`(() => {
    const card = document.querySelector('.gift__card--0');
    const rect = card.getBoundingClientRect();
    const arrow = card.querySelector('.gift-card__arrow');
    const ar = arrow.getBoundingClientRect();
    const illustration = card.querySelector('.gift__cake-art img');
    const illustrationRect = illustration.getBoundingClientRect();
    return { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height,
      arrowWidth: ar.width, arrowHeight: ar.height, arrowLeft: ar.left - rect.left, arrowTop: ar.top - rect.top,
      assetLoaded: arrow.naturalWidth > 0, asset: arrow.getAttribute('src'),
      titleSize: getComputedStyle(card.querySelector('.gift-card__title')).fontSize,
      subtitleSize: getComputedStyle(card.querySelector('.gift-card__subtitle')).fontSize,
      descriptionWeight: getComputedStyle(card.querySelector('.gift-card__description')).fontWeight,
      illustrationLoaded: illustration.naturalWidth > 0,
      illustrationWidth: illustrationRect.width, illustrationHeight: illustrationRect.height,
      illustrationCount: card.querySelectorAll('.gift__cake-art img').length };
  })()`);
  const near = (actual, expected) => Math.abs(actual - expected) < .03;
  if (!near(metrics.width, 466) || !near(metrics.height, 348.062) || !near(metrics.arrowWidth, 40.7984)
      || !near(metrics.arrowHeight, 40.7984) || !near(metrics.arrowLeft, 393.96) || !near(metrics.arrowTop, 21.674)
      || !metrics.assetLoaded || metrics.titleSize !== '60px' || metrics.subtitleSize !== '23px'
      || metrics.descriptionWeight !== '200' || metrics.illustrationCount !== 1 || !metrics.illustrationLoaded
      || !near(metrics.illustrationWidth, 139.57) || !near(metrics.illustrationHeight, 114.56)
      || (await stat('public/images/common/gift-cake-illustration.png')).size === 0
      || (await stat('public/images/common/gift-cake-arrow.svg')).size === 0) throw new Error(JSON.stringify(metrics));
  await mkdir('artifacts', { recursive: true });
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
    clip: { x: metrics.x, y: metrics.y, width: metrics.width, height: metrics.height, scale: 1 } });
  await writeFile('artifacts/gift-cake.png', Buffer.from(shot.data, 'base64'));
  await evaluate(`document.querySelector('.gift__card--0').click()`);
  const opensDialog = await evaluate(`new Promise(resolve => setTimeout(() => resolve(!!document.querySelector('dialog[open]')), 100))`);
  if (!opensDialog) throw new Error('Cake card did not open its dialog');
  console.log(JSON.stringify({ ...metrics, opensDialog }));
} finally {
  ws.close();
}
