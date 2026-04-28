import {
  LfAngleLeft,
  LfApps,
  LfCheckCircle,
  LfEllipsisDot,
  LfFilterAltHorizon,
  LfHome,
  LfList,
  LfPen,
  LfPlusLarge,
  LfSend,
  LfSetting,
  LfTrash,
  LfUngroup,
  LfUser,
  LfUserGroup,
  LfUsers,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Divider,
  FormControl,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  RangeDatePicker,
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
  Table,
  TableContainer,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";

// ===============================
// Types
// ===============================

type PermissionType = "PRESET" | "RULE_BASED";

type Permission = {
  id: string;
  name: string;
  type: PermissionType;
  description: string;
  holderCount: number;
  operationDateStart: Date | null;
  operationDateEnd: Date | null;
  lastUpdatedAt: Date;
};

type SelectedPermission = {
  id: string;
  name: string;
};

type PermissionHolder = {
  id: string;
  name: string;
  nameKana: string;
  department: string;
  isPermissionHolder: boolean;
};

// ===============================
// Mock Data
// ===============================

const mockPermissions: Permission[] = [
  // PRESET権限
  {
    id: "1",
    name: "システム管理者",
    type: "PRESET",
    description: "会社全体のシステム運用に関するすべての範囲を扱う最高レベルの権限です。",
    holderCount: 364,
    operationDateStart: new Date("2018-04-01"),
    operationDateEnd: null,
    lastUpdatedAt: new Date("2024-12-01T10:30:00"),
  },
  {
    id: "2",
    name: "人事管理者",
    type: "PRESET",
    description: "従業員情報の閲覧・編集、採用関連の操作が可能です。",
    holderCount: 25,
    operationDateStart: new Date("2020-01-01"),
    operationDateEnd: null,
    lastUpdatedAt: new Date("2024-11-15T14:00:00"),
  },
  {
    id: "3",
    name: "経理担当者",
    type: "PRESET",
    description: "給与計算、経費精算の確認・承認が可能です。",
    holderCount: 12,
    operationDateStart: new Date("2021-04-01"),
    operationDateEnd: null,
    lastUpdatedAt: new Date("2024-10-20T09:15:00"),
  },
  {
    id: "4",
    name: "部門マネージャー",
    type: "PRESET",
    description: "所属部門の従業員情報の閲覧、勤怠承認が可能です。",
    holderCount: 48,
    operationDateStart: new Date("2019-07-01"),
    operationDateEnd: null,
    lastUpdatedAt: new Date("2024-12-05T16:45:00"),
  },
  // RULE_BASED権限
  {
    id: "5",
    name: "営業部限定閲覧",
    type: "RULE_BASED",
    description: "営業部のデータのみ閲覧可能な権限です。",
    holderCount: 15,
    operationDateStart: new Date("2024-01-01"),
    operationDateEnd: new Date("2024-12-31"),
    lastUpdatedAt: new Date("2024-11-20T11:00:00"),
  },
  {
    id: "6",
    name: "開発部限定編集",
    type: "RULE_BASED",
    description: "開発部のプロジェクト情報を編集可能な権限です。",
    holderCount: 22,
    operationDateStart: new Date("2024-04-01"),
    operationDateEnd: new Date("2025-03-31"),
    lastUpdatedAt: new Date("2024-11-25T13:30:00"),
  },
  {
    id: "7",
    name: "採用担当限定",
    type: "RULE_BASED",
    description: "採用関連データのみアクセス可能な権限です。",
    holderCount: 8,
    operationDateStart: new Date("2024-06-01"),
    operationDateEnd: null,
    lastUpdatedAt: new Date("2024-12-01T08:00:00"),
  },
  {
    id: "8",
    name: "外部委託者用",
    type: "RULE_BASED",
    description: "外部委託者向けの限定的な閲覧権限です。",
    holderCount: 5,
    operationDateStart: new Date("2024-10-01"),
    operationDateEnd: new Date("2025-09-30"),
    lastUpdatedAt: new Date("2024-12-03T10:15:00"),
  },
];

const mockHolders: PermissionHolder[] = [
  { id: "h1", name: "須田 知世", nameKana: "スダ トモヨ", department: "ワークマネジメント", isPermissionHolder: true },
  { id: "h2", name: "田端 竜也", nameKana: "タバタ タツヤ", department: "人事部", isPermissionHolder: true },
  { id: "h3", name: "早川 慶太", nameKana: "ハヤカワ ケイタ", department: "開発部", isPermissionHolder: true },
  { id: "h4", name: "小市 麻由子", nameKana: "コイチ マユコ", department: "経理部", isPermissionHolder: true },
  { id: "h5", name: "有賀 雅功", nameKana: "アリガ マサノリ", department: "営業部", isPermissionHolder: false },
  { id: "h6", name: "川口 未来", nameKana: "カワグチ ミク", department: "マーケティング部", isPermissionHolder: false },
];

// ===============================
// Utility Functions
// ===============================

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateRange(start: Date | null, end: Date | null): string {
  if (!start && !end) return "--";
  const startStr = start ? formatDate(start) : "";
  const endStr = end ? formatDate(end) : "";
  return `${startStr} 〜 ${endStr}`;
}

// ===============================
// Dialog Components
// ===============================

// 権限保持者一覧ダイアログ（読み取り専用）
function PermissionHoldersDialog({
  open,
  onClose,
  permissionName,
  employees,
}: {
  open: boolean;
  onClose: () => void;
  permissionName: string;
  employees: PermissionHolder[];
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>権限保持者</ContentHeaderTitle>
            <ContentHeaderDescription>
              <Text variant="body.medium">{permissionName}</Text>
            </ContentHeaderDescription>
          </ContentHeader>
        </DialogHeader>

        <DialogBody>
          <Text variant="title.xxSmall" color="bold">
            {employees.length}人
          </Text>

          <TableContainer>
            <Table size="small">
              <Table.Head>
                <Table.Row>
                  <Table.Cell as="th">従業員名</Table.Cell>
                  <Table.Cell as="th">部門</Table.Cell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {employees.map((employee) => (
                  <Table.Row key={employee.id}>
                    <Table.Cell>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                        <Avatar name={employee.name} size="xSmall" />
                        <Text variant="component.medium" color="default">
                          {employee.name}
                        </Text>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="component.medium" color="default">
                        {employee.department}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </TableContainer>
        </DialogBody>

        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" color="neutral" onClick={onClose}>
              閉じる
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 権限保持者追加ダイアログ（ネスト用）
function PermissionAddDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>権限保持者を追加</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <Search placeholder="従業員名で検索" />
          <Divider />
          <div>
            <Text variant="title.xxSmall" color="bold">
              {mockHolders.filter((h) => !h.isPermissionHolder).length}人
            </Text>
            <ActionList size="large">
              {mockHolders
                .filter((h) => !h.isPermissionHolder)
                .map((employee) => (
                  <ActionList.Item key={employee.id}>
                    <ActionList.Body leading={<Avatar name={employee.name} size="small" />}>
                      <Text variant="body.medium" color="default">
                        {employee.name}
                      </Text>
                      <ActionList.Description>
                        <Text variant="caption.small" color="subtle">
                          {employee.nameKana}
                        </Text>
                      </ActionList.Description>
                    </ActionList.Body>
                    <Menu>
                      <Menu.Anchor>
                        <Tooltip title="その他のオプション">
                          <IconButton aria-label="その他のオプション" variant="plain" size="xSmall">
                            <Icon size="xSmall">
                              <LfEllipsisDot />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </Menu.Anchor>
                      <Menu.Box>
                        <ActionList>
                          <ActionList.Item>
                            <ActionList.Body
                              leading={
                                <Icon>
                                  <LfUser />
                                </Icon>
                              }
                            >
                              プロフィール
                            </ActionList.Body>
                          </ActionList.Item>
                          <ActionList.Item>
                            <ActionList.Body
                              leading={
                                <Icon>
                                  <LfUngroup />
                                </Icon>
                              }
                            >
                              権限保持者から削除
                            </ActionList.Body>
                          </ActionList.Item>
                        </ActionList>
                      </Menu.Box>
                    </Menu>
                  </ActionList.Item>
                ))}
            </ActionList>
          </div>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={onClose}>
              キャンセル
            </Button>
            <Button variant="solid" color="neutral">
              追加
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 権限保持者管理ダイアログ
function PermissionManagementDialog({
  open,
  onClose,
  permissionName,
  employees,
}: {
  open: boolean;
  onClose: () => void;
  permissionName: string;
  employees: PermissionHolder[];
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const permissionHolders = employees.filter((emp) => emp.isPermissionHolder);

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>権限保持者を管理</ContentHeaderTitle>
              <ContentHeaderDescription>
                <Text variant="body.medium">{permissionName}</Text>
              </ContentHeaderDescription>
            </ContentHeader>
          </DialogHeader>

          <DialogBody>
            <div style={{ marginBottom: "var(--aegis-space-medium)" }}>
              <Button
                variant="subtle"
                color="neutral"
                size="medium"
                leading={
                  <Icon size="medium">
                    <LfPlusLarge />
                  </Icon>
                }
                onClick={() => setIsAddDialogOpen(true)}
              >
                権限保持者を追加
              </Button>
            </div>
            <div>
              <Text variant="title.xxSmall" color="bold">
                {permissionHolders.length}人
              </Text>
              <ActionList size="large">
                {permissionHolders.map((employee) => (
                  <ActionList.Item key={employee.id}>
                    <ActionList.Body leading={<Avatar name={employee.name} size="small" />}>
                      <Text variant="body.medium" color="default">
                        {employee.name}
                      </Text>
                      <ActionList.Description>
                        <Text variant="caption.small" color="subtle">
                          {employee.nameKana}
                        </Text>
                      </ActionList.Description>
                    </ActionList.Body>
                    <Menu>
                      <Menu.Anchor>
                        <Tooltip title="その他のオプション">
                          <IconButton aria-label="その他のオプション" variant="plain" size="xSmall">
                            <Icon size="xSmall">
                              <LfEllipsisDot />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </Menu.Anchor>
                      <Menu.Box>
                        <ActionList>
                          <ActionList.Item>
                            <ActionList.Body
                              leading={
                                <Icon>
                                  <LfUser />
                                </Icon>
                              }
                            >
                              プロフィール
                            </ActionList.Body>
                          </ActionList.Item>
                          <ActionList.Item>
                            <ActionList.Body
                              leading={
                                <Icon>
                                  <LfUngroup />
                                </Icon>
                              }
                            >
                              権限保持者から削除
                            </ActionList.Body>
                          </ActionList.Item>
                        </ActionList>
                      </Menu.Box>
                    </Menu>
                  </ActionList.Item>
                ))}
              </ActionList>
            </div>
          </DialogBody>

          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" color="neutral" onClick={onClose}>
                キャンセル
              </Button>
              <Button variant="solid" color="neutral" onClick={onClose}>
                保存
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PermissionAddDialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
    </>
  );
}

// 運用日編集ダイアログ
function OperationDateEditDialog({
  open,
  onClose,
  permissionName,
}: {
  open: boolean;
  onClose: () => void;
  permissionName: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>運用日を編集</ContentHeaderTitle>
            <ContentHeaderDescription>
              <Text variant="body.medium">{permissionName}</Text>
            </ContentHeaderDescription>
          </ContentHeader>
        </DialogHeader>

        <DialogBody>
          <FormControl>
            <RangeDatePicker size="medium" aria-label="運用日の範囲" />
          </FormControl>
        </DialogBody>

        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" color="neutral" onClick={onClose}>
              キャンセル
            </Button>
            <Button variant="solid" color="neutral" onClick={onClose}>
              保存
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 権限削除確認ダイアログ
function PermissionDeleteDialog({
  open,
  onClose,
  permissionName,
}: {
  open: boolean;
  onClose: () => void;
  permissionName: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>権限を削除</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>

        <DialogBody>
          <Text variant="body.medium">
            「{permissionName}」を削除します。
            <br />
            この操作は元に戻せません。
          </Text>
        </DialogBody>

        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" color="neutral" onClick={onClose}>
              キャンセル
            </Button>
            <Button variant="solid" color="danger" onClick={onClose}>
              削除
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// アクションメニュー
function PermissionActionsMenu({
  permissionName,
  onEditOperationDate,
  onDeletePermission,
}: {
  permissionName: string;
  onEditOperationDate: () => void;
  onDeletePermission: () => void;
}) {
  return (
    <Menu>
      <Menu.Anchor>
        <Tooltip title={`${permissionName}のその他のオプション`}>
          <IconButton aria-label={`${permissionName}のその他のオプション`} variant="plain" size="medium">
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
              <ActionList.Body
                leading={
                  <Icon>
                    <LfPen />
                  </Icon>
                }
              >
                権限を編集
              </ActionList.Body>
            </ActionList.Item>
            <ActionList.Item onClick={onEditOperationDate}>
              <ActionList.Body
                leading={
                  <Icon>
                    <LfPen />
                  </Icon>
                }
              >
                運用日を編集
              </ActionList.Body>
            </ActionList.Item>
          </ActionList.Group>
          <ActionList.Group>
            <ActionList.Item onClick={onDeletePermission} color="danger">
              <ActionList.Body
                leading={
                  <Icon>
                    <LfTrash />
                  </Icon>
                }
              >
                権限を削除
              </ActionList.Body>
            </ActionList.Item>
          </ActionList.Group>
        </ActionList>
      </Menu.Box>
    </Menu>
  );
}

// ===============================
// Main Component
// ===============================

export default function SettingPermissionManagementPage() {
  const [isHoldersDialogOpen, setIsHoldersDialogOpen] = useState(false);
  const [isManagementDialogOpen, setIsManagementDialogOpen] = useState(false);
  const [isOperationDateDialogOpen, setIsOperationDateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<SelectedPermission | null>(null);

  const handleManagePermissionHolders = (permission: Permission) => {
    setSelectedPermission({ id: permission.id, name: permission.name });
    setIsManagementDialogOpen(true);
  };

  const handleEditOperationDate = (permission: Permission) => {
    setSelectedPermission({ id: permission.id, name: permission.name });
    setIsOperationDateDialogOpen(true);
  };

  const handleDeletePermission = (permission: Permission) => {
    setSelectedPermission({ id: permission.id, name: permission.name });
    setIsDeleteDialogOpen(true);
  };

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
                trailing={
                  <Button
                    variant="solid"
                    color="neutral"
                    leading={
                      <Icon size="small">
                        <LfPlusLarge />
                      </Icon>
                    }
                  >
                    権限を作成
                  </Button>
                }
              >
                <ContentHeaderTitle>権限管理</ContentHeaderTitle>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              <TableContainer>
                <Table size="small">
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell as="th">権限名</Table.Cell>
                      <Table.Cell as="th">説明</Table.Cell>
                      <Table.Cell as="th">権限保持者数</Table.Cell>
                      <Table.Cell as="th">運用日</Table.Cell>
                      <Table.Cell as="th">最終更新日時</Table.Cell>
                      <Table.Cell as="th" />
                      <Table.Cell as="th" />
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {mockPermissions.map((permission) => (
                      <Table.Row key={permission.id}>
                        <Table.Cell>
                          <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                            {permission.type === "PRESET" && (
                              <Icon size="small">
                                <LfFilterAltHorizon />
                              </Icon>
                            )}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <Text variant="component.medium" color="default">
                                {permission.name}
                              </Text>
                              {permission.type === "PRESET" && (
                                <Text variant="caption.small" color="subtle">
                                  プリセット
                                </Text>
                              )}
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="component.medium" color="default">
                            {permission.description}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="data.medium" color="default">
                            {permission.holderCount}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="data.medium" color="default">
                            {formatDateRange(permission.operationDateStart, permission.operationDateEnd)}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="data.medium" color="default">
                            {formatDateTime(permission.lastUpdatedAt)}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            variant="subtle"
                            size="small"
                            leading={
                              <Icon size="small">
                                <LfUsers />
                              </Icon>
                            }
                            onClick={() => handleManagePermissionHolders(permission)}
                          >
                            権限保持者を管理
                          </Button>
                        </Table.Cell>
                        <Table.Cell>
                          <PermissionActionsMenu
                            permissionName={permission.name}
                            onEditOperationDate={() => handleEditOperationDate(permission)}
                            onDeletePermission={() => handleDeletePermission(permission)}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </TableContainer>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>

        {/* ダイアログ */}
        <PermissionHoldersDialog
          open={isHoldersDialogOpen}
          onClose={() => setIsHoldersDialogOpen(false)}
          permissionName={selectedPermission?.name ?? ""}
          employees={mockHolders.filter((h) => h.isPermissionHolder)}
        />

        <PermissionManagementDialog
          open={isManagementDialogOpen}
          onClose={() => setIsManagementDialogOpen(false)}
          permissionName={selectedPermission?.name ?? ""}
          employees={mockHolders}
        />

        <OperationDateEditDialog
          open={isOperationDateDialogOpen}
          onClose={() => setIsOperationDateDialogOpen(false)}
          permissionName={selectedPermission?.name ?? ""}
        />

        <PermissionDeleteDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          permissionName={selectedPermission?.name ?? ""}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
