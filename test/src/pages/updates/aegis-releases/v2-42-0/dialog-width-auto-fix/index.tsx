import {
  Link as AegisLink,
  Button,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Divider,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const DialogWidthAutoFix = () => {
  const [shortOpen, setShortOpen] = useState(false);
  const [longOpen, setLongOpen] = useState(false);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Dialog width=&quot;auto&quot; 修正</ContentHeader.Title>
            <ContentHeader.Description>
              v2.42.0: width=&quot;auto&quot; がコンテンツ幅にフィットするよう修正
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            修正前は width=&quot;auto&quot; を指定しても画面全幅に広がっていました。 修正後はコンテンツの幅に合わせて
            Dialog の幅が自動調整されます。
          </Text>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            短いコンテンツ
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-medium)" }}>
            <Button variant="subtle" onClick={() => setShortOpen(true)}>
              短いコンテンツで開く
            </Button>
            <Dialog open={shortOpen} onOpenChange={setShortOpen}>
              <DialogContent width="auto">
                <DialogHeader>
                  <ContentHeader>
                    <ContentHeader.Title>確認</ContentHeader.Title>
                  </ContentHeader>
                </DialogHeader>
                <DialogBody>
                  <Text as="p" variant="body.medium">
                    この操作を実行しますか？
                  </Text>
                </DialogBody>
                <DialogFooter>
                  <Button variant="subtle" onClick={() => setShortOpen(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={() => setShortOpen(false)}>実行する</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            長いコンテンツ
          </Text>
          <div style={{ marginBottom: "var(--aegis-space-medium)" }}>
            <Button variant="subtle" onClick={() => setLongOpen(true)}>
              長いコンテンツで開く
            </Button>
            <Dialog open={longOpen} onOpenChange={setLongOpen}>
              <DialogContent width="auto">
                <DialogHeader>
                  <ContentHeader>
                    <ContentHeader.Title>詳細情報</ContentHeader.Title>
                  </ContentHeader>
                </DialogHeader>
                <DialogBody>
                  <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                    width=&quot;auto&quot;
                    はコンテンツの自然な幅に合わせてダイアログのサイズを決定します。長いテキストや幅のあるコンテンツの場合はそれに応じて広がりますが、画面幅を超えることはありません。
                  </Text>
                  <Text as="p" variant="body.medium">
                    この修正により、短いコンテンツの場合はコンパクトに、長いコンテンツの場合は適切に広がるようになりました。以前のバージョンでは、コンテンツの長さに関わらず常に全幅に広がっていました。
                  </Text>
                </DialogBody>
                <DialogFooter>
                  <Button variant="subtle" onClick={() => setLongOpen(false)}>
                    閉じる
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Divider style={{ margin: "var(--aegis-space-large) 0" }} />

          <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            修正内容
          </Text>
          <ul style={{ margin: 0, paddingLeft: "var(--aegis-space-large)" }}>
            <li style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              <Text variant="body.small">修正前: width=&quot;auto&quot; でも常にビューポート全幅に広がっていた</Text>
            </li>
            <li style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              <Text variant="body.small">修正後: コンテンツの自然な幅にフィットし、必要に応じて広がる</Text>
            </li>
            <li>
              <Text variant="body.small">短い確認ダイアログなどがコンパクトに表示されるようになった</Text>
            </li>
          </ul>

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
