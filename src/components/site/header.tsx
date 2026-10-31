import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Globe, Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { Lang } from "@/lib/i18n/translations";
import { LANG_LABELS } from "@/lib/i18n/translations";

export function Header() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { t, lang, setLang } = useI18n();

  const links = [
    { href: "#film", label: t.nav.story },
    { href: "#journeys", label: t.nav.journeys },
    { href: "#services", label: t.nav.services },
    { href: "#faq", label: t.nav.faq },
  ];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pickLang(code: Lang) {
    setLang(code);
    setLangOpen(false);
  }

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

          {/* Professional language menu */}
          <div className="lang-menu" ref={langRef}>
            <button
              type="button"
              className="lang-menu-trigger"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              aria-label="Change language"
              onClick={() => setLangOpen((v) => !v)}
            >
              <Globe className="size-4" aria-hidden="true" />
              <span className="lang-menu-current">{LANG_LABELS[lang]}</span>
              <ChevronDown
                className={`size-3.5 lang-chevron${langOpen ? " open" : ""}`}
                aria-hidden="true"
              />
            </button>
            {langOpen ? (
              <ul className="lang-menu-list" role="listbox" aria-label="Languages">
                {(["om", "am", "en"] as Lang[]).map((code) => (
                  <li key={code} role="option" aria-selected={lang === code}>
                    <button
                      type="button"
                      className={lang === code ? "lang-option active" : "lang-option"}
                      onClick={() => pickLang(code)}
                    >
                      <span className="lang-code">{code.toUpperCase()}</span>
                      <span className="lang-name">{LANG_LABELS[code]}</span>
                      {lang === code ? <span className="lang-check">✓</span> : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <a className="button-primary" href="#enquire">
            {t.nav.plan} <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </nav>

        <div className="header-mobile-actions">
          <div className="lang-menu mobile-lang-menu" ref={langOpen ? langRef : undefined}>
            <button
              type="button"
              className="lang-menu-trigger compact"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              aria-label="Change language"
              onClick={() => setLangOpen((v) => !v)}
            >
              <Globe className="size-4" aria-hidden="true" />
              <span>{lang.toUpperCase()}</span>
              <ChevronDown className={`size-3 lang-chevron${langOpen ? " open" : ""}`} aria-hidden="true" />
            </button>
            {langOpen ? (
              <ul className="lang-menu-list" role="listbox">
                {(["om", "am", "en"] as Lang[]).map((code) => (
                  <li key={code}>
                    <button
                      type="button"
                      className={lang === code ? "lang-option active" : "lang-option"}
                      onClick={() => {
                        pickLang(code);
                        setOpen(false);
                      }}
                    >
                      <span className="lang-code">{code.toUpperCase()}</span>
                      <span className="lang-name">{LANG_LABELS[code]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
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
      </div>

      {open ? (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
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
