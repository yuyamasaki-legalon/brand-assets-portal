/**
 * Mock data for License Management template
 */

export interface TenantInfo {
  id: string;
  name: string;
  plan: string;
}

export interface UsageQuota {
  name: string;
  current: number;
  max: number | null; // null for unlimited
  unit?: string;
  alertLevel?: "none" | "warning" | "danger";
}

export interface ModuleLicense {
  id: string;
  name: string;
  userTypes: { name: string; current: number; max: number }[];
  usageCounts?: { name: string; current: number; max: number }[];
  period: { start: string; end: string };
  isTrial?: boolean;
}

export interface OptionLicense {
  id: string;
  name: string;
}

export const MOCK_TENANT: TenantInfo = {
  id: "018c7c70-9307-7cb8-a8bf-a4075bd18c93",
  name: "case-mgmt-display-name",
  plan: "Enterpriseプラン",
};

export const MOCK_COMMON_USAGE: UsageQuota[] = [
  {
    name: "アカウント",
    current: 76,
    max: 10000,
    alertLevel: "none",
  },
  {
    name: "ストレージ容量",
    current: 0,
    max: null, // unlimited
    unit: "GB",
    alertLevel: "none",
  },
  {
    name: "ワークスペース",
    current: 43,
    max: 10000,
    alertLevel: "none",
  },
];

export const MOCK_MODULE_LICENSES: ModuleLicense[] = [
  {
    id: "contract-management",
    name: "コントラクトマネジメント",
    userTypes: [
      { name: "レビューライトユーザー", current: 45, max: 100 },
      { name: "レビューユーザー", current: 30, max: 50 },
      { name: "サインユーザー", current: 20, max: 50 },
    ],
    usageCounts: [
      { name: "レビュー実行数", current: 1250, max: 5000 },
      { name: "サイン実行数", current: 450, max: 2000 },
    ],
    period: { start: "2024-01-01", end: "2024-12-31" },
    isTrial: false,
  },
  {
    id: "matter-management",
    name: "マターマネジメント",
    userTypes: [
      { name: "ライトユーザー", current: 25, max: 100 },
      { name: "標準ユーザー", current: 15, max: 30 },
    ],
    period: { start: "2024-01-01", end: "2024-12-31" },
    isTrial: false,
  },
  {
    id: "trial-module",
    name: "トライアルモジュール",
    userTypes: [{ name: "トライアルユーザー", current: 5, max: 10 }],
    period: { start: "2024-11-01", end: "2024-12-31" },
    isTrial: true,
  },
];

export const MOCK_OPTION_LICENSES: OptionLicense[] = [
  { id: "sso", name: "SSO" },
  { id: "ip-restriction", name: "IPアドレス制限" },
  { id: "data-optout", name: "学習データオプトアウト" },
];

export const formatNumber = (num: number): string => {
  return num.toLocaleString("ja-JP");
};

export const formatUsage = (current: number, max: number | null): string => {
  if (max === null) {
    return "無制限";
  }
  return `${formatNumber(current)} / ${formatNumber(max)}`;
};

export const getAlertLevel = (current: number, max: number | null): "none" | "warning" | "danger" => {
  if (max === null) return "none";
  const usage = current / max;
  if (usage >= 1) return "danger";
  if (usage >= 0.8) return "warning";
  return "none";
};
