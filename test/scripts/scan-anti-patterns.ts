/**
 * Anti-pattern スキャンスクリプト
 *
 * 対象ディレクトリ内の TSX ファイルをスキャンし、一般的なアンチパターンを検出する。
 *
 * Usage:
 *   tsx scripts/scan-anti-patterns.ts [target-dir]
 *   tsx scripts/scan-anti-patterns.ts lib/loc-app/
 *   tsx scripts/scan-anti-patterns.ts src/pages/sandbox/
 *
 * デフォルト: src/pages/ をスキャン
 */

import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { glob } from "glob";
import { scanAntiPatterns } from "./scan-anti-patterns.helpers";

const ROOT = join(import.meta.dirname, "..");

// ---- Main ----

async function main(): Promise<void> {
  const findings = [];
  const targetDir = process.argv[2] || "src/pages/";
  const absoluteTarget = join(ROOT, targetDir);

  // Verify directory exists
  try {
    statSync(absoluteTarget);
  } catch {
    console.error(`Error: Directory "${targetDir}" does not exist`);
    process.exit(1);
  }

  console.log(`Scanning: ${targetDir}`);
  console.log("---");

  const files = await glob("**/*.{tsx,ts}", {
    cwd: absoluteTarget,
    absolute: true,
    ignore: ["**/node_modules/**", "**/*.test.*", "**/*.d.ts"],
  });

  console.log(`Found ${files.length} files\n`);

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    findings.push(...scanAntiPatterns(content, file, ROOT));
  }

  // ---- Report ----
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warning");
  const infos = findings.filter((f) => f.severity === "info");

  console.log("## Anti-pattern Scan Results\n");
  console.log(`| 項目 | 件数 |`);
  console.log(`|---|---|`);
  console.log(`| 対象ファイル | ${files.length} |`);
  console.log(`| Error | ${errors.length} |`);
  console.log(`| Warning | ${warnings.length} |`);
  console.log(`| Info | ${infos.length} |`);
  console.log(`| **合計** | **${findings.length}** |`);

  // Group by rule
  const byRule = new Map<string, Finding[]>();
  for (const f of findings) {
    const list = byRule.get(f.rule) || [];
    list.push(f);
    byRule.set(f.rule, list);
  }

  console.log("\n### By Rule\n");
  console.log("| Rule | Count | Severity |");
  console.log("|---|---|---|");
  for (const [rule, items] of [...byRule.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`| ${rule} | ${items.length} | ${items[0].severity} |`);
  }

  // Show top findings
  if (errors.length > 0) {
    console.log("\n### Errors (top 10)\n");
    for (const f of errors.slice(0, 10)) {
      console.log(`- **${f.file}:${f.line}** [${f.rule}] ${f.message}`);
    }
  }

  if (warnings.length > 0) {
    console.log("\n### Warnings (top 20)\n");
    for (const f of warnings.slice(0, 20)) {
      console.log(`- **${f.file}:${f.line}** [${f.rule}] ${f.message}`);
    }
  }
}

main().catch(console.error);
