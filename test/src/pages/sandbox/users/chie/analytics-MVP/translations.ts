import type { TranslationDictionary } from "./hooks/useTranslation";

export const layoutTranslations = {
  "ja-JP": {
    pageTitle: "分析",
    home: "ホーム",
    search: "検索",
    assistant: "アシスタント",
    cases: "案件",
    contracts: "契約書",
    eContract: "電子契約",
    executedContracts: "締結済契約書",
    templates: "ひな形",
    contractReviewStandards: "契約審査基準",
    analytics: "レポート",
    other: "その他",
    teamMembers: "チーム・メンバー",
    designAdjustments: "デザイン調整",
  },
  "en-US": {
    pageTitle: "Analytics",
    home: "Home",
    search: "Search",
    assistant: "Assistant",
    cases: "Matters",
    contracts: "Contracts",
    eContract: "E-contract",
    executedContracts: "Executed contracts",
    templates: "Templates",
    contractReviewStandards: "Contract review standards",
    analytics: "Reports",
    other: "Other",
    teamMembers: "Team and Members",
    designAdjustments: "Design adjustments",
  },
} as const satisfies TranslationDictionary;

export type LayoutTranslationKey = keyof (typeof layoutTranslations)["ja-JP"];
