import { useEffect, useState } from 'react';
import './ScrollToTop.css';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 400);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  function scrollToTop() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    // Move keyboard focus away from the button before it disappears on scroll.
    const homeLink = document.querySelector('.header__logo');
    homeLink?.focus({ preventScroll: true });
  }

  return visible && <button className="scroll-to-top" type="button" onClick={scrollToTop} aria-label="맨 위로 이동">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 12 6-6 6 6M12 6v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>TOP</span>
  </button>;
}
