const globalMapFamily = {
  id: "global-map-202610-v1-1",
  title: "Global Map",
} as const;

// Verified PNG/AI originals in the WorldMap folder. Never group by title alone:
// similarly named maps and other versions must remain separate assets.
const globalMapFiles: Readonly<Record<string, string>> = {
  "14XR2usJdmPEQUcNVySFyiP6FMeMWxwU8": "PNG",
  "1HqgEQBCfFBTjuBQvlb4PTV72y4uY119E": "AI",
};

export function getKnownAssetFamily(asset: { driveId?: string; fileFormat: string }) {
  return asset.driveId && globalMapFiles[asset.driveId] === asset.fileFormat ? globalMapFamily : null;
}
