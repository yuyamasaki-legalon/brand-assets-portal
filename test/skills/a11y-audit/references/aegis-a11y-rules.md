# Aegis コンポーネント固有アクセシビリティルール

Aegis デザインシステムのコンポーネントに固有のアクセシビリティチェックルール。
各コンポーネントのガイドラインは `docs/rules/component/{ComponentName}.md` を正とする。

---

## IconButton

### ルール 1: `aria-label` 必須（Error）

IconButton はテキストラベルを持たないため、スクリーンリーダー向けに `aria-label` が必須。

```tsx
// ❌ Error: aria-label なし
<IconButton>
  <Icon><LfTrash /></Icon>
</IconButton>

// ✅ OK
<IconButton aria-label="削除">
  <Icon><LfTrash /></Icon>
</IconButton>
```

**WCAG:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)

### ルール 2: `Tooltip` ラップ推奨（Warning）

IconButton はテキストラベルがないため、視覚的にもボタンの目的を伝えるために Tooltip で包むことを推奨。

```tsx
// ❌ Warning: Tooltip なし
<IconButton aria-label="削除">
  <Icon><LfTrash /></Icon>
</IconButton>

// ✅ OK
<Tooltip title="削除">
  <IconButton aria-label="削除">
    <Icon><LfTrash /></Icon>
  </IconButton>
</Tooltip>
```

**参照:** `docs/rules/component/IconButton.md` — 「IconButtonにはTooltipが必須です」

### 判定の注意

- Aegis が内部的に提供する IconButton（Dialog / Drawer / Banner の閉じるボタン等）はチェック対象外
- `Table.ActionCell` 内の IconButton は Tooltip ラップを特に強く推奨

---

## Dialog

### ルール 1: `DialogHeader` + `ContentHeader.Title` 必須（Error）

Dialog には支援技術がダイアログの目的を判断するためのタイトルが必要。

```tsx
// ❌ Error: DialogHeader なし
<DialogContent>
  <DialogBody>内容</DialogBody>
  <DialogFooter>...</DialogFooter>
</DialogContent>

// ❌ Error: DialogHeader はあるが Title なし
<DialogContent>
  <DialogHeader>
    <ContentHeader />
  </DialogHeader>
  <DialogBody>内容</DialogBody>
</DialogContent>

// ✅ OK
<DialogContent>
  <DialogHeader>
    <ContentHeader>
      <ContentHeader.Title>削除の確認</ContentHeader.Title>
    </ContentHeader>
  </DialogHeader>
  <DialogBody>この操作は取り消せません。</DialogBody>
  <DialogFooter>
    <ButtonGroup>
      <Button variant="plain">キャンセル</Button>
      <Button color="danger">削除する</Button>
    </ButtonGroup>
  </DialogFooter>
</DialogContent>
```

**WCAG:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)

---

## Drawer

### ルール 1: `Drawer.Header` 必須（Error）

Drawer は WAI-ARIA 上 Dialog に分類されるため、タイトルが必要。

```tsx
// ❌ Error: Drawer.Header なし
<Drawer open={open} onOpenChange={setOpen}>
  <Drawer.Body>
    <p>内容</p>
  </Drawer.Body>
</Drawer>

// ✅ OK
<Drawer open={open} onOpenChange={setOpen}>
  <Drawer.Header>フィルター</Drawer.Header>
  <Drawer.Body>
    <p>内容</p>
  </Drawer.Body>
</Drawer>
```

### ルール 2: 閉じるボタンの二重実装禁止（Error）

`Drawer.Header` は閉じるボタンを自動提供するため、`ContentHeader` の `trailing` に閉じるボタンを追加しない。

```tsx
// ❌ Error: 閉じるボタンが二重
<Drawer.Header>
  <ContentHeader
    trailing={
      <Tooltip title="閉じる">
        <IconButton aria-label="閉じる" onClick={close}>
          <Icon><LfCloseLarge /></Icon>
        </IconButton>
      </Tooltip>
    }
  >
    <ContentHeader.Title>詳細</ContentHeader.Title>
  </ContentHeader>
</Drawer.Header>

// ✅ OK: trailing に閉じるボタンを含めない
<Drawer.Header>
  <ContentHeader>
    <ContentHeader.Title>詳細</ContentHeader.Title>
  </ContentHeader>
</Drawer.Header>
```

**参照:** `docs/rules/component/Drawer.md` — 「閉じるボタンの二重実装禁止」

**判定ヒント:** `trailing` に含まれる IconButton のアイコンが `LfCloseLarge` / `LfClose` の場合、または `aria-label` が `"閉じる"` / `"Close"` の場合に検出する。

---

## Table

### ルール 1: `Table.Head` 必須（Error）

データテーブルには列の見出しが必要。

```tsx
// ❌ Error: Table.Head なし
<Table>
  <Table.Body>
    <Table.Row>
      <Table.Cell>田中太郎</Table.Cell>
      <Table.Cell>tanaka@example.com</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>

// ✅ OK
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Cell>名前</Table.Cell>
      <Table.Cell>メール</Table.Cell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell as="th">田中太郎</Table.Cell>
      <Table.Cell>tanaka@example.com</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

**WCAG:** [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)

### ルール 2: `CheckboxCell` に `aria-labelledby` 推奨（Warning）

行ごとのチェックボックスは、どの行のチェックボックスかをスクリーンリーダーが判別できるようにする。

```tsx
// ❌ Warning: aria-labelledby なし
<Table.CheckboxCell
  checked={selected}
  onChange={handleChange}
/>

// ✅ OK
<Table.CheckboxCell
  aria-labelledby={nameId}
  checked={selected}
  onChange={handleChange}
/>
// 対応する名前セルに id を設定
<Table.Cell id={nameId} as="th">{user.name}</Table.Cell>
```

**参照:** `docs/rules/component/Table.md` の Storybook カタログ `WithCheckboxCell` を参照

---

## FormControl

### ルール 1: `FormControl.Label` 必須（Error）

フォームコントロールにはラベルが必要。

```tsx
// ❌ Error: Label なし
<FormControl>
  <TextField />
</FormControl>

// ✅ OK
<FormControl>
  <FormControl.Label>メールアドレス</FormControl.Label>
  <TextField />
</FormControl>
```

### ルール 2: FormControl 外の入力コントロールに `aria-label` 必須（Error）

`FormControl` の外で使用する入力コントロールには `aria-label` または `aria-labelledby` が必要。

```tsx
// ❌ Error: FormControl 外で aria-label なし
<TextField placeholder="検索" />
<Select options={options} />

// ✅ OK
<TextField aria-label="検索キーワード" placeholder="検索" />
<Select aria-label="通貨" options={options} />
```

**WCAG:** [3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html)

### ルール 3: `error` 状態時のエラーキャプション推奨（Warning）

`error` prop が設定されている場合、エラー内容を伝える `FormControl.Caption` を含めることを推奨。

```tsx
// ❌ Warning: error ありだがキャプションなし
<FormControl error>
  <FormControl.Label>メール</FormControl.Label>
  <TextField />
</FormControl>

// ✅ OK
<FormControl error>
  <FormControl.Label>メール</FormControl.Label>
  <TextField />
  <FormControl.Caption>メールアドレスの形式が正しくありません</FormControl.Caption>
</FormControl>
```

### ルール 4: `required` の表示（Info）

必須マークは Aegis の `required` prop を使用し、`*` のみの表示は避ける。

```tsx
// ❌ Info: 手動で * を付けている
<FormControl>
  <FormControl.Label>メール *</FormControl.Label>
  <TextField />
</FormControl>

// ✅ OK: required prop を使用
<FormControl required>
  <FormControl.Label>メール</FormControl.Label>
  <TextField />
</FormControl>
```

**参照:** `docs/rules/component/FormControl.md` — 「この「必須」というテキストは、アクセシビリティ上表示する必要があります」

---

## EmptyState

### ルール 1: `title` prop 推奨（Warning）

EmptyState には、何が空なのかを伝える `title` を設定することを推奨。

```tsx
// ❌ Warning: title なし
<EmptyState>
  データがありません
</EmptyState>

// ✅ OK
<EmptyState title="検索結果なし">
  条件に一致するデータが見つかりませんでした。
</EmptyState>
```

---

## Banner

### ルール 1: 適切な `color` prop（Info）

Banner の `color` prop はセマンティックな意味を持つため、内容に合った色を選択する。

| color | 用途 |
|---|---|
| `information` | お知らせ、進行中のプロセス |
| `success` | 操作の成功 |
| `danger` | エラー、不可逆な操作の確認 |
| `warning` | 潜在的な問題の警告 |

```tsx
// ❌ Info: エラー内容に information を使用
<Banner color="information">保存に失敗しました</Banner>

// ✅ OK
<Banner color="danger">保存に失敗しました。再度お試しください。</Banner>
```

### ルール 2: Icon の二重追加禁止（Error）

Banner は `color` prop に応じてアイコンを自動表示するため、手動でアイコンを追加しない。

```tsx
// ❌ Error: アイコンが二重表示される
<Banner color="danger">
  <Icon><LfAlertTriangle /></Icon>
  エラーが発生しました
</Banner>

// ✅ OK: Banner が自動でアイコンを表示
<Banner color="danger">エラーが発生しました</Banner>
```

**参照:** `docs/rules/component/Banner.md` — 「Banner に Icon を追加しないでください」

---

## Tooltip

### ルール 1: IconButton のラップ（Warning）

IconButton にはテキストラベルがないため、Tooltip でラップして視覚的な説明を提供する。

（詳細は [IconButton ルール 2](#ルール-2-tooltip-ラップ推奨warning) を参照）

### ルール 2: テキスト省略時のフルテキスト表示（Warning）

`numberOfLines` や CSS によるテキスト省略を使用している場合、`Tooltip` の `onlyOnOverflow` でフルテキストを表示することを推奨。

```tsx
// ❌ Warning: テキスト省略あるが Tooltip なし
<Text numberOfLines={1}>{longText}</Text>

// ✅ OK
<Tooltip title={longText} onlyOnOverflow>
  <Text numberOfLines={1}>{longText}</Text>
</Tooltip>
```

**参照:** `docs/rules/component/Tooltip.md`

---

## Link

### ルール 1: `href` なしの Link に `role="button"` 推奨（Warning）

`Link` を遷移以外の目的で使用する場合（非推奨だが存在する場合）、`role="button"` を設定する。

```tsx
// ❌ Warning: href なしで onClick のみ
<Link onClick={handleClick}>設定を変更</Link>

// ✅ OK: href あり
<Link href="/settings">設定を変更</Link>

// ✅ OK（次善策）: role="button" を付与
<Link role="button" onClick={handleClick}>設定を変更</Link>
```

**参照:** `docs/rules/component/Link.md` — 「遷移用途でないものに使用しないでください」
**WCAG:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)

---

## ルールサマリー表

| コンポーネント | ルール | 重大度 | WCAG |
|---|---|---|---|
| IconButton | `aria-label` 必須 | Error | 4.1.2 |
| IconButton | `Tooltip` ラップ推奨 | Warning | — |
| Dialog | `DialogHeader` + `ContentHeader.Title` 必須 | Error | 4.1.2 |
| Drawer | `Drawer.Header` 必須 | Error | 4.1.2 |
| Drawer | 閉じるボタン二重実装禁止 | Error | — |
| Table | `Table.Head` 必須 | Error | 1.3.1 |
| Table | `CheckboxCell` に `aria-labelledby` | Warning | 4.1.2 |
| FormControl | `FormControl.Label` 必須 | Error | 3.3.2 |
| FormControl | 外部入力に `aria-label` 必須 | Error | 3.3.2 |
| FormControl | `error` 時のキャプション推奨 | Warning | 3.3.1 |
| FormControl | `required` prop の使用 | Info | — |
| EmptyState | `title` prop 推奨 | Warning | — |
| Banner | 適切な `color` prop | Info | — |
| Banner | Icon 二重追加禁止 | Error | — |
| Tooltip | IconButton ラップ | Warning | — |
| Tooltip | テキスト省略時のフルテキスト | Warning | — |
| Link | `href` なし時 `role="button"` | Warning | 4.1.2 |
