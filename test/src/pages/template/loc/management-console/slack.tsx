import {
  Banner,
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  StatusLabel,
  Switch,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { LocSidebarLayout } from "../_shared";
import { ManagementConsoleNavList } from "./_shared/ManagementConsoleNavList";

/** Slack連携設定ページ。 */
export const ManagementConsoleSlack = () => {
  const [integrated, setIntegrated] = useState(false);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);

  const handleSwitchChange = () => {
    if (integrated) {
      setDisableDialogOpen(true);
    } else {
      // 実際にはSlack OAuth認可URLへリダイレクト
      setIntegrated(true);
    }
  };

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <ManagementConsoleNavList activePage="slack" />

        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>Slack</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-large)",
              }}
            >
              {/* 説明 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                }}
              >
                <Text variant="caption.medium">Slackと連携することで、Slackから通知を受け取ることができます。</Text>
                <div style={{ width: "fit-content" }}>
                  <Link href="#" onClick={(e) => e.preventDefault()}>
                    <Text variant="body.small">Slack連携について</Text>
                  </Link>
                </div>
              </div>

              {/* 連携ステータス */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                }}
              >
                <Text variant="body.medium">連携状態</Text>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--aegis-space-small)",
                    alignItems: "center",
                  }}
                >
                  <StatusLabel color={integrated ? "teal" : "gray"} variant="fill">
                    {integrated ? "連携中" : "未連携"}
                  </StatusLabel>
                  <Switch checked={integrated} color="information" onChange={handleSwitchChange}>
                    Slack連携を有効にする
                  </Switch>
                </div>
              </div>
            </div>

            {/* 連携解除ダイアログ */}
            <DisableSlackDialog
              open={disableDialogOpen}
              onOpenChange={setDisableDialogOpen}
              onConfirm={() => {
                setIntegrated(false);
                setDisableDialogOpen(false);
              }}
            />
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

// 連携解除確認ダイアログ
const DisableSlackDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) => {
  const [error, setError] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>Slack連携を解除しますか？</ContentHeaderTitle>
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
            <Text variant="body.medium">Slack連携を解除すると、Slackからの通知を受け取れなくなります。</Text>
            {error && (
              <Banner color="danger" closeButton={false}>
                <Text>連携解除に失敗しました。</Text>
              </Banner>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button
              onClick={() => {
                setError(false);
                onConfirm();
              }}
            >
              解除する
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
