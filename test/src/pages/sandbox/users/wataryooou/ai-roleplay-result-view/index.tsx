import { LfArrowRightFromLine, LfFile, LfFileEye, LfList, LfSend, LfSetting, LfUser } from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Banner,
  Button,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  Divider,
  Header,
  Icon,
  Menu,
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
  SidebarProvider,
  SidebarTrigger,
  StatusLabel,
  Table,
  TableContainer,
  Tag,
  TagGroup,
  Text,
} from "@legalforce/aegis-react";
import { Link, useLocation } from "react-router-dom";

// =============================================================================
// Mock Data
// =============================================================================

const resultSummary = {
  scenario: "法人営業（SaaS提案）",
  candidate: "佐藤 花子",
  score: 86,
  grade: "B+",
  status: "合格",
  duration: "18分",
  date: "2026/01/28 14:20",
  strengths: ["課題把握", "提案ストーリー", "ヒアリング"],
  improvements: ["価格交渉", "反論対応", "クロージング"],
  nextSteps: "次回は価格交渉の論点整理と合意形成を重点的に練習してください。",
};

const scoreTable = [
  { label: "導入トーク", score: "88", comment: "自然なアイスブレイク" },
  { label: "課題ヒアリング", score: "90", comment: "質問が具体的" },
  { label: "提案内容", score: "84", comment: "価値訴求が明確" },
  { label: "反論対応", score: "72", comment: "価格交渉に弱い" },
  { label: "クロージング", score: "76", comment: "次アクションが曖昧" },
];

// =============================================================================
// Component
// =============================================================================

export const AiRoleplayResultView = () => {
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
              <ContentHeader
                trailing={
                  <div style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
                    <Button variant="subtle">共有</Button>
                    <Button variant="solid">PDF出力</Button>
                  </div>
                }
              >
                <ContentHeader.Title>ロープレ結果表示</ContentHeader.Title>
                <ContentHeader.Description>結果を候補者・評価者向けにまとめたビューです。</ContentHeader.Description>
              </ContentHeader>
            </PageLayoutHeader>

            <PageLayoutBody>
              <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
                <Card>
                  <CardHeader>
                    <Text variant="title.xSmall">結果サマリー</Text>
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
                          シナリオ
                        </Text>
                        <Text variant="body.medium">{resultSummary.scenario}</Text>
                      </div>
                      <div>
                        <Text variant="label.medium" color="subtle">
                          候補者
                        </Text>
                        <Text variant="body.medium">{resultSummary.candidate}</Text>
                      </div>
                      <div>
                        <Text variant="label.medium" color="subtle">
                          日時
                        </Text>
                        <Text variant="body.medium">{resultSummary.date}</Text>
                      </div>
                      <div>
                        <Text variant="label.medium" color="subtle">
                          所要時間
                        </Text>
                        <Text variant="body.medium">{resultSummary.duration}</Text>
                      </div>
                    </div>
                    <Divider style={{ margin: "var(--aegis-space-medium) 0" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                      <Text variant="title.medium">{resultSummary.score}点</Text>
                      <StatusLabel color="teal">{resultSummary.status}</StatusLabel>
                      <Tag>評価: {resultSummary.grade}</Tag>
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
                          {scoreTable.map((item) => (
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  <Card>
                    <CardHeader>
                      <Text variant="title.xSmall">強み</Text>
                    </CardHeader>
                    <CardBody>
                      <TagGroup>
                        {resultSummary.strengths.map((item) => (
                          <Tag key={item}>{item}</Tag>
                        ))}
                      </TagGroup>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Text variant="title.xSmall">改善ポイント</Text>
                    </CardHeader>
                    <CardBody>
                      <TagGroup>
                        {resultSummary.improvements.map((item) => (
                          <Tag key={item}>{item}</Tag>
                        ))}
                      </TagGroup>
                    </CardBody>
                  </Card>
                </div>

                <Banner color="information" closeButton={false}>
                  <Text>{resultSummary.nextSteps}</Text>
                </Banner>
              </div>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AiRoleplayResultView;
