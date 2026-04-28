---
name: loc-sync
description: "lib/loc-app の UI を Aegis テンプレートに同期。WHEN: loc-app の既存画面を Aegis で再現・更新する指示があるとき。モード自動選択: full（初回 or 大幅変更）, incremental（部分更新）, patch（テキスト修正のみ）, visual-compare（LOC Dev との見た目比較ループ）。NOT WHEN: sandbox の新規作成（→ sandbox-creator）、loc-app 以外のサービス。引数: [mode] {service-name} {page-path} or visual-compare {entry-key}"
disable-model-invocation: true
---

# LOC Sync

lib/loc-app のフロントエンドサービスの UI を読み取り、Aegis コンポーネントで再現・更新する。

## 使用方法

```bash
# 自動モード選択（drift detector の結果に基づく）
/loc-sync legal-management-f index

# モード明示
/loc-sync full legal-management-f index
/loc-sync incremental legal-management-f index
/loc-sync patch legal-management-f index

# ビジュアル比較ループ（LOC Dev との見た目比較）
/loc-sync visual-compare {entry-key}

# drift レポート表示（スクリプト呼び出し）
# pnpm loc-sync:drift
```

---

## 同期モード

| モード | 用途 | 読み込み量 | drift レベル |
|--------|------|-----------|-------------|
| `full` | 全再生成 | ページ + 全 parts | MAJOR |
| `incremental` | 差分更新 | diff のファイルのみ + 現テンプレート | MINOR |
| `patch` | テキスト/ラベル更新 | messages.csv の差分のみ | COSMETIC |

---

## 実行手順

### Step 0: モード決定

1. `$ARGUMENTS` を解析: `[mode] {service} {page-path}`
2. mode が省略された場合:
   - SERVICE_MAPPING.md で {service} のテンプレートディレクトリを特定し、
     {page-path} と結合してマニフェストのエントリキーを構築する
     （例: `esign-f` + `envelope-list` → `esign/envelope-list.tsx`）
   - エントリキーが特定できた場合:
     `pnpm loc-sync:drift -- --entry {entry-key} --json` を実行
   - page-path が省略された場合:
     `pnpm loc-sync:drift -- --service {service} --json` を実行
   - drift レベルに基づきモードを自動選択:
     - MAJOR → `full`
     - MINOR → `incremental`
     - COSMETIC → `patch`
     - NONE → 「最新です」と報告して終了

### Step 1: マニフェスト読み取り

**ファイル:** `src/pages/template/loc/.sync-manifest.json`

1. SERVICE_MAPPING.md でテンプレートパスを特定
2. マニフェストから `lastSyncedCommit`, `locPartsGlobs` を取得
3. 新規テンプレートの場合は `full` モードにフォールバック

**サービス一覧:**
- legal-management-f, application-console-f, case-reception-form-f
- esign-f, document-management-f, review-console-f
- dashboard-f, personal-settings-f, legalon-template-f
- management-console-f, root-f, word-addin-f

---

## Full モード（全再生成）

既存の動作を改善。マニフェストの `locPartsGlobs` で読み込み範囲を限定。

### Step F1: ソース読み取り（範囲限定）

| 対象 | パス |
|------|-----|
| ページ | `lib/loc-app/services/{service}/src/{locPagePath}/` |
| 部品 | `lib/loc-app/services/{service}/src/{locPartsGlobs}` |

**重要:** `parts/` 全体を読むのではなく、マニフェストの `locPartsGlobs` で指定されたディレクトリのみ読む。

### Step F2: UI 構造を分析

読み取ったソースから抽出:
- レイアウト構成（Sidebar, PageLayout, Pane）
- 使用コンポーネント（Table, Tab, Form, etc.）
- 画面の見た目・配置

**注意:** データ型、API 呼び出し、ビジネスロジックは無視する。

### Step F3: Aegis で再構築

- `@legalforce/aegis-react` のコンポーネントのみ使用
- スタイルは Aegis デザイントークンを使用
- モックデータはシンプルな固定値でOK

### Step F4: ファイル生成

**出力先:** `SERVICE_MAPPING.md` を参照

```
src/pages/template/loc/{mapped-path}/index.tsx
```

**ルート登録:** 新規ページの場合は `src/pages/template/routes.tsx` を更新

---

## Incremental モード（差分更新）★最重要

### Step I1: 差分取得

```bash
cd lib/loc-app
git diff {lastSyncedCommit}..HEAD -- {sourcePaths}
```

`sourcePaths` はマニフェストの `locPagePath` + `locPartsGlobs` から構築。

### Step I2: 変更ファイル読み取り

差分のあったファイル**のみ**を読む（全 parts を読まない）。
加えて、現在のテンプレートファイルも読む。

### Step I3: 差分の影響を分析

変更内容を分類:
- **レイアウト変更**: コンポーネント構成の変更 → テンプレートのJSX構造を更新
- **カラム追加/削除**: Table 定義の変更 → テンプレートの Table カラム定義を更新
- **フォームフィールド変更**: フォーム構成の変更 → テンプレートの FormControl を更新
- **コンポーネント差し替え**: 使用コンポーネントの変更 → Aegis の対応コンポーネントに差し替え
- **テキスト変更**: ラベル・メッセージの変更 → テンプレートのテキストを更新

### Step I4: テンプレート部分更新

現在のテンプレートをベースに、差分に基づいて**部分的に**更新。
全体を再生成しない。変更が必要な箇所のみ修正する。

---

## Patch モード（テキスト/ラベル更新）

### Step P1: messages.csv 差分取得

`sourcePaths` はマニフェストの `locPagePath` + `locPartsGlobs` から構築（incremental モードと同じ）。
その中から `*.csv` ファイル（messages CSV 等の翻訳・ラベルリソース）のみ対象にする:

```bash
cd lib/loc-app
# sourcePaths = buildSourcePaths(entry) と同じロジック
git diff {lastSyncedCommit}..HEAD -- {sourcePaths}
# → 結果を *.csv のみにフィルタ
```

### Step P2: ラベル更新

差分のあった CSV エントリに対応するテンプレート内のテキストを機械的に更新。

---

## 共通: Step 最終: マニフェスト更新

**全モード共通で必ず実行:**

同期完了後、`.sync-manifest.json` のエントリを更新:
- `lastSyncedCommit`: `lib/loc-app` の現在の HEAD
- `lastSyncedDate`: 現在の ISO 8601 タイムスタンプ

```bash
cd lib/loc-app && git rev-parse HEAD
```

新規テンプレートの場合はエントリを追加。

---

## Visual Comparison Loop（LOC Dev との見た目比較）

LOC Dev 環境と aegis-lab テンプレートを **構造（a11y スナップショット）+ ビジュアル（ピクセルスクリーンショット）** の 2 層で比較し、差分を検出→修正→再確認のループで見た目を一致させる。

**単独実行:** `/loc-sync visual-compare {entry-key}`
**同期後オプション:** full / incremental モード完了後に追加実行可能
**設定ファイル:** `skills/loc-sync/visual-compare-config.json`（無視要素・tolerance・スクリーンショット設定）

### Step V1: LOC Dev ログイン

1. `browser_navigate` → `https://app.dev.jp.loc-internal.com/`
2. `browser_snapshot` でログイン状態を確認
3. 未ログインなら:
   - Keychain からパスワード取得: `security find-generic-password -s "loc-dev" -a "loc-dev-user" -w`
   - `browser_fill_form` でログインフォームに入力 → 送信
4. セッション切れ対策: 各 `browser_navigate` 後にログインリダイレクトを検知し、必要なら再ログイン

### Step V2: LOC Dev スナップショット取得

1. SERVICE_MAPPING.md の「LOC Dev URL マッピング」から対象ページの LOC Dev パスを取得
2. `browser_navigate` → `https://app.dev.jp.loc-internal.com{locDevPath}`
3. `visual-compare-config.json` の `globalHideSelectors` に該当する要素を非表示にする CSS を inject:
   ```javascript
   browser_evaluate({
     expression: `document.querySelectorAll('${selectors.join(",")}').forEach(el => el.style.display = 'none')`
   })
   ```
4. ページの描画完了を待機（`visual-compare-config.json` の `screenshot.waitForSelector` / `screenshot.waitTimeout` を参照）
5. `browser_snapshot` → LOC Dev **構造スナップショット** として保持
6. `browser_take_screenshot` → LOC Dev **ピクセルスクリーンショット** として保持

### Step V3: aegis-lab スナップショット取得

1. `.sync-manifest.json` の `templateRoute` から URL 構築
2. `browser_navigate` → `http://localhost:5173{templateRoute}`
3. FloatingSourceCodeViewer + `globalHideSelectors` の要素を非表示にする CSS を inject
4. ページの描画完了を待機
5. `browser_snapshot` → aegis-lab **構造スナップショット** として保持
6. `browser_take_screenshot` → aegis-lab **ピクセルスクリーンショット** として保持

### Step V4: 差分分析（2 層比較）

#### Layer 1: 構造比較（a11y スナップショット）

2つの a11y スナップショットを比較し、以下の観点で差分を検出:

| 比較観点 | 説明 |
|---------|------|
| 要素階層 | DOM 構造の深さ・ネスト |
| コンポーネント種別 | table, list, nav, form 等 |
| テキストコンテンツ | ラベル、見出し、ボタンテキスト |
| 要素の順序 | 兄弟要素の並び順 |
| ARIA ロール | ロール属性の一致 |

#### Layer 2: ビジュアル比較（ピクセルスクリーンショット）

2 枚のスクリーンショットを Read ツールで読み込み、マルチモーダル vision で以下の観点を比較:

| カテゴリ | 具体例 |
|---------|-------|
| レイアウト配置 | 要素の位置、Flex/Grid 方向、カラム数 |
| スペーシング | margin/padding/gap の差異 |
| タイポグラフィ | フォントサイズ、ウェイト、行間 |
| 色・背景 | 背景色、テキスト色、ボーダー色 |
| コンポーネントサイズ | ボタン高さ、入力幅、テーブル列幅 |
| 欠落・過剰要素 | アイコン、バッジ、ディバイダー |
| アイコンの形状 | 各ナビゲーション項目・ボタン・カードのアイコンが一致しているか |

#### Layer 3: ソースコード照合（lib/loc-app）

ピクセル比較でアイコンやコンポーネントの差異が疑われる場合、`lib/loc-app/` のソースコードを直接確認して正確なアイコン名・Props を特定する:

1. `.sync-manifest.json` の `locService` と `locPagePath` から対象ファイルを特定
2. アイコンの差異: `lib/loc-app/` 内の該当コンポーネントで `import` されているアイコン名を grep で確認
3. サイドバー: `lib/loc-app/libraries/frontend/loc-common-frontend/src/components/GlobalSidebar/` のアイコンマッピングを参照
4. コンポーネント Props: LOC Dev で使用されている variant / size / color を特定

**重要:** スクリーンショットだけでは解像度の問題でアイコン差異を見逃しやすい。差分を疑ったら必ず lib/loc-app のソースを確認すること。

#### 差分の統合と優先度

Layer 1 と Layer 2 の結果を統合し、以下の優先度で修正順序を決定:

1. **構造**（要素の欠落・過剰） — Layer 1 で検出
2. **レイアウト配置**（位置・方向の違い） — Layer 2 で検出
3. **スペーシング**（余白・間隔の差異） — Layer 2 で検出
4. **コンポーネントサイズ・タイポグラフィ** — Layer 2 で検出
5. **色・背景** — Layer 2 で検出
6. **テキスト・順序** — Layer 1 で検出

#### 無視してよい差分

- LOC Dev 固有要素（ヘルプチャット、アナリティクス、feature flag バナー）
- 実データ vs モックデータの内容差（構造が同じならOK）
- aegis-lab の FloatingSourceCodeViewer
- Intercom ウィジェット
- Aegis コンポーネント固有のレンダリング微差（角丸、影、フォーカスリングの微妙な違い）
- アニメーション・トランジション状態の差
- スクロールバーの有無

### Step V5: テンプレート修正

1. 差分を Step V4 の優先度順にソート
2. `src/pages/template/loc/{path}/index.tsx` を修正
3. Aegis コンポーネント + デザイントークンの制約内で再現
4. ビジュアル差分の場合、CSS module またはインラインスタイルで spacing/color を調整

### Step V6: 再スナップショット・再比較（ループ）

1. aegis-lab ページを再 `browser_navigate`（ホットリロード反映待ち）
2. `browser_snapshot` → 新 **構造スナップショット**
3. `browser_take_screenshot` → 新 **ピクセルスクリーンショット**
4. Step V4 を再実行（2 層比較）
5. 差分が許容範囲内なら終了、そうでなければ Step V5 へ
6. **最大 5 回ループ**（収束しなければ残差分をユーザーに報告）

### Step V7: 参照スナップショット保存

1. LOC Dev の構造スナップショットを `.reference-screenshots/{entry-key}.a11y-snapshot.txt` に保存
2. LOC Dev のピクセルスクリーンショットを `.reference-screenshots/{entry-key}.png` に保存（ローカル専用、git 追跡なし）
3. `.sync-manifest.json` の該当エントリの `referenceScreenshot` フィールドを更新:
   ```json
   "referenceScreenshot": "{entry-key}.png"
   ```

### Step V8: 完了報告

以下をサマリーとして報告:
- 検出された差分の総数（構造 / ビジュアル 別）
- 修正した項目の一覧（どの Layer で検出されたか付記）
- 残存する差分（あれば）
- ループ回数

---

## 出力テンプレート

```tsx
import { /* Aegis コンポーネント */ } from "@legalforce/aegis-react";
import { /* アイコン */ } from "@legalforce/aegis-icons";
import { useState } from "react";

// シンプルなモックデータ
const items = [
  { id: "1", name: "サンプル1" },
  { id: "2", name: "サンプル2" },
];

export const {PageName}Template = () => {
  return (
    // UI 構造をそのまま再現
  );
}
```

---

## マッピング

`SERVICE_MAPPING.md` を参照。

主なマッピング:
- `legal-management-f` → `case/`
- `application-console-f` → `application-console/`
- `esign-f` → `esign/`

---

## Automation Mode（RemoteTrigger 用）

RemoteTrigger から自動実行される場合のガイダンス。

### 自動実行フロー

1. `pnpm loc-sync:auto` を実行して同期プラン JSON を取得
2. プランが空（`servicePlans: []`）なら「全て最新」と報告して終了
3. サービスごとに以下を順次実行:
   a. **各サービスの開始時に `git checkout main` を実行** — 各ブランチを main から切るため。前のサービス用ブランチから分岐すると PR に別サービスの変更が混ざる
   b. `git checkout -b {plan.branch}` でブランチ作成
   c. 各エントリに対して `/loc-sync {entry.mode} {entry.locService} {entry.locPagePath}` を実行
   d. 成功したファイルを `git add -A` + `git commit`（`-u` ではなく `-A`。`full` モードで生成される新規ファイルが漏れる）
   e. 失敗したエントリはスキップ（manifest 未更新 → 次回リトライ）
   f. **Visual Compare**（Phase 3）: `/loc-sync visual-compare {entry.entryKey}` で LOC Dev と比較、差分があれば修正して追加 commit
   g. **PR 作成 or 更新**（どちらかを必ず実行する。silent skip はコミット喪失の原因）:
      - 既存 PR 確認: `gh pr list --label auto-loc-sync --search "{service}" --state open --json number,headRefName`
      - **既存 PR なし**: `git push -u origin {plan.branch}` → `gh pr create --title "auto(loc-sync): sync {service} templates ({date})" --label auto-loc-sync --body "{drift report}"`
      - **既存 PR あり**: その head branch 名を JSON から取得 → `SYNC_COMMITS=$(git rev-list --reverse "${MAIN_SHA}..HEAD")` で plan branch 上の全コミットを順序付きで退避 → `test -n "$SYNC_COMMITS"` → `git fetch origin {existing-head}` → `git checkout {existing-head}` (ローカルになければ `git checkout -b {existing-head} origin/{existing-head}`) → `git branch -D {plan.branch}` → `git cherry-pick $SYNC_COMMITS` → `git push origin {existing-head}` → PR に今回の追加内容を comment で投稿
      - push に失敗した場合（conflict/auth）は **hard failure として報告**。local コミットを捨てずに次サービスへ進む
   h. **次のサービスに進む前に `git checkout main`** — 次ブランチを main から切るため
4. 結果サマリーを報告

### Commit メッセージ規約

```
auto(loc-sync): sync {service} templates

Drift level: {MAJOR|MINOR|COSMETIC}
Entries synced:
- {entryKey} ({mode})
- {entryKey} ({mode})
```

### PR 作成フォーマット

```
## Auto LOC Sync: {service}

### Synced Entries
| Entry | Mode | Drift Level |
|-------|------|-------------|
| `{entryKey}` | {mode} | {driftLevel} |

### Skipped Entries (if any)
| Entry | Reason |
|-------|--------|
| `{entryKey}` | {error message} |

### Visual Comparison
- {entry}: OK / {N} differences found and fixed
```

### 重複防止

PR 作成前に `gh pr list --label auto-loc-sync --search "{service}"` で既存 PR をチェック。
既存 PR がある場合は新規作成せず、既存 PR のブランチに同期コミットを cherry-pick して push する（詳細は上記 Step 3g を参照）。

---

## 参考資料

- [references/operational-knowledge.md](references/operational-knowledge.md) - 運用ナレッジ（ハマりポイント、モード選択ガイド、トラブルシューティング）

## 関連スキル

- `/page-layout-assistant` - レイアウトパターン
- `/component-tips` - コンポーネント使用方法
