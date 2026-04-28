---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Content"
---
# Logo

💡 **Logoは、ブランドロゴを表示するコンポーネントです。**

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
import * as ALL_LOGOS from "@legalforce/aegis-logos/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { LogoProps } from "../../src/components/Logo";
import { Logo } from "../../src/components/Logo";
import { InverseContainer, Stack } from "../_utils/components";

export default {
  component: Logo,
  args: {
    size: "large",
    children: <ALL_LOGOS.LegalOnLogoLight />,
  },
} satisfies Meta<typeof Logo>;

type Story = StoryObj<typeof Logo>;

const ALL_SIZES: LogoProps["size"][] = [
  "x8Large",
  "x7Large",
  "x6Large",
  "x5Large",
  "x4Large",
  "x3Large",
  "xxLarge",
];

export const Size = {
  render: (props) => (
    <Stack align="start">
      {ALL_SIZES.map((size) => (
        <Logo {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

export const All = {
  render: (props) => (
    <Stack align="start">
      {Object.entries(ALL_LOGOS).map(([name, Source]) => {
        const element = (
          <Logo {...props} key={name}>
            <Source />
          </Logo>
        );
        if (name.endsWith("Dark")) {
          return <InverseContainer key={name}>{element}</InverseContainer>;
        }
        return element;
      })}
    </Stack>
  ),
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
