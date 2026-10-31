import { useEffect, useRef, useState } from "react";
import { ArrowDown, Compass, MapPin, Pause, Phone, Play } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const WHATSAPP_NUMBER = "251922005374";
const CALL_NUMBER = "+251922005374";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Showcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [held, setHeld] = useState(false);
  const { t } = useI18n();
  const waText = encodeURIComponent("Hello Idris Tour and Travel");

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

    void video
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
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
          <p className="eyebrow">{t.hero.kicker}</p>
          <h1>{t.hero.title}</h1>
          <p className="hero-intro">{t.hero.subtitle}</p>

          {/* Primary contact CTAs — professional WhatsApp + Call */}
          <div className="hero-contact-actions">
            <a
              className="hero-btn hero-btn-wa"
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="hero-btn-icon">
                <WhatsAppIcon className="size-5" />
              </span>
              <span className="hero-btn-text">
                <span className="hero-btn-label">{t.hero.whatsappCta}</span>
                <span className="hero-btn-sub">+251 922 00 53 74</span>
              </span>
            </a>
            <a className="hero-btn hero-btn-call" href={`tel:${CALL_NUMBER}`}>
              <span className="hero-btn-icon">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <span className="hero-btn-text">
                <span className="hero-btn-label">{t.hero.callCta}</span>
                <span className="hero-btn-sub">+251 922 00 53 74</span>
              </span>
            </a>
          </div>

          <div className="hero-actions">
            <a className="button-primary" href="#services">
              {t.hero.cta} <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <a className="button-quiet" href="#enquire">
              {t.nav.plan}
            </a>
          </div>
          <div className="hero-meta" aria-label="Travel desk location and focus">
            <span>
              <MapPin className="size-4" aria-hidden="true" /> Bole, Addis Ababa
            </span>
            <span>Passport · Visa · Flights · Umrah</span>
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
            <p className="eyebrow">{t.servicesSection.kicker}</p>
            <h2 id="poster-heading">{t.hero.title}</h2>
            <p>{t.servicesSection.intro}</p>
            <a className="button-outline" href="#enquire">
              {t.nav.plan}
            </a>
            <div className="poster-note">
              <Compass className="size-4" aria-hidden="true" />
              {t.footer.tagline}
            </div>
          </div>
          <div className="poster-frame">
            <img
              src="/hero-poster.jpg"
              alt="Idris Tour and Travel"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>
    </>
  );
}
