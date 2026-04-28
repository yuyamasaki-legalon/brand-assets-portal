---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8068-a749-d652f071270b"
category: "Navigation"
---
# Menu

## 関連レシピ

- [Table.ActionCell + メニュー](../../aegis-recipes/table-action-cell-menu.md)
- [アイコンメニュー](../../aegis-recipes/action-menu.md)


💡 **Menuは、アクションやオプションのリストを表示するために使用されます。**

---
▶# 👉Examples
	

---

# 使用時の注意点
Menuのインナー要素にはMenuItem、MenuGroup、MenuSeparatorなどのMenu専用サブコンポーネントを使用してください。<br>それ以外のコンポーネントを使用したい場合は、<mention-page url="https://www.notion.so/15831669571280fc98d8cb9111d2e0ae"/> を使用してください。

---

### widthについて
<synced_block url="https://www.notion.so/1583166957128068a749d652f071270b#17d316695712807aaef0f622c815a981">
	横幅のサイズは基本的に<span color="blue">[**auto**](https://www.figma.com/design/oFhpA5oMKOEEtVDQthS4RO/Aegis-Library?node-id=20010-94418&t=3K0eHY1yYorCDWUh-1)</span>を使用してください。日英切り替えの際、自動的に幅の伸縮が行われます。
	autoの場合、min-widthとして160pxが設定されています。
</synced_block>
<synced_block url="https://www.notion.so/1583166957128068a749d652f071270b#17d31669571280f8b1ddccbaccb76d11">
	⚠️ファイル名や<span discussion-urls="discussion://16031669-5712-808f-9182-001c796ad28d">ユーザー名、会社名などのオブジェクト</span><br>メニュー内が２行になることを許容する場合や、テキストの最後が一定幅以上になったときに省略される<span discussion-urls="discussion://19631669-5712-80d1-b7fe-001c47137223">要素</span>は、<span color="blue">[**固定幅のサイズ**](https://www.figma.com/design/oFhpA5oMKOEEtVDQthS4RO/Aegis-Library?node-id=20010-94417&t=3K0eHY1yYorCDWUh-1)</span>を使用してください。
</synced_block>

---

### <span discussion-urls="discussion://16031669-5712-802e-a493-001cdd641bd1">Menuの中で使われる</span>MenuItemのサイズ（縦幅）について
**large**
<columns>
	<column>
		- \[…\]のIconButtonから出てくるMenuに収まるもの
		- 案件、契約書などテキストが長くなるもの
	</column>
	<column>
		
	</column>
</columns>
**medium**
<columns>
	<column>
		- select, comboboxなど、inputの選択肢として出てくるもの。

	</column>
	<column>
		
	</column>
</columns>
**small**
- smallは基本的に使わない

---
### 色について
復元ややり直しができない処理を含む場合はdangerを使用してください。
- 削除
- 利用停止（ユーザー）
など
<columns>
	<column>
		dangerのアイテムがある場合はそうでないアイテムとの間にDividerを入れてください。<br><mention-page url="https://www.notion.so/1583166957128068a749d652f071270b"/>を参照

	</column>
	<column>
		
	</column>
</columns>
---

### メニュー項目の配置について
- 利用頻度が高いと想定される項目は、メニューの上部に配置します。
- 関連性の高い項目をグルーピングして配置します。
- 削除など、元に戻せない破壊的な操作（dangerのアイテム）はメニューの最下部に配置します。

---

### MenuItemのラベルについて
基本的にオブジェクト名は不要です。
例）
✖️ xxxを削除
⭕️ 削除

一方、メニューを表示する位置が対象のオブジェクトから距離がある場合などはオブジェクト名を含めてください。<br>例）
- グローバルヘッダー
- tableのツールバー

---

### Dividerについて
<columns>
	<column>
		dangerのアイテムがある場合は、そうでないアイテムとの間にDividerを入れてください。
		グルーピングの際にもDividerが使用できますが、アイテム数が多い場合にのみ使用してください。６つ以上であれば検討の余地ありです。
		アイテム数が少ない場合は基本的に使用しないでください。
	</column>
	<column>
		
	</column>
</columns>

---

### MenuItemのleading（Icon）の有無について
メインアクションかサブアクションのどちらかでアイコンの有無を判断してください。

**メインアクション**
<columns>
	<column>
		Iconbuttonとして独立したボタンである場合<br>例）ヘッダーやtable上部のtoolbarにある\[…\]ボタンなど。
	</column>
	<column>
		
	</column>
</columns>
**サブアクション**
<columns>
	<column>
		主要コンポーネントのオプションとして存在するボタンである場合
		例）informationcard, tableにある\[…\]ボタンなど。
	</column>
	<column>
		
	</column>
</columns>
⚠️ButtonGroup等の省略UIの際は、省略の前の状態でアイコンがあったかどうかで判断する。

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useState } from "react";
import {
  LfCopy,
  LfDownload,
  LfLink,
  LfSend,
  LfTrash,
} from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { modes } from "../../.storybook/modes";
import {
  ActionList,
  ActionListBody,
  ActionListDescription,
  ActionListGroup,
  ActionListItem,
} from "../../src/components/ActionList";
import { Button } from "../../src/components/Button";
import { Icon } from "../../src/components/Icon";
import {
  Menu,
  MenuAnchor,
  MenuBox,
  MenuCheckboxItem,
  MenuContent,
  MenuDescription,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubTrigger,
  MenuTrigger,
} from "../../src/components/Menu";
import {
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
} from "../../src/components/Popover";
import { Tooltip } from "../../src/components/Tooltip";

export default {
  component: Menu,
  args: {
    children: [
      <MenuTrigger key={0}>
        <Button>Open</Button>
      </MenuTrigger>,
      <MenuContent key={1}>
        <MenuGroup>
          <MenuItem
            leading={
              <Icon>
                <LfSend />
              </Icon>
            }
          >
            Send
          </MenuItem>
          <MenuItem
            leading={
              <Icon>
                <LfCopy />
              </Icon>
            }
          >
            Copy
          </MenuItem>
          <MenuItem
            leading={
              <Icon>
                <LfDownload />
              </Icon>
            }
            disabled
          >
            Download
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem
          color="danger"
          leading={
            <Icon>
              <LfTrash />
            </Icon>
          }
        >
          Delete
        </MenuItem>
      </MenuContent>,
    ],
  },
} satisfies Meta<typeof Menu>;

type Story = StoryObj<typeof Menu>;

export const Open = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Story;

export const Descriptions = {
  args: {
    defaultOpen: true,
    children: [
      <MenuTrigger key={0}>
        <Button>Open</Button>
      </MenuTrigger>,
      <MenuContent key={1}>
        <MenuItem>
          Send
          <MenuDescription>Send the document</MenuDescription>
        </MenuItem>
        <MenuItem
          trailing={<MenuDescription variant="data">⌘+C</MenuDescription>}
        >
          Copy
        </MenuItem>
        <MenuItem disabled>
          Download
          <MenuDescription>Download the document</MenuDescription>
        </MenuItem>
      </MenuContent>,
    ],
  },
} satisfies Story;

export const GroupLabels = {
  args: {
    defaultOpen: true,
    children: [
      <MenuTrigger key={0}>
        <Button>Open</Button>
      </MenuTrigger>,
      <MenuContent key={1}>
        <MenuGroup>
          <MenuGroupLabel>My Account</MenuGroupLabel>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Billing</MenuItem>
          <MenuItem>Settings</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Organization</MenuGroupLabel>
          <MenuItem>Team</MenuItem>
          <MenuItem>Invite</MenuItem>
        </MenuGroup>
      </MenuContent>,
    ],
  },
} satisfies Story;

export const RadioItems = {
  args: {
    defaultOpen: true,
  },
  render: (props) => {
    const [value, setValue] = useState<string | null>("1");

    return (
      <Menu {...props}>
        <MenuTrigger>
          <Button>Open</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuRadioGroup defaultValue={value} onValueChange={setValue}>
            <MenuRadioItem value="1">Item 1</MenuRadioItem>
            <MenuRadioItem value="2">Item 2</MenuRadioItem>
            <MenuRadioItem value="3">Item 3</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    );
  },
} satisfies Story;

export const CheckboxItems = {
  args: {
    defaultOpen: true,
  },
  render: (props) => {
    const [item1, setItem1] = useState(false);
    const [item2, setItem2] = useState(true);
    const [item3, setItem3] = useState(true);

    return (
      <Menu {...props}>
        <MenuTrigger>
          <Button>Open</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuCheckboxItem checked={item1} onCheckedChange={setItem1}>
            Item 1
          </MenuCheckboxItem>
          <MenuCheckboxItem checked={item2} onCheckedChange={setItem2}>
            Item 2
          </MenuCheckboxItem>
          <MenuCheckboxItem checked={item3} onCheckedChange={setItem3}>
            Item 3
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>
    );
  },
} satisfies Story;

export const CloseOnClick = {
  args: {
    children: [
      <MenuTrigger key={0}>
        <Button>Open</Button>
      </MenuTrigger>,
      <MenuContent key={1}>
        <MenuItem closeOnClick>Close on click</MenuItem>
        <MenuItem closeOnClick={false}>Does not close on click</MenuItem>
      </MenuContent>,
    ],
  },
} satisfies Story;

/**
 * Use the `openOnHover` prop of the `Menu` to open the menu on hover.
 */
export const OpenOnHover = {
  args: {
    children: [
      <MenuTrigger key={0} openOnHover>
        <Button>Hover</Button>
      </MenuTrigger>,
      <MenuContent key={1}>
        <MenuGroup>
          <MenuItem>Send</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem disabled>Download</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem color="danger">Delete</MenuItem>
      </MenuContent>,
    ],
  },
} satisfies Story;

export const NestedMenu = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            // Nested Menu utilizes aria-owns to link menus and their submenus, which
            // causes this rule to incorrectly report violations.
            id: "aria-required-children",
            enabled: false,
          },
        ],
      },
    },
  },
  args: {
    defaultOpen: true,
    children: [
      <MenuTrigger key={0}>
        <Button>Open</Button>
      </MenuTrigger>,
      <MenuContent key={1}>
        <MenuSub>
          <MenuSubTrigger>Item 1</MenuSubTrigger>
          <MenuContent>
            <MenuItem>Item 1.1</MenuItem>
            <MenuSub>
              <MenuSubTrigger>Item 1.2</MenuSubTrigger>
              <MenuContent>
                <MenuItem>Item 1.2.1</MenuItem>
                <MenuItem>Item 1.2.2</MenuItem>
                <MenuItem>Item 1.2.3</MenuItem>
              </MenuContent>
            </MenuSub>
          </MenuContent>
        </MenuSub>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </MenuContent>,
    ],
  },
} satisfies Story;

export const Links = {
  args: {
    children: [
      <MenuTrigger key={0}>
        <Button>Open</Button>
      </MenuTrigger>,
      <MenuContent key={1}>
        <MenuItem asChild>
          <a href="#">Link 1</a>
        </MenuItem>
        <MenuItem asChild>
          <a href="#">Link 2</a>
        </MenuItem>
      </MenuContent>,
    ],
  },
} satisfies Story;

export const NestedPopover = {
  ...NestedMenu,
  args: {
    ...NestedMenu.args,
    children: [
      <MenuTrigger key={0}>
        <Button>Open</Button>
      </MenuTrigger>,
      <MenuContent key={1}>
        <MenuContent key={1}>
          <MenuGroup>
            <MenuItem>Send</MenuItem>
            <MenuItem>Copy</MenuItem>
            <Popover trigger="hover" arrow>
              <PopoverAnchor>
                <MenuItem disabled>Download</MenuItem>
              </PopoverAnchor>
              <PopoverContent width="small" aria-label="Help">
                <PopoverBody>
                  Disabled because the document is not available yet
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem color="danger">Delete</MenuItem>
        </MenuContent>
      </MenuContent>,
    ],
  },
} satisfies Story;

/**
 * **Deprecated Usage**. This story is to make sure that the deprecated APIs still work.
 */
export const Deprecated = {
  args: {
    defaultOpen: true,
    onOpenChange: fn(),
    selectedIndex: 5,
  },
  render: (props) => {
    return (
      <Menu {...props}>
        <MenuAnchor>
          <Button>Open</Button>
        </MenuAnchor>
        <MenuBox>
          <ActionList>
            <ActionListGroup>
              <ActionListItem>
                <ActionListBody leading={LfSend}>Send</ActionListBody>
              </ActionListItem>
              <ActionListItem disabled>
                <ActionListBody leading={LfCopy}>
                  Copy
                  <ActionListDescription>Description</ActionListDescription>
                </ActionListBody>
              </ActionListItem>
              <ActionListItem as="a" href="#">
                <ActionListBody leading={LfLink}>Link</ActionListBody>
              </ActionListItem>
            </ActionListGroup>
            <ActionListGroup selectionType="single">
              <ActionListItem selected>
                <ActionListBody>Item 1</ActionListBody>
              </ActionListItem>
            </ActionListGroup>
            <ActionListGroup title="Title">
              <ActionListItem onClick={(e) => e.preventDefault()}>
                <ActionListBody>Does not close on click</ActionListBody>
              </ActionListItem>
            </ActionListGroup>
            <ActionListItem color="danger">
              <ActionListBody leading={LfTrash}>Delete</ActionListBody>
            </ActionListItem>
            <Tooltip title="Title">
              <ActionListItem>
                <ActionListBody>Item with Tooltip</ActionListBody>
              </ActionListItem>
            </Tooltip>
          </ActionList>
        </MenuBox>
      </Menu>
    );
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
