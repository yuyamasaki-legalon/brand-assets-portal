---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Content"
---
# Code

💡 **Codeは、インラインのコードスニペットを表示するテキストコンポーネントです。**

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
import { Code } from "../../src/components/Text";

const meta: Meta<typeof Code> = {
  component: Code,
  args: {
    children: "@legalforce/aegis-react",
  },
};

export default meta;

type Story = StoryObj<typeof Code>;

export const MultipleLines: Story = {
  render: (props) => (
    <div>
      To use Aegis React components,
      <br />
      install <Code {...props} /> and its peer dependencies.
    </div>
  ),
};
```
<!-- STORYBOOK_CATALOG_END -->
