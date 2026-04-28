import type { TranslationDictionary } from "../../../../../../../hooks";

export type NavigationTranslationKey =
  | "nav.home"
  | "nav.search"
  | "nav.assistant"
  | "nav.cases"
  | "nav.review"
  | "nav.contracts"
  | "nav.esign"
  | "nav.concludedContracts"
  | "nav.templates"
  | "nav.reviewCriteria"
  | "nav.others";

export const navigationTranslations: TranslationDictionary<NavigationTranslationKey> = {
  "en-US": {
    "nav.home": "Home",
    "nav.search": "Search",
    "nav.assistant": "Assistant",
    "nav.cases": "Cases",
    "nav.review": "Review",
    "nav.contracts": "Contracts",
    "nav.esign": "E-Sign",
    "nav.concludedContracts": "Concluded Contracts",
    "nav.templates": "Templates",
    "nav.reviewCriteria": "Review Criteria",
    "nav.others": "Others",
  },
  "ja-JP": {
    "nav.home": "ホーム",
    "nav.search": "検索",
    "nav.assistant": "アシスタント",
    "nav.cases": "案件",
    "nav.review": "レビュー",
    "nav.contracts": "契約書",
    "nav.esign": "電子契約",
    "nav.concludedContracts": "締結版契約書",
    "nav.templates": "ひな形",
    "nav.reviewCriteria": "契約審査基準",
    "nav.others": "その他",
  },
};
