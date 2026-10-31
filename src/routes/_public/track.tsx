import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { JOURNEY, journeyIndex, type InquiryStatus } from "@/lib/catalog";
import type { PublicTrack } from "@/lib/inquiry-types";
import { formatWhen } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/controls";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/_public/track")({
  head: () => ({ meta: [{ title: "Track · Edris Tour & Travel" }] }),
  component: TrackPage,
});

function TrackPage() {
  const { t, lang } = useI18n();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<PublicTrack | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: String(form.get("reference") ?? ""),
          phone: String(form.get("phone") ?? ""),
        }),
      });
      const data = (await response.json()) as PublicTrack & { error?: string };
      if (!response.ok) {
        setFile(null);
        setError(response.status === 404 ? t.notFound : t.errors.generic);
        return;
      }
      setFile(data);
    } catch {
      setError(t.errors.generic);
    } finally {
      setPending(false);
    }
  }

  const active = file ? journeyIndex(file.status as InquiryStatus) : -1;
  const serviceTitle =
    file && file.service in t.services ? t.services[file.service as keyof typeof t.services].title : file?.service;

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <header>
        <h1 className="font-display text-4xl text-ink">{t.trackTitle}</h1>
        <p className="mt-3 text-muted">{t.trackIntro}</p>
      </header>
      <form className="grid gap-4 rounded-xl border border-line bg-surface p-4" onSubmit={onSubmit}>
        <Field label={t.referenceLabel}>
          <TextInput name="reference" required autoComplete="off" placeholder="ETT-" className="uppercase" />
        </Field>
        <Field label={t.phone}>
          <TextInput name="phone" required autoComplete="tel" inputMode="tel" />
        </Field>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? t.submitting : t.trackSubmit}
        </Button>
      </form>
      {file ? (
        <article className="grid gap-5 rounded-xl border border-line bg-surface p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-2xl tabular-nums text-ink">{file.reference}</p>
              <p className="text-muted">
                {file.fullName} · {serviceTitle}
              </p>
            </div>
            <StatusBadge
              status={file.status}
              label={t.statuses[file.status as keyof typeof t.statuses] ?? file.status}
            />
          </div>
          <ol className="grid gap-2">
            {JOURNEY.map((step, index) => (
              <li key={step} className="flex items-center gap-3 text-sm">
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full border text-xs font-semibold tabular-nums",
                    file.status === "cancelled"
                      ? "border-line text-faint"
                      : index <= active
                        ? "border-forest bg-forest text-on-forest"
                        : "border-line text-faint",
                  )}
                >
                  {index + 1}
                </span>
                <span className={index <= active && file.status !== "cancelled" ? "text-ink" : "text-faint"}>
                  {t.journey[step].title}
                </span>
              </li>
            ))}
          </ol>
          <div>
            <h2 className="text-sm font-semibold text-ink">{t.checklistTitle}</h2>
            <ul className="mt-2 grid gap-2">
              {file.checklist.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>{t.docs[item.docKey as keyof typeof t.docs] ?? item.docKey}</span>
                  <span className="text-muted">{t.checkStates[item.state as keyof typeof t.checkStates] ?? item.state}</span>
                </li>
              ))}
            </ul>
          </div>
          <dl className="grid gap-2 text-sm">
            {file.applicationRef ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">{t.applicationLabel}</dt>
                <dd className="text-end text-ink">
                  {file.applicationRef}
                  {file.applicationAuthority ? ` · ${file.applicationAuthority}` : ""}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3">
              <dt className="text-muted">{t.admin.payment}</dt>
              <dd className="text-ink">
                {t.paymentStatuses[file.paymentStatus as keyof typeof t.paymentStatuses] ?? file.paymentStatus}
                {file.paymentAmount ? ` · ${file.paymentAmount} ${file.paymentCurrency}` : ""}
              </dd>
            </div>
            {file.receiptNumber ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">{t.receiptLabel}</dt>
                <dd className="font-medium tabular-nums text-ink">{file.receiptNumber}</dd>
              </div>
            ) : null}
            {file.assignedStaff ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">{t.staffLabel}</dt>
                <dd className="text-ink">{file.assignedStaff}</dd>
              </div>
            ) : null}
          </dl>
          <div>
            <h2 className="text-sm font-semibold text-ink">{t.timeline}</h2>
            <ul className="mt-2 grid gap-2">
              {file.events.map((event) => (
                <li key={event.id} className="flex justify-between gap-3 text-sm">
                  <span>{t.statuses[event.toStatus as keyof typeof t.statuses] ?? event.toStatus}</span>
                  <span className="text-muted">{formatWhen(event.createdAt, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ) : null}
    </div>
  );
}
