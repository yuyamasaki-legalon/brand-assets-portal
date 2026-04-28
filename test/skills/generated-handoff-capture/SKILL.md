---
name: generated-handoff-capture
description: "sandbox UI の会話ベース開発中に、プロトタイプコードを分析して auto-generated-handoff.md を自動作成・更新。エンジニアが実装に必要な差分・コンポーネント・データモデル・本番マッピングを自動抽出。WHEN: sandbox ページを開発しているとき（proactive に自動実行）。NOT WHEN: template の編集、sandbox 以外の開発。"
---

# Generated Handoff Capture

sandbox UI の会話ベース開発で、AI が自動的に `auto-generated-handoff.md` を生成・更新する。

**原則: ユーザーに負担をかけない。** プロトタイプコードから AI が自律的に分析して書く。ユーザーにハンドオフ資料の記入や確認を求めない。

**読み手: プロダクトエンジニア。** loc-app 等に精通しており、差分と実装箇所がわかれば自走できる前提。

## 手順

### 1. 対象ページの特定

- 対象: `src/pages/sandbox/**/index.tsx`
- ハンドオフ: 同じディレクトリの `auto-generated-handoff.md`

### 2. パス解決

対象パスからサービスを抽出し、対応 template を自動マッチング:

```
src/pages/sandbox/loc/{user}/{feature}/  → template: src/pages/template/loc/
src/pages/sandbox/dealon/{user}/{feature}/ → template: src/pages/template/dealon/
```

- `src/pages/template/{service}/CONCEPT.md` を読み込む
- キーワードで機能 CONCEPT.md `src/pages/template/{service}/{feature}/CONCEPT.md` も特定・読み込む

### 3. ソース読み込み

以下のファイルを収集・分析:

| ソース | 目的 |
|--------|------|
| sandbox の全 `.tsx`, `.ts` ファイル | プロトタイプの実装内容 |
| 対応する template（あれば） | 差分の基準 |
| `auto-generated-prd.md`（あれば） | 要件コンテキスト |
| `.sync-manifest.json`（あれば） | 本番コードパスのマッピング |

### 4. コード分析

sandbox コードから以下を抽出:

| 抽出対象 | 方法 |
|---------|------|
| Aegis コンポーネント | `import { ... } from "@legalforce/aegis-react"` を解析 |
| PageLayout 構造 | JSX 内の `<PageLayout>`, `<Sidebar>`, `<Pane>` 等を検出 |
| useState / state | `useState` 呼び出しから状態名・型・初期値を抽出 |
| イベントハンドラ | `handle*`, `on*` 関数を検出 |
| TypeScript 型定義 | `interface`, `type` 宣言を抽出 |
| モックデータ | 定数定義・ダミーデータから API コントラクトを推測 |

### 5. 差分分析（template がある場合）

template と sandbox を比較し、変更をカテゴリ分類:

| カテゴリ | 検出方法 |
|---------|---------|
| レイアウト | PageLayout 構造の差分 |
| コンポーネント | 追加・削除・変更されたコンポーネント |
| インタラクション | 新規・変更されたイベントハンドラ |
| データモデル | 新規・変更された型定義 |

template がない場合は「新規画面」として全体像を記述する。

### 5.5. コード差分の抽出

sandbox 固有の実装箇所について、実際の JSX コードスニペットを抽出する。エンジニアが「何がどう変わったか」をコードレベルで即座に把握できるようにする。

**抽出対象:**
- sandbox で新規追加された JSX ブロック（template に存在しない部分）
- template から構造が変更された JSX ブロック（前後比較）
- 新規追加された型定義・モックデータ

**記載ルール:**
- 各差分には変更の意図を1行コメントで付記する
- 長い JSX は要点のみ抜粋し、省略部分は `{/* ... */}` で示す
- template がある場合は Before/After 形式で比較する
- template がない場合は主要な JSX ブロックをそのまま掲載する

### 6. 本番マッピング

`.sync-manifest.json` を参照し、sandbox の対応 template → 本番コードパスを導出:

```
sandbox/loc/{user}/case-detail
  → template: case/detail/index.tsx
  → manifest entry: case/detail/index.tsx
  → locService: legal-management-f
  → locPagePath: pages/show
```

### 7. `auto-generated-handoff.md` 生成/更新

- ファイルがなければ新規作成
- 既にあれば内容を更新（Change Log に追記）
- 出力フォーマットは `references/output-template.md` に従う

## 新規画面 vs 既存画面の出力差異

| セクション | 既存画面（template あり） | 新規画面（template なし） |
|-----------|------------------------|------------------------|
| 変更概要 | 差分カテゴリテーブル | 「新規画面」として全体像 |
| コード差分 | Before/After 形式で JSX 差分 | 主要 JSX ブロックを掲載 |
| コンポーネント使用一覧 | 新規/変更のみハイライト | 全コンポーネント列挙（**主要セクション**） |
| データモデル | 新規・変更された型のみ | 全型定義（**主要セクション**） |
| 実装ガイダンス | 本番コード対応箇所 + 変更ステップ | 新規ファイル作成のガイド |

## 記載ルール

- API コントラクトヒントには `⚠️ 推測` マークを必ず付ける
- コンポーネントは `新規` / `既存` を区別する
- 本番コードパスは `.sync-manifest.json` から正確に引用する
- ユーザーへの質問は行わない — 不明点は推測し、推測であることを明記する

## 関連スキル

- `generated-prd-capture`: 要件の自動キャプチャ（同一パターン）
- `spec-generator`: コード分析ワークフローの参考
- `loc-sync`: sync-manifest 連携
- `structured-prototype`: Container/Presentation パターン
