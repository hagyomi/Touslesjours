import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PickCard from '../PickCard';
import { cropStyle } from './Menu';
import './Picks.css';

gsap.registerPlugin(ScrollTrigger);

export default function Picks({ products, onSelect }) {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const triggerRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const clickTimerRef = useRef(null);

  useLayoutEffect(() => {
    let disposed = false;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const section = sectionRef.current;
        const viewport = viewportRef.current;
        const track = trackRef.current;
        const distance = () => Math.max(0, track.offsetWidth - viewport.clientWidth);
        if (!distance()) return;
        viewport.scrollLeft = 0;
        section.classList.add('picks--pinned');
        const animation = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            // Keep the card bottoms visible on screens shorter than the Figma section.
            start: () => section.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        triggerRef.current = animation.scrollTrigger;
        return () => {
          triggerRef.current = null;
          section.classList.remove('picks--pinned');
          viewport.scrollLeft = 0;
        };
      });
    }, sectionRef);
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => {
      disposed = true;
      window.clearTimeout(clickTimerRef.current);
      dragRef.current = null;
      media.revert();
      context.revert();
    };
  }, [products]);

  function startDrag(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button, a')) return;
    const trigger = triggerRef.current;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      offset: trigger ? -Number(gsap.getProperty(trackRef.current, 'x')) : viewportRef.current.scrollLeft,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(delta) < 5) return;
    drag.moved = true;
    event.preventDefault();
    event.currentTarget.classList.add('picks__viewport--dragging');
    const trigger = triggerRef.current;
    if (trigger) {
      const next = gsap.utils.clamp(0, trigger.end - trigger.start, drag.offset - delta);
      window.scrollTo({ top: trigger.start + next, behavior: 'instant' });
      ScrollTrigger.update();
      // Match the pointer immediately, then resume scrub for vertical scrolling.
      trigger.getTween()?.progress(1);
    } else {
      event.currentTarget.scrollLeft = drag.offset - delta;
    }
  }

  function endDrag(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.classList.remove('picks__viewport--dragging');
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.moved) {
      suppressClickRef.current = true;
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    }
  }

  function scrollPicks(direction) {
    const trigger = triggerRef.current;
    if (trigger) {
      const distance = trigger.end - trigger.start;
      const next = gsap.utils.clamp(0, distance, -Number(gsap.getProperty(trackRef.current, 'x')) + direction * 402);
      window.scrollTo({ top: trigger.start + next, behavior: 'smooth' });
    } else {
      viewportRef.current.scrollBy({ left: direction * 402, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }

  return <section ref={sectionRef} className="picks" id="picks" aria-labelledby="picks-title">
    <div className="inner">
      <h2 className="picks__title" id="picks-title"><span>TOUS les JOURS</span><br />Daily Pick’s</h2>
      <div ref={viewportRef} className="picks__viewport" aria-label="오늘의 추천 상품"
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag}
        onPointerCancel={endDrag} onLostPointerCapture={endDrag}
        onDragStart={event => event.preventDefault()}
        onClickCapture={event => { if (suppressClickRef.current) { event.preventDefault(); event.stopPropagation(); } }}>
        <div ref={trackRef} className="picks__track">
          {products.map(item => <div className="picks__slide" key={item.id}><PickCard className="picks__item"
            image={item.image} imageAlt={item.name} imageStyle={cropStyle(item.crop)}
            title={item.name} description={item.description} onClick={() => onSelect(item)} /></div>)}
        </div>
      </div>
      <div className="picks__controls"><button type="button" aria-label="이전 추천 상품" onClick={() => scrollPicks(-1)}>←</button><button type="button" aria-label="다음 추천 상품" onClick={() => scrollPicks(1)}>→</button></div>
    </div>
  </section>;
}
