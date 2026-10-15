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
 await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
 await send('Page.navigate', { url: 'http://127.0.0.1:5176/' });
 await evaluate(`(async () => { for(let i=0;i<100&&!document.querySelector('#gift');i++) await new Promise(r=>setTimeout(r,100)); document.querySelector('#gift .gift__card--0').click(); await new Promise(r=>setTimeout(r,1100)); const images=[...document.querySelectorAll('.detail-dialog__products img')]; images.forEach(img=>img.loading='eager'); await Promise.all(images.map(img=>img.decode())); })()`);
 const metrics=await evaluate(`({count:document.querySelectorAll('.detail-dialog__products .menu-card').length, loaded:[...document.querySelectorAll('.detail-dialog__products img')].every(img=>img.naturalWidth>0), columns:getComputedStyle(document.querySelector('.detail-dialog__products')).gridTemplateColumns})`);
 assert(metrics.count===77&&metrics.loaded,'Cake images');
 const shot=await send('Page.captureScreenshot',{format:'png'});
 await writeFile('artifacts/gift-official-cakes.png',Buffer.from(shot.data,'base64'));
 await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
 const mobile=await evaluate(`(()=>{const content=document.querySelector('dialog[open] .detail-dialog__content');return {width:content.clientWidth,scroll:content.scrollWidth};})()`);
 assert(mobile.scroll<=mobile.width,'Mobile overflow');
 await evaluate(`document.querySelector('.detail-dialog__products .menu-card__button').click()`);
 await evaluate('new Promise(r=>setTimeout(r,1100))');
 assert(await evaluate(`document.querySelector('dialog[open] #detail-title').textContent==='스트로베리 파라다이스'`),'Product selection');
 console.log(JSON.stringify({metrics,mobile,selection:true}));
} finally {ws.close();}

