---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-802c-b937-f1440a4dc7ed"
category: "Content"
---
# Mark

💡 **Markは、テキストの一部を視覚的に強調（ハイライト）するために使用するコンポーネントです。<br>検索結果で検索キーワードを強調表示することや、エディターなどで重要な情報を強調することが主な使用目的です。**

---
▶# 👉Examples
	

---

# 使用時の注意点
基本的に背景色が白（#fffff）の上で使用してください。<br>各色コントラストチェックは白背景の上で使用することを基準にしています。

---

### 色について
全体で共通すべきハイライト色があることに注意してください。<br>LOCにおいては、機能に関するハイライト色はなるべく統一してください。

**メンション**
- yellow = 自身へのメンション
- blue = 自身以外のメンション
- gray = 無効ユーザー

**ページ内検索**
- Gold (#FFD700)
- Lightsalmon (#FFA07A)

**検索ヒットのハイライト**
- hogehoge

**抽出テキストのハイライト**
- Information Bold (#0367A8)

**比較**
- teal
- orange

**法令ガイドライン、条文検索、横断検索**
- teal

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { MarkProps } from "../../src/components/Text";
import { Mark, Text } from "../../src/components/Text";
import { Stack } from "../_utils/components";

const meta: Meta<typeof Mark> = {
  component: Mark,
  args: {
    children: "important part",
  },
};

export default meta;

type Story = StoryObj<typeof Mark>;

/**
 * Use the `underline` prop of the `Mark` to underline it.
 */
export const Underline: Story = {
  args: {
    underline: true,
  },
  render: (props) => (
    <Stack direction="row">
      <Mark {...props} />
      <Mark {...props} background={false} />
    </Stack>
  ),
};

const ALL_COLORS: NonNullable<MarkProps["color"]>[] = [
  "red",
  "orange",
  "yellow",
  "teal",
  "blue",
  "indigo",
  "purple",
  "magenta",
  "gray",
];
/**
 * Use the `color` prop of the `Mark` to change the color of it.
 */
export const Color: Story = {
  render: (props) => (
    <Stack>
      {ALL_COLORS.map((color) => (
        <Stack direction="row" key={color}>
          <Mark {...props} color={color} />
          <Mark {...props} color={color} underline />
          <Mark {...props} color={color} background={false} underline />
        </Stack>
      ))}
    </Stack>
  ),
};

/**
 * Put `Text` inside the `Mark` to change the color of the text.
 */
export const WithText: Story = {
  render: ({ children, ...rest }) => (
    <Stack>
      {ALL_COLORS.map((color) => (
        <Stack direction="row" key={color}>
          <Mark {...rest} color={color} key={color} underline>
            <Text color={`accent.${color}.subtle`}>{children}</Text>
          </Mark>
        </Stack>
      ))}
    </Stack>
  ),
};

export const MultipleLines: Story = {
  render: (props) => {
    const render = (underline: boolean) => (
      <div>
        Whereas recognition of{" "}
        <Mark {...props} underline={underline}>
          the inherent dignity and of the equal and inalienable rights of all
          members of the human family
        </Mark>{" "}
        is the foundation of freedom, justice and peace in the world.
      </div>
    );
    return (
      <Stack direction="row">
        {render(false)}
        {render(true)}
      </Stack>
    );
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
