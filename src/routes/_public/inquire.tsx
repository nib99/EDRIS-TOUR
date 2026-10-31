import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CHECKLIST, PASSPORT_SPEEDS, SERVICE_IDS, type ServiceId } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextArea, TextInput } from "@/components/ui/controls";

export const Route = createFileRoute("/_public/inquire")({
  head: () => ({ meta: [{ title: "Inquire · Edris Tour & Travel" }] }),
  component: InquirePage,
});

function InquirePage() {
  const { t, lang } = useI18n();
  const [service, setService] = useState<ServiceId>("passport");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const body = {
      fullName: String(form.get("fullName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      city: String(form.get("city") ?? ""),
      service,
      passportSpeed: String(form.get("passportSpeed") ?? ""),
      destination: String(form.get("destination") ?? ""),
      travelDate: String(form.get("travelDate") ?? ""),
      message: String(form.get("message") ?? ""),
      language: lang,
    };
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as { reference?: string; field?: string; error?: string };
      if (!response.ok) {
        const field = data.field || data.error || "generic";
        setError(t.errors[field as keyof typeof t.errors] ?? t.errors.generic);
        return;
      }
      setReference(data.reference ?? "");
    } catch {
      setError(t.errors.generic);
    } finally {
      setPending(false);
    }
  }

  if (reference) {
    return (
      <div className="mx-auto grid max-w-xl gap-6">
        <p className="text-sm font-semibold text-forest">{t.referenceLabel}</p>
        <h1 className="font-display text-4xl text-ink">{t.successTitle}</h1>
        <p className="font-display text-4xl tabular-nums tracking-wide text-forest">{reference}</p>
        <p className="text-muted">{t.successBody}</p>
        <div>
          <h2 className="font-medium text-ink">{t.checklistTitle}</h2>
          <ul className="mt-3 grid gap-2">
            {CHECKLIST[service].map((doc) => (
              <li key={doc} className="rounded-md border border-line bg-surface px-3 py-3 text-ink">
                {t.docs[doc]}
              </li>
            ))}
          </ul>
        </div>
        <Button asChild className="w-fit">
          <Link to="/track">{t.ctaTrack}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <header>
        <h1 className="font-display text-4xl text-ink">{t.inquireTitle}</h1>
        <p className="mt-3 text-muted">{t.inquireIntro}</p>
      </header>
      <form className="grid gap-4 rounded-xl border border-line bg-surface p-4" onSubmit={onSubmit}>
        <Field label={t.name} error={undefined}>
          <TextInput name="fullName" required autoComplete="name" />
        </Field>
        <Field label={t.phone}>
          <TextInput name="phone" required autoComplete="tel" inputMode="tel" placeholder="+251" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={`${t.cityField} · ${t.optional}`}>
            <TextInput name="city" autoComplete="address-level2" />
          </Field>
          <Field label={`${t.email} · ${t.optional}`}>
            <TextInput name="email" type="email" autoComplete="email" />
          </Field>
        </div>
        <Field label={t.service}>
          <SelectInput name="service" value={service} onChange={(event) => setService(event.target.value as ServiceId)}>
            {SERVICE_IDS.map((id) => (
              <option key={id} value={id}>
                {t.services[id].title}
              </option>
            ))}
          </SelectInput>
        </Field>
        {service === "passport" ? (
          <Field label={t.speed}>
            <SelectInput name="passportSpeed" defaultValue="urgent_2">
              {PASSPORT_SPEEDS.map((speed) => (
                <option key={speed} value={speed}>
                  {t.speeds[speed].title}
                </option>
              ))}
            </SelectInput>
          </Field>
        ) : (
          <input type="hidden" name="passportSpeed" value="" />
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={`${t.destination} · ${t.optional}`}>
            <TextInput name="destination" />
          </Field>
          <Field label={`${t.travelDate} · ${t.optional}`}>
            <TextInput name="travelDate" />
          </Field>
        </div>
        <Field label={`${t.message} · ${t.optional}`}>
          <TextArea name="message" maxLength={1000} />
        </Field>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? t.submitting : t.submit}
        </Button>
      </form>
    </div>
  );
}
