---
name: spec-review
description: "SPEC.md / auto-generated-prd.md の品質レビュー。完全性・明確性・一貫性・状態網羅・Aegis整合・用語整合の6カテゴリ19観点で検証し、品質スコア（A/B/C/D）と指摘事項（Error/Warning/Info）を出力。仕様レビュー時やプロトタイプ実装前の品質チェックに使用。"
disable-model-invocation: true
---

# 仕様ドキュメントレビュー

SPEC.md / auto-generated-prd.md を **6カテゴリ19観点** で検証し、品質スコアと指摘事項を出力する。

## 使用方法

```
/spec-review                                          # カレントディレクトリの SPEC.md or auto-generated-prd.md
/spec-review src/pages/sandbox/loc/xxx/case-detail     # パス指定
/spec-review src/pages/sandbox/xxx/auto-generated-prd.md  # ファイル直接指定
```

---

## 実行手順

### Step 1: 対象ファイルの特定

引数 `$ARGUMENTS` からパスを取得:

- **ファイル指定**: そのファイルを使用
- **ディレクトリ指定**: `SPEC.md` → `auto-generated-prd.md` の優先順で検索
- **引数なし**: カレントディレクトリで上記を検索

対象が見つからない場合はエラーメッセージを表示して終了。

### Step 2: コンテキストの収集

#### 2.1 仕様ドキュメントの読み込み

対象ファイルを読み込み、以下のセクションの有無と内容を確認:

| セクション | SPEC.md | auto-generated-prd.md |
|-----------|---------|----------------------|
| 目的 | Purpose | Snapshot |
| ユースケース | Use Cases | Confirmed/Inferred Requirements |
| 画面構成 | Screen Composition | UI Mapping |
| データ構造 | Data Structure | ― |
| 状態管理 | State | ― |
| インタラクション | Interactions | ― |
| 未解決事項 | ― | Open Questions |

#### 2.2 関連コンテキストの読み込み

- **CONCEPT.md**: パスからサービスを検出し、該当する CONCEPT.md を読み込む（`.claude/rules/concept-hierarchy.md` の手順に従う）
- **Aegis コンポーネント**: Key Components に記載されたコンポーネントを `mcp__aegis__get_component_detail` で検証

### Step 3: 6カテゴリ別の検証

**Step 3 開始前に `skills/spec-review/references/check-items.md` を必ず読み込むこと。** サマリーテーブルだけでは判定に必要な除外条件・詳細ロジックが不足する。

#### 3.1 完全性（5観点）

| # | 観点 | 重大度 | 概要 |
|---|------|--------|------|
| C1 | 必須セクション欠落 | Error | SPEC.md の必須セクションが欠けている |
| C2 | TBD/TODO 残留 | Warning | `{TBD}`, `{TODO}`, `{要実装}`, `{要確認}` が残っている |
| C3 | データ構造未定義 | Error | Key Components にデータ系コンポーネントがあるが型定義がない |
| C4 | 状態網羅不足 | Warning | Key Components の操作に必要な State が定義されていない |
| C5 | ユースケース不足 | Warning | Interactions に対応する Use Case がない |

#### 3.2 明確性（3観点）

| # | 観点 | 重大度 | 概要 |
|---|------|--------|------|
| A1 | 曖昧表現 | Warning | 「適切に」「必要に応じて」「など」等の曖昧ワード |
| A2 | 主語不明 | Warning | アクションの主体（ユーザー/システム）が不明確 |
| A3 | 型の曖昧さ | Warning | Data Structure で `string` が具体的な値セットを表すべき場合 |

#### 3.3 一貫性（3観点）

| # | 観点 | 重大度 | 概要 |
|---|------|--------|------|
| I1 | コンポーネント不一致 | Error | Key Components と Interactions で異なるコンポーネント名 |
| I2 | 状態とインタラクションの矛盾 | Error | Interactions で参照する State が State セクションに未定義 |
| I3 | SPEC/PRD間の矛盾 | Warning | 同ディレクトリの SPEC.md と auto-generated-prd.md の間で矛盾 |

#### 3.4 状態網羅（3観点）

| # | 観点 | 重大度 | 概要 |
|---|------|--------|------|
| S1 | 非正常系欠落 | Warning | Loading/Error/Empty 状態の記載がない |
| S2 | バリデーション未定義 | Warning | フォーム入力があるがバリデーションルールがない |
| S3 | フィードバック未定義 | Info | 操作後のユーザーフィードバック（Snackbar等）が未定義 |

#### 3.5 Aegis整合（3観点）

| # | 観点 | 重大度 | 概要 |
|---|------|--------|------|
| G1 | 存在しないコンポーネント | Error | Aegis に存在しないコンポーネント名の使用 |
| G2 | 選択妥当性 | Warning | 用途に対してより適切な Aegis コンポーネントがある |
| G3 | レイアウトパターン不一致 | Warning | Layout パターンが template のパターンと不整合 |

#### 3.6 用語整合（2観点）

| # | 観点 | 重大度 | 概要 |
|---|------|--------|------|
| T1 | CONCEPT.md 用語不統一 | Warning | CONCEPT.md の Terminology と異なる用語の使用 |
| T2 | エンティティ名乖離 | Info | Data Structure の型名が CONCEPT.md の Entity と乖離 |

### Step 4: 品質スコアの算出

| スコア | 基準 |
|--------|------|
| **A** | Error: 0, Warning: 0-2 |
| **B** | Error: 0, Warning: 3+ |
| **C** | Error: 1-3 |
| **D** | Error: 4+ |

### Step 5: レポート出力

```markdown
## 仕様ドキュメントレビュー結果

### 品質スコア: {A/B/C/D}

| カテゴリ | Error | Warning | Info |
|---------|-------|---------|------|
| 完全性 | N | N | N |
| 明確性 | N | N | N |
| 一貫性 | N | N | N |
| 状態網羅 | N | N | N |
| Aegis整合 | N | N | N |
| 用語整合 | N | N | N |
| **合計** | **N** | **N** | **N** |

### 指摘事項

#### Error

1. **[C1] 必須セクション欠落**
   - 箇所: Data Structure セクション
   - 内容: Table/DataTable を使用しているがデータ型が未定義
   - 推奨: interface 定義を追加

#### Warning

1. **[A1] 曖昧表現**
   - 箇所: Interactions 3行目
   - 内容: 「適切にバリデーションを行う」
   - 推奨: 具体的なバリデーションルールを記載

#### Info
（なければ「指摘事項なし」）

### 改善の優先順位

1. {最も影響の大きい Error の修正}
2. {次に重要な指摘}
3. ...
```

---

## 判定上の注意点

- **SPEC.md と auto-generated-prd.md でセクション構造が異なる**: セクション対応表（Step 2.1）に基づいて適切にマッピングする
- **auto-generated-prd.md の Inferred Requirements**: confidence が低い項目は曖昧とは判定しない（推測であることが明示されているため）
- **{要実装} マーカー**: プロトタイプ段階では許容。ただし数が多い場合は C2 として Warning 報告
- **偽陽性を避ける**: 判断に自信がない場合は Info レベルで報告する
- **CONCEPT.md が存在しない場合**: 用語整合（T1, T2）はスキップし、その旨を報告

---

## 参照ドキュメント

| ドキュメント | 内容 |
|---|---|
| `skills/spec-review/references/check-items.md` | 19観点の詳細判定基準 |
| `skills/spec-generator/SKILL.md` | SPEC.md の正規フォーマット |
| `skills/generated-prd-capture/SKILL.md` | auto-generated-prd.md の正規フォーマット |
| `skills/states-feedback/SKILL.md` | 状態パターン（S1/S2/S3 の検証基準） |
| `.claude/rules/concept-hierarchy.md` | CONCEPT.md 読み込み手順 |

---

## 関連スキル

- `/qa-checklist` - レビュー後のテスト計画生成（本スキルと組み合わせて使用）
- `/spec-generator` - 既存コードからの SPEC.md 生成
- `/generated-prd-capture` - auto-generated-prd.md の自動生成・更新
- `/aegis-review` - 実装コードの Aegis 準拠レビュー
- `/states-feedback` - 状態表示・フィードバックパターン
