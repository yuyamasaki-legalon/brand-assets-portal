import type { FilterState } from '../data/types';

interface ActiveChipsProps {
  query: string;
  filters: FilterState;
  showDeprecated: boolean;
  showArchived: boolean;
  onClearQuery: () => void;
  onToggleFilter: (group: keyof FilterState, value: string) => void;
  onSetShowDeprecated: (v: boolean) => void;
  onSetShowArchived: (v: boolean) => void;
}

interface ActiveChip {
  label: string;
  onClear: () => void;
}

const GROUP_LABELS: Record<string, string> = {
  product: "プロダクト",
  fileFormat: "ファイル形式",
};

export function ActiveChips({
  query, filters, showDeprecated, showArchived,
  onClearQuery, onToggleFilter, onSetShowDeprecated, onSetShowArchived,
}: ActiveChipsProps) {
  const chips: ActiveChip[] = [];

  for (const [groupName, bucket] of Object.entries(filters)) {
    for (const value of bucket) {
      chips.push({
        label: `${GROUP_LABELS[groupName] ?? groupName}: ${value}`,
        onClear: () => onToggleFilter(groupName as keyof FilterState, value),
      });
    }
  }

  if (query) {
    chips.push({ label: `検索: ${query}`, onClear: onClearQuery });
  }

  if (showDeprecated) {
    chips.push({ label: "Deprecated表示", onClear: () => onSetShowDeprecated(false) });
  }

  if (showArchived) {
    chips.push({ label: "Archived表示", onClear: () => onSetShowArchived(false) });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip, i) => (
        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-[var(--accent-soft)] text-[var(--text)]">
          {chip.label}
          <button
            type="button"
            onClick={chip.onClear}
            className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-300 text-[10px] cursor-pointer"
            aria-label={`${chip.label} を解除`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
