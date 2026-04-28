export type SettingsNavItem = {
  label: string;
  path?: string;
};

export const TENANT_ITEMS: SettingsNavItem[] = [
  { label: "テナント設定" },
  { label: "外部連携設定" },
  { label: "ユーザー管理", path: "/template/dealon/settings-users" },
  { label: "ガイドライン管理" },
  { label: "独自ドメイン管理" },
  { label: "請求・ライセンス管理" },
  { label: "受注額目標管理" },
  { label: "フェーズマスタ管理" },
];

export const PROFILE_ITEMS: SettingsNavItem[] = [{ label: "個人設定", path: "/template/dealon/settings-profile" }];
