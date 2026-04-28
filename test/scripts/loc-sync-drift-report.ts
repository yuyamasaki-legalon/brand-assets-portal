/**
 * LOC Sync Drift Report
 *
 * Updates lib/loc-app to latest and runs drift detection.
 * Outputs a Markdown report to stdout.
 * Exit code 1 if any drift is detected, 0 if all up to date.
 *
 * Usage:
 *   pnpm loc-sync:drift-report                    # Full report
 *   pnpm loc-sync:drift-report -- --service esign-f  # Filter by service
 *   pnpm loc-sync:drift-report -- --entry case/index.tsx  # Filter by entry
 *   pnpm loc-sync:drift-report -- --json           # JSON output
 *   pnpm loc-sync:drift-report -- --skip-pull       # Skip git pull
 */

import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { type DriftReport, formatMarkdownReport, runDriftDetection } from "../skills/loc-sync/scripts/detect-drift";
import { parseCliArgs } from "./utils/cli-args";

const ROOT = join(import.meta.dirname, "..");
const LOC_APP_DIR = join(ROOT, "lib/loc-app");

// ---- Args ----

interface Args {
  service?: string;
  entry?: string;
  json: boolean;
  skipPull: boolean;
}

function parseArgs(): Args {
  const raw = parseCliArgs();
  return {
    service: typeof raw.service === "string" ? raw.service : undefined,
    entry: typeof raw.entry === "string" ? raw.entry : undefined,
    json: raw.json === true,
    skipPull: raw["skip-pull"] === true,
  };
}

// ---- Git helpers ----

/**
 * Update lib/loc-app to origin/main.
 * Throws if not on main / dirty tree / merge fails — a stale or wrong baseline
 * would produce an incorrect drift report.
 */
function updateLocApp(): void {
  console.error("[drift-report] Updating lib/loc-app...");

  const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    cwd: LOC_APP_DIR,
    encoding: "utf-8",
  }).trim();
  if (branch !== "main") {
    throw new Error(
      `lib/loc-app is on branch "${branch}", not "main". Run \`cd lib/loc-app && git checkout main\` first.`,
    );
  }

  const status = execFileSync("git", ["status", "--porcelain"], {
    cwd: LOC_APP_DIR,
    encoding: "utf-8",
  }).trim();
  const dirtyLines = status.split("\n").filter((l) => l.length > 0 && !l.startsWith("??"));
  if (dirtyLines.length > 0) {
    throw new Error(`lib/loc-app has uncommitted tracked changes.\n${dirtyLines.join("\n")}`);
  }

  execFileSync("git", ["fetch", "origin", "main"], { cwd: LOC_APP_DIR, stdio: "pipe" });
  execFileSync("git", ["merge", "origin/main", "--ff-only"], { cwd: LOC_APP_DIR, stdio: "pipe" });

  // --ff-only succeeds when local main is already at or ahead of origin/main.
  // Verify HEAD equals the upstream tip so we never base a drift report on
  // private unpublished commits.
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
      `lib/loc-app HEAD (${headSha.slice(0, 12)}) is ahead of / diverged from origin/main (${upstreamSha.slice(0, 12)}). ` +
        `Refusing to report drift against an unpublished baseline.`,
    );
  }

  console.error(`[drift-report] lib/loc-app at ${headSha.slice(0, 12)} (origin/main)`);
}

// ---- Main ----

function main(): void {
  const { service, entry, json, skipPull } = parseArgs();

  if (!skipPull) {
    try {
      updateLocApp();
    } catch (error) {
      console.error(`[drift-report] Aborting: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }

  let report: DriftReport;
  try {
    report = runDriftDetection({ filterService: service, filterEntry: entry });
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatMarkdownReport(report));
  }

  const hasDrift = report.results.some((r) => r.driftLevel !== "NONE");
  process.exit(hasDrift ? 1 : 0);
}

main();
