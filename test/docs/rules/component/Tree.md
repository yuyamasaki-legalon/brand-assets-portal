---
paths: src/**/*.{ts,tsx}
notion_page_id: "23f31669-5712-808f-b32d-edf8a7dc3ab3"
category: "Navigation"
---
# Tree

💡 あれをこうこうするコンポーネントです
# 使用時の注意点
あれこれそれ

### あれのとき
あれこれそれ

### これのとき
あれこれそれ

### それのとき
あれこれそれ

---

# 素材置き場
あれこれそれ

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useState } from "react";
import { LfEllipsisDot, LfFile, LfFolder } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { IconButton } from "../../src/components/Button";
import { Icon } from "../../src/components/Icon";
import { Text } from "../../src/components/Text";
import { Tree, TreeItem } from "../../src/components/Tree";

interface Item {
  name: string;
  children?: string[];
}

const ITEMS: Record<string, Item> = {
  root: {
    name: "Root",
    children: ["0", "1"],
  },
  0: {
    name: "Item 0",
    children: ["0-0", "0-1", "0-2"],
  },
  "0-0": {
    name: "Item 0-0",
  },
  "0-1": {
    name: "Item 0-1",
  },
  "0-2": {
    name: "Item 0-2",
  },
  1: {
    name: "Item 1",
    children: ["1-0", "1-1"],
  },
  "1-0": {
    name: "Item 1-0",
  },
  "1-1": {
    name: "Item 1-1",
    children: ["1-1-0", "1-1-1"],
  },
  "1-1-0": {
    name: "Item 1-1-0",
  },
  "1-1-1": {
    name: "Item 1-1-1",
    children: ["1-1-1-0", "1-1-1-1"],
  },
  "1-1-1-0": {
    name: "Item 1-1-1-0",
  },
  "1-1-1-1": {
    name: "Item 1-1-1-1",
  },
};

export default {
  component: Tree,
  args: {
    items: ITEMS,
    rootItemId: "root",
  },
} satisfies Meta<typeof Tree>;

type Story = StoryObj<typeof Tree>;

export const Children = {
  args: {
    children: (itemId) => (
      <TreeItem
        leading={
          <Icon>
            {ITEMS[itemId]?.children === undefined ? <LfFile /> : <LfFolder />}
          </Icon>
        }
        trailing={
          <Text variant="data.small" color="subtle">
            ID: {itemId}
          </Text>
        }
        action={
          <IconButton aria-label="Label">
            <Icon>
              <LfEllipsisDot />
            </Icon>
          </IconButton>
        }
      >
        {ITEMS[itemId]?.name}
      </TreeItem>
    ),
  },
} satisfies Story;

const GET_ITEM_NAME_ITEMS: Record<
  string,
  {
    itemName: string;
    children?: string[];
  }
> = {
  root: {
    itemName: "Root",
    children: ["0", "1"],
  },
  0: {
    itemName: "Item 0",
    children: ["0-0", "0-1"],
  },
  1: {
    itemName: "Item 1",
    children: ["1-0", "1-1"],
  },
  "0-0": {
    itemName: "Item 0-0",
  },
  "0-1": {
    itemName: "Item 0-1",
  },
  "1-0": {
    itemName: "Item 1-0",
  },
  "1-1": {
    itemName: "Item 1-1",
  },
};
export const GetName = {
  args: {
    items: GET_ITEM_NAME_ITEMS,
    getItemName: (itemId) => GET_ITEM_NAME_ITEMS[itemId]?.itemName ?? "",
  },
} satisfies Story;

const GET_ITEM_CHILDREN_ITEMS: Record<
  string,
  {
    name: string;
    nodes?: string[];
  }
> = {
  root: {
    name: "Root",
    nodes: ["0", "1"],
  },
  0: {
    name: "Item 0",
    nodes: ["0-0", "0-1"],
  },
  1: {
    name: "Item 1",
    nodes: ["1-0", "1-1"],
  },
  "0-0": {
    name: "Item 0-0",
  },
  "0-1": {
    name: "Item 0-1",
  },
  "1-0": {
    name: "Item 1-0",
  },
  "1-1": {
    name: "Item 1-1",
  },
};
export const GetItemChildren = {
  args: {
    items: GET_ITEM_CHILDREN_ITEMS,
    getItemChildren: (itemId) => GET_ITEM_CHILDREN_ITEMS[itemId]?.nodes,
  },
} satisfies Story;

export const SelectionTypeSingle = {
  args: {
    selectionType: "single",
    onSelectedItemsChange: fn(),
  },
} satisfies Story;

export const SelectionTypeMultiple = {
  args: {
    selectionType: "multiple",
    onSelectedItemsChange: fn(),
  },
} satisfies Story;

export const PropagateSelection = {
  args: {
    defaultExpandedItems: ["1", "1-1", "1-1-1"],
    selectionType: "multiple",
    propagateSelection: true,
    onSelectedItemsChange: fn(),
  },
} satisfies Story;

export const Reorderable = {
  args: {
    reorderable: true,
  },
  render: (props) => {
    const [items, setItems] = useState(ITEMS);

    return (
      <Tree
        {...props}
        items={items}
        onMoveItems={({ changes }) => {
          setItems((items) =>
            Object.entries(changes).reduce((prev, [parentId, change]) => {
              if (prev[parentId] === undefined) {
                return prev;
              }
              return {
                ...prev,
                [parentId]: {
                  ...prev[parentId],
                  children:
                    change.children.length === 0 ? undefined : change.children,
                },
              };
            }, items),
          );
        }}
      />
    );
  },
} satisfies Story;

export const LoadChildren = {
  render: (props) => {
    interface PartialItem {
      name: string;
      hasChildren: boolean;
    }

    const [items, setItems] = useState<Record<string, Item | PartialItem>>({
      root: {
        name: "Root",
        children: ["0", "1"],
      },
      0: {
        name: "Item 0",
        hasChildren: true,
      },
      1: {
        name: "Item 1",
        children: ["1-0", "1-1"],
      },
      "1-0": {
        name: "Item 1-0",
        hasChildren: false,
      },
      "1-1": {
        name: "Item 1-1",
        hasChildren: true,
      },
    });

    return (
      <Tree
        {...props}
        items={items}
        getItemChildren={(itemId) => {
          const item = items[itemId];
          if (item === undefined) {
            return undefined;
          }
          if ("hasChildren" in item) {
            return item.hasChildren ? [] : undefined;
          }
          return item.children;
        }}
        loadChildren={(itemId) => {
          const item = items[itemId];
          if (item === undefined) {
            // This should not happen if `getItemChildren` is properly implemented.
            return;
          }
          if ("children" in item) {
            // already loaded.
            return;
          }

          return new Promise((resolve) => {
            setTimeout(() => {
              setItems((items) => {
                const item = ITEMS[itemId]!;
                const next = { ...items, [itemId]: item };

                item.children?.forEach((childId) => {
                  const child = ITEMS[childId]!;
                  next[childId] = {
                    name: child.name,
                    hasChildren: child.children !== undefined,
                  };
                });

                return next;
              });
              resolve();
            }, 300);
          });
        }}
      />
    );
  },
} satisfies Story;

export const LongChildren = {
  args: {
    defaultExpandedItems: ["1", "1-1", "1-1-1"],
    children: (itemId) => <TreeItem>{ITEMS[itemId]?.name.repeat(30)}</TreeItem>,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
