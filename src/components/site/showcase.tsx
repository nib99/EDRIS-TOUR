import { useEffect, useRef, useState } from "react";
import { ArrowDown, Compass, MapPin, Pause, Play } from "lucide-react";

export function Showcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      setPlaying(false);
      setHeld(true);
      return;
    }

    void video.play().then(() => {
      setPlaying(true);
    }).catch(() => {
      setPlaying(false);
      setHeld(true);
    });
  }, []);

  async function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
        setHeld(false);
      } catch {
        setPlaying(false);
        setHeld(true);
      }
    } else {
      video.pause();
      setPlaying(false);
      setHeld(true);
    }
  }

  return (
    <>
      <section id="film" className="hero" aria-label="Welcome to Idris Tour and Travel">
        <video
          ref={videoRef}
          className="hero-media"
          autoPlay
          muted
          loop
          playsInline
          poster="/journeys/world-cover.jpg"
          preload="auto"
          aria-hidden="true"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Rooted in Addis · Ready for the world</p>
          <h1>
            Your next
            <br />
            <em>great journey</em>
            <br />
            starts here.
          </h1>
          <p className="hero-intro">
            From a meaningful Umrah to a few days somewhere new, we help shape the
            journey from the first plan to the flight home.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="#journeys">
              Find your journey <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <a className="button-quiet" href="#services">
              Explore our services
            </a>
          </div>
          <div className="hero-meta" aria-label="Travel desk location and focus">
            <span><MapPin className="size-4" aria-hidden="true" /> Bole, Addis Ababa</span>
            <span>Umrah · Flights · Stays · Tours</span>
          </div>
        </div>
        <button
          type="button"
          className="film-control"
          onClick={toggle}
          aria-label={playing ? "Pause background film" : "Play background film"}
          aria-pressed={playing}
        >
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          {playing ? "Pause film" : held ? "Start film" : "Play film"}
        </button>
      </section>

      <section id="poster" className="poster-section" aria-labelledby="poster-heading">
        <div className="section-inner poster-layout">
          <div className="poster-copy">
            <p className="eyebrow">A little about us</p>
            <h2 id="poster-heading">From Ethiopia, with the world in mind.</h2>
            <p>
              A travel desk in Addis for journeys that matter: a pilgrimage,
              a family holiday, a first time abroad, or a ticket that simply
              needs to work.
            </p>
            <a className="button-outline" href="#enquire">
              Tell us what you have in mind
            </a>
            <div className="poster-note">
              <Compass className="size-4" aria-hidden="true" />
              Your Journey, Our Priority.
            </div>
          </div>
          <div className="poster-frame">
            <img
              src="/hero-poster.jpg"
              alt="Idris Tour and Travel brand poster: From Ethiopia to the world, with special Umrah journeys to Saudi Arabia."
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>
    </>
  );
}
