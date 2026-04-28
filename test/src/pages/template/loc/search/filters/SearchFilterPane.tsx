import { Button } from "@legalforce/aegis-react";
import type { ReactNode } from "react";
import styles from "../index.module.css";

export type SearchFilterPaneProps = {
  /** フィルターフォーム本体 */
  children: ReactNode;
  /** リセットボタンのコールバック */
  onReset: () => void;
};

/** 検索フィルターパネルの共通ラッパー（Body + Reset Footer） */
export function SearchFilterPane({ children, onReset }: SearchFilterPaneProps) {
  return (
    <aside>
      <div className={styles.filterBody}>{children}</div>
      <div className={styles.filterFooter}>
        <Button variant="plain" onClick={onReset}>
          リセット
        </Button>
      </div>
    </aside>
  );
}
