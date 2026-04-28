---
name: prd-generator
description: "PRD.md（Product Requirements Document）を対話的に生成。WHEN: ユーザーが要件定義書の作成を依頼したとき、/prd-generator を実行したとき。NOT WHEN: sandbox 会話中の自動 PRD（→ generated-prd-capture）、仕様書の作成（→ spec-generator）。"
disable-model-invocation: true
---

# PRD ジェネレーター

PRD（Product Requirements Document）を対話的なセッションで生成する。

## 使用方法

```bash
/prd-generator
/prd-generator --resume docs/prd/my-feature/PRD.md
```

引数なしの場合は新規作成、`--resume` で既存ファイルから再開。

---

## 実行手順

### Step 1: 初期設定

1. プロダクト/機能名を確認
2. 保存先パスを決定（デフォルト: カレントディレクトリの PRD.md）
3. 既存ファイルがあれば再開確認
4. コンセプト読み込み: サービスが特定できる場合、`src/pages/template/{service}/CONCEPT.md` を読み込み、用語集・エンティティ・ワークフローを把握する
   - 該当する機能コンセプト `src/pages/template/{service}/{feature}/CONCEPT.md` があればそれも読み込む
   - コンセプトの情報を質問のヒントや用語の定義に活用する

**質問例:**

```
PRD を作成します。まず基本情報を教えてください。

Q1: プロダクト/機能の名前は何ですか？
    例: 「契約書レビュー機能」「ダッシュボード改善」

Q2: PRD の保存先パスを指定してください
    例: docs/prd/feature-name/PRD.md
    （Enter でデフォルト: ./PRD.md）
```

### Step 2: セクション別質問

以下の順序で各セクションの質問を行う:

| # | セクション | サブセクション数 |
|---|-----------|-----------------|
| 1 | Introduction | 3 |
| 2 | Requirements | 3 |
| 3 | Go to Market | 2 |
| 4 | Why we build this? | 3 |
| 5 | Related information | 5 |

各質問で:
- **Enter のみ**: スキップ（`{TBD}` マーカーを残す）
- **"skip"**: セクション全体をスキップ
- **"done"**: 質問を終了して生成に進む

### Step 3: 中間保存

各セクション完了後に自動保存（DRAFT ステータス付き）。

### Step 4: PRD.md 生成

全質問完了後、または "done" 入力時に PRD.md を生成。

### Step 5: 確認とレビュー依頼

生成完了後、ユーザーにレビューを依頼し、必要に応じて修正。

---

## セクション別質問ガイド

### 1. Introduction | 導入

| サブセクション | 質問 | ヒント |
|--------------|------|-------|
| Goal | この機能で達成したいゴールは何ですか？ | 「契約書レビュー時間を50%削減」「ユーザー満足度向上」 |
| Why we're building this? | なぜ今これを作る必要がありますか？背景や課題は？ | 「現状の課題」「ユーザーからのフィードバック」 |
| Target release | リリース目標時期はいつですか？ | 「2025年Q2」「2025年4月末」 |

### 2. Requirements | 要求事項

| サブセクション | 質問 | ヒント |
|--------------|------|-------|
| Wireframe / Design links | デザインファイルのリンクはありますか？ | Figma URL、Miro ボードなど |
| Usecase | 主なユースケースを教えてください（複数可）。 | 「ユーザーが○○をすると、××になる」形式で |
| Requirement lists | 具体的な要求事項を箇条書きで教えてください。 | 「〜できること」「〜を表示すること」 |

### 3. Go to Market | 市場進出

| サブセクション | 質問 | ヒント |
|--------------|------|-------|
| Press release | プレスリリースを出す予定はありますか？ | Yes/No + 理由 |
| Productization | 製品化の計画は？有償/無償？ | 「フリープランに含む」「有償オプション」 |

### 4. Why we build this? | なぜ我々がやるのか？

| サブセクション | 質問 | ヒント |
|--------------|------|-------|
| Target customers | 主なターゲットユーザーは誰ですか？ | 「法務担当者」「中小企業の経営者」 |
| Market analysis | 市場の状況を教えてください。成長性や規模は？ | 数値があれば記載 |
| Competitor analysis | 競合はいますか？差別化ポイントは？ | 競合サービス名、強み/弱み |

### 5. Related information | 関連情報

| サブセクション | 質問 | ヒント |
|--------------|------|-------|
| Product principles | この機能で守るべき製品原則は？ | 「シンプルさ優先」「既存 UX との一貫性」 |
| Definition of terms | 用語の定義があれば教えてください。 | 専門用語、略語の説明 |
| Constraints | 技術的・ビジネス的な制約はありますか？ | 「既存 API を使用」「予算○○万円以内」 |
| Check points | 確認が必要な事項はありますか？ | 「法務確認」「セキュリティレビュー」 |
| Stakeholders | 関係者は誰ですか？ | 「PM: 〇〇」「開発リード: △△」 |

---

## スキップとデフォルト値

スキップされたセクションには `{TBD}` マーカーを挿入:

```markdown
### Goal | ゴール
{TBD: 目標を記入してください}
```

後から手動で編集可能。

---

## 途中保存/再開

### 保存形式

PRD.md 先頭にステータスコメントを挿入:

```markdown
<!-- PRD_STATUS: draft -->
<!-- LAST_SECTION: requirements -->
<!-- UPDATED: 2025-01-15T10:30:00 -->
```

### 再開時の動作

```bash
/prd-generator --resume docs/prd/my-feature/PRD.md
```

1. ステータスコメントを解析
2. 完了セクションをスキップ
3. 未完了セクションから再開

---

## PRD テンプレート

生成される PRD.md の形式:

```markdown
# [プロダクト名] - PRD

## Introduction | 導入

### Goal | ゴール
[内容]

### Why we're building this? | なぜつくるのか？
[内容]

### Target release | リリース目標
[内容]

---

## Requirements | 要求事項

### Wireframe / Design links | ワイヤーフレーム
[内容]

### Usecase | ユースケース
[内容]

### Requirement lists | 要求事項一覧
[内容]

---

## Go to Market｜市場進出

### Whether to issue a press release | プレスリリース可否
[内容]

### Productization | 製品化
[内容]

---

## Why we build this? | なぜ我々がやるのか？

### Target customers | ターゲットユーザー
[内容]

### Market analysis | 市場分析
[内容]

### Competitor analysis | 競合分析
[内容]

---

## Related information | 関連情報

### Product principles | 製品原則
[内容]

### Definition of terms | 用語
[内容]

### Constraints | 制約事項
[内容]

### Check points | 確認事項
[内容]

### Stakeholders | ステークホルダー
[内容]

---

_Generated with /prd-generator_
_Last updated: YYYY-MM-DD_
```

---

## 対話例

```
User: /prd-generator
AI: PRD を作成します。まず基本情報を教えてください。

Q1: プロダクト/機能の名前は何ですか？

User: 契約書レビュー機能

AI: Q2: PRD の保存先パスを指定してください

User: (Enter)

AI: デフォルトの ./PRD.md を使用します。

    ## Introduction | 導入 について質問します。

    Q3: この機能で達成したいゴールは何ですか？

User: 契約書レビュー時間を 50% 削減する

AI: Q4: なぜ今これを作る必要がありますか？

User: 法務部門の業務負荷が高く、レビュー待ち案件が増加しているため

AI: Q5: リリース目標時期はいつですか？

User: 2025年Q2

AI: Introduction セクションが完了しました。
    次に Requirements について質問します...

    ...（続く）
```

---

## 注意事項

- 対話中にスキップしたセクションは `{TBD}` マーカーで残す
- 生成後、ユーザーにレビューを依頼する
- PRD は継続的に更新するドキュメントとして扱う

---

## 関連スキル

- `/spec-generator` - 技術仕様（SPEC.md）を生成
- `/prototype-generator` - SPEC.md からプロトタイプを生成

