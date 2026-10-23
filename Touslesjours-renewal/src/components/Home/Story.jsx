import { useId, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assets } from '../../data/home';
import BakerVideo from './BakerVideo';
import './Story.css';

gsap.registerPlugin(ScrollTrigger);

const brandLetters = 'TOUSlesJOURS'.split('');
const walkingCharacterShape = 'M 394 0 H 614 V 138 H 545 L 530 160 L 526 179 L 497 177 L 455 173 L 419 166 V 132 H 394 Z';
const walkingGroundPath = 'M 0 207 C 132 165 270 118 394 145 L 410 148 L 420 150 L 430 152 L 440 156 L 450 160 L 460 163 L 470 167 L 480 169 L 490 171 L 500 173 L 510 174 L 520 175 L 530 176 L 540 177 L 550 177 C 612 181 654 163 687 152';
const brandGeometry = [[41.88,27.78,-35.22],[43.02,27.02,-43.56],[44.72,26.44,-23.18],[46.15,26.12,-20.06],[48.33,25.86,-2.81],[49.06,25.86,-.39],[50.1,25.86,4.59],[51.67,25.86,15.75],[52.45,26.07,21.52],[53.85,26.49,28.78],[55.1,27.11,32.9],[56.25,28.26,46.29]];

export default function Story() {
  const breadRef = useRef(null);
  const walkingRef = useRef(null);
  const walkingStepRef = useRef(null);
  const groundPathRef = useRef(null);
  const curveRef = useRef(null);
  const letteringRef = useRef(null);
  const curveMaskId = `story-curve-${useId().replace(/:/g, '')}`;
  const walkingMaskId = `story-walk-${useId().replace(/:/g, '')}`;

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const letteringReveal = gsap.fromTo(letteringRef.current, {
        clipPath: 'inset(0 100% 0 0)',
      }, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: letteringRef.current,
          start: 'top 85%',
          toggleActions: 'restart reset restart reset',
        },
      });
      const character = walkingRef.current;
      const ground = groundPathRef.current;
      const length = ground.getTotalLength();
      const position = { progress: 0 };
      const step = walkingStepRef.current;
      // Anchor the body's sway at the feet, keeping the painted ground still.
      gsap.set(step, { svgOrigin: '478 170' });
      const updatePosition = () => {
        const distance = position.progress * length;
        const point = ground.getPointAtLength(distance);
        const stride = distance / 42 * Math.PI;
        const lift = Math.sin(stride) ** 2;
        const settle = Math.min(1, position.progress * 20, (1 - position.progress) * 20);
        // Align the character's feet with the stationary ground in SVG coordinates.
        gsap.set(character, { x: point.x - 478, y: point.y - 170 });
        // Tie each footfall to distance so stopping or reversing scroll keeps its rhythm.
        gsap.set(step, {
          y: -3.5 * lift * settle,
          rotation: Math.sin(stride) * 1.8 * settle,
          scaleX: 1 + 0.008 * lift * settle,
          scaleY: 1 - 0.016 * lift * settle,
        });
      };
      updatePosition();
      const walk = gsap.timeline({
        scrollTrigger: {
          trigger: breadRef.current,
          start: 'bottom 110%',
          end: 'bottom 10%',
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
      });
      walk.to(position, {
        progress: 1,
        duration: 1,
        ease: 'none',
        onUpdate: updatePosition,
      }, 0);
      const replayOnPageReturn = event => {
        if (!event.persisted) return;
        ScrollTrigger.refresh();
        if (letteringReveal.scrollTrigger.isActive) letteringReveal.restart();
        else letteringReveal.pause(0);
      };
      window.addEventListener('pageshow', replayOnPageReturn);
      return () => window.removeEventListener('pageshow', replayOnPageReturn);
    });
    return () => media.revert();
  }, []);

  useLayoutEffect(() => {
    const path = curveRef.current;
    const length = path.getTotalLength();
    const context = gsap.context(() => {
      gsap.fromTo(path, {
        attr: { 'stroke-dasharray': `${length} ${length}`, 'stroke-dashoffset': length },
      }, {
        attr: { 'stroke-dashoffset': 0 },
        duration: 2.5,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: breadRef.current,
          start: 'top center',
          toggleActions: 'restart reset restart reset',
        },
      });
    });
    return () => context.revert();
  }, []);

  return <section className="story" id="story" aria-label="뚜레쥬르 브랜드 이야기">
    <div ref={breadRef} className="story__bread">
      <div className="inner story__inner">
        <div className="story__visual"><h2>Good Bread<br />Brighter Days</h2><BakerVideo /></div>
        <div className="story__copy"><div><h3>Freshly Baked, Every Day</h3><p>뚜레쥬르는 매일 매장에서 직접 빵을 구워 신선함을 전합니다.<br />하루에도 여러 번 갓 구운 빵을 준비해 언제 방문해도<br />따뜻하고 맛있는 빵을 만날 수 있도록 노력합니다.<br />고소한 향과 따스한 온기로 매일의 일상에 맛있는 행복을 더합니다.</p></div>
          <div><h3>Good Ingredients, Better Bread</h3><p>좋은 빵은 좋은 재료에서 시작됩니다.<br />뚜레쥬르는 오랜 제분 기술을 바탕으로 개발한<br />베이커리 맞춤 밀가루와 엄선한 재료를 사용합니다.<br />빵마다 어울리는 맛과 식감을 살리고, 좋은 재료를 기본으로<br />건강하고 정직한 빵과 케이크를 만들기 위해 노력합니다.</p></div>
        </div>
      </div>
      {[8,9,11].map(i => <img key={i} ref={i === 11 ? letteringRef : undefined} className={`story__decoration story__decoration--${i}`} src={assets[`imgObject${i}`]} alt="" loading="lazy" />)}
      <svg className="story__decoration story__decoration--10" viewBox="0 0 687 208" preserveAspectRatio="none" style={{ overflow: 'visible' }} aria-hidden="true" focusable="false">
        <defs>
          <path ref={groundPathRef} d={walkingGroundPath} />
          <mask id={`${walkingMaskId}-character`} maskUnits="userSpaceOnUse" x="0" y="0" width="687" height="208" style={{ maskType: 'luminance' }}>
            <path d={walkingCharacterShape} fill="white" />
            <path d={walkingGroundPath} fill="none" stroke="black" strokeWidth="5" />
          </mask>
          <mask id={`${walkingMaskId}-ground`} maskUnits="userSpaceOnUse" x="0" y="0" width="687" height="208" style={{ maskType: 'luminance' }}>
            <rect width="687" height="208" fill="white" />
            <path d={walkingCharacterShape} fill="black" />
            <path d={walkingGroundPath} fill="none" stroke="white" strokeWidth="5" />
          </mask>
        </defs>
        <image href={assets.imgObject10} width="687" height="208" preserveAspectRatio="none" mask={`url(#${walkingMaskId}-ground)`} />
        <g ref={walkingRef}>
          <g ref={walkingStepRef}>
            <image href={assets.imgObject10} width="687" height="208" preserveAspectRatio="none" mask={`url(#${walkingMaskId}-character)`} />
          </g>
        </g>
      </svg>
      <svg className="story__decoration story__decoration--12" viewBox="0 0 387 183" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <mask id={curveMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width="387" height="183" style={{ maskType: 'alpha' }}>
            {/* Follow the PNG's centerline; the image retains its original stroke and texture. */}
            <path ref={curveRef}
              d="M 386 0 C 354 58 292 91 223 95 C 197 96 172 94 165 75 C 158 57 169 44 186 42 C 200 39 214 48 219 65 C 226 87 209 110 188 129 C 145 161 77 185 0 181"
              fill="none" stroke="white" strokeWidth="8" strokeLinecap="butt"
              strokeDasharray="0 10000" strokeDashoffset="10000" />
          </mask>
        </defs>
        <image href={assets.imgObject12} width="387" height="183" preserveAspectRatio="none" mask={`url(#${curveMaskId})`} />
      </svg>
    </div>
    <div className="story__tradition">
      <div className="story__room"><img src={assets.imgFrame40} alt="차분한 빛이 비치는 뚜레쥬르 공간" loading="lazy" /><h2>A Little more about<br />TOUS les JOURS</h2></div>
      <div className="story__innovation"><span className="story__brand" aria-label="TOUS les JOURS">{brandLetters.map((letter,i) => <span aria-hidden="true" key={i} style={{left:`${brandGeometry[i][0]}%`,top:`${brandGeometry[i][1]}%`,transform:`rotate(${brandGeometry[i][2]}deg)`}}>{letter}</span>)}</span><h2>Tradition<br /><span>Meets</span><br />Innovation</h2><p>뚜레쥬르는 매일 매장에서 직접 빵을 굽는 기본을 지키면서도,<br />새로운 제품과 방식을 끊임없이 고민합니다.<br />맛과 품질에 대한 원칙을 바탕으로 새로운 시도를 이어가며,<br />더 나은 베이커리 경험을 만들어갑니다.</p>
        <img className="story__small-decoration story__small-decoration--13" src={assets.imgObject13} alt="" loading="lazy" />
        <img className="story__small-decoration story__small-decoration--14" src={assets.imgObject14} alt="" loading="lazy" />
      </div>
    </div>
  </section>;
}
