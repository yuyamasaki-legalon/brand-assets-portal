---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-808d-a0ab-ea6cfecd724f"
category: "Content"
---
# InformationCard

💡 **InformationCardは、案件情報、契約書情報など、オブジェクト情報を整理して表示する際に使用するコンポーネントです。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/158316695712808da0abea6cfecd724f#168316695712800c9c7efbb9e432db59"/>

---

# 使用時の注意点
⚠️<span color="red">**サービス内にあるファイルや契約などのオブジェクトの表現に使用してください。<br>カードレイアウトを表現するための利用はしないでください。**</span>
中に入れる情報が多いと、高さ方向のサイズが増大します。<br>表示する情報量には注意してください。多すぎる場合はPopover等の利用を検討してください。

---

### IconButtonの制限について
<columns>
	<column>
		"Within Button Group"のIconButtonは以下の３つのみとしてください。
		- [+]追加
		- [-],[x]削除
		- […]その他
	</column>
	<column>
		<notion-embed url="https://www.notion.so/158316695712808da0abea6cfecd724f#164316695712806a8a02d7e0331feee6"/>
	</column>
</columns>
<columns>
	<column>
		Within Button Groupの右端で使用されるIconButtonにもTooltipが必要です。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/158316695712808da0abea6cfecd724f#16431669571280e7b3ebd95ae552a215"/>
	</column>
</columns>
<columns>
	<column>
		⚠️<span color="red">**Trailingの[>]アイコンは削除予定です。**</span>
	</column>
	<column>
		<notion-embed url="https://www.notion.so/158316695712808da0abea6cfecd724f#164316695712803e9807f0e5ca540c5c"/>
	</column>
</columns>

---

# Q&A
Q: [https://legal-force.slack.com/archives/C042TJ2TV5M/p1736303810831169](https://legal-force.slack.com/archives/C042TJ2TV5M/p1736303810831169)
A: {内容を書く}

<notion-embed url="https://www.notion.so/158316695712808da0abea6cfecd724f#1683166957128025bd97ec4fca469397"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import {
  LfAngleRightMiddle,
  LfFile,
  LfPlusSmall,
} from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "../../src/components/_ScrollArea";
import { Button, ButtonGroup, IconButton } from "../../src/components/Button";
import { Icon } from "../../src/components/Icon";
import {
  InformationCard,
  InformationCardDescription,
  InformationCardLink,
} from "../../src/components/InformationCard";
import { Stack } from "../_utils/components";

export default {
  component: InformationCard,
  args: {
    children: "contract_001_ja.pdf",
  },
} satisfies Meta<typeof InformationCard>;

type Story = StoryObj<typeof InformationCard>;

export const Leading = {
  args: {
    leading: (
      <Icon>
        <LfFile />
      </Icon>
    ),
  },
} satisfies Story;

export const Trailing = {
  args: {
    trailing: (
      <InformationCardDescription size="small">Text</InformationCardDescription>
    ),
  },
  render: ({ trailing, ...rest }) => {
    return (
      <Stack>
        <InformationCard {...rest} trailing={trailing} />
        <InformationCard
          {...rest}
          trailing={
            <>
              {trailing}
              <Button>Button</Button>
            </>
          }
        />
        <InformationCard
          {...rest}
          trailing={
            <Icon>
              <LfAngleRightMiddle />
            </Icon>
          }
        />
      </Stack>
    );
  },
} satisfies Story;

export const Action = {
  args: {
    ...Leading.args,
    ...Trailing.args,
    action: (
      <IconButton aria-label="Some action">
        <Icon>
          <LfPlusSmall />
        </Icon>
      </IconButton>
    ),
  },
} satisfies Story;

/**
 * Use `InformationCardDescription` to put descriptions.
 */
export const WithDescription = {
  args: {
    ...Leading.args,
    ...Trailing.args,
    children: [
      "contract_001_ja.pdf",
      <InformationCardDescription key={0}>
        application/pdf
      </InformationCardDescription>,
      <InformationCardDescription key={1} variant="data">
        08/22/2023
      </InformationCardDescription>,
    ],
  },
} satisfies Story;

/**
 * Use the `loading` prop of the `InformationCard` to make it loading.
 */
export const Loading = {
  args: {
    ...Action.args,
    loading: true,
  },
} satisfies Story;

/**
 * Use the `loading` prop of the `InformationCard` to make it loading.
 */
export const Disabled = {
  args: {
    ...WithDescription.args,
    disabled: true,
  },
} satisfies Story;

export const WithLink = {
  args: {
    ...Action.args,
    children: [
      <InformationCardDescription key={0}>
        application/pdf
      </InformationCardDescription>,
      <InformationCardDescription key={1} variant="data">
        08/22/2023
      </InformationCardDescription>,
    ],
  },
  render: ({ children, ...rest }) => (
    <Stack>
      <InformationCard {...rest}>
        <InformationCardLink href="#">contract_001_ja.pdf</InformationCardLink>
        {children}
      </InformationCard>
      <InformationCard {...rest}>
        <InformationCardLink href="#">contract_001_ja.pdf</InformationCardLink>
        {children}
        <ButtonGroup>
          <Button>Button</Button>
          <Button>Button</Button>
        </ButtonGroup>
      </InformationCard>
    </Stack>
  ),
} satisfies Story;

export const WithButtonGroup = {
  args: {
    ...Leading.args,
    children: [
      "contract_001_ja.pdf",
      <ButtonGroup key={0}>
        <Button>Button</Button>
        <Button>Button</Button>
      </ButtonGroup>,
    ],
  },
} satisfies Story;

export const WithLongTitle = {
  args: {
    ...Action.args,
    trailing: (
      <InformationCardDescription variant="data" size="small">
        PDF Document
      </InformationCardDescription>
    ),
    children: [
      "contract_001_ja".repeat(30),
      <InformationCardDescription key={0}>
        {"application/pdf".repeat(30)}
      </InformationCardDescription>,
    ],
  },
  render: (props) => (
    <ScrollArea>
      <InformationCard {...props} />
    </ScrollArea>
  ),
} satisfies Story;

/**
 * **Deprecated Usage**. This story is to make sure that the deprecated APIs still work.
 */
export const Deprecated = {
  render: (props) => (
    <Stack>
      <InformationCard {...props} icon={LfFile}>
        <InformationCard.Body>
          <InformationCard.Title>contract_001_ja</InformationCard.Title>
          <InformationCard.Description>
            application/pdf
          </InformationCard.Description>
        </InformationCard.Body>
      </InformationCard>
      <InformationCard {...props} icon={LfFile} clickable>
        <InformationCard.Body>
          <InformationCard.Title>contract_001_ja</InformationCard.Title>
          <InformationCard.Description>
            application/pdf
          </InformationCard.Description>
          <ButtonGroup>
            <Button>Button</Button>
            <Button>Button</Button>
          </ButtonGroup>
        </InformationCard.Body>
        <Icon>
          <LfAngleRightMiddle />
        </Icon>
      </InformationCard>
      <InformationCard {...props} icon={LfFile} clickable>
        <InformationCard.Body>
          <InformationCard.Title>contract_001_ja</InformationCard.Title>
          <InformationCard.Description>
            application/pdf
          </InformationCard.Description>
        </InformationCard.Body>
        <Button>Button</Button>
      </InformationCard>
      <InformationCard {...props} icon={LfFile} clickable>
        <InformationCard.Body>
          <InformationCard.Title>
            {"contract_001_ja".repeat(30)}
          </InformationCard.Title>
          <InformationCard.Description>
            {"application/pdf".repeat(30)}
          </InformationCard.Description>
        </InformationCard.Body>
      </InformationCard>
      <ButtonGroup attached variant="subtle">
        <InformationCard {...props} icon={LfFile} clickable>
          <InformationCard.Body>
            <InformationCard.Title>contract_001_ja</InformationCard.Title>
          </InformationCard.Body>
        </InformationCard>
        <IconButton aria-label="Some action">
          <Icon>
            <LfPlusSmall />
          </Icon>
        </IconButton>
      </ButtonGroup>
    </Stack>
  ),
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
