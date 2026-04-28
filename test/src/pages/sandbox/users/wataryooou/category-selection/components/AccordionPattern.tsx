import { Accordion, Badge, Card, Checkbox, Text } from "@legalforce/aegis-react";
import { useState } from "react";
import type { Category } from "../mock/data";

type LayoutType = "two-column" | "sidebar" | "compact" | "vertical";

type Props = {
  categories: Category[];
  layout: LayoutType;
};

export const AccordionPattern = ({ categories, layout }: Props) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
  };

  const handleSubcategoryToggle = (subcategoryId: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId) ? prev.filter((id) => id !== subcategoryId) : [...prev, subcategoryId],
    );
  };

  const renderAccordionList = (compact = false) => (
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
        <Text variant="title.xxSmall">カテゴリー</Text>
        <Badge color="subtle" count={selectedCategories.length + selectedSubcategories.length} />
      </div>
      <Accordion multiple>
        {categories.map((category, index) => (
          <Accordion.Item key={category.id} data-index={index}>
            <Accordion.Button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--aegis-space-small)",
                  width: "100%",
                }}
              >
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCategoryToggle(category.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <Text variant={compact ? "body.small" : "body.medium"}>{category.name}</Text>
                <Text
                  variant="body.small"
                  color="subtle"
                  style={{ marginLeft: "auto", marginRight: "var(--aegis-space-small)" }}
                >
                  {category.count}件
                </Text>
              </div>
            </Accordion.Button>
            <Accordion.Panel>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                  paddingLeft: "var(--aegis-space-large)",
                }}
              >
                {category.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--aegis-space-small)",
                      padding: "var(--aegis-space-xSmall)",
                    }}
                  >
                    <Checkbox
                      size={compact ? "small" : "medium"}
                      checked={selectedSubcategories.includes(sub.id)}
                      onChange={() => handleSubcategoryToggle(sub.id)}
                    />
                    <Text variant={compact ? "body.small" : "body.medium"}>{sub.name}</Text>
                    <Text variant="body.small" color="subtle" style={{ marginLeft: "auto" }}>
                      {sub.count}件
                    </Text>
                  </div>
                ))}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Card>
  );

  const renderSummary = () => (
    <Card
      style={{
        padding: "var(--aegis-space-medium)",
        minHeight: 200,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-small)",
        }}
      >
        <Text variant="title.xxSmall">選択中のカテゴリー</Text>
        {selectedCategories.length === 0 && selectedSubcategories.length === 0 ? (
          <Text color="subtle">カテゴリーを選択してください</Text>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
            {selectedCategories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return cat ? (
                <Card key={catId} style={{ padding: "var(--aegis-space-small)" }}>
                  <Text variant="body.medium">{cat.name}</Text>
                </Card>
              ) : null;
            })}
            {selectedSubcategories.map((subId) => {
              for (const cat of categories) {
                const sub = cat.subcategories.find((s) => s.id === subId);
                if (sub) {
                  return (
                    <Card key={subId} style={{ padding: "var(--aegis-space-small)" }}>
                      <Text variant="body.small" color="subtle">
                        {cat.name} &gt;{" "}
                      </Text>
                      <Text variant="body.medium">{sub.name}</Text>
                    </Card>
                  );
                }
              }
              return null;
            })}
          </div>
        )}
      </div>
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
        {renderAccordionList()}
        {renderSummary()}
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
        <div style={{ position: "sticky", top: 0, alignSelf: "start" }}>{renderAccordionList(true)}</div>
        {renderSummary()}
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
        {renderAccordionList(true)}
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
      {renderAccordionList()}
      {renderSummary()}
    </div>
  );
};
