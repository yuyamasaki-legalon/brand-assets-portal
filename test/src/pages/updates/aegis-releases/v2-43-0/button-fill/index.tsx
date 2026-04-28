import {
  Link as AegisLink,
  Button,
  ButtonGroup,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export const ButtonFill = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Button / ButtonGroup fill</ContentHeader.Title>
            <ContentHeader.Description>
              v2.43.0: Button と ButtonGroup に fill オプションを追加
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            fill を指定すると、ボタンが利用可能なスペースを埋めるように拡張されます。ButtonGroup の fill
            は子ボタンに自動伝播します。
          </Text>

          {/* Button fill 単体 */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            Button fill（単体）
          </Text>
          <div
            style={{
              display: "flex",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-large)",
              border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
              borderRadius: "var(--aegis-radius-medium)",
              padding: "var(--aegis-space-medium)",
            }}
          >
            <Button fill>fill=true（スペースを埋める）</Button>
            <Button>fill なし</Button>
          </div>

          {/* ButtonGroup fill */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            ButtonGroup fill（グループ全体）
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              fill=true: 全ボタンが均等に広がる
            </Text>
            <ButtonGroup fill>
              <Button>Button 1</Button>
              <Button>Button 2</Button>
              <Button>Button 3</Button>
            </ButtonGroup>
          </div>

          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              fill=false（デフォルト）: コンテンツ幅に収まる
            </Text>
            <ButtonGroup>
              <Button>Button 1</Button>
              <Button>Button 2</Button>
              <Button>Button 3</Button>
            </ButtonGroup>
          </div>

          {/* ButtonGroup fill + 個別 fill */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            個別の Button fill（ButtonGroup 内）
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              ButtonGroup fill=false で、1つ目の Button だけ fill=true
            </Text>
            <ButtonGroup>
              <Button fill>fill=true</Button>
              <Button>通常</Button>
            </ButtonGroup>
          </div>

          {/* ButtonGroup fill + vertical */}
          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            ButtonGroup fill + vertical orientation
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <ButtonGroup fill orientation="vertical">
              <Button>Button 1</Button>
              <Button>Button 2</Button>
              <Button>Button 3</Button>
            </ButtonGroup>
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
              - ButtonGroup の fill は子 Button に ButtonContext 経由で伝播する
            </Text>
            <Text as="p" variant="body.small">
              - 個別の Button に fill を指定して部分的に拡張することも可能
            </Text>
            <Text as="p" variant="body.small">
              - orientation=&quot;vertical&quot; と組み合わせて縦方向にも fill できる
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
