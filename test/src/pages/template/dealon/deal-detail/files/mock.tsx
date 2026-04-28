import { LfDownload } from "@legalforce/aegis-icons";
import {
  DataTableCell,
  type DataTableColumnDef,
  Icon,
  IconButton,
  StatusLabel,
  Tooltip,
} from "@legalforce/aegis-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FileKind = "メール添付ファイル" | "アップロード";

export interface FileItem {
  id: string;
  name: string;
  kind: FileKind;
  size: string;
  registeredAt: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const kindColorMap: Record<FileKind, "blue" | "teal"> = {
  メール添付ファイル: "blue",
  アップロード: "teal",
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
// Filter options
// ---------------------------------------------------------------------------

export const fileKindOptions = [
  { label: "すべての種別", value: "" },
  { label: "メール添付ファイル", value: "メール添付ファイル" },
  { label: "アップロード", value: "アップロード" },
];

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const fileItems: FileItem[] = [
  {
    id: "1",
    name: "DealOn_導入準備チェックリスト.pdf",
    kind: "メール添付ファイル",
    size: "92.8 KB",
    registeredAt: "2026-01-13T14:00:00",
  },
  {
    id: "2",
    name: "DealOn_導入スケジュール案.xlsx",
    kind: "メール添付ファイル",
    size: "46.9 KB",
    registeredAt: "2026-01-13T14:00:00",
  },
  {
    id: "3",
    name: "DealOn_サービス利用契約書（ドラフト）.docx",
    kind: "メール添付ファイル",
    size: "180.7 KB",
    registeredAt: "2026-01-10T09:30:00",
  },
  {
    id: "4",
    name: "DealOn_費用内訳説明資料.pdf",
    kind: "メール添付ファイル",
    size: "1.2 MB",
    registeredAt: "2026-01-09T11:45:00",
  },
  {
    id: "5",
    name: "DealOn_ランニングコスト詳細.xlsx",
    kind: "メール添付ファイル",
    size: "60.5 KB",
    registeredAt: "2026-01-09T11:45:00",
  },
  {
    id: "6",
    name: "DealOn_見積書_202601.xlsx",
    kind: "メール添付ファイル",
    size: "83.0 KB",
    registeredAt: "2026-01-07T10:05:00",
  },
];

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

export const fileColumns: DataTableColumnDef<FileItem, string>[] = [
  {
    id: "name",
    name: "ファイル名",
    pinnable: false,
    getValue: (row): string => row.name,
    sortable: true,
  },
  {
    id: "kind",
    name: "ファイル種別",
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
    id: "size",
    name: "サイズ",
    pinnable: false,
    getValue: (row): string => row.size,
    sortable: true,
  },
  {
    id: "registeredAt",
    name: "登録日時",
    pinnable: false,
    getValue: (row): string => row.registeredAt,
    renderCell: ({ row }) => <DataTableCell>{formatDateTime(row.registeredAt)}</DataTableCell>,
    sortable: true,
  },
  {
    id: "actions",
    name: "",
    pinnable: false,
    getValue: (): string => "",
    renderCell: () => (
      <DataTableCell>
        <Tooltip title="ダウンロード">
          <IconButton variant="plain" size="xSmall" aria-label="ダウンロード">
            <Icon>
              <LfDownload />
            </Icon>
          </IconButton>
        </Tooltip>
      </DataTableCell>
    ),
  },
];
