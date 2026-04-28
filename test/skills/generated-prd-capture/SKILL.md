---
name: generated-prd-capture
description: "sandbox UI の会話ベース開発中に、ユーザープロンプトから要件を推測して auto-generated-prd.md を自動作成・更新。WHEN: sandbox ページを会話しながら作っているとき（proactive に自動実行）。NOT WHEN: 対話的な PRD 作成（→ prd-generator）、sandbox 以外の開発。"
---

# Generated PRD Capture

sandbox UI の会話ベース開発で、AI が自動的に `auto-generated-prd.md` を生成・更新する。

**原則: ユーザーに負担をかけない。** 要件はプロンプトから AI が汲み取って自動で書く。ユーザーに PRD の記入や確認を求めない。

## 手順

1. 対象ページの特定
- 対象: `src/pages/sandbox/**/index.tsx`
- PRD: 同じディレクトリの `auto-generated-prd.md`

2. ファイル作成
- `auto-generated-prd.md` がなければ作成する
- 既にあれば内容を保持して更新する

3. コンセプト参照
- 対象ページがサービスディレクトリ配下の場合、`src/pages/template/{service}/CONCEPT.md` を読み込む
- コンセプトの用語集・エンティティを参照して推測精度を向上させる
- キーワードで機能コンセプト `src/pages/template/{service}/{feature}/CONCEPT.md` も特定・読み込む

4. プロンプト解析（AI が自動実行）
- ユーザー発話から次を **AI が自動で** 抽出・推測する
  - `Confirmed Requirements` — ユーザーが明示した内容
  - `Inferred Requirements` — AI が文脈から推測した内容（confidence 付き）
  - `Open Questions` — AI が判断に迷った点（実装時に AI が自己判断する材料）
  - `UI Mapping (Requirement -> Aegis Component)`

5. ログ更新
- `Prompt Log` に最新プロンプトを追加
- `Change Log` に更新日時と変更点を追記

## 記載ルール

- Confirmed は明示要件のみ（推測を混ぜない）
- Inferred は `[confidence: 0.00-1.00]` 形式
- UI Mapping は Aegis コンポーネント名を使う
- Open Questions はユーザーへの質問ではなく、AI が実装時に判断するための備忘録として書く

## 出力フォーマット

- ファイル名は必ず `auto-generated-prd.md`
- 配置は対象ページと同階層
- Markdown セクション:
  - `Snapshot`
  - `Concept Reference`（該当するコンセプトファイルパスを記載）
  - `Confirmed Requirements`
  - `Inferred Requirements`
  - `Open Questions`
  - `UI Mapping (Requirement -> Aegis Component)`
  - `Prompt Log`
  - `Change Log`

## 関連スキル

- `prd-generator`: 正式な PRD 作成が必要な場合
- `prototype-generator`: SPEC から UI 実装を起こす場合
- `page-layout-assistant`: レイアウトパターン選定
