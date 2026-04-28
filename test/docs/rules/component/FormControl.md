---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8033-beb1-d75b760b3801"
category: "Forms"
---
# FormControl

## 関連レシピ

- [フィルタードロワー（フォーム）](../../aegis-recipes/filter-drawer.md)
- [フォームラベル + ヘルプ + TagPicker](../../aegis-recipes/form-control-help-tagpicker.md)
- [TagPicker カスタム候補 + EmptyState](../../aegis-recipes/tagpicker-custom-options.md)


💡 **FormControlは、Input要素に必要なラベル、必須マーク、キャプションなどを備えたコンポーネントです。<br>Select,TextFieldなどの全てのInput要素はFormControlの中で使用できます。**

---
▶# 👉Examples
	

---

# 使用時の注意点
### ReadOnlyの使用について
<columns>
	<column>
		readonly は、フォーム内で複数の編集項目がある中で、一部の項目を編集不可にしつつ表示し、保存や送信したい場合に使用してください。
		単に表示するだけで編集できない項目は、<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/> を使用してください。<br><br>🔴はReadOnlyの使用例<br>🔵はDescriptionListの使用例
	</column>
	<column>
		
	</column>
</columns>
### 各種オプション
label + Captionの組み合わせの他に様々なパターンのオプションが使用可能です。
<columns>
	<column>
		- [エラー](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-formcontrol--error&buildNumber=3277&k=67580af56f0662716dbc89c3-1200px-interactive-true&h=22&b=-20)
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		- [必須マークの追加](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-formcontrol--required&buildNumber=3277&k=67580af56f0662716dbc89c4-1200px-interactive-true&h=23&b=-21)
		この「必須」というテキストは、アクセシビリティ上表示する必要があります。
		「\*」だけにするなどの変更を行わないでください。
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		- [横揃え](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-formcontrol--orientation&buildNumber=3277&k=67580af56f0662716dbc89c5-1200px-interactive-true&h=24&b=-22)
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		- [label widthの変更](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-formcontrol--label-width&buildNumber=3277&k=67580af56f0662716dbc89c6-1200px-interactive-true&h=25&b=-23)
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		- [labelのフォントウェイト変更](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-formcontrol--label-weight&buildNumber=3277&k=67580af56f0662716dbc89c7-1200px-interactive-true&h=26&b=-24)
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		- [説明用アイコンの追加](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-formcontrol--label-trailing&buildNumber=3277&k=67580af56f0662716dbc89c8-1200px-interactive-true&h=27&b=-25)
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		- [２つ目のインプット要素を追加](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-formcontrol--with-group&buildNumber=3277&k=67580af56f0662716dbc89c9-1200px-interactive-true&h=28&b=-26)
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		- [toolbarの追加](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-formcontrol--with-toolbar&buildNumber=3277&k=67580af56f0662716dbc89ca-1200px-interactive-true&h=29&b=-27)
	</column>
	<column>
		
	</column>
</columns>
<columns>
	<column>
		- [toolbarの(hover時のみ)](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=components-formcontrol--with-ghost-toolbar&buildNumber=3277&k=67580af56f0662716dbc89cb-1200px-interactive-true&h=30&b=-28)
	</column>
	<column>
		
	</column>
</columns>

---

### エラーキャプションについて
エラーメッセージは以下を参照<br><mention-page url="https://www.notion.so/8647f382cd9e4dc88c21cbf930b57bdd"/>

複数のエラーを表示する場合は以下のようにして使用してください。
<mention-page url="https://www.notion.so/92551e628b2543c1b4f396442cd752c5"/>

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { LfQuestionCircle } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Button, IconButton } from "../../src/components/Button";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
} from "../../src/components/ContentHeader";
import { Divider } from "../../src/components/Divider";
import type { FormControlLabelProps } from "../../src/components/Form";
import { FormControl } from "../../src/components/Form";
import { Icon } from "../../src/components/Icon";
import { Popover } from "../../src/components/Popover";
import { Select } from "../../src/components/Select";
import { TextField } from "../../src/components/TextField";
import { Stack } from "../_utils/components";

const meta: Meta<typeof FormControl> = {
  component: FormControl,
  args: {
    children: [
      <FormControl.Label key={0}>Label</FormControl.Label>,
      <TextField key={1} />,
      <FormControl.Caption key={2}>Caption</FormControl.Caption>,
    ],
  },
};

export default meta;

type Story = StoryObj<typeof FormControl>;

/**
 * Set the `error` prop of the `FormControl` to `true` to
 * indicate that the field has an error.
 */
export const Error: Story = {
  args: {
    error: true,
  },
};

/**
 * Set the `required` prop of the `FormControl` to `true` to
 * indicate that the field is required.
 */
export const Required: Story = {
  args: {
    required: true,
  },
};

/**
 * Set the `orientation` prop of the `FormControl` to `"horizontal"` to
 * make the layout horizontal.
 */
export const Orientation: Story = {
  args: {
    orientation: "horizontal",
  },
};

const ALL_LABEL_WIDTHS: FormControlLabelProps["width"][] = [
  "medium",
  "small",
  "xSmall",
  "auto",
];
export const LabelWidth: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (props) => (
    <Stack>
      {ALL_LABEL_WIDTHS.map((width) => (
        <FormControl {...props} key={width}>
          <FormControl.Label width={width}>Label</FormControl.Label>
          <TextField />
        </FormControl>
      ))}
    </Stack>
  ),
};

/**
 * Set the `weight` prop of the `FormControl.Label` to `"normal"` to
 * make the label less prominent.
 */
export const LabelWeight: Story = {
  args: {
    orientation: "horizontal",
    children: [
      <FormControl.Label weight="normal" key={0}>
        Label
      </FormControl.Label>,
      <TextField key={1} />,
    ],
  },
};

export const LabelTrailing: Story = {
  args: {
    children: [
      <FormControl.Label
        key={0}
        trailing={
          <Popover closeButton={false}>
            <Popover.Anchor>
              <IconButton aria-label="Help">
                <Icon>
                  <LfQuestionCircle />
                </Icon>
              </IconButton>
            </Popover.Anchor>
            <Popover.Content>
              <Popover.Header>
                <ContentHeader>
                  <ContentHeaderTitle>Title</ContentHeaderTitle>
                  <ContentHeaderDescription>
                    Description
                  </ContentHeaderDescription>
                </ContentHeader>
              </Popover.Header>
            </Popover.Content>
          </Popover>
        }
      >
        Label
      </FormControl.Label>,
      <TextField key={1} />,
    ],
  },
};

export const WithGroup: Story = {
  args: {
    children: [
      <FormControl.Label key={0}>Label</FormControl.Label>,
      <FormControl.Group key={1}>
        <TextField type="number" aria-label="Input price number" />
        <Select
          defaultValue="usd"
          aria-label="Select currency"
          options={[
            { value: "usd", label: "USD" },
            { value: "jpy", label: "JPY" },
          ]}
        />
      </FormControl.Group>,
      <FormControl.Caption key={2}>Caption</FormControl.Caption>,
    ],
  },
};

/**
 * You can also put a `Toolbar` in a `FormControl`.
 */
export const WithToolbar: Story = {
  args: {
    children: [
      <FormControl.Label key={0}>Label</FormControl.Label>,
      <FormControl.Toolbar key={1}>
        <Button variant="gutterless">Delete</Button>
        <Divider />
        <Button variant="gutterless">Clear</Button>
      </FormControl.Toolbar>,
      <TextField key={2} />,
      <FormControl.Caption key={3}>Caption</FormControl.Caption>,
    ],
  },
  render: (props) => (
    <Stack>
      <FormControl {...props} />
      <FormControl {...props} orientation="horizontal" />
    </Stack>
  ),
};

export const WithGhostToolbar: Story = {
  ...WithToolbar,
  args: {
    children: [
      <FormControl.Label key={0}>Label</FormControl.Label>,
      <FormControl.Toolbar ghost key={1}>
        <Button variant="gutterless">Delete</Button>
        <Divider />
        <Button variant="gutterless">Clear</Button>
      </FormControl.Toolbar>,
      <TextField key={2} />,
      <FormControl.Caption key={3}>Caption</FormControl.Caption>,
    ],
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
