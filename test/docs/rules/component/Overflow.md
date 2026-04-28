---
paths: src/**/*.{ts,tsx}
notion_page_id: ""
category: "Utility"
---
# Overflow

💡 **Overflowは、表示領域に収まらないアイテムを自動的にメニューにまとめるコンポーネントです。**

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
import {
  LfAlignCenter,
  LfAlignLeft,
  LfAlignRight,
  LfBold,
  LfEllipsisDot,
  LfItalic,
} from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, IconButton } from "../../src/components/Button";
import { Divider } from "../../src/components/Divider";
import { Icon } from "../../src/components/Icon";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "../../src/components/Menu";
import { Overflow, OverflowItem } from "../../src/components/Overflow";
import { Toolbar } from "../../src/components/Toolbar";

const ACTIONS = Array.from({ length: 15 }, (_, i) => ({
  name: `Action ${i}`,
  priority: i === 3 ? 1000 : i,
}));

export default {
  component: Overflow,
  args: {
    children: ({ indexes }) => (
      <ButtonGroup>
        {ACTIONS.map((action) => (
          <OverflowItem key={action.name}>
            <Button>{action.name}</Button>
          </OverflowItem>
        ))}
        {indexes.length > 0 && (
          <Menu>
            <MenuTrigger>
              <IconButton aria-label="More options">
                <Icon>
                  <LfEllipsisDot />
                </Icon>
              </IconButton>
            </MenuTrigger>
            <MenuContent>
              {indexes.map((index) => {
                const action = ACTIONS[index];
                if (action === undefined) {
                  return null;
                }
                return <MenuItem key={action.name}>{action.name}</MenuItem>;
              })}
            </MenuContent>
          </Menu>
        )}
      </ButtonGroup>
    ),
  },
} satisfies Meta<typeof Overflow>;

type Story = StoryObj<typeof Overflow>;

export const ItemPriority = {
  args: {
    children: ({ indexes }) => (
      <ButtonGroup>
        {ACTIONS.map((action) => (
          <OverflowItem key={action.name} priority={action.priority}>
            <Button>{action.name}</Button>
          </OverflowItem>
        ))}
        {indexes.length > 0 && (
          <Menu>
            <MenuTrigger>
              <IconButton aria-label="More options">
                <Icon>
                  <LfEllipsisDot />
                </Icon>
              </IconButton>
            </MenuTrigger>
            <MenuContent>
              {indexes.map((index) => {
                const action = ACTIONS[index];
                if (action === undefined) {
                  return null;
                }
                return <MenuItem key={action.name}>{action.name}</MenuItem>;
              })}
            </MenuContent>
          </Menu>
        )}
      </ButtonGroup>
    ),
  },
} satisfies Story;

export const WithToolbar = {
  args: {
    children: ({ indexes }) => (
      <Toolbar>
        <ButtonGroup>
          <IconButton aria-label="Bold">
            <Icon>
              <LfBold />
            </Icon>
          </IconButton>
          <IconButton aria-label="Italic">
            <Icon>
              <LfItalic />
            </Icon>
          </IconButton>
        </ButtonGroup>
        <Divider />
        <ButtonGroup>
          {ACTIONS.map((action) => (
            <OverflowItem key={action.name}>
              <Button>{action.name}</Button>
            </OverflowItem>
          ))}
          {indexes.length > 1 && (
            <Menu>
              <MenuTrigger>
                <IconButton aria-label="More options">
                  <Icon>
                    <LfEllipsisDot />
                  </Icon>
                </IconButton>
              </MenuTrigger>
              <MenuContent>
                {indexes.slice(0, indexes.length - 1).map((index) => {
                  const action = ACTIONS[index];
                  if (action === undefined) {
                    return null;
                  }

                  return <MenuItem key={action.name}>{action.name}</MenuItem>;
                })}
              </MenuContent>
            </Menu>
          )}
        </ButtonGroup>
        <Divider />
        <OverflowItem>
          <ButtonGroup>
            <IconButton aria-label="Left">
              <Icon>
                <LfAlignLeft />
              </Icon>
            </IconButton>
            <IconButton aria-label="Center">
              <Icon>
                <LfAlignCenter />
              </Icon>
            </IconButton>
            <IconButton aria-label="Right">
              <Icon>
                <LfAlignRight />
              </Icon>
            </IconButton>
          </ButtonGroup>
        </OverflowItem>
        {indexes.length > 0 && (
          <Menu>
            <MenuTrigger>
              <Button>Align</Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem
                leading={
                  <Icon>
                    <LfAlignLeft />
                  </Icon>
                }
              >
                Left
              </MenuItem>
              <MenuItem
                leading={
                  <Icon>
                    <LfAlignCenter />
                  </Icon>
                }
              >
                Center
              </MenuItem>
              <MenuItem
                leading={
                  <Icon>
                    <LfAlignRight />
                  </Icon>
                }
              >
                Right
              </MenuItem>
            </MenuContent>
          </Menu>
        )}
      </Toolbar>
    ),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
