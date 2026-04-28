---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Navigation"
---
# BottomNavigation

💡 **BottomNavigationは、モバイルUIの画面下部に表示するナビゲーションコンポーネントです。**

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
import {
  LfBell,
  LfHome,
  LfMagnifyingGlass,
  LfSetting,
} from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../src/components/Badge";
import {
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationLink,
} from "../../src/components/BottomNavigation";
import { Icon } from "../../src/components/Icon";

export default {
  component: BottomNavigation,
  args: {
    children: [
      <BottomNavigationItem key={0}>
        <BottomNavigationLink
          icon={
            <Icon>
              <LfHome />
            </Icon>
          }
          href="#"
          aria-current="page"
        >
          Home
        </BottomNavigationLink>
      </BottomNavigationItem>,
      <BottomNavigationItem key={1}>
        <BottomNavigationLink
          icon={
            <Icon>
              <LfMagnifyingGlass />
            </Icon>
          }
          href="#"
        >
          Search
        </BottomNavigationLink>
      </BottomNavigationItem>,
      <BottomNavigationItem key={2}>
        <BottomNavigationLink
          icon={
            <Icon>
              <LfBell />
            </Icon>
          }
          href="#"
        >
          Notifications
        </BottomNavigationLink>
      </BottomNavigationItem>,
      <BottomNavigationItem key={3}>
        <BottomNavigationLink
          icon={
            <Icon>
              <LfSetting />
            </Icon>
          }
          href="#"
        >
          Settings
        </BottomNavigationLink>
      </BottomNavigationItem>,
    ],
  },
} satisfies Meta<typeof BottomNavigation>;

type Story = StoryObj<typeof BottomNavigation>;

export const WithBadge = {
  args: {
    children: [
      <BottomNavigationItem key={0}>
        <BottomNavigationLink
          icon={
            <Icon>
              <LfHome />
            </Icon>
          }
          href="#"
          aria-current="page"
        >
          Home
        </BottomNavigationLink>
      </BottomNavigationItem>,
      <BottomNavigationItem key={1}>
        <BottomNavigationLink
          icon={
            <Icon>
              <LfMagnifyingGlass />
            </Icon>
          }
          href="#"
        >
          Search
        </BottomNavigationLink>
      </BottomNavigationItem>,
      <BottomNavigationItem key={2}>
        <BottomNavigationLink
          icon={
            <Badge count={5}>
              <Icon>
                <LfBell />
              </Icon>
            </Badge>
          }
          href="#"
        >
          Notifications
        </BottomNavigationLink>
      </BottomNavigationItem>,
      <BottomNavigationItem key={3}>
        <BottomNavigationLink
          icon={
            <Icon>
              <LfSetting />
            </Icon>
          }
          href="#"
        >
          Settings
        </BottomNavigationLink>
      </BottomNavigationItem>,
    ],
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
