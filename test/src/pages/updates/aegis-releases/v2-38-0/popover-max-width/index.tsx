import {
  Link as AegisLink,
  Button,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Popover,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const longContent =
  "これは非常に長いコンテンツを持つ Popover のデモです。v2.38.0 で Popover に max-width が適用されるようになり、画面端に配置されたボタンから開いた場合でもコンテンツが画面外にはみ出さなくなりました。以前のバージョンでは、長いテキストを含む Popover が画面端で開かれると、コンテンツが画面外にはみ出してしまう問題がありました。この修正により、ユーザー体験が大幅に改善されています。";

const PopoverDemo = ({ label, style }: { label: string; style?: React.CSSProperties }) => (
  <div style={style}>
    <Popover>
      <Popover.Anchor>
        <Button>{label}</Button>
      </Popover.Anchor>
      <Popover.Content>
        <div style={{ padding: "var(--aegis-space-medium)" }}>
          <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
            {label}
          </Text>
          <Text as="p" variant="body.small">
            {longContent}
          </Text>
        </div>
      </Popover.Content>
    </Popover>
  </div>
);

export const PopoverMaxWidth = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Popover max-width デモ</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            v2.38.0 で Popover に max-width が適用されるようになりました。 画面端に配置されたボタンから Popover
            を開いても、コンテンツが画面外にはみ出さないことを確認できます。
          </Text>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            左端に配置
          </Text>
          <PopoverDemo label="左端の Popover" style={{ marginBottom: "var(--aegis-space-large)" }} />

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            中央に配置
          </Text>
          <PopoverDemo
            label="中央の Popover"
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "var(--aegis-space-large)",
            }}
          />

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            右端に配置
          </Text>
          <PopoverDemo
            label="右端の Popover"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "var(--aegis-space-large)",
            }}
          />

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
              - Popover のフローティング要素に max-width が適用され、ビューポートからはみ出さなくなりました
            </Text>
            <Text as="p" variant="body.small">
              - 各ボタンをクリックして Popover を開き、画面端でのレイアウトを確認してください
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-38-0">← Back to v2.38.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
