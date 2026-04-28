import { LfArrowUpRightFromSquare } from "@legalforce/aegis-icons";
import {
  ContentHeader,
  ContentHeaderTitle,
  Divider,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Search,
  Tab,
  Text,
  Toolbar,
  Tooltip,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  type Category,
  type Commentary,
  categories,
  commentaries,
  type Template,
  templates,
  type UsageScene as UsageSceneType,
  usageScenes,
} from "./mock/data";

// カテゴリをファミリーごとにグループ化
const groupedCategories = {
  契約書: categories.filter((cat) => cat.family === "契約書"),
  社内規程: categories.filter((cat) => cat.family === "社内規程"),
  その他: categories.filter((cat) => cat.family === "その他"),
};

// InternalLinkCard Component
interface InternalLinkCardProps {
  categoryName: string;
  count: number;
  onClick?: () => void;
}

const InternalLinkCard = ({ categoryName, count, onClick }: InternalLinkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getBackgroundColor = () => {
    if (isPressed) {
      return "var(--aegis-color-background-neutral-xSubtle-pressed)";
    }
    if (isHovered) {
      return "var(--aegis-color-background-neutral-xSubtle-hovered)";
    }
    return "var(--aegis-color-background-neutral-xSubtle)";
  };

  return (
    <div>
      <Link
        underline={false}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--aegis-size-large)",
          color: "var(--aegis-color-foreground-default)",
          textDecoration: "none",
          background: getBackgroundColor(),
        }}
      >
        <Tooltip onlyOnOverflow title={categoryName} placement="bottom-start">
          <Text numberOfLines={1} variant="body.medium.bold">
            {categoryName}
          </Text>
        </Tooltip>
        <Text color="disabled.inverse">{count}</Text>
      </Link>
    </div>
  );
};

// ExternalLinkCard Component
interface ExternalLinkCardProps {
  text: string;
  href: string;
  onClick?: () => void;
}

const ExternalLinkCard = ({ text, href, onClick }: ExternalLinkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getBackgroundColor = () => {
    if (isPressed) {
      return "var(--aegis-color-background-neutral-xSubtle-pressed)";
    }
    if (isHovered) {
      return "var(--aegis-color-background-neutral-xSubtle-hovered)";
    }
    return "var(--aegis-color-background-neutral-xSubtle)";
  };

  return (
    <div>
      <Link
        href={href}
        color="default"
        trailing={LfArrowUpRightFromSquare}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--aegis-size-large)",
          color: "var(--aegis-color-foreground-default)",
          textDecoration: "none",
          background: getBackgroundColor(),
        }}
      >
        <Tooltip onlyOnOverflow title={text} placement="bottom-start">
          <Text numberOfLines={1} variant="body.medium.bold">
            {text}
          </Text>
        </Tooltip>
      </Link>
    </div>
  );
};

/**
 * テンプレート検索結果コンポーネント。
 *
 * loc-app では FilteredCategoryList 内で検索クエリがある場合に表示。
 * Cmd/Ctrl+Click で新しいタブで開く機能を持つ。
 */
const TemplateSearchResults = ({ matchedTemplates }: { matchedTemplates: Template[] }) => {
  const navigate = useNavigate();

  if (matchedTemplates.length === 0) {
    return (
      <Text variant="body.medium" color="subtle">
        該当するテンプレートが見つかりませんでした
      </Text>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
      {matchedTemplates.map((template) => (
        <div
          key={template.id}
          style={{
            padding: "var(--aegis-space-xSmall) var(--aegis-space-medium)",
            borderRadius: "var(--aegis-radius-medium)",
          }}
        >
          <Link underline={false} onClick={() => navigate(`/template/legalon-template/${template.id}`)}>
            <Tooltip onlyOnOverflow title={template.title} placement="bottom-start">
              <Text numberOfLines={1} variant="body.medium">
                {template.title}
              </Text>
            </Tooltip>
          </Link>
        </div>
      ))}
    </div>
  );
};

/**
 * フィルタ適用済みカテゴリ一覧。
 *
 * loc-app の FilteredCategoryList パターン:
 * - filterQuery が空 → カテゴリ一覧を表示
 * - filterQuery がある → テンプレート検索結果を表示（useSearchTemplates）
 */
const FilteredCategoryList = ({ categoriesList, filterQuery }: { categoriesList: Category[]; filterQuery: string }) => {
  const navigate = useNavigate();

  // loc-app では useSearchTemplates フックで API 検索。テンプレートではクライアントサイドでフィルタ。
  const matchedTemplates = useMemo(() => {
    if (filterQuery.trim().length === 0) return [];
    return templates.filter((t) => t.title.toLowerCase().includes(filterQuery.toLowerCase()));
  }, [filterQuery]);

  if (filterQuery.trim().length > 0) {
    return <TemplateSearchResults matchedTemplates={matchedTemplates} />;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "var(--aegis-size-xSmall)",
      }}
    >
      {categoriesList.map((category) => (
        <InternalLinkCard
          key={category.id}
          categoryName={category.name}
          count={category.count}
          onClick={() => navigate("/template/legalon-template")}
        />
      ))}
    </div>
  );
};

/**
 * 利用シーンタブコンテンツ。
 *
 * loc-app では filterQuery がある場合にテンプレート検索結果を表示する分岐を持つ。
 */
const UsageSceneContent = ({ scenes, filterQuery }: { scenes: UsageSceneType[]; filterQuery: string }) => {
  // loc-app では useSearchTemplates で API 検索。テンプレートではクライアントサイドフィルタ。
  const matchedTemplates = useMemo(() => {
    if (filterQuery.trim().length === 0) return [];
    return templates.filter((t) => t.title.toLowerCase().includes(filterQuery.toLowerCase()));
  }, [filterQuery]);

  if (filterQuery.trim().length > 0) {
    return <TemplateSearchResults matchedTemplates={matchedTemplates} />;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "var(--aegis-size-xSmall)",
      }}
    >
      {scenes.map((scene) => (
        <ExternalLinkCard key={scene.id} text={scene.title} href={scene.url} />
      ))}
    </div>
  );
};

// CommentaryList Component
interface CommentaryListProps {
  commentaries: Commentary[];
}

const CommentaryList = ({ commentaries }: CommentaryListProps) => {
  // セクションごとにグループ化
  const groupedCommentaries = commentaries.reduce(
    (acc, commentary) => {
      if (!acc[commentary.section]) {
        acc[commentary.section] = [];
      }
      acc[commentary.section].push(commentary);
      return acc;
    },
    {} as Record<string, Commentary[]>,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xLarge)" }}>
      {Object.entries(groupedCommentaries).map(([section, items]) => (
        <div key={section} style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
          <Text variant="title.xxSmall">{section}</Text>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
            {items.map((commentary) => (
              <Link key={commentary.id} href={commentary.url} trailing={<LfArrowUpRightFromSquare />}>
                {commentary.title}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Component
export const LegalonTemplateCategory = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [filterQuery, setFilterQuery] = useState("");

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader size="xLarge">
            <ContentHeaderTitle>LegalOnひな形</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-medium)",
            }}
          >
            <Tab.Group index={selectedTabIndex} variant="plain" size="large">
              {/* loc-app: SearchableCategoryList パターン — タブリスト横に検索バーを配置 */}
              <Toolbar>
                <Tab.List>
                  <Tab onClick={() => setSelectedTabIndex(0)}>利用シーン</Tab>
                  <Tab onClick={() => setSelectedTabIndex(1)}>契約書</Tab>
                  <Tab onClick={() => setSelectedTabIndex(2)}>社内規程</Tab>
                  <Tab onClick={() => setSelectedTabIndex(3)}>その他</Tab>
                  <Tab onClick={() => setSelectedTabIndex(4)}>解説記事</Tab>
                </Tab.List>
                <Toolbar.Spacer />
                <Search
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="検索"
                  shrinkOnBlur
                />
              </Toolbar>

              <Tab.Panels>
                <Tab.Panel>
                  {selectedTabIndex === 0 && <UsageSceneContent scenes={usageScenes} filterQuery={filterQuery} />}
                </Tab.Panel>

                <Tab.Panel>
                  {selectedTabIndex === 1 && (
                    <FilteredCategoryList categoriesList={groupedCategories.契約書} filterQuery={filterQuery} />
                  )}
                </Tab.Panel>

                <Tab.Panel>
                  {selectedTabIndex === 2 && (
                    <FilteredCategoryList categoriesList={groupedCategories.社内規程} filterQuery={filterQuery} />
                  )}
                </Tab.Panel>

                <Tab.Panel>
                  {selectedTabIndex === 3 && (
                    <FilteredCategoryList categoriesList={groupedCategories.その他} filterQuery={filterQuery} />
                  )}
                </Tab.Panel>

                <Tab.Panel>{selectedTabIndex === 4 && <CommentaryList commentaries={commentaries} />}</Tab.Panel>
              </Tab.Panels>
            </Tab.Group>

            <Divider />
            <Text variant="caption.xSmall" color="subtle">
              LegalOnひな形は、法務業務を効率化するためのテンプレート集です。
            </Text>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
