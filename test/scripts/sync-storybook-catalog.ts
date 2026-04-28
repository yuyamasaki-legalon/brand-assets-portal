#!/usr/bin/env tsx

import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

type SyncTarget = {
  storyFile: string;
  storyPath: string;
  docPath: string;
};

const MARKER_START = "<!-- STORYBOOK_CATALOG_START -->";
const MARKER_END = "<!-- STORYBOOK_CATALOG_END -->";

const DEFAULT_STORY_DIR = "~/github/aegis/packages/react/stories";
const DEFAULT_DOC_DIR = "docs/rules/component";

const OVERRIDE_DOC_NAMES: Record<string, string> = {};

const resolvePath = (input: string): string => {
  if (input.startsWith("~")) {
    return path.resolve(path.join(os.homedir(), input.slice(1)));
  }
  return path.resolve(input);
};

const pathExists = async (targetPath: string): Promise<boolean> => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const getArgValue = (name: string, alias?: string): string | undefined => {
  const longIndex = process.argv.indexOf(`--${name}`);
  if (longIndex !== -1) {
    return process.argv[longIndex + 1];
  }

  if (alias) {
    const shortIndex = process.argv.indexOf(`-${alias}`);
    if (shortIndex !== -1) {
      return process.argv[shortIndex + 1];
    }
  }

  return undefined;
};

const hasFlag = (name: string, alias?: string): boolean => {
  return process.argv.includes(`--${name}`) || (alias ? process.argv.includes(`-${alias}`) : false);
};

const skipToEndOfBlock = (lines: string[], start: number): number => {
  let braceDepth = 0;
  let parenDepth = 0;
  let started = false;
  let i = start;

  while (i < lines.length) {
    for (const ch of lines[i]) {
      if (ch === "(") parenDepth++;
      if (ch === ")") parenDepth--;
      if (parenDepth === 0 && ch === "{") {
        braceDepth++;
        started = true;
      }
      if (parenDepth === 0 && ch === "}") {
        braceDepth--;
      }
    }
    i++;
    if (started && braceDepth <= 0) break;
  }

  return i;
};

const cleanStoryCode = (code: string): string => {
  const lines = code.split("\n");
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    // Remove Cover story export
    if (/^\s*export\s+const\s+Cover[\s:=]/.test(lines[i])) {
      i = skipToEndOfBlock(lines, i);
      continue;
    }

    // Remove play property from story objects
    if (/^\s+play\s*:/.test(lines[i])) {
      i = skipToEndOfBlock(lines, i);
      continue;
    }

    result.push(lines[i]);
    i++;
  }

  return result.join("\n").replace(/\n{3,}/g, "\n\n");
};

const buildCatalogBlock = (storyCode: string): string => {
  const cleaned = cleanStoryCode(storyCode);
  return `${MARKER_START}\n\`\`\`tsx\n${cleaned.trimEnd()}\n\`\`\`\n${MARKER_END}`;
};

const injectCatalog = (docContent: string, catalogBlock: string): string => {
  const labeledBlock = `## カタログ（Storybook）\n${catalogBlock}\n`;

  if (docContent.includes(MARKER_START) && docContent.includes(MARKER_END)) {
    const pattern = new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`, "m");
    return docContent.replace(pattern, catalogBlock);
  }

  return `${docContent.trimEnd()}\n\n---\n${labeledBlock}`;
};

const findStoryDir = async (baseDir: string): Promise<string> => {
  const entries = await fs.readdir(baseDir, { withFileTypes: true });
  const hasStoryFile = entries.some((entry) => entry.isFile() && entry.name.endsWith(".stories.tsx"));
  if (hasStoryFile) return baseDir;

  const componentsDir = entries.find((entry) => entry.isDirectory() && entry.name === "components");
  if (componentsDir) {
    return path.join(baseDir, componentsDir.name);
  }

  return baseDir;
};

const collectTargets = async (storyDir: string, docDir: string, picks?: string[]): Promise<SyncTarget[]> => {
  const resolvedStoryDir = await findStoryDir(storyDir);
  const storyEntries = await fs.readdir(resolvedStoryDir);
  const targets: SyncTarget[] = [];

  for (const entry of storyEntries) {
    if (!entry.endsWith(".stories.tsx")) continue;
    const baseName = path.basename(entry, ".stories.tsx");

    if (picks && !picks.includes(baseName)) continue;

    const docFileName = OVERRIDE_DOC_NAMES[baseName] ?? `${baseName}.md`;
    const storyPath = path.join(resolvedStoryDir, entry);
    const docPath = path.join(docDir, docFileName);

    targets.push({ storyFile: entry, storyPath, docPath });
  }

  return targets;
};

const syncCatalog = async ({
  storyDir,
  docDir,
  components,
  dryRun,
}: {
  storyDir: string;
  docDir: string;
  components?: string[];
  dryRun: boolean;
}): Promise<void> => {
  const targets = await collectTargets(storyDir, docDir, components);

  if (targets.length === 0) {
    console.warn("No storybook files found with the current filters.");
    return;
  }

  const updated: string[] = [];
  const missingDocs: string[] = [];

  for (const target of targets) {
    const docExists = await pathExists(target.docPath);
    if (!docExists) {
      missingDocs.push(`${path.basename(target.storyFile)} -> ${path.basename(target.docPath)}`);
      continue;
    }

    const [storyCode, docContent] = await Promise.all([
      fs.readFile(target.storyPath, "utf8"),
      fs.readFile(target.docPath, "utf8"),
    ]);

    const nextDoc = injectCatalog(docContent, buildCatalogBlock(storyCode));

    if (!dryRun) {
      await fs.writeFile(target.docPath, nextDoc, "utf8");
    }

    updated.push(`${path.basename(target.docPath)} <= ${path.basename(target.storyFile)}`);
  }

  console.log(`Story dir: ${storyDir}`);
  console.log(`Doc dir:   ${docDir}`);
  console.log(`Dry run:   ${dryRun ? "enabled" : "disabled"}`);
  console.log("");

  if (updated.length > 0) {
    console.log("Updated:");
    for (const line of updated) {
      console.log(`  - ${line}`);
    }
  }

  if (missingDocs.length > 0) {
    console.log("\nSkipped (doc not found):");
    for (const line of missingDocs) {
      console.log(`  - ${line}`);
    }
  }
};

const main = async () => {
  const storyDir = resolvePath(getArgValue("stories", "s") ?? DEFAULT_STORY_DIR);
  const docDir = resolvePath(getArgValue("docs", "d") ?? DEFAULT_DOC_DIR);
  const dryRun = hasFlag("dry-run");

  const componentArg = getArgValue("component", "c");
  const components = componentArg
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const storyDirExists = await pathExists(storyDir);
  if (!storyDirExists) {
    console.error(`Story directory not found: ${storyDir}`);
    process.exit(1);
  }

  const docDirExists = await pathExists(docDir);
  if (!docDirExists) {
    console.error(`Doc directory not found: ${docDir}`);
    process.exit(1);
  }

  await syncCatalog({ storyDir, docDir, components, dryRun });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
