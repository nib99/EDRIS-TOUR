import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { toast } from "sonner";
import { journeys } from "@/data/catalog";

const STORAGE_KEY = "idris-tour-requests";
const DRAFT_KEY = "idris-tour-request-draft";

type RequestRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  journey: string;
  when: string;
  travelers: string;
  note: string;
  at: string;
};

const empty = {
  name: "",
  phone: "",
  email: "",
  when: "",
  travelers: "2",
  note: "",
};

export function Enquire({
  journeyName,
  travelersHint,
}: {
  journeyName: string;
  travelersHint: number;
}) {
  const [form, setForm] = useState(empty);
  const [journey, setJourney] = useState(journeyName);
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setJourney(journeyName);
  }, [journeyName]);

  useEffect(() => {
    try {
      const storedRows = localStorage.getItem(STORAGE_KEY);
      if (storedRows) {
        const parsed: unknown = JSON.parse(storedRows);
        if (Array.isArray(parsed)) setRows(parsed as RequestRow[]);
      }
      const storedDraft = localStorage.getItem(DRAFT_KEY);
      if (storedDraft) {
        const parsed: unknown = JSON.parse(storedDraft);
        if (parsed && typeof parsed === "object") {
          const draft = parsed as { form?: Partial<typeof empty>; journey?: string };
          if (draft.form) {
            setForm((current) => ({ ...current, ...draft.form }));
          }
          if (draft.journey) setJourney(draft.journey);
        }
      }
    } catch {
      setRows([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    setForm((current) => ({ ...current, travelers: String(travelersHint) }));
  }, [travelersHint]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, journey }));
    } catch {
      // The form remains usable if local storage is unavailable.
    }
  }, [form, journey, ready]);

  function update(field: keyof typeof empty, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function persist(next: RequestRow[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setRows(next);
      return true;
    } catch {
      toast.error("This browser could not save the request on this device.");
      return false;
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required.");
      return;
    }
    const row: RequestRow = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      journey,
      when: form.when,
      travelers: form.travelers,
      note: form.note.trim(),
      at: new Date().toISOString(),
    };
    if (!persist([row, ...rows].slice(0, 8))) return;
    setForm({ ...empty, travelers: String(travelersHint) });
    toast.success("Request saved on this device.");
  }

  function removeRequest(id: string) {
    persist(rows.filter((item) => item.id !== id));
  }

  return (
    <section id="enquire" className="enquire-section" aria-labelledby="enquire-heading">
      <div className="section-inner">
        <div className="enquire-grid">
          <div className="enquire-copy">
            <p className="section-kicker">Start with a note</p>
            <h2 id="enquire-heading">Let’s put a plan on paper.</h2>
            <p>
              Tell us where you hope to go, when, and who is coming along. Use this
              form to keep a planning request on this device.
            </p>
            <ol className="enquire-steps">
              <li><span className="step-number">01</span><span>Choose a route and share the details that matter.</span></li>
              <li><span className="step-number">02</span><span>Review your saved request below whenever you need it.</span></li>
              <li><span className="step-number">03</span><span>Contact the travel desk separately to discuss live availability.</span></li>
            </ol>
            <div className="local-note">
              <MapPin className="mr-2 inline size-4 text-[var(--copper)]" aria-hidden="true" />
              Bole, Addis Ababa
              <br />
              Submitting does not send a message to the agency. Your request stays in
              this browser’s on-device storage.
            </div>
          </div>

          <form onSubmit={onSubmit} className="request-form">
            <div className="form-heading">
              <h3>Your travel note</h3>
              <p>Fields marked required help keep your request useful.</p>
            </div>
            <div className="form-grid">
              <label className="form-field">
                Name <span aria-hidden="true">*</span>
                <input
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                />
              </label>
              <label className="form-field">
                Phone <span aria-hidden="true">*</span>
                <input
                  required
                  type="tel"
                  autoComplete="tel"
                  placeholder="+251"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                />
              </label>
              <label className="form-field form-field-wide">
                Email, if you have one
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                />
              </label>
              <label className="form-field form-field-wide">
                Journey
                <select value={journey} onChange={(event) => setJourney(event.target.value)}>
                  {journeys.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name} — {item.place}
                    </option>
                  ))}
                  <option value="Flights only">Flights only</option>
                  <option value="Hotel only">Hotel only</option>
                  <option value="Visa assistance">Visa assistance</option>
                </select>
              </label>
              <label className="form-field">
                Preferred date
                <input
                  type="date"
                  value={form.when}
                  onChange={(event) => update("when", event.target.value)}
                />
              </label>
              <label className="form-field">
                Travelers
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.travelers}
                  onChange={(event) => update("travelers", event.target.value)}
                />
              </label>
              <label className="form-field form-field-wide">
                Notes
                <textarea
                  value={form.note}
                  onChange={(event) => update("note", event.target.value)}
                  rows={3}
                  placeholder="Hotel area, children, or a date you cannot move."
                />
              </label>
            </div>
            <button type="submit" className="button-primary form-submit">
              Save request on this device <ArrowUpRight className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>

        {ready && rows.length > 0 ? (
          <div className="saved-requests" aria-live="polite">
            <h3>Saved on this device</h3>
            <ul className="saved-request-list">
              {rows.map((row) => (
                <li key={row.id} className="saved-request">
                  <div>
                    <strong>{row.name} · {row.journey}</strong>
                    <span>
                      {row.phone}
                      {row.when ? ` · ${row.when}` : ""}
                      {" · "}{row.travelers} {row.travelers === "1" ? "traveler" : "travelers"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="remove-request"
                    onClick={() => removeRequest(row.id)}
                    aria-label={`Remove saved request for ${row.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
