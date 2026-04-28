---
paths: src/**/*.{ts,tsx}
notion_page_id: "15831669-5712-80ea-a184-e1459f5e9793"
category: "Content"
---
# Table

## 関連レシピ

- [Table.ActionCell + メニュー](../../aegis-recipes/table-action-cell-menu.md)
- [省略テキスト + Tooltip](../../aegis-recipes/overflow-tooltip.md)
- [TableContainer + Table](../../aegis-recipes/table-container-basic.md)


💡 **Tableは、行と列の形式でデータを整理して表示するためのコンポーネントです。**

---
▶# 👉Examples
	
<notion-embed url="https://www.notion.so/15831669571280eaa184e1459f5e9793#1683166957128005a61cf6a8e2fc8f27"/>

---

# 使用時の注意点
### セル内のButton設置について
<columns>
	<column>
		テーブルセルにボタンなどのコンポーネントを配置しないでください。<br>多くの場合、ウィンドウサイズが縮小された際などで横スクロールが発生し、ボタンの存在が認識できません。可能な限り<mention-page url="https://www.notion.so/15831669571280f8a546da0fe93fda1f"/>を使用してください。
		テーブルの項目が１、２項目であり、横スクロールが発生しない状況であればこの限りではありません。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280eaa184e1459f5e9793#165316695712800485c4f98706d66168"/>
	</column>
</columns>

---

### セル内の情報表示について
<columns>
	<column>
		テーブルの項目の表現はサービス内と同一になるように努めてください。<br>Statuslabel や tag、ユーザーの表現であればavatarを利用するなど、文字だけの情報にならないように注意してください。
	</column>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280eaa184e1459f5e9793#165316695712809fa277fdf553692a34"/>
	</column>
</columns>
---

### サイズについて
Tableコンポーネントには `medium` と `small` の2種類のサイズがあります。
- **medium:** デフォルトのサイズです。基本的にはこちらのサイズを使用してください。
- **small:** 上下の余白（padding）が `medium` よりも狭くなります。行数が多く、どうしても情報をコンパクトに表示したい場合に使用を検討してください。

### Hoverアクションについて
テーブルセルがクリッカブルではない場合（詳細ページなどに遷移しない）は、Row Hoverのオプションを使って、Hover, Pressedなどのアクションを無効化してください。（背景色を変えないでください）
<columns>
	<column>
		<notion-embed url="https://www.notion.so/15831669571280eaa184e1459f5e9793#16531669571280769483d2ff05ccc8f8"/>
	</column>
</columns>

---

### テーブルヘッダーの固定について
テーブルの項目ヘッダーはstickyで固定することができます。
<columns>
	<column>
		スクロール時に項目の固定がされていない場合、どの項目の表記かがわかりにくくなります。可能な限りstickyオプションは使用してください。
	</column>
	<column>
		
	</column>
</columns>

---

# Q&A
Q: テーブル内のテキストを複数行にすることはできますか？
A: Tableの中身を複数行にすることは、実装的には可能です。一方で、Figma上での他のオプションとの共存が難しいため、Component上で再現する方法を提供していません。Figmaで再現したい場合は、Figmaのオプションをoverrideして設定してください。

Q: テーブルの一番下の下線はoffにできますか？
A: できます。実装上、最終行の下線は強制的にoffになります。Figma上では再現できないため、この変更を入れていません。Figma上で表現したい場合は、自身でスタイルの上書きをお願いします。
<image source="file://%7B%22source%22%3A%22attachment%3A861871d8-8fe7-4124-bdd0-f414f303c86d%3A%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-17_19.50.08.png%22%2C%22permissionRecord%22%3A%7B%22table%22%3A%22block%22%2C%22id%22%3A%2219d31669-5712-8050-b639-cda536284e83%22%2C%22spaceId%22%3A%22803260f9-e001-4840-b333-c9883e56eaf6%22%7D%7D"></image>

Q: Figmaの横幅オプションと実装で用いるプロパティの対応表はありますか？
A: こちらを参考にしてください
| (Figma)WidthType | どんな横幅か | 実装例 |
| :--- | :--- | :--- |
| Fill-Width (auto) | 基本fitだが、Tableの幅に余裕がある場合は広がる可能性がある。<br><br>\\* minWidth / maxWidthと兼用する想定 | \\<Table.Cell <br>as="td" <br>minWidth=”xxSmall”\\> |
| Fix-Width | 横幅が固定値。<br>Input, Selectがあるときに使う想定。 | \\<Table.Cell<br>as="td"<br>width="xxSmall"<br>\\> |
| Item-Width (fit) | テーブル内のコンテンツの横幅ぴったりの横幅になる。Table幅に依存しない。<br>checkbox、StatusLabel、buttonのとき以外使わない。 | \\<Table.Cell<br>as="td"<br>width="fit"<br>\\> |
| Variable-Width | min-widthとmax-widthの双方、またはどちらかを設定可能。設定した最小値\\~最大値の間で、コンテンツの中身に応じて変化する。 | \\<Table.Cell<br>as="td"<br>maxWidth="xSmall"<br>minWidth="xxSmall"<br>\\><br>\\<Table.Cell<br>as="td"<br>maxWidth="xSmall"<br>\\> |
※ ページの横幅がテーブル全体の横幅を超し、余白ができた場合は、Item-Width以外のカラムに関して、カラムの横幅が均等に長くなります。ただしすべてのカラムがItem-Widthの場合は、余白ができたときに横幅が広くなります。

Q: Tableの各セルに背景色を付けることは可能でしょうか？
A: 可能です。ただし、セルに色をつけた場合のhoverインタラクション（カーソルを合わせたときに行の背景色が変わるなど）との兼ね合いに注意してください。インタラクション時の配色については、都度デザイン相談してください。

<notion-embed url="https://www.notion.so/15831669571280eaa184e1459f5e9793#168316695712802e84f5fbabac00560d"/>

---
## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import type { FC } from "react";
import { useId, useState } from "react";
import {
  LfAngleDownLarge,
  LfArchive,
  LfClock,
  LfEllipsisDot,
  LfShare,
  LfTrash,
} from "@legalforce/aegis-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import isChromatic from "chromatic/isChromatic";
import { userEvent } from "storybook/test";
import { ActionList } from "../../src/components/ActionList";
import { Button, ButtonGroup, IconButton } from "../../src/components/Button";
import { Combobox } from "../../src/components/Combobox";
import {
  DateField,
  DatePicker,
  RangeDateField,
  RangeDatePicker,
} from "../../src/components/DatePicker";
import { Icon } from "../../src/components/Icon";
import { Menu, MenuContent, MenuTrigger } from "../../src/components/Menu";
import { Popover } from "../../src/components/Popover";
import { Select, SelectButton } from "../../src/components/Select";
import type { TableCellOptions } from "../../src/components/Table";
import { Table, TableContainer } from "../../src/components/Table";
import { TagPicker } from "../../src/components/TagInput";
import { Text } from "../../src/components/Text";
import { TextField } from "../../src/components/TextField";
import { Tooltip } from "../../src/components/Tooltip";
import type { User } from "../_utils/data";
import { getUsers } from "../_utils/data";

const USERS = getUsers(3);
const COLUMNS = [
  "name",
  "username",
  "organization",
  "title",
  "country",
  "bio",
] as const;
type ColumnKey = (typeof COLUMNS)[number];

export default {
  component: Table,
  args: {
    children: [
      <Table.Head key={0}>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.Cell key={column}>{column}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Head>,
      <Table.Body key={1}>
        {USERS.map((user) => (
          <Table.Row key={user.id}>
            {COLUMNS.map((column) => (
              <Table.Cell as={column === "name" ? "th" : "td"} key={column}>
                {user[column]}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>,
    ],
  },
  render: (props) => (
    <TableContainer>
      <Table {...props} />
    </TableContainer>
  ),
} satisfies Meta<typeof Table>;

type Story = StoryObj<typeof Table>;

export const Size = {
  args: {
    size: "small",
  },
} satisfies Story;

/**
 * Use the `width` prop of `Table.Cell` to set the width of the cell.
 */
export const CellWidth = {
  args: {
    children: [
      <Table.Head key={0}>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.Cell key={column}>{column}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Head>,
      <Table.Body key={1}>
        {USERS.map((user) => (
          <Table.Row key={user.id}>
            {COLUMNS.map((column) => {
              const attributes: Partial<Record<keyof User, TableCellOptions>> =
                {
                  name: {
                    width: "fit",
                  },
                  username: {
                    minWidth: "small",
                  },
                  organization: {
                    width: "xxSmall",
                  },
                  title: {
                    maxWidth: "xxSmall",
                  },
                  bio: {
                    maxWidth: "xSmall",
                    minWidth: "xxSmall",
                  },
                };
              const attribute = attributes[column];
              const content = [
                user[column],
                attribute !== undefined &&
                  `(${Object.entries(attribute)
                    .map(([key, value]) => `${key}=${value}`)
                    .join(", ")})`,
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <Table.Cell
                  key={column}
                  as={column === "name" ? "th" : "td"}
                  {...attribute}
                >
                  <Tooltip title={content} onlyOnOverflow>
                    <Text>{content}</Text>
                  </Tooltip>
                </Table.Cell>
              );
            })}
          </Table.Row>
        ))}
      </Table.Body>,
    ],
  },
} satisfies Story;

/**
 * Use the `variant` prop of `Table.Row` to change the background color of the row.
 */
export const RowVariant = {
  args: {
    children: [
      <Table.Head key={0}>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.Cell key={column}>{column}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Head>,
      <Table.Body key={1}>
        {USERS.map((user) => (
          <Table.Row
            key={user.id}
            variant={user.id === USERS[2]!.id ? "subtle" : "plain"}
          >
            {COLUMNS.map((column) => (
              <Table.Cell as={column === "name" ? "th" : "td"} key={column}>
                {user[column]}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>,
    ],
  },
} satisfies Story;

/**
 * Use the `hover` prop of `Table.Row` to disable the hover effect of the row.
 */
export const RowHover = {
  args: {
    children: [
      <Table.Head key={0}>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.Cell key={column}>{column}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Head>,
      <Table.Body key={1}>
        {USERS.map((user) => (
          <Table.Row hover={false} key={user.id}>
            {COLUMNS.map((column) => (
              <Table.Cell as={column === "name" ? "th" : "td"} key={column}>
                {user[column]}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>,
    ],
  },
} satisfies Story;

/**
 * Use the `clickable` prop of `Table.Row` to show the cursor as a pointer.
 */
export const RowClickable = {
  args: {
    children: [
      <Table.Head key={0}>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.Cell key={column}>{column}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Head>,
      <Table.Body key={1}>
        {USERS.map((user) => (
          <Table.Row clickable key={user.id}>
            {COLUMNS.map((column) => (
              <Table.Cell as={column === "name" ? "th" : "td"} key={column}>
                {user[column]}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>,
    ],
  },
} satisfies Story;

export const WithBadgeCell = {
  args: {
    children: [
      <Table.Head key={0}>
        <Table.Row>
          <Table.BadgeCell />
          {COLUMNS.map((column) => (
            <Table.Cell key={column}>{column}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Head>,
      <Table.Body key={1}>
        {USERS.map((user) => (
          <Table.Row key={user.id}>
            <Table.BadgeCell />
            {COLUMNS.map((column) => (
              <Table.Cell as={column === "name" ? "th" : "td"} key={column}>
                {user[column]}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>,
    ],
  },
} satisfies Story;

export const WithActionCell = {
  args: {
    children: [
      <Table.Head key={0}>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.Cell key={column}>{column}</Table.Cell>
          ))}
          <Table.ActionCell />
        </Table.Row>
      </Table.Head>,
      <Table.Body key={1}>
        {USERS.map((user) => (
          <Table.Row key={user.id}>
            {COLUMNS.map((column) => (
              <Table.Cell as={column === "name" ? "th" : "td"} key={column}>
                {user[column]}
              </Table.Cell>
            ))}
            <Table.ActionCell>
              <ButtonGroup>
                <Button>Sign out</Button>
                <Tooltip title="Archive">
                  <IconButton aria-label="Archive">
                    <Icon>
                      <LfArchive />
                    </Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton aria-label="Delete">
                    <Icon>
                      <LfTrash />
                    </Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton aria-label="Share">
                    <Icon>
                      <LfShare />
                    </Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="History">
                  <IconButton aria-label="History">
                    <Icon>
                      <LfClock />
                    </Icon>
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
            </Table.ActionCell>
          </Table.Row>
        ))}
      </Table.Body>,
    ],
  },
} satisfies Story;

export const WithInput = {
  args: {
    children: [
      <Table.Body key={0}>
        <Table.Row>
          <Table.Cell>Label</Table.Cell>
          <Table.Cell>
            <TextField aria-label="Label" />
          </Table.Cell>
          <Table.Cell>
            <Select options={[]} aria-label="Label" />
          </Table.Cell>
          <Table.Cell>
            <SelectButton aria-label="Label" />
          </Table.Cell>
          <Table.Cell>
            <Combobox options={[]} aria-label="Label" />
          </Table.Cell>
          <Table.Cell>
            <TagPicker options={[]} aria-label="Label" />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Label</Table.Cell>
          <Table.Cell>
            <TextField aria-label="Label" ghost={false} />
          </Table.Cell>
          <Table.Cell>
            <Select options={[]} aria-label="Label" ghost={false} />
          </Table.Cell>
          <Table.Cell>
            <SelectButton aria-label="Label" ghost={false} />
          </Table.Cell>
          <Table.Cell>
            <Combobox options={[]} aria-label="Label" ghost={false} />
          </Table.Cell>
          <Table.Cell>
            <TagPicker options={[]} aria-label="Label" ghost={false} />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Label</Table.Cell>
          <Table.Cell>
            <DateField aria-label="Label" />
          </Table.Cell>
          <Table.Cell>
            <RangeDateField aria-label="Label" />
          </Table.Cell>
          <Table.Cell>
            <DatePicker aria-label="Label" />
          </Table.Cell>
          <Table.Cell>
            <RangeDatePicker aria-label="Label" />
          </Table.Cell>
          <Table.Cell>
            <IconButton aria-label="Label" variant="plain">
              <Icon>
                <LfEllipsisDot />
              </Icon>
            </IconButton>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Label</Table.Cell>
          <Table.Cell>
            <DateField aria-label="Label" ghost={false} />
          </Table.Cell>
          <Table.Cell>
            <RangeDateField aria-label="Label" ghost={false} />
          </Table.Cell>
          <Table.Cell>
            <DatePicker aria-label="Label" ghost={false} />
          </Table.Cell>
          <Table.Cell>
            <RangeDatePicker aria-label="Label" ghost={false} />
          </Table.Cell>
          <Table.Cell>
            <IconButton aria-label="Label" variant="plain">
              <Icon>
                <LfEllipsisDot />
              </Icon>
            </IconButton>
          </Table.Cell>
        </Table.Row>
      </Table.Body>,
    ],
  },
} satisfies Story;

export const WithCheckboxCell = {
  render: (props) => {
    const [selectedIds, setSelectedIds] = useState(() => new Set<string>());
    const id = useId();

    return (
      <TableContainer>
        <Table {...props}>
          <Table.Head>
            <Table.Row>
              <Table.CheckboxCell
                checked={selectedIds.size === USERS.length}
                indeterminate={
                  selectedIds.size !== USERS.length && selectedIds.size > 0
                }
                onChange={(e) => {
                  setSelectedIds(
                    new Set(
                      e.target.checked ? USERS.map((user) => user.id) : [],
                    ),
                  );
                }}
              />
              {COLUMNS.map((column) => (
                <Table.Cell key={column}>{column}</Table.Cell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {USERS.map((user, index) => {
              const selected = selectedIds.has(user.id);
              const nameId = `table-select-${id}-${user.id}`;
              return (
                <Table.Row key={user.id} selected={selected}>
                  <Table.CheckboxCell
                    aria-labelledby={nameId}
                    checked={selectedIds.has(user.id)}
                    disabled={index === 2}
                    onChange={() =>
                      setSelectedIds(
                        (prev) =>
                          new Set(
                            selected
                              ? [...prev].filter((id) => id !== user.id)
                              : [...prev, user.id],
                          ),
                      )
                    }
                  />
                  {COLUMNS.map((column) => (
                    <Table.Cell
                      key={column}
                      id={column === "name" ? nameId : undefined}
                      as={column === "name" ? "th" : "td"}
                    >
                      {user[column]}
                    </Table.Cell>
                  ))}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </TableContainer>
    );
  },
} satisfies Story;

interface SortState {
  column: keyof User;
  direction: "asc" | "desc" | "none";
}

const makeCompareUser = (state: SortState) => {
  return (userA: User, userB: User) => {
    const valueA = userA[state.column];
    const valueB = userB[state.column];
    const result = (() => {
      if (typeof valueA === "number" && typeof valueB === "number") {
        return valueA - valueB;
      }
      return valueA.toString().localeCompare(valueB.toString());
    })();
    return state.direction === "asc" ? result : -result;
  };
};

export const WithSortLabel = {
  render: (props) => {
    const [sortState, setSortState] = useState<SortState>();

    return (
      <TableContainer>
        <Table {...props}>
          <Table.Head>
            <Table.Row>
              {COLUMNS.map((column) => (
                <Table.Cell key={column}>
                  <Table.SortLabel
                    direction={
                      sortState?.column === column
                        ? sortState.direction
                        : "none"
                    }
                    onOrderChange={(direction) =>
                      setSortState({ column, direction })
                    }
                  >
                    {column}
                  </Table.SortLabel>
                </Table.Cell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {(sortState === undefined || sortState.direction === "none"
              ? USERS
              : [...USERS].sort(makeCompareUser(sortState))
            ).map((user) => (
              <Table.Row key={user.id}>
                {COLUMNS.map((column) => (
                  <Table.Cell key={column} as={column === "name" ? "th" : "td"}>
                    {user[column]}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </TableContainer>
    );
  },
} satisfies Story;

interface MenuShowGroupProps {
  columns: {
    key: ColumnKey;
    hidden: boolean;
  }[];
  setColumns: (
    value: {
      key: ColumnKey;
      hidden: boolean;
    }[],
  ) => void;
}

const MenuShowGroup: FC<MenuShowGroupProps> = ({ columns, setColumns }) => (
  <ActionList.Group title="Show" selectionType="multiple">
    {columns.map((column, index) => {
      return (
        <ActionList.Item
          key={column.key}
          selected={!column.hidden}
          onClick={(e) => {
            e.preventDefault();
            const value = [...columns];
            value[index] = {
              ...column,
              hidden: !column.hidden,
            };
            setColumns(value);
          }}
        >
          <ActionList.Body>{column.key}</ActionList.Body>
        </ActionList.Item>
      );
    })}
  </ActionList.Group>
);

interface MenuAdjustGroupProps extends MenuShowGroupProps {
  column: ColumnKey;
}

const MenuAdjustGroup: FC<MenuAdjustGroupProps> = ({
  column,
  columns,
  setColumns,
}) => {
  const index = columns.findIndex((c) => c.key === column);
  const visibleColumns = columns.filter((c) => !c.hidden);
  const isFirst = visibleColumns[0]?.key === column;
  const isLast = visibleColumns[visibleColumns.length - 1]?.key === column;
  if (isFirst && isLast) {
    return null;
  }
  return (
    <ActionList.Group title="Adjust">
      {!isFirst && (
        <ActionList.Item
          onClick={() => {
            const current = columns[index];
            const prev = columns[index - 1];
            if (current === undefined || prev === undefined) {
              return;
            }
            const value = [...columns];
            value[index] = prev;
            value[index - 1] = current;
            setColumns(value);
          }}
        >
          <ActionList.Body>Move left</ActionList.Body>
        </ActionList.Item>
      )}
      {!isLast && (
        <ActionList.Item
          onClick={() => {
            const current = columns[index];
            const next = columns[index + 1];
            if (current === undefined || next === undefined) {
              return;
            }
            const value = [...columns];
            value[index] = next;
            value[index + 1] = current;
            setColumns(value);
          }}
        >
          <ActionList.Body>Move right</ActionList.Body>
        </ActionList.Item>
      )}
    </ActionList.Group>
  );
};

export const WithHeaderMenu = {
  render: (props) => {
    const [columns, setColumns] = useState(
      COLUMNS.map((key) => ({
        key,
        hidden: false,
      })),
    );

    return (
      <TableContainer>
        <Table {...props}>
          <Table.Head>
            <Table.Row>
              {columns.map((column) => {
                if (column.hidden) {
                  return null;
                }
                return (
                  <Table.Cell key={column.key}>
                    <div
                      style={{
                        display: "flex",
                        columnGap: "var(--aegis-space-xxSmall)",
                      }}
                    >
                      {column.key}
                      <Menu>
                        <MenuTrigger>
                          <IconButton aria-label="Open Menu">
                            <Icon>
                              <LfAngleDownLarge />
                            </Icon>
                          </IconButton>
                        </MenuTrigger>
                        <MenuContent>
                          <ActionList>
                            <MenuShowGroup
                              columns={columns}
                              setColumns={setColumns}
                            />
                            <MenuAdjustGroup
                              columns={columns}
                              setColumns={setColumns}
                              column={column.key}
                            />
                          </ActionList>
                        </MenuContent>
                      </Menu>
                    </div>
                  </Table.Cell>
                );
              })}
              <Table.Cell>
                <Menu>
                  <MenuTrigger>
                    <IconButton aria-label="Open Menu">
                      <Icon>
                        <LfAngleDownLarge />
                      </Icon>
                    </IconButton>
                  </MenuTrigger>
                  <MenuContent>
                    <ActionList>
                      <MenuShowGroup
                        columns={columns}
                        setColumns={setColumns}
                      />
                    </ActionList>
                  </MenuContent>
                </Menu>
              </Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {USERS.map((user) => (
              <Table.Row key={user.id}>
                {columns.map((column) => {
                  if (column.hidden) {
                    return null;
                  }
                  return (
                    <Table.Cell
                      as={column.key === "name" ? "th" : "td"}
                      key={column.key}
                    >
                      {user[column.key]}
                    </Table.Cell>
                  );
                })}
                <Table.Cell />
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </TableContainer>
    );
  },
} satisfies Story;

export const MultipleLines = {
  args: {
    children: [
      <Table.Head key={0}>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.Cell key={column}>{column}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Head>,
      <Table.Body key={1}>
        {USERS.map((user) => (
          <Table.Row key={user.id}>
            {COLUMNS.map((column) => (
              <Table.Cell
                textAlign={column === "username" ? "end" : undefined}
                verticalAlign="top"
                as={column === "name" ? "th" : "td"}
                key={column}
              >
                <Text whiteSpace="normal">{`${user[column]} `.repeat(2)}</Text>
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>,
    ],
  },
} satisfies Story;

export const WithinPopover = {
  args: {
    children: [
      <Table.Head key={0}>
        <Table.Row>
          <Table.Cell>Name</Table.Cell>
          <Table.Cell>Username</Table.Cell>
          <Table.Cell>Blank item</Table.Cell>
        </Table.Row>
      </Table.Head>,
      <Table.Body key={1}>
        {getUsers(50).map((user) => (
          <Table.Row key={user.id}>
            <Table.Cell as="th">{user.name}</Table.Cell>
            <Table.Cell>{user.username}</Table.Cell>
            <Table.Cell />
          </Table.Row>
        ))}
      </Table.Body>,
    ],
  },
  render: (props) => (
    <Popover defaultOpen={isChromatic()}>
      <Popover.Anchor>
        <Button>Open</Button>
      </Popover.Anchor>
      <Popover.Content>
        <Popover.Body>
          <TableContainer stickyHeader>
            <Table {...props} />
          </TableContainer>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  ),
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
