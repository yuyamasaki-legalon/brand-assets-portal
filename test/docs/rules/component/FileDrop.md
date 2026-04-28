---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8060-9e27-f654fde19996"
category: "Inputs"
---
# FileDrop

💡 **FileDropは、ローカルにあるファイルをアップロードするためのコンポーネントです。<br>ボタンからの選択と、直接ドロップの二つの機能を備えています。**

---
▶# 👉Examples
	

---

# <span discussion-urls="discussion://16031669-5712-80fe-84b9-001c45e20be3">使用時の注意点</span>
<columns>
	<column>
		Filedrop内のエラー表現は、アップロード中に起きるネットワークエラーなどにしか使用できません。<br>失敗理由や、リトライの表記はBannerなど、別のUIに切り替えて表現してください。

	</column>
	<column>
		
		
	</column>
</columns>

---

# AI Agent 向けルール

## 自作 div で再実装しない

ファイルアップロード UI を実装する際、破線ボーダーの `div` + `Icon` + `Text` + `Button` で自作**しないこと**。
必ず `FileDrop` コンポーネントを使用する。

## children でドロップゾーン内のテキストをカスタマイズする

ドロップゾーン内に説明テキストを表示するには **`children`** を使う。
`sub` はドロップゾーンの**外側（下部）**に表示されるため、ゾーン内テキストの用途には使えない。

```tsx
// GOOD: children でゾーン内にテキストを配置
<FileDrop accept={[".csv"]} uploadButtonTitle="ファイルを選択">
  <Text variant="body.medium" color="subtle" whiteSpace="pre-wrap" style={{ textAlign: "center" }}>
    ファイルをドロップするか{`\n`}ボタンから選択してアップロードできます。
  </Text>
</FileDrop>

// BAD: sub はゾーン外に表示される
<FileDrop sub="ファイルをドロップするか..." />
```

## icon prop でビルトインアイコンを制御する

- `icon` はデフォルト `true`（アップロードアイコンが表示される）
- children 内に `<Icon>` を自前で追加するとアイコンが**二重**になるので注意
- アイコンを非表示にする場合は `icon={false}` を指定する

## レイアウト構造（描画順）

FileDrop は内部で以下の順に描画する:

1. **icon** — ビルトインアイコン（`icon={false}` で非表示）
2. **children** — カスタムコンテンツ（説明テキスト等）
3. **uploadButtonTitle** — アップロードボタン
4. **sub** — ゾーン外の補足コンテンツ

---
# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { i18n } from "@legalforce/aegis-tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "../../src/components/Button";
import { FileDrop } from "../../src/components/FileDrop";
import { Portal } from "../../src/components/Portal";
import { Text } from "../../src/components/Text";
import { Placeholder } from "../_utils/components";

export default {
  component: FileDrop,
  args: {
    children: "Drag & drop documents to start.",
    progressLabel: "Uploading",
    processingAction: <Button>Cancel</Button>,
  },
} satisfies Meta<typeof FileDrop>;

type Story = StoryObj<typeof FileDrop>;

export const Children = {
  args: {
    children: (
      <Text whiteSpace="pre">
        {"Drag and drop your files\nto upload them to the space"}
      </Text>
    ),
  },
} satisfies Story;

/**
 * Set the `multiple` prop of `FileDrop` to `true` to allow multiple files to be selected.
 */
export const Multiple = {
  args: {
    multiple: true,
    onSelectFiles: fn(),
  },
} satisfies Story;

export const Icon = {
  args: {
    icon: false,
  },
} satisfies Story;

export const Processing = {
  args: {
    processing: true,
  },
} satisfies Story;

export const Sub = {
  args: {
    sub: <Placeholder>Placeholder</Placeholder>,
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
    multiple: true,
  },
} satisfies Story;

export const ProcessingProgress = {
  args: {
    ...Processing.args,
    progress: 30,
  },
} satisfies Story;

export const ProcessingDisabled = {
  args: {
    ...ProcessingProgress.args,
    disabled: true,
  },
} satisfies Story;

export const ProcessingError = {
  args: {
    ...ProcessingProgress.args,
    error: true,
  },
} satisfies Story;

export const ProgressLabel = {
  args: {
    ...Processing.args,
    progressLabel: (
      <>
        Uploading
        <br />
        This can take a few minutes
      </>
    ),
  },
} satisfies Story;

export const ProcessingAction = {
  args: {
    ...ProcessingError.args,
    processingAction: <Button>Retry</Button>,
  },
} satisfies Story;

export const WithinPortal = {
  args: {
    onSelectFiles: fn(),
  },
  render: (props) => (
    <Portal>
      <FileDrop {...props} />
    </Portal>
  ),
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
