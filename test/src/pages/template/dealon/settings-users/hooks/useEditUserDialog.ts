import { useCallback, useState } from "react";
import type { UserItem, UserRole } from "../mock";

/**
 * ユーザー編集ダイアログ hook の返り値
 */
export interface UseEditUserDialogResult {
  /** 編集ダイアログの開閉状態 */
  editDialogOpen: boolean;
  /** 編集中のユーザー */
  editingUser: UserItem | null;
  /** 編集中の氏名 */
  editName: string;
  /** 編集中のロール */
  editRole: UserRole;
  /** 編集中の氏名を更新する関数 */
  setEditName: (value: string) => void;
  /** 編集中のロールを更新する関数 */
  setEditRole: (value: UserRole) => void;
  /** 編集ダイアログを開く */
  handleOpenEdit: (user: UserItem) => void;
  /** 編集内容を保存してダイアログを閉じる */
  handleSaveEdit: () => void;
  /** 編集をキャンセルしてダイアログを閉じる */
  handleCancelEdit: () => void;
}

/**
 * ユーザー編集ダイアログの state とハンドラを管理する hook
 * @param setUsers - ユーザーリストを更新する関数
 */
export const useEditUserDialog = (
  setUsers: React.Dispatch<React.SetStateAction<UserItem[]>>,
): UseEditUserDialogResult => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("Member");

  const handleOpenEdit = useCallback((user: UserItem) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setEditDialogOpen(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingUser) return;
    setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, name: editName, role: editRole } : u)));
    setEditDialogOpen(false);
    setEditingUser(null);
  }, [editingUser, editName, editRole, setUsers]);

  const handleCancelEdit = useCallback(() => {
    setEditDialogOpen(false);
    setEditingUser(null);
  }, []);

  return {
    editDialogOpen,
    editingUser,
    editName,
    editRole,
    setEditName,
    setEditRole,
    handleOpenEdit,
    handleSaveEdit,
    handleCancelEdit,
  };
};
