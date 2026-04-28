---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-802b-9569-c43b7b342ff1"
category: "Inputs"
---
# TagInput

💡 **Taginputは、任意のテキストをtagオブジェクトとして表現するためのコンポーネントです。<br><br>**placeholderに関しては以下のガイドラインに従ってください。<br><mention-page url="https://www.notion.so/12a713d40d57461ca919827af7ce9f49"/>

---
▶# 👉Examples
	

---

# <span discussion-urls="discussion://16031669-5712-80fd-8662-001c133c982b">使用時の注意点</span>
<columns>
	<column>
		このコンポーネントは単独での使用は推奨されません。<br>ラベルやエラーキャプションを含む<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>内で使用してください。

	</column>
	<column>
		
	</column>
</columns>

選択肢にないオブジェクトを入力（登録）するためのコンポーネントであるため、サービス内にすでに存在しているオブジェクトを選択する場合は<mention-database url="https://www.notion.so/15831669571280028950ccda24da1fa4"/>を使用してください。

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import type { TagInputProps } from "../../src/components/TagInput";
import { TagInput } from "../../src/components/TagInput";
import { Stack } from "../_utils/components";
import { getUsers } from "../_utils/data";

const USERS = getUsers(20);

export default {
  component: TagInput,
  args: {
    "aria-label": "Add Tags",
    defaultValue: ["LegalOn", "Technologies", "Aegis"],
  },
} satisfies Meta<typeof TagInput>;

type Story = StoryObj<typeof TagInput>;

const ALL_VARIANTS: TagInputProps["variant"][] = ["outline", "underline"];
export const Variant = {
  render: (props) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <TagInput {...props} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_SIZES: TagInputProps["size"][] = ["small", "medium", "large"];
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <TagInput {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const AddCaption = {
  args: {
    defaultTextValue: "Design",
  },
  render: (props) => (
    <Stack>
      <TagInput {...props} />
      <TagInput {...props} addCaption={false} />
    </Stack>
  ),
} satisfies Story;

export const Error = {
  args: {
    error: true,
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;

export const Leading = {
  args: {
    leading: "From:",
    defaultValue: USERS.map((user) => user.name),
  },
} satisfies Story;

export const MaxSelection = {
  args: {
    maxSelection: 5,
  },
} satisfies Story;

export const ShrinkOnBlur = {
  args: {
    shrinkOnBlur: true,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
