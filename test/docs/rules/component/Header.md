---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80b9-9e60-e19922eda72d"
category: "Layout"
---
# Header

💡 **Headerは、ページにおいて最上部に配置されるコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280b99e60e19922eda72d#168316695712804c8f48c7cc20c1090b"/>

---

# 使用時の注意点
基本的にはレイアウトのコンポーネントであり、どんなものも入れることができますが、<br>必要最小限のパーツ、情報のみを表示してください。
他アプリのHeader状態も注視し、情報量や操作感のばらつきが起きないように注意してください。

---

### Bottomについて
<columns>
	<column>
		Bottom（旧名SubHeader）は、ヘッダーに2列目のレイアウトエリアを追加するために使用します。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280b99e60e19922eda72d#16831669571280728079e2b17efe3524"/>
	</column>
</columns>

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280b99e60e19922eda72d#168316695712808ba93ee11d3c5490e8"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import {
  LfAlignCenter,
  LfAlignLeft,
  LfAlignRight,
  LfAngleDownLarge,
  LfAngleLeftLarge,
  LfApps,
  LfBell,
  LfBold,
  LfComparison,
  LfDownload,
  LfInformationCircle,
  LfItalic,
  LfMagnifyingGlass,
} from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { modes } from "../../.storybook/modes";
import { Avatar } from "../../src/components/Avatar";
import { Button, ButtonGroup, IconButton } from "../../src/components/Button";
import { Divider } from "../../src/components/Divider";
import { Header } from "../../src/components/Header";
import { Icon } from "../../src/components/Icon";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "../../src/components/Menu";
import { Search } from "../../src/components/Search";
import { SegmentedControl } from "../../src/components/SegmentedControl";
import { StatusLabel } from "../../src/components/StatusLabel";
import { Toolbar } from "../../src/components/Toolbar";

export default {
  component: Header,
  args: {
    children: [
      <Header.Item key={0}>
        <IconButton aria-label="Menu">
          <Icon>
            <LfApps />
          </Icon>
        </IconButton>
      </Header.Item>,
      <Header.Item key={1}>
        <Header.Title>Aegis</Header.Title>
      </Header.Item>,
      <Header.Spacer key={2} />,
      <Header.Item key={3}>
        <Search />
      </Header.Item>,
      <Header.Item key={4}>
        <ButtonGroup>
          <IconButton aria-label="Notifications">
            <Icon>
              <LfBell />
            </Icon>
          </IconButton>
          <IconButton aria-label="Help">
            <Icon>
              <LfInformationCircle />
            </Icon>
          </IconButton>
          <Menu>
            <MenuTrigger>
              <Avatar name="LegalOn Technologies" />
            </MenuTrigger>
            <MenuContent side="bottom" align="end">
              <MenuItem>Settings</MenuItem>
              <MenuItem color="danger">Logout</MenuItem>
            </MenuContent>
          </Menu>
        </ButtonGroup>
      </Header.Item>,
    ],
  },
} satisfies Meta<typeof Header>;

type Story = StoryObj<typeof Header>;

export const Bordered = {
  args: {
    bordered: true,
  },
} satisfies Story;

export const NoBorder = {
  args: {
    sub: (
      <Header.Item key={0}>
        <SegmentedControl variant="plain">
          <SegmentedControl.Button>Tab 1</SegmentedControl.Button>
          <SegmentedControl.Button>Tab 2</SegmentedControl.Button>
          <SegmentedControl.Button>Tab 3</SegmentedControl.Button>
        </SegmentedControl>
      </Header.Item>
    ),
    bordered: false,
  },
} satisfies Story;

export const SubContent = {
  args: {
    sub: (
      <>
        <Header.Item key={0}>
          <Toolbar>
            <ButtonGroup>
              <IconButton aria-label="Left">
                <Icon>
                  <LfAlignLeft />
                </Icon>
              </IconButton>
              <IconButton aria-label="Center">
                <Icon>
                  <LfAlignCenter />
                </Icon>
              </IconButton>
              <IconButton aria-label="Right">
                <Icon>
                  <LfAlignRight />
                </Icon>
              </IconButton>
            </ButtonGroup>
            <Divider />
            <ButtonGroup>
              <IconButton aria-label="Bold">
                <Icon>
                  <LfBold />
                </Icon>
              </IconButton>
              <IconButton aria-label="Italic">
                <Icon>
                  <LfItalic />
                </Icon>
              </IconButton>
            </ButtonGroup>
          </Toolbar>
        </Header.Item>
        <Header.Spacer />
        <Header.Item>
          <SegmentedControl variant="plain">
            <SegmentedControl.Button>Segment</SegmentedControl.Button>
            <SegmentedControl.Button>Segment</SegmentedControl.Button>
            <SegmentedControl.Button>Segment</SegmentedControl.Button>
          </SegmentedControl>
        </Header.Item>
      </>
    ),
  },
} satisfies Story;

export const WithBackButton = {
  args: {
    children: [
      <Header.Item key={0}>
        <Button leading={LfAngleLeftLarge} variant="gutterless">
          Reviews
        </Button>
      </Header.Item>,
      <Header.Spacer flex={false} key={1} />,
      <Header.Item key={2}>
        <Header.Title>Aegis</Header.Title>
        <StatusLabel>v.4</StatusLabel>
        <Header.Description>
          Temporary saved in &quot;General&quot; folder.
        </Header.Description>
      </Header.Item>,
      <Header.Spacer key={3} />,
      <Header.Item key={4}>
        <IconButton aria-label="Search">
          <Icon>
            <LfMagnifyingGlass />
          </Icon>
        </IconButton>
      </Header.Item>,
      <Header.Item key={5}>
        <IconButton aria-label="Compare">
          <Icon>
            <LfComparison />
          </Icon>
        </IconButton>
      </Header.Item>,
      <Header.Item key={6}>
        <IconButton aria-label="Download">
          <Icon>
            <LfDownload />
          </Icon>
        </IconButton>
      </Header.Item>,
      <Header.Item key={7}>
        <Button variant="solid" trailing={LfAngleDownLarge}>
          Save
        </Button>
      </Header.Item>,
    ],
  },
} satisfies Story;

/**
 * **Deprecated Usage**. This story is to make sure that the deprecated APIs still work.
 */
export const Deprecated = {
  args: {
    bottom: (
      <>
        <Header.Item key={0}>
          <Toolbar>
            <ButtonGroup>
              <IconButton aria-label="Left">
                <Icon>
                  <LfAlignLeft />
                </Icon>
              </IconButton>
              <IconButton aria-label="Center">
                <Icon>
                  <LfAlignCenter />
                </Icon>
              </IconButton>
              <IconButton aria-label="Right">
                <Icon>
                  <LfAlignRight />
                </Icon>
              </IconButton>
            </ButtonGroup>
            <Divider />
            <ButtonGroup>
              <IconButton aria-label="Bold">
                <Icon>
                  <LfBold />
                </Icon>
              </IconButton>
              <IconButton aria-label="Italic">
                <Icon>
                  <LfItalic />
                </Icon>
              </IconButton>
            </ButtonGroup>
          </Toolbar>
        </Header.Item>
        <Header.Spacer />
        <Header.Item>
          <SegmentedControl variant="plain">
            <SegmentedControl.Button>Segment</SegmentedControl.Button>
            <SegmentedControl.Button>Segment</SegmentedControl.Button>
            <SegmentedControl.Button>Segment</SegmentedControl.Button>
          </SegmentedControl>
        </Header.Item>
      </>
    ),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
