---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-809d-ad5f-c8bc0c9f8782"
category: "Navigation"
---
# SegmentedControl

💡 **SegmentedControlは、選択肢が限られて、<br>それぞれの選択肢が同じレベルの重要度を持つ場合に使用するコンポーネントです。<br><br>**Tabsと併用する場合はTabsの方が上位概念です。SegmentedControlはTabsの下層要素として使用してください。

---
▶# 👉Examples
	

---

# 使用時の注意点
### サイズについて
mediumがデフォルトの値です。
特に理由がなければmediumを使用してください

---

### 色について
<columns>
	<column>
		**solid**<br>単独で使用する場合はこちらが推奨です。

		<span discussion-urls="discussion://19e31669-5712-8086-aa43-001c89990f7a">**plain**</span><span discussion-urls="discussion://19e31669-5712-8086-aa43-001c89990f7a"><br>サブ要素としての使用は</span><span discussion-urls="discussion://19e31669-5712-8086-aa43-001c89990f7a">**plain**</span><span discussion-urls="discussion://19e31669-5712-8086-aa43-001c89990f7a">を使用してください。<br>Tabsの小要素として使用する場合や、そのほかのボタン類が上部にある場合などが該当します。</span>

	</column>
	<column>
		
	</column>
</columns>

---

### <span discussion-urls="discussion://17431669-5712-8063-857d-001c638fdeb0">TabsとSegmentedControlの違いについて</span>
<columns>
	<column>
		<synced_block url="https://www.notion.so/158316695712809dad5fc8bc0c9f8782#188316695712809cbb75f73f07074a35">
			SegmentedControlは、切り替えるコンテンツの内容がほぼ同一で、フィルタリングや、並べ替え程度の変化しかない場合に使用します。
		</synced_block>
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		<synced_block url="https://www.notion.so/158316695712809dad5fc8bc0c9f8782#188316695712801e9bc0f22f942b2a2b">
			切り替えるコンテンツの内容が大きく変化する場合はTabsを使用してください。
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
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl } from "../../src/components/SegmentedControl";
import { Stack } from "../_utils/components";

const meta: Meta<typeof SegmentedControl> = {
  component: SegmentedControl,
  args: {
    children: Array.from({ length: 5 }, (_, index) => (
      <SegmentedControl.Button key={index}>
        Button {index}
      </SegmentedControl.Button>
    )),
  },
};

export default meta;

type Story = StoryObj<typeof SegmentedControl>;

const ALL_VARIANTS = ["plain", "solid"] as const;
export const Variant: Story = {
  render: (args) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <SegmentedControl {...args} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
};

const ALL_SIZES = ["xSmall", "small", "medium"] as const;
export const Size: Story = {
  render: (args) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <SegmentedControl {...args} size={size} key={size} />
      ))}
    </Stack>
  ),
};

export const Weight = {
  ...Variant,
  args: {
    weight: "bold",
  },
} satisfies Story;

export const ButtonDisabled = {
  args: {
    children: Array.from({ length: 3 }, (_, index) => (
      <SegmentedControl.Button key={index} disabled={index === 1}>
        Button {index}
      </SegmentedControl.Button>
    )),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
