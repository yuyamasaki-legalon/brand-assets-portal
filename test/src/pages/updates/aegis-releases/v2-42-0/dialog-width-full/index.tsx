import {
  Link as AegisLink,
  Button,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  SegmentedControl,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const widthOptions = ["small", "medium", "large", "xLarge", "full", "auto"] as const;
type DialogWidth = (typeof widthOptions)[number];

export const DialogWidthFull = () => {
  const [selectedIndex, setSelectedIndex] = useState(4);
  const [open, setOpen] = useState(false);
  const selectedWidth: DialogWidth = widthOptions[selectedIndex];

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Dialog width=&quot;full&quot;</ContentHeader.Title>
            <ContentHeader.Description>
              v2.42.0: DialogContent に width=&quot;full&quot; を追加
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            SegmentedControl で width を切り替えて、各サイズの見た目を比較できます。 新しく追加された &quot;full&quot;
            は画面幅いっぱいにダイアログを表示します。
          </Text>

          <div style={{ marginBottom: "var(--aegis-space-large)" }}>
            <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
              DialogContent width
            </Text>
            <SegmentedControl index={selectedIndex} onChange={setSelectedIndex}>
              {widthOptions.map((w) => (
                <SegmentedControl.Button key={w}>{w}</SegmentedControl.Button>
              ))}
            </SegmentedControl>
          </div>

          <Button onClick={() => setOpen(true)}>width=&quot;{selectedWidth}&quot; で Dialog を開く</Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent width={selectedWidth}>
              <DialogHeader>
                <ContentHeader>
                  <ContentHeader.Title>Dialog width=&quot;{selectedWidth}&quot;</ContentHeader.Title>
                </ContentHeader>
              </DialogHeader>
              <DialogBody>
                <Text as="p" variant="body.medium">
                  現在の width: <strong>{selectedWidth}</strong>
                </Text>
                <Text as="p" variant="body.small" style={{ marginTop: "var(--aegis-space-small)" }}>
                  {selectedWidth === "full"
                    ? "full は画面幅いっぱいにダイアログを表示します。大量のデータや広いコンテンツを表示する場合に有効です。"
                    : selectedWidth === "auto"
                      ? "auto はコンテンツの幅に合わせてダイアログ幅が決まります。"
                      : `${selectedWidth} は固定幅のプリセットです。`}
                </Text>
              </DialogBody>
              <DialogFooter>
                <Button variant="subtle" onClick={() => setOpen(false)}>
                  閉じる
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/updates/aegis-releases/v2-42-0">← Back to v2.42.0</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
