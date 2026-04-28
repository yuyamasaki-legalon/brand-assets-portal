import { useCallback } from "react";
import type { LocaleCode } from "../../../../../../contexts/LocaleContext";
import { useLocale } from "./useLocale";

/**
 * 翻訳辞書の型
 * 各ロケールに対して同じキーセットを持つオブジェクト
 */
export type TranslationDictionary<K extends string = string> = {
  [L in LocaleCode]: { [key in K]: string };
};

export interface UseTranslationResult<K extends string> {
  /** 翻訳キーから翻訳文字列を取得する関数 */
  t: (key: K) => string;
  /** 現在のロケール */
  locale: LocaleCode;
}

/**
 * 翻訳辞書から翻訳を取得する hook
 *
 * @example
 * ```tsx
 * const translations = {
 *   "en-US": { title: "Hello" },
 *   "ja-JP": { title: "こんにちは" },
 * } as const;
 *
 * type Key = keyof typeof translations["en-US"];
 *
 * const { t } = useTranslation<Key>(translations);
 * return <h1>{t("title")}</h1>;
 * ```
 */
export const useTranslation = <K extends string>(dictionary: TranslationDictionary<K>): UseTranslationResult<K> => {
  const { locale } = useLocale();

  const t = useCallback(
    (key: K): string => {
      const translations = dictionary[locale];
      return translations?.[key] ?? key;
    },
    [dictionary, locale],
  );

  return { t, locale };
};
