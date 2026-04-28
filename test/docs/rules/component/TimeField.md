---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8024-a607-ea6d10ee577c"
category: "Date and time"
---
# TimeField

💡 **TimeFieldは、時間入力に特化したコンポーネントです。**

---
▶# 👉Examples
	

---

# 使用時の注意点
<columns>
	<column>
		このコンポーネントは単独での使用は推奨されません。ラベルやエラーキャプションを含む<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>内で使用してください。
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
import { modes } from "../../.storybook/modes";
import { TimeField } from "../../src/components/DatePicker";
import { Stack } from "../_utils/components";

export default {
  component: TimeField,
} satisfies Meta<typeof TimeField>;

type Story = StoryObj<typeof TimeField>;

export const Size = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  render: (props) => (
    <Stack>
      <TimeField {...props} size="large" />
      <TimeField {...props} size="medium" />
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
