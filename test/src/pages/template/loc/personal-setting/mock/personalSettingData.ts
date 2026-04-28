/**
 * Mock data for Personal Setting template
 */

// User Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string | null;
  userTypes: {
    documentManagement: string;
    legalManagement: string;
    review: string;
    esign: string;
  };
  roles: string[];
  userGroupNames: string[];
}

export const MOCK_USER_PROFILE: UserProfile = {
  id: "018c7c70-9307-7cb8-a8bf-a4075bd18c93",
  name: "山田 太郎",
  email: "yamada.taro@example.com",
  profileImageUrl: null,
  userTypes: {
    documentManagement: "標準ユーザー",
    legalManagement: "標準ユーザー",
    review: "レビューユーザー",
    esign: "サインユーザー",
  },
  roles: ["IT管理者", "アプリ管理者"],
  userGroupNames: ["法務部", "総務部"],
};

// Locale Settings
export interface LocaleSettings {
  language: "ja-JP" | "en-US";
  timezone: string;
}

export const MOCK_LOCALE_SETTINGS: LocaleSettings = {
  language: "ja-JP",
  timezone: "Asia/Tokyo",
};

export const LANGUAGE_OPTIONS = [
  { value: "ja-JP", label: "日本語" },
  { value: "en-US", label: "English" },
] satisfies Array<{ value: string; label: string }>;

export const TIMEZONE_OPTIONS = [
  { value: "Asia/Tokyo", label: "Asia/Tokyo (UTC+09:00)" },
  { value: "America/New_York", label: "America/New_York (UTC-05:00)" },
  { value: "Europe/London", label: "Europe/London (UTC+00:00)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (UTC+08:00)" },
] satisfies Array<{ value: string; label: string }>;

// Contract Management Notification Config
export interface ContractNotificationConfig {
  viewerEnabled: boolean;
  viewerMonths: number;
  assigneeEnabled: boolean;
  assigneeDays: number;
}

export const MOCK_CONTRACT_NOTIFICATION: ContractNotificationConfig = {
  viewerEnabled: true,
  viewerMonths: 3,
  assigneeEnabled: true,
  assigneeDays: 7,
};

// Legal Management Notification Config
export interface LegalNotificationConfig {
  caseCreated: boolean;
  becameMainAssignee: boolean;
  becameSubAssignee: boolean;
  mentioned: boolean;
}

export const MOCK_LEGAL_NOTIFICATION: LegalNotificationConfig = {
  caseCreated: true,
  becameMainAssignee: true,
  becameSubAssignee: true,
  mentioned: true,
};

// Legalscape Integration Status
export interface LegalscapeStatus {
  isEnabled: boolean;
  connectedAt: string | null;
}

export const MOCK_LEGALSCAPE_STATUS: LegalscapeStatus = {
  isEnabled: false,
  connectedAt: null,
};
