import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { LocaleCode } from "../contexts/LocaleContext";

const LOCALE_PARAM = "lang";
const DEFAULT_LOCALE: LocaleCode = "ja-JP";
const VALID_LOCALES: LocaleCode[] = ["en-US", "ja-JP"];

const isValidLocale = (value: string | null): value is LocaleCode => {
  return value !== null && VALID_LOCALES.includes(value as LocaleCode);
};

export const useLocaleUrl = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const langParam = searchParams.get(LOCALE_PARAM);
  const locale: LocaleCode = isValidLocale(langParam) ? langParam : DEFAULT_LOCALE;

  const setLocale = useCallback(
    (newLocale: LocaleCode) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(LOCALE_PARAM, newLocale);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { locale, setLocale };
};
