import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { getHomeProducts } from '../../services/homeService';
import { currentMenuProducts, getGiftCollectionProducts } from '../../data/menuCatalog';
import MenuCard from '../MenuCard';
import './DetailDialog.css';

const { menuProducts, dailyPicks } = getHomeProducts();
const products = [...menuProducts, ...currentMenuProducts, ...dailyPicks];
gsap.registerPlugin(Flip);

// Render the enlarged card at its actual size, retaining the original line wraps.
// Capture all measurements before changing any styles to avoid cumulative scaling.
function measureCardContents(card) {
  const properties = [
    'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
    'top', 'right', 'bottom', 'left', 'fontSize', 'lineHeight', 'letterSpacing',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'rowGap', 'columnGap',
    'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  ];
  return Array.from(card.querySelectorAll('*'), node => {
    const computed = getComputedStyle(node);
    return { node, values: Object.fromEntries(properties.map(property => [property, computed[property]])), transform: computed.transform };
  });
}

function resizeCardContents(measurements, scale) {
  measurements.forEach(({ node, values, transform }) => {
    Object.entries(values).forEach(([property, value]) => {
      if (/^-?[\d.]+px$/.test(value)) node.style[property] = `${parseFloat(value) * scale}px`;
    });
    if (transform !== 'none') {
      const matrix = new DOMMatrix(transform);
      matrix.e *= scale;
      matrix.f *= scale;
      node.style.transform = matrix.toString();
    }
  });
}

export default function DetailDialog({ selection, origin, expansion = 'fullscreen', onClose, onSelect }) {
  const dialog = useRef(null);
  const content = useRef(null);
  const animation = useRef(null);
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;
  const closing = useRef(false);
  const afterClose = useRef(null);
  const [query, setQuery] = useState('');
  const isSearch = selection.type === 'search';
  const isCollection = selection.type === 'collection';
  const isProductCollection = isCollection && ['Cake', 'Roll Cake', 'Gift Set'].includes(selection.name);
  const title = isSearch ? '메뉴 검색' : selection.name;
  const results = isCollection
    ? getGiftCollectionProducts(selection.name)
    : products.filter(item => item.name.toLowerCase().includes(query.trim().toLowerCase()));

  const requestClose = () => {
    if (closing.current) return;
    closing.current = true;
    if (animation.current && animation.current.time() > 0) animation.current.reverse();
    else finishClose();
  };
  const finishClose = () => {
    closeCallback.current();
    afterClose.current?.();
    afterClose.current = null;
  };

  useLayoutEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const bounds = origin?.getBoundingClientRect();
    const previousVisibility = origin?.style.visibility;
    if (scrollbar > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    document.body.style.overflow = 'hidden';
    element.showModal();
    let clone;
    let timeline;
    closing.current = false;

    if (origin && bounds) {
      // Preserve the grid item; only its visual copy leaves the document flow.
      clone = origin.cloneNode(true);
      clone.removeAttribute('id');
      clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      clone.querySelectorAll('img').forEach(image => {
        image.loading = 'eager';
        image.decoding = 'sync';
      });
      clone.setAttribute('aria-hidden', 'true');
      clone.inert = true;
      clone.tabIndex = -1;
      clone.classList.add('detail-dialog__card-transition');
      const radius = getComputedStyle(origin).borderRadius;
      Object.assign(clone.style, {
        position: 'fixed', left: `${bounds.left}px`, top: `${bounds.top}px`,
        width: `${bounds.width}px`, height: `${bounds.height}px`,
        maxWidth: 'none', margin: '0', borderRadius: radius,
        pointerEvents: 'none', boxShadow: 'none', transform: 'none',
      });
      element.prepend(clone);
      const measurements = expansion === 'panel' ? measureCardContents(clone) : null;
      const initial = Flip.getState(clone, { props: 'borderRadius' });
      origin.style.visibility = 'hidden';
      if (expansion === 'panel') {
        const scale = Math.min(1.35, (window.innerWidth - 32) / bounds.width, window.innerHeight * 0.85 / bounds.height);
        Object.assign(content.current.style, {
          width: `${bounds.width * scale}px`, height: `${bounds.height * scale}px`,
          flexBasis: `${bounds.width * scale}px`,
        });
        const target = content.current.getBoundingClientRect();
        resizeCardContents(measurements, scale);
        Object.assign(clone.style, {
          left: `${target.left}px`, top: `${target.top}px`,
          width: `${target.width}px`, height: `${target.height}px`,
        });
      } else {
        Object.assign(clone.style, {
          left: '0', top: '0', width: '100%', height: '100%', borderRadius: '0px',
        });
      }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = reduced ? 0.01 : expansion === 'panel' ? 0.7 : 0.9;
      gsap.set(content.current, { opacity: 0 });
      timeline = gsap.timeline({
        onReverseComplete: finishClose,
        onComplete: () => {
          if (expansion === 'panel') {
            // Release the animation's raster layer once the card is at rest.
            gsap.set(clone, { clearProps: 'transform', willChange: 'auto' });
          }
        },
      });
      timeline.add(Flip.from(initial, { duration, ease: 'power2.inOut', scale: true, force3D: false }), 0);
      if (expansion === 'panel') {
        gsap.set(element, { '--detail-backdrop-opacity': 0 });
        // Keep the complete original card, including its copy, visible throughout.
        timeline.to(element, { '--detail-backdrop-opacity': 0.5, duration, ease: 'power2.inOut' }, 0)
          .to(content.current, { opacity: 1, duration: duration * 0.25, ease: 'none' }, duration * 0.75);
      } else {
        timeline.to(Array.from(clone.children), { opacity: 0, duration: duration * 0.35 }, 0)
          .to(content.current, { opacity: 1, duration: duration * 0.5 }, duration * 0.5);
      }
      animation.current = timeline;
    }

    return () => {
      timeline?.kill();
      animation.current = null;
      clone?.remove();
      if (origin) origin.style.visibility = previousVisibility;
      element.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      const returnFocus = origin?.querySelector('button, a') || previousFocus;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [origin, expansion]);

  return <dialog className={`detail-dialog${origin ? ' detail-dialog--expanded' : ''}${origin && expansion === 'panel' ? ' detail-dialog--panel' : ''}`} ref={dialog} onCancel={event => { event.preventDefault(); requestClose(); }} aria-labelledby="detail-title" onClick={event => { if (event.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if (expansion === 'panel' || event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) requestClose(); } }}>
    <div className="detail-dialog__content" ref={content}>
    <button className="detail-dialog__close" type="button" onClick={requestClose} aria-label="닫기">×</button>
    {expansion === 'panel' ? <>
      {/* The visible copy is the unchanged card; expose its data to assistive tools. */}
      <div className="detail-dialog__card-accessible">
        <h2 id="detail-title">{title}</h2>
        <img src={selection.image} alt={selection.name} />
        <p className="detail-dialog__description">{selection.description.map((line, index) => <span key={index}>{line}</span>)}</p>
      </div>
    </> : <>
    <h2 id="detail-title">{title}</h2>
    {isSearch && <label className="detail-dialog__search">상품명<input autoFocus type="search" value={query} placeholder="케이크, 샌드위치 등을 검색하세요" onChange={event => setQuery(event.target.value)} /></label>}
    {isSearch || isCollection ? <><p aria-live="polite">{results.length}개의 상품</p>{isProductCollection ? <div className="detail-dialog__products">{results.map(item => <MenuCard key={item.id} image={item.image} imageAlt={item.name} title={item.name} description={item.description} onClick={() => onSelect(item)} />)}</div> : <div className="detail-dialog__results">{results.map(item => <button type="button" key={item.id} onClick={() => onSelect(item)}><img src={item.image} alt="" width="100" height="100" /><span>{item.name}</span></button>)}</div>}{!results.length && <p>검색 결과가 없습니다. 다른 상품명을 입력해 주세요.</p>}</>
      : <>{selection.image && <img className="detail-dialog__image" src={selection.image} alt={selection.name} />}<p className="detail-dialog__description">{selection.description.map(line => <span key={line}>{line}</span>)}</p>{!selection.image && <p className="detail-dialog__note">Figma 시안의 이벤트 안내입니다. 실제 진행 여부와 자세한 조건은 공식 홈페이지에서 확인해 주세요.</p>}<a className="button" href={selection.image ? '/#store' : 'https://www.tlj.co.kr/'} onClick={selection.image ? event => { if (origin) { event.preventDefault(); afterClose.current = () => requestAnimationFrame(() => document.getElementById('store')?.scrollIntoView()); } requestClose(); } : undefined}>{selection.image ? '가까운 매장 찾기' : '공식 홈페이지'}</a></>}
    </>}
    </div>
  </dialog>;
}

