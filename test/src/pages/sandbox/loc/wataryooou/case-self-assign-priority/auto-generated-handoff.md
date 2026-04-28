# 案件一覧プロトタイプ B — エンジニアハンドオフ

> Auto-generated from sandbox prototype. Last updated: 2026-03-17

## サマリー

期限や更新状況からおすすめ案件を上部カードで提示し、そのまま自分の担当案件にする案。一覧そのものは残しつつ、探索より先に「判断済みの候補」を提示する構成に変えている。

- **ベース**: `src/pages/template/loc/case/index.tsx`
- **sandbox**: `src/pages/sandbox/loc/wataryooou/case-self-assign-priority/`
- **PRD**: `auto-generated-prd.md`

## 変更概要

| カテゴリ | 変更内容 | 影響度 |
|---------|---------|-------|
| レイアウト | テーブルの前段におすすめカード群を追加 | Medium |
| コンポーネント | `Card`、`Banner`、理由表示付き `DataTable` を追加 | Medium |
| インタラクション | 候補カードまたは行アクションから即担当化 | High |
| データモデル | `priorityScore` と `recommendationReasons` を可視化 | Medium |

## コード差分

### おすすめ候補カード（新規追加）

> 一覧全体を見る前に、今取るべき案件を上部で提示する。

**Before（template）:**
```tsx
{/* 該当なし（新規追加） */}
```

**After（sandbox）:**
```tsx
{recommendedCases.map((caseItem) => (
  <Card key={caseItem.id}>
    <CardBody>
      <Text variant="title.xSmall">{caseItem.title}</Text>
      <Text variant="body.small" color="subtle">
        {caseItem.recommendationReasons.join(" / ")}
      </Text>
      <Button onClick={() => assignCase(caseItem.id)}>担当する</Button>
    </CardBody>
  </Card>
))}
```

### 理由付きテーブル列（変更）

> 推薦理由を一覧上でも確認できるようにする。

**Before（template）:**
```tsx
const caseColumns = [/* 担当理由列はない */];
```

**After（sandbox）:**
```tsx
columns.push({
  id: "recommendation",
  name: "担当候補の理由",
  getValue: (row) => row.recommendationReasons[0] ?? "",
});
```

## コンポーネント使用一覧

| コンポーネント | 用途 | 区分 |
|---------------|------|------|
| `Card` | おすすめ候補の先出し | 新規 |
| `DataTable` | 一覧確認と即担当化 | 変更 |
| `Banner` | 担当化完了フィードバック | 新規 |
| `Toolbar` | 検索・ソート・所有フィルタ | 既存 |
| `Button` | 候補からの即時担当化 | 既存 |

## データモデル

```typescript
type MatterCase = {
  id: string;
  title: string;
  priorityScore: number;
  recommendationReasons: string[];
  assigneeState: "unassigned" | "assigned-to-me" | "assigned-to-other";
};
```

## API コントラクトヒント

⚠️ 以下はモックデータから推測した API コントラクトです。実際の API 設計時に検証してください。

| エンドポイント（推測） | メソッド | リクエスト/レスポンス概要 |
|----------------------|---------|------------------------|
| `/api/loc/cases/recommendations/self-assign` | `GET` | ユーザー向けの優先案件を理由付きで返す |
| `/api/loc/cases/self-assign` | `POST` | 単一案件の担当変更を返す |

## 実装ガイダンス

### 新規ファイル作成先の提案

| 項目 | パス |
|------|------|
| 案件推薦 UI | `src/pages/template/loc/case/` |
| 推薦ロジック | `lib/loc-app/.../case-recommendation.ts` |
| 担当更新処理 | `lib/loc-app/.../case-assignment.ts` |

### 実装ステップ

1. 推薦ロジックをサーバー計算にするかクライアント計算にするか決める
2. 推薦理由の文言テンプレートを整備する
3. 担当化後の再推薦タイミングを定義する

## 関連ドキュメント

| ドキュメント | パス |
|-------------|------|
| PRD | `auto-generated-prd.md` |
| サービスコンセプト | `src/pages/template/loc/CONCEPT.md` |
| 機能コンセプト | `src/pages/template/loc/case/CONCEPT.md` |
| テンプレート | `src/pages/template/loc/case/index.tsx` |

## Change Log

| 日付 | 変更内容 |
|------|---------|
| 2026-03-17 | 初回生成 |

