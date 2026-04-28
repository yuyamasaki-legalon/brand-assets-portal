# LOC サービスマッピング

## サービス → ディレクトリ

| サービス名 | 出力先 |
|-----------|--------|
| `legal-management-f` | `case/` |
| `application-console-f` | `application-console/` |
| `case-reception-form-f` | `case-reception-form/` |
| `esign-f` | `esign/` |
| `document-management-f` | `file-management/`, `loa/` |
| `review-console-f` | `review/`, `review-console/` |
| `dashboard-f` | `dashboard/` |
| `agent-f` | `loa/` |
| `legalon-template-f` | `legalon-template/` |
| `management-console-f` | `management-console/`, `setting-page/` |
| `personal-settings-f` | `personal-setting/` |
| `root-f` | `root/` |
| `manual-correction-f` | `manual-correction/` |
| `word-addin-f` | `word-addin/`, `word-addin-standalone/` |
| その他 | `-f` を除去してそのまま |

## 既存テンプレート（完全一覧）

| テンプレートパス | loc-app サービス | ソースページパス |
|-----------------|-----------------|-----------------|
| `case/index.tsx` | legal-management-f | pages/index |
| `case/detail/index.tsx` | legal-management-f | pages/show |
| `application-console/index.tsx` | application-console-f | pages/legalManagement/caseStatus |
| `application-console/case-reception-form/index.tsx` | application-console-f | pages/legalManagement/caseReceptionForm |
| `application-console/contract-management/esign-integration/index.tsx` | application-console-f | pages/contractManagement/esignIntegration |
| `application-console/contract-management/custom-attribute-definition/index.tsx` | application-console-f | pages/contractManagement/customAttributeDefinition |
| `application-console/contract-management/inhouse-id-auto-numbering/index.tsx` | application-console-f | pages/contractManagement/inhouseIdAutoNumbering |
| `application-console/contract-management/notification/index.tsx` | application-console-f | pages/contractManagement/notification |
| `application-console/sign/sender-name/index.tsx` | application-console-f | pages/sign/senderName |
| `application-console/sign/default-space/index.tsx` | application-console-f | pages/sign/defaultSpace |
| `application-console/sign/sign-workflow-form/index.tsx` | application-console-f | pages/sign/signWorkflowForm |
| `case-reception-form/index.tsx` | case-reception-form-f | pages/index |
| `dashboard/index.tsx` | dashboard-f | pages/Dashboard |
| `dashboard/contract-review/index.tsx` | dashboard-f | pages/ContractReview |
| `dashboard/analytics/index.tsx` | dashboard-f | pages/Analytics |
| `esign/index.tsx` | esign-f | pages/envelope |
| `esign/envelope-list.tsx` | esign-f | pages/envelope |
| `file-management/index.tsx` | document-management-f | router (shared module) |
| `file-management/detail/index.tsx` | document-management-f | router (shared module) |
| `file-management/customer-template/index.tsx` | document-management-f | router (shared module) |
| `loa/index.tsx` | document-management-f | parts/common/LegalonAssistant |
| `loa/history/index.tsx` | agent-f | pages/history |
| `loa/playbook/index.tsx` | agent-f | pages/playbook |
| `loa/prompt-library/index.tsx` | agent-f | pages/promptLibrary |
| `legalon-template/index.tsx` | legalon-template-f | pages/LegalonTemplateIndex |
| `legalon-template/category.tsx` | legalon-template-f | pages/LegalonTemplateCategory |
| `legalon-template/detail.tsx` | legalon-template-f | pages/LegalonTemplateShow |
| `management-console/index.tsx` | management-console-f | pages/license |
| `management-console/mfa.tsx` | management-console-f | pages/mfa |
| `management-console/slack.tsx` | management-console-f | pages/slack |
| `management-console/teams.tsx` | management-console-f | pages/teams |
| `management-console/sso.tsx` | management-console-f | pages/sso |
| `management-console/company-info.tsx` | management-console-f | pages/companyInfo |
| `management-console/departments.tsx` | management-console-f | pages/departments |
| `management-console/spaces.tsx` | management-console-f | pages/spaces |
| `management-console/user-groups.tsx` | management-console-f | pages/userGroups |
| `management-console/audit-logs.tsx` | management-console-f | pages/auditLogs |
| `personal-setting/index.tsx` | personal-settings-f | pages/profile |
| `personal-setting/profile.tsx` | personal-settings-f | pages/profile |
| `personal-setting/contract-notification.tsx` | personal-settings-f | pages/contractManagement |
| `personal-setting/legal-notification.tsx` | personal-settings-f | pages/legalManagement |
| `personal-setting/legalscape.tsx` | personal-settings-f | pages/apiIntegration |
| `review/index.tsx` | review-console-f | pages/ReviewConsole |
| `review-console/index.tsx` | review-console-f | pages/subs |
| `review-console/my-playbook/index.tsx` | review-console-f | pages/MyPlaybook |
| `review-console/rules/index.tsx` | review-console-f | pages/Rules |
| `root/index.tsx` | root-f | pages/Root |
| `root/Maintenance.tsx` | root-f | pages/Maintenance |
| `root/NotFound.tsx` | root-f | pages/NotFound |
| `root/ServerError.tsx` | root-f | pages/ServerError |
| `setting-page/index.tsx` | management-console-f | pages/users |
| `manual-correction/index.tsx` | manual-correction-f | pages/index |
| `word-addin/index.tsx` | word-addin-f | pages/main |
| `word-addin-standalone/index.tsx` | word-addin-f | pages/LinkDocument |

## LOC Dev URL マッピング

テンプレートルート（`.sync-manifest.json` の `templateRoute`）と LOC Dev 環境パスの対応表。
Visual Comparison Loop（Step V2）で使用。

| エントリキー | テンプレートルート | LOC Dev パス |
|-------------|-------------------|-------------|
| `dashboard/index.tsx` | `/template/dashboard` | `/dashboard` |
| `dashboard/contract-review/index.tsx` | `/template/dashboard/contract-review` | `/dashboard/contract-review` |
| `dashboard/analytics/index.tsx` | `/template/dashboard/analytics` | `/analytics` |
| `case/index.tsx` | `/template/loc/case` | `/case` |
| `case/detail/index.tsx` | `/template/loc/case/detail` | `/case/{id}` |
| `application-console/index.tsx` | `/template/loc/application-console` | `/application-console/legal-management/case-status` |
| `application-console/case-reception-form/index.tsx` | `/template/loc/application-console/case-reception-form` | `/application-console/legal-management/case-reception-form` |
| `application-console/contract-management/esign-integration/index.tsx` | `/template/loc/application-console/contract-management/esign-integration` | `/application-console/contract-management/esign-integration` |
| `application-console/contract-management/custom-attribute-definition/index.tsx` | `/template/loc/application-console/contract-management/custom-attribute-definition` | `/application-console/contract-management/custom-attribute-definition` |
| `application-console/contract-management/inhouse-id-auto-numbering/index.tsx` | `/template/loc/application-console/contract-management/inhouse-id-auto-numbering` | `/application-console/contract-management/inhouse-id-auto-numbering` |
| `application-console/contract-management/notification/index.tsx` | `/template/loc/application-console/contract-management/notification` | `/application-console/contract-management/notification` |
| `application-console/sign/sender-name/index.tsx` | `/template/loc/application-console/sign/sender-name` | `/application-console/sign/sender-name` |
| `application-console/sign/default-space/index.tsx` | `/template/loc/application-console/sign/default-space` | `/application-console/sign/default-space` |
| `application-console/sign/sign-workflow-form/index.tsx` | `/template/loc/application-console/sign/sign-workflow-form` | `/application-console/sign/sign-workflow-form` |
| `case-reception-form/index.tsx` | `/template/case-reception-form` | `/case-reception-form` |
| `esign/index.tsx` | `/template/esign` | `/sign` |
| `esign/envelope-list.tsx` | `/template/esign/envelope-list` | `/sign/envelope` |
| `file-management/index.tsx` | `/template/file-management` | `/file-management` |
| `file-management/detail/index.tsx` | `/template/file-management/detail/sample-001` | `/file-management/{id}` |
| `file-management/customer-template/index.tsx` | `/template/file-management/customer-template` | `/file/customer-template` |
| `loa/index.tsx` | `/template/loc/loa` | `/assistant` |
| `loa/history/index.tsx` | `/template/loc/loa/history` | `/assistant/history` |
| `loa/playbook/index.tsx` | `/template/loc/loa/playbook` | `/assistant/playbook` |
| `loa/prompt-library/index.tsx` | `/template/loc/loa/prompt-library` | `/assistant/prompt-library` |
| `legalon-template/index.tsx` | `/template/legalon-template` | `/legalon-template` |
| `legalon-template/category.tsx` | `/template/legalon-template/category` | `/legalon-template/{category}` |
| `legalon-template/detail.tsx` | `/template/legalon-template/tmpl1` | `/legalon-template/{id}` |
| `management-console/index.tsx` | `/template/management-console` | `/management-console/license` |
| `management-console/mfa.tsx` | `/template/management-console/mfa` | `/management-console/mfa` |
| `management-console/slack.tsx` | `/template/management-console/slack` | `/management-console/slack-integration` |
| `management-console/teams.tsx` | `/template/management-console/teams` | `/management-console/teams-integration` |
| `management-console/sso.tsx` | `/template/management-console/sso` | `/management-console/single-sign-on` |
| `management-console/company-info.tsx` | `/template/management-console/company-info` | `/management-console/company-info` |
| `management-console/departments.tsx` | `/template/management-console/departments` | `/management-console/departments` |
| `management-console/spaces.tsx` | `/template/management-console/spaces` | `/management-console/spaces` |
| `management-console/user-groups.tsx` | `/template/management-console/user-groups` | `/management-console/user-groups` |
| `management-console/audit-logs.tsx` | `/template/management-console/audit-logs` | `/management-console/audit-logs` |
| `personal-setting/index.tsx` | `/template/personal-setting` | `/personal-setting` |
| `personal-setting/profile.tsx` | `/template/personal-setting/profile` | `/personal-setting/profile` |
| `personal-setting/contract-notification.tsx` | `/template/personal-setting/contract-notification` | `/personal-setting/contract-notification` |
| `personal-setting/legal-notification.tsx` | `/template/personal-setting/legal-notification` | `/personal-setting/legal-notification` |
| `personal-setting/legalscape.tsx` | `/template/personal-setting/legalscape` | `/personal-setting/legalscape` |
| `review/index.tsx` | `/template/loc/review` | `/dashboard/contract-review` |
| `review-console/index.tsx` | `/template/loc/review-console` | `/review-console` |
| `review-console/my-playbook/index.tsx` | `/template/loc/review-console/my-playbook` | `/review-console/my-playbook` |
| `review-console/rules/index.tsx` | `/template/loc/review-console/rules` | `/review-console/rules` |
| `root/index.tsx` | `/template/root` | `/` |
| `root/Maintenance.tsx` | `/template/root/maintenance` | `/maintenance` |
| `root/NotFound.tsx` | `/template/root/not-found` | `/not-found` |
| `root/ServerError.tsx` | `/template/root/server-error` | `/server-error` |
| `setting-page/index.tsx` | `/template/setting-page` | `/management-console/users` |
| `manual-correction/index.tsx` | `/template/loc/manual-correction` | `/preview/{contractId}/{documentId}/{pageId}` |
| `word-addin/index.tsx` | `/template/loc/word-addin` | N/A（Word Add-in） |
| `word-addin-standalone/index.tsx` | `/template/loc/word-addin-standalone` | N/A（Word Add-in） |

**ベース URL:**
- 通常: `https://app.dev.jp.loc-internal.com`
- 手動補正: `https://app.manual-correction.itg.qa01.jp.loc-internal.com`

**注意:**
- `{id}` や `{category}` はプレースホルダ。実行時に LOC Dev の実データから適当なIDを取得する
- `N/A` のエントリは LOC Dev 上にブラウザアクセス可能なページがないため、Visual Comparison Loop の対象外
- esign の LOC Dev パスは `/sign`（`/esign` ではない）
- 手動補正（`manual-correction-f`）は通常の LOC Dev とは別ドメインで動作する。Visual Comparison Loop 時はベース URL を切り替えること

## 注意事項

- `document-management-f` はページを持たず、共有モジュール `@legalforce/loc-file-management-module` を使用
- `personal-setting/`（単数）と `personal-settings-f`（複数）の名前の不一致に注意
- `review/` と `review-console/` は両方 `review-console-f` に対応するが、異なるページ
- 各テンプレートの正確なソースマッピングは `.sync-manifest.json` を参照
