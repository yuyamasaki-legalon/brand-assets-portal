import { LfArrowRightFromLine, LfFile, LfFileEye, LfList, LfSend, LfSetting, LfUser } from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Banner,
  Button,
  Checkbox,
  ContentHeader,
  Divider,
  Form,
  FormControl,
  Header,
  Icon,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Select,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarProvider,
  SidebarTrigger,
  Switch,
  TagPicker,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// =============================================================================
// Mock Data
// =============================================================================

const scenarioOptions = [
  { value: "sales", label: "法人営業（SaaS提案）" },
  { value: "cs", label: "カスタマーサクセス（解約抑止）" },
  { value: "engineer", label: "エンジニア（技術課題説明）" },
  { value: "hr", label: "人事（評価面談）" },
];

const modelOptions = [
  { value: "balanced", label: "バランス重視" },
  { value: "strict", label: "厳格評価" },
  { value: "coach", label: "コーチング重視" },
];

const tagOptions = [
  { value: "hearing", label: "ヒアリング" },
  { value: "proposal", label: "提案力" },
  { value: "negotiation", label: "交渉" },
  { value: "closing", label: "クロージング" },
];

// =============================================================================
// Component
// =============================================================================

export const AiRoleplaySettings = () => {
  const [scenario, setScenario] = useState("sales");
  const [model, setModel] = useState("balanced");
  const [tags, setTags] = useState<string[]>(["hearing", "proposal"]);
  const location = useLocation();

  const navItems = [
    { label: "結果一覧", path: "/sandbox/wataryooou/ai-roleplay-results", icon: LfList },
    { label: "結果詳細", path: "/sandbox/wataryooou/ai-roleplay-result-detail", icon: LfFile },
    { label: "ロープレ実施", path: "/sandbox/wataryooou/ai-roleplay-session", icon: LfSend },
    { label: "結果表示", path: "/sandbox/wataryooou/ai-roleplay-result-view", icon: LfFileEye },
    { label: "設定", path: "/sandbox/wataryooou/ai-roleplay-settings", icon: LfSetting },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarBody>
          <SidebarNavigation>
            {navItems.map((item) => (
              <SidebarNavigationItem key={item.path}>
                <SidebarNavigationLink
                  aria-current={location.pathname === item.path ? "page" : undefined}
                  leading={
                    <Icon>
                      <item.icon />
                    </Icon>
                  }
                  asChild
                >
                  <Link to={item.path}>{item.label}</Link>
                </SidebarNavigationLink>
              </SidebarNavigationItem>
            ))}
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>
        <Header>
          <Header.Spacer />
          <Header.Item>
            <Menu>
              <Menu.Anchor>
                <Avatar name="AIロープレ" />
              </Menu.Anchor>
              <Menu.Box>
                <ActionList>
                  <ActionList.Group>
                    <ActionList.Item>
                      <ActionList.Body leading={LfUser}>プロフィール</ActionList.Body>
                    </ActionList.Item>
                  </ActionList.Group>
                  <ActionList.Group>
                    <ActionList.Item color="danger">
                      <ActionList.Body leading={LfArrowRightFromLine}>ログアウト</ActionList.Body>
                    </ActionList.Item>
                  </ActionList.Group>
                </ActionList>
              </Menu.Box>
            </Menu>
          </Header.Item>
        </Header>
        <PageLayout>
          <PageLayoutContent>
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeader.Title>AIロープレ設定</ContentHeader.Title>
                <ContentHeader.Description>デフォルトシナリオや評価基準を調整します。</ContentHeader.Description>
              </ContentHeader>
            </PageLayoutHeader>

            <PageLayoutBody>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxLarge)" }}>
                <Banner color="warning" closeButton={false}>
                  <Text>評価基準を変更すると、今後のロープレ結果に反映されます。</Text>
                </Banner>

                <Form>
                  <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
                    <div>
                      <Text as="h3" variant="body.large.bold" style={{ marginBottom: "var(--aegis-space-small)" }}>
                        面接設定
                      </Text>
                      <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                        <FormControl>
                          <FormControl.Label>デフォルトシナリオ</FormControl.Label>
                          <Select
                            options={scenarioOptions}
                            value={scenario}
                            onChange={(value) => setScenario(value)}
                            placeholder="シナリオを選択"
                          />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>制限時間（分）</FormControl.Label>
                          <TextField defaultValue="20" />
                        </FormControl>
                        <Switch labelPosition="end" defaultChecked>
                          自動スコアリングを有効にする
                        </Switch>
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <Text as="h3" variant="body.large.bold" style={{ marginBottom: "var(--aegis-space-small)" }}>
                        評価タグ
                      </Text>
                      <FormControl>
                        <FormControl.Label>評価軸のタグを選択</FormControl.Label>
                        <TagPicker options={tagOptions} value={tags} onChange={setTags} placeholder="タグを選択" />
                      </FormControl>
                    </div>

                    <Divider />

                    <div>
                      <Text as="h3" variant="body.large.bold" style={{ marginBottom: "var(--aegis-space-small)" }}>
                        AIモデル
                      </Text>
                      <FormControl>
                        <FormControl.Label>評価モード</FormControl.Label>
                        <Select options={modelOptions} value={model} onChange={(value) => setModel(value)} />
                      </FormControl>
                    </div>

                    <Divider />

                    <div>
                      <Text as="h3" variant="body.large.bold" style={{ marginBottom: "var(--aegis-space-small)" }}>
                        通知設定
                      </Text>
                      <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                        <Checkbox defaultChecked>結果が完成したら通知</Checkbox>
                        <Checkbox>要再評価のときに通知</Checkbox>
                        <Checkbox defaultChecked>週次レポートを送信</Checkbox>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--aegis-space-small)" }}>
                      <Button variant="subtle">キャンセル</Button>
                      <Button variant="solid">保存</Button>
                    </div>
                  </div>
                </Form>
              </div>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AiRoleplaySettings;
