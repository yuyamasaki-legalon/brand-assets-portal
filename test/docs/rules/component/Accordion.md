---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80c8-80be-d5af98f88e9b"
category: "Navigation"
---
# Accordion

💡 **Accordionは、表示したい要素を展開して表示したり、折りたたんで隠したりするためのコンポーネントです。<br>補足的な情報を折りたたんで画面をシンプルに保つことで、情報量が増えてもユーザーが重要な情報にたどりつきやすくなります。<br>また、ページの要素が多くスクロールが生じる画面において、まず見出しだけを表示してユーザーに全体像を把握させたい場合にも使用できます。**

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280c880bed5af98f88e9b#1683166957128087aca6e29268d3f278"/>

---

# 使用時の注意点
⚠️<span color="red">**ヘッダーは要素全体がButtonという扱いです。<br>よって、要素内にボタンなどを追加する事はできません。**</span>
多用しすぎると1画面の情報量が増えユーザーの使いづらさに繋がります。
インナー要素が完全に隠れるので、タイトルで判断できる要素に使用してください。

---

### アイコンの位置について
<columns>
	<column>
		[▽]アイコンはデフォルトでは右側に配置されますが、右左どちらにも設置可能です。<br>広いエリアでアコーディオンを使用する場合、左側配置を検討してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280c880bed5af98f88e9b#165316695712804c8ef5e2d029c974c1"/>
	</column>
</columns>

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280c880bed5af98f88e9b#168316695712801d835ccf260ba71814"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfAiSparkles } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { AccordionProps } from "../../src/components/Accordion";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "../../src/components/Accordion";
import { Icon } from "../../src/components/Icon";
import { Text } from "../../src/components/Text";
import { Stack } from "../_utils/components";

const PANEL_BODY = `Whereas recognition of the inherent dignity and of the equal and
inalienable rights of all members of the human family is the
foundation of freedom, justice and peace in the world.`;

export default {
  component: Accordion,
  args: {
    children: Array.from({ length: 3 }, (_, i) => (
      <AccordionItem key={i}>
        <AccordionButton>Title {i}</AccordionButton>
        <AccordionPanel>{PANEL_BODY}</AccordionPanel>
      </AccordionItem>
    )),
  },
} satisfies Meta<typeof Accordion>;

type Story = StoryObj<typeof Accordion>;

/**
 * Set the `multiple` prop of the `Accordion` to `true` to permit multiple sections to be expanded at the same time.
 */
export const ExpandMultiple = {
  args: {
    defaultIndex: [0],
    multiple: true,
  },
} satisfies Story;

const ALL_SIZES: AccordionProps["size"][] = ["large", "medium", "small"];
/**
 * Use the `size` prop of the `Accordion` to change the size of it.
 */
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Accordion {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `bordered` prop of the `Accordion` to `true` to add a border to each section.
 */
export const Bordered = {
  args: {
    bordered: true,
  },
} satisfies Story;

/**
 * Set the `width` prop of the `AccordionButton` to `auto` to make it fit the content.
 */
export const ButtonWidth = {
  args: {
    children: (
      <AccordionItem>
        <AccordionButton width="auto">Title</AccordionButton>
        <AccordionPanel>{PANEL_BODY}</AccordionPanel>
      </AccordionItem>
    ),
  },
} satisfies Story;

/**
 * Set the `icon` prop of the `AccordionButton` to change the icon.
 * When it is set, the rotate animation will be disabled.
 */
export const ButtonIcon = {
  args: {
    children: (
      <AccordionItem>
        <AccordionButton
          icon={
            <Icon>
              <LfAiSparkles />
            </Icon>
          }
        >
          Title
        </AccordionButton>
        <AccordionPanel>{PANEL_BODY}</AccordionPanel>
      </AccordionItem>
    ),
  },
} satisfies Story;

export const ButtonIconPosition = {
  args: {
    children: (
      <AccordionItem>
        <AccordionButton iconPosition="start">Title</AccordionButton>
        <AccordionPanel>{PANEL_BODY}</AccordionPanel>
      </AccordionItem>
    ),
  },
} satisfies Story;

/**
 * Set the `variant` prop of the `AccordionButton` to change the variant.
 */
export const ButtonVariant = {
  args: {
    children: [
      <AccordionItem key={0}>
        <AccordionButton variant="solid">Title</AccordionButton>
        <AccordionPanel>{PANEL_BODY}</AccordionPanel>
      </AccordionItem>,
      <AccordionItem key={1}>
        <AccordionButton variant="subtle">Title</AccordionButton>
        <AccordionPanel>{PANEL_BODY}</AccordionPanel>
      </AccordionItem>,
      <AccordionItem key={2}>
        <AccordionButton variant="plain">Title</AccordionButton>
        <AccordionPanel>{PANEL_BODY}</AccordionPanel>
      </AccordionItem>,
    ],
  },
} satisfies Story;

export const ButtonMultipleLines = {
  args: {
    children: [
      <AccordionItem key={0}>
        <AccordionButton>
          <Text whiteSpace="pre">{"Multiple\nLines"}</Text>
        </AccordionButton>
        <AccordionPanel>{PANEL_BODY}</AccordionPanel>
      </AccordionItem>,
    ],
  },
} satisfies Story;

/**
 * Set the `closeButton` prop of the `AccordionPanel` to `false` to remove the close button in the `AccordionPanel`.
 */
export const WithPanelCloseButton = {
  args: {
    children: (
      <AccordionItem>
        <AccordionButton>Title</AccordionButton>
        <AccordionPanel closeButton={false}>{PANEL_BODY}</AccordionPanel>
      </AccordionItem>
    ),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
