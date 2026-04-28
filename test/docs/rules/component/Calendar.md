---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80aa-9974-fec9c8eccf4b"
category: "Date and time"
---
# Calendar

💡 **Calendarは、日付を選択するためのコンポーネントです。基本的にはDatePickerと合わせて使用します。<br>**期間を設定する場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を利用してください。

---
▶# 👉Examples
	

---

# 使用時の注意点
日付のみ<br>日付＋時間<br><span discussion-urls="discussion://16031669-5712-80f8-8c57-001c129ee329">いずれかの選択が可能です</span>。<br>時刻選択の挙動は<span color="blue">[こちら](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-calendar--granularity&buildNumber=3277&k=67580af56f0662716dbc895b-1200px-interactive-true&h=4&b=-4)</span>を確認してください


---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { i18n } from "@legalforce/aegis-tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { modes } from "../../.storybook/modes";
import { Calendar } from "../../src/components/Calendar";

export default {
  component: Calendar,
  args: {
    defaultFocusedValue: new Date(2023, 3, 15),
  },
} satisfies Meta<typeof Calendar>;

type Story = StoryObj<typeof Calendar>;

export const MinValue = {
  args: {
    minValue: new Date(2023, 3, 10),
    defaultFocusedValue: new Date(2023, 4, 1),
  },
} satisfies Story;

export const MaxValue = {
  args: {
    maxValue: new Date(2023, 3, 20),
  },
} satisfies Story;

/**
 * Set the `granularity` prop of the `Calendar` to `"minute"` to show the minute picker.
 */
export const Granularity = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  args: {
    granularity: "minute",
    minValue: new Date(2023, 3, 10, 1),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
