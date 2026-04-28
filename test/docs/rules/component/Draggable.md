---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Actions"
---
# Draggable

💡 **Draggableは、リスト内のアイテムをドラッグ＆ドロップで並べ替えるコンポーネントです。**

---

# 使用時の注意点
デザインガイドラインについては [DraggableList](./DraggableList.md) および [DraggableTable](./DraggableTable.md) も参照してください。

---

# Q&A
Q: {内容を書く}
A: {内容を書く}

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Accordion } from "../../src/components/Accordion";
import { Button } from "../../src/components/Button";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
} from "../../src/components/ContentHeader";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../../src/components/Dialog";
import { Draggable } from "../../src/components/Draggable";
import { Table, TableContainer } from "../../src/components/Table";
import { Stack } from "../_utils/components";
import { getUsers } from "../_utils/data";

const USERS = getUsers(10);

export default {
  component: Draggable,
  render: (props) => {
    const [users, setUsers] = useState(USERS);

    return (
      <Draggable {...props} values={users} onReorder={setUsers}>
        {users.map((user) => (
          <Draggable.Item id={user.id} key={user.id}>
            {user.name}
          </Draggable.Item>
        ))}
      </Draggable>
    );
  },
} satisfies Meta<typeof Draggable>;

type Story = StoryObj<typeof Draggable>;

export const Bordered = {
  args: {
    bordered: true,
  },
} satisfies Story;

export const ItemKnobOnly = {
  render: (props) => {
    const [users, setUsers] = useState(USERS);

    return (
      <Stack>
        <Draggable {...props} values={users} onReorder={setUsers}>
          {users.map((user) => (
            <Draggable.Item id={user.id} key={user.id} knobOnly>
              {user.name}
            </Draggable.Item>
          ))}
        </Draggable>
      </Stack>
    );
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
  render: (props) => {
    const [users, setUsers] = useState(USERS);

    return (
      <Stack>
        <Draggable {...props} values={users} onReorder={setUsers}>
          {users.map((user) => (
            <Draggable.Item id={user.id} key={user.id}>
              {user.name}
            </Draggable.Item>
          ))}
        </Draggable>
        <Draggable {...props} values={users} onReorder={setUsers}>
          {users.map((user) => (
            <Draggable.Item id={user.id} key={user.id} knobOnly>
              {user.name}
            </Draggable.Item>
          ))}
        </Draggable>
      </Stack>
    );
  },
} satisfies Story;

export const WithAccordion = {
  args: {
    bordered: true,
    size: "large",
  },
  render: (props) => {
    const [users, setUsers] = useState(USERS);

    return (
      <Accordion>
        <Draggable {...props} values={users} onReorder={setUsers}>
          {users.map((user) => (
            <Draggable.Item id={user.id} key={user.id}>
              <ContentHeader size="xSmall">
                <ContentHeaderTitle>{user.name}</ContentHeaderTitle>
                <ContentHeaderDescription>{user.bio}</ContentHeaderDescription>
              </ContentHeader>
              <Accordion.Item>
                <Accordion.Button>{user.organization}</Accordion.Button>
                <Accordion.Panel>{user.title}</Accordion.Panel>
              </Accordion.Item>
            </Draggable.Item>
          ))}
        </Draggable>
      </Accordion>
    );
  },
} satisfies Story;

export const WithTable = {
  render: (props) => {
    const [users, setUsers] = useState(USERS);

    return (
      <Draggable
        {...props}
        as={TableContainer}
        values={users}
        onReorder={setUsers}
      >
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell />
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>Bio</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {users.map((user) => (
              <Draggable.Item as={Table.Row} id={user.id} key={user.id}>
                <Table.Cell>
                  <Draggable.Knob />
                </Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.bio}</Table.Cell>
              </Draggable.Item>
            ))}
          </Table.Body>
        </Table>
      </Draggable>
    );
  },
} satisfies Story;

export const Keyboard = {
} satisfies Story;

export const WithinDialog = {
  render: (props) => {
    const [users, setUsers] = useState(USERS);

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
            <Draggable {...props} values={users} onReorder={setUsers}>
              {users.map((user) => (
                <Draggable.Item id={user.id} key={user.id}>
                  {user.name}
                </Draggable.Item>
              ))}
            </Draggable>
          </DialogBody>
        </DialogContent>
      </Dialog>
    );
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
