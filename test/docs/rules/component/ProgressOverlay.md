---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80be-b466-c0a020670701"
category: "Status"
---
# ProgressOverlay

💡 **ProgressOverlayは、進行中のプロセスやタスクの進捗を視覚的に表示するコンポーネントです。<br>主にコンテンツの表示待機中に前景要素として利用します。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280beb466c0a020670701#168316695712807d8a47fb156ad846a7"/>

---

# 使用時の注意点
<columns>
	<column>
		ProgressBarや、ProgressCircleが利用できない、<br>コンポー-ネントそのものの表示待機中に使用してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280beb466c0a020670701#16431669571280af88d7d213aed3f8f2"/>
	</column>
</columns>
<columns>
	<column>
		Buttonを押した後に描画までの時間がかかる場合は、ProgressOverlayを使用するのではなく、ButtonのLoadingStateを使用してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280beb466c0a020670701#17c31669571280e3be5fd777cf0bf0b0"/>
	</column>
</columns>

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280beb466c0a020670701#168316695712809b8eb6ff18c3591f1d"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import isChromatic from "chromatic/isChromatic";
import { Button } from "../../src/components/Button";
import {
  ContentHeader,
  ContentHeaderTitle,
} from "../../src/components/ContentHeader";
import {
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
} from "../../src/components/Popover";
import { ProgressOverlay } from "../../src/components/Progress";
import { Placeholder } from "../_utils/components";

export default {
  component: ProgressOverlay,
  render: (props) => {
    const [open, setOpen] = useState(isChromatic());

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <ProgressOverlay {...props} open={open} onClick={() => setOpen(false)}>
          Loading...
        </ProgressOverlay>
      </>
    );
  },
  args: {
    // TODO: Add default label to the component
    "aria-label": "Loading",
  },
} satisfies Meta<typeof ProgressOverlay>;

type Story = StoryObj<typeof ProgressOverlay>;

/**
 * Use the `value` prop of the `ProgressOverlay` to change the progress of it.
 */
export const WithProgress = {
  args: {
    value: 30,
  },
} satisfies Story;

export const Root = {
  render: (props) => {
    const [open, setOpen] = useState(isChromatic());
    const root = useRef<HTMLDivElement>(null);

    return (
      <div style={{ display: "flex", columnGap: "var(--aegis-space-medium)" }}>
        <div style={{ flexGrow: 1 }}>
          <Placeholder>Content</Placeholder>
        </div>
        <Placeholder style={{ width: 300, height: 200 }} ref={root}>
          Pane
          <Button onClick={() => setOpen(true)}>Open</Button>
          <ProgressOverlay
            {...props}
            open={open}
            onClick={() => setOpen(false)}
            root={root}
          >
            Loading...
          </ProgressOverlay>
        </Placeholder>
      </div>
    );
  },
} satisfies Story;

export const WithinPopover = {
  render: (props) => {
    const root = useRef<HTMLDivElement>(null);

    return (
      <Popover defaultOpen>
        <PopoverAnchor>
          <Button>Open</Button>
        </PopoverAnchor>
        <PopoverContent>
          <PopoverHeader>
            <ContentHeader>
              <ContentHeaderTitle>Title</ContentHeaderTitle>
            </ContentHeader>
          </PopoverHeader>
          <PopoverBody ref={root}>
            <Placeholder>Content</Placeholder>
            <ProgressOverlay {...props} open root={root} />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
