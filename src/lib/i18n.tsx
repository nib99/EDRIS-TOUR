import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { copy, type Copy } from "@/lib/copy";
import { isLang, type Lang } from "@/lib/i18n-lang";

const KEY = "edris-lang";
const DEFAULT_LANG: Lang = "om";

type Ctx = {
  lang: Lang;
  t: Copy;
  setLang: (lang: Lang) => void;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (isLang(saved)) setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      t: copy[lang],
      setLang: (next) => {
        setLangState(next);
        localStorage.setItem(KEY, next);
      },
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("Language provider is missing");
  return ctx;
}
