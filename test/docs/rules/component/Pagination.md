---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8097-9e09-d8ff5f44d2cd"
category: "Navigation"
---
# Pagination

## 関連レシピ

- [DataTable + Pagination](../../aegis-recipes/data-table-pagination.md)


💡 **Paginationは、コンテンツやデータを複数のページに分けて表示するために使用するコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280979e09d8ff5f44d2cd#16831669571280449cdacd961dcbd400"/>

---

# 使用時の注意点
selectに含まれるのは件数とページ数の情報のみとします。<br>その他の情報を入れるなど上記以外の方法で利用したり、カスタマイズすることは基本的に行わず、そのまま利用してください。

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280979e09d8ff5f44d2cd#16831669571280e49d8fdd57160d7e92"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Pagination } from "../../src/components/Pagination";

export default {
  component: Pagination,
  args: {
    totalCount: 2880,
    pageSize: 50,
  },
} satisfies Meta<typeof Pagination>;

type Story = StoryObj<typeof Pagination>;

/**
 * Set the `disabled` prop of `Pagination` to `true` to disable it.
 */
export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;

export const Ambiguous = {
  args: {
    ambiguous: true,
  },
} satisfies Story;

export const TotalCountZero = {
  args: {
    totalCount: 0,
  },
} satisfies Story;

export const Open = {
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
