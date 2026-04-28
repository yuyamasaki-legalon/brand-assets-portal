---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8075-bd5e-ca937192a8fc"
category: "Feedback"
---
# Banner

## 関連レシピ

- [バナー付きフォーム（エラー/注意）](../../aegis-recipes/form-with-banner.md)


💡 **Bannerは、ページ上の重要な情報を強調表示したり、ユーザーのアクションに応じたフィードバックを伝えるコンポーネントです。**

---
▶# 👉Examples
	<notion-embed type="unknown" url="https://www.notion.so/1583166957128075bd5eca937192a8fc#16831669571280cdac54f66402f13f7e" alt="figma"/>

---

# <span discussion-urls="discussion://16031669-5712-801e-a7c6-001c0af375f3">使用時の注意点</span>
### サイズについて
<columns>
	<column>
		**large**<br>ヘッダーのすぐ下の位置で利用します。<br>そのページ内で最も注意喚起すべき内容を表示するときのみ、利用します。
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/1583166957128075bd5eca937192a8fc#164316695712808695cbfd0342788911" alt="figma"/>
	</column>
</columns>

<columns>
	<column>
		**medium**<br>メインコンテンツ内で利用します。
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/1583166957128075bd5eca937192a8fc#16431669571280af86fce5714e1e9e98" alt="figma"/>
	</column>
</columns>
**一行表示（single line）パターンについて**
Figma上には、`size: medium` のバリエーションとして、テキストが一行に収まる`single-line`パターンが存在します。これは、バナーの幅を超えたテキストを「...」で省略する挙動を想定したデザインですが、**現状Aegisコンポーネントとしては実装されておらず、Figmaのみに存在するデザインパターン**です。

<columns>
	<column>
		**small**<br>PaneやDialogの中で利用します。
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/1583166957128075bd5eca937192a8fc#164316695712802ba353eb48e97bbfd1" alt="figma"/>
	</column>
</columns>
**xSmall**<br>⚠️<span color="red">ChatUIでのみ使用する特殊サイズです。<br>基本的に使用しないでください</span>

---

### 色について
<span color="blue">**information**</span><br>進行中のプロセスやお知らせなど、知らないことがユーザーにとって致命的になりづらい情報を通知します。

<span color="green">**success**</span><span color="green"><br></span>タスクの完了、またはアクションの成功を示します。成功したことがUIで簡単に確認できない場合にのみ、利用します。

<span color="red">**danger**</span><span color="red"><br></span>エラーの発生やシステム障害を知らせるとき、不可逆な操作を行う前の確認に利用します。
また、コンテンツの詳細画面にてLargeのバナーを利用することで、そのコンテンツが通常の状態ではない（例えば削除済みの状態）であることを表現します。

<span color="yellow">**warning**</span><span color="yellow"><br></span>今後発生する可能性のある、潜在的な問題やユーザーへの影響について、警告する場合に利用します。

---
### Buttonについて
Buttonのスタイルはサイズによって変化があります。
- largeサイズのBannerではsolid
- medium, smallサイズのBannerではsubtle
エラーや警告の用途でBannerを使用する際は、次のアクションにつながるようButtonの設置を検討してください。
- 失敗した操作を取り消す
- 失敗した操作のリトライ
- 警告している対象の障害を取り除く

---

### Icon について
<span color="red">**⚠️ Banner に Icon を追加しないでください。**</span>
Banner は `color` prop に応じて適切なアイコン（information, success, warning, danger）が内部で自動的に表示されます。
children や title に `<Icon>` コンポーネントを含めると、アイコンが二重に表示されてしまいます。

---

### Bannerを閉じる操作について
**large, medium**
\[x\]のIconbuttonがデフォルトで含まれます。変更しないようにしてください。

**small**
<columns>
	<column>
		テキストありのButton（subtle）の使用を推奨します。<br>Buttonが一つだけの場合、PlainではなくSubtleを使用してください。
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/1583166957128075bd5eca937192a8fc#16431669571280de87dec35fd20e9c8f" alt="figma"/>
	</column>
</columns>

---

### サンプル
<columns>
	<column>
		**タイトルあり**
		medium
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/1583166957128075bd5eca937192a8fc#16631669571280bab614f8d168f195cb" alt="figma"/>
	</column>
</columns>
<columns>
	<column>
		**タイトルなし**
		medium

	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/1583166957128075bd5eca937192a8fc#16631669571280dabfd5c6d856ec835a" alt="figma"/>
	</column>
</columns>
<columns>
	<column>
		**タイトルなし<br>**small
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/1583166957128075bd5eca937192a8fc#166316695712801bb540e392b60dc988" alt="figma"/>
	</column>
</columns>

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

<notion-embed type="unknown" url="https://www.notion.so/1583166957128075bd5eca937192a8fc#16831669571280be84ded1940b6e63ba" alt="button"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfArrowUpRightFromSquare } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { modes } from "../../.storybook/modes";
import type { BannerProps } from "../../src/components/Banner";
import { Banner } from "../../src/components/Banner";
import { Button } from "../../src/components/Button";
import { Icon } from "../../src/components/Icon";
import { Link } from "../../src/components/Text";
import { Stack } from "../_utils/components";

export default {
  component: Banner,
  args: {
    children: [
      "Body of the banner",
      <Link
        trailing={
          <Icon>
            <LfArrowUpRightFromSquare />
          </Icon>
        }
        href="#"
        key={0}
      >
        Link
      </Link>,
    ],
  },
} satisfies Meta<typeof Banner>;

type Story = StoryObj<typeof Banner>;

const ALL_SIZES: BannerProps["size"][] = ["large", "medium", "small"];
/**
 * Use the `size` prop of the `Banner` to change the size of it.
 * Note that `large` has a different style from `medium` and `small`.
 */
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Banner {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_COLORS: BannerProps["color"][] = [
  "information",
  "success",
  "danger",
  "warning",
];
/**
 * Use the `color` prop of the `Banner` to change the color of it.
 */
export const Color = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Stack key={size}>
          {ALL_COLORS.map((color) => (
            <Banner {...props} size={size} color={color} key={color} />
          ))}
        </Stack>
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Use the `inline` prop of the `Banner` to make it inline.
 */
export const Inline = {
  args: {
    inline: true,
    action: <Button>Action</Button>,
    children: "Body of the Banner",
  },
} satisfies Story;

export const CloseButton = {
  ...Size,
  args: {
    closeButton: false,
  },
} satisfies Story;

/**
 * Use the `action` prop of the `Banner` to add an action element to it.
 */
export const Action = {
  ...Color,
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  args: {
    action: <Button>Action</Button>,
  },
} satisfies Story;

/**
 * Use the `title` prop of the `Banner` to add a title element to it.
 */
export const Title = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  args: {
    title: "Title of the banner",
    size: "medium",
  },
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Banner {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Use `Banner.ActionLabel` to add labeled action elements to the `Banner`.
 */
export const WithActionLabel = {
  args: {
    size: "medium",
    children: Array.from({ length: 3 }, (_, i) => (
      <Banner.ActionLabel key={i} action={<Link href="#">Link {i}</Link>}>
        Action Label
      </Banner.ActionLabel>
    )),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
