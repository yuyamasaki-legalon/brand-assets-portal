---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8057-96b6-c7ff1f1708bb"
category: "Content"
---
# InformationCardGroup

💡 **InformationCardGroupは、InformationCardをGroup化したコンポーネントです。<br>Gapのばらつきを抑制することが主な目的です。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/158316695712805796b6c7ff1f1708bb#16831669571280edab6beda6876fd968"/>

---

# 使用時の注意点
Gapを変更しないでください。

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/158316695712805796b6c7ff1f1708bb#168316695712807e99f2e340f26b9d1a"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfFile, LfPlusSmall } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "../../src/components/Button";
import { Icon } from "../../src/components/Icon";
import {
  InformationCard,
  InformationCardDescription,
  InformationCardGroup,
  InformationCardLink,
} from "../../src/components/InformationCard";

export default {
  component: InformationCardGroup,
  args: {
    children: ["contract_001_ja.pdf", "contract_001_en.pdf"].map((filename) => (
      <InformationCard
        leading={
          <Icon>
            <LfFile />
          </Icon>
        }
        key={filename}
      >
        {filename}
        <InformationCardDescription>application/pdf</InformationCardDescription>
      </InformationCard>
    )),
  },
} satisfies Meta<typeof InformationCardGroup>;

type Story = StoryObj<typeof InformationCardGroup>;

/**
 * Use the `title` prop of the `InformationCardGroup` to set the title of it.
 */
export const WithTitle = {
  args: {
    title: "Files",
  },
} satisfies Story;

export const WithAction = {
  args: {
    children: ["contract_001_ja.pdf", "contract_001_en.pdf"].map((filename) => (
      <InformationCard
        key={filename}
        leading={
          <Icon>
            <LfFile />
          </Icon>
        }
        action={
          <IconButton aria-label="Some action">
            <Icon>
              <LfPlusSmall />
            </Icon>
          </IconButton>
        }
      >
        <InformationCardLink href="#">{filename}</InformationCardLink>
        <InformationCardDescription>application/pdf</InformationCardDescription>
      </InformationCard>
    )),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
