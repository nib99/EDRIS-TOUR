import { useState } from "react";
import { ArrowUpRight, Compass, Menu, X } from "lucide-react";

const links = [
  { href: "#poster", label: "Our story" },
  { href: "#journeys", label: "Journeys" },
  { href: "#services", label: "Travel services" },
  { href: "#faq", label: "Good to know" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#film" className="brand-mark" aria-label="Idris Tour and Travel, home">
          <span className="brand-icon">
            <Compass className="size-5" aria-hidden="true" />
          </span>
          <span className="brand-copy">
            <span className="brand-name">Idris Tour</span>
            <span className="brand-tag">&amp; Travel · Addis Ababa</span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.href} className="nav-link" href={link.href}>
              {link.label}
            </a>
          ))}
          <a className="button-primary" href="#enquire">
            Plan a journey <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a className="button-primary" href="#enquire" onClick={() => setOpen(false)}>
            Plan a journey <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </nav>
      ) : null}
    </header>
  );
}
