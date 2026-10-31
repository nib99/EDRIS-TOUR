import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import type { ReactNode } from "react";
import { InstallButton } from "@/components/install-button";
import { PHONES } from "@/lib/catalog";
import { LANGS, type Lang } from "@/lib/i18n-lang";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const LABELS: Record<Lang, string> = { om: "OM", am: "AM", en: "EN" };

function Mark() {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-md bg-forest font-display text-lg leading-none text-on-forest">
      ET
    </span>
  );
}

export function PublicChrome({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const nav = [
    { to: "/", label: t.navHome },
    { to: "/services", label: t.navServices },
    { to: "/inquire", label: t.navInquire },
    { to: "/track", label: t.navTrack },
    { to: "/contact", label: t.navContact },
  ] as const;

  return (
    <div className="min-h-screen">
      <div className="h-1 bg-forest" />
      <header className="sticky top-0 z-30 border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <Mark />
            <span className="min-w-0">
              <span className="block font-display text-lg leading-none text-ink">Edris</span>
              <span className="block text-sm text-muted">{t.brandLine}</span>
            </span>
          </Link>
          <nav className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto sm:flex-1" aria-label={t.navServices}>
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex h-11 shrink-0 items-center rounded-md px-3 text-sm font-medium text-muted hover:bg-paper-2 hover:text-ink"
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "inline-flex h-11 shrink-0 items-center rounded-md bg-paper-2 px-3 text-sm font-semibold text-ink" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ms-auto flex items-center gap-1">
            <div className="flex rounded-md border border-line bg-surface p-0.5" role="group" aria-label={t.langLabel}>
              {LANGS.map((code) => (
                <button
                  key={code}
                  type="button"
                  aria-pressed={lang === code}
                  onClick={() => setLang(code)}
                  className={cn(
                    "h-10 min-w-10 rounded-sm px-2 text-xs font-semibold",
                    lang === code ? "bg-forest text-on-forest" : "text-muted hover:text-ink",
                  )}
                >
                  {LABELS[code]}
                </button>
              ))}
            </div>
            <InstallButton />
            <a
              href={`tel:${PHONES[0].tel}`}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-forest px-3 text-sm font-semibold text-on-forest hover:bg-forest-deep"
            >
              <Phone className="size-4" aria-hidden="true" />
              <span className="hidden md:inline">{t.callNow}</span>
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-display text-2xl text-ink">{t.thanks}</p>
            <p className="mt-1 text-muted">{t.owner}</p>
            <p className="mt-4 max-w-md text-pretty text-ink">{t.closingBody}</p>
          </div>
          <div className="grid content-start gap-2">
            {PHONES.map((phone) => (
              <a key={phone.tel} href={`tel:${phone.tel}`} className="text-lg font-medium text-ink hover:text-forest">
                {phone.display}
              </a>
            ))}
            <Link to="/admin" className="mt-3 w-fit text-sm text-faint hover:text-ink">
              {t.ownerDesk}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
