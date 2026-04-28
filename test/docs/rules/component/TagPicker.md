---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80ac-a79e-c512174e2571"
category: "Inputs"
---
# TagPicker

## 関連レシピ

- [フォームラベル + ヘルプ + TagPicker](../../aegis-recipes/form-control-help-tagpicker.md)
- [TagPicker カスタム候補 + EmptyState](../../aegis-recipes/tagpicker-custom-options.md)


💡 **TagPickerは、ドロップダウンリストと検索フィールドを組み合わせたコンポーネントです。<br>リスト数が多い場合かつ、複数選択の際に利用します。<br><br>**単一選択の場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>か、<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。<br>placeholderに関しては以下のガイドラインに従ってください。<br><mention-page url="https://www.notion.so/12a713d40d57461ca919827af7ce9f49"/>

---
▶# 👉Examples
	

---

# <span discussion-urls="discussion://16031669-5712-8099-96a3-001cf4568ee3">使用時の注意点</span>
目安として５つ以下の場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>の使用を検討してください。<br>スペースに制限がある場合はこの限りではありません。

---

<columns>
	<column>
		このコンポーネントは単独での使用は推奨されません。ラベルやエラーキャプションを含む<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>内で使用してください。

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
import { clearAllMocks, expect, fn, userEvent, within } from "storybook/test";
import { EmptyState } from "../../src/components/EmptyState";
import type { TagPickerProps } from "../../src/components/TagInput";
import { TagPicker } from "../../src/components/TagInput";
import { Stack } from "../_utils/components";
import { getUsers } from "../_utils/data";

const USERS = getUsers(50);

export default {
  component: TagPicker,
  args: {
    options: USERS.map((user) => ({
      label: user.name,
      value: user.id,
    })),
    "aria-label": "Pick users",
  },
} satisfies Meta<typeof TagPicker>;

type Story = StoryObj<typeof TagPicker>;

const ALL_VARIANTS: TagPickerProps["variant"][] = ["outline", "underline"];
export const Variant = {
  render: (props) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <TagPicker {...props} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_SIZES: TagPickerProps["size"][] = ["small", "medium", "large"];
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <TagPicker {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const Disabled = {
  ...Variant,
  args: {
    disabled: true,
  },
} satisfies Story;

export const WithGroup = {
  args: {
    options: [
      {
        title: "Group A",
        options: USERS.slice(0, 2).map((user) => ({
          label: user.name,
          value: user.id,
        })),
      },
      {
        title: "Group B",
        options: USERS.slice(2).map((user) => ({
          label: user.name,
          value: user.id,
        })),
      },
    ],
  },
} satisfies Story;

export const Leading = {
  args: {
    leading: "From:",
    defaultValue: USERS.map((user) => user.id),
  },
} satisfies Story;

export const Loading = {
  args: {
    loading: true,
    options: [],
  },
} satisfies Story;

export const EmptyNode = {
  parameters: {
    a11y: { test: "todo" },
  },
  args: {
    emptyNode: <EmptyState title="Title">No Options Available</EmptyState>,
  },
} satisfies Story;

export const MaxSelection = {
  args: {
    maxSelection: 3,
  },
} satisfies Story;

export const WithDisabledOption = {
  parameters: {
    a11y: {
      // Most likely just a timing issue in Vitest.
      test: "todo",
    },
  },
  args: {
    options: USERS.map((user, index) => ({
      label: user.name,
      value: user.id,
      disabled: index % 2 === 1,
    })),
    defaultValue: [USERS[1]!.id],
    onChange: fn(),
  },
} satisfies Story;

export const RollbackOnEnter = {
  args: {
    defaultValue: USERS.slice(0, 2).map((user) => user.id),
  },
} satisfies Story;

export const SelectionBehavior = {
  args: {
    selectionBehavior: "preserve",
  },
} satisfies Story;

export const WithSameLabels = {
  args: {
    options: [
      { label: "Label", value: "1" },
      { label: "Label", value: "2" },
      { label: "Label", value: "3" },
      { label: "Label 4", value: "4" },
    ],
    defaultValue: ["1", "2"],
    onChange: fn(),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
