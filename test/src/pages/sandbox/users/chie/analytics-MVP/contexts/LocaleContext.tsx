import { createContext, useCallback, useEffect, useState } from "react";
import type { LocaleCode } from "../../../../../../contexts/LocaleContext";

const LOCALE_STORAGE_KEY = "aegis-lab:analytics-mvp:locale";

interface LocaleContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
}

export const AnalyticsMvpLocaleContext = createContext<LocaleContextValue | null>(null);

const getInitialLocale = (): LocaleCode => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en-US" || stored === "ja-JP") {
      return stored;
    }
  } catch {
    // localStorage access may fail in some environments
  }
  return "en-US";
};

interface AnalyticsMvpLocaleProviderProps {
  children: React.ReactNode;
}

export function AnalyticsMvpLocaleProvider({ children }: AnalyticsMvpLocaleProviderProps) {
  const [locale, setLocaleState] = useState<LocaleCode>(getInitialLocale);

  // Save to localStorage when locale changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // localStorage access may fail in some environments
    }
  }, [locale]);

  const setLocale = useCallback((newLocale: LocaleCode) => {
    setLocaleState(newLocale);
  }, []);

  return (
    <AnalyticsMvpLocaleContext.Provider value={{ locale, setLocale }}>{children}</AnalyticsMvpLocaleContext.Provider>
  );
}
