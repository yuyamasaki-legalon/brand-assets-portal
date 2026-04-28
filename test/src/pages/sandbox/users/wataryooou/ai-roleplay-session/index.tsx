import {
  LfArrowRightFromLine,
  LfClip,
  LfFile,
  LfFileEye,
  LfLayoutHorizon,
  LfList,
  LfSend,
  LfSetting,
  LfUser,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  ContentHeader,
  Header,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarProvider,
  SidebarTrigger,
  StatusLabel,
  Tag,
  Text,
  Textarea,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// =============================================================================
// Mock Data
// =============================================================================

const messages = [
  {
    id: "m1",
    role: "interviewer" as const,
    speaker: "AI面接官",
    time: "14:20",
    text: "こんにちは。本日は営業職のロープレを開始します。まずは簡単に自己紹介をお願いします。",
  },
  {
    id: "m2",
    role: "candidate" as const,
    speaker: "佐藤 花子",
    time: "14:21",
    text: "佐藤花子と申します。前職ではSaaSの法人営業として新規開拓と既存深耕を担当していました。",
  },
  {
    id: "m3",
    role: "interviewer" as const,
    speaker: "AI面接官",
    time: "14:22",
    text: "ありがとうございます。今回の顧客は解約率が上がって困っています。最初にどのように状況確認をしますか？",
  },
  {
    id: "m4",
    role: "candidate" as const,
    speaker: "佐藤 花子",
    time: "14:23",
    text: "まず現状のKPIと課題の優先度を確認し、意思決定者と現場の双方にヒアリングします。",
  },
];

// =============================================================================
// Component
// =============================================================================

export const AiRoleplaySession = () => {
  const location = useLocation();
  const [paneOpen, setPaneOpen] = useState(true);

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
        <PageLayout scrollBehavior="inside">
          <PageLayoutContent scrollBehavior="inside">
            <PageLayoutHeader>
              <ContentHeader
                trailing={
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
                    <StatusLabel color="blue">進行中</StatusLabel>
                    <ButtonGroup>
                      <Button variant="subtle">一時停止</Button>
                      <Button variant="solid">終了</Button>
                    </ButtonGroup>
                    <Tooltip title="パネル">
                      <IconButton size="small" aria-label="パネル" onClick={() => setPaneOpen((prev) => !prev)}>
                        <Icon>
                          <LfLayoutHorizon />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </div>
                }
              >
                <ContentHeader.Title>ロープレ実施</ContentHeader.Title>
                <ContentHeader.Description>シナリオ: 法人営業（SaaS提案）</ContentHeader.Description>
              </ContentHeader>
            </PageLayoutHeader>

            <PageLayoutBody>
              <div
                style={{
                  inlineSize: "100%",
                  maxInlineSize: "var(--aegis-layout-width-large)",
                  marginInline: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: "flex",
                      justifyContent: message.role === "candidate" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Card
                      style={{
                        inlineSize: "100%",
                        maxInlineSize: "420px",
                        backgroundColor:
                          message.role === "candidate"
                            ? "var(--aegis-color-surface-subtle)"
                            : "var(--aegis-color-surface-default)",
                      }}
                    >
                      <CardBody>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                          <Avatar size="xSmall" name={message.speaker} />
                          <Text variant="body.small">{message.speaker}</Text>
                          <Tag>{message.role === "candidate" ? "候補者" : "面接官"}</Tag>
                          <Text variant="body.small" color="subtle">
                            {message.time}
                          </Text>
                        </div>
                        <Text variant="body.medium" style={{ marginTop: "var(--aegis-space-small)" }}>
                          {message.text}
                        </Text>
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </div>
            </PageLayoutBody>

            <PageLayoutFooter gutterless>
              <div
                style={{
                  inlineSize: "100%",
                  maxInlineSize: "var(--aegis-layout-width-large)",
                  marginInline: "auto",
                }}
              >
                <Textarea
                  placeholder="回答を入力"
                  minRows={2}
                  maxRows={6}
                  trailing={
                    <div
                      style={{
                        inlineSize: "100%",
                        padding: "var(--aegis-space-xSmall)",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <ButtonGroup variant="plain" size="small">
                        <Tooltip title="添付">
                          <IconButton aria-label="添付">
                            <Icon>
                              <LfClip />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="設定">
                          <IconButton aria-label="設定">
                            <Icon>
                              <LfSetting />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </ButtonGroup>
                      <Tooltip title="送信">
                        <IconButton size="small" aria-label="送信">
                          <Icon>
                            <LfSend />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    </div>
                  }
                />
              </div>
            </PageLayoutFooter>
          </PageLayoutContent>

          <PageLayoutPane position="end" open={paneOpen} resizable maxWidth="x5Large" minWidth="small" width="large">
            <PageLayoutBody>
              <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
                <div>
                  <Text variant="title.xSmall">シナリオメモ</Text>
                  <Text variant="body.small" color="subtle">
                    顧客は解約率の増加に悩むSaaS企業。現状分析と改善提案を促す。
                  </Text>
                </div>
                <div>
                  <Text variant="title.xSmall">評価項目</Text>
                  <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                    <Text variant="body.small">- 課題ヒアリング</Text>
                    <Text variant="body.small">- 提案ストーリー</Text>
                    <Text variant="body.small">- 反論対応</Text>
                    <Text variant="body.small">- 次アクション合意</Text>
                  </div>
                </div>
                <div>
                  <Text variant="title.xSmall">進行メモ</Text>
                  <Text variant="body.small" color="subtle">
                    候補者の質問設計が良好。価格交渉の深掘りを促す。
                  </Text>
                </div>
              </div>
            </PageLayoutBody>
          </PageLayoutPane>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AiRoleplaySession;
