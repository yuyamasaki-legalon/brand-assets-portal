---
paths: src/**/*.{ts,tsx}
notion_page_id: "20231669-5712-80ff-8b4b-d12725e7d225"
category: "Content"
---
# DescriptionList

💡 **Description List は、項目と説明のペアを整理して表示するコンポーネントです。<br>HTML の **`&lt;dl&gt;`** / **`&lt;dt&gt;`** / **`&lt;dd&gt;`** タグをベースにしており、タイトル（項目）と内容（説明）をペアで構造化できます。<br>情報のまとまりなど、用語・ラベルとその内容を簡潔に並べたい場面に使用してください。**

---
▶# 👉Examples
	<notion-embed type="unknown" url="https://www.notion.so/20231669571280ff8b4bd12725e7d225#223316695712809eba80e7f696295242" alt="figma"/>

---

# 使用時の注意点
<columns>
	<column>
		### タイポグラフィの変更は禁止
		⚠️<span color="red">dt、ddに設定されているフォントのサイズやカラーは変更しないでください。</span>

	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/20231669571280ff8b4bd12725e7d225#2243166957128098b391dafe74af78e6" alt="figma"/>
	</column>
</columns>
<columns>
	<column>
		### <span discussion-urls="discussion://22531669-5712-800b-9220-001cb1c0bcbd">ReadOnlyの誤使用に注意</span>
		input要素の[ReadOnly](/1583166957128033beb1d75b760b3801?pvs=25#22531669571280788583ddc58d5b0d94)をDescriptionListの代用品として使用しないでください。
		参考: <mention-page url="https://www.notion.so/22531669571280788583ddc58d5b0d94"/> 
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/20231669571280ff8b4bd12725e7d225#22431669571280eb81c4e3cac7dc140c" alt="figma"/>
	</column>
</columns>
<columns>
	<column>
		### 項目間の間隔（Gap）について
		項目間の間隔（`gap`）を `small` (8px) と `large` (24px) から選択できます。このオプションは、縦並び（`vertical`）、横並び（`horizontal`）のどちらのレイアウトでも利用可能ですが、 `small` の利用は `horizontal` の時のみ利用推奨です。。

		- **small:** 情報をコンパクトにまとめたい場合に推奨します。
		- **large:** 各項目を明確に区別させたい場合や、レイアウトに十分な余白がある場合に推奨します。

		### Orientationの横並び（horizontal）について
		横並びオプションを使用する際は、多言語化によってテキストが折り返されてもレイアウトが崩れないか、事前に確認してください。
	</column>
	<column>
		<notion-embed type="unknown" url="https://www.notion.so/20231669571280ff8b4bd12725e7d225#2243166957128091a04bfc196fc66db7" alt="figma"/>
	</column>
</columns>
---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

<notion-embed type="unknown" url="https://www.notion.so/20231669571280ff8b4bd12725e7d225#2233166957128059a10eec58a128f2cb" alt="button"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfFaceMoodSmile, LfQuestionCircle } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../src/components/Avatar";
import { IconButton } from "../../src/components/Button";
import {
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
} from "../../src/components/DescriptionList";
import { Icon } from "../../src/components/Icon";
import { Text } from "../../src/components/Text";
import { Stack } from "../_utils/components";
import { getUsers } from "../_utils/data";

const USER = getUsers(1)[0]!;

export default {
  component: DescriptionList,
  args: {
    children: [
      <DescriptionListItem key={0}>
        <DescriptionListTerm>ID</DescriptionListTerm>
        <DescriptionListDetail>{USER.id}</DescriptionListDetail>
      </DescriptionListItem>,
      <DescriptionListItem key={1}>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDetail>{USER.name}</DescriptionListDetail>
      </DescriptionListItem>,
      <DescriptionListItem key={2}>
        <DescriptionListTerm>Country</DescriptionListTerm>
        <DescriptionListDetail>{USER.country}</DescriptionListDetail>
      </DescriptionListItem>,
      <DescriptionListItem key={3}>
        <DescriptionListTerm>Title</DescriptionListTerm>
        <DescriptionListDetail>{USER.title}</DescriptionListDetail>
      </DescriptionListItem>,
    ],
  },
} satisfies Meta<typeof DescriptionList>;

type Story = StoryObj<typeof DescriptionList>;

export const Size = {
  args: {
    children: [
      <DescriptionListItem orientation="horizontal" key={0}>
        <DescriptionListTerm>ID</DescriptionListTerm>
        <DescriptionListDetail>{USER.id}</DescriptionListDetail>
      </DescriptionListItem>,
      <DescriptionListItem orientation="horizontal" key={1}>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDetail>{USER.name}</DescriptionListDetail>
      </DescriptionListItem>,
      <DescriptionListItem orientation="horizontal" key={2}>
        <DescriptionListTerm>Country</DescriptionListTerm>
        <DescriptionListDetail>{USER.country}</DescriptionListDetail>
      </DescriptionListItem>,
      <DescriptionListItem orientation="horizontal" key={3}>
        <DescriptionListTerm>Title</DescriptionListTerm>
        <DescriptionListDetail>{USER.title}</DescriptionListDetail>
      </DescriptionListItem>,
    ],
  },
  render: (args) => (
    <Stack>
      <DescriptionList size="xLarge" {...args} />
      <DescriptionList size="large" {...args} />
      <DescriptionList size="small" {...args} />
    </Stack>
  ),
} satisfies Story;

export const Bordered = {
  ...Size,
  args: {
    bordered: true,
  },
} satisfies Story;

export const ItemOrientation = {
  args: {
    children: (["vertical", "horizontal"] as const).map((orientation) => (
      <DescriptionListItem key={orientation} orientation={orientation}>
        <DescriptionListTerm>ID</DescriptionListTerm>
        <DescriptionListDetail>{USER.id}</DescriptionListDetail>
      </DescriptionListItem>
    )),
  },
} satisfies Story;

export const TermTrailing = {
  args: {
    children: (
      <DescriptionListItem>
        <DescriptionListTerm
          trailing={
            <IconButton aria-label="Help">
              <Icon>
                <LfQuestionCircle />
              </Icon>
            </IconButton>
          }
        >
          ID
        </DescriptionListTerm>
        <DescriptionListDetail>{USER.id}</DescriptionListDetail>
      </DescriptionListItem>
    ),
  },
} satisfies Story;

export const TermWidth = {
  args: {
    children: (["small", "medium", "large", "xLarge", "xxLarge"] as const).map(
      (width) => (
        <DescriptionListItem key={width} orientation="horizontal">
          <DescriptionListTerm width={width}>ID</DescriptionListTerm>
          <DescriptionListDetail>{USER.id}</DescriptionListDetail>
        </DescriptionListItem>
      ),
    ),
  },
} satisfies Story;

export const DetailLeading = {
  args: {
    children: (
      <DescriptionListItem>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDetail leading={<Avatar name={USER.name} />}>
          {USER.name}
        </DescriptionListDetail>
        <DescriptionListDetail
          leading={
            <Icon>
              <LfFaceMoodSmile />
            </Icon>
          }
        >
          {USER.name}
        </DescriptionListDetail>
      </DescriptionListItem>
    ),
  },
} satisfies Story;

export const DetailTrailing = {
  args: {
    children: (
      <DescriptionListItem>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDetail
          trailing={
            <Icon>
              <LfFaceMoodSmile />
            </Icon>
          }
        >
          {USER.name}
        </DescriptionListDetail>
        <DescriptionListDetail
          trailing={
            <Text variant="caption.xSmall" color="subtle">
              {USER.username}
            </Text>
          }
        >
          {USER.name}
        </DescriptionListDetail>
        <DescriptionListDetail
          leading={<Avatar name={USER.name} />}
          trailing={
            <IconButton aria-label="Help">
              <Icon>
                <LfQuestionCircle />
              </Icon>
            </IconButton>
          }
        >
          {USER.name}
        </DescriptionListDetail>
      </DescriptionListItem>
    ),
  },
} satisfies Story;

export const WithLongContent = {
  args: {
    children: [
      <DescriptionListItem key={0}>
        <DescriptionListTerm
          trailing={
            <IconButton aria-label="Help">
              <Icon>
                <LfQuestionCircle />
              </Icon>
            </IconButton>
          }
        >
          {"Term".repeat(60)}
        </DescriptionListTerm>
        <DescriptionListDetail>{"Detail".repeat(60)}</DescriptionListDetail>
      </DescriptionListItem>,
      <DescriptionListItem key={1} orientation="horizontal">
        <DescriptionListTerm
          trailing={
            <IconButton aria-label="Help">
              <Icon>
                <LfQuestionCircle />
              </Icon>
            </IconButton>
          }
        >
          {"Term".repeat(5)}
        </DescriptionListTerm>
        <DescriptionListDetail>{"Detail".repeat(60)}</DescriptionListDetail>
      </DescriptionListItem>,
    ],
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
