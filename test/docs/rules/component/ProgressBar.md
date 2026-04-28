---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80dc-b6cb-e4cdb5a57929"
category: "Status"
---
# ProgressBar

💡 **ProgressBarは、進行中のプロセスやタスクの進捗を視覚的に表示するコンポーネントです。**

---
▶# 👉Examples
	

---

# <span discussion-urls="discussion://16031669-5712-8054-8be3-001ce30dbe2a">使用時の注意点</span>
<columns>
	<column>
		ProgressBar,ProgressCircleは即時反映されるコンテンツに使用してください。<br>数十分〜数時間など長時間の待機時間になる場合EmptyStateやBannerの使用を検討してください。

	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		コンテンツ全域の表示待機中に使用してください。
		初期ロードにおいては<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		追加される要素の表示待機中には<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。

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
import type { ProgressBarProps } from "../../src/components/Progress";
import { ProgressBar } from "../../src/components/Progress";
import { Stack } from "../_utils/components";

export default {
  component: ProgressBar,
  args: {
    value: 30,
  },
} satisfies Meta<typeof ProgressBar>;

type Story = StoryObj<typeof ProgressBar>;

const ALL_SIZES: ProgressBarProps["size"][] = ["medium", "small"];
/**
 * Use the `size` prop of the `ProgressBar` to change the size of it.
 */
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <ProgressBar {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_COLORS: ProgressBarProps["color"][] = [
  "information",
  "disabled",
  "danger",
];
/**
 * Use the `color` prop of the `ProgressBar` to change the color of it.
 */
export const Color = {
  render: (props) => (
    <Stack>
      {ALL_COLORS.map((color) => (
        <ProgressBar {...props} color={color} key={color} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `value` prop of the `ProgressBar` to `undefined` to show an indeterminate progress bar.
 * Note that this is not supported in the `danger` color.
 */
export const Indeterminate = {
  ...Color,
  args: {
    value: undefined,
  },
  render: (props) => (
    <Stack>
      {(["information", "disabled"] as const).map((color) => (
        <ProgressBar {...props} color={color} key={color} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Set `ProgressBar.Label` element as the `children` prop of `ProgressBar` to show a label.
 */
export const WithLabel = {
  ...Color,
  args: {
    children: <ProgressBar.Label>Processing...</ProgressBar.Label>,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
