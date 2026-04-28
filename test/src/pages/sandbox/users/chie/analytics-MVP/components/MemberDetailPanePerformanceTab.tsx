import { LfChartBar, LfFilter, LfQuestionCircle, LfTable } from "@legalforce/aegis-icons";
import {
  ActionList,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Form,
  FormControl,
  FormGroup,
  Icon,
  IconButton,
  Menu,
  Popover,
  Select,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Label,
  LabelList,
  Legend,
  Line,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import chartPalette from "../ChartParette.json";
import { CASE_TYPE_COLORS, CASE_TYPE_MAPPING, CASE_TYPE_ORDER } from "../constants";
import { useLocale } from "../hooks/useLocale";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
import type { CaseType } from "../types";
import {
  BadgeLabel,
  CASE_TYPE_CATEGORY_STYLES,
  COMPLETED_DUE_DATE_STYLES,
  CustomChartTooltip,
  CustomXAxisTick,
  type LabelListContentProps,
  renderCustomLegend,
  TopLabel,
  VerticalBarWithDivider,
} from "./chart-components";

const PANE_CHART_HEIGHT = 360;

interface PersonalMatterCountRow {
  name: string;
  onTimeCompletionCount: number;
  overdueCompletionCount: number;
  noDueDateCompletionCount: number;
  leadTimeMedian: number;
  firstReplyTimeMedian: number;
}

interface PersonalLeadTimeAllPeriodRow {
  リードタイム中央値: number;
  初回返信速度中央値: number;
  リードタイム中央値_昨年: number;
  初回返信速度中央値_昨年: number;
}

export interface MemberDetailPanePerformanceTabProps {
  selectedMember: string;
  personalMatterCountCaseTypeFilter: string;
  personalMatterCountDateRange: { start: Date | null; end: Date | null };
  personalMatterCountViewMode: "graph" | "table";
  personalMatterCountViewType: "dueDate" | "caseType" | "department";
  personalLeadTimeCaseTypeFilter: string;
  personalLeadTimeDateRange: { start: Date | null; end: Date | null };
  personalLeadTimeViewMode: "graph" | "table";
  isPersonalMatterCountFilterOpen: boolean;
  isPersonalLeadTimeFilterOpen: boolean;
  personalMatterCountData: Record<string, PersonalMatterCountRow[]>;
  personalMatterCountByCaseTypeData: Record<string, Array<Record<string, number | string>>>;
  personalMatterCountAllPeriodData: {
    新規案件数: number;
    onTimeCompletionCount: number;
    overdueCompletionCount: number;
    noDueDateCompletionCount: number;
  };
  personalMatterCountAllPeriodByCaseTypeData: Record<
    string,
    Record<CaseType, { 新規案件数: number; 完了案件数: number }>
  >;
  personalMatterCountPeriodView: "all" | "monthly";
  onPersonalMatterCountPeriodViewChange: (view: "all" | "monthly") => void;
  personalLeadTimeData: Record<string, PersonalMatterCountRow[]>;
  personalLeadTimeAllPeriodData: Record<string, PersonalLeadTimeAllPeriodRow>;
  onPersonalMatterCountCaseTypeFilterChange: (filter: string) => void;
  onPersonalMatterCountDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onPersonalMatterCountViewModeChange: (mode: "graph" | "table") => void;
  onPersonalMatterCountViewTypeChange: (view: "dueDate" | "caseType" | "department") => void;
  onPersonalLeadTimeCaseTypeFilterChange: (filter: string) => void;
  onPersonalLeadTimeDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onPersonalLeadTimeViewModeChange: (mode: "graph" | "table") => void;
  onIsPersonalMatterCountFilterOpenChange: (open: boolean) => void;
  onIsPersonalLeadTimeFilterOpenChange: (open: boolean) => void;
}

export function MemberDetailPanePerformanceTab(props: MemberDetailPanePerformanceTabProps) {
  const {
    selectedMember,
    personalMatterCountCaseTypeFilter,
    personalMatterCountDateRange,
    personalMatterCountViewMode,
    personalMatterCountViewType,
    personalLeadTimeCaseTypeFilter,
    personalLeadTimeDateRange,
    personalLeadTimeViewMode,
    isPersonalMatterCountFilterOpen,
    isPersonalLeadTimeFilterOpen,
    personalMatterCountData,
    personalMatterCountByCaseTypeData,
    personalMatterCountAllPeriodData,
    personalMatterCountAllPeriodByCaseTypeData,
    personalMatterCountPeriodView,
    onPersonalMatterCountPeriodViewChange,
    personalLeadTimeData,
    personalLeadTimeAllPeriodData,
    onPersonalMatterCountCaseTypeFilterChange,
    onPersonalMatterCountDateRangeChange,
    onPersonalMatterCountViewModeChange,
    onPersonalMatterCountViewTypeChange,
    onPersonalLeadTimeCaseTypeFilterChange,
    onPersonalLeadTimeDateRangeChange,
    onPersonalLeadTimeViewModeChange,
    onIsPersonalMatterCountFilterOpenChange,
    onIsPersonalLeadTimeFilterOpenChange,
  } = props;

  const { locale } = useLocale();
  const { t } = useTranslation(reportTranslations);

  const getInitialDateRange = () => {
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const start = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    return { start, end };
  };
  const initialDateRange = getInitialDateRange();
  const isMatterCountDateRangeFiltered =
    (personalMatterCountDateRange.start?.getTime() !== initialDateRange.start.getTime() ||
      personalMatterCountDateRange.end?.getTime() !== initialDateRange.end.getTime()) &&
    (personalMatterCountDateRange.start !== null || personalMatterCountDateRange.end !== null);
  const isLeadTimeDateRangeFiltered =
    (personalLeadTimeDateRange.start?.getTime() !== initialDateRange.start.getTime() ||
      personalLeadTimeDateRange.end?.getTime() !== initialDateRange.end.getTime()) &&
    (personalLeadTimeDateRange.start !== null || personalLeadTimeDateRange.end !== null);
  const [isPersonalMatterCountInfoPopoverOpen, setIsPersonalMatterCountInfoPopoverOpen] = useState(false);
  const [isPersonalMatterCountInfoPopoverPinned, setIsPersonalMatterCountInfoPopoverPinned] = useState(false);
  const [isPersonalLeadTimeInfoPopoverOpen, setIsPersonalLeadTimeInfoPopoverOpen] = useState(false);
  const [isPersonalLeadTimeInfoPopoverPinned, setIsPersonalLeadTimeInfoPopoverPinned] = useState(false);
  const [isPersonalMatterCountViewModeMenuOpen, setIsPersonalMatterCountViewModeMenuOpen] = useState(false);
  const [isPersonalLeadTimeViewModeMenuOpen, setIsPersonalLeadTimeViewModeMenuOpen] = useState(false);

  const personalMatterCountAllPeriodPieData = useMemo(() => {
    if (personalMatterCountViewType !== "dueDate") return null;

    const newCaseData =
      personalMatterCountAllPeriodData.新規案件数 > 0
        ? [{ name: t("newCaseCount"), value: personalMatterCountAllPeriodData.新規案件数 }]
        : [];

    const completedData =
      personalMatterCountAllPeriodData.onTimeCompletionCount > 0 ||
      personalMatterCountAllPeriodData.overdueCompletionCount > 0 ||
      personalMatterCountAllPeriodData.noDueDateCompletionCount > 0
        ? [
            { name: t("onTimeCompletionLegend"), value: personalMatterCountAllPeriodData.onTimeCompletionCount },
            { name: t("overdueCompletionLegend"), value: personalMatterCountAllPeriodData.overdueCompletionCount },
            { name: t("noDueDateCompletionLegend"), value: personalMatterCountAllPeriodData.noDueDateCompletionCount },
          ].filter((item) => item.value > 0)
        : [];

    return { newCaseData, completedData };
  }, [personalMatterCountViewType, personalMatterCountAllPeriodData, t]);

  const personalMatterCountAllPeriodByCaseTypePieData = useMemo(() => {
    if (personalMatterCountViewType !== "caseType" || !selectedMember) return null;

    const memberData = personalMatterCountAllPeriodByCaseTypeData[selectedMember];
    if (!memberData) return null;

    const newCaseData = CASE_TYPE_ORDER.map((caseType) => ({
      name: CASE_TYPE_MAPPING[locale][caseType] || caseType,
      value: memberData[caseType]?.新規案件数 || 0,
      originalName: caseType,
    })).filter((item) => item.value > 0);

    const completedData = CASE_TYPE_ORDER.map((caseType) => ({
      name: CASE_TYPE_MAPPING[locale][caseType] || caseType,
      value: memberData[caseType]?.完了案件数 || 0,
      originalName: caseType,
    })).filter((item) => item.value > 0);

    return { newCaseData, completedData };
  }, [personalMatterCountViewType, personalMatterCountAllPeriodByCaseTypeData, selectedMember, locale]);

  const matterCountDateRange = useMemo(() => {
    if (!personalMatterCountDateRange.start || !personalMatterCountDateRange.end) return "";
    const startYear = personalMatterCountDateRange.start.getFullYear();
    const startMonth = personalMatterCountDateRange.start.getMonth() + 1;
    const endYear = personalMatterCountDateRange.end.getFullYear();
    const endMonth = personalMatterCountDateRange.end.getMonth() + 1;
    if (locale === "ja-JP") {
      return `${startYear}/${startMonth} - ${endYear}/${endMonth}`;
    }
    const startMonthName = personalMatterCountDateRange.start.toLocaleString(locale, { month: "short" });
    const endMonthName = personalMatterCountDateRange.end.toLocaleString(locale, { month: "short" });
    return `${startMonthName} ${startYear} - ${endMonthName} ${endYear}`;
  }, [personalMatterCountDateRange, locale]);

  const leadTimeDateRange = useMemo(() => {
    if (!personalLeadTimeDateRange.start || !personalLeadTimeDateRange.end) return "";
    const startYear = personalLeadTimeDateRange.start.getFullYear();
    const startMonth = personalLeadTimeDateRange.start.getMonth() + 1;
    const endYear = personalLeadTimeDateRange.end.getFullYear();
    const endMonth = personalLeadTimeDateRange.end.getMonth() + 1;
    if (locale === "ja-JP") {
      return `${startYear}/${startMonth} - ${endYear}/${endMonth}`;
    }
    const startMonthName = personalLeadTimeDateRange.start.toLocaleString(locale, { month: "short" });
    const endMonthName = personalLeadTimeDateRange.end.toLocaleString(locale, { month: "short" });
    return `${startMonthName} ${startYear} - ${endMonthName} ${endYear}`;
  }, [personalLeadTimeDateRange, locale]);

  const personalMatterCountByCaseTypeTableColumns = useMemo(() => {
    const columns: DataTableColumnDef<Record<string, number | string>, string | number>[] = [
      {
        id: "name",
        name: t("month"),
        getValue: (row) => row.name,
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.row.name}</Text>
          </DataTableCell>
        ),
      },
      {
        id: "totalCompletionCount",
        name: t("total"),
        getValue: (row) => {
          return CASE_TYPE_ORDER.reduce((sum, caseType) => {
            return sum + ((row[`${caseType}_完了案件数`] as number) || 0);
          }, 0);
        },
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      },
    ];

    CASE_TYPE_ORDER.forEach((caseType) => {
      const localizedName = CASE_TYPE_MAPPING[locale][caseType] || caseType;
      columns.push({
        id: `${caseType}_完了案件数`,
        name: localizedName,
        getValue: (row) => (row[`${caseType}_完了案件数`] as number) || 0,
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      });
    });

    return columns;
  }, [t, locale]);

  const leadTimeMaxValue = (() => {
    const data = personalLeadTimeData[selectedMember] || [];
    let max = 0;
    data.forEach((row: PersonalMatterCountRow) => {
      max = Math.max(max, row.leadTimeMedian || 0);
      max = Math.max(max, row.firstReplyTimeMedian || 0);
    });
    return max > 0 ? Math.ceil(max * 1.1) : 10;
  })();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
      {/* Matter Count Card */}
      <Card variant="fill">
        <CardBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", alignItems: "center" }}>
                  <Text variant="body.medium.bold">{t("completedCaseCount")}</Text>
                  <Popover
                    open={isPersonalMatterCountInfoPopoverOpen}
                    onOpenChange={(open) => {
                      setIsPersonalMatterCountInfoPopoverOpen(open);
                      if (!open) {
                        setIsPersonalMatterCountInfoPopoverPinned(false);
                      }
                    }}
                    arrow
                    placement="bottom-start"
                    closeOnBlur={true}
                  >
                    <Popover.Anchor>
                      <IconButton
                        variant="plain"
                        size="small"
                        aria-label={t("monthlyGraphViewCaseCount")}
                        icon={LfQuestionCircle}
                        onMouseEnter={() => {
                          if (!isPersonalMatterCountInfoPopoverPinned) {
                            setIsPersonalMatterCountInfoPopoverOpen(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isPersonalMatterCountInfoPopoverPinned) {
                            setIsPersonalMatterCountInfoPopoverOpen(false);
                          }
                        }}
                        onClickCapture={(e) => {
                          e.stopPropagation();
                          setIsPersonalMatterCountInfoPopoverOpen(true);
                          setIsPersonalMatterCountInfoPopoverPinned(true);
                        }}
                      />
                    </Popover.Anchor>
                    <Popover.Content width="small">
                      <Popover.Body>
                        <Text variant="body.small">{t("personalPerformanceDescription")}</Text>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover>
                </div>
                {matterCountDateRange && (
                  <Text variant="body.small" style={{ color: "var(--aegis-color-text-secondary)" }}>
                    {matterCountDateRange}
                  </Text>
                )}
              </div>
              <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
                <ButtonGroup variant="plain" size="medium">
                  <Popover
                    open={isPersonalMatterCountFilterOpen}
                    onOpenChange={onIsPersonalMatterCountFilterOpenChange}
                    placement="bottom-end"
                  >
                    <Popover.Anchor>
                      <Tooltip title={t("filter")}>
                        <IconButton
                          variant={
                            personalMatterCountCaseTypeFilter !== "すべて" || isMatterCountDateRangeFiltered
                              ? "subtle"
                              : "plain"
                          }
                          color={
                            personalMatterCountCaseTypeFilter !== "すべて" || isMatterCountDateRangeFiltered
                              ? "information"
                              : undefined
                          }
                          size="medium"
                          aria-label={t("filter")}
                        >
                          <Badge
                            color="information"
                            invisible={
                              personalMatterCountCaseTypeFilter === "すべて" && !isMatterCountDateRangeFiltered
                            }
                          >
                            <Icon>
                              <LfFilter />
                            </Icon>
                          </Badge>
                        </IconButton>
                      </Tooltip>
                    </Popover.Anchor>
                    <Popover.Content width="medium">
                      <Popover.Body>
                        <Form>
                          <FormControl orientation="vertical">
                            <FormControl.Label>{t("caseType")}</FormControl.Label>
                            <Select
                              size="medium"
                              value={personalMatterCountCaseTypeFilter}
                              onChange={onPersonalMatterCountCaseTypeFilterChange}
                              options={[
                                { label: t("all"), value: "すべて" },
                                ...CASE_TYPE_ORDER.map((type) => ({
                                  label: CASE_TYPE_MAPPING[locale][type] || type,
                                  value: type,
                                })),
                              ]}
                            />
                          </FormControl>
                          <FormControl orientation="vertical">
                            <FormControl.Label>{t("aggregationPeriod")}</FormControl.Label>
                            <FormGroup>
                              <FormControl>
                                <Select
                                  size="medium"
                                  placeholder={t("startMonth")}
                                  value={
                                    personalMatterCountDateRange.start
                                      ? locale === "ja-JP"
                                        ? `${personalMatterCountDateRange.start.getFullYear()}/${personalMatterCountDateRange.start.getMonth() + 1}`
                                        : `${personalMatterCountDateRange.start.toLocaleString(locale, { month: "short" })} ${personalMatterCountDateRange.start.getFullYear()}`
                                      : undefined
                                  }
                                  onChange={(value) => {
                                    if (value) {
                                      let year: number;
                                      let month: number;
                                      if (locale === "ja-JP") {
                                        [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                      } else {
                                        [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                      }
                                      const start = new Date(year, month - 1, 1);
                                      onPersonalMatterCountDateRangeChange({
                                        ...personalMatterCountDateRange,
                                        start,
                                      });
                                    } else {
                                      onPersonalMatterCountDateRangeChange({
                                        ...personalMatterCountDateRange,
                                        start: null,
                                      });
                                    }
                                  }}
                                  options={(() => {
                                    const options: Array<{ label: string; value: string }> = [];
                                    const today = new Date();
                                    for (let i = 23; i >= 0; i--) {
                                      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                                      const year = date.getFullYear();
                                      const month = date.getMonth() + 1;
                                      const value = `${year}/${month}`;
                                      const label =
                                        locale === "ja-JP"
                                          ? value
                                          : `${date.toLocaleString(locale, { month: "short" })} ${year}`;
                                      options.push({ label, value });
                                    }
                                    return options;
                                  })()}
                                />
                              </FormControl>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text variant="body.small">-</Text>
                              </div>
                              <FormControl>
                                <Select
                                  size="medium"
                                  placeholder={t("endMonth")}
                                  value={
                                    personalMatterCountDateRange.end
                                      ? locale === "ja-JP"
                                        ? `${personalMatterCountDateRange.end.getFullYear()}/${personalMatterCountDateRange.end.getMonth() + 1}`
                                        : `${personalMatterCountDateRange.end.toLocaleString(locale, { month: "short" })} ${personalMatterCountDateRange.end.getFullYear()}`
                                      : undefined
                                  }
                                  onChange={(value) => {
                                    if (value) {
                                      let year: number;
                                      let month: number;
                                      if (locale === "ja-JP") {
                                        [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                      } else {
                                        [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                      }
                                      const end = new Date(year, month, 0);
                                      onPersonalMatterCountDateRangeChange({
                                        ...personalMatterCountDateRange,
                                        end,
                                      });
                                    } else {
                                      onPersonalMatterCountDateRangeChange({
                                        ...personalMatterCountDateRange,
                                        end: null,
                                      });
                                    }
                                  }}
                                  options={(() => {
                                    const options: Array<{ label: string; value: string }> = [];
                                    const today = new Date();
                                    for (let i = 23; i >= 0; i--) {
                                      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                                      const year = date.getFullYear();
                                      const month = date.getMonth() + 1;
                                      const value = `${year}/${month}`;
                                      const label =
                                        locale === "ja-JP"
                                          ? value
                                          : `${date.toLocaleString(locale, { month: "short" })} ${year}`;
                                      options.push({ label, value });
                                    }
                                    return options;
                                  })()}
                                />
                              </FormControl>
                            </FormGroup>
                          </FormControl>
                        </Form>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover>
                  {(personalMatterCountCaseTypeFilter !== "すべて" || isMatterCountDateRangeFiltered) && (
                    <Button
                      variant="subtle"
                      size="medium"
                      onClick={() => {
                        onPersonalMatterCountCaseTypeFilterChange("すべて");
                        onPersonalMatterCountDateRangeChange(initialDateRange);
                      }}
                    >
                      {t("reset")}
                    </Button>
                  )}
                  <Menu
                    open={isPersonalMatterCountViewModeMenuOpen}
                    onOpenChange={setIsPersonalMatterCountViewModeMenuOpen}
                    placement="bottom-end"
                  >
                    <Menu.Anchor>
                      <Tooltip
                        title={
                          personalMatterCountViewMode === "table"
                            ? t("table")
                            : personalMatterCountPeriodView === "all"
                              ? t("pieChartAllPeriod")
                              : t("barChartMonthly")
                        }
                      >
                        <IconButton
                          variant="plain"
                          size="medium"
                          aria-label={
                            personalMatterCountViewMode === "table"
                              ? t("table")
                              : personalMatterCountPeriodView === "all"
                                ? t("pieChartAllPeriod")
                                : t("barChartMonthly")
                          }
                          icon={personalMatterCountViewMode === "graph" ? LfChartBar : LfTable}
                        />
                      </Tooltip>
                    </Menu.Anchor>
                    <Menu.Box width="auto">
                      <ActionList size="large">
                        <ActionList.Item
                          selected={
                            personalMatterCountViewMode === "graph" && personalMatterCountPeriodView === "monthly"
                          }
                          onClick={() => {
                            onPersonalMatterCountViewModeChange("graph");
                            onPersonalMatterCountPeriodViewChange("monthly");
                            setIsPersonalMatterCountViewModeMenuOpen(false);
                          }}
                        >
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfChartBar />
                              </Icon>
                            }
                          >
                            {t("barChartMonthly")}
                          </ActionList.Body>
                        </ActionList.Item>
                        <ActionList.Item
                          selected={personalMatterCountViewMode === "graph" && personalMatterCountPeriodView === "all"}
                          onClick={() => {
                            onPersonalMatterCountViewModeChange("graph");
                            onPersonalMatterCountPeriodViewChange("all");
                            setIsPersonalMatterCountViewModeMenuOpen(false);
                          }}
                        >
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfChartBar />
                              </Icon>
                            }
                          >
                            {t("pieChartAllPeriod")}
                          </ActionList.Body>
                        </ActionList.Item>
                        <ActionList.Item
                          selected={personalMatterCountViewMode === "table"}
                          onClick={() => {
                            onPersonalMatterCountViewModeChange("table");
                            setIsPersonalMatterCountViewModeMenuOpen(false);
                          }}
                        >
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfTable />
                              </Icon>
                            }
                          >
                            {t("table")}
                          </ActionList.Body>
                        </ActionList.Item>
                      </ActionList>
                    </Menu.Box>
                  </Menu>
                </ButtonGroup>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "var(--aegis-space-medium)",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Select
                variant="outline"
                value={personalMatterCountViewType}
                onChange={(value) => {
                  if (value === "dueDate" || value === "caseType" || value === "department") {
                    onPersonalMatterCountViewTypeChange(value);
                  }
                }}
                options={[
                  { label: t("dueDateComplianceView"), value: "dueDate" },
                  { label: t("caseTypeView"), value: "caseType" },
                  { label: t("departmentView"), value: "department" },
                ]}
                placement="bottom-start"
              />
            </div>
            <div
              style={{
                padding: "16px",
                background: "var(--aegis-color-background-default)",
                borderRadius: "var(--aegis-radius-large)",
              }}
            >
              {personalMatterCountViewMode === "graph" &&
              personalMatterCountPeriodView === "all" &&
              personalMatterCountViewType !== "department" ? (
                // 全期間：円グラフ表示
                <div
                  style={{
                    display: "flex",
                    gap: "var(--aegis-space-xLarge)",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  {/* 新規案件数の円グラフ */}
                  {personalMatterCountViewType === "dueDate" &&
                    personalMatterCountAllPeriodPieData &&
                    personalMatterCountAllPeriodPieData.newCaseData.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <Text variant="body.medium.bold" style={{ marginBottom: "var(--aegis-space-medium)" }}>
                          {t("newCaseCount")}
                        </Text>
                        <ResponsiveContainer width="100%" height={PANE_CHART_HEIGHT}>
                          <PieChart>
                            <Pie
                              data={personalMatterCountAllPeriodPieData.newCaseData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill={chartPalette.purple["600(base)"]}
                              dataKey="value"
                              nameKey="name"
                              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }) => {
                                if (
                                  cx === undefined ||
                                  cy === undefined ||
                                  midAngle === undefined ||
                                  innerRadius === undefined ||
                                  outerRadius === undefined ||
                                  percent === undefined ||
                                  !payload
                                ) {
                                  return null;
                                }
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                if (percent === 0) {
                                  return null;
                                }
                                const entry = payload as { name: string; value: number };
                                return (
                                  <text
                                    x={x}
                                    y={y}
                                    fill="white"
                                    textAnchor={x > cx ? "start" : "end"}
                                    dominantBaseline="central"
                                    fontSize="14"
                                    fontWeight="bold"
                                  >
                                    {`${(percent * 100).toFixed(0)}%`}
                                    <tspan x={x} dy="18" fontSize="12">
                                      {locale === "ja-JP" ? `${entry.value}件` : `${entry.value}`}
                                    </tspan>
                                  </text>
                                );
                              }}
                            >
                              {personalMatterCountAllPeriodPieData.newCaseData.map((entry) => (
                                <Cell key={`cell-new-${entry.name}`} fill={chartPalette.purple["600(base)"]} />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              content={<CustomChartTooltip locale={locale} />}
                              wrapperStyle={{ outline: "none", transition: "none" }}
                              animationDuration={0}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  {personalMatterCountViewType === "caseType" &&
                    personalMatterCountAllPeriodByCaseTypePieData &&
                    personalMatterCountAllPeriodByCaseTypePieData.newCaseData.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <ResponsiveContainer width="100%" height={PANE_CHART_HEIGHT}>
                          <PieChart>
                            <Pie
                              data={personalMatterCountAllPeriodByCaseTypePieData.newCaseData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              innerRadius={60}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
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
                                const RADIAN = Math.PI / 180;
                                const radius = outerRadius + 20;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                return (
                                  <text
                                    x={x}
                                    y={y}
                                    fill="var(--aegis-color-font-default)"
                                    textAnchor={x > cx ? "start" : "end"}
                                    dominantBaseline="central"
                                    fontSize="12"
                                  >
                                    {`${name} (${(percent * 100).toFixed(0)}%)`}
                                  </text>
                                );
                              }}
                            >
                              {personalMatterCountAllPeriodByCaseTypePieData.newCaseData.map((entry) => (
                                <Cell
                                  key={`cell-new-${entry.originalName || entry.name}`}
                                  fill={CASE_TYPE_COLORS[(entry.originalName || entry.name) as CaseType]}
                                />
                              ))}
                              <LabelList
                                dataKey="value"
                                position="inside"
                                formatter={(value: unknown) => {
                                  const numValue = typeof value === "number" ? value : Number(value);
                                  return locale === "ja-JP" ? `${numValue}件` : numValue;
                                }}
                                style={{ fill: "white", fontSize: "12", fontWeight: "bold" }}
                              />
                            </Pie>
                            <Label
                              value={personalMatterCountAllPeriodByCaseTypePieData.newCaseData.reduce(
                                (sum, item) => sum + item.value,
                                0,
                              )}
                              position="center"
                              style={{
                                fontSize: "16",
                                fontWeight: "normal",
                                fill: "var(--aegis-color-font-default)",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  {/* 完了案件数の円グラフ */}
                  {personalMatterCountViewType === "dueDate" &&
                    personalMatterCountAllPeriodPieData &&
                    personalMatterCountAllPeriodPieData.completedData.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <ResponsiveContainer width="100%" height={PANE_CHART_HEIGHT}>
                          <PieChart>
                            <Pie
                              data={personalMatterCountAllPeriodPieData.completedData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              innerRadius={60}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
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
                                const RADIAN = Math.PI / 180;
                                const radius = outerRadius + 20;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                return (
                                  <text
                                    x={x}
                                    y={y}
                                    fill="var(--aegis-color-font-default)"
                                    textAnchor={x > cx ? "start" : "end"}
                                    dominantBaseline="central"
                                    fontSize="12"
                                  >
                                    {`${name} (${(percent * 100).toFixed(0)}%)`}
                                  </text>
                                );
                              }}
                            >
                              {personalMatterCountAllPeriodPieData.completedData.map((entry) => {
                                let fillColor = chartPalette.grass["600(base)"];
                                if (entry.name === t("overdueCompletionLegend")) {
                                  fillColor = chartPalette.amber["600(base)"];
                                } else if (entry.name === t("noDueDateCompletionLegend")) {
                                  fillColor = chartPalette.neutral["600(base)"];
                                }
                                return <Cell key={`cell-completed-${entry.name}`} fill={fillColor} />;
                              })}
                              <LabelList
                                dataKey="value"
                                position="inside"
                                formatter={(value: unknown) => {
                                  const numValue = typeof value === "number" ? value : Number(value);
                                  return locale === "ja-JP" ? `${numValue}件` : numValue;
                                }}
                                style={{ fill: "white", fontSize: "12", fontWeight: "bold" }}
                              />
                            </Pie>
                            <Label
                              value={personalMatterCountAllPeriodPieData.completedData.reduce(
                                (sum, item) => sum + item.value,
                                0,
                              )}
                              position="center"
                              style={{
                                fontSize: "16",
                                fontWeight: "normal",
                                fill: "var(--aegis-color-font-default)",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  {personalMatterCountViewType === "caseType" &&
                    personalMatterCountAllPeriodByCaseTypePieData &&
                    personalMatterCountAllPeriodByCaseTypePieData.completedData.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <ResponsiveContainer width="100%" height={PANE_CHART_HEIGHT}>
                          <PieChart>
                            <Pie
                              data={personalMatterCountAllPeriodByCaseTypePieData.completedData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              innerRadius={60}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
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
                                const RADIAN = Math.PI / 180;
                                const radius = outerRadius + 20;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                return (
                                  <text
                                    x={x}
                                    y={y}
                                    fill="var(--aegis-color-font-default)"
                                    textAnchor={x > cx ? "start" : "end"}
                                    dominantBaseline="central"
                                    fontSize="12"
                                  >
                                    {`${name} (${(percent * 100).toFixed(0)}%)`}
                                  </text>
                                );
                              }}
                            >
                              {personalMatterCountAllPeriodByCaseTypePieData.completedData.map((entry) => (
                                <Cell
                                  key={`cell-completed-${entry.originalName || entry.name}`}
                                  fill={CASE_TYPE_COLORS[(entry.originalName || entry.name) as CaseType]}
                                />
                              ))}
                              <LabelList
                                dataKey="value"
                                position="inside"
                                formatter={(value: unknown) => {
                                  const numValue = typeof value === "number" ? value : Number(value);
                                  return locale === "ja-JP" ? `${numValue}件` : numValue;
                                }}
                                style={{ fill: "white", fontSize: "12", fontWeight: "bold" }}
                              />
                            </Pie>
                            <Label
                              value={personalMatterCountAllPeriodByCaseTypePieData.completedData.reduce(
                                (sum, item) => sum + item.value,
                                0,
                              )}
                              position="center"
                              style={{
                                fontSize: "16",
                                fontWeight: "normal",
                                fill: "var(--aegis-color-font-default)",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                </div>
              ) : personalMatterCountViewMode === "graph" &&
                personalMatterCountPeriodView === "monthly" &&
                personalMatterCountViewType === "dueDate" ? (
                <ResponsiveContainer width="100%" height={PANE_CHART_HEIGHT}>
                  <BarChart
                    data={personalMatterCountData[selectedMember] || []}
                    margin={{
                      top: 28,
                      right: 24,
                      left: 24,
                      bottom: 16,
                    }}
                    accessibilityLayer
                  >
                    <XAxis
                      allowDecimals={false}
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                      tick={(tickProps) => (
                        <CustomXAxisTick {...tickProps} showPreviousYearComparison={false} locale={locale} />
                      )}
                    />
                    <YAxis hide />
                    <RechartsTooltip
                      content={<CustomChartTooltip locale={locale} />}
                      shared={true}
                      cursor={{ fill: "#f1f5f9" }}
                      wrapperStyle={{ outline: "none", transition: "none" }}
                      animationDuration={0}
                    />
                    <Legend content={renderCustomLegend({ locale })} />
                    <Bar
                      dataKey="onTimeCompletionCount"
                      fill={COMPLETED_DUE_DATE_STYLES.納期内.backgroundColor}
                      name={t("onTimeCompletionLegend")}
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
                        const overdue = (p.payload.overdueCompletionCount || 0) > 0;
                        const noDueDate = (p.payload.noDueDateCompletionCount || 0) > 0;
                        const hasValueBelow = false;
                        const hasValueAbove = overdue || noDueDate;
                        const style = COMPLETED_DUE_DATE_STYLES.納期内;

                        if (hasValueBelow && hasValueAbove) {
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[0, 0, 0, 0]}
                              barBorder={style.barBorder}
                            />
                          );
                        } else if (hasValueBelow && !hasValueAbove) {
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[4, 4, 0, 0]}
                              barBorder={style.barBorder}
                            />
                          );
                        } else if (!hasValueBelow && hasValueAbove) {
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[0, 0, 4, 4]}
                              barBorder={style.barBorder}
                            />
                          );
                        } else {
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[4, 4, 4, 4]}
                              barBorder={style.barBorder}
                            />
                          );
                        }
                      }}
                    >
                      <LabelList
                        dataKey="onTimeCompletionCount"
                        content={(props: LabelListContentProps) => (
                          <BadgeLabel
                            {...props}
                            dataKey="onTimeCompletionCount"
                            badgeVariant={COMPLETED_DUE_DATE_STYLES.納期内.badgeVariant}
                          />
                        )}
                      />
                    </Bar>
                    <Bar
                      dataKey="overdueCompletionCount"
                      fill={COMPLETED_DUE_DATE_STYLES.納期超過.backgroundColor}
                      name={t("overdueCompletionLegend")}
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
                        const onTime = (p.payload.onTimeCompletionCount || 0) > 0;
                        const noDueDate = (p.payload.noDueDateCompletionCount || 0) > 0;
                        const hasValueBelow = onTime;
                        const hasValueAbove = noDueDate;
                        const style = COMPLETED_DUE_DATE_STYLES.納期超過;

                        if (hasValueBelow && hasValueAbove) {
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[0, 0, 0, 0]}
                              barBorder={style.barBorder}
                            />
                          );
                        } else if (hasValueBelow && !hasValueAbove) {
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[4, 4, 0, 0]}
                              barBorder={style.barBorder}
                            />
                          );
                        } else if (!hasValueBelow && hasValueAbove) {
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[0, 0, 4, 4]}
                              barBorder={style.barBorder}
                            />
                          );
                        } else {
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[4, 4, 4, 4]}
                              barBorder={style.barBorder}
                            />
                          );
                        }
                      }}
                    >
                      <LabelList
                        dataKey="overdueCompletionCount"
                        content={(props: LabelListContentProps) => (
                          <BadgeLabel
                            {...props}
                            dataKey="overdueCompletionCount"
                            badgeVariant={COMPLETED_DUE_DATE_STYLES.納期超過.badgeVariant}
                          />
                        )}
                      />
                    </Bar>
                    <Bar
                      dataKey="noDueDateCompletionCount"
                      fill={COMPLETED_DUE_DATE_STYLES.納期未入力.backgroundColor}
                      name={t("noDueDateCompletionLegend")}
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
                        const onTime = (p.payload.onTimeCompletionCount || 0) > 0;
                        const overdue = (p.payload.overdueCompletionCount || 0) > 0;
                        const hasValueBelow = onTime || overdue;
                        const hasValueAbove = false;
                        const style = COMPLETED_DUE_DATE_STYLES.納期未入力;

                        if (hasValueBelow && hasValueAbove) {
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[0, 0, 0, 0]}
                              barBorder={style.barBorder}
                              svgPattern={style.svgPattern}
                            />
                          );
                        } else if (hasValueBelow && !hasValueAbove) {
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[4, 4, 0, 0]}
                              barBorder={style.barBorder}
                              svgPattern={style.svgPattern}
                            />
                          );
                        } else if (!hasValueBelow && hasValueAbove) {
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[0, 0, 4, 4]}
                              barBorder={style.barBorder}
                              svgPattern={style.svgPattern}
                            />
                          );
                        } else {
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[4, 4, 4, 4]}
                              barBorder={style.barBorder}
                              svgPattern={style.svgPattern}
                            />
                          );
                        }
                      }}
                    >
                      <LabelList
                        dataKey="noDueDateCompletionCount"
                        content={(props: LabelListContentProps) => (
                          <BadgeLabel
                            {...props}
                            dataKey="noDueDateCompletionCount"
                            badgeVariant={COMPLETED_DUE_DATE_STYLES.納期未入力.badgeVariant}
                          />
                        )}
                      />
                      <LabelList
                        position="top"
                        offset={12}
                        content={(props: LabelListContentProps) => {
                          const data = personalMatterCountData[selectedMember] || [];
                          if (props.index === undefined) return null;
                          const rowData = data[props.index];
                          if (!rowData) return null;
                          const total =
                            (rowData.onTimeCompletionCount || 0) +
                            (rowData.overdueCompletionCount || 0) +
                            (rowData.noDueDateCompletionCount || 0);
                          if (total === 0) return null;
                          return <TopLabel {...props} value={total} dataKey="案件数" />;
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : personalMatterCountViewMode === "graph" &&
                personalMatterCountPeriodView === "monthly" &&
                personalMatterCountViewType === "caseType" ? (
                <ResponsiveContainer width="100%" height={PANE_CHART_HEIGHT}>
                  <BarChart
                    data={personalMatterCountByCaseTypeData[selectedMember] || []}
                    margin={{
                      top: 28,
                      right: 24,
                      left: 24,
                      bottom: 16,
                    }}
                    accessibilityLayer
                  >
                    <XAxis
                      allowDecimals={false}
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                      tick={(tickProps) => (
                        <CustomXAxisTick {...tickProps} showPreviousYearComparison={false} locale={locale} />
                      )}
                    />
                    <YAxis hide />
                    <RechartsTooltip
                      content={<CustomChartTooltip locale={locale} />}
                      shared={true}
                      cursor={{ fill: "#f1f5f9" }}
                      wrapperStyle={{ outline: "none", transition: "none" }}
                      animationDuration={0}
                    />
                    <Legend content={renderCustomLegend({ locale })} />
                    {/* 今年の完了案件数（すべての案件タイプを積み上げ） */}
                    {CASE_TYPE_ORDER.map((caseType) => {
                      const localizedName = CASE_TYPE_MAPPING[locale][caseType] || caseType;
                      const style = CASE_TYPE_CATEGORY_STYLES[caseType];
                      const fill = style?.svgPattern
                        ? "transparent"
                        : (style?.backgroundColor ?? CASE_TYPE_COLORS[caseType]);
                      return (
                        <Bar
                          key={`${caseType}_完了案件数`}
                          dataKey={`${caseType}_完了案件数`}
                          fill={fill}
                          name={localizedName}
                          stackId="completed"
                          // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                          shape={(barProps: any) => {
                            const { payload, dataKey } = barProps;
                            const currentIndex = CASE_TYPE_ORDER.findIndex((ct) => `${ct}_完了案件数` === dataKey);
                            const isFirstInStack = currentIndex === 0;

                            // 同じstackId内で下に値があるかチェック
                            const hasValueBelowInStack = CASE_TYPE_ORDER.slice(0, currentIndex).some(
                              (ct) => ((payload?.[`${ct}_完了案件数`] as number) || 0) > 0,
                            );
                            // 同じstackId内で上に値があるかチェック
                            const hasValueAboveInStack = CASE_TYPE_ORDER.slice(currentIndex + 1).some(
                              (ct) => ((payload?.[`${ct}_完了案件数`] as number) || 0) > 0,
                            );

                            const hasValueBelow = hasValueBelowInStack;
                            const hasValueAbove = hasValueAboveInStack;

                            // 完了案件数の一番下（同じstackId内で最初）で、かつ同じstackId内で下に値がない場合、下側のみ角丸
                            if (isFirstInStack && !hasValueBelowInStack) {
                              return (
                                <VerticalBarWithDivider
                                  {...barProps}
                                  hideDivider={true}
                                  radius={[0, 0, 4, 4]}
                                  barBorder={style?.barBorder}
                                  svgPattern={style?.svgPattern}
                                  hasValueBefore={hasValueBelow}
                                  hasValueAfter={hasValueAbove}
                                />
                              );
                            }

                            if (hasValueBelow && hasValueAbove) {
                              return (
                                <VerticalBarWithDivider
                                  {...barProps}
                                  hideDivider={true}
                                  radius={[0, 0, 0, 0]}
                                  barBorder={style?.barBorder}
                                  svgPattern={style?.svgPattern}
                                  hasValueBefore={hasValueBelow}
                                  hasValueAfter={hasValueAbove}
                                />
                              );
                            } else if (hasValueBelow && !hasValueAbove) {
                              return (
                                <VerticalBarWithDivider
                                  {...barProps}
                                  hideDivider={true}
                                  radius={[4, 4, 0, 0]}
                                  barBorder={style?.barBorder}
                                  svgPattern={style?.svgPattern}
                                  hasValueBefore={hasValueBelow}
                                  hasValueAfter={hasValueAbove}
                                />
                              );
                            } else if (!hasValueBelow && hasValueAbove) {
                              return (
                                <VerticalBarWithDivider
                                  {...barProps}
                                  hideDivider={true}
                                  radius={[0, 0, 4, 4]}
                                  barBorder={style?.barBorder}
                                  svgPattern={style?.svgPattern}
                                  hasValueBefore={hasValueBelow}
                                  hasValueAfter={hasValueAbove}
                                />
                              );
                            } else {
                              return (
                                <VerticalBarWithDivider
                                  {...barProps}
                                  hideDivider={true}
                                  radius={[4, 4, 4, 4]}
                                  barBorder={style?.barBorder}
                                  svgPattern={style?.svgPattern}
                                  hasValueBefore={hasValueBelow}
                                  hasValueAfter={hasValueAbove}
                                />
                              );
                            }
                          }}
                        >
                          <LabelList
                            dataKey={`${caseType}_完了案件数`}
                            content={(props: LabelListContentProps) => (
                              <BadgeLabel
                                {...props}
                                dataKey={`${caseType}_完了案件数`}
                                badgeVariant={style?.badgeVariant}
                              />
                            )}
                          />
                        </Bar>
                      );
                    })}
                    {/* 完了案件数の合計をバーの上に表示 */}
                    {CASE_TYPE_ORDER.length > 0 && (
                      <Bar
                        key="完了案件数_合計"
                        dataKey="dummy"
                        stackId="completed"
                        fill="transparent"
                        opacity={0}
                        legendType="none"
                      >
                        <LabelList
                          position="top"
                          offset={12}
                          content={(props: LabelListContentProps) => {
                            if (props.index === undefined) return null;
                            const data = personalMatterCountByCaseTypeData[selectedMember] || [];
                            const rowData = data[props.index];
                            if (!rowData) return null;
                            // すべての案件タイプの完了案件数の合計を計算
                            const total = CASE_TYPE_ORDER.reduce((sum, caseType) => {
                              return sum + ((rowData[`${caseType}_完了案件数`] as number) || 0);
                            }, 0);
                            if (total === 0) return null;
                            return <TopLabel {...props} value={total} dataKey="完了案件数" />;
                          }}
                        />
                      </Bar>
                    )}
                    <CartesianGrid vertical={false} horizontal={false} stroke="#e2e8f0" />
                  </BarChart>
                </ResponsiveContainer>
              ) : personalMatterCountViewMode === "table" && personalMatterCountViewType === "dueDate" ? (
                <DataTable
                  columns={(() => {
                    const columns: DataTableColumnDef<
                      (typeof personalMatterCountData)[string][number],
                      string | number
                    >[] = [
                      {
                        id: "name",
                        name: t("month"),
                        getValue: (row) => row.name,
                        renderCell: (info) => (
                          <DataTableCell>
                            <Text variant="body.medium">{info.row.name}</Text>
                          </DataTableCell>
                        ),
                      },
                      {
                        id: "totalCompletionCount",
                        name: t("total"),
                        getValue: (row) =>
                          row.onTimeCompletionCount + row.overdueCompletionCount + row.noDueDateCompletionCount,
                        renderCell: (info) => (
                          <DataTableCell>
                            <Text variant="body.medium">{info.value}</Text>
                          </DataTableCell>
                        ),
                      },
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
                    ];
                    return columns;
                  })()}
                  rows={personalMatterCountData[selectedMember] || []}
                  defaultColumnPinning={{ start: ["name"] }}
                  highlightRowOnHover={false}
                />
              ) : personalMatterCountViewMode === "table" && personalMatterCountViewType === "caseType" ? (
                <DataTable
                  columns={personalMatterCountByCaseTypeTableColumns}
                  rows={personalMatterCountByCaseTypeData[selectedMember] || []}
                  defaultColumnPinning={{ start: ["name"] }}
                  highlightRowOnHover={false}
                />
              ) : null}
            </div>
          </div>
        </CardBody>
      </Card>
      {/* Lead Time Card */}
      <Card variant="fill">
        <CardBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", alignItems: "center" }}>
                  <Text variant="body.medium.bold">{t("processingSpeed")}</Text>
                  <Popover
                    open={isPersonalLeadTimeInfoPopoverOpen}
                    onOpenChange={(open) => {
                      setIsPersonalLeadTimeInfoPopoverOpen(open);
                      if (!open) {
                        setIsPersonalLeadTimeInfoPopoverPinned(false);
                      }
                    }}
                    arrow
                    placement="bottom-start"
                    closeOnBlur={true}
                  >
                    <Popover.Anchor>
                      <IconButton
                        variant="plain"
                        size="small"
                        aria-label={t("monthlyGraphViewLeadTime")}
                        icon={LfQuestionCircle}
                        onMouseEnter={() => {
                          if (!isPersonalLeadTimeInfoPopoverPinned) {
                            setIsPersonalLeadTimeInfoPopoverOpen(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isPersonalLeadTimeInfoPopoverPinned) {
                            setIsPersonalLeadTimeInfoPopoverOpen(false);
                          }
                        }}
                        onClickCapture={(e) => {
                          e.stopPropagation();
                          setIsPersonalLeadTimeInfoPopoverOpen(true);
                          setIsPersonalLeadTimeInfoPopoverPinned(true);
                        }}
                      />
                    </Popover.Anchor>
                    <Popover.Content width="small">
                      <Popover.Body>
                        <Text variant="body.small">{t("personalPerformanceDescription")}</Text>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover>
                </div>
                {leadTimeDateRange && (
                  <Text variant="body.small" style={{ color: "var(--aegis-color-text-secondary)" }}>
                    {leadTimeDateRange}
                  </Text>
                )}
              </div>
              <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
                <ButtonGroup variant="plain" size="medium">
                  <Popover
                    open={isPersonalLeadTimeFilterOpen}
                    onOpenChange={onIsPersonalLeadTimeFilterOpenChange}
                    placement="bottom-end"
                  >
                    <Popover.Anchor>
                      <Tooltip title={t("filter")}>
                        <IconButton
                          variant={
                            personalLeadTimeCaseTypeFilter !== "すべて" || isLeadTimeDateRangeFiltered
                              ? "subtle"
                              : "plain"
                          }
                          color={
                            personalLeadTimeCaseTypeFilter !== "すべて" || isLeadTimeDateRangeFiltered
                              ? "information"
                              : undefined
                          }
                          size="medium"
                          aria-label={t("filter")}
                        >
                          <Badge
                            color="information"
                            invisible={personalLeadTimeCaseTypeFilter === "すべて" && !isLeadTimeDateRangeFiltered}
                          >
                            <Icon>
                              <LfFilter />
                            </Icon>
                          </Badge>
                        </IconButton>
                      </Tooltip>
                    </Popover.Anchor>
                    <Popover.Content width="medium">
                      <Popover.Body>
                        <Form>
                          <FormControl orientation="vertical">
                            <FormControl.Label>{t("caseType")}</FormControl.Label>
                            <Select
                              size="medium"
                              value={personalLeadTimeCaseTypeFilter}
                              onChange={onPersonalLeadTimeCaseTypeFilterChange}
                              options={[
                                { label: t("all"), value: "すべて" },
                                ...CASE_TYPE_ORDER.map((type) => ({
                                  label: CASE_TYPE_MAPPING[locale][type] || type,
                                  value: type,
                                })),
                              ]}
                            />
                          </FormControl>
                          <FormControl orientation="vertical">
                            <FormControl.Label>{t("aggregationPeriod")}</FormControl.Label>
                            <FormGroup>
                              <FormControl>
                                <Select
                                  size="medium"
                                  placeholder={t("startMonth")}
                                  value={
                                    personalLeadTimeDateRange.start
                                      ? locale === "ja-JP"
                                        ? `${personalLeadTimeDateRange.start.getFullYear()}/${personalLeadTimeDateRange.start.getMonth() + 1}`
                                        : `${personalLeadTimeDateRange.start.toLocaleString(locale, { month: "short" })} ${personalLeadTimeDateRange.start.getFullYear()}`
                                      : undefined
                                  }
                                  onChange={(value) => {
                                    if (value) {
                                      let year: number;
                                      let month: number;
                                      if (locale === "ja-JP") {
                                        [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                      } else {
                                        [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                      }
                                      const start = new Date(year, month - 1, 1);
                                      onPersonalLeadTimeDateRangeChange({
                                        ...personalLeadTimeDateRange,
                                        start,
                                      });
                                    } else {
                                      onPersonalLeadTimeDateRangeChange({
                                        ...personalLeadTimeDateRange,
                                        start: null,
                                      });
                                    }
                                  }}
                                  options={(() => {
                                    const options: Array<{ label: string; value: string }> = [];
                                    const today = new Date();
                                    for (let i = 23; i >= 0; i--) {
                                      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                                      const year = date.getFullYear();
                                      const month = date.getMonth() + 1;
                                      const value = `${year}/${month}`;
                                      const label =
                                        locale === "ja-JP"
                                          ? value
                                          : `${date.toLocaleString(locale, { month: "short" })} ${year}`;
                                      options.push({ label, value });
                                    }
                                    return options;
                                  })()}
                                />
                              </FormControl>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text variant="body.small">-</Text>
                              </div>
                              <FormControl>
                                <Select
                                  size="medium"
                                  placeholder={t("endMonth")}
                                  value={
                                    personalLeadTimeDateRange.end
                                      ? locale === "ja-JP"
                                        ? `${personalLeadTimeDateRange.end.getFullYear()}/${personalLeadTimeDateRange.end.getMonth() + 1}`
                                        : `${personalLeadTimeDateRange.end.toLocaleString(locale, { month: "short" })} ${personalLeadTimeDateRange.end.getFullYear()}`
                                      : undefined
                                  }
                                  onChange={(value) => {
                                    if (value) {
                                      let year: number;
                                      let month: number;
                                      if (locale === "ja-JP") {
                                        [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                      } else {
                                        [year, month] = value.split("/").map((s) => parseInt(s, 10));
                                      }
                                      const end = new Date(year, month, 0);
                                      onPersonalLeadTimeDateRangeChange({
                                        ...personalLeadTimeDateRange,
                                        end,
                                      });
                                    } else {
                                      onPersonalLeadTimeDateRangeChange({
                                        ...personalLeadTimeDateRange,
                                        end: null,
                                      });
                                    }
                                  }}
                                  options={(() => {
                                    const options: Array<{ label: string; value: string }> = [];
                                    const today = new Date();
                                    for (let i = 23; i >= 0; i--) {
                                      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                                      const year = date.getFullYear();
                                      const month = date.getMonth() + 1;
                                      const value = `${year}/${month}`;
                                      const label =
                                        locale === "ja-JP"
                                          ? value
                                          : `${date.toLocaleString(locale, { month: "short" })} ${year}`;
                                      options.push({ label, value });
                                    }
                                    return options;
                                  })()}
                                />
                              </FormControl>
                            </FormGroup>
                          </FormControl>
                        </Form>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover>
                  {(personalLeadTimeCaseTypeFilter !== "すべて" || isLeadTimeDateRangeFiltered) && (
                    <Button
                      variant="subtle"
                      size="medium"
                      onClick={() => {
                        onPersonalLeadTimeCaseTypeFilterChange("すべて");
                        onPersonalLeadTimeDateRangeChange(initialDateRange);
                      }}
                    >
                      {t("reset")}
                    </Button>
                  )}
                  <Menu
                    open={isPersonalLeadTimeViewModeMenuOpen}
                    onOpenChange={setIsPersonalLeadTimeViewModeMenuOpen}
                    placement="bottom-end"
                  >
                    <Menu.Anchor>
                      <Tooltip title={personalLeadTimeViewMode === "table" ? t("table") : t("graph")}>
                        <IconButton
                          variant="plain"
                          size="medium"
                          aria-label={personalLeadTimeViewMode === "table" ? t("table") : t("graph")}
                          icon={personalLeadTimeViewMode === "graph" ? LfChartBar : LfTable}
                        />
                      </Tooltip>
                    </Menu.Anchor>
                    <Menu.Box width="auto">
                      <ActionList size="large">
                        <ActionList.Item
                          selected={personalLeadTimeViewMode === "graph"}
                          onClick={() => {
                            onPersonalLeadTimeViewModeChange("graph");
                            setIsPersonalLeadTimeViewModeMenuOpen(false);
                          }}
                        >
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfChartBar />
                              </Icon>
                            }
                          >
                            {t("graph")}
                          </ActionList.Body>
                        </ActionList.Item>
                        <ActionList.Item
                          selected={personalLeadTimeViewMode === "table"}
                          onClick={() => {
                            onPersonalLeadTimeViewModeChange("table");
                            setIsPersonalLeadTimeViewModeMenuOpen(false);
                          }}
                        >
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfTable />
                              </Icon>
                            }
                          >
                            {t("table")}
                          </ActionList.Body>
                        </ActionList.Item>
                      </ActionList>
                    </Menu.Box>
                  </Menu>
                </ButtonGroup>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
              {personalLeadTimeViewMode === "graph" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xSmall)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--aegis-space-small)",
                    }}
                  >
                    <Card variant="plain" size="small" style={{ flex: 1 }}>
                      <CardBody style={{ gap: "var(--aegis-space-x3Small)" }}>
                        <Text variant="body.small">{t("firstResponseMedian")}</Text>
                        {personalLeadTimeAllPeriodData[selectedMember]?.初回返信速度中央値 &&
                        personalLeadTimeAllPeriodData[selectedMember].初回返信速度中央値 > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: "var(--aegis-space-xxSmall)",
                            }}
                          >
                            <Text variant="body.large.bold">
                              {personalLeadTimeAllPeriodData[selectedMember].初回返信速度中央値.toFixed(1)}
                            </Text>
                            <Text variant="body.small.bold">{t("days")}</Text>
                          </div>
                        ) : (
                          <Text variant="body.small">-</Text>
                        )}
                      </CardBody>
                    </Card>
                    <Card variant="plain" size="small" style={{ flex: 1 }}>
                      <CardBody style={{ gap: "var(--aegis-space-x3Small)" }}>
                        <Text variant="body.small">{t("monthlyGraphViewLeadTime")}</Text>
                        {personalLeadTimeAllPeriodData[selectedMember]?.リードタイム中央値 &&
                        personalLeadTimeAllPeriodData[selectedMember].リードタイム中央値 > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: "var(--aegis-space-xxSmall)",
                            }}
                          >
                            <Text variant="body.large.bold">
                              {personalLeadTimeAllPeriodData[selectedMember].リードタイム中央値.toFixed(1)}
                            </Text>
                            <Text variant="body.small.bold">{t("days")}</Text>
                          </div>
                        ) : (
                          <Text variant="body.small">-</Text>
                        )}
                      </CardBody>
                    </Card>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                  padding: "16px",
                  background: "var(--aegis-color-background-default)",
                  borderRadius: "var(--aegis-radius-large)",
                }}
              >
                {personalLeadTimeViewMode === "graph" ? (
                  <ResponsiveContainer width="100%" height={PANE_CHART_HEIGHT}>
                    <ComposedChart
                      data={personalLeadTimeData[selectedMember] || []}
                      margin={{
                        top: 16,
                        right: 32,
                        left: 32,
                        bottom: 16,
                      }}
                      accessibilityLayer
                    >
                      <XAxis
                        allowDecimals={false}
                        dataKey="name"
                        axisLine={true}
                        tickLine={false}
                        tickMargin={10}
                        tick={(tickProps) => (
                          <CustomXAxisTick
                            {...tickProps}
                            showPreviousYearComparison={false}
                            locale={locale}
                            caseTypeFilter={personalLeadTimeCaseTypeFilter}
                            filterByCompletionDate={true}
                          />
                        )}
                      />
                      <YAxis yAxisId="right" orientation="right" hide domain={[0, leadTimeMaxValue]} />
                      <RechartsTooltip
                        content={<CustomChartTooltip locale={locale} />}
                        shared={true}
                        cursor={false}
                        wrapperStyle={{ outline: "none", transition: "none" }}
                        animationDuration={0}
                      />
                      <Legend content={renderCustomLegend({ locale })} />
                      <Line
                        yAxisId="right"
                        type="linear"
                        dataKey="leadTimeMedian"
                        stroke={chartPalette.azure["500(border only)"]}
                        strokeWidth={2}
                        dot={{ stroke: chartPalette.azure["500(border only)"], strokeWidth: 2, r: 4, fill: "#fff" }}
                        activeDot={{
                          r: 8,
                          stroke: chartPalette.azure["500(border only)"],
                          strokeWidth: 3,
                          fill: "#fff",
                        }}
                        name={t("leadTimeMedianShort")}
                        legendType="circle"
                      >
                        <LabelList
                          position="top"
                          offset={12}
                          dataKey="leadTimeMedian"
                          content={(props) => {
                            const { value, x, y } = props;
                            if (
                              value === undefined ||
                              value === null ||
                              typeof value !== "number" ||
                              Number.isNaN(value)
                            ) {
                              return null;
                            }
                            return (
                              <text x={x} y={y} dy={-12} fill="#2E2E2E" fontSize={12} textAnchor="middle">
                                {value.toFixed(1)}
                              </text>
                            );
                          }}
                        />
                      </Line>
                      <Line
                        yAxisId="right"
                        type="linear"
                        dataKey="firstReplyTimeMedian"
                        stroke={chartPalette.orange["500(border only)"]}
                        strokeWidth={2}
                        dot={{ stroke: chartPalette.orange["500(border only)"], strokeWidth: 2, r: 4, fill: "#fff" }}
                        activeDot={{
                          r: 8,
                          stroke: chartPalette.orange["500(border only)"],
                          strokeWidth: 3,
                          fill: "#fff",
                        }}
                        name={t("firstResponseMedianShort")}
                        legendType="circle"
                      >
                        <LabelList
                          position="top"
                          offset={12}
                          dataKey="firstReplyTimeMedian"
                          content={(props) => {
                            const { value, x, y } = props;
                            if (
                              value === undefined ||
                              value === null ||
                              typeof value !== "number" ||
                              Number.isNaN(value)
                            ) {
                              return null;
                            }
                            return (
                              <text x={x} y={y} dy={-12} fill="#2E2E2E" fontSize={12} textAnchor="middle">
                                {value.toFixed(1)}
                              </text>
                            );
                          }}
                        />
                      </Line>
                      <CartesianGrid vertical={false} horizontal={false} stroke="#e2e8f0" />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <DataTable
                    columns={(() => {
                      const columns: DataTableColumnDef<
                        (typeof personalLeadTimeData)[string][number],
                        string | number
                      >[] = [
                        {
                          id: "name",
                          name: t("month"),
                          getValue: (row) => row.name,
                          renderCell: (info) => (
                            <DataTableCell>
                              <Text variant="body.medium">{info.row.name}</Text>
                            </DataTableCell>
                          ),
                        },
                        {
                          id: "leadTimeMedian",
                          name: t("leadTimeMedianShort"),
                          getValue: (row) => row.leadTimeMedian,
                          renderCell: (info) => {
                            const value = typeof info.value === "number" ? info.value : 0;
                            return (
                              <DataTableCell>
                                <Text variant="body.medium">
                                  {value > 0 ? `${value.toFixed(1)} ${t("days")}` : "-"}
                                </Text>
                              </DataTableCell>
                            );
                          },
                        },
                        {
                          id: "firstReplyTimeMedian",
                          name: t("firstResponseMedianShort"),
                          getValue: (row) => row.firstReplyTimeMedian,
                          renderCell: (info) => {
                            const value = typeof info.value === "number" ? info.value : 0;
                            return (
                              <DataTableCell>
                                <Text variant="body.medium">
                                  {value > 0 ? `${value.toFixed(1)} ${t("days")}` : "-"}
                                </Text>
                              </DataTableCell>
                            );
                          },
                        },
                      ];
                      return columns;
                    })()}
                    rows={[
                      {
                        name: t("allPeriod"),
                        onTimeCompletionCount: 0,
                        overdueCompletionCount: 0,
                        noDueDateCompletionCount: 0,
                        leadTimeMedian: personalLeadTimeAllPeriodData[selectedMember]?.リードタイム中央値 || 0,
                        firstReplyTimeMedian: personalLeadTimeAllPeriodData[selectedMember]?.初回返信速度中央値 || 0,
                      },
                      ...(personalLeadTimeData[selectedMember] || []),
                    ]}
                    defaultColumnPinning={{ start: ["name"] }}
                    highlightRowOnHover={false}
                  />
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
