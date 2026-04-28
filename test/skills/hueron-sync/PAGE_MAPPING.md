# Hueron ページマッピング

## テンプレートパス → hueron-app ソースパス

| テンプレートパス | hueron-app ソースパス | 備考 |
|-----------------|---------------------|------|
| `employee-registration/index.tsx` | `wizard/employee/` | 入社ウィザード |
| `procedure/index.tsx` | `procedure/` | 手続き一覧 |
| `profile/index.tsx` | `profile/` | プロフィールトップ |
| `profile/employee/index.tsx` | `profile/(with-navi)/employee/` | 従業員情報 |
| `profile/personal-info/index.tsx` | `profile/(with-navi)/personal-info/` | 個人情報 |
| `profile/additional-info/index.tsx` | `profile/(with-navi)/additional-info/` | 追加情報 |
| `profile/tax-insurance/index.tsx` | `profile/(with-navi)/tax-insurance/` | 税・保険 |
| `profile/family-info/index.tsx` | `profile/(with-navi)/family-info/` | 家族情報 |
| `profile/payment-deduction/index.tsx` | `profile/(with-navi)/payment-deduction/` | 支給・控除 |
| `profile/salary-bonus-detail/index.tsx` | `profile/(with-navi)/salary-bonus-detail/` | 給与・賞与明細 |
| `profile/leave-of-absence/index.tsx` | `profile/(with-navi)/leave-of-absence/` | 休職 |
| `profile/department-assignment/index.tsx` | `profile/(with-navi)/department-assignment/` | 部署配属 |
| `profile/custom/index.tsx` | `profile/(with-navi)/custom/` | カスタム項目 |
| `setting/index.tsx` | `setting/` | 設定トップ |
| `setting/account/index.tsx` | `setting/account/` | アカウント設定 |
| `setting/invite/index.tsx` | `setting/invite-admin/` | 管理者招待 |
| `setting/permission-management/index.tsx` | `setting/permission-management/` | 権限管理 |

## Next.js ルートグループについて

hueron-app は Next.js App Router を使用しており、ルートグループ（`(with-navi)`, `(simple)`, `(list)` 等）が存在する。

- **ファイルシステム**: `profile/(with-navi)/employee/page.tsx` のように括弧付きディレクトリが存在
- **URL**: ルートグループは URL に含まれない → `/profile/{id}/employee`
- **マニフェスト**: `pagePath` にはルートグループを**含める**（ソースファイル特定のため）
- **Staging URL**: ルートグループは**含めない**（URL パスのため）

## Staging URL マッピング

Visual Comparison Loop（Step V2）で使用。

| エントリキー | テンプレートルート | Staging パス |
|-------------|-------------------|-------------|
| `employee-registration/index.tsx` | `/template/workon/employee-registration` | `/wizard/employee` |
| `procedure/index.tsx` | `/template/workon/procedure` | `/procedure` |
| `profile/index.tsx` | `/template/workon/profile` | `/profile` |
| `profile/employee/index.tsx` | `/template/workon/profile/employee` | `/profile/{id}/employee` |
| `profile/personal-info/index.tsx` | `/template/workon/profile/personal-info` | `/profile/{id}/personal-info` |
| `profile/additional-info/index.tsx` | `/template/workon/profile/additional-info` | `/profile/{id}/additional-info` |
| `profile/tax-insurance/index.tsx` | `/template/workon/profile/tax-insurance` | `/profile/{id}/tax-insurance` |
| `profile/family-info/index.tsx` | `/template/workon/profile/family-info` | `/profile/{id}/family-info` |
| `profile/payment-deduction/index.tsx` | `/template/workon/profile/payment-deduction` | `/profile/{id}/payment-deduction` |
| `profile/salary-bonus-detail/index.tsx` | `/template/workon/profile/salary-bonus-detail` | `/profile/{id}/salary-bonus-detail` |
| `profile/leave-of-absence/index.tsx` | `/template/workon/profile/leave-of-absence` | `/profile/{id}/leave-of-absence` |
| `profile/department-assignment/index.tsx` | `/template/workon/profile/department-assignment` | `/profile/{id}/department-assignment` |
| `profile/custom/index.tsx` | `/template/workon/profile/custom` | `/profile/{id}/custom` |
| `setting/index.tsx` | `/template/workon/setting` | `/setting` |
| `setting/account/index.tsx` | `/template/workon/setting/account` | `/setting/account` |
| `setting/invite/index.tsx` | `/template/workon/setting/invite` | `/setting/invite-admin` |
| `setting/permission-management/index.tsx` | `/template/workon/setting/permission-management` | `/setting/permission-management` |

**ベース URL:** `https://stg.workon-dev.com`

**注意:**
- `{id}` はプレースホルダ。実行時に Staging の実データから適当なIDを取得する
- profile 配下のページは Staging では `/profile/{id}/{tab}` 形式でアクセスする

## 注意事項

- `setting/invite/` テンプレート ↔ `setting/invite-admin/` ソースのパス不一致に注意
- `employee-registration/` テンプレート ↔ `wizard/employee/` ソースのパス不一致に注意
- 各テンプレートの正確なソースマッピングは `.sync-manifest.json` を参照
