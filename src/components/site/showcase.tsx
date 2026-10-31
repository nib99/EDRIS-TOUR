import { useEffect, useRef, useState } from "react";
import { Pause, Play, ChevronDown, MapPin, Plane } from "lucide-react";

export function Showcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    video.muted = true;
    if (reduce) {
      video.pause();
      setPlaying(false);
      setHeld(true);
      return;
    }
    const start = video.play();
    if (start) {
      start
        .then(() => setPlaying(true))
        .catch(() => {
          setPlaying(false);
          setHeld(true);
        });
    }
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().then(() => {
        setPlaying(true);
        setHeld(false);
      });
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      {/* ─── Cinematic Hero with Background Video ─── */}
      <section
        id="hero"
        className="relative isolate min-h-[100svh] overflow-hidden bg-ink"
        aria-label="Hero"
      >
        {/* Full-bleed video */}
        <div className="absolute inset-0 -z-10">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/hero-poster.jpg"
            preload="auto"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          {/* Layered overlays for depth & readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-ink/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,20,40,0.55)_100%)]" />
        </div>

        {/* Content */}
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-20 pt-28 sm:pb-24 sm:pt-32">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-ink/40 px-4 py-1.5 text-xs font-medium tracking-widest text-gold uppercase backdrop-blur-sm">
              <MapPin className="size-3.5" aria-hidden />
              Addis Ababa · Ethiopia
            </div>

            <h1 className="font-display text-5xl leading-[1.05] font-semibold tracking-tight text-cream sm:text-6xl md:text-7xl lg:text-[5.25rem]">
              From Ethiopia
              <span className="mt-1 block text-gold">to the world</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
              Premium Umrah journeys, international flights, carefully chosen hotels,
              and visa support — planned with quiet precision from Bole.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#journeys"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-sm font-semibold text-ink shadow-[0_0_0_1px_rgba(226,179,64,0.3)] transition-all duration-200 hover:bg-gold-deep hover:shadow-[0_8px_30px_-8px_rgba(226,179,64,0.45)] active:scale-[0.97]"
              >
                <Plane className="size-4" aria-hidden />
                Explore journeys
              </a>
              <a
                href="#enquire"
                className="inline-flex h-12 items-center rounded-full border border-cream/30 bg-cream/5 px-7 text-sm font-medium text-cream backdrop-blur-sm transition-all duration-200 hover:border-gold/60 hover:bg-gold/10 hover:text-gold active:scale-[0.97]"
              >
                Request a plan
              </a>
            </div>
          </div>

          {/* Film controls + scroll cue */}
          <div className="absolute right-4 bottom-6 left-4 flex items-center justify-between sm:right-6 sm:bottom-8 sm:left-6">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-cream/20 bg-ink/50 px-4 text-xs font-medium text-cream/90 backdrop-blur-md transition-colors hover:border-gold/50 hover:text-gold"
              aria-label={playing ? "Pause background film" : "Play background film"}
            >
              {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {playing ? "Pause film" : held ? "Play film" : "Play film"}
            </button>

            <a
              href="#poster"
              className="hidden items-center gap-1.5 text-xs tracking-widest text-muted uppercase transition-colors hover:text-gold sm:inline-flex"
            >
              Scroll
              <ChevronDown className="size-3.5 animate-bounce" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Official Poster ─── */}
      <section
        id="poster"
        className="scroll-mt-20 border-t border-line bg-ink"
        aria-label="Official poster"
      >
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-6 sm:pt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] text-gold uppercase">Official poster</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-cream sm:text-4xl">
                The journey begins here
              </h2>
            </div>
            <a
              href="#enquire"
              className="inline-flex h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-ink transition-transform duration-150 ease-out active:scale-[0.96]"
            >
              Start your journey today
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16">
          <div className="overflow-hidden rounded-2xl border border-line/80 bg-navy shadow-[0_25px_60px_-20px_rgba(0,0,0,0.55)]">
            <img
              src="/hero-poster.jpg"
              alt="Idris Tour and Travel poster. From Ethiopia to the world. Special Umrah journeys to Saudi Arabia. Services include international flights, hotels, tour packages, and visa assistance."
              className="block h-auto w-full bg-ink object-cover"
              loading="lazy"
            />
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            Designed for clarity — every service visible at a glance.
          </p>
        </div>
      </section>
    </>
  );
}
