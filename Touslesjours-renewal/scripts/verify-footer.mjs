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
 await send('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:5176/'});
 await evaluate(`(async()=>{for(let i=0;i<100&&!document.querySelector('.footer');i++)await new Promise(r=>setTimeout(r,100));await document.fonts.ready;await Promise.all([...document.querySelectorAll('.footer img')].map(img=>{img.loading='eager';return img.decode();}));})()`);
 const rect=await evaluate(`(()=>{const footer=document.querySelector('.footer');const r=footer.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,images:[...footer.querySelectorAll('img')].map(img=>({loaded:img.naturalWidth>0,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height})),background:getComputedStyle(footer).backgroundColor};})()`);
 assert(rect.height===771 && rect.images.length===2 && rect.images.every(img=>img.loaded),'Footer geometry and assets');
 const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:rect.x,y:rect.y,width:rect.width,height:rect.height,scale:.6}});
 await writeFile('artifacts/footer-updated.png',Buffer.from(shot.data,'base64'));
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 const mobile=await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,footerWidth:document.querySelector('.footer').getBoundingClientRect().width})`);
 assert(mobile.scrollWidth<=mobile.width,'Mobile overflow');
 console.log(JSON.stringify({desktop:rect,mobile}));
}finally{ws.close();}
