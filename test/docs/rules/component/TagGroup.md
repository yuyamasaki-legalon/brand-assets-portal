---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80ae-9cc9-dc941fc768a9"
category: "Content"
---
# TagGroup

## 関連レシピ

- [ステータス表示 + タグ](../../aegis-recipes/status-and-tags.md)


💡 **TagGroupは、TagをGroup化したコンポーネントです。<br>Gapのばらつきを抑制することが主な目的です。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280ae9cc9dc941fc768a9#1683166957128039bffbc0303e529f53"/>

---

# 使用時の注意点
<columns>
	<column>
		仕様上横並びになるTagの個数が可変で、２つ以上になるパターンがありうる際には、ひとつの表示を再現する場合でもTagGroupを使用してください。figma上で全てのトグルをoffにすると、一つだけの表示も可能です。<br>Detachしても問題ありませんが、gapは変えないでください。
	</column>
	<column>
		<img src="https://prod-files-secure.s3.us-west-2.amazonaws.com/803260f9-e001-4840-b333-c9883e56eaf6/9087e5a0-63eb-4646-bcd3-543ab14d9e19/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2024-12-23_5.25.24.png"/>
	</column>
</columns>

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280ae9cc9dc941fc768a9#168316695712804eb5d7ecdcefbdde3e"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Button } from "../../src/components/Button";
import type { TagGroupProps } from "../../src/components/Tag";
import {
  Tag,
  TagGroup,
  TagGroupLabel,
  TagLink,
} from "../../src/components/Tag";
import { Stack } from "../_utils/components";
import { getUsers } from "../_utils/data";

const USERS = getUsers(10);

export default {
  component: TagGroup,
  args: {
    children: USERS.map((user) => <Tag key={user.id}>{user.name}</Tag>),
  },
} satisfies Meta<typeof TagGroup>;

type Story = StoryObj<typeof TagGroup>;

const ALL_VARIANTS: TagGroupProps["variant"][] = ["outline", "fill"];
export const Variant = {
  render: (props) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <TagGroup {...props} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const WithLabel = {
  args: {
    children: [
      <TagGroupLabel key={0}>Label</TagGroupLabel>,
      USERS.map((user) => (
        <Tag key={user.id}>
          <TagLink asChild>
            <button type="button">{user.name}</button>
          </TagLink>
        </Tag>
      )),
      <Button key={1}>Clear</Button>,
    ],
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
