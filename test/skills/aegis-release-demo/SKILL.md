---
name: aegis-release-demo
description: "Aegis React アップデート後にリリースノートからデモページを自動生成。WHEN: @legalforce/aegis-react のバージョンアップ後にデモ作成を依頼されたとき、/aegis-release-demo を実行したとき。NOT WHEN: 通常の sandbox ページ作成、Aegis 以外のライブラリ更新。前提: バージョン番号と CHANGELOG が必要。"
disable-model-invocation: true
---

# Aegis Release Demo 生成

Aegis React のバージョンアップ時に、変更点を個別に確認できるデモページ群を sandbox に生成する。

---

## 入力

| パラメータ | 例 | デフォルト |
|-----------|-----|----------|
| バージョン番号 | `v2.39.0` | （必須） |
| リリースノート / CHANGELOG | テキスト or URL | （必須） |
| 対象ユーザーディレクトリ | `wataryooou` | `wataryooou` |

---

## Step 1: リリースノート解析・分類

変更項目を以下のカテゴリに分類し、デモ不可の項目はスキップ:

| カテゴリ | Tag | tagColor | デモ内容 |
|---------|-----|----------|---------|
| 新機能（props 追加等） | Design | `"blue"` | 新 props のインタラクティブ切り替え |
| バグ修正（UI） | Bug Fix | `"teal"` | 修正後の正常動作を確認 |
| 新アイコン | Design | `"blue"` | サイズ一覧 + Icon wrapper + IconButton + コンテキスト使用例 |
| 新トークン | Design | `"blue"` | トークン適用例の表示 |

**スキップ対象:** ブラウザ固有修正、内部リファクタ、MCP server 変更、ドキュメントのみの変更

---

## Step 2: lib/aegis Storybook 参照

対象コンポーネントの stories を検索し、実際の使用パターンを確認してからデモ実装する。

```
/Users/ryo.watanabe/github/aegis-feature/f2/aegis/packages/react/stories/components/
```

- 対象コンポーネント名でファイルを検索（例: `DataTable.stories.tsx`）
- 新しい props の使用例や、修正内容に関連するテストケースを確認
- **重要:** stories が見つからない場合でも、MCP ツールで props を確認すれば進行可能

---

## Step 3: MCP で props 確認

```
mcp__aegis__get_component_detail("ComponentName")  # props 型の確認
mcp__aegis__list_icons                              # 新アイコンの存在確認
mcp__aegis__list_tokens                             # 新トークンの確認
```

---

## Step 4: ディレクトリ・ファイル生成

### 4.1 バージョン文字列の変換

`v2.39.0` → ディレクトリ名: `v2-39-0`、export 名: `AegisUpdateV2390`

### 4.2 生成ファイル一覧

ベースパス: `src/pages/sandbox/users/{username}/`

| ファイル | 目的 | 作成条件 |
|---------|------|---------|
| `aegis-update/index.tsx` | バージョン一覧ページ | 初回のみ新規作成、既存なら `versions` 配列に追加 |
| `aegis-update/vX-YY-Z/index.tsx` | 該当バージョンの機能一覧カード | 常に新規作成 |
| `aegis-update/vX-YY-Z/{feature}/index.tsx` | 各機能のデモページ | 機能ごとに新規作成 |
| `routes.tsx` | lazy import + ルート追加 | 既存ファイルに追記 |
| `index.tsx` | ナビカード追加 | aegis-update カードがなければ追加 |

### 4.3 各ファイルの構造

#### バージョン一覧ページ（`aegis-update/index.tsx`）

既存の場合は `versions` 配列に新バージョンを追加するだけ。新規の場合:

```tsx
// versions 配列のエントリ形式
{
  version: "vX.YY.Z",
  path: "/sandbox/{username}/aegis-update/vX-YY-Z",
  description: "機能1, 機能2, ...",
  date: "YYYY-MM",
}
```

#### 機能一覧ページ（`vX-YY-Z/index.tsx`）

```tsx
// features 配列のエントリ形式
{
  name: "機能名",
  path: "/sandbox/{username}/aegis-update/vX-YY-Z/{feature-slug}",
  description: "機能の簡潔な説明",
  tag: "Design" | "Bug Fix",
  tagColor: "blue" | "teal" as const,
}
```

#### 個別デモページ

デモパターンの詳細は [references/demo-page-patterns.md](references/demo-page-patterns.md) を参照。

#### routes.tsx への追記

```tsx
// 1. lazy import を追加（ファイル上部、既存 imports の後）
const AegisUpdateVXYYZ = lazy(() =>
  import("./aegis-update/vX-YY-Z/index").then((module) => ({ default: module.AegisUpdateVXYYZ })),
);
const FeatureName = lazy(() =>
  import("./aegis-update/vX-YY-Z/{feature}/index").then((module) => ({ default: module.FeatureName })),
);

// 2. sandboxPageRoutes 配列に追加
{
  path: "/sandbox/{username}/aegis-update/vX-YY-Z",
  element: <AegisUpdateVXYYZ />,
  filePath: "src/pages/sandbox/users/{username}/aegis-update/vX-YY-Z/index.tsx",
},
{
  path: "/sandbox/{username}/aegis-update/vX-YY-Z/{feature}",
  element: <FeatureName />,
  filePath: "src/pages/sandbox/users/{username}/aegis-update/vX-YY-Z/{feature}/index.tsx",
},
```

---

## Step 5: 検証

1. `pnpm format` — lint/format エラーを修正
2. `pnpm build` — TypeScript + Vite ビルドが成功することを確認
3. 各ページへの導線確認（ナビカード → バージョン一覧 → 機能一覧 → 個別デモ）

---

## Known Pitfalls

v2.38.0 実装で得た教訓:

| 問題 | 正しい方法 |
|------|-----------|
| SVG アイコンに `size` prop を渡す | `<Icon size="medium"><SvgIcon /></Icon>` で wrap 必須 |
| `IconButton` に `label` prop | `aria-label` を使う（`label` は存在しない） |
| `Button variant="outline"` | `"outline"` は存在しない → `"subtle"` を使う |
| `Drawer` の Header/Body | `Drawer.Header` / `Drawer.Body`（compound component pattern） |
| `colSpan` のデモデータ | 結合が視覚的に分かるデータを用意する。lib/aegis の stories を必ず参照 |
| Tag variant | Tag には `"outline"` がある（Button と混同しない） |

---

## 関連スキル

- `/component-tips` - Aegis コンポーネントの使い方確認
- `/icon-finder` - アイコン検索
- `/design-token-resolver` - デザイントークン検索
- `/sandbox-creator` - 新規 sandbox ページ作成の基本手順
