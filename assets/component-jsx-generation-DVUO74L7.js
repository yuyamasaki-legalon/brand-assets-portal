var e=`# Component JSX 生成 — 実装方針

Add content で追加したコンポーネントを Generated Files の \`page-layout.tsx\` に実際の JSX として埋め込む機能の設計と実装方針。

---

## 概要

Generated Files ダイアログの **「Add content のコンポーネントを含める」** チェックボックスを ON にすると、各コンテンツエリアのプレースホルダーコメント（\`{/* Button, Text */}\` など）が実際の JSX コードに置き換わる。

\`\`\`tsx
// OFF（デフォルト）
<PageLayoutBody>
  {/* Button, Text */}
</PageLayoutBody>

// ON
<PageLayoutBody>
  <Button variant="subtle">Button</Button>
  <Text variant="body.medium">Text content</Text>
</PageLayoutBody>
\`\`\`

---

## ファイル構成

| ファイル | 役割 |
|---------|------|
| \`buildComponentJsxText.ts\` | ContentItem → JSX 文字列 変換ロジック |
| \`buildPageLayoutJsxText.ts\` | PageLayout 全体の JSX 生成（コンポーネント JSX を埋め込む側） |
| \`index.tsx\` | チェックボックス state → \`buildPageLayoutJsxText\` の \`includeComponents\` フラグに接続 |

---

## buildComponentJsxText.ts の設計

### エントリーポイント

\`\`\`typescript
export function buildComponentJsx(item: ContentItem, indent: string): string
export function collectComponentImports(items: ContentItem[]): string[]
export function collectIconImports(): string[]
\`\`\`

### 副作用によるインポート収集

\`buildComponentJsx\` を呼ぶたびに、内部の \`use(...names)\` がモジュールレベルの \`COMPONENT_IMPORT_SET\` に Aegis コンポーネント名を登録する。アイコン使用時は \`ICON_IMPORT_SET\` に登録される。

\`collectComponentImports(items)\` は：
1. 両セットをクリア
2. 全 items を \`buildComponentJsx\` に通す（副作用でセットが埋まる）
3. ソート済みコンポーネント名の配列を返す

\`collectIconImports()\` は **\`collectComponentImports\` の後に呼ぶ**こと（同じレンダリングパスで埋まった \`ICON_IMPORT_SET\` を返す）。

### Props の取り扱い

\`ContentItem.props\` は \`Record<string, string> | undefined\`。全 props が文字列として格納される:

| 型 | 格納例 | 取得方法 |
|----|--------|---------|
| 文字列 | \`"medium"\` | \`pv(p, "size", "medium")\` |
| 真偽値 | \`"true"\` / \`"false"\` | \`pb(p, "loading")\` |
| 数値 | \`"3"\` | \`parseInt(pv(p, "items", "3"), 10)\` |

### デフォルト値の省略

Aegis のデフォルト値と同じ場合は prop を出力しない。\`sp(name, val, def)\` ヘルパーが担当。

\`\`\`typescript
// size が "medium"（Aegis default）のとき → 出力しない
attrs += sp("size", size, "medium");
\`\`\`

---

## buildPageLayoutJsxText.ts との統合

### パラメータ追加

\`\`\`typescript
export type BuildPageLayoutJsxTextParams = {
  // ... 既存パラメータ ...
  includeComponents?: boolean; // デフォルト false
};
\`\`\`

### インポートブロックの拡張

\`includeComponents\` が true のとき：

1. \`collectComponentImports(allContentItems)\` で Add content のコンポーネント名を収集
2. PageLayout 系の imports 配列にマージしてソート → 単一の \`@legalforce/aegis-react\` import になる
3. \`collectIconImports()\` でアイコン名を収集 → 使用時のみ \`@legalforce/aegis-icons\` import を追加

\`\`\`tsx
import {
  Button,          // ← Add content から
  PageLayout,      // ← レイアウト設定から
  PageLayoutBody,
  Text,            // ← Add content から
} from "@legalforce/aegis-react";
import {
  LfPlusLarge,    // ← アイコン使用時のみ
} from "@legalforce/aegis-icons";
\`\`\`

### renderItems ヘルパー

\`\`\`typescript
function renderItems(items: ContentItem[], childIndent: string, includeComponents: boolean): string | null
\`\`\`

- \`includeComponents = false\` → \`{/* ComponentName, ... */}\` コメントを返す（従来の動作）
- \`includeComponents = true\` → 各 item を \`buildComponentJsx\` に通した結果を改行結合して返す
- \`items\` が空 → \`null\`（呼び出し側で \`if (rendered)\` ガード）

---

## コンポーネント対応状況

### 完全 JSX 生成（69種中 65種）

ComponentRenderer.tsx の実装を参考に、各コンポーネントのデフォルト props とフィールド設定を JSX に変換するビルダー関数を実装。

| カテゴリ | コンポーネント数 | 特記事項 |
|---------|--------------|---------|
| ボタン・アクション | 4 | Button の variant/color/size/minWidth/slots 対応 |
| テキスト・表示 | 6 | Text は \`resolveTextVariant\` でバリアント文字列を計算 |
| フォーム | 12 | FormControl ラッパー付きで生成 |
| 日付・時間 | 8 | 全て FormControl ラッパー付き |
| リスト・ナビ | 8 | 件数・ラベルを props から読む |
| 構造コンポーネント | 7 | Card, DataTable, SideNavigation など |
| その他 | 20 | Calendar, Accordion, Timeline など |

### コメントフォールバック（4種）

\`fieldConfig\` が存在せず props の意味が不定のため、\`{/* ComponentName */}\` コメントを出力する:

- \`Badge\` — ボタンの slot として使われる想定
- \`Radio\` — RadioGroup の子として使われる想定
- \`Skeleton\` — レイアウトに依存する構造
- \`Table\` — 独自の thead/tbody 構造が必要

---

## ComponentRenderer.tsx との関係

\`buildComponentJsxText.ts\` は \`ComponentRenderer.tsx\` のロジックを **文字列生成**に移植したもの。両者は意図的に独立しており、以下のルールを維持する:

- **ComponentRenderer** → React 要素を返す（プレビュー描画）
- **buildComponentJsxText** → JSX 文字列を返す（コード生成）

どちらかを変更した場合は、もう一方も同期が必要。\`CLAUDE.md\` に記載の「buildPageLayoutJsxText の出力はコンテンツビューの実装と一致させる」ルールに従う。

---

## 既知の制限

### props の一部が未反映

\`ComponentRenderer.tsx\` が参照する props の一部がビルダーに未実装（シンプル化のため意図的に省略）。生成コードはプロトタイプ用途であり、そのままプロダクション投入は想定していない。

### slot 情報の未活用

\`ContentItem.slot\` (\`"start"\` / \`"end"\`) はプレビューでの左右配置に使われるが、生成 JSX では全アイテムを縦に並べるだけで slot 配置は再現しない。

### アイコン props の固定

\`buildComponentJsxText.ts\` 内でアイコン名は \`props\` から読むが、未設定時のデフォルト（\`LfPlusLarge\` など）が実際の ComponentRenderer と完全一致しない場合がある。
`;export{e as default};