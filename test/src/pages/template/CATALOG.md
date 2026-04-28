# Template Catalog

AI 向けテンプレートカタログ。sandbox ページ実装時にキーワード検索してテンプレートを特定する。

---

## Layouts

### PageLayout Patterns
- **description**: PageLayoutの基本パターン集（Sidebar、Pane、Scroll、Stickyなど）
- **keywords**: PageLayout, レイアウト, layout, sidebar, pane, scroll, sticky, 基本, basic, 構造, structure
- **layout**: BasicLayout / WithSidebar / WithPane / WithResizablePane / ScrollInsideLayout / WithStickyContainer
- **components**: PageLayout, PageLayout.Sidebar, PageLayout.Header, PageLayout.Main, PageLayout.Pane, PageLayout.Footer
- **path**: `src/pages/template/pagelayout/`

### Fill Layout
- **description**: PageLayout variant=fill のフルワイドエディタ/ビューア + サイドパネルレイアウト
- **keywords**: fill, フルワイド, エディタ, editor, ビューア, viewer, サイドパネル, side panel, PDF, ドキュメント, document, 全幅
- **layout**: PageLayout variant="fill" + Pane
- **components**: PageLayout, PageLayout.Pane, PageLayout.SideNav
- **path**: `src/pages/template/fill-layout/`

### Form Layout
- **description**: Header + 中央揃えコンテンツ + Footer のフォームレイアウト
- **keywords**: form layout, フォームレイアウト, header footer, 中央揃え, centered, ウィザード, wizard, ステップ, step
- **layout**: PageLayout + Header + Footer (centered content)
- **components**: PageLayout, PageLayout.Header, PageLayout.Main, PageLayout.Footer
- **path**: `src/pages/template/form-layout/`

### Chat Layout
- **description**: Sidebar + メッセージエリア + 入力エリア + Pane の会話UIのテンプレート
- **keywords**: chat, チャット, 会話, conversation, メッセージ, message, AI, assistant, 入力, input
- **layout**: PageLayout + Sidebar + Main + Pane
- **components**: PageLayout, PageLayout.Sidebar, PageLayout.Main, PageLayout.Pane
- **path**: `src/pages/template/chat-layout/`

---

## Pages

### List Page
- **description**: DataTable + タブ + 検索 + ページネーションの汎用的な一覧画面のテンプレート
- **keywords**: list, 一覧, リスト, テーブル, table, DataTable, タブ, tab, 検索, search, ページネーション, pagination, フィルタ, filter
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, DataTable, Tab, SearchField, Pagination, Badge, Button
- **path**: `src/pages/template/list-layout/`

### Detail Page
- **description**: Header + メインコンテンツ + 右ペイン切り替えができる詳細画面のテンプレート
- **keywords**: detail, 詳細, メタデータ, metadata, ペイン, pane, 情報表示, info, プロパティ, property, サマリー, summary
- **layout**: PageLayout + Header + Main + Pane(End)
- **components**: PageLayout, PageLayout.Pane, Tab, DescriptionList, Badge
- **path**: `src/pages/template/detail-layout/`

### Settings Page
- **description**: 左ペインNavList + 右セクション分けの設定画面のテンプレート
- **keywords**: settings, 設定, 管理, management, NavList, サイドナビ, セクション, section, 設定項目, preference, 管理画面
- **layout**: PageLayout + Sidebar + Pane(Start) + Main
- **components**: PageLayout, PageLayout.Pane, NavList, FormControl, Switch, RadioGroup
- **path**: `src/pages/template/settings-layout/`

### Chat Page
- **description**: メッセージバブル・ストリーミング応答・アクションボタン付き会話UIのテンプレート
- **keywords**: chat page, チャットページ, メッセージバブル, bubble, ストリーミング, streaming, AI応答, response, アクション, action
- **layout**: PageLayout + Sidebar + Main + Pane(End)
- **components**: PageLayout, Button, TextArea, Avatar
- **path**: `src/pages/template/chat-layout/`

### Dashboard Page
- **description**: KPIカード・チャートエリア・アクティビティフィード・ショートカットのダッシュボードのテンプレート
- **keywords**: dashboard, ダッシュボード, KPI, カード, card, チャート, chart, グラフ, graph, アクティビティ, activity, フィード, feed, ショートカット, shortcut, 概要, overview
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, Card, Badge, Button, Avatar
- **path**: `src/pages/template/dashboard-layout/`

### Form Page
- **description**: FormControl・バリデーション・送信/キャンセルフロー付きフォームのテンプレート
- **keywords**: form, フォーム, バリデーション, validation, 入力, input, 送信, submit, キャンセル, cancel, FormControl, 登録, register, 編集, edit
- **layout**: PageLayout + Header + Main + Footer
- **components**: PageLayout, FormControl, TextField, Select, Button, RadioGroup, Checkbox
- **path**: `src/pages/template/form-template/`

### Dialog
- **description**: Dialogコンポーネントの使用例（削除確認、フォーム入力など）のテンプレート
- **keywords**: dialog, ダイアログ, モーダル, modal, 確認, confirmation, 削除確認, delete confirm, フォーム入力, form input, アラート, alert
- **layout**: Dialog (overlay)
- **components**: Dialog, Button, FormControl, TextField
- **path**: `src/pages/template/dialog/`

---

## States & Feedback

### Loading
- **description**: Skeleton、ProgressBar/Circle/Overlay、Button/Combobox の loading パターン
- **keywords**: loading, ローディング, skeleton, スケルトン, progress, プログレス, spinner, スピナー, 読み込み, 待機
- **layout**: N/A (state patterns)
- **components**: Skeleton, ProgressBar, ProgressCircle, Button (loading), Combobox (loading)
- **path**: `src/pages/template/states/loading/`

### Error
- **description**: API 取得失敗、フォームバリデーション、送信エラー、Dialog エラー、ErrorBoundary
- **keywords**: error, エラー, 失敗, failure, API エラー, バリデーション, validation error, ErrorBoundary, 送信エラー, submit error, 取得失敗
- **layout**: N/A (state patterns)
- **components**: Alert, EmptyState, ErrorBoundary, FormControl (error), Dialog
- **path**: `src/pages/template/states/error/`

### Empty
- **description**: EmptyState の全サイズ・全コンテキストパターン集
- **keywords**: empty, 空, EmptyState, データなし, no data, 結果なし, no results, 初期状態, initial state, ゼロステート, zero state
- **layout**: N/A (state patterns)
- **components**: EmptyState, Button, Illustration
- **path**: `src/pages/template/states/empty/`

### Feedback
- **description**: Snackbar パターン、Disabled + Popover 理由説明
- **keywords**: feedback, フィードバック, snackbar, スナックバー, toast, トースト, disabled, 無効, popover, ポップオーバー, 理由, reason, 通知, notification
- **layout**: N/A (state patterns)
- **components**: Snackbar, Button, Popover
- **path**: `src/pages/template/states/feedback/`

---

## LegalOn

### Dashboard
- **description**: LegalOnのダッシュボードUIテンプレート
- **keywords**: LegalOn, dashboard, ダッシュボード, ホーム, home, 概要, overview, KPI, 統計, 契約レビュー, AIレビュー, アップロード
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, Card, Badge, DataTable
- **path**: `src/pages/template/loc/dashboard/`
- **sub-pages**:
  - `contract-review/` — 契約書アップロード・AIレビュー対象ワークスペース指定

### Cross Search
- **description**: 横断検索（条文・案件・契約書・ひな形などの全文検索）
- **keywords**: search, 検索, 横断検索, cross search, 全文検索, fulltext, 条文, 案件, 契約書, ひな形, 検索フィルター, 検索条件, フィルタリング, advanced search
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, SearchField, DataTable, Tab, Badge
- **path**: `src/pages/template/loc/search/`
- **sub-pages**:
  - `filters/` — 複数条件での検索結果絞り込みフィルター

### Case Reception Form
- **description**: 案件受付フォームのUIサンプル
- **keywords**: case reception, 案件受付, 受付フォーム, reception form, 依頼, request, 法務相談, legal consultation
- **layout**: PageLayout + Header + Main + Footer
- **components**: PageLayout, FormControl, TextField, Select, Button
- **path**: `src/pages/template/loc/case-reception-form/`

### Error Page
- **description**: NotFound / ServerError / Maintenance のUIを確認できます
- **keywords**: error page, NotFound, 404, ServerError, 500, メンテナンス, maintenance, エラーページ
- **layout**: Full-page error
- **components**: EmptyState, Button, Illustration
- **path**: `src/pages/template/loc/root/`

### E-Sign Template
- **description**: 署名依頼作成UIを再現したテンプレート
- **keywords**: esign, 電子署名, 署名依頼, signature request, 電子契約, e-sign, 署名, sign, 依頼作成
- **layout**: PageLayout variant="fill" + Pane
- **components**: PageLayout, FormControl, Button, Tab
- **path**: `src/pages/template/loc/esign/`

### E-Sign Envelope List
- **description**: 電子契約一覧（署名依頼タブ）のUIテンプレート
- **keywords**: esign list, 電子契約一覧, 署名依頼一覧, envelope, エンベロープ, 署名依頼タブ
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, DataTable, Tab, Badge, Pagination
- **path**: `src/pages/template/loc/esign/` (envelope-list.tsx)

### Legalon Template
- **description**: LegalOnひな形は、法務業務を効率化するためのテンプレート集です
- **keywords**: legalon template, ひな形, テンプレート管理, template management, 法務, legal, 文書テンプレート, document template
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, DataTable, Tab, SearchField, Badge
- **path**: `src/pages/template/loc/legalon-template/`

### Legalon Template Detail
- **description**: LegalOnひな形の詳細画面（PDFビューア + メタ情報ペイン）
- **keywords**: template detail, ひな形詳細, PDFビューア, PDF viewer, メタ情報, metadata, プレビュー, preview
- **layout**: PageLayout variant="fill" + Pane
- **components**: PageLayout, PageLayout.Pane, DescriptionList
- **path**: `src/pages/template/loc/legalon-template/` (detail.tsx)

### LegalOn Matter List
- **description**: マターマネジメント案件一覧画面
- **keywords**: matter, 案件, ケース, case, 一覧, list, マターマネジメント, matter management, 案件一覧, 案件管理
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, DataTable, Tab, SearchField, Badge, Pagination, Button
- **path**: `src/pages/template/loc/case/`

### LegalOn Matter Detail
- **description**: マターマネジメント案件詳細画面
- **keywords**: matter detail, 案件詳細, ケース詳細, case detail, マター詳細, 案件情報
- **layout**: PageLayout + Header + Main + Pane(End)
- **components**: PageLayout, PageLayout.Pane, Tab, DescriptionList, Badge, Timeline
- **path**: `src/pages/template/loc/case/detail/`

### LegalOn Application Console
- **description**: 案件ステータス設定画面
- **keywords**: application console, アプリケーション設定, ステータス設定, status settings, 管理コンソール, admin console, テナント設定, 案件自動化, AI自動対応, カスタム項目, ドメイン制限, メール通知, 受付フォーム, IP制限, ワークスペース設定, 受付メールアドレス
- **layout**: PageLayout + Sidebar + Pane(Start) + Main
- **components**: PageLayout, NavList, FormControl, Switch, Button
- **path**: `src/pages/template/loc/application-console/`
- **sub-pages**:
  - `case-automation/` — AI自動対応（担当者割り当て、質問返信、案件タイプ判定）
  - `case-custom-attribute/` — 案件カスタム項目管理（最大50件）
  - `case-mail-allowed-domain/` — メール送受信ドメイン制限
  - `case-notification-config/` — 案件受付通知のオンオフ設定
  - `case-reception-form/` — 案件受付フォーム一覧・ステータス管理
  - `case-reception-form/edit/` — 受付フォームの項目・完了画面編集
  - `case-reception-form-allowed-ip-address/` — 受付フォームIP制限
  - `case-reception-space/` — メール案件の保存先ワークスペース指定
  - `reception-mail-address/` — 案件自動作成メールアドレス管理

### LegalOn Application Console (Contract Management)
- **description**: 契約カスタム項目・管理番号・期限通知・電子契約サービス連携の設定画面
- **keywords**: contract management, 契約管理, カスタム項目, custom attribute, 管理番号, 期限通知, deadline notification, 電子契約連携, 自動採番, 採番ルール, 自動抽出, DocuSign, CloudSign
- **layout**: PageLayout + Sidebar + Pane(Start) + Main
- **components**: PageLayout, NavList, FormControl, DataTable, Button
- **path**: `src/pages/template/loc/application-console/contract-management/` (共通レイアウト: `_shared/index.tsx`)
- **sub-pages**:
  - `custom-attribute-definition/` — 契約書カスタム項目の定義・AI自動抽出設定
  - `esign-integration/` — DocuSign・CloudSign等の電子契約サービス連携
  - `inhouse-id-auto-numbering/` — 管理番号の採番ルール（接頭辞・桁数）設定
  - `notification/` — 契約期限通知タイミング設定

### LegalOn Application Console (Sign)
- **description**: 差出人企業名・署名依頼の保存先・承認申請フォームの設定画面
- **keywords**: sign settings, 署名設定, 差出人, sender, 保存先, 承認申請, approval, 署名依頼設定, 差出人企業名, ワークフロー, 申請フォーム
- **layout**: PageLayout + Sidebar + Pane(Start) + Main
- **components**: PageLayout, NavList, FormControl, RadioGroup, Button
- **path**: `src/pages/template/loc/application-console/sign/` (共通レイアウト: `_shared/index.tsx`)
- **sub-pages**:
  - `default-space/` — 署名依頼のデフォルト保存先スペース設定
  - `sender-name/` — 署名依頼メールの差出人企業名設定
  - `sign-workflow-form/` — 承認申請フォームの作成・公開設定

### Customer Template
- **description**: 自社ひな形の一覧管理画面
- **keywords**: customer template, 自社ひな形, 自社テンプレート, ファイル管理, file management, テンプレート一覧
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, DataTable, Tab, SearchField, Button
- **path**: `src/pages/template/loc/file-management/customer-template/`

### Word Addin Review
- **description**: Word アドインのレビューパネル UI
- **keywords**: word addin, Word アドイン, レビュー, review, パネル, panel, Office, タスクペイン, task pane
- **layout**: Narrow panel layout (Word add-in)
- **components**: Tab, Button, Badge, Accordion
- **path**: `src/pages/template/loc/word-addin/`

### Word Addin Standalone
- **description**: Word アドイン スタンドアロン版タスクペイン UI
- **keywords**: word addin standalone, スタンドアロン, standalone, タスクペイン, task pane, Office, Word
- **layout**: Standalone narrow panel
- **components**: Tab, Button, Badge, Accordion, FormControl
- **path**: `src/pages/template/loc/word-addin-standalone/`

### Contract Review
- **description**: 契約リスクチェック画面（PDFビューア + プレイブックパネル）
- **keywords**: contract review, 契約レビュー, リスクチェック, risk check, プレイブック, playbook, PDF, 契約書チェック
- **layout**: PageLayout variant="fill" + Pane
- **components**: PageLayout, PageLayout.Pane, Tab, Badge, Button
- **path**: `src/pages/template/loc/review/`

### Manual Correction
- **description**: 手動補正ツールの契約書一覧画面（検索フォーム + テーブル）
- **keywords**: manual correction, 手動補正, 補正ツール, correction tool, 契約書一覧
- **layout**: PageLayout + Header + Main
- **components**: PageLayout, DataTable, SearchField, FormControl, Button
- **path**: `src/pages/template/loc/manual-correction/`

### Manual Correction Detail
- **description**: 手動補正ツールの契約書詳細画面（PDFビューア + アノテーション確認/編集ペイン）
- **keywords**: manual correction detail, 補正詳細, アノテーション, annotation, PDF ビューア, 編集ペイン
- **layout**: PageLayout variant="fill" + Pane
- **components**: PageLayout, PageLayout.Pane, Button, Badge
- **path**: `src/pages/template/loc/manual-correction/detail/`

### LegalOn Assistant
- **description**: AIアシスタントとの会話UI（LOA Conversation）
- **keywords**: LOA, assistant, アシスタント, AI チャット, AI chat, 会話, conversation, LegalOn AI, 会話履歴, プレイブック作成, 審査基準, プロンプトライブラリ, prompt library
- **layout**: PageLayout + Sidebar + Main + Pane(End)
- **components**: PageLayout, Button, TextArea, Avatar, Badge
- **path**: `src/pages/template/loc/loa/`
- **sub-pages**:
  - `history/` — 会話履歴の時系列表示・編集・削除・再開
  - `playbook/` — AIエージェントとの対話によるプレイブック自動生成・編集
  - `prompt-library/` — プロンプトテンプレートの作成・検索・お気に入り管理

### Review Console
- **description**: LegalOn アラート設定 / プレイブック管理
- **keywords**: review console, レビューコンソール, アラート設定, alert settings, プレイブック管理, playbook management, レビュー基準, 判定ルール, 重度度, review rule
- **layout**: PageLayout + Sidebar + Pane(Start) + Main
- **components**: PageLayout, NavList, DataTable, Button, Dialog
- **path**: `src/pages/template/loc/review-console/`
- **sub-pages**:
  - `my-playbook/` — プレイブック（自社・LegalOn製）のアラート内容閲覧・編集
  - `rules/` — 契約レビュー判定ルールのグループ別表示・重度度変更

### File Management
- **description**: 契約書管理（一覧・詳細画面）
- **keywords**: file management, ファイル管理, 契約書管理, contract management, 書類管理, document management, 契約書一覧, ファイル詳細, バージョン管理, 類似契約書
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, DataTable, Tab, SearchField, Badge, Pagination
- **path**: `src/pages/template/loc/file-management/`
- **sub-pages**:
  - `detail/` — ファイル詳細情報・バージョン管理・関連ファイル・類似契約書表示

### Management Console
- **description**: ライセンス使用状況とテナント情報を管理する画面
- **keywords**: management console, 管理コンソール, ライセンス, license, テナント, tenant, 使用状況, usage, 組織管理
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, Card, DataTable, Badge, ProgressBar
- **path**: `src/pages/template/loc/management-console/`

### Personal Setting
- **description**: 個人設定画面（プロフィール、通知設定、外部連携）
- **keywords**: personal setting, 個人設定, プロフィール, profile, 通知設定, notification, 外部連携, integration, マイページ, my page
- **layout**: PageLayout + Sidebar + Pane(Start) + Main
- **components**: PageLayout, NavList, FormControl, Switch, Avatar, Button
- **path**: `src/pages/template/loc/personal-setting/`

### Setting Page
- **description**: 設定ページテンプレート（各種セクションとgapの実装例）
- **keywords**: setting page, 設定ページ, セクション, section, gap, スペーシング, spacing, 設定画面
- **layout**: PageLayout + Sidebar + Pane(Start) + Main
- **components**: PageLayout, NavList, FormControl, Button
- **path**: `src/pages/template/loc/setting-page/`

---

## WorkOn

### Employee Registration
- **description**: 従業員登録ページ
- **keywords**: employee registration, 従業員登録, 社員登録, registration, 登録フォーム, 入社, onboarding, WorkOn
- **layout**: PageLayout + Header + Main + Footer
- **components**: PageLayout, FormControl, TextField, Select, Button, Stepper
- **path**: `src/pages/template/workon/employee-registration/`

### Procedure
- **description**: 手続きページ
- **keywords**: procedure, 手続き, ワークフロー, workflow, 申請, application, タスク, task, 進捗, progress, WorkOn
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, DataTable, Tab, Badge, Button
- **path**: `src/pages/template/workon/procedure/`

### Setting
- **description**: 設定ページ（招待、アカウント、権限管理）
- **keywords**: workon setting, WorkOn 設定, 招待, invite, アカウント, account, 権限管理, permission, ロール, role
- **layout**: PageLayout + Sidebar + Pane(Start) + Main
- **components**: PageLayout, NavList, DataTable, FormControl, Button, Dialog
- **path**: `src/pages/template/workon/setting/`

### Profile
- **description**: プロフィールページ
- **keywords**: workon profile, WorkOn プロフィール, 従業員情報, employee info, 人事情報, HR info, 個人情報, personal info
- **layout**: PageLayout + Sidebar + Header + Main + Pane(End)
- **components**: PageLayout, Tab, DescriptionList, Avatar, Badge, Button
- **path**: `src/pages/template/workon/profile/`

---

## DealOn

### DealOn Layout
- **description**: DealOnレイアウトテンプレート（ダークHeader + サイドバー）
- **keywords**: DealOn layout, DealOn レイアウト, ダークヘッダー, dark header, DealOn 基本
- **layout**: PageLayout + Sidebar + Header (dark variant)
- **components**: PageLayout, PageLayout.Sidebar, PageLayout.Header
- **path**: `src/pages/template/dealon/layout/`

### DealOn Deal 一覧
- **description**: Deal 一覧画面（タブ、検索、DataTable、ページネーション）
- **keywords**: deal list, Deal 一覧, 取引一覧, transaction list, ディール, deal, M&A, DealOn
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, DataTable, Tab, SearchField, Badge, Pagination, Button
- **path**: `src/pages/template/dealon/deal-list/`

### DealOn Deal 詳細
- **description**: Deal 詳細画面（9タブ: 基本情報、アラート、タスク等）
- **keywords**: deal detail, Deal 詳細, 取引詳細, transaction detail, ディール詳細, タブ, DealOn
- **layout**: PageLayout + Header + Main (tabs)
- **components**: PageLayout, Tab, DataTable, DescriptionList, Badge, Timeline, Button
- **path**: `src/pages/template/dealon/deal-detail/`

### DealOn 個人設定
- **description**: 個人設定画面（プロフィール、MFA、外部連携）
- **keywords**: dealon settings profile, DealOn 個人設定, DealOn プロフィール, MFA, 二要素認証, 外部連携
- **layout**: PageLayout + Sidebar + Pane(Start) + Main
- **components**: PageLayout, NavList, FormControl, Switch, Avatar, Button
- **path**: `src/pages/template/dealon/settings-profile/`

### DealOn ユーザー管理
- **description**: ユーザー管理画面（ユーザー一覧テーブル、招待）
- **keywords**: dealon users, DealOn ユーザー管理, ユーザー一覧, user management, 招待, invite, メンバー管理, member management
- **layout**: PageLayout + Sidebar + Header + Main
- **components**: PageLayout, DataTable, Button, Dialog, Badge
- **path**: `src/pages/template/dealon/settings-users/`
