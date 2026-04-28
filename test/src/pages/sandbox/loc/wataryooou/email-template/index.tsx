import { LfCopy, LfMail, LfPen, LfPlusLarge, LfTrash } from "@legalforce/aegis-icons";
import { Box, MagnifyingGlass } from "@legalforce/aegis-illustrations/react";
import {
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
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
  Tag,
  Text,
  Textarea,
  TextField,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { type ChangeEvent, useMemo, useState } from "react";
import {
  categoryColors,
  categoryLabels,
  type EmailTemplate,
  type EmailTemplateCategory,
  mockTemplates,
} from "./mock/data";

const categoryOptions = (Object.keys(categoryLabels) as EmailTemplateCategory[]).map((key) => ({
  value: key,
  label: categoryLabels[key],
}));

const emptyForm: Omit<EmailTemplate, "id" | "updatedAt" | "createdBy"> = {
  title: "",
  category: "contract",
  subject: "",
  body: "",
};

const columns: DataTableColumnDef<EmailTemplate, string>[] = [
  {
    id: "title",
    name: "テンプレート名",
    getValue: (row): string => row.title,
    renderCell: ({ value }) => (
      <DataTableCell
        leading={
          <Icon>
            <LfMail />
          </Icon>
        }
      >
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "category",
    name: "カテゴリ",
    getValue: (row): string => categoryLabels[row.category],
    renderCell: ({ row }) => (
      <DataTableCell>
        <Tag color={categoryColors[row.category]} variant="outline">
          {categoryLabels[row.category]}
        </Tag>
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "subject",
    name: "件名",
    getValue: (row): string => row.subject,
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
    id: "createdBy",
    name: "作成者",
    getValue: (row): string => row.createdBy,
    sortable: true,
  },
  {
    id: "updatedAt",
    name: "更新日",
    getValue: (row): string => row.updatedAt,
    sortable: true,
  },
];

export function EmailTemplatePage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    return templates
      .filter((t) => {
        if (!normalizedSearch) return true;
        return (
          t.title.toLowerCase().includes(normalizedSearch) ||
          t.subject.toLowerCase().includes(normalizedSearch) ||
          t.createdBy.toLowerCase().includes(normalizedSearch)
        );
      })
      .filter((t) => {
        if (!categoryFilter) return true;
        return t.category === categoryFilter;
      });
  }, [templates, searchValue, categoryFilter]);

  const pagedTemplates = filteredTemplates.slice((page - 1) * pageSize, page * pageSize);

  const isFiltering = searchValue.trim() !== "" || categoryFilter !== "";

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

  const openCreateDialog = () => {
    setEditingTemplate(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setForm({
      title: template.title,
      category: template.category,
      subject: template.subject,
      body: template.body,
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (template: EmailTemplate) => {
    setDeletingTemplate(template);
    setDeleteDialogOpen(true);
  };

  const openPreviewDialog = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setPreviewDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.subject.trim()) return;

    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? {
                ...t,
                title: form.title,
                category: form.category as EmailTemplateCategory,
                subject: form.subject,
                body: form.body,
                updatedAt: new Date().toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }),
              }
            : t,
        ),
      );
    } else {
      const newId = `TPL-${String(templates.length + 1).padStart(3, "0")}`;
      setTemplates((prev) => [
        {
          id: newId,
          title: form.title,
          category: form.category as EmailTemplateCategory,
          subject: form.subject,
          body: form.body,
          updatedAt: new Date().toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          createdBy: "自分",
        },
        ...prev,
      ]);
    }
    setDialogOpen(false);
    setPage(1);
  };

  const handleDelete = () => {
    if (!deletingTemplate) return;
    setTemplates((prev) => prev.filter((t) => t.id !== deletingTemplate.id));
    setDeleteDialogOpen(false);
    setDeletingTemplate(null);
    setPage(1);
  };

  const handleDuplicate = (template: EmailTemplate) => {
    const newId = `TPL-${String(templates.length + 1).padStart(3, "0")}`;
    setTemplates((prev) => [
      {
        ...template,
        id: newId,
        title: `${template.title}（コピー）`,
        updatedAt: new Date().toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        createdBy: "自分",
      },
      ...prev,
    ]);
    setPage(1);
  };

  const actionColumn: DataTableColumnDef<EmailTemplate, string> = {
    id: "actions",
    name: null,
    width: "fit",
    renderCell: ({ row }) => (
      <DataTableCell>
        <ButtonGroup>
          <Tooltip title="プレビュー">
            <Button
              size="small"
              variant="plain"
              leading={
                <Icon size="small">
                  <LfMail />
                </Icon>
              }
              onClick={() => openPreviewDialog(row)}
            />
          </Tooltip>
          <Tooltip title="編集">
            <Button
              size="small"
              variant="plain"
              leading={
                <Icon size="small">
                  <LfPen />
                </Icon>
              }
              onClick={() => openEditDialog(row)}
            />
          </Tooltip>
          <Tooltip title="複製">
            <Button
              size="small"
              variant="plain"
              leading={
                <Icon size="small">
                  <LfCopy />
                </Icon>
              }
              onClick={() => handleDuplicate(row)}
            />
          </Tooltip>
          <Tooltip title="削除">
            <Button
              size="small"
              variant="plain"
              color="danger"
              leading={
                <Icon size="small">
                  <LfTrash />
                </Icon>
              }
              onClick={() => openDeleteDialog(row)}
            />
          </Tooltip>
        </ButtonGroup>
      </DataTableCell>
    ),
    sortable: false,
    pinnable: false,
    hideable: false,
    resizable: false,
    reorderable: false,
  };

  const allColumns = [...columns, actionColumn];

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
                onClick={openCreateDialog}
              >
                新規作成
              </Button>
            }
          >
            <ContentHeaderTitle>メールテンプレート</ContentHeaderTitle>
            <ContentHeaderDescription>
              メール送信時に使用するテンプレートを管理します。テンプレートを活用して、メール作成の効率化を図りましょう。
            </ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>

        <PageLayoutBody>
          <PageLayoutStickyContainer>
            <Toolbar>
              <Select
                options={[{ value: "", label: "すべてのカテゴリ" }, ...categoryOptions]}
                value={categoryFilter}
                onChange={(value) => {
                  setCategoryFilter(value);
                  setPage(1);
                }}
                placeholder="カテゴリで絞り込み"
                style={{ minWidth: "var(--aegis-layout-width-x6Small)" }}
              />
              <ToolbarSpacer />
              <Search
                placeholder="テンプレート名・件名・作成者で検索"
                shrinkOnBlur
                value={searchValue}
                onChange={handleSearchChange}
              />
            </Toolbar>
          </PageLayoutStickyContainer>

          {pagedTemplates.length > 0 ? (
            <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
              <DataTable
                columns={allColumns}
                rows={pagedTemplates}
                getRowId={(row) => row.id}
                stickyHeader
                defaultSorting={[{ id: "updatedAt", desc: true }]}
              />
              <Pagination
                page={page}
                pageSize={pageSize}
                totalCount={filteredTemplates.length}
                onChange={handlePagination}
              />
            </div>
          ) : (
            <EmptyState
              title={isFiltering ? "条件に一致するテンプレートがありません" : "テンプレートがありません"}
              visual={isFiltering ? <MagnifyingGlass /> : <Box />}
            >
              <Text>
                {isFiltering
                  ? "検索条件を変更して、もう一度お試しください。"
                  : "「新規作成」ボタンからテンプレートを追加してください。"}
              </Text>
            </EmptyState>
          )}
        </PageLayoutBody>
      </PageLayoutContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent style={{ width: "var(--aegis-layout-width-large)" }}>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>
                {editingTemplate ? "テンプレートを編集" : "テンプレートを新規作成"}
              </ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
              <FormControl required>
                <FormControl.Label>テンプレート名</FormControl.Label>
                <TextField
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="例：契約書レビュー完了通知"
                />
              </FormControl>
              <FormControl required>
                <FormControl.Label>カテゴリ</FormControl.Label>
                <Select
                  options={categoryOptions}
                  value={form.category}
                  onChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                />
              </FormControl>
              <FormControl required>
                <FormControl.Label>件名</FormControl.Label>
                <TextField
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="例：【法務部】契約書レビュー完了のご連絡"
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>本文</FormControl.Label>
                <Textarea
                  value={form.body}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setForm((prev) => ({ ...prev, body: e.target.value }))
                  }
                  placeholder="テンプレート本文を入力してください。&#10;変数は {{変数名}} の形式で記述できます。"
                  minRows={12}
                />
              </FormControl>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setDialogOpen(false)}>
                キャンセル
              </Button>
              <Button variant="solid" onClick={handleSave} disabled={!form.title.trim() || !form.subject.trim()}>
                {editingTemplate ? "保存" : "作成"}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>テンプレートを削除</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <Text whiteSpace="pre-line">以下のテンプレートを削除します。{"\n"}この操作は元に戻せません。</Text>
            {deletingTemplate && (
              <div
                style={{
                  marginTop: "var(--aegis-space-medium)",
                  padding: "var(--aegis-space-medium)",
                  backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                  borderRadius: "var(--aegis-radius-medium)",
                }}
              >
                <Text variant="body.medium.bold">{deletingTemplate.title}</Text>
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setDeleteDialogOpen(false)}>
                キャンセル
              </Button>
              <Button color="danger" onClick={handleDelete}>
                削除
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent style={{ width: "var(--aegis-layout-width-large)" }}>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>テンプレートプレビュー</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            {previewTemplate && (
              <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
                <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                  <Text variant="body.small" color="subtle">
                    テンプレート名
                  </Text>
                  <Text variant="body.medium.bold">{previewTemplate.title}</Text>
                </div>
                <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                  <Text variant="body.small" color="subtle">
                    カテゴリ
                  </Text>
                  <div>
                    <Tag color={categoryColors[previewTemplate.category]} variant="outline">
                      {categoryLabels[previewTemplate.category]}
                    </Tag>
                  </div>
                </div>
                <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                  <Text variant="body.small" color="subtle">
                    件名
                  </Text>
                  <Text variant="body.medium">{previewTemplate.subject}</Text>
                </div>
                <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                  <Text variant="body.small" color="subtle">
                    本文
                  </Text>
                  <div
                    style={{
                      padding: "var(--aegis-space-medium)",
                      backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                      borderRadius: "var(--aegis-radius-medium)",
                    }}
                  >
                    <Text variant="body.medium" whiteSpace="pre-wrap">
                      {previewTemplate.body}
                    </Text>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--aegis-space-large)",
                  }}
                >
                  <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                    <Text variant="body.small" color="subtle">
                      作成者
                    </Text>
                    <Text variant="body.medium">{previewTemplate.createdBy}</Text>
                  </div>
                  <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                    <Text variant="body.small" color="subtle">
                      更新日
                    </Text>
                    <Text variant="body.medium">{previewTemplate.updatedAt}</Text>
                  </div>
                </div>
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setPreviewDialogOpen(false)}>
                閉じる
              </Button>
              {previewTemplate && (
                <Button
                  variant="subtle"
                  leading={
                    <Icon size="small">
                      <LfPen />
                    </Icon>
                  }
                  onClick={() => {
                    setPreviewDialogOpen(false);
                    openEditDialog(previewTemplate);
                  }}
                >
                  編集
                </Button>
              )}
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
