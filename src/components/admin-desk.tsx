import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import {
  CHECK_STATES,
  PAYMENT_STATUSES,
  STATUSES,
  type CheckState,
  type PaymentStatus,
} from "@/lib/catalog";
import { formatWhen, telHref } from "@/lib/format";
import type { InquiryDetail, InquirySummary, Metrics } from "@/lib/inquiry-types";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { SelectInput, TextArea, TextInput } from "@/components/ui/controls";
import { StatusBadge } from "@/components/status-badge";

type Props = { onLogout: () => void; mode: string };

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export function AdminDesk({ onLogout, mode }: Props) {
  const { t, lang } = useI18n();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [rows, setRows] = useState<InquirySummary[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState<InquiryDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [staff, setStaff] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [receipt, setReceipt] = useState("");
  const [payStatus, setPayStatus] = useState<PaymentStatus>("unpaid");
  const [appRef, setAppRef] = useState("");
  const [authority, setAuthority] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [secrets, setSecrets] = useState<{ ownerPassword: string; sessionSecret: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void load(query, filter);
    }, 200);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter]);

  useEffect(() => {
    if (!detail) return;
    setStaff(detail.assignedStaff ?? "");
    setAmount(detail.paymentAmount ?? "");
    setMethod(detail.paymentMethod ?? "");
    setReceipt(detail.receiptNumber ?? "");
    setPayStatus((detail.paymentStatus as PaymentStatus) || "unpaid");
    setAppRef(detail.applicationRef ?? "");
    setAuthority(detail.applicationAuthority ?? "");
    setNote("");
    setSaved(false);
  }, [detail?.id]);

  async function load(q: string, status: string) {
    setLoading(true);
    setError("");
    try {
      const [metricRes, listRes] = await Promise.all([
        fetch("/api/admin/metrics", { credentials: "same-origin" }),
        fetch(`/api/admin/inquiries?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}`, {
          credentials: "same-origin",
        }),
      ]);
      if (metricRes.status === 401 || listRes.status === 401) {
        onLogout();
        return;
      }
      if (!metricRes.ok || !listRes.ok) throw new Error("load");
      setMetrics(await readJson<Metrics>(metricRes));
      const list = await readJson<{ inquiries: InquirySummary[] }>(listRes);
      setRows(list.inquiries);
    } catch {
      setError(t.admin.loadError);
    } finally {
      setLoading(false);
    }
  }

  async function openFile(id: string) {
    setError("");
    const response = await fetch(`/api/admin/inquiries/${id}`, { credentials: "same-origin" });
    if (response.status === 401) {
      onLogout();
      return;
    }
    if (!response.ok) {
      setError(t.admin.loadError);
      return;
    }
    setDetail(await readJson<InquiryDetail>(response));
  }

  async function patch(body: unknown) {
    if (!detail) return null;
    const response = await fetch(`/api/admin/inquiries/${detail.id}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.status === 401) {
      onLogout();
      return null;
    }
    if (!response.ok) throw new Error("save");
    const next = await readJson<InquiryDetail>(response);
    setDetail(next);
    return next;
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE", credentials: "same-origin" });
    onLogout();
  }

  const filters = ["all", "new", "active", "contacted", "documents_pending", "in_progress", "completed", "cancelled"] as const;

  function filterLabel(key: (typeof filters)[number]) {
    if (key === "all" || key === "active") return t.filters[key];
    return t.statuses[key];
  }

  return (
    <div className="min-h-screen bg-paper pb-[env(safe-area-inset-bottom)]">
      <div className="h-1 bg-forest" />
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="font-display text-xl text-ink">{t.admin.title}</p>
            <p className="truncate text-sm text-muted">{t.owner}</p>
          </div>
          <Button variant="secondary" className="ms-auto" onClick={() => void logout()}>
            {t.admin.signOut}
          </Button>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5">
        <p className="text-sm text-muted">{mode === "env" ? t.admin.modeEnv : mode === "stored" ? t.admin.modeStored : null}</p>
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric label={t.admin.metricsNew} value={metrics?.newCount} />
          <Metric label={t.admin.metricsActive} value={metrics?.active} hint={t.admin.activeHint} />
          <Metric label={t.admin.metricsCompleted} value={metrics?.completed} />
          <Metric label={t.admin.metricsTotal} value={metrics?.total} />
        </section>
        <div className="grid gap-3">
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.admin.search}
            aria-label={t.admin.search}
          />
          <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={t.admin.filterLabel}>
            {filters.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  "h-10 shrink-0 rounded-md px-3 text-sm font-medium",
                  filter === key ? "bg-forest text-on-forest" : "bg-surface text-muted ring-1 ring-line",
                )}
              >
                {filterLabel(key)}
              </button>
            ))}
          </div>
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="grid gap-2">
            {loading && rows.length === 0 ? <p className="text-sm text-muted">{t.admin.loading}</p> : null}
            {!loading && rows.length === 0 ? <p className="text-sm text-muted">{t.admin.empty}</p> : null}
            {rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => void openFile(row.id)}
                className={cn(
                  "rounded-xl border bg-surface p-4 text-start",
                  detail?.id === row.id ? "border-forest" : "border-line",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{row.fullName}</p>
                    <p className="text-sm tabular-nums text-muted">{row.reference}</p>
                  </div>
                  <StatusBadge status={row.status} label={t.statuses[row.status as keyof typeof t.statuses] ?? row.status} />
                </div>
                <p className="mt-2 text-sm text-muted">
                  {row.service in t.services ? t.services[row.service as keyof typeof t.services].title : row.service}
                  {row.destination ? ` · ${row.destination}` : ""}
                </p>
              </button>
            ))}
          </section>
          <section
            className={cn(
              "rounded-xl border border-line bg-surface p-4",
              detail ? "max-lg:fixed max-lg:inset-0 max-lg:z-40 max-lg:overflow-auto max-lg:rounded-none" : "",
            )}
          >
            {!detail ? <p className="text-sm text-muted">{t.admin.selectFile}</p> : null}
            {detail ? (
              <div className="grid gap-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <button type="button" className="mb-2 text-sm font-medium text-forest lg:hidden" onClick={() => setDetail(null)}>
                      {t.backHome}
                    </button>
                    <h2 className="font-display text-2xl text-ink">{detail.fullName}</h2>
                    <p className="text-sm tabular-nums text-muted">{detail.reference}</p>
                  </div>
                  <a
                    href={telHref(detail.phone)}
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-forest px-3 text-sm font-semibold text-on-forest"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    {t.admin.call}
                  </a>
                </div>
                <p className="text-sm text-muted">
                  {detail.phone}
                  {detail.city ? ` · ${detail.city}` : ""}
                  {detail.email ? ` · ${detail.email}` : ""}
                </p>
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium">{t.admin.statusLabel}</span>
                  <SelectInput
                    value={detail.status}
                    onChange={(event) => {
                      void patch({ status: event.target.value }).then(() => load(query, filter));
                    }}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {t.statuses[status]}
                      </option>
                    ))}
                  </SelectInput>
                </label>
                <div>
                  <h3 className="text-sm font-semibold">{t.admin.workflow}</h3>
                  <ol className="mt-2 flex flex-wrap gap-2">
                    {STATUSES.filter((status) => status !== "cancelled").map((status) => (
                      <li key={status}>
                        <span
                          className={cn(
                            "inline-flex h-8 items-center rounded-sm px-2 text-xs font-medium",
                            detail.status === status ? "bg-forest text-on-forest" : "bg-paper-2 text-muted",
                          )}
                        >
                          {t.statuses[status]}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t.admin.checklist}</h3>
                  <ul className="mt-2 grid gap-2">
                    {detail.checklist.map((item) => (
                      <li key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-2">
                        <span className="text-sm">{t.docs[item.docKey as keyof typeof t.docs] ?? item.docKey}</span>
                        <SelectInput
                          className="h-10 w-36"
                          value={item.state}
                          onChange={(event) => {
                            void patch({
                              checklist: [{ id: item.id, state: event.target.value as CheckState }],
                            });
                          }}
                        >
                          {CHECK_STATES.map((state) => (
                            <option key={state} value={state}>
                              {t.checkStates[state]}
                            </option>
                          ))}
                        </SelectInput>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid gap-2">
                  <h3 className="text-sm font-semibold">{t.admin.notesTitle}</h3>
                  {detail.internalNotes ? (
                    <pre className="whitespace-pre-wrap rounded-md bg-paper-2 p-3 font-body text-sm text-ink">{detail.internalNotes}</pre>
                  ) : null}
                  <TextArea value={note} onChange={(event) => setNote(event.target.value)} placeholder={t.admin.notePlaceholder} />
                  <Button
                    variant="secondary"
                    disabled={!note.trim()}
                    onClick={() => {
                      void patch({ appendNote: note }).then(() => setNote(""));
                    }}
                  >
                    {t.admin.addNote}
                  </Button>
                </div>
                <div className="grid gap-3">
                  <h3 className="text-sm font-semibold">{t.admin.staff}</h3>
                  <TextInput value={staff} onChange={(event) => setStaff(event.target.value)} placeholder={t.admin.staffPlaceholder} />
                  <h3 className="text-sm font-semibold">{t.admin.application}</h3>
                  <TextInput value={appRef} onChange={(event) => setAppRef(event.target.value)} placeholder={t.admin.applicationRef} />
                  <TextInput value={authority} onChange={(event) => setAuthority(event.target.value)} placeholder={t.admin.authorityPlaceholder} />
                  <h3 className="text-sm font-semibold">{t.admin.payment}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextInput
                      inputMode="decimal"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder={t.admin.amount}
                      aria-label={t.admin.amount}
                    />
                    <SelectInput
                      value={payStatus}
                      aria-label={t.admin.payment}
                      onChange={(event) => setPayStatus(event.target.value as PaymentStatus)}
                    >
                      {PAYMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {t.paymentStatuses[status]}
                        </option>
                      ))}
                    </SelectInput>
                    <TextInput value={method} onChange={(event) => setMethod(event.target.value)} placeholder={t.admin.methodPlaceholder} aria-label={t.admin.method} />
                    <TextInput value={receipt} onChange={(event) => setReceipt(event.target.value)} placeholder={t.admin.receipt} aria-label={t.admin.receipt} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      disabled={saving}
                      onClick={() => {
                        setSaving(true);
                        setSaved(false);
                        const parsed = amount.trim() === "" ? null : Number(amount);
                        void patch({
                          assignedStaff: staff.trim() || null,
                          paymentAmount: parsed != null && Number.isFinite(parsed) ? parsed : null,
                          paymentStatus: payStatus,
                          paymentMethod: method.trim() || null,
                          receiptNumber: receipt.trim() || null,
                          applicationRef: appRef.trim() || null,
                          applicationAuthority: authority.trim() || null,
                        })
                          .then(() => {
                            setSaved(true);
                            void load(query, filter);
                          })
                          .catch(() => setError(t.errors.generic))
                          .finally(() => setSaving(false));
                      }}
                    >
                      {saving ? t.admin.saving : t.admin.saveDesk}
                    </Button>
                    {saved ? <span className="text-sm text-forest">{t.admin.saved}</span> : null}
                  </div>
                </div>
                <p className="text-xs text-faint">
                  {t.admin.opened} {formatWhen(detail.createdAt, lang)}
                </p>
              </div>
            ) : null}
          </section>
        </div>
        <details className="rounded-xl border border-line bg-surface p-4">
          <summary className="cursor-pointer text-sm font-semibold">{t.admin.envTitle}</summary>
          <p className="mt-3 max-w-2xl text-sm text-muted">{t.admin.envBody}</p>
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => {
              void fetch("/api/admin/secrets", { method: "POST", credentials: "same-origin" })
                .then(async (response) => {
                  if (response.status === 401) onLogout();
                  else setSecrets(await readJson(response));
                });
            }}
          >
            {t.admin.generate}
          </Button>
          {secrets ? (
            <div className="mt-3 grid gap-2">
              <p className="text-sm text-muted">{t.admin.secretsHelp}</p>
              <pre className="overflow-x-auto rounded-md bg-paper-2 p-3 text-sm text-ink">{`OWNER_PASSWORD=${secrets.ownerPassword}\nSESSION_SECRET=${secrets.sessionSecret}`}</pre>
              <Button
                variant="quiet"
                className="w-fit"
                onClick={() => {
                  void navigator.clipboard
                    .writeText(`OWNER_PASSWORD=${secrets.ownerPassword}\nSESSION_SECRET=${secrets.sessionSecret}`)
                    .then(() => setCopied(true));
                }}
              >
                {copied ? t.admin.copied : t.admin.copy}
              </Button>
            </div>
          ) : null}
        </details>
      </div>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value?: number; hint?: string }) {
  return (
    <article className="rounded-xl border border-line bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-4xl tabular-nums text-ink">{value ?? "—"}</p>
      {hint ? <p className="mt-2 text-xs text-faint">{hint}</p> : null}
    </article>
  );
}

