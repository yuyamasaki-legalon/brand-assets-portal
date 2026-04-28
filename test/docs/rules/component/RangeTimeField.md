---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Forms"
---
# RangeTimeField

💡 **RangeTimeFieldは、時刻範囲を入力するフィールドコンポーネントです。**

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
import { RangeTimeField } from "../../src/components/DatePicker";
import { Stack } from "../_utils/components";

export default {
  component: RangeTimeField,
} satisfies Meta<typeof RangeTimeField>;

type Story = StoryObj<typeof RangeTimeField>;

export const Size = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  render: (props) => (
    <Stack>
      <RangeTimeField {...props} size="medium" />
      <RangeTimeField {...props} size="large" />
    </Stack>
  ),
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;

export const Error = {
  args: {
    error: true,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
