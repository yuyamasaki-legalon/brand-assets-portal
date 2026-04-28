import type { TranslationDictionary } from "../../../../../../../hooks";

export type TranslationKey =
  | "pageTitle"
  | "statusPageSamples"
  | "notFound"
  | "serverError"
  | "maintenance"
  | "notFoundTitle"
  | "serverErrorTitle"
  | "serverErrorDescription"
  | "serverErrorContact"
  | "reload"
  | "maintenanceTitle"
  | "maintenanceDescription"
  | "statusSite"
  | "nav.dashboard"
  | "nav.search"
  | "nav.assistant"
  | "nav.cases"
  | "nav.contracts"
  | "nav.esign"
  | "nav.concluded"
  | "nav.templates"
  | "nav.criteria"
  | "nav.others";

export const translations: TranslationDictionary<TranslationKey> = {
  "en-US": {
    pageTitle: "Error Page",
    statusPageSamples: "Status Page Samples",
    notFound: "NotFound",
    serverError: "Server Error",
    maintenance: "Maintenance",
    notFoundTitle: "The page you are looking for does not exist\nor you do not have permission to access it",
    serverErrorTitle: "An error occurred",
    serverErrorDescription: "The page cannot be displayed due to a server problem.",
    serverErrorContact: "If you need help, please contact",
    reload: "Reload",
    maintenanceTitle: "This feature is unavailable\ndue to maintenance",
    maintenanceDescription: "Please wait until maintenance is complete.",
    statusSite: "Status Site",
    "nav.dashboard": "Dashboard",
    "nav.search": "Search",
    "nav.assistant": "Assistant",
    "nav.cases": "Cases",
    "nav.contracts": "Contracts",
    "nav.esign": "E-Sign",
    "nav.concluded": "Concluded Contracts",
    "nav.templates": "Templates",
    "nav.criteria": "Review Criteria",
    "nav.others": "Others",
  },
  "ja-JP": {
    pageTitle: "Error Page",
    statusPageSamples: "状態別の画面サンプル",
    notFound: "NotFound",
    serverError: "Server Error",
    maintenance: "Maintenance",
    notFoundTitle: "お探しのページは存在しないか\n権限がないためアクセスできません",
    serverErrorTitle: "エラーが発生しました",
    serverErrorDescription: "サーバーで問題が発生しているためページを表示できません。",
    serverErrorContact: "お困りの際は",
    reload: "再読み込み",
    maintenanceTitle: "メンテナンス中のため\nこの機能はご利用いただけません",
    maintenanceDescription: "メンテナンス終了まで今しばらくお待ちください。",
    statusSite: "サービスステータスサイト",
    "nav.dashboard": "ダッシュボード",
    "nav.search": "検索",
    "nav.assistant": "アシスタント",
    "nav.cases": "案件",
    "nav.contracts": "契約",
    "nav.esign": "電子契約",
    "nav.concluded": "締結版契約書",
    "nav.templates": "ひな形",
    "nav.criteria": "契約書審査基準",
    "nav.others": "その他",
  },
};
