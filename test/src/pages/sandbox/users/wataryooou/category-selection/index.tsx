import {
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Tab,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { AccordionPattern } from "./components/AccordionPattern";
import { GroupedPattern } from "./components/GroupedPattern";
import { SearchablePattern } from "./components/SearchablePattern";
import { VirtualScrollPattern } from "./components/VirtualScrollPattern";
import { categories, categoryGroups } from "./mock/data";

type PatternType = "searchable" | "accordion" | "virtualScroll" | "grouped";
type LayoutType = "two-column" | "sidebar" | "compact" | "vertical";

const patternLabels: Record<PatternType, string> = {
  searchable: "検索可能式",
  accordion: "アコーディオン式",
  virtualScroll: "仮想スクロール式",
  grouped: "グループ化式",
};

const layoutLabels: Record<LayoutType, string> = {
  "two-column": "左右2カラム",
  sidebar: "サイドバー式",
  compact: "コンパクト式",
  vertical: "縦積み式",
};

const patternTypes: PatternType[] = ["searchable", "accordion", "virtualScroll", "grouped"];
const layoutTypes: LayoutType[] = ["two-column", "sidebar", "compact", "vertical"];

export const CategorySelection = () => {
  const [patternIndex, setPatternIndex] = useState(0);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>("two-column");

  const selectedPattern = patternTypes[patternIndex];

  const renderPattern = () => {
    switch (selectedPattern) {
      case "searchable":
        return <SearchablePattern categories={categories} layout={selectedLayout} />;
      case "accordion":
        return <AccordionPattern categories={categories} layout={selectedLayout} />;
      case "virtualScroll":
        return <VirtualScrollPattern categories={categories} layout={selectedLayout} />;
      case "grouped":
        return <GroupedPattern categories={categories} categoryGroups={categoryGroups} layout={selectedLayout} />;
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>カテゴリー選択 UI パターン</ContentHeader.Title>
            <ContentHeader.Description>膨大な小カテゴリーに対応した8つのレイアウトパターン</ContentHeader.Description>
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
            {/* Pattern Tabs */}
            <Tab.Group index={patternIndex} onChange={setPatternIndex}>
              <Tab.List>
                {patternTypes.map((pattern) => (
                  <Tab key={pattern}>{patternLabels[pattern]}</Tab>
                ))}
              </Tab.List>
            </Tab.Group>

            {/* Layout Sub-tabs */}
            <div
              style={{
                display: "flex",
                gap: "var(--aegis-space-large)",
                borderBottom: "1px solid var(--aegis-color-border-default)",
                paddingBottom: "var(--aegis-space-small)",
              }}
            >
              {layoutTypes.map((layout) => (
                <button
                  key={layout}
                  type="button"
                  onClick={() => setSelectedLayout(layout)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "var(--aegis-space-xSmall) 0",
                    borderBottom:
                      selectedLayout === layout
                        ? "2px solid var(--aegis-color-border-information)"
                        : "2px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  <Text variant="body.medium" color={selectedLayout === layout ? "default" : "subtle"}>
                    {layoutLabels[layout]}
                  </Text>
                </button>
              ))}
            </div>

            {/* Pattern Content */}
            <div style={{ paddingTop: "var(--aegis-space-small)" }}>{renderPattern()}</div>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
