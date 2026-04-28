// =============================================================================
// Types
// =============================================================================

export type UserRole = "Admin" | "Member";
export type UserStatus = "アクティブ" | "招待中" | "停止中";

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  invitedAt: string;
  lastLoginAt: string | null;
};

// =============================================================================
// Mock Data
// =============================================================================

export const initialUsers: UserItem[] = [
  {
    id: "u01",
    name: "山本 理沙",
    email: "yamamoto@example.co.jp",
    role: "Admin",
    status: "アクティブ",
    invitedAt: "2024-01-10",
    lastLoginAt: "2025-01-05",
  },
  {
    id: "u02",
    name: "田中 真央",
    email: "tanaka@example.co.jp",
    role: "Member",
    status: "アクティブ",
    invitedAt: "2024-01-25",
    lastLoginAt: "2025-01-04",
  },
  {
    id: "u03",
    name: "佐藤 健",
    email: "sato@example.co.jp",
    role: "Member",
    status: "アクティブ",
    invitedAt: "2024-03-05",
    lastLoginAt: "2025-01-03",
  },
  {
    id: "u04",
    name: "鈴木 花子",
    email: "suzuki@example.co.jp",
    role: "Member",
    status: "招待中",
    invitedAt: "2025-01-01",
    lastLoginAt: null,
  },
  {
    id: "u05",
    name: "高橋 太郎",
    email: "takahashi@example.co.jp",
    role: "Member",
    status: "停止中",
    invitedAt: "2024-04-01",
    lastLoginAt: "2024-12-01",
  },
];

// =============================================================================
// Status color map
// =============================================================================

export const statusColorMap: Record<UserStatus, "teal" | "blue" | "red"> = {
  アクティブ: "teal",
  招待中: "blue",
  停止中: "red",
};

// =============================================================================
// Role options
// =============================================================================

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
];
