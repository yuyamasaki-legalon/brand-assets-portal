---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80ee-8297-e9628b8c5bc8"
category: "Content"
---
# Tag

## 関連レシピ

- [ステータス表示 + タグ](../../aegis-recipes/status-and-tags.md)


💡 **Tagは、オブジェクトの表示に使用するコンポーネントです。**<br>状態（ステータス）を表現する場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。

---
▶# 👉Examples
	

---

# 使用時の注意点
以下のような情報にtagを使用してください。
- カテゴリ
- 属性
- 情報（社名、個人名など）

⚠️<span color="red">**以下のような情報にTagは使用禁止です。StatusLabelを使用してください。**</span>
- 進行状況の表示
- システムの状態
- フィードバック
- バージョン情報

2つ以上のtagをグループとして使用する場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。

---

### 色について
オプションとして提供している色の上書きは原則禁止です。<br>基本的にfillを使用してください。<br>tagの色は使用制限はありませんが、tagのカラーはあくまで見た目を区別するために使用してください。危険を示すための赤といった機能色（参考: <mention-page url="https://www.notion.so/15a316695712806eb269c706b07ae01a"/> ）以外に、色に意味を持たせた使い方をしないでください。人間が識別可能な色の数には限りがあり、すぐに色の数が足りなくなってしまうからです。
また、危険・警告といった内容を伝えたいた場合は、 <mention-page url="https://www.notion.so/15831669571280978164c4dc21932f52"/>  を利用してください。
色に意味がある = <mention-page url="https://www.notion.so/15831669571280978164c4dc21932f52"/>
色に意味はない = <mention-page url="https://www.notion.so/15831669571280ee8297e9628b8c5bc8">Tag</mention-page>
---

### <span discussion-urls="discussion://16031669-5712-803e-ae2b-001c6d213ce1">スタイルについて</span>
fillだけでは表現に限界がある場合はoutlineの仕様も可能です。
例）<br>多くのtagが同時に表示され、見た目上区分する必要がある。など。

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfArrowUpRightFromSquare, LfTag } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../../src/components/Icon";
import type { TagProps } from "../../src/components/Tag";
import { Tag, TagLink, TagRemove } from "../../src/components/Tag";
import { InverseContainer, Stack } from "../_utils/components";

export default {
  component: Tag,
  args: {
    children: "Label",
  },
} satisfies Meta<typeof Tag>;

type Story = StoryObj<typeof Tag>;

const ALL_VARIANTS: TagProps["variant"][] = ["outline", "fill"];
export const Variant = {
  render: (props) => (
    <Stack direction="row">
      {ALL_VARIANTS.map((variant) => (
        <Tag {...props} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_COLORS: TagProps["color"][] = [
  "neutral",
  "inverse",
  "red",
  "orange",
  "yellow",
  "lime",
  "teal",
  "blue",
  "indigo",
  "purple",
  "magenta",
  "transparent",
];
export const Color = {
  render: (props) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <Stack direction="row" key={variant}>
          {ALL_COLORS.map((color) => {
            const element = (
              <Tag {...props} color={color} variant={variant} key={color} />
            );
            if (color === "inverse") {
              return <InverseContainer key={color}>{element}</InverseContainer>;
            }
            return element;
          })}
        </Stack>
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_SIZES: TagProps["size"][] = ["medium", "small"];
export const Size = {
  render: (props) => (
    <Stack direction="row">
      {ALL_SIZES.map((size) => (
        <Tag {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const Weight = {
  args: {
    weight: "bold",
  },
} satisfies Story;

export const Link = {
  ...Color,
  args: {
    children: <TagLink href="#">Label</TagLink>,
  },
} satisfies Story;

export const Pressed = {
  ...Color,
  args: {
    children: (
      <TagLink asChild>
        <button type="button" aria-pressed>
          Label
        </button>
      </TagLink>
    ),
  },
} satisfies Story;

export const Disabled = {
  ...Color,
  args: {
    children: (
      <TagLink asChild>
        <button type="button" disabled>
          Label
        </button>
      </TagLink>
    ),
  },
} satisfies Story;

export const Leading = {
  ...Size,
  args: {
    leading: (
      <Icon>
        <LfTag />
      </Icon>
    ),
  },
} satisfies Story;

export const Trailing = {
  ...Size,
  args: {
    trailing: (
      <Icon>
        <LfArrowUpRightFromSquare />
      </Icon>
    ),
  },
} satisfies Story;

export const Action = {
  ...Size,
  args: {
    action: <TagRemove />,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
