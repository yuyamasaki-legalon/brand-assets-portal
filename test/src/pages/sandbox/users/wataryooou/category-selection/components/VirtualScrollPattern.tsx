import { Badge, Card, Checkbox, Text } from "@legalforce/aegis-react";
import { useState } from "react";
import type { Category } from "../mock/data";

type LayoutType = "two-column" | "sidebar" | "compact" | "vertical";

type Props = {
  categories: Category[];
  layout: LayoutType;
};

// 大量データを模擬するため、カテゴリーを複製
const expandCategories = (categories: Category[], multiplier: number): Category[] => {
  const result: Category[] = [];
  for (let i = 0; i < multiplier; i++) {
    categories.forEach((cat) => {
      result.push({
        ...cat,
        id: `${cat.id}-${i}`,
        name: i === 0 ? cat.name : `${cat.name} (${i + 1})`,
      });
    });
  }
  return result;
};

export const VirtualScrollPattern = ({ categories, layout }: Props) => {
  const expandedCategories = expandCategories(categories, 5); // 40カテゴリーに拡張
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
    setActiveCategory(categoryId);
  };

  const selectedCategory = expandedCategories.find((c) => c.id === activeCategory);
  const originalCategory = categories.find((c) => activeCategory?.startsWith(c.id));

  const renderScrollableList = (height: string, compact = false) => (
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
        <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", alignItems: "center" }}>
          <Text variant="body.small" color="subtle">
            {expandedCategories.length}件
          </Text>
          <Badge color="subtle" count={selectedCategories.length} />
        </div>
      </div>
      <div style={{ height, overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-xSmall)",
            paddingRight: "var(--aegis-space-small)",
          }}
        >
          {expandedCategories.map((category) => (
            <Card
              key={category.id}
              style={{
                padding: compact ? "var(--aegis-space-xSmall)" : "var(--aegis-space-small)",
                cursor: "pointer",
                backgroundColor:
                  activeCategory === category.id ? "var(--aegis-color-background-information-xSubtle)" : undefined,
                flexShrink: 0,
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
                  size={compact ? "small" : "medium"}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                />
                <Text variant={compact ? "body.small" : "body.medium"}>{category.name}</Text>
                <Text variant="body.small" color="subtle" style={{ marginLeft: "auto" }}>
                  {category.count}件
                </Text>
              </div>
            </Card>
          ))}
        </div>
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
      {selectedCategory && originalCategory ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-small)",
          }}
        >
          <Text variant="title.xxSmall">{selectedCategory.name}のサブカテゴリー</Text>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-xSmall)",
              }}
            >
              {originalCategory.subcategories.map((sub) => (
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
        {renderScrollableList("400px")}
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
        <div style={{ position: "sticky", top: 0, alignSelf: "start" }}>{renderScrollableList("500px", true)}</div>
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
        {renderScrollableList("250px", true)}
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
      {renderScrollableList("300px")}
      {renderSubcategoryArea()}
    </div>
  );
};
