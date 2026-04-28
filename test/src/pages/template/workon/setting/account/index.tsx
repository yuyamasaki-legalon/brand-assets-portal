import {
  LfAngleLeft,
  LfApps,
  LfArrowRotateRight,
  LfCheckCircle,
  LfEye,
  LfHome,
  LfList,
  LfPen,
  LfSend,
  LfSetting,
  LfUserGroup,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  Avatar,
  Banner,
  Button,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FormControl,
  Icon,
  IconButton,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarNavigationSeparator,
  SidebarProvider,
  Table,
  TableContainer,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";

// モックデータ
type AccountInfo = {
  hueronId: string;
  phoneNumber: string;
  email: string;
  twoFactorEnabled: boolean;
};

const mockAccountInfo: AccountInfo = {
  hueronId: "1234567890",
  phoneNumber: "--",
  email: "taro.yamada@example.co.jp",
  twoFactorEnabled: false,
};

// テーブル行コンポーネント
function AccountSettingRow({ label, value, onClick }: { label: string; value?: string; onClick?: () => void }) {
  return (
    <Table.Row hover={false}>
      <Table.Cell as="td">
        <Text variant="component.medium.bold">{label}</Text>
      </Table.Cell>
      <Table.Cell as="td">
        <Text variant="body.medium">{value ?? ""}</Text>
      </Table.Cell>
      <Table.Cell textAlign="end" as="td">
        {onClick ? (
          <Button
            variant="subtle"
            size="small"
            color="neutral"
            leading={
              <Icon size="small">
                <LfPen />
              </Icon>
            }
            onClick={onClick}
          >
            <Text variant="component.medium.bold">変更</Text>
          </Button>
        ) : null}
      </Table.Cell>
    </Table.Row>
  );
}

// 電話番号変更ダイアログ
function PhoneDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setIsSendingCode(false);
  };

  const handleSendCode = () => {
    setOpen(false);
    setIsSendingCode(false);
  };

  const handleSendRequestCode = () => {
    setIsSendingCode(true);
  };

  if (isSendingCode) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent width="large">
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>電話番号を変更</ContentHeaderTitle>
              <ContentHeaderDescription>090-****-**78 に認証コードを送信しました。</ContentHeaderDescription>
              <ContentHeaderDescription>
                <Link
                  underline={false}
                  href="#"
                  leading={
                    <Icon>
                      <LfArrowRotateRight />
                    </Icon>
                  }
                  onClick={(e) => e.preventDefault()}
                >
                  再度送信
                </Link>
              </ContentHeaderDescription>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <FormControl>
              <FormControl.Label>認証コード</FormControl.Label>
              <TextField type="number" placeholder="000000" />
            </FormControl>
            <div style={{ marginTop: "var(--aegis-space-small)" }}>
              <Banner color="danger" size="small" closeButton={false}>
                認証コードが正しくありません。
              </Banner>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button width="full" onClick={handleSendCode}>
              送信
            </Button>
            <Button variant="plain" width="full" onClick={handleClose}>
              キャンセル
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent width="large">
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>電話番号を変更</ContentHeaderTitle>
            <ContentHeaderDescription>
              新しい電話番号を入力してください。入力した電話番号に認証コードを送信します。
            </ContentHeaderDescription>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <FormControl>
            <FormControl.Label>電話番号</FormControl.Label>
            <TextField type="tel" placeholder="090-1234-5678" />
          </FormControl>
          <div style={{ marginTop: "var(--aegis-space-small)" }}>
            <Banner color="danger" size="small" closeButton={false}>
              電話番号の形式が正しくありません。
            </Banner>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button width="full" onClick={handleSendRequestCode}>
            認証コードを送信
          </Button>
          <Button variant="plain" width="full" onClick={handleClose}>
            キャンセル
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// メールアドレス変更ダイアログ
function EmailDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setIsSendingCode(false);
  };

  const handleSendCode = () => {
    setOpen(false);
    setIsSendingCode(false);
  };

  const handleSendRequestCode = () => {
    setIsSendingCode(true);
  };

  if (isSendingCode) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent width="large">
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>メールアドレスを変更</ContentHeaderTitle>
              <ContentHeaderDescription>abc********@gmail.com に認証コードを送信しました。</ContentHeaderDescription>
              <ContentHeaderDescription>
                <Link
                  underline={false}
                  href="#"
                  leading={
                    <Icon>
                      <LfArrowRotateRight />
                    </Icon>
                  }
                  onClick={(e) => e.preventDefault()}
                >
                  再度送信
                </Link>
              </ContentHeaderDescription>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <FormControl>
              <FormControl.Label>認証コード</FormControl.Label>
              <TextField type="text" inputMode="numeric" pattern="[0-9]*" placeholder="000000" />
            </FormControl>
            <div style={{ marginTop: "var(--aegis-space-small)" }}>
              <Banner color="danger" size="small" closeButton={false}>
                認証コードが正しくありません。
              </Banner>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button width="full" onClick={handleSendCode}>
              送信
            </Button>
            <Button variant="plain" width="full" onClick={handleClose}>
              キャンセル
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent width="large">
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>メールアドレスを変更</ContentHeaderTitle>
            <ContentHeaderDescription>
              新しいメールアドレスを入力してください。入力したメールアドレスに認証コードを送信します。
            </ContentHeaderDescription>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <FormControl>
            <FormControl.Label>メールアドレス</FormControl.Label>
            <TextField type="text" placeholder="example@example.com" />
          </FormControl>
          <div style={{ marginTop: "var(--aegis-space-small)" }}>
            <Banner color="danger" size="small" closeButton={false}>
              メールアドレスの形式が正しくありません。
            </Banner>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button width="full" onClick={handleSendRequestCode}>
            認証コードを送信
          </Button>
          <Button variant="plain" width="full" onClick={handleClose}>
            キャンセル
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// パスワード変更ダイアログ
function PasswordDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePassword = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent width="large">
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>パスワードを変更</ContentHeaderTitle>
            <ContentHeaderDescription>現在のパスワードと新しいパスワードを入力してください。</ContentHeaderDescription>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
            <FormControl>
              <FormControl.Label>現在のパスワード</FormControl.Label>
              <FormControl.Toolbar>
                <Button
                  variant="gutterless"
                  size="small"
                  leading={
                    <Icon size="xSmall">
                      <LfEye />
                    </Icon>
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCurrentPassword(!showCurrentPassword);
                  }}
                >
                  {showCurrentPassword ? "非表示" : "表示"}
                </Button>
              </FormControl.Toolbar>
              <TextField placeholder="パスワード" type={showCurrentPassword ? "text" : "password"} />
            </FormControl>

            <FormControl>
              <FormControl.Label>新しいパスワード</FormControl.Label>
              <FormControl.Toolbar>
                <Button
                  variant="gutterless"
                  size="small"
                  leading={
                    <Icon size="xSmall">
                      <LfEye />
                    </Icon>
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setShowNewPassword(!showNewPassword);
                  }}
                >
                  {showNewPassword ? "非表示" : "表示"}
                </Button>
              </FormControl.Toolbar>
              <TextField placeholder="パスワード" type={showNewPassword ? "text" : "password"} />
            </FormControl>

            <FormControl>
              <FormControl.Label>新しいパスワード（確認）</FormControl.Label>
              <FormControl.Toolbar>
                <Button
                  variant="gutterless"
                  size="small"
                  leading={
                    <Icon size="xSmall">
                      <LfEye />
                    </Icon>
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setShowNewPasswordConfirm(!showNewPasswordConfirm);
                  }}
                >
                  {showNewPasswordConfirm ? "非表示" : "表示"}
                </Button>
              </FormControl.Toolbar>
              <TextField placeholder="パスワード" type={showNewPasswordConfirm ? "text" : "password"} />
            </FormControl>
          </div>
          <div style={{ marginTop: "var(--aegis-space-small)" }}>
            <Banner color="danger" size="small" closeButton={false}>
              パスワードが一致しません。
            </Banner>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button width="full" onClick={handleChangePassword}>
            変更
          </Button>
          <Button variant="plain" width="full" onClick={handleClose}>
            キャンセル
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 2要素認証設定ダイアログ
function TwoFactorAuthDialog({
  open,
  setOpen,
  onChangePhoneNumber,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onChangePhoneNumber: () => void;
}) {
  const [isSendingAuthCode, setIsSendingAuthCode] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setIsSendingAuthCode(false);
  };

  const handleSendAuthCode = () => {
    setIsSendingAuthCode(true);
  };

  const handleChangePhone = () => {
    onChangePhoneNumber();
  };

  const handleSend = () => {
    setIsSendingAuthCode(false);
    setOpen(false);
  };

  if (isSendingAuthCode) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent width="large">
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>2要素認証を設定</ContentHeaderTitle>
              <ContentHeaderDescription>090-****-**78 に認証コードを送信しました。</ContentHeaderDescription>
              <ContentHeaderDescription>
                <Link underline={false} href="#" onClick={(e) => e.preventDefault()}>
                  再度送信
                </Link>
              </ContentHeaderDescription>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <FormControl>
              <FormControl.Label>認証コード</FormControl.Label>
              <TextField type="number" placeholder="000000" />
            </FormControl>
            <div style={{ marginTop: "var(--aegis-space-small)" }}>
              <Banner color="danger" size="small" closeButton={false}>
                認証コードが正しくありません。
              </Banner>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="solid" size="large" width="full" onClick={handleSend}>
              送信
            </Button>
            <Button variant="plain" size="large" width="full" onClick={handleClose}>
              キャンセル
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent width="large">
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>2要素認証を設定</ContentHeaderTitle>
            <ContentHeaderDescription>
              2要素認証を設定すると、ログイン時に電話番号に認証コードが送信されます。
            </ContentHeaderDescription>
            <ContentHeaderDescription>
              <Link href="#" onClick={(e) => e.preventDefault()} underline={false}>
                電話番号を登録
              </Link>
            </ContentHeaderDescription>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <Card variant="outline" size="small">
            <CardHeader
              trailing={
                <Button variant="subtle" color="neutral" size="small" onClick={handleChangePhone}>
                  変更
                </Button>
              }
            >
              <Text variant="body.medium">電話番号</Text>
            </CardHeader>
            <CardBody>
              <Text variant="body.medium">090-1234-5678</Text>
            </CardBody>
          </Card>

          <div style={{ marginTop: "var(--aegis-space-small)" }}>
            <Banner color="danger" size="small" closeButton={false}>
              電話番号が登録されていません。
            </Banner>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="solid" size="large" width="full" onClick={handleSendAuthCode}>
            認証コードを送信
          </Button>
          <Button variant="plain" size="large" width="full" onClick={handleClose}>
            キャンセル
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SettingAccountPage() {
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);

  const handleChangePhoneNumber = () => {
    setTwoFactorDialogOpen(false);
    setPhoneDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Avatar name="WorkOn" />
        </SidebarHeader>
        <SidebarBody>
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "var(--aegis-space-xLarge)",
            }}
          >
            <SidebarNavigation>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfList />
                    </Icon>
                  }
                >
                  TODO
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfHome />
                    </Icon>
                  }
                >
                  ホーム
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfWriting />
                    </Icon>
                  }
                >
                  手続き
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfUserGroup />
                    </Icon>
                  }
                >
                  組織図
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfCheckCircle />
                    </Icon>
                  }
                >
                  承認
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfSend />
                    </Icon>
                  }
                >
                  申請
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationSeparator />
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfApps />
                    </Icon>
                  }
                >
                  アプリ
                </SidebarNavigationLink>
              </SidebarNavigationItem>
            </SidebarNavigation>
            <SidebarNavigation
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--aegis-space-small)",
              }}
            >
              <Tooltip title="設定">
                <IconButton variant="plain" aria-label="設定">
                  <Icon>
                    <LfSetting />
                  </Icon>
                </IconButton>
              </Tooltip>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Avatar name="山田" size="small" color="teal" />
              </div>
            </SidebarNavigation>
          </div>
        </SidebarBody>
      </Sidebar>

      <SidebarInset>
        <PageLayout>
          <PageLayoutContent maxWidth="large" align="center">
            <PageLayoutHeader>
              <ContentHeader
                leading={
                  <Tooltip title="戻る">
                    <IconButton aria-label="戻る" variant="plain">
                      <Icon size="large">
                        <LfAngleLeft />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                }
              >
                <ContentHeaderTitle>アカウント設定</ContentHeaderTitle>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                {/* アカウント情報テーブル */}
                <TableContainer>
                  <Table size="small">
                    <Table.Body>
                      <AccountSettingRow label="Hueron ID" value={mockAccountInfo.hueronId} />
                      <AccountSettingRow
                        label="電話番号"
                        value={mockAccountInfo.phoneNumber}
                        onClick={() => setPhoneDialogOpen(true)}
                      />
                      <AccountSettingRow
                        label="メールアドレス"
                        value={mockAccountInfo.email}
                        onClick={() => setEmailDialogOpen(true)}
                      />
                      <AccountSettingRow
                        label="パスワード"
                        value="＊＊＊＊＊＊＊＊"
                        onClick={() => setPasswordDialogOpen(true)}
                      />
                    </Table.Body>
                  </Table>
                </TableContainer>

                {/* 2要素認証設定カード */}
                <Card variant="outline" size="small">
                  <CardHeader
                    trailing={
                      <Button
                        variant="subtle"
                        size="small"
                        color="neutral"
                        leading={
                          <Icon size="large">
                            <LfSetting />
                          </Icon>
                        }
                        onClick={() => setTwoFactorDialogOpen(true)}
                      >
                        <Text variant="component.medium.bold">設定</Text>
                      </Button>
                    }
                  >
                    <Text variant="component.medium.bold">2要素認証</Text>
                  </CardHeader>
                </Card>
              </div>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>

        {/* ダイアログ */}
        <PhoneDialog open={phoneDialogOpen} setOpen={setPhoneDialogOpen} />
        <EmailDialog open={emailDialogOpen} setOpen={setEmailDialogOpen} />
        <PasswordDialog open={passwordDialogOpen} setOpen={setPasswordDialogOpen} />
        <TwoFactorAuthDialog
          open={twoFactorDialogOpen}
          setOpen={setTwoFactorDialogOpen}
          onChangePhoneNumber={handleChangePhoneNumber}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
