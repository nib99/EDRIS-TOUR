import { Check, Users } from "lucide-react";
import { formatUsd, journeys, type Journey } from "@/data/catalog";

type Props = {
  selectedId: string;
  travelers: number;
  onTravelers: (n: number) => void;
  onSelect: (j: Journey) => void;
};

export function Journeys({ selectedId, travelers, onTravelers, onSelect }: Props) {
  const selected = journeys.find((j) => j.id === selectedId) ?? journeys[0];
  const total = selected.from * travelers;

  return (
    <section id="journeys" className="scroll-mt-20 border-t border-line bg-ink py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-gold uppercase">Curated routes</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-cream sm:text-4xl">
              Journeys from Bole
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
              Indicative per-traveler fares for planning. The desk confirms live rates,
              rooms, and visa windows before any payment.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-line bg-navy/60 px-4 py-3">
            <Users className="size-4 text-gold" aria-hidden />
            <label className="text-sm text-muted" htmlFor="travelers">
              Travelers
            </label>
            <select
              id="travelers"
              value={travelers}
              onChange={(e) => onTravelers(Number(e.target.value))}
              className="rounded-lg border border-line bg-ink px-3 py-1.5 text-sm text-cream outline-none focus:border-gold"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {journeys.map((j) => {
            const active = j.id === selectedId;
            return (
              <button
                key={j.id}
                type="button"
                onClick={() => onSelect(j)}
                className={`group relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-200 ${
                  active
                    ? "border-gold/70 bg-navy shadow-[0_0_0_1px_rgba(226,179,64,0.25),0_20px_40px_-20px_rgba(0,0,0,0.6)]"
                    : "border-line bg-navy/40 hover:border-gold/40 hover:bg-navy/70"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] tracking-widest text-gold uppercase">
                      {j.lane === "umrah" ? "Umrah" : "World"}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-cream">
                      {j.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted">
                      {j.place} · {j.nights}
                    </p>
                  </div>
                  {active && (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                  )}
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-cream/75">{j.blurb}</p>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {j.includes.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line/80 bg-ink/50 px-2.5 py-0.5 text-[11px] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-baseline justify-between border-t border-line/60 pt-4">
                  <span className="text-xs text-muted">from</span>
                  <span className="font-display text-2xl font-semibold text-gold">
                    {formatUsd(j.from)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Summary bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-gradient-to-r from-navy to-navy-2 px-5 py-4">
          <div>
            <p className="text-sm text-muted">Selected plan</p>
            <p className="font-display text-lg font-semibold text-cream">
              {selected.name} · {travelers} traveler{travelers > 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Indicative total</p>
            <p className="font-display text-2xl font-semibold text-gold">{formatUsd(total)}</p>
          </div>
          <a
            href="#enquire"
            className="inline-flex h-11 items-center rounded-full bg-gold px-6 text-sm font-semibold text-ink transition-transform active:scale-[0.96]"
          >
            Request this plan
          </a>
        </div>
      </div>
    </section>
  );
}
