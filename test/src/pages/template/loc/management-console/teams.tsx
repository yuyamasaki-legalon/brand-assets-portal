import { LfArrowUpRightFromSquare } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Form,
  FormControl,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Switch,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { LocSidebarLayout } from "../_shared";
import { ManagementConsoleNavList } from "./_shared/ManagementConsoleNavList";

/** Microsoft Teams連携設定ページ。 */
export const ManagementConsoleTeams = () => {
  const [integrated, setIntegrated] = useState(false);
  const [tenantId, setTenantId] = useState("");
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);

  const handleSwitchChange = () => {
    if (integrated) {
      setDisableDialogOpen(true);
    } else {
      if (tenantId.trim()) {
        setIntegrated(true);
      }
    }
  };

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <ManagementConsoleNavList activePage="teams" />

        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>Microsoft Teams</ContentHeaderTitle>
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
                  marginBlockEnd: "var(--aegis-space-large)",
                }}
              >
                <Text variant="body.medium" whiteSpace="pre-wrap">
                  {
                    "LegalOnとMicrosoft Teamsの連携ができます。\nマターマネジメントを契約している場合、案件のやり取りをTeamsとLegalOn間でシームレスに行えるようになります。"
                  }
                </Text>
                <Link href="https://help.legalon-cloud.com/articles/9690263" trailing={LfArrowUpRightFromSquare}>
                  Microsoft Teams連携について
                </Link>
              </div>

              {/* テナントID入力 */}
              <Form>
                <FormControl required>
                  <FormControl.Label>Microsoft Entra テナント ID</FormControl.Label>
                  <TextField
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    placeholder="00000000-0000-0000-0000-000000000000"
                    disabled={integrated}
                  />
                </FormControl>
              </Form>

              {/* 連携スイッチ */}
              <Switch checked={integrated} disabled={!tenantId.trim() && !integrated} onChange={handleSwitchChange}>
                連携する
              </Switch>
            </div>

            {/* 連携解除ダイアログ */}
            <DisableTeamsDialog
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
const DisableTeamsDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <ContentHeader>
          <ContentHeaderTitle>Microsoft Teams連携を解除しますか？</ContentHeaderTitle>
        </ContentHeader>
      </DialogHeader>
      <DialogBody>
        <Text variant="body.medium">Teams連携を解除すると、Microsoft Teamsからの通知を受け取れなくなります。</Text>
      </DialogBody>
      <DialogFooter>
        <ButtonGroup>
          <Button variant="plain" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={onConfirm}>解除する</Button>
        </ButtonGroup>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
