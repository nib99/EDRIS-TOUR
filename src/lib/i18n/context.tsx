import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations, type Lang, type TranslationMap } from "./translations";

const STORAGE_KEY = "idris-lang";
const CONTENT_KEY = "idris-content-overrides";

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationMap;
  /** Merge admin overrides on top of base translations for current lang */
  applyOverrides: (overrides: Partial<TranslationMap>) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function loadOverrides(): Partial<Record<Lang, Partial<TranslationMap>>> {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<Record<Lang, Partial<TranslationMap>>>;
  } catch {
    return {};
  }
}

function deepMerge<T extends object>(base: T, over?: Partial<T>): T {
  if (!over) return base;
  const out = { ...base };
  for (const key of Object.keys(over) as (keyof T)[]) {
    const v = over[key];
    if (v && typeof v === "object" && !Array.isArray(v) && typeof base[key] === "object") {
      // @ts-expect-error deep merge
      out[key] = deepMerge(base[key] as object, v as object);
    } else if (v !== undefined) {
      // @ts-expect-error assign
      out[key] = v;
    }
  }
  return out;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("om");
  const [overrides, setOverrides] = useState<Partial<Record<Lang, Partial<TranslationMap>>>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "en" || saved === "om" || saved === "am") setLangState(saved);
      setOverrides(loadOverrides());
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l === "am" ? "am" : l === "om" ? "om" : "en";
    } catch {
      /* ignore */
    }
  }, []);

  const applyOverrides = useCallback(
    (partial: Partial<TranslationMap>) => {
      setOverrides((prev) => {
        const next = {
          ...prev,
          [lang]: deepMerge(prev[lang] ?? {}, partial),
        };
        try {
          localStorage.setItem(CONTENT_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [lang],
  );

  const t = useMemo(() => {
    const base = translations[lang];
    return deepMerge(base, overrides[lang]);
  }, [lang, overrides]);

  useEffect(() => {
    document.documentElement.lang = lang === "am" ? "am" : lang === "om" ? "om" : "en";
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t, applyOverrides }),
    [lang, setLang, t, applyOverrides],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
