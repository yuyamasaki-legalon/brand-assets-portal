---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80e6-bee7-f2d0963313ca"
category: "Layout"
---
# PageLayout

## 関連レシピ

- [サイドバー付きレイアウト](../../aegis-recipes/sidebar-layout.md)
- [メンテナンス/エラーページの EmptyState](../../aegis-recipes/maintenance-empty-state.md)


<callout icon="💡" color="gray_bg">
	**PageLayoutは、サービス内で使用できるレイアウトパターンを網羅したコンポーネントです。**
</callout>

---
▶# 👉Examples
	<notion-embed type="unknown" url="https://www.notion.so/15831669571280e6bee7f2d0963313ca#16831669571280a58148d502d304c165" alt="figma"/>

---

# 使用時の注意点
<span color="red">**⚠️PageLayoutは絶対にスタイルの上書き・改変をしないでください。**</span>
機能の都合で修正が必要な際は必ずデザインシステムAGに共有してください。
詳しい利用方法については <mention-page url="https://www.notion.so/17c316695712808d87a6f64ddabd310d"/> を参照。

---

### コンテンツ、ページサイズについて
<columns>
	<column>
		デフォルトでは1920pxをmax幅とする広いレイアウトになっています。<br>コンテンツ量が少ない場合などは<span discussion-urls="discussion://19331669-5712-80a6-91c2-001c5836d34c">適切な</span>幅に縮小して使用してください。<br>特に文章などは、表示幅が広すぎると可読性が著しく低下します。

		*PageLayoutコンポーネントでは、画面幅いっぱいに広げる**`full`**オプションは提供していません。これは、Headerやその他コンポーネントとのデザインの一貫性を担保するためです。*
		*デフォルトの最大幅から変更したい場合は、Aegisの**`Provider`**コンポーネントが提供する**`theme`**オプションを利用して、レイアウトの最大幅を定義するCSSトークン（**`--aegis-layout-width-max`**）をプロジェクト全体で上書きすることを推奨します。*

		▶ 実装例
		以下のように、アプリケーションのルートで`Provider`をラップし、独自の`theme`を注入することで、レイアウトの最大幅を任意の値（例: `100svw`）に変更できます。

		```typescript
		// index.tsx
		import global from "@legalforce/aegis-tokens/css/global.module.css";
		import light from "@legalforce/aegis-tokens/css/color-scheme-green-light.module.css";
		import dark from "@legalforce/aegis-tokens/css/color-scheme-green-dark.module.css";
		import small from "@legalforce/aegis-tokens/css/scale-small.module.css";
		// Your own theme
		import medium from "./scale-medium.module.css";

		const theme = {
		  global,
		  colorScheme: { light, dark },
		  scale: { medium, small },
		};

		function App() {
		  return (
		    <Provider theme={theme}>
		      <TheRestOfYourApplication />
		    </Provider>
		  );
		}

		// scale-medium.module.css
		.scope { 
		  composes: scope from '@legalforce/aegis-tokens/css/scale-medium.module.css';
		  --aegis-layout-width-max: 100svw;
		}
		```
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/15831669571280e6bee7f2d0963313ca#16631669571280e1b04cd0fec1fba8ac" alt="figma"/>
	</column>
</columns>

---

<columns>
	<column>
		### 使用例

	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/15831669571280e6bee7f2d0963313ca#1733166957128004a96addcb88821303" alt="figma"/>
		<notion-embed type="unknown" url="https://www.notion.so/15831669571280e6bee7f2d0963313ca#17331669571280efa5ccf5c63838ef93" alt="figma"/>
		<notion-embed type="unknown" url="https://www.notion.so/15831669571280e6bee7f2d0963313ca#17331669571280d1973acd3dae53e939" alt="figma"/>
	</column>
</columns>


---

# Q&A
Q: PageLayoutBody の先頭にToolbar以外の要素（例：サマリー情報など）を置いても良いですか？
A: はい、問題ありません。PageLayoutBody 内の要素の順序に制約はありません。例えば、Toolbarの上にサマリー情報を配置するなど、コンテンツの構成に応じて柔軟にレイアウトしてください。
Q: \{内容を書く\}
A: \{内容を書く\}

<notion-embed type="unknown" url="https://www.notion.so/15831669571280e6bee7f2d0963313ca#168316695712807ea875ebb5ee9c02d8" alt="button"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfHome } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { Badge } from "../../src/components/Badge";
import { Button, ButtonGroup } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
} from "../../src/components/ContentHeader";
import {
  PageLayout,
  PageLayoutBleed,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  PageLayoutStickyContainer,
} from "../../src/components/PageLayout";
import { SideNavigation } from "../../src/components/SideNavigation";
import { StatusLabel } from "../../src/components/StatusLabel";
import { Table, TableContainer } from "../../src/components/Table";
import { Tag, TagGroup } from "../../src/components/Tag";
import { Text } from "../../src/components/Text";
import { Placeholder, Stack } from "../_utils/components";

export default {
  component: PageLayout,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    children: [
      <PageLayoutSidebar aria-label="Start Sidebar" key={0}>
        <Placeholder style={{ height: 200 }}>Sidebar</Placeholder>
      </PageLayoutSidebar>,
      <PageLayoutPane key={1}>
        <PageLayoutHeader>
          <Placeholder>Pane(Start):Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Pane(Start):Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Pane(Start):Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutPane>,
      <PageLayoutContent key={2}>
        <PageLayoutHeader>
          <Placeholder>Content:Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Content:Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Content:Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutContent>,
      <PageLayoutPane position="end" aria-label="End Pane" key={3}>
        <PageLayoutHeader>
          <Placeholder>Pane(End):Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Pane(End):Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Pane(End):Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutPane>,
      <PageLayoutSidebar position="end" aria-label="End Sidebar" key={4}>
        <Placeholder style={{ height: 200 }}>Sidebar</Placeholder>
      </PageLayoutSidebar>,
    ],
  },
} satisfies Meta<typeof PageLayout>;

type Story = StoryObj<typeof PageLayout>;

export const Variant = {
  args: {
    variant: "outline",
  },
} satisfies Story;

export const ScrollBehavior = {
  args: {
    scrollBehavior: "inside",
    children: [
      <PageLayoutSidebar aria-label="Start Sidebar" key={0}>
        <Placeholder style={{ height: 200 }}>Sidebar</Placeholder>
      </PageLayoutSidebar>,
      <PageLayoutPane key={1}>
        <PageLayoutHeader>
          <Placeholder>Pane(Start):Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Pane(Start):Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Pane(Start):Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutPane>,
      <PageLayoutContent key={2}>
        <PageLayoutHeader>
          <Placeholder>Content:Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder tabIndex={0} style={{ minHeight: "150vh" }}>
            Content:Body
          </Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Content:Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutContent>,
      <PageLayoutPane position="end" aria-label="End Pane" key={3}>
        <PageLayoutHeader>
          <Placeholder>Pane(End):Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Pane(End):Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Pane(End):Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutPane>,
      <PageLayoutSidebar position="end" aria-label="End Sidebar" key={4}>
        <Placeholder style={{ height: 200 }}>Sidebar</Placeholder>
      </PageLayoutSidebar>,
    ],
  },
} satisfies Story;

export const PaneVariant = {
  args: {
    children: [
      <PageLayoutPane variant="fill" key={0}>
        <PageLayoutHeader>
          <Placeholder>Pane:Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Pane:Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Pane:Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutPane>,
      <PageLayoutContent key={1}>
        <PageLayoutHeader>
          <Placeholder>Content:Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Content:Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Content:Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutContent>,
      <PageLayoutPane
        variant="outline"
        position="end"
        aria-label="End Pane"
        key={2}
      >
        <PageLayoutHeader>
          <Placeholder>Pane:Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Pane:Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Pane:Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutPane>,
    ],
  },
} satisfies Story;

/**
 * Use the `width` prop of the `PageLayoutPane` to set the width of it.
 */
export const PaneWidth = {
  args: {
    children: [
      <PageLayoutPane width="small" key={0}>
        <PageLayoutHeader>
          <Placeholder>Pane:Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Pane:Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Pane:Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutPane>,
      <PageLayoutContent key={1}>
        <PageLayoutHeader>
          <Placeholder>Content:Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Content:Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Content:Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutContent>,
    ],
  },
} satisfies Story;

/**
 * Set the `resizable` prop of the `PageLayoutPane` to make it resizable.
 */
export const PaneResizable = {
  args: {
    children: [
      <PageLayoutPane key={0} resizable>
        <PageLayoutHeader>
          <Placeholder>Pane:Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Pane:Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Pane:Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutPane>,
      <PageLayoutContent key={1}>
        <PageLayoutHeader>
          <Placeholder>Content:Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Content:Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Content:Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutContent>,
    ],
  },
};

export const ContentWidth = {
  args: {
    children: [
      <PageLayoutPane key={0} resizable>
        <PageLayoutBody>
          <Placeholder>Pane</Placeholder>
        </PageLayoutBody>
      </PageLayoutPane>,
      <PageLayoutContent key={1} minWidth="medium" maxWidth="large">
        <PageLayoutBody>
          <Placeholder>Content</Placeholder>
        </PageLayoutBody>
      </PageLayoutContent>,
    ],
  },
};

/**
 * Use `PageLayoutBleed` to cancel out inline padding from `PageLayoutHeader`, `PageLayoutBody`, or `PageLayoutFooter`.
 */
export const WithBleed = {
  args: {
    children: [
      <PageLayoutContent key={0}>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>WithBleed</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p">Default body content</Text>
          <PageLayoutBleed>
            <Placeholder>Inline padding cancelled</Placeholder>
          </PageLayoutBleed>
          <Text as="p">Default body content</Text>
        </PageLayoutBody>
      </PageLayoutContent>,
    ],
  },
} satisfies Story;

export const WithStickyContainer = {
  args: {
    children: [
      <PageLayoutContent key={0}>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Title</ContentHeaderTitle>
            <ContentHeaderDescription>Description</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <PageLayoutStickyContainer>
            <Text as="p">
              Whereas recognition of the inherent dignity and of the equal and
              inalienable rights of all members of the human family is the
              foundation of freedom, justice and peace in the world.
            </Text>
          </PageLayoutStickyContainer>
          <Placeholder style={{ minHeight: "150vh" }}>Content</Placeholder>
        </PageLayoutBody>
      </PageLayoutContent>,
    ],
  },
} satisfies Story;

export const PaneScrollBehavior = {
  args: {
    children: [
      <PageLayoutPane scrollBehavior="inside" key={0}>
        <PageLayoutHeader>
          <Placeholder>Pane:Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder tabIndex={0} style={{ minHeight: "150vh" }}>
            Pane:Body
          </Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Button variant="plain">Cancel</Button>
          <Button>Done</Button>
        </PageLayoutFooter>
      </PageLayoutPane>,
      <PageLayoutContent key={1}>
        <PageLayoutHeader>
          <Placeholder>Content:Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Content:Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Button>Submit</Button>
        </PageLayoutFooter>
      </PageLayoutContent>,
    ],
  },
} satisfies Story;

export const WithLongSidebar = {
  args: {
    children: [
      <PageLayoutSidebar key={0}>
        <SideNavigation>
          <SideNavigation.Item icon={LfHome}>
            {"Home".repeat(10)}
          </SideNavigation.Item>
        </SideNavigation>
      </PageLayoutSidebar>,
      <PageLayoutContent key={1}>
        <PageLayoutHeader>
          <Placeholder>Content:Header</Placeholder>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Content:Body</Placeholder>
        </PageLayoutBody>
        <PageLayoutFooter>
          <Placeholder>Content:Footer</Placeholder>
        </PageLayoutFooter>
      </PageLayoutContent>,
    ],
  },
} satisfies Story;

/**
 * Story to test horizontal overflow detection in PageLayout.
 * The interaction test will fail if content overflows horizontally.
 */
export const WithLongContent = {
  args: {
    children: [
      <PageLayoutContent key={0} minWidth="medium" data-testid="content">
        <PageLayoutHeader data-testid="header">
          <ContentHeader>
            <ContentHeaderTitle>
              Project Management Dashboard - Q4 2024 Review Materials (Last
              Updated: 2025/09/08 15:30)
            </ContentHeaderTitle>
            <ContentHeaderDescription>
              Story to test horizontal overflow detection in PageLayout. The
              interaction test will fail if content overflows horizontally.
              Story to test horizontal overflow detection in PageLayout. The
              interaction test will fail if content overflows horizontally.
              Story to test horizontal overflow detection in PageLayout. The
              interaction test will fail if content overflows horizontally.
            </ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody data-testid="body">
          <Text>
            ThisIsAnExtremelyLongUnbreakableWordThatWillDefinitelyCauseHorizontalOverflowInThePageLayoutContentAreaIfNotHandledProperlyThisIsAnExtremelyLongUnbreakableWordThatWillDefinitelyCauseHorizontalOverflowInThePageLayoutContentAreaIfNotHandledProperly
          </Text>
          <Card>
            <Text as="h3">Project Overview</Text>
            <Text as="p">
              ThisIsAnExtremelyLongUnbreakableWordThatWillDefinitelyCauseHorizontalOverflowInThePageLayoutContentAreaIfNotHandledProperlyThisIsAnExtremelyLongUnbreakableWordThatWillDefinitelyCauseHorizontalOverflowInThePageLayoutContentAreaIfNotHandledProperly
            </Text>
            <Text as="p">
              https://example.com/projects/2024/q4/review/dashboard/team-performance/metrics/detailed-analysis/final-report
            </Text>
          </Card>
          <Stack>
            <Text as="h3">Related Tags</Text>
            <TagGroup>
              <Tag>Project Management</Tag>
              <Tag>Q4 2024</Tag>
              <Tag>Dashboard</Tag>
              <Tag>Performance Analysis</Tag>
              <Tag>Team Management</Tag>
              <Tag>KPI Tracking</Tag>
              <Tag>Auto Report Generation</Tag>
              <Tag>Real-time Data</Tag>
              <Tag>Resource Optimization</Tag>
              <Tag>Task Auto-assignment</Tag>
              <Tag>Progress Visualization</Tag>
              <Tag>Stakeholder Ready</Tag>
            </TagGroup>
          </Stack>
          <TableContainer>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Cell as="th">ID</Table.Cell>
                  <Table.Cell as="th">
                    Project Name (Long name to test overflow)
                  </Table.Cell>
                  <Table.Cell as="th">Status</Table.Cell>
                  <Table.Cell as="th">Progress</Table.Cell>
                  <Table.Cell as="th">Due Date</Table.Cell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>PRJ-2024-001</Table.Cell>
                  <Table.Cell>
                    New Customer Management System Development and Deployment
                    (Phase 1: Requirements Definition and Basic Design)
                  </Table.Cell>
                  <Table.Cell>
                    <StatusLabel variant="fill" color="yellow">
                      In Progress
                    </StatusLabel>
                  </Table.Cell>
                  <Table.Cell>75%</Table.Cell>
                  <Table.Cell>2024/12/31</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>PRJ-2024-002</Table.Cell>
                  <Table.Cell>
                    Existing System Microservices Migration and Cloud Transition
                    Project
                  </Table.Cell>
                  <Table.Cell>
                    <StatusLabel variant="fill" color="blue">
                      Under Review
                    </StatusLabel>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge>90%</Badge>
                  </Table.Cell>
                  <Table.Cell>2024/12/25</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </TableContainer>
          <ButtonGroup>
            <Button>Create New Project</Button>
            <Button variant="subtle">Download Report</Button>
            <Button variant="subtle">Export Data</Button>
            <Button variant="subtle">Save Settings</Button>
            <Button variant="plain">Advanced Options</Button>
          </ButtonGroup>
        </PageLayoutBody>
        <PageLayoutFooter data-testid="footer">
          <ButtonGroup>
            <Button variant="plain">Go Back</Button>
            <Button variant="plain">Help</Button>
            <Button variant="subtle">Save as Draft</Button>
            <Button variant="solid">Confirm Changes and Continue</Button>
          </ButtonGroup>
        </PageLayoutFooter>
      </PageLayoutContent>,
      <PageLayoutPane key={1} position="end" width="medium" data-testid="pane">
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Details</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Placeholder>Pane</Placeholder>
        </PageLayoutBody>
      </PageLayoutPane>,
    ],
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
