import { LfTrash } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  ContentHeaderTitle,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FormControl,
  Icon,
  IconButton,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Select,
  Switch,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { SettingsNavList } from "../_shared";
import sharedStyles from "../_shared/settings.module.css";
import { DealOnLayout } from "../layout";
import { useEeasyEdit } from "./hooks/useEeasyEdit";
import { useMfaSettings } from "./hooks/useMfaSettings";
import { useProfileEdit } from "./hooks/useProfileEdit";
import styles from "./index.module.css";
import type { MfaMethodType } from "./utils";
import { MFA_TYPE_OPTIONS } from "./utils";

// =============================================================================
// Page component
// =============================================================================

export default function DealOnSettingsProfilePage() {
  const profileEdit = useProfileEdit();
  const eeasyEdit = useEeasyEdit();
  const mfa = useMfaSettings();

  // Auto-reply state (default OFF)
  const [selaAutoReplyEnabled, setSelaAutoReplyEnabled] = useState(false);

  return (
    <DealOnLayout>
      <PageLayoutContent scrollBehavior="outside">
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>個人設定</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div className={sharedStyles.settingsLayout}>
            {/* Sidebar */}
            <aside className={sharedStyles.sidebar}>
              <SettingsNavList />
            </aside>

            {/* Content */}
            <div className={styles.content}>
              {/* Card 1: プロフィール */}
              <Card variant="outline" size="medium">
                <CardHeader
                  trailing={
                    <Button variant="subtle" size="small" onClick={() => profileEdit.setIsProfileEditing(true)}>
                      設定を変更
                    </Button>
                  }
                >
                  <Text variant="title.xSmall">プロフィール</Text>
                </CardHeader>
                <CardBody>
                  <DescriptionList size="large">
                    <DescriptionListItem orientation="vertical">
                      <DescriptionListTerm width="xLarge">氏名</DescriptionListTerm>
                      <DescriptionListDetail>
                        <Text variant="body.medium">{profileEdit.name}</Text>
                      </DescriptionListDetail>
                    </DescriptionListItem>
                    <DescriptionListItem orientation="vertical">
                      <DescriptionListTerm width="xLarge">メールアドレス</DescriptionListTerm>
                      <DescriptionListDetail>
                        <Text variant="body.medium" color="subtle">
                          {profileEdit.email}
                        </Text>
                      </DescriptionListDetail>
                    </DescriptionListItem>
                  </DescriptionList>
                </CardBody>
              </Card>

              {/* Card 2: 自動応答設定 */}
              <Card variant="outline" size="medium">
                <CardHeader
                  trailing={
                    <Switch
                      size="medium"
                      checked={selaAutoReplyEnabled}
                      onChange={(e) => setSelaAutoReplyEnabled(e.target.checked)}
                    >
                      {selaAutoReplyEnabled ? "ON" : "OFF"}
                    </Switch>
                  }
                >
                  <Text variant="title.xSmall">自動応答設定</Text>
                </CardHeader>
                <CardBody>
                  <Text variant="body.small" color="subtle">
                    有効にすると、Selaがあなたの受信メールに対して自動で返信を行います。デフォルトはOFFです。
                  </Text>
                </CardBody>
              </Card>

              {/* Card 3: 外部連携 */}
              <Card variant="outline" size="medium">
                <CardHeader
                  trailing={
                    <Button variant="subtle" size="small" onClick={() => eeasyEdit.setIsEeasyEditing(true)}>
                      設定を変更
                    </Button>
                  }
                >
                  <Text variant="title.xSmall">外部連携</Text>
                </CardHeader>
                <CardBody>
                  <DescriptionList size="large">
                    <DescriptionListItem orientation="vertical">
                      <DescriptionListTerm width="xLarge">eeasy連携URL</DescriptionListTerm>
                      <DescriptionListDetail>
                        <Text variant="body.medium">{eeasyEdit.eeasyUrl || "—"}</Text>
                      </DescriptionListDetail>
                    </DescriptionListItem>
                  </DescriptionList>
                </CardBody>
              </Card>

              {/* Card 4: MFA設定 */}
              <Card variant="outline" size="medium">
                <CardHeader
                  trailing={
                    <Button variant="subtle" size="small" onClick={() => mfa.setIsMfaEditing(true)}>
                      設定を変更
                    </Button>
                  }
                >
                  <Text variant="title.xSmall">MFA設定</Text>
                </CardHeader>
                <CardBody>
                  <DescriptionList size="large">
                    <DescriptionListItem orientation="vertical">
                      <DescriptionListTerm width="xLarge">MFA</DescriptionListTerm>
                      <DescriptionListDetail>
                        <Text variant="body.medium">{mfa.mfaEnabled ? "ON" : "OFF"}</Text>
                      </DescriptionListDetail>
                    </DescriptionListItem>
                    <DescriptionListItem orientation="vertical">
                      <DescriptionListTerm width="xLarge">登録済み方式</DescriptionListTerm>
                      <DescriptionListDetail>
                        {mfa.mfaMethods.length === 0 ? (
                          <Text variant="body.medium" color="subtle">
                            —
                          </Text>
                        ) : (
                          <Text variant="body.medium">{mfa.mfaMethods.map((m) => m.label).join("、")}</Text>
                        )}
                      </DescriptionListDetail>
                    </DescriptionListItem>
                  </DescriptionList>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Profile edit dialog */}
          <Dialog
            open={profileEdit.isProfileEditing}
            onOpenChange={(open) => !open && profileEdit.handleCancelProfile()}
          >
            <DialogContent>
              <DialogHeader>
                <ContentHeader>
                  <ContentHeaderTitle>プロフィールを編集</ContentHeaderTitle>
                </ContentHeader>
              </DialogHeader>
              <DialogBody>
                <div className={sharedStyles.formStack}>
                  <FormControl>
                    <FormControl.Label>氏名</FormControl.Label>
                    <TextField value={profileEdit.name} onChange={(e) => profileEdit.setName(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>メールアドレス</FormControl.Label>
                    <Text variant="body.medium" color="subtle">
                      {profileEdit.email}
                    </Text>
                  </FormControl>
                </div>
              </DialogBody>
              <DialogFooter>
                <ButtonGroup>
                  <Button variant="plain" onClick={profileEdit.handleCancelProfile}>
                    キャンセル
                  </Button>
                  <Button variant="solid" onClick={profileEdit.handleSaveProfile}>
                    保存
                  </Button>
                </ButtonGroup>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Eeasy edit dialog */}
          <Dialog open={eeasyEdit.isEeasyEditing} onOpenChange={(open) => !open && eeasyEdit.handleCancelEeasy()}>
            <DialogContent>
              <DialogHeader>
                <ContentHeader>
                  <ContentHeaderTitle>外部連携を編集</ContentHeaderTitle>
                </ContentHeader>
              </DialogHeader>
              <DialogBody>
                <FormControl>
                  <FormControl.Label>eeasy連携URL</FormControl.Label>
                  <TextField
                    value={eeasyEdit.eeasyUrl}
                    onChange={(e) => eeasyEdit.setEeasyUrl(e.target.value)}
                    placeholder="https://eeasy.jp/s/..."
                  />
                </FormControl>
              </DialogBody>
              <DialogFooter>
                <ButtonGroup>
                  <Button variant="plain" onClick={eeasyEdit.handleCancelEeasy}>
                    キャンセル
                  </Button>
                  <Button variant="solid" onClick={eeasyEdit.handleSaveEeasy}>
                    保存
                  </Button>
                </ButtonGroup>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* MFA edit dialog */}
          <Dialog open={mfa.isMfaEditing} onOpenChange={(open) => !open && mfa.handleCancelMfa()}>
            <DialogContent width="medium">
              <DialogHeader>
                <ContentHeader>
                  <ContentHeaderTitle>MFA設定を編集</ContentHeaderTitle>
                </ContentHeader>
              </DialogHeader>
              <DialogBody>
                <div className={sharedStyles.formStack}>
                  <FormControl>
                    <FormControl.Label>MFA</FormControl.Label>
                    <Switch
                      size="medium"
                      checked={mfa.mfaEnabled}
                      onChange={(e) => mfa.setMfaEnabled(e.target.checked)}
                    >
                      {mfa.mfaEnabled ? "ON" : "OFF"}
                    </Switch>
                  </FormControl>

                  <div className={styles.mfaMethodRow}>
                    <FormControl>
                      <FormControl.Label>MFA方式（SMS/メール/QRコード）</FormControl.Label>
                      <Select
                        value={mfa.newMfaMethodType}
                        onChange={(v) => mfa.setNewMfaMethodType((v || "sms") as MfaMethodType)}
                        options={MFA_TYPE_OPTIONS}
                        placeholder="方式を選択"
                        width="auto"
                      />
                    </FormControl>
                    <Button variant="plain" size="small" onClick={mfa.handleAddMfaMethod}>
                      MFA方式を追加
                    </Button>
                  </div>

                  {mfa.mfaMethods.length > 0 && (
                    <div>
                      <Text variant="body.small" color="subtle" className={styles.mfaMethodListLabel}>
                        登録済み方式
                      </Text>
                      <ul className={styles.mfaMethodList}>
                        {mfa.mfaMethods.map((m) => (
                          <li key={m.id} className={styles.mfaMethodItem}>
                            <Text variant="body.medium">{m.label}</Text>
                            <Tooltip title={`${m.label}を削除`}>
                              <IconButton
                                variant="plain"
                                size="xSmall"
                                aria-label={`${m.label}を削除`}
                                onClick={() => mfa.handleMfaDeleteClick(m)}
                              >
                                <Icon>
                                  <LfTrash />
                                </Icon>
                              </IconButton>
                            </Tooltip>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </DialogBody>
              <DialogFooter>
                <ButtonGroup>
                  <Button variant="plain" onClick={mfa.handleCancelMfa}>
                    キャンセル
                  </Button>
                  <Button variant="solid" onClick={mfa.handleSaveMfa}>
                    保存
                  </Button>
                </ButtonGroup>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* MFA delete confirmation dialog */}
          <Dialog open={mfa.mfaDeleteDialogOpen} onOpenChange={(open) => !open && mfa.handleMfaDeleteCancel()}>
            <DialogContent width="small">
              <DialogHeader>
                <ContentHeader>
                  <ContentHeaderTitle>MFA方式を削除</ContentHeaderTitle>
                </ContentHeader>
              </DialogHeader>
              <DialogBody>
                <Text variant="body.medium">
                  {mfa.mfaMethodToDelete && <>「{mfa.mfaMethodToDelete.label}」を削除してもよろしいですか？</>}
                </Text>
              </DialogBody>
              <DialogFooter>
                <ButtonGroup>
                  <Button variant="plain" onClick={mfa.handleMfaDeleteCancel}>
                    キャンセル
                  </Button>
                  <Button variant="solid" color="danger" onClick={mfa.handleMfaDeleteConfirm}>
                    削除
                  </Button>
                </ButtonGroup>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageLayoutBody>
      </PageLayoutContent>
    </DealOnLayout>
  );
}
