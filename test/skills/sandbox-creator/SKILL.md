---
name: sandbox-creator
description: "Sandbox ページの作成方法、テンプレート選定、CLI オプションを案内。WHEN: 新規 sandbox ページを作成するとき、テンプレートの選び方を確認するとき。NOT WHEN: 既存ページの編集・修正、sandbox 以外のページ作成。"
---

# Sandbox ページ作成ガイド

Sandbox は、Aegis コンポーネントを試したり、レイアウトを実験したりするための場所。

## Sandbox の構造

Sandbox は3つのエリアで構成されています：

| エリア | パス | 説明 |
|--------|------|------|
| プロダクト別 | `loc/`, `workon/` | プロダクトテーマが適用される（推奨） |
| ユーザー環境 | `users/` | 個人の実験用 |
| 共有ページ | ルート直下 | 共有の実験ページ |

## コマンド一覧

| コマンド | 用途 |
|---------|------|
| `pnpm sandbox:create` | 組み込みテンプレートから新規ページ作成 |
| `pnpm sandbox:create-user` | ユーザー専用環境を作成 |

---

## pnpm sandbox:create

対話形式で実行するか、CLI オプションで指定:

```bash
# 対話形式
pnpm sandbox:create

# CLI オプション指定
pnpm sandbox:create --name "User Profile" --template with-sidebar
pnpm sandbox:create -n "Dashboard" -t blank --date-suffix

# LegalOn プロダクトエリアに作成（推奨）
pnpm sandbox:create --name "Case List" --location loc --user ryo-watanabe

# WorkOn プロダクトエリアに作成
pnpm sandbox:create --name "Profile" --location workon --user ryo-watanabe
```

### CLI オプション

| オプション | 説明 |
|-----------|------|
| `--name, -n` | ページ名（必須） |
| `--description, -d` | 説明 |
| `--template, -t` | テンプレート（デフォルト: blank） |
| `--date-suffix` | 日付サフィックスを追加（YYYYMMDD） |
| `--location, -l` | 作成場所（flat / user / loc / workon） |
| `--user, -u` | ユーザー名（location が user / loc / workon 時に必須） |

### テンプレート一覧

| テンプレート | 説明 |
|-------------|------|
| `blank` | 最小限の PageLayout（デフォルト） |
| `basic-layout` | Sidebar, Pane, Main すべて含む |
| `with-sidebar` | SideNavigation 付き |
| `with-pane` | 開閉可能な右ペイン付き |
| `with-resizable-pane` | ドラッグでリサイズ可能なペイン付き |
| `scroll-inside` | 内部スクロール対応 |
| `with-sticky-container` | 固定ヘッダー/フッターコンテナ付き |

---

## 既存テンプレートを参考に実装する

`pnpm sandbox:copy-template` は廃止済み。既存テンプレートを丸ごとコピーする代わりに、`src/pages/template/CATALOG.md` を検索して参照元を決め、`pnpm sandbox:create` で sandbox 登録を行ってから必要な UI を実装する。

1. `src/pages/template/CATALOG.md` をキーワード検索し、最も近いテンプレートを特定する
2. 該当テンプレートの source と、サービス固有ページなら `CONCEPT.md` を読む
3. `pnpm sandbox:create` でページを作成する（登録はこのコマンドに任せる）
4. 生成された `index.tsx` をテンプレート実装に合わせて編集する
5. テンプレートが co-located file を持つ場合は、必要なファイルだけを意図して追加する

---

## pnpm sandbox:create-user

ユーザー専用の Sandbox 環境を作成:

```bash
# 対話形式
pnpm sandbox:create-user

# CLI オプション指定
pnpm sandbox:create-user --user ryo-watanabe
pnpm sandbox:create-user -u john-doe
```

作成される構造:
```
src/pages/sandbox/users/{username}/
├── index.tsx      # ユーザー Sandbox ホーム
├── routes.tsx     # ユーザー固有のルート定義
└── [pages]/       # ユーザーのページを追加
```

> **Note**: プロダクトテーマを適用したい場合は、`pnpm sandbox:create` で `--location loc` または `--location workon` を使用してください。

---

## 新規ページ作成チェックリスト

作成手順をトラックする:

```
Task Progress:
- [ ] Step 1: 参照テンプレート選択（`CATALOG.md` / blank / with-sidebar など）
- [ ] Step 1.5: コンセプト読み込み（プロダクトエリア選択時）
- [ ] Step 2: コマンド実行（pnpm sandbox:create）
- [ ] Step 3: PRD 初期化（下記「PRD の初期化」参照）
- [ ] Step 4: 開発サーバーで動作確認（pnpm dev）
- [ ] Step 5: 必要に応じてレイアウト調整
```

### Step 1.5: コンセプト読み込み

プロダクトエリア（`loc` / `dealon` / `workon`）を選択した場合、ページ作成前にコンセプト文書を読み込む:

1. **サービスコンセプト**: `src/pages/template/{service}/CONCEPT.md` を読み込み、用語集・エンティティを把握
2. **機能コンセプト**: ページの目的に合致する `src/pages/template/{service}/{feature}/CONCEPT.md` があれば読み込み
3. **活用**: 用語を UI ラベル・変数名に反映、エンティティを型定義に使用

詳細は `.claude/rules/concept-hierarchy.md` を参照。

### PRD の自動生成

ページ作成後、AI がユーザーのプロンプトから自動で `auto-generated-prd.md` を生成する:

1. 会話から要件を抽出し、`Confirmed Requirements` と `Inferred Requirements` に分類する
2. `{TBD}` プレースホルダーは残さず、不明な点は AI が推測して Inferred に記載する
3. 非自明なページの場合は `/structured-prototype`（Container/Presentation 分離）を推奨する

> **重要**: PRD はユーザーに書かせない。AI が自動で生成・更新する。

---

## レイアウト設計の基本ステップ

Sandbox でページを組むときの順序:

1. **PageLayout で外枠を決める** - 必要な要素（ヘッダー、サイドバー、ペインなど）を配置
2. **中身のレイアウトを組む** - Aegis のレイアウト系コンポーネントでセクションを区切る
3. **variant / size / spacing を当てる** - 既存の variant とデザイントークンを選ぶ

コード例は `src/pages/template/` を参照（Sandbox の既存コードは実験用なので参照しない）。

> **Tip**: 本番移行を見据えたページの場合、`/structured-prototype` パターン（Container/Presentation 分離）を推奨。UI 層がそのままコピーでき、モックデータの差し替えだけで本番化できます。移行準備は `/migration-report` で確認できます。

---

## ページを削除する

1. `src/pages/sandbox/your-page-name/` ディレクトリを削除
2. `src/pages/sandbox/index.tsx` からカードを削除
3. `src/pages/sandbox/routes.tsx` から import とルートを削除

---

## 確認

```bash
pnpm dev
```

- 一覧: http://localhost:5173/sandbox
- 個別: http://localhost:5173/sandbox/your-page-name

---

## 関連スキル・ドキュメント

- `/page-layout-assistant` - PageLayout パターンの選択
- `/component-tips` - Aegis コンポーネントの使い方
- `docs/sandbox-guide.md` - 詳細ドキュメント
