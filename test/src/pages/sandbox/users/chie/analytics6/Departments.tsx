import { LfChartBar, LfCloseLarge, LfSort19, LfSort91, LfTable } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  DataTable,
  DataTableCell,
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
  Tab,
  TagPicker,
  Text,
} from "@legalforce/aegis-react";
import { useCallback, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  LabelList,
  type LabelProps,
  Legend,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type CaseData, type CaseType, caseData } from "./data";

type DepartmentData = {
  name: string;
  caseCount: {
    review: number; // 契約書審査
    drafting: number; // 契約書起案
    consultation: number; // 法務相談
    other: number;
  };
  totalCaseCount: number;
  medianLeadTime: number;
  medianFirstReplyTime: number;
};

const departmentNames = ["営業部", "開発部", "マーケティング部", "人事部", "経理部"];

const calculateMedian = (values: number[]) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

type TemplateDetailData = {
  id: string;
  templateName: string;
  usageCount: number;
  avgVersionCount: number;
  department: string;
};

type TemplateUsageData = {
  name: string;
  totalUsage: number;
  avgVersionCount: number;
  [key: string]: string | number;
};

const templateDetailData: TemplateDetailData[] = [
  {
    id: "t1",
    templateName: "NDA_standard_v3",
    usageCount: 50,
    avgVersionCount: 1.8,
    department: "営業部",
  },
  {
    id: "t2",
    templateName: "SOW_standard_v2",
    usageCount: 30,
    avgVersionCount: 3.1,
    department: "営業部",
  },
  {
    id: "t3",
    templateName: "NDA_simple_v1.2",
    usageCount: 20,
    avgVersionCount: 2.5,
    department: "開発部",
  },
  {
    id: "t4",
    templateName: "consulting_agreement_v1",
    usageCount: 40,
    avgVersionCount: 1.5,
    department: "マーケティング部",
  },
  // Add more sample data as needed for other departments
];

const caseTypeColors: Record<CaseType, string> = {
  契約書審査: "#8884d8",
  契約書起案: "#82ca9d",
  法務相談: "#ffc658",
  その他: "#d0ed57",
};

const caseTypeOptions = [
  { value: "all", label: "すべて" },
  { value: "契約書審査", label: "契約書審査" },
  { value: "契約書起案", label: "契約書起案" },
  { value: "法務相談", label: "法務相談" },
  { value: "その他", label: "その他" },
];

type ViewMode = "graph" | "table";

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 90);
  return { start: startDate, end: endDate };
};

export default function Departments() {
  const [paneOpen, setPaneOpen] = useState(false);

  // Case Occurrence State
  const [deptCaseViewMode, setDeptCaseViewMode] = useState<ViewMode>("graph");
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType | "all">("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Template Usage State
  const [templateViewMode, setTemplateViewMode] = useState<ViewMode>("graph");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [templateSortOrder, setTemplateSortOrder] = useState<"desc" | "asc">("desc");

  // Breakdown State
  const [breakdownDisplayMode, setBreakdownDisplayMode] = useState<ViewMode>("graph");
  const [breakdownViewMode, setBreakdownViewMode] = useState<"count" | "percentage">("count");

  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [paneCaseTypeFilter, setPaneCaseTypeFilter] = useState<CaseType | "all">("all");
  const [paneCategoryFilter, setPaneCategoryFilter] = useState<string | "all">("all");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>(getDefaultDateRange());

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

  const contractCategories = useMemo(() => {
    const categories = new Set<string>();
    caseData.forEach((c) => {
      if (c.templateName !== null && c.contractCategory) {
        categories.add(c.contractCategory);
      }
    });
    return Array.from(categories).sort();
  }, []);

  const categoryColors = useMemo(() => {
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00c49f", "#ffbb28"];
    const colorMap: Record<string, string> = {};
    contractCategories.forEach((cat, index) => {
      colorMap[cat] = colors[index % colors.length];
    });
    return colorMap;
  }, [contractCategories]);

  const filteredCaseListData = useMemo(() => {
    if (!dateRange.start || !dateRange.end) {
      return [];
    }
    const { start, end } = dateRange;
    return caseData.filter((c) => {
      const caseDate = new Date(c.startDate);
      return caseDate >= start && caseDate <= end;
    });
  }, [dateRange]);

  const filteredDepartmentData = useMemo(() => {
    const initialData = departmentNames.map((name) => ({
      name,
      caseCount: { review: 0, drafting: 0, consultation: 0, other: 0 },
      totalCaseCount: 0,
      leadTimes: [] as number[],
      firstReplyTimes: [] as number[],
      completedCasesCount: 0,
      firstReplyCasesCount: 0,
    }));

    const departmentStats = filteredCaseListData.reduce((acc, c) => {
      const dept = acc.find((d) => d.name === c.requestingDepartment);
      if (dept) {
        if (c.caseType === "契約書審査") dept.caseCount.review += 1;
        else if (c.caseType === "契約書起案") dept.caseCount.drafting += 1;
        else if (c.caseType === "法務相談") dept.caseCount.consultation += 1;
        else if (c.caseType === "その他") dept.caseCount.other += 1;
        dept.totalCaseCount += 1;

        if (c.completionDate && c.startDate) {
          const leadTime =
            (new Date(c.completionDate).getTime() - new Date(c.startDate).getTime()) / (1000 * 3600 * 24);
          dept.leadTimes.push(leadTime);
          dept.completedCasesCount += 1;
        }
        if (c.firstReplyDate && c.startDate) {
          const firstReplyTime =
            (new Date(c.firstReplyDate).getTime() - new Date(c.startDate).getTime()) / (1000 * 3600 * 24);
          dept.firstReplyTimes.push(firstReplyTime);
          dept.firstReplyCasesCount += 1;
        }
      }
      return acc;
    }, initialData);

    const sortedData = departmentStats.sort((a, b) => {
      let countA = a.totalCaseCount;
      let countB = b.totalCaseCount;

      if (selectedCaseType !== "all") {
        if (selectedCaseType === "契約書審査") {
          countA = a.caseCount.review;
          countB = b.caseCount.review;
        } else if (selectedCaseType === "契約書起案") {
          countA = a.caseCount.drafting;
          countB = b.caseCount.drafting;
        } else if (selectedCaseType === "法務相談") {
          countA = a.caseCount.consultation;
          countB = b.caseCount.consultation;
        } else if (selectedCaseType === "その他") {
          countA = a.caseCount.other;
          countB = b.caseCount.other;
        }
      }

      if (sortOrder === "asc") {
        return countA - countB;
      }
      return countB - countA;
    });

    return sortedData.map((dept) => ({
      ...dept,
      medianLeadTime: parseFloat(calculateMedian(dept.leadTimes).toFixed(1)),
      medianFirstReplyTime: parseFloat(calculateMedian(dept.firstReplyTimes).toFixed(1)),
    }));
  }, [filteredCaseListData, sortOrder, selectedCaseType]);

  const filteredTemplateUsageData = useMemo(() => {
    if (!dateRange.start || !dateRange.end) {
      return [];
    }
    const { start, end } = dateRange;

    const dateFilteredCases = caseData.filter((c) => {
      const caseDate = new Date(c.startDate);
      return caseDate >= start && caseDate <= end;
    });

    const departments = [...new Set(dateFilteredCases.map((c) => c.requestingDepartment))];

    const data = departments.map((dept) => {
      const row: TemplateUsageData = {
        name: dept,
        totalUsage: 0,
        avgVersionCount: 1.5, // Dummy average
      };

      const deptCasesWithTemplate = dateFilteredCases.filter(
        (c) => c.requestingDepartment === dept && c.templateName !== null && c.contractCategory,
      );

      let totalUsage = 0;
      contractCategories.forEach((category) => {
        const count = deptCasesWithTemplate.filter((c) => c.contractCategory === category).length;
        row[category] = count;
        if (selectedCategories.length === 0 || selectedCategories.includes(category)) {
          totalUsage += count;
        }
      });
      row.totalUsage = totalUsage;
      return row;
    });

    return data.sort((a, b) => {
      if (templateSortOrder === "asc") {
        return a.totalUsage - b.totalUsage;
      }
      return b.totalUsage - a.totalUsage;
    });
  }, [dateRange, contractCategories, selectedCategories, templateSortOrder]);

  const contractReviewBreakdownData = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return [];
    const { start, end } = dateRange;
    const dateFilteredCases = caseData.filter((c) => {
      const caseDate = new Date(c.startDate);
      return caseDate >= start && caseDate <= end;
    });

    const reviewCases = dateFilteredCases.filter((c) => c.caseType === "契約書審査" && c.contractCategory);
    const departments = [...new Set(reviewCases.map((c) => c.requestingDepartment))];
    const categories = [...new Set(reviewCases.map((c) => c.contractCategory))] as string[];

    const data = departments.map((dept) => {
      const row: { name: string; total: number; [key: string]: string | number } = { name: dept, total: 0 };
      const deptCases = reviewCases.filter((c) => c.requestingDepartment === dept);
      categories.forEach((cat) => {
        const count = deptCases.filter((c) => c.contractCategory === cat).length;
        row[cat] = count;
        row.total += count;
      });
      return row;
    });

    return data;
  }, [dateRange]);

  const handleDepartmentClick = useCallback(
    (departmentName: string, tabIndex = 0, filter: CaseType | string | "all" = "all") => {
      setSelectedDepartment(departmentName);
      setSelectedTabIndex(tabIndex);
      if (tabIndex === 0) {
        setPaneCaseTypeFilter(filter as CaseType | "all");
        setPaneCategoryFilter("all");
      } else {
        setPaneCategoryFilter(filter);
        setPaneCaseTypeFilter("all");
      }
      setPaneOpen(true);
    },
    [],
  );

  const CustomYAxisTick = (props: {
    x?: number | string;
    y?: number | string;
    payload?: { value: string };
    targetTabIndex: number;
  }) => {
    const { x, y, payload, targetTabIndex } = props;
    const [isHovered, setIsHovered] = useState(false);

    if (x === undefined || y === undefined || !payload?.value) {
      return null;
    }

    const handleTickClick = () => {
      handleDepartmentClick(payload.value, targetTabIndex);
    };

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-100} y={-10} width={90} height={24}>
          <button
            type="button"
            onClick={handleTickClick}
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
            {payload.value}
          </button>
        </foreignObject>
      </g>
    );
  };

  const handlePaneClose = () => {
    setPaneOpen(false);
    setSelectedDepartment(null);
    setPaneCaseTypeFilter("all");
    setPaneCategoryFilter("all");
  };

  interface CustomLabelProps extends LabelProps {
    isPercentage?: boolean;
  }

  const CustomLabel = (props: CustomLabelProps) => {
    const { x = 0, y = 0, width = 0, height = 0, value, isPercentage } = props;
    if (value == null || Number(width) <= 20) {
      return null;
    }

    const numericValue = typeof value === "string" ? parseFloat(value) : Number(value);

    if (!Number.isNaN(numericValue) && numericValue > 0) {
      const displayValue = isPercentage ? `${Math.round(numericValue * 100)}%` : value;
      return (
        <text
          x={Number(x) + Number(width) / 2}
          y={Number(y) + Number(height) / 2}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
        >
          {displayValue}
        </text>
      );
    }
    return null;
  };

  const columns: DataTableColumnDef<DepartmentData, string | number>[] = useMemo(
    () => [
      {
        id: "name",
        name: "部署名",
        getValue: (row) => row.name,
      },
      {
        id: "actions",
        name: "",
        renderCell: (info) => (
          <DataTableCell>
            <Button size="small" variant="subtle" onClick={() => handleDepartmentClick(info.row.name, 0)}>
              開く
            </Button>
          </DataTableCell>
        ),
      },
      {
        id: "totalCaseCount",
        name: "総案件数",
        getValue: (row) => row.totalCaseCount,
      },
      {
        id: "caseCount",
        name: "案件タイプ別内訳",
        getValue: (row) =>
          `審査:${row.caseCount.review}, 起案:${row.caseCount.drafting}, 相談:${row.caseCount.consultation}, 他:${row.caseCount.other}`,
      },
      {
        id: "medianLeadTime",
        name: "リードタイム(中央値)",
        getValue: (row) => row.medianLeadTime,
      },
      {
        id: "medianFirstReplyTime",
        name: "初回返信速度(中央値)",
        getValue: (row) => row.medianFirstReplyTime,
      },
    ],
    [handleDepartmentClick],
  );

  const templateUsageColumns: DataTableColumnDef<TemplateUsageData, string | number>[] = useMemo(
    () => [
      {
        id: "name",
        name: "部署名",
        getValue: (row) => row.name,
      },
      {
        id: "actions",
        name: "",
        renderCell: (info) => (
          <DataTableCell>
            <Button size="small" variant="subtle" onClick={() => handleDepartmentClick(info.row.name, 1)}>
              開く
            </Button>
          </DataTableCell>
        ),
      },
      {
        id: "top5",
        name: "利用ひな形Top5",
        getValue: () => "NDA_standard_v3, SOW_standard_v2, ...", // Dummy data
      },
      {
        id: "totalUsage",
        name: "総利用回数",
        getValue: (row) => row.totalUsage,
      },
      {
        id: "avgVersionCount",
        name: "平均バージョン変更回数",
        getValue: (row) => row.avgVersionCount,
      },
    ],
    [handleDepartmentClick],
  );

  const caseListColumns: DataTableColumnDef<CaseData, string | number>[] = useMemo(
    () => [
      {
        id: "caseName",
        name: "案件名",
        getValue: (row) => row.caseName,
      },
      {
        id: "assignee",
        name: "担当者",
        getValue: (row) => row.assignee,
      },
      {
        id: "caseType",
        name: "案件タイプ",
        getValue: (row) => row.caseType,
      },
      {
        id: "receptionDate",
        name: "受付日",
        getValue: (row) => row.startDate,
      },
    ],
    [],
  );

  const templateDetailColumns: DataTableColumnDef<TemplateDetailData, string | number>[] = useMemo(
    () => [
      {
        id: "templateName",
        name: "ひな形名",
        getValue: (row) => row.templateName,
      },
      {
        id: "usageCount",
        name: "利用回数",
        getValue: (row) => row.usageCount,
      },
      {
        id: "avgVersionCount",
        name: "平均バージョン変更回数",
        getValue: (row) => row.avgVersionCount,
      },
    ],
    [],
  );

  const filteredCaseList = useMemo(() => {
    if (!selectedDepartment) return [];
    let cases = filteredCaseListData.filter((c) => c.requestingDepartment === selectedDepartment);
    if (paneCaseTypeFilter !== "all") {
      cases = cases.filter((c) => c.caseType === paneCaseTypeFilter);
    }
    return cases;
  }, [selectedDepartment, filteredCaseListData, paneCaseTypeFilter]);

  const slicedCaseList = useMemo(() => filteredCaseList.slice(0, 20), [filteredCaseList]);

  const filteredTemplateDetail = useMemo(() => {
    if (!selectedDepartment) return [];
    let details = templateDetailData.filter((t) => t.department === selectedDepartment);
    if (paneCategoryFilter !== "all") {
      const selectedCategory = contractCategories.find((c) => c === paneCategoryFilter);
      if (selectedCategory) {
        details = caseData
          .filter(
            (c) =>
              c.requestingDepartment === selectedDepartment &&
              c.templateName !== null &&
              c.contractCategory === selectedCategory,
          )
          .map((c) => ({
            id: c.id.toString(),
            templateName: c.templateName ?? "N/A",
            usageCount: 1, // This part might need more complex logic if we count usage per template
            avgVersionCount: 1, // Placeholder
            department: c.requestingDepartment,
            contractCategory: c.contractCategory,
          }));
      }
    }
    return details;
  }, [selectedDepartment, paneCategoryFilter, contractCategories]);

  return (
    <>
      <PageLayoutContent minWidth="medium">
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>部署</ContentHeader.Title>
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
                  setDateRange(getDefaultDateRange());
                }}
              >
                リセット
              </Button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-large)",
            }}
          >
            <Card variant="outline">
              <CardHeader>
                <ContentHeader.Title>部署別の案件発生状況</ContentHeader.Title>
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
                  {/* Left: Primary Filter */}
                  <div style={{ width: "360px" }}>
                    <FormControl orientation="horizontal">
                      <FormControl.Label width="auto" style={{ whiteSpace: "nowrap" }}>
                        案件タイプ
                      </FormControl.Label>
                      <Select
                        options={caseTypeOptions}
                        value={selectedCaseType}
                        onChange={(value) => {
                          if (value) {
                            setSelectedCaseType(value as CaseType | "all");
                          }
                        }}
                      />
                    </FormControl>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                    <ButtonGroup variant="plain" size="small">
                      <Button
                        leading={<Icon>{sortOrder === "asc" ? <LfSort19 /> : <LfSort91 />}</Icon>}
                        onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                      >
                        案件数
                      </Button>
                    </ButtonGroup>
                    {renderViewSwitch(deptCaseViewMode, setDeptCaseViewMode)}
                  </div>
                </div>

                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  {deptCaseViewMode === "graph" ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart data={filteredDepartmentData} layout="vertical" margin={{ left: 100 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          type="number"
                          orientation="bottom"
                          label={{ value: "案件数", position: "insideBottom", dy: 10 }}
                        />
                        <XAxis
                          type="number"
                          orientation="top"
                          xAxisId="top"
                          dataKey="medianLeadTime"
                          domain={["dataMin - 1", "dataMax + 1"]}
                          label={{ value: "リードタイム・初回返信速度(中央値)", position: "insideTop", dy: -10 }}
                        />
                        <YAxis
                          yAxisId="left"
                          dataKey="name"
                          type="category"
                          width={100}
                          tick={<CustomYAxisTick targetTabIndex={0} />}
                        />
                        <Tooltip />
                        <Legend />
                        {(selectedCaseType === "all" || selectedCaseType === "契約書審査") && (
                          <Bar
                            yAxisId="left"
                            dataKey="caseCount.review"
                            stackId="a"
                            name="契約書審査"
                            fill={caseTypeColors.契約書審査}
                            onClick={(data) => {
                              if (data.name) handleDepartmentClick(data.name, 0, "契約書審査");
                            }}
                          >
                            <LabelList dataKey="caseCount.review" content={<CustomLabel />} />
                          </Bar>
                        )}
                        {(selectedCaseType === "all" || selectedCaseType === "契約書起案") && (
                          <Bar
                            yAxisId="left"
                            dataKey="caseCount.drafting"
                            stackId="a"
                            name="契約書起案"
                            fill={caseTypeColors.契約書起案}
                            onClick={(data) => {
                              if (data.name) handleDepartmentClick(data.name, 0, "契約書起案");
                            }}
                          >
                            <LabelList dataKey="caseCount.drafting" content={<CustomLabel />} />
                          </Bar>
                        )}
                        {(selectedCaseType === "all" || selectedCaseType === "法務相談") && (
                          <Bar
                            yAxisId="left"
                            dataKey="caseCount.consultation"
                            stackId="a"
                            name="法務相談"
                            fill={caseTypeColors.法務相談}
                            onClick={(data) => {
                              if (data.name) handleDepartmentClick(data.name, 0, "法務相談");
                            }}
                          >
                            <LabelList dataKey="caseCount.consultation" content={<CustomLabel />} />
                          </Bar>
                        )}
                        {(selectedCaseType === "all" || selectedCaseType === "その他") && (
                          <Bar
                            yAxisId="left"
                            dataKey="caseCount.other"
                            stackId="a"
                            name="その他"
                            fill={caseTypeColors.その他}
                            onClick={(data) => {
                              if (data.name) handleDepartmentClick(data.name, 0, "その他");
                            }}
                          >
                            <LabelList dataKey="caseCount.other" content={<CustomLabel />} />
                          </Bar>
                        )}
                        <Scatter
                          yAxisId="left"
                          xAxisId="top"
                          dataKey="medianLeadTime"
                          name="リードタイム(中央値)"
                          fill="#ff7300"
                          onClick={(data) => {
                            if (data.name) handleDepartmentClick(data.name, 0);
                          }}
                        />
                        <Scatter
                          yAxisId="left"
                          xAxisId="top"
                          dataKey="medianFirstReplyTime"
                          name="初回返信速度(中央値)"
                          fill="#387908"
                          onClick={(data) => {
                            if (data.name) handleDepartmentClick(data.name, 0);
                          }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <DataTable columns={columns} rows={filteredDepartmentData} />
                  )}
                </div>
              </CardBody>
            </Card>
            <Card variant="outline">
              <CardHeader>
                <ContentHeader.Title>部署別のひな形利用状況</ContentHeader.Title>
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
                  {/* Left: Primary Filter */}
                  <div style={{ width: "360px" }}>
                    <FormControl orientation="horizontal">
                      <FormControl.Label width="auto" style={{ whiteSpace: "nowrap" }}>
                        契約類型
                      </FormControl.Label>
                      <TagPicker
                        options={contractCategories.map((c) => ({ value: c, label: c }))}
                        value={selectedCategories}
                        onChange={setSelectedCategories}
                        size="medium"
                      />
                    </FormControl>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                    <ButtonGroup variant="plain" size="small">
                      <Button
                        leading={<Icon>{templateSortOrder === "asc" ? <LfSort19 /> : <LfSort91 />}</Icon>}
                        onClick={() => setTemplateSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                      >
                        利用数
                      </Button>
                    </ButtonGroup>
                    {renderViewSwitch(templateViewMode, setTemplateViewMode)}
                  </div>
                </div>

                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  {templateViewMode === "graph" ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        layout="vertical"
                        data={filteredTemplateUsageData}
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis type="number" />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={100}
                          tick={(props) => <CustomYAxisTick {...props} targetTabIndex={1} />}
                        />
                        <Tooltip />
                        <Legend />
                        {contractCategories
                          .filter(
                            (category) => selectedCategories.length === 0 || selectedCategories.includes(category),
                          )
                          .map((category) => (
                            <Bar
                              key={category}
                              dataKey={category}
                              stackId="a"
                              fill={categoryColors[category]}
                              name={category}
                              onClick={() => {
                                const departmentName = filteredTemplateUsageData.find(
                                  (d) => (d[category] as number) > 0,
                                )?.name;
                                if (departmentName) {
                                  handleDepartmentClick(departmentName, 1, category);
                                }
                              }}
                            >
                              <LabelList dataKey={category} content={<CustomLabel />} />
                            </Bar>
                          ))}
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <DataTable columns={templateUsageColumns} rows={filteredTemplateUsageData} />
                  )}
                </div>
              </CardBody>
            </Card>
            <Card variant="outline">
              <CardHeader>
                <ContentHeader.Title>部署別の契約書審査内訳</ContentHeader.Title>
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
                  <SegmentedControl
                    size="small"
                    index={breakdownViewMode === "count" ? 0 : 1}
                    onChange={(index) => {
                      setBreakdownViewMode(index === 0 ? "count" : "percentage");
                    }}
                  >
                    <SegmentedControl.Button>件数</SegmentedControl.Button>
                    <SegmentedControl.Button>割合</SegmentedControl.Button>
                  </SegmentedControl>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                    {renderViewSwitch(breakdownDisplayMode, setBreakdownDisplayMode)}
                  </div>
                </div>

                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  {breakdownDisplayMode === "graph" ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={contractReviewBreakdownData}
                        layout="vertical"
                        stackOffset={breakdownViewMode === "percentage" ? "expand" : "none"}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          type="number"
                          tickFormatter={breakdownViewMode === "percentage" ? (v) => `${v * 100}%` : undefined}
                        />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip
                          formatter={
                            breakdownViewMode === "percentage"
                              ? (value: unknown, _: unknown, entry: { payload?: { total: number } }) => {
                                  const numValue = typeof value === "number" ? value : undefined;
                                  if (numValue == null) return "";
                                  const total = entry.payload?.total;
                                  if (total && total > 0) {
                                    const percentage = ((numValue / total) * 100).toFixed(1);
                                    return `${percentage}% (${numValue}件)`;
                                  }
                                  return `${numValue}件`;
                                }
                              : (value: unknown) => {
                                  const numValue = typeof value === "number" ? value : undefined;
                                  return numValue != null ? `${numValue}件` : "";
                                }
                          }
                        />
                        <Legend />
                        {contractCategories.map((category) => (
                          <Bar
                            key={category}
                            dataKey={category}
                            stackId="a"
                            fill={categoryColors[category]}
                            name={category}
                            onClick={(data) => {
                              if (data.name) {
                                handleDepartmentClick(data.name, 0, "契約書審査");
                              }
                            }}
                          >
                            <LabelList
                              dataKey={category}
                              content={(props: LabelProps) => (
                                <CustomLabel {...props} isPercentage={breakdownViewMode === "percentage"} />
                              )}
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
                          name: "部署名",
                          getValue: (row: Record<string, number | string>) => row.name as string,
                        },
                        {
                          id: "total",
                          name: "総件数",
                          getValue: (row: Record<string, number | string>) => row.total as number,
                        },
                        ...contractCategories.map((cat) => ({
                          id: cat,
                          name: cat,
                          getValue: (row: Record<string, number | string>) => row[cat] as number,
                        })),
                      ]}
                      rows={contractReviewBreakdownData as Record<string, number | string>[]}
                    />
                  )}
                </div>
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
              <IconButton aria-label="閉じる" onClick={handlePaneClose}>
                <Icon>
                  <LfCloseLarge />
                </Icon>
              </IconButton>
            }
          >
            <ContentHeader.Title>{selectedDepartment ? `${selectedDepartment} の詳細` : "詳細"}</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          {selectedDepartment && (
            <Tab.Group size="small" defaultIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
              <Tab.List>
                <Tab>案件リスト</Tab>
                <Tab>ひな形利用詳細</Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div style={{ padding: "var(--aegis-space-medium) 0" }}>
                    <FormControl id="pane-case-type-filter">
                      <FormControl.Label>案件タイプ</FormControl.Label>
                      <Select
                        size="small"
                        options={caseTypeOptions}
                        value={paneCaseTypeFilter}
                        onChange={(value) => {
                          if (value) {
                            setPaneCaseTypeFilter(value as CaseType | "all");
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                  <DataTable columns={caseListColumns} rows={slicedCaseList} />
                  {filteredCaseList.length > 20 && (
                    <div style={{ marginTop: "var(--aegis-space-medium)", textAlign: "center" }}>
                      <a href="/case">
                        <Text variant="body.medium.bold">さらに表示（案件一覧ページへ）</Text>
                      </a>
                    </div>
                  )}
                </Tab.Panel>
                <Tab.Panel>
                  <div style={{ padding: "var(--aegis-space-medium) 0" }}>
                    <FormControl id="pane-category-filter">
                      <FormControl.Label>契約類型</FormControl.Label>
                      <Select
                        size="small"
                        options={[
                          { value: "all", label: "すべて" },
                          ...contractCategories.map((c) => ({ value: c, label: c })),
                        ]}
                        value={paneCategoryFilter}
                        onChange={(value) => {
                          if (value) {
                            setPaneCategoryFilter(value);
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                  <DataTable columns={templateDetailColumns} rows={filteredTemplateDetail} />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          )}
        </PageLayoutBody>
      </PageLayoutPane>
    </>
  );
}
