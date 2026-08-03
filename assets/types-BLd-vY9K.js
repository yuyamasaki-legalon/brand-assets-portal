var e=`export type AntiPatternSeverity = "error" | "warning" | "info";
export type AntiPatternCategory = "accessibility" | "composition" | "styling" | "usage";

export interface AntiPatternMeta {
  id: string;
  component: string;
  category: AntiPatternCategory;
  severity: AntiPatternSeverity;
  title: string;
  eslintRule?: string;
  wcag?: string;
  /** Public path under /docs/anti-patterns used to load the markdown source. */
  path: string;
  /** Raw markdown body without frontmatter. */
  body: string;
}

export interface RecipeMeta {
  /** Slug (filename without extension). */
  slug: string;
  /** First H1 heading. */
  title: string;
  /** First paragraph after the H1 (used as a card summary). */
  description: string;
  /** Detected primary Aegis components (best-effort heuristic). */
  components: string[];
  /** Public path under /docs/aegis-recipes used to load the markdown source. */
  path: string;
  /** Raw markdown body. */
  body: string;
}
`;export{e as default};