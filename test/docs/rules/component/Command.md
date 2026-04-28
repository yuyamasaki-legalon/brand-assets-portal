---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Forms"
---
# Command

💡 **Commandは、検索可能なコマンドパレットUIを提供するコンポーネントです。**

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
import isChromatic from "chromatic/isChromatic";
import { ActionList } from "../../src/components/ActionList";
import { Avatar } from "../../src/components/Avatar";
import { Button } from "../../src/components/Button";
import { Command } from "../../src/components/Command";
import {
  ContentHeader,
  ContentHeaderTitle,
} from "../../src/components/ContentHeader";
import { Divider } from "../../src/components/Divider";
import { FormControl } from "../../src/components/Form";
import { Popover } from "../../src/components/Popover";
import { TextField } from "../../src/components/TextField";
import { getUsers } from "../_utils/data";

const USERS = getUsers(10);

const meta: Meta<typeof Command> = {
  component: Command,
  args: {
    children: [
      <Command.Trigger key={0}>
        <TextField placeholder="Select a user" />
      </Command.Trigger>,
      <Command.Box key={1}>
        <ActionList>
          {USERS.map((user) => (
            <ActionList.Item key={user.id} onClick={() => alert(user.name)}>
              <ActionList.Body>{user.name}</ActionList.Body>
            </ActionList.Item>
          ))}
        </ActionList>
      </Command.Box>,
    ],
  },
};

export default meta;

type Story = StoryObj<typeof Command>;

export const WithPopover: Story = {
  render: (props) => (
    <Command {...props}>
      <Popover trigger="focus" defaultOpen={isChromatic()}>
        <FormControl orientation="vertical">
          <FormControl.Label>Label</FormControl.Label>
          <Popover.Anchor>
            <Command.Trigger>
              <TextField />
            </Command.Trigger>
          </Popover.Anchor>
        </FormControl>
        <Popover.Content width="match-to-anchor">
          <Popover.Header>
            <ContentHeader>
              <ContentHeaderTitle>Title</ContentHeaderTitle>
            </ContentHeader>
          </Popover.Header>
          <Divider />
          <Popover.Body>
            <Command.Box>
              <ActionList>
                <ActionList>
                  {USERS.map((user) => (
                    <ActionList.Item key={user.id}>
                      <ActionList.Body leading={<Avatar name={user.name} />}>
                        {user.name}
                      </ActionList.Body>
                    </ActionList.Item>
                  ))}
                </ActionList>
              </ActionList>
            </Command.Box>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </Command>
  ),
};

export const WithinPopover: Story = {
  render: (props) => (
    <Popover closeButton={false} defaultOpen={isChromatic()}>
      <Popover.Anchor>
        <Button>Open</Button>
      </Popover.Anchor>
      <Popover.Content>
        <Command {...props}>
          <Popover.Header>
            <Command.Trigger>
              <TextField placeholder="Select a user" />
            </Command.Trigger>
          </Popover.Header>
          <Divider />
          <Popover.Body>
            <Command.Box>
              <ActionList>
                <ActionList.Group title="Group A">
                  {USERS.slice(0, 3).map((user) => (
                    <ActionList.Item key={user.id}>
                      <ActionList.Body leading={<Avatar name={user.name} />}>
                        {user.name}
                      </ActionList.Body>
                    </ActionList.Item>
                  ))}
                </ActionList.Group>
                <ActionList.Group title="Group B">
                  {USERS.slice(3).map((user) => (
                    <ActionList.Item key={user.id}>
                      <ActionList.Body leading={<Avatar name={user.name} />}>
                        {user.name}
                      </ActionList.Body>
                    </ActionList.Item>
                  ))}
                </ActionList.Group>
              </ActionList>
            </Command.Box>
          </Popover.Body>
        </Command>
        <Divider />
        <Popover.Footer>
          <Button variant="gutterless">Done</Button>
        </Popover.Footer>
      </Popover.Content>
    </Popover>
  ),
};
```
<!-- STORYBOOK_CATALOG_END -->
