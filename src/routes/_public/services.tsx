import { createFileRoute, Link } from "@tanstack/react-router";
import { CHECKLIST, PASSPORT_SPEEDS, SERVICE_IDS } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/services")({
  head: () => ({ meta: [{ title: "Services · Edris Tour & Travel" }] }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useI18n();
  return (
    <div className="grid gap-10">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold text-forest">{t.servicesEyebrow}</p>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">{t.servicesTitle}</h1>
        <p className="mt-4 text-lg text-muted">{t.servicesIntro}</p>
      </header>
      <div className="grid gap-4">
        {SERVICE_IDS.map((id) => (
          <article key={id} id={id} className="rounded-xl border border-line bg-surface p-4">
            <h2 className="font-display text-3xl text-ink">{t.services[id].title}</h2>
            <p className="mt-2 max-w-2xl text-muted">{t.services[id].body}</p>
            {id === "passport" ? (
              <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                {PASSPORT_SPEEDS.map((speed) => (
                  <li key={speed} className="rounded-md bg-paper-2 p-3">
                    <p className="font-medium text-ink">{t.speeds[speed].title}</p>
                    <p className="mt-1 text-sm text-muted">{t.speeds[speed].body}</p>
                  </li>
                ))}
              </ul>
            ) : null}
            <h3 className="mt-4 text-sm font-semibold text-ink">{t.checklistTitle}</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {CHECKLIST[id].map((doc) => (
                <li key={doc} className="rounded-sm bg-paper-2 px-2 py-1 text-sm text-ink">
                  {t.docs[doc]}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <Button asChild className="w-fit">
        <Link to="/inquire">{t.ctaInquire}</Link>
      </Button>
    </div>
  );
}
