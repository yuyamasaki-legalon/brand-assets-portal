# 案件一覧・詳細画面（Drawer型）

## 目的（Purpose）

法務部門が案件を一覧管理し、詳細情報の確認・編集・コミュニケーションを行うための画面。一覧からDrawerで詳細を開く形式で、コンテキストを保ちながら案件情報を操作できる。

## ユースケース（Use Cases）

- 案件一覧を確認し、ステータス別の件数を把握する
- タブで絞り込み条件を切り替えて案件を探す
- フィルター条件を設定して案件を検索する
- 一覧から案件を選択して詳細をDrawerで確認する
- 案件の基本情報（ステータス、担当者、納期など）を編集する
- タイムラインでコミュニケーション履歴を確認・投稿する
- 関連ファイル・関連案件を参照する

## 画面構成（Screen Composition）

### レイアウト（Layout）

- **パターン**: パターン1: 一覧画面（Sidebar + Main）+ Drawer詳細
- **構成要素**:
  - Sidebar: あり - グローバルナビゲーション（ダッシュボード、検索、案件、契約書など）
  - Header: ContentHeader - ページタイトル「案件」+ 作成ボタン
  - Main: 統計カード + タブ付きテーブル
  - Pane: なし（Drawerで詳細表示）
  - Footer: なし

### 主要コンポーネント（Key Components）

| エリア | コンポーネント | 用途 |
|--------|---------------|------|
| Sidebar | SidebarNavigation | グローバルナビゲーション |
| Header | ContentHeader, Button | ページタイトル、案件作成 |
| Main | Divider, SegmentItem | ステータス別統計表示 |
| Main | Tab.Group, Tab.List | ビュー切り替え（すべて、担当中など） |
| Main | Toolbar, Search, Button | フィルター、検索、オプション |
| Main | Table, DataTable | 案件一覧表示 |
| Drawer (Filter) | Form, FormControl, Select, TagPicker, RangeDateField | フィルター条件入力 |
| Drawer (Detail) | ContentHeader | 案件タイトル表示 |
| Drawer (Detail) | Text, TagGroup | 案件概要、キーワード |
| Drawer (Detail) | Tab.Group | 案件情報/タイムライン/関連ファイル/関連案件 |
| Drawer (Detail) | Form, Select, DateField | 案件情報編集 |
| Drawer (Detail) | Textarea, Button, Avatar | メッセージ投稿 |
| Drawer (Detail) | Timeline（カスタム） | コミュニケーション履歴 |

### データ構造（Data Structure）

```typescript
// 案件データ
interface CaseRow {
  id: string;           // 案件番号 (例: "2024-03-0020")
  title: string;        // 案件名
  status: string;       // 案件ステータス
  dueDate: string;      // 納期
  updatedAt: string;    // 更新日時
  requester: string;    // 依頼者
  department: string;   // 依頼部署
  hasUnread?: boolean;  // 未読フラグ
}

// ステータス統計
interface StatusCount {
  label: string;        // ステータス名
  count: number;        // 件数
  isOverflow?: boolean; // 999+表示フラグ
}

// 案件詳細
interface CaseDetail {
  overview: string;     // 案件概要
  url: string;          // 関連URL
  space: string;        // 保存先スペース
  mainAssignee: string; // 主担当者
  subAssignees: string[]; // 副担当者
  dueDate: string;      // 納期
}

// タイムラインイベント
type TimelineEvent =
  | { type: "mail"; sender: string; date: string; subject: string; content: string; attachments: string[]; to: string; }
  | { type: "message"; sender: string; date: string; content: string; }
  | { type: "status"; sender: string; date: string; content: string; };

// 関連ファイル
interface LinkedFile {
  name: string;
  updatedAt: string;
}

// 関連案件
interface RelatedCase {
  id: string;
  title: string;
  status: string;
}
```

### 状態管理（State）

| 状態名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| filterOpen | boolean | false | フィルターDrawerの開閉 |
| detailDrawerOpen | boolean | false | 詳細Drawerの開閉 |
| selectedCase | CaseRow \| null | null | 選択中の案件 |
| showAllHistory | boolean | true | 履歴表示（ステータス変更含む） |
| messageValue | string | "" | メッセージ入力値 |
| caseType | string | "contract_review" | 案件タイプ選択値 |
| status | string | "legal_review" | ステータス選択値 |
| assignee | string | "yamada" | 担当者選択値 |
| department | string | "sales" | 部署選択値 |

### インタラクション（Interactions）

- テーブル行クリック → 詳細Drawerを開く（selectedCaseを更新）
- フィルターボタンクリック → フィルターDrawerを開く
- タブ切り替え → 表示内容を切り替え（Table/DataTable両方のデモあり）
- 「案件を作成」ボタン → {要実装: 案件作成フロー}
- 検索入力 → {要実装: 案件検索}
- フィルター条件変更 → {要実装: 一覧絞り込み}
- 案件情報フォーム変更 → 状態更新（Select, DateFieldなど）
- メッセージ投稿 → {要実装: メッセージ送信}
- 履歴表示Switch切り替え → タイムラインのステータスイベント表示/非表示
- 「編集」ボタン → {要実装: 案件概要編集モード}
- 「返信」ボタン → {要実装: メール返信}
- 関連ファイル「開く」 → {要実装: ファイルを開く}
- 関連案件「詳細へ」 → {要実装: 関連案件詳細に遷移}

## 備考

- Table と DataTable の両方のデモが含まれている（タブ「すべて」はTable、タブ「DataTable」はDataTable）
- Drawer は `root={drawerRoot}` でTab.Panels内に配置され、PageLayout全体をカバーしない設計
- タイムラインはカスタム実装（mail/message/statusの3種類のイベントタイプ）
- 統計カード（SegmentItem）はカスタムコンポーネントとして定義
