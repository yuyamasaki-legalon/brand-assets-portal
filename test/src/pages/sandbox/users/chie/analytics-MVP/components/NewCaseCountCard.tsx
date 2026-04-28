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
import type * as React from "react";
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
import { CASE_TYPE_MAPPING, CASE_TYPE_ORDER } from "../constants";
import { useCaseCountData } from "../hooks/useCaseCountData";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
import type { CaseType } from "../types";
import {
  BadgeLabel,
  CASE_TYPE_CATEGORY_STYLES,
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

export interface NewCaseCountCardProps {
  // State
  caseCountViewMode: "graph" | "table";
  caseCountViewType: "dueDate" | "caseType" | "department";
  onCaseCountViewTypeChange: (viewType: "dueDate" | "caseType" | "department") => void;
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
  performanceDateRange: { start: Date | null; end: Date | null };
  // Handlers
  onCaseCountViewModeChange: (mode: "graph" | "table") => void;
  onCaseCountPeriodViewChange: (view: "all" | "monthly") => void;
  onCaseCountShowPreviousYearChange: (show: boolean) => void;
  onCaseCountCaseTypeFilterChange: (filter: string) => void;
  onIsCaseCountFilterOpenChange: (open: boolean) => void;
}

export function NewCaseCountCard(props: NewCaseCountCardProps) {
  const [isCaseCountInfoPopoverOpen, setIsCaseCountInfoPopoverOpen] = useState(false);
  const [isCaseCountInfoPopoverPinned, setIsCaseCountInfoPopoverPinned] = useState(false);
  const [isCaseCountViewModeMenuOpen, setIsCaseCountViewModeMenuOpen] = useState(false);
  const {
    caseCountViewMode,
    caseCountViewType,
    caseCountPeriodView,
    caseCountVisibleMetrics,
    caseCountShowPreviousYear,
    caseCountCaseTypeFilter,
    isCaseCountFilterOpen,
    caseCountByCaseTypeOverallPerformanceData,
    caseCountByCaseTypeMergedPerformanceData,
    caseCountAllPeriodByCaseTypeData,
    caseCountAllPeriodByCaseTypePreviousYearData,
    performanceDateRange,
    onCaseCountViewModeChange,
    onCaseCountViewTypeChange,
    onCaseCountPeriodViewChange,
    onCaseCountShowPreviousYearChange,
    onCaseCountCaseTypeFilterChange,
    onIsCaseCountFilterOpenChange,
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

  // useCaseCountDataフックを使用（departmentの場合はcaseTypeとして扱う）
  const { allPeriodByCaseTypePieData, allPeriodByCaseTypePreviousYearPieData, byCaseTypeTableColumns } =
    useCaseCountData({
      viewType: caseCountViewType === "department" ? "caseType" : caseCountViewType,
      visibleMetrics: caseCountVisibleMetrics,
      showPreviousYear: caseCountShowPreviousYear,
      caseTypeFilter: caseCountCaseTypeFilter,
      allPeriodByCaseTypeData: caseCountAllPeriodByCaseTypeData,
      allPeriodByCaseTypePreviousYearData: caseCountAllPeriodByCaseTypePreviousYearData,
      byCaseTypeOverallPerformanceData: caseCountByCaseTypeOverallPerformanceData,
      byCaseTypeMergedPerformanceData: caseCountByCaseTypeMergedPerformanceData,
    });

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
                  <Text variant="body.medium.bold">{t("newCaseCountCardTitle")}</Text>
                  <Popover
                    open={isCaseCountInfoPopoverOpen}
                    onOpenChange={(open) => {
                      setIsCaseCountInfoPopoverOpen(open);
                      if (!open) {
                        setIsCaseCountInfoPopoverPinned(false);
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
                          if (!isCaseCountInfoPopoverPinned) {
                            setIsCaseCountInfoPopoverOpen(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isCaseCountInfoPopoverPinned) {
                            setIsCaseCountInfoPopoverOpen(false);
                          }
                        }}
                        onClickCapture={(e) => {
                          e.stopPropagation();
                          setIsCaseCountInfoPopoverOpen(true);
                          setIsCaseCountInfoPopoverPinned(true);
                        }}
                      />
                    </Popover.Anchor>
                    <Popover.Content width="small">
                      <Popover.Body>
                        <Text variant="body.small" style={{ fontWeight: "bold" }}>
                          {t("newCaseCountCardDescription")}
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
                value={caseCountViewType}
                onChange={(value) => {
                  if (value === "caseType" || value === "department" || value === "dueDate") {
                    onCaseCountViewTypeChange(value);
                  }
                }}
                options={[
                  { label: t("caseCountViewTypeCaseType"), value: "caseType" },
                  { label: t("departmentView"), value: "department" },
                ]}
                style={{ width: "auto" }}
                placement="bottom-start"
              />
            </div>
            <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
              <ButtonGroup variant="plain" size="medium">
                <Popover
                  open={isCaseCountFilterOpen}
                  onOpenChange={onIsCaseCountFilterOpenChange}
                  placement="bottom-end"
                >
                  <Popover.Anchor>
                    <Tooltip title={t("filter")}>
                      <IconButton
                        variant={caseCountCaseTypeFilter !== "すべて" ? "subtle" : "plain"}
                        color={caseCountCaseTypeFilter !== "すべて" ? "information" : undefined}
                        size="medium"
                        aria-label={t("filter")}
                      >
                        <Badge color="information" invisible={caseCountCaseTypeFilter === "すべて"}>
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
                            value={caseCountCaseTypeFilter}
                            onChange={onCaseCountCaseTypeFilterChange}
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
                {caseCountCaseTypeFilter !== "すべて" && (
                  <Button
                    variant="subtle"
                    size="medium"
                    onClick={() => {
                      onCaseCountCaseTypeFilterChange("すべて");
                    }}
                  >
                    {t("reset")}
                  </Button>
                )}
                <Menu
                  open={isCaseCountViewModeMenuOpen}
                  onOpenChange={setIsCaseCountViewModeMenuOpen}
                  placement="bottom-end"
                >
                  <Menu.Anchor>
                    <Tooltip
                      title={
                        caseCountViewMode === "table"
                          ? t("table")
                          : caseCountPeriodView === "all"
                            ? t("pieChartAllPeriod")
                            : t("barChartMonthly")
                      }
                    >
                      <IconButton
                        variant="plain"
                        size="medium"
                        aria-label={
                          caseCountViewMode === "table"
                            ? t("table")
                            : caseCountPeriodView === "all"
                              ? t("pieChartAllPeriod")
                              : t("barChartMonthly")
                        }
                        icon={caseCountViewMode === "graph" ? LfChartBar : LfTable}
                      />
                    </Tooltip>
                  </Menu.Anchor>
                  <Menu.Box width="auto">
                    <ActionList size="large">
                      <ActionList.Item
                        selected={caseCountViewMode === "graph" && caseCountPeriodView === "monthly"}
                        onClick={() => {
                          onCaseCountViewModeChange("graph");
                          onCaseCountPeriodViewChange("monthly");
                          setIsCaseCountViewModeMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfChartBar />
                            </Icon>
                          }
                          trailing={
                            caseCountViewMode === "graph" && caseCountPeriodView === "monthly" ? (
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
                        selected={caseCountViewMode === "graph" && caseCountPeriodView === "all"}
                        onClick={() => {
                          onCaseCountViewModeChange("graph");
                          onCaseCountPeriodViewChange("all");
                          setIsCaseCountViewModeMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfChartBar />
                            </Icon>
                          }
                          trailing={
                            caseCountViewMode === "graph" && caseCountPeriodView === "all" ? (
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
                        selected={caseCountViewMode === "table"}
                        onClick={() => {
                          onCaseCountViewModeChange("table");
                          setIsCaseCountViewModeMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfTable />
                            </Icon>
                          }
                          trailing={
                            caseCountViewMode === "table" ? (
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
                checked={caseCountShowPreviousYear}
                onChange={(e) => onCaseCountShowPreviousYearChange(e.target.checked)}
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
            {caseCountViewMode === "graph" && caseCountPeriodView === "all" && caseCountViewType === "caseType" ? (
              // すべての期間：円グラフ表示（案件タイプ別のみ）
              <div
                style={{
                  display: "flex",
                  gap: "var(--aegis-space-xLarge)",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                {/* 新規案件数の円グラフ（案件タイプ別のみ） */}
                {allPeriodByCaseTypePieData && allPeriodByCaseTypePieData.newCaseData.length > 0 && (
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
                      {caseCountShowPreviousYear &&
                        allPeriodByCaseTypePreviousYearPieData &&
                        allPeriodByCaseTypePreviousYearPieData.newCaseData.length > 0 && (
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
                                  data={allPeriodByCaseTypePreviousYearPieData.newCaseData}
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
                                  {allPeriodByCaseTypePreviousYearPieData.newCaseData.map((entry) => (
                                    <Cell
                                      key={`cell-new-prev-${entry.originalName || entry.name}`}
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
                                  value={allPeriodByCaseTypePreviousYearPieData.newCaseData.reduce(
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
                              data={allPeriodByCaseTypePieData.newCaseData}
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
                              {allPeriodByCaseTypePieData.newCaseData.map((entry) => (
                                <Cell
                                  key={`cell-new-${entry.originalName || entry.name}`}
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
                                    if (viewBox && typeof viewBox.cx === "number" && typeof viewBox.cy === "number") {
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
                              value={allPeriodByCaseTypePieData.newCaseData.reduce((sum, item) => sum + item.value, 0)}
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
            ) : caseCountViewMode === "graph" && caseCountViewType === "caseType" ? (
              <>
                {/* 案件タイプ別ビューのみ */}
                {(() => {
                  const filteredCaseTypes =
                    caseCountCaseTypeFilter === "すべて" ? CASE_TYPE_ORDER : [caseCountCaseTypeFilter];
                  return (
                    <ResponsiveContainer width="100%" height={360}>
                      <BarChart
                        key={`caseCountByCaseType-${caseCountShowPreviousYear}-${caseCountCaseTypeFilter}`}
                        data={
                          caseCountShowPreviousYear
                            ? caseCountByCaseTypeMergedPerformanceData
                            : caseCountByCaseTypeOverallPerformanceData
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
                              showPreviousYearComparison={caseCountShowPreviousYear}
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
                        <Legend content={renderCustomLegend({ locale, isNewCaseCountCard: true })} />
                        {/* 案件タイプ別のBar */}
                        {/* 昨年の新規案件数（すべての案件タイプを積み上げ） */}
                        {caseCountShowPreviousYear &&
                          caseCountVisibleMetrics.新規案件数 &&
                          filteredCaseTypes.map((caseType) => {
                            const localizedName =
                              (CASE_TYPE_MAPPING[locale as keyof typeof CASE_TYPE_MAPPING]?.[caseType] as string) ||
                              caseType;
                            const style = CASE_TYPE_CATEGORY_STYLES[caseType];
                            const fill = style?.svgPattern ? "transparent" : (style?.backgroundColor ?? "#6366f1");
                            return (
                              <Bar
                                key={`${caseType}_新規案件数_昨年`}
                                dataKey={`${caseType}_新規案件数_昨年`}
                                fill={fill}
                                name={`${localizedName} - ${t("newCaseCount")}`}
                                stackId="new_previous"
                                opacity={0.6}
                                stroke={style?.barBorder?.color ?? fill}
                                strokeDasharray="5 5"
                                legendType="none"
                                // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                                shape={(barProps: any) => {
                                  const { payload, dataKey } = barProps;
                                  const currentIndex = filteredCaseTypes.findIndex(
                                    (ct) => `${ct}_新規案件数_昨年` === dataKey,
                                  );
                                  const hasValueBelowInStack = filteredCaseTypes
                                    .slice(0, currentIndex)
                                    .some((ct) => ((payload?.[`${ct}_新規案件数_昨年`] as number) || 0) > 0);
                                  const hasValueAboveInStack = filteredCaseTypes
                                    .slice(currentIndex + 1)
                                    .some((ct) => ((payload?.[`${ct}_新規案件数_昨年`] as number) || 0) > 0);
                                  const hasValueBelowOtherStacks =
                                    (caseCountShowPreviousYear &&
                                      caseCountVisibleMetrics.新規案件数 &&
                                      filteredCaseTypes.some(
                                        (ct) => ((payload?.[`${ct}_新規案件数_昨年`] as number) || 0) > 0,
                                      )) ||
                                    (caseCountVisibleMetrics.新規案件数 &&
                                      filteredCaseTypes.some(
                                        (ct) => ((payload?.[`${ct}_新規案件数`] as number) || 0) > 0,
                                      ));
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
                                  dataKey={`${caseType}_新規案件数_昨年`}
                                  content={(props: LabelListContentProps) => (
                                    <BadgeLabel
                                      {...props}
                                      dataKey={`${caseType}_新規案件数_昨年`}
                                      badgeVariant={style?.badgeVariant}
                                    />
                                  )}
                                />
                              </Bar>
                            );
                          })}
                        {/* 昨年の新規案件数の合計をバーの上に表示 */}
                        {caseCountShowPreviousYear &&
                          caseCountVisibleMetrics.新規案件数 &&
                          filteredCaseTypes.length > 0 && (
                            <Bar
                              key="新規案件数_昨年_合計"
                              dataKey="dummy_previous"
                              stackId="new_previous"
                              fill="transparent"
                              opacity={0}
                              legendType="none"
                            >
                              <LabelList
                                position="top"
                                offset={12}
                                content={(props: LabelListContentProps) => {
                                  if (props.index === undefined) return null;
                                  const data = caseCountByCaseTypeMergedPerformanceData;
                                  const rowData = data[props.index];
                                  if (!rowData) return null;
                                  // すべての案件タイプの昨年の新規案件数の合計を計算
                                  const total = filteredCaseTypes.reduce((sum, caseType) => {
                                    return sum + ((rowData[`${caseType}_新規案件数_昨年`] as number) || 0);
                                  }, 0);
                                  if (total === 0) return null;
                                  return <TopLabel {...props} value={total} dataKey="新規案件数" />;
                                }}
                              />
                            </Bar>
                          )}
                        {/* 今年の新規案件数（すべての案件タイプを積み上げ） */}
                        {filteredCaseTypes.map((caseType) => {
                          const localizedName =
                            (CASE_TYPE_MAPPING[locale as keyof typeof CASE_TYPE_MAPPING]?.[caseType] as string) ||
                            caseType;
                          const style = CASE_TYPE_CATEGORY_STYLES[caseType];
                          const fill = style?.svgPattern ? "transparent" : (style?.backgroundColor ?? "#6366f1");
                          return (
                            <Bar
                              key={`${caseType}_新規案件数`}
                              dataKey={`${caseType}_新規案件数`}
                              fill={fill}
                              name={localizedName}
                              stackId="new"
                              // biome-ignore lint/suspicious/noExplicitAny: Recharts Bar shape prop type
                              shape={(barProps: any) => {
                                const { payload, dataKey } = barProps;
                                const currentIndex = filteredCaseTypes.findIndex(
                                  (ct) => `${ct}_新規案件数` === dataKey,
                                );
                                const isFirstInStack = currentIndex === 0;
                                const hasValueBelowInStack = filteredCaseTypes
                                  .slice(0, currentIndex)
                                  .some((ct) => ((payload?.[`${ct}_新規案件数`] as number) || 0) > 0);
                                const hasValueAboveInStack = filteredCaseTypes
                                  .slice(currentIndex + 1)
                                  .some((ct) => ((payload?.[`${ct}_新規案件数`] as number) || 0) > 0);
                                const hasValueBelowOtherStacks =
                                  (caseCountShowPreviousYear &&
                                    caseCountVisibleMetrics.新規案件数 &&
                                    filteredCaseTypes.some(
                                      (ct) => ((payload?.[`${ct}_新規案件数_昨年`] as number) || 0) > 0,
                                    )) ||
                                  filteredCaseTypes.some((ct) => ((payload?.[`${ct}_新規案件数`] as number) || 0) > 0);
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
                                dataKey={`${caseType}_新規案件数`}
                                content={(props: LabelListContentProps) => (
                                  <BadgeLabel
                                    {...props}
                                    dataKey={`${caseType}_新規案件数`}
                                    badgeVariant={style?.badgeVariant}
                                  />
                                )}
                              />
                            </Bar>
                          );
                        })}
                        {/* 新規案件数の合計をバーの上に表示 */}
                        {caseCountVisibleMetrics.新規案件数 && filteredCaseTypes.length > 0 && (
                          <Bar
                            key="新規案件数_合計"
                            dataKey="dummy"
                            stackId="new"
                            fill="transparent"
                            opacity={0}
                            legendType="none"
                          >
                            <LabelList
                              position="top"
                              offset={12}
                              content={(props: LabelListContentProps) => {
                                if (props.index === undefined) return null;
                                const data = caseCountShowPreviousYear
                                  ? caseCountByCaseTypeMergedPerformanceData
                                  : caseCountByCaseTypeOverallPerformanceData;
                                const rowData = data[props.index];
                                if (!rowData) return null;
                                // すべての案件タイプの新規案件数の合計を計算
                                const total = filteredCaseTypes.reduce((sum, caseType) => {
                                  return sum + ((rowData[`${caseType}_新規案件数`] as number) || 0);
                                }, 0);
                                if (total === 0) return null;
                                return <TopLabel {...props} value={total} dataKey="新規案件数" />;
                              }}
                            />
                          </Bar>
                        )}
                        <CartesianGrid vertical={false} horizontal={false} stroke="#e2e8f0" />
                      </BarChart>
                    </ResponsiveContainer>
                  );
                })()}
              </>
            ) : caseCountViewType === "caseType" ? (
              <div
                style={{
                  background: "var(--aegis-color-background-default)",
                  padding: "var(--aegis-space-xLarge)",
                  borderRadius: "var(--aegis-radius-large)",
                }}
              >
                <DataTable
                  columns={byCaseTypeTableColumns}
                  rows={
                    caseCountShowPreviousYear
                      ? caseCountByCaseTypeMergedPerformanceData
                      : caseCountByCaseTypeOverallPerformanceData
                  }
                  defaultColumnPinning={{ start: ["name"] }}
                  highlightRowOnHover={false}
                />
              </div>
            ) : null}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
