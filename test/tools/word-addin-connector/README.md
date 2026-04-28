# Word Add-in Connector

Word のタスクペインに Aegis Lab の Web アプリを表示するための Office Add-in XML マニフェスト群。

## セットアップ

### ファイル構成

| ファイル | 説明 |
|---|---|
| `aegis-lab-addin-prd.xml` | **Production** 用マニフェスト — 本番環境の URL を参照 |
| `aegis-lab-addin-preview.xml` | **Preview** 用マニフェスト — PR プレビュー環境の URL を参照 |

### 環境別 URL

| 環境 | マニフェスト | URL |
|---|---|---|
| Production | `aegis-lab-addin-prd.xml` | `https://aegis-lab.ontechnologies.tech/` |
| Preview | `aegis-lab-addin-preview.xml` | `https://pr-000-aegis-lab.on-technologies-technical-dept.workers.dev/` |

> **Note:** Preview マニフェストの URL はテンプレートです。実際の PR 番号に応じて `pr-000` 部分を書き換えてください。

### サイドロード手順

#### Word デスクトップ (Windows / Mac)

会社の設定都合で、現在は利用できません。（要調査）

#### Word on the web

1. [office.com](https://www.office.com/) で Word 文書を開く
2. **挿入** > **アドイン** > **マイアドイン** を選択
3. **カスタムアドインのアップロード** からマニフェスト XML をアップロード
4. リボンの **Home** タブに「Aegis Lab」グループが表示される

> 詳細は [Microsoft 公式ドキュメント: Office アドインのサイドロード](https://learn.microsoft.com/ja-jp/office/dev/add-ins/testing/sideload-office-add-ins-for-testing) を参照。

### ローカル開発

#### デバッグハーネス (`addin-debug.html`)

`public/addin-debug.html` は Word タスクペインの実環境を模したデバッグハーネス。ブラウザだけで Add-in レイアウトを確認できる。

```
pnpm dev
# ブラウザで http://localhost:5173/addin-debug.html を開く
```

**主な機能:**

- Word 風リボン UI のモック表示
- タスクペインの左端をドラッグしてリサイズ可能 (300 - 600px)
- プリセット幅ボタン (300 / 320 / 480px)
- 現在幅のリアルタイム表示
- iframe 内でアプリを読み込むため、自動的に HashRouter に切り替わる (実環境と同じ動作)

iframe のデフォルト読み込み先: `/#/template/loc/word-addin-standalone`

## 技術詳細

### マニフェスト仕様

両マニフェストとも Office の **TaskPaneApp** 形式で、以下の共通設定を持つ。

| 項目 | 値 |
|---|---|
| Host | `Document` (Word) |
| DefaultLocale | `ja-JP` |
| Permissions | `ReadWriteDocument` |
| WordApi MinVersion | `1.1` |
| タスクペイン幅 | 300 - 600 px (Word 標準。初期幅 320px) |
| ExtensionPoint | `PrimaryCommandSurface` > `TabHome` |

リボンの **Home** タブに「Aegis Lab」グループが追加され、「表示する」ボタンでタスクペインが開く。

### アプリ側の対応

#### HashRouter 自動切替 (`src/App.tsx`)

Office Add-in のタスクペインは iframe 内で動作するため、BrowserRouter の History API が制限される。アプリは自動的にルーターを切り替える:

```tsx
const isIframe = window.self !== window.top;
const forceAddinMode = new URLSearchParams(window.location.search).has("addin");
const Router = isIframe || forceAddinMode ? HashRouter : BrowserRouter;
```

- **iframe 検出:** `window.self !== window.top` で自動判定
- **手動切替:** `?addin` クエリパラメータで HashRouter を強制可能

#### `min-inline-size` オーバーライド

Aegis Provider は `body` に `min-inline-size: 960px` を設定するが、タスクペイン (300 - 600px) には収まらない。Word Add-in 用テンプレートでは `useEffect` で `body` スタイルを直接上書きする:

```tsx
useEffect(() => {
  const prev = document.body.style.minInlineSize;
  document.body.style.minInlineSize = "300px";
  return () => {
    document.body.style.minInlineSize = prev;
  };
}, []);
```

## 関連リソース

| リソース | パス |
|---|---|
| Word Add-in Standalone テンプレート | `src/pages/template/loc/word-addin-standalone/` |
| Word Add-in (Pane) テンプレート | `src/pages/template/loc/word-addin/` |
| デバッグハーネス | `public/addin-debug.html` |
| Word Add-in Layout スキル | `skills/word-addin-layout/SKILL.md` |
| Sandbox ページ (実験用) | `src/pages/sandbox/loc/wataryooou/word-addin/` |
