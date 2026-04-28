import type { CaseData, LinkedFile, SelectOption, StampInfo, StatusConfig, TimelineMessage } from "./types";

// スタンプの定義
export const AVAILABLE_STAMPS: StampInfo[] = [
  { id: "thumbsup", emoji: "\u{1F44D}", label: "いいね" },
  { id: "heart", emoji: "\u{2764}\u{FE0F}", label: "ハート" },
  { id: "clap", emoji: "\u{1F44F}", label: "拍手" },
  { id: "check", emoji: "\u{2705}", label: "確認済み" },
  { id: "eyes", emoji: "\u{1F440}", label: "確認中" },
  { id: "thinking", emoji: "\u{1F914}", label: "検討中" },
  { id: "rocket", emoji: "\u{1F680}", label: "進行中" },
  { id: "warning", emoji: "\u{26A0}\u{FE0F}", label: "注意" },
];

// サンプルの案件データ
export const caseData: CaseData = {
  id: "2024-03-0020",
  title: "業務委託契約書のレビュー依頼",
  content:
    "新規取引先との業務委託契約書について、リスク条項の確認をお願いします。特に損害賠償の上限条項と秘密保持義務の範囲についてご確認いただきたいです。",
  url: "https://docs.google.com/document/d/1abc123xyz",
  labels: ["業務委託", "契約書レビュー", "リスク確認"],
  caseType: "契約書の起案",
  status: "進行タスク001",
  mainAssignee: "山田 太郎",
  subAssignees: ["佐藤 花子", "鈴木 一郎", "田中 美咲"],
  department: "営業部",
  requester: "高橋 健太",
  dueDate: "2024/11/08",
  space: "営業部スペース",
  urgency: "",
};

// タイムラインメッセージ（初期データ）
export const initialTimelineMessages: TimelineMessage[] = [
  {
    id: "1",
    type: "mail",
    sender: "高橋 健太",
    date: "2024/10/22 18:30",
    content: `山田様

お忙しいところ恐れ入ります。
先日ご依頼した業務委託契約書について、取引先から追加の条件変更依頼がございました。

変更点：
・支払条件を月末締め翌月末払いから翌々月15日払いに変更
・契約期間を1年から2年に延長

上記変更に伴うリスクについてもご確認いただけますと幸いです。
何卒よろしくお願いいたします。

高橋`,
    stamps: [{ id: "eyes", emoji: "\u{1F440}", count: 2, users: ["山田 太郎", "佐藤 花子"] }],
  },
  {
    id: "2",
    type: "comment",
    sender: "山田 太郎",
    date: "2024/10/22 14:15",
    content: `高橋様

ご依頼ありがとうございます。
契約書を確認いたしました。以下の点についてコメントいたします。

1. 損害賠償条項について
   上限金額の設定が曖昧なため、具体的な金額または契約金額の●倍という形式での明記を推奨します。

2. 秘密保持条項について
   秘密情報の定義が広すぎる印象です。営業秘密に限定するか、具体的な情報カテゴリを列挙することを検討ください。

ご不明点があればお気軽にご連絡ください。

山田`,
    stamps: [
      { id: "thumbsup", emoji: "\u{1F44D}", count: 3, users: ["高橋 健太", "佐藤 花子", "鈴木 一郎"] },
      { id: "check", emoji: "\u{2705}", count: 1, users: ["高橋 健太"] },
    ],
  },
];

// 案件タイプオプション
export const caseTypeOptions: SelectOption[] = [
  { label: "契約書の起案", value: "contract_draft" },
  { label: "契約書レビュー", value: "contract_review" },
  { label: "法務相談", value: "legal_consultation" },
];

// ステータスオプション
export const statusOptions: SelectOption[] = [
  { label: "法務確認中", value: "legal_review" },
  { label: "依頼者確認待ち", value: "requester_pending" },
  { label: "未着手", value: "not_started" },
  { label: "対応中", value: "in_progress" },
  { label: "完了", value: "completed" },
  { label: "差戻し", value: "returned" },
];

// 担当者オプション
export const assigneeOptions: SelectOption[] = [
  { label: "山田 太郎", value: "yamada" },
  { label: "佐藤 花子", value: "sato" },
  { label: "鈴木 一郎", value: "suzuki" },
  { label: "田中 美咲", value: "tanaka" },
  { label: "高橋 健太", value: "takahashi" },
];

// 部署オプション
export const departmentOptions: SelectOption[] = [
  { label: "営業部", value: "sales" },
  { label: "開発部", value: "dev" },
  { label: "人事部", value: "hr" },
  { label: "経理部", value: "accounting" },
  { label: "法務部", value: "legal" },
];

// リンク済みファイル
export const linkedFiles: LinkedFile[] = [
  {
    id: "1",
    name: "業務委託契約書_v3.docx",
    updatedAt: "2024/10/21 17:02",
    status: "reviewing",
    url: "https://docs.google.com/document/d/1abc123xyz",
    isPrimary: true,
  },
  {
    id: "2",
    name: "秘密保持契約書（NDA）.pdf",
    updatedAt: "2024/10/18 12:44",
    status: "approved",
    url: "https://docs.google.com/document/d/1nda123xyz",
  },
  {
    id: "3",
    name: "条件変更要望.pdf",
    updatedAt: "2024/10/22 09:17",
    status: "pending",
    url: "https://docs.google.com/document/d/1request123xyz",
  },
  {
    id: "4",
    name: "基本契約書_ドラフト.docx",
    updatedAt: "2024/10/20 14:30",
    status: "draft",
    url: "https://docs.google.com/document/d/1draft123xyz",
  },
  {
    id: "5",
    name: "覚書_修正版.pdf",
    updatedAt: "2024/10/19 11:15",
    status: "rejected",
    url: "https://docs.google.com/document/d/1memo123xyz",
  },
];

export const primaryContractFile = linkedFiles.find((file) => file.isPrimary) ?? linkedFiles[0];

// 契約ステータスの設定
export const contractStatusConfig: Record<string, StatusConfig> = {
  reviewing: { label: "レビュー中", color: "blue" },
  approved: { label: "承認済み", color: "teal" },
  rejected: { label: "差戻し", color: "red" },
  pending: { label: "確認待ち", color: "yellow" },
  draft: { label: "ドラフト", color: "neutral" },
};

// 現在のユーザー（デモ用）
export const CURRENT_USER = "山田 太郎";
