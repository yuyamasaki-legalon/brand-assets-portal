import { Badge, Card, Checkbox, Search, Text } from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import type { Category } from "../mock/data";

type LayoutType = "two-column" | "sidebar" | "compact" | "vertical";

type Props = {
  categories: Category[];
  layout: LayoutType;
};

export const SearchablePattern = ({ categories, layout }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(query));
  }, [categories, searchQuery]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
    setActiveCategory(categoryId);
  };

  const selectedCategory = categories.find((c) => c.id === activeCategory);

  const renderCategoryList = () => (
    <Card
      style={{
        padding: "var(--aegis-space-medium)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-small)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text variant="title.xxSmall">大カテゴリー</Text>
        <Badge color="subtle" count={selectedCategories.length} />
      </div>
      <Search placeholder="カテゴリーを検索" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-xSmall)",
        }}
      >
        {filteredCategories.map((category) => (
          <Card
            key={category.id}
            style={{
              padding: "var(--aegis-space-small)",
              cursor: "pointer",
              backgroundColor:
                activeCategory === category.id ? "var(--aegis-color-background-information-xSubtle)" : undefined,
            }}
            onClick={() => handleCategoryToggle(category.id)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--aegis-space-small)",
              }}
            >
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
              />
              <Text variant="body.medium">{category.name}</Text>
              <Text variant="body.small" color="subtle" style={{ marginLeft: "auto" }}>
                {category.count}件
              </Text>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );

  const renderSubcategoryArea = () => (
    <Card
      style={{
        padding: "var(--aegis-space-medium)",
        minHeight: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {selectedCategory ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-small)",
          }}
        >
          <Text variant="title.xxSmall">{selectedCategory.name}のサブカテゴリー</Text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-xSmall)",
            }}
          >
            {selectedCategory.subcategories.map((sub) => (
              <Card key={sub.id} style={{ padding: "var(--aegis-space-small)" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  <Checkbox />
                  <Text variant="body.medium">{sub.name}</Text>
                  <Text variant="body.small" color="subtle" style={{ marginLeft: "auto" }}>
                    {sub.count}件
                  </Text>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Text color="subtle">左側から大カテゴリーを選択してください</Text>
      )}
    </Card>
  );

  if (layout === "two-column") {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--aegis-space-medium)",
        }}
      >
        {renderCategoryList()}
        {renderSubcategoryArea()}
      </div>
    );
  }

  if (layout === "sidebar") {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "var(--aegis-layout-width-x4Small) 1fr",
          gap: "var(--aegis-space-medium)",
        }}
      >
        <div style={{ position: "sticky", top: 0 }}>{renderCategoryList()}</div>
        {renderSubcategoryArea()}
      </div>
    );
  }

  if (layout === "compact") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-medium)",
          maxWidth: "var(--aegis-layout-width-medium)",
        }}
      >
        <Card style={{ padding: "var(--aegis-space-medium)" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-small)",
            }}
          >
            <Text variant="title.xxSmall">カテゴリー選択</Text>
            <Search
              placeholder="カテゴリーを検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--aegis-space-xSmall)",
              }}
            >
              {filteredCategories.map((category) => (
                <Card
                  key={category.id}
                  style={{
                    padding: "var(--aegis-space-xSmall) var(--aegis-space-small)",
                    cursor: "pointer",
                    backgroundColor: selectedCategories.includes(category.id)
                      ? "var(--aegis-color-background-information-xSubtle)"
                      : undefined,
                  }}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xxSmall)" }}>
                    <Checkbox
                      size="small"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                    />
                    <Text variant="body.small">{category.name}</Text>
                    <Badge color="subtle" count={category.count} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
        {renderSubcategoryArea()}
      </div>
    );
  }

  // vertical layout
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-medium)",
      }}
    >
      {renderCategoryList()}
      {renderSubcategoryArea()}
    </div>
  );
};
