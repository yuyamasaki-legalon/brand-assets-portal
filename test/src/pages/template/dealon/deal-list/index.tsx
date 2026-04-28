import { LfBell, LfCloseCircle, LfEllipsisDotVertical, LfList } from "@legalforce/aegis-icons";
import {
  Button,
  ContentHeader,
  ContentHeaderTitle,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DataTableLink,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Pagination,
  type PaginationOptions,
  StatusLabel,
  Tab,
  Text,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import { DealOnLayout } from "../layout";
import styles from "./index.module.css";
import type { DealItem } from "./mock";
import { mockDeals } from "./mock";
import { phaseColorMap } from "./utils";

// =============================================================================
// DataTable Column Definitions
// =============================================================================

const columns: DataTableColumnDef<DealItem, string>[] = [
  {
    id: "dealTitle",
    name: "案件名",
    getValue: (row): string => row.dealTitle,
    renderCell: ({ value }) => (
      <DataTableCell>
        <DataTableLink href="/template/dealon/deal-detail" />
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "customerName",
    name: "企業",
    getValue: (row): string => row.customerName,
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
    id: "phase",
    name: "フェーズ",
    getValue: (row): string => row.phase,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel variant="fill" size="small" color={phaseColorMap[row.phase]}>
          {row.phase}
        </StatusLabel>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "alertLevel",
    name: "アラートレベル",
    getValue: (row): string => {
      if (!row.alertCounts) return "";
      return `高${row.alertCounts.high} 中${row.alertCounts.medium} 低${row.alertCounts.low}`;
    },
    renderCell: ({ row }) => (
      <DataTableCell>
        {row.alertCounts ? (
          <Text variant="body.small">
            <Text as="span" color="danger">
              高{row.alertCounts.high}
            </Text>
            {" / "}
            <Text as="span" color="warning">
              中{row.alertCounts.medium}
            </Text>
            {" / "}
            <Text as="span" color="subtle">
              低{row.alertCounts.low}
            </Text>
          </Text>
        ) : (
          <Text color="subtle">-</Text>
        )}
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "alertCategories",
    name: "発生アラート区分",
    getValue: (row): string => (row.alertCategories.length > 0 ? row.alertCategories.join("、") : ""),
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text color={row.alertCategories.length > 0 ? undefined : "subtle"}>
          {row.alertCategories.length > 0 ? row.alertCategories.join("、") : "-"}
        </Text>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "dealValue",
    name: "案件金額",
    getValue: (row): string => row.dealValue.toString(),
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text>{`¥${row.dealValue.toLocaleString("ja-JP")}`}</Text>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "assignee",
    name: "案件主担当者",
    getValue: (row): string => row.assignee,
    pinnable: false,
    sortable: true,
  },
  {
    id: "alertUpdatedAt",
    name: "アラート更新日",
    getValue: (row): string => row.alertUpdatedAt,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Text color="subtle">{value}</Text>
      </DataTableCell>
    ),
    pinnable: false,
    sortable: true,
  },
  {
    id: "actions",
    name: "",
    getValue: (): string => "",
    pinnable: false,
    renderCell: () => (
      <DataTableCell>
        <Menu>
          <MenuTrigger>
            <Tooltip title="操作">
              <IconButton aria-label="操作" variant="plain" size="small">
                <Icon>
                  <LfEllipsisDotVertical />
                </Icon>
              </IconButton>
            </Tooltip>
          </MenuTrigger>
          <MenuContent side="bottom" align="end">
            <MenuItem>案件詳細を表示</MenuItem>
            <MenuItem>担当者を変更</MenuItem>
            <MenuSeparator />
            <MenuItem color="danger">案件を削除</MenuItem>
          </MenuContent>
        </Menu>
      </DataTableCell>
    ),
    sortable: false,
  },
];

// =============================================================================
// Component
// =============================================================================

export default function DealOnDealListPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const pageSize = 20;

  const filteredItems = useMemo(() => {
    if (tabIndex === 1) {
      return mockDeals.filter((deal) => deal.alertCounts !== null || deal.alertCategories.length > 0);
    }
    return mockDeals;
  }, [tabIndex]);

  const pagedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
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

  return (
    <DealOnLayout>
      <PageLayoutContent scrollBehavior="outside">
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>案件一覧</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Tab.Group index={tabIndex} onChange={handleTabChange}>
            <Toolbar>
              <div className={styles.tabListWrapper}>
                <Tab.List>
                  <Tab leading={LfList}>
                    <Text whiteSpace="nowrap">全て</Text>
                  </Tab>
                  <Tab leading={LfBell}>
                    <Text whiteSpace="nowrap">アラートあり</Text>
                  </Tab>
                </Tab.List>
              </div>
              <ToolbarSpacer />
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

            <Tab.Panels>
              {[0, 1].map((idx) => (
                <Tab.Panel key={idx}>
                  <div className={styles.tableContainer}>
                    <DataTable
                      columns={columns}
                      rows={pagedItems}
                      getRowId={(row) => row.id}
                      stickyHeader
                      rowSelectionType="multiple"
                      selectedRows={selectedRows}
                      onSelectedRowsChange={setSelectedRows}
                      defaultColumnPinning={{ end: ["actions"] }}
                      defaultSorting={[{ id: "alertUpdatedAt", desc: true }]}
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
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </PageLayoutBody>
      </PageLayoutContent>
    </DealOnLayout>
  );
}
