---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80a4-a270-d751e7e2a21d"
category: "Status"
---
# Badge

💡 **Badgeは、件数や通知を強調したい際のアイキャッチに使用するコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280558e2aee34ebc981e5"/>

---

# 使用時の注意点
<columns>
	<column>
		カウント（数値）以外の表記になるべく使用しないでください。
		サービス側からの通知に関するものに基本的にdanger(赤)を使用してください。
		状態を表す際は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。
		オブジェクトを表す際は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280a4a270d751e7e2a21d#1643166957128016a4b8c1ea2dd44018"/>
	</column>
</columns>

---

### アイコンにBadgeを使用する場合
Badgeはアイコンの上にCount（件数）を表示することも可能です。
その場合、フォントサイズが少し小さい表示に調整されます。（現在Figmaデータでは用意されていません）

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280a4a270d751e7e2a21d#16831669571280c09a63ce4c13013f46"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfBell } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../src/components/Avatar";
import type { BadgeProps } from "../../src/components/Badge";
import { Badge } from "../../src/components/Badge";
import { Button, IconButton } from "../../src/components/Button";
import { Icon } from "../../src/components/Icon";
import { InverseContainer, Stack } from "../_utils/components";

export default {
  component: Badge,
} satisfies Meta<typeof Badge>;

type Story = StoryObj<typeof Badge>;

const ALL_COLORS: BadgeProps["color"][] = [
  "neutral",
  "subtle",
  "danger",
  "success",
  "information",
  "warning",
  "inverse",
];
/**
 * Use the `color` prop of the `Badge` to change the color of it.
 */
export const Color = {
  render: (props) => (
    <Stack direction="row">
      {ALL_COLORS.map((color) => {
        const element = <Badge {...props} color={color} key={color} />;
        if (color === "inverse") {
          return <InverseContainer key={color}>{element}</InverseContainer>;
        }
        return element;
      })}
    </Stack>
  ),
} satisfies Story;

const ALL_MIN_SIZES: BadgeProps["minSize"][] = [
  "x4Small",
  "x3Small",
  "xxSmall",
];
/**
 * Use the `minSize` prop of the `Badge` to change the minWidth of it.
 */
export const MinSize = {
  render: (props) => (
    <Stack direction="row">
      {ALL_MIN_SIZES.map((minSize) => (
        <Badge {...props} minSize={minSize} key={minSize} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Use the `count` prop of the `Badge` to change the count of it.
 */
export const Count = {
  render: (props) => (
    <Stack direction="row">
      <Badge {...props} count={3} />
      <Badge {...props} count={20} />
      <Badge {...props} count={0} />
      <Badge {...props} count={100} />
    </Stack>
  ),
} satisfies Story;

export const Max = {
  ...Count,
  args: {
    max: 20,
  },
} satisfies Story;

/**
 * Set the `invisible` prop of the `Badge` to `true` to make it invisible.
 */
export const Invisible = {
  args: {
    invisible: true,
  },
} satisfies Story;

export const Children = {
  args: {
    color: "information",
  },
  render: (props) => (
    <Stack direction="row">
      <Badge {...props}>
        <Button>Button</Button>
      </Badge>
      <Badge {...props} count={10}>
        <Button>Button</Button>
      </Badge>
      <Badge {...props}>
        <IconButton aria-label="Notifications">
          <Icon>
            <LfBell />
          </Icon>
        </IconButton>
      </Badge>
      <Button
        variant="plain"
        leading={
          <Badge {...props}>
            <Icon>
              <LfBell />
            </Icon>
          </Badge>
        }
      >
        Button
      </Button>
      <Badge {...props}>
        <Avatar name="LegalOn Technologies" />
      </Badge>
    </Stack>
  ),
} satisfies Story;

export const Position = {
  ...Children,
  args: {
    ...Children.args,
    position: "top-start",
  },
} satisfies Story;

/**
 * When used with a disabled element which has either `disabled` or
 * `aria-disabled="true"`, the `Badge` will be disabled color.
 */
export const WithDisabledElement = {
  render: (props) => (
    <Stack direction="row">
      <div aria-disabled>
        <Badge {...props} />
      </div>
      <Button disabled leading={<Badge {...props} />}>
        Button
      </Button>
      <Badge {...props}>
        <Button disabled>Button</Button>
      </Badge>
    </Stack>
  ),
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
