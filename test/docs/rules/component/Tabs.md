---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-803a-8287-f92e-e74d75eb"
category: "Layout"
---
# Tabs

## 関連レシピ

- [一覧ツールバー + 検索/フィルター](../../aegis-recipes/list-toolbar-and-search.md)


💡 **Tabsは、異なるコンテンツセクションやビューを整理して切り替え表示するためのコンポーネントです。<br><br>**切り替えたい要素が同じレベルの重要度、またはコンテンツの場合<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>の使用を検討してください。<br>SegmentControlと併用する場合はTabsの方が上位概念です。

---
▶# 👉Examples
	

---

# 使用時の注意点
### サイズについて
**large**<br>largeは非推奨とします。

<synced_block url="https://www.notion.so/158316695712803a8287f92ee74d75eb#1883166957128050b33edca7e45e22db">
	**medium**<br>基本的にmediumを使用してください。<br>※Toolbar内で使用する場合はmediumのみ使用できます。
</synced_block>

<columns>
	<column>
		**small**<br>Popoverなど狭いコンテンツ内で使用します。

	</column>
	<column>
		
	</column>
</columns>

---

### <span discussion-urls="discussion://17431669-5712-803a-ae2b-001c3fbe05b6">TabsとSegmentedControlの違いについて</span>
<columns>
	<column>
		Tabsは切り替えるコンテンツの内容が大きく変化する場合に使用します。
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		切り替えるコンテンツの内容がほぼ同一で、フィルタリングや、並べ替え程度の変化であれば、SegmentedControlを使用してください。
	</column>
	<column>
		
	</column>
</columns>

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useState } from "react";
import { LfBooks, LfCamera, LfEllipsisDot } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../src/components/Badge";
import { IconButton } from "../../src/components/Button";
import { FormControl } from "../../src/components/Form";
import { Icon } from "../../src/components/Icon";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "../../src/components/Menu";
import { Overflow, OverflowItem } from "../../src/components/Overflow";
import type { TabGroupOptions, TabsOptions } from "../../src/components/Tabs";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../src/components/Tabs";
import { TextField } from "../../src/components/TextField";
import { Toolbar, ToolbarSpacer } from "../../src/components/Toolbar";
import { Placeholder, Stack } from "../_utils/components";

export default {
  component: Tabs,
  args: {
    children: [
      <TabsList key={0}>
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b">Tab B</TabsTrigger>
        <TabsTrigger value="c">Tab C</TabsTrigger>
      </TabsList>,
      <TabsContent key={1} value="a">
        <Placeholder>Panel A</Placeholder>
      </TabsContent>,
      <TabsContent key={2} value="b">
        <Placeholder>Panel B</Placeholder>
      </TabsContent>,
      <TabsContent key={3} value="c">
        <Placeholder>Panel C</Placeholder>
      </TabsContent>,
    ],
  },
  subcomponents: {
    TabsList,
    TabsTrigger,
    TabsContent,
  },
} satisfies Meta<typeof Tabs>;

type Story = StoryObj<typeof Tabs>;

const ALL_SIZES: TabGroupOptions["size"][] = ["small", "medium", "large"];
/**
 * Use the `size` prop of the `Tab.Group` to change the size of the `Tab.List`.
 */
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Tabs {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_SIDES: TabsOptions["side"][] = ["top", "inline-start", "inline-end"];
/**
 * Use the `position` prop of the `Tab.Group` to change the position of the `Tab.List`.
 */
export const Side = {
  render: (props) => (
    <Stack>
      {ALL_SIDES.map((side) => (
        <Tabs {...props} key={side} side={side} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Use the `width` prop of the `Tab.List` to change the width of it.
 */
export const ListWidth = {
  args: {
    side: "inline-start",
  },
  render: (props) => (
    <Tabs {...props}>
      <TabsList width="small">
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b">Tab B</TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <Placeholder>Panel A</Placeholder>
      </TabsContent>
      <TabsContent value="b">
        <Placeholder>Panel B</Placeholder>
      </TabsContent>
    </Tabs>
  ),
} satisfies Story;

export const ListBordered = {
  render: (props) => (
    <Tabs {...props}>
      <TabsList bordered={false}>
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b">Tab B</TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <Placeholder>Panel A</Placeholder>
      </TabsContent>
      <TabsContent value="b">
        <Placeholder>Panel B</Placeholder>
      </TabsContent>
    </Tabs>
  ),
} satisfies Story;

export const ListActivateOnFocus = {
  render: (props) => (
    <Tabs {...props}>
      <TabsList activateOnFocus={false}>
        <TabsTrigger asChild value="a">
          <a href="#">Tab A</a>
        </TabsTrigger>
        <TabsTrigger asChild value="b">
          <a href="#">Tab B</a>
        </TabsTrigger>
        <TabsTrigger asChild value="c" disabled>
          <a>Tab C</a>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <Placeholder>Panel A</Placeholder>
      </TabsContent>
      <TabsContent value="b">
        <Placeholder>Panel B</Placeholder>
      </TabsContent>
      <TabsContent value="c">
        <Placeholder>Panel C</Placeholder>
      </TabsContent>
    </Tabs>
  ),
} satisfies Story;

export const ContentKeepMounted = {
  render: (props) => (
    <Tabs {...props}>
      <TabsList>
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b">Tab B</TabsTrigger>
      </TabsList>
      <TabsContent value="a" keepMounted>
        <FormControl>
          <FormControl.Label>Label</FormControl.Label>
          <TextField />
        </FormControl>
      </TabsContent>
      <TabsContent value="b">
        <Placeholder>Panel B</Placeholder>
      </TabsContent>
    </Tabs>
  ),
} satisfies Story;

export const TriggerFill = {
  render: (props) => (
    <Tabs {...props}>
      <TabsList>
        <TabsTrigger value="a" fill>
          Tab A
        </TabsTrigger>
        <TabsTrigger value="b" fill>
          Tab B
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <Placeholder>Panel A</Placeholder>
      </TabsContent>
      <TabsContent value="b">
        <Placeholder>Panel B</Placeholder>
      </TabsContent>
    </Tabs>
  ),
} satisfies Story;

export const TriggerLeading = {
  render: (props) => (
    <Tabs {...props}>
      <TabsList>
        <TabsTrigger
          value="a"
          leading={
            <Icon>
              <LfBooks />
            </Icon>
          }
        >
          Tab A
        </TabsTrigger>
        <TabsTrigger
          value="b"
          leading={
            <Icon>
              <LfCamera />
            </Icon>
          }
        >
          Tab B
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <Placeholder>Panel A</Placeholder>
      </TabsContent>
      <TabsContent value="b">
        <Placeholder>Panel B</Placeholder>
      </TabsContent>
    </Tabs>
  ),
} satisfies Story;

export const TriggerTrailing = {
  render: (props) => (
    <Tabs {...props}>
      <TabsList>
        <TabsTrigger value="a" trailing={<Badge color="danger" />}>
          Tab A
        </TabsTrigger>
        <TabsTrigger value="b" trailing={<Badge count={3} color="danger" />}>
          Tab B
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <Placeholder>Panel A</Placeholder>
      </TabsContent>
      <TabsContent value="b">
        <Placeholder>Panel B</Placeholder>
      </TabsContent>
    </Tabs>
  ),
} satisfies Story;

export const TriggerDisabled = {
  render: (props) => (
    <Tabs {...props}>
      <TabsList>
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b" disabled>
          Tab B
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <Placeholder>Panel A</Placeholder>
      </TabsContent>
      <TabsContent value="b">
        <Placeholder>Panel B</Placeholder>
      </TabsContent>
    </Tabs>
  ),
} satisfies Story;

export const WithLongList = {
  args: {
    children: [
      <TabsList key={0}>
        {Array.from({ length: 20 }, (_, i) => (
          <TabsTrigger key={i} value={`tab-${i}`}>
            Very long tab {i}
          </TabsTrigger>
        ))}
      </TabsList>,
      Array.from({ length: 20 }, (_, i) => (
        <TabsContent key={i} value={`tab-${i}`}>
          <Placeholder>Very long panel {i}</Placeholder>
        </TabsContent>
      )),
    ],
  },
} satisfies Story;

export const WithLongListOverflow = {
  render: (props) => {
    const [value, setValue] = useState("tab-0");

    return (
      <Tabs {...props} value={value} onValueChange={setValue}>
        <Overflow>
          {({ indexes }) => (
            <Toolbar>
              <TabsList bordered={false}>
                {Array.from({ length: 30 }, (_, i) => {
                  const itemValue = `tab-${i}`;

                  return (
                    <OverflowItem
                      key={i}
                      priority={value === itemValue ? 1 : 0}
                    >
                      <TabsTrigger value={itemValue}>Tab {i}</TabsTrigger>
                    </OverflowItem>
                  );
                })}
              </TabsList>
              {indexes.length > 0 && (
                <>
                  <ToolbarSpacer />
                  <Menu>
                    <MenuTrigger>
                      <IconButton aria-label="More options">
                        <Icon>
                          <LfEllipsisDot />
                        </Icon>
                      </IconButton>
                    </MenuTrigger>
                    <MenuContent>
                      {indexes.map((index) => {
                        return (
                          <MenuItem
                            key={index}
                            onClick={() => {
                              setValue(`tab-${index}`);
                            }}
                          >
                            Tab {index}
                          </MenuItem>
                        );
                      })}
                    </MenuContent>
                  </Menu>
                </>
              )}
            </Toolbar>
          )}
        </Overflow>
        {Array.from({ length: 30 }, (_, i) => {
          return (
            <TabsContent key={i} value={`tab-${i}`}>
              <Placeholder>Panel {i}</Placeholder>
            </TabsContent>
          );
        })}
      </Tabs>
    );
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
