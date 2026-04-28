import { FormControl, Select } from "@legalforce/aegis-react";
import { caseAssigneeOptions, caseDepartmentOptions, caseStatusOptions, storageLocationOptions } from "../mock/data";
import { SearchFilterPane } from "./SearchFilterPane";
import { CASE_FILTER_DEFAULT, type CaseFilterState } from "./types";

export type CaseFilterProps = {
  value: CaseFilterState;
  onChange: (next: CaseFilterState) => void;
};

export function CaseFilter({ value, onChange }: CaseFilterProps) {
  const update = (patch: Partial<CaseFilterState>) => onChange({ ...value, ...patch });

  return (
    <SearchFilterPane onReset={() => onChange(CASE_FILTER_DEFAULT)}>
      <FormControl>
        <FormControl.Label>案件担当者</FormControl.Label>
        <Select options={caseAssigneeOptions} value={value.assignee} onChange={(v) => update({ assignee: v })} />
      </FormControl>

      <FormControl>
        <FormControl.Label>案件依頼部署</FormControl.Label>
        <Select options={caseDepartmentOptions} value={value.department} onChange={(v) => update({ department: v })} />
      </FormControl>

      <FormControl>
        <FormControl.Label>案件ステータス</FormControl.Label>
        <Select options={caseStatusOptions} value={value.caseStatus} onChange={(v) => update({ caseStatus: v })} />
      </FormControl>

      <FormControl>
        <FormControl.Label>保存先</FormControl.Label>
        <Select
          options={storageLocationOptions}
          value={value.storageLocation}
          onChange={(v) => update({ storageLocation: v })}
        />
      </FormControl>
    </SearchFilterPane>
  );
}
