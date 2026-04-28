import {
  Link as AegisLink,
  ContentHeader,
  DataTable,
  type DataTableColumnDef,
  Divider,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  SegmentedControl,
  Text,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Row = {
  id: string;
  index: number;
  name: string;
  department: string;
  status: string;
  amount: string;
};

const departments = ["法務部", "営業部", "開発部", "人事部", "経理部", "総務部"];
const statuses = ["進行中", "完了", "保留", "レビュー中", "差戻し"];

const generateRows = (count: number): Row[] =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    index: i + 1,
    name: `項目 ${String(i + 1).padStart(4, "0")}`,
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    amount: `¥${((i + 1) * 1234).toLocaleString()}`,
  }));

const columns: DataTableColumnDef<Row, string>[] = [
  { id: "index", name: "#", getValue: (row) => String(row.index), width: "xSmall" },
  { id: "name", name: "項目名", getValue: (row) => row.name },
  { id: "department", name: "部署", getValue: (row) => row.department },
  { id: "status", name: "ステータス", getValue: (row) => row.status },
  { id: "amount", name: "金額", getValue: (row) => row.amount },
];

export const DataTableRowVirtualization = () => {
  const [virtualized, setVirtualized] = useState(0);
  const rows = useMemo(() => generateRows(1000), []);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable rowVirtualization</ContentHeader.Title>
            <ContentHeader.Description>v2.42.0: 大量行の仮想スクロール対応</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            1,000行のデータを表示しています。rowVirtualization を有効にすると、 表示領域内の行のみが DOM
            に描画され、スクロールパフォーマンスが向上します。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
              rowVirtualization
            </Text>
            <SegmentedControl index={virtualized} onChange={setVirtualized}>
              <SegmentedControl.Button>OFF</SegmentedControl.Button>
              <SegmentedControl.Button>ON</SegmentedControl.Button>
            </SegmentedControl>
          </div>

          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            stickyHeader
            rowVirtualization={virtualized === 1}
          />

          <Divider style={{ margin: "var(--aegis-space-large) 0" }} />

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            ポイント
          </Text>
          <ul style={{ margin: 0, paddingLeft: "var(--aegis-space-large)" }}>
            <li style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              <Text variant="body.small">{"rowVirtualization={true} で有効化"}</Text>
            </li>
            <li style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              <Text variant="body.small">
                表示領域外の行は DOM から除外され、メモリ使用量とレンダリングコストを削減
              </Text>
            </li>
            <li>
              <Text variant="body.small">stickyHeader と組み合わせて使用することを推奨</Text>
            </li>
          </ul>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/updates/aegis-releases/v2-42-0">← Back to v2.42.0</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
