---
type: feature
name: Case Management
name_ja: 案件管理
parent: legalon
keywords: [case, matter, 案件, 管理, 一覧, 受付, ステータス, アサイン, 担当者]
updated: 2026-02-17
---

# Case Management | 案件管理

## CLM Product Vision

> **あらゆる法務データを知に変え、ビジネスを進化させる唯一のリーガルプラットフォーム**

### このページの目的

- CLMチームの Product Vision と策定背景を共有し、開発における方向性を示すことを目的とする。

### 策定背景

#### 3-1. Product Vision の必要性

- CLMチームが、エージェントその他のチームと共に、LegalOnの中心戦略として、中核的な価値を提供することが必要である。そのために、開発の方向性をチームの各人が認識し、共通の方向性をもって、開発に臨むことが求められる。すなわち、チームで共通のProduct Visionを持つことが必要である。

#### 3-2. Product Vision の内容について

- 現在、多くのリーガルテックや私たち自身LegalOnが開発に力を入れ、戦略の中心に置いているエージェント機能の効果を最大限発揮するために、CLMの構築が必須になる。なぜなら、エージェントは、様々なデータを用いて、法務に代わり様々な業務を遂行することが期待されているが、これの前提に、『情報が利用できる状態』であることが必要不可欠である。これがなければ、エージェントは、脳のないただのロボットに過ぎず、汎用的な生成AIとなんら変わりがない。つまり、CLMはエージェントの脳の役割を担うことになる。
- エージェントの「脳」となるには、法務相談、契約の「発生」から「更新・終了」に至る法務業務における全プロセスを一気通貫で管理し、データが利用しやすい状態で保管されていることが必要となる。つまり、LegalOnがデータを軸とした企業経営における戦略的なインフラとなる必要がある。
- 以上の前提のもと、CLMチームメンバーで議論の結果、CLMの提供価値を体現する Product Vision として、以下の内容を盛り込むこととした。

##### ①データの活用で価値を創出する

- データを管理・蓄積することが目的ではなく、有効に使えるようにする
- 単なるデータの「資産化」ではなく「知に変える」ことまでを目指す

##### ②ユーザー体験を最大に高め、ビジネスを進化させる

- ユーザーの意思決定の質とスピードを最大限に加速させること（ユーザー体験）を実現する
- これにより、ビジネスを次の次元に進化させる

##### ③プラットフォームであり、選ばれ続けるインフラである

- LegalOnは、法務・CLMという領域に特化した「リーガルプラットフォーム」である
- 「唯一の」という表現で、競合が追いついてきても常に一歩先を行くことが必要

### 関連文書

- 検討背景：[CLMチーム　Mission（検討中）](https://www.notion.so/CLM-Mission-2b831669571280cf9bf1c78c6b0b074d?pvs=21)
- 参考資料：[CLMチームキックオフ](https://www.notion.so/CLM-2b531669571280aabf4ad56ecc25f702?pvs=21)
- Workshop&リーダー会議：[CLM Team Vision Workshop](https://www.notion.so/CLM-Team-Vision-Workshop-2ed31669571280bfb46df4f505c8a018?pvs=21)

## Purpose | 目的

法務部門における案件（契約書レビュー依頼等）のライフサイクルを管理する。事業部からの依頼受付から完了までの進捗を可視化し、法務チームの業務効率を向上させる。

## User Stories | ユーザーストーリー

- 法務担当者として、自分にアサインされた案件を一覧で確認し、優先度の高いものから対応したい
- 法務マネージャーとして、チーム全体の案件状況を把握し、負荷の偏りを調整したい
- 事業部担当者として、自分が依頼した案件の進捗をリアルタイムで確認したい
- 法務担当者として、案件の詳細画面から関連文書やタイムラインを確認したい

## Domain Model | ドメインモデル

### エンティティ

| エンティティ | 英語名 | 主要属性 | 説明 |
|-------------|--------|---------|------|
| 案件 | Case | id, title, status, priority, assignee, dueDate, createdAt | 法務業務の管理単位 |
| 案件ステータス | CaseStatus | draft, received, inReview, completed, closed | 案件の進行状態 |
| 案件種別 | CaseType | contractReview, legalConsultation, newContract | 案件の分類 |
| 担当者 | Assignee | id, name, role, department | 案件の担当者 |
| 依頼者 | Requester | id, name, department | 案件の依頼元 |
| 相手方 | Counterparty | id, name, type | 契約の相手企業 |
| タイムライン | Timeline | entries[] | 案件の活動履歴 |

### リレーション

```
Case *--1 CaseStatus: has
Case *--1 CaseType: categorized as
Case *--1 Assignee: assigned to
Case *--1 Requester: requested by
Case *--* Counterparty: involves
Case 1--* Timeline: tracks
Case 1--* Document: contains
```

## Key Screens | 主要画面

| 画面 | パターン | 説明 |
|------|---------|------|
| 案件一覧 | list + sidebar + filter | ステータス別フィルタ、検索、ソート |
| 案件詳細 | detail + pane | 案件情報、タイムライン、関連文書 |
| 案件作成 | form | 案件の新規受付フォーム |
| 案件設定 | settings | 案件種別・ステータスの管理 |

## Terminology | 用語集

| 用語 | 英語 | 定義 | UI ラベル |
|------|------|------|----------|
| 案件 | Case | 法務部門の業務単位 | 案件 |
| 受付 | Reception | 新規案件の受付 | 受付 |
| ステータス | Status | 案件の進行状態 | ステータス |
| 担当者 | Assignee | 案件を担当する法務担当者 | 担当者 |
| 依頼者 | Requester | 案件を依頼した事業部の人 | 依頼者 |
| 相手方 | Counterparty | 契約の相手企業 | 相手方 |
| 期限 | Due Date | 案件の対応期限 | 期限 |
| 優先度 | Priority | 案件の優先度（高・中・低） | 優先度 |

## Business Rules | ビジネスルール

- 案件は必ず 1 人以上の担当者にアサインされる
- ステータスは定義された遷移順序に従う（戻し操作は制限あり）
- 期限超過の案件はハイライト表示される
- 案件のクローズには全関連文書のレビュー完了が必要

## Related Features | 関連機能

| 機能 | コンセプトパス | 関係 |
|------|--------------|------|
| 契約書レビュー | `../contract-review/CONCEPT.md` | 案件に紐づくレビュープロセス |
| 電子署名 | `../esign/CONCEPT.md` | レビュー完了後の署名フロー |
| LegalOn Assistant | `../loa/CONCEPT.md` | 案件に関する AI 質問応答 |
