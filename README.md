# Brand Asset Portal Prototype

ブランドアセットを検索・推薦表示・詳細閲覧できる社内向けWebプロトタイプです。

## 使い方

### これまでの静的プレビュー

```bash
python3 -m http.server 8000
```

その後、`http://localhost:8000` を開いてください。

### Drive API 連携つきの本命版

1. 依存関係をインストール

```bash
npm install
```

2. Google Drive のサービスアカウント認証情報を設定

`.env.example` にあるどちらかを使います。

- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `GOOGLE_SERVICE_ACCOUNT_JSON_PATH`

例:

```bash
export GOOGLE_SERVICE_ACCOUNT_JSON_PATH=/absolute/path/to/service-account.json
```

3. サービスアカウントに対象の Drive フォルダを閲覧共有

4. サーバー起動

```bash
npm start
```

その後、`http://localhost:3000` を開いてください。

## 主な機能

- Google Drive から同期した `assets-index.json` を読み込んで一覧を表示
- `GET /api/assets` でインデックスを返す最小バックエンド
- `GET /api/thumbnail/:fileId` で Google Drive サムネイルを中継
- `GET /api/download/:fileId` でファイルダウンロードを中継
- 検索バーのワード検索とサジェスト
- Brand / Asset type / File format / Usage / Locale の複数絞り込み
- Deprecated / Archived の表示切替
- 推奨アセットの優先表示
- ソート切替
- 詳細モーダルでのプレビュー、バリエーション、バージョン履歴表示
- `ダウンロード`
- `Google Driveで確認する`

## インデックス更新

このプロトタイプは `assets-index.json` を読み込んで表示します。  
Drive のフォルダ構成やファイル構成を更新したら、インデックスも再生成して差し替えてください。  
実ファイルIDに解決できないレコードは一覧から自動的に除外されます。

## 補足

- 画像ファイルは `/api/thumbnail/:fileId` 経由で実サムネイル表示します
- `PDF` や `AI` は Drive 側でサムネイルが作れる場合のみ実画像になります
- バックエンドが使えない場合は、フロントエンドは自動で `assets-index.json` の静的読みにフォールバックします
