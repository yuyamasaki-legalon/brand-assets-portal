// Presentation component for TeamMembers page
// Receives all data, state, and handlers as props from Container.tsx

import { LfArchive, LfArrowUpRightFromSquare, LfLayoutHorizonRight } from "@legalforce/aegis-icons";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Combobox,
  ContentHeader,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Drawer,
  FormControl,
  Icon,
  IconButton,
  PageLayout,
  SegmentedControl,
  StatusLabel,
  Tab,
  Tag,
  Text,
  Toolbar,
  Tooltip,
} from "@legalforce/aegis-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useLocale } from "../hooks/useLocale";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
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
} from "../types";
import { CasesTab } from "./CasesTab";
import { LanguageToggle } from "./LanguageToggle";
import { MemberDetailPane } from "./MemberDetailPane";
import { TimeTab } from "./TimeTab";
import { WorkloadTab } from "./WorkloadTab";

const buildCaseDetailUrl = (caseId: number) => `https://app.legalon-cloud.com/case/${caseId}`;

export interface PresentationProps {
  // State props
  selectedMember: string | null;
  selectedTabIndex: number;
  paneTabIndex: number;
  sortOrder: "asc" | "desc";
  teamCaseSortType: "caseCount" | "name";
  onTeamCaseSortTypeChange: (type: "caseCount" | "name") => void;
  activeDueDateFilter: DueDateFilter;
  activeCaseTypeFilter: string;
  activeStatusFilter: string;
  caseStatusView: "status" | "type" | "dueDate" | "department";
  assignments: Record<string, string>;
  localizedTeamMembers: string[];
  performanceDateRange: { start: Date | null; end: Date | null };
  // WorkloadTab用のフィルター
  workloadSelectedMembers: string[];
  workloadDateRange: { start: Date | null; end: Date | null };
  onWorkloadSelectedMembersChange: (members: string[]) => void;
  onWorkloadDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onWorkloadDateRangeReset: () => void;
  // TimeTab用のフィルター
  timeSelectedMembers: string[];
  timeDateRange: { start: Date | null; end: Date | null };
  onTimeSelectedMembersChange: (members: string[]) => void;
  onTimeDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onTimeDateRangeReset: () => void;
  // CasesTab用のフィルター
  casesSelectedMembers: string[];
  onCasesSelectedMembersChange: (members: string[]) => void;
  onCasesSelectedMembersReset: () => void;
  showEmptySubAssignee: boolean;
  subAssignments: Record<string, string>;
  paneStatusFilter: string;
  paneCaseTypeFilter: string;
  paneDueDateFilter: DueDateFilter;
  panePerformanceDateRange: { start: Date | null; end: Date | null };
  paneContext:
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
    | null;
  // パフォーマンス概要カード用のprops
  performanceOverviewCaseTypeFilter: string;
  performanceOverviewAssigneeFilterMode: AssigneeFilterMode;
  performanceOverviewViewMode: "graph" | "table";
  isPerformanceOverviewFilterOpen: boolean;
  performanceOverviewBreakdownView: "dueDate" | "caseType" | "department";
  onPerformanceOverviewBreakdownViewChange: (view: "dueDate" | "caseType" | "department") => void;
  leadTimePerformanceSortType: "caseCount" | "name";
  leadTimePerformanceSortOrder: "asc" | "desc";
  performanceOverviewDueDateFilter: DueDateFilter;
  performanceOverviewDateRange: { start: Date | null; end: Date | null };
  // リードタイム内訳カード用のprops
  leadTimeCompositionCaseTypeFilter: string;
  leadTimeCompositionAssigneeFilterMode: AssigneeFilterMode;
  leadTimeCompositionViewMode: "graph" | "table";
  leadTimeCompositionGraphMode: "grouped" | "detailed";
  isLeadTimeCompositionFilterOpen: boolean;
  leadTimeCompositionSortType: "caseCount" | "name";
  leadTimeCompositionSortOrder: "asc" | "desc";
  leadTimeCategories: LeadTimeCategories;
  isStatusSettingsOpen: boolean;
  assigneeFilterMode: AssigneeFilterMode;
  isFilterOpen: boolean;
  isPaneFilterOpen: boolean;
  teamCaseViewMode: "graph" | "table";
  // Personal performance用のprops（2つのカードに分離）
  personalMatterCountCaseTypeFilter: string;
  personalMatterCountDateRange: { start: Date | null; end: Date | null };
  personalMatterCountViewMode: "graph" | "table";
  personalMatterCountViewType: "dueDate" | "caseType" | "department";
  personalLeadTimeCaseTypeFilter: string;
  personalLeadTimeDateRange: { start: Date | null; end: Date | null };
  personalLeadTimeViewMode: "graph" | "table";
  personalLeadTimePeriodView: "all" | "monthly";
  isPersonalMatterCountFilterOpen: boolean;
  isPersonalLeadTimeFilterOpen: boolean;
  experienceViewMode: "graph" | "table";
  monthlyGraphView: "caseCount" | "leadTime";
  onMonthlyGraphViewChange: (view: "caseCount" | "leadTime") => void;
  // Data props
  selectedMemberMainCases: CaseData[];
  selectedMemberSubCases: CaseData[];
  membersWithOverdueCases: string[];
  unassignedCasesCount: number;
  unassignedSubAssigneeCasesCount: number;
  allUnassignedCases: CaseData[];
  allUnassignedSubAssigneeCases: CaseData[];
  overallPerformanceData: Array<{
    name: string;
    新規案件数: number;
    onTimeCompletionCount: number;
    overdueCompletionCount: number;
    noDueDateCompletionCount: number;
    リードタイム中央値: number;
    初回返信速度中央値: number;
  }>;
  personalMatterCountData: Record<
    string,
    Array<{
      name: string;
      onTimeCompletionCount: number;
      overdueCompletionCount: number;
      noDueDateCompletionCount: number;
      leadTimeMedian: number;
      firstReplyTimeMedian: number;
    }>
  >;
  personalMatterCountByCaseTypeData: Record<string, Array<Record<string, number | string>>>;
  personalMatterCountAllPeriodData: {
    新規案件数: number;
    onTimeCompletionCount: number;
    overdueCompletionCount: number;
    noDueDateCompletionCount: number;
  };
  personalMatterCountAllPeriodByCaseTypeData: Record<
    string,
    Record<
      CaseType,
      {
        新規案件数: number;
        完了案件数: number;
      }
    >
  >;
  personalMatterCountPeriodView: "all" | "monthly";
  onPersonalMatterCountPeriodViewChange: (view: "all" | "monthly") => void;
  personalLeadTimeData: Record<
    string,
    Array<{
      name: string;
      onTimeCompletionCount: number;
      overdueCompletionCount: number;
      noDueDateCompletionCount: number;
      leadTimeMedian: number;
      firstReplyTimeMedian: number;
    }>
  >;
  personalLeadTimeAllPeriodData: Record<
    string,
    {
      リードタイム中央値: number;
      初回返信速度中央値: number;
      リードタイム中央値_昨年: number;
      初回返信速度中央値_昨年: number;
    }
  >;
  dueDateSummary: {
    すべて: number;
    納期超過: number;
    今日まで: number;
    今日含め3日以内: number;
    今日含め7日以内: number;
    "1週間後〜": number;
    納期未入力: number;
  };
  filteredData: CaseData[];
  tenantStatusSeriesForTeamBreakdown: Array<{ key: string; name: string; color: string; borderColor?: string }>;
  chartData: Array<
    {
      name: string;
      caseNames: Record<string, string[]>;
    } & Record<string, number | string | Record<string, string[]>>
  >;
  teamStatusColumns: (
    | DataTableColumnDef<Record<string, number | string | Record<string, string[]>>, string>
    | DataTableColumnDef<Record<string, number | string | Record<string, string[]>>, number>
  )[];
  leadTimeCompositionData: LeadTimeCompositionData[];
  memberPerformanceData: MemberPerformanceData[];
  memberPerformanceByCaseTypeData: MemberPerformanceByCaseTypeData[];
  // WorkloadTab用のデータ
  workloadCaseCountByCaseTypeOverallPerformanceData: Array<Record<string, number | string>>;
  workloadCaseCountByCaseTypeMergedPerformanceData: Array<Record<string, number | string>>;
  workloadCaseCountAllPeriodByCaseTypeData: Record<
    string,
    {
      新規案件数: number;
      完了案件数: number;
    }
  >;
  workloadCaseCountAllPeriodByCaseTypePreviousYearData: Record<
    string,
    {
      新規案件数: number;
      完了案件数: number;
    }
  >;
  workloadCaseCount2OverallPerformanceData: Array<{
    name: string;
    新規案件数: number;
    onTimeCompletionCount: number;
    overdueCompletionCount: number;
    noDueDateCompletionCount: number;
    リードタイム中央値: number;
    初回返信速度中央値: number;
  }>;
  workloadCaseCount2MergedPerformanceData: Array<{
    name: string;
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
  }>;
  workloadCaseCount2ByCaseTypeOverallPerformanceData: Array<Record<string, number | string>>;
  workloadCaseCount2ByCaseTypeMergedPerformanceData: Array<Record<string, number | string>>;
  workloadCaseCount2AllPeriodData: {
    新規案件数: number;
    onTimeCompletionCount: number;
    overdueCompletionCount: number;
    noDueDateCompletionCount: number;
  };
  workloadCaseCount2AllPeriodPreviousYearData: {
    新規案件数: number;
    onTimeCompletionCount: number;
    overdueCompletionCount: number;
    noDueDateCompletionCount: number;
  };
  workloadCaseCount2AllPeriodByCaseTypeData: Record<
    string,
    {
      新規案件数: number;
      完了案件数: number;
    }
  >;
  workloadCaseCount2AllPeriodByCaseTypePreviousYearData: Record<
    string,
    {
      新規案件数: number;
      完了案件数: number;
    }
  >;
  workloadMemberPerformanceData: MemberPerformanceData[];
  workloadMemberPerformanceByCaseTypeData: MemberPerformanceByCaseTypeData[];
  maxCaseCount: number;
  mainExperienceCompletedCases: CaseData[];
  subExperienceCompletedCases: CaseData[];
  mainExperienceCaseTypeCounts: Array<{ type: string; count: number }>;
  subExperienceCaseTypeCounts: Array<{ type: string; count: number }>;
  statusDurationDetailCases: CaseData[];
  durationBucketDetailCases: CaseData[];
  // Column definitions
  unassignedCasesColumns: DataTableColumnDef<CaseData, string | number>[];
  caseTypeCountColumns: DataTableColumnDef<{ type: string; count: number }, string | number>[];
  mainAssignmentTableColumns: DataTableColumnDef<CaseData, string | number>[];
  subAssignmentTableColumns: DataTableColumnDef<CaseData, string | number>[];
  completedCasesColumns: DataTableColumnDef<CaseData, string | number>[];
  caseTableColumns: DataTableColumnDef<CaseData, string | number>[];
  // Handler props
  onPaneOpenChange: (open: boolean) => void;
  onSelectedMemberChange: (member: string | null) => void;
  onSelectedTabIndexChange: (index: number) => void;
  onPaneTabIndexChange: (index: number) => void;
  onSortOrderChange: (order: "asc" | "desc") => void;
  onActiveDueDateFilterChange: (filter: DueDateFilter) => void;
  onActiveCaseTypeFilterChange: (filter: string) => void;
  onActiveStatusFilterChange: (filter: string) => void;
  onCaseStatusViewChange: (view: "status" | "type" | "dueDate" | "department") => void;
  // Personal performance用のハンドラー（2つのカードに分離）
  onPersonalMatterCountCaseTypeFilterChange: (filter: string) => void;
  onPersonalMatterCountDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onPersonalMatterCountViewModeChange: (mode: "graph" | "table") => void;
  onPersonalMatterCountViewTypeChange: (view: "dueDate" | "caseType" | "department") => void;
  onPersonalLeadTimeCaseTypeFilterChange: (filter: string) => void;
  onPersonalLeadTimeDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onPersonalLeadTimeViewModeChange: (mode: "graph" | "table") => void;
  onPersonalLeadTimePeriodViewChange: (view: "all" | "monthly") => void;
  onIsPersonalMatterCountFilterOpenChange: (open: boolean) => void;
  onIsPersonalLeadTimeFilterOpenChange: (open: boolean) => void;
  onAssignmentsChange: (assignments: Record<string, string>) => void;
  onShowEmptySubAssigneeChange: (show: boolean) => void;
  onSubAssignmentsChange: (assignments: Record<string, string>) => void;
  onPaneStatusFilterChange: (filter: string) => void;
  onPaneCaseTypeFilterChange: (filter: string) => void;
  onPaneDueDateFilterChange: (filter: DueDateFilter) => void;
  onPanePerformanceDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onPaneContextChange: (
    context:
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
      | null,
  ) => void;
  // パフォーマンス概要カード用のハンドラー
  onPerformanceOverviewCaseTypeFilterChange: (filter: string) => void;
  onPerformanceOverviewAssigneeFilterModeChange: (mode: AssigneeFilterMode) => void;
  onPerformanceOverviewViewModeChange: (mode: "graph" | "table") => void;
  onIsPerformanceOverviewFilterOpenChange: (open: boolean) => void;
  onLeadTimePerformanceSortTypeChange: (type: "caseCount" | "name") => void;
  onLeadTimePerformanceSortOrderChange: (order: "asc" | "desc") => void;
  onPerformanceOverviewDueDateFilterChange: (filter: DueDateFilter) => void;
  onPerformanceOverviewDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  // リードタイム内訳カード用のハンドラー
  onLeadTimeCompositionCaseTypeFilterChange: (filter: string) => void;
  onLeadTimeCompositionAssigneeFilterModeChange: (mode: AssigneeFilterMode) => void;
  onLeadTimeCompositionViewModeChange: (mode: "graph" | "table") => void;
  onLeadTimeCompositionGraphModeChange: (mode: "grouped" | "detailed") => void;
  onIsLeadTimeCompositionFilterOpenChange: (open: boolean) => void;
  onLeadTimeCompositionSortTypeChange: (type: "caseCount" | "name") => void;
  onLeadTimeCompositionSortOrderChange: (order: "asc" | "desc") => void;
  onLeadTimeCategoriesChange: (categories: LeadTimeCategories) => void;
  onIsStatusSettingsOpenChange: (open: boolean) => void;
  onAssigneeFilterModeChange: (mode: AssigneeFilterMode) => void;
  onIsFilterOpenChange: (open: boolean) => void;
  onIsPaneFilterOpenChange: (open: boolean) => void;
  onTeamCaseViewModeChange: (mode: "graph" | "table") => void;
  onExperienceViewModeChange: (mode: "graph" | "table") => void;
  onHandleSaveCategories: (categories: LeadTimeCategories) => void;
  onHandleBarClickBase: (
    data: { name?: string },
    filterType: "status" | "caseType" | "dueDate",
    filterValue: string,
  ) => void;
  // 案件数グラフ用のprops
  caseCountViewMode: "graph" | "table";
  caseCountViewType: "dueDate" | "caseType" | "department";
  caseCountPeriodView: "all" | "monthly";
  caseCountVisibleMetrics: { 新規案件数: boolean };
  caseCountShowPreviousYear: boolean;
  caseCountCaseTypeFilter: string;
  isCaseCountFilterOpen: boolean;
  caseCountByCaseTypeOverallPerformanceData: Array<Record<string, number | string>>;
  caseCountByCaseTypeMergedPerformanceData: Array<Record<string, number | string>>;
  caseCountAllPeriodByCaseTypeData: Record<
    string,
    {
      新規案件数: number;
      完了案件数: number;
    }
  >;
  caseCountAllPeriodByCaseTypePreviousYearData: Record<
    string,
    {
      新規案件数: number;
      完了案件数: number;
    }
  >;
  onCaseCountViewModeChange: (mode: "graph" | "table") => void;
  onCaseCountViewTypeChange: (viewType: "dueDate" | "caseType" | "department") => void;
  onCaseCountPeriodViewChange: (view: "all" | "monthly") => void;
  onCaseCountShowPreviousYearChange: (show: boolean) => void;
  onCaseCountCaseTypeFilterChange: (filter: string) => void;
  onIsCaseCountFilterOpenChange: (open: boolean) => void;
  // 2つ目の案件数グラフ用のprops
  caseCount2ViewMode: "graph" | "table";
  caseCount2ViewType: "dueDate" | "caseType" | "department";
  caseCount2PeriodView: "all" | "monthly";
  caseCount2VisibleMetrics: { 新規案件数: boolean; 完了案件数: boolean };
  caseCount2ShowPreviousYear: boolean;
  caseCount2CaseTypeFilter: string;
  isCaseCount2FilterOpen: boolean;
  caseCount2OverallPerformanceData: Array<{
    name: string;
    新規案件数: number;
    onTimeCompletionCount: number;
    overdueCompletionCount: number;
    noDueDateCompletionCount: number;
    リードタイム中央値: number;
    初回返信速度中央値: number;
  }>;
  caseCount2MergedPerformanceData: Array<{
    name: string;
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
  }>;
  caseCount2ByCaseTypeOverallPerformanceData: Array<Record<string, number | string>>;
  caseCount2ByCaseTypeMergedPerformanceData: Array<Record<string, number | string>>;
  caseCount2AllPeriodData: {
    新規案件数: number;
    onTimeCompletionCount: number;
    overdueCompletionCount: number;
    noDueDateCompletionCount: number;
  };
  caseCount2AllPeriodPreviousYearData: {
    新規案件数: number;
    onTimeCompletionCount: number;
    overdueCompletionCount: number;
    noDueDateCompletionCount: number;
  };
  caseCount2AllPeriodByCaseTypeData: Record<
    string,
    {
      新規案件数: number;
      完了案件数: number;
    }
  >;
  caseCount2AllPeriodByCaseTypePreviousYearData: Record<
    string,
    {
      新規案件数: number;
      完了案件数: number;
    }
  >;
  onCaseCount2ViewModeChange: (mode: "graph" | "table") => void;
  onCaseCount2ViewTypeChange: (type: "dueDate" | "caseType" | "department") => void;
  onCaseCount2PeriodViewChange: (view: "all" | "monthly") => void;
  onCaseCount2ShowPreviousYearChange: (show: boolean) => void;
  onCaseCount2CaseTypeFilterChange: (filter: string) => void;
  onIsCaseCount2FilterOpenChange: (open: boolean) => void;
  // リードタイムグラフ用のprops
  leadTimeGraphViewMode: "graph" | "table";
  leadTimeVisibleMetrics: { リードタイム中央値: boolean; 初回返信速度中央値: boolean };
  leadTimeShowPreviousYear: boolean;
  leadTimeCaseTypeFilter: string;
  isLeadTimeGraphFilterOpen: boolean;
  leadTimeOverallPerformanceData: Array<{
    name: string;
    新規案件数: number;
    onTimeCompletionCount: number;
    overdueCompletionCount: number;
    noDueDateCompletionCount: number;
    リードタイム中央値: number;
    初回返信速度中央値: number;
  }>;
  leadTimeMergedPerformanceData: Array<{
    name: string;
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
  }>;
  leadTimeAllPeriodData: {
    リードタイム中央値: number;
    初回返信速度中央値: number;
    リードタイム中央値_昨年?: number;
    初回返信速度中央値_昨年?: number;
  };
  onLeadTimeGraphViewModeChange: (mode: "graph" | "table") => void;
  onLeadTimeVisibleMetricsChange: (metrics: { リードタイム中央値: boolean; 初回返信速度中央値: boolean }) => void;
  onLeadTimeShowPreviousYearChange: (show: boolean) => void;
  onLeadTimeCaseTypeFilterChange: (filter: string) => void;
  onIsLeadTimeGraphFilterOpenChange: (open: boolean) => void;
}

export function Presentation(props: PresentationProps) {
  const {
    selectedMember,
    selectedTabIndex,
    paneTabIndex,
    sortOrder,
    teamCaseSortType,
    onTeamCaseSortTypeChange,
    activeDueDateFilter,
    activeCaseTypeFilter,
    activeStatusFilter,
    caseStatusView,
    assignments,
    localizedTeamMembers,
    performanceDateRange,
    showEmptySubAssignee,
    paneStatusFilter,
    paneCaseTypeFilter,
    paneDueDateFilter,
    panePerformanceDateRange,
    paneContext,
    // Personal performance用のprops（2つのカードに分離）
    personalMatterCountCaseTypeFilter,
    personalMatterCountDateRange,
    personalMatterCountViewMode,
    personalMatterCountViewType,
    personalLeadTimeCaseTypeFilter,
    personalLeadTimeDateRange,
    personalLeadTimeViewMode,
    personalLeadTimePeriodView,
    isPersonalMatterCountFilterOpen,
    isPersonalLeadTimeFilterOpen,
    // パフォーマンス概要カード用のprops
    performanceOverviewCaseTypeFilter,
    performanceOverviewAssigneeFilterMode,
    performanceOverviewViewMode,
    isPerformanceOverviewFilterOpen,
    performanceOverviewBreakdownView,
    onPerformanceOverviewBreakdownViewChange,
    leadTimePerformanceSortType,
    leadTimePerformanceSortOrder,
    performanceOverviewDueDateFilter,
    performanceOverviewDateRange,
    onPerformanceOverviewCaseTypeFilterChange,
    onPerformanceOverviewAssigneeFilterModeChange,
    onPerformanceOverviewViewModeChange,
    onIsPerformanceOverviewFilterOpenChange,
    onLeadTimePerformanceSortTypeChange,
    onLeadTimePerformanceSortOrderChange,
    onPerformanceOverviewDueDateFilterChange,
    onPerformanceOverviewDateRangeChange,
    // リードタイム内訳カード用のprops
    leadTimeCompositionCaseTypeFilter,
    leadTimeCompositionAssigneeFilterMode,
    leadTimeCompositionViewMode,
    leadTimeCompositionGraphMode,
    isLeadTimeCompositionFilterOpen,
    leadTimeCompositionSortType,
    leadTimeCompositionSortOrder,
    onLeadTimeCompositionCaseTypeFilterChange,
    onLeadTimeCompositionAssigneeFilterModeChange,
    onLeadTimeCompositionViewModeChange,
    onLeadTimeCompositionGraphModeChange,
    onIsLeadTimeCompositionFilterOpenChange,
    onLeadTimeCompositionSortTypeChange,
    onLeadTimeCompositionSortOrderChange,
    leadTimeCategories,
    isStatusSettingsOpen,
    assigneeFilterMode,
    isFilterOpen,
    isPaneFilterOpen,
    teamCaseViewMode,
    experienceViewMode,
    selectedMemberMainCases,
    selectedMemberSubCases,
    membersWithOverdueCases,
    unassignedCasesCount,
    unassignedSubAssigneeCasesCount,
    allUnassignedCases,
    allUnassignedSubAssigneeCases,
    overallPerformanceData: _overallPerformanceData,
    personalMatterCountData,
    personalMatterCountByCaseTypeData,
    personalMatterCountAllPeriodData,
    personalMatterCountAllPeriodByCaseTypeData,
    personalMatterCountPeriodView,
    onPersonalMatterCountPeriodViewChange,
    personalLeadTimeData,
    personalLeadTimeAllPeriodData,
    dueDateSummary,
    tenantStatusSeriesForTeamBreakdown,
    chartData,
    teamStatusColumns,
    leadTimeCompositionData,
    workloadMemberPerformanceData,
    workloadMemberPerformanceByCaseTypeData,
    maxCaseCount,
    mainExperienceCompletedCases,
    subExperienceCompletedCases,
    mainExperienceCaseTypeCounts,
    subExperienceCaseTypeCounts,
    statusDurationDetailCases,
    durationBucketDetailCases,
    unassignedCasesColumns,
    caseTypeCountColumns,
    mainAssignmentTableColumns,
    subAssignmentTableColumns,
    completedCasesColumns,
    caseTableColumns,
    onPaneOpenChange,
    onSelectedMemberChange,
    onSelectedTabIndexChange,
    onPaneTabIndexChange,
    onSortOrderChange,
    onActiveDueDateFilterChange,
    onActiveCaseTypeFilterChange,
    onActiveStatusFilterChange,
    onCaseStatusViewChange,
    onAssignmentsChange,
    onShowEmptySubAssigneeChange,
    onPaneStatusFilterChange,
    onPaneCaseTypeFilterChange,
    onPaneDueDateFilterChange,
    onPanePerformanceDateRangeChange,
    onPaneContextChange,
    // WorkloadTab用のフィルター
    workloadSelectedMembers,
    workloadDateRange,
    onWorkloadSelectedMembersChange,
    onWorkloadDateRangeChange,
    onWorkloadDateRangeReset,
    // TimeTab用のフィルター
    timeSelectedMembers,
    timeDateRange,
    onTimeSelectedMembersChange,
    onTimeDateRangeChange,
    onTimeDateRangeReset,
    // CasesTab用のフィルター
    casesSelectedMembers,
    onCasesSelectedMembersChange,
    onCasesSelectedMembersReset,
    onIsStatusSettingsOpenChange,
    onAssigneeFilterModeChange,
    onIsFilterOpenChange,
    onIsPaneFilterOpenChange,
    onTeamCaseViewModeChange,
    onPersonalMatterCountCaseTypeFilterChange,
    onPersonalMatterCountDateRangeChange,
    onPersonalMatterCountViewModeChange,
    onPersonalMatterCountViewTypeChange,
    onPersonalLeadTimeCaseTypeFilterChange,
    onPersonalLeadTimeDateRangeChange,
    onPersonalLeadTimeViewModeChange,
    onPersonalLeadTimePeriodViewChange,
    onIsPersonalMatterCountFilterOpenChange,
    onIsPersonalLeadTimeFilterOpenChange,
    onExperienceViewModeChange,
    onHandleSaveCategories,
    onHandleBarClickBase,
    // 案件数グラフ用のprops
    caseCountViewMode,
    caseCountViewType,
    caseCountPeriodView,
    caseCountVisibleMetrics,
    caseCountShowPreviousYear,
    caseCountCaseTypeFilter,
    isCaseCountFilterOpen,
    workloadCaseCountByCaseTypeOverallPerformanceData,
    workloadCaseCountByCaseTypeMergedPerformanceData,
    workloadCaseCountAllPeriodByCaseTypeData,
    workloadCaseCountAllPeriodByCaseTypePreviousYearData,
    onCaseCountViewModeChange,
    onCaseCountViewTypeChange,
    onCaseCountPeriodViewChange,
    onCaseCountShowPreviousYearChange,
    onCaseCountCaseTypeFilterChange,
    onIsCaseCountFilterOpenChange,
    // 2つ目の案件数グラフ用のprops
    caseCount2ViewMode,
    caseCount2ViewType,
    caseCount2PeriodView,
    caseCount2VisibleMetrics,
    caseCount2ShowPreviousYear,
    caseCount2CaseTypeFilter,
    isCaseCount2FilterOpen,
    workloadCaseCount2OverallPerformanceData,
    workloadCaseCount2MergedPerformanceData,
    workloadCaseCount2ByCaseTypeOverallPerformanceData,
    workloadCaseCount2ByCaseTypeMergedPerformanceData,
    workloadCaseCount2AllPeriodData,
    workloadCaseCount2AllPeriodPreviousYearData,
    workloadCaseCount2AllPeriodByCaseTypeData,
    workloadCaseCount2AllPeriodByCaseTypePreviousYearData,
    onCaseCount2ViewModeChange,
    onCaseCount2ViewTypeChange,
    onCaseCount2PeriodViewChange,
    onCaseCount2ShowPreviousYearChange,
    onCaseCount2CaseTypeFilterChange,
    onIsCaseCount2FilterOpenChange,
    // リードタイムグラフ用のprops
    leadTimeGraphViewMode,
    leadTimeVisibleMetrics,
    leadTimeShowPreviousYear,
    leadTimeCaseTypeFilter,
    isLeadTimeGraphFilterOpen,
    leadTimeOverallPerformanceData,
    leadTimeMergedPerformanceData,
    leadTimeAllPeriodData,
    onLeadTimeGraphViewModeChange,
    onLeadTimeVisibleMetricsChange,
    onLeadTimeShowPreviousYearChange,
    onLeadTimeCaseTypeFilterChange,
    onIsLeadTimeGraphFilterOpenChange,
  } = props;

  // TODO: Move all JSX from TeamMembers.tsx return statement here
  // This is a placeholder - the full JSX will be migrated in the next step
  const { t } = useTranslation(reportTranslations);
  const [_isInfoPopoverOpen, _setIsInfoPopoverOpen] = useState(false);
  const [_isInfoPopoverPinned, _setIsInfoPopoverPinned] = useState(false);
  const [_isDistributionInfoPopoverOpen, _setIsDistributionInfoPopoverOpen] = useState(false);
  const [_isDistributionInfoPopoverPinned, _setIsDistributionInfoPopoverPinned] = useState(false);
  const [_isMemberInfoPopoverOpen, _setIsMemberInfoPopoverOpen] = useState(false);
  const [_isMemberInfoPopoverPinned, _setIsMemberInfoPopoverPinned] = useState(false);
  const [_isMemberSortMenuOpen, _setIsMemberSortMenuOpen] = useState(false);
  const { locale } = useLocale();
  const [isUnassignedCasesDrawerOpen, setIsUnassignedCasesDrawerOpen] = useState(false);
  const [unassignedCasesViewMode, setUnassignedCasesViewMode] = useState<"table" | "card">("table");
  // biome-ignore lint/style/noNonNullAssertion: Drawer component requires non-null RefObject
  const drawerRoot = useRef<HTMLDivElement>(null!);

  // 日付をロケールに応じてフォーマットする関数
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

  // StatusLabel用の色マッピング
  const getStatusLabelColor = (status: string): "neutral" | "red" | "yellow" | "blue" | "teal" | "gray" => {
    const statusColorMap: Record<string, "neutral" | "red" | "yellow" | "blue" | "teal" | "gray"> = {
      // 日本語
      未着手: "gray",
      確認中: "blue",
      "2次確認中": "teal",
      自部門外確認中: "yellow",
      完了: "gray",
      // 英語
      "Not started": "gray",
      "In review": "blue",
      "Secondary review": "teal",
      "External review": "yellow",
      Completed: "gray",
    };
    return statusColorMap[status] || "neutral";
  };

  // メンバー別テーブルビュー用の列定義（将来使用予定）
  // @ts-expect-error - 将来使用予定のため未使用変数として許可
  const _memberPerformanceTableColumns = useMemo(() => {
    const columns: DataTableColumnDef<MemberPerformanceData, string | number>[] = [
      {
        id: "name",
        name: t("member"),
        getValue: (row) => row.name,
        renderCell: (info) => (
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
                  onSelectedMemberChange(info.row.name);
                  onPaneOpenChange(true);
                }}
              >
                {t("open")}
              </Button>
            }
          >
            <Text variant="body.medium">{info.row.name}</Text>
          </DataTableCell>
        ),
      },
    ];

    // 合計数を計算する関数
    const calculateTotal = (row: MemberPerformanceData, mode: "main" | "sub"): number => {
      if (performanceOverviewAssigneeFilterMode === "both") {
        if (mode === "main") {
          return (
            (row.onTimeCompletionCount_main ?? 0) +
            (row.overdueCompletionCount_main ?? 0) +
            (row.noDueDateCompletionCount_main ?? 0)
          );
        }
        return (
          (row.onTimeCompletionCount_sub ?? 0) +
          (row.overdueCompletionCount_sub ?? 0) +
          (row.noDueDateCompletionCount_sub ?? 0)
        );
      }
      // performanceOverviewAssigneeFilterMode === "main" または "sub" の時
      return (row.onTimeCompletionCount ?? 0) + (row.overdueCompletionCount ?? 0) + (row.noDueDateCompletionCount ?? 0);
    };

    // 合計数カラム（常に主担当のみ）
    const totalCol: DataTableColumnDef<MemberPerformanceData, string | number> = {
      id: "total",
      name: `${t("total")}(${t("mainRole")})`,
      getValue: (row) => calculateTotal(row, "main"),
      renderCell: (info) => (
        <DataTableCell>
          <Text variant="body.medium">{info.value}</Text>
        </DataTableCell>
      ),
    };

    // 副担当案件数カラム（performanceOverviewAssigneeFilterMode === "both"の時のみ表示）
    const subAssigneeCaseCountCol: DataTableColumnDef<MemberPerformanceData, string | number> | null =
      performanceOverviewAssigneeFilterMode === "both"
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

    if (performanceOverviewAssigneeFilterMode === "both") {
      // 主担当と副担当を別々に表示
      columns.push(totalCol);
      if (subAssigneeCaseCountCol) {
        columns.push(subAssigneeCaseCountCol);
      }
      columns.push(
        {
          id: "onTimeCompletionCount_main",
          name: t("onTimeCompletionMain"),
          getValue: (row) => row.onTimeCompletionCount_main ?? 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
        {
          id: "overdueCompletionCount_main",
          name: t("overdueCompletionMain"),
          getValue: (row) => row.overdueCompletionCount_main ?? 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
        {
          id: "noDueDateCompletionCount_main",
          name: t("noDueDateCompletionMain"),
          getValue: (row) => row.noDueDateCompletionCount_main ?? 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
        {
          id: "onTimeCompletionCount_sub",
          name: t("onTimeCompletionSub"),
          getValue: (row) => row.onTimeCompletionCount_sub ?? 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
        {
          id: "overdueCompletionCount_sub",
          name: t("overdueCompletionSub"),
          getValue: (row) => row.overdueCompletionCount_sub ?? 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
        {
          id: "noDueDateCompletionCount_sub",
          name: t("noDueDateCompletionSub"),
          getValue: (row) => row.noDueDateCompletionCount_sub ?? 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
      );
    } else {
      // 合計のみ表示
      columns.push(totalCol);
      columns.push(
        {
          id: "onTimeCompletionCount",
          name: t("onTimeCompletion"),
          getValue: (row) => row.onTimeCompletionCount,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
        {
          id: "overdueCompletionCount",
          name: t("overdueCompletion"),
          getValue: (row) => row.overdueCompletionCount,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
        {
          id: "noDueDateCompletionCount",
          name: t("noDueDateCompletion"),
          getValue: (row) => row.noDueDateCompletionCount,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        },
      );
    }

    // 初回返信速度中央値
    columns.push({
      id: "medianFirstReplyTime",
      name: t("firstResponseMedianShort"),
      getValue: (row) => row.medianFirstReplyTime,
      renderCell: (info) => {
        const value = typeof info.value === "number" ? info.value : 0;
        return (
          <DataTableCell>
            <Text variant="body.small">{value > 0 ? value.toFixed(1) : "-"}</Text>
          </DataTableCell>
        );
      },
    });

    return columns;
  }, [performanceOverviewAssigneeFilterMode, t, onPaneOpenChange, onSelectedMemberChange]);

  // リードタイム内訳のテーブル列定義（将来使用予定）
  // @ts-expect-error - 将来使用予定のため未使用変数として許可
  const _leadTimeCompositionTableColumns = useMemo(() => {
    const columns: DataTableColumnDef<LeadTimeCompositionData, string | number>[] = [
      {
        id: "name",
        name: t("member"),
        getValue: (row) => row.name,
        renderCell: (info) => (
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
                  onSelectedMemberChange(info.row.name);
                  onPaneOpenChange(true);
                }}
              >
                {t("open")}
              </Button>
            }
          >
            <Text variant="body.medium">{info.row.name}</Text>
          </DataTableCell>
        ),
      },
    ];

    // 合計数を計算する関数
    const calculateTotal = (row: LeadTimeCompositionData, mode: "main" | "sub"): number => {
      if (mode === "main") {
        return (row.main_idle || 0) + (row.main_work || 0) + (row.main_wait || 0);
      }
      return (row.sub_work || 0) + (row.sub_wait || 0);
    };

    // 合計数カラム（常に主担当のみ）
    const totalCol: DataTableColumnDef<LeadTimeCompositionData, string | number> = {
      id: "total",
      name: `${t("total")}(${t("mainRole")})`,
      getValue: (row) => calculateTotal(row, "main"),
      renderCell: (info) => {
        const value = typeof info.value === "number" ? info.value : 0;
        return (
          <DataTableCell>
            <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
          </DataTableCell>
        );
      },
    };

    // 副担当案件数カラム（leadTimeCompositionAssigneeFilterMode === "both"の時のみ表示）
    const subAssigneeCaseCountCol: DataTableColumnDef<LeadTimeCompositionData, string | number> | null =
      leadTimeCompositionAssigneeFilterMode === "both"
        ? {
            id: "subAssigneeCaseCount",
            name: `${t("total")}(${t("subRole")})`,
            getValue: (row) => calculateTotal(row, "sub"),
            renderCell: (info) => {
              const value = typeof info.value === "number" ? info.value : 0;
              return (
                <DataTableCell>
                  <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
                </DataTableCell>
              );
            },
          }
        : null;

    if (leadTimeCompositionAssigneeFilterMode === "both") {
      // 主担当と副担当を別々に表示
      columns.push(totalCol);
      if (subAssigneeCaseCountCol) {
        columns.push(subAssigneeCaseCountCol);
      }
      columns.push(
        {
          id: "main_idle",
          name: t("idleMain"),
          getValue: (row) => row.main_idle,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "main_work",
          name: t("workMain"),
          getValue: (row) => row.main_work,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "main_wait",
          name: t("waitMain"),
          getValue: (row) => row.main_wait,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "sub_work",
          name: t("workSub"),
          getValue: (row) => row.sub_work,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "sub_wait",
          name: t("waitSub"),
          getValue: (row) => row.sub_wait,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
      );
    } else if (leadTimeCompositionAssigneeFilterMode === "main") {
      // 主担当のみ表示
      columns.push(totalCol);
      columns.push(
        {
          id: "main_idle",
          name: t("idleMain"),
          getValue: (row) => row.main_idle,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "main_work",
          name: t("workMain"),
          getValue: (row) => row.main_work,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "main_wait",
          name: t("waitMain"),
          getValue: (row) => row.main_wait,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
      );
    } else {
      // 副担当のみ表示
      if (subAssigneeCaseCountCol) {
        columns.push(subAssigneeCaseCountCol);
      }
      columns.push(
        {
          id: "sub_work",
          name: t("workSub"),
          getValue: (row) => row.sub_work,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
        {
          id: "sub_wait",
          name: t("waitSub"),
          getValue: (row) => row.sub_wait,
          renderCell: (info) => {
            const value = typeof info.value === "number" ? info.value : 0;
            return (
              <DataTableCell>
                <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
              </DataTableCell>
            );
          },
        },
      );
    }

    // 初回返信速度中央値
    columns.push({
      id: "medianFirstReplyTime",
      name: t("firstResponseMedianShort"),
      getValue: (row) => row.medianFirstReplyTime,
      renderCell: (info) => {
        const value = typeof info.value === "number" ? info.value : 0;
        return (
          <DataTableCell>
            <Text variant="body.medium">{value > 0 ? value.toFixed(1) : "-"}</Text>
          </DataTableCell>
        );
      },
    });

    return columns;
  }, [leadTimeCompositionAssigneeFilterMode, t, onSelectedMemberChange, onPaneOpenChange]);

  return (
    <>
      <PageLayout.Content minWidth="xSmall">
        <PageLayout.Header>
          <ContentHeader trailing={<LanguageToggle />}>
            <ContentHeader.Title>{t("pageTitle")}</ContentHeader.Title>
          </ContentHeader>
        </PageLayout.Header>
        <PageLayout.Body>
          <Tab.Group
            size="medium"
            index={selectedTabIndex}
            onChange={(index) => {
              onSelectedTabIndexChange(index);
              onPaneOpenChange(false);
              onSelectedMemberChange(null);
              onPaneStatusFilterChange("すべて");
              onPaneCaseTypeFilterChange("すべて");
              onPersonalMatterCountCaseTypeFilterChange("すべて");
              onPersonalLeadTimeCaseTypeFilterChange("すべて");
              onPaneDueDateFilterChange("すべて");
              onPaneContextChange(null);
            }}
          >
            <Toolbar>
              <Tab.List bordered={false}>
                <Tab>{t("workload")}</Tab>
                <Tab>{t("time")}</Tab>
                <Tab>{t("ongoing")}</Tab>
              </Tab.List>
              <Toolbar.Spacer />
            </Toolbar>
            <Tab.Panels>
              <Tab.Panel>
                <WorkloadTab
                  caseCountViewMode={caseCountViewMode}
                  caseCountViewType={caseCountViewType}
                  caseCountPeriodView={caseCountPeriodView}
                  caseCountVisibleMetrics={caseCountVisibleMetrics}
                  caseCountShowPreviousYear={caseCountShowPreviousYear}
                  caseCountCaseTypeFilter={caseCountCaseTypeFilter}
                  isCaseCountFilterOpen={isCaseCountFilterOpen}
                  caseCountByCaseTypeOverallPerformanceData={workloadCaseCountByCaseTypeOverallPerformanceData}
                  caseCountByCaseTypeMergedPerformanceData={workloadCaseCountByCaseTypeMergedPerformanceData}
                  caseCountAllPeriodByCaseTypeData={workloadCaseCountAllPeriodByCaseTypeData}
                  caseCountAllPeriodByCaseTypePreviousYearData={workloadCaseCountAllPeriodByCaseTypePreviousYearData}
                  caseCount2ViewMode={caseCount2ViewMode}
                  caseCount2ViewType={caseCount2ViewType}
                  caseCount2PeriodView={caseCount2PeriodView}
                  caseCount2VisibleMetrics={caseCount2VisibleMetrics}
                  caseCount2ShowPreviousYear={caseCount2ShowPreviousYear}
                  caseCount2CaseTypeFilter={caseCount2CaseTypeFilter}
                  isCaseCount2FilterOpen={isCaseCount2FilterOpen}
                  caseCount2OverallPerformanceData={workloadCaseCount2OverallPerformanceData}
                  caseCount2MergedPerformanceData={workloadCaseCount2MergedPerformanceData}
                  caseCount2ByCaseTypeOverallPerformanceData={workloadCaseCount2ByCaseTypeOverallPerformanceData}
                  caseCount2ByCaseTypeMergedPerformanceData={workloadCaseCount2ByCaseTypeMergedPerformanceData}
                  caseCount2AllPeriodData={workloadCaseCount2AllPeriodData}
                  caseCount2AllPeriodPreviousYearData={workloadCaseCount2AllPeriodPreviousYearData}
                  caseCount2AllPeriodByCaseTypeData={workloadCaseCount2AllPeriodByCaseTypeData}
                  caseCount2AllPeriodByCaseTypePreviousYearData={workloadCaseCount2AllPeriodByCaseTypePreviousYearData}
                  performanceOverviewCaseTypeFilter={performanceOverviewCaseTypeFilter}
                  performanceOverviewAssigneeFilterMode={performanceOverviewAssigneeFilterMode}
                  performanceOverviewViewMode={performanceOverviewViewMode}
                  isPerformanceOverviewFilterOpen={isPerformanceOverviewFilterOpen}
                  performanceOverviewBreakdownView={performanceOverviewBreakdownView}
                  leadTimePerformanceSortType={leadTimePerformanceSortType}
                  leadTimePerformanceSortOrder={leadTimePerformanceSortOrder}
                  performanceOverviewDueDateFilter={performanceOverviewDueDateFilter}
                  performanceOverviewDateRange={performanceOverviewDateRange}
                  memberPerformanceData={workloadMemberPerformanceData}
                  memberPerformanceByCaseTypeData={workloadMemberPerformanceByCaseTypeData}
                  performanceDateRange={workloadDateRange}
                  onCaseCountViewModeChange={onCaseCountViewModeChange}
                  onCaseCountViewTypeChange={onCaseCountViewTypeChange}
                  onCaseCountPeriodViewChange={onCaseCountPeriodViewChange}
                  onCaseCountShowPreviousYearChange={onCaseCountShowPreviousYearChange}
                  onCaseCountCaseTypeFilterChange={onCaseCountCaseTypeFilterChange}
                  onIsCaseCountFilterOpenChange={onIsCaseCountFilterOpenChange}
                  onCaseCount2ViewModeChange={onCaseCount2ViewModeChange}
                  onCaseCount2ViewTypeChange={onCaseCount2ViewTypeChange}
                  onCaseCount2PeriodViewChange={onCaseCount2PeriodViewChange}
                  onCaseCount2ShowPreviousYearChange={onCaseCount2ShowPreviousYearChange}
                  onCaseCount2CaseTypeFilterChange={onCaseCount2CaseTypeFilterChange}
                  onIsCaseCount2FilterOpenChange={onIsCaseCount2FilterOpenChange}
                  onPerformanceOverviewBreakdownViewChange={onPerformanceOverviewBreakdownViewChange}
                  onPerformanceOverviewCaseTypeFilterChange={onPerformanceOverviewCaseTypeFilterChange}
                  onPerformanceOverviewAssigneeFilterModeChange={onPerformanceOverviewAssigneeFilterModeChange}
                  onPerformanceOverviewViewModeChange={onPerformanceOverviewViewModeChange}
                  onIsPerformanceOverviewFilterOpenChange={onIsPerformanceOverviewFilterOpenChange}
                  onLeadTimePerformanceSortTypeChange={onLeadTimePerformanceSortTypeChange}
                  onLeadTimePerformanceSortOrderChange={onLeadTimePerformanceSortOrderChange}
                  onPerformanceOverviewDueDateFilterChange={onPerformanceOverviewDueDateFilterChange}
                  onPerformanceOverviewDateRangeChange={onPerformanceOverviewDateRangeChange}
                  onPaneOpenChange={onPaneOpenChange}
                  onSelectedMemberChange={onSelectedMemberChange}
                  onPaneTabIndexChange={onPaneTabIndexChange}
                  onPanePerformanceDateRangeChange={onPanePerformanceDateRangeChange}
                  activeCaseTypeFilter={activeCaseTypeFilter}
                  activeDueDateFilter={activeDueDateFilter}
                  activeStatusFilter={activeStatusFilter}
                  membersWithOverdueCases={membersWithOverdueCases}
                  onPaneCaseTypeFilterChange={onPaneCaseTypeFilterChange}
                  onPaneDueDateFilterChange={onPaneDueDateFilterChange}
                  onPaneStatusFilterChange={onPaneStatusFilterChange}
                  workloadSelectedMembers={workloadSelectedMembers}
                  workloadDateRange={workloadDateRange}
                  onWorkloadSelectedMembersChange={onWorkloadSelectedMembersChange}
                  onWorkloadDateRangeChange={onWorkloadDateRangeChange}
                  onWorkloadDateRangeReset={onWorkloadDateRangeReset}
                />
              </Tab.Panel>
              <Tab.Panel>
                <TimeTab
                  leadTimeGraphViewMode={leadTimeGraphViewMode}
                  leadTimeVisibleMetrics={leadTimeVisibleMetrics}
                  leadTimeShowPreviousYear={leadTimeShowPreviousYear}
                  leadTimeCaseTypeFilter={leadTimeCaseTypeFilter}
                  isLeadTimeGraphFilterOpen={isLeadTimeGraphFilterOpen}
                  leadTimeOverallPerformanceData={leadTimeOverallPerformanceData}
                  leadTimeMergedPerformanceData={leadTimeMergedPerformanceData}
                  leadTimeAllPeriodData={leadTimeAllPeriodData}
                  leadTimeCompositionCaseTypeFilter={leadTimeCompositionCaseTypeFilter}
                  leadTimeCompositionAssigneeFilterMode={leadTimeCompositionAssigneeFilterMode}
                  leadTimeCompositionViewMode={leadTimeCompositionViewMode}
                  leadTimeCompositionGraphMode={leadTimeCompositionGraphMode}
                  isLeadTimeCompositionFilterOpen={isLeadTimeCompositionFilterOpen}
                  leadTimeCompositionSortType={leadTimeCompositionSortType}
                  leadTimeCompositionSortOrder={leadTimeCompositionSortOrder}
                  leadTimeCategories={leadTimeCategories}
                  isStatusSettingsOpen={isStatusSettingsOpen}
                  leadTimeCompositionData={leadTimeCompositionData}
                  performanceDateRange={performanceDateRange}
                  onLeadTimeGraphViewModeChange={onLeadTimeGraphViewModeChange}
                  onLeadTimeVisibleMetricsChange={onLeadTimeVisibleMetricsChange}
                  onLeadTimeShowPreviousYearChange={onLeadTimeShowPreviousYearChange}
                  onLeadTimeCaseTypeFilterChange={onLeadTimeCaseTypeFilterChange}
                  onIsLeadTimeGraphFilterOpenChange={onIsLeadTimeGraphFilterOpenChange}
                  onLeadTimeCompositionCaseTypeFilterChange={onLeadTimeCompositionCaseTypeFilterChange}
                  onLeadTimeCompositionAssigneeFilterModeChange={onLeadTimeCompositionAssigneeFilterModeChange}
                  onLeadTimeCompositionViewModeChange={onLeadTimeCompositionViewModeChange}
                  onLeadTimeCompositionGraphModeChange={onLeadTimeCompositionGraphModeChange}
                  onIsLeadTimeCompositionFilterOpenChange={onIsLeadTimeCompositionFilterOpenChange}
                  onLeadTimeCompositionSortTypeChange={onLeadTimeCompositionSortTypeChange}
                  onLeadTimeCompositionSortOrderChange={onLeadTimeCompositionSortOrderChange}
                  onIsStatusSettingsOpenChange={onIsStatusSettingsOpenChange}
                  onHandleSaveCategories={onHandleSaveCategories}
                  onPaneOpenChange={onPaneOpenChange}
                  onSelectedMemberChange={onSelectedMemberChange}
                  onPaneTabIndexChange={onPaneTabIndexChange}
                  onPanePerformanceDateRangeChange={onPanePerformanceDateRangeChange}
                  activeCaseTypeFilter={activeCaseTypeFilter}
                  activeDueDateFilter={activeDueDateFilter}
                  activeStatusFilter={activeStatusFilter}
                  membersWithOverdueCases={membersWithOverdueCases}
                  tenantStatusSeriesForTeamBreakdown={tenantStatusSeriesForTeamBreakdown}
                  onPaneCaseTypeFilterChange={onPaneCaseTypeFilterChange}
                  onPaneDueDateFilterChange={onPaneDueDateFilterChange}
                  onPaneStatusFilterChange={onPaneStatusFilterChange}
                  timeSelectedMembers={timeSelectedMembers}
                  timeDateRange={timeDateRange}
                  onTimeSelectedMembersChange={onTimeSelectedMembersChange}
                  onTimeDateRangeChange={onTimeDateRangeChange}
                  onTimeDateRangeReset={onTimeDateRangeReset}
                />
              </Tab.Panel>
              <Tab.Panel>
                <CasesTab
                  sortOrder={sortOrder}
                  teamCaseSortType={teamCaseSortType}
                  onTeamCaseSortTypeChange={onTeamCaseSortTypeChange}
                  activeDueDateFilter={activeDueDateFilter}
                  activeCaseTypeFilter={activeCaseTypeFilter}
                  activeStatusFilter={activeStatusFilter}
                  caseStatusView={caseStatusView}
                  showEmptySubAssignee={showEmptySubAssignee}
                  assigneeFilterMode={assigneeFilterMode}
                  isFilterOpen={isFilterOpen}
                  teamCaseViewMode={teamCaseViewMode}
                  casesSelectedMembers={casesSelectedMembers}
                  onCasesSelectedMembersChange={onCasesSelectedMembersChange}
                  onCasesSelectedMembersReset={onCasesSelectedMembersReset}
                  unassignedCasesCount={unassignedCasesCount}
                  unassignedSubAssigneeCasesCount={unassignedSubAssigneeCasesCount}
                  onUnassignedCasesDrawerOpen={() => setIsUnassignedCasesDrawerOpen(true)}
                  dueDateSummary={dueDateSummary}
                  tenantStatusSeriesForTeamBreakdown={tenantStatusSeriesForTeamBreakdown}
                  chartData={chartData}
                  teamStatusColumns={teamStatusColumns}
                  maxCaseCount={maxCaseCount}
                  membersWithOverdueCases={membersWithOverdueCases}
                  unassignedCasesColumns={unassignedCasesColumns}
                  onSortOrderChange={onSortOrderChange}
                  onActiveDueDateFilterChange={onActiveDueDateFilterChange}
                  onActiveCaseTypeFilterChange={onActiveCaseTypeFilterChange}
                  onActiveStatusFilterChange={onActiveStatusFilterChange}
                  onCaseStatusViewChange={onCaseStatusViewChange}
                  onShowEmptySubAssigneeChange={onShowEmptySubAssigneeChange}
                  onAssigneeFilterModeChange={onAssigneeFilterModeChange}
                  onIsFilterOpenChange={onIsFilterOpenChange}
                  onTeamCaseViewModeChange={onTeamCaseViewModeChange}
                  onHandleBarClickBase={onHandleBarClickBase}
                  onPaneOpenChange={onPaneOpenChange}
                  onSelectedMemberChange={onSelectedMemberChange}
                  onPaneTabIndexChange={onPaneTabIndexChange}
                  onPaneCaseTypeFilterChange={onPaneCaseTypeFilterChange}
                  onPaneDueDateFilterChange={onPaneDueDateFilterChange}
                  onPaneStatusFilterChange={onPaneStatusFilterChange}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </PageLayout.Body>
      </PageLayout.Content>
      <MemberDetailPane
        selectedMember={selectedMember}
        paneTabIndex={paneTabIndex}
        paneContext={paneContext}
        paneStatusFilter={paneStatusFilter}
        paneCaseTypeFilter={paneCaseTypeFilter}
        paneDueDateFilter={paneDueDateFilter}
        experienceViewMode={experienceViewMode}
        memberPerformanceViewMode={performanceOverviewViewMode}
        onMemberPerformanceViewModeChange={onPerformanceOverviewViewModeChange}
        leadTimeViewMode="composition"
        onLeadTimeViewModeChange={() => {}}
        leadTimeAssigneeFilterMode={leadTimeCompositionAssigneeFilterMode}
        onLeadTimeAssigneeFilterModeChange={onLeadTimeCompositionAssigneeFilterModeChange}
        leadTimeCompositionSortType={leadTimeCompositionSortType}
        leadTimeCompositionSortOrder={leadTimeCompositionSortOrder}
        onLeadTimeCompositionSortTypeChange={onLeadTimeCompositionSortTypeChange}
        onExperienceViewModeChange={onExperienceViewModeChange}
        statusDurationDetailCases={statusDurationDetailCases}
        durationBucketDetailCases={durationBucketDetailCases}
        selectedMemberMainCases={selectedMemberMainCases}
        selectedMemberSubCases={selectedMemberSubCases}
        personalMatterCountData={personalMatterCountData}
        personalMatterCountByCaseTypeData={personalMatterCountByCaseTypeData}
        personalLeadTimeData={personalLeadTimeData}
        personalLeadTimeAllPeriodData={personalLeadTimeAllPeriodData}
        mainExperienceCompletedCases={mainExperienceCompletedCases}
        subExperienceCompletedCases={subExperienceCompletedCases}
        mainExperienceCaseTypeCounts={mainExperienceCaseTypeCounts}
        subExperienceCaseTypeCounts={subExperienceCaseTypeCounts}
        tenantStatusSeriesForTeamBreakdown={tenantStatusSeriesForTeamBreakdown}
        caseTableColumns={caseTableColumns}
        mainAssignmentTableColumns={mainAssignmentTableColumns}
        subAssignmentTableColumns={subAssignmentTableColumns}
        completedCasesColumns={completedCasesColumns}
        caseTypeCountColumns={caseTypeCountColumns}
        onPaneOpenChange={onPaneOpenChange}
        onSelectedMemberChange={onSelectedMemberChange}
        onPaneTabIndexChange={onPaneTabIndexChange}
        onPaneStatusFilterChange={onPaneStatusFilterChange}
        onPaneCaseTypeFilterChange={onPaneCaseTypeFilterChange}
        onPaneDueDateFilterChange={onPaneDueDateFilterChange}
        panePerformanceDateRange={panePerformanceDateRange}
        onPanePerformanceDateRangeChange={onPanePerformanceDateRangeChange}
        onPaneContextChange={onPaneContextChange}
        personalMatterCountCaseTypeFilter={personalMatterCountCaseTypeFilter}
        personalMatterCountDateRange={personalMatterCountDateRange}
        personalMatterCountViewMode={personalMatterCountViewMode}
        personalMatterCountViewType={personalMatterCountViewType}
        personalMatterCountAllPeriodData={personalMatterCountAllPeriodData}
        personalMatterCountAllPeriodByCaseTypeData={personalMatterCountAllPeriodByCaseTypeData}
        personalMatterCountPeriodView={personalMatterCountPeriodView}
        onPersonalMatterCountPeriodViewChange={onPersonalMatterCountPeriodViewChange}
        personalLeadTimeCaseTypeFilter={personalLeadTimeCaseTypeFilter}
        personalLeadTimeDateRange={personalLeadTimeDateRange}
        personalLeadTimeViewMode={personalLeadTimeViewMode}
        personalLeadTimePeriodView={personalLeadTimePeriodView}
        isPersonalMatterCountFilterOpen={isPersonalMatterCountFilterOpen}
        isPersonalLeadTimeFilterOpen={isPersonalLeadTimeFilterOpen}
        onPersonalMatterCountCaseTypeFilterChange={onPersonalMatterCountCaseTypeFilterChange}
        onPersonalMatterCountDateRangeChange={onPersonalMatterCountDateRangeChange}
        onPersonalMatterCountViewModeChange={onPersonalMatterCountViewModeChange}
        onPersonalMatterCountViewTypeChange={onPersonalMatterCountViewTypeChange}
        onPersonalLeadTimeCaseTypeFilterChange={onPersonalLeadTimeCaseTypeFilterChange}
        onPersonalLeadTimeDateRangeChange={onPersonalLeadTimeDateRangeChange}
        onPersonalLeadTimeViewModeChange={onPersonalLeadTimeViewModeChange}
        onPersonalLeadTimePeriodViewChange={onPersonalLeadTimePeriodViewChange}
        onIsPersonalMatterCountFilterOpenChange={onIsPersonalMatterCountFilterOpenChange}
        onIsPersonalLeadTimeFilterOpenChange={onIsPersonalLeadTimeFilterOpenChange}
        isPaneFilterOpen={isPaneFilterOpen}
        onIsPaneFilterOpenChange={onIsPaneFilterOpenChange}
      />
      {/* 未割り当て案件一覧のDrawer */}
      <div ref={drawerRoot} />
      <Drawer
        open={isUnassignedCasesDrawerOpen}
        onOpenChange={setIsUnassignedCasesDrawerOpen}
        position="end"
        width="large"
        root={drawerRoot}
        lockScroll={false}
      >
        <Drawer.Header>
          <ContentHeader
            trailing={
              <SegmentedControl
                size="small"
                index={unassignedCasesViewMode === "table" ? 0 : 1}
                onChange={(index) => setUnassignedCasesViewMode(index === 0 ? "table" : "card")}
              >
                <SegmentedControl.Button>{t("unassignedCasesViewModeTable")}</SegmentedControl.Button>
                <SegmentedControl.Button>{t("unassignedCasesViewModeCard")}</SegmentedControl.Button>
              </SegmentedControl>
            }
          >
            <ContentHeader.Title>{t("unassignedCases")}</ContentHeader.Title>
          </ContentHeader>
        </Drawer.Header>
        <Drawer.Body>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            <Checkbox checked={showEmptySubAssignee} onChange={(e) => onShowEmptySubAssigneeChange(e.target.checked)}>
              {t("showEmptySubAssignee")}
            </Checkbox>

            {unassignedCasesViewMode === "table" ? (
              <DataTable
                columns={unassignedCasesColumns}
                rows={
                  showEmptySubAssignee
                    ? [...allUnassignedCases, ...allUnassignedSubAssigneeCases].filter(
                        (caseItem, index, self) => index === self.findIndex((c) => c.caseName === caseItem.caseName),
                      )
                    : allUnassignedCases
                }
                getRowId={(row) => row.caseName}
                defaultColumnSizing={{
                  caseName: 320,
                  requester: 160,
                  requestingDepartment: 160,
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                {(showEmptySubAssignee
                  ? [...allUnassignedCases, ...allUnassignedSubAssigneeCases].filter(
                      (caseItem, index, self) => index === self.findIndex((c) => c.caseName === caseItem.caseName),
                    )
                  : allUnassignedCases
                ).map((caseItem) => {
                  const url = buildCaseDetailUrl(caseItem.caseId);
                  return (
                    <Card key={caseItem.caseName} variant="outline" size="small">
                      <CardHeader
                        leading={
                          <Icon>
                            <LfArchive />
                          </Icon>
                        }
                        trailing={
                          <Tooltip title={t("openInNewTab")}>
                            <IconButton
                              size="small"
                              variant="subtle"
                              aria-label={t("openInNewTab")}
                              onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                            >
                              <Icon>
                                <LfArrowUpRightFromSquare />
                              </Icon>
                            </IconButton>
                          </Tooltip>
                        }
                      >
                        <Text variant="body.medium.bold" numberOfLines={2}>
                          {caseItem.caseName}
                        </Text>
                      </CardHeader>
                      <CardBody>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              gap: "var(--aegis-space-small)",
                            }}
                          >
                            <StatusLabel variant="fill" color={getStatusLabelColor(caseItem.status)}>
                              {caseItem.status}
                            </StatusLabel>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                              <Text variant="body.small" color="subtle">
                                {t("dueDate")}:
                              </Text>
                              <Text variant="body.small">{formatDate(caseItem.dueDate)}</Text>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                              <Avatar size="small" name={caseItem.requester} />
                              <Text variant="body.small">{caseItem.requester}</Text>
                            </div>
                            <Tag>{caseItem.requestingDepartment}</Tag>
                          </div>
                          <FormControl>
                            <FormControl.Label>{t("assignee")}</FormControl.Label>
                            <Combobox
                              placeholder={t("selectAssignee")}
                              value={assignments[caseItem.caseName] ?? caseItem.assignee ?? ""}
                              onChange={(selectedValue: string | null) => {
                                onAssignmentsChange({
                                  ...assignments,
                                  [caseItem.caseName]: selectedValue ?? "",
                                });
                              }}
                              options={localizedTeamMembers.map((member: string) => ({ label: member, value: member }))}
                              ghost={false}
                            />
                          </FormControl>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  );
}
