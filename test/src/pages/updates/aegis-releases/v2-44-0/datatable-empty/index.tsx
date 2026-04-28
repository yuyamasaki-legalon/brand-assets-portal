import { LfFolder } from "@legalforce/aegis-icons";
import type { DataTableColumnDef } from "@legalforce/aegis-react";
import {
  Link as AegisLink,
  Button,
  ContentHeader,
  DataTable,
  EmptyState,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Row {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
}

const sampleRows: Row[] = [
  { id: "1", name: "契約書A", status: "レビュー中", updatedAt: "2026-03-24" },
  { id: "2", name: "契約書B", status: "承認済み", updatedAt: "2026-03-23" },
  { id: "3", name: "契約書C", status: "下書き", updatedAt: "2026-03-22" },
];

const columns: DataTableColumnDef<Row, string>[] = [
  { id: "name", name: "名前", getValue: (row) => row.name },
  { id: "status", name: "ステータス", getValue: (row) => row.status },
  { id: "updatedAt", name: "更新日", getValue: (row) => row.updatedAt },
];

export const DataTableEmpty = () => {
  const [showData, setShowData] = useState(true);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DataTable empty オプション</ContentHeader.Title>
            <ContentHeader.Description>
              v2.44.0: DataTable に empty プロップを追加。rows が空の場合のカスタム表示
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            empty プロップに ReactNode を渡すことで、rows が空配列のときにカスタムコンテンツを表示できます。
          </Text>

          {/* データ切り替えボタン */}
          <div style={{ marginBottom: "var(--aegis-space-medium)" }}>
            <Button variant="subtle" onClick={() => setShowData((prev) => !prev)}>
              {showData ? "データをクリアする" : "データを表示する"}
            </Button>
          </div>

          {/* empty プロップ付き DataTable */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            empty に EmptyState を指定
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <DataTable
              columns={columns}
              rows={showData ? sampleRows : []}
              getRowId={(row) => row.id}
              empty={
                <EmptyState
                  size="medium"
                  visual={
                    <Icon size="large">
                      <LfFolder />
                    </Icon>
                  }
                  title="データがありません"
                >
                  条件を変更して再度お試しください
                </EmptyState>
              }
            />
          </div>

          {/* empty にテキストのみ */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            empty にシンプルなテキストを指定
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <DataTable
              columns={columns}
              rows={showData ? sampleRows : []}
              getRowId={(row) => row.id}
              empty={
                <Text variant="body.medium" style={{ padding: "var(--aegis-space-xLarge)", textAlign: "center" }}>
                  該当するデータが見つかりません
                </Text>
              }
            />
          </div>

          {/* empty 未指定の場合（比較用） */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            empty 未指定（比較用）
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <DataTable columns={columns} rows={showData ? sampleRows : []} getRowId={(row) => row.id} />
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
              - empty は ReactNode を受け取るため、EmptyState やカスタムコンポーネントを自由に配置可能
            </Text>
            <Text as="p" variant="body.small">
              - rows が空配列のときのみ表示される（rows にデータがある場合は非表示）
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-44-0">← Back to v2.44.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
