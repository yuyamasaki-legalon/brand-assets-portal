import {
  LfAiSparkles,
  LfArrowUpRightFromSquare,
  LfBook,
  LfEllipsisDot,
  LfFileLines,
  LfFileSigned,
  LfFilesLine,
  LfFlag,
  LfHome,
  LfMagnifyingGlass,
  LfMail,
  LfPen,
  LfPlusLarge,
  LfProofreading,
  LfQuestionCircle,
  LfShare,
  LfThumbsUp,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  Banner,
  Button,
  ContentHeader,
  ContentHeaderTitle,
  Divider,
  Icon,
  Link,
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
} from "@legalforce/aegis-react";

const SettingPageTemplate = () => {
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
                leading={
                  <Icon>
                    <LfMagnifyingGlass />
                  </Icon>
                }
              >
                検索
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfAiSparkles />
                  </Icon>
                }
              >
                アシスタント
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
                案件
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfProofreading />
                  </Icon>
                }
              >
                レビュー
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
                契約書
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
                電子契約
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfFileSigned />
                  </Icon>
                }
              >
                締結済契約書
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
                ひな形
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfBook />
                  </Icon>
                }
              >
                プレイブック
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfEllipsisDot />
                  </Icon>
                }
              >
                その他
              </SidebarNavigationLink>
            </SidebarNavigationItem>
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>
        <PageLayout>
          <PageLayoutPane position="start">
            <PageLayoutHeader>
              <Text as="h2" variant="title.large">
                管理者設定
              </Text>
            </PageLayoutHeader>
            <PageLayoutBody>
              <NavList>
                <NavList.Group title="ライセンス">
                  <NavList.Item aria-current="page">ライセンス</NavList.Item>
                </NavList.Group>
                <NavList.Item>モジュール</NavList.Item>
                <NavList.Item>マターマネジメント</NavList.Item>
                <NavList.Item>サイン</NavList.Item>
                <NavList.Item>コントラクトマネジメント</NavList.Item>
                <NavList.Group title="共通管理">
                  <NavList.Item>ユーザー</NavList.Item>
                  <NavList.Item>ユーザーグループ</NavList.Item>
                  <NavList.Item>ワークスペース</NavList.Item>
                  <NavList.Item>座席</NavList.Item>
                  <NavList.Item>多要素認証</NavList.Item>
                </NavList.Group>
                <NavList.Group title="外部連携">
                  <NavList.Item>Slack</NavList.Item>
                  <NavList.Item>Microsoft Teams</NavList.Item>
                  <NavList.Item>SSO</NavList.Item>
                </NavList.Group>
                <NavList.Item>データ移行</NavList.Item>
              </NavList>
            </PageLayoutBody>
          </PageLayoutPane>

          <PageLayoutSidebar position="end">
            <SideNavigation>
              <SideNavigation.Group>
                <SideNavigation.Item icon={LfPen}>編集</SideNavigation.Item>
                <SideNavigation.Item icon={LfMagnifyingGlass}>検索</SideNavigation.Item>
              </SideNavigation.Group>
              <SideNavigation.Group>
                <SideNavigation.Item icon={LfThumbsUp}>いいね</SideNavigation.Item>
                <SideNavigation.Item icon={LfShare}>共有</SideNavigation.Item>
                <SideNavigation.Item icon={LfFlag}>フラグ</SideNavigation.Item>
              </SideNavigation.Group>
            </SideNavigation>
          </PageLayoutSidebar>

          <PageLayoutContent>
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeaderTitle>タイトル</ContentHeaderTitle>
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
                      設定内容の説明文を記載します。
                      <br />
                      設定内容の補足を記載します。
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
                        ヘルプページへのリンク
                        <Icon size="small">
                          <LfArrowUpRightFromSquare />
                        </Icon>
                      </Text>
                    </Link>
                  </div>

                  <Banner color="warning" closeButton={false}>
                    <Text>
                      設定内容の説明文を記載します。
                      <br />
                      設定内容の補足を記載します。
                    </Text>
                    <Link href="#">リンク</Link>
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
                      タイトル
                    </Text>
                    <Text>設定内容の説明文を記載します。</Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xxSmall)",
                    }}
                  >
                    <Text color="subtle">Swap Content</Text>
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
                      タイトル
                    </Text>
                    <Text>設定内容の説明文を記載します。</Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xxSmall)",
                    }}
                  >
                    <Text color="subtle">Swap Content</Text>
                    <Text color="subtle">Swap Content</Text>
                    <Text color="subtle">Swap Content</Text>
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
                      タイトル
                    </Text>
                    <Button leading={LfPlusLarge} variant="solid" size="medium">
                      （機能名）を（操作名）を表す名詞
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xxSmall)",
                    }}
                  >
                    <Text color="subtle">Swap Content</Text>
                    <Text color="subtle">Swap Content</Text>
                    <Text color="subtle">Swap Content</Text>
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
                    タイトル
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xxSmall)",
                    }}
                  >
                    <Text color="subtle">Swap Content</Text>
                    <Text color="subtle">Swap Content</Text>
                    <Text color="subtle">Swap Content</Text>
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

export default SettingPageTemplate;
