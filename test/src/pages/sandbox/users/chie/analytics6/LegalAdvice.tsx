import { LfChartBar, LfCloseLarge, LfFilter, LfTable } from "@legalforce/aegis-icons";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  ContentHeader,
  DataTable,
  type DataTableColumnDef,
  FormControl,
  Icon,
  IconButton,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  RangeDatePicker,
  SegmentedControl,
  Select,
} from "@legalforce/aegis-react";
import { useEffect, useMemo, useState } from "react";
// import WordCloud from "react-wordcloud";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CaseData, CaseType } from "./data";
import { CASE_TYPE_ORDER, caseData } from "./data";

// --- Component ---
export default function LegalAdvice() {
  const [paneOpen, setPaneOpen] = useState(false);
  const [paneContext, setPaneContext] = useState<{ type: "month" | "category"; key: string } | null>(null);

  // Case Count State
  const [legalCaseTypeViewMode, setLegalCaseTypeViewMode] = useState<"graph" | "table">("graph");
  const [isLegalCaseFilterOpen, setIsLegalCaseFilterOpen] = useState(false);
  const [activeCaseTypeFilter, setActiveCaseTypeFilter] = useState("すべて");
  const [showPreviousYear, setShowPreviousYear] = useState(false);
  const isLegalCaseFiltering = activeCaseTypeFilter !== "すべて";

  // Distribution State
  const [legalDistributionViewMode, setLegalDistributionViewMode] = useState<"graph" | "table">("graph");

  // Breakdown State
  const [legalBreakdownViewMode, setLegalBreakdownViewMode] = useState<"graph" | "table">("graph");

  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [isPaneDataTableReady, setIsPaneDataTableReady] = useState(false);
  const [paneCaseTypeFilter, setPaneCaseTypeFilter] = useState("すべて");
  const [paneCategoryFilter, setPaneCategoryFilter] = useState("すべて");

  const renderViewSwitch = (current: "graph" | "table", onChange: (mode: "graph" | "table") => void) => (
    <SegmentedControl
      size="small"
      index={current === "graph" ? 0 : 1}
      onChange={(index) => onChange(index === 0 ? "graph" : "table")}
    >
      <SegmentedControl.Button
        leading={
          <Icon>
            <LfChartBar />
          </Icon>
        }
        aria-label="グラフ表示"
      />
      <SegmentedControl.Button
        leading={
          <Icon>
            <LfTable />
          </Icon>
        }
        aria-label="テーブル表示"
      />
    </SegmentedControl>
  );

  useEffect(() => {
    if (paneOpen) {
      const timer = setTimeout(() => {
        setIsPaneDataTableReady(true);
      }, 300);
      return () => clearTimeout(timer);
    }
    setIsPaneDataTableReady(false);
  }, [paneOpen]);

  const allContractCategories = useMemo(
    () => Array.from(new Set(caseData.map((c) => c.contractCategory).filter((c): c is string => !!c))).sort(),
    [],
  );

  const contractReviewBreakdownData = useMemo(() => {
    let relevantCases = caseData.filter((c) => c.caseType === "契約書審査" && c.contractCategory);

    if (dateRange.start && dateRange.end) {
      const { start, end } = dateRange;
      relevantCases = relevantCases.filter((item) => {
        const itemDate = new Date(item.startDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    const counts = relevantCases.reduce<Record<string, number>>((acc, c) => {
      if (c.contractCategory) {
        acc[c.contractCategory] = (acc[c.contractCategory] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [dateRange]);

  const breakdownChartHeight = useMemo(() => {
    const barHeight = 40; // px per bar
    const padding = 60; // for top/bottom margins
    const minHeight = 200;
    const calculatedHeight = contractReviewBreakdownData.length * barHeight + padding;
    return Math.max(minHeight, calculatedHeight);
  }, [contractReviewBreakdownData]);

  const caseTypeDistributionData = useMemo(() => {
    let relevantCases = caseData;

    if (dateRange.start && dateRange.end) {
      const { start, end } = dateRange;
      relevantCases = relevantCases.filter((item) => {
        const itemDate = new Date(item.startDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    const counts = relevantCases.reduce<Record<string, number>>((acc, c) => {
      acc[c.caseType] = (acc[c.caseType] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0) // Hide categories with 0 count
      .sort((a, b) => CASE_TYPE_ORDER.indexOf(a.name as CaseType) - CASE_TYPE_ORDER.indexOf(b.name as CaseType));
  }, [dateRange]);

  const filteredChartData = useMemo(() => {
    let filtered = caseData;

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      const { start, end } = dateRange;
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.startDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    // Filter by case type
    if (activeCaseTypeFilter !== "すべて") {
      filtered = filtered.filter((item) => item.caseType === activeCaseTypeFilter);
    }

    // Aggregate by month
    const monthlyAgg: Record<
      string,
      { name: string; date: Date } & Record<CaseType, number> & { [key: string]: number | string | Date }
    > = {};
    filtered.forEach((c) => {
      const startOfMonth = new Date(c.startDate);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const monthKey = startOfMonth.toISOString();

      if (!monthlyAgg[monthKey]) {
        monthlyAgg[monthKey] = {
          name: startOfMonth.toLocaleString("ja-JP", { year: "numeric", month: "long" }),
          date: startOfMonth,
          契約書審査: 0,
          契約書起案: 0,
          法務相談: 0,
          その他: 0,
        };
      }
      monthlyAgg[monthKey][c.caseType] += 1;
    });

    // Generate mock data for previous year if enabled
    if (showPreviousYear) {
      Object.values(monthlyAgg).forEach((data) => {
        CASE_TYPE_ORDER.forEach((type) => {
          // Generate a random previous year value based on current value (50% - 150%)
          const currentVal = data[type];
          const randomFactor = 0.5 + Math.random(); // 0.5 to 1.5
          data[`${type}_prev`] = Math.round(currentVal * randomFactor);
        });
      });
    }

    return Object.values(monthlyAgg).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [dateRange, activeCaseTypeFilter, showPreviousYear]);

  const yAxisMax = useMemo(() => {
    let dateFiltered = caseData;
    if (dateRange.start && dateRange.end) {
      const { start, end } = dateRange;
      dateFiltered = dateFiltered.filter((item) => {
        const itemDate = new Date(item.startDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    const monthlyAgg: Record<string, number> = {};
    dateFiltered.forEach((c) => {
      const startOfMonth = new Date(c.startDate);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const monthKey = startOfMonth.toISOString();

      if (!monthlyAgg[monthKey]) {
        monthlyAgg[monthKey] = 0;
      }
      monthlyAgg[monthKey] += 1;
    });

    const maxCount = Object.values(monthlyAgg).length > 0 ? Math.max(...Object.values(monthlyAgg)) : 0;

    if (maxCount === 0) {
      return 10;
    }
    // If comparing with previous year, allow more headroom as previous year data might be higher
    const multiplier = showPreviousYear ? 1.5 : 1.1;
    return Math.ceil(maxCount * multiplier);
  }, [dateRange, showPreviousYear]);

  const handleChartElementClick = (monthName: string | null) => {
    if (monthName) {
      setPaneContext({ type: "month", key: monthName });
      setPaneOpen(true);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setPaneContext({ type: "category", key: categoryName });
    setPaneOpen(true);
  };

  const paneCases = useMemo(() => {
    if (!paneContext) return [];

    let cases: CaseData[] = [];

    // Initial filter based on what was clicked
    if (paneContext.type === "month") {
      cases = caseData.filter((c) => {
        const month = new Date(c.startDate).toLocaleString("ja-JP", { year: "numeric", month: "long" });
        return month === paneContext.key;
      });
    } else if (paneContext.type === "category") {
      cases = caseData.filter((c) => c.contractCategory === paneContext.key);
    }

    // This part should also respect the main page filters (dateRange)
    if (dateRange.start && dateRange.end) {
      const { start, end } = dateRange;
      cases = cases.filter((item) => {
        const itemDate = new Date(item.startDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    // Filters inside the pane
    if (paneCaseTypeFilter !== "すべて") {
      cases = cases.filter((c) => c.caseType === paneCaseTypeFilter);
    }

    const isCategoryFilterEnabled = paneCaseTypeFilter === "すべて" || paneCaseTypeFilter === "契約書審査";
    if (isCategoryFilterEnabled && paneCategoryFilter !== "すべて") {
      cases = cases.filter((c) => c.contractCategory === paneCategoryFilter);
    }

    return cases;
  }, [paneContext, dateRange, paneCaseTypeFilter, paneCategoryFilter]);

  const caseTableColumns: DataTableColumnDef<CaseData, string | number>[] = useMemo(
    () => [
      { id: "caseName", name: "案件名", getValue: (row) => row.caseName },
      { id: "caseType", name: "案件タイプ", getValue: (row) => row.caseType },
      { id: "assignee", name: "担当者", getValue: (row) => row.assignee },
      { id: "startDate", name: "受付日", getValue: (row) => row.startDate },
    ],
    [],
  );

  const CustomXAxisTick = (props: {
    x?: string | number;
    y?: string | number;
    payload?: { value: string };
    onClick: (month: string) => void;
  }) => {
    const { x, y, payload, onClick } = props;
    const [isHovered, setIsHovered] = useState(false);

    if (x === undefined || y === undefined || !payload?.value) {
      return null;
    }

    const monthName = payload.value;

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-40} y={5} width={80} height={24}>
          <button
            type="button"
            onClick={() => onClick(monthName)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              font: "inherit",
              color: isHovered ? "var(--aegis-color-font-link)" : "var(--aegis-color-font-default)",
              cursor: "pointer",
              width: "100%",
              textAlign: "center",
              textDecoration: "underline",
            }}
          >
            {monthName.replace(/(\d{4}年)/, "")}
          </button>
        </foreignObject>
      </g>
    );
  };

  const BreakdownChartYAxisTick = (props: {
    x?: string | number;
    y?: string | number;
    payload?: { value: string };
    onClick: (category: string) => void;
  }) => {
    const { x, y, payload, onClick } = props;
    const [isHovered, setIsHovered] = useState(false);

    if (x === undefined || y === undefined || !payload?.value) {
      return null;
    }

    const categoryName = payload.value;

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-100} y={-10} width={90} height={24}>
          <button
            type="button"
            onClick={() => onClick(categoryName)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              font: "inherit",
              color: isHovered ? "var(--aegis-color-font-link)" : "var(--aegis-color-font-default)",
              cursor: "pointer",
              width: "100%",
              textAlign: "right",
              textDecoration: "underline",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {categoryName}
          </button>
        </foreignObject>
      </g>
    );
  };

  const CASE_TYPE_COLORS: Record<CaseType, string> = {
    契約書審査: "#4299e1",
    契約書起案: "#9f7aea",
    法務相談: "#ed8636",
    その他: "#a0aec0",
  };

  return (
    <>
      <PageLayoutContent minWidth="medium">
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>案件</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "var(--aegis-space-medium)",
              alignItems: "flex-end",
              paddingBottom: "var(--aegis-space-large)",
            }}
          >
            <div style={{ width: "auto" }}>
              <FormControl orientation="horizontal">
                <FormControl.Label width="auto" style={{ whiteSpace: "nowrap" }}>
                  期間
                </FormControl.Label>
                <RangeDatePicker
                  startValue={dateRange.start}
                  endValue={dateRange.end}
                  onStartChange={(date) => setDateRange((prev) => ({ ...prev, start: date ?? null }))}
                  onEndChange={(date) => setDateRange((prev) => ({ ...prev, end: date ?? null }))}
                />
              </FormControl>
            </div>
            <div style={{ paddingBottom: "var(--aegis-space-xsmall)" }}>
              <Button
                variant="subtle"
                size="small"
                onClick={() => {
                  setDateRange({ start: null, end: null });
                  setActiveCaseTypeFilter("すべて");
                  setShowPreviousYear(false);
                }}
              >
                リセット
              </Button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--aegis-space-large)" }}>
            <Card variant="outline" style={{ gridColumn: "1 / -1" }}>
              <CardHeader>
                <ContentHeader.Title>案件タイプ別の案件数</ContentHeader.Title>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  {/* Left: View settings */}
                  <div>
                    <Checkbox checked={showPreviousYear} onChange={(e) => setShowPreviousYear(e.target.checked)}>
                      昨年対比を表示
                    </Checkbox>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                    <ButtonGroup variant="plain" size="small">
                      <Button
                        aria-pressed={isLegalCaseFilterOpen}
                        leading={
                          <Badge color="information" invisible={!isLegalCaseFiltering}>
                            <Icon>
                              <LfFilter />
                            </Icon>
                          </Badge>
                        }
                        onClick={() => setIsLegalCaseFilterOpen(!isLegalCaseFilterOpen)}
                      >
                        フィルター
                      </Button>
                    </ButtonGroup>
                    {renderViewSwitch(legalCaseTypeViewMode, setLegalCaseTypeViewMode)}
                  </div>
                </div>

                {isLegalCaseFilterOpen && (
                  <Card variant="fill">
                    <CardBody
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--aegis-space-large)",
                        flexWrap: "wrap",
                        flexDirection: "row",
                      }}
                    >
                      <div style={{ width: "160px" }}>
                        <FormControl orientation="vertical">
                          <FormControl.Label>案件タイプ</FormControl.Label>
                          <Select
                            value={activeCaseTypeFilter}
                            onChange={(value) => setActiveCaseTypeFilter(value)}
                            options={[
                              { label: "すべて", value: "すべて" },
                              ...CASE_TYPE_ORDER.map((type) => ({ label: type, value: type })),
                            ]}
                          />
                        </FormControl>
                      </div>
                    </CardBody>
                  </Card>
                )}

                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  {legalCaseTypeViewMode === "graph" ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={filteredChartData}
                        onClick={(data) => handleChartElementClick(data?.activeLabel ? String(data.activeLabel) : null)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={<CustomXAxisTick onClick={handleChartElementClick} />} />
                        <YAxis domain={[0, yAxisMax]} />
                        <Tooltip cursor={{ fill: "transparent" }} />
                        <Legend />
                        {CASE_TYPE_ORDER.map((caseType) => (
                          <Bar
                            key={caseType}
                            dataKey={caseType}
                            name={caseType}
                            stackId="current"
                            fill={CASE_TYPE_COLORS[caseType]}
                            cursor="pointer"
                          >
                            <LabelList
                              dataKey={caseType}
                              position="center"
                              style={{ fill: "white" }}
                              formatter={(value: unknown) => (typeof value === "number" && value > 0 ? value : "")}
                            />
                          </Bar>
                        ))}
                        {showPreviousYear &&
                          CASE_TYPE_ORDER.map((caseType) => (
                            <Bar
                              key={`${caseType}_prev`}
                              dataKey={`${caseType}_prev`}
                              name={`${caseType} (前年)`}
                              stackId="prev"
                              fill={CASE_TYPE_COLORS[caseType]}
                              opacity={0.4}
                              cursor="pointer"
                            >
                              <LabelList
                                dataKey={`${caseType}_prev`}
                                position="center"
                                style={{ fill: "white" }}
                                formatter={(value: unknown) => (typeof value === "number" && value > 0 ? value : "")}
                              />
                            </Bar>
                          ))}
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <DataTable
                      columns={[
                        {
                          id: "name",
                          name: "月",
                          getValue: (row: Record<string, number | string | Date>) => row.name as string,
                        },
                        ...CASE_TYPE_ORDER.map((t) => ({
                          id: t,
                          name: t,
                          getValue: (row: Record<string, number | string | Date>) => row[t] as number,
                        })),
                      ]}
                      rows={filteredChartData as Record<string, number | string | Date>[]}
                    />
                  )}
                </div>
              </CardBody>
            </Card>
            <Card variant="outline">
              <CardHeader>
                <ContentHeader.Title>案件タイプ別 構成比</ContentHeader.Title>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  {renderViewSwitch(legalDistributionViewMode, setLegalDistributionViewMode)}
                </div>
                {legalDistributionViewMode === "graph" ? (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={caseTypeDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                            if (percent === 0) {
                              return null;
                            }
                            return (
                              <text
                                x={x}
                                y={y}
                                fill="white"
                                textAnchor={x > cx ? "start" : "end"}
                                dominantBaseline="central"
                              >
                                {`${(percent * 100).toFixed(0)}%`}
                              </text>
                            );
                          }}
                        >
                          {caseTypeDistributionData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={CASE_TYPE_COLORS[entry.name as CaseType]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <DataTable
                      columns={[
                        {
                          id: "name",
                          name: "案件タイプ",
                          getValue: (row: Record<string, number | string>) => row.name as string,
                        },
                        {
                          id: "value",
                          name: "件数",
                          getValue: (row: Record<string, number | string>) => row.value as number,
                        },
                      ]}
                      rows={caseTypeDistributionData as Record<string, number | string>[]}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
            <Card variant="outline">
              <CardHeader>
                <ContentHeader.Title>契約書審査の内訳（契約類型別）</ContentHeader.Title>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  {renderViewSwitch(legalBreakdownViewMode, setLegalBreakdownViewMode)}
                </div>
                {legalBreakdownViewMode === "graph" ? (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <ResponsiveContainer width="100%" height={breakdownChartHeight}>
                      <BarChart layout="vertical" data={contractReviewBreakdownData} margin={{ left: 100 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={100}
                          tick={<BreakdownChartYAxisTick onClick={handleCategoryClick} />}
                        />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" name="件数">
                          <LabelList
                            dataKey="count"
                            position="right"
                            formatter={(value: unknown) => (typeof value === "number" && value > 0 ? value : "")}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <DataTable
                      columns={[
                        {
                          id: "name",
                          name: "契約類型",
                          getValue: (row: Record<string, number | string>) => row.name as string,
                        },
                        {
                          id: "count",
                          name: "件数",
                          getValue: (row: Record<string, number | string>) => row.count as number,
                        },
                      ]}
                      rows={contractReviewBreakdownData as Record<string, number | string>[]}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
      <PageLayoutPane position="end" aria-label="End Pane" open={paneOpen} resizable>
        <PageLayoutHeader>
          <ContentHeader
            size="medium"
            trailing={
              <IconButton
                aria-label="閉じる"
                onClick={() => {
                  setPaneOpen(false);
                  setPaneContext(null);
                  setPaneCaseTypeFilter("すべて");
                  setPaneCategoryFilter("すべて");
                }}
              >
                <Icon>
                  <LfCloseLarge />
                </Icon>
              </IconButton>
            }
          >
            <ContentHeader.Title>
              {paneContext?.type === "month"
                ? `${paneContext.key} の案件リスト`
                : paneContext?.type === "category"
                  ? `契約類型 "${paneContext.key}" を含む案件`
                  : "案件リスト"}
            </ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            <div style={{ display: "flex", gap: "var(--aegis-space-medium)" }}>
              <FormControl>
                <FormControl.Label>案件タイプ</FormControl.Label>
                <Select
                  value={paneCaseTypeFilter}
                  onChange={setPaneCaseTypeFilter}
                  options={[
                    { label: "すべて", value: "すべて" },
                    ...CASE_TYPE_ORDER.map((type) => ({ label: type, value: type })),
                  ]}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>契約類型</FormControl.Label>
                <Select
                  value={paneCategoryFilter}
                  onChange={setPaneCategoryFilter}
                  disabled={!(paneCaseTypeFilter === "すべて" || paneCaseTypeFilter === "契約書審査")}
                  options={[
                    { label: "すべて", value: "すべて" },
                    ...allContractCategories.map((cat) => ({ label: cat, value: cat })),
                  ]}
                />
              </FormControl>
            </div>
            {isPaneDataTableReady && <DataTable columns={caseTableColumns} rows={paneCases} />}
          </div>
        </PageLayoutBody>
      </PageLayoutPane>
    </>
  );
}
