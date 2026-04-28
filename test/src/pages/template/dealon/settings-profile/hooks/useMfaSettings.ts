import { useCallback, useState } from "react";
import type { MfaMethod, MfaMethodType } from "../utils";
import { getMfaTypeLabel } from "../utils";

/**
 * MFA設定 hook の返り値
 */
export interface UseMfaSettingsResult {
  /** MFAの有効/無効状態 */
  mfaEnabled: boolean;
  /** 登録済みMFA方式のリスト */
  mfaMethods: MfaMethod[];
  /** 追加するMFA方式の種別 */
  newMfaMethodType: MfaMethodType;
  /** MFA方式削除確認ダイアログの開閉状態 */
  mfaDeleteDialogOpen: boolean;
  /** 削除対象のMFA方式 */
  mfaMethodToDelete: MfaMethod | null;
  /** MFA設定編集ダイアログの開閉状態 */
  isMfaEditing: boolean;
  /** MFAの有効/無効を更新する関数 */
  setMfaEnabled: (value: boolean) => void;
  /** 追加するMFA方式の種別を更新する関数 */
  setNewMfaMethodType: (value: MfaMethodType) => void;
  /** MFA設定編集ダイアログの開閉状態を更新する関数 */
  setIsMfaEditing: (value: boolean) => void;
  /** 新しいMFA方式を追加する */
  handleAddMfaMethod: () => void;
  /** MFA方式の削除確認ダイアログを開く */
  handleMfaDeleteClick: (m: MfaMethod) => void;
  /** MFA方式の削除を確定する */
  handleMfaDeleteConfirm: () => void;
  /** MFA方式の削除をキャンセルする */
  handleMfaDeleteCancel: () => void;
  /** MFA設定を保存してダイアログを閉じる */
  handleSaveMfa: () => void;
  /** MFA設定の編集をキャンセルしてダイアログを閉じる */
  handleCancelMfa: () => void;
}

/**
 * MFA設定の state とハンドラを管理する hook
 */
export const useMfaSettings = (): UseMfaSettingsResult => {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaMethods, setMfaMethods] = useState<MfaMethod[]>([]);
  const [newMfaMethodType, setNewMfaMethodType] = useState<MfaMethodType>("sms");
  const [mfaDeleteDialogOpen, setMfaDeleteDialogOpen] = useState(false);
  const [mfaMethodToDelete, setMfaMethodToDelete] = useState<MfaMethod | null>(null);
  const [isMfaEditing, setIsMfaEditing] = useState(false);

  const handleAddMfaMethod = useCallback(() => {
    const label = getMfaTypeLabel(newMfaMethodType);
    setMfaMethods((prev) => [...prev, { id: `mfa-${Date.now()}`, type: newMfaMethodType, label }]);
  }, [newMfaMethodType]);

  const handleMfaDeleteClick = useCallback((m: MfaMethod) => {
    setMfaMethodToDelete(m);
    setMfaDeleteDialogOpen(true);
  }, []);

  const handleMfaDeleteConfirm = useCallback(() => {
    if (mfaMethodToDelete) {
      setMfaMethods((prev) => prev.filter((x) => x.id !== mfaMethodToDelete.id));
      setMfaDeleteDialogOpen(false);
      setMfaMethodToDelete(null);
    }
  }, [mfaMethodToDelete]);

  const handleMfaDeleteCancel = useCallback(() => {
    setMfaDeleteDialogOpen(false);
    setMfaMethodToDelete(null);
  }, []);

  const handleSaveMfa = useCallback(() => {
    setIsMfaEditing(false);
  }, []);

  const handleCancelMfa = useCallback(() => {
    setIsMfaEditing(false);
  }, []);

  return {
    mfaEnabled,
    mfaMethods,
    newMfaMethodType,
    mfaDeleteDialogOpen,
    mfaMethodToDelete,
    isMfaEditing,
    setMfaEnabled,
    setNewMfaMethodType,
    setIsMfaEditing,
    handleAddMfaMethod,
    handleMfaDeleteClick,
    handleMfaDeleteConfirm,
    handleMfaDeleteCancel,
    handleSaveMfa,
    handleCancelMfa,
  };
};
