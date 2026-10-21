"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BUSINESS, waLink, telLink } from "@/lib/business";

type Tracking = {
  code: string;
  name: string;
  service: string;
  status: string;
  statusLabel: { en: string; am: string; om: string };
  createdAt: string;
  updatedAt: string;
  documents: { required: number; pending: number; done: number };
};

function TrackInner() {
  const params = useSearchParams();
  const initial = params.get("token") || params.get("code") || "";
  const [token, setToken] = useState(initial);
  const [data, setData] = useState<Tracking | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "am" | "om">("en");

  async function lookup(code?: string) {
    const t = (code ?? token).trim();
    if (!t) {
      setError("Enter your tracking code.");
      return;
    }
    setLoading(true);
    setError("");
    setData(null);
    const res = await fetch(`/api/track?token=${encodeURIComponent(t)}`, { cache: "no-store" });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error || "Not found.");
      return;
    }
    setData(json.tracking);
  }

  useEffect(() => {
    if (initial) lookup(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const label = data ? data.statusLabel[lang] : "";

  return (
    <main className="track-shell">
      <header className="track-header">
        <a href="/" className="track-brand">
          <strong>EDRIS</strong>
          <span>TOUR & TRAVEL</span>
        </a>
        <div className="track-langs">
          {(["om", "am", "en"] as const).map((l) => (
            <button key={l} className={lang === l ? "active" : ""} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section className="track-card">
        <span className="track-eyebrow">
          {lang === "om" ? "Haala gaaffii" : lang === "am" ? "የጥያቄ ሁኔታ" : "Request status"}
        </span>
        <h1>
          {lang === "om" ? "Gaaffii keessan hordofaa" : lang === "am" ? "ጥያቄዎን ይከታተሉ" : "Track your request"}
        </h1>
        <p className="track-sub">
          {lang === "om"
            ? "Koodii hordoffii kan isinif kenname galchaa."
            : lang === "am"
              ? "የተሰጠዎትን የመከታተያ ኮድ ያስገቡ።"
              : "Enter the tracking code you received from our office."}
        </p>

        <form
          className="track-form"
          onSubmit={(e) => {
            e.preventDefault();
            lookup();
          }}
        >
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="EDR-…… or tracking token"
            autoFocus
          />
          <button type="submit" disabled={loading}>
            {loading ? "…" : lang === "om" ? "Barbaadi" : lang === "am" ? "ፈልግ" : "Look up"}
          </button>
        </form>
        {error && <div className="track-error">{error}</div>}
      </section>

      {data && (
        <section className="track-result">
          <div className="track-status-pill" data-status={data.status}>
            {label}
          </div>
          <h2>{data.name}</h2>
          <p className="track-service">{data.service}</p>
          <dl className="track-dl">
            <div>
              <dt>{lang === "am" ? "ኮድ" : "Code"}</dt>
              <dd>{data.code}</dd>
            </div>
            <div>
              <dt>{lang === "om" ? "Kan uumame" : lang === "am" ? "ተፈጥሯል" : "Submitted"}</dt>
              <dd>{new Date(data.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt>{lang === "om" ? "Haaromsame" : lang === "am" ? "ተዘምኗል" : "Updated"}</dt>
              <dd>{new Date(data.updatedAt).toLocaleString()}</dd>
            </div>
            {data.documents.required > 0 && (
              <div>
                <dt>{lang === "om" ? "Dokumeentii" : lang === "am" ? "ሰነዶች" : "Documents"}</dt>
                <dd>
                  {data.documents.done} / {data.documents.required}{" "}
                  {lang === "om" ? "qophaa'e" : lang === "am" ? "ተቀብለዋል" : "received"}
                  {data.documents.pending > 0
                    ? ` · ${data.documents.pending} ${lang === "en" ? "pending" : lang === "am" ? "በመጠባበቅ" : "eegaa"}`
                    : ""}
                </dd>
              </div>
            )}
          </dl>
          <div className="track-actions">
            <a className="btn primary" href={telLink()}>
              📞 {BUSINESS.phoneDisplay}
            </a>
            <a className="btn ghost" href={waLink(`Selam, tracking ${data.code}`)} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
          <p className="track-office">
            {BUSINESS.owner} · {BUSINESS.location}
          </p>
        </section>
      )}

      <footer className="track-footer">
        <a href="/">← {BUSINESS.name}</a>
        <span>
          {BUSINESS.location} · {BUSINESS.phoneDisplay}
        </span>
      </footer>
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<main className="track-shell"><p style={{ padding: 40 }}>Loading…</p></main>}>
      <TrackInner />
    </Suspense>
  );
}
