---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80fc-98d8-cb9111d2e0ae"
category: "Feedback"
---
# Popover

## 関連レシピ

- [フォームラベル + ヘルプ + TagPicker](../../aegis-recipes/form-control-help-tagpicker.md)
- [非活性アクション + 理由の Popover](../../aegis-recipes/disabled-action-popover.md)


<synced_block url="https://www.notion.so/15831669571280fc98d8cb9111d2e0ae#17d31669571280c3805dd13ec1c1c6f9">
	💡 **Popoverは、ユーザーが特定の要素にホバーまたはクリックすると表示されるコンポーネントです。<br>Menuのインナー要素にはMenuItemなどのMenu専用サブコンポーネントのみ使用できるのに対し、PopoverはButtonやSearchなど、さまざまなコンポーネントを設置できます。**
</synced_block>

---
▶# 👉Examples
	
<notion-embed url="https://www.notion.so/15831669571280fc98d8cb9111d2e0ae#168316695712802a93cac04085c784a6"/>

---

# 使用時の注意点
### インナー要素について
<columns>
	<column>
		Popoverのインナー要素にはさまざまなコンポーネントを設置できます。<br>挙動オプションも豊富です。<br>figmaで再現できないものも多く含むので、[Popover](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-popover--cover&buildNumber=3297&k=6761225546592127fbd49fd7-1200px-interactive-true&h=24&b=-17)を確認してください。

	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280fc98d8cb9111d2e0ae#15f3166957128055a907c2637e3583b4"/>
	</column>
</columns>
### サイズ (Size)
- **small:** コンテンツの幅に合わせて自動的に幅が調整されます。最大幅は `small` のデフォルト幅に制限されます。説明文など、短いテキストを表示する場合に使用します。

### 吹き出しについて
<columns>
	<column>
		説明文を表示する場合や、対象とする要素が不明瞭な場合、必ず吹き出しをつけてください。<br>吹き出しオプションはsmallのみです。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280fc98d8cb9111d2e0ae#15f316695712805683e1ca16233af521"/>
		<notion-embed url="https://www.notion.so/15831669571280fc98d8cb9111d2e0ae#15f31669571280ee9465d7b7ad14da26"/>
	</column>
</columns>

---

### エリア外クリックについて
エリア外クリックで閉じても良いものとします。<br>例外として、Popover内でinput操作（<span discussion-urls="discussion://16031669-5712-8091-b4a6-001c6fed6b21">入力</span>）が行われる場合、エリア外をクリックしても閉じないことを基本とします。<br>(閉じても入力情報を保持する処理が必要になるため)

---

### 閉じるボタンについて
headerの\[x\]ボタンもしくは、footerの\[閉じる\]buttonをつけてください<br>説明用途smallの場合は\[x\]ボタンは必須ではありません。

---

### 背景要素の制御について
Popover内で操作（入力）が行われる場合、背景要素のスクロールは無効化させてください。

---
（不活性な要素がhoverされた時のメッセージについて）
# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280fc98d8cb9111d2e0ae#168316695712807dbd37c4d57f1c969c"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { ComponentRef } from "react";
import { useState } from "react";
import { LfInformationCircle } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import isChromatic from "chromatic/isChromatic";
import { expect, fn, within } from "storybook/test";
import { Button, ButtonGroup, IconButton } from "../../src/components/Button";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
} from "../../src/components/ContentHeader";
import { Divider } from "../../src/components/Divider";
import { Header } from "../../src/components/Header";
import { Icon } from "../../src/components/Icon";
import type { PopoverContentProps } from "../../src/components/Popover";
import {
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
} from "../../src/components/Popover";
import { Search } from "../../src/components/Search";
import { Link } from "../../src/components/Text";
import { TextField } from "../../src/components/TextField";
import { Tooltip } from "../../src/components/Tooltip";
import { Placeholder, Stack } from "../_utils/components";

const renderContent = ({ key, ...rest }: PopoverContentProps = {}) => (
  <Popover.Content key={key} {...rest}>
    <Popover.Header>
      <ContentHeader>
        <ContentHeaderTitle>Header Title</ContentHeaderTitle>
        <ContentHeaderDescription>Header Caption</ContentHeaderDescription>
      </ContentHeader>
    </Popover.Header>
    <Popover.Body>
      <Placeholder>{"Body".repeat(30)}</Placeholder>
    </Popover.Body>
    <Popover.Footer>
      <Link href="#">Link</Link>
      <ButtonGroup>
        <Button variant="gutterless">Button</Button>
      </ButtonGroup>
    </Popover.Footer>
  </Popover.Content>
);

export default {
  component: Popover,
  args: {
    defaultOpen: isChromatic(),
    children: [
      <Popover.Anchor key={0}>
        <Button>Toggle</Button>
      </Popover.Anchor>,
      renderContent({ key: 1 }),
    ],
  },
} satisfies Meta<typeof Popover>;

type Story = StoryObj<typeof Popover>;

const ALL_CONTENT_WIDTHS: PopoverContentProps["width"][] = [
  "large",
  "medium",
  "small",
  "auto",
];

/**
 * Use the `width` prop of the `Popover.Content` to set the width of the `Popover.Content`.
 */
export const ContentWidth = {
  render: (props) => (
    <Stack>
      {ALL_CONTENT_WIDTHS.map((width) => (
        <Popover {...props} key={width}>
          <Popover.Anchor>
            <Button>{width}</Button>
          </Popover.Anchor>
          {renderContent({ width })}
        </Popover>
      ))}
    </Stack>
  ),
} satisfies Story;

export const CloseButton = {
  args: {
    closeButton: false,
  },
} satisfies Story;

export const CloseOnBlur = {
  args: {
    closeOnBlur: false,
    defaultOpen: undefined,
  },
  render: (props) => (
    <Stack direction="row">
      <Popover {...props} />
      <Button variant="plain">Other</Button>
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `arrow` prop of the `Popover` to `true` to show the arrow.
 */
export const Arrow = {
  args: {
    arrow: true,
    children: [
      <Popover.Anchor key={0}>
        <IconButton aria-label="Information" variant="plain">
          <Icon>
            <LfInformationCircle />
          </Icon>
        </IconButton>
      </Popover.Anchor>,
      <Popover.Content width="small" key={1}>
        <Popover.Header>
          <ContentHeader size="xSmall">
            <ContentHeaderTitle>Title</ContentHeaderTitle>
            <ContentHeaderDescription>
              Here is the description and can be anything.
            </ContentHeaderDescription>
          </ContentHeader>
        </Popover.Header>
        <Popover.Footer>
          <Link href="#">Link</Link>
        </Popover.Footer>
      </Popover.Content>,
    ],
  },
} satisfies Story;

export const PositionReference = {
  render: (props) => {
    const [positionReference, setPositionReference] = useState<ComponentRef<
      typeof Placeholder
    > | null>(null);

    return (
      <Popover {...props} positionReference={positionReference}>
        <Placeholder ref={setPositionReference}>
          <Popover.Anchor>
            <Button>Toggle</Button>
          </Popover.Anchor>
          Popover will be positioned relative to me
        </Placeholder>
        {renderContent()}
      </Popover>
    );
  },
} satisfies Story;

export const InnerPositionReference = {
  args: {
    placement: "bottom-end",
    closeButton: false,
  },
  parameters: {
    chromatic: {
      delay: 300,
    },
  },
  render: (props) => {
    const [innerPositionReference, setInnerPositionReference] =
      useState<ComponentRef<typeof Search> | null>(null);

    return (
      <Header>
        <Header.Item>
          <Header.Title>Title</Header.Title>
        </Header.Item>
        <Header.Spacer />
        <Header.Item>
          <Popover {...props} innerPositionReference={innerPositionReference}>
            <Popover.Anchor>
              <Search readOnly role="combobox" />
            </Popover.Anchor>
            <Popover.Content width="large">
              <Popover.Header>
                <Search ref={setInnerPositionReference} />
              </Popover.Header>
              <Popover.Body>
                <Placeholder>Body can be anything</Placeholder>
              </Popover.Body>
              <Popover.Footer>
                <Link href="#">Standalone Link</Link>
                <ButtonGroup>
                  <Button variant="gutterless">Button</Button>
                </ButtonGroup>
              </Popover.Footer>
            </Popover.Content>
          </Popover>
        </Header.Item>
        <Header.Item>
          <IconButton aria-label="Information">
            <Icon>
              <LfInformationCircle />
            </Icon>
          </IconButton>
        </Header.Item>
      </Header>
    );
  },
} satisfies Story;

/**
 * Use the `trigger` prop of the `Popover` to set the trigger of the `Popover`.
 *
 * > * `click`: Triggered on click and click-like keyboard events (a11y).
 * > * `hover`: Triggered on hover and ":focus-visible" (a11y).
 * > * `focus`: Triggered on focus and click.
 */
export const Trigger = {
  args: {
    defaultOpen: undefined,
  },
  render: (props) => (
    <Stack>
      <Popover {...props} trigger="hover">
        <Popover.Anchor>
          <Button>Hover</Button>
        </Popover.Anchor>
        {renderContent()}
      </Popover>
      <Popover {...props} trigger="focus">
        <Popover.Anchor>
          <TextField role="combobox" placeholder="Focus" />
        </Popover.Anchor>
        {renderContent({ width: "match-to-anchor" })}
      </Popover>
    </Stack>
  ),
} satisfies Story;

export const WithTooltip = {
  args: {
    defaultOpen: undefined,
    children: [
      <Popover.Anchor key={0}>
        <Tooltip title="tooltip">
          <Button>Toggle</Button>
        </Tooltip>
      </Popover.Anchor>,
      renderContent({ key: 1 }),
    ],
  },
} satisfies Story;

/**
 * When the `Popover.Body` is long, it will be scrollable.
 */
export const WithLongBody = {
  args: {
    children: [
      <Popover.Anchor key={0}>
        <Button>Toggle</Button>
      </Popover.Anchor>,
      <Popover.Content key={1}>
        <Popover.Header>
          <ContentHeader>
            <ContentHeaderTitle>Header Title</ContentHeaderTitle>
            <ContentHeaderDescription>Header Caption</ContentHeaderDescription>
          </ContentHeader>
        </Popover.Header>
        <Divider />
        <Popover.Body>
          <Placeholder style={{ height: "100vh" }}>Long Body</Placeholder>
        </Popover.Body>
        <Divider />
        <Popover.Footer>
          <Link href="#">Standalone Link</Link>
          <ButtonGroup>
            <Button variant="gutterless">Button</Button>
          </ButtonGroup>
        </Popover.Footer>
      </Popover.Content>,
    ],
  },
} satisfies Story;

export const WithCustomFooter = {
  args: {
    children: [
      <Popover.Anchor key={0}>
        <Button>Toggle</Button>
      </Popover.Anchor>,
      <Popover.Content key={1}>
        <Popover.Header>
          <ContentHeader>
            <ContentHeaderTitle>Header Title</ContentHeaderTitle>
            <ContentHeaderDescription>Header Caption</ContentHeaderDescription>
          </ContentHeader>
        </Popover.Header>
        <Popover.Body>
          <Placeholder>Body</Placeholder>
        </Popover.Body>
        <Popover.Footer>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              rowGap: "var(--aegis-space-medium)",
            }}
          >
            <Button variant="subtle" width="full">
              Button
            </Button>
            <div style={{ marginInlineStart: "auto" }}>
              <Button variant="gutterless">Button</Button>
            </div>
          </div>
        </Popover.Footer>
      </Popover.Content>,
    ],
  },
} satisfies Story;

export const Nested = {
  args: {
    defaultOpen: undefined,
    children: [
      <PopoverAnchor key={0}>
        <Button>Open</Button>
      </PopoverAnchor>,
      <PopoverContent key={1}>
        <PopoverHeader>
          <ContentHeader>
            <ContentHeaderTitle>Header</ContentHeaderTitle>
          </ContentHeader>
        </PopoverHeader>
        <PopoverBody>
          <Popover>
            <PopoverAnchor>
              <Button>Open Nested</Button>
            </PopoverAnchor>
            <PopoverContent>
              <PopoverHeader>
                <ContentHeader>
                  <ContentHeaderTitle>Nested Header</ContentHeaderTitle>
                </ContentHeader>
              </PopoverHeader>
              <PopoverBody>
                <Placeholder>Inner Body</Placeholder>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </PopoverBody>
      </PopoverContent>,
    ],
  },
} satisfies Story;

export const EventBubbling = {
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
  args: {
    defaultOpen: true,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
