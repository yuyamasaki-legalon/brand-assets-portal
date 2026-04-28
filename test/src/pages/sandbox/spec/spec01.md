# Sandbox ページ作成ワークフロー仕様

## 概要

Sandboxでは、実験的な機能やプロトタイプを効率的に作成するための3ステップワークフローを提供します。

### 3ステップワークフロー

1. **Pages** - ページの基本構造とルーティングを作成
2. **Layout** - PageLayoutテンプレートを選択・実装
3. **Component** - コンポーネントを対話的にブラッシュアップ

各ステップは明確に責務が分離されており、順番に進めることで効率的にページを作成できます。

---

## Step 1: Pages（ページ構造作成）

### 目的

ページの基本構造（ディレクトリとファイル）を作成し、ルーティングの準備を行います。

### 成果物

- `src/pages/sandbox/{page-name}/index.tsx` - ページコンポーネント
- sandbox/index.tsx への自動カード追加
- App.tsx 更新のための情報

### 命名規則

- **ディレクトリ名**: kebab-case（例: `my-experiment`）
- **コンポーネント名**: PascalCase + 日付サフィックス（オプション）
  - 例: `MyExperiment20251125` または `MyExperiment`

### コマンド: `pnpm run sandbox:create`

対話的にページを作成します。

#### 実行フロー

1. ページ名を入力
2. PageLayoutテンプレートを選択（6パターン + blank）
3. 説明文を入力
4. ファイル生成
5. sandbox/index.tsx に自動でカード追加
6. App.tsx 更新手順を表示

#### 実行例

```bash
$ pnpm run sandbox:create

? ページ名を入力してください: My Experiment
? 説明を入力してください: 新しいUIパターンの実験
? PageLayoutテンプレートを選択してください:
  ❯ Basic Layout
    With Sidebar
    With Pane
    With Resizable Pane
    Scroll Inside Layout
    With Sticky Container
    Blank (空のテンプレート)

✓ ページを作成しました: src/pages/sandbox/my-experiment/index.tsx
✓ sandbox/index.tsx にカードを追加しました

次のステップ:
1. App.tsx に以下を追加してください:

   // Import (行6付近)
   import MyExperiment20251125 from "./pages/sandbox/my-experiment";

   // Route (行160付近)
   <Route path="/sandbox/my-experiment" element={<MyExperiment20251125 />} />

   // ROUTE_FILE_MAP (行26付近)
   "/sandbox/my-experiment": "src/pages/sandbox/my-experiment/index.tsx",

2. ブラウザで http://localhost:5173/sandbox/my-experiment を確認
```

---

## Step 2: Layout（レイアウト実装）

### 目的

PageLayoutを完璧に実装し、レイアウトのテンプレートを固定します。

### ルール

1. **PageLayoutを完璧に実装する**
   - 必要なすべてのPageLayoutコンポーネントを配置
   - Header, Body, Footer の構造を決定
   - Sidebar, Pane の有無と位置を決定

2. **細かいButton系は無視**
   - レイアウト構造のみに集中
   - Placeholderコンポーネントで代用可能

3. **構造を決めたら変更しない**
   - 以降のステップではLayoutを変更しない
   - Componentの入れ替えのみ行う

### 利用可能なPageLayoutテンプレート

#### 1. Basic Layout
最も基本的なレイアウト。すべてのPageLayout要素を含みます。

- PageLayoutSidebar（開始位置）
- PageLayoutPane（開始位置）
- PageLayoutContent
- PageLayoutPane（終了位置）

各セクションにHeader, Body, Footerを持ちます。

**用途**: 複雑なレイアウトの学習、カスタマイズのベース

#### 2. With Sidebar
サイドナビゲーション付きのレイアウト。

- StartSidebarコンポーネントを使用
- シンプルなContent領域

**用途**: ナビゲーションが必要なページ、管理画面

#### 3. With Pane
トグル可能なPaneを持つレイアウト。

- useState でPane開閉を管理
- ボタンでPane表示/非表示を切り替え
- Pane width="medium"

**用途**: 詳細情報の表示、フィルタパネル

#### 4. With Resizable Pane
リサイズ可能なPaneを持つレイアウト。

- resizable プロパティ
- minWidth, maxWidth, width を設定
- ユーザーがドラッグでリサイズ可能

**用途**: ユーザーがサイズ調整したいパネル、エディタ

#### 5. Scroll Inside Layout
内部スクロールのレイアウト。

- scrollBehavior="inside" を設定
- Header/Footerは固定、Bodyがスクロール

**用途**: 長いコンテンツ、テーブル表示

#### 6. With Sticky Container
スティッキーコンテナ付きレイアウト。

- PageLayoutStickyContainer を使用
- スクロール時もコンテナが上部に表示される

**用途**: 常に表示したい操作パネル、フィルタ

#### 7. Blank
空のテンプレート。最小限の構成。

- PageLayout > PageLayoutContent のみ
- 自由にカスタマイズ可能

**用途**: 完全にカスタムなレイアウトを作りたい場合

### テンプレート選択のガイドライン

| 要件 | 推奨テンプレート |
|------|------------------|
| ナビゲーションが必要 | With Sidebar |
| 詳細情報の表示/非表示 | With Pane |
| ユーザーがサイズ調整 | With Resizable Pane |
| 長いコンテンツリスト | Scroll Inside Layout |
| 固定ツールバー | With Sticky Container |
| すべてを学びたい | Basic Layout |
| 自由にカスタマイズ | Blank |

---

## Step 3: Component（コンポーネント実装）

### 目的

レイアウト内に配置するコンポーネントを実装し、対話的にブラッシュアップします。

### アプローチ

- **手動実装**: コマンドは提供しない
- **対話的**: Claude Codeと対話しながら段階的に改善
- **柔軟性**: 要件に応じて自由に実装

### 実装パターン

1. **右ペイン、左ペイン、本体の役割を決める**
   - 例: 左=ナビゲーション、本体=コンテンツ、右=詳細情報

2. **Placeholderから実コンポーネントへ置き換え**
   - 最初はPlaceholderで構造を確認
   - 徐々に実際のコンポーネントに置き換え

3. **Aegisコンポーネントを活用**
   - MCPツール（mcp__aegis__*）でコンポーネントを探す
   - FloatingSourceCodeViewerで使用コンポーネントを確認

### 実装例

```tsx
// Step 2で決めたLayoutは変更しない
<PageLayoutPane open={isPaneOpen} width="medium">
  <PageLayoutPaneHeader>
    <ContentHeader>
      <ContentHeader.Title>詳細情報</ContentHeader.Title>
    </ContentHeader>
  </PageLayoutPaneHeader>
  <PageLayoutPaneBody>
    {/* Step 3でここを実装 */}
    {selectedItem ? (
      <ItemDetail item={selectedItem} />
    ) : (
      <Text>項目を選択してください</Text>
    )}
  </PageLayoutPaneBody>
</PageLayoutPane>
```

---

## 技術仕様

### ディレクトリ構造

```
src/pages/sandbox/
├── index.tsx                    # Sandbox一覧ページ
├── spec/
│   └── spec01.md               # この仕様書
├── my-experiment/              # 個別のSandboxページ
│   └── index.tsx
└── another-test/
    └── index.tsx
```

### ルーティング登録（App.tsx）

各Sandboxページは以下3箇所を更新する必要があります：

1. **Import文**（行6付近）
```tsx
import MyExperiment from "./pages/sandbox/my-experiment";
```

2. **Route定義**（行160付近）
```tsx
<Route path="/sandbox/my-experiment" element={<MyExperiment />} />
```

3. **ROUTE_FILE_MAP**（行26付近）
```tsx
"/sandbox/my-experiment": "src/pages/sandbox/my-experiment/index.tsx",
```

### 実装技術スタック

**npm scripts実装に使用**:
- `tsx` - TypeScriptスクリプト実行
- `prompts` - 対話的CLI
- `prettier` - コード整形
- Node.js fs/promises - ファイル操作

---

## FAQ

### Q: Step 1と2を同時に実行できますか？

A: できます。`pnpm run sandbox:create`でテンプレートを選択すれば、Step 1と2が同時に完了します。

### Q: 後からLayoutを変更できますか？

A: できますが、推奨しません。Layoutは最初に固定し、Componentのみを変更することで、メンテナンス性が向上します。

### Q: 既存のTemplateページをSandboxに移動できますか？

A: できます。ファイルをコピーして、パスとインポートを更新してください。

### Q: Sandboxページを本番に移行する方法は？

A: sandbox/配下から適切なディレクトリ（例: pages/features/）に移動し、ルーティングを更新します。

---

## 次のステップ

1. **npm scriptsの実装**
   - `scripts/create-sandbox-page.ts` を作成
   - `scripts/templates/` にテンプレートファイルを配置
   - package.json にスクリプトを追加

2. **テンプレートファイルの作成**
   - 各PageLayoutパターンのテンプレートを作成
   - 変数置換の仕組みを実装

3. **ドキュメント整備**
   - README.mdに使い方を追加
   - サンプルページを作成して動作確認

---

**最終更新**: 2025-11-25
