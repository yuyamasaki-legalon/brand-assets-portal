import {
  Link as AegisLink,
  Button,
  ButtonGroup,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  SegmentedControl,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const orientationOptions = ["horizontal", "vertical"] as const;
type Orientation = (typeof orientationOptions)[number];

export const ButtonGroupOrientation = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const orientation: Orientation = orientationOptions[selectedIndex];

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>ButtonGroup orientation</ContentHeader.Title>
            <ContentHeader.Description>v2.43.0: ButtonGroup に orientation オプションを追加</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            ButtonGroup の orientation を切り替えて、水平・垂直レイアウトを比較できます。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
              orientation を選択
            </Text>
            <SegmentedControl index={selectedIndex} onChange={setSelectedIndex}>
              {orientationOptions.map((opt) => (
                <SegmentedControl.Button key={opt}>{opt}</SegmentedControl.Button>
              ))}
            </SegmentedControl>
          </div>

          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            現在の orientation: <strong>{orientation}</strong>
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
              デフォルトスタイル
            </Text>
            <ButtonGroup orientation={orientation}>
              <Button>保存</Button>
              <Button variant="subtle">キャンセル</Button>
              <Button variant="subtle">リセット</Button>
            </ButtonGroup>
          </div>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
              fill と組み合わせ
            </Text>
            <div style={{ maxWidth: "var(--aegis-layout-width-x3Small)" }}>
              <ButtonGroup orientation={orientation} fill>
                <Button>承認</Button>
                <Button variant="subtle">差し戻し</Button>
              </ButtonGroup>
            </div>
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
              - デフォルトは &quot;horizontal&quot;（従来と同じ動作）
            </Text>
            <Text as="p" variant="body.small">
              - &quot;vertical&quot; はボタンを縦方向に並べ、ナビゲーションやサイドバーのアクション群に有効
            </Text>
            <Text as="p" variant="body.small">
              - fill と組み合わせて縦方向にスペースを埋めることも可能
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
