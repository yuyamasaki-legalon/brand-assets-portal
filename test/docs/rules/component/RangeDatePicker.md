---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80f2-bed1-d69b899cdd7c"
category: "Date and time"
---
# RangeDatePicker

💡 **RangeDatePickerは、任意の期間を入力、または選択ができるコンポー-ネントです。<br>**期間を設定しない場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を利用してください。

---
▶# 👉Examples
	

---

# 使用時の注意点
<columns>
	<column>
		スペースの問題で入力値が全て表示されない場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使って複数のフォームに分割することを検討してください。
		▶ メモ
			[https://jp.infragistics.com/products/ignite-ui-angular/angular/components/date-range-picker](https://jp.infragistics.com/products/ignite-ui-angular/angular/components/date-range-picker)
	</column>
	<column>
		

	</column>
</columns>
<columns>
	<column>
		開始日（start）だけ、または終了日（end）だけの入力もカバーしたい場合は、<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使って複数のフォームに分割してください。<br>※RangeDatePicker では範囲指定を前提としており、片方だけの入力がしづらく、特にendだけの入力が不可。
		▶ メモ
			[https://legal-force.slack.com/archives/C042TJ2TV5M/p1750836403831919](https://legal-force.slack.com/archives/C042TJ2TV5M/p1750836403831919)

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
import type { RangeDatePickerProps } from "../../src/components/DatePicker";
import { RangeDatePicker } from "../../src/components/DatePicker";
import { Stack } from "../_utils/components";

const meta: Meta<typeof RangeDatePicker> = {
  component: RangeDatePicker,
  args: {
    "aria-label": "Pick a range",
  },
};

export default meta;

type Story = StoryObj<typeof RangeDatePicker>;

const ALL_SIZES: RangeDatePickerProps["size"][] = ["large", "medium"];
export const Size: Story = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <RangeDatePicker {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
