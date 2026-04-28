# Snapshot

- Page: `src/pages/sandbox/loc/wataryooou/case-self-assign-priority/index.tsx`
- Theme: 優先度の高い案件を上部候補から即担当化する案件一覧
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

- [confidence: 0.93] この案では、一覧全体をなめる前に「今取るべき案件」を上部で提案する
- [confidence: 0.89] おすすめ理由をテーブル列と候補カードの両方に出し、納得感を持って担当化できるようにする
- [confidence: 0.85] 担当化後は対象行をハイライトし、一覧のどこが変わったか把握しやすくする

## Open Questions

- 優先度スコアの算出は期限、更新、工数の固定ロジックでよいか
- おすすめ候補に AI 推薦ラベルを付ける場合、説明責任として何を表示すべきか
- 推薦案件を複数人に同時提示したときの競合をどう扱うか

## UI Mapping (Requirement -> Aegis Component)

- おすすめ候補の先出し -> `Card`, `Button`
- 一覧との連続性 -> `PageLayout`, `DataTable`, `Toolbar`
- 担当理由の表示 -> `DataTable`, `Text`
- 完了フィードバック -> `Banner`

## Prompt Log

- 2026-03-17: `src/pages/sandbox/loc/wataryooou に新しくページを作成し、LegalOn の案件一覧画面をベースに新しい機能を開発したいと思っている。案件一覧画面にはたくさんの案件が並んでいるが、案件を選択し、選択した案件を自分が担当中の案件にすることはできない。スムーズに自分が担当している案件にできるようなプロトタイプを3つ、別々のページに開発してほしい。`

## Change Log

- 2026-03-17: 初回生成

