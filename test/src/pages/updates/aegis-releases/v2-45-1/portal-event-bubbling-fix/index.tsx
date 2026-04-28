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
import { useState } from "react";
import { Link } from "react-router-dom";

export const PortalEventBubblingFix = () => {
  const [parentClickCount, setParentClickCount] = useState(0);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Portal イベントバブリング修正</ContentHeader.Title>
            <ContentHeader.Description>Aegis React v2.45.1</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ maxWidth: "var(--aegis-layout-width-large)" }}>
            <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
              v2.45.1 では、Popup 系コンポーネント（Popover, Tooltip, Select
              等）内でのクリックイベントが親要素にバブリングしなくなりました。Portal 内部に{" "}
              <code>STOP_BUBBLING_PROPS</code> 付きの content ラッパーが追加され、イベント伝播を防止しています。
            </Text>

            <Text as="h2" variant="title.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
              デモ
            </Text>

            <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
              下のエリアをクリックするとカウントが増加します。Popover
              内のボタンをクリックしても、親エリアのカウントは増加しません。
            </Text>

            {/* biome-ignore lint/a11y/useSemanticElements: Demo area for event bubbling */}
            {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Demo area for event bubbling */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: Demo area for event bubbling */}
            <div
              role="region"
              onClick={() => setParentClickCount((c) => c + 1)}
              style={{
                padding: "var(--aegis-space-xLarge)",
                border: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
                borderRadius: "var(--aegis-radius-large)",
                backgroundColor: "var(--aegis-color-background-xSubtle)",
                cursor: "pointer",
                marginBottom: "var(--aegis-space-large)",
              }}
            >
              <Text as="p" variant="label.medium.bold" style={{ marginBottom: "var(--aegis-space-small)" }}>
                親エリア（クリックカウント: {parentClickCount}）
              </Text>
              <Text
                as="p"
                variant="body.small"
                style={{
                  color: "var(--aegis-color-text-subtle)",
                  marginBottom: "var(--aegis-space-medium)",
                }}
              >
                このエリアをクリックするとカウントが増加します
              </Text>

              <Popover>
                <Popover.Anchor>
                  <Button onClick={(e) => e.stopPropagation()}>Popover を開く</Button>
                </Popover.Anchor>
                <Popover.Content>
                  <div style={{ padding: "var(--aegis-space-medium)" }}>
                    <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                      この Popover 内でクリックしても、親エリアのカウントは増加しません。
                    </Text>
                    <Button
                      color="information"
                      onClick={() => {
                        // Popover 内のクリック — 親に伝播しない
                      }}
                    >
                      Popover 内ボタン
                    </Button>
                  </div>
                </Popover.Content>
              </Popover>
            </div>

            <div
              style={{
                padding: "var(--aegis-space-medium)",
                backgroundColor: "var(--aegis-color-background-information-xSubtle)",
                borderRadius: "var(--aegis-radius-large)",
                marginBottom: "var(--aegis-space-xLarge)",
              }}
            >
              <Text as="p" variant="body.small">
                <strong>技術的な変更点:</strong> Popup の Portal 内部に <code>STOP_BUBBLING_PROPS</code> 付きの content
                div ラッパーが追加されました。これにより、Portal
                経由でレンダリングされるコンテンツからのイベントバブリングが自動的に防止されます。
              </Text>
            </div>

            <AegisLink asChild>
              <Link to="/updates/aegis-releases/v2-45-1">← Back to v2.45.1</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
