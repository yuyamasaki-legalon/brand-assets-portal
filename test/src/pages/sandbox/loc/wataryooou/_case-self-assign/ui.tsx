import type { DataTableColumnDef } from "@legalforce/aegis-react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  ContentHeader,
  DataTable,
  DataTableCell,
  EmptyState,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  StatusLabel,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import type { ReactNode } from "react";
import { LocSidebarLayout } from "../../../../template/loc/_shared";
import type { MatterCase } from "./mockData";
import { getAssignableCount, getDueSoonCount, getHighRiskCount, getMyCaseCount } from "./mockData";

type PrototypePageFrameProps = {
  title: string;
  description: string;
  cases: MatterCase[];
  emphasis: ReactNode;
  children: ReactNode;
};

type CaseColumnsOptions = {
  actionLabel?: string;
  onAction?: (caseId: string) => void;
  isActionDisabled?: (caseItem: MatterCase) => boolean;
  showRecommendation?: boolean;
  showWorkload?: boolean;
};

type CaseTableProps = {
  cases: MatterCase[];
  columns: DataTableColumnDef<MatterCase, string | number>[];
  rowSelectionType?: "none" | "multiple";
  selectedRows?: string[];
  onSelectedRowsChange?: (caseIds: string[]) => void;
  canSelectRow?: (caseItem: MatterCase) => boolean;
  highlightedRows?: string[];
};

function MetricCard({ label, value, description }: { label: string; value: number | string; description: string }) {
  return (
    <Card>
      <CardBody>
        <div style={{ display: "grid", gap: "var(--aegis-space-xxSmall)" }}>
          <Text variant="body.small" color="subtle">
            {label}
          </Text>
          <Text variant="body.xxLarge.bold">{value}</Text>
          <Text variant="body.small" color="subtle">
            {description}
          </Text>
        </div>
      </CardBody>
    </Card>
  );
}

export function PrototypePageFrame({ title, description, cases, emphasis, children }: PrototypePageFrameProps) {
  return (
    <LocSidebarLayout activeId="cases">
      <PageLayout>
        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeader.Title>{title}</ContentHeader.Title>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
              <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                <Text as="p" variant="body.medium">
                  {description}
                </Text>
                <Text as="p" variant="body.small" color="subtle">
                  LegalOn の案件一覧の密度を保ちつつ、「自分が担当する」導線だけを変えた比較用プロトタイプです。
                </Text>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "var(--aegis-space-small)",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                }}
              >
                <MetricCard
                  label="担当化できる案件"
                  value={getAssignableCount(cases)}
                  description="自分がまだ担当していない案件"
                />
                <MetricCard label="期限3日以内" value={getDueSoonCount(cases)} description="すぐ着手したい案件" />
                <MetricCard label="自分の担当中" value={getMyCaseCount(cases)} description="担当済み案件" />
                <MetricCard label="高リスク引継ぎ" value={getHighRiskCount(cases)} description="確認を挟みたい案件" />
              </div>

              {emphasis}
              {children}
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
}

export function createCaseColumns({
  actionLabel,
  onAction,
  isActionDisabled,
  showRecommendation = false,
  showWorkload = false,
}: CaseColumnsOptions): DataTableColumnDef<MatterCase, string | number>[] {
  const columns: DataTableColumnDef<MatterCase, string | number>[] = [
    {
      id: "id",
      name: "案件番号",
      getValue: (row) => row.id,
      pinnable: false,
      renderCell: ({ value }) => <DataTableCell>{value}</DataTableCell>,
    },
    {
      id: "title",
      name: "案件名",
      getValue: (row) => row.title,
      pinnable: false,
      renderCell: ({ value }) => (
        <DataTableCell>
          <Tooltip title={String(value)} placement="top-start" onlyOnOverflow>
            <Text numberOfLines={1}>{value}</Text>
          </Tooltip>
        </DataTableCell>
      ),
    },
    {
      id: "requester",
      name: "依頼者",
      getValue: (row) => row.requester,
      pinnable: false,
      renderCell: ({ value }) => (
        <DataTableCell leading={<Avatar size="xSmall" name={String(value)} />}>{value}</DataTableCell>
      ),
    },
    {
      id: "assignee",
      name: "主担当者",
      getValue: (row) => row.currentAssignee ?? "未割当",
      pinnable: false,
      renderCell: ({ row }) => (
        <DataTableCell leading={row.currentAssignee ? <Avatar size="xSmall" name={row.currentAssignee} /> : undefined}>
          <div style={{ display: "grid", gap: "2px" }}>
            <Text variant="body.small">{row.currentAssignee ?? "未割当"}</Text>
            <Text variant="body.xSmall" color="subtle">
              {row.assigneeState === "assigned-to-me"
                ? "自分が担当中"
                : row.assigneeState === "unassigned"
                  ? "担当者なし"
                  : "他メンバーが担当中"}
            </Text>
          </div>
        </DataTableCell>
      ),
    },
    {
      id: "status",
      name: "案件ステータス",
      getValue: (row) => row.status,
      pinnable: false,
      renderCell: ({ row }) => (
        <DataTableCell>
          <StatusLabel>{row.status}</StatusLabel>
        </DataTableCell>
      ),
    },
    {
      id: "dueDate",
      name: "期限",
      getValue: (row) => row.dueDate,
      sortable: true,
      pinnable: false,
    },
    {
      id: "priority",
      name: "優先度",
      getValue: (row) => row.priorityScore,
      sortable: true,
      pinnable: false,
      renderCell: ({ row }) => (
        <DataTableCell>
          <div style={{ display: "grid", gap: "2px" }}>
            <Text variant="body.small">{row.priorityScore}</Text>
            <Text variant="body.xSmall" color="subtle">
              {row.department}
            </Text>
          </div>
        </DataTableCell>
      ),
    },
  ];

  if (showRecommendation) {
    columns.push({
      id: "recommendation",
      name: "担当候補の理由",
      getValue: (row) => row.recommendationReasons[0] ?? "",
      pinnable: false,
      renderCell: ({ row }) => (
        <DataTableCell>
          <div style={{ display: "grid", gap: "2px" }}>
            <Text variant="body.small" numberOfLines={1}>
              {row.recommendationReasons[0]}
            </Text>
            <Text variant="body.xSmall" color="subtle" numberOfLines={1}>
              {row.note}
            </Text>
          </div>
        </DataTableCell>
      ),
    });
  }

  if (showWorkload) {
    columns.push({
      id: "workload",
      name: "想定負荷",
      getValue: (row) => row.estimatedHours,
      pinnable: false,
      renderCell: ({ row }) => (
        <DataTableCell>
          <div style={{ display: "grid", gap: "2px" }}>
            <Text variant="body.small">{row.estimatedHours}h</Text>
            <Text variant="body.xSmall" color="subtle">
              引継ぎリスク: {row.takeoverRisk}
            </Text>
          </div>
        </DataTableCell>
      ),
    });
  }

  if (actionLabel && onAction) {
    columns.push({
      id: "action",
      name: "操作",
      getValue: () => actionLabel,
      pinnable: false,
      renderCell: ({ row }) => (
        <DataTableCell>
          <Button
            size="small"
            variant="subtle"
            onClick={() => onAction(row.id)}
            disabled={isActionDisabled ? isActionDisabled(row) : false}
          >
            {actionLabel}
          </Button>
        </DataTableCell>
      ),
    });
  }

  return columns;
}

export function CaseTable({
  cases,
  columns,
  rowSelectionType = "none",
  selectedRows,
  onSelectedRowsChange,
  canSelectRow,
  highlightedRows,
}: CaseTableProps) {
  if (cases.length === 0) {
    return (
      <Card>
        <CardBody>
          <EmptyState title="該当する案件がありません">検索条件またはフィルターを変更してください。</EmptyState>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <DataTable
          columns={columns}
          rows={cases}
          getRowId={(row) => row.id}
          stickyHeader
          manualSorting
          rowSelectionType={rowSelectionType}
          selectedRows={selectedRows}
          onSelectedRowsChange={onSelectedRowsChange}
          canSelectRow={canSelectRow ? ({ row }) => canSelectRow(row) : undefined}
          highlightedRows={highlightedRows}
          defaultSorting={[{ id: "priority", desc: true }]}
        />
      </CardBody>
    </Card>
  );
}
