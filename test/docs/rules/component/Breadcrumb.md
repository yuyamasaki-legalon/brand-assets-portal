---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80b6-a7b5-d90f6f10a006"
category: "Navigation"
---
# Breadcrumb

💡 **Breadcrumbは、階層化されたコンテンツで、ユーザーの現在位置を視覚的に表示するコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280b6a7b5d90f6f10a006#1683166957128063867be3784efd8ed6"/>

---

# 使用時の注意点
特になし

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280b6a7b5d90f6f10a006#168316695712808ea1bbc78e04ca16f8"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import {
  LfAngleDownMiddle,
  LfInformationCircle,
} from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Breadcrumb } from "../../src/components/Breadcrumb";
import { IconButton } from "../../src/components/Button";
import { Icon } from "../../src/components/Icon";

export default {
  component: Breadcrumb,
  args: {
    children: ["Home", "Reviews", "Case #01"].map((label, index, array) => (
      <Breadcrumb.Item
        href={array.length - 1 === index ? undefined : "#"}
        key={label}
        aria-current={index === array.length - 1 ? "location" : undefined}
      >
        {label}
      </Breadcrumb.Item>
    )),
  },
} satisfies Meta<typeof Breadcrumb>;

type Story = StoryObj<typeof Breadcrumb>;

/**
 * Use the `aria-current` prop of the `Breadcrumb.Item` component to indicate
 * the current page within a set of pages.
 */

/**
 * Use `Breadcrumb.Button` to put a button in the Breadcrumb.
 */
export const WithButton = {
  args: {
    children: ["Home", "Reviews", "Case #01"].map((label, index, array) => {
      if (index === array.length - 1) {
        return (
          <Breadcrumb.Button
            aria-current="location"
            trailing={LfAngleDownMiddle}
            key={label}
          >
            {label}
          </Breadcrumb.Button>
        );
      }
      return (
        <Breadcrumb.Item href="#" key={label}>
          {label}
        </Breadcrumb.Item>
      );
    }),
  },
} satisfies Story;

export const WithItemTrailing = {
  args: {
    children: ["Home", "Reviews", "Case #01"].map((label, index, array) => (
      <Breadcrumb.Item
        href={array.length - 1 === index ? undefined : "#"}
        key={label}
        aria-current={index === array.length - 1 ? "location" : undefined}
        trailing={
          <IconButton aria-label="More information">
            <Icon>
              <LfInformationCircle />
            </Icon>
          </IconButton>
        }
      >
        {label}
      </Breadcrumb.Item>
    )),
  },
} satisfies Story;

export const Tabbable = {
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
