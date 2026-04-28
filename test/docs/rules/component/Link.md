---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-807b-9648-f3267ed28ced"
category: "Navigation"
---
# Link

💡 **Linkは、ユーザーがクリックすることで他のページや別サイトに遷移させるコンポーネントです。<br>ヘルプリンクのラベルについては以下を参照してください。<br><mention-page url="https://www.notion.so/d8cb3abbbf10443b80caee2e2e5bb65d"/> **

---
▶# 👉Examples
	

---

# 使用時の注意点
<span color="red">**⚠️遷移用途でないものに使用しないでください。**</span>
<columns>
	<column>
		StandAlone（文中使用でない）はデフォルトで提供しているアイコン付きの状態をそのまま使用してください。<br>左側の(?)のアイコンにおいてはヘルプサイトへのリンクでない場合は非表示にして使用してください。
	</column>
	<column>
		
	</column>
</columns>

---

### 類似するUIについて
<columns>
	<column>
		\[もっとみる\]などの表現には[Button](/15831669571280cfb36dcf20dad20678?pvs=25#159316695712808b865ef22c64d93171)のgutterless (subtle)を使用してください。
	</column>
	<column>
		
	</column>
</columns>
---

### 別ブラウザタブで開くリンクについて
別ブラウザタブで開くリンクには、テキストの右側に専用のアイコンを記載してください。

---

### 色について
<span color="red">**⚠️StandAloneの灰色(gray)は非推奨です。使用しないでください。**</span>

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { ComponentProps } from "react";
import {
  LfArrowUpRightFromSquare,
  LfQuestionCircle,
} from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Icon } from "../../src/components/Icon";
import type { LinkProps } from "../../src/components/Text";
import { Link, Text } from "../../src/components/Text";
import { InverseContainer, Stack } from "../_utils/components";

export default {
  component: Link,
  args: {
    children: "Link",
    href: "#",
  },
} satisfies Meta<typeof Link>;

type Story = StoryObj<typeof Link>;

/**
 * The `underline` prop of the `Link` is automatically set `true` when put in `Text` unless you explicitly set it.
 */
export const Inline = {
  render: (props) => (
    <Text>
      Here is the <Link {...props} /> to the page.
    </Text>
  ),
} satisfies Story;

const ALL_COLORS: LinkProps["color"][] = [
  "information",
  "default",
  "inverse",
  "subtle",
];
/**
 * Use the `color` prop of the `Link` to change the color of it.
 */
export const Color = {
  render: (props) => (
    <Stack direction="row">
      {ALL_COLORS.map((color) => {
        const element = <Link {...props} color={color} key={color} />;
        if (color === "inverse") {
          return <InverseContainer key={color}>{element}</InverseContainer>;
        }
        return element;
      })}
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `underline` prop of the `Link` to `true` to underline it.
 */
export const Underline = {
  ...Color,
  args: {
    underline: true,
  },
} satisfies Story;

/**
 * Use the `leading` prop of the `Link` to add an icon at the beginning of it.
 */
export const Leading = {
  args: {
    leading: (
      <Icon>
        <LfQuestionCircle />
      </Icon>
    ),
  },
} satisfies Story;

/**
 * Use the `trailing` prop of the `Link` to add an icon at the end of it.
 */
export const Trailing = {
  args: {
    href: "#",
    target: "_blank",
    trailing: (
      <Icon>
        <LfArrowUpRightFromSquare />
      </Icon>
    ),
  },
} satisfies Story;

const NextLink = (props: ComponentProps<"a">) => (
  <a {...props} data-next-link />
);

export const AsChild = {
  args: {
    asChild: true,
    children: <NextLink>Link</NextLink>,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
