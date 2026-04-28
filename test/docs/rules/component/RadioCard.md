---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80ed-82d5-ce899096debe"
category: "Inputs"
---
# RadioCard

💡 **RadioCardは、Radioと違い、サブテキストやその他のオブジェクトを含めることができるコンポーネントです。**

---
▶# 👉Examples
	
<notion-embed url="https://www.notion.so/15831669571280ed82d5ce899096debe#168316695712800abe96daced5aca40b"/>

---

# 使用時の注意点
## 類似コンポーネントとの使い分け
<columns>
	<column>
		インナー要素が”テキスト”だけの場合Radio（RadioGroup）の使用を検討してください。
		`RadioCard`はサブテキストを含めることができますが、これは最終手段と考えてください。多くの情報を提供すると、かえってユーザーを混乱させる可能性があります。まずは、補足情報を必要としない分かりやすいラベルを検討し、シンプルな`Radio`コンポーネントの使用を第一に考えてください。どうしても追加の説明が必要な場合にのみ、`RadioCard`の使用を検討します。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280ed82d5ce899096debe#16531669571280aa9beee051899a0778"/>
	</column>
</columns>
---
# Q&A
- **Q:** `Form`の中で使用しても問題ないでしょうか？
- **A:** はい、使用できます。ただし、`TextField`のような他の`FormControl`コンポーネントと一緒に使うと、ラベル周りの余白（padding）の違いから見た目にズレが生じるため、あまり推奨はされません。`Form`の中で複数の選択肢から1つを選ばせる場合は、代わりに`RadioGroup`を使うことを検討してください。

Q: {内容を書く}
A: {内容を書く}
<notion-embed url="https://www.notion.so/15831669571280ed82d5ce899096debe#16831669571280fcabd4c373a281b143"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "../../src/components/Divider";
import type { RadioCardProps } from "../../src/components/Radio";
import { RadioCard } from "../../src/components/Radio";
import { Stack } from "../_utils/components";

const meta: Meta<typeof RadioCard> = {
  component: RadioCard,
  args: {
    name: "radio",
    children: "Label",
  },
};

export default meta;

type Story = StoryObj<typeof RadioCard>;

const ALL_VARIANTS = ["plain", "outline"] as const;
/**
 * Use the `variant` prop of the `RadioCard` to change the variant of it.
 */
export const Variant = {
  render: (args) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <RadioCard {...args} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_SIZES: RadioCardProps["size"][] = ["large", "medium", "small"];
/**
 * Use the `size` prop of the `RadioCard` to change the size of it.
 */
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <RadioCard {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `disabled` prop of the `RadioCard` to `true` to disable it.
 */
export const Disabled = {
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
