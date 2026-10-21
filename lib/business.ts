/**
 * Official business profile — EDRIS TOUR & TRAVEL
 * Owner: EDRIS MUHAMMED · Finfinnee Boolee
 */

export const BUSINESS = {
  name: "EDRIS TOUR & TRAVEL",
  owner: "EDRIS MUHAMMED",
  phoneDisplay: "0922 005 374",
  phoneE164: "+251922005374",
  phoneLocal: "0922005374",
  whatsapp: "0922005374",
  whatsappE164: "251922005374",
  telegram: "0922005374",
  location: "Finfinnee Boolee",
  locationAm: "ፊንፊኔ ቦሌ",
  locationOm: "Finfinnee Boolee",
  city: "Addis Ababa / Finfinnee",
  country: "Ethiopia"
} as const;

export function waLink(text?: string) {
  const base = `https://wa.me/${BUSINESS.whatsappE164}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telLink() {
  return `tel:${BUSINESS.phoneE164}`;
}

export function telegramLink() {
  // Open chat by phone when possible; otherwise t.me search
  return `https://t.me/+${BUSINESS.whatsappE164}`;
}
