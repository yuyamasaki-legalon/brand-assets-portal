import type { ReactNode } from "react";
import { useLocaleUrl } from "../hooks/useLocaleUrl";
import { LocaleContext } from "./LocaleContext";

interface LocaleUrlProviderProps {
  children: ReactNode;
}

export const LocaleUrlProvider = ({ children }: LocaleUrlProviderProps) => {
  const { locale, setLocale } = useLocaleUrl();

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
};
