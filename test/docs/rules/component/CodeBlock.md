---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Content"
---
# CodeBlock

💡 **CodeBlockは、複数行のコードブロックを表示するテキストコンポーネントです。**

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
import { CodeBlock } from "../../src/components/Text";

const meta: Meta<typeof CodeBlock> = {
  component: CodeBlock,
  args: {
    children: `import { Code } from "@legalforce/aegis-react";

const Component = () => <Code>@legalforce/aegis-react</Code>;`,
  },
};

export default meta;

type Story = StoryObj<typeof CodeBlock>;

export const WithLongContent: Story = {
  args: {
    children: `import { Code } from "@legalforce/aegis-react";

const Component = () => <Code>${"Long".repeat(30)}</Code>;
`,
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
