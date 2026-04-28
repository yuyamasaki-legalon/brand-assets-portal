# 案件詳細画面リフレッシュ 仕様書

## 1. 概要

### 1.1 目的
案件詳細ページを刷新し、依頼内容・案件情報・タイムライン（メッセージ・スレッド）を一画面で扱いやすくする。

### 1.2 対象画面
- **ルート**: `/sandbox/juna-kondo/case-detail-refresh`
- **実装**: `src/pages/sandbox/users/juna-kondo/case-detail-refresh/index.tsx`

### 1.3 主な機能
- 依頼内容・案件情報の表示・編集入口
- **メッセージの項**: タイムライン表示、スレッド/メッセージ表示、LOメッセージ送信
- **公開・非公開設定**: タブによる絞り込み、送信時の公開設定、既存メッセージの公開変更
- **タブの切り替え**: 検証用に「すべて・公開・非公開」の3タブ／2タブ／1タブを切り替え可能
- **コミュニケーションツールのフィルター**: LOメッセージ／Slack／Teams／メール／活動履歴の表示オンオフ
- 新規: メール作成、Slackスレッド作成、Teamsスレッド作成

---

## 2. 画面構成

### 2.1 レイアウト
- **Sidebar**（左）: ホーム・案件・レビュー・契約書等のナビゲーション
- **Header**（上）: メニュー、案件タイトル・ID、前後ナビ、検索、**言語プルダウン**、**3点リーダーメニュー**（タブの検証用プルダウンのみ）
- **メイン**: PageLayoutContent（maxWidth: medium）
  - 依頼内容カード
  - 案件情報（右端サイドタブで開く）
  - **メッセージの項**（下記）
- **固定下部**: メッセージ入力エリア（新規ボタン・ツールバー・テキストエリア・公開設定・送信）

### 2.2 言語
- ヘッダー右の **Select** で「日本語」「English」を切り替え（`locale`: `ja-JP` / `en-US`）。
- 案件データ・コメント・ラベル・ボタン文言は locale に応じて切り替わる。

---

## 3. メッセージの項

### 3.1 表示対象
- **メッセージ種別（MessageType）**: `lo-message` | `slack` | `teams` | `mail` | `active-history`
- 各メッセージは **visibility**: `public` | `private` を持つ。
- スレッドを持つものは `threadId`・`parentId` で紐づく。LOメッセージはスレッドに属さない。

### 3.2 表示モード（内部 state: messageViewType）
- **threads（スレッドビュー）**
  - メールスレッド: 複数ある場合は「最新の1スレッド」のみルートメッセージをタイムラインに表示。他は「関連スレッド」等で参照可能。
  - Slack/Teams スレッド: 各スレッドのルートメッセージを1件ずつ表示。
  - LOメッセージ: スレッドに属さないため、個別に1件ずつ表示。
- **messages（メッセージビュー）**
  - スレッドに「属さない」メッセージ＋LOメッセージをフラットに表示。メールは最新1スレッドのルートのみ対象とする扱い。

※ 現状UIでは「スレッド／メッセージ」の切り替えボタンはなく、スレッド選択時は「スレッド詳細」表示となり、「全てのスレッド一覧に戻る」で threads 表示に戻る。

### 3.3 フィルタ適用順
1. **スレッド選択時**: `selectedThreadId` が設定されていれば、そのスレッドに属するメッセージのみ表示（LOメッセージは除外）。
2. **messageViewType**: 上記の threads / messages ロジックで一覧を組み立てる。
3. **日付**: 最新が上になるようソート。
4. **タブ（activeTab）**: 「すべて」以外のとき、`comment.visibility === activeTab` で絞り込み。
5. **表示設定（displaySettings）**: 種別ごとのオンオフで絞り込み（後述）。

### 3.4 タイムラインの表示形式（種別ごと）
- **メール**: 件名・送信者・日時・本文。スレッド内返信は階層表示。公開/非公開の Select と 3点リーダーあり。
- **Slack**: 「#general内のスレッド」＋公開/非公開 Select ＋ 3点リーダー。カードは白・角丸・細枠。カード内: LOTロゴ（LotLogoSymbolDark）＋ LegalOn ＋ 日時、「← 返信」ボタン、本文「案件のスレッドが作成されました。[スレッドに返信] から返信してください。」、案件番号・案件名・依頼者。
- **Teams**: ヘッダーに LegalOn ロゴ＋日時＋「Teamsで開く」ボタン。スレッド内容表示。
- **LOメッセージ**: 送信者・日時・本文。公開/非公開の切り替えと 3点リーダーあり。
- **活動履歴（active-history）**: 仕様上はフィルター対象に含まれるが、表示形式の詳細は実装依存。

### 3.5 スレッド詳細表示
- スレッドを選択すると、そのスレッドに属するコメントのみを時系列で表示。
- メールスレッド選択時: 「全てのスレッド一覧に戻る」「スレッド内のすべてのメールを見る」等の操作が可能。
- 戻る操作で `selectedThreadId` を null にし、一覧表示に戻る。

### 3.6 メッセージ入力エリア
- **配置**: メッセージの項の直下に固定（PageLayoutStickyContainer 内）。
- **ツールバー**: 太字・斜体・下線・リスト・メンション・添付ファイルのアイコンボタン（現状は見た目のみ）。
- **テキストエリア**: プレースホルダー「メッセージを入力」（messagePlaceholder）。タブごとに入力内容を保持（`messageValues[activeTab]`）。
- **公開設定**: activeTab が「すべて」のときのみ、公開/非公開を選ぶプルダウンを表示（4.2 参照）。
- **送信ボタン**: 入力が空のときは disabled。クリックで `handleSendMessage` を実行し、LOメッセージとして `commentsState` の先頭に追加。該当タブの入力欄はクリアする。

---

## 4. 公開・非公開設定

### 4.1 タブ（すべて・公開・非公開）
- **TabType**: `all` | `public` | `private`
- タブは「タブの検証」モード（後述）に応じて 1〜3 本表示される。
- 選択中のタブに応じたメッセージのみがタイムラインに表示される（4.2 と連動）。

### 4.2 タブと送信時の公開設定の連動
- **activeTab === "public"**: 送信時のデフォルトは「公開」。公開設定用のプルダウンは**非表示**。
- **activeTab === "private"**: 送信時のデフォルトは「非公開」。公開設定用のプルダウンは**非表示**。
- **activeTab === "all"**: 送信時の公開設定はユーザーが選択。公開設定用の**プルダウンを表示**（「公開」「非公開」を選択可能）。
- プルダウンは `placement="bottom-start"` で下方向に開く。

### 4.3 送信ボタンのラベル
- 公開タブ選択時: 「公開で送信」（sendAsPublic）
- 非公開タブ選択時: 「非公開で送信」（sendAsPrivate）
- すべてタブ選択時: 「送信」（send）

### 4.4 既存メッセージの公開設定変更
- 各メッセージ（またはスレッドヘッダー）に **Select** で「公開」「非公開」を表示。
- **非公開 → 公開** に変更するときのみ、確認ダイアログを表示する。
  - 文言例: 「スレッドを公開しますか?」「公開設定を変更すると、今後作成されるスレッドのデフォルト設定が公開になります。」「既存のスレッドの公開設定は変更されません。」
- スレッドに属するメッセージの場合は、**スレッド内の全メッセージを一括**で同じ公開設定に変更する。
- 公開→非公開、または同じ値への変更は確認なしで即時反映。

### 4.5 新規LOメッセージの公開
- 送信時に `visibilitySetting`（public / private）をコメントに付与して保存。
- タブが「公開」「非公開」のときは、そのタブの設定がそのまま使われる（プルダウン非表示のため、ユーザーが選ぶのは「すべて」タブ時のみ）。

---

## 5. タブの切り替え（タブの検証）

### 5.1 目的
UI検証用に、タブの本数と組み合わせを切り替えられるようにする。

### 5.2 設定場所
- ヘッダー右の **3点リーダーメニュー** を開く。
- メニュー内の **「タブの検証」** 見出しの下に **Select** プルダウンを配置。
- 選択肢:
  - **デフォルト（3タブ）**: 「すべて」「公開」「非公開」の3本。
  - **タブ 1（1タブ）**: 「すべて」のみ。公開・非公開タブは非表示。
  - **タブ 2（2タブ）**: 「すべて」「公開」の2本。非公開タブは非表示。

### 5.3 モード変更時の挙動
- **2タブまたは1タブに切り替えたとき**、現在「非公開」タブを選択していた場合は、自動で「すべて」にリセットする。
- タブの表示は `tabVerificationMode` に応じて Tab.List の内容を出し分けする。

### 5.4 状態
- `tabVerificationMode`: `"3tabs"` | `"2tabs"` | `"1tab"`
- Tab.Group の `key={tabVerificationMode}` で、モード切り替え時にコンポーネントを再マウントし、defaultIndex を正しく反映する。

---

## 6. コミュニケーションツールのフィルター（表示設定）

### 6.1 概要
タイムラインに表示するメッセージを**種別**で絞り込む。ON/OFF は「表示設定」ポップオーバー内のチェックボックスで行う。

### 6.2 設定場所
- メッセージの項の上部、タブや「新規」ボタンがある行の右側に **表示設定** アイコン（フィルターアイコン）を配置。
- クリックで **Popover** を開く。`placement="bottom-end"`。

### 6.3 表示設定の項目（displaySettings）
| キー | 説明（日本語） | 説明（英語） | 対象 MessageType |
|------|----------------|--------------|------------------|
| allSelected | 全てを選択 | Select all | 一括ON/OFF |
| loMessage | LOメッセージ | LO Message | lo-message |
| slack | Slack | Slack | slack |
| teams | Microsoft Teams | Microsoft Teams | teams |
| mail | メール | Mail | mail |
| activeHistory | 活動履歴 | Active history | active-history |

### 6.4 動作
- **「全てを選択」** にチェック: 上記5種別をすべて ON にする。外すとすべて OFF。
- 個別のチェックを変更したとき、5種別がすべて ON なら「全てを選択」も ON、そうでなければ OFF に同期する。
- `filteredComments` の計算で、各 `comment.type` に対応する `displaySettings` のフラグが false のメッセージは表示リストから除外する。

### 6.5 初期値
- すべて true（すべて表示）。

---

## 7. 新規作成（メール・Slack・Teams）

### 7.1 入口
- メッセージ入力エリアの左側に **「新規」** ボタン（Menu）。クリックでドロップダウンを表示。
- ドロップダウン内は **ActionList** で以下の3項目:
  1. **Compose a new email**（新規メールを作成）: メール作成ダイアログを開く。
  2. **Create a new Slack thread**（Slackに案件のスレッドを作成）: Slackスレッド作成ダイアログを開く。
  3. **Create a new Teams thread**（Teamsに案件のスレッドを作成）: Teamsスレッド作成ダイアログを開く。

### 7.2 メール作成
- ダイアログで 送信元・宛先・CC・件名・本文 を入力（状態: mailSender, mailTo, mailCc, mailSubject, mailBody）。
- 送信はモック（状態更新や一覧への追加は実装依存）。作成中は `mailComposeOpen` で開閉を制御。

### 7.3 Slackスレッド作成
- ダイアログで以下を設定:
  - スレッドを作成するSlackチャンネル（Select / 検索）
  - スレッド作成の通知先（Slackアカウント）
  - 公開/非公開（Slack用の visibility）
- バリデーション: チャンネル未選択時はエラーメッセージを表示（selectSlackChannelError）。
- 確定後、モックとして該当スレッドのルートメッセージがタイムラインに追加される想定（実装で commentsState に追加するかは任意）。

### 7.4 Teamsスレッド作成
- Slackと同様、チャンネル・通知先・公開/非公開を設定するダイアログ。
- 文言は「Teamsに案件のスレッドを作成」「Teamsチャンネルを設定し、本案件のTeamsスレッドを作成します。」等。

---

## 8. 共有ユーザー（メッセージの項まわり）

### 8.1 表示
- タブの右隣に **共有ユーザー** アイコン（Icon-Aegis.svg を採用、xSmall）。クリックで Popover を開く。
- Popover 内: 「共有中のユーザー」タイトル、説明、Standard/Pro のライセンス別ユーザー一覧、「共有ユーザーを設定」ボタン。
- 「共有ユーザーを設定」で別ダイアログを開き、ユーザー・ユーザーグループの検索・選択が可能（モックデータ: getSharedUsers, getAvailableUsers）。

---

## 9. データモデル・型（抜粋）

### 9.1 Comment
```ts
interface Comment {
  id: string;
  type: "lo-message" | "slack" | "teams" | "mail" | "active-history";
  user: string;
  date: string;
  content: string;
  visibility: "public" | "private";
  subject?: string;
  channel?: string;
  threadId?: string;
  parentId?: string;
  hasAttachment?: boolean;
}
```

### 9.2 主要 state
- `activeTab`: TabType（すべて/公開/非公開）
- `messageViewType`: "threads" | "messages"
- `tabVerificationMode`: "3tabs" | "2tabs" | "1tab"
- `messageValues`: Record<TabType, string>（タブ別入力テキスト）
- `visibilitySetting`: "public" | "private"（送信時の公開設定）
- `displaySettings`: { allSelected, loMessage, slack, teams, mail, activeHistory }
- `commentsState`: Comment[]
- `selectedThreadId`: string | null（スレッド詳細表示用）

---

## 10. 多言語対応

### 10.1 対象
- ラベル、ボタン、プレースホルダー、ダイアログ文言、エラーメッセージは `useTranslation` で `ja-JP` / `en-US` を切り替え。
- 案件データ・コメント本文・ユーザー名等は `getCaseData(locale)` や `getComments(locale)` 等で locale に応じたモックを返す。

### 10.2 言語切り替え
- ヘッダーの **言語 Select** で「日本語」「English」を選択。3点リーダー内には言語選択は含めない（外に出す）。

---

## 11. アイコン・ロゴ

- **Slackメッセージカード内の送信元アイコン**: LotLogoSymbolDark（22×24）。LOT logo symbol dark を使用。
- **共有ユーザーアイコン**: Icon-Aegis.svg（16×16、xSmall）。Members 用として採用。
- **新規メニュー内**: Slackは SlackLogo、Teamsは MicrosoftTeamsIcon を表示。

---

## 12. 備考

- 本仕様はサンドボックス「案件詳細リフレッシュ」の現状実装に基づく。実際のプロダクトに組み込む場合は、API・権限・バリデーション・エラーハンドリング等を別途定義すること。
- タブの検証モード（3タブ/2タブ/1タブ）は検証・デモ用であり、本番では通常「3タブ」固定とする想定でよい。
