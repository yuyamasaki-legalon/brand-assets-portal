import { useState, useRef } from 'react';
import { POPULAR_SEARCHES, FILTER_GROUPS } from '../data/constants';
import { getGroupColor } from '../utils/assets';
import type { FilterState } from '../data/types';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  sort: string;
  onSortChange: (s: string) => void;
  showDeprecated: boolean;
  onShowDeprecatedChange: (v: boolean) => void;
  showArchived: boolean;
  onShowArchivedChange: (v: boolean) => void;
  filters: FilterState;
  onToggleFilter: (group: keyof FilterState, value: string) => void;
  onReset: () => void;
}

const DEFAULT_PLACEHOLDER = "例：ロゴ / ガイドライン / ProfessionalAI / 3D";

export function SearchBar({
  query, onQueryChange, sort, onSortChange,
  showDeprecated, onShowDeprecatedChange,
  showArchived, onShowArchivedChange,
  filters, onToggleFilter, onReset,
}: SearchBarProps) {
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="border border-[var(--line)] rounded-2xl bg-white shadow-sm mb-3.5 p-5">
      <div className="space-y-4">
        {/* Search Input */}
        <div>
          <label className="block text-xs text-[var(--muted)] uppercase tracking-[0.1em] mb-1.5 font-medium">
            Search
          </label>
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder={placeholder}
            onChange={(e) => onQueryChange(e.target.value.trim())}
            onFocus={() => setPlaceholder("")}
            onBlur={() => { if (!query) setPlaceholder(DEFAULT_PLACEHOLDER); }}
            className="w-full px-4 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface-muted)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Popular Searches */}
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SEARCHES.map((keyword) => (
            <button
              key={keyword}
              type="button"
              onClick={() => {
                onQueryChange(keyword);
                inputRef.current?.focus();
              }}
              className="px-2.5 py-1 text-xs rounded-full border border-[var(--line)] bg-[var(--surface-muted)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] transition-colors cursor-pointer"
            >
              {keyword}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-[var(--muted)] uppercase tracking-[0.12em] text-[0.69rem] mb-1">Filters</p>
              <h2 className="text-[clamp(1.08rem,1.4vw,1.28rem)] leading-[1.2] m-0 font-semibold">用途に合わせて絞り込む</h2>
            </div>
            <div className="flex gap-4 items-center flex-shrink-0">
              <ToggleLabel
                label="Deprecatedを表示"
                checked={showDeprecated}
                onChange={onShowDeprecatedChange}
              />
              <ToggleLabel
                label="Archivedを表示"
                checked={showArchived}
                onChange={onShowArchivedChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FilterGroup
              title="プロダクト"
              groupName="product"
              values={FILTER_GROUPS.product}
              activeSet={filters.product}
              onToggle={onToggleFilter}
            />
            <FilterGroup
              title="ファイル形式"
              groupName="fileFormat"
              values={FILTER_GROUPS.fileFormat}
              activeSet={filters.fileFormat}
              onToggle={onToggleFilter}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-[var(--line)]">
        <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <span className="uppercase tracking-[0.1em]">Sort</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-[var(--line)] rounded-md px-2 py-1.5 text-sm bg-white cursor-pointer"
          >
            <option value="recommended">推奨優先</option>
            <option value="updatedDesc">更新日順</option>
            <option value="nameAsc">名前順</option>
          </select>
        </label>
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-1.5 text-sm border border-[var(--line)] rounded-lg bg-white hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
        >
          フィルタ解除
        </button>
      </div>
    </section>
  );
}

function ToggleLabel({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-[var(--muted)] cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[var(--accent)]"
      />
      <span>{label}</span>
    </label>
  );
}

function FilterGroup({
  title, groupName, values, activeSet, onToggle,
}: {
  title: string;
  groupName: keyof FilterState;
  values: string[];
  activeSet: Set<string>;
  onToggle: (group: keyof FilterState, value: string) => void;
}) {
  return (
    <div>
      <div className="text-xs font-medium text-[var(--muted)] mb-1.5">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((value) => {
          const isActive = activeSet.has(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(groupName, value)}
              aria-pressed={isActive}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer ${
                isActive
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "border-[var(--line)] bg-white hover:bg-[var(--surface-hover)]"
              }`}
              style={{ color: isActive ? undefined : getGroupColor(groupName, value) }}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
