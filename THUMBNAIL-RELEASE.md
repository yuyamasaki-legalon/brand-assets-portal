# Drive thumbnails — 2026-10-29

検索結果の「Driveプレビューを表示」から利用者が既存のDrive readonly認可を開始し、社員セッションを通したサムネイルAPIで画像を補完する。表示に近い画像だけ最大4並列で読み込み、同一素材・同色の別形式を最大4候補まで試す。既存プレビューは維持。元ファイルの公開範囲・Drive原本・保存カタログ・Volume・Secret・OAuth scopeは変更しない。

## Approved compatibility boundary

現在の本番は認証済み社員の編集を許可している。今回、その権限を変更しない。新しい画面が読むsessionの`canEdit`に既存の`authenticated`と同じ値を返す互換フィールドだけを追加する。社員判定・署名検証・CSRF・保存時認可は変更しない。ローカルにある未公開の編集者allowlist・OAuthサーバー・設定ファイルは配布しない。

サーバーは既存の本番`server.mjs`へ、上記互換フィールドとサムネイルモジュールのimport・初期化・ルートのみを追加する。それらを除去すると直前本番サーバーとSHA256が一致することを回帰テストする。初期カタログも同一ハッシュを検証。新規`drive-thumbnail.mjs`だけをDockerへ追加する。既存TOMONI・メディアはそのまま保持する。

## Private API

`GET /api/brand-assets/thumbnail/:fileId`: 社員セッション＋利用者Drive tokenをAuthorizationヘッダーで検証し、Google metadataのthumbnailLinkをGoogle画像CDNから取得する。URLへのtoken付加・永続保存・共有キャッシュ・ログ出力は行わない。redirect禁止、10秒、2MiB、PNG/JPEG/WebP/GIF、サーバー同時8件。応答はdata URLとprivate no-store。取得不可・未生成は代替表示、401は再認可案内。新しいSecret・環境変数は不要。

## Verification and rollout

開発元で関連50テスト・app/node型チェック・ビルド・テスト画像のChrome表示検証成功。配布側で既存CMS/TOMONI/TrustOn回帰、認証互換性、権限不足・危険なURL・サイズ・MIME制限をNodeテストする。GitHub ActionsのNode24/Docker build成功後、PRをマージしRailway自動デプロイの成功と公開ページ・health・匿名API拒否を確認する。実Google認可と実ファイルの表示は利用者の会社アカウントで最終確認が必要。

障害時は直前のデプロイへ戻し、Volumeを削除しない。過去バンドルは保持する。
