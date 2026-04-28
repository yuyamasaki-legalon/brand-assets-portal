import { LfAngleDownMiddle, LfFolderTree, LfPlusLarge } from "@legalforce/aegis-icons";
import { Box, MagnifyingGlass } from "@legalforce/aegis-illustrations/react";
import {
  Button,
  ContentHeader,
  ContentHeaderTitle,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  EmptyState,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  Pagination,
  type PaginationOptions,
  Search,
  Text,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { type ChangeEvent, useMemo, useState } from "react";
import { LocSidebarLayout } from "../../_shared";

// =============================================================================
// Types
// =============================================================================

interface CustomerTemplate {
  id: string;
  fileName: string;
  templateTitle: string;
  spaceName: string;
  createTime: string;
  language: string;
}

// =============================================================================
// Mock Data
// =============================================================================

const mockCustomerTemplates: CustomerTemplate[] = [
  {
    id: "1",
    fileName: "秘密保持契約書_v2.docx",
    templateTitle: "特許実施許諾契約書",
    spaceName: "案件受付スペース",
    createTime: "2026/03/11 10:26",
    language: "日本語",
  },
  {
    id: "2",
    fileName: "業務委託契約書_受託者有利.pdf",
    templateTitle: "業務委託契約書",
    spaceName: "案件受付スペース",
    createTime: "2025/12/22 12:03",
    language: "日本語",
  },
  {
    id: "3",
    fileName: "業務委託契約書_標準版.pdf",
    templateTitle: "業務委託契約書",
    spaceName: "案件受付スペース",
    createTime: "2025/12/22 12:02",
    language: "日本語",
  },
  {
    id: "4",
    fileName: "売買基本契約書.pdf",
    templateTitle: "",
    spaceName: "法務部スペース",
    createTime: "2024/02/19 11:48",
    language: "日本語",
  },
];

// =============================================================================
// Columns
// =============================================================================

const columns: DataTableColumnDef<CustomerTemplate, string>[] = [
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
    id: "templateTitle",
    name: "ひな形タイトル",
    getValue: (row): string => row.templateTitle,
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
    id: "spaceName",
    name: "保存先",
    getValue: (row): string => row.spaceName,
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
    id: "createTime",
    name: "ファイル追加日時",
    getValue: (row): string => row.createTime,
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
];

// =============================================================================
// Component
// =============================================================================

export default function CustomerTemplateList() {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    if (!normalizedSearch) return mockCustomerTemplates;
    return mockCustomerTemplates.filter(
      (item) =>
        item.fileName.toLowerCase().includes(normalizedSearch) ||
        item.templateTitle.toLowerCase().includes(normalizedSearch),
    );
  }, [searchValue]);

  const pagedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setPage(1);
  };

  const handlePagination: Exclude<PaginationOptions["onChange"], undefined> = (value, action) => {
    if (action === "go-to-first") {
      setPage(1);
      return;
    }
    setPage(value);
  };

  const isFiltering = searchValue.trim() !== "";

  return (
    <LocSidebarLayout activeId="contracts">
      <PageLayout>
        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader
              trailing={
                <Button leading={LfPlusLarge} variant="solid" size="medium">
                  アップロード
                </Button>
              }
            >
              <ContentHeaderTitle>自社ひな形</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>

          <PageLayoutBody>
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
                <Search
                  placeholder="キーワードフィルターを開く"
                  shrinkOnBlur
                  value={searchValue}
                  onChange={handleSearchChange}
                />
              </Toolbar>
            </PageLayoutStickyContainer>

            {pagedItems.length > 0 ? (
              <>
                <DataTable
                  columns={columns}
                  rows={pagedItems}
                  getRowId={(row) => row.id}
                  rowSelectionType="multiple"
                  stickyHeader
                  defaultSorting={[{ id: "createTime", desc: true }]}
                />
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  totalCount={filteredItems.length}
                  onChange={handlePagination}
                />
              </>
            ) : (
              <EmptyState
                title={isFiltering ? "条件に一致するひな形がありません" : "ひな形がありません"}
                visual={isFiltering ? <MagnifyingGlass /> : <Box />}
              >
                <Text>
                  {isFiltering
                    ? "検索条件を変更して、もう一度お試しください。"
                    : "「アップロード」ボタンから自社ひな形を追加してください。"}
                </Text>
              </EmptyState>
            )}
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
}
