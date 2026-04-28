// =============================================================================
// Types
// =============================================================================

export type DealPhase =
  | "案件流入"
  | "商談獲得"
  | "パイプライン化"
  | "正式検討"
  | "決裁進行中"
  | "決裁取得"
  | "申込書送付"
  | "受注"
  | "失注";

export type DealItem = {
  id: string;
  dealTitle: string;
  customerName: string;
  phase: DealPhase;
  alertCounts: { high: number; medium: number; low: number } | null;
  alertCategories: string[];
  dealValue: number;
  assignee: string;
  alertUpdatedAt: string;
};

// =============================================================================
// Mock Data
// =============================================================================

export const mockDeals: DealItem[] = [
  {
    id: "d01",
    dealTitle: "あおば運送 配送管理システム導入",
    customerName: "あおば運送株式会社",
    phase: "案件流入",
    alertCounts: null,
    alertCategories: [],
    dealValue: 3200000,
    assignee: "田中 太郎",
    alertUpdatedAt: "2024/12/18",
  },
  {
    id: "d02",
    dealTitle: "あさひ化工 品質管理SaaS提案",
    customerName: "あさひ化工株式会社",
    phase: "商談獲得",
    alertCounts: null,
    alertCategories: [],
    dealValue: 5400000,
    assignee: "佐藤 花子",
    alertUpdatedAt: "2024/12/17",
  },
  {
    id: "d03",
    dealTitle: "かいじ不動産 賃貸管理クラウド",
    customerName: "かいじ不動産株式会社",
    phase: "パイプライン化",
    alertCounts: null,
    alertCategories: ["時期"],
    dealValue: 8900000,
    assignee: "鈴木 一郎",
    alertUpdatedAt: "2024/12/16",
  },
  {
    id: "d04",
    dealTitle: "すみよし化学工業 ERPリプレース",
    customerName: "すみよし化学工業株式会社",
    phase: "正式検討",
    alertCounts: null,
    alertCategories: [],
    dealValue: 12000000,
    assignee: "田中 太郎",
    alertUpdatedAt: "2024/12/15",
  },
  {
    id: "d05",
    dealTitle: "三峰商事 営業支援ツール導入",
    customerName: "三峰商事株式会社",
    phase: "決裁進行中",
    alertCounts: { high: 3, medium: 1, low: 3 },
    alertCategories: ["時期", "競合", "予算"],
    dealValue: 7600000,
    assignee: "高橋 健太",
    alertUpdatedAt: "2024/12/14",
  },
  {
    id: "d06",
    dealTitle: "旭日インダストリーズ 生産管理DX",
    customerName: "旭日インダストリーズ株式会社",
    phase: "決裁取得",
    alertCounts: null,
    alertCategories: [],
    dealValue: 15000000,
    assignee: "伊藤 さくら",
    alertUpdatedAt: "2024/12/13",
  },
  {
    id: "d07",
    dealTitle: "北斗エネルギー 設備点検クラウド",
    customerName: "北斗エネルギー株式会社",
    phase: "申込書送付",
    alertCounts: null,
    alertCategories: [],
    dealValue: 4300000,
    assignee: "渡辺 大輔",
    alertUpdatedAt: "2024/12/12",
  },
  {
    id: "d08",
    dealTitle: "翠嵐ロジスティクス WMS導入",
    customerName: "翠嵐ロジスティクス株式会社",
    phase: "受注",
    alertCounts: null,
    alertCategories: [],
    dealValue: 9800000,
    assignee: "中村 翔",
    alertUpdatedAt: "2024/12/11",
  },
  {
    id: "d09",
    dealTitle: "大和テクノロジー AI解析基盤",
    customerName: "大和テクノロジー株式会社",
    phase: "失注",
    alertCounts: null,
    alertCategories: [],
    dealValue: 20000000,
    assignee: "小林 愛",
    alertUpdatedAt: "2024/12/10",
  },
  {
    id: "d10",
    dealTitle: "みなと食品 販売管理システム",
    customerName: "みなと食品株式会社",
    phase: "案件流入",
    alertCounts: null,
    alertCategories: [],
    dealValue: 2800000,
    assignee: "加藤 誠",
    alertUpdatedAt: "2024/12/09",
  },
  {
    id: "d11",
    dealTitle: "さくら建設 工程管理SaaS",
    customerName: "さくら建設株式会社",
    phase: "商談獲得",
    alertCounts: null,
    alertCategories: ["時期"],
    dealValue: 6100000,
    assignee: "吉田 恵",
    alertUpdatedAt: "2024/12/08",
  },
  {
    id: "d12",
    dealTitle: "こだま精機 製造実行システム",
    customerName: "こだま精機株式会社",
    phase: "パイプライン化",
    alertCounts: null,
    alertCategories: [],
    dealValue: 11000000,
    assignee: "松本 裕子",
    alertUpdatedAt: "2024/12/07",
  },
  {
    id: "d13",
    dealTitle: "富士見テック クラウド移行",
    customerName: "株式会社富士見テック",
    phase: "正式検討",
    alertCounts: null,
    alertCategories: [],
    dealValue: 8500000,
    assignee: "田中 太郎",
    alertUpdatedAt: "2024/12/06",
  },
  {
    id: "d14",
    dealTitle: "やまと通信 ネットワーク監視",
    customerName: "やまと通信株式会社",
    phase: "決裁進行中",
    alertCounts: null,
    alertCategories: [],
    dealValue: 4700000,
    assignee: "佐藤 花子",
    alertUpdatedAt: "2024/12/05",
  },
  {
    id: "d15",
    dealTitle: "ひかり電子 IoTプラットフォーム",
    customerName: "ひかり電子株式会社",
    phase: "案件流入",
    alertCounts: null,
    alertCategories: [],
    dealValue: 13500000,
    assignee: "鈴木 一郎",
    alertUpdatedAt: "2024/12/04",
  },
  {
    id: "d16",
    dealTitle: "あけぼの薬品 在庫管理DX",
    customerName: "あけぼの薬品株式会社",
    phase: "商談獲得",
    alertCounts: null,
    alertCategories: [],
    dealValue: 5900000,
    assignee: "高橋 健太",
    alertUpdatedAt: "2024/12/03",
  },
  {
    id: "d17",
    dealTitle: "むさし重工 保全管理システム",
    customerName: "むさし重工株式会社",
    phase: "パイプライン化",
    alertCounts: null,
    alertCategories: ["競合"],
    dealValue: 18000000,
    assignee: "伊藤 さくら",
    alertUpdatedAt: "2024/12/02",
  },
  {
    id: "d18",
    dealTitle: "つばさ航空 予約システム刷新",
    customerName: "つばさ航空株式会社",
    phase: "受注",
    alertCounts: null,
    alertCategories: [],
    dealValue: 25000000,
    assignee: "渡辺 大輔",
    alertUpdatedAt: "2024/12/01",
  },
];
