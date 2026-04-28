import {
  LfArchive,
  LfArrowUpRightFromSquare,
  LfBell,
  LfCheckBook,
  LfEllipsisDot,
  LfFileLines,
  LfFileSigned,
  LfFilesLine,
  LfHome,
  LfMagnifyingGlass,
  LfPlusLarge,
  LfQuestionCircle,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  Avatar,
  Button,
  Draggable,
  Header,
  Icon,
  IconButton,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
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
  Table,
  TableContainer,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import type { JSX } from "react";
import { Navigation } from "./components/Navigation";
import { NavigationHeader } from "./components/NavigationHeader";
import { StatusRow } from "./components/StatusRow";
import type { ApplicationConsolePresentationProps } from "./types";

export const ApplicationConsolePresentation = ({
  // data props
  notStartedStatus,
  closedStatus,
  maxStatusCount,
  leadText,
  // state props
  inProgressStatuses,
  closedStatuses,
  canAddInProgressStatus,
  canAddClosedStatus,
  // handler props
  onInProgressReorder,
  onClosedReorder,
}: ApplicationConsolePresentationProps): JSX.Element => {
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
                ダッシュボード
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
                    <LfMagnifyingGlass />
                  </Icon>
                }
              >
                アシスタント
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                aria-current="page"
                leading={
                  <Icon>
                    <LfArchive />
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
                    <LfCheckBook />
                  </Icon>
                }
              >
                契約書再生産
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
        <Header>
          <Header.Spacer />
          <Header.Item>
            <div style={{ display: "flex" }}>
              <Tooltip title="通知">
                <IconButton aria-label="通知" icon={LfBell} variant="plain" />
              </Tooltip>
              <Tooltip title="ヘルプ">
                <IconButton aria-label="ヘルプ" icon={LfQuestionCircle} variant="plain" />
              </Tooltip>
            </div>
          </Header.Item>
          <Header.Item>
            <Avatar name="User" size="small" />
          </Header.Item>
        </Header>
        <PageLayout>
          <PageLayoutPane>
            <PageLayoutHeader>
              <NavigationHeader />
            </PageLayoutHeader>
            <PageLayoutBody>
              <Navigation />
            </PageLayoutBody>
          </PageLayoutPane>
          <PageLayoutContent align="start" maxWidth="medium">
            <PageLayoutBody>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxLarge)" }}>
                <Text as="h1" variant="title.large">
                  案件ステータス
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xSmall)",
                    paddingBlockEnd: "var(--aegis-space-medium)",
                  }}
                >
                  <Text variant="body.medium">{leadText}</Text>
                  <div>
                    <Link
                      href="#"
                      leading={LfQuestionCircle}
                      trailing={LfArrowUpRightFromSquare}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      案件ステータスの設定
                    </Link>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxLarge)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                    <Text as="h2" variant="title.small">
                      未着手
                    </Text>
                    <TableContainer>
                      <Table>
                        <Table.Head>
                          <Table.Row>
                            <Table.Cell as="th" />
                            <Table.Cell as="th">案件ステータス名</Table.Cell>
                            <Table.Cell as="th" />
                          </Table.Row>
                        </Table.Head>
                        <Table.Body>
                          <StatusRow status={notStartedStatus} isDraggable={false} />
                        </Table.Body>
                      </Table>
                    </TableContainer>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                        <Text as="h2" variant="title.small">
                          進行中
                        </Text>
                        <Text color="subtle" variant="body.medium">
                          {maxStatusCount}個まで登録できます。
                        </Text>
                      </div>
                      <Button leading={LfPlusLarge} variant="solid" size="medium" disabled={!canAddInProgressStatus}>
                        案件ステータスを追加
                      </Button>
                    </div>
                    <Draggable
                      as={TableContainer}
                      values={inProgressStatuses}
                      onReorder={onInProgressReorder}
                      getId={(status) => status.id}
                    >
                      <Table>
                        <Table.Head>
                          <Table.Row>
                            <Table.Cell as="th" />
                            <Table.Cell as="th">案件ステータス名</Table.Cell>
                            <Table.Cell as="th" />
                          </Table.Row>
                        </Table.Head>
                        <Table.Body>
                          {inProgressStatuses.map((status) => (
                            <StatusRow key={status.id} status={status} isDraggable={true} />
                          ))}
                        </Table.Body>
                      </Table>
                    </Draggable>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                        <Text as="h2" variant="title.small">
                          完了
                        </Text>
                        <Text color="subtle" variant="body.medium">
                          {maxStatusCount}個まで登録できます。
                        </Text>
                      </div>
                      <Button leading={LfPlusLarge} variant="solid" size="medium" disabled={!canAddClosedStatus}>
                        案件ステータスを追加
                      </Button>
                    </div>
                    <Draggable
                      as={TableContainer}
                      values={closedStatuses}
                      onReorder={onClosedReorder}
                      getId={(status) => status.id}
                    >
                      <Table>
                        <Table.Head>
                          <Table.Row>
                            <Table.Cell as="th" />
                            <Table.Cell as="th">案件ステータス名</Table.Cell>
                            <Table.Cell as="th" />
                          </Table.Row>
                        </Table.Head>
                        <Table.Body>
                          <StatusRow status={closedStatus} isDraggable={false} />
                          {closedStatuses.map((status) => (
                            <StatusRow key={status.id} status={status} isDraggable={true} />
                          ))}
                        </Table.Body>
                      </Table>
                    </Draggable>
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
