import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Asset, FilterState } from '../data/types';
import { API_ASSETS_ENDPOINT } from '../data/constants';
import { makeAsset, isDisplayableAsset, buildDisplayGroups } from '../utils/assets';
import { matchesQuery } from '../utils/search';

const CLICK_STORAGE_KEY = "brand-asset-portal.click-counts.v1";

function loadClickCounts(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(CLICK_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveClickCounts(counts: Record<string, number>) {
  try {
    window.localStorage.setItem(CLICK_STORAGE_KEY, JSON.stringify(counts));
  } catch { /* ignore */ }
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [clickCounts, setClickCounts] = useState<Record<string, number>>(loadClickCounts);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    product: new Set(),
    fileFormat: new Set(),
  });
  const [modalAssetId, setModalAssetId] = useState<string | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    try {
      const response = await fetch(API_ASSETS_ENDPOINT, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid data");
      const processed = data.map((d: Record<string, unknown>) => makeAsset(d)).filter(isDisplayableAsset);
      setAssets(processed);
    } catch {
      console.warn("API unavailable, falling back to assets-index.json");
      try {
        const fallbackResponse = await fetch(`${import.meta.env.BASE_URL}assets-index.json`, { cache: "no-store" });
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (Array.isArray(fallbackData)) {
            const processed = fallbackData.map((d: Record<string, unknown>) => makeAsset(d)).filter(isDisplayableAsset);
            setAssets(processed);
          }
        }
      } catch {
        setAssets([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const recordClick = useCallback((assetId: string) => {
    setClickCounts((prev) => {
      const next = { ...prev, [assetId]: (prev[assetId] ?? 0) + 1 };
      saveClickCounts(next);
      return next;
    });
  }, []);

  const toggleFilter = useCallback((groupName: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      const bucket = new Set(prev[groupName]);
      if (bucket.has(value)) bucket.delete(value);
      else bucket.add(value);
      next[groupName] = bucket;
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setQuery("");
    setSort("recommended");
    setShowDeprecated(false);
    setShowArchived(false);
    setFilters({ product: new Set(), fileFormat: new Set() });
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (!showArchived && asset.status === "archived") return false;
      if (!showDeprecated && asset.status === "deprecated") return false;
      for (const [groupName, bucket] of Object.entries(filters)) {
        if (bucket.size === 0) continue;
        if (groupName === "product" && !bucket.has(asset.brand)) return false;
        if (groupName === "fileFormat" && !bucket.has(asset.fileFormat)) return false;
      }
      if (!query) return true;
      return matchesQuery(asset, query);
    });
  }, [assets, query, showDeprecated, showArchived, filters]);

  const sortedAssets = useMemo(() => {
    const sorted = [...filteredAssets];
    const dateVal = (d: string) => new Date(d).getTime() || 0;

    const comparators: Record<string, (a: Asset, b: Asset) => number> = {
      recommended: (a, b) => {
        const aScore = Number(a.recommended && a.status === "current");
        const bScore = Number(b.recommended && b.status === "current");
        if (aScore !== bScore) return bScore - aScore;
        return dateVal(b.updatedAt) - dateVal(a.updatedAt);
      },
      updatedDesc: (a, b) => dateVal(b.updatedAt) - dateVal(a.updatedAt),
      nameAsc: (a, b) => a.title.localeCompare(b.title, "ja"),
    };

    const comparator = comparators[sort] ?? comparators.recommended;
    sorted.sort((a, b) => {
      const result = comparator(a, b);
      if (result !== 0) return result;
      return a.title.localeCompare(b.title, "ja");
    });

    return sorted;
  }, [filteredAssets, sort]);

  const displayGroups = useMemo(() => buildDisplayGroups(sortedAssets), [sortedAssets]);

  const recommendations = useMemo(() => {
    const rec = [...filteredAssets]
      .filter((a) => a.recommended && a.status === "current")
      .sort((a, b) => {
        const clickDiff = (clickCounts[b.id] ?? 0) - (clickCounts[a.id] ?? 0);
        if (clickDiff !== 0) return clickDiff;
        const dateVal = (d: string) => new Date(d).getTime() || 0;
        const updatedDiff = dateVal(b.updatedAt) - dateVal(a.updatedAt);
        if (updatedDiff !== 0) return updatedDiff;
        return a.title.localeCompare(b.title, "ja");
      });
    return buildDisplayGroups(rec).slice(0, 8);
  }, [filteredAssets, clickCounts]);

  const hasActiveFilters = filters.product.size > 0 || filters.fileFormat.size > 0;
  const isSearching = Boolean(query || hasActiveFilters);

  return {
    assets,
    loading,
    query, setQuery,
    sort, setSort,
    showDeprecated, setShowDeprecated,
    showArchived, setShowArchived,
    filters, toggleFilter,
    modalAssetId, setModalAssetId,
    resetAll,
    recordClick,
    filteredAssets,
    displayGroups,
    recommendations,
    isSearching,
  };
}
