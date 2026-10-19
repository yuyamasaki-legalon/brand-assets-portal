# TOMONI AI HTML公開

ユーザーが用意した`tomoni-ai-html`を`public/tomoni-ai-html`へ追加。2026-10-19にログイン不要の一般公開を確認済み。内容に事業計画・目標・本人の経験談が含まれることも事前に説明済み。

- URL: `/tomoni-ai-html/index.html`（`/tomoni-ai-html/`も対応）
- 元のHTML・画像・フォント・本文は改変しない。埋め込みJavaScript3本はSHA-256ハッシュ指定で、このページだけ実行を許可する。埋め込みフォント・画像のdata URLを許可。外部通信は禁止。
- CMS/APIの認証、ポータルの既存CSP、環境変数・Volumeは変更しない。
- 公開Webサーバーは最終HTMLとフォントライセンスだけ配信。編集用ソースも公開Gitリポジトリには含まれる。Finderの`.DS_Store`はアップロード対象外。元フォルダーのファイルは削除しない。
- 最終HTMLのインラインスクリプト構文・CSPハッシュ一致・匿名GET/HEAD・ライセンス・ソース/秘密ファイルの非配信、既存CMSの未認証拒否をテストする。

HTMLはビルド済み成果物をそのまま配布する。Node24/Dockerの既存CIを確認してからマージ。本番デプロイ後に本文とCSP、healthを確認する。差し戻しは前のデプロイへ戻す。CMS Volumeには変更を加えない。
