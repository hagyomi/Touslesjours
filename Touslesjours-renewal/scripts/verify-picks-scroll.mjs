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
  await send('Emulation.setDeviceMetricsOverride', { width:1920,height:1200,deviceScaleFactor:1,mobile:false });
  await send('Page.navigate', {url:'http://127.0.0.1:5176/'});
  for(let i=0;i<100&&!await evaluate("!!document.querySelector('.picks--pinned')");i++)await wait(100);
  await evaluate('document.fonts.ready');
  await wait(600);
  for(const [width,height] of [[1920,1200],[1440,900]]) {
    await send('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:false});
    await wait(500);
    const geometry=await evaluate(`(() => {
      const section=document.querySelector('.picks');
      const viewport=document.querySelector('.picks__viewport');
      const track=document.querySelector('.picks__track');
      const spacer=section.parentElement;
      const start=spacer.getBoundingClientRect().top+scrollY+Math.max(0,section.offsetHeight-innerHeight);
      return {start,distance:track.offsetWidth-viewport.clientWidth,track:track.offsetWidth,count:track.children.length};
    })()`);
    assert.equal(geometry.track,2382);
    assert.equal(geometry.count,6);
    if(process.argv.includes('--drag')) {
      await evaluate(`window.scrollTo({top:${geometry.start},behavior:'instant'})`);
      await wait(1600);
      const point=await evaluate(`(() => {
        const r=document.querySelector('.picks__viewport').getBoundingClientRect();
        return {x:r.left+550,y:r.top+100};
      })()`);
      for(const [shift,expected] of [[-300,-300],[200,-100]]) {
        await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:point.x,y:point.y});
        await send('Input.dispatchMouseEvent',{type:'mousePressed',x:point.x,y:point.y,button:'left',buttons:1,clickCount:1});
        for(let step=1;step<=6;step++) {
          await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:point.x+shift*step/6,y:point.y,button:'left',buttons:1});
          await wait(20);
        }
        await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:point.x+shift,y:point.y,button:'left',buttons:0,clickCount:1});
        await wait(150);
        const result=await evaluate(`({x:new DOMMatrix(getComputedStyle(document.querySelector('.picks__track')).transform).e,dragging:document.querySelector('.picks__viewport').classList.contains('picks__viewport--dragging'),dialog:!!document.querySelector('.detail-dialog')})`);
        assert.ok(Math.abs(result.x-expected)<2,JSON.stringify(result));
        assert.equal(result.dragging,false);
        assert.equal(result.dialog,false);
      }
      console.log(`${width}px: left/right mouse drag and release passed`);
    }
    for(const progress of [0,0.5,1]) {
      await evaluate(`window.scrollTo({top:${geometry.start+geometry.distance*progress},behavior:'instant'})`);
      await wait(1600);
      const frame=await evaluate(`(() => {
        const section=document.querySelector('.picks');
        const viewport=document.querySelector('.picks__viewport').getBoundingClientRect();
        const track=document.querySelector('.picks__track');
        const last=track.lastElementChild.getBoundingClientRect();
        const image=track.firstElementChild.querySelector('.pick-card__visual').getBoundingClientRect();
        const body=track.firstElementChild.querySelector('.card').getBoundingClientRect();
        return {x:new DOMMatrix(getComputedStyle(track).transform).e,delta:image.left-body.left,lastRight:last.right,right:viewport.right,bodyBottom:body.bottom};
      })()`);
      assert.ok(Math.abs(frame.x+geometry.distance*progress)<2,JSON.stringify(frame));
      assert.ok(Math.abs(frame.delta)<1,'Image and body must move together');
      assert.ok(frame.bodyBottom<=height+1,'Card bottom must remain in viewport');
      if(progress===1)assert.ok(Math.abs(frame.lastRight-frame.right)<2,'Last card must fit viewport');
    }
    await evaluate(`window.scrollTo({top:${geometry.start+geometry.distance+120},behavior:'instant'})`);
    await wait(400);
    assert.ok(await evaluate("document.querySelector('.event').getBoundingClientRect().top >= document.querySelector('.picks').getBoundingClientRect().bottom-1"),'Event must not overlap Picks');
    console.log(`${width}x${height}: track, pin, synchronized motion, last card, Event passed`);
  }
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await wait(500);
  assert.equal(await evaluate("!!document.querySelector('.picks--pinned')"),false);
  assert.equal(await evaluate("document.querySelector('.picks').parentElement.classList.contains('pin-spacer')"),false);
  await evaluate("document.querySelector('.picks__viewport').scrollTo({left:400,behavior:'instant'})");
  await wait(400);
  assert.ok(await evaluate("document.querySelector('.picks__viewport').scrollLeft>0"));
  assert.equal(await evaluate("new DOMMatrix(getComputedStyle(document.querySelector('.picks__track')).transform).e"),0);
  console.log('Mobile: pin cleanup and native horizontal scroll passed');
} finally {
  ws.close();
  await fetch(`http://127.0.0.1:9455/json/close/${target.id}`);
}
