# サブエージェントワークフロー

このドキュメントでは、aegis-lab で利用可能なサブエージェントとその使用方法を説明します。

## エージェント一覧

| エージェント | 役割 | タイミング |
|-------------|------|-----------|
| `prd-capture-agent` | 会話から要件を推測し `auto-generated-prd.md` を更新 | 実装前〜実装中 |
| `insights-capture-agent` | イテレーションパターンを分析し `auto-generated-insights.md` を更新 | 実装中（proactive） |
| `aegis-expert-agent` | Aegis コンポーネント選択・レイアウト設計 | 実装時 |
| `aegis-design-reviewer` | デザインシステム準拠チェック | 実装後、コミット前 |
| `code-quality-agent` | 技術品質チェック（format/lint/build）| デザインレビュー後、コミット前 |

## 推奨ワークフロー

### 新規プロトタイプ作成フロー

```
1. 要件定義（オプション）
   ├─ prd-capture-agent で `auto-generated-prd.md` を更新
   └─ /prd-generator で PRD.md を作成（必要時）

2. 仕様作成
   └─ /spec-generator で SPEC.md を作成

3. 実装
   ├─ /sandbox-creator でページ作成
   ├─ aegis-expert-agent でコンポーネント選択
   ├─ /component-tips で Props 確認
   └─ insights-capture-agent でイテレーションパターンを記録（反復シグナル検出時のみ）

4. デザインレビュー
   └─ aegis-design-reviewer でチェック
       → Critical 問題があれば修正

5. 品質チェック
   └─ code-quality-agent でチェック
       → エラーがあれば修正

6. コミット
   └─ /commit-message でメッセージ生成
```

## 使用方法

### prd-capture-agent

会話ベースで UI を作るときに、ユーザープロンプトから要件を構造化して `auto-generated-prd.md` に残す。

**使用例:**
```
「prd-capture-agent でこの会話を auto-generated-prd.md に反映して」
「sandbox 実装前に要件を generated-prd に整理して」
```

**出力内容:**
- Snapshot
- Confirmed Requirements
- Inferred Requirements（confidence付き）
- Open Questions
- UI Mapping（Requirement -> Aegis Component）
- Prompt Log / Change Log

### aegis-expert-agent

UI 実装時に Aegis コンポーネントの選択やレイアウト構成をサポート。

**使用例:**
```
「aegis-expert-agent を使って、ケース一覧画面のレイアウトを設計して」
「aegis-expert-agent で、このフォームに適切なコンポーネントを選んで」
```

**提供情報:**
- 94種類の Aegis コンポーネントから最適なものを選択
- 5つの PageLayout パターンから適切なものを提案
- デザイントークンの適用ガイダンス

### aegis-design-reviewer

プロトタイプ実装後に Aegis デザインシステムへの準拠をチェック。

**使用例:**
```
「aegis-design-reviewer で src/pages/sandbox/my-prototype をレビューして」
「デザインレビューして」
```

**チェック項目:**
- コンポーネント準拠（カスタム UI 禁止）
- PageLayout パターン正確性
- デザイントークン使用（px 値直接指定禁止）
- フォームコンポーネントのラップ
- ボタン配置ルール
- コード参照（sandbox 参照禁止）
- ライティングガイドライン

**出力形式:**
```markdown
## Design Review Summary

### 結果: PASS / FAIL

### 統計
- Critical: X 件
- Warning: Y 件
- Suggestion: Z 件

### 問題一覧
| 重大度 | ファイル | 行 | 問題 | 推奨 |
|--------|---------|-----|------|------|
| Critical | path/file.tsx | 42 | カスタムボタン使用 | Button from aegis-react |
```

### code-quality-agent

技術的な品質チェックを実行し、エラーを修正。

**使用例:**
```
「code-quality-agent でコード品質チェックして」
「コミット前のチェックをお願い」
```

**実行内容:**
1. `pnpm format` - Biome による lint + format
2. `pnpm fix:style` - Stylelint による CSS 修正
3. `pnpm build` - TypeScript 型チェック + Vite ビルド

**出力形式:**
```markdown
## Code Quality Summary

### 結果: PASS / FAIL

### 実行結果
| Step | コマンド | 結果 | エラー数 |
|------|---------|------|---------|
| 1 | pnpm format | OK/NG | X |
| 2 | pnpm fix:style | OK/NG | Y |
| 3 | pnpm build | OK/NG | Z |
```

## コンテキスト管理

サブエージェントを使用することで、長いセッションでのコンテキストオーバーフローを防ぎます。

### アーティファクトによるハンドオフ

| フェーズ | 生成アーティファクト | 次フェーズへの引き継ぎ |
|---------|---------------------|----------------------|
| 要件定義 | PRD.md | 仕様作成の入力 |
| 仕様作成 | SPEC.md | 実装の入力 |
| 実装 | プロトタイプファイル | レビューの入力 |
| 実装（並行） | auto-generated-insights.md | プロセス改善の参考 |
| デザインレビュー | Review Summary | 品質チェックの参考 |
| 品質チェック | Quality Summary | コミットの判断材料 |

### サブエージェントのコンテキスト分離

各サブエージェントは独立したコンテキストで実行されるため:
- メインコンテキストの消費を抑制
- 必要な情報のみを処理
- 構造化されたサマリーを返却

## 既存スキルとの統合

サブエージェントは既存スキルと連携して動作します:

| スキル | 統合エージェント | 用途 |
|--------|-----------------|------|
| `generated-prd-capture` | prd-capture-agent | 会話から auto-generated-prd.md を更新 |
| `generated-insights-capture` | insights-capture-agent | イテレーションパターンから auto-generated-insights.md を更新 |
| `/component-tips` | aegis-expert-agent, aegis-design-reviewer | コンポーネント詳細確認 |
| `/writing-review` | aegis-design-reviewer | テキストコンテンツ検証 |
| `/design-token-resolver` | aegis-expert-agent | トークン検索 |
| `/page-layout-assistant` | aegis-expert-agent | レイアウトパターン選択 |

## ベストプラクティス

### 1. 順次実行

エージェントは以下の順序で実行:
1. prd-capture-agent（要件整理）
2. aegis-expert-agent（実装時）
3. aegis-design-reviewer（実装後）
4. code-quality-agent（デザインレビュー後）

### 2. 早期フィードバック

- 実装中に aegis-expert-agent でコンポーネント選択を確認
- 小さな単位で aegis-design-reviewer を実行
- 大きな変更前に code-quality-agent で状態を確認

### 3. 問題の修正

- Critical は必ず修正してから次に進む
- Warning は可能な限り対応
- Suggestion は時間があれば対応

### 4. アーティファクトの活用

- SPEC.md を最新に保つ
- レビューサマリーを参照して修正
- コミットメッセージにレビュー結果を含める

## トラブルシューティング

### Q: エージェントが期待通りに動かない

1. エージェントの description を確認
2. 適切なツールが利用可能か確認
3. 入力ファイル/ディレクトリが存在するか確認

### Q: コンテキストが溢れる

1. 大きなタスクを小さく分割
2. 各フェーズでサブエージェントを活用
3. アーティファクト（ファイル）でハンドオフ

### Q: デザインレビューで多くの問題が出る

1. 実装前に aegis-expert-agent でガイダンスを得る
2. `/component-tips` でルールを確認
3. `src/pages/template/` のパターンを参照
