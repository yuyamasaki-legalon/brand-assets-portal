# LOC テンプレート化 TODO

loc-app（dev環境）を Playwright で巡回して発見した、テンプレート未作成のページ一覧。
各ページを個別エージェントに割り振ってテンプレート化する想定。

## ベースURL

- 通常: `https://app.dev.jp.loc-internal.com`

---

## 1. 主要ページ

### 1-1. 横断検索
- **LOC URL**: `/search`
- **タイトル**: 横断検索
- **概要**: キーワード検索ページ。タブ切り替え（すべて/条文/案件/契約書/締結版契約書/自社ひな形/LegalOnテンプレート/その他ファイル）
- **レイアウト**: メイン領域に検索バー + タブ付き検索結果一覧
- [x] テンプレート作成 → `search/index.tsx`

### 1-2. レポート
- **LOC URL**: `/analytics`
- **タイトル**: レポート
- **概要**: 案件統計ダッシュボード。タブ切り替え（案件数/所要時間/現在の業務状況）。グラフ・フィルター付き
- **レイアウト**: タブ + フィルター + 棒グラフ複数セクション
- [x] テンプレート作成 → `dashboard/analytics/index.tsx`

### 1-3. 自社ひな形一覧
- **LOC URL**: `/file/customer-template`
- **タイトル**: 自社ひな形
- **概要**: 自社ひな形ファイルの一覧。DataTable（ファイル名/ひな形タイトル/保存先/追加日時/言語）
- **サービス**: document-management-f
- **レイアウト**: ヘッダー（タイトル + アップロードボタン）+ ツールバー + DataTable
- [x] テンプレート作成 → `file-management/customer-template/index.tsx`

### 1-4. 締結済み契約書一覧
- **LOC URL**: `/file/agreed-contract-document`（実態は `/file?tab=agreedContracts` へのリダイレクト）
- **タイトル**: 契約書（締結版タブ）
- **概要**: 既存 `file-management/index.tsx` の「締結版」タブと同一画面。**独立したテンプレートは不要**
- **サービス**: document-management-f
- [x] 既存 `file-management/index.tsx` でカバー済み（独立テンプレートは作成しない）

### 1-5. 署名依頼テンプレート
- **LOC URL**: 未確認（ナビゲーション「電子契約 > 署名依頼テンプレート」から遷移）
- **概要**: 署名依頼のテンプレート管理ページ
- **サービス**: esign-f
- [ ] URL 確認 → テンプレート作成

---

## 2. 管理者設定 > 組織

### 2-1. ユーザーグループ
- **LOC URL**: `/management-console/user-groups`
- **タイトル**: ユーザーグループ
- **サービス**: management-console-f
- **出力先**: `management-console/user-groups.tsx`
- [x] テンプレート作成

### 2-2. 監査ログ
- **LOC URL**: `/management-console/audit-logs`
- **タイトル**: 監査ログ
- **サービス**: management-console-f
- **出力先**: `management-console/audit-logs.tsx`
- [x] テンプレート作成

---

## 3. 管理者設定 > モジュール > サイン（3ページ）

サイドバー「サイン」配下。`application-console/sign/` に出力。

### 3-1. 差出人企業名
- **LOC URL**: `/application-console/sign/sender-name`
- **タイトル**: 差出人企業名
- **概要**: 差出人企業名の設定フォーム（テキスト入力 + 保存ボタン）
- **サービス**: application-console-f
- [x] テンプレート作成 → `application-console/sign/sender-name/index.tsx`

### 3-2. 署名依頼の保存先
- **LOC URL**: `/application-console/sign/default-space`
- **タイトル**: 署名依頼の保存先
- **サービス**: application-console-f
- [x] テンプレート作成 → `application-console/sign/default-space/index.tsx`

### 3-3. 承認申請フォーム
- **LOC URL**: `/application-console/sign/sign-workflow-form`
- **タイトル**: 承認申請フォーム
- **サービス**: application-console-f
- [x] テンプレート作成 → `application-console/sign/sign-workflow-form/index.tsx`

---

## 4. 管理者設定 > モジュール > コントラクトマネジメント（4ページ）

サイドバー「コントラクトマネジメント」配下。`application-console/contract-management/` に出力。

### 4-1. 契約カスタム項目
- **LOC URL**: `/application-console/contract-management/custom-attribute-definition`
- **タイトル**: 契約カスタム項目
- **概要**: 契約書の管理項目を追加・編集するテーブル（項目名/抽出状況 + 編集/削除ボタン）
- **サービス**: application-console-f
- [x] テンプレート作成 → `application-console/contract-management/custom-attribute-definition/index.tsx`

### 4-2. 管理番号の自動採番
- **LOC URL**: `/application-console/contract-management/inhouse-id-auto-numbering`
- **タイトル**: 管理番号の自動採番
- **サービス**: application-console-f
- [x] テンプレート作成 → `application-console/contract-management/inhouse-id-auto-numbering/index.tsx`

### 4-3. 期限通知
- **LOC URL**: `/application-console/contract-management/notification`
- **タイトル**: 期限通知
- **サービス**: application-console-f
- [x] テンプレート作成 → `application-console/contract-management/notification/index.tsx`

### 4-4. 電子契約サービス連携
- **LOC URL**: `/application-console/contract-management/esign-integration`
- **タイトル**: 電子契約サービス連携
- **サービス**: application-console-f
- [x] テンプレート作成

---

## 補足: SERVICE_MAPPING の URL 差異（対応済み）

以下の URL 差異を修正済み:

| テンプレート | 修正後の LOC Dev URL |
|-------------|-------------------|
| `management-console/slack.tsx` | `/management-console/slack-integration` |
| `management-console/teams.tsx` | `/management-console/teams-integration` |
| `management-console/sso.tsx` | `/management-console/single-sign-on` |

## 補足: SERVICE_MAPPING 未記載のテンプレート（追記済み）

以下を SERVICE_MAPPING.md に追加済み:

- `loa/playbook/index.tsx` → `/assistant/playbook`
- `loa/prompt-library/index.tsx` → `/assistant/prompt-library`
