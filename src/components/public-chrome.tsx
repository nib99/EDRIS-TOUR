import { Link, useRouterState } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { InstallButton } from "@/components/install-button";
import { PHONES } from "@/lib/catalog";
import { LANGS, type Lang } from "@/lib/i18n-lang";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const LABELS: Record<Lang, string> = { om: "OM", am: "AM", en: "EN" };

export function PublicChrome({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const cinematic = pathname === "/";
  const nav = [
    { to: "/", label: t.navHome },
    { to: "/services", label: t.navServices },
    { to: "/inquire", label: t.navInquire },
    { to: "/track", label: t.navTrack },
    { to: "/contact", label: t.navContact },
  ] as const;

  return (
    <div className="min-h-screen">
      {cinematic ? null : <div className="h-1 bg-forest" />}
      <header
        className={cn(
          "z-30",
          cinematic
            ? "absolute inset-x-0 top-0 border-b border-white/15 bg-ink/35 text-white backdrop-blur-md"
            : "sticky top-0 border-b border-line bg-paper",
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <BrandLogo className="size-12" alt={t.brand} />
            <span className="min-w-0">
              <span className={cn("block font-display text-lg leading-none", cinematic ? "text-white" : "text-ink")}>
                Edris
              </span>
              <span className={cn("block text-sm", cinematic ? "text-white/75" : "text-muted")}>{t.brandLine}</span>
            </span>
          </Link>
          <nav
            className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto sm:flex-1"
            aria-label={t.navServices}
          >
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center rounded-md px-3 text-sm font-medium",
                  cinematic ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-muted hover:bg-paper-2 hover:text-ink",
                )}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{
                  className: cn(
                    "inline-flex h-11 shrink-0 items-center rounded-md px-3 text-sm font-semibold",
                    cinematic ? "bg-white/15 text-white" : "bg-paper-2 text-ink",
                  ),
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ms-auto flex items-center gap-1">
            <div
              className={cn(
                "flex rounded-md border p-0.5",
                cinematic ? "border-white/20 bg-white/10" : "border-line bg-surface",
              )}
              role="group"
              aria-label={t.langLabel}
            >
              {LANGS.map((code) => (
                <button
                  key={code}
                  type="button"
                  aria-pressed={lang === code}
                  onClick={() => setLang(code)}
                  className={cn(
                    "h-10 min-w-10 rounded-sm px-2 text-xs font-semibold",
                    lang === code
                      ? "bg-forest text-on-forest"
                      : cinematic
                        ? "text-white/80 hover:text-white"
                        : "text-muted hover:text-ink",
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
      <main className={cinematic ? "" : "mx-auto max-w-6xl px-4 py-10 sm:py-14"}>{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-[1.4fr_1fr]">
          <div className="flex gap-4">
            <BrandLogo className="size-16" alt="" />
            <div>
              <p className="font-display text-2xl text-ink">{t.thanks}</p>
              <p className="mt-1 text-muted">{t.owner}</p>
              <p className="mt-4 max-w-md text-pretty text-ink">{t.closingBody}</p>
            </div>
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
