// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ActivityEventType = "案件更新" | "タスク完了" | "メール送信" | "ミーティング";

export interface ActivityItem {
  id: string;
  actor: string;
  description: string;
  eventType: ActivityEventType;
  occurredAt: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export const eventTypeColorMap: Record<ActivityEventType, "blue" | "teal"> = {
  案件更新: "blue",
  タスク完了: "teal",
  メール送信: "blue",
  ミーティング: "teal",
};

// ---------------------------------------------------------------------------
// Filter options
// ---------------------------------------------------------------------------

export const eventTypeOptions = [
  { label: "案件更新", value: "案件更新" },
  { label: "タスク完了", value: "タスク完了" },
  { label: "メール送信", value: "メール送信" },
  { label: "ミーティング", value: "ミーティング" },
];

export const periodOptions = [
  { label: "全期間", value: "" },
  { label: "今日", value: "today" },
  { label: "今週", value: "week" },
  { label: "今月", value: "month" },
];

export const actorOptions = [
  { label: "田中 真央", value: "田中 真央" },
  { label: "Sela", value: "Sela" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const formatDateTime = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}年${m}月${d}日 ${hh}:${mm}`;
};

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const activityItems: ActivityItem[] = [
  {
    id: "1",
    actor: "Sela",
    description: "案件の進捗状況を分析し、リスク要因を特定しました。",
    eventType: "案件更新",
    occurredAt: "2026-01-15T09:00:00",
  },
  {
    id: "2",
    actor: "田中 真央",
    description: "部門ニーズを確認し、導入スケジュールを擦り合わせました。",
    eventType: "案件更新",
    occurredAt: "2026-01-14T14:30:00",
  },
  {
    id: "3",
    actor: "Sela",
    description: "部門の要望に沿った提案資料を自動生成しました。",
    eventType: "案件更新",
    occurredAt: "2026-01-13T16:00:00",
  },
];
