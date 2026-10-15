import { withBaseUrl } from '../../js/paths.js';
import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import MenuCard from '../MenuCard';
import DetailDialog from '../common/DetailDialog';
import { menuCatalog } from '../../data/menuCatalog';
import './Menu.css';

export function cropStyle([width, height, left, top]) {
  return { width: `${width}%`, height: `${height}%`, left: `${left}%`, top: `${top}%` };
}

const categories = ['Bread', 'Cake', 'Deli', 'Desserts', 'Drinks', 'Gift'];

export default function Menu({ onSelect }) {
  const [category, setCategory] = useState('Bread');
  const [expanded, setExpanded] = useState(null);
  const gridRef = useRef(null);
  const items = menuCatalog[category] ?? [];
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(gridRef.current.children, { opacity: 0, y: 15 }, {
        opacity: 1, y: 0, duration: 0.4, ease: 'power2.out',
      });
    });
    return () => media.revert();
  }, [category]);
  return (
    <section className={`menu menu--${category.toLowerCase()}`} id="menu" aria-label="뚜레쥬르 메뉴">
      <div className="inner">
        <div className="menu__tabs" role="tablist" aria-label="메뉴 종류">
          {categories.map((label, index) => <button type="button" role="tab" id={`menu-tab-${index}`} aria-controls="menu-panel" aria-selected={category === label} tabIndex={category === label ? 0 : -1} className={`menu__tab ${category === label ? 'menu__tab--active' : ''}`} key={label} onClick={() => setCategory(label)} onKeyDown={event => {
            const offset = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
            if (offset) { event.preventDefault(); const next = (index + offset + categories.length) % categories.length; setCategory(categories[next]); document.getElementById(`menu-tab-${next}`).focus(); }
          }}>{label}</button>)}
        </div>
        <div ref={gridRef} className="menu__grid" id="menu-panel" role="tabpanel" aria-labelledby={`menu-tab-${categories.indexOf(category)}`}>
          {items.map((item, index) => <MenuCard className="menu__item" animateImage key={item.id} image={item.image} imageAlt={item.name} imageStyle={cropStyle(item.crop)} title={item.name} description={item.description} onClick={event => setExpanded({ item, origin: event.currentTarget.closest('.menu-card') })}>
            {category === 'Cake' && index === 1 && <img className="menu__cake-badge" src={withBaseUrl("/images/menu/cake/badge.png")} alt="" width="39" height="62" />}
            {category === 'Gift' && index === 1 && <img className="menu__cake-badge" src={withBaseUrl("/images/menu/gift/badge.png")} alt="" width="39" height="62" />}
          </MenuCard>)}
          {!items.length && <p className="menu__empty" role="status">현재 등록된 {category} 제품이 없습니다. 다른 메뉴를 선택해 주세요.</p>}
        </div>
      </div>
      {expanded && <DetailDialog selection={expanded.item} origin={expanded.origin} expansion="panel" onClose={() => setExpanded(null)} onSelect={onSelect} />}
    </section>
  );
}
