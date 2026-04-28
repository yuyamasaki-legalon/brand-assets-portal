---
name: commit-message
description: git diff から Conventional Commits 形式のコミットメッセージや PR 説明文を生成。コミット作成や PR 説明文の依頼時に使用。
---

# コミットメッセージ / PR 説明文ジェネレーター

git diff を分析し、Conventional Commits 形式のコミットメッセージや PR 説明文を生成する。

## コミットメッセージ形式

```
<type>(<scope>): <subject>

<body>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

## Type 一覧

| Type | 用途 | 例 |
|------|------|-----|
| `feat` | 新機能追加 | 新しいページ、コンポーネント追加 |
| `fix` | バグ修正 | 表示バグ、ロジック修正 |
| `refactor` | リファクタリング | コード整理（機能変更なし） |
| `style` | フォーマット変更 | Biome 修正、インデント |
| `docs` | ドキュメント変更 | README、コメント更新 |
| `test` | テスト追加・修正 | テストファイル |
| `chore` | ビルド・設定変更 | package.json、設定ファイル |

## Scope（このリポジトリ用）

| Scope | 対象 |
|-------|------|
| `template` | `src/pages/template/` 配下 |
| `sandbox` | `src/pages/sandbox/` 配下 |
| `docs` | `docs/` 配下 |
| `scripts` | `scripts/` 配下 |
| `config` | 設定ファイル（vite.config, package.json 等） |

## 生成手順

1. `git diff --staged` で変更内容を確認
2. 変更の性質を分析（feat/fix/refactor 等）
3. 影響範囲から scope を特定
4. 50文字以内の subject を作成
5. 必要に応じて body で詳細説明

## Subject のルール

- **英語**: 命令形で開始（Add, Fix, Update, Remove）
- **日本語**: 体言止め（追加、修正、更新、削除）
- 50文字以内
- 末尾にピリオドを付けない
- 「何を」「なぜ」が分かるように

### 良い例
```
feat(template): add dashboard page with sidebar navigation
fix(sandbox): correct padding in case-detail layout
refactor(template): extract common header component
```

### 悪い例
```
update code  # 曖昧すぎる
Fixed bug.   # 過去形、ピリオドあり
Add new feature and fix some bugs  # 複数のことを含む
```

## PR 説明文テンプレート

```markdown
## Summary
- 変更点1の説明
- 変更点2の説明

## Test plan
- [ ] 開発サーバーで動作確認
- [ ] TypeScript エラーなし（pnpm build）
- [ ] Lint エラーなし（pnpm format）

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## gh コマンド例

```bash
# PR 作成
gh pr create --title "feat(template): add new dashboard" --body "$(cat <<'EOF'
## Summary
- ダッシュボードページを追加
- サイドバーナビゲーションを実装

## Test plan
- [ ] 開発サーバーで動作確認
- [ ] pnpm build 成功

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

## 注意事項

- 機密情報（API キー、パスワード等）をメッセージに含めない
- 1コミット1機能を心がける
- 大きな変更は複数のコミットに分割
- pre-commit hook (`pnpm format && pnpm fix:style`) を通過してからコミット
