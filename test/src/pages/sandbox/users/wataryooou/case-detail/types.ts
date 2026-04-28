// スタンプの定義情報
export interface StampInfo {
  id: string;
  emoji: string;
  label: string;
}

// メッセージに付与されたスタンプ
export interface Stamp {
  id: string;
  emoji: string;
  count: number;
  users: string[];
}

// タイムラインのメッセージ
export interface TimelineMessage {
  id: string;
  type: string;
  sender: string;
  date: string;
  content: string;
  stamps?: Stamp[];
}

// 契約ステータス
export type ContractStatus = "reviewing" | "approved" | "rejected" | "pending" | "draft";

// リンク済みファイル
export interface LinkedFile {
  id: string;
  name: string;
  updatedAt: string;
  status: ContractStatus;
  url: string;
  isPrimary?: boolean;
}

// サイドペインの種類
export type PaneType = "case-info" | "linked-file";

// 案件データ
export interface CaseData {
  id: string;
  title: string;
  content: string;
  url: string;
  labels: string[];
  caseType: string;
  status: string;
  mainAssignee: string;
  subAssignees: string[];
  department: string;
  requester: string;
  dueDate: string;
  space: string;
  urgency: string;
}

// ステータスラベルの設定
export interface StatusConfig {
  label: string;
  color: "blue" | "teal" | "red" | "yellow" | "neutral";
}

// セレクトオプション
export interface SelectOption {
  label: string;
  value: string;
}
