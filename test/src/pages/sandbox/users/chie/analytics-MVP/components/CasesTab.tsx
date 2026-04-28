import { LfUserGroup } from "@legalforce/aegis-icons";
import type { DataTableColumnDef } from "@legalforce/aegis-react";
import { ActionList, Avatar, Button, FormControl, Icon, Select, TagPicker } from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import { teamMembers, USER_GROUP_MAPPING, USER_GROUPS } from "../constants";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
import type { AssigneeFilterMode, CaseData, DueDateFilter } from "../types";
import { OngoingCasesStatusCard } from "./OngoingCasesStatusCard";
import { UnassignedCasesCard } from "./UnassignedCasesCard";

export interface CasesTabProps {
  // State
  sortOrder: "asc" | "desc";
  teamCaseSortType: "caseCount" | "name";
  onTeamCaseSortTypeChange: (type: "caseCount" | "name") => void;
  activeDueDateFilter: DueDateFilter;
  activeCaseTypeFilter: string;
  activeStatusFilter: string;
  caseStatusView: "status" | "type" | "dueDate" | "department";
  showEmptySubAssignee: boolean;
  assigneeFilterMode: AssigneeFilterMode;
  isFilterOpen: boolean;
  teamCaseViewMode: "graph" | "table";
  // CasesTab用のフィルター
  casesSelectedMembers: string[];
  onCasesSelectedMembersChange: (members: string[]) => void;
  onCasesSelectedMembersReset: () => void;
  // Data
  unassignedCasesCount: number;
  unassignedSubAssigneeCasesCount: number;
  onUnassignedCasesDrawerOpen: () => void;
  dueDateSummary: {
    すべて: number;
    納期超過: number;
    今日まで: number;
    今日含め3日以内: number;
    今日含め7日以内: number;
    "1週間後〜": number;
    納期未入力: number;
  };
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
  maxCaseCount: number;
  membersWithOverdueCases: string[];
  // Columns
  unassignedCasesColumns: DataTableColumnDef<CaseData, string | number>[];
  // Handlers
  onSortOrderChange: (order: "asc" | "desc") => void;
  onActiveDueDateFilterChange: (filter: DueDateFilter) => void;
  onActiveCaseTypeFilterChange: (filter: string) => void;
  onActiveStatusFilterChange: (filter: string) => void;
  onCaseStatusViewChange: (view: "status" | "type" | "dueDate" | "department") => void;
  onShowEmptySubAssigneeChange: (show: boolean) => void;
  onAssigneeFilterModeChange: (mode: AssigneeFilterMode) => void;
  onIsFilterOpenChange: (open: boolean) => void;
  onTeamCaseViewModeChange: (mode: "graph" | "table") => void;
  onHandleBarClickBase: (
    data: { name?: string },
    filterType: "status" | "caseType" | "dueDate",
    filterValue: string,
  ) => void;
  // For CustomYAxisTick
  onPaneOpenChange: (open: boolean) => void;
  onSelectedMemberChange: (member: string | null) => void;
  onPaneTabIndexChange: (index: number) => void;
  onPaneCaseTypeFilterChange: (filter: string) => void;
  onPaneDueDateFilterChange: (filter: DueDateFilter) => void;
  onPaneStatusFilterChange: (filter: string) => void;
}

export function CasesTab(props: CasesTabProps) {
  const { t, locale } = useTranslation(reportTranslations);
  const [isTagPickerFocused, setIsTagPickerFocused] = useState(false);
  const {
    sortOrder,
    teamCaseSortType,
    onTeamCaseSortTypeChange,
    activeDueDateFilter,
    activeCaseTypeFilter,
    activeStatusFilter,
    caseStatusView,
    assigneeFilterMode,
    isFilterOpen,
    teamCaseViewMode,
    casesSelectedMembers,
    onCasesSelectedMembersChange,
    onCasesSelectedMembersReset,
    unassignedCasesCount,
    unassignedSubAssigneeCasesCount,
    onUnassignedCasesDrawerOpen: _onUnassignedCasesDrawerOpen,
    tenantStatusSeriesForTeamBreakdown,
    chartData,
    teamStatusColumns,
    maxCaseCount,
    membersWithOverdueCases,
    onSortOrderChange,
    onActiveDueDateFilterChange,
    onActiveCaseTypeFilterChange,
    onActiveStatusFilterChange,
    onCaseStatusViewChange,
    onAssigneeFilterModeChange,
    onIsFilterOpenChange,
    onTeamCaseViewModeChange,
    onHandleBarClickBase,
    onPaneOpenChange,
    onSelectedMemberChange,
    onPaneTabIndexChange,
    onPaneCaseTypeFilterChange,
    onPaneDueDateFilterChange,
    onPaneStatusFilterChange,
  } = props;

  // フィルターがデフォルトから変わっているかチェック
  const isFilterChanged = casesSelectedMembers.length > 0 || assigneeFilterMode !== "main";

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
    <>
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
              value={casesSelectedMembers}
              onChange={onCasesSelectedMembersChange}
              shrinkOnBlur
            />
          </fieldset>
        </FormControl>
        <FormControl>
          <FormControl.Label>{t("aggregationTarget")}</FormControl.Label>
          <Select
            size="medium"
            variant="outline"
            value={assigneeFilterMode}
            onChange={(value) => onAssigneeFilterModeChange(value as AssigneeFilterMode)}
            options={[
              { label: t("mainAssigneeOnly"), value: "main" },
              { label: t("subAssigneeOnly"), value: "sub" },
              { label: t("mainAndSubAssignee"), value: "both" },
            ]}
          />
        </FormControl>
        {isFilterChanged && (
          <Button variant="subtle" onClick={onCasesSelectedMembersReset}>
            {t("reset")}
          </Button>
        )}
      </div>
      <UnassignedCasesCard
        unassignedCasesCount={unassignedCasesCount}
        unassignedSubAssigneeCasesCount={unassignedSubAssigneeCasesCount}
        assigneeFilterMode={assigneeFilterMode}
        onUnassignedCasesDrawerOpen={_onUnassignedCasesDrawerOpen}
      />
      <OngoingCasesStatusCard
        sortOrder={sortOrder}
        teamCaseSortType={teamCaseSortType}
        onTeamCaseSortTypeChange={onTeamCaseSortTypeChange}
        activeDueDateFilter={activeDueDateFilter}
        activeCaseTypeFilter={activeCaseTypeFilter}
        activeStatusFilter={activeStatusFilter}
        caseStatusView={caseStatusView}
        assigneeFilterMode={assigneeFilterMode}
        isFilterOpen={isFilterOpen}
        teamCaseViewMode={teamCaseViewMode}
        tenantStatusSeriesForTeamBreakdown={tenantStatusSeriesForTeamBreakdown}
        chartData={chartData}
        teamStatusColumns={teamStatusColumns}
        maxCaseCount={maxCaseCount}
        membersWithOverdueCases={membersWithOverdueCases}
        onSortOrderChange={onSortOrderChange}
        onActiveDueDateFilterChange={onActiveDueDateFilterChange}
        onActiveCaseTypeFilterChange={onActiveCaseTypeFilterChange}
        onActiveStatusFilterChange={onActiveStatusFilterChange}
        onCaseStatusViewChange={onCaseStatusViewChange}
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
    </>
  );
}
