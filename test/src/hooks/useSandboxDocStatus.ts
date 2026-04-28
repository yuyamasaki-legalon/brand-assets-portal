/**
 * Discover which sandbox page directories contain PRD or SPEC markdown files.
 * Uses Vite's import.meta.glob with lazy loading — only the keys (file paths)
 * are used at runtime; the loader functions are never called.
 */

const prdFiles = import.meta.glob("/src/pages/sandbox/**/auto-generated-prd.md", { query: "?raw" });
const prdMdFiles = import.meta.glob("/src/pages/sandbox/**/PRD.md", { query: "?raw" });
const specFiles = import.meta.glob("/src/pages/sandbox/**/SPEC.md", { query: "?raw" });

/** Normalise a glob key to its directory (e.g. "/src/pages/sandbox/loc/.../PRD.md" → "src/pages/sandbox/loc/...") */
const dirOf = (globKey: string) => {
  const withoutLeadingSlash = globKey.replace(/^\//, "");
  return withoutLeadingSlash.replace(/\/[^/]+$/, "");
};

const prdDirs = new Set([...Object.keys(prdFiles).map(dirOf), ...Object.keys(prdMdFiles).map(dirOf)]);
const specDirs = new Set(Object.keys(specFiles).map(dirOf));

export interface SandboxDocStatus {
  hasPrd: boolean;
  hasSpec: boolean;
}

/**
 * Check whether a sandbox page directory contains a PRD and/or SPEC file.
 *
 * @param sandboxRoute - The route path, e.g. "/sandbox/loc/wataryooou/case-detail"
 * @returns Status flags for PRD and SPEC presence
 */
export const getSandboxDocStatus = (sandboxRoute: string): SandboxDocStatus => {
  // Convert route to directory path: "/sandbox/foo" -> "src/pages/sandbox/foo"
  const dir = `src/pages${sandboxRoute}`;
  return {
    hasPrd: prdDirs.has(dir),
    hasSpec: specDirs.has(dir),
  };
};
