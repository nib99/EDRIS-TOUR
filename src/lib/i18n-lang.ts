export const LANGS = ["om", "am", "en"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(value: string | null): value is Lang {
  return value === "om" || value === "am" || value === "en";
}
