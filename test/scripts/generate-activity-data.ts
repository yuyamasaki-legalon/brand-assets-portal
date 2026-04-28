#!/usr/bin/env tsx

/**
 * Sandbox Activity Dashboard のデータ生成スクリプト
 *
 * Usage: pnpm sandbox:activity
 *
 * git log / gh CLI / Cloudflare API からデータを収集し、
 * src/pages/sandbox/activity-data.json に出力する。
 *
 * Cloudflare のデプロイデータを取得するには環境変数を設定:
 *   export CF_ACCOUNT_ID='...'
 *   export CLOUDFLARE_API_TOKEN='...'
 */

import { execSync } from "node:child_process";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const SANDBOX_DIR = path.join(ROOT, "src/pages/sandbox");
const OUTPUT_PATH = path.join(ROOT, "src/pages/analytics/activity-data.json");

// ─── Helpers ─────────────────────────────────────────────

function run(cmd: string, timeoutMs = 30_000): string {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: "utf-8", timeout: timeoutMs }).trim();
  } catch {
    return "";
  }
}

/** ISO 日付文字列を YYYY-MM-WNN 形式の週ラベルに変換 (cf-deploy-graph.sh と同じ形式) */
function toWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const weekInMonth = String(Math.floor((d.getDate() - 1) / 7) + 1).padStart(2, "0");
  return `${year}-${month}-W${weekInMonth}`;
}

/** YYYY-MM-WNN → 表示用ラベル MM/W1 等 */
function weekKeyToDisplay(weekKey: string): string {
  // "2026-03-W01" → "03/W1"
  const parts = weekKey.split("-");
  const month = parts[1];
  const week = parts[2].replace(/^W0/, "W");
  return `${month}/${week}`;
}

// ─── Git Data ────────────────────────────────────────────

function getWeeklyCommits(prCommitDates: string[]): Array<{ week: string; commits: number }> {
  const weekCounts = new Map<string, number>();

  // 1. PR ブランチ上のコミット日時を集計
  for (const dateStr of prCommitDates) {
    if (!dateStr) continue;
    const week = toWeekKey(dateStr);
    weekCounts.set(week, (weekCounts.get(week) ?? 0) + 1);
  }

  // 2. main への直接コミット (PR 経由でないもの) を加算
  const raw = run('git log --since="12 weeks ago" --format="%aI" --no-merges --first-parent');
  if (raw) {
    for (const line of raw.split("\n")) {
      if (!line) continue;
      const week = toWeekKey(line);
      weekCounts.set(week, (weekCounts.get(week) ?? 0) + 1);
    }
  }

  return [...weekCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, commits]) => ({ week: weekKeyToDisplay(week), commits }));
}

/**
 * git author name → 正規化名のマッピング
 * git author と GitHub login が異なる人を名寄せする
 */
const AUTHOR_ALIASES: Record<string, string> = {
  // git author name → canonical name (GitHub login を優先)
  "chie.suzuki": "Sakurampoo",
  "Chie Suzuki": "Sakurampoo",
  j2y: "jeeheeyoo",
  "Jun Nomura": "jun-nom",
  "Juna Kondo": "KondoJuna",
  "kazumi.terada": "kamitera",
  "YANRAN SHI": "yanranshi",
  "Devin AI": "devin-ai",
  "dependabot[bot]": "dependabot",
  "Koji Kobayashi": "komaryo77777",
};

function normalizeAuthor(name: string): string {
  return AUTHOR_ALIASES[name] ?? name;
}

/**
 * PR 内のコミットデータを個別に取得する
 * gh pr view {number} で各 PR のコミット数・日時を取得し、作者ごとに合算
 */
interface PrCommitData {
  /** author → commit count */
  counts: Map<string, number>;
  /** コミット日時の一覧 (週別集計用) */
  commitDates: string[];
}

function getPrCommitData(prNumbers: number[]): PrCommitData {
  const counts = new Map<string, number>();
  const commitDates: string[] = [];
  console.log(`    Fetching commit data for ${prNumbers.length} PRs...`);

  for (let i = 0; i < prNumbers.length; i++) {
    const num = prNumbers[i];
    const raw = run(
      `gh pr view ${num} --json author,commits --jq '{author: .author.login, dates: [.commits[].authoredDate]}'`,
      15_000,
    );
    if (raw) {
      try {
        const pr: { author: string; dates: string[] } = JSON.parse(raw);
        const name = normalizeAuthor(pr.author);
        counts.set(name, (counts.get(name) ?? 0) + pr.dates.length);
        commitDates.push(...pr.dates);
      } catch {
        // skip
      }
    }

    if ((i + 1) % 20 === 0 || i === prNumbers.length - 1) {
      process.stdout.write(`    ${i + 1} / ${prNumbers.length} PRs processed\r`);
    }
  }
  console.log();

  return { counts, commitDates };
}

function getContributors(
  prs: Array<{ number: number; author: string; state: string }>,
  prCommitCounts: Map<string, number>,
): Array<{ name: string; commits: number; prs: number }> {
  // 1. PR 内のコミット数 (呼び出し元で取得済み)
  const commitCounts = new Map(prCommitCounts);

  // 2. main ブランチへの直接コミット (PR 経由でないもの) を加算
  const mainRaw = run('git log --since="12 weeks ago" --format="%an" --no-merges --first-parent');
  if (mainRaw) {
    for (const line of mainRaw.split("\n")) {
      if (!line) continue;
      const name = normalizeAuthor(line);
      commitCounts.set(name, (commitCounts.get(name) ?? 0) + 1);
    }
  }

  // 3. PR 数カウント
  const prCounts = new Map<string, number>();
  for (const pr of prs) {
    if (pr.author.startsWith("app/")) continue;
    const name = normalizeAuthor(pr.author);
    prCounts.set(name, (prCounts.get(name) ?? 0) + 1);
  }

  // bot を除外
  const botNames = new Set(["devin-ai", "dependabot"]);
  const allNames = new Set([...commitCounts.keys(), ...prCounts.keys()]);
  const contributors = [...allNames]
    .filter((name) => !botNames.has(name))
    .map((name) => ({
      name,
      commits: commitCounts.get(name) ?? 0,
      prs: prCounts.get(name) ?? 0,
    }));

  contributors.sort((a, b) => b.commits + b.prs - (a.commits + a.prs));
  return contributors.slice(0, 15);
}

function getCommitsThisMonth(): number {
  const now = new Date();
  const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const raw = run(`git log --since="${firstOfMonth}" --oneline --no-merges`);
  return raw ? raw.split("\n").filter(Boolean).length : 0;
}

function getActiveContributorsThisMonth(): number {
  const now = new Date();
  const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const raw = run(`git log --since="${firstOfMonth}" --format="%an" --no-merges`);
  if (!raw) return 0;
  return new Set(raw.split("\n").filter(Boolean)).size;
}

// ─── GitHub PR Data (全件ページネーション) ────────────────

interface PrData {
  number: number;
  title: string;
  author: { login: string };
  state: string;
  createdAt: string;
  mergedAt: string | null;
}

function getPullRequests() {
  const allPrs: PrData[] = [];

  const raw = run("gh pr list --state all --limit 500 --json number,title,author,state,createdAt,mergedAt", 60_000);
  if (raw) {
    try {
      allPrs.push(...JSON.parse(raw));
    } catch {
      // parse error
    }
  }

  console.log(`  Fetched ${allPrs.length} PRs total`);

  const all = allPrs.map((pr) => ({
    number: pr.number,
    title: pr.title,
    author: pr.author.login,
    state: pr.state as "OPEN" | "MERGED" | "CLOSED",
    createdAt: pr.createdAt,
  }));

  const byState = {
    open: allPrs.filter((p) => p.state === "OPEN").length,
    merged: allPrs.filter((p) => p.state === "MERGED").length,
    closed: allPrs.filter((p) => p.state === "CLOSED").length,
  };

  return { all, byState, total: allPrs.length };
}

// ─── Cloudflare Workers Deploys (cf-deploy-graph.sh 互換) ──

interface DeployData {
  total: number;
  weekly: Array<{ week: string; count: number }>;
  source: "cloudflare-workers" | "cloudflare-pages" | "pr-based";
}

function getPreviewDeploys(prTotal: number): DeployData {
  const accountId = process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const projectName = process.env.CF_PROJECT_NAME ?? "aegis-lab";

  if (!accountId || !apiToken) {
    console.log("  ℹ️  CF_ACCOUNT_ID / CLOUDFLARE_API_TOKEN not set. Using PR count as estimate.");
    return { total: prTotal, weekly: [], source: "pr-based" };
  }

  // ── Workers Versions API (cf-deploy-graph.sh の Workers セクションと同等) ──
  const workersResult = getWorkersVersions(accountId, apiToken, projectName);
  if (workersResult) return workersResult;

  // ── Pages Deployments API (フォールバック) ──
  const pagesResult = getPagesDeployments(accountId, apiToken, projectName);
  if (pagesResult) return pagesResult;

  console.log("  ⚠️  Cloudflare API failed. Using PR count as estimate.");
  return { total: prTotal, weekly: [], source: "pr-based" };
}

function getWorkersVersions(accountId: string, apiToken: string, projectName: string): DeployData | null {
  console.log("  Fetching Cloudflare Workers versions...");

  // ページネーションで全件取得 (cf-deploy-graph.sh と同じロジック)
  interface WorkerVersion {
    created_on?: string;
    metadata?: { created_on?: string };
    annotations?: Record<string, string>;
  }

  const allItems: WorkerVersion[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const raw = run(
      `curl -s "https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${projectName}/versions?per_page=${perPage}&page=${page}" -H "Authorization: Bearer ${apiToken}"`,
      60_000,
    );
    if (!raw) break;

    try {
      const response = JSON.parse(raw);
      if (!response.success) break;

      const items: WorkerVersion[] = Array.isArray(response.result) ? response.result : (response.result?.items ?? []);
      if (items.length === 0) break;

      allItems.push(...items);
      const totalCount = response.result_info?.total_count ?? 0;
      console.log(`    Fetched ${allItems.length} / ${totalCount || "?"} items...`);

      if (totalCount > 0 && allItems.length >= totalCount) break;
    } catch {
      break;
    }

    page++;
    if (page > 50) break;
  }

  if (allItems.length === 0) return null;

  // PR デプロイのみフィルタ (workers/alias があるもの = PR deploy)
  const prDeploys = allItems.filter((item) => item.annotations?.["workers/alias"] != null);
  console.log(`    PR Deployments: ${prDeploys.length} / ${allItems.length} total`);

  const weekCounts = new Map<string, number>();
  for (const deploy of prDeploys) {
    const dateStr = deploy.metadata?.created_on ?? deploy.created_on;
    if (!dateStr) continue;
    const week = toWeekKey(dateStr);
    weekCounts.set(week, (weekCounts.get(week) ?? 0) + 1);
  }

  const weekly = [...weekCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([week, count]) => ({ week: weekKeyToDisplay(week), count }));

  return { total: prDeploys.length, weekly, source: "cloudflare-workers" };
}

function getPagesDeployments(accountId: string, apiToken: string, projectName: string): DeployData | null {
  console.log("  Fetching Cloudflare Pages deployments...");

  const raw = run(
    `curl -s "https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments?per_page=100" -H "Authorization: Bearer ${apiToken}"`,
    60_000,
  );
  if (!raw) return null;

  try {
    const response = JSON.parse(raw);
    if (!response.success || !response.result) return null;

    const previews = response.result.filter((d: { environment: string }) => d.environment === "preview");

    const weekCounts = new Map<string, number>();
    for (const deploy of previews) {
      const week = toWeekKey(deploy.created_on);
      weekCounts.set(week, (weekCounts.get(week) ?? 0) + 1);
    }

    const weekly = [...weekCounts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([week, count]) => ({ week: weekKeyToDisplay(week), count }));

    return { total: previews.length, weekly, source: "cloudflare-pages" };
  } catch {
    return null;
  }
}

// ─── Sandbox Page Counting ───────────────────────────────

function countSubdirs(dirPath: string): string[] {
  try {
    return readdirSync(dirPath).filter((name) => {
      if (name.startsWith(".")) return false;
      try {
        return statSync(path.join(dirPath, name)).isDirectory();
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}

function getSandboxPages() {
  const services = ["loc", "dealon", "workon"];
  const byArea: Array<{ area: string; count: number }> = [];

  for (const svc of services) {
    const dirs = countSubdirs(path.join(SANDBOX_DIR, svc));
    byArea.push({ area: svc, count: dirs.length });
  }

  const topLevel = countSubdirs(SANDBOX_DIR);
  const excludeFromShared = new Set(["loc", "dealon", "workon", "users", "spec", "components"]);
  const sharedCount = topLevel.filter((d) => !excludeFromShared.has(d)).length;
  byArea.push({ area: "shared", count: sharedCount });

  const userDirs = countSubdirs(path.join(SANDBOX_DIR, "users"));
  const byUser: Array<{ user: string; count: number }> = [];

  for (const user of userDirs) {
    const userPages = countSubdirs(path.join(SANDBOX_DIR, "users", user));
    byUser.push({ user, count: userPages.length });
  }

  for (const svc of services) {
    const svcDirs = countSubdirs(path.join(SANDBOX_DIR, svc));
    for (const dir of svcDirs) {
      const subPages = countSubdirs(path.join(SANDBOX_DIR, svc, dir));
      if (subPages.length > 0) {
        const existing = byUser.find((u) => u.user === dir);
        if (existing) {
          existing.count += subPages.length;
        } else {
          byUser.push({ user: dir, count: subPages.length });
        }
      }
    }
  }

  byUser.sort((a, b) => b.count - a.count);

  const total = byArea.reduce((sum, a) => sum + a.count, 0) + byUser.reduce((sum, u) => sum + u.count, 0);

  return { byArea, byUser, total };
}

// ─── Main ────────────────────────────────────────────────

function main() {
  console.log("📊 Generating sandbox activity data...\n");

  const pullRequests = getPullRequests();
  console.log(
    `  PRs: ${pullRequests.total} (open: ${pullRequests.byState.open}, merged: ${pullRequests.byState.merged}, closed: ${pullRequests.byState.closed})`,
  );

  // PR コミットデータを1回取得し、weeklyCommits と contributors で共有
  const prNumbers = pullRequests.all.map((pr) => pr.number);
  const prCommitData = getPrCommitData(prNumbers);
  console.log(`  PR commit dates: ${prCommitData.commitDates.length}`);

  const weeklyCommits = getWeeklyCommits(prCommitData.commitDates);
  console.log(
    `  Weekly commits: ${weeklyCommits.length} weeks (total: ${weeklyCommits.reduce((s, w) => s + w.commits, 0)})`,
  );

  const contributors = getContributors(pullRequests.all, prCommitData.counts);
  console.log(`  Contributors: ${contributors.length}`);

  const commitsThisMonth = getCommitsThisMonth();
  console.log(`  Commits this month: ${commitsThisMonth}`);

  const activeContributors = getActiveContributorsThisMonth();
  console.log(`  Active contributors this month: ${activeContributors}`);

  const previewDeploys = getPreviewDeploys(pullRequests.total);
  console.log(`  Preview deploys: ${previewDeploys.total} (source: ${previewDeploys.source})`);

  const sandboxPages = getSandboxPages();
  console.log(`  Sandbox pages: ${sandboxPages.total}`);

  const data = {
    generatedAt: new Date().toISOString(),
    weeklyCommits,
    contributors,
    pullRequests,
    previewDeploys,
    sandboxPages,
    kpis: {
      totalPages: sandboxPages.total,
      commitsThisMonth,
      activeContributors,
      totalPrs: pullRequests.total,
      previewDeploys: previewDeploys.total,
    },
  };

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  console.log(`\n✅ Written to ${path.relative(ROOT, OUTPUT_PATH)}`);
}

main();
