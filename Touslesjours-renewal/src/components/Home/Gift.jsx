import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assets } from '../../data/home';
import { getGiftCollectionProducts } from '../../data/menuCatalog';
import GiftCard from '../GiftCard';
import './Gift.css';

gsap.registerPlugin(ScrollTrigger);

const leafMotion = [
    { leaf: 5, origin: '100% 82%', rotation: 4.5, x: 3, y: 2, duration: 4.8, delay: 0 },
    { leaf: 6, origin: '100% 0%', rotation: 5, x: -2, y: 3, duration: 3.9, delay: 0.7 },
    { leaf: 7, origin: '100% 0%', rotation: 4, x: 2, y: -3, duration: 5.4, delay: 1.3 },
];

const gifts = [
    {
        title: 'Cake',
        subtitle: ['함께 나누기 좋은', '특별한 케이크'],
        description: [
            '소중한 사람들과 더 달콤한 순간을 만들어주는',
            '뚜레쥬르 케이크로 감사의 마음을 전해보세요.',
        ],
        image: assets.imgImage44,
    },
    {
        title: 'Roll Cake',
        subtitle: ['부드럽게 전하는', '달콤한 마음'],
        description: [
            '촉촉한 시트와 부드러운 크림이 어우러진',
            ' 뚜레쥬르 롤케이크로 마음을 전해보세요.',
        ],
        image: assets.imgImage45,
    },
    {
        title: 'Gift Set',
        subtitle: ['감사의 마음을', '가득 담은 선물 세트'],
        description: ['정성스럽게 준비한 뚜레쥬르 선물 세트로', '더 따뜻한 추석을 선물해보세요.'],
        image: assets.imgImage46,
    },
].map((gift, index) => ({ ...gift, designIndex: index }))
    .filter(gift => getGiftCollectionProducts(gift.title).length > 0);

export default function Gift({ onSelect }) {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const media = gsap.matchMedia();

        media.add('(prefers-reduced-motion: no-preference)', () => {
            const animations = leafMotion.map((motion) => {
                const leaf = sectionRef.current.querySelector(`.gift__decoration--${motion.leaf}`);
                const initialBounds = leaf.getBoundingClientRect();
                const baseRotation = Number(gsap.getProperty(leaf, 'rotation'));

                gsap.set(leaf, { transformOrigin: motion.origin });

                // Keep the rotated leaf in place when moving its pivot to the stem.
                const pivotBounds = leaf.getBoundingClientRect();
                const baseX = Number(gsap.getProperty(leaf, 'x')) + initialBounds.left - pivotBounds.left;
                const baseY = Number(gsap.getProperty(leaf, 'y')) + initialBounds.top - pivotBounds.top;
                gsap.set(leaf, { x: baseX, y: baseY });

                return gsap.timeline({ paused: true, delay: motion.delay })
                    .to(leaf, {
                        rotation: baseRotation + motion.rotation,
                        x: baseX + motion.x,
                        y: baseY + motion.y,
                        duration: motion.duration / 2,
                        ease: 'sine.inOut',
                    })
                    .to(leaf, {
                        rotation: baseRotation - motion.rotation,
                        x: baseX - motion.x,
                        y: baseY - motion.y,
                        duration: motion.duration,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                    });
            });

            const trigger = ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                onToggle: ({ isActive }) => {
                    animations.forEach((animation) => isActive ? animation.resume() : animation.pause());
                },
            });

            if (trigger.isActive) animations.forEach((animation) => animation.resume());
        }, sectionRef);

        return () => media.revert();
    }, []);

    return (
        <section ref={sectionRef} className="gift" id="gift" aria-labelledby="gift-title">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <img
                    key={i}
                    className={`gift__decoration gift__decoration--${i}`}
                    src={assets[`imgObject${i}`]}
                    alt=""
                    loading="lazy"
                />
            ))}
            <div className="inner gift__inner">
                <h2 className="gift__title" id="gift-title">
                    마음을 나누는
                    <br />
                    가을 선물
                </h2>
                <p className="gift__description">
                    소중한 마음을 담아 전하는 뚜레쥬르의 특별한 추석 선물
                </p>
                <div className="gift__grid">
                    {gifts.map((gift) => {
                        const index = gift.designIndex;
                        return (
                        <GiftCard
                            className={`gift__card gift__card--${index}`}
                            key={gift.title}
                            title={gift.title}
                            subtitle={gift.subtitle.map((line) => (
                                <span key={line}>{line}</span>
                            ))}
                            description={gift.description}
                            arrowSrc={
                                index === 2
                                    ? '/images/common/gift-set-arrow.svg'
                                    : index === 1
                                      ? '/images/common/gift-roll-arrow.svg'
                                    : '/images/common/gift-cake-arrow.svg'
                            }
                            arrowSize={40.79844665527344}
                            onClick={event => onSelect(gift.title, event.currentTarget)}
                        >
                            {index === 0 && (
                                <span className="gift__cake-art" aria-hidden="true">
                                    <img src="/images/common/gift-cake-illustration.png" alt="" />
                                </span>
                            )}
                            {index === 1 && (
                                <span className="gift__roll-art" aria-hidden="true">
                                    <img src="/images/common/gift-roll-illustration.png" alt="" />
                                </span>
                            )}
                            {index === 2 && (
                                <span className="gift__set-art" aria-hidden="true">
                                    <img src="/images/common/gift-set-illustration.png" alt="" />
                                </span>
                            )}
                        </GiftCard>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
