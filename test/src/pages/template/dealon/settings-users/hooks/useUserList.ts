import { useState } from "react";
import type { UserItem } from "../mock";

/**
 * ユーザーリスト hook の返り値
 */
export interface UseUserListResult {
  /** ユーザーリスト */
  users: UserItem[];
  /** ユーザーリストを更新する関数 */
  setUsers: React.Dispatch<React.SetStateAction<UserItem[]>>;
}

/**
 * ユーザーリストの state を管理する hook
 * @param initialUsers - 初期ユーザーリスト
 */
export const useUserList = (initialUsers: UserItem[]): UseUserListResult => {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  return { users, setUsers };
};
