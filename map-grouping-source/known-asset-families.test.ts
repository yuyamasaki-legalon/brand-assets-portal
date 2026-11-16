import { describe, expect, it } from "vitest";
import { getKnownAssetFamily } from "./known-asset-families";

describe("known asset families", () => {
  it("groups the verified WorldMap PNG and AI originals without changing either record", () => {
    const png = Object.freeze({
      id: "cms-map-png",
      title: "Global Map",
      driveId: "14XR2usJdmPEQUcNVySFyiP6FMeMWxwU8",
      fileFormat: "PNG",
    });
    const ai = Object.freeze({
      id: "cms-map-ai",
      title: "202610_WorldMap_ver1.1.ai",
      driveId: "1HqgEQBCfFBTjuBQvlb4PTV72y4uY119E",
      fileFormat: "AI",
    });
    expect(getKnownAssetFamily(png)).toEqual({ id: "global-map-202610-v1-1", title: "Global Map" });
    expect(getKnownAssetFamily(ai)).toEqual(getKnownAssetFamily(png));
    expect(ai.title).toBe("202610_WorldMap_ver1.1.ai");
    expect(png.id).toBe("cms-map-png");
  });

  it("does not group another map, a missing Drive ID, or an unexpected format", () => {
    expect(getKnownAssetFamily({ driveId: "another-map-version", fileFormat: "PNG" })).toBeNull();
    expect(getKnownAssetFamily({ fileFormat: "AI" })).toBeNull();
    expect(getKnownAssetFamily({ driveId: "14XR2usJdmPEQUcNVySFyiP6FMeMWxwU8", fileFormat: "AI" })).toBeNull();
  });
});
