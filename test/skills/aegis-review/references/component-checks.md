# コンポーネント別チェック詳細

## カスタム UI の検出

以下の生 HTML 要素を Aegis コンポーネントで使用していない場合に検出する:

| 生 HTML | 推奨 Aegis コンポーネント | 重大度 |
|---|---|---|
| `<button>` | `<Button>` / `<IconButton>` | Error |
| `<input>` | `<TextField>` / `<Checkbox>` / `<Radio>` | Error |
| `<select>` | `<Select>` / `<Combobox>` | Error |
| `<textarea>` | `<Textarea>` | Error |
| `<table>` | `<Table>` / `<DataTable>` | Error |
| `<span>` | `<Text>` | Warning |
| `<a>` | `<Link>` | Warning |
| `<dialog>` | `<Dialog>` | Error |

**例外**: `<div>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<nav>`, `<aside>`, `<ul>`, `<ol>`, `<li>` はレイアウト用途で許容。

---

## Button

### チェック 1: インライン margin（Error）
```
パターン: <Button style={{ margin*: ... }}>
ESLint: aegis-custom/no-button-inline-margin
修正: 親レイアウト（Stack, ButtonGroup）の gap で余白制御
```

### チェック 2: インライン width（Error）
```
パターン: <Button style={{ width: ... }}>
ESLint: aegis-custom/no-button-inline-width
修正: Button の width prop を使用
```

### チェック 3: 複数 Solid（Warning）
```
パターン: 同一 ButtonGroup / DialogFooter に複数の variant="solid"
ESLint: aegis-custom/no-multiple-solid-buttons
修正: Solid は 1 つ、他は plain/subtle に
```

### チェック 4: スタイルオーバーライド（Error）
```
パターン: <Button style={{ backgroundColor: ..., boxShadow: ... }}>
修正: variant + color prop で外観制御
```

### チェック 5: leading/trailing にインタラクティブ要素（Warning）
```
パターン: <Button leading={<IconButton ...>}>
修正: leading/trailing には静的な Icon のみ
```

---

## IconButton

### チェック 1: aria-label 必須（Error）
```
パターン: <IconButton> (aria-label なし)
ESLint: aegis-custom/require-iconbutton-aria-label
修正: <IconButton aria-label="...">
```

### チェック 2: Tooltip ラップ（Warning）
```
パターン: <IconButton> (Tooltip 外)
ESLint: aegis-custom/no-icon-button-without-popper
修正: <Tooltip title="..."><IconButton ...></Tooltip>
```

---

## FormControl / 入力コンポーネント

### チェック 1: FormControl 外の入力（Warning）
```
パターン: <TextField> / <Select> が FormControl 外で aria-label なし
ESLint: aegis-custom/no-textfield-without-formcontrol
修正: FormControl 内に配置するか aria-label を付ける
```

### チェック 2: Label 必須（Error）
```
パターン: <FormControl> に FormControl.Label なし
修正: <FormControl.Label>...</FormControl.Label> を追加
```

### チェック 3: error キャプション（Warning）
```
パターン: <FormControl error> に FormControl.Caption なし
修正: FormControl.Caption でエラー内容を表示
```

対象コンポーネント: TextField, Select, Textarea, Combobox, TagInput, TagPicker, DateField, DatePicker, RangeDatePicker, TimeField

---

## Dialog

### チェック 1: DialogHeader 必須（Error）
```
パターン: <DialogContent> に DialogHeader なし
ESLint: aegis-custom/no-dialog-without-header
修正: DialogHeader + ContentHeader.Title を追加
```

### チェック 2: Banner の配置（Error）
```
パターン: <DialogBody> に <Banner> を直接配置
修正: DialogStickyContainer（top/bottom）に配置
```

### チェック 3: 複数 Solid（Warning）
```
パターン: <DialogFooter> に複数の variant="solid"
修正: Solid は 1 つまで
```

---

## Drawer

### チェック 1: Drawer.Header 必須（Error）
```
パターン: <Drawer> に Drawer.Header なし
修正: <Drawer.Header>タイトル</Drawer.Header> を追加
```

### チェック 2: 閉じるボタン二重（Error）
```
パターン: Drawer.Header の ContentHeader.trailing に LfClose IconButton
修正: trailing から閉じるボタンを削除（自動提供済み）
```

---

## Table

### チェック 1: Table.Head 必須（Error）
```
パターン: <Table> に Table.Head なし
修正: Table.Head + 列見出しを追加
```

### チェック 2: ActionCell 使用（Error）
```
パターン: <Table.Cell> にボタンを直接配置
修正: <Table.ActionCell> を使用
```

### チェック 3: CheckboxCell aria-labelledby（Warning）
```
パターン: <Table.CheckboxCell> に aria-labelledby なし
修正: 名前セルの id と紐付け
```

---

## Banner

### チェック 1: Icon 二重追加（Error）
```
パターン: <Banner> に Icon 子要素
ESLint: aegis-custom/no-banner-icon-children
修正: Banner は color に応じてアイコン自動表示
```

### チェック 2: color prop の一致（Info）
```
パターン: エラー内容に color="information"
修正: color="danger" に変更
```

---

## Link

### チェック 1: Icon 子要素（Error）
```
パターン: <Link><Icon>...</Icon>テキスト</Link>
ESLint: aegis-custom/no-link-icon-children
修正: trailing / leading prop を使用
```

### チェック 2: href なし（Warning）
```
パターン: <Link onClick={...}> (href なし)
修正: href を設定するか role="button" を付与
```

---

## Typography

### チェック 1: style.whiteSpace（Error）
```
パターン: <Text style={{ whiteSpace: "nowrap" }}>
ESLint: aegis-custom/no-aegis-typography-inline-style
修正: <Text whiteSpace="nowrap"> prop を使用
```

---

## Tooltip

### チェック 1: テキスト省略対応（Warning）
```
パターン: <Text numberOfLines={1}> に Tooltip なし
修正: <Tooltip title={...} onlyOnOverflow><Text ...></Tooltip>
```
