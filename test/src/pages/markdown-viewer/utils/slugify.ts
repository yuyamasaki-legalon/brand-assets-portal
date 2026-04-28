/**
 * Strip markdown inline syntax to produce plain text.
 *
 * - `![alt](url)` → `alt`
 * - `[text](url)` → `text`
 * - `` `code` `` → `code`
 * - `*`, `_`, `~` → removed
 * - remaining `[`, `]` → removed
 */
export function stripMarkdownInline(text: string): string {
  return (
    text
      // images: ![alt](url) → alt
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      // links: [text](url) → text
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // inline code
      .replace(/`([^`]*)`/g, "$1")
      // bold / italic / strikethrough markers
      .replace(/[*_~]/g, "")
      // leftover brackets
      .replace(/[[\]]/g, "")
      .trim()
  );
}

/**
 * Convert heading text to a URL-safe slug for anchor IDs.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u3000-\u9FFF\uF900-\uFAFF-]/g, "")
    .replace(/[\s\u3000]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Create a stateful slugger that deduplicates identical slugs.
 *
 * First occurrence returns the base slug, subsequent occurrences
 * append `-1`, `-2`, etc.
 */
export function createSlugger(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}
