# 会社GoogleログインとRailway本番CMSの設定

更新: 2026-10-09。許可ドメイン: `legalontech.jp`。

実装と本番用ビルドは準備済み。本番サイト・GitHub PR・Railway設定はまだ変更していない。Google OAuthアプリは未作成で、実Googleログインと本番への保存は未検証。

## 1. Google OAuthアプリを作成する

会社のGoogleアカウントで [Google Cloud Console](https://console.cloud.google.com/) を開く。会社管理のプロジェクトを使う。作成権限がない場合はGoogle Workspace／Cloud管理者に依頼する。

1. 「Google Auth Platform」を開き、初期設定または「Branding」でアプリ名を `Brand Asset Portal` とする。サポートメール・連絡先メールには会社管理の連絡先を指定する。
2. 「Audience」で、会社のGoogle Workspace組織内のユーザーに限定する **Internal（内部）** を選ぶ。選べない場合は個人プロジェクト等の可能性があるため、外部公開へ切り替えて進めず会社管理者へ相談する。
3. 「Data Access」でログイン用の `openid` と `email` を使用する。このCMSログインではDrive全体の読み取り権限は要求しない。
4. 「Clients」→「Create client」→「Web application」を選び、名前を `Brand Asset Portal CMS` とする。
5. 「Authorized redirect URIs」に次のURLを完全一致で登録する。末尾にスラッシュは付けない。

```text
https://brand-assets-portal.ontechnologies.tech/api/auth/google/callback
```

6. 作成したClient IDとClient Secretを会社の秘密情報管理ルールに従って保存する。Client Secretはチャット・Git・公開ドキュメントへ貼らない。

サーバー側のリダイレクト方式なので、このCMSログインのためにJavaScript originsの登録は不要。既存のDrive一括ダウンロード用ブラウザーOAuthとは別の設定である。

メールアドレス末尾だけでなく、Googleの署名・宛先・発行元・有効期限とWorkspace所属（`hd`）、検証済みメールをサーバーで確認する。会社のWorkspace主ドメインが `legalontech.jp` と異なる場合は管理者に確認し、許可範囲を合意してから設定を見直す。単にメール末尾だけの確認へ緩めない。

参考: [GoogleのWebサーバーOAuth設定](https://developers.google.com/identity/protocols/oauth2/web-server)、[IDトークンとWorkspace所属の検証](https://developers.google.com/identity/sign-in/web/backend-auth)。

## 2. Railwayに永続保存先と環境変数を設定する

対象は **Brand Asset Portalの本番サービス**。Aegis-labではない。切替前に既存のデプロイ設定を記録し、バックアップを取る。秘密値はRailwayのVariablesに直接入力する。

| Variable | 設定内容 |
|---|---|
| `GOOGLE_OAUTH_CLIENT_ID` | 作成したWebアプリのClient ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | 作成したClient Secret（秘密値） |
| `GOOGLE_ALLOWED_DOMAINS` | `legalontech.jp` |
| `CMS_PUBLIC_ORIGIN` | `https://brand-assets-portal.ontechnologies.tech` |
| `CMS_DATA_DIR` | `/data` |

同じサービスにVolumeを追加し、マウント先を `/data` とする。環境変数だけではデータは永続化されない。Railwayが設定する `RAILWAY_VOLUME_MOUNT_PATH` をアプリが確認し、Volumeがない場合は起動を拒否する。Volume付きサービスは1レプリカで運用し、Volumeバックアップも設定する。

保存するのはカタログ、プロダクト設定、登録サムネイルと直近20版の履歴。**ロゴ・PPTなどの原本は引き続きGoogle Drive**に置く。原本の大量同期・ダウンロードはしない。カタログも含め全データのDrive保存が必要な場合は、現在のVolume方式とは別の設計が必要。

インフラ確認ツールは今回 `unknown` を返し、自動確認はできていない。実サービスのVariables・Volume・バックアップをRailway画面で確認すること。

参考: [Railway Volume](https://docs.railway.com/volumes/reference)、[Railway環境変数](https://docs.railway.com/variables/reference)。

## 3. 本番パッケージをPR経由で切り替える

設定完了後に実施する。既存の静的サイトを先に置き換えない。

```sh
pnpm build:brand-asset-cms
```

生成物は `dist-brand-asset-cms/`。`server.mjs`、`cms-seed.json`、`public/`、`package.json`、`Dockerfile` を含む。ローカルの `.env`・`.git`・実行中CMSデータを含めない。

- 本番リポジトリ `yuyamasaki-legalon/brand-assets-portal` の機能ブランチへ配置し、PRでレビューする。
- 既存の `brand-asset-portal-media/` は生成物に含まれないため、必要な既存ファイルを `public/brand-asset-portal-media/` に保持する。原本を再同期しない。
- RailwayはDockerfileでNodeサーバーを起動する。古いCaddyのStart Command等があれば切替内容を確認する。ヘルスチェックは `/health`。
- OAuth設定とVolumeを確認後にPRをマージし、Railwayのビルド・ヘルスチェック成功を確認する。Dockerコンテナー自体はこの開発環境で未検証。
- ローカルで登録済みのカタログは自動移行されない。移行する場合はバックアップと検証を行い、停止中のVolumeへ配置する。既存カタログがあれば再デプロイ時に初期データで上書きしない。

## 4. 本番で確認する

1. 未ログインでCMS保存ができないこと、会社Googleログインが表示されること。
2. `@legalontech.jp` の会社アカウントでログインし、Driveファイルリンク必須の素材を登録・公開する。
3. 別の社員のブラウザーからログインし、公開した素材とプロダクトフィルターの変更が見えること。
4. 個人Googleアカウント・許可外ドメインを拒否すること。
5. 再デプロイ後も登録が残ること、競合時に上書きされないこと、履歴から復元できること。

CMSのカタログ取得・保存は社員認証必須。下書きは社員向け管理画面で扱い、通常一覧から除外する。未ログイン時は従来の公開済みバンドルを表示するため、**既存の公開データ全体を非公開化する変更ではない**。CMSログインでDriveファイルの閲覧権限が付与されるわけではない。

セッションは最大1時間で、サーバー再起動時に再ログインが必要。退職・停止されたアカウントのアクセスは既存セッション期限まで残り得るため、即時失効が必要なら追加の社員ディレクトリー連携が必要。変更者のGoogleユーザーIDと日時は保存するが、無期限の監査ログではない。
