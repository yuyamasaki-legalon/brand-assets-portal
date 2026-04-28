# Snapshot

- Page: `src/pages/sandbox/loc/wataryooou/case-self-assign-bulk/index.tsx`
- Theme: LegalOn 案件一覧をベースにした「一括で自分の担当案件にする」導線
- Last updated: 2026-03-17

## Concept Reference

- `src/pages/template/loc/CONCEPT.md`
- `src/pages/template/loc/case/CONCEPT.md`
- Base UI reference: `src/pages/template/loc/case/index.tsx`

## Confirmed Requirements

- LegalOn の案件一覧画面をベースにする
- `src/pages/sandbox/loc/wataryooou` 配下に新しいページを作る
- 「案件を選択し、選択した案件を自分が担当中の案件にする」新機能を扱う
- スムーズに自分が担当している案件にできるプロトタイプを 3 つ作る
- 3 つは別々のページにする

## Inferred Requirements

- [confidence: 0.94] 既存の案件一覧らしい情報密度を残し、比較しやすいようにテーブル中心の UI にする
- [confidence: 0.93] この案では複数案件をまとめて引き受ける操作効率を主眼にする
- [confidence: 0.88] すでに自分が担当している案件は再選択不可にして誤操作を減らす
- [confidence: 0.86] 実行後は成功フィードバックを即時表示し、結果が視認できるようにする

## Open Questions

- 一括担当化が許される対象は「未割当のみ」か「他担当からの引継ぎを含む」か
- 実サービスでは担当変更時にコメントや承認が必要か
- 一括操作の上限件数を設けるべきか

## UI Mapping (Requirement -> Aegis Component)

- 一覧ベースの操作導線 -> `PageLayout`, `DataTable`, `Toolbar`
- 複数選択 -> `DataTable` row selection
- 一括実行の強調 -> `Banner`, `Button`
- 結果フィードバック -> `Banner`
- フィルターと検索 -> `Search`, `Select`

## Prompt Log

- 2026-03-17: `src/pages/sandbox/loc/wataryooou に新しくページを作成し、LegalOn の案件一覧画面をベースに新しい機能を開発したいと思っている。案件一覧画面にはたくさんの案件が並んでいるが、案件を選択し、選択した案件を自分が担当中の案件にすることはできない。スムーズに自分が担当している案件にできるようなプロトタイプを3つ、別々のページに開発してほしい。`

## Change Log

- 2026-03-17: 初回生成

