import {
  Link as AegisLink,
  ContentHeader,
  Divider,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  StatusLabel,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const newColors = [
  { color: "blue" as const, label: "承認待ち" },
  { color: "teal" as const, label: "エスカレーション" },
  { color: "yellow" as const, label: "要確認" },
  { color: "gray" as const, label: "完了（条件付き）" },
  { color: "red" as const, label: "外部レビュー" },
];

const existingColors = [
  { color: "neutral" as const, label: "下書き" },
  { color: "red" as const, label: "差戻し" },
  { color: "yellow" as const, label: "確認中" },
  { color: "blue" as const, label: "レビュー中" },
  { color: "teal" as const, label: "完了" },
  { color: "gray" as const, label: "アーカイブ" },
];

export const StatusLabelNewColors = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>StatusLabel 新カラーパターン デモ</ContentHeader.Title>
            <ContentHeader.Description>
              v2.41.0: purple, magenta, orange, lime, indigo の5色を追加
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            StatusLabel のカラーバリエーションが6色から11色に拡張されました。
            ステータスの種類が多いワークフローでも、色で直感的に識別できます。
          </Text>

          {/* New colors */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            新規追加カラー（v2.41.0）
          </Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {newColors.map((c) => (
              <div key={c.color} style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <StatusLabel color={c.color}>{c.label}</StatusLabel>
                <Text variant="body.xSmall" style={{ color: "var(--aegis-color-text-subtle)" }}>
                  {c.color}
                </Text>
              </div>
            ))}
          </div>

          {/* New colors fill variant */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            新規カラー × fill バリアント
          </Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {newColors.map((c) => (
              <div key={c.color} style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <StatusLabel color={c.color} variant="fill">
                  {c.label}
                </StatusLabel>
                <Text variant="body.xSmall" style={{ color: "var(--aegis-color-text-subtle)" }}>
                  {c.color} / fill
                </Text>
              </div>
            ))}
          </div>

          <Divider style={{ marginBottom: "var(--aegis-space-large)" }} />

          {/* Existing colors for comparison */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            既存カラー（比較用）
          </Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {existingColors.map((c) => (
              <div key={c.color} style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <StatusLabel color={c.color}>{c.label}</StatusLabel>
                <Text variant="body.xSmall" style={{ color: "var(--aegis-color-text-subtle)" }}>
                  {c.color}
                </Text>
              </div>
            ))}
          </div>

          {/* Size comparison */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            サイズバリエーション（purple で例示）
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
              <StatusLabel color="blue" size="small">
                small
              </StatusLabel>
              <Text variant="body.xSmall" style={{ color: "var(--aegis-color-text-subtle)" }}>
                small
              </Text>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
              <StatusLabel color="blue" size="medium">
                medium
              </StatusLabel>
              <Text variant="body.xSmall" style={{ color: "var(--aegis-color-text-subtle)" }}>
                medium
              </Text>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
              <StatusLabel color="blue" size="large">
                large
              </StatusLabel>
              <Text variant="body.xSmall" style={{ color: "var(--aegis-color-text-subtle)" }}>
                large
              </Text>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
              <StatusLabel color="blue" size="large">
                xLarge
              </StatusLabel>
              <Text variant="body.xSmall" style={{ color: "var(--aegis-color-text-subtle)" }}>
                xLarge
              </Text>
            </div>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-41-0">← Back to v2.41.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
