# WCAG 2.1 AA 静的解析チェックリスト

React + TypeScript の JSX コードに対して静的に検出可能な WCAG 2.1 AA 達成基準を整理する。

---

## 1. 知覚可能 (Perceivable)

### 1.1.1 Non-text Content

テキスト以外のコンテンツには、同等の目的を果たす代替テキストが必要。

**検出パターン:**

```tsx
// ❌ Error: alt 属性なし
<img src="/logo.png" />

// ❌ Error: 無意味な alt テキスト
<img src="/user.png" alt="image" />
<img src="/photo.jpg" alt="picture" />
<img src="/icon.svg" alt="icon" />

// ✅ OK: 意味のある alt テキスト
<img src="/user.png" alt="ユーザーのプロフィール画像" />

// ✅ OK: 装飾的画像
<img src="/divider.png" alt="" />
<img src="/bg.png" alt="" aria-hidden="true" />
```

**重大度:** Error

---

### 1.3.1 Info and Relationships

情報、構造、および関係性はプログラム的に決定可能であること。

**検出パターン:**

```tsx
// ❌ Error: フォームコントロールにラベルなし
<TextField />

// ❌ Error: FormControl 内にラベルなし
<FormControl>
  <TextField />
</FormControl>

// ✅ OK: FormControl + Label
<FormControl>
  <FormControl.Label>氏名</FormControl.Label>
  <TextField />
</FormControl>

// ✅ OK: aria-label で代替（Table 内など）
<TextField aria-label="氏名" />

// ❌ Error: Table に見出し行なし
<Table>
  <Table.Body>
    <Table.Row>...</Table.Row>
  </Table.Body>
</Table>

// ✅ OK: Table.Head あり
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Cell>名前</Table.Cell>
    </Table.Row>
  </Table.Head>
  <Table.Body>...</Table.Body>
</Table>
```

**重大度:** Error

---

### 1.3.2 Meaningful Sequence

コンテンツの意味のある順序はプログラム的に決定可能であること。

**検出パターン:**

```tsx
// ❌ Warning: 正の tabIndex（フォーカス順序を乱す）
<button tabIndex={5}>送信</button>

// ✅ OK: tabIndex 0 または -1
<button tabIndex={0}>送信</button>
<div tabIndex={-1} ref={errorRef}>エラーメッセージ</div>
```

**重大度:** Warning

---

### 1.4.1 Use of Color

色だけで情報を伝えていないこと。

**検出パターン:**

```tsx
// ❌ Warning: 色のみでステータスを伝達
<span style={{ color: "red" }}>エラー</span>
<span style={{ color: "green" }}>成功</span>

// ✅ OK: アイコン + テキストの併用
<Banner color="danger">エラーが発生しました</Banner>

// ✅ OK: StatusLabel を使用
<StatusLabel color="danger">却下</StatusLabel>
```

**重大度:** Warning

---

### 1.4.3 Contrast (Minimum)

テキストと背景のコントラスト比が 4.5:1 以上（大きいテキストは 3:1 以上）。

**検出パターン:**

```tsx
// ❌ Info: インラインスタイルで色を直接指定（コントラスト比を保証できない）
<span style={{ color: "#999", backgroundColor: "#fff" }}>テキスト</span>

// ✅ OK: Aegis デザイントークンを使用（コントラスト比が保証される）
<Text color="subtle">テキスト</Text>
```

**重大度:** Info（静的解析ではコントラスト比の正確な計算は困難なため）

---

## 2. 操作可能 (Operable)

### 2.1.1 Keyboard

すべての機能がキーボードから利用可能であること。

**検出パターン:**

```tsx
// ❌ Error: div/span に onClick のみ（キーボード操作不可）
<div onClick={handleClick}>クリックして開く</div>
<span onClick={handleDelete}>削除</span>

// ✅ OK: セマンティックな HTML 要素を使用
<button onClick={handleClick}>クリックして開く</button>
<Button onClick={handleDelete}>削除</Button>

// ✅ OK: ARIA ロール + キーボード対応
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
>
  クリックして開く
</div>

// ❌ Warning: onMouseDown のみ（キーボード対応なし）
<div onMouseDown={handleAction}>アクション</div>
```

**重大度:** Error（div/span + onClick）/ Warning（マウスのみ）

---

### 2.4.2 Page Titled

ページにはそのトピックまたは目的を説明するタイトルがあること。

**検出パターン:**

```tsx
// ❌ Warning: ContentHeader.Title なし
<PageLayout>
  <PageLayoutContent>
    <PageLayoutBody>...</PageLayoutBody>
  </PageLayoutContent>
</PageLayout>

// ✅ OK: ContentHeader.Title あり
<PageLayout>
  <PageLayoutContent>
    <PageLayoutHeader>
      <ContentHeader>
        <ContentHeader.Title>ユーザー一覧</ContentHeader.Title>
      </ContentHeader>
    </PageLayoutHeader>
    <PageLayoutBody>...</PageLayoutBody>
  </PageLayoutContent>
</PageLayout>
```

**重大度:** Warning

---

### 2.4.3 Focus Order

フォーカス可能なコンポーネントのフォーカス順序が意味のある順序であること。

**検出パターン:**

```tsx
// ❌ Warning: 正の tabIndex（フォーカス順序を制御しようとしている）
<input tabIndex={3} />
<button tabIndex={1}>先にフォーカス</button>
<input tabIndex={2} />

// ✅ OK: DOM の順序でフォーカス
<input />
<input />
<button>送信</button>
```

**重大度:** Warning

---

### 2.4.6 Headings and Labels

見出しおよびラベルは、トピックまたは目的を説明していること。

**検出パターン:**

```tsx
// ❌ Error: 空の見出し
<h2></h2>
<Title as="h2"></Title>

// ❌ Warning: 見出しレベルの飛ばし
<h1>ページタイトル</h1>
<h3>セクション</h3>  // h2 がない

// ✅ OK: 正しい見出し階層
<h1>ページタイトル</h1>
<h2>セクション</h2>
<h3>サブセクション</h3>
```

**重大度:** Error（空の見出し）/ Warning（レベル飛ばし）

---

### 2.4.7 Focus Visible

キーボード操作でフォーカスが移動したとき、フォーカスインジケーターが見えること。

**検出パターン:**

```tsx
// ❌ Warning: outline を非表示にしている
<button style={{ outline: "none" }}>送信</button>
<div style={{ outline: "0" }}>操作</div>

// ✅ OK: Aegis コンポーネントを使用（フォーカス表示が自動的に保証される）
<Button>送信</Button>
```

**重大度:** Warning

---

## 3. 理解可能 (Understandable)

### 3.1.1 Language of Page

ページのデフォルト言語がプログラム的に決定可能であること。

**検出パターン:**

```tsx
// ❌ Info: html タグに lang 属性なし（通常 index.html で設定されるため低優先度）
<html>

// ✅ OK
<html lang="ja">
```

**重大度:** Info

---

### 3.3.1 Error Identification

入力エラーが自動的に検出された場合、エラー箇所が特定され、テキストで説明されること。

**検出パターン:**

```tsx
// ❌ Warning: error 状態があるがキャプションなし
<FormControl error>
  <FormControl.Label>メール</FormControl.Label>
  <TextField />
</FormControl>

// ✅ OK: error + エラーキャプション
<FormControl error>
  <FormControl.Label>メール</FormControl.Label>
  <TextField />
  <FormControl.Caption>メールアドレスの形式が正しくありません</FormControl.Caption>
</FormControl>
```

**重大度:** Warning

---

### 3.3.2 Labels or Instructions

ユーザーの入力を要求する場合、ラベルまたは説明が提供されること。

**検出パターン:**

```tsx
// ❌ Error: ラベルなしの入力フィールド
<TextField placeholder="検索" />

// ✅ OK: FormControl.Label あり
<FormControl>
  <FormControl.Label>検索キーワード</FormControl.Label>
  <TextField placeholder="例: 契約書" />
</FormControl>

// ✅ OK: aria-label あり（Table 内など）
<TextField aria-label="検索キーワード" placeholder="例: 契約書" />
```

**重大度:** Error

---

## 4. 堅牢 (Robust)

### 4.1.2 Name, Role, Value

すべての UI コンポーネントの名前と役割がプログラム的に決定可能であること。

**検出パターン:**

```tsx
// ❌ Error: IconButton にアクセシブル名なし
<IconButton>
  <Icon><LfTrash /></Icon>
</IconButton>

// ✅ OK: aria-label で名前を提供
<IconButton aria-label="削除">
  <Icon><LfTrash /></Icon>
</IconButton>

// ❌ Error: Dialog にタイトルなし
<Dialog>
  <DialogTrigger><Button>開く</Button></DialogTrigger>
  <DialogContent>
    <DialogBody>内容</DialogBody>
  </DialogContent>
</Dialog>

// ✅ OK: DialogHeader + ContentHeader.Title
<Dialog>
  <DialogTrigger><Button>開く</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <ContentHeader>
        <ContentHeader.Title>確認</ContentHeader.Title>
      </ContentHeader>
    </DialogHeader>
    <DialogBody>内容</DialogBody>
  </DialogContent>
</Dialog>

// ❌ Warning: クリッカブルな Link に href なし
<Link onClick={handleClick}>設定を変更</Link>

// ✅ OK: href あり、または role="button"
<Link href="/settings">設定を変更</Link>
<Link role="button" onClick={handleClick}>設定を変更</Link>
```

**重大度:** Error（名前なし）/ Warning（ロールの不備）
