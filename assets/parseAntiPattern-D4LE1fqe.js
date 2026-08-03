var e=`import type { AntiPatternCategory, AntiPatternMeta, AntiPatternSeverity } from "../types";

const SEVERITIES: AntiPatternSeverity[] = ["error", "warning", "info"];
const CATEGORIES: AntiPatternCategory[] = ["accessibility", "composition", "styling", "usage"];

const isSeverity = (value: string): value is AntiPatternSeverity => (SEVERITIES as string[]).includes(value);
const isCategory = (value: string): value is AntiPatternCategory => (CATEGORIES as string[]).includes(value);

interface ParseResult {
  meta: Omit<AntiPatternMeta, "path">;
}

export const parseAntiPattern = (raw: string): ParseResult | null => {
  const match = raw.match(/^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)$/);
  if (!match) return null;

  const frontmatter: Record<string, string> = {};
  for (const line of match[1].split("\\n")) {
    const kv = line.match(/^([\\w-]+):\\s*(.*)$/);
    if (!kv) continue;
    const value = kv[2].trim().replace(/^["']|["']$/g, "");
    frontmatter[kv[1]] = value;
  }

  const body = match[2].trim();
  const titleMatch = body.match(/^#\\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : (frontmatter.id ?? "Untitled");

  const severity = isSeverity(frontmatter.severity) ? frontmatter.severity : "warning";
  const category = isCategory(frontmatter.category) ? frontmatter.category : "usage";

  return {
    meta: {
      id: frontmatter.id ?? "",
      component: frontmatter.component ?? "General",
      category,
      severity,
      title,
      eslintRule: frontmatter.eslint_rule || undefined,
      wcag: frontmatter.wcag || undefined,
      body,
    },
  };
};
`;export{e as default};