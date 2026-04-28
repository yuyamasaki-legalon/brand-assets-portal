import { LfChartBar, LfEye, LfFilter, LfSort19, LfSort91, LfTable } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Badge,
  Button,
  ButtonGroup, // Added import
  Card,
  CardBody,
  CardHeader,
  CardLink,
  Checkbox,
  ContentHeader,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Dialog,
  FormControl,
  Icon,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  Popover,
  RangeDatePicker,
  SegmentedControl,
  Select,
  TagPicker,
  Text,
} from "@legalforce/aegis-react";
import { type ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import type { LegendPayload } from "recharts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  type LabelProps,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AssigneeFilterMode = "main" | "sub" | "both";

// --- Mock Data ---
const STATUS_ORDER = [
  { key: "未着手", name: "未着手", color: "#a0aec0" },
  { key: "確認中", name: "確認中", color: "#4299e1" },
  { key: "2次確認中", name: "2次確認中", color: "#9f7aea" },
  { key: "自部門外確認中", name: "自部門外確認中", color: "#ed8636" },
];

const mockMemberPerformanceData = [
  { name: "メンバーA", main_count: 8, sub_count: 1, medianFirstReplyTime: 0.5 },
  { name: "メンバーB", main_count: 7, sub_count: 1, medianFirstReplyTime: 0.8 },
  { name: "メンバーC", main_count: 8, sub_count: 0, medianFirstReplyTime: 0.4 },
  { name: "メンバーD", main_count: 8, sub_count: 2, medianFirstReplyTime: 1.2 },
  { name: "メンバーE", main_count: 8, sub_count: 1, medianFirstReplyTime: 0.7 },
  { name: "メンバーF", main_count: 4, sub_count: 2, medianFirstReplyTime: 1.2 },
  { name: "メンバーG", main_count: 6, sub_count: 3, medianFirstReplyTime: 0.9 },
  { name: "メンバーH", main_count: 3, sub_count: 1, medianFirstReplyTime: 1.5 },
  { name: "メンバーI", main_count: 7, sub_count: 4, medianFirstReplyTime: 0.6 },
  { name: "メンバーJ", main_count: 5, sub_count: 2, medianFirstReplyTime: 1.1 },
];

const mockLeadTimeCompositionData = [
  { name: "メンバーA", main_idle: 2.1, main_work: 4.5, main_wait: 3.2, sub_work: 2.5, sub_wait: 1.8 },
  { name: "メンバーB", main_idle: 1.8, main_work: 5.2, main_wait: 2.8, sub_work: 3.1, sub_wait: 2.2 },
  { name: "メンバーC", main_idle: 2.5, main_work: 3.8, main_wait: 4.1, sub_work: 0, sub_wait: 0 },
  { name: "メンバーD", main_idle: 3.2, main_work: 6.1, main_wait: 3.5, sub_work: 4.2, sub_wait: 2.5 },
  { name: "メンバーE", main_idle: 2.8, main_work: 4.9, main_wait: 2.9, sub_work: 2.2, sub_wait: 1.5 },
  { name: "メンバーF", main_idle: 2.1, main_work: 4.5, main_wait: 3.2, sub_work: 2.5, sub_wait: 1.8 },
  { name: "メンバーG", main_idle: 1.8, main_work: 5.2, main_wait: 2.8, sub_work: 3.1, sub_wait: 2.2 },
  { name: "メンバーH", main_idle: 2.5, main_work: 3.8, main_wait: 4.1, sub_work: 1.2, sub_wait: 0.5 },
  { name: "メンバーI", main_idle: 3.2, main_work: 6.1, main_wait: 3.5, sub_work: 4.2, sub_wait: 2.5 },
  { name: "メンバーJ", main_idle: 2.8, main_work: 4.9, main_wait: 2.9, sub_work: 2.2, sub_wait: 1.5 },
];

const mockChartData = [
  {
    name: "メンバーA",
    未着手_main: 2,
    確認中_main: 5,
    "2次確認中_main": 1,
    自部門外確認中_main: 0,
    未着手_sub: 1,
    確認中_sub: 0,
    "2次確認中_sub": 0,
    自部門外確認中_sub: 0,
  },
  {
    name: "メンバーB",
    未着手_main: 1,
    確認中_main: 3,
    "2次確認中_main": 2,
    自部門外確認中_main: 1,
    未着手_sub: 0,
    確認中_sub: 1,
    "2次確認中_sub": 0,
    自部門外確認中_sub: 0,
  },
  {
    name: "メンバーC",
    未着手_main: 0,
    確認中_main: 8,
    "2次確認中_main": 0,
    自部門外確認中_main: 0,
    未着手_sub: 0,
    確認中_sub: 0,
    "2次確認中_sub": 0,
    自部門外確認中_sub: 0,
  },
  {
    name: "メンバーD",
    未着手_main: 3,
    確認中_main: 2,
    "2次確認中_main": 1,
    自部門外確認中_main: 2,
    未着手_sub: 1,
    確認中_sub: 1,
    "2次確認中_sub": 0,
    自部門外確認中_sub: 0,
  },
  {
    name: "メンバーE",
    未着手_main: 1,
    確認中_main: 4,
    "2次確認中_main": 3,
    自部門外確認中_main: 0,
    未着手_sub: 0,
    確認中_sub: 0,
    "2次確認中_sub": 1,
    自部門外確認中_sub: 0,
  },
  {
    name: "メンバーF",
    未着手_main: 3,
    確認中_main: 2,
    "2次確認中_main": 1,
    自部門外確認中_main: 1,
    未着手_sub: 0,
    確認中_sub: 1,
    "2次確認中_sub": 0,
    自部門外確認中_sub: 0,
  },
  {
    name: "メンバーG",
    未着手_main: 0,
    確認中_main: 6,
    "2次確認中_main": 2,
    自部門外確認中_main: 0,
    未着手_sub: 1,
    確認中_sub: 0,
    "2次確認中_sub": 0,
    自部門外確認中_sub: 0,
  },
  {
    name: "メンバーH",
    未着手_main: 2,
    確認中_main: 3,
    "2次確認中_main": 0,
    自部門外確認中_main: 2,
    未着手_sub: 0,
    確認中_sub: 0,
    "2次確認中_sub": 1,
    自部門外確認中_sub: 1,
  },
  {
    name: "メンバーI",
    未着手_main: 1,
    確認中_main: 5,
    "2次確認中_main": 1,
    自部門外確認中_main: 0,
    未着手_sub: 2,
    確認中_sub: 0,
    "2次確認中_sub": 0,
    自部門外確認中_sub: 0,
  },
  {
    name: "メンバーJ",
    未着手_main: 4,
    確認中_main: 1,
    "2次確認中_main": 2,
    自部門外確認中_main: 1,
    未着手_sub: 0,
    確認中_sub: 0,
    "2次確認中_sub": 0,
    自部門外確認中_sub: 0,
  },
];

const mockDueDateSummary = {
  すべて: 120,
  納期超過: 5,
  今日まで: 3,
  "〜3日後": 10,
  "〜1週間後": 15,
  "1週間後〜": 80,
  納期未入力: 7,
};

const mockPerformanceData = [
  {
    name: "1月",
    新規案件数: 20,
    onTimeCompletionCount: 18,
    overdueCompletionCount: 2,
    リードタイム中央値: 3.5,
    初回返信速度中央値: 0.5,
  },
  {
    name: "2月",
    新規案件数: 25,
    onTimeCompletionCount: 22,
    overdueCompletionCount: 1,
    リードタイム中央値: 4.0,
    初回返信速度中央値: 0.6,
  },
  {
    name: "3月",
    新規案件数: 30,
    onTimeCompletionCount: 25,
    overdueCompletionCount: 3,
    リードタイム中央値: 3.2,
    初回返信速度中央値: 0.4,
  },
  {
    name: "4月",
    新規案件数: 28,
    onTimeCompletionCount: 26,
    overdueCompletionCount: 0,
    リードタイム中央値: 3.8,
    初回返信速度中央値: 0.5,
  },
  {
    name: "5月",
    新規案件数: 35,
    onTimeCompletionCount: 30,
    overdueCompletionCount: 4,
    リードタイム中央値: 4.2,
    初回返信速度中央値: 0.7,
  },
  {
    name: "6月",
    新規案件数: 22,
    onTimeCompletionCount: 19,
    overdueCompletionCount: 2,
    リードタイム中央値: 3.6,
    初回返信速度中央値: 0.5,
  },
  {
    name: "7月",
    新規案件数: 27,
    onTimeCompletionCount: 24,
    overdueCompletionCount: 1,
    リードタイム中央値: 3.9,
    初回返信速度中央値: 0.6,
  },
  {
    name: "8月",
    新規案件数: 32,
    onTimeCompletionCount: 28,
    overdueCompletionCount: 3,
    リードタイム中央値: 3.4,
    初回返信速度中央値: 0.4,
  },
  {
    name: "9月",
    新規案件数: 29,
    onTimeCompletionCount: 27,
    overdueCompletionCount: 1,
    リードタイム中央値: 3.7,
    初回返信速度中央値: 0.5,
  },
  {
    name: "10月",
    新規案件数: 38,
    onTimeCompletionCount: 32,
    overdueCompletionCount: 5,
    リードタイム中央値: 4.3,
    初回返信速度中央値: 0.7,
  },
  {
    name: "11月",
    新規案件数: 24,
    onTimeCompletionCount: 21,
    overdueCompletionCount: 2,
    リードタイム中央値: 3.8,
    初回返信速度中央値: 0.5,
  },
  {
    name: "12月",
    新規案件数: 42,
    onTimeCompletionCount: 36,
    overdueCompletionCount: 4,
    リードタイム中央値: 4.5,
    初回返信速度中央値: 0.8,
  },
];

const mockContractCategories = ["秘密保持契約", "業務委託契約", "売買契約", "その他"];

const caseTypeColors = {
  契約書審査: "#8884d8",
  契約書起案: "#82ca9d",
  法務相談: "#ffc658",
  その他: "#d0ed57",
};

const categoryColors: Record<string, string> = {
  秘密保持契約: "#8884d8",
  業務委託契約: "#82ca9d",
  売買契約: "#ffc658",
  その他: "#ff8042",
};

const mockDepartmentData = [
  {
    name: "営業部",
    caseCount: { review: 50, drafting: 10, consultation: 20, other: 5 },
    totalCaseCount: 85,
    medianLeadTime: 3.5,
    medianFirstReplyTime: 0.8,
  },
  {
    name: "開発部",
    caseCount: { review: 30, drafting: 20, consultation: 10, other: 2 },
    totalCaseCount: 62,
    medianLeadTime: 4.2,
    medianFirstReplyTime: 1.2,
  },
  {
    name: "マーケティング部",
    caseCount: { review: 40, drafting: 5, consultation: 15, other: 8 },
    totalCaseCount: 68,
    medianLeadTime: 2.8,
    medianFirstReplyTime: 0.5,
  },
  {
    name: "人事部",
    caseCount: { review: 15, drafting: 5, consultation: 30, other: 1 },
    totalCaseCount: 51,
    medianLeadTime: 5.1,
    medianFirstReplyTime: 1.5,
  },
  {
    name: "経理部",
    caseCount: { review: 20, drafting: 2, consultation: 5, other: 10 },
    totalCaseCount: 37,
    medianLeadTime: 3.0,
    medianFirstReplyTime: 0.9,
  },
];

const mockTemplateUsageData = [
  { name: "営業部", totalUsage: 150, 秘密保持契約: 80, 業務委託契約: 40, 売買契約: 20, その他: 10 },
  { name: "開発部", totalUsage: 80, 秘密保持契約: 30, 業務委託契約: 40, 売買契約: 5, その他: 5 },
  { name: "マーケティング部", totalUsage: 120, 秘密保持契約: 50, 業務委託契約: 50, 売買契約: 10, その他: 10 },
  { name: "人事部", totalUsage: 50, 秘密保持契約: 10, 業務委託契約: 20, 売買契約: 5, その他: 15 },
  { name: "経理部", totalUsage: 30, 秘密保持契約: 10, 業務委託契約: 5, 売買契約: 10, その他: 5 },
];

const mockReviewBreakdownData = [
  { name: "営業部", total: 100, 秘密保持契約: 50, 業務委託契約: 30, 売買契約: 15, その他: 5 },
  { name: "開発部", total: 60, 秘密保持契約: 20, 業務委託契約: 30, 売買契約: 5, その他: 5 },
  { name: "マーケティング部", total: 80, 秘密保持契約: 30, 業務委託契約: 40, 売買契約: 5, その他: 5 },
  { name: "人事部", total: 40, 秘密保持契約: 10, 業務委託契約: 15, 売買契約: 5, その他: 10 },
  { name: "経理部", total: 25, 秘密保持契約: 5, 業務委託契約: 5, 売買契約: 10, その他: 5 },
];

// Legal Advice Mock Data
const CASE_TYPE_ORDER = ["契約書審査", "契約書起案", "法務相談", "その他"];
const CASE_TYPE_COLORS: Record<string, string> = {
  契約書審査: "#4299e1",
  契約書起案: "#9f7aea",
  法務相談: "#ed8636",
  その他: "#a0aec0",
};

const mockCaseTypeData = [
  { name: "2023年4月", date: new Date(2023, 3, 1), 契約書審査: 10, 契約書起案: 5, 法務相談: 8, その他: 2 },
  { name: "2023年5月", date: new Date(2023, 4, 1), 契約書審査: 12, 契約書起案: 6, 法務相談: 10, その他: 3 },
  { name: "2023年6月", date: new Date(2023, 5, 1), 契約書審査: 15, 契約書起案: 4, 法務相談: 12, その他: 1 },
  { name: "2023年7月", date: new Date(2023, 6, 1), 契約書審査: 11, 契約書起案: 7, 法務相談: 9, その他: 4 },
  { name: "2023年8月", date: new Date(2023, 7, 1), 契約書審査: 14, 契約書起案: 8, 法務相談: 11, その他: 2 },
  { name: "2023年9月", date: new Date(2023, 8, 1), 契約書審査: 16, 契約書起案: 5, 法務相談: 13, その他: 3 },
].map((d) => ({
  ...d,
  契約書審査_prev: Math.round(d.契約書審査 * 0.9),
  契約書起案_prev: Math.round(d.契約書起案 * 0.8),
  法務相談_prev: Math.round(d.法務相談 * 1.1),
  その他_prev: Math.round(d.その他 * 1.0),
}));

const mockCaseDistributionData = [
  { name: "契約書審査", value: 78 },
  { name: "契約書起案", value: 35 },
  { name: "法務相談", value: 63 },
  { name: "その他", value: 15 },
];

const mockReviewBreakdownData_Legal = [
  { name: "秘密保持契約", count: 160 },
  { name: "業務委託契約", count: 120 },
  { name: "売買契約", count: 40 },
  { name: "その他", count: 35 },
];

// Workstreams Mock Data
const mockContractTypeData = [
  { name: "秘密保持契約", monthlyCaseCount: 120, medianVersionChangeCount: 1.5 },
  { name: "業務委託契約", monthlyCaseCount: 80, medianVersionChangeCount: 3.0 },
  { name: "売買契約", monthlyCaseCount: 60, medianVersionChangeCount: 2.0 },
  { name: "ライセンス契約", monthlyCaseCount: 40, medianVersionChangeCount: 4.5 },
  { name: "共同開発契約", monthlyCaseCount: 20, medianVersionChangeCount: 5.0 },
  { name: "M&A関連契約", monthlyCaseCount: 5, medianVersionChangeCount: 9.0 },
  { name: "コンサルティング契約", monthlyCaseCount: 30, medianVersionChangeCount: 2.5 },
];

const mockFilteredTemplateUsageData_WS = [
  { name: "秘密保持契約", self: 114, other: 6, total: 120, usageRate: 95, date: "2023-11-15" },
  { name: "業務委託契約", self: 64, other: 16, total: 80, usageRate: 80, date: "2023-11-20" },
  { name: "売買契約", self: 51, other: 9, total: 60, usageRate: 85, date: "2023-12-01" },
  { name: "ライセンス契約", self: 24, other: 16, total: 40, usageRate: 60, date: "2023-12-05" },
  { name: "共同開発契約", self: 8, other: 12, total: 20, usageRate: 40, date: "2023-12-10" },
  { name: "M&A関連契約", self: 1, other: 4, total: 5, usageRate: 20, date: "2023-12-15" },
  { name: "コンサルティング契約", self: 22, other: 8, total: 30, usageRate: 73, date: "2023-12-20" },
];

const mockEContractStatusData = [
  { name: "未署名", value: 15 },
  { name: "署名中", value: 45 },
  { name: "署名済み", value: 240 },
];

const mockStorageStatusData = [
  { name: "未保管", value: 25 },
  { name: "保管済み", value: 275 },
];

const eContractStatusColors: Record<string, string> = {
  未署名: "#a0aec0",
  署名中: "#ed8636",
  署名済み: "#4299e1",
};

const storageStatusColors: Record<string, string> = {
  未保管: "#ed8636",
  保管済み: "#4299e1",
};

const mockTemplateDetailsData_WS = [
  { name: "NDA_standard_v3", contractType: "秘密保持契約", usageCount: 80, medianVersionChangeCount: 1.5 },
  { name: "NDA_simple_v1.2", contractType: "秘密保持契約", usageCount: 30, medianVersionChangeCount: 3.0 },
  { name: "SOW_standard_v2", contractType: "業務委託契約", usageCount: 70, medianVersionChangeCount: 3.0 },
];

export default function DesignAdjustments() {
  const [paneOpen, setPaneOpen] = useState(false);

  // Team Case Status State
  const [teamCaseViewMode, setTeamCaseViewMode] = useState<"graph" | "table">("graph");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCaseTypeFilter, setActiveCaseTypeFilter] = useState("すべて");
  const [activeStatusFilter, setActiveStatusFilter] = useState("すべて");
  const [assigneeFilterMode, setAssigneeFilterMode] = useState<AssigneeFilterMode>("main");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [caseStatusView, setCaseStatusView] = useState("status");
  const [activeDueDateFilter, setActiveDueDateFilter] = useState("すべて");

  const isFiltering =
    activeCaseTypeFilter !== "すべて" || activeStatusFilter !== "すべて" || assigneeFilterMode !== "main";

  // Performance Analysis State
  const [performanceViewMode, setPerformanceViewMode] = useState<"graph" | "table">("graph");
  const [performanceCaseTypeFilter, setPerformanceCaseTypeFilter] = useState("すべて");
  const [isPerformanceFilterOpen, setIsPerformanceFilterOpen] = useState(false);
  const [leadTimeViewMode, setLeadTimeViewMode] = useState<"composition" | "performance">("composition");
  const [leadTimeGraphTableViewMode, setLeadTimeGraphTableViewMode] = useState<"graph" | "table">("graph");
  const [isLeadTimeFilterOpen, setIsLeadTimeFilterOpen] = useState(false);
  const [leadTimeAssigneeFilterMode, setLeadTimeAssigneeFilterMode] = useState<AssigneeFilterMode>("both");
  const [statusDurationCaseTypeFilter, setStatusDurationCaseTypeFilter] = useState("すべて");
  const isPerformanceFiltering = performanceCaseTypeFilter !== "すべて";
  const isLeadTimeFiltering = statusDurationCaseTypeFilter !== "すべて" || leadTimeAssigneeFilterMode !== "both";
  const [visibleMetrics, setVisibleMetrics] = useState({
    新規案件数: true,
    完了案件数: true,
    リードタイム中央値: true,
    初回返信速度中央値: true,
  });

  const [leadTimeStatusConfig, setLeadTimeStatusConfig] = useState([
    { key: "main_idle", name: "未着手 (主)", color: "#E2E8F0", visible: true },
    { key: "main_work", name: "作業中 (主)", color: "#3182CE", visible: true },
    { key: "main_wait", name: "他者待ち (主)", color: "#ED8936", visible: true },
    { key: "sub_work", name: "作業中 (副)", color: "#63B3ED", visible: true },
    { key: "sub_wait", name: "待機中 (副)", color: "#E2E8F0", visible: true },
  ]);

  const [isStatusConfigOpen, setIsStatusConfigOpen] = useState(false);

  // Department Analysis State
  const [deptCaseViewMode, setDeptCaseViewMode] = useState<"graph" | "table">("graph");
  const [deptSortOrder, setDeptSortOrder] = useState<"asc" | "desc">("desc");
  const [deptCaseTypeFilter, setDeptCaseTypeFilter] = useState<string>("all");

  const [templateViewMode, setTemplateViewMode] = useState<"graph" | "table">("graph");
  const [templateSortOrder, setTemplateSortOrder] = useState<"asc" | "desc">("desc");
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string[]>([]);

  const [breakdownViewMode, setBreakdownViewMode] = useState<"count" | "percentage">("count");
  const [breakdownDisplayMode, setBreakdownDisplayMode] = useState<"graph" | "table">("graph");

  // Legal Advice State
  const [legalCaseTypeViewMode, setLegalCaseTypeViewMode] = useState<"graph" | "table">("graph");
  const [legalDistributionViewMode, setLegalDistributionViewMode] = useState<"graph" | "table">("graph");
  const [legalBreakdownViewMode, setLegalBreakdownViewMode] = useState<"graph" | "table">("graph");
  const [legalCaseTypeFilter, setLegalCaseTypeFilter] = useState("すべて");
  const [showLegalPreviousYear, setShowLegalPreviousYear] = useState(false);
  const [isLegalCaseFilterOpen, setIsLegalCaseFilterOpen] = useState(false);
  const isLegalCaseFiltering = legalCaseTypeFilter !== "すべて";

  // Workstreams State
  const [workstreamViewMode, setWorkstreamViewMode] = useState<"graph" | "table">("graph");
  const [templateAnalysisMode, setTemplateAnalysisMode] = useState<"byType" | "byTemplate">("byType");
  const [templateAnalysisViewMode, setTemplateAnalysisViewMode] = useState<"graph" | "table">("graph");
  const [workstreamDateRange, setWorkstreamDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [eContractViewMode, setEContractViewMode] = useState<"graph" | "table">("graph");
  const [storageViewMode, setStorageViewMode] = useState<"graph" | "table">("graph");

  // Helper function for mock click
  const mockHandleDepartmentClick = () => {
    console.log("Department clicked");
  };

  const mockHandleChartElementClick = () => {
    console.log("Chart element clicked");
  };

  const mockHandleCategoryClick = () => {
    console.log("Category clicked");
  };

  const mockHandleWorkstreamClick = () => {
    console.log("Workstream clicked");
  };

  // Helper Components
  interface CustomLabelProps extends LabelProps {
    isPercentage?: boolean;
  }

  const CustomLabel = (props: CustomLabelProps) => {
    const { x = 0, y = 0, width = 0, height = 0, value, isPercentage } = props;
    if (value == null || Number(width) <= 20) {
      return null;
    }

    const numericValue = typeof value === "string" ? parseFloat(value) : Number(value);

    if (!Number.isNaN(numericValue) && numericValue > 0) {
      const displayValue = isPercentage ? `${Math.round(numericValue * 100)}%` : value;
      const textStr = String(displayValue);
      const badgeWidth = Math.max(24, textStr.length * 8 + 8);
      const badgeHeight = 18;
      const centerX = Number(x) + Number(width) / 2;
      const centerY = Number(y) + Number(height) / 2;

      return (
        <g>
          <rect
            x={centerX - badgeWidth / 2}
            y={centerY - badgeHeight / 2}
            width={badgeWidth}
            height={badgeHeight}
            fill="#fff"
            rx={2}
          />
          <text
            x={centerX}
            y={centerY}
            fill="var(--aegis-color-font-default)"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fontWeight="bold"
          >
            {displayValue}
          </text>
        </g>
      );
    }
    return null;
  };

  const CustomBarLabel = (props: {
    x?: string | number;
    y?: string | number;
    width?: string | number;
    height?: string | number;
    value?: string | number | boolean | null;
    index?: number;
    fill?: string;
  }) => {
    const { x, y, width, height, value, index } = props;

    if (x == null || y == null || width == null || height == null || value == null || index == null) {
      return null;
    }

    const numX = Number(x);
    const numY = Number(y);
    const numWidth = Number(width);
    const numHeight = Number(height);
    const numValue = Number(value);

    if (numValue <= 0) {
      return null;
    }

    const entry = mockFilteredTemplateUsageData_WS[index];
    if (!entry) return null;
    const percentage = entry.total > 0 ? Math.round((numValue / entry.total) * 100) : 0;
    const labelText = `${numValue}件 (${percentage}%)`;

    if (numWidth < 50) return null;

    const badgeWidth = labelText.length * 7 + 12;
    const badgeHeight = 18;
    const centerX = numX + numWidth / 2;
    const centerY = numY + numHeight / 2;

    return (
      <g>
        <rect
          x={centerX - badgeWidth / 2}
          y={centerY - badgeHeight / 2}
          width={badgeWidth}
          height={badgeHeight}
          fill="#fff"
          rx={2}
        />
        <text
          x={centerX}
          y={centerY}
          fill="var(--aegis-color-font-default)"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="10"
          fontWeight="bold"
        >
          {labelText}
        </text>
      </g>
    );
  };

  const CustomYAxisTick = (props: {
    x?: string | number;
    y?: string | number;
    payload?: { value: string };
    targetTabIndex: number;
    assigneeFilterMode?: AssigneeFilterMode;
  }) => {
    const { x: rawX, y: rawY, payload, assigneeFilterMode } = props;
    const [isHovered, setIsHovered] = useState(false);

    if (rawX === undefined || rawY === undefined || !payload?.value) {
      return null;
    }

    const x = Number(rawX);
    const y = Number(rawY);
    const tickWidth = 120;
    const tickHeight = 40;

    const hasAssignee = !!assigneeFilterMode;
    const offset = hasAssignee ? 4 : -8; // 主・副ありなら +4 (28px隙間), なしなら -8 (8px隙間)
    const slotWidth = hasAssignee ? 20 : 0;
    const slotMargin = hasAssignee ? 12 : 0;

    return (
      <g transform={`translate(${x - tickWidth + offset}, ${y - tickHeight / 2})`}>
        <foreignObject x={0} y={0} width={tickWidth} height={tickHeight}>
          <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={mockHandleDepartmentClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                font: "inherit",
                color: isHovered ? "var(--aegis-color-font-link)" : "var(--aegis-color-font-default)",
                cursor: "pointer",
                flex: 1,
                textAlign: "right",
                lineHeight: "1.2",
                textDecoration: "underline",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "var(--aegis-space-xxSmall)",
                overflow: "hidden",
              }}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {payload.value}
              </span>
            </button>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "10px",
                marginLeft: `${slotMargin}px`,
                width: `${slotWidth}px`,
                color: "var(--aegis-color-font-subtle)",
                height: "100%",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {assigneeFilterMode && (
                <>
                  {(assigneeFilterMode === "main" || assigneeFilterMode === "both") && (
                    <div style={{ flex: 1, display: "flex", alignItems: "center" }}>主</div>
                  )}
                  {(assigneeFilterMode === "sub" || assigneeFilterMode === "both") && (
                    <div style={{ flex: 1, display: "flex", alignItems: "center" }}>副</div>
                  )}
                </>
              )}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  };

  const CustomXAxisTick = (props: {
    x?: string | number;
    y?: string | number;
    payload?: { value: string };
    onClick: (month: string) => void;
  }) => {
    const { x, y, payload, onClick } = props;
    const [isHovered, setIsHovered] = useState(false);

    if (x === undefined || y === undefined || !payload?.value) {
      return null;
    }

    const monthName = payload.value;

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-40} y={5} width={80} height={24}>
          <button
            type="button"
            onClick={() => onClick(monthName)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              font: "inherit",
              color: isHovered ? "var(--aegis-color-font-link)" : "var(--aegis-color-font-default)",
              cursor: "pointer",
              width: "100%",
              textAlign: "center",
              textDecoration: "underline",
            }}
          >
            {monthName.replace(/(\d{4}年)/, "")}
          </button>
        </foreignObject>
      </g>
    );
  };

  const BreakdownChartYAxisTick = (props: {
    x?: string | number;
    y?: string | number;
    payload?: { value: string };
    onClick: (category: string) => void;
  }) => {
    const { x: rawX, y: rawY, payload, onClick } = props;
    const [isHovered, setIsHovered] = useState(false);

    if (rawX === undefined || rawY === undefined || !payload?.value) {
      return null;
    }

    const x = Number(rawX);
    const y = Number(rawY);
    const categoryName = payload.value;
    const tickWidth = 120;
    const tickHeight = 24;
    const offset = -8; // 8pxの余白を確保

    return (
      <g transform={`translate(${x - tickWidth + offset}, ${y - tickHeight / 2})`}>
        <foreignObject x={0} y={0} width={tickWidth} height={tickHeight}>
          <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => onClick(categoryName)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                font: "inherit",
                color: isHovered ? "var(--aegis-color-font-link)" : "var(--aegis-color-font-default)",
                cursor: "pointer",
                flex: 1,
                textAlign: "right",
                textDecoration: "underline",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {categoryName}
            </button>
          </div>
        </foreignObject>
      </g>
    );
  };

  const WorkstreamYAxisTick = (props: { x?: string | number; y?: string | number; payload?: { value: string } }) => {
    const { x: rawX, y: rawY, payload } = props;
    const [isHovered, setIsHovered] = useState(false);

    if (rawX === undefined || rawY === undefined || !payload?.value) {
      return null;
    }

    const x = Number(rawX);
    const y = Number(rawY);
    const tickWidth = 120;
    const tickHeight = 24;
    const offset = -8; // 8pxの余白を確保

    return (
      <g transform={`translate(${x - tickWidth + offset}, ${y - tickHeight / 2})`}>
        <foreignObject x={0} y={0} width={tickWidth} height={tickHeight}>
          <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={mockHandleWorkstreamClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                font: "inherit",
                color: isHovered ? "var(--aegis-color-font-link)" : "var(--aegis-color-font-default)",
                cursor: "pointer",
                flex: 1,
                textAlign: "right",
                textDecoration: "underline",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {payload.value}
            </button>
          </div>
        </foreignObject>
      </g>
    );
  };

  /**
   * 横方向の積み上げ棒グラフ用（layout="vertical"）のカスタム形状
   * セグメントの右端にのみ白線を引くことで、セグメント間の区切りを表現します。
   */
  const HorizontalBarWithDivider = (props: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
    hideDivider?: boolean;
    radius?: number | [number, number, number, number];
  }) => {
    const { x = 0, y = 0, width = 0, height = 0, fill, hideDivider, radius = 0 } = props;
    if (width <= 0) return null;

    const [tl, tr, br, bl] = Array.isArray(radius) ? radius : [radius, radius, radius, radius];
    const path = `M${x},${y + tl}
                 a${tl},${tl} 0 0 1 ${tl},-${tl}
                 h${width - tl - tr}
                 a${tr},${tr} 0 0 1 ${tr},${tr}
                 v${height - tr - br}
                 a${br},${br} 0 0 1 -${br},${br}
                 h-${width - br - bl}
                 a${bl},${bl} 0 0 1 -${bl},-${bl}
                 z`;

    return (
      <g>
        <path d={path} fill={fill} />
        {!hideDivider && <line x1={x + width} y1={y} x2={x + width} y2={y + height} stroke="#fff" strokeWidth={2} />}
      </g>
    );
  };

  /**
   * 縦方向の積み上げ棒グラフ用（layout="horizontal"）のカスタム形状
   * セグメントの上端にのみ白線を引くことで、セグメント間の区切りを表現します。
   */
  const VerticalBarWithDivider = (props: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
    hideDivider?: boolean;
    radius?: number | [number, number, number, number];
  }) => {
    const { x = 0, y = 0, width = 0, height = 0, fill, hideDivider, radius = 0 } = props;
    if (height <= 0) return null;

    const [tl, tr, br, bl] = Array.isArray(radius) ? radius : [radius, radius, radius, radius];
    const path = `M${x},${y + tl}
                 a${tl},${tl} 0 0 1 ${tl},-${tl}
                 h${width - tl - tr}
                 a${tr},${tr} 0 0 1 ${tr},${tr}
                 v${height - tr - br}
                 a${br},${br} 0 0 1 -${br},${br}
                 h-${width - br - bl}
                 a${bl},${bl} 0 0 1 -${bl},-${bl}
                 z`;

    return (
      <g>
        <path d={path} fill={fill} />
        {!hideDivider && <line x1={x} y1={y} x2={x + width} y2={y} stroke="#fff" strokeWidth={2} />}
      </g>
    );
  };

  /**
   * 数字を白い背景（バッジ）で囲い、黒文字で表示するカスタムラベル
   */
  const BadgeLabel = (props: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    value?: number | string;
    isPercentage?: boolean;
  }) => {
    const { x = 0, y = 0, width = 0, height = 0, value, isPercentage } = props;
    if (value == null || value === 0 || value === "0") return null;

    const numericValue = typeof value === "string" ? parseFloat(value) : Number(value);
    if (Number.isNaN(numericValue) || numericValue <= 0) return null;

    const displayValue = isPercentage ? `${Math.round(numericValue * 100)}%` : value;

    // バッジのサイズ設定（文字数に応じて調整）
    const textStr = String(displayValue);
    const badgeWidth = Math.max(24, textStr.length * 8 + 8);
    const badgeHeight = 18;

    const centerX = x + width / 2;
    const centerY = y + height / 2;

    return (
      <g>
        <rect
          x={centerX - badgeWidth / 2}
          y={centerY - badgeHeight / 2}
          width={badgeWidth}
          height={badgeHeight}
          fill="#fff"
          rx={2}
        />
        <text
          x={centerX}
          y={centerY}
          fill="var(--aegis-color-font-default)"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="11"
          fontWeight="bold"
        >
          {displayValue}
        </text>
      </g>
    );
  };

  /**
   * ひし形のドットを表示するコンポーネント（Lineグラフ用）
   */
  const CustomDiamondDot = (props: { cx?: number; cy?: number; stroke?: string; fill?: string }) => {
    const { cx = 0, cy = 0, stroke, fill } = props;
    const size = 5;
    const points = `${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`;
    return <polygon points={points} fill={fill || "#fff"} stroke={stroke} strokeWidth={2} />;
  };

  /**
   * 凡例をカスタムレンダリングする関数
   * ひし形や円、四角形を歪みのない正確な比率で描画します。
   */
  const renderCustomLegend = (props: { payload?: readonly LegendPayload[] }) => {
    const payload = props.payload as Array<{
      value: string;
      color?: string;
      type?: string;
      payload?: { fill?: string; stroke?: string };
    }>;
    if (!payload) return null;

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px",
          paddingTop: "16px",
        }}
      >
        {payload.map((entry) => {
          let icon: ReactNode = null;
          const color = entry.color || entry.payload?.fill || entry.payload?.stroke || "#000";

          if (entry.type === "diamond") {
            // 完璧な比率のひし形 (10x10の正方形を回転)
            icon = (
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                style={{ marginRight: "6px", flexShrink: 0 }}
                aria-hidden="true"
              >
                <title>{entry.value}</title>
                <path d="M 5 0 L 10 5 L 5 10 L 0 5 Z" fill={color} />
              </svg>
            );
          } else if (entry.type === "circle" || entry.type === "line") {
            // 円形 (Lineグラフも凡例はドットスタイルに統一)
            icon = (
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  marginRight: "6px",
                  flexShrink: 0,
                }}
              />
            );
          } else {
            // 四角形 (Barグラフ用)
            icon = (
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "2px",
                  backgroundColor: color,
                  marginRight: "6px",
                  flexShrink: 0,
                }}
              />
            );
          }

          return (
            <div key={`item-${entry.value}`} style={{ display: "flex", alignItems: "center" }}>
              {icon}
              <span style={{ color: "#000", fontSize: "12px" }}>{entry.value}</span>
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * モダンでクリーンなツールチップコンポーネント
   */
  const CustomChartTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number | string;
      unit?: string;
      color?: string;
      fill?: string;
      dataKey?: string;
    }>;
  }) => {
    if (active && payload && payload.length) {
      // 同じ名前の指標が重複して表示されないようにフィルタリング（白縁用ラインの除外）
      const filteredPayload = payload.filter(
        (entry, index, self) => index === self.findIndex((t) => t.name === entry.name),
      );

      return (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            minWidth: "140px",
          }}
        >
          {filteredPayload.map((entry) => (
            <div
              key={entry.dataKey || entry.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: entry.color || entry.fill,
                  }}
                />
                <span style={{ fontSize: "12px", color: "#64748b" }}>{entry.name}</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "#1e293b" }}>
                {entry.value}
                {entry.unit || ""}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Columns for Table Views
  const teamStatusColumns: DataTableColumnDef<(typeof mockChartData)[0], string | number>[] = [
    { id: "name", name: "メンバー", getValue: (row) => row.name },
    ...(caseStatusView === "status"
      ? STATUS_ORDER.flatMap((s) => [
          {
            id: `${s.key}_main`,
            name: `${s.name}(主)`,
            getValue: (row: Record<string, number | string>) => row[`${s.key}_main`] || 0,
          },
          {
            id: `${s.key}_sub`,
            name: `${s.name}(副)`,
            getValue: (row: Record<string, number | string>) => row[`${s.key}_sub`] || 0,
          },
        ])
      : CASE_TYPE_ORDER.flatMap((t) => [
          {
            id: `${t}_main`,
            name: `${t}(主)`,
            getValue: (row: Record<string, number | string>) => row[`${t}_main`] || 0,
          },
          {
            id: `${t}_sub`,
            name: `${t}(副)`,
            getValue: (row: Record<string, number | string>) => row[`${t}_sub`] || 0,
          },
        ])),
  ];

  const leadTimeCompositionColumns: DataTableColumnDef<(typeof mockLeadTimeCompositionData)[0], string | number>[] = [
    { id: "name", name: "メンバー", getValue: (row) => row.name },
    { id: "main_idle", name: "未着手(主) [日]", getValue: (row) => row.main_idle },
    { id: "main_work", name: "作業中(主) [日]", getValue: (row) => row.main_work },
    { id: "main_wait", name: "他者待ち(主) [日]", getValue: (row) => row.main_wait },
    { id: "sub_work", name: "作業中(副) [日]", getValue: (row) => row.sub_work },
    { id: "sub_wait", name: "待機中(副) [日]", getValue: (row) => row.sub_wait },
  ];

  const leadTimePerformanceColumns: DataTableColumnDef<(typeof mockMemberPerformanceData)[0], string | number>[] = [
    { id: "name", name: "メンバー", getValue: (row) => row.name },
    { id: "main_count", name: "担当案件数", getValue: (row) => row.main_count },
    { id: "sub_count", name: "副担当案件数", getValue: (row) => row.sub_count },
    { id: "replyTime", name: "初回返信速度(中央値) [日]", getValue: (row) => row.medianFirstReplyTime },
  ];

  const performanceColumns: DataTableColumnDef<(typeof mockPerformanceData)[0], string | number>[] = [
    { id: "name", name: "月", getValue: (row) => row.name },
    { id: "newCases", name: "新規案件数", getValue: (row) => row.新規案件数 },
    { id: "completed", name: "完了案件数(納期内)", getValue: (row) => row.onTimeCompletionCount },
    { id: "overdue", name: "完了案件数(納期超過)", getValue: (row) => row.overdueCompletionCount },
    { id: "leadTime", name: "リードタイム(中央値)", getValue: (row) => row.リードタイム中央値 },
    { id: "replyTime", name: "初回返信速度(中央値)", getValue: (row) => row.初回返信速度中央値 },
  ];

  const deptColumns: DataTableColumnDef<(typeof mockDepartmentData)[0], string | number>[] = [
    { id: "name", name: "部署名", getValue: (row) => row.name },
    {
      id: "actions",
      name: "",
      renderCell: (_info) => (
        <DataTableCell>
          <Button size="small" variant="subtle" onClick={mockHandleDepartmentClick}>
            開く
          </Button>
        </DataTableCell>
      ),
    },
    { id: "totalCaseCount", name: "総案件数", getValue: (row) => row.totalCaseCount },
    {
      id: "caseCount",
      name: "案件タイプ別内訳",
      getValue: (row) =>
        `審査:${row.caseCount.review}, 起案:${row.caseCount.drafting}, 相談:${row.caseCount.consultation}, 他:${row.caseCount.other}`,
    },
    { id: "medianLeadTime", name: "リードタイム(中央値)", getValue: (row) => row.medianLeadTime },
    { id: "medianFirstReplyTime", name: "初回返信速度(中央値)", getValue: (row) => row.medianFirstReplyTime },
  ];

  const templateColumns: DataTableColumnDef<(typeof mockTemplateUsageData)[0], string | number>[] = [
    { id: "name", name: "部署名", getValue: (row) => row.name },
    {
      id: "actions",
      name: "",
      renderCell: (_info) => (
        <DataTableCell>
          <Button size="small" variant="subtle" onClick={mockHandleDepartmentClick}>
            開く
          </Button>
        </DataTableCell>
      ),
    },
    { id: "totalUsage", name: "総利用回数", getValue: (row) => row.totalUsage },
    { id: "top5", name: "利用ひな形Top5", getValue: () => "NDA_standard_v3, ..." },
  ];

  const breakdownColumns: DataTableColumnDef<(typeof mockReviewBreakdownData)[0], string | number>[] = [
    { id: "name", name: "部署名", getValue: (row) => row.name },
    {
      id: "actions",
      name: "",
      renderCell: (_info) => (
        <DataTableCell>
          <Button size="small" variant="subtle" onClick={mockHandleDepartmentClick}>
            開く
          </Button>
        </DataTableCell>
      ),
    },
    { id: "total", name: "総件数", getValue: (row) => row.total },
    {
      id: "breakdown",
      name: "内訳 (Top 3)",
      getValue: (row) => `秘密保持:${row.秘密保持契約}, 業務委託:${row.業務委託契約}, 売買:${row.売買契約}`,
    },
  ];

  const legalCaseTypeColumns: DataTableColumnDef<(typeof mockCaseTypeData)[0], string | number | Date>[] = [
    { id: "name", name: "月", getValue: (row) => row.name },
    ...CASE_TYPE_ORDER.map((t) => ({
      id: t,
      name: t,
      getValue: (row: Record<string, number | string | Date>) => row[t],
    })),
  ];

  const legalDistributionColumns: DataTableColumnDef<(typeof mockCaseDistributionData)[0], string | number>[] = [
    { id: "name", name: "案件タイプ", getValue: (row) => row.name },
    { id: "value", name: "件数", getValue: (row) => row.value },
  ];

  const legalBreakdownColumns: DataTableColumnDef<(typeof mockReviewBreakdownData_Legal)[0], string | number>[] = [
    { id: "name", name: "契約類型", getValue: (row) => row.name },
    { id: "count", name: "件数", getValue: (row) => row.count },
  ];

  const eContractColumns: DataTableColumnDef<(typeof mockEContractStatusData)[0], string | number>[] = [
    { id: "name", name: "ステータス", getValue: (row) => row.name },
    { id: "value", name: "件数", getValue: (row) => row.value },
  ];

  const storageColumns: DataTableColumnDef<(typeof mockStorageStatusData)[0], string | number>[] = [
    { id: "name", name: "ステータス", getValue: (row) => row.name },
    { id: "value", name: "件数", getValue: (row) => row.value },
  ];

  // Workstream Columns
  const contractTypeColumns: DataTableColumnDef<(typeof mockContractTypeData)[0], string | number>[] = [
    { id: "name", name: "契約類型名", getValue: (row) => row.name },
    {
      id: "actions",
      name: "",
      renderCell: (_info) => (
        <DataTableCell>
          <Button size="small" variant="subtle" onClick={mockHandleWorkstreamClick}>
            開く
          </Button>
        </DataTableCell>
      ),
    },
    { id: "monthlyCaseCount", name: "総件数", getValue: (row) => row.monthlyCaseCount },
    {
      id: "medianVersionChangeCount",
      name: "バージョン変更回数(中央値)",
      getValue: (row) => row.medianVersionChangeCount,
    },
  ];

  const templateUsageColumns_WS: DataTableColumnDef<(typeof mockFilteredTemplateUsageData_WS)[0], string | number>[] = [
    { id: "name", name: "契約類型名", getValue: (row) => row.name },
    {
      id: "actions",
      name: "",
      renderCell: (_info) => (
        <DataTableCell>
          <Button size="small" variant="subtle" onClick={mockHandleWorkstreamClick}>
            開く
          </Button>
        </DataTableCell>
      ),
    },
    { id: "selfUsage", name: "自社ひな形件数", getValue: (row) => row.self },
    { id: "totalCases", name: "合計件数", getValue: (row) => row.total },
    { id: "usageRate", name: "ひな形利用率 (%)", getValue: (row) => row.usageRate },
  ];

  const templateDetailColumns_WS: DataTableColumnDef<(typeof mockTemplateDetailsData_WS)[0], string | number>[] = [
    { id: "name", name: "ひな形名", getValue: (row) => row.name },
    { id: "contractType", name: "契約類型", getValue: (row) => row.contractType },
    { id: "usageCount", name: "利用件数", getValue: (row) => row.usageCount },
    {
      id: "medianVersionChangeCount",
      name: "バージョン変更回数(中央値)",
      getValue: (row) => row.medianVersionChangeCount,
    },
  ];

  const renderViewSwitch = (current: "graph" | "table", onChange: (mode: "graph" | "table") => void) => (
    <SegmentedControl
      size="small"
      index={current === "graph" ? 0 : 1}
      onChange={(index) => onChange(index === 0 ? "graph" : "table")}
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
  );

  return (
    <PageLayoutContent minWidth="medium">
      <PageLayoutHeader>
        <ContentHeader
          trailing={
            <Button
              leading={
                <Icon>
                  <LfFilter />
                </Icon>
              }
              size="medium"
              onClick={() => setPaneOpen(!paneOpen)}
            >
              開く
            </Button>
          }
        >
          <ContentHeader.Title>デザイン調整</ContentHeader.Title>
        </ContentHeader>
      </PageLayoutHeader>
      <PageLayoutBody>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--aegis-space-large)",
          }}
        >
          {/* --- Team Case Status Card (Mock) --- */}
          <Card style={{ flex: "1 0 100%" }}>
            <CardHeader>
              <ContentHeader.Title>チームの案件状況 (Mock)</ContentHeader.Title>
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
                <Card variant={activeDueDateFilter === "すべて" ? "fill" : "outline"} size="small" style={{ flex: 1 }}>
                  <CardHeader>
                    <CardLink asChild>
                      <button
                        type="button"
                        onClick={() => setActiveDueDateFilter("すべて")}
                        style={{ all: "unset", cursor: "pointer", textAlign: "left", width: "100%" }}
                      >
                        <Text variant="body.small">すべて</Text>
                      </button>
                    </CardLink>
                  </CardHeader>
                  <CardBody>
                    <Text variant="body.large.bold">{mockDueDateSummary.すべて}件</Text>
                  </CardBody>
                </Card>
                <Card
                  variant={activeDueDateFilter === "納期超過" ? "fill" : "outline"}
                  size="small"
                  style={{ flex: 1 }}
                >
                  <CardHeader>
                    <CardLink asChild>
                      <button
                        type="button"
                        onClick={() => setActiveDueDateFilter("納期超過")}
                        style={{ all: "unset", cursor: "pointer", textAlign: "left", width: "100%" }}
                      >
                        <Text variant="body.small" color={activeDueDateFilter !== "納期超過" ? "danger" : undefined}>
                          納期超過
                        </Text>
                      </button>
                    </CardLink>
                  </CardHeader>
                  <CardBody>
                    <Text variant="body.large.bold" color={activeDueDateFilter !== "納期超過" ? "danger" : undefined}>
                      {mockDueDateSummary.納期超過}件
                    </Text>
                  </CardBody>
                </Card>
                <Card
                  variant={activeDueDateFilter === "今日まで" ? "fill" : "outline"}
                  size="small"
                  style={{ flex: 1 }}
                >
                  <CardHeader>
                    <CardLink asChild>
                      <button
                        type="button"
                        onClick={() => setActiveDueDateFilter("今日まで")}
                        style={{ all: "unset", cursor: "pointer", textAlign: "left", width: "100%" }}
                      >
                        <Text variant="body.small" color={activeDueDateFilter !== "今日まで" ? "warning" : undefined}>
                          今日まで
                        </Text>
                      </button>
                    </CardLink>
                  </CardHeader>
                  <CardBody>
                    <Text variant="body.large.bold" color={activeDueDateFilter !== "今日まで" ? "warning" : undefined}>
                      {mockDueDateSummary.今日まで}件
                    </Text>
                  </CardBody>
                </Card>
                <Card variant={activeDueDateFilter === "〜3日後" ? "fill" : "outline"} size="small" style={{ flex: 1 }}>
                  <CardHeader>
                    <CardLink asChild>
                      <button
                        type="button"
                        onClick={() => setActiveDueDateFilter("〜3日後")}
                        style={{ all: "unset", cursor: "pointer", textAlign: "left", width: "100%" }}
                      >
                        <Text variant="body.small">〜3日後</Text>
                      </button>
                    </CardLink>
                  </CardHeader>
                  <CardBody>
                    <Text variant="body.large.bold">{mockDueDateSummary["〜3日後"]}件</Text>
                  </CardBody>
                </Card>
                <Card
                  variant={activeDueDateFilter === "〜1週間後" ? "fill" : "outline"}
                  size="small"
                  style={{ flex: 1 }}
                >
                  <CardHeader>
                    <CardLink asChild>
                      <button
                        type="button"
                        onClick={() => setActiveDueDateFilter("〜1週間後")}
                        style={{ all: "unset", cursor: "pointer", textAlign: "left", width: "100%" }}
                      >
                        <Text variant="body.small">〜1週間後</Text>
                      </button>
                    </CardLink>
                  </CardHeader>
                  <CardBody>
                    <Text variant="body.large.bold">{mockDueDateSummary["〜1週間後"]}件</Text>
                  </CardBody>
                </Card>
                <Card
                  variant={activeDueDateFilter === "1週間後〜" ? "fill" : "outline"}
                  size="small"
                  style={{ flex: 1 }}
                >
                  <CardHeader>
                    <CardLink asChild>
                      <button
                        type="button"
                        onClick={() => setActiveDueDateFilter("1週間後〜")}
                        style={{ all: "unset", cursor: "pointer", textAlign: "left", width: "100%" }}
                      >
                        <Text variant="body.small">1週間後〜</Text>
                      </button>
                    </CardLink>
                  </CardHeader>
                  <CardBody>
                    <Text variant="body.large.bold">{mockDueDateSummary["1週間後〜"]}件</Text>
                  </CardBody>
                </Card>
                <Card
                  variant={activeDueDateFilter === "納期未入力" ? "fill" : "outline"}
                  size="small"
                  style={{ flex: 1 }}
                >
                  <CardHeader>
                    <CardLink asChild>
                      <button
                        type="button"
                        onClick={() => setActiveDueDateFilter("納期未入力")}
                        style={{ all: "unset", cursor: "pointer", textAlign: "left", width: "100%" }}
                      >
                        <Text variant="body.small">納期未入力</Text>
                      </button>
                    </CardLink>
                  </CardHeader>
                  <CardBody>
                    <Text variant="body.large.bold">{mockDueDateSummary.納期未入力}件</Text>
                  </CardBody>
                </Card>
              </div>
              <div
                style={{
                  // marginBottom: "var(--aegis-space-medium)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <SegmentedControl
                  size="small"
                  defaultIndex={0}
                  onChange={(index) => {
                    const views = ["status", "type", "duration"];
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
                        <Badge color="information" invisible={!isFiltering}>
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
                  {renderViewSwitch(teamCaseViewMode, setTeamCaseViewMode)}
                </div>
              </div>
              {isFilterOpen && (
                <Card
                  variant="fill"
                  style={
                    {
                      // marginTop: "var(--aegis-space-medium)", // Removed
                      // marginBottom: "var(--aegis-space-large)", // Removed
                    }
                  }
                >
                  <CardBody
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--aegis-space-large)",
                      flexWrap: "wrap",
                      flexDirection: "row", // Ensure horizontal layout
                    }}
                  >
                    <div style={{ width: "160px" }}>
                      <FormControl orientation="vertical">
                        {" "}
                        {/* Ensure vertical label inside input group */}
                        <FormControl.Label>案件タイプ</FormControl.Label>
                        <Select
                          value={activeCaseTypeFilter}
                          onChange={setActiveCaseTypeFilter}
                          options={[
                            { label: "すべて", value: "すべて" },
                            { label: "契約書審査", value: "契約書審査" },
                            // ... others
                          ]}
                        />
                      </FormControl>
                    </div>
                    <div style={{ width: "160px" }}>
                      <FormControl orientation="vertical">
                        <FormControl.Label>ステータス</FormControl.Label>
                        <Select
                          value={activeStatusFilter}
                          onChange={setActiveStatusFilter}
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
                          onChange={(val) => setAssigneeFilterMode(val as AssigneeFilterMode)}
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
                /* Chart */
                <div
                  style={{
                    height: Math.max(400, mockChartData.length * (assigneeFilterMode === "both" ? 64 : 48)), // モードに応じて高さを調整
                    maxHeight: "640px", // カード内での最大高さを制限（500pxから拡大）
                    overflowY: "auto", // はみ出す場合はスクロール
                    paddingRight: "var(--aegis-space-small)", // スクロールバー用の余白
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockChartData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      accessibilityLayer
                      barCategoryGap="15%"
                    >
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        tick={{ fill: "#000", fontSize: 12 }}
                        tickFormatter={(v) => `${v}件`}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={0}
                        tick={(props) => (
                          <CustomYAxisTick {...props} targetTabIndex={0} assigneeFilterMode={assigneeFilterMode} />
                        )}
                      />
                      <Tooltip
                        content={<CustomChartTooltip />}
                        cursor={{ fill: "#f1f5f9" }}
                        wrapperStyle={{ outline: "none" }}
                      />
                      <Legend content={renderCustomLegend} />
                      {assigneeFilterMode === "main" || assigneeFilterMode === "both"
                        ? STATUS_ORDER.map((status) => (
                            <Bar
                              key={`${status.key}_main`}
                              dataKey={`${status.key}_main`}
                              name={`${status.name} (主)`}
                              stackId="main"
                              fill={status.color}
                              shape={(props: unknown) => {
                                const p = props as {
                                  x?: number;
                                  y?: number;
                                  width?: number;
                                  height?: number;
                                  fill?: string;
                                  payload: Record<string, number>;
                                  dataKey: string;
                                };
                                const { payload, dataKey } = p;
                                const currentIndex = STATUS_ORDER.findIndex((s) => `${s.key}_main` === dataKey);
                                const hasValueAfter = STATUS_ORDER.slice(currentIndex + 1).some(
                                  (s) => (payload[`${s.key}_main`] || 0) > 0,
                                );
                                const hasValueBefore = STATUS_ORDER.slice(0, currentIndex).some(
                                  (s) => (payload[`${s.key}_main`] || 0) > 0,
                                );
                                return (
                                  <HorizontalBarWithDivider
                                    {...p}
                                    hideDivider={!hasValueAfter}
                                    radius={[
                                      !hasValueBefore ? 4 : 0,
                                      !hasValueAfter ? 4 : 0,
                                      !hasValueAfter ? 4 : 0,
                                      !hasValueBefore ? 4 : 0,
                                    ]}
                                  />
                                );
                              }}
                            >
                              <LabelList dataKey={`${status.key}_main`} content={<BadgeLabel />} />
                            </Bar>
                          ))
                        : null}
                      {assigneeFilterMode === "sub" || assigneeFilterMode === "both"
                        ? STATUS_ORDER.map((status) => (
                            <Bar
                              key={`${status.key}_sub`}
                              dataKey={`${status.key}_sub`}
                              name={`${status.name} (副)`}
                              stackId="sub"
                              fill={status.color}
                              opacity={0.6}
                              shape={(props: unknown) => {
                                const p = props as {
                                  x?: number;
                                  y?: number;
                                  width?: number;
                                  height?: number;
                                  fill?: string;
                                  payload: Record<string, number>;
                                  dataKey: string;
                                };
                                const { payload, dataKey } = p;
                                const currentIndex = STATUS_ORDER.findIndex((s) => `${s.key}_sub` === dataKey);
                                const hasValueAfter = STATUS_ORDER.slice(currentIndex + 1).some(
                                  (s) => (payload[`${s.key}_sub`] || 0) > 0,
                                );
                                const hasValueBefore = STATUS_ORDER.slice(0, currentIndex).some(
                                  (s) => (payload[`${s.key}_sub`] || 0) > 0,
                                );
                                return (
                                  <HorizontalBarWithDivider
                                    {...p}
                                    hideDivider={!hasValueAfter}
                                    radius={[
                                      !hasValueBefore ? 4 : 0,
                                      !hasValueAfter ? 4 : 0,
                                      !hasValueAfter ? 4 : 0,
                                      !hasValueBefore ? 4 : 0,
                                    ]}
                                  />
                                );
                              }}
                            >
                              <LabelList dataKey={`${status.key}_sub`} content={<BadgeLabel />} />
                            </Bar>
                          ))
                        : null}
                      <CartesianGrid horizontal={false} vertical={true} stroke="#e2e8f0" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  <DataTable columns={teamStatusColumns} rows={mockChartData} />
                </div>
              )}
            </CardBody>
          </Card>

          {/* --- Performance Analysis Card (Mock) --- */}
          <Card variant="outline" style={{ flex: "1 0 100%" }}>
            <CardHeader>
              <ContentHeader.Title>パフォーマンス分析 (Mock)</ContentHeader.Title>
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
                {/* Left: Metrics Toggles */}
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

                {/* Right: Actions */}
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
                  {renderViewSwitch(performanceViewMode, setPerformanceViewMode)}
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
                          size="small"
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

              {performanceViewMode === "graph" ? (
                <div style={{ marginTop: "var(--aegis-space-medium)" }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      accessibilityLayer
                      data={mockPerformanceData}
                      margin={{
                        top: 20,
                        right: 20,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <XAxis
                        allowDecimals={false}
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        tick={{ fill: "#000", fontSize: 12 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        width={60}
                        tick={{ fill: "#000", fontSize: 12 }}
                        tickFormatter={(value) => `${value}件`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        width={60}
                        tick={{ fill: "#000", fontSize: 12 }}
                        tickFormatter={(value) => `${value}日`}
                      />
                      <Tooltip
                        content={<CustomChartTooltip />}
                        cursor={{ fill: "#f1f5f9" }}
                        wrapperStyle={{ outline: "none" }}
                      />
                      <Legend content={renderCustomLegend} />
                      {visibleMetrics.新規案件数 && (
                        <Bar dataKey="新規案件数" fill="#8884d8" name="新規案件数" radius={[4, 4, 4, 4]}>
                          <LabelList dataKey="新規案件数" content={<BadgeLabel />} />
                        </Bar>
                      )}
                      {visibleMetrics.完了案件数 && (
                        <>
                          <Bar
                            dataKey="onTimeCompletionCount"
                            fill="#82ca9d"
                            name="納期内完了"
                            stackId="completed"
                            shape={(props: unknown) => {
                              const p = props as {
                                x?: number;
                                y?: number;
                                width?: number;
                                height?: number;
                                fill?: string;
                                payload: Record<string, number>;
                              };
                              const hasValueAfter = (p.payload.overdueCompletionCount || 0) > 0;
                              return (
                                <VerticalBarWithDivider
                                  {...p}
                                  hideDivider={!hasValueAfter}
                                  radius={[hasValueAfter ? 0 : 4, hasValueAfter ? 0 : 4, 4, 4]}
                                />
                              );
                            }}
                          >
                            <LabelList dataKey="onTimeCompletionCount" content={<BadgeLabel />} />
                          </Bar>
                          <Bar
                            dataKey="overdueCompletionCount"
                            fill="#ffc658"
                            name="納期超過完了"
                            stackId="completed"
                            shape={(props: unknown) => {
                              const p = props as {
                                x?: number;
                                y?: number;
                                width?: number;
                                height?: number;
                                fill?: string;
                                payload: Record<string, number>;
                              };
                              const hasValueBefore = (p.payload.onTimeCompletionCount || 0) > 0;
                              return (
                                <VerticalBarWithDivider
                                  {...p}
                                  hideDivider={true}
                                  radius={[4, 4, hasValueBefore ? 0 : 4, hasValueBefore ? 0 : 4]}
                                />
                              );
                            }}
                          >
                            <LabelList dataKey="overdueCompletionCount" content={<BadgeLabel />} />
                          </Bar>
                        </>
                      )}
                      {visibleMetrics.リードタイム中央値 && (
                        <>
                          <Line
                            yAxisId="right"
                            type="linear"
                            dataKey="リードタイム中央値"
                            stroke="#fff"
                            strokeWidth={4}
                            dot={false}
                            activeDot={false}
                            legendType="none"
                          />
                          <Line
                            yAxisId="right"
                            type="linear"
                            dataKey="リードタイム中央値"
                            stroke="#ff7300"
                            strokeWidth={2}
                            dot={<CustomDiamondDot stroke="#ff7300" />}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            name="リードタイム(中央値)"
                            legendType="diamond"
                          />
                        </>
                      )}
                      {visibleMetrics.初回返信速度中央値 && (
                        <>
                          <Line
                            yAxisId="right"
                            type="linear"
                            dataKey="初回返信速度中央値"
                            stroke="#fff"
                            strokeWidth={4}
                            dot={false}
                            activeDot={false}
                            legendType="none"
                          />
                          <Line
                            yAxisId="right"
                            type="linear"
                            dataKey="初回返信速度中央値"
                            stroke="#38a169"
                            strokeWidth={2}
                            dot={{ stroke: "#38a169", strokeWidth: 2, r: 4, fill: "#fff" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            name="初回返信速度(中央値)"
                          />
                        </>
                      )}
                      <CartesianGrid vertical={false} horizontal={true} stroke="#e2e8f0" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  <DataTable columns={performanceColumns} rows={mockPerformanceData} />
                </div>
              )}
            </CardBody>
          </Card>

          {/* --- Member Lead Time Composition Analysis Card (Mock) --- */}
          <Card variant="outline" style={{ flex: "1 0 100%" }}>
            <CardHeader>
              <ContentHeader.Title>メンバー別 平均リードタイム構成分析 (Mock)</ContentHeader.Title>
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
                <SegmentedControl
                  size="small"
                  index={leadTimeViewMode === "composition" ? 0 : 1}
                  onChange={(index) => setLeadTimeViewMode(index === 0 ? "composition" : "performance")}
                >
                  <SegmentedControl.Button>構成分析</SegmentedControl.Button>
                  <SegmentedControl.Button>案件数・初回返信</SegmentedControl.Button>
                </SegmentedControl>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                  <ButtonGroup variant="plain" size="small">
                    {leadTimeViewMode === "composition" && (
                      <Button variant="subtle" size="small" onClick={() => setIsStatusConfigOpen(true)}>
                        ステータス分類設定
                      </Button>
                    )}
                    <Button
                      aria-pressed={isLeadTimeFilterOpen}
                      leading={
                        <Badge color="information" invisible={!isLeadTimeFiltering}>
                          <Icon>
                            <LfFilter />
                          </Icon>
                        </Badge>
                      }
                      onClick={() => setIsLeadTimeFilterOpen(!isLeadTimeFilterOpen)}
                    >
                      フィルター
                    </Button>
                  </ButtonGroup>
                  {renderViewSwitch(leadTimeGraphTableViewMode, setLeadTimeGraphTableViewMode)}
                </div>
              </div>

              {isLeadTimeFilterOpen && (
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
                  </CardBody>
                </Card>
              )}

              {leadTimeGraphTableViewMode === "graph" ? (
                leadTimeViewMode === "composition" ? (
                  <div
                    style={{
                      height: Math.max(
                        400,
                        mockLeadTimeCompositionData.length * (leadTimeAssigneeFilterMode === "both" ? 64 : 48),
                      ),
                      maxHeight: "640px",
                      overflowY: "auto",
                      paddingRight: "var(--aegis-space-small)",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockLeadTimeCompositionData}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                        accessibilityLayer
                        barCategoryGap="15%"
                      >
                        <XAxis
                          type="number"
                          unit="日"
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          tick={{ fill: "#000", fontSize: 12 }}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={120}
                          interval={0}
                          axisLine={false}
                          tickLine={false}
                          tickMargin={0}
                          tick={(props) => (
                            <CustomYAxisTick
                              {...props}
                              targetTabIndex={0}
                              assigneeFilterMode={leadTimeAssigneeFilterMode}
                            />
                          )}
                        />
                        <Tooltip
                          content={<CustomChartTooltip />}
                          cursor={{ fill: "#f1f5f9" }}
                          wrapperStyle={{ outline: "none" }}
                        />
                        <Legend content={renderCustomLegend} />
                        {(leadTimeAssigneeFilterMode === "both" || leadTimeAssigneeFilterMode === "main") &&
                          [
                            { key: "main_idle", name: "未着手 (主)", fill: "#E2E8F0" },
                            { key: "main_work", name: "作業中 (主)", fill: "#3182CE" },
                            { key: "main_wait", name: "他者待ち (主)", fill: "#ED8936" },
                          ]
                            .filter((item) => leadTimeStatusConfig.find((s) => s.key === item.key)?.visible)
                            .map((item, index, array) => (
                              <Bar
                                key={item.key}
                                dataKey={item.key}
                                name={item.name}
                                stackId="main"
                                fill={item.fill}
                                shape={(props: unknown) => {
                                  const p = props as {
                                    x?: number;
                                    y?: number;
                                    width?: number;
                                    height?: number;
                                    fill?: string;
                                    payload: Record<string, number>;
                                  };
                                  const { payload } = p;
                                  const hasValueAfter = array.slice(index + 1).some((it) => (payload[it.key] || 0) > 0);
                                  const hasValueBefore = array.slice(0, index).some((it) => (payload[it.key] || 0) > 0);
                                  return (
                                    <HorizontalBarWithDivider
                                      {...p}
                                      hideDivider={!hasValueAfter}
                                      radius={[
                                        !hasValueBefore ? 4 : 0,
                                        !hasValueAfter ? 4 : 0,
                                        !hasValueAfter ? 4 : 0,
                                        !hasValueBefore ? 4 : 0,
                                      ]}
                                    />
                                  );
                                }}
                              >
                                <LabelList dataKey={item.key} content={<BadgeLabel />} />
                              </Bar>
                            ))}
                        {(leadTimeAssigneeFilterMode === "both" || leadTimeAssigneeFilterMode === "sub") &&
                          [
                            { key: "sub_work", name: "作業中 (副)", fill: "#63B3ED" },
                            { key: "sub_wait", name: "待機中 (副)", fill: "#E2E8F0" },
                          ]
                            .filter((item) => leadTimeStatusConfig.find((s) => s.key === item.key)?.visible)
                            .map((item, index, array) => (
                              <Bar
                                key={item.key}
                                dataKey={item.key}
                                name={item.name}
                                stackId="sub"
                                fill={item.fill}
                                shape={(props: unknown) => {
                                  const p = props as {
                                    x?: number;
                                    y?: number;
                                    width?: number;
                                    height?: number;
                                    fill?: string;
                                    payload: Record<string, number>;
                                  };
                                  const { payload } = p;
                                  const hasValueAfter = array.slice(index + 1).some((it) => (payload[it.key] || 0) > 0);
                                  const hasValueBefore = array.slice(0, index).some((it) => (payload[it.key] || 0) > 0);
                                  return (
                                    <HorizontalBarWithDivider
                                      {...p}
                                      hideDivider={!hasValueAfter}
                                      radius={[
                                        !hasValueBefore ? 4 : 0,
                                        !hasValueAfter ? 4 : 0,
                                        !hasValueAfter ? 4 : 0,
                                        !hasValueBefore ? 4 : 0,
                                      ]}
                                    />
                                  );
                                }}
                              >
                                <LabelList dataKey={item.key} content={<BadgeLabel />} />
                              </Bar>
                            ))}
                        <CartesianGrid horizontal={false} vertical={true} stroke="#e2e8f0" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div
                    style={{
                      height: Math.max(
                        400,
                        mockMemberPerformanceData.length * (leadTimeAssigneeFilterMode === "both" ? 64 : 48),
                      ),
                      maxHeight: "640px",
                      overflowY: "auto",
                      paddingRight: "var(--aegis-space-small)",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockMemberPerformanceData}
                        layout="vertical"
                        margin={{ left: 20, right: 20, top: 20 }}
                        accessibilityLayer
                        barCategoryGap="15%"
                      >
                        <XAxis
                          type="number"
                          xAxisId="count"
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          tick={{ fill: "#000", fontSize: 12 }}
                          tickFormatter={(v) => `${v}件`}
                        />
                        <XAxis
                          type="number"
                          xAxisId="reply"
                          orientation="top"
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          tick={{ fill: "#000", fontSize: 12 }}
                          tickFormatter={(v) => `${v}日`}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={120}
                          interval={0}
                          axisLine={false}
                          tickLine={false}
                          tickMargin={0}
                          tick={(props) => (
                            <CustomYAxisTick
                              {...props}
                              targetTabIndex={0}
                              assigneeFilterMode={leadTimeAssigneeFilterMode}
                            />
                          )}
                        />
                        <Tooltip
                          content={<CustomChartTooltip />}
                          cursor={{ fill: "#f1f5f9" }}
                          wrapperStyle={{ outline: "none" }}
                        />
                        <Legend content={renderCustomLegend} />
                        {(leadTimeAssigneeFilterMode === "both" || leadTimeAssigneeFilterMode === "main") && (
                          <Bar
                            xAxisId="count"
                            dataKey="main_count"
                            name="担当案件数"
                            stackId="main"
                            fill="#3182CE"
                            shape={<HorizontalBarWithDivider hideDivider={true} radius={[0, 4, 4, 0]} />}
                          >
                            <LabelList dataKey="main_count" content={<BadgeLabel />} />
                          </Bar>
                        )}
                        {(leadTimeAssigneeFilterMode === "both" || leadTimeAssigneeFilterMode === "sub") && (
                          <Bar
                            xAxisId="count"
                            dataKey="sub_count"
                            name="副担当案件数"
                            stackId="sub"
                            fill="#63B3ED"
                            shape={<HorizontalBarWithDivider hideDivider={true} radius={[0, 4, 4, 0]} />}
                          >
                            <LabelList dataKey="sub_count" content={<BadgeLabel />} />
                          </Bar>
                        )}
                        {(leadTimeAssigneeFilterMode === "both" || leadTimeAssigneeFilterMode === "main") && (
                          <Scatter
                            xAxisId="reply"
                            dataKey="medianFirstReplyTime"
                            name="初回返信速度(中央値)"
                            fill="#38a169"
                            stroke="#fff"
                            strokeWidth={1.8}
                          />
                        )}
                        <CartesianGrid horizontal={false} vertical={true} stroke="#e2e8f0" xAxisId="count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )
              ) : (
                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  {leadTimeViewMode === "composition" ? (
                    <DataTable columns={leadTimeCompositionColumns} rows={mockLeadTimeCompositionData} />
                  ) : (
                    <DataTable columns={leadTimePerformanceColumns} rows={mockMemberPerformanceData} />
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* --- Case Occurrence by Department (Mock) --- */}
          <Card variant="outline" style={{ flex: "1 0 100%" }}>
            <CardHeader>
              <ContentHeader.Title>部署別の案件発生状況 (Mock)</ContentHeader.Title>
            </CardHeader>
            <CardBody>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                {/* Left: Primary Filter */}
                <div style={{ width: "280px" }}>
                  <FormControl orientation="horizontal">
                    <FormControl.Label width="auto" style={{ whiteSpace: "nowrap" }}>
                      案件タイプ
                    </FormControl.Label>
                    <Select
                      size="small"
                      options={[
                        { value: "all", label: "すべて" },
                        { value: "契約書審査", label: "契約書審査" },
                        { value: "契約書起案", label: "契約書起案" },
                        { value: "法務相談", label: "法務相談" },
                        { value: "その他", label: "その他" },
                      ]}
                      value={deptCaseTypeFilter}
                      onChange={(value) => {
                        if (value) {
                          setDeptCaseTypeFilter(value);
                        }
                      }}
                    />
                  </FormControl>
                </div>

                {/* Right: Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                  <ButtonGroup variant="plain" size="small">
                    <Button
                      leading={<Icon>{deptSortOrder === "asc" ? <LfSort19 /> : <LfSort91 />}</Icon>}
                      onClick={() => setDeptSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                    >
                      案件数
                    </Button>
                  </ButtonGroup>
                  {renderViewSwitch(deptCaseViewMode, setDeptCaseViewMode)}
                </div>
              </div>

              {/* Filter Area removed as it is now always visible */}

              {deptCaseViewMode === "graph" ? (
                <div
                  style={{
                    height: Math.max(400, mockDepartmentData.length * 48),
                    maxHeight: "640px",
                    overflowY: "auto",
                    paddingRight: "var(--aegis-space-small)",
                    marginTop: "var(--aegis-space-large)",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockDepartmentData}
                      layout="vertical"
                      margin={{ left: 20, right: 20, top: 20 }}
                      accessibilityLayer
                      barCategoryGap="15%"
                    >
                      <XAxis
                        type="number"
                        orientation="bottom"
                        xAxisId="count"
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        tick={{ fill: "#000", fontSize: 12 }}
                        tickFormatter={(v) => `${v}件`}
                      />
                      <XAxis
                        type="number"
                        orientation="top"
                        xAxisId="top"
                        dataKey="medianLeadTime"
                        allowDecimals={false}
                        domain={[0, "auto"]}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        tick={{ fill: "#000", fontSize: 12 }}
                        tickFormatter={(v) => `${v}日`}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={0}
                        tick={<CustomYAxisTick targetTabIndex={0} />}
                      />
                      <Tooltip
                        content={<CustomChartTooltip />}
                        cursor={{ fill: "#f1f5f9" }}
                        wrapperStyle={{ outline: "none" }}
                      />
                      <Legend content={renderCustomLegend} />
                      {[
                        { key: "caseCount.review", name: "契約書審査", fill: caseTypeColors.契約書審査 },
                        { key: "caseCount.drafting", name: "契約書起案", fill: caseTypeColors.契約書起案 },
                        { key: "caseCount.consultation", name: "法務相談", fill: caseTypeColors.法務相談 },
                        { key: "caseCount.other", name: "その他", fill: caseTypeColors.その他 },
                      ]
                        .filter((item) => deptCaseTypeFilter === "all" || deptCaseTypeFilter === item.name)
                        .map((item, index, array) => (
                          <Bar
                            key={item.key}
                            xAxisId="count"
                            dataKey={item.key}
                            stackId="a"
                            name={item.name}
                            fill={item.fill}
                            shape={(props: unknown) => {
                              const p = props as {
                                x?: number;
                                y?: number;
                                width?: number;
                                height?: number;
                                fill?: string;
                                payload: Record<string, unknown>;
                              };
                              const { payload } = p;
                              // フィルタリング後の配列（表示対象のみ）で前後を確認
                              const hasValueAfter = array.slice(index + 1).some((it) => {
                                // ネストされたパスの解決
                                const parts = it.key.split(".");
                                const value = parts.reduce<unknown>(
                                  (acc, part) => (acc as Record<string, unknown>)?.[part],
                                  payload,
                                );
                                return ((value as number) || 0) > 0;
                              });
                              const hasValueBefore = array.slice(0, index).some((it) => {
                                const parts = it.key.split(".");
                                const value = parts.reduce<unknown>(
                                  (acc, part) => (acc as Record<string, unknown>)?.[part],
                                  payload,
                                );
                                return ((value as number) || 0) > 0;
                              });
                              return (
                                <HorizontalBarWithDivider
                                  {...p}
                                  hideDivider={!hasValueAfter}
                                  radius={[
                                    !hasValueBefore ? 4 : 0,
                                    !hasValueAfter ? 4 : 0,
                                    !hasValueAfter ? 4 : 0,
                                    !hasValueBefore ? 4 : 0,
                                  ]}
                                />
                              );
                            }}
                            onClick={mockHandleDepartmentClick}
                          >
                            <LabelList
                              dataKey={item.key}
                              content={<CustomLabel />}
                              formatter={(value: unknown) => (typeof value === "number" && value > 0 ? value : "")}
                            />
                          </Bar>
                        ))}
                      <Scatter
                        xAxisId="top"
                        dataKey="medianLeadTime"
                        name="リードタイム(中央値)"
                        shape="diamond"
                        legendType="diamond"
                        fill="#ff7300"
                        stroke="#fff"
                        strokeWidth={1.8}
                        onClick={mockHandleDepartmentClick}
                      />
                      <Scatter
                        xAxisId="top"
                        dataKey="medianFirstReplyTime"
                        name="初回返信速度(中央値)"
                        fill="#387908"
                        stroke="#fff"
                        strokeWidth={1.8}
                        onClick={mockHandleDepartmentClick}
                      />
                      <CartesianGrid horizontal={false} vertical={true} stroke="#e2e8f0" xAxisId="count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <DataTable columns={deptColumns} rows={mockDepartmentData} />
              )}
            </CardBody>
          </Card>

          {/* --- Template Usage by Department (Mock) --- */}
          <Card variant="outline" style={{ flex: "1 0 100%" }}>
            <CardHeader>
              <ContentHeader.Title>部署別のひな形利用状況 (Mock)</ContentHeader.Title>
            </CardHeader>
            <CardBody>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                {/* Left: Primary Filter */}
                <div style={{ width: "280px" }}>
                  <FormControl orientation="horizontal">
                    <FormControl.Label width="auto" style={{ whiteSpace: "nowrap" }}>
                      契約類型
                    </FormControl.Label>
                    <TagPicker
                      size="small"
                      options={mockContractCategories.map((c) => ({ value: c, label: c }))}
                      value={templateCategoryFilter}
                      onChange={setTemplateCategoryFilter}
                    />
                  </FormControl>
                </div>

                {/* Right: Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                  <ButtonGroup variant="plain" size="small">
                    <Button
                      leading={<Icon>{templateSortOrder === "asc" ? <LfSort19 /> : <LfSort91 />}</Icon>}
                      onClick={() => setTemplateSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                    >
                      利用数
                    </Button>
                  </ButtonGroup>
                  {renderViewSwitch(templateViewMode, setTemplateViewMode)}
                </div>
              </div>

              {/* Filter Area removed as it is now always visible */}

              {templateViewMode === "graph" ? (
                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      layout="vertical"
                      data={mockTemplateUsageData}
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                      accessibilityLayer
                      barCategoryGap="15%"
                    >
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        tick={{ fill: "#000", fontSize: 12 }}
                        tickFormatter={(v) => `${v}回`}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={0}
                        tick={(props) => <CustomYAxisTick {...props} targetTabIndex={1} />}
                      />
                      <Tooltip
                        content={<CustomChartTooltip />}
                        cursor={{ fill: "#f1f5f9" }}
                        wrapperStyle={{ outline: "none" }}
                      />
                      <Legend content={renderCustomLegend} />
                      {mockContractCategories
                        .filter(
                          (category) =>
                            templateCategoryFilter.length === 0 || templateCategoryFilter.includes(category),
                        )
                        .map((category, index, array) => (
                          <Bar
                            key={category}
                            dataKey={category}
                            stackId="a"
                            fill={categoryColors[category]}
                            name={category}
                            shape={(props: unknown) => {
                              const p = props as {
                                x?: number;
                                y?: number;
                                width?: number;
                                height?: number;
                                fill?: string;
                                payload: Record<string, number>;
                              };
                              const hasValueAfter = array.slice(index + 1).some((it) => (p.payload[it] || 0) > 0);
                              const hasValueBefore = array.slice(0, index).some((it) => (p.payload[it] || 0) > 0);
                              return (
                                <HorizontalBarWithDivider
                                  {...p}
                                  hideDivider={!hasValueAfter}
                                  radius={[
                                    !hasValueBefore ? 4 : 0,
                                    !hasValueAfter ? 4 : 0,
                                    !hasValueAfter ? 4 : 0,
                                    !hasValueBefore ? 4 : 0,
                                  ]}
                                />
                              );
                            }}
                            onClick={mockHandleDepartmentClick}
                          >
                            <LabelList
                              dataKey={category}
                              content={<CustomLabel />}
                              formatter={(value: unknown) => (typeof value === "number" && value > 0 ? value : "")}
                            />
                          </Bar>
                        ))}
                      <CartesianGrid horizontal={false} vertical={true} stroke="#e2e8f0" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <DataTable columns={templateColumns} rows={mockTemplateUsageData} />
              )}
            </CardBody>
          </Card>

          {/* --- Contract Review Breakdown by Department (Mock) --- */}
          <Card variant="outline" style={{ flex: "1 0 100%" }}>
            <CardHeader>
              <ContentHeader.Title>部署別の契約書審査内訳 (Mock)</ContentHeader.Title>
            </CardHeader>
            <CardBody>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <SegmentedControl
                  size="small"
                  index={breakdownViewMode === "count" ? 0 : 1}
                  onChange={(index) => {
                    setBreakdownViewMode(index === 0 ? "count" : "percentage");
                  }}
                >
                  <SegmentedControl.Button>件数</SegmentedControl.Button>
                  <SegmentedControl.Button>割合</SegmentedControl.Button>
                </SegmentedControl>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                  {renderViewSwitch(breakdownDisplayMode, setBreakdownDisplayMode)}
                </div>
              </div>

              {breakdownDisplayMode === "graph" ? (
                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={mockReviewBreakdownData}
                      layout="vertical"
                      margin={{ left: 20, right: 20, top: 20 }}
                      stackOffset={breakdownViewMode === "percentage" ? "expand" : "none"}
                      accessibilityLayer
                      barCategoryGap="15%"
                    >
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        tick={{ fill: "#000", fontSize: 12 }}
                        tickFormatter={
                          breakdownViewMode === "percentage" ? (v) => `${Math.round(v * 100)}%` : (v) => `${v}件`
                        }
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={0}
                        tick={<CustomYAxisTick targetTabIndex={0} />}
                      />
                      <Tooltip
                        content={<CustomChartTooltip />}
                        cursor={{ fill: "#f1f5f9" }}
                        wrapperStyle={{ outline: "none" }}
                      />
                      <Legend content={renderCustomLegend} />
                      {mockContractCategories.map((category, index, array) => (
                        <Bar
                          key={category}
                          dataKey={category}
                          stackId="a"
                          fill={categoryColors[category]}
                          name={category}
                          shape={(props: unknown) => {
                            const p = props as {
                              x?: number;
                              y?: number;
                              width?: number;
                              height?: number;
                              fill?: string;
                              payload: Record<string, number>;
                            };
                            const { payload } = p;
                            const hasValueAfter = array.slice(index + 1).some((it) => (payload[it] || 0) > 0);
                            const hasValueBefore = array.slice(0, index).some((it) => (payload[it] || 0) > 0);
                            return (
                              <HorizontalBarWithDivider
                                {...p}
                                hideDivider={!hasValueAfter}
                                radius={[
                                  !hasValueBefore ? 4 : 0,
                                  !hasValueAfter ? 4 : 0,
                                  !hasValueAfter ? 4 : 0,
                                  !hasValueBefore ? 4 : 0,
                                ]}
                              />
                            );
                          }}
                          onClick={mockHandleDepartmentClick}
                        >
                          <LabelList
                            dataKey={category}
                            content={(props: LabelProps) => (
                              <CustomLabel {...props} isPercentage={breakdownViewMode === "percentage"} />
                            )}
                            formatter={(value: unknown) => (typeof value === "number" && value > 0 ? value : "")}
                          />
                        </Bar>
                      ))}
                      <CartesianGrid horizontal={false} vertical={true} stroke="#e2e8f0" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <DataTable columns={breakdownColumns} rows={mockReviewBreakdownData} />
              )}
            </CardBody>
          </Card>

          {/* --- Legal Advice Cards (Mock) --- */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--aegis-space-large)",
              flex: "1 0 100%",
            }}
          >
            <Card variant="outline" style={{ gridColumn: "1 / -1" }}>
              <CardHeader>
                <ContentHeader.Title>案件タイプ別の案件数 (Mock)</ContentHeader.Title>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  {/* Left: View settings */}
                  <div>
                    <Checkbox
                      checked={showLegalPreviousYear}
                      onChange={(e) => setShowLegalPreviousYear(e.target.checked)}
                    >
                      昨年対比を表示
                    </Checkbox>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                    <ButtonGroup variant="plain" size="small">
                      <Button
                        aria-pressed={isLegalCaseFilterOpen}
                        leading={
                          <Badge color="information" invisible={!isLegalCaseFiltering}>
                            <Icon>
                              <LfFilter />
                            </Icon>
                          </Badge>
                        }
                        onClick={() => setIsLegalCaseFilterOpen(!isLegalCaseFilterOpen)}
                      >
                        フィルター
                      </Button>
                    </ButtonGroup>
                    {renderViewSwitch(legalCaseTypeViewMode, setLegalCaseTypeViewMode)}
                  </div>
                </div>

                {isLegalCaseFilterOpen && (
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
                            size="small"
                            value={legalCaseTypeFilter}
                            onChange={(value) => setLegalCaseTypeFilter(value)}
                            options={[
                              { label: "すべて", value: "すべて" },
                              ...CASE_TYPE_ORDER.map((type) => ({ label: type, value: type })),
                            ]}
                          />
                        </FormControl>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {legalCaseTypeViewMode === "graph" ? (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={mockCaseTypeData}
                        onClick={(_data) => mockHandleChartElementClick()}
                        accessibilityLayer
                      >
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          tick={<CustomXAxisTick onClick={mockHandleChartElementClick} />}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          tick={{ fill: "#000", fontSize: 12 }}
                          tickFormatter={(v) => `${v}件`}
                        />
                        <Tooltip
                          content={<CustomChartTooltip />}
                          cursor={{ fill: "#f1f5f9" }}
                          wrapperStyle={{ outline: "none" }}
                        />
                        <Legend content={renderCustomLegend} />
                        {CASE_TYPE_ORDER.map((caseType, index, array) => (
                          <Bar
                            key={caseType}
                            dataKey={caseType}
                            name={caseType}
                            stackId="current"
                            fill={CASE_TYPE_COLORS[caseType]}
                            shape={(props: unknown) => {
                              const p = props as {
                                x?: number;
                                y?: number;
                                width?: number;
                                height?: number;
                                fill?: string;
                                payload: Record<string, number>;
                              };
                              const hasValueAfter = array.slice(index + 1).some((it) => (p.payload[it] || 0) > 0);
                              const hasValueBefore = array.slice(0, index).some((it) => (p.payload[it] || 0) > 0);
                              return (
                                <VerticalBarWithDivider
                                  {...p}
                                  hideDivider={!hasValueAfter}
                                  radius={[
                                    !hasValueAfter ? 4 : 0, // Top-Left
                                    !hasValueAfter ? 4 : 0, // Top-Right
                                    !hasValueBefore ? 4 : 0, // Bottom-Right
                                    !hasValueBefore ? 4 : 0, // Bottom-Left
                                  ]}
                                />
                              );
                            }}
                            cursor="pointer"
                          >
                            <LabelList dataKey={caseType} content={<BadgeLabel />} />
                          </Bar>
                        ))}
                        {showLegalPreviousYear &&
                          CASE_TYPE_ORDER.map((caseType, _, array) => (
                            <Bar
                              key={`${caseType}_prev`}
                              dataKey={`${caseType}_prev`}
                              name={`${caseType} (前年)`}
                              stackId="prev"
                              fill={CASE_TYPE_COLORS[caseType]}
                              shape={(props: unknown) => {
                                const p = props as {
                                  x?: number;
                                  y?: number;
                                  width?: number;
                                  height?: number;
                                  fill?: string;
                                  payload: Record<string, number>;
                                };
                                const currentIndex = array.indexOf(caseType);
                                const hasValueAfter = array
                                  .slice(currentIndex + 1)
                                  .some((it) => (p.payload[`${it}_prev`] || 0) > 0);
                                const hasValueBefore = array
                                  .slice(0, currentIndex)
                                  .some((it) => (p.payload[`${it}_prev`] || 0) > 0);
                                return (
                                  <VerticalBarWithDivider
                                    {...p}
                                    hideDivider={!hasValueAfter}
                                    radius={[
                                      !hasValueAfter ? 4 : 0,
                                      !hasValueAfter ? 4 : 0,
                                      !hasValueBefore ? 4 : 0,
                                      !hasValueBefore ? 4 : 0,
                                    ]}
                                  />
                                );
                              }}
                              opacity={0.4}
                              cursor="pointer"
                            />
                          ))}
                        <CartesianGrid vertical={false} horizontal={true} stroke="#e2e8f0" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <DataTable columns={legalCaseTypeColumns} rows={mockCaseTypeData} />
                  </div>
                )}
              </CardBody>
            </Card>
            <Card variant="outline">
              <CardHeader>
                <ContentHeader.Title>案件タイプ別 構成比 (Mock)</ContentHeader.Title>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  {renderViewSwitch(legalDistributionViewMode, setLegalDistributionViewMode)}
                </div>
                {legalDistributionViewMode === "graph" ? (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={mockCaseDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            if (
                              cx === undefined ||
                              cy === undefined ||
                              midAngle === undefined ||
                              innerRadius === undefined ||
                              outerRadius === undefined ||
                              percent === undefined
                            ) {
                              return null;
                            }
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                            if (percent === 0) {
                              return null;
                            }
                            return (
                              <text
                                x={x}
                                y={y}
                                fill="white"
                                textAnchor={x > cx ? "start" : "end"}
                                dominantBaseline="central"
                              >
                                {`${(percent * 100).toFixed(0)}%`}
                              </text>
                            );
                          }}
                        >
                          {mockCaseDistributionData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={CASE_TYPE_COLORS[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend content={renderCustomLegend} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <DataTable columns={legalDistributionColumns} rows={mockCaseDistributionData} />
                  </div>
                )}
              </CardBody>
            </Card>
            <Card variant="outline">
              <CardHeader>
                <ContentHeader.Title>契約書審査の内訳（契約類型別） (Mock)</ContentHeader.Title>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  {renderViewSwitch(legalBreakdownViewMode, setLegalBreakdownViewMode)}
                </div>
                {legalBreakdownViewMode === "graph" ? (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        layout="vertical"
                        data={mockReviewBreakdownData_Legal}
                        margin={{ left: 20, right: 20, top: 20 }}
                        accessibilityLayer
                        barCategoryGap="15%"
                      >
                        <XAxis
                          type="number"
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          tick={{ fill: "#000", fontSize: 12 }}
                          tickFormatter={(v) => `${v}件`}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={120}
                          axisLine={false}
                          tickLine={false}
                          tickMargin={0}
                          tick={<BreakdownChartYAxisTick onClick={mockHandleCategoryClick} />}
                        />
                        <Tooltip
                          content={<CustomChartTooltip />}
                          cursor={{ fill: "#f1f5f9" }}
                          wrapperStyle={{ outline: "none" }}
                        />
                        <Bar dataKey="count" fill="#8884d8" name="件数" radius={[0, 4, 4, 0]}>
                          <LabelList dataKey="count" content={<BadgeLabel />} />
                        </Bar>
                        <CartesianGrid horizontal={false} vertical={true} stroke="#e2e8f0" xAxisId="count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <DataTable columns={legalBreakdownColumns} rows={mockReviewBreakdownData_Legal} />
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* --- Workstreams Cards (Mock) --- */}
          <Card variant="outline" style={{ flex: "1 0 100%" }}>
            <CardHeader>
              <ContentHeader.Title>契約書の件数とバージョン変更回数 (Mock)</ContentHeader.Title>
            </CardHeader>
            <CardBody>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                {/* Left: Primary Filter */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--aegis-space-small)" }}>
                  <div style={{ width: "auto" }}>
                    <FormControl orientation="horizontal">
                      <FormControl.Label width="auto" style={{ whiteSpace: "nowrap" }}>
                        期間
                      </FormControl.Label>
                      <RangeDatePicker
                        size="medium"
                        startValue={workstreamDateRange.start}
                        endValue={workstreamDateRange.end}
                        onStartChange={(date) => setWorkstreamDateRange((prev) => ({ ...prev, start: date ?? null }))}
                        onEndChange={(date) => setWorkstreamDateRange((prev) => ({ ...prev, end: date ?? null }))}
                      />
                    </FormControl>
                  </div>
                  <div style={{ paddingBottom: "var(--aegis-space-xsmall)" }}>
                    <Button
                      variant="subtle"
                      size="small"
                      onClick={() => {
                        setWorkstreamDateRange({ start: null, end: null });
                      }}
                    >
                      リセット
                    </Button>
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                  {renderViewSwitch(workstreamViewMode, setWorkstreamViewMode)}
                </div>
              </div>

              {/* Filter Area removed as it is now always visible */}

              {workstreamViewMode === "table" ? (
                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  <DataTable columns={contractTypeColumns} rows={mockContractTypeData} />
                </div>
              ) : (
                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      layout="vertical"
                      data={mockContractTypeData}
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <XAxis
                        type="number"
                        xAxisId="bar"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        tick={{ fill: "#000", fontSize: 12 }}
                        tickFormatter={(v) => `${v}件`}
                      />
                      <XAxis
                        type="number"
                        xAxisId="scatter"
                        orientation="top"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        tick={{ fill: "#000", fontSize: 12 }}
                        tickFormatter={(v) => `${v}回`}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
                        tick={WorkstreamYAxisTick}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={0}
                      />
                      <Tooltip
                        content={<CustomChartTooltip />}
                        cursor={{ fill: "#f1f5f9" }}
                        wrapperStyle={{ outline: "none" }}
                      />
                      <Legend content={renderCustomLegend} />
                      <Bar
                        dataKey="monthlyCaseCount"
                        xAxisId="bar"
                        barSize={30}
                        fill="#413ea0"
                        name="総件数"
                        onClick={mockHandleWorkstreamClick}
                        radius={[0, 4, 4, 0]}
                      >
                        <LabelList dataKey="monthlyCaseCount" content={<BadgeLabel />} />
                      </Bar>
                      <Scatter
                        dataKey="medianVersionChangeCount"
                        xAxisId="scatter"
                        fill="#ff7300"
                        stroke="#fff"
                        strokeWidth={1.8}
                        name="バージョン変更回数(中央値)"
                        onClick={mockHandleWorkstreamClick}
                      />
                      <CartesianGrid horizontal={false} vertical={true} stroke="#e2e8f0" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardBody>
          </Card>
          <Card variant="outline" style={{ flex: "1 0 100%" }}>
            <CardHeader>
              <ContentHeader.Title>契約類型別のひな形利用率 (Mock)</ContentHeader.Title>
            </CardHeader>
            <CardBody>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <SegmentedControl
                  size="small"
                  index={templateAnalysisMode === "byType" ? 0 : 1}
                  onChange={(index) => {
                    setTemplateAnalysisMode(index === 0 ? "byType" : "byTemplate");
                  }}
                >
                  <SegmentedControl.Button>類型別</SegmentedControl.Button>
                  <SegmentedControl.Button>ひな形別</SegmentedControl.Button>
                </SegmentedControl>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                  {renderViewSwitch(templateAnalysisViewMode, setTemplateAnalysisViewMode)}
                </div>
              </div>

              {templateAnalysisMode === "byType" ? (
                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  {templateAnalysisViewMode === "table" ? (
                    <DataTable columns={templateUsageColumns_WS} rows={mockFilteredTemplateUsageData_WS} />
                  ) : (
                    <div
                      style={{
                        height: Math.max(400, mockFilteredTemplateUsageData_WS.length * 48),
                        maxHeight: "640px",
                        overflowY: "auto",
                        paddingRight: "var(--aegis-space-small)",
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={mockFilteredTemplateUsageData_WS}
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                          accessibilityLayer
                          barCategoryGap="15%"
                        >
                          <XAxis
                            type="number"
                            xAxisId="count"
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            tick={{ fill: "#000", fontSize: 12 }}
                            tickFormatter={(v) => `${v}件`}
                          />
                          <YAxis
                            dataKey="name"
                            type="category"
                            width={120}
                            tick={(props) => <CustomYAxisTick {...props} targetTabIndex={0} />}
                            axisLine={false}
                            tickLine={false}
                            tickMargin={0}
                          />
                          <Tooltip
                            content={<CustomChartTooltip />}
                            cursor={{ fill: "#f1f5f9" }}
                            wrapperStyle={{ outline: "none" }}
                          />
                          <Legend content={renderCustomLegend} />
                          {[
                            { key: "self", name: "自社ひな形", fill: "#0367a8" },
                            { key: "other", name: "その他", fill: "#cdcdcd" },
                          ].map((item, index, array) => (
                            <Bar
                              key={item.key}
                              dataKey={item.key}
                              name={item.name}
                              stackId="a"
                              fill={item.fill}
                              shape={(props: unknown) => {
                                const p = props as {
                                  x?: number;
                                  y?: number;
                                  width?: number;
                                  height?: number;
                                  fill?: string;
                                  payload: Record<string, number>;
                                };
                                const hasValueAfter = array.slice(index + 1).some((it) => (p.payload[it.key] || 0) > 0);
                                const hasValueBefore = array.slice(0, index).some((it) => (p.payload[it.key] || 0) > 0);
                                return (
                                  <HorizontalBarWithDivider
                                    {...p}
                                    hideDivider={!hasValueAfter}
                                    radius={[
                                      !hasValueBefore ? 4 : 0,
                                      !hasValueAfter ? 4 : 0,
                                      !hasValueAfter ? 4 : 0,
                                      !hasValueBefore ? 4 : 0,
                                    ]}
                                  />
                                );
                              }}
                              onClick={mockHandleWorkstreamClick}
                            >
                              <LabelList
                                dataKey={item.key}
                                content={(props) => (
                                  <CustomBarLabel {...props} fill={item.key === "self" ? "white" : "#191919"} />
                                )}
                                formatter={(value: unknown) => (typeof value === "number" && value > 0 ? value : "")}
                              />
                            </Bar>
                          ))}
                          <CartesianGrid horizontal={false} vertical={true} stroke="#e2e8f0" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  {templateAnalysisViewMode === "table" ? (
                    <DataTable columns={templateDetailColumns_WS} rows={mockTemplateDetailsData_WS} />
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        layout="vertical"
                        data={mockTemplateDetailsData_WS}
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <XAxis
                          type="number"
                          xAxisId="bar"
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          tick={{ fill: "#000", fontSize: 12 }}
                          tickFormatter={(v) => `${v}件`}
                        />
                        <XAxis
                          type="number"
                          xAxisId="scatter"
                          orientation="top"
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          tick={{ fill: "#000", fontSize: 12 }}
                          tickFormatter={(v) => `${v}回`}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={120}
                          axisLine={false}
                          tickLine={false}
                          tickMargin={0}
                          tick={(props) => <CustomYAxisTick {...props} targetTabIndex={0} />}
                        />
                        <Tooltip
                          content={<CustomChartTooltip />}
                          cursor={{ fill: "#f1f5f9" }}
                          wrapperStyle={{ outline: "none" }}
                        />
                        <Legend content={renderCustomLegend} />
                        <Bar
                          dataKey="usageCount"
                          xAxisId="bar"
                          barSize={20}
                          fill="#413ea0"
                          name="利用件数"
                          radius={[0, 4, 4, 0]}
                        >
                          <LabelList dataKey="usageCount" content={<BadgeLabel />} />
                        </Bar>
                        <Scatter
                          dataKey="medianVersionChangeCount"
                          xAxisId="scatter"
                          fill="#ff7300"
                          stroke="#fff"
                          strokeWidth={1.8}
                          name="バージョン変更回数(中央値)"
                        />
                        <CartesianGrid horizontal={false} vertical={true} stroke="#e2e8f0" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--aegis-space-large)",
              width: "100%",
            }}
          >
            <Card variant="outline">
              <CardHeader>
                <ContentHeader.Title>電子契約 署名待ち状況 (Mock)</ContentHeader.Title>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  {renderViewSwitch(eContractViewMode, setEContractViewMode)}
                </div>
                {eContractViewMode === "graph" ? (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={mockEContractStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                        >
                          {mockEContractStatusData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={eContractStatusColors[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend content={renderCustomLegend} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <DataTable columns={eContractColumns} rows={mockEContractStatusData} />
                  </div>
                )}
              </CardBody>
            </Card>
            <Card variant="outline">
              <CardHeader>
                <ContentHeader.Title>締結済み契約の保管状況 (Mock)</ContentHeader.Title>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  {renderViewSwitch(storageViewMode, setStorageViewMode)}
                </div>
                {storageViewMode === "graph" ? (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={mockStorageStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                        >
                          {mockStorageStatusData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={storageStatusColors[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend content={renderCustomLegend} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <DataTable columns={storageColumns} rows={mockStorageStatusData} />
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </PageLayoutBody>

      {/* Lead Time Status Config Dialog */}
      <Dialog open={isStatusConfigOpen} onOpenChange={setIsStatusConfigOpen}>
        <Dialog.Content width="small">
          <Dialog.Header>
            <Text variant="title.medium">ステータス分類設定</Text>
          </Dialog.Header>
          <Dialog.Body>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
              <Text variant="body.medium">グラフに表示するステータスを選択してください。</Text>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                {leadTimeStatusConfig.map((status) => (
                  <div
                    key={status.key}
                    style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}
                  >
                    <Checkbox
                      checked={status.visible}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setLeadTimeStatusConfig((prev) =>
                          prev.map((s) => (s.key === status.key ? { ...s, visible: checked } : s)),
                        );
                      }}
                    />
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: status.color,
                        borderRadius: "2px",
                        opacity: status.key.startsWith("sub") ? 0.6 : 1,
                      }}
                    />
                    <Text variant="body.medium">{status.name}</Text>
                  </div>
                ))}
              </div>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="subtle" onClick={() => setIsStatusConfigOpen(false)}>
              キャンセル
            </Button>
            <Button variant="solid" onClick={() => setIsStatusConfigOpen(false)}>
              適用
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>

      <PageLayoutFooter>
        <AegisLink asChild>
          <Link to="/sandbox">← Back to Sandbox</Link>
        </AegisLink>
      </PageLayoutFooter>
    </PageLayoutContent>
  );
}
