import { isLang } from "@/lib/i18n-lang";
import { isPassportSpeed, isServiceId, phoneKey } from "@/lib/catalog";

export type InquiryInput = {
  fullName: string;
  phone: string;
  email: string | null;
  city: string | null;
  language: string;
  service: string;
  passportSpeed: string | null;
  destination: string | null;
  travelDate: string | null;
  message: string | null;
};

function clean(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/[\u0000-\u001F]/g, "")
    .trim()
    .slice(0, max);
}

export function validateInquiry(body: unknown): { ok: true; value: InquiryInput } | { ok: false; field: string } {
  if (!body || typeof body !== "object") return { ok: false, field: "generic" };
  const raw = body as Record<string, unknown>;
  if (typeof raw.company === "string" && raw.company.trim()) return { ok: false, field: "generic" };
  const fullName = clean(raw.fullName, 80);
  if (fullName.length < 2) return { ok: false, field: "name" };
  const phone = clean(raw.phone, 24);
  if (phoneKey(phone).length < 9) return { ok: false, field: "phone" };
  const email = clean(raw.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, field: "email" };
  const service = clean(raw.service, 32);
  if (!isServiceId(service)) return { ok: false, field: "service" };
  const speed = clean(raw.passportSpeed, 16);
  if (service === "passport" && !isPassportSpeed(speed)) return { ok: false, field: "speed" };
  const message = clean(raw.message, 1000);
  if (String(raw.message ?? "").trim().length > 1000) return { ok: false, field: "message" };
  const language = clean(raw.language, 8);
  return {
    ok: true,
    value: {
      fullName,
      phone,
      email: email || null,
      city: clean(raw.city, 80) || null,
      language: isLang(language) ? language : "om",
      service,
      passportSpeed: service === "passport" ? speed : null,
      destination: clean(raw.destination, 80) || null,
      travelDate: clean(raw.travelDate, 40) || null,
      message: message || null,
    },
  };
}
