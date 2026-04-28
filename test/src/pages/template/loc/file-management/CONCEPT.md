---
type: feature
name: File Management
name_ja: ファイル管理（契約書管理）
parent: legalon
keywords: [契約書, ファイル, 管理, 締結, アップロード, 取引先, 保存先, スペース, バージョン, 検索, フィルター, 一覧, 詳細, 類似契約]
updated: 2026-03-11
---

# File Management | ファイル管理（契約書管理）

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

##### データの活用で価値を創出する

- データを管理・蓄積することが目的ではなく、有効に使えるようにする
- 単なるデータの「資産化」ではなく「知に変える」ことまでを目指す

##### ユーザー体験を最大に高め、ビジネスを進化させる

- ユーザーの意思決定の質とスピードを最大限に加速させること（ユーザー体験）を実現する
- これにより、ビジネスを次の次元に進化させる

##### プラットフォームであり、選ばれ続けるインフラである

- LegalOnは、法務・CLMという領域に特化した「リーガルプラットフォーム」である
- 「唯一の」という表現で、競合が追いついてきても常に一歩先を行くことが必要

### 関連文書

- 検討背景：[CLMチーム　Mission（検討中）](https://www.notion.so/CLM-Mission-2b831669571280cf9bf1c78c6b0b074d?pvs=21)
- 参考資料：[CLMチームキックオフ](https://www.notion.so/CLM-2b531669571280aabf4ad56ecc25f702?pvs=21)
- Workshop&リーダー会議：[CLM Team Vision Workshop](https://www.notion.so/CLM-Team-Vision-Workshop-2ed31669571280bfb46df4f505c8a018?pvs=21)

## Purpose | 目的

契約書ファイルのライフサイクル全体（アップロード→分類→検索→更新→アーカイブ）を一元管理し、法務部門が必要な契約情報へ素早くアクセスできるようにする。締結版の契約状況（期間中・終了予定・終了済み）を可視化することで、更新漏れや期限超過を防止する。

## User Stories | ユーザーストーリー

- 法務担当者として、契約書を検索・フィルタリングし、該当する契約書をすばやく見つけたい
- 法務担当者として、契約書をアップロードし、取引先・担当者・管理番号などのメタデータを紐づけて管理したい
- 法務マネージャーとして、締結版の契約状況（期間中・終了予定・終了済み）を一覧で把握し、更新漏れを防ぎたい
- 法務担当者として、類似契約書を参照し、過去の契約条件と比較検討したい
- 法務担当者として、契約書のバージョン履歴を確認し、変更経緯を追跡したい

## Domain Model | ドメインモデル

### エンティティ

| エンティティ | 英語名 | 主要属性 | 説明 |
|-------------|--------|---------|------|
| 契約書ファイル | ContractDocument | id, title, counterPartyNames, version, contractDocumentStatus, contractAssignee, fileName, createTime | 管理対象の契約書ファイル本体 |
| 契約書ステータス | ContractDocumentStatus | none, underReview, agreed, archived | テナントカスタマイズ可能な契約書の進捗状態 |
| 契約状況 | AgreedContractStatus | inTerm, scheduledToEnd, finished | 締結版契約のライフサイクルステータス |
| 手動補正ステータス | ManualCorrectionStatus | beforeStart, inProgress, completed, completedWithComment, notSubject | AI解析結果の手動補正の進捗 |
| ファイル詳細 | FileDetail | id, fileName, statusLabel, createUserName, createTime | 個別ファイルの詳細情報 |
| バージョン | FileVersion | version, fileName, status, date | ファイルのバージョン履歴 |
| 類似契約候補 | SimilarContractCandidate | id, title, counterPartyNames, categoryPosition, exactMatch | AI による類似契約書の候補 |
| 保存先スペース | Space | spaceName | 契約書の保存先（部署単位） |

### リレーション

```
ContractDocument 1--* FileVersion: バージョン履歴
ContractDocument 1--1 ContractDocumentStatus: 現在のステータス
ContractDocument 0..1--1 AgreedContractStatus: 締結版の契約状況
ContractDocument 0..1--1 ManualCorrectionStatus: 手動補正状態
ContractDocument 1--1 Space: 保存先
ContractDocument *--* SimilarContractCandidate: 類似契約
```

## Key Screens | 主要画面

| 画面 | パターン | 説明 |
|------|---------|------|
| 契約書一覧（すべて） | list | DataTable + タブ + フィルターDrawer。全契約書のタイトル・取引先名・ステータス・担当者等11列 |
| 契約書一覧（締結版） | list | 締結版に特化した13列。契約状況・締結日・契約期間・自動更新・取引金額等 |
| 契約書詳細 | detail | PDFビューア + 右ペイン（基本情報・管理情報・関連ファイル・特記事項・社内コメント・類似契約） |
| フィルター | drawer | 契約書タイトル・取引先名・ステータス・日付範囲でのフィルタリング |

## Terminology | 用語集

| 用語 | 英語 | 定義 | UI ラベル |
|------|------|------|----------|
| 契約書 | Contract Document | 管理対象の契約書ファイル | 契約書 |
| 契約書タイトル | Title | 契約書の表示名称 | 契約書タイトル |
| 取引先名 | Counter Party | 契約の相手方企業名 | 取引先名 |
| 契約書ステータス | Contract Document Status | テナントカスタマイズ可能な進捗状態 | 契約書ステータス |
| 契約状況 | Agreed Contract Status | 締結版の契約ライフサイクル | 契約状況 |
| 契約期間中 | In Term | 現在有効な契約 | 契約期間中 |
| 契約終了予定 | Scheduled to End | まもなく終了する契約 | 契約終了予定 |
| 契約終了済み | Finished | 既に終了した契約 | 契約終了済み |
| 契約担当者 | Contract Assignee | 契約書の法務担当者 | 契約担当者 |
| 管理番号 | Inhouse ID | 社内管理用の識別番号 | 管理番号 |
| 伝票番号 | Voucher ID | 経理連携用の伝票番号 | 伝票番号 |
| 保存先 | Space | 契約書の格納先スペース（部署等） | 保存先 |
| ファイル追加者 | Created By | ファイルをアップロードしたユーザー | ファイル追加者 |
| 締結版 | Agreed Version | 締結が完了した契約書バージョン | 締結版 |
| 手動補正 | Manual Correction | AI解析結果に対する人手での修正 | 手動補正ステータス |
| 自動更新 | Auto Renewable | 契約期間終了時に自動で更新されるか | 自動更新 |
| 更新拒絶期限日 | Next Refusal Date | 自動更新を拒否するための期限 | 更新拒絶期限日 |
| 取引金額 | Transaction Amount | 契約に関する取引金額 | 取引金額 |
| 類似契約 | Similar Contract | AIが検出した類似する契約書 | 類似契約 |
| 契約締結日 | Signing Date | 契約が締結された日付 | 契約締結日 |
| 契約開始日 | Effective Date | 契約の効力開始日 | 契約開始日 |
| 契約終了日 | Expiration Date | 契約の効力終了日 | 契約終了日 |

## Business Rules | ビジネスルール

- 契約書ステータスはテナントごとにカスタマイズ可能（none / underReview / agreed / archived はデフォルト値）
- 締結版の契約状況は契約期間に基づいて自動判定される（inTerm / scheduledToEnd / finished）
- 契約書一覧は「すべて」タブと「締結版」タブの2ビューで表示（タブ切替でカラム構成が変わる）
- フィルターはタブごとに異なるステータス選択肢を提供する
- 複数行選択時にCSVエクスポートが可能
- 一覧から詳細への遷移はタイトルカラムのリンクから行う

## Related Features | 関連機能

| 機能 | コンセプトパス | 関係 |
|------|--------------|------|
| 案件管理 | `../case/CONCEPT.md` | 案件に契約書ファイルが紐づく |
| 電子署名 | `../esign/CONCEPT.md` | 締結プロセスで電子署名を利用 |
| 契約書レビュー | `../review/CONCEPT.md` | レビュー工程で契約書を参照 |
| LegalOnテンプレート | `../legalon-template/CONCEPT.md` | テンプレートから契約書を作成 |
