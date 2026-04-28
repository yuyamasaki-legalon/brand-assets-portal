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

export const DataTableBorderedFix = () => {
  const [columnBorderedIndex, setColumnBorderedIndex] = useState(1);
  const [outerBorderedIndex, setOuterBorderedIndex] = useState(1);

  const columnBordered = columnBorderedIndex === 1;
  const outerBordered = outerBorderedIndex === 1;

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable bordered checkbox / corner radius 修正</ContentHeader.Title>
            <ContentHeader.Description>
              v2.43.2: bordered テーブルの checkbox パディングと角丸の修正
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            bordered テーブルに checkbox 列を組み合わせた際のパディングが正しくなかったのと、outerBordered
            の角丸が正しく適用されない問題が修正されました。
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

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            checkbox あり（rowSelectionType=&quot;multiple&quot;）
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <DataTable
              rows={rows}
              columns={columns}
              columnBordered={columnBordered}
              outerBordered={outerBordered}
              getRowId={(row) => row.id}
              rowSelectionType="multiple"
            />
          </div>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            checkbox なし（比較用）
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <DataTable
              rows={rows}
              columns={columns}
              columnBordered={columnBordered}
              outerBordered={outerBordered}
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
              修正内容
            </Text>
            <Text as="p" variant="body.small">
              - v2.43.1 以前: bordered テーブルで checkbox セルの左右パディングが不均一になっていた
            </Text>
            <Text as="p" variant="body.small">
              - v2.43.1 以前: outerBordered 時のテーブル四隅の角丸が正しく適用されなかった
            </Text>
            <Text as="p" variant="body.small">
              - v2.43.2: checkbox セルに均等なパディングが適用され、outerBordered の角丸も正しく表示されるように修正
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-43-2">← Back to v2.43.2</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
