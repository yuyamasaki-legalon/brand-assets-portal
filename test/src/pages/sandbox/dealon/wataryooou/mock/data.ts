// Activity types
export type ActivityType = "alert" | "approval" | "case" | "email";

export type Activity = {
  id: string;
  type: ActivityType;
  typeLabel: string;
  datetime: string;
  company: string;
  description: string;
};

// Sales data
export type SalesData = {
  current: { amount: number; achievementRate: number };
  forecast: { amount: number; achievementRate: number; gap: number };
};

// Alert report
export type AlertReport = {
  title: string;
  badge: { label: string; color: "danger" | "neutral" };
  count: number;
  description: string;
};

// Activity cycle
export type ActivityCycle = {
  title: string;
  badge: { label: string; color: "danger" | "neutral" };
  count: number;
  description: string;
};

// Chat action (for AI responses)
export type ChatAction = {
  label: string;
  completed: boolean;
};

// Chat message
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: ChatAction[];
};

// Mock activities data
export const activities: Activity[] = [
  {
    id: "1",
    type: "alert",
    typeLabel: "アラート",
    datetime: "2026/01/16 09:57",
    company: "【三峰商事株式会社】DealOn20...",
    description: "AIがアラートを作成しました",
  },
  {
    id: "2",
    type: "approval",
    typeLabel: "承認",
    datetime: "2026/01/16 09:15",
    company: "【DEF株式会社】DealOn契約...",
    description: "見積承認依頼があります",
  },
  {
    id: "3",
    type: "case",
    typeLabel: "案件",
    datetime: "2026/01/15 18:00",
    company: "【GHI株式会社】年間保守契約...",
    description: "ステータスが更新されました",
  },
  {
    id: "4",
    type: "email",
    typeLabel: "メール",
    datetime: "2026/01/15 17:30",
    company: "【JKL株式会社】システム導入...",
    description: "返信がありました",
  },
  {
    id: "5",
    type: "alert",
    typeLabel: "アラート",
    datetime: "2026/01/15 15:00",
    company: "【MNO株式会社】追加開発案件...",
    description: "フォローアップが必要です",
  },
  {
    id: "6",
    type: "case",
    typeLabel: "案件",
    datetime: "2026/01/15 14:00",
    company: "【PQR株式会社】新規導入検討...",
    description: "新規商談が登録されました",
  },
  {
    id: "7",
    type: "email",
    typeLabel: "メール",
    datetime: "2026/01/15 12:00",
    company: "【STU株式会社】資料送付依頼...",
    description: "資料送付完了",
  },
  {
    id: "8",
    type: "approval",
    typeLabel: "承認",
    datetime: "2026/01/14 10:00",
    company: "【VWX株式会社】契約更新案件...",
    description: "契約書承認依頼",
  },
];

// Mock sales data
export const salesData: SalesData = {
  current: {
    amount: 2000000,
    achievementRate: 20,
  },
  forecast: {
    amount: 8000000,
    achievementRate: 80,
    gap: -2000000,
  },
};

// Mock alert reports
export const alertReports: AlertReport[] = [
  {
    title: "新規商談",
    badge: { label: "対応必須", color: "danger" },
    count: 1,
    description: "本日の商談を確認し、初回対応を行ってください",
  },
  {
    title: "保有案件",
    badge: { label: "対応必須", color: "danger" },
    count: 14,
    description: "対応が必要な案件を確認し、方針を決めてください",
  },
  {
    title: "期限超過",
    badge: { label: "要確認", color: "danger" },
    count: 14,
    description: "期限超過の案件があります。優先対応してください",
  },
];

// Mock activity cycles
export const activityCycles: ActivityCycle[] = [
  {
    title: "決裁後2日未接触",
    badge: { label: "停滞", color: "neutral" },
    count: 3,
    description: "決裁後のフォローアップが必要です",
  },
  {
    title: "パイプライン停滞",
    badge: { label: "停滞", color: "neutral" },
    count: 2,
    description: "進捗のない案件を確認してください",
  },
  {
    title: "商談後24h未対応",
    badge: { label: "停滞", color: "neutral" },
    count: 0,
    description: "商談後の対応が遅れている案件はありません",
  },
];

// AI chat suggestions
export const chatSuggestions = ["売上未達分析（デモ）", "ROI試算資料を作成", "次のステップを提案"];

// Activity type colors
export const activityTypeColors: Record<ActivityType, string> = {
  alert: "var(--aegis-color-background-danger)",
  approval: "var(--aegis-color-background-warning)",
  case: "var(--aegis-color-background-neutral)",
  email: "var(--aegis-color-background-success)",
};

// Mock chat messages
export const chatMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "はい、お願いします",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "これだけだと足りないので、今月の案件から新たに500件作るとしたら、今週と来週で50件の商談が追加されればギリギリ間に合うかもしれない。\n\nあと、この進捗がモニタリングできるようにダッシュボードに設定して定期配信しますね。",
    actions: [
      { label: "50件追加するための行動量の増加目標を設定", completed: true },
      { label: "今週の追加商談件数目標を設定", completed: true },
      { label: "月初時点でパイプラインの不足に気付けるグラフを追加", completed: true },
      { label: "商談数50件に届かせるためのカウントダウン情報を追加", completed: true },
      { label: "チーム全員への定期配信を設定", completed: true },
    ],
  },
];
