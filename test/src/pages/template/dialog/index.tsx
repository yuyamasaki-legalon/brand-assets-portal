import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogStickyContainer,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import type { FC } from "react";
import { useState } from "react";

export const DialogTemplate: FC = () => {
  const [basicDialogOpen, setBasicDialogOpen] = useState(false);
  const [stickyDialogOpen, setStickyDialogOpen] = useState(false);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Dialog テンプレート</ContentHeaderTitle>
          </ContentHeader>
          <Text color="subtle">Dialog コンポーネントの使用例を示します。</Text>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-large)",
            }}
          >
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">ベーシックダイアログ</Text>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  <Text variant="body.small" color="subtle">
                    基本的な使用例を示すシンプルなダイアログです。
                  </Text>
                  <div>
                    <Button variant="subtle" onClick={() => setBasicDialogOpen(true)}>
                      ベーシックダイアログを開く
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Text variant="title.xSmall">StickyContainer ダイアログ</Text>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  <Text variant="body.small" color="subtle">
                    Banner を StickyContainer に配置した削除確認ダイアログの例です。
                  </Text>
                  <div>
                    <Button color="danger" onClick={() => setStickyDialogOpen(true)}>
                      Sticky ダイアログを開く
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>

      {/* ベーシックダイアログ */}
      <Dialog open={basicDialogOpen} onOpenChange={setBasicDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>削除してよろしいですか？</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <Text whiteSpace="pre-line">以下の項目を削除します。{"\n"}この操作は元に戻せません。</Text>
              <Card variant="fill" size="small">
                <Text>優先度</Text>
              </Card>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setBasicDialogOpen(false)}>
                キャンセル
              </Button>
              <Button color="danger" onClick={() => setBasicDialogOpen(false)}>
                削除
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* StickyContainer を使ったダイアログ */}
      <Dialog open={stickyDialogOpen} onOpenChange={setStickyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>削除してよろしいですか？</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <Text whiteSpace="pre-line">
                  以下の項目を削除します。
                  {"\n"}
                  この操作は元に戻せません。
                </Text>
                <Card variant="fill" size="small">
                  <Text>優先度</Text>
                </Card>
              </div>

              <DialogStickyContainer position="bottom">
                <Banner color="danger" closeButton={false}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Text variant="body.small">案件カスタム項目の削除に失敗しました。</Text>
                    <Text variant="body.small">時間をおいて再度お試しください。</Text>
                  </div>
                </Banner>
              </DialogStickyContainer>
            </div>
          </DialogBody>
          <DialogFooter>
            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
              <ButtonGroup>
                <Button variant="plain" onClick={() => setStickyDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button color="danger" onClick={() => setStickyDialogOpen(false)}>
                  削除
                </Button>
              </ButtonGroup>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default DialogTemplate;
