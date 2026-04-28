import { LfFilter, LfPlusLarge } from "@legalforce/aegis-icons";
import { Box, MagnifyingGlass } from "@legalforce/aegis-illustrations/react";
import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Drawer,
  EmptyState,
  FormControl,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  Pagination,
  type PaginationOptions,
  Search,
  Select,
  StatusLabel,
  Tab,
  Tag,
  Text,
  TextField,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { type ChangeEvent, useMemo, useRef, useState } from "react";

// Recipes: docs/aegis-recipes/list-toolbar-and-search.md, filter-drawer.md, data-table-pagination.md, empty-state.md

// =============================================================================
// Types
// =============================================================================

type ItemStatus = "draft" | "inReview" | "approved" | "rejected" | "archived";

type ListItem = {
  id: string;
  title: string;
  status: ItemStatus;
  assignee: string;
  department: string;
  updatedAt: string;
};

type FilterState = {
  keyword: string;
  statuses: ItemStatus[];
  department: string | null;
  assignee: string;
};

// =============================================================================
// Mock Data
// =============================================================================

const sampleItems: ListItem[] = [
  {
    id: "ITEM-2024-001",
    title: "業務委託契約書のレビュー依頼",
    status: "inReview",
    assignee: "山田 太郎",
    department: "営業部",
    updatedAt: "2024/12/18",
  },
  {
    id: "ITEM-2024-002",
    title: "秘密保持契約書の確認",
    status: "approved",
    assignee: "佐藤 花子",
    department: "開発部",
    updatedAt: "2024/12/15",
  },
  {
    id: "ITEM-2024-003",
    title: "新規取引先との基本契約書作成",
    status: "draft",
    assignee: "鈴木 一郎",
    department: "経理部",
    updatedAt: "2024/12/10",
  },
  {
    id: "ITEM-2024-004",
    title: "サービス利用規約の改定",
    status: "rejected",
    assignee: "田中 美咲",
    department: "企画部",
    updatedAt: "2024/12/08",
  },
  {
    id: "ITEM-2024-005",
    title: "ライセンス契約に関する相談",
    status: "archived",
    assignee: "高橋 健太",
    department: "開発部",
    updatedAt: "2024/12/05",
  },
  {
    id: "ITEM-2024-006",
    title: "個人情報取扱いに関する法務相談",
    status: "inReview",
    assignee: "伊藤 さくら",
    department: "人事部",
    updatedAt: "2024/12/03",
  },
  {
    id: "ITEM-2024-007",
    title: "商標登録に関する確認",
    status: "draft",
    assignee: "渡辺 大輔",
    department: "マーケティング部",
    updatedAt: "2024/12/01",
  },
  {
    id: "ITEM-2024-008",
    title: "海外取引に関する契約書確認",
    status: "inReview",
    assignee: "中村 翔",
    department: "海外事業部",
    updatedAt: "2024/11/28",
  },
  {
    id: "ITEM-2024-009",
    title: "労働契約書のテンプレート作成",
    status: "approved",
    assignee: "小林 愛",
    department: "人事部",
    updatedAt: "2024/11/25",
  },
  {
    id: "ITEM-2024-010",
    title: "知的財産権に関する相談",
    status: "draft",
    assignee: "加藤 誠",
    department: "研究開発部",
    updatedAt: "2024/11/20",
  },
  {
    id: "ITEM-2024-011",
    title: "取引先との紛争対応",
    status: "inReview",
    assignee: "吉田 恵",
    department: "営業部",
    updatedAt: "2024/11/18",
  },
  {
    id: "ITEM-2024-012",
    title: "データ共有契約の締結",
    status: "approved",
    assignee: "松本 裕子",
    department: "システム部",
    updatedAt: "2024/11/15",
  },
];

// =============================================================================
// Status Configuration
// =============================================================================

const statusLabels: Record<ItemStatus, string> = {
  draft: "下書き",
  inReview: "レビュー中",
  approved: "承認済み",
  rejected: "差戻し",
  archived: "アーカイブ",
};

const statusColors: Record<ItemStatus, "neutral" | "yellow" | "teal" | "red"> = {
  draft: "neutral",
  inReview: "yellow",
  approved: "teal",
  rejected: "red",
  archived: "neutral",
};

// =============================================================================
// Tab Configuration
// =============================================================================

type TabValue = "all" | "inReview" | "approved" | "archived";

const tabs: { value: TabValue; label: string; badgeCount?: number }[] = [
  { value: "all", label: "すべて", badgeCount: 12 },
  { value: "inReview", label: "レビュー中", badgeCount: 4 },
  { value: "approved", label: "承認済み" },
  { value: "archived", label: "アーカイブ" },
];

// =============================================================================
// Filter Configuration
// =============================================================================

const departmentOptions = [
  { value: "sales", label: "営業部" },
  { value: "development", label: "開発部" },
  { value: "accounting", label: "経理部" },
  { value: "planning", label: "企画部" },
  { value: "hr", label: "人事部" },
  { value: "marketing", label: "マーケティング部" },
  { value: "overseas", label: "海外事業部" },
  { value: "rd", label: "研究開発部" },
  { value: "system", label: "システム部" },
];

const departmentValueToLabel: Record<string, string> = {
  営業部: "sales",
  開発部: "development",
  経理部: "accounting",
  企画部: "planning",
  人事部: "hr",
  マーケティング部: "marketing",
  海外事業部: "overseas",
  研究開発部: "rd",
  システム部: "system",
};

const defaultFilters: FilterState = {
  keyword: "",
  statuses: [],
  department: null,
  assignee: "",
};

// =============================================================================
// DataTable Column Definitions
// =============================================================================

const columns: DataTableColumnDef<ListItem, string>[] = [
  {
    id: "id",
    name: "ID",
    getValue: (row): string => row.id,
    sortable: true,
  },
  {
    id: "title",
    name: "タイトル",
    getValue: (row): string => row.title,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
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
        <StatusLabel color={statusColors[row.status]}>{statusLabels[row.status]}</StatusLabel>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "assignee",
    name: "担当者",
    getValue: (row): string => row.assignee,
    renderCell: ({ value }) => <DataTableCell leading={<Avatar size="xSmall" name={value} />}>{value}</DataTableCell>,
    sortable: true,
  },
  {
    id: "department",
    name: "部署",
    getValue: (row): string => row.department,
    sortable: true,
  },
  {
    id: "updatedAt",
    name: "更新日",
    getValue: (row): string => row.updatedAt,
    sortable: true,
  },
];

// =============================================================================
// Component
// =============================================================================

const ListLayoutTemplate = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const pageSize = 5;

  const drawerRoot = useRef<HTMLDivElement>(null);

  const selectedTab = tabs[tabIndex]?.value ?? "all";
  const isFilterActive =
    filters.keyword.trim() !== "" ||
    filters.statuses.length > 0 ||
    filters.department !== null ||
    filters.assignee.trim() !== "";

  // Filter items based on tab, search, and filters
  const filteredItems = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    const normalizedKeyword = filters.keyword.trim().toLowerCase();
    const normalizedAssignee = filters.assignee.trim().toLowerCase();

    return sampleItems
      .filter((item) => {
        if (selectedTab === "all") return true;
        if (selectedTab === "inReview") return item.status === "inReview";
        if (selectedTab === "approved") return item.status === "approved";
        if (selectedTab === "archived") return item.status === "archived";
        return true;
      })
      .filter((item) => {
        if (!normalizedSearch) return true;
        return (
          item.id.toLowerCase().includes(normalizedSearch) ||
          item.title.toLowerCase().includes(normalizedSearch) ||
          item.assignee.toLowerCase().includes(normalizedSearch) ||
          item.department.toLowerCase().includes(normalizedSearch)
        );
      })
      .filter((item) => {
        // ID/タイトルキーワードフィルター
        if (normalizedKeyword) {
          const matchKeyword =
            item.id.toLowerCase().includes(normalizedKeyword) || item.title.toLowerCase().includes(normalizedKeyword);
          if (!matchKeyword) return false;
        }
        // ステータスフィルター
        if (filters.statuses.length > 0 && !filters.statuses.includes(item.status)) {
          return false;
        }
        // 部署フィルター
        if (filters.department) {
          const departmentValue = departmentValueToLabel[item.department];
          if (departmentValue !== filters.department) return false;
        }
        // 担当者フィルター
        if (normalizedAssignee && !item.assignee.toLowerCase().includes(normalizedAssignee)) {
          return false;
        }
        return true;
      });
  }, [selectedTab, searchValue, filters]);

  // Paginate items
  const pagedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setPage(1);
  };

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    setPage(1);
  };

  const handlePagination: Exclude<PaginationOptions["onChange"], undefined> = (value, action) => {
    if (action === "go-to-first") {
      setPage(1);
      return;
    }
    setPage(value);
  };

  const updateFilters = (updater: FilterState | ((prev: FilterState) => FilterState)) => {
    setFilters((prev) =>
      typeof updater === "function" ? (updater as (state: FilterState) => FilterState)(prev) : updater,
    );
    setPage(1);
  };

  const handleToggleStatusFilter = (status: ItemStatus, checked: boolean) => {
    updateFilters((prev) => {
      const nextStatuses = checked ? [...prev.statuses, status] : prev.statuses.filter((item) => item !== status);
      return { ...prev, statuses: nextStatuses };
    });
  };

  const resetFilters = () => updateFilters(defaultFilters);

  const isFiltering = searchValue.trim() !== "" || isFilterActive;

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader
            trailing={
              <Button
                leading={
                  <Icon>
                    <LfPlusLarge />
                  </Icon>
                }
                variant="solid"
                size="medium"
              >
                新規作成
              </Button>
            }
          >
            <ContentHeaderTitle>一覧画面</ContentHeaderTitle>
            <ContentHeaderDescription>DataTable を使用した汎用的な一覧画面テンプレートです。</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>

        <PageLayoutBody>
          <Tab.Group index={tabIndex} onChange={handleTabChange}>
            <PageLayoutStickyContainer>
              <Toolbar>
                <div style={{ overflow: "hidden" }}>
                  <Tab.List>
                    {tabs.map((tab) => (
                      <Tab
                        key={tab.value}
                        trailing={tab.badgeCount ? <Badge color="danger" count={tab.badgeCount} /> : undefined}
                      >
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
                    placeholder="ID・タイトル・担当者で検索"
                    shrinkOnBlur
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
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
                  {filters.keyword.trim() && <Tag>ID/タイトル: {filters.keyword}</Tag>}
                  {filters.statuses.length > 0 && (
                    <Tag>ステータス: {filters.statuses.map((s) => statusLabels[s]).join(" / ")}</Tag>
                  )}
                  {filters.department && (
                    <Tag>部署: {departmentOptions.find((d) => d.value === filters.department)?.label}</Tag>
                  )}
                  {filters.assignee.trim() && <Tag>担当者: {filters.assignee}</Tag>}
                  <Button size="small" variant="plain" onClick={resetFilters}>
                    リセット
                  </Button>
                </div>
              )}
            </PageLayoutStickyContainer>

            <Tab.Panels ref={drawerRoot}>
              {tabs.map((tab) => (
                <Tab.Panel key={tab.value}>
                  {pagedItems.length > 0 ? (
                    <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                      <DataTable
                        columns={columns}
                        rows={pagedItems}
                        getRowId={(row) => row.id}
                        stickyHeader
                        defaultSorting={[{ id: "updatedAt", desc: true }]}
                      />
                      <Pagination
                        page={page}
                        pageSize={pageSize}
                        totalCount={filteredItems.length}
                        onChange={handlePagination}
                      />
                    </div>
                  ) : (
                    <EmptyState
                      title={isFiltering ? "条件に一致する項目がありません" : "項目がありません"}
                      visual={isFiltering ? <MagnifyingGlass /> : <Box />}
                    >
                      <Text>
                        {isFiltering
                          ? "検索条件を変更して、もう一度お試しください。"
                          : "新規作成ボタンから項目を追加してください。"}
                      </Text>
                    </EmptyState>
                  )}
                </Tab.Panel>
              ))}
            </Tab.Panels>
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
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            <FormControl>
              <FormControl.Label>ID/タイトル</FormControl.Label>
              <TextField
                value={filters.keyword}
                onChange={(event) => updateFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                placeholder="ID またはタイトルを入力"
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>ステータス</FormControl.Label>
              <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                {(Object.keys(statusLabels) as ItemStatus[]).map((status) => (
                  <Checkbox
                    key={status}
                    checked={filters.statuses.includes(status)}
                    onChange={(event) => handleToggleStatusFilter(status, event.target.checked)}
                  >
                    {statusLabels[status]}
                  </Checkbox>
                ))}
              </div>
            </FormControl>

            <FormControl>
              <FormControl.Label>部署</FormControl.Label>
              <Select
                options={departmentOptions}
                value={filters.department ?? ""}
                onChange={(value) => updateFilters((prev) => ({ ...prev, department: value || null }))}
                placeholder="部署を選択"
                clearable
                onClear={() => updateFilters((prev) => ({ ...prev, department: null }))}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>担当者</FormControl.Label>
              <TextField
                value={filters.assignee}
                onChange={(event) => updateFilters((prev) => ({ ...prev, assignee: event.target.value }))}
                placeholder="担当者名を入力"
              />
            </FormControl>
          </div>
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
  );
};

export default ListLayoutTemplate;
