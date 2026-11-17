import { type Catalog, type CatalogAsset, isPublished } from "../src/pages/sandbox/brand-asset-portal/catalog-types";
import { enrichSearchAsset } from "./brand-asset-display-metadata";

// An explicit search projection: never expose drafts, audit actors, import
// markers, private owner fields or future management-only fields to readers.
export function publishedCatalog(catalog: Catalog): Catalog {
  const keys = [
    "id",
    "title",
    "brand",
    "fileFormat",
    "status",
    "assetType",
    "updatedAt",
    "assetDomain",
    "publication",
    "description",
    "usage",
    "tags",
    "driveUrl",
    "driveId",
    "downloadUrl",
    "thumbnailUrl",
    "usageRights",
    "expiresAt",
    "assetGroupId",
    "color",
    "colorVariant",
    "locale",
    "variantLabel",
    "recommended",
    "thumbnailColor",
    "allowBrowseOnly",
  ];
  const products = catalog.products
    .filter((product) => product.state === "active")
    .map(({ id, label, state, order }) => ({ id, label, state, order }));
  const assets = catalog.assets
    .filter((asset) => isPublished(asset, products))
    .map(
      (asset) =>
        Object.fromEntries(
          keys
            .filter((key) => Object.hasOwn(asset, key))
            .map((key) => [key, (asset as unknown as Record<string, unknown>)[key]]),
        ) as CatalogAsset,
    );
  // Version links may only refer to assets visible in this projection.
  const visible = new Set(assets.map((asset) => asset.id));
  const originals = new Map(catalog.assets.map((asset) => [asset.id, asset]));
  for (let i = 0; i < assets.length; i++) {
    for (const key of ["replacedBy", "previousVersionId"] as const) {
      const value = (originals.get(assets[i].id) as unknown as Record<string, unknown>)[key];
      if (typeof value === "string" && visible.has(value)) Object.assign(assets[i], { [key]: value });
    }
  }
  return { revision: catalog.revision, products, assets: assets.map(enrichSearchAsset) };
}
