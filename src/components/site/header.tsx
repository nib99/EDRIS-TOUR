import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { Lang } from "@/lib/i18n/translations";
import { LANG_LABELS } from "@/lib/i18n/translations";

export function Header() {
  const [open, setOpen] = useState(false);
  const { t, lang, setLang } = useI18n();

  const links = [
    { href: "#film", label: t.nav.story },
    { href: "#journeys", label: t.nav.journeys },
    { href: "#services", label: t.nav.services },
    { href: "#faq", label: t.nav.faq },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#film" className="brand-mark" aria-label="Idris Tour and Travel, home">
          <span className="brand-icon brand-logo">
            <img src="/logo.png" alt="" width={40} height={40} />
          </span>
          <span className="brand-copy">
            <span className="brand-name">{t.brandName}</span>
            <span className="brand-tag">{t.brandTag}</span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.href} className="nav-link" href={link.href}>
              {link.label}
            </a>
          ))}
          <div className="lang-switch" role="group" aria-label="Language">
            {(["om", "am", "en"] as Lang[]).map((code) => (
              <button
                key={code}
                type="button"
                className={lang === code ? "lang-btn active" : "lang-btn"}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="button-primary" href="#enquire">
            {t.nav.plan} <ArrowUpRight className="size-4" aria-hidden="true" />
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
          <div className="lang-switch mobile-lang" role="group" aria-label="Language">
            {(["om", "am", "en"] as Lang[]).map((code) => (
              <button
                key={code}
                type="button"
                className={lang === code ? "lang-btn active" : "lang-btn"}
                onClick={() => {
                  setLang(code);
                  setOpen(false);
                }}
                aria-pressed={lang === code}
              >
                {LANG_LABELS[code]}
              </button>
            ))}
          </div>
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a className="button-primary" href="#enquire" onClick={() => setOpen(false)}>
            {t.nav.plan} <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </nav>
      ) : null}
    </header>
  );
}
