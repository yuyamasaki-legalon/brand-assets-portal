---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80d7-b6c8-c88d6becc139"
category: "Surface"
---
# BottomSheet

💡 **BottomSheetは、画面の下部からスライドアップするコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280d7b6c8c88d6becc139#1683166957128060b903cb2e29ce7bac"/>

---

# 使用時の注意点
特になし

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280d7b6c8c88d6becc139#1683166957128022aff3dd505be1dc46"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useState } from "react";
import { LfWand } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import isChromatic from "chromatic/isChromatic";
import { userEvent, within } from "storybook/test";
import { BottomSheet } from "../../src/components/BottomSheet";
import { Button } from "../../src/components/Button";
import { Placeholder } from "../_utils/components";

export default {
  component: BottomSheet,
  render: function Render(props) {
    const [open, setOpen] = useState(isChromatic());
    return (
      <>
        <Button onClick={() => setOpen((prev) => !prev)}>Mount</Button>
        {open && <BottomSheet {...props} />}
      </>
    );
  },
  args: {
    children: [
      <BottomSheet.Button leading={LfWand} key={0}>
        Button
      </BottomSheet.Button>,
      <BottomSheet.Panel key={1}>
        <BottomSheet.Body>
          <Placeholder>Placeholder</Placeholder>
          <Placeholder>Placeholder</Placeholder>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <Button>Button</Button>
        </BottomSheet.Footer>
      </BottomSheet.Panel>,
    ],
  },
} satisfies Meta<typeof BottomSheet>;

type Story = StoryObj<typeof BottomSheet>;

export const Open = {
} satisfies Story;

export const WithLongBody = {
  ...Open,
  parameters: {
    a11y: {
      // Most likely just a timing issue in Vitest.
      test: "todo",
    },
  },
  args: {
    children: [
      <BottomSheet.Button leading={LfWand} key={0}>
        Button
      </BottomSheet.Button>,
      <BottomSheet.Panel key={1}>
        <BottomSheet.Body>
          <Placeholder style={{ minHeight: "120vh" }}>Placeholder</Placeholder>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <Button>Button</Button>
        </BottomSheet.Footer>
      </BottomSheet.Panel>,
    ],
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
