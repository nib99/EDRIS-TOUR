"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Lang = "om" | "am" | "en";

const PHONE_1 = "+251922005374";
const PHONE_LOCAL = "0922005374";
const OWNER = "EDRIS MUHAMMED";
const LOCATION = "Finfinnee Boolee";
const WA = "https://wa.me/251922005374";
const TG = "https://t.me/+251922005374";

const copy = {
  om: {
    nav: ["Mana", "Tajaajila", "Passport", "Nu Qunnamaa"],
    badge: "ODUU GAMMACHIISAA",
    heroTitle: "EDRIS TOUR & TRAVEL",
    heroSub: "Imala keessan salphaa, saffisaa fi amanamaa taasisuuf tajaajila dokumeentii fi imalaa walitti qabu.",
    primary: "Tajaajila gaafadhu",
    call: "Nuuf bilbili",
    passport: "PASSPORTII",
    passportIntro: "Passportii baafachuuf adeemsa fi qophii dokumeentii irratti isin gargaarra.",
    urgent: "Urgent Passport",
    two: "Tajaajila guyyaa 2",
    five: "Tajaajila guyyaa 5",
    normal: "Normal Service",
    requirements: "Wantoota barbaachisan",
    reqs: ["Waraqaa dhalootaa", "Waraqaa eenyummaa", "National ID"],
    servicesTitle: "Tajaajiloota biroo",
    services: [
      ["COC", "COC sa'aatii 24 keessatti qophii irratti gargaarsa."],
      ["Police Clearance", "Adeemsa police clearance irratti qajeelfama fi gargaarsa."],
      ["Medical Appointment", "Medical appointment qindeessuu irratti gargaarsa."],
      ["ILMS", "ILMS irratti tajaajila fi qajeelfama barbaachisaa."],
      ["Air Ticket", "Tikeetii xayyaaraa filachuu fi qindeessuu, gatii madaalawaan."],
      ["Visa Support", "Namoota gara biyyoota Arabaa deemanif visa application support."]
    ],
    note: "Hubachiisa: Murtiin passportii, visa fi hayyama mootummaa qaama mootummaa ykn embassy ilaallata; nuti adeemsa, qophii fi qindoomina irratti isin gargaarra.",
    formTitle: "Tajaajila gaafadhu",
    name: "Maqaa guutuu",
    phone: "Lakkoofsa bilbilaa",
    service: "Tajaajila filadhu",
    message: "Ergaa / odeeffannoo dabalataa",
    send: "Gaaffii ergi",
    contact: "Nu Qunnamaa",
    contactText: "Bakkuma jirtanitti nu qunnamaa. Gareen keenya odeeffannoo tajaajilaa fi adeemsa itti aanu isinif ibsa.",
    footer: "© 2026 Edris Tour & Travel. Tajaajila imalaa fi dokumeentii.",
    success: "Gaaffiin keessan ergameera. Yeroo gabaabaa keessatti isin qunnamna.",
    error: "Ergaan hin ergamne. Mee bilbilaan nu qunnamaa."
  },
  am: {
    nav: ["መነሻ", "አገልግሎቶች", "ፓስፖርት", "ያግኙን"],
    badge: "የምስራች",
    heroTitle: "EDRIS TOUR & TRAVEL",
    heroSub: "የጉዞና የሰነድ አገልግሎቶችን በቀላሉ፣ በፍጥነትና በታማኝነት እንዲያገኙ እንረዳዎታለን።",
    primary: "አገልግሎት ይጠይቁ",
    call: "ይደውሉ",
    passport: "ፓስፖርት",
    passportIntro: "የፓስፖርት ማመልከቻ ሂደትና የሚያስፈልጉ ሰነዶች ላይ እንረዳዎታለን።",
    urgent: "አስቸኳይ ፓስፖርት",
    two: "የ2 ቀን አገልግሎት",
    five: "የ5 ቀን አገልግሎት",
    normal: "መደበኛ አገልግሎት",
    requirements: "የሚያስፈልጉ ነገሮች",
    reqs: ["የልደት ማስረጃ", "የመታወቂያ ሰነድ", "ብሔራዊ መታወቂያ"],
    servicesTitle: "ሌሎች አገልግሎቶች",
    services: [
      ["COC", "የCOC ሂደትን በፍጥነት ለማከናወን እገዛ።"],
      ["Police Clearance", "የፖሊስ ማጽዳት ሰነድ ሂደት መመሪያና እገዛ።"],
      ["Medical Appointment", "የሕክምና ቀጠሮ ማስያዝ እገዛ።"],
      ["ILMS", "በILMS ሂደት ላይ መመሪያና እገዛ።"],
      ["Air Ticket", "የአየር ትኬት ማፈላለግና ማስያዝ።"],
      ["Visa Support", "ወደ አረብ ሀገራት ለሚጓዙ የቪዛ ማመልከቻ ድጋፍ።"]
    ],
    note: "ማስታወሻ፦ የፓስፖርት፣ የቪዛ እና የመንግስት ፈቃድ ውሳኔ በሚመለከተው መንግስታዊ ተቋም ወይም ኤምባሲ የሚሰጥ ነው። እኛ በሂደት፣ በሰነድ ዝግጅትና በቅንጅት እንረዳለን።",
    formTitle: "አገልግሎት ይጠይቁ",
    name: "ሙሉ ስም",
    phone: "ስልክ ቁጥር",
    service: "አገልግሎት ይምረጡ",
    message: "መልዕክት / ተጨማሪ መረጃ",
    send: "ጥያቄ ላክ",
    contact: "ያግኙን",
    contactText: "የትም ቦታ ሆነው ይደውሉልን። የአገልግሎቱን ሂደትና ቀጣይ እርምጃ እናብራራለን።",
    footer: "© 2026 Edris Tour & Travel. የጉዞና የሰነድ አገልግሎት።",
    success: "ጥያቄዎ ተልኳል። በቅርቡ እንገናኝዎታለን።",
    error: "መልዕክቱ አልተላከም። እባክዎ በስልክ ያግኙን።"
  },
  en: {
    nav: ["Home", "Services", "Passport", "Contact"],
    badge: "GOOD NEWS",
    heroTitle: "EDRIS TOUR & TRAVEL",
    heroSub: "A professional travel and document-support service designed to make your journey simpler, clearer and more convenient.",
    primary: "Request a service",
    call: "Call us",
    passport: "PASSPORT",
    passportIntro: "We support customers with passport application preparation and process guidance.",
    urgent: "Urgent Passport",
    two: "2-day service",
    five: "5-day service",
    normal: "Normal Service",
    requirements: "Required documents",
    reqs: ["Birth certificate", "Identification document", "National ID"],
    servicesTitle: "Other services",
    services: [
      ["COC", "Assistance with COC processing and document preparation."],
      ["Police Clearance", "Guidance and support for police clearance processing."],
      ["Medical Appointment", "Medical appointment coordination and support."],
      ["ILMS", "Guidance and assistance for ILMS-related processes."],
      ["Air Ticket", "Air-ticket search and booking support at competitive rates."],
      ["Visa Support", "Visa application support for customers traveling to Arab countries."]
    ],
    note: "Important: Passport, visa and government-permit decisions are made by the relevant government authority or embassy. We provide process, document-preparation and coordination support.",
    formTitle: "Request a service",
    name: "Full name",
    phone: "Phone number",
    service: "Select a service",
    message: "Message / additional details",
    send: "Send request",
    contact: "Contact us",
    contactText: "Call us from wherever you are. Our team can explain the service process and next steps.",
    footer: "© 2026 Edris Tour & Travel. Travel and document-support services.",
    success: "Your request was sent. We will contact you shortly.",
    error: "The request could not be sent. Please call us."
  }
} as const;

export default function Home() {
  const [lang, setLang] = useState<Lang>("om");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", service: "", message: "" });
  const t = copy[lang];

  
const serviceOptions = useMemo<string[]>(
  () => [
    ...t.services.map(([name]) => name),
    t.passport,
    t.urgent,
  ],
  [t]
);


  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "failed");
      setForm({ name: "", phone: "", service: "", message: "" });
      const code = data.trackingCode ? ` Tracking: ${data.trackingCode}` : "";
      setStatus(t.success + code);
    } catch {
      setStatus(t.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Edris Tour & Travel home">
          <Image src="/logo.jpg" alt="Edris Tour and Travel logo" width={54} height={54} priority />
          <span><strong>EDRIS</strong><small>TOUR & TRAVEL</small></span>
        </a>
        <nav>
          {t.nav.map((item, i) => (
            <a key={item} href={["#home", "#services", "#passport", "#contact"][i]}>{item}</a>
          ))}
        </nav>
        <div className="language">
          {(["om", "am", "en"] as Lang[]).map(x => (
            <button key={x} className={lang === x ? "active" : ""} onClick={() => setLang(x)}>
              {x.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section id="home" className="hero">
        <div className="hero-content">
          <div className="badge">{t.badge}</div>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroSub}</p>
          <div className="hero-actions">
            <a className="btn primary" href="#contact">{t.primary}</a>
            <a className="btn ghost" href={`tel:${PHONE_1}`}>{t.call} · 0922 005 374</a>
          </div>
          <div className="trust">
            <span>✓ {lang === "om" ? "Tajaajila saffisaa" : lang === "am" ? "ፈጣን አገልግሎት" : "Fast support"}</span>
            <span>✓ {lang === "om" ? "Afaan 3" : lang === "am" ? "3 ቋንቋዎች" : "3 languages"}</span>
            <span>✓ {lang === "om" ? "Bilbila irratti" : lang === "am" ? "በስልክ ይገናኙን" : "Phone support"}</span>
          </div>
        </div>
        <div className="hero-card">
          <Image src="/logo.jpg" alt="Edris Tour & Travel" width={440} height={440} priority />
          <div className="card-caption">Travel • Documents • Visa Support</div>
        </div>
      </section>

      <section id="passport" className="section">
        <div className="section-heading">
          <span className="eyebrow">{t.passport}</span>
          <h2>{t.passport}</h2>
          <p>{t.passportIntro}</p>
        </div>
        <div className="passport-grid">
          <article className="feature-card urgent">
            <div className="icon">⚡</div>
            <h3>{t.urgent}</h3>
            <div className="chips"><span>{t.two}</span><span>{t.five}</span></div>
            <p>{t.note}</p>
          </article>
          <article className="feature-card">
            <div className="icon">✓</div>
            <h3>{t.normal}</h3>
            <p>{t.requirements}</p>
            <ul>{t.reqs.map(x => <li key={x}>{x}</li>)}</ul>
          </article>
        </div>
      </section>

      <section id="services" className="section alt">
        <div className="section-heading">
          <span className="eyebrow">EDRIS</span>
          <h2>{t.servicesTitle}</h2>
        </div>
        <div className="service-grid">
          {t.services.map(([name, desc]) => (
            <article className="service-card" key={name}>
              <div className="service-icon">{name === "COC" ? "24" : name === "Air Ticket" ? "✈" : "✓"}</div>
              <h3>{name}</h3>
              <p>{desc}</p>
              <a href="#contact" onClick={() => setForm(v => ({ ...v, service: name }))}>
                {t.primary} →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section process">
        <div className="section-heading">
          <span className="eyebrow">SIMPLE PROCESS</span>
          <h2>{lang === "om" ? "Akkaataa itti hojjenna" : lang === "am" ? "የአገልግሎት ሂደት" : "How it works"}</h2>
        </div>
        <div className="steps">
          {(lang === "om"
            ? ["Nu qunnamaa", "Tajaajila filadhaa", "Dokumeentii qopheessaa", "Hordoffii fi odeeffannoo argadhaa"]
            : lang === "am"
            ? ["ያግኙን", "አገልግሎት ይምረጡ", "ሰነዶችን ያዘጋጁ", "ክትትልና መረጃ ያግኙ"]
            : ["Contact us", "Choose a service", "Prepare documents", "Receive follow-up and updates"]
          ).map((x, i) => <div className="step" key={x}><b>0{i + 1}</b><span>{x}</span></div>)}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-copy">
          <span className="eyebrow">{t.contact}</span>
          <h2>{t.contact}</h2>
          <p>{t.contactText}</p>
          <div className="owner-card">
            <strong>{OWNER}</strong>
            <span>📍 {LOCATION}</span>
          </div>
          <div className="phone-list">
            <a href={`tel:${PHONE_1}`}>📞 +251 922 00 53 74</a>
            <a href={WA} target="_blank" rel="noreferrer">💬 WhatsApp · 0922 005 374</a>
            <a href={TG} target="_blank" rel="noreferrer">✈️ Telegram · 0922 005 374</a>
          </div>
          <p className="track-hint">
            <a href="/track">{lang === "om" ? "Gaaffii keessan hordofaa →" : lang === "am" ? "ጥያቄዎን ይከታተሉ →" : "Track your request →"}</a>
          </p>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <h3>{t.formTitle}</h3>
          <label>{t.name}<input required value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} /></label>
          <label>{t.phone}<input required inputMode="tel" value={form.phone} onChange={e => setForm(v => ({ ...v, phone: e.target.value }))} /></label>
          <label>{t.service}
            <select required value={form.service} onChange={e => setForm(v => ({ ...v, service: e.target.value }))}>
              <option value="">—</option>
              {serviceOptions.map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label>{t.message}<textarea rows={4} value={form.message} onChange={e => setForm(v => ({ ...v, message: e.target.value }))} /></label>
          <button className="btn primary wide" disabled={busy}>{busy ? "…" : t.send}</button>
          {status && <p className="form-status" role="status">{status}</p>}
        </form>
      </section>

      <footer>
        <div><strong>EDRIS TOUR & TRAVEL</strong><p>{t.footer}</p></div>
        <div className="footer-links">
          <span>{OWNER} · {LOCATION}</span>
          <a href={`tel:${PHONE_1}`}>0922 005 374</a>
          <a href={WA} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={TG} target="_blank" rel="noreferrer">Telegram</a>
          <a href="/track">Track request</a>
        </div>
      </footer>
    </main>
  );
}
