import {
  LfArrowUpRightFromSquare,
  LfCopy,
  LfDownload,
  LfEllipsisDot,
  LfFolder,
  LfPlusLarge,
  LfUserPlus,
  LfUsersBox,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Banner,
  Breadcrumb,
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
  EmptyState,
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
import { useCallback, useMemo, useState } from "react";
import { LocSidebarLayout } from "../_shared";
import { ManagementConsoleNavList } from "./_shared/ManagementConsoleNavList";

// =============================================================================
// Types
// =============================================================================

interface MockSpace {
  id: string;
  name: string;
  type: "folder" | "workspace";
  description: string;
  parentId: string | null;
}

// =============================================================================
// Mock Data
// =============================================================================

const MOCK_SPACES: MockSpace[] = [
  {
    id: "f1",
    name: "法務部",
    type: "folder",
    description: "法務部門のワークスペースをまとめたフォルダ",
    parentId: null,
  },
  {
    id: "f2",
    name: "営業部",
    type: "folder",
    description: "営業部門のワークスペースをまとめたフォルダ",
    parentId: null,
  },
  {
    id: "w1",
    name: "契約審査",
    type: "workspace",
    description: "契約書の審査・レビュー用ワークスペース",
    parentId: null,
  },
  {
    id: "w2",
    name: "NDA管理",
    type: "workspace",
    description: "秘密保持契約の管理用",
    parentId: null,
  },
  {
    id: "w3",
    name: "取引先契約",
    type: "workspace",
    description: "取引先との契約書管理",
    parentId: null,
  },
  {
    id: "w4",
    name: "社内規程",
    type: "workspace",
    description: "社内規程・ポリシー管理",
    parentId: null,
  },
  {
    id: "w5",
    name: "M&Aプロジェクト",
    type: "workspace",
    description: "",
    parentId: null,
  },
];

const MOCK_FOLDERS: { label: string; value: string }[] = [
  { label: "ルート", value: "root" },
  { label: "法務部", value: "f1" },
  { label: "営業部", value: "f2" },
];

// =============================================================================
// Columns
// =============================================================================

interface ColumnActions {
  onShare: (row: MockSpace) => void;
  onMove: (row: MockSpace) => void;
  onEdit: (row: MockSpace) => void;
}

const createColumns = (actions: ColumnActions): DataTableColumnDef<MockSpace, string>[] => [
  {
    id: "name",
    name: "名前",
    width: "small",
    getValue: (row): string => row.name,
    sortable: false,
    pinnable: false,
    reorderable: false,
    renderCell: ({ row, value }) => (
      <DataTableCell leading={<Icon size="small" source={row.type === "folder" ? LfFolder : LfUsersBox} />}>
        <Tooltip title={value} onlyOnOverflow placement="bottom-start">
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
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
            {row.type === "workspace" && (
              <Button variant="plain" size="small" leading={LfUserPlus} onClick={() => actions.onShare(row)}>
                共有
              </Button>
            )}
            <Menu placement="bottom-end">
              <Menu.Anchor>
                <Tooltip title="メニュー">
                  <IconButton variant="plain" size="small" aria-label={`${row.name}のメニュー`}>
                    <Icon>
                      <LfEllipsisDot />
                    </Icon>
                  </IconButton>
                </Tooltip>
              </Menu.Anchor>
              <Menu.Box width="xSmall">
                <ActionList>
                  <ActionList.Group>
                    <ActionList.Item onClick={() => actions.onMove(row)}>
                      <ActionList.Body>移動</ActionList.Body>
                    </ActionList.Item>
                    <ActionList.Item onClick={() => actions.onEdit(row)}>
                      <ActionList.Body>編集</ActionList.Body>
                    </ActionList.Item>
                    <ActionList.Item>
                      <ActionList.Body leading={<Icon source={LfCopy} />}>IDをコピー</ActionList.Body>
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

/** ワークスペース管理ページ。 */
export const ManagementConsoleSpaces = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareTargetName, setShareTargetName] = useState("");
  const [bulkCreateDialogOpen, setBulkCreateDialogOpen] = useState(false);
  const [bulkUpdateDialogOpen, setBulkUpdateDialogOpen] = useState(false);
  const [bulkPermissionDialogOpen, setBulkPermissionDialogOpen] = useState(false);
  const [bulkBannerVisible, setBulkBannerVisible] = useState(false);

  const [newSpaceParent, setNewSpaceParent] = useState("");
  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceDescription, setNewSpaceDescription] = useState("");

  const [editSpaceName, setEditSpaceName] = useState("契約審査");
  const [editSpaceDescription, setEditSpaceDescription] = useState("契約書の審査・レビュー用ワークスペース");

  const [breadcrumbPath] = useState<{ label: string; id: string }[]>([]);

  const handleShare = useCallback((row: MockSpace) => {
    setShareTargetName(row.name);
    setShareDialogOpen(true);
  }, []);

  const handleEdit = useCallback((row: MockSpace) => {
    setEditSpaceName(row.name);
    setEditSpaceDescription(row.description);
    setEditDialogOpen(true);
  }, []);

  const handleMove = useCallback(() => {
    setMoveDialogOpen(true);
  }, []);

  const columns = useMemo(
    () => createColumns({ onShare: handleShare, onMove: handleMove, onEdit: handleEdit }),
    [handleShare, handleMove, handleEdit],
  );

  const filteredSpaces = useMemo(() => MOCK_SPACES, []);

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <ManagementConsoleNavList activePage="workspaces" />

        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader
              trailing={
                <ButtonGroup>
                  <Button variant="solid" size="medium" leading={LfPlusLarge} onClick={() => setCreateDialogOpen(true)}>
                    作成
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
                          <ActionList.Item onClick={() => setBulkCreateDialogOpen(true)}>
                            <ActionList.Body>一括作成・追加</ActionList.Body>
                          </ActionList.Item>
                          <ActionList.Item onClick={() => setBulkUpdateDialogOpen(true)}>
                            <ActionList.Body>一括変更</ActionList.Body>
                          </ActionList.Item>
                          <ActionList.Item onClick={() => setBulkPermissionDialogOpen(true)}>
                            <ActionList.Body>アクセス権限の一括変更</ActionList.Body>
                          </ActionList.Item>
                        </ActionList.Group>
                      </ActionList>
                    </Menu.Box>
                  </Menu>
                </ButtonGroup>
              }
            >
              <ContentHeaderTitle>ワークスペース</ContentHeaderTitle>
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
              {/* 一括操作バナー */}
              {bulkBannerVisible && (
                <Banner color="information" onClose={() => setBulkBannerVisible(false)}>
                  一括操作を受け付けました。処理が完了すると通知されます。
                </Banner>
              )}

              {/* パンくず */}
              <Breadcrumb>
                <Breadcrumb.Item href="#">すべてのスペース</Breadcrumb.Item>
                {breadcrumbPath.map((item) => (
                  <Breadcrumb.Item key={item.id} href="#">
                    {item.label}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>

              {/* テーブル */}
              <DataTable
                columns={columns}
                rows={filteredSpaces}
                getRowId={(row) => row.id}
                highlightRowOnHover={false}
                defaultColumnPinning={{ end: ["actions"] }}
              />
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>

      {/* スペース作成ダイアログ */}
      <Dialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setNewSpaceParent("");
            setNewSpaceName("");
            setNewSpaceDescription("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>ワークスペース/フォルダを作成</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
              <FormControl>
                <FormControl.Label>親ワークスペース/フォルダ</FormControl.Label>
                <Select
                  options={MOCK_FOLDERS}
                  placeholder="親ワークスペース/フォルダを選択"
                  value={newSpaceParent}
                  onChange={(value) => setNewSpaceParent(value)}
                />
              </FormControl>
              <FormControl required>
                <FormControl.Label>名称</FormControl.Label>
                <TextField
                  placeholder="ワークスペース/フォルダ名を入力"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>説明</FormControl.Label>
                <Textarea
                  placeholder="説明を入力"
                  minRows={3}
                  maxLength={100}
                  value={newSpaceDescription}
                  onChange={(e) => setNewSpaceDescription(e.target.value)}
                />
                <FormControl.Caption>{newSpaceDescription.length}/100</FormControl.Caption>
              </FormControl>
              <Checkbox defaultChecked>作成後、ユーザーを追加する</Checkbox>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button
                variant="plain"
                onClick={() => {
                  setCreateDialogOpen(false);
                  setNewSpaceParent("");
                  setNewSpaceName("");
                  setNewSpaceDescription("");
                }}
              >
                キャンセル
              </Button>
              <Button variant="solid" disabled={!newSpaceName.trim()}>
                作成
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditDialogOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>スペースを編集</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
              <FormControl required>
                <FormControl.Label>名称</FormControl.Label>
                <TextField value={editSpaceName} onChange={(e) => setEditSpaceName(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>説明</FormControl.Label>
                <Textarea
                  minRows={3}
                  maxLength={100}
                  value={editSpaceDescription}
                  onChange={(e) => setEditSpaceDescription(e.target.value)}
                />
                <FormControl.Caption>{editSpaceDescription.length}/100</FormControl.Caption>
              </FormControl>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setEditDialogOpen(false)}>
                キャンセル
              </Button>
              <Button variant="solid" disabled={!editSpaceName.trim()}>
                保存
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 移動ダイアログ */}
      <Dialog
        open={moveDialogOpen}
        onOpenChange={(open) => {
          if (!open) setMoveDialogOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>スペースを移動</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <FormControl required>
              <FormControl.Label>移動先</FormControl.Label>
              <Select options={MOCK_FOLDERS} placeholder="移動先を選択" />
            </FormControl>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setMoveDialogOpen(false)}>
                キャンセル
              </Button>
              <Button variant="solid">移動</Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 共有ダイアログ */}
      <Dialog
        open={shareDialogOpen}
        onOpenChange={(open) => {
          if (!open) setShareDialogOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>{shareTargetName}を共有</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
              <Button variant="subtle" size="medium" leading={LfPlusLarge} width="full">
                ユーザーグループ／ユーザーを追加
              </Button>
              <Search placeholder="キーワードで検索" />
              <EmptyState size="small" title="ユーザーは見つかりません">
                ［ユーザーを追加］ボタンからユーザーを追加してください。
              </EmptyState>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setShareDialogOpen(false)}>
                キャンセル
              </Button>
              <Button variant="solid" disabled>
                保存
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 一括作成・追加ダイアログ */}
      <Dialog open={bulkCreateDialogOpen} onOpenChange={(open) => !open && setBulkCreateDialogOpen(false)}>
        <DialogContent width="large">
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>ワークスペース/フォルダを一括作成・追加</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
              <Text variant="body.medium">CSVファイルで一括作成・追加できます。</Text>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順1：テンプレートをダウンロード</Text>
                <div>
                  <Button variant="subtle" size="medium" leading={LfDownload}>
                    ダウンロード
                  </Button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順2：CSVファイルを編集</Text>
                <div>
                  <Link href="#" target="_blank" trailing={LfArrowUpRightFromSquare}>
                    記入例
                  </Link>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順3：編集したCSVファイルをアップロード</Text>
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
              <Button variant="plain" onClick={() => setBulkCreateDialogOpen(false)}>
                キャンセル
              </Button>
              <Button variant="solid" disabled>
                インポート
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 一括変更ダイアログ */}
      <Dialog open={bulkUpdateDialogOpen} onOpenChange={(open) => !open && setBulkUpdateDialogOpen(false)}>
        <DialogContent width="large">
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>ワークスペース/フォルダを一括変更</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
              <Text variant="body.medium">CSVファイルで一括変更できます。</Text>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順1：テンプレートをダウンロード</Text>
                <div>
                  <Button variant="subtle" size="medium" leading={LfDownload}>
                    ダウンロード
                  </Button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順2：CSVファイルを編集</Text>
                <div>
                  <Link href="#" target="_blank" trailing={LfArrowUpRightFromSquare}>
                    記入例
                  </Link>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順3：編集したCSVファイルをアップロード</Text>
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
              <Button variant="plain" onClick={() => setBulkUpdateDialogOpen(false)}>
                キャンセル
              </Button>
              <Button variant="solid" disabled>
                インポート
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* アクセス権限の一括変更ダイアログ */}
      <Dialog open={bulkPermissionDialogOpen} onOpenChange={(open) => !open && setBulkPermissionDialogOpen(false)}>
        <DialogContent width="large">
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>アクセス権限を一括変更</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
              <Text variant="body.medium">CSVファイルでアクセス権限を一括変更できます。</Text>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順1：テンプレートをダウンロード</Text>
                <div>
                  <Button variant="subtle" size="medium" leading={LfDownload}>
                    ダウンロード
                  </Button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順2：CSVファイルを編集</Text>
                <div>
                  <Link href="#" target="_blank" trailing={LfArrowUpRightFromSquare}>
                    記入例
                  </Link>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                <Text variant="label.medium.bold">手順3：編集したCSVファイルをアップロード</Text>
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
              <Button variant="plain" onClick={() => setBulkPermissionDialogOpen(false)}>
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
