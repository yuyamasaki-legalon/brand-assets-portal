/**
 * Hueron Sync Drift Detector
 *
 * Reads .sync-manifest.json and detects changes in lib/hueron-app since last sync.
 * Classifies drift level: MAJOR / MINOR / NONE.
 *
 * Usage:
 *   pnpm hueron-sync:drift                          # Full report for all entries
 *   pnpm hueron-sync:drift -- --entry procedure/index.tsx  # Filter by manifest entry
 *   pnpm hueron-sync:drift -- --page procedure       # Filter by page path prefix
 *   pnpm hueron-sync:drift -- --json                 # JSON output
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { SyncEntry, SyncManifest } from "../../../src/pages/template/workon/sync-manifest.types";

const ROOT = join(import.meta.dirname, "../../..");
const MANIFEST_PATH = join(ROOT, "src/pages/template/workon/.sync-manifest.json");

// ---- Types ----

type DriftLevel = "MAJOR" | "MINOR" | "NONE";

interface DriftResult {
  templateFile: string;
  pagePath: string;
  templateRoute: string;
  driftLevel: DriftLevel;
  lastSyncedDate: string;
  lastSyncedCommit: string;
  changedFiles: string[];
  addedFiles: string[];
  deletedFiles: string[];
  summary: string;
}

// ---- Git helpers ----

function git(args: string[], cwd: string): string {
  return execFileSync("git", args, { cwd, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }).trim();
}

function getHueronAppHead(hueronAppDir: string): string {
  return git(["rev-parse", "HEAD"], hueronAppDir);
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
  const hasLayoutChange = diff.modified.some(
    (f) => f.includes("Layout") || f.includes("layout") || f.includes("Router") || f.includes("router"),
  );

  if (hasStructuralChange || hasLayoutChange) return "MAJOR";

  if (diff.modified.length === 0) return "NONE";

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
  const appBase = "frontend/apps/main/src/app";
  const paths: string[] = [`${appBase}/${entry.pagePath}`];

  for (const glob of entry.relatedGlobs) {
    for (const expanded of expandBraces(glob)) {
      paths.push(`:(glob)${appBase}/${expanded}`);
    }
  }

  return paths;
}

// ---- Main ----

function parseArgs(): { page?: string; entry?: string; json: boolean } {
  const args = process.argv.slice(2);
  let page: string | undefined;
  let entry: string | undefined;
  let json = false;

  // Normalize --key=value into ["--key", "value"]
  const normalized: string[] = [];
  for (const arg of args) {
    const eqIdx = arg.indexOf("=");
    if (arg.startsWith("--") && eqIdx !== -1) {
      normalized.push(arg.slice(0, eqIdx), arg.slice(eqIdx + 1));
    } else {
      normalized.push(arg);
    }
  }

  for (let i = 0; i < normalized.length; i++) {
    if (normalized[i] === "--page" && normalized[i + 1]) {
      page = normalized[i + 1];
      i++;
    } else if (normalized[i] === "--entry" && normalized[i + 1]) {
      entry = normalized[i + 1];
      i++;
    } else if (normalized[i] === "--json") {
      json = true;
    }
  }

  return { page, entry, json };
}

function main(): void {
  const { page: filterPage, entry: filterEntry, json: jsonOutput } = parseArgs();

  // Read manifest
  let manifest: SyncManifest;
  try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")) as SyncManifest;
  } catch (error) {
    console.error(`Error: Cannot read manifest at ${MANIFEST_PATH}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const hueronAppDir = join(ROOT, manifest.hueronAppRepo);
  let currentHead: string;
  try {
    currentHead = getHueronAppHead(hueronAppDir);
  } catch (error) {
    console.error(`Error: Cannot get HEAD of hueron-app at ${hueronAppDir}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const results: DriftResult[] = [];

  for (const [templateFile, entry] of Object.entries(manifest.entries)) {
    if (filterEntry && templateFile !== filterEntry) continue;
    if (filterPage && !entry.pagePath.includes(filterPage)) continue;

    // Validate the synced commit still exists
    if (!isValidCommit(entry.lastSyncedCommit, hueronAppDir)) {
      results.push({
        templateFile,
        pagePath: entry.pagePath,
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
        worktreeDiff = getWorktreeDiff(sourcePaths, hueronAppDir);
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
        pagePath: entry.pagePath,
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
      rawDiff = getDiffStat(entry.lastSyncedCommit, currentHead, sourcePaths, hueronAppDir);
    } catch (error) {
      console.error(
        `[warn] git diff failed for ${templateFile}: ${error instanceof Error ? error.message : String(error)}`,
      );
      results.push({
        templateFile,
        pagePath: entry.pagePath,
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
      pagePath: entry.pagePath,
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

  // Fail when a filter matches nothing
  if (results.length === 0 && (filterEntry || filterPage)) {
    const filter = filterEntry ? `--entry ${filterEntry}` : `--page ${filterPage}`;
    console.error(`Error: No manifest entries match ${filter}`);
    process.exit(1);
  }

  // Sort: MAJOR > MINOR > NONE
  const levelOrder: Record<DriftLevel, number> = { MAJOR: 0, MINOR: 1, NONE: 2 };
  results.sort((a, b) => levelOrder[a.driftLevel] - levelOrder[b.driftLevel]);

  if (jsonOutput) {
    console.log(JSON.stringify({ hueronAppHead: currentHead, results }, null, 2));
    return;
  }

  // Print report
  const driftCounts = { MAJOR: 0, MINOR: 0, NONE: 0 };
  for (const r of results) driftCounts[r.driftLevel]++;

  console.log("## Hueron Sync Drift Report\n");
  console.log(`hueron-app HEAD: ${currentHead.slice(0, 12)}`);
  console.log(`Template entries: ${results.length}`);
  console.log();
  console.log("| Level | Count | Recommended Action |");
  console.log("|-------|-------|--------------------|");
  console.log(`| MAJOR    | ${driftCounts.MAJOR.toString().padStart(3)} | \`/hueron-sync full\`        |`);
  console.log(`| MINOR    | ${driftCounts.MINOR.toString().padStart(3)} | \`/hueron-sync incremental\` |`);
  console.log(`| NONE     | ${driftCounts.NONE.toString().padStart(3)} | Up to date                 |`);

  // Show drifted entries
  const drifted = results.filter((r) => r.driftLevel !== "NONE");
  if (drifted.length === 0) {
    console.log("\nAll templates are up to date.");
    return;
  }

  console.log("\n### Drifted Templates\n");
  console.log("| Template | Page Path | Level | Summary | Last Synced |");
  console.log("|----------|-----------|-------|---------|-------------|");

  for (const r of drifted) {
    const date = r.lastSyncedDate.split("T")[0];
    console.log(`| \`${r.templateFile}\` | ${r.pagePath} | **${r.driftLevel}** | ${r.summary} | ${date} |`);
  }

  // Show file details for MAJOR/MINOR
  const detailedEntries = drifted.filter((r) => r.driftLevel === "MAJOR" || r.driftLevel === "MINOR");
  if (detailedEntries.length > 0) {
    console.log("\n### Changed File Details\n");
    for (const r of detailedEntries) {
      console.log(`#### \`${r.templateFile}\` (${r.driftLevel})`);
      for (const f of r.addedFiles) console.log(`  + ${f}`);
      for (const f of r.changedFiles) console.log(`  ~ ${f}`);
      for (const f of r.deletedFiles) console.log(`  - ${f}`);
      console.log();
    }
  }
}

main();
