---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8059-83d8-c7f4beee38d7"
category: "Content"
---
# Icon

💡 **Iconは、ビジュアル要素として各コンポーネントの中で利用します。<br>一部の例外を除き、アイコン単独で使うことはできません。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/158316695712805983d8c7f4beee38d7#168316695712802285c1f38a9502f353"/>

---

# 使用時の注意点
### バッジの表示について
<columns>
	<column>
		Iconの右上と左上にBadgeの表示が可能です。<br>基本的に右上を使用してください。
		アイコンによっては右上だとIcon認知が取れない場合があります。その際は左上の使用も許容します。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/158316695712805983d8c7f4beee38d7#164316695712807ebde0e8a48152ee2b"/>
	</column>
</columns>

### アイコンの作成について
新しいアイコンを作成する際の基本原則や、Figmaでの具体的な作成・書き出し方法については、以下のページを参照してください。
<mention-page url="https://www.notion.so/18131669571280a6abefc04b34ab7d39"/>

---

# アイコン検索

適切なアイコンを見つけるには、キーワードデータベースを活用してください。

- **キーワードデータベース**: `skills/icon-finder/IconKeywords.md`
- **検索スキル**: `/icon-finder {キーワード}` で検索

```bash
# 例: 検索関連のアイコンを探す
rg "検索" skills/icon-finder/IconKeywords.md
```

`rg` が使えない場合は `grep` を使う:

```bash
grep "検索" skills/icon-finder/IconKeywords.md
```

よく使うアイコン:
| 用途 | アイコン |
|------|---------|
| 検索 | `LfMagnifyingGlass` |
| 削除 | `LfTrash` |
| 追加 | `LfPlusLarge` |
| 設定 | `LfSetting` |
| 警告 | `LfWarningTriangle` |

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/158316695712805983d8c7f4beee38d7#168316695712803ea06fe0abd53b0258"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import * as ALL_ICONS from "@legalforce/aegis-icons";
import { LfAlignCenter } from "@legalforce/aegis-icons";
import { size } from "@legalforce/aegis-tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { IconProps } from "../../src/components/Icon";
import { Icon } from "../../src/components/Icon";
import { Grid, Stack } from "../_utils/components";

export default {
  component: Icon,
  args: {
    children: <LfAlignCenter />,
  },
} satisfies Meta<typeof Icon>;

type Story = StoryObj<typeof Icon>;

export const Size = {
  render: (props) => {
    return (
      <Stack>
        {Object.keys(size).map((size) => (
          <Icon {...props} size={size as IconProps["size"]} key={size} />
        ))}
      </Stack>
    );
  },
} satisfies Story;

export const All = {
  parameters: {
    docs: {
      canvas: {
        sourceState: "none",
      },
    },
  },
  render: (props) => (
    <Grid>
      {Object.entries(ALL_ICONS).map(([name, Source]) => (
        <Grid.Item key={name}>
          {name}
          <Grid.Visual>
            <Icon {...props} aria-label={name}>
              <Source />
            </Icon>
          </Grid.Visual>
        </Grid.Item>
      ))}
    </Grid>
  ),
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
