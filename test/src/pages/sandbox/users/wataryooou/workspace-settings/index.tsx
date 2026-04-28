import {
  LfArrowRightFromLine,
  LfArrowUpRightFromSquare,
  LfBell,
  LfFileLines,
  LfFilesLine,
  LfHome,
  LfInformationCircle,
  LfMagnifyingGlass,
  LfMail,
  LfPen,
  LfPlusLarge,
  LfQuestionCircle,
  LfShare,
  LfThumbsUp,
  LfUser,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Banner,
  Button,
  ButtonGroup,
  ContentHeader,
  Divider,
  Header,
  Icon,
  IconButton,
  Link,
  Menu,
  NavList,
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
  Text,
  Tooltip,
} from "@legalforce/aegis-react";

const Search = () => {
  return (
    <Tooltip title="Search">
      <IconButton aria-label="Search" variant="plain">
        <Icon>
          <LfMagnifyingGlass />
        </Icon>
      </IconButton>
    </Tooltip>
  );
};

export const WorkspaceSettings = () => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarBody>
          <SidebarNavigation>
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
                aria-current="page"
                leading={
                  <Icon>
                    <LfFileLines />
                  </Icon>
                }
              >
                設定
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfMail />
                  </Icon>
                }
              >
                通知
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
                セキュリティ
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfFilesLine />
                  </Icon>
                }
              >
                連携
              </SidebarNavigationLink>
            </SidebarNavigationItem>
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>
        <Header>
          <Header.Spacer />
          <Header.Item>
            <Search />
          </Header.Item>
          <Header.Item>
            <ButtonGroup>
              <Tooltip title="Notifications">
                <IconButton aria-label="Notifications">
                  <Icon>
                    <LfBell />
                  </Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Help">
                <IconButton aria-label="Help">
                  <Icon>
                    <LfInformationCircle />
                  </Icon>
                </IconButton>
              </Tooltip>
              <Menu>
                <Menu.Anchor>
                  <Avatar name="LegalOn Technologies" />
                </Menu.Anchor>
                <Menu.Box>
                  <ActionList>
                    <ActionList.Group>
                      <ActionList.Item>
                        <ActionList.Body leading={LfUser}>Profile</ActionList.Body>
                      </ActionList.Item>
                    </ActionList.Group>
                    <ActionList.Group>
                      <ActionList.Item color="danger">
                        <ActionList.Body leading={LfArrowRightFromLine}>Logout</ActionList.Body>
                      </ActionList.Item>
                    </ActionList.Group>
                  </ActionList>
                </Menu.Box>
              </Menu>
            </ButtonGroup>
          </Header.Item>
        </Header>

        <PageLayout>
          <PageLayoutPane position="start">
            <PageLayoutHeader>
              <Text as="h2" variant="title.large">
                ワークスペース設定
              </Text>
            </PageLayoutHeader>
            <PageLayoutBody>
              <NavList>
                <NavList.Group title="基本設定">
                  <NavList.Item aria-current="page">概要</NavList.Item>
                  <NavList.Item>組織情報</NavList.Item>
                  <NavList.Item>権限ロール</NavList.Item>
                </NavList.Group>
                <NavList.Group title="通知">
                  <NavList.Item>通知ルール</NavList.Item>
                  <NavList.Item>配信チャネル</NavList.Item>
                  <NavList.Item>通知テンプレート</NavList.Item>
                </NavList.Group>
                <NavList.Group title="セキュリティ">
                  <NavList.Item>アクセス制御</NavList.Item>
                  <NavList.Item>監査ログ</NavList.Item>
                  <NavList.Item>データ保持</NavList.Item>
                </NavList.Group>
                <NavList.Group title="外部連携">
                  <NavList.Item>Slack</NavList.Item>
                  <NavList.Item>Microsoft Teams</NavList.Item>
                  <NavList.Item>SSO</NavList.Item>
                </NavList.Group>
              </NavList>
            </PageLayoutBody>
          </PageLayoutPane>

          <PageLayoutSidebar position="end">
            <SideNavigation>
              <SideNavigation.Group>
                <SideNavigation.Item icon={LfPen}>通知ポリシー</SideNavigation.Item>
                <SideNavigation.Item icon={LfMagnifyingGlass}>履歴</SideNavigation.Item>
              </SideNavigation.Group>
              <SideNavigation.Group>
                <SideNavigation.Item icon={LfThumbsUp}>監査</SideNavigation.Item>
                <SideNavigation.Item icon={LfShare}>連携</SideNavigation.Item>
              </SideNavigation.Group>
            </SideNavigation>
          </PageLayoutSidebar>

          <PageLayoutContent>
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeader.Title>通知とセキュリティ</ContentHeader.Title>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xxLarge)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
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
                    <Text>
                      重要な更新は管理者に即時通知し、日次サマリーは担当者に配信します。
                      <br />
                      変更は全ワークスペースに適用されます。
                    </Text>
                    <Link href="#">
                      <Text
                        as="span"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "var(--aegis-space-xxSmall)",
                        }}
                      >
                        <Icon size="small">
                          <LfQuestionCircle />
                        </Icon>
                        通知ポリシーの詳細
                        <Icon size="small">
                          <LfArrowUpRightFromSquare />
                        </Icon>
                      </Text>
                    </Link>
                  </div>

                  <Banner color="warning" closeButton={false}>
                    <Text>
                      通知ルールの変更は全管理者に影響します。
                      <br />
                      保存前に関係者へ共有してください。
                    </Text>
                    <Link href="#">影響範囲を確認</Link>
                  </Banner>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xSmall)",
                    }}
                  >
                    <Text as="h2" variant="body.large.bold">
                      通知ルール
                    </Text>
                    <Text>案件更新・締結・期限超過のルールを管理します。</Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xxSmall)",
                    }}
                  >
                    <Text color="subtle">・期限超過 7日前に担当者へメール</Text>
                    <Text color="subtle">・締結完了時にチャンネルへ通知</Text>
                    <Text color="subtle">・レビュー差戻し時に担当者へ通知</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xSmall)",
                    }}
                  >
                    <Text as="h2" variant="body.large.bold">
                      配信チャネル
                    </Text>
                    <Text>メールとチャット通知の配信先を設定します。</Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xxSmall)",
                    }}
                  >
                    <Text color="subtle">・管理者メール: admin@workspace.example</Text>
                    <Text color="subtle">・Slack: #legal-updates</Text>
                    <Text color="subtle">・Teams: Legal Operations</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-large)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-medium)",
                    }}
                  >
                    <Text as="h2" variant="body.large.bold">
                      例外通知
                    </Text>
                    <Button leading={LfPlusLarge} variant="solid" size="medium">
                      通知ルールを追加
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xxSmall)",
                    }}
                  >
                    <Text color="subtle">・高リスク契約は即時通知</Text>
                    <Text color="subtle">・外部共有時にセキュリティ通知</Text>
                    <Text color="subtle">・未アサイン案件は週次で通知</Text>
                  </div>
                </div>

                <Button variant="subtle" size="medium">
                  保存
                </Button>

                <Divider />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  <Text as="h2" variant="body.large.bold">
                    セキュリティ通知
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xxSmall)",
                    }}
                  >
                    <Text color="subtle">・新規ログインを即時メール通知</Text>
                    <Text color="subtle">・APIトークンの更新は管理者へ通知</Text>
                    <Text color="subtle">・夜間アクセスは自動で警告</Text>
                  </div>
                </div>
              </div>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default WorkspaceSettings;
