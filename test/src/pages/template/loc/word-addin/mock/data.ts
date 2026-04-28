// 保存先オプション
export const STORAGE_OPTIONS = [
  { label: "契約書 / 契約管理 / LegalOn", value: "legalon" },
  { label: "取引先 / 株式会社シロクマ商事", value: "client" },
  { label: "個人の保存先", value: "personal" },
];

// 契約書ステータスオプション
export const CONTRACT_STATUS_OPTIONS = [
  { label: "下書き", value: "draft" },
  { label: "レビュー中", value: "reviewing" },
  { label: "承認済み", value: "approved" },
  { label: "締結済み", value: "signed" },
];

// ドキュメント型定義
export interface Document {
  id: string;
  name: string;
  company: string;
  date?: string;
}

// ドキュメントリスト（検索結果用）
export const DOCUMENT_LIST: Document[] = [
  { id: "1", name: "[SIGN] 24.12.25 NDA DANA EDIK x Legal On 202512 (1).pdf", company: "" },
  { id: "2", name: "LegalOn利用申込書_マフテック株式会社様.pdf", company: "マフテック株式会社" },
  { id: "3", name: "LegalOn利用申込書_株式会社Delphy御中.pdf", company: "株式会社Delphy" },
  { id: "4", name: "【ひな形】商標等使用同意書（当社許諾する側）_250515r.docx", company: "" },
  { id: "5", name: "覚書_株式会社 LegalOn Technologies様_20251225_revised.docx", company: "ALH株式会社" },
  { id: "6", name: "LegalOn利用申込書_株式会社吉井企画様.pdf", company: "株式会社吉井企画" },
  { id: "7", name: "LegalOn利用申込書_株式会社TMC御中.pdf", company: "株式会社TMC" },
  { id: "8", name: "LegalOn利用申込書_株式会社 Village AI御中.pdf", company: "株式会社VillageAI" },
  { id: "9", name: "LegalOn 利用申込書_コニカミノルタ株式会社様.pdf", company: "コニカミノルタ株式会社" },
  {
    id: "10",
    name: "20251219_【個別契約書】ADXL広告取扱サービス利用申込書_株式会社LegalOn Technologies（2025年12月）.pdf",
    company: "",
  },
];

// 契約類型オプション
export const CONTRACT_TYPE_OPTIONS = [
  { label: "秘密保持契約", value: "nda" },
  { label: "業務委託契約", value: "outsourcing" },
  { label: "売買契約", value: "sales" },
  { label: "賃貸借契約", value: "lease" },
];

// 自社の立場オプション
export const COMPANY_POSITION_OPTIONS = [
  { label: "開示・受領側", value: "both" },
  { label: "開示側", value: "discloser" },
  { label: "受領側", value: "recipient" },
];

// その他レビュー条件オプション
export const OTHER_CONDITIONS_OPTIONS = [
  { label: "その他の条件なし", value: "none" },
  { label: "厳格なレビュー", value: "strict" },
  { label: "簡易レビュー", value: "simple" },
];

// プレイブックアラート
export interface Playbook {
  id: string;
  name: string;
}

export const PLAYBOOK_LIST: Playbook[] = [
  { id: "1", name: "Intake Agent NDAテスト用 (copy)" },
  { id: "2", name: "Intake Agent NDAテスト用" },
  { id: "3", name: "プレイブック名:プレイブックに紐づいていないチェックポイント" },
  { id: "4", name: "プレイブック名:プレイブック1、利用シーン:プレイブック1の利用シーン" },
];
