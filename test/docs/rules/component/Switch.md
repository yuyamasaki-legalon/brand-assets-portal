---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-805e-b22c-d127423fa812"
category: "Buttons"
---
# Switch

💡 **Switchは、「オン/オフ」や「真/偽」など、0か1の状態を選択するために使用するコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/158316695712805eb22cd127423fa812#168316695712808d8989df908fc1efb3"/>

---

# 使用時の注意点
<columns>
	<column>
		Switchは、状態の変更が即時反映・保存される場合に使用してください。そのため、同じ画面内に「保存」ボタンなどが存在する場合には使用できません。<br>また、スペースの問題がない限り極力radioの使用を検討してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/158316695712805eb22cd127423fa812#15d31669571280ef9d94eb8812950f88"/>
	</column>
</columns>
<columns>
	<column>
		ラベルとswitchの距離に注意してください。<br>離れ過ぎていると、switchのラベルかどうかが不明瞭になります。<br>alignを右揃えにするなど、適時調整してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/158316695712805eb22cd127423fa812#165316695712800fa2bdc08d6bbc4c8e"/>
	</column>
</columns>
---

### 色について
<columns>
	<column>
		Information（青）カラーを推奨します。<br>背景との組み合わせで、使用しにくい場合のみnutral（黒）を使用してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/158316695712805eb22cd127423fa812#15d3166957128089adc5ff85098f11e9"/>
	</column>
</columns>

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/158316695712805eb22cd127423fa812#16831669571280b89c0cd3cd35275549"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { SwitchProps } from "../../src/components/Switch";
import { Switch } from "../../src/components/Switch";
import { Stack } from "../_utils/components";

export default {
  component: Switch,
  args: {
    children: "Text Label",
  },
} satisfies Meta<typeof Switch>;

type Story = StoryObj<typeof Switch>;

const ALL_SIZES: SwitchProps["size"][] = ["medium", "small"];
/**
 * Use the `size` prop of the `Switch` to change the size of it.
 */
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Switch {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_COLORS: SwitchProps["color"][] = ["neutral", "information"];
export const Color = {
  args: {
    defaultChecked: true,
  },
  render: (props) => (
    <Stack>
      {ALL_COLORS.map((color) => (
        <Switch key={color} {...props} color={color} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `disabled` prop of the `Switch` to `true` to disable it.
 */
export const Disabled = {
  render: (props) => (
    <Stack>
      <Switch {...props} disabled />
      <Switch {...props} defaultChecked disabled />
    </Stack>
  ),
} satisfies Story;

/**
 * Use the `labelPosition` prop of the `Switch` to change the position of the label.
 */
export const LabelPosition = {
  args: {
    labelPosition: "start",
  },
} satisfies Story;

/**
 * Use the `children` prop of the `Switch` to set the label. No label will be displayed
 * if the `children` prop is not provided.
 */
export const Children = {
  args: {
    children: undefined,
    "aria-label": "Label",
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
