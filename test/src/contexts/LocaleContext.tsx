import { createContext } from "react";

export type LocaleCode = "en-US" | "ja-JP";

export interface LocaleContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);
