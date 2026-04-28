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
import type { AssigneeFilterMode, DueDateFilter, LeadTimeCategories, LeadTimeCompositionData } from "../types";
import { LeadTimeCard } from "./LeadTimeCard";
import { LeadTimeCompositionCard } from "./LeadTimeCompositionCard";

export interface TimeTabProps {
  // LeadTimeCard props
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
  };
  // LeadTimeCompositionCard props
  leadTimeCompositionCaseTypeFilter: string;
  leadTimeCompositionAssigneeFilterMode: AssigneeFilterMode;
  leadTimeCompositionViewMode: "graph" | "table";
  leadTimeCompositionGraphMode: "grouped" | "detailed";
  isLeadTimeCompositionFilterOpen: boolean;
  leadTimeCompositionSortType: "caseCount" | "name";
  leadTimeCompositionSortOrder: "asc" | "desc";
  leadTimeCategories: LeadTimeCategories;
  isStatusSettingsOpen: boolean;
  leadTimeCompositionData: LeadTimeCompositionData[];
  performanceDateRange: { start: Date | null; end: Date | null };
  // Handlers
  onLeadTimeGraphViewModeChange: (mode: "graph" | "table") => void;
  onLeadTimeVisibleMetricsChange: (metrics: { リードタイム中央値: boolean; 初回返信速度中央値: boolean }) => void;
  onLeadTimeShowPreviousYearChange: (show: boolean) => void;
  onLeadTimeCaseTypeFilterChange: (filter: string) => void;
  onIsLeadTimeGraphFilterOpenChange: (open: boolean) => void;
  onLeadTimeCompositionCaseTypeFilterChange: (filter: string) => void;
  onLeadTimeCompositionAssigneeFilterModeChange: (mode: AssigneeFilterMode) => void;
  onLeadTimeCompositionViewModeChange: (mode: "graph" | "table") => void;
  onLeadTimeCompositionGraphModeChange: (mode: "grouped" | "detailed") => void;
  onIsLeadTimeCompositionFilterOpenChange: (open: boolean) => void;
  onLeadTimeCompositionSortTypeChange: (type: "caseCount" | "name") => void;
  onLeadTimeCompositionSortOrderChange: (order: "asc" | "desc") => void;
  onIsStatusSettingsOpenChange: (open: boolean) => void;
  onHandleSaveCategories: (categories: LeadTimeCategories) => void;
  // Common handlers
  onPaneOpenChange: (open: boolean) => void;
  onSelectedMemberChange: (member: string | null) => void;
  onPaneTabIndexChange: (index: number) => void;
  onPanePerformanceDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  activeCaseTypeFilter: string;
  activeDueDateFilter: DueDateFilter;
  activeStatusFilter: string;
  membersWithOverdueCases: string[];
  tenantStatusSeriesForTeamBreakdown: Array<{ key: string; name: string; color: string; borderColor?: string }>;
  onPaneCaseTypeFilterChange: (filter: string) => void;
  onPaneDueDateFilterChange: (filter: DueDateFilter) => void;
  onPaneStatusFilterChange: (filter: string) => void;
  // TimeTab用のフィルター
  timeSelectedMembers: string[];
  timeDateRange: { start: Date | null; end: Date | null };
  onTimeSelectedMembersChange: (members: string[]) => void;
  onTimeDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onTimeDateRangeReset: () => void;
}

export function TimeTab(props: TimeTabProps) {
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
    props.timeSelectedMembers.length > 0 ||
    props.timeDateRange.start?.getTime() !== initialDateRange.start.getTime() ||
    props.timeDateRange.end?.getTime() !== initialDateRange.end.getTime();

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
              value={props.timeSelectedMembers}
              onChange={props.onTimeSelectedMembersChange}
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
                  value={props.timeDateRange.start ? String(props.timeDateRange.start.getFullYear()) : undefined}
                  onChange={(value) => {
                    if (value) {
                      const year = parseInt(value, 10);
                      const month = props.timeDateRange.start?.getMonth() ?? 0;
                      const newStart = new Date(year, month, 1);
                      if (props.timeDateRange.end) {
                        const monthsDiff =
                          (props.timeDateRange.end.getFullYear() - newStart.getFullYear()) * 12 +
                          (props.timeDateRange.end.getMonth() - newStart.getMonth());
                        if (monthsDiff > 12) {
                          const maxEnd = new Date(newStart.getFullYear() + 1, newStart.getMonth() + 1, 0);
                          props.onTimeDateRangeChange({ start: newStart, end: maxEnd });
                          return;
                        }
                      }
                      props.onTimeDateRangeChange({ ...props.timeDateRange, start: newStart });
                    } else {
                      props.onTimeDateRangeChange({ ...props.timeDateRange, start: null });
                    }
                  }}
                  options={(() => {
                    const today = new Date();
                    const maxStart = props.timeDateRange.end
                      ? new Date(props.timeDateRange.end.getFullYear(), props.timeDateRange.end.getMonth() - 12, 1)
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
                  value={props.timeDateRange.start ? String(props.timeDateRange.start.getMonth() + 1) : undefined}
                  onChange={(value) => {
                    if (value) {
                      const month = parseInt(value, 10);
                      const year = props.timeDateRange.start?.getFullYear() ?? new Date().getFullYear();
                      const newStart = new Date(year, month - 1, 1);
                      if (props.timeDateRange.end) {
                        const monthsDiff =
                          (props.timeDateRange.end.getFullYear() - newStart.getFullYear()) * 12 +
                          (props.timeDateRange.end.getMonth() - newStart.getMonth());
                        if (monthsDiff > 12) {
                          const maxEnd = new Date(newStart.getFullYear() + 1, newStart.getMonth() + 1, 0);
                          props.onTimeDateRangeChange({ start: newStart, end: maxEnd });
                          return;
                        }
                      }
                      props.onTimeDateRangeChange({ ...props.timeDateRange, start: newStart });
                    } else {
                      props.onTimeDateRangeChange({ ...props.timeDateRange, start: null });
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
                  value={props.timeDateRange.end ? String(props.timeDateRange.end.getFullYear()) : undefined}
                  onChange={(value) => {
                    if (value) {
                      const year = parseInt(value, 10);
                      const month = props.timeDateRange.end?.getMonth() ?? 11;
                      const newEnd = new Date(year, month + 1, 0);
                      if (props.timeDateRange.start) {
                        const monthsDiff =
                          (newEnd.getFullYear() - props.timeDateRange.start.getFullYear()) * 12 +
                          (newEnd.getMonth() - props.timeDateRange.start.getMonth());
                        if (monthsDiff > 12) {
                          const maxEnd = new Date(
                            props.timeDateRange.start.getFullYear() + 1,
                            props.timeDateRange.start.getMonth() + 1,
                            0,
                          );
                          props.onTimeDateRangeChange({ ...props.timeDateRange, end: maxEnd });
                          return;
                        }
                      }
                      props.onTimeDateRangeChange({ ...props.timeDateRange, end: newEnd });
                    } else {
                      props.onTimeDateRangeChange({ ...props.timeDateRange, end: null });
                    }
                  }}
                  options={(() => {
                    const today = new Date();
                    const minEnd = props.timeDateRange.start
                      ? new Date(props.timeDateRange.start.getFullYear(), props.timeDateRange.start.getMonth(), 1)
                      : null;
                    const maxEnd = props.timeDateRange.start
                      ? new Date(
                          props.timeDateRange.start.getFullYear() + 1,
                          props.timeDateRange.start.getMonth() + 1,
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
                  value={props.timeDateRange.end ? String(props.timeDateRange.end.getMonth() + 1) : undefined}
                  onChange={(value) => {
                    if (value) {
                      const month = parseInt(value, 10);
                      const year = props.timeDateRange.end?.getFullYear() ?? new Date().getFullYear();
                      const newEnd = new Date(year, month, 0);
                      if (props.timeDateRange.start) {
                        const monthsDiff =
                          (newEnd.getFullYear() - props.timeDateRange.start.getFullYear()) * 12 +
                          (newEnd.getMonth() - props.timeDateRange.start.getMonth());
                        if (monthsDiff > 12) {
                          const maxEnd = new Date(
                            props.timeDateRange.start.getFullYear() + 1,
                            props.timeDateRange.start.getMonth() + 1,
                            0,
                          );
                          props.onTimeDateRangeChange({ ...props.timeDateRange, end: maxEnd });
                          return;
                        }
                      }
                      props.onTimeDateRangeChange({ ...props.timeDateRange, end: newEnd });
                    } else {
                      props.onTimeDateRangeChange({ ...props.timeDateRange, end: null });
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
          <Button variant="subtle" onClick={props.onTimeDateRangeReset}>
            {t("reset")}
          </Button>
        )}
      </div>
      <LeadTimeCard
        leadTimeGraphViewMode={props.leadTimeGraphViewMode}
        leadTimeVisibleMetrics={props.leadTimeVisibleMetrics}
        leadTimeShowPreviousYear={props.leadTimeShowPreviousYear}
        leadTimeCaseTypeFilter={props.leadTimeCaseTypeFilter}
        isLeadTimeGraphFilterOpen={props.isLeadTimeGraphFilterOpen}
        leadTimeOverallPerformanceData={props.leadTimeOverallPerformanceData}
        leadTimeMergedPerformanceData={props.leadTimeMergedPerformanceData}
        leadTimeAllPeriodData={props.leadTimeAllPeriodData}
        performanceDateRange={props.performanceDateRange}
        onLeadTimeGraphViewModeChange={props.onLeadTimeGraphViewModeChange}
        onLeadTimeVisibleMetricsChange={props.onLeadTimeVisibleMetricsChange}
        onLeadTimeShowPreviousYearChange={props.onLeadTimeShowPreviousYearChange}
        onLeadTimeCaseTypeFilterChange={props.onLeadTimeCaseTypeFilterChange}
        onIsLeadTimeGraphFilterOpenChange={props.onIsLeadTimeGraphFilterOpenChange}
      />
      <LeadTimeCompositionCard
        leadTimeCompositionCaseTypeFilter={props.leadTimeCompositionCaseTypeFilter}
        leadTimeCompositionAssigneeFilterMode={props.leadTimeCompositionAssigneeFilterMode}
        leadTimeCompositionViewMode={props.leadTimeCompositionViewMode}
        leadTimeCompositionGraphMode={props.leadTimeCompositionGraphMode}
        isLeadTimeCompositionFilterOpen={props.isLeadTimeCompositionFilterOpen}
        leadTimeCompositionSortType={props.leadTimeCompositionSortType}
        leadTimeCompositionSortOrder={props.leadTimeCompositionSortOrder}
        leadTimeCategories={props.leadTimeCategories}
        isStatusSettingsOpen={props.isStatusSettingsOpen}
        leadTimeCompositionData={props.leadTimeCompositionData}
        tenantStatusSeriesForTeamBreakdown={props.tenantStatusSeriesForTeamBreakdown}
        performanceDateRange={props.performanceDateRange}
        timeDateRange={props.timeDateRange}
        onLeadTimeCompositionCaseTypeFilterChange={props.onLeadTimeCompositionCaseTypeFilterChange}
        onLeadTimeCompositionAssigneeFilterModeChange={props.onLeadTimeCompositionAssigneeFilterModeChange}
        onLeadTimeCompositionViewModeChange={props.onLeadTimeCompositionViewModeChange}
        onLeadTimeCompositionGraphModeChange={props.onLeadTimeCompositionGraphModeChange}
        onIsLeadTimeCompositionFilterOpenChange={props.onIsLeadTimeCompositionFilterOpenChange}
        onLeadTimeCompositionSortTypeChange={props.onLeadTimeCompositionSortTypeChange}
        onLeadTimeCompositionSortOrderChange={props.onLeadTimeCompositionSortOrderChange}
        onIsStatusSettingsOpenChange={props.onIsStatusSettingsOpenChange}
        onHandleSaveCategories={props.onHandleSaveCategories}
        onTimeDateRangeChange={props.onTimeDateRangeChange}
        onTimeDateRangeReset={props.onTimeDateRangeReset}
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
