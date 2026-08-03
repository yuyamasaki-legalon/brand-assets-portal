var e=`import type { RecipeMeta } from "../types";

export interface ParsedRecipe {
  meta: Omit<RecipeMeta, "slug" | "path">;
}

const extractComponents = (body: string): string[] => {
  // Capture content under the "使うコンポーネント" section, up to the next "## " heading.
  const sectionMatch = body.match(/##\\s*使うコンポーネント\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)/);
  if (!sectionMatch) return [];

  const components: string[] = [];
  for (const line of sectionMatch[1].split("\\n")) {
    // Match list items like "- \`ComponentName\`" or "- \`A\`, \`B\`".
    const bullet = line.match(/^\\s*[-*]\\s+(.*)$/);
    if (!bullet) continue;
    const inline = bullet[1].matchAll(/\`([^\`]+)\`/g);
    for (const m of inline) {
      // Trim sub-component selectors and props to keep the family root.
      const name = m[1].replace(/^@[^/]+\\/[\\w-]+\\/?.*$/, "").trim();
      if (name && !components.includes(name)) components.push(name);
    }
  }
  return components;
};

export const parseRecipe = (raw: string): ParsedRecipe | null => {
  const trimmed = raw.replace(/^﻿/, "").trim();
  if (!trimmed) return null;

  const titleMatch = trimmed.match(/^#\\s+(.+?)\\s*$/m);
  if (!titleMatch) return null;
  const title = titleMatch[1].trim();

  // Description is the first paragraph after the H1 (concatenate lines until a blank line or a heading).
  const afterTitle = trimmed.slice((titleMatch.index ?? 0) + titleMatch[0].length);
  const paragraphLines: string[] = [];
  for (const line of afterTitle.split("\\n")) {
    const stripped = line.trim();
    if (stripped === "") {
      if (paragraphLines.length > 0) break;
      continue;
    }
    if (stripped.startsWith("#")) break;
    paragraphLines.push(stripped);
  }
  const description = paragraphLines
    .join(" ")
    .replace(/\`([^\`]+)\`/g, "$1")
    .replace(/\\s+/g, " ")
    .trim();

  return {
    meta: {
      title,
      description,
      components: extractComponents(trimmed),
      body: trimmed,
    },
  };
};
`;export{e as default};