# loc-sync 運用ナレッジ

loc-sync スキルを使う際のベストプラクティス、ハマりポイント、判断基準をまとめたナレッジドキュメント。

---

## 1. モード選択クイックガイド

### drift レベル → モード対応

| drift レベル | 推奨モード | 読み込み範囲 | 典型的なケース |
|-------------|-----------|-------------|--------------|
| MAJOR | `full` | ページ + locPartsGlobs 全体 | ファイル追加/削除、Layout/Router 変更 |
| MINOR | `incremental` | 差分ファイル + 現テンプレート | コンポーネント修正、Props 変更 |
| COSMETIC | `patch` | messages.csv の差分のみ | ラベル・翻訳テキスト変更 |
| NONE | なし | - | 同期済み、変更なし |

### モード判断に迷ったときの基準

- **モード省略がベスト**: `drift detector` が自動判定するので、基本は `/loc-sync {service} {page}` でモード省略
- **full を明示すべきケース**: 初回同期、テンプレートが大きく崩れている、drift detector の判定に疑問がある場合
- **incremental が最も使用頻度が高い**: 日常的な LOC の UI 変更はほとんどこのモード
- **patch は安全**: テキストだけの変更なのでレイアウト崩れのリスクが最も低い

---

## 2. よくあるハマりポイント

### 名前の不一致に注意

| 実際のパス/名前 | 紛らわしい対応先 | 備考 |
|---------------|----------------|------|
| `personal-setting/`（単数） | `personal-settings-f`（複数） | ディレクトリ名とサービス名で単数/複数が異なる |
| `review/` | `review-console-f` | `review-console/` も同じサービスだが別ページ |
| `file-management/` | `document-management-f` | サービス名は document、出力先は file-management |

### 特殊なサービス構成

- **`document-management-f`**: 自前のページを持たず、共有モジュール `@legalforce/loc-file-management-module` を使用。ソース読み取り時に `pages/` ではなく `router` を参照する
- **`manual-correction-f`**: 通常の LOC Dev（`app.dev.jp.loc-internal.com`）とは別ドメイン（`app.manual-correction.itg.qa01.jp.loc-internal.com`）で動作。Visual Comparison Loop 時はベース URL の切り替えが必要
- **`word-addin-f`**: Word Add-in のためブラウザでアクセスできるページがない。Visual Comparison Loop の対象外

### パスの罠

- **esign の LOC Dev パスは `/sign`**: `/esign` ではないので、URL を手動構築する際は注意
- **`review/` の LOC Dev パスは `/dashboard/contract-review`**: テンプレートパスと LOC Dev パスが大きく異なる

### locPartsGlobs の重要性

- `full` モードでも `parts/` 全体を読むのではなく、マニフェストの `locPartsGlobs` で指定されたディレクトリのみ読む
- glob を設定しないと不要な部品まで読み込み、処理が重くなり、コンテキストを圧迫する
- 新規テンプレート作成時は、必要な parts のパスを `.sync-manifest.json` に正しく登録する

---

## 3. Visual Comparison Loop の注意点

### セッション管理

- LOC Dev はセッション切れが頻繁に発生する
- **各 `browser_navigate` 後にログインリダイレクトを検知し、必要なら再ログイン**する
- Keychain からパスワード取得: `security find-generic-password -s "loc-dev" -a "loc-dev-user" -w`

### 無視してよい差分

以下は LOC Dev 固有の要素であり、aegis-lab テンプレートに再現する必要はない:

- ヘルプチャットウィジェット
- アナリティクス関連要素
- Feature flag バナー
- Intercom ウィジェット
- aegis-lab の FloatingSourceCodeViewer
- 実データ vs モックデータの内容差（構造が同じならOK）

### ループ制限

- **最大 5 回**で収束しなければ残差分をユーザーに報告して終了
- 差分の修正は重要度順: 構造 > コンポーネント種別 > テキスト > 順序
- 1ループで複数の差分を同時に修正すると効率的

---

## 4. マニフェスト管理

### 更新タイミング

- **全モード共通で、同期完了後に必ず `.sync-manifest.json` を更新する**
- 更新フィールド:
  - `lastSyncedCommit`: `cd lib/loc-app && git rev-parse HEAD` の結果
  - `lastSyncedDate`: 現在の ISO 8601 タイムスタンプ

### 新規テンプレート追加時

- マニフェストにエントリを追加する
- `locPartsGlobs` を適切に設定する（不要な parts を読まないように）
- `templateRoute` を設定し、`src/pages/template/routes.tsx` にルートを登録する

### Visual Comparison 後

- LOC Dev のスナップショットを `.reference-screenshots/{entry-key}.a11y-snapshot.txt` に保存
- マニフェストの `referenceScreenshot` フィールドを更新

---

## 5. drift detector の使い方

### コマンド

```bash
# 全エントリのレポート
pnpm loc-sync:drift

# サービスでフィルタ
pnpm loc-sync:drift -- --service esign-f

# 特定エントリのみ
pnpm loc-sync:drift -- --entry case/index.tsx

# JSON 出力（スキル内部で使用）
pnpm loc-sync:drift -- --json
```

### 自動除外ルール

以下のファイルは drift 判定から自動除外される（本番コードに影響しないため）:

- `*.stories.*`
- `*.spec.*`
- `*.test.*`

### MAJOR 判定のヒューリスティック

以下のいずれかに該当すると MAJOR と判定される:

1. ファイルの追加 or 削除がある（構造変更）
2. 変更ファイル名に `Layout` / `layout` / `Router` / `router` を含む（レイアウト変更）
3. synced commit がリポジトリに存在しない（履歴の断絶）
4. git diff が失敗する（安全側に倒す）

**注意**: Layout/Router のヒューリスティックは意図的に広め。`RouterUtils.ts` のような間接的なファイルもヒットするが、過検出（over-escalation）は見落としより安全という判断。

---

## 6. トラブルシューティング

| 症状 | 原因 | 対処 |
|------|------|------|
| drift detector が `Error: No manifest entries match` | サービス名やエントリキーのタイポ | SERVICE_MAPPING.md でサービス名を確認 |
| `Synced commit not found in repo` | loc-app のリポジトリが浅いクローン or rebase 後 | `git fetch --unshallow` または full モードで再同期 |
| Visual Comparison でログインできない | Keychain にパスワードが未登録 | `security add-generic-password -s "loc-dev" -a "loc-dev-user" -w` で登録 |
| incremental モードで変更が反映されない | locPartsGlobs に該当パスが含まれていない | マニフェストの glob パターンを確認・拡張 |
| patch モードでテキストが更新されない | CSV 以外のファイルで管理されているラベル | incremental モードに切り替え |
