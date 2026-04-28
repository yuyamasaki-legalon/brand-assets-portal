import { LfChartBar, LfCloseLarge, LfFilter, LfTable } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Button,
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
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  RangeDatePicker,
  SegmentedControl,
  Tab,
  Text,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { caseData } from "./data";

const calculateMedian = (values: number[]) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

type ContractTypeRow = {
  name: string;
  monthlyCaseCount: number;
  medianVersionChangeCount: number;
};

type TemplateUsageRow = (typeof templateUsageData)[number];

const contractDetailsData = [
  { id: 1, contractType: "秘密保持契約", fileName: "株式会社A様_NDA_20231120_v12.docx", versionChangeCount: 12 },
  { id: 2, contractType: "秘密保持契約", fileName: "Project-Alpha-NDA-final-v8.docx", versionChangeCount: 8 },
  { id: 3, contractType: "秘密保持契約", fileName: "NDA-B社様-締結版-v7.docx", versionChangeCount: 7 },
  { id: 4, contractType: "秘密保持契約", fileName: "C-Holdings-NDA_v5.docx", versionChangeCount: 5 },
  { id: 5, contractType: "秘密保持契約", fileName: "D社様とのNDA-202310_v4.docx", versionChangeCount: 4 },
  { id: 6, contractType: "秘密保持契約", fileName: "E社様NDA_v2.docx", versionChangeCount: 2 },
  { id: 10, contractType: "業務委託契約", fileName: "委託契約書-Z社様-v25.docx", versionChangeCount: 25 },
  { id: 11, contractType: "業務委託契約", fileName: "コンサルティング契約（Y社）v18.docx", versionChangeCount: 18 },
  { id: 12, contractType: "業務委託契約", fileName: "基本契約-X社_v15.docx", versionChangeCount: 15 },
  { id: 13, contractType: "業務委託契約", fileName: "（W社）業務委託契約書案_v11.docx", versionChangeCount: 11 },
  { id: 14, contractType: "業務委託契約", fileName: "Vサービス業務委託契約_v9.docx", versionChangeCount: 9 },
  { id: 15, contractType: "業務委託契約", fileName: "U社個別契約_v3.docx", versionChangeCount: 3 },
  { id: 20, contractType: "売買契約", fileName: "T社売買契約書v8.docx", versionChangeCount: 8 },
  { id: 21, contractType: "売買契約", fileName: "物品売買（S社）_v7.docx", versionChangeCount: 7 },
  { id: 22, contractType: "売買契約", fileName: "R社との契約_v5.docx", versionChangeCount: 5 },
  { id: 23, contractType: "売買契約", fileName: "動産売買契約書案_v3.docx", versionChangeCount: 3 },
  { id: 24, contractType: "売買契約", fileName: "Q社様_v2.docx", versionChangeCount: 2 },
  { id: 30, contractType: "ライセンス契約", fileName: "SaaS利用規約_P社_v15.docx", versionChangeCount: 15 },
  {
    id: 31,
    contractType: "ライセンス契約",
    fileName: "O社ソフトウェアライセンス契約_v11.docx",
    versionChangeCount: 11,
  },
  { id: 32, contractType: "ライセンス契約", fileName: "N社API連携契約_v9.docx", versionChangeCount: 9 },
  { id: 33, contractType: "ライセンス契約", fileName: "M社向け使用許諾契約書_v6.docx", versionChangeCount: 6 },
  { id: 34, contractType: "ライセンス契約", fileName: "L社ライセンス_v4.docx", versionChangeCount: 4 },
];
type ContractDetailRow = (typeof contractDetailsData)[number];

const templateDetailsData = [
  {
    name: "NDA_standard_v3",
    contractType: "秘密保持契約",
    usageCount: 80,
    medianVersionChangeCount: 1.5,
  },
  {
    name: "NDA_simple_v1.2",
    contractType: "秘密保持契約",
    usageCount: 30,
    medianVersionChangeCount: 3.0,
  },
  {
    name: "NDA_M&A_v2",
    contractType: "秘密保持契約",
    usageCount: 10,
    medianVersionChangeCount: 9.0,
  },
  {
    name: "SOW_standard_v2",
    contractType: "業務委託契約",
    usageCount: 70,
    medianVersionChangeCount: 3.0,
  },
  {
    name: "SOW_short_v1",
    contractType: "業務委託契約",
    usageCount: 40,
    medianVersionChangeCount: 4.0,
  },
];

type TemplateDetailRow = (typeof templateDetailsData)[number];

// Add date to data for filtering
const templateUsageData = [
  { name: "秘密保持契約", self: 114, other: 6, total: 120, usageRate: 95, date: "2023-11-15" },
  { name: "業務委託契約", self: 64, other: 16, total: 80, usageRate: 80, date: "2023-11-20" },
  { name: "売買契約", self: 51, other: 9, total: 60, usageRate: 85, date: "2023-12-01" },
  { name: "ライセンス契約", self: 24, other: 16, total: 40, usageRate: 60, date: "2023-12-05" },
  { name: "共同開発契約", self: 8, other: 12, total: 20, usageRate: 40, date: "2023-12-10" },
  { name: "M&A関連契約", self: 1, other: 4, total: 5, usageRate: 20, date: "2023-12-15" },
  { name: "コンサルティング・アドバイザリー契約", self: 22, other: 8, total: 30, usageRate: 73, date: "2023-12-20" },
];

export default function Workstreams() {
  const [paneOpen, setPaneOpen] = useState(false);
  const [selectedContractType, setSelectedContractType] = useState<string | null>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Case Count State
  const [workstreamViewMode, setWorkstreamViewMode] = useState<"graph" | "table">("graph");

  // Template Analysis State
  const [templateAnalysisViewMode, setTemplateAnalysisViewMode] = useState<"graph" | "table">("graph");
  const [templateAnalysisMode, setTemplateAnalysisMode] = useState<"byType" | "byTemplate">("byType");

  // Other Stats State
  const [eContractViewMode, setEContractViewMode] = useState<"graph" | "table">("graph");
  const [storageViewMode, setStorageViewMode] = useState<"graph" | "table">("graph");

  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

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

  const filteredCases = useMemo(() => {
    if (!dateRange.start || !dateRange.end) {
      return caseData;
    }
    const { start, end } = dateRange;
    return caseData.filter((item) => {
      const itemDate = new Date(item.startDate);
      return itemDate >= start && itemDate <= end;
    });
  }, [dateRange]);

  const contractTypeData = useMemo(() => {
    const dataByContractType = filteredCases.reduce<Record<string, { totalCases: number; versionChanges: number[] }>>(
      (acc, item) => {
        if (item.contractCategory) {
          if (!acc[item.contractCategory]) {
            acc[item.contractCategory] = { totalCases: 0, versionChanges: [] };
          }
          acc[item.contractCategory].totalCases += 1;
          // This is a placeholder for version change count.
          // In a real scenario, this data would be part of the case item.
          acc[item.contractCategory].versionChanges.push(Math.floor(Math.random() * 10) + 1);
        }
        return acc;
      },
      {},
    );

    return Object.entries(dataByContractType).map(([name, data]) => ({
      name,
      monthlyCaseCount: data.totalCases,
      medianVersionChangeCount: parseFloat(calculateMedian(data.versionChanges).toFixed(1)),
    }));
  }, [filteredCases]);

  const filteredTemplateUsageData = useMemo(() => {
    if (!dateRange.start || !dateRange.end) {
      return templateUsageData;
    }
    return templateUsageData.filter((item) => {
      const itemDate = new Date(item.date);
      if (dateRange.start && dateRange.end) {
        const { start, end } = dateRange;
        return itemDate >= start && itemDate <= end;
      }
      return true;
    });
  }, [dateRange]);

  const eContractStatusData = useMemo(() => {
    const statusCounts = filteredCases.reduce<Record<string, number>>((acc, item) => {
      if (item.eContractStatus) {
        acc[item.eContractStatus] = (acc[item.eContractStatus] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [filteredCases]);

  const storageStatusData = useMemo(() => {
    const statusCounts = filteredCases.reduce<Record<string, number>>((acc, item) => {
      if (item.storageStatus) {
        acc[item.storageStatus] = (acc[item.storageStatus] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [filteredCases]);

  const top5Contracts = useMemo(() => {
    if (!selectedContractType) {
      return [];
    }
    return contractDetailsData
      .filter((contract) => contract.contractType === selectedContractType)
      .sort((a, b) => b.versionChangeCount - a.versionChangeCount)
      .slice(0, 5);
  }, [selectedContractType]);

  const selectedTemplateUsageSummary = useMemo(() => {
    if (!selectedContractType) return null;
    return templateUsageData.find((d) => d.name === selectedContractType);
  }, [selectedContractType]);

  const templatesForSelectedType = useMemo(() => {
    if (!selectedContractType) return [];
    return templateDetailsData.filter((d) => d.contractType === selectedContractType);
  }, [selectedContractType]);

  const contractDetailColumns: DataTableColumnDef<ContractDetailRow, string | number>[] = [
    {
      id: "fileName",
      name: "ファイル名",
      getValue: (row) => row.fileName,
    },
    {
      id: "versionChangeCount",
      name: "バージョン変更回数",
      getValue: (row) => row.versionChangeCount,
      renderCell: (info) => <DataTableCell>{`${info.value}回`}</DataTableCell>,
    },
  ];

  const templateDetailColumns: DataTableColumnDef<TemplateDetailRow, string | number>[] = [
    {
      id: "name",
      name: "ひな形名",
      getValue: (row) => row.name,
    },
    {
      id: "contractType",
      name: "契約類型",
      getValue: (row) => row.contractType,
    },
    {
      id: "usageCount",
      name: "利用件数",
      getValue: (row) => row.usageCount,
      renderCell: (info) => <DataTableCell>{`${info.value}件`}</DataTableCell>,
    },
    {
      id: "medianVersionChangeCount",
      name: "バージョン変更回数(中央値)",
      getValue: (row) => row.medianVersionChangeCount,
      renderCell: (info) => <DataTableCell>{`${info.value}回`}</DataTableCell>,
    },
  ];

  const templateUsageColumns: DataTableColumnDef<TemplateUsageRow, string | number>[] = [
    {
      id: "name",
      name: "契約類型名",
      getValue: (row) => row.name,
    },
    {
      id: "actions",
      name: "",
      renderCell: (info) => (
        <DataTableCell>
          <Button
            size="small"
            variant="subtle"
            onClick={() => {
              if (info.row.name) {
                setSelectedTabIndex(1);
                setSelectedContractType(info.row.name);
                setPaneOpen(true);
              }
            }}
          >
            開く
          </Button>
        </DataTableCell>
      ),
    },
    {
      id: "selfUsage",
      name: "自社ひな形件数",
      getValue: (row) => row.self,
      renderCell: (info) => <DataTableCell>{`${info.value}件`}</DataTableCell>,
    },
    {
      id: "totalCases",
      name: "合計件数",
      getValue: (row) => row.total,
      renderCell: (info) => <DataTableCell>{`${info.value}件`}</DataTableCell>,
    },
    {
      id: "usageRate",
      name: "ひな形利用率 (%)",
      getValue: (row) => row.usageRate,
      renderCell: (info) => <DataTableCell>{`${info.value}%`}</DataTableCell>,
    },
  ];

  const CustomYAxisTick = (props: { x?: number | string; y?: number | string; payload?: { value: string } }) => {
    const { x, y, payload } = props;
    const [isHovered, setIsHovered] = useState(false);

    if (x === undefined || y === undefined || !payload?.value) {
      return null;
    }

    const handleTickClick = () => {
      setSelectedContractType(payload.value);
      setSelectedTabIndex(0);
      setPaneOpen(true);
    };

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-150} y={-10} width={140} height={24}>
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

  const contractTypeColumns: DataTableColumnDef<ContractTypeRow, string | number>[] = [
    {
      id: "name",
      name: "契約類型名",
      getValue: (row) => row.name,
    },
    {
      id: "actions",
      name: "",
      renderCell: (info) => (
        <DataTableCell>
          <Button
            size="small"
            variant="subtle"
            onClick={() => {
              if (info.row.name) {
                setSelectedTabIndex(0);
                setSelectedContractType(info.row.name);
                setPaneOpen(true);
              }
            }}
          >
            開く
          </Button>
        </DataTableCell>
      ),
    },
    {
      id: "monthlyCaseCount",
      name: "総件数",
      getValue: (row) => row.monthlyCaseCount,
      renderCell: (info) => <DataTableCell>{`${info.value}件`}</DataTableCell>,
    },
    {
      id: "medianVersionChangeCount",
      name: "バージョン変更回数(中央値)",
      getValue: (row) => row.medianVersionChangeCount,
      renderCell: (info) => <DataTableCell>{`${info.value}回`}</DataTableCell>,
    },
  ];

  const CustomBarLabel = (props: {
    x?: string | number;
    y?: string | number;
    width?: string | number;
    height?: string | number;
    value?: string | number | boolean | null;
    index?: number;
    fill?: string;
  }) => {
    const { x, y, width, height, value, index, fill } = props;

    if (x == null || y == null || width == null || height == null || value == null || index == null) {
      return null;
    }

    const numX = Number(x);
    const numY = Number(y);
    const numWidth = Number(width);
    const numHeight = Number(height);
    const numValue = Number(value);

    if (numValue <= 0) {
      return null;
    }

    const entry = filteredTemplateUsageData[index];
    if (!entry) return null; // Defensive check
    const percentage = entry.total > 0 ? Math.round((numValue / entry.total) * 100) : 0;
    const labelText = `${numValue}件 (${percentage}%)`;

    // Prevent label from overflowing small bars
    if (numWidth < 50) return null;

    return (
      <text x={numX + numWidth / 2} y={numY + numHeight / 2} fill={fill} textAnchor="middle" dominantBaseline="middle">
        {labelText}
      </text>
    );
  };

  const eContractStatusColors: Record<string, string> = {
    未署名: "#a0aec0",
    署名中: "#ed8636",
    署名済み: "#4299e1",
  };

  const storageStatusColors: Record<string, string> = {
    未保管: "#ed8636",
    保管済み: "#4299e1",
  };

  return (
    <>
      <PageLayoutContent minWidth="medium">
        <PageLayoutHeader>
          <ContentHeader
            trailing={
              <Button
                leading={
                  <Icon>
                    <LfFilter />
                  </Icon>
                }
                size="medium"
                onClick={() => setPaneOpen(!paneOpen)}
              >
                開く
              </Button>
            }
          >
            <ContentHeader.Title>契約書</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--aegis-space-large)",
            }}
          >
            <Card variant="outline" style={{ flex: "1 0 100%" }}>
              <CardHeader>
                <ContentHeader.Title>契約書の件数とバージョン変更回数</ContentHeader.Title>
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
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--aegis-space-small)" }}>
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
                        }}
                      >
                        リセット
                      </Button>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                    {renderViewSwitch(workstreamViewMode, setWorkstreamViewMode)}
                  </div>
                </div>

                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  {workstreamViewMode === "table" ? (
                    <DataTable columns={contractTypeColumns} rows={contractTypeData} />
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart
                        layout="vertical"
                        data={contractTypeData}
                        margin={{
                          top: 20,
                          right: 30,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis
                          type="number"
                          xAxisId="bar"
                          label={{ value: "総件数 (件)", position: "bottom", offset: 0 }}
                        />
                        <XAxis
                          type="number"
                          xAxisId="scatter"
                          orientation="top"
                          label={{ value: "バージョン変更回数(中央値) (回)", position: "top", offset: 0 }}
                        />
                        <YAxis dataKey="name" type="category" width={150} tick={CustomYAxisTick} />
                        <Tooltip />
                        <Legend verticalAlign="bottom" wrapperStyle={{ bottom: -20 }} />
                        <Bar
                          dataKey="monthlyCaseCount"
                          xAxisId="bar"
                          barSize={30}
                          fill="#413ea0"
                          name="総件数"
                          onClick={(data) => {
                            setSelectedTabIndex(0);
                            setSelectedContractType(data?.name ?? null);
                            setPaneOpen(true);
                          }}
                        >
                          <LabelList
                            dataKey="monthlyCaseCount"
                            position="right"
                            formatter={(value: unknown) => (typeof value === "number" && value > 0 ? value : "")}
                          />
                        </Bar>
                        <Scatter
                          dataKey="medianVersionChangeCount"
                          xAxisId="scatter"
                          fill="#ff7300"
                          name="バージョン変更回数(中央値)"
                          onClick={(data) => {
                            setSelectedTabIndex(0);
                            setSelectedContractType(data?.name ?? null);
                            setPaneOpen(true);
                          }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardBody>
            </Card>
            <Card variant="outline" style={{ flex: "1 0 100%" }}>
              <CardHeader>
                <ContentHeader.Title>契約類型別のひな形利用率</ContentHeader.Title>
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
                    index={templateAnalysisMode === "byType" ? 0 : 1}
                    onChange={(index) => {
                      setTemplateAnalysisMode(index === 0 ? "byType" : "byTemplate");
                    }}
                  >
                    <SegmentedControl.Button>類型別</SegmentedControl.Button>
                    <SegmentedControl.Button>ひな形別</SegmentedControl.Button>
                  </SegmentedControl>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                    {renderViewSwitch(templateAnalysisViewMode, setTemplateAnalysisViewMode)}
                  </div>
                </div>

                <div style={{ marginTop: "var(--aegis-space-large)" }}>
                  {templateAnalysisMode === "byType" ? (
                    templateAnalysisViewMode === "graph" ? (
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          layout="vertical"
                          data={filteredTemplateUsageData}
                          margin={{
                            top: 20,
                            right: 30,
                            bottom: 20,
                            left: 150,
                          }}
                        >
                          <CartesianGrid stroke="#f5f5f5" />
                          <XAxis type="number" unit="件" />
                          <YAxis dataKey="name" type="category" tick={CustomYAxisTick} />
                          <Tooltip
                            formatter={(value: unknown) => {
                              const numValue = typeof value === "number" ? value : undefined;
                              return numValue != null ? [`${numValue}件`, undefined] : ["", undefined];
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="self"
                            name="自社ひな形"
                            stackId="a"
                            fill="#0367a8"
                            onClick={(data) => {
                              setSelectedTabIndex(1);
                              setSelectedContractType(data?.name ?? null);
                              setPaneOpen(true);
                            }}
                          >
                            <LabelList dataKey="self" content={(props) => <CustomBarLabel {...props} fill="white" />} />
                          </Bar>
                          <Bar
                            dataKey="other"
                            name="その他"
                            stackId="a"
                            fill="#cdcdcd"
                            onClick={(data) => {
                              setSelectedTabIndex(1);
                              setSelectedContractType(data?.name ?? null);
                              setPaneOpen(true);
                            }}
                          >
                            <LabelList
                              dataKey="other"
                              content={(props) => <CustomBarLabel {...props} fill="#191919" />}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <DataTable columns={templateUsageColumns} rows={filteredTemplateUsageData} />
                    )
                  ) : templateAnalysisViewMode === "graph" ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart
                        layout="vertical"
                        data={templateDetailsData}
                        margin={{
                          top: 20,
                          right: 30,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis type="number" xAxisId="bar" label={{ value: "利用件数 (件)", position: "bottom" }} />
                        <XAxis
                          type="number"
                          xAxisId="scatter"
                          orientation="top"
                          label={{ value: "バージョン変更回数(中央値) (回)", position: "top" }}
                        />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="usageCount" xAxisId="bar" barSize={20} fill="#413ea0" name="利用件数">
                          <LabelList
                            dataKey="usageCount"
                            position="right"
                            formatter={(value: unknown) => (typeof value === "number" && value > 0 ? value : "")}
                          />
                        </Bar>
                        <Scatter
                          dataKey="medianVersionChangeCount"
                          xAxisId="scatter"
                          fill="#ff7300"
                          name="バージョン変更回数(中央値)"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <DataTable columns={templateDetailColumns} rows={templateDetailsData} />
                  )}
                </div>
              </CardBody>
            </Card>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--aegis-space-large)",
                width: "100%",
              }}
            >
              <Card variant="outline">
                <CardHeader>
                  <ContentHeader.Title>電子契約 署名待ち状況</ContentHeader.Title>
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
                    {renderViewSwitch(eContractViewMode, setEContractViewMode)}
                  </div>
                  {eContractViewMode === "graph" ? (
                    <div style={{ marginTop: "var(--aegis-space-large)" }}>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={eContractStatusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                          >
                            {eContractStatusData.map((entry) => (
                              <Cell key={`cell-${entry.name}`} fill={eContractStatusColors[entry.name]} />
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
                            name: "ステータス",
                            getValue: (row: Record<string, number | string>) => row.name as string,
                          },
                          {
                            id: "value",
                            name: "件数",
                            getValue: (row: Record<string, number | string>) => row.value as number,
                          },
                        ]}
                        rows={eContractStatusData as Record<string, number | string>[]}
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
              <Card variant="outline">
                <CardHeader>
                  <ContentHeader.Title>締結済み契約の保管状況</ContentHeader.Title>
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
                    {renderViewSwitch(storageViewMode, setStorageViewMode)}
                  </div>
                  {storageViewMode === "graph" ? (
                    <div style={{ marginTop: "var(--aegis-space-large)" }}>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={storageStatusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                          >
                            {storageStatusData.map((entry) => (
                              <Cell key={`cell-${entry.name}`} fill={storageStatusColors[entry.name]} />
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
                            name: "保管状況",
                            getValue: (row: Record<string, number | string>) => row.name as string,
                          },
                          {
                            id: "value",
                            name: "件数",
                            getValue: (row: Record<string, number | string>) => row.value as number,
                          },
                        ]}
                        rows={storageStatusData as Record<string, number | string>[]}
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/sandbox">← Back to Sandbox</Link>
          </AegisLink>
        </PageLayoutFooter>
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
                  setSelectedContractType(null);
                }}
              >
                <Icon>
                  <LfCloseLarge />
                </Icon>
              </IconButton>
            }
          >
            <ContentHeader.Title>
              {selectedContractType ? `${selectedContractType} の詳細` : "詳細"}
            </ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          {selectedContractType && (
            <Tab.Group size="small" defaultIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
              <Tab.List>
                <Tab>バージョン変更回数 Top5</Tab>
                <Tab>ひな形利用状況</Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <DataTable columns={contractDetailColumns} rows={top5Contracts} />
                </Tab.Panel>
                <Tab.Panel>
                  {selectedTemplateUsageSummary && (
                    <div
                      style={{
                        paddingBottom: "var(--aegis-space-large)",
                        marginBottom: "var(--aegis-space-large)",
                        borderBottom: "1px solid var(--aegis-color-border-default)",
                      }}
                    >
                      <Text variant="title.small" as="p">
                        ひな形利用率
                      </Text>
                      <Text variant="body.medium" as="p">
                        {selectedTemplateUsageSummary.usageRate}%
                      </Text>
                      <Text variant="body.small" color="subtle">
                        (総件数 {selectedTemplateUsageSummary.total}件 / 自社ひな形利用{" "}
                        {selectedTemplateUsageSummary.self}
                        件)
                      </Text>
                    </div>
                  )}
                  <DataTable columns={templateDetailColumns} rows={templatesForSelectedType} />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          )}
        </PageLayoutBody>
      </PageLayoutPane>
    </>
  );
}
