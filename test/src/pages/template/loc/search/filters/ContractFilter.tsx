import { Checkbox, FormControl, Select, TextField } from "@legalforce/aegis-react";
import {
  contractStatusOptions,
  contractSubTypeOptions,
  contractTypeOptions,
  creatorContractOptions,
  governingLawOptions,
  languageOptions,
  storageLocationOptions,
} from "../mock/data";
import { SearchFilterPane } from "./SearchFilterPane";
import { CONTRACT_FILTER_DEFAULT, type ContractFilterState } from "./types";

export type ContractFilterProps = {
  value: ContractFilterState;
  onChange: (next: ContractFilterState) => void;
  /** 契約書ステータスを表示するか（締結版契約書では非表示） */
  showStatus?: boolean;
};

export function ContractFilter({ value, onChange, showStatus = false }: ContractFilterProps) {
  const update = (patch: Partial<ContractFilterState>) => onChange({ ...value, ...patch });

  return (
    <SearchFilterPane onReset={() => onChange(CONTRACT_FILTER_DEFAULT)}>
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
        <FormControl.Label>自社名</FormControl.Label>
        <TextField
          value={value.companyName}
          onChange={(e) => update({ companyName: e.target.value })}
          placeholder="自社名で検索"
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>取引先名</FormControl.Label>
        <TextField
          value={value.counterPartyName}
          onChange={(e) => update({ counterPartyName: e.target.value })}
          placeholder="取引先名で検索"
        />
      </FormControl>

      {showStatus && (
        <FormControl>
          <FormControl.Label>契約書ステータス</FormControl.Label>
          <Select
            options={contractStatusOptions}
            value={value.contractStatus}
            onChange={(v) => update({ contractStatus: v })}
          />
        </FormControl>
      )}

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
