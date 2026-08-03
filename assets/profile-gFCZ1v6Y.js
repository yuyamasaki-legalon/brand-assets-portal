var e=`import { LfArrowUpRightFromSquare, LfInformationCircle, LfSend } from "@legalforce/aegis-icons";
import {
  Avatar,
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
  Divider,
  Form,
  FormControl,
  Icon,
  Link,
  NavList,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Select,
  snackbar,
  Tag,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { type FormEvent, useId, useState } from "react";
import { LocSidebarLayout } from "../_shared";
import {
  LANGUAGE_OPTIONS,
  MOCK_LOCALE_SETTINGS,
  MOCK_USER_PROFILE,
  TIMEZONE_OPTIONS,
} from "./mock/personalSettingData";

const SSO_EMAIL_CHANGE_WARNING =
  "このアカウントは SSO 対象です。LegalOn 側でメールアドレスを変更したあと、IdP 側でもメールアドレス変更が必要です。IdP 側を更新しない場合、次回ログイン時に不整合が発生する可能性があります。";

const EmailChangeDialog = ({
  open,
  onOpenChange,
  currentEmail,
  mustUseSsoToLogin = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
  mustUseSsoToLogin?: boolean;
}) => {
  const formId = \`\${useId()}-email-change-form\`;
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isValidEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(newEmail);
  const canSubmit = isValidEmail && newEmail !== currentEmail && !submitting;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitErrorMessage(null);
    window.setTimeout(() => {
      setSubmitting(false);
      snackbar.show({
        message: "入力されたメールアドレス宛に確認メールを送信しました。メール内のリンクから変更を完了してください。",
      });
      onOpenChange(false);
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width="medium">
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>メールアドレス変更</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
            {mustUseSsoToLogin ? (
              <Banner color="warning" closeButton={false}>
                <Text whiteSpace="pre-wrap">{SSO_EMAIL_CHANGE_WARNING}</Text>
              </Banner>
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
              <Text variant="label.medium.bold">現在のメールアドレス</Text>
              <Text>{currentEmail}</Text>
            </div>
            <Form id={formId} onSubmit={handleSubmit}>
              <FormControl required error={newEmail.length > 0 && !isValidEmail}>
                <FormControl.Label>新しいメールアドレス</FormControl.Label>
                <TextField
                  type="email"
                  name="newEmail"
                  aria-label="新しいメールアドレス"
                  placeholder="新しいメールアドレスを入力"
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                  clearable
                />
                {newEmail.length > 0 && !isValidEmail ? (
                  <FormControl.Caption>正しい形式のメールアドレスを入力してください</FormControl.Caption>
                ) : null}
              </FormControl>
              <div style={{ marginBlockStart: "var(--aegis-space-medium)" }}>
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="information"
                  leading={LfInformationCircle}
                  trailing={LfArrowUpRightFromSquare}
                >
                  メールアドレス変更について
                </Link>
              </div>
            </Form>
            {submitErrorMessage !== null ? (
              <Banner color="danger" closeButton={false}>
                <Text>{submitErrorMessage}</Text>
              </Banner>
            ) : null}
          </div>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button variant="solid" type="submit" form={formId} disabled={!canSubmit} loading={submitting}>
              保存
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EmailChangingStatus = ({ currentEmail, pendingEmail }: { currentEmail: string; pendingEmail?: string }) => {
  if (pendingEmail === undefined) {
    return <Text>{currentEmail}</Text>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xxSmall)" }}>
        <Text>{pendingEmail}</Text>
        <Tag variant="fill" size="small">
          変更中
        </Tag>
      </div>
      <Banner color="warning" closeButton={false}>
        <Text>{\`送信したメールで認証されるまで、旧メールアドレス(\${currentEmail})が使用されます。認証は72時間以内に行なってください。\`}</Text>
      </Banner>
    </div>
  );
};

// BasicInfo Component
const BasicInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(MOCK_USER_PROFILE.name);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const pendingEmail = "taro.yamada@example.jp";

  return (
    <div>
      {!isEditing ? (
        <>
          <ContentHeader
            trailing={
              <Button variant="subtle" onClick={() => setIsEditing(true)}>
                編集
              </Button>
            }
          >
            <ContentHeaderTitle>基本情報</ContentHeaderTitle>
          </ContentHeader>

          <div style={{ marginTop: "var(--aegis-space-large)" }}>
            <Avatar size="large" name={MOCK_USER_PROFILE.name} src={MOCK_USER_PROFILE.profileImageUrl || undefined} />
          </div>

          <div style={{ marginTop: "var(--aegis-space-medium)" }}>
            <Text variant="label.medium.bold" color="subtle">
              ユーザー名
            </Text>
            <Text>{MOCK_USER_PROFILE.name}</Text>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-xxSmall)",
              marginTop: "var(--aegis-space-x2Large)",
            }}
          >
            <ContentHeader
              size="xSmall"
              trailing={<Button onClick={() => setEmailDialogOpen(true)}>メールアドレス変更</Button>}
            >
              <ContentHeaderTitle>メールアドレス</ContentHeaderTitle>
            </ContentHeader>
            <EmailChangingStatus currentEmail={MOCK_USER_PROFILE.email} pendingEmail={pendingEmail} />
          </div>

          <EmailChangeDialog
            open={emailDialogOpen}
            onOpenChange={setEmailDialogOpen}
            currentEmail={MOCK_USER_PROFILE.email}
          />

          <ContentHeader
            size="xSmall"
            trailing={
              <Button
                leading={<Icon source={LfSend} />}
                onClick={() => snackbar.show({ message: "パスワードリセットメールを送信しました" })}
              >
                再設定用のメールを送信
              </Button>
            }
            style={{ marginTop: "var(--aegis-space-x2Large)" }}
          >
            <ContentHeaderTitle>パスワード</ContentHeaderTitle>
          </ContentHeader>
        </>
      ) : (
        <>
          <ContentHeader>
            <ContentHeaderTitle>基本情報</ContentHeaderTitle>
          </ContentHeader>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-medium)",
              marginTop: "var(--aegis-space-large)",
            }}
          >
            <div style={{ marginTop: "var(--aegis-space-medium)" }}>
              <Avatar size="large" name={MOCK_USER_PROFILE.name} src={MOCK_USER_PROFILE.profileImageUrl || undefined} />
            </div>

            <FormControl required>
              <FormControl.Label>ユーザー名</FormControl.Label>
              <TextField value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormControl.Label>プロフィール画像</FormControl.Label>
              <Button variant="subtle">画像を選択</Button>
              <FormControl.Caption>JPEG、PNG、GIF形式、最大5MB</FormControl.Caption>
            </FormControl>

            <div
              style={{
                display: "flex",
                gap: "var(--aegis-space-small)",
              }}
            >
              <Button
                onClick={() => {
                  snackbar.show({ message: "保存しました" });
                  setIsEditing(false);
                }}
              >
                保存
              </Button>
              <Button
                variant="subtle"
                onClick={() => {
                  setName(MOCK_USER_PROFILE.name);
                  setIsEditing(false);
                }}
              >
                キャンセル
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// LocaleSettings Component
const LocaleSettings = () => {
  const [language, setLanguage] = useState(MOCK_LOCALE_SETTINGS.language);
  const [timezone, setTimezone] = useState(MOCK_LOCALE_SETTINGS.timezone);

  const currentDateTime = new Date().toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <ContentHeader>
        <ContentHeaderTitle>言語・地域</ContentHeaderTitle>
      </ContentHeader>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-medium)",
          marginTop: "var(--aegis-space-large)",
        }}
      >
        <FormControl>
          <FormControl.Label>表示言語</FormControl.Label>
          <Select
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={(value) => setLanguage(value as "ja-JP" | "en-US")}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>タイムゾーン</FormControl.Label>
          <Select
            options={TIMEZONE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label.replace(/^(.+?)\\s+\\((.+?)\\)$/, "($2) $1"),
            }))}
            value={timezone}
            onChange={(value) => setTimezone(value)}
          />
        </FormControl>

        <Banner color="information" closeButton={false}>
          <Text variant="body.small">日付や時刻は以下のように表示されます。</Text>
          <Text variant="body.small" style={{ marginTop: "var(--aegis-space-xSmall)" }}>
            {currentDateTime}
          </Text>
        </Banner>
      </div>
    </div>
  );
};

// OrganizationInfo Component
const OrganizationInfo = () => {
  return (
    <div>
      <ContentHeader>
        <ContentHeaderTitle>組織情報</ContentHeaderTitle>
      </ContentHeader>

      <div style={{ marginTop: "var(--aegis-space-large)" }}>
        <div style={{ marginBottom: "var(--aegis-space-large)" }}>
          <Text variant="label.medium.bold" color="subtle">
            管理者権限
          </Text>
          <div style={{ marginTop: "var(--aegis-space-xSmall)" }}>
            {MOCK_USER_PROFILE.roles.map((role, index) => (
              <Text key={role}>
                {role}
                {index < MOCK_USER_PROFILE.roles.length - 1 && "、"}
              </Text>
            ))}
          </div>
        </div>

        <div>
          <Text variant="label.medium.bold" color="subtle">
            所属ユーザーグループ
          </Text>
          <div style={{ marginTop: "var(--aegis-space-xSmall)" }}>
            {MOCK_USER_PROFILE.userGroupNames.map((group, index) => (
              <Text key={group}>
                {group}
                {index < MOCK_USER_PROFILE.userGroupNames.length - 1 && "、"}
              </Text>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Shared Navigation Component
const SettingsNavigation = () => {
  return (
    <NavList>
      <NavList.Group title="一般">
        <NavList.Item href="/template/personal-setting/profile" aria-current="page">
          プロフィール
        </NavList.Item>
      </NavList.Group>

      <NavList.Group title="マターマネジメント">
        <NavList.Item href="/template/personal-setting/legal-notification">通知</NavList.Item>
        <NavList.Item href="/template/personal-setting/legalscape">Legalscape連携</NavList.Item>
      </NavList.Group>

      <NavList.Group title="コントラクトマネジメント">
        <NavList.Item href="/template/personal-setting/contract-notification">通知</NavList.Item>
      </NavList.Group>
    </NavList>
  );
};

// Main Profile Page Component
export const ProfilePage = () => {
  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        {/* Left Sidebar Navigation */}
        <PageLayoutPane position="start" open={true}>
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>個人設定</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <SettingsNavigation />
          </PageLayoutBody>
        </PageLayoutPane>

        {/* Main Content */}
        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>あなたのプロフィール</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-x4Large)",
                maxWidth: "var(--aegis-layout-width-medium)",
              }}
            >
              <BasicInfo />
              <Divider />
              <LocaleSettings />
              <Divider />
              <OrganizationInfo />
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};
`;export{e as default};