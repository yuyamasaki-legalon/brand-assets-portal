---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80f6-9f64-d8d9d0a1f207"
category: "Date and time"
---
# RangeCalendar

💡 **RangeCalendarは、カレンダーから期間を選択するためのコンポーネントです。<br>**基本的には<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>と合わせて使用します。<br>期間を設定しない場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を利用してください。

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280f69f64d8d9d0a1f207#168316695712801f8232c4d971b79794"/>

---

# 使用時の注意点
特になし

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280f69f64d8d9d0a1f207#168316695712808da65ee0126688d8ef"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { modes } from "../../.storybook/modes";
import { RangeCalendar } from "../../src/components/Calendar";

export default {
  component: RangeCalendar,
  args: {
    defaultFocusedValue: new Date(2023, 3, 1),
  },
} satisfies Meta<typeof RangeCalendar>;

type Story = StoryObj<typeof RangeCalendar>;

export const Selected = {
  args: {
    defaultStartValue: new Date(2023, 3, 5),
    defaultEndValue: new Date(2023, 4, 2),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
