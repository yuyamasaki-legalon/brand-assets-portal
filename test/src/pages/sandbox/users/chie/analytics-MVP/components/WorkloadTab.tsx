import { LfUserGroup } from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Button,
  FormControl,
  FormGroup,
  Icon,
  Select,
  TagPicker,
  Text,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import { teamMembers, USER_GROUP_MAPPING, USER_GROUPS } from "../constants";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
import type {
  AssigneeFilterMode,
  DueDateFilter,
  MemberPerformanceByCaseTypeData,
  MemberPerformanceData,
} from "../types";
import { CompletedCaseCountCard } from "./CompletedCaseCountCard";
import { MemberPerformanceOverviewCard } from "./MemberPerformanceOverviewCard";
import { NewCaseCountCard } from "./NewCaseCountCard";

export interface WorkloadTabProps {
  // NewCaseCountCard props
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
  // CompletedCaseCountCard props
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
  // MemberPerformanceOverviewCard props
  performanceOverviewCaseTypeFilter: string;
  performanceOverviewAssigneeFilterMode: AssigneeFilterMode;
  performanceOverviewViewMode: "graph" | "table";
  isPerformanceOverviewFilterOpen: boolean;
  performanceOverviewBreakdownView: "dueDate" | "caseType" | "department";
  leadTimePerformanceSortType: "caseCount" | "name";
  leadTimePerformanceSortOrder: "asc" | "desc";
  performanceOverviewDueDateFilter: DueDateFilter;
  performanceOverviewDateRange: { start: Date | null; end: Date | null };
  memberPerformanceData: MemberPerformanceData[];
  memberPerformanceByCaseTypeData: MemberPerformanceByCaseTypeData[];
  performanceDateRange: { start: Date | null; end: Date | null };
  // Handlers
  onCaseCountViewModeChange: (mode: "graph" | "table") => void;
  onCaseCountViewTypeChange: (viewType: "dueDate" | "caseType" | "department") => void;
  onCaseCountPeriodViewChange: (view: "all" | "monthly") => void;
  onCaseCountShowPreviousYearChange: (show: boolean) => void;
  onCaseCountCaseTypeFilterChange: (filter: string) => void;
  onIsCaseCountFilterOpenChange: (open: boolean) => void;
  onCaseCount2ViewModeChange: (mode: "graph" | "table") => void;
  onCaseCount2ViewTypeChange: (type: "dueDate" | "caseType" | "department") => void;
  onCaseCount2PeriodViewChange: (view: "all" | "monthly") => void;
  onCaseCount2ShowPreviousYearChange: (show: boolean) => void;
  onCaseCount2CaseTypeFilterChange: (filter: string) => void;
  onIsCaseCount2FilterOpenChange: (open: boolean) => void;
  onPerformanceOverviewBreakdownViewChange: (view: "dueDate" | "caseType" | "department") => void;
  onPerformanceOverviewCaseTypeFilterChange: (filter: string) => void;
  onPerformanceOverviewAssigneeFilterModeChange: (mode: AssigneeFilterMode) => void;
  onPerformanceOverviewViewModeChange: (mode: "graph" | "table") => void;
  onIsPerformanceOverviewFilterOpenChange: (open: boolean) => void;
  onLeadTimePerformanceSortTypeChange: (type: "caseCount" | "name") => void;
  onLeadTimePerformanceSortOrderChange: (order: "asc" | "desc") => void;
  onPerformanceOverviewDueDateFilterChange: (filter: DueDateFilter) => void;
  onPerformanceOverviewDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  // Common handlers
  onPaneOpenChange: (open: boolean) => void;
  onSelectedMemberChange: (member: string | null) => void;
  onPaneTabIndexChange: (index: number) => void;
  onPanePerformanceDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  activeCaseTypeFilter: string;
  activeDueDateFilter: DueDateFilter;
  activeStatusFilter: string;
  membersWithOverdueCases: string[];
  onPaneCaseTypeFilterChange: (filter: string) => void;
  onPaneDueDateFilterChange: (filter: DueDateFilter) => void;
  onPaneStatusFilterChange: (filter: string) => void;
  // WorkloadTab用のフィルター
  workloadSelectedMembers: string[];
  workloadDateRange: { start: Date | null; end: Date | null };
  onWorkloadSelectedMembersChange: (members: string[]) => void;
  onWorkloadDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onWorkloadDateRangeReset: () => void;
}

export function WorkloadTab(props: WorkloadTabProps) {
  const { t, locale } = useTranslation(reportTranslations);
  const [isTagPickerFocused, setIsTagPickerFocused] = useState(false);

  // 集計期間の初期値: 直近6ヶ月（今日から6ヶ月前の月初〜今月末）
  const getInitialDateRange = () => {
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // 今月末
    const start = new Date(today.getFullYear(), today.getMonth() - 5, 1); // 6ヶ月前の月初
    return { start, end };
  };

  const initialDateRange = getInitialDateRange();

  // フィルターがデフォルトから変わっているかチェック
  const isFilterChanged =
    props.workloadSelectedMembers.length > 0 ||
    props.workloadDateRange.start?.getTime() !== initialDateRange.start.getTime() ||
    props.workloadDateRange.end?.getTime() !== initialDateRange.end.getTime();

  const memberOptions = useMemo(
    () => [
      ...teamMembers.map((name) => ({
        label: name,
        value: name,
        body: <ActionList.Body leading={<Avatar size="xSmall" name={name} />}>{name}</ActionList.Body>,
      })),
      ...Object.keys(USER_GROUPS).map((groupName) => ({
        label: USER_GROUP_MAPPING[locale][groupName] || groupName,
        value: `group:${groupName}`,
        body: (
          <ActionList.Body
            leading={
              <Icon>
                <LfUserGroup />
              </Icon>
            }
          >
            {USER_GROUP_MAPPING[locale][groupName] || groupName}
          </ActionList.Body>
        ),
      })),
    ],
    [locale],
  );

  return (
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
        }}
      >
        <FormControl>
          <FormControl.Label>{t("member")}</FormControl.Label>
          {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Wrapper for TagPicker expand on focus; focus remains on TagPicker */}
          <fieldset
            onFocus={() => setIsTagPickerFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsTagPickerFocused(false);
              }
            }}
            style={{
              border: "none",
              margin: 0,
              padding: 0,
              maxHeight: isTagPickerFocused ? "none" : "32px",
              overflow: isTagPickerFocused ? "visible" : "hidden",
              transition: "max-height 0.2s ease",
            }}
          >
            <TagPicker
              placeholder={t("selectMember")}
              options={memberOptions}
              value={props.workloadSelectedMembers}
              onChange={props.onWorkloadSelectedMembersChange}
              shrinkOnBlur
            />
          </fieldset>
        </FormControl>
        <FormControl style={{ width: "auto", minWidth: "320px" }}>
          <FormControl.Label>{t("aggregationPeriod")}</FormControl.Label>
          <FormGroup>
            <FormControl>
              <div style={{ display: "flex", gap: "var(--aegis-space-xxSmall)", alignItems: "flex-end" }}>
                <Select
                  size="medium"
                  placeholder={t("selectYear")}
                  value={
                    props.workloadDateRange.start ? String(props.workloadDateRange.start.getFullYear()) : undefined
                  }
                  onChange={(value) => {
                    if (value) {
                      const year = parseInt(value, 10);
                      const month = props.workloadDateRange.start?.getMonth() ?? 0;
                      const newStart = new Date(year, month, 1);
                      if (props.workloadDateRange.end) {
                        const monthsDiff =
                          (props.workloadDateRange.end.getFullYear() - newStart.getFullYear()) * 12 +
                          (props.workloadDateRange.end.getMonth() - newStart.getMonth());
                        if (monthsDiff > 12) {
                          const maxEnd = new Date(newStart.getFullYear() + 1, newStart.getMonth() + 1, 0);
                          props.onWorkloadDateRangeChange({ start: newStart, end: maxEnd });
                          return;
                        }
                      }
                      props.onWorkloadDateRangeChange({ ...props.workloadDateRange, start: newStart });
                    } else {
                      props.onWorkloadDateRangeChange({ ...props.workloadDateRange, start: null });
                    }
                  }}
                  options={(() => {
                    const today = new Date();
                    const maxStart = props.workloadDateRange.end
                      ? new Date(
                          props.workloadDateRange.end.getFullYear(),
                          props.workloadDateRange.end.getMonth() - 12,
                          1,
                        )
                      : null;
                    const options: Array<{ label: string; value: string; disabled?: boolean }> = [];
                    for (let y = today.getFullYear() - 1; y <= today.getFullYear() + 1; y++) {
                      const disabled = maxStart ? new Date(y, 11, 1) < maxStart : false;
                      const label = locale === "ja-JP" ? `${y}${t("year")}` : String(y);
                      options.push({ label, value: String(y), disabled });
                    }
                    return options;
                  })()}
                />
                <Select
                  size="medium"
                  placeholder={t("selectMonth")}
                  value={
                    props.workloadDateRange.start ? String(props.workloadDateRange.start.getMonth() + 1) : undefined
                  }
                  onChange={(value) => {
                    if (value) {
                      const month = parseInt(value, 10);
                      const year = props.workloadDateRange.start?.getFullYear() ?? new Date().getFullYear();
                      const newStart = new Date(year, month - 1, 1);
                      if (props.workloadDateRange.end) {
                        const monthsDiff =
                          (props.workloadDateRange.end.getFullYear() - newStart.getFullYear()) * 12 +
                          (props.workloadDateRange.end.getMonth() - newStart.getMonth());
                        if (monthsDiff > 12) {
                          const maxEnd = new Date(newStart.getFullYear() + 1, newStart.getMonth() + 1, 0);
                          props.onWorkloadDateRangeChange({ start: newStart, end: maxEnd });
                          return;
                        }
                      }
                      props.onWorkloadDateRangeChange({ ...props.workloadDateRange, start: newStart });
                    } else {
                      props.onWorkloadDateRangeChange({ ...props.workloadDateRange, start: null });
                    }
                  }}
                  options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                    const date = new Date(2000, m - 1, 1);
                    const label =
                      locale === "ja-JP" ? `${m}${t("month")}` : date.toLocaleString(locale, { month: "short" });
                    return { label, value: String(m) };
                  })}
                />
              </div>
            </FormControl>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Text variant="body.small">-</Text>
            </div>
            <FormControl>
              <div style={{ display: "flex", gap: "var(--aegis-space-xxSmall)", alignItems: "flex-end" }}>
                <Select
                  size="medium"
                  placeholder={t("selectYear")}
                  value={props.workloadDateRange.end ? String(props.workloadDateRange.end.getFullYear()) : undefined}
                  onChange={(value) => {
                    if (value) {
                      const year = parseInt(value, 10);
                      const month = props.workloadDateRange.end?.getMonth() ?? 11;
                      const newEnd = new Date(year, month + 1, 0);
                      if (props.workloadDateRange.start) {
                        const monthsDiff =
                          (newEnd.getFullYear() - props.workloadDateRange.start.getFullYear()) * 12 +
                          (newEnd.getMonth() - props.workloadDateRange.start.getMonth());
                        if (monthsDiff > 12) {
                          const maxEnd = new Date(
                            props.workloadDateRange.start.getFullYear() + 1,
                            props.workloadDateRange.start.getMonth() + 1,
                            0,
                          );
                          props.onWorkloadDateRangeChange({ ...props.workloadDateRange, end: maxEnd });
                          return;
                        }
                      }
                      props.onWorkloadDateRangeChange({ ...props.workloadDateRange, end: newEnd });
                    } else {
                      props.onWorkloadDateRangeChange({ ...props.workloadDateRange, end: null });
                    }
                  }}
                  options={(() => {
                    const today = new Date();
                    const minEnd = props.workloadDateRange.start
                      ? new Date(
                          props.workloadDateRange.start.getFullYear(),
                          props.workloadDateRange.start.getMonth(),
                          1,
                        )
                      : null;
                    const maxEnd = props.workloadDateRange.start
                      ? new Date(
                          props.workloadDateRange.start.getFullYear() + 1,
                          props.workloadDateRange.start.getMonth() + 1,
                          0,
                        )
                      : null;
                    const options: Array<{ label: string; value: string; disabled?: boolean }> = [];
                    for (let y = today.getFullYear() - 1; y <= today.getFullYear() + 1; y++) {
                      const yearEnd = new Date(y, 11, 31);
                      const disabled = minEnd && maxEnd ? yearEnd < minEnd || yearEnd > maxEnd : false;
                      const label = locale === "ja-JP" ? `${y}${t("year")}` : String(y);
                      options.push({ label, value: String(y), disabled });
                    }
                    return options;
                  })()}
                />
                <Select
                  size="medium"
                  placeholder={t("selectMonth")}
                  value={props.workloadDateRange.end ? String(props.workloadDateRange.end.getMonth() + 1) : undefined}
                  onChange={(value) => {
                    if (value) {
                      const month = parseInt(value, 10);
                      const year = props.workloadDateRange.end?.getFullYear() ?? new Date().getFullYear();
                      const newEnd = new Date(year, month, 0);
                      if (props.workloadDateRange.start) {
                        const monthsDiff =
                          (newEnd.getFullYear() - props.workloadDateRange.start.getFullYear()) * 12 +
                          (newEnd.getMonth() - props.workloadDateRange.start.getMonth());
                        if (monthsDiff > 12) {
                          const maxEnd = new Date(
                            props.workloadDateRange.start.getFullYear() + 1,
                            props.workloadDateRange.start.getMonth() + 1,
                            0,
                          );
                          props.onWorkloadDateRangeChange({ ...props.workloadDateRange, end: maxEnd });
                          return;
                        }
                      }
                      props.onWorkloadDateRangeChange({ ...props.workloadDateRange, end: newEnd });
                    } else {
                      props.onWorkloadDateRangeChange({ ...props.workloadDateRange, end: null });
                    }
                  }}
                  options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                    const date = new Date(2000, m - 1, 1);
                    const label =
                      locale === "ja-JP" ? `${m}${t("month")}` : date.toLocaleString(locale, { month: "short" });
                    return { label, value: String(m) };
                  })}
                />
              </div>
            </FormControl>
          </FormGroup>
        </FormControl>
        {isFilterChanged && (
          <Button variant="subtle" onClick={props.onWorkloadDateRangeReset}>
            {t("reset")}
          </Button>
        )}
      </div>
      <NewCaseCountCard
        caseCountViewMode={props.caseCountViewMode}
        caseCountViewType={props.caseCountViewType}
        caseCountPeriodView={props.caseCountPeriodView}
        caseCountVisibleMetrics={props.caseCountVisibleMetrics}
        caseCountShowPreviousYear={props.caseCountShowPreviousYear}
        caseCountCaseTypeFilter={props.caseCountCaseTypeFilter}
        isCaseCountFilterOpen={props.isCaseCountFilterOpen}
        caseCountByCaseTypeOverallPerformanceData={props.caseCountByCaseTypeOverallPerformanceData}
        caseCountByCaseTypeMergedPerformanceData={props.caseCountByCaseTypeMergedPerformanceData}
        caseCountAllPeriodByCaseTypeData={props.caseCountAllPeriodByCaseTypeData}
        caseCountAllPeriodByCaseTypePreviousYearData={props.caseCountAllPeriodByCaseTypePreviousYearData}
        performanceDateRange={props.performanceDateRange}
        onCaseCountViewModeChange={props.onCaseCountViewModeChange}
        onCaseCountViewTypeChange={props.onCaseCountViewTypeChange}
        onCaseCountPeriodViewChange={props.onCaseCountPeriodViewChange}
        onCaseCountShowPreviousYearChange={props.onCaseCountShowPreviousYearChange}
        onCaseCountCaseTypeFilterChange={props.onCaseCountCaseTypeFilterChange}
        onIsCaseCountFilterOpenChange={props.onIsCaseCountFilterOpenChange}
      />
      <CompletedCaseCountCard
        caseCount2ViewMode={props.caseCount2ViewMode}
        caseCount2ViewType={props.caseCount2ViewType}
        caseCount2PeriodView={props.caseCount2PeriodView}
        caseCount2VisibleMetrics={props.caseCount2VisibleMetrics}
        caseCount2ShowPreviousYear={props.caseCount2ShowPreviousYear}
        caseCount2CaseTypeFilter={props.caseCount2CaseTypeFilter}
        isCaseCount2FilterOpen={props.isCaseCount2FilterOpen}
        caseCount2OverallPerformanceData={props.caseCount2OverallPerformanceData}
        caseCount2MergedPerformanceData={props.caseCount2MergedPerformanceData}
        caseCount2ByCaseTypeOverallPerformanceData={props.caseCount2ByCaseTypeOverallPerformanceData}
        caseCount2ByCaseTypeMergedPerformanceData={props.caseCount2ByCaseTypeMergedPerformanceData}
        caseCount2AllPeriodData={props.caseCount2AllPeriodData}
        caseCount2AllPeriodPreviousYearData={props.caseCount2AllPeriodPreviousYearData}
        caseCount2AllPeriodByCaseTypeData={props.caseCount2AllPeriodByCaseTypeData}
        caseCount2AllPeriodByCaseTypePreviousYearData={props.caseCount2AllPeriodByCaseTypePreviousYearData}
        performanceDateRange={props.performanceDateRange}
        onCaseCount2ViewModeChange={props.onCaseCount2ViewModeChange}
        onCaseCount2ViewTypeChange={props.onCaseCount2ViewTypeChange}
        onCaseCount2PeriodViewChange={props.onCaseCount2PeriodViewChange}
        onCaseCount2ShowPreviousYearChange={props.onCaseCount2ShowPreviousYearChange}
        onCaseCount2CaseTypeFilterChange={props.onCaseCount2CaseTypeFilterChange}
        onIsCaseCount2FilterOpenChange={props.onIsCaseCount2FilterOpenChange}
        onPaneOpenChange={props.onPaneOpenChange}
        onSelectedMemberChange={props.onSelectedMemberChange}
        onPaneTabIndexChange={props.onPaneTabIndexChange}
        onPanePerformanceDateRangeChange={props.onPanePerformanceDateRangeChange}
      />
      <MemberPerformanceOverviewCard
        performanceOverviewCaseTypeFilter={props.performanceOverviewCaseTypeFilter}
        performanceOverviewAssigneeFilterMode={props.performanceOverviewAssigneeFilterMode}
        performanceOverviewViewMode={props.performanceOverviewViewMode}
        isPerformanceOverviewFilterOpen={props.isPerformanceOverviewFilterOpen}
        performanceOverviewBreakdownView={props.performanceOverviewBreakdownView}
        leadTimePerformanceSortType={props.leadTimePerformanceSortType}
        leadTimePerformanceSortOrder={props.leadTimePerformanceSortOrder}
        memberPerformanceData={props.memberPerformanceData}
        memberPerformanceByCaseTypeData={props.memberPerformanceByCaseTypeData}
        performanceDateRange={props.performanceDateRange}
        onPerformanceOverviewBreakdownViewChange={props.onPerformanceOverviewBreakdownViewChange}
        onPerformanceOverviewCaseTypeFilterChange={props.onPerformanceOverviewCaseTypeFilterChange}
        onPerformanceOverviewAssigneeFilterModeChange={props.onPerformanceOverviewAssigneeFilterModeChange}
        onPerformanceOverviewViewModeChange={props.onPerformanceOverviewViewModeChange}
        onIsPerformanceOverviewFilterOpenChange={props.onIsPerformanceOverviewFilterOpenChange}
        onLeadTimePerformanceSortTypeChange={props.onLeadTimePerformanceSortTypeChange}
        onLeadTimePerformanceSortOrderChange={props.onLeadTimePerformanceSortOrderChange}
        performanceOverviewDueDateFilter={props.performanceOverviewDueDateFilter}
        performanceOverviewDateRange={props.performanceOverviewDateRange}
        onPerformanceOverviewDueDateFilterChange={props.onPerformanceOverviewDueDateFilterChange}
        onPerformanceOverviewDateRangeChange={props.onPerformanceOverviewDateRangeChange}
        onPaneOpenChange={props.onPaneOpenChange}
        onSelectedMemberChange={props.onSelectedMemberChange}
        onPaneTabIndexChange={props.onPaneTabIndexChange}
        activeCaseTypeFilter={props.activeCaseTypeFilter}
        activeDueDateFilter={props.activeDueDateFilter}
        activeStatusFilter={props.activeStatusFilter}
        membersWithOverdueCases={props.membersWithOverdueCases}
        onPaneCaseTypeFilterChange={props.onPaneCaseTypeFilterChange}
        onPaneDueDateFilterChange={props.onPaneDueDateFilterChange}
        onPaneStatusFilterChange={props.onPaneStatusFilterChange}
      />
    </div>
  );
}
