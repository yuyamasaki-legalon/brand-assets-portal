---
name: publish
description: >-
  sandbox ページを PR として公開し、Preview URL をユーザーに共有する。
  WHEN: プロトタイプが完成して「共有したい」「見せたい」「公開して」
  「PR 作って」「Preview URL を発行して」と言われたとき。
  NOT WHEN: まだ実装途中のとき、コミットだけしたいとき（→ /commit-message）。
---

# Publish: プロトタイプを公開する

sandbox ページのコードをコミットし、PR を作成して Preview URL を共有するまでの一連のワークフローを自動実行する。
非エンジニアが「公開して」と言うだけで完了することを目指す。

---

## 基本方針

- 通常判断できる作業は自動で進める
- push、PR 作成、外部通信、権限昇格が必要なコマンドは実行環境の承認フローに従う
- ユーザーや他エージェントの未コミット変更を巻き込まない
- `main` への直接 push、force push、deploy はしない
- 判断不能な conflict、対象ページ不明、無関係な変更の混在はユーザーに報告して止める

---

## 実行フロー

以下のステップを順番に実行する。承認や判断が必要な場合だけ止める。

### Step 1: 対象差分を特定する

```
git status --short
```

1. 変更された sandbox ページのディレクトリを特定する
2. 対象ページに紐づくファイルだけを publish 対象にする
   - 対象ページ配下のファイル
   - 対象ページに対応する `auto-generated-prd.md`
   - 対象ページに対応する `auto-generated-handoff.md`
   - 対象ページに対応する `auto-generated-insights.md`
   - 対象ページ登録に必要な `src/pages/sandbox/index.tsx`
   - 対象ページ登録に必要な `src/pages/sandbox/routes.tsx`
3. 無関係な変更は stage しない

対象ページを判定できない場合は、推測で stage せずユーザーに報告する。

### Step 2: ブランチを確認・作成する

現在のブランチが `main` の場合、新しいブランチを作成する。`main` 以外のブランチにいる場合は、そのブランチで作業を続ける。

```
git branch --show-current
git checkout -b feature/sandbox-{page-name}
```

**ブランチ名の決め方**:
1. sandbox ページのディレクトリ名から自動生成する
2. 形式: `feature/sandbox-{page-name}`
3. 例: `src/pages/sandbox/loc/ryo-watanabe/case-analytics/` → `feature/sandbox-case-analytics`

既存ブランチに PR がある場合は新規 PR を作らず、その PR を更新する。

### Step 3: 最新の main に追従する

未コミットの対象変更がある場合は、対象ファイルだけを一時退避してから rebase する。無関係な変更は stash に含めない。

```bash
git stash push -u -m publish-before-rebase -- {target-files}
git stash list -n 1
```

```
git fetch origin main
git rebase origin/main
```

rebase が成功したら、退避した変更を戻す。stash を作成した場合のみ、直近の stash が `publish-before-rebase` であることを確認してから戻す。

```bash
git stash pop stash@{0}
```

- conflict がない場合はそのまま続行する
- stash を戻すときに conflict した場合も、以下の conflict 方針に従う
- conflict が対象 sandbox ページ内の単純な同一箇所変更だけなら、内容を読んで意図を保った解消を試みる
- `src/pages/sandbox/index.tsx` / `routes.tsx` の登録 conflict は、既存登録を残したうえで対象ページ登録を追加する
- main 側の変更を機械的に捨てる解消はしない
- 判断不能な conflict は解消せず、状況をユーザーに報告する

### Step 4: フォーマット・ビルドチェックを実行する

commit 前に必ず実行する。

```bash
pnpm format && pnpm fix:style
pnpm build
```

- 自動修正で発生した差分は、対象ページに関係するものだけ publish 対象に含める
- TypeScript エラーが出た場合は修正してから進める
- 修正が難しいエラーや対象外ファイルのエラーは、内容をユーザーに報告して止める

### Step 5: 変更を stage して commit する

1. `git status --short` で対象ファイルを再確認する
2. 対象ファイルだけを明示的に `git add` する
3. `git diff --cached --stat` で stage 内容を確認する
4. Conventional Commits 形式で commit する

```
feat(sandbox): add {page-name} prototype
```

コミットメッセージには実行中のエージェント名やモデル名を固定で書かない。環境が明示的な attribution を要求している場合のみ、その環境に合わせて追記する。

### Step 6: PR を作成または更新する

```
git push -u origin HEAD
```

既存 PR がある場合は push 後に URL を取得する:

```bash
gh pr view --json url,number
```

PR がない場合はオープン状態で作成する（Preview URL は Draft PR では生成されないため、ドラフトにしない）:

```bash
gh pr create --title "feat(sandbox): add {page-name} prototype" --body "$(cat <<'EOF'
## Summary
- {page-name} プロトタイプを追加

## Preview
PR 作成後、自動で Preview URL が発行されます。

## Test plan
- [x] pnpm format && pnpm fix:style
- [x] pnpm build
- [ ] Preview URL で動作確認
EOF
)"
```

**PR タイトルの決め方**:
- sandbox ページの内容を簡潔に表現する
- 形式: `feat(sandbox): add {description}`
- 日本語の説明文も可（ユーザーのプロンプトから推測）

### Step 7: 必要なら stable Preview URL ラベルを案内する

長期間共有する URL が必要そうな場合は、PR に `preview:{slug}` ラベルを付けると stable URL が発行されることを伝える。ユーザーが明示した slug がある場合のみラベル追加を試みる。

slug ルール:
- 小文字英数字と hyphen のみ
- 31 文字以内
- `main`、`preview`、`latest`、`production`、`staging`、`pr-{digits}` は使わない

### Step 8: Preview URL を取得してユーザーに共有する

PR 作成後、GitHub Actions が Preview Deployment を実行する。完了するとPR に `🚀 Preview Deployment` を含むコメントが投稿される。

**ポーリング手順**:

1. PR 番号を取得する
2. 30秒間隔で最大10分間、PR コメントを確認する
3. Bot コメントに `Preview Deployment` が含まれていたら URL を抽出する

コメントは issues API 経由で取得する:

```bash
gh api repos/{owner}/{repo}/issues/{pr_number}/comments \
  --jq '.[] | select(.user.type == "Bot" and (.body | contains("Preview Deployment"))) | .body'
```

Preview URL が見つかったら、以下の形式でユーザーに共有する:

```
PR を作成しました！

**PR**: https://github.com/{owner}/{repo}/pull/{pr_number}
**Preview URL**: https://pr-{N}-aegis-lab.on-technologies-technical-dept.workers.dev

プレビューでページを確認できます。
sandbox 一覧: {preview_url}/sandbox
作成したページ: {preview_url}/sandbox/{page-path}
```

タイムアウトした場合は PR の URL だけ共有し、「Preview URL は数分後に PR のコメントに投稿されます」と伝える。

---

## 判断基準

### ブランチが既にある場合
- `main` 以外のブランチにいる場合、新しいブランチは作らない
- 既存ブランチで作業を続ける

### コミット済みの変更がある場合
- `git status` で未コミットの対象変更がなければ commit をスキップ
- push 済みなら push をスキップ

### PR が既にある場合
- 既存の PR があれば新規作成せず、push のみ行う
- `gh pr view --json url` で確認

### 複数の sandbox ページがある場合
- 変更されたファイルから対象のページを自動判定する
- 同じユーザー依頼から生まれた複数ページなら、まとめて1つの PR にする
- 無関係に見える複数ページが混在していたら、stage せずユーザーに報告する

## 関連スキル

- `commit-message`: コミットメッセージだけを作る場合に使う。publish は commit、push、PR、Preview URL 共有まで行う。
