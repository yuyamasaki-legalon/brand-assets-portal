import { LfPlusLarge } from "@legalforce/aegis-icons";
import { Button, DataTable, SegmentedControl } from "@legalforce/aegis-react";
import { useState } from "react";
import styles from "./index.module.css";
import { taskColumns, taskFilterOptions, taskItems } from "./mock";

/**
 * 「タスク」タブのコンテンツ。
 * 案件に紐づくタスク一覧をステータス別フィルターと DataTable で表示する。
 */
export function TasksTabContent() {
  const [taskFilterIndex, setTaskFilterIndex] = useState(0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <SegmentedControl size="small" variant="plain" index={taskFilterIndex} onChange={setTaskFilterIndex}>
          {taskFilterOptions.map((opt) => (
            <SegmentedControl.Button key={opt.label}>{opt.label}</SegmentedControl.Button>
          ))}
        </SegmentedControl>
        <Button variant="solid" size="small" leading={LfPlusLarge}>
          タスクを作成
        </Button>
      </div>
      <DataTable
        columns={taskColumns}
        rows={taskItems}
        getRowId={(row) => row.id}
        rowSelectionType="multiple"
        defaultColumnPinning={{ end: ["actions"] }}
      />
    </div>
  );
}
