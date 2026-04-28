import { LfCloseLarge, LfPen } from "@legalforce/aegis-icons";
import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableLink,
  Icon,
  IconButton,
  StatusLabel,
  Tooltip,
} from "@legalforce/aegis-react";
import styles from "./index.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type JobStatus = "実行待ち" | "実行中" | "完了" | "失敗" | "キャンセル";

export interface JobItem {
  id: string;
  content: string;
  status: JobStatus;
  scheduledAt: string;
  jobType: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const statusColorMap: Record<JobStatus, "blue" | "teal" | "neutral" | "red"> = {
  実行待ち: "blue",
  実行中: "teal",
  完了: "neutral",
  失敗: "red",
  キャンセル: "neutral",
};

// ---------------------------------------------------------------------------
// Filter options
// ---------------------------------------------------------------------------

export const jobFilterOptions = [
  { label: "全て", count: 2 },
  { label: "実行待ち", count: 1 },
  { label: "実行中", count: 0 },
  { label: "完了", count: 1 },
  { label: "失敗", count: 0 },
  { label: "キャンセル", count: 0 },
];

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const jobItems: JobItem[] = [
  {
    id: "1",
    content: "定例ミーティングリマインド送信",
    status: "実行待ち",
    scheduledAt: "2026-01-16 22:00",
    jobType: "ミーティングリマインド",
  },
  {
    id: "2",
    content: "フォローアップタスク作成",
    status: "完了",
    scheduledAt: "2026-01-10 12:05",
    jobType: "タスク作成",
  },
];

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

export const jobColumns: DataTableColumnDef<JobItem, string>[] = [
  {
    id: "content",
    name: "内容",
    pinnable: false,
    getValue: (row): string => row.content,
    renderCell: ({ value }) => (
      <DataTableCell>
        <DataTableLink href="#">{value}</DataTableLink>
      </DataTableCell>
    ),
  },
  {
    id: "status",
    name: "ステータス",
    pinnable: false,
    getValue: (row): string => row.status,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel variant="fill" color={statusColorMap[row.status]}>
          {row.status}
        </StatusLabel>
      </DataTableCell>
    ),
  },
  {
    id: "scheduledAt",
    name: "実行予定",
    pinnable: false,
    getValue: (row): string => row.scheduledAt,
    sortable: true,
  },
  {
    id: "jobType",
    name: "ジョブ種別",
    pinnable: false,
    getValue: (row): string => row.jobType,
  },
  {
    id: "actions",
    name: "",
    pinnable: false,
    getValue: (): string => "",
    renderCell: ({ row }) =>
      row.status === "実行待ち" ? (
        <DataTableCell>
          <div className={styles.actions}>
            <Tooltip title="編集">
              <IconButton variant="plain" size="xSmall" aria-label="編集">
                <Icon>
                  <LfPen />
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="キャンセル">
              <IconButton variant="plain" size="xSmall" aria-label="キャンセル">
                <Icon>
                  <LfCloseLarge />
                </Icon>
              </IconButton>
            </Tooltip>
          </div>
        </DataTableCell>
      ) : (
        <DataTableCell />
      ),
  },
];
