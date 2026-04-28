import { LfArrowUpRightFromSquare, LfFilter, LfQuestionCircle } from "@legalforce/aegis-icons";
import { Box } from "@legalforce/aegis-illustrations/react";
import {
  Button,
  Checkbox,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Divider,
  EmptyState,
  FormControl,
  Icon,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Radio,
  RadioGroup,
  RangeDatePicker,
  Search,
  Select,
  Switch,
  Text,
  TextField,
  Toolbar,
  ToolbarSpacer,
} from "@legalforce/aegis-react";
import { useId, useState } from "react";
import { LocSidebarLayout } from "../_shared";
import { ManagementConsoleNavList } from "./_shared/ManagementConsoleNavList";

// ページサイズオプション
const pageSizeOptions = [
  { value: "50", label: "50件" },
  { value: "100", label: "100件" },
  { value: "200", label: "200件" },
];

// 出力対象オプション
const outputTargetOptions = [
  { value: "case", label: "案件管理" },
  { value: "contract", label: "契約管理" },
  { value: "sign", label: "電子契約" },
  { value: "review", label: "レビュー" },
];

/** 監査ログページ。ユーザーの認証・操作履歴を作成・ダウンロードする。 */
export const ManagementConsoleAuditLogs = () => {
  const exportSwitchId = useId();
  const [exportAllowed, setExportAllowed] = useState(true);
  const [pageSize, setPageSize] = useState("50");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [logType, setLogType] = useState("operation");
  const [allTargets, setAllTargets] = useState(true);
  const [outputTarget, setOutputTarget] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState("");

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <ManagementConsoleNavList activePage="audit-logs" />

        <PageLayoutContent align="start" maxWidth="max">
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>監査ログ</ContentHeaderTitle>
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
              {/* リードテキスト + エクスポート許可 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "var(--aegis-space-large)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xSmall)",
                  }}
                >
                  <Text as="p" variant="body.medium" whiteSpace="pre-wrap">
                    {
                      "監査ログはユーザの認証、操作履歴を確認することができます。\n対象期間やユーザを指定して監査ログを作成後、データをダウンロードして確認してください。\nログの生成には操作から時間がかかります。直前の操作はログに出力されない可能性があります。"
                    }
                  </Text>
                  <div>
                    <Link
                      href="#"
                      leading={LfQuestionCircle}
                      trailing={LfArrowUpRightFromSquare}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      監査ログについて
                    </Link>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-xSmall)",
                    flexShrink: 0,
                  }}
                >
                  <Switch
                    id={exportSwitchId}
                    checked={exportAllowed}
                    onChange={(e) => setExportAllowed(e.target.checked)}
                  />
                  <label htmlFor={exportSwitchId}>
                    <Text variant="label.medium">エクスポートを許可</Text>
                  </label>
                </div>
              </div>

              <Divider />

              {/* 監査ログを作成 */}
              <div>
                <Button variant="solid" onClick={() => setCreateDialogOpen(true)}>
                  監査ログを作成
                </Button>
              </div>

              {/* ツールバー */}
              <Toolbar>
                <Select options={pageSizeOptions} value={pageSize} onChange={(value) => setPageSize(value ?? "50")} />
                <ToolbarSpacer />
                <Button
                  variant="plain"
                  leading={
                    <Icon>
                      <LfFilter />
                    </Icon>
                  }
                >
                  フィルター
                </Button>
              </Toolbar>

              {/* 履歴がない場合の空表示 */}
              <EmptyState title="監査ログの作成履歴がありません。" visual={<Box />} />
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
      {/* 監査ログ エクスポート ダイアログ */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent width="xLarge">
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>監査ログ エクスポート</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
              <Text as="p" variant="body.medium">
                作成されたエクスポートデータは一覧表からダウンロードできます。
                <br />
                ダウンロード期限は作成から14日間です。
              </Text>

              <FormControl>
                <FormControl.Label>ログ種別</FormControl.Label>
                <RadioGroup value={logType} onChange={(value) => setLogType(value ?? "operation")}>
                  <Radio value="auth">認証ログ（ログインやパスワードの設定など）</Radio>
                  <Radio value="operation">操作ログ（作成/変更/削除などの操作）</Radio>
                </RadioGroup>
              </FormControl>

              <FormControl required>
                <FormControl.Label>件名</FormControl.Label>
                <TextField defaultValue="AuditLog_2026-04-17_1801" />
              </FormControl>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium">出力対象</Text>
                <Checkbox checked={allTargets} onChange={(e) => setAllTargets(e.target.checked)}>
                  すべて
                </Checkbox>
                <Select
                  options={outputTargetOptions}
                  value={outputTarget}
                  onChange={setOutputTarget}
                  placeholder="選択してください"
                  disabled={allTargets}
                />
              </div>

              <FormControl required>
                <FormControl.Label>対象期間</FormControl.Label>
                <RangeDatePicker size="medium" aria-label="対象期間" />
              </FormControl>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium">対象ユーザー</Text>
                <Search
                  placeholder="キーワードで検索"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="subtle" onClick={() => setCreateDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="solid" onClick={() => setCreateDialogOpen(false)}>
              CSVを作成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LocSidebarLayout>
  );
};
