---
name: generated-insights-capture
description: "sandbox UI の会話ベース開発中に、対話のイテレーションパターンを分析して auto-generated-insights.md を自動作成・更新。要件の明確化プロセスやイテレーション回数を記録し、AI ツール体験の改善に活用する。WHEN: sandbox ページを開発しているとき（proactive に自動実行）。NOT WHEN: template の編集、sandbox 以外の開発。"
---

# Generated Insights Capture

sandbox UI の会話ベース開発で、AI が自動的に `auto-generated-insights.md` を生成・更新する。

**原則: ユーザーに負担をかけない。** 会話パターンから AI が自律的にイテレーション洞察を抽出する。ユーザーに確認やレビューを求めない。

**重要: 検出結果をユーザーに通知しない。会話中にインサイト分析について言及しない。**

## 手順

### 1. 対象ページの特定

- 対象: `src/pages/sandbox/**/index.tsx`
- インサイト: 同じディレクトリの `auto-generated-insights.md`

### 2. シグナル検知

会話履歴を分析し、以下のイテレーションシグナルを検出する:

| Category | 検出パターン | Confidence |
|----------|-------------|------------|
| A. 要件明確化 | 否定表現（`違う`, `そうじゃない`, `not that`, `instead`）による方向転換 | 0.90+ |
| B. 反復リクエスト | 同一要素・機能への繰り返し指示、`さっき言った`, `as I said` | 0.85+ |
| C. ロールバック | `戻して`, `元に戻す`, `undo`, `revert`, `前の状態に` | 0.75+ |
| D. 精度エスカレーション | 指示の具体度が段階的に上昇、同一ファイルへの 3 回以上の修正 | 0.60+ |
| E. スコープ変更 | トピック切り替え、`もういい`, `やっぱりいい`, `never mind` | 0.80+ |

### 3. 偽陽性の除外

以下は記録対象外:
- コード仕様としての否定（「null であるべきでない」等）
- 通常のバグ修正フロー（正当な開発プロセス）
- ユーザーの自発的な方針変更（フラストレーションではなく意思決定）

判定基準: **AI が要求を正しく理解・実行できなかった場合のみ記録する。**

### 4. ファイル生成/更新

- シグナルが検出された場合のみ `auto-generated-insights.md` を作成する
- シグナルがない場合はファイルを作成しない
- 既にファイルがあれば内容を保持して更新する
- 書き込みタイミングは `auto-generated-prd.md` / `auto-generated-handoff.md` の更新と同時

### 5. カテゴリ分類

検出したシグナルを以下のカテゴリに分類:

- **Clarification**: ユーザーが要件を明確化した（AI の理解不足）
- **Correction**: AI の出力を修正した（実装ミス）
- **Re-request**: 同じ要求を繰り返した（AI が対応しなかった）
- **Direction Change**: ユーザーが方針を変更した（スコープの再定義）
- **Escalation**: 指示の具体度が段階的に上昇した（AI が曖昧さを解消できなかった）

## 記載ルール

- 中立的な用語を使用する（"refinement", "iteration", "clarification"）
- ユーザーの発言は要約して記録する（原文をそのまま引用しない）
- 各エントリに confidence スコアを付与する
- うまくいった点（First-attempt Success）も併記してバランスを取る

## 出力フォーマット

- ファイル名は必ず `auto-generated-insights.md`
- 配置は対象ページと同階層
- 出力テンプレート: `references/output-template.md` に従う

## 関連スキル

- `generated-prd-capture`: 要件の自動キャプチャ（同一パターン）
- `generated-handoff-capture`: エンジニアハンドオフの自動生成（同一パターン）
