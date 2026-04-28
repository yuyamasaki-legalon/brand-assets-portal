---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Content"
---
# Blockquote

💡 **Blockquoteは、引用文を表示するテキストコンポーネントです。**

---

# 使用時の注意点
デザインガイドラインについては [MarkupText](./MarkupText.md) も参照してください。

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Blockquote, CodeBlock } from "../../src/components/Text";

export default {
  component: Blockquote,
  args: {
    children:
      "Whereas recognition of the inherent dignity and of the equal and inalienable rights of all members of the human family is the foundation of freedom, justice and peace in the world.",
  },
} satisfies Meta<typeof Blockquote>;

type Story = StoryObj<typeof Blockquote>;

export const WithLongContent = {
  args: {
    children: "Long".repeat(50),
  },
} satisfies Story;

export const WithCodeBlock = {
  args: {
    children: (
      <CodeBlock>
        {`function hello() {
  console.log("Hello, world!");
}`}
      </CodeBlock>
    ),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
