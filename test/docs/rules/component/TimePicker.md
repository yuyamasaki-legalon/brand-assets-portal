---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Forms"
---
# TimePicker

💡 **TimePickerは、時刻をピッカーUIで選択するコンポーネントです。**

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
import { userEvent, within } from "storybook/test";
import { modes } from "../../.storybook/modes";
import { Time, TimePicker } from "../../src/components/DatePicker";

export default {
  component: TimePicker,
} satisfies Meta<typeof TimePicker>;

type Story = StoryObj<typeof TimePicker>;

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

export const MinuteStep = {
  args: {
    minuteStep: 1,
  },
} satisfies Story;

export const MinValue = {
  args: {
    minValue: new Time(9, 30),
  },
} satisfies Story;

export const MaxValue = {
  args: {
    maxValue: new Time(18, 30),
  },
} satisfies Story;

export const Open = {
  parameters: {
    chromatic: {
      modes: modes.locale,
    },
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
