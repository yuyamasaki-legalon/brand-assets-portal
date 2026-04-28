---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8054-a798-d78c9ca67102"
category: "Navigation"
---
# SideNavigation

💡 **SideNavigationは、ナビゲーションメニューとして、異なるセクションやページに遷移する際に使用するコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/1583166957128054a798d78c9ca67102#16831669571280f09e9aef43385e6a75"/>

---

# 使用時の注意点
### 左右の扱いの違いについて
<synced_block url="https://www.notion.so/1583166957128054a798d78c9ca67102#18831669571280f58801c3a8676a5e57">
**左側で使用する場合**<br>Navilistより大きな単位の切り替えに使用します。
</synced_block>

**右側で使用する場合<br>**ツールとしての機能が入ります。

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/1583166957128054a798d78c9ca67102#168316695712805c9909dc58e46f07f9"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import {
  LfBell,
  LfLogo,
  LfMagnifyingGlass,
  LfProfile,
  LfSetting,
} from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../src/components/Avatar";
import { Badge } from "../../src/components/Badge";
import { PageLayout, PageLayoutSidebar } from "../../src/components/PageLayout";
import { SideNavigation } from "../../src/components/SideNavigation";

const meta: Meta<typeof SideNavigation> = {
  component: SideNavigation,
  args: {
    children: [
      <SideNavigation.Group key={0}>
        <SideNavigation.Item icon={LfLogo} href="#">
          Home
        </SideNavigation.Item>
        <SideNavigation.Item
          icon={LfMagnifyingGlass}
          href="#"
          aria-current="page"
        >
          Search
        </SideNavigation.Item>
      </SideNavigation.Group>,
      <SideNavigation.Group key={1}>
        <SideNavigation.Item icon={LfProfile} href="#">
          Profile
        </SideNavigation.Item>
        <SideNavigation.Item icon={LfSetting} href="#">
          Settings
        </SideNavigation.Item>
      </SideNavigation.Group>,
    ],
  },
};

export default meta;

type Story = StoryObj<typeof SideNavigation>;

/**
 * Set the `disabled` prop of `SideNavigation.Item` to `true` to disable it.
 */
export const DisabledItem: Story = {
  render: (props) => (
    <SideNavigation {...props}>
      {props.children}
      <SideNavigation.Group>
        <SideNavigation.Item icon={LfBell} href="#" disabled>
          Notifications
        </SideNavigation.Item>
      </SideNavigation.Group>
    </SideNavigation>
  ),
};

export const WithAvatarIcon: Story = {
  render: (props) => (
    <SideNavigation {...props}>
      {props.children}
      <SideNavigation.Group>
        <SideNavigation.Item icon={<Avatar name="John Doe" />} href="#">
          John Doe
        </SideNavigation.Item>
      </SideNavigation.Group>
    </SideNavigation>
  ),
};

export const WithGroupTitle = {
  render: (props) => (
    <SideNavigation {...props}>
      <SideNavigation.Group title="Title">
        <SideNavigation.Item icon={LfBell} href="#">
          Notifications
        </SideNavigation.Item>
      </SideNavigation.Group>
      {props.children}
    </SideNavigation>
  ),
} satisfies Story;

export const WithinPageLayout = {
  render: (props) => (
    <PageLayout>
      <PageLayoutSidebar>{WithGroupTitle.render(props)}</PageLayoutSidebar>
    </PageLayout>
  ),
} satisfies Story;

export const WithTrailing: Story = {
  render: (props) => (
    <SideNavigation {...props}>
      <SideNavigation.Group>
        <SideNavigation.Item
          icon={LfBell}
          href="#"
          trailing={<Badge count={100} color="subtle" />}
        >
          Notifications
        </SideNavigation.Item>
      </SideNavigation.Group>
      {props.children}
    </SideNavigation>
  ),
};
```
<!-- STORYBOOK_CATALOG_END -->
