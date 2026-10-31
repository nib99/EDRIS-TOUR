import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Lang } from "@/lib/i18n/translations";
import { LANG_LABELS } from "@/lib/i18n/translations";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const ADMIN_PASS_KEY = "idris-admin-auth";
const DEFAULT_PASS = "idris2025";

function AdminPage() {
  const { t, lang, setLang, applyOverrides } = useI18n();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSub, setHeroSub] = useState("");
  const [servicesIntro, setServicesIntro] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(ADMIN_PASS_KEY) === "1") setAuthed(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setHeroTitle(t.hero.title);
    setHeroSub(t.hero.subtitle);
    setServicesIntro(t.servicesSection.intro);
  }, [t, lang]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (password === DEFAULT_PASS) {
      setAuthed(true);
      setError("");
      try {
        sessionStorage.setItem(ADMIN_PASS_KEY, "1");
      } catch {
        /* ignore */
      }
    } else {
      setError("Wrong password");
    }
  }

  function logout() {
    setAuthed(false);
    try {
      sessionStorage.removeItem(ADMIN_PASS_KEY);
    } catch {
      /* ignore */
    }
  }

  function save() {
    applyOverrides({
      hero: { ...t.hero, title: heroTitle, subtitle: heroSub },
      servicesSection: { ...t.servicesSection, intro: servicesIntro },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!authed) {
    return (
      <main className="admin-page">
        <form className="admin-login" onSubmit={login}>
          <h1>{t.admin.title}</h1>
          <p className="admin-hint">{t.admin.hint}</p>
          <label>
            {t.admin.password}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="admin-error">{error}</p> : null}
          <button type="submit" className="button-primary">
            {t.admin.login}
          </button>
          <a href="/" className="admin-back">
            ← Home
          </a>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-panel">
        <header className="admin-header">
          <h1>{t.admin.title}</h1>
          <div className="admin-actions">
            <div className="lang-switch">
              {(["om", "am", "en"] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  className={lang === code ? "lang-btn active" : "lang-btn"}
                  onClick={() => setLang(code)}
                >
                  {LANG_LABELS[code]}
                </button>
              ))}
            </div>
            <button type="button" className="button-ghost" onClick={logout}>
              {t.admin.logout}
            </button>
          </div>
        </header>

        <p className="admin-note">
          Edit content for the selected language. Changes are saved in this browser (localStorage) and
          appear on the public site immediately for visitors using the same browser profile. For a
          multi-user production setup, connect a database backend.
        </p>

        <label className="admin-field">
          Hero title
          <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
        </label>
        <label className="admin-field">
          Hero subtitle
          <textarea rows={3} value={heroSub} onChange={(e) => setHeroSub(e.target.value)} />
        </label>
        <label className="admin-field">
          Services intro
          <textarea rows={4} value={servicesIntro} onChange={(e) => setServicesIntro(e.target.value)} />
        </label>

        <div className="admin-save-row">
          <button type="button" className="button-primary" onClick={save}>
            {t.admin.save}
          </button>
          {saved ? <span className="admin-saved">Saved ✓</span> : null}
        </div>

        <a href="/" className="admin-back">
          ← View site
        </a>
      </div>
    </main>
  );
}
