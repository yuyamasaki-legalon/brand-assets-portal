---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80d7-9196-c9478cd43ff8"
category: "Date and time"
---
# DateField

💡 **DateFieldは、日付入力に特化したコンポーネントです。**
	figmaでは以下を同一のコンポーネントとして扱っています。
	- [DateField](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-datefield--size&buildNumber=3278&k=67592e87967f333d2e2e8afe-1200px-interactive-true&h=7&b=-4)
	- [RangeDateField](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-rangedatefield--size&buildNumber=3277&k=67580af56f0662716dbc8a30-1200px-interactive-true&h=1&b=0)

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280e1af4acc1dccb7bd58"/>

---

# 使用時の注意点
<columns>
	<column>
		特に理由がなければ、カレンダー機能がついているDatePickerを使用してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280d79196c9478cd43ff8#175316695712808dabe9d843a4a974a5"/>
	</column>
</columns>
<columns>
	<column>
		このコンポーネントは単独での使用は推奨されません。ラベルやエラーキャプションを含む<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>内で使用してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280d79196c9478cd43ff8#15e31669571280a9817ccc3794900c0e"/>
	</column>
</columns>

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280d79196c9478cd43ff8#168316695712807e9c2ff4e300ac4152"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfAt } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { clearAllMocks, expect, fn, userEvent, within } from "storybook/test";
import { modes } from "../../.storybook/modes";
import type { DateFieldProps } from "../../src/components/DatePicker";
import { DateField } from "../../src/components/DatePicker";
import { FormControl } from "../../src/components/Form";
import { Stack } from "../_utils/components";

const meta: Meta<typeof DateField> = {
  component: DateField,
  args: {
    "aria-label": "Pick a date",
  },
};

export default meta;

type Story = StoryObj<typeof DateField>;

const ALL_SIZES: DateFieldProps["size"][] = ["large", "medium"];
/**
 * Use the `size` prop of the `DateField` to change the size of it.
 */
export const Size: Story = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <DateField {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
};

export const AutoFocus: Story = {
  args: {
    autoFocus: true,
  },
};

/**
 * Set the `granularity` prop of the `DateField` to `"minute"` to show the time input.
 */
export const Granularity: Story = {
  parameters: {
    chromatic: {
      modes: modes.locale,
    },
  },
  args: {
    granularity: "minute",
  },
};

/**
 * Set the `disabled` prop of the `DateField` to `true` to disable it.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Leading: Story = {
  args: {
    leading: LfAt,
  },
};

export const Trailing: Story = {
  args: {
    trailing: LfAt,
  },
};

export const WithinFormControl: Story = {
  render: (props) => (
    <FormControl>
      <FormControl.Label>Label</FormControl.Label>
      <DateField {...props} />
    </FormControl>
  ),
};

export const FocusCallback: Story = {
  args: {
    onFocus: fn(),
    onBlur: fn(),
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
