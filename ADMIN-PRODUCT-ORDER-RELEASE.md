# アセット登録フォームのプロダクト選択順

既存の左側フィルターと同じ `compareProductFilters` を、登録/編集フォームのプロダクト選択肢にも適用する。

LegalOn / GovernOn / DocumentOn / TrustOn / WorkOn / DealOn / LearningOn / On Technologies / 全社共通の順とする。ID、名称、終了表示、選択・保存の処理は変更しない。追加プロダクトは既存ヘルパーの規則に従い末尾にCMS順で並ぶ。プロダクト管理テーブル自体やCMS保存済みorder値、素材データ、サーバー、認証・権限は変更しない。サムネイル改善は含めない。

ソース変更は `CatalogAdmin.tsx` へ既存ヘルパーをimportし、Selectのoptionsを生成するコピー配列へ適用する2行のみ。Chromiumで保存済みorderを逆順にしたテスト用カタログを読み、実際の登録フォームの選択肢順、TrustOnの選択、保存せずキャンセル、TOPログアウトを確認する。

CIとレビュー成功後に反映し、health/新JSハッシュを確認。実Googleログイン状態の登録画面は利用者に再読み込みで確認を依頼する。ロールバックは直前のデプロイ。VolumeやDriveの変更はない。
