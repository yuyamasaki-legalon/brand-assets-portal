import {
  Link as AegisLink,
  ContentHeader,
  DataTable,
  type DataTableColumnDef,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  SegmentedControl,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type Row = {
  id: string;
  name: string;
  department: string;
  role: string;
  status: string;
};

const rows: Row[] = [
  { id: "1", name: "田中太郎", department: "開発部", role: "エンジニア", status: "在籍" },
  { id: "2", name: "鈴木花子", department: "デザイン部", role: "デザイナー", status: "在籍" },
  { id: "3", name: "佐藤一郎", department: "営業部", role: "マネージャー", status: "休職" },
  { id: "4", name: "高橋美咲", department: "開発部", role: "リードエンジニア", status: "在籍" },
  { id: "5", name: "伊藤健二", department: "人事部", role: "採用担当", status: "在籍" },
];

const columns: DataTableColumnDef<Row, string>[] = [
  { id: "name", name: "氏名", getValue: (row) => row.name },
  { id: "department", name: "部署", getValue: (row) => row.department },
  { id: "role", name: "役職", getValue: (row) => row.role },
  { id: "status", name: "ステータス", getValue: (row) => row.status },
];

const boolOptions = ["OFF", "ON"] as const;

export const DataTableBordered = () => {
  const [columnBorderedIndex, setColumnBorderedIndex] = useState(0);
  const [outerBorderedIndex, setOuterBorderedIndex] = useState(0);

  const columnBordered = columnBorderedIndex === 1;
  const outerBordered = outerBorderedIndex === 1;

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable columnBordered / outerBordered</ContentHeader.Title>
            <ContentHeader.Description>v2.43.0: DataTable にボーダーオプションを追加</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            columnBordered は列間にボーダーを表示し、outerBordered はテーブル全体に外枠ボーダーと角丸を適用します。
          </Text>

          <div style={{ display: "flex", gap: "var(--aegis-space-large)", marginBottom: "var(--aegis-space-large)" }}>
            <div>
              <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                columnBordered
              </Text>
              <SegmentedControl index={columnBorderedIndex} onChange={setColumnBorderedIndex}>
                {boolOptions.map((opt) => (
                  <SegmentedControl.Button key={opt}>{opt}</SegmentedControl.Button>
                ))}
              </SegmentedControl>
            </div>
            <div>
              <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                outerBordered
              </Text>
              <SegmentedControl index={outerBorderedIndex} onChange={setOuterBorderedIndex}>
                {boolOptions.map((opt) => (
                  <SegmentedControl.Button key={opt}>{opt}</SegmentedControl.Button>
                ))}
              </SegmentedControl>
            </div>
          </div>

          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            現在: columnBordered=<strong>{String(columnBordered)}</strong> / outerBordered=
            <strong>{String(outerBordered)}</strong>
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <DataTable
              rows={rows}
              columnBordered={columnBordered}
              outerBordered={outerBordered}
              columns={columns}
              getRowId={(row) => row.id}
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
              注意事項
            </Text>
            <Text as="p" variant="body.small">
              - columnBordered と outerBordered は独立して使用可能
            </Text>
            <Text as="p" variant="body.small">
              - outerBordered は border-radius: medium が適用される
            </Text>
            <Text as="p" variant="body.small">
              - 両方を組み合わせることでスプレッドシートのような見た目になる
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
