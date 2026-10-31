import { useEffect, useRef } from "react";

export function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      video.pause();
      video.removeAttribute("autoplay");
      return;
    }
    video.play().catch(() => undefined);
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      poster="/hero-poster.jpg"
      preload="auto"
      aria-hidden="true"
    >
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  );
}
