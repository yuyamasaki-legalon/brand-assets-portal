---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-802c-81c9-c563af6cb8f2"
category: "Feedback"
---
# Tooltip

## 関連レシピ

- [一覧ツールバー + 検索/フィルター](../../aegis-recipes/list-toolbar-and-search.md)
- [省略テキスト + Tooltip](../../aegis-recipes/overflow-tooltip.md)
- [Table.ActionCell + メニュー](../../aegis-recipes/table-action-cell-menu.md)


💡 **Tooltipは、ラベルがない要素の説明や、省略した要素の全文表示に使用します。**

---
▶# 👉Examples
	

---

# 使用時の注意点
<synced_block url="https://www.notion.so/158316695712802c81c9c563af6cb8f2#17d3166957128029ae20d9358dadc0b5">
	IconButtonや、テキストの省略表記\[…\]を使用する場合、必ずTooltipを使用してください。IconButtonにはボタンのラベルを、テキストの省略表記には省略した部分を含む全テキストをtooltipで表示してください。
</synced_block>
IconButtonのTooltipに関しては<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を確認してください。
<br>Aegisが提供するComponentに組み込まれているアイコンボタンには、以下のテキストのTooltipが表示されます。
| | 概要 | いる？いらん？ | 文言 - JP | 文言 - EN |
| :--- | :--- | :--- | :--- | :--- |
| **Banner** | 閉じるボタン | ⭕️ いる | `閉じる` | Close |
| **Calendar** | 年 / 月の切り替え | ⭕️ いる | `前月`　（前の月を表示）<br>`翌月`　（次の月を表示）<br>`月を選択`　<br>`年を選択` | Show previous month<br>Show next month<br>Select month<br>Select year |
| **Combobox** | 開閉 | <span color="gray">× いらん</span> | <span color="gray">×</span> | |
| **DateField / DatePicker / RangeDateField / RangeDatePicker** | • クリアボタン<br>• (Picker) 開閉ボタン | <span color="gray">× いらん</span> | <span color="gray">×</span> | |
| **Drawer** | 閉じるボタン | ⭕️ いる | `閉じる` | Close |
| **FileDrop** | 複数選択できる場合のDropdown | ⭕️ いる | `その他のアップロード`　（他のオプション） | More options |
| **Pagination** | **Pagination**戻る / 進むボタン | ⭕️ いる | `前へ`　（前のページへ）<br>`次へ`　（次のページへ） | Go to previous page<br>Go to next page |
| **Popover** | 閉じるボタン | ⭕️ いる | `閉じる` | Close |
| **Select** | クリアボタン | <span color="gray">× いらん</span> | | |
| **Snackbar** | 閉じるボタン | ⭕️ いる | `閉じる` | Close |
| **Table Head** | • スクロールボタン（すでにTooltipあり）<br>• メニュー開閉ボタン（[Storybook](https://main--634618c98b322242afd2ae10.chromatic.com/?path=/story/components-table--with-menu-label)） | ⭕️ いる | `メニューを表示` | Open menu |
| **Tag** | 消すボタン | <span color="gray">× いらん</span> | <span color="gray">×</span> | |
| **TextField** | クリアボタン | <span color="gray">× いらん</span> | <span color="gray">×</span> | |

---

### 配置位置について
配置位置のデフォルトはTop + Centerです。

---

### Fix Widthについて
<columns>
	<column>
		省略想定のテキストが長い場合または、<br>長くなる可能性がある場合、Tooltipの横幅を固定して使用してください。
	</column>
	<column>
		
	</column>
</columns>
---
### Tooltipに入る要素について
<columns>
	<column>
		<synced_block url="https://www.notion.so/158316695712802c81c9c563af6cb8f2#17d3166957128015b275c3ca2f91dfb2">
			Tooltipには説明文など、文章を入れないでください。<br>文章を入れる場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>の使用を検討してください。
		</synced_block>

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
import { useRef } from "react";
import { LfPlusCircle } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import isChromatic from "chromatic/isChromatic";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { Avatar } from "../../src/components/Avatar";
import { IconButton } from "../../src/components/Button";
import { Icon } from "../../src/components/Icon";
import { Link, Text } from "../../src/components/Text";
import { Tooltip } from "../../src/components/Tooltip";
import { Placeholder, Stack } from "../_utils/components";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  args: {
    defaultOpen: isChromatic(),
    title: "Title of the Tooltip",
    children: (
      <IconButton variant="plain" aria-label="Add">
        <Icon>
          <LfPlusCircle />
        </Icon>
      </IconButton>
    ),
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const WithAvatar: Story = {
  render: (props) => (
    <Tooltip {...props}>
      <Avatar name="John Doe" />
    </Tooltip>
  ),
};

export const Placement: Story = {
  render: (props) => (
    <Stack style={{ paddingBlock: 40 }}>
      <Stack direction="row" justify="space-around">
        {(["top-start", "top", "top-end"] as const).map((placement) => (
          <Tooltip {...props} key={placement} placement={placement} />
        ))}
      </Stack>
      <Stack direction="row" justify="space-around">
        {(["bottom-start", "bottom", "bottom-end"] as const).map(
          (placement) => (
            <Tooltip {...props} key={placement} placement={placement} />
          ),
        )}
      </Stack>
    </Stack>
  ),
};

export const OnlyOnOverflow: Story = {
  args: {
    onlyOnOverflow: true,
    defaultOpen: undefined,
    onOpenChange: fn(),
  },
  render: (props) => {
    const innerTextRef = useRef<HTMLElement>(null);

    return (
      <Stack>
        <Tooltip {...props} data-testid="0">
          <Text numberOfLines={1} style={{ width: 120 }}>
            {props.title}
          </Text>
        </Tooltip>
        <div>
          <Link href="#">
            <Tooltip {...props} data-testid="1">
              <Text numberOfLines={1}>{props.title}</Text>
            </Tooltip>
          </Link>
        </div>
        <Tooltip {...props} data-testid="2">
          <Text>{props.title}</Text>
        </Tooltip>
        <Tooltip {...props} onlyOnOverflow={innerTextRef} data-testid="3">
          <Placeholder>
            <Text ref={innerTextRef} numberOfLines={1} style={{ width: 120 }}>
              {props.title}
            </Text>
          </Placeholder>
        </Tooltip>
      </Stack>
    );
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
