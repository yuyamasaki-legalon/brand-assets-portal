import { Badge, Card, Checkbox, Divider, Text } from "@legalforce/aegis-react";
import { useState } from "react";
import type { Category, CategoryGroup } from "../mock/data";

type LayoutType = "two-column" | "sidebar" | "compact" | "vertical";

type Props = {
  categories: Category[];
  categoryGroups: CategoryGroup[];
  layout: LayoutType;
};

export const GroupedPattern = ({ categories, categoryGroups, layout }: Props) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
    setActiveCategory(categoryId);
  };

  const selectedCategory = categories.find((c) => c.id === activeCategory);

  const renderGroupedList = (compact = false) => (
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-medium)",
        }}
      >
        {categoryGroups.map((group, groupIndex) => (
          <div key={group.id}>
            {groupIndex > 0 && <Divider style={{ marginBottom: "var(--aegis-space-medium)" }} />}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-xSmall)",
              }}
            >
              <Text
                variant={compact ? "label.small.bold" : "label.medium.bold"}
                color="subtle"
                style={{ paddingLeft: "var(--aegis-space-xSmall)" }}
              >
                {group.name}
              </Text>
              {group.categories.map((category) => (
                <Card
                  key={category.id}
                  style={{
                    padding: compact ? "var(--aegis-space-xSmall)" : "var(--aegis-space-small)",
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
        {renderGroupedList()}
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
        <div style={{ position: "sticky", top: 0, alignSelf: "start" }}>{renderGroupedList(true)}</div>
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
        {renderGroupedList(true)}
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
      {renderGroupedList()}
      {renderSubcategoryArea()}
    </div>
  );
};
