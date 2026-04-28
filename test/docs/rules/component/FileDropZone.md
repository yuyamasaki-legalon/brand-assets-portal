---
paths: src/**/*.{ts,tsx}
notion_page_id: "17331669-5712-80b9-bb5e-e85f8cfb57be"
category: "Pickers"
---
# FileDropZone

💡 **FileDropZoneは、ローカルにあるファイルを直接画面内にドラッグ&ドロップでアップロードするためのコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/17331669571280b9bb5ee85f8cfb57be#17331669571280fc9f81c48d0396179a"/>

---

# 使用時の注意点
<columns>
	<column>
		FileDropZoneはアップロードする対象のコンポーネント上で使用してください。<br>
	</column>
	<column>
		<notion-embed url="https://www.notion.so/17331669571280b9bb5ee85f8cfb57be#17431669571280a79fb9dac634edd0f6"/>
		<notion-embed url="https://www.notion.so/17331669571280b9bb5ee85f8cfb57be#1743166957128048a92bc91a243216f6"/>
	</column>
</columns>

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/17331669571280b9bb5ee85f8cfb57be#917d29abc1ca4704a2f6cfee66944aa2"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fireEvent, within } from "storybook/test";
import { FileDropZone } from "../../src/components/FileDrop";
import { Text } from "../../src/components/Text";
import { Placeholder } from "../_utils/components";

export default {
  component: FileDropZone,
  args: {
    children: <Placeholder style={{ height: 200 }}>Placeholder</Placeholder>,
  },
} satisfies Meta<typeof FileDropZone>;

type Story = StoryObj<typeof FileDropZone>;

export const DragEnter = {
} satisfies Story;

export const Title = {
  ...DragEnter,
  args: {
    title: (
      <Text whiteSpace="pre">
        {"Drop here to upload\nyour files to the space"}
      </Text>
    ),
  },
} satisfies Story;

export const Icon = {
  ...DragEnter,
  args: {
    icon: false,
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
