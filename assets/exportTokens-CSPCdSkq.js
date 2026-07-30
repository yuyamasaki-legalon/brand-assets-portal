var e=`import { oklchToHex } from "../color/oklch";
import { buildPrimaryScale } from "../color/primary";
import { buildNeutralAlphaMap, getNeutralAlphaOrigin } from "../color/transparent";
import type { PaletteProject, ToneEntry } from "../store/types";
import { toneLabel } from "../store/types";

const formatOklch = (tone: ToneEntry, alpha?: number): string => {
  const l = \`\${tone.lightness}%\`;
  const c = String(parseFloat(tone.chroma.toFixed(4)));
  const h = String(parseFloat(tone.hue.toFixed(2)));
  return alpha !== undefined && alpha < 1 ? \`oklch(\${l} \${c} \${h} / \${alpha})\` : \`oklch(\${l} \${c} \${h})\`;
};

/**
 * Export the project as a pre-computed \`palette.tokens.js\` ES module.
 *
 * Generates the same structure that production \`palette.tokens.js\` would produce
 * after running against a \`palette.json\` derived from this project:
 *
 *   export default {
 *     internal: {
 *       color: {
 *         palette: {
 *           $type: "color",
 *           scale: { ... },    ← raw tones + white/neutral transparent scales
 *           primary: { ... },  ← alpha-overlay scales per non-neutral family
 *         }
 *       }
 *     }
 *   };
 */
export const exportToPaletteTokensJs = (project: PaletteProject): string => {
  // ─── scale ────────────────────────────────────────────────────────────────

  const scale: Record<string, unknown> = {
    white: { 1000: { $value: "oklch(100% 0 0)", $deprecated: true } },
    transparent: { $value: "transparent", $deprecated: true },
  };

  // Raw palette tones — all families, output as oklch
  for (const family of project.colorFamilies) {
    const toneMap: Record<string, { $value: string }> = {};
    for (const tone of family.tones) {
      toneMap[toneLabel(tone.value)] = { $value: formatOklch(tone) };
    }
    scale[family.name] = toneMap;
  }

  const neutralFam = project.colorFamilies.find((f) => f.name.toLowerCase() === "neutral");
  const origin = getNeutralAlphaOrigin(project.appBgLightness);
  const appBgHex = oklchToHex(project.appBgLightness, 0, 0);
  const alphaMap = buildNeutralAlphaMap(neutralFam, origin, appBgHex);
  const neutralBaseL = origin === "white" ? "100%" : "0%";
  // inverse-transparent (legacy key: white-transparent): opposite base from neutral-transparent
  const inverseBaseL = origin === "white" ? "0%" : "100%";

  const inverseTransparent: Record<string, { $value: string }> = {};
  const neutralTransparent: Record<string, { $value: string }> = {};
  for (const [toneValue, alpha] of alphaMap) {
    inverseTransparent[String(toneValue)] = { $value: \`oklch(\${inverseBaseL} 0 0 / \${alpha})\` };
    neutralTransparent[String(toneValue)] = { $value: \`oklch(\${neutralBaseL} 0 0 / \${alpha})\` };
  }
  scale["white-transparent"] = inverseTransparent;
  scale["neutral-transparent"] = neutralTransparent;

  // ─── primary ──────────────────────────────────────────────────────────────

  // Non-neutral families with a primaryBaseTone set get a primary scale entry.
  // Each family uses its own base tone as the transparency source — "self color overlay system".
  const primary: Record<string, Record<string, { $value: string }>> = {};

  for (const family of project.colorFamilies) {
    if (family.name.toLowerCase() === "neutral") continue;
    if (family.primaryBaseTone === null) continue;

    const entries = buildPrimaryScale(family, alphaMap);
    if (entries.length === 0) continue;

    const primaryTones: Record<string, { $value: string }> = {};
    for (const entry of entries) {
      primaryTones[String(entry.value)] = { $value: entry.oklch };
    }
    primary[family.name] = primaryTones;
  }

  // ─── Final structure (mirrors production palette.tokens.js output) ────────

  const output = {
    internal: {
      color: {
        palette: {
          $type: "color",
          scale,
          primary,
        },
      },
    },
  };

  return \`export default \${JSON.stringify(output, null, 2)};\\n\`;
};
`;export{e as default};