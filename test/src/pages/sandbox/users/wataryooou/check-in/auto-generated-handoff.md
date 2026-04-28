# Check In — エンジニアハンドオフ

> Auto-generated from sandbox prototype. Last updated: 2026-04-07

## サマリー

Chromatic の `examples/Page -- CheckIn` を sandbox に再現した新規画面。アプリヘッダー、短い説明付きフォーム、縦積みのアクション、3 タブ風の下部ナビゲーションで構成している。

- **ベース**: 新規画面
- **sandbox**: `src/pages/sandbox/users/wataryooou/check-in/`
- **PRD**: `auto-generated-prd.md`

## 変更概要

| カテゴリ | 変更内容 | 影響度 |
|---------|---------|-------|
| レイアウト | ヘッダー + 中央フォーム + 下部ナビの 3 層構成を新規追加 | High |
| コンポーネント | `Header`, `Form`, `Select`, `Combobox`, `TimeField`, `RadioGroup`, `Menu` を組み合わせて画面化 | High |
| インタラクション | Check in 押下で snackbar を表示 | Medium |
| データモデル | 永続 state や API モデルは未導入 | Low |

## コード差分

sandbox で新規追加した主要な JSX ブロック。

### アプリヘッダー（新規実装）

> 画面タイトルとオーバーフローメニューを上部に固定して、元 Story のアプリ感を再現する。

```tsx
<Header bordered>
  <Header.Item>
    <Header.Title>Check in</Header.Title>
  </Header.Item>
  <Header.Spacer />
  <Header.Item>
    <Menu>
      <MenuTrigger>{/* IconButton */}</MenuTrigger>
      <MenuContent align="end">
        <MenuItem>Share</MenuItem>
        <MenuItem>Report</MenuItem>
      </MenuContent>
    </Menu>
  </Header.Item>
</Header>
```

### チェックインフォーム（新規実装）

> Storybook 例の入力順を維持して、そのまま確認用 UI に使えるようにしている。

```tsx
<Form>
  <FormControl>
    <FormControl.Label>Name</FormControl.Label>
    <TextField />
  </FormControl>
  <FormControl>
    <FormControl.Label>Office</FormControl.Label>
    <Select options={officeOptions} />
  </FormControl>
  <FormControl>
    <FormControl.Label>Desk / Area</FormControl.Label>
    <Combobox options={deskOptions} />
  </FormControl>
  <FormControl>
    <FormControl.Label>Expected departure</FormControl.Label>
    <TimeField />
  </FormControl>
  <RadioGroup defaultValue="workday" title="Visit type">
    <Radio value="workday">Workday</Radio>
    <Radio value="meeting">Meeting</Radio>
    <Radio value="guest">Guest visit</Radio>
  </RadioGroup>
</Form>
```

### アクションと下部ナビ（新規実装）

> 現行パッケージに `BottomNavigation` がないため、下部ナビは Aegis の `Icon` と `Text` を使って代替している。

```tsx
<ButtonGroup fill orientation="vertical">
  <Button onClick={() => snackbar.show({ message: "Checked in successfully!" })}>
    Check in
  </Button>
  <Button variant="plain">Cancel</Button>
</ButtonGroup>

<nav aria-label="Primary navigation">
  <button aria-current="page" type="button">{/* Home */}</button>
  <button type="button">{/* Search */}</button>
  <button type="button">{/* Settings */}</button>
</nav>
```

## コンポーネント使用一覧

| コンポーネント | 用途 | 区分 |
|---------------|------|------|
| `Header` | アプリ上部バー | 新規 |
| `Menu` | ヘッダー右上の操作メニュー | 新規 |
| `PageLayout` | 本文領域の基本構造 | 新規 |
| `ContentHeader` | 見出しと説明文 | 新規 |
| `Form` | フォーム項目の縦並び | 新規 |
| `FormControl` | ラベル付き入力欄 | 新規 |
| `TextField` | 名前入力 | 新規 |
| `Select` | Office 選択 | 新規 |
| `Combobox` | Desk / Area 選択 | 新規 |
| `TimeField` | Expected departure 入力 | 新規 |
| `RadioGroup` | Visit type 選択 | 新規 |
| `ButtonGroup` | Check in / Cancel アクション | 新規 |
| `snackbar` | 成功フィードバック | 新規 |

## データモデル

```typescript
const officeOptions = [
  { label: "Tokyo Office", value: "tokyo" },
  { label: "Osaka Office", value: "osaka" },
  { label: "Fukuoka Office", value: "fukuoka" },
];

const deskOptions = [
  { label: "5F Focus Area", value: "5f-focus-area" },
  { label: "5F Window Seats", value: "5f-window-seats" },
  { label: "6F Meeting Lounge", value: "6f-meeting-lounge" },
  { label: "6F Quiet Area", value: "6f-quiet-area" },
];
```

## API コントラクトヒント

⚠️ 以下は UI から推測した API コントラクトです。実際の API 設計時に検証してください。

| エンドポイント（推測） | メソッド | リクエスト/レスポンス概要 |
|----------------------|---------|------------------------|
| `/api/check-ins` | `POST` | 名前、office、deskArea、expectedDeparture、visitType を送信して当日チェックインを登録 |
| `/api/offices` | `GET` | オフィス選択肢一覧を返す |
| `/api/desks` | `GET` | オフィスに紐づく座席・エリア候補を返す |

## 実装ガイダンス

### 新規ファイル作成先の提案

| 項目 | パス |
|------|------|
| 画面本体 | `src/pages/sandbox/users/wataryooou/check-in/index.tsx` |
| 画面スタイル | `src/pages/sandbox/users/wataryooou/check-in/index.module.css` |
| ルート定義 | `src/pages/sandbox/users/wataryooou/routes.tsx` |

### 実装ステップ

1. 実データ化する場合はフォーム値を `useState` かフォームライブラリに載せる
2. `Check in` を submit ハンドラに置き換え、API 送信と validation を追加する
3. 下部ナビが正式に必要なら、Aegis 本体の `BottomNavigation` 採用可否を確認する

## 関連ドキュメント

| ドキュメント | パス |
|-------------|------|
| PRD | `auto-generated-prd.md` |
| Story source | `/Users/ryo.watanabe/github/aegis-feature/f3/aegis/packages/react/stories/examples/_pages/CheckInPage.tsx` |

## Change Log

| 日付 | 変更内容 |
|------|---------|
| 2026-04-07 | 初回生成 |
