---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80f8-a546-da0f-e93fda1f"
category: null
---
# Select

💡 **Selectは、省スペースで多数の選択肢リストから単一選択をさせるためのコンポーネントです。<br><br>**複数選択の場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。<br>また選択項目のリスト数が多い場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>の使用を検討してください。<br><br>Placeholderに関しては以下のガイドラインに従ってください。<br><mention-page url="https://www.notion.so/12a713d40d57461ca919827af7ce9f49"/> 

---
▶# <span color="blue" discussion-urls="discussion://17d31669-5712-8078-9ce9-001ce3d5b828">👉Examples</span>
	
---

# <span discussion-urls="discussion://16031669-5712-8074-b223-001ce6019ddd">使用時の注意点</span>
単一選択かつ、ユーザーに選択肢をフィルタリングさせたい場合は<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。
<span color="red">**⚠️フォーカスの際にリストを格納するコンポーネントはMenuです。<br>※Popoverは使用できません。**</span>
---

### サイズについて
**medium**<br>基本的にはデフォルトサイズであるmediumを使用してください。

---

### スタイルについて
**outline**<br>デフォルトの値です。<br>基本的にはoutlineを使用してください。

**gutterless**<br>outlineほど強調したくない場合に使用します。<br>outlineに比べて、Selectと判断しにくいため多用しないでください。

---

# Q&A
Q: \{内容を書く\}
A: \{内容を書く\}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { LfAt } from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { modes } from "../../.storybook/modes";
import { ActionListBody } from "../../src/components/ActionList";
import { Avatar } from "../../src/components/Avatar";
import { Button } from "../../src/components/Button";
import {
  ContentHeader,
  ContentHeaderTitle,
} from "../../src/components/ContentHeader";
import { Popover } from "../../src/components/Popover";
import type { SelectOption, SelectProps } from "../../src/components/Select";
import { Select, SelectButton } from "../../src/components/Select";
import { Text } from "../../src/components/Text";
import type { Equal } from "../../src/utils/_types";
import { expectType } from "../../src/utils/_types";
import { Placeholder, Stack } from "../_utils/components";
import { getUsers } from "../_utils/data";

const USERS = getUsers(5);

export default {
  component: Select,
  args: {
    placeholder: "Select one",
    options: USERS.map((user) => ({
      label: user.name,
      value: user.id,
    })),
  },
} satisfies Meta<typeof Select>;

type Story<Option extends SelectOption = SelectOption> = StoryObj<
  typeof Select<Option>
>;

export const Open = {
  args: {
    defaultValue: USERS[3]!.id,
  },
} satisfies Story;

const ALL_VARIANTS: SelectProps["variant"][] = ["outline", "gutterless"];
/**
 * Use the `variant` prop of the `Select` to change the variant of it.
 */
export const Variant = {
  render: (props) => (
    <Stack>
      {ALL_VARIANTS.map((variant) => (
        <Select {...props} variant={variant} key={variant} />
      ))}
    </Stack>
  ),
} satisfies Story;

const ALL_SIZES: SelectProps["size"][] = ["large", "medium", "small"];
/**
 * Use the `size` prop of the `Select` to change the size of it.
 */
export const Size = {
  parameters: {
    chromatic: {
      modes: modes.scale,
    },
  },
  render: (props) => (
    <Stack>
      {ALL_SIZES.map((size) => (
        <Select {...props} size={size} key={size} />
      ))}
    </Stack>
  ),
} satisfies Story;

/**
 * Set the `error` prop of the `Select` to `true` to show the error state.
 */
export const Error = {
  ...Variant,
  args: {
    error: true,
  },
} satisfies Story;

/**
 * Set the `disabled` prop of the `Select` to `true` to disable it.
 */
export const Disabled = {
  ...Variant,
  args: {
    disabled: true,
  },
} satisfies Story;

export const WithGroup = {
  ...Open,
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
        options: USERS.slice(2, 3).map((user) => ({
          label: user.name,
          value: user.id,
        })),
      },
      {
        options: USERS.slice(3).map((user) => ({
          label: user.name,
          value: user.id,
        })),
      },
    ],
  },
} satisfies Story;

export const Leading = {
  args: {
    leading: LfAt,
  },
} satisfies Story;

export const Trailing = {
  args: {
    trailing: LfAt,
  },
} satisfies Story;

export const Clearable = {
  args: {
    clearable: true,
  },
  render: (props) => (
    <Stack>
      <Select {...props} />
      <Select {...props} defaultValue={USERS[1]!.id} />
      <Select {...props} defaultValue={USERS[2]!.id} disabled />
    </Stack>
  ),
} satisfies Story;

export const Width = {
  args: {
    width: "auto",
  },
} satisfies Story;

export const Loading = {
  ...Open,
  parameters: {
    a11y: { test: "todo" },
  },
  args: {
    options: [],
    loading: true,
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

const LARGE_USERS = getUsers(200);

export const OnLoadMore = {
  render: (props) => {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<SelectOption[]>([]);
    const pagingCount = useRef(0);
    const loadMore = useCallback(() => {
      const length = 20;
      if (LARGE_USERS.length <= pagingCount.current * length) {
        return;
      }
      setLoading(true);
      setTimeout(() => {
        const start = pagingCount.current * length;
        const end = start + length;
        pagingCount.current += 1;
        setOptions((prev) => {
          return prev.concat(
            LARGE_USERS.slice(start, end).map((user) => ({
              label: user.name,
              value: user.id,
            })),
          );
        });
        setLoading(false);
      }, 1000);
    }, []);

    useEffect(loadMore, [loadMore]);

    return (
      <Select
        {...props}
        loading={loading}
        onLoadMore={loadMore}
        options={options}
      />
    );
  },
} satisfies Story;

/**
 * Pass `body` to each option to customize the body of it.
 */
export const CustomOptions = {
  ...Open,
  args: {
    options: USERS.map((user) => ({
      label: user.name,
      value: user.id,
      body: (
        <ActionListBody leading={<Avatar name={user.name} />}>
          {user.name}
        </ActionListBody>
      ),
    })),
  },
} satisfies Story;

/**
 * Use the `renderValue` prop of the `Select` to customize how the value is rendered.
 * *DO NOT ABUSE THIS*. It is not recommended to customize the design of the `Select`
 * unless it is really necessary.
 */
export const CustomRenderValue = {
  args: {
    defaultValue: USERS[0]!.id,
    renderValue: ({ label }) => (
      <Text variant="component.medium.bold" color="information">
        {label}
      </Text>
    ),
  },
} satisfies Story;

/**
 * Use `SelectButton` and `Popover` to create a custom Select.
 */
export const CustomPopover = {
  render: (_) => (
    <Popover>
      <Popover.Anchor>
        <SelectButton placeholder="Button" />
      </Popover.Anchor>
      <Popover.Content width="match-to-anchor">
        <Popover.Header>
          <ContentHeader>
            <ContentHeaderTitle>Title</ContentHeaderTitle>
          </ContentHeader>
        </Popover.Header>
        <Popover.Body>
          <Placeholder>Placeholder</Placeholder>
        </Popover.Body>
        <Popover.Footer>
          <Button variant="subtle">Submit</Button>
        </Popover.Footer>
      </Popover.Content>
    </Popover>
  ),
} satisfies Story;

export const Typeahead = {
} satisfies Story;

export const WithLongContent = {
  args: {
    placeholder: "Aa".repeat(100),
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
    clearable: false,
    onChange: (_value) => {
      expectType<Equal<typeof _value, "1">>(true);
    },
  },
} satisfies Story<(typeof GENERIC_OPTIONS)[number]>;
```
<!-- STORYBOOK_CATALOG_END -->
