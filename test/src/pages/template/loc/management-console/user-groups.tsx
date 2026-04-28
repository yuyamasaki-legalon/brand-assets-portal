import {
  LfArrowUpRightFromSquare,
  LfDownload,
  LfEllipsisDot,
  LfPlusLarge,
  LfUserGroup,
  LfUsers,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Button,
  ButtonGroup,
  Checkbox,
  ContentHeader,
  ContentHeaderTitle,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DataTableHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FileDrop,
  FormControl,
  Icon,
  IconButton,
  Link,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Search,
  Select,
  Text,
  Textarea,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import { LocSidebarLayout } from "../_shared";
import { ManagementConsoleNavList } from "./_shared/ManagementConsoleNavList";

// =============================================================================
// Types
// =============================================================================

interface MockUserGroup {
  id: string;
  name: string;
  memberCount: number;
  description: string;
  scope: "normal" | "allUsers";
}

// =============================================================================
// Mock Data
// =============================================================================

const MOCK_USER_GROUPS: MockUserGroup[] = [
  {
    id: "1",
    name: "すべてのユーザー",
    memberCount: 73,
    description: "すべてのユーザーが自動的に含まれます。",
    scope: "allUsers",
  },
  {
    id: "2",
    name: "LCS-32518-debug-shared-dialog",
    memberCount: 1,
    description: "For https://legalforce.atlassian.net/browse/LCS-32518",
    scope: "normal",
  },
  {
    id: "3",
    name: "frontend",
    memberCount: 4,
    description: "",
    scope: "normal",
  },
  {
    id: "4",
    name: "s",
    memberCount: 0,
    description: "",
    scope: "normal",
  },
  {
    id: "5",
    name: "standard test",
    memberCount: 1,
    description: "",
    scope: "normal",
  },
  {
    id: "6",
    name: "test",
    memberCount: 4,
    description: "testtest",
    scope: "normal",
  },
  {
    id: "7",
    name: "test2",
    memberCount: 0,
    description: "あああああああああああああああああああ",
    scope: "normal",
  },
  {
    id: "8",
    name: "test3",
    memberCount: 0,
    description: "",
    scope: "normal",
  },
  {
    id: "9",
    name: "あ",
    memberCount: 0,
    description: "",
    scope: "normal",
  },
];

// =============================================================================
// Columns
// =============================================================================

const columns: DataTableColumnDef<MockUserGroup, string | number>[] = [
  {
    id: "name",
    name: "ユーザーグループ名",
    width: "small",
    getValue: (row): string => row.name,
    sortable: false,
    pinnable: false,
    reorderable: false,
    renderCell: ({ value }) => (
      <DataTableCell leading={<Icon size="small" source={LfUserGroup} />}>
        <Tooltip title={value} onlyOnOverflow placement="bottom-start">
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
  },
  {
    id: "memberCount",
    name: "ユーザー数",
    width: "fit",
    getValue: (row): number => row.memberCount,
    sortable: false,
    pinnable: false,
    reorderable: false,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Text>{value.toLocaleString()}</Text>
      </DataTableCell>
    ),
  },
  {
    id: "description",
    name: "説明",
    width: "auto",
    getValue: (row): string => row.description,
    sortable: false,
    pinnable: false,
    reorderable: false,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Tooltip title={value} onlyOnOverflow placement="bottom-start">
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
  },
  {
    id: "actions",
    name: "",
    width: "fit",
    sortable: false,
    pinnable: false,
    reorderable: false,
    getValue: (): string => "",
    renderHeader: ({ name }) => <DataTableHeader trailing={name} />,
    renderCell: ({ row }) => (
      <DataTableCell
        trailing={
          <ButtonGroup>
            <Button variant="plain" size="small" leading={LfUsers} disabled={row.scope === "allUsers"}>
              管理
            </Button>
            <Menu placement="bottom-end">
              <Menu.Anchor>
                <Tooltip title="メニュー">
                  <IconButton
                    variant="plain"
                    size="small"
                    aria-label={`${row.name}のメニュー`}
                    disabled={row.scope === "allUsers"}
                  >
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
                    <ActionList.Item color="danger">
                      <ActionList.Body>削除</ActionList.Body>
                    </ActionList.Item>
                  </ActionList.Group>
                </ActionList>
              </Menu.Box>
            </Menu>
          </ButtonGroup>
        }
      />
    ),
  },
];

// =============================================================================
// Component
// =============================================================================

/** ユーザーグループ管理ページ。 */
export const ManagementConsoleUserGroups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkUserDialogOpen, setBulkUserDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");

  const filteredGroups = useMemo(
    () =>
      MOCK_USER_GROUPS.filter(
        (group) => !searchQuery || group.name.includes(searchQuery) || group.description.includes(searchQuery),
      ),
    [searchQuery],
  );

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <ManagementConsoleNavList activePage="user-groups" />

        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader
              trailing={
                <ButtonGroup>
                  <Button variant="solid" size="medium" leading={LfPlusLarge} onClick={() => setCreateDialogOpen(true)}>
                    ユーザーグループを作成
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
                          <ActionList.Item onClick={() => setBulkDialogOpen(true)}>
                            <ActionList.Body>グループを一括管理</ActionList.Body>
                          </ActionList.Item>
                          <ActionList.Item onClick={() => setBulkUserDialogOpen(true)}>
                            <ActionList.Body>ユーザーを一括管理</ActionList.Body>
                          </ActionList.Item>
                        </ActionList.Group>
                      </ActionList>
                    </Menu.Box>
                  </Menu>
                </ButtonGroup>
              }
            >
              <ContentHeaderTitle>ユーザーグループ</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>

          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              {/* ツールバー */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "var(--aegis-space-xSmall)",
                }}
              >
                <Search
                  placeholder="グループ名で検索"
                  shrinkOnBlur
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Tooltip title="エクスポート">
                  <IconButton variant="plain" size="medium" aria-label="エクスポート">
                    <Icon>
                      <LfDownload />
                    </Icon>
                  </IconButton>
                </Tooltip>
              </div>

              {/* テーブル */}
              <DataTable
                columns={columns}
                rows={filteredGroups}
                getRowId={(row) => row.id}
                highlightRowOnHover={false}
                defaultColumnPinning={{ end: ["actions"] }}
              />
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>

      {/* ユーザーグループ作成ダイアログ */}
      <Dialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setNewGroupName("");
            setNewGroupDescription("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>ユーザーグループを作成</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
              <FormControl required>
                <FormControl.Label>ユーザーグループ名</FormControl.Label>
                <TextField
                  placeholder="ユーザーグループ名を入力"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>説明</FormControl.Label>
                <Textarea
                  placeholder="説明を入力"
                  minRows={3}
                  maxLength={100}
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                />
                <FormControl.Caption>{newGroupDescription.length}/100</FormControl.Caption>
              </FormControl>
              <Checkbox defaultChecked>ユーザーグループを作成後、ユーザーを追加する</Checkbox>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button
                variant="plain"
                onClick={() => {
                  setCreateDialogOpen(false);
                  setNewGroupName("");
                  setNewGroupDescription("");
                }}
              >
                キャンセル
              </Button>
              <Button variant="solid" disabled={!newGroupName.trim()}>
                作成
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* グループ一括管理ダイアログ */}
      <Dialog open={bulkDialogOpen} onOpenChange={(open) => !open && setBulkDialogOpen(false)}>
        <DialogContent width="large">
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>ユーザーグループを一括管理</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
              <Text variant="body.medium">ユーザーグループをCSVファイルで一括作成・編集できます。</Text>

              {/* 手順1 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順1: CSVファイルをエクスポート</Text>
                <div>
                  <Button variant="subtle" size="medium" leading={LfDownload}>
                    エクスポート
                  </Button>
                </div>
              </div>

              {/* 手順2 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順2: CSVファイルを編集</Text>
                <div>
                  <Link href="#" target="_blank" trailing={LfArrowUpRightFromSquare}>
                    記入例
                  </Link>
                </div>
              </div>

              {/* 手順3 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順3: 編集したCSVファイルをアップロード</Text>
                <FileDrop accept={[".csv"]} uploadButtonTitle="ファイルを選択">
                  <Text variant="body.medium" color="subtle" whiteSpace="pre-wrap" style={{ textAlign: "center" }}>
                    ファイルをドロップするか{`\n`}ボタンから選択してアップロードできます。
                  </Text>
                </FileDrop>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setBulkDialogOpen(false)}>
                キャンセル
              </Button>
              <Button variant="solid" disabled>
                インポート
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ユーザー一括管理ダイアログ */}
      <Dialog open={bulkUserDialogOpen} onOpenChange={(open) => !open && setBulkUserDialogOpen(false)}>
        <DialogContent width="large">
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>ユーザーを一括管理</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
              <Text variant="body.medium">ユーザーをCSVファイルで一括編集できます。</Text>

              {/* 手順1 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順1: CSVファイルをエクスポート</Text>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                  <div style={{ flex: 1 }}>
                    <Select
                      options={MOCK_USER_GROUPS.map((g) => ({ label: g.name, value: g.id }))}
                      placeholder="ユーザーグループを検索"
                    />
                  </div>
                  <Button variant="subtle" size="medium" leading={LfDownload}>
                    エクスポート
                  </Button>
                </div>
              </div>

              {/* 手順2 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順2: CSVファイルを編集</Text>
                <div>
                  <Link href="#" target="_blank" trailing={LfArrowUpRightFromSquare}>
                    記入例
                  </Link>
                </div>
              </div>

              {/* 手順3 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順3: 編集したCSVファイルをアップロード</Text>
                <FileDrop accept={[".csv"]} uploadButtonTitle="ファイルを選択">
                  <Text variant="body.medium" color="subtle" whiteSpace="pre-wrap" style={{ textAlign: "center" }}>
                    ファイルをドロップするか{`\n`}ボタンから選択してアップロードできます。
                  </Text>
                </FileDrop>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setBulkUserDialogOpen(false)}>
                キャンセル
              </Button>
              <Button variant="solid" disabled>
                インポート
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LocSidebarLayout>
  );
};
