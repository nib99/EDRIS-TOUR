import { createFileRoute, Link } from "@tanstack/react-router";
import { JOURNEY, PHONES, SERVICE_IDS, PASSPORT_SPEEDS } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/")({
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const docs = ["birth_certificate", "identity_card", "national_id"] as const;

  return (
    <div className="grid gap-16 sm:gap-20">
      <section className="grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-sm font-semibold tracking-wide text-forest">{t.greeting}</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl leading-[1.15] text-ink sm:text-6xl">{t.heroTitle}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{t.heroBody}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/inquire">{t.ctaInquire}</Link>
            </Button>
            <Button variant="secondary" asChild>
              <a href={`tel:${PHONES[0].tel}`}>{t.ctaCall}</a>
            </Button>
          </div>
        </div>
        <aside className="rounded-xl border border-line bg-surface p-4 shadow-panel lg:col-span-5">
          <p className="text-sm font-semibold text-forest">{t.deskEyebrow}</p>
          <h2 className="mt-2 font-display text-3xl text-ink">{t.deskTitle}</h2>
          <p className="mt-2 text-muted">{t.deskBody}</p>
          <div className="mt-5 grid gap-2">
            {PHONES.map((phone) => (
              <a
                key={phone.tel}
                href={`tel:${phone.tel}`}
                className="flex h-12 items-center justify-between rounded-md border border-line px-3 font-medium hover:bg-paper-2"
              >
                <span>{phone.display}</span>
                <span className="text-sm text-forest">{t.callNow}</span>
              </a>
            ))}
          </div>
          <p className="mt-4 text-sm text-faint">
            {t.city} · {t.owner}
          </p>
        </aside>
      </section>

      <section>
        <p className="text-sm font-semibold text-forest">{t.servicesEyebrow}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-lg font-display text-3xl text-ink sm:text-4xl">{t.servicesTitle}</h2>
          <Link to="/services" className="text-sm font-semibold text-forest">
            {t.ctaServices}
          </Link>
        </div>
        <p className="mt-3 max-w-2xl text-muted">{t.servicesIntro}</p>
        <ol className="mt-6">
          {SERVICE_IDS.map((id, index) => (
            <li key={id} className="grid grid-cols-[3rem_1fr] gap-3 border-t border-line py-5">
              <span className="font-display text-2xl tabular-nums text-forest">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-2xl text-ink">{t.services[id].title}</h3>
                <p className="mt-1 max-w-2xl text-muted">{t.services[id].body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold text-forest">{t.passportEyebrow}</p>
          <h2 className="mt-2 font-display text-3xl text-ink">{t.passportTitle}</h2>
          <p className="mt-3 text-muted">{t.passportIntro}</p>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          {PASSPORT_SPEEDS.map((speed) => (
            <li key={speed} className="bg-surface p-4">
              <p className="text-sm text-muted">{t.passportEyebrow}</p>
              <h3 className="mt-2 font-display text-2xl text-ink">{t.speeds[speed].title}</h3>
              <p className="mt-2 text-sm text-muted">{t.speeds[speed].body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="text-sm font-semibold text-forest">{t.requirementsEyebrow}</p>
        <h2 className="mt-2 font-display text-3xl text-ink">{t.requirementsTitle}</h2>
        <p className="mt-3 max-w-2xl text-muted">{t.requirementsIntro}</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {docs.map((key) => (
            <li key={key} className="rounded-xl border border-line bg-surface p-4 font-display text-xl text-ink">
              {t.docs[key]}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-sm font-semibold text-forest">{t.journeyEyebrow}</p>
          <h2 className="mt-2 font-display text-3xl text-ink">{t.journeyTitle}</h2>
        </div>
        <ol>
          {JOURNEY.map((step, index) => (
            <li key={step} className="grid grid-cols-[2.75rem_1fr] gap-3">
              <div className="flex flex-col items-center">
                <span className="grid size-10 place-items-center rounded-full border border-line bg-surface text-sm font-semibold tabular-nums">
                  {index + 1}
                </span>
                {index < JOURNEY.length - 1 ? <span className="w-px flex-1 bg-line" /> : null}
              </div>
              <div className="pb-6">
                <h3 className="font-medium text-ink">{t.journey[step].title}</h3>
                <p className="text-sm text-muted">{t.journey[step].body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
