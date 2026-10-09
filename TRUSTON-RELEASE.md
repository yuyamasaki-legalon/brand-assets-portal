# TrustOn追加（2026-10-09）

Driveフォルダー `1oQpQCM0TCkH70Q00Snta2Ar-H2UZGwkp` をサブフォルダーまで確認。ロゴ9ファイル、スクエアアイコン3ファイルを登録。PNG/JPG/SVG各4件。`.DS_Store`は対象外。原本の取得・変更・削除は行わない。

## 保存済みCMSカタログ

最初の認証済みカタログ読み込みでTrustOnだけを一度追加する。既存のID・Drive IDがある素材は上書きしない。既存プロダクトの名称・終了状態を保持する。追加時は旧版をhistoryに保存し、revisionを進め、原子的renameで確定する。

`appliedSeedUpdates`の`truston-drive-2026-10-09`はサーバーが保持する。取り込み後にCMSで削除した素材は再起動後も復活しない。原本アクセスとサムネイルは従来のDrive権限に依存する。

## 配布範囲

TrustOnのデータとフィルター、一度だけの取り込み処理。別件の`CMS_EDITOR_EMAILS`による編集者制限は含めない。既存の会社Google認証・CSRF・社員の編集権限を維持し、環境変数・Volume設定は変更しない。

ソース側のテスト18件、TypeScriptを含むビルド成功。配布サーバーで認証・保存・削除・TrustOn取り込みを検証する。GitHub ActionsのNode24/Docker build成功を確認してからマージする。

反映後にhealthと新しいフロントエンド成果物を確認し、会社アカウントでTrustOnの素材を確認する。問題があれば旧デプロイへ戻す。Volumeを削除せず、取り込み前のカタログはhistoryから復旧可能。
