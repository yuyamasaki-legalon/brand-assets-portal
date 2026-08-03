var e=`import { TOKEN_REFS } from "../color/contrast";
import type { DesignTokenOverrideCategory } from "../color/contrast/specs";
import type { TokenData } from "./parseAegisV2Css";

const CATEGORIES: DesignTokenOverrideCategory[] = ["background", "foreground", "border"];

function highlight(value: string): string {
  return \`\\\`\${value === "—" ? "--" : value}\\\`\`;
}

function buildTableRows(category: DesignTokenOverrideCategory, v2: TokenData, v3: TokenData | null): string[] {
  // Order: TOKEN_REFS keys first, then extras from v2/v3
  const seen = new Set<string>();
  const keys: string[] = [];

  for (const k of Object.keys(TOKEN_REFS[category] ?? {})) {
    if (!seen.has(k)) {
      seen.add(k);
      keys.push(k);
    }
  }
  for (const k of Object.keys(v2[category] ?? {})) {
    if (!seen.has(k)) {
      seen.add(k);
      keys.push(k);
    }
  }
  if (v3) {
    for (const k of Object.keys(v3[category] ?? {})) {
      if (!seen.has(k)) {
        seen.add(k);
        keys.push(k);
      }
    }
  }

  return keys.map((key) => {
    const v2Ref = v2[category]?.[key] ?? "—";
    const v3Ref = v3?.[category]?.[key] ?? "—";
    const plRef = (TOKEN_REFS[category] as Record<string, string>)[key] ?? "—";
    const hasDiff = v3 ? !(v2Ref === v3Ref && v3Ref === plRef) : v2Ref !== plRef;
    const v2Cell = hasDiff ? highlight(v2Ref) : v2Ref;
    const v3Cell = hasDiff ? highlight(v3Ref) : v3Ref;
    const plCell = hasDiff ? highlight(plRef) : plRef;
    return \`| \${key} | \${v2Cell} | \${v3Cell} | \${plCell} |\`;
  });
}

export function generateDesignTokensMarkdown(
  v2: TokenData,
  v3: TokenData | null,
  filter?: DesignTokenOverrideCategory,
): string {
  const cats = filter ? [filter] : CATEGORIES;
  return cats
    .map((cat) => {
      const label = cat.charAt(0).toUpperCase() + cat.slice(1);
      const rows = buildTableRows(cat, v2, v3);
      return [
        \`## \${label}\`,
        "",
        "| Token | Aegis v2 | Aegis v3 (figma) | Palette Lab |",
        "|-------|----------|-----------------|-------------|",
        ...rows,
        "",
      ].join("\\n");
    })
    .join("\\n");
}
`;export{e as default};