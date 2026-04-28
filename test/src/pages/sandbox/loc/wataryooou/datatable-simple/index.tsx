import { LfEarth, LfFile } from "@legalforce/aegis-icons";
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
} from "@legalforce/aegis-react";

type RowData = {
  id: string;
  language: string;
  customItem: string;
  caseNumber: string;
};

const mockRows: RowData[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  language: "日本語",
  customItem: "東京本社",
  caseNumber: "7890",
}));

const columns: DataTableColumnDef<RowData, string>[] = [
  {
    id: "language",
    name: "言語",
    getValue: (row): string => row.language,
    renderCell: ({ value }) => <DataTableCell leading={<Icon source={LfEarth} />}>{value}</DataTableCell>,
  },
  {
    id: "customItem",
    name: "契約カスタム項目",
    getValue: (row): string => row.customItem,
  },
  {
    id: "caseNumber",
    name: "案件番号",
    getValue: (row): string => row.caseNumber,
  },
  {
    id: "icon",
    name: null,
    width: "fit",
    renderCell: () => (
      <DataTableCell>
        <IconButton aria-label="ファイル">
          <Icon>
            <LfFile />
          </Icon>
        </IconButton>
      </DataTableCell>
    ),
    sortable: false,
    pinnable: false,
    hideable: false,
    resizable: false,
    reorderable: false,
  },
];

export function DataTableSimple() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable シンプル一覧</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <DataTable columns={columns} rows={mockRows} getRowId={(row) => row.id} highlightRowOnHover={false} />
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
