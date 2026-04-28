# 案件一覧プロトタイプ C — エンジニアハンドオフ

> Auto-generated from sandbox prototype. Last updated: 2026-03-17

## サマリー

案件をすぐ担当化せず、候補キューに積んでから負荷確認ダイアログでまとめて確定する案。引継ぎリスクや工数を見ながら慎重に担当を増やしたいケースを想定している。

- **ベース**: `src/pages/template/loc/case/index.tsx`
- **sandbox**: `src/pages/sandbox/loc/wataryooou/case-self-assign-workload/`
- **PRD**: `auto-generated-prd.md`

## 変更概要

| カテゴリ | 変更内容 | 影響度 |
|---------|---------|-------|
| レイアウト | テーブル上部に候補キュー領域を追加 | Medium |
| コンポーネント | `CheckboxCard` と `Dialog` による確認フローを追加 | High |
| インタラクション | 行ごとの候補追加 -> ダイアログ確認 -> 担当確定の 3 段階フロー | High |
| データモデル | `estimatedHours` と `takeoverRisk` を使って負荷集計を表示 | Medium |

## コード差分

### 候補キュー（新規追加）

> 一覧で見つけた案件を即確定せず、候補として一時保持する。

**Before（template）:**
```tsx
{/* 該当なし（新規追加） */}
```

**After（sandbox）:**
```tsx
{candidateCases.map((caseItem) => (
  <CheckboxCard key={caseItem.id} checked onChange={() => toggleCandidate(caseItem.id)}>
    <Text>{caseItem.title}</Text>
  </CheckboxCard>
))}
```

### 担当前の確認ダイアログ（新規追加）

> 工数や高リスク件数を見てから最終確定できるようにする。

**Before（template）:**
```tsx
{/* 該当なし（新規追加） */}
```

**After（sandbox）:**
```tsx
<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent>
    <DialogHeader>{/* ... */}</DialogHeader>
    <DialogBody>{/* 件数、総工数、高リスク件数 */}</DialogBody>
    <DialogFooter>
      <Button onClick={commitCandidates}>この内容で担当する</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## コンポーネント使用一覧

| コンポーネント | 用途 | 区分 |
|---------------|------|------|
| `CheckboxCard` | 候補キューの編集 | 新規 |
| `Dialog` | 負荷確認と最終確定 | 新規 |
| `Card` | 件数・工数サマリー | 新規 |
| `DataTable` | 候補追加元の案件一覧 | 変更 |
| `Banner` | フィードバック | 新規 |

## データモデル

```typescript
type MatterCase = {
  id: string;
  title: string;
  estimatedHours: number;
  takeoverRisk: "low" | "medium" | "high";
  dueInDays: number;
};
```

## API コントラクトヒント

⚠️ 以下はモックデータから推測した API コントラクトです。実際の API 設計時に検証してください。

| エンドポイント（推測） | メソッド | リクエスト/レスポンス概要 |
|----------------------|---------|------------------------|
| `/api/loc/cases/self-assign/preview` | `POST` | `caseIds[]` を受けて総工数や競合情報を返す |
| `/api/loc/cases/self-assign/bulk` | `POST` | プレビュー確認後に担当確定を行う |

## 実装ガイダンス

### 新規ファイル作成先の提案

| 項目 | パス |
|------|------|
| 候補キュー UI | `src/pages/template/loc/case/` |
| プレビュー API | `lib/loc-app/.../case-assignment-preview.ts` |
| 担当確定 API | `lib/loc-app/.../case-assignment.ts` |

### 実装ステップ

1. プレビュー API で返す負荷指標を定義する
2. 候補キューをローカル状態にするか永続化するか決める
3. 引継ぎリスクが高い場合の追加入力有無を設計する

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
