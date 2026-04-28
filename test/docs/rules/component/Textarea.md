---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8026-943b-e6872dee4834"
category: "Inputs"
---
# Textarea

💡 <span discussion-urls="discussion://16531669-5712-8050-bdf1-001c96a9205d">**Textarea**</span>**は、改行のあるテキストを入力するためのコンポーネントです。<br><br>**placeholderに関しては以下のガイドラインに従ってください。<br><mention-page url="https://www.notion.so/12a713d40d57461ca919827af7ce9f49"/>

---
▶# 👉Examples
	

---

# 使用時の注意点
このコンポーネントは単独での使用は推奨されません。ラベルやエラーキャプションを含む<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>内で使用してください。
<columns>
	<column>
		<span discussion-urls="discussion://16031669-5712-8019-a94b-001c157cdb00">文字数カウント</span>は[CountLabel](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-textarea--with-count-label&buildNumber=3277&k=67580af56f0662716dbc8abe-1200px-interactive-true&h=7&b=-5)を使用することができます。乱用はせず、200\~300文字程度の頻繁に超える可能性がある入力UIに使用してください。<br><br><br>エラーの表記はFormControlのCaptionに記載してください。
	</column>
	<column>
		
	</column>
</columns>

---

### 最小行数、最大行数について
最大行数と、最大行数を任意で変更することができます。<br>⚠️figmaでは行数指定はできず高さの指定しかできないので再現しません。

**最小行数<br>**デフォルトでは３行としていますが、適時変更することができます。
**最大行数<br>**〇〇行を超えた場合はScrollさせる。<br>などの処理ができます。適時設定してください。<br><br>それぞれの挙動は以下で確認できます。
- [**Min Rows**](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-textarea--min-rows&buildNumber=3277&k=67580af56f0662716dbc8abc-1200px-interactive-true&h=4&b=-4)
- [**Max Rows**](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-textarea--max-rows&buildNumber=3277&k=67580af56f0662716dbc8abd-1200px-interactive-true&h=5&b=-5)

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { modes } from "../../.storybook/modes";
import { FormControl } from "../../src/components/Form";
import { Textarea } from "../../src/components/Textarea";

export default {
  component: Textarea,
  args: {
    placeholder: "Type here",
  },
} satisfies Meta<typeof Textarea>;

type Story = StoryObj<typeof Textarea>;

export const Error = {
  args: {
    error: true,
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;

export const MinRows = {
  args: {
    minRows: 1,
  },
} satisfies Story;

export const MaxRows = {
  args: {
    maxRows: 5,
  },
} satisfies Story;

export const WithCountLabel = {
  render: (props) => {
    const [text, setText] = useState("");
    const max = 10;

    return (
      <Textarea
        {...props}
        value={text}
        error={text.length > max}
        trailing={<Textarea.CountLabel count={text.length} max={max} />}
        onChange={(e) => setText(e.currentTarget.value)}
      />
    );
  },
} satisfies Story;

export const ErrorWithCountLabel = {
  render: (props) => {
    const [text, setText] = useState("LongText".repeat(3));
    const max = 10;

    return (
      <Textarea
        {...props}
        value={text}
        error={text.length > max}
        trailing={<Textarea.CountLabel count={text.length} max={max} />}
        onChange={(e) => setText(e.currentTarget.value)}
      />
    );
  },
} satisfies Story;

export const WithinFormControl = {
  render: (props) => (
    <FormControl>
      <FormControl.Label>Label</FormControl.Label>
      <Textarea {...props} />
    </FormControl>
  ),
} satisfies Story;

export const WithLongText = {
  args: {
    defaultValue: "LongText".repeat(100),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
