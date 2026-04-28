import { LfPlusLarge } from "@legalforce/aegis-icons";
import { Button, DataTable } from "@legalforce/aegis-react";
import styles from "./index.module.css";
import { meetingColumns, meetingItems } from "./mock";

/**
 * 「ミーティング」タブのコンテンツ。
 * 案件に紐づくミーティング一覧を DataTable で表示する。
 */
export function MeetingsTabContent() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Button variant="solid" size="small" leading={LfPlusLarge}>
          ミーティングを登録
        </Button>
      </div>
      <DataTable
        columns={meetingColumns}
        rows={meetingItems}
        getRowId={(row) => row.id}
        rowSelectionType="multiple"
        defaultColumnPinning={{ end: ["actions"] }}
      />
    </div>
  );
}
