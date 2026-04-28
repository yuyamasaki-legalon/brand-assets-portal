/**
 * LOC Sync Reference Screenshot Capture
 *
 * Captures reference screenshots (a11y snapshot + pixel) for all template pages
 * listed in .sync-manifest.json. Uses Playwright to navigate aegis-lab (localhost:5173)
 * and save screenshots to .reference-screenshots/.
 *
 * Prerequisites: `pnpm dev` must be running on localhost:5173.
 *
 * Usage:
 *   pnpm loc-sync:capture-refs                       # Capture all entries
 *   pnpm loc-sync:capture-refs -- --entry case/index.tsx  # Single entry
 *   pnpm loc-sync:capture-refs -- --service esign-f       # Filter by service
 *   pnpm loc-sync:capture-refs -- --update-manifest       # Also update manifest referenceScreenshot fields
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { chromium } from "@playwright/test";
import type { SyncManifest } from "../src/pages/template/loc/sync-manifest.types";
import { parseCliArgs } from "./utils/cli-args";

const ROOT = join(import.meta.dirname, "..");
const MANIFEST_PATH = join(ROOT, "src/pages/template/loc/.sync-manifest.json");
const REFERENCE_DIR = join(ROOT, "src/pages/template/loc/.reference-screenshots");
const CONFIG_PATH = join(ROOT, "skills/loc-sync/visual-compare-config.json");

const BASE_URL = "http://localhost:5173";

// ---- Config ----

interface VisualCompareConfig {
  globalHideSelectors: string[];
  skipEntries: string[];
  tolerances: { maxDiffPixelRatio: number; threshold: number };
  screenshot: {
    viewport: { width: number; height: number };
    waitForSelector: string;
    waitTimeout: number;
    networkIdleTimeout: number;
  };
}

function loadConfig(): VisualCompareConfig {
  return JSON.parse(readFileSync(CONFIG_PATH, "utf-8")) as VisualCompareConfig;
}

function shouldSkip(entryKey: string, skipPatterns: string[]): boolean {
  for (const pattern of skipPatterns) {
    if (pattern.endsWith("/*")) {
      const prefix = pattern.slice(0, -2);
      if (entryKey.startsWith(prefix)) return true;
    } else if (entryKey === pattern) {
      return true;
    }
  }
  return false;
}

// ---- Args ----

interface Args {
  entry?: string;
  service?: string;
  updateManifest: boolean;
}

function parseArgs(): Args {
  const raw = parseCliArgs();
  return {
    entry: typeof raw.entry === "string" ? raw.entry : undefined,
    service: typeof raw.service === "string" ? raw.service : undefined,
    updateManifest: raw["update-manifest"] === true,
  };
}

// ---- Main ----

async function main(): Promise<void> {
  const { entry: filterEntry, service: filterService, updateManifest } = parseArgs();
  const config = loadConfig();

  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")) as SyncManifest;

  // Collect entries to process
  const entries: Array<{ key: string; route: string }> = [];
  for (const [key, e] of Object.entries(manifest.entries)) {
    if (filterEntry && key !== filterEntry) continue;
    if (filterService && e.locService !== filterService) continue;
    if (shouldSkip(key, config.skipEntries)) {
      console.error(`[capture-refs] Skipping ${key} (in skipEntries)`);
      continue;
    }
    entries.push({ key, route: e.templateRoute });
  }

  if (entries.length === 0) {
    console.error("[capture-refs] No entries to capture.");
    process.exit(0);
  }

  console.error(`[capture-refs] Capturing ${entries.length} entries...`);

  // Ensure output directory exists
  mkdirSync(REFERENCE_DIR, { recursive: true });

  // Launch browser
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: config.screenshot.viewport,
  });
  const page = await context.newPage();

  const results: Array<{ key: string; status: "ok" | "error"; error?: string }> = [];

  // Derive the baseline basename for an entry. If the manifest already points
  // at a reference file, reuse THAT basename so `pnpm loc-sync:capture-refs`
  // refreshes the exact file the visual suite reads — even when the manifest
  // uses the legacy `.reference-screenshots/...a11y-snapshot.txt` shape or a
  // non-safeKey filename. Without this, a capture would write a new safeKey
  // file and silently leave the suite reading the old baseline until the user
  // additionally passes `--update-manifest`.
  const REF_DIR_PREFIX = ".reference-screenshots/";
  const basenameForEntry = (key: string): string => {
    const manifestValue = manifest.entries[key]?.referenceScreenshot;
    if (manifestValue) {
      const stripped = manifestValue.startsWith(REF_DIR_PREFIX)
        ? manifestValue.slice(REF_DIR_PREFIX.length)
        : manifestValue;
      // Strip either a11y-snapshot.txt or image extension to get the shared basename.
      return stripped.replace(/\.a11y-snapshot\.txt$/i, "").replace(/\.(png|jpe?g|webp)$/i, "");
    }
    return key.replace(/\//g, "-").replace(/\.tsx$/, "");
  };

  for (const { key, route } of entries) {
    const baseName = basenameForEntry(key);
    console.error(`[capture-refs] ${key} → ${route}`);

    try {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });

      // Hide noisy elements
      const hideCSS = config.globalHideSelectors.map((s) => `${s} { display: none !important; }`).join("\n");
      await page.addStyleTag({
        content: `${hideCSS}\n[class*="FloatingSourceCodeViewer"], [class*="floating-source-code"] { display: none !important; }`,
      });

      // Wait for content: require at least one selector to become visible.
      // Promise.any resolves on first success; throws AggregateError if ALL fail.
      // Do NOT race against setTimeout here — a timeout "resolving successfully"
      // would let us capture a loading skeleton / error page as a baseline and
      // poison every future comparison that uses this reference.
      const waitSelectors = config.screenshot.waitForSelector.split(",").map((s) => s.trim());
      let matchedSelector: string;
      try {
        matchedSelector = await Promise.any(
          waitSelectors.map(async (sel) => {
            await page.locator(sel).first().waitFor({ state: "visible", timeout: config.screenshot.waitTimeout });
            return sel;
          }),
        );
      } catch {
        throw new Error(
          `None of the wait selectors became visible within ${config.screenshot.waitTimeout}ms: ${waitSelectors.join(", ")}`,
        );
      }

      // Small delay for rendering
      await page.waitForTimeout(config.screenshot.networkIdleTimeout);

      // Sanity-check that the page actually has meaningful content. A visible
      // `.aegis-PageLayoutBody` alone is not enough — an empty route or error
      // shell could render that wrapper and still be effectively blank, and
      // saving that as a baseline would poison every future comparison.
      // Use the selector that actually matched — not always waitSelectors[0],
      // because a fallback selector may have been the one that became visible.
      const contentText = (
        await page
          .locator(matchedSelector)
          .first()
          .innerText({ timeout: 1000 })
          .catch(() => "")
      ).trim();
      if (contentText.length < 20) {
        throw new Error(
          `Page content looks empty (<20 chars of text inside ${matchedSelector}). Refusing to save as baseline.`,
        );
      }

      // Capture a11y snapshot (ARIA tree as text)
      const a11ySnapshot = await page.locator("body").ariaSnapshot();
      const a11yPath = join(REFERENCE_DIR, `${baseName}.a11y-snapshot.txt`);
      mkdirSync(dirname(a11yPath), { recursive: true });
      writeFileSync(a11yPath, a11ySnapshot);

      // Capture pixel screenshot
      const pngPath = join(REFERENCE_DIR, `${baseName}.png`);
      mkdirSync(dirname(pngPath), { recursive: true });
      await page.screenshot({ path: pngPath, fullPage: false });

      // Update manifest if requested. Prefer writing the current (non-legacy)
      // format — a plain REFERENCE_DIR-relative filename, no prefix.
      if (updateManifest) {
        manifest.entries[key].referenceScreenshot = `${baseName}.png`;
      }

      results.push({ key, status: "ok" });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[capture-refs] Error capturing ${key}: ${msg}`);
      results.push({ key, status: "error", error: msg });
    }
  }

  await browser.close();

  // Write updated manifest
  if (updateManifest) {
    writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
    console.error("[capture-refs] Updated .sync-manifest.json referenceScreenshot fields.");
  }

  // Report
  const ok = results.filter((r) => r.status === "ok").length;
  const errors = results.filter((r) => r.status === "error").length;
  console.error(`\n[capture-refs] Done: ${ok} captured, ${errors} errors.`);

  if (errors > 0) {
    for (const r of results.filter((r) => r.status === "error")) {
      console.error(`  Error: ${r.key} — ${r.error}`);
    }
    process.exit(1);
  }
}

main();
