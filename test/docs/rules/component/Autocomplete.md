---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Forms"
---
# Autocomplete

💡 **Autocompleteは、テキスト入力に基づいてサジェストを表示するコンポーネントです。**

---

# 使用時の注意点
（追記予定）

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import { ActionList } from "../../src/components/ActionList";
import { Autocomplete } from "../../src/components/Autocomplete";
import { Avatar } from "../../src/components/Avatar";
import { EmptyState } from "../../src/components/EmptyState";
import { FormControl } from "../../src/components/Form";
import { Search } from "../../src/components/Search";
import { TextField } from "../../src/components/TextField";
import { getUsers } from "../_utils/data";

const USERS = getUsers(3);

const meta: Meta<typeof Autocomplete> = {
  component: Autocomplete,
  args: {
    children: <TextField aria-label="Input name" />,
    suggestions: USERS.map((user) => user.name),
  },
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

/**
 * Set `Search` element as the `children` prop of `Autocomplete` to show suggestions in it.
 */
export const WithSearch: Story = {
  args: {
    children: <Search />,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    suggestions: [],
  },
};

/**
 * Use the `emptyNode` prop to display a message when there are no suggestions.
 */
export const EmptyNode: Story = {
  parameters: {
    a11y: { test: "todo" },
  },
  args: {
    emptyNode: <EmptyState title="Title">No Options Available</EmptyState>,
  },
};

/**
 * `Autocomplete` can be used within `FormControl`.
 */
export const WithinFormControl: Story = {
  args: {
    children: <TextField />,
  },
  render: (props) => (
    <FormControl>
      <FormControl.Label>Label</FormControl.Label>
      <Autocomplete {...props} />
      <FormControl.Caption>Caption</FormControl.Caption>
    </FormControl>
  ),
};

/**
 * Pass `label` and `body` to each suggestion to customize the label and body of it.
 * Make sure to use `ActionList.Body` to wrap the body.
 */
export const CustomSuggestions: Story = {
  args: {
    suggestions: USERS.map((user) => ({
      label: user.name,
      body: (
        <ActionList.Body leading={<Avatar name={user.name} />}>
          {user.name}
          <ActionList.Description>{user.organization}</ActionList.Description>
        </ActionList.Body>
      ),
    })),
  },
};
```
<!-- STORYBOOK_CATALOG_END -->
