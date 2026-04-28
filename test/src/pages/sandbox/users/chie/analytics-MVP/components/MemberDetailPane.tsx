import { LfCloseLarge } from "@legalforce/aegis-icons";
import {
  ContentHeader,
  DataTable,
  type DataTableColumnDef,
  Icon,
  IconButton,
  PageLayout,
  Tab,
} from "@legalforce/aegis-react";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
import type { AssigneeFilterMode, CaseData, CaseType, DueDateFilter, DurationBucket } from "../types";
import { MemberDetailPaneCasesTab } from "./MemberDetailPaneCasesTab";
import { MemberDetailPanePerformanceTab } from "./MemberDetailPanePerformanceTab";

export interface MemberDetailPaneProps {
  // State
  selectedMember: string | null;
  paneTabIndex: number;
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
  paneStatusFilter: string;
  paneCaseTypeFilter: string;
  paneDueDateFilter: DueDateFilter;
  panePerformanceDateRange: { start: Date | null; end: Date | null };
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
  // Member performance card props
  memberPerformanceViewMode: "graph" | "table";
  onMemberPerformanceViewModeChange: (mode: "graph" | "table") => void;
  leadTimeViewMode: "composition" | "performance";
  onLeadTimeViewModeChange: (mode: "composition" | "performance") => void;
  leadTimeAssigneeFilterMode: AssigneeFilterMode;
  onLeadTimeAssigneeFilterModeChange: (mode: AssigneeFilterMode) => void;
  leadTimeCompositionSortType: "caseCount" | "name";
  leadTimeCompositionSortOrder: "asc" | "desc";
  onLeadTimeCompositionSortTypeChange: (type: "caseCount" | "name") => void;
  // Data
  statusDurationDetailCases: CaseData[];
  durationBucketDetailCases: CaseData[];
  selectedMemberMainCases: CaseData[];
  selectedMemberSubCases: CaseData[];
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
  mainExperienceCompletedCases: CaseData[];
  subExperienceCompletedCases: CaseData[];
  mainExperienceCaseTypeCounts: Array<{ type: string; count: number }>;
  subExperienceCaseTypeCounts: Array<{ type: string; count: number }>;
  tenantStatusSeriesForTeamBreakdown: Array<{ key: string; name: string; color: string; borderColor?: string }>;
  // Columns
  caseTableColumns: DataTableColumnDef<CaseData, string | number>[];
  mainAssignmentTableColumns: DataTableColumnDef<CaseData, string | number>[];
  subAssignmentTableColumns: DataTableColumnDef<CaseData, string | number>[];
  completedCasesColumns: DataTableColumnDef<CaseData, string | number>[];
  caseTypeCountColumns: DataTableColumnDef<{ type: string; count: number }, string | number>[];
  // Handlers
  onPaneOpenChange: (open: boolean) => void;
  onSelectedMemberChange: (member: string | null) => void;
  onPaneTabIndexChange: (index: number) => void;
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
  onExperienceViewModeChange: (mode: "graph" | "table") => void;
  isPaneFilterOpen: boolean;
  onIsPaneFilterOpenChange: (open: boolean) => void;
}

export function MemberDetailPane(props: MemberDetailPaneProps) {
  const {
    selectedMember,
    paneTabIndex,
    paneContext,
    paneStatusFilter,
    paneCaseTypeFilter,
    paneDueDateFilter,
    personalMatterCountCaseTypeFilter,
    personalMatterCountDateRange,
    personalMatterCountViewMode,
    personalMatterCountViewType,
    personalLeadTimeCaseTypeFilter,
    personalLeadTimeDateRange,
    personalLeadTimeViewMode,
    // personalLeadTimePeriodView, // 使用しない（後方互換性のためPropsには残す）
    isPersonalMatterCountFilterOpen,
    isPersonalLeadTimeFilterOpen,
    statusDurationDetailCases,
    durationBucketDetailCases,
    selectedMemberMainCases,
    selectedMemberSubCases,
    personalMatterCountData,
    personalMatterCountByCaseTypeData,
    personalMatterCountAllPeriodData,
    personalMatterCountAllPeriodByCaseTypeData,
    personalMatterCountPeriodView,
    onPersonalMatterCountPeriodViewChange,
    personalLeadTimeData,
    personalLeadTimeAllPeriodData,
    tenantStatusSeriesForTeamBreakdown,
    caseTableColumns,
    mainAssignmentTableColumns,
    subAssignmentTableColumns,
    onPaneOpenChange,
    onSelectedMemberChange,
    onPaneTabIndexChange,
    onPaneStatusFilterChange,
    onPaneCaseTypeFilterChange,
    onPaneDueDateFilterChange,
    onPaneContextChange,
    onPersonalMatterCountCaseTypeFilterChange,
    onPersonalMatterCountDateRangeChange,
    onPersonalMatterCountViewModeChange,
    onPersonalMatterCountViewTypeChange,
    onPersonalLeadTimeCaseTypeFilterChange,
    onPersonalLeadTimeDateRangeChange,
    onPersonalLeadTimeViewModeChange,
    // onPersonalLeadTimePeriodViewChange, // 使用しない（後方互換性のためPropsには残す）
    onIsPersonalMatterCountFilterOpenChange,
    onIsPersonalLeadTimeFilterOpenChange,
    isPaneFilterOpen,
    onIsPaneFilterOpenChange,
  } = props;

  const { t } = useTranslation(reportTranslations);

  return (
    <PageLayout.Pane
      position="end"
      open={!!selectedMember || !!paneContext}
      onOpenChange={onPaneOpenChange}
      resizable
      width="xLarge"
    >
      <PageLayout.Header>
        <ContentHeader
          size="small"
          trailing={
            <IconButton
              variant="plain"
              size="small"
              aria-label={t("close")}
              onClick={() => {
                onPaneOpenChange(false);
                onSelectedMemberChange(null);
                onPaneTabIndexChange(0);
                onPaneStatusFilterChange("すべて");
                onPaneCaseTypeFilterChange("すべて");
                onPaneDueDateFilterChange("すべて");
                onPaneContextChange(null);
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
              ? `${paneContext.member} / ${paneContext.status}${t("relatedCases")}`
              : paneContext?.type === "durationBucket"
                ? `${paneContext.member} / ${paneContext.bucket}（${paneContext.role === "main" ? t("mainRole") : t("subRole")}）${t("relatedCases")}`
                : selectedMember
                  ? `${selectedMember}${t("details")}`
                  : t("detail")}
          </ContentHeader.Title>
        </ContentHeader>
      </PageLayout.Header>
      <PageLayout.Body>
        {paneContext?.type === "statusDuration" ? (
          <DataTable size="small" columns={caseTableColumns} rows={statusDurationDetailCases} />
        ) : paneContext?.type === "durationBucket" ? (
          <DataTable size="small" columns={caseTableColumns} rows={durationBucketDetailCases} />
        ) : (
          selectedMember && (
            <Tab.Group size="small" index={paneTabIndex} onChange={onPaneTabIndexChange}>
              <Tab.List bordered={false}>
                <Tab>{t("performance")}</Tab>
                <Tab>{t("ongoingCases")}</Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <MemberDetailPanePerformanceTab
                    selectedMember={selectedMember}
                    personalMatterCountCaseTypeFilter={personalMatterCountCaseTypeFilter}
                    personalMatterCountDateRange={personalMatterCountDateRange}
                    personalMatterCountViewMode={personalMatterCountViewMode}
                    personalMatterCountViewType={personalMatterCountViewType}
                    personalLeadTimeCaseTypeFilter={personalLeadTimeCaseTypeFilter}
                    personalLeadTimeDateRange={personalLeadTimeDateRange}
                    personalLeadTimeViewMode={personalLeadTimeViewMode}
                    isPersonalMatterCountFilterOpen={isPersonalMatterCountFilterOpen}
                    isPersonalLeadTimeFilterOpen={isPersonalLeadTimeFilterOpen}
                    personalMatterCountData={personalMatterCountData}
                    personalMatterCountByCaseTypeData={personalMatterCountByCaseTypeData}
                    personalMatterCountAllPeriodData={personalMatterCountAllPeriodData}
                    personalMatterCountAllPeriodByCaseTypeData={personalMatterCountAllPeriodByCaseTypeData}
                    personalMatterCountPeriodView={personalMatterCountPeriodView}
                    onPersonalMatterCountPeriodViewChange={onPersonalMatterCountPeriodViewChange}
                    personalLeadTimeData={personalLeadTimeData}
                    personalLeadTimeAllPeriodData={personalLeadTimeAllPeriodData}
                    onPersonalMatterCountCaseTypeFilterChange={onPersonalMatterCountCaseTypeFilterChange}
                    onPersonalMatterCountDateRangeChange={onPersonalMatterCountDateRangeChange}
                    onPersonalMatterCountViewModeChange={onPersonalMatterCountViewModeChange}
                    onPersonalMatterCountViewTypeChange={onPersonalMatterCountViewTypeChange}
                    onPersonalLeadTimeCaseTypeFilterChange={onPersonalLeadTimeCaseTypeFilterChange}
                    onPersonalLeadTimeDateRangeChange={onPersonalLeadTimeDateRangeChange}
                    onPersonalLeadTimeViewModeChange={onPersonalLeadTimeViewModeChange}
                    onIsPersonalMatterCountFilterOpenChange={onIsPersonalMatterCountFilterOpenChange}
                    onIsPersonalLeadTimeFilterOpenChange={onIsPersonalLeadTimeFilterOpenChange}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <MemberDetailPaneCasesTab
                    paneStatusFilter={paneStatusFilter}
                    paneCaseTypeFilter={paneCaseTypeFilter}
                    paneDueDateFilter={paneDueDateFilter}
                    onPaneStatusFilterChange={onPaneStatusFilterChange}
                    onPaneCaseTypeFilterChange={onPaneCaseTypeFilterChange}
                    onPaneDueDateFilterChange={onPaneDueDateFilterChange}
                    isPaneFilterOpen={isPaneFilterOpen}
                    onIsPaneFilterOpenChange={onIsPaneFilterOpenChange}
                    selectedMemberMainCases={selectedMemberMainCases}
                    selectedMemberSubCases={selectedMemberSubCases}
                    mainAssignmentTableColumns={mainAssignmentTableColumns}
                    subAssignmentTableColumns={subAssignmentTableColumns}
                    tenantStatusSeriesForTeamBreakdown={tenantStatusSeriesForTeamBreakdown}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          )
        )}
      </PageLayout.Body>
    </PageLayout.Pane>
  );
}
