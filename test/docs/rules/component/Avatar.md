---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80a4-aca9-cc1b5aba5288"
category: "Content"
---
# Avatar

💡 **Avatarは、ユーザーの表現に使用するコンポーネントです。<br>プロフィール写真や、プロフィール画像がない場合はテキスト（ユーザー名の頭文字）が入ります。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280a4aca9cc1b5aba5288#16831669571280d69988ecdb6b267908"/>

---

# 使用時の注意点
⚠️<span color="red">**Avatar内で表示される省略ネームのフォントサイズは変更できません。**</span>

---

# Q&A
Q: {AvatarをマウスホバーしてTooltipを表示する挙動は許容されますか？}
A: {許容されます。}

<notion-embed url="https://www.notion.so/15831669571280a4aca9cc1b5aba5288#16831669571280efa946fd9e8db74579"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfUserQuestion } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import type { AvatarProps } from "../../src/components/Avatar";
import { Avatar } from "../../src/components/Avatar";
import { Stack } from "../_utils/components";

export default {
  component: Avatar,
  args: {
    name: "John Doe",
    src: "https://github.com/legalforce.png",
  },
} satisfies Meta<typeof Avatar>;

type Story = StoryObj<typeof Avatar>;

const ALL_SIZES: AvatarProps["size"][] = ["xSmall", "small", "medium", "large"];

/**
 * Use the `size` prop of the `Avatar` to change the size of it.
 */
export const Size = {
  args: {
    src: undefined,
  },
  render: (props) => (
    <Stack direction="row">
      {ALL_SIZES.map((size) => (
        <Avatar {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_COLORS: AvatarProps["color"][] = [
  "auto",
  "red",
  "orange",
  "teal",
  "indigo",
  "blue",
  "purple",
  "magenta",
  "subtle",
  "brand",
];
/**
 * Use the `color` prop of the `Avatar` to change the color of it.
 */
export const Color = {
  args: {
    src: undefined,
  },
  render: (props) => (
    <Stack direction="row">
      {ALL_COLORS.map((color) => (
        <Avatar {...props} color={color} key={color} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const WithIcon = {
  args: {
    name: "Deactivated User",
    src: LfUserQuestion,
  },
  render: (props) => (
    <Stack direction="row">
      {ALL_SIZES.map((size) => (
        <Avatar {...props} size={size} key={size} />
      ))}
      <Avatar {...props} color="brand" />
    </Stack>
  ),
} satisfies Story;

export const WithinDisabledElement = {
  render: (props) => (
    <Stack direction="row" aria-disabled>
      <Avatar {...props} />
      <Avatar {...props} src={undefined} />
      <Avatar {...props} src={LfUserQuestion} name="Deactivated User" />
      <Avatar
        {...props}
        src={LfUserQuestion}
        name="Deactivated User"
        color="brand"
      />
    </Stack>
  ),
} satisfies Story;

type AsButtonStory = StoryObj<typeof Avatar<"button">>;

/**
 * Set the `as` prop of the `Avatar` to `"button"` to render it as a button.
 */
export const AsButton = {
  args: {
    as: "button",
    onClick: fn(),
  },
} satisfies AsButtonStory;

/**
 * When the `as` prop of the `Avatar` is set to `"button"`, you can use the `disabled` prop to disable it.
 */
export const Disabled = {
  args: {
    as: "button",
    disabled: true,
  },
  render: (props) => (
    <Stack>
      <Stack direction="row">
        <Avatar {...props} />
        {ALL_COLORS.map((color) => (
          <Avatar {...props} color={color} key={color} src={undefined} />
        ))}
      </Stack>
    </Stack>
  ),
} satisfies AsButtonStory;
```
<!-- STORYBOOK_CATALOG_END -->
