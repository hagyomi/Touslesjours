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
const base = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:4173/Touslesjours/';
try {
 const report=[];
 for(const route of ['', 'menu/', 'menu/products/', 'login/']) {
  const response=await fetch(base+route);assert(response.status===200,'Route response '+route);
  await send('Page.navigate',{url:base+route});
  await evaluate(`(async()=>{for(let i=0;i<100&&!document.querySelector('main');i++)await new Promise(r=>setTimeout(r,50));await document.fonts.ready;await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode();}));})()`);
  const result=await evaluate(`({page:document.querySelector('main').className,images:[...document.images].every(img=>img.naturalWidth>0),links:[...document.querySelectorAll('a[href^="/"]')].map(a=>a.getAttribute('href'))})`);
  assert(result.images,'Images '+route);assert(result.links.every(href=>href.startsWith('/Touslesjours/')),'Base links '+route);
  assert(route.startsWith('login')?result.page==='login-page':route.startsWith('menu')?result.page==='menu-page':result.page==='home','Page routing '+route);
  report.push({route,images:result.images});
 }
 await send('Page.navigate',{url:base});
 await evaluate(`(async()=>{for(let i=0;i<100&&!document.querySelector('#gift');i++)await new Promise(r=>setTimeout(r,50));})()`);
 for(const [index,count]of [77,7,22].entries()) {
  await evaluate(`document.querySelector('.gift__card--${index}').click()`);await evaluate('new Promise(r=>setTimeout(r,1100))');
  const countLoaded=await evaluate(`(async()=>{const imgs=[...document.querySelectorAll('.detail-dialog__products img')];await Promise.all(imgs.map(img=>{img.loading='eager';return img.decode();}));return imgs.length;})()`);
  assert(countLoaded===count,'Collection '+index);
  await evaluate(`document.querySelector('dialog[open] .detail-dialog__close').click()`);await evaluate('new Promise(r=>setTimeout(r,1100))');
 }
 console.log(JSON.stringify({routes:report,collections:[77,7,22]}));
}finally{ws.close();}
