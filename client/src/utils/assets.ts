import {
  BRAND_META, BRAND_DRIVE_ROOTS, BRAND_BROWSE_FOLDERS,
  FORMAT_COLORS, API_THUMBNAIL_ENDPOINT, API_DOWNLOAD_ENDPOINT,
} from '../data/constants';
import type { Asset, DisplayGroup } from '../data/types';
import { getIllustrationCategoryInfo } from './search';

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function uniqueValues(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function dateValue(d: string): number {
  return new Date(d).getTime() || 0;
}

function extractDriveIdFromUrl(url: string): string {
  if (!url) return "";
  const fileMatch = url.match(/\/file\/d\/([^/]+)\//);
  if (fileMatch) return fileMatch[1];
  const queryMatch = url.match(/[?&]id=([^&]+)/);
  if (queryMatch) return decodeURIComponent(queryMatch[1]);
  return "";
}

function isDriveSearchUrl(url: string): boolean {
  return typeof url === "string" && url.includes("drive.google.com/drive/search");
}

function getBrandDriveUrl(brand: string, locale: string): string {
  const roots = BRAND_DRIVE_ROOTS[brand] ?? {};
  if (locale === "JP" && roots.jp) return roots.jp;
  if ((locale === "US" || locale === "EU") && roots.us) return roots.us;
  return roots.global ?? "";
}

function getBrandBrowseUrl(brand: string, assetType: string, locale: string): string {
  const routes = BRAND_BROWSE_FOLDERS[brand] ?? {};
  if (assetType === "ロゴ" && routes.logo) return routes.logo;
  if (locale === "JP" && routes.jp) return routes.jp;
  if ((locale === "US" || locale === "EU") && routes.us) return routes.us;
  return routes.default ?? getBrandDriveUrl(brand, locale);
}

function inferColorVariant(title: string): string {
  const normalized = normalize(String(title || ""));
  if (/(^| )(white|wh)( |$)/.test(normalized)) return "white";
  if (/(^| )(black|bk|bgink)( |$)/.test(normalized)) return "black";
  return "color";
}

export function getAssetDriveId(asset: Asset): string {
  return asset.driveId || extractDriveIdFromUrl(asset.driveUrl);
}

export function isDisplayableAsset(asset: Asset): boolean {
  return Boolean(
    getAssetDriveId(asset) ||
    (asset.allowBrowseOnly && asset.driveUrl && !isDriveSearchUrl(asset.driveUrl))
  );
}

export function makeAsset(data: Record<string, unknown>): Asset {
  const driveId = (data.driveId as string) || extractDriveIdFromUrl(data.driveUrl as string || "") || "";
  const illustrationCategory = getIllustrationCategoryInfo(data.assetType as string || "");
  const normalizedAssetType = illustrationCategory?.display || (data.assetType as string);
  const browseUrl = getBrandBrowseUrl(data.brand as string, normalizedAssetType, data.locale as string);
  const driveUrl = (data.driveUrl as string) && !isDriveSearchUrl(data.driveUrl as string) ? (data.driveUrl as string) : browseUrl;
  const colorVariant = (data.colorVariant as string) || inferColorVariant(data.title as string);
  const rawTags = Array.isArray(data.tags) ? data.tags as string[] : [];
  const tags = uniqueValues([...rawTags, ...(illustrationCategory?.tags || [])]);

  return {
    id: data.id as string,
    assetGroupId: data.assetGroupId as string,
    title: data.title as string,
    brand: data.brand as string,
    fileFormat: data.fileFormat as string,
    status: data.status as string,
    recommended: Boolean(data.recommended),
    locale: data.locale as string,
    assetType: normalizedAssetType,
    usage: Array.isArray(data.usage) ? data.usage as string[] : [],
    updatedAt: data.updatedAt as string || "",
    previousVersionId: data.previousVersionId as string | null ?? null,
    replacedBy: data.replacedBy as string | null ?? null,
    thumbnailColor: data.thumbnailColor as string,
    description: data.description as string || "",
    driveId,
    driveUrl: driveId ? `https://drive.google.com/file/d/${driveId}/view?usp=drivesdk` : driveUrl,
    thumbnailUrl: (data.thumbnailUrl as string) || (driveId ? `${API_THUMBNAIL_ENDPOINT}/${encodeURIComponent(driveId)}` : ""),
    downloadUrl: (data.downloadUrl as string) || (driveId ? `${API_DOWNLOAD_ENDPOINT}/${encodeURIComponent(driveId)}` : ""),
    colorVariant,
    variantLabel: data.variantLabel as string,
    tags,
    allowBrowseOnly: Boolean(data.allowBrowseOnly),
  };
}

function normalizeLogoFamily(title: string, brand: string): string {
  return normalize(String(title || ""))
    .replace(new RegExp(normalize(brand), "g"), " ")
    .replace(/\(v[0-9]+\)/g, " ")
    .replace(/\b(color|black|white|bk|bgink|rgb|green|main|bgblack|bgcolor|background|light|dark)\b/g, " ")
    .replace(/\b(png|jpg|jpeg|svg|ai|pdf)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getAssetFamilyKey(asset: Asset): string {
  if (asset.assetType === "ロゴ") {
    return [asset.brand, asset.assetType, normalizeLogoFamily(asset.title, asset.brand)].join("::");
  }
  return asset.assetGroupId;
}

export function getVariantLabel(asset: Asset): string {
  if (asset.variantLabel) return asset.variantLabel;
  const cv = String(asset.colorVariant || inferColorVariant(asset.title)).toLowerCase();
  return { color: "Color", black: "Black", white: "White" }[cv] ?? "Color";
}

export function getFormatColor(fileFormat: string): string {
  return FORMAT_COLORS[fileFormat] ?? "#3f7ecf";
}

export function getGroupColor(groupName: string, value: string): string {
  if (groupName === "product") return BRAND_META[value]?.color ?? "#5d5d5d";
  const palette: Record<string, string> = {
    PNG: "#3f7ecf", SVG: "#039373", PDF: "#d34638", AI: "#9a5fc0",
    PSD: "#c44d7b", PPT: "#8f6329", MP4: "#c15d1e", JPG: "#7b6bd0",
  };
  return palette[value] ?? "#5d5d5d";
}

export function getDriveOpenUrl(asset: Asset): string {
  if (asset.driveId) {
    return `https://drive.google.com/file/d/${encodeURIComponent(asset.driveId)}/view?usp=drivesdk`;
  }
  if (asset.driveUrl && !isDriveSearchUrl(asset.driveUrl)) {
    return asset.driveUrl;
  }
  return getBrandBrowseUrl(asset.brand, asset.assetType, asset.locale);
}

export function getDownloadUrl(asset: Asset): string {
  const driveId = getAssetDriveId(asset);
  if (driveId) {
    return `https://drive.usercontent.google.com/u/0/uc?id=${encodeURIComponent(driveId)}&export=download`;
  }
  return "#";
}

export function getThumbnailKindLabel(assetType: string): string {
  const illustrationCategory = getIllustrationCategoryInfo(assetType);
  if (illustrationCategory) return illustrationCategory.thumbnail;
  const labels: Record<string, string> = {
    "ロゴ": "LOGO", "ガイドライン": "GUIDE", "営業資料素材": "MATERIAL",
    "モーション": "MOTION", "テンプレート": "TEMPLATE", "3D Visual": "3D VISUAL",
  };
  return labels[assetType] ?? "ASSET";
}

function colorVariantRank(colorVariant: string): number {
  return { color: 0, black: 1, white: 2 }[String(colorVariant || "").toLowerCase()] ?? 3;
}

function statusRank(status: string): number {
  return { current: 0, recommended: 0, deprecated: 1, archived: 2 }[status] ?? 3;
}

export function getGroupAssets(asset: Asset, allAssets: Asset[]): Asset[] {
  const familyKey = getAssetFamilyKey(asset);
  return allAssets
    .filter((item) => getAssetFamilyKey(item) === familyKey)
    .sort((a, b) => {
      const aRank = statusRank(a.status);
      const bRank = statusRank(b.status);
      if (aRank !== bRank) return aRank - bRank;
      if (a.fileFormat !== b.fileFormat) return a.fileFormat.localeCompare(b.fileFormat);
      const aColorRank = colorVariantRank(a.colorVariant);
      const bColorRank = colorVariantRank(b.colorVariant);
      if (aColorRank !== bColorRank) return aColorRank - bColorRank;
      return dateValue(b.updatedAt) - dateValue(a.updatedAt);
    });
}

export function getVersionChain(asset: Asset, allAssets: Asset[]): Asset[] {
  const chain = [asset];
  const seen = new Set([asset.id]);
  let cursorId = asset.previousVersionId;
  while (cursorId) {
    const cursor = allAssets.find((a) => a.id === cursorId);
    if (!cursor || seen.has(cursor.id)) break;
    chain.push(cursor);
    seen.add(cursor.id);
    cursorId = cursor.previousVersionId;
  }
  return chain;
}

export function buildDisplayGroups(list: Asset[]): DisplayGroup[] {
  const grouped = new Map<string, Asset[]>();
  list.forEach((asset) => {
    const key = getAssetFamilyKey(asset) || asset.id;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(asset);
  });

  return [...grouped.values()].map((variants) => {
    const representative = variants[0];
    const fileFormats = uniqueValues(variants.map((a) => a.fileFormat));
    const colorLabels = uniqueValues(variants.map((a) => getVariantLabel(a)));
    const locales = uniqueValues(variants.map((a) => a.locale));
    const updatedAt = variants.reduce((latest, a) =>
      dateValue(a.updatedAt) > dateValue(latest) ? a.updatedAt : latest
    , representative.updatedAt);

    return {
      id: getAssetFamilyKey(representative) || representative.id,
      representative,
      variants,
      title: representative.title,
      fileFormats,
      colorLabels,
      variantCount: variants.length,
      localeLabel: locales.join(" / "),
      updatedAt,
    };
  });
}

export function getPreferredModalAsset(group: DisplayGroup): Asset {
  return group.variants.find((a) => a.fileFormat === "PNG") ?? group.representative;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function sanitizeFilename(title: string, format: string): string {
  const safe = title.replace(/[/\\:*?"<>|]/g, "_").trim();
  const ext = format.toLowerCase();
  return safe.endsWith(`.${ext}`) ? safe : `${safe}.${ext}`;
}
