import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { globSync } from "glob";

type RouteEntry = { routePath: string; filePath: string };

const SHA_PATTERN = /^[0-9a-f]{4,40}$/i;
// Reject characters forbidden by git-check-ref-format
// biome-ignore lint/suspicious/noControlCharactersInRegex: intentionally reject ASCII control chars per git-check-ref-format
const REF_PATTERN = /^(?!.*\.\.)(?!.*@\{)[^\x00-\x1f\x7f ~^:?*[\\\n]+$/;

const validateSha = (value: string): string => {
  if (value && !SHA_PATTERN.test(value)) {
    throw new Error(`Invalid SHA format: ${value}`);
  }
  return value;
};

const validateRef = (value: string): string => {
  if (value && !REF_PATTERN.test(value)) {
    throw new Error(`Invalid ref format: ${value}`);
  }
  return value;
};

const baseSha = validateSha(process.env.BASE_SHA ?? "");
const headSha = validateSha(process.env.HEAD_SHA ?? "");
const baseRef = validateRef(process.env.BASE_REF ?? "");
const changedFilesEnv = process.env.CHANGED_FILES ?? "";
const previewUrl = process.env.PREVIEW_URL ?? "";
const aliasUrl = process.env.ALIAS_URL ?? "";
const projectAliasUrlsEnv = process.env.PROJECT_ALIAS_URLS ?? "";
const outputPath = process.env.GITHUB_OUTPUT ?? "";

const parseProjectAliasUrls = (raw: string): string[] => {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((entry) => String(entry)).filter((entry) => entry.length > 0);
    }
  } catch {
    // fall through to empty list
  }
  return [];
};

const projectAliasUrls = parseProjectAliasUrls(projectAliasUrlsEnv);

const routeEntries: RouteEntry[] = [];

const routeFiles = globSync("src/pages/**/routes.tsx", {
  ignore: ["**/node_modules/**"],
  nodir: true,
});

const routeMapRegex = /"([^"]+)"\s*:\s*"(src\/pages\/[^"]+)"/g;
const routeObjectRegex = /{[^}]*path:\s*"([^"]+)"[^}]*filePath:\s*"([^"]+)"[^}]*}/g;

for (const filePath of routeFiles) {
  const content = readFileSync(filePath, "utf8");

  for (const match of content.matchAll(routeMapRegex)) {
    const routePath = match[1];
    const routeFilePath = match[2];
    routeEntries.push({ routePath, filePath: routeFilePath });
  }

  for (const match of content.matchAll(routeObjectRegex)) {
    const routePath = match[1];
    const routeFilePath = match[2];
    routeEntries.push({ routePath, filePath: routeFilePath });
  }
}

const sanitizeUrl = (value: string) => value.replace(/\/+$/, "");

const buildChangedFiles = (): string[] => {
  if (!baseSha || !headSha) {
    return [];
  }
  try {
    const output = execSync(`git diff --name-only --diff-filter=AMCR ${baseSha} ${headSha}`, {
      encoding: "utf8",
    });
    return output
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  } catch {
    if (!baseRef) {
      return [];
    }
    try {
      const output = execSync(`git diff --name-only --diff-filter=AMCR ${baseRef} ${headSha}`, {
        encoding: "utf8",
      });
      return output
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    } catch {
      return [];
    }
  }
};

const changedFiles = (() => {
  if (changedFilesEnv) {
    try {
      const parsed = JSON.parse(changedFilesEnv);
      if (Array.isArray(parsed)) {
        return parsed.map((entry) => String(entry));
      }
    } catch {
      // fall back to git diff
    }
  }
  return buildChangedFiles();
})();
const normalizedChangedFiles = new Set(changedFiles.map((filePath) => filePath.replace(/\\/g, "/")));

const matchRoutes = (files: Set<string>, entries: RouteEntry[]): string[] => {
  const matched = new Set<string>();

  for (const entry of entries) {
    const filePath = entry.filePath.replace(/\\/g, "/");
    if (files.has(filePath)) {
      matched.add(entry.routePath);
      continue;
    }

    const directory = path.posix.dirname(filePath);
    for (const changedFile of files) {
      if (changedFile.startsWith(`${directory}/`)) {
        matched.add(entry.routePath);
        break;
      }
    }
  }

  return [...matched].sort();
};

const replaceRouteParams = (routePath: string) => routePath.replace(/:([^/]+)/g, (_match, name) => `sample-${name}`);

const matchedRoutes = matchRoutes(normalizedChangedFiles, routeEntries);
const leafRoutes = matchedRoutes.filter((routePath) => {
  const prefix = routePath === "/" ? "/" : `${routePath}/`;
  return !matchedRoutes.some((candidate) => candidate !== routePath && candidate.startsWith(prefix));
});
const baseUrl = sanitizeUrl(aliasUrl || previewUrl);

const buildRouteLinks = (routes: string[], base: string): string[] => {
  if (!base) {
    return [];
  }
  return routes.map((routePath) => `${base}${replaceRouteParams(routePath)}`);
};

const routeLinks = buildRouteLinks(leafRoutes, baseUrl);
const projectRouteLinksByBase = projectAliasUrls.map((projectBase) => ({
  base: sanitizeUrl(projectBase),
  links: buildRouteLinks(leafRoutes, sanitizeUrl(projectBase)),
}));

// Check PRD status for changed sandbox pages
const checkPrdStatus = (
  routes: string[],
  entries: RouteEntry[],
): { route: string; hasPrd: boolean; hasSpec: boolean }[] => {
  const results: { route: string; hasPrd: boolean; hasSpec: boolean }[] = [];

  for (const routePath of routes) {
    const entry = entries.find((e) => e.routePath === routePath);
    if (!entry) continue;

    const directory = path.posix.dirname(entry.filePath);
    const hasPrd =
      existsSync(path.join(directory, "auto-generated-prd.md")) || existsSync(path.join(directory, "PRD.md"));
    const hasSpec = existsSync(path.join(directory, "SPEC.md"));

    results.push({ route: routePath, hasPrd, hasSpec });
  }

  return results;
};

const buildPrdStatusMarkdown = (statuses: { route: string; hasPrd: boolean; hasSpec: boolean }[]): string => {
  if (statuses.length === 0) return "";

  const sandboxStatuses = statuses.filter((s) => s.route.startsWith("/sandbox"));
  if (sandboxStatuses.length === 0) return "";

  const lines = sandboxStatuses.map((s) => {
    const prdBadge = s.hasPrd ? "PRD" : "No PRD";
    const specBadge = s.hasSpec ? " | SPEC" : "";
    return `- ${s.route}: ${prdBadge}${specBadge}`;
  });

  return `\n**PRD Status:**\n${lines.join("\n")}\n`;
};

const formatLinkList = (links: string[]): string => {
  return links.length === 1 ? links[0] : links.map((link) => `- ${link}`).join("\n");
};

const buildProjectLinksSection = (entries: { base: string; links: string[] }[]): string => {
  const populated = entries.filter((entry) => entry.links.length > 0);
  if (populated.length === 0) {
    return "";
  }
  const body = populated.map((entry) => `**${entry.base}**\n${formatLinkList(entry.links)}`).join("\n\n");
  return `**Project-fixed Page URL(s):**\n${body}\n\n`;
};

const buildMarkdown = (links: string[], projectEntries: { base: string; links: string[] }[]): string => {
  const projectSection = buildProjectLinksSection(projectEntries);
  if (links.length === 0 && !projectSection) {
    return "";
  }
  const prdStatuses = checkPrdStatus(leafRoutes, routeEntries);
  const prdSection = buildPrdStatusMarkdown(prdStatuses);
  if (links.length === 0) {
    return `${projectSection}${prdSection}`;
  }
  const prSection = `**Added/Updated Page URL(s):**\n${formatLinkList(links)}\n`;
  return `${projectSection}${prSection}${prdSection}`;
};

const markdown = buildMarkdown(routeLinks, projectRouteLinksByBase);

const writeOutput = (key: string, value: string) => {
  if (!outputPath) {
    return;
  }
  if (!existsSync(outputPath)) {
    return;
  }
  const safeValue = value ?? "";
  if (safeValue.includes("\n")) {
    const delimiter = randomBytes(16).toString("hex");
    const block = `${key}<<${delimiter}\n${safeValue}\n${delimiter}\n`;
    appendFileSync(outputPath, block);
  } else {
    const line = `${key}=${safeValue}\n`;
    appendFileSync(outputPath, line);
  }
};

writeOutput("changed-routes-markdown", markdown);
writeOutput("changed-routes-count", String(routeLinks.length));
