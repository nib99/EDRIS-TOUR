import { useState, useEffect } from "react";
import { Compass, Menu, X } from "lucide-react";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#poster", label: "Poster" },
  { href: "#journeys", label: "Journeys" },
  { href: "#services", label: "Services" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line/80 bg-ink/90 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.25rem]">
        <a href="#hero" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full border border-gold/80 bg-ink/40 text-gold shadow-[0_0_20px_-4px_rgba(226,179,64,0.35)] backdrop-blur-sm">
            <Compass className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-wide text-gold">
              Idris Tour
            </span>
            <span className="block text-[10px] tracking-[0.22em] text-muted uppercase">
              & Travel
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-cream/90 transition-colors duration-200 hover:text-gold"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#enquire"
            className="inline-flex h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-ink transition-all duration-200 hover:bg-gold-deep active:scale-[0.96]"
          >
            Start your journey
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full border border-cream/25 bg-ink/30 text-cream backdrop-blur-sm md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav
          className="border-t border-line/60 bg-ink/95 px-4 py-3 backdrop-blur-xl md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex h-11 items-center text-sm font-medium text-cream/90"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#enquire"
                className="flex h-11 items-center justify-center rounded-full bg-gold text-sm font-semibold text-ink"
                onClick={() => setOpen(false)}
              >
                Start your journey
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
