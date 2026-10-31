import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { formatUsd, journeys, type Journey } from "@/data/catalog";

type Lane = "all" | Journey["lane"];

const filters: { id: Lane; label: string }[] = [
  { id: "all", label: "All journeys" },
  { id: "umrah", label: "Umrah" },
  { id: "world", label: "The world" },
];

export function Journeys({
  selectedId,
  travelers,
  onSelect,
  onTravelers,
}: {
  selectedId: string;
  travelers: number;
  onSelect: (journey: Journey) => void;
  onTravelers: (count: number) => void;
}) {
  const [lane, setLane] = useState<Lane>("all");
  const visible = useMemo(
    () => journeys.filter((journey) => lane === "all" || journey.lane === lane),
    [lane],
  );
  const selected = journeys.find((journey) => journey.id === selectedId) ?? journeys[0];

  return (
    <section id="journeys" className="journeys-section" aria-labelledby="journeys-heading">
      <div className="section-inner">
        <div className="section-heading">
          <div className="section-heading-copy">
            <p className="section-kicker">Choose your direction</p>
            <h2 id="journeys-heading">Some journeys stay with you.</h2>
            <p>
              Start with a route. These are indicative fares per traveler from Addis;
              your final plan is confirmed by the desk.
            </p>
          </div>
          <div className="journey-filters" role="group" aria-label="Filter journeys">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className="filter-button"
                aria-pressed={lane === filter.id}
                onClick={() => setLane(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="journey-grid" aria-live="polite">
          {visible.map((journey) => {
            const active = journey.id === selected.id;
            const cover = journey.lane === "umrah"
              ? "/journeys/umrah-cover.jpg"
              : "/journeys/world-cover.jpg";
            const coverAlt = journey.lane === "umrah"
              ? "Illustrated view of the Kaaba and the Makkah skyline at dusk"
              : "Illustrated Addis departure scene at sunset with an airplane";
            return (
              <li key={journey.id}>
                <article className="journey-card" data-selected={active}>
                  <div className="journey-image">
                    <img src={cover} alt={coverAlt} loading="lazy" decoding="async" />
                    <span className="journey-lane">{journey.lane === "umrah" ? "Umrah journeys" : "Further afield"}</span>
                  </div>
                  <div className="journey-body">
                    <div className="journey-topline">
                      <span className="journey-nights">{journey.nights}</span>
                      <span className="journey-price">From {formatUsd(journey.from)}</span>
                    </div>
                    <h3>{journey.name}</h3>
                    <p className="journey-place">{journey.place}</p>
                    <p className="journey-blurb">{journey.blurb}</p>
                    <ul className="journey-includes" aria-label={`${journey.name} includes`}>
                      {journey.includes.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <button
                      type="button"
                      className="journey-select"
                      aria-pressed={active}
                      onClick={() => onSelect(journey)}
                    >
                      {active ? "Selected for your estimate" : "Choose this journey"}
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="quote-calculator" aria-label="Indicative trip estimate">
          <div>
            <p className="quote-label">A starting point · {selected.name}</p>
            <p className="quote-total">{formatUsd(selected.from * travelers)}</p>
            <p className="quote-explainer">
              {formatUsd(selected.from)} per traveler × {travelers} {travelers === 1 ? "traveler" : "travelers"}.
              Planning figure only, not a charge.
            </p>
          </div>
          <div className="traveler-controls">
            <button
              type="button"
              className="traveler-button"
              aria-label="Fewer travelers"
              onClick={() => onTravelers(Math.max(1, travelers - 1))}
              disabled={travelers <= 1}
            >
              −
            </button>
            <output className="traveler-count" aria-label={`${travelers} travelers`}>{travelers}</output>
            <button
              type="button"
              className="traveler-button"
              aria-label="More travelers"
              onClick={() => onTravelers(Math.min(12, travelers + 1))}
              disabled={travelers >= 12}
            >
              +
            </button>
            <a href="#enquire" className="button-primary">
              Continue to enquiry <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
