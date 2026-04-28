import { LfStar, LfStarFill } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Button,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const variants = ["subtle", "plain"] as const;
const otherColors = ["neutral", "danger", "information"] as const;

export const ButtonYellow = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Button yellow カラー</ContentHeader.Title>
            <ContentHeader.Description>
              v2.44.0: Button に yellow カラーを追加（subtle / plain variant で使用可能）
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            yellow カラーは subtle と plain variant
            でのみサポートされています。「お気に入り」機能など特殊な用途向けのカラーです。
          </Text>

          {/* yellow ボタン各 variant */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            yellow カラー（対応 variant）
          </Text>
          <div
            style={{
              display: "flex",
              gap: "var(--aegis-space-medium)",
              alignItems: "center",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {variants.map((variant) => (
              <Button key={variant} color="yellow" variant={variant}>
                {variant}
              </Button>
            ))}
          </div>

          {/* アイコン付き yellow ボタン */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            yellow カラー + アイコン
          </Text>
          <div
            style={{
              display: "flex",
              gap: "var(--aegis-space-medium)",
              alignItems: "center",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <Button color="yellow" variant="subtle" leading={LfStar}>
              お気に入り
            </Button>
            <Button color="yellow" variant="plain" leading={LfStarFill}>
              お気に入り済み
            </Button>
          </div>

          {/* サイズバリエーション */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            yellow カラー（サイズ比較 / subtle）
          </Text>
          <div
            style={{
              display: "flex",
              gap: "var(--aegis-space-medium)",
              alignItems: "center",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {(["xSmall", "small", "medium", "large", "xLarge"] as const).map((size) => (
              <Button key={size} color="yellow" variant="subtle" size={size}>
                {size}
              </Button>
            ))}
          </div>

          {/* 他カラーとの比較 */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            カラー比較（subtle variant）
          </Text>
          <div
            style={{
              display: "flex",
              gap: "var(--aegis-space-medium)",
              alignItems: "center",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <Button color="yellow" variant="subtle">
              yellow
            </Button>
            {otherColors.map((color) => (
              <Button key={color} color={color} variant="subtle">
                {color}
              </Button>
            ))}
          </div>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            カラー比較（plain variant）
          </Text>
          <div
            style={{
              display: "flex",
              gap: "var(--aegis-space-medium)",
              alignItems: "center",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Button color="yellow" variant="plain">
              yellow
            </Button>
            {otherColors.map((color) => (
              <Button key={color} color={color} variant="plain">
                {color}
              </Button>
            ))}
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
              - yellow は subtle と plain variant でのみサポート（solid では使用不可）
            </Text>
            <Text as="p" variant="body.small">
              - 「お気に入り」機能など特殊な用途向けのカラー
            </Text>
            <Text as="p" variant="body.small">
              - Figma 上の warning カラーとは別物。警告表示には color=&quot;danger&quot; を使用すること
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
