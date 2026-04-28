# DataTable カラムドラッグ パフォーマンス検証

## Overview

DataTable のカラムドラッグ（列の並べ替え）が行数増加に伴い操作が鈍くなる問題を体感・検証するためのサンドボックスページ。

## Background

- 50行/page で既に再現可能な遅延が発生
- 将来的に 300行/page 対応が必要
- 来週の DataTable リリースに改善を入れたい

### 根本原因（aegis-react 内部調査結果）

- `_DataTableBody.js`: 全行が `useSortable()` hook を呼び出しており、カラムドラッグ時に DndContext の状態変更がすべての行に伝播して全行が再レンダリングされる
- `_DataTableBody.js`: Row コンポーネントに `React.memo` がなく、state 変更のたびに全行再描画
- セル描画に memoization なし（`renderTemplate()` を毎回直接呼び出し）
- 仮想化なし（全行が DOM に存在）

## Requirements

### Confirmed

- [x] 行数を SegmentedControl で切り替え可能（10 / 50 / 100 / 200 / 300）
- [x] 12列 + actions列の案件一覧に近い構成
- [x] 多様なセルタイプ（DataTableLink, StatusLabel, Tooltip, Text, Menu）を含めてレンダリング負荷を再現
- [x] カラムドラッグが有効（DataTable デフォルト動作）
- [x] 行選択が有効（rowSelectionType="multiple"）
- [x] stickyHeader 有効
- [x] actions 列は末尾固定（defaultColumnPinning）
- [x] モックデータは決定論的生成（index ベース）

### Inferred

- デフォルト表示行数は 50 行（最も再現しやすいため）
- 日本語のリアルなデータで案件一覧を模倣
- ソート初期値は作成日時の降順

## Verification Steps

1. `pnpm dev` でサーバー起動
2. `/sandbox/loc/wataryooou/datatable-drag-perf` にアクセス
3. 行数を 10 → 50 → 100 → 200 → 300 と切り替え
4. カラムヘッダーをドラッグして操作感を比較
5. ブラウザの DevTools Performance タブでドラッグ中のフレームレートを確認
