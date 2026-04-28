---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Utility"
---
# FocusRing

💡 **FocusRingは、フォーカス状態を視覚的に示すユーティリティコンポーネントです。**

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
import { FocusRing } from "../../src/components/FocusRing";

const meta: Meta<typeof FocusRing> = {
  component: FocusRing,
  args: {
    children: <span tabIndex={0}>Some focusable content</span>,
  },
};

export default meta;

type Story = StoryObj<typeof FocusRing>;
```
<!-- STORYBOOK_CATALOG_END -->
