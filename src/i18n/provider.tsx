"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  isLocale,
  messages,
  type Locale,
} from "./index";

const STORAGE_KEY = "avtomatic.locale";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Restore the saved locale (or browser language) on first client render.
  // Server renders the default locale; we reconcile to the persisted choice
  // here to avoid a hydration mismatch on the initial HTML.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const browser = window.navigator.language.slice(0, 2);
    const initial = isLocale(saved)
      ? saved
      : isLocale(browser)
        ? browser
        : null;
    if (initial && initial !== DEFAULT_LOCALE) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from persisted preference
      setLocaleState(initial);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: string) =>
      messages[locale][key as keyof (typeof messages)[Locale]] ??
      messages.en[key as keyof typeof messages.en] ??
      key,
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
