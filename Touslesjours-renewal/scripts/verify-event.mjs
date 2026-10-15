import { readFile, writeFile, stat, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const source = await readFile('scripts/verify-home.mjs', 'utf8');
const setup = source.slice(source.indexOf('const targets ='), source.indexOf('const report =')).replace('127.0.0.1:5173', '127.0.0.1:5175');
const checks = `
const metrics = await evaluate(\`(() => {
  const section = document.querySelector('#event');
  const top = section.getBoundingClientRect().top;
  const rect = el => { const r = el.getBoundingClientRect(); return { x:r.x, y:r.y-top, width:r.width, height:r.height }; };
  return { section:rect(section), cards:[...section.querySelectorAll('.event__card')].map(rect), more:rect(section.querySelector('.event__more')), images:[...section.querySelectorAll('img')].map(el=>({src:el.getAttribute('src'), loaded:el.complete && el.naturalWidth>0, ...rect(el)})) };
})()\`);
assert(metrics.section.height === 1394);
assert(Math.abs(metrics.cards[0].y - 434) < 1, JSON.stringify(metrics));
assert(metrics.cards[1].x - metrics.cards[0].x === 715);
assert(Math.abs(metrics.cards[2].y - 700) < 1);
assert(Math.abs(metrics.more.y - 976) < 1);
assert(metrics.images.every(img => img.loaded));
for (const img of metrics.images) assert((await stat('public' + img.src)).size > 0);
const shot = await send('Page.captureScreenshot', {format:'png',captureBeyondViewport:true,clip:{x:0,y:await evaluate('document.querySelector("#event").getBoundingClientRect().top + scrollY'),width:1920,height:1394,scale:0.7}});
await writeFile('artifacts/event-desktop.png',Buffer.from(shot.data,'base64'));
await evaluate('document.querySelector(".event__card").click()');
assert(await evaluate('document.querySelector("dialog").open'));
await evaluate('document.querySelector(".detail-dialog__close").click()');
for (const width of [375,768,1024,1440]) {
 await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
 assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Overflow at '+width);
}
console.log(JSON.stringify(metrics,null,2));
ws.close();
`;
await eval('(async () => {' + setup + checks + '})()');
