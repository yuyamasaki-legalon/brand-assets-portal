---
name: capture-anti-pattern
description: "β版: Aegis コンポーネントの誤用パターンを docs/rules/component/ にカタログ形式で記録。WHEN: コードレビューやバグ修正中に Aegis の誤った使い方（非推奨 Props、レイアウト違反、アクセシビリティ問題等）を発見したとき。NOT WHEN: 一般的なコード品質の問題や Aegis 無関係のアンチパターン。"
---

<!-- β版: ID 体系やファイル形式は今後変更される可能性があります -->

# アンチパターン記録スキル

コードレビューや開発中に発見した新しい Aegis アンチパターンを、カタログ形式でファイルに記録する。

---

## 使用方法

```
/capture-anti-pattern                           # 対話形式で記録
/capture-anti-pattern Button inline-padding     # コンポーネントと概要を指定
```

---

## 実行手順

### Step 1: 情報の収集

以下の情報を収集する（引数で一部指定されている場合はスキップ）:

1. **コンポーネント名**: どのコンポーネントに関するアンチパターンか（例: Button, Dialog, General）
2. **カテゴリ**: `composition` / `styling` / `accessibility` / `usage` のいずれか
3. **重大度**: `error` / `warning` / `info` のいずれか
4. **Bad コード例**: やってはいけないコード
5. **Good コード例**: 正しいコード
6. **理由（Why）**: なぜこのパターンがアンチパターンなのか
7. **関連する ESLint ルール**（あれば）
8. **関連する WCAG 基準**（あれば）

### Step 2: ID の生成

既存の `docs/anti-patterns/index.json` を読み、同一コンポーネントの最大 ID を取得し、次の番号を割り当てる。

ID フォーマット: `AP-{COMPONENT}-{NUMBER}`
例: `AP-BUTTON-007`, `AP-DIALOG-005`

### Step 3: ファイルの生成

`docs/anti-patterns/AP-{COMPONENT}-{NUMBER}.md` を以下の形式で生成する:

```markdown
---
id: AP-{COMPONENT}-{NUMBER}
component: {ComponentName}
category: {category}
severity: {severity}
eslint_rule: {rule}  # あれば
wcag: "{wcag}"       # あれば
---
# {タイトル}

## Bad

\`\`\`tsx
{Bad コード例}
\`\`\`

## Good

\`\`\`tsx
{Good コード例}
\`\`\`

## Why

{理由}
```

### Step 4: インデックスの再生成

`pnpm docs:generate-ap-index` を実行して `index.json` を更新する。

### Step 5: 確認

生成したファイルの内容をユーザーに表示し、修正が必要かどうか確認する。

---

## 参照ドキュメント

| ドキュメント | 内容 |
|---|---|
| `docs/anti-patterns/index.json` | 既存カタログインデックス |
| `docs/anti-patterns/*.md` | 既存アンチパターン（フォーマット参照） |
| `scripts/generate-anti-pattern-index.ts` | インデックス生成スクリプト |

---

## 関連スキル

- `/aegis-review` - Aegis デザインシステム準拠レビュー
- `/a11y-audit` - アクセシビリティ監査
- `/component-tips` - コンポーネントの使い方確認
