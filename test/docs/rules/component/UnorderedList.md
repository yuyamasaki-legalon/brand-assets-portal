---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Content"
---
# UnorderedList

💡 **UnorderedListは、箇条書きリストを表示するコンポーネントです。**

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
  component: UnorderedList,
  args: {
    children: USERS.map((user) => (
      <UnorderedList.Item key={user.id}>{user.name}</UnorderedList.Item>
    )),
  },
} satisfies Meta<typeof UnorderedList>;

type Story = StoryObj<typeof UnorderedList>;

export const Indent = {
  args: {
    indent: 1,
  },
} satisfies Story;

export const WithOrderedList = {
  render: (props) => (
    <div>
      <UnorderedList {...props}>
        <UnorderedList.Item>
          Item
          <UnorderedList>
            <UnorderedList.Item>Item</UnorderedList.Item>
          </UnorderedList>
        </UnorderedList.Item>
      </UnorderedList>
      <OrderedList indent={1}>
        <OrderedList.Item>Item</OrderedList.Item>
      </OrderedList>
    </div>
  ),
} satisfies Story;

export const WithNestedContent = {
  args: {
    children: USERS.slice()
      .reverse()
      .reduce(
        (prev, current, index) => {
          const content = (
            // biome-ignore lint/correctness/useJsxKeyInIterable: reduce returns a single element; sibling keys are unnecessary here
            <UnorderedList.Item>
              {current.name}
              {prev}
            </UnorderedList.Item>
          );
          if (index === USERS.length - 1) {
            return content;
          }
          return (
            // biome-ignore lint/correctness/useJsxKeyInIterable: reduce emits one wrapper element, not a mapped list
            <UnorderedList>{content}</UnorderedList>
          );
        },
        <OrderedList>
          <OrderedList.Item>Item</OrderedList.Item>
        </OrderedList>,
      ),
  },
} satisfies Story;

export const WithEmptyContent = {
  args: {
    children: <UnorderedList.Item />,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
