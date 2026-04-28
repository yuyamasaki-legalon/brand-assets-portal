import { LfEllipsisDot, LfFile, LfPlusLarge, LfTrash } from "@legalforce/aegis-icons";
import {
  ActionList,
  ActionListBody,
  ActionListItem,
  Link as AegisLink,
  Button,
  ContentHeader,
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
  MenuAnchor,
  MenuBox,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  Select,
  StatusLabel,
  Tab,
  Table,
  TableContainer,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// 契約書データの型定義
type ContractStatus = "active" | "expired" | "pending" | "terminated";
type ContractCategory = "取引先名" | "契約状況" | "契約種別";

interface Contract {
  id: string;
  title: string;
  partnerName: string;
  status: ContractStatus;
  category: string;
  contractType: string;
  signedDate: string;
  expiryDate: string;
  updatedAt: string;
}

// サンプルデータ
const initialContracts: Contract[] = [
  {
    id: "CT-2024-001",
    title: "業務委託契約書",
    partnerName: "株式会社サンプルA",
    status: "active",
    category: "取引先名",
    contractType: "業務委託",
    signedDate: "2024/01/15",
    expiryDate: "2025/01/14",
    updatedAt: "2024/12/01",
  },
  {
    id: "CT-2024-002",
    title: "秘密保持契約書",
    partnerName: "株式会社サンプルB",
    status: "active",
    category: "契約状況",
    contractType: "NDA",
    signedDate: "2024/02/20",
    expiryDate: "2026/02/19",
    updatedAt: "2024/11/15",
  },
  {
    id: "CT-2024-003",
    title: "ライセンス契約書",
    partnerName: "株式会社サンプルC",
    status: "expired",
    category: "契約種別",
    contractType: "ライセンス",
    signedDate: "2023/06/10",
    expiryDate: "2024/06/09",
    updatedAt: "2024/06/09",
  },
  {
    id: "CT-2024-004",
    title: "販売代理店契約書",
    partnerName: "株式会社サンプルA",
    status: "pending",
    category: "取引先名",
    contractType: "販売代理",
    signedDate: "2024/11/01",
    expiryDate: "2025/10/31",
    updatedAt: "2024/11/20",
  },
  {
    id: "CT-2024-005",
    title: "システム開発契約書",
    partnerName: "株式会社サンプルD",
    status: "active",
    category: "契約状況",
    contractType: "システム開発",
    signedDate: "2024/03/05",
    expiryDate: "2025/03/04",
    updatedAt: "2024/12/05",
  },
];

// ステータスのラベルと色のマッピング
const statusConfig: Record<ContractStatus, { label: string; color: "teal" | "red" | "yellow" | "neutral" }> = {
  active: { label: "有効", color: "teal" },
  expired: { label: "期限切れ", color: "red" },
  pending: { label: "承認待ち", color: "yellow" },
  terminated: { label: "解約済み", color: "neutral" },
};

// タブの型定義
interface TabConfig {
  id: string;
  label: string;
  category: ContractCategory;
  filterValue?: string;
}

export default function NewPage() {
  const [contracts] = useState<Contract[]>(initialContracts);
  const [tabs, setTabs] = useState<TabConfig[]>([
    { id: "all", label: "すべて", category: "取引先名" },
    { id: "active", label: "有効", category: "契約状況", filterValue: "active" },
    { id: "pending", label: "承認待ち", category: "契約状況", filterValue: "pending" },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("all");
  const [addTabDialogOpen, setAddTabDialogOpen] = useState(false);
  const [newTabCategory, setNewTabCategory] = useState<ContractCategory>("取引先名");
  const [newTabLabel, setNewTabLabel] = useState("");
  const [newTabFilterValue, setNewTabFilterValue] = useState("");

  // アクティブなタブに基づいて契約書をフィルタリング
  const getFilteredContracts = (): Contract[] => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    if (!activeTab || activeTab.id === "all") {
      return contracts;
    }

    if (activeTab.filterValue) {
      // ステータスでフィルタリング
      if (activeTab.category === "契約状況") {
        return contracts.filter((contract) => contract.status === activeTab.filterValue);
      }
    }

    // 取引先名や契約種別でフィルタリング
    if (activeTab.category === "取引先名") {
      return contracts.filter((contract) => contract.partnerName === activeTab.filterValue);
    }
    if (activeTab.category === "契約種別") {
      return contracts.filter((contract) => contract.contractType === activeTab.filterValue);
    }

    return contracts;
  };

  const filteredContracts = getFilteredContracts();

  // タブの追加
  const handleAddTab = () => {
    if (!newTabLabel.trim()) return;

    const newTabId = `tab-${Date.now()}`;
    const newTab: TabConfig = {
      id: newTabId,
      label: newTabLabel,
      category: newTabCategory,
      filterValue: newTabFilterValue || undefined,
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(newTabId);
    setNewTabLabel("");
    setNewTabFilterValue("");
    setAddTabDialogOpen(false);
  };

  // タブの削除
  const handleDeleteTab = (tabId: string) => {
    if (tabs.length <= 1) {
      // 最後のタブは削除できない
      return;
    }

    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    // 削除されたタブがアクティブだった場合、最初のタブに切り替え
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0]?.id || "all");
    }
  };

  // カテゴリに応じたフィルターオプションを取得
  const getFilterOptions = (category: ContractCategory): string[] => {
    switch (category) {
      case "取引先名":
        return Array.from(new Set(contracts.map((c) => c.partnerName)));
      case "契約状況":
        return ["active", "expired", "pending", "terminated"];
      case "契約種別":
        return Array.from(new Set(contracts.map((c) => c.contractType)));
      default:
        return [];
    }
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>締結版契約書一覧</ContentHeader.Title>
            <ContentHeader.Description>
              取引先名や契約状況などで契約書を分類して表示できます。タブを追加・削除してカスタマイズできます。
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Tab.Group>
            <Tab.List>
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  trailing={
                    tab.id !== "all" ? (
                      <Menu>
                        <MenuAnchor>
                          <IconButton
                            size="xSmall"
                            variant="plain"
                            aria-label={`${tab.label}のメニュー`}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Icon>
                              <LfEllipsisDot />
                            </Icon>
                          </IconButton>
                        </MenuAnchor>
                        <MenuBox>
                          <ActionList>
                            <ActionListBody>
                              <ActionListItem
                                color="danger"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteTab(tab.id);
                                }}
                              >
                                <ActionListBody
                                  leading={
                                    <Icon>
                                      <LfTrash />
                                    </Icon>
                                  }
                                >
                                  タブを削除
                                </ActionListBody>
                              </ActionListItem>
                            </ActionListBody>
                          </ActionList>
                        </MenuBox>
                      </Menu>
                    ) : null
                  }
                >
                  {tab.label}
                </Tab>
              ))}
              <Button
                size="small"
                variant="subtle"
                leading={LfPlusLarge}
                onClick={() => setAddTabDialogOpen(true)}
                style={{ marginLeft: "var(--aegis-space-small)" }}
              >
                タブを追加
              </Button>
            </Tab.List>
            <Tab.Panels>
              {tabs.map((tab) => (
                <Tab.Panel key={tab.id}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-medium)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="body.medium" color="subtle">
                        {filteredContracts.length}件の契約書
                      </Text>
                    </div>

                    {filteredContracts.length > 0 ? (
                      <TableContainer>
                        <Table>
                          <Table.Head>
                            <Table.Row>
                              <Table.Cell>ID</Table.Cell>
                              <Table.Cell>契約書名</Table.Cell>
                              <Table.Cell>取引先名</Table.Cell>
                              <Table.Cell>契約状況</Table.Cell>
                              <Table.Cell>契約種別</Table.Cell>
                              <Table.Cell>締結日</Table.Cell>
                              <Table.Cell>有効期限</Table.Cell>
                              <Table.Cell>更新日</Table.Cell>
                            </Table.Row>
                          </Table.Head>
                          <Table.Body>
                            {filteredContracts.map((contract) => (
                              <Table.Row key={contract.id} style={{ cursor: "pointer" }}>
                                <Table.Cell>
                                  <Text variant="component.medium">{contract.id}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "var(--aegis-space-xSmall)",
                                    }}
                                  >
                                    <Icon>
                                      <LfFile />
                                    </Icon>
                                    <Text variant="component.medium">{contract.title}</Text>
                                  </div>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text variant="component.medium">{contract.partnerName}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <StatusLabel color={statusConfig[contract.status].color}>
                                    {statusConfig[contract.status].label}
                                  </StatusLabel>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text variant="component.medium">{contract.contractType}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text variant="component.medium">{contract.signedDate}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text variant="component.medium">{contract.expiryDate}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text variant="component.medium">{contract.updatedAt}</Text>
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table>
                      </TableContainer>
                    ) : (
                      <div
                        style={{
                          padding: "var(--aegis-space-xLarge)",
                          textAlign: "center",
                        }}
                      >
                        <Text variant="body.medium" color="subtle">
                          該当する契約書がありません
                        </Text>
                      </div>
                    )}
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>

          {/* タブ追加ダイアログ */}
          <Dialog open={addTabDialogOpen} onOpenChange={setAddTabDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <ContentHeader>
                  <ContentHeader.Title>タブを追加</ContentHeader.Title>
                </ContentHeader>
              </DialogHeader>
              <DialogBody>
                <Form>
                  <FormControl>
                    <FormControl.Label>カテゴリ</FormControl.Label>
                    <Select
                      value={newTabCategory}
                      onChange={(value: string) => {
                        setNewTabCategory(value as ContractCategory);
                        setNewTabFilterValue("");
                      }}
                      options={[
                        { label: "取引先名", value: "取引先名" },
                        { label: "契約状況", value: "契約状況" },
                        { label: "契約種別", value: "契約種別" },
                      ]}
                    />
                  </FormControl>

                  <FormControl>
                    <FormControl.Label>タブ名</FormControl.Label>
                    <TextField
                      value={newTabLabel}
                      onChange={(e) => setNewTabLabel(e.target.value)}
                      placeholder="例: 株式会社サンプルA"
                    />
                  </FormControl>

                  <FormControl>
                    <FormControl.Label>フィルター値</FormControl.Label>
                    <Select
                      value={newTabFilterValue}
                      onChange={(value: string) => setNewTabFilterValue(value)}
                      options={getFilterOptions(newTabCategory).map((option) => ({
                        label: option,
                        value: option,
                      }))}
                      placeholder="フィルター値を選択"
                    />
                  </FormControl>
                </Form>
              </DialogBody>
              <DialogFooter>
                <Button variant="plain" onClick={() => setAddTabDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button variant="solid" onClick={handleAddTab} disabled={!newTabLabel.trim()}>
                  追加
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/sandbox/juna-kondo">← Back to juna-kondo Sandbox</Link>
          </AegisLink>
        </PageLayoutFooter>
      </PageLayoutContent>
    </PageLayout>
  );
}
