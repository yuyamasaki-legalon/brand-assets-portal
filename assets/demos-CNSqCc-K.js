var e=`import {
  LfAngleRightMiddle,
  LfEllipsisDot,
  LfFilter,
  LfPen,
  LfPlusLarge,
  LfQuestionCircle,
  LfTrash,
} from "@legalforce/aegis-icons";
import { Box, ErrorCat2 } from "@legalforce/aegis-illustrations/react";
import {
  ActionListBody,
  Avatar,
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  ContentHeader,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Drawer,
  DrawerBody,
  DrawerHeader,
  EmptyState,
  Form,
  FormControl,
  Header,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Pagination,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  Search,
  Select,
  StatusLabel,
  Tab,
  Table,
  TableContainer,
  Tag,
  TagGroup,
  TagPicker,
  Text,
  TextField,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { type ReactNode, useMemo, useState } from "react";

const PreviewSurface = ({ children, maxWidth }: { children: ReactNode; maxWidth?: string }) => (
  <div
    style={{
      padding: "var(--aegis-space-medium)",
      borderRadius: "var(--aegis-radius-large)",
      background: "var(--aegis-color-background-subtle)",
      border: "1px solid var(--aegis-color-border-default)",
      maxWidth: maxWidth ?? "100%",
    }}
  >
    {children}
  </div>
);

// 1. action-menu -----------------------------------------------------------
const ActionMenuDemo = () => (
  <PreviewSurface maxWidth="var(--aegis-layout-width-x4Small)">
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Menu>
        <MenuTrigger>
          <Tooltip title="その他" placement="left">
            <IconButton aria-label="その他" variant="plain">
              <Icon>
                <LfEllipsisDot />
              </Icon>
            </IconButton>
          </Tooltip>
        </MenuTrigger>
        <MenuContent side="bottom" align="end">
          <MenuGroup>
            <MenuItem
              leading={
                <Icon>
                  <LfPen />
                </Icon>
              }
            >
              編集
            </MenuItem>
            <MenuItem>複製</MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuItem
              color="danger"
              leading={
                <Icon>
                  <LfTrash />
                </Icon>
              }
            >
              削除
            </MenuItem>
          </MenuGroup>
        </MenuContent>
      </Menu>
    </div>
  </PreviewSurface>
);

// 2. data-table-pagination -------------------------------------------------
interface DemoRow {
  id: string;
  title: string;
  status: "draft" | "review" | "approved";
  updatedAt: string;
}

const allRows: DemoRow[] = Array.from({ length: 23 }, (_, index) => {
  const statuses: DemoRow["status"][] = ["draft", "review", "approved"];
  return {
    id: \`CTR-\${String(index + 1).padStart(4, "0")}\`,
    title: \`業務委託契約書 v\${index + 1}\`,
    status: statuses[index % 3],
    updatedAt: \`2026-05-\${String((index % 28) + 1).padStart(2, "0")}\`,
  };
});

const statusLabels: Record<DemoRow["status"], string> = {
  draft: "下書き",
  review: "レビュー中",
  approved: "承認済",
};

const statusColors: Record<DemoRow["status"], "neutral" | "blue" | "lime"> = {
  draft: "neutral",
  review: "blue",
  approved: "lime",
};

const dataTableColumns: DataTableColumnDef<DemoRow, string>[] = [
  { id: "id", name: "ID", getValue: (row) => row.id, sortable: true },
  { id: "title", name: "タイトル", getValue: (row) => row.title, sortable: true },
  {
    id: "status",
    name: "ステータス",
    getValue: (row) => row.status,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel size="small" color={statusColors[row.status]}>
          {statusLabels[row.status]}
        </StatusLabel>
      </DataTableCell>
    ),
    sortable: true,
  },
  { id: "updatedAt", name: "更新日", getValue: (row) => row.updatedAt, sortable: true },
];

const DataTablePaginationDemo = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const rows = useMemo(() => allRows.slice((page - 1) * pageSize, page * pageSize), [page]);

  return (
    <PreviewSurface>
      <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
        <DataTable columns={dataTableColumns} rows={rows} getRowId={(row) => row.id} size="small" />
        <Pagination page={page} pageSize={pageSize} totalCount={allRows.length} onChange={(value) => setPage(value)} />
      </div>
    </PreviewSurface>
  );
};

// 3. detail-header ---------------------------------------------------------
const DetailHeaderDemo = () => (
  <PreviewSurface>
    <Header>
      <Header.Item>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
            <StatusLabel color="blue">レビュー中</StatusLabel>
            <Header.Title>
              <Text variant="title.xxSmall">業務委託契約書 v3</Text>
            </Header.Title>
          </div>
          <Text variant="body.small" color="subtle">
            CTR-0042
          </Text>
        </div>
      </Header.Item>
      <Header.Spacer />
      <Header.Item>
        <ButtonGroup>
          <Button variant="plain" leading={<LfPen />}>
            編集
          </Button>
          <Button variant="solid">保存</Button>
        </ButtonGroup>
        <Tooltip title="その他" placement="bottom">
          <IconButton variant="plain" aria-label="その他">
            <Icon>
              <LfEllipsisDot />
            </Icon>
          </IconButton>
        </Tooltip>
      </Header.Item>
    </Header>
  </PreviewSurface>
);

// 4. disabled-action-popover -----------------------------------------------
const DisabledActionPopoverDemo = () => (
  <PreviewSurface maxWidth="var(--aegis-layout-width-x4Small)">
    <Menu open>
      <MenuTrigger>
        <Button variant="subtle">アクションを開く</Button>
      </MenuTrigger>
      <MenuContent side="bottom" align="start">
        <MenuGroup>
          <MenuItem
            leading={
              <Icon>
                <LfPen />
              </Icon>
            }
          >
            編集
          </MenuItem>
          <Popover placement="right" arrow trigger="hover" closeButton={false}>
            <PopoverAnchor>
              <MenuItem
                disabled
                leading={
                  <Icon>
                    <LfTrash />
                  </Icon>
                }
              >
                削除
              </MenuItem>
            </PopoverAnchor>
            <PopoverContent width="small">
              <PopoverBody>
                <Text>権限がないため削除できません。管理者に依頼してください。</Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </MenuGroup>
      </MenuContent>
    </Menu>
  </PreviewSurface>
);

// 5. empty-state -----------------------------------------------------------
const EmptyStateDemo = () => (
  <PreviewSurface>
    <EmptyState
      title="項目がありません"
      visual={<Box />}
      action={
        <Button variant="solid" size="medium" leading={<LfPlusLarge />}>
          新規作成
        </Button>
      }
    >
      <Text>新規作成ボタンから項目を追加してください。</Text>
    </EmptyState>
  </PreviewSurface>
);

// 6. filter-drawer ---------------------------------------------------------
const FilterDrawerDemo = () => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [department, setDepartment] = useState<string>("");
  const [statuses, setStatuses] = useState<string[]>([]);

  const toggleStatus = (status: string, checked: boolean) =>
    setStatuses((prev) => (checked ? [...prev, status] : prev.filter((s) => s !== status)));

  return (
    <PreviewSurface>
      <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
        <Button onClick={() => setOpen(true)} leading={<LfFilter />} variant="subtle">
          フィルター
        </Button>
        <Text variant="body.small" color="subtle">
          ボタンを押すと右からドロワーが開きます
        </Text>
      </div>
      <Drawer open={open} onOpenChange={setOpen} position="end" width="small">
        <DrawerHeader>
          <ContentHeader>
            <ContentHeader.Title>フィルター</ContentHeader.Title>
          </ContentHeader>
        </DrawerHeader>
        <DrawerBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            <FormControl>
              <FormControl.Label>ID/タイトル</FormControl.Label>
              <TextField
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="ID またはタイトルを入力"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>ステータス</FormControl.Label>
              <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                {(["draft", "review", "approved"] as const).map((status) => (
                  <Checkbox
                    key={status}
                    checked={statuses.includes(status)}
                    onChange={(event) => toggleStatus(status, event.target.checked)}
                  >
                    {statusLabels[status]}
                  </Checkbox>
                ))}
              </div>
            </FormControl>
            <FormControl>
              <FormControl.Label>部署</FormControl.Label>
              <Select
                placeholder="部署を選択"
                value={department}
                onChange={(value) => setDepartment(String(value ?? ""))}
                options={[
                  { value: "legal", label: "法務" },
                  { value: "sales", label: "営業" },
                  { value: "hr", label: "人事" },
                ]}
              />
            </FormControl>
            <Button variant="solid" onClick={() => setOpen(false)}>
              適用
            </Button>
          </div>
        </DrawerBody>
      </Drawer>
    </PreviewSurface>
  );
};

// 7. form-control-help-tagpicker -------------------------------------------
const FormControlHelpTagPickerDemo = () => {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <PreviewSurface maxWidth="var(--aegis-layout-width-small)">
      <FormControl>
        <FormControl.Label>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xxSmall)" }}>
            ステータス
            <Popover trigger="hover" arrow placement="top-start">
              <PopoverAnchor>
                <IconButton variant="plain" size="xSmall" aria-label="ヘルプ">
                  <Icon>
                    <LfQuestionCircle />
                  </Icon>
                </IconButton>
              </PopoverAnchor>
              <PopoverContent width="small">
                <PopoverBody>
                  <Text variant="body.small">選択中のステータスが検索条件になります。</Text>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </div>
        </FormControl.Label>
        <TagPicker
          value={selected}
          options={[
            { value: "draft", label: "下書き" },
            { value: "review", label: "レビュー中" },
            { value: "approved", label: "承認済" },
          ]}
          onChange={(value) => setSelected(value as string[])}
          placeholder="ステータスを選択"
        />
      </FormControl>
    </PreviewSurface>
  );
};

// 8. form-with-banner ------------------------------------------------------
const FormWithBannerDemo = () => {
  const [submitError, setSubmitError] = useState(true);
  const [name, setName] = useState("");
  return (
    <PreviewSurface maxWidth="var(--aegis-layout-width-small)">
      <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
        {submitError && (
          <Banner color="danger" closeButton={false}>
            <Text>入力内容に誤りがあります。確認してください。</Text>
          </Banner>
        )}
        <Form>
          <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
            <FormControl error={submitError && name === ""}>
              <FormControl.Label>名前</FormControl.Label>
              <TextField value={name} onChange={(event) => setName(event.target.value)} placeholder="氏名を入力" />
              {submitError && name === "" && <FormControl.Caption>必須項目です。</FormControl.Caption>}
            </FormControl>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setSubmitError(false)}>
                エラーを消す
              </Button>
              <Button variant="solid" onClick={() => setSubmitError(name === "")}>
                保存
              </Button>
            </ButtonGroup>
          </div>
        </Form>
      </div>
    </PreviewSurface>
  );
};

// 9. list-toolbar-and-search -----------------------------------------------
const ListToolbarAndSearchDemo = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filterActive, setFilterActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <PreviewSurface>
      <Tab.Group index={tabIndex} onChange={setTabIndex}>
        <Toolbar>
          <div style={{ overflow: "hidden" }}>
            <Tab.List>
              <Tab>すべて</Tab>
              <Tab>進行中</Tab>
              <Tab>完了</Tab>
            </Tab.List>
          </div>
          <ToolbarSpacer />
          <ButtonGroup>
            <Button
              variant={filterActive ? "subtle" : "plain"}
              leading={<LfFilter />}
              onClick={() => setFilterActive((prev) => !prev)}
            >
              フィルター
            </Button>
            <Search
              placeholder="ID・タイトルで検索"
              shrinkOnBlur
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </ButtonGroup>
        </Toolbar>
      </Tab.Group>
    </PreviewSurface>
  );
};

// 10. maintenance-empty-state ----------------------------------------------
const MaintenanceEmptyStateDemo = () => (
  <PreviewSurface>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <EmptyState size="large" title="現在メンテナンス中です" visual={<ErrorCat2 />}>
        <Text as="span">
          詳細は{" "}
          <Link href="#" target="_blank" rel="noopener noreferrer">
            ステータスページ
          </Link>{" "}
          をご確認ください。
        </Text>
      </EmptyState>
    </div>
  </PreviewSurface>
);

// 11. overflow-tooltip -----------------------------------------------------
const OverflowTooltipDemo = () => {
  const longText =
    "この行はとても長いタイトルです。コンテナの幅を超えると省略され、ホバー時に Tooltip で全文が表示されます。";
  return (
    <PreviewSurface maxWidth="var(--aegis-layout-width-x3Small)">
      <Tooltip onlyOnOverflow title={longText} placement="top-start">
        <Text variant="body.medium" numberOfLines={1}>
          {longText}
        </Text>
      </Tooltip>
    </PreviewSurface>
  );
};

// 12. sidebar-layout -------------------------------------------------------
// SidebarProvider はアプリ全体に 1 つ前提で Drawer 内には置けないため、
// 専用ページ (/patterns/recipes/sidebar-layout) に外出ししている。

// 13. status-and-tags ------------------------------------------------------
const StatusAndTagsDemo = () => (
  <PreviewSurface>
    <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
        <StatusLabel color="blue">レビュー中</StatusLabel>
        <Text variant="body.small" color="subtle">
          CTR-0042
        </Text>
      </div>
      <TagGroup>
        <Tag>業務委託</Tag>
        <Tag>機密</Tag>
        <Tag>2026Q2</Tag>
        <Tag>法務レビュー済</Tag>
      </TagGroup>
    </div>
  </PreviewSurface>
);

// 14. table-action-cell-menu -----------------------------------------------
const TableActionCellMenuDemo = () => (
  <PreviewSurface>
    <TableContainer>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell>タイトル</Table.Cell>
            <Table.Cell>ステータス</Table.Cell>
            <Table.ActionCell />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {allRows.slice(0, 3).map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.title}</Table.Cell>
              <Table.Cell>
                <StatusLabel size="small" color={statusColors[row.status]}>
                  {statusLabels[row.status]}
                </StatusLabel>
              </Table.Cell>
              <Table.ActionCell>
                <ButtonGroup>
                  <Button size="small">作成</Button>
                  <Menu>
                    <MenuTrigger>
                      <Tooltip title="その他">
                        <IconButton variant="plain" aria-label="その他">
                          <Icon>
                            <LfEllipsisDot />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    </MenuTrigger>
                    <MenuContent side="bottom" align="end">
                      <MenuGroup>
                        <MenuItem
                          leading={
                            <Icon>
                              <LfPen />
                            </Icon>
                          }
                        >
                          編集
                        </MenuItem>
                      </MenuGroup>
                      <MenuGroup>
                        <MenuItem
                          color="danger"
                          leading={
                            <Icon>
                              <LfTrash />
                            </Icon>
                          }
                        >
                          削除
                        </MenuItem>
                      </MenuGroup>
                    </MenuContent>
                  </Menu>
                </ButtonGroup>
              </Table.ActionCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  </PreviewSurface>
);

// 15. table-container-basic ------------------------------------------------
const TableContainerBasicDemo = () => (
  <PreviewSurface>
    <TableContainer>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell>名前</Table.Cell>
            <Table.Cell>ID</Table.Cell>
            <Table.ActionCell />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {[
            { id: "USR-001", name: "山田 太郎" },
            { id: "USR-002", name: "佐藤 花子" },
            { id: "USR-003", name: "鈴木 一郎" },
          ].map(({ id, name }) => (
            <Table.Row key={id}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{id}</Table.Cell>
              <Table.ActionCell>
                <Button
                  trailing={
                    <Icon size="large">
                      <LfAngleRightMiddle />
                    </Icon>
                  }
                  variant="solid"
                  size="small"
                >
                  詳細へ
                </Button>
              </Table.ActionCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  </PreviewSurface>
);

// 16. tagpicker-custom-options ---------------------------------------------
interface Person {
  id: string;
  name: string;
  department: string;
}

const people: Person[] = [
  { id: "p1", name: "山田 太郎", department: "法務部" },
  { id: "p2", name: "佐藤 花子", department: "営業部" },
  { id: "p3", name: "鈴木 一郎", department: "人事部" },
  { id: "p4", name: "高橋 二郎", department: "法務部" },
];

const TagPickerCustomOptionsDemo = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");

  const filteredOptions = useMemo(() => {
    const needle = keyword.trim();
    const source =
      needle === "" ? people : people.filter((p) => p.name.includes(needle) || p.department.includes(needle));
    return source.map((person) => ({
      value: person.id,
      label: person.name,
      body: (
        <ActionListBody leading={<Avatar name={person.name} size="xSmall" as="span" />} alignItems="start">
          <Text variant="body.medium.bold">{person.name}</Text>
          <Text variant="body.small" color="subtle">
            {person.department}
          </Text>
        </ActionListBody>
      ),
    }));
  }, [keyword]);

  return (
    <PreviewSurface maxWidth="var(--aegis-layout-width-small)">
      <FormControl>
        <FormControl.Label>担当者</FormControl.Label>
        <TagPicker
          placeholder="担当者を検索"
          options={filteredOptions}
          value={selected}
          onChange={(value) => setSelected(value as string[])}
          emptyNode={<EmptyState size="small" title="候補がありません" />}
          textValue={keyword}
          onTextChange={setKeyword}
          filter={false}
        />
      </FormControl>
    </PreviewSurface>
  );
};

// Registry -----------------------------------------------------------------
export const recipeDemos: Record<string, () => ReactNode> = {
  "action-menu": ActionMenuDemo,
  "data-table-pagination": DataTablePaginationDemo,
  "detail-header": DetailHeaderDemo,
  "disabled-action-popover": DisabledActionPopoverDemo,
  "empty-state": EmptyStateDemo,
  "filter-drawer": FilterDrawerDemo,
  "form-control-help-tagpicker": FormControlHelpTagPickerDemo,
  "form-with-banner": FormWithBannerDemo,
  "list-toolbar-and-search": ListToolbarAndSearchDemo,
  "maintenance-empty-state": MaintenanceEmptyStateDemo,
  "overflow-tooltip": OverflowTooltipDemo,
  "status-and-tags": StatusAndTagsDemo,
  "table-action-cell-menu": TableActionCellMenuDemo,
  "table-container-basic": TableContainerBasicDemo,
  "tagpicker-custom-options": TagPickerCustomOptionsDemo,
};

/**
 * Drawer に収まらないレシピは別ページで公開する。
 * slug → 遷移先パス。
 */
export const recipeExternalRoutes: Record<string, string> = {
  "sidebar-layout": "/patterns/recipes/sidebar-layout",
};
`;export{e as default};