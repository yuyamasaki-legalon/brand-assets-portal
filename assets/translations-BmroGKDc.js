var e=`import type { TranslationDictionary } from "../../../../../hooks";

/**
 * LegalOn 共通サイドバー（GlobalSidebar）ナビゲーションの翻訳辞書。
 *
 * SSOT は loc-app のテキスト: \`lib/loc-app/text-management/loc-common-frontend/translate.csv\`
 * （\`/components/GlobalSidebar\`）。出典コメント \`// loc-common-frontend: {messageKey}\` が SSOT との紐づけ。
 * 値のずれは \`pnpm i18n:drift\` で検知・取込できる。
 *
 * 注: サブメニュー（menuItems）の翻訳は今回スコープ外。未翻訳キーは t() がキー文字列ではなく
 *     locNavigation 側の生ラベルを使うため、ja のまま表示される。
 */
export type NavigationTranslationKey =
  | "nav.home"
  | "nav.search"
  | "nav.assistant"
  | "nav.cases"
  | "nav.review"
  | "nav.contracts"
  | "nav.esign"
  | "nav.templates"
  | "nav.reviewCriteria"
  | "nav.report"
  | "nav.others";

export const navigationTranslations: TranslationDictionary<NavigationTranslationKey> = {
  "en-US": {
    // loc-common-frontend: homeMenu
    "nav.home": "Home",
    // loc-common-frontend: searchButtonText
    "nav.search": "Search",
    // loc-common-frontend: assistantMenu
    "nav.assistant": "Assistant",
    // loc-common-frontend: casesMenu
    "nav.cases": "Matters",
    // loc-common-frontend: reviewMenu
    "nav.review": "Review",
    // loc-common-frontend: contractsMenu
    "nav.contracts": "Contracts",
    // loc-common-frontend: esignMenu
    "nav.esign": "E-signature",
    // loc-common-frontend: templatesMenu
    "nav.templates": "Templates",
    // loc-common-frontend: playbooksMenu
    "nav.reviewCriteria": "Playbooks",
    // loc-common-frontend: analyticsMenu
    "nav.report": "Reports",
    // loc-common-frontend: otherMenu
    "nav.others": "More",
  },
  "ja-JP": {
    // loc-common-frontend: homeMenu
    "nav.home": "ホーム",
    // loc-common-frontend: searchButtonText
    "nav.search": "検索",
    // loc-common-frontend: assistantMenu
    "nav.assistant": "アシスタント",
    // loc-common-frontend: casesMenu
    "nav.cases": "案件",
    // loc-common-frontend: reviewMenu
    "nav.review": "レビュー",
    // loc-common-frontend: contractsMenu
    "nav.contracts": "契約書",
    // loc-common-frontend: esignMenu
    "nav.esign": "電子契約",
    // loc-common-frontend: templatesMenu
    "nav.templates": "ひな形",
    // loc-common-frontend: playbooksMenu
    "nav.reviewCriteria": "契約審査基準",
    // loc-common-frontend: analyticsMenu
    "nav.report": "レポート",
    // loc-common-frontend: otherMenu
    "nav.others": "その他",
  },
};
`;export{e as default};