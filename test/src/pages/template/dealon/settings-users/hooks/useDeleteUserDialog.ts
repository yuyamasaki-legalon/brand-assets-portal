import { useCallback, useState } from "react";
import type { UserItem } from "../mock";

/**
 * ユーザー削除確認ダイアログ hook の返り値
 */
export interface UseDeleteUserDialogResult {
  /** 削除確認ダイアログの開閉状態 */
  deleteDialogOpen: boolean;
  /** 削除対象のユーザー */
  deletingUser: UserItem | null;
  /** 削除確認ダイアログを開く */
  handleOpenDelete: (user: UserItem) => void;
  /** 削除を確定してダイアログを閉じる */
  handleConfirmDelete: () => void;
  /** 削除をキャンセルしてダイアログを閉じる */
  handleCancelDelete: () => void;
}

/**
 * ユーザー削除確認ダイアログの state とハンドラを管理する hook
 * @param setUsers - ユーザーリストを更新する関数
 */
export const useDeleteUserDialog = (
  setUsers: React.Dispatch<React.SetStateAction<UserItem[]>>,
): UseDeleteUserDialogResult => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

  const handleOpenDelete = useCallback((user: UserItem) => {
    setDeletingUser(user);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deletingUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    setDeleteDialogOpen(false);
    setDeletingUser(null);
  }, [deletingUser, setUsers]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setDeletingUser(null);
  }, []);

  return {
    deleteDialogOpen,
    deletingUser,
    handleOpenDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
};
