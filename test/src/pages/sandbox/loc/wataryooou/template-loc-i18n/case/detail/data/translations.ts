import type { TranslationDictionary } from "../../../../../../../../hooks";

export type TranslationKey =
  | "back"
  | "search"
  | "more"
  | "caseOverview"
  | "edit"
  | "caseKeywords"
  | "searchLaws"
  | "timeline"
  | "slack"
  | "email"
  | "caseInfo"
  | "caseSummary"
  | "relatedFiles"
  | "relatedCases"
  | "reference"
  | "materials"
  | "close"
  | "postMessage"
  | "showHistory"
  | "refresh"
  | "generateSummary"
  | "summaryDescription"
  | "open"
  | "viewDetails"
  | "cancel"
  | "save"
  | "caseName"
  | "caseNumber"
  | "caseType"
  | "caseStatus"
  | "caseAssignee"
  | "subAssignee"
  | "requesterDepartment"
  | "requester"
  | "requesterEmail"
  | "dueDate"
  | "saveTo"
  | "moveCase"
  | "caseLabel"
  | "requestedContent"
  | "caseCreatedAt"
  | "notFilled";

export const translations: TranslationDictionary<TranslationKey> = {
  "en-US": {
    back: "Back",
    search: "Search",
    more: "More",
    caseOverview: "Case Overview",
    edit: "Edit",
    caseKeywords: "Case Keywords",
    searchLaws: "Search Laws & Guidelines",
    timeline: "Timeline",
    slack: "Slack",
    email: "Email",
    caseInfo: "Case Info",
    caseSummary: "Case Summary",
    relatedFiles: "Related Files",
    relatedCases: "Related Cases",
    reference: "Reference",
    materials: "Materials",
    close: "Close",
    postMessage: "Post",
    showHistory: "Show History",
    refresh: "Refresh",
    generateSummary: "Generate Summary",
    summaryDescription: "Generate case summary based on message exchange",
    open: "Open",
    viewDetails: "View Details",
    cancel: "Cancel",
    save: "Save",
    caseName: "Matter name",
    caseNumber: "ID",
    caseType: "Matter type",
    caseStatus: "Status",
    caseAssignee: "Assignee",
    subAssignee: "Secondary assignee",
    requesterDepartment: "Requesting department",
    requester: "Requester",
    requesterEmail: "Requester's email address",
    dueDate: "Due date",
    saveTo: "Save To",
    moveCase: "Move Case",
    caseLabel: "Case Label",
    requestedContent: "Details",
    caseCreatedAt: "Matters created on",
    notFilled: "Not provided",
  },
  "ja-JP": {
    back: "戻る",
    search: "検索",
    more: "その他",
    caseOverview: "案件概要",
    edit: "編集",
    caseKeywords: "案件キーワード",
    searchLaws: "法令・ガイドラインを検索",
    timeline: "タイムライン",
    slack: "Slack",
    email: "メール",
    caseInfo: "案件情報",
    caseSummary: "案件サマリー",
    relatedFiles: "関連ファイル",
    relatedCases: "関連案件",
    reference: "参考情報",
    materials: "参考資料",
    close: "閉じる",
    postMessage: "投稿",
    showHistory: "履歴を表示",
    refresh: "更新",
    generateSummary: "案件要約を生成",
    summaryDescription: "メッセージのやり取りを元に案件要約を生成します",
    open: "開く",
    viewDetails: "詳細へ",
    cancel: "キャンセル",
    save: "保存",
    caseName: "案件名",
    caseNumber: "案件番号",
    caseType: "案件タイプ",
    caseStatus: "ステータス",
    caseAssignee: "案件担当者",
    subAssignee: "副担当者",
    requesterDepartment: "依頼部署",
    requester: "依頼者",
    requesterEmail: "依頼者メールアドレス",
    dueDate: "納期",
    saveTo: "保存先",
    moveCase: "案件を移動",
    caseLabel: "案件ラベル",
    requestedContent: "依頼内容",
    caseCreatedAt: "案件作成日時",
    notFilled: "未入力",
  },
};
