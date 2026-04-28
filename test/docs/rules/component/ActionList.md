---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8040-a87c-da05b89d1647"
category: "Navigation"
---
# ActionList

## 関連レシピ

- [アイコンメニュー](../../aegis-recipes/action-menu.md)
- [TagPicker カスタム候補 + EmptyState](../../aegis-recipes/tagpicker-custom-options.md)


💡 **ActionListは、アクションやオプションのリストをユーザーに提示するために使用するコンポーネントです。<br>Selectのカスタム候補やリスト表示など、単体での使用が主な用途です。**

---
▶# 👉Examples
	<notion-embed type="unknown" url="https://www.notion.so/1583166957128040a87cda05b89d1647#17d31669571280fabdb5cb908d494ce0" alt="figma"/>

---

# 使用時の注意点
Menuでアクションリストを表示する場合は、ActionListではなく`MenuItem`を使用してください。詳しくは<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を参照してください
PageLayoutに常駐するものとして使用する場合<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>の使用を検討してください。<br>リストの内容が固定ではなく、動的に変わる場合はこの限りではありません。

### サイズについて
mediumがデフォルトの値です。
<columns>
	<column>
		ActionListを単独で使用する場合、特に理由がなければmediumを使用してください。
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/1583166957128040a87cda05b89d1647#1653166957128070ac4bc1ba0cbb4343" alt="figma"/>
	</column>
</columns>
### <span discussion-urls="discussion://17431669-5712-808e-8f44-001cb60217e6">パターンについて</span>
<columns>
	<column>
		<notion-embed type="synced_block" url="https://www.notion.so/1583166957128040a87cda05b89d1647#17d31669571280d697ecf6f93ac71aba"/>
		ActionListは以下の６つのオプションの組み合わせが可能です。
			- Selection (Checkbox)
			- Trailing Button
			- Leading
			- Trailing
			- Multiple Body Leading (2つ目のLeading)
			- Multiple Body Trailing (2つ目のTrailing)

	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/1583166957128040a87cda05b89d1647#1743166957128084abe3e5dfbfbf86c4" alt="figma"/>
	</column>
</columns>
<columns>
	<column>
		<span color="red">**⚠️アイテムの同時使用は可能ですが、できる限り最小限のアイテム数に抑えて使用してください。**</span>
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/1583166957128040a87cda05b89d1647#174316695712802bbd64f94b01e93828" alt="figma"/>
	</column>
</columns>
<columns>
	<column>
		テキストのパターンは
		- normal
		- multiple (縦組)
		- row trailing　（横組）
		の３つから選ぶことができます。
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/1583166957128040a87cda05b89d1647#17431669571280e78e15e254d49e91eb" alt="figma"/>
	</column>
</columns>

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

<notion-embed type="unknown" url="https://www.notion.so/1583166957128040a87cda05b89d1647#168316695712800cbb77f15a8909140f" alt="button"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfInformationCircle } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import type {
  ActionListItemProps,
  ActionListProps,
} from "../../src/components/ActionList";
import {
  ActionList,
  ActionListBody,
  ActionListCaption,
  ActionListDescription,
  ActionListGroup,
  ActionListItem,
} from "../../src/components/ActionList";
import { Avatar } from "../../src/components/Avatar";
import { Badge } from "../../src/components/Badge";
import { Button } from "../../src/components/Button";
import { Icon } from "../../src/components/Icon";
import { Tag } from "../../src/components/Tag";
import { Stack } from "../_utils/components";
import { getUsers } from "../_utils/data";

const USERS = getUsers(3);
const GROUPS = [USERS.slice(0, 2), USERS.slice(2)];

export default {
  component: ActionList,
  args: {
    children: USERS.map((user) => (
      <ActionListItem key={user.id}>
        <ActionListBody>{user.name}</ActionListBody>
      </ActionListItem>
    )),
  },
} satisfies Meta<typeof ActionList>;

type Story = StoryObj<typeof ActionList>;

const ALL_SIZES: ActionListProps["size"][] = ["small", "medium", "large"];
/**
 * Use the `size` prop of the `ActionList` to change the size.
 */
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <ActionList {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const Bordered = {
  args: {
    bordered: true,
  },
} satisfies Story;

const ALL_SELECTION_TYPES: ActionListProps["selectionType"][] = [
  "single",
  "multiple",
];

export const SelectionType = {
  args: {
    selectionType: "multiple",
    children: USERS.map((user, index) => (
      <ActionListItem selected={index === 1} key={user.id}>
        <ActionListBody>{user.name}</ActionListBody>
      </ActionListItem>
    )),
  },
  render: (props) => (
    <Stack>
      {ALL_SELECTION_TYPES.map((selectionType) => (
        <ActionList
          {...props}
          selectionType={selectionType}
          key={selectionType}
        />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_COLORS: ActionListItemProps["color"][] = ["neutral", "danger"];
/**
 * Use the `color` prop of the `ActionListItem` to change the color of it.
 */
export const ItemColor = {
  args: {
    children: ALL_COLORS.map((color) => (
      <ActionListItem key={color} color={color}>
        <ActionListBody
          trailing={
            <Icon>
              <LfInformationCircle />
            </Icon>
          }
        >
          {color}
        </ActionListBody>
      </ActionListItem>
    )),
  },
} satisfies Story;

/**
 * Use the `as` prop of the `ActionListItem` to change the component to use.
 */
export const ItemAsAnchor = {
  args: {
    children: USERS.map((user) => (
      <ActionListItem as="a" href="#" key={user.id}>
        <ActionListBody>{user.name}</ActionListBody>
      </ActionListItem>
    )),
  },
} satisfies Story;

/**
 * Use the `leading` prop of the `ActionListBody` to add any visuals at the start of it.
 */
export const WithBodyLeading = {
  args: {
    children: USERS.map((user) => (
      <ActionListItem key={user.id}>
        <ActionListBody
          leading={
            <Icon>
              <LfInformationCircle />
            </Icon>
          }
        >
          {user.name}
        </ActionListBody>
      </ActionListItem>
    )),
  },
} satisfies Story;

/**
 * Use the `trailing` prop of the `ActionListBody` to add any visuals at the end of it.
 */
export const WithBodyTrailing = {
  args: {
    children: USERS.map((user) => (
      <ActionListItem key={user.id}>
        <ActionListBody
          trailing={
            <Icon>
              <LfInformationCircle />
            </Icon>
          }
        >
          {user.name}
        </ActionListBody>
      </ActionListItem>
    )),
  },
} satisfies Story;

/**
 * Use `Avatar` as the `leading` prop of the `ActionListBody`.
 * The `size` of the `Avatar` is automatically adjusted unless you explicitly set it.
 */
export const WithAvatarBodyLeading = {
  ...Size,
  args: {
    children: USERS.map((user) => (
      <ActionListItem key={user.id}>
        <ActionListBody leading={<Avatar name={user.name} />}>
          {user.name}
        </ActionListBody>
      </ActionListItem>
    )),
  },
} satisfies Story;

/**
 * You can pass multiple elements to the `leading` prop of the `ActionListBody`.
 */
export const WithMultipleBodyLeading = {
  args: {
    children: USERS.map((user) => (
      <ActionListItem key={user.id}>
        <ActionListBody
          leading={
            <>
              <Badge color="danger" />
              <Avatar name={user.name} />
            </>
          }
        >
          {user.name}
        </ActionListBody>
      </ActionListItem>
    )),
  },
} satisfies Story;

/**
 * You can pass multiple elements to the `trailing` prop of the `ActionListBody`.
 */
export const WithMultipleBodyTrailing = {
  args: {
    children: USERS.map((user) => (
      <ActionListItem key={user.id}>
        <ActionListBody
          trailing={
            <>
              <Tag>{user.country}</Tag>
              <Badge color="danger" />
            </>
          }
        >
          {user.name}
        </ActionListBody>
      </ActionListItem>
    )),
  },
} satisfies Story;

/**
 * Set the `alignItems` prop of the `ActionListBody` to `start` to align the items to the start.
 */
export const BodyAlignItems = {
  args: {
    children: USERS.map((user) => (
      <ActionListItem key={user.id}>
        <ActionListBody
          alignItems="start"
          leading={
            <>
              <Badge color="danger" />
              <Avatar name={user.name} />
            </>
          }
        >
          {user.name}
          <ActionListDescription>{user.organization}</ActionListDescription>
          <ActionListDescription>{user.bio}</ActionListDescription>
        </ActionListBody>
      </ActionListItem>
    )),
  },
} satisfies Story;

/**
 * To add a trailing button, simply put a `Button` to the `ActionListItem`.
 * The `size` and `color` of the `Button` are automatically adjusted unless you explicitly set them.
 *
 * > * This adds wider column gap than using the `trailing` prop of the `ActionListBody`.
 * > * Make sure to set `as="div"` to the `ActionListItem` to avoid having `Button` in the `button` tag.
 * > * You might want to use `e.stopPropagation()` in the Button to prevent the `ActionListItem` from being clicked when the Button is clicked.
 */
export const WithTrailingButton = {
  args: {
    children: USERS.map((user, index, users) => (
      <ActionListItem
        key={user.id}
        color={users.length - 1 === index ? "danger" : "neutral"}
        as="div"
      >
        <ActionListBody>{user.name}</ActionListBody>
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Button
        </Button>
      </ActionListItem>
    )),
  },
} satisfies Story;

/**
 * Use `ActionListGroup` to group items.
 */
export const WithGroup = {
  args: {
    children: GROUPS.map((users, index) => (
      <ActionListGroup key={index}>
        {users.map((user) => (
          <ActionListItem key={user.id}>
            <ActionListBody>{user.name}</ActionListBody>
          </ActionListItem>
        ))}
      </ActionListGroup>
    )),
  },
} satisfies Story;

/**
 * Use the `title` prop of the `ActionListGroup` to add a title to it.
 */
export const WithGroupTitle = {
  args: {
    children: GROUPS.map((users, index) => (
      <ActionListGroup title={`Group ${index}`} key={index}>
        {users.map((user) => (
          <ActionListItem key={user.id}>
            <ActionListBody>{user.name}</ActionListBody>
          </ActionListItem>
        ))}
      </ActionListGroup>
    )),
  },
} satisfies Story;

export const WithGroupSelectionType = {
  args: {
    children: GROUPS.map((users, index) => (
      <ActionListGroup
        title={`Group ${index}`}
        selectionType={index === 1 ? "multiple" : "none"}
        key={index}
      >
        {users.map((user) => (
          <ActionListItem key={user.id}>
            <ActionListBody>{user.name}</ActionListBody>
          </ActionListItem>
        ))}
      </ActionListGroup>
    )),
  },
} satisfies Story;

export const WithCaption = {
  args: {
    children: [
      <ActionListCaption key={0}>Caption</ActionListCaption>,
      <ActionListItem key={1}>
        <ActionListBody>{USERS[0]?.name}</ActionListBody>
      </ActionListItem>,
      <ActionListItem key={2}>
        <ActionListBody>{USERS[1]?.name}</ActionListBody>
      </ActionListItem>,
      <ActionListCaption key={3} size="medium">
        Caption
      </ActionListCaption>,
      <ActionListItem key={4}>
        <ActionListBody>{USERS[2]?.name}</ActionListBody>
      </ActionListItem>,
      <ActionListCaption key={5}>Caption</ActionListCaption>,
      GROUPS.map((users, index) => (
        <ActionListGroup key={index + 5}>
          {users.map((user) => (
            <ActionListItem key={user.id}>
              <ActionListBody>{user.name}</ActionListBody>
            </ActionListItem>
          ))}
        </ActionListGroup>
      )),
    ],
  },
} satisfies Story;

/**
 * Use `ActionListDescription` to put a description.
 */
export const WithDescription = {
  args: {
    children: [
      <ActionListItem key={0}>
        <ActionListBody>
          Body
          <ActionListDescription>Description</ActionListDescription>
        </ActionListBody>
      </ActionListItem>,
      <ActionListItem key={1}>
        <ActionListBody>
          <ActionListDescription>Description</ActionListDescription>
          Body
        </ActionListBody>
      </ActionListItem>,
      <ActionListItem key={2}>
        <ActionListBody
          leading={<ActionListDescription>Description</ActionListDescription>}
        >
          Body
        </ActionListBody>
      </ActionListItem>,
      <ActionListItem key={3}>
        <ActionListBody
          trailing={<ActionListDescription>Description</ActionListDescription>}
        >
          Body
        </ActionListBody>
      </ActionListItem>,
    ],
  },
} satisfies Story;

export const WithLongContent = {
  args: {
    children: [
      <ActionListGroup title={"Title".repeat(50)} key={0}>
        <ActionListItem>
          <ActionListBody>{"Body".repeat(80)}</ActionListBody>
        </ActionListItem>
      </ActionListGroup>,
    ],
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
