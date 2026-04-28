import { Checkbox, FormControl, Select, TextField } from "@legalforce/aegis-react";
import {
  contractSubTypeOptions,
  contractTypeOptions,
  creatorContractOptions,
  customerTemplateStatusOptions,
  governingLawOptions,
  languageOptions,
  storageLocationOptions,
} from "../mock/data";
import { SearchFilterPane } from "./SearchFilterPane";
import { CUSTOMER_TEMPLATE_FILTER_DEFAULT, type CustomerTemplateFilterState } from "./types";

export type CustomerTemplateFilterProps = {
  value: CustomerTemplateFilterState;
  onChange: (next: CustomerTemplateFilterState) => void;
};

export function CustomerTemplateFilter({ value, onChange }: CustomerTemplateFilterProps) {
  const update = (patch: Partial<CustomerTemplateFilterState>) => onChange({ ...value, ...patch });

  return (
    <SearchFilterPane onReset={() => onChange(CUSTOMER_TEMPLATE_FILTER_DEFAULT)}>
      <FormControl>
        <FormControl.Label>バージョン</FormControl.Label>
        <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
          <TextField
            type="number"
            value={value.versionFrom}
            onChange={(e) => update({ versionFrom: e.target.value })}
            placeholder="1"
          />
          <Checkbox checked={value.includeOrAbove} onChange={(e) => update({ includeOrAbove: e.target.checked })}>
            以上含む
          </Checkbox>
        </div>
      </FormControl>

      <FormControl>
        <FormControl.Label>準拠法</FormControl.Label>
        <Select
          options={governingLawOptions}
          value={value.governingLaw}
          onChange={(v) => update({ governingLaw: v })}
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>契約類型</FormControl.Label>
        <Select
          options={contractTypeOptions}
          value={value.contractType}
          onChange={(v) => update({ contractType: v })}
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>契約類型（小分類）</FormControl.Label>
        <Select
          options={contractSubTypeOptions}
          value={value.contractSubType}
          onChange={(v) => update({ contractSubType: v })}
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>作成者</FormControl.Label>
        <Select options={creatorContractOptions} value={value.createdBy} onChange={(v) => update({ createdBy: v })} />
      </FormControl>

      <FormControl>
        <FormControl.Label>自社ひな形ステータス</FormControl.Label>
        <Select
          options={customerTemplateStatusOptions}
          value={value.customerTemplateStatus}
          onChange={(v) => update({ customerTemplateStatus: v })}
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>言語</FormControl.Label>
        <Select options={languageOptions} value={value.language} onChange={(v) => update({ language: v })} />
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
