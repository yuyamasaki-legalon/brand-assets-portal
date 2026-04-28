# Snapshot

- Page: `src/pages/sandbox/loc/wataryooou/case-self-assign-workload/index.tsx`
- Theme: 候補キューと確認ダイアログで負荷を見てから担当化する案件一覧
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

- [confidence: 0.92] この案では、即担当化よりも「担当前の確認」を重視する
- [confidence: 0.88] 案件をいったん候補キューに積み、工数とリスクをまとめて見せる
- [confidence: 0.84] 高リスク案件や期限の近い案件を数で示し、引き受け判断を補助する

## Open Questions

- 実サービスで「候補キュー」を一時保存する必要があるか
- 高リスク案件で上長承認やコメント入力を必須化するか
- 負荷指標に工数以外の指標を何まで含めるか

## UI Mapping (Requirement -> Aegis Component)

- 候補キュー -> `Card`, `CheckboxCard`
- 担当前の確認 -> `Dialog`
- 一覧から候補追加 -> `DataTable`, `Button`
- 集計フィードバック -> `Banner`, `Card`

## Prompt Log

- 2026-03-17: `src/pages/sandbox/loc/wataryooou に新しくページを作成し、LegalOn の案件一覧画面をベースに新しい機能を開発したいと思っている。案件一覧画面にはたくさんの案件が並んでいるが、案件を選択し、選択した案件を自分が担当中の案件にすることはできない。スムーズに自分が担当している案件にできるようなプロトタイプを3つ、別々のページに開発してほしい。`

## Change Log

- 2026-03-17: 初回生成

