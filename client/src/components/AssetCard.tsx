import { BRAND_META, STATUS_META } from '../data/constants';
import { getFormatColor, getThumbnailKindLabel, formatDate } from '../utils/assets';
import type { DisplayGroup, Asset } from '../data/types';

interface AssetCardProps {
  group: DisplayGroup;
  compact?: boolean;
  onClick: () => void;
}

export function AssetCard({ group, compact, onClick }: AssetCardProps) {
  const asset = group.representative;
  const brandColor = BRAND_META[asset.brand]?.color ?? "#5d5d5d";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group text-left w-full rounded-xl border border-[var(--line)] bg-white overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
        compact ? "flex flex-col" : "flex flex-col"
      }`}
    >
      {/* Thumbnail Area */}
      <div
        className="relative p-3 min-h-[140px] flex flex-col justify-between"
        style={{ "--brand-color": brandColor, "--format-color": getFormatColor(asset.fileFormat) } as React.CSSProperties}
      >
        {/* Badges */}
        <div className="flex gap-1.5 flex-wrap">
          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${getStatusBadgeClass(asset.status, asset.recommended)}`}>
            {asset.recommended ? "Recommended" : STATUS_META[asset.status]?.label}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-600">
            {buildFormatBadgeLabel(group.fileFormats)}
          </span>
        </div>

        {/* Visual */}
        <div className="flex-1 flex items-center justify-center py-3">
          <CardVisual group={group} />
        </div>

        {/* Bottom info */}
        {group.variantCount > 1 ? (
          <div>
            <div className="flex gap-1 flex-wrap mb-1">
              {group.fileFormats.map((fmt) => (
                <span key={fmt} className="px-1.5 py-0.5 text-[10px] font-bold rounded text-white" style={{ background: getFormatColor(fmt) }}>
                  {fmt}
                </span>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-[var(--muted)]">
              <span>{group.colorLabels.join(" / ")}</span>
              <span>{group.variantCount} variants</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-between text-[10px] text-[var(--muted)]">
            <span>{asset.assetType}</span>
            <span>{asset.locale}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 pt-2 border-t border-[var(--line)] flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
              <span style={{ color: brandColor }}>{asset.brand}</span>
              <span>{asset.assetType}</span>
            </div>
            <div className="text-sm font-medium leading-tight mt-0.5 truncate">{group.title}</div>
          </div>
          <span className={`flex-shrink-0 px-1.5 py-0.5 text-[9px] rounded-full ${getStatusPillClass(asset.status)}`}>
            {STATUS_META[asset.status]?.label}
          </span>
        </div>

        <p className="text-[11px] text-[var(--muted)] leading-relaxed mt-1.5 line-clamp-2">
          {getCardSummary(group)}
        </p>

        <div className="mt-auto pt-2 grid grid-cols-3 gap-1 text-[10px]">
          <div>
            <span className="text-[var(--muted)] block">Formats</span>
            <strong>{group.fileFormats.join(" / ")}</strong>
          </div>
          <div>
            <span className="text-[var(--muted)] block">Colors</span>
            <strong>{group.colorLabels.join(" / ")}</strong>
          </div>
          <div>
            <span className="text-[var(--muted)] block">Updated</span>
            <strong>{formatDate(group.updatedAt)}</strong>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--line)]">
          <span className="text-[10px] text-[var(--muted)]">
            {group.localeLabel} · {group.variantCount} variants
          </span>
          <div className="flex gap-1 flex-wrap">
            {asset.usage.slice(0, 3).map((u) => (
              <span key={u} className="px-1.5 py-0.5 text-[9px] rounded-full bg-[var(--surface-muted)] text-[var(--muted)]">
                {u}
              </span>
            ))}
            {asset.usage.length > 3 && (
              <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-[var(--surface-muted)] text-[var(--muted)]">
                +{asset.usage.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function CardVisual({ group }: { group: DisplayGroup }) {
  const asset = group.representative;

  if (group.fileFormats.length <= 1) {
    return <SingleAssetVisual asset={asset} />;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {group.fileFormats.map((fmt) => (
          <span key={fmt} className="px-2 py-1 text-xs font-bold rounded text-white" style={{ background: getFormatColor(fmt) }}>
            {fmt}
          </span>
        ))}
      </div>
      <div className="text-2xl font-bold text-[var(--muted)] opacity-40">{getThumbnailKindLabel(asset.assetType)}</div>
      <div className="text-xs text-[var(--muted)]">{asset.brand}</div>
    </div>
  );
}

function SingleAssetVisual({ asset }: { asset: Asset }) {
  if (asset.thumbnailUrl) {
    return (
      <img
        src={asset.thumbnailUrl}
        alt={asset.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="max-h-[80px] max-w-full object-contain"
        onError={(e) => {
          const el = e.currentTarget;
          el.style.display = "none";
          const parent = el.parentElement;
          if (parent) {
            const fallback = document.createElement("div");
            fallback.className = "flex flex-col items-center gap-1";
            fallback.innerHTML = `
              <span class="px-2 py-1 text-xs font-bold rounded text-white" style="background:${getFormatColor(asset.fileFormat)}">${asset.fileFormat}</span>
              <span class="text-2xl font-bold text-gray-300">${getThumbnailKindLabel(asset.assetType)}</span>
              <span class="text-xs text-gray-400">${asset.brand}</span>
            `;
            parent.appendChild(fallback);
          }
        }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="px-2 py-1 text-xs font-bold rounded text-white" style={{ background: getFormatColor(asset.fileFormat) }}>
        {asset.fileFormat}
      </span>
      <span className="text-2xl font-bold text-gray-300">{getThumbnailKindLabel(asset.assetType)}</span>
      <span className="text-xs text-gray-400">{asset.brand}</span>
    </div>
  );
}

function getStatusBadgeClass(status: string, recommended: boolean): string {
  if (recommended) return "bg-blue-50 text-blue-700";
  switch (status) {
    case "current": return "bg-green-50 text-green-700";
    case "deprecated": return "bg-amber-50 text-amber-700";
    case "archived": return "bg-gray-100 text-gray-500";
    default: return "bg-gray-100 text-gray-600";
  }
}

function getStatusPillClass(status: string): string {
  switch (status) {
    case "current": return "bg-green-50 text-green-700";
    case "recommended": return "bg-blue-50 text-blue-700";
    case "deprecated": return "bg-amber-50 text-amber-700";
    case "archived": return "bg-gray-100 text-gray-500";
    default: return "bg-gray-100 text-gray-600";
  }
}

function buildFormatBadgeLabel(formats: string[]): string {
  if (formats.length <= 2) return formats.join(" / ");
  return `${formats.slice(0, 2).join(" / ")} +${formats.length - 2}`;
}

function getCardSummary(group: DisplayGroup): string {
  if (group.variantCount > 1) {
    return `${group.fileFormats.join(" / ")} · ${group.colorLabels.join(" / ")} · ${group.variantCount} variants`;
  }
  if (group.representative.description) {
    const desc = group.representative.description;
    return desc.length > 120 ? `${desc.slice(0, 119).trimEnd()}…` : desc;
  }
  if (group.representative.usage.length > 0) {
    return group.representative.usage.join(" / ");
  }
  return "詳細情報はモーダルで確認できます";
}
