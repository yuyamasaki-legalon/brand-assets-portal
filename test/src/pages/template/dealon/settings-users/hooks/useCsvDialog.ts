import { useCallback, useState } from "react";

/**
 * CSV一括登録ダイアログ hook の返り値
 */
export interface UseCsvDialogResult {
  /** CSV一括登録ダイアログの開閉状態 */
  csvDialogOpen: boolean;
  /** CSV一括登録ダイアログを開く */
  handleOpenCsv: () => void;
  /** CSV一括登録をキャンセルしてダイアログを閉じる */
  handleCancelCsv: () => void;
}

/**
 * CSV一括登録ダイアログの state とハンドラを管理する hook
 */
export const useCsvDialog = (): UseCsvDialogResult => {
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);

  const handleOpenCsv = useCallback(() => {
    setCsvDialogOpen(true);
  }, []);

  const handleCancelCsv = useCallback(() => {
    setCsvDialogOpen(false);
  }, []);

  return {
    csvDialogOpen,
    handleOpenCsv,
    handleCancelCsv,
  };
};
