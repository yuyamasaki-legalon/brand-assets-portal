# 手続き管理（従業員情報変更）

## 目的（Purpose）

従業員情報の変更手続きを一覧で管理する画面。ステータス別タブ、一括/個人フィルターで変更リクエストを管理し、詳細確認や下書き戻しなどの操作を行う。

## ユースケース（Use Cases）

- 管理者がステータス別（予約中/変更失敗/変更済み/下書き）に変更リクエストを確認する
- 管理者が一括変更と個人変更を切り替えて確認する
- 管理者が変更リクエストの詳細を確認する
- 管理者が予約中/変更失敗の変更を下書きに戻す
- 管理者が新しい情報変更手続きを作成する

## 画面構成（Screen Composition）

### レイアウト（Layout）

- **パターン**: パターン1.1: 一覧＋詳細（Sidebar + Pane + Main）
- **構成要素**:
  - Sidebar: あり（WorkOn アプリのグローバルナビゲーション）
  - Pane: あり（左側、手続き種別ナビゲーション）
  - Header: ContentHeader（タイトル + 作成ボタン）
  - Main: Tab.Group + DataTable による変更リクエスト一覧
  - Footer: なし

### 主要コンポーネント（Key Components）

| エリア | コンポーネント | 用途 |
|--------|---------------|------|
| Sidebar | SidebarNavigation | アプリ内グローバルナビ |
| Pane | NavList | 手続き種別選択（入社手続き/従業員情報変更） |
| Header | ContentHeader | タイトル・作成ボタン |
| Main | Tab.Group | ステータス別タブ切り替え |
| Main | SegmentedControl | 一括/個人フィルター |
| Main | DataTable | 変更リクエスト一覧 |
| Main | StatusLabel | ステータスバッジ |
| Main | Tag | 作成元ラベル |
| Main | Menu + ActionList | 行アクションメニュー |
| Footer | Pagination | ページネーション |

### データ構造（Data Structure）

```typescript
const CHANGE_REQUEST_STATUS = {
  reservation: "予約中",
  incompleted: "変更失敗",
  completed: "確認待ち",
  canceled: "変更済み",
  draft: "下書き",
} as const;

type ChangeRequestStatus = keyof typeof CHANGE_REQUEST_STATUS;

interface ChangeRequestEmployee {
  id: string;
  type: "all" | "individual";
  status: ChangeRequestStatus;
  groupName: string;
  createSource: string;
  issueDate: string;
  updateDate: string;
}
```

### 状態管理（State）

| 状態名 | 型 | 用途 |
|--------|-----|------|
| (Tab内部) | number | 現在のタブインデックス |
| (SegmentedControl内部) | string | 一括/個人フィルター値 |

※ このプロトタイプでは明示的な useState は使用していない（コンポーネント内部で管理）

### DataTable カラム定義

| カラムID | 表示名 | 特記事項 |
|----------|--------|----------|
| status | ステータス | StatusLabel でバッジ表示（色分け） |
| groupName | 情報変更グループ名 | - |
| createSource | 作成元 | Tag でラベル表示 |
| issueDate | 発令日 | - |
| updateDate | 最終更新日時 | - |
| actions | - | Menu による行アクション |

### ステータス別スタイル

| ステータス | 色 | バリアント |
|-----------|-----|-----------|
| reservation（予約中） | yellow | fill |
| incompleted（変更失敗） | red | fill |
| canceled（変更済み） | blue | fill |
| draft（下書き） | gray | outline |
| completed（確認待ち） | gray | fill |

### インタラクション（Interactions）

- **タブ切り替え**: 予約中/変更失敗/変更済み/下書きでフィルタリング
- **セグメント切り替え**: 一括の変更/個人の変更でフィルタリング
- **行アクション**:
  - 詳細を見る（全ステータス共通、draft除く）
  - 下書きに戻す（reservation, incompleted のみ）
  - 再実行（draft のみ）
  - 削除（draft のみ、危険アクション）
- **作成ボタン**: 情報変更手続きを作成

## 技術的特徴

- **DataTable**: highlightRowOnHover で行ホバー強調
- **条件分岐メニュー**: ステータスに応じて表示メニュー項目を変更
- **Tab.Panels**: 各タブの内容を遅延レンダリング

## 元テンプレート

`src/pages/template/work-on/procedure/` をベースに Table → DataTable へ変換。

## 対応する本番コード

```
lib/hueron-app/frontend/apps/main/src/app/procedure/
```

### ディレクトリ構造

| パス | 説明 |
|------|------|
| `(list)/` | 一覧ページ群 |
| `(list)/change-request/` | 従業員情報変更 |
| `(list)/join/` | 入社手続き |
| `(list)/document/` | 届出書類 |
| `(list)/report/` | 届出 |
| `(list)/resignation/` | 退職手続き |
| `detail/` | 詳細ページ |
| `_components/` | 共通コンポーネント |
| `_data/` | データ取得・モック |

### sandbox との差分

| 項目 | sandbox | hueron-app |
|------|---------|------------|
| レイアウト | Sidebar + Pane + Main | (list) layout でラップ |
| テーブル | DataTable | Table |
| 手続き種別 | NavList（2項目） | 実際の手続き種別すべて |
| データ取得 | モックデータ | API連携 |
| タブ内容 | 予約中のみ実装 | 各ステータス実装 |
