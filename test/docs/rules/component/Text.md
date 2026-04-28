---
paths: src/**/*.{ts,tsx}
category: "Typography"
---
# Text

## 関連レシピ

- [省略テキスト + Tooltip](../../aegis-recipes/overflow-tooltip.md)


**Text は、スタイル付きテキストを表示するコンポーネントです。**

variant prop で文字スタイルを指定しますが、TypeScript の型定義が緩いため、存在しない variant を指定してもコンパイルエラーになりません。

---

# 使用時の注意点

<span color="red">**variant は推測で使用しないこと。必ずこのドキュメントまたは MCP ツールで確認すること。**</span>

存在しない variant（例: `title.xLarge`）を指定すると、ランタイムで静かに失敗し、スタイルが適用されません。

---

## Variant 完全リスト

### カテゴリ別サイズ一覧

| カテゴリ | 利用可能なサイズ | .bold 修飾子 |
|---------|------------------|-------------|
| title | x3Small, xxSmall, xSmall, small, medium, large | ✗ なし |
| body | xSmall, small, semiSmall, medium, large, xLarge, xxLarge | ✓ あり |
| label | small, medium, large | ✓ あり |
| data | small, medium | ✓ あり |
| component | xxSmall, xSmall, small, medium, large | ✓ あり |
| caption | xSmall, small, medium | ✗ なし |
| document.title | xSmall, small, medium | ✗ なし |
| document.body.serif | small, medium, large | ✓ あり |
| document.body.sans | small, medium, large | ✓ あり |

### 記法

```tsx
// 基本形: カテゴリ.サイズ
<Text variant="body.medium">テキスト</Text>

// bold 修飾子付き（body, label, data, component のみ）
<Text variant="body.medium.bold">太字テキスト</Text>
```

---

## カテゴリの使い分け

### title
見出しやページタイトルに使用。最大サイズは `large`、最小は `x3Small`。

### body
本文テキストに使用。最もサイズバリエーションが豊富（xxLarge まで）。`semiSmall` サイズもあり。

### label
フォームラベルや小さな注釈に使用。サイズは small, medium, large の 3 種類。

### data
数値データや統計表示に使用。サイズは small, medium の 2 種類のみ。

### component
コンポーネント内部で使用。xxSmall から large まで。.bold 修飾子あり。

### caption
キャプションテキストに使用。サイズは xSmall, small, medium の 3 種類。.bold なし。

### document.title
ドキュメント用タイトル。サイズは xSmall, small, medium の 3 種類。.bold なし。

### document.body.serif / document.body.sans
ドキュメント用本文（セリフ体/サンセリフ体）。サイズは small, medium, large の 3 種類。.bold あり。

---

## よくある間違い

| 間違い | 正しい代替 | 理由 |
|--------|-----------|------|
| `title.xLarge` | `title.large` または `body.xLarge` | title の最大は large |
| `title.xxLarge` | `title.large` または `body.xxLarge` | title に xxLarge はない |
| `title.medium.bold` | `title.medium`（bold なし）または `body.medium.bold` | title には .bold 修飾子がない |
| `component.xLarge` | `body.xLarge` | component の最大は large |
| `data.large` | `data.medium` | data のサイズは small, medium のみ |
| `label.xSmall` | `label.small` | label のサイズは small, medium, large のみ |

---

## color prop

Text の色は `color` prop で指定します。主な値:

- `default` - デフォルトのテキスト色
- `bold` - 強調色
- `subtle`, `subtler`, `xSubtle` - 薄い色
- `disabled` - 無効状態の色
- `danger` - エラー・警告
- `inverse` - 反転色（暗い背景用）
- `inherit` - 親要素から継承（デフォルト）

---

## as prop

Text のレンダリング要素を指定します:

```tsx
<Text as="h1" variant="title.large">見出し</Text>
<Text as="p" variant="body.medium">段落テキスト</Text>
<Text as="time" variant="data.small">2024-01-01</Text>
```

利用可能な値: `span`（デフォルト）, `p`, `h1`-`h6`, `time`, `code`

---

# Q&A

Q: 大きな見出しを作りたいが title.large では足りない
A: `body.xLarge` または `body.xxLarge` を使用してください。title カテゴリは意図的にサイズ上限が設けられています。

Q: bold にしたいが .bold 修飾子がない
A: title, caption, document.title カテゴリには .bold がありません。body, label, data, component を使用するか、CSS で font-weight を調整してください（非推奨）。

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TextProps } from "../../src/components/Text";
import { Link, Text } from "../../src/components/Text";
import { Stack } from "../_utils/components";

export default {
  component: Text,
  args: {
    children: [
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_+",
      <br key={0} />,
      "Whereas recognition of the inherent dignity and of the equal and inalienable rights of all members of the human family is the foundation of freedom, justice and peace in the world.",
    ],
  },
} satisfies Meta<typeof Text>;

type Story = StoryObj<typeof Text>;

/**
 * Use the `color` prop of the `Text` to change the color of it.
 */
export const Color = {
  render: (props) => (
    <Stack>
      <Text {...props} color="bold" />
      <Text {...props} color="subtle" />
      <Text {...props} color="information" />
      <Text {...props} color="warning" />
      <Text {...props} color="danger" />
    </Stack>
  ),
} satisfies Story;

/**
 * Use the `numberOfLines` prop of the `Text` to change the number of lines of it.
 */
export const NumberOfLines = {
  args: {
    numberOfLines: 1,
  },
} satisfies Story;

/**
 * Use the `whiteSpace` prop of the `Text` to change the white space of it.
 */
export const WhiteSpace = {
  args: {
    whiteSpace: "pre-wrap",
    children: "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz",
  },
} satisfies Story;

const ALL_VARIANTS: TextProps["variant"][] = [
  "title.large",
  "title.medium",
  "title.small",
  "title.xSmall",
  "title.xxSmall",
  "title.x3Small",
  "document.title.medium",
  "document.title.small",
  "document.title.xSmall",
  "label.large",
  "label.large.bold",
  "label.medium",
  "label.medium.bold",
  "label.small",
  "label.small.bold",
  "body.xxLarge",
  "body.xxLarge.bold",
  "body.xLarge",
  "body.xLarge.bold",
  "body.large",
  "body.large.bold",
  "body.medium",
  "body.medium.bold",
  "body.semiSmall",
  "body.semiSmall.bold",
  "body.small",
  "body.small.bold",
  "body.xSmall",
  "body.xSmall.bold",
  "document.body.serif.large",
  "document.body.serif.large.bold",
  "document.body.serif.medium",
  "document.body.serif.medium.bold",
  "document.body.serif.small",
  "document.body.serif.small.bold",
  "document.body.sans.large",
  "document.body.sans.large.bold",
  "document.body.sans.medium",
  "document.body.sans.medium.bold",
  "document.body.sans.small",
  "document.body.sans.small.bold",
  "caption.medium",
  "caption.small",
  "caption.xSmall",
  "data.medium",
  "data.medium.bold",
  "data.small",
  "data.small.bold",
  "component.large",
  "component.large.bold",
  "component.medium",
  "component.medium.bold",
  "component.small",
  "component.small.bold",
  "component.xSmall",
  "component.xSmall.bold",
  "component.xxSmall",
  "component.xxSmall.bold",
];
/**
 * Use the `variant` prop of the `Text` to change the variant of it.
 */
export const Variant = {
  render: ({ children, ...rest }) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <Text {...rest} variant={variant} key={variant}>
          {variant}
          <br />
          {children}
        </Text>
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Use the `Link` component inside the `Text` component.
 * The color and underline of the `Link` will be set automatically according to the `Text`'s variant.
 */
export const WithLink = {
  render: ({ ...rest }) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <Text {...rest} variant={variant} key={variant}>
          {variant}: <Link href="#">Link</Link>
        </Text>
      ))}
    </Stack>
  ),
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
