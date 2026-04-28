---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80b9-b782-f9651818e11c"
category: "Inputs"
---
# Checkbox

💡 **Checkboxは、単独の要素を選択したい場合に使用します。**
	**<br>**選択肢が複数の場合<br><mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/><br>を使用してください。

---
▶# 👉Examples
	

---

# 使用時の注意点
<columns>
	<column>
		「ON/OFF」といった切り替えUIには、なるべく<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		2つ以上を同時に使用する場合<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		サブテキストやその他のオブジェクトを含めたい場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を利用してください。
		CheckBoxCardは2つ以上を同時に使用する場合も想定して作られているComponentです。CheckboxGroupを使う必要はありません。

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
import type { CheckboxProps } from "../../src/components/Checkbox";
import { Checkbox } from "../../src/components/Checkbox";
import { Text } from "../../src/components/Text";
import { Stack } from "../_utils/components";

export default {
  component: Checkbox,
  args: {
    children: "Label",
  },
} satisfies Meta<typeof Checkbox>;

type Story = StoryObj<typeof Checkbox>;

const ALL_SIZES: CheckboxProps["size"][] = ["medium", "small", "xSmall"];
/**
 * Use the `size` prop of the `Checkbox` to change the size of it.
 */
export const Size = {
  render: (props) => (
    <Stack direction="row">
      {ALL_SIZES.map((size) => (
        <Checkbox {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_COLORS: CheckboxProps["color"][] = ["neutral", "warning", "danger"];
/**
 * Use the `color` prop of the `Checkbox` to change the color of it.
 */
export const Color = {
  render: (props) => (
    <Stack direction="row">
      {ALL_COLORS.map((color) => (
        <Checkbox {...props} color={color} key={color} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `indeterminate` prop of the `Checkbox` to `true` to make it indeterminate.
 */
export const Indeterminate = {
  args: {
    indeterminate: true,
  },
} satisfies Story;

/**
 * Set the `disabled` prop of the `Checkbox` to `true` to make it disabled.
 */
export const Disabled = {
  args: {
    disabled: true,
  },
  render: (props) => (
    <Stack direction="row">
      <Checkbox {...props} />
      <Checkbox defaultChecked {...props} />
      <Checkbox indeterminate {...props} />
    </Stack>
  ),
} satisfies Story;

export const MultipleLines = {
  args: {
    children: <Text whiteSpace="pre">{"Line 1\nLine 2"}</Text>,
  },
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
