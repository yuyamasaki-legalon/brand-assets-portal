import {
  LfMagnifyingGlass,
  LfPen,
  LfPlusLarge,
  LfQuestionCircle,
  LfStar,
  LfStarFill,
  LfTrash,
} from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FormControl,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Switch,
  Text,
  Textarea,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import type { CSSProperties, FC, FormEvent } from "react";
import { useId, useState } from "react";
import { LocSidebarLayout } from "../../_shared";
import { mockPromptItems, type PromptItem } from "./mock/data";

// =============================================================================
// Styles
// =============================================================================

const styles: Record<string, CSSProperties> = {
  pageRoot: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  searchBar: {
    display: "flex",
    gap: "var(--aegis-space-medium)",
    alignItems: "center",
  },
  searchField: {
    flex: 1,
  },
  favoritesToggle: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xSmall)",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x3Small), 1fr))",
    gap: "var(--aegis-space-medium)",
  },
  cardContent: {
    flex: 1,
  },
  cardFooterInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    inlineSize: "100%",
  },
  cardActions: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xxSmall)",
  },
  formFields: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  labelRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xxSmall)",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xxSmall)",
  },
};

// =============================================================================
// Sub-components
// =============================================================================

const SearchFilterBar: FC<{
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: (checked: boolean) => void;
}> = ({ searchQuery, onSearchChange, showFavoritesOnly, onFavoritesToggle }) => (
  <div style={styles.searchBar}>
    <div style={styles.searchField}>
      <TextField
        type="search"
        leading={LfMagnifyingGlass}
        placeholder="タイトルで検索"
        aria-label="タイトルで検索"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        clearable
        onClear={() => onSearchChange("")}
      />
    </div>
    <div style={styles.favoritesToggle}>
      <Switch checked={showFavoritesOnly} onChange={(e) => onFavoritesToggle(e.target.checked)} />
      <Text variant="body.medium">お気に入りのみ表示</Text>
    </div>
  </div>
);

const PromptCard: FC<{
  item: PromptItem;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: PromptItem) => void;
  onUse: (item: PromptItem) => void;
}> = ({ item, onToggleFavorite, onDelete, onEdit, onUse }) => (
  <Card variant="outline">
    <CardHeader
      trailing={
        <Tooltip title={item.isFavorite ? "お気に入りから削除" : "お気に入りに追加"}>
          <IconButton aria-label="お気に入り" onClick={() => onToggleFavorite(item.id)}>
            <Icon>{item.isFavorite ? <LfStarFill /> : <LfStar />}</Icon>
          </IconButton>
        </Tooltip>
      }
    >
      <Text variant="body.medium.bold">{item.title}</Text>
    </CardHeader>
    <CardBody>
      <Text variant="body.medium" color="subtle">
        {item.description}
      </Text>
    </CardBody>
    <CardFooter>
      <div style={styles.cardFooterInner}>
        <Text variant="body.xSmall" color="subtle">
          作成者: {item.author}
        </Text>
        <div style={styles.cardActions}>
          <Tooltip title="削除">
            <IconButton aria-label="削除" variant="plain" size="small" onClick={() => onDelete(item.id)}>
              <Icon>
                <LfTrash />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="編集">
            <IconButton aria-label="編集" variant="plain" size="small" onClick={() => onEdit(item)}>
              <Icon>
                <LfPen />
              </Icon>
            </IconButton>
          </Tooltip>
          <Button variant="subtle" size="small" onClick={() => onUse(item)}>
            使う
          </Button>
        </div>
      </div>
    </CardFooter>
  </Card>
);

type PromptFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialTitle?: string;
  initialPrompt?: string;
  initialDescription?: string;
  initialIsPublic?: boolean;
  onSubmit: (data: { title: string; prompt: string; description: string; isPublic: boolean }) => void;
};

const PromptFormDialog: FC<PromptFormDialogProps> = ({
  open,
  onOpenChange,
  mode,
  initialTitle = "",
  initialPrompt = "",
  initialDescription = "",
  initialIsPublic = true,
  onSubmit,
}) => {
  const formId = useId();
  const [title, setTitle] = useState(initialTitle);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [description, setDescription] = useState(initialDescription);
  const [isPublic, setIsPublic] = useState(initialIsPublic);

  // Reset form when dialog opens with new initial values
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setTitle(initialTitle);
      setPrompt(initialPrompt);
      setDescription(initialDescription);
      setIsPublic(initialIsPublic);
    }
  }

  const isValid = title.trim().length > 0 && prompt.trim().length > 0;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ title: title.trim(), prompt: prompt.trim(), description: description.trim(), isPublic });
    onOpenChange(false);
  };

  const dialogTitle = mode === "add" ? "プロンプトを追加" : "プロンプトを編集";
  const submitLabel = mode === "add" ? "追加" : "保存";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width="medium">
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>{dialogTitle}</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <form id={formId} onSubmit={handleSubmit}>
            <div style={styles.formFields}>
              <FormControl required>
                <FormControl.Label>
                  <div style={styles.labelRow}>
                    タイトル
                    <Tooltip title="明確で検索しやすいタイトルにすると、あとでこのプロンプトを見つけやすくなります">
                      <IconButton aria-label="タイトルのヒント" size="xSmall" variant="plain">
                        <Icon size="xSmall">
                          <LfQuestionCircle />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </div>
                </FormControl.Label>
                <TextField
                  placeholder="例: 秘密保持契約の確認"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl required>
                <FormControl.Label>
                  <div style={styles.labelRow}>
                    プロンプト
                    <Tooltip title="入力欄に入るテキストです。送信前に編集できます。必要に応じて仮置きのテキスト（●●など）やメモを追加できます。">
                      <IconButton aria-label="プロンプトのヒント" size="xSmall" variant="plain">
                        <Icon size="xSmall">
                          <LfQuestionCircle />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </div>
                </FormControl.Label>
                <Textarea
                  placeholder="目的や避けるべきことを説明"
                  minRows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </FormControl>

              <div style={styles.checkboxRow}>
                <Checkbox checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                <Tooltip title="テナントの全員がこのプロンプトを利用できるようになります">
                  <IconButton aria-label="テナント利用のヒント" size="xSmall" variant="plain">
                    <Icon size="xSmall">
                      <LfQuestionCircle />
                    </Icon>
                  </IconButton>
                </Tooltip>
                <Text variant="body.medium">テナントの全員が利用可</Text>
              </div>

              <FormControl>
                <FormControl.Label>
                  <div style={styles.labelRow}>
                    説明
                    <Tooltip title="プロンプトの目的や使用シーンを自由に記入できます。プロンプト一覧のカードに表示されます。">
                      <IconButton aria-label="説明のヒント" size="xSmall" variant="plain">
                        <Icon size="xSmall">
                          <LfQuestionCircle />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </div>
                </FormControl.Label>
                <TextField
                  placeholder="メモを追加"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button type="submit" form={formId} disabled={!isValid}>
              {submitLabel}
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// =============================================================================
// Main Component
// =============================================================================

export const LoaPromptLibraryTemplate: FC = () => {
  const [items, setItems] = useState<PromptItem[]>(mockPromptItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PromptItem | null>(null);

  const filteredItems = items.filter((item) => {
    if (showFavoritesOnly && !item.isFavorite) return false;
    if (searchQuery.trim() && !item.title.includes(searchQuery.trim())) return false;
    return true;
  });

  const handleToggleFavorite = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)));
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = (data: { title: string; prompt: string; description: string; isPublic: boolean }) => {
    const newItem: PromptItem = {
      id: `${Date.now()}`,
      title: data.title,
      description: data.description,
      prompt: data.prompt,
      author: "自分",
      isFavorite: false,
      isPublic: data.isPublic,
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const handleEdit = (data: { title: string; prompt: string; description: string; isPublic: boolean }) => {
    if (!editingItem) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? { ...item, title: data.title, prompt: data.prompt, description: data.description, isPublic: data.isPublic }
          : item,
      ),
    );
    setEditingItem(null);
  };

  return (
    <LocSidebarLayout activeId="assistant">
      <PageLayout>
        <PageLayoutContent as="main" aria-label="プロンプトライブラリー">
          <PageLayoutHeader>
            <ContentHeader
              action={
                <Button leading={LfPlusLarge} onClick={() => setAddDialogOpen(true)}>
                  プロンプトを追加
                </Button>
              }
            >
              <ContentHeaderTitle as="h1">プロンプトライブラリー</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div style={styles.pageRoot}>
              <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                showFavoritesOnly={showFavoritesOnly}
                onFavoritesToggle={setShowFavoritesOnly}
              />
              <div style={styles.cardGrid}>
                {filteredItems.map((item) => (
                  <PromptCard
                    key={item.id}
                    item={item}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDelete}
                    onEdit={setEditingItem}
                    onUse={() => {}}
                  />
                ))}
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>

      <PromptFormDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} mode="add" onSubmit={handleAdd} />

      <PromptFormDialog
        open={editingItem !== null}
        onOpenChange={(open) => !open && setEditingItem(null)}
        mode="edit"
        initialTitle={editingItem?.title}
        initialPrompt={editingItem?.prompt}
        initialDescription={editingItem?.description}
        initialIsPublic={editingItem?.isPublic}
        onSubmit={handleEdit}
      />
    </LocSidebarLayout>
  );
};

export default LoaPromptLibraryTemplate;
