import {
  LfApps,
  LfBuilding,
  LfClock,
  LfCloseLarge,
  LfFileLines,
  LfFilesSignature,
  LfHome,
  LfList,
  LfPlusLarge,
  LfSend,
  LfSetting,
  LfSparkles,
  LfUser,
} from "@legalforce/aegis-icons";
import {
  Avatar,
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Divider,
  Header,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Provider,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  Tag,
  Text,
  Textarea,
  Tooltip,
} from "@legalforce/aegis-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { themes } from "../../../../themes";
import styles from "./index.module.css";
import { mockActivities } from "./mock";

// =============================================================================
// Reusable Layout
// =============================================================================

interface DealOnLayoutProps {
  children: ReactNode;
}

export function DealOnLayout({ children }: DealOnLayoutProps) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  return (
    <Provider theme={themes.navy} scale="full">
      <SidebarProvider defaultOpen>
        {/* Left sidebar - Activity list */}
        <Sidebar behavior="push" collapsible="offcanvas" className={styles.darkSidebar}>
          <SidebarHeader className={styles.darkSidebarHeader}>
            <ContentHeader
              size="large"
              leading={
                <Menu>
                  <MenuTrigger>
                    <Tooltip title="メニュー">
                      <IconButton aria-label="メニュー" variant="plain" size="large" color="inverse">
                        <Icon>
                          <LfApps />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </MenuTrigger>
                  <MenuContent side="bottom" align="start">
                    <MenuGroup>
                      <MenuItem
                        leading={
                          <Icon>
                            <LfHome />
                          </Icon>
                        }
                        onClick={() => navigate("/template/dealon/layout")}
                      >
                        ホーム
                      </MenuItem>
                      <MenuItem
                        leading={
                          <Icon>
                            <LfFilesSignature />
                          </Icon>
                        }
                        onClick={() => navigate("/template/dealon/deal-list")}
                      >
                        案件一覧
                      </MenuItem>
                      <MenuItem
                        leading={
                          <Icon>
                            <LfBuilding />
                          </Icon>
                        }
                      >
                        企業一覧
                      </MenuItem>
                      <MenuItem
                        leading={
                          <Icon>
                            <LfUser />
                          </Icon>
                        }
                      >
                        担当者一覧
                      </MenuItem>
                      <MenuItem
                        leading={
                          <Icon>
                            <LfFileLines />
                          </Icon>
                        }
                      >
                        商材一覧
                      </MenuItem>
                      <MenuItem
                        leading={
                          <Icon>
                            <LfList />
                          </Icon>
                        }
                      >
                        タスク一覧
                      </MenuItem>
                    </MenuGroup>
                    <MenuSeparator />
                    <MenuGroup>
                      <MenuItem
                        leading={
                          <Icon>
                            <LfSetting />
                          </Icon>
                        }
                        onClick={() => navigate("/template/dealon/settings-profile")}
                      >
                        設定
                      </MenuItem>
                    </MenuGroup>
                  </MenuContent>
                </Menu>
              }
            >
              <ContentHeaderTitle color="inverse">DEALON</ContentHeaderTitle>
            </ContentHeader>
          </SidebarHeader>
          {/* アプリロゴ用と、セクションタイトル用で SidebarHeader を分離し、それぞれ独立した高さ・余白を確保している */}
          <SidebarHeader className={styles.darkSidebarHeader}>
            <ContentHeader size="small">
              <ContentHeaderTitle color="inverse">アクティビティ</ContentHeaderTitle>
            </ContentHeader>
          </SidebarHeader>
          <SidebarBody>
            <div className={styles.activityList}>
              {mockActivities.map((activity, index) => (
                <div key={activity.id}>
                  <div className={styles.activityItem}>
                    <div className={styles.activityHeader}>
                      <Tag size="small" variant="fill" color="inverse">
                        {activity.category}
                      </Tag>
                      <Text variant="body.xSmall" color="inverse.subtle">
                        {activity.timestamp}
                      </Text>
                    </div>
                    <Text variant="body.small.bold" color="inverse">
                      {activity.dealName}
                    </Text>
                    <Text variant="body.small" color="inverse.subtle">
                      {activity.description}
                    </Text>
                  </div>
                  {index < mockActivities.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          </SidebarBody>
        </Sidebar>

        <SidebarInset>
          <SidebarProvider defaultOpen>
            <SidebarInset>
              <Header className={styles.darkHeader}>
                <Header.Spacer />
                <Header.Item>
                  <SidebarTrigger>
                    <Tooltip title="Selaに相談">
                      <IconButton aria-label="Sela" variant="plain" color="inverse">
                        <Icon>
                          <LfSparkles />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </SidebarTrigger>
                </Header.Item>
                <Header.Item>
                  <Avatar name="田中 太郎" size="small" />
                </Header.Item>
              </Header>
              <div className={styles.pageLayoutWrapper}>
                <PageLayout scrollBehavior="inside" className={styles.pageLayout}>
                  {children}
                </PageLayout>
              </div>
            </SidebarInset>

            {/* Right sidebar - Sela AI Chat */}
            <Sidebar side="inline-end" behavior="push" collapsible="offcanvas" className={styles.darkSidebarEnd}>
              <SidebarHeader className={`${styles.darkSidebarHeader} ${styles.selaHeader}`}>
                <ContentHeader
                  size="medium"
                  trailing={
                    <ButtonGroup size="small" variant="plain" color="inverse">
                      <Tooltip title="新規セッション">
                        <IconButton aria-label="新規セッション">
                          <Icon>
                            <LfPlusLarge />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="履歴">
                        <IconButton aria-label="履歴">
                          <Icon>
                            <LfClock />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                      <SidebarTrigger>
                        <Tooltip title="閉じる">
                          <IconButton aria-label="閉じる">
                            <Icon>
                              <LfCloseLarge />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </SidebarTrigger>
                    </ButtonGroup>
                  }
                >
                  <ContentHeaderTitle color="inverse">Selaに相談</ContentHeaderTitle>
                </ContentHeader>
              </SidebarHeader>
              <SidebarBody className={styles.darkSidebarBody}>
                <div className={styles.selaChatContainer}>
                  <div className={styles.selaChatMessages}>
                    <div className={styles.selaChatEmptyState}>
                      <Text variant="body.medium" color="subtle">
                        AIエージェントに質問してください
                      </Text>
                      <div className={styles.selaChatSuggestions}>
                        <Button variant="subtle" size="small">
                          ROI試算資料を作成
                        </Button>
                        <Button variant="subtle" size="small">
                          次のステップを提案
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className={styles.selaChatInput}>
                    <Textarea
                      aria-label="AIエージェントへの質問入力"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="AIエージェントに質問する"
                      minRows={2}
                      trailing={
                        <div className={styles.selaChatSendButton}>
                          <Tooltip title="送信">
                            <IconButton aria-label="送信" size="small" variant="solid" disabled={!message.trim()}>
                              <Icon>
                                <LfSend />
                              </Icon>
                            </IconButton>
                          </Tooltip>
                        </div>
                      }
                    />
                  </div>
                </div>
              </SidebarBody>
            </Sidebar>
          </SidebarProvider>
        </SidebarInset>
      </SidebarProvider>
    </Provider>
  );
}

// =============================================================================
// Demo Page (default export for route)
// =============================================================================

export default function DealOnLayoutPage() {
  return (
    <DealOnLayout>
      <PageLayoutContent scrollBehavior="outside" maxWidth="x8Large">
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>DealOn テンプレートページ</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text color="subtle">DealOn Layout のデモページです。children でコンテンツを差し替えられます。</Text>
        </PageLayoutBody>
      </PageLayoutContent>
    </DealOnLayout>
  );
}
