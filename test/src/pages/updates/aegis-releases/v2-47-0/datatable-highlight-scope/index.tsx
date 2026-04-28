import {
  Link as AegisLink,
  Button,
  ContentHeader,
  DataTable,
  DataTableCell,
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
  team: string;
  assignee: string;
};

const rows: Row[] = [
  { id: "1", name: "秘密保持契約レビュー", team: "法務", assignee: "田中" },
  { id: "2", name: "マスターサービス契約", team: "営業企画", assignee: "鈴木" },
  { id: "3", name: "利用規約更新", team: "プロダクト", assignee: "佐藤" },
  { id: "4", name: "購買基本契約", team: "コーポレート", assignee: "高橋" },
];

const scopeOptions = ["row", "cell", "none"] as const;
type Scope = (typeof scopeOptions)[number];

export const DataTableHighlightScope = () => {
  const [scopeIndex, setScopeIndex] = useState(0);

  const highlightScope: Scope = scopeOptions[scopeIndex] ?? "row";

  const columns: DataTableColumnDef<Row, string>[] = [
    {
      id: "name",
      name: "案件名",
      getValue: (row) => row.name,
      renderCell: ({ value }) => (
        <DataTableCell
          trailing={
            <Button size="small" variant="subtle">
              開く
            </Button>
          }
        >
          {value}
        </DataTableCell>
      ),
    },
    { id: "team", name: "担当チーム", getValue: (row) => row.team },
    { id: "assignee", name: "担当者", getValue: (row) => row.assignee },
  ];

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable highlightScope</ContentHeader.Title>
            <ContentHeader.Description>
              v2.47.0: hover / focus 時の強調範囲を row / cell / none で制御
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            `highlightRowOnHover` の代わりに `highlightScope` を使うことで、行単位・セル単位・無効を明示的に選べます。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
              highlightScope を切り替え
            </Text>
            <SegmentedControl index={scopeIndex} onChange={setScopeIndex}>
              <SegmentedControl.Button>row</SegmentedControl.Button>
              <SegmentedControl.Button>cell</SegmentedControl.Button>
              <SegmentedControl.Button>none</SegmentedControl.Button>
            </SegmentedControl>
          </div>

          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            現在の設定: <strong>{highlightScope}</strong>
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} highlightScope={highlightScope} />
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
              変更点
            </Text>
            <Text as="p" variant="body.small">
              - `row`: 行全体を強調
            </Text>
            <Text as="p" variant="body.small">
              - `cell`: 操作中のセルだけを強調
            </Text>
            <Text as="p" variant="body.small">
              - `none`: hover 強調を無効化
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-47-0">← Back to v2.47.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
