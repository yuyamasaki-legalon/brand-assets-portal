import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { expect, test } from "@playwright/test";
import type { SyncManifest } from "../src/pages/template/loc/sync-manifest.types";

/**
 * LOC Sync Visual Comparison (Advisory)
 *
 * Compares current template pages against reference screenshots from loc-app.
 * This test is advisory only — failures indicate visual drift but do not block CI.
 *
 * Two comparison layers:
 * 1. Pixel comparison — toHaveScreenshot() against stored PNG baselines
 * 2. Structural comparison — a11y snapshot diff against stored JSON baselines
 *
 * Routes, reference screenshot filenames, and skip rules are read from
 * .sync-manifest.json and visual-compare-config.json.
 */

const MANIFEST_PATH = join(import.meta.dirname, "../src/pages/template/loc/.sync-manifest.json");
const REFERENCE_DIR = join(import.meta.dirname, "../src/pages/template/loc/.reference-screenshots");
const CONFIG_PATH = join(import.meta.dirname, "../skills/loc-sync/visual-compare-config.json");

// ---- Config ----

interface VisualCompareConfig {
  globalHideSelectors: string[];
  skipEntries: string[];
  tolerances: { maxDiffPixelRatio: number; threshold: number };
  screenshot: {
    waitForSelector: string;
    waitTimeout: number;
  };
}

function loadConfig(): VisualCompareConfig {
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8")) as VisualCompareConfig;
  } catch {
    return {
      globalHideSelectors: [],
      skipEntries: [],
      tolerances: { maxDiffPixelRatio: 0.05, threshold: 0.2 },
      screenshot: { waitForSelector: "[data-testid='page-content'], #root", waitTimeout: 10_000 },
    };
  }
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

// ---- Route collection ----

interface TestRoute {
  route: string;
  pngRefPath: string;
  a11yRefPath: string;
  name: string;
  hasPixelRef: boolean;
  hasA11yRef: boolean;
}

function getTestRoutes(): TestRoute[] {
  const config = loadConfig();

  let manifest: SyncManifest;
  try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")) as SyncManifest;
  } catch (error) {
    console.warn(
      `[loc-sync] Could not read manifest at ${MANIFEST_PATH}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return [];
  }

  const results: TestRoute[] = [];

  for (const [key, entry] of Object.entries(manifest.entries)) {
    if (shouldSkip(key, config.skipEntries)) continue;

    // Require an explicit manifest opt-in via `referenceScreenshot`. Looking at
    // disk alone would:
    //  (a) silently enable comparison for entries whose manifest was intentionally
    //      reset to null (e.g. after a breaking redesign), keeping stale baselines
    //      live in the advisory suite;
    //  (b) break the supported `pnpm loc-sync:capture-refs` workflow where the
    //      capture can be run WITHOUT `--update-manifest` for local previewing.
    if (!entry.referenceScreenshot) continue;

    // Resolve reference paths. The field has carried two formats over time:
    //  - Legacy: a repo-relative path, either pointing at an a11y snapshot
    //    (`.reference-screenshots/file-management/index.tsx.a11y-snapshot.txt`)
    //    or stored with the leading `.reference-screenshots/` prefix.
    //  - Current: a plain filename relative to REFERENCE_DIR (`foo.png`).
    // Both must keep working until the manifest is fully migrated, otherwise
    // every existing entry drops out of the suite.
    const REF_DIR_PREFIX = ".reference-screenshots/";
    const stripPrefix = (p: string) => (p.startsWith(REF_DIR_PREFIX) ? p.slice(REF_DIR_PREFIX.length) : p);
    const normalized = stripPrefix(entry.referenceScreenshot);

    let pngRefPath: string;
    let a11yRefPath: string;
    if (/\.a11y-snapshot\.txt$/i.test(normalized)) {
      // Legacy: only the a11y snapshot was ever saved; no sibling pixel file exists.
      a11yRefPath = join(REFERENCE_DIR, normalized);
      pngRefPath = join(REFERENCE_DIR, normalized.replace(/\.a11y-snapshot\.txt$/i, ".png"));
    } else {
      // Current: pixel reference filename; derive a11y sibling by swapping extension.
      pngRefPath = join(REFERENCE_DIR, normalized);
      const base = normalized.replace(/\.(png|jpe?g|webp)$/i, "");
      a11yRefPath = join(REFERENCE_DIR, `${base}.a11y-snapshot.txt`);
    }
    const safeKey = key.replace(/\//g, "-").replace(/\.tsx$/, "");

    const hasPixelRef = existsSync(pngRefPath);
    const hasA11yRef = existsSync(a11yRefPath);

    // If the manifest points at missing files, warn loudly — this is an
    // inconsistency worth fixing, not silently skipping.
    if (!hasPixelRef && !hasA11yRef) {
      console.warn(
        `[loc-sync] Manifest entry "${key}" has referenceScreenshot="${entry.referenceScreenshot}" but no files exist at ${pngRefPath} or ${a11yRefPath}. Re-run \`pnpm loc-sync:capture-refs\` or clear the manifest field.`,
      );
      continue;
    }

    results.push({
      route: entry.templateRoute,
      pngRefPath,
      a11yRefPath,
      name: safeKey,
      hasPixelRef,
      hasA11yRef,
    });
  }

  return results;
}

// ---- Test helpers ----

/** Hide FloatingSourceCodeViewer and config-specified elements */
async function hideNoisyElements(page: import("@playwright/test").Page, selectors: string[]) {
  const allSelectors = [
    ...selectors,
    "[class*='FloatingSourceCodeViewer']",
    "[class*='floating-source-code']",
  ];
  const css = allSelectors.map((s) => `${s} { display: none !important; }`).join("\n");
  await page.addStyleTag({ content: css });
}

/**
 * Wait for at least one of the selectors to become visible.
 * Throws if all selectors fail — do NOT fall back to a timeout-as-success pattern,
 * because capturing a loading skeleton / error page would poison the baseline.
 */
async function waitForAnyVisible(
  page: import("@playwright/test").Page,
  selectorsCsv: string,
  timeout: number,
): Promise<void> {
  const waitSelectors = selectorsCsv.split(",").map((s) => s.trim()).filter(Boolean);
  try {
    await Promise.any(
      waitSelectors.map((sel) => page.locator(sel).first().waitFor({ state: "visible", timeout })),
    );
  } catch {
    throw new Error(
      `None of the wait selectors became visible within ${timeout}ms: ${waitSelectors.join(", ")}`,
    );
  }
}

interface AriaDiff {
  hasDrift: boolean;
  added: string[];
  removed: string[];
  reordered: string[];
  driftRatio: number;
}

/**
 * Content-based diff of ARIA snapshots using a multiset (count-preserving) model.
 *
 * Playwright's ariaSnapshot() returns a YAML-like text tree where leading
 * indentation encodes the parent/child hierarchy. We keep the indentation
 * intact so that moving a control under a different parent (or collapsing a
 * nested list) surfaces as a different line — otherwise "- button X" at depth
 * 2 and depth 4 normalize to the same string and the regression disappears.
 *
 * We strip trailing whitespace (runs vary), drop comment/blank lines, and
 * compute a multiset difference plus order changes. This catches:
 * - role changes (e.g. button → link)
 * - name/label changes (e.g. "削除" → "Remove")
 * - added/removed elements
 * - reordered elements (lines present in both but at different positions)
 * - hierarchy changes (e.g. control moved under a different parent)
 * - **duplicate-count regressions**: if a table has 5 identical "Delete" buttons
 *   and one disappears, a Set-based diff would miss it because the string still
 *   exists in both sides. A multiset correctly flags "Delete × 4" as removed.
 */
function diffAriaSnapshots(ref: string, cur: string): AriaDiff {
  const normalize = (s: string) =>
    s
      .replace(/^\uFEFF/, "")
      .split("\n")
      // Preserve leading whitespace (indentation = tree depth). Only trim the
      // trailing side because trailing spaces are noise.
      .map((l) => l.replace(/\s+$/, ""))
      .filter((l) => l.length > 0 && !l.trimStart().startsWith("#"));

  const refLines = normalize(ref);
  const curLines = normalize(cur);

  // Multiset (line → count) so "button Delete" × 3 in ref vs × 2 in cur
  // surfaces as 1 removed line, not 0.
  const toCountMap = (lines: string[]): Map<string, number> => {
    const m = new Map<string, number>();
    for (const l of lines) m.set(l, (m.get(l) ?? 0) + 1);
    return m;
  };
  const refCounts = toCountMap(refLines);
  const curCounts = toCountMap(curLines);

  const removed: string[] = [];
  for (const [line, refCount] of refCounts) {
    const curCount = curCounts.get(line) ?? 0;
    for (let i = 0; i < refCount - curCount; i++) removed.push(line);
  }

  const added: string[] = [];
  for (const [line, curCount] of curCounts) {
    const refCount = refCounts.get(line) ?? 0;
    for (let i = 0; i < curCount - refCount; i++) added.push(line);
  }

  // Reordered: lines present in both (multiset intersection) but in different
  // relative order. We walk each side's sequence consuming matched lines.
  const intersectCounts = new Map<string, number>();
  for (const [line, refCount] of refCounts) {
    const curCount = curCounts.get(line) ?? 0;
    const shared = Math.min(refCount, curCount);
    if (shared > 0) intersectCounts.set(line, shared);
  }
  const takeFromSeq = (lines: string[]): string[] => {
    const remaining = new Map(intersectCounts);
    const out: string[] = [];
    for (const l of lines) {
      const left = remaining.get(l) ?? 0;
      if (left > 0) {
        out.push(l);
        remaining.set(l, left - 1);
      }
    }
    return out;
  };
  const refShared = takeFromSeq(refLines);
  const curShared = takeFromSeq(curLines);
  const reordered: string[] = [];
  for (let i = 0; i < Math.min(refShared.length, curShared.length); i++) {
    if (refShared[i] !== curShared[i]) reordered.push(refShared[i]);
  }

  const total = Math.max(refLines.length, curLines.length, 1);
  const driftRatio = (removed.length + added.length + reordered.length) / total;

  // Any structural change is drift. Previously we had a "> 5% or > 3 lines" gate,
  // but that masked single-node regressions in large snapshots — e.g. one missing
  // row in a 100-row table gives driftRatio=0.01 and length=1, which was
  // incorrectly treated as no drift. This suite is advisory (non-blocking),
  // so over-reporting is acceptable; silent regressions are not.
  const hasDrift = removed.length > 0 || added.length > 0 || reordered.length > 0;

  return { hasDrift, added, removed, reordered, driftRatio };
}

// ---- Tests ----

const config = loadConfig();
const testRoutes = getTestRoutes();

if (testRoutes.length === 0) {
  test("loc-sync visual comparison - no reference screenshots", () => {
    test.skip();
  });
} else {
  test.describe("LOC Sync Visual Comparison (Advisory)", () => {
    for (const { route, name, pngRefPath, a11yRefPath, hasPixelRef, hasA11yRef } of testRoutes) {
      // Layer 1: Pixel comparison
      if (hasPixelRef) {
        test(`pixel match: ${name}`, async ({ page }, testInfo) => {
          testInfo.annotations.push({ type: "advisory", description: "Visual drift detection — not a blocker" });

          // Copy reference to Playwright's expected snapshot location
          const snapshotPath = testInfo.snapshotPath(`loc-sync-${name}.png`);
          const snapshotDir = dirname(snapshotPath);
          const { mkdirSync, copyFileSync } = await import("node:fs");
          mkdirSync(snapshotDir, { recursive: true });
          copyFileSync(pngRefPath, snapshotPath);

          await page.goto(route);
          await page.waitForLoadState("domcontentloaded");
          await hideNoisyElements(page, config.globalHideSelectors);
          await waitForAnyVisible(page, config.screenshot.waitForSelector, config.screenshot.waitTimeout);

          try {
            await expect(page).toHaveScreenshot(`loc-sync-${name}.png`, {
              maxDiffPixelRatio: config.tolerances.maxDiffPixelRatio,
            });
          } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.warn(`[loc-sync] Pixel drift detected for "${name}": ${msg}`);
            testInfo.annotations.push({ type: "pixel-drift", description: msg });
          }
        });
      }

      // Layer 2: Structural comparison (a11y snapshot)
      if (hasA11yRef) {
        test(`structure match: ${name}`, async ({ page }, testInfo) => {
          testInfo.annotations.push({ type: "advisory", description: "Structural drift detection — not a blocker" });

          await page.goto(route);
          await page.waitForLoadState("domcontentloaded");
          await hideNoisyElements(page, config.globalHideSelectors);
          await waitForAnyVisible(page, config.screenshot.waitForSelector, config.screenshot.waitTimeout);

          const currentSnapshot = await page.locator("body").ariaSnapshot();

          let referenceSnapshot: string;
          try {
            referenceSnapshot = readFileSync(a11yRefPath, "utf-8");
          } catch {
            testInfo.annotations.push({ type: "skip", description: "Could not read reference a11y snapshot" });
            return;
          }

          try {
            const diff = diffAriaSnapshots(referenceSnapshot, currentSnapshot);
            if (diff.hasDrift) {
              const preview = [
                ...diff.removed.slice(0, 3).map((l) => `  - ${l}`),
                ...diff.added.slice(0, 3).map((l) => `  + ${l}`),
              ].join("\n");
              const msg = `ARIA diff: -${diff.removed.length} +${diff.added.length} ~${diff.reordered.length} (${diff.driftRatio.toFixed(2)})\n${preview}`;
              console.warn(`[loc-sync] Structural drift for "${name}":\n${msg}`);
              testInfo.annotations.push({ type: "structural-drift", description: msg });
            }
          } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.warn(`[loc-sync] Structural drift detected for "${name}": ${msg}`);
            testInfo.annotations.push({ type: "structural-drift", description: msg });
          }
        });
      }
    }
  });
}
