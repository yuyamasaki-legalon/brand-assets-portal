# オンボーディングガイド

環境構築からPR作成までの流れ。

## 0. 前提条件（初回のみ）

**必要なもの:**
- Node.js 25.3.0 以上（`.node-version` 参照）
- GitHub Personal Access Token（`repo` + `read:packages` スコープ）

**Token 設定:**
1. https://github.com/settings/tokens/new でトークン作成
2. スコープ: `repo`（全部）+ `read:packages`
3. 設定:
   - **Mac / Linux**: `~/.npmrc` に追記
   ```bash
   echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> ~/.npmrc
   ```
   - **Windows (PowerShell)**: `%USERPROFILE%\.npmrc` に追記
   ```powershell
   Add-Content -Path $env:USERPROFILE\.npmrc -Value "//npm.pkg.github.com/:_authToken=YOUR_TOKEN"
   ```
   `YOUR_TOKEN` を実際のトークンに置き換えてください。

## 1. 環境構築（初回のみ）

リポジトリをクローン:
```bash
git clone https://github.com/legalforce/aegis-lab.git && cd aegis-lab
```

依存関係をインストール:
```bash
corepack enable && pnpm install
```

開発サーバーを起動:
```bash
pnpm dev
```

→ http://localhost:5173 で確認

## 2. ページ作成

Sandbox ページを作成:
```bash
pnpm sandbox:create
```

→ http://localhost:5173/sandbox で確認

ここで画面が動くことを確認したら、対話形式で画面をブラッシュアップすることもできます。

また、[テンプレートからページを作る方法](./sandbox-guide.md) もあるのでご活用ください。

## 3. コミット前チェック

```bash
pnpm format && pnpm fix:style
pnpm build
```

## 4. PR作成

```bash
git add . && git commit -m "feat: ..."
git push origin your-branch
```

→ GitHub で PR 作成

---

## FAQ

### 環境構築でエラーが出た
→ [トラブルシューティング](./troubleshooting.ja.md)

### Aegis コンポーネントが見つからない
1. `pnpm install` で依存関係を確認
2. インポート: `import { Button } from '@legalforce/aegis-react';`

### PR で CI が失敗する
PR作成前に `pnpm format && pnpm build` を実行

### Sandbox と Template の違い
- **Sandbox** (`src/pages/sandbox/`): 実験用
- **Template** (`src/pages/template/`): 参考例（編集不可）

---

詳細: [Mac セットアップ](./mac-setup-guide.md) | [ページ作成](./sandbox-guide.md)

### Windows で Node / pnpm を使う場合
- **Node**: [fnm](https://github.com/Schniz/fnm) で `.node-version` のバージョンをインストール（`fnm install` → `fnm use`）。または [Node.js 公式](https://nodejs.org/) から 25.3.0 以上をインストール。
- **pnpm**: Node に同梱の corepack を有効化（`corepack enable`）。または `npx pnpm@10.28.0` で実行。
