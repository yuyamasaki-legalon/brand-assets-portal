---
paths: src/**/*.{ts,tsx}
category: "Content"
---
# DataTable

## 関連レシピ

- [DataTable + Pagination](../../aegis-recipes/data-table-pagination.md)


💡 **DataTableは、ソート・行選択・カラム制御などの高度な機能を備えたテーブルコンポーネントです。**

---

## Table との使い分け

| 用途 | 推奨コンポーネント |
| :--- | :--- |
| シンプルなデータ表示 | Table |
| ソート・選択・カラム制御が必要 | DataTable |
| 行の並び替え（ドラッグ）が必要 | DataTable (`rowReorderable`) |

---

## 基本的な使い方

```tsx
import {
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
} from "@legalforce/aegis-react";

type User = {
  id: string;
  name: string;
  email: string;
};

const columns: DataTableColumnDef<User, string>[] = [
  {
    id: "name",
    name: "名前",
    getValue: (row) => row.name,
    sortable: true,
  },
  {
    id: "email",
    name: "メールアドレス",
    getValue: (row) => row.email,
  },
];

const rows: User[] = [
  { id: "1", name: "田中太郎", email: "tanaka@example.com" },
  { id: "2", name: "山田花子", email: "yamada@example.com" },
];

<DataTable
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
/>
```

---

## カラム定義 (`DataTableColumnDef`)

| プロパティ | 型 | 説明 |
| :--- | :--- | :--- |
| `id` | `string` | カラムの一意な識別子 |
| `name` | `string` | ヘッダーに表示する名前 |
| `getValue` | `(row: T) => V` | 行データから値を取得する関数 |
| `sortable` | `boolean` | ソート可能にするか |
| `reorderable` | `boolean` | カラム順序の変更を許可するか |
| `pinnable` | `boolean` | カラムのピン留めを許可するか |
| `hideable` | `boolean` | カラムの非表示を許可するか |
| `renderCell` | `(props) => ReactNode` | セルのカスタムレンダリング |
| `renderHeader` | `(props) => ReactNode` | ヘッダーのカスタムレンダリング |

---

## 主要な Props

### 必須 Props

| Prop | 型 | 説明 |
| :--- | :--- | :--- |
| `columns` | `DataTableColumnDef<T, any>[]` | カラム定義の配列 |
| `rows` | `T[]` | 行データの配列 |

### オプション Props

| Prop | 型 | デフォルト | 説明 |
| :--- | :--- | :--- | :--- |
| `getRowId` | `(row: T) => string` | - | 行の一意なIDを取得する関数 |
| `size` | `"small" \| "medium"` | `"medium"` | テーブルのサイズ |
| `stickyHeader` | `boolean` | `false` | ヘッダーを固定するか |
| `highlightRowOnHover` | `boolean` | `true` | ホバー時に行をハイライトするか |
| `highlightedRows` | `string[]` | `[]` | ハイライトする行のID配列 |
| `badgedRows` | `string[]` | `[]` | バッジを表示する行のID配列 |

---

## 機能別ガイド

### カスタムセルレンダリング

`DataTableCell` を使用してセルをカスタマイズします。

```tsx
import { DataTableCell, Avatar, Select } from "@legalforce/aegis-react";

const columns: DataTableColumnDef<User, string>[] = [
  {
    id: "name",
    name: "名前",
    getValue: (row) => row.name,
    renderCell: ({ value, row }) => (
      <DataTableCell leading={<Avatar name={row.name} />}>
        {value}
      </DataTableCell>
    ),
  },
  {
    id: "status",
    name: "ステータス",
    getValue: (row) => row.status,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Select options={statusOptions} defaultValue={value} />
      </DataTableCell>
    ),
  },
];
```

### カスタムヘッダーレンダリング

`DataTableHeader` を使用してヘッダーをカスタマイズします。

```tsx
import { DataTableHeader, Icon, IconButton } from "@legalforce/aegis-react";
import { LfBuilding, LfFaceMoodSmile } from "@legalforce/aegis-icons";

const columns: DataTableColumnDef<User, string>[] = [
  {
    id: "organization",
    name: "組織",
    getValue: (row) => row.organization,
    renderHeader: ({ name }) => (
      <DataTableHeader leading={<Icon><LfBuilding /></Icon>}>
        {name}
      </DataTableHeader>
    ),
  },
  {
    id: "username",
    name: "ユーザー名",
    getValue: (row) => row.username,
    renderHeader: ({ name }) => (
      <DataTableHeader
        action={
          <IconButton aria-label="アクション">
            <Icon><LfFaceMoodSmile /></Icon>
          </IconButton>
        }
      >
        {name}
      </DataTableHeader>
    ),
  },
];
```

### セル内リンク

`DataTableLink` を使用すると、行全体をクリッカブルにするオーバーレイリンクを作成できます。

```tsx
import { DataTableCell, DataTableLink, Link } from "@legalforce/aegis-react";

const columns: DataTableColumnDef<User, string>[] = [
  {
    id: "name",
    name: "名前（オーバーレイリンク）",
    getValue: (row) => row.name,
    renderCell: ({ value }) => (
      <DataTableCell>
        <DataTableLink href="#">{value}</DataTableLink>
      </DataTableCell>
    ),
  },
  {
    id: "username",
    name: "ユーザー名（インラインリンク）",
    getValue: (row) => row.username,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Link href="#">{value}</Link>
      </DataTableCell>
    ),
  },
];
```

### ソート機能

```tsx
// クライアントサイドソート（自動）
<DataTable
  columns={columns}
  rows={rows}
  defaultSorting={[{ id: "name", desc: false }]}
  onSortingChange={(sorting) => console.log(sorting)}
/>

// サーバーサイドソート（手動）
<DataTable
  columns={columns}
  rows={rows}
  manualSorting
  sorting={sorting}
  onSortingChange={setSorting}
/>
```

カラム定義で `sortable: true` を指定したカラムのみソート可能になります。

### 行選択機能

```tsx
// 複数選択
<DataTable
  columns={columns}
  rows={rows}
  rowSelectionType="multiple"
  selectedRows={selectedRows}
  onSelectedRowsChange={setSelectedRows}
  canSelectRow={({ row }) => !row.title.endsWith("Consultant")}
/>
```

### カラムピン留め

```tsx
<DataTable
  columns={columns}
  rows={rows}
  defaultColumnPinning={{
    start: ["name", "username"],
    end: ["organization", "country"],
  }}
  onColumnPinningChange={(pinning) => console.log(pinning)}
/>
```

カラム定義で `pinnable: false` を指定するとピン留め不可にできます。

### カラム表示/非表示

```tsx
<DataTable
  columns={columns}
  rows={rows}
  defaultColumnVisibility={{
    username: false,
    country: false,
  }}
  onColumnVisibilityChange={setColumnVisibility}
/>
```

カラム定義で `hideable: true` を指定したカラムのみ非表示可能になります。

### カラムリサイズ

```tsx
<DataTable
  columns={columns}
  rows={rows}
  defaultColumnSizing={{
    name: 300,
    username: 250,
  }}
  onColumnSizingChange={setColumnSizing}
/>
```

### カラム順序変更

```tsx
<DataTable
  columns={columns}
  rows={rows}
  defaultColumnOrder={["organization", "title"]}
  onColumnOrderChange={setColumnOrder}
/>
```

カラム定義で `reorderable: false` を指定すると順序変更不可にできます。

### 行の並び替え（ドラッグ&ドロップ）

```tsx
const [rows, setRows] = useState(initialRows);

<DataTable
  columns={columns}
  rows={rows}
  rowReorderable
  onRowOrderChange={setRows}
/>
```

---

## 使用時の注意点

### getRowId の指定

行選択やハイライトなど、行を識別する機能を使う場合は `getRowId` を必ず指定してください。

```tsx
// Good
<DataTable getRowId={(row) => row.id} />

// 行識別機能を使う場合は避ける
<DataTable />
```

### stickyHeader の使用

スクロールが発生するテーブルでは、ヘッダーを固定することを推奨します。

```tsx
<DataTable stickyHeader />
```

### カラムヘッダーメニュー（"..." アイコン）の非表示

カラムヘッダーに表示される "..." メニュー（Pin to left / Unpin / Manage columns）を非表示にするには、全カラムで `pinnable: false` を指定します（`hideable` はデフォルトで `false`）。

```tsx
const columns: DataTableColumnDef<Item, string>[] = [
  {
    id: "name",
    name: "名前",
    getValue: (row) => row.name,
    pinnable: false, // メニューの「Pin」系オプションを無効化
    sortable: true,
  },
  // ... 他のカラムも同様に pinnable: false を指定
];
```

> **注意:** `pinnable: false` はUIからのピン操作を無効にするだけで、`defaultColumnPinning` によるプログラム的なピン留めは引き続き有効です。

### ホバーアクションの無効化

行がクリッカブルでない場合は、`highlightRowOnHover` を `false` に設定してください。

```tsx
<DataTable highlightRowOnHover={false} />
```

---

## カタログ（Storybook）
<!-- STORYBOOK_CATALOG_START -->
```tsx
import { useState } from "react";
import { LfBuilding, LfFaceMoodSmile } from "@legalforce/aegis-icons";
import { MagnifyingGlass } from "@legalforce/aegis-illustrations/react";
import { i18n } from "@legalforce/aegis-tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Avatar } from "../../src/components/Avatar";
import { IconButton } from "../../src/components/Button";
import { Combobox } from "../../src/components/Combobox";
import type { DataTableColumnDef } from "../../src/components/DataTable";
import {
  DataTable,
  DataTableCell,
  DataTableDescription,
  DataTableHeader,
  DataTableLink,
} from "../../src/components/DataTable";
import { RangeDatePicker } from "../../src/components/DatePicker";
import { EmptyState } from "../../src/components/EmptyState";
import { Icon } from "../../src/components/Icon";
import {
  MenuContent,
  MenuItem,
  MenuSub,
  MenuSubTrigger,
} from "../../src/components/Menu";
import { Select } from "../../src/components/Select";
import { Link } from "../../src/components/Text";
import { TextField } from "../../src/components/TextField";
import type { User } from "../_utils/data";
import { getUsers } from "../_utils/data";

const USERS = getUsers(10);

export default {
  component: DataTable,
  args: {
    columns: [
      {
        id: "name",
        name: "Name",
        getValue: (row) => row.name,
        reorderable: false,
        sortable: true,
        renderCell: ({ value }) => (
          <DataTableCell
            trailing={
              <IconButton aria-label="Action">
                <Icon>
                  <LfFaceMoodSmile />
                </Icon>
              </IconButton>
            }
          >
            {value}
          </DataTableCell>
        ),
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "username",
        name: "Username",
        getValue: (row) => row.username,
        renderHeader: ({ name }) => (
          <DataTableHeader
            action={
              <IconButton aria-label="Smile">
                <Icon>
                  <LfFaceMoodSmile />
                </Icon>
              </IconButton>
            }
          >
            {name}
          </DataTableHeader>
        ),
        renderCell: ({ value, row }) => (
          <DataTableCell leading={<Avatar name={row.name} />}>
            {value}
          </DataTableCell>
        ),
        sortable: true,
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "organization",
        name: "Organization",
        getValue: (row) => row.organization,
        renderHeader: ({ name }) => (
          <DataTableHeader
            leading={
              <Icon>
                <LfBuilding />
              </Icon>
            }
          >
            {name}
          </DataTableHeader>
        ),
        sortable: true,
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "country",
        name: "Country",
        getValue: (row) => row.country,
        sortable: true,
        hideable: true,
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "title",
        name: "Title",
        getValue: (row) => row.title,
        sortable: true,
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "bio",
        name: "Bio",
        getValue: (row) => row.bio,
        pinnable: false,
        hideable: true,
      } satisfies DataTableColumnDef<User, string>,
    ],
    rows: USERS,
    getRowId: (row) => row.id,
  },
} satisfies Meta<typeof DataTable<User>>;

type Story = StoryObj<typeof DataTable<User>>;

export const Size = {
  args: {
    size: "small",
  },
} satisfies Story;

export const StickyHeader = {
  args: {
    stickyHeader: true,
  },
} satisfies Story;

export const ColumnBordered = {
  args: {
    columnBordered: true,
  },
} satisfies Story;

export const OuterBordered = {
  args: {
    outerBordered: true,
  },
} satisfies Story;

export const Empty = {
  args: {
    rows: [],
    rowVirtualization: true,
    defaultColumnPinning: {
      start: ["name"],
    },
    empty: (
      <EmptyState visual={<MagnifyingGlass />} title="Title">
        Body of the EmptyState
      </EmptyState>
    ),
  },
} satisfies Story;

export const HighlightScopeCell = {
  args: {
    highlightScope: "cell",
  },
} satisfies Story;

export const HighlightScopeNone = {
  ...HighlightScopeCell,
  args: {
    ...HighlightScopeCell.args,
    highlightScope: "none",
  },
} satisfies Story;

export const HighlightedRows = {
  args: {
    highlightedRows: [0, 2, 3, 7].map((i) => USERS[i]!.id),
  },
} satisfies Story;

export const BadgedRows = {
  args: {
    badgedRows: HighlightedRows.args.highlightedRows,
    defaultColumnOrder: ["name"],
  },
} satisfies Story;

export const ExtraHeaderMenuItems = {
  args: {
    columns: [
      {
        id: "country",
        name: "Country",
        getValue: (row) => row.country,
        sortable: true,
        hideable: true,
        renderHeader: ({ name }) => (
          <DataTableHeader
            extraMenuItems={
              <>
                <MenuItem>Extra Item 1</MenuItem>
                <MenuItem color="danger">Extra Item 2</MenuItem>
                <MenuSub>
                  <MenuSubTrigger>Extra Item 3</MenuSubTrigger>
                  <MenuContent>
                    <MenuItem>Extra Item 3.1</MenuItem>
                    <MenuItem>Extra Item 3.2</MenuItem>
                  </MenuContent>
                </MenuSub>
              </>
            }
          >
            {name}
          </DataTableHeader>
        ),
      } satisfies DataTableColumnDef<User, string>,
    ],
  },
} satisfies Story;

export const WithLink = {
  args: {
    columns: [
      {
        id: "name",
        name: "Name (Overlay Link)",
        getValue: (row) => row.name,
        renderCell: ({ value }) => (
          <DataTableCell>
            <DataTableLink href="#">{value}</DataTableLink>
          </DataTableCell>
        ),
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "username",
        name: "Username (Inline Link)",
        getValue: (row) => row.username,
        renderCell: ({ value }) => (
          <DataTableCell leading={<Avatar name={value} />}>
            <Link href="#">{value}</Link>
          </DataTableCell>
        ),
      } satisfies DataTableColumnDef<User, string>,
    ],
  },
} satisfies Story;

export const WithDescription = {
  args: {
    columns: [
      {
        id: "name",
        name: "Name",
        getValue: (row) => row.name,
        renderHeader: ({ name }) => {
          return (
            <DataTableHeader>
              {name}
              <DataTableDescription>Description</DataTableDescription>
            </DataTableHeader>
          );
        },
        renderCell: ({ value, row }) => {
          return (
            <DataTableCell>
              {value}
              <DataTableDescription>{row.username}</DataTableDescription>
            </DataTableCell>
          );
        },
        resizable: false,
        pinnable: false,
      } satisfies DataTableColumnDef<User, string>,
    ],
  },
} satisfies Story;

const getSelectOptions = <Key extends keyof User>(key: Key) => {
  return [...new Set(USERS.map((user) => user[key]))].map((value) => ({
    value,
    label: value,
  }));
};
export const WithFields = {
  args: {
    highlightedRows: [USERS[3]!.id, USERS[5]!.id],
    columns: [
      {
        id: "name",
        name: "Name",
        getValue: (row) => row.name,
        renderCell: ({ value }) => (
          <DataTableCell>
            <TextField placeholder="Name" defaultValue={value} />
          </DataTableCell>
        ),
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "title",
        name: "Title",
        getValue: (row) => row.title,
        renderCell: ({ value }) => (
          <DataTableCell>
            <Combobox
              options={getSelectOptions("title")}
              placeholder="Title"
              defaultValue={value}
            />
          </DataTableCell>
        ),
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "organization",
        name: "Organization",
        getValue: (row) => row.organization,
        renderCell: ({ value }) => (
          <DataTableCell>
            <Select
              options={getSelectOptions("organization")}
              placeholder="Organization"
              defaultValue={value}
            />
          </DataTableCell>
        ),
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "subscriptionPeriod",
        name: "Subscription Period",
        getValue: (user) => user.subscriptionPeriod,
        renderCell: ({ value }) => (
          <DataTableCell>
            <RangeDatePicker
              defaultStartValue={value.start}
              defaultEndValue={value.end}
            />
          </DataTableCell>
        ),
      } satisfies DataTableColumnDef<User, User["subscriptionPeriod"]>,
    ],
  },
} satisfies Story;

export const MultipleRowSelection = {
  args: {
    rowSelectionType: "multiple",
    canSelectRow: ({ row }) => row.id !== USERS[3]!.id,
    onSelectedRowsChange: fn(),
  },
} satisfies Story;

export const Sorting = {
  args: {
    defaultSorting: [{ id: "name", desc: false }],
    onSortingChange: fn(),
  },
} satisfies Story;

export const ManualSorting = {
  ...Sorting,
  args: {
    ...Sorting.args,
    manualSorting: true,
  },
} satisfies Story;

export const ColumnPinning = {
  args: {
    defaultColumnPinning: {
      start: ["name", "username"],
      end: ["organization", "country"],
    },
    onColumnPinningChange: fn(),
  },
} satisfies Story;

export const ColumnOrder = {
  args: {
    defaultColumnOrder: ["organization", "title"],
    onColumnOrderChange: fn(),
  },
} satisfies Story;

export const ColumnVisibility = {
  args: {
    defaultColumnVisibility: {
      username: false,
      country: false,
      bio: false,
    },
    onColumnVisibilityChange: fn(),
  },
} satisfies Story;

export const ColumnSizing = {
  args: {
    defaultColumnSizing: {
      name: 300,
      username: 250,
    },
    onColumnSizingChange: fn(),
  },
} satisfies Story;

export const RowReorderable = {
  args: {
    rowReorderable: true,
  },
  render: (args) => {
    const [rows, setRows] = useState(USERS);
    return <DataTable {...args} rows={rows} onRowOrderChange={setRows} />;
  },
} satisfies Story;

export const GlobalFilter = {
  args: {
    defaultGlobalFilter: "ni",
  },
} satisfies Story;

/**
 * Following features may be pointless or may not work as expected when column spanning is used,
 * and highly recommended to be disabled:
 *
 * - Column Reordering (reorderable)
 * - Column Pinning (pinnable)
 * - Hiding Columns (hideable)
 */
export const ColumnSpanning = {
  args: {
    columns: [
      {
        id: "name",
        name: "Name",
        getValue: (row) => row.name,
        reorderable: false,
        pinnable: false,
        colSpan: ({ row }) => {
          if (row.id === USERS[0]!.id) {
            return 6;
          }
        },
        renderCell: ({ value, row }) => {
          if (row.id === USERS[0]!.id) {
            return (
              <DataTableCell>
                {value}
                <DataTableDescription>
                  This cell has a colspan of 6
                </DataTableDescription>
              </DataTableCell>
            );
          }
          return <DataTableCell>{value}</DataTableCell>;
        },
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "username",
        name: "Username",
        getValue: (row) => row.username,
        reorderable: false,
        pinnable: false,
        colSpan: ({ row }) => {
          if (row.id === USERS[1]!.id) {
            return 2;
          }
        },
        renderCell: ({ value, row }) => {
          if (row.id === USERS[1]!.id) {
            return (
              <DataTableCell>
                {value}
                <DataTableDescription>
                  This cell has a colspan of 2
                </DataTableDescription>
              </DataTableCell>
            );
          }
          return <DataTableCell>{value}</DataTableCell>;
        },
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "organization",
        name: "Organization",
        getValue: (row) => row.organization,
        reorderable: false,
        pinnable: false,
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "country",
        name: "Country",
        getValue: (row) => row.country,
        reorderable: false,
        pinnable: false,
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "title",
        name: "Title",
        getValue: (row) => row.title,
        reorderable: false,
        pinnable: false,
      } satisfies DataTableColumnDef<User, string>,
      {
        id: "bio",
        name: "Bio",
        getValue: (row) => row.bio,
        reorderable: false,
        pinnable: false,
      } satisfies DataTableColumnDef<User, string>,
    ],
  },
} satisfies Story;

export const RowVirtualization = {
  args: {
    rowVirtualization: true,
    stickyHeader: true,
    rows: getUsers(100),
  },
} satisfies Story;
```
<!-- STORYBOOK_CATALOG_END -->
