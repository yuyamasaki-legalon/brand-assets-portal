import {
  LfArrowUpRightFromSquare,
  LfCheckCircle,
  LfDownload,
  LfEllipsisDot,
  LfFilter,
  LfInformationCircle,
  LfPlusLarge,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Drawer,
  FileDrop,
  Form,
  FormControl,
  Icon,
  IconButton,
  Link,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  Pagination,
  Search,
  Select,
  Tab,
  Table,
  TableContainer,
  Tag,
  TagGroup,
  Text,
  Textarea,
  TextField,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { useRef, useState } from "react";
import { LocSidebarLayout } from "../_shared";
import { ManagementConsoleNavList } from "./_shared/ManagementConsoleNavList";

// =============================================================================
// Types
// =============================================================================

type UserStatus = "active" | "invited" | "suspended";

interface MockUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  avatarColor: "red" | "orange" | "teal" | "indigo" | "blue" | "purple" | "magenta";
  roles: { label: string; color: "red" | "orange" | "teal" | "indigo" | "blue" | "purple" | "magenta" }[];
}

interface FilterState {
  module: string;
  userType: string;
  adminPermission: string;
}

// =============================================================================
// Mock Data
// =============================================================================

const STATUS_LABELS: Record<UserStatus, string> = {
  active: "利用中",
  invited: "招待中",
  suspended: "利用停止",
};

const MODULE_OPTIONS = [
  { value: "", label: "すべて" },
  { value: "matter", label: "マターマネジメント" },
  { value: "contract", label: "コントラクトマネジメント" },
];

const USER_TYPE_OPTIONS = [
  { value: "", label: "すべて" },
  { value: "it-admin", label: "IT管理者" },
  { value: "standard", label: "標準ユーザー" },
];

const ADMIN_PERMISSION_OPTIONS = [
  { value: "", label: "すべて" },
  { value: "matter", label: "マターマネジメント" },
  { value: "contract", label: "コントラクトマネジメント" },
  { value: "esign", label: "電子契約" },
];

const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    name: "田中 太郎",
    email: "tanaka.taro@example.com",
    status: "active",
    avatarColor: "blue",
    roles: [
      { label: "IT管理者", color: "red" },
      { label: "コントラクトマネジメント +2", color: "blue" },
    ],
  },
  {
    id: "2",
    name: "鈴木 花子",
    email: "suzuki.hanako@example.com",
    status: "active",
    avatarColor: "magenta",
    roles: [{ label: "マターマネジメント", color: "orange" }],
  },
  {
    id: "3",
    name: "佐藤 次郎",
    email: "sato.jiro@example.com",
    status: "active",
    avatarColor: "teal",
    roles: [
      { label: "コントラクトマネジメント", color: "blue" },
      { label: "マターマネジメント", color: "orange" },
    ],
  },
  {
    id: "4",
    name: "山本 美咲",
    email: "yamamoto.misaki@example.com",
    status: "invited",
    avatarColor: "purple",
    roles: [],
  },
  {
    id: "5",
    name: "中村 健一",
    email: "nakamura.kenichi@example.com",
    status: "active",
    avatarColor: "indigo",
    roles: [{ label: "IT管理者", color: "red" }],
  },
  {
    id: "6",
    name: "小林 直子",
    email: "kobayashi.naoko@example.com",
    status: "active",
    avatarColor: "orange",
    roles: [
      { label: "コントラクトマネジメント", color: "blue" },
      { label: "マターマネジメント +1", color: "orange" },
    ],
  },
  {
    id: "7",
    name: "加藤 誠",
    email: "kato.makoto@example.com",
    status: "suspended",
    avatarColor: "red",
    roles: [{ label: "コントラクトマネジメント", color: "blue" }],
  },
  {
    id: "8",
    name: "吉田 真由美",
    email: "yoshida.mayumi@example.com",
    status: "active",
    avatarColor: "teal",
    roles: [{ label: "マターマネジメント", color: "orange" }],
  },
  {
    id: "9",
    name: "渡辺 大輔",
    email: "watanabe.daisuke@example.com",
    status: "active",
    avatarColor: "blue",
    roles: [
      { label: "IT管理者", color: "red" },
      { label: "コントラクトマネジメント", color: "blue" },
    ],
  },
  {
    id: "10",
    name: "伊藤 さくら",
    email: "ito.sakura@example.com",
    status: "invited",
    avatarColor: "magenta",
    roles: [],
  },
  {
    id: "11",
    name: "松本 隆",
    email: "matsumoto.takashi@example.com",
    status: "active",
    avatarColor: "indigo",
    roles: [{ label: "コントラクトマネジメント", color: "blue" }],
  },
  {
    id: "12",
    name: "井上 恵子",
    email: "inoue.keiko@example.com",
    status: "active",
    avatarColor: "purple",
    roles: [
      { label: "マターマネジメント", color: "orange" },
      { label: "コントラクトマネジメント +1", color: "blue" },
    ],
  },
  {
    id: "13",
    name: "木村 浩二",
    email: "kimura.koji@example.com",
    status: "active",
    avatarColor: "orange",
    roles: [{ label: "IT管理者", color: "red" }],
  },
  {
    id: "14",
    name: "林 愛",
    email: "hayashi.ai@example.com",
    status: "active",
    avatarColor: "teal",
    roles: [{ label: "マターマネジメント", color: "orange" }],
  },
  {
    id: "15",
    name: "斎藤 修",
    email: "saito.osamu@example.com",
    status: "suspended",
    avatarColor: "red",
    roles: [{ label: "コントラクトマネジメント", color: "blue" }],
  },
];

const TABS = [
  { label: "利用中", filter: "active" as const },
  { label: "招待中", filter: "invited" as const },
  { label: "利用停止", filter: "suspended" as const },
  { label: "すべて", filter: "all" as const },
];

const DEFAULT_FILTERS: FilterState = {
  module: "",
  userType: "",
  adminPermission: "",
};

// =============================================================================
// Component
// =============================================================================

/** ユーザー管理ページ。 */
export const ManagementConsoleUsers = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [bulkInviteDialogOpen, setBulkInviteDialogOpen] = useState(false);
  const [bulkUpdateDialogOpen, setBulkUpdateDialogOpen] = useState(false);
  const pageSize = 50;
  const drawerRoot = useRef<HTMLDivElement>(null);

  const isFilterActive = filters.module !== "" || filters.userType !== "" || filters.adminPermission !== "";

  const currentFilter = TABS[tabIndex].filter;

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesTab = currentFilter === "all" || user.status === currentFilter;
    const matchesSearch = !searchQuery || user.name.includes(searchQuery) || user.email.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const pagedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <ManagementConsoleNavList activePage="users" />

        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader
              trailing={
                <ButtonGroup>
                  <Button variant="solid" size="medium" leading={LfPlusLarge} onClick={() => setInviteDialogOpen(true)}>
                    ユーザーを招待
                  </Button>
                  <Menu placement="bottom-end">
                    <Menu.Anchor>
                      <Tooltip title="メニュー">
                        <IconButton variant="subtle" size="medium" aria-label="メニュー">
                          <Icon>
                            <LfEllipsisDot />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    </Menu.Anchor>
                    <Menu.Box width="xSmall">
                      <ActionList>
                        <ActionList.Group>
                          <ActionList.Item onClick={() => setBulkInviteDialogOpen(true)}>
                            <ActionList.Body>ユーザーを一括招待</ActionList.Body>
                          </ActionList.Item>
                          <ActionList.Item onClick={() => setBulkUpdateDialogOpen(true)}>
                            <ActionList.Body>ユーザーを一括変更</ActionList.Body>
                          </ActionList.Item>
                        </ActionList.Group>
                      </ActionList>
                    </Menu.Box>
                  </Menu>
                </ButtonGroup>
              }
            >
              <ContentHeaderTitle>ユーザー</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>

          <PageLayoutBody>
            <Tab.Group
              index={tabIndex}
              onChange={(index) => {
                setTabIndex(index);
                setPage(1);
              }}
            >
              <PageLayoutStickyContainer>
                <Toolbar>
                  <div style={{ overflow: "hidden" }}>
                    <Tab.List>
                      {TABS.map((tab) => (
                        <Tab key={tab.filter}>
                          <Text whiteSpace="nowrap">{tab.label}</Text>
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <ToolbarSpacer />
                  <ButtonGroup>
                    <Button
                      variant={filterOpen ? "subtle" : "plain"}
                      leading={
                        isFilterActive ? (
                          <Badge color="information">
                            <Icon>
                              <LfFilter />
                            </Icon>
                          </Badge>
                        ) : (
                          <Icon>
                            <LfFilter />
                          </Icon>
                        )
                      }
                      onClick={() => setFilterOpen((prev) => !prev)}
                    >
                      フィルター
                    </Button>
                    <Search
                      placeholder="ユーザー名・メールで検索"
                      shrinkOnBlur
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                      }}
                    />
                    <Tooltip title="エクスポート">
                      <IconButton variant="plain" size="medium" aria-label="エクスポート">
                        <Icon>
                          <LfDownload />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </Toolbar>
                {isFilterActive && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "var(--aegis-space-xSmall)",
                      padding: "var(--aegis-space-xSmall) var(--aegis-space-medium)",
                    }}
                  >
                    {filters.module && (
                      <Tag>モジュール: {MODULE_OPTIONS.find((o) => o.value === filters.module)?.label}</Tag>
                    )}
                    {filters.userType && (
                      <Tag>ユーザー種別: {USER_TYPE_OPTIONS.find((o) => o.value === filters.userType)?.label}</Tag>
                    )}
                    {filters.adminPermission && (
                      <Tag>
                        管理者権限: {ADMIN_PERMISSION_OPTIONS.find((o) => o.value === filters.adminPermission)?.label}
                      </Tag>
                    )}
                    <Button size="small" variant="plain" onClick={resetFilters}>
                      リセット
                    </Button>
                  </div>
                )}
              </PageLayoutStickyContainer>

              <div ref={drawerRoot}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-medium)",
                  }}
                >
                  <TableContainer>
                    <Table>
                      <Table.Head>
                        <Table.Row>
                          <Table.Cell>ユーザー名</Table.Cell>
                          <Table.Cell>メールアドレス</Table.Cell>
                          <Table.Cell>状態</Table.Cell>
                          <Table.Cell>ユーザー種別・管理者権限</Table.Cell>
                          <Table.ActionCell />
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {pagedUsers.map((user) => (
                          <Table.Row key={user.id}>
                            <Table.Cell>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "var(--aegis-space-xSmall)",
                                }}
                              >
                                <Avatar name={user.name} size="small" color={user.avatarColor} />
                                <Text variant="body.medium">{user.name}</Text>
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              <Text variant="body.medium">{user.email}</Text>
                            </Table.Cell>
                            <Table.Cell>
                              <Text variant="body.medium">{STATUS_LABELS[user.status]}</Text>
                            </Table.Cell>
                            <Table.Cell>
                              {user.roles.length > 0 && (
                                <TagGroup>
                                  {user.roles.map((role) => (
                                    <Tag key={role.label} size="small" variant="fill" color={role.color}>
                                      {role.label}
                                    </Tag>
                                  ))}
                                </TagGroup>
                              )}
                            </Table.Cell>
                            <Table.ActionCell>
                              <Menu placement="bottom-end">
                                <Menu.Anchor>
                                  <Tooltip title="メニュー">
                                    <IconButton variant="plain" size="small" aria-label={`${user.name}のメニュー`}>
                                      <Icon>
                                        <LfEllipsisDot />
                                      </Icon>
                                    </IconButton>
                                  </Tooltip>
                                </Menu.Anchor>
                                <Menu.Box width="xSmall">
                                  <ActionList>
                                    <ActionList.Group>
                                      <ActionList.Item>
                                        <ActionList.Body>編集</ActionList.Body>
                                      </ActionList.Item>
                                    </ActionList.Group>
                                    <ActionList.Group>
                                      <ActionList.Item color="danger">
                                        <ActionList.Body>利用停止</ActionList.Body>
                                      </ActionList.Item>
                                    </ActionList.Group>
                                  </ActionList>
                                </Menu.Box>
                              </Menu>
                            </Table.ActionCell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </TableContainer>

                  <Pagination
                    page={page}
                    pageSize={pageSize}
                    totalCount={filteredUsers.length}
                    onChange={(value) => setPage(value)}
                  />
                </div>
              </div>
            </Tab.Group>
          </PageLayoutBody>
        </PageLayoutContent>

        <Drawer
          open={filterOpen}
          onOpenChange={() => setFilterOpen((prev) => !prev)}
          position="end"
          root={drawerRoot}
          lockScroll={false}
        >
          <Drawer.Header>
            <ContentHeader>
              <ContentHeaderTitle>フィルター</ContentHeaderTitle>
            </ContentHeader>
          </Drawer.Header>
          <Drawer.Body>
            <Tab.Group>
              <Tab.List>
                <Tab>
                  <Text whiteSpace="nowrap">モジュール</Text>
                </Tab>
                <Tab>
                  <Text whiteSpace="nowrap">管理者権限</Text>
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div
                    style={{ display: "grid", gap: "var(--aegis-space-large)", paddingTop: "var(--aegis-space-large)" }}
                  >
                    <FormControl>
                      <FormControl.Label>モジュール</FormControl.Label>
                      <Select
                        options={MODULE_OPTIONS}
                        value={filters.module}
                        onChange={(value) => setFilters((prev) => ({ ...prev, module: value }))}
                        placeholder="すべて"
                      />
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>ユーザー種別</FormControl.Label>
                      <Select
                        options={USER_TYPE_OPTIONS}
                        value={filters.userType}
                        onChange={(value) => setFilters((prev) => ({ ...prev, userType: value }))}
                        placeholder="すべて"
                        disabled={!filters.module}
                      />
                    </FormControl>
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div
                    style={{ display: "grid", gap: "var(--aegis-space-large)", paddingTop: "var(--aegis-space-large)" }}
                  >
                    <FormControl>
                      <FormControl.Label>管理者権限</FormControl.Label>
                      <Select
                        options={ADMIN_PERMISSION_OPTIONS}
                        value={filters.adminPermission}
                        onChange={(value) => setFilters((prev) => ({ ...prev, adminPermission: value }))}
                        placeholder="すべて"
                      />
                    </FormControl>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </Drawer.Body>
          <Drawer.Footer>
            <ButtonGroup>
              <Button variant="plain" onClick={resetFilters}>
                リセット
              </Button>
              <Button onClick={() => setFilterOpen(false)}>閉じる</Button>
            </ButtonGroup>
          </Drawer.Footer>
        </Drawer>
      </PageLayout>

      <InviteUserDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
      <BulkInviteDialog open={bulkInviteDialogOpen} onOpenChange={setBulkInviteDialogOpen} />
      <BulkUpdateDialog open={bulkUpdateDialogOpen} onOpenChange={setBulkUpdateDialogOpen} />
    </LocSidebarLayout>
  );
};

// =============================================================================
// ユーザー招待ダイアログ
// =============================================================================

const MODULE_ROLE_OPTIONS = [
  { value: "none", label: "利用しない" },
  { value: "standard", label: "標準ユーザー" },
  { value: "admin", label: "管理者" },
];

const USER_TYPE_MODULES = [
  "マターマネジメント",
  "レビュー",
  "サイン",
  "LegalOnテンプレート",
  "MORI HAMADAライブラリー",
  "ユニバーサルアシスト",
  "LegalOnアシスタント",
] as const;

interface BulkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// =============================================================================
// ユーザー一括招待ダイアログ
// =============================================================================

const BulkInviteDialog = ({ open, onOpenChange }: BulkDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleClose = () => {
    onOpenChange(false);
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width="xLarge">
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>ユーザーを一括招待</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            <Text variant="body.medium">ユーザーをCSVファイルで一括登録できます。</Text>

            <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
              <Text variant="title.xSmall">前回の実行</Text>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                <Tag color="lime" leading={LfCheckCircle}>
                  成功
                </Tag>
                <Text variant="body.medium">取り込みが正常に完了しました。</Text>
              </div>
            </div>

            <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
              <Text variant="title.xSmall">手順1: テンプレートをダウンロード</Text>
              <Text variant="body.medium" color="subtle">
                ダウンロードしたテンプレートを編集し、CSVファイル（UTF-8形式）として保存してください。
              </Text>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
                <Button variant="subtle" leading={LfDownload}>
                  一括招待テンプレートをダウンロード
                </Button>
                <Link href="#" onClick={(e) => e.preventDefault()} trailing={LfArrowUpRightFromSquare}>
                  記入例
                </Link>
              </div>
            </div>

            <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
              <Text variant="title.xSmall">手順2: 編集したCSVファイルをアップロード</Text>
              <FileDrop
                accept={[".csv"]}
                uploadButtonTitle="ファイルを選択"
                onSelectFiles={(files) => setSelectedFile(files[0] ?? null)}
              >
                <Text variant="body.medium" color="subtle" whiteSpace="pre-wrap">
                  {"ファイルをドロップするか\nボタンから選択してアップロードできます。"}
                </Text>
              </FileDrop>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={handleClose}>
              キャンセル
            </Button>
            <Button disabled={!selectedFile} onClick={handleClose}>
              取り込み
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// =============================================================================
// ユーザー一括変更ダイアログ
// =============================================================================

const USER_GROUP_OPTIONS = [
  { value: "", label: "すべてのユーザー" },
  { value: "legal", label: "法務部" },
  { value: "sales", label: "営業部" },
  { value: "hr", label: "人事部" },
];

const BulkUpdateDialog = ({ open, onOpenChange }: BulkDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportGroup, setExportGroup] = useState("");

  const handleClose = () => {
    onOpenChange(false);
    setSelectedFile(null);
    setExportGroup("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width="xLarge">
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>ユーザーを一括管理</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            <Text variant="body.medium">ユーザーをCSVファイルで一括編集できます。</Text>

            <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
              <Text variant="title.xSmall">手順1：CSVファイルをエクスポート</Text>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                <div style={{ flex: 1 }}>
                  <Select
                    options={USER_GROUP_OPTIONS}
                    value={exportGroup}
                    onChange={(value) => setExportGroup(value)}
                    placeholder="ユーザーグループを検索"
                  />
                </div>
                <Button variant="subtle" leading={LfDownload}>
                  エクスポート
                </Button>
              </div>
            </div>

            <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
              <Text variant="title.xSmall">手順2：CSVファイルを編集</Text>
              <Link
                href="#"
                onClick={(e) => e.preventDefault()}
                leading={LfInformationCircle}
                trailing={LfArrowUpRightFromSquare}
              >
                記入例
              </Link>
            </div>

            <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
              <Text variant="title.xSmall">手順3：編集したCSVファイルをアップロード</Text>
              <FileDrop
                accept={[".csv"]}
                uploadButtonTitle="ファイルを選択"
                onSelectFiles={(files) => setSelectedFile(files[0] ?? null)}
              >
                <Text variant="body.medium" color="subtle" whiteSpace="pre-wrap">
                  {"ファイルをドロップするか\nボタンから選択してアップロードできます。"}
                </Text>
              </FileDrop>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={handleClose}>
              キャンセル
            </Button>
            <Button disabled={!selectedFile} onClick={handleClose}>
              インポート
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// =============================================================================
// ユーザー招待ダイアログ
// =============================================================================

const InviteUserDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [moduleRoles, setModuleRoles] = useState<Record<string, string>>(
    Object.fromEntries(USER_TYPE_MODULES.map((m) => [m, "none"])),
  );
  const [adminPermission, setAdminPermission] = useState("");
  const [itAdmin, setItAdmin] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setUserName("");
    setEmail("");
    setModuleRoles(Object.fromEntries(USER_TYPE_MODULES.map((m) => [m, "none"])));
    setAdminPermission("");
    setItAdmin(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width="xLarge">
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>ユーザーを招待</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <Form>
            <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
              <FormControl required>
                <FormControl.Label>ユーザー名</FormControl.Label>
                <TextField
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="ユーザー名を入力"
                />
              </FormControl>

              <FormControl required>
                <FormControl.Label>メールアドレス</FormControl.Label>
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="メールアドレスを入力"
                />
              </FormControl>

              <div>
                <Text variant="title.xSmall">ユーザー種別</Text>
                <div style={{ marginTop: "var(--aegis-space-xSmall)" }}>
                  <Text variant="body.medium" color="subtle">
                    利用するモジュールをチェックしてください。
                  </Text>
                </div>
                <div
                  style={{
                    display: "grid",
                    gap: "var(--aegis-space-medium)",
                    marginTop: "var(--aegis-space-medium)",
                  }}
                >
                  {USER_TYPE_MODULES.map((moduleName) => (
                    <div
                      key={moduleName}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "var(--aegis-space-medium)",
                      }}
                    >
                      <Text variant="body.medium">{moduleName}</Text>
                      <div style={{ width: "200px", flexShrink: 0 }}>
                        <Select
                          options={MODULE_ROLE_OPTIONS}
                          value={moduleRoles[moduleName]}
                          onChange={(value) => setModuleRoles((prev) => ({ ...prev, [moduleName]: value }))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Text variant="title.xSmall">管理者権限</Text>
                <div
                  style={{ display: "grid", gap: "var(--aegis-space-medium)", marginTop: "var(--aegis-space-medium)" }}
                >
                  <FormControl>
                    <FormControl.Label>モジュール管理者権限</FormControl.Label>
                    <Textarea
                      value={adminPermission}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdminPermission(e.target.value)}
                      placeholder="各モジュールの設定を利用できます。"
                    />
                  </FormControl>
                  <Checkbox checked={itAdmin} onChange={(e) => setItAdmin(e.target.checked)}>
                    IT管理者権限
                  </Checkbox>
                  <Text variant="body.small" color="subtle">
                    IT管理者は、「管理者設定」を利用できます。
                  </Text>
                </div>
              </div>
            </div>
          </Form>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={handleClose}>
              キャンセル
            </Button>
            <Button disabled={!userName.trim() || !email.trim()} onClick={handleClose}>
              招待
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
