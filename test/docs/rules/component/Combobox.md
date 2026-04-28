---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-8099-ae7e-cd0ce9f61189"
category: "Pickers"
---
# Combobox

💡 **Comboboxは、ドロップダウンリストと検索フィールドを組み合わせたコンポーネントで、リスト数が多い場合かつ単一選択の際に使用します。<br>**複数選択の場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。<br><br>placeholderに関しては以下のガイドラインに従ってください。<br><mention-page url="https://www.notion.so/12a713d40d57461ca919827af7ce9f49"/> 

---
▶# 👉Examples
	<notion-embed url="https://www.notion.so/1583166957128099ae7ecd0ce9f61189#1683166957128092b09cca00e3db69f4"/>

---

# 使用時の注意点
⚠️<span color="red">**フォーカスの際にリストを格納するコンポーネントはMenuです。<br>※Popoverは使用できません。**</span>
目安としてリスト数が５つ以下の場合はselectやradioの使用を検討してください。

---

<columns>
	<column>
		このコンポーネントは単独での使用は推奨されません。ラベルやエラーキャプションを含む<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>内で使用してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/1583166957128099ae7ecd0ce9f61189#15e3166957128018b623f02195424efb"/>
	</column>
</columns>
<columns>
	<column>
		Comboboxをクリックした際に、<br>タイピングによる入力がなくても、表示できるリストを表示してください。<br>また、Comboboxではmenuの上部にcaptionを入れて、絞り込みができる旨を伝えるようにしてください。<br>（menuのキャプション表示は追加実装予定）<br>
	</column>
	<column>
		<notion-embed url="https://www.notion.so/1583166957128099ae7ecd0ce9f61189#165316695712801a900bf00df9721d41"/>
	</column>
</columns>

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

<notion-embed url="https://www.notion.so/1583166957128099ae7ecd0ce9f61189#168316695712802a8269ec5c853e7496"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useMemo, useState } from "react";
import { LfAt } from "@legalforce/aegis-icons";
import { i18n } from "@legalforce/aegis-tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import type { ComboboxProps } from "../../src/components/Combobox";
import { Combobox } from "../../src/components/Combobox";
import { EmptyState } from "../../src/components/EmptyState";
import { FormControl } from "../../src/components/Form";
import type { SelectOption } from "../../src/components/Select";
import { getNearestOverflowAncestor } from "../../src/utils/_dom";
import type { Equal } from "../../src/utils/_types";
import { expectType } from "../../src/utils/_types";
import { Stack } from "../_utils/components";
import { getUsers } from "../_utils/data";

const USERS = getUsers(30);

export default {
  component: Combobox,
  args: {
    defaultValue: USERS[0]!.id,
    options: USERS.map((user) => ({
      label: user.name,
      value: user.id,
    })),
    "aria-label": "Select user",
  },
} satisfies Meta<typeof Combobox>;

type Story<Option extends SelectOption = SelectOption> = StoryObj<
  typeof Combobox<Option>
>;

const ALL_SIZES: ComboboxProps["size"][] = ["large", "medium"];
/**
 * Use the `size` prop of the `Combobox` to change the size of it.
 */
export const Size = {
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Combobox {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `disabled` prop of the `Combobox` to `true` to disable it.
 */
export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;

/**
 * Set the `error` prop of the `Combobox` to `true` to show an error state.
 */
export const Error = {
  args: {
    error: true,
  },
} satisfies Story;

export const Leading = {
  args: {
    leading: LfAt,
  },
} satisfies Story;

const CUSTOM_PREFIX_FILTER: ComboboxProps["filter"] = (query) => {
  const prefix = query.toLowerCase();
  return (option) => option.label.toLowerCase().startsWith(prefix);
};
export const Filter = {
  render: (props) => (
    <Stack>
      <Combobox {...props} filter={false} />
      <Combobox {...props} filter={CUSTOM_PREFIX_FILTER} />
    </Stack>
  ),
} satisfies Story;

export const Creatable = {
  parameters: {
    a11y: {
      // Most likely just a timing issue in Vitest.
      test: "todo",
    },
  },
  args: {
    creatable: true,
    onCreate: fn(),
  },
} satisfies Story;

export const EmptyNode = {
  parameters: {
    a11y: { test: "todo" },
  },
  args: {
    emptyNode: <EmptyState title="Title">No Options Available</EmptyState>,
  },
} satisfies Story;

export const WithinFormControl = {
  render: (props) => (
    <FormControl>
      <FormControl.Label>Label</FormControl.Label>
      <Combobox {...props} />
    </FormControl>
  ),
} satisfies Story;

export const WithGroup = {
  args: {
    options: [
      {
        title: "Group A",
        options: USERS.slice(0, 2).map((user) => ({
          label: user.name,
          value: user.id,
        })),
      },
      {
        title: "Group B",
        options: USERS.slice(2).map((user) => ({
          label: user.name,
          value: user.id,
        })),
      },
    ],
  },
} satisfies Story;

export const WithDisabledOption = {
  args: {
    options: USERS.map((user, index) => ({
      label: user.name,
      value: user.id,
      disabled: index === 3,
    })),
  },
} satisfies Story;

export const Open = {
  args: {
    defaultValue: USERS[USERS.length - 1]!.id,
  },
} satisfies Story;

export const Loading = {
  args: {
    options: [],
    loading: true,
  },
} satisfies Story;

export const OptionChange = {
  parameters: {
    a11y: {
      // Most likely just a timing issue in Vitest.
      test: "todo",
    },
  },
  args: {
    onTextChange: fn(),
    value: "1",
  },
  render: function Render(props) {
    const initialOptions = useMemo(
      () => [
        { label: "Option 1", value: "1" },
        { label: "Option 2", value: "2" },
      ],
      [],
    );
    const [options, setOptions] = useState(initialOptions);
    return (
      <Combobox
        {...props}
        options={options}
        onChange={() => {
          setOptions([{ label: "Option 2", value: "2" }]);
          queueMicrotask(() => setOptions(initialOptions));
        }}
      />
    );
  },
} satisfies Story;

export const RollbackOnBlur = {
  parameters: {
    a11y: {
      // Most likely just a timing issue in Vitest.
      test: "todo",
    },
  },
} satisfies Story;

const GENERIC_OPTIONS = [
  {
    label: "Option 1",
    value: "1",
    meta: {
      key: "value",
    },
  },
] as const satisfies SelectOption[];
export const GenericOptions = {
  args: {
    options: GENERIC_OPTIONS,
    filter: (_) => (_option) => {
      expectType<Equal<typeof _option, (typeof GENERIC_OPTIONS)[number]>>(true);
      return true;
    },
    onChange: (_value) => {
      expectType<Equal<typeof _value, "1" | null>>(true);
    },
  },
} satisfies Story<(typeof GENERIC_OPTIONS)[number]>;
```
<!-- STORYBOOK_CATALOG_END -->
