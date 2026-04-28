// =============================================================================
// Activity Mock Data (adapted from lib/dealon-app/design timeline-activities)
// =============================================================================

export type Activity = {
  id: string;
  category: string;
  categoryColor: "neutral" | "red" | "blue" | "teal" | "yellow" | "orange";
  timestamp: string;
  dealName: string;
  description: string;
};

export const mockActivities: Activity[] = [
  {
    id: "a1",
    category: "メール",
    categoryColor: "blue",
    timestamp: "5分前",
    dealName: "旭日インダストリーズ株式会社",
    description: "鈴木一郎さんからのメールを受信しました",
  },
  {
    id: "a2",
    category: "議事録",
    categoryColor: "neutral",
    timestamp: "10分前",
    dealName: "北斗エネルギー株式会社",
    description: "Selaが議事録を作成しました",
  },
  {
    id: "a3",
    category: "メール",
    categoryColor: "blue",
    timestamp: "15分前",
    dealName: "旭日インダストリーズ株式会社",
    description: "Selaがメールを返信しました",
  },
  {
    id: "a4",
    category: "アラート",
    categoryColor: "red",
    timestamp: "20分前",
    dealName: "三峰興業株式会社",
    description: "Selaがアラートを作成しました",
  },
  {
    id: "a5",
    category: "アラート",
    categoryColor: "red",
    timestamp: "25分前",
    dealName: "三峰興業株式会社",
    description: "Selaがアラート対策方針を作成しました",
  },
  {
    id: "a6",
    category: "案件",
    categoryColor: "teal",
    timestamp: "30分前",
    dealName: "新規企業株式会社",
    description: "Selaが案件を作成しました",
  },
  {
    id: "a7",
    category: "案件",
    categoryColor: "teal",
    timestamp: "35分前",
    dealName: "三峰興業株式会社",
    description: "Selaが案件フェーズを更新しました",
  },
  {
    id: "a8",
    category: "タスク",
    categoryColor: "neutral",
    timestamp: "40分前",
    dealName: "大和テクノロジー株式会社",
    description: "Selaがタスクを作成しました",
  },
  {
    id: "a9",
    category: "承認",
    categoryColor: "teal",
    timestamp: "45分前",
    dealName: "北斗エネルギー株式会社",
    description: "田中 真央さんが議事録を更新しました",
  },
  {
    id: "a10",
    category: "ミーティング",
    categoryColor: "blue",
    timestamp: "50分前",
    dealName: "翠嵐ロジスティクス株式会社",
    description: "山本 理沙さんがミーティングを作成しました",
  },
  {
    id: "a11",
    category: "Sela実行",
    categoryColor: "yellow",
    timestamp: "3時間前",
    dealName: "株式会社イノベート",
    description: "優先度スコア更新 - スコア0.85に上昇",
  },
  {
    id: "a12",
    category: "Sela実行",
    categoryColor: "yellow",
    timestamp: "4時間前",
    dealName: "エンタープライズ株式会社",
    description: "Healthスコア急降下を検知 - スコア70→45に低下",
  },
];
