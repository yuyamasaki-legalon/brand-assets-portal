---
name: a11y-audit
description: アクセシビリティ監査。WCAG 2.1 AA 準拠チェック（カラーコントラスト、キーボード操作、スクリーンリーダー対応、フォーム、見出し階層など）と Aegis コンポーネント固有のルールを検証。コードレビュー時やアクセシビリティ品質チェック時に使用。
disable-model-invocation: true
---

# アクセシビリティ監査（WCAG 2.1 AA）

React + TypeScript コードを静的に解析し、WCAG 2.1 AA 準拠と Aegis コンポーネント固有のアクセシビリティルールを検証する。

---

## 使用方法

```
/a11y-audit                                    # git diff 対象を監査
/a11y-audit path/to/file.tsx                   # 特定ファイル
/a11y-audit src/pages/sandbox/users/foo/bar/   # ディレクトリ
```

---

## 実行手順

### Step 1: 対象ファイルの特定

引数 `$ARGUMENTS` からファイルパスを取得する。

- **引数がある場合**: そのパスを使用（ファイルまたはディレクトリ内の `.tsx` ファイル）
- **引数がない場合**: `git diff --name-only` で変更された `.tsx` ファイルを対象

対象が存在しない場合はエラーメッセージを表示して終了する。

### Step 2: コードの読み込みと解析

対象ファイルを読み込み、以下の要素を抽出する:

- JSX 構造（要素の入れ子関係を含む）
- 使用されている Aegis コンポーネント
- ARIA 属性（`aria-label`, `aria-labelledby`, `aria-describedby`, `aria-live`, `aria-hidden`, `role` 等）
- イベントハンドラ（`onClick`, `onKeyDown`, `onKeyUp` 等）
- `alt` 属性、`htmlFor` 属性
- インラインスタイル（`style` prop 内の色指定）
- 見出し要素（`h1`〜`h6`, `Title` コンポーネント）

### Step 3: 7 カテゴリ別の検証

以下の 7 カテゴリでチェックを行う。各カテゴリの詳細ルールは参照ドキュメントを確認すること。

#### 3-1. Aegis コンポーネント固有チェック

**参照**: `skills/a11y-audit/references/aegis-a11y-rules.md`

主なチェック項目:

| コンポーネント | チェック内容 | 重大度 |
|---|---|---|
| `IconButton` | `aria-label` 必須 / `Tooltip` ラップ推奨 | Error / Warning |
| `Dialog` | `DialogHeader` + `ContentHeader.Title` 必須 | Error |
| `Drawer` | `Drawer.Header` 必須 / 閉じるボタン二重実装禁止 | Error |
| `Table` | `Table.Head` 必須 / `CheckboxCell` に `aria-labelledby` | Error / Warning |
| `FormControl` | `FormControl.Label` 必須 / 外部使用時 `aria-label` | Error |
| `EmptyState` | `title` prop 推奨 | Warning |
| `Banner` | 適切な `color` prop 使用 | Info |
| `Tooltip` | `IconButton` ラップ / テキスト省略対応 | Warning |
| `Link` | `href` なし時 `role="button"` 推奨 | Warning |

#### 3-2. スクリーンリーダー対応

- `<img>` に `alt` 属性があるか
- 装飾的画像に `alt=""` または `aria-hidden="true"` が設定されているか
- `role` 属性が適切に使用されているか（`role="presentation"`, `role="button"` 等）
- 動的コンテンツに `aria-live` が設定されているか
- `aria-hidden="true"` が操作可能な要素に誤って設定されていないか

#### 3-3. キーボードアクセシビリティ

- `<div>` / `<span>` に `onClick` がある場合、`role="button"` + `tabIndex={0}` + `onKeyDown` があるか
- `tabIndex` の値が `0` より大きくないか（正の `tabIndex` は非推奨）
- インタラクティブ要素（ボタン、リンク、入力）が適切な HTML 要素を使用しているか
- `onMouseDown` / `onMouseOver` のみでキーボード対応がないパターン

#### 3-4. フォームアクセシビリティ

- `<TextField>`, `<Select>`, `<Textarea>` 等が `FormControl` + `FormControl.Label` 内にあるか
- `FormControl` 外で使用する場合、`aria-label` または `aria-labelledby` があるか
- `FormControl` に `error` prop がある場合、エラーキャプション（`FormControl.Caption`）が存在するか
- `required` の表示が適切か（`*` のみは不可、Aegis の `required` prop を使用）

#### 3-5. 画像アクセシビリティ

- `<img>` に `alt` 属性が存在するか
- `alt` テキストが意味のある内容か（`"image"`, `"photo"`, `"picture"` 等の汎用テキストは不適切）
- SVG アイコンに適切なラベルがあるか（`aria-label` または `aria-hidden`）

#### 3-6. 見出し階層

- 見出しレベルの飛ばし（例: `h1` → `h3`）がないか
- ページ内に `h1` が存在するか（または `ContentHeader.Title` 等で代替されているか）
- 空の見出し要素がないか

#### 3-7. カラーコントラスト

- インラインスタイルで色を直接指定していないか（Aegis デザイントークンの使用を推奨）
- 色のみで情報を伝えているパターンがないか（アイコンやテキストの併用を推奨）
- `color` prop が未指定のまま Banner 等を使用していないか

### Step 4: 重大度の判定

各指摘に以下の重大度を付与する:

| 重大度 | 基準 | 例 |
|---|---|---|
| **Error** | WCAG 2.1 AA 必須違反。支援技術で利用不可になる | `IconButton` に `aria-label` なし |
| **Warning** | 強く推奨。違反するとユーザー体験が大きく低下する | `IconButton` に `Tooltip` なし |
| **Info** | ベストプラクティス。改善するとより良いアクセシビリティ | Aegis デザイントークンの使用推奨 |

### Step 5: レポート出力

以下の形式でレポートを出力する:

```markdown
## アクセシビリティ監査結果

### サマリー

| 項目 | 値 |
|---|---|
| 対象ファイル数 | N |
| Error | N 件 |
| Warning | N 件 |
| Info | N 件 |

### 指摘事項

#### Error

1. **ファイル**: `src/pages/sandbox/users/foo/bar/Presentation.tsx:42`
   - カテゴリ: Aegis コンポーネント
   - 現状: `<IconButton>` に `aria-label` が未設定
   - 推奨: `<IconButton aria-label="削除">` を追加
   - WCAG: [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)

2. **ファイル**: `src/pages/sandbox/users/foo/bar/Presentation.tsx:58`
   - カテゴリ: キーボードアクセシビリティ
   - 現状: `<div onClick={handleClick}>` にキーボード対応なし
   - 推奨: `<button>` に変更するか、`role="button" tabIndex={0} onKeyDown={handleKeyDown}` を追加
   - WCAG: [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)

#### Warning

1. **ファイル**: `src/pages/sandbox/users/foo/bar/Presentation.tsx:30`
   - カテゴリ: Aegis コンポーネント
   - 現状: `<IconButton>` が `<Tooltip>` でラップされていない
   - 推奨: `<Tooltip title="削除"><IconButton ...>` でラップ
   - 参照: `docs/rules/component/Tooltip.md`

#### Info

（問題がない場合は「指摘事項なし」と表示）

### 参考リンク

- [WCAG 2.1 クイックリファレンス](https://www.w3.org/WAI/WCAG21/quickref/?levels=aaa)
- [Aegis アクセシビリティ方針](docs/rules/ui/07_accessibility.md)
```

---

## 判定上の注意点

- **Aegis コンポーネント内部のアクセシビリティは信頼する**: Aegis が内部的に提供する a11y 機能（Dialog の `aria-modal`, Drawer の閉じるボタン等）は正しく実装されている前提で検証する
- **コンテキストを考慮する**: 例えば `TextField` が `FormControl` の中にあるかどうかは、同一ファイル内の JSX 構造から判断する
- **偽陽性を避ける**: 判断に自信がない場合は Info レベルで報告するか、「確認を推奨」と注記する
- **sandbox コードは参照しない**: `src/pages/sandbox/` のコードは実験的なプロトタイプであり、ルールの参照元としては使用しない

---

## 参照ドキュメント

| ドキュメント | 内容 |
|---|---|
| `skills/a11y-audit/references/wcag-checklist.md` | WCAG 2.1 AA 静的解析チェックリスト |
| `skills/a11y-audit/references/aegis-a11y-rules.md` | Aegis コンポーネント固有 a11y ルール |
| `docs/rules/ui/07_accessibility.md` | アクセシビリティ基本方針 |
| `docs/rules/component/{ComponentName}.md` | コンポーネント別ガイドライン |

---

## 関連スキル

- `/writing-review` - UI テキストのライティングレビュー
- `/component-tips` - Aegis コンポーネントの使い方
- `/design-token-resolver` - デザイントークンの検索
