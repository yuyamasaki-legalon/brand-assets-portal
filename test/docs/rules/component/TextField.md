---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-800b-9843-c1153adb632b"
category: "Inputs"
---
# TextField

💡 **TextFieldは、テキストを１行のみ入力するためのコンポーネントです。**
	**<br>**placeholderに関しては以下のガイドラインに従ってください。<br><mention-page url="https://www.notion.so/12a713d40d57461ca919827af7ce9f49"/>

---
▶# 👉Examples
	

---

# 使用時の注意点
<columns>
	<column>
		このコンポーネントは単独での使用は推奨されません。ラベルやエラーキャプションを含む<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>内で使用してください。
	</column>
	<column>
		
	</column>
</columns>
### サイズについて
基本的にはデフォルトサイズである**medium**を使用してください。

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfAt } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { modes } from "../../.storybook/modes";
import type { TextFieldProps } from "../../src/components/TextField";
import { TextField } from "../../src/components/TextField";
import { Stack } from "../_utils/components";

export default {
  component: TextField,
  args: {
    placeholder: "Type here",
  },
} satisfies Meta<typeof TextField>;

type Story = StoryObj<typeof TextField>;

const ALL_VARIANTS: TextFieldProps["variant"][] = ["outline", "underline"];
export const Variant = {
  render: (props) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <TextField {...props} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_SIZES: TextFieldProps["size"][] = ["large", "medium", "small"];
export const Size = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <TextField {...props} size={size} key={size} />
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

export const Error = {
  ...Variant,
  args: {
    error: true,
  },
} satisfies Story;

export const Leading = {
  args: {
    leading: LfAt,
  },
} satisfies Story;

export const Trailing = {
  args: {
    trailing: LfAt,
  },
} satisfies Story;

export const Clearable = {
  args: {
    clearable: true,
  },
  render: (props) => (
    <Stack>
      <TextField {...props} />
      <TextField {...props} defaultValue="Value" />
      <TextField {...props} defaultValue="Value" disabled />
    </Stack>
  ),
} satisfies Story;

const ALL_TYPES: TextFieldProps["type"][] = [
  "date",
  "datetime-local",
  "email",
  "month",
  "number",
  "password",
  "search",
  "tel",
  "time",
  "url",
  "week",
];
export const Type = {
  args: {
    placeholder: undefined,
  },
  render: (props) => (
    <Stack>
      {ALL_TYPES.map((type) => (
        <TextField
          {...props}
          type={type}
          aria-label={type}
          key={type}
          placeholder={type}
        />
      ))}
    </Stack>
  ),
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
