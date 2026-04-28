export const CURRENT_USER_NAME = "渡辺 亮";

export type AssigneeState = "unassigned" | "assigned-to-me" | "assigned-to-other";
export type TakeoverRisk = "low" | "medium" | "high";

export type MatterCase = {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  dueInDays: number;
  updatedAt: string;
  requester: string;
  department: string;
  classification: string;
  currentAssignee: string | null;
  assigneeState: AssigneeState;
  priorityScore: number;
  estimatedHours: number;
  takeoverRisk: TakeoverRisk;
  recommendationReasons: string[];
  note: string;
};

export type OwnershipFilter = "waiting" | "other" | "mine" | "all";
export type SortKey = "priority" | "due" | "updated";

export const ownershipOptions = [
  { label: "担当待ちのみ", value: "waiting" },
  { label: "他担当を含む", value: "other" },
  { label: "自分の担当案件", value: "mine" },
  { label: "すべて", value: "all" },
] as const satisfies ReadonlyArray<{ label: string; value: OwnershipFilter }>;

export const sortOptions = [
  { label: "優先度順", value: "priority" },
  { label: "期限が近い順", value: "due" },
  { label: "更新が新しい順", value: "updated" },
] as const satisfies ReadonlyArray<{ label: string; value: SortKey }>;

export const sampleCases: MatterCase[] = [
  {
    id: "MAT-2026-0214",
    title: "販売代理店契約の更新レビュー",
    status: "未着手",
    dueDate: "2026/03/18",
    dueInDays: 1,
    updatedAt: "2026/03/17 09:20",
    requester: "高橋 彩",
    department: "営業企画部",
    classification: "契約書レビュー",
    currentAssignee: null,
    assigneeState: "unassigned",
    priorityScore: 96,
    estimatedHours: 2,
    takeoverRisk: "low",
    recommendationReasons: ["期限が24時間以内", "相手方修正が多く、着手待ち"],
    note: "相手方が本日中の一次回答を希望しています。",
  },
  {
    id: "MAT-2026-0198",
    title: "SaaS利用規約改定に関する法務相談",
    status: "法務確認中",
    dueDate: "2026/03/19",
    dueInDays: 2,
    updatedAt: "2026/03/17 08:50",
    requester: "山本 健",
    department: "プロダクト企画部",
    classification: "法務相談",
    currentAssignee: "佐藤 花",
    assigneeState: "assigned-to-other",
    priorityScore: 89,
    estimatedHours: 3,
    takeoverRisk: "medium",
    recommendationReasons: ["更新が30分前", "プロダクト企画部の急ぎ案件"],
    note: "担当変更時は引き継ぎコメントの確認が必要です。",
  },
  {
    id: "MAT-2026-0175",
    title: "海外販売向けNDAの日本語チェック",
    status: "依頼者確認待ち",
    dueDate: "2026/03/20",
    dueInDays: 3,
    updatedAt: "2026/03/16 18:10",
    requester: "Chen Rui",
    department: "海外事業部",
    classification: "契約書レビュー",
    currentAssignee: null,
    assigneeState: "unassigned",
    priorityScore: 82,
    estimatedHours: 1,
    takeoverRisk: "low",
    recommendationReasons: ["短時間で完了見込み", "英日差分レビューのみ"],
    note: "テンプレとの差分確認が中心です。",
  },
  {
    id: "MAT-2026-0162",
    title: "採用委託契約の再委託条項確認",
    status: "未着手",
    dueDate: "2026/03/21",
    dueInDays: 4,
    updatedAt: "2026/03/16 13:40",
    requester: "小林 恵",
    department: "人事部",
    classification: "契約書レビュー",
    currentAssignee: "渡辺 亮",
    assigneeState: "assigned-to-me",
    priorityScore: 74,
    estimatedHours: 2,
    takeoverRisk: "low",
    recommendationReasons: ["既に自分が主担当", "関連案件あり"],
    note: "同一依頼者の案件が2件並行しています。",
  },
  {
    id: "MAT-2026-0149",
    title: "共同研究契約の知財帰属整理",
    status: "対応中",
    dueDate: "2026/03/24",
    dueInDays: 7,
    updatedAt: "2026/03/15 20:05",
    requester: "加藤 誠",
    department: "研究開発部",
    classification: "法務相談",
    currentAssignee: "中村 翔",
    assigneeState: "assigned-to-other",
    priorityScore: 77,
    estimatedHours: 5,
    takeoverRisk: "high",
    recommendationReasons: ["専門性が高い", "レビュー履歴が多い"],
    note: "引き継ぎには過去相談ログの確認が必要です。",
  },
  {
    id: "MAT-2026-0128",
    title: "広告出稿契約の肖像権確認",
    status: "差戻し",
    dueDate: "2026/03/22",
    dueInDays: 5,
    updatedAt: "2026/03/15 10:30",
    requester: "岡田 奈々",
    department: "ブランド戦略部",
    classification: "法務相談",
    currentAssignee: null,
    assigneeState: "unassigned",
    priorityScore: 71,
    estimatedHours: 2,
    takeoverRisk: "medium",
    recommendationReasons: ["依頼者から再相談あり", "本日リマインド送信済み"],
    note: "差戻し理由は広告表現まわりの再確認です。",
  },
  {
    id: "MAT-2026-0111",
    title: "OEM基本契約の責任制限条項見直し",
    status: "法務確認中",
    dueDate: "2026/03/25",
    dueInDays: 8,
    updatedAt: "2026/03/14 17:05",
    requester: "松田 亮介",
    department: "事業開発部",
    classification: "契約書レビュー",
    currentAssignee: "田中 美咲",
    assigneeState: "assigned-to-other",
    priorityScore: 69,
    estimatedHours: 4,
    takeoverRisk: "medium",
    recommendationReasons: ["優先度は高いが工数大きめ", "責任制限の交渉論点あり"],
    note: "他案件と合わせて担当すると負荷が上がります。",
  },
  {
    id: "MAT-2026-0104",
    title: "利用規約英訳レビューの二次確認",
    status: "未着手",
    dueDate: "2026/03/27",
    dueInDays: 10,
    updatedAt: "2026/03/14 09:15",
    requester: "鈴木 一郎",
    department: "海外事業部",
    classification: "契約書レビュー",
    currentAssignee: null,
    assigneeState: "unassigned",
    priorityScore: 64,
    estimatedHours: 1,
    takeoverRisk: "low",
    recommendationReasons: ["短時間で完了見込み", "英訳確認のみ"],
    note: "優先度は中位だが、空き時間で処理しやすい案件です。",
  },
];

export function assignCasesToCurrentUser(cases: MatterCase[], caseIds: string[]): MatterCase[] {
  const targets = new Set(caseIds);

  return cases.map((caseItem) =>
    targets.has(caseItem.id)
      ? {
          ...caseItem,
          currentAssignee: CURRENT_USER_NAME,
          assigneeState: "assigned-to-me",
          updatedAt: "2026/03/17 10:00",
        }
      : caseItem,
  );
}

export function getVisibleCases(cases: MatterCase[], query: string, ownership: OwnershipFilter): MatterCase[] {
  const normalizedQuery = query.trim().toLowerCase();

  return cases.filter((caseItem) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [caseItem.id, caseItem.title, caseItem.requester, caseItem.department].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );

    if (!matchesQuery) {
      return false;
    }

    switch (ownership) {
      case "waiting":
        return caseItem.assigneeState === "unassigned";
      case "other":
        return caseItem.assigneeState !== "assigned-to-me";
      case "mine":
        return caseItem.assigneeState === "assigned-to-me";
      default:
        return true;
    }
  });
}

export function sortCases(cases: MatterCase[], sortKey: SortKey): MatterCase[] {
  return [...cases].sort((left, right) => {
    if (sortKey === "priority") {
      return right.priorityScore - left.priorityScore;
    }

    if (sortKey === "due") {
      return left.dueInDays - right.dueInDays;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

export function getDueSoonCount(cases: MatterCase[]): number {
  return cases.filter((caseItem) => caseItem.dueInDays <= 3).length;
}

export function getAssignableCount(cases: MatterCase[]): number {
  return cases.filter((caseItem) => caseItem.assigneeState !== "assigned-to-me").length;
}

export function getMyCaseCount(cases: MatterCase[]): number {
  return cases.filter((caseItem) => caseItem.assigneeState === "assigned-to-me").length;
}

export function getHighRiskCount(cases: MatterCase[]): number {
  return cases.filter((caseItem) => caseItem.takeoverRisk === "high").length;
}
