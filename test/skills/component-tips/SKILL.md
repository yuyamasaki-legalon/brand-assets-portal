---
name: component-tips
description: "Aegis コンポーネントの使い方、Props、注意点を提供。Button、Dialog、Card などの Aegis コンポーネント実装時や質問時に自動トリガー。NOT WHEN: 既に MCP ツールで Props を確認済みの場合。引数でコンポーネント名を指定可能（例: /component-tips Button）。"
---

# Aegis コンポーネント Tips

Aegis コンポーネントの使用時の注意点、ガイドライン、Storybook カタログを参照するスキル。

## 使用方法

### 明示的な呼び出し
```
/component-tips Button
/component-tips Dialog
```

### 引数なしの場合
コンポーネント一覧を表示し、どのコンポーネントについて知りたいかを確認する。

## 実行手順

### Step 1: コンポーネント名の特定

引数 `$ARGUMENTS` からコンポーネント名を取得する。

- 引数がある場合: そのコンポーネント名を使用
- 引数がない場合: ユーザーに確認するか、コード中で使用されているコンポーネントを特定

### Step 2: ドキュメントファイルの読み込み

以下のファイルを読み込む:

```
docs/rules/component/{ComponentName}.md
```

**例:**
- `$ARGUMENTS` が `Button` → `docs/rules/component/Button.md` を読む
- `$ARGUMENTS` が `Dialog` → `docs/rules/component/Dialog.md` を読む

### Step 3: MCP ツールで API 情報を補完（任意）

より詳細な Props 情報が必要な場合:

```
mcp__aegis__get_component_detail("{ComponentName}")
```

### Step 4: 情報の提供

読み込んだドキュメントから以下を抽出して提供:

1. **使用時の注意点** - 必ず守るべきルール
2. **Q&A** - よくある質問と回答
3. **カタログ（Storybook）** - 実装例

## 利用可能なコンポーネント一覧

主要なコンポーネント（全94種類）:

### レイアウト
PageLayout, Card, Dialog, Drawer, Popover, BottomSheet

### フォーム
Button, TextField, Textarea, Select, Combobox, Checkbox, Radio, Switch, DatePicker, DateField, TimeField, TagInput, TagPicker

### 表示
Table, ActionList, DescriptionList, NavList, Tree, Banner, Badge, Tag, StatusLabel, Avatar

### ナビゲーション
Breadcrumb, Tabs, Pagination, Stepper, Sidebar

### フィードバック
Snackbar, ProgressBar, ProgressCircle, Skeleton, EmptyState

## 複数コンポーネント実装時

コード内で複数の Aegis コンポーネントを使用している場合:

1. 使用されている全コンポーネントを特定
2. 各コンポーネントのドキュメントを順次読み込み
3. 特に重要な注意点（⚠️マーク付き）を優先的に共有

## 注意事項

- ドキュメントが見つからない場合は `mcp__aegis__list_components` で正確な名前を確認
- `src/pages/sandbox/` のコードは参照しない（`src/pages/template/` を参照）

## 関連スキル

- `/design-token-resolver` - デザイントークンの検索
- `/page-layout-assistant` - PageLayout パターンの選択
