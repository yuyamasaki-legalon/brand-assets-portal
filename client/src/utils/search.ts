import { SEARCH_ALIASES, ILLUSTRATION_CATEGORY_META } from '../data/constants';
import type { Asset } from '../data/types';

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function normalizeSearchText(text: string): string {
  return normalize(text);
}

function expandSearchToken(token: string): string[] {
  const key = normalize(token);
  const aliases = SEARCH_ALIASES[key] || SEARCH_ALIASES[token];
  if (aliases) return aliases.map(normalize);
  return [key];
}

export function matchesQuery(asset: Asset, query: string): boolean {
  const normalized = normalize(query);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const haystack = normalizeSearchText(
    [
      asset.title, asset.brand, asset.fileFormat, asset.assetType,
      asset.locale, asset.status, asset.description,
      asset.recommended ? "recommended" : "",
      asset.usage.join(" "),
      (asset.tags || []).join(" "),
    ].join(" ")
  );

  return tokens.every((token) => {
    const variants = expandSearchToken(token);
    return variants.some((variant) => haystack.includes(variant));
  });
}

export function getIllustrationCategoryInfo(assetType: string) {
  const normalizedType = normalize(String(assetType || ""));
  if (!normalizedType) return null;
  return Object.values(ILLUSTRATION_CATEGORY_META).find((category) =>
    category.matchers.some((matcher) => normalizedType.includes(normalize(matcher)))
  ) ?? null;
}
