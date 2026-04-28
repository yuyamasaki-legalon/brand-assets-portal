import { LfEllipsisDotVertical } from "@legalforce/aegis-icons";
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

export type MinuteKind = "商談" | "社内" | "その他";

export interface MinuteItem {
  id: string;
  title: string;
  createdAt: string;
  creator: string;
  kind: MinuteKind;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const kindColorMap: Record<MinuteKind, "blue" | "teal" | "neutral"> = {
  商談: "blue",
  社内: "teal",
  その他: "neutral",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatDateTime = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}年${m}月${d}日 ${hh}:${mm}`;
};

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const minuteItems: MinuteItem[] = [
  {
    id: "1",
    title: "三峰商事株式会社様 DealOn活用方針レビュー",
    createdAt: "2026-01-10T11:30:00",
    creator: "田中 真央",
    kind: "商談",
    updatedAt: "2026-01-10T17:30:00",
  },
];

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

export const minuteColumns: DataTableColumnDef<MinuteItem, string>[] = [
  {
    id: "title",
    name: "議事録タイトル",
    pinnable: false,
    getValue: (row): string => row.title,
    renderCell: ({ value }) => (
      <DataTableCell>
        <DataTableLink href="#">{value}</DataTableLink>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "createdAt",
    name: "作成日時",
    pinnable: false,
    getValue: (row): string => row.createdAt,
    renderCell: ({ row }) => <DataTableCell>{formatDateTime(row.createdAt)}</DataTableCell>,
    sortable: true,
  },
  {
    id: "creator",
    name: "作成者",
    pinnable: false,
    getValue: (row): string => row.creator,
    sortable: true,
  },
  {
    id: "kind",
    name: "種別",
    pinnable: false,
    getValue: (row): string => row.kind,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel variant="fill" color={kindColorMap[row.kind]}>
          {row.kind}
        </StatusLabel>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "updatedAt",
    name: "最終更新日時",
    pinnable: false,
    getValue: (row): string => row.updatedAt,
    renderCell: ({ row }) => <DataTableCell>{formatDateTime(row.updatedAt)}</DataTableCell>,
    sortable: true,
  },
  {
    id: "actions",
    name: "",
    pinnable: false,
    getValue: (): string => "",
    renderCell: () => (
      <DataTableCell>
        <div className={styles.actions}>
          <Tooltip title="その他の操作">
            <IconButton variant="plain" size="xSmall" aria-label="その他の操作">
              <Icon>
                <LfEllipsisDotVertical />
              </Icon>
            </IconButton>
          </Tooltip>
        </div>
      </DataTableCell>
    ),
  },
];
