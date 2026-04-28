---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Utility"
---
# VisuallyHidden

💡 **VisuallyHiddenは、視覚的に非表示にしつつスクリーンリーダーには読み上げさせるユーティリティコンポーネントです。**

---

# 使用時の注意点
（追記予定）

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "../../src/components/Text";
import { VisuallyHidden } from "../../src/components/VisuallyHidden";

export default {
  component: VisuallyHidden,
  args: {
    children: "to read more about the topic",
  },
  render: (props) => (
    <Link href="#">
      Click here
      <VisuallyHidden {...props} />
    </Link>
  ),
} satisfies Meta<typeof VisuallyHidden>;

type Story = StoryObj<typeof VisuallyHidden>;
```
<!-- STORYBOOK_CATALOG_END -->
