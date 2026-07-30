var e=`import rawCss from "@legalforce/aegis-tokens/css/color-scheme-neutral-light.module.css?raw";

import type { DesignTokenOverrideCategory } from "../color/contrast/specs";

export type TokenData = Record<DesignTokenOverrideCategory, Record<string, string>>;

const INTERNAL_PREFIX = "--aegis-internal-color-palette-";

function parseInternalRef(varContent: string): string {
  if (!varContent.startsWith(INTERNAL_PREFIX)) return "";
  const key = varContent.slice(INTERNAL_PREFIX.length);

  // scale-(neutral|white)-transparent-N
  const transparentMatch = key.match(/^(scale-(?:neutral|white))-transparent-(\\d+)$/);
  if (transparentMatch) {
    const base = transparentMatch[1].replace("-", ".");
    return \`\${base}-transparent.\${transparentMatch[2]}\`;
  }

  if (key === "scale-transparent") return "scale.transparent";

  // scale-white-1000
  const whiteMatch = key.match(/^scale-white-(\\d+)$/);
  if (whiteMatch) return \`scale.white.\${whiteMatch[1]}\`;

  // primary-{color}-N
  const primaryMatch = key.match(/^primary-([a-z]+)-(\\d+)$/);
  if (primaryMatch) return \`primary.\${primaryMatch[1]}.\${primaryMatch[2]}\`;

  // scale-{color}-N (includes scale-neutral-N)
  const scaleMatch = key.match(/^scale-([a-z]+)-(\\d+)$/);
  if (scaleMatch) return \`scale.\${scaleMatch[1]}.\${scaleMatch[2]}\`;

  return "";
}

let _cached: TokenData | null = null;

export function parseAegisV2TokenRefs(): TokenData {
  if (_cached) return _cached;

  const result: TokenData = { background: {}, foreground: {}, border: {} };
  const re = /--aegis-color-(background|foreground|border)-([^:]+):\\s*var\\(([^)]+)\\)/g;

  for (const m of rawCss.matchAll(re)) {
    const category = m[1] as DesignTokenOverrideCategory;
    const token = m[2].trim();
    const ref = parseInternalRef(m[3].trim());
    if (ref) result[category][token] = ref;
  }

  _cached = result;
  return result;
}
`;export{e as default};