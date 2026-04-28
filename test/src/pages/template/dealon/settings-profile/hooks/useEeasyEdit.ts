import { useCallback, useState } from "react";

/**
 * eeasy連携編集 hook の返り値
 */
export interface UseEeasyEditResult {
  /** eeasy連携URL */
  eeasyUrl: string;
  /** eeasy編集ダイアログの開閉状態 */
  isEeasyEditing: boolean;
  /** eeasy連携URLを更新する関数 */
  setEeasyUrl: (value: string) => void;
  /** eeasy編集ダイアログの開閉状態を更新する関数 */
  setIsEeasyEditing: (value: boolean) => void;
  /** eeasy連携設定を保存してダイアログを閉じる */
  handleSaveEeasy: () => void;
  /** 編集をキャンセルして初期値に戻す */
  handleCancelEeasy: () => void;
}

/**
 * eeasy連携編集の state とハンドラを管理する hook
 */
export const useEeasyEdit = (): UseEeasyEditResult => {
  const [eeasyUrl, setEeasyUrl] = useState("https://eeasy.jp/s/yamamoto");
  const [isEeasyEditing, setIsEeasyEditing] = useState(false);

  const handleSaveEeasy = useCallback(() => {
    setIsEeasyEditing(false);
  }, []);

  const handleCancelEeasy = useCallback(() => {
    setEeasyUrl("https://eeasy.jp/s/yamamoto");
    setIsEeasyEditing(false);
  }, []);

  return {
    eeasyUrl,
    isEeasyEditing,
    setEeasyUrl,
    setIsEeasyEditing,
    handleSaveEeasy,
    handleCancelEeasy,
  };
};
