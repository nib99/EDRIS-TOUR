export type Journey = {
  id: string;
  name: string;
  place: string;
  nights: string;
  from: number;
  blurb: string;
  includes: string[];
  lane: "umrah" | "world";
};

export const services = [
  {
    title: "Explore the world",
    detail: "Routes out of Addis to cities we actually book — not a brochure of everywhere.",
  },
  {
    title: "Discover Makkah & Madinah",
    detail: "Hotels, timing, and the move between the two holy cities, planned as one journey.",
  },
  {
    title: "Umrah travel assistance",
    detail: "Paperwork, group rhythm, and a desk that stays reachable while you are away.",
  },
  {
    title: "International flight booking",
    detail: "Fares from Bole, including connections that do not strand you overnight.",
  },
  {
    title: "Hotel reservations",
    detail: "Rooms we would put family in — location first, then the rate.",
  },
  {
    title: "Tour packages",
    detail: "Ethiopia’s north, the Gulf, Istanbul, and East Africa, with the days written down.",
  },
  {
    title: "Visa assistance",
    detail: "What to file, what to carry, and when to file it, before you pay for a ticket.",
  },
] as const;

export const journeys: Journey[] = [
  {
    id: "umrah-essential",
    name: "Umrah Essential",
    place: "Makkah & Madinah",
    nights: "7 nights",
    from: 1280,
    blurb: "Return flights from Addis, hotels a short walk from the Haram, and visa guidance for the group.",
    includes: ["Flights", "Hotels", "Visa assist", "Group host"],
    lane: "umrah",
  },
  {
    id: "umrah-comfort",
    name: "Umrah Comfort",
    place: "Closer to the Haram",
    nights: "10 nights",
    from: 1890,
    blurb: "A slower stay, better-sited hotels, and private transfers between Makkah and Madinah.",
    includes: ["Flights", "Near-Haram hotels", "Transfers", "Visa assist"],
    lane: "umrah",
  },
  {
    id: "historic-north",
    name: "Historic North",
    place: "Lalibela, Gondar, Axum",
    nights: "6 nights",
    from: 740,
    blurb: "Rock churches, castles, and stelae, with a guide who knows the northern circuit.",
    includes: ["Hotels", "Guide", "Inter-city road"],
    lane: "world",
  },
  {
    id: "dubai",
    name: "Dubai Stopover",
    place: "Dubai",
    nights: "4 nights",
    from: 690,
    blurb: "Flights out of Addis, a hotel, and evenings left open — not a packed bus loop.",
    includes: ["Flights", "Hotel", "Airport transfer"],
    lane: "world",
  },
  {
    id: "istanbul",
    name: "Istanbul Heritage",
    place: "Istanbul",
    nights: "6 nights",
    from: 860,
    blurb: "The old city and the Bosphorus, breakfast included, one day held empty on purpose.",
    includes: ["Flights", "Hotel", "Old-city walk"],
    lane: "world",
  },
  {
    id: "mara",
    name: "Nairobi & Mara",
    place: "Kenya",
    nights: "5 nights",
    from: 1120,
    blurb: "A city night, then the Mara, timed for travelers leaving from Bole.",
    includes: ["Flights", "Lodge", "Game drive"],
    lane: "world",
  },
];

export const faqs = [
  {
    q: "Do you arrange Umrah visas?",
    a: "Yes. We tell you what the file needs, check it before it goes in, and keep the hotel and flight dates matched to the visa window.",
  },
  {
    q: "Where do trips start?",
    a: "Most journeys leave from Addis Ababa Bole. We also book hotels and visas on their own if you already hold a ticket.",
  },
  {
    q: "Are the prices final?",
    a: "The figures on this page are indicative, per traveler, for planning. The desk confirms the live fare, room, and visa cost before you pay.",
  },
  {
    q: "Can a family or a group book together?",
    a: "Yes. Put the headcount in the request. We reply with one plan and one total, not seven separate threads.",
  },
] as const;

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
