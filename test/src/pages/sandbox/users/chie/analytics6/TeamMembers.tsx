import {
  LfChartBar,
  LfCloseLarge,
  LfEye,
  LfFilter,
  LfSort19,
  LfSort91,
  LfTable,
  LfWarningTriangle,
} from "@legalforce/aegis-icons";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Combobox,
  ContentHeader,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FormControl,
  Icon,
  IconButton,
  PageLayout,
  Popover,
  RangeDateField,
  SegmentedControl,
  Select,
  Tab,
  TagPicker,
  Text,
} from "@legalforce/aegis-react";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CaseData } from "./data";
import { CASE_TYPE_ORDER, caseData, teamMembers } from "./data";

const INITIAL_LEAD_TIME_CATEGORIES = {
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
};

type LeadTimeCategories = typeof INITIAL_LEAD_TIME_CATEGORIES;

type LeadTimeCompositionData = {
  name: string;
  main_idle: number;
  main_work: number;
  main_wait: number;
  sub_work: number;
  sub_wait: number;
};

type MemberPerformanceData = {
  name: string;
  main_count: number;
  sub_count: number;
  medianFirstReplyTime: number;
};

// --- Constants defined outside the component ---

type DueDateFilter = "すべて" | "納期超過" | "今日まで" | "〜3日後" | "〜1週間後" | "1週間後〜" | "納期未入力";

type AssigneeFilterMode = "main" | "sub" | "both";

const STATUS_ORDER: {
  key: "未着手" | "確認中" | "2次確認中" | "自部門外確認中";
  name: string;
  color: string;
}[] = [
  { key: "未着手", name: "未着手", color: "#a0aec0" },
  { key: "確認中", name: "確認中", color: "#4299e1" },
  { key: "2次確認中", name: "2次確認中", color: "#9f7aea" },
  { key: "自部門外確認中", name: "自部門外確認中", color: "#ed8636" },
];

// 滞留期間の定義
const DURATION_BUCKETS = {
  "~ 3日": { min: 0, max: 3, color: "var(--aegis-color-background-success)" },
  "4 ~ 7日": { min: 4, max: 7, color: "#90CDF4" }, // 薄い青 (successとwarningの間として) または別の色
  "8 ~ 14日": { min: 8, max: 14, color: "var(--aegis-color-background-warning)" },
  "15日 ~": { min: 15, max: Infinity, color: "var(--aegis-color-background-danger)" },
};
type DurationBucket = keyof typeof DURATION_BUCKETS;

// --- Date Calculation Helpers (moved outside) ---
const today = new Date("2025-12-08"); // Assuming today is 2025-12-08 for consistent demo
today.setHours(0, 0, 0, 0);

const getDayDiff = (dateStr: string) => {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
};

const calculateLeadTime = (startDate: string, completionDate: string) => {
  const start = new Date(startDate);
  const end = new Date(completionDate);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
};

const calculateFirstReplyTime = (startDate: string, firstReplyDate: string) => {
  const start = new Date(startDate);
  const reply = new Date(firstReplyDate);
  // 日単位で差を計算
  return (reply.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
};

const calculateMedian = (values: number[]) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// --- Filter Helper ---
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
        case "〜3日後":
          return diff > 0 && diff <= 3;
        case "〜1週間後":
          return diff > 3 && diff <= 7;
        case "1週間後〜":
          return diff > 7;
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

const caseTableColumns: DataTableColumnDef<CaseData, string | number>[] = [
  {
    id: "caseName",
    name: "案件名",
    getValue: (row) => row.caseName,
  },
  {
    id: "status",
    name: "ステータス",
    getValue: (row) => row.status,
  },
  {
    id: "daysSinceStatusChange",
    name: "ステータス変更後日数",
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
      const days = info.value as number;
      const style: React.CSSProperties = { textAlign: "end" };
      if (days >= 14) {
        style.color = "var(--aegis-color-font-danger)";
        style.fontWeight = "bold";
      }
      return <DataTableCell style={style}>{days > 0 ? `${days}日` : "-"}</DataTableCell>;
    },
    sortable: true,
  },
  {
    id: "dueDate",
    name: "納期",
    getValue: (row) => row.dueDate, // Keep getValue for sorting/filtering
    renderCell: (info) => {
      if (!info.row.dueDate) return <DataTableCell />;
      const isOverdue = getDayDiff(info.row.dueDate) < 0;

      if (isOverdue) {
        return (
          <DataTableCell
            leading={
              <Icon size="small" color="danger">
                <LfWarningTriangle />
              </Icon>
            }
          >
            <Text color="danger">{info.value as string}</Text>
          </DataTableCell>
        );
      }
      return <DataTableCell>{info.value as string}</DataTableCell>;
    },
  },
];

export default function TeamMembers() {
  const [paneOpen, setPaneOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeDueDateFilter, setActiveDueDateFilter] = useState<DueDateFilter>("すべて");
  const [activeCaseTypeFilter, setActiveCaseTypeFilter] = useState<string>("すべて");
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("すべて");
  const [caseStatusView, setCaseStatusView] = useState<"status" | "type" | "duration">("status");
  const [personalCaseTypeFilter, setPersonalCaseTypeFilter] = useState<string>("すべて");
  const [performanceCaseTypeFilter, setPerformanceCaseTypeFilter] = useState<string>("すべて");
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [performanceSelectedMembers, setPerformanceSelectedMembers] = useState<string[]>([]);
  const [performanceDateRange, setPerformanceDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [performanceDateFieldKey, setPerformanceDateFieldKey] = useState(0);
  const [experienceViewIndex, setExperienceViewIndex] = useState(0);
  const [showEmptySubAssignee, setShowEmptySubAssignee] = useState(false);
  const [subAssignments, setSubAssignments] = useState<Record<string, string>>({});
  const [paneStatusFilter, setPaneStatusFilter] = useState("すべて");
  const [paneCaseTypeFilter, setPaneCaseTypeFilter] = useState("すべて");
  const [paneDueDateFilter, setPaneDueDateFilter] = useState<DueDateFilter>("すべて");
  const [paneContext, setPaneContext] = useState<{
    type: "statusDuration";
    member: string;
    status: string;
  } | null>(null);

  const [statusDurationCaseTypeFilter, setStatusDurationCaseTypeFilter] = useState("すべて");
  const [leadTimeViewMode, setLeadTimeViewMode] = useState<"composition" | "performance">("composition");
  const [leadTimeAssigneeFilterMode, setLeadTimeAssigneeFilterMode] = useState<AssigneeFilterMode>("both");
  const [leadTimeCategories, setLeadTimeCategories] = useState<LeadTimeCategories>(INITIAL_LEAD_TIME_CATEGORIES);
  const [isStatusSettingsOpen, setIsStatusSettingsOpen] = useState(false);
  const [assigneeFilterMode, setAssigneeFilterMode] = useState<AssigneeFilterMode>("main");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPerformanceFilterOpen, setIsPerformanceFilterOpen] = useState(false);
  const [teamCaseViewMode, setTeamCaseViewMode] = useState<"graph" | "table">("graph");

  const [visibleMetrics, setVisibleMetrics] = useState({
    新規案件数: true,
    完了案件数: true,
    リードタイム中央値: true,
    初回返信速度中央値: true,
  });

  const isPerformanceFiltering = performanceCaseTypeFilter !== "すべて";

  const unassignedCasesColumns: DataTableColumnDef<CaseData, string | number>[] = useMemo(() => {
    const baseColumns: DataTableColumnDef<CaseData, string | number>[] = [
      {
        id: "caseName",
        name: "案件名",
        getValue: (row: CaseData) => row.caseName,
      },
      {
        id: "dueDate",
        name: "納期",
        getValue: (row: CaseData) => row.dueDate,
      },
      {
        id: "requester",
        name: "依頼者",
        getValue: (row: CaseData) => row.requester,
      },
      {
        id: "requestingDepartment",
        name: "依頼部署",
        getValue: (row: CaseData) => row.requestingDepartment,
      },
      {
        id: "assignee",
        name: "担当者",
        renderCell: (info) => {
          const memberNames = teamMembers.map((member) => ({ label: member, value: member }));
          return (
            <DataTableCell>
              <Combobox
                placeholder="担当者を選択"
                value={assignments[info.row.caseName] ?? ""}
                onChange={(selectedValue: string | null) => {
                  if (selectedValue) {
                    setAssignments((prev) => ({ ...prev, [info.row.caseName]: selectedValue }));
                  }
                }}
                options={memberNames}
              />
            </DataTableCell>
          );
        },
      },
    ];

    if (showEmptySubAssignee) {
      baseColumns.push({
        id: "subAssignee",
        name: "副担当者",
        renderCell: (info: { row: CaseData }) => {
          const memberNames = teamMembers.map((member) => ({ label: member, value: member }));
          return (
            <DataTableCell>
              <Combobox
                placeholder="副担当者を選択"
                value={subAssignments[info.row.caseName] ?? info.row.subAssignee ?? ""}
                onChange={(selectedValue: string | null) => {
                  if (selectedValue) {
                    setSubAssignments((prev) => ({ ...prev, [info.row.caseName]: selectedValue }));
                  }
                }}
                options={memberNames}
              />
            </DataTableCell>
          );
        },
      });
    }

    return baseColumns;
  }, [assignments, showEmptySubAssignee, subAssignments]);

  const selectedMemberMainCases = useMemo(() => {
    const cases = caseData.filter((c) => c.assignee === selectedMember && !c.completionDate);
    return filterCases(cases, paneStatusFilter, paneCaseTypeFilter, paneDueDateFilter);
  }, [selectedMember, paneStatusFilter, paneCaseTypeFilter, paneDueDateFilter]);

  const selectedMemberSubCases = useMemo(() => {
    const cases = caseData.filter((c) => c.subAssignee === selectedMember && !c.completionDate);
    return filterCases(cases, paneStatusFilter, paneCaseTypeFilter, paneDueDateFilter);
  }, [selectedMember, paneStatusFilter, paneCaseTypeFilter, paneDueDateFilter]);

  const membersWithOverdueCases = useMemo(() => {
    const overdueAssignees = new Set<string>();
    caseData.forEach((caseItem) => {
      if (!caseItem.completionDate && caseItem.dueDate && getDayDiff(caseItem.dueDate) < 0) {
        overdueAssignees.add(caseItem.assignee);
      }
    });
    return overdueAssignees;
  }, []);

  const unassignedCases = useMemo(() => {
    let filtered = caseData.filter((c) => c.assignee === "");
    if (showEmptySubAssignee) {
      filtered = filtered.filter((c) => !c.subAssignee);
    }
    return filtered.slice(0, 10);
  }, [showEmptySubAssignee]);

  const overallPerformanceData = useMemo(() => {
    const monthlyData: Record<
      string, // "YYYY-MM"
      {
        newCount: number;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        leadTimes: number[];
        firstReplyTimes: number[];
      }
    > = {};

    const casesToConsider =
      performanceCaseTypeFilter === "すべて"
        ? caseData
        : caseData.filter((c) => c.caseType === performanceCaseTypeFilter);

    casesToConsider.forEach((c) => {
      const startMonth = c.startDate.substring(0, 7);
      if (!monthlyData[startMonth]) {
        monthlyData[startMonth] = {
          newCount: 0,
          onTimeCompletionCount: 0,
          overdueCompletionCount: 0,
          leadTimes: [],
          firstReplyTimes: [],
        };
      }
      monthlyData[startMonth].newCount += 1;

      if (c.completionDate) {
        const completionMonth = c.completionDate.substring(0, 7);
        if (!monthlyData[completionMonth]) {
          monthlyData[completionMonth] = {
            newCount: 0,
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
            leadTimes: [],
            firstReplyTimes: [],
          };
        }

        const isOverdue = c.dueDate && new Date(c.completionDate) > new Date(c.dueDate);
        if (isOverdue) {
          monthlyData[completionMonth].overdueCompletionCount += 1;
        } else {
          monthlyData[completionMonth].onTimeCompletionCount += 1;
        }

        monthlyData[completionMonth].leadTimes.push(calculateLeadTime(c.startDate, c.completionDate));
        if (c.firstReplyDate) {
          monthlyData[completionMonth].firstReplyTimes.push(calculateFirstReplyTime(c.startDate, c.firstReplyDate));
        }
      }
    });

    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        return {
          name: `${parseInt(monthKey.substring(5), 10)}月`,
          新規案件数: data.newCount,
          onTimeCompletionCount: data.onTimeCompletionCount,
          overdueCompletionCount: data.overdueCompletionCount,
          リードタイム中央値: parseFloat(calculateMedian(data.leadTimes).toFixed(1)),
          初回返信速度中央値: parseFloat(calculateMedian(data.firstReplyTimes).toFixed(1)),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }, [performanceCaseTypeFilter]);

  const personalPerformanceData = useMemo(() => {
    const completedCases = caseData.filter((c) => c.completionDate);
    const monthlyData: Record<
      string, // "YYYY-MM"
      Record<
        string, // assignee
        Record<
          string, // caseType | "すべて"
          {
            onTimeCompletionCount: number;
            overdueCompletionCount: number;
            leadTimes: number[];
            firstReplyTimes: number[];
          }
        >
      >
    > = {};

    completedCases.forEach((c) => {
      const completionMonth = c.completionDate ? c.completionDate.substring(0, 7) : ""; // "YYYY-MM"
      if (!completionMonth) return;

      if (!monthlyData[completionMonth]) {
        monthlyData[completionMonth] = {};
      }
      if (!monthlyData[completionMonth][c.assignee]) {
        monthlyData[completionMonth][c.assignee] = {
          すべて: {
            onTimeCompletionCount: 0,
            overdueCompletionCount: 0,
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
          leadTimes: [],
          firstReplyTimes: [],
        };
      }

      const updateCounts = (data: {
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        leadTimes: number[];
        firstReplyTimes: number[];
      }) => {
        if (c.completionDate && c.dueDate && new Date(c.completionDate) > new Date(c.dueDate)) {
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

      // Aggregate for "すべて"
      updateCounts(memberMonthData.すべて);

      // Aggregate for specific case type
      if (c.completionDate) {
        updateCounts(memberMonthData[c.caseType]);
      }
    });

    const formattedData: Record<
      string, // assignee
      {
        name: string;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        リードタイム中央値: number;
        初回返信速度中央値: number;
      }[]
    > = {};

    for (const member of teamMembers) {
      const memberChartData: {
        name: string;
        onTimeCompletionCount: number;
        overdueCompletionCount: number;
        リードタイム中央値: number;
        初回返信速度中央値: number;
      }[] = [];
      for (const monthKey in monthlyData) {
        const memberMonthData = monthlyData[monthKey][member];
        if (memberMonthData) {
          const dataForFilter = memberMonthData[personalCaseTypeFilter];
          if (dataForFilter) {
            const completedCount = dataForFilter.onTimeCompletionCount + dataForFilter.overdueCompletionCount;
            if (completedCount > 0) {
              memberChartData.push({
                name: `${parseInt(monthKey.substring(5), 10)}月`,
                onTimeCompletionCount: dataForFilter.onTimeCompletionCount,
                overdueCompletionCount: dataForFilter.overdueCompletionCount,
                リードタイム中央値: parseFloat(calculateMedian(dataForFilter.leadTimes).toFixed(1)),
                初回返信速度中央値: parseFloat(calculateMedian(dataForFilter.firstReplyTimes).toFixed(1)),
              });
            }
          }
        }
      }
      formattedData[member] = memberChartData.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      );
    }

    return formattedData;
  }, [personalCaseTypeFilter]);

  // --- Memoized Filtering Logic ---
  const filteredCasesForMainView = useMemo(() => {
    return caseData.filter((c) => {
      const caseTypeMatch = activeCaseTypeFilter === "すべて" || c.caseType === activeCaseTypeFilter;
      const statusMatch = activeStatusFilter === "すべて" || c.status === activeStatusFilter;
      return caseTypeMatch && statusMatch;
    });
  }, [activeCaseTypeFilter, activeStatusFilter]);

  const dueDateSummary = useMemo(() => {
    const ongoingCases = filteredCasesForMainView.filter((c) => !c.completionDate);

    const summary = {
      すべて: ongoingCases.length,
      納期超過: 0,
      今日まで: 0,
      "〜3日後": 0,
      "〜1週間後": 0,
      "1週間後〜": 0,
      納期未入力: 0,
    };
    ongoingCases.forEach((item) => {
      if (!item.dueDate) {
        summary.納期未入力 += 1;
        return;
      }
      const diff = getDayDiff(item.dueDate);
      if (diff < 0) {
        summary.納期超過 += 1;
      } else if (diff === 0) {
        summary.今日まで += 1;
      } else if (diff <= 3) {
        summary["〜3日後"] += 1;
      } else if (diff <= 7) {
        summary["〜1週間後"] += 1;
      } else {
        summary["1週間後〜"] += 1;
      }
    });
    return summary;
  }, [filteredCasesForMainView]);

  const filteredData = useMemo(() => {
    const ongoingCases = filteredCasesForMainView.filter((c) => !c.completionDate);
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
        case "〜3日後":
          return diff > 0 && diff <= 3;
        case "〜1週間後":
          return diff > 3 && diff <= 7;
        case "1週間後〜":
          return diff > 7;
        default:
          return false;
      }
    });
  }, [activeDueDateFilter, filteredCasesForMainView]);

  const caseCountByMemberAndDuration = useMemo(() => {
    // 初期化: 各メンバーに対して、各期間バケットを0で初期化
    const initialData = teamMembers.reduce<
      Record<
        string,
        {
          name: string;
          details: Record<string, string[]>;
        } & Record<string, number | string | Record<string, string[]>>
      >
    >((acc, member) => {
      acc[member] = {
        name: member,
        details: {},
      };
      // Initialize both main and sub buckets
      for (const bucket of Object.keys(DURATION_BUCKETS)) {
        acc[member][`${bucket}_main`] = 0;
        acc[member][`${bucket}_sub`] = 0;
        acc[member].details[`${bucket}_main`] = [];
        acc[member].details[`${bucket}_sub`] = [];
      }
      return acc;
    }, {});

    // 進行中の案件のみを対象（各種フィルター適用済みのデータを使用）
    const ongoingCases = filteredData;

    ongoingCases.forEach((c) => {
      const targetMembers: { name: string; isSub: boolean }[] = [];
      if (c.assignee && (assigneeFilterMode === "main" || assigneeFilterMode === "both")) {
        targetMembers.push({ name: c.assignee, isSub: false });
      }
      if (c.subAssignee && (assigneeFilterMode === "sub" || assigneeFilterMode === "both")) {
        targetMembers.push({ name: c.subAssignee, isSub: true });
      }

      if (!c.statusHistory || c.statusHistory.length === 0 || targetMembers.length === 0) return;

      const lastStatus = c.statusHistory[c.statusHistory.length - 1];
      const lastStatusDate = new Date(lastStatus.startDate);
      const todayDate = new Date(today);
      lastStatusDate.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);

      const diffTime = todayDate.getTime() - lastStatusDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      targetMembers.forEach(({ name, isSub }) => {
        const memberData = initialData[name];
        if (!memberData) return;

        for (const [key, range] of Object.entries(DURATION_BUCKETS)) {
          if (diffDays >= range.min && diffDays <= range.max) {
            const suffix = isSub ? "_sub" : "_main";
            const bucketKey = `${key}${suffix}`;
            const currentCount = memberData[bucketKey];
            if (typeof currentCount === "number") {
              memberData[bucketKey] = currentCount + 1;
            }
            const caseLabel = isSub ? `${c.caseName} (副)` : c.caseName;
            memberData.details[bucketKey].push(`${c.status}: ${caseLabel}`);
            break;
          }
        }
      });
    });

    const dataToSort = Object.values(initialData);
    dataToSort.sort((a, b) => {
      let totalA = 0;
      let totalB = 0;
      for (const bucket of Object.keys(DURATION_BUCKETS)) {
        totalA += ((a[`${bucket}_main`] as number) || 0) + ((a[`${bucket}_sub`] as number) || 0);
        totalB += ((b[`${bucket}_main`] as number) || 0) + ((b[`${bucket}_sub`] as number) || 0);
      }

      if (sortOrder === "asc") {
        return totalA - totalB;
      }
      return totalB - totalA;
    });

    return dataToSort;
  }, [filteredData, sortOrder, assigneeFilterMode]);

  const chartData = useMemo(() => {
    if (caseStatusView === "status") {
      const memberCaseCounts = teamMembers.reduce(
        (acc, member) => {
          acc[member] = {
            name: member,
            未着手_main: 0,
            未着手_sub: 0,
            確認中_main: 0,
            確認中_sub: 0,
            "2次確認中_main": 0,
            "2次確認中_sub": 0,
            自部門外確認中_main: 0,
            自部門外確認中_sub: 0,
            caseNames: {
              未着手_main: [],
              未着手_sub: [],
              確認中_main: [],
              確認中_sub: [],
              "2次確認中_main": [],
              "2次確認中_sub": [],
              自部門外確認中_main: [],
              自部門外確認中_sub: [],
            },
          };
          return acc;
        },
        {} as Record<
          string,
          {
            name: string;
            未着手_main: number;
            未着手_sub: number;
            確認中_main: number;
            確認中_sub: number;
            "2次確認中_main": number;
            "2次確認中_sub": number;
            自部門外確認中_main: number;
            自部門外確認中_sub: number;
            caseNames: {
              未着手_main: string[];
              未着手_sub: string[];
              確認中_main: string[];
              確認中_sub: string[];
              "2次確認中_main": string[];
              "2次確認中_sub": string[];
              自部門外確認中_main: string[];
              自部門外確認中_sub: string[];
            };
          }
        >,
      );

      filteredData.forEach((caseItem) => {
        const targetMembers: { name: string; isSub: boolean }[] = [];
        if (caseItem.assignee && (assigneeFilterMode === "main" || assigneeFilterMode === "both")) {
          targetMembers.push({ name: caseItem.assignee, isSub: false });
        }
        if (caseItem.subAssignee && (assigneeFilterMode === "sub" || assigneeFilterMode === "both")) {
          targetMembers.push({ name: caseItem.subAssignee, isSub: true });
        }

        targetMembers.forEach(({ name, isSub }) => {
          const countItem = memberCaseCounts[name];
          if (countItem) {
            const status = caseItem.status as "未着手" | "確認中" | "2次確認中" | "自部門外確認中";
            const suffix = isSub ? "_sub" : "_main";
            const key = `${status}${suffix}` as keyof typeof countItem;

            if (typeof countItem[key] === "number") {
              (countItem[key] as number) += 1;
              const caseLabel = isSub ? `${caseItem.caseName} (副)` : caseItem.caseName;
              // @ts-expect-error
              countItem.caseNames[key].push(caseLabel);
            }
          }
        });
      });
      const dataToSort = Object.values(memberCaseCounts);
      dataToSort.sort((a, b) => {
        const totalA =
          a.未着手_main +
          a.未着手_sub +
          a.確認中_main +
          a.確認中_sub +
          a["2次確認中_main"] +
          a["2次確認中_sub"] +
          a.自部門外確認中_main +
          a.自部門外確認中_sub;
        const totalB =
          b.未着手_main +
          b.未着手_sub +
          b.確認中_main +
          b.確認中_sub +
          b["2次確認中_main"] +
          b["2次確認中_sub"] +
          b.自部門外確認中_main +
          b.自部門外確認中_sub;
        if (sortOrder === "asc") {
          return totalA - totalB;
        }
        return totalB - totalA;
      });
      return dataToSort;
    }
    // caseType view
    const memberCaseCounts = teamMembers.reduce(
      (acc, member) => {
        acc[member] = {
          name: member,
          契約書審査_main: 0,
          契約書審査_sub: 0,
          契約書起案_main: 0,
          契約書起案_sub: 0,
          法務相談_main: 0,
          法務相談_sub: 0,
          その他_main: 0,
          その他_sub: 0,
          caseNames: {
            契約書審査_main: [],
            契約書審査_sub: [],
            契約書起案_main: [],
            契約書起案_sub: [],
            法務相談_main: [],
            法務相談_sub: [],
            その他_main: [],
            その他_sub: [],
          },
        };
        return acc;
      },
      {} as Record<
        string,
        {
          name: string;
          契約書審査_main: number;
          契約書審査_sub: number;
          契約書起案_main: number;
          契約書起案_sub: number;
          法務相談_main: number;
          法務相談_sub: number;
          その他_main: number;
          その他_sub: number;
          caseNames: {
            契約書審査_main: string[];
            契約書審査_sub: string[];
            契約書起案_main: string[];
            契約書起案_sub: string[];
            法務相談_main: string[];
            法務相談_sub: string[];
            その他_main: string[];
            その他_sub: string[];
          };
        }
      >,
    );

    filteredData.forEach((caseItem) => {
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
        const key = `${caseItem.caseType}${suffix}` as keyof typeof countItem;

        if (countItem && typeof countItem[key] === "number") {
          (countItem[key] as number) += 1;
          const caseLabel = isSub ? `${caseItem.caseName} (副)` : caseItem.caseName;
          // @ts-expect-error
          countItem.caseNames[key].push(caseLabel);
        }
      });
    });

    const dataToSort = Object.values(memberCaseCounts);
    dataToSort.sort((a, b) => {
      const totalA =
        a.契約書審査_main +
        a.契約書審査_sub +
        a.契約書起案_main +
        a.契約書起案_sub +
        a.法務相談_main +
        a.法務相談_sub +
        a.その他_main +
        a.その他_sub;
      const totalB =
        b.契約書審査_main +
        b.契約書審査_sub +
        b.契約書起案_main +
        b.契約書起案_sub +
        b.法務相談_main +
        b.法務相談_sub +
        b.その他_main +
        b.その他_sub;
      if (sortOrder === "asc") {
        return totalA - totalB;
      }
      return totalB - totalA;
    });

    return dataToSort;
  }, [filteredData, sortOrder, caseStatusView, assigneeFilterMode]);

  const teamStatusColumns = useMemo(() => {
    type RowData = Record<string, number | string | Record<string, string[]>>;
    const nameCol: DataTableColumnDef<RowData, string> = {
      id: "name",
      name: "メンバー",
      getValue: (row) => row.name as string,
    };

    let variableCols: DataTableColumnDef<RowData, number>[] = [];

    if (caseStatusView === "status") {
      variableCols = STATUS_ORDER.map((status) => ({
        id: status.key,
        name: status.name,
        getValue: (row) => ((row[`${status.key}_main`] as number) || 0) + ((row[`${status.key}_sub`] as number) || 0),
      }));
    } else if (caseStatusView === "type") {
      variableCols = ["契約書審査", "契約書起案", "法務相談", "その他"].map((type) => ({
        id: type,
        name: type,
        getValue: (row) => ((row[`${type}_main`] as number) || 0) + ((row[`${type}_sub`] as number) || 0),
      }));
    } else if (caseStatusView === "duration") {
      variableCols = Object.keys(DURATION_BUCKETS).map((bucket) => ({
        id: bucket,
        name: bucket,
        getValue: (row) => ((row[`${bucket}_main`] as number) || 0) + ((row[`${bucket}_sub`] as number) || 0),
      }));
    }

    return [nameCol, ...variableCols];
  }, [caseStatusView]);

  const leadTimeCompositionData = useMemo(() => {
    const result: LeadTimeCompositionData[] = [];
    const today = new Date();

    teamMembers.forEach((member) => {
      const data: LeadTimeCompositionData = {
        name: member,
        main_idle: 0,
        main_work: 0,
        main_wait: 0,
        sub_work: 0,
        sub_wait: 0,
      };

      let mainCaseCount = 0;
      let subCaseCount = 0;

      const memberCases = caseData.filter(
        (c) =>
          (c.assignee === member || c.subAssignee === member) &&
          (statusDurationCaseTypeFilter === "すべて" || c.caseType === statusDurationCaseTypeFilter),
      );

      memberCases.forEach((c) => {
        const isMain = c.assignee === member;
        const isSub = c.subAssignee === member;

        if (isMain) mainCaseCount++;
        if (isSub) subCaseCount++;

        c.statusHistory?.forEach((history) => {
          const endDate = history.endDate ? new Date(history.endDate) : today;
          const duration = (endDate.getTime() - new Date(history.startDate).getTime()) / (1000 * 60 * 60 * 24);

          if (duration < 0) return;

          if (isMain) {
            if ((leadTimeCategories.MAIN.IDLE as (string | undefined)[]).includes(history.status)) {
              data.main_idle += duration;
            } else if ((leadTimeCategories.MAIN.WORK as (string | undefined)[]).includes(history.status)) {
              data.main_work += duration;
            } else if ((leadTimeCategories.MAIN.WAIT as (string | undefined)[]).includes(history.status)) {
              data.main_wait += duration;
            }
          } else if (isSub) {
            if ((leadTimeCategories.SUB.WORK as (string | undefined)[]).includes(history.status)) {
              data.sub_work += duration;
            } else if ((leadTimeCategories.SUB.WAIT as (string | undefined)[]).includes(history.status)) {
              data.sub_wait += duration;
            }
          }
        });
      });

      if (mainCaseCount > 0) {
        data.main_idle = parseFloat((data.main_idle / mainCaseCount).toFixed(1));
        data.main_work = parseFloat((data.main_work / mainCaseCount).toFixed(1));
        data.main_wait = parseFloat((data.main_wait / mainCaseCount).toFixed(1));
      }
      if (subCaseCount > 0) {
        data.sub_work = parseFloat((data.sub_work / subCaseCount).toFixed(1));
        data.sub_wait = parseFloat((data.sub_wait / subCaseCount).toFixed(1));
      }

      result.push(data);
    });

    return result;
  }, [statusDurationCaseTypeFilter, leadTimeCategories]);

  const memberPerformanceData = useMemo(() => {
    const result: MemberPerformanceData[] = [];

    teamMembers.forEach((member) => {
      const memberCases = caseData.filter(
        (c) =>
          (c.assignee === member || c.subAssignee === member) &&
          (statusDurationCaseTypeFilter === "すべて" || c.caseType === statusDurationCaseTypeFilter),
      );

      const mainCases = memberCases.filter((c) => c.assignee === member);
      const subCases = memberCases.filter((c) => c.subAssignee === member);

      const firstReplyTimes = mainCases
        .filter((c) => c.startDate && c.firstReplyDate)
        .map((c) => calculateFirstReplyTime(c.startDate as string, c.firstReplyDate as string));

      result.push({
        name: member,
        main_count: mainCases.length,
        sub_count: subCases.length,
        medianFirstReplyTime: parseFloat(calculateMedian(firstReplyTimes).toFixed(1)),
      });
    });

    return result;
  }, [statusDurationCaseTypeFilter]);

  const handleSaveCategories = (nextCategories: LeadTimeCategories) => {
    setLeadTimeCategories(nextCategories);
    setIsStatusSettingsOpen(false);
  };

  const maxCaseCount = useMemo(() => {
    const counts = teamMembers.map((member) => {
      const memberCases = caseData.filter((c) => c.assignee === member && !c.completionDate);
      return memberCases.length;
    });
    const max = Math.max(...counts);
    return max > 0 ? max + 2 : 10;
  }, []);

  const mainExperienceCompletedCases = useMemo(() => {
    if (!selectedMember) return [];
    return caseData.filter((c) => {
      const isMain = c.assignee === selectedMember;
      if (!isMain || !c.completionDate) return false;
      if (personalCaseTypeFilter === "すべて") {
        return c.caseType === "契約書審査" || c.caseType === "契約書起案";
      }
      return c.caseType === personalCaseTypeFilter;
    });
  }, [selectedMember, personalCaseTypeFilter]);

  const subExperienceCompletedCases = useMemo(() => {
    if (!selectedMember) return [];
    return caseData.filter((c) => {
      const isSub = c.subAssignee === selectedMember;
      if (!isSub || !c.completionDate) return false;
      if (personalCaseTypeFilter === "すべて") {
        return c.caseType === "契約書審査" || c.caseType === "契約書起案";
      }
      return c.caseType === personalCaseTypeFilter;
    });
  }, [selectedMember, personalCaseTypeFilter]);

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

  const mainExperienceContractTypeCounts = useMemo(() => {
    const counts = mainExperienceCompletedCases.reduce<Record<string, number>>((acc, c) => {
      if (c.contractCategory) {
        acc[c.contractCategory] = (acc[c.contractCategory] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  }, [mainExperienceCompletedCases]);

  const subExperienceContractTypeCounts = useMemo(() => {
    const counts = subExperienceCompletedCases.reduce<Record<string, number>>((acc, c) => {
      if (c.contractCategory) {
        acc[c.contractCategory] = (acc[c.contractCategory] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  }, [subExperienceCompletedCases]);

  const caseTypeCountColumns: DataTableColumnDef<{ type: string; count: number }, string | number>[] = [
    { id: "type", name: "案件タイプ", getValue: (row) => row.type },
    {
      id: "count",
      name: "完了件数",
      getValue: (row) => row.count,
      renderCell: (info) => <DataTableCell style={{ textAlign: "end" }}>{`${info.value}件`}</DataTableCell>,
    },
  ];

  const experienceTableColumns: DataTableColumnDef<{ category: string; count: number }, string | number>[] = [
    { id: "category", name: "契約類型", getValue: (row) => row.category },
    {
      id: "count",
      name: "完了件数",
      getValue: (row) => row.count,
      renderCell: (info) => <DataTableCell style={{ textAlign: "end" }}>{`${info.value}件`}</DataTableCell>,
    },
  ];

  const mainAssignmentTableColumns: DataTableColumnDef<CaseData, string | number>[] = [
    { id: "caseName", name: "案件名", getValue: (row) => row.caseName },
    { id: "dueDate", name: "納期", getValue: (row) => row.dueDate || "-" },
    { id: "status", name: "ステータス", getValue: (row) => row.status },
    {
      id: "daysSinceStatusChange",
      name: "ステータス変更後日数",
      getValue: (row) => {
        if (!row.statusHistory || row.statusHistory.length === 0) return "-";
        const lastStatus = row.statusHistory[row.statusHistory.length - 1];
        const lastStatusDate = new Date(lastStatus.startDate);
        const todayDate = new Date();
        lastStatusDate.setHours(0, 0, 0, 0);
        todayDate.setHours(0, 0, 0, 0);
        const diffTime = todayDate.getTime() - lastStatusDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      },
      renderCell: (info) => {
        const days = info.value as number;
        let color = "inherit";
        if (days >= 15) color = "#E53E3E";
        else if (days >= 8) color = "#DD6B20";
        else if (days >= 4) color = "#3182CE";
        return <span style={{ color, fontWeight: days >= 8 ? "bold" : "normal" }}>{days}日</span>;
      },
    },
    { id: "subAssignee", name: "副担当者", getValue: (row) => row.subAssignee || "-" },
  ];

  const subAssignmentTableColumns: DataTableColumnDef<CaseData, string | number>[] = [
    { id: "caseName", name: "案件名", getValue: (row) => row.caseName },
    { id: "dueDate", name: "納期", getValue: (row) => row.dueDate || "-" },
    { id: "status", name: "ステータス", getValue: (row) => row.status },
    {
      id: "daysSinceStatusChange",
      name: "ステータス変更後日数",
      getValue: (row) => {
        if (!row.statusHistory || row.statusHistory.length === 0) return "-";
        const lastStatus = row.statusHistory[row.statusHistory.length - 1];
        const lastStatusDate = new Date(lastStatus.startDate);
        const todayDate = new Date();
        lastStatusDate.setHours(0, 0, 0, 0);
        todayDate.setHours(0, 0, 0, 0);
        const diffTime = todayDate.getTime() - lastStatusDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      },
      renderCell: (info) => {
        const days = info.value as number;
        let color = "inherit";
        if (days >= 15) color = "#E53E3E";
        else if (days >= 8) color = "#DD6B20";
        else if (days >= 4) color = "#3182CE";
        return <span style={{ color, fontWeight: days >= 8 ? "bold" : "normal" }}>{days}日</span>;
      },
    },
    { id: "mainAssignee", name: "案件担当者", getValue: (row) => row.assignee },
  ];

  const completedCasesColumns: DataTableColumnDef<CaseData, string | number>[] = [
    { id: "caseName", name: "案件名", getValue: (row) => row.caseName },
    { id: "contractCategory", name: "契約類型", getValue: (row) => row.contractCategory || "-" },
    { id: "completionDate", name: "完了日", getValue: (row) => row.completionDate || "-" },
  ];

  const statusDurationDetailCases = useMemo(() => {
    if (paneContext?.type !== "statusDuration") return [];

    return caseData.filter(
      (c) =>
        c.assignee === paneContext.member &&
        c.statusHistory?.some((h) => h.status === paneContext.status) &&
        (statusDurationCaseTypeFilter === "すべて" || c.caseType === statusDurationCaseTypeFilter),
    );
  }, [paneContext, statusDurationCaseTypeFilter]);

  interface CustomYAxisTickProps {
    x?: number | string;
    y?: number | string;
    payload?: {
      value: string;
    };
    setPaneOpen: Dispatch<SetStateAction<boolean>>;
    setSelectedMember: Dispatch<SetStateAction<string | null>>;
    setSelectedTabIndex: Dispatch<SetStateAction<number>>;
    membersWithOverdueCases: Set<string>;
    activeCaseTypeFilter: string;
    setPaneCaseTypeFilter: Dispatch<SetStateAction<string>>;
    setPersonalCaseTypeFilter: Dispatch<SetStateAction<string>>;
    activeDueDateFilter: DueDateFilter;
    setPaneDueDateFilter: Dispatch<SetStateAction<DueDateFilter>>;
    activeStatusFilter: string;
    setPaneStatusFilter: Dispatch<SetStateAction<string>>;
    assigneeFilterMode: AssigneeFilterMode;
  }

  const CustomYAxisTick = (props: CustomYAxisTickProps) => {
    const {
      x,
      y,
      payload,
      setPaneOpen,
      setSelectedMember,
      setSelectedTabIndex,
      membersWithOverdueCases,
      activeCaseTypeFilter,
      setPaneCaseTypeFilter,
      setPersonalCaseTypeFilter,
      activeDueDateFilter,
      setPaneDueDateFilter,
      activeStatusFilter,
      setPaneStatusFilter,
      assigneeFilterMode,
    } = props;
    const tickWidth = 140; // Increased for icon and labels
    const tickHeight = 40;
    const [isHovered, setIsHovered] = useState(false);

    // payload, x, y can be undefined, so we need to check for them
    if (x === undefined || y === undefined || !payload?.value) {
      return null;
    }
    const xPos = typeof x === "number" ? x : Number(x);
    const yPos = typeof y === "number" ? y : Number(y);

    const memberName = payload.value;
    const hasOverdue = membersWithOverdueCases.has(memberName);

    return (
      <g transform={`translate(${xPos - tickWidth}, ${yPos - tickHeight / 2})`}>
        <foreignObject x={0} y={0} width={tickWidth} height={tickHeight}>
          <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => {
                setSelectedTabIndex(0);
                setPaneOpen(true);
                setSelectedMember(memberName);
                setPaneCaseTypeFilter(activeCaseTypeFilter);
                setPersonalCaseTypeFilter(activeCaseTypeFilter);
                setPaneDueDateFilter(activeDueDateFilter);
                setPaneStatusFilter(activeStatusFilter);
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                font: "inherit",
                color: hasOverdue
                  ? "#E53E3E" // Use direct color code for red
                  : isHovered
                    ? "var(--aegis-color-font-link)"
                    : "var(--aegis-color-font-default)",
                cursor: "pointer",
                flex: 1,
                textAlign: "right",
                lineHeight: "1.2",
                textDecoration: "underline",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "var(--aegis-space-xxSmall)",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {hasOverdue && (
                  <Icon size="small" style={{ marginRight: "4px" }}>
                    <LfWarningTriangle />
                  </Icon>
                )}
                {memberName}
              </span>
            </button>
            {assigneeFilterMode && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "10px",
                  marginLeft: "8px",
                  width: "20px",
                  color: "var(--aegis-color-font-subtle)",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                {(assigneeFilterMode === "main" || assigneeFilterMode === "both") && (
                  <div style={{ flex: 1, display: "flex", alignItems: "center" }}>主</div>
                )}
                {(assigneeFilterMode === "sub" || assigneeFilterMode === "both") && (
                  <div style={{ flex: 1, display: "flex", alignItems: "center" }}>副</div>
                )}
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    );
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: {
      value: number | string;
      name: string;
      fill: string;
      payload: {
        name: string;
        caseNames?: Record<string, string[]>;
      };
    }[];
  }
  const CustomTooltip = (props: CustomTooltipProps) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const pld = payload[0];
      if (!pld || pld.value === 0 || !pld.payload) {
        return null;
      }

      const memberData = pld.payload;
      const memberName = memberData.name;
      const statusName = pld.name ?? "";
      const caseNames = memberData.caseNames?.[statusName] ?? [];

      if (caseNames.length === 0) {
        return null;
      }

      return (
        <div
          style={{
            backgroundColor: "var(--aegis-color-background-default)",
            border: "1px solid var(--aegis-color-border-default)",
            borderRadius: "var(--aegis-border-radius-medium)",
            boxShadow: "var(--aegis-shadow-small)",
            padding: "var(--aegis-space-medium)",
            fontSize: "var(--aegis-font-size-small)",
            zIndex: 999,
          }}
        >
          <Text variant="body.medium.bold">{memberName}</Text>
          <div style={{ marginTop: "var(--aegis-space-small)" }}>
            <Text variant="body.small.bold" style={{ color: pld.fill }}>
              {pld.name}
            </Text>
            <ul style={{ paddingLeft: "20px", margin: "4px 0 0 0", listStyleType: "disc" }}>
              {caseNames.map((name: string) => (
                <li key={name}>
                  <Text variant="body.small">{name}</Text>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    return null;
  };

  const StatusSettingsDialog = (props: {
    open: boolean;
    onClose: () => void;
    categories: LeadTimeCategories;
    onSave: (categories: LeadTimeCategories) => void;
  }) => {
    const { open, onClose, categories, onSave } = props;
    const [tempCategories, setTempCategories] = useState<LeadTimeCategories>(categories);

    // Synchronize temp state when dialog opens
    useMemo(() => {
      if (open) {
        setTempCategories(categories);
      }
    }, [open, categories]);

    const handleMainChange = (status: string, category: "IDLE" | "WORK" | "WAIT" | "IGNORE") => {
      setTempCategories((prev) => {
        const next = { ...prev, MAIN: { ...prev.MAIN } };
        // Remove from all categories first
        next.MAIN.IDLE = next.MAIN.IDLE.filter((s) => s !== status);
        next.MAIN.WORK = next.MAIN.WORK.filter((s) => s !== status);
        next.MAIN.WAIT = next.MAIN.WAIT.filter((s) => s !== status);
        next.MAIN.IGNORE = (next.MAIN.IGNORE || []).filter((s) => s !== status);
        // Add to selected category
        next.MAIN[category] = [...next.MAIN[category], status];
        return next;
      });
    };

    const handleSubChange = (status: string, category: "WORK" | "WAIT" | "IGNORE") => {
      setTempCategories((prev) => {
        const next = { ...prev, SUB: { ...prev.SUB } };
        // Remove from all categories first
        next.SUB.WORK = next.SUB.WORK.filter((s) => s !== status);
        next.SUB.WAIT = next.SUB.WAIT.filter((s) => s !== status);
        next.SUB.IGNORE = (next.SUB.IGNORE || []).filter((s) => s !== status);
        // Add to selected category
        next.SUB[category] = [...next.SUB[category], status];
        return next;
      });
    };

    return (
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent width="large">
          <DialogHeader>
            <ContentHeader>
              <ContentHeader.Title>ステータス分類設定</ContentHeader.Title>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xlarge)" }}>
              <div>
                <Text
                  variant="body.medium.bold"
                  style={{ marginBottom: "var(--aegis-space-medium)", display: "block" }}
                >
                  ■ 主担当としての作業分類
                </Text>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                  {STATUS_ORDER.map((status) => {
                    const currentCategory: "IDLE" | "WORK" | "WAIT" | "IGNORE" = tempCategories.MAIN.IDLE.includes(
                      status.key,
                    )
                      ? "IDLE"
                      : tempCategories.MAIN.WORK.includes(status.key)
                        ? "WORK"
                        : tempCategories.MAIN.WAIT.includes(status.key)
                          ? "WAIT"
                          : "IGNORE";
                    return (
                      <FormControl orientation="horizontal" key={`main-${status.key}`}>
                        <FormControl.Label style={{ width: "160px" }}>{status.name}</FormControl.Label>
                        <Select
                          value={currentCategory}
                          onChange={(val) => handleMainChange(status.key, val as "IDLE" | "WORK" | "WAIT" | "IGNORE")}
                          options={[
                            { label: "未着手", value: "IDLE" },
                            { label: "作業中", value: "WORK" },
                            { label: "他者待ち", value: "WAIT" },
                            { label: "非表示", value: "IGNORE" },
                          ]}
                        />
                      </FormControl>
                    );
                  })}
                </div>
              </div>

              <div>
                <Text
                  variant="body.medium.bold"
                  style={{ marginBottom: "var(--aegis-space-medium)", display: "block" }}
                >
                  ■ 副担当としての作業分類
                </Text>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                  {STATUS_ORDER.map((status) => {
                    const currentCategory: "WORK" | "WAIT" | "IGNORE" = tempCategories.SUB.WORK.includes(status.key)
                      ? "WORK"
                      : tempCategories.SUB.WAIT.includes(status.key)
                        ? "WAIT"
                        : "IGNORE";
                    return (
                      <FormControl orientation="horizontal" key={`sub-${status.key}`}>
                        <FormControl.Label style={{ width: "160px" }}>{status.name}</FormControl.Label>
                        <Select
                          value={currentCategory}
                          onChange={(val) => handleSubChange(status.key, val as "WORK" | "WAIT" | "IGNORE")}
                          options={[
                            { label: "作業中", value: "WORK" },
                            { label: "待機中", value: "WAIT" },
                            { label: "非表示", value: "IGNORE" },
                          ]}
                        />
                      </FormControl>
                    );
                  })}
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={onClose}>
                キャンセル
              </Button>
              <Button onClick={() => onSave(tempCategories)}>保存</Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  interface CustomDurationTooltipProps {
    active?: boolean;
    payload?: {
      value: number;
      name: string;
      fill: string;
      payload: {
        name: string;
        details: Record<DurationBucket, string[]>;
      };
    }[];
  }

  const CustomDurationTooltip = (props: CustomDurationTooltipProps) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const pld = payload[0];
      if (!pld || pld.value === 0 || !pld.payload) {
        return null;
      }

      const memberData = pld.payload;
      const memberName = memberData.name;
      const bucketName = pld.name as DurationBucket;
      const details = memberData.details?.[bucketName] ?? [];

      if (details.length === 0) {
        return null;
      }

      return (
        <div
          style={{
            backgroundColor: "var(--aegis-color-background-default)",
            border: "1px solid var(--aegis-color-border-default)",
            borderRadius: "var(--aegis-border-radius-medium)",
            boxShadow: "var(--aegis-shadow-small)",
            padding: "var(--aegis-space-medium)",
            fontSize: "var(--aegis-font-size-small)",
            zIndex: 999,
            maxWidth: "300px",
          }}
        >
          <Text variant="body.medium.bold">{memberName}</Text>
          <div style={{ marginTop: "var(--aegis-space-small)" }}>
            <Text variant="body.small.bold" style={{ color: pld.fill }}>
              {bucketName} (滞留)
            </Text>
            <ul style={{ paddingLeft: "20px", margin: "4px 0 0 0", listStyleType: "disc" }}>
              {details.map((detail: string) => (
                <li key={detail}>
                  <Text variant="body.small">{detail}</Text>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: { name?: string }, filterType: "status" | "caseType", filterValue: string) => {
    if (data?.name) {
      setSelectedTabIndex(0);
      setPaneOpen(true);
      setSelectedMember(data.name);
      setPaneDueDateFilter(activeDueDateFilter);

      if (filterType === "status") {
        setPaneStatusFilter(filterValue);
        setPaneCaseTypeFilter(activeCaseTypeFilter);
        setPersonalCaseTypeFilter(activeCaseTypeFilter);
      } else {
        // filterType === 'caseType'
        setPaneStatusFilter(activeStatusFilter);
        setPaneCaseTypeFilter(filterValue);
        setPersonalCaseTypeFilter(filterValue);
      }
    }
  };

  return (
    <>
      <PageLayout.Content minWidth="medium">
        <PageLayout.Header>
          <ContentHeader>
            <ContentHeader.Title>チーム・メンバー</ContentHeader.Title>
          </ContentHeader>
        </PageLayout.Header>
        <PageLayout.Body>
          <Tab.Group
            size="medium"
            onChange={() => {
              setPaneOpen(false);
              setSelectedMember(null);
              setSelectedTabIndex(0);
              setPaneStatusFilter("すべて");
              setPaneCaseTypeFilter("すべて");
              setPersonalCaseTypeFilter("すべて");
              setPaneDueDateFilter("すべて");
              setPaneContext(null);
            }}
          >
            <Tab.List bordered={false}>
              <Tab>案件</Tab>
              <Tab>パフォーマンス</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                {unassignedCases.length > 0 && (
                  <Card>
                    <CardHeader
                      trailing={
                        <Checkbox
                          checked={showEmptySubAssignee}
                          onChange={(e) => setShowEmptySubAssignee(e.target.checked)}
                        >
                          副担当者が空の案件を表示
                        </Checkbox>
                      }
                    >
                      <ContentHeader.Title>未割り当ての案件</ContentHeader.Title>
                    </CardHeader>
                    <CardBody>
                      <DataTable
                        columns={unassignedCasesColumns}
                        rows={unassignedCases}
                        getRowId={(row) => row.caseName}
                        defaultColumnPinning={{ end: ["assignee", "subAssignee"] }}
                      />
                    </CardBody>
                  </Card>
                )}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--aegis-space-large)",
                  }}
                >
                  <Card style={{ flex: "1 0 100%" }}>
                    <CardHeader>
                      <ContentHeader.Title>チームの案件状況</ContentHeader.Title>
                    </CardHeader>
                    <CardBody>
                      {/* Summary Cards */}
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--aegis-space-medium)",
                          marginTop: "var(--aegis-space-small)", // 8px (approx)
                          marginBottom: "var(--aegis-space-small)", // 8px (approx)
                        }}
                      >
                        <div style={{ display: "contents" }}>
                          <Card
                            variant={activeDueDateFilter === "すべて" ? "fill" : "outline"}
                            size="small"
                            style={{ flex: 1 }}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveDueDateFilter("すべて")}
                              onKeyDown={(e) => e.key === "Enter" && setActiveDueDateFilter("すべて")}
                              style={{
                                cursor: "pointer",
                                height: "100%",
                                width: "100%",
                                border: "none",
                                background: "none",
                                padding: 0,
                                textAlign: "left",
                              }}
                            >
                              <CardHeader>
                                <Text variant="body.small">すべて</Text>
                              </CardHeader>
                              <CardBody>
                                <Text variant="body.large.bold">{dueDateSummary.すべて}件</Text>
                              </CardBody>
                            </button>
                          </Card>
                          <Card
                            variant={activeDueDateFilter === "納期超過" ? "fill" : "outline"}
                            size="small"
                            style={{ flex: 1 }}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveDueDateFilter("納期超過")}
                              onKeyDown={(e) => e.key === "Enter" && setActiveDueDateFilter("納期超過")}
                              style={{
                                cursor: "pointer",
                                height: "100%",
                                width: "100%",
                                border: "none",
                                background: "none",
                                padding: 0,
                                textAlign: "left",
                              }}
                            >
                              <CardHeader>
                                <Text
                                  variant="body.small"
                                  color={activeDueDateFilter !== "納期超過" ? "danger" : undefined}
                                >
                                  納期超過
                                </Text>
                              </CardHeader>
                              <CardBody>
                                <Text
                                  variant="body.large.bold"
                                  color={activeDueDateFilter !== "納期超過" ? "danger" : undefined}
                                >
                                  {dueDateSummary.納期超過}件
                                </Text>
                              </CardBody>
                            </button>
                          </Card>
                          <Card
                            variant={activeDueDateFilter === "今日まで" ? "fill" : "outline"}
                            size="small"
                            style={{ flex: 1 }}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveDueDateFilter("今日まで")}
                              onKeyDown={(e) => e.key === "Enter" && setActiveDueDateFilter("今日まで")}
                              style={{
                                cursor: "pointer",
                                height: "100%",
                                width: "100%",
                                border: "none",
                                background: "none",
                                padding: 0,
                                textAlign: "left",
                              }}
                            >
                              <CardHeader>
                                <Text
                                  variant="body.small"
                                  color={activeDueDateFilter !== "今日まで" ? "warning" : undefined}
                                >
                                  今日まで
                                </Text>
                              </CardHeader>
                              <CardBody>
                                <Text
                                  variant="body.large.bold"
                                  color={activeDueDateFilter !== "今日まで" ? "warning" : undefined}
                                >
                                  {dueDateSummary.今日まで}件
                                </Text>
                              </CardBody>
                            </button>
                          </Card>
                          <Card
                            variant={activeDueDateFilter === "〜3日後" ? "fill" : "outline"}
                            size="small"
                            style={{ flex: 1 }}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveDueDateFilter("〜3日後")}
                              onKeyDown={(e) => e.key === "Enter" && setActiveDueDateFilter("〜3日後")}
                              style={{
                                cursor: "pointer",
                                height: "100%",
                                width: "100%",
                                border: "none",
                                background: "none",
                                padding: 0,
                                textAlign: "left",
                              }}
                            >
                              <CardHeader>
                                <Text variant="body.small">〜3日後</Text>
                              </CardHeader>
                              <CardBody>
                                <Text variant="body.large.bold">{dueDateSummary["〜3日後"]}件</Text>
                              </CardBody>
                            </button>
                          </Card>
                          <Card
                            variant={activeDueDateFilter === "〜1週間後" ? "fill" : "outline"}
                            size="small"
                            style={{ flex: 1 }}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveDueDateFilter("〜1週間後")}
                              onKeyDown={(e) => e.key === "Enter" && setActiveDueDateFilter("〜1週間後")}
                              style={{
                                cursor: "pointer",
                                height: "100%",
                                width: "100%",
                                border: "none",
                                background: "none",
                                padding: 0,
                                textAlign: "left",
                              }}
                            >
                              <CardHeader>
                                <Text variant="body.small">〜1週間後</Text>
                              </CardHeader>
                              <CardBody>
                                <Text variant="body.large.bold">{dueDateSummary["〜1週間後"]}件</Text>
                              </CardBody>
                            </button>
                          </Card>
                          <Card
                            variant={activeDueDateFilter === "1週間後〜" ? "fill" : "outline"}
                            size="small"
                            style={{ flex: 1 }}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveDueDateFilter("1週間後〜")}
                              onKeyDown={(e) => e.key === "Enter" && setActiveDueDateFilter("1週間後〜")}
                              style={{
                                cursor: "pointer",
                                height: "100%",
                                width: "100%",
                                border: "none",
                                background: "none",
                                padding: 0,
                                textAlign: "left",
                              }}
                            >
                              <CardHeader>
                                <Text variant="body.small">1週間後〜</Text>
                              </CardHeader>
                              <CardBody>
                                <Text variant="body.large.bold">{dueDateSummary["1週間後〜"]}件</Text>
                              </CardBody>
                            </button>
                          </Card>
                          <Card
                            variant={activeDueDateFilter === "納期未入力" ? "fill" : "outline"}
                            size="small"
                            style={{ flex: 1 }}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveDueDateFilter("納期未入力")}
                              onKeyDown={(e) => e.key === "Enter" && setActiveDueDateFilter("納期未入力")}
                              style={{
                                cursor: "pointer",
                                height: "100%",
                                width: "100%",
                                border: "none",
                                background: "none",
                                padding: 0,
                                textAlign: "left",
                              }}
                            >
                              <CardHeader>
                                <Text variant="body.small">納期未入力</Text>
                              </CardHeader>
                              <CardBody>
                                <Text variant="body.large.bold">{dueDateSummary.納期未入力}件</Text>
                              </CardBody>
                            </button>
                          </Card>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <SegmentedControl
                          size="small"
                          defaultIndex={["status", "type", "duration"].indexOf(caseStatusView)}
                          onChange={(index) => {
                            const views = ["status", "type", "duration"] as const;
                            setCaseStatusView(views[index]);
                          }}
                        >
                          <SegmentedControl.Button>ステータス別</SegmentedControl.Button>
                          <SegmentedControl.Button>案件タイプ別</SegmentedControl.Button>
                          <SegmentedControl.Button>滞留状況別</SegmentedControl.Button>
                        </SegmentedControl>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                          <ButtonGroup variant="plain" size="small">
                            <Button
                              aria-pressed={isFilterOpen}
                              leading={
                                <Badge
                                  color="information"
                                  invisible={
                                    activeCaseTypeFilter === "すべて" &&
                                    activeStatusFilter === "すべて" &&
                                    assigneeFilterMode === "main"
                                  }
                                >
                                  <Icon>
                                    <LfFilter />
                                  </Icon>
                                </Badge>
                              }
                              onClick={() => setIsFilterOpen(!isFilterOpen)}
                            >
                              フィルター
                            </Button>
                            <Button
                              leading={<Icon>{sortOrder === "asc" ? <LfSort19 /> : <LfSort91 />}</Icon>}
                              onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                            >
                              案件数
                            </Button>
                          </ButtonGroup>
                          <SegmentedControl
                            size="small"
                            index={teamCaseViewMode === "graph" ? 0 : 1}
                            onChange={(index) => setTeamCaseViewMode(index === 0 ? "graph" : "table")}
                          >
                            <SegmentedControl.Button
                              leading={
                                <Icon>
                                  <LfChartBar />
                                </Icon>
                              }
                              aria-label="グラフ表示"
                            />
                            <SegmentedControl.Button
                              leading={
                                <Icon>
                                  <LfTable />
                                </Icon>
                              }
                              aria-label="テーブル表示"
                            />
                          </SegmentedControl>
                        </div>
                      </div>
                      {isFilterOpen && (
                        <Card variant="fill">
                          <CardBody
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--aegis-space-large)",
                              flexWrap: "wrap",
                              flexDirection: "row",
                            }}
                          >
                            <div style={{ width: "160px" }}>
                              <FormControl orientation="vertical">
                                <FormControl.Label>案件タイプ</FormControl.Label>
                                <Select
                                  value={activeCaseTypeFilter}
                                  onChange={(value) => setActiveCaseTypeFilter(value)}
                                  options={[
                                    { label: "すべて", value: "すべて" },
                                    { label: "契約書審査", value: "契約書審査" },
                                    { label: "契約書起案", value: "契約書起案" },
                                    { label: "法務相談", value: "法務相談" },
                                    { label: "その他", value: "その他" },
                                  ]}
                                />
                              </FormControl>
                            </div>
                            <div style={{ width: "160px" }}>
                              <FormControl orientation="vertical">
                                <FormControl.Label>ステータス</FormControl.Label>
                                <Select
                                  value={activeStatusFilter}
                                  onChange={(value) => setActiveStatusFilter(value)}
                                  options={[
                                    { label: "すべて", value: "すべて" },
                                    ...STATUS_ORDER.map((s) => ({ label: s.name, value: s.key })),
                                  ]}
                                />
                              </FormControl>
                            </div>
                            <div style={{ width: "160px" }}>
                              <FormControl orientation="vertical">
                                <FormControl.Label>集計対象</FormControl.Label>
                                <Select
                                  value={assigneeFilterMode}
                                  onChange={(value) => setAssigneeFilterMode(value as AssigneeFilterMode)}
                                  options={[
                                    { label: "主担当案件のみ", value: "main" },
                                    { label: "副担当案件のみ", value: "sub" },
                                    { label: "主担当 + 副担当", value: "both" },
                                  ]}
                                />
                              </FormControl>
                            </div>
                          </CardBody>
                        </Card>
                      )}
                      {teamCaseViewMode === "graph" ? (
                        <div style={{ height: 300 }}>
                          {(caseStatusView === "status" || caseStatusView === "type") && (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={chartData}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, maxCaseCount]} />
                                <YAxis
                                  type="category"
                                  dataKey="name"
                                  tick={(props) => (
                                    <CustomYAxisTick
                                      {...props}
                                      setPaneOpen={setPaneOpen}
                                      setSelectedMember={setSelectedMember}
                                      setSelectedTabIndex={setSelectedTabIndex}
                                      membersWithOverdueCases={membersWithOverdueCases}
                                      activeCaseTypeFilter={activeCaseTypeFilter}
                                      setPaneCaseTypeFilter={setPaneCaseTypeFilter}
                                      setPersonalCaseTypeFilter={setPersonalCaseTypeFilter}
                                      activeDueDateFilter={activeDueDateFilter}
                                      setPaneDueDateFilter={setPaneDueDateFilter}
                                      activeStatusFilter={activeStatusFilter}
                                      setPaneStatusFilter={setPaneStatusFilter}
                                      assigneeFilterMode={assigneeFilterMode}
                                    />
                                  )}
                                  width={140}
                                  interval={0}
                                />
                                <Tooltip content={<CustomTooltip />} shared={false} isAnimationActive={false} />
                                <Legend />
                                {caseStatusView === "status" ? (
                                  <>
                                    {(assigneeFilterMode === "main" || assigneeFilterMode === "both") &&
                                      STATUS_ORDER.map((status) => (
                                        <Bar
                                          key={`${status.key}_main`}
                                          dataKey={`${status.key}_main`}
                                          name={assigneeFilterMode === "both" ? `${status.name} (主)` : status.name}
                                          stackId="main"
                                          fill={status.color}
                                          onClick={(data) => handleBarClick(data, "status", status.key)}
                                        >
                                          <LabelList
                                            dataKey={`${status.key}_main`}
                                            position="center"
                                            style={{ fill: "white", pointerEvents: "none" }}
                                            formatter={(value: unknown) =>
                                              typeof value === "number" && value > 0 ? value : ""
                                            }
                                          />
                                        </Bar>
                                      ))}
                                    {(assigneeFilterMode === "sub" || assigneeFilterMode === "both") &&
                                      STATUS_ORDER.map((status) => (
                                        <Bar
                                          key={`${status.key}_sub`}
                                          dataKey={`${status.key}_sub`}
                                          name={assigneeFilterMode === "both" ? `${status.name} (副)` : status.name}
                                          stackId="sub"
                                          fill={status.color}
                                          opacity={0.6}
                                          onClick={(data) => handleBarClick(data, "status", status.key)}
                                        >
                                          <LabelList
                                            dataKey={`${status.key}_sub`}
                                            position="center"
                                            style={{ fill: "white", pointerEvents: "none" }}
                                            formatter={(value: unknown) =>
                                              typeof value === "number" && value > 0 ? value : ""
                                            }
                                          />
                                        </Bar>
                                      ))}
                                  </>
                                ) : (
                                  <>
                                    {(assigneeFilterMode === "main" || assigneeFilterMode === "both") && (
                                      <>
                                        <Bar
                                          dataKey="契約書審査_main"
                                          name={assigneeFilterMode === "both" ? "契約書審査 (主)" : "契約書審査"}
                                          stackId="main"
                                          fill="#4299e1"
                                          onClick={(data) => handleBarClick(data, "caseType", "契約書審査")}
                                        >
                                          <LabelList
                                            dataKey="契約書審査_main"
                                            position="center"
                                            style={{ fill: "white", pointerEvents: "none" }}
                                            formatter={(value: unknown) =>
                                              typeof value === "number" && value > 0 ? value : ""
                                            }
                                          />
                                        </Bar>
                                        <Bar
                                          dataKey="契約書起案_main"
                                          name={assigneeFilterMode === "both" ? "契約書起案 (主)" : "契約書起案"}
                                          stackId="main"
                                          fill="#9f7aea"
                                          onClick={(data) => handleBarClick(data, "caseType", "契約書起案")}
                                        >
                                          <LabelList
                                            dataKey="契約書起案_main"
                                            position="center"
                                            style={{ fill: "white", pointerEvents: "none" }}
                                            formatter={(value: unknown) =>
                                              typeof value === "number" && value > 0 ? value : ""
                                            }
                                          />
                                        </Bar>
                                        <Bar
                                          dataKey="法務相談_main"
                                          name={assigneeFilterMode === "both" ? "法務相談 (主)" : "法務相談"}
                                          stackId="main"
                                          fill="#ed8636"
                                          onClick={(data) => handleBarClick(data, "caseType", "法務相談")}
                                        >
                                          <LabelList
                                            dataKey="法務相談_main"
                                            position="center"
                                            style={{ fill: "white", pointerEvents: "none" }}
                                            formatter={(value: unknown) =>
                                              typeof value === "number" && value > 0 ? value : ""
                                            }
                                          />
                                        </Bar>
                                        <Bar
                                          dataKey="その他_main"
                                          name={assigneeFilterMode === "both" ? "その他 (主)" : "その他"}
                                          stackId="main"
                                          fill="#a0aec0"
                                          onClick={(data) => handleBarClick(data, "caseType", "その他")}
                                        >
                                          <LabelList
                                            dataKey="その他_main"
                                            position="center"
                                            style={{ fill: "white", pointerEvents: "none" }}
                                            formatter={(value: unknown) =>
                                              typeof value === "number" && value > 0 ? value : ""
                                            }
                                          />
                                        </Bar>
                                      </>
                                    )}
                                    {(assigneeFilterMode === "sub" || assigneeFilterMode === "both") && (
                                      <>
                                        <Bar
                                          dataKey="契約書審査_sub"
                                          name={assigneeFilterMode === "both" ? "契約書審査 (副)" : "契約書審査"}
                                          stackId="sub"
                                          fill="#4299e1"
                                          opacity={0.6}
                                          onClick={(data) => handleBarClick(data, "caseType", "契約書審査")}
                                        >
                                          <LabelList
                                            dataKey="契約書審査_sub"
                                            position="center"
                                            style={{ fill: "white", pointerEvents: "none" }}
                                            formatter={(value: unknown) =>
                                              typeof value === "number" && value > 0 ? value : ""
                                            }
                                          />
                                        </Bar>
                                        <Bar
                                          dataKey="契約書起案_sub"
                                          name={assigneeFilterMode === "both" ? "契約書起案 (副)" : "契約書起案"}
                                          stackId="sub"
                                          fill="#9f7aea"
                                          opacity={0.6}
                                          onClick={(data) => handleBarClick(data, "caseType", "契約書起案")}
                                        >
                                          <LabelList
                                            dataKey="契約書起案_sub"
                                            position="center"
                                            style={{ fill: "white", pointerEvents: "none" }}
                                            formatter={(value: unknown) =>
                                              typeof value === "number" && value > 0 ? value : ""
                                            }
                                          />
                                        </Bar>
                                        <Bar
                                          dataKey="法務相談_sub"
                                          name={assigneeFilterMode === "both" ? "法務相談 (副)" : "法務相談"}
                                          stackId="sub"
                                          fill="#ed8636"
                                          opacity={0.6}
                                          onClick={(data) => handleBarClick(data, "caseType", "法務相談")}
                                        >
                                          <LabelList
                                            dataKey="法務相談_sub"
                                            position="center"
                                            style={{ fill: "white", pointerEvents: "none" }}
                                            formatter={(value: unknown) =>
                                              typeof value === "number" && value > 0 ? value : ""
                                            }
                                          />
                                        </Bar>
                                        <Bar
                                          dataKey="その他_sub"
                                          name={assigneeFilterMode === "both" ? "その他 (副)" : "その他"}
                                          stackId="sub"
                                          fill="#a0aec0"
                                          opacity={0.6}
                                          onClick={(data) => handleBarClick(data, "caseType", "その他")}
                                        >
                                          <LabelList
                                            dataKey="その他_sub"
                                            position="center"
                                            style={{ fill: "white", pointerEvents: "none" }}
                                            formatter={(value: unknown) =>
                                              typeof value === "number" && value > 0 ? value : ""
                                            }
                                          />
                                        </Bar>
                                      </>
                                    )}
                                  </>
                                )}
                              </BarChart>
                            </ResponsiveContainer>
                          )}
                          {caseStatusView === "duration" && (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={caseCountByMemberAndDuration}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, maxCaseCount]} />
                                <YAxis
                                  type="category"
                                  dataKey="name"
                                  tick={(props) => (
                                    <CustomYAxisTick
                                      {...props}
                                      setPaneOpen={setPaneOpen}
                                      setSelectedMember={setSelectedMember}
                                      setSelectedTabIndex={setSelectedTabIndex}
                                      membersWithOverdueCases={membersWithOverdueCases}
                                      activeCaseTypeFilter={activeCaseTypeFilter}
                                      setPaneCaseTypeFilter={setPaneCaseTypeFilter}
                                      setPersonalCaseTypeFilter={setPersonalCaseTypeFilter}
                                      activeDueDateFilter={activeDueDateFilter}
                                      setPaneDueDateFilter={setPaneDueDateFilter}
                                      activeStatusFilter={activeStatusFilter}
                                      setPaneStatusFilter={setPaneStatusFilter}
                                      assigneeFilterMode={assigneeFilterMode}
                                    />
                                  )}
                                  width={140}
                                  interval={0}
                                />
                                <Tooltip content={<CustomDurationTooltip />} shared={false} isAnimationActive={false} />
                                <Legend />
                                {Object.entries(DURATION_BUCKETS).map(([key, value]) => (
                                  <>
                                    {(assigneeFilterMode === "main" || assigneeFilterMode === "both") && (
                                      <Bar
                                        key={`${key}_main`}
                                        dataKey={`${key}_main`}
                                        name={assigneeFilterMode === "both" ? `${key} (主)` : key}
                                        stackId="main"
                                        fill={value.color}
                                      />
                                    )}
                                    {(assigneeFilterMode === "sub" || assigneeFilterMode === "both") && (
                                      <Bar
                                        key={`${key}_sub`}
                                        dataKey={`${key}_sub`}
                                        name={assigneeFilterMode === "both" ? `${key} (副)` : key}
                                        stackId="sub"
                                        fill={value.color}
                                        opacity={0.6}
                                      />
                                    )}
                                  </>
                                ))}
                              </BarChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      ) : (
                        <div style={{ marginTop: "var(--aegis-space-large)" }}>
                          <DataTable
                            columns={teamStatusColumns}
                            rows={caseStatusView === "duration" ? caseCountByMemberAndDuration : chartData}
                          />
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--aegis-space-large)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--aegis-space-large)",
                      alignItems: "flex-end",
                      width: "100%",
                      paddingBottom: "var(--aegis-space-large)",
                    }}
                  >
                    <FormControl>
                      <FormControl.Label>メンバー</FormControl.Label>
                      <TagPicker
                        placeholder="メンバーを選択"
                        options={teamMembers.map((name) => ({ label: name, value: name }))}
                        value={performanceSelectedMembers}
                        onChange={setPerformanceSelectedMembers}
                      />
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>集計期間</FormControl.Label>
                      <RangeDateField
                        key={performanceDateFieldKey}
                        startValue={performanceDateRange.start}
                        endValue={performanceDateRange.end}
                        onStartChange={(date) => setPerformanceDateRange((prev) => ({ ...prev, start: date ?? null }))}
                        onEndChange={(date) => setPerformanceDateRange((prev) => ({ ...prev, end: date ?? null }))}
                      />
                    </FormControl>
                    <Button
                      variant="subtle"
                      onClick={() => {
                        setPerformanceSelectedMembers([]);
                        setPerformanceDateRange({ start: null, end: null });
                        setPerformanceDateFieldKey((prev) => prev + 1);
                      }}
                    >
                      リセット
                    </Button>
                  </div>
                  <Card variant="outline" style={{ flex: "1 0 100%" }}>
                    <CardHeader>
                      <ContentHeader.Title>パフォーマンス分析</ContentHeader.Title>
                    </CardHeader>
                    <CardBody>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "var(--aegis-space-small)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--aegis-space-medium)" }}>
                          <div style={{ paddingBottom: "var(--aegis-space-xsmall)" }}>
                            <Popover placement="bottom-start">
                              <Popover.Anchor>
                                <Button
                                  variant="subtle"
                                  size="small"
                                  leading={
                                    <Icon>
                                      <LfEye />
                                    </Icon>
                                  }
                                >
                                  表示項目
                                </Button>
                              </Popover.Anchor>
                              <Popover.Content width="small">
                                <Popover.Body>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "var(--aegis-space-small)",
                                      minWidth: "200px",
                                    }}
                                  >
                                    <Checkbox
                                      checked={visibleMetrics.新規案件数}
                                      onChange={(e) =>
                                        setVisibleMetrics((prev) => ({
                                          ...prev,
                                          新規案件数: e.target.checked,
                                        }))
                                      }
                                    >
                                      新規案件数
                                    </Checkbox>
                                    <Checkbox
                                      checked={visibleMetrics.完了案件数}
                                      onChange={(e) =>
                                        setVisibleMetrics((prev) => ({
                                          ...prev,
                                          完了案件数: e.target.checked,
                                        }))
                                      }
                                    >
                                      完了案件数
                                    </Checkbox>
                                    <Checkbox
                                      checked={visibleMetrics.リードタイム中央値}
                                      onChange={(e) =>
                                        setVisibleMetrics((prev) => ({
                                          ...prev,
                                          リードタイム中央値: e.target.checked,
                                        }))
                                      }
                                    >
                                      リードタイム(中央値)
                                    </Checkbox>
                                    <Checkbox
                                      checked={visibleMetrics.初回返信速度中央値}
                                      onChange={(e) =>
                                        setVisibleMetrics((prev) => ({
                                          ...prev,
                                          初回返信速度中央値: e.target.checked,
                                        }))
                                      }
                                    >
                                      初回返信速度(中央値)
                                    </Checkbox>
                                  </div>
                                </Popover.Body>
                              </Popover.Content>
                            </Popover>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                          <ButtonGroup variant="plain" size="small">
                            <Button
                              aria-pressed={isPerformanceFilterOpen}
                              leading={
                                <Badge color="information" invisible={!isPerformanceFiltering}>
                                  <Icon>
                                    <LfFilter />
                                  </Icon>
                                </Badge>
                              }
                              onClick={() => setIsPerformanceFilterOpen(!isPerformanceFilterOpen)}
                            >
                              フィルター
                            </Button>
                          </ButtonGroup>
                        </div>
                      </div>
                      {isPerformanceFilterOpen && (
                        <Card variant="fill">
                          <CardBody
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--aegis-space-large)",
                              flexWrap: "wrap",
                              flexDirection: "row",
                            }}
                          >
                            <div style={{ width: "160px" }}>
                              <FormControl orientation="vertical">
                                <FormControl.Label>案件タイプ</FormControl.Label>
                                <Select
                                  value={performanceCaseTypeFilter}
                                  onChange={(value) => setPerformanceCaseTypeFilter(value)}
                                  options={[
                                    { label: "すべて", value: "すべて" },
                                    { label: "契約書審査", value: "契約書審査" },
                                    { label: "契約書起案", value: "契約書起案" },
                                    { label: "法務相談", value: "法務相談" },
                                    { label: "その他", value: "その他" },
                                  ]}
                                />
                              </FormControl>
                            </div>
                          </CardBody>
                        </Card>
                      )}
                      <div style={{ marginTop: "var(--aegis-space-large)" }}>
                        <ResponsiveContainer width="100%" height={300}>
                          <ComposedChart
                            data={overallPerformanceData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 0,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                              yAxisId="left"
                              label={{
                                value: "案件数 (件)",
                                angle: -90,
                                position: "insideLeft",
                              }}
                            />
                            <YAxis
                              yAxisId="right"
                              orientation="right"
                              label={{
                                value: "リードタイム (日)",
                                angle: -90,
                                position: "insideRight",
                              }}
                            />
                            <Tooltip />
                            <Legend />
                            {visibleMetrics.新規案件数 && (
                              <Bar yAxisId="left" dataKey="新規案件数" fill="#8884d8" name="新規案件数" />
                            )}
                            {visibleMetrics.完了案件数 && (
                              <>
                                <Bar
                                  yAxisId="left"
                                  dataKey="onTimeCompletionCount"
                                  fill="#82ca9d"
                                  name="納期内完了"
                                  stackId="completed"
                                />
                                <Bar
                                  yAxisId="left"
                                  dataKey="overdueCompletionCount"
                                  fill="#ffc658"
                                  name="納期超過完了"
                                  stackId="completed"
                                />
                              </>
                            )}
                            {visibleMetrics.リードタイム中央値 && (
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="リードタイム中央値"
                                stroke="#ff7300"
                                name="リードタイム(中央値)"
                              />
                            )}
                            {visibleMetrics.初回返信速度中央値 && (
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="初回返信速度中央値"
                                stroke="#38a169"
                                name="初回返信速度(中央値)"
                              />
                            )}
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </CardBody>
                  </Card>
                  <Card variant="outline" style={{ flex: "1 0 100%" }}>
                    <CardHeader
                      trailing={
                        leadTimeViewMode === "composition" ? (
                          <Button variant="subtle" size="small" onClick={() => setIsStatusSettingsOpen(true)}>
                            ステータス分類設定
                          </Button>
                        ) : null
                      }
                    >
                      <ContentHeader.Title>メンバー別 平均リードタイム構成分析</ContentHeader.Title>
                    </CardHeader>
                    <CardBody>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "var(--aegis-space-large)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--aegis-space-medium)" }}>
                          <div style={{ width: "160px" }}>
                            <FormControl orientation="vertical">
                              <FormControl.Label>案件タイプ</FormControl.Label>
                              <Select
                                aria-label="案件タイプで絞り込み"
                                size="small"
                                value={statusDurationCaseTypeFilter}
                                onChange={setStatusDurationCaseTypeFilter}
                                options={[
                                  { label: "すべての案件タイプ", value: "すべて" },
                                  ...CASE_TYPE_ORDER.map((type) => ({ label: type, value: type })),
                                ]}
                              />
                            </FormControl>
                          </div>
                          <div style={{ width: "160px" }}>
                            <FormControl orientation="vertical">
                              <FormControl.Label>集計対象</FormControl.Label>
                              <Select
                                aria-label="集計対象で絞り込み"
                                size="small"
                                value={leadTimeAssigneeFilterMode}
                                onChange={(val) => setLeadTimeAssigneeFilterMode(val as AssigneeFilterMode)}
                                options={[
                                  { label: "主担当・副担当", value: "both" },
                                  { label: "主担当のみ", value: "main" },
                                  { label: "副担当のみ", value: "sub" },
                                ]}
                              />
                            </FormControl>
                          </div>
                          <SegmentedControl
                            size="small"
                            index={leadTimeViewMode === "composition" ? 0 : 1}
                            onChange={(index) => setLeadTimeViewMode(index === 0 ? "composition" : "performance")}
                          >
                            <SegmentedControl.Button>構成分析</SegmentedControl.Button>
                            <SegmentedControl.Button>案件数・初回返信</SegmentedControl.Button>
                          </SegmentedControl>
                        </div>
                      </div>
                      {leadTimeViewMode === "composition" ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={leadTimeCompositionData} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" unit="日" />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={140}
                              interval={0}
                              tick={(props) => (
                                <CustomYAxisTick
                                  {...props}
                                  setPaneOpen={setPaneOpen}
                                  setSelectedMember={setSelectedMember}
                                  setSelectedTabIndex={setSelectedTabIndex}
                                  membersWithOverdueCases={membersWithOverdueCases}
                                  activeCaseTypeFilter={activeCaseTypeFilter}
                                  setPaneCaseTypeFilter={setPaneCaseTypeFilter}
                                  setPersonalCaseTypeFilter={setPersonalCaseTypeFilter}
                                  activeDueDateFilter={activeDueDateFilter}
                                  setPaneDueDateFilter={setPaneDueDateFilter}
                                  activeStatusFilter={activeStatusFilter}
                                  setPaneStatusFilter={setPaneStatusFilter}
                                  assigneeFilterMode={leadTimeAssigneeFilterMode}
                                />
                              )}
                            />
                            <Tooltip />
                            <Legend />
                            {(leadTimeAssigneeFilterMode === "both" || leadTimeAssigneeFilterMode === "main") && (
                              <>
                                <Bar dataKey="main_idle" name="未着手 (主)" stackId="main" fill="#E2E8F0">
                                  <LabelList
                                    dataKey="main_idle"
                                    position="center"
                                    style={{ fill: "#718096", fontSize: 10 }}
                                    formatter={(value: unknown) =>
                                      typeof value === "number" && value > 0 ? value : ""
                                    }
                                  />
                                </Bar>
                                <Bar dataKey="main_work" name="作業中 (主)" stackId="main" fill="#3182CE">
                                  <LabelList
                                    dataKey="main_work"
                                    position="center"
                                    style={{ fill: "white", fontSize: 10 }}
                                    formatter={(value: unknown) =>
                                      typeof value === "number" && value > 0 ? value : ""
                                    }
                                  />
                                </Bar>
                                <Bar dataKey="main_wait" name="他者待ち (主)" stackId="main" fill="#ED8936">
                                  <LabelList
                                    dataKey="main_wait"
                                    position="center"
                                    style={{ fill: "white", fontSize: 10 }}
                                    formatter={(value: unknown) =>
                                      typeof value === "number" && value > 0 ? value : ""
                                    }
                                  />
                                </Bar>
                              </>
                            )}
                            {(leadTimeAssigneeFilterMode === "both" || leadTimeAssigneeFilterMode === "sub") && (
                              <>
                                <Bar dataKey="sub_work" name="作業中 (副)" stackId="sub" fill="#63B3ED">
                                  <LabelList
                                    dataKey="sub_work"
                                    position="center"
                                    style={{ fill: "white", fontSize: 10 }}
                                    formatter={(value: unknown) =>
                                      typeof value === "number" && value > 0 ? value : ""
                                    }
                                  />
                                </Bar>
                                <Bar dataKey="sub_wait" name="待機中 (副)" stackId="sub" fill="#E2E8F0">
                                  <LabelList
                                    dataKey="sub_wait"
                                    position="center"
                                    style={{ fill: "#718096", fontSize: 10 }}
                                    formatter={(value: unknown) =>
                                      typeof value === "number" && value > 0 ? value : ""
                                    }
                                  />
                                </Bar>
                              </>
                            )}
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <ComposedChart
                            data={memberPerformanceData}
                            layout="vertical"
                            margin={{ left: 20, right: 20, top: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" xAxisId="count" />
                            <XAxis type="number" xAxisId="reply" orientation="top" unit="日" hide />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={140}
                              interval={0}
                              tick={(props) => (
                                <CustomYAxisTick
                                  {...props}
                                  setPaneOpen={setPaneOpen}
                                  setSelectedMember={setSelectedMember}
                                  setSelectedTabIndex={setSelectedTabIndex}
                                  membersWithOverdueCases={membersWithOverdueCases}
                                  activeCaseTypeFilter={activeCaseTypeFilter}
                                  setPaneCaseTypeFilter={setPaneCaseTypeFilter}
                                  setPersonalCaseTypeFilter={setPersonalCaseTypeFilter}
                                  activeDueDateFilter={activeDueDateFilter}
                                  setPaneDueDateFilter={setPaneDueDateFilter}
                                  activeStatusFilter={activeStatusFilter}
                                  setPaneStatusFilter={setPaneStatusFilter}
                                  assigneeFilterMode={leadTimeAssigneeFilterMode}
                                />
                              )}
                            />
                            <Tooltip
                              formatter={(value: unknown, name: unknown) => {
                                const numValue = typeof value === "number" ? value : undefined;
                                const strName = typeof name === "string" ? name : undefined;
                                if (numValue == null || strName == null) return ["", strName ?? ""];
                                if (strName.includes("初回返信速度")) return [`${numValue}日`, strName];
                                return [`${numValue}件`, strName];
                              }}
                            />
                            <Legend />
                            {(leadTimeAssigneeFilterMode === "both" || leadTimeAssigneeFilterMode === "main") && (
                              <Bar xAxisId="count" dataKey="main_count" name="担当案件数" stackId="main" fill="#3182CE">
                                <LabelList
                                  dataKey="main_count"
                                  position="center"
                                  style={{ fill: "white", fontSize: 10 }}
                                  formatter={(value: unknown) => (typeof value === "number" && value > 0 ? value : "")}
                                />
                              </Bar>
                            )}
                            {(leadTimeAssigneeFilterMode === "both" || leadTimeAssigneeFilterMode === "sub") && (
                              <Bar xAxisId="count" dataKey="sub_count" name="副担当案件数" stackId="sub" fill="#63B3ED">
                                <LabelList
                                  dataKey="sub_count"
                                  position="center"
                                  style={{ fill: "white", fontSize: 10 }}
                                  formatter={(value: unknown) => (typeof value === "number" && value > 0 ? value : "")}
                                />
                              </Bar>
                            )}
                            {(leadTimeAssigneeFilterMode === "both" || leadTimeAssigneeFilterMode === "main") && (
                              <Scatter
                                xAxisId="reply"
                                dataKey="medianFirstReplyTime"
                                name="初回返信速度(中央値)"
                                fill="#38a169"
                              />
                            )}
                          </ComposedChart>
                        </ResponsiveContainer>
                      )}
                    </CardBody>
                  </Card>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </PageLayout.Body>
      </PageLayout.Content>
      <PageLayout.Pane position="end" open={paneOpen} resizable>
        <PageLayout.Header>
          <ContentHeader
            size="small"
            trailing={
              <IconButton
                variant="plain"
                size="small"
                aria-label="閉じる"
                onClick={() => {
                  setPaneOpen(false);
                  setSelectedMember(null);
                  setSelectedTabIndex(0);
                  setPaneStatusFilter("すべて");
                  setPaneCaseTypeFilter("すべて");
                  setPersonalCaseTypeFilter("すべて");
                  setPaneDueDateFilter("すべて");
                  setPaneContext(null);
                }}
              >
                <Icon>
                  <LfCloseLarge />
                </Icon>
              </IconButton>
            }
          >
            <ContentHeader.Title>
              {paneContext?.type === "statusDuration"
                ? `${paneContext.member} / ${paneContext.status} の関連案件`
                : selectedMember
                  ? `${selectedMember} の詳細`
                  : "詳細"}
            </ContentHeader.Title>
          </ContentHeader>
        </PageLayout.Header>
        <PageLayout.Body>
          {paneContext?.type === "statusDuration" ? (
            <DataTable columns={caseTableColumns} rows={statusDurationDetailCases} />
          ) : (
            selectedMember && (
              <Tab.Group size="small" defaultIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
                <Tab.List>
                  <Tab>案件</Tab>
                  <Tab>パフォーマンス</Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <Text variant="body.medium.bold">進行中の案件</Text>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--aegis-space-medium)",
                        margin: "var(--aegis-space-medium) 0",
                      }}
                    >
                      <FormControl>
                        <FormControl.Label htmlFor="status-filter">ステータス</FormControl.Label>
                        <Select
                          id="status-filter"
                          value={paneStatusFilter}
                          onChange={(value) => setPaneStatusFilter(value)}
                          options={[
                            { label: "すべて", value: "すべて" },
                            { label: "未着手", value: "未着手" },
                            { label: "確認中", value: "確認中" },
                            { label: "2次確認中", value: "2次確認中" },
                            { label: "自部門外確認中", value: "自部門外確認中" },
                          ]}
                        />
                      </FormControl>
                      <FormControl>
                        <FormControl.Label htmlFor="case-type-filter">案件タイプ</FormControl.Label>
                        <Select
                          id="case-type-filter"
                          value={paneCaseTypeFilter}
                          onChange={(value) => setPaneCaseTypeFilter(value)}
                          options={[
                            { label: "すべて", value: "すべて" },
                            { label: "契約書審査", value: "契約書審査" },
                            { label: "契約書起案", value: "契約書起案" },
                            { label: "法務相談", value: "法務相談" },
                            { label: "その他", value: "その他" },
                          ]}
                        />
                      </FormControl>
                      <FormControl>
                        <FormControl.Label htmlFor="due-date-filter">納期</FormControl.Label>
                        <Select
                          id="due-date-filter"
                          value={paneDueDateFilter}
                          onChange={(value) => setPaneDueDateFilter(value as DueDateFilter)}
                          options={[
                            { label: "すべて", value: "すべて" },
                            { label: "納期超過", value: "納期超過" },
                            { label: "今日まで", value: "今日まで" },
                            { label: "〜3日後", value: "〜3日後" },
                            { label: "〜1週間後", value: "〜1週間後" },
                            { label: "1週間後〜", value: "1週間後〜" },
                            { label: "納期未入力", value: "納期未入力" },
                          ]}
                        />
                      </FormControl>
                    </div>
                    {selectedMemberMainCases.length > 0 && (
                      <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                        <Text
                          variant="body.small.bold"
                          style={{ marginBottom: "var(--aegis-space-small)", display: "block" }}
                        >
                          主担当案件
                        </Text>
                        <DataTable size="small" columns={mainAssignmentTableColumns} rows={selectedMemberMainCases} />
                      </div>
                    )}
                    {selectedMemberSubCases.length > 0 && (
                      <div style={{ marginBottom: "var(--aegis-space-large)" }}>
                        <Text
                          variant="body.small.bold"
                          style={{ marginBottom: "var(--aegis-space-small)", display: "block" }}
                        >
                          副担当案件
                        </Text>
                        <DataTable size="small" columns={subAssignmentTableColumns} rows={selectedMemberSubCases} />
                      </div>
                    )}
                    {selectedMemberMainCases.length === 0 && selectedMemberSubCases.length === 0 && (
                      <Text color="subtle">該当する案件はありません。</Text>
                    )}
                  </Tab.Panel>
                  <Tab.Panel>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
                      <div style={{ maxWidth: "320px" }}>
                        <FormControl orientation="horizontal">
                          <FormControl.Label width="auto">案件タイプ</FormControl.Label>
                          <Select
                            value={personalCaseTypeFilter}
                            onChange={(value) => setPersonalCaseTypeFilter(value)}
                            options={[
                              { label: "すべて", value: "すべて" },
                              { label: "契約書審査", value: "契約書審査" },
                              { label: "契約書起案", value: "契約書起案" },
                              { label: "法務相談", value: "法務相談" },
                              { label: "その他", value: "その他" },
                            ]}
                          />
                        </FormControl>
                      </div>
                      <Card variant="outline">
                        <CardHeader>
                          <ContentHeader.Title>個人のパフォーマンス</ContentHeader.Title>
                        </CardHeader>
                        <CardBody>
                          <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart
                              data={personalPerformanceData[selectedMember]}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis
                                yAxisId="left"
                                label={{
                                  value: "完了案件数 (件)",
                                  angle: -90,
                                  position: "insideLeft",
                                }}
                              />
                              <YAxis
                                yAxisId="right"
                                orientation="right"
                                label={{
                                  value: "リードタイム (日)",
                                  angle: -90,
                                  position: "insideRight",
                                }}
                              />
                              <Tooltip />
                              <Legend />
                              <Bar
                                yAxisId="left"
                                dataKey="onTimeCompletionCount"
                                fill="#82ca9d"
                                name="納期内完了"
                                stackId="completed"
                              />
                              <Bar
                                yAxisId="left"
                                dataKey="overdueCompletionCount"
                                fill="#ffc658"
                                name="納期超過完了"
                                stackId="completed"
                              />
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="リードタイム中央値"
                                stroke="#ff7300"
                                name="リードタイム(中央値)"
                              />
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="初回返信速度中央値"
                                stroke="#38a169"
                                name="初回返信速度(中央値)"
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </CardBody>
                      </Card>
                      <Card variant="outline">
                        <CardHeader
                          trailing={
                            (personalCaseTypeFilter === "すべて" ||
                              personalCaseTypeFilter === "契約書審査" ||
                              personalCaseTypeFilter === "契約書起案") && (
                              <div style={{ display: "flex", gap: "var(--aegis-space-medium)", alignItems: "center" }}>
                                <SegmentedControl
                                  size="small"
                                  defaultIndex={experienceViewIndex}
                                  onChange={setExperienceViewIndex}
                                >
                                  <SegmentedControl.Button>案件別</SegmentedControl.Button>
                                  <SegmentedControl.Button>契約類型別</SegmentedControl.Button>
                                </SegmentedControl>
                              </div>
                            )
                          }
                        >
                          <ContentHeader.Title>担当経験</ContentHeader.Title>
                        </CardHeader>
                        <CardBody>
                          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
                            <div>
                              <Text variant="body.small.bold" style={{ marginBottom: "var(--aegis-space-small)" }}>
                                ■ 主担当としての経験
                              </Text>
                              {personalCaseTypeFilter === "法務相談" || personalCaseTypeFilter === "その他" ? (
                                <DataTable
                                  size="small"
                                  columns={completedCasesColumns}
                                  rows={mainExperienceCompletedCases}
                                />
                              ) : experienceViewIndex === 0 ? (
                                <DataTable
                                  size="small"
                                  columns={caseTypeCountColumns}
                                  rows={mainExperienceCaseTypeCounts}
                                />
                              ) : (
                                <DataTable
                                  size="small"
                                  columns={experienceTableColumns}
                                  rows={mainExperienceContractTypeCounts}
                                />
                              )}
                            </div>
                            {subExperienceCaseTypeCounts.length > 0 && (
                              <div>
                                <Text variant="body.small.bold" style={{ marginBottom: "var(--aegis-space-small)" }}>
                                  ■ 副担当としての経験
                                </Text>
                                {personalCaseTypeFilter === "法務相談" || personalCaseTypeFilter === "その他" ? (
                                  <DataTable
                                    size="small"
                                    columns={completedCasesColumns}
                                    rows={subExperienceCompletedCases}
                                  />
                                ) : experienceViewIndex === 0 ? (
                                  <DataTable
                                    size="small"
                                    columns={caseTypeCountColumns}
                                    rows={subExperienceCaseTypeCounts}
                                  />
                                ) : (
                                  <DataTable
                                    size="small"
                                    columns={experienceTableColumns}
                                    rows={subExperienceContractTypeCounts}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            )
          )}
        </PageLayout.Body>
      </PageLayout.Pane>

      <StatusSettingsDialog
        open={isStatusSettingsOpen}
        onClose={() => setIsStatusSettingsOpen(false)}
        categories={leadTimeCategories}
        onSave={handleSaveCategories}
      />
    </>
  );
}
