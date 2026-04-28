# トラブルシューティングガイド

aegis-lab開発でよくある問題と解決方法を紹介します。

---

## GitHub認証エラー

### 問題: 401 Unauthorized

```
npm ERR! 401 Unauthorized - GET https://npm.pkg.github.com/@legalforce/aegis-react
```

### 原因

GitHub Personal Access Tokenが設定されていないか、無効になっています。

### 解決方法

1. **`~/.npmrc`を確認**:
   ```bash
   rg "npm.pkg.github.com" ~/.npmrc
   ```

   `rg` が使えない場合は `grep` を使う:
   ```bash
   grep "npm.pkg.github.com" ~/.npmrc
   ```

2. **トークンを設定**:
   ```bash
   echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> ~/.npmrc
   ```

3. **トークンの権限を確認**:
   - GitHub Settings → Developer settings → Personal access tokens に移動
   - `read:packages` スコープが有効になっていることを確認

4. **再インストール**:
   ```bash
   pnpm install
   ```

---

## pnpmバージョンの不一致

### 問題: pnpmバージョンが正しくない

```
Error: This project requires pnpm version 10.24.0
```

### 解決方法

**方法1: Corepackを有効化** (推奨):
```bash
corepack enable
```

Corepackは`package.json`で指定されたpnpmバージョンを自動的に使用します。

**方法2: 手動でバージョン指定**:
```bash
corepack prepare pnpm@10.28.0 --activate
```

**確認**:
```bash
pnpm --version
```

`10.24.0` と表示されるはずです。

---

## TypeScriptビルドエラー

### 問題: 型 'X' を型 'Y' に割り当てられない

```
error TS2322: Type 'string | undefined' is not assignable to type 'string'.
```

### 解決方法

**Nullish coalescingを使用**:
```tsx
// ❌ エラー
const name: string = user.name;

// ✅ 修正
const name: string = user.name ?? 'Unknown';
```

**またはオプショナル型を使用**:
```tsx
const name: string | undefined = user.name;
```

### 問題: オブジェクトがnullまたはundefinedの可能性がある

```
error TS2531: Object is possibly 'null'.
```

### 解決方法

**方法1: Nullチェック**:
```tsx
const element = document.getElementById('my-id');
if (element) {
  element.textContent = 'Hello';
}
```

**方法2: オプショナルチェーン**:
```tsx
document.getElementById('my-id')?.setAttribute('title', 'Hello');
```

**方法3: Non-null assertion** (確実な場合のみ):
```tsx
const element = document.getElementById('my-id')!;
element.textContent = 'Hello';
```

### 問題: モジュールが見つからない

```
error TS2307: Cannot find module '@legalforce/aegis-react'
```

### 解決方法

**依存関係を再インストール**:
```bash
rm -rf node_modules
pnpm install
```

**GitHub認証を確認** (上記を参照)。

---

## Cursor/VS Code エディタのTypeScriptエラー

### 問題: エディタで大量のTypeScriptエラーが表示される（ビルドは成功する）

CursorやVS Codeで次のようなエラーが表示される場合:

```
'React' refers to a UMD global, but the current file is a module. ts(2686)
Cannot find module '/data' or its corresponding type declarations. ts(2307)
Type 'undefined' is not assignable to type 'Element | null'. ts(2322)
```

しかし`pnpm build`はエラーなく成功する場合、エディタが間違ったTypeScriptバージョンを使用しています。

### 原因

エディタが`node_modules/typescript`で指定されているプロジェクトのワークスペースバージョンではなく、独自のバンドルされたTypeScriptバージョンを使用しています。

### 解決方法

**エディタをワークスペースのTypeScriptを使用するように設定**:

1. **エラーが表示されている`.tsx`ファイル**をCursor/VS Codeで開く
2. **コマンドパレットを開く**:
   - Mac: `Cmd + Shift + P`
   - Windows/Linux: `Ctrl + Shift + P`
3. **入力して選択**: `TypeScript: Select TypeScript Version`
   - `typescript`と入力すると絞り込まれます
4. **選択**: `Use Workspace Version`
   - これは`node_modules/typescript`のバージョンです
   - `node_modules/...`のパスが表示されているオプションを探してください
5. **エラーが解消されない場合**: エディタウィンドウをリロードするか、アプリケーションを再起動

### 確認方法

- ステータスバー（右下）にワークスペースのTypeScriptバージョンが表示されるはず
- エディタのエラーが消えるか、`pnpm build`の出力と一致するはず
- `pnpm build`とエディタの両方で同じエラーが報告されるはず

**注意**: この設定はワークスペースごとに保存されるため、プロジェクトを切り替えたり依存関係を再インストールした後に再設定が必要な場合があります。

---

## Aegisコンポーネントエラー

### 問題: コンポーネントが見つからない

```
Error: Cannot find module '@legalforce/aegis-react'
```

### 解決方法

1. **インストールを確認**:
   ```bash
   pnpm list @legalforce/aegis-react
   ```

2. **再インストール**:
   ```bash
   pnpm install
   ```

3. **GitHubトークンを確認** (認証セクションを参照)。

### 問題: 不明なプロパティ

```
Warning: React does not recognize the `someProps` prop on a DOM element
```

### 解決方法

**コンポーネントのプロパティを確認**:
1. `docs/rules/component/{Component}.md` を確認
2. Claude CodeのMCPツールを使用:
   ```
   mcp__aegis__get_component_detail("ComponentName")
   ```

3. Aegisバージョン（2.28.0）のAPIの変更を確認。

---

## MCPツールが動作しない

### 問題: Claude CodeでMCPツールが利用できない

### 原因

MCPサーバーが設定されていないか、実行されていません。

### 解決方法

1. **`.mcp.json`が存在することを確認**:
   ```bash
   cat .mcp.json
   ```

   以下の内容が含まれているはずです:
   ```json
   {
     "mcpServers": {
       "aegis": {
         "command": "npx",
         "args": ["-y", "@legalforce/aegis-mcp-server@latest"]
       }
     }
   }
   ```

2. **Claude Codeを再起動**。

3. **MCPサーバーを手動でテスト**:
   ```bash
   npx -y @legalforce/aegis-mcp-server@latest --version
   ```

4. **MCPサーバーを更新**:
   ```bash
   npx -y @legalforce/aegis-mcp-server@latest
   ```

---

## Hot Module Replacement (HMR) が動作しない

### 問題: 変更がブラウザに反映されない

### 原因

HMR接続が切れているか、ファイル監視が動作していません。

### 解決方法

1. **開発サーバーを再起動**:
   ```bash
   # 停止 (Ctrl+C)
   pnpm dev
   ```

2. **ブラウザキャッシュをクリア**:
   - ハードリフレッシュ: `Cmd+Shift+R` (Mac) または `Ctrl+Shift+R` (Windows)

3. **ファイルのパーミッションを確認**:
   `src/`内のファイルが読み取り可能であることを確認。

---

## ビルド失敗

### 問題: 型エラーでビルドが失敗する

```
pnpm build
# ... TypeScript errors
```

### 解決方法

1. **エラーメッセージを注意深く読む**:
   ファイルと行番号を特定します。

2. **型エラーを修正**:
   上記のTypeScriptトラブルシューティングを参照。

3. **型チェックのみ実行**:
   ```bash
   pnpm type-check
   ```

4. **リビルド**:
   ```bash
   pnpm build
   ```

### 問題: ビルド中にメモリ不足

```
FATAL ERROR: ... JavaScript heap out of memory
```

### 解決方法

**Node.jsのメモリを増やす**:
```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

または`package.json`のスクリプトに追加:
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' tsc && vite build"
  }
}
```

---

## デプロイ失敗

### 問題: デプロイが失敗する

```
pnpm deploy
# ... error
```

### 解決方法

1. **ローカルでビルドが成功することを確認**:
   ```bash
   pnpm build
   ```

2. **Cloudflare認証情報を確認**:
   Wranglerが認証されていることを確認。

3. **`wrangler.jsonc`を確認**:
   設定が正しいことを確認。

4. **デプロイログを確認**:
   特定の問題についてエラーメッセージを確認。

---

## Sandboxページエラー

### 問題: Sandboxページの作成が失敗する

```
pnpm sandbox:create
# ... error
```

### 解決方法

1. **`scripts/`ディレクトリが存在することを確認**:
   ```bash
   ls scripts/
   ```

2. **スクリプトファイルを確認**:
   ```bash
   ls scripts/create-sandbox-page.ts
   ```

3. **詳細出力で実行**:
   ```bash
   pnpm sandbox:create --verbose
   ```

### 問題: Sandboxページが表示されない

### 原因

ルートが登録されていません。

### 解決方法

1. **`src/pages/sandbox/routes.tsx`を確認**:
   新しいページがエクスポートされていることを確認。

2. **開発サーバーを再起動**:
   ```bash
   # Ctrl+C, その後
   pnpm dev
   ```

---

## Lintエラー

### 問題: Lintエラーがコミットを妨げる

### 解決方法

**自動修正**:
```bash
pnpm format
```

**手動修正**:
```bash
pnpm lint
```

**特定のエラーを確認**:
Biomeのエラーメッセージを読んで、それに応じて修正。

---

## Git問題

### 問題: マージコンフリクト

### 解決方法

1. **ブランチを更新**:
   ```bash
   git checkout main
   git pull
   git checkout feature/your-feature
   git rebase main
   ```

2. **コンフリクトを解決**:
   - コンフリクトしているファイルを編集
   - コンフリクトマーカー（`<<<<<<<`, `=======`, `>>>>>>>`）を削除
   - ファイルを保存

3. **リベースを続行**:
   ```bash
   git add .
   git rebase --continue
   ```

4. **プッシュ** (フィーチャーブランチへのforce push):
   ```bash
   git push --force
   ```

### 問題: mainにプッシュできない

```
error: failed to push some refs
```

### 原因

`main`への直接プッシュは許可されていません。

### 解決方法

**代わりにPRを作成**:
1. フィーチャーブランチにプッシュ
2. GitHubでプルリクエストを作成
3. レビュー後にマージ

---

## パフォーマンス問題

### 問題: 開発サーバーが遅い

### 解決方法

1. **キャッシュをクリア**:
   ```bash
   rm -rf node_modules/.vite
   pnpm dev
   ```

2. **依存関係を更新**:
   ```bash
   pnpm update
   ```

3. **システムリソースを確認**:
   不要なアプリケーションを閉じる。

### 問題: ビルドが遅い

### 解決方法

**キャッシュを有効化** (Viteはデフォルトで有効)。

**バンドルサイズを削減**:
- 未使用のimportを削除
- コード分割を使用

---

## 環境問題

### 問題: Node.jsバージョンが古い

```
error: The engine "node" is incompatible
```

### 解決方法

**Node.jsを更新**:
- https://nodejs.org/ からダウンロード
- またはバージョンマネージャーを使用 (nvm, fnm)

**推奨**: Node.js 25.3.0以上。

### 問題: 依存関係が見つからない

```
Error: Cannot find module 'some-package'
```

### 解決方法

**再インストール**:
```bash
pnpm install
```

---

## さらにヘルプが必要な場合

問題が解決しない場合:

1. **ドキュメントを確認**:
   - [オンボーディングガイド](/docs/onboarding-guide.md)
   - [開発ルール](/docs/development-rules.md)
   - [コマンドリファレンス](/docs/commands.md)

2. **チームに相談**:
   チームメンバーに支援を求める。

3. **Aegisドキュメントを確認**:
   Aegis固有の問題については、Design Systemチームに相談。

4. **エラーログを確認**:
   完全なエラーメッセージを読んで手がかりを探す。

---

## クイックトラブルシューティングチェックリスト

### 開発環境の問題
- [ ] Node.jsバージョンが25.3.0以上
- [ ] pnpmバージョンが10.24.0（Corepack経由）
- [ ] GitHubトークンが`~/.npmrc`に設定されている
- [ ] 依存関係がインストール済み（`pnpm install`）
- [ ] 開発サーバーが起動している（`pnpm dev`）
- [ ] エディタがワークスペースのTypeScriptバージョンを使用している（バンドル版ではない）

### ビルドの問題
- [ ] `pnpm format` が成功する
- [ ] `pnpm build` が成功する
- [ ] TypeScriptエラーがない
- [ ] Lintエラーがない

### デプロイの問題
- [ ] ローカルでビルドが成功する
- [ ] Wranglerが認証されている
- [ ] `wrangler.jsonc` が正しく設定されている
- [ ] チームの承認を得ている

---

詳細については以下を参照:
- [オンボーディングガイド](/docs/onboarding-guide.md)
- [コマンドリファレンス](/docs/commands.md)
- [TypeScriptガイド](/docs/typescript-guide.md)
