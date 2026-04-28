import { FormControl, Select } from "@legalforce/aegis-react";
import { creatorContractOptions, storageLocationOptions } from "../mock/data";
import { SearchFilterPane } from "./SearchFilterPane";
import { OTHER_FILE_FILTER_DEFAULT, type OtherFileFilterState } from "./types";

export type OtherFileFilterProps = {
  value: OtherFileFilterState;
  onChange: (next: OtherFileFilterState) => void;
};

export function OtherFileFilter({ value, onChange }: OtherFileFilterProps) {
  const update = (patch: Partial<OtherFileFilterState>) => onChange({ ...value, ...patch });

  return (
    <SearchFilterPane onReset={() => onChange(OTHER_FILE_FILTER_DEFAULT)}>
      <FormControl>
        <FormControl.Label>保存先</FormControl.Label>
        <Select
          options={storageLocationOptions}
          value={value.storageLocation}
          onChange={(v) => update({ storageLocation: v })}
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>作成者</FormControl.Label>
        <Select options={creatorContractOptions} value={value.createdBy} onChange={(v) => update({ createdBy: v })} />
      </FormControl>
    </SearchFilterPane>
  );
}
