// @legalforce/aegis-reactからインポートするコンポーネントやアイコン、
// rechartsからインポートするコンポーネントなどをここに記述します。

// --- Color Palettes ---
export const categoricalPalette = ["#5a91cd", "#067057", "#a8aad3", "#a67cbf", "#a53a64", "#ea9766", "#bb7e00"];

// --- Mock Data for Analytics Dashboard ---

// B. 担当者別 負荷状況のデータ
export const assigneeStatusData = [
  { name: "佐藤 一郎", 未着手: 3, 確認中: 5, "2次確認中": 2, 自部門外確認中: 1, stagnation: 2 },
  { name: "鈴木 次郎", 未着手: 1, 確認中: 4, "2次確認中": 3, 自部門外確認中: 2, stagnation: 1 },
  { name: "高橋 三郎", 未着手: 5, 確認中: 2, "2次確認中": 1, 自部門外確認中: 0, stagnation: 3 },
  { name: "田中 四郎", 未着手: 2, 確認中: 6, "2次確認中": 4, 自部門外確認中: 3, stagnation: 0 },
  { name: "伊藤 五郎", 未着手: 0, 確認中: 3, "2次確認中": 2, 自部門外確認中: 5, stagnation: 1 },
  { name: "渡辺 六郎", 未着手: 4, 確認中: 1, "2次確認中": 0, 自部門外確認中: 2, stagnation: 0 },
  { name: "山本 七郎", 未着手: 2, 確認中: 2, "2次確認中": 2, 自部門外確認中: 2, stagnation: 0 },
];

// 案件ステータスの定義と色
export const caseStatuses = {
  未着手: "#acacac", // neutral-400
  確認中: "#5a91cd", // blue-500
  "2次確認中": "#4e5eac", // indigo-600
  自部門外確認中: "#5c3576", // purple-700
};

export const caseStatusOrder = ["未着手", "確認中", "2次確認中", "自部門外確認中"];

// B-2. 部署別 負荷状況のデータ
export const departmentStatusData = [
  { name: "法務部", 未着手: 10, 確認中: 15, "2次確認中": 8, 自部門外確認中: 5 },
  { name: "営業部", 未着手: 5, 確認中: 10, "2次確認中": 5, 自部門外確認中: 3 },
  { name: "開発部", 未着手: 2, 確認中: 5, "2次確認中": 3, 自部門外確認中: 1 },
  { name: "マーケティング部", 未着手: 3, 確認中: 2, "2次確認中": 1, 自部門外確認中: 0 },
  { name: "人事部", 未着手: 1, 確認中: 1, "2次確認中": 0, 自部門外確認中: 0 },
];

// C. 案件内訳のデータ
export const caseBreakdownData = {
  contractType: [
    { name: "業務委託契約書", value: 120 },
    { name: "秘密保持契約書", value: 98 },
    { name: "売買契約書", value: 75 },
    { name: "賃貸借契約書", value: 60 },
    { name: "コンサルティング契約書", value: 30 },
    { name: "システム開発契約書", value: 25 },
    { name: "ライセンス契約書", value: 15 },
  ],
  department: [
    { name: "営業部", value: 150 },
    { name: "開発部", value: 110 },
    { name: "マーケティング部", value: 80 },
    { name: "人事部", value: 75 },
    { name: "経理部", value: 50 },
    { name: "広報部", value: 20 },
  ],
  caseType: [
    { name: "契約審査", value: 320 },
    { name: "法律相談", value: 150 },
    { name: "調査", value: 40 },
    { name: "文書作成", value: 30 },
    { name: "その他", value: 15 },
  ],
};

// D. 推移分析のデータ
export const trendData = [
  {
    month: "6月",
    法務部: 20,
    営業部: 30,
    開発部: 15,
    マーケティング部: 10,
    人事部: 5,
    平均リードタイム: 5.2,
    lastYearCount: 75,
    lastYearAvgLeadTime: 6.1,
  },
  {
    month: "7月",
    法務部: 25,
    営業部: 35,
    開発部: 18,
    マーケティング部: 12,
    人事部: 8,
    平均リードタイム: 5.8,
    lastYearCount: 85,
    lastYearAvgLeadTime: 6.5,
  },
  {
    month: "8月",
    法務部: 30,
    営業部: 40,
    開発部: 22,
    マーケティング部: 15,
    人事部: 10,
    平均リードタイム: 6.1,
    lastYearCount: 95,
    lastYearAvgLeadTime: 7.2,
  },
  {
    month: "9月",
    法務部: 28,
    営業部: 38,
    開発部: 20,
    マーケティング部: 14,
    人事部: 9,
    平均リードタイム: 5.9,
    lastYearCount: 92,
    lastYearAvgLeadTime: 7.0,
  },
  {
    month: "10月",
    法務部: 35,
    営業部: 45,
    開発部: 25,
    マーケティング部: 18,
    人事部: 12,
    平均リードタイム: 6.5,
    lastYearCount: 110,
    lastYearAvgLeadTime: 7.8,
  },
  {
    month: "11月",
    法務部: 40,
    営業部: 50,
    開発部: 28,
    マーケティング部: 20,
    人事部: 15,
    平均リードタイム: 6.8,
    lastYearCount: 125,
    lastYearAvgLeadTime: 8.1,
  },
];

export const departmentColors = {
  法務部: "#0367a8", // blue-600
  営業部: "#2a9e7e", // teal-500
  開発部: "#344281", // indigo-700
  マーケティング部: "#a67cbf", // purple-500
  人事部: "#a53a64", // magenta-600
};

export type MatrixRow = {
  name: string;
  [key: string]: string | number;
};
export const matrixData: {
  stagnation: MatrixRow[];
  dueDate: MatrixRow[];
} = {
  stagnation: [
    { name: "佐藤 花子", "0-3日": 5, "4-7日": 8, "8-14日": 3, "15日以上": 3, total: 19 },
    { name: "山田 太郎", "0-3日": 8, "4-7日": 6, "8-14日": 4, "15日以上": 1, total: 19 },
    { name: "鈴木 一郎", "0-3日": 12, "4-7日": 10, "8-14日": 5, "15-30日": 0, "31日以上": 0, total: 27 },
    { name: "田中 次郎", "0-3日": 4, "4-7日": 5, "8-14日": 2, "15-30日": 3, "31日以上": 2, total: 16 },
    { name: "吉田 四郎", "0-3日": 7, "4-7日": 7, "8-14日": 0, "15日以上": 0, total: 14 },
    { name: "加藤 三郎", "0-3日": 6, "4-7日": 4, "8-14日": 1, "15日以上": 1, total: 12 },
  ],
  dueDate: [
    { name: "佐藤 花子", 納期超過: 1, "今日-3日後": 3, "4-7日後": 5, "8-14日後": 10, "15日後以降": 0, total: 19 },
    { name: "山田 太郎", 納期超過: 0, "今日-3日後": 8, "4-7日後": 6, "8-14日後": 4, "15日後以降": 1, total: 19 },
    { name: "鈴木 一郎", 納期超過: 0, "今日-3日後": 12, "4-7日後": 10, "8-14日後": 5, "15日後以降": 0, total: 27 },
    { name: "田中 次郎", 納期超過: 2, "今日-3日後": 4, "4-7日後": 5, "8-14日後": 2, "15日後以降": 3, total: 16 },
    { name: "吉田 四郎", 納期超過: 0, "今日-3日後": 7, "4-7日後": 7, "8-14日後": 0, "15日後以降": 0, total: 14 },
    { name: "加藤 三郎", 納期超過: 1, "今日-3日後": 6, "4-7日後": 4, "8-14日後": 1, "15日後以降": 0, total: 12 },
  ],
};

// E. 契約類型別 バージョン数分析データ
export const contractVersionData = [
  { type: "業務委託契約書", count: 25, avgVersions: 3.2, maxVersions: 8 },
  { type: "秘密保持契約書", avgVersions: 1.5, maxVersions: 3, count: 98 },
  { type: "売買契約書", avgVersions: 2.8, maxVersions: 6, count: 75 },
  { type: "賃貸借契約書", avgVersions: 3.1, maxVersions: 8, count: 30 },
  { type: "コンサルティング契約書", avgVersions: 5.5, maxVersions: 15, count: 15 },
  { type: "システム開発契約書", avgVersions: 6.2, maxVersions: 20, count: 25 },
  { type: "ライセンス契約書", avgVersions: 3.5, maxVersions: 7, count: 15 },
  { type: "その他", avgVersions: 1.0, maxVersions: 1, count: 10 },
];

// F. 契約類型別 パレート分析データ
export const contractParetoData = [
  { type: "業務委託契約書", count: 120 },
  { type: "秘密保持契約書", count: 98 },
  { type: "売買契約書", count: 75 },
  { type: "賃貸借契約書", count: 30 },
  { type: "コンサルティング契約書", count: 15 },
  { type: "システム開発契約書", count: 25 },
  { type: "ライセンス契約書", count: 15 },
  { type: "その他", count: 10 },
];

// G. 担当者別リードタイム分布データ (テーブル・箱ひげ図兼用)
export const leadTimeDistributionData = [
  {
    name: "佐藤 花子",
    completedCases: 50,
    avgLeadTime: 5.8,
    medianLeadTime: 5,
    minLeadTime: 1,
    maxLeadTime: 18,
    iqr: 5,
    boxPlot: [1, 3, 5, 8, 12],
    outliers: [15, 18],
  },
  {
    name: "山田 太郎",
    completedCases: 45,
    avgLeadTime: 6.1,
    medianLeadTime: 6,
    minLeadTime: 2,
    maxLeadTime: 13,
    iqr: 5,
    boxPlot: [2, 4, 6, 9, 13],
    outliers: [],
  },
  {
    name: "鈴木 一郎",
    completedCases: 60,
    avgLeadTime: 3.5,
    medianLeadTime: 4,
    minLeadTime: 1,
    maxLeadTime: 10,
    iqr: 3,
    boxPlot: [1, 2, 4, 5, 7],
    outliers: [10],
  },
  {
    name: "田中 次郎",
    completedCases: 30,
    avgLeadTime: 7.2,
    medianLeadTime: 7,
    minLeadTime: 3,
    maxLeadTime: 15,
    iqr: 5,
    boxPlot: [3, 5, 7, 10, 15],
    outliers: [],
  },
  {
    name: "吉田 四郎",
    completedCases: 35,
    avgLeadTime: 6.5,
    medianLeadTime: 8,
    minLeadTime: 2,
    maxLeadTime: 16,
    iqr: 3,
    boxPlot: [2, 6, 8, 9, 11],
    outliers: [16],
  },
  {
    name: "加藤 三郎",
    completedCases: 48,
    avgLeadTime: 4.1,
    medianLeadTime: 4,
    minLeadTime: 1,
    maxLeadTime: 9,
    iqr: 3,
    boxPlot: [1, 3, 4, 6, 9],
    outliers: [],
  },
];

// G-2. 依頼時期別リードタイム分布データ
export const leadTimeByMonthData = [
  {
    month: "7月",
    completedCases: 40,
    avgLeadTime: 4.5,
    medianLeadTime: 4,
    minLeadTime: 1,
    maxLeadTime: 15,
    iqr: 4,
    boxPlot: [2, 3, 4, 6, 10],
    outliers: [15],
  },
  {
    month: "8月",
    completedCases: 50,
    avgLeadTime: 5.1,
    medianLeadTime: 5,
    minLeadTime: 1,
    maxLeadTime: 18,
    iqr: 5,
    boxPlot: [2, 4, 5, 7, 12],
    outliers: [18],
  },
  {
    month: "9月",
    completedCases: 58,
    avgLeadTime: 4.9,
    medianLeadTime: 5,
    minLeadTime: 2,
    maxLeadTime: 16,
    iqr: 3,
    boxPlot: [3, 4, 5, 6, 11],
    outliers: [16],
  },
  {
    month: "10月",
    completedCases: 65,
    avgLeadTime: 3.8,
    medianLeadTime: 3,
    minLeadTime: 1,
    maxLeadTime: 12,
    iqr: 3,
    boxPlot: [1, 2, 3, 4, 8],
    outliers: [12],
  },
  {
    month: "11月",
    completedCases: 72,
    avgLeadTime: 3.2,
    medianLeadTime: 3,
    minLeadTime: 1,
    maxLeadTime: 10,
    iqr: 2,
    boxPlot: [1, 2, 3, 3, 7],
    outliers: [10],
  },
  {
    month: "12月",
    completedCases: 75,
    avgLeadTime: 2.9,
    medianLeadTime: 2,
    minLeadTime: 1,
    maxLeadTime: 9,
    iqr: 2,
    boxPlot: [1, 2, 2, 3, 6],
    outliers: [9],
  },
];

// G-3. 依頼部署別リードタイム分布データ
export const leadTimeByDepartmentData = [
  {
    departmentName: "営業部",
    completedCases: 150,
    avgLeadTime: 5.5,
    medianLeadTime: 5,
    minLeadTime: 1,
    maxLeadTime: 18,
    iqr: 4,
    boxPlot: [2, 4, 5, 6, 12],
    outliers: [18],
  },
  {
    departmentName: "開発部",
    completedCases: 110,
    avgLeadTime: 3.2,
    medianLeadTime: 3,
    minLeadTime: 1,
    maxLeadTime: 10,
    iqr: 2,
    boxPlot: [1, 2, 3, 3, 7],
    outliers: [10],
  },
  {
    departmentName: "マーケティング部",
    completedCases: 80,
    avgLeadTime: 4.8,
    medianLeadTime: 4,
    minLeadTime: 2,
    maxLeadTime: 15,
    iqr: 3,
    boxPlot: [3, 4, 4, 6, 11],
    outliers: [15],
  },
  {
    departmentName: "人事部",
    completedCases: 75,
    avgLeadTime: 6.1,
    medianLeadTime: 6,
    minLeadTime: 2,
    maxLeadTime: 16,
    iqr: 5,
    boxPlot: [3, 5, 6, 8, 13],
    outliers: [16],
  },
  {
    departmentName: "経理部",
    completedCases: 50,
    avgLeadTime: 7.0,
    medianLeadTime: 7,
    minLeadTime: 3,
    maxLeadTime: 14,
    iqr: 4,
    boxPlot: [4, 6, 7, 8, 12],
    outliers: [14],
  },
];

// I. 契約類型別ひな形利用率データ
export const templateUsageData = [
  { type: "業務委託契約書", self: 65, other: 35 },
  { type: "秘密保持契約書", self: 80, other: 20 },
  { type: "売買契約書", self: 40, other: 60 },
  { type: "賃貸借契約書", self: 10, other: 90 },
  { type: "コンサルティング", self: 55, other: 45 },
  { type: "システム開発契約", self: 30, other: 70 },
  { type: "ライセンス契約書", self: 70, other: 30 },
];

export const contractTypeColors = {
  NDA: "#d86c28", // orange-500
  業務委託契約書: "#845800", // yellow-600
  基本契約書: "#859238", // lime-500
  コンサルティング契約書: "#07503e", // teal-700
  システム開発契約書: "#93afd6", // blue-400
  ライセンス契約書: "#8188ca", // indigo-500
  その他: "#acacac", // neutral-400
};

export const assigneeContractTypeData = [
  {
    name: "佐藤 一郎",
    NDA: 8,
    業務委託契約書: 5,
    基本契約書: 4,
    コンサルティング契約書: 2,
    システム開発契約書: 1,
    その他: 1,
  },
  { name: "鈴木 次郎", NDA: 3, 業務委託契約書: 7, 基本契約書: 6, ライセンス契約書: 4, その他: 2 },
  { name: "高橋 三郎", NDA: 10, 業務委託契約書: 2, 基本契約書: 3, その他: 0 },
  {
    name: "田中 四郎",
    NDA: 1,
    業務委託契約書: 1,
    基本契約書: 8,
    コンサルティング契約書: 5,
    システム開発契約書: 3,
    その他: 1,
  },
  { name: "伊藤 五郎", NDA: 5, 業務委託契約書: 9, ライセンス契約書: 2, その他: 3 },
  {
    name: "渡辺 六郎",
    NDA: 2,
    業務委託契約書: 3,
    基本契約書: 2,
    コンサルティング契約書: 6,
    システム開発契約書: 5,
    ライセンス契約書: 1,
    その他: 0,
  },
  { name: "山本 七郎", NDA: 6, 基本契約書: 7, システム開発契約書: 2, その他: 4 },
];

// J. 電子契約 署名待ち状況データ
export const eSignatureStatusData = [
  { name: "0-3日", value: 15, color: "#2a9e7e" }, // teal-500
  { name: "4-7日", value: 12, color: "#bb7e00" }, // yellow-500
  { name: "8-13日", value: 8, color: "#9e470e" }, // orange-600
  { name: "14日以上", value: 5, color: "#ae352a" }, // red-600
];

export const slaStatus = {
  over: { label: "SLA超過", color: "#f8ebe8" }, // red-100
  today: { label: "SLA当日", color: "#f7ebe5" }, // orange-100
  near: { label: "SLA間近", color: "#f4ede4" }, // yellow-100
  normal: { label: "通常", color: "transparent" },
};

export type Task = {
  id: number;
  name: string;
  client: string;
  type: string;
  receivedDate: string;
  dueDate: string;
  assignee: string;
};

export const myTasksData: Task[] = [
  // 佐藤 一郎
  {
    id: 1,
    name: "ABC社 AI利用規約改定",
    client: "営業部",
    type: "利用規約",
    receivedDate: "2025-11-25", // 6 days ago
    dueDate: "2025-12-02",
    assignee: "佐藤 一郎",
  },
  {
    id: 2,
    name: "XYZ社 秘密保持契約書",
    client: "事業開発部",
    type: "NDA",
    receivedDate: "2025-11-28", // 3 days ago
    dueDate: "2025-12-05",
    assignee: "佐藤 一郎",
  },
  // 鈴木 次郎
  {
    id: 3,
    name: "MNO社 業務委託契約書",
    client: "人事部",
    type: "業務委託",
    receivedDate: "2025-11-26", // 5 days ago
    dueDate: "2025-12-03",
    assignee: "鈴木 次郎",
  },
  {
    id: 4,
    name: "PQR社 基本契約書",
    client: "営業部",
    type: "基本契約書",
    receivedDate: "2025-12-01", // 0 days ago
    dueDate: "2025-12-08",
    assignee: "鈴木 次郎",
  },
  // 高橋 三郎
  {
    id: 5,
    name: "DEF社 サービス利用規約",
    client: "プロダクト部",
    type: "利用規約",
    receivedDate: "2025-11-27", // 4 days ago
    dueDate: "2025-12-04",
    assignee: "高橋 三郎",
  },
];
