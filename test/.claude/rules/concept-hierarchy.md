---
paths: src/pages/sandbox/**,src/pages/template/**
---

# Concept Hierarchy | コンセプト階層

サービス固有ページ（sandbox / template）で作業する際、ドメイン知識として同ディレクトリの CONCEPT.md を参照する。

## コンセプト配置

CONCEPT.md はコードと co-location で `src/pages/template/` 配下に配置されている:

```
src/pages/template/
├── loc/
│   ├── CONCEPT.md              # LegalOn サービスコンセプト
│   └── case/
│       ├── CONCEPT.md          # 案件管理 機能コンセプト
│       └── index.tsx
├── dealon/
│   ├── CONCEPT.md              # DealOn サービスコンセプト
│   └── ...
├── workon/
│   ├── CONCEPT.md              # WorkOn サービスコンセプト
│   └── ...
└── _concept-templates/          # テンプレート雛形
    ├── service-concept.template.md
    └── feature-concept.template.md
```

## コンセプト解決手順

### Step 1: パスからサービスを検出

作業対象パスの第4セグメント（`src/pages/{sandbox|template}/` の直下）でサービスを判定する:

```
src/pages/sandbox/loc/...     → loc
src/pages/sandbox/dealon/...  → dealon
src/pages/sandbox/workon/...  → workon
src/pages/template/loc/...    → loc
```

サービスが特定できない場合（共有ページ・ユーザーページ等）はスキップ。

### Step 2: サービス CONCEPT.md を読み込む

```
src/pages/template/{service}/CONCEPT.md
```

ビジョン、主要エンティティ、用語集を把握する。

### Step 3: 機能 CONCEPT.md を特定・読み込む

ユーザーのプロンプトに含まれるキーワードを、各機能 CONCEPT.md の frontmatter `keywords` と照合する。

```
「案件一覧を作って」 → keywords に "案件" → src/pages/template/loc/case/CONCEPT.md
「レビュー画面」    → keywords に "レビュー" → src/pages/template/loc/contract-review/CONCEPT.md
```

該当する機能 CONCEPT.md があれば読み込む。なければサービスレベルのみで進める。

## 活用方法

| コンセプトの情報 | 活用先 |
|----------------|-------|
| Terminology の UI ラベル | ボタンラベル、見出し、カラムヘッダー |
| Terminology の英語名 | 変数名、型名、定数名 |
| Core Entities / Domain Model | TypeScript の interface / type 定義 |
| Key Workflows | 画面遷移、ステータス管理のロジック |
| Key Screens | PageLayout パターンの選択 |
| Business Rules | バリデーション、条件分岐のロジック |

## 注意事項

- CONCEPT.md に `{TODO}` マーカーがある場合、そのセクションは未記入。推測で補完してよいが、推測であることをコメントに明記する
- コンセプトの用語と Aegis コンポーネントの Props 名が異なる場合、Props に合わせつつ表示ラベルにコンセプトの用語を使う
- 新しいエンティティやワークフローを発見した場合、CONCEPT.md の更新を提案する
