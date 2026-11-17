import { describe, expect, it } from "vitest";
import type { Catalog, CatalogAsset } from "../src/pages/sandbox/brand-asset-portal/catalog-types";
import mirrors from "../src/pages/sandbox/brand-asset-portal/local-mirror-manifest.json";
import { publishedCatalog } from "./brand-asset-catalog-view";

const asset = (id: string, extra: Partial<CatalogAsset> = {}): CatalogAsset => ({
  id,
  title: "Test asset",
  brand: "LegalOn",
  fileFormat: "PNG",
  status: "current",
  publication: "published",
  assetType: "ロゴ",
  updatedAt: "2026-11-17",
  ...extra,
});
const catalog = (assets: CatalogAsset[]): Catalog => ({
  revision: 1,
  products: [{ id: "LegalOn", label: "LegalOn", state: "active", order: 0 }],
  assets,
});

describe("published search metadata", () => {
  it("enriches visible records only and never creates records from the mirror inventory", () => {
    const found = Object.entries(mirrors).find(([, mirror]) => mirror.mirrored && mirror.thumbnailPath);
    if (!found) throw new Error("Missing mirrored fixture");
    const [id, mirror] = found;
    const hidden = asset(id, { publication: "draft", driveId: mirror.sourceDriveId });
    expect(publishedCatalog(catalog([hidden])).assets).toEqual([]);
    const visible = publishedCatalog(catalog([{ ...hidden, publication: "published", owner: "private" }])).assets[0];
    expect(visible?.thumbnailUrl).toBe(`/${mirror.thumbnailPath}`);
    expect(visible).not.toHaveProperty("owner");
    const changed = publishedCatalog(catalog([asset(id, { driveId: "replacement-drive-file" })])).assets[0];
    expect(changed?.thumbnailUrl).toBeUndefined();
    expect(publishedCatalog(catalog([])).assets).toEqual([]);
  });
});
