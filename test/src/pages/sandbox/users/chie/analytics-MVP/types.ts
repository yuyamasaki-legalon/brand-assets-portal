import chartPalette from "./ChartParette.json";

export type CaseData = {
  id: number; // caseIdをidとして扱う
  caseId: number;
  caseName: string;
  assignee: string;
  updatedAt?: string;
  // 「完了」はサービス本体ではステータスとして存在する前提
  status: "未着手" | "確認中" | "2次確認中" | "自部門外確認中" | "完了";
  caseType: "契約書審査" | "契約書起案" | "法務相談" | "その他";
  dueDate: string;
  startDate: string;
  firstReplyDate?: string;
  contractCategory?: string;
  completionDate?: string;
  requester: string;
  requestingDepartment: string;
  subAssignee?: string;
  templateName?: string | null;
  eContractStatus?: "未署名" | "署名中" | "署名済み";
  storageStatus?: "保管済み" | "未保管";
  statusHistory?: {
    status: "未着手" | "確認中" | "2次確認中" | "自部門外確認中" | "完了";
    startDate: string;
    endDate: string | null;
  }[];
};

export type CaseType = "契約書審査" | "契約書起案" | "法務相談" | "その他";

export type DueDateFilter =
  | "すべて"
  | "納期超過"
  | "今日まで"
  | "今日含め3日以内"
  | "今日含め7日以内"
  | "1週間後〜"
  | "納期未入力"
  | "納期内完了";

export type AssigneeFilterMode = "main" | "sub" | "both";

export const INITIAL_LEAD_TIME_CATEGORIES = {
  MAIN: {
    IDLE: ["未着手"],
    WORK: ["確認中"],
    WAIT: ["2次確認中", "自部門外確認中"],
    IGNORE: [] as string[],
  },
  SUB: {
    WORK: ["2次確認中"],
    WAIT: ["未着手", "確認中", "自部門外確認中"],
    IGNORE: [] as string[],
  },
} as const;

export type LeadTimeCategories = typeof INITIAL_LEAD_TIME_CATEGORIES;

export type LeadTimeCompositionData = {
  name: string;
  // 既存のグルーピング済みフィールド
  main_idle: number;
  main_work: number;
  main_wait: number;
  sub_work: number;
  sub_wait: number;
  // 新規追加：ステータス別フィールド
  main_未着手?: number;
  main_確認中?: number;
  main_2次確認中?: number;
  main_自部門外確認中?: number;
  sub_未着手?: number;
  sub_確認中?: number;
  sub_2次確認中?: number;
  sub_自部門外確認中?: number;
  main_count: number;
  sub_count: number;
  medianFirstReplyTime: number;
};

export type MemberPerformanceData = {
  name: string;
  onTimeCompletionCount: number;
  overdueCompletionCount: number;
  noDueDateCompletionCount: number;
  medianFirstReplyTime: number;
  // leadTimeAssigneeFilterMode === "both"の時に使用
  onTimeCompletionCount_main?: number;
  overdueCompletionCount_main?: number;
  noDueDateCompletionCount_main?: number;
  onTimeCompletionCount_sub?: number;
  overdueCompletionCount_sub?: number;
  noDueDateCompletionCount_sub?: number;
};

export type MemberPerformanceByCaseTypeData = {
  name: string;
  medianFirstReplyTime: number;
  // performanceOverviewAssigneeFilterMode === "both"の時に使用
  契約書審査_main?: number;
  契約書起案_main?: number;
  法務相談_main?: number;
  その他_main?: number;
  契約書審査_sub?: number;
  契約書起案_sub?: number;
  法務相談_sub?: number;
  その他_sub?: number;
  // performanceOverviewAssigneeFilterMode === "main" または "sub"の時に使用
  契約書審査?: number;
  契約書起案?: number;
  法務相談?: number;
  その他?: number;
};

export const DURATION_BUCKETS = {
  "0-3日": { min: 0, max: 3, color: "var(--aegis-color-background-success)" },
  "4-7日": { min: 4, max: 7, color: "#90CDF4" },
  "8-14日": { min: 8, max: 14, color: "var(--aegis-color-background-warning)" },
  "15日以上": { min: 15, max: Infinity, color: "var(--aegis-color-background-danger)" },
} as const;

export type DurationBucket = keyof typeof DURATION_BUCKETS;

export const STATUS_ORDER: {
  key: "未着手" | "確認中" | "2次確認中" | "自部門外確認中";
  name: string;
  color: string;
}[] = [
  { key: "未着手", name: "未着手", color: chartPalette.neutral["600(base)"] },
  { key: "確認中", name: "確認中", color: chartPalette.blue["600(base)"] },
  { key: "2次確認中", name: "2次確認中", color: chartPalette.purple["600(base)"] },
  { key: "自部門外確認中", name: "自部門外確認中", color: chartPalette.orange["600(base)"] },
];
