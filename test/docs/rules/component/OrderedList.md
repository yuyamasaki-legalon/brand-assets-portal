---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Content"
---
# OrderedList

💡 **OrderedListは、番号付きリストを表示するコンポーネントです。**

---

# 使用時の注意点
デザインガイドラインについては [MarkupText](./MarkupText.md) も参照してください。

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrderedList, UnorderedList } from "../../src/components/List";
import { getUsers } from "../_utils/data";

const USERS = getUsers(4);

export default {
  component: OrderedList,
  args: {
    children: USERS.map((user) => (
      <OrderedList.Item key={user.id}>{user.name}</OrderedList.Item>
    )),
  },
} satisfies Meta<typeof OrderedList>;

type Story = StoryObj<typeof OrderedList>;

export const Indent = {
  args: {
    indent: 1,
  },
} satisfies Story;

export const WithNestedContent = {
  args: {
    children: USERS.slice()
      .reverse()
      .reduce(
        (prev, current, index) => {
          const content = (
            // biome-ignore lint/correctness/useJsxKeyInIterable: reduce returns a single element; sibling keys are unnecessary here
            <OrderedList.Item>
              {current.name}
              {prev}
            </OrderedList.Item>
          );
          if (index === USERS.length - 1) {
            return content;
          }
          return (
            // biome-ignore lint/correctness/useJsxKeyInIterable: reduce emits a single wrapper element, not a mapped list
            <OrderedList>{content}</OrderedList>
          );
        },
        <UnorderedList>
          <UnorderedList.Item>Item</UnorderedList.Item>
        </UnorderedList>,
      ),
  },
} satisfies Story;

export const WithEmptyContent = {
  args: {
    children: <OrderedList.Item />,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
