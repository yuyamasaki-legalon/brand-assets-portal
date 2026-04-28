---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Layout"
---
# Footer

💡 **Footerは、DialogやDrawerの下部にアクションボタンを配置するコンポーネントです。**

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
import { Button, ButtonGroup } from "../../src/components/Button";
import { Footer, FooterSpacer } from "../../src/components/Footer";

export default {
  component: Footer,
  args: {
    children: [
      <Button key={0} variant="plain">
        Cancel
      </Button>,
      <FooterSpacer key={1} />,
      <ButtonGroup key={2}>
        <Button variant="subtle">Previous</Button>
        <Button>Next</Button>
      </ButtonGroup>,
    ],
  },
} satisfies Meta<typeof Footer>;

type Story = StoryObj<typeof Footer>;
```
<!-- STORYBOOK_CATALOG_END -->
