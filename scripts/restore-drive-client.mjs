// Repackage the current production bundle with ONE public configuration change.
// Preserve all CMS permission code and every other byte of the baseline bundle.
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";

const baselinePath = "public/assets/index-BETZBgJ6.js";
const clientId = "525055087660-6f75p8dvjiktdhn3j8j6b395srlr88e9.apps.googleusercontent.com";
const missing = "aN=(void 0)?.trim()??``";
const restored = `aN=${JSON.stringify(clientId)}`;
const baseline = await fs.readFile(baselinePath, "utf8");
if (baseline.split(missing).length !== 2) throw new Error("Unexpected baseline; refusing to alter bundle");
const updated = baseline.replace(missing, restored);
if (updated.replace(restored, missing) !== baseline) throw new Error("Non-configuration bytes changed");
const hash = createHash("sha256").update(updated).digest("hex").slice(0, 12);
const filename = `index-drive-${hash}.js`;
await fs.writeFile(`public/assets/${filename}`, updated);
const htmlPath = "public/brand-asset-portal/index.html";
const html = await fs.readFile(htmlPath, "utf8");
const oldReference = "../assets/index-BETZBgJ6.js";
const newReference = `../assets/${filename}`;
if (html.includes(oldReference)) {
  await fs.writeFile(htmlPath, html.replace(oldReference, newReference));
} else if (!html.includes(newReference)) {
  const reference = html.match(/src="\.\.\/assets\/(index-[\w-]+\.js)"/)?.[1];
  if (!reference) throw new Error("Unexpected HTML entrypoint");
  const current = await fs.readFile(`public/assets/${reference}`, "utf8");
  if (!current.includes(clientId) || !current.includes("https://www.googleapis.com/auth/drive.readonly") || !current.includes("Driveプレビューを表示"))
    throw new Error("Unrecognized release; refusing to change the entrypoint");
  console.log("Thumbnail release already has the Drive client; preserving its entrypoint.");
}
console.log(`Built ${filename}; only the public Drive client ID changed.`);
