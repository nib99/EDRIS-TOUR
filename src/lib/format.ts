import type { Lang } from "@/lib/i18n-lang";

export function formatWhen(iso: string | null, lang: Lang): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const locale = lang === "am" ? "am-ET" : lang === "om" ? "om-ET" : "en-GB";
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }
}

export function telHref(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) return `tel:${trimmed.replace(/[^\d+]/g, "")}`;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("0")) return `tel:+251${digits.slice(1)}`;
  if (digits.startsWith("251")) return `tel:+${digits}`;
  return `tel:${digits}`;
}
