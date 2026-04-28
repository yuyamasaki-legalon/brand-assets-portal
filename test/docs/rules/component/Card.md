---
paths: src/**/*.{ts,tsx}
notion_page_id: "1b231669-5712-80c9-bd1d-dd67c923de75"
category: "Layout"
---
# Card

💡 **Cardは、任意のコンテンツをチャンク化（グループ化）して表示するためのコンポーネントです。<br>コンテンツには画像、見出し、補足テキスト、ボタン、リストなど、さまざまな要素を含めることができ、他のコンポーネントを内包することも可能です。<br>また、カード全体にクリック挙動を付与することもできます。**

---
▶# 👉Examples
	

---

# 使用時の注意点

### やってはいけないこと

**CardHeader、CardBody、CardFooter、CardLinkは必ず`<Card>`の中で使用してください。**

Card外で使用すると、以下のエラーが発生します：
> useCard must be used within a Card

```tsx
// NG: Card外でサブコンポーネントを使用
<div>
  <CardHeader>タイトル</CardHeader>
</div>

// OK: Card内でサブコンポーネントを使用
<Card>
  <CardHeader>タイトル</CardHeader>
</Card>
```

---

### 構成について
<columns>
	<column>
		<span color="green">Header</span>、<span color="red">body</span>、<span color="blue">footer</span>の3セクションに分かれています。<br><br>リストのようなUIには<span color="green">Header</span>単独で使用してください。

	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		複数の要素を入れ込む時は<span color="red">body</span>の中に入れるようにしてください。
	</column>
	<column>
		
	</column>
</columns>

---

### サイズについて
サイズはMedium<span discussion-urls="discussion://1fa31669-5712-80cf-b775-001ca9bfca69">,</span>Smallの２種類あります。<br>コンテンツの分量において使い分けてください。
<columns>
	<column>
		**Small**
		リストのようなUIや、Card自体がクリッカブルである場合など「パーツ」に近い装いの際はSmallを使用してください。

	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		**Medium**
		内包するコンテンツが複数ある場合、またサイズが大きい場合や、グループ化が主目的な場合などはMediumを使用してください。
		htmlのSectionタグくらい（headlineとコンテンツが1つにまとまっている）のサイズ感の時にMediumを使う。
	</column>
	<column>
		
	</column>
</columns>

---

### クリック挙動について
<columns>
	<column>
		カード全体をクリックカブル要素とし扱うことができます。
	</column>
	<column>
		
	</column>
</columns>

---

### 色について
<columns>
	<column>
		outline(線)と、fill(塗り)を選ぶことができます。<br>特に使用について制限はありません。<br>適切な方を選んでください。
	</column>
	<column>
		
	</column>
</columns>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import {
  LfAngleRightMiddle,
  LfFaceMoodSmile,
} from "@legalforce/aegis-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../src/components/Button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardLink,
} from "../../src/components/Card";
import { Icon } from "../../src/components/Icon";
import { Link, Text } from "../../src/components/Text";
import { Placeholder, Stack } from "../_utils/components";

export default {
  component: Card,
  args: {
    children: [
      <CardHeader key={0}>Header</CardHeader>,
      <CardBody key={1}>
        <Placeholder>Placeholder</Placeholder>
        <Placeholder>Placeholder</Placeholder>
      </CardBody>,
      <CardFooter key={2}>
        <Button>Button</Button>
      </CardFooter>,
    ],
  },
} satisfies Meta<typeof Card>;

type Story = StoryObj<typeof Card>;

export const Size = {
  render: (args) => (
    <Stack>
      <Card {...args} size="medium" />
      <Card {...args} size="small" />
      <Card {...args} size="xSmall" />
    </Stack>
  ),
} satisfies Story;

const ALL_VARIANTS = ["outline", "fill", "plain"] as const;
export const Variant = {
  render: (args) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <Card key={variant} {...args} variant={variant} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const WithHeaderLeading = {
  args: {
    children: (
      <CardHeader
        leading={
          <Icon>
            <LfFaceMoodSmile />
          </Icon>
        }
      >
        Header
      </CardHeader>
    ),
  },
} satisfies Story;

export const WithHeaderTrailing = {
  args: {
    children: (
      <CardHeader trailing={<Button>Button</Button>}>Header</CardHeader>
    ),
  },
} satisfies Story;

export const WithLink = {
  ...Variant,
  args: {
    children: [
      <CardHeader
        key={0}
        leading={
          <Icon>
            <LfFaceMoodSmile />
          </Icon>
        }
        trailing={
          <Icon>
            <LfAngleRightMiddle />
          </Icon>
        }
      >
        <CardLink href="#">Design System</CardLink>
      </CardHeader>,
      <CardBody key={1}>
        <Text as="p">
          For more details, please refer to the <Link href="#">GitHub</Link>
        </Text>
      </CardBody>,
      <CardFooter key={2}>
        <Button>Button</Button>
      </CardFooter>,
    ],
  },
} satisfies Story;

export const LinkAsButton = {
  ...Variant,
  args: {
    children: [
      <CardHeader
        key={0}
        leading={
          <Icon>
            <LfFaceMoodSmile />
          </Icon>
        }
        trailing={
          <Icon>
            <LfAngleRightMiddle />
          </Icon>
        }
      >
        <CardLink asChild>
          <button type="button">Design System</button>
        </CardLink>
      </CardHeader>,
      <CardBody key={1}>
        <Text as="p">
          For more details, please refer to the <Link href="#">GitHub</Link>
        </Text>
      </CardBody>,
      <CardFooter key={2}>
        <Button>Button</Button>
      </CardFooter>,
    ],
  },
} satisfies Story;

export const LinkAsToggleButton = {
  args: {
    children: [
      <CardHeader
        key={0}
        leading={
          <Icon>
            <LfFaceMoodSmile />
          </Icon>
        }
        trailing={
          <Icon>
            <LfAngleRightMiddle />
          </Icon>
        }
      >
        <CardLink asChild>
          <button type="button" aria-pressed>
            Design System
          </button>
        </CardLink>
      </CardHeader>,
      <CardBody key={1}>
        <Text as="p">
          For more details, please refer to the <Link href="#">GitHub</Link>
        </Text>
      </CardBody>,
      <CardFooter key={2}>
        <Button>Button</Button>
      </CardFooter>,
    ],
  },
  render: (args) => (
    <Stack role="group">
      {ALL_VARIANTS.map((variant) => (
        <Card key={variant} {...args} variant={variant} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const NestedCardWithCardLinkButton = {
  render: (props) => (
    <Card {...props}>
      <CardHeader>Outer Card</CardHeader>
      <CardBody>
        <Text as="p">
          Hover/press the inner CardLink button; the outer card should not
          change color.
        </Text>
        <Card variant="fill" size="small">
          <CardHeader>
            <CardLink asChild>
              <button type="button">Inner Card Button</button>
            </CardLink>
          </CardHeader>
          <CardBody>
            <Text as="p">Inner card content</Text>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  ),
} satisfies Story;

export const WithinGrid = {
  args: {
    children: (
      <CardHeader
        leading={
          <Icon>
            <LfFaceMoodSmile />
          </Icon>
        }
      >
        Header
      </CardHeader>
    ),
  },
  render: (args) => (
    <div
      style={{
        display: "grid",
        gridAutoFlow: "column",
        columnGap: "var(--aegis-space-xSmall)",
        gridAutoColumns: "1fr",
      }}
    >
      <Card {...args} />
      <Card {...args} />
      <Card {...args}>
        <CardHeader
          leading={
            <Icon>
              <LfFaceMoodSmile />
            </Icon>
          }
        >
          {"Long Header ".repeat(10)}
        </CardHeader>
      </Card>
    </div>
  ),
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
