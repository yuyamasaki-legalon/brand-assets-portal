# 一括ダウンロード用Client IDの復旧

CMS移行前の公開成果物`a7347a7:assets/index-CFeBWjlA.js`にはDrive用の公開OAuth Client IDが存在し、CMS後の`e82ef28:public/assets/index-BETZBgJ6.js`には存在しなかった。ビルド設定欠落が原因であり、CMS用Secret交換とは別。

## 配布する変更

`node scripts/restore-drive-client.mjs`で、現行本番バンドルの空のClient IDリテラル1か所だけを元の公開Client IDへ置換する。逆置換して元ファイルと完全一致することを確認する。ハッシュ付きファイル名を生成し、HTMLの参照先のみ更新する。ビルド済みバンドルの復旧用パッケージ処理であり、その他のコードは再ビルドしない。

CMSの編集権限・Google認証・Secret・サーバー・要求スコープ・Drive原本・カタログ・TOMONI資料・Railway設定は変更しない。ローカルで準備中の編集者制限を取り込まず、本番の権限コードをそのまま保持する。

開発元では`google-drive-config.ts`に公開Client IDの既定値と未設定・空文字・上書きのテストを追加し、次のソース再ビルドでも設定が欠落しないようにした。Client IDは公開識別子であり、SecretやAPIキーではない。

## 検証

公開Client IDの存在、既存Drive readonlyスコープ、逆置換後のバイト一致を回帰テストする。Node24/Docker CI成功後、承認を得て本番反映する。実Google認可・権限のあるファイル取得・ZIP展開は利用者の会社アカウントで確認が必要。

設定影響確認スキルによる抽出結果はunknownで、Railway/Google Cloudの実設定は自動確認できていない。外部設定変更は今回行わない。本番反映後にorigin_mismatch等が出る場合は、元のDrive用OAuthクライアントの承認済みJavaScript生成元とポータルドメインを確認する。CMS用Secretを公開変数へ設定しない。
