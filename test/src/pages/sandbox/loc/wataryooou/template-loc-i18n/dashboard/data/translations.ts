import type { TranslationDictionary } from "../../../../../../../hooks";

export type TranslationKey =
  | "pageTitle"
  | "summaryTab"
  | "activityTab"
  | "attentionRequired"
  | "unreadReplies"
  | "sealApprovalWaiting"
  | "esignWaiting"
  | "cases"
  | "inCharge"
  | "dueDateOrder"
  | "days3"
  | "today"
  | "overdue"
  | "unassigned"
  | "myRequests"
  | "contractsNeedConfirmation"
  | "noContractsNeedConfirmation"
  | "openSummary"
  | "close"
  | "assistantTitle"
  | "promptLibrary"
  | "enterQuestion"
  | "sources"
  | "shortcutsTab"
  | "lawUpdatesTab"
  | "lawUpdatesEmpty"
  | "reviewContracts"
  | "contractReview"
  | "contractReviewDescription"
  | "searchPastContracts"
  | "editPlaybook"
  | "editPlaybookDescription"
  | "requestApply"
  | "contractApproval"
  | "sendEsign"
  | "manageContracts"
  | "uploadConcluded"
  | "searchConcluded"
  | "createContracts"
  | "companyTemplates"
  | "legalonTemplates"
  | "applicationRequest"
  | "dueDate";

export const translations: TranslationDictionary<TranslationKey> = {
  "en-US": {
    pageTitle: "Home",
    summaryTab: "Summary",
    activityTab: "Activity",
    attentionRequired: "Your attention required",
    unreadReplies: "Unread replies",
    sealApprovalWaiting: "Seal approval waiting",
    esignWaiting: "E-sign waiting",
    cases: "Cases",
    inCharge: "In charge",
    dueDateOrder: "Due date order",
    days3: "3 days",
    today: "Today",
    overdue: "Overdue",
    unassigned: "Unassigned",
    myRequests: "My requests",
    contractsNeedConfirmation: "Contracts need confirmation",
    noContractsNeedConfirmation: "No contracts need confirmation",
    openSummary: "Open summary",
    close: "Close",
    assistantTitle: "I'm LegalOn Assistant.\nIs there anything I can help you with?",
    promptLibrary: "Prompt Library",
    enterQuestion: "Enter your question",
    sources: "sources",
    shortcutsTab: "Shortcuts",
    lawUpdatesTab: "Law Updates",
    lawUpdatesEmpty: "Displays the latest legal updates and system updates",
    reviewContracts: "Review contracts",
    contractReview: "Contract Review & Proofreading",
    contractReviewDescription: "Check for risks and legal violations by contract type",
    searchPastContracts: "Search past contract clauses",
    editPlaybook: "Edit Playbook",
    editPlaybookDescription: "Register your company's contract review criteria",
    requestApply: "Request & Apply",
    contractApproval: "Contract approval application",
    sendEsign: "Send e-sign (signature request)",
    manageContracts: "Manage contracts",
    uploadConcluded: "Upload concluded contracts",
    searchConcluded: "Search concluded contracts",
    createContracts: "Create contracts",
    companyTemplates: "Company templates",
    legalonTemplates: "LegalOn Templates",
    applicationRequest: "Application Request",
    dueDate: "Due date",
  },
  "ja-JP": {
    pageTitle: "ホーム",
    summaryTab: "サマリー",
    activityTab: "アクティビティ",
    attentionRequired: "あなたの対応が必要",
    unreadReplies: "未読の返信",
    sealApprovalWaiting: "押印の承認待ち",
    esignWaiting: "電子契約の署名待ち",
    cases: "案件",
    inCharge: "担当中",
    dueDateOrder: "納期順",
    days3: "3日",
    today: "今日",
    overdue: "超過",
    unassigned: "担当者が未割り当て",
    myRequests: "自分の依頼・申請",
    contractsNeedConfirmation: "確認が必要な契約",
    noContractsNeedConfirmation: "確認が必要な契約はありません",
    openSummary: "サマリーを開く",
    close: "閉じる",
    assistantTitle: "LegalOnアシスタントです。\n何かお手伝いすることはありますか？",
    promptLibrary: "プロンプトライブラリー",
    enterQuestion: "質問を入力",
    sources: "件のソース",
    shortcutsTab: "ショートカット",
    lawUpdatesTab: "法改正・アップデート",
    lawUpdatesEmpty: "最新の法改正情報やシステムアップデートを表示します",
    reviewContracts: "契約書をレビューする",
    contractReview: "契約書レビュー・校正",
    contractReviewDescription: "契約類型別のリスクや取消法などの法令違反をチェック",
    searchPastContracts: "過去契約書の条文を検索",
    editPlaybook: "プレイブックを編集",
    editPlaybookDescription: "契約書レビューに使う、自社の契約審査基準を登録",
    requestApply: "依頼・申請をする",
    contractApproval: "契約締結の承認申請",
    sendEsign: "電子契約を送信（署名依頼）",
    manageContracts: "契約を管理する",
    uploadConcluded: "締結済み契約書をアップロード",
    searchConcluded: "締結済み契約書を検索",
    createContracts: "契約書の作成",
    companyTemplates: "自社ひな形",
    legalonTemplates: "LegalOnテンプレート",
    applicationRequest: "契約締結に関する申請",
    dueDate: "納期",
  },
};
