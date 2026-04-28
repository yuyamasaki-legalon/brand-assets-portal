---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80f5-b147-e772dd289652"
category: "Layout"
---
# ContentHeader

💡 **ContentHeaderは、ページ内のタイトルと主要操作の表示を行うコンポーネントです。<br>タイトルの主要操作の配置やGapのばらつきを抑制することが主な目的です。**

---
▶# 👉Examples
	

---

# Deprecated Sub-components
| Deprecated | Replacement |
|------------|-------------|
| `ContentHeader.Title` | `ContentHeaderTitle` |
| `ContentHeader.Description` | `ContentHeaderDescription` |

Existing codebase (including templates) still uses the old compound component syntax. Always use the named exports.

# 使用時の注意点
### 使用回数について
<columns>
	<column>
		なるべくPageLayoutの<span discussion-urls="discussion://19331669-5712-80d9-93b1-001c5fff2ada">Main</span>やPaneの最上部に、それぞれ１度だけの使用にとどめてください。

	</column>
	<column>
		
	</column>
</columns>
---

### サブテキストについて
<columns>
	<column>
		ContentHeaderにはTitleの上下にサブテキストを表示できます。<br>

	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		<synced_block url="https://www.notion.so/15831669571280f5b147e772dd289652#1853166957128086af06d3033a9eafee">
			**⚠️**<span color="red">**文章や説明を入れることは禁止です。<br>オブジェクトの補足情報を入れるために使用してください。**</span>
		</synced_block>

	</column>
	<column>
		
	</column>
</columns>

---

### 併用できるコンポーネントについて
⚠️<span color="red">**併用するコンポーネントがない場合、ContentHeaderではなく、Titleを使用してください。**</span>
<columns>
	<column>
		右側に使用できるのはButton,IconButton, ButtonGroup, Link<br>の4つのみです。
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		左側に使用できるのはIconButtonのみで、戻るを意味する\[\\<\]のみが使用できます。
	</column>
	<column>
		
	</column>
</columns>
<br>
---

### Titleが不要な場合について
<columns>
	<column>
		ContentHeaderはTitleとButton類を同時に使用するためのコンポーネントです。
		Titleが不要な場合はButtonそれらのコンポーネントを単体で使用してください。

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
import { LfAngleLeftMiddle, LfPlusLarge } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, IconButton } from "../../src/components/Button";
import type { ContentHeaderProps } from "../../src/components/ContentHeader";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
} from "../../src/components/ContentHeader";
import { Icon } from "../../src/components/Icon";
import { Link } from "../../src/components/Text";
import { Stack } from "../_utils/components";

const meta: Meta<typeof ContentHeader> = {
  component: ContentHeader,
  args: {
    children: [
      <ContentHeaderDescription variant="data" key={0}>
        Data
      </ContentHeaderDescription>,
      <ContentHeaderTitle key={1}>Title of the content</ContentHeaderTitle>,
      <ContentHeaderDescription key={2}>Caption</ContentHeaderDescription>,
    ],
  },
};

export default meta;

type Story = StoryObj<typeof ContentHeader>;

const ALL_SIZES: ContentHeaderProps["size"][] = [
  "xLarge",
  "large",
  "medium",
  "small",
  "xSmall",
];
/**
 * Use the `size` prop of `ContentHeader` to change the size of it.
 */
export const Size: Story = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <ContentHeader {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
};

/**
 * Use the `leading` prop of `ContentHeader` to add a leading element.
 * If you pass `Button` or `IconButton` to `leading` prop, the `size` and `variant`
 * props of them will be automatically adjusted unless you explicitly set them.
 */
export const Leading: Story = {
  args: {
    leading: (
      <IconButton aria-label="Go back">
        <Icon>
          <LfAngleLeftMiddle />
        </Icon>
      </IconButton>
    ),
  },
  render: (props) => (
    <ContentHeader {...props}>
      <ContentHeaderTitle key={0}>Title of the content</ContentHeaderTitle>
      <ContentHeaderDescription key={1}>
        Whereas recognition of the inherent dignity and of the equal and
        inalienable rights of all members of the human family is the foundation
        of freedom, justice and peace in the world.
      </ContentHeaderDescription>
    </ContentHeader>
  ),
};

/**
 * Use the `trailing` prop of `ContentHeader` to add a trailing element.
 * If you pass `Button` or `IconButton` to `leading` prop, the `size` and `variant`
 * props of them will be automatically adjusted unless you explicitly set them.
 */
export const Trailing: Story = {
  ...Leading,
  args: {
    trailing: (
      <ButtonGroup>
        <Button>Button</Button>
        <IconButton aria-label="Add">
          <Icon>
            <LfPlusLarge />
          </Icon>
        </IconButton>
      </ButtonGroup>
    ),
  },
};

/**
 * Use the `action` prop of `ContentHeader` to add an action element.
 * Unlike `trailing` where the element is placed at the end of the entire `ContentHeader`,
 * `action` will be placed next to the `ContentHeaderTitle`.
 * Supposed to be only used within `Dialog` or `Popover`.
 */
export const Action: Story = {
  ...Leading,
  args: {
    action: <Link href="#">Link</Link>,
  },
};

export const WithLongContent: Story = {
  args: {
    children: [
      <ContentHeaderDescription variant="data" key={0}>
        {"Description".repeat(40)}
      </ContentHeaderDescription>,
      <ContentHeaderTitle key={1}>{"Title".repeat(100)}</ContentHeaderTitle>,
      <ContentHeaderDescription key={2}>
        {"Caption".repeat(60)}
      </ContentHeaderDescription>,
    ],
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
