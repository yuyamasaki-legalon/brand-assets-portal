---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80fc-b6c7-cf1a1b325d27"
category: "Inputs"
---
# CheckboxGroup

💡 **CheckBoxGroupは、選択肢の中から複数選択したい場合に使用します。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280fcb6c7cf1a1b325d27#1683166957128047b642fe7b48392b57"/>

---

# 使用時の注意点
Checkboxを2つ以上を同時に使用する場合に使用します。<br>単独で使用する場合は<mention-database url="https://www.notion.so/15831669571280028950ccda24da1fa4"/>を使用してください
「ON/OFF」といった2択の切り替え入力には極力radioを使用してください。
gapの変更はしないでください。

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280fcb6c7cf1a1b325d27#1683166957128034bf9bdb3a6f487d3e"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import type { CheckboxGroupProps } from "../../src/components/Checkbox";
import {
  Checkbox,
  CheckboxCard,
  CheckboxGroup,
} from "../../src/components/Checkbox";
import { Stack } from "../_utils/components";

export default {
  component: CheckboxGroup,
  args: {
    defaultValue: ["b", "c"],
    children: ["a", "b", "c"].map((value) => (
      <Checkbox value={value} key={value}>
        Option {value}
      </Checkbox>
    )),
  },
} satisfies Meta<typeof CheckboxGroup>;

type Story = StoryObj<typeof CheckboxGroup>;

const ALL_SIZES: CheckboxGroupProps["size"][] = ["medium", "small"];
/**
 * Use the `size` prop of the `CheckboxGroup` to change the size of it.
 */
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <CheckboxGroup {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Use the `orientation` prop of the `CheckboxGroup` to change the orientation of it.
 */
export const Orientation = {
  args: {
    orientation: "horizontal",
    children: Array.from({ length: 15 }, (_, index) => {
      const value = String.fromCharCode(97 + index);
      return (
        <Checkbox key={value} value={value}>
          Option {value}
        </Checkbox>
      );
    }),
  },
} satisfies Story;

/**
 * Use the `title` prop of the `CheckboxGroup` to set the title of it.
 */
export const Title = {
  args: {
    title: "Title",
  },
} satisfies Story;

/**
 * You can put `CheckboxCard` in the `CheckboxGroup`.
 */
export const WithCheckboxCard = {
  args: {
    children: ["a", "b", "c"].map((value) => (
      <CheckboxCard value={value} key={value}>
        Option {value}
      </CheckboxCard>
    )),
  },
} satisfies Story;

export const Controlled = {
  args: {
    value: ["b", "c"],
    onChange: fn(),
  },
} satisfies Story;

export const Uncontrolled = {
  args: {
    defaultValue: undefined,
    onChange: fn(),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
