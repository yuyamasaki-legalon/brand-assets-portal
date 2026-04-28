---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80ed-82d5-ce899096debe"
category: "Inputs"
---
# CheckboxCard

💡 **CheckBoxCardは、選択肢の中から複数選択したい場合に使用します。<br>Checkboxと違い、サブテキストやAvatarなど装飾系のコンポーネントを含めることができます。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280ed82d5ce899096debe#168316695712800abe96daced5aca40b"/>

---

# 使用時の注意点
<columns>
	<column>
		インナー要素が”テキスト”だけの場合Radio（RadioGroup）の使用を検討してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280ed82d5ce899096debe"/>
	</column>
</columns>
---
## 類似コンポーネントとの使い分け
- **`RadioCard` vs `Radio`:** `RadioCard`はサブテキストを含めることができますが、これは最終手段と考えてください。多くの情報を提供すると、かえってユーザーを混乱させる可能性があります。まずは、補足情報を必要としない分かりやすいラベルを検討し、シンプルな`Radio`コンポーネントの使用を第一に考えてください。どうしても追加の説明が必要な場合にのみ、`RadioCard`の使用を検討します。
- **`Form` 内での使用:** `RadioCard` は `Form` 内で使用できますが、`TextField` のような他の `FormControl` コンポーネントと並べて使用すると、ラベルとの余白（padding）が異なり、見た目のズレが生じるため推奨されません。Form内で複数の選択肢を提示する場合は、`Radio` の使用を検討してください。
---
# Q&A
Q: {内容を書く}
A: {内容を書く}
<notion-embed url="https://www.notion.so/15831669571280ed82d5ce899096debe"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CheckboxCardProps } from "../../src/components/Checkbox";
import { CheckboxCard } from "../../src/components/Checkbox";
import { Divider } from "../../src/components/Divider";
import { Stack } from "../_utils/components";

const meta: Meta<typeof CheckboxCard> = {
  component: CheckboxCard,
  args: {
    children: "Label",
  },
};

export default meta;

type Story = StoryObj<typeof CheckboxCard>;

const ALL_COLORS: CheckboxCardProps["color"][] = [
  "gray",
  "neutral",
  "warning",
  "danger",
];
/**
 * Use the `color` prop of the `CheckboxCard` to change the color of it.
 */
export const Color = {
  render: (props) => (
    <Stack>
      {ALL_COLORS.map((color) => (
        <CheckboxCard {...props} color={color} key={color} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_VARIANTS = ["plain", "outline"] as const;
/**
 * Use the `variant` prop of the `CheckboxCard` to change the variant of it.
 */
export const Variant = {
  render: (args) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <CheckboxCard {...args} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_SIZES: CheckboxCardProps["size"][] = ["large", "medium", "small"];
/**
 * Use the `size` prop of the `CheckboxCard` to change the size of it.
 */
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <CheckboxCard {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `disabled` prop of the `CheckboxCard` to `true` to make it disabled.
 */
export const Disabled = {
  ...Color,
  args: {
    disabled: true,
    defaultChecked: true,
  },
} satisfies Story;

export const WithDivider = {
  args: {
    size: "large",
    children: [<Divider orientation="vertical" key={0} />, "Label"],
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
