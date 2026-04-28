---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80d9-af95-e6b750c1ba8a"
category: "Content"
---
# EmptyState

## 関連レシピ

- [空状態 (EmptyState)](../../aegis-recipes/empty-state.md)
- [メンテナンス/エラーページの EmptyState](../../aegis-recipes/maintenance-empty-state.md)
- [TagPicker カスタム候補 + EmptyState](../../aegis-recipes/tagpicker-custom-options.md)


💡 **EmptyStateは、データやコンテンツがないときに表示されるコンポーネントです。<br>ユーザーに情報がないことを知らせ、何をすべきかのガイダンスを提供します。**

---
▶# 👉Examples
	

---

# 使用時の注意点
EmptyStateを表示する場所によって、使用できるサイズVisualType(Illust,Iconなど)が決まっています。<br>また、Popover、Dialog、Menu内では、いかなるVisualTypeも使用しないでください。
Emptyケースに表示するテキストは、テキストガイドラインの<span discussion-urls="discussion://16031669-5712-801a-a2a9-001c51507151">[エンプティケース](/07b255405daa423c8612edda2a5e94a0?pvs=25)</span><span discussion-urls="discussion://16031669-5712-801a-a2a9-001c51507151"> </span>を参照してください。

---

### サイズについて
<columns>
	<column>
		**large（FullScreen）**<br>ページ全体に表示させるときに利用します。<br>エラーページ（404ページなど）が該当します。
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		**medium（Main）**<br>ページのメインコンテンツ内で表示するときに利用します。

	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		<span discussion-urls="discussion://16031669-5712-8070-867b-001c399ee6b9">**small（Pane&Dialog&Drawer）**</span><br>Pane、Dialog、Drawerや、<br>ComboboxのMenu（選択肢が表示される部分）等で利用します。

	</column>
	<column>
		
	</column>
</columns>
---

### Illustの使用について
<columns>
	<column>
		**large**
		Illust,Icon両方が使用できます。<br><span discussion-urls="discussion://17531669-5712-806e-b0bd-001ce0e18d90">⚠️</span><span color="red" discussion-urls="discussion://17531669-5712-806e-b0bd-001ce0e18d90">**猫イラストはlargeサイズでのみ使用可能です。また、エラーやメンテナンス時などのあまりお客様の目に触れない場所、かつ謝罪系の場面のみに使用できます。**</span>

	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		読み込み失敗、不明エラーの発生時など
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		メンテナンス
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		ページ閲覧不可

	</column>
	<column>
		
	</column>
</columns>

<columns>
	<column>
		**medium**<br>Illust,Icon両方が使用できます。
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		検索ヒットなし

	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		格納なし<br>ユーザー自身が格納していくページの初期値
		例）契約書一覧など
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		登録なし
		ユーザー自身が設定していくページの初期値<br>例）チェック設定、プレイブックなど
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		使用用途がないので非推奨扱いとします。
	</column>
	<column>
		
	</column>
</columns>

<columns>
	<column>
		**small**<br>Illustの使用は禁止です。<br>Iconのみが使用できます。
	</column>
	<column>
		
	</column>
</columns>

---

# Q&A
Q: Empty Stateのsmall（Pane&Dialog&Drawer）を使う際のアイコンの選び方について質問いたします。以下のケースにIconをWarningに指定していますが、正しい使い方になっていますか？
1. 検索ヒットなし
2. 格納なし
3. 登録なし
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { ErrorCat3 } from "@legalforce/aegis-illustrations/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../src/components/Button";
import type { EmptyStateProps } from "../../src/components/EmptyState";
import { EmptyState } from "../../src/components/EmptyState";
import { Stack } from "../_utils/components";

const meta: Meta<typeof EmptyState> = {
  component: EmptyState,
  args: {
    visual: <ErrorCat3 />,
    title: "Title",
    action: <Button>Action</Button>,
    children: "Body of the EmptyState",
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

const ALL_SIZES: EmptyStateProps["size"][] = ["large", "medium", "small"];
/**
 * Use the size prop of the `EmptyState` to change the size of it.
 */
export const Size: Story = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <EmptyState {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
};

/**
 * Set the `orientation` prop of the `EmptyState` to `"horizontal"`
 * change the layout of it to horizontal.
 */
export const Orientation: Story = {
  args: {
    orientation: "horizontal",
  },
};

export const Visual: Story = {
  args: {
    visual: undefined,
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
