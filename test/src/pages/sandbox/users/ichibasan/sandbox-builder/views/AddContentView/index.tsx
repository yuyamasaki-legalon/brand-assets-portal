import { Draggable, EmptyState, Text } from "@legalforce/aegis-react";
import type React from "react";
import type { ContentArea } from "../../types";
import { Brick } from "./Brick";
import styles from "./index.module.css";
import type { ContentItem } from "./types";

const HEADER_AREAS: ContentArea[] = [
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

const TOOLBAR_BELOW_AREAS: ContentArea[] = [
  "contentHeader",
  "paneStartHeader",
  "paneEndHeader",
  "outerSidebarStartHeader",
  "outerSidebarEndHeader",
];

const TOOLBAR_ABOVE_AREAS: ContentArea[] = [
  "contentFooter",
  "paneStartFooter",
  "paneEndFooter",
  "outerSidebarStartFooter",
  "outerSidebarEndFooter",
  "globalFooter",
];

const EMPTYSTATE_AREAS: ContentArea[] = ["contentBody", "paneStartBody", "paneEndBody"];

type PopoverPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

const BRICK_POPOVER_PLACEMENT: Partial<Record<ContentArea, PopoverPlacement>> = {
  outerSidebarStartHeader: "bottom-start",
  outerSidebarStartBody: "bottom-start",
  outerSidebarStartFooter: "top-start",
  paneStartHeader: "bottom-start",
  paneStartBody: "bottom-start",
  paneStartFooter: "top-start",
  contentHeader: "bottom-start",
  contentBody: "bottom-start",
  contentFooter: "top-start",
  paneEndHeader: "bottom-start",
  paneEndBody: "bottom-start",
  outerSidebarEndHeader: "bottom-end",
  outerSidebarEndBody: "bottom-end",
};

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

interface Props {
  area: ContentArea;
  items: ContentItem[];
  onRemove: (id: string) => void;
  onReorder: (items: ContentItem[]) => void;
  onUpdate: (id: string, props: Record<string, string>) => void;
  onItemPopoverOpenChange?: (open: boolean) => void;
  brickToolbarSide?: "start" | "end";
}

export const AddContentView = ({
  area,
  items,
  onRemove,
  onReorder,
  onUpdate,
  onItemPopoverOpenChange,
  brickToolbarSide,
}: Props): React.ReactElement | null => {
  const isHeader = HEADER_AREAS.includes(area);
  const toolbarPlacement = TOOLBAR_BELOW_AREAS.includes(area)
    ? ("below" as const)
    : TOOLBAR_ABOVE_AREAS.includes(area)
      ? ("above" as const)
      : undefined;

  if (items.length === 0) {
    if (EMPTYSTATE_AREAS.includes(area)) {
      return (
        <EmptyState
          size={area === "contentBody" ? "medium" : "small"}
          style={{ height: "100%" }}
          title="No Content Yet"
        >
          Add content using the button above.
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

  if (isHeader) {
    return (
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "var(--aegis-space-medium)" }}>
        {items.map((item) => {
          const isDividerVertical = item.component === "DividerVertical";
          return (
            <div
              key={item.id}
              style={
                isDividerVertical
                  ? { alignSelf: "stretch", display: "flex", alignItems: "stretch" }
                  : item.component === "ContentHeader"
                    ? { flex: 1, minWidth: 0 }
                    : undefined
              }
            >
              <Brick
                item={item}
                area={area}
                onRemove={onRemove}
                onUpdate={onUpdate}
                onItemPopoverOpenChange={onItemPopoverOpenChange}
                style={
                  isDividerVertical
                    ? { height: "100%", display: "flex", alignItems: "stretch", padding: "0 4px" }
                    : undefined
                }
                toolbarPlacement={toolbarPlacement}
                allItems={items}
                onReorder={onReorder}
                popoverPlacement={BRICK_POPOVER_PLACEMENT[area]}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.brickList}>
      <Draggable values={items} onReorder={onReorder}>
        {items.map((item) => (
          <Draggable.Item key={item.id} id={item.id} knobOnly>
            <Brick
              item={item}
              area={area}
              onRemove={onRemove}
              onUpdate={onUpdate}
              onItemPopoverOpenChange={onItemPopoverOpenChange}
              toolbarSide={brickToolbarSide}
              allItems={items}
              onReorder={onReorder}
              popoverPlacement={BRICK_POPOVER_PLACEMENT[area]}
            />
          </Draggable.Item>
        ))}
      </Draggable>
    </div>
  );
};
