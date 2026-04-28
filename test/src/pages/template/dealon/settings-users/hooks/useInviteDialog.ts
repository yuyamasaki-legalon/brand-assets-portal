import { useCallback, useState } from "react";
import type { UserItem, UserRole } from "../mock";

/**
 * ユーザー招待ダイアログ hook の返り値
 */
export interface UseInviteDialogResult {
  /** 招待ダイアログの開閉状態 */
  inviteDialogOpen: boolean;
  /** 新規ユーザーの氏名 */
  newUserName: string;
  /** 新規ユーザーのメールアドレス */
  newUserEmail: string;
  /** 新規ユーザーのロール */
  newUserRole: UserRole;
  /** 新規ユーザーの氏名を更新する関数 */
  setNewUserName: (value: string) => void;
  /** 新規ユーザーのメールアドレスを更新する関数 */
  setNewUserEmail: (value: string) => void;
  /** 新規ユーザーのロールを更新する関数 */
  setNewUserRole: (value: UserRole) => void;
  /** 招待ダイアログを開く */
  handleOpenInvite: () => void;
  /** ユーザーを招待してダイアログを閉じる */
  handleInvite: () => void;
  /** 招待をキャンセルしてダイアログを閉じる */
  handleCancelInvite: () => void;
}

/**
 * ユーザー招待ダイアログの state とハンドラを管理する hook
 * @param setUsers - ユーザーリストを更新する関数
 */
export const useInviteDialog = (setUsers: React.Dispatch<React.SetStateAction<UserItem[]>>): UseInviteDialogResult => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("Member");

  const handleOpenInvite = useCallback(() => {
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Member");
    setInviteDialogOpen(true);
  }, []);

  const handleInvite = useCallback(() => {
    if (!newUserName || !newUserEmail) return;
    const today = new Date().toISOString().slice(0, 10);
    setUsers((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        status: "招待中",
        invitedAt: today,
        lastLoginAt: null,
      },
    ]);
    setInviteDialogOpen(false);
  }, [newUserName, newUserEmail, newUserRole, setUsers]);

  const handleCancelInvite = useCallback(() => {
    setInviteDialogOpen(false);
  }, []);

  return {
    inviteDialogOpen,
    newUserName,
    newUserEmail,
    newUserRole,
    setNewUserName,
    setNewUserEmail,
    setNewUserRole,
    handleOpenInvite,
    handleInvite,
    handleCancelInvite,
  };
};
