import {
  LfAngleRightMiddle,
  LfArrowRightFromLine,
  LfFile,
  LfFileEye,
  LfFilter,
  LfList,
  LfPlusLarge,
  LfSend,
  LfSetting,
  LfUser,
} from "@legalforce/aegis-icons";
import { Box, MagnifyingGlass } from "@legalforce/aegis-illustrations/react";
import {
  ActionList,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  ContentHeader,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Drawer,
  EmptyState,
  FormControl,
  Header,
  Icon,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  Pagination,
  type PaginationOptions,
  Search,
  Select,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarProvider,
  SidebarTrigger,
  StatusLabel,
  Tab,
  Tag,
  Text,
  TextField,
  Toolbar,
  ToolbarSpacer,
} from "@legalforce/aegis-react";
import { type ChangeEvent, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// =============================================================================
// Types
// =============================================================================

type RoleplayStatus = "completed" | "needsReview" | "inProgress" | "archived";

type RoleplayResult = {
  id: string;
  scenario: string;
  candidate: string;
  evaluator: string;
  status: RoleplayStatus;
  score: number;
  updatedAt: string;
  duration: string;
};

type FilterState = {
  keyword: string;
  statuses: RoleplayStatus[];
  evaluator: string | null;
  scoreBand: string | null;
};

// =============================================================================
// Mock Data
// =============================================================================

const roleplayResults: RoleplayResult[] = [
  {
    id: "RP-2026-012",
    scenario: "法人営業（SaaS提案）",
    candidate: "佐藤 花子",
    evaluator: "AI面接官",
    status: "completed",
    score: 86,
    updatedAt: "2026/01/28",
    duration: "18分",
  },
  {
    id: "RP-2026-011",
    scenario: "カスタマーサクセス（解約抑止）",
    candidate: "山田 太郎",
    evaluator: "AI面接官",
    status: "needsReview",
    score: 72,
    updatedAt: "2026/01/27",
    duration: "22分",
  },
  {
    id: "RP-2026-010",
    scenario: "エンジニア（技術課題説明）",
    candidate: "高橋 健太",
    evaluator: "AI面接官",
    status: "completed",
    score: 91,
    updatedAt: "2026/01/26",
    duration: "16分",
  },
  {
    id: "RP-2026-009",
    scenario: "人事（評価面談）",
    candidate: "伊藤 さくら",
    evaluator: "AI面接官",
    status: "inProgress",
    score: 0,
    updatedAt: "2026/01/26",
    duration: "進行中",
  },
  {
    id: "RP-2026-008",
    scenario: "法人営業（新規開拓）",
    candidate: "中村 翔",
    evaluator: "AI面接官",
    status: "archived",
    score: 78,
    updatedAt: "2026/01/23",
    duration: "20分",
  },
  {
    id: "RP-2026-007",
    scenario: "企画（提案力確認）",
    candidate: "鈴木 一郎",
    evaluator: "AI面接官",
    status: "completed",
    score: 83,
    updatedAt: "2026/01/22",
    duration: "19分",
  },
  {
    id: "RP-2026-006",
    scenario: "CS（一次対応）",
    candidate: "小林 愛",
    evaluator: "AI面接官",
    status: "needsReview",
    score: 68,
    updatedAt: "2026/01/21",
    duration: "17分",
  },
];

// =============================================================================
// Status Configuration
// =============================================================================

const statusLabels: Record<RoleplayStatus, string> = {
  completed: "完了",
  needsReview: "要再評価",
  inProgress: "進行中",
  archived: "アーカイブ",
};

const statusColors: Record<RoleplayStatus, "teal" | "yellow" | "blue" | "neutral"> = {
  completed: "teal",
  needsReview: "yellow",
  inProgress: "blue",
  archived: "neutral",
};

// =============================================================================
// Filter Options
// =============================================================================

const evaluatorOptions = [
  { value: "ai", label: "AI面接官" },
  { value: "lead", label: "リード面接官" },
  { value: "manager", label: "採用マネージャー" },
];

const scoreBandOptions = [
  { value: "90", label: "90点以上" },
  { value: "80", label: "80-89点" },
  { value: "70", label: "70-79点" },
  { value: "under", label: "69点以下" },
];

const defaultFilters: FilterState = {
  keyword: "",
  statuses: [],
  evaluator: null,
  scoreBand: null,
};

// =============================================================================
// Component
// =============================================================================

export const AiRoleplayResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabIndex, setTabIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const pageSize = 5;

  const drawerRoot = useRef<HTMLDivElement>(null);

  const tabCounts = {
    all: roleplayResults.length,
    completed: roleplayResults.filter((item) => item.status === "completed").length,
    needsReview: roleplayResults.filter((item) => item.status === "needsReview").length,
    inProgress: roleplayResults.filter((item) => item.status === "inProgress").length,
  };

  const tabs = [
    { value: "all", label: "すべて", badgeCount: tabCounts.all },
    { value: "completed", label: "完了", badgeCount: tabCounts.completed },
    { value: "needsReview", label: "要再評価", badgeCount: tabCounts.needsReview },
    { value: "inProgress", label: "進行中", badgeCount: tabCounts.inProgress },
  ];

  const columns = useMemo<DataTableColumnDef<RoleplayResult, string>[]>(
    () => [
      {
        id: "id",
        name: "ロープレID",
        getValue: (row): string => row.id,
        renderCell: ({ value }) => <DataTableCell>{value}</DataTableCell>,
        sortable: true,
      },
      {
        id: "scenario",
        name: "シナリオ",
        getValue: (row): string => row.scenario,
        renderCell: ({ row }) => (
          <DataTableCell>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
              <Text variant="body.medium">{row.scenario}</Text>
              <Text variant="body.small" color="subtle">
                所要時間: {row.duration}
              </Text>
            </div>
          </DataTableCell>
        ),
        sortable: true,
      },
      {
        id: "candidate",
        name: "候補者",
        getValue: (row): string => row.candidate,
        renderCell: ({ value }) => (
          <DataTableCell leading={<Avatar size="xSmall" name={value} />}>{value}</DataTableCell>
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
        id: "score",
        name: "スコア",
        getValue: (row): string => String(row.score),
        renderCell: ({ row }) => (
          <DataTableCell>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
              <Text variant="body.medium">{row.score > 0 ? `${row.score}点` : "—"}</Text>
              {row.score >= 85 ? <Tag>優秀</Tag> : null}
            </div>
          </DataTableCell>
        ),
        sortable: true,
      },
      {
        id: "updatedAt",
        name: "実施日",
        getValue: (row): string => row.updatedAt,
        sortable: true,
      },
      {
        id: "evaluator",
        name: "評価者",
        getValue: (row): string => row.evaluator,
        sortable: true,
      },
      {
        id: "action",
        name: "アクション",
        getValue: () => "detail",
        renderCell: () => (
          <DataTableCell>
            <Button
              variant="subtle"
              size="small"
              trailing={
                <Icon size="small">
                  <LfAngleRightMiddle />
                </Icon>
              }
              onClick={() => navigate("/sandbox/wataryooou/ai-roleplay-result-detail")}
            >
              詳細
            </Button>
          </DataTableCell>
        ),
      },
    ],
    [navigate],
  );

  const navItems = [
    { label: "結果一覧", path: "/sandbox/wataryooou/ai-roleplay-results", icon: LfList },
    { label: "結果詳細", path: "/sandbox/wataryooou/ai-roleplay-result-detail", icon: LfFile },
    { label: "ロープレ実施", path: "/sandbox/wataryooou/ai-roleplay-session", icon: LfSend },
    { label: "結果表示", path: "/sandbox/wataryooou/ai-roleplay-result-view", icon: LfFileEye },
    { label: "設定", path: "/sandbox/wataryooou/ai-roleplay-settings", icon: LfSetting },
  ];

  const selectedTab = tabs[tabIndex]?.value ?? "all";
  const isFilterActive =
    filters.keyword.trim() !== "" ||
    filters.statuses.length > 0 ||
    filters.evaluator !== null ||
    filters.scoreBand !== null;

  const filteredResults = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    const normalizedKeyword = filters.keyword.trim().toLowerCase();

    return roleplayResults
      .filter((item) => {
        if (selectedTab === "all") return true;
        if (selectedTab === "completed") return item.status === "completed";
        if (selectedTab === "needsReview") return item.status === "needsReview";
        if (selectedTab === "inProgress") return item.status === "inProgress";
        return true;
      })
      .filter((item) => {
        if (!normalizedSearch) return true;
        return (
          item.id.toLowerCase().includes(normalizedSearch) ||
          item.scenario.toLowerCase().includes(normalizedSearch) ||
          item.candidate.toLowerCase().includes(normalizedSearch)
        );
      })
      .filter((item) => {
        if (normalizedKeyword) {
          const matchKeyword =
            item.id.toLowerCase().includes(normalizedKeyword) ||
            item.scenario.toLowerCase().includes(normalizedKeyword);
          if (!matchKeyword) return false;
        }
        if (filters.statuses.length > 0 && !filters.statuses.includes(item.status)) {
          return false;
        }
        if (
          filters.evaluator &&
          item.evaluator !== evaluatorOptions.find((opt) => opt.value === filters.evaluator)?.label
        ) {
          return false;
        }
        if (filters.scoreBand) {
          if (filters.scoreBand === "90" && item.score < 90) return false;
          if (filters.scoreBand === "80" && (item.score < 80 || item.score >= 90)) return false;
          if (filters.scoreBand === "70" && (item.score < 70 || item.score >= 80)) return false;
          if (filters.scoreBand === "under" && item.score >= 70) return false;
        }
        return true;
      });
  }, [selectedTab, searchValue, filters]);

  const pagedResults = filteredResults.slice((page - 1) * pageSize, page * pageSize);

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

  const handleToggleStatusFilter = (status: RoleplayStatus, checked: boolean) => {
    updateFilters((prev) => {
      const nextStatuses = checked ? [...prev.statuses, status] : prev.statuses.filter((item) => item !== status);
      return { ...prev, statuses: nextStatuses };
    });
  };

  const resetFilters = () => updateFilters(defaultFilters);

  const isFiltering = searchValue.trim() !== "" || isFilterActive;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarBody>
          <SidebarNavigation>
            {navItems.map((item) => (
              <SidebarNavigationItem key={item.path}>
                <SidebarNavigationLink
                  aria-current={location.pathname === item.path ? "page" : undefined}
                  leading={
                    <Icon>
                      <item.icon />
                    </Icon>
                  }
                  asChild
                >
                  <Link to={item.path}>{item.label}</Link>
                </SidebarNavigationLink>
              </SidebarNavigationItem>
            ))}
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>
        <Header>
          <Header.Spacer />
          <Header.Item>
            <Menu>
              <Menu.Anchor>
                <Avatar name="AIロープレ" />
              </Menu.Anchor>
              <Menu.Box>
                <ActionList>
                  <ActionList.Group>
                    <ActionList.Item>
                      <ActionList.Body leading={LfUser}>プロフィール</ActionList.Body>
                    </ActionList.Item>
                  </ActionList.Group>
                  <ActionList.Group>
                    <ActionList.Item color="danger">
                      <ActionList.Body leading={LfArrowRightFromLine}>ログアウト</ActionList.Body>
                    </ActionList.Item>
                  </ActionList.Group>
                </ActionList>
              </Menu.Box>
            </Menu>
          </Header.Item>
        </Header>
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
                    新規ロープレ
                  </Button>
                }
              >
                <ContentHeader.Title>ロープレ結果一覧</ContentHeader.Title>
                <ContentHeader.Description>AIロープレ面接の実施結果を一覧で確認できます。</ContentHeader.Description>
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
                        placeholder="ID・シナリオ・候補者で検索"
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
                      {filters.keyword.trim() && <Tag>キーワード: {filters.keyword}</Tag>}
                      {filters.statuses.length > 0 && (
                        <Tag>ステータス: {filters.statuses.map((status) => statusLabels[status]).join(" / ")}</Tag>
                      )}
                      {filters.evaluator && (
                        <Tag>評価者: {evaluatorOptions.find((opt) => opt.value === filters.evaluator)?.label}</Tag>
                      )}
                      {filters.scoreBand && (
                        <Tag>スコア: {scoreBandOptions.find((opt) => opt.value === filters.scoreBand)?.label}</Tag>
                      )}
                      <Button size="small" variant="plain" onClick={resetFilters}>
                        リセット
                      </Button>
                    </div>
                  )}
                </PageLayoutStickyContainer>

                <Tab.Panels ref={drawerRoot}>
                  {tabs.map((tab) => (
                    <Tab.Panel key={tab.value}>
                      {pagedResults.length > 0 ? (
                        <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
                          <DataTable
                            columns={columns}
                            rows={pagedResults}
                            getRowId={(row) => row.id}
                            stickyHeader
                            defaultSorting={[{ id: "updatedAt", desc: true }]}
                          />
                          <Pagination
                            page={page}
                            pageSize={pageSize}
                            totalCount={filteredResults.length}
                            onChange={handlePagination}
                          />
                        </div>
                      ) : (
                        <EmptyState
                          title={isFiltering ? "条件に一致する結果がありません" : "ロープレ結果がありません"}
                          visual={isFiltering ? <MagnifyingGlass /> : <Box />}
                        >
                          <Text>
                            {isFiltering
                              ? "検索条件を変更して、もう一度お試しください。"
                              : "新規ロープレを作成して面接を実施してください。"}
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
                <ContentHeader.Title>フィルター</ContentHeader.Title>
              </ContentHeader>
            </Drawer.Header>
            <Drawer.Body>
              <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
                <FormControl>
                  <FormControl.Label>ID/シナリオ</FormControl.Label>
                  <TextField
                    value={filters.keyword}
                    onChange={(event) => updateFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                    placeholder="ID またはシナリオ名を入力"
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>ステータス</FormControl.Label>
                  <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                    {(Object.keys(statusLabels) as RoleplayStatus[]).map((status) => (
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
                  <FormControl.Label>評価者</FormControl.Label>
                  <Select
                    placeholder="評価者を選択"
                    value={filters.evaluator}
                    onChange={(value) => updateFilters((prev) => ({ ...prev, evaluator: value }))}
                    options={evaluatorOptions}
                  />
                </FormControl>

                <FormControl>
                  <FormControl.Label>スコア帯</FormControl.Label>
                  <Select
                    placeholder="スコア帯を選択"
                    value={filters.scoreBand}
                    onChange={(value) => updateFilters((prev) => ({ ...prev, scoreBand: value }))}
                    options={scoreBandOptions}
                  />
                </FormControl>

                <Button variant="solid" onClick={() => setFilterOpen(false)}>
                  適用
                </Button>
              </div>
            </Drawer.Body>
          </Drawer>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AiRoleplayResults;
