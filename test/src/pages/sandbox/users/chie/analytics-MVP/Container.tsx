// Container component for TeamMembers page
// Contains all state management, data calculations, and event handlers

import { LfArrowUpRightFromSquare, LfLayoutHorizonRight, LfWarningTriangle } from "@legalforce/aegis-icons";
import {
  Avatar,
  Button,
  Combobox,
  DataTableCell,
  type DataTableColumnDef,
  DataTableLink,
  Icon,
  IconButton,
  StatusLabel,
  Tag,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useCallback, useMemo, useState } from "react";
import chartPalette from "./ChartParette.json";
import { Presentation } from "./components/Presentation";
import {
  CASE_TYPE_ORDER,
  caseData,
  getLocalizedCaseData,
  getLocalizedCaseTypeOrder,
  getLocalizedDueDateCategories,
  getLocalizedStatus,
  getLocalizedTeamMembers,
  getReverseCaseTypeMapping,
  getReverseStatusMapping,
  MEMBER_MAPPING,
  teamMembers,
  today,
  USER_GROUPS,
} from "./constants";
import { useLocale } from "./hooks/useLocale";
import { useTranslation } from "./hooks/useTranslation";
import { reportTranslations } from "./reportTranslations";
import type {
  AssigneeFilterMode,
  CaseData,
  CaseType,
  DueDateFilter,
  DurationBucket,
  LeadTimeCategories,
  LeadTimeCompositionData,
  MemberPerformanceByCaseTypeData,
  MemberPerformanceData,
} from "./types";
import { DURATION_BUCKETS, INITIAL_LEAD_TIME_CATEGORIES, STATUS_ORDER } from "./types";

// Helper functions
const isOngoingCase = (c: CaseData, reverseStatusMapping: Record<string, string>) => {
  const originalStatus = reverseStatusMapping[c.status] || c.status;
  return originalStatus !== "完了";
};

const getStatusLabelColor = (status: string): "neutral" | "red" | "yellow" | "blue" | "teal" | "gray" => {
  const colorMap: Record<string, "neutral" | "red" | "yellow" | "blue" | "teal" | "gray"> = {
    未着手: "gray",
    確認中: "blue",
    "2次確認中": "teal",
    自部門外確認中: "yellow",
  };
  return colorMap[status] || "neutral";
};

const getDayDiff = (dateStr: string) => {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
};

const getDueDateCategory = (dueDate: string | null): string => {
  if (!dueDate) return "未入力";
  const diff = getDayDiff(dueDate);
  if (diff < 0) return "超過";
  if (diff === 0) return "今日";
  if (diff >= 1 && diff <= 2) return "2日以内";
  if (diff >= 3 && diff <= 6) return "3-6日以内";
  return "7日以降";
};

const getDaysSinceLastStatusChange = (c: CaseData) => {
  if (!c.statusHistory || c.statusHistory.length === 0) return null;

  const lastStatus = c.statusHistory[c.statusHistory.length - 1];
  const lastStatusDate = new Date(lastStatus.startDate);
  const todayDate = new Date(today);
  lastStatusDate.setHours(0, 0, 0, 0);
  todayDate.setHours(0, 0, 0, 0);

  const diffTime = todayDate.getTime() - lastStatusDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < 0 ? null : diffDays;
};

const getDurationBucket = (diffDays: number): DurationBucket | null => {
  for (const [key, range] of Object.entries(DURATION_BUCKETS) as [
    DurationBucket,
    (typeof DURATION_BUCKETS)[DurationBucket],
  ][]) {
    if (diffDays >= range.min && diffDays <= range.max) return key;
  }
  return null;
};

// リードタイム計算: 起点はcreatedAt（案件作成日時）
// プロトタイプデータにはcreatedAtがないため、startDateをcreatedAt相当として扱う
const calculateLeadTime = (startDate: string, completionDate: string) => {
  // startDateはcreatedAt相当（案件作成日時）
  const start = new Date(startDate);
  const end = new Date(completionDate);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
};

// 初回返信速度計算: 起点はcreatedAt（案件作成日時）
// プロトタイプデータにはcreatedAtがないため、startDateをcreatedAt相当として扱う
const calculateFirstReplyTime = (startDate: string, firstReplyDate: string) => {
  // startDateはcreatedAt相当（案件作成日時）
  const start = new Date(startDate);
  const reply = new Date(firstReplyDate);
  return (reply.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
};

const calculateMedian = (values: number[]) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const filterCases = (cases: CaseData[], statusFilter: string, typeFilter: string, dueDateFilter: DueDateFilter) => {
  let filtered = cases;

  // Due Date Filter
  if (dueDateFilter !== "すべて") {
    filtered = filtered.filter((item) => {
      if (dueDateFilter === "納期未入力") {
        return !item.dueDate;
      }
      if (!item.dueDate) {
        return false;
      }
      const diff = getDayDiff(item.dueDate);
      switch (dueDateFilter) {
        case "納期超過":
          return diff < 0;
        case "今日まで":
          return diff === 0;
        case "今日含め3日以内":
          return diff >= 0 && diff <= 2;
        case "今日含め7日以内":
          return diff >= 0 && diff <= 6;
        case "1週間後〜":
          return diff >= 7;
        default:
          return false;
      }
    });
  }

  // Status and Case Type Filter
  filtered = filtered.filter((c) => {
    const statusMatch = statusFilter === "すべて" || c.status === statusFilter;
    const caseTypeMatch = typeFilter === "すべて" || c.caseType === typeFilter;
    return statusMatch && caseTypeMatch;
  });

  // Sort
  return filtered.sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (!a.dueDate) return -1;
    if (!b.dueDate) return 1;
    return 0;
  });
};

const buildCaseDetailUrl = (caseId: number) => `https://app.legalon-cloud.com/case/${caseId}`;

export function Container() {
  const { t } = useTranslation(reportTranslations);
  const { locale } = useLocale();

  const formatDate = useCallback(
    (dateString: string | null | undefined): string => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return dateString;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      if (locale === "ja-JP") {
        return `${year}/${month}/${day}`;
      }
      return `${month}/${day}/${year}`;
    },
    [locale],
  );

  const localizedCaseData = useMemo(() => getLocalizedCaseData(locale), [locale]);
  const localizedTeamMembers = useMemo(() => getLocalizedTeamMembers(locale), [locale]);

  // ユーザーグループを展開して、実際のユーザー名の配列に変換する関数
  const expandUserGroups = useCallback((members: string[]): string[] => {
    const expandedMembers: string[] = [];
    const processedGroups = new Set<string>();

    for (const member of members) {
      if (member.startsWith("group:")) {
        // ユーザーグループの場合
        const groupName = member.replace("group:", "");
        if (USER_GROUPS[groupName] && !processedGroups.has(groupName)) {
          processedGroups.add(groupName);
          // グループに所属するすべてのユーザーを追加
          expandedMembers.push(...USER_GROUPS[groupName]);
        }
      } else {
        // 通常のユーザーの場合
        expandedMembers.push(member);
      }
    }

    // 重複を排除
    return Array.from(new Set(expandedMembers));
  }, []);

  // State management
  const [, setPaneOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [paneTabIndex, setPaneTabIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [teamCaseSortType, setTeamCaseSortType] = useState<"caseCount" | "name">("caseCount");
  const [activeDueDateFilter, setActiveDueDateFilter] = useState<DueDateFilter>("すべて");
  const [activeCaseTypeFilter, setActiveCaseTypeFilter] = useState<string>("すべて");
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("すべて");
  const [caseStatusView, setCaseStatusView] = useState<"status" | "type" | "dueDate" | "department">("dueDate");
  const [personalCaseTypeFilter, setPersonalCaseTypeFilter] = useState<string>("すべて");
  const [performanceCaseTypeFilter] = useState<string>("すべて");
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [performanceSelectedMembers] = useState<string[]>([]);
  // 集計期間の初期値: 直近6ヶ月（今日から6ヶ月前の月初〜今月末）
  const getInitialDateRange = useCallback(() => {
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // 今月末
    const start = new Date(today.getFullYear(), today.getMonth() - 5, 1); // 6ヶ月前の月初
    return { start, end };
  }, []);
  const [performanceDateRange] = useState<{ start: Date | null; end: Date | null }>(getInitialDateRange());
  // WorkloadTab用のフィルター状態
  const [workloadSelectedMembers, setWorkloadSelectedMembers] = useState<string[]>([]);
  const [workloadDateRange, setWorkloadDateRange] = useState<{ start: Date | null; end: Date | null }>(
    getInitialDateRange(),
  );
  // TimeTab用のフィルター状態
  const [timeSelectedMembers, setTimeSelectedMembers] = useState<string[]>([]);
  const [timeDateRange, setTimeDateRange] = useState<{ start: Date | null; end: Date | null }>(getInitialDateRange());
  // CasesTab用のフィルター状態
  const [casesSelectedMembers, setCasesSelectedMembers] = useState<string[]>([]);
  const [showEmptySubAssignee, setShowEmptySubAssignee] = useState(false);
  const [subAssignments, setSubAssignments] = useState<Record<string, string>>({});
  const [paneStatusFilter, setPaneStatusFilter] = useState("すべて");
  const [paneCaseTypeFilter, setPaneCaseTypeFilter] = useState("すべて");
  const [paneDueDateFilter, setPaneDueDateFilter] = useState<DueDateFilter>("すべて");
  const [panePerformanceDateRange, setPanePerformanceDateRange] = useState<{ start: Date | null; end: Date | null }>(
    getInitialDateRange(),
  );
  // Personal performance用のstate（2つのカードに分離）
  const [personalMatterCountCaseTypeFilter, setPersonalMatterCountCaseTypeFilter] = useState<string>("すべて");
  const [personalMatterCountDateRange, setPersonalMatterCountDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>(getInitialDateRange());
  const [personalMatterCountViewMode, setPersonalMatterCountViewMode] = useState<"graph" | "table">("graph");
  const [personalMatterCountViewType, setPersonalMatterCountViewType] = useState<"dueDate" | "caseType" | "department">(
    "caseType",
  );
  const [personalMatterCountPeriodView, setPersonalMatterCountPeriodView] = useState<"all" | "monthly">("monthly");
  const [isPersonalMatterCountFilterOpen, setIsPersonalMatterCountFilterOpen] = useState(false);
  const [personalLeadTimeCaseTypeFilter, setPersonalLeadTimeCaseTypeFilter] = useState<string>("すべて");
  const [personalLeadTimeDateRange, setPersonalLeadTimeDateRange] = useState<{ start: Date | null; end: Date | null }>(
    getInitialDateRange(),
  );
  const [personalLeadTimeViewMode, setPersonalLeadTimeViewMode] = useState<"graph" | "table">("graph");
  const [personalLeadTimePeriodView, setPersonalLeadTimePeriodView] = useState<"all" | "monthly">("monthly");
  const [isPersonalLeadTimeFilterOpen, setIsPersonalLeadTimeFilterOpen] = useState(false);
  const [paneContext, setPaneContext] = useState<
    | {
        type: "statusDuration";
        member: string;
        status: string;
      }
    | {
        type: "durationBucket";
        member: string;
        bucket: DurationBucket;
        role: "main" | "sub";
      }
    | null
  >(null);
  // パフォーマンス概要カード用の状態
  const [performanceOverviewCaseTypeFilter, setPerformanceOverviewCaseTypeFilter] = useState("すべて");
  const [performanceOverviewAssigneeFilterMode, setPerformanceOverviewAssigneeFilterMode] =
    useState<AssigneeFilterMode>("main");
  const [performanceOverviewViewMode, setPerformanceOverviewViewMode] = useState<"graph" | "table">("graph");
  const [isPerformanceOverviewFilterOpen, setIsPerformanceOverviewFilterOpen] = useState(false);
  const [performanceOverviewDueDateFilter, setPerformanceOverviewDueDateFilter] = useState<DueDateFilter>("すべて");
  const [performanceOverviewDateRange, setPerformanceOverviewDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [leadTimePerformanceSortType, setLeadTimePerformanceSortType] = useState<"caseCount" | "name">("caseCount");
  const [leadTimePerformanceSortOrder, setLeadTimePerformanceSortOrder] = useState<"asc" | "desc">("desc");
  const [performanceOverviewBreakdownView, setPerformanceOverviewBreakdownView] = useState<
    "dueDate" | "caseType" | "department"
  >("caseType");

  // リードタイム内訳カード用の状態
  const [leadTimeCompositionCaseTypeFilter, setLeadTimeCompositionCaseTypeFilter] = useState("すべて");
  const [leadTimeCompositionAssigneeFilterMode, setLeadTimeCompositionAssigneeFilterMode] =
    useState<AssigneeFilterMode>("main");
  const [leadTimeCompositionViewMode, setLeadTimeCompositionViewMode] = useState<"graph" | "table">("graph");
  const [leadTimeCompositionGraphMode, setLeadTimeCompositionGraphMode] = useState<"grouped" | "detailed">("detailed");
  const [isLeadTimeCompositionFilterOpen, setIsLeadTimeCompositionFilterOpen] = useState(false);
  const [leadTimeCompositionSortType, setLeadTimeCompositionSortType] = useState<"caseCount" | "name">("caseCount");
  const [leadTimeCompositionSortOrder, setLeadTimeCompositionSortOrder] = useState<"asc" | "desc">("desc");
  const [leadTimeCategories, setLeadTimeCategories] = useState<LeadTimeCategories>(INITIAL_LEAD_TIME_CATEGORIES);
  const [isStatusSettingsOpen, setIsStatusSettingsOpen] = useState(false);
  const [assigneeFilterMode, setAssigneeFilterMode] = useState<AssigneeFilterMode>("main");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPaneFilterOpen, setIsPaneFilterOpen] = useState(false);
  const [teamCaseViewMode, setTeamCaseViewMode] = useState<"graph" | "table">("graph");
  // 案件数グラフ用のstate
  const [caseCountViewMode, setCaseCountViewMode] = useState<"graph" | "table">("graph");
  const [caseCountViewType, setCaseCountViewType] = useState<"dueDate" | "caseType" | "department">("caseType");
  const [caseCountPeriodView, setCaseCountPeriodView] = useState<"all" | "monthly">("monthly");
  const [caseCountVisibleMetrics] = useState({
    新規案件数: true,
  });
  const [caseCountShowPreviousYear, setCaseCountShowPreviousYear] = useState(false);
  const [caseCountCaseTypeFilter, setCaseCountCaseTypeFilter] = useState("すべて");
  const [isCaseCountFilterOpen, setIsCaseCountFilterOpen] = useState(false);

  // 2つ目の案件数カード用のstate
  const [caseCount2ViewMode, setCaseCount2ViewMode] = useState<"graph" | "table">("graph");
  const [caseCount2ViewType, setCaseCount2ViewType] = useState<"dueDate" | "caseType" | "department">("caseType");
  const [caseCount2PeriodView, setCaseCount2PeriodView] = useState<"all" | "monthly">("monthly");
  const [caseCount2VisibleMetrics] = useState({
    新規案件数: false,
    完了案件数: true,
  });
  const [caseCount2ShowPreviousYear, setCaseCount2ShowPreviousYear] = useState(false);
  const [caseCount2CaseTypeFilter, setCaseCount2CaseTypeFilter] = useState("すべて");
  const [isCaseCount2FilterOpen, setIsCaseCount2FilterOpen] = useState(false);

  // リードタイムグラフ用のstate
  const [leadTimeGraphViewMode, setLeadTimeGraphViewMode] = useState<"graph" | "table">("graph");
  const [leadTimeVisibleMetrics, setLeadTimeVisibleMetrics] = useState({
    リードタイム中央値: true,
    初回返信速度中央値: true,
  });
  const [leadTimeShowPreviousYear, setLeadTimeShowPreviousYear] = useState(false);
  const [leadTimeCaseTypeFilter, setLeadTimeCaseTypeFilter] = useState("すべて");
  const [isLeadTimeGraphFilterOpen, setIsLeadTimeGraphFilterOpen] = useState(false);

  // Legacy state (for backward compatibility)
  const [monthlyGraphView, setMonthlyGraphView] = useState<"caseCount" | "leadTime">("caseCount");
  const [experienceViewMode, setExperienceViewMode] = useState<"graph" | "table">("graph");

  // Data calculations
  const selectedMemberMainCases = useMemo(() => {
    // PRD 3.2 D: 対象は「完了以外すべて（未着手含む）」
    const completedStatus = locale === "ja-JP" ? "完了" : "Completed";
    const cases = localizedCaseData.filter((c) => c.assignee === selectedMember && c.status !== completedStatus);
    return filterCases(cases, paneStatusFilter, paneCaseTypeFilter, paneDueDateFilter);
  }, [selectedMember, paneStatusFilter, paneCaseTypeFilter, paneDueDateFilter, localizedCaseData, locale]);

  const selectedMemberSubCases = useMemo(() => {
    // PRD 3.2 D: 対象は「完了以外すべて（未着手含む）」
    const completedStatus = locale === "ja-JP" ? "完了" : "Completed";
    const cases = localizedCaseData.filter((c) => c.subAssignee === selectedMember && c.status !== completedStatus);
    return filterCases(cases, paneStatusFilter, paneCaseTypeFilter, paneDueDateFilter);
  }, [selectedMember, paneStatusFilter, paneCaseTypeFilter, paneDueDateFilter, localizedCaseData, locale]);

  const membersWithOverdueCases = useMemo(() => {
    const overdueAssignees: string[] = [];
    localizedCaseData.forEach((caseItem) => {
      if (!caseItem.completionDate && caseItem.dueDate && getDayDiff(caseItem.dueDate) < 0) {
        if (!overdueAssignees.includes(caseItem.assignee)) {
          overdueAssignees.push(caseItem.assignee);
        }
      }
    });
    return overdueAssignees;
  }, [localizedCaseData]);

  // 主担当が空の案件の全リスト（Drawer表示用、10件制限なし）
  const allUnassignedCases = useMemo(() => {
    const completedStatus = locale === "ja-JP" ? "完了" : "Completed";
    let ongoingCases = localizedCaseData.filter((c) => c.status !== completedStatus);

    // メンバーフィルターの適用
    if (casesSelectedMembers.length > 0) {
      const expandedMembers = expandUserGroups(casesSelectedMembers);
      // 未割り当て案件はメンバーフィルターの対象外（全員が対象）
      // ただし、副担当が選択されたメンバーに含まれる場合は表示
      ongoingCases = ongoingCases.filter((c) => {
        const effectiveSubAssignee = subAssignments[c.caseName] ?? c.subAssignee ?? "";
        // 主担当が空で、副担当が選択されたメンバーに含まれる場合のみ表示
        const effectiveAssignee = assignments[c.caseName] ?? c.assignee ?? "";
        if (effectiveAssignee === "") {
          return effectiveSubAssignee === "" || expandedMembers.includes(effectiveSubAssignee);
        }
        return false;
      });
    }

    const filtered = ongoingCases.filter((c) => {
      const effectiveAssignee = assignments[c.caseName] ?? c.assignee ?? "";
      return effectiveAssignee === "";
    });

    const sorted = [...filtered].sort((a, b) => {
      const aUpdatedAt = a.updatedAt ?? a.startDate;
      const bUpdatedAt = b.updatedAt ?? b.startDate;
      return new Date(bUpdatedAt).getTime() - new Date(aUpdatedAt).getTime();
    });

    return sorted;
  }, [assignments, subAssignments, casesSelectedMembers, expandUserGroups, localizedCaseData, locale]);

  // 副担当が空の案件の全リスト（Drawer表示用、10件制限なし）
  const allUnassignedSubAssigneeCases = useMemo(() => {
    const completedStatus = locale === "ja-JP" ? "完了" : "Completed";
    let ongoingCases = localizedCaseData.filter((c) => c.status !== completedStatus);

    // メンバーフィルターの適用
    if (casesSelectedMembers.length > 0) {
      const expandedMembers = expandUserGroups(casesSelectedMembers);
      // 未割り当て案件はメンバーフィルターの対象外（全員が対象）
      // ただし、主担当が選択されたメンバーに含まれる場合は表示
      ongoingCases = ongoingCases.filter((c) => {
        const effectiveAssignee = assignments[c.caseName] ?? c.assignee ?? "";
        // 副担当が空で、主担当が選択されたメンバーに含まれる場合のみ表示
        const effectiveSubAssignee = subAssignments[c.caseName] ?? c.subAssignee ?? "";
        if (effectiveSubAssignee === "") {
          return effectiveAssignee === "" || expandedMembers.includes(effectiveAssignee);
        }
        return false;
      });
    }

    const filtered = ongoingCases.filter((c) => {
      const effectiveSubAssignee = subAssignments[c.caseName] ?? c.subAssignee ?? "";
      return effectiveSubAssignee === "";
    });

    const sorted = [...filtered].sort((a, b) => {
      const aUpdatedAt = a.updatedAt ?? a.startDate;
      const bUpdatedAt = b.updatedAt ?? b.startDate;
      return new Date(bUpdatedAt).getTime() - new Date(aUpdatedAt).getTime();
    });

    return sorted;
  }, [subAssignments, assignments, casesSelectedMembers, expandUserGroups, localizedCaseData, locale]);

  // 主担当が空の案件の件数
  const unassignedCasesCount = allUnassignedCases.length;

  // 副担当が空の案件の件数
  const unassignedSubAssigneeCasesCount = allUnassignedSubAssigneeCases.length;

  const overallPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      {
        newCount: number;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimes: number[];
        firstReplyTimes: number[];
      }
    > = {};

    // 案件タイプフィルタを適用
    let casesToConsider =
      performanceCaseTypeFilter === "すべて" || performanceCaseTypeFilter === "All"
        ? localizedCaseData
        : localizedCaseData.filter((c) => c.caseType === performanceCaseTypeFilter);

    // メンバーフィルタを適用
    // 空選択の場合は全メンバー（未割り当て案件も含む）
    // 選択されている場合は、選択したメンバー（主担当）に紐づく案件のみ
    if (performanceSelectedMembers.length > 0) {
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return performanceSelectedMembers.includes(assignee);
      });
    }

    casesToConsider.forEach((c) => {
      // 新規案件数: createdAt（案件作成日時）の月で集計
      // プロトタイプデータにはcreatedAtがないため、startDateをcreatedAt相当として扱う
      const createdAt = new Date(c.startDate); // startDateはcreatedAt相当
      // 日付範囲が設定されている場合、その範囲内の月のみを集計
      if (performanceDateRange.start || performanceDateRange.end) {
        const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
        const rangeStart = performanceDateRange.start
          ? new Date(performanceDateRange.start.getFullYear(), performanceDateRange.start.getMonth(), 1)
          : null;
        const rangeEnd = performanceDateRange.end
          ? new Date(performanceDateRange.end.getFullYear(), performanceDateRange.end.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          // 新規案件数を集計（createdAtの月で集計）
          const startMonth = c.startDate.substring(0, 7); // startDateはcreatedAt相当
          if (!monthlyData[startMonth]) {
            monthlyData[startMonth] = {
              newCount: 0,
              onTimeCompletionCount: 0,
              overdueCompletionCount: 0,
              noDueDateCompletionCount: 0,
              leadTimes: [],
              firstReplyTimes: [],
            };
          }
          monthlyData[startMonth].newCount += 1;
        }
      } else {
        // 日付範囲が設定されていない場合、すべての新規案件を集計（createdAtの月で集計）
        const startMonth = c.startDate.substring(0, 7); // startDateはcreatedAt相当
        if (!monthlyData[startMonth]) {
          monthlyData[startMonth] = {
            newCount: 0,
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          };
        }
        monthlyData[startMonth].newCount += 1;
      }

      // 完了案件数: 完了日の月で集計
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const completionMonth = c.completionDate.substring(0, 7);

        // 完了日の月が範囲内かチェック
        if (performanceDateRange.start || performanceDateRange.end) {
          const monthStart = new Date(completionDate.getFullYear(), completionDate.getMonth(), 1);
          const rangeStart = performanceDateRange.start
            ? new Date(performanceDateRange.start.getFullYear(), performanceDateRange.start.getMonth(), 1)
            : null;
          const rangeEnd = performanceDateRange.end
            ? new Date(performanceDateRange.end.getFullYear(), performanceDateRange.end.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            newCount: 0,
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          };
        }

        // 完了案件の内訳: 納期内完了 / 納期超過完了 / 納期未入力
        if (!c.dueDate) {
          // 納期未入力
          monthlyData[completionMonth].noDueDateCompletionCount += 1;
        } else {
          const isOverdue = new Date(c.completionDate) > new Date(c.dueDate);
          if (isOverdue) {
            // 納期超過完了
            monthlyData[completionMonth].overdueCompletionCount += 1;
          } else {
            // 納期内完了
            monthlyData[completionMonth].onTimeCompletionCount += 1;
          }
        }

        // リードタイム計算: 起点はcreatedAt（startDateはcreatedAt相当）
        monthlyData[completionMonth].leadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
        if (c.firstReplyDate) {
          // 初回返信速度計算: 起点はcreatedAt（startDateはcreatedAt相当）
          monthlyData[completionMonth].firstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
        }
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        // 月名をロケールに応じてフォーマット
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        return {
          name: monthName,
          新規案件数: data.newCount,
          onTimeCompletionCount: data.onTimeCompletionCount,
          overdueCompletionCount: data.overdueCompletionCount,
          noDueDateCompletionCount: data.noDueDateCompletionCount,
          リードタイム中央値: parseFloat(calculateMedian(data.leadTimes).toFixed(1)),
          初回返信速度中央値: parseFloat(calculateMedian(data.firstReplyTimes).toFixed(1)),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }, [
    performanceCaseTypeFilter,
    performanceDateRange,
    performanceSelectedMembers,
    assignments,
    localizedCaseData,
    locale,
  ]);

  // 案件タイプ別のデータ計算
  const caseCountByCaseTypeOverallPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      Record<
        CaseType,
        {
          newCount: number;
          completedCount: number;
        }
      >
    > = {};

    // メンバーフィルタを適用（案件タイプ別ビューでは案件タイプフィルタは適用しない）
    let casesToConsider = localizedCaseData;
    if (performanceSelectedMembers.length > 0) {
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return performanceSelectedMembers.includes(assignee);
      });
    }

    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    casesToConsider.forEach((c) => {
      const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;

      // 新規案件数: createdAt（案件作成日時）の月で集計
      const createdAt = new Date(c.startDate);
      if (performanceDateRange.start || performanceDateRange.end) {
        const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
        const rangeStart = performanceDateRange.start
          ? new Date(performanceDateRange.start.getFullYear(), performanceDateRange.start.getMonth(), 1)
          : null;
        const rangeEnd = performanceDateRange.end
          ? new Date(performanceDateRange.end.getFullYear(), performanceDateRange.end.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const startMonth = c.startDate.substring(0, 7);
          if (!monthlyData[startMonth]) {
            monthlyData[startMonth] = {
              契約書審査: { newCount: 0, completedCount: 0 },
              契約書起案: { newCount: 0, completedCount: 0 },
              法務相談: { newCount: 0, completedCount: 0 },
              その他: { newCount: 0, completedCount: 0 },
            };
          }
          if (!monthlyData[startMonth][caseType]) {
            monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
          }
          monthlyData[startMonth][caseType].newCount += 1;
        }
      } else {
        const startMonth = c.startDate.substring(0, 7);
        if (!monthlyData[startMonth]) {
          monthlyData[startMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[startMonth][caseType]) {
          monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
        }
        monthlyData[startMonth][caseType].newCount += 1;
      }

      // 完了案件数: 完了日の月で集計（納期別の分類なし、合計のみ）
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const completionMonth = c.completionDate.substring(0, 7);

        if (performanceDateRange.start || performanceDateRange.end) {
          const monthStart = new Date(completionDate.getFullYear(), completionDate.getMonth(), 1);
          const rangeStart = performanceDateRange.start
            ? new Date(performanceDateRange.start.getFullYear(), performanceDateRange.start.getMonth(), 1)
            : null;
          const rangeEnd = performanceDateRange.end
            ? new Date(performanceDateRange.end.getFullYear(), performanceDateRange.end.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[completionMonth][caseType]) {
          monthlyData[completionMonth][caseType] = { newCount: 0, completedCount: 0 };
        }

        monthlyData[completionMonth][caseType].completedCount += 1;
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        const result: Record<string, number | string> = {
          name: monthName,
          _monthKey: monthKey,
        };

        CASE_TYPE_ORDER.forEach((caseType) => {
          const caseTypeData = data[caseType];
          if (caseTypeData) {
            result[`${caseType}_新規案件数`] = caseTypeData.newCount;
            result[`${caseType}_完了案件数`] = caseTypeData.completedCount;
          } else {
            result[`${caseType}_新規案件数`] = 0;
            result[`${caseType}_完了案件数`] = 0;
          }
        });

        return result;
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [performanceDateRange, performanceSelectedMembers, assignments, localizedCaseData, locale]);

  // WorkloadTab用: 案件タイプ別のデータ計算
  const workloadCaseCountByCaseTypeOverallPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      Record<
        CaseType,
        {
          newCount: number;
          completedCount: number;
        }
      >
    > = {};

    // メンバーフィルタを適用（案件タイプ別ビューでは案件タイプフィルタは適用しない）
    let casesToConsider = localizedCaseData;
    if (workloadSelectedMembers.length > 0) {
      const expandedMembers = expandUserGroups(workloadSelectedMembers);
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return expandedMembers.includes(assignee);
      });
    }

    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    casesToConsider.forEach((c) => {
      const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;

      // 新規案件数: createdAt（案件作成日時）の月で集計
      const createdAt = new Date(c.startDate);
      if (workloadDateRange.start || workloadDateRange.end) {
        const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
        const rangeStart = workloadDateRange.start
          ? new Date(workloadDateRange.start.getFullYear(), workloadDateRange.start.getMonth(), 1)
          : null;
        const rangeEnd = workloadDateRange.end
          ? new Date(workloadDateRange.end.getFullYear(), workloadDateRange.end.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const startMonth = c.startDate.substring(0, 7);
          if (!monthlyData[startMonth]) {
            monthlyData[startMonth] = {
              契約書審査: { newCount: 0, completedCount: 0 },
              契約書起案: { newCount: 0, completedCount: 0 },
              法務相談: { newCount: 0, completedCount: 0 },
              その他: { newCount: 0, completedCount: 0 },
            };
          }
          if (!monthlyData[startMonth][caseType]) {
            monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
          }
          monthlyData[startMonth][caseType].newCount += 1;
        }
      } else {
        const startMonth = c.startDate.substring(0, 7);
        if (!monthlyData[startMonth]) {
          monthlyData[startMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[startMonth][caseType]) {
          monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
        }
        monthlyData[startMonth][caseType].newCount += 1;
      }

      // 完了案件数: 完了日の月で集計（納期別の分類なし、合計のみ）
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const completionMonth = c.completionDate.substring(0, 7);

        if (workloadDateRange.start || workloadDateRange.end) {
          const monthStart = new Date(completionDate.getFullYear(), completionDate.getMonth(), 1);
          const rangeStart = workloadDateRange.start
            ? new Date(workloadDateRange.start.getFullYear(), workloadDateRange.start.getMonth(), 1)
            : null;
          const rangeEnd = workloadDateRange.end
            ? new Date(workloadDateRange.end.getFullYear(), workloadDateRange.end.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[completionMonth][caseType]) {
          monthlyData[completionMonth][caseType] = { newCount: 0, completedCount: 0 };
        }

        monthlyData[completionMonth][caseType].completedCount += 1;
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        const result: Record<string, number | string> = {
          name: monthName,
          _monthKey: monthKey,
        };

        CASE_TYPE_ORDER.forEach((caseType) => {
          const caseTypeData = data[caseType];
          if (caseTypeData) {
            result[`${caseType}_新規案件数`] = caseTypeData.newCount;
            result[`${caseType}_完了案件数`] = caseTypeData.completedCount;
          } else {
            result[`${caseType}_新規案件数`] = 0;
            result[`${caseType}_完了案件数`] = 0;
          }
        });

        return result;
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [workloadDateRange, workloadSelectedMembers, assignments, localizedCaseData, locale, expandUserGroups]);

  // WorkloadTab用: 案件タイプ別の昨年データ計算
  const workloadCaseCountByCaseTypePreviousYearPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      Record<
        CaseType,
        {
          newCount: number;
          completedCount: number;
        }
      >
    > = {};

    // 昨年の期間を計算
    const previousYearStart = workloadDateRange.start
      ? new Date(
          workloadDateRange.start.getFullYear() - 1,
          workloadDateRange.start.getMonth(),
          workloadDateRange.start.getDate(),
        )
      : null;
    const previousYearEnd = workloadDateRange.end
      ? new Date(
          workloadDateRange.end.getFullYear() - 1,
          workloadDateRange.end.getMonth(),
          workloadDateRange.end.getDate(),
        )
      : null;

    // メンバーフィルタを適用
    let casesToConsider = localizedCaseData;
    if (workloadSelectedMembers.length > 0) {
      const expandedMembers = expandUserGroups(workloadSelectedMembers);
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return expandedMembers.includes(assignee);
      });
    }

    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    casesToConsider.forEach((c) => {
      const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;

      // 新規案件数: 昨年の期間で集計
      const createdAt = new Date(c.startDate);
      const previousYearCreatedAt = new Date(createdAt.getFullYear() - 1, createdAt.getMonth(), createdAt.getDate());
      if (previousYearStart || previousYearEnd) {
        const monthStart = new Date(previousYearCreatedAt.getFullYear(), previousYearCreatedAt.getMonth(), 1);
        const rangeStart = previousYearStart
          ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
          : null;
        const rangeEnd = previousYearEnd
          ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const startMonth = `${previousYearCreatedAt.getFullYear()}-${String(previousYearCreatedAt.getMonth() + 1).padStart(2, "0")}`;
          if (!monthlyData[startMonth]) {
            monthlyData[startMonth] = {
              契約書審査: { newCount: 0, completedCount: 0 },
              契約書起案: { newCount: 0, completedCount: 0 },
              法務相談: { newCount: 0, completedCount: 0 },
              その他: { newCount: 0, completedCount: 0 },
            };
          }
          if (!monthlyData[startMonth][caseType]) {
            monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
          }
          monthlyData[startMonth][caseType].newCount += 1;
        }
      } else {
        const startMonth = `${previousYearCreatedAt.getFullYear()}-${String(previousYearCreatedAt.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyData[startMonth]) {
          monthlyData[startMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[startMonth][caseType]) {
          monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
        }
        monthlyData[startMonth][caseType].newCount += 1;
      }

      // 完了案件数: 昨年の期間で集計
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const previousYearCompletionDate = new Date(
          completionDate.getFullYear() - 1,
          completionDate.getMonth(),
          completionDate.getDate(),
        );
        const completionMonth = `${previousYearCompletionDate.getFullYear()}-${String(previousYearCompletionDate.getMonth() + 1).padStart(2, "0")}`;

        if (previousYearStart || previousYearEnd) {
          const monthStart = new Date(
            previousYearCompletionDate.getFullYear(),
            previousYearCompletionDate.getMonth(),
            1,
          );
          const rangeStart = previousYearStart
            ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
            : null;
          const rangeEnd = previousYearEnd
            ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[completionMonth][caseType]) {
          monthlyData[completionMonth][caseType] = { newCount: 0, completedCount: 0 };
        }

        monthlyData[completionMonth][caseType].completedCount += 1;
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        const result: Record<string, number | string> = {
          name: monthName,
          _monthKey: monthKey,
        };

        CASE_TYPE_ORDER.forEach((caseType) => {
          const caseTypeData = data[caseType];
          if (caseTypeData) {
            result[`${caseType}_新規案件数`] = caseTypeData.newCount;
            result[`${caseType}_完了案件数`] = caseTypeData.completedCount;
          } else {
            result[`${caseType}_新規案件数`] = 0;
            result[`${caseType}_完了案件数`] = 0;
          }
        });

        return result;
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [workloadDateRange, workloadSelectedMembers, assignments, localizedCaseData, locale, expandUserGroups]);

  // WorkloadTab用: 案件タイプ別のマージデータ
  const workloadCaseCountByCaseTypeMergedPerformanceData = useMemo(() => {
    const merged: Array<Record<string, number | string>> = [];

    const generateDummyValue = (currentValue: number): number => {
      if (currentValue === 0) return 0;
      const min = currentValue * 0.8;
      const max = currentValue * 1.2;
      const randomValue = Math.random() * (max - min) + min;
      return Math.round(randomValue);
    };

    const previousYearMap = new Map(
      workloadCaseCountByCaseTypePreviousYearPerformanceData.map((item) => [item.name, item]),
    );

    workloadCaseCountByCaseTypeOverallPerformanceData.forEach((current) => {
      const previousRaw = previousYearMap.get(current.name as string);

      const previous: Record<string, number | string> = {
        name: current.name,
        _monthKey: current._monthKey,
      };

      CASE_TYPE_ORDER.forEach((caseType) => {
        const currentKey = `${caseType}_新規案件数` as keyof typeof current;
        const currentCompletedKey = `${caseType}_完了案件数` as keyof typeof current;
        const previousNewKey = `${caseType}_新規案件数_昨年` as keyof typeof previousRaw;
        const previousCompletedKey = `${caseType}_完了案件数_昨年` as keyof typeof previousRaw;

        if (previousRaw && previousRaw[previousNewKey] !== undefined) {
          previous[previousNewKey] = previousRaw[previousNewKey];
          previous[previousCompletedKey] = previousRaw[previousCompletedKey];
        } else {
          const currentNewValue = (current[currentKey] as number) || 0;
          const currentCompletedValue = (current[currentCompletedKey] as number) || 0;
          previous[previousNewKey] = generateDummyValue(currentNewValue);
          previous[previousCompletedKey] = generateDummyValue(currentCompletedValue);
        }
      });

      merged.push({ ...current, ...previous });
    });

    workloadCaseCountByCaseTypePreviousYearPerformanceData.forEach((previous) => {
      const exists = workloadCaseCountByCaseTypeOverallPerformanceData.some(
        (current) => current.name === previous.name,
      );
      if (!exists) {
        const mergedItem: Record<string, number | string> = {
          name: previous.name,
          _monthKey: previous._monthKey, // _monthKeyを保持
        };

        CASE_TYPE_ORDER.forEach((caseType) => {
          const newKey = `${caseType}_新規案件数` as keyof typeof previous;
          const completedKey = `${caseType}_完了案件数` as keyof typeof previous;
          const previousNewKey = `${caseType}_新規案件数_昨年` as keyof typeof previous;
          const previousCompletedKey = `${caseType}_完了案件数_昨年` as keyof typeof previous;

          mergedItem[newKey] = 0;
          mergedItem[completedKey] = 0;
          mergedItem[previousNewKey] = previous[previousNewKey] || 0;
          mergedItem[previousCompletedKey] = previous[previousCompletedKey] || 0;
        });

        merged.push(mergedItem);
      }
    });

    // _monthKeyを使ってソート（日本語と英語で同じ順番になる）
    return merged.sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [workloadCaseCountByCaseTypeOverallPerformanceData, workloadCaseCountByCaseTypePreviousYearPerformanceData]);

  // WorkloadTab用: すべての期間用のデータ集計（案件タイプ別ビュー）
  const workloadCaseCountAllPeriodByCaseTypeData = useMemo(() => {
    const totals: Record<
      CaseType,
      {
        新規案件数: number;
        完了案件数: number;
      }
    > = {
      契約書審査: { 新規案件数: 0, 完了案件数: 0 },
      契約書起案: { 新規案件数: 0, 完了案件数: 0 },
      法務相談: { 新規案件数: 0, 完了案件数: 0 },
      その他: { 新規案件数: 0, 完了案件数: 0 },
    };

    workloadCaseCountByCaseTypeOverallPerformanceData.forEach((month) => {
      CASE_TYPE_ORDER.forEach((caseType) => {
        totals[caseType].新規案件数 += (month[`${caseType}_新規案件数`] as number) || 0;
        totals[caseType].完了案件数 += (month[`${caseType}_完了案件数`] as number) || 0;
      });
    });

    return totals;
  }, [workloadCaseCountByCaseTypeOverallPerformanceData]);

  // WorkloadTab用: すべての期間用の昨年データ集計（案件タイプ別ビュー）
  const workloadCaseCountAllPeriodByCaseTypePreviousYearData = useMemo(() => {
    const totals: Record<
      CaseType,
      {
        新規案件数: number;
        完了案件数: number;
      }
    > = {
      契約書審査: { 新規案件数: 0, 完了案件数: 0 },
      契約書起案: { 新規案件数: 0, 完了案件数: 0 },
      法務相談: { 新規案件数: 0, 完了案件数: 0 },
      その他: { 新規案件数: 0, 完了案件数: 0 },
    };

    workloadCaseCountByCaseTypePreviousYearPerformanceData.forEach((month) => {
      CASE_TYPE_ORDER.forEach((caseType) => {
        totals[caseType].新規案件数 += (month[`${caseType}_新規案件数_昨年`] as number) || 0;
        totals[caseType].完了案件数 += (month[`${caseType}_完了案件数_昨年`] as number) || 0;
      });
    });

    return totals;
  }, [workloadCaseCountByCaseTypePreviousYearPerformanceData]);

  // 案件タイプ別の昨年データ計算
  const caseCountByCaseTypePreviousYearPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      Record<
        CaseType,
        {
          newCount: number;
          completedCount: number;
        }
      >
    > = {};

    // 昨年の期間を計算
    const previousYearStart = performanceDateRange.start
      ? new Date(
          performanceDateRange.start.getFullYear() - 1,
          performanceDateRange.start.getMonth(),
          performanceDateRange.start.getDate(),
        )
      : null;
    const previousYearEnd = performanceDateRange.end
      ? new Date(
          performanceDateRange.end.getFullYear() - 1,
          performanceDateRange.end.getMonth(),
          performanceDateRange.end.getDate(),
        )
      : null;

    // メンバーフィルタを適用
    let casesToConsider = localizedCaseData;
    if (performanceSelectedMembers.length > 0) {
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return performanceSelectedMembers.includes(assignee);
      });
    }

    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    casesToConsider.forEach((c) => {
      const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;

      // 新規案件数: 昨年の期間で集計
      const createdAt = new Date(c.startDate);
      const previousYearCreatedAt = new Date(createdAt.getFullYear() - 1, createdAt.getMonth(), createdAt.getDate());
      if (previousYearStart || previousYearEnd) {
        const monthStart = new Date(previousYearCreatedAt.getFullYear(), previousYearCreatedAt.getMonth(), 1);
        const rangeStart = previousYearStart
          ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
          : null;
        const rangeEnd = previousYearEnd
          ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const startMonth = `${previousYearCreatedAt.getFullYear()}-${String(previousYearCreatedAt.getMonth() + 1).padStart(2, "0")}`;
          if (!monthlyData[startMonth]) {
            monthlyData[startMonth] = {
              契約書審査: { newCount: 0, completedCount: 0 },
              契約書起案: { newCount: 0, completedCount: 0 },
              法務相談: { newCount: 0, completedCount: 0 },
              その他: { newCount: 0, completedCount: 0 },
            };
          }
          if (!monthlyData[startMonth][caseType]) {
            monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
          }
          monthlyData[startMonth][caseType].newCount += 1;
        }
      } else {
        const startMonth = `${previousYearCreatedAt.getFullYear()}-${String(previousYearCreatedAt.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyData[startMonth]) {
          monthlyData[startMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[startMonth][caseType]) {
          monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
        }
        monthlyData[startMonth][caseType].newCount += 1;
      }

      // 完了案件数: 昨年の期間で集計
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const previousYearCompletionDate = new Date(
          completionDate.getFullYear() - 1,
          completionDate.getMonth(),
          completionDate.getDate(),
        );
        const completionMonth = `${previousYearCompletionDate.getFullYear()}-${String(previousYearCompletionDate.getMonth() + 1).padStart(2, "0")}`;

        if (previousYearStart || previousYearEnd) {
          const monthStart = new Date(
            previousYearCompletionDate.getFullYear(),
            previousYearCompletionDate.getMonth(),
            1,
          );
          const rangeStart = previousYearStart
            ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
            : null;
          const rangeEnd = previousYearEnd
            ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[completionMonth][caseType]) {
          monthlyData[completionMonth][caseType] = { newCount: 0, completedCount: 0 };
        }

        monthlyData[completionMonth][caseType].completedCount += 1;
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        const result: Record<string, number | string> = {
          name: monthName,
          _monthKey: monthKey,
        };

        CASE_TYPE_ORDER.forEach((caseType) => {
          const caseTypeData = data[caseType];
          if (caseTypeData) {
            result[`${caseType}_新規案件数_昨年`] = caseTypeData.newCount;
            result[`${caseType}_完了案件数_昨年`] = caseTypeData.completedCount;
          } else {
            result[`${caseType}_新規案件数_昨年`] = 0;
            result[`${caseType}_完了案件数_昨年`] = 0;
          }
        });

        return result;
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [performanceDateRange, performanceSelectedMembers, assignments, localizedCaseData, locale]);

  // 案件タイプ別のマージデータ
  const caseCountByCaseTypeMergedPerformanceData = useMemo(() => {
    const merged: Array<Record<string, number | string>> = [];

    const generateDummyValue = (currentValue: number): number => {
      if (currentValue === 0) return 0;
      const min = currentValue * 0.8;
      const max = currentValue * 1.2;
      const randomValue = Math.random() * (max - min) + min;
      return Math.round(randomValue);
    };

    const previousYearMap = new Map(caseCountByCaseTypePreviousYearPerformanceData.map((item) => [item.name, item]));

    caseCountByCaseTypeOverallPerformanceData.forEach((current) => {
      const previousRaw = previousYearMap.get(current.name as string);

      const previous: Record<string, number | string> = {
        name: current.name,
      };

      if (previousRaw) {
        CASE_TYPE_ORDER.forEach((caseType) => {
          const currentNew = (current[`${caseType}_新規案件数`] as number) || 0;
          const currentCompleted = (current[`${caseType}_完了案件数`] as number) || 0;
          const previousNew = (previousRaw[`${caseType}_新規案件数_昨年`] as number) || 0;
          const previousCompleted = (previousRaw[`${caseType}_完了案件数_昨年`] as number) || 0;

          if (previousNew > 0 || previousCompleted > 0 || currentNew > 0 || currentCompleted > 0) {
            previous[`${caseType}_新規案件数_昨年`] = previousNew;
            previous[`${caseType}_完了案件数_昨年`] = previousCompleted;
          } else {
            previous[`${caseType}_新規案件数_昨年`] = generateDummyValue(currentNew);
            previous[`${caseType}_完了案件数_昨年`] = generateDummyValue(currentCompleted);
          }
        });
      } else {
        CASE_TYPE_ORDER.forEach((caseType) => {
          const currentNew = (current[`${caseType}_新規案件数`] as number) || 0;
          const currentCompleted = (current[`${caseType}_完了案件数`] as number) || 0;
          previous[`${caseType}_新規案件数_昨年`] = generateDummyValue(currentNew);
          previous[`${caseType}_完了案件数_昨年`] = generateDummyValue(currentCompleted);
        });
      }

      const mergedItem: Record<string, number | string> = {
        ...current,
        _monthKey: current._monthKey, // _monthKeyを保持
      };

      CASE_TYPE_ORDER.forEach((caseType) => {
        mergedItem[`${caseType}_新規案件数_昨年`] = previous[`${caseType}_新規案件数_昨年`];
        mergedItem[`${caseType}_完了案件数_昨年`] = previous[`${caseType}_完了案件数_昨年`];
      });

      merged.push(mergedItem);
    });

    caseCountByCaseTypePreviousYearPerformanceData.forEach((previous) => {
      const exists = caseCountByCaseTypeOverallPerformanceData.some((current) => current.name === previous.name);
      if (!exists) {
        const mergedItem: Record<string, number | string> = {
          name: previous.name,
          _monthKey: previous._monthKey, // _monthKeyを保持
        };

        CASE_TYPE_ORDER.forEach((caseType) => {
          mergedItem[`${caseType}_新規案件数`] = 0;
          mergedItem[`${caseType}_完了案件数`] = 0;
          mergedItem[`${caseType}_新規案件数_昨年`] = previous[`${caseType}_新規案件数_昨年`] || 0;
          mergedItem[`${caseType}_完了案件数_昨年`] = previous[`${caseType}_完了案件数_昨年`] || 0;
        });

        merged.push(mergedItem);
      }
    });

    // _monthKeyを使ってソート（日本語と英語で同じ順番になる）
    return merged.sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [caseCountByCaseTypeOverallPerformanceData, caseCountByCaseTypePreviousYearPerformanceData]);

  // すべての期間用のデータ集計（案件タイプ別ビュー）
  const caseCountAllPeriodByCaseTypeData = useMemo(() => {
    const totals: Record<
      CaseType,
      {
        新規案件数: number;
        完了案件数: number;
      }
    > = {
      契約書審査: { 新規案件数: 0, 完了案件数: 0 },
      契約書起案: { 新規案件数: 0, 完了案件数: 0 },
      法務相談: { 新規案件数: 0, 完了案件数: 0 },
      その他: { 新規案件数: 0, 完了案件数: 0 },
    };

    caseCountByCaseTypeOverallPerformanceData.forEach((month) => {
      CASE_TYPE_ORDER.forEach((caseType) => {
        totals[caseType].新規案件数 += (month[`${caseType}_新規案件数`] as number) || 0;
        totals[caseType].完了案件数 += (month[`${caseType}_完了案件数`] as number) || 0;
      });
    });

    return totals;
  }, [caseCountByCaseTypeOverallPerformanceData]);

  // すべての期間用の昨年データ集計（案件タイプ別ビュー）
  const caseCountAllPeriodByCaseTypePreviousYearData = useMemo(() => {
    const totals: Record<
      CaseType,
      {
        新規案件数: number;
        完了案件数: number;
      }
    > = {
      契約書審査: { 新規案件数: 0, 完了案件数: 0 },
      契約書起案: { 新規案件数: 0, 完了案件数: 0 },
      法務相談: { 新規案件数: 0, 完了案件数: 0 },
      その他: { 新規案件数: 0, 完了案件数: 0 },
    };

    caseCountByCaseTypePreviousYearPerformanceData.forEach((month) => {
      CASE_TYPE_ORDER.forEach((caseType) => {
        totals[caseType].新規案件数 += (month[`${caseType}_新規案件数_昨年`] as number) || 0;
        totals[caseType].完了案件数 += (month[`${caseType}_完了案件数_昨年`] as number) || 0;
      });
    });

    return totals;
  }, [caseCountByCaseTypePreviousYearPerformanceData]);

  // 2つ目の案件数カード用のデータ計算
  const caseCount2OverallPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      {
        newCount: number;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimes: number[];
        firstReplyTimes: number[];
      }
    > = {};

    // 案件タイプフィルタを適用
    let casesToConsider =
      caseCount2CaseTypeFilter === "すべて" || caseCount2CaseTypeFilter === "All"
        ? localizedCaseData
        : localizedCaseData.filter((c) => c.caseType === caseCount2CaseTypeFilter);

    // メンバーフィルタを適用
    if (performanceSelectedMembers.length > 0) {
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return performanceSelectedMembers.includes(assignee);
      });
    }

    casesToConsider.forEach((c) => {
      // 新規案件数: createdAt（案件作成日時）の月で集計
      const createdAt = new Date(c.startDate);
      if (performanceDateRange.start || performanceDateRange.end) {
        const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
        const rangeStart = performanceDateRange.start
          ? new Date(performanceDateRange.start.getFullYear(), performanceDateRange.start.getMonth(), 1)
          : null;
        const rangeEnd = performanceDateRange.end
          ? new Date(performanceDateRange.end.getFullYear(), performanceDateRange.end.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const startMonth = c.startDate.substring(0, 7);
          if (!monthlyData[startMonth]) {
            monthlyData[startMonth] = {
              newCount: 0,
              onTimeCompletionCount: 0,
              overdueCompletionCount: 0,
              noDueDateCompletionCount: 0,
              leadTimes: [],
              firstReplyTimes: [],
            };
          }
          monthlyData[startMonth].newCount += 1;
        }
      } else {
        const startMonth = c.startDate.substring(0, 7);
        if (!monthlyData[startMonth]) {
          monthlyData[startMonth] = {
            newCount: 0,
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          };
        }
        monthlyData[startMonth].newCount += 1;
      }

      // 完了案件数: 完了日の月で集計
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const completionMonth = c.completionDate.substring(0, 7);

        if (performanceDateRange.start || performanceDateRange.end) {
          const monthStart = new Date(completionDate.getFullYear(), completionDate.getMonth(), 1);
          const rangeStart = performanceDateRange.start
            ? new Date(performanceDateRange.start.getFullYear(), performanceDateRange.start.getMonth(), 1)
            : null;
          const rangeEnd = performanceDateRange.end
            ? new Date(performanceDateRange.end.getFullYear(), performanceDateRange.end.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            newCount: 0,
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          };
        }

        if (!c.dueDate) {
          monthlyData[completionMonth].noDueDateCompletionCount += 1;
        } else {
          const isOverdue = new Date(c.completionDate) > new Date(c.dueDate);
          if (isOverdue) {
            monthlyData[completionMonth].overdueCompletionCount += 1;
          } else {
            monthlyData[completionMonth].onTimeCompletionCount += 1;
          }
        }

        monthlyData[completionMonth].leadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
        if (c.firstReplyDate) {
          monthlyData[completionMonth].firstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
        }
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        return {
          name: monthName,
          _monthKey: monthKey,
          新規案件数: data.newCount,
          onTimeCompletionCount: data.onTimeCompletionCount,
          overdueCompletionCount: data.overdueCompletionCount,
          noDueDateCompletionCount: data.noDueDateCompletionCount,
          リードタイム中央値: parseFloat(calculateMedian(data.leadTimes).toFixed(1)),
          初回返信速度中央値: parseFloat(calculateMedian(data.firstReplyTimes).toFixed(1)),
        };
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [
    caseCount2CaseTypeFilter,
    performanceDateRange,
    performanceSelectedMembers,
    assignments,
    localizedCaseData,
    locale,
  ]);

  // WorkloadTab用: 2つ目の案件数カード用のデータ計算
  const workloadCaseCount2OverallPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      {
        newCount: number;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimes: number[];
        firstReplyTimes: number[];
      }
    > = {};

    // 案件タイプフィルタを適用
    let casesToConsider =
      caseCount2CaseTypeFilter === "すべて" || caseCount2CaseTypeFilter === "All"
        ? localizedCaseData
        : localizedCaseData.filter((c) => c.caseType === caseCount2CaseTypeFilter);

    // メンバーフィルタを適用
    if (workloadSelectedMembers.length > 0) {
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return workloadSelectedMembers.includes(assignee);
      });
    }

    casesToConsider.forEach((c) => {
      // 新規案件数: createdAt（案件作成日時）の月で集計
      const createdAt = new Date(c.startDate);
      if (workloadDateRange.start || workloadDateRange.end) {
        const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
        const rangeStart = workloadDateRange.start
          ? new Date(workloadDateRange.start.getFullYear(), workloadDateRange.start.getMonth(), 1)
          : null;
        const rangeEnd = workloadDateRange.end
          ? new Date(workloadDateRange.end.getFullYear(), workloadDateRange.end.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const startMonth = c.startDate.substring(0, 7);
          if (!monthlyData[startMonth]) {
            monthlyData[startMonth] = {
              newCount: 0,
              onTimeCompletionCount: 0,
              overdueCompletionCount: 0,
              noDueDateCompletionCount: 0,
              leadTimes: [],
              firstReplyTimes: [],
            };
          }
          monthlyData[startMonth].newCount += 1;
        }
      } else {
        const startMonth = c.startDate.substring(0, 7);
        if (!monthlyData[startMonth]) {
          monthlyData[startMonth] = {
            newCount: 0,
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          };
        }
        monthlyData[startMonth].newCount += 1;
      }

      // 完了案件数: 完了日の月で集計
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const completionMonth = c.completionDate.substring(0, 7);

        if (workloadDateRange.start || workloadDateRange.end) {
          const monthStart = new Date(completionDate.getFullYear(), completionDate.getMonth(), 1);
          const rangeStart = workloadDateRange.start
            ? new Date(workloadDateRange.start.getFullYear(), workloadDateRange.start.getMonth(), 1)
            : null;
          const rangeEnd = workloadDateRange.end
            ? new Date(workloadDateRange.end.getFullYear(), workloadDateRange.end.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            newCount: 0,
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          };
        }

        if (!c.dueDate) {
          monthlyData[completionMonth].noDueDateCompletionCount += 1;
        } else {
          const isOverdue = new Date(c.completionDate) > new Date(c.dueDate);
          if (isOverdue) {
            monthlyData[completionMonth].overdueCompletionCount += 1;
          } else {
            monthlyData[completionMonth].onTimeCompletionCount += 1;
          }
        }

        monthlyData[completionMonth].leadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
        if (c.firstReplyDate) {
          monthlyData[completionMonth].firstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
        }
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        return {
          name: monthName,
          _monthKey: monthKey,
          新規案件数: data.newCount,
          onTimeCompletionCount: data.onTimeCompletionCount,
          overdueCompletionCount: data.overdueCompletionCount,
          noDueDateCompletionCount: data.noDueDateCompletionCount,
          リードタイム中央値: parseFloat(calculateMedian(data.leadTimes).toFixed(1)),
          初回返信速度中央値: parseFloat(calculateMedian(data.firstReplyTimes).toFixed(1)),
        };
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [caseCount2CaseTypeFilter, workloadDateRange, workloadSelectedMembers, assignments, localizedCaseData, locale]);

  // WorkloadTab用: 2つ目の案件数カード用の昨年データ計算
  const workloadCaseCount2PreviousYearPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      {
        newCount: number;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimes: number[];
        firstReplyTimes: number[];
      }
    > = {};

    let casesToConsider =
      caseCount2CaseTypeFilter === "すべて" || caseCount2CaseTypeFilter === "All"
        ? localizedCaseData
        : localizedCaseData.filter((c) => c.caseType === caseCount2CaseTypeFilter);

    if (workloadSelectedMembers.length > 0) {
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return workloadSelectedMembers.includes(assignee);
      });
    }

    let previousYearStart: Date | null = null;
    let previousYearEnd: Date | null = null;
    if (workloadDateRange.start) {
      previousYearStart = new Date(workloadDateRange.start);
      previousYearStart.setFullYear(previousYearStart.getFullYear() - 1);
    }
    if (workloadDateRange.end) {
      previousYearEnd = new Date(workloadDateRange.end);
      previousYearEnd.setFullYear(previousYearEnd.getFullYear() - 1);
    }

    casesToConsider.forEach((c) => {
      const createdAt = new Date(c.startDate);
      if (previousYearStart || previousYearEnd) {
        const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
        const rangeStart = previousYearStart
          ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
          : null;
        const rangeEnd = previousYearEnd
          ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const previousYearMonth = c.startDate.substring(0, 7);
          const currentYearMonth = `${createdAt.getFullYear() + 1}-${previousYearMonth.substring(5)}`;
          const monthKey = currentYearMonth;

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              newCount: 0,
              onTimeCompletionCount: 0,
              overdueCompletionCount: 0,
              noDueDateCompletionCount: 0,
              leadTimes: [],
              firstReplyTimes: [],
            };
          }
          monthlyData[monthKey].newCount += 1;
        }
      } else {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        if (createdAt < oneYearAgo) {
          const previousYearMonth = c.startDate.substring(0, 7);
          const currentYearMonth = `${createdAt.getFullYear() + 1}-${previousYearMonth.substring(5)}`;
          const monthKey = currentYearMonth;

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              newCount: 0,
              onTimeCompletionCount: 0,
              overdueCompletionCount: 0,
              noDueDateCompletionCount: 0,
              leadTimes: [],
              firstReplyTimes: [],
            };
          }
          monthlyData[monthKey].newCount += 1;
        }
      }

      // 完了案件数: 昨年の期間で集計
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const previousYearCompletionDate = new Date(
          completionDate.getFullYear() - 1,
          completionDate.getMonth(),
          completionDate.getDate(),
        );
        const previousYearMonth = c.completionDate.substring(0, 7);
        const currentYearMonth = `${completionDate.getFullYear() + 1}-${previousYearMonth.substring(5)}`;
        const monthKey = currentYearMonth;

        if (previousYearStart || previousYearEnd) {
          const monthStart = new Date(
            previousYearCompletionDate.getFullYear(),
            previousYearCompletionDate.getMonth(),
            1,
          );
          const rangeStart = previousYearStart
            ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
            : null;
          const rangeEnd = previousYearEnd
            ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            newCount: 0,
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          };
        }

        if (!c.dueDate) {
          monthlyData[monthKey].noDueDateCompletionCount += 1;
        } else {
          const previousYearDueDate = new Date(c.dueDate);
          previousYearDueDate.setFullYear(previousYearDueDate.getFullYear() - 1);
          const isOverdue = previousYearCompletionDate > previousYearDueDate;
          if (isOverdue) {
            monthlyData[monthKey].overdueCompletionCount += 1;
          } else {
            monthlyData[monthKey].onTimeCompletionCount += 1;
          }
        }

        monthlyData[monthKey].leadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
        if (c.firstReplyDate) {
          monthlyData[monthKey].firstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
        }
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        return {
          name: monthName,
          _monthKey: monthKey,
          新規案件数: data.newCount,
          onTimeCompletionCount: data.onTimeCompletionCount,
          overdueCompletionCount: data.overdueCompletionCount,
          noDueDateCompletionCount: data.noDueDateCompletionCount,
          リードタイム中央値: parseFloat(calculateMedian(data.leadTimes).toFixed(1)),
          初回返信速度中央値: parseFloat(calculateMedian(data.firstReplyTimes).toFixed(1)),
        };
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [caseCount2CaseTypeFilter, workloadDateRange, workloadSelectedMembers, assignments, localizedCaseData, locale]);

  // 2つ目の案件数カード用の昨年データ計算
  const caseCount2PreviousYearPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      {
        newCount: number;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimes: number[];
        firstReplyTimes: number[];
      }
    > = {};

    let casesToConsider =
      caseCount2CaseTypeFilter === "すべて" || caseCount2CaseTypeFilter === "All"
        ? localizedCaseData
        : localizedCaseData.filter((c) => c.caseType === caseCount2CaseTypeFilter);

    if (performanceSelectedMembers.length > 0) {
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return performanceSelectedMembers.includes(assignee);
      });
    }

    let previousYearStart: Date | null = null;
    let previousYearEnd: Date | null = null;
    if (performanceDateRange.start) {
      previousYearStart = new Date(performanceDateRange.start);
      previousYearStart.setFullYear(previousYearStart.getFullYear() - 1);
    }
    if (performanceDateRange.end) {
      previousYearEnd = new Date(performanceDateRange.end);
      previousYearEnd.setFullYear(previousYearEnd.getFullYear() - 1);
    }

    casesToConsider.forEach((c) => {
      const createdAt = new Date(c.startDate);
      if (previousYearStart || previousYearEnd) {
        const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
        const rangeStart = previousYearStart
          ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
          : null;
        const rangeEnd = previousYearEnd
          ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const previousYearMonth = c.startDate.substring(0, 7);
          const currentYearMonth = `${createdAt.getFullYear() + 1}-${previousYearMonth.substring(5)}`;
          const monthKey = currentYearMonth;

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              newCount: 0,
              onTimeCompletionCount: 0,
              overdueCompletionCount: 0,
              noDueDateCompletionCount: 0,
              leadTimes: [],
              firstReplyTimes: [],
            };
          }
          monthlyData[monthKey].newCount += 1;
        }
      } else {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        if (createdAt < oneYearAgo) {
          const previousYearMonth = c.startDate.substring(0, 7);
          const currentYearMonth = `${createdAt.getFullYear() + 1}-${previousYearMonth.substring(5)}`;
          const monthKey = currentYearMonth;

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              newCount: 0,
              onTimeCompletionCount: 0,
              overdueCompletionCount: 0,
              noDueDateCompletionCount: 0,
              leadTimes: [],
              firstReplyTimes: [],
            };
          }
          monthlyData[monthKey].newCount += 1;
        }
      }

      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const previousYearCompletionMonth = c.completionDate.substring(0, 7);
        const currentYearCompletionMonth = `${completionDate.getFullYear() + 1}-${previousYearCompletionMonth.substring(5)}`;
        const completionMonthKey = currentYearCompletionMonth;

        if (previousYearStart || previousYearEnd) {
          const monthStart = new Date(completionDate.getFullYear(), completionDate.getMonth(), 1);
          const rangeStart = previousYearStart
            ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
            : null;
          const rangeEnd = previousYearEnd
            ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        } else {
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          if (completionDate >= oneYearAgo) return;
        }

        if (!monthlyData[completionMonthKey]) {
          monthlyData[completionMonthKey] = {
            newCount: 0,
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          };
        }

        if (!c.dueDate) {
          monthlyData[completionMonthKey].noDueDateCompletionCount += 1;
        } else {
          const isOverdue = new Date(c.completionDate) > new Date(c.dueDate);
          if (isOverdue) {
            monthlyData[completionMonthKey].overdueCompletionCount += 1;
          } else {
            monthlyData[completionMonthKey].onTimeCompletionCount += 1;
          }
        }

        monthlyData[completionMonthKey].leadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
        if (c.firstReplyDate) {
          monthlyData[completionMonthKey].firstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
        }
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        return {
          name: monthName,
          _monthKey: monthKey,
          新規案件数: data.newCount,
          onTimeCompletionCount: data.onTimeCompletionCount,
          overdueCompletionCount: data.overdueCompletionCount,
          noDueDateCompletionCount: data.noDueDateCompletionCount,
          リードタイム中央値: parseFloat(calculateMedian(data.leadTimes).toFixed(1)),
          初回返信速度中央値: parseFloat(calculateMedian(data.firstReplyTimes).toFixed(1)),
        };
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [
    caseCount2CaseTypeFilter,
    performanceDateRange,
    performanceSelectedMembers,
    assignments,
    localizedCaseData,
    locale,
  ]);

  // 2つ目の案件数カード用のマージデータ
  const caseCount2MergedPerformanceData = useMemo(() => {
    const merged: Array<{
      name: string;
      _monthKey: string;
      新規案件数: number;
      新規案件数_昨年: number;
      onTimeCompletionCount: number;
      onTimeCompletionCount_昨年: number;
      overdueCompletionCount: number;
      overdueCompletionCount_昨年: number;
      noDueDateCompletionCount: number;
      noDueDateCompletionCount_昨年: number;
      リードタイム中央値: number;
      リードタイム中央値_昨年: number;
      初回返信速度中央値: number;
      初回返信速度中央値_昨年: number;
    }> = [];

    const generateDummyValue = (currentValue: number, isInteger: boolean): number => {
      if (currentValue === 0) return 0;
      const min = currentValue * 0.8;
      const max = currentValue * 1.2;
      const randomValue = Math.random() * (max - min) + min;
      if (isInteger) {
        return Math.round(randomValue);
      }
      return parseFloat(randomValue.toFixed(1));
    };

    const previousYearMap = new Map(caseCount2PreviousYearPerformanceData.map((item) => [item.name, item]));

    caseCount2OverallPerformanceData.forEach((current) => {
      const previousRaw = previousYearMap.get(current.name);

      const previous =
        previousRaw &&
        (previousRaw.新規案件数 > 0 ||
          previousRaw.onTimeCompletionCount > 0 ||
          previousRaw.overdueCompletionCount > 0 ||
          previousRaw.noDueDateCompletionCount > 0 ||
          previousRaw.リードタイム中央値 > 0 ||
          previousRaw.初回返信速度中央値 > 0)
          ? previousRaw
          : {
              name: current.name,
              新規案件数: generateDummyValue(current.新規案件数, true),
              onTimeCompletionCount: generateDummyValue(current.onTimeCompletionCount, true),
              overdueCompletionCount: generateDummyValue(current.overdueCompletionCount, true),
              noDueDateCompletionCount: generateDummyValue(current.noDueDateCompletionCount, true),
              リードタイム中央値: generateDummyValue(current.リードタイム中央値, false),
              初回返信速度中央値: generateDummyValue(current.初回返信速度中央値, false),
            };

      merged.push({
        name: current.name,
        _monthKey: (current as { _monthKey?: string })._monthKey || "",
        新規案件数: current.新規案件数,
        新規案件数_昨年: previous.新規案件数,
        onTimeCompletionCount: current.onTimeCompletionCount,
        onTimeCompletionCount_昨年: previous.onTimeCompletionCount,
        overdueCompletionCount: current.overdueCompletionCount,
        overdueCompletionCount_昨年: previous.overdueCompletionCount,
        noDueDateCompletionCount: current.noDueDateCompletionCount,
        noDueDateCompletionCount_昨年: previous.noDueDateCompletionCount,
        リードタイム中央値: current.リードタイム中央値,
        リードタイム中央値_昨年: previous.リードタイム中央値,
        初回返信速度中央値: current.初回返信速度中央値,
        初回返信速度中央値_昨年: previous.初回返信速度中央値,
      });
    });

    caseCount2PreviousYearPerformanceData.forEach((previous) => {
      const exists = caseCount2OverallPerformanceData.some((current) => current.name === previous.name);
      if (!exists) {
        merged.push({
          name: previous.name,
          _monthKey: (previous as { _monthKey?: string })._monthKey || "",
          新規案件数: 0,
          新規案件数_昨年: previous.新規案件数,
          onTimeCompletionCount: 0,
          onTimeCompletionCount_昨年: previous.onTimeCompletionCount,
          overdueCompletionCount: 0,
          overdueCompletionCount_昨年: previous.overdueCompletionCount,
          noDueDateCompletionCount: 0,
          noDueDateCompletionCount_昨年: previous.noDueDateCompletionCount,
          リードタイム中央値: 0,
          リードタイム中央値_昨年: previous.リードタイム中央値,
          初回返信速度中央値: 0,
          初回返信速度中央値_昨年: previous.初回返信速度中央値,
        });
      }
    });

    return merged.sort((a, b) => a._monthKey.localeCompare(b._monthKey));
  }, [caseCount2OverallPerformanceData, caseCount2PreviousYearPerformanceData]);

  // WorkloadTab用: 2つ目の案件数カード用のマージデータ
  const workloadCaseCount2MergedPerformanceData = useMemo(() => {
    const merged: Array<{
      name: string;
      _monthKey: string;
      新規案件数: number;
      新規案件数_昨年: number;
      onTimeCompletionCount: number;
      onTimeCompletionCount_昨年: number;
      overdueCompletionCount: number;
      overdueCompletionCount_昨年: number;
      noDueDateCompletionCount: number;
      noDueDateCompletionCount_昨年: number;
      リードタイム中央値: number;
      リードタイム中央値_昨年: number;
      初回返信速度中央値: number;
      初回返信速度中央値_昨年: number;
    }> = [];

    const generateDummyValue = (currentValue: number, isInteger: boolean): number => {
      if (currentValue === 0) return 0;
      const min = currentValue * 0.8;
      const max = currentValue * 1.2;
      const randomValue = Math.random() * (max - min) + min;
      if (isInteger) {
        return Math.round(randomValue);
      }
      return parseFloat(randomValue.toFixed(1));
    };

    const previousYearMap = new Map(workloadCaseCount2PreviousYearPerformanceData.map((item) => [item.name, item]));

    workloadCaseCount2OverallPerformanceData.forEach((current) => {
      const previousRaw = previousYearMap.get(current.name);

      const previous =
        previousRaw &&
        (previousRaw.新規案件数 > 0 ||
          previousRaw.onTimeCompletionCount > 0 ||
          previousRaw.overdueCompletionCount > 0 ||
          previousRaw.noDueDateCompletionCount > 0 ||
          previousRaw.リードタイム中央値 > 0 ||
          previousRaw.初回返信速度中央値 > 0)
          ? previousRaw
          : {
              name: current.name,
              新規案件数: generateDummyValue(current.新規案件数, true),
              onTimeCompletionCount: generateDummyValue(current.onTimeCompletionCount, true),
              overdueCompletionCount: generateDummyValue(current.overdueCompletionCount, true),
              noDueDateCompletionCount: generateDummyValue(current.noDueDateCompletionCount, true),
              リードタイム中央値: generateDummyValue(current.リードタイム中央値, false),
              初回返信速度中央値: generateDummyValue(current.初回返信速度中央値, false),
            };

      merged.push({
        name: current.name,
        _monthKey: (current as { _monthKey?: string })._monthKey || "",
        新規案件数: current.新規案件数,
        新規案件数_昨年: previous.新規案件数,
        onTimeCompletionCount: current.onTimeCompletionCount,
        onTimeCompletionCount_昨年: previous.onTimeCompletionCount,
        overdueCompletionCount: current.overdueCompletionCount,
        overdueCompletionCount_昨年: previous.overdueCompletionCount,
        noDueDateCompletionCount: current.noDueDateCompletionCount,
        noDueDateCompletionCount_昨年: previous.noDueDateCompletionCount,
        リードタイム中央値: current.リードタイム中央値,
        リードタイム中央値_昨年: previous.リードタイム中央値,
        初回返信速度中央値: current.初回返信速度中央値,
        初回返信速度中央値_昨年: previous.初回返信速度中央値,
      });
    });

    workloadCaseCount2PreviousYearPerformanceData.forEach((previous) => {
      const exists = workloadCaseCount2OverallPerformanceData.some((current) => current.name === previous.name);
      if (!exists) {
        merged.push({
          name: previous.name,
          _monthKey: (previous as { _monthKey?: string })._monthKey || "",
          新規案件数: 0,
          新規案件数_昨年: previous.新規案件数,
          onTimeCompletionCount: 0,
          onTimeCompletionCount_昨年: previous.onTimeCompletionCount,
          overdueCompletionCount: 0,
          overdueCompletionCount_昨年: previous.overdueCompletionCount,
          noDueDateCompletionCount: 0,
          noDueDateCompletionCount_昨年: previous.noDueDateCompletionCount,
          リードタイム中央値: 0,
          リードタイム中央値_昨年: previous.リードタイム中央値,
          初回返信速度中央値: 0,
          初回返信速度中央値_昨年: previous.初回返信速度中央値,
        });
      }
    });

    return merged.sort((a, b) => a._monthKey.localeCompare(b._monthKey));
  }, [workloadCaseCount2OverallPerformanceData, workloadCaseCount2PreviousYearPerformanceData]);

  // 2つ目の案件数カード用の案件タイプ別データ計算
  const caseCount2ByCaseTypeOverallPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      Record<
        CaseType,
        {
          newCount: number;
          completedCount: number;
        }
      >
    > = {};

    // メンバーフィルタを適用（案件タイプ別ビューでは案件タイプフィルタは適用しない）
    let casesToConsider = localizedCaseData;
    if (performanceSelectedMembers.length > 0) {
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return performanceSelectedMembers.includes(assignee);
      });
    }

    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    casesToConsider.forEach((c) => {
      const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;

      // 新規案件数: createdAt（案件作成日時）の月で集計
      const createdAt = new Date(c.startDate);
      if (performanceDateRange.start || performanceDateRange.end) {
        const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
        const rangeStart = performanceDateRange.start
          ? new Date(performanceDateRange.start.getFullYear(), performanceDateRange.start.getMonth(), 1)
          : null;
        const rangeEnd = performanceDateRange.end
          ? new Date(performanceDateRange.end.getFullYear(), performanceDateRange.end.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const startMonth = c.startDate.substring(0, 7);
          if (!monthlyData[startMonth]) {
            monthlyData[startMonth] = {
              契約書審査: { newCount: 0, completedCount: 0 },
              契約書起案: { newCount: 0, completedCount: 0 },
              法務相談: { newCount: 0, completedCount: 0 },
              その他: { newCount: 0, completedCount: 0 },
            };
          }
          if (!monthlyData[startMonth][caseType]) {
            monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
          }
          monthlyData[startMonth][caseType].newCount += 1;
        }
      } else {
        const startMonth = c.startDate.substring(0, 7);
        if (!monthlyData[startMonth]) {
          monthlyData[startMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[startMonth][caseType]) {
          monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
        }
        monthlyData[startMonth][caseType].newCount += 1;
      }

      // 完了案件数: 完了日の月で集計（納期別の分類なし、合計のみ）
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const completionMonth = c.completionDate.substring(0, 7);

        if (performanceDateRange.start || performanceDateRange.end) {
          const monthStart = new Date(completionDate.getFullYear(), completionDate.getMonth(), 1);
          const rangeStart = performanceDateRange.start
            ? new Date(performanceDateRange.start.getFullYear(), performanceDateRange.start.getMonth(), 1)
            : null;
          const rangeEnd = performanceDateRange.end
            ? new Date(performanceDateRange.end.getFullYear(), performanceDateRange.end.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[completionMonth][caseType]) {
          monthlyData[completionMonth][caseType] = { newCount: 0, completedCount: 0 };
        }

        monthlyData[completionMonth][caseType].completedCount += 1;
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        const result: Record<string, number | string> = {
          name: monthName,
          _monthKey: monthKey,
        };

        CASE_TYPE_ORDER.forEach((caseType) => {
          const caseTypeData = data[caseType];
          if (caseTypeData) {
            result[`${caseType}_新規案件数`] = caseTypeData.newCount;
            result[`${caseType}_完了案件数`] = caseTypeData.completedCount;
          } else {
            result[`${caseType}_新規案件数`] = 0;
            result[`${caseType}_完了案件数`] = 0;
          }
        });

        return result;
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [performanceDateRange, performanceSelectedMembers, assignments, localizedCaseData, locale]);

  // WorkloadTab用: 2つ目の案件数カード用の案件タイプ別データ計算
  const workloadCaseCount2ByCaseTypeOverallPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      Record<
        CaseType,
        {
          newCount: number;
          completedCount: number;
        }
      >
    > = {};

    // メンバーフィルタを適用（案件タイプ別ビューでは案件タイプフィルタは適用しない）
    let casesToConsider = localizedCaseData;
    if (workloadSelectedMembers.length > 0) {
      const expandedMembers = expandUserGroups(workloadSelectedMembers);
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return expandedMembers.includes(assignee);
      });
    }

    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    casesToConsider.forEach((c) => {
      const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;

      // 新規案件数: createdAt（案件作成日時）の月で集計
      const createdAt = new Date(c.startDate);
      if (workloadDateRange.start || workloadDateRange.end) {
        const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
        const rangeStart = workloadDateRange.start
          ? new Date(workloadDateRange.start.getFullYear(), workloadDateRange.start.getMonth(), 1)
          : null;
        const rangeEnd = workloadDateRange.end
          ? new Date(workloadDateRange.end.getFullYear(), workloadDateRange.end.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const startMonth = c.startDate.substring(0, 7);
          if (!monthlyData[startMonth]) {
            monthlyData[startMonth] = {
              契約書審査: { newCount: 0, completedCount: 0 },
              契約書起案: { newCount: 0, completedCount: 0 },
              法務相談: { newCount: 0, completedCount: 0 },
              その他: { newCount: 0, completedCount: 0 },
            };
          }
          if (!monthlyData[startMonth][caseType]) {
            monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
          }
          monthlyData[startMonth][caseType].newCount += 1;
        }
      } else {
        const startMonth = c.startDate.substring(0, 7);
        if (!monthlyData[startMonth]) {
          monthlyData[startMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[startMonth][caseType]) {
          monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
        }
        monthlyData[startMonth][caseType].newCount += 1;
      }

      // 完了案件数: 完了日の月で集計（納期別の分類なし、合計のみ）
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const completionMonth = c.completionDate.substring(0, 7);

        if (workloadDateRange.start || workloadDateRange.end) {
          const monthStart = new Date(completionDate.getFullYear(), completionDate.getMonth(), 1);
          const rangeStart = workloadDateRange.start
            ? new Date(workloadDateRange.start.getFullYear(), workloadDateRange.start.getMonth(), 1)
            : null;
          const rangeEnd = workloadDateRange.end
            ? new Date(workloadDateRange.end.getFullYear(), workloadDateRange.end.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[completionMonth][caseType]) {
          monthlyData[completionMonth][caseType] = { newCount: 0, completedCount: 0 };
        }

        monthlyData[completionMonth][caseType].completedCount += 1;
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        const result: Record<string, number | string> = {
          name: monthName,
          _monthKey: monthKey,
        };

        CASE_TYPE_ORDER.forEach((caseType) => {
          const caseTypeData = data[caseType];
          if (caseTypeData) {
            result[`${caseType}_新規案件数`] = caseTypeData.newCount;
            result[`${caseType}_完了案件数`] = caseTypeData.completedCount;
          } else {
            result[`${caseType}_新規案件数`] = 0;
            result[`${caseType}_完了案件数`] = 0;
          }
        });

        return result;
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [workloadDateRange, workloadSelectedMembers, assignments, localizedCaseData, locale, expandUserGroups]);

  // WorkloadTab用: 2つ目の案件数カード用の案件タイプ別昨年データ計算
  const workloadCaseCount2ByCaseTypePreviousYearPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      Record<
        CaseType,
        {
          newCount: number;
          completedCount: number;
        }
      >
    > = {};

    // 昨年の期間を計算
    const previousYearStart = workloadDateRange.start
      ? new Date(
          workloadDateRange.start.getFullYear() - 1,
          workloadDateRange.start.getMonth(),
          workloadDateRange.start.getDate(),
        )
      : null;
    const previousYearEnd = workloadDateRange.end
      ? new Date(
          workloadDateRange.end.getFullYear() - 1,
          workloadDateRange.end.getMonth(),
          workloadDateRange.end.getDate(),
        )
      : null;

    // メンバーフィルタを適用
    let casesToConsider = localizedCaseData;
    if (workloadSelectedMembers.length > 0) {
      const expandedMembers = expandUserGroups(workloadSelectedMembers);
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return expandedMembers.includes(assignee);
      });
    }

    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    casesToConsider.forEach((c) => {
      const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;

      // 新規案件数: 昨年の期間で集計
      const createdAt = new Date(c.startDate);
      const previousYearCreatedAt = new Date(createdAt.getFullYear() - 1, createdAt.getMonth(), createdAt.getDate());
      if (previousYearStart || previousYearEnd) {
        const monthStart = new Date(previousYearCreatedAt.getFullYear(), previousYearCreatedAt.getMonth(), 1);
        const rangeStart = previousYearStart
          ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
          : null;
        const rangeEnd = previousYearEnd
          ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const startMonth = `${previousYearCreatedAt.getFullYear()}-${String(previousYearCreatedAt.getMonth() + 1).padStart(2, "0")}`;
          if (!monthlyData[startMonth]) {
            monthlyData[startMonth] = {
              契約書審査: { newCount: 0, completedCount: 0 },
              契約書起案: { newCount: 0, completedCount: 0 },
              法務相談: { newCount: 0, completedCount: 0 },
              その他: { newCount: 0, completedCount: 0 },
            };
          }
          if (!monthlyData[startMonth][caseType]) {
            monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
          }
          monthlyData[startMonth][caseType].newCount += 1;
        }
      } else {
        const startMonth = `${previousYearCreatedAt.getFullYear()}-${String(previousYearCreatedAt.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyData[startMonth]) {
          monthlyData[startMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[startMonth][caseType]) {
          monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
        }
        monthlyData[startMonth][caseType].newCount += 1;
      }

      // 完了案件数: 昨年の期間で集計
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const previousYearCompletionDate = new Date(
          completionDate.getFullYear() - 1,
          completionDate.getMonth(),
          completionDate.getDate(),
        );
        const completionMonth = `${previousYearCompletionDate.getFullYear()}-${String(previousYearCompletionDate.getMonth() + 1).padStart(2, "0")}`;

        if (previousYearStart || previousYearEnd) {
          const monthStart = new Date(
            previousYearCompletionDate.getFullYear(),
            previousYearCompletionDate.getMonth(),
            1,
          );
          const rangeStart = previousYearStart
            ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
            : null;
          const rangeEnd = previousYearEnd
            ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[completionMonth][caseType]) {
          monthlyData[completionMonth][caseType] = { newCount: 0, completedCount: 0 };
        }

        monthlyData[completionMonth][caseType].completedCount += 1;
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        const result: Record<string, number | string> = {
          name: monthName,
          _monthKey: monthKey,
        };

        CASE_TYPE_ORDER.forEach((caseType) => {
          const caseTypeData = data[caseType];
          if (caseTypeData) {
            result[`${caseType}_新規案件数_昨年`] = caseTypeData.newCount;
            result[`${caseType}_完了案件数_昨年`] = caseTypeData.completedCount;
          } else {
            result[`${caseType}_新規案件数_昨年`] = 0;
            result[`${caseType}_完了案件数_昨年`] = 0;
          }
        });

        return result;
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [workloadDateRange, workloadSelectedMembers, assignments, localizedCaseData, locale, expandUserGroups]);

  // 2つ目の案件数カード用の案件タイプ別昨年データ計算
  const caseCount2ByCaseTypePreviousYearPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      Record<
        CaseType,
        {
          newCount: number;
          completedCount: number;
        }
      >
    > = {};

    // 昨年の期間を計算
    const previousYearStart = performanceDateRange.start
      ? new Date(
          performanceDateRange.start.getFullYear() - 1,
          performanceDateRange.start.getMonth(),
          performanceDateRange.start.getDate(),
        )
      : null;
    const previousYearEnd = performanceDateRange.end
      ? new Date(
          performanceDateRange.end.getFullYear() - 1,
          performanceDateRange.end.getMonth(),
          performanceDateRange.end.getDate(),
        )
      : null;

    // メンバーフィルタを適用
    let casesToConsider = localizedCaseData;
    if (performanceSelectedMembers.length > 0) {
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return performanceSelectedMembers.includes(assignee);
      });
    }

    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    casesToConsider.forEach((c) => {
      const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;

      // 新規案件数: 昨年の期間で集計
      const createdAt = new Date(c.startDate);
      const previousYearCreatedAt = new Date(createdAt.getFullYear() - 1, createdAt.getMonth(), createdAt.getDate());
      if (previousYearStart || previousYearEnd) {
        const monthStart = new Date(previousYearCreatedAt.getFullYear(), previousYearCreatedAt.getMonth(), 1);
        const rangeStart = previousYearStart
          ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
          : null;
        const rangeEnd = previousYearEnd
          ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const startMonth = `${previousYearCreatedAt.getFullYear()}-${String(previousYearCreatedAt.getMonth() + 1).padStart(2, "0")}`;
          if (!monthlyData[startMonth]) {
            monthlyData[startMonth] = {
              契約書審査: { newCount: 0, completedCount: 0 },
              契約書起案: { newCount: 0, completedCount: 0 },
              法務相談: { newCount: 0, completedCount: 0 },
              その他: { newCount: 0, completedCount: 0 },
            };
          }
          if (!monthlyData[startMonth][caseType]) {
            monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
          }
          monthlyData[startMonth][caseType].newCount += 1;
        }
      } else {
        const startMonth = `${previousYearCreatedAt.getFullYear()}-${String(previousYearCreatedAt.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyData[startMonth]) {
          monthlyData[startMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[startMonth][caseType]) {
          monthlyData[startMonth][caseType] = { newCount: 0, completedCount: 0 };
        }
        monthlyData[startMonth][caseType].newCount += 1;
      }

      // 完了案件数: 昨年の期間で集計
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const previousYearCompletionDate = new Date(
          completionDate.getFullYear() - 1,
          completionDate.getMonth(),
          completionDate.getDate(),
        );
        const completionMonth = `${previousYearCompletionDate.getFullYear()}-${String(previousYearCompletionDate.getMonth() + 1).padStart(2, "0")}`;

        if (previousYearStart || previousYearEnd) {
          const monthStart = new Date(
            previousYearCompletionDate.getFullYear(),
            previousYearCompletionDate.getMonth(),
            1,
          );
          const rangeStart = previousYearStart
            ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
            : null;
          const rangeEnd = previousYearEnd
            ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            契約書審査: { newCount: 0, completedCount: 0 },
            契約書起案: { newCount: 0, completedCount: 0 },
            法務相談: { newCount: 0, completedCount: 0 },
            その他: { newCount: 0, completedCount: 0 },
          };
        }
        if (!monthlyData[completionMonth][caseType]) {
          monthlyData[completionMonth][caseType] = { newCount: 0, completedCount: 0 };
        }

        monthlyData[completionMonth][caseType].completedCount += 1;
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        const result: Record<string, number | string> = {
          name: monthName,
          _monthKey: monthKey,
        };

        CASE_TYPE_ORDER.forEach((caseType) => {
          const caseTypeData = data[caseType];
          if (caseTypeData) {
            result[`${caseType}_新規案件数_昨年`] = caseTypeData.newCount;
            result[`${caseType}_完了案件数_昨年`] = caseTypeData.completedCount;
          } else {
            result[`${caseType}_新規案件数_昨年`] = 0;
            result[`${caseType}_完了案件数_昨年`] = 0;
          }
        });

        return result;
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [performanceDateRange, performanceSelectedMembers, assignments, localizedCaseData, locale]);

  // 2つ目の案件数カード用の案件タイプ別マージデータ
  const caseCount2ByCaseTypeMergedPerformanceData = useMemo(() => {
    const merged: Array<Record<string, number | string>> = [];

    const generateDummyValue = (currentValue: number): number => {
      if (currentValue === 0) return 0;
      const min = currentValue * 0.8;
      const max = currentValue * 1.2;
      const randomValue = Math.random() * (max - min) + min;
      return Math.round(randomValue);
    };

    const previousYearMap = new Map(caseCount2ByCaseTypePreviousYearPerformanceData.map((item) => [item.name, item]));

    caseCount2ByCaseTypeOverallPerformanceData.forEach((current) => {
      const previousRaw = previousYearMap.get(current.name as string);

      const previous: Record<string, number | string> = {
        name: current.name,
      };

      if (previousRaw) {
        CASE_TYPE_ORDER.forEach((caseType) => {
          const currentNew = (current[`${caseType}_新規案件数`] as number) || 0;
          const currentCompleted = (current[`${caseType}_完了案件数`] as number) || 0;
          const previousNew = (previousRaw[`${caseType}_新規案件数_昨年`] as number) || 0;
          const previousCompleted = (previousRaw[`${caseType}_完了案件数_昨年`] as number) || 0;

          if (previousNew > 0 || previousCompleted > 0 || currentNew > 0 || currentCompleted > 0) {
            previous[`${caseType}_新規案件数_昨年`] = previousNew;
            previous[`${caseType}_完了案件数_昨年`] = previousCompleted;
          } else {
            previous[`${caseType}_新規案件数_昨年`] = generateDummyValue(currentNew);
            previous[`${caseType}_完了案件数_昨年`] = generateDummyValue(currentCompleted);
          }
        });
      } else {
        CASE_TYPE_ORDER.forEach((caseType) => {
          const currentNew = (current[`${caseType}_新規案件数`] as number) || 0;
          const currentCompleted = (current[`${caseType}_完了案件数`] as number) || 0;
          previous[`${caseType}_新規案件数_昨年`] = generateDummyValue(currentNew);
          previous[`${caseType}_完了案件数_昨年`] = generateDummyValue(currentCompleted);
        });
      }

      const mergedItem: Record<string, number | string> = {
        ...current,
      };

      CASE_TYPE_ORDER.forEach((caseType) => {
        mergedItem[`${caseType}_新規案件数_昨年`] = previous[`${caseType}_新規案件数_昨年`];
        mergedItem[`${caseType}_完了案件数_昨年`] = previous[`${caseType}_完了案件数_昨年`];
      });

      merged.push(mergedItem);
    });

    caseCount2ByCaseTypePreviousYearPerformanceData.forEach((previous) => {
      const exists = caseCount2ByCaseTypeOverallPerformanceData.some((current) => current.name === previous.name);
      if (!exists) {
        const mergedItem: Record<string, number | string> = {
          name: previous.name,
        };

        CASE_TYPE_ORDER.forEach((caseType) => {
          mergedItem[`${caseType}_新規案件数`] = 0;
          mergedItem[`${caseType}_完了案件数`] = 0;
          mergedItem[`${caseType}_新規案件数_昨年`] = previous[`${caseType}_新規案件数_昨年`] || 0;
          mergedItem[`${caseType}_完了案件数_昨年`] = previous[`${caseType}_完了案件数_昨年`] || 0;
        });

        merged.push(mergedItem);
      }
    });

    return merged.sort((a, b) => (a.name as string).localeCompare(b.name as string, undefined, { numeric: true }));
  }, [caseCount2ByCaseTypeOverallPerformanceData, caseCount2ByCaseTypePreviousYearPerformanceData]);

  // WorkloadTab用: 2つ目の案件数カード用の案件タイプ別マージデータ
  const workloadCaseCount2ByCaseTypeMergedPerformanceData = useMemo(() => {
    const merged: Array<Record<string, number | string>> = [];

    const generateDummyValue = (currentValue: number): number => {
      if (currentValue === 0) return 0;
      const min = currentValue * 0.8;
      const max = currentValue * 1.2;
      const randomValue = Math.random() * (max - min) + min;
      return Math.round(randomValue);
    };

    const previousYearMap = new Map(
      workloadCaseCount2ByCaseTypePreviousYearPerformanceData.map((item) => [item.name, item]),
    );

    workloadCaseCount2ByCaseTypeOverallPerformanceData.forEach((current) => {
      const previousRaw = previousYearMap.get(current.name as string);

      const previous: Record<string, number | string> = {
        name: current.name,
      };

      if (previousRaw) {
        CASE_TYPE_ORDER.forEach((caseType) => {
          const currentNew = (current[`${caseType}_新規案件数`] as number) || 0;
          const currentCompleted = (current[`${caseType}_完了案件数`] as number) || 0;
          const previousNew = (previousRaw[`${caseType}_新規案件数_昨年`] as number) || 0;
          const previousCompleted = (previousRaw[`${caseType}_完了案件数_昨年`] as number) || 0;

          if (previousNew > 0 || previousCompleted > 0 || currentNew > 0 || currentCompleted > 0) {
            previous[`${caseType}_新規案件数_昨年`] = previousNew;
            previous[`${caseType}_完了案件数_昨年`] = previousCompleted;
          } else {
            previous[`${caseType}_新規案件数_昨年`] = generateDummyValue(currentNew);
            previous[`${caseType}_完了案件数_昨年`] = generateDummyValue(currentCompleted);
          }
        });
      } else {
        CASE_TYPE_ORDER.forEach((caseType) => {
          const currentNew = (current[`${caseType}_新規案件数`] as number) || 0;
          const currentCompleted = (current[`${caseType}_完了案件数`] as number) || 0;
          previous[`${caseType}_新規案件数_昨年`] = generateDummyValue(currentNew);
          previous[`${caseType}_完了案件数_昨年`] = generateDummyValue(currentCompleted);
        });
      }

      const mergedItem: Record<string, number | string> = {
        ...current,
      };

      CASE_TYPE_ORDER.forEach((caseType) => {
        mergedItem[`${caseType}_新規案件数_昨年`] = previous[`${caseType}_新規案件数_昨年`];
        mergedItem[`${caseType}_完了案件数_昨年`] = previous[`${caseType}_完了案件数_昨年`];
      });

      merged.push(mergedItem);
    });

    workloadCaseCount2ByCaseTypePreviousYearPerformanceData.forEach((previous) => {
      const exists = workloadCaseCount2ByCaseTypeOverallPerformanceData.some(
        (current) => current.name === previous.name,
      );
      if (!exists) {
        const mergedItem: Record<string, number | string> = {
          name: previous.name,
        };

        CASE_TYPE_ORDER.forEach((caseType) => {
          mergedItem[`${caseType}_新規案件数`] = 0;
          mergedItem[`${caseType}_完了案件数`] = 0;
          mergedItem[`${caseType}_新規案件数_昨年`] = previous[`${caseType}_新規案件数_昨年`] || 0;
          mergedItem[`${caseType}_完了案件数_昨年`] = previous[`${caseType}_完了案件数_昨年`] || 0;
        });

        merged.push(mergedItem);
      }
    });

    return merged.sort((a, b) => (a.name as string).localeCompare(b.name as string, undefined, { numeric: true }));
  }, [workloadCaseCount2ByCaseTypeOverallPerformanceData, workloadCaseCount2ByCaseTypePreviousYearPerformanceData]);

  // 2つ目の案件数カード用のすべての期間用のデータ集計（納期別ビュー）
  const caseCount2AllPeriodData = useMemo(() => {
    const total = caseCount2OverallPerformanceData.reduce(
      (acc, month) => ({
        新規案件数: acc.新規案件数 + month.新規案件数,
        onTimeCompletionCount: acc.onTimeCompletionCount + month.onTimeCompletionCount,
        overdueCompletionCount: acc.overdueCompletionCount + month.overdueCompletionCount,
        noDueDateCompletionCount: acc.noDueDateCompletionCount + month.noDueDateCompletionCount,
      }),
      {
        新規案件数: 0,
        onTimeCompletionCount: 0,
        overdueCompletionCount: 0,
        noDueDateCompletionCount: 0,
      },
    );
    return total;
  }, [caseCount2OverallPerformanceData]);

  // 2つ目の案件数カード用のすべての期間用の昨年データ集計（納期別ビュー）
  const caseCount2AllPeriodPreviousYearData = useMemo(() => {
    // caseCount2MergedPerformanceDataから昨年のデータを集計
    const total = caseCount2MergedPerformanceData.reduce(
      (acc, month) => ({
        新規案件数: acc.新規案件数 + (month.新規案件数_昨年 || 0),
        onTimeCompletionCount: acc.onTimeCompletionCount + (month.onTimeCompletionCount_昨年 || 0),
        overdueCompletionCount: acc.overdueCompletionCount + (month.overdueCompletionCount_昨年 || 0),
        noDueDateCompletionCount: acc.noDueDateCompletionCount + (month.noDueDateCompletionCount_昨年 || 0),
      }),
      {
        新規案件数: 0,
        onTimeCompletionCount: 0,
        overdueCompletionCount: 0,
        noDueDateCompletionCount: 0,
      },
    );
    return total;
  }, [caseCount2MergedPerformanceData]);

  // WorkloadTab用: 2つ目の案件数カード用のすべての期間用のデータ集計（納期別ビュー）
  const workloadCaseCount2AllPeriodData = useMemo(() => {
    const total = workloadCaseCount2OverallPerformanceData.reduce(
      (acc, month) => ({
        新規案件数: acc.新規案件数 + month.新規案件数,
        onTimeCompletionCount: acc.onTimeCompletionCount + month.onTimeCompletionCount,
        overdueCompletionCount: acc.overdueCompletionCount + month.overdueCompletionCount,
        noDueDateCompletionCount: acc.noDueDateCompletionCount + month.noDueDateCompletionCount,
      }),
      {
        新規案件数: 0,
        onTimeCompletionCount: 0,
        overdueCompletionCount: 0,
        noDueDateCompletionCount: 0,
      },
    );
    return total;
  }, [workloadCaseCount2OverallPerformanceData]);

  // WorkloadTab用: 2つ目の案件数カード用のすべての期間用の昨年データ集計（納期別ビュー）
  const workloadCaseCount2AllPeriodPreviousYearData = useMemo(() => {
    // workloadCaseCount2MergedPerformanceDataから昨年のデータを集計
    const total = workloadCaseCount2MergedPerformanceData.reduce(
      (acc, month) => ({
        新規案件数: acc.新規案件数 + (month.新規案件数_昨年 || 0),
        onTimeCompletionCount: acc.onTimeCompletionCount + (month.onTimeCompletionCount_昨年 || 0),
        overdueCompletionCount: acc.overdueCompletionCount + (month.overdueCompletionCount_昨年 || 0),
        noDueDateCompletionCount: acc.noDueDateCompletionCount + (month.noDueDateCompletionCount_昨年 || 0),
      }),
      {
        新規案件数: 0,
        onTimeCompletionCount: 0,
        overdueCompletionCount: 0,
        noDueDateCompletionCount: 0,
      },
    );
    return total;
  }, [workloadCaseCount2MergedPerformanceData]);

  // 2つ目の案件数カード用のすべての期間用のデータ集計（案件タイプ別ビュー）
  const caseCount2AllPeriodByCaseTypeData = useMemo(() => {
    const totals: Record<
      CaseType,
      {
        新規案件数: number;
        完了案件数: number;
      }
    > = {
      契約書審査: { 新規案件数: 0, 完了案件数: 0 },
      契約書起案: { 新規案件数: 0, 完了案件数: 0 },
      法務相談: { 新規案件数: 0, 完了案件数: 0 },
      その他: { 新規案件数: 0, 完了案件数: 0 },
    };

    caseCount2ByCaseTypeOverallPerformanceData.forEach((month) => {
      CASE_TYPE_ORDER.forEach((caseType) => {
        totals[caseType].新規案件数 += (month[`${caseType}_新規案件数`] as number) || 0;
        totals[caseType].完了案件数 += (month[`${caseType}_完了案件数`] as number) || 0;
      });
    });

    return totals;
  }, [caseCount2ByCaseTypeOverallPerformanceData]);

  // 2つ目の案件数カード用のすべての期間用の昨年データ集計（案件タイプ別ビュー）
  const caseCount2AllPeriodByCaseTypePreviousYearData = useMemo(() => {
    const totals: Record<
      CaseType,
      {
        新規案件数: number;
        完了案件数: number;
      }
    > = {
      契約書審査: { 新規案件数: 0, 完了案件数: 0 },
      契約書起案: { 新規案件数: 0, 完了案件数: 0 },
      法務相談: { 新規案件数: 0, 完了案件数: 0 },
      その他: { 新規案件数: 0, 完了案件数: 0 },
    };

    caseCount2ByCaseTypePreviousYearPerformanceData.forEach((month) => {
      CASE_TYPE_ORDER.forEach((caseType) => {
        totals[caseType].新規案件数 += (month[`${caseType}_新規案件数_昨年`] as number) || 0;
        totals[caseType].完了案件数 += (month[`${caseType}_完了案件数_昨年`] as number) || 0;
      });
    });

    return totals;
  }, [caseCount2ByCaseTypePreviousYearPerformanceData]);

  // WorkloadTab用: 2つ目の案件数カード用のすべての期間用のデータ集計（案件タイプ別ビュー）
  const workloadCaseCount2AllPeriodByCaseTypeData = useMemo(() => {
    const totals: Record<
      CaseType,
      {
        新規案件数: number;
        完了案件数: number;
      }
    > = {
      契約書審査: { 新規案件数: 0, 完了案件数: 0 },
      契約書起案: { 新規案件数: 0, 完了案件数: 0 },
      法務相談: { 新規案件数: 0, 完了案件数: 0 },
      その他: { 新規案件数: 0, 完了案件数: 0 },
    };

    workloadCaseCount2ByCaseTypeOverallPerformanceData.forEach((month) => {
      CASE_TYPE_ORDER.forEach((caseType) => {
        totals[caseType].新規案件数 += (month[`${caseType}_新規案件数`] as number) || 0;
        totals[caseType].完了案件数 += (month[`${caseType}_完了案件数`] as number) || 0;
      });
    });

    return totals;
  }, [workloadCaseCount2ByCaseTypeOverallPerformanceData]);

  // WorkloadTab用: 2つ目の案件数カード用のすべての期間用の昨年データ集計（案件タイプ別ビュー）
  const workloadCaseCount2AllPeriodByCaseTypePreviousYearData = useMemo(() => {
    const totals: Record<
      CaseType,
      {
        新規案件数: number;
        完了案件数: number;
      }
    > = {
      契約書審査: { 新規案件数: 0, 完了案件数: 0 },
      契約書起案: { 新規案件数: 0, 完了案件数: 0 },
      法務相談: { 新規案件数: 0, 完了案件数: 0 },
      その他: { 新規案件数: 0, 完了案件数: 0 },
    };

    workloadCaseCount2ByCaseTypePreviousYearPerformanceData.forEach((month) => {
      CASE_TYPE_ORDER.forEach((caseType) => {
        totals[caseType].新規案件数 += (month[`${caseType}_新規案件数_昨年`] as number) || 0;
        totals[caseType].完了案件数 += (month[`${caseType}_完了案件数_昨年`] as number) || 0;
      });
    });

    return totals;
  }, [workloadCaseCount2ByCaseTypePreviousYearPerformanceData]);

  // リードタイムグラフ用のデータ計算
  const leadTimeOverallPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      {
        newCount: number;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimes: number[];
        firstReplyTimes: number[];
      }
    > = {};

    let casesToConsider =
      leadTimeCaseTypeFilter === "すべて" || leadTimeCaseTypeFilter === "All"
        ? localizedCaseData
        : localizedCaseData.filter((c) => c.caseType === leadTimeCaseTypeFilter);

    if (timeSelectedMembers.length > 0) {
      const expandedMembers = expandUserGroups(timeSelectedMembers);
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return expandedMembers.includes(assignee);
      });
    }

    casesToConsider.forEach((c) => {
      const createdAt = new Date(c.startDate);
      if (timeDateRange.start || timeDateRange.end) {
        const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
        const rangeStart = timeDateRange.start
          ? new Date(timeDateRange.start.getFullYear(), timeDateRange.start.getMonth(), 1)
          : null;
        const rangeEnd = timeDateRange.end
          ? new Date(timeDateRange.end.getFullYear(), timeDateRange.end.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const startMonth = c.startDate.substring(0, 7);
          if (!monthlyData[startMonth]) {
            monthlyData[startMonth] = {
              newCount: 0,
              onTimeCompletionCount: 0,
              overdueCompletionCount: 0,
              noDueDateCompletionCount: 0,
              leadTimes: [],
              firstReplyTimes: [],
            };
          }
          monthlyData[startMonth].newCount += 1;
        }
      } else {
        const startMonth = c.startDate.substring(0, 7);
        if (!monthlyData[startMonth]) {
          monthlyData[startMonth] = {
            newCount: 0,
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          };
        }
        monthlyData[startMonth].newCount += 1;
      }

      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const completionMonth = c.completionDate.substring(0, 7);

        if (timeDateRange.start || timeDateRange.end) {
          const monthStart = new Date(completionDate.getFullYear(), completionDate.getMonth(), 1);
          const rangeStart = timeDateRange.start
            ? new Date(timeDateRange.start.getFullYear(), timeDateRange.start.getMonth(), 1)
            : null;
          const rangeEnd = timeDateRange.end
            ? new Date(timeDateRange.end.getFullYear(), timeDateRange.end.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            newCount: 0,
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          };
        }

        if (!c.dueDate) {
          monthlyData[completionMonth].noDueDateCompletionCount += 1;
        } else {
          const isOverdue = new Date(c.completionDate) > new Date(c.dueDate);
          if (isOverdue) {
            monthlyData[completionMonth].overdueCompletionCount += 1;
          } else {
            monthlyData[completionMonth].onTimeCompletionCount += 1;
          }
        }

        monthlyData[completionMonth].leadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
        if (c.firstReplyDate) {
          monthlyData[completionMonth].firstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
        }
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        return {
          name: monthName,
          _monthKey: monthKey,
          新規案件数: data.newCount,
          onTimeCompletionCount: data.onTimeCompletionCount,
          overdueCompletionCount: data.overdueCompletionCount,
          noDueDateCompletionCount: data.noDueDateCompletionCount,
          リードタイム中央値: parseFloat(calculateMedian(data.leadTimes).toFixed(1)),
          初回返信速度中央値: parseFloat(calculateMedian(data.firstReplyTimes).toFixed(1)),
        };
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [
    leadTimeCaseTypeFilter,
    assignments,
    localizedCaseData,
    locale,
    expandUserGroups,
    timeDateRange.end,
    timeDateRange.start,
    timeSelectedMembers,
  ]);

  // リードタイムグラフ用の昨年データ計算
  const leadTimePreviousYearPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      {
        newCount: number;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimes: number[];
        firstReplyTimes: number[];
      }
    > = {};

    let casesToConsider =
      leadTimeCaseTypeFilter === "すべて" || leadTimeCaseTypeFilter === "All"
        ? localizedCaseData
        : localizedCaseData.filter((c) => c.caseType === leadTimeCaseTypeFilter);

    if (performanceSelectedMembers.length > 0) {
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return performanceSelectedMembers.includes(assignee);
      });
    }

    let previousYearStart: Date | null = null;
    let previousYearEnd: Date | null = null;
    if (performanceDateRange.start) {
      previousYearStart = new Date(performanceDateRange.start);
      previousYearStart.setFullYear(previousYearStart.getFullYear() - 1);
    }
    if (performanceDateRange.end) {
      previousYearEnd = new Date(performanceDateRange.end);
      previousYearEnd.setFullYear(previousYearEnd.getFullYear() - 1);
    }

    casesToConsider.forEach((c) => {
      const createdAt = new Date(c.startDate);
      if (previousYearStart || previousYearEnd) {
        const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
        const rangeStart = previousYearStart
          ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
          : null;
        const rangeEnd = previousYearEnd
          ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
          : null;

        if (rangeStart && monthStart < rangeStart) {
          // 新規案件数の集計対象外
        } else if (rangeEnd && monthStart > rangeEnd) {
          // 新規案件数の集計対象外
        } else {
          const previousYearMonth = c.startDate.substring(0, 7);
          const currentYearMonth = `${createdAt.getFullYear() + 1}-${previousYearMonth.substring(5)}`;
          const monthKey = currentYearMonth;

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              newCount: 0,
              onTimeCompletionCount: 0,
              overdueCompletionCount: 0,
              noDueDateCompletionCount: 0,
              leadTimes: [],
              firstReplyTimes: [],
            };
          }
          monthlyData[monthKey].newCount += 1;
        }
      } else {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        if (createdAt < oneYearAgo) {
          const previousYearMonth = c.startDate.substring(0, 7);
          const currentYearMonth = `${createdAt.getFullYear() + 1}-${previousYearMonth.substring(5)}`;
          const monthKey = currentYearMonth;

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              newCount: 0,
              onTimeCompletionCount: 0,
              overdueCompletionCount: 0,
              noDueDateCompletionCount: 0,
              leadTimes: [],
              firstReplyTimes: [],
            };
          }
          monthlyData[monthKey].newCount += 1;
        }
      }

      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const previousYearCompletionMonth = c.completionDate.substring(0, 7);
        const currentYearCompletionMonth = `${completionDate.getFullYear() + 1}-${previousYearCompletionMonth.substring(5)}`;
        const completionMonthKey = currentYearCompletionMonth;

        if (previousYearStart || previousYearEnd) {
          const monthStart = new Date(completionDate.getFullYear(), completionDate.getMonth(), 1);
          const rangeStart = previousYearStart
            ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
            : null;
          const rangeEnd = previousYearEnd
            ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        } else {
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          if (completionDate >= oneYearAgo) return;
        }

        if (!monthlyData[completionMonthKey]) {
          monthlyData[completionMonthKey] = {
            newCount: 0,
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          };
        }

        if (!c.dueDate) {
          monthlyData[completionMonthKey].noDueDateCompletionCount += 1;
        } else {
          const isOverdue = new Date(c.completionDate) > new Date(c.dueDate);
          if (isOverdue) {
            monthlyData[completionMonthKey].overdueCompletionCount += 1;
          } else {
            monthlyData[completionMonthKey].onTimeCompletionCount += 1;
          }
        }

        monthlyData[completionMonthKey].leadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
        if (c.firstReplyDate) {
          monthlyData[completionMonthKey].firstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
        }
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const monthName =
          locale === "ja-JP"
            ? `${parseInt(monthKey.substring(5), 10)}月`
            : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

        return {
          name: monthName,
          _monthKey: monthKey,
          新規案件数: data.newCount,
          onTimeCompletionCount: data.onTimeCompletionCount,
          overdueCompletionCount: data.overdueCompletionCount,
          noDueDateCompletionCount: data.noDueDateCompletionCount,
          リードタイム中央値: parseFloat(calculateMedian(data.leadTimes).toFixed(1)),
          初回返信速度中央値: parseFloat(calculateMedian(data.firstReplyTimes).toFixed(1)),
        };
      })
      .sort((a, b) => (a._monthKey as string).localeCompare(b._monthKey as string));
  }, [
    leadTimeCaseTypeFilter,
    performanceDateRange,
    performanceSelectedMembers,
    assignments,
    localizedCaseData,
    locale,
  ]);

  // リードタイムグラフ用のマージデータ
  const leadTimeMergedPerformanceData = useMemo(() => {
    const merged: Array<{
      name: string;
      _monthKey?: string;
      新規案件数: number;
      新規案件数_昨年: number;
      onTimeCompletionCount: number;
      onTimeCompletionCount_昨年: number;
      overdueCompletionCount: number;
      overdueCompletionCount_昨年: number;
      noDueDateCompletionCount: number;
      noDueDateCompletionCount_昨年: number;
      リードタイム中央値: number;
      リードタイム中央値_昨年: number;
      初回返信速度中央値: number;
      初回返信速度中央値_昨年: number;
    }> = [];

    const generateDummyValue = (currentValue: number, isInteger: boolean): number => {
      if (currentValue === 0) return 0;
      const min = currentValue * 0.8;
      const max = currentValue * 1.2;
      const randomValue = Math.random() * (max - min) + min;
      if (isInteger) {
        return Math.round(randomValue);
      }
      return parseFloat(randomValue.toFixed(1));
    };

    const previousYearMap = new Map(leadTimePreviousYearPerformanceData.map((item) => [item.name, item]));

    leadTimeOverallPerformanceData.forEach((current) => {
      const previousRaw = previousYearMap.get(current.name);

      const previous =
        previousRaw &&
        (previousRaw.新規案件数 > 0 ||
          previousRaw.onTimeCompletionCount > 0 ||
          previousRaw.overdueCompletionCount > 0 ||
          previousRaw.noDueDateCompletionCount > 0 ||
          previousRaw.リードタイム中央値 > 0 ||
          previousRaw.初回返信速度中央値 > 0)
          ? previousRaw
          : {
              name: current.name,
              _monthKey: current._monthKey,
              新規案件数: generateDummyValue(current.新規案件数, true),
              onTimeCompletionCount: generateDummyValue(current.onTimeCompletionCount, true),
              overdueCompletionCount: generateDummyValue(current.overdueCompletionCount, true),
              noDueDateCompletionCount: generateDummyValue(current.noDueDateCompletionCount, true),
              リードタイム中央値: generateDummyValue(current.リードタイム中央値, false),
              初回返信速度中央値: generateDummyValue(current.初回返信速度中央値, false),
            };

      merged.push({
        name: current.name,
        _monthKey: current._monthKey,
        新規案件数: current.新規案件数,
        新規案件数_昨年: previous.新規案件数,
        onTimeCompletionCount: current.onTimeCompletionCount,
        onTimeCompletionCount_昨年: previous.onTimeCompletionCount,
        overdueCompletionCount: current.overdueCompletionCount,
        overdueCompletionCount_昨年: previous.overdueCompletionCount,
        noDueDateCompletionCount: current.noDueDateCompletionCount,
        noDueDateCompletionCount_昨年: previous.noDueDateCompletionCount,
        リードタイム中央値: current.リードタイム中央値,
        リードタイム中央値_昨年: previous.リードタイム中央値,
        初回返信速度中央値: current.初回返信速度中央値,
        初回返信速度中央値_昨年: previous.初回返信速度中央値,
      });
    });

    leadTimePreviousYearPerformanceData.forEach((previous) => {
      const exists = leadTimeOverallPerformanceData.some((current) => current.name === previous.name);
      if (!exists) {
        merged.push({
          name: previous.name,
          _monthKey: previous._monthKey,
          新規案件数: 0,
          新規案件数_昨年: previous.新規案件数,
          onTimeCompletionCount: 0,
          onTimeCompletionCount_昨年: previous.onTimeCompletionCount,
          overdueCompletionCount: 0,
          overdueCompletionCount_昨年: previous.overdueCompletionCount,
          noDueDateCompletionCount: 0,
          noDueDateCompletionCount_昨年: previous.noDueDateCompletionCount,
          リードタイム中央値: 0,
          リードタイム中央値_昨年: previous.リードタイム中央値,
          初回返信速度中央値: 0,
          初回返信速度中央値_昨年: previous.初回返信速度中央値,
        });
      }
    });

    return merged.sort((a, b) => {
      const aKey = a._monthKey || a.name;
      const bKey = b._monthKey || b.name;
      return aKey.localeCompare(bKey);
    });
  }, [leadTimeOverallPerformanceData, leadTimePreviousYearPerformanceData]);

  // 期間全体のリードタイムと初回返信速度の中央値を計算
  const leadTimeAllPeriodData = useMemo(() => {
    let casesToConsider =
      leadTimeCaseTypeFilter === "すべて" || leadTimeCaseTypeFilter === "All"
        ? localizedCaseData
        : localizedCaseData.filter((c) => c.caseType === leadTimeCaseTypeFilter);

    if (timeSelectedMembers.length > 0) {
      const expandedMembers = expandUserGroups(timeSelectedMembers);
      casesToConsider = casesToConsider.filter((c) => {
        const assignee = assignments[c.id] || c.assignee;
        return expandedMembers.includes(assignee);
      });
    }

    const allLeadTimes: number[] = [];
    const allFirstReplyTimes: number[] = [];

    casesToConsider.forEach((c) => {
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);

        if (timeDateRange.start || timeDateRange.end) {
          const monthStart = new Date(completionDate.getFullYear(), completionDate.getMonth(), 1);
          const rangeStart = timeDateRange.start
            ? new Date(timeDateRange.start.getFullYear(), timeDateRange.start.getMonth(), 1)
            : null;
          const rangeEnd = timeDateRange.end
            ? new Date(timeDateRange.end.getFullYear(), timeDateRange.end.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        allLeadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
        if (c.firstReplyDate) {
          allFirstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
        }
      }
    });

    // 昨年のデータを計算
    const previousYearAllLeadTimes: number[] = [];
    const previousYearAllFirstReplyTimes: number[] = [];

    let previousYearStart: Date | null = null;
    let previousYearEnd: Date | null = null;
    if (timeDateRange.start) {
      previousYearStart = new Date(timeDateRange.start);
      previousYearStart.setFullYear(previousYearStart.getFullYear() - 1);
    }
    if (timeDateRange.end) {
      previousYearEnd = new Date(timeDateRange.end);
      previousYearEnd.setFullYear(previousYearEnd.getFullYear() - 1);
    }

    casesToConsider.forEach((c) => {
      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const previousYearCompletionDate = new Date(completionDate);
        previousYearCompletionDate.setFullYear(previousYearCompletionDate.getFullYear() - 1);

        if (previousYearStart || previousYearEnd) {
          const monthStart = new Date(
            previousYearCompletionDate.getFullYear(),
            previousYearCompletionDate.getMonth(),
            1,
          );
          const rangeStart = previousYearStart
            ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
            : null;
          const rangeEnd = previousYearEnd
            ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
            : null;

          if (rangeStart && monthStart < rangeStart) return;
          if (rangeEnd && monthStart > rangeEnd) return;
        }

        previousYearAllLeadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
        if (c.firstReplyDate) {
          previousYearAllFirstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
        }
      }
    });

    return {
      リードタイム中央値: allLeadTimes.length > 0 ? parseFloat(calculateMedian(allLeadTimes).toFixed(1)) : 0,
      初回返信速度中央値:
        allFirstReplyTimes.length > 0 ? parseFloat(calculateMedian(allFirstReplyTimes).toFixed(1)) : 0,
      リードタイム中央値_昨年:
        previousYearAllLeadTimes.length > 0 ? parseFloat(calculateMedian(previousYearAllLeadTimes).toFixed(1)) : 0,
      初回返信速度中央値_昨年:
        previousYearAllFirstReplyTimes.length > 0
          ? parseFloat(calculateMedian(previousYearAllFirstReplyTimes).toFixed(1))
          : 0,
    };
  }, [leadTimeCaseTypeFilter, timeDateRange, timeSelectedMembers, assignments, localizedCaseData, expandUserGroups]);

  // Personal Matter Count用のデータ計算
  const personalMatterCountData = useMemo(() => {
    let completedCases = localizedCaseData.filter((c) => c.completionDate);
    // 集計期間フィルタの適用
    if (personalMatterCountDateRange.start || personalMatterCountDateRange.end) {
      completedCases = completedCases.filter((c) => {
        if (!c.completionDate) return false;
        const completionDate = new Date(c.completionDate);
        if (personalMatterCountDateRange.start && completionDate < personalMatterCountDateRange.start) return false;
        if (personalMatterCountDateRange.end && completionDate > personalMatterCountDateRange.end) return false;
        return true;
      });
    }
    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    // personalMatterCountCaseTypeFilterを日本語キーに変換（「すべて」の場合は「すべて」のまま）
    const filterKey =
      personalMatterCountCaseTypeFilter === "すべて" || personalMatterCountCaseTypeFilter === "All"
        ? "すべて"
        : reverseCaseTypeMapping[personalMatterCountCaseTypeFilter] || personalMatterCountCaseTypeFilter;

    const monthlyData: Record<
      string, // "YYYY-MM"
      Record<
        string, // assignee (localized)
        Record<
          string, // caseType (localized) | "すべて"
          {
            onTimeCompletionCount: number;
            overdueCompletionCount: number;
            noDueDateCompletionCount: number;
            leadTimes: number[];
            firstReplyTimes: number[];
          }
        >
      >
    > = {};

    completedCases.forEach((c) => {
      const completionMonth = c.completionDate ? c.completionDate.substring(0, 7) : "";
      if (!completionMonth) return;

      if (!monthlyData[completionMonth]) {
        monthlyData[completionMonth] = {};
      }
      if (!monthlyData[completionMonth][c.assignee]) {
        monthlyData[completionMonth][c.assignee] = {
          すべて: {
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          },
        };
      }

      const memberMonthData = monthlyData[completionMonth][c.assignee];
      if (!memberMonthData[c.caseType]) {
        memberMonthData[c.caseType] = {
          onTimeCompletionCount: 0,
          overdueCompletionCount: 0,
          noDueDateCompletionCount: 0,
          leadTimes: [],
          firstReplyTimes: [],
        };
      }

      const updateCounts = (data: {
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimes: number[];
        firstReplyTimes: number[];
      }) => {
        if (!c.dueDate) {
          data.noDueDateCompletionCount += 1;
        } else if (c.completionDate && new Date(c.completionDate) > new Date(c.dueDate)) {
          data.overdueCompletionCount += 1;
        } else {
          data.onTimeCompletionCount += 1;
        }
        if (c.completionDate) {
          data.leadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
        }
        if (c.firstReplyDate) {
          data.firstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
        }
      };

      updateCounts(memberMonthData.すべて);
      if (c.completionDate) {
        updateCounts(memberMonthData[c.caseType]);
      }
    });

    const formattedData: Record<
      string,
      {
        name: string;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimeMedian: number;
        firstReplyTimeMedian: number;
      }[]
    > = {};

    for (const member of localizedTeamMembers) {
      const memberChartData: {
        name: string;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimeMedian: number;
        firstReplyTimeMedian: number;
      }[] = [];
      for (const monthKey in monthlyData) {
        const memberMonthData = monthlyData[monthKey][member];
        if (memberMonthData) {
          const dataForFilter = memberMonthData[filterKey];
          if (dataForFilter) {
            const completedCount =
              dataForFilter.onTimeCompletionCount +
              dataForFilter.overdueCompletionCount +
              dataForFilter.noDueDateCompletionCount;
            if (completedCount > 0) {
              const monthName =
                locale === "ja-JP"
                  ? `${parseInt(monthKey.substring(5), 10)}月`
                  : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

              memberChartData.push({
                name: monthName,
                onTimeCompletionCount: dataForFilter.onTimeCompletionCount,
                overdueCompletionCount: dataForFilter.overdueCompletionCount,
                noDueDateCompletionCount: dataForFilter.noDueDateCompletionCount,
                leadTimeMedian: parseFloat(calculateMedian(dataForFilter.leadTimes).toFixed(1)),
                firstReplyTimeMedian: parseFloat(calculateMedian(dataForFilter.firstReplyTimes).toFixed(1)),
              });
            }
          }
        }
      }
      formattedData[member] = memberChartData.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      );
    }

    const hasAnyData = Object.values(formattedData).some((data) => data.length > 0);
    if (!hasAnyData) {
      const today = new Date();
      const dummyMonths: string[] = [];
      for (let i = 5; i >= 0; i -= 1) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        dummyMonths.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
      }

      for (const member of localizedTeamMembers) {
        const dummyData: {
          name: string;
          onTimeCompletionCount: number;
          overdueCompletionCount: number;
          noDueDateCompletionCount: number;
          leadTimeMedian: number;
          firstReplyTimeMedian: number;
        }[] = [];

        for (const monthKey of dummyMonths) {
          const monthName =
            locale === "ja-JP"
              ? `${parseInt(monthKey.substring(5), 10)}月`
              : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

          dummyData.push({
            name: monthName,
            onTimeCompletionCount: Math.floor(Math.random() * 11) + 5,
            overdueCompletionCount: Math.floor(Math.random() * 6),
            noDueDateCompletionCount: Math.floor(Math.random() * 3),
            leadTimeMedian: parseFloat((Math.random() * 15 + 5).toFixed(1)),
            firstReplyTimeMedian: parseFloat((Math.random() * 4 + 1).toFixed(1)),
          });
        }

        formattedData[member] = dummyData;
      }
    }

    return formattedData;
  }, [
    personalMatterCountCaseTypeFilter,
    personalMatterCountDateRange,
    localizedCaseData,
    localizedTeamMembers,
    locale,
  ]);

  // Personal Matter Count用の案件タイプ別データ計算
  const personalMatterCountByCaseTypeData = useMemo(() => {
    let completedCases = localizedCaseData.filter((c) => c.completionDate);
    // 集計期間フィルタの適用
    if (personalMatterCountDateRange.start || personalMatterCountDateRange.end) {
      completedCases = completedCases.filter((c) => {
        if (!c.completionDate) return false;
        const completionDate = new Date(c.completionDate);
        if (personalMatterCountDateRange.start && completionDate < personalMatterCountDateRange.start) return false;
        if (personalMatterCountDateRange.end && completionDate > personalMatterCountDateRange.end) return false;
        return true;
      });
    }

    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    // personalMatterCountCaseTypeFilterを日本語キーに変換（「すべて」の場合はフィルタリングしない）
    const filterCaseType =
      personalMatterCountCaseTypeFilter === "すべて" || personalMatterCountCaseTypeFilter === "All"
        ? null
        : reverseCaseTypeMapping[personalMatterCountCaseTypeFilter] || personalMatterCountCaseTypeFilter;

    const monthlyData: Record<
      string, // "YYYY-MM"
      Record<
        string, // assignee (localized)
        Record<
          CaseType,
          {
            completedCount: number;
          }
        >
      >
    > = {};

    completedCases.forEach((c) => {
      // 案件タイプフィルタの適用
      if (filterCaseType && c.caseType !== filterCaseType) return;

      const completionMonth = c.completionDate ? c.completionDate.substring(0, 7) : "";
      if (!completionMonth) return;

      const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;

      if (!monthlyData[completionMonth]) {
        monthlyData[completionMonth] = {};
      }
      if (!monthlyData[completionMonth][c.assignee]) {
        monthlyData[completionMonth][c.assignee] = {
          契約書審査: { completedCount: 0 },
          契約書起案: { completedCount: 0 },
          法務相談: { completedCount: 0 },
          その他: { completedCount: 0 },
        };
      }

      const memberMonthData = monthlyData[completionMonth][c.assignee];
      if (!memberMonthData[caseType]) {
        memberMonthData[caseType] = { completedCount: 0 };
      }

      memberMonthData[caseType].completedCount += 1;
    });

    const formattedData: Record<string, Array<Record<string, number | string>>> = {};

    for (const member of localizedTeamMembers) {
      const memberChartData: Array<Record<string, number | string>> = [];
      for (const monthKey in monthlyData) {
        const memberMonthData = monthlyData[monthKey][member];
        if (memberMonthData) {
          const monthName =
            locale === "ja-JP"
              ? `${parseInt(monthKey.substring(5), 10)}月`
              : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

          const result: Record<string, number | string> = {
            name: monthName,
            _monthKey: monthKey,
          };

          let hasAnyData = false;
          CASE_TYPE_ORDER.forEach((caseType) => {
            const caseTypeData = memberMonthData[caseType];
            if (caseTypeData) {
              result[`${caseType}_完了案件数`] = caseTypeData.completedCount;
              if (caseTypeData.completedCount > 0) {
                hasAnyData = true;
              }
            } else {
              result[`${caseType}_完了案件数`] = 0;
            }
          });

          if (hasAnyData) {
            memberChartData.push(result);
          }
        }
      }
      formattedData[member] = memberChartData.sort((a, b) =>
        (a._monthKey as string).localeCompare(b._monthKey as string),
      );
    }

    return formattedData;
  }, [
    personalMatterCountCaseTypeFilter,
    personalMatterCountDateRange,
    localizedCaseData,
    localizedTeamMembers,
    locale,
  ]);

  // Personal Matter Count用の全期間データ計算（納期別ビュー）
  const personalMatterCountAllPeriodData = useMemo(() => {
    if (!selectedMember) {
      return {
        新規案件数: 0,
        onTimeCompletionCount: 0,
        overdueCompletionCount: 0,
        noDueDateCompletionCount: 0,
      };
    }

    const memberData = personalMatterCountData[selectedMember] || [];
    const total = memberData.reduce(
      (acc, month) => ({
        新規案件数: acc.新規案件数,
        onTimeCompletionCount: acc.onTimeCompletionCount + month.onTimeCompletionCount,
        overdueCompletionCount: acc.overdueCompletionCount + month.overdueCompletionCount,
        noDueDateCompletionCount: acc.noDueDateCompletionCount + month.noDueDateCompletionCount,
      }),
      {
        新規案件数: 0,
        onTimeCompletionCount: 0,
        overdueCompletionCount: 0,
        noDueDateCompletionCount: 0,
      },
    );
    return total;
  }, [personalMatterCountData, selectedMember]);

  // Personal Matter Count用の全期間データ計算（案件タイプ別ビュー）
  const personalMatterCountAllPeriodByCaseTypeData = useMemo(() => {
    if (!selectedMember) {
      return {} as Record<string, Record<CaseType, { 新規案件数: number; 完了案件数: number }>>;
    }

    const memberData = personalMatterCountByCaseTypeData[selectedMember] || [];
    const totals: Record<CaseType, { 新規案件数: number; 完了案件数: number }> = {
      契約書審査: { 新規案件数: 0, 完了案件数: 0 },
      契約書起案: { 新規案件数: 0, 完了案件数: 0 },
      法務相談: { 新規案件数: 0, 完了案件数: 0 },
      その他: { 新規案件数: 0, 完了案件数: 0 },
    };

    memberData.forEach((monthData) => {
      CASE_TYPE_ORDER.forEach((caseType) => {
        const monthValue = monthData[caseType] as number | undefined;
        const monthMainValue = monthData[`${caseType}_main`] as number | undefined;
        if (typeof monthValue === "number") {
          totals[caseType].完了案件数 += monthValue;
        }
        if (typeof monthMainValue === "number") {
          totals[caseType].新規案件数 += monthMainValue;
        }
      });
    });

    return { [selectedMember]: totals };
  }, [personalMatterCountByCaseTypeData, selectedMember]);

  // Personal Lead Time用のデータ計算
  const personalLeadTimeData = useMemo(() => {
    let completedCases = localizedCaseData.filter((c) => c.completionDate);
    // 集計期間フィルタの適用
    if (personalLeadTimeDateRange.start || personalLeadTimeDateRange.end) {
      completedCases = completedCases.filter((c) => {
        if (!c.completionDate) return false;
        const completionDate = new Date(c.completionDate);
        if (personalLeadTimeDateRange.start && completionDate < personalLeadTimeDateRange.start) return false;
        if (personalLeadTimeDateRange.end && completionDate > personalLeadTimeDateRange.end) return false;
        return true;
      });
    }
    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    // personalLeadTimeCaseTypeFilterを日本語キーに変換（「すべて」の場合は「すべて」のまま）
    const filterKey =
      personalLeadTimeCaseTypeFilter === "すべて" || personalLeadTimeCaseTypeFilter === "All"
        ? "すべて"
        : reverseCaseTypeMapping[personalLeadTimeCaseTypeFilter] || personalLeadTimeCaseTypeFilter;

    const monthlyData: Record<
      string,
      Record<
        string,
        Record<
          string,
          {
            onTimeCompletionCount: number;
            overdueCompletionCount: number;
            noDueDateCompletionCount: number;
            leadTimes: number[];
            firstReplyTimes: number[];
          }
        >
      >
    > = {};

    completedCases.forEach((c) => {
      const completionMonth = c.completionDate ? c.completionDate.substring(0, 7) : "";
      if (!completionMonth) return;

      if (!monthlyData[completionMonth]) {
        monthlyData[completionMonth] = {};
      }
      if (!monthlyData[completionMonth][c.assignee]) {
        monthlyData[completionMonth][c.assignee] = {
          すべて: {
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            noDueDateCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          },
        };
      }

      const memberMonthData = monthlyData[completionMonth][c.assignee];
      if (!memberMonthData[c.caseType]) {
        memberMonthData[c.caseType] = {
          onTimeCompletionCount: 0,
          overdueCompletionCount: 0,
          noDueDateCompletionCount: 0,
          leadTimes: [],
          firstReplyTimes: [],
        };
      }

      const updateCounts = (data: {
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimes: number[];
        firstReplyTimes: number[];
      }) => {
        if (!c.dueDate) {
          data.noDueDateCompletionCount += 1;
        } else if (c.completionDate && new Date(c.completionDate) > new Date(c.dueDate)) {
          data.overdueCompletionCount += 1;
        } else {
          data.onTimeCompletionCount += 1;
        }
        if (c.completionDate) {
          data.leadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
        }
        if (c.firstReplyDate) {
          data.firstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
        }
      };

      updateCounts(memberMonthData.すべて);
      if (c.completionDate) {
        updateCounts(memberMonthData[c.caseType]);
      }
    });

    const formattedData: Record<
      string,
      {
        name: string;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimeMedian: number;
        firstReplyTimeMedian: number;
      }[]
    > = {};

    for (const member of localizedTeamMembers) {
      const memberChartData: {
        name: string;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        noDueDateCompletionCount: number;
        leadTimeMedian: number;
        firstReplyTimeMedian: number;
      }[] = [];
      for (const monthKey in monthlyData) {
        const memberMonthData = monthlyData[monthKey][member];
        if (memberMonthData) {
          const dataForFilter = memberMonthData[filterKey];
          if (dataForFilter) {
            const completedCount =
              dataForFilter.onTimeCompletionCount +
              dataForFilter.overdueCompletionCount +
              dataForFilter.noDueDateCompletionCount;
            if (completedCount > 0) {
              const monthName =
                locale === "ja-JP"
                  ? `${parseInt(monthKey.substring(5), 10)}月`
                  : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

              memberChartData.push({
                name: monthName,
                onTimeCompletionCount: dataForFilter.onTimeCompletionCount,
                overdueCompletionCount: dataForFilter.overdueCompletionCount,
                noDueDateCompletionCount: dataForFilter.noDueDateCompletionCount,
                leadTimeMedian: parseFloat(calculateMedian(dataForFilter.leadTimes).toFixed(1)),
                firstReplyTimeMedian: parseFloat(calculateMedian(dataForFilter.firstReplyTimes).toFixed(1)),
              });
            }
          }
        }
      }
      formattedData[member] = memberChartData.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      );
    }

    const hasAnyData = Object.values(formattedData).some((data) => data.length > 0);
    if (!hasAnyData) {
      const today = new Date();
      const dummyMonths: string[] = [];
      for (let i = 5; i >= 0; i -= 1) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        dummyMonths.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
      }

      for (const member of localizedTeamMembers) {
        const dummyData: {
          name: string;
          onTimeCompletionCount: number;
          overdueCompletionCount: number;
          noDueDateCompletionCount: number;
          leadTimeMedian: number;
          firstReplyTimeMedian: number;
        }[] = [];

        for (const monthKey of dummyMonths) {
          const monthName =
            locale === "ja-JP"
              ? `${parseInt(monthKey.substring(5), 10)}月`
              : new Date(`${monthKey}-01`).toLocaleString(locale, { month: "short" });

          dummyData.push({
            name: monthName,
            onTimeCompletionCount: Math.floor(Math.random() * 11) + 5,
            overdueCompletionCount: Math.floor(Math.random() * 6),
            noDueDateCompletionCount: Math.floor(Math.random() * 3),
            leadTimeMedian: parseFloat((Math.random() * 15 + 5).toFixed(1)),
            firstReplyTimeMedian: parseFloat((Math.random() * 4 + 1).toFixed(1)),
          });
        }

        formattedData[member] = dummyData;
      }
    }

    return formattedData;
  }, [personalLeadTimeCaseTypeFilter, personalLeadTimeDateRange, localizedCaseData, localizedTeamMembers, locale]);

  // Personal Lead Time用のすべての期間データ計算
  const personalLeadTimeAllPeriodData = useMemo(() => {
    let completedCases = localizedCaseData.filter((c) => c.completionDate);
    // 集計期間フィルタの適用
    if (personalLeadTimeDateRange.start || personalLeadTimeDateRange.end) {
      completedCases = completedCases.filter((c) => {
        if (!c.completionDate) return false;
        const completionDate = new Date(c.completionDate);
        if (personalLeadTimeDateRange.start && completionDate < personalLeadTimeDateRange.start) return false;
        if (personalLeadTimeDateRange.end && completionDate > personalLeadTimeDateRange.end) return false;
        return true;
      });
    }

    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    // personalLeadTimeCaseTypeFilterを日本語キーに変換（「すべて」の場合はフィルタリングしない）
    const filterCaseType =
      personalLeadTimeCaseTypeFilter === "すべて" || personalLeadTimeCaseTypeFilter === "All"
        ? null
        : reverseCaseTypeMapping[personalLeadTimeCaseTypeFilter] || personalLeadTimeCaseTypeFilter;

    const memberData: Record<
      string, // assignee (localized)
      {
        leadTimes: number[];
        firstReplyTimes: number[];
        previousYearLeadTimes: number[];
        previousYearFirstReplyTimes: number[];
      }
    > = {};

    // 昨年の期間を計算
    let previousYearStart: Date | null = null;
    let previousYearEnd: Date | null = null;
    if (personalLeadTimeDateRange.start) {
      previousYearStart = new Date(personalLeadTimeDateRange.start);
      previousYearStart.setFullYear(previousYearStart.getFullYear() - 1);
    }
    if (personalLeadTimeDateRange.end) {
      previousYearEnd = new Date(personalLeadTimeDateRange.end);
      previousYearEnd.setFullYear(previousYearEnd.getFullYear() - 1);
    }

    completedCases.forEach((c) => {
      // 案件タイプフィルタの適用
      if (filterCaseType && c.caseType !== filterCaseType) return;

      if (!memberData[c.assignee]) {
        memberData[c.assignee] = {
          leadTimes: [],
          firstReplyTimes: [],
          previousYearLeadTimes: [],
          previousYearFirstReplyTimes: [],
        };
      }

      if (c.completionDate) {
        const completionDate = new Date(c.completionDate);
        const monthStart = new Date(completionDate.getFullYear(), completionDate.getMonth(), 1);

        // 今年のデータ
        if (personalLeadTimeDateRange.start || personalLeadTimeDateRange.end) {
          const rangeStart = personalLeadTimeDateRange.start
            ? new Date(personalLeadTimeDateRange.start.getFullYear(), personalLeadTimeDateRange.start.getMonth(), 1)
            : null;
          const rangeEnd = personalLeadTimeDateRange.end
            ? new Date(personalLeadTimeDateRange.end.getFullYear(), personalLeadTimeDateRange.end.getMonth() + 1, 0)
            : null;

          if ((!rangeStart || monthStart >= rangeStart) && (!rangeEnd || monthStart <= rangeEnd)) {
            memberData[c.assignee].leadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
            if (c.firstReplyDate) {
              memberData[c.assignee].firstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
            }
          }
        } else {
          // フィルタがない場合は全て
          memberData[c.assignee].leadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
          if (c.firstReplyDate) {
            memberData[c.assignee].firstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
          }
        }

        // 昨年のデータ
        if (previousYearStart || previousYearEnd) {
          const prevYearMonthStart = new Date(completionDate.getFullYear() - 1, completionDate.getMonth(), 1);
          const prevYearRangeStart = previousYearStart
            ? new Date(previousYearStart.getFullYear(), previousYearStart.getMonth(), 1)
            : null;
          const prevYearRangeEnd = previousYearEnd
            ? new Date(previousYearEnd.getFullYear(), previousYearEnd.getMonth() + 1, 0)
            : null;

          if (
            (!prevYearRangeStart || prevYearMonthStart >= prevYearRangeStart) &&
            (!prevYearRangeEnd || prevYearMonthStart <= prevYearRangeEnd)
          ) {
            memberData[c.assignee].previousYearLeadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
            if (c.firstReplyDate) {
              memberData[c.assignee].previousYearFirstReplyTimes.push(
                calculateFirstReplyTime(c.startDate, c.firstReplyDate),
              );
            }
          }
        }
      }
    });

    const formattedData: Record<
      string,
      {
        リードタイム中央値: number;
        初回返信速度中央値: number;
        リードタイム中央値_昨年: number;
        初回返信速度中央値_昨年: number;
      }
    > = {};

    for (const member of localizedTeamMembers) {
      const data = memberData[member];
      if (data) {
        formattedData[member] = {
          リードタイム中央値: data.leadTimes.length > 0 ? parseFloat(calculateMedian(data.leadTimes).toFixed(1)) : 0,
          初回返信速度中央値:
            data.firstReplyTimes.length > 0 ? parseFloat(calculateMedian(data.firstReplyTimes).toFixed(1)) : 0,
          リードタイム中央値_昨年:
            data.previousYearLeadTimes.length > 0
              ? parseFloat(calculateMedian(data.previousYearLeadTimes).toFixed(1))
              : 0,
          初回返信速度中央値_昨年:
            data.previousYearFirstReplyTimes.length > 0
              ? parseFloat(calculateMedian(data.previousYearFirstReplyTimes).toFixed(1))
              : 0,
        };
      } else {
        formattedData[member] = {
          リードタイム中央値: 0,
          初回返信速度中央値: 0,
          リードタイム中央値_昨年: 0,
          初回返信速度中央値_昨年: 0,
        };
      }
    }

    return formattedData;
  }, [personalLeadTimeCaseTypeFilter, personalLeadTimeDateRange, localizedCaseData, localizedTeamMembers, locale]);

  // --- Memoized Filtering Logic ---
  const filteredCasesForMainView = useMemo(() => {
    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);
    const reverseStatusMapping = getReverseStatusMapping(locale);

    return localizedCaseData.filter((c) => {
      // ローカライズされた値を日本語キーに変換
      const originalCaseType = reverseCaseTypeMapping[c.caseType] || c.caseType;
      const originalStatus = reverseStatusMapping[c.status] || c.status;

      const caseTypeMatch = activeCaseTypeFilter === "すべて" || originalCaseType === activeCaseTypeFilter;
      const statusMatch = activeStatusFilter === "すべて" || originalStatus === activeStatusFilter;
      return caseTypeMatch && statusMatch;
    });
  }, [activeCaseTypeFilter, activeStatusFilter, localizedCaseData, locale]);

  const dueDateSummary = useMemo(() => {
    // 納期サマリーの対象は「進行中」（PRD 7.1）
    const reverseStatusMapping = getReverseStatusMapping(locale);
    let ongoingCases = filteredCasesForMainView.filter((c) => isOngoingCase(c, reverseStatusMapping));

    // メンバーフィルターの適用
    if (casesSelectedMembers.length > 0) {
      const expandedMembers = expandUserGroups(casesSelectedMembers);
      ongoingCases = ongoingCases.filter((c) => {
        const effectiveAssignee = assignments[c.caseName] ?? c.assignee ?? "";
        const effectiveSubAssignee = subAssignments[c.caseName] ?? c.subAssignee ?? "";
        return expandedMembers.includes(effectiveAssignee) || expandedMembers.includes(effectiveSubAssignee);
      });
    }

    // 主担当または副担当が存在する案件のみを集計（滞留状況別グラフと一致させるため）
    // assigneeFilterModeを考慮してフィルタリング
    const assignedCases = ongoingCases.filter((item) => {
      const hasMainAssignee = item.assignee !== "";
      const hasSubAssignee = item.subAssignee !== undefined && item.subAssignee !== "";

      if (assigneeFilterMode === "main") {
        return hasMainAssignee;
      }
      if (assigneeFilterMode === "sub") {
        return hasSubAssignee;
      }
      // assigneeFilterMode === "both"
      return hasMainAssignee || hasSubAssignee;
    });

    const summary = {
      すべて: assignedCases.length,
      納期超過: 0,
      今日まで: 0,
      今日含め3日以内: 0,
      今日含め7日以内: 0,
      "1週間後〜": 0,
      納期未入力: 0,
    };

    assignedCases.forEach((item) => {
      if (!item.dueDate) {
        summary.納期未入力 += 1;
        return;
      }
      const diff = getDayDiff(item.dueDate);
      if (diff < 0) {
        summary.納期超過 += 1;
        return;
      }
      if (diff === 0) {
        summary.今日まで += 1;
      }
      if (diff >= 0 && diff <= 2) {
        summary.今日含め3日以内 += 1;
      }
      if (diff >= 0 && diff <= 6) {
        summary.今日含め7日以内 += 1;
      }
      if (diff >= 7) {
        summary["1週間後〜"] += 1;
      }
    });

    return summary;
  }, [
    filteredCasesForMainView,
    assigneeFilterMode,
    casesSelectedMembers,
    assignments,
    subAssignments,
    expandUserGroups,
    locale,
  ]);

  const filteredData = useMemo(() => {
    // 納期フィルターの対象は「進行中」（PRD 7.1）
    const reverseStatusMapping = getReverseStatusMapping(locale);
    let ongoingCases = filteredCasesForMainView.filter((c) => isOngoingCase(c, reverseStatusMapping));

    // メンバーフィルターの適用
    if (casesSelectedMembers.length > 0) {
      const expandedMembers = expandUserGroups(casesSelectedMembers);
      ongoingCases = ongoingCases.filter((c) => {
        const effectiveAssignee = assignments[c.caseName] ?? c.assignee ?? "";
        const effectiveSubAssignee = subAssignments[c.caseName] ?? c.subAssignee ?? "";
        return expandedMembers.includes(effectiveAssignee) || expandedMembers.includes(effectiveSubAssignee);
      });
    }

    if (activeDueDateFilter === "すべて") {
      return ongoingCases;
    }
    return ongoingCases.filter((item) => {
      if (activeDueDateFilter === "納期未入力") {
        return !item.dueDate;
      }
      if (!item.dueDate) {
        return false;
      }
      const diff = getDayDiff(item.dueDate);
      switch (activeDueDateFilter) {
        case "納期超過":
          return diff < 0;
        case "今日まで":
          return diff === 0;
        case "今日含め3日以内":
          return diff >= 0 && diff <= 2;
        case "今日含め7日以内":
          return diff >= 0 && diff <= 6;
        case "1週間後〜":
          return diff >= 7;
        default:
          return false;
      }
    });
  }, [
    activeDueDateFilter,
    filteredCasesForMainView,
    casesSelectedMembers,
    assignments,
    subAssignments,
    expandUserGroups,
    locale,
  ]);

  // PRD 3.2 B-2: ステータス別は「テナントに設定されているステータス名をそのまま出す」。
  const tenantStatusesForTeamBreakdown = useMemo(() => {
    const preferredOrder: string[] = STATUS_ORDER.map((s) => s.key);
    // 日本語データからステータスを取得（英語モードでも同じデータを使用）
    const statusSet = new Set<string>(caseData.map((c) => c.status));
    statusSet.delete("完了");

    const extras = Array.from(statusSet)
      .filter((s) => !preferredOrder.includes(s))
      .sort((a, b) => a.localeCompare(b, "ja"));

    // 既知の順序（未着手/確認中/…）を優先しつつ、追加ステータスは後ろに並べる
    return [...preferredOrder.filter((s) => statusSet.has(s)), ...extras];
  }, []);

  const tenantStatusSeriesForTeamBreakdown = useMemo(() => {
    // カラーパレットの定義
    const palette = [
      { color: chartPalette.azure["900"], textColor: "white" },
      { color: chartPalette.azure["700"], textColor: "white" },
      {
        color: chartPalette.azure["300"],
        textColor: "black",
        borderColor: chartPalette.azure["500(border only)"],
      },
      {
        color: chartPalette.azure["100"],
        textColor: "black",
        borderColor: chartPalette.azure["500(border only)"],
      },
      { color: chartPalette.orange["800"], textColor: "white" },
      { color: chartPalette.orange["600(base)"], textColor: "white" },
      {
        color: chartPalette.orange["400"],
        textColor: "black",
        borderColor: chartPalette.orange["500(border only)"],
      },
      { color: chartPalette.indigo["900"], textColor: "white" },
      { color: chartPalette.indigo["700"], textColor: "white" },
      {
        color: chartPalette.indigo["400"],
        textColor: "black",
        borderColor: chartPalette.indigo["500(border only)"],
      },
    ];

    let colorIndex = 0;

    return tenantStatusesForTeamBreakdown.map((status) => {
      // 表示名は翻訳（凡例や軸ラベル用）
      const statusName = getLocalizedStatus(locale, status);

      let color: string;
      let badgeVariant: "no-bg-white-text" | "no-bg-black-text";
      let borderColor: string | undefined;

      if (status === "未着手") {
        color = chartPalette.neutral["400"];
        badgeVariant = "no-bg-black-text";
        borderColor = chartPalette.neutral["500(border only)"];
      } else {
        const p = palette[colorIndex % palette.length];
        color = p.color;
        badgeVariant = p.textColor === "white" ? "no-bg-white-text" : "no-bg-black-text";
        borderColor = "borderColor" in p ? p.borderColor : undefined;
        colorIndex++;
      }

      return {
        key: status,
        name: statusName,
        color: color,
        badgeVariant,
        borderColor,
      };
    });
  }, [tenantStatusesForTeamBreakdown, locale]);

  // 残りの主要なuseMemoフック

  const chartData = useMemo(() => {
    // 日本語データを使用してフィルタリング（英語モードでも同じデータを使用）
    // 納期フィルターの対象は「進行中」（PRD 7.1）
    let ongoingCases = caseData.filter((c) => {
      const caseTypeMatch = activeCaseTypeFilter === "すべて" || c.caseType === activeCaseTypeFilter;
      const statusMatch = activeStatusFilter === "すべて" || c.status === activeStatusFilter;
      return caseTypeMatch && statusMatch && c.status !== "完了";
    });

    // メンバーフィルターの適用
    if (casesSelectedMembers.length > 0) {
      const expandedMembers = expandUserGroups(casesSelectedMembers);
      ongoingCases = ongoingCases.filter((c) => {
        const effectiveAssignee = assignments[c.caseName] ?? c.assignee ?? "";
        const effectiveSubAssignee = subAssignments[c.caseName] ?? c.subAssignee ?? "";
        return expandedMembers.includes(effectiveAssignee) || expandedMembers.includes(effectiveSubAssignee);
      });
    }

    const japaneseFilteredData = (() => {
      if (activeDueDateFilter === "すべて") {
        return ongoingCases;
      }
      return ongoingCases.filter((item) => {
        if (activeDueDateFilter === "納期未入力") {
          return !item.dueDate;
        }
        if (!item.dueDate) {
          return false;
        }
        const diff = getDayDiff(item.dueDate);
        switch (activeDueDateFilter) {
          case "納期超過":
            return diff < 0;
          case "今日まで":
            return diff === 0;
          case "今日含め3日以内":
            return diff >= 0 && diff <= 2;
          case "今日含め7日以内":
            return diff >= 0 && diff <= 6;
          case "1週間後〜":
            return diff >= 7;
          default:
            return false;
        }
      });
    })();

    if (caseStatusView === "status" || caseStatusView === "department") {
      type RowData = {
        name: string;
        caseNames: Record<string, string[]>;
      } & Record<string, number | string | Record<string, string[]>>;

      // メンバーフィルター適用
      let targetMembers = teamMembers;
      if (casesSelectedMembers.length > 0) {
        const expandedMembers = expandUserGroups(casesSelectedMembers);
        targetMembers = teamMembers.filter((member) => expandedMembers.includes(member));
      }

      // 日本語メンバー名を使用
      const memberCaseCounts = targetMembers.reduce<Record<string, RowData>>((acc, member) => {
        const row: RowData = {
          name: locale === "en-US" ? MEMBER_MAPPING[locale][member] || member : member,
          caseNames: {},
        };
        for (const status of tenantStatusSeriesForTeamBreakdown) {
          row[`${status.key}_main`] = 0;
          row[`${status.key}_sub`] = 0;
          row.caseNames[`${status.key}_main`] = [];
          row.caseNames[`${status.key}_sub`] = [];
        }
        acc[member] = row;
        return acc;
      }, {});

      japaneseFilteredData.forEach((caseItem) => {
        const targetMembers: { name: string; isSub: boolean }[] = [];
        if (caseItem.assignee && (assigneeFilterMode === "main" || assigneeFilterMode === "both")) {
          targetMembers.push({ name: caseItem.assignee, isSub: false });
        }
        if (caseItem.subAssignee && (assigneeFilterMode === "sub" || assigneeFilterMode === "both")) {
          targetMembers.push({ name: caseItem.subAssignee, isSub: true });
        }

        targetMembers.forEach(({ name, isSub }) => {
          const countItem = memberCaseCounts[name];
          if (!countItem) return;

          // PRD 3.2 B-2: ステータス名はテナント設定のものをそのまま表示する
          const suffix = isSub ? "_sub" : "_main";
          const dataKey = `${caseItem.status}${suffix}`;

          if (typeof countItem[dataKey] === "number") {
            countItem[dataKey] = (countItem[dataKey] as number) + 1;
            // ツールチップには納期情報を含めた案件名を表示する（凡例と同じテキストを使用）
            const dueDateCategory = getDueDateCategory(caseItem.dueDate);
            const dueDateKeyToFilterLabel: Record<string, string> = {
              超過: t("dueDateFilterOverdue"),
              今日: t("dueDateFilterToday"),
              "2日以内": t("dueDateLegend3Days"),
              "3-6日以内": t("dueDateLegend1Week"),
              "7日以降": t("dueDateFilter8DaysPlus"),
              未入力: t("dueDateFilterNoDueDate"),
            };
            const dueDateLabel = dueDateKeyToFilterLabel[dueDateCategory] || dueDateCategory;
            countItem.caseNames[dataKey].push(`（納期：${dueDateLabel}）${caseItem.caseName}`);
          }
        });
      });
      const dataToSort = Object.values(memberCaseCounts);
      dataToSort.sort((a, b) => {
        if (teamCaseSortType === "name") {
          const result = a.name.localeCompare(b.name, "ja");
          return sortOrder === "asc" ? result : -result;
        }

        // caseCount sort
        const totalA = tenantStatusSeriesForTeamBreakdown.reduce((sum, s) => {
          return sum + ((a[`${s.key}_main`] as number) || 0) + ((a[`${s.key}_sub`] as number) || 0);
        }, 0);
        const totalB = tenantStatusSeriesForTeamBreakdown.reduce((sum, s) => {
          return sum + ((b[`${s.key}_main`] as number) || 0) + ((b[`${s.key}_sub`] as number) || 0);
        }, 0);

        if (totalA !== totalB) {
          return sortOrder === "asc" ? totalA - totalB : totalB - totalA;
        }
        // PRD 3.2 B-2: 同率時の並びはユーザー名昇順（安定化）
        return a.name.localeCompare(b.name, "ja");
      });
      return dataToSort;
    } else if (caseStatusView === "type") {
      // caseType view
      // データキーは日本語キー（CASE_TYPE_ORDER）で統一
      type RowData = {
        name: string;
        caseNames: Record<string, string[]>;
      } & Record<string, number | string | Record<string, string[]>>;

      // メンバーフィルター適用
      let targetMembers = teamMembers;
      if (casesSelectedMembers.length > 0) {
        const expandedMembers = expandUserGroups(casesSelectedMembers);
        targetMembers = teamMembers.filter((member) => expandedMembers.includes(member));
      }

      // 日本語メンバー名を使用
      const memberCaseCounts = targetMembers.reduce<Record<string, RowData>>((acc, member) => {
        const row: RowData = {
          name: locale === "en-US" ? MEMBER_MAPPING[locale][member] || member : member,
          caseNames: {},
        };
        CASE_TYPE_ORDER.forEach((caseType) => {
          row[`${caseType}_main`] = 0;
          row[`${caseType}_sub`] = 0;
          row.caseNames[`${caseType}_main`] = [];
          row.caseNames[`${caseType}_sub`] = [];
        });
        acc[member] = row;
        return acc;
      }, {});

      japaneseFilteredData.forEach((caseItem) => {
        const targetMembers: { name: string; isSub: boolean }[] = [];
        if (caseItem.assignee && (assigneeFilterMode === "main" || assigneeFilterMode === "both")) {
          targetMembers.push({ name: caseItem.assignee, isSub: false });
        }
        if (caseItem.subAssignee && (assigneeFilterMode === "sub" || assigneeFilterMode === "both")) {
          targetMembers.push({ name: caseItem.subAssignee, isSub: true });
        }

        targetMembers.forEach(({ name, isSub }) => {
          const countItem = memberCaseCounts[name];
          const suffix = isSub ? "_sub" : "_main";
          // caseItem.caseTypeは日本語データなので、そのまま使用
          const key = `${caseItem.caseType}${suffix}` as keyof typeof countItem;

          if (countItem && typeof countItem[key] === "number") {
            (countItem[key] as number) += 1;
            // ツールチップには納期情報を含めた案件名を表示する（凡例と同じテキストを使用）
            const dueDateCategory = getDueDateCategory(caseItem.dueDate);
            const dueDateKeyToFilterLabel: Record<string, string> = {
              超過: t("dueDateFilterOverdue"),
              今日: t("dueDateFilterToday"),
              "2日以内": t("dueDateLegend3Days"),
              "3-6日以内": t("dueDateLegend1Week"),
              "7日以降": t("dueDateFilter8DaysPlus"),
              未入力: t("dueDateFilterNoDueDate"),
            };
            const dueDateLabel = dueDateKeyToFilterLabel[dueDateCategory] || dueDateCategory;
            countItem.caseNames[key].push(`（納期：${dueDateLabel}）${caseItem.caseName}`);
          }
        });
      });

      const dataToSort = Object.values(memberCaseCounts);
      dataToSort.sort((a, b) => {
        if (teamCaseSortType === "name") {
          const result = a.name.localeCompare(b.name, "ja");
          return sortOrder === "asc" ? result : -result;
        }

        // caseCount sort
        const totalA = CASE_TYPE_ORDER.reduce((sum, caseType) => {
          return sum + ((a[`${caseType}_main`] as number) || 0) + ((a[`${caseType}_sub`] as number) || 0);
        }, 0);
        const totalB = CASE_TYPE_ORDER.reduce((sum, caseType) => {
          return sum + ((b[`${caseType}_main`] as number) || 0) + ((b[`${caseType}_sub`] as number) || 0);
        }, 0);
        if (totalA !== totalB) {
          return sortOrder === "asc" ? totalA - totalB : totalB - totalA;
        }
        return a.name.localeCompare(b.name, "ja");
      });

      return dataToSort;
    } else if (caseStatusView === "dueDate") {
      // dueDate view
      // 納期フィルターと同じ順番: 未入力→超過→今日→2日以内→3-6日以内→7日以降
      // データキーは日本語キーで統一
      const japaneseDueDateCategories = ["未入力", "超過", "今日", "2日以内", "3-6日以内", "7日以降"];
      type RowData = {
        name: string;
        caseNames: Record<string, string[]>;
      } & Record<string, number | string | Record<string, string[]>>;

      // メンバーフィルター適用
      let targetMembers = teamMembers;
      if (casesSelectedMembers.length > 0) {
        const expandedMembers = expandUserGroups(casesSelectedMembers);
        targetMembers = teamMembers.filter((member) => expandedMembers.includes(member));
      }

      // 日本語メンバー名を使用
      const memberCaseCounts = targetMembers.reduce<Record<string, RowData>>((acc, member) => {
        const row: RowData = {
          name: locale === "en-US" ? MEMBER_MAPPING[locale][member] || member : member,
          caseNames: {},
        };
        for (const category of japaneseDueDateCategories) {
          row[`${category}_main`] = 0;
          row[`${category}_sub`] = 0;
          row.caseNames[`${category}_main`] = [];
          row.caseNames[`${category}_sub`] = [];
        }
        acc[member] = row;
        return acc;
      }, {});

      japaneseFilteredData.forEach((caseItem) => {
        const targetMembers: { name: string; isSub: boolean }[] = [];
        if (caseItem.assignee && (assigneeFilterMode === "main" || assigneeFilterMode === "both")) {
          targetMembers.push({ name: caseItem.assignee, isSub: false });
        }
        if (caseItem.subAssignee && (assigneeFilterMode === "sub" || assigneeFilterMode === "both")) {
          targetMembers.push({ name: caseItem.subAssignee, isSub: true });
        }

        const category = getDueDateCategory(caseItem.dueDate);

        targetMembers.forEach(({ name, isSub }) => {
          const countItem = memberCaseCounts[name];
          if (!countItem) return;

          const suffix = isSub ? "_sub" : "_main";
          const dataKey = `${category}${suffix}`;

          if (typeof countItem[dataKey] === "number") {
            countItem[dataKey] = (countItem[dataKey] as number) + 1;
            // 納期別の場合、tooltipにステータス名も表示するため「（ステータス名）案件名」の形式で保存
            countItem.caseNames[dataKey].push(`（${caseItem.status}）${caseItem.caseName}`);
          }
        });
      });

      const dataToSort = Object.values(memberCaseCounts);
      dataToSort.sort((a, b) => {
        if (teamCaseSortType === "name") {
          const result = a.name.localeCompare(b.name, "ja");
          return sortOrder === "asc" ? result : -result;
        }

        // caseCount sort
        const totalA = japaneseDueDateCategories.reduce((sum, category) => {
          return sum + ((a[`${category}_main`] as number) || 0) + ((a[`${category}_sub`] as number) || 0);
        }, 0);
        const totalB = japaneseDueDateCategories.reduce((sum, category) => {
          return sum + ((b[`${category}_main`] as number) || 0) + ((b[`${category}_sub`] as number) || 0);
        }, 0);

        if (totalA !== totalB) {
          return sortOrder === "asc" ? totalA - totalB : totalB - totalA;
        }
        return a.name.localeCompare(b.name, "ja");
      });
      return dataToSort;
    }
    return [];
  }, [
    sortOrder,
    teamCaseSortType,
    caseStatusView,
    assigneeFilterMode,
    tenantStatusSeriesForTeamBreakdown,
    activeCaseTypeFilter,
    activeStatusFilter,
    activeDueDateFilter,
    casesSelectedMembers,
    assignments,
    subAssignments,
    expandUserGroups,
    locale,
    t,
  ]);

  // teamStatusColumnsはJSXを含むため後で処理
  const leadTimeCompositionData = useMemo(() => {
    const result: LeadTimeCompositionData[] = [];
    const todayDate = new Date();

    // 日本語データを使用して集計（英語モードでも同じデータを使用）
    // メンバー名は日本語のものを使用
    teamMembers.forEach((member) => {
      const data: LeadTimeCompositionData = {
        name: locale === "en-US" ? MEMBER_MAPPING[locale][member] || member : member,
        main_idle: 0,
        main_work: 0,
        main_wait: 0,
        sub_work: 0,
        sub_wait: 0,
        // ステータス別フィールドの初期化
        main_未着手: 0,
        main_確認中: 0,
        main_2次確認中: 0,
        main_自部門外確認中: 0,
        sub_未着手: 0,
        sub_確認中: 0,
        sub_2次確認中: 0,
        sub_自部門外確認中: 0,
        main_count: 0,
        sub_count: 0,
        medianFirstReplyTime: 0,
      };

      let mainCaseCount = 0;
      let subCaseCount = 0;

      // 日本語データを使用（caseDataは日本語のデータ）
      let memberCases = caseData.filter(
        (c) =>
          (c.assignee === member || c.subAssignee === member) &&
          (leadTimeCompositionCaseTypeFilter === "すべて" ||
            leadTimeCompositionCaseTypeFilter === "All" ||
            c.caseType === leadTimeCompositionCaseTypeFilter),
      );

      // 時間タブ用のメンバーフィルター適用
      if (timeSelectedMembers.length > 0) {
        memberCases = memberCases.filter((c) => {
          const assignee = assignments[c.id] || c.assignee;
          return timeSelectedMembers.includes(assignee);
        });
      }

      // 時間タブ用の期間フィルター適用
      if (timeDateRange.start || timeDateRange.end) {
        memberCases = memberCases.filter((c) => {
          if (!c.startDate) return false;
          const startDate = new Date(c.startDate);
          if (timeDateRange.start && startDate < timeDateRange.start) return false;
          if (timeDateRange.end) {
            const endDate = new Date(timeDateRange.end.getFullYear(), timeDateRange.end.getMonth() + 1, 0);
            if (startDate > endDate) return false;
          }
          return true;
        });
      }

      const mainCases = memberCases.filter((c) => c.assignee === member);
      const firstReplyTimes = mainCases
        .filter((c) => c.startDate && c.firstReplyDate)
        .map((c) => calculateFirstReplyTime(c.startDate as string, c.firstReplyDate as string));

      memberCases.forEach((c) => {
        const isMain = c.assignee === member;
        const isSub = c.subAssignee === member;

        if (isMain) mainCaseCount++;
        if (isSub) subCaseCount++;

        c.statusHistory?.forEach((history) => {
          const endDate = history.endDate ? new Date(history.endDate) : todayDate;
          const duration = (endDate.getTime() - new Date(history.startDate).getTime()) / (1000 * 60 * 60 * 24);

          if (duration < 0) return;

          // 非表示（IGNORE）に該当するステータスは集計から除外
          const isMainIgnored = (leadTimeCategories.MAIN.IGNORE as readonly string[]).includes(history.status);
          const isSubIgnored = (leadTimeCategories.SUB.IGNORE as readonly string[]).includes(history.status);

          if (isMain) {
            // グルーピング済み集計
            if ((leadTimeCategories.MAIN.IDLE as readonly string[]).includes(history.status)) {
              data.main_idle += duration;
            } else if ((leadTimeCategories.MAIN.WORK as readonly string[]).includes(history.status)) {
              data.main_work += duration;
            } else if ((leadTimeCategories.MAIN.WAIT as readonly string[]).includes(history.status)) {
              data.main_wait += duration;
            }
            // ステータス別集計（IGNOREに該当しない場合のみ）
            if (!isMainIgnored) {
              if (history.status === "未着手") {
                data.main_未着手 = (data.main_未着手 || 0) + duration;
              } else if (history.status === "確認中") {
                data.main_確認中 = (data.main_確認中 || 0) + duration;
              } else if (history.status === "2次確認中") {
                data.main_2次確認中 = (data.main_2次確認中 || 0) + duration;
              } else if (history.status === "自部門外確認中") {
                data.main_自部門外確認中 = (data.main_自部門外確認中 || 0) + duration;
              }
            }
          } else if (isSub) {
            // グルーピング済み集計
            if ((leadTimeCategories.SUB.WORK as readonly string[]).includes(history.status)) {
              data.sub_work += duration;
            } else if ((leadTimeCategories.SUB.WAIT as readonly string[]).includes(history.status)) {
              data.sub_wait += duration;
            }
            // ステータス別集計（IGNOREに該当しない場合のみ）
            if (!isSubIgnored) {
              if (history.status === "未着手") {
                data.sub_未着手 = (data.sub_未着手 || 0) + duration;
              } else if (history.status === "確認中") {
                data.sub_確認中 = (data.sub_確認中 || 0) + duration;
              } else if (history.status === "2次確認中") {
                data.sub_2次確認中 = (data.sub_2次確認中 || 0) + duration;
              } else if (history.status === "自部門外確認中") {
                data.sub_自部門外確認中 = (data.sub_自部門外確認中 || 0) + duration;
              }
            }
          }
        });
      });

      if (mainCaseCount > 0) {
        data.main_idle = parseFloat((data.main_idle / mainCaseCount).toFixed(1));
        data.main_work = parseFloat((data.main_work / mainCaseCount).toFixed(1));
        data.main_wait = parseFloat((data.main_wait / mainCaseCount).toFixed(1));
        // ステータス別の平均値計算
        data.main_未着手 = parseFloat(((data.main_未着手 || 0) / mainCaseCount).toFixed(1));
        data.main_確認中 = parseFloat(((data.main_確認中 || 0) / mainCaseCount).toFixed(1));
        data.main_2次確認中 = parseFloat(((data.main_2次確認中 || 0) / mainCaseCount).toFixed(1));
        data.main_自部門外確認中 = parseFloat(((data.main_自部門外確認中 || 0) / mainCaseCount).toFixed(1));
      }
      if (subCaseCount > 0) {
        data.sub_work = parseFloat((data.sub_work / subCaseCount).toFixed(1));
        data.sub_wait = parseFloat((data.sub_wait / subCaseCount).toFixed(1));
        // ステータス別の平均値計算
        data.sub_未着手 = parseFloat(((data.sub_未着手 || 0) / subCaseCount).toFixed(1));
        data.sub_確認中 = parseFloat(((data.sub_確認中 || 0) / subCaseCount).toFixed(1));
        data.sub_2次確認中 = parseFloat(((data.sub_2次確認中 || 0) / subCaseCount).toFixed(1));
        data.sub_自部門外確認中 = parseFloat(((data.sub_自部門外確認中 || 0) / subCaseCount).toFixed(1));
      }

      data.main_count = mainCaseCount;
      data.sub_count = subCaseCount;
      data.medianFirstReplyTime = parseFloat(calculateMedian(firstReplyTimes).toFixed(1));

      result.push(data);
    });

    // ソートロジックを適用
    if (leadTimeCompositionSortType === "caseCount") {
      result.sort((a, b) => {
        const aMainTotal = a.main_idle + a.main_work + a.main_wait;
        const bMainTotal = b.main_idle + b.main_work + b.main_wait;
        const aSubTotal = a.sub_work + a.sub_wait;
        const bSubTotal = b.sub_work + b.sub_wait;
        const aTotal =
          leadTimeCompositionAssigneeFilterMode === "main"
            ? aMainTotal
            : leadTimeCompositionAssigneeFilterMode === "sub"
              ? aSubTotal
              : aMainTotal + aSubTotal;
        const bTotal =
          leadTimeCompositionAssigneeFilterMode === "main"
            ? bMainTotal
            : leadTimeCompositionAssigneeFilterMode === "sub"
              ? bSubTotal
              : bMainTotal + bSubTotal;
        if (aTotal !== bTotal) {
          return leadTimeCompositionSortOrder === "asc" ? aTotal - bTotal : bTotal - aTotal;
        }
        // 同率時は名前順
        return a.name.localeCompare(b.name);
      });
    } else {
      result.sort((a, b) => {
        const nameCompare = a.name.localeCompare(b.name);
        return leadTimeCompositionSortOrder === "asc" ? nameCompare : -nameCompare;
      });
    }

    return result;
  }, [
    leadTimeCompositionCaseTypeFilter,
    leadTimeCategories,
    leadTimeCompositionSortType,
    leadTimeCompositionSortOrder,
    leadTimeCompositionAssigneeFilterMode,
    timeSelectedMembers,
    timeDateRange,
    assignments,
    locale,
  ]);

  const memberPerformanceData = useMemo(() => {
    const result: MemberPerformanceData[] = [];

    // 集計期間フィルタの適用
    let casesToConsider = localizedCaseData;
    if (performanceDateRange.start || performanceDateRange.end) {
      casesToConsider = localizedCaseData.filter((c) => {
        if (!c.completionDate) return false;
        const completionDate = new Date(c.completionDate);
        if (performanceDateRange.start && completionDate < performanceDateRange.start) return false;
        if (performanceDateRange.end && completionDate > performanceDateRange.end) return false;
        return true;
      });
    }

    // メンバーフィルタの適用
    let targetMembers = localizedTeamMembers;
    if (performanceSelectedMembers.length > 0) {
      targetMembers = performanceSelectedMembers;
    }

    targetMembers.forEach((member) => {
      // 完了案件のみを対象とする
      let completedCases = casesToConsider.filter(
        (c) =>
          c.completionDate &&
          (c.assignee === member || c.subAssignee === member) &&
          (performanceOverviewCaseTypeFilter === "すべて" ||
            performanceOverviewCaseTypeFilter === "All" ||
            c.caseType === performanceOverviewCaseTypeFilter),
      );

      // 納期フィルターの適用
      if (performanceOverviewDueDateFilter !== "すべて") {
        completedCases = completedCases.filter((c) => {
          if (performanceOverviewDueDateFilter === "納期未入力") {
            return !c.dueDate;
          }
          if (!c.dueDate) {
            return false;
          }
          if (!c.completionDate) {
            return false;
          }
          // 日付単位で比較（時刻は無視）
          const completionDate = new Date(c.completionDate);
          completionDate.setHours(0, 0, 0, 0);
          const dueDate = new Date(c.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          if (performanceOverviewDueDateFilter === "納期内完了") {
            return completionDate <= dueDate;
          }
          if (performanceOverviewDueDateFilter === "納期超過") {
            return completionDate > dueDate;
          }
          return false;
        });
      }

      // 初回返信速度の計算（主担当案件のみ）
      const mainCases = completedCases.filter((c) => c.assignee === member);
      const firstReplyTimes = mainCases
        .filter((c) => c.startDate && c.firstReplyDate)
        .map((c) => calculateFirstReplyTime(c.startDate as string, c.firstReplyDate as string));

      if (performanceOverviewAssigneeFilterMode === "both") {
        // 主担当と副担当を別々に集計
        const mainCasesForCount = completedCases.filter((c) => c.assignee === member);
        const subCasesForCount = completedCases.filter((c) => c.subAssignee === member);

        let onTimeCompletionCount_main = 0;
        let overdueCompletionCount_main = 0;
        let noDueDateCompletionCount_main = 0;

        mainCasesForCount.forEach((c) => {
          if (!c.dueDate) {
            noDueDateCompletionCount_main += 1;
          } else if (c.dueDate && c.completionDate) {
            const completionDate = new Date(c.completionDate);
            completionDate.setHours(0, 0, 0, 0);
            const dueDate = new Date(c.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            if (completionDate > dueDate) {
              overdueCompletionCount_main += 1;
            } else {
              onTimeCompletionCount_main += 1;
            }
          }
        });

        let onTimeCompletionCount_sub = 0;
        let overdueCompletionCount_sub = 0;
        let noDueDateCompletionCount_sub = 0;

        subCasesForCount.forEach((c) => {
          if (!c.dueDate) {
            noDueDateCompletionCount_sub += 1;
          } else if (c.dueDate && c.completionDate) {
            const completionDate = new Date(c.completionDate);
            completionDate.setHours(0, 0, 0, 0);
            const dueDate = new Date(c.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            if (completionDate > dueDate) {
              overdueCompletionCount_sub += 1;
            } else {
              onTimeCompletionCount_sub += 1;
            }
          }
        });

        result.push({
          name: member,
          onTimeCompletionCount: onTimeCompletionCount_main + onTimeCompletionCount_sub,
          overdueCompletionCount: overdueCompletionCount_main + overdueCompletionCount_sub,
          noDueDateCompletionCount: noDueDateCompletionCount_main + noDueDateCompletionCount_sub,
          medianFirstReplyTime: parseFloat(calculateMedian(firstReplyTimes).toFixed(1)),
          onTimeCompletionCount_main,
          overdueCompletionCount_main,
          noDueDateCompletionCount_main,
          onTimeCompletionCount_sub,
          overdueCompletionCount_sub,
          noDueDateCompletionCount_sub,
        });
      } else {
        // 集計対象のフィルタリング（主担当・副担当の設定に応じて）
        let casesForCount: typeof completedCases = [];
        if (performanceOverviewAssigneeFilterMode === "main") {
          casesForCount = completedCases.filter((c) => c.assignee === member);
        } else if (performanceOverviewAssigneeFilterMode === "sub") {
          casesForCount = completedCases.filter((c) => c.subAssignee === member);
        }

        // 納期内完了・納期超過完了・納期未入力に分類
        let onTimeCompletionCount = 0;
        let overdueCompletionCount = 0;
        let noDueDateCompletionCount = 0;

        casesForCount.forEach((c) => {
          if (!c.dueDate) {
            // 納期未入力
            noDueDateCompletionCount += 1;
          } else if (c.dueDate && c.completionDate) {
            // 日付単位で比較（時刻は無視）
            const completionDate = new Date(c.completionDate);
            completionDate.setHours(0, 0, 0, 0);
            const dueDate = new Date(c.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            if (completionDate > dueDate) {
              // 納期超過完了
              overdueCompletionCount += 1;
            } else {
              // 納期内完了
              onTimeCompletionCount += 1;
            }
          }
        });

        result.push({
          name: member,
          onTimeCompletionCount,
          overdueCompletionCount,
          noDueDateCompletionCount,
          medianFirstReplyTime: parseFloat(calculateMedian(firstReplyTimes).toFixed(1)),
        });
      }
    });

    // ソート処理
    const sortedResult = [...result].sort((a, b) => {
      if (leadTimePerformanceSortType === "caseCount") {
        const aTotal = a.onTimeCompletionCount + a.overdueCompletionCount + a.noDueDateCompletionCount;
        const bTotal = b.onTimeCompletionCount + b.overdueCompletionCount + b.noDueDateCompletionCount;
        if (aTotal !== bTotal) {
          return leadTimePerformanceSortOrder === "asc" ? aTotal - bTotal : bTotal - aTotal;
        }
        // 同率時はユーザー名の昇順
        return a.name.localeCompare(b.name, "ja");
      } else {
        // ユーザー名順
        const nameCompare = a.name.localeCompare(b.name, "ja");
        return leadTimePerformanceSortOrder === "asc" ? nameCompare : -nameCompare;
      }
    });

    return sortedResult;
  }, [
    performanceOverviewCaseTypeFilter,
    performanceOverviewDueDateFilter,
    performanceOverviewAssigneeFilterMode,
    performanceDateRange,
    performanceSelectedMembers,
    leadTimePerformanceSortType,
    leadTimePerformanceSortOrder,
    localizedCaseData,
    localizedTeamMembers,
  ]);

  // WorkloadTab用: メンバー別パフォーマンスデータ
  const workloadMemberPerformanceData = useMemo(() => {
    const result: MemberPerformanceData[] = [];

    // 集計期間フィルタの適用
    let casesToConsider = localizedCaseData;
    if (workloadDateRange.start || workloadDateRange.end) {
      casesToConsider = localizedCaseData.filter((c) => {
        if (!c.completionDate) return false;
        const completionDate = new Date(c.completionDate);
        if (workloadDateRange.start && completionDate < workloadDateRange.start) return false;
        if (workloadDateRange.end && completionDate > workloadDateRange.end) return false;
        return true;
      });
    }

    // メンバーフィルタの適用
    let targetMembers = localizedTeamMembers;
    if (workloadSelectedMembers.length > 0) {
      targetMembers = expandUserGroups(workloadSelectedMembers);
    }

    targetMembers.forEach((member) => {
      // 完了案件のみを対象とする
      let completedCases = casesToConsider.filter(
        (c) =>
          c.completionDate &&
          (c.assignee === member || c.subAssignee === member) &&
          (performanceOverviewCaseTypeFilter === "すべて" ||
            performanceOverviewCaseTypeFilter === "All" ||
            c.caseType === performanceOverviewCaseTypeFilter),
      );

      // 納期フィルターの適用
      if (performanceOverviewDueDateFilter !== "すべて") {
        completedCases = completedCases.filter((c) => {
          if (performanceOverviewDueDateFilter === "納期未入力") {
            return !c.dueDate;
          }
          if (!c.dueDate) {
            return false;
          }
          if (!c.completionDate) {
            return false;
          }
          // 日付単位で比較（時刻は無視）
          const completionDate = new Date(c.completionDate);
          completionDate.setHours(0, 0, 0, 0);
          const dueDate = new Date(c.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          if (performanceOverviewDueDateFilter === "納期内完了") {
            return completionDate <= dueDate;
          }
          if (performanceOverviewDueDateFilter === "納期超過") {
            return completionDate > dueDate;
          }
          return false;
        });
      }

      // 初回返信速度の計算（主担当案件のみ）
      const mainCases = completedCases.filter((c) => c.assignee === member);
      const firstReplyTimes = mainCases
        .filter((c) => c.startDate && c.firstReplyDate)
        .map((c) => calculateFirstReplyTime(c.startDate as string, c.firstReplyDate as string));

      if (performanceOverviewAssigneeFilterMode === "both") {
        // 主担当と副担当を別々に集計
        const mainCasesForCount = completedCases.filter((c) => c.assignee === member);
        const subCasesForCount = completedCases.filter((c) => c.subAssignee === member);

        let onTimeCompletionCount_main = 0;
        let overdueCompletionCount_main = 0;
        let noDueDateCompletionCount_main = 0;

        mainCasesForCount.forEach((c) => {
          if (!c.dueDate) {
            noDueDateCompletionCount_main += 1;
          } else if (c.dueDate && c.completionDate) {
            const completionDate = new Date(c.completionDate);
            completionDate.setHours(0, 0, 0, 0);
            const dueDate = new Date(c.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            if (completionDate > dueDate) {
              overdueCompletionCount_main += 1;
            } else {
              onTimeCompletionCount_main += 1;
            }
          }
        });

        let onTimeCompletionCount_sub = 0;
        let overdueCompletionCount_sub = 0;
        let noDueDateCompletionCount_sub = 0;

        subCasesForCount.forEach((c) => {
          if (!c.dueDate) {
            noDueDateCompletionCount_sub += 1;
          } else if (c.dueDate && c.completionDate) {
            const completionDate = new Date(c.completionDate);
            completionDate.setHours(0, 0, 0, 0);
            const dueDate = new Date(c.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            if (completionDate > dueDate) {
              overdueCompletionCount_sub += 1;
            } else {
              onTimeCompletionCount_sub += 1;
            }
          }
        });

        result.push({
          name: member,
          onTimeCompletionCount: onTimeCompletionCount_main + onTimeCompletionCount_sub,
          overdueCompletionCount: overdueCompletionCount_main + overdueCompletionCount_sub,
          noDueDateCompletionCount: noDueDateCompletionCount_main + noDueDateCompletionCount_sub,
          medianFirstReplyTime: parseFloat(calculateMedian(firstReplyTimes).toFixed(1)),
          onTimeCompletionCount_main,
          overdueCompletionCount_main,
          noDueDateCompletionCount_main,
          onTimeCompletionCount_sub,
          overdueCompletionCount_sub,
          noDueDateCompletionCount_sub,
        });
      } else {
        // 集計対象のフィルタリング（主担当・副担当の設定に応じて）
        let casesForCount: typeof completedCases = [];
        if (performanceOverviewAssigneeFilterMode === "main") {
          casesForCount = completedCases.filter((c) => c.assignee === member);
        } else if (performanceOverviewAssigneeFilterMode === "sub") {
          casesForCount = completedCases.filter((c) => c.subAssignee === member);
        }

        // 納期内完了・納期超過完了・納期未入力に分類
        let onTimeCompletionCount = 0;
        let overdueCompletionCount = 0;
        let noDueDateCompletionCount = 0;

        casesForCount.forEach((c) => {
          if (!c.dueDate) {
            // 納期未入力
            noDueDateCompletionCount += 1;
          } else if (c.dueDate && c.completionDate) {
            // 日付単位で比較（時刻は無視）
            const completionDate = new Date(c.completionDate);
            completionDate.setHours(0, 0, 0, 0);
            const dueDate = new Date(c.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            if (completionDate > dueDate) {
              // 納期超過完了
              overdueCompletionCount += 1;
            } else {
              // 納期内完了
              onTimeCompletionCount += 1;
            }
          }
        });

        result.push({
          name: member,
          onTimeCompletionCount,
          overdueCompletionCount,
          noDueDateCompletionCount,
          medianFirstReplyTime: parseFloat(calculateMedian(firstReplyTimes).toFixed(1)),
        });
      }
    });

    // ソート処理
    const sortedResult = [...result].sort((a, b) => {
      if (leadTimePerformanceSortType === "caseCount") {
        const aTotal = a.onTimeCompletionCount + a.overdueCompletionCount + a.noDueDateCompletionCount;
        const bTotal = b.onTimeCompletionCount + b.overdueCompletionCount + b.noDueDateCompletionCount;
        if (aTotal !== bTotal) {
          return leadTimePerformanceSortOrder === "asc" ? aTotal - bTotal : bTotal - aTotal;
        }
        // 同率時はユーザー名の昇順
        return a.name.localeCompare(b.name, "ja");
      } else {
        // ユーザー名順
        const nameCompare = a.name.localeCompare(b.name, "ja");
        return leadTimePerformanceSortOrder === "asc" ? nameCompare : -nameCompare;
      }
    });

    return sortedResult;
  }, [
    performanceOverviewCaseTypeFilter,
    performanceOverviewDueDateFilter,
    performanceOverviewAssigneeFilterMode,
    workloadDateRange,
    workloadSelectedMembers,
    leadTimePerformanceSortType,
    leadTimePerformanceSortOrder,
    localizedCaseData,
    localizedTeamMembers,
    expandUserGroups,
  ]);

  // メンバー別案件タイプ別データの集計
  const memberPerformanceByCaseTypeData = useMemo(() => {
    const result: MemberPerformanceByCaseTypeData[] = [];

    // 集計期間フィルタの適用
    let casesToConsider = localizedCaseData;
    if (performanceDateRange.start || performanceDateRange.end) {
      casesToConsider = localizedCaseData.filter((c) => {
        if (!c.completionDate) return false;
        const completionDate = new Date(c.completionDate);
        if (performanceDateRange.start && completionDate < performanceDateRange.start) return false;
        if (performanceDateRange.end && completionDate > performanceDateRange.end) return false;
        return true;
      });
    }

    // メンバーフィルタの適用
    let targetMembers = localizedTeamMembers;
    if (performanceSelectedMembers.length > 0) {
      targetMembers = performanceSelectedMembers;
    }

    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    targetMembers.forEach((member) => {
      // 完了案件のみを対象とする（案件タイプフィルタは適用しない）
      let completedCases = casesToConsider.filter(
        (c) => c.completionDate && (c.assignee === member || c.subAssignee === member),
      );

      // 納期フィルターの適用
      if (performanceOverviewDueDateFilter !== "すべて") {
        completedCases = completedCases.filter((c) => {
          if (performanceOverviewDueDateFilter === "納期未入力") {
            return !c.dueDate;
          }
          if (!c.dueDate) {
            return false;
          }
          if (!c.completionDate) {
            return false;
          }
          // 日付単位で比較（時刻は無視）
          const completionDate = new Date(c.completionDate);
          completionDate.setHours(0, 0, 0, 0);
          const dueDate = new Date(c.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          if (performanceOverviewDueDateFilter === "納期内完了") {
            return completionDate <= dueDate;
          }
          if (performanceOverviewDueDateFilter === "納期超過") {
            return completionDate > dueDate;
          }
          return false;
        });
      }

      // 初回返信速度の計算（主担当案件のみ）
      const mainCases = completedCases.filter((c) => c.assignee === member);
      const firstReplyTimes = mainCases
        .filter((c) => c.startDate && c.firstReplyDate)
        .map((c) => calculateFirstReplyTime(c.startDate as string, c.firstReplyDate as string));

      if (performanceOverviewAssigneeFilterMode === "both") {
        // 主担当と副担当を別々に集計
        const mainCasesForCount = completedCases.filter((c) => c.assignee === member);
        const subCasesForCount = completedCases.filter((c) => c.subAssignee === member);

        const caseTypeCounts_main: Record<CaseType, number> = {
          契約書審査: 0,
          契約書起案: 0,
          法務相談: 0,
          その他: 0,
        };

        mainCasesForCount.forEach((c) => {
          const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;
          if (caseTypeCounts_main[caseType] !== undefined) {
            caseTypeCounts_main[caseType] += 1;
          }
        });

        const caseTypeCounts_sub: Record<CaseType, number> = {
          契約書審査: 0,
          契約書起案: 0,
          法務相談: 0,
          その他: 0,
        };

        subCasesForCount.forEach((c) => {
          const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;
          if (caseTypeCounts_sub[caseType] !== undefined) {
            caseTypeCounts_sub[caseType] += 1;
          }
        });

        result.push({
          name: member,
          medianFirstReplyTime: parseFloat(calculateMedian(firstReplyTimes).toFixed(1)),
          契約書審査_main: caseTypeCounts_main.契約書審査,
          契約書起案_main: caseTypeCounts_main.契約書起案,
          法務相談_main: caseTypeCounts_main.法務相談,
          その他_main: caseTypeCounts_main.その他,
          契約書審査_sub: caseTypeCounts_sub.契約書審査,
          契約書起案_sub: caseTypeCounts_sub.契約書起案,
          法務相談_sub: caseTypeCounts_sub.法務相談,
          その他_sub: caseTypeCounts_sub.その他,
        });
      } else {
        // 集計対象のフィルタリング（主担当・副担当の設定に応じて）
        let casesForCount: typeof completedCases = [];
        if (performanceOverviewAssigneeFilterMode === "main") {
          casesForCount = completedCases.filter((c) => c.assignee === member);
        } else if (performanceOverviewAssigneeFilterMode === "sub") {
          casesForCount = completedCases.filter((c) => c.subAssignee === member);
        }

        // 案件タイプ別に分類
        const caseTypeCounts: Record<CaseType, number> = {
          契約書審査: 0,
          契約書起案: 0,
          法務相談: 0,
          その他: 0,
        };

        casesForCount.forEach((c) => {
          const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;
          if (caseTypeCounts[caseType] !== undefined) {
            caseTypeCounts[caseType] += 1;
          }
        });

        result.push({
          name: member,
          medianFirstReplyTime: parseFloat(calculateMedian(firstReplyTimes).toFixed(1)),
          契約書審査: caseTypeCounts.契約書審査,
          契約書起案: caseTypeCounts.契約書起案,
          法務相談: caseTypeCounts.法務相談,
          その他: caseTypeCounts.その他,
        });
      }
    });

    // ソート処理（納期別ビューと同じロジック）
    const sortedResult = [...result].sort((a, b) => {
      if (leadTimePerformanceSortType === "caseCount") {
        const calculateTotal = (row: MemberPerformanceByCaseTypeData): number => {
          if (performanceOverviewAssigneeFilterMode === "both") {
            return (
              (row.契約書審査_main || 0) +
              (row.契約書起案_main || 0) +
              (row.法務相談_main || 0) +
              (row.その他_main || 0) +
              (row.契約書審査_sub || 0) +
              (row.契約書起案_sub || 0) +
              (row.法務相談_sub || 0) +
              (row.その他_sub || 0)
            );
          }
          return (row.契約書審査 || 0) + (row.契約書起案 || 0) + (row.法務相談 || 0) + (row.その他 || 0);
        };
        const aTotal = calculateTotal(a);
        const bTotal = calculateTotal(b);
        if (aTotal !== bTotal) {
          return leadTimePerformanceSortOrder === "asc" ? aTotal - bTotal : bTotal - aTotal;
        }
        // 同率時はユーザー名の昇順
        return a.name.localeCompare(b.name, "ja");
      } else {
        // ユーザー名順
        const nameCompare = a.name.localeCompare(b.name, "ja");
        return leadTimePerformanceSortOrder === "asc" ? nameCompare : -nameCompare;
      }
    });

    return sortedResult;
  }, [
    performanceOverviewDueDateFilter,
    performanceOverviewAssigneeFilterMode,
    performanceDateRange,
    performanceSelectedMembers,
    leadTimePerformanceSortType,
    leadTimePerformanceSortOrder,
    localizedCaseData,
    localizedTeamMembers,
    locale,
  ]);

  // WorkloadTab用: メンバー別案件タイプ別データの集計
  const workloadMemberPerformanceByCaseTypeData = useMemo(() => {
    const result: MemberPerformanceByCaseTypeData[] = [];

    // 集計期間フィルタの適用
    let casesToConsider = localizedCaseData;
    if (workloadDateRange.start || workloadDateRange.end) {
      casesToConsider = localizedCaseData.filter((c) => {
        if (!c.completionDate) return false;
        const completionDate = new Date(c.completionDate);
        if (workloadDateRange.start && completionDate < workloadDateRange.start) return false;
        if (workloadDateRange.end && completionDate > workloadDateRange.end) return false;
        return true;
      });
    }

    // メンバーフィルタの適用
    let targetMembers = localizedTeamMembers;
    if (workloadSelectedMembers.length > 0) {
      targetMembers = expandUserGroups(workloadSelectedMembers);
    }

    const reverseCaseTypeMapping = getReverseCaseTypeMapping(locale);

    targetMembers.forEach((member) => {
      // 完了案件のみを対象とする（案件タイプフィルタは適用しない）
      let completedCases = casesToConsider.filter(
        (c) => c.completionDate && (c.assignee === member || c.subAssignee === member),
      );

      // 納期フィルターの適用
      if (performanceOverviewDueDateFilter !== "すべて") {
        completedCases = completedCases.filter((c) => {
          if (performanceOverviewDueDateFilter === "納期未入力") {
            return !c.dueDate;
          }
          if (!c.dueDate) {
            return false;
          }
          if (!c.completionDate) {
            return false;
          }
          // 日付単位で比較（時刻は無視）
          const completionDate = new Date(c.completionDate);
          completionDate.setHours(0, 0, 0, 0);
          const dueDate = new Date(c.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          if (performanceOverviewDueDateFilter === "納期内完了") {
            return completionDate <= dueDate;
          }
          if (performanceOverviewDueDateFilter === "納期超過") {
            return completionDate > dueDate;
          }
          return false;
        });
      }

      // 初回返信速度の計算（主担当案件のみ）
      const mainCases = completedCases.filter((c) => c.assignee === member);
      const firstReplyTimes = mainCases
        .filter((c) => c.startDate && c.firstReplyDate)
        .map((c) => calculateFirstReplyTime(c.startDate as string, c.firstReplyDate as string));

      if (performanceOverviewAssigneeFilterMode === "both") {
        // 主担当と副担当を別々に集計
        const mainCasesForCount = completedCases.filter((c) => c.assignee === member);
        const subCasesForCount = completedCases.filter((c) => c.subAssignee === member);

        const caseTypeCounts_main: Record<CaseType, number> = {
          契約書審査: 0,
          契約書起案: 0,
          法務相談: 0,
          その他: 0,
        };

        mainCasesForCount.forEach((c) => {
          const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;
          if (caseTypeCounts_main[caseType] !== undefined) {
            caseTypeCounts_main[caseType] += 1;
          }
        });

        const caseTypeCounts_sub: Record<CaseType, number> = {
          契約書審査: 0,
          契約書起案: 0,
          法務相談: 0,
          その他: 0,
        };

        subCasesForCount.forEach((c) => {
          const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;
          if (caseTypeCounts_sub[caseType] !== undefined) {
            caseTypeCounts_sub[caseType] += 1;
          }
        });

        result.push({
          name: member,
          medianFirstReplyTime: parseFloat(calculateMedian(firstReplyTimes).toFixed(1)),
          契約書審査_main: caseTypeCounts_main.契約書審査,
          契約書起案_main: caseTypeCounts_main.契約書起案,
          法務相談_main: caseTypeCounts_main.法務相談,
          その他_main: caseTypeCounts_main.その他,
          契約書審査_sub: caseTypeCounts_sub.契約書審査,
          契約書起案_sub: caseTypeCounts_sub.契約書起案,
          法務相談_sub: caseTypeCounts_sub.法務相談,
          その他_sub: caseTypeCounts_sub.その他,
        });
      } else {
        // 集計対象のフィルタリング（主担当・副担当の設定に応じて）
        let casesForCount: typeof completedCases = [];
        if (performanceOverviewAssigneeFilterMode === "main") {
          casesForCount = completedCases.filter((c) => c.assignee === member);
        } else if (performanceOverviewAssigneeFilterMode === "sub") {
          casesForCount = completedCases.filter((c) => c.subAssignee === member);
        }

        // 案件タイプ別に分類
        const caseTypeCounts: Record<CaseType, number> = {
          契約書審査: 0,
          契約書起案: 0,
          法務相談: 0,
          その他: 0,
        };

        casesForCount.forEach((c) => {
          const caseType = (reverseCaseTypeMapping[c.caseType] || c.caseType) as CaseType;
          if (caseTypeCounts[caseType] !== undefined) {
            caseTypeCounts[caseType] += 1;
          }
        });

        result.push({
          name: member,
          medianFirstReplyTime: parseFloat(calculateMedian(firstReplyTimes).toFixed(1)),
          契約書審査: caseTypeCounts.契約書審査,
          契約書起案: caseTypeCounts.契約書起案,
          法務相談: caseTypeCounts.法務相談,
          その他: caseTypeCounts.その他,
        });
      }
    });

    // ソート処理（納期別ビューと同じロジック）
    const sortedResult = [...result].sort((a, b) => {
      if (leadTimePerformanceSortType === "caseCount") {
        const calculateTotal = (row: MemberPerformanceByCaseTypeData): number => {
          if (performanceOverviewAssigneeFilterMode === "both") {
            return (
              (row.契約書審査_main || 0) +
              (row.契約書起案_main || 0) +
              (row.法務相談_main || 0) +
              (row.その他_main || 0) +
              (row.契約書審査_sub || 0) +
              (row.契約書起案_sub || 0) +
              (row.法務相談_sub || 0) +
              (row.その他_sub || 0)
            );
          }
          return (row.契約書審査 || 0) + (row.契約書起案 || 0) + (row.法務相談 || 0) + (row.その他 || 0);
        };
        const aTotal = calculateTotal(a);
        const bTotal = calculateTotal(b);
        if (aTotal !== bTotal) {
          return leadTimePerformanceSortOrder === "asc" ? aTotal - bTotal : bTotal - aTotal;
        }
        // 同率時はユーザー名の昇順
        return a.name.localeCompare(b.name, "ja");
      } else {
        // ユーザー名順
        const nameCompare = a.name.localeCompare(b.name, "ja");
        return leadTimePerformanceSortOrder === "asc" ? nameCompare : -nameCompare;
      }
    });

    return sortedResult;
  }, [
    performanceOverviewDueDateFilter,
    performanceOverviewAssigneeFilterMode,
    workloadDateRange,
    workloadSelectedMembers,
    leadTimePerformanceSortType,
    leadTimePerformanceSortOrder,
    localizedCaseData,
    localizedTeamMembers,
    locale,
    expandUserGroups,
  ]);

  const maxCaseCount = useMemo(() => {
    const counts = localizedTeamMembers.map((member) => {
      const memberCases = localizedCaseData.filter((c) => c.assignee === member && !c.completionDate);
      return memberCases.length;
    });
    const max = Math.max(...counts);
    return max > 0 ? max + 2 : 10;
  }, [localizedCaseData, localizedTeamMembers]);

  const mainExperienceCompletedCases = useMemo(() => {
    if (!selectedMember) return [];
    const contractReviewType = locale === "ja-JP" ? "契約書審査" : "Contract review";
    const contractDraftingType = locale === "ja-JP" ? "契約書起案" : "Contract drafting";
    return localizedCaseData.filter((c) => {
      const isMain = c.assignee === selectedMember;
      if (!isMain || !c.completionDate) return false;
      // 集計期間フィルタの適用
      if (panePerformanceDateRange.start || panePerformanceDateRange.end) {
        const completionDate = new Date(c.completionDate);
        if (panePerformanceDateRange.start && completionDate < panePerformanceDateRange.start) return false;
        if (panePerformanceDateRange.end && completionDate > panePerformanceDateRange.end) return false;
      }
      if (personalCaseTypeFilter === "すべて" || personalCaseTypeFilter === "All") {
        return c.caseType === contractReviewType || c.caseType === contractDraftingType;
      }
      return c.caseType === personalCaseTypeFilter;
    });
  }, [selectedMember, personalCaseTypeFilter, localizedCaseData, locale, panePerformanceDateRange]);

  const subExperienceCompletedCases = useMemo(() => {
    if (!selectedMember) return [];
    const contractReviewType = locale === "ja-JP" ? "契約書審査" : "Contract review";
    const contractDraftingType = locale === "ja-JP" ? "契約書起案" : "Contract drafting";
    return localizedCaseData.filter((c) => {
      const isSub = c.subAssignee === selectedMember;
      if (!isSub || !c.completionDate) return false;
      // 集計期間フィルタの適用
      if (panePerformanceDateRange.start || panePerformanceDateRange.end) {
        const completionDate = new Date(c.completionDate);
        if (panePerformanceDateRange.start && completionDate < panePerformanceDateRange.start) return false;
        if (panePerformanceDateRange.end && completionDate > panePerformanceDateRange.end) return false;
      }
      if (personalCaseTypeFilter === "すべて" || personalCaseTypeFilter === "All") {
        return c.caseType === contractReviewType || c.caseType === contractDraftingType;
      }
      return c.caseType === personalCaseTypeFilter;
    });
  }, [selectedMember, personalCaseTypeFilter, localizedCaseData, locale, panePerformanceDateRange]);

  const mainExperienceCaseTypeCounts = useMemo(() => {
    const counts = mainExperienceCompletedCases.reduce<Record<string, number>>((acc, c) => {
      acc[c.caseType] = (acc[c.caseType] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [mainExperienceCompletedCases]);

  const subExperienceCaseTypeCounts = useMemo(() => {
    const counts = subExperienceCompletedCases.reduce<Record<string, number>>((acc, c) => {
      acc[c.caseType] = (acc[c.caseType] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [subExperienceCompletedCases]);

  const statusDurationDetailCases = useMemo(() => {
    if (paneContext?.type !== "statusDuration") return [];

    return localizedCaseData.filter(
      (c) =>
        c.assignee === paneContext.member &&
        c.statusHistory?.some((h) => h.status === paneContext.status) &&
        (leadTimeCompositionCaseTypeFilter === "すべて" ||
          leadTimeCompositionCaseTypeFilter === "All" ||
          c.caseType === leadTimeCompositionCaseTypeFilter),
    );
  }, [paneContext, leadTimeCompositionCaseTypeFilter, localizedCaseData]);

  const durationBucketDetailCases = useMemo(() => {
    if (paneContext?.type !== "durationBucket") return [];

    const { member, bucket, role } = paneContext;
    return filteredData.filter((c) => {
      const roleMatch = role === "main" ? c.assignee === member : c.subAssignee === member;
      if (!roleMatch) return false;

      const diffDays = getDaysSinceLastStatusChange(c);
      if (diffDays === null) return false;

      return getDurationBucket(diffDays) === bucket;
    });
  }, [filteredData, paneContext]);

  // イベントハンドラー
  // WorkloadTab用のハンドラー関数
  const onWorkloadSelectedMembersChange = useCallback((members: string[]) => {
    // 選択された値（ユーザー名またはgroup:プレフィックス付きのグループ名）をそのまま保存
    setWorkloadSelectedMembers(members);
  }, []);

  const onWorkloadDateRangeChange = useCallback((range: { start: Date | null; end: Date | null }) => {
    setWorkloadDateRange(range);
  }, []);

  const onWorkloadDateRangeReset = useCallback(() => {
    setWorkloadDateRange(getInitialDateRange());
    setWorkloadSelectedMembers([]);
  }, [getInitialDateRange]);

  // TimeTab用のハンドラー関数
  const onTimeSelectedMembersChange = useCallback((members: string[]) => {
    // 選択された値（ユーザー名またはgroup:プレフィックス付きのグループ名）をそのまま保存
    setTimeSelectedMembers(members);
  }, []);

  const onTimeDateRangeChange = useCallback((range: { start: Date | null; end: Date | null }) => {
    setTimeDateRange(range);
  }, []);

  const onTimeDateRangeReset = useCallback(() => {
    setTimeDateRange(getInitialDateRange());
    setTimeSelectedMembers([]);
  }, [getInitialDateRange]);

  // CasesTab用のハンドラー関数
  const onCasesSelectedMembersReset = useCallback(() => {
    setCasesSelectedMembers([]);
    setAssigneeFilterMode("main");
  }, []);

  const handleSaveCategories = (nextCategories: LeadTimeCategories) => {
    setLeadTimeCategories(nextCategories);
    setIsStatusSettingsOpen(false);
  };

  const handleBarClickBase = (
    data: { name?: string },
    filterType: "status" | "caseType" | "dueDate",
    filterValue: string,
  ) => {
    if (!data?.name) return;

    // ページ全体のタブは変更しない
    // Pane内のタブを適切に設定
    if (selectedTabIndex === 2) {
      setPaneTabIndex(1); // 進行中の案件タブ
    } else {
      setPaneTabIndex(0); // パフォーマンスタブ
    }
    setPaneOpen(true);
    setSelectedMember(data.name);
    setPanePerformanceDateRange({
      start: performanceDateRange.start ? new Date(performanceDateRange.start) : null,
      end: performanceDateRange.end ? new Date(performanceDateRange.end) : null,
    });

    setPaneContext(null);

    if (filterType === "status") {
      setPaneStatusFilter(filterValue);
      setPaneCaseTypeFilter(activeCaseTypeFilter);
      setPaneDueDateFilter(activeDueDateFilter);
      setPersonalCaseTypeFilter(activeCaseTypeFilter);
    } else if (filterType === "caseType") {
      setPaneStatusFilter(activeStatusFilter);
      setPaneCaseTypeFilter(filterValue);
      setPaneDueDateFilter(activeDueDateFilter);
      setPersonalCaseTypeFilter(filterValue);
    } else if (filterType === "dueDate") {
      // 納期別のグラフをクリックした場合
      // 納期カテゴリのkeyを納期フィルターの値にマッピング
      const dueDateFilterMap: Record<string, DueDateFilter> = {
        超過: "納期超過",
        今日: "今日まで",
        "2日以内": "今日含め3日以内",
        "3-6日以内": "今日含め7日以内",
        "7日以降": "1週間後〜",
        未入力: "納期未入力",
      };
      const mappedDueDateFilter = dueDateFilterMap[filterValue] || "すべて";
      // メインコンテンツ側のステータスフィルターを反映
      setPaneStatusFilter(activeStatusFilter);
      setPaneCaseTypeFilter(activeCaseTypeFilter);
      setPaneDueDateFilter(mappedDueDateFilter);
      setPersonalCaseTypeFilter(activeCaseTypeFilter);
    }
  };

  // JSXを含む列定義
  const unassignedCasesColumns: DataTableColumnDef<CaseData, string | number>[] = useMemo(() => {
    const baseColumns: DataTableColumnDef<CaseData, string | number>[] = [
      {
        id: "caseName",
        name: t("caseName"),
        getValue: (row: CaseData) => row.caseName,
        renderCell: (info) => {
          const url = buildCaseDetailUrl(info.row.caseId);
          return (
            <DataTableCell
              trailing={
                <Tooltip title={t("openInNewTab")}>
                  <IconButton
                    size="small"
                    variant="subtle"
                    aria-label={t("openInNewTab")}
                    icon={LfArrowUpRightFromSquare}
                    onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                  />
                </Tooltip>
              }
            >
              <DataTableLink href={url} />
              {info.row.caseName}
            </DataTableCell>
          );
        },
      },
      {
        id: "dueDate",
        name: t("dueDate"),
        getValue: (row: CaseData) => row.dueDate,
        renderCell: (info) => {
          const url = buildCaseDetailUrl(info.row.caseId);
          return (
            <DataTableCell>
              <DataTableLink href={url} />
              {formatDate(info.row.dueDate)}
            </DataTableCell>
          );
        },
      },
      {
        id: "assignee",
        name: t("assignee"),
        renderCell: (info) => {
          const memberNames = localizedTeamMembers.map((member) => ({ label: member, value: member }));
          return (
            <DataTableCell>
              <Combobox
                placeholder={t("selectAssignee")}
                value={assignments[info.row.caseName] ?? info.row.assignee ?? ""}
                onChange={(selectedValue: string | null) => {
                  setAssignments((prev) => ({ ...prev, [info.row.caseName]: selectedValue ?? "" }));
                }}
                options={memberNames}
                ghost={false}
              />
            </DataTableCell>
          );
        },
      },
    ];

    if (showEmptySubAssignee) {
      baseColumns.push({
        id: "subAssignee",
        name: t("subAssignee"),
        renderCell: (info: { row: CaseData }) => {
          const memberNames = localizedTeamMembers.map((member) => ({ label: member, value: member }));
          return (
            <DataTableCell>
              <Combobox
                placeholder={t("selectSubAssignee")}
                value={subAssignments[info.row.caseName] ?? info.row.subAssignee ?? ""}
                onChange={(selectedValue: string | null) => {
                  setSubAssignments((prev) => ({ ...prev, [info.row.caseName]: selectedValue ?? "" }));
                }}
                options={memberNames}
                ghost={false}
              />
            </DataTableCell>
          );
        },
      });
    }

    baseColumns.push(
      {
        id: "requester",
        name: t("requester"),
        getValue: (row: CaseData) => row.requester,
        renderCell: (info) => {
          const url = buildCaseDetailUrl(info.row.caseId);
          return (
            <DataTableCell leading={<Avatar size="xSmall" name={info.row.requester} />}>
              <DataTableLink href={url} />
              {info.row.requester}
            </DataTableCell>
          );
        },
      },
      {
        id: "requestingDepartment",
        name: t("requestingDepartment"),
        getValue: (row: CaseData) => row.requestingDepartment,
        renderCell: (info) => {
          const url = buildCaseDetailUrl(info.row.caseId);
          return (
            <DataTableCell>
              <DataTableLink href={url} />
              {info.row.requestingDepartment}
            </DataTableCell>
          );
        },
      },
    );

    return baseColumns;
  }, [assignments, showEmptySubAssignee, subAssignments, t, localizedTeamMembers, formatDate]);

  const teamStatusColumns = useMemo(() => {
    type RowData = Record<string, number | string | Record<string, string[]>>;
    const nameCol: DataTableColumnDef<RowData, string> = {
      id: "name",
      name: t("member"),
      getValue: (row) => row.name as string,
      renderCell: (info) => {
        const memberName = info.value as string;
        return (
          <DataTableCell
            trailing={
              <Button
                size="small"
                variant="subtle"
                leading={
                  <Icon>
                    <LfLayoutHorizonRight />
                  </Icon>
                }
                onClick={() => {
                  // ページ全体のタブは変更しない
                  // Pane内のタブを適切に設定
                  if (selectedTabIndex === 2) {
                    setPaneTabIndex(1); // 進行中の案件タブ
                  } else {
                    setPaneTabIndex(0); // パフォーマンスタブ
                  }
                  setPaneOpen(true);
                  setSelectedMember(memberName);
                  setPanePerformanceDateRange({
                    start: performanceDateRange.start ? new Date(performanceDateRange.start) : null,
                    end: performanceDateRange.end ? new Date(performanceDateRange.end) : null,
                  });
                  setPaneCaseTypeFilter(activeCaseTypeFilter);
                  setPersonalCaseTypeFilter(activeCaseTypeFilter);
                  setPaneDueDateFilter(activeDueDateFilter);
                  setPaneStatusFilter(activeStatusFilter);
                }}
              >
                {t("open")}
              </Button>
            }
          >
            {memberName}
          </DataTableCell>
        );
      },
    };

    // 合計数を計算する関数
    const calculateTotal = (row: RowData, mode: "main" | "sub"): number => {
      const keys = Object.keys(row).filter((key) => {
        // caseNamesやnameなどの非数値キーを除外
        if (key === "name" || key === "caseNames") return false;
        if (mode === "main") return key.endsWith("_main");
        return key.endsWith("_sub");
      });
      return keys.reduce((sum, key) => sum + ((row[key] as number) || 0), 0);
    };

    // 合計数カラム
    const totalCol: DataTableColumnDef<RowData, number> = {
      id: "total",
      name:
        assigneeFilterMode === "main"
          ? t("total")
          : assigneeFilterMode === "sub"
            ? `${t("total")}(${t("subRole")})`
            : `${t("total")}(${t("mainRole")})`,
      getValue: (row) => calculateTotal(row, assigneeFilterMode === "sub" ? "sub" : "main"),
      renderCell: (info) => (
        <DataTableCell>
          <Text variant="body.medium">{info.value}</Text>
        </DataTableCell>
      ),
    };

    // 副担当案件数カラム（assigneeFilterMode === "both"の時のみ表示）
    const subAssigneeCaseCountCol: DataTableColumnDef<RowData, number> | null =
      assigneeFilterMode === "both"
        ? {
            id: "subAssigneeCaseCount",
            name: `${t("total")}(${t("subRole")})`,
            getValue: (row) => calculateTotal(row, "sub"),
            renderCell: (info) => (
              <DataTableCell>
                <Text variant="body.medium">{info.value}</Text>
              </DataTableCell>
            ),
          }
        : null;

    // 主担当の内訳カラム
    let mainVariableCols: DataTableColumnDef<RowData, number>[] = [];

    if (caseStatusView === "status") {
      mainVariableCols = tenantStatusSeriesForTeamBreakdown.map((status) => ({
        id: `${status.key}_main`,
        name: assigneeFilterMode === "main" ? status.name : `${status.name}（${t("mainRole")}）`,
        getValue: (row) => (row[`${status.key}_main`] as number) || 0,
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      }));
    } else if (caseStatusView === "type") {
      const localizedCaseTypes = getLocalizedCaseTypeOrder(locale);
      mainVariableCols = localizedCaseTypes.map((type) => ({
        id: `${type}_main`,
        name: assigneeFilterMode === "main" ? type : `${type}（${t("mainRole")}）`,
        getValue: (row) => (row[`${type}_main`] as number) || 0,
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      }));
    } else if (caseStatusView === "dueDate") {
      const dueDateCategories = getLocalizedDueDateCategories(locale);
      mainVariableCols = dueDateCategories.map((category) => ({
        id: `${category}_main`,
        name: assigneeFilterMode === "main" ? category : `${category}（${t("mainRole")}）`,
        getValue: (row) => (row[`${category}_main`] as number) || 0,
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      }));
    }

    // 副担当の内訳カラム（assigneeFilterMode === "sub"または"both"の時）
    let subVariableCols: DataTableColumnDef<RowData, number>[] = [];
    if (assigneeFilterMode === "sub" || assigneeFilterMode === "both") {
      if (caseStatusView === "status") {
        subVariableCols = tenantStatusSeriesForTeamBreakdown.map((status) => ({
          id: `${status.key}_sub`,
          name: `${status.name}（${t("subRole")}）`,
          getValue: (row) => (row[`${status.key}_sub`] as number) || 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        }));
      } else if (caseStatusView === "type") {
        const localizedCaseTypes = getLocalizedCaseTypeOrder(locale);
        subVariableCols = localizedCaseTypes.map((type) => ({
          id: `${type}_sub`,
          name: `${type}（${t("subRole")}）`,
          getValue: (row) => (row[`${type}_sub`] as number) || 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        }));
      } else if (caseStatusView === "dueDate") {
        const dueDateCategories = getLocalizedDueDateCategories(locale);
        subVariableCols = dueDateCategories.map((category) => ({
          id: `${category}_sub`,
          name: `${category}（${t("subRole")}）`,
          getValue: (row) => (row[`${category}_sub`] as number) || 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        }));
      }
    }

    const columns: (DataTableColumnDef<RowData, string> | DataTableColumnDef<RowData, number>)[] = [nameCol, totalCol];
    if (subAssigneeCaseCountCol) {
      columns.push(subAssigneeCaseCountCol);
    }

    // 各ステータス/案件タイプ/納期区分ごとに主→副の順でカラムを追加
    if (assigneeFilterMode === "both" && subVariableCols.length > 0) {
      // 主+副の場合: 主担当と副担当のカラムを交互に追加
      for (let i = 0; i < mainVariableCols.length; i++) {
        columns.push(mainVariableCols[i]);
        // 対応する副担当カラムがあれば追加
        if (i < subVariableCols.length) {
          columns.push(subVariableCols[i]);
        }
      }
    } else if (assigneeFilterMode === "sub" && subVariableCols.length > 0) {
      // 副担当のみの場合: 副担当カラムのみを追加
      columns.push(...subVariableCols);
    } else {
      // 主担当のみの場合: 主担当カラムのみを追加
      columns.push(...mainVariableCols);
    }

    return columns;
  }, [
    caseStatusView,
    tenantStatusSeriesForTeamBreakdown,
    activeCaseTypeFilter,
    activeDueDateFilter,
    activeStatusFilter,
    assigneeFilterMode,
    t,
    locale,
    performanceDateRange.end,
    performanceDateRange.start,
    selectedTabIndex,
  ]);

  // 残りのJSXを含む列定義（定数として定義）
  const caseTypeCountColumns: DataTableColumnDef<{ type: string; count: number }, string | number>[] = [
    { id: "type", name: t("caseType"), getValue: (row) => row.type },
    {
      id: "count",
      name: t("completedCaseCount"),
      getValue: (row) => row.count,
      renderCell: (info) => (
        <DataTableCell style={{ textAlign: "end" }}>{`${info.value}${locale === "ja-JP" ? "件" : ""}`}</DataTableCell>
      ),
    },
  ];

  const mainAssignmentTableColumns: DataTableColumnDef<CaseData, string | number>[] = [
    {
      id: "caseName",
      name: t("caseName"),
      getValue: (row) => row.caseName,
      renderCell: (info) => {
        const url = buildCaseDetailUrl(info.row.caseId);
        return (
          <DataTableCell
            trailing={
              <Tooltip title={t("openInNewTab")}>
                <IconButton
                  size="small"
                  variant="subtle"
                  aria-label={t("openInNewTab")}
                  icon={LfArrowUpRightFromSquare}
                  onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                />
              </Tooltip>
            }
          >
            <Tooltip title={info.row.caseName} onlyOnOverflow>
              <DataTableLink href={url}>{info.row.caseName}</DataTableLink>
            </Tooltip>
          </DataTableCell>
        );
      },
    },
    {
      id: "dueDate",
      name: t("dueDate"),
      getValue: (row) => row.dueDate || "-",
      renderCell: (info) => {
        const url = buildCaseDetailUrl(info.row.caseId);
        if (!info.row.dueDate) {
          return (
            <DataTableCell>
              <DataTableLink href={url} />
              {formatDate(info.row.dueDate)}
            </DataTableCell>
          );
        }
        const isOverdue = getDayDiff(info.row.dueDate) < 0;

        if (isOverdue) {
          return (
            <DataTableCell
              leading={
                <Tag color="red" variant="fill" size="small">
                  {t("dueDateFilterOverdue")}
                </Tag>
              }
            >
              <DataTableLink href={url} />
              {formatDate(info.row.dueDate)}
            </DataTableCell>
          );
        }
        return (
          <DataTableCell>
            <DataTableLink href={url} />
            {formatDate(info.row.dueDate)}
          </DataTableCell>
        );
      },
    },
    {
      id: "status",
      name: t("status"),
      getValue: (row) => row.status,
      renderCell: (info) => {
        const url = buildCaseDetailUrl(info.row.caseId);
        // 経過日数の計算
        let daysSinceStatusChange: number | "-" = "-";
        if (info.row.statusHistory && info.row.statusHistory.length > 0) {
          const lastStatus = info.row.statusHistory[info.row.statusHistory.length - 1];
          const lastStatusDate = new Date(lastStatus.startDate);
          const todayDate = new Date();
          lastStatusDate.setHours(0, 0, 0, 0);
          todayDate.setHours(0, 0, 0, 0);
          const diffTime = todayDate.getTime() - lastStatusDate.getTime();
          daysSinceStatusChange = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        return (
          <DataTableCell
            trailing={
              daysSinceStatusChange !== "-" ? (
                <Text variant="body.medium">
                  {daysSinceStatusChange}
                  {locale === "ja-JP" ? "日経過" : ` ${t("daysElapsed")}`}
                </Text>
              ) : undefined
            }
          >
            <DataTableLink href={url} />
            <Tooltip title={info.row.status} onlyOnOverflow>
              <StatusLabel variant="outline" color="neutral" size="small">
                {info.row.status}
              </StatusLabel>
            </Tooltip>
          </DataTableCell>
        );
      },
    },
    { id: "subAssignee", name: t("subAssignee"), getValue: (row) => row.subAssignee || "-" },
  ];

  const subAssignmentTableColumns: DataTableColumnDef<CaseData, string | number>[] = [
    {
      id: "caseName",
      name: "案件名",
      getValue: (row) => row.caseName,
      renderCell: (info) => {
        const url = buildCaseDetailUrl(info.row.caseId);
        return (
          <DataTableCell
            trailing={
              <Tooltip title={t("openInNewTab")}>
                <IconButton
                  size="small"
                  variant="subtle"
                  aria-label={t("openInNewTab")}
                  icon={LfArrowUpRightFromSquare}
                  onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                />
              </Tooltip>
            }
          >
            <Tooltip title={info.row.caseName} onlyOnOverflow>
              <DataTableLink href={url}>{info.row.caseName}</DataTableLink>
            </Tooltip>
          </DataTableCell>
        );
      },
    },
    {
      id: "dueDate",
      name: t("dueDate"),
      getValue: (row) => row.dueDate || "-",
      renderCell: (info) => {
        const url = buildCaseDetailUrl(info.row.caseId);
        if (!info.row.dueDate) {
          return (
            <DataTableCell>
              <DataTableLink href={url} />
              {formatDate(info.row.dueDate)}
            </DataTableCell>
          );
        }
        const isOverdue = getDayDiff(info.row.dueDate) < 0;

        if (isOverdue) {
          return (
            <DataTableCell
              leading={
                <Tag color="red" variant="fill" size="small">
                  {t("dueDateFilterOverdue")}
                </Tag>
              }
            >
              <DataTableLink href={url} />
              {formatDate(info.row.dueDate)}
            </DataTableCell>
          );
        }
        return (
          <DataTableCell>
            <DataTableLink href={url} />
            {formatDate(info.row.dueDate)}
          </DataTableCell>
        );
      },
    },
    {
      id: "status",
      name: t("status"),
      getValue: (row) => row.status,
      renderCell: (info) => {
        const url = buildCaseDetailUrl(info.row.caseId);
        // 経過日数の計算
        let daysSinceStatusChange: number | "-" = "-";
        if (info.row.statusHistory && info.row.statusHistory.length > 0) {
          const lastStatus = info.row.statusHistory[info.row.statusHistory.length - 1];
          const lastStatusDate = new Date(lastStatus.startDate);
          const todayDate = new Date();
          lastStatusDate.setHours(0, 0, 0, 0);
          todayDate.setHours(0, 0, 0, 0);
          const diffTime = todayDate.getTime() - lastStatusDate.getTime();
          daysSinceStatusChange = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        return (
          <DataTableCell
            trailing={
              daysSinceStatusChange !== "-" ? (
                <Text variant="body.medium">
                  {daysSinceStatusChange}
                  {locale === "ja-JP" ? "日経過" : ` ${t("daysElapsed")}`}
                </Text>
              ) : undefined
            }
          >
            <DataTableLink href={url} />
            <Tooltip title={info.row.status} onlyOnOverflow>
              <StatusLabel variant="outline" color="neutral" size="small">
                {info.row.status}
              </StatusLabel>
            </Tooltip>
          </DataTableCell>
        );
      },
    },
    { id: "mainAssignee", name: t("caseAssignee"), getValue: (row) => row.assignee },
  ];

  const completedCasesColumns: DataTableColumnDef<CaseData, string | number>[] = [
    { id: "caseName", name: t("caseName"), getValue: (row) => row.caseName },
    { id: "contractCategory", name: t("contractCategory"), getValue: (row) => row.contractCategory || "-" },
    {
      id: "completionDate",
      name: t("completionDate"),
      getValue: (row) => row.completionDate || "-",
      renderCell: (info) => <DataTableCell>{formatDate(info.row.completionDate)}</DataTableCell>,
    },
  ];

  const caseTableColumns: DataTableColumnDef<CaseData, string | number>[] = [
    {
      id: "caseName",
      name: t("caseName"),
      getValue: (row) => row.caseName,
      renderCell: (info) => {
        const url = buildCaseDetailUrl(info.row.caseId);
        return (
          <DataTableCell>
            <DataTableLink href={url} />
            {info.row.caseName}
          </DataTableCell>
        );
      },
    },
    {
      id: "status",
      name: t("status"),
      getValue: (row) => row.status,
      renderCell: (info) => {
        const url = buildCaseDetailUrl(info.row.caseId);
        return (
          <DataTableCell>
            <DataTableLink href={url} />
            <StatusLabel variant="fill" color={getStatusLabelColor(info.row.status)} size="small">
              {info.row.status}
            </StatusLabel>
          </DataTableCell>
        );
      },
    },
    {
      id: "daysSinceStatusChange",
      name: t("daysSinceStatusChange"),
      getValue: (row) => {
        if (!row.statusHistory || row.statusHistory.length === 0) {
          return 0;
        }
        const lastStatus = row.statusHistory[row.statusHistory.length - 1];
        const lastStatusDate = new Date(lastStatus.startDate);
        const todayDate = new Date(today);
        lastStatusDate.setHours(0, 0, 0, 0);
        todayDate.setHours(0, 0, 0, 0);
        const diffTime = todayDate.getTime() - lastStatusDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      },
      renderCell: (info) => {
        if (info.value === "-") {
          return <DataTableCell style={{ textAlign: "end" }}>-</DataTableCell>;
        }

        const days = info.value as number;
        const style: React.CSSProperties = { textAlign: "end" };
        if (days >= 14) {
          style.color = "var(--aegis-color-font-danger)";
          style.fontWeight = "bold";
        }
        return (
          <DataTableCell style={style}>
            {days > 0 ? `${days}${locale === "ja-JP" ? "日" : ` ${t("days")}`}` : "-"}
          </DataTableCell>
        );
      },
      sortable: true,
    },
    {
      id: "dueDate",
      name: t("dueDate"),
      getValue: (row) => row.dueDate,
      renderCell: (info) => {
        const url = buildCaseDetailUrl(info.row.caseId);
        if (!info.row.dueDate) {
          return (
            <DataTableCell>
              <DataTableLink href={url} />
              {formatDate(info.row.dueDate)}
            </DataTableCell>
          );
        }
        const isOverdue = getDayDiff(info.row.dueDate) < 0;

        if (isOverdue) {
          return (
            <DataTableCell
              leading={
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xxSmall)" }}>
                  <Icon size="small" color="danger">
                    <LfWarningTriangle />
                  </Icon>
                  <Text variant="body.small" color="danger">
                    超過
                  </Text>
                </div>
              }
            >
              <DataTableLink href={url} />
              <Text color="danger">{formatDate(info.row.dueDate)}</Text>
            </DataTableCell>
          );
        }
        return (
          <DataTableCell>
            <DataTableLink href={url} />
            {formatDate(info.row.dueDate)}
          </DataTableCell>
        );
      },
    },
    {
      id: "openInNewTab",
      name: "",
      getValue: () => "",
      renderCell: (info) => {
        const url = buildCaseDetailUrl(info.row.caseId);
        return (
          <DataTableCell>
            <IconButton
              size="small"
              variant="subtle"
              aria-label={t("openInNewTab")}
              title={t("openInNewTab")}
              icon={LfArrowUpRightFromSquare}
              onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
            />
          </DataTableCell>
        );
      },
    },
  ];

  return (
    <Presentation
      // State props
      selectedMember={selectedMember}
      selectedTabIndex={selectedTabIndex}
      paneTabIndex={paneTabIndex}
      sortOrder={sortOrder}
      teamCaseSortType={teamCaseSortType}
      onTeamCaseSortTypeChange={setTeamCaseSortType}
      activeDueDateFilter={activeDueDateFilter}
      activeCaseTypeFilter={activeCaseTypeFilter}
      activeStatusFilter={activeStatusFilter}
      caseStatusView={caseStatusView}
      assignments={assignments}
      localizedTeamMembers={localizedTeamMembers}
      performanceDateRange={performanceDateRange}
      workloadSelectedMembers={workloadSelectedMembers}
      workloadDateRange={workloadDateRange}
      onWorkloadSelectedMembersChange={onWorkloadSelectedMembersChange}
      onWorkloadDateRangeChange={onWorkloadDateRangeChange}
      onWorkloadDateRangeReset={onWorkloadDateRangeReset}
      timeSelectedMembers={timeSelectedMembers}
      timeDateRange={timeDateRange}
      onTimeSelectedMembersChange={onTimeSelectedMembersChange}
      onTimeDateRangeChange={onTimeDateRangeChange}
      onTimeDateRangeReset={onTimeDateRangeReset}
      // CasesTab用のフィルター
      casesSelectedMembers={casesSelectedMembers}
      onCasesSelectedMembersChange={setCasesSelectedMembers}
      onCasesSelectedMembersReset={onCasesSelectedMembersReset}
      showEmptySubAssignee={showEmptySubAssignee}
      subAssignments={subAssignments}
      paneStatusFilter={paneStatusFilter}
      paneCaseTypeFilter={paneCaseTypeFilter}
      paneDueDateFilter={paneDueDateFilter}
      panePerformanceDateRange={panePerformanceDateRange}
      paneContext={paneContext}
      // Personal performance用のprops（2つのカードに分離）
      personalMatterCountCaseTypeFilter={personalMatterCountCaseTypeFilter}
      personalMatterCountDateRange={personalMatterCountDateRange}
      personalMatterCountViewMode={personalMatterCountViewMode}
      personalMatterCountViewType={personalMatterCountViewType}
      personalLeadTimeCaseTypeFilter={personalLeadTimeCaseTypeFilter}
      personalLeadTimeDateRange={personalLeadTimeDateRange}
      personalLeadTimeViewMode={personalLeadTimeViewMode}
      personalLeadTimePeriodView={personalLeadTimePeriodView}
      isPersonalMatterCountFilterOpen={isPersonalMatterCountFilterOpen}
      isPersonalLeadTimeFilterOpen={isPersonalLeadTimeFilterOpen}
      // パフォーマンス概要カード用のprops
      performanceOverviewCaseTypeFilter={performanceOverviewCaseTypeFilter}
      performanceOverviewAssigneeFilterMode={performanceOverviewAssigneeFilterMode}
      performanceOverviewViewMode={performanceOverviewViewMode}
      isPerformanceOverviewFilterOpen={isPerformanceOverviewFilterOpen}
      performanceOverviewBreakdownView={performanceOverviewBreakdownView}
      onPerformanceOverviewBreakdownViewChange={setPerformanceOverviewBreakdownView}
      performanceOverviewDueDateFilter={performanceOverviewDueDateFilter}
      performanceOverviewDateRange={performanceOverviewDateRange}
      // リードタイム内訳カード用のprops
      leadTimeCompositionCaseTypeFilter={leadTimeCompositionCaseTypeFilter}
      leadTimeCompositionAssigneeFilterMode={leadTimeCompositionAssigneeFilterMode}
      leadTimeCompositionViewMode={leadTimeCompositionViewMode}
      leadTimeCompositionGraphMode={leadTimeCompositionGraphMode}
      isLeadTimeCompositionFilterOpen={isLeadTimeCompositionFilterOpen}
      leadTimeCompositionSortType={leadTimeCompositionSortType}
      leadTimeCompositionSortOrder={leadTimeCompositionSortOrder}
      leadTimeCategories={leadTimeCategories}
      isStatusSettingsOpen={isStatusSettingsOpen}
      assigneeFilterMode={assigneeFilterMode}
      isFilterOpen={isFilterOpen}
      isPaneFilterOpen={isPaneFilterOpen}
      teamCaseViewMode={teamCaseViewMode}
      // 案件数グラフ用のprops
      caseCountViewMode={caseCountViewMode}
      caseCountViewType={caseCountViewType}
      caseCountPeriodView={caseCountPeriodView}
      caseCountVisibleMetrics={caseCountVisibleMetrics}
      caseCountShowPreviousYear={caseCountShowPreviousYear}
      caseCountCaseTypeFilter={caseCountCaseTypeFilter}
      isCaseCountFilterOpen={isCaseCountFilterOpen}
      caseCountByCaseTypeOverallPerformanceData={caseCountByCaseTypeOverallPerformanceData}
      caseCountByCaseTypeMergedPerformanceData={caseCountByCaseTypeMergedPerformanceData}
      caseCountAllPeriodByCaseTypeData={caseCountAllPeriodByCaseTypeData}
      caseCountAllPeriodByCaseTypePreviousYearData={caseCountAllPeriodByCaseTypePreviousYearData}
      onCaseCountViewModeChange={setCaseCountViewMode}
      onCaseCountViewTypeChange={setCaseCountViewType}
      onCaseCountPeriodViewChange={setCaseCountPeriodView}
      onCaseCountShowPreviousYearChange={setCaseCountShowPreviousYear}
      onCaseCountCaseTypeFilterChange={setCaseCountCaseTypeFilter}
      onIsCaseCountFilterOpenChange={setIsCaseCountFilterOpen}
      // 2つ目の案件数グラフ用のprops
      caseCount2ViewMode={caseCount2ViewMode}
      caseCount2ViewType={caseCount2ViewType}
      caseCount2PeriodView={caseCount2PeriodView}
      caseCount2VisibleMetrics={caseCount2VisibleMetrics}
      caseCount2ShowPreviousYear={caseCount2ShowPreviousYear}
      caseCount2CaseTypeFilter={caseCount2CaseTypeFilter}
      isCaseCount2FilterOpen={isCaseCount2FilterOpen}
      caseCount2OverallPerformanceData={caseCount2OverallPerformanceData}
      caseCount2MergedPerformanceData={caseCount2MergedPerformanceData}
      caseCount2ByCaseTypeOverallPerformanceData={caseCount2ByCaseTypeOverallPerformanceData}
      caseCount2ByCaseTypeMergedPerformanceData={caseCount2ByCaseTypeMergedPerformanceData}
      caseCount2AllPeriodData={caseCount2AllPeriodData}
      caseCount2AllPeriodPreviousYearData={caseCount2AllPeriodPreviousYearData}
      caseCount2AllPeriodByCaseTypeData={caseCount2AllPeriodByCaseTypeData}
      caseCount2AllPeriodByCaseTypePreviousYearData={caseCount2AllPeriodByCaseTypePreviousYearData}
      workloadCaseCountByCaseTypeOverallPerformanceData={workloadCaseCountByCaseTypeOverallPerformanceData}
      workloadCaseCountByCaseTypeMergedPerformanceData={workloadCaseCountByCaseTypeMergedPerformanceData}
      workloadCaseCountAllPeriodByCaseTypeData={workloadCaseCountAllPeriodByCaseTypeData}
      workloadCaseCountAllPeriodByCaseTypePreviousYearData={workloadCaseCountAllPeriodByCaseTypePreviousYearData}
      workloadCaseCount2OverallPerformanceData={workloadCaseCount2OverallPerformanceData}
      workloadCaseCount2MergedPerformanceData={workloadCaseCount2MergedPerformanceData}
      workloadCaseCount2ByCaseTypeOverallPerformanceData={workloadCaseCount2ByCaseTypeOverallPerformanceData}
      workloadCaseCount2ByCaseTypeMergedPerformanceData={workloadCaseCount2ByCaseTypeMergedPerformanceData}
      workloadCaseCount2AllPeriodData={workloadCaseCount2AllPeriodData}
      workloadCaseCount2AllPeriodPreviousYearData={workloadCaseCount2AllPeriodPreviousYearData}
      workloadCaseCount2AllPeriodByCaseTypeData={workloadCaseCount2AllPeriodByCaseTypeData}
      workloadCaseCount2AllPeriodByCaseTypePreviousYearData={workloadCaseCount2AllPeriodByCaseTypePreviousYearData}
      workloadMemberPerformanceData={workloadMemberPerformanceData}
      workloadMemberPerformanceByCaseTypeData={workloadMemberPerformanceByCaseTypeData}
      onCaseCount2ViewModeChange={setCaseCount2ViewMode}
      onCaseCount2ViewTypeChange={setCaseCount2ViewType}
      onCaseCount2PeriodViewChange={setCaseCount2PeriodView}
      onCaseCount2ShowPreviousYearChange={setCaseCount2ShowPreviousYear}
      onCaseCount2CaseTypeFilterChange={setCaseCount2CaseTypeFilter}
      onIsCaseCount2FilterOpenChange={setIsCaseCount2FilterOpen}
      // Data props
      selectedMemberMainCases={selectedMemberMainCases}
      selectedMemberSubCases={selectedMemberSubCases}
      membersWithOverdueCases={membersWithOverdueCases}
      unassignedCasesCount={unassignedCasesCount}
      unassignedSubAssigneeCasesCount={unassignedSubAssigneeCasesCount}
      allUnassignedCases={allUnassignedCases}
      allUnassignedSubAssigneeCases={allUnassignedSubAssigneeCases}
      overallPerformanceData={overallPerformanceData}
      personalMatterCountData={personalMatterCountData}
      personalMatterCountByCaseTypeData={personalMatterCountByCaseTypeData}
      personalMatterCountAllPeriodData={personalMatterCountAllPeriodData}
      personalMatterCountAllPeriodByCaseTypeData={personalMatterCountAllPeriodByCaseTypeData}
      personalMatterCountPeriodView={personalMatterCountPeriodView}
      onPersonalMatterCountPeriodViewChange={setPersonalMatterCountPeriodView}
      personalLeadTimeData={personalLeadTimeData}
      personalLeadTimeAllPeriodData={personalLeadTimeAllPeriodData}
      dueDateSummary={dueDateSummary}
      filteredData={filteredData}
      tenantStatusSeriesForTeamBreakdown={tenantStatusSeriesForTeamBreakdown}
      chartData={chartData}
      teamStatusColumns={teamStatusColumns}
      leadTimeCompositionData={leadTimeCompositionData}
      memberPerformanceData={memberPerformanceData}
      memberPerformanceByCaseTypeData={memberPerformanceByCaseTypeData}
      maxCaseCount={maxCaseCount}
      mainExperienceCompletedCases={mainExperienceCompletedCases}
      subExperienceCompletedCases={subExperienceCompletedCases}
      mainExperienceCaseTypeCounts={mainExperienceCaseTypeCounts}
      subExperienceCaseTypeCounts={subExperienceCaseTypeCounts}
      statusDurationDetailCases={statusDurationDetailCases}
      durationBucketDetailCases={durationBucketDetailCases}
      // Column definitions
      unassignedCasesColumns={unassignedCasesColumns}
      caseTypeCountColumns={caseTypeCountColumns}
      mainAssignmentTableColumns={mainAssignmentTableColumns}
      subAssignmentTableColumns={subAssignmentTableColumns}
      completedCasesColumns={completedCasesColumns}
      caseTableColumns={caseTableColumns}
      // Handler props
      onPaneOpenChange={setPaneOpen}
      onSelectedMemberChange={setSelectedMember}
      onSelectedTabIndexChange={setSelectedTabIndex}
      onPaneTabIndexChange={setPaneTabIndex}
      onSortOrderChange={setSortOrder}
      onActiveDueDateFilterChange={setActiveDueDateFilter}
      onActiveCaseTypeFilterChange={setActiveCaseTypeFilter}
      onActiveStatusFilterChange={setActiveStatusFilter}
      onCaseStatusViewChange={setCaseStatusView}
      onAssignmentsChange={setAssignments}
      onPersonalMatterCountCaseTypeFilterChange={setPersonalMatterCountCaseTypeFilter}
      onPersonalMatterCountDateRangeChange={setPersonalMatterCountDateRange}
      onPersonalMatterCountViewModeChange={setPersonalMatterCountViewMode}
      onPersonalMatterCountViewTypeChange={setPersonalMatterCountViewType}
      onPersonalLeadTimeCaseTypeFilterChange={setPersonalLeadTimeCaseTypeFilter}
      onPersonalLeadTimeDateRangeChange={setPersonalLeadTimeDateRange}
      onPersonalLeadTimeViewModeChange={setPersonalLeadTimeViewMode}
      onPersonalLeadTimePeriodViewChange={setPersonalLeadTimePeriodView}
      onIsPersonalMatterCountFilterOpenChange={setIsPersonalMatterCountFilterOpen}
      onIsPersonalLeadTimeFilterOpenChange={setIsPersonalLeadTimeFilterOpen}
      experienceViewMode={experienceViewMode}
      onExperienceViewModeChange={setExperienceViewMode}
      onShowEmptySubAssigneeChange={setShowEmptySubAssignee}
      onSubAssignmentsChange={setSubAssignments}
      onPaneStatusFilterChange={setPaneStatusFilter}
      onPaneCaseTypeFilterChange={setPaneCaseTypeFilter}
      onPaneDueDateFilterChange={setPaneDueDateFilter}
      onPanePerformanceDateRangeChange={setPanePerformanceDateRange}
      onPaneContextChange={setPaneContext}
      // パフォーマンス概要カード用のハンドラー
      onPerformanceOverviewCaseTypeFilterChange={setPerformanceOverviewCaseTypeFilter}
      onPerformanceOverviewAssigneeFilterModeChange={setPerformanceOverviewAssigneeFilterMode}
      onPerformanceOverviewViewModeChange={setPerformanceOverviewViewMode}
      onIsPerformanceOverviewFilterOpenChange={setIsPerformanceOverviewFilterOpen}
      onPerformanceOverviewDueDateFilterChange={setPerformanceOverviewDueDateFilter}
      onPerformanceOverviewDateRangeChange={setPerformanceOverviewDateRange}
      // リードタイム内訳カード用のハンドラー
      onLeadTimeCompositionCaseTypeFilterChange={setLeadTimeCompositionCaseTypeFilter}
      onLeadTimeCompositionAssigneeFilterModeChange={setLeadTimeCompositionAssigneeFilterMode}
      onLeadTimeCompositionViewModeChange={(mode) => {
        setLeadTimeCompositionViewMode(mode);
        localStorage.setItem("leadTimeCompositionViewMode", mode);
      }}
      onLeadTimeCompositionGraphModeChange={(mode) => {
        setLeadTimeCompositionGraphMode(mode);
        localStorage.setItem("leadTimeCompositionGraphMode", mode);
      }}
      onIsLeadTimeCompositionFilterOpenChange={setIsLeadTimeCompositionFilterOpen}
      onLeadTimeCompositionSortTypeChange={setLeadTimeCompositionSortType}
      onLeadTimeCompositionSortOrderChange={setLeadTimeCompositionSortOrder}
      leadTimePerformanceSortType={leadTimePerformanceSortType}
      leadTimePerformanceSortOrder={leadTimePerformanceSortOrder}
      onLeadTimePerformanceSortTypeChange={setLeadTimePerformanceSortType}
      onLeadTimePerformanceSortOrderChange={setLeadTimePerformanceSortOrder}
      onLeadTimeCategoriesChange={setLeadTimeCategories}
      onIsStatusSettingsOpenChange={setIsStatusSettingsOpen}
      onAssigneeFilterModeChange={setAssigneeFilterMode}
      onIsFilterOpenChange={setIsFilterOpen}
      onIsPaneFilterOpenChange={setIsPaneFilterOpen}
      onTeamCaseViewModeChange={setTeamCaseViewMode}
      monthlyGraphView={monthlyGraphView}
      onMonthlyGraphViewChange={setMonthlyGraphView}
      // リードタイムグラフ用のprops
      leadTimeGraphViewMode={leadTimeGraphViewMode}
      leadTimeVisibleMetrics={leadTimeVisibleMetrics}
      leadTimeShowPreviousYear={leadTimeShowPreviousYear}
      leadTimeCaseTypeFilter={leadTimeCaseTypeFilter}
      isLeadTimeGraphFilterOpen={isLeadTimeGraphFilterOpen}
      leadTimeOverallPerformanceData={leadTimeOverallPerformanceData}
      leadTimeMergedPerformanceData={leadTimeMergedPerformanceData}
      leadTimeAllPeriodData={leadTimeAllPeriodData}
      onLeadTimeGraphViewModeChange={setLeadTimeGraphViewMode}
      onLeadTimeVisibleMetricsChange={setLeadTimeVisibleMetrics}
      onLeadTimeShowPreviousYearChange={setLeadTimeShowPreviousYear}
      onLeadTimeCaseTypeFilterChange={setLeadTimeCaseTypeFilter}
      onIsLeadTimeGraphFilterOpenChange={setIsLeadTimeGraphFilterOpen}
      onHandleSaveCategories={handleSaveCategories}
      onHandleBarClickBase={handleBarClickBase}
    />
  );
}
