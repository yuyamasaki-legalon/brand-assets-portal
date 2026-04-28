import {
  LfAngleLeft,
  LfApps,
  LfCheckCircle,
  LfCloseCircle,
  LfEllipsisDot,
  LfHome,
  LfList,
  LfSend,
  LfSetting,
  LfUserGroup,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Button,
  ContentHeader,
  ContentHeaderTitle,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Pagination,
  type PaginationOptions,
  Search,
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
  Switch,
  Table,
  TableContainer,
  Text,
  Toolbar,
  Tooltip,
} from "@legalforce/aegis-react";
import { type ChangeEvent, useMemo, useState } from "react";

type InvitationStatus = "loggedIn" | "invited" | "notInvited";

type Employee = {
  id: string;
  employeeNumber: string;
  name: string;
  employmentType: string;
  employmentStatus: string;
  email: string;
  invitationStatus: InvitationStatus;
  lastLoginAt: string | null;
};

const mockEmployees: Employee[] = [
  {
    id: "1",
    employeeNumber: "1234500101",
    name: "須田 知世",
    employmentType: "正社員",
    employmentStatus: "在職中",
    email: "hata_kaoru@example.com",
    invitationStatus: "loggedIn",
    lastLoginAt: "2023/02/06 22:22",
  },
  {
    id: "2",
    employeeNumber: "1234500247",
    name: "田端 竜也",
    employmentType: "正社員",
    employmentStatus: "在職中",
    email: "utsunomiya_ken@example.com",
    invitationStatus: "invited",
    lastLoginAt: null,
  },
  {
    id: "3",
    employeeNumber: "1234500389",
    name: "早川 慶太",
    employmentType: "正社員",
    employmentStatus: "在職中",
    email: "onodera_haruka@example.com",
    invitationStatus: "invited",
    lastLoginAt: null,
  },
  {
    id: "4",
    employeeNumber: "1234500412",
    name: "小市 麻由子",
    employmentType: "正社員",
    employmentStatus: "在職中",
    email: "kawahara_ken@example.com",
    invitationStatus: "loggedIn",
    lastLoginAt: "2023/02/06 22:22",
  },
  {
    id: "5",
    employeeNumber: "1234500556",
    name: "有賀 雅功",
    employmentType: "正社員",
    employmentStatus: "在職中",
    email: "oono_masaya@example.com",
    invitationStatus: "notInvited",
    lastLoginAt: null,
  },
  {
    id: "6",
    employeeNumber: "1234500623",
    name: "川口 未来",
    employmentType: "正社員",
    employmentStatus: "在職中",
    email: "ootake_masaya@example.com",
    invitationStatus: "notInvited",
    lastLoginAt: null,
  },
  {
    id: "7",
    employeeNumber: "1234500718",
    name: "藤野 勇",
    employmentType: "正社員",
    employmentStatus: "在職中",
    email: "shida_harumi@example.com",
    invitationStatus: "invited",
    lastLoginAt: null,
  },
  {
    id: "8",
    employeeNumber: "1234500834",
    name: "城田 美佐",
    employmentType: "正社員",
    employmentStatus: "在職中",
    email: "ayanokouji_shunsuke@example.com",
    invitationStatus: "loggedIn",
    lastLoginAt: "2023/02/06 22:22",
  },
  {
    id: "9",
    employeeNumber: "1234500945",
    name: "根岸 直人",
    employmentType: "正社員",
    employmentStatus: "在職中",
    email: "ookuma_tatsuya@example.com",
    invitationStatus: "notInvited",
    lastLoginAt: null,
  },
  {
    id: "10",
    employeeNumber: "1234501067",
    name: "大竹 将也",
    employmentType: "正社員",
    employmentStatus: "在職中",
    email: "ookuma_tatsuya@example.com",
    invitationStatus: "notInvited",
    lastLoginAt: null,
  },
  {
    id: "11",
    employeeNumber: "1234501123",
    name: "川原 建",
    employmentType: "正社員",
    employmentStatus: "在職中",
    email: "kawauchi_ken@example.com",
    invitationStatus: "notInvited",
    lastLoginAt: null,
  },
  {
    id: "12",
    employeeNumber: "1234501298",
    name: "山根 崇史",
    employmentType: "正社員",
    employmentStatus: "在職中",
    email: "nakatani_ryuunosuke@example.com",
    invitationStatus: "notInvited",
    lastLoginAt: null,
  },
];

const statusConfig: Record<
  InvitationStatus,
  { label: string; color: "teal" | "neutral"; variant: "outline" | "fill" }
> = {
  loggedIn: { label: "ログイン済み", color: "teal", variant: "fill" },
  invited: { label: "招待済み", color: "neutral", variant: "outline" },
  notInvited: { label: "未招待", color: "neutral", variant: "outline" },
};

export default function SettingInvitePage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(["2", "3", "5"]));
  const [showNotLoggedInOnly, setShowNotLoggedInOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filteredEmployees = useMemo(() => {
    let result = mockEmployees;

    if (showNotLoggedInOnly) {
      result = result.filter((emp) => emp.invitationStatus !== "loggedIn");
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((emp) => emp.name.toLowerCase().includes(query));
    }

    return result;
  }, [showNotLoggedInOnly, searchQuery]);

  const pagedEmployees = filteredEmployees.slice((page - 1) * pageSize, page * pageSize);
  const totalCount = filteredEmployees.length;

  const isAllSelected = pagedEmployees.length > 0 && pagedEmployees.every((emp) => selectedIds.has(emp.id));
  const isSomeSelected = pagedEmployees.some((emp) => selectedIds.has(emp.id));
  const isIndeterminate = isSomeSelected && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      const newSelected = new Set(selectedIds);
      for (const emp of pagedEmployees) {
        newSelected.delete(emp.id);
      }
      setSelectedIds(newSelected);
    } else {
      const newSelected = new Set(selectedIds);
      for (const emp of pagedEmployees) {
        newSelected.add(emp.id);
      }
      setSelectedIds(newSelected);
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleFilterChange = (checked: boolean) => {
    setShowNotLoggedInOnly(checked);
    setPage(1);
  };

  const handlePagination: Exclude<PaginationOptions["onChange"], undefined> = (value, action) => {
    if (action === "go-to-first") {
      setPage(1);
      return;
    }
    setPage(value);
  };

  const selectedCount = selectedIds.size;

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
          <PageLayoutContent>
            <PageLayoutHeader>
              <ContentHeader
                leading={
                  <Tooltip title="戻る">
                    <IconButton aria-label="戻る" variant="plain">
                      <Icon size="large">
                        <LfAngleLeft />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                }
              >
                <ContentHeaderTitle>従業員を招待</ContentHeaderTitle>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                <Toolbar>
                  {selectedCount > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
                      <Text variant="body.medium">{selectedCount}件選択中</Text>
                      <Button variant="plain" size="medium" leading={<Icon source={LfSend} />}>
                        招待を再送
                      </Button>
                      <Button variant="plain" size="medium" color="danger" leading={<Icon source={LfCloseCircle} />}>
                        招待を取り消し
                      </Button>
                    </div>
                  )}
                  <Toolbar.Spacer />
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                    <Switch checked={showNotLoggedInOnly} onChange={(e) => handleFilterChange(e.target.checked)}>
                      未ログインのみ
                    </Switch>
                    <Search value={searchQuery} onChange={handleSearchChange} placeholder="従業員名で検索" />
                  </div>
                </Toolbar>

                <TableContainer>
                  <Table size="small">
                    <Table.Head>
                      <Table.Row>
                        <Table.CheckboxCell
                          checked={isAllSelected}
                          indeterminate={isIndeterminate}
                          onChange={handleSelectAll}
                        />
                        <Table.Cell as="th">従業員番号</Table.Cell>
                        <Table.Cell as="th">従業員名</Table.Cell>
                        <Table.Cell as="th">雇用形態</Table.Cell>
                        <Table.Cell as="th">在籍状況</Table.Cell>
                        <Table.Cell as="th">社用メールアドレス</Table.Cell>
                        <Table.Cell as="th">ステータス</Table.Cell>
                        <Table.Cell as="th">最終ログイン日時</Table.Cell>
                        <Table.Cell as="th" />
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {pagedEmployees.map((employee) => {
                        const isSelected = selectedIds.has(employee.id);
                        const status = statusConfig[employee.invitationStatus];

                        return (
                          <Table.Row key={employee.id} selected={isSelected}>
                            <Table.CheckboxCell checked={isSelected} onChange={() => handleSelectRow(employee.id)} />
                            <Table.Cell>{employee.employeeNumber}</Table.Cell>
                            <Table.Cell>
                              <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                                <Avatar name={employee.name} size="xSmall" />
                                <Text>{employee.name}</Text>
                              </div>
                            </Table.Cell>
                            <Table.Cell>{employee.employmentType}</Table.Cell>
                            <Table.Cell>{employee.employmentStatus}</Table.Cell>
                            <Table.Cell>{employee.email}</Table.Cell>
                            <Table.Cell>
                              <StatusLabel color={status.color} variant={status.variant}>
                                {status.label}
                              </StatusLabel>
                            </Table.Cell>
                            <Table.Cell>{employee.lastLoginAt ?? "--"}</Table.Cell>
                            <Table.Cell>
                              <Menu placement="bottom-end">
                                <Menu.Anchor>
                                  <Tooltip title="メニューを開く">
                                    <IconButton aria-label="メニューを開く" variant="plain">
                                      <Icon>
                                        <LfEllipsisDot />
                                      </Icon>
                                    </IconButton>
                                  </Tooltip>
                                </Menu.Anchor>
                                <Menu.Box>
                                  <ActionList>
                                    <ActionList.Group>
                                      <ActionList.Item>
                                        <ActionList.Body
                                          leading={
                                            <Icon>
                                              <LfSend />
                                            </Icon>
                                          }
                                        >
                                          招待を再送
                                        </ActionList.Body>
                                      </ActionList.Item>
                                      <ActionList.Item color="danger">
                                        <ActionList.Body
                                          leading={
                                            <Icon>
                                              <LfCloseCircle />
                                            </Icon>
                                          }
                                        >
                                          招待を取り消し
                                        </ActionList.Body>
                                      </ActionList.Item>
                                    </ActionList.Group>
                                  </ActionList>
                                </Menu.Box>
                              </Menu>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table>
                </TableContainer>

                <Pagination page={page} pageSize={pageSize} totalCount={totalCount} onChange={handlePagination} />
              </div>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}
