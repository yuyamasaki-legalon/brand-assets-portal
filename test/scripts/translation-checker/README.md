# Translation Checker

Sandbox ページの `translations.ts` ファイルをチェックし、英語翻訳の品質を検証するツールです。

## 概要

ネイティブチェック管理表から抽出したルールに基づき、以下を実現します：

1. 日本語プロトタイプから英語プロトタイプへの変換時の品質チェック
2. 既存の英語翻訳に対する類似指摘の自動検出・修正提案
3. 翻訳品質のガードレール構築

## 使い方

### チェックのみ

```bash
pnpm lint:translation
```

### 自動修正を適用

```bash
pnpm lint:translation:fix
```

### 特定のファイルパターンを指定

```bash
pnpm lint:translation "src/pages/sandbox/specific-page/**/translations.ts"
```

### 特定のルールのみチェック

```bash
pnpm lint:translation --rules TERM-001,TERM-002
```

### 詳細出力

```bash
pnpm lint:translation --verbose
```

### 用語ルールを再生成

```bash
pnpm translation:generate
```

CSV 辞書データベース（`docs/translation-dictionary-database/`）から `terminology.json` を再生成します。

## オプション

| オプション | 説明 |
|------------|------|
| `--fix` | 自動修正を適用（用語置換のみ） |
| `--rules <ids>` | チェックするルールを指定（カンマ区切り） |
| `--verbose`, `-v` | 詳細な出力（ja-JP と en-US の両方を表示） |
| `--help`, `-h` | ヘルプを表示 |

## 出力例

```
src/pages/sandbox/matter/translations.ts:24 [workspaceLabel]
  error  TERM-001  "スペース" should be translated as "Spaces", not "Folders" [auto-fixable]
           検出: "Folders" → "Spaces"
```

## 用語ルール一覧

| ID | 日本語 | 誤訳 | 正訳 | Severity | Auto-fix |
|----|--------|------|------|----------|----------|
| TERM-001 | スペース | Folders | Spaces | error | Yes |
| TERM-002 | 案件受付メールアドレス | Case/Matter reception email | Matter intake email | error | Yes |
| TERM-003 | 案件受付フォーム | Case/Matter reception form | Matter intake form | error | Yes |
| TERM-004 | 案件を追加 | Add Matters | Add Matter | warning | Yes |
| TERM-005 | 似ている案件 | Matters that are similar | Similar matters | warning | Yes |
| TERM-006 | 案件受付スペース | Matters Reception Folders | Matters Intake Spaces | error | Yes |
| TERM-007 | 始端 | end of the creation date | beginning | error | No |
| TERM-008 | 案件名 | Matter name | Matter | info | No |
| TERM-009 | 依頼した案件 | Matter requested | Requested matter | warning | Yes |
| TERM-010 | ファイル詳細画面 | file details screen | Files detail screen | warning | Yes |
| TERM-011 | 削除してもよろしいですか | Are you sure you want to delete this? | Delete? | info | No |
| TERM-012 | 添付ファイル | attachment (e.g. email) | Attachment | warning | Yes |
| TERM-013 | メンション | Send a mentions | Send mentions | error | Yes |
| TERM-014 | 以下にしてください | should be less than | should be no more than | warning | No |
| TERM-015 | 権限がないため | You do not have the authorization | You do not have the permission | warning | Yes |

## 新しいルールの追加方法

### 方法 1: CSV から自動生成（推奨）

1. `docs/translation-dictionary-database/terms.csv` または `phrases.csv` を編集
2. `pnpm translation:generate` を実行して `terminology.json` を再生成
3. 変更を確認して必要に応じてテストを追加

### 方法 2: JSON を直接編集

1. `glossary/terminology.json` を編集
2. 新しいルールを追加:

```json
{
  "id": "TERM-XXX",
  "ja": "日本語キーワード",
  "incorrect": ["誤った英訳1", "誤った英訳2"],
  "correct": "正しい英訳",
  "context": "ルールの説明（任意）",
  "severity": "error" | "warning" | "info",
  "autoFix": true | false
}
```

3. テストを追加（`validators/terminology.test.ts`）
4. `pnpm test scripts/translation-checker` でテストを実行

## ディレクトリ構造

```
scripts/translation-checker/
├── docs/
│   └── translation-dictionary-database/
│       ├── terms.csv       # 用語辞書（CSV）
│       └── phrases.csv     # フレーズ辞書（CSV）
├── glossary/
│   └── terminology.json    # 用語統一ルール（自動生成）
├── tools/
│   └── generate-terminology.ts  # terminology.json 生成ツール
├── validators/
│   ├── terminology.ts      # 用語チェッカー
│   └── terminology.test.ts # テスト
├── types.ts                # 型定義
├── parser.ts               # translations.ts パーサー
├── parser.test.ts          # パーサーテスト
├── index.ts                # CLI エントリポイント
└── README.md               # このファイル
```

## Severity レベル

- `error`: 必ず修正が必要（exit code 1）
- `warning`: 修正を推奨（exit code 0）
- `info`: 情報提供のみ（exit code 0）

## 自動修正について

`--fix` オプションを使用すると、`autoFix: true` のルールのみ自動修正されます。

以下は自動修正されません：
- `autoFix: false` のルール（文脈依存の翻訳など）
- 複数の候補がある場合
- 文法構造の変更が必要な場合

## テスト

```bash
pnpm test scripts/translation-checker
```
