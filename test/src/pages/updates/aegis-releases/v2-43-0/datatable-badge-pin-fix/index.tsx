import {
  Link as AegisLink,
  Button,
  ContentHeader,
  DataTable,
  type DataTableColumnDef,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

type Row = {
  id: string;
  name: string;
  category: string;
  amount: string;
  date: string;
};

const rows: Row[] = [
  { id: "1", name: "契約書A", category: "業務委託", amount: "¥1,000,000", date: "2026-01-15" },
  { id: "2", name: "契約書B", category: "秘密保持", amount: "¥500,000", date: "2026-02-20" },
  { id: "3", name: "契約書C", category: "売買", amount: "¥2,500,000", date: "2026-03-01" },
  { id: "4", name: "契約書D", category: "業務委託", amount: "¥750,000", date: "2026-03-10" },
  { id: "5", name: "契約書E", category: "ライセンス", amount: "¥3,000,000", date: "2026-03-15" },
];

const columns: DataTableColumnDef<Row, string>[] = [
  { id: "name", name: "契約書名", getValue: (row) => row.name },
  { id: "category", name: "カテゴリ", getValue: (row) => row.category },
  { id: "amount", name: "金額", getValue: (row) => row.amount },
  { id: "date", name: "日付", getValue: (row) => row.date },
];

const columnOrderA = ["name", "category", "amount", "date"];
const columnOrderB = ["date", "name", "amount", "category"];

export const DataTableBadgePinFix = () => {
  const [columnOrder, setColumnOrder] = useState(columnOrderA);
  const [isSwapped, setIsSwapped] = useState(false);

  const handleToggle = useCallback(() => {
    const next = !isSwapped;
    setColumnOrder(next ? columnOrderB : columnOrderA);
    setIsSwapped(next);
  }, [isSwapped]);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable badge 列 pin 修正</ContentHeader.Title>
            <ContentHeader.Description>
              v2.43.0 / v2.43.1: columnOrder 指定時の badge 列ピン留め修正
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            columnOrder を指定した状態で badge
            列（行選択チェックボックス列）が正しく左端にピン留めされることを確認できます。
          </Text>

          <div
            style={{
              display: "flex",
              gap: "var(--aegis-space-small)",
              alignItems: "center",
              marginBottom: "var(--aegis-space-medium)",
            }}
          >
            <Button onClick={handleToggle}>{isSwapped ? "columnOrder A に戻す" : "columnOrder B に切り替え"}</Button>
          </div>

          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            現在の columnOrder: <strong>[{columnOrder.join(", ")}]</strong>
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <DataTable
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              rowSelectionType="multiple"
              columnOrder={columnOrder}
            />
          </div>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              修正内容
            </Text>
            <Text as="p" variant="body.small">
              - v2.42.x 以前: columnOrder を指定すると badge 列（チェックボックス列）が左端にピン留めされず、
              カラム順序の影響を受けていた
            </Text>
            <Text as="p" variant="body.small">
              - v2.43.0: columnOrder 指定時に badge 列が正しく左端にピン留めされるよう修正
            </Text>
            <Text as="p" variant="body.small">
              - v2.43.1: columnOrder 未指定時にも badge 列の位置が正しくなるよう追加修正（パッチ）
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-43-0">← Back to v2.43.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
