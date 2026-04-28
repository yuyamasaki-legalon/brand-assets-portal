import {
  Link as AegisLink,
  Button,
  ContentHeader,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  SegmentedControl,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const positions = ["start", "end", "bottom"] as const;
type Position = (typeof positions)[number];

export const DrawerBottom = () => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const currentPosition: Position = positions[selectedIndex] ?? "bottom";

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Drawer bottom position</ContentHeader.Title>
            <ContentHeader.Description>v2.45.0: Drawer に position=&quot;bottom&quot; を追加</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            Drawer の position prop に &quot;bottom&quot; が追加され、画面下部からスライドインする Drawer
            が利用可能になりました。
          </Text>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            position を選択
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-medium)" }}>
            <SegmentedControl index={selectedIndex} onChange={setSelectedIndex}>
              {positions.map((pos) => (
                <SegmentedControl.Button key={pos}>{pos}</SegmentedControl.Button>
              ))}
            </SegmentedControl>
          </div>

          <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            現在の position: <strong>{currentPosition}</strong>
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-xLarge)" }}>
            <Button onClick={() => setOpen(true)}>Drawer を開く</Button>
          </div>

          <Drawer open={open} onOpenChange={setOpen} position={currentPosition}>
            <DrawerHeader>
              <ContentHeader>
                <ContentHeader.Title>position: {currentPosition}</ContentHeader.Title>
              </ContentHeader>
            </DrawerHeader>
            <DrawerBody>
              <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
                この Drawer は position=&quot;{currentPosition}&quot; で表示されています。
              </Text>
              <Text as="p" variant="body.medium">
                bottom position は、モバイルライクなボトムシートや、アクションパネルとして活用できます。
              </Text>
            </DrawerBody>
            <DrawerFooter>
              <Button onClick={() => setOpen(false)}>閉じる</Button>
            </DrawerFooter>
          </Drawer>

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
              - position=&quot;bottom&quot; は v2.45.0 で新規追加
            </Text>
            <Text as="p" variant="body.small">
              - start（デフォルト）は画面左から、end は画面右から、bottom は画面下部からスライドイン
            </Text>
            <Text as="p" variant="body.small">
              - small スケール時にはバックドロップ（背景オーバーレイ）が自動表示される（v2.45.0 の別変更）
            </Text>
            <Text as="p" variant="body.small">
              - DrawerHeader, DrawerBody, DrawerFooter は直接インポートも可能に（v2.45.0 の別変更）
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-45-0">← Back to v2.45.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
