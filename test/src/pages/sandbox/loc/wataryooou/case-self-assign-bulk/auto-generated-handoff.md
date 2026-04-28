# 案件一覧プロトタイプ A — エンジニアハンドオフ

> Auto-generated from sandbox prototype. Last updated: 2026-03-17

## サマリー

案件一覧の上で複数案件を選択し、一括で自分の担当案件へ切り替える案。案件テーブル自体は維持しつつ、チェックボックス選択と一括実行 Banner を追加している。

- **ベース**: `src/pages/template/loc/case/index.tsx`
- **sandbox**: `src/pages/sandbox/loc/wataryooou/case-self-assign-bulk/`
- **PRD**: `auto-generated-prd.md`

## 変更概要

| カテゴリ | 変更内容 | 影響度 |
|---------|---------|-------|
| レイアウト | 既存の案件一覧構成を維持しつつ、上部強調領域に一括操作 Banner を追加 | Medium |
| コンポーネント | `DataTable` の複数選択、`Banner`、追加 CTA ボタンを利用 | High |
| インタラクション | 選択行をまとめて自分担当へ反映するハンドラを追加 | High |
| データモデル | `assigneeState` と担当更新用のモックヘルパーを追加 | Medium |

## コード差分

### 一括担当化 Banner（変更）

> 選択件数に応じて、その場で実行できる主導線を出す。

**Before（template）:**
```tsx
{/* 該当なし。案件一覧上に一括担当化の主導線はない */}
```

**After（sandbox）:**
```tsx
{selectedRows.length > 0 ? (
  <Banner
    title={`${selectedRows.length}件を選択中`}
    action={<Button onClick={() => assignCaseIds(selectedRows)}>選択した案件を担当する</Button>}
    closeButton={false}
  >
    一覧の複数行をまたいでまとめて引き受けられます。
  </Banner>
) : null}
```

### DataTable の複数選択（変更）

> 一覧から直接複数案件を拾う操作を可能にする。

**Before（template）:**
```tsx
<DataTable columns={caseColumns} rows={cases} getRowId={(row) => row.id} />
```

**After（sandbox）:**
```tsx
<DataTable
  columns={columns}
  rows={cases}
  getRowId={(row) => row.id}
  rowSelectionType="multiple"
  selectedRows={selectedRows}
  onSelectedRowsChange={setSelectedRows}
/>
```

## コンポーネント使用一覧

| コンポーネント | 用途 | 区分 |
|---------------|------|------|
| `PageLayout` | 案件一覧の外枠 | 既存 |
| `Toolbar` | 検索・ソート・一括操作の並び | 既存 |
| `DataTable` | 案件一覧と複数選択 | 変更 |
| `Banner` | 一括操作と成功フィードバック | 新規 |
| `Button` | 一括担当化 CTA | 既存 |

## データモデル

```typescript
type MatterCase = {
  id: string;
  title: string;
  currentAssignee: string | null;
  assigneeState: "unassigned" | "assigned-to-me" | "assigned-to-other";
  priorityScore: number;
};
```

## API コントラクトヒント

⚠️ 以下はモックデータから推測した API コントラクトです。実際の API 設計時に検証してください。

| エンドポイント（推測） | メソッド | リクエスト/レスポンス概要 |
|----------------------|---------|------------------------|
| `/api/loc/cases/self-assign/bulk` | `POST` | `caseIds[]` を受け取り、更新後の担当情報を返す |
| `/api/loc/cases` | `GET` | 検索語、所有状態、ソート条件で案件一覧を返す |

## 実装ガイダンス

### 新規ファイル作成先の提案

| 項目 | パス |
|------|------|
| ケース一覧拡張 | `src/pages/template/loc/case/` |
| 状態更新 hook | `lib/loc-app/.../useCaseAssignment.ts` |
| 一括操作 API | `lib/loc-app/.../case-assignment.ts` |

### 実装ステップ

1. 一括担当化 API の権限制御と担当変更履歴の保存要件を確認する
2. `DataTable` 選択状態を URL / store とどう同期するか決める
3. 一括実行後の toast / refresh 戦略を確定する

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

