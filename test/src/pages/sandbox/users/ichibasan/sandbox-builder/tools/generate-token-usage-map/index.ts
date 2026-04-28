/**
 * generate-token-usage-map
 *
 * Aegis の style.css と *.module.css.js を解析し、
 * 「どのセマンティックトークンがどのコンポーネントで使われているか」を JSON に出力する。
 *
 * Usage (run from repo root):
 *   npx tsx src/pages/sandbox/users/ichibasan/sandbox-builder/tools/generate-token-usage-map/index.ts > \
 *     src/pages/sandbox/users/ichibasan/sandbox-builder/token-overrides/token-usage-map.json
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const AEGIS_DIST = path.resolve("node_modules/@legalforce/aegis-react/dist");
const COMPONENTS_DIR = path.join(AEGIS_DIST, "components");
const STYLE_CSS_PATH = path.join(AEGIS_DIST, "style.css");

// ─── Step 1: classPrefix → componentName ─────────────────────────────────────
//
// Aegis uses two CSS module class name formats:
//   Old: "aegis--_{hash}_{localName}"  (e.g. Button)
//   New: "aegis-{hash}_{localName}"    (e.g. Card, Tag, DataTable, …)
//
// Strategy: read the first quoted class value from each *.module.css.js,
// strip the trailing `_{localName}` segment to get the module prefix,
// and use that prefix as the lookup key when scanning style.css.

const prefixToComponent = new Map<string, string>();

const componentDirs = await readdir(COMPONENTS_DIR, { withFileTypes: true });

for (const entry of componentDirs) {
  if (!entry.isDirectory()) continue;
  const componentName = entry.name;
  // Skip internal helpers (_Slot, _Field, etc.)
  if (componentName.startsWith("_")) continue;

  const dir = path.join(COMPONENTS_DIR, componentName);
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    continue;
  }

  for (const file of files) {
    if (!file.endsWith(".module.css.js")) continue;
    const content = await readFile(path.join(dir, file), "utf-8");
    // Extract any aegis class from the JS source, e.g. "aegis-cgiRgW_component"
    const match = content.match(/"(aegis[A-Za-z0-9_-]+)"/);
    if (!match) continue;
    const fullClass = match[1];
    // Prefix = everything up to and including the last '_' separator
    // e.g. "aegis-cgiRgW_component" → "aegis-cgiRgW_"
    const lastUnderscore = fullClass.lastIndexOf("_");
    if (lastUnderscore < 0) continue;
    const prefix = fullClass.slice(0, lastUnderscore + 1);
    prefixToComponent.set(prefix, componentName);
  }
}

// ─── Step 2: scan style.css for var(--aegis-color-*) ─────────────────────────

const styleCss = await readFile(STYLE_CSS_PATH, "utf-8");

const tokenUsageMap: Record<string, Set<string>> = {};

/** Resolve a CSS class token (e.g. "aegis-cgiRgW_header") to a component name. */
const resolveClass = (cls: string): string | undefined => {
  const lastUnderscore = cls.lastIndexOf("_");
  if (lastUnderscore < 0) return undefined;
  const prefix = cls.slice(0, lastUnderscore + 1);
  return prefixToComponent.get(prefix);
};

for (const ruleMatch of styleCss.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
  const selector = ruleMatch[1].trim();
  const declarations = ruleMatch[2];

  // Find the first aegis class in the selector and resolve it to a component
  const classTokens = selector.match(/aegis[A-Za-z0-9_-]*/g);
  if (!classTokens) continue;

  let componentName: string | undefined;
  for (const cls of classTokens) {
    componentName = resolveClass(cls);
    if (componentName) break;
  }
  if (!componentName) continue;

  // Find all var(--aegis-color-*) references in declarations
  for (const varMatch of declarations.matchAll(/var\(--aegis-color-([a-zA-Z0-9-]+)\)/g)) {
    const tokenKey = `--aegis-color-${varMatch[1]}`;
    if (!tokenUsageMap[tokenKey]) {
      tokenUsageMap[tokenKey] = new Set();
    }
    tokenUsageMap[tokenKey].add(componentName);
  }
}

// ─── Step 3: serialize ────────────────────────────────────────────────────────

const output: Record<string, string[]> = {};
for (const [token, components] of Object.entries(tokenUsageMap)) {
  output[token] = [...components].sort();
}

process.stdout.write(JSON.stringify(output, null, 2));
process.stdout.write("\n");
