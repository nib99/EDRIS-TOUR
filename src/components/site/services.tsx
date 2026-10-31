import { Plane, Hotel, FileCheck, Compass, Landmark, Headphones } from "lucide-react";

const items = [
  {
    icon: Landmark,
    title: "Umrah packages",
    text: "Makkah & Madinah stays matched to visa windows, with clear daily plans.",
  },
  {
    icon: Plane,
    title: "International flights",
    text: "Routes from Addis Bole, timed for connections and rest, not just the cheapest seat.",
  },
  {
    icon: Hotel,
    title: "Hotels & lodges",
    text: "Vetted properties near the Haram, city centers, or game reserves — never a surprise.",
  },
  {
    icon: FileCheck,
    title: "Visa assistance",
    text: "Document checklists, file review, and submission support so nothing stalls at the last step.",
  },
  {
    icon: Compass,
    title: "Tour packages",
    text: "Istanbul walks, Nairobi nights, Mara drives — sequenced so the trip feels intentional.",
  },
  {
    icon: Headphones,
    title: "Dedicated desk",
    text: "One thread for the whole group. One reply with the full plan and total.",
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 border-t border-line bg-navy/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.2em] text-gold uppercase">What we handle</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-cream sm:text-4xl">
            Services built around the traveler
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            From the first WhatsApp message to the return flight, every piece is held in one place.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-line bg-ink/50 p-6 transition-all duration-200 hover:border-gold/40 hover:bg-ink/80"
            >
              <div className="flex size-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
                <item.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-cream">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
