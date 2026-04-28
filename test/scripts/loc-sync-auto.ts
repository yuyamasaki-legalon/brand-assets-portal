/**
 * LOC Sync Auto Orchestrator
 *
 * Updates lib/loc-app, runs drift detection, groups drifted entries by service,
 * and outputs a sync plan as JSON for consumption by RemoteTrigger.
 *
 * This script does NOT perform the actual sync — that requires Claude Code (LLM-driven).
 * The output JSON is designed to be parsed by a RemoteTrigger prompt that invokes /loc-sync.
 *
 * Usage:
 *   pnpm loc-sync:auto                     # Full auto plan
 *   pnpm loc-sync:auto -- --service esign-f  # Filter by service
 *   pnpm loc-sync:auto -- --skip-pull        # Skip git pull
 *   pnpm loc-sync:auto -- --dry-run          # Show plan without branch info
 */

import { execFileSync } from "node:child_process";
import { join } from "node:path";
import {
  type DriftLevel,
  type DriftReport,
  type DriftResult,
  runDriftDetection,
} from "../skills/loc-sync/scripts/detect-drift";
import { parseCliArgs } from "./utils/cli-args";

const ROOT = join(import.meta.dirname, "..");
const LOC_APP_DIR = join(ROOT, "lib/loc-app");

// ---- Types ----

type SyncMode = "full" | "incremental" | "patch";

interface SyncEntry {
  entryKey: string;
  mode: SyncMode;
  locService: string;
  locPagePath: string;
  templateRoute: string;
  driftLevel: DriftLevel;
  summary: string;
}

interface ServiceSyncPlan {
  service: string;
  branch: string;
  entries: SyncEntry[];
}

interface AutoSyncPlan {
  locAppHead: string;
  timestamp: string;
  totalDrifted: number;
  servicePlans: ServiceSyncPlan[];
  skipped: DriftResult[];
}

// ---- Args ----

interface Args {
  service?: string;
  skipPull: boolean;
  dryRun: boolean;
}

function parseArgs(): Args {
  const raw = parseCliArgs();
  return {
    service: typeof raw.service === "string" ? raw.service : undefined,
    skipPull: raw["skip-pull"] === true,
    dryRun: raw["dry-run"] === true,
  };
}

// ---- Helpers ----

/**
 * Update lib/loc-app to origin/main.
 *
 * This fails fast if:
 * - The repo is not on the `main` branch (feature branch or detached HEAD would
 *   cause `merge origin/main --ff-only` to update the wrong ref or fail silently)
 * - The working tree is dirty (uncommitted changes would be lost or block merge)
 * - The fetch or ff-merge fails (stale state would produce wrong drift plan)
 *
 * Throws on any failure — the caller should abort rather than continue with a
 * stale or incorrect loc-app state, because the resulting sync plan would be
 * based on the wrong upstream and could create PRs against a fake baseline.
 */
function updateLocApp(): void {
  console.error("[loc-sync-auto] Updating lib/loc-app...");

  // Check current branch
  const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    cwd: LOC_APP_DIR,
    encoding: "utf-8",
  }).trim();
  if (branch !== "main") {
    throw new Error(
      `lib/loc-app is on branch "${branch}", not "main". Refusing to sync from a non-main state. ` +
        `Run \`cd lib/loc-app && git checkout main\` first.`,
    );
  }

  // Check working tree has no tracked modifications. Untracked files (prefix `??`)
  // don't block a fast-forward, so we allow them — blocking on scratch files
  // would be annoying false positives.
  const status = execFileSync("git", ["status", "--porcelain"], {
    cwd: LOC_APP_DIR,
    encoding: "utf-8",
  }).trim();
  const dirtyLines = status.split("\n").filter((l) => l.length > 0 && !l.startsWith("??"));
  if (dirtyLines.length > 0) {
    throw new Error(
      `lib/loc-app has uncommitted tracked changes. Refusing to merge over dirty tree.\n${dirtyLines.join("\n")}`,
    );
  }

  // Fetch and ff-merge (fail fast on error)
  execFileSync("git", ["fetch", "origin", "main"], { cwd: LOC_APP_DIR, stdio: "pipe" });
  execFileSync("git", ["merge", "origin/main", "--ff-only"], { cwd: LOC_APP_DIR, stdio: "pipe" });

  // --ff-only succeeds silently when local `main` is already AT or AHEAD of
  // origin/main. In the "ahead" case we'd compute drift against private
  // unpublished commits and could generate PRs for changes that do not exist
  // upstream. Verify HEAD equals origin/main explicitly before continuing.
  const headSha = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: LOC_APP_DIR,
    encoding: "utf-8",
  }).trim();
  const upstreamSha = execFileSync("git", ["rev-parse", "origin/main"], {
    cwd: LOC_APP_DIR,
    encoding: "utf-8",
  }).trim();
  if (headSha !== upstreamSha) {
    throw new Error(
      `lib/loc-app HEAD (${headSha.slice(0, 12)}) does not match origin/main (${upstreamSha.slice(0, 12)}). ` +
        `Local main is ahead of or diverged from upstream — refusing to sync from an unpublished baseline. ` +
        `Run \`cd lib/loc-app && git reset --hard origin/main\` if this is intentional.`,
    );
  }

  console.error(`[loc-sync-auto] lib/loc-app at ${headSha.slice(0, 12)} (origin/main)`);
}

function driftLevelToMode(level: DriftLevel): SyncMode | null {
  switch (level) {
    case "MAJOR":
      return "full";
    case "MINOR":
      return "incremental";
    case "COSMETIC":
      return "patch";
    case "NONE":
      return null;
  }
}

/**
 * Build a unique branch name for an automated sync run.
 *
 * Includes a UTC timestamp (minute granularity) so that same-day retries after
 * partial failure or manual abort don't collide with a previously-created
 * local branch — `git checkout -b` would otherwise fail before any work
 * happens, and the whole retry would be wasted.
 *
 * Format: auto/loc-sync/{service}/{YYYYMMDD}-{HHMM}
 * Example: auto/loc-sync/esign-f/20260416-1430
 */
function buildBranchName(service: string): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const min = String(now.getUTCMinutes()).padStart(2, "0");
  return `auto/loc-sync/${service}/${yyyy}${mm}${dd}-${hh}${min}`;
}

function groupByService(results: DriftResult[]): Map<string, DriftResult[]> {
  const groups = new Map<string, DriftResult[]>();
  for (const result of results) {
    const existing = groups.get(result.locService);
    if (existing) {
      existing.push(result);
    } else {
      groups.set(result.locService, [result]);
    }
  }
  return groups;
}

function buildSyncPlan(report: DriftReport, dryRun: boolean): AutoSyncPlan {
  const drifted = report.results.filter((r) => r.driftLevel !== "NONE");
  const serviceGroups = groupByService(drifted);

  const servicePlans: ServiceSyncPlan[] = [];

  for (const [service, results] of serviceGroups) {
    const entries: SyncEntry[] = [];
    for (const result of results) {
      const mode = driftLevelToMode(result.driftLevel);
      if (!mode) continue;
      entries.push({
        entryKey: result.templateFile,
        mode,
        locService: result.locService,
        locPagePath: result.locPagePath,
        templateRoute: result.templateRoute,
        driftLevel: result.driftLevel,
        summary: result.summary,
      });
    }

    if (entries.length > 0) {
      servicePlans.push({
        service,
        branch: dryRun ? `auto/loc-sync/${service}/{timestamp}` : buildBranchName(service),
        entries,
      });
    }
  }

  return {
    locAppHead: report.locAppHead,
    timestamp: new Date().toISOString(),
    totalDrifted: drifted.length,
    servicePlans,
    skipped: report.results.filter((r) => r.driftLevel === "NONE"),
  };
}

// ---- Main ----

function main(): void {
  const { service, skipPull, dryRun } = parseArgs();

  if (!skipPull) {
    try {
      updateLocApp();
    } catch (error) {
      console.error(`[loc-sync-auto] Aborting: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }

  let report: DriftReport;
  try {
    report = runDriftDetection(service ? { filterService: service } : undefined);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  const plan = buildSyncPlan(report, dryRun);

  if (plan.servicePlans.length === 0) {
    console.error("[loc-sync-auto] No drift detected. All templates are up to date.");
    console.log(JSON.stringify(plan, null, 2));
    process.exit(0);
  }

  console.error(
    `[loc-sync-auto] Found ${plan.totalDrifted} drifted entries across ${plan.servicePlans.length} services.`,
  );
  for (const sp of plan.servicePlans) {
    const modes = sp.entries.map((e) => `${e.entryKey}(${e.mode})`).join(", ");
    console.error(`  ${sp.service}: ${modes}`);
  }

  console.log(JSON.stringify(plan, null, 2));
}

main();
