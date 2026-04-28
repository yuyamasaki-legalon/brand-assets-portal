import { LfChartBar, LfCheck, LfFilter, LfQuestionCircle, LfTable } from "@legalforce/aegis-icons";
import {
  ActionList,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Checkbox,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Form,
  FormControl,
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
  Label,
  LabelList,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import chartPalette from "../ChartParette.json";
import { CASE_TYPE_MAPPING, CASE_TYPE_ORDER } from "../constants";
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

/** 背景色に応じて読みやすいテキスト色（白 or 黒）を返す */
function getContrastTextColor(backgroundColor: string | undefined): string {
  if (!backgroundColor || typeof backgroundColor !== "string") return "#2E2E2E";
  const hex = backgroundColor.trim();
  let r = 0;
  let g = 0;
  let b = 0;
  if (/^#([0-9a-fA-F]{3})$/.test(hex)) {
    const n = Number.parseInt(hex.slice(1), 16);
    r = ((n >> 8) & 0xf) * 0x11;
    g = ((n >> 4) & 0xf) * 0x11;
    b = (n & 0xf) * 0x11;
  } else if (/^#([0-9a-fA-F]{6})$/.test(hex)) {
    const n = Number.parseInt(hex.slice(1), 16);
    r = (n >> 16) & 0xff;
    g = (n >> 8) & 0xff;
    b = n & 0xff;
  } else {
    const rgb = hex.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (rgb) {
      r = Number(rgb[1]);
      g = Number(rgb[2]);
      b = Number(rgb[3]);
    } else {
      return "#2E2E2E";
    }
  }
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5 ? "#ffffff" : "#2E2E2E";
}

export interface CompletedCaseCountCardProps {
  // State
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
  performanceDateRange: { start: Date | null; end: Date | null };
  // Handlers
  onCaseCount2ViewModeChange: (mode: "graph" | "table") => void;
  onCaseCount2ViewTypeChange: (type: "dueDate" | "caseType" | "department") => void;
  onCaseCount2PeriodViewChange: (view: "all" | "monthly") => void;
  onCaseCount2ShowPreviousYearChange: (show: boolean) => void;
  onCaseCount2CaseTypeFilterChange: (filter: string) => void;
  onIsCaseCount2FilterOpenChange: (open: boolean) => void;
  // For CustomXAxisTick
  onPaneOpenChange: (open: boolean) => void;
  onSelectedMemberChange: (member: string | null) => void;
  onPaneTabIndexChange: (index: number) => void;
  onPanePerformanceDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
}

export function CompletedCaseCountCard(props: CompletedCaseCountCardProps) {
  const [isCaseCount2InfoPopoverOpen, setIsCaseCount2InfoPopoverOpen] = useState(false);
  const [isCaseCount2InfoPopoverPinned, setIsCaseCount2InfoPopoverPinned] = useState(false);
  const [isCaseCount2ViewModeMenuOpen, setIsCaseCount2ViewModeMenuOpen] = useState(false);
  const {
    caseCount2ViewMode,
    caseCount2ViewType,
    caseCount2PeriodView,
    caseCount2VisibleMetrics,
    caseCount2ShowPreviousYear,
    caseCount2CaseTypeFilter,
    isCaseCount2FilterOpen,
    caseCount2OverallPerformanceData,
    caseCount2MergedPerformanceData,
    caseCount2ByCaseTypeOverallPerformanceData,
    caseCount2ByCaseTypeMergedPerformanceData,
    caseCount2AllPeriodData,
    caseCount2AllPeriodPreviousYearData,
    caseCount2AllPeriodByCaseTypeData,
    caseCount2AllPeriodByCaseTypePreviousYearData,
    performanceDateRange,
    onCaseCount2ViewModeChange,
    onCaseCount2ViewTypeChange,
    onCaseCount2PeriodViewChange,
    onCaseCount2ShowPreviousYearChange,
    onCaseCount2CaseTypeFilterChange,
    onIsCaseCount2FilterOpenChange,
    onPaneOpenChange,
    onSelectedMemberChange,
    onPaneTabIndexChange,
    onPanePerformanceDateRangeChange,
  } = props;

  const { t, locale } = useTranslation(reportTranslations);

  // 集計期間をフォーマットする関数
  const formatDateRange = useMemo(() => {
    if (!performanceDateRange.start || !performanceDateRange.end) return "";
    const startYear = performanceDateRange.start.getFullYear();
    const startMonth = performanceDateRange.start.getMonth() + 1;
    const endYear = performanceDateRange.end.getFullYear();
    const endMonth = performanceDateRange.end.getMonth() + 1;
    if (locale === "ja-JP") {
      return `${startYear}/${startMonth} - ${endYear}/${endMonth}`;
    }
    const startMonthName = performanceDateRange.start.toLocaleString(locale, { month: "short" });
    const endMonthName = performanceDateRange.end.toLocaleString(locale, { month: "short" });
    return `${startMonthName} ${startYear} - ${endMonthName} ${endYear}`;
  }, [performanceDateRange, locale]);

  // 2つ目の案件数カード用のテーブル列定義
  const caseCount2TableColumns = useMemo(() => {
    const columns: DataTableColumnDef<(typeof caseCount2MergedPerformanceData)[0], string | number>[] = [
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
    ];

    // 完了案件数は常に表示
    // 合計（今年）
    columns.push({
      id: "完了案件数_合計_今年",
      name: caseCount2ShowPreviousYear ? `${t("total")}（${t("currentYear")}）` : t("total"),
      getValue: (row) => row.onTimeCompletionCount + row.overdueCompletionCount + row.noDueDateCompletionCount,
      renderCell: (info) => (
        <DataTableCell>
          <Text variant="body.medium">{info.value}</Text>
        </DataTableCell>
      ),
    });
    // 合計（昨年）
    if (caseCount2ShowPreviousYear) {
      columns.push({
        id: "完了案件数_合計_昨年",
        name: `${t("total")}（${t("previousYearLabel")}）`,
        getValue: (row) =>
          (row.onTimeCompletionCount_昨年 || 0) +
          (row.overdueCompletionCount_昨年 || 0) +
          (row.noDueDateCompletionCount_昨年 || 0),
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      });
    }
    columns.push({
      id: "onTimeCompletionCount",
      name: caseCount2ShowPreviousYear ? `${t("onTimeCompletion")}（${t("currentYear")}）` : t("onTimeCompletion"),
      getValue: (row) => row.onTimeCompletionCount,
      renderCell: (info) => (
        <DataTableCell>
          <Text variant="body.medium">{info.value}</Text>
        </DataTableCell>
      ),
    });
    if (caseCount2ShowPreviousYear) {
      columns.push({
        id: "onTimeCompletionCount_昨年",
        name: `${t("onTimeCompletion")} (${t("previousYearLabel")})`,
        getValue: (row) => row.onTimeCompletionCount_昨年,
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      });
    }
    columns.push({
      id: "overdueCompletionCount",
      name: caseCount2ShowPreviousYear ? `${t("overdueCompletion")}（${t("currentYear")}）` : t("overdueCompletion"),
      getValue: (row) => row.overdueCompletionCount,
      renderCell: (info) => (
        <DataTableCell>
          <Text variant="body.medium">{info.value}</Text>
        </DataTableCell>
      ),
    });
    if (caseCount2ShowPreviousYear) {
      columns.push({
        id: "overdueCompletionCount_昨年",
        name: `${t("overdueCompletion")} (${t("previousYearLabel")})`,
        getValue: (row) => row.overdueCompletionCount_昨年,
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      });
    }
    columns.push({
      id: "noDueDateCompletionCount",
      name: caseCount2ShowPreviousYear
        ? `${t("noDueDateCompletion")}（${t("currentYear")}）`
        : t("noDueDateCompletion"),
      getValue: (row) => row.noDueDateCompletionCount,
      renderCell: (info) => (
        <DataTableCell>
          <Text variant="body.medium">{info.value}</Text>
        </DataTableCell>
      ),
    });
    if (caseCount2ShowPreviousYear) {
      columns.push({
        id: "noDueDateCompletionCount_昨年",
        name: `${t("noDueDateCompletion")} (${t("previousYearLabel")})`,
        getValue: (row) => row.noDueDateCompletionCount_昨年,
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      });
    }

    return columns;
  }, [caseCount2ShowPreviousYear, t]);

  // 2つ目の案件数カード用の案件タイプ別テーブル列定義
  const caseCount2ByCaseTypeTableColumns = useMemo(() => {
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
    ];

    const filteredCaseTypes = caseCount2CaseTypeFilter === "すべて" ? CASE_TYPE_ORDER : [caseCount2CaseTypeFilter];

    // 完了案件数の合計カラムを追加
    // 合計（今年）
    columns.push({
      id: "完了案件数_合計_今年",
      name: caseCount2ShowPreviousYear ? `${t("total")}（${t("currentYear")}）` : t("total"),
      getValue: (row) => {
        return filteredCaseTypes.reduce((sum, caseType) => {
          return sum + ((row[`${caseType}_完了案件数`] as number) || 0);
        }, 0);
      },
      renderCell: (info) => (
        <DataTableCell>
          <Text variant="body.medium">{info.value}</Text>
        </DataTableCell>
      ),
    });

    // 合計（去年）
    if (caseCount2ShowPreviousYear) {
      columns.push({
        id: "完了案件数_合計_昨年",
        name: `${t("total")}（${t("previousYearLabel")}）`,
        getValue: (row) => {
          return filteredCaseTypes.reduce((sum, caseType) => {
            return sum + ((row[`${caseType}_完了案件数_昨年`] as number) || 0);
          }, 0);
        },
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      });
    }

    // 各案件タイプの完了案件数カラムを追加（今年→去年の順）
    filteredCaseTypes.forEach((caseType) => {
      const localizedName = CASE_TYPE_MAPPING[locale][caseType] || caseType;
      // 今年のカラム
      columns.push({
        id: `${caseType}_完了案件数`,
        name: caseCount2ShowPreviousYear ? `${localizedName}（${t("currentYear")}）` : localizedName,
        getValue: (row) => (row[`${caseType}_完了案件数`] as number) || 0,
        renderCell: (info) => (
          <DataTableCell>
            <Text variant="body.medium">{info.value}</Text>
          </DataTableCell>
        ),
      });
      // 昨年のカラム
      if (caseCount2ShowPreviousYear) {
        columns.push({
          id: `${caseType}_完了案件数_昨年`,
          name: `${localizedName}（${t("previousYearLabel")}）`,
          getValue: (row) => (row[`${caseType}_完了案件数_昨年`] as number) || 0,
          renderCell: (info) => (
            <DataTableCell>
              <Text variant="body.medium">{info.value}</Text>
            </DataTableCell>
          ),
        });
      }
    });

    return columns;
  }, [caseCount2ShowPreviousYear, t, locale, caseCount2CaseTypeFilter]);

  // 2つ目の案件数カード用のすべての期間用の円グラフデータ（納期別ビュー）
  const caseCount2AllPeriodPieData = useMemo(() => {
    if (caseCount2ViewType !== "dueDate") return null;

    const newCaseData = caseCount2VisibleMetrics.新規案件数
      ? [{ name: t("newCaseCount"), value: caseCount2AllPeriodData.新規案件数 }]
      : [];

    // 完了案件数は常に表示
    const completedData = [
      { name: t("onTimeCompletion"), value: caseCount2AllPeriodData.onTimeCompletionCount },
      { name: t("overdueCompletion"), value: caseCount2AllPeriodData.overdueCompletionCount },
      { name: t("noDueDateCompletion"), value: caseCount2AllPeriodData.noDueDateCompletionCount },
    ].filter((item) => item.value > 0);

    return { newCaseData, completedData };
  }, [caseCount2ViewType, caseCount2VisibleMetrics, caseCount2AllPeriodData, t]);

  // 2つ目の案件数カード用のすべての期間用の昨年円グラフデータ（納期別ビュー）
  const caseCount2AllPeriodPreviousYearPieData = useMemo(() => {
    if (caseCount2ViewType !== "dueDate") return null;

    const newCaseData = caseCount2VisibleMetrics.新規案件数
      ? [{ name: t("newCaseCount"), value: caseCount2AllPeriodPreviousYearData?.新規案件数 || 0 }]
      : [];

    // 完了案件数は常に表示
    const completedData = [
      { name: t("onTimeCompletion"), value: caseCount2AllPeriodPreviousYearData?.onTimeCompletionCount || 0 },
      { name: t("overdueCompletion"), value: caseCount2AllPeriodPreviousYearData?.overdueCompletionCount || 0 },
      { name: t("noDueDateCompletion"), value: caseCount2AllPeriodPreviousYearData?.noDueDateCompletionCount || 0 },
    ].filter((item) => item.value > 0);

    return { newCaseData, completedData };
  }, [caseCount2ViewType, caseCount2VisibleMetrics, caseCount2AllPeriodPreviousYearData, t]);

  // 2つ目の案件数カード用のすべての期間用の円グラフデータ（案件タイプ別ビュー）
  const caseCount2AllPeriodByCaseTypePieData = useMemo(() => {
    if (caseCount2ViewType !== "caseType") return null;

    const filteredCaseTypes = caseCount2CaseTypeFilter === "すべて" ? CASE_TYPE_ORDER : [caseCount2CaseTypeFilter];

    const newCaseData = caseCount2VisibleMetrics.新規案件数
      ? filteredCaseTypes
          .map((caseType) => ({
            name: CASE_TYPE_MAPPING[locale][caseType] || caseType,
            value: caseCount2AllPeriodByCaseTypeData[caseType]?.新規案件数 || 0,
            originalName: caseType,
          }))
          .filter((item) => item.value > 0)
      : [];

    // 完了案件数は常に表示
    const completedData = filteredCaseTypes
      .map((caseType) => ({
        name: CASE_TYPE_MAPPING[locale][caseType] || caseType,
        value: caseCount2AllPeriodByCaseTypeData[caseType]?.完了案件数 || 0,
        originalName: caseType,
      }))
      .filter((item) => item.value > 0);

    return { newCaseData, completedData };
  }, [
    caseCount2ViewType,
    caseCount2VisibleMetrics,
    caseCount2AllPeriodByCaseTypeData,
    locale,
    caseCount2CaseTypeFilter,
  ]);

  // 2つ目の案件数カード用のすべての期間用の昨年円グラフデータ（案件タイプ別ビュー）
  const caseCount2AllPeriodByCaseTypePreviousYearPieData = useMemo(() => {
    if (caseCount2ViewType !== "caseType") return null;

    const filteredCaseTypes = caseCount2CaseTypeFilter === "すべて" ? CASE_TYPE_ORDER : [caseCount2CaseTypeFilter];

    const newCaseData = caseCount2VisibleMetrics.新規案件数
      ? filteredCaseTypes
          .map((caseType) => ({
            name: CASE_TYPE_MAPPING[locale][caseType] || caseType,
            value: caseCount2AllPeriodByCaseTypePreviousYearData[caseType]?.新規案件数 || 0,
            originalName: caseType,
          }))
          .filter((item) => item.value > 0)
      : [];

    // 完了案件数は常に表示
    const completedData = filteredCaseTypes
      .map((caseType) => ({
        name: CASE_TYPE_MAPPING[locale][caseType] || caseType,
        value: caseCount2AllPeriodByCaseTypePreviousYearData[caseType]?.完了案件数 || 0,
        originalName: caseType,
      }))
      .filter((item) => item.value > 0);

    return { newCaseData, completedData };
  }, [
    caseCount2ViewType,
    caseCount2VisibleMetrics,
    caseCount2AllPeriodByCaseTypePreviousYearData,
    locale,
    caseCount2CaseTypeFilter,
  ]);

  return (
    <Card variant="fill" style={{ flex: "1 0 100%" }}>
      <CardBody>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "var(--aegis-space-medium)", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", alignItems: "center" }}>
                  <Text variant="body.medium.bold">{t("completedCaseCountCardTitle")}</Text>
                  <Popover
                    open={isCaseCount2InfoPopoverOpen}
                    onOpenChange={(open) => {
                      setIsCaseCount2InfoPopoverOpen(open);
                      if (!open) {
                        setIsCaseCount2InfoPopoverPinned(false);
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
                        aria-label={t("teamPerformance")}
                        icon={LfQuestionCircle}
                        onMouseEnter={() => {
                          if (!isCaseCount2InfoPopoverPinned) {
                            setIsCaseCount2InfoPopoverOpen(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isCaseCount2InfoPopoverPinned) {
                            setIsCaseCount2InfoPopoverOpen(false);
                          }
                        }}
                        onClickCapture={(e) => {
                          e.stopPropagation();
                          setIsCaseCount2InfoPopoverOpen(true);
                          setIsCaseCount2InfoPopoverPinned(true);
                        }}
                      />
                    </Popover.Anchor>
                    <Popover.Content width="small">
                      <Popover.Body>
                        <Text variant="body.small" style={{ whiteSpace: "pre-line" }}>
                          <span style={{ fontWeight: "bold" }}>{t("completedCaseCountCardDescriptionTitle")}</span>
                          {"\n"}
                          {t("completedCaseCountCardDescriptionBody")}
                        </Text>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover>
                </div>
                {formatDateRange && (
                  <Text variant="body.small" style={{ color: "var(--aegis-color-text-secondary)" }}>
                    {formatDateRange}
                  </Text>
                )}
              </div>
              <Select
                variant="outline"
                size="medium"
                value={caseCount2ViewType}
                onChange={(value) => {
                  if (value === "dueDate" || value === "caseType" || value === "department") {
                    onCaseCount2ViewTypeChange(value);
                  }
                }}
                options={[
                  { label: t("caseCountViewTypeCaseType"), value: "caseType" },
                  { label: t("dueDateComplianceView"), value: "dueDate" },
                  { label: t("departmentView"), value: "department" },
                ]}
                placement="bottom-start"
              />
            </div>
            <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
              <ButtonGroup variant="plain" size="medium">
                <Popover
                  open={isCaseCount2FilterOpen}
                  onOpenChange={onIsCaseCount2FilterOpenChange}
                  placement="bottom-end"
                >
                  <Popover.Anchor>
                    <Tooltip title={t("filter")}>
                      <IconButton
                        variant={caseCount2CaseTypeFilter !== "すべて" ? "subtle" : "plain"}
                        color={caseCount2CaseTypeFilter !== "すべて" ? "information" : undefined}
                        size="medium"
                        aria-label={t("filter")}
                      >
                        <Badge color="information" invisible={caseCount2CaseTypeFilter === "すべて"}>
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
                            value={caseCount2CaseTypeFilter}
                            onChange={onCaseCount2CaseTypeFilterChange}
                            options={[
                              { label: t("all"), value: "すべて" },
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
                {caseCount2CaseTypeFilter !== "すべて" && (
                  <Button
                    variant="subtle"
                    size="medium"
                    onClick={() => {
                      onCaseCount2CaseTypeFilterChange("すべて");
                    }}
                  >
                    {t("reset")}
                  </Button>
                )}
                <Menu
                  open={isCaseCount2ViewModeMenuOpen}
                  onOpenChange={setIsCaseCount2ViewModeMenuOpen}
                  placement="bottom-end"
                >
                  <Menu.Anchor>
                    <Tooltip
                      title={
                        caseCount2ViewMode === "table"
                          ? t("table")
                          : caseCount2PeriodView === "all"
                            ? t("pieChartAllPeriod")
                            : t("barChartMonthly")
                      }
                    >
                      <IconButton
                        variant="plain"
                        size="medium"
                        aria-label={
                          caseCount2ViewMode === "table"
                            ? t("table")
                            : caseCount2PeriodView === "all"
                              ? t("pieChartAllPeriod")
                              : t("barChartMonthly")
                        }
                        icon={caseCount2ViewMode === "graph" ? LfChartBar : LfTable}
                      />
                    </Tooltip>
                  </Menu.Anchor>
                  <Menu.Box width="auto">
                    <ActionList size="large">
                      <ActionList.Item
                        selected={caseCount2ViewMode === "graph" && caseCount2PeriodView === "monthly"}
                        onClick={() => {
                          onCaseCount2ViewModeChange("graph");
                          onCaseCount2PeriodViewChange("monthly");
                          setIsCaseCount2ViewModeMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfChartBar />
                            </Icon>
                          }
                          trailing={
                            caseCount2ViewMode === "graph" && caseCount2PeriodView === "monthly" ? (
                              <Icon>
                                <LfCheck />
                              </Icon>
                            ) : undefined
                          }
                        >
                          {t("barChartMonthly")}
                        </ActionList.Body>
                      </ActionList.Item>
                      <ActionList.Item
                        selected={caseCount2ViewMode === "graph" && caseCount2PeriodView === "all"}
                        onClick={() => {
                          onCaseCount2ViewModeChange("graph");
                          onCaseCount2PeriodViewChange("all");
                          setIsCaseCount2ViewModeMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfChartBar />
                            </Icon>
                          }
                          trailing={
                            caseCount2ViewMode === "graph" && caseCount2PeriodView === "all" ? (
                              <Icon>
                                <LfCheck />
                              </Icon>
                            ) : undefined
                          }
                        >
                          {t("pieChartAllPeriod")}
                        </ActionList.Body>
                      </ActionList.Item>
                      <ActionList.Item
                        selected={caseCount2ViewMode === "table"}
                        onClick={() => {
                          onCaseCount2ViewModeChange("table");
                          setIsCaseCount2ViewModeMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfTable />
                            </Icon>
                          }
                          trailing={
                            caseCount2ViewMode === "table" ? (
                              <Icon>
                                <LfCheck />
                              </Icon>
                            ) : undefined
                          }
                        >
                          {t("table")}
                        </ActionList.Body>
                      </ActionList.Item>
                    </ActionList>
                  </Menu.Box>
                </Menu>
              </ButtonGroup>
              <Checkbox
                checked={caseCount2ShowPreviousYear}
                onChange={(e) => onCaseCount2ShowPreviousYearChange(e.target.checked)}
              >
                {t("showPreviousYear")}
              </Checkbox>
            </div>
          </div>

          <div
            style={{
              background: "var(--aegis-color-background-default)",
              padding: "var(--aegis-space-xLarge)",
              borderRadius: "var(--aegis-radius-large)",
            }}
          >
            {caseCount2ViewType !== "department" &&
              (caseCount2ViewMode === "graph" && caseCount2PeriodView === "all" ? (
                // すべての期間：円グラフ表示
                <div
                  style={{
                    display: "flex",
                    gap: "var(--aegis-space-xLarge)",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  {/* 完了案件数の円グラフ */}
                  {caseCount2ViewType === "dueDate" &&
                    caseCount2AllPeriodPieData &&
                    caseCount2AllPeriodPieData.completedData.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--aegis-space-large)",
                            width: "100%",
                            justifyContent: "center",
                          }}
                        >
                          {/* 昨年の円グラフ */}
                          {caseCount2ShowPreviousYear &&
                            caseCount2AllPeriodPreviousYearPieData &&
                            caseCount2AllPeriodPreviousYearPieData.completedData.length > 0 && (
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                                <Text
                                  variant="body.small"
                                  style={{
                                    marginBottom: "var(--aegis-space-small)",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {t("previousYearLabel")}
                                </Text>
                                <ResponsiveContainer width="100%" height={300}>
                                  <PieChart>
                                    <Pie
                                      data={caseCount2AllPeriodPreviousYearPieData.completedData}
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
                                      {caseCount2AllPeriodPreviousYearPieData.completedData.map((entry) => {
                                        let fillColor = COMPLETED_DUE_DATE_STYLES.納期内.backgroundColor;
                                        if (entry.name === t("overdueCompletion")) {
                                          fillColor = COMPLETED_DUE_DATE_STYLES.納期超過.backgroundColor;
                                        } else if (entry.name === t("noDueDateCompletion")) {
                                          fillColor = chartPalette.neutral["600(base)"];
                                        }
                                        return <Cell key={`cell-completed-prev-2-${entry.name}`} fill={fillColor} />;
                                      })}
                                      <LabelList
                                        dataKey="value"
                                        position="inside"
                                        content={
                                          ((props: unknown) => {
                                            const p = props as Record<string, unknown>;
                                            const x = p.x as number | string | undefined;
                                            const y = p.y as number | string | undefined;
                                            const value = p.value;
                                            const viewBox = p.viewBox as
                                              | {
                                                  cx?: number;
                                                  cy?: number;
                                                  innerRadius?: number;
                                                  outerRadius?: number;
                                                  startAngle?: number;
                                                  endAngle?: number;
                                                }
                                              | undefined;
                                            let numX: number;
                                            let numY: number;
                                            if (
                                              viewBox &&
                                              typeof viewBox.cx === "number" &&
                                              typeof viewBox.cy === "number"
                                            ) {
                                              const r = ((viewBox.innerRadius ?? 0) + (viewBox.outerRadius ?? 0)) / 2;
                                              const midAngle =
                                                ((viewBox.startAngle ?? 0) + (viewBox.endAngle ?? 0)) / 2;
                                              const radian = (midAngle * Math.PI) / 180;
                                              numX = viewBox.cx + Math.cos(-radian) * r;
                                              numY = viewBox.cy + Math.sin(-radian) * r;
                                            } else {
                                              numX = typeof x === "string" ? parseFloat(x) || 0 : (x ?? 0);
                                              numY = typeof y === "string" ? parseFloat(y) || 0 : (y ?? 0);
                                            }
                                            const numValue = typeof value === "number" ? value : Number(value);
                                            if (numValue == null || Number.isNaN(numValue) || numValue <= 0)
                                              return null;
                                            const displayValue = Math.round(numValue).toString();
                                            const segFontSize = 11;
                                            const segmentFill = p.fill as string | undefined;
                                            const textColor = getContrastTextColor(segmentFill);
                                            return (
                                              <g>
                                                <text
                                                  x={numX}
                                                  y={numY}
                                                  fill={textColor}
                                                  textAnchor="middle"
                                                  dominantBaseline="central"
                                                  fontSize={segFontSize}
                                                  fontWeight="bold"
                                                >
                                                  {displayValue}
                                                </text>
                                              </g>
                                            );
                                          }) as React.ComponentProps<typeof LabelList>["content"]
                                        }
                                      />
                                    </Pie>
                                    <Label
                                      value={caseCount2AllPeriodPreviousYearPieData.completedData.reduce(
                                        (sum, item) => sum + item.value,
                                        0,
                                      )}
                                      position="center"
                                      style={{
                                        fontSize: "20",
                                        fontWeight: "normal",
                                        fill: "var(--aegis-color-font-default)",
                                      }}
                                    />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                          {/* 今年の円グラフ */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                            <Text
                              variant="body.small"
                              style={{
                                marginBottom: "var(--aegis-space-small)",
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              {t("currentYear")}
                            </Text>
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={caseCount2AllPeriodPieData.completedData}
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
                                  {caseCount2AllPeriodPieData.completedData.map((entry) => {
                                    let fillColor = COMPLETED_DUE_DATE_STYLES.納期内.backgroundColor;
                                    if (entry.name === t("overdueCompletion")) {
                                      fillColor = COMPLETED_DUE_DATE_STYLES.納期超過.backgroundColor;
                                    } else if (entry.name === t("noDueDateCompletion")) {
                                      fillColor = chartPalette.neutral["600(base)"];
                                    }
                                    return <Cell key={`cell-completed-2-${entry.name}`} fill={fillColor} />;
                                  })}
                                  <LabelList
                                    dataKey="value"
                                    position="inside"
                                    content={
                                      ((props: unknown) => {
                                        const p = props as Record<string, unknown>;
                                        const x = p.x as number | string | undefined;
                                        const y = p.y as number | string | undefined;
                                        const value = p.value;
                                        const viewBox = p.viewBox as
                                          | {
                                              cx?: number;
                                              cy?: number;
                                              innerRadius?: number;
                                              outerRadius?: number;
                                              startAngle?: number;
                                              endAngle?: number;
                                            }
                                          | undefined;
                                        let numX: number;
                                        let numY: number;
                                        if (
                                          viewBox &&
                                          typeof viewBox.cx === "number" &&
                                          typeof viewBox.cy === "number"
                                        ) {
                                          const r = ((viewBox.innerRadius ?? 0) + (viewBox.outerRadius ?? 0)) / 2;
                                          const midAngle = ((viewBox.startAngle ?? 0) + (viewBox.endAngle ?? 0)) / 2;
                                          const radian = (midAngle * Math.PI) / 180;
                                          numX = viewBox.cx + Math.cos(-radian) * r;
                                          numY = viewBox.cy + Math.sin(-radian) * r;
                                        } else {
                                          numX = typeof x === "string" ? parseFloat(x) || 0 : (x ?? 0);
                                          numY = typeof y === "string" ? parseFloat(y) || 0 : (y ?? 0);
                                        }
                                        const numValue = typeof value === "number" ? value : Number(value);
                                        if (numValue == null || Number.isNaN(numValue) || numValue <= 0) return null;
                                        const displayValue = Math.round(numValue).toString();
                                        const segFontSize = 11;
                                        const segmentFill = p.fill as string | undefined;
                                        const textColor = getContrastTextColor(segmentFill);
                                        return (
                                          <g>
                                            <text
                                              x={numX}
                                              y={numY}
                                              fill={textColor}
                                              textAnchor="middle"
                                              dominantBaseline="central"
                                              fontSize={segFontSize}
                                              fontWeight="bold"
                                            >
                                              {displayValue}
                                            </text>
                                          </g>
                                        );
                                      }) as React.ComponentProps<typeof LabelList>["content"]
                                    }
                                  />
                                </Pie>
                                <Label
                                  value={caseCount2AllPeriodPieData.completedData.reduce(
                                    (sum, item) => sum + item.value,
                                    0,
                                  )}
                                  position="center"
                                  style={{
                                    fontSize: "20",
                                    fontWeight: "normal",
                                    fill: "var(--aegis-color-font-default)",
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}
                  {caseCount2ViewType === "caseType" &&
                    caseCount2AllPeriodByCaseTypePieData &&
                    caseCount2AllPeriodByCaseTypePieData.completedData.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--aegis-space-large)",
                            width: "100%",
                            justifyContent: "center",
                          }}
                        >
                          {/* 昨年の円グラフ */}
                          {caseCount2ShowPreviousYear &&
                            caseCount2AllPeriodByCaseTypePreviousYearPieData &&
                            caseCount2AllPeriodByCaseTypePreviousYearPieData.completedData.length > 0 && (
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                                <Text
                                  variant="body.small"
                                  style={{
                                    marginBottom: "var(--aegis-space-small)",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {t("previousYearLabel")}
                                </Text>
                                <ResponsiveContainer width="100%" height={300}>
                                  <PieChart>
                                    <Pie
                                      data={caseCount2AllPeriodByCaseTypePreviousYearPieData.completedData}
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
                                      {caseCount2AllPeriodByCaseTypePreviousYearPieData.completedData.map((entry) => (
                                        <Cell
                                          key={`cell-completed-prev-2-${entry.originalName || entry.name}`}
                                          fill={
                                            CASE_TYPE_CATEGORY_STYLES[(entry.originalName || entry.name) as CaseType]
                                              ?.backgroundColor ?? "#6366f1"
                                          }
                                        />
                                      ))}
                                      <LabelList
                                        dataKey="value"
                                        position="inside"
                                        content={
                                          ((props: unknown) => {
                                            const p = props as Record<string, unknown>;
                                            const x = p.x as number | string | undefined;
                                            const y = p.y as number | string | undefined;
                                            const value = p.value;
                                            const viewBox = p.viewBox as
                                              | {
                                                  cx?: number;
                                                  cy?: number;
                                                  innerRadius?: number;
                                                  outerRadius?: number;
                                                  startAngle?: number;
                                                  endAngle?: number;
                                                }
                                              | undefined;
                                            let numX: number;
                                            let numY: number;
                                            if (
                                              viewBox &&
                                              typeof viewBox.cx === "number" &&
                                              typeof viewBox.cy === "number"
                                            ) {
                                              const r = ((viewBox.innerRadius ?? 0) + (viewBox.outerRadius ?? 0)) / 2;
                                              const midAngle =
                                                ((viewBox.startAngle ?? 0) + (viewBox.endAngle ?? 0)) / 2;
                                              const radian = (midAngle * Math.PI) / 180;
                                              numX = viewBox.cx + Math.cos(-radian) * r;
                                              numY = viewBox.cy + Math.sin(-radian) * r;
                                            } else {
                                              numX = typeof x === "string" ? parseFloat(x) || 0 : (x ?? 0);
                                              numY = typeof y === "string" ? parseFloat(y) || 0 : (y ?? 0);
                                            }
                                            const numValue = typeof value === "number" ? value : Number(value);
                                            if (numValue == null || Number.isNaN(numValue) || numValue <= 0)
                                              return null;
                                            const displayValue = Math.round(numValue).toString();
                                            const segFontSize = 11;
                                            const segmentFill = p.fill as string | undefined;
                                            const textColor = getContrastTextColor(segmentFill);
                                            return (
                                              <g>
                                                <text
                                                  x={numX}
                                                  y={numY}
                                                  fill={textColor}
                                                  textAnchor="middle"
                                                  dominantBaseline="central"
                                                  fontSize={segFontSize}
                                                  fontWeight="bold"
                                                >
                                                  {displayValue}
                                                </text>
                                              </g>
                                            );
                                          }) as React.ComponentProps<typeof LabelList>["content"]
                                        }
                                      />
                                    </Pie>
                                    <Label
                                      value={caseCount2AllPeriodByCaseTypePreviousYearPieData.completedData.reduce(
                                        (sum, item) => sum + item.value,
                                        0,
                                      )}
                                      position="center"
                                      style={{
                                        fontSize: "20",
                                        fontWeight: "normal",
                                        fill: "var(--aegis-color-font-default)",
                                      }}
                                    />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                          {/* 今年の円グラフ */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                            <Text
                              variant="body.small"
                              style={{
                                marginBottom: "var(--aegis-space-small)",
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              {t("currentYear")}
                            </Text>
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={caseCount2AllPeriodByCaseTypePieData.completedData}
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
                                  {caseCount2AllPeriodByCaseTypePieData.completedData.map((entry) => (
                                    <Cell
                                      key={`cell-completed-2-${entry.originalName || entry.name}`}
                                      fill={
                                        CASE_TYPE_CATEGORY_STYLES[(entry.originalName || entry.name) as CaseType]
                                          ?.backgroundColor ?? "#6366f1"
                                      }
                                    />
                                  ))}
                                  <LabelList
                                    dataKey="value"
                                    position="inside"
                                    content={
                                      ((props: unknown) => {
                                        const p = props as Record<string, unknown>;
                                        const x = p.x as number | string | undefined;
                                        const y = p.y as number | string | undefined;
                                        const value = p.value;
                                        const viewBox = p.viewBox as
                                          | {
                                              cx?: number;
                                              cy?: number;
                                              innerRadius?: number;
                                              outerRadius?: number;
                                              startAngle?: number;
                                              endAngle?: number;
                                            }
                                          | undefined;
                                        let numX: number;
                                        let numY: number;
                                        if (
                                          viewBox &&
                                          typeof viewBox.cx === "number" &&
                                          typeof viewBox.cy === "number"
                                        ) {
                                          const r = ((viewBox.innerRadius ?? 0) + (viewBox.outerRadius ?? 0)) / 2;
                                          const midAngle = ((viewBox.startAngle ?? 0) + (viewBox.endAngle ?? 0)) / 2;
                                          const radian = (midAngle * Math.PI) / 180;
                                          numX = viewBox.cx + Math.cos(-radian) * r;
                                          numY = viewBox.cy + Math.sin(-radian) * r;
                                        } else {
                                          numX = typeof x === "string" ? parseFloat(x) || 0 : (x ?? 0);
                                          numY = typeof y === "string" ? parseFloat(y) || 0 : (y ?? 0);
                                        }
                                        const numValue = typeof value === "number" ? value : Number(value);
                                        if (numValue == null || Number.isNaN(numValue) || numValue <= 0) return null;
                                        const displayValue = Math.round(numValue).toString();
                                        const segFontSize = 11;
                                        const segmentFill = p.fill as string | undefined;
                                        const textColor = getContrastTextColor(segmentFill);
                                        return (
                                          <g>
                                            <text
                                              x={numX}
                                              y={numY}
                                              fill={textColor}
                                              textAnchor="middle"
                                              dominantBaseline="central"
                                              fontSize={segFontSize}
                                              fontWeight="bold"
                                            >
                                              {displayValue}
                                            </text>
                                          </g>
                                        );
                                      }) as React.ComponentProps<typeof LabelList>["content"]
                                    }
                                  />
                                </Pie>
                                <Label
                                  value={caseCount2AllPeriodByCaseTypePieData.completedData.reduce(
                                    (sum, item) => sum + item.value,
                                    0,
                                  )}
                                  position="center"
                                  style={{
                                    fontSize: "20",
                                    fontWeight: "normal",
                                    fill: "var(--aegis-color-font-default)",
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              ) : caseCount2ViewMode === "graph" && caseCount2PeriodView === "monthly" ? (
                caseCount2ViewType === "dueDate" ? (
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart
                      key={`caseCount2-${caseCount2ShowPreviousYear}`}
                      data={
                        caseCount2ShowPreviousYear ? caseCount2MergedPerformanceData : caseCount2OverallPerformanceData
                      }
                      margin={{
                        top: 16,
                        right: 24,
                        bottom: 0,
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
                          <CustomXAxisTick
                            {...tickProps}
                            showPreviousYearComparison={caseCount2ShowPreviousYear}
                            isBarChart={true}
                            onPaneOpenChange={onPaneOpenChange}
                            onPaneTabIndexChange={onPaneTabIndexChange}
                            onPanePerformanceDateRangeChange={onPanePerformanceDateRangeChange}
                            onSelectedMemberChange={onSelectedMemberChange}
                            locale={locale}
                          />
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
                      <Legend content={renderCustomLegend({ locale, excludePreviousYear: true })} />
                      {/* 完了（昨年） */}
                      {caseCount2ShowPreviousYear && (
                        <>
                          <Bar
                            dataKey="onTimeCompletionCount_昨年"
                            fill={COMPLETED_DUE_DATE_STYLES.納期内.backgroundColor}
                            name={t("onTimeCompletion")}
                            stackId="completed_previous"
                            opacity={0.6}
                            stroke={COMPLETED_DUE_DATE_STYLES.納期内.barBorder?.color}
                            strokeDasharray="5 5"
                            legendType="none"
                            shape={(props: unknown) => {
                              const p = props as {
                                x?: number;
                                y?: number;
                                width?: number;
                                height?: number;
                                fill?: string;
                                payload: Record<string, number>;
                              };
                              const overdue = (p.payload.overdueCompletionCount_昨年 || 0) > 0;
                              const noDueDate = (p.payload.noDueDateCompletionCount_昨年 || 0) > 0;
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
                                    hasValueBefore={hasValueBelow}
                                    hasValueAfter={hasValueAbove}
                                  />
                                );
                              }
                              if (hasValueBelow && !hasValueAbove) {
                                return (
                                  <VerticalBarWithDivider
                                    {...p}
                                    hideDivider={true}
                                    radius={[4, 4, 0, 0]}
                                    barBorder={style.barBorder}
                                    hasValueBefore={hasValueBelow}
                                    hasValueAfter={hasValueAbove}
                                  />
                                );
                              }
                              if (!hasValueBelow && hasValueAbove) {
                                return (
                                  <VerticalBarWithDivider
                                    {...p}
                                    hideDivider={true}
                                    radius={[0, 0, 4, 4]}
                                    barBorder={style.barBorder}
                                    hasValueBefore={hasValueBelow}
                                    hasValueAfter={hasValueAbove}
                                  />
                                );
                              }
                              return (
                                <VerticalBarWithDivider
                                  {...p}
                                  hideDivider={true}
                                  radius={[4, 4, 4, 4]}
                                  barBorder={style.barBorder}
                                  hasValueBefore={hasValueBelow}
                                  hasValueAfter={hasValueAbove}
                                />
                              );
                            }}
                          >
                            <LabelList
                              dataKey="onTimeCompletionCount_昨年"
                              content={(props: LabelListContentProps) => (
                                <BadgeLabel
                                  {...props}
                                  dataKey="onTimeCompletionCount_昨年"
                                  badgeVariant={COMPLETED_DUE_DATE_STYLES.納期内.badgeVariant}
                                />
                              )}
                            />
                          </Bar>
                          <Bar
                            dataKey="overdueCompletionCount_昨年"
                            fill={COMPLETED_DUE_DATE_STYLES.納期超過.backgroundColor}
                            name={t("overdueCompletion")}
                            stackId="completed_previous"
                            opacity={0.6}
                            stroke={COMPLETED_DUE_DATE_STYLES.納期超過.barBorder?.color}
                            strokeDasharray="5 5"
                            legendType="none"
                            shape={(props: unknown) => {
                              const p = props as {
                                x?: number;
                                y?: number;
                                width?: number;
                                height?: number;
                                fill?: string;
                                payload: Record<string, number>;
                              };
                              const onTime = (p.payload.onTimeCompletionCount_昨年 || 0) > 0;
                              const noDueDate = (p.payload.noDueDateCompletionCount_昨年 || 0) > 0;
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
                                    hasValueBefore={hasValueBelow}
                                    hasValueAfter={hasValueAbove}
                                  />
                                );
                              }
                              if (hasValueBelow && !hasValueAbove) {
                                return (
                                  <VerticalBarWithDivider
                                    {...p}
                                    hideDivider={true}
                                    radius={[4, 4, 0, 0]}
                                    barBorder={style.barBorder}
                                    hasValueBefore={hasValueBelow}
                                    hasValueAfter={hasValueAbove}
                                  />
                                );
                              }
                              if (!hasValueBelow && hasValueAbove) {
                                return (
                                  <VerticalBarWithDivider
                                    {...p}
                                    hideDivider={true}
                                    radius={[0, 0, 4, 4]}
                                    barBorder={style.barBorder}
                                    hasValueBefore={hasValueBelow}
                                    hasValueAfter={hasValueAbove}
                                  />
                                );
                              }
                              return (
                                <VerticalBarWithDivider
                                  {...p}
                                  hideDivider={true}
                                  radius={[4, 4, 4, 4]}
                                  barBorder={style.barBorder}
                                  hasValueBefore={hasValueBelow}
                                  hasValueAfter={hasValueAbove}
                                />
                              );
                            }}
                          >
                            <LabelList
                              dataKey="overdueCompletionCount_昨年"
                              content={(props: LabelListContentProps) => (
                                <BadgeLabel
                                  {...props}
                                  dataKey="overdueCompletionCount_昨年"
                                  badgeVariant={COMPLETED_DUE_DATE_STYLES.納期超過.badgeVariant}
                                />
                              )}
                            />
                          </Bar>
                          <Bar
                            dataKey="noDueDateCompletionCount_昨年"
                            fill={COMPLETED_DUE_DATE_STYLES.納期未入力.backgroundColor}
                            name={t("noDueDateCompletion")}
                            stackId="completed_previous"
                            opacity={0.6}
                            stroke={COMPLETED_DUE_DATE_STYLES.納期未入力.barBorder?.color}
                            strokeDasharray="5 5"
                            legendType="none"
                            shape={(props: unknown) => {
                              const p = props as {
                                x?: number;
                                y?: number;
                                width?: number;
                                height?: number;
                                fill?: string;
                                payload: Record<string, number>;
                              };
                              const onTime = (p.payload.onTimeCompletionCount_昨年 || 0) > 0;
                              const overdue = (p.payload.overdueCompletionCount_昨年 || 0) > 0;
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
                                    hasValueBefore={hasValueBelow}
                                    hasValueAfter={hasValueAbove}
                                  />
                                );
                              }
                              if (hasValueBelow && !hasValueAbove) {
                                return (
                                  <VerticalBarWithDivider
                                    {...p}
                                    hideDivider={true}
                                    radius={[4, 4, 0, 0]}
                                    barBorder={style.barBorder}
                                    svgPattern={style.svgPattern}
                                    hasValueBefore={hasValueBelow}
                                    hasValueAfter={hasValueAbove}
                                  />
                                );
                              }
                              if (!hasValueBelow && hasValueAbove) {
                                return (
                                  <VerticalBarWithDivider
                                    {...p}
                                    hideDivider={true}
                                    radius={[0, 0, 4, 4]}
                                    barBorder={style.barBorder}
                                    svgPattern={style.svgPattern}
                                    hasValueBefore={hasValueBelow}
                                    hasValueAfter={hasValueAbove}
                                  />
                                );
                              }
                              return (
                                <VerticalBarWithDivider
                                  {...p}
                                  hideDivider={true}
                                  radius={[4, 4, 4, 4]}
                                  barBorder={style.barBorder}
                                  svgPattern={style.svgPattern}
                                  hasValueBefore={hasValueBelow}
                                  hasValueAfter={hasValueAbove}
                                />
                              );
                            }}
                          >
                            <LabelList
                              dataKey="noDueDateCompletionCount_昨年"
                              content={(props: LabelListContentProps) => (
                                <BadgeLabel
                                  {...props}
                                  dataKey="noDueDateCompletionCount_昨年"
                                  badgeVariant={COMPLETED_DUE_DATE_STYLES.納期未入力.badgeVariant}
                                />
                              )}
                            />
                            <LabelList
                              position="top"
                              offset={12}
                              content={(props: LabelListContentProps) => {
                                const data = caseCount2MergedPerformanceData;
                                if (props.index === undefined) return null;
                                const rowData = data[props.index];
                                if (!rowData) return null;
                                const total =
                                  (rowData.onTimeCompletionCount_昨年 || 0) +
                                  (rowData.overdueCompletionCount_昨年 || 0) +
                                  (rowData.noDueDateCompletionCount_昨年 || 0);
                                if (total === 0) return null;
                                return <TopLabel {...props} value={total} dataKey="案件数" />;
                              }}
                            />
                          </Bar>
                        </>
                      )}
                      {/* 完了（今年） */}
                      <Bar
                        dataKey="onTimeCompletionCount"
                        fill={COMPLETED_DUE_DATE_STYLES.納期内.backgroundColor}
                        name={t("onTimeCompletion")}
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
                          }
                          if (hasValueBelow && !hasValueAbove) {
                            return (
                              <VerticalBarWithDivider
                                {...p}
                                hideDivider={true}
                                radius={[4, 4, 0, 0]}
                                barBorder={style.barBorder}
                              />
                            );
                          }
                          if (!hasValueBelow && hasValueAbove) {
                            return (
                              <VerticalBarWithDivider
                                {...p}
                                hideDivider={true}
                                radius={[0, 0, 4, 4]}
                                barBorder={style.barBorder}
                              />
                            );
                          }
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[4, 4, 4, 4]}
                              barBorder={style.barBorder}
                            />
                          );
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
                        name={t("overdueCompletion")}
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
                          }
                          if (hasValueBelow && !hasValueAbove) {
                            return (
                              <VerticalBarWithDivider
                                {...p}
                                hideDivider={true}
                                radius={[4, 4, 0, 0]}
                                barBorder={style.barBorder}
                              />
                            );
                          }
                          if (!hasValueBelow && hasValueAbove) {
                            return (
                              <VerticalBarWithDivider
                                {...p}
                                hideDivider={true}
                                radius={[0, 0, 4, 4]}
                                barBorder={style.barBorder}
                              />
                            );
                          }
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[4, 4, 4, 4]}
                              barBorder={style.barBorder}
                            />
                          );
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
                        name={t("noDueDateCompletion")}
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
                          }
                          if (hasValueBelow && !hasValueAbove) {
                            return (
                              <VerticalBarWithDivider
                                {...p}
                                hideDivider={true}
                                radius={[4, 4, 0, 0]}
                                barBorder={style.barBorder}
                                svgPattern={style.svgPattern}
                              />
                            );
                          }
                          if (!hasValueBelow && hasValueAbove) {
                            return (
                              <VerticalBarWithDivider
                                {...p}
                                hideDivider={true}
                                radius={[0, 0, 4, 4]}
                                barBorder={style.barBorder}
                                svgPattern={style.svgPattern}
                              />
                            );
                          }
                          return (
                            <VerticalBarWithDivider
                              {...p}
                              hideDivider={true}
                              radius={[4, 4, 4, 4]}
                              barBorder={style.barBorder}
                              svgPattern={style.svgPattern}
                            />
                          );
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
                            const data = caseCount2ShowPreviousYear
                              ? caseCount2MergedPerformanceData
                              : caseCount2OverallPerformanceData;
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
                      <CartesianGrid vertical={false} horizontal={false} stroke="#e2e8f0" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  (() => {
                    const filteredCaseTypes =
                      caseCount2CaseTypeFilter === "すべて" ? CASE_TYPE_ORDER : [caseCount2CaseTypeFilter];
                    return (
                      <ResponsiveContainer width="100%" height={360}>
                        <BarChart
                          key={`caseCount2ByCaseType-${caseCount2ShowPreviousYear}-${caseCount2CaseTypeFilter}`}
                          data={
                            caseCount2ShowPreviousYear
                              ? caseCount2ByCaseTypeMergedPerformanceData
                              : caseCount2ByCaseTypeOverallPerformanceData
                          }
                          margin={{
                            top: 16,
                            right: 24,
                            bottom: 0,
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
                              <CustomXAxisTick
                                {...tickProps}
                                showPreviousYearComparison={caseCount2ShowPreviousYear}
                                locale={locale}
                                isBarChart={true}
                              />
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
                          <Legend
                            content={renderCustomLegend({ locale, excludePreviousYear: true })}
                            wrapperStyle={{ marginBottom: 0 }}
                          />
                          {/* 案件タイプ別のBar */}
                          {/* 昨年の完了案件数（すべての案件タイプを積み上げ） */}
                          {caseCount2ShowPreviousYear &&
                            filteredCaseTypes.map((caseType) => {
                              const localizedName = CASE_TYPE_MAPPING[locale][caseType] || caseType;
                              const style = CASE_TYPE_CATEGORY_STYLES[caseType];
                              const fill = style?.svgPattern ? "transparent" : (style?.backgroundColor ?? "#6366f1");
                              return (
                                <Bar
                                  key={`${caseType}_完了案件数_昨年`}
                                  dataKey={`${caseType}_完了案件数_昨年`}
                                  fill={fill}
                                  name={`${localizedName} - ${t("completedCaseCount")}`}
                                  stackId="completed_previous"
                                  opacity={0.6}
                                  stroke={style?.barBorder?.color ?? fill}
                                  strokeDasharray="5 5"
                                  legendType="none"
                                  // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                  shape={(barProps: any) => {
                                    const { payload, dataKey } = barProps;
                                    const currentIndex = filteredCaseTypes.findIndex(
                                      (ct) => `${ct}_完了案件数_昨年` === dataKey,
                                    );
                                    const hasValueBelowInStack = filteredCaseTypes
                                      .slice(0, currentIndex)
                                      .some((ct) => ((payload?.[`${ct}_完了案件数_昨年`] as number) || 0) > 0);
                                    const hasValueAboveInStack = filteredCaseTypes
                                      .slice(currentIndex + 1)
                                      .some((ct) => ((payload?.[`${ct}_完了案件数_昨年`] as number) || 0) > 0);
                                    const hasValueBelowOtherStacks =
                                      (caseCount2ShowPreviousYear &&
                                        filteredCaseTypes.some(
                                          (ct) => ((payload?.[`${ct}_完了案件数_昨年`] as number) || 0) > 0,
                                        )) ||
                                      filteredCaseTypes.some(
                                        (ct) => ((payload?.[`${ct}_完了案件数`] as number) || 0) > 0,
                                      );
                                    const hasValueAboveOtherStacks = false;
                                    const hasValueBelow = hasValueBelowInStack || hasValueBelowOtherStacks;
                                    const hasValueAbove = hasValueAboveInStack || hasValueAboveOtherStacks;
                                    const barBorder = style?.barBorder;
                                    if (hasValueBelow && hasValueAbove) {
                                      return (
                                        <VerticalBarWithDivider
                                          {...barProps}
                                          hideDivider={true}
                                          radius={[0, 0, 0, 0]}
                                          barBorder={barBorder}
                                          svgPattern={style?.svgPattern}
                                          hasValueBefore={hasValueBelow}
                                          hasValueAfter={hasValueAbove}
                                        />
                                      );
                                    }
                                    if (hasValueBelow && !hasValueAbove) {
                                      return (
                                        <VerticalBarWithDivider
                                          {...barProps}
                                          hideDivider={true}
                                          radius={[4, 4, 0, 0]}
                                          barBorder={barBorder}
                                          svgPattern={style?.svgPattern}
                                          hasValueBefore={hasValueBelow}
                                          hasValueAfter={hasValueAbove}
                                        />
                                      );
                                    }
                                    if (!hasValueBelow && hasValueAbove) {
                                      return (
                                        <VerticalBarWithDivider
                                          {...barProps}
                                          hideDivider={true}
                                          radius={[0, 0, 4, 4]}
                                          barBorder={barBorder}
                                          svgPattern={style?.svgPattern}
                                          hasValueBefore={hasValueBelow}
                                          hasValueAfter={hasValueAbove}
                                        />
                                      );
                                    }
                                    return (
                                      <VerticalBarWithDivider
                                        {...barProps}
                                        hideDivider={true}
                                        radius={[4, 4, 4, 4]}
                                        barBorder={barBorder}
                                        svgPattern={style?.svgPattern}
                                        hasValueBefore={hasValueBelow}
                                        hasValueAfter={hasValueAbove}
                                      />
                                    );
                                  }}
                                >
                                  <LabelList
                                    dataKey={`${caseType}_完了案件数_昨年`}
                                    content={(props: LabelListContentProps) => (
                                      <BadgeLabel
                                        {...props}
                                        dataKey={`${caseType}_完了案件数_昨年`}
                                        badgeVariant={style?.badgeVariant}
                                      />
                                    )}
                                  />
                                </Bar>
                              );
                            })}
                          {/* 昨年の完了案件数の合計をバーの上に表示 */}
                          {caseCount2ShowPreviousYear && filteredCaseTypes.length > 0 && (
                            <Bar
                              key="完了案件数_昨年_合計"
                              dataKey="dummy_previous"
                              stackId="completed_previous"
                              fill="transparent"
                              opacity={0}
                              legendType="none"
                            >
                              <LabelList
                                position="top"
                                offset={12}
                                content={(props: LabelListContentProps) => {
                                  if (props.index === undefined) return null;
                                  const data = caseCount2ByCaseTypeMergedPerformanceData;
                                  const rowData = data[props.index];
                                  if (!rowData) return null;
                                  // すべての案件タイプの昨年の完了案件数の合計を計算
                                  const total = filteredCaseTypes.reduce((sum, caseType) => {
                                    return sum + ((rowData[`${caseType}_完了案件数_昨年`] as number) || 0);
                                  }, 0);
                                  if (total === 0) return null;
                                  return <TopLabel {...props} value={total} dataKey="完了案件数" />;
                                }}
                              />
                            </Bar>
                          )}
                          {/* 今年の完了案件数（すべての案件タイプを積み上げ） */}
                          {filteredCaseTypes.map((caseType) => {
                            const localizedName = CASE_TYPE_MAPPING[locale][caseType] || caseType;
                            const style = CASE_TYPE_CATEGORY_STYLES[caseType];
                            const fill = style?.svgPattern ? "transparent" : (style?.backgroundColor ?? "#6366f1");
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
                                  const currentIndex = filteredCaseTypes.findIndex(
                                    (ct) => `${ct}_完了案件数` === dataKey,
                                  );
                                  const isFirstInStack = currentIndex === 0;
                                  const hasValueBelowInStack = filteredCaseTypes
                                    .slice(0, currentIndex)
                                    .some((ct) => ((payload?.[`${ct}_完了案件数`] as number) || 0) > 0);
                                  const hasValueAboveInStack = filteredCaseTypes
                                    .slice(currentIndex + 1)
                                    .some((ct) => ((payload?.[`${ct}_完了案件数`] as number) || 0) > 0);
                                  const hasValueBelowOtherStacks =
                                    (caseCount2ShowPreviousYear &&
                                      filteredCaseTypes.some(
                                        (ct) => ((payload?.[`${ct}_完了案件数_昨年`] as number) || 0) > 0,
                                      )) ||
                                    filteredCaseTypes.some(
                                      (ct) => ((payload?.[`${ct}_完了案件数`] as number) || 0) > 0,
                                    );
                                  const hasValueAboveOtherStacks = false;
                                  const hasValueBelow = hasValueBelowInStack || hasValueBelowOtherStacks;
                                  const hasValueAbove = hasValueAboveInStack || hasValueAboveOtherStacks;
                                  const barBorder = style?.barBorder;
                                  if (isFirstInStack && hasValueBelowOtherStacks && !hasValueBelowInStack) {
                                    return (
                                      <VerticalBarWithDivider
                                        {...barProps}
                                        hideDivider={true}
                                        radius={[0, 0, 4, 4]}
                                        barBorder={barBorder}
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
                                        barBorder={barBorder}
                                        svgPattern={style?.svgPattern}
                                        hasValueBefore={hasValueBelow}
                                        hasValueAfter={hasValueAbove}
                                      />
                                    );
                                  }
                                  if (hasValueBelow && !hasValueAbove) {
                                    return (
                                      <VerticalBarWithDivider
                                        {...barProps}
                                        hideDivider={true}
                                        radius={[4, 4, 0, 0]}
                                        barBorder={barBorder}
                                        svgPattern={style?.svgPattern}
                                        hasValueBefore={hasValueBelow}
                                        hasValueAfter={hasValueAbove}
                                      />
                                    );
                                  }
                                  if (!hasValueBelow && hasValueAbove) {
                                    return (
                                      <VerticalBarWithDivider
                                        {...barProps}
                                        hideDivider={true}
                                        radius={[0, 0, 4, 4]}
                                        barBorder={barBorder}
                                        svgPattern={style?.svgPattern}
                                        hasValueBefore={hasValueBelow}
                                        hasValueAfter={hasValueAbove}
                                      />
                                    );
                                  }
                                  return (
                                    <VerticalBarWithDivider
                                      {...barProps}
                                      hideDivider={true}
                                      radius={[4, 4, 4, 4]}
                                      barBorder={barBorder}
                                      svgPattern={style?.svgPattern}
                                      hasValueBefore={hasValueBelow}
                                      hasValueAfter={hasValueAbove}
                                    />
                                  );
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
                          {caseCount2VisibleMetrics.完了案件数 && filteredCaseTypes.length > 0 && (
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
                                  const data = caseCount2ShowPreviousYear
                                    ? caseCount2ByCaseTypeMergedPerformanceData
                                    : caseCount2ByCaseTypeOverallPerformanceData;
                                  const rowData = data[props.index];
                                  if (!rowData) return null;
                                  // すべての案件タイプの完了案件数の合計を計算
                                  const total = filteredCaseTypes.reduce((sum, caseType) => {
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
                    );
                  })()
                )
              ) : caseCount2ViewType === "dueDate" ? (
                <div
                  style={{
                    background: "var(--aegis-color-background-default)",
                    padding: "var(--aegis-space-xLarge)",
                    borderRadius: "var(--aegis-radius-large)",
                  }}
                >
                  <DataTable
                    columns={caseCount2TableColumns}
                    rows={
                      caseCount2ShowPreviousYear
                        ? caseCount2MergedPerformanceData
                        : caseCount2OverallPerformanceData.map((row) => ({
                            ...row,
                            新規案件数_昨年: 0,
                            onTimeCompletionCount_昨年: 0,
                            overdueCompletionCount_昨年: 0,
                            noDueDateCompletionCount_昨年: 0,
                            リードタイム中央値_昨年: 0,
                            初回返信速度中央値_昨年: 0,
                          }))
                    }
                    defaultColumnPinning={{ start: ["name"] }}
                    highlightRowOnHover={false}
                  />
                </div>
              ) : caseCount2ViewType === "caseType" ? (
                <div
                  style={{
                    background: "var(--aegis-color-background-default)",
                    padding: "var(--aegis-space-xLarge)",
                    borderRadius: "var(--aegis-radius-large)",
                  }}
                >
                  <DataTable
                    columns={caseCount2ByCaseTypeTableColumns}
                    rows={
                      caseCount2ShowPreviousYear
                        ? caseCount2ByCaseTypeMergedPerformanceData
                        : caseCount2ByCaseTypeOverallPerformanceData
                    }
                    defaultColumnPinning={{ start: ["name"] }}
                    highlightRowOnHover={false}
                  />
                </div>
              ) : null)}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
