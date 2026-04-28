<!-- PRD_STATUS: draft -->
<!-- UPDATED: 2025-12-26 -->

# 案件一覧・詳細画面（Drawer型） - PRD

## Introduction | 導入

### Goal | ゴール

法務部門が案件を一覧管理し、詳細情報の確認・編集・コミュニケーションを行うための画面を提供する。一覧からDrawerで詳細を開く形式により、コンテキストを保ちながら案件情報を操作できる。

### Why we're building this? | なぜつくるのか？

一覧画面から爆速でその案件がどういう案件なのかをさっと把握するため。毎回毎回詳細画面を開かないでもよいようにする。

- **課題**: 従来の画面遷移型UIでは、案件内容を確認するたびにページ遷移が必要で効率が悪い
- **解決策**: Drawer型UIにより、一覧のコンテキストを維持したまま詳細を確認・編集できる

### Target release | リリース目標

未定（プロトタイプ段階）

---

## Requirements | 要求事項

### Wireframe / Design links | ワイヤーフレーム

なし（コードベースでプロトタイピング）

### Usecase | ユースケース

1. **案件一覧の確認**: 法務担当者が案件一覧を確認し、ステータス別の件数を把握する
2. **案件の絞り込み**: タブで絞り込み条件を切り替えて案件を探す
3. **詳細フィルター**: フィルター条件を設定して案件を検索する
4. **案件詳細の確認**: 一覧から案件を選択して詳細をDrawerで確認する
5. **案件情報の編集**: 案件の基本情報（ステータス、担当者、納期など）を編集する
6. **コミュニケーション**: タイムラインでコミュニケーション履歴を確認・投稿する
7. **関連情報の参照**: 関連ファイル・関連案件を参照する

### Requirement lists | 要求事項一覧

#### 実装済み機能

| # | 機能 | 説明 |
|---|------|------|
| 1 | 案件一覧表示 | Table/DataTable で案件一覧を表示 |
| 2 | ステータス統計 | ステータス別の案件件数を統計カードで表示 |
| 3 | タブ切り替え | すべて/担当中/案件担当者未入力 等のタブでビューを切り替え |
| 4 | フィルターDrawer | 案件番号、ステータス、担当者、納期等のフィルター条件入力 |
| 5 | 詳細Drawer | 案件概要、キーワード、案件情報、タイムライン、関連ファイル、関連案件の表示 |
| 6 | タイムライン表示 | メール/メッセージ/ステータス変更の3種類のイベントを時系列表示 |
| 7 | 案件情報フォーム | 案件タイプ、ステータス、担当者、納期等の編集フォーム |
| 8 | 履歴表示切り替え | Switchでステータス変更履歴の表示/非表示を切り替え |
| 9 | メッセージ入力UI | Textarea + リッチテキストツールバー + ファイル添付/メンションボタン |

#### 未実装機能（{要実装}）

| # | 機能 | 説明 |
|---|------|------|
| 1 | 案件作成 | 「案件を作成」ボタンからの案件作成フロー |
| 2 | 案件検索 | 検索ボックスからのキーワード検索 |
| 3 | フィルター適用 | フィルター条件の実際の適用・一覧絞り込み |
| 4 | メッセージ投稿 | タイムラインへのメッセージ送信 |
| 5 | 案件概要編集 | 「編集」ボタンからの案件概要編集モード |
| 6 | メール返信 | タイムライン内メールの「返信」機能 |
| 7 | ファイルを開く | 関連ファイルの「開く」機能 |
| 8 | 関連案件遷移 | 関連案件の「詳細へ」から遷移 |
| 9 | CSVダウンロード | 案件一覧のCSVエクスポート |
| 10 | 表示項目カスタマイズ | テーブル列の表示/非表示設定 |

---

## Go to Market | 市場進出

### Whether to issue a press release | プレスリリース可否

N/A（プロトタイプ段階）

### Productization | 製品化

既存製品に組み込み予定

---

## Why we build this? | なぜ我々がやるのか？

### Target customers | ターゲットユーザー

- **主要ターゲット**: 法務部門担当者
- **利用シーン**:
  - 日常の案件管理業務
  - 契約書レビュー依頼の対応
  - 社内からの法務相談対応
  - 案件の進捗状況把握

### Market analysis | 市場分析

N/A（プロトタイプ段階）

### Competitor analysis | 競合分析

N/A（プロトタイプ段階）

---

## Related information | 関連情報

### Product principles | 製品原則

1. **コンテキスト維持**: 一覧を見ながら詳細を確認できる（画面遷移しない）
2. **シンプルさ優先**: 必要最小限の情報と操作に絞る
3. **既存UXとの一貫性**: 他の画面と操作性を揃える

### Definition of terms | 用語

| 用語 | 定義 |
|------|------|
| CaseRow | 案件一覧の1行データ（id, title, status, dueDate, updatedAt, requester, department, hasUnread） |
| StatusCount | ステータス別統計（label, count, isOverflow） |
| CaseDetail | 案件詳細（overview, url, space, mainAssignee, subAssignees, dueDate） |
| TimelineEvent | タイムラインイベント（mail/message/status の3種類） |
| LinkedFile | 関連ファイル（name, updatedAt） |
| RelatedCase | 関連案件（id, title, status） |

### Constraints | 制約事項

- **デザインシステム**: Aegis Design System（@legalforce/aegis-react）を使用
- **UIパターン**: Sidebar + Main + Drawer 型レイアウト
- **Drawer配置**: `root={drawerRoot}` でTab.Panels内に配置（PageLayout全体をカバーしない）
- **テーブル実装**: Table と DataTable の両方のデモを含む

### Check points | 確認事項

{TBD}

### Stakeholders | ステークホルダー

{TBD}

---

## 技術仕様

### レイアウト構成

```
SidebarProvider
├── Sidebar（グローバルナビゲーション）
└── SidebarInset
    └── PageLayout
        └── PageLayoutContent
            ├── PageLayoutHeader（ContentHeader）
            ├── PageLayoutBody
            │   ├── 統計カード（SegmentItem）
            │   └── Tab.Group
            │       ├── Tab.List + Toolbar
            │       └── Tab.Panels（+ Drawer root）
            ├── Drawer（フィルター）
            └── Drawer（詳細）
```

### 主要コンポーネント

| エリア | コンポーネント |
|--------|---------------|
| Sidebar | SidebarNavigation, SidebarNavigationItem, SidebarNavigationLink |
| Header | ContentHeader, Button, IconButton |
| Main | Divider, Tab.Group, Tab.List, Toolbar, Search, Menu |
| Table | Table, DataTable, TableContainer |
| Filter Drawer | Form, FormControl, Select, TagPicker, RangeDateField, Checkbox |
| Detail Drawer | ContentHeader, Text, TagGroup, Tab.Group, Form, Textarea, Avatar |

### 状態管理

| 状態名 | 型 | 用途 |
|--------|-----|------|
| filterOpen | boolean | フィルターDrawerの開閉 |
| detailDrawerOpen | boolean | 詳細Drawerの開閉 |
| selectedCase | CaseRow \| null | 選択中の案件 |
| showAllHistory | boolean | ステータス変更履歴の表示 |
| messageValue | string | メッセージ入力値 |
| caseType | string | 案件タイプ選択値 |
| status | string | ステータス選択値 |
| assignee | string | 担当者選択値 |
| department | string | 部署選択値 |

---

_Generated from SPEC.md and index.tsx_
_Last updated: 2025-12-26_
