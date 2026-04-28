import {
  Link as AegisLink,
  Button,
  ContentHeader,
  Drawer,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  SegmentedControl,
  Text,
} from "@legalforce/aegis-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

type MaxWidthOption = "small" | "medium" | "large" | "xLarge" | "none";

const maxWidthOptions: { label: string; value: MaxWidthOption }[] = [
  { label: "small", value: "small" },
  { label: "medium", value: "medium" },
  { label: "large", value: "large" },
  { label: "xLarge", value: "xLarge" },
  { label: "none", value: "none" },
];

export const DrawerMaxWidthNone = () => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(4);
  const rootRef = useRef<HTMLDivElement>(null);

  const currentMaxWidth = maxWidthOptions[selectedIndex]?.value ?? "none";

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Drawer maxWidth: &quot;none&quot; デモ</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div ref={rootRef} style={{ position: "relative", minHeight: "600px" }}>
            <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
              Drawer の <code>maxWidth</code> プロパティに <code>&quot;none&quot;</code>{" "}
              を指定すると、リサイズ時の最大幅の制限がなくなります。
            </Text>

            <div style={{ marginBottom: "var(--aegis-space-medium)" }}>
              <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                maxWidth を選択
              </Text>
              <SegmentedControl index={selectedIndex} onChange={setSelectedIndex}>
                {maxWidthOptions.map((opt) => (
                  <SegmentedControl.Button key={opt.value}>{opt.label}</SegmentedControl.Button>
                ))}
              </SegmentedControl>
            </div>

            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-medium)" }}>
              現在の maxWidth: <strong>{currentMaxWidth}</strong>
            </Text>

            <Button onClick={() => setOpen(true)}>Drawer を開く</Button>

            <Drawer
              open={open}
              onOpenChange={setOpen}
              resizable
              maxWidth={currentMaxWidth}
              minWidth="small"
              width="medium"
              position="end"
              root={rootRef}
              modal={false}
              lockScroll={false}
            >
              <Drawer.Header>
                <Text variant="title.xSmall">Drawer (maxWidth: {currentMaxWidth})</Text>
              </Drawer.Header>
              <Drawer.Body>
                <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
                  この Drawer は <code>maxWidth: &quot;{currentMaxWidth}&quot;</code> で設定されています。
                </Text>
                <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
                  左端をドラッグしてリサイズしてみてください。
                  {currentMaxWidth === "none"
                    ? "最大幅の制限はありません。"
                    : `最大幅は ${currentMaxWidth} に制限されています。`}
                </Text>
                <Text as="p" variant="body.small">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </Text>
              </Drawer.Body>
            </Drawer>

            <div
              style={{
                marginTop: "var(--aegis-space-large)",
                padding: "var(--aegis-space-medium)",
                backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                borderRadius: "var(--aegis-radius-medium)",
              }}
            >
              <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                注意事項
              </Text>
              <Text as="p" variant="body.small">
                - <code>maxWidth: &quot;none&quot;</code> は v2.38.0 で追加された新しいオプションです
              </Text>
              <Text as="p" variant="body.small">
                - <code>onResize</code>{" "}
                コールバックはユーザーのドラッグ操作時のみ呼ばれます（外的要因のリサイズでは呼ばれません）
              </Text>
            </div>

            <div style={{ marginTop: "var(--aegis-space-large)" }}>
              <AegisLink asChild>
                <Link to="/updates/aegis-releases/v2-38-0">← Back to v2.38.0</Link>
              </AegisLink>
            </div>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
