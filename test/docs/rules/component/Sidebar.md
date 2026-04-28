---
paths: src/**/*.{ts,tsx}
notion_page_id: "1de31669-5712-8030-a830-fed8e1b3da1f"
category: "Navigation"
---
# Sidebar

## 関連レシピ

- [サイドバー付きレイアウト](../../aegis-recipes/sidebar-layout.md)


💡 **Sidebarは、<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>の左側に設置できる常駐型のレイアウトコンポーネントです。<br>使用用途の多くはナビゲーションとして利用されますが、Actionlistなどを設置することも可能です。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/1de3166957128030a830fed8e1b3da1f#1f93166957128065b061f8e70c63a8b7"/>

---
# 使用時の注意点
figmaではSidebarの挙動はPagelayoutに含まれているので、使いはじめはPagelayputのオプションから操作するようにしてください。

---

### Open時の挙動について
<columns>
	<column>
		開いた状態でPagelayoutの上に被さるかどうかを選択することができます。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/1de3166957128030a830fed8e1b3da1f#1f9316695712807ab5b2d1ca588b70c4"/>
	</column>
</columns>
---

### PageLayoutにHeaderが含まれるかどうか
<columns>
	<column>
		使用するサービスによってPagelayoutのHeaderを使用してない場合があります。<br>[Header]のオプションをoffにすることで、Pagelayoutの要素と配置を揃えることができます。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/1de3166957128030a830fed8e1b3da1f#1f931669571280ae93abd8c88b769b36"/>
		<img src="file://{%22source%22%3A%22attachment%3Aab4b5769-000c-4a86-85cd-07996aaa7893%3A%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-21_4.11.25.png%22%2C%22permissionRecord%22%3A%7B%22table%22%3A%22block%22%2C%22id%22%3A%221f931669-5712-80c5-b871-faaca67a0814%22%2C%22spaceId%22%3A%22803260f9-e001-4840-b333-c9883e56eaf6%22%7D%7D}"/>
	</column>
</columns>

---

### ページの高さを超えるコンテンツの挙動

Sidebar内のコンテンツが画面の高さを超える場合の挙動は、Open/Closeの状態で異なります。

<columns>
	<column>
		#### Openの時
		Sidebarが開いている状態でコンテンツがはみ出る場合は、Sidebar全体を縦スクロールさせることを推奨します。`overflow`を適用してスクロールさせないことも可能ですが、ユーザビリティの観点からスクロールが望ましいです。
	</column>
	<column>
		#### Closeの時
		Sidebarが閉じている状態では、Sidebar自体はスクロールされません。コンテンツが縦幅を超えてしまう場合は、`overflow`の適用を推奨します。これにより、はみ出したメニュー項目を省略表示するなどの対応が可能になります。
	</column>
</columns>

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/1de3166957128030a830fed8e1b3da1f#1f931669571280ea95d9fcdb8adc43ed"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import {
  LfArrowUpRightFromSquare,
  LfEllipsisDot,
  LfMenu,
} from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ActionList } from "../../src/components/ActionList";
import { Avatar } from "../../src/components/Avatar";
import {
  ContentHeader,
  ContentHeaderTitle,
} from "../../src/components/ContentHeader";
import {
  Header,
  HeaderItem,
  HeaderSpacer,
  HeaderTitle,
} from "../../src/components/Header";
import { Icon } from "../../src/components/Icon";
import { Overflow, OverflowItem } from "../../src/components/Overflow";
import {
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
} from "../../src/components/PageLayout";
import { Popover } from "../../src/components/Popover";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarNavigationSeparator,
  SidebarNavigationSubTrigger,
  SidebarProvider,
  SidebarTrigger,
} from "../../src/components/Sidebar";
import { Placeholder } from "../_utils/components";

export default {
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    children: [
      <SidebarHeader key={0}>
        <SidebarTrigger />
      </SidebarHeader>,
      <SidebarBody key={1}>
        <SidebarNavigation>
          {Array.from({ length: 5 }, (_, i) => (
            <SidebarNavigationItem key={i}>
              <Popover trigger="hover" placement="right-start" strategy="fixed">
                <Popover.Anchor>
                  <SidebarNavigationSubTrigger
                    leading={
                      <Icon>
                        <LfArrowUpRightFromSquare />
                      </Icon>
                    }
                  >
                    Label {i}
                  </SidebarNavigationSubTrigger>
                </Popover.Anchor>
                <Popover.Content>
                  <Popover.Body>
                    <ActionList>
                      {Array.from({ length: 10 }, (_, i) => (
                        <ActionList.Item key={i}>
                          <ActionList.Body>Label</ActionList.Body>
                        </ActionList.Item>
                      ))}
                    </ActionList>
                  </Popover.Body>
                </Popover.Content>
              </Popover>
            </SidebarNavigationItem>
          ))}
          <SidebarNavigationSeparator />
          {Array.from({ length: 3 }, (_, i) => (
            <SidebarNavigationItem key={i}>
              <SidebarNavigationLink
                href="#"
                aria-current={i === 1 ? "page" : undefined}
                leading={
                  <Icon>
                    <LfArrowUpRightFromSquare />
                  </Icon>
                }
              >
                Label {i}
              </SidebarNavigationLink>
            </SidebarNavigationItem>
          ))}
        </SidebarNavigation>
      </SidebarBody>,
    ],
  },
  render: (props) => (
    <SidebarProvider>
      <Sidebar {...props} />
      <SidebarInset>
        <PageLayout>
          <PageLayoutContent>
            <PageLayoutBody>
              <Placeholder>Placeholder</Placeholder>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  ),
} satisfies Meta<typeof Sidebar>;

type Story = StoryObj<typeof Sidebar>;

export const Open = {
  render: (props) => (
    <SidebarProvider defaultOpen>
      <Sidebar {...props} />
      <SidebarInset>
        <PageLayout>
          <PageLayoutContent>
            <PageLayoutBody>
              <Placeholder>Placeholder</Placeholder>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  ),
} satisfies Story;

export const Subtle = {
  args: {
    variant: "subtle",
  },
} satisfies Story;

export const Behavior = {
  ...Open,
  args: {
    behavior: "push",
  },
} satisfies Story;

export const Side = {
  args: {
    side: "inline-end",
  },
  render: (props) => (
    <SidebarProvider>
      <SidebarInset>
        <PageLayout>
          <PageLayoutContent>
            <PageLayoutBody>
              <Placeholder>Placeholder</Placeholder>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
      <Sidebar {...props} />
    </SidebarProvider>
  ),
} satisfies Story;

export const BothSides = {
  render: (props) => (
    <SidebarProvider>
      <Sidebar {...props} />
      <SidebarInset>
        <SidebarProvider defaultOpen>
          <SidebarInset>
            <Header>
              <HeaderItem>
                <HeaderTitle>Title</HeaderTitle>
              </HeaderItem>
              <HeaderSpacer />
              <HeaderItem>
                <SidebarTrigger />
              </HeaderItem>
            </Header>
            <PageLayout>
              <PageLayoutContent>
                <PageLayoutBody>
                  <Placeholder>Placeholder</Placeholder>
                </PageLayoutBody>
              </PageLayoutContent>
            </PageLayout>
          </SidebarInset>
          <Sidebar side="inline-end" behavior="push" collapsible="offcanvas">
            <SidebarHeader>
              <ContentHeader trailing={<SidebarTrigger />}>
                <ContentHeaderTitle as="h2">Documents</ContentHeaderTitle>
              </ContentHeader>
            </SidebarHeader>
            <SidebarBody>
              <Placeholder>Body</Placeholder>
            </SidebarBody>
            <SidebarFooter>
              <Placeholder>Footer</Placeholder>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </SidebarInset>
    </SidebarProvider>
  ),
} satisfies Story;

export const Collapsible = {
  args: {
    collapsible: "offcanvas",
  },
  render: (props) => (
    <SidebarProvider>
      <Sidebar {...props} />
      <SidebarInset>
        <Header>
          <HeaderItem>
            <SidebarTrigger>
              <Icon>
                <LfMenu />
              </Icon>
            </SidebarTrigger>
          </HeaderItem>
          <HeaderItem>
            <HeaderTitle>Title</HeaderTitle>
          </HeaderItem>
        </Header>
        <PageLayout>
          <PageLayoutContent>
            <PageLayoutBody>
              <Placeholder style={{ height: "150vh" }}>Placeholder</Placeholder>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  ),
} satisfies Story;

export const CustomHeader = {
  args: {
    children: [
      <SidebarHeader key={0}>
        <Avatar name="Aegis" />
      </SidebarHeader>,
      <SidebarBody key={1}>
        <SidebarNavigation>
          {Array.from({ length: 5 }, (_, i) => (
            <SidebarNavigationItem key={i}>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfArrowUpRightFromSquare />
                  </Icon>
                }
              >
                Label
              </SidebarNavigationLink>
            </SidebarNavigationItem>
          ))}
          <SidebarNavigationSeparator />
          {Array.from({ length: 3 }, (_, i) => (
            <SidebarNavigationItem key={i}>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfArrowUpRightFromSquare />
                  </Icon>
                }
              >
                Label
              </SidebarNavigationLink>
            </SidebarNavigationItem>
          ))}
        </SidebarNavigation>
      </SidebarBody>,
    ],
  },
} satisfies Story;

export const WithHeader = {
  render: (props) => (
    <SidebarProvider>
      <Sidebar {...props} />
      <SidebarInset>
        <Header>
          <Header.Title>Title</Header.Title>
        </Header>
        <PageLayout>
          <PageLayoutContent>
            <PageLayoutBody>
              <Placeholder style={{ height: "150vh" }}>Placeholder</Placeholder>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  ),
} satisfies Story;

export const WithOverflow = {
  render: (props) => (
    <SidebarProvider>
      <Sidebar {...props}>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <Overflow orientation="vertical">
          {({ indexes }) => (
            <SidebarBody>
              <SidebarNavigation>
                {Array.from({ length: 9 }, (_, i) => (
                  <OverflowItem key={i}>
                    <SidebarNavigationItem>
                      <SidebarNavigationLink
                        href="#"
                        leading={
                          <Icon>
                            <LfArrowUpRightFromSquare />
                          </Icon>
                        }
                      >
                        Label {i}
                      </SidebarNavigationLink>
                    </SidebarNavigationItem>
                  </OverflowItem>
                ))}
                {indexes.length > 0 && (
                  <Popover
                    trigger="hover"
                    placement="right-end"
                    strategy="fixed"
                  >
                    <Popover.Anchor>
                      <SidebarNavigationSubTrigger
                        leading={
                          <Icon>
                            <LfEllipsisDot />
                          </Icon>
                        }
                      >
                        More
                      </SidebarNavigationSubTrigger>
                    </Popover.Anchor>
                    <Popover.Content>
                      <Popover.Body>
                        <ActionList>
                          {indexes.map((index) => (
                            <ActionList.Item key={index}>
                              <ActionList.Body
                                leading={
                                  <Icon>
                                    <LfArrowUpRightFromSquare />
                                  </Icon>
                                }
                              >
                                Label {index}
                              </ActionList.Body>
                            </ActionList.Item>
                          ))}
                        </ActionList>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover>
                )}
              </SidebarNavigation>
            </SidebarBody>
          )}
        </Overflow>
      </Sidebar>
      <SidebarInset>
        <PageLayout>
          <PageLayoutContent>
            <PageLayoutBody>
              <Placeholder>Placeholder</Placeholder>
            </PageLayoutBody>
          </PageLayoutContent>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  ),
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
