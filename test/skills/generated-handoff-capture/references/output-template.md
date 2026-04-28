# auto-generated-handoff.md 出力テンプレート

以下の構造に従って `auto-generated-handoff.md` を生成する。

---

```markdown
# {プロトタイプ名} — エンジニアハンドオフ

> Auto-generated from sandbox prototype. Last updated: {YYYY-MM-DD}

## サマリー

{プロトタイプの概要と主な変更点を1-3文で記述}

- **ベース**: `src/pages/template/{service}/{feature}/` （または「新規画面」）
- **sandbox**: `src/pages/sandbox/{path}/`
- **PRD**: `auto-generated-prd.md`

## 変更概要

| カテゴリ | 変更内容 | 影響度 |
|---------|---------|-------|
| レイアウト | {PageLayout 構造の変更内容} | {High/Medium/Low} |
| コンポーネント | {追加・変更されたコンポーネント} | {High/Medium/Low} |
| インタラクション | {新規・変更されたイベントハンドラ} | {High/Medium/Low} |
| データモデル | {新規・変更された型定義} | {High/Medium/Low} |

## コード差分

sandbox で新規追加・変更された主要な JSX ブロック。

### {変更箇所のタイトル}（新規追加 / 変更）

> {変更の意図を1行で説明}

**Before（template）:**
```tsx
{template 側の該当 JSX。新規追加の場合は「該当なし（新規追加）」}
```

**After（sandbox）:**
```tsx
{sandbox 側の JSX スニペット。長い場合は要点のみ抜粋し {/* ... */} で省略}
```

### {次の変更箇所} ...

{変更箇所ごとに Before/After を繰り返す}

## コンポーネント使用一覧

| コンポーネント | 用途 | 区分 |
|---------------|------|------|
| {ComponentName} | {具体的な用途} | 新規 / 既存 |

## データモデル

```typescript
// 新規 or 変更された型定義
interface {TypeName} {
  {field}: {type};
}
```

## API コントラクトヒント

⚠️ 以下はモックデータから推測した API コントラクトです。実際の API 設計時に検証してください。

| エンドポイント（推測） | メソッド | リクエスト/レスポンス概要 |
|----------------------|---------|------------------------|
| {推測パス} | {GET/POST/...} | {概要} |

## 実装ガイダンス

### 本番コード対応箇所

| 項目 | パス |
|------|------|
| サービス | `lib/loc-app/services/{locService}/` |
| ページ | `src/{locPagePath}/` |
| 関連パーツ | `{locPartsGlobs}` |

### 実装ステップ

1. {具体的な実装ステップ}
2. ...

## 関連ドキュメント

| ドキュメント | パス |
|-------------|------|
| PRD | `auto-generated-prd.md` |
| SPEC | `SPEC.md`（あれば） |
| サービスコンセプト | `src/pages/template/{service}/CONCEPT.md` |
| 機能コンセプト | `src/pages/template/{service}/{feature}/CONCEPT.md`（あれば） |
| テンプレート | `src/pages/template/{service}/{feature}/index.tsx`（あれば） |

## Change Log

| 日付 | 変更内容 |
|------|---------|
| {YYYY-MM-DD} | 初回生成 |
```

---

## 新規画面の場合の調整

template がない場合、以下のセクションを変更:

- **変更概要**: 「新規画面」として全体構成を記述（差分ではなく全体像）
- **コード差分**: Before/After ではなく、主要 JSX ブロックをそのまま掲載（「新規実装」として）
- **コンポーネント使用一覧**: 区分を全て「新規」とし、全コンポーネントを網羅
- **データモデル**: 全型定義を記載
- **実装ガイダンス**: 「本番コード対応箇所」→ 「新規ファイル作成先の提案」に変更
