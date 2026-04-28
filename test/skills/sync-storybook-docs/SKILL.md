---
name: sync-storybook-docs
description: "Aegis Storybook と docs/rules/component/ のサンプルコードを同期。WHEN: Aegis のバージョンアップ後にコンポーネントドキュメントを最新化するとき、Storybook のサンプルコードと docs の乖離を修正するとき。NOT WHEN: 新規コンポーネントルールの作成、コンポーネントの使い方確認（→ component-tips）。"
disable-model-invocation: true
---

# Storybook サンプル同期

lib/aegis の最新 Storybook と docs/rules/component/ のサンプルコードを同期する。

## 使用方法

```bash
/sync-storybook-docs              # 全コンポーネントを同期
/sync-storybook-docs Button       # 特定コンポーネントのみ
```

---

## 実行手順

### Step 1: 対象ファイルの確認

`$ARGUMENTS` からコンポーネント名を取得する。

- 引数がある場合: そのコンポーネントのみを対象
- 引数がない場合: 全コンポーネントを対象

**比較対象:**

| Source | Target |
|--------|--------|
| `lib/aegis/packages/react/stories/components/*.stories.tsx` | `docs/rules/component/*.md` |

### Step 2: 差分検出

各 `docs/rules/component/{ComponentName}.md` ファイルについて:

1. `<!-- STORYBOOK_CATALOG_START -->` ～ `<!-- STORYBOOK_CATALOG_END -->` 内のコードブロックを抽出
2. 対応する `lib/aegis/packages/react/stories/components/{ComponentName}.stories.tsx` と比較
3. 以下の差分を検出:
   - import 文の変更
   - コンポーネント API の変更
   - ストーリーの追加・削除
   - Props や引数の変更

### Step 3: 修正実行

検出した差分を修正する。

**修正の優先度:**

| 優先度 | 内容 |
|--------|------|
| 重大 | API 全体の変更（コンポーネント名、Props 構造の変更） |
| 中程度 | ストーリーの欠落、新しい Props の追加 |
| 軽微 | フォーマット、chromatic 設定のみの違い |

**除外項目（同期対象外）:**

- `play:` 関数（テスト用のため docs では不要）
- `parameters.chromatic` 設定（Chromatic 専用設定のため）
- import の順序のみの違い（機能に影響しない）

### Step 4: 検証

修正完了後にビルドを実行:

```bash
pnpm build
```

---

## 注意事項

- `notion_page_id` は絶対に変更しない
- `STORYBOOK_CATALOG` マーカー外のドキュメント説明文は必要に応じて更新
- 大量の変更がある場合は、コンポーネントごとに段階的に修正

## 関連スキル

- `/component-tips` - コンポーネントの使い方
