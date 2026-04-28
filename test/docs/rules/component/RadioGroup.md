---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-803e-b071-f95d49cd950e"
category: "Inputs"
---
# RadioGroup

💡 **RadioGroupは、選択肢の中から単一の値を選択するコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/158316695712803eb071f95d49cd950e#16831669571280f3a380c95a5d6d7602"/>

---

# 使用時の注意点
Gapの共通化が主な目的のコンポーネントです。gapの変更はしないでください。

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/158316695712803eb071f95d49cd950e#16831669571280089809dc6fe3b511ca"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { RadioGroupProps } from "../../src/components/Radio";
import { Radio, RadioCard, RadioGroup } from "../../src/components/Radio";
import { Stack } from "../_utils/components";

export default {
  component: RadioGroup,
  args: {
    defaultValue: "b",
    children: ["a", "b", "c"].map((value) => (
      <Radio value={value} key={value}>
        Option {value}
      </Radio>
    )),
  },
} satisfies Meta<typeof RadioGroup>;

type Story = StoryObj<typeof RadioGroup>;

const ALL_SIZES: RadioGroupProps["size"][] = ["medium", "small"];
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <RadioGroup {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `orientation` prop of the `RadioGroup` to `vertical` to change the orientation of it to vertical.
 */
export const Orientation = {
  args: {
    orientation: "horizontal",
    children: Array.from({ length: 15 }, (_, index) => {
      const value = String.fromCharCode(97 + index);
      return (
        <Radio key={value} value={value}>
          Option {value}
        </Radio>
      );
    }),
  },
} satisfies Story;

/**
 * Use the `title` prop of the `RadioGroup` to add a title to it.
 */
export const Title = {
  args: {
    title: "Title",
  },
} satisfies Story;

/**
 * You can put `RadioCard` in the `RadioGroup`.
 */
export const WithRadioCard = {
  args: {
    children: ["a", "b", "c"].map((value) => (
      <RadioCard value={value} key={value}>
        Option {value}
      </RadioCard>
    )),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
