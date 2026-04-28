/**
 * Anti-pattern カタログから index.json を自動生成するスクリプト
 *
 * Usage: tsx scripts/generate-anti-pattern-index.ts
 *
 * docs/anti-patterns/*.md の YAML frontmatter を解析し、
 * docs/anti-patterns/index.json を生成する。
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface AntiPatternEntry {
  id: string;
  component: string;
  category: string;
  severity: string;
  title: string;
  eslint_rule?: string;
  wcag?: string;
  file: string;
}

const ANTI_PATTERNS_DIR = join(import.meta.dirname, "..", "docs", "anti-patterns");

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    const value = line
      .slice(colonIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key && value) {
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function main(): void {
  const files = readdirSync(ANTI_PATTERNS_DIR)
    .filter((f) => f.endsWith(".md") && f.startsWith("AP-"))
    .sort();

  const entries: AntiPatternEntry[] = [];

  for (const file of files) {
    const content = readFileSync(join(ANTI_PATTERNS_DIR, file), "utf-8");
    const fm = parseFrontmatter(content);
    const title = extractTitle(content);

    if (!fm.id) {
      console.warn(`Skipping ${file}: missing id in frontmatter`);
      continue;
    }

    const entry: AntiPatternEntry = {
      id: fm.id,
      component: fm.component || "Unknown",
      category: fm.category || "unknown",
      severity: fm.severity || "warning",
      title,
      file,
    };

    if (fm.eslint_rule) entry.eslint_rule = fm.eslint_rule;
    if (fm.wcag) entry.wcag = fm.wcag;

    entries.push(entry);
  }

  const output = {
    $schema: "Anti-pattern catalog index for MCP server consumption",
    generated: new Date().toISOString(),
    count: entries.length,
    entries,
  };

  const outputPath = join(ANTI_PATTERNS_DIR, "index.json");
  writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`Generated ${outputPath} with ${entries.length} entries`);

  // Summary by component
  const byComponent = new Map<string, number>();
  for (const entry of entries) {
    byComponent.set(entry.component, (byComponent.get(entry.component) || 0) + 1);
  }
  console.log("\nBy component:");
  for (const [component, count] of [...byComponent.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${component}: ${count}`);
  }

  // Summary by severity
  const bySeverity = new Map<string, number>();
  for (const entry of entries) {
    bySeverity.set(entry.severity, (bySeverity.get(entry.severity) || 0) + 1);
  }
  console.log("\nBy severity:");
  for (const [severity, count] of [...bySeverity.entries()].sort()) {
    console.log(`  ${severity}: ${count}`);
  }
}

main();
