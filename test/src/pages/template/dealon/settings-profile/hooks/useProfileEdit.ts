import { useCallback, useState } from "react";

/**
 * プロフィール編集 hook の返り値
 */
export interface UseProfileEditResult {
  /** ユーザーの氏名 */
  name: string;
  /** ユーザーのメールアドレス（読み取り専用） */
  email: string;
  /** プロフィール編集ダイアログの開閉状態 */
  isProfileEditing: boolean;
  /** 氏名を更新する関数 */
  setName: (value: string) => void;
  /** プロフィール編集ダイアログの開閉状態を更新する関数 */
  setIsProfileEditing: (value: boolean) => void;
  /** プロフィールを保存してダイアログを閉じる */
  handleSaveProfile: () => void;
  /** 編集をキャンセルして初期値に戻す */
  handleCancelProfile: () => void;
}

/**
 * プロフィール編集の state とハンドラを管理する hook
 */
export const useProfileEdit = (): UseProfileEditResult => {
  const [name, setName] = useState("山本 理沙");
  const [email] = useState("yamamoto@example.co.jp");
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  const handleSaveProfile = useCallback(() => {
    setIsProfileEditing(false);
  }, []);

  const handleCancelProfile = useCallback(() => {
    setName("山本 理沙");
    setIsProfileEditing(false);
  }, []);

  return {
    name,
    email,
    isProfileEditing,
    setName,
    setIsProfileEditing,
    handleSaveProfile,
    handleCancelProfile,
  };
};
