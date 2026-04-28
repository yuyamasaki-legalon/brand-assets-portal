/**
 * LOC Sync Drift Detector
 *
 * Reads .sync-manifest.json and detects changes in lib/loc-app since last sync.
 * Classifies drift level: MAJOR / MINOR / COSMETIC / NONE.
 *
 * Usage (CLI):
 *   pnpm loc-sync:drift                    # Full report for all entries
 *   pnpm loc-sync:drift -- --service esign-f  # Filter by service
 *   pnpm loc-sync:drift -- --entry case/index.tsx  # Filter by manifest entry
 *   pnpm loc-sync:drift -- --json           # JSON output
 *
 * Usage (Library):
 *   import { runDriftDetection } from "./detect-drift";
 *   const report = runDriftDetection();
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCliArgs } from "../../../scripts/utils/cli-args";
import type { SyncEntry, SyncManifest } from "../../src/pages/template/loc/sync-manifest.types";

const ROOT = join(import.meta.dirname, "../../..");
const MANIFEST_PATH = join(ROOT, "src/pages/template/loc/.sync-manifest.json");

// ---- Types ----

export type DriftLevel = "MAJOR" | "MINOR" | "COSMETIC" | "NONE";

export interface DriftResult {
  templateFile: string;
  locService: string;
  locPagePath: string;
  templateRoute: string;
  driftLevel: DriftLevel;
  lastSyncedDate: string;
  lastSyncedCommit: string;
  changedFiles: string[];
  addedFiles: string[];
  deletedFiles: string[];
  summary: string;
}

export interface DriftDetectionOptions {
  filterService?: string;
  filterEntry?: string;
}

export interface DriftReport {
  locAppHead: string;
  results: DriftResult[];
}

// ---- Git helpers ----

function git(args: string[], cwd: string): string {
  return execFileSync("git", args, { cwd, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }).trim();
}

function getLocAppHead(locAppDir: string): string {
  return git(["rev-parse", "HEAD"], locAppDir);
}

function isValidCommit(commit: string, cwd: string): boolean {
  try {
    execFileSync("git", ["cat-file", "-t", commit], { cwd, encoding: "utf-8" });
    return true;
  } catch {
    return false;
  }
}

interface DiffStat {
  added: string[];
  modified: string[];
  deleted: string[];
}

/** Parse `git diff --name-status` output into a DiffStat. */
function parseDiffOutput(raw: string): DiffStat {
  if (!raw) return { added: [], modified: [], deleted: [] };

  const result: DiffStat = { added: [], modified: [], deleted: [] };

  for (const line of raw.split("\n")) {
    if (!line) continue;
    const [status, ...fileParts] = line.split("\t");
    if (status.startsWith("A")) result.added.push(fileParts[0]);
    else if (status.startsWith("D")) result.deleted.push(fileParts[0]);
    else if (status.startsWith("R")) {
      // Rename = delete old path + add new path (structural change)
      result.deleted.push(fileParts[0]);
      result.added.push(fileParts[1] ?? fileParts[0]);
    } else if (status.startsWith("M")) result.modified.push(fileParts[0]);
  }

  return result;
}

function getDiffStat(fromCommit: string, toCommit: string, paths: string[], cwd: string): DiffStat {
  if (paths.length === 0) return { added: [], modified: [], deleted: [] };
  const raw = git(["diff", "--name-status", `${fromCommit}..${toCommit}`, "--", ...paths], cwd);
  return parseDiffOutput(raw);
}

/** Check working tree (staged + unstaged) against HEAD for uncommitted changes. */
function getWorktreeDiff(paths: string[], cwd: string): DiffStat {
  if (paths.length === 0) return { added: [], modified: [], deleted: [] };
  const raw = git(["diff", "--name-status", "HEAD", "--", ...paths], cwd);
  return parseDiffOutput(raw);
}

// ---- Drift classification ----

function isCosmetic(f: string): boolean {
  if (f.endsWith(".csv")) return true;
  const basename = f.split("/").pop() ?? f;
  return basename.startsWith("messages.") || basename.startsWith("i18n.");
}

function isNonProductionFile(f: string): boolean {
  return /\.(stories|spec|test)\.[^/]+$/.test(f);
}

/** Filter out non-production files (stories, specs, tests) from diff results. */
function filterProductionFiles(diff: DiffStat): DiffStat {
  return {
    added: diff.added.filter((f) => !isNonProductionFile(f)),
    modified: diff.modified.filter((f) => !isNonProductionFile(f)),
    deleted: diff.deleted.filter((f) => !isNonProductionFile(f)),
  };
}

function classifyDrift(diff: DiffStat): DriftLevel {
  const hasStructuralChange = diff.added.length > 0 || diff.deleted.length > 0;
  // Heuristic: detect layout/router file changes to escalate to MAJOR.
  // Intentionally broad — may match files like RouterUtils.ts or useRouter.ts.
  // This is an acceptable conservative trade-off: false positives (over-escalation)
  // are preferable to missing a genuine layout restructure.
  const hasLayoutChange = diff.modified
    .filter((f) => !isCosmetic(f))
    .some((f) => f.includes("Layout") || f.includes("layout") || f.includes("Router") || f.includes("router"));

  if (hasStructuralChange || hasLayoutChange) return "MAJOR";

  if (diff.modified.length === 0) return "NONE";

  const allCosmeticOnly = diff.modified.every(isCosmetic);

  if (allCosmeticOnly) return "COSMETIC";

  return "MINOR";
}

/** Expand shell-style brace patterns (e.g. `*.{tsx,css}`) into individual patterns. */
function expandBraces(pattern: string): string[] {
  const match = pattern.match(/^(.*)\{([^}]+)\}(.*)$/);
  if (!match) return [pattern];
  const [, prefix, alternatives, suffix] = match;
  return alternatives.split(",").map((alt) => `${prefix}${alt}${suffix}`);
}

function buildSourcePaths(entry: SyncEntry): string[] {
  const serviceBase = `services/${entry.locService}/src`;
  const paths: string[] = [`${serviceBase}/${entry.locPagePath}`];

  for (const glob of entry.locPartsGlobs) {
    for (const expanded of expandBraces(glob)) {
      paths.push(`:(glob)${serviceBase}/${expanded}`);
    }
  }

  return paths;
}

// ---- Public API ----

/**
 * Run drift detection and return structured results.
 * Throws on fatal errors (manifest unreadable, loc-app HEAD unavailable).
 */
export function runDriftDetection(options?: DriftDetectionOptions): DriftReport {
  const { filterService, filterEntry } = options ?? {};

  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")) as SyncManifest;
  const locAppDir = join(ROOT, manifest.locAppRepo);
  const currentHead = getLocAppHead(locAppDir);

  const results: DriftResult[] = [];

  for (const [templateFile, entry] of Object.entries(manifest.entries)) {
    if (filterEntry && templateFile !== filterEntry) continue;
    if (filterService && entry.locService !== filterService) continue;

    // Never-synced entries (lastSyncedCommit is null) are treated as MAJOR (initial full sync needed)
    if (!entry.lastSyncedCommit) {
      results.push({
        templateFile,
        locService: entry.locService,
        locPagePath: entry.locPagePath,
        templateRoute: entry.templateRoute,
        driftLevel: "MAJOR",
        lastSyncedDate: entry.lastSyncedDate ?? "",
        lastSyncedCommit: "",
        changedFiles: [],
        addedFiles: [],
        deletedFiles: [],
        summary: "Never synced — initial full sync needed",
      });
      continue;
    }

    // Validate the synced commit still exists
    if (!isValidCommit(entry.lastSyncedCommit, locAppDir)) {
      results.push({
        templateFile,
        locService: entry.locService,
        locPagePath: entry.locPagePath,
        templateRoute: entry.templateRoute,
        driftLevel: "MAJOR",
        lastSyncedDate: entry.lastSyncedDate,
        lastSyncedCommit: entry.lastSyncedCommit,
        changedFiles: [],
        addedFiles: [],
        deletedFiles: [],
        summary: `Synced commit ${entry.lastSyncedCommit.slice(0, 8)} not found in repo`,
      });
      continue;
    }

    // If already at HEAD, check for uncommitted changes only
    if (entry.lastSyncedCommit === currentHead) {
      const sourcePaths = buildSourcePaths(entry);
      let worktreeDiff: DiffStat;
      try {
        worktreeDiff = getWorktreeDiff(sourcePaths, locAppDir);
      } catch {
        worktreeDiff = { added: [], modified: [], deleted: [] };
      }

      const filteredDiff = filterProductionFiles(worktreeDiff);
      const driftLevel = classifyDrift(filteredDiff);
      const totalChanges = filteredDiff.added.length + filteredDiff.modified.length + filteredDiff.deleted.length;

      let summary: string;
      if (driftLevel === "NONE") {
        summary = "Up to date";
      } else {
        const parts: string[] = [];
        if (filteredDiff.added.length > 0) parts.push(`+${filteredDiff.added.length} added`);
        if (filteredDiff.modified.length > 0) parts.push(`~${filteredDiff.modified.length} modified`);
        if (filteredDiff.deleted.length > 0) parts.push(`-${filteredDiff.deleted.length} deleted`);
        summary = `${totalChanges} uncommitted files changed (${parts.join(", ")})`;
      }

      results.push({
        templateFile,
        locService: entry.locService,
        locPagePath: entry.locPagePath,
        templateRoute: entry.templateRoute,
        driftLevel,
        lastSyncedDate: entry.lastSyncedDate,
        lastSyncedCommit: entry.lastSyncedCommit,
        changedFiles: filteredDiff.modified,
        addedFiles: filteredDiff.added,
        deletedFiles: filteredDiff.deleted,
        summary,
      });
      continue;
    }

    const sourcePaths = buildSourcePaths(entry);
    let rawDiff: DiffStat;
    try {
      rawDiff = getDiffStat(entry.lastSyncedCommit, currentHead, sourcePaths, locAppDir);
    } catch (error) {
      console.error(
        `[warn] git diff failed for ${templateFile}: ${error instanceof Error ? error.message : String(error)}`,
      );
      results.push({
        templateFile,
        locService: entry.locService,
        locPagePath: entry.locPagePath,
        templateRoute: entry.templateRoute,
        driftLevel: "MAJOR",
        lastSyncedDate: entry.lastSyncedDate,
        lastSyncedCommit: entry.lastSyncedCommit,
        changedFiles: [],
        addedFiles: [],
        deletedFiles: [],
        summary: "git diff failed — treat as MAJOR drift",
      });
      continue;
    }

    const diff = filterProductionFiles(rawDiff);
    const driftLevel = classifyDrift(diff);
    const totalChanges = diff.added.length + diff.modified.length + diff.deleted.length;

    let summary: string;
    if (driftLevel === "NONE") {
      summary = "No changes in tracked paths";
    } else {
      const parts: string[] = [];
      if (diff.added.length > 0) parts.push(`+${diff.added.length} added`);
      if (diff.modified.length > 0) parts.push(`~${diff.modified.length} modified`);
      if (diff.deleted.length > 0) parts.push(`-${diff.deleted.length} deleted`);
      summary = `${totalChanges} files changed (${parts.join(", ")})`;
    }

    results.push({
      templateFile,
      locService: entry.locService,
      locPagePath: entry.locPagePath,
      templateRoute: entry.templateRoute,
      driftLevel,
      lastSyncedDate: entry.lastSyncedDate,
      lastSyncedCommit: entry.lastSyncedCommit,
      changedFiles: diff.modified,
      addedFiles: diff.added,
      deletedFiles: diff.deleted,
      summary,
    });
  }

  // Throw when a filter matches nothing — a typo or stale mapping should not be mistaken for "no drift"
  if (results.length === 0 && (filterEntry || filterService)) {
    const filter = filterEntry ? `--entry ${filterEntry}` : `--service ${filterService}`;
    throw new Error(`No manifest entries match ${filter}`);
  }

  // Sort: MAJOR > MINOR > COSMETIC > NONE
  const levelOrder: Record<DriftLevel, number> = { MAJOR: 0, MINOR: 1, COSMETIC: 2, NONE: 3 };
  results.sort((a, b) => levelOrder[a.driftLevel] - levelOrder[b.driftLevel]);

  return { locAppHead: currentHead, results };
}

/** Format a DriftReport as a Markdown string. */
export function formatMarkdownReport(report: DriftReport): string {
  const lines: string[] = [];
  const { locAppHead, results } = report;

  const driftCounts = { MAJOR: 0, MINOR: 0, COSMETIC: 0, NONE: 0 };
  for (const r of results) driftCounts[r.driftLevel]++;

  lines.push("## LOC Sync Drift Report\n");
  lines.push(`loc-app HEAD: ${locAppHead.slice(0, 12)}`);
  lines.push(`Template entries: ${results.length}`);
  lines.push("");
  lines.push("| Level | Count | Recommended Action |");
  lines.push("|-------|-------|--------------------|");
  lines.push(`| MAJOR    | ${driftCounts.MAJOR.toString().padStart(3)} | \`/loc-sync full\`        |`);
  lines.push(`| MINOR    | ${driftCounts.MINOR.toString().padStart(3)} | \`/loc-sync incremental\` |`);
  lines.push(`| COSMETIC | ${driftCounts.COSMETIC.toString().padStart(3)} | \`/loc-sync patch\`       |`);
  lines.push(`| NONE     | ${driftCounts.NONE.toString().padStart(3)} | Up to date             |`);

  const drifted = results.filter((r) => r.driftLevel !== "NONE");
  if (drifted.length === 0) {
    lines.push("\nAll templates are up to date.");
    return lines.join("\n");
  }

  lines.push("\n### Drifted Templates\n");
  lines.push("| Template | Service | Level | Summary | Last Synced |");
  lines.push("|----------|---------|-------|---------|-------------|");

  for (const r of drifted) {
    const date = r.lastSyncedDate ? r.lastSyncedDate.split("T")[0] : "never";
    lines.push(`| \`${r.templateFile}\` | ${r.locService} | **${r.driftLevel}** | ${r.summary} | ${date} |`);
  }

  const detailedEntries = drifted.filter((r) => r.driftLevel === "MAJOR" || r.driftLevel === "MINOR");
  if (detailedEntries.length > 0) {
    lines.push("\n### Changed File Details\n");
    for (const r of detailedEntries) {
      lines.push(`#### \`${r.templateFile}\` (${r.driftLevel})`);
      for (const f of r.addedFiles) lines.push(`  + ${f}`);
      for (const f of r.changedFiles) lines.push(`  ~ ${f}`);
      for (const f of r.deletedFiles) lines.push(`  - ${f}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

// ---- CLI entrypoint ----

function parseArgs(): { service?: string; entry?: string; json: boolean } {
  const raw = parseCliArgs();
  return {
    service: typeof raw.service === "string" ? raw.service : undefined,
    entry: typeof raw.entry === "string" ? raw.entry : undefined,
    json: raw.json === true,
  };
}

function main(): void {
  const { service: filterService, entry: filterEntry, json: jsonOutput } = parseArgs();

  let report: DriftReport;
  try {
    report = runDriftDetection({ filterService, filterEntry });
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatMarkdownReport(report));
  }
}

// Run CLI only when executed directly (not when imported as a library)
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
