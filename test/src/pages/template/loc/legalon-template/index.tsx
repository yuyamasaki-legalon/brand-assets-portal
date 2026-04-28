import { LfAngleLeftMiddle, LfDownload, LfEarth } from "@legalforce/aegis-icons";
import {
  Badge,
  Button,
  Checkbox,
  ContentHeader,
  ContentHeaderTitle,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DataTableHeader,
  DataTableLink,
  Divider,
  Drawer,
  EmptyState,
  Form,
  FormControl,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Pagination,
  Popover,
  Search,
  SegmentedControl,
  Select,
  snackbar,
  Tag,
  Text,
  Toolbar,
  Tooltip,
} from "@legalforce/aegis-react";
import { type RefObject, useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocSidebarLayout } from "../_shared";
import { categories, subCategories, type Template, templates } from "./mock/data";

const PAGE_SIZE = 10;

export type Language = "all" | "japanese" | "english" | "chinese";
const LANGUAGE_MAP: Language[] = ["all", "japanese", "english", "chinese"];

// PageHeader Component
interface PageHeaderProps {
  categoryName?: string;
}

const PageHeader = ({ categoryName }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
      <Tooltip title="戻る">
        <IconButton
          icon={LfAngleLeftMiddle}
          variant="plain"
          aria-label="戻る"
          onClick={() => navigate("/template/legalon-template/category")}
        />
      </Tooltip>
      <ContentHeader size="xLarge">
        <ContentHeaderTitle>{categoryName || "すべてのカテゴリー"}</ContentHeaderTitle>
      </ContentHeader>
    </div>
  );
};

// TableToolbar Component
interface TableToolbarProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  filterActive: boolean;
  onFilterClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
}

const TableToolbar = ({
  selectedLanguage,
  onLanguageChange,
  filterActive,
  onFilterClick,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}: TableToolbarProps) => {
  const selectedIndex = LANGUAGE_MAP.indexOf(selectedLanguage);

  return (
    <Toolbar>
      <SegmentedControl index={selectedIndex} onChange={(index) => onLanguageChange(LANGUAGE_MAP[index])}>
        <SegmentedControl.Button>すべて</SegmentedControl.Button>
        <SegmentedControl.Button>日本語</SegmentedControl.Button>
        <SegmentedControl.Button>英語</SegmentedControl.Button>
        <SegmentedControl.Button>中国語</SegmentedControl.Button>
      </SegmentedControl>
      <Toolbar.Spacer />
      <Button
        onClick={onFilterClick}
        aria-pressed={filterActive}
        leading={<Badge color={filterActive ? "information" : "subtle"} />}
      >
        フィルター
      </Button>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
      >
        <Search value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="検索" shrinkOnBlur />
      </Form>
    </Toolbar>
  );
};

// Filter Component
interface FilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSubCategories: string[];
  onSubCategoriesChange: (subCategories: string[]) => void;
  root?: RefObject<HTMLElement | null>;
}

const Filter = ({
  open,
  onOpenChange,
  selectedCategory,
  onCategoryChange,
  selectedSubCategories,
  onSubCategoriesChange,
  root,
}: FilterProps) => {
  const handleReset = () => {
    onCategoryChange("");
    onSubCategoriesChange([]);
  };

  const availableSubCategories = selectedCategory
    ? subCategories.filter((sub) => sub.categoryId === selectedCategory)
    : [];

  const handleSubCategoryToggle = (subCatId: string) => {
    if (selectedSubCategories.includes(subCatId)) {
      onSubCategoriesChange(selectedSubCategories.filter((id) => id !== subCatId));
    } else if (selectedSubCategories.length < 3) {
      onSubCategoriesChange([...selectedSubCategories, subCatId]);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} position="end" width="medium" root={root} lockScroll={false}>
      <Drawer.Header>フィルター</Drawer.Header>
      <Drawer.Body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-large)",
          }}
        >
          <FormControl>
            <FormControl.Label>カテゴリー</FormControl.Label>
            <Select
              options={[
                { label: "カテゴリーを選択", value: "" },
                ...categories.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                })),
              ]}
              value={selectedCategory}
              onChange={(value) => onCategoryChange(value)}
            />
          </FormControl>

          {availableSubCategories.length > 0 && (
            <FormControl>
              <FormControl.Label>サブカテゴリー（最大3つ）</FormControl.Label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                }}
              >
                {availableSubCategories.map((subCat) => {
                  const isChecked = selectedSubCategories.includes(subCat.id);
                  const isDisabled = !isChecked && selectedSubCategories.length >= 3;
                  return (
                    <Checkbox
                      key={subCat.id}
                      checked={isChecked}
                      onChange={() => handleSubCategoryToggle(subCat.id)}
                      disabled={isDisabled}
                    >
                      {subCat.name}
                    </Checkbox>
                  );
                })}
              </div>
            </FormControl>
          )}
        </div>
      </Drawer.Body>
      <Drawer.Footer>
        <Button onClick={handleReset}>リセット</Button>
      </Drawer.Footer>
    </Drawer>
  );
};

/**
 * ダウンロードボタン。
 *
 * loc-app では以下の機能を持つ:
 * - ダウンロード制限到達時: Popover で理由を表示し、ボタンを disabled にする
 * - トライアル時: ボタンを disabled にする
 * - MHL ひな形はダウンロード制限の対象外
 */
const DownloadButton = ({ title, disabled }: { title: string; disabled?: boolean }) => {
  if (disabled) {
    return (
      <Popover arrow placement="bottom-end" trigger="hover" closeButton={false}>
        <Popover.Anchor>
          <Tooltip title="ダウンロード" disabled>
            <IconButton aria-label={`${title} をダウンロード`} icon={LfDownload} disabled />
          </Tooltip>
        </Popover.Anchor>
        <Popover.Content>
          <Popover.Body>
            <Text variant="body.small">ダウンロード回数の上限に達しました</Text>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    );
  }

  return (
    <Tooltip title="ダウンロード">
      <IconButton
        aria-label={`${title} をダウンロード`}
        icon={LfDownload}
        onClick={(e) => {
          e.stopPropagation();
          snackbar.show({ message: `${title} をダウンロードしました` });
        }}
      />
    </Tooltip>
  );
};

/** その他条件のタグを描画する。 */
const renderOtherConditionTags = (template: Template) => {
  const tags = [];

  if (template.language.includes("english")) {
    tags.push(
      <Tag key="en" leading={LfEarth}>
        英語
      </Tag>,
    );
  }

  if (template.language.includes("chinese")) {
    tags.push(
      <Tag key="zh" leading={LfEarth}>
        中文
      </Tag>,
    );
  }

  if (template.hasCommentary) {
    tags.push(<Tag key="commentary">解説付き</Tag>);
  }

  return tags;
};

/**
 * カラム定義キー。
 *
 * loc-app では BaseColumnKey = 'title' | 'advantageousPosition' | 'otherConditions' | 'governingLaw' | 'author'
 */
type ColumnKey = "title" | "advantageousPosition" | "otherConditions" | "governingLaw" | "author" | "actions";

/** デフォルトの列並び順。loc-app では useColumnOrder で localStorage に永続化される。 */
const defaultColumnOrder: ColumnKey[] = [
  "title",
  "advantageousPosition",
  "otherConditions",
  "governingLaw",
  "author",
  "actions",
];

/** カラム定義。loc-app では useLegalonTemplateTableColumns フックで生成。 */
const legalonTemplateColumns: DataTableColumnDef<Template, Template>[] = [
  {
    id: "title",
    name: "ひな形名",
    width: "small",
    minWidth: "xxSmall",
    maxWidth: "xxLarge",
    resizable: true,
    renderHeader: ({ name }) => <DataTableHeader>{name}</DataTableHeader>,
    renderCell: ({ row }) => (
      <DataTableCell>
        <DataTableLink href={`/template/legalon-template/${row.id}`}>
          <Tooltip title={row.title} placement="top-start" onlyOnOverflow>
            <Text numberOfLines={1}>{row.title}</Text>
          </Tooltip>
        </DataTableLink>
      </DataTableCell>
    ),
  },
  {
    id: "advantageousPosition",
    name: "立場",
    width: "auto",
    minWidth: "xxSmall",
    resizable: true,
    renderHeader: ({ name }) => <DataTableHeader>{name}</DataTableHeader>,
    renderCell: ({ row }) => <DataTableCell>{row.position || "-"}</DataTableCell>,
  },
  {
    id: "otherConditions",
    name: "その他",
    width: "auto",
    minWidth: "xxSmall",
    resizable: true,
    renderHeader: ({ name }) => <DataTableHeader>{name}</DataTableHeader>,
    renderCell: ({ row }) => (
      <DataTableCell>
        <div style={{ display: "flex", gap: "var(--aegis-space-xxSmall)", flexWrap: "wrap" }}>
          {renderOtherConditionTags(row)}
        </div>
      </DataTableCell>
    ),
  },
  {
    id: "governingLaw",
    name: "準拠法",
    width: "auto",
    minWidth: "xxSmall",
    resizable: true,
    renderHeader: ({ name }) => <DataTableHeader>{name}</DataTableHeader>,
    renderCell: ({ row }) => <DataTableCell>{row.governingLaw || "-"}</DataTableCell>,
  },
  {
    id: "author",
    name: "作成者",
    width: "small",
    minWidth: "xxSmall",
    resizable: true,
    renderHeader: ({ name }) => <DataTableHeader>{name}</DataTableHeader>,
    renderCell: ({ row }) => <DataTableCell>{row.creator}</DataTableCell>,
  },
  {
    id: "actions",
    name: null,
    width: "fit",
    resizable: false,
    hideable: false,
    pinnable: false,
    reorderable: false,
    renderHeader: () => <DataTableHeader />,
    renderCell: ({ row }) => (
      <DataTableCell>
        <DownloadButton title={row.title} />
      </DataTableCell>
    ),
  },
];

/**
 * LegalOnひな形一覧テーブル。
 *
 * loc-app では以下の機能を持つ:
 * - DataTable を使用（rowVirtualization 有効）
 * - useColumnOrder: localStorage で列並び順を永続化
 * - usePersistedDataTablePreferences: columnPinning / columnSizing を localStorage で永続化
 * - EmptyState: 検索結果なし時の表示
 */
const LegalonTemplateTable = ({ filteredTemplates }: { filteredTemplates: Template[] }) => {
  const [columnOrder, setColumnOrder] = useState<string[]>([...defaultColumnOrder]);
  const [columnPinning, setColumnPinning] = useState<{ start?: string[]; end?: string[] }>({
    end: ["actions"],
  });
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});

  const handleColumnOrderChange = useCallback((nextColumnOrder: readonly string[]) => {
    setColumnOrder([...nextColumnOrder]);
  }, []);

  const handleColumnPinningChange = useCallback((next: { start?: string[]; end?: string[] }) => {
    setColumnPinning({
      ...next,
      end: [...(next.end?.filter((id) => id !== "actions") ?? []), "actions"],
    });
  }, []);

  const handleColumnSizingChange = useCallback((next: Record<string, number>) => {
    setColumnSizing(next);
  }, []);

  if (filteredTemplates.length === 0) {
    return <EmptyState title="該当するテンプレートが見つかりませんでした">検索条件を変更してください</EmptyState>;
  }

  return (
    <DataTable
      columns={legalonTemplateColumns}
      rows={filteredTemplates}
      getRowId={(row) => row.id}
      stickyHeader
      rowVirtualization
      columnOrder={columnOrder}
      defaultColumnOrder={[...defaultColumnOrder]}
      onColumnOrderChange={handleColumnOrderChange}
      columnPinning={columnPinning}
      onColumnPinningChange={handleColumnPinningChange}
      columnSizing={columnSizing}
      onColumnSizingChange={handleColumnSizingChange}
      highlightRowOnHover
    />
  );
};

// Main Component
export const LegalonTemplateIndex = () => {
  const drawerRoot = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // フィルタリング
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // 言語フィルター
      if (selectedLanguage !== "all") {
        if (!template.language.includes(selectedLanguage)) {
          return false;
        }
      }

      // カテゴリーフィルター
      if (selectedCategory && !template.categories.includes(selectedCategory)) {
        return false;
      }

      // サブカテゴリーフィルター
      if (
        selectedSubCategories.length > 0 &&
        !selectedSubCategories.some((sub) => template.subCategories.includes(sub))
      ) {
        return false;
      }

      // 検索フィルター
      if (searchQuery && !template.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [selectedLanguage, selectedCategory, selectedSubCategories, searchQuery]);

  // ページネーション
  const paginatedTemplates = filteredTemplates.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const filterActive = selectedCategory !== "" || selectedSubCategories.length > 0;

  return (
    <LocSidebarLayout activeId="templates">
      <PageLayout>
        <PageLayoutContent>
          <PageLayoutHeader>
            <PageHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              ref={drawerRoot}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <TableToolbar
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                filterActive={filterActive}
                onFilterClick={() => setFilterOpen(true)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={() => setCurrentPage(1)}
              />

              <LegalonTemplateTable filteredTemplates={paginatedTemplates} />
              {paginatedTemplates.length > 0 && (
                <Pagination
                  totalCount={filteredTemplates.length}
                  pageSize={PAGE_SIZE}
                  page={currentPage}
                  onChange={setCurrentPage}
                />
              )}

              <Divider />
              <Text variant="caption.xSmall" color="subtle">
                LegalOnひな形は、法務業務を効率化するためのテンプレート集です。
              </Text>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>

        <Filter
          root={drawerRoot}
          open={filterOpen}
          onOpenChange={setFilterOpen}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedSubCategories={selectedSubCategories}
          onSubCategoriesChange={setSelectedSubCategories}
        />
      </PageLayout>
    </LocSidebarLayout>
  );
};
