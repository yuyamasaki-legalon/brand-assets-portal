---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-805a-8fe0-e99930ab1c93"
category: "Navigation"
---
# NavList

💡 **NavListは、ナビゲーションメニューとして、異なるセクションやページに遷移する際に使用するコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/158316695712805a8fe0e99930ab1c93#168316695712800db33bef63c0deee0a"/>

---

# 使用時の注意点
基本的に常駐するコンポーネントです。非表示にしたりはできません。
項目名は変化しないものを入れてください。<br>項目名が動的に変化する場合は、NavListではなく<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。

---

### サイズについて
mediumがデフォルトの値です。<br>特に理由がなければmediumを使用してください。

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/158316695712805a8fe0e99930ab1c93#168316695712802bb788f9f337648af0"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import type { NavListProps } from "../../src/components/NavList";
import { NavList } from "../../src/components/NavList";
import { Stack } from "../_utils/components";

export default {
  component: NavList,
  args: {
    children: [
      <NavList.Item href="#" key={0}>
        Home
      </NavList.Item>,
      <NavList.Item href="#" aria-current="page" key={1}>
        Documents
      </NavList.Item>,
      <NavList.Item href="#" key={2}>
        Reviews
      </NavList.Item>,
      <NavList.Item href="#" key={3}>
        Settings
      </NavList.Item>,
    ],
  },
} satisfies Meta<typeof NavList>;

type Story = StoryObj<typeof NavList>;

const ALL_SIZES: NavListProps["size"][] = ["small", "medium", "large"];
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <NavList {...props} key={size} size={size} aria-label={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const WithGroup = {
  render: (props) => (
    <NavList {...props}>
      <NavList.Group>
        <NavList.Item href="#">Home</NavList.Item>
        <NavList.Item href="#" aria-current="page">
          Documents
        </NavList.Item>
        <NavList.Item href="#">Reviews</NavList.Item>
      </NavList.Group>
      <NavList.Group>
        <NavList.Item href="#">Settings</NavList.Item>
      </NavList.Group>
    </NavList>
  ),
} satisfies Story;

export const WithGroupTitle = {
  render: (props) => (
    <NavList {...props}>
      <NavList.Group title="General">
        <NavList.Item href="#">Home</NavList.Item>
        <NavList.Item href="#" aria-current="page">
          Documents
        </NavList.Item>
        <NavList.Item href="#">Reviews</NavList.Item>
      </NavList.Group>
      <NavList.Group title="Preferences">
        <NavList.Item href="#">Settings</NavList.Item>
      </NavList.Group>
    </NavList>
  ),
} satisfies Story;

export const ItemAsAnchor = {
  render: () => (
    <NavList>
      <NavList.Item href="/home">Home</NavList.Item>
      <NavList.Item href="/settings">Settings</NavList.Item>
    </NavList>
  ),
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
