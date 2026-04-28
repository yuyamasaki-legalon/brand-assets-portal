---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80cf-b36d-cf20dad20678"
category: "Actions"
---
# Button

💡 **Buttonは、特定の操作や処理を実行するコンポーネントです。<br><br>**ボタンのラベリングに関しては以下を参照してください。<br><mention-page url="https://www.notion.so/ce51935d1a8b4227895dc816983c0d58"/> 

---
▶# 👉Examples
	<notion-embed type="unknown" url="https://www.notion.so/15831669571280cfb36dcf20dad20678#1683166957128084abadd3bc5472b8bd" alt="figma"/>

---

# <span discussion-urls="discussion://16031669-5712-806c-9602-001c4f44110c">使用時の注意点</span>
<span color="red">**⚠️定められた色以外の変更、アウトライン追加、シャドウ追加などスタイルの上書きは禁止です。**</span>**<br>**デザイン的なインパクトがあり、確実な効果が見込まれるものに限り、許容する場合もあります。<br>その際はデザインシステムAG宛に事前に共有してください。

---
### widthについて
<columns>
	<column>
		widthを持たせないオプションを選ぶこともできますが、<br>横幅がありすぎるとボタンに見えない問題が発生します。<br>使用する場所が広い場合max-widthを設定するようにしてください。

	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/15831669571280cfb36dcf20dad20678#1653166957128005ac2fc12bc5b08eee" alt="figma"/>
	</column>
</columns>
---

### スタイルについて
**solid<br>**画面に１つとするなど、最重要操作にのみ用いてください。<br>「目立たせたい」など、視覚的効果のみを目的とした仕様は控えてください。<br>使用する画面で一番させたい操作にフォーカスして選定をしてください。**<br>**
<columns>
	<column>
		**gutterless(subtle)<br>**\[もっと見る\]ボタンなどに用いてください。<br>別ページに遷移する挙動は link \\| linkコンポーネントを利用してください。

	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/15831669571280cfb36dcf20dad20678#15d316695712809390daca43f57f9656" alt="figma"/>
	</column>
</columns>

---

### サイズについて
<columns>
	<column>
		**large**
		入力とsubmitなど、他に操作が一切ない単一カラムのページでのみ使用できます。
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/15831669571280cfb36dcf20dad20678#17c3166957128025bc5fce4ac57fd2fb" alt="figma"/>
	</column>
</columns>
**medium**<br>基本的にはデフォルトサイズであるmediumを使用してください。
**xSmall**<br>Componentのインナー用です。<br>通常使用はしないでください。

---

### <span discussion-urls="discussion://16031669-5712-8003-a3b7-001c74fab84d">アイコンについて</span>
<span color="red">**⚠️アイコンの使用はそのページの主要機能など、限られたものにだけ使用してください。<br>全てのものにつける事は作成、選定のコストがあるためです。**</span>
アイコンは左右のどちらか一つだけ使用してください。<br>使用するアイコンは主要機能を除き、<br>追加=\[+\]<br>削除=\[🗑️\]<br>のような判断がつきやすいものだけを使用するようにしてください。
基本左側にアイコンはつけてください。右側につけるものは、進行方向を示すangle等に留めてください。

---

### 色について
**neutral**<br>デフォルトの色です。

**danger**<br>復元できない操作（削除）などは必ずdanger(赤色)を使用してください。

**inverse**<br>濃い背景色の上でのみ使用する反転色です。通常使用はしないでください。

**yellow**<br>「お気に入り」「ブックマーク」など特殊な用途向けのカラーです。subtle / plain variant でのみ使用可能（solid では使用不可）。<br>⚠️ Figma 上の warning カラーとは別物です。警告・注意喚起の目的には danger を使用してください。

**disabled**<br>使用に制限はありませんが、<br>hoveredの際にdisabledである理由をPopoverで表示してください。

---

### <span discussion-urls="discussion://16031669-5712-809e-8b59-001c951be032">バッジについて</span>
<columns>
	<column>
		アイコンが使用されている場合はアイコンの上に、アイコンが使用されていない場合はアイコンの位置に表示します。

	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/15831669571280cfb36dcf20dad20678#15d3166957128093a29be50b6ad2a25c" alt="figma"/>
	</column>
</columns>

---

### Leading/Trailing オプションについて
Buttonの前後には、アイコンやTagなどの要素を配置するための `leading` および `trailing` オプションがあります。
これらのオプションを使用する際は、アクセシビリティ上の理由（Button in Buttonの状態を避けるため）、インタラクティブな要素（クリックできる要素）を配置しないようにしてください。

- **悪い例:**
  - `removable`なTag（閉じるボタン付きのTag）を`leading`/`trailing`オプションに含める。
  - ボタンやリンクとして機能する`Tag`を`leading`/`trailing`オプションに含める。

---
# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed type="unknown" url="https://www.notion.so/15831669571280cfb36dcf20dad20678#168316695712807bbedcd88ae59624d7" alt="button"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import {
  LfAngleDownMiddle,
  LfFontCase,
  LfPlusLarge,
} from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { modes } from "../../.storybook/modes";
import { Badge } from "../../src/components/Badge";
import type { ButtonProps } from "../../src/components/Button";
import { Button } from "../../src/components/Button";
import { Icon } from "../../src/components/Icon";
import { InverseContainer, Stack } from "../_utils/components";

export default {
  component: Button,
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

const ALL_VARIANTS: ButtonProps["variant"][] = [
  "solid",
  "subtle",
  "plain",
  "gutterless",
];
/**
 * Use the `variant` prop of the `Button` to change the variant of it.
 */
export const Variant = {
  render: (props) => (
    <Stack direction="row">
      {ALL_VARIANTS.map((variant) => (
        <Button {...props} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_SIZES: ButtonProps["size"][] = [
  "xLarge",
  "large",
  "medium",
  "small",
  "xSmall",
];
/**
 * Use the `size` prop of the `Button` to change the size of it.
 */
export const Size = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  render: (props) => (
    <Stack direction="row">
      {ALL_SIZES.map((size) => (
        <Button {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_COLORS: ButtonProps["color"][] = [
  "neutral",
  "danger",
  "inverse",
  "information",
  "yellow",
];
/**
 * Use the `color` prop of the `Button` to change the color of it.
 */
export const Color = {
  parameters: {
    chromatic: {
      modes: modes.theme,
    },
  },
  render: (props) => (
    <Stack>
      {ALL_COLORS.map((color) => {
        const element = (
          <Stack direction="row" key={color}>
            {ALL_VARIANTS.map((variant) => (
              <Button
                {...props}
                variant={variant}
                color={color}
                key={variant}
              />
            ))}
          </Stack>
        );
        if (color === "inverse") {
          return <InverseContainer key={color}>{element}</InverseContainer>;
        }
        return element;
      })}
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `disabled` prop of the `Button` to `true` to disable it.
 */
export const Disabled = {
  ...Variant,
  args: {
    disabled: true,
  },
} satisfies Story;

/**
 * Set the `loading` prop of the `Button` to `true` to show a loading indicator.
 * When the `loading` is `true`, `disabled` is forced to `true`.
 */
export const Loading = {
  ...Color,
  args: {
    loading: true,
    disabled: false,
  },
} satisfies Story;

/**
 * Set the `minWidth` prop of the `Button` to `wide` to make it wider.
 */
export const MinWidth = {
  args: {
    children: "A",
    minWidth: "wide",
  },
} satisfies Story;

/**
 * Use the `leading` prop of the `Button` to add any visuals at the start of it.
 * When a `Badge` is used as the `leading` prop, its `color` prop will be automatically adjusted to
 * match the `Button`'s color, unless you explicitly set it.
 */
export const Leading = {
  render: (props) => (
    <Stack direction="row">
      <Button
        {...props}
        leading={
          <Icon>
            <LfPlusLarge />
          </Icon>
        }
      />
      <Button {...props} leading={<Badge />} />
    </Stack>
  ),
} satisfies Story;

/**
 * Use the `trailing` prop of the `Button` to add any visuals at the end of it.
 */
export const Trailing = {
  args: {
    trailing: (
      <Icon>
        <LfPlusLarge />
      </Icon>
    ),
  },
} satisfies Story;

/**
 * Set the `width` prop of the `Button` to `full` to make it full width.
 */
export const Width = {
  args: {
    width: "full",
  },
} satisfies Story;

/**
 * Set the `weight` prop of the `Button` to `normal` to make it less bold.
 * Note that this is only applicable when the `variant` is `gutterless`.
 */
export const Weight = {
  args: {
    weight: "normal",
    variant: "gutterless",
    leading: (
      <Icon>
        <LfPlusLarge />
      </Icon>
    ),
    trailing: (
      <Icon>
        <LfPlusLarge />
      </Icon>
    ),
  },
} satisfies Story;

/**
 * Set the `children` prop of the `Button` blank to remove the content.
 * Provide an appropriate `aria-label` in this case to make sure the `Button` is accessible.
 */
export const WithoutContent = {
  ...Size,
  args: {
    "aria-label": "Button",
    children: undefined,
    leading: (
      <Icon>
        <LfFontCase />
      </Icon>
    ),
    trailing: (
      <Icon>
        <LfAngleDownMiddle />
      </Icon>
    ),
  },
} satisfies Story;

/**
 * Set the `aria-pressed` prop of the `Button` to `true` to make it pressed.
 */
export const Pressed = {
  ...Color,
  args: {
    "aria-pressed": true,
  },
} satisfies Story;

type AsStory = StoryObj<typeof Button<"a">>;
/**
 * You can change the component of the `Button` by using the `as` prop.
 */
export const AsAnchor = {
  ...(Variant as AsStory),
  args: {
    as: "a",
    href: "#",
  },
} satisfies AsStory;
```
<!-- STORYBOOK_CATALOG_END -->
