import { DataTable, SegmentedControl } from "@legalforce/aegis-react";
import { useState } from "react";
import styles from "./index.module.css";
import { jobColumns, jobFilterOptions, jobItems } from "./mock";

/**
 * 「ジョブ」タブのコンテンツ。
 * 案件に紐づくジョブ一覧をステータス別フィルターと DataTable で表示する。
 */
export function JobsTabContent() {
  const [filterIndex, setFilterIndex] = useState(0);

  return (
    <div className={styles.wrapper}>
      <SegmentedControl size="small" variant="plain" index={filterIndex} onChange={setFilterIndex}>
        {jobFilterOptions.map((opt) => (
          <SegmentedControl.Button key={opt.label}>
            {opt.label} ({opt.count})
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
      <DataTable
        columns={jobColumns}
        rows={jobItems}
        getRowId={(row) => row.id}
        defaultColumnPinning={{ end: ["actions"] }}
      />
    </div>
  );
}
