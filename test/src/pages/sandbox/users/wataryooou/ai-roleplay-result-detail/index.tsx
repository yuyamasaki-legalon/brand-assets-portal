import {
  LfAngleLeftLarge,
  LfArrowRightFromLine,
  LfEllipsisDot,
  LfFile,
  LfFileEye,
  LfHistory,
  LfInformationCircle,
  LfList,
  LfPen,
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
  CardHeader,
  ContentHeader,
  Divider,
  Header,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarProvider,
  SidebarTrigger,
  SideNavigation,
  StatusLabel,
  Table,
  TableContainer,
  Tag,
  TagGroup,
  Text,
  Timeline,
  Tooltip,
} from "@legalforce/aegis-react";
import { type ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// =============================================================================
// Types
// =============================================================================

type RoleplayStatus = "completed" | "needsReview" | "inProgress" | "archived";

type PaneType = "rubric" | "transcript" | "next";

// =============================================================================
// Mock Data
// =============================================================================

const roleplayDetail = {
  id: "RP-2026-012",
  scenario: "法人営業（SaaS提案）",
  candidate: "佐藤 花子",
  evaluator: "AI面接官",
  status: "completed" as const,
  score: 86,
  grade: "B+",
  date: "2026/01/28 14:20",
  duration: "18分",
  summary: "提案の構成力と課題ヒアリングは良好。価格交渉時の論点整理と合意形成のステップに改善余地があります。",
  strengths: ["課題把握", "提案ストーリー", "ヒアリング"],
  improvements: ["価格交渉", "反論対応", "クロージング"],
};

const scoreBreakdown = [
  { label: "導入トーク", score: 88, comment: "アイスブレイクが自然" },
  { label: "課題ヒアリング", score: 90, comment: "質問が具体的" },
  { label: "提案内容", score: 84, comment: "価値訴求は明確" },
  { label: "反論対応", score: 72, comment: "価格交渉に弱い" },
  { label: "クロージング", score: 76, comment: "次アクションが曖昧" },
];

const timelineEvents = [
  { id: "t1", time: "00:30", text: "自己紹介と目的確認" },
  { id: "t2", time: "04:10", text: "顧客課題を深掘り" },
  { id: "t3", time: "08:45", text: "ソリューション提案" },
  { id: "t4", time: "13:20", text: "価格交渉の反論" },
  { id: "t5", time: "16:40", text: "次回アクション提示" },
];

const rubricItems = [
  { label: "ヒアリング", weight: "30%", target: "課題を構造化できる" },
  { label: "提案力", weight: "30%", target: "価値を言語化できる" },
  { label: "反論対応", weight: "20%", target: "論点を整理して提案" },
  { label: "クロージング", weight: "20%", target: "次アクションを合意" },
];

// =============================================================================
// Status Configuration
// =============================================================================

const statusLabels: Record<RoleplayStatus, string> = {
  completed: "完了",
  needsReview: "要再評価",
  inProgress: "進行中",
  archived: "アーカイブ",
};

const statusColors: Record<RoleplayStatus, "teal" | "yellow" | "blue" | "neutral"> = {
  completed: "teal",
  needsReview: "yellow",
  inProgress: "blue",
  archived: "neutral",
};

// =============================================================================
// Component
// =============================================================================

export const AiRoleplayResultDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paneType, setPaneType] = useState<PaneType>("rubric");

  const paneContents: Record<PaneType, { title: string; body: ReactNode }> = {
    rubric: {
      title: "評価ルーブリック",
      body: (
        <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
          {rubricItems.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-xxSmall)",
                padding: "var(--aegis-space-small)",
                border: "1px solid var(--aegis-color-border-default)",
                borderRadius: "var(--aegis-radius-medium)",
              }}
            >
              <Text variant="body.medium.bold">{item.label}</Text>
              <Text variant="body.small" color="subtle">
                配点: {item.weight}
              </Text>
              <Text variant="body.small" color="subtle">
                期待値: {item.target}
              </Text>
            </div>
          ))}
        </div>
      ),
    },
    transcript: {
      title: "会話ログ要約",
      body: (
        <Timeline>
          {timelineEvents.map((event) => (
            <Timeline.Item key={event.id}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
                <Text variant="body.small" color="subtle">
                  {event.time}
                </Text>
                <Text variant="body.medium">{event.text}</Text>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      ),
    },
    next: {
      title: "次アクション",
      body: (
        <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
          <Text variant="body.medium">次回ロープレで注力する項目を設定してください。</Text>
          <TagGroup>
            {roleplayDetail.improvements.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </TagGroup>
          <Button variant="solid">再評価を予約</Button>
        </div>
      ),
    },
  };

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
          <Header.Item>
            <Tooltip title="戻る">
              <IconButton
                variant="plain"
                aria-label="戻る"
                onClick={() => navigate("/sandbox/wataryooou/ai-roleplay-results")}
              >
                <Icon>
                  <LfAngleLeftLarge />
                </Icon>
              </IconButton>
            </Tooltip>
          </Header.Item>
          <Header.Item>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                <StatusLabel color={statusColors[roleplayDetail.status]}>
                  {statusLabels[roleplayDetail.status]}
                </StatusLabel>
                <Header.Title>
                  <Text variant="title.xxSmall">{roleplayDetail.scenario}</Text>
                </Header.Title>
              </div>
              <Text variant="body.small" color="subtle">
                {roleplayDetail.id} / {roleplayDetail.candidate}
              </Text>
            </div>
          </Header.Item>
          <Header.Spacer />
          <Header.Item>
            <ButtonGroup>
              <Button variant="plain" leading={LfPen}>
                コメント追加
              </Button>
              <Button variant="solid">PDF出力</Button>
            </ButtonGroup>
            <Tooltip title="その他" placement="bottom">
              <IconButton variant="plain" aria-label="その他">
                <Icon>
                  <LfEllipsisDot />
                </Icon>
              </IconButton>
            </Tooltip>
          </Header.Item>
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
          <PageLayoutContent variant="fill">
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeader.Title>ロープレ結果詳細</ContentHeader.Title>
                <ContentHeader.Description>評価の根拠や改善ポイントを確認できます。</ContentHeader.Description>
              </ContentHeader>
            </PageLayoutHeader>

            <PageLayoutBody>
              <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
                <Card>
                  <CardHeader>
                    <Text variant="title.xSmall">セッション概要</Text>
                  </CardHeader>
                  <CardBody>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: "var(--aegis-space-medium)",
                      }}
                    >
                      <div>
                        <Text variant="label.medium" color="subtle">
                          日時
                        </Text>
                        <Text variant="body.medium">{roleplayDetail.date}</Text>
                      </div>
                      <div>
                        <Text variant="label.medium" color="subtle">
                          所要時間
                        </Text>
                        <Text variant="body.medium">{roleplayDetail.duration}</Text>
                      </div>
                      <div>
                        <Text variant="label.medium" color="subtle">
                          評価者
                        </Text>
                        <Text variant="body.medium">{roleplayDetail.evaluator}</Text>
                      </div>
                      <div>
                        <Text variant="label.medium" color="subtle">
                          スコア
                        </Text>
                        <Text variant="body.medium">
                          {roleplayDetail.score}点 ({roleplayDetail.grade})
                        </Text>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Text variant="title.xSmall">評価サマリー</Text>
                  </CardHeader>
                  <CardBody>
                    <Text variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
                      {roleplayDetail.summary}
                    </Text>
                    <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                      <div>
                        <Text variant="label.medium" color="subtle">
                          強み
                        </Text>
                        <TagGroup>
                          {roleplayDetail.strengths.map((item) => (
                            <Tag key={item}>{item}</Tag>
                          ))}
                        </TagGroup>
                      </div>
                      <div>
                        <Text variant="label.medium" color="subtle">
                          改善ポイント
                        </Text>
                        <TagGroup>
                          {roleplayDetail.improvements.map((item) => (
                            <Tag key={item}>{item}</Tag>
                          ))}
                        </TagGroup>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Text variant="title.xSmall">評価内訳</Text>
                  </CardHeader>
                  <CardBody>
                    <TableContainer>
                      <Table size="small">
                        <Table.Head>
                          <Table.Row>
                            <Table.Cell as="th">評価項目</Table.Cell>
                            <Table.Cell as="th">スコア</Table.Cell>
                            <Table.Cell as="th">コメント</Table.Cell>
                          </Table.Row>
                        </Table.Head>
                        <Table.Body>
                          {scoreBreakdown.map((item) => (
                            <Table.Row key={item.label}>
                              <Table.Cell>{item.label}</Table.Cell>
                              <Table.Cell>{item.score}</Table.Cell>
                              <Table.Cell>{item.comment}</Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>

                <Divider />

                <Card>
                  <CardHeader>
                    <Text variant="title.xSmall">会話ハイライト</Text>
                  </CardHeader>
                  <CardBody>
                    <Timeline>
                      {timelineEvents.map((event) => (
                        <Timeline.Item key={event.id}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
                            <Text variant="body.small" color="subtle">
                              {event.time}
                            </Text>
                            <Text variant="body.medium">{event.text}</Text>
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </CardBody>
                </Card>
              </div>
            </PageLayoutBody>
          </PageLayoutContent>

          <PageLayoutPane position="end" resizable minWidth="large" width="large" open>
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeader.Title>{paneContents[paneType].title}</ContentHeader.Title>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>{paneContents[paneType].body}</PageLayoutBody>
          </PageLayoutPane>

          <PageLayoutSidebar position="end">
            <SideNavigation>
              <SideNavigation.Group>
                <SideNavigation.Item
                  icon={LfInformationCircle}
                  onClick={() => setPaneType("rubric")}
                  aria-current={paneType === "rubric" ? true : undefined}
                >
                  ルーブリック
                </SideNavigation.Item>
                <SideNavigation.Item
                  icon={LfHistory}
                  onClick={() => setPaneType("transcript")}
                  aria-current={paneType === "transcript" ? true : undefined}
                >
                  会話ログ
                </SideNavigation.Item>
                <SideNavigation.Item
                  icon={LfFile}
                  onClick={() => setPaneType("next")}
                  aria-current={paneType === "next" ? true : undefined}
                >
                  次アクション
                </SideNavigation.Item>
              </SideNavigation.Group>
            </SideNavigation>
          </PageLayoutSidebar>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AiRoleplayResultDetail;
