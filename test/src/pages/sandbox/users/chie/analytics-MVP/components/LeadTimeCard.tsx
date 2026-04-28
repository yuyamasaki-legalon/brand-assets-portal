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
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import chartPalette from "../ChartParette.json";
import { CASE_TYPE_MAPPING, CASE_TYPE_ORDER } from "../constants";
import { useLeadTimeData } from "../hooks/useLeadTimeData";
import { useTranslation } from "../hooks/useTranslation";
import { reportTranslations } from "../reportTranslations";
import {
  CustomChartTooltip,
  CustomDiamondDot,
  CustomSquareDot,
  CustomXAxisTick,
  renderCustomLegend,
} from "./chart-components";

export interface LeadTimeCardProps {
  // State
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
  performanceDateRange: { start: Date | null; end: Date | null };
  // Handlers
  onLeadTimeGraphViewModeChange: (mode: "graph" | "table") => void;
  onLeadTimeVisibleMetricsChange: (metrics: { リードタイム中央値: boolean; 初回返信速度中央値: boolean }) => void;
  onLeadTimeShowPreviousYearChange: (show: boolean) => void;
  onLeadTimeCaseTypeFilterChange: (filter: string) => void;
  onIsLeadTimeGraphFilterOpenChange: (open: boolean) => void;
}

export function LeadTimeCard(props: LeadTimeCardProps) {
  const [isLeadTimeInfoPopoverOpen, setIsLeadTimeInfoPopoverOpen] = useState(false);
  const [isLeadTimeInfoPopoverPinned, setIsLeadTimeInfoPopoverPinned] = useState(false);
  const [isLeadTimeGraphViewModeMenuOpen, setIsLeadTimeGraphViewModeMenuOpen] = useState(false);
  const {
    leadTimeGraphViewMode,
    leadTimeVisibleMetrics,
    leadTimeShowPreviousYear,
    leadTimeCaseTypeFilter,
    isLeadTimeGraphFilterOpen,
    leadTimeOverallPerformanceData,
    leadTimeMergedPerformanceData,
    leadTimeAllPeriodData,
    performanceDateRange,
    onLeadTimeGraphViewModeChange,
    onLeadTimeVisibleMetricsChange,
    onLeadTimeShowPreviousYearChange,
    onLeadTimeCaseTypeFilterChange,
    onIsLeadTimeGraphFilterOpenChange,
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

  // useLeadTimeDataフックを使用
  const { tableColumns: leadTimeTableColumns, maxValue: leadTimeMaxValue } = useLeadTimeData({
    visibleMetrics: leadTimeVisibleMetrics,
    showPreviousYear: leadTimeShowPreviousYear,
    mergedPerformanceData: leadTimeMergedPerformanceData,
    overallPerformanceData: leadTimeOverallPerformanceData,
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
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", alignItems: "center" }}>
                <Text variant="body.medium.bold">{t("processingSpeed")}</Text>
                <Popover
                  open={isLeadTimeInfoPopoverOpen}
                  onOpenChange={(open) => {
                    setIsLeadTimeInfoPopoverOpen(open);
                    if (!open) {
                      setIsLeadTimeInfoPopoverPinned(false);
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
                        if (!isLeadTimeInfoPopoverPinned) {
                          setIsLeadTimeInfoPopoverOpen(true);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!isLeadTimeInfoPopoverPinned) {
                          setIsLeadTimeInfoPopoverOpen(false);
                        }
                      }}
                      onClickCapture={(e) => {
                        e.stopPropagation();
                        setIsLeadTimeInfoPopoverOpen(true);
                        setIsLeadTimeInfoPopoverPinned(true);
                      }}
                    />
                  </Popover.Anchor>
                  <Popover.Content width="small">
                    <Popover.Body>
                      <Text variant="body.small">{t("monthlyDescription")}</Text>
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
            <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
              <ButtonGroup variant="plain" size="medium">
                <Popover
                  open={isLeadTimeGraphFilterOpen}
                  onOpenChange={onIsLeadTimeGraphFilterOpenChange}
                  placement="bottom-end"
                >
                  <Popover.Anchor>
                    <Tooltip title={t("filter")}>
                      <IconButton
                        variant={leadTimeCaseTypeFilter !== "すべて" ? "subtle" : "plain"}
                        color={leadTimeCaseTypeFilter !== "すべて" ? "information" : undefined}
                        size="medium"
                        aria-label={t("filter")}
                      >
                        <Badge color="information" invisible={leadTimeCaseTypeFilter === "すべて"}>
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
                            value={leadTimeCaseTypeFilter}
                            onChange={onLeadTimeCaseTypeFilterChange}
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
                {leadTimeCaseTypeFilter !== "すべて" && (
                  <Button
                    variant="subtle"
                    size="medium"
                    onClick={() => {
                      onLeadTimeVisibleMetricsChange({
                        リードタイム中央値: true,
                        初回返信速度中央値: true,
                      });
                      onLeadTimeCaseTypeFilterChange("すべて");
                    }}
                  >
                    {t("reset")}
                  </Button>
                )}
                <Menu
                  open={isLeadTimeGraphViewModeMenuOpen}
                  onOpenChange={setIsLeadTimeGraphViewModeMenuOpen}
                  placement="bottom-end"
                >
                  <Menu.Anchor>
                    <Tooltip title={leadTimeGraphViewMode === "table" ? t("table") : t("graph")}>
                      <IconButton
                        variant="plain"
                        size="medium"
                        aria-label={leadTimeGraphViewMode === "table" ? t("table") : t("graph")}
                        icon={leadTimeGraphViewMode === "graph" ? LfChartBar : LfTable}
                      />
                    </Tooltip>
                  </Menu.Anchor>
                  <Menu.Box width="auto">
                    <ActionList size="large">
                      <ActionList.Item
                        selected={leadTimeGraphViewMode === "graph"}
                        onClick={() => {
                          onLeadTimeGraphViewModeChange("graph");
                          setIsLeadTimeGraphViewModeMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfChartBar />
                            </Icon>
                          }
                          trailing={
                            leadTimeGraphViewMode === "graph" ? (
                              <Icon>
                                <LfCheck />
                              </Icon>
                            ) : undefined
                          }
                        >
                          {t("graph")}
                        </ActionList.Body>
                      </ActionList.Item>
                      <ActionList.Item
                        selected={leadTimeGraphViewMode === "table"}
                        onClick={() => {
                          onLeadTimeGraphViewModeChange("table");
                          setIsLeadTimeGraphViewModeMenuOpen(false);
                        }}
                      >
                        <ActionList.Body
                          leading={
                            <Icon>
                              <LfTable />
                            </Icon>
                          }
                          trailing={
                            leadTimeGraphViewMode === "table" ? (
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
                checked={leadTimeShowPreviousYear}
                onChange={(e) => onLeadTimeShowPreviousYearChange(e.target.checked)}
              >
                {t("showPreviousYear")}
              </Checkbox>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
            {leadTimeGraphViewMode === "graph" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  <Card variant="plain" size="small" style={{ flex: 1 }}>
                    <CardBody style={{ gap: "var(--aegis-space-x3Small)" }}>
                      <Text variant="body.small">
                        {leadTimeShowPreviousYear &&
                        leadTimeAllPeriodData.初回返信速度中央値_昨年 !== undefined &&
                        leadTimeAllPeriodData.初回返信速度中央値_昨年 > 0
                          ? `${t("firstResponseMedian")}（${t("previousYearLabel")}/${t("currentYear")}）`
                          : t("firstResponseMedian")}
                      </Text>
                      {leadTimeAllPeriodData.初回返信速度中央値 > 0 ? (
                        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--aegis-space-xxSmall)" }}>
                          {leadTimeShowPreviousYear &&
                          leadTimeAllPeriodData.初回返信速度中央値_昨年 !== undefined &&
                          leadTimeAllPeriodData.初回返信速度中央値_昨年 > 0 ? (
                            <>
                              <Text variant="body.large.bold">
                                {leadTimeAllPeriodData.初回返信速度中央値.toFixed(1)}
                              </Text>
                              <Text variant="body.small.bold">{t("days")}</Text>
                              <Text variant="body.medium.bold"> / </Text>
                              <Text variant="body.large.bold">
                                {leadTimeAllPeriodData.初回返信速度中央値_昨年.toFixed(1)}
                              </Text>
                              <Text variant="body.small.bold">{t("days")}</Text>
                            </>
                          ) : (
                            <>
                              <Text variant="body.large.bold">
                                {leadTimeAllPeriodData.初回返信速度中央値.toFixed(1)}
                              </Text>
                              <Text variant="body.small.bold">{t("days")}</Text>
                            </>
                          )}
                        </div>
                      ) : (
                        <Text variant="body.small">-</Text>
                      )}
                    </CardBody>
                  </Card>
                  <Card variant="plain" size="small" style={{ flex: 1 }}>
                    <CardBody style={{ gap: "var(--aegis-space-x3Small)" }}>
                      <Text variant="body.small">
                        {leadTimeShowPreviousYear &&
                        leadTimeAllPeriodData.リードタイム中央値_昨年 !== undefined &&
                        leadTimeAllPeriodData.リードタイム中央値_昨年 > 0
                          ? `${t("monthlyGraphViewLeadTime")}（${t("previousYearLabel")}/${t("currentYear")}）`
                          : t("monthlyGraphViewLeadTime")}
                      </Text>
                      {leadTimeAllPeriodData.リードタイム中央値 > 0 ? (
                        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--aegis-space-xxSmall)" }}>
                          {leadTimeShowPreviousYear &&
                          leadTimeAllPeriodData.リードタイム中央値_昨年 !== undefined &&
                          leadTimeAllPeriodData.リードタイム中央値_昨年 > 0 ? (
                            <>
                              <Text variant="body.large.bold">
                                {leadTimeAllPeriodData.リードタイム中央値.toFixed(1)}
                              </Text>
                              <Text variant="body.small.bold">{t("days")}</Text>
                              <Text variant="body.medium.bold"> / </Text>
                              <Text variant="body.large.bold">
                                {leadTimeAllPeriodData.リードタイム中央値_昨年.toFixed(1)}
                              </Text>
                              <Text variant="body.small.bold">{t("days")}</Text>
                            </>
                          ) : (
                            <>
                              <Text variant="body.large.bold">
                                {leadTimeAllPeriodData.リードタイム中央値.toFixed(1)}
                              </Text>
                              <Text variant="body.small.bold">{t("days")}</Text>
                            </>
                          )}
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
                background: "var(--aegis-color-background-default)",
                padding: "var(--aegis-space-xLarge)",
                borderRadius: "var(--aegis-radius-large)",
              }}
            >
              {leadTimeGraphViewMode === "graph" ? (
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart
                    data={leadTimeShowPreviousYear ? leadTimeMergedPerformanceData : leadTimeOverallPerformanceData}
                    margin={{
                      top: 16,
                      right: 40,
                      left: 40,
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
                          showPreviousYearComparison={leadTimeShowPreviousYear}
                          locale={locale}
                          caseTypeFilter={leadTimeCaseTypeFilter}
                          filterByCompletionDate={true}
                          isBarChart={false}
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
                    {leadTimeVisibleMetrics.リードタイム中央値 && (
                      <>
                        <Line
                          yAxisId="right"
                          type="linear"
                          dataKey="リードタイム中央値"
                          stroke={chartPalette.azure["500(border only)"]}
                          strokeWidth={2}
                          dot={<CustomDiamondDot stroke={chartPalette.azure["500(border only)"]} />}
                          activeDot={
                            <CustomDiamondDot
                              stroke={chartPalette.azure["500(border only)"]}
                              fill={chartPalette.azure["500(border only)"]}
                            />
                          }
                          name={t("leadTimeMedianShort")}
                          legendType="diamond"
                        >
                          <LabelList
                            position="top"
                            offset={12}
                            dataKey="リードタイム中央値"
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
                        {leadTimeShowPreviousYear && (
                          <Line
                            yAxisId="right"
                            type="linear"
                            dataKey="リードタイム中央値_昨年"
                            stroke={chartPalette.azure["500(border only)"]}
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            opacity={0.6}
                            dot={<CustomSquareDot stroke={chartPalette.azure["500(border only)"]} />}
                            activeDot={
                              <CustomSquareDot
                                stroke={chartPalette.azure["500(border only)"]}
                                fill={chartPalette.azure["500(border only)"]}
                              />
                            }
                            name={`${t("leadTimeMedianShort")} (${t("previousYearLabel")})`}
                          />
                        )}
                      </>
                    )}
                    {leadTimeVisibleMetrics.初回返信速度中央値 && (
                      <>
                        <Line
                          yAxisId="right"
                          type="linear"
                          dataKey="初回返信速度中央値"
                          stroke={chartPalette.orange["500(border only)"]}
                          strokeWidth={2}
                          dot={{
                            stroke: chartPalette.orange["500(border only)"],
                            strokeWidth: 2,
                            r: 4,
                            fill: "#fff",
                          }}
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
                            dataKey="初回返信速度中央値"
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
                        {leadTimeShowPreviousYear && (
                          <Line
                            yAxisId="right"
                            type="linear"
                            dataKey="初回返信速度中央値_昨年"
                            stroke={chartPalette.orange["500(border only)"]}
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            opacity={0.6}
                            dot={<CustomSquareDot stroke={chartPalette.orange["500(border only)"]} />}
                            activeDot={
                              <CustomSquareDot
                                stroke={chartPalette.orange["500(border only)"]}
                                fill={chartPalette.orange["500(border only)"]}
                              />
                            }
                            name={`${t("firstResponseMedianShort")} (${t("previousYearLabel")})`}
                          />
                        )}
                      </>
                    )}
                    <CartesianGrid vertical={false} horizontal={false} stroke="#e2e8f0" />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    background: "var(--aegis-color-background-default)",
                    padding: "var(--aegis-space-xLarge)",
                    borderRadius: "var(--aegis-radius-large)",
                  }}
                >
                  <DataTable
                    columns={leadTimeTableColumns}
                    rows={[
                      {
                        name: t("allPeriod"),
                        新規案件数: 0,
                        新規案件数_昨年: 0,
                        onTimeCompletionCount: 0,
                        onTimeCompletionCount_昨年: 0,
                        overdueCompletionCount: 0,
                        overdueCompletionCount_昨年: 0,
                        noDueDateCompletionCount: 0,
                        noDueDateCompletionCount_昨年: 0,
                        リードタイム中央値: leadTimeAllPeriodData.リードタイム中央値,
                        リードタイム中央値_昨年: 0,
                        初回返信速度中央値: leadTimeAllPeriodData.初回返信速度中央値,
                        初回返信速度中央値_昨年: 0,
                      },
                      ...(leadTimeShowPreviousYear
                        ? leadTimeMergedPerformanceData
                        : leadTimeOverallPerformanceData.map((row) => ({
                            ...row,
                            新規案件数_昨年: 0,
                            onTimeCompletionCount_昨年: 0,
                            overdueCompletionCount_昨年: 0,
                            noDueDateCompletionCount_昨年: 0,
                            リードタイム中央値_昨年: 0,
                            初回返信速度中央値_昨年: 0,
                          }))),
                    ]}
                    defaultColumnPinning={{ start: ["name"] }}
                    highlightRowOnHover={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
