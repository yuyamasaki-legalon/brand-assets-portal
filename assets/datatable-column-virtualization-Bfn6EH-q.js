var e=`import {
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DataTableHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const columnKeys = [
  "contract",
  "owner",
  "status",
  "counterparty",
  "risk",
  "amount",
  "renewal",
  "jurisdiction",
  "language",
  "department",
  "phase",
  "updatedAt",
] as const;

type ColumnKey = (typeof columnKeys)[number];
type ContractRow = { id: string } & Record<ColumnKey, string>;

const rows: ContractRow[] = Array.from({ length: 12 }, (_, index) => {
  const sequence = index + 1;
  return {
    id: \`contract-\${sequence}\`,
    contract: \`業務委託契約 \${sequence}\`,
    owner: ["佐藤", "鈴木", "高橋"][index % 3] ?? "佐藤",
    status: ["レビュー中", "承認待ち", "締結済み"][index % 3] ?? "レビュー中",
    counterparty: \`株式会社サンプル \${sequence}\`,
    risk: ["Low", "Medium", "High"][index % 3] ?? "Low",
    amount: \`\${(sequence * 120).toLocaleString()}万円\`,
    renewal: \`2026/\${String((index % 12) + 1).padStart(2, "0")}/15\`,
    jurisdiction: ["日本法", "カリフォルニア州法", "シンガポール法"][index % 3] ?? "日本法",
    language: ["日本語", "英語", "日英併記"][index % 3] ?? "日本語",
    department: ["Legal", "Sales", "Product"][index % 3] ?? "Legal",
    phase: ["一次レビュー", "事業部確認", "法務承認"][index % 3] ?? "一次レビュー",
    updatedAt: \`2026/05/\${String(10 + index).padStart(2, "0")}\`,
  };
});

const columns: DataTableColumnDef<ContractRow, string>[] = columnKeys.map((key) => ({
  id: key,
  name: key,
  getValue: (row) => row[key],
  renderHeader: ({ name }) => <DataTableHeader>{name}</DataTableHeader>,
  renderCell: ({ value }) => <DataTableCell>{value}</DataTableCell>,
  sortable: true,
}));

export const DataTableColumnVirtualizationDemo = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable columnVirtualization</ContentHeader.Title>
            <ContentHeader.Description>
              現行パッケージでは \`rowVirtualization\` のみ利用可能なため、横長テーブルの構成例として表示
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            このリポジトリに入っている \`@legalforce/aegis-react@2.48.2\` では \`columnVirtualization\` は未搭載です。
            そのため、横に長い列構成と \`stickyHeader\` を使った近い閲覧体験を確認できるサンプルとして残しています。
          </Text>

          <Card variant="outline" style={{ marginBottom: "var(--aegis-space-large)" }}>
            <CardHeader
              trailing={
                <Tag color="indigo" variant="outline" size="small">
                  columnVirtualization
                </Tag>
              }
            >
              横に長い契約一覧
            </CardHeader>
            <CardBody>
              <div style={{ maxWidth: "min(100%, 840px)" }}>
                <DataTable
                  columns={columns}
                  rows={rows}
                  getRowId={(row) => row.id}
                  stickyHeader
                  defaultColumnPinning={{ start: ["contract"] }}
                />
              </div>
            </CardBody>
          </Card>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
              API
            </Text>
            <Text as="p" variant="body.small">
              現行版では \`&lt;DataTable stickyHeader ... /&gt;\` を利用
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-51-0">← Back to v2.51.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
`;export{e as default};