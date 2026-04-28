import { useEffect, useMemo, useState, useCallback } from 'react';
import { BRAND_META, STATUS_META } from '../data/constants';
import {
  getAssetDriveId, getVariantLabel, getFormatColor, getDriveOpenUrl,
  getDownloadUrl, getGroupAssets, getVersionChain, getThumbnailKindLabel,
  formatDate, sanitizeFilename,
} from '../utils/assets';
import type { Asset } from '../data/types';

interface AssetModalProps {
  assetId: string | null;
  assets: Asset[];
  onClose: () => void;
  onRecordClick: (id: string) => void;
}

export function AssetModal({ assetId, assets, onClose, onRecordClick }: AssetModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(assetId);

  useEffect(() => {
    setSelectedId(assetId);
  }, [assetId]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (assetId) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [assetId, onClose]);

  const asset = useMemo(
    () => assets.find((a) => a.id === selectedId) ?? null,
    [assets, selectedId]
  );

  const groupAssets = useMemo(
    () => (asset ? getGroupAssets(asset, assets) : []),
    [asset, assets]
  );

  const versionChain = useMemo(
    () => (asset ? getVersionChain(asset, assets) : []),
    [asset, assets]
  );

  const handleSelectVariant = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleDownload = useCallback((a: Asset) => {
    const driveId = getAssetDriveId(a);
    if (!driveId) return;
    onRecordClick(a.id);
    const url = getDownloadUrl(a);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = sanitizeFilename(a.title, a.fileFormat);
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }, [onRecordClick]);

  if (!assetId || !asset) return null;

  const driveId = getAssetDriveId(asset);
  const brandColor = BRAND_META[asset.brand]?.color ?? "#5d5d5d";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <article className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-[calc(100vw-40px)] max-h-[calc(100vh-40px)] overflow-y-auto z-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-lg cursor-pointer z-10"
          aria-label="閉じる"
        >
          ×
        </button>

        {/* Preview */}
        <div
          className="p-6 bg-gradient-to-b from-gray-50 to-white border-b border-[var(--line)]"
          style={{ "--brand-color": brandColor } as React.CSSProperties}
        >
          <ModalPreview asset={asset} />
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Path */}
          <div className="text-xs text-[var(--muted)]">
            {asset.brand} / {asset.assetType} / {asset.locale}
          </div>

          {/* Title & Status */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-semibold leading-tight m-0">{asset.title}</h2>
            <span className={`flex-shrink-0 px-2.5 py-1 text-xs rounded-full font-medium ${getStatusPillClass(asset.status)}`}>
              {STATUS_META[asset.status]?.label}
            </span>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Brand", asset.brand],
              ["Format", asset.fileFormat],
              ["Variant", getVariantLabel(asset)],
              ["Asset type", asset.assetType],
              ["Usage", asset.usage.join(" / ")],
              ["Tags", (asset.tags || []).join(" / ") || "—"],
              ["Locale", asset.locale],
              ["Updated", formatDate(asset.updatedAt)],
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-2.5">
                <span className="block text-[10px] text-[var(--muted)] uppercase tracking-[0.08em]">{label}</span>
                <strong className="block text-sm mt-0.5 break-words">{value}</strong>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">{asset.description}</p>

          {/* Download Section */}
          <div className="border border-[var(--line)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold m-0">Download</h3>
                <span className="text-xs text-[var(--muted)]">形式を選んで取得</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span>File</span>
                <select
                  value={selectedId ?? ""}
                  onChange={(e) => handleSelectVariant(e.target.value)}
                  className="border border-[var(--line)] rounded-md px-2 py-1.5 text-sm bg-white min-w-[200px]"
                >
                  {groupAssets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.fileFormat} · {getVariantLabel(a)}{a.status === "deprecated" ? " (deprecated)" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                disabled={!driveId}
                onClick={() => handleDownload(asset)}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors cursor-pointer ${
                  driveId
                    ? "bg-[var(--accent)] text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                ダウンロード
              </button>
              <a
                href={getDriveOpenUrl(asset)}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-sm rounded-lg border border-[var(--line)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                Google Driveで確認する
              </a>
            </div>
          </div>

          {/* Deprecation Warning */}
          {asset.status === "deprecated" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <strong className="text-amber-800">Deprecated / 使用非推奨</strong>
              <p className="text-sm text-amber-700 mt-1">
                このアセットは現在の利用を推奨していません。
                {asset.replacedBy
                  ? `代わりに ${assets.find((a) => a.id === asset.replacedBy)?.title ?? "推奨アセット"} を使用してください。`
                  : "誤使用を避けるため、代替アセットを選んでください。"}
              </p>
            </div>
          )}

          {/* Variants */}
          <div className="border border-[var(--line)] rounded-xl p-4">
            <div className="mb-3">
              <h3 className="text-sm font-semibold m-0">Variants</h3>
              <span className="text-xs text-[var(--muted)]">同一アセットグループ内のバリエーション</span>
            </div>
            <div className="grid gap-2">
              {groupAssets.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleSelectVariant(a.id)}
                  className={`text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                    a.id === selectedId
                      ? "border-[var(--accent)] bg-gray-50"
                      : "border-[var(--line)] hover:bg-gray-50"
                  }`}
                >
                  <strong className="text-sm">{a.fileFormat} · {getVariantLabel(a)}</strong>
                  <span className="block text-xs text-[var(--muted)] mt-0.5">{a.title}</span>
                  <em className="block text-[10px] text-[var(--muted)] mt-0.5 not-italic">
                    {STATUS_META[a.status]?.label} / {a.locale}
                  </em>
                </button>
              ))}
            </div>
          </div>

          {/* Version History */}
          <div className="border border-[var(--line)] rounded-xl p-4">
            <div className="mb-3">
              <h3 className="text-sm font-semibold m-0">Version history</h3>
              <span className="text-xs text-[var(--muted)]">最新が上</span>
            </div>
            {versionChain.length === 0 ? (
              <p className="text-xs text-[var(--muted)]">このアセットにはバージョン履歴がありません。</p>
            ) : (
              <div className="grid gap-2">
                {versionChain.map((a, index) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleSelectVariant(a.id)}
                    className="text-left p-3 rounded-lg border border-[var(--line)] hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 items-start"
                  >
                    <span className="text-xs font-bold text-[var(--muted)] bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                      #{versionChain.length - index}
                    </span>
                    <div>
                      <strong className="text-sm">{a.title}</strong>
                      <p className="text-xs text-[var(--muted)] mt-0.5 m-0">
                        {a.fileFormat} · {STATUS_META[a.status]?.label} · {formatDate(a.updatedAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

function ModalPreview({ asset }: { asset: Asset }) {
  const thumbnailUrl = asset.thumbnailUrl;
  const brandColor = BRAND_META[asset.brand]?.color ?? "#5d5d5d";

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1 flex items-center justify-center min-h-[160px]">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={asset.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="max-h-[200px] max-w-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-white px-2 py-1 rounded" style={{ background: brandColor }}>
              {asset.brand}
            </span>
            <span className="px-3 py-1 text-sm font-bold rounded text-white" style={{ background: getFormatColor(asset.fileFormat) }}>
              {asset.fileFormat}
            </span>
            <span className="text-3xl font-bold text-gray-300">{getThumbnailKindLabel(asset.assetType)}</span>
          </div>
        )}
      </div>
      <div className="text-center md:text-left">
        <div className="flex gap-1.5 flex-wrap justify-center md:justify-start mb-2">
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-gray-100" style={{ color: brandColor }}>{asset.brand}</span>
          <span className="px-2 py-0.5 text-[10px] rounded-full text-white" style={{ background: getFormatColor(asset.fileFormat) }}>{asset.fileFormat}</span>
          <span className={`px-2 py-0.5 text-[10px] rounded-full ${getStatusPillClass(asset.status)}`}>
            {STATUS_META[asset.status]?.label}
          </span>
        </div>
        <div className="text-xs text-[var(--muted)] mb-1">{asset.assetType} · {asset.locale}</div>
        <div className="text-sm font-medium">{asset.title}</div>
        <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{asset.description}</p>
        <div className="flex gap-3 text-[10px] text-[var(--muted)] mt-2 justify-center md:justify-start">
          <span>Variant: {getVariantLabel(asset)}</span>
          <span>{formatDate(asset.updatedAt)}更新</span>
        </div>
      </div>
    </div>
  );
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
