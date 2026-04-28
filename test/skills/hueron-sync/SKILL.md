---
name: hueron-sync
description: "lib/hueron-app の UI を Aegis テンプレートに同期。WHEN: hueron-app の既存画面を Aegis で再現・更新する指示があるとき。モード自動選択: full（初回 or 大幅変更）, incremental（部分更新）, visual-compare（Staging との見た目比較ループ）。NOT WHEN: sandbox の新規作成（→ sandbox-creator）、hueron-app 以外のサービス。引数: [mode] {page-path} or visual-compare {entry-key}"
disable-model-invocation: true
---

# Hueron Sync

lib/hueron-app のフロントエンド UI を読み取り、Aegis コンポーネントで再現・更新する。

## 使用方法

```bash
# 自動モード選択（drift detector の結果に基づく）
/hueron-sync procedure

# モード明示
/hueron-sync full procedure
/hueron-sync incremental procedure

# ビジュアル比較ループ（Staging との見た目比較）
/hueron-sync visual-compare {entry-key}

# drift レポート表示（スクリプト呼び出し）
# pnpm hueron-sync:drift
```

---

## 同期モード

| モード | 用途 | 読み込み量 | drift レベル |
|--------|------|-----------|-------------|
| `full` | 全再生成 | ページ + 関連ファイル | MAJOR |
| `incremental` | 差分更新 | diff のファイルのみ + 現テンプレート | MINOR |

---

## 実行手順

### Step 0: モード決定

1. `$ARGUMENTS` を解析: `[mode] {page-path}`
2. mode が省略された場合:
   - PAGE_MAPPING.md で {page-path} のテンプレートディレクトリを特定し、
     マニフェストのエントリキーを構築する
     （例: `procedure` → `procedure/index.tsx`）
   - エントリキーが特定できた場合:
     `pnpm hueron-sync:drift -- --entry {entry-key} --json` を実行
   - page-path が省略された場合:
     `pnpm hueron-sync:drift -- --json` を実行
   - drift レベルに基づきモードを自動選択:
     - MAJOR → `full`
     - MINOR → `incremental`
     - NONE → 「最新です」と報告して終了

### Step 1: マニフェスト読み取り

**ファイル:** `src/pages/template/workon/.sync-manifest.json`

1. PAGE_MAPPING.md でテンプレートパスを特定
2. マニフェストから `lastSyncedCommit`, `relatedGlobs` を取得
3. 新規テンプレートの場合は `full` モードにフォールバック

---

## Full モード（全再生成）

### Step F1: ソース読み取り（範囲限定）

| 対象 | パス |
|------|-----|
| ページ | `lib/hueron-app/frontend/apps/main/src/app/{pagePath}/` |
| 関連ファイル | `lib/hueron-app/frontend/apps/main/src/app/{relatedGlobs}` |

**重要:** アプリ共通の `app/_components/` 等は読まない。マニフェストの `relatedGlobs` で指定されたページ固有ディレクトリのみ読む。

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

**出力先:** `PAGE_MAPPING.md` を参照

```
src/pages/template/workon/{mapped-path}/index.tsx
```

**ルート登録:** 新規ページの場合は `src/pages/template/routes.tsx` を更新

---

## Incremental モード（差分更新）★最重要

### Step I1: 差分取得

```bash
cd lib/hueron-app
git diff {lastSyncedCommit}..HEAD -- {sourcePaths}
```

`sourcePaths` はマニフェストの `pagePath` + `relatedGlobs` から構築。

### Step I2: 変更ファイル読み取り

差分のあったファイル**のみ**を読む（全関連ファイルを読まない）。
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

## 共通: Step 最終: マニフェスト更新

**全モード共通で必ず実行:**

同期完了後、`.sync-manifest.json` のエントリを更新:
- `lastSyncedCommit`: `lib/hueron-app` の現在の HEAD
- `lastSyncedDate`: 現在の ISO 8601 タイムスタンプ

```bash
cd lib/hueron-app && git rev-parse HEAD
```

新規テンプレートの場合はエントリを追加。

---

## Visual Comparison Loop（Staging との見た目比較）

Staging 環境と aegis-lab テンプレートのアクセシビリティスナップショットを比較し、差分を検出→修正→再確認のループで見た目を一致させる。

**単独実行:** `/hueron-sync visual-compare {entry-key}`
**同期後オプション:** full / incremental モード完了後に追加実行可能

### Step V1: Staging ログイン

1. `browser_navigate` → `https://stg.workon-dev.com/`
2. `browser_snapshot` でログイン状態を確認
3. 未ログインなら:
   - Keychain からメールアドレス取得: `security find-generic-password -s "workon-stg" -a "workon-stg-email" -w`
   - Keychain からパスワード取得: `security find-generic-password -s "workon-stg" -a "workon-stg-password" -w`
   - `browser_fill_form` でメール・パスワード入力 → 送信
4. セッション切れ対策: 各 `browser_navigate` 後にログインリダイレクトを検知し、必要なら再ログイン

### Step V2: Staging スナップショット取得

1. PAGE_MAPPING.md の「Staging URL マッピング」から対象ページの Staging パスを取得
2. `browser_navigate` → `https://stg.workon-dev.com{stagingPath}`
3. `browser_snapshot` → Staging スナップショットとして保持

### Step V3: aegis-lab スナップショット取得

1. `.sync-manifest.json` の `templateRoute` から URL 構築
2. `browser_navigate` → `http://localhost:5173{templateRoute}`
3. `browser_snapshot` → aegis-lab スナップショットとして保持

### Step V4: 差分分析

2つのスナップショットを比較し、以下の観点で差分を検出:

| 比較観点 | 説明 |
|---------|------|
| 要素階層 | DOM 構造の深さ・ネスト |
| コンポーネント種別 | table, list, nav, form 等 |
| テキストコンテンツ | ラベル、見出し、ボタンテキスト |
| 要素の順序 | 兄弟要素の並び順 |
| ARIA ロール | ロール属性の一致 |

**無視してよい差分:**
- Staging 固有要素（ヘルプチャット、アナリティクス、feature flag バナー）
- 実データ vs モックデータの内容差（構造が同じならOK）
- aegis-lab の FloatingSourceCodeViewer
- Intercom ウィジェット

### Step V5: テンプレート修正

1. 差分を重要度順にソート: 構造 > コンポーネント種別 > テキスト > 順序
2. `src/pages/template/workon/{path}/index.tsx` を修正
3. Aegis コンポーネント + デザイントークンの制約内で再現

### Step V6: 再スナップショット・再比較（ループ）

1. aegis-lab ページを再 `browser_navigate`（ホットリロード反映待ち）
2. `browser_snapshot` → 新スナップショット
3. Step V4 を再実行
4. 差分が許容範囲内なら終了、そうでなければ Step V5 へ
5. **最大 5 回ループ**（収束しなければ残差分をユーザーに報告）

### Step V7: 参照スナップショット保存

1. Staging のスナップショットを `.reference-screenshots/{entry-key}.a11y-snapshot.txt` に保存
2. `.sync-manifest.json` の該当エントリの `referenceScreenshot` フィールドを更新:
   ```json
   "referenceScreenshot": ".reference-screenshots/{entry-key}.a11y-snapshot.txt"
   ```

### Step V8: 完了報告

以下をサマリーとして報告:
- 検出された差分の総数
- 修正した項目の一覧
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

`PAGE_MAPPING.md` を参照。

主なマッピング:
- `procedure` → `procedure/`
- `profile/employee` → `profile/(with-navi)/employee/`
- `setting/account` → `setting/account/`

---

## 関連スキル

- `/page-layout-assistant` - レイアウトパターン
- `/component-tips` - コンポーネント使用方法
