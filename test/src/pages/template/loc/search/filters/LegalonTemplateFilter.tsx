import { FormControl, Select } from "@legalforce/aegis-react";
import {
  creatorLegalonTemplateOptions,
  languageOptions,
  legalonCategoryOptions,
  legalonSubCategoryOptions,
} from "../mock/data";
import { SearchFilterPane } from "./SearchFilterPane";
import { LEGALON_TEMPLATE_FILTER_DEFAULT, type LegalonTemplateFilterState } from "./types";

export type LegalonTemplateFilterProps = {
  value: LegalonTemplateFilterState;
  onChange: (next: LegalonTemplateFilterState) => void;
};

export function LegalonTemplateFilter({ value, onChange }: LegalonTemplateFilterProps) {
  const update = (patch: Partial<LegalonTemplateFilterState>) => onChange({ ...value, ...patch });

  return (
    <SearchFilterPane onReset={() => onChange(LEGALON_TEMPLATE_FILTER_DEFAULT)}>
      <FormControl>
        <FormControl.Label>カテゴリー</FormControl.Label>
        <Select options={legalonCategoryOptions} value={value.category} onChange={(v) => update({ category: v })} />
      </FormControl>

      <FormControl>
        <FormControl.Label>サブカテゴリー</FormControl.Label>
        <Select
          options={legalonSubCategoryOptions}
          value={value.subCategory}
          onChange={(v) => update({ subCategory: v })}
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>言語</FormControl.Label>
        <Select options={languageOptions} value={value.language} onChange={(v) => update({ language: v })} />
      </FormControl>

      <FormControl>
        <FormControl.Label>作成者</FormControl.Label>
        <Select
          options={creatorLegalonTemplateOptions}
          value={value.createdBy}
          onChange={(v) => update({ createdBy: v })}
        />
      </FormControl>
    </SearchFilterPane>
  );
}
