---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80f3-9b7f-c714aa7a097f"
category: "Buttons"
---
# IconButton

## 関連レシピ

- [Table.ActionCell + メニュー](../../aegis-recipes/table-action-cell-menu.md)
- [アイコンメニュー](../../aegis-recipes/action-menu.md)


💡 **IconButtonは、特定の操作や処理を実行するコンポーネントです。**<br>Tooltipの内容については以下のガイドラインを参照してください。<br><mention-page url="https://www.notion.so/12731669571280babaa7dafd76a30e3b"/> <br>
IconButtonにはTooltipが必須です。
<synced_block url="https://www.notion.so/15831669571280f39b7fc714aa7a097f#17d316695712808fa9fec176856166f9">
figmaではオプションとしてTooltipのOn/Offを含んでいます。
<img src="https://prod-files-secure.s3.us-west-2.amazonaws.com/803260f9-e001-4840-b333-c9883e56eaf6/41c36586-1015-43d5-9947-1bf929938ec6/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2024-12-16_15.43.23.png"/>
</synced_block>
---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280f39b7fc714aa7a097f#16831669571280929fbfdb42b3a68b65"/>

---

# 使用時の注意点
⚠️<span color="red">**スペースに制限がある場合を除き、IconButtonはなるべく使用しないでください。<br>**</span>もともとComponent内に設置されていない箇所にIconButtonを使用する場合は、ButtonGroupやToolbarなどボタン群である場合に限ります。単独で使用すると、ボタンに見えづらくなります。
⚠️<span color="red">**定められた色以外の変更、アウトライン追加、シャドウ追加などスタイルの上書きは禁止です。<br>**</span>ただしデザインザイン的なインパクトがあり、確実な効果が見込まれるものに限り、許容する場合もあります。<br>その際はデザインシステムAG宛に事前に共有してください。
⚠️<span color="red">**Dialog,Drawer,PopoverなどAegisから提供されているコンポーネントにデフォルトで含まれているIconButtonのスタイルやサイズの変更は禁止です。**</span><br>例）[x], [<] など

---

### スタイルについて
**solid<br>**画面に１つとするなど、最重要操作にのみ用いてください。<br>「目立たせたい」など、視覚的効果のみを目的とした使用は控えてください。<br>使用する画面で一番させたい操作にフォーカスして選定をしてください。
ただし、最重要操作にアイコンボタンを用いるケースはかなり特定の状況に限られるため、あまり想定はしていません。

---

### サイズについて
**medium<br>**基本的にはデフォルトサイズであるmediumを使用してください。

**xSmall<br>**Componentのインナー用です。<br>通常使用はしないでください。

---

### 色について
**neutral<br>**デフォルトの色です。

**danger<br>**復元できない操作（削除）などは必ずdanger(赤色)を使用してください。

**inverse<br>**濃い背景色の上でのみ使用する反転色です。通常使用はしないでください。

**disabled<br>**使用に制限はありませんが、<br>hoveredの際にdisabledである理由をPopoverで表示してください。

---

### バッジについて
<columns>
	<column>
		アイコンの右上、または左上に表示します。<br>詳細は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を参照
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280f39b7fc714aa7a097f#15d316695712809fa87adc7f721867a4"/>
	</column>
</columns>
<columns>
	<column>
		旧badgeオプションではButtonの右上に配置されています。<br>廃止を予定しているので使用しないでください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280f39b7fc714aa7a097f#16531669571280ec9c63d4802cf2196c"/>
	</column>
</columns>

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280f39b7fc714aa7a097f#1683166957128082aff8f7eba96ab605"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfPen } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { modes } from "../../.storybook/modes";
import type { IconButtonProps } from "../../src/components/Button";
import { IconButton } from "../../src/components/Button";
import { Icon } from "../../src/components/Icon";
import { InverseContainer, Stack } from "../_utils/components";

export default {
  component: IconButton,
  args: {
    "aria-label": "Edit",
    children: (
      <Icon>
        <LfPen />
      </Icon>
    ),
  },
} satisfies Meta<typeof IconButton>;

type Story = StoryObj<typeof IconButton>;

const ALL_VARIANTS: IconButtonProps["variant"][] = ["solid", "subtle", "plain"];
/**
 * Use the `variant` prop of the `IconButton` to change the variant of it.
 */
export const Variant = {
  render: (props) => (
    <Stack direction="row">
      {ALL_VARIANTS.map((variant) => (
        <IconButton {...props} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_SIZES: IconButtonProps["size"][] = [
  "xLarge",
  "large",
  "medium",
  "small",
  "xSmall",
];
/**
 * Use the `size` prop of the `IconButton` to change the size of it.
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
        <IconButton {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_COLORS: IconButtonProps["color"][] = ["neutral", "danger", "inverse"];
/**
 * Use the `color` prop of the `IconButton` to change the color of it.
 */
export const Color = {
  render: (props) => (
    <Stack>
      {ALL_COLORS.map((color) => {
        const element = (
          <Stack direction="row" key={color}>
            {ALL_VARIANTS.map((variant) => (
              <IconButton
                {...props}
                color={color}
                variant={variant}
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

export const Disabled = {
  ...Variant,
  args: {
    disabled: true,
  },
} satisfies Story;

/**
 * Set the `loading` prop of the `IconButton` to `true` to show a loading indicator.
 * When the `loading` is `true`, `disabled` is forced to `true`.
 */
export const Loading = {
  ...Color,
  args: {
    loading: true,
  },
} satisfies Story;

/**
 * Set the `aria-pressed` prop of the `IconButton` to `true` to make it pressed.
 */
export const Pressed = {
  ...Color,
  args: {
    "aria-pressed": true,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
