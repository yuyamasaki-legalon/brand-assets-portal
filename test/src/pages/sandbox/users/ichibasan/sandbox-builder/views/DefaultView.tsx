import { LfPlusLarge } from "@legalforce/aegis-icons";
import { Button, EmptyState, Icon, Text } from "@legalforce/aegis-react";
import type React from "react";
import type { ContentArea } from "../types";
import { ComponentRenderer } from "./AddContentView/ComponentRenderer";
import type { ContentItem } from "./AddContentView/types";

interface Props {
  area: ContentArea;
  items: ContentItem[];
  onAddContent: () => void;
}

// 水平レイアウト（header / footer）エリア
const INLINE_AREAS: ContentArea[] = [
  "contentHeader",
  "paneStartHeader",
  "paneEndHeader",
  "outerSidebarStartHeader",
  "outerSidebarEndHeader",
  "contentFooter",
  "paneStartFooter",
  "paneEndFooter",
  "outerSidebarStartFooter",
  "outerSidebarEndFooter",
  "globalFooter",
];

// EmptyState を表示する body エリア
const EMPTYSTATE_AREAS: ContentArea[] = ["contentBody", "paneStartBody", "paneEndBody"];

// 空のときに表示するエリア名ラベル
const AREA_LABELS: Partial<Record<ContentArea, string>> = {
  globalHeader: "Global Header",
  globalFooter: "Global Footer",
  contentHeader: "Content: Header",
  contentFooter: "Content: Footer",
  paneStartHeader: "Pane Start: Header",
  paneStartFooter: "Pane Start: Footer",
  paneEndHeader: "Pane End: Header",
  paneEndFooter: "Pane End: Footer",
  outerSidebarStartHeader: "Sidebar Start: Header",
  outerSidebarStartBody: "Sidebar Start: Body",
  outerSidebarStartFooter: "Sidebar Start: Footer",
  outerSidebarEndHeader: "Sidebar End: Header",
  outerSidebarEndBody: "Sidebar End: Body",
  outerSidebarEndFooter: "Sidebar End: Footer",
};

export const DefaultView = ({ area, items, onAddContent }: Props): React.ReactElement | null => {
  const isInline = INLINE_AREAS.includes(area);

  if (items.length === 0) {
    if (EMPTYSTATE_AREAS.includes(area)) {
      return (
        <EmptyState
          size={area === "contentBody" ? "medium" : "small"}
          style={{ height: "100%" }}
          title="No Content Yet"
          action={
            <Button
              leading={
                <Icon>
                  <LfPlusLarge />
                </Icon>
              }
              onClick={onAddContent}
            >
              Content
            </Button>
          }
        >
          Add content using the button below.
        </EmptyState>
      );
    }
    const label = AREA_LABELS[area];
    if (!label) return null;
    return (
      <Text variant="title.xxSmall" as="span">
        {label}
      </Text>
    );
  }

  return (
    <div
      style={
        isInline
          ? { display: "flex", flexDirection: "row", alignItems: "center", columnGap: "var(--aegis-space-medium)" }
          : { display: "flex", flexDirection: "column", rowGap: "var(--aegis-space-large)" }
      }
    >
      {items.map((item) =>
        isInline && item.component === "DividerVertical" ? (
          <div key={item.id} style={{ alignSelf: "stretch", display: "flex", alignItems: "stretch" }}>
            <ComponentRenderer component={item.component} itemProps={item.props} />
          </div>
        ) : (
          <ComponentRenderer key={item.id} component={item.component} itemProps={item.props} />
        ),
      )}
    </div>
  );
};
