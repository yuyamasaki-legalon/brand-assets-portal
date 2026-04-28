import type { TranslationDictionary } from "../../../../../../../hooks";

export type TranslationKey =
  | "formTitle"
  | "backToList"
  | "senderName"
  | "emailAddress"
  | "shareEmail"
  | "caseName"
  | "requestContent"
  | "file"
  | "dueDate"
  | "confirmSubmit"
  | "upload"
  | "uploading"
  | "cancel"
  | "dragDropDescription"
  | "delete"
  | "placeholder";

export const translations: TranslationDictionary<TranslationKey> = {
  "en-US": {
    formTitle: "File Upload Request Form",
    backToList: "Case Reception Form List",
    senderName: "Sender Name (Email From)",
    emailAddress: "Email Address",
    shareEmail: "Share Email Address",
    caseName: "Case Name",
    requestContent: "Request Content",
    file: "File",
    dueDate: "Due Date",
    confirmSubmit: "Confirm & Submit",
    upload: "Upload",
    uploading: "Uploading...",
    cancel: "Cancel",
    dragDropDescription: "Drag & drop files here or\nclick the button to upload.",
    delete: "Delete",
    placeholder: "Enter text",
  },
  "ja-JP": {
    formTitle: "ファイルアップロード依頼フォーム",
    backToList: "案件受付フォーム一覧",
    senderName: "送信者名（メールの差出人）",
    emailAddress: "メールアドレス",
    shareEmail: "共有先のメールアドレス",
    caseName: "案件名",
    requestContent: "依頼内容",
    file: "ファイル",
    dueDate: "納期",
    confirmSubmit: "送信内容を確認",
    upload: "アップロード",
    uploading: "アップロード中...",
    cancel: "キャンセル",
    dragDropDescription: "ファイルをドラッグ＆ドロップするか\nボタンから選択してアップロードできます。",
    delete: "削除",
    placeholder: "テキストを入力",
  },
};
