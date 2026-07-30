var e=`import type { ColorFamily } from "../store/types";
import { isDisplayTone } from "../store/types";
import { resolveRefToCss, TOKEN_REFS } from "./contrast/resolve";
import { computeHex, oklchToHex } from "./oklch";
import { buildPrimaryScale } from "./primary";
import { buildNeutralAlphaMap, getNeutralAlphaOrigin } from "./transparent";

const toneHex = (tone: { lightness: number; chroma: number; hue: number; hex: string }): string =>
  tone.hex || computeHex(tone as Parameters<typeof computeHex>[0]);

// App BG tokens that Layer 3 overrides — skip in Layer 2 so Layer 3 value always wins.
const APP_BG_TOKEN_KEYS = new Set(["default", "input", "input-focused", "neutral-subtlest-opaque"]);

/**
 * Computes scoped CSS custom property overrides for the Palette Lab root container.
 *
 * Layer 1 — internal palette scale tokens:
 *   Neutral solid scale + all non-neutral family scales. These drive internal
 *   var() chains inside Aegis, but some Aegis builds set semantic tokens at
 *   startup without re-evaluating var() — hence Layer 2 below.
 *
 * Layer 2 — Aegis semantic tokens (foreground / border / background):
 *   Directly overrides --aegis-color-* so Portal components and any element
 *   that bypasses the internal scale chain also follows palette changes.
 *   Background tokens excluded here are re-set in Layer 3 via appBgLightness.
 *
 * Layer 3 — App BG overrides:
 *   background-default/input/input-focused/neutral-subtlest-opaque are pinned
 *   to the current App BG lightness so the preview reflects the design surface.
 */
export const computeRuntimeCssVars = (appBgLightness: number, families: ColorFamily[]): Record<string, string> => {
  const vars: Record<string, string> = {};

  const origin = getNeutralAlphaOrigin(appBgLightness);
  const appBgHex = oklchToHex(appBgLightness, 0, 0);
  const neutralFamily = families.find((f) => f.name.toLowerCase() === "neutral");
  const alphaMap = buildNeutralAlphaMap(neutralFamily, origin, appBgHex);

  // ── Layer 1a: Neutral solid scale ──────────────────────────────────────────
  if (neutralFamily) {
    for (const tone of neutralFamily.tones) {
      if (isDisplayTone(tone.value)) {
        vars[\`--aegis-internal-color-palette-scale-neutral-\${tone.value}\`] = toneHex(tone);
      }
    }
  }

  // ── Layer 1a-2: Neutral-transparent internal vars ─────────────────────────
  // Iterate the neutral family's actual tones so new tones (e.g. 450) are picked up automatically.
  if (neutralFamily) {
    for (const tone of neutralFamily.tones) {
      if (!isDisplayTone(tone.value)) continue;
      const css = resolveRefToCss(\`scale.neutral-transparent.\${tone.value}\`, families, origin, appBgHex);
      if (css !== null) vars[\`--aegis-internal-color-palette-scale-neutral-transparent-\${tone.value}\`] = css;
    }
  }
  vars["--palette-lab-invalid-zone-texture-color"] =
    vars["--aegis-internal-color-palette-scale-neutral-transparent-300"] ?? "rgba(0,0,0,0.2)";

  // ── Layer 1b: Scale + primary tokens for all non-neutral families ────────
  for (const family of families) {
    if (family.name.toLowerCase() === "neutral") continue;
    const name = family.name.toLowerCase();
    const primaryScaleMap = new Map(buildPrimaryScale(family, alphaMap).map((e) => [e.value, e.oklch]));
    for (const tone of family.tones) {
      if (isDisplayTone(tone.value)) {
        vars[\`--aegis-internal-color-palette-scale-\${name}-\${tone.value}\`] = toneHex(tone);
        const primaryOklch = primaryScaleMap.get(tone.value);
        if (primaryOklch !== undefined) {
          vars[\`--aegis-internal-color-palette-primary-\${name}-\${tone.value}\`] = primaryOklch;
        }
      }
    }
  }

  // ── Layer 2: Aegis semantic tokens ───────────────────────────────────────
  for (const [key, ref] of Object.entries(TOKEN_REFS.foreground)) {
    const css = resolveRefToCss(ref, families, origin, appBgHex);
    if (css !== null) vars[\`--aegis-color-foreground-\${key}\`] = css;
  }
  for (const [key, ref] of Object.entries(TOKEN_REFS.border)) {
    const css = resolveRefToCss(ref, families, origin, appBgHex);
    if (css !== null) vars[\`--aegis-color-border-\${key}\`] = css;
  }
  for (const [key, ref] of Object.entries(TOKEN_REFS.background)) {
    if (APP_BG_TOKEN_KEYS.has(key)) continue;
    const css = resolveRefToCss(ref, families, origin, appBgHex);
    if (css !== null) vars[\`--aegis-color-background-\${key}\`] = css;
  }

  // ── Layer 3: App BG for white-1000-based tokens ───────────────────────────
  const appBgCss = \`oklch(\${appBgLightness}% 0 0)\`;
  vars["--aegis-color-background-default"] = appBgCss;
  vars["--aegis-color-background-input"] = appBgCss;
  vars["--aegis-color-background-input-focused"] = appBgCss;
  vars["--aegis-color-background-neutral-subtlest-opaque"] = appBgCss;

  return vars;
};
`;export{e as default};