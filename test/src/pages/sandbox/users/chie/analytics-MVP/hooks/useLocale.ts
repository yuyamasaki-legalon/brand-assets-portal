import { useContext } from "react";
import type { LocaleCode } from "../../../../../../contexts/LocaleContext";
import { AnalyticsMvpLocaleContext } from "../contexts/LocaleContext";

export interface UseLocaleResult {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
}

export const useLocale = (): UseLocaleResult => {
  const context = useContext(AnalyticsMvpLocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within AnalyticsMvpLocaleProvider");
  }
  return context;
};
