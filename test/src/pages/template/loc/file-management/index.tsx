import {
  LfAngleDownMiddle,
  LfCloseCircle,
  LfEllipsisDot,
  LfFilter,
  LfFolderTree,
  LfHistory,
  LfLayoutHorizonRight,
  LfPen,
  LfPlusLarge,
} from "@legalforce/aegis-icons";
import { Box, MagnifyingGlass } from "@legalforce/aegis-illustrations/react";
import {
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DataTableLink,
  Drawer,
  EmptyState,
  FormControl,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  Pagination,
  type PaginationOptions,
  RangeDateField,
  Search,
  Select,
  StatusLabel,
  Tab,
  Text,
  TextField,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { type ChangeEvent, useMemo, useRef, useState } from "react";
import { LocSidebarLayout } from "../_shared";
import styles from "./index.module.css";
import type { ContractDocument } from "./mock";
import { contractDocumentStatusLabelStyleMap, mockAgreedContracts, mockAllContracts } from "./mock";
import {
  agreedContractStatusColors,
  agreedContractStatusLabels,
  contractDocumentStatusLabels,
  manualCorrectionStatusLabels,
} from "./utils";

// =============================================================================
// "すべて"タブ — カラム定義（11列）
// =============================================================================

const allContractsColumns: DataTableColumnDef<ContractDocument, string>[] = [
  {
    id: "title",
    name: "契約書タイトル",
    getValue: (row): string => row.title,
    renderCell: ({ value, row }) => (
      <DataTableCell>
        <DataTableLink href={`/template/file-management/detail/${row.id}`} />
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "counterPartyNames",
    name: "取引先名",
    getValue: (row): string => row.counterPartyNames.join("、"),
    renderCell: ({ value }) => (
      <DataTableCell>
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "version",
    name: "バージョン",
    getValue: (row): string => `v${row.version}`,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel variant="outline" size="small" color="neutral">
          v{row.version}
        </StatusLabel>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: false,
  },
  {
    id: "contractDocumentStatus",
    name: "契約書ステータス",
    getValue: (row): string => contractDocumentStatusLabels[row.contractDocumentStatus],
    renderCell: ({ row }) => {
      const style = contractDocumentStatusLabelStyleMap[row.contractDocumentStatus];
      return style ? (
        <DataTableCell>
          <StatusLabel variant={style.variant} size="small" color={style.color}>
            {contractDocumentStatusLabels[row.contractDocumentStatus]}
          </StatusLabel>
        </DataTableCell>
      ) : (
        <DataTableCell>
          <Text>{contractDocumentStatusLabels[row.contractDocumentStatus]}</Text>
        </DataTableCell>
      );
    },
    pinnable: false,
    sortable: false,
  },
  {
    id: "contractAssignee",
    name: "契約担当者",
    getValue: (row): string => row.contractAssignee,
    pinnable: false,
    sortable: false,
  },
  {
    id: "createBy",
    name: "ファイル追加者",
    getValue: (row): string => row.createBy,
    pinnable: false,
    sortable: false,
  },
  {
    id: "inhouseId",
    name: "管理番号",
    getValue: (row): string => row.inhouseId,
    pinnable: false,
    sortable: true,
  },
  {
    id: "voucherId",
    name: "伝票番号",
    getValue: (row): string => row.voucherId,
    pinnable: false,
    sortable: true,
  },
  {
    id: "spaceName",
    name: "保存先",
    getValue: (row): string => row.spaceName,
    pinnable: false,
    sortable: false,
  },
  {
    id: "fileName",
    name: "ファイル名",
    getValue: (row): string => row.fileName,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "createTime",
    name: "ファイル追加日時",
    getValue: (row): string => row.createTime,
    pinnable: false,
    sortable: true,
  },
  {
    id: "contractCategory",
    name: "契約類型・立場",
    getValue: (row): string => row.contractCategory,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: false,
  },
  {
    id: "ownPartyNames",
    name: "自社名",
    getValue: (row): string => row.ownPartyNames.join("、"),
    renderCell: ({ value }) => (
      <DataTableCell>
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "language",
    name: "言語",
    getValue: (row): string => row.language,
    pinnable: false,
    sortable: false,
  },
  {
    id: "preview",
    name: "",
    getValue: (): string => "",
    renderCell: () => (
      <DataTableCell>
        <Tooltip title="プレビュー">
          <ButtonGroup>
            <IconButton aria-label="プレビューボタン">
              <LfLayoutHorizonRight />
            </IconButton>
          </ButtonGroup>
        </Tooltip>
      </DataTableCell>
    ),
    pinnable: false,
    hideable: false,
    resizable: false,
    reorderable: false,
    sortable: false,
  },
];

// =============================================================================
// "締結版"タブ — カラム定義（13列）
// =============================================================================

const agreedContractsColumns: DataTableColumnDef<ContractDocument, string>[] = [
  {
    id: "title",
    name: "契約書タイトル",
    getValue: (row): string => row.title,
    renderCell: ({ value, row }) => (
      <DataTableCell>
        <DataTableLink href={`/template/file-management/detail/${row.id}`} />
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "counterPartyNames",
    name: "取引先名",
    getValue: (row): string => row.counterPartyNames.join("、"),
    renderCell: ({ value }) => (
      <DataTableCell>
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "agreedContractStatus",
    name: "契約状況",
    getValue: (row): string => (row.agreedContractStatus ? agreedContractStatusLabels[row.agreedContractStatus] : ""),
    renderCell: ({ row }) =>
      row.agreedContractStatus ? (
        <DataTableCell>
          <StatusLabel variant="fill" size="small" color={agreedContractStatusColors[row.agreedContractStatus]}>
            {agreedContractStatusLabels[row.agreedContractStatus]}
          </StatusLabel>
        </DataTableCell>
      ) : (
        <DataTableCell>
          <Text color="subtle">-</Text>
        </DataTableCell>
      ),
    pinnable: false,
    sortable: false,
  },
  {
    id: "signingDate",
    name: "契約締結日",
    getValue: (row): string => row.signingDate ?? "",
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text color={row.signingDate ? undefined : "subtle"}>{row.signingDate ?? "-"}</Text>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "effectiveDate",
    name: "契約開始日",
    getValue: (row): string => row.effectiveDate ?? "",
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text color={row.effectiveDate ? undefined : "subtle"}>{row.effectiveDate ?? "-"}</Text>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "expirationDate",
    name: "契約終了日",
    getValue: (row): string => row.expirationDate ?? "",
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text color={row.expirationDate ? undefined : "subtle"}>{row.expirationDate ?? "-"}</Text>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "isAutoRenewable",
    name: "自動更新",
    getValue: (row): string => (row.isAutoRenewable ? "あり" : "なし"),
    pinnable: false,
    sortable: false,
  },
  {
    id: "nextRefusalDate",
    name: "更新拒絶期限日",
    getValue: (row): string => row.nextRefusalDate ?? "",
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text color={row.nextRefusalDate ? undefined : "subtle"}>{row.nextRefusalDate ?? "-"}</Text>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "transactionAmount",
    name: "取引金額",
    getValue: (row): string => row.transactionAmount ?? "",
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text color={row.transactionAmount ? undefined : "subtle"}>{row.transactionAmount ?? "-"}</Text>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: false,
  },
  {
    id: "contractAssignee",
    name: "契約担当者",
    getValue: (row): string => row.contractAssignee,
    pinnable: false,
    sortable: false,
  },
  {
    id: "manualCorrectionStatus",
    name: "手動補正ステータス",
    getValue: (row): string =>
      row.manualCorrectionStatus ? manualCorrectionStatusLabels[row.manualCorrectionStatus] : "",
    renderCell: ({ row }) => (
      <DataTableCell>
        {row.manualCorrectionStatus ? (
          <Text>{manualCorrectionStatusLabels[row.manualCorrectionStatus]}</Text>
        ) : (
          <Text color="subtle">-</Text>
        )}
      </DataTableCell>
    ),
    pinnable: false,
    sortable: false,
  },
  {
    id: "inhouseId",
    name: "管理番号",
    getValue: (row): string => row.inhouseId,
    pinnable: false,
    sortable: true,
  },
  {
    id: "spaceName",
    name: "保存先",
    getValue: (row): string => row.spaceName,
    pinnable: false,
    sortable: false,
  },
  {
    id: "preview",
    name: "",
    getValue: (): string => "",
    renderCell: () => (
      <DataTableCell>
        <Tooltip title="プレビュー">
          <ButtonGroup>
            <IconButton aria-label="プレビューボタン">
              <LfLayoutHorizonRight />
            </IconButton>
          </ButtonGroup>
        </Tooltip>
      </DataTableCell>
    ),
    pinnable: false,
    hideable: false,
    resizable: false,
    reorderable: false,
    sortable: false,
  },
];

// =============================================================================
// Filter options
// =============================================================================

const contractDocumentStatusFilterOptions = [
  { label: "すべて", value: "all" },
  { label: "なし", value: "none" },
  { label: "自社ドラフト", value: "ownPartyDraft" },
  { label: "相手方ドラフト", value: "counterPartyDraft" },
  { label: "承認済み", value: "approved" },
  { label: "締結済み", value: "agreedContract" },
];

const agreedContractStatusFilterOptions = [
  { label: "すべて", value: "all" },
  { label: "契約期間中", value: "inTerm" },
  { label: "契約終了予定", value: "scheduledToEnd" },
  { label: "契約終了済み", value: "finished" },
];

// =============================================================================
// Component
// =============================================================================

const FileManagementList = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const drawerRoot = useRef<HTMLDivElement>(null);
  const pageSize = 10;

  const isAllTab = tabIndex === 0;
  const sourceData = isAllTab ? mockAllContracts : mockAgreedContracts;

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    return sourceData
      .filter((item) => {
        if (statusFilter === "all") return true;
        if (isAllTab) {
          return item.contractDocumentStatus === statusFilter;
        }
        return item.agreedContractStatus === statusFilter;
      })
      .filter((item) => {
        if (!normalizedSearch) return true;
        return (
          item.title.toLowerCase().includes(normalizedSearch) ||
          item.counterPartyNames.some((name) => name.toLowerCase().includes(normalizedSearch))
        );
      });
  }, [searchValue, statusFilter, sourceData, isAllTab]);

  const pagedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    setPage(1);
    setSelectedRows([]);
    setSearchValue("");
    setStatusFilter("all");
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setPage(1);
    setSelectedRows([]);
  };

  const handlePagination: Exclude<PaginationOptions["onChange"], undefined> = (value, action) => {
    if (action === "go-to-first") {
      setPage(1);
      return;
    }
    setPage(value);
  };

  const handleClearSelection = () => {
    setSelectedRows([]);
  };

  const isFiltering = searchValue.trim() !== "" || statusFilter !== "all";

  return (
    <LocSidebarLayout activeId="contracts">
      <PageLayout>
        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader
              trailing={
                <ButtonGroup>
                  <Button
                    leading={
                      <Icon>
                        <LfPlusLarge />
                      </Icon>
                    }
                    variant="solid"
                    size="medium"
                  >
                    アップロード
                  </Button>
                  <Tooltip title="履歴メニュー">
                    <IconButton aria-label="履歴メニュー" variant="plain" size="medium">
                      <Icon>
                        <LfHistory />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
              }
            >
              <ContentHeaderTitle>契約書</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>

          <PageLayoutBody>
            <Tab.Group index={tabIndex} onChange={handleTabChange}>
              <div style={{ overflow: "hidden" }}>
                <Tab.List>
                  <Tab>
                    <Text whiteSpace="nowrap">すべて</Text>
                  </Tab>
                  <Tab>
                    <Text whiteSpace="nowrap">締結版</Text>
                  </Tab>
                </Tab.List>
              </div>
              <Tab.Panels ref={drawerRoot}>
                {/* "すべて"タブ */}
                <Tab.Panel>
                  <PageLayoutStickyContainer>
                    <Toolbar>
                      <Button
                        variant="plain"
                        leading={
                          <Icon>
                            <LfFolderTree />
                          </Icon>
                        }
                        trailing={
                          <Icon>
                            <LfAngleDownMiddle />
                          </Icon>
                        }
                      >
                        すべての保存先
                      </Button>
                      <ToolbarSpacer />
                      <Button
                        variant={filterOpen ? "subtle" : "plain"}
                        leading={
                          <Icon>
                            <LfFilter />
                          </Icon>
                        }
                        onClick={() => setFilterOpen((prev) => !prev)}
                      >
                        フィルター
                      </Button>
                      <ButtonGroup>
                        <Search
                          placeholder="キーワードフィルターを開く"
                          shrinkOnBlur
                          value={searchValue}
                          onChange={handleSearchChange}
                        />
                        <Tooltip title="自動抽出設定">
                          <IconButton aria-label="自動抽出設定" variant="plain">
                            <Icon>
                              <LfPen />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="メニューを開く">
                          <IconButton aria-label="メニューを開く" variant="plain">
                            <Icon>
                              <LfEllipsisDot />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </ButtonGroup>
                    </Toolbar>

                    {selectedRows.length > 0 && (
                      <Toolbar>
                        <Text variant="label.medium">{selectedRows.length}件選択中</Text>
                        <ToolbarSpacer />
                        <Button variant="subtle" size="small">
                          CSV エクスポート
                        </Button>
                        <Tooltip title="選択解除">
                          <IconButton aria-label="選択解除" variant="plain" size="small" onClick={handleClearSelection}>
                            <Icon>
                              <LfCloseCircle />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </Toolbar>
                    )}
                  </PageLayoutStickyContainer>
                  {pagedItems.length > 0 ? (
                    <div className={styles.tableContainer}>
                      <DataTable
                        columns={allContractsColumns}
                        rows={pagedItems}
                        getRowId={(row) => row.id}
                        stickyHeader
                        rowSelectionType="multiple"
                        selectedRows={selectedRows}
                        onSelectedRowsChange={setSelectedRows}
                        defaultColumnPinning={{ end: ["preview"] }}
                        defaultSorting={[{ id: "createTime", desc: true }]}
                      />
                      {filteredItems.length > pageSize && (
                        <Pagination
                          page={page}
                          pageSize={pageSize}
                          totalCount={filteredItems.length}
                          onChange={handlePagination}
                        />
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      title={isFiltering ? "条件に一致する契約書がありません" : "契約書がありません"}
                      visual={isFiltering ? <MagnifyingGlass /> : <Box />}
                    >
                      <Text>
                        {isFiltering
                          ? "検索条件を変更して、もう一度お試しください。"
                          : "「契約書をアップロード」ボタンから契約書を追加してください。"}
                      </Text>
                    </EmptyState>
                  )}
                </Tab.Panel>

                {/* "締結版"タブ */}
                <Tab.Panel>
                  <PageLayoutStickyContainer>
                    <Toolbar>
                      <Button
                        variant="plain"
                        leading={
                          <Icon>
                            <LfFolderTree />
                          </Icon>
                        }
                        trailing={
                          <Icon>
                            <LfAngleDownMiddle />
                          </Icon>
                        }
                      >
                        すべての保存先
                      </Button>
                      <ToolbarSpacer />
                      <Button
                        variant={filterOpen ? "subtle" : "plain"}
                        leading={
                          <Icon>
                            <LfFilter />
                          </Icon>
                        }
                        onClick={() => setFilterOpen((prev) => !prev)}
                      >
                        フィルター
                      </Button>
                      <ButtonGroup>
                        <Search
                          placeholder="キーワードフィルターを開く"
                          shrinkOnBlur
                          value={searchValue}
                          onChange={handleSearchChange}
                        />
                        <Tooltip title="自動抽出設定">
                          <IconButton aria-label="自動抽出設定" variant="plain">
                            <Icon>
                              <LfPen />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="メニューを開く">
                          <IconButton aria-label="メニューを開く" variant="plain">
                            <Icon>
                              <LfEllipsisDot />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </ButtonGroup>
                    </Toolbar>

                    {selectedRows.length > 0 && (
                      <Toolbar>
                        <Text variant="label.medium">{selectedRows.length}件選択中</Text>
                        <ToolbarSpacer />
                        <Button variant="subtle" size="small">
                          CSV エクスポート
                        </Button>
                        <Tooltip title="選択解除">
                          <IconButton aria-label="選択解除" variant="plain" size="small" onClick={handleClearSelection}>
                            <Icon>
                              <LfCloseCircle />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </Toolbar>
                    )}
                  </PageLayoutStickyContainer>
                  {pagedItems.length > 0 ? (
                    <div className={styles.tableContainer}>
                      <DataTable
                        columns={agreedContractsColumns}
                        rows={pagedItems}
                        getRowId={(row) => row.id}
                        stickyHeader
                        rowSelectionType="multiple"
                        selectedRows={selectedRows}
                        onSelectedRowsChange={setSelectedRows}
                        defaultColumnPinning={{ end: ["preview"] }}
                        defaultSorting={[{ id: "signingDate", desc: true }]}
                      />
                      {filteredItems.length > pageSize && (
                        <Pagination
                          page={page}
                          pageSize={pageSize}
                          totalCount={filteredItems.length}
                          onChange={handlePagination}
                        />
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      title={isFiltering ? "条件に一致する契約書がありません" : "締結版の契約書がありません"}
                      visual={isFiltering ? <MagnifyingGlass /> : <Box />}
                    >
                      <Text>
                        {isFiltering
                          ? "検索条件を変更して、もう一度お試しください。"
                          : "締結版の契約書はまだありません。"}
                      </Text>
                    </EmptyState>
                  )}
                </Tab.Panel>
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
                <FormControl.Label>契約書タイトル</FormControl.Label>
                <TextField placeholder="検索" />
              </FormControl>

              <FormControl>
                <FormControl.Label>取引先名</FormControl.Label>
                <TextField placeholder="検索" />
              </FormControl>

              <FormControl>
                <FormControl.Label>{isAllTab ? "契約書ステータス" : "契約状況"}</FormControl.Label>
                <Select
                  options={isAllTab ? contractDocumentStatusFilterOptions : agreedContractStatusFilterOptions}
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(value);
                    setPage(1);
                    setSelectedRows([]);
                  }}
                  placeholder="選択してください"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>{isAllTab ? "ファイル追加日" : "契約締結日"}</FormControl.Label>
                <RangeDateField />
              </FormControl>
            </div>
          </Drawer.Body>

          <div
            style={{
              borderTop: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-neutral-subtle)",
            }}
          >
            <Drawer.Footer>
              <ButtonGroup>
                <Button
                  variant="plain"
                  onClick={() => {
                    setStatusFilter("all");
                    setPage(1);
                    setSelectedRows([]);
                  }}
                >
                  リセット
                </Button>
              </ButtonGroup>
            </Drawer.Footer>
          </div>
        </Drawer>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default FileManagementList;
