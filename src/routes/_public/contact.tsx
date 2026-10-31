import { createFileRoute, Link } from "@tanstack/react-router";
import { PHONES, SERVICE_IDS } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({ meta: [{ title: "Contact · Edris Tour & Travel" }] }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <header>
        <p className="text-sm font-semibold text-forest">{t.city}</p>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">{t.contactTitle}</h1>
        <p className="mt-4 text-lg text-muted">{t.contactBody}</p>
        <p className="mt-6 font-display text-2xl text-ink">{t.closingTitle}</p>
        <div className="mt-5 grid gap-2">
          {PHONES.map((phone) => (
            <a
              key={phone.tel}
              href={`tel:${phone.tel}`}
              className="flex h-14 items-center rounded-xl border border-line bg-surface px-4 text-lg font-medium hover:bg-paper-2"
            >
              {phone.display}
            </a>
          ))}
        </div>
        <p className="mt-4 text-muted">{t.owner}</p>
        <Button asChild className="mt-6">
          <Link to="/inquire">{t.ctaInquire}</Link>
        </Button>
      </header>
      <section className="rounded-xl border border-line bg-surface p-4">
        <h2 className="font-display text-2xl text-ink">{t.whatWeDo}</h2>
        <ul className="mt-4 grid gap-3">
          {SERVICE_IDS.map((id) => (
            <li key={id} className="border-t border-line pt-3">
              <p className="font-medium text-ink">{t.services[id].title}</p>
              <p className="text-sm text-muted">{t.services[id].body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
