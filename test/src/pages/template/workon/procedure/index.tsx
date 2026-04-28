import {
  LfAngleRightMiddle,
  LfApps,
  LfCheckCircle,
  LfEllipsisDot,
  LfFileEye,
  LfHome,
  LfList,
  LfPlusLarge,
  LfReply,
  LfSend,
  LfSetting,
  LfUserGroup,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Badge,
  Button,
  ContentHeader,
  ContentHeaderTitle,
  Icon,
  IconButton,
  Menu,
  NavList,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Pagination,
  SegmentedControl,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarNavigationSeparator,
  SidebarProvider,
  StatusLabel,
  Tab,
  Table,
  TableContainer,
  Tag,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";

const CHANGE_REQUEST_STATUS = {
  reservation: "予約中",
  incompleted: "変更失敗",
  completed: "確認待ち",
  canceled: "変更済み",
  draft: "下書き",
} as const;

interface ChangeRequestEmployee {
  id: string;
  type: "all" | "individual";
  status: keyof typeof CHANGE_REQUEST_STATUS;
  groupName: string;
  createSource: string;
  issueDate: string;
  updateDate: string;
}

const mockData: ChangeRequestEmployee[] = [
  {
    id: "1",
    type: "all",
    status: "reservation",
    groupName: "2025年 全従業員の勤務地を渋谷へ",
    createSource: "情報変更手続き",
    issueDate: "2025/09/01",
    updateDate: "2025/08/24 15:45",
  },
  {
    id: "2",
    type: "all",
    status: "reservation",
    groupName: "随時改定1月分",
    createSource: "給与アプリでの変更",
    issueDate: "2025/01/01",
    updateDate: "2025/01/01 10:00",
  },
  {
    id: "3",
    type: "all",
    status: "reservation",
    groupName: "住民税",
    createSource: "給与アプリでの変更",
    issueDate: "2024/06/01",
    updateDate: "2024/06/01 09:00",
  },
  {
    id: "4",
    type: "all",
    status: "reservation",
    groupName: "期末評価の等級情報",
    createSource: "評価アプリでの変更",
    issueDate: "2024/04/28",
    updateDate: "2024/04/03 18:00",
  },
];

const getStatusStyle = (status: keyof typeof CHANGE_REQUEST_STATUS) => {
  switch (status) {
    case "reservation":
      return { color: "yellow" as const, variant: "fill" as const };
    case "incompleted":
      return { color: "red" as const, variant: "fill" as const };
    case "canceled":
      return { color: "blue" as const, variant: "fill" as const };
    case "draft":
      return { color: "gray" as const, variant: "outline" as const };
    default:
      return { color: "gray" as const, variant: "fill" as const };
  }
};

function ChangeRequestActionMenu({ status }: { status: keyof typeof CHANGE_REQUEST_STATUS }) {
  return (
    <Menu>
      <Menu.Anchor>
        <Tooltip title="詳細を見る">
          <IconButton
            aria-label="詳細を見る"
            variant="plain"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Icon>
              <LfEllipsisDot />
            </Icon>
          </IconButton>
        </Tooltip>
      </Menu.Anchor>
      <Menu.Box width="xSmall">
        <ActionList>
          {status !== "draft" ? (
            <ActionList.Group>
              <ActionList.Item
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <ActionList.Body
                  leading={
                    <Icon>
                      <LfFileEye />
                    </Icon>
                  }
                >
                  詳細を見る
                </ActionList.Body>
              </ActionList.Item>
              {(status === "reservation" || status === "incompleted") && (
                <ActionList.Item
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <ActionList.Body
                    leading={
                      <Icon>
                        <LfReply />
                      </Icon>
                    }
                  >
                    下書きに戻す
                  </ActionList.Body>
                </ActionList.Item>
              )}
            </ActionList.Group>
          ) : (
            <>
              <ActionList.Group>
                <ActionList.Item
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <ActionList.Body
                    leading={
                      <Icon>
                        <LfFileEye />
                      </Icon>
                    }
                  >
                    再実行
                  </ActionList.Body>
                </ActionList.Item>
              </ActionList.Group>
              <ActionList.Group>
                <ActionList.Item
                  color="danger"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <ActionList.Body>削除</ActionList.Body>
                </ActionList.Item>
              </ActionList.Group>
            </>
          )}
        </ActionList>
      </Menu.Box>
    </Menu>
  );
}

export default function ProcedurePage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Avatar name="WorkOn" />
        </SidebarHeader>
        <SidebarBody>
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "var(--aegis-space-xLarge)",
            }}
          >
            <SidebarNavigation>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfList />
                    </Icon>
                  }
                >
                  TODO
                </SidebarNavigationLink>
              </SidebarNavigationItem>
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
                      <LfWriting />
                    </Icon>
                  }
                >
                  手続き
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfUserGroup />
                    </Icon>
                  }
                >
                  組織図
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfCheckCircle />
                    </Icon>
                  }
                >
                  承認
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfSend />
                    </Icon>
                  }
                >
                  申請
                </SidebarNavigationLink>
              </SidebarNavigationItem>
              <SidebarNavigationSeparator />
              <SidebarNavigationItem>
                <SidebarNavigationLink
                  href="#"
                  leading={
                    <Icon>
                      <LfApps />
                    </Icon>
                  }
                >
                  アプリ
                </SidebarNavigationLink>
              </SidebarNavigationItem>
            </SidebarNavigation>
            <SidebarNavigation
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--aegis-space-small)",
              }}
            >
              <Tooltip title="設定">
                <IconButton variant="plain" aria-label="設定">
                  <Icon>
                    <LfSetting />
                  </Icon>
                </IconButton>
              </Tooltip>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Avatar name="山田" size="small" color="teal" />
              </div>
            </SidebarNavigation>
          </div>
        </SidebarBody>
      </Sidebar>

      <SidebarInset>
        <PageLayout>
          <PageLayoutPane>
            <PageLayoutHeader>
              <ContentHeader>
                <ContentHeaderTitle>手続き</ContentHeaderTitle>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              <NavList size="medium">
                <NavList.Group>
                  <NavList.Item onClick={() => {}}>
                    <Text
                      as="span"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      入社手続き
                      <Icon size="small">
                        <LfAngleRightMiddle />
                      </Icon>
                    </Text>
                  </NavList.Item>
                  <NavList.Item onClick={() => {}} aria-current="page">
                    <Text
                      as="span"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      従業員情報変更
                      <Icon size="small">
                        <LfAngleRightMiddle />
                      </Icon>
                    </Text>
                  </NavList.Item>
                </NavList.Group>
              </NavList>
            </PageLayoutBody>
          </PageLayoutPane>

          <PageLayoutContent>
            <PageLayoutHeader>
              <ContentHeader
                trailing={
                  <Button leading={LfPlusLarge} variant="solid" color="neutral" size="medium">
                    情報変更手続きを作成
                  </Button>
                }
              >
                <ContentHeaderTitle>従業員情報変更</ContentHeaderTitle>
              </ContentHeader>
            </PageLayoutHeader>

            <PageLayoutBody>
              <Tab.Group variant="plain">
                <Tab.List bordered={false}>
                  <Tab trailing={<Badge color="subtle" count={9} />}>予約中</Tab>
                  <Tab trailing={<Badge color="subtle" count={1} />}>変更失敗</Tab>
                  <Tab>変更済み</Tab>
                  <Tab>下書き</Tab>
                </Tab.List>

                <Tab.Panels>
                  <Tab.Panel>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-medium)",
                      }}
                    >
                      <SegmentedControl defaultValue="all">
                        <SegmentedControl.Button value="all" trailing={<Badge color="subtle" count={4} />}>
                          一括の変更
                        </SegmentedControl.Button>
                        <SegmentedControl.Button value="individual" trailing={<Badge color="subtle" count={2} />}>
                          個人の変更
                        </SegmentedControl.Button>
                      </SegmentedControl>

                      <TableContainer>
                        <Table>
                          <Table.Head>
                            <Table.Row>
                              <Table.Cell as="th">ステータス</Table.Cell>
                              <Table.Cell as="th">情報変更グループ名</Table.Cell>
                              <Table.Cell as="th">作成元</Table.Cell>
                              <Table.Cell as="th">発令日</Table.Cell>
                              <Table.Cell as="th">最終更新日時</Table.Cell>
                              <Table.Cell as="th"> </Table.Cell>
                            </Table.Row>
                          </Table.Head>
                          <Table.Body>
                            {mockData.map((row) => (
                              <Table.Row key={row.id} style={{ cursor: "pointer" }}>
                                <Table.Cell>
                                  <StatusLabel {...getStatusStyle(row.status)}>
                                    {CHANGE_REQUEST_STATUS[row.status]}
                                  </StatusLabel>
                                </Table.Cell>
                                <Table.Cell>{row.groupName}</Table.Cell>
                                <Table.Cell>
                                  <Tag color="neutral" variant="fill">
                                    {row.createSource}
                                  </Tag>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text variant="component.medium">{row.issueDate}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text variant="component.medium">{row.updateDate}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <ChangeRequestActionMenu status={row.status} />
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table>
                      </TableContainer>

                      <Pagination totalCount={4} page={1} pageSize={4} />
                    </div>
                  </Tab.Panel>

                  <Tab.Panel>
                    <Text variant="body.medium">変更失敗タブの内容</Text>
                  </Tab.Panel>

                  <Tab.Panel>
                    <Text variant="body.medium">変更済みタブの内容</Text>
                  </Tab.Panel>

                  <Tab.Panel>
                    <Text variant="body.medium">下書きタブの内容</Text>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}
