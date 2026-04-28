import { Checkbox, FormControl, Select, TextField } from "@legalforce/aegis-react";
import {
  contractFormOptions,
  contractStatusOptions,
  createdAtOptions,
  creatorContractOptions,
  creatorLegalonTemplateOptions,
} from "../mock/data";
import { SearchFilterPane } from "./SearchFilterPane";
import { ARTICLE_FILTER_DEFAULT, type ArticleFilterState } from "./types";

export type ArticleFilterProps = {
  value: ArticleFilterState;
  onChange: (next: ArticleFilterState) => void;
};

export function ArticleFilter({ value, onChange }: ArticleFilterProps) {
  const update = (patch: Partial<ArticleFilterState>) => onChange({ ...value, ...patch });

  return (
    <SearchFilterPane onReset={() => onChange(ARTICLE_FILTER_DEFAULT)}>
      <FormControl>
        <FormControl.Label>バージョン</FormControl.Label>
        <Checkbox checked={value.latestVersionOnly} onChange={(e) => update({ latestVersionOnly: e.target.checked })}>
          最新バージョンのみ
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormControl.Label>契約書・書式</FormControl.Label>
        <Select
          options={contractFormOptions}
          value={value.contractForm}
          onChange={(v) => update({ contractForm: v })}
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>ファイル名、タイトル</FormControl.Label>
        <TextField
          value={value.fileNameOrTitle}
          onChange={(e) => update({ fileNameOrTitle: e.target.value })}
          placeholder="ファイル名、タイトルで検索"
        />
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

      <FormControl>
        <FormControl.Label>契約書ステータス</FormControl.Label>
        <Select
          options={contractStatusOptions}
          value={value.contractStatus}
          onChange={(v) => update({ contractStatus: v })}
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>作成日</FormControl.Label>
        <Select options={createdAtOptions} value={value.createdAt} onChange={(v) => update({ createdAt: v })} />
      </FormControl>

      <FormControl>
        <FormControl.Label>作成者</FormControl.Label>
        <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
          <FormControl>
            <FormControl.Label>契約書・自社ひな形</FormControl.Label>
            <Select
              options={creatorContractOptions}
              value={value.createdByContract}
              onChange={(v) => update({ createdByContract: v })}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>LegalOnテンプレート</FormControl.Label>
            <Select
              options={creatorLegalonTemplateOptions}
              value={value.createdByLegalonTemplate}
              onChange={(v) => update({ createdByLegalonTemplate: v })}
            />
          </FormControl>
        </div>
      </FormControl>
    </SearchFilterPane>
  );
}
