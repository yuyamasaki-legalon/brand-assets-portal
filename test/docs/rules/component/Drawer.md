---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80f8-bf2e-e8f0f2fc1bc2"
category: "Layout"
---
# Drawer

## 関連レシピ

- [フィルタードロワー（フォーム）](../../aegis-recipes/filter-drawer.md)


💡 **Drawerは、スライドして出現するパネル型のコンポーネントです。**

---

# 閉じるボタンの二重実装禁止

🚫 **`Drawer.Header` は閉じるボタンを自動で提供します。`ContentHeader` の `trailing` に閉じるボタンを追加しないでください。**

## 禁止パターン（NG例）

以下のように `ContentHeader` の `trailing` に閉じるボタンを追加すると、閉じるボタンが2つ表示されてしまいます：

```tsx
// ❌ NG: 閉じるボタンが2つ表示される
<Drawer.Header color="inverse">
  <ContentHeader
    trailing={
      <Tooltip title="閉じる">
        <IconButton aria-label="閉じる" onClick={close}>  {/* ← NG: 不要 */}
          <Icon><LfCloseLarge /></Icon>
        </IconButton>
      </Tooltip>
    }
  >
    <ContentHeader.Title>契約書の要約</ContentHeader.Title>
  </ContentHeader>
</Drawer.Header>
```

**なぜ禁止か：**
- `Drawer.Header` は閉じるボタン（×）を自動で右端に表示する
- `ContentHeader` の `trailing` に閉じるボタンを追加すると、2つの閉じるボタンが並んでしまう
- ユーザーを混乱させ、UIの一貫性が損なわれる

---

# 正しい使用方法

## 基本パターン

```tsx
// ✅ OK: シンプルなタイトルのみ
<Drawer.Header>フィルター</Drawer.Header>
```

## ContentHeader と組み合わせるパターン

```tsx
// ✅ OK: ContentHeader を使う場合も trailing に閉じるボタンは不要
<Drawer.Header>
  <ContentHeader>
    <ContentHeader.Title>フィルター</ContentHeader.Title>
  </ContentHeader>
</Drawer.Header>
```

## color="inverse" を使うパターン

```tsx
// ✅ OK: 背景色を変える場合
<Drawer.Header color="inverse">
  <ContentHeader>
    <ContentHeader.Title>詳細情報</ContentHeader.Title>
  </ContentHeader>
</Drawer.Header>
```

## trailing に閉じるボタン以外を配置するパターン

閉じるボタン以外のアクション（例：リセットボタン）は `trailing` に配置可能です：

```tsx
// ✅ OK: trailing に閉じるボタン以外を配置
<Drawer.Header>
  <ContentHeader
    trailing={
      <Button variant="plain" onClick={handleReset}>
        リセット
      </Button>
    }
  >
    <ContentHeader.Title>フィルター</ContentHeader.Title>
  </ContentHeader>
</Drawer.Header>
```

---

# Template 参照先

実装例は以下を参照してください：

| ファイル | パターン |
|---------|----------|
| `src/pages/template/loc/esign/envelope-list.tsx:540-544` | ContentHeader との組み合わせ |
| `src/pages/template/loc/file-management/index.tsx:297-301` | color="inverse" |
| `src/pages/template/loc/case/index.tsx:694-698` | 基本的な使用例 |
| `src/pages/template/loc/legalon-template/index.tsx:145` | シンプルなパターン |

---

# <span discussion-urls="discussion://16031669-5712-804c-b3e4-001c7c51a380">使用時の注意点</span>
<synced_block url="https://www.notion.so/15831669571280f8bf2ee8f0f2fc1bc2#1883166957128028a539de0b1638e1ee">
	WAI-ARIAの<span discussion-urls="discussion://16031669-5712-8087-b042-001cbac50751">定義</span>上Dialogに区分されるため、Drawerが開いている状態での背景要素の操作は非推奨です。<br>背景要素の操作が必須の場合、まずPaneの使用を検討してください。
</synced_block>

---

### 使用箇所による使い分けについて
<columns>
	<column>
		<synced_block url="https://www.notion.so/15831669571280f8bf2ee8f0f2fc1bc2#17d316695712804ebbfced01e729a0e5">
			**FullScreen**<br>出現位置がWindowの角に設定されます。

			**Scoped**<br>出現位置をPageLayoutの任意のコンテンツに設定できます。
		</synced_block>

	</column>
	<column>
		
	</column>
</columns>

---
### リサイズについて
<columns>
	<column>
		Drawerには幅変更ができる[Resizable](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-drawer--resizable&buildNumber=3341&k=676a79fcc9de1d40cfb226e1-1200px-interactive-true&h=5&b=-4)オプションが存在します。<br>使用の際はmax-widthとmin-widthの値を考慮してください。
		最大は`xLarge`880px
		最小は`x5Small`240px

	</column>
	<column>
		
	</column>
</columns>

---

# Q&A
Q: \{Drawerと右paneを使い分ける基準はなんですか？Drawerは一時的な情報表示や簡単な操作をする際に使われて、右paneは画面の一部として使われるしマルチタスクに適切というLOC上の共通点を見つけましたが、もっと詳しく使い分けを定義してください。内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useRef, useState } from "react";
import { layout } from "@legalforce/aegis-tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import isChromatic from "chromatic/isChromatic";
import {
  expect,
  fn,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "storybook/test";
import { modes } from "../../.storybook/modes";
import { Button, ButtonGroup } from "../../src/components/Button";
import {
  ContentHeader,
  ContentHeaderTitle,
} from "../../src/components/ContentHeader";
import type { DrawerOptions } from "../../src/components/Drawer";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
} from "../../src/components/Drawer";
import { TextField } from "../../src/components/TextField";
import { parsePixelValue } from "../../src/utils/_parse-pixel-value";
import { Placeholder, Stack } from "../_utils/components";

const DEFAULT_OPEN = isChromatic();

export default {
  component: Drawer,
  args: {
    children: [
      <DrawerHeader key={0}>
        <ContentHeader>
          <ContentHeaderTitle>Title</ContentHeaderTitle>
        </ContentHeader>
      </DrawerHeader>,
      <DrawerBody key={1}>
        <Placeholder>Drawer</Placeholder>
      </DrawerBody>,
    ],
  },
  render: (props) => {
    const [open, setOpen] = useState(DEFAULT_OPEN);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Drawer {...props} open={open} onOpenChange={setOpen} />
      </>
    );
  },
} satisfies Meta<typeof Drawer>;

type Story = StoryObj<typeof Drawer>;

const ALL_WIDTH_OPTIONS: DrawerOptions["width"][] = [
  "xLarge",
  "large",
  "medium",
  "small",
];
/**
 * Use the `width` prop of `Drawer` to change the width of it.
 */
export const Width = {
  render: (props) => {
    const [open, setOpen] = useState(false);
    const [width, setWidth] = useState<DrawerOptions["width"]>();

    return (
      <Stack direction="row">
        {ALL_WIDTH_OPTIONS.map((width) => (
          <Button
            key={width}
            onClick={() => {
              setWidth(width);
              setOpen(true);
            }}
          >
            Open {width}
          </Button>
        ))}
        <Drawer {...props} width={width} open={open} onOpenChange={setOpen} />
      </Stack>
    );
  },
} satisfies Story;

/**
 * Set the `position` prop of `Drawer` to `"end"` to make it appear from the end.
 */
export const PositionEnd = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  args: {
    position: "end",
  },
} satisfies Story;

/**
 * Set the `position` prop of `Drawer` to `"bottom"` to make it appear from the bottom.
 */
export const PositionBottom = {
  ...PositionEnd,
  args: {
    position: "bottom",
  },
} satisfies Story;

/**
 * Use the `root` prop of `Drawer` to align the top of the `Drawer` to
 * the top of the root element.
 */
export const Scoped = {
  parameters: {
    layout: "fullscreen",
  },
  render: (props) => {
    const [open, setOpen] = useState(DEFAULT_OPEN);
    const rootRef = useRef<HTMLButtonElement>(null);

    return (
      <>
        <Placeholder>
          <Button ref={rootRef} onClick={() => setOpen(true)}>
            Open
          </Button>
          Drawer will be positioned relative to the button
        </Placeholder>
        <Drawer {...props} root={rootRef} open={open} onOpenChange={setOpen}>
          <DrawerHeader>
            <ContentHeader>
              <ContentHeaderTitle>Title</ContentHeaderTitle>
            </ContentHeader>
          </DrawerHeader>
          <DrawerBody>
            <Placeholder>Body</Placeholder>
          </DrawerBody>
          <DrawerFooter>
            <ButtonGroup>
              <Button>Button</Button>
              <Button>Button</Button>
              <Button>Button</Button>
            </ButtonGroup>
          </DrawerFooter>
        </Drawer>
      </>
    );
  },
} satisfies Story;

/**
 * Set the `lockScroll` prop of `Drawer` to `false` to allow scrolling the page.
 */
export const LockScroll = {
  args: {
    lockScroll: false,
  },
  render: (props) => {
    const [open, setOpen] = useState(DEFAULT_OPEN);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Placeholder
          style={{
            height: "150vh",
            marginBlockStart: "var(--aegis-space-medium)",
          }}
        >
          Some contents
        </Placeholder>
        <Drawer {...props} open={open} onOpenChange={setOpen}>
          <DrawerHeader>
            <ContentHeader>
              <ContentHeaderTitle>Title</ContentHeaderTitle>
            </ContentHeader>
          </DrawerHeader>
          <DrawerBody>
            <Placeholder>Body</Placeholder>
          </DrawerBody>
          <DrawerFooter>
            <ButtonGroup>
              <Button>Button</Button>
              <Button>Button</Button>
              <Button>Button</Button>
            </ButtonGroup>
          </DrawerFooter>
        </Drawer>
      </>
    );
  },
} satisfies Story;

export const WithLongBody = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  args: {
    children: [
      <DrawerHeader key={0}>
        <ContentHeader>
          <ContentHeaderTitle>Title</ContentHeaderTitle>
        </ContentHeader>
      </DrawerHeader>,
      <DrawerBody key={1}>
        <Placeholder style={{ height: "120vh" }}>Drawer</Placeholder>
      </DrawerBody>,
      <DrawerFooter key={2}>
        <ButtonGroup>
          <Button>Button</Button>
          <Button>Button</Button>
          <Button>Button</Button>
        </ButtonGroup>
      </DrawerFooter>,
    ],
  },
} satisfies Story;

export const PositionBottomWithLongBody = {
  ...WithLongBody,
  args: {
    ...WithLongBody.args,
    position: "bottom",
  },
} satisfies Story;

export const CloseOnEsc = {
  args: {
    closeOnEsc: false,
  },
} satisfies Story;

export const CloseOnOutsidePress = {
  args: {
    closeOnOutsidePress: false,
  },
} satisfies Story;

export const Modal = {
  args: {
    modal: false,
    position: "end",
  },
} satisfies Story;

export const Resizable = {
  args: {
    maxWidth: "none",
    resizable: true,
    resizeStorage: {
      get: fn(() => 300),
      set: fn(),
    },
  },
} satisfies Story;

/**
 * Set the `unmountOnExit` prop of `Drawer` to `false` to keep it
 * mounted when closed.
 */
export const UnmountOnExit = {
  args: {
    unmountOnExit: false,
    children: [
      <DrawerHeader key={0}>
        <ContentHeader>
          <ContentHeaderTitle>Title</ContentHeaderTitle>
        </ContentHeader>
      </DrawerHeader>,
      <DrawerBody key={1}>
        <TextField placeholder="Input a value" />
      </DrawerBody>,
    ],
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
