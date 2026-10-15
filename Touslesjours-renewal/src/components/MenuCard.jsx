import { withBaseUrl } from '../js/paths.js';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './common/CardContent.css';
import './MenuCard.css';

export default function MenuCard({
    image = withBaseUrl("/images/menu/menu-placeholder.png"),
    imageAlt = '',
    title = 'text',
    description = ['text', 'text', 'text'],
    href,
    onClick,
    buttonLabel = 'MORE',
    className = '',
    imageStyle,
    children,
    animateImage = true,
}) {
    const cardRef = useRef(null);
    const hover = useRef(null);
    useLayoutEffect(() => {
        if (!animateImage) return;
        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
            const image = cardRef.current.querySelector('.menu-card__image');
            const options = { duration: 0.35, ease: 'power2.out' };
            const scaleX = gsap.quickTo(image, 'scaleX', options);
            const scaleY = gsap.quickTo(image, 'scaleY', options);
            hover.current = value => { scaleX(value); scaleY(value); };
            // A newly mounted category card may already be under the pointer.
            if (cardRef.current.matches(':hover, :focus-within')) hover.current(1.04);
            return () => { hover.current = null; };
        });
        return () => { media.revert(); hover.current = null; };
    }, [animateImage]);
    const lines = Array.isArray(description) ? description : description.split('\n');

    return (
        <article ref={cardRef} className={`menu-card ${className}`.trim()}
            onMouseEnter={() => hover.current?.(1.04)}
            onMouseLeave={() => { if (!cardRef.current.contains(document.activeElement)) hover.current?.(1); }}
            onFocus={() => hover.current?.(1.04)}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(':hover')) hover.current?.(1); }}
            onClick={!href ? onClick : undefined}>
            {children}
            <div className="menu-card__visual">
                <img
                    className="menu-card__image"
                    src={image}
                    alt={imageAlt}
                    style={imageStyle}
                    width="337"
                    height="397"
                    loading="lazy"
                />
            </div>
            <div className="menu-card__body">
                <div className="menu-card__content">
                    <div className="menu-card__copy">
                        <h3 className="menu-card__title">{title}</h3>
                        <p className="menu-card__description">
                            {lines.map((line, index) => (
                                <span key={index}>{line}</span>
                            ))}
                        </p>
                    </div>
                    {href ? (
                        <a
                            className="menu-card__button"
                            href={href}
                            onClick={onClick}
                            aria-label={`${title}: ${buttonLabel}`}
                        >
                            {buttonLabel}
                        </a>
                    ) : (
                        <button
                            className="menu-card__button"
                            type="button"
                            disabled={!onClick}
                            aria-label={`${title}: ${buttonLabel}`}
                        >
                            {buttonLabel}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
