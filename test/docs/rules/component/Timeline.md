---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-800e-98c0-d4c3caa7b1e9"
category: "Content"
---
# Timeline

💡 **Timelineは、バージョン管理のような履歴を表示するコンポーネントです。**

---
▶# 👉Examples
	

---

# 使用時の注意点
<columns>
	<column>
		Figmaではある程度の想定デザインを元に提供していますが、インナー要素のカスタマイズは自由に行えます。
	</column>
	<column>
		
	</column>
</columns>

---

### 並び順について
<columns>
	<column>
		並び順は"最上部が最新"に統一してください。
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
import { Tag } from "../../src/components/Tag";
import {
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineLink,
  TimelinePoint,
} from "../../src/components/Timeline";
import { Placeholder } from "../_utils/components";

export default {
  component: Timeline,
  args: {
    children: [0, 1, 1.2, 2].map((version) => (
      <TimelineItem
        key={version}
        aria-current={version === 1.2 ? "step" : false}
      >
        <TimelinePoint>
          <Tag>V{version}</Tag>
        </TimelinePoint>
        <TimelineContent>
          <Placeholder>
            <TimelineLink href={version === 1.2 ? undefined : "#"}>
              Content can be anything
            </TimelineLink>
          </Placeholder>
        </TimelineContent>
      </TimelineItem>
    )),
  },
} satisfies Meta<typeof Timeline>;

type Story = StoryObj<typeof Timeline>;

export const AsButton = {
  args: {
    children: [0, 1, 1.2, 2].map((version) => (
      <TimelineItem
        key={version}
        aria-current={version === 1.2 ? "step" : false}
      >
        <TimelinePoint>
          <Tag>V{version}</Tag>
        </TimelinePoint>
        <TimelineContent>
          <TimelineLink asChild>
            <button type="button">Content</button>
          </TimelineLink>
        </TimelineContent>
      </TimelineItem>
    )),
  },
} satisfies Story;

/**
 * Use the `disabled` prop to disable a TimelineItem.
 */
export const WithDisabledItem = {
  args: {
    children: [0, 1, 2, 3].map((version) => (
      <TimelineItem
        key={version}
        disabled={version === 1}
        aria-current={version === 2 ? "step" : false}
      >
        <TimelinePoint>
          <Tag>V{version}</Tag>
        </TimelinePoint>
        <TimelineContent>
          <TimelineLink href={version === 1 || version === 2 ? undefined : "#"}>
            Content
          </TimelineLink>
        </TimelineContent>
      </TimelineItem>
    )),
  },
} satisfies Story;

/**
 * **Deprecated Usage**. This story is to make sure that the deprecated APIs still work.
 */
export const Deprecated = {
  args: {
    children: [0, 1, 2, 3].map((version) => (
      <Timeline.Item
        key={version}
        disabled={version === 1}
        aria-current={version === 2 ? "step" : false}
      >
        <Timeline.Point>
          <Tag>V{version}</Tag>
        </Timeline.Point>
        <Timeline.Content>Content</Timeline.Content>
      </Timeline.Item>
    )),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
