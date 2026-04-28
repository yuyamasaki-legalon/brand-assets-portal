export interface WalkthroughStep {
  nodeId: string;
  edgeId?: string;
  title: string;
  description?: string;
  autoAdvanceMs?: number;
}

export interface WalkthroughScenario {
  name: string;
  description?: string;
  steps: WalkthroughStep[];
}

export const walkthroughScenarios: WalkthroughScenario[] = [
  {
    name: "契約レビューフロー",
    description: "案件登録からレビュー完了までの基本的なフロー",
    steps: [
      {
        nodeId: "dashboard",
        title: "ダッシュボード",
        description: "案件管理メニューから案件一覧へ遷移します。",
        autoAdvanceMs: 3000,
      },
      {
        nodeId: "case-list",
        edgeId: "e-dashboard-caselist",
        title: "案件一覧",
        description: "登録済みの案件を確認し、対象案件の行をクリックします。",
        autoAdvanceMs: 3000,
      },
      {
        nodeId: "case-detail",
        edgeId: "e-caselist-casedetail",
        title: "案件詳細",
        description: "案件の詳細情報を確認し、レビューを開始します。",
        autoAdvanceMs: 3000,
      },
      {
        nodeId: "review",
        edgeId: "e-casedetail-review",
        title: "レビュー",
        description: "AI がリスク分析・法令遵守チェックを実行します。",
      },
    ],
  },
  {
    name: "電子契約フロー",
    description: "契約書のアップロードから電子署名までのフロー",
    steps: [
      {
        nodeId: "dashboard",
        title: "ダッシュボード",
        description: "契約書管理メニューから契約書一覧へ遷移します。",
        autoAdvanceMs: 3000,
      },
      {
        nodeId: "contract-list",
        edgeId: "e-dashboard-contractlist",
        title: "契約書管理",
        description: "契約書の一覧から対象のファイルを選択します。",
        autoAdvanceMs: 3000,
      },
      {
        nodeId: "file-detail",
        edgeId: "e-contractlist-filedetail",
        title: "ファイル詳細",
        description: "ファイルの内容を確認し、電子契約へ進みます。",
        autoAdvanceMs: 3000,
      },
      {
        nodeId: "esign",
        edgeId: "e-filedetail-esign",
        title: "電子契約",
        description: "署名者の設定と電子署名を実行します。",
      },
    ],
  },
  {
    name: "ナレッジ活用フロー",
    description: "検索・ひな形・審査基準の参照フロー",
    steps: [
      {
        nodeId: "dashboard",
        title: "ダッシュボード",
        description: "検索メニューから全文検索画面へ遷移します。",
        autoAdvanceMs: 3000,
      },
      {
        nodeId: "search",
        edgeId: "e-dashboard-search",
        title: "検索",
        description: "条文や条項のキーワード検索を実行します。",
        autoAdvanceMs: 3000,
      },
      {
        nodeId: "templates",
        title: "ひな形",
        description: "ひな形一覧から参考テンプレートを選択します。",
        autoAdvanceMs: 3000,
      },
      {
        nodeId: "review-console",
        edgeId: "e-templates-reviewconsole",
        title: "審査基準",
        description: "レビュールールの確認と編集を行います。",
      },
    ],
  },
];
