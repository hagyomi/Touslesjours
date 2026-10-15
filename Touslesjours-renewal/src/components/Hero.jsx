import { withBaseUrl } from '../js/paths.js';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const photos = [
    { src: withBaseUrl("/images/figma/visual2.png"), alt: '햇살 아래 테이블에 놓인 갓 구운 빵과 커피' },
    { src: withBaseUrl("/images/figma/hero-image80.png"), alt: '햇살이 비치는 테이블 위 딸기 케이크와 크루아상, 샌드위치와 커피' },
    { src: withBaseUrl("/images/figma/hero-bread-table.png"), alt: '테이블 위 갓 구운 빵' },
    { src: withBaseUrl("/images/figma/hero-coffee-table.png"), alt: '꽃과 커피가 놓인 테이블 위 빵' },
];

export default function Hero() {
    const heroRef = useRef(null);
    const characterRef = useRef(null);
    const [activePhoto, setActivePhoto] = useState(0);
    const [loadedPhotos, setLoadedPhotos] = useState(() => photos.map(() => false));
    const allPhotosLoaded = loadedPhotos.every(Boolean);
    const [entryComplete, setEntryComplete] = useState(false);

    useEffect(() => {
        if (!allPhotosLoaded || !entryComplete) return;
        const nextPhoto = () => {
            setActivePhoto(current => (current + 1) % photos.length);
        };
        let interval;
        const firstTransition = window.setTimeout(() => {
            nextPhoto();
            interval = window.setInterval(nextPhoto, 3000);
        }, 1000);
        return () => {
            window.clearTimeout(firstTransition);
            window.clearInterval(interval);
        };
    }, [allPhotosLoaded, entryComplete]);

    useLayoutEffect(() => {
        let disposed = false;
        const context = gsap.context(() => {
            const lines = heroRef.current.querySelectorAll('.hero__title span');
            const description = heroRef.current.querySelector('.hero__description');
            const images = heroRef.current.querySelectorAll('.hero__photo');

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                setEntryComplete(true);
                return;
            }

            gsap.set(lines, { clipPath: 'inset(0 100% 0 0)' });
            gsap.set(description, { opacity: 0, y: 20 });
            gsap.set(images, { scale: 1.08, transformOrigin: '50% 50%' });

            // Start once fonts and the first photo are ready, so the entry is visible.
            Promise.all([document.fonts.ready, images[0].decode().catch(() => {})]).then(() => {
                if (disposed) return;
                context.add(() => {
                    const timeline = gsap.timeline({
                        defaults: { ease: 'power2.out' },
                        onComplete: () => setEntryComplete(true),
                    });

                    lines.forEach(line => {
                        const range = document.createRange();
                        range.selectNodeContents(line);
                        const textBounds = range.getBoundingClientRect();
                        const lineBounds = line.getBoundingClientRect();
                        // Exclude centered margins without changing the line's layout.
                        const hiddenRight = (lineBounds.right - textBounds.left) / lineBounds.width * 100;
                        timeline.fromTo(line, {
                            clipPath: `inset(0 ${Math.max(0, hiddenRight)}% 0 0)`,
                        }, {
                            clipPath: 'inset(0 0% 0 0)',
                            duration: 2,
                        }, 0);
                    });

                    timeline.to(images, { scale: 1, duration: 1.8 }, 0)
                        .to(description, { opacity: 1, y: 0, duration: 0.6 }, 0);
                });
            });
        }, heroRef);

        return () => {
            disposed = true;
            context.revert();
        };
    }, []);

    useLayoutEffect(() => {
        const media = gsap.matchMedia();

        media.add('(prefers-reduced-motion: no-preference)', () => {
            const character = characterRef.current;
            const content = character.parentElement;

            // Begin at the right edge and finish at the original CSS position.
            gsap.fromTo(character, {
                x: () => Math.max(0, content.clientWidth - character.offsetLeft - character.offsetWidth - 20),
            }, {
                x: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: content,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                },
            });
        }, heroRef);

        return () => media.revert();
    }, []);

    return (
        <section ref={heroRef} className="hero" aria-labelledby="hero-title">
            <div className="hero__content">
                <div className="hero__copy">
                    <h1 className="hero__title" id="hero-title">
                        <span>More</span>
                        <span>Good Days</span>
                        <span>with</span>
                        <span>Freshly Baked</span>
                        <span>Moments</span>
                    </h1>
                    <p className="hero__description">
                        <span>Breads and treats that bring a little more</span>
                        <span>warmth to your everyday.</span>
                    </p>
                </div>
                <img
                    ref={characterRef}
                    className="hero__character"
                    src={withBaseUrl("/images/figma/image39.png")}
                    alt=""
                    width="308"
                    height="190"
                />
            </div>
            <div className="hero__visual">
                {photos.map((photo, index) => (
                    <img
                        key={photo.src}
                        className={`hero__photo${index === activePhoto ? ' hero__photo--visible' : ''}`}
                        src={photo.src}
                        alt={index === activePhoto ? photo.alt : ''}
                        aria-hidden={index !== activePhoto}
                        width="960"
                        height="835"
                        fetchPriority={index === 0 ? 'high' : 'auto'}
                        onLoad={() => setLoadedPhotos(current => current.map((loaded, i) => i === index || loaded))}
                    />
                ))}
            </div>
        </section>
    );
}
