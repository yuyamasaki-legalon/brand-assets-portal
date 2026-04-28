---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80fb-a8bb-efb4376061d9"
category: "Content"
---
# Divider

💡 **Dividerは、区切りを表現するコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280fba8bbefb4376061d9#1683166957128044addfd671a7853bc5"/>

---

# 使用時の注意点
⚠️<span color="red">**設定された色以外の上書きは禁止です。**</span>
付近にborderのコンポーネントがない時に使用してください。<br>多用しすぎると区切りが不明瞭になることに注意してください。<br>
### border-bottomとの使い分け
frame(div)にborder-bottomとして上書きする際は以下のことに注意して行なってください。
- Dividerと同じトークンを間違えずに設定すること。
- border-bottomを設定するframe(div)にpaddingを設定しないこと。

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280fba8bbefb4376061d9#16831669571280b8876dd4a59e2cb774"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DividerProps } from "../../src/components/Divider";
import { Divider } from "../../src/components/Divider";
import { Text } from "../../src/components/Text";
import { Stack } from "../_utils/components";

const meta: Meta<DividerProps> = {
  component: Divider,
} as Meta;

export default meta;

type Story = StoryObj<DividerProps>;

/**
 * Set the `orientation` prop to `"vertical"` to render a vertical divider.
 */
export const Orientation: Story = {
  args: {
    orientation: "vertical",
  },
  render: (props) => (
    <Stack direction="row">
      <Text>Aegis</Text>
      <Divider {...props} />
      <Text>React</Text>
    </Stack>
  ),
};
```
<!-- STORYBOOK_CATALOG_END -->
