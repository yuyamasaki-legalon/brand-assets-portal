# Preview URL ガイド

> 英語版: [workflow-guide.md](./workflow-guide.md) → Preview URL Configuration

## 概要

PR を作ると自動で PR 固有のプレビュー URL が発行されます。

```
https://pr-{N}-aegis-lab.on-technologies-technical-dept.workers.dev
```

ただし PR ごとに URL が変わるため、ある程度長い期間、共有し続けるには不便です。**プロジェクト固定 URL** を使うと、PR が変わっても同じ URL でアクセスできます。

## 使い方

1. PR に `preview:{slug}` ラベルを付ける（例: `preview:hoge-report`）
2. 自動で固定 URL が発行される
   ```
   https://{slug}-aegis-lab.on-technologies-technical-dept.workers.dev
   ```
3. PR をマージしても URL はそのまま残る（スナップショット）
4. 次の PR に同じラベルを付けてマージすれば、URL の中身が更新される

## slug のルール

| ルール | 詳細 |
|--------|------|
| 使える文字 | 小文字英数字とハイフン（`a-z`, `0-9`, `-`） |
| 先頭文字 | 英数字（ハイフン不可） |
| 最大長 | 31 文字 |
| 1 PR あたり | 最大 5 ラベル |

**予約語**（使用不可）: `main`, `preview`, `latest`, `production`, `staging`, `pr-{数字}`

**例**:

```
preview:clm-report        ✅
preview:tabular-review     ✅
preview:wata-analytics     ✅
preview:pr-42              ❌ (予約語)
preview:UPPER-CASE         ❌ (大文字不可)
```

## ラベルを外したとき

ラベルを外すと Cloudflare 上のエイリアスの自動削除が試みられます。結果は PR コメント（`🧹 Preview Alias Cleanup`）で確認できます。

| 結果 | 意味 |
|------|------|
| **deleted** | エイリアスが削除された |
| **still in use** | 他のオープン PR が同じラベルを使っているため削除されなかった |
| **manual cleanup required** | API エラーで削除失敗。Cloudflare ダッシュボードから手動削除が必要 |
| **reserved** | 予約語のため削除対象外（`preview:pr-123` など） |
| **invalid slug** | slug の形式が不正なため削除対象外 |

## 注意事項

- **slug の衝突**: 同じ slug を複数のオープン PR で使うと、最後にデプロイした PR の内容で上書きされる（last deploy wins）
- **マージ後の動作**: main デプロイでは自動更新されない。URL の中身を更新するには、同じラベルを付けた新しい PR をマージする
- **ラベルを外さずにマージ**: スナップショットがそのまま残る（自動削除されない）

## ラベルの事前作成

リポジトリ管理者は **Settings → Labels → New label** で `preview:clm-report` のようなラベルを事前に作成できます。非エンジニアが既存ラベルから選択するだけで済むようになります。
