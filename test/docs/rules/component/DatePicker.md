---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80be-b353-dc2296d0b92d"
category: "Date and time"
---
# DatePicker

💡 **DatePickerは、日付の入力、または選択ができるコンポーネントです。<br>**期間を設定する場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/> | <mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を利用してください。

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/15831669571280beb353dc2296d0b92d#16831669571280ce994bf366a8dba0b6"/>

---

# 使用時の注意点
<columns>
	<column>
		このコンポーネントは単独での使用は推奨されません。ラベルやエラーキャプションを含む<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>内で使用してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280beb353dc2296d0b92d#15e3166957128082adb7f13ac720dac3"/>
	</column>
</columns>
<columns>
	<column>
		日付のみ<br>日付＋時間<br>いずれかの選択が可能です。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280beb353dc2296d0b92d#15e3166957128052bbf4c458dc78d473"/>
	</column>
</columns>

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/15831669571280beb353dc2296d0b92d#16831669571280b5b1bff6b8367eb31a"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { i18n } from "@legalforce/aegis-tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { clearAllMocks, expect, fn, userEvent, within } from "storybook/test";
import { Button } from "../../src/components/Button";
import {
  ContentHeader,
  ContentHeaderTitle,
} from "../../src/components/ContentHeader";
import type { DatePickerProps } from "../../src/components/DatePicker";
import { DatePicker } from "../../src/components/DatePicker";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../../src/components/Dialog";
import { Table, TableContainer } from "../../src/components/Table";
import { Stack } from "../_utils/components";

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  args: {
    "aria-label": "Pick a date",
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

const ALL_SIZES: DatePickerProps["size"][] = ["large", "medium"];
/**
 * Use the `size` prop of the `DatePicker` to change the size of it.
 */
export const Size: Story = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <DatePicker {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
};

/**
 * Set the `granularity` prop of the `DatePicker` to `"minute"` to show the time input.
 */
export const Granularity: Story = {
  args: {
    granularity: "minute",
  },
};

export const FocusCallback: Story = {
  args: {
    defaultValue: new Date(2024, 7, 10),
    onFocus: fn(),
    onBlur: fn(),
  },
};

export const WithinTable = {
  args: {
    defaultValue: new Date(2024, 7, 10),
    onFocus: fn(),
    onBlur: fn(),
  },
  render: (props) => (
    <TableContainer>
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <DatePicker {...props} />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </TableContainer>
  ),
} satisfies Story;

export const WithinDialog = {
  args: {
    defaultValue: new Date(2024, 7, 10),
  },
  render: (props) => {
    return (
      <Dialog>
        <DialogTrigger>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>Title</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <DatePicker {...props} />
          </DialogBody>
        </DialogContent>
      </Dialog>
    );
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
