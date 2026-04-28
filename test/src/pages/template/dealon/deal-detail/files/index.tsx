import { DataTable, Search, Select } from "@legalforce/aegis-react";
import { useState } from "react";
import styles from "./index.module.css";
import { fileColumns, fileItems, fileKindOptions } from "./mock";

/**
 * 「ファイル」タブのコンテンツ。
 * 案件に紐づくファイル一覧を種別フィルターと検索付き DataTable で表示する。
 */
export function FilesTabContent() {
  const [kindFilter, setKindFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = fileItems.filter((item) => {
    if (kindFilter && item.kind !== kindFilter) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Select
          size="small"
          value={kindFilter}
          onChange={(value) => setKindFilter(value)}
          options={fileKindOptions}
          placement="bottom-start"
          aria-label="ファイル種別フィルター"
        />
        <Search
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ファイル名で検索"
          aria-label="ファイル名で検索"
        />
      </div>
      <DataTable
        columns={fileColumns}
        rows={filteredItems}
        getRowId={(row) => row.id}
        rowSelectionType="multiple"
        defaultColumnPinning={{ end: ["actions"] }}
      />
    </div>
  );
}
