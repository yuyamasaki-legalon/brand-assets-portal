import { LfPen, LfTrash } from "@legalforce/aegis-icons";
import {
  ContentHeader,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import styles from "./index.module.css";

type RowData = {
  id: string;
  caseName: string;
  client: string;
  status: string;
  updatedAt: string;
};

const mockRows: RowData[] = [
  { id: "1", caseName: "特許出願 A-001", client: "株式会社アルファ", status: "進行中", updatedAt: "2026-02-20" },
  { id: "2", caseName: "商標登録 B-002", client: "ベータ合同会社", status: "完了", updatedAt: "2026-02-18" },
  { id: "3", caseName: "意匠出願 C-003", client: "ガンマ株式会社", status: "レビュー中", updatedAt: "2026-02-15" },
  { id: "4", caseName: "特許出願 D-004", client: "デルタ工業", status: "進行中", updatedAt: "2026-02-10" },
  { id: "5", caseName: "商標登録 E-005", client: "イプシロン商事", status: "下書き", updatedAt: "2026-02-05" },
];

const columns: DataTableColumnDef<RowData, string>[] = [
  {
    id: "caseName",
    name: "案件名",
    getValue: (row): string => row.caseName,
    pinnable: false,
  },
  {
    id: "client",
    name: "クライアント",
    getValue: (row): string => row.client,
    pinnable: false,
  },
  {
    id: "status",
    name: "ステータス",
    getValue: (row): string => row.status,
    pinnable: false,
  },
  {
    id: "updatedAt",
    name: "更新日",
    getValue: (row): string => row.updatedAt,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Text variant="body.small" color="subtle">
          {value}
        </Text>
      </DataTableCell>
    ),
    pinnable: false,
  },
  {
    id: "actions",
    name: null,
    width: "fit",
    getValue: (): string => "",
    renderCell: () => (
      <DataTableCell>
        <div className={styles.actionButtons}>
          <IconButton variant="plain" size="xSmall" aria-label="編集">
            <Icon>
              <LfPen />
            </Icon>
          </IconButton>
          <IconButton variant="plain" size="xSmall" aria-label="削除">
            <Icon>
              <LfTrash />
            </Icon>
          </IconButton>
        </div>
      </DataTableCell>
    ),
    sortable: false,
    pinnable: false,
    hideable: false,
    resizable: false,
    reorderable: false,
  },
];

export function DataTableIconButton() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable IconButton</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <DataTable
            columns={columns}
            rows={mockRows}
            getRowId={(row) => row.id}
            defaultColumnPinning={{ end: ["actions"] }}
            highlightRowOnHover={false}
          />
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
