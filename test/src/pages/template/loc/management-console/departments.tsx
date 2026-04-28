import { LfEllipsisDot, LfPlusLarge, LfTrash } from "@legalforce/aegis-icons";
import {
  ActionList,
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
  Form,
  FormControl,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Search,
  Table,
  TableContainer,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { LocSidebarLayout } from "../_shared";
import { ManagementConsoleNavList } from "./_shared/ManagementConsoleNavList";

// Mock data
const MOCK_DEPARTMENTS = [
  { id: "018e0c5e-7f11-74a2-90f6-7b7b5e45d3c5", name: "法務部" },
  { id: "018e0c5e-7f11-79b9-8c57-544f70b30770", name: "経営企画部" },
  { id: "018e0c5e-7f11-7f86-acf2-bdddbfa6debc", name: "総務部" },
  { id: "018e0c5e-7f11-74b6-8d00-9a7d98ac6961", name: "人事部" },
  { id: "01966c73-69b1-76b6-a59f-6539c79d3c78", name: "営業部" },
  { id: "018e0c5e-7f11-7c71-9d77-0c31a91d51a6", name: "開発部" },
  { id: "018e0c5e-7f11-7bdf-baf5-88223d8fca69", name: "知的財産部" },
  { id: "018e0c5e-7f11-7504-95f5-d2b8fcea56c1", name: "コンプライアンス部" },
];

/** 部署管理ページ。 */
export const ManagementConsoleDepartments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const filteredDepartments = MOCK_DEPARTMENTS.filter((dept) => dept.name.includes(searchQuery));

  const handleSelectAll = () => {
    if (selectedIds.length === filteredDepartments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDepartments.map((d) => d.id));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        <ManagementConsoleNavList activePage="departments" />

        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader
              trailing={
                <ButtonGroup>
                  <Button variant="solid" size="medium" leading={LfPlusLarge} onClick={() => setCreateDialogOpen(true)}>
                    部署を作成
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
                          <ActionList.Item>
                            <ActionList.Body>部署をインポート</ActionList.Body>
                          </ActionList.Item>
                        </ActionList.Group>
                      </ActionList>
                    </Menu.Box>
                  </Menu>
                </ButtonGroup>
              }
            >
              <ContentHeaderTitle>部署</ContentHeaderTitle>
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
              {/* ツールバー（選択メニュー + 検索） */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                {selectedIds.length > 0 && (
                  <>
                    <Text variant="body.medium">{selectedIds.length}件選択中</Text>
                    <Button
                      variant="gutterless"
                      size="small"
                      color="danger"
                      leading={LfTrash}
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      一括削除
                    </Button>
                  </>
                )}
                <div style={{ marginLeft: "auto" }}>
                  <Search
                    placeholder="部署名で検索"
                    shrinkOnBlur
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* テーブル */}
              <TableContainer>
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell width="fit">
                        <Checkbox
                          size="small"
                          checked={selectedIds.length === filteredDepartments.length && filteredDepartments.length > 0}
                          indeterminate={selectedIds.length > 0 && selectedIds.length < filteredDepartments.length}
                          onChange={handleSelectAll}
                          aria-label="すべて選択"
                        />
                      </Table.Cell>
                      <Table.Cell>部署名</Table.Cell>
                      <Table.Cell>部署ID</Table.Cell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {filteredDepartments.map((dept) => (
                      <Table.Row key={dept.id}>
                        <Table.Cell width="fit">
                          <Checkbox
                            size="small"
                            checked={selectedIds.includes(dept.id)}
                            onChange={() => handleSelect(dept.id)}
                            aria-label={`${dept.name}を選択`}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="body.medium">{dept.name}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="body.medium">{dept.id}</Text>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </TableContainer>

              {/* ページネーション */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Text variant="body.small" color="subtle">
                  1–{filteredDepartments.length} / {filteredDepartments.length}
                </Text>
              </div>
            </div>

            {/* 作成ダイアログ */}
            <CreateDepartmentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

            {/* 一括削除ダイアログ */}
            <BulkDeleteDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              count={selectedIds.length}
              onConfirm={() => {
                setSelectedIds([]);
                setDeleteDialogOpen(false);
              }}
            />
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

// 部署作成ダイアログ
const CreateDepartmentDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [name, setName] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>部署を作成</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <Form>
            <FormControl>
              <FormControl.Label>部署名</FormControl.Label>
              <TextField value={name} onChange={(e) => setName(e.target.value)} placeholder="部署名を入力" />
            </FormControl>
          </Form>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button disabled={!name.trim()} onClick={() => onOpenChange(false)}>
              作成
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 一括削除ダイアログ
const BulkDeleteDialog = ({
  open,
  onOpenChange,
  count,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  onConfirm: () => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <ContentHeader>
          <ContentHeaderTitle>部署を削除しますか？</ContentHeaderTitle>
        </ContentHeader>
      </DialogHeader>
      <DialogBody>
        <Text variant="body.medium">{count}件の部署を削除します。この操作は取り消せません。</Text>
      </DialogBody>
      <DialogFooter>
        <ButtonGroup>
          <Button variant="plain" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={onConfirm}>削除</Button>
        </ButtonGroup>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
