import { useContext } from "react";
import type { LocaleCode } from "../contexts/LocaleContext";
import { LocaleContext } from "../contexts/LocaleContext";

export interface UseLocaleResult {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
}

export const useLocale = (): UseLocaleResult => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleContext.Provider");
  }
  return context;
};
