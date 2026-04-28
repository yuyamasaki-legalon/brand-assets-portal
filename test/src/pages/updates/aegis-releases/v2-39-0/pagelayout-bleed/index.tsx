import {
  Link as AegisLink,
  ContentHeader,
  DataTable,
  type DataTableColumnDef,
  Divider,
  PageLayout,
  PageLayoutBleed,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

type SampleRow = {
  id: string;
  name: string;
  category: string;
  status: string;
};

const rows: SampleRow[] = [
  { id: "1", name: "Alpha Project", category: "Engineering", status: "Active" },
  { id: "2", name: "Beta Initiative", category: "Design", status: "Planning" },
  { id: "3", name: "Gamma Release", category: "Product", status: "Review" },
  { id: "4", name: "Delta Research", category: "Research", status: "Active" },
];

const columns: DataTableColumnDef<SampleRow, string>[] = [
  { id: "name", name: "Name", getValue: (row) => row.name },
  { id: "category", name: "Category", getValue: (row) => row.category },
  { id: "status", name: "Status", getValue: (row) => row.status },
];

export const PageLayoutBleedDemo = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>PageLayoutBleed デモ</ContentHeader.Title>
            <ContentHeader.Description>
              v2.39.0: PageLayoutBody の inline padding を打ち消す新コンポーネント
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            <code>PageLayoutBleed</code> は <code>PageLayoutBody</code> 内で使用し、子要素を
            パネルの左右パディングを無視して端まで広げます。DataTable や Divider
            などを画面幅いっぱいに表示したい場合に使用します。
          </Text>

          {/* --- Bleed あり --- */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            Bleed あり（端まで広がる）
          </Text>
          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
            <code>PageLayoutBleed</code> で囲んだ DataTable と Divider は、PageLayoutBody
            のパディングを打ち消して端まで広がります。
          </Text>

          <PageLayoutBleed>
            <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} />
          </PageLayoutBleed>

          <div style={{ marginBlock: "var(--aegis-space-medium)" }}>
            <PageLayoutBleed>
              <Divider />
            </PageLayoutBleed>
          </div>

          {/* --- Bleed なし（比較用） --- */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            Bleed なし（通常の配置）
          </Text>
          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
            <code>PageLayoutBleed</code> を使わない場合、DataTable と Divider は PageLayoutBody
            のパディング内に収まります。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-medium)" }}>
            <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} />
          </div>

          <Divider />

          <div style={{ marginTop: "var(--aegis-space-large)" }}>
            <div
              style={{
                padding: "var(--aegis-space-medium)",
                backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                borderRadius: "var(--aegis-radius-medium)",
                marginBottom: "var(--aegis-space-large)",
              }}
            >
              <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                使い方
              </Text>
              <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                - <code>PageLayoutBleed</code> を <code>PageLayoutBody</code> の直下に配置します
              </Text>
              <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                - 子要素の inline padding（左右余白）が打ち消され、コンテンツが端まで広がります
              </Text>
              <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
                - DataTable、Divider、画像など端まで広げたい要素を囲んで使用します
              </Text>
              <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                compound API の deprecated 化
              </Text>
              <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                - v2.39.0 で <code>PageLayout.Header</code>、<code>PageLayout.Body</code> 等の compound API が
                deprecated になりました
              </Text>
              <Text as="p" variant="body.small">
                - 今後は <code>PageLayoutHeader</code>、<code>PageLayoutBody</code> 等の個別インポートを使用してください
              </Text>
            </div>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-39-0">← Back to v2.39.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
