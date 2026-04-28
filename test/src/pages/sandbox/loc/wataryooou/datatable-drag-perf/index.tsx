import { LfEllipsisDotVertical } from "@legalforce/aegis-icons";
import {
  ContentHeader,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DataTableLink,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  SegmentedControl,
  StatusLabel,
  Text,
  Toolbar,
  Tooltip,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";

// =============================================================================
// Types
// =============================================================================

type CaseRow = {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  caseType: string;
  priority: string;
  mainAssignee: string;
  requester: string;
  department: string;
  counterparty: string;
  amount: number;
  dueDate: string;
  createdAt: string;
};

// =============================================================================
// Constants
// =============================================================================

const ROW_COUNTS = [10, 50, 100, 200, 300] as const;

const statusOptions = ["未着手", "進行中", "レビュー中", "承認済", "完了"] as const;
const statusColorMap: Record<string, "neutral" | "blue" | "yellow" | "teal" | "gray"> = {
  未着手: "neutral",
  進行中: "blue",
  レビュー中: "yellow",
  承認済: "teal",
  完了: "gray",
};

const caseTypeOptions = ["契約審査", "法律相談", "訴訟対応", "M&A", "コンプライアンス"] as const;
const caseTypeColorMap: Record<string, "neutral" | "blue" | "yellow" | "teal" | "red"> = {
  契約審査: "blue",
  法律相談: "teal",
  訴訟対応: "red",
  "M&A": "yellow",
  コンプライアンス: "neutral",
};

const priorityOptions = ["高", "中", "低"] as const;
const priorityColorMap: Record<string, "red" | "yellow" | "gray"> = {
  高: "red",
  中: "yellow",
  低: "gray",
};

const assigneePool = [
  "田中太郎",
  "佐藤花子",
  "鈴木一郎",
  "高橋美咲",
  "渡辺健",
  "伊藤裕子",
  "山本大輔",
  "中村あかり",
  "小林誠",
  "加藤由美",
];

const requesterPool = [
  "山田次郎",
  "松本恵",
  "井上修",
  "木村真理",
  "林大介",
  "清水愛",
  "森田拓也",
  "阿部直美",
  "池田翔",
  "橋本麻衣",
];

const departmentPool = [
  "営業部",
  "経営企画部",
  "人事部",
  "財務部",
  "開発部",
  "マーケティング部",
  "事業開発部",
  "総務部",
];

const counterpartyPool = [
  "株式会社グローバルテクノロジー",
  "合同会社ネクストイノベーション",
  "株式会社サンライズコーポレーション",
  "有限会社フューチャーデザイン",
  "株式会社パシフィックトレード",
  "合同会社デジタルソリューションズ",
  "株式会社アルファコンサルティング",
  "株式会社ブリッジパートナーズ",
  "合同会社クリエイティブワークス",
  "株式会社ユニバーサルシステム",
];

// =============================================================================
// Mock Data Generator
// =============================================================================

function generateMockData(count: number): CaseRow[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = i + 1;
    const baseDate = new Date(2025, 0, 1);
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + ((idx * 7) % 365));
    const createdDate = new Date(baseDate);
    createdDate.setDate(createdDate.getDate() - ((idx * 3) % 180));

    return {
      id: `case-${idx}`,
      caseNumber: `LOC-${String(2024000 + idx).padStart(7, "0")}`,
      title: `${counterpartyPool[idx % counterpartyPool.length]}との${caseTypeOptions[idx % caseTypeOptions.length]}案件 #${idx}`,
      status: statusOptions[idx % statusOptions.length],
      caseType: caseTypeOptions[idx % caseTypeOptions.length],
      priority: priorityOptions[idx % priorityOptions.length],
      mainAssignee: assigneePool[idx % assigneePool.length],
      requester: requesterPool[idx % requesterPool.length],
      department: departmentPool[idx % departmentPool.length],
      counterparty: counterpartyPool[idx % counterpartyPool.length],
      amount: ((idx * 1234567) % 99000000) + 1000000,
      dueDate: dueDate.toLocaleDateString("ja-JP"),
      createdAt: createdDate.toLocaleDateString("ja-JP"),
    };
  });
}

// =============================================================================
// Column Definitions
// =============================================================================

const columns: DataTableColumnDef<CaseRow, string>[] = [
  {
    id: "caseNumber",
    name: "案件番号",
    getValue: (row): string => row.caseNumber,
    sortable: true,
  },
  {
    id: "title",
    name: "案件名",
    getValue: (row): string => row.title,
    renderCell: ({ value }) => (
      <DataTableCell>
        <DataTableLink href="#" />
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "status",
    name: "ステータス",
    getValue: (row): string => row.status,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel variant="fill" size="small" color={statusColorMap[row.status]}>
          {row.status}
        </StatusLabel>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "caseType",
    name: "案件種別",
    getValue: (row): string => row.caseType,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel size="small" color={caseTypeColorMap[row.caseType]}>
          {row.caseType}
        </StatusLabel>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "priority",
    name: "優先度",
    getValue: (row): string => row.priority,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel variant="fill" size="small" color={priorityColorMap[row.priority]}>
          {row.priority}
        </StatusLabel>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "mainAssignee",
    name: "主担当者",
    getValue: (row): string => row.mainAssignee,
    sortable: true,
  },
  {
    id: "requester",
    name: "依頼者",
    getValue: (row): string => row.requester,
    sortable: true,
  },
  {
    id: "department",
    name: "依頼部署",
    getValue: (row): string => row.department,
    sortable: true,
  },
  {
    id: "counterparty",
    name: "相手方",
    getValue: (row): string => row.counterparty,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "amount",
    name: "契約金額",
    getValue: (row): string => row.amount.toString(),
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text>{`¥${row.amount.toLocaleString("ja-JP")}`}</Text>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "dueDate",
    name: "期限",
    getValue: (row): string => row.dueDate,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Text color="subtle">{value}</Text>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "createdAt",
    name: "作成日時",
    getValue: (row): string => row.createdAt,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Text color="subtle">{value}</Text>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "actions",
    name: "",
    getValue: (): string => "",
    pinnable: false,
    renderCell: () => (
      <DataTableCell>
        <Menu>
          <MenuTrigger>
            <Tooltip title="操作">
              <IconButton aria-label="操作" variant="plain" size="small">
                <Icon>
                  <LfEllipsisDotVertical />
                </Icon>
              </IconButton>
            </Tooltip>
          </MenuTrigger>
          <MenuContent side="bottom" align="end">
            <MenuItem>案件詳細を表示</MenuItem>
            <MenuItem>担当者を変更</MenuItem>
            <MenuSeparator />
            <MenuItem color="danger">案件を削除</MenuItem>
          </MenuContent>
        </Menu>
      </DataTableCell>
    ),
    sortable: false,
  },
];

// =============================================================================
// Component
// =============================================================================

export function DataTableDragPerf() {
  const [rowCountIndex, setRowCountIndex] = useState(1); // default 50
  const rowCount = ROW_COUNTS[rowCountIndex];

  const data = useMemo(() => generateMockData(rowCount), [rowCount]);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable カラムドラッグ 性能テスト</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Toolbar>
            <Text variant="label.medium">行数:</Text>
            <SegmentedControl index={rowCountIndex} onChange={setRowCountIndex} size="small">
              {ROW_COUNTS.map((count) => (
                <SegmentedControl.Button key={count}>{count}</SegmentedControl.Button>
              ))}
            </SegmentedControl>
            <Text variant="body.small" color="subtle">
              {data.length} 行 x {columns.length} 列 表示中
            </Text>
          </Toolbar>
          <DataTable
            columns={columns}
            rows={data}
            getRowId={(row) => row.id}
            stickyHeader
            rowSelectionType="multiple"
            defaultColumnPinning={{ end: ["actions"] }}
            defaultSorting={[{ id: "createdAt", desc: true }]}
          />
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
