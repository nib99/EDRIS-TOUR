import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { journeys } from "@/data/catalog";

const STORAGE_KEY = "idris-tour-requests";

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
    setForm((current) => ({ ...current, travelers: String(travelersHint) }));
  }, [travelersHint]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRows(JSON.parse(raw) as RequestRow[]);
    } catch {
      setRows([]);
    }
    setReady(true);
  }, []);

  function update(field: keyof typeof empty, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function persist(next: RequestRow[]) {
    setRows(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function onSubmit(event: FormEvent) {
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
    persist([row, ...rows].slice(0, 8));
    setForm({ ...empty, travelers: String(travelersHint) });
    toast.success("Request saved. The desk list is on this page.");
  }

  return (
    <section id="enquire" className="scroll-mt-16 border-t border-line bg-navy">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-xs tracking-widest text-emerald uppercase">The desk</p>
          <h2 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
            Tell us the journey. We answer from Addis.
          </h2>
          <p className="mt-4 text-muted">
            Your Journey, Our Priority. Requests stay on this device so you can review them.
            Nothing is sent to a server.
          </p>
          <ol className="mt-8 space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="font-display text-2xl text-gold">01</span>
              <span>Name the route, the date, and how many are traveling.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-2xl text-gold">02</span>
              <span>We match flights, rooms, and visa timing to that plan.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-2xl text-gold">03</span>
              <span>You confirm the quote. Then the tickets get issued.</span>
            </li>
          </ol>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-ink p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted">Name</span>
              <input
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-line bg-navy px-3 text-cream outline-none focus:border-gold"
                autoComplete="name"
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">Phone</span>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-line bg-navy px-3 text-cream outline-none focus:border-gold"
                autoComplete="tel"
                placeholder="+251"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-muted">Email, if you have one</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-line bg-navy px-3 text-cream outline-none focus:border-gold"
                autoComplete="email"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-muted">Journey</span>
              <select
                value={journey}
                onChange={(event) => setJourney(event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-line bg-navy px-3 text-cream outline-none focus:border-gold"
              >
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
            <label className="block text-sm">
              <span className="text-muted">When</span>
              <input
                type="date"
                value={form.when}
                onChange={(event) => update("when", event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-line bg-navy px-3 text-cream outline-none focus:border-gold"
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">Travelers</span>
              <input
                inputMode="numeric"
                value={form.travelers}
                onChange={(event) => update("travelers", event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-line bg-navy px-3 text-cream tabular-nums outline-none focus:border-gold"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-muted">Notes</span>
              <textarea
                value={form.note}
                onChange={(event) => update("note", event.target.value)}
                rows={3}
                className="mt-1 w-full rounded-xl border border-line bg-navy px-3 py-2 text-cream outline-none focus:border-gold"
                placeholder="Hotel area, children, or a date you cannot move."
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-gold text-sm font-semibold text-ink transition-transform duration-150 ease-out active:scale-[0.96] sm:w-auto sm:px-8"
          >
            Send the request
          </button>
        </form>
      </div>

      {ready && rows.length > 0 ? (
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <h3 className="font-display text-2xl text-cream">Requests on this device</h3>
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-medium text-cream">
                    {row.name} · {row.journey}
                  </p>
                  <p className="text-sm text-muted">
                    {row.phone}
                    {row.when ? ` · ${row.when}` : ""} · {row.travelers} travelers
                  </p>
                </div>
                <button
                  type="button"
                  className="h-11 text-sm text-gold"
                  onClick={() => persist(rows.filter((item) => item.id !== row.id))}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
