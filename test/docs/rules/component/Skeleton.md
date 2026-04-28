---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-802a-96b7-d6a060d3484c"
category: "Content"
---
# Skeleton

💡 **Skeletonは、ページの初期読み込みに使用されるコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/158316695712802a96b7d6a060d3484c#16831669571280d396f7d2d1b21e2042"/>

---

# 使用時の注意点
初期読み込みではないローディングには<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>や、<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。
※リロードも初期読み込みとする

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/158316695712802a96b7d6a060d3484c#16831669571280e18d36ef52546a5f19"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../src/components/Avatar";
import { Skeleton } from "../../src/components/Skeleton";
import { Toolbar, ToolbarSpacer } from "../../src/components/Toolbar";
import { Stack } from "../_utils/components";

export default {
  component: Skeleton,
  args: {
    width: "100%",
    height: "5em",
  },
} satisfies Meta<typeof Skeleton>;

type Story = StoryObj<typeof Skeleton>;

/**
 * Use `Skeleton.Text` to represent lines of text.
 */
export const Text = {
  render: (_) => (
    <Stack>
      <Skeleton.Text />
      <Skeleton.Text variant="title.large" />
      <Skeleton.Text numberOfLines={2} />
      <Skeleton.Text numberOfLines={2} align="center" />
      <Skeleton.Text numberOfLines={3} width="large" />
    </Stack>
  ),
} satisfies Story;

const ALL_BUTTON_SIZES = [
  "xSmall",
  "small",
  "medium",
  "large",
  "xLarge",
] as const;
/**
 * Use `Skeleton.Button` to represent buttons or similar components.
 */
export const Button = {
  render: (_) => (
    <Stack>
      {ALL_BUTTON_SIZES.map((size) => (
        <Skeleton.Button key={size} size={size} />
      ))}
      <Toolbar>
        <Skeleton.Button width="medium" />
        <ToolbarSpacer />
        <Skeleton.Button width="small" />
      </Toolbar>
    </Stack>
  ),
} satisfies Story;

/**
 * Use `Skeleton.Table` to represent tables.
 */
export const Table = {
  render: (_) => <Skeleton.Table />,
} satisfies Story;

/**
 * Use `Skeleton` to create a custom shape.
 */
export const CustomShape = {
  render: (props) => (
    <Stack>
      <Skeleton {...props} width="100%" height="5em" />
      <Skeleton {...props} radius="full" width={undefined} height={undefined}>
        <Avatar name={undefined} />
      </Skeleton>
    </Stack>
  ),
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
