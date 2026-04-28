---
name: aegis-review
description: "β版: Aegis デザインシステム準拠レビュー。コンポーネント使用の正しさ、デザイントークン、PageLayout 構成、アクセシビリティ、アンチパターンを包括的にチェック。コードレビュー時や品質チェック時に使用。"
disable-model-invocation: true
---

<!-- β版: チェック項目やレポート形式は今後変更される可能性があります -->

# Aegis デザインシステム準拠レビュー

React + TypeScript コードを静的に解析し、Aegis デザインシステムへの準拠度を包括的にレビューする。

---

## 使用方法

```
/aegis-review                                    # git diff 対象をレビュー
/aegis-review path/to/file.tsx                   # 特定ファイル
/aegis-review src/pages/sandbox/my-feature/      # ディレクトリ
```

---

## 実行手順

### Step 1: 対象ファイルの特定

引数 `$ARGUMENTS` からファイルパスを取得する。

- **引数がある場合**: そのパスを使用（ファイルまたはディレクトリ内の `.tsx` / `.ts` / `.css` ファイル）
- **引数がない場合**: `git diff --name-only` で変更されたファイルを対象

対象が存在しない場合はエラーメッセージを表示して終了する。

### Step 2: コードの読み込みと解析

対象ファイルを読み込み、以下の要素を抽出する:

- JSX 構造（要素の入れ子関係を含む）
- 使用されている Aegis コンポーネント
- インラインスタイル（`style` prop 内の値）
- CSS ファイル内のプロパティ値
- import 文（カスタム UI の検出用）
- ARIA 属性（`aria-label`, `aria-labelledby`, `role` 等）
- イベントハンドラ（`onClick`, `onKeyDown` 等）

### Step 3: 5 カテゴリ別の検証

以下の 5 カテゴリでチェックを行う。各カテゴリの詳細は参照ドキュメントを確認すること。

#### 3-1. コンポーネント使用の正しさ

**参照**: `skills/aegis-review/references/component-checks.md`

主なチェック項目:

| チェック | 内容 | 重大度 |
|---|---|---|
| カスタム UI 検出 | `<button>`, `<input>`, `<select>` 等の生 HTML 要素 | Error |
| 生 `<span>` 検出 | `<span>` → `<Text>` | Warning |
| FormControl 必須 | TextField/Select 等が FormControl 外 | Error |
| DialogHeader 必須 | DialogContent に DialogHeader なし | Error |
| IconButton Tooltip | IconButton が Tooltip 外 | Warning |
| IconButton aria-label | IconButton に aria-label なし | Error |
| Banner Icon 二重 | Banner に手動アイコン追加 | Error |
| 複数 Solid Button | ButtonGroup に複数の solid | Warning |

#### 3-2. デザイントークンの使用

**参照**: `.claude/rules/design-tokens.md`

主なチェック項目:

| チェック | 内容 | 重大度 |
|---|---|---|
| 生 px 値 | インラインスタイル / CSS に `16px` 等 | Warning |
| 生カラー値 | `#333`, `rgb()`, `rgba()` の直接使用 | Warning |
| トークン種類の誤用 | spacing に size トークン使用 | Error |
| 廃止トークン | `--spacing-*`, `--color-*` 形式 | Error |
| コンテナ幅 | `--aegis-size-*` を max-width に使用 | Error |

#### 3-3. PageLayout コンポジション

**参照**: `docs/rules/ui/09_layout_composition.md`, `docs/rules/component/PageLayout.md`

3 ステップルール:
1. **PageLayout フレーム**: `<PageLayout>` が最外層か
2. **内部レイアウト**: テンプレートパターン（list-layout, detail-layout 等）に準拠しているか
3. **バリアント/スペーシング**: 適切なトークンで余白が制御されているか

チェック:
- PageLayout なしのページ → Error
- ContentHeader.Title なし → Warning
- 非テンプレートレイアウトパターン → Info

#### 3-4. アクセシビリティ

**参照**: `skills/a11y-audit/references/aegis-a11y-rules.md`, `skills/a11y-audit/references/wcag-checklist.md`

主なチェック項目（a11y-audit のロジックを内包）:

| チェック | 内容 | 重大度 |
|---|---|---|
| IconButton aria-label | aria-label なし | Error |
| FormControl.Label | Label なし | Error |
| Dialog/Drawer Header | Header なし | Error |
| Table.Head | Head なし | Error |
| div onClick | キーボード対応なし | Error |
| img alt | alt 属性なし | Error |
| 見出し階層 | レベルの飛ばし | Warning |
| 正の tabIndex | tabIndex > 0 | Warning |

#### 3-5. アンチパターンカタログとの照合

**参照**: `docs/anti-patterns/index.json`, `docs/anti-patterns/*.md`

カタログに登録されたアンチパターンとの照合:
- eslint_rule が紐づくパターン → ESLint で自動検出
- eslint_rule のないパターン → 手動パターンマッチで検出
- 新しいアンチパターンの発見 → Info レベルで報告

### Step 4: 重大度の判定

各指摘に以下の重大度を付与する:

| 重大度 | 基準 | 例 |
|---|---|---|
| **Error** | Aegis ガイドライン必須違反 / WCAG 2.1 AA 違反 | IconButton に aria-label なし |
| **Warning** | 強く推奨。違反するとデザイン一貫性やUXが低下 | 生 px 値の使用 |
| **Info** | ベストプラクティス。改善するとより良い品質 | トークンの代替候補の提案 |

### Step 5: レポート出力

以下の形式でレポートを出力する:

```markdown
## Aegis デザインシステム準拠レビュー結果

### サマリー

| 項目 | 値 |
|---|---|
| 対象ファイル数 | N |
| Error | N 件 |
| Warning | N 件 |
| Info | N 件 |

### カテゴリ別結果

#### 1. コンポーネント使用
- ✅ 問題なし / ❌ N 件の指摘

#### 2. デザイントークン
- ✅ 問題なし / ❌ N 件の指摘

#### 3. PageLayout コンポジション
- ✅ 問題なし / ❌ N 件の指摘

#### 4. アクセシビリティ
- ✅ 問題なし / ❌ N 件の指摘

#### 5. アンチパターン
- ✅ 問題なし / ❌ N 件の指摘

### 指摘事項

#### Error

1. **ファイル**: `src/pages/sandbox/my-feature/Presentation.tsx:42`
   - カテゴリ: コンポーネント使用
   - ルール: AP-ICONBUTTON-002
   - 現状: `<IconButton>` に `aria-label` が未設定
   - 推奨: `<IconButton aria-label="削除">` を追加

#### Warning

1. **ファイル**: `src/pages/sandbox/my-feature/Presentation.tsx:58`
   - カテゴリ: デザイントークン
   - ルール: AP-TOKEN-001
   - 現状: `style={{ padding: "16px" }}`
   - 推奨: `style={{ padding: "var(--aegis-space-medium)" }}`

#### Info

（問題がない場合は「指摘事項なし」と表示）

### 自動修正可能な項目

以下の項目は ESLint で自動検出されます:
- `pnpm lint:eslint-custom` を実行してください

### 参考リンク

- [Aegis Integration Guide](docs/aegis-integration-guide.md)
- [Anti-pattern Catalog](docs/anti-patterns/)
- [Design Tokens](docs/rules/ui/04_design_tokens.md)
- [Accessibility](docs/rules/ui/07_accessibility.md)
```

---

## 判定上の注意点

- **Aegis コンポーネント内部は信頼する**: Aegis が内部的に提供する機能は正しく実装されている前提で検証する
- **コンテキストを考慮する**: JSX の入れ子構造から FormControl の有無等を判断する
- **偽陽性を避ける**: 判断に自信がない場合は Info レベルで報告するか、「確認を推奨」と注記する
- **sandbox コードは参照しない**: `src/pages/sandbox/` のコードは参照元として使用しない
- **template コードを参照する**: `src/pages/template/` のコードを正しい実装例として参照する

---

## 参照ドキュメント

| ドキュメント | 内容 |
|---|---|
| `skills/aegis-review/references/checklist.md` | レビューチェックリスト |
| `skills/aegis-review/references/component-checks.md` | コンポーネント別チェック詳細 |
| `skills/aegis-review/references/attack-surface.md` | Aegis 固有のリスク領域と優先順位 |
| `docs/anti-patterns/index.json` | アンチパターンカタログインデックス |
| `docs/anti-patterns/*.md` | 個別アンチパターン詳細 |
| `skills/a11y-audit/references/aegis-a11y-rules.md` | Aegis a11y ルール |
| `skills/a11y-audit/references/wcag-checklist.md` | WCAG チェックリスト |
| `.claude/rules/design-tokens.md` | デザイントークンルール |
| `docs/rules/component/{ComponentName}.md` | コンポーネント別ガイドライン |
| `docs/rules/ui/09_layout_composition.md` | レイアウト構成ガイド |

---

## 関連スキル

- `/a11y-audit` - アクセシビリティ専門監査（本スキルに内包）
- `/component-tips` - Aegis コンポーネントの使い方
- `/design-token-resolver` - デザイントークンの検索
- `/writing-review` - UI テキストのライティングレビュー
