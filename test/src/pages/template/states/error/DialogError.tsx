import {
  Link as AegisLink,
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
  FormControl,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function DialogError() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState("");
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [isDialogSubmitting, setIsDialogSubmitting] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const handleDialogSubmit = () => {
    setIsDialogSubmitting(true);
    setDialogError(null);
    setTimeout(() => {
      setIsDialogSubmitting(false);
      if (attemptCount === 0) {
        setDialogError("保存に失敗しました。時間をおいて再度お試しください。");
        setAttemptCount(1);
      } else {
        setDialogOpen(false);
        setDialogValue("");
        setDialogError(null);
        setAttemptCount(0);
      }
    }, 1500);
  };

  const handleDialogClose = () => {
    if (!isDialogSubmitting) {
      setDialogOpen(false);
      setDialogValue("");
      setDialogError(null);
      setAttemptCount(0);
    }
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Dialog Error</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">Dialog 内フォーム送信エラー</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                  <Text variant="body.small" color="subtle">
                    Dialog 内でフォーム送信が失敗した場合、Dialog を閉じずに Banner
                    でエラーを表示します。DialogStickyContainer を使い、スクロールしてもエラーが見えるようにします。
                  </Text>
                  <Text variant="body.small" color="subtle">
                    初回は送信失敗、リトライで成功します。
                  </Text>
                  <div>
                    <Button variant="subtle" onClick={() => setDialogOpen(true)}>
                      Dialog を開く
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Text variant="title.xSmall">ポイント</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      エラー時は Dialog を閉じない
                    </Text>
                    : ユーザーの入力を保持し、リトライを可能にする
                  </Text>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      DialogStickyContainer
                    </Text>
                    : position=&quot;bottom&quot; で Banner を固定表示
                  </Text>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      送信中は閉じれない
                    </Text>
                    : isSubmitting 中は onOpenChange をブロック
                  </Text>
                </div>
              </CardBody>
            </Card>
          </div>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/template/states/error">← Back to Error</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) handleDialogClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>スペース変更</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
              <FormControl required>
                <FormControl.Label>スペース名</FormControl.Label>
                <TextField
                  value={dialogValue}
                  onChange={(e) => setDialogValue(e.target.value)}
                  placeholder="スペース名を入力"
                  disabled={isDialogSubmitting}
                />
              </FormControl>

              {dialogError && (
                <DialogStickyContainer position="bottom">
                  <Banner color="danger" size="small" closeButton={false}>
                    {dialogError}
                  </Banner>
                </DialogStickyContainer>
              )}
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" disabled={isDialogSubmitting} onClick={handleDialogClose}>
                キャンセル
              </Button>
              <Button loading={isDialogSubmitting} onClick={handleDialogSubmit} disabled={!dialogValue.trim()}>
                保存
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
