---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80d5-86c1-c185b812544d"
category: "Status"
---
# ProgressCircle

💡 **ProgressCircleは、進行中のプロセスやタスクの進捗を視覚的に表示するコンポーネントです。**

---
▶# 👉Examples
	

---

# 使用時の注意点
<columns>
	<column>
		追加される要素の表示待機中に使用します。<br>初期ロードにおいては<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。

	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		コンテンツ全域の表示待機中には<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を利用してください。
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
import type { ProgressCircleProps } from "../../src/components/Progress";
import { ProgressCircle } from "../../src/components/Progress";
import { InverseContainer, Stack } from "../_utils/components";

export default {
  component: ProgressCircle,
  args: {
    value: 30,
  },
} satisfies Meta<typeof ProgressCircle>;

type Story = StoryObj<typeof ProgressCircle>;

const ALL_COLORS: ProgressCircleProps["color"][] = ["normal", "inverse"];
export const Color = {
  render: (props) => (
    <Stack direction="row">
      {ALL_COLORS.map((color) => {
        const element = <ProgressCircle {...props} color={color} key={color} />;
        if (color === "inverse") {
          return <InverseContainer key={color}>{element}</InverseContainer>;
        }
        return element;
      })}
    </Stack>
  ),
} satisfies Story;

const ALL_SIZES: ProgressCircleProps["size"][] = [
  "xLarge",
  "large",
  "medium",
  "small",
  "xSmall",
];
export const Size = {
  render: (props) => (
    <Stack direction="row">
      {ALL_SIZES.map((size) => (
        <ProgressCircle {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const Indeterminate = {
  ...Size,
  args: {
    value: undefined,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
