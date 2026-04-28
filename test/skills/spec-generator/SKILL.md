---
name: spec-generator
description: "既存のプロトタイプコードを分析し、SPEC.md（簡易 minispec）を自動生成。プロトタイプのドキュメント化や仕様確認時に使用。NOT WHEN: SPEC.md からコードを生成する場合（→ prototype-generator）、PRD の作成（→ prd-generator）。引数としてページパスを指定（例: /spec-generator sandbox/case-detail）。"
disable-model-invocation: true
---

# SPEC ジェネレーター

既存の Sandbox プロトタイプコードを分析し、minispec 形式の SPEC.md ファイルを生成する。

## 使用方法

```bash
/spec-generator sandbox/case-detail
/spec-generator src/pages/sandbox/my-feature
```

引数なしの場合は対話的に確認する。

---

## 実行手順

### Step 1: 対象ファイルの特定

引数 `$ARGUMENTS` からパスを取得:

- `sandbox/xxx` → `src/pages/sandbox/xxx/`
- 完全パスの場合はそのまま使用
- 引数なしの場合はユーザーに確認

### Step 2: コード分析

以下のファイルを読み込んで分析:

| ファイル | 抽出内容 |
|---------|---------|
| `index.tsx` | レイアウト構造、useState、イベントハンドラ |
| `Container.tsx` | 状態管理、ロジック |
| `types.ts` | データ構造（interface/type） |
| `constants.ts` | 初期値、オプション定義 |
| `components/*.tsx` | サブコンポーネント |

### Step 3: 情報抽出

#### 3.1 目的（Purpose）
- コンポーネント名から機能を推測
- JSDoc コメントがあれば参照
- 使用コンポーネントから用途を推測

#### 3.2 ユースケース
- イベントハンドラ（onClick, onChange, onSubmit）から推測
- 状態変更パターンから推測
- ナビゲーション処理から推測

#### 3.3 画面構成
下記のパターン判定表とコンポーネント用途表を使用。

### Step 4: SPEC.md 生成

以下のテンプレートに沿って生成:

```markdown
# {機能名}

## 目的（Purpose）

{分析結果から1-3文で記述}

## ユースケース（Use Cases）

- {ユーザーが何をして何を達成するか}
- ...

## 画面構成（Screen Composition）

### レイアウト（Layout）

- **パターン**: {判定したパターン名}
- **構成要素**:
  - Sidebar: {あり/なし + 説明}
  - Header: {説明}
  - Main: {説明}
  - Pane: {あり/なし + 位置 + 説明}
  - Footer: {あり/なし + 説明}

### 主要コンポーネント（Key Components）

| エリア | コンポーネント | 用途 |
|--------|---------------|------|
| {area} | {ComponentName} | {purpose} |

### データ構造（Data Structure）

\`\`\`typescript
{抽出した interface/type 定義}
\`\`\`

### 状態管理（State）

| 状態名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| {name} | {type} | {initial} | {purpose} |

### インタラクション（Interactions）

- {アクション}: {結果}
- ...
```

### Step 5: ファイル出力

生成した SPEC.md を対象ディレクトリに保存:

```
src/pages/sandbox/{page-name}/SPEC.md
```

---

## パターン判定表

PageLayout の構造から以下のパターンを判定:

| 検出パターン | 判定結果 |
|-------------|---------|
| `Sidebar` + `Main` | パターン1: 一覧画面 |
| `Sidebar` + `Main` + `Pane(end)` | パターン1.1: 一覧＋詳細 |
| `Header` + `Main` + `Pane(end)` | パターン2: 詳細・編集画面 |
| `Sidebar` + `Pane(start)` + `Main` | パターン3: 設定画面 |
| Chat 関連 + `Pane` | パターン4: Chat UI |
| `Dialog` | パターン5: ダイアログ |

詳細は `/page-layout-assistant` を参照。

---

## コンポーネント用途表

| コンポーネント | 推測用途 |
|---------------|---------|
| Table, DataTable | データ一覧表示 |
| Form, FormControl | フォーム入力 |
| Dialog, Drawer | モーダル/パネル |
| Tabs | タブ切り替え |
| Card | コンテンツグループ |
| Button, IconButton | アクション |
| Select, TextField | 入力フィールド |
| Avatar | ユーザー表示 |
| StatusLabel, Badge | ステータス表示 |
| Timeline | 時系列表示 |

---

## 抽出パターン

### useState の抽出

```tsx
const [paneOpen, setPaneOpen] = useState(true);
// → 状態名: paneOpen, 型: boolean, 初期値: true
```

### イベントハンドラの抽出

```tsx
const handleSubmit = () => { ... }
onClick={() => setOpen(true)}
// → インタラクション: Submit ボタンクリック → フォーム送信
```

### import からのコンポーネント抽出

```tsx
import { Button, Card, Table } from "@legalforce/aegis-react";
// → 主要コンポーネント: Button, Card, Table
```

---

## 注意事項

- sandbox コードは実験用のため、生成した仕様は確認を求める
- 推測が難しい場合は `{要確認}` マーカーを付ける
- 生成後、ユーザーにレビューを依頼する

---

## 関連スキル

- `/page-layout-assistant` - レイアウトパターンの判定基準
- `/component-tips` - コンポーネントの用途確認
- `/prototype-generator` - SPEC.md からプロトタイプを生成
- `/prd-generator` - PRD.md を対話的に生成
