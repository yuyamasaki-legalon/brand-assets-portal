import { LfFilter } from "@legalforce/aegis-icons";
import {
  Badge,
  Button,
  ButtonGroup,
  DataTable,
  type DataTableColumnDef,
  EmptyState,
  Form,
  FormControl,
  Icon,
  Popover,
  Select,
  Text,
} from "@legalforce/aegis-react";
import { CASE_TYPE_MAPPING, CASE_TYPE_ORDER } from "../constants";
import { useLocale } from "../hooks/useLocale";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
import type { CaseData, DueDateFilter } from "../types";

interface MemberDetailPaneCasesTabProps {
  paneStatusFilter: string;
  paneCaseTypeFilter: string;
  paneDueDateFilter: DueDateFilter;
  onPaneStatusFilterChange: (filter: string) => void;
  onPaneCaseTypeFilterChange: (filter: string) => void;
  onPaneDueDateFilterChange: (filter: DueDateFilter) => void;
  isPaneFilterOpen: boolean;
  onIsPaneFilterOpenChange: (open: boolean) => void;
  selectedMemberMainCases: CaseData[];
  selectedMemberSubCases: CaseData[];
  mainAssignmentTableColumns: DataTableColumnDef<CaseData, string | number>[];
  subAssignmentTableColumns: DataTableColumnDef<CaseData, string | number>[];
  tenantStatusSeriesForTeamBreakdown: Array<{
    key: string;
    name: string;
    color: string;
    borderColor?: string;
  }>;
}

export function MemberDetailPaneCasesTab({
  paneStatusFilter,
  paneCaseTypeFilter,
  paneDueDateFilter,
  onPaneStatusFilterChange,
  onPaneCaseTypeFilterChange,
  onPaneDueDateFilterChange,
  isPaneFilterOpen,
  onIsPaneFilterOpenChange,
  selectedMemberMainCases,
  selectedMemberSubCases,
  mainAssignmentTableColumns,
  subAssignmentTableColumns,
  tenantStatusSeriesForTeamBreakdown,
}: MemberDetailPaneCasesTabProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(reportTranslations);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <ButtonGroup variant="plain" size="medium">
          <Popover open={isPaneFilterOpen} onOpenChange={onIsPaneFilterOpenChange} placement="bottom-start">
            <Popover.Anchor>
              <Button
                variant={
                  paneStatusFilter !== "すべて" || paneCaseTypeFilter !== "すべて" || paneDueDateFilter !== "すべて"
                    ? "subtle"
                    : "plain"
                }
                size="medium"
                color={
                  paneStatusFilter !== "すべて" || paneCaseTypeFilter !== "すべて" || paneDueDateFilter !== "すべて"
                    ? "information"
                    : "neutral"
                }
                leading={
                  <Badge
                    color="information"
                    invisible={
                      paneStatusFilter === "すべて" && paneCaseTypeFilter === "すべて" && paneDueDateFilter === "すべて"
                    }
                  >
                    <Icon>
                      <LfFilter />
                    </Icon>
                  </Badge>
                }
              >
                {t("filter")}
              </Button>
            </Popover.Anchor>
            <Popover.Content width="medium">
              <Popover.Body>
                <Form>
                  <FormControl orientation="vertical">
                    <FormControl.Label htmlFor="due-date-filter">{t("dueDate")}</FormControl.Label>
                    <Select
                      id="due-date-filter"
                      size="medium"
                      value={paneDueDateFilter}
                      onChange={(value) => onPaneDueDateFilterChange(value as DueDateFilter)}
                      options={[
                        { label: t("dueDateFilterAll"), value: "すべて" },
                        { label: t("dueDateFilterNoDueDate"), value: "納期未入力" },
                        { label: t("dueDateFilterOverdue"), value: "納期超過" },
                        { label: t("dueDateFilterToday"), value: "今日まで" },
                        { label: t("dueDateFilter1to3Days"), value: "今日含め3日以内" },
                        { label: t("dueDateFilter4to7Days"), value: "今日含め7日以内" },
                        { label: t("dueDateFilter8DaysPlus"), value: "1週間後〜" },
                      ]}
                    />
                  </FormControl>
                  <FormControl orientation="vertical">
                    <FormControl.Label htmlFor="status-filter">{t("status")}</FormControl.Label>
                    <Select
                      id="status-filter"
                      size="medium"
                      value={paneStatusFilter}
                      onChange={onPaneStatusFilterChange}
                      options={[
                        { label: t("allStatus"), value: "すべて" },
                        ...tenantStatusSeriesForTeamBreakdown.map((s) => ({ label: s.name, value: s.key })),
                      ]}
                    />
                  </FormControl>
                  <FormControl orientation="vertical">
                    <FormControl.Label htmlFor="case-type-filter">{t("caseType")}</FormControl.Label>
                    <Select
                      id="case-type-filter"
                      size="medium"
                      value={paneCaseTypeFilter}
                      onChange={onPaneCaseTypeFilterChange}
                      options={[
                        { label: t("allStatus"), value: "すべて" },
                        ...CASE_TYPE_ORDER.map((type) => ({
                          label: CASE_TYPE_MAPPING[locale][type] || type,
                          value: type,
                        })),
                      ]}
                    />
                  </FormControl>
                </Form>
              </Popover.Body>
            </Popover.Content>
          </Popover>
          {paneStatusFilter !== "すべて" || paneCaseTypeFilter !== "すべて" || paneDueDateFilter !== "すべて" ? (
            <Button
              size="medium"
              variant="subtle"
              onClick={() => {
                onPaneStatusFilterChange("すべて");
                onPaneCaseTypeFilterChange("すべて");
                onPaneDueDateFilterChange("すべて");
              }}
            >
              {t("reset")}
            </Button>
          ) : null}
        </ButtonGroup>
      </div>
      {selectedMemberMainCases.length > 0 && (
        <>
          <Text variant="title.small" style={{ fontSize: "14px" }}>
            {t("mainAssigneeCases")}
          </Text>
          <DataTable
            size="small"
            columns={mainAssignmentTableColumns}
            rows={selectedMemberMainCases}
            defaultColumnSizing={{
              caseName: 320,
            }}
          />
        </>
      )}
      {selectedMemberSubCases.length > 0 && (
        <>
          <Text variant="title.small" style={{ fontSize: "14px" }}>
            {t("subAssigneeCases")}
          </Text>
          <DataTable
            size="small"
            columns={subAssignmentTableColumns}
            rows={selectedMemberSubCases}
            defaultColumnSizing={{
              caseName: 320,
            }}
          />
        </>
      )}
      {selectedMemberMainCases.length === 0 && selectedMemberSubCases.length === 0 && (
        <EmptyState size="small">{t("noMatchingCases")}</EmptyState>
      )}
    </>
  );
}
