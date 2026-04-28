# Sandbox ページ作成ガイド

Sandbox は、Aegis コンポーネントを試したり、レイアウトを実験したりするための場所です。

## レイアウト設計の基本ステップ

Sandbox でページを組むときは、次の順番に沿うと破綻しにくくなります：

1. **PageLayout で外枠を決める** - 必要な要素（ヘッダー、サイドバー、ペインなど）を先に配置
2. **中身のレイアウトを組む** - Aegis のレイアウト系コンポーネントでセクションを区切る
3. **variant / size / spacing を当てる** - 既存の variant とデザイントークンを選ぶ

コード例は `src/pages/template/` を参照（Sandbox の既存コードは実験用なので参照しない）。

---

## Sandbox の構造

Sandbox は以下の3つのエリアで構成されています：

### プロダクト別エリア（推奨）

```
src/pages/sandbox/
├── loc/                  # LegalOn プロダクト用（テーマ適用）
│   ├── wataryooou/       # ユーザー別ページ
│   ├── codex/
│   └── ...
└── workon/               # WorkOn プロダクト用（テーマ適用）
    └── wataryooou/
```

プロダクト固有のテーマが適用されるため、本番環境に近い見た目で検証できます。

### ユーザー環境

```
src/pages/sandbox/users/  # ユーザー個人の実験用
├── wataryooou/
├── chie/
└── ...
```

`pnpm sandbox:create-user` で作成できます。

### 共有ページ

```
src/pages/sandbox/        # 共有の実験ページ
├── case-list-paging/
├── analytics/
└── ...
```

`pnpm sandbox:create` で `--location flat` を指定すると作成されます。

---

## ページを作成する

```bash
pnpm sandbox:create
```

対話形式で質問に答えるか、CLI オプションで指定：

```bash
pnpm sandbox:create --name "User Profile" --template with-sidebar
pnpm sandbox:create -n "Dashboard" -t blank --date-suffix
```

### CLI オプション

| オプション | 説明 |
|-----------|------|
| `--name, -n` | ページ名（必須） |
| `--description, -d` | 説明 |
| `--template, -t` | テンプレート（デフォルト: blank） |
| `--date-suffix` | 日付サフィックスを追加 |
| `--location, -l` | 作成場所（flat / user / loc / workon） |
| `--user, -u` | ユーザー名（location が user / loc / workon 時に必須） |

### 生成されるファイル

新規ページ作成時、以下が自動生成されます：

- `index.tsx`（画面本体）
- `auto-generated-prd.md`（会話ベース要件ログ）

### テンプレート一覧

| テンプレート | 説明 |
|-------------|------|
| `blank` | 最小限（デフォルト） |
| `basic-layout` | サイドバー、ペイン、コンテンツすべて |
| `with-sidebar` | サイドナビゲーション付き |
| `with-pane` | 開閉可能なペイン付き |
| `with-resizable-pane` | リサイズ可能なペイン付き |
| `scroll-inside` | 内部スクロール |
| `with-sticky-container` | 固定コンテナ付き |

---

## 既存テンプレートを参考に実装する

`pnpm sandbox:copy-template` は廃止済みです。既存テンプレートを使う場合は、テンプレートカタログを source of truth として参照し、`pnpm sandbox:create` で sandbox 登録だけを先に済ませてから実装します。

1. `src/pages/template/CATALOG.md` をキーワード検索し、近いテンプレートを選ぶ
2. 選んだテンプレートの source code を読む
3. サービス固有ページでは `src/pages/template/{service}/CONCEPT.md` と feature の `CONCEPT.md` を確認する
4. `pnpm sandbox:create` でページを作成する
5. 生成された `index.tsx` をテンプレートを参考に実装し、必要な co-located file だけを追加する

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
