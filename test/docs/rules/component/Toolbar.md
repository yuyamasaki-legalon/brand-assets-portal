---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8019-8758-dc8797b47c76"
category: "Surface"
---
# Toolbar

## 関連レシピ

- [一覧ツールバー + 検索/フィルター](../../aegis-recipes/list-toolbar-and-search.md)


<synced_block url="https://www.notion.so/15831669571280198758dc8797b47c76#18331669571280ef9bb8d325b7cfe959">
	<callout icon="💡" color="gray_bg">
		<span discussion-urls="discussion://16531669-5712-80e8-a8fc-001c3c21800b">**Toolbar**</span>**は、インナー要素として操作や処理を実行するコンポーネントを複数設置することができるレイアウトコンポーネントです。<br><br>**ToolBarに入る主なコンポーネントは以下のようなものがあります。<br>・Button<br>・IconButton<br>・Tabs<br>・SegmentedControl
	</callout>
</synced_block>

---
▶# 👉Examples
	

---

# 使用時の注意点
組み合わせが多岐にわたる複雑なComponentです。<br>Detachして不可視レイヤーを削除するなど、簡略化して使用して問題ありません。
LOCの開発においては、detach後の再コンポーネント化の名称は以下に従ってください。<br><mention-page url="https://www.notion.so/140a51309f064535adcf5205474b3b54"/>

---

<columns>
	<column>
		<synced_block url="https://www.notion.so/15831669571280198758dc8797b47c76#1833166957128042ab09d5e611189a21">
			横並びで複数の操作コンポーネントを設置する際は、<br>基本的に全て<span color="blue">Toolbarの中</span>に入れてください。
		</synced_block>

		使用の基準は以下です
		<synced_block url="https://www.notion.so/15831669571280198758dc8797b47c76#18331669571280c2b055e09342c28677">
			- Scroll時に上部に固定するSticky処理をしたい場合
			- 複数のコンポーネントを横並びで入れたい場合。
			- 複数のコンポーネントを両端揃えで配置したい場合
		</synced_block>

	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/15831669571280198758dc8797b47c76#15f316695712804baf26e5bfe5f58c7b" alt="figma"/>
	</column>
</columns>
<columns>
	<column>
		使用の必要がない場合
		- ButtonGroupやTabsを単独で使用し、Sticky処理が不要である場合
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/15831669571280198758dc8797b47c76#166316695712808782a0d035bb1628f6" alt="figma"/>
	</column>
</columns>

---

### 使用箇所による背景パターンについて
<columns>
	<column>
		Hover時などに要素の上に置く場合はbackground=trueを使用してください。（背景とシャドウがある方）
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/15831669571280198758dc8797b47c76#15f316695712803c8500c59ca41cd3e4" alt="figma"/>
	</column>
</columns>

---

# Q&A
Q: ToolbarはPageLayout.Bodyの先頭に置かなければいけませんか？
A: いいえ、その必要はありません。PageLayout.Body内では、Toolbarの上部にテキストを配置するなど、柔軟に順序を決定できます。
Q: {内容を書く}
A: {内容を書く}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import {
  LfAlignCenter,
  LfAlignLeft,
  LfAlignRight,
  LfBold,
  LfItalic,
} from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb, BreadcrumbItem } from "../../src/components/Breadcrumb";
import { ButtonGroup, IconButton } from "../../src/components/Button";
import { Divider } from "../../src/components/Divider";
import { Icon } from "../../src/components/Icon";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarSpacer,
} from "../../src/components/Toolbar";

export default {
  component: Toolbar,
  args: {
    children: [
      <ToolbarGroup key={0}>
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
      </ToolbarGroup>,
      <ToolbarSeparator key={1} />,
      <ToolbarGroup key={2}>
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
      </ToolbarGroup>,
    ],
  },
} satisfies Meta<typeof Toolbar>;

type Story = StoryObj<typeof Toolbar>;

export const Orientation = {
  args: {
    orientation: "vertical",
  },
} satisfies Story;

/**
 * You can put `Breadcrumb` in `Toolbar`. Make use of `ToolbarSpacer` to layout items as you like.
 */
export const WithBreadcrumb = {
  args: {
    children: [
      <Breadcrumb key={0}>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbItem href="#">Settings</BreadcrumbItem>
        <BreadcrumbItem aria-current="page">Accounts</BreadcrumbItem>
      </Breadcrumb>,
      <ToolbarSpacer key={1} />,
      <ToolbarGroup key={2}>
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
      </ToolbarGroup>,
    ],
  },
} satisfies Story;

/**
 * **Deprecated Usage**. This story is to make sure that the deprecated APIs still work.
 */
export const Deprecated = {
  args: {
    children: [
      <ButtonGroup key={0}>
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
      </ButtonGroup>,
      <Divider key={1} />,
      <ButtonGroup key={2}>
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
      </ButtonGroup>,
    ],
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
