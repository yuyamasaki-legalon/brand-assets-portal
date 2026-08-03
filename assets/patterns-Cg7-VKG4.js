var e=`import { LfArrowUpRightFromSquare } from "@legalforce/aegis-icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  Dialog,
  Drawer,
  DrawerBody,
  DrawerHeader,
  EmptyState,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Search,
  SegmentedControl,
  Skeleton,
  Tab,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { MarkdownRenderer } from "../markdown-viewer/components/MarkdownRenderer";
import {
  type AntiPatternDemo,
  antiPatternDemos,
  DialogStageContext,
  type DialogStageHandle,
} from "./anti-patterns/demos";
import { usePatterns } from "./hooks/usePatterns";
import styles from "./index.module.css";
import { recipeDemos, recipeExternalRoutes } from "./recipes/demos";
import type { AntiPatternCategory, AntiPatternMeta, AntiPatternSeverity, RecipeMeta } from "./types";

type SeverityFilter = "All" | AntiPatternSeverity;
type CategoryFilter = "All" | AntiPatternCategory;

const severityOptions: SeverityFilter[] = ["All", "error", "warning", "info"];
const categoryOptions: CategoryFilter[] = ["All", "accessibility", "composition", "styling", "usage"];

const severityColor: Record<AntiPatternSeverity, "red" | "orange" | "blue"> = {
  error: "red",
  warning: "orange",
  info: "blue",
};

const severityLabel: Record<AntiPatternSeverity, string> = {
  error: "エラー",
  warning: "警告",
  info: "情報",
};

const categoryColor: Record<AntiPatternCategory, "purple" | "blue" | "teal" | "orange"> = {
  accessibility: "purple",
  composition: "blue",
  styling: "teal",
  usage: "orange",
};

const categoryLabel: Record<AntiPatternCategory, string> = {
  accessibility: "アクセシビリティ",
  composition: "構成",
  styling: "スタイリング",
  usage: "使い方",
};

type DetailEntry = { type: "anti"; data: AntiPatternMeta } | { type: "recipe"; data: RecipeMeta };

export const PatternsPage = () => {
  const { antiPatterns, recipes, isLoading } = usePatterns();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabIndex = searchParams.get("tab") === "recipes" ? 1 : 0;
  const handleTabChange = (index: number) => {
    const next = new URLSearchParams(searchParams);
    if (index === 1) next.set("tab", "recipes");
    else next.delete("tab");
    next.delete("id");
    setSearchParams(next, { replace: true });
  };

  const [severity, setSeverity] = useState<SeverityFilter>("All");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [query, setQuery] = useState("");
  const [detailView, setDetailView] = useState<"preview" | "code">("preview");

  const selectedId = searchParams.get("id");
  const detail = useMemo<DetailEntry | null>(() => {
    if (!selectedId) return null;
    const ap = antiPatterns.find((entry) => entry.id === selectedId);
    if (ap) return { type: "anti", data: ap };
    const recipe = recipes.find((entry) => entry.slug === selectedId);
    if (recipe) return { type: "recipe", data: recipe };
    return null;
  }, [antiPatterns, recipes, selectedId]);

  const openDetail = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("id", id);
    setSearchParams(next, { replace: true });
  };

  const closeDetail = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("id");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  // ルートレベルで mount される Dialog のスロット。Drawer の中で Dialog を直接
  // 開くと base-ui が nested と判定して backdrop を抑制するため、Dialog 系
  // アンチパターンのプレビューは context 経由でここに content を渡す。
  const [stagedDialog, setStagedDialog] = useState<ReactNode | null>(null);
  const dialogStage = useMemo<DialogStageHandle>(
    () => ({
      show: (content) => setStagedDialog(content),
      hide: () => setStagedDialog(null),
      closeDrawer: () => closeDetail(),
    }),
    [closeDetail],
  );

  const filteredAntiPatterns = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return antiPatterns.filter((entry) => {
      if (severity !== "All" && entry.severity !== severity) return false;
      if (category !== "All" && entry.category !== category) return false;
      if (needle === "") return true;
      return (
        entry.id.toLowerCase().includes(needle) ||
        entry.title.toLowerCase().includes(needle) ||
        entry.component.toLowerCase().includes(needle)
      );
    });
  }, [antiPatterns, severity, category, query]);

  const filteredRecipes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === "") return recipes;
    return recipes.filter(
      (entry) =>
        entry.title.toLowerCase().includes(needle) ||
        entry.description.toLowerCase().includes(needle) ||
        entry.components.some((component) => component.toLowerCase().includes(needle)),
    );
  }, [recipes, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, AntiPatternMeta[]>();
    for (const entry of filteredAntiPatterns) {
      const list = map.get(entry.component) ?? [];
      list.push(entry);
      map.set(entry.component, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredAntiPatterns]);

  return (
    <DialogStageContext.Provider value={dialogStage}>
      <PageLayout>
        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeader.Title>Patterns</ContentHeader.Title>
              <ContentHeader.Description>
                Aegis のアンチパターンとレシピをまとめて確認できるカタログです。
              </ContentHeader.Description>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <Tab.Group index={tabIndex} onChange={handleTabChange}>
              <Tab.List bordered style={{ width: "fit-content" }}>
                <Tab
                  aria-label="Anti-patterns"
                  trailing={
                    <Tag size="small" color="neutral" variant="outline">
                      {antiPatterns.length}
                    </Tag>
                  }
                >
                  Anti-patterns
                </Tab>
                <Tab
                  aria-label="Recipes"
                  trailing={
                    <Tag size="small" color="neutral" variant="outline">
                      {recipes.length}
                    </Tag>
                  }
                >
                  Recipes
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-medium)",
                      marginTop: "var(--aegis-space-medium)",
                    }}
                  >
                    <Search
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onClear={() => setQuery("")}
                      clearable
                      placeholder="ID・タイトル・コンポーネント名で絞り込む"
                      size="small"
                      style={{ maxWidth: "var(--aegis-layout-width-xSmall)" }}
                    />
                    <FilterGroup
                      label="Severity"
                      options={severityOptions}
                      value={severity}
                      onChange={setSeverity}
                      renderLabel={(option) => (option === "All" ? "All" : severityLabel[option])}
                    />
                    <FilterGroup
                      label="Category"
                      options={categoryOptions}
                      value={category}
                      onChange={setCategory}
                      renderLabel={(option) => (option === "All" ? "All" : categoryLabel[option])}
                    />
                  </div>

                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    {isLoading ? (
                      <SkeletonList />
                    ) : grouped.length === 0 ? (
                      <EmptyState size="medium" title="該当するアンチパターンが見つかりません">
                        フィルター条件や検索キーワードを見直してください。
                      </EmptyState>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xLarge)" }}>
                        {grouped.map(([component, entries]) => (
                          <section key={component}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--aegis-space-xSmall)",
                                marginBottom: "var(--aegis-space-small)",
                              }}
                            >
                              <Text as="h2" variant="title.xSmall">
                                {component}
                              </Text>
                              <Tag size="small" color="neutral" variant="outline">
                                {entries.length}
                              </Tag>
                            </div>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fill, minmax(var(--aegis-layout-width-x3Small), 1fr))",
                                gap: "var(--aegis-space-medium)",
                              }}
                            >
                              {entries.map((entry) => (
                                <AntiPatternCard key={entry.id} entry={entry} onSelect={() => openDetail(entry.id)} />
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    )}
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-medium)",
                      marginTop: "var(--aegis-space-medium)",
                    }}
                  >
                    <Search
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onClear={() => setQuery("")}
                      clearable
                      placeholder="タイトル・キーワードで絞り込む"
                      size="small"
                      style={{ maxWidth: "var(--aegis-layout-width-xSmall)" }}
                    />
                  </div>

                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    {isLoading ? (
                      <SkeletonList />
                    ) : filteredRecipes.length === 0 ? (
                      <EmptyState size="medium" title="該当するレシピが見つかりません">
                        キーワードを変更して再度お試しください。
                      </EmptyState>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x4Small), 1fr))",
                          gap: "var(--aegis-space-medium)",
                        }}
                      >
                        {filteredRecipes.map((recipe) => (
                          <RecipeCard key={recipe.slug} recipe={recipe} onSelect={() => openDetail(recipe.slug)} />
                        ))}
                      </div>
                    )}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </PageLayoutBody>
        </PageLayoutContent>

        <Drawer
          open={detail !== null}
          onOpenChange={(open) => !open && closeDetail()}
          position="end"
          width="xLarge"
          resizable
          minWidth="large"
          maxWidth="xLarge"
        >
          {detail && (
            <>
              <DrawerHeader>
                <ContentHeader>
                  <ContentHeader.Title>{detail.data.title}</ContentHeader.Title>
                  {detail.type === "anti" && <ContentHeader.Description>{detail.data.id}</ContentHeader.Description>}
                </ContentHeader>
                {detail.type === "anti" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--aegis-space-xxSmall)",
                      flexWrap: "wrap",
                      marginTop: "var(--aegis-space-xSmall)",
                    }}
                  >
                    <Tag size="small" color={severityColor[detail.data.severity]} variant="fill">
                      {severityLabel[detail.data.severity]}
                    </Tag>
                    <Tag size="small" color={categoryColor[detail.data.category]} variant="outline">
                      {categoryLabel[detail.data.category]}
                    </Tag>
                    <Tag size="small" color="neutral" variant="outline">
                      {detail.data.component}
                    </Tag>
                    {detail.data.wcag && (
                      <Tag size="small" color="purple" variant="outline">
                        WCAG {detail.data.wcag}
                      </Tag>
                    )}
                  </div>
                )}
                {detail.type === "recipe" && recipeDemos[detail.data.slug] && (
                  <div style={{ marginTop: "var(--aegis-space-small)" }}>
                    <SegmentedControl
                      size="small"
                      index={detailView === "preview" ? 0 : 1}
                      onChange={(index) => setDetailView(index === 0 ? "preview" : "code")}
                    >
                      <SegmentedControl.Button>プレビュー</SegmentedControl.Button>
                      <SegmentedControl.Button>コード</SegmentedControl.Button>
                    </SegmentedControl>
                  </div>
                )}
                {detail.type === "anti" && antiPatternDemos[detail.data.id] && (
                  <div style={{ marginTop: "var(--aegis-space-small)" }}>
                    <SegmentedControl
                      size="small"
                      index={detailView === "preview" ? 0 : 1}
                      onChange={(index) => setDetailView(index === 0 ? "preview" : "code")}
                    >
                      <SegmentedControl.Button>Bad / Good 比較</SegmentedControl.Button>
                      <SegmentedControl.Button>コード</SegmentedControl.Button>
                    </SegmentedControl>
                  </div>
                )}
                {detail.type === "recipe" && recipeExternalRoutes[detail.data.slug] && (
                  <div style={{ marginTop: "var(--aegis-space-small)" }}>
                    <Button
                      as={RouterLink}
                      to={recipeExternalRoutes[detail.data.slug]}
                      variant="subtle"
                      size="small"
                      trailing={<LfArrowUpRightFromSquare />}
                    >
                      プレビューを別ページで開く
                    </Button>
                  </div>
                )}
              </DrawerHeader>
              <DrawerBody>
                <DetailBody detail={detail} view={detailView} />
              </DrawerBody>
            </>
          )}
        </Drawer>

        {/* Top-level Dialog stage. Dialog-type アンチパターンのプレビューは
          DialogStageContext.show(content) でここに content をセットする。
          Drawer の外側に mount されているため、base-ui の nested 判定が掛からず
          backdrop が viewport 全体を覆う。 */}
        <Dialog
          open={stagedDialog !== null}
          onOpenChange={(next) => !next && setStagedDialog(null)}
          closeOnEsc
          closeOnOutsidePress
        >
          {stagedDialog}
        </Dialog>
      </PageLayout>
    </DialogStageContext.Provider>
  );
};

/** Strip the leading H1 from a markdown body — the title is already in the Drawer header. */
const stripLeadingH1 = (body: string): string => body.replace(/^\\s*#\\s+[^\\n]*\\n+/, "");

const DrawerMarkdown = ({ content }: { content: string }) => (
  <div className={styles.drawerMarkdown}>
    <MarkdownRenderer content={content} />
  </div>
);

const DetailBody = ({ detail, view }: { detail: DetailEntry; view: "preview" | "code" }) => {
  if (detail.type === "anti") {
    const demo = antiPatternDemos[detail.data.id];
    if (!demo) {
      return <DrawerMarkdown content={stripLeadingH1(detail.data.body)} />;
    }
    if (view === "preview") {
      return <AntiPatternComparison demo={demo} />;
    }
    return <DrawerMarkdown content={stripLeadingH1(detail.data.body)} />;
  }
  const Demo = recipeDemos[detail.data.slug];
  if (!Demo) {
    return <DrawerMarkdown content={stripLeadingH1(detail.data.body)} />;
  }
  if (view === "preview") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
        <Demo />
        <Text variant="body.small" color="subtle">
          ※ プレビューは実装イメージを掴むためのデモです。ロジックは簡略化しています。
        </Text>
      </div>
    );
  }
  return <DrawerMarkdown content={stripLeadingH1(detail.data.body)} />;
};

const AntiPatternComparison = ({ demo }: { demo: AntiPatternDemo }) => {
  if (demo.kind === "custom") {
    const Render = demo.render;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
        <Render />
        <Text variant="body.small" color="subtle">
          ※ プレビューは Bad / Good の比較を視覚化するためのデモです。ロジックは簡略化しています。
        </Text>
      </div>
    );
  }
  const Bad = demo.bad;
  const Good = demo.good;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
      <ComparisonPanel kind="bad" label="Bad" description="このパターンは避ける" note={demo.badNote}>
        <Bad />
      </ComparisonPanel>
      <ComparisonPanel kind="good" label="Good" description="推奨パターン" note={demo.goodNote}>
        <Good />
      </ComparisonPanel>
      <Text variant="body.small" color="subtle">
        ※ プレビューは Bad / Good の比較を視覚化するためのデモです。ロジックは簡略化しています。
      </Text>
    </div>
  );
};

const ComparisonPanel = ({
  kind,
  label,
  description,
  note,
  children,
}: {
  kind: "bad" | "good";
  label: string;
  description: string;
  note?: string;
  children: React.ReactNode;
}) => {
  const accent =
    kind === "bad"
      ? {
          tagColor: "red" as const,
          border: "var(--aegis-color-border-danger-subtle)",
          background: "var(--aegis-color-background-danger-xSubtle)",
          symbol: "✕",
        }
      : {
          tagColor: "lime" as const,
          border: "var(--aegis-color-border-success-subtlest)",
          background: "var(--aegis-color-background-success-subtle)",
          symbol: "✓",
        };
  return (
    <section>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--aegis-space-xSmall)",
          marginBottom: "var(--aegis-space-xSmall)",
        }}
      >
        <Tag size="small" color={accent.tagColor} variant="fill">
          {accent.symbol} {label}
        </Tag>
        <Text variant="label.small" color="subtle">
          {description}
        </Text>
      </div>
      <div
        style={{
          padding: "var(--aegis-space-medium)",
          borderRadius: "var(--aegis-radius-large)",
          border: \`1px solid \${accent.border}\`,
          background: accent.background,
        }}
      >
        {children}
      </div>
      {note && (
        <Text variant="body.small" color="subtle" style={{ display: "block", marginTop: "var(--aegis-space-xSmall)" }}>
          {note}
        </Text>
      )}
    </section>
  );
};

interface FilterGroupProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  renderLabel: (option: T) => string;
}

const FilterGroup = <T extends string>({ label, options, value, onChange, renderLabel }: FilterGroupProps<T>) => {
  const index = Math.max(options.indexOf(value), 0);
  return (
    <fieldset
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--aegis-space-small)",
        flexWrap: "wrap",
        border: "none",
        margin: 0,
        padding: 0,
      }}
    >
      <legend style={{ minWidth: "var(--aegis-size-x5Large)", padding: 0 }}>
        <Text variant="label.small.bold">{label}</Text>
      </legend>
      <SegmentedControl
        size="small"
        index={index}
        onChange={(nextIndex) => {
          const nextValue = options[nextIndex];
          if (nextValue) onChange(nextValue);
        }}
      >
        {options.map((option) => (
          <SegmentedControl.Button key={option}>{renderLabel(option)}</SegmentedControl.Button>
        ))}
      </SegmentedControl>
    </fieldset>
  );
};

const AntiPatternCard = ({ entry, onSelect }: { entry: AntiPatternMeta; onSelect: () => void }) => (
  <Card
    variant="outline"
    size="small"
    onClick={onSelect}
    role="button"
    tabIndex={0}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect();
      }
    }}
    style={{ cursor: "pointer", height: "100%" }}
  >
    <CardHeader
      trailing={
        <Tag size="small" color={severityColor[entry.severity]} variant="fill">
          {severityLabel[entry.severity]}
        </Tag>
      }
    >
      <Text variant="label.small.bold" color="subtle">
        {entry.id}
      </Text>
    </CardHeader>
    <CardBody>
      <Text variant="body.small" style={{ display: "block" }}>
        {entry.title}
      </Text>
      <div
        style={{
          display: "flex",
          gap: "var(--aegis-space-xxSmall)",
          flexWrap: "wrap",
          marginTop: "var(--aegis-space-xSmall)",
        }}
      >
        <Tag size="small" color={categoryColor[entry.category]} variant="outline">
          {categoryLabel[entry.category]}
        </Tag>
        {entry.eslintRule && (
          <Tag size="small" color="teal" variant="outline">
            ESLint
          </Tag>
        )}
        {entry.wcag && (
          <Tag size="small" color="purple" variant="outline">
            WCAG {entry.wcag}
          </Tag>
        )}
        {antiPatternDemos[entry.id] && (
          <Tag size="small" color="blue" variant="fill">
            プレビュー
          </Tag>
        )}
      </div>
    </CardBody>
  </Card>
);

const RecipeCard = ({ recipe, onSelect }: { recipe: RecipeMeta; onSelect: () => void }) => (
  <Card
    variant="outline"
    size="medium"
    onClick={onSelect}
    role="button"
    tabIndex={0}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect();
      }
    }}
    style={{ cursor: "pointer", height: "100%" }}
  >
    <CardHeader>
      <Text variant="title.xSmall">{recipe.title}</Text>
    </CardHeader>
    <CardBody>
      <Text variant="body.small" color="subtle" style={{ display: "block" }}>
        {recipe.description}
      </Text>
      {recipe.components.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "var(--aegis-space-xxSmall)",
            flexWrap: "wrap",
            marginTop: "var(--aegis-space-small)",
          }}
        >
          {recipe.components.slice(0, 4).map((component) => (
            <Tag key={component} size="small" color="blue" variant="outline">
              {component}
            </Tag>
          ))}
          {recipe.components.length > 4 && (
            <Tag size="small" color="neutral" variant="outline">
              +{recipe.components.length - 4}
            </Tag>
          )}
        </div>
      )}
    </CardBody>
  </Card>
);

const SkeletonList = () => (
  <output
    aria-busy="true"
    aria-live="polite"
    style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}
  >
    <Skeleton width="40%" height={20} />
    <Skeleton width="100%" height={120} />
    <Skeleton width="100%" height={120} />
  </output>
);
`;export{e as default};