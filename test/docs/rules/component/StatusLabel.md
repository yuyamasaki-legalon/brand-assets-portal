---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8097-8164-c4dc21932f52"
category: "Content"
---
# StatusLabel

## 関連レシピ

- [ステータス表示 + タグ](../../aegis-recipes/status-and-tags.md)
- [詳細ヘッダー（ステータス + アクション）](../../aegis-recipes/detail-header.md)


💡 **StatusLabelは、アイテムの状態（ステータス）を表現する際に使用します。<br>**状態（ステータス）を表現するものではない場合<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を利用してください。

---
▶# 👉Examples
	

---

# 使用時の注意点
以下のような情報にStatuslabelを使用してください。
- 進行状況の表示
- システムの状態
- フィードバック
- <span discussion-urls="discussion://16031669-5712-8039-82b5-001ca0f5634f">バージョン情報</span>
<br>⚠️<span color="red">**以下のような情報にStatuslabelは使用禁止です。Tagを使用してください。**</span>
- カテゴリ
- 属性
- 情報（社名、個人名など）

---
### 配置について
Status Labelはステータスであること、またはボタンではないということがわかりやすい配置で利用してください。

---

### スタイルについて
**Variant（fill）+ Color（neutral）**<br>この組み合わせは、Buttonと区別がつきません。<br>テーブルのカラムや、リストでのインナーアイテムなど、複数アイテムの状態を一覧する場合や、付近にButtonがない箇所での使用を推奨します。

---

### <span discussion-urls="discussion://16031669-5712-8043-a2df-001c9c9b2399">色について</span>
<columns>
	<column>
		黒（neutral）・灰色（gray）以外の色を使用する場合は、なるべくfillを使用してください。<br>outlineでは色の差が見づらく、色を変更する利点が失われるためです。
		<br>また色の意味を考慮して選定してください<br>Bannerと同様に<span color="red">赤</span>、<span color="yellow">黄</span>、<span color="blue">青</span>、<span color="green">緑</span>には色の意味が含まれるので、使用の際に考慮してください。
	</column>
	<column>
		
	</column>
</columns>

---

### inline style による色変更の禁止

StatusLabel の色は必ず `color` prop を使用してください。inline style や className による色の上書きは禁止です。

**NG: inline style で色を変更**
```tsx
<StatusLabel
  variant="outline"
  style={status === "in_progress" ? { color: "var(--aegis-color-error-60)" } : {}}
>
  {label}
</StatusLabel>
```

**OK: color prop を使用**
```tsx
<StatusLabel variant="fill" color="red">
  {label}
</StatusLabel>
```

---

### statusConfig パターン

ステータスに応じて StatusLabel の表示を切り替える場合は、`statusConfig` に `label`・`color`・`variant` の3つを必ず含めてください。

```tsx
const statusConfig: Record<Status, { label: string; color: StatusLabelProps["color"]; variant: StatusLabelProps["variant"] }> = {
  in_progress: { label: "対応中", color: "red", variant: "fill" },
  completed: { label: "完了", color: "teal", variant: "fill" },
  pending: { label: "未着手", color: "neutral", variant: "outline" },
};

<StatusLabel color={statusConfig[status].color} variant={statusConfig[status].variant}>
  {statusConfig[status].label}
</StatusLabel>
```

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { modes } from "../../.storybook/modes";
import type { StatusLabelProps } from "../../src/components/StatusLabel";
import { StatusLabel } from "../../src/components/StatusLabel";
import { Stack } from "../_utils/components";

const meta: Meta<typeof StatusLabel> = {
  component: StatusLabel,
  args: {
    children: "Status",
  },
};

export default meta;

type Story = StoryObj<typeof StatusLabel>;

const ALL_VARIANTS: StatusLabelProps["variant"][] = ["outline", "fill"];
/**
 * Use the `variant` prop of the `StatusLabel` to change the variant of it.
 */
export const Variant: Story = {
  render: (props) => (
    <Stack direction="row">
      {ALL_VARIANTS.map((variant) => (
        <StatusLabel {...props} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
};

const ALL_SIZES: StatusLabelProps["size"][] = [
  "xLarge",
  "large",
  "medium",
  "small",
];
/**
 * Use the `size` prop of the `StatusLabel` to change the size of it.
 */
export const Size: Story = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  render: (props) => (
    <Stack direction="row">
      {ALL_SIZES.map((size) => (
        <StatusLabel {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
};

const ALL_COLORS: StatusLabelProps["color"][] = [
  "neutral",
  "red",
  "yellow",
  "blue",
  "teal",
  "gray",
  "purple",
  "magenta",
  "orange",
  "lime",
  "indigo",
];
/**
 * Use the `color` prop of the `StatusLabel` to change the color of it.
 */
export const Color: Story = {
  render: (props) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <Stack direction="row" key={variant}>
          {ALL_COLORS.map((color) => (
            <StatusLabel
              {...props}
              color={color}
              variant={variant}
              key={color}
            />
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const MinWidth: Story = {
  args: {
    children: "Status",
  },
  render: (props) => {
    return (
      <Stack>
        <StatusLabel {...props} minWidth="x13Large" />
        <StatusLabel {...props} minWidth="x9Large" />
        <StatusLabel {...props} minWidth="x5Large" />
        <StatusLabel {...props} minWidth="xLarge" />
        <StatusLabel {...props} minWidth="small" />
      </Stack>
    );
  },
};

export const MaxWidth: Story = {
  args: {
    children: "Status Status Status",
  },
  render: (props) => {
    return (
      <Stack>
        <StatusLabel {...props} maxWidth="x13Large" />
        <StatusLabel {...props} maxWidth="x9Large" />
        <StatusLabel {...props} maxWidth="x5Large" />
        <StatusLabel {...props} maxWidth="xLarge" />
        <StatusLabel {...props} maxWidth="small" />
      </Stack>
    );
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
