---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Forms"
---
# RangeDateField

💡 **RangeDateFieldは、日付範囲を入力するフィールドコンポーネントです。**

---

# 使用時の注意点
（追記予定）

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { modes } from "../../.storybook/modes";
import type { RangeDateFieldProps } from "../../src/components/DatePicker";
import { RangeDateField } from "../../src/components/DatePicker";
import { Stack } from "../_utils/components";

const meta: Meta<typeof RangeDateField> = {
  component: RangeDateField,
  args: {
    "aria-label": "Input a date range",
  },
};

export default meta;

type Story = StoryObj<typeof RangeDateField>;

const ALL_SIZES: RangeDateFieldProps["size"][] = ["large", "medium"];
export const Size: Story = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <RangeDateField {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
};

export const Granularity: Story = {
  args: {
    granularity: "minute",
  },
};

/**
 * Set the `disabled` prop of the `RangeDateField` to `true` to disable it.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
