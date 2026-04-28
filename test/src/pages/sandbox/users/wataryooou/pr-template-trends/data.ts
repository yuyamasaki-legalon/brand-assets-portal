// PR Template Usage Trend Analysis Data (All PRs: #1 - #219)

export type OverviewCategory = {
  category: string;
  count: number;
  percentage: number;
};

export const overviewData: OverviewCategory[] = [
  { category: "Sandbox 関連 PR", count: 174, percentage: 79.5 },
  { category: "非 Sandbox（CI, deps, docs, template, infra）", count: 34, percentage: 15.5 },
  { category: "N/A（空PR, dot commit, テスト）", count: 11, percentage: 5.0 },
];

export type PrStatus = {
  status: string;
  count: number;
  percentage: number;
  color: "information" | "danger" | "disabled";
};

export const prStatusData: PrStatus[] = [
  { status: "Merged", count: 61, percentage: 27.9, color: "information" },
  { status: "Open", count: 67, percentage: 30.6, color: "disabled" },
  { status: "Closed (not merged)", count: 91, percentage: 41.5, color: "danger" },
];

export type TemplateRanking = {
  rank: number;
  template: string;
  count: number;
  percentage: number;
  representativePRs: string;
};

export const templateRankingData: TemplateRanking[] = [
  {
    rank: 1,
    template: "list-layout / 契約書一覧系",
    count: 40,
    percentage: 23.0,
    representativePRs: "#215, #201, #186, #144, #137, #92, #78, #48",
  },
  {
    rank: 2,
    template: "loc/case/detail（案件詳細）",
    count: 25,
    percentage: 14.4,
    representativePRs: "#200, #193, #185, #148, #132, #31, #22",
  },
  {
    rank: 3,
    template: "Custom / テンプレートなし",
    count: 20,
    percentage: 11.5,
    representativePRs: "#191, #157, #131, #123, #45, #15",
  },
  {
    rank: 4,
    template: "User sandbox setup（環境構築）",
    count: 13,
    percentage: 7.5,
    representativePRs: "#110, #95, #72, #55, #38",
  },
  {
    rank: 5,
    template: "Analytics / Dashboard",
    count: 12,
    percentage: 6.9,
    representativePRs: "#217, #209, #8, #5, #3",
  },
  {
    rank: 6,
    template: "workon templates（WorkOn系）",
    count: 12,
    percentage: 6.9,
    representativePRs: "#213, #203, #202, #143",
  },
  {
    rank: 7,
    template: "loc/file-management（ファイル管理）",
    count: 11,
    percentage: 6.3,
    representativePRs: "#195, #166, #153, #138",
  },
  {
    rank: 8,
    template: "loc/loa（LegalOn Assistant / AI Chat）",
    count: 9,
    percentage: 5.2,
    representativePRs: "#214, #161, #156, #139, #45",
  },
  {
    rank: 9,
    template: "settings-layout（設定画面）",
    count: 8,
    percentage: 4.6,
    representativePRs: "#206, #173, #130, #129",
  },
  {
    rank: 10,
    template: "form-layout（フォーム）",
    count: 6,
    percentage: 3.4,
    representativePRs: "#210, #152, #122",
  },
  {
    rank: 11,
    template: "loc/review（契約レビュー）",
    count: 6,
    percentage: 3.4,
    representativePRs: "#189, #178, #176",
  },
  {
    rank: 12,
    template: "loc/legalon-template（ひな形）",
    count: 5,
    percentage: 2.9,
    representativePRs: "#216, #174",
  },
  { rank: 13, template: "loc/esign（電子署名）", count: 2, percentage: 1.1, representativePRs: "#196, #168" },
  { rank: 14, template: "detail-layout（汎用詳細）", count: 2, percentage: 1.1, representativePRs: "#177, #175" },
];

export type ServiceDistribution = {
  service: string;
  count: number;
  percentage: number;
};

export const serviceDistributionData: ServiceDistribution[] = [
  { service: "LegalOn", count: 120, percentage: 69.0 },
  { service: "汎用 / クロスサービス", count: 30, percentage: 17.2 },
  { service: "WorkOn", count: 12, percentage: 6.9 },
  { service: "Custom / ツール系", count: 12, percentage: 6.9 },
  { service: "DealOn", count: 0, percentage: 0 },
];

export type Insight = {
  id: number;
  title: string;
  description: string;
  type: "highlight" | "warning" | "info";
};

export const insightsData: Insight[] = [
  {
    id: 1,
    title: "契約書一覧・案件リンクが全PR史上最大の機能",
    description:
      "40+件、#48〜#207にまたがる。list-layoutが最頻テンプレートに躍進。複数ユーザーが並行してプロトタイプを作成した最大の反復領域。",
    type: "highlight",
  },
  {
    id: 2,
    title: "案件詳細は2位に後退",
    description:
      "全体では25件。#120以前にもドラッグ/並替え系の案件詳細PR(#22-#31)が大量にあり、合計では依然として主要テンプレート。",
    type: "highlight",
  },
  {
    id: 3,
    title: "Closed率41.5%が目立つ",
    description:
      "91件がマージされず閉じられた。特にcase-link系で大量の試行錯誤が行われており、プロトタイピングの実験的性質を反映。",
    type: "warning",
  },
  {
    id: 4,
    title: 'Phase 2 (#21-#100) が"案件リンク爆発期"',
    description: "全sandboxPRの約37%がこの期間に集中。契約書一覧と案件リンク機能の大量反復が特徴的なフェーズ。",
    type: "info",
  },
  {
    id: 5,
    title: "テンプレートなしが11.5%",
    description:
      "カスタムUI実験は全期間を通じて一定数存在。コンプライアンス研修ツール、Git Dashboard等、既存テンプレートでカバーできない新パターン。",
    type: "warning",
  },
  {
    id: 6,
    title: "LOA/AI Chatが時系列で成長",
    description:
      "#45(初期チャットUI)→#214(契約管理エージェント)へ高度化。AIファーストなインタラクションパターンが進化。",
    type: "info",
  },
  {
    id: 7,
    title: "DealOnのSandbox活動はゼロ",
    description:
      "全219件で1件もなし。テンプレートは存在するが、安定フェーズか別のプロトタイピングフローを使用している可能性。",
    type: "warning",
  },
  {
    id: 8,
    title: "設定画面のテンプレート準拠率が最高",
    description: "settings-layout採用が最も成功している領域。NavListサイドバーパターンへの準拠率が高い。",
    type: "highlight",
  },
  {
    id: 9,
    title: "User sandbox環境構築は#38-#110に集中",
    description: "チーム安定後は新規sandbox作成が減少。初期のオンボーディング期に集中的に環境構築PRが作られた。",
    type: "info",
  },
  {
    id: 10,
    title: "CI/CDは3波で成熟",
    description:
      "#4-#12(初期構築), #121-#128(標準化), #154-#205(通知/検出)。インフラの段階的な成熟がプロジェクト全体の品質向上を支えた。",
    type: "info",
  },
];

export type TimelinePhase = {
  phase: string;
  prRange: string;
  sandboxCount: number;
  infraCount: number;
  topFeature: string;
  theme: string;
};

export const timelineData: TimelinePhase[] = [
  {
    phase: "Phase 1: Foundation",
    prRange: "#1-#20",
    sandboxCount: 15,
    infraCount: 5,
    topFeature: "分析ページ, 案件詳細",
    theme: "インフラ構築, 初期実験",
  },
  {
    phase: "Phase 2: Case-Link Explosion",
    prRange: "#21-#100",
    sandboxCount: 65,
    infraCount: 5,
    topFeature: "契約書一覧 案件リンク (40+件)",
    theme: "単一機能の大量反復",
  },
  {
    phase: "Phase 3: Diversification",
    prRange: "#101-#160",
    sandboxCount: 40,
    infraCount: 15,
    topFeature: "多様化 (eSign, LOA, Settings)",
    theme: "機能の幅拡大, CI成熟",
  },
  {
    phase: "Phase 4: Maturity",
    prRange: "#161-#219",
    sandboxCount: 40,
    infraCount: 10,
    topFeature: "AIエージェント, ツーリング",
    theme: "品質重視, 自動化",
  },
];

export type IterationHotspot = {
  feature: string;
  prCount: number;
  prRange: string;
  note: string;
};

export const iterationHotspots: IterationHotspot[] = [
  {
    feature: "契約書一覧 案件リンク有無",
    prCount: 40,
    prRange: "#48-#207",
    note: "全PR中最大の反復。複数ユーザー並行",
  },
  {
    feature: "案件詳細 ドラッグ/並替え",
    prCount: 8,
    prRange: "#22-#31",
    note: "同一機能で重複PR多数",
  },
  {
    feature: "案件詳細 メッセージ公開設定",
    prCount: 6,
    prRange: "#132-#148",
    note: "同一機能の反復",
  },
  {
    feature: "右ペインリサイズ",
    prCount: 3,
    prRange: "#175-#178",
    note: "detail-layout 派生",
  },
  {
    feature: "自社情報設定",
    prCount: 2,
    prRange: "#129-#130",
    note: "settings-layout",
  },
];

export const unusedTemplates = [
  "fill-layout",
  "ChatTemplate（単体）",
  "dialog（単体）",
  "pagelayout",
  "states",
  "DealOn: deal-list",
  "DealOn: deal-detail",
  "DealOn: settings-users",
  "DealOn: settings-profile",
  "LOC: management-console",
  "LOC: personal-setting",
  "LOC: application-console",
  "LOC: word-addin",
];
