import {
  LfArchive,
  LfChart,
  LfCheckBook,
  LfDownload,
  LfEllipsisDot,
  LfFileLines,
  LfFileSigned,
  LfFilesLine,
  LfHome,
  LfMagnifyingGlass,
  LfWriting,
} from "@legalforce/aegis-icons";
import type { DataTableColumnDef, SelectOption } from "@legalforce/aegis-react";
import {
  CardHeader as AegisCardHeader,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Checkbox,
  ContentHeader,
  DataTable,
  FormControl,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  RangeDateField,
  Select,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarProvider,
  SidebarTrigger,
  Tab,
  TagPicker,
  Text,
  Toolbar,
  ToolbarSpacer,
} from "@legalforce/aegis-react";
import { type ComponentProps, useMemo, useState } from "react";
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  assigneeContractTypeData,
  assigneeStatusData,
  caseBreakdownData,
  caseStatuses,
  caseStatusOrder,
  categoricalPalette,
  contractParetoData,
  contractTypeColors,
  contractVersionData,
  departmentColors,
  departmentStatusData,
  eSignatureStatusData,
  leadTimeByDepartmentData,
  leadTimeDistributionData,
  type MatrixRow,
  matrixData,
  myTasksData,
  slaStatus,
  type Task,
  templateUsageData,
  trendData,
} from "./data";
import styles from "./styles.module.css";

// Type-safe wrapper for Aegis CardHeader to resolve React 19 type conflict
const CardHeader = (props: ComponentProps<typeof AegisCardHeader>) => {
  return <AegisCardHeader {...props} />;
};

// --- Helper Components & Functions ---

// ドーナツグラフの中央に合計値を表示するカスタムラベル
const DonutCentralLabel = ({ value }: { value?: number }) => {
  return (
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-2xl font-bold fill-[var(--aegis-color-font-default)]"
    >
      {value}
    </text>
  );
};

// --- Dashboard Components ---

const RADIAN = Math.PI / 180;
interface CustomizedLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  name?: string;
  value?: number;
}
const renderCustomizedLabel = (props: CustomizedLabelProps) => {
  const { cx = 0, cy = 0, midAngle = 0, outerRadius = 0, name, value } = props;
  const radius = outerRadius * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="var(--aegis-color-font-default)"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name}: ${value}件`}
    </text>
  );
};

// A. 担当案件一覧 (My Tasks)
const MyTasksTable = () => {
  const allAssignees = useMemo(() => Array.from(new Set(myTasksData.map((task) => task.assignee))), []);
  const [selectedAssignee, setSelectedAssignee] = useState(allAssignees[0] || "");

  type EnrichedTask = Task & {
    elapsedDays: number;
    status: string;
    statusColor: string;
  };

  const enrichedTasks = useMemo((): EnrichedTask[] => {
    const today = new Date("2025-12-01"); // Assuming today is 2025-12-01 for consistent demo
    return myTasksData
      .filter((task) => task.assignee === selectedAssignee)
      .map((task) => {
        const receivedDate = new Date(task.receivedDate);
        const elapsedDays = Math.floor((today.getTime() - receivedDate.getTime()) / (1000 * 60 * 60 * 24));

        let statusInfo = slaStatus.normal;
        if (elapsedDays >= 6) {
          statusInfo = slaStatus.over;
        } else if (elapsedDays === 5) {
          statusInfo = slaStatus.today;
        } else if (elapsedDays >= 3) {
          statusInfo = slaStatus.near;
        }

        return {
          ...task,
          elapsedDays,
          status: statusInfo.label,
          statusColor: statusInfo.color,
        };
      })
      .sort((a, b) => b.elapsedDays - a.elapsedDays);
  }, [selectedAssignee]);

  const columns: DataTableColumnDef<EnrichedTask, string | number>[] = [
    {
      id: "status",
      name: "ステータス",
      getValue: (row): string => row.status,
      renderCell: ({ row }) => (
        <span
          style={{
            backgroundColor: row.statusColor,
            padding: "var(--aegis-space-xSmall) var(--aegis-space-small)",
            borderRadius: "var(--aegis-border-radius-medium)",
          }}
        >
          {row.status}
        </span>
      ),
    },
    { id: "name", name: "案件名", getValue: (row): string => row.name },
    { id: "client", name: "依頼元", getValue: (row): string => row.client },
    { id: "type", name: "契約類型", getValue: (row): string => row.type },
    { id: "receivedDate", name: "受付日", getValue: (row): string => row.receivedDate },
    { id: "dueDate", name: "対応期限", getValue: (row): string => row.dueDate },
    {
      id: "elapsedDays",
      name: "経過日数",
      getValue: (row): number => row.elapsedDays,
      renderCell: ({ value }) => `${value as number}日`,
    },
  ];

  return (
    <Card variant="outline" style={{ justifyContent: "flex-start" }}>
      <CardHeader
        trailing={
          <Select
            size="small"
            value={selectedAssignee}
            onChange={(value) => {
              if (value) {
                setSelectedAssignee(value);
              }
            }}
            options={allAssignees.map((name) => ({ label: name, value: name }))}
          />
        }
      >
        <Text variant="body.large.bold">担当案件一覧</Text>
      </CardHeader>
      <CardBody>
        <DataTable<EnrichedTask> columns={columns} rows={enrichedTasks} />
      </CardBody>
    </Card>
  );
};

// B. 案件状況マトリクス
const CaseMatrixTable = () => {
  const [view, setView] = useState<"stagnation" | "dueDate">("stagnation");

  const { data, columns } = useMemo(() => {
    switch (view) {
      case "dueDate":
        return {
          data: matrixData.dueDate,
          columns: [
            { id: "name", name: "担当者", getValue: (row) => row.name },
            { id: "納期超過", name: "納期超過", getValue: (row) => String(row.納期超過) },
            {
              id: "今日-3日後",
              name: "今日-3日後",
              getValue: (row) => String(row["今日-3日後"]),
            },
            { id: "4-7日後", name: "4-7日後", getValue: (row) => String(row["4-7日後"]) },
            { id: "8-14日後", name: "8-14日後", getValue: (row) => String(row["8-14日後"]) },
            { id: "total", name: "合計", getValue: (row) => row.total },
          ] as DataTableColumnDef<(typeof matrixData.dueDate)[number]>[],
        };
      default:
        return {
          data: matrixData.stagnation,
          columns: [
            { id: "name", name: "担当者", getValue: (row) => row.name },
            { id: "0-3日", name: "0-3日", getValue: (row) => String(row["0-3日"]) },
            { id: "4-7日", name: "4-7日", getValue: (row) => String(row["4-7日"]) },
            { id: "8-14日後", name: "8-14日後", getValue: (row) => String(row["8-14日後"]) },
            { id: "15日以上", name: "15日以上", getValue: (row) => String(row["15日以上"]) },
            { id: "total", name: "合計", getValue: (row) => row.total },
          ] as DataTableColumnDef<(typeof matrixData.stagnation)[number]>[],
        };
    }
  }, [view]);

  return (
    <Card variant="outline" style={{ justifyContent: "flex-start" }}>
      <CardHeader
        trailing={
          <IconButton aria-label="メニュー" size="small">
            <Icon>
              <LfEllipsisDot />
            </Icon>
          </IconButton>
        }
      >
        <Text variant="body.large.bold">現在の案件状況</Text>
      </CardHeader>
      <CardBody>
        <div style={{ marginBottom: "var(--aegis-space-large)" }}>
          <ButtonGroup>
            <Button
              size="small"
              variant={view === "stagnation" ? "solid" : "subtle"}
              onClick={() => setView("stagnation")}
            >
              滞留状況 (経過日数)
            </Button>
            <Button size="small" variant={view === "dueDate" ? "solid" : "subtle"} onClick={() => setView("dueDate")}>
              納期状況
            </Button>
          </ButtonGroup>
        </div>
        {/* biome-ignore lint/suspicious/noExplicitAny: DataTable's column type inference is too complex for now */}
        <DataTable<MatrixRow> columns={columns as any} rows={data} />
      </CardBody>
    </Card>
  );
};

// C. 現在の案件数 (担当者別・部署別)
const AssigneeLoadChart = () => {
  const [view, setView] = useState<"assignee" | "department">("assignee");
  const [role, setRole] = useState<"all" | "main" | "sub">("all");
  const data = view === "assignee" ? assigneeStatusData : departmentStatusData;
  const total = useMemo(
    () =>
      data.reduce(
        (acc, cur) => {
          caseStatusOrder.forEach((status) => {
            const count = cur[status as keyof typeof cur];
            if (typeof count === "number") {
              acc[status] = (acc[status] || 0) + count;
            }
          });
          return acc;
        },
        {} as { [key: string]: number },
      ),
    [data],
  );

  const CustomizedYAxisTick = (props: { x?: number; y?: number; payload?: { value: string } }) => {
    const { x, y, payload } = props;
    const record = data.find((d) => d.name === payload?.value);
    const stagnationCount =
      view === "assignee" && record ? (record as (typeof assigneeStatusData)[number]).stagnation : 0;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={0} textAnchor="end" fill="var(--aegis-color-font-default)">
          {payload?.value}
        </text>
        {stagnationCount > 0 && (
          <g transform="translate(10, -12)">
            <rect x={0} y={0} width={36} height={18} rx={4} fill="var(--aegis-color-bg-danger-subtle)" />
            <text x={18} y={13} textAnchor="middle" fill="var(--aegis-color-font-danger)" fontSize="12px">
              ⚠️ {stagnationCount}
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <Card variant="outline" style={{ justifyContent: "flex-start" }}>
      <CardHeader
        trailing={
          <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
            {view === "assignee" && (
              <Select
                size="small"
                value={role}
                onChange={(value) => {
                  if (value) {
                    setRole(value as "all" | "main" | "sub");
                  }
                }}
                options={[
                  { label: "全体", value: "all" },
                  { label: "主担当", value: "main" },
                  { label: "副担当", value: "sub" },
                ]}
              />
            )}
            <RangeDateField />
            <IconButton aria-label="メニュー" size="small">
              <Icon>
                <LfEllipsisDot />
              </Icon>
            </IconButton>
          </div>
        }
      >
        <Text variant="body.large.bold">現在の案件数</Text>
      </CardHeader>
      <CardBody>
        <div style={{ marginBottom: "var(--aegis-space-large)" }}>
          <ButtonGroup>
            <Button size="small" variant={view === "assignee" ? "solid" : "subtle"} onClick={() => setView("assignee")}>
              担当者別
            </Button>
            <Button
              size="small"
              variant={view === "department" ? "solid" : "subtle"}
              onClick={() => setView("department")}
            >
              部署別
            </Button>
          </ButtonGroup>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={<CustomizedYAxisTick />}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Legend />
            {caseStatusOrder.map((status) => (
              <Bar key={status} dataKey={status} stackId="a" fill={caseStatuses[status as keyof typeof caseStatuses]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <div
          style={{
            marginTop: "var(--aegis-space-large)",
            padding: "var(--aegis-space-small)",
            backgroundColor: "var(--aegis-color-bg-subtle)",
            borderRadius: "var(--aegis-border-radius-medium)",
          }}
        >
          <Text variant="body.medium.bold">合計</Text>
          <div style={{ display: "flex", gap: "var(--aegis-space-medium)", marginTop: "var(--aegis-space-xSmall)" }}>
            {caseStatusOrder.map((status) => (
              <div key={status} style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: caseStatuses[status as keyof typeof caseStatuses],
                  }}
                />
                <Text variant="body.small">
                  {status}: {total[status]}件
                </Text>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// D. 案件内訳
const CaseBreakdownChart = ({
  filters,
}: {
  filters: {
    selectedDepartments: SelectOption[];
  };
}) => {
  const [view, setView] = useState<"contractType" | "department" | "caseType">("contractType");

  const { chartData, totalValue } = useMemo(() => {
    let sourceData = caseBreakdownData[view] || [];

    // Apply department filter only for the department view
    const departmentNames = filters.selectedDepartments.map((d) => d.value);
    if (view === "department" && departmentNames.length > 0) {
      sourceData = sourceData.filter((item) => departmentNames.includes(item.name));
    }

    const sortedData = [...sourceData].sort((a, b) => b.value - a.value);
    const top5 = sortedData.slice(0, 5);
    const othersValue = sortedData.slice(5).reduce((sum, item) => sum + item.value, 0);
    const result = [...top5];
    if (othersValue > 0) {
      result.push({ name: "その他", value: othersValue });
    }
    const total = result.reduce((sum, item) => sum + item.value, 0);
    return { chartData: result, totalValue: total };
  }, [view, filters.selectedDepartments]);

  return (
    <Card variant="outline" style={{ justifyContent: "flex-start" }}>
      <CardHeader
        trailing={
          <IconButton aria-label="メニュー" size="small">
            <Icon>
              <LfEllipsisDot />
            </Icon>
          </IconButton>
        }
      >
        <Text variant="body.large.bold">案件内訳</Text>
      </CardHeader>
      <CardBody>
        <div style={{ marginBottom: "var(--aegis-space-large)" }}>
          <ButtonGroup>
            <Button
              size="small"
              variant={view === "contractType" ? "solid" : "subtle"}
              onClick={() => setView("contractType")}
            >
              契約類型
            </Button>
            <Button
              size="small"
              variant={view === "department" ? "solid" : "subtle"}
              onClick={() => setView("department")}
            >
              依頼部署
            </Button>
            <Button size="small" variant={view === "caseType" ? "solid" : "subtle"} onClick={() => setView("caseType")}>
              案件種別
            </Button>
          </ButtonGroup>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart margin={{ top: 30, right: 30, bottom: 0, left: 30 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              labelLine
              label={renderCustomizedLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={categoricalPalette[index % categoricalPalette.length]} />
              ))}
              <Label content={<DonutCentralLabel value={totalValue} />} position="center" />
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

// E. 案件推移 & リードタイム
const TrendChart = ({
  filters,
}: {
  filters: {
    selectedPeriod?: string;
    selectedAssignees: SelectOption[];
    selectedDepartments: SelectOption[];
  };
}) => {
  const [showLastYear, setShowLastYear] = useState(false);

  const filteredData = useMemo(() => {
    const departmentNames = filters.selectedDepartments.map((d) => d.value);
    if (departmentNames.length === 0) {
      return trendData;
    }

    // 選択された部署のデータのみを保持し、他の部署のデータは0にする
    return trendData.map((monthData) => {
      const newMonthData = { ...monthData };

      Object.keys(departmentColors).forEach((dept) => {
        if (!departmentNames.includes(dept)) {
          // @ts-expect-error
          newMonthData[dept] = 0; // 選択外の部署は0に
        }
      });
      return newMonthData;
    });
  }, [filters.selectedDepartments]);

  return (
    <Card variant="outline" style={{ justifyContent: "flex-start" }}>
      <CardHeader
        trailing={
          <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
            <Checkbox checked={showLastYear} onChange={(event) => setShowLastYear(event.currentTarget.checked)}>
              昨年度と比較
            </Checkbox>
            <ButtonGroup>
              <IconButton aria-label="メニュー" size="small">
                <Icon>
                  <LfEllipsisDot />
                </Icon>
              </IconButton>
            </ButtonGroup>
          </div>
        }
      >
        <Text variant="body.large.bold">案件推移 & リードタイム</Text>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={filteredData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="var(--aegis-color-font-subtle)" />
            <YAxis yAxisId="left" orientation="left" stroke="var(--aegis-color-font-subtle)" />
            <YAxis yAxisId="right" orientation="right" unit="日" stroke="var(--aegis-color-font-subtle)" />
            <Tooltip />
            <Legend />
            {Object.keys(departmentColors).map((dept) => (
              <Bar
                key={dept}
                yAxisId="left"
                dataKey={dept}
                stackId="a"
                fill={departmentColors[dept as keyof typeof departmentColors]}
                barSize={20}
              />
            ))}
            <Line yAxisId="right" type="monotone" dataKey="平均リードタイム" stroke="#9e470e" strokeWidth={2} />
            {showLastYear && (
              <Bar yAxisId="left" dataKey="lastYearCount" name="昨年度案件数" fill="#acacac" barSize={20} />
            )}
            {showLastYear && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="lastYearAvgLeadTime"
                name="昨年度平均リードタイム"
                stroke="#f0c4ab"
                strokeDasharray="5 5"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

// F. 契約類型別 交渉回数（バージョン数）
const ContractVersionChart = ({ filters: _filters }: { filters: unknown }) => {
  const data = contractVersionData;
  return (
    <Card variant="outline" style={{ justifyContent: "flex-start" }}>
      <CardHeader
        trailing={
          <ButtonGroup>
            <IconButton aria-label="ダウンロード" size="small">
              <Icon>
                <LfDownload />
              </Icon>
            </IconButton>
            <IconButton aria-label="メニュー" size="small">
              <Icon>
                <LfEllipsisDot />
              </Icon>
            </IconButton>
          </ButtonGroup>
        }
      >
        <Text variant="body.large.bold">契約類型別 交渉回数</Text>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="type" type="category" width={150} />
            <Tooltip
              formatter={(value, name, props) => {
                if (name === "平均バージョン数") {
                  const { payload } = props;
                  return [`${value} (最大: ${payload.maxVersions})`, "平均バージョン数"];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="avgVersions" name="平均バージョン数">
              <LabelList
                dataKey="avgVersions"
                position="insideRight"
                style={{ fill: "white" }}
                formatter={(value: unknown) => (typeof value === "number" ? value.toFixed(1) : "")}
              />
              {data.map((_entry, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Static data for chart, index is stable
                <Cell key={`cell-${index}`} fill={categoricalPalette[index % categoricalPalette.length]} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

// G. 契約類型別契約件数
const ContractParetoChart = ({ filters: _filters }: { filters: unknown }) => {
  const data = contractParetoData;
  return (
    <Card variant="outline" style={{ justifyContent: "flex-start" }}>
      <CardHeader
        trailing={
          <ButtonGroup>
            <IconButton aria-label="ダウンロード" size="small">
              <Icon>
                <LfDownload />
              </Icon>
            </IconButton>
            <IconButton aria-label="メニュー" size="small">
              <Icon>
                <LfEllipsisDot />
              </Icon>
            </IconButton>
          </ButtonGroup>
        }
      >
        <Text variant="body.large.bold">契約類型別契約件数</Text>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="type" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="count" name="契約件数">
              <LabelList
                dataKey="count"
                position="insideRight"
                style={{ fill: "white" }}
                formatter={(value: unknown) => (typeof value === "number" ? value : "")}
              />
              {data.map((_entry, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Static data for chart, index is stable
                <Cell key={`cell-${index}`} fill={categoricalPalette[index % categoricalPalette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

// H. リードタイム分析 (担当者別・依頼部署別)
type LeadTimeData = (typeof leadTimeDistributionData)[number] | (typeof leadTimeByDepartmentData)[number];
const LeadTimeAnalysis = ({
  filters,
}: {
  filters: {
    selectedPeriod?: string;
    selectedAssignees: SelectOption[];
    selectedDepartments: SelectOption[];
  };
}) => {
  const [analysisDimension, setAnalysisDimension] = useState<"assignee" | "department">("assignee");

  const { data, columns, xAxisKey } = useMemo(() => {
    const filterData = (sourceData: LeadTimeData[]) => {
      let filtered = [...sourceData];
      const assigneeNames = filters.selectedAssignees.map((a) => a.value);
      if (analysisDimension === "assignee" && assigneeNames.length > 0) {
        filtered = filtered.filter((row) =>
          assigneeNames.includes((row as (typeof leadTimeDistributionData)[number]).name),
        );
      }

      const departmentNames = filters.selectedDepartments.map((d) => d.value);
      if (analysisDimension === "department" && departmentNames.length > 0) {
        filtered = filtered.filter((row) =>
          departmentNames.includes((row as (typeof leadTimeByDepartmentData)[number]).departmentName),
        );
      }

      return filtered;
    };
    switch (analysisDimension) {
      case "department":
        return {
          data: filterData(leadTimeByDepartmentData),
          xAxisKey: "departmentName",
          columns: [
            {
              id: "departmentName",
              name: "依頼部署",
              getValue: (row) => (row as (typeof leadTimeByDepartmentData)[number]).departmentName,
            },
            {
              id: "completedCases",
              name: "完了案件数",
              getValue: (row) => `${row.completedCases}件`,
            },
            { id: "avgLeadTime", name: "平均リードタイム", getValue: (row) => `${row.avgLeadTime}日` },
            {
              id: "medianLeadTime",
              name: "リードタイム中央値",
              getValue: (row) => `${row.medianLeadTime}日`,
            },
            { id: "minLeadTime", name: "最小", getValue: (row) => `${row.minLeadTime}日` },
            { id: "maxLeadTime", name: "最大", getValue: (row) => `${row.maxLeadTime}日` },
            { id: "iqr", name: "ばらつき(IQR)", getValue: (row) => `${row.iqr}日` },
          ] as DataTableColumnDef<LeadTimeData>[],
        };
      default:
        return {
          data: filterData(leadTimeDistributionData),
          xAxisKey: "name",
          columns: [
            { id: "name", name: "担当者", getValue: (row) => (row as (typeof leadTimeDistributionData)[number]).name },
            {
              id: "completedCases",
              name: "完了案件数",
              getValue: (row) => `${row.completedCases}件`,
            },
            { id: "avgLeadTime", name: "平均リードタイム", getValue: (row) => `${row.avgLeadTime}日` },
            {
              id: "medianLeadTime",
              name: "リードタイム中央値",
              getValue: (row) => `${row.medianLeadTime}日`,
            },
            { id: "minLeadTime", name: "最小", getValue: (row) => `${row.minLeadTime}日` },
            { id: "maxLeadTime", name: "最大", getValue: (row) => `${row.maxLeadTime}日` },
            { id: "iqr", name: "ばらつき(IQR)", getValue: (row) => `${row.iqr}日` },
          ] as DataTableColumnDef<LeadTimeData>[],
        };
    }
  }, [analysisDimension, filters.selectedAssignees, filters.selectedDepartments]);

  const analysisTitle = useMemo(() => {
    return analysisDimension === "assignee" ? "担当者別 リードタイム分析" : "依頼部署別 リードタイム分析";
  }, [analysisDimension]);

  return (
    <Card variant="outline" style={{ justifyContent: "flex-start" }}>
      <CardHeader
        trailing={
          <IconButton aria-label="メニュー" size="small">
            <Icon>
              <LfEllipsisDot />
            </Icon>
          </IconButton>
        }
      >
        <Text variant="body.large.bold">{analysisTitle}</Text>
      </CardHeader>
      <CardBody>
        <div style={{ marginBottom: "var(--aegis-space-large)" }}>
          <ButtonGroup>
            <Button
              size="small"
              variant={analysisDimension === "assignee" ? "solid" : "subtle"}
              onClick={() => setAnalysisDimension("assignee")}
            >
              担当者別
            </Button>
            <Button
              size="small"
              variant={analysisDimension === "department" ? "solid" : "subtle"}
              onClick={() => setAnalysisDimension("department")}
            >
              依頼部署別
            </Button>
          </ButtonGroup>
        </div>
        <Tab.Group>
          <Tab.List>
            <Tab>グラフ表示</Tab>
            <Tab>テーブル表示</Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xAxisKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgLeadTime" name="平均リードタイム" fill="#8188ca" />
                  <Bar dataKey="medianLeadTime" name="リードタイム中央値" fill="#76baa3" />
                </BarChart>
              </ResponsiveContainer>
            </Tab.Panel>
            <Tab.Panel>
              {/* biome-ignore lint/suspicious/noExplicitAny: DataTable's column type inference is too complex for now */}
              <DataTable<LeadTimeData> columns={columns as any} rows={data} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </CardBody>
    </Card>
  );
};

// I. 契約類型別 ひな形利用率
const TemplateUsageChart = ({ filters: _filters }: { filters: unknown }) => {
  const data = templateUsageData;

  return (
    <Card variant="outline" style={{ justifyContent: "flex-start" }}>
      <CardHeader
        trailing={
          <ButtonGroup>
            <IconButton aria-label="メニュー" size="small">
              <Icon>
                <LfEllipsisDot />
              </Icon>
            </IconButton>
          </ButtonGroup>
        }
      >
        <Text variant="body.large.bold">契約類型別 ひな形利用率</Text>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical" stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(tick) => `${tick * 100}%`} />
            <YAxis type="category" dataKey="type" width={150} />
            <Tooltip
              formatter={(value: unknown, name: unknown) => {
                const numValue = typeof value === "number" ? value : undefined;
                const strName = typeof name === "string" ? name : undefined;
                return numValue != null && strName != null
                  ? [`${(numValue * 100).toFixed(1)}%`, strName]
                  : ["", strName ?? ""];
              }}
            />
            <Legend />
            <Bar dataKey="self" name="自社ひな形" stackId="a" fill="#0367a8">
              <LabelList
                dataKey="self"
                position="center"
                style={{ fill: "white" }}
                formatter={(value: unknown) => (typeof value === "number" ? `${value}件` : "")}
              />
            </Bar>
            <Bar dataKey="other" name="その他" stackId="a" fill="#cdcdcd">
              <LabelList
                dataKey="other"
                position="center"
                style={{ fill: "#191919" }}
                formatter={(value: unknown) => (typeof value === "number" ? `${value}件` : "")}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

// J. 担当者ごとの対応契約類型数
const AssigneeContractTypeChart = ({
  filters,
}: {
  filters: {
    selectedAssignees: SelectOption[];
  };
}) => {
  const contractTypes = Object.keys(contractTypeColors);

  const filteredData = useMemo(() => {
    const assigneeNames = filters.selectedAssignees.map((a) => a.value);
    if (assigneeNames.length === 0) {
      return assigneeContractTypeData;
    }
    return assigneeContractTypeData.filter((row) => assigneeNames.includes(row.name));
  }, [filters.selectedAssignees]);

  return (
    <Card variant="outline" style={{ justifyContent: "flex-start" }}>
      <CardHeader>
        <Text variant="body.large.bold">担当者ごとの対応契約類型数</Text>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={filteredData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={120} />
            <Tooltip />
            <Legend />
            {contractTypes.map((type) => (
              <Bar
                key={type}
                dataKey={type}
                stackId="a"
                fill={contractTypeColors[type as keyof typeof contractTypeColors]}
              >
                <LabelList dataKey={type} position="center" style={{ fill: "white" }} />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

// I. 電子契約 署名待ち状況
const ESignatureStatusChart = ({ width = "half" }: { width?: "full" | "half" }) => {
  const totalValue = useMemo(() => eSignatureStatusData.reduce((sum, item) => sum + item.value, 0), []);
  const cardClassName = width === "full" ? styles.cardFullWidth : "";

  return (
    <Card variant="outline" className={cardClassName} style={{ justifyContent: "flex-start" }}>
      <CardHeader
        trailing={
          <IconButton aria-label="メニュー" size="small">
            <Icon>
              <LfEllipsisDot />
            </Icon>
          </IconButton>
        }
      >
        <Text variant="body.large.bold">電子契約 署名待ち状況</Text>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart margin={{ top: 30, right: 30, bottom: 0, left: 30 }}>
            <Pie
              data={eSignatureStatusData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              labelLine
              label={renderCustomizedLabel}
            >
              {eSignatureStatusData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
              <Label content={<DonutCentralLabel value={totalValue} />} position="center" />
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("6m");
  const [selectedAssignees, setSelectedAssignees] = useState<SelectOption[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<SelectOption[]>([]);

  const assigneeOptions = useMemo(() => assigneeStatusData.map((a) => ({ label: a.name, value: a.name })), []);
  const departmentOptions = useMemo(() => departmentStatusData.map((d) => ({ label: d.name, value: d.name })), []);

  const filters = useMemo(
    () => ({
      selectedPeriod,
      selectedAssignees,
      selectedDepartments,
    }),
    [selectedPeriod, selectedAssignees, selectedDepartments],
  );

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarBody>
          <SidebarNavigation>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfHome />
                  </Icon>
                }
              >
                ホーム
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfMagnifyingGlass />
                  </Icon>
                }
              >
                検索
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfMagnifyingGlass />
                  </Icon>
                }
              >
                アシスタント
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfArchive />
                  </Icon>
                }
              >
                案件
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfFileLines />
                  </Icon>
                }
              >
                契約書
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfWriting />
                  </Icon>
                }
              >
                電子契約
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfFileSigned />
                  </Icon>
                }
              >
                締結済契約書
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfFilesLine />
                  </Icon>
                }
              >
                ひな形
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfCheckBook />
                  </Icon>
                }
              >
                契約審査基準
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                aria-current="page"
                leading={
                  <Icon>
                    <LfChart />
                  </Icon>
                }
              >
                分析
              </SidebarNavigationLink>
            </SidebarNavigationItem>
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>
        <PageLayout>
          <PageLayoutContent>
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeader.Title>分析ダッシュボード</ContentHeader.Title>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              <Tab.Group style={{ paddingBottom: "var(--aegis-space-xSmall)" }}>
                <Tab.List>
                  <Tab>モニタリング</Tab>
                  <Tab>分析・改善</Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <div className={styles.container}>
                      <section className={styles.section}>
                        <Text variant="body.xxLarge.bold">個人タスク (My Tasks)</Text>
                        <MyTasksTable />
                      </section>

                      <section className={styles.section}>
                        <Text variant="body.xxLarge.bold">チームの状況 (Team Status)</Text>
                        <div className={styles.cardGrid}>
                          <AssigneeLoadChart />
                          <CaseMatrixTable />
                          <ESignatureStatusChart width="half" />
                        </div>
                      </section>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <PageLayoutStickyContainer>
                      <Toolbar>
                        <ToolbarSpacer />
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--aegis-space-xSmall)",
                            padding: "var(--aegis-space-xxSmall) 0",
                            flexWrap: "wrap",
                          }}
                        >
                          <FormControl orientation="horizontal">
                            <FormControl.Label width="auto">対象期間</FormControl.Label>
                            <Select
                              size="small"
                              value={selectedPeriod}
                              onChange={(value) => {
                                if (value) {
                                  setSelectedPeriod(value);
                                }
                              }}
                              options={[
                                { label: "過去3ヶ月", value: "3m" },
                                { label: "過去6ヶ月", value: "6m" },
                                { label: "過去12ヶ月", value: "12m" },
                              ]}
                            />
                          </FormControl>
                          <FormControl orientation="horizontal">
                            <FormControl.Label width="auto">担当者</FormControl.Label>
                            <TagPicker
                              size="small"
                              placeholder="担当者を選択"
                              options={assigneeOptions}
                              value={selectedAssignees.map((opt) => opt.value)}
                              onChange={(values) => {
                                const newSelection = assigneeOptions.filter((opt) => values.includes(opt.value));
                                setSelectedAssignees(newSelection);
                              }}
                            />
                          </FormControl>
                          <FormControl orientation="horizontal">
                            <FormControl.Label width="auto">依頼部署</FormControl.Label>
                            <TagPicker
                              size="small"
                              placeholder="依頼部署を選択"
                              options={departmentOptions}
                              value={selectedDepartments.map((opt) => opt.value)}
                              onChange={(values) => {
                                const newSelection = departmentOptions.filter((opt) => values.includes(opt.value));
                                setSelectedDepartments(newSelection);
                              }}
                            />
                          </FormControl>
                        </div>
                      </Toolbar>
                    </PageLayoutStickyContainer>

                    <section className={styles.section}>
                      <Text variant="body.xxLarge.bold">傾向とパフォーマンス (Trends & Performance)</Text>
                      <TrendChart filters={filters} />
                      <LeadTimeAnalysis filters={filters} />
                      <AssigneeContractTypeChart filters={filters} />
                    </section>

                    <section className={styles.section}>
                      <Text variant="body.xxLarge.bold">業務改善・戦略 (Strategy & Improvement)</Text>
                      <div className={styles.cardGrid}>
                        <ContractVersionChart filters={filters} />
                        <ContractParetoChart filters={filters} />
                      </div>
                      <div className={styles.cardGrid}>
                        <TemplateUsageChart filters={filters} />
                        <CaseBreakdownChart filters={filters} />
                      </div>
                    </section>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}
