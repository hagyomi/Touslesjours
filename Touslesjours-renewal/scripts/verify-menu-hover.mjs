import assert from 'node:assert/strict';

const target = await fetch('http://127.0.0.1:9455/json/new?about:blank', { method: 'PUT' }).then(r => r.json());
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (!message.id) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  message.error ? request.reject(message.error) : request.resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  pending.set(++id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5176/' });
  for (let i = 0; i < 100 && !await evaluate("!!document.querySelector('.menu__item')"); i++) await wait(100);
  await wait(600);
  if (process.argv.includes('--expansion')) {
    for (const width of [1440, 390]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
      await wait(300);
      for (const index of [0, 1]) {
        const before = await evaluate(`(() => {
          const card = document.querySelectorAll('.menu__item')[${index}];
          card.scrollIntoView({block:'center',behavior:'instant'});
          const bounds = card.getBoundingClientRect();
          return {width:bounds.width,height:bounds.height,font:parseFloat(getComputedStyle(card.querySelector('.menu-card__description')).fontSize),text:card.querySelector('.menu-card__description').textContent};
        })()`);
        await evaluate(`document.querySelectorAll('.menu__item')[${index}].querySelector('button').click()`);
        await wait(1000);
        const expanded = await evaluate(`(() => {
          const card = document.querySelector('.detail-dialog__card-transition');
          const panel = document.querySelector('.detail-dialog__content').getBoundingClientRect();
          const bounds = card.getBoundingClientRect();
          return {width:bounds.width,height:bounds.height,scale:new DOMMatrix(getComputedStyle(card).transform).a,font:parseFloat(getComputedStyle(card.querySelector('.menu-card__description')).fontSize),text:card.querySelector('.menu-card__description').textContent,opacity:getComputedStyle(card).opacity,aligned:Math.abs(bounds.left-panel.left)<1&&Math.abs(bounds.top-panel.top)<1};
        })()`);
        const ratio = expanded.width / before.width;
        assert.ok(Math.abs(expanded.scale - 1) < 0.001, 'Card must render at native scale after expansion');
        assert.ok(Math.abs(expanded.font - before.font * ratio) < 0.02, 'Font must render at actual enlarged size');
        assert.ok(Math.abs(expanded.height / before.height - ratio) < 0.001, 'Card proportions must stay unchanged');
        assert.equal(expanded.text, before.text);
        assert.equal(expanded.opacity, '1');
        assert.ok(expanded.aligned, 'Card must align with the detail panel');
        await send('Input.dispatchKeyEvent', { type:'keyDown', key:'Escape', code:'Escape', windowsVirtualKeyCode:27 });
        await send('Input.dispatchKeyEvent', { type:'keyUp', key:'Escape', code:'Escape', windowsVirtualKeyCode:27 });
        await wait(1000);
        assert.equal(await evaluate("!!document.querySelector('.detail-dialog')"), false);
        assert.equal(await evaluate(`getComputedStyle(document.querySelectorAll('.menu__item')[${index}]).visibility`), 'visible');
        console.log(`Expansion ${width}px card ${index}: native scale, text, proportions, ESC return passed`);
      }
    }
  } else {
  for (const category of ['New', 'Bread', 'Cake', 'Deli', 'Desserts', 'Drinks']) {
    await evaluate(`Array.from(document.querySelectorAll('.menu__tab')).find(t => t.textContent === ${JSON.stringify(category)}).click()`);
    await wait(500);
    const count = await evaluate("document.querySelectorAll('.menu__item').length");
    for (let i = 0; i < count; i++) {
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 });
      await wait(400);
      await evaluate(`document.querySelectorAll('.menu__item')[${i}].scrollIntoView({block:'center',behavior:'instant'})`);
      await wait(100);
      const before = await evaluate(`(() => {
        const card = document.querySelectorAll('.menu__item')[${i}];
        const image = card.querySelector('img.menu-card__image');
        const rect = card.getBoundingClientRect();
        const text = card.querySelector('h3').getBoundingClientRect();
        return {x:rect.left+rect.width/2,y:rect.top+30,w:rect.width,h:rect.height,tw:text.width,th:text.height,scale:new DOMMatrix(getComputedStyle(image).transform).a};
      })()`);
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: before.x, y: before.y });
      await wait(450);
      const after = await evaluate(`(() => {
        const card = document.querySelectorAll('.menu__item')[${i}];
        const rect = card.getBoundingClientRect();
        const text = card.querySelector('h3').getBoundingClientRect();
        return {scale:new DOMMatrix(getComputedStyle(card.querySelector('.menu-card__image')).transform).a,w:rect.width,h:rect.height,tw:text.width,th:text.height};
      })()`);
      assert.ok(Math.abs(after.scale - 1.04) < 0.001, `${category}[${i}] hover scale: ${after.scale}`);
      for (const key of ['w','h','tw','th']) assert.equal(after[key], before[key], `${category}[${i}] ${key} changed`);
      if (i === 0) {
        await evaluate(`document.querySelectorAll('.menu__item')[${i}].querySelector('button').focus({preventScroll:true}); document.querySelector('.menu__tab--active').focus({preventScroll:true})`);
        await wait(400);
        const focusedScale = await evaluate(`new DOMMatrix(getComputedStyle(document.querySelectorAll('.menu__item')[${i}].querySelector('.menu-card__image')).transform).a`);
        assert.ok(Math.abs(focusedScale - 1.04) < 0.001, `${category} lost hover on blur`);
      }
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 });
      await wait(450);
      const scale = await evaluate(`new DOMMatrix(getComputedStyle(document.querySelectorAll('.menu__item')[${i}].querySelector('.menu-card__image')).transform).a`);
      assert.ok(Math.abs(scale - 1) < 0.001, `${category}[${i}] leave scale: ${scale}`);
    }
    console.log(`${category}: ${count} cards passed`);
  }
  }
} finally {
  ws.close();
  await fetch(`http://127.0.0.1:9455/json/close/${target.id}`);
}
