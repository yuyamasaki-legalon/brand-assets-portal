import { LfCopy } from "@legalforce/aegis-icons";
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
  Divider,
  Form,
  FormControl,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Switch,
  Text,
  Textarea,
  TextField,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { LocSidebarLayout } from "../_shared";
import { ManagementConsoleNavList } from "./_shared/ManagementConsoleNavList";

// Mock SSO data
const MOCK_SSO_CONFIG = {
  idpEndpointUrl: "https://app.loc.example.com/saml/sso",
  idpEntityId: "https://app.loc.example.com/saml/metadata",
  endpointUrl: "",
  certificate: "",
  domains: [] as string[],
  isActivated: false,
};

/** SSO設定ページ。 */
export const ManagementConsoleSso = () => {
  const [isActivated, setIsActivated] = useState(MOCK_SSO_CONFIG.isActivated);
  const [endpointUrl, setEndpointUrl] = useState(MOCK_SSO_CONFIG.endpointUrl);
  const [certificate, setCertificate] = useState(MOCK_SSO_CONFIG.certificate);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <ManagementConsoleNavList activePage="sso" />

        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <ContentHeader
                trailing={
                  <div style={{ width: "fit-content" }}>
                    <Link href="#" onClick={(e) => e.preventDefault()}>
                      <Text variant="body.small">SSO（シングルサインオン）を設定する</Text>
                    </Link>
                  </div>
                }
              >
                <ContentHeaderTitle>SSO</ContentHeaderTitle>
              </ContentHeader>
              <Text variant="caption.medium">
                ユーザーのログイン方法をSAML2.0を利用したSSO（シングルサインオン）に変更できます
              </Text>
            </div>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-x4Large)",
              }}
            >
              {/* IdPへの登録情報 */}
              <div>
                <ContentHeader>
                  <ContentHeaderTitle>IDプロバイダー（IdP）への登録情報</ContentHeaderTitle>
                  <ContentHeader.Description>
                    以下の情報をコピーし、各プロバイダーの設定画面に登録してください
                  </ContentHeader.Description>
                </ContentHeader>

                <InformationContainer title="エンドポイントURL" url={MOCK_SSO_CONFIG.idpEndpointUrl} />
                <InformationContainer title="エンティティID" url={MOCK_SSO_CONFIG.idpEntityId} />
              </div>

              <Divider />

              {/* 情報の登録 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <ContentHeader size="small">
                  <ContentHeaderTitle>情報の登録</ContentHeaderTitle>
                </ContentHeader>
                <Form>
                  <FormControl>
                    <FormControl.Label>メールドメイン</FormControl.Label>
                    <TextField placeholder="メールドメインを入力" />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>IDプロバイダーのエンドポイントURL（HTTP-Redirect）</FormControl.Label>
                    <TextField
                      value={endpointUrl}
                      onChange={(e) => setEndpointUrl(e.target.value)}
                      placeholder="URLを入力"
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>IDプロバイダーが署名に使用する公開鍵の証明書 （X.509 証明書）</FormControl.Label>
                    <Textarea
                      value={certificate}
                      onChange={(e) => setCertificate(e.target.value)}
                      placeholder="公開鍵の証明書を入力"
                    />
                  </FormControl>
                </Form>
                <Button minWidth="wide" size="large" disabled={!endpointUrl || !certificate}>
                  登録
                </Button>
              </div>

              <Divider />

              {/* SSO有効化 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <ContentHeader size="small">
                  <ContentHeaderTitle>SSOを有効化</ContentHeaderTitle>
                </ContentHeader>
                <Switch
                  checked={isActivated}
                  color="information"
                  disabled={!endpointUrl || !certificate}
                  onChange={() => setConfirmDialogOpen(true)}
                >
                  SSO（シングルサインオン）を利用する
                </Switch>
              </div>
            </div>

            {/* 確認ダイアログ */}
            <SsoConfirmDialog
              isActivated={isActivated}
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
              onConfirm={() => {
                setIsActivated(!isActivated);
                setConfirmDialogOpen(false);
              }}
            />
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

// IdP情報表示コンポーネント
const InformationContainer = ({ title, url }: { title: string; url: string }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--aegis-space-xxSmall)",
      marginBlock: "var(--aegis-space-xLarge)",
    }}
  >
    <Text variant="body.medium.bold">{title}</Text>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-small)",
        padding: "var(--aegis-space-small)",
        backgroundColor: "var(--aegis-color-background-neutral-subtler)",
      }}
    >
      <Text color="subtle">{url}</Text>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          leading={LfCopy}
          variant="subtle"
          aria-label={`${title}をコピー`}
          onClick={() => {
            navigator.clipboard.writeText(url);
          }}
        >
          コピー
        </Button>
      </div>
    </div>
  </div>
);

// SSO有効/無効確認ダイアログ
const SsoConfirmDialog = ({
  isActivated,
  open,
  onOpenChange,
  onConfirm,
}: {
  isActivated: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <ContentHeader>
          <ContentHeaderTitle>{isActivated ? "SSOを無効にしますか？" : "SSOを有効にしますか？"}</ContentHeaderTitle>
        </ContentHeader>
      </DialogHeader>
      <DialogBody>
        {isActivated ? (
          <Text variant="body.medium">
            SSOを無効にすると登録されている全ユーザーのログイン方法がメールアドレスとパスワードに変更されます。
          </Text>
        ) : (
          <Text variant="body.medium">
            ログイン方法の変更は次回のログイン時に適用されます。
            <br />
            登録情報が間違っていた場合、一度ログアウトするとテナントに再ログインできなくなります。別のブラウザでテストログインするか、同じブラウザのシークレットモードでログイン可能かテストしたあとログアウトしてください。
          </Text>
        )}
      </DialogBody>
      <DialogFooter>
        <ButtonGroup>
          <Button variant="plain" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={onConfirm}>{isActivated ? "無効化" : "有効化"}</Button>
        </ButtonGroup>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
