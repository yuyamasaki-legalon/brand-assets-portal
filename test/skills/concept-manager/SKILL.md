---
name: concept-manager
description: "サービス/機能の CONCEPT.md（ドメイン用語・業務知識）を作成・更新・検索。WHEN: 新サービスや機能の CONCEPT.md を作るとき、既存コンセプトのドメイン用語を確認・更新するとき。NOT WHEN: プロトタイプの実装作業自体、PRD/SPEC の管理。"
user_invocable: true
arguments: "{subcommand} {args}"
disable-model-invocation: true
---

# Concept Manager

コンセプト階層システムの管理スキル。サービスコンセプト・機能コンセプトの作成、更新、検索を行う。

## 使用方法

```bash
/concept-manager create service {name}
/concept-manager create feature {service}/{feature}
/concept-manager update {concept-path}
/concept-manager search {keyword}
```

---

## サブコマンド

### `create service {name}`

テンプレートからサービスコンセプトを作成する。

**手順:**

1. `src/pages/template/_concept-templates/service-concept.template.md` を読み込む
2. `src/pages/template/{name}/CONCEPT.md` を作成
3. frontmatter を設定:
   - `type: service`
   - `name`: 引数から設定
   - `name_ja`: ユーザーに確認
   - `keywords`: サービスに関連するキーワード
   - `updated`: 今日の日付
4. 各セクションの記入をユーザーに案内

**例:**

```bash
/concept-manager create service loc
```

→ `src/pages/template/loc/CONCEPT.md` を作成

---

### `create feature {service}/{feature}`

親サービスのコンセプトを参照して機能コンセプトを作成する。

**手順:**

1. 親サービスの存在確認: `src/pages/template/{service}/CONCEPT.md` が存在するか確認
2. `src/pages/template/_concept-templates/feature-concept.template.md` を読み込む
3. `src/pages/template/{service}/{feature}/CONCEPT.md` を作成
4. frontmatter を設定:
   - `type: feature`
   - `name`: feature 名（英語）
   - `name_ja`: ユーザーに確認
   - `parent`: サービス名
   - `keywords`: 機能に関連するキーワード
   - `updated`: 今日の日付
5. 親サービスの `Features` テーブルにエントリを追加

**例:**

```bash
/concept-manager create feature loc/esign
```

→ `src/pages/template/loc/esign/CONCEPT.md` を作成し、`src/pages/template/loc/CONCEPT.md` の Features テーブルに追記

---

### `update {concept-path}`

既存コンセプトの内容を更新する。

**手順:**

1. `src/pages/template/{concept-path}/CONCEPT.md` を読み込む
2. ユーザーと対話して更新内容を確認
3. frontmatter の `updated` フィールドを今日の日付に更新
4. 指定されたセクションを更新

**例:**

```bash
/concept-manager update loc
/concept-manager update loc/case
```

---

### `search {keyword}`

キーワードでコンセプトを横断検索する。

**手順:**

1. `src/pages/template/` 配下の全 `CONCEPT.md` の frontmatter `keywords` を検索
2. ファイル本文のテキスト検索も実行
3. マッチしたコンセプトを一覧表示:
   - コンセプトパス
   - type（service / feature）
   - name / name_ja
   - マッチしたキーワード

**例:**

```bash
/concept-manager search 案件
/concept-manager search contract
```

**出力例:**

```
検索結果: "案件" に一致するコンセプト

| パス | タイプ | 名前 | マッチ |
|------|--------|------|--------|
| loc/ | service | LegalOn | keywords: 案件 |
| loc/case/ | feature | 案件管理 | keywords: 案件, name_ja |
```

---

## 関連ドキュメント

- `src/pages/template/_concept-templates/` - コンセプトテンプレート
- `.claude/rules/concept-hierarchy.md` - エージェントのコンセプト参照ルール
- `CLAUDE.md` - プロジェクト全体のガイドライン
