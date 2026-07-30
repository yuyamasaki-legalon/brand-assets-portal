var e=`import type { TranslationDictionary } from "../../../../../hooks";

/**
 * ファイルアップロード依頼フォーム (/template/loc/case-reception-form) の翻訳辞書。
 *
 * SSOT は loc-app のテキスト: \`lib/loc-app/text-management/case-reception-form-f/translate.csv\`。
 * 各キーの出典コメント \`// {service}: {messageKey}\` が SSOT との紐づけを表す。
 * 値のずれは \`pnpm i18n:drift\` で検知・取込できる。
 * \`// mock-only\` は loc-app に対応の無いプロトタイプ専用文言（drift 対象外）。
 * このフォームの項目ラベル（案件名・依頼内容 等）は本番ではユーザーが定義する可変項目で
 * CSV に固定文言が無いため mock-only として扱う。
 *
 * 編集ガイド: SSOT 由来の文言修正は原則 loc-app 側 CSV で行い、\`pnpm i18n:drift --fix\` で同期する。
 */
export type TranslationKey =
  | "menu"
  | "pageTitle"
  | "backToList"
  | "senderName"
  | "emailAddress"
  | "shareMailLabel"
  | "inputPlaceholder"
  | "caseName"
  | "requestContent"
  | "fileLabel"
  | "uploadButton"
  | "uploadProgress"
  | "cancel"
  | "fileDropInstruction"
  | "deleteTooltip"
  | "removeFile"
  | "dueDate"
  | "confirmSubmit";

export const translations: TranslationDictionary<TranslationKey> = {
  "en-US": {
    // mock-only (ハンバーガーメニューのアイコンボタン)
    menu: "Menu",
    // mock-only (フォーム名はユーザー定義の可変文言)
    pageTitle: "File upload request form",
    // case-reception-form-f: inputBackToCaseReceptionFormLinkMessage
    backToList: "Matter intake forms",
    // mock-only (差出人情報の表示ラベル)
    senderName: "Sender name (email sender)",
    // mock-only
    emailAddress: "Email address",
    // mock-only (共有先メールの入力ラベル)
    shareMailLabel: "Email address to share with",
    // case-reception-form-f: caseTitleFormTextFieldPlaceholder @ /parts/show/Layout/shared/Input/CaseTitleForm
    inputPlaceholder: "Enter text",
    // mock-only (案件名はフォーム項目ラベル。可変文言)
    caseName: "Matter name",
    // mock-only
    requestContent: "Request details",
    // mock-only
    fileLabel: "File",
    // case-reception-form-f: uploadButtonTitle @ /parts/show/Layout/shared/Input/FileUploadForm
    uploadButton: "Select file",
    // mock-only (template ラベルは「アップロード中...」。SSOT は「読み込み中」)
    uploadProgress: "Uploading...",
    // mock-only
    cancel: "Cancel",
    // mock-only (template 文言。SSOT は「ファイルをここにドロップするか…」)
    fileDropInstruction: "Drag & drop a file here, or select one with the button to upload.",
    // case-reception-form-f: fileItemDeleteTooltip @ /parts/show/Layout/shared/Input/shared/FileItem
    deleteTooltip: "Delete",
    // mock-only (SSOT は「ファイル添付を取り消す」)
    removeFile: "Remove file",
    // mock-only
    dueDate: "Due date",
    // case-reception-form-f: inputConfirmButtonLabel
    confirmSubmit: "Confirm submission",
  },
  "ja-JP": {
    // mock-only
    menu: "メニュー",
    // mock-only
    pageTitle: "ファイルアップロード依頼フォーム",
    // case-reception-form-f: inputBackToCaseReceptionFormLinkMessage
    backToList: "案件受付フォーム一覧",
    // mock-only
    senderName: "送信者名（メールの差出人）",
    // mock-only
    emailAddress: "メールアドレス",
    // mock-only
    shareMailLabel: "共有先のメールアドレス",
    // case-reception-form-f: caseTitleFormTextFieldPlaceholder @ /parts/show/Layout/shared/Input/CaseTitleForm
    inputPlaceholder: "テキストを入力",
    // mock-only
    caseName: "案件名",
    // mock-only
    requestContent: "依頼内容",
    // mock-only
    fileLabel: "ファイル",
    // case-reception-form-f: uploadButtonTitle @ /parts/show/Layout/shared/Input/FileUploadForm
    uploadButton: "アップロード",
    // mock-only
    uploadProgress: "アップロード中...",
    // mock-only
    cancel: "キャンセル",
    // mock-only
    fileDropInstruction: "ファイルをドラッグ＆ドロップするか\\nボタンから選択してアップロードできます。",
    // case-reception-form-f: fileItemDeleteTooltip @ /parts/show/Layout/shared/Input/shared/FileItem
    deleteTooltip: "削除",
    // mock-only
    removeFile: "ファイルを削除",
    // mock-only
    dueDate: "納期",
    // case-reception-form-f: inputConfirmButtonLabel
    confirmSubmit: "送信内容を確認",
  },
};
`;export{e as default};