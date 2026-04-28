---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80ce-b47b-c54f77c48bb0"
category: "Actions"
---
# ButtonGroup

## 関連レシピ

- [Table.ActionCell + メニュー](../../aegis-recipes/table-action-cell-menu.md)


💡 **ButtonGroupは、横並びの**<span discussion-urls="discussion://16031669-5712-80cd-a35e-001c6343baa9">**Button間のGap**</span>**が共通化されることを目的にしたグループコンポーネントです。**

---
▶# 👉Examples
	

---

# 使用時の注意点
Gapの共通化が主な目的のコンポーネントです。<br>figmaのAutolayoutで<span discussion-urls="discussion://17431669-5712-80a7-baaf-001c85436d00">ButtonGroupと同様のgapが設定されていて、エンジニアとButtonGroupを使用して実装を行うという意思疎通ができていれば、</span>Aegisライブラリのものを使用しなくても問題ありません。<br>Detachにも制限はりません。<br>ただし、frameの名称を<span color="red">**ButtonGroup**</span>としてください
仕様上横並びになるButtonの個数が可変で、２つ以上になるパターンがありうる際は、ひとつの表示を再現する場合でもButtonGroupを使用してください。
スタイルやサイズに関しては<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/> を確認してください。

---

# Q&A
Q: Button が2つ並んだときに ButtonGroup を使わないケースは存在する？
A: ない。絶対に1つの場合は Button で OK。

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfAngleDownLarge } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ButtonGroupProps } from "../../src/components/Button";
import { Button, ButtonGroup, IconButton } from "../../src/components/Button";
import { Icon } from "../../src/components/Icon";
import { InverseContainer, Stack } from "../_utils/components";

export default {
  component: ButtonGroup,
  args: {
    children: [
      ...Array.from({ length: 3 }, (_, index) => (
        <Button key={index}>Button {index}</Button>
      )),
      <IconButton key={3} aria-label="Other">
        <Icon>
          <LfAngleDownLarge />
        </Icon>
      </IconButton>,
    ],
  },
} satisfies Meta<typeof ButtonGroup>;

type Story = StoryObj<typeof ButtonGroup>;

/**
 * Use the `orientation` prop of the `ButtonGroup` to change the direction of the buttons.
 */
export const Orientation: Story = {
  args: {
    orientation: "vertical",
  },
} satisfies Story;

/**
 * Set the `fill` prop of the `ButtonGroup` to make buttons fill the available space.
 */
export const Fill: Story = {
  args: {
    fill: true,
  },
  render: (props) => (
    <Stack>
      <ButtonGroup {...props} />
      <ButtonGroup {...props} fill={false}>
        <Button fill>Button</Button>
        <Button>Button</Button>
      </ButtonGroup>
      <ButtonGroup {...props} orientation="vertical">
        <Button>Button</Button>
        <Button>Button</Button>
      </ButtonGroup>
    </Stack>
  ),
} satisfies Story;

const ALL_VARIANTS: ButtonGroupProps["variant"][] = ["solid", "subtle"];
/**
 * Use the `variant` prop of the `ButtonGroup` to change the variant of it.
 */
export const Variant: Story = {
  render: (props) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <ButtonGroup {...props} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
};

const ALL_SIZES: ButtonGroupProps["size"][] = [
  "large",
  "medium",
  "small",
  "xSmall",
];
/**
 * Use the `size` prop of the `ButtonGroup` to change the size of it.
 */
export const Size: Story = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <ButtonGroup {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
};

const ALL_COLORS: ButtonGroupProps["color"][] = [
  "neutral",
  "danger",
  "inverse",
  "information",
];
/**
 * Use the `color` prop of the `ButtonGroup` to change the color of it.
 */
export const Color: Story = {
  render: (props) => (
    <Stack>
      {ALL_COLORS.map((color) => {
        const element = <ButtonGroup {...props} color={color} key={color} />;
        if (color === "inverse") {
          return <InverseContainer key={color}>{element}</InverseContainer>;
        }
        return element;
      })}
    </Stack>
  ),
};

/**
 * Set the `attached` prop of the `ButtonGroup` to `true` to attach the buttons.
 */
export const Attached: Story = {
  args: {
    attached: true,
  },
  render: (props) => (
    <Stack>
      {ALL_COLORS.map((color) => {
        const element = (
          <Stack direction="row" key={color}>
            {ALL_VARIANTS.map((variant) => (
              <ButtonGroup
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
};
```
<!-- STORYBOOK_CATALOG_END -->
