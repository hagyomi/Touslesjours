import { useLayoutEffect, useRef, useState } from 'react';

const videoSource = `${import.meta.env.BASE_URL}videos/baker-kneading-dough.mp4`;

export default function BakerVideo() {
  const [expanded, setExpanded] = useState(false);
  const trigger = useRef(null);
  const preview = useRef(null);
  const dialog = useRef(null);
  const player = useRef(null);

  useLayoutEffect(() => {
    if (!expanded) return;
    const modal = dialog.current;
    const video = player.current;
    const original = preview.current;
    const wasPlaying = !original.paused;
    const previousOverflow = document.body.style.overflow;
    const bounds = trigger.current.getBoundingClientRect();
    modal.showModal();
    document.body.style.overflow = 'hidden';
    const resumeAt = () => {
      video.currentTime = original.currentTime;
      video.play().catch(() => {});
    };
    if (video.readyState >= 1) resumeAt();
    else video.addEventListener('loadedmetadata', resumeAt, { once: true });
    original.pause();
    const target = video.getBoundingClientRect();
    const animation = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? null : video.animate([
      { transform: `translate(${bounds.left + bounds.width / 2 - target.left - target.width / 2}px, ${bounds.top + bounds.height / 2 - target.top - target.height / 2}px) scale(${bounds.width / target.width}, ${bounds.height / target.height})`, opacity: 0.4 },
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    ], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    return () => {
      animation?.cancel();
      video.removeEventListener('loadedmetadata', resumeAt);
      if (video.readyState >= 1) original.currentTime = video.currentTime;
      video.pause();
      modal.close();
      document.body.style.overflow = previousOverflow;
      if (wasPlaying) original.play().catch(() => {});
      trigger.current?.focus({ preventScroll: true });
    };
  }, [expanded]);

  return <>
    <button ref={trigger} className="story__baker" type="button" aria-label="반죽 영상 확대 보기" aria-haspopup="dialog" onClick={() => setExpanded(true)}>
      <video ref={preview} className="story__baker-video" src={videoSource} aria-label="반죽을 빚는 제빵사의 손" width="744" height="744" autoPlay muted loop playsInline preload="metadata" />
    </button>
    {expanded && <dialog ref={dialog} className="story__video-dialog" aria-label="반죽을 빚는 제빵사의 손 영상 확대 보기" onCancel={event => { event.preventDefault(); setExpanded(false); }} onClick={event => { if (event.target === event.currentTarget) setExpanded(false); }}>
      <button className="story__video-close" type="button" aria-label="확대 영상 닫기" onClick={() => setExpanded(false)} autoFocus>×</button>
      <video ref={player} className="story__video-player" src={videoSource} aria-label="반죽을 빚는 제빵사의 손" muted loop playsInline controls preload="auto" />
    </dialog>}
  </>;
}
