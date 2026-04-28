import type { TranslationDictionary } from "../../../../../../../hooks";

export type TranslationKey =
  | "contractRisk"
  | "compliance"
  | "search"
  | "settings"
  | "more"
  | "edit"
  | "editFile"
  | "addComment"
  | "riskCheck"
  | "riskCheckResult"
  | "complianceCheckResult"
  | "reviewSettings"
  | "filter"
  | "download"
  | "loading"
  | "playbook"
  | "playbookReviewResult"
  | "playbookName"
  | "playbookAlert"
  | "checkpointTips"
  | "severity"
  | "importance"
  | "severityLow"
  | "severityMedium"
  | "severityHigh"
  | "showDetails"
  | "back"
  | "fileTitle"
  | "contractLanguage"
  | "contractCategory"
  | "articleNumber"
  | "articleTitle"
  | "articleContent"
  | "checkPoint"
  | "guidance"
  | "languageJa"
  | "languageEn"
  | "ndaTitle"
  | "ndaVersion"
  | "article1Title"
  | "article1Content"
  | "article2Title"
  | "article2Content";

export const translations: TranslationDictionary<TranslationKey> = {
  "en-US": {
    contractRisk: "Contract Risk",
    compliance: "Compliance",
    search: "Search",
    settings: "Settings",
    more: "More",
    edit: "Edit",
    editFile: "Edit File",
    addComment: "Add Comment",
    riskCheck: "Contract Risk Check",
    riskCheckResult: "Risk Check Result",
    complianceCheckResult: "Compliance Check Result",
    reviewSettings: "Review Settings",
    filter: "Filter",
    download: "Download",
    loading: "Loading additional alerts...",
    playbook: "Playbook",
    playbookReviewResult: "My Playbooks - Review Result",
    playbookName: "Playbook name",
    playbookAlert: "Playbook alert",
    checkpointTips: "Checkpoint Creation Tips",
    severity: "Severity:",
    importance: "Importance",
    severityLow: "[Low]",
    severityMedium: "[Medium]",
    severityHigh: "[High]",
    showDetails: "Show Details",
    back: "Back",
    fileTitle: "Contract filename",
    contractLanguage: "Language",
    contractCategory: "Category",
    articleNumber: "Article number",
    articleTitle: "Article title",
    articleContent: "Article",
    checkPoint: "Alert summary",
    guidance: "Suggestion",
    languageJa: "Japanese",
    languageEn: "English",
    ndaTitle: "Non-Disclosure Agreement",
    ndaVersion: "v.1",
    article1Title: "Article 1 (Purpose)",
    article1Content:
      "Party A and Party B enter into this Agreement for the purpose of evaluating the possibility of business collaboration.",
    article2Title: "Article 2 (Definition of Confidential Information)",
    article2Content:
      "In this Agreement, confidential information refers to all information disclosed by Party A or Party B.",
  },
  "ja-JP": {
    contractRisk: "契約リスク",
    compliance: "法令遵守",
    search: "検索",
    settings: "設定",
    more: "その他",
    edit: "編集",
    editFile: "ファイルを編集",
    addComment: "コメントを追加",
    riskCheck: "契約リスクチェック",
    riskCheckResult: "リスクチェック結果",
    complianceCheckResult: "法令遵守チェック結果",
    reviewSettings: "レビュー設定",
    filter: "フィルター",
    download: "ダウンロード",
    loading: "追加のアラートを読み込んでいます...",
    playbook: "プレイブック",
    playbookReviewResult: "プレイブックレビュー結果",
    playbookName: "プレイブック名",
    playbookAlert: "チェックポイント",
    checkpointTips: "チェックポイント作成のヒント",
    severity: "重要度:",
    importance: "重要度",
    severityLow: "【低】",
    severityMedium: "【中】",
    severityHigh: "【高】",
    showDetails: "詳細を表示",
    back: "戻る",
    fileTitle: "契約書ファイル名",
    contractLanguage: "言語",
    contractCategory: "契約書類型",
    articleNumber: "条番号",
    articleTitle: "条タイトル",
    articleContent: "条本文",
    checkPoint: "チェックポイント",
    guidance: "対応例",
    languageJa: "日本語",
    languageEn: "英語",
    ndaTitle: "秘密保持契約",
    ndaVersion: "v.1",
    article1Title: "第１条（目的）",
    article1Content:
      "甲及び乙は、甲乙間の業務提携（以下「本件取引」という。）の可能性を検討することを目的として、本契約を締結する。",
    article2Title: "第２条（秘密情報の定義）",
    article2Content:
      "本契約において秘密情報とは、甲又は乙が開示した技術、開発、製品、営業、人事、財務、組織その他の事項に関する一切の情報をいう。",
  },
};
