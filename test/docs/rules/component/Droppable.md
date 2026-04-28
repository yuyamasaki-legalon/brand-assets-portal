---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Actions"
---
# Droppable

💡 **Droppableは、ドラッグしたアイテムを別のエリアにドロップできるコンポーネントです。**

---

# 使用時の注意点
デザインガイドラインについては [DraggableList](./DraggableList.md) も参照してください。

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useState } from "react";
import { cssVar } from "@legalforce/aegis-tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Droppable } from "../../src/components/Droppable";
import { EmptyState } from "../../src/components/EmptyState";
import { Text } from "../../src/components/Text";
import { getUsers } from "../_utils/data";

const USERS = getUsers(5);

const ITEM_STYLES = {
  display: "flex",
  padding: cssVar("space.xSmall"),
  columnGap: cssVar("space.xxSmall"),
} as const;

export default {
  component: Droppable,
  render: (props) => {
    const [assignedUserIds, setAssignedUserIds] = useState(
      () => new Set<string>(),
    );

    return (
      <div style={{ display: "flex", columnGap: "var(--aegis-space-large)" }}>
        <div style={{ flexGrow: 1 }}>
          <Droppable
            {...props}
            accepts={(item) => {
              const id = item.id;
              if (!(typeof id === "string")) {
                return false;
              }
              return !assignedUserIds.has(id);
            }}
            onDrop={(item) => {
              const id = item.id;
              if (!(typeof id === "string")) {
                return;
              }
              setAssignedUserIds((prev) => new Set([...prev, id]));
            }}
          >
            {assignedUserIds.size === 0 && (
              <EmptyState title="No assigns">
                Drag & drop users here.
              </EmptyState>
            )}
            {USERS.map((user) => {
              if (!assignedUserIds.has(user.id)) {
                return null;
              }
              return (
                <Droppable.Item knobOnly id={user.id} key={user.id}>
                  <div style={ITEM_STYLES}>
                    <Droppable.Knob ghost />
                    <Text>{user.name}</Text>
                  </div>
                </Droppable.Item>
              );
            })}
          </Droppable>
        </div>
        <div style={{ width: 300 }}>
          {USERS.map((user, index) => {
            if (assignedUserIds.has(user.id)) {
              return null;
            }
            return (
              <Droppable.Item
                knobOnly
                disabled={index === 3}
                id={user.id}
                key={user.id}
              >
                <div style={ITEM_STYLES}>
                  <Droppable.Knob ghost />
                  <Text>{user.name}</Text>
                </div>
              </Droppable.Item>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies Meta<typeof Droppable>;

type Story = StoryObj<typeof Droppable>;
```
<!-- STORYBOOK_CATALOG_END -->
