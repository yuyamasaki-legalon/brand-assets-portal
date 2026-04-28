---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-808d-9b7d-f983dda3b971"
category: "Inputs"
---
# Search

## 関連レシピ

- [一覧ツールバー + 検索/フィルター](../../aegis-recipes/list-toolbar-and-search.md)


💡 **Searchは、検索の際に使用するコンポーネントです。**
	<br>placeholderに関しては以下のガイドラインに従ってください。<br><mention-page url="https://www.notion.so/12a713d40d57461ca919827af7ce9f49"/><br><br>Tooltipの内容については以下のガイドラインを参照してください。<br><mention-page url="https://www.notion.so/12731669571280babaa7dafd76a30e3b"/>

---
▶# 👉Examples
	

---

# 使用時の注意点
<columns>
	<column>
		Shrink On Blurのデフォルト時はIconButton扱いとします。<br><span discussion-urls="discussion://16031669-5712-80fc-8c1c-001cbf17b094">よって非アクティブ時のみTooltipが必須です。</span><br><br>また、実装の都合上TooltipとPlaceholderの文言は同一になります。<br>その点を考慮して文言を決定してください。<br><br>スペースの問題がない限りShrink On Blurの使用は非推奨とします。
	</column>
	<column>
		
	</column>
</columns>

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import type { SearchProps } from "../../src/components/Search";
import { Search } from "../../src/components/Search";
import { Stack } from "../_utils/components";

const meta: Meta<typeof Search> = {
  component: Search,
  args: {
    "aria-label": "Search",
  },
};

export default meta;

type Story = StoryObj<typeof Search>;

const ALL_SIZES: SearchProps["size"][] = ["large", "medium", "small"];
export const Size: Story = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Search {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (props) => (
    <Stack>
      <Search {...props} />
      <Search {...props} shrinkOnBlur />
    </Stack>
  ),
};

export const Error: Story = {
  args: {
    error: true,
  },
};

/**
 * Set the `shrinkOnBlur` prop of the `Search` to `true` to shrink the `Search` when it loses focus and the input is empty.
 */
export const ShrinkOnBlur: Story = {
  ...Size,
  args: {
    shrinkOnBlur: true,
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
