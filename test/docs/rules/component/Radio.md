---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8020-a371-debb73c4591d"
category: "Inputs"
---
# Radio

💡 **Radioは、RadioGroupのベースコンポーネントです。<br>通常使用はRadioGroupを使用してください。<br><br>**インナーにテキスト以外の要素を入れたい時は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。

---
▶# 👉Examples
	

---

# 使用時の注意点
⚠️<span color="red">**ベースコンポーネントのため通常使用はできません**</span>

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { RadioProps } from "../../src/components/Radio";
import { Radio } from "../../src/components/Radio";
import { Stack } from "../_utils/components";

export default {
  component: Radio,
  args: {
    name: "radio",
    children: "Label",
  },
} satisfies Meta<typeof Radio>;

type Story = StoryObj<typeof Radio>;

const ALL_SIZES: RadioProps["size"][] = ["medium", "small"];
/**
 * Use the `size` prop of the `Radio` to change the size of it.
 */
export const Size = {
  render: (props) => (
    <Stack direction="row">
      {ALL_SIZES.map((size) => (
        <Radio {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `disabled` prop of the `Radio` to `true` to disable it.
 */
export const Disabled = {
  args: {
    disabled: true,
  },
  render: (props) => (
    <Stack direction="row">
      <Radio {...props} />
      <Radio {...props} defaultChecked />
    </Stack>
  ),
} satisfies Story;

export const NoLabel = {
  ...Size,
  args: {
    children: undefined,
    "aria-label": "Label",
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
