---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-800b-bf6e-cbf89d1d36a8"
category: "Content"
---
# AvatarGroup

💡 **AvatarGroupは、複数のユーザーAvatarをまとめて表示するコンポーネントです。<br>このコンポーネントは、特定のグループやチームに属するメンバーをテーブル一覧などで表示する場面で使用します。**

---
▶# 👉Examples
	<notion-embed type="unknown" url="https://www.notion.so/158316695712800bbf6ecbf89d1d36a8#168316695712808c967bfca3ca54e08f" alt="figma"/>

---

# 使用時の注意点
特になし

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

<notion-embed type="unknown" url="https://www.notion.so/158316695712800bbf6ecbf89d1d36a8#168316695712808ca628f5e062becabe" alt="button"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { AvatarGroupProps } from "../../src/components/Avatar";
import { Avatar, AvatarGroup } from "../../src/components/Avatar";
import { Stack } from "../_utils/components";

const meta: Meta<typeof AvatarGroup> = {
  component: AvatarGroup,
  args: {
    children: [
      <Avatar name="John" key={0} />,
      <Avatar color="blue" name="Kathy" key={1} />,
      <Avatar color="purple" name="Jack" key={2} />,
      <Avatar color="teal" name="Patrick" key={3} />,
      <Avatar color="magenta" name="Taro" key={4} />,
    ],
  },
};

export default meta;

type Story = StoryObj<typeof AvatarGroup>;

const ALL_SIZES: AvatarGroupProps["size"][] = ["small", "medium", "large"];
/**
 * Set the `size` prop of the `AvatarGroup` to change the size of it.
 */
export const Size: Story = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <AvatarGroup {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
};
```
<!-- STORYBOOK_CATALOG_END -->
