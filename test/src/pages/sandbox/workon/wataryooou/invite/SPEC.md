# 従業員招待管理

## 目的（Purpose）

従業員をシステムに招待し、招待状況を一覧で管理する画面。複数選択による一括操作、フィルタリング、検索機能を備える。

## ユースケース（Use Cases）

- 管理者が従業員一覧から招待対象を選択し、招待メールを送信する
- 管理者が招待済み・未ログインの従業員を絞り込んで確認する
- 管理者が従業員名で検索して特定の従業員を見つける
- 管理者が複数の従業員を選択して一括で招待を再送/取り消しする

## 画面構成（Screen Composition）

### レイアウト（Layout）

- **パターン**: パターン1: 一覧画面（Sidebar + Main）
- **構成要素**:
  - Sidebar: あり（WorkOn アプリのグローバルナビゲーション）
  - Header: ContentHeader（戻るボタン + タイトル「従業員を招待」）
  - Main: DataTable による従業員一覧
  - Pane: なし
  - Footer: なし

### 主要コンポーネント（Key Components）

| エリア | コンポーネント | 用途 |
|--------|---------------|------|
| Sidebar | SidebarNavigation | アプリ内ナビゲーション |
| Header | ContentHeader | ページタイトル・戻るボタン |
| Toolbar | Search | 従業員名検索 |
| Toolbar | Switch | 未ログインフィルター |
| Toolbar | Button | 一括アクション（招待再送/取り消し） |
| Main | DataTable | 従業員一覧（複数選択対応） |
| Main | StatusLabel | 招待ステータス表示 |
| Main | Menu + ActionList | 行アクションメニュー |
| Footer | Pagination | ページネーション |

### データ構造（Data Structure）

```typescript
type InvitationStatus = "loggedIn" | "invited" | "notInvited";

type Employee = {
  id: string;
  employeeNumber: string;
  name: string;
  employmentType: string;
  employmentStatus: string;
  email: string;
  invitationStatus: InvitationStatus;
  lastLoginAt: string | null;
};
```

### 状態管理（State）

| 状態名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| selectedRows | string[] | ["2", "3", "5"] | 選択中の行ID |
| showNotLoggedInOnly | boolean | false | 未ログインフィルター |
| searchQuery | string | "" | 検索クエリ |
| page | number | 1 | 現在のページ番号 |

### DataTable カラム定義

| カラムID | 表示名 | 特記事項 |
|----------|--------|----------|
| employeeNumber | 従業員番号 | - |
| name | 従業員名 | Avatar 付き |
| employmentType | 雇用形態 | - |
| employmentStatus | 在籍状況 | - |
| email | 社用メールアドレス | - |
| invitationStatus | ステータス | StatusLabel でバッジ表示 |
| lastLoginAt | 最終ログイン日時 | null の場合 "--" |
| actions | ダミー | 右固定、Menu による行アクション |

### インタラクション（Interactions）

- **行選択**: チェックボックスで複数選択 → ツールバーに選択件数と一括アクションボタン表示
- **検索**: 従業員名で部分一致検索 → ページ1にリセット
- **フィルター**: 「未ログインのみ」トグル → loggedIn 以外を表示、ページ1にリセット
- **ページネーション**: ページ切り替え
- **行アクション**: 三点メニューから「招待を再送」「招待を取り消し」
- **一括アクション**: 選択行に対して「招待を再送」「招待を取り消し」

## 技術的特徴

- **DataTable**: rowSelectionType="multiple" による複数選択
- **カラム固定**: defaultColumnPinning={{ end: ["actions"] }}
- **カラム幅指定**: defaultColumnSizing={{ actions: 120 }}
- **useMemo**: フィルタリング結果のメモ化

## 元テンプレート

`src/pages/template/work-on/setting/invite/` をベースに Table → DataTable へ変換。

## 対応する本番コード

```
lib/hueron-app/frontend/apps/main/src/app/setting/invite/
```

### 主なコンポーネント

| ファイル | 説明 |
|----------|------|
| `page-client.tsx` | メインページ |
| `_components/user-table-with-dialogs/` | テーブル + ダイアログ統合 |
| `_components/invite-dialog/` | 招待ダイアログ |
| `_components/resend-dialog/` | 再送ダイアログ |
| `_components/cancel-invite-dialog/` | 取り消しダイアログ |
| `_components/user-row/` | テーブル行 |
| `_components/user-actions/` | 行アクション |

### sandbox との差分

| 項目 | sandbox | hueron-app |
|------|---------|------------|
| タイトル | 従業員を招待 | 管理者を招待 |
| Sidebar | あり（WorkOn風） | なし（設定画面内） |
| テーブル | DataTable | Table |
| ダイアログ | なし（モック） | 実装あり |
| データ取得 | モックデータ | API連携 |
