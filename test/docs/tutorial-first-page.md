# 初めてのページ作成チュートリアル

**sandbox:create とテンプレート参照で始める、実践的なプロトタイプ開発**

このチュートリアルでは、`pnpm sandbox:create` でページを作成し、テンプレート構造を参考にカスタマイズする方法を学びます。

**所要時間**: 約5分
**前提条件**: 環境構築が完了していること（[オンボーディングガイド](./onboarding-guide.md)参照）

## このチュートリアルで学べること

- テンプレートの選び方と活用方法
- PageLayout の基本構造

---

## ステップ1: 準備

ターミナルで開発サーバーを起動します。

```bash
pnpm dev
```

ブラウザで `http://localhost:5173` にアクセスできることを確認してください。

---

## ステップ2: Sandbox ページを作成

新しいターミナルを開き、以下を実行します。

```bash
pnpm sandbox:create --name "Hello World" --template with-pane
```

対話形式で進める場合は、以下のように回答してください。

```
✔ 作成先を選択してください: › フラット（共有）
✔ ページ名を入力してください: › Hello World
✔ 説明を入力してください: › 初めてのページ
✔ レイアウトテンプレートを選択してください: › with-pane
✔ コンポーネント名に日付サフィックスを追加しますか? … no
```

コマンドが完了すると、以下が自動で行われます。

- `src/pages/sandbox/hello-world/index.tsx` が作成される
- `src/pages/sandbox/routes.tsx` にルートが追加される
- `src/pages/sandbox/index.tsx` にカードが追加される

ブラウザで `http://localhost:5173/sandbox/hello-world` を開いて確認してみましょう。

---

## ステップ3: Hello World に変更する

作成されたファイル `src/pages/sandbox/hello-world/index.tsx` を開きます。

`with-pane` テンプレートには、メインコンテンツエリアに pane の開閉案内が表示されています。これを "Hello World" に変更しましょう。

ファイル内で以下の部分を探してください:

```tsx
<Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
  Click the button below to toggle the pane visibility.
</Text>
```

これを以下のように変更します:

```tsx
<Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
  Hello World
</Text>
```

**ポイント:**
- `with-pane` テンプレートは、開閉可能なペイン + メインコンテンツの構成
- テンプレートの構造を活かしつつ、必要な部分だけをカスタマイズ
- `Text` コンポーネントの `variant` でテキストスタイルを指定

---

## ステップ4: 動作確認

`http://localhost:5173/sandbox/hello-world` を開き、以下を確認します。

- Header にメニューボタン、戻るボタン、タイトルが表示されている
- メインコンテンツエリアに "Hello World" が表示されている
- ボタンでペインを開閉できる

---

## ステップ5: コードチェックとコミット

```bash
pnpm format && pnpm fix:style
pnpm build
git add .
git commit -m "feat: Hello World ページを追加"
```

---

## 完成！

おめでとうございます。以下を達成しました。

- Sandbox ページ作成とテンプレート活用
- PageLayout の基本構造の理解

---

## 次のステップ

### 他のテンプレートを試す

`src/pages/template/CATALOG.md` で用途に近いテンプレートを探し、`pnpm sandbox:create` でページを作成してから実装に反映できます。

- **fill-layout**: ペイン + サイドバー付きレイアウト
- **dialog**: モーダルダイアログ
- **chat**: チャット UI
- **setting-page**: 設定ページ

### Aegis コンポーネントを調べる

Claude Code の MCP ツールでコンポーネント情報を確認できます。

```
mcp__aegis__list_components         # 一覧表示
mcp__aegis__get_component_detail("Button")  # 詳細表示
mcp__aegis__list_icons              # アイコン一覧
```

---

## トラブルシューティング

### ページが表示されない

1. `pnpm dev` が起動しているか確認
2. URL が正しいか確認: `http://localhost:5173/sandbox/hello-world`

### TypeScript エラーが出る

1. インポートが正しいか確認
2. `pnpm format` でエラー詳細を確認

---

**質問があれば、[オンボーディングガイド](./onboarding-guide.md)を参照してください。**
