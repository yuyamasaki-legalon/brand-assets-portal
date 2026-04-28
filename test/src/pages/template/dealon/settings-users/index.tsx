import { LfAngleDownMiddle, LfDownload, LfFileCsv, LfPen, LfTrash, LfUser } from "@legalforce/aegis-icons";
import {
  Avatar,
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FileDrop,
  FormControl,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Select,
  StatusLabel,
  Tag,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useMemo } from "react";
import { SettingsNavList } from "../_shared";
import sharedStyles from "../_shared/settings.module.css";
import { DealOnLayout } from "../layout";
import { useCsvDialog } from "./hooks/useCsvDialog";
import { useDeleteUserDialog } from "./hooks/useDeleteUserDialog";
import { useEditUserDialog } from "./hooks/useEditUserDialog";
import { useInviteDialog } from "./hooks/useInviteDialog";
import { useUserList } from "./hooks/useUserList";
import styles from "./index.module.css";
import type { UserItem, UserRole } from "./mock";
import { initialUsers, ROLE_OPTIONS, statusColorMap } from "./mock";

// =============================================================================
// Page component
// =============================================================================

export default function DealOnSettingsUsersPage() {
  const { users, setUsers } = useUserList(initialUsers);
  const inviteDialog = useInviteDialog(setUsers);
  const editDialog = useEditUserDialog(setUsers);
  const deleteDialog = useDeleteUserDialog(setUsers);
  const csvDialog = useCsvDialog();

  // ---------------------------------------------------------------------------
  // DataTable columns
  // ---------------------------------------------------------------------------

  const columns: DataTableColumnDef<UserItem, string>[] = useMemo(
    () => [
      {
        id: "userName",
        name: "ユーザー名",
        getValue: (row): string => row.name,
        renderCell: ({ row }) => (
          <DataTableCell>
            <div className={styles.userCell}>
              <Avatar name={row.name} size="small" />
              <div className={styles.userInfo}>
                <Text variant="body.small" numberOfLines={1}>
                  {row.name}
                </Text>
                <Text variant="body.xSmall" color="subtle" numberOfLines={1}>
                  {row.email}
                </Text>
              </div>
            </div>
          </DataTableCell>
        ),
        sortable: true,
      },
      {
        id: "role",
        name: "ロール",
        getValue: (row): string => row.role,
        renderCell: ({ row }) => (
          <DataTableCell>
            <Tag variant="outline" size="small" color={row.role === "Admin" ? "blue" : "neutral"}>
              {row.role}
            </Tag>
          </DataTableCell>
        ),
        sortable: true,
      },
      {
        id: "status",
        name: "ステータス",
        getValue: (row): string => row.status,
        renderCell: ({ row }) => (
          <DataTableCell>
            <StatusLabel variant="fill" size="small" color={statusColorMap[row.status]}>
              {row.status}
            </StatusLabel>
          </DataTableCell>
        ),
        sortable: true,
      },
      {
        id: "invitedAt",
        name: "招待日時",
        getValue: (row): string => row.invitedAt,
        renderCell: ({ value }) => (
          <DataTableCell>
            <Text variant="body.small" color="subtle">
              {value}
            </Text>
          </DataTableCell>
        ),
        sortable: true,
      },
      {
        id: "lastLoginAt",
        name: "最終ログイン",
        getValue: (row): string => row.lastLoginAt ?? "",
        renderCell: ({ row }) => (
          <DataTableCell>
            <Text variant="body.small" color="subtle">
              {row.lastLoginAt ?? "-"}
            </Text>
          </DataTableCell>
        ),
        sortable: true,
      },
      {
        id: "actions",
        name: "操作",
        getValue: (): string => "",
        renderCell: ({ row }) => (
          <DataTableCell>
            <div className={styles.actionButtons}>
              <Tooltip title="編集">
                <IconButton
                  variant="plain"
                  size="xSmall"
                  aria-label="編集"
                  onClick={() => editDialog.handleOpenEdit(row)}
                >
                  <Icon>
                    <LfPen />
                  </Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="削除">
                <IconButton
                  variant="plain"
                  size="xSmall"
                  aria-label="削除"
                  onClick={() => deleteDialog.handleOpenDelete(row)}
                >
                  <Icon>
                    <LfTrash />
                  </Icon>
                </IconButton>
              </Tooltip>
            </div>
          </DataTableCell>
        ),
        sortable: false,
      },
    ],
    [editDialog.handleOpenEdit, deleteDialog.handleOpenDelete],
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <DealOnLayout>
      <PageLayoutContent scrollBehavior="outside">
        <PageLayoutHeader>
          <ContentHeader
            trailing={
              <Menu>
                <MenuTrigger>
                  <Button variant="solid" size="small" trailing={LfAngleDownMiddle}>
                    ユーザーを登録
                  </Button>
                </MenuTrigger>
                <MenuContent side="bottom" align="end">
                  <MenuItem
                    leading={
                      <Icon>
                        <LfUser />
                      </Icon>
                    }
                    onClick={inviteDialog.handleOpenInvite}
                  >
                    単一登録
                  </MenuItem>
                  <MenuItem
                    leading={
                      <Icon>
                        <LfFileCsv />
                      </Icon>
                    }
                    onClick={csvDialog.handleOpenCsv}
                  >
                    CSV一括登録
                  </MenuItem>
                </MenuContent>
              </Menu>
            }
          >
            <ContentHeaderTitle>ユーザー管理</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div className={sharedStyles.settingsLayout}>
            {/* Sidebar */}
            <aside className={sharedStyles.sidebar}>
              <SettingsNavList />
            </aside>

            {/* Content */}
            <div className={sharedStyles.content}>
              <DataTable
                columns={columns}
                rows={users}
                getRowId={(row) => row.id}
                stickyHeader
                defaultSorting={[{ id: "userName", desc: false }]}
              />
            </div>
          </div>

          {/* Invite user dialog */}
          <Dialog
            open={inviteDialog.inviteDialogOpen}
            onOpenChange={(open) => !open && inviteDialog.handleCancelInvite()}
          >
            <DialogContent>
              <DialogHeader>
                <ContentHeader>
                  <ContentHeaderTitle>ユーザーを登録</ContentHeaderTitle>
                </ContentHeader>
              </DialogHeader>
              <DialogBody>
                <div className={sharedStyles.formStack}>
                  <FormControl required>
                    <FormControl.Label>氏名</FormControl.Label>
                    <TextField
                      value={inviteDialog.newUserName}
                      onChange={(e) => inviteDialog.setNewUserName(e.target.value)}
                      placeholder="山田 太郎"
                    />
                  </FormControl>
                  <FormControl required>
                    <FormControl.Label>メールアドレス</FormControl.Label>
                    <TextField
                      value={inviteDialog.newUserEmail}
                      onChange={(e) => inviteDialog.setNewUserEmail(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </FormControl>
                  <FormControl required>
                    <FormControl.Label>ロール</FormControl.Label>
                    <Select
                      value={inviteDialog.newUserRole}
                      onChange={(v) => inviteDialog.setNewUserRole((v || "Member") as UserRole)}
                      options={ROLE_OPTIONS}
                    />
                  </FormControl>
                  <Text variant="body.small" color="subtle">
                    招待メールが送信され、72時間以内にパスワードを設定する必要があります。
                  </Text>
                </div>
              </DialogBody>
              <DialogFooter>
                <ButtonGroup>
                  <Button variant="plain" onClick={inviteDialog.handleCancelInvite}>
                    キャンセル
                  </Button>
                  <Button variant="solid" onClick={inviteDialog.handleInvite}>
                    登録
                  </Button>
                </ButtonGroup>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* CSV bulk registration dialog */}
          <Dialog open={csvDialog.csvDialogOpen} onOpenChange={(open) => !open && csvDialog.handleCancelCsv()}>
            <DialogContent width="large">
              <DialogHeader>
                <ContentHeader
                  trailing={
                    <Button variant="plain" size="small" leading={LfDownload}>
                      テンプレートをダウンロード
                    </Button>
                  }
                >
                  <ContentHeaderTitle>ユーザーを一括登録</ContentHeaderTitle>
                </ContentHeader>
              </DialogHeader>
              <DialogBody>
                <div className={sharedStyles.formStack}>
                  <Text variant="body.medium">
                    ユーザーデータをCSVファイルから一括登録できます。同時に登録できるのは100件までです。
                  </Text>
                  <FileDrop accept={[".csv"]} uploadButtonTitle="ファイルを選択">
                    <Text variant="body.medium" color="subtle" whiteSpace="pre-wrap" className={styles.textCenter}>
                      ファイルをドロップするか{`\n`}ボタンから選択してアップロードできます。
                    </Text>
                  </FileDrop>
                </div>
              </DialogBody>
              <DialogFooter>
                <ButtonGroup>
                  <Button variant="plain" onClick={csvDialog.handleCancelCsv}>
                    キャンセル
                  </Button>
                  <Button variant="solid" disabled>
                    登録
                  </Button>
                </ButtonGroup>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit user dialog */}
          <Dialog open={editDialog.editDialogOpen} onOpenChange={(open) => !open && editDialog.handleCancelEdit()}>
            <DialogContent>
              <DialogHeader>
                <ContentHeader>
                  <ContentHeaderTitle>ユーザーを編集</ContentHeaderTitle>
                </ContentHeader>
              </DialogHeader>
              <DialogBody>
                <div className={sharedStyles.formStack}>
                  <FormControl>
                    <FormControl.Label>氏名</FormControl.Label>
                    <TextField value={editDialog.editName} onChange={(e) => editDialog.setEditName(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>ロール</FormControl.Label>
                    <Select
                      value={editDialog.editRole}
                      onChange={(v) => editDialog.setEditRole((v || "Member") as UserRole)}
                      options={ROLE_OPTIONS}
                      width="auto"
                    />
                  </FormControl>
                </div>
              </DialogBody>
              <DialogFooter>
                <ButtonGroup>
                  <Button variant="plain" onClick={editDialog.handleCancelEdit}>
                    キャンセル
                  </Button>
                  <Button variant="solid" onClick={editDialog.handleSaveEdit}>
                    保存
                  </Button>
                </ButtonGroup>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete confirmation dialog */}
          <Dialog
            open={deleteDialog.deleteDialogOpen}
            onOpenChange={(open) => !open && deleteDialog.handleCancelDelete()}
          >
            <DialogContent width="small">
              <DialogHeader>
                <ContentHeader>
                  <ContentHeaderTitle>ユーザーを削除</ContentHeaderTitle>
                </ContentHeader>
              </DialogHeader>
              <DialogBody>
                <Text variant="body.medium">
                  {deleteDialog.deletingUser && (
                    <>
                      「{deleteDialog.deletingUser.name}」({deleteDialog.deletingUser.email}
                      )を削除してもよろしいですか？
                    </>
                  )}
                </Text>
              </DialogBody>
              <DialogFooter>
                <ButtonGroup>
                  <Button variant="plain" onClick={deleteDialog.handleCancelDelete}>
                    キャンセル
                  </Button>
                  <Button variant="solid" color="danger" onClick={deleteDialog.handleConfirmDelete}>
                    削除
                  </Button>
                </ButtonGroup>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageLayoutBody>
      </PageLayoutContent>
    </DealOnLayout>
  );
}
