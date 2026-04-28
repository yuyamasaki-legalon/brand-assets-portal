# Tauri デスクトップアプリガイド

aegis-lab をネイティブデスクトップアプリとして起動するためのガイドです。

既存の Web 開発（`pnpm dev` / `pnpm build` / Cloudflare Workers デプロイ）には影響しません。

---

## 前提条件

通常の Web 開発環境（Node.js, pnpm）に加えて、以下が必要です。

### 1. Xcode Command Line Tools（macOS）

```bash
xcode-select --install
```

既にインストール済みの場合はスキップしてください。

### 2. Rust ツールチェーン

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

インストール後、ターミナルを再起動するか以下を実行:

```bash
. "$HOME/.cargo/env"
```

**確認**:

```bash
rustc --version
# → rustc 1.xx.x と表示されればOK

cargo --version
# → cargo 1.xx.x と表示されればOK
```

---

## コマンド

### 開発モード

```bash
pnpm tauri:dev
```

Vite dev server を起動し、ネイティブウィンドウで aegis-lab UI を表示します。

- 初回はRust の依存クレートのコンパイルが走ります
- フロントエンドのコード変更は HMR で即時反映されます
- Rust コード（`src-tauri/`）の変更時は自動リビルドされます

### プロダクションビルド

```bash
pnpm tauri:build
```

配布可能なネイティブアプリをビルドします。

- **macOS**: `src-tauri/target/release/bundle/` に `.app` / `.dmg` が生成されます
- フロントエンドビルド → Rust ビルド → バンドル の順で実行されます

### 環境情報の確認

```bash
pnpm tauri info
```

Rust / OS / Tauri のバージョン情報を表示します。トラブルシューティング時に有用です。

---

## iOS Simulator で実行する

aegis-lab を iOS Simulator 上で動かすことができます。

### 追加の前提条件

デスクトップアプリの前提条件に加えて、以下が必要です。

1. **Xcode フル版**（App Store からインストール）
   - Command Line Tools だけでは不足です
2. **iOS Simulator ランタイム**（Xcode インストール後に実行）:
   ```bash
   xcodebuild -downloadPlatform iOS
   ```
3. **CocoaPods**:
   ```bash
   brew install cocoapods
   ```

### セットアップ

初回のみ、iOS プロジェクトを初期化します:

```bash
pnpm tauri ios init
```

Rust の iOS ターゲット（`aarch64-apple-ios` 等）や Xcode プロジェクトが自動生成されます。

### 開発モード

```bash
pnpm tauri ios dev "iPhone 17 Pro"
```

Vite dev server を起動し、指定した Simulator でアプリを表示します。

- デバイス名は `xcrun simctl list devices available` で確認できます
- デバイス名を省略すると Xcode が開きます
- 初回は iOS 向け Rust コンパイルが走ります
- フロントエンドの変更は HMR で即時反映されます

### 利用可能なデバイス一覧の確認

```bash
xcrun simctl list devices available
```

---

## ディレクトリ構成

```
src-tauri/
├── Cargo.toml           # Rust プロジェクト定義
├── build.rs             # Tauri ビルドスクリプト
├── tauri.conf.json      # アプリ設定（ウィンドウサイズ、バンドル設定など）
├── capabilities/
│   └── default.json     # セキュリティ権限設定
├── icons/               # アプリアイコン（自動生成）
├── src/
│   ├── main.rs          # Rust エントリーポイント
│   └── lib.rs           # Tauri アプリロジック
├── target/              # Rust ビルド出力（.gitignore 対象）
└── gen/                 # Tauri 自動生成ファイル（.gitignore 対象）
```

---

## 仕組み

### Web ビルドとの共存

`vite.config.ts` で `TAURI_ENV_PLATFORM` 環境変数（Tauri CLI が自動設定）を使い、Cloudflare プラグインの読み込みを制御しています。

| コマンド | `TAURI_ENV_PLATFORM` | Cloudflare プラグイン |
|---------|---------------------|---------------------|
| `pnpm dev` | 未設定 | 読み込む |
| `pnpm build` | 未設定 | 読み込む |
| `pnpm tauri:dev` | `macos` 等 | 読み込まない |
| `pnpm tauri:build` | `macos` 等 | 読み込まない |

### アイコンの再生成

アイコンを変更したい場合:

```bash
pnpm tauri icon <画像ファイルパス>
```

1024x1024 以上の PNG または SVG を推奨します。

---

## トラブルシューティング

### `cargo` が見つからない

```
failed to run 'cargo metadata' command
```

Rust がインストールされていません。[前提条件](#2-rust-ツールチェーン)を参照してください。

### 初回ビルドが遅い

初回は Rust の依存クレート（tauri, serde 等）をすべてコンパイルするため時間がかかります。2 回目以降はキャッシュが効くため高速になります。

### macOS で「壊れているため開けません」と表示される

ビルドした `.dmg` / `.app` を Slack 等で共有した場合、受け取った側で以下のエラーが出ることがあります:

> "Aegis Lab" は壊れているため開けません。ゴミ箱に入れる必要があります。

これはアプリが Apple Developer 証明書で署名されていないためです。macOS はインターネット経由でダウンロードしたファイルに隔離属性を付与し、署名のないアプリの起動をブロックします。

**解決方法**: 受け取った側がターミナルで以下を実行してください:

```bash
xattr -cr /Applications/Aegis\ Lab.app
```

`.app` を `/Applications` 以外に置いた場合は、パスを適宜変更してください。

### `Port 5173 is already in use`

```
Error: Port 5173 is already in use
```

`pnpm dev` や `pnpm tauri:dev` が既に起動している状態で別の Tauri コマンドを実行すると発生します。先に起動中のプロセスを停止してから再実行してください:

```bash
# ポート 5173 を使用しているプロセスを終了
lsof -ti:5173 | xargs kill -9
```

---

## 参考リンク

- [Tauri 2.0 公式ドキュメント](https://v2.tauri.app/)
- [Tauri + Vite ガイド](https://v2.tauri.app/start/frontend/vite/)
- [Rust 公式サイト](https://www.rust-lang.org/ja)
