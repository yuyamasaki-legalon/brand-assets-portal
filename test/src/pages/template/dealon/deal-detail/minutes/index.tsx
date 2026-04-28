import { LfPlusLarge } from "@legalforce/aegis-icons";
import { Button, DataTable } from "@legalforce/aegis-react";
import styles from "./index.module.css";
import { minuteColumns, minuteItems } from "./mock";

/**
 * 「議事録」タブのコンテンツ。
 * 案件に紐づく議事録一覧を DataTable で表示する。
 */
export function MinutesTabContent() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Button variant="solid" size="small" leading={LfPlusLarge}>
          議事録を作成
        </Button>
      </div>
      <DataTable
        columns={minuteColumns}
        rows={minuteItems}
        getRowId={(row) => row.id}
        rowSelectionType="multiple"
        defaultColumnPinning={{ end: ["actions"] }}
      />
    </div>
  );
}
