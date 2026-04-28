---
name: help-aegis-lab
description: >-
  aegis-lab の概要・使い方・ワークフローを説明するオンボーディングガイド。
  WHEN: aegis-lab を初めて使う人、プロジェクトの仕組みを知りたいとき、
  「aegis-lab って何？」「どうやって使うの？」「Preview URL って何？」と聞かれたとき。
  NOT WHEN: 具体的な実装作業中（→ /sandbox-creator, /page-layout-assistant, /publish）。
---

# aegis-lab オンボーディングガイド

ユーザーの質問に応じて、以下の情報を適切に組み合わせて回答する。
初めての人には「aegis-lab とは」から順に説明し、特定の質問には該当セクションを直接回答する。

---

## aegis-lab とは

aegis-lab は **Aegis デザインシステムを使った UI プロトタイピング環境**。

- **技術スタック**: React + TypeScript + Vite
- **デザインシステム**: `@legalforce/aegis-react` のコンポーネントのみを使用
- **デプロイ先**: Cloudflare Workers（PR ごとに自動で Preview URL が発行される）
- **パッケージマネージャ**: pnpm

エンジニアもデザイナーも PM も、**会話ベースで UI プロトタイプを作り、Preview URL で共有**できる。
コードを書かなくても、Claude に「こういう画面を作って」と伝えるだけでプロトタイプが完成する。

---

## 中心的なワークフロー

```
Template（お手本） → Sandbox（実験場） → Preview URL（共有）
```

### 1. Template: お手本コード

`src/pages/template/` にある**本番品質のレイアウト集**。
一覧画面、詳細画面、設定画面、チャット UI など、よくあるパターンが揃っている。

- `CATALOG.md` でキーワード検索して最適なテンプレートを見つける
- テンプレートは**読み取り専用**（直接編集しない）
- サービス固有の用語は `CONCEPT.md` に定義されている

### 2. Sandbox: 実験場

`src/pages/sandbox/` がプロトタイプの作業場所。

| エリア | パス | 用途 |
|--------|------|------|
| プロダクト別 | `sandbox/loc/`, `sandbox/workon/` | プロダクトテーマ適用（推奨） |
| ユーザー環境 | `sandbox/users/{username}/` | 個人の実験用 |
| 共有ページ | `sandbox/{page-name}/` | チーム共有の実験ページ |

新しいページは `pnpm sandbox:create` で作成する（ルーティング登録も自動）。

### 3. Preview URL: 共有

PR を作成すると、自動で Preview URL が発行される:

```
https://pr-{PR番号}-aegis-lab.on-technologies-technical-dept.workers.dev
```

**安定 URL が必要な場合**（リンクが PR マージ後も有効）:

1. PR に `preview:{slug}` ラベルを付ける（例: `preview:clm-report`）
2. 安定 URL が発行される:
   ```
   https://{slug}-aegis-lab.on-technologies-technical-dept.workers.dev
   ```
3. マージ後もスナップショットとして残る（更新したい場合は同じラベルで新しい PR を作成）

**slug のルール**: 小文字英数字とハイフンのみ、英数字で始まる、31文字以内。

---

## はじめかた（クイックスタート）

### 環境構築

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd aegis-lab

# 2. 依存パッケージをインストール
pnpm install

# 3. 開発サーバーを起動
pnpm dev
# → http://localhost:5173 でアクセス
```

### プロトタイプを作る

Claude に話しかけるだけで OK:

```
「契約一覧画面を作って」
「サイドバー付きの設定画面が欲しい」
「チャット UI のプロトタイプを作りたい」
```

Claude が自動で以下を行う:
1. 最適なテンプレートを選択
2. `pnpm sandbox:create` でページを作成
3. Aegis コンポーネントで UI を実装
4. 要件ドキュメント（PRD）を自動生成

### 共有する

プロトタイプが完成したら:

```
「公開して」「Preview URL を発行して」「PR を作って」
```

Claude が `/publish` スキルで PR 作成から Preview URL の共有まで自動で行う。

---

## よく使うコマンド

| コマンド | 用途 |
|---------|------|
| `pnpm dev` | 開発サーバー起動（http://localhost:5173） |
| `pnpm build` | ビルド + 型チェック（PR 前に必須） |
| `pnpm format` | リント + 自動修正（コミット前に必須） |
| `pnpm sandbox:create` | 新しい sandbox ページを作成 |

---

## 自動生成されるドキュメント

sandbox ページの開発中に、Claude が以下のドキュメントを自動で作成・更新する:

| ファイル | 内容 |
|---------|------|
| `auto-generated-prd.md` | 会話から抽出した要件定義 |
| `auto-generated-handoff.md` | エンジニア向け実装引き継ぎ情報 |
| `auto-generated-insights.md` | イテレーションの洞察（修正が多い場合のみ） |

これらはユーザーが書く必要はない。Claude が自動で管理する。

---

## プロジェクト構造（概要）

```
aegis-lab/
├── src/pages/
│   ├── template/      # お手本コード（読み取り専用）
│   │   ├── CATALOG.md # テンプレート検索用カタログ
│   │   └── {service}/ # サービス別テンプレート + CONCEPT.md
│   └── sandbox/       # プロトタイプ作業場所
│       ├── index.tsx   # sandbox 一覧ページ
│       ├── routes.tsx  # ルーティング定義
│       └── {page}/     # 各プロトタイプページ
├── docs/              # 詳細ドキュメント
├── skills/            # Claude Code スキル定義
└── CLAUDE.md          # AI エージェント向けガイドライン
```

---

## 便利なスキル一覧

aegis-lab には Claude Code 用のスキルが多数用意されている:

| スキル | 用途 |
|--------|------|
| `/sandbox-creator` | sandbox ページの作成ガイド |
| `/page-layout-assistant` | レイアウトパターンの提案 |
| `/component-tips {Name}` | Aegis コンポーネントの使い方 |
| `/icon-finder` | アイコンのキーワード検索 |
| `/design-token-resolver` | デザイントークンの検索 |
| `/publish` | プロトタイプの PR 作成と共有 |
| `/commit-message` | コミットメッセージの生成 |
| `/i18n-sandbox` | 多言語化の追加 |

---

## MCP ツール

Aegis デザインシステムの情報を調べるための MCP ツールが利用可能:

| ツール | 用途 |
|--------|------|
| `mcp__aegis__list_components` | コンポーネント一覧 |
| `mcp__aegis__get_component_details` | コンポーネントの Props・使用例 |
| `mcp__aegis__list_icons` | アイコン一覧 |
| `mcp__aegis__list_tokens` | デザイントークン一覧 |

---

## よくある質問

### Q: sandbox と template の違いは？
- **template**: 本番品質のお手本コード。読み取り専用。
- **sandbox**: 自由に実験できる作業場。ここでプロトタイプを作る。

### Q: Preview URL はいつ消える？
- **PR 固有 URL** (`pr-{N}-...`): PR がクローズされると消える。
- **安定 URL** (`{slug}-...`): PR マージ後もスナップショットとして残る。ラベルを外すと 410 Gone。

### Q: コードを書けなくても使える？
はい。Claude に自然言語で指示するだけでプロトタイプが作れる。
「こういう画面を作って」「ここを変えて」と会話するだけで OK。

### Q: 本番コードにそのまま使える？
sandbox のコードは実験品質。本番移行には `/structured-prototype` パターンと
`auto-generated-handoff.md` を活用して、エンジニアが適切にリファクタリングする。

---

## 詳細ドキュメント

より詳しい情報が必要な場合は以下を参照:

- `docs/onboarding-guide.md` - セットアップ詳細
- `docs/sandbox-guide.md` - sandbox の詳細ガイド
- `docs/workflow-guide.md` - ワークフロー詳細（Preview URL 設定含む）
- `docs/aegis-integration-guide.md` - Aegis コンポーネント統合ガイド
- `docs/directory-structure.md` - ディレクトリ構造の全体像
