/**
 * WCAG contrast checking utilities.
 *
 * SC 1.4.3 – Contrast (Minimum) AA:
 *   Normal text:  4.5:1
 *   Large text:   3:1 (18pt+, or 14pt+ bold)
 *
 * SC 1.4.11 – Non-text Contrast AA:
 *   UI components / graphical objects: 3:1 against adjacent color
 *   Exception: inactive/disabled components are exempt
 */

import { hexToRgb } from "./color-utils";
import type { ComponentOverrides, DesignTokenOverrideCategory, DesignTokenOverrides } from "./design-token-overrides";
import { DEFAULT_TOKEN_REFS } from "./design-token-overrides";
import paletteSource from "./palette.json";
import paletteConfigSource from "./palette-config.json";
import tokenUsageMap from "./token-usage-map.json";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RGB = [number, number, number];

export type ContrastCriterion = "text-normal" | "text-large" | "non-text";

export interface ContrastPairDef {
  id: string;
  label: string;
  criterion: ContrastCriterion;
  /** The "foreground" color token (text, icon, or border) */
  fg: { category: DesignTokenOverrideCategory; key: string };
  /** The background token this foreground appears against */
  bg: { category: "background"; key: string };
  /**
   * Optional page background behind the component container.
   * When set, the preview shows 3 layers (page → container → UI) and
   * transparent container backgrounds are composited over this color instead of white.
   */
  pageBg?: { category: "background"; key: string };
  description?: string;
  /** @deprecated Use `variant` + `state` instead. Kept for legacy global pairs. */
  stateLabel?: string;
  /** Variant label — first segment of the former stateLabel (e.g. "solid·neutral", "default"). */
  variant?: string;
  /** State label — second segment onwards (e.g. "default", "hovered (on pane fill)"). */
  state?: string;
  /**
   * Component this pair belongs to.
   * Used for filtering in ContrastCheckView (e.g. "TextField").
   * Omit for general / cross-component pairs.
   */
  component?: string;
  /**
   * Preview rendering hint.
   *
   * "internal" — Type A pair: pair.bg is the component's own surface background.
   *   Preview: outer = background-default (page), UI element = pair.bg, label = pair.fg.
   *
   * "container" (default when omitted) — Type B pair: pair.bg is the container background.
   *   Preview: outer = pageBg (or pair.bg), inner rect (if pageBg) = pair.bg, UI = pair.fg.
   */
  previewKind?: "internal" | "container";
}

// ─── Container backgrounds ────────────────────────────────────────────────────

/**
 * The full set of neutral/semantic backgrounds a component can be placed on.
 * Type-B (container visibility) checks expand against all of these.
 */
export const CONTAINER_BGS = [
  "neutral-xSubtle",
  "neutral-xSubtle-hovered",
  "neutral-xSubtle-pressed",
  "neutral-xSubtle-selected",
  "neutral-xSubtle-opaque",
  "neutral-subtle-opaque",
  "neutral-subtlest-opaque",
  "neutral-subtlest-opaque-hovered",
  "neutral-subtlest-opaque-pressed",
  "neutral-subtlest-opaque-selected",
  "danger-subtle",
] as const satisfies string[];

export type ContainerBgKey = (typeof CONTAINER_BGS)[number];

/**
 * Opaque backgrounds that represent the large Banner surface variants.
 * Inverse-colored content can be intentionally placed on these surfaces.
 */
export const BANNER_LARGE_PLACEMENT_BGS = [
  "information-bold",
  "success-bold",
  "danger-bold",
] as const satisfies string[];

/**
 * Map from container bg key → page bg key(s) to check against.
 *
 * All container backgrounds are checked against BOTH page contexts:
 *   - background-default             (standard page)
 *   - background-neutral-xSubtle-opaque  (pane fill variant)
 *
 * Transparent containers (neutral-xSubtle*) differ in rendered color between the two
 * page contexts. Opaque containers look identical on either page background, but both
 * pairs are emitted for completeness and consistent matrix coverage.
 */
const PAGE_CONTEXT: Readonly<Record<string, readonly string[]>> = {
  // transparent containers — rendered color differs by page bg
  "neutral-xSubtle": ["default", "neutral-xSubtle-opaque"],
  "neutral-xSubtle-hovered": ["default", "neutral-xSubtle-opaque"],
  "neutral-xSubtle-pressed": ["default", "neutral-xSubtle-opaque"],
  "neutral-xSubtle-selected": ["default", "neutral-xSubtle-opaque"],
  // opaque containers — rendered color is page-bg-independent,
  // but both contexts are emitted for consistent matrix coverage
  "neutral-xSubtle-opaque": ["default", "neutral-xSubtle-opaque"],
  "neutral-subtle-opaque": ["default", "neutral-xSubtle-opaque"],
  "neutral-subtlest-opaque": ["default", "neutral-xSubtle-opaque"],
  "neutral-subtlest-opaque-hovered": ["default", "neutral-xSubtle-opaque"],
  "neutral-subtlest-opaque-pressed": ["default", "neutral-xSubtle-opaque"],
  "neutral-subtlest-opaque-selected": ["default", "neutral-xSubtle-opaque"],
  "danger-subtle": ["default", "neutral-xSubtle-opaque"],
  "brand-bold": ["default"],
  "neutral-bold": ["default"],
  "information-bold": ["default"],
  "success-bold": ["default"],
  "danger-bold": ["default"],
  // default container — opaque white, page bg is irrelevant
  default: ["default"],
};

// ─── ComponentContrastSpec ────────────────────────────────────────────────────

/**
 * Type-A pair spec: component's own fg vs component's own bg (container-independent).
 * Example: Button label (foreground-inverse) vs button surface (background-brand-bold).
 */
export interface InternalPairSpec {
  stateLabel?: string;
  variant?: string;
  state?: string;
  fg: { category: DesignTokenOverrideCategory; key: string };
  bg: { category: "background"; key: string };
  criterion: ContrastCriterion;
  pageBgs?: readonly string[];
}

/**
 * Type-B pair spec: component's fg/border/bg vs each container background.
 * Example: button background vs neutral-xSubtle container.
 */
export interface ContainerPairSpec {
  stateLabel?: string;
  variant?: string;
  state?: string;
  fg: { category: DesignTokenOverrideCategory; key: string };
  criterion: ContrastCriterion;
  containerBgs?: readonly string[];
  /**
   * Component state variants to expand per container bg.
   *
   * When defined, one pair is generated per state × container bg.
   * If the container bg has a state suffix (-hovered/-pressed/-selected),
   * only the "default" state is emitted — the component stays in its default
   * visual state when the parent container is in an interaction state.
   *
   * When omitted, a single pair is generated per container bg using `fg`.
   */
  componentStates?: ReadonlyArray<{
    state: string;
    fg: { category: DesignTokenOverrideCategory; key: string };
  }>;
}

/**
 * Full spec for one component.
 * Pass to generateContrastPairs() to produce ContrastPairDef[].
 */
export interface ComponentContrastSpec {
  component: string;
  /**
   * Exhaustive list of parent backgrounds this component can actually be placed on.
   * containerPairs are expanded against these backgrounds only.
   * Defaults to CONTAINER_BGS when omitted, but defining it explicitly removes
   * irrelevant checks and catches placements the default set misses (e.g. background-default).
   */
  containerBgs?: readonly string[];
  /** Type A: fg vs own bg (same result regardless of container) */
  internalPairs?: InternalPairSpec[];
  /** Type B: fg vs each containerBgs entry (defaults to CONTAINER_BGS) */
  containerPairs?: ContainerPairSpec[];
}

// ─── Pair generator ───────────────────────────────────────────────────────────

const slugify = (s: string) => s.toLowerCase().replace(/[·\s/]+/g, "-");
const buildPairLabel = (variant?: string, state?: string) => [variant, state].filter(Boolean).join(" / ");

/**
 * Generate ContrastPairDef[] from a ComponentContrastSpec.
 *  - internalPairs  → 1 pair each  (Type A)
 *  - containerPairs → N pairs each (Type B, one per containerBgs entry)
 *
 * containerBgs resolution order:
 *   1. spec.containerBgs  — explicit per-component placement list (preferred)
 *   2. CONTAINER_BGS      — legacy fallback when containerBgs is omitted
 */
export const generateContrastPairs = (spec: ComponentContrastSpec): ContrastPairDef[] => {
  const { component } = spec;
  const pairs: ContrastPairDef[] = [];

  for (const entry of spec.internalPairs ?? []) {
    const fgLabel = `${entry.fg.category}-${entry.fg.key}`;
    const bgLabel = `${entry.bg.category}-${entry.bg.key}`;
    const entryLabel = entry.stateLabel ?? buildPairLabel(entry.variant, entry.state);
    const pageBgKeys = entry.pageBgs ? [...entry.pageBgs] : [undefined];
    for (const pageBgKey of pageBgKeys) {
      const paneLabel = pageBgKey ? ` (${pageBgKey})` : "";
      const pageBgSuffix = pageBgKey ? ` / background-${pageBgKey}` : "";
      pairs.push({
        id: `${component}/${slugify(entryLabel)}/internal${pageBgKey ? `/page-${pageBgKey}` : ""}`,
        label: `${fgLabel} / ${bgLabel}${pageBgSuffix}`,
        criterion: entry.criterion,
        fg: entry.fg,
        bg: entry.bg,
        description: `${component} — ${entryLabel}`,
        stateLabel: entryLabel + paneLabel,
        variant: entry.variant,
        state: entry.state,
        component,
        previewKind: "internal",
        ...(pageBgKey ? { pageBg: { category: "background" as const, key: pageBgKey } } : {}),
      });
    }
  }

  for (const entry of spec.containerPairs ?? []) {
    const entryLabel = entry.stateLabel ?? buildPairLabel(entry.variant, entry.state);
    const containerBgs = entry.containerBgs ?? spec.containerBgs ?? CONTAINER_BGS;

    for (const bgKey of containerBgs) {
      // When the container bg is itself in a state variant (hovered/pressed/selected),
      // the component stays in its default visual state — no interaction overlap.
      const containerHasState = bgKey.endsWith("-hovered") || bgKey.endsWith("-pressed") || bgKey.endsWith("-selected");

      const pageBgKeys = PAGE_CONTEXT[bgKey];
      // Expand by page backgrounds when defined; otherwise emit a single pair without a page bg
      const expansions: Array<string | undefined> = pageBgKeys ? [...pageBgKeys] : [undefined];

      if (entry.componentStates) {
        // Expanded path: one pair per component state × page bg
        const statesToEmit = containerHasState
          ? entry.componentStates.filter((s) => s.state === "default")
          : entry.componentStates;

        for (const cs of statesToEmit) {
          const fgLabel = `${cs.fg.category}-${cs.fg.key}`;
          const stateLabel = buildPairLabel(entry.variant, cs.state);
          for (const pageBgKey of expansions) {
            const paneLabel = pageBgKey && pageBgKey !== "default" ? " (on pane fill)" : "";
            const pageBgSuffix = pageBgKey ? ` / background-${pageBgKey}` : "";
            pairs.push({
              id: `${component}/${slugify(entryLabel)}/${cs.state}/bg-${bgKey}${pageBgKey ? `/page-${pageBgKey}` : ""}`,
              label: `${fgLabel} / background-${bgKey}${pageBgSuffix}`,
              criterion: entry.criterion,
              fg: cs.fg,
              bg: { category: "background", key: bgKey },
              description: `${component} — ${stateLabel}`,
              stateLabel: stateLabel + paneLabel,
              variant: entry.variant,
              state: cs.state,
              component,
              ...(pageBgKey ? { pageBg: { category: "background" as const, key: pageBgKey } } : {}),
            });
          }
        }
      } else {
        // Legacy path: single pair per container bg
        const fgLabel = `${entry.fg.category}-${entry.fg.key}`;
        for (const pageBgKey of expansions) {
          const paneLabel = pageBgKey && pageBgKey !== "default" ? " (on pane fill)" : "";
          const pageBgSuffix = pageBgKey ? ` / background-${pageBgKey}` : "";
          pairs.push({
            id: `${component}/${slugify(entryLabel)}/bg-${bgKey}${pageBgKey ? `/page-${pageBgKey}` : ""}`,
            label: `${fgLabel} / background-${bgKey}${pageBgSuffix}`,
            criterion: entry.criterion,
            fg: entry.fg,
            bg: { category: "background", key: bgKey },
            description: `${component} — ${entryLabel}`,
            stateLabel: entryLabel + paneLabel,
            variant: entry.variant,
            state: entry.state,
            component,
            ...(pageBgKey ? { pageBg: { category: "background" as const, key: pageBgKey } } : {}),
          });
        }
      }
    }
  }

  return pairs;
};

export interface ContrastResult {
  pair: ContrastPairDef;
  /** Resolved contrast ratio, or null if a color could not be resolved */
  ratio: number | null;
  fgRgb: RGB | null;
  /** Rendered bg RGB — transparent containers are already composited over pageBgRgb (or white). */
  bgRgb: RGB | null;
  /**
   * Resolved page background RGB for 3-layer preview.
   * undefined = no pageBg defined in pair; null = pageBg resolved to transparent.
   */
  pageBgRgb?: RGB | null;
  pass: boolean | null;
  threshold: number;
  /** Components that use the foreground token (from token-usage-map) */
  components: string[];
}

// ─── Palette data ─────────────────────────────────────────────────────────────

const TRANSPARENT_ALPHA: Record<number, number> = Object.fromEntries(
  (paletteConfigSource.transparentScales as [number, number][]).map(([tone, alpha]) => [tone, alpha]),
);
const PRIMARY_ALPHA: Record<number, number> = Object.fromEntries(
  (paletteConfigSource.primaryScales as [number, number][]).map(([tone, alpha]) => [tone, alpha]),
);

const PRIMARY_BASE_TONES: Record<string, number> = Object.fromEntries(
  Object.entries(paletteConfigSource.primaryBaseColors as Record<string, string>).map(([color, toneStr]) => [
    color,
    parseInt(toneStr, 10),
  ]),
);

const PALETTE = paletteSource as Record<string, Record<string, string>>;

// ─── Color utilities ──────────────────────────────────────────────────────────

const WHITE: RGB = [255, 255, 255];

/** Alpha-composite `fg` (with `alpha`) over an opaque `bg`. */
const compositeOver = (fg: RGB, alpha: number, bg: RGB): RGB => [
  Math.round(alpha * fg[0] + (1 - alpha) * bg[0]),
  Math.round(alpha * fg[1] + (1 - alpha) * bg[1]),
  Math.round(alpha * fg[2] + (1 - alpha) * bg[2]),
];

/**
 * Resolve a palette reference string (e.g. "scale.neutral.800") to an RGB triplet.
 * Transparent colors are composited over `overBg` (defaults to white).
 * Fully-transparent colors resolve to the composited background.
 */
export const resolvePaletteRef = (paletteRef: string, overBg: RGB = WHITE): RGB | null => {
  if (paletteRef === "scale.transparent") return overBg;
  if (paletteRef === "scale.white.1000") return [255, 255, 255];

  if (paletteRef.startsWith("scale.")) {
    const rest = paletteRef.slice(6); // e.g. "neutral.800", "neutral-transparent.200"

    if (rest.startsWith("white-transparent.")) {
      const tone = parseInt(rest.slice(18), 10);
      const alpha = TRANSPARENT_ALPHA[tone] ?? 0;
      return compositeOver([255, 255, 255], alpha, overBg);
    }

    if (rest.startsWith("neutral-transparent.")) {
      const tone = parseInt(rest.slice(20), 10);
      const alpha = TRANSPARENT_ALPHA[tone] ?? 0;
      const neutralHex = PALETTE.neutral?.["900"] ?? "#191919";
      return compositeOver(hexToRgb(neutralHex), alpha, overBg);
    }

    // scale.COLOR.TONE — look up directly in palette.json
    const dotIdx = rest.lastIndexOf(".");
    if (dotIdx !== -1) {
      const colorName = rest.slice(0, dotIdx);
      const toneName = rest.slice(dotIdx + 1);
      const hex = PALETTE[colorName]?.[toneName];
      if (hex) return hexToRgb(hex);
    }
  }

  if (paletteRef.startsWith("primary.")) {
    const rest = paletteRef.slice(8); // e.g. "red.200"
    const dotIdx = rest.lastIndexOf(".");
    if (dotIdx !== -1) {
      const colorName = rest.slice(0, dotIdx);
      const tone = parseInt(rest.slice(dotIdx + 1), 10);
      const baseTone = PRIMARY_BASE_TONES[colorName];
      if (baseTone !== undefined) {
        const baseHex = PALETTE[colorName]?.[String(baseTone)];
        if (baseHex) {
          const baseRgb = hexToRgb(baseHex);
          const alpha = PRIMARY_ALPHA[tone];
          if (alpha === undefined) return null;
          if (alpha === 1) return baseRgb;
          return compositeOver(baseRgb, alpha, overBg);
        }
      }
    }
  }

  return null;
};

// ─── WCAG math ────────────────────────────────────────────────────────────────

/**
 * Relative luminance per WCAG 2.2 section 1.4.3.
 * https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
 */
export const relativeLuminance = ([r, g, b]: RGB): number => {
  const lin = (c: number): number => {
    const n = c / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

/**
 * WCAG contrast ratio: (L_lighter + 0.05) / (L_darker + 0.05), always ≥ 1.
 */
export const wcagContrastRatio = (rgb1: RGB, rgb2: RGB): number => {
  const l1 = relativeLuminance(rgb1);
  const l2 = relativeLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

const CRITERION_THRESHOLD: Record<ContrastCriterion, number> = {
  "text-normal": 4.5, // SC 1.4.3 AA normal text
  "text-large": 3, //   SC 1.4.3 AA large text (18pt+ / 14pt+ bold)
  "non-text": 3, //     SC 1.4.11 AA UI components / graphical objects
};

// ─── Effective ref resolution ─────────────────────────────────────────────────

const getEffectivePaletteRef = (
  category: DesignTokenOverrideCategory,
  key: string,
  overrides: DesignTokenOverrides,
  compOverride?: DesignTokenOverrides,
  newTokenRefs?: Record<string, string>,
): string | null =>
  compOverride?.[category]?.[key] ??
  overrides[category]?.[key] ??
  newTokenRefs?.[key] ??
  DEFAULT_TOKEN_REFS[category]?.[key] ??
  null;

// ─── Placement background sets ────────────────────────────────────────────────

/**
 * Backgrounds a form input component (TextField, Combobox, Select, …) can be placed on.
 *
 * Included:
 *   background-default            — standard page / form
 *   background-neutral-subtlest-opaque — Card body, Dialog body, Panel
 *   background-neutral-xSubtle    — tinted form section, settings panel
 *
 * Excluded (vs CONTAINER_BGS):
 *   *-hovered / *-pressed / *-selected row states — inputs don't sit inside interactive rows
 */
export const INPUT_PLACEMENT_BGS = [
  "default",
  "neutral-subtlest-opaque",
  "neutral-xSubtle",
] as const satisfies string[];

/**
 * Backgrounds a Button can be placed on.
 *
 * Solid / subtle buttons appear in the same contexts as form inputs.
 * Plain / gutterless buttons can also appear inside selectable list rows,
 * so row interaction states are included.
 */
export const BUTTON_PLACEMENT_BGS = [
  "default",
  "neutral-xSubtle",
  "neutral-xSubtle-hovered",
  "neutral-xSubtle-pressed",
  "neutral-xSubtle-selected",
  "neutral-subtlest-opaque",
  "neutral-subtlest-opaque-hovered",
  "neutral-subtlest-opaque-pressed",
  "neutral-subtlest-opaque-selected",
  "neutral-xSubtle-opaque",
  "neutral-subtle-opaque",
  "danger-subtle",
] as const satisfies string[];

export const INVERSE_PLACEMENT_BGS = [
  "brand-bold",
  "neutral-bold",
  ...BANNER_LARGE_PLACEMENT_BGS,
] as const satisfies string[];

export const TEXT_PLACEMENT_BGS = ["default", ...CONTAINER_BGS] as const satisfies string[];
export const SWITCH_PLACEMENT_BGS = ["default", "neutral-xSubtle-opaque"] as const satisfies string[];
export const MARK_PLACEMENT_BGS = ["default", "neutral-xSubtle-opaque"] as const satisfies string[];

// ─── Component spec builders ──────────────────────────────────────────────────

// ── Input-type components (TextField, Combobox, Select, …) ────────────────────

/**
 * Build a standard contrast spec for any input-type component.
 * Covers the full state matrix so callers don't need to enumerate cases manually.
 *
 * States:
 *   default  — placeholder / filled text on background-input (SC 1.4.3)
 *              + border-input vs INPUT_PLACEMENT_BGS (SC 1.4.11)
 *   hovered  — same pairs with input-hovered tokens
 *   focused  — border-input-focused vs INPUT_PLACEMENT_BGS (SC 1.4.11)
 *   error    — border-danger vs INPUT_PLACEMENT_BGS (SC 1.4.11)
 *              + foreground-danger on background-danger-subtle for in-field danger icons (SC 1.4.3)
 */
export const buildInputContrastSpec = (component: string): ComponentContrastSpec => ({
  component,
  containerBgs: INPUT_PLACEMENT_BGS,
  internalPairs: [
    // default
    {
      stateLabel: "default / placeholder",
      state: "default",
      fg: { category: "foreground", key: "subtle" },
      bg: { category: "background", key: "input" },
      criterion: "text-normal",
    },
    {
      stateLabel: "default / filled",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "input" },
      criterion: "text-normal",
    },
    // hovered
    {
      stateLabel: "hovered / placeholder",
      state: "hovered",
      fg: { category: "foreground", key: "subtle" },
      bg: { category: "background", key: "input-hovered" },
      criterion: "text-normal",
    },
    {
      stateLabel: "hovered / filled",
      state: "hovered",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "input-hovered" },
      criterion: "text-normal",
    },
    // error — danger-colored icon / inline text that appears inside the field
    {
      stateLabel: "error / danger text",
      state: "error",
      fg: { category: "foreground", key: "danger" },
      bg: { category: "background", key: "danger-subtle" },
      criterion: "text-normal",
    },
  ],
  containerPairs: [
    {
      stateLabel: "default / border",
      state: "default",
      fg: { category: "border", key: "input" },
      criterion: "non-text",
    },
    {
      stateLabel: "hovered / border",
      state: "hovered",
      fg: { category: "border", key: "input-hovered" },
      criterion: "non-text",
    },
    {
      stateLabel: "focused / border",
      state: "focused",
      fg: { category: "border", key: "input-focused" },
      criterion: "non-text",
    },
    { stateLabel: "error / border", state: "error", fg: { category: "border", key: "danger" }, criterion: "non-text" },
  ],
});

// ── Button ────────────────────────────────────────────────────────────────────

/**
 * Button (Phase 1: neutral / danger / information colors)
 *
 * solid / subtle:
 *   Type A — label fg vs button own bg (default / hovered / pressed) — SC 1.4.3
 *   Type B — button bg vs container: included as a stricter override-safety check even though
 *             WCAG AA technically exempts text-labeled buttons (W3C Understanding SC 1.4.11).
 *             Catches token combinations where button backgrounds blend into containers.
 *
 * plain / gutterless:
 *   Type B — label fg vs 7 container bgs (transparent bg; SC 1.4.3)
 *             Required: no own background, so text color is the only visual identifier.
 *
 * Remaining colors (inverse / yellow) will be added in Phase 3.
 */

type ButtonSolidSubtleVariant = {
  variant: "solid" | "subtle";
  color: "neutral" | "danger" | "information" | "inverse";
  fgKey: string;
  bgBase: string;
};

type ButtonPlainGutterlessVariant = {
  variant: "plain" | "gutterless";
  color: "neutral" | "danger" | "information" | "inverse";
  fgKey: string;
};

const BUTTON_SOLID_SUBTLE: ReadonlyArray<ButtonSolidSubtleVariant> = [
  { variant: "solid", color: "neutral", fgKey: "inverse", bgBase: "brand-bold" },
  { variant: "solid", color: "danger", fgKey: "inverse", bgBase: "danger-bold" },
  { variant: "solid", color: "information", fgKey: "inverse", bgBase: "information-bold" },
  { variant: "solid", color: "inverse", fgKey: "default", bgBase: "inverse-bold" },
  { variant: "subtle", color: "neutral", fgKey: "default", bgBase: "neutral-subtle" },
  { variant: "subtle", color: "danger", fgKey: "danger", bgBase: "danger-subtle" },
  { variant: "subtle", color: "information", fgKey: "information", bgBase: "information-subtle" },
  { variant: "subtle", color: "inverse", fgKey: "inverse", bgBase: "inverse-subtle" },
];

const BUTTON_PLAIN_GUTTERLESS: ReadonlyArray<ButtonPlainGutterlessVariant> = [
  { variant: "plain", color: "neutral", fgKey: "default" },
  { variant: "plain", color: "danger", fgKey: "danger" },
  { variant: "plain", color: "information", fgKey: "information" },
  { variant: "plain", color: "inverse", fgKey: "inverse" },
  { variant: "gutterless", color: "neutral", fgKey: "default" },
  { variant: "gutterless", color: "danger", fgKey: "danger" },
  { variant: "gutterless", color: "inverse", fgKey: "inverse" },
];

const buildButtonContrastSpec = (): ComponentContrastSpec => {
  const internalPairs: InternalPairSpec[] = [];
  const containerPairs: ContainerPairSpec[] = [];

  for (const v of BUTTON_SOLID_SUBTLE) {
    // Type A: label fg vs own bg × {default, hovered, pressed}
    for (const state of ["default", "hovered", "pressed"] as const) {
      const bgKey = state === "default" ? v.bgBase : `${v.bgBase}-${state}`;
      internalPairs.push({
        variant: `${v.variant}·${v.color}`,
        state,
        fg: { category: "foreground", key: v.fgKey },
        bg: { category: "background", key: bgKey },
        criterion: "text-normal",
        ...(v.color === "inverse" ? { pageBgs: INVERSE_PLACEMENT_BGS } : {}),
      });
    }
    // Type B: surface vs container (non-text) × component state
    // subtle is text-led by design, so only solid keeps surface contrast checks.
    if (v.variant === "solid") {
      containerPairs.push({
        variant: `${v.variant}·${v.color}`,
        fg: { category: "background", key: v.bgBase },
        criterion: "non-text",
        ...(v.color === "inverse" ? { containerBgs: INVERSE_PLACEMENT_BGS } : {}),
        componentStates: [
          { state: "default", fg: { category: "background", key: v.bgBase } },
          { state: "hovered", fg: { category: "background", key: `${v.bgBase}-hovered` } },
          { state: "pressed", fg: { category: "background", key: `${v.bgBase}-pressed` } },
        ],
      });
    }
  }

  // plain / gutterless: transparent bg → text directly vs container (SC 1.4.3)
  for (const v of BUTTON_PLAIN_GUTTERLESS) {
    containerPairs.push({
      variant: `${v.variant}·${v.color}`,
      fg: { category: "foreground", key: v.fgKey },
      criterion: "text-normal",
      ...(v.color === "inverse" ? { containerBgs: INVERSE_PLACEMENT_BGS } : {}),
      componentStates: [
        { state: "default", fg: { category: "foreground", key: v.fgKey } },
        { state: "hovered", fg: { category: "foreground", key: v.fgKey } },
        { state: "pressed", fg: { category: "foreground", key: v.fgKey } },
      ],
    });
  }

  return { component: "Button", containerBgs: BUTTON_PLACEMENT_BGS, internalPairs, containerPairs };
};

type ForegroundContainerEntry = {
  variant: string;
  fgKey: string;
  criterion?: ContrastCriterion;
  containerBgs?: readonly string[];
};

const buildForegroundContainerSpec = (
  component: string,
  entries: readonly ForegroundContainerEntry[],
  criterion: ContrastCriterion,
  containerBgs: readonly string[] = TEXT_PLACEMENT_BGS,
): ComponentContrastSpec => ({
  component,
  containerBgs,
  containerPairs: entries.map((entry) => ({
    variant: entry.variant,
    state: "default",
    fg: { category: "foreground", key: entry.fgKey },
    criterion: entry.criterion ?? criterion,
    ...(entry.containerBgs ? { containerBgs: entry.containerBgs } : {}),
  })),
});

const buildIconButtonContrastSpec = (): ComponentContrastSpec => {
  const internalPairs: InternalPairSpec[] = [];
  const containerPairs: ContainerPairSpec[] = [];
  const solidAndSubtle = [
    { variant: "solid", color: "neutral", fgKey: "inverse", bgBase: "brand-bold" },
    { variant: "solid", color: "danger", fgKey: "inverse", bgBase: "danger-bold" },
    { variant: "solid", color: "information", fgKey: "inverse", bgBase: "information-bold" },
    { variant: "solid", color: "inverse", fgKey: "default", bgBase: "inverse-bold" },
    { variant: "subtle", color: "neutral", fgKey: "default", bgBase: "neutral-subtle" },
    { variant: "subtle", color: "danger", fgKey: "danger", bgBase: "danger-subtle" },
    { variant: "subtle", color: "information", fgKey: "information", bgBase: "information-subtle" },
    { variant: "subtle", color: "inverse", fgKey: "inverse", bgBase: "inverse-subtle" },
  ] as const;
  const plain = [
    { variant: "plain", color: "neutral", fgKey: "default" },
    { variant: "plain", color: "danger", fgKey: "danger" },
    { variant: "plain", color: "information", fgKey: "information" },
    { variant: "plain", color: "inverse", fgKey: "inverse" },
  ] as const;

  for (const variant of solidAndSubtle) {
    for (const state of ["default", "hovered", "pressed"] as const) {
      const bgKey = state === "default" ? variant.bgBase : `${variant.bgBase}-${state}`;
      internalPairs.push({
        variant: `${variant.variant}·${variant.color}`,
        state,
        fg: { category: "foreground", key: variant.fgKey },
        bg: { category: "background", key: bgKey },
        criterion: "text-normal",
      });
    }

    containerPairs.push({
      variant: `${variant.variant}·${variant.color}`,
      fg: { category: "background", key: variant.bgBase },
      criterion: "non-text",
      ...(variant.color === "inverse" ? { containerBgs: INVERSE_PLACEMENT_BGS } : {}),
      componentStates: [
        { state: "default", fg: { category: "background", key: variant.bgBase } },
        { state: "hovered", fg: { category: "background", key: `${variant.bgBase}-hovered` } },
        { state: "pressed", fg: { category: "background", key: `${variant.bgBase}-pressed` } },
      ],
    });
  }

  for (const variant of plain) {
    containerPairs.push({
      variant: `${variant.variant}·${variant.color}`,
      fg: { category: "foreground", key: variant.fgKey },
      criterion: "text-normal",
      ...(variant.color === "inverse" ? { containerBgs: INVERSE_PLACEMENT_BGS } : {}),
      componentStates: [
        { state: "default", fg: { category: "foreground", key: variant.fgKey } },
        { state: "hovered", fg: { category: "foreground", key: variant.fgKey } },
        { state: "pressed", fg: { category: "foreground", key: variant.fgKey } },
      ],
    });
  }

  return { component: "IconButton", containerBgs: BUTTON_PLACEMENT_BGS, internalPairs, containerPairs };
};

const buildSwitchContrastSpec = (): ComponentContrastSpec => ({
  component: "Switch",
  containerBgs: SWITCH_PLACEMENT_BGS,
  internalPairs: [
    {
      variant: "neutral·off",
      state: "default",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "input-bold" },
      criterion: "non-text",
    },
    {
      variant: "neutral·on",
      state: "checked",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "selected-bold" },
      criterion: "non-text",
    },
    {
      variant: "information·on",
      state: "checked",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "information-bold" },
      criterion: "non-text",
    },
  ],
  containerPairs: [
    {
      variant: "neutral",
      fg: { category: "background", key: "input-bold" },
      criterion: "non-text",
      componentStates: [{ state: "default", fg: { category: "background", key: "input-bold" } }],
    },
    {
      variant: "neutral",
      fg: { category: "background", key: "selected-bold" },
      criterion: "non-text",
      componentStates: [{ state: "checked", fg: { category: "background", key: "selected-bold" } }],
    },
    {
      variant: "information",
      fg: { category: "background", key: "information-bold" },
      criterion: "non-text",
      componentStates: [{ state: "checked", fg: { category: "background", key: "information-bold" } }],
    },
    {
      variant: "label",
      state: "default",
      fg: { category: "foreground", key: "default" },
      criterion: "text-normal",
    },
  ],
});

const buildCheckboxContrastSpec = (): ComponentContrastSpec => ({
  component: "Checkbox",
  containerBgs: TEXT_PLACEMENT_BGS,
  internalPairs: [
    {
      variant: "neutral",
      state: "checked",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "selected-bold" },
      criterion: "non-text",
    },
    {
      variant: "warning",
      state: "checked",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "warning-bold" },
      criterion: "non-text",
    },
    {
      variant: "danger",
      state: "checked",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "danger-bold" },
      criterion: "non-text",
    },
  ],
  containerPairs: [
    {
      variant: "neutral",
      fg: { category: "border", key: "input" },
      criterion: "non-text",
      componentStates: [
        { state: "default", fg: { category: "border", key: "input" } },
        { state: "hovered", fg: { category: "border", key: "input-hovered" } },
        { state: "checked", fg: { category: "background", key: "selected-bold" } },
      ],
    },
    {
      variant: "warning",
      fg: { category: "border", key: "warning-bold" },
      criterion: "non-text",
      componentStates: [
        { state: "default", fg: { category: "border", key: "warning-bold" } },
        { state: "hovered", fg: { category: "border", key: "warning-bold" } },
        { state: "checked", fg: { category: "background", key: "warning-bold" } },
      ],
    },
    {
      variant: "danger",
      fg: { category: "border", key: "danger-bold" },
      criterion: "non-text",
      componentStates: [
        { state: "default", fg: { category: "border", key: "danger-bold" } },
        { state: "hovered", fg: { category: "border", key: "danger-bold" } },
        { state: "checked", fg: { category: "background", key: "danger-bold" } },
      ],
    },
    {
      variant: "label",
      state: "default",
      fg: { category: "foreground", key: "default" },
      criterion: "text-normal",
    },
  ],
});

const buildCheckboxCardContrastSpec = (): ComponentContrastSpec => ({
  component: "CheckboxCard",
  containerBgs: TEXT_PLACEMENT_BGS,
  internalPairs: [
    {
      variant: "neutral·plain",
      state: "checked",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "selected-bold" },
      criterion: "non-text",
    },
    {
      variant: "warning·plain",
      state: "checked",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "warning-bold" },
      criterion: "non-text",
    },
    {
      variant: "danger·plain",
      state: "checked",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "danger-bold" },
      criterion: "non-text",
    },
    {
      variant: "neutral",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "neutral-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "gray",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-gray-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "warning",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "warning-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "danger",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "danger-subtlest" },
      criterion: "text-normal",
    },
  ],
  containerPairs: [
    {
      variant: "neutral",
      fg: { category: "border", key: "selected" },
      criterion: "non-text",
      componentStates: [{ state: "checked", fg: { category: "border", key: "selected" } }],
    },
    {
      variant: "gray",
      fg: { category: "border", key: "selected" },
      criterion: "non-text",
      componentStates: [{ state: "checked", fg: { category: "border", key: "selected" } }],
    },
    {
      variant: "warning",
      fg: { category: "border", key: "warning-bold" },
      criterion: "non-text",
      componentStates: [{ state: "checked", fg: { category: "border", key: "warning-bold" } }],
    },
    {
      variant: "danger",
      fg: { category: "border", key: "danger-bold" },
      criterion: "non-text",
      componentStates: [{ state: "checked", fg: { category: "border", key: "danger-bold" } }],
    },
  ],
});

const buildFormControlContrastSpec = (): ComponentContrastSpec => ({
  component: "FormControl",
  containerBgs: TEXT_PLACEMENT_BGS,
  containerPairs: [
    {
      variant: "label",
      state: "default",
      fg: { category: "foreground", key: "default" },
      criterion: "text-normal",
    },
    {
      variant: "required",
      state: "default",
      fg: { category: "foreground", key: "danger" },
      criterion: "text-normal",
    },
    {
      variant: "caption",
      state: "default",
      fg: { category: "foreground", key: "subtle" },
      criterion: "text-normal",
    },
    {
      variant: "caption",
      state: "error",
      fg: { category: "foreground", key: "danger" },
      criterion: "text-normal",
    },
  ],
});

const buildCalendarContrastSpec = (): ComponentContrastSpec => ({
  component: "Calendar",
  containerBgs: TEXT_PLACEMENT_BGS,
  internalPairs: [
    {
      variant: "date",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "default" },
      criterion: "text-normal",
    },
    {
      variant: "date",
      state: "hovered",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "neutral-subtlest-hovered" },
      criterion: "text-normal",
    },
    {
      variant: "date",
      state: "selected",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "information-bold" },
      criterion: "text-normal",
    },
    {
      variant: "today-indicator",
      state: "default",
      fg: { category: "border", key: "input-focused" },
      bg: { category: "background", key: "default" },
      criterion: "non-text",
    },
  ],
  containerPairs: [
    {
      variant: "selected-cell",
      fg: { category: "background", key: "information-bold" },
      criterion: "non-text",
      componentStates: [{ state: "selected", fg: { category: "background", key: "information-bold" } }],
    },
  ],
});

const buildTooltipContrastSpec = (): ComponentContrastSpec => ({
  component: "Tooltip",
  internalPairs: [
    {
      variant: "default",
      state: "default",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "neutral-bold" },
      criterion: "text-normal",
    },
  ],
});

const buildBannerContrastSpec = (): ComponentContrastSpec => ({
  component: "Banner",
  internalPairs: [
    {
      variant: "information·medium",
      state: "text",
      fg: { category: "foreground", key: "information-bold" },
      bg: { category: "background", key: "information-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "success·medium",
      state: "text",
      fg: { category: "foreground", key: "success-bold" },
      bg: { category: "background", key: "success-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "warning·medium",
      state: "text",
      fg: { category: "foreground", key: "warning-bold" },
      bg: { category: "background", key: "warning" },
      criterion: "text-normal",
    },
    {
      variant: "danger·medium",
      state: "text",
      fg: { category: "foreground", key: "danger-bold" },
      bg: { category: "background", key: "danger" },
      criterion: "text-normal",
    },
    {
      variant: "information·large",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "information-bold" },
      criterion: "text-normal",
    },
    {
      variant: "success·large",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "success-bold" },
      criterion: "text-normal",
    },
    {
      variant: "warning·large",
      state: "text",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "warning-bold" },
      criterion: "text-normal",
    },
    {
      variant: "danger·large",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "danger-bold" },
      criterion: "text-normal",
    },
    {
      variant: "information·medium",
      state: "icon",
      fg: { category: "foreground", key: "information-bold" },
      bg: { category: "background", key: "information-subtle" },
      criterion: "non-text",
    },
    {
      variant: "success·medium",
      state: "icon",
      fg: { category: "foreground", key: "success-bold" },
      bg: { category: "background", key: "success-subtle" },
      criterion: "non-text",
    },
    {
      variant: "warning·medium",
      state: "icon",
      fg: { category: "foreground", key: "warning-bold" },
      bg: { category: "background", key: "warning" },
      criterion: "non-text",
    },
    {
      variant: "danger·medium",
      state: "icon",
      fg: { category: "foreground", key: "danger-bold" },
      bg: { category: "background", key: "danger" },
      criterion: "non-text",
    },
    {
      variant: "information·large",
      state: "icon",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "information-bold" },
      criterion: "non-text",
    },
    {
      variant: "success·large",
      state: "icon",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "success-bold" },
      criterion: "non-text",
    },
    {
      variant: "warning·large",
      state: "icon",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "warning-bold" },
      criterion: "non-text",
    },
    {
      variant: "danger·large",
      state: "icon",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "danger-bold" },
      criterion: "non-text",
    },
  ],
});

const buildSnackbarContrastSpec = (): ComponentContrastSpec => ({
  component: "Snackbar",
  internalPairs: [
    {
      variant: "neutral",
      state: "message",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "neutral-bold" },
      criterion: "text-normal",
    },
    {
      variant: "neutral",
      state: "action",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "neutral-bold" },
      criterion: "text-normal",
    },
    {
      variant: "danger",
      state: "message",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "danger-bold" },
      criterion: "text-normal",
    },
    {
      variant: "danger",
      state: "action",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "danger-bold" },
      criterion: "text-normal",
    },
  ],
});

const buildFileDropContrastSpec = (): ComponentContrastSpec => ({
  component: "FileDrop",
  containerBgs: TEXT_PLACEMENT_BGS,
  internalPairs: [
    {
      variant: "default",
      state: "placeholder",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "neutral-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "drag-active",
      state: "placeholder",
      fg: { category: "foreground", key: "information" },
      bg: { category: "background", key: "information" },
      criterion: "text-normal",
    },
  ],
  containerPairs: [
    {
      variant: "default",
      fg: { category: "border", key: "neutral" },
      criterion: "non-text",
      componentStates: [{ state: "default", fg: { category: "border", key: "neutral" } }],
    },
    {
      variant: "drag-active",
      fg: { category: "border", key: "information-bold" },
      criterion: "non-text",
      componentStates: [{ state: "drag-active", fg: { category: "border", key: "information-bold" } }],
    },
  ],
});

const buildBadgeContrastSpec = (): ComponentContrastSpec => ({
  component: "Badge",
  containerBgs: BUTTON_PLACEMENT_BGS,
  internalPairs: [
    {
      variant: "neutral",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "neutral-bold" },
      criterion: "text-normal",
    },
    {
      variant: "danger",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "danger-bold" },
      criterion: "text-normal",
    },
    {
      variant: "subtle",
      state: "text",
      fg: { category: "foreground", key: "bold" },
      bg: { category: "background", key: "neutral-opaque" },
      criterion: "text-normal",
    },
    {
      variant: "success",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "success-bold" },
      criterion: "text-normal",
    },
    {
      variant: "information",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "information-bold" },
      criterion: "text-normal",
    },
    {
      variant: "warning",
      state: "text",
      fg: { category: "foreground", key: "bold" },
      bg: { category: "background", key: "warning-bold" },
      criterion: "text-normal",
    },
    {
      variant: "inverse",
      state: "text",
      fg: { category: "foreground", key: "bold" },
      bg: { category: "background", key: "inverse-bold" },
      criterion: "text-normal",
    },
  ],
  containerPairs: [
    {
      variant: "surface",
      fg: { category: "background", key: "neutral-bold" },
      criterion: "non-text",
      componentStates: [
        { state: "neutral", fg: { category: "background", key: "neutral-bold" } },
        { state: "danger", fg: { category: "background", key: "danger-bold" } },
        { state: "subtle", fg: { category: "background", key: "neutral-opaque" } },
        { state: "success", fg: { category: "background", key: "success-bold" } },
        { state: "information", fg: { category: "background", key: "information-bold" } },
        { state: "warning", fg: { category: "background", key: "warning-bold" } },
      ],
    },
    {
      variant: "surface",
      fg: { category: "background", key: "inverse-bold" },
      criterion: "non-text",
      containerBgs: INVERSE_PLACEMENT_BGS,
      componentStates: [{ state: "inverse", fg: { category: "background", key: "inverse-bold" } }],
    },
  ],
});

const buildProgressBarContrastSpec = (): ComponentContrastSpec => ({
  component: "ProgressBar",
  containerBgs: TEXT_PLACEMENT_BGS,
  internalPairs: [
    {
      variant: "information·default",
      state: "bar",
      fg: { category: "foreground", key: "information" },
      bg: { category: "background", key: "neutral-subtle" },
      criterion: "non-text",
    },
    {
      variant: "information·opaque",
      state: "bar",
      fg: { category: "foreground", key: "information" },
      bg: { category: "background", key: "neutral-subtle-opaque" },
      criterion: "non-text",
    },
    {
      variant: "danger·default",
      state: "bar",
      fg: { category: "foreground", key: "danger" },
      bg: { category: "background", key: "neutral-subtle" },
      criterion: "non-text",
    },
    {
      variant: "danger·opaque",
      state: "bar",
      fg: { category: "foreground", key: "danger" },
      bg: { category: "background", key: "neutral-subtle-opaque" },
      criterion: "non-text",
    },
    {
      variant: "disabled·default",
      state: "bar",
      fg: { category: "foreground", key: "disabled" },
      bg: { category: "background", key: "neutral-subtle" },
      criterion: "non-text",
    },
    {
      variant: "disabled·opaque",
      state: "bar",
      fg: { category: "foreground", key: "disabled" },
      bg: { category: "background", key: "neutral-subtle-opaque" },
      criterion: "non-text",
    },
  ],
});

const buildProgressCircleContrastSpec = (): ComponentContrastSpec => ({
  component: "ProgressCircle",
  internalPairs: [
    {
      variant: "normal",
      state: "indicator",
      fg: { category: "foreground", key: "information" },
      bg: { category: "background", key: "neutral-subtle" },
      criterion: "non-text",
    },
  ],
});

const buildProgressOverlayContrastSpec = (): ComponentContrastSpec => ({
  component: "ProgressOverlay",
  internalPairs: [
    {
      variant: "bar",
      state: "indicator",
      fg: { category: "foreground", key: "information" },
      bg: { category: "background", key: "neutral-subtle-opaque" },
      criterion: "non-text",
    },
  ],
});

const buildStatusLabelContrastSpec = (): ComponentContrastSpec => ({
  component: "StatusLabel",
  containerBgs: TEXT_PLACEMENT_BGS,
  containerPairs: [
    {
      variant: "text",
      fg: { category: "foreground", key: "default" },
      criterion: "text-normal",
      componentStates: [
        { state: "neutral", fg: { category: "foreground", key: "default" } },
        { state: "red", fg: { category: "foreground", key: "accent-red" } },
        { state: "yellow", fg: { category: "foreground", key: "accent-yellow" } },
        { state: "blue", fg: { category: "foreground", key: "accent-blue" } },
        { state: "teal", fg: { category: "foreground", key: "accent-teal" } },
        { state: "gray", fg: { category: "foreground", key: "accent-gray" } },
        { state: "purple", fg: { category: "foreground", key: "accent-purple" } },
        { state: "magenta", fg: { category: "foreground", key: "accent-magenta" } },
        { state: "orange", fg: { category: "foreground", key: "accent-orange" } },
        { state: "lime", fg: { category: "foreground", key: "accent-lime" } },
        { state: "indigo", fg: { category: "foreground", key: "accent-indigo" } },
      ],
    },
  ],
});

const buildAvatarContrastSpec = (): ComponentContrastSpec => ({
  component: "Avatar",
  internalPairs: [
    {
      variant: "subtle",
      state: "text",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "neutral-subtle-opaque" },
      criterion: "non-text",
    },
    {
      variant: "brand",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "brand-bold" },
      criterion: "non-text",
    },
    {
      variant: "red",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "accent-red-bold" },
      criterion: "non-text",
    },
    {
      variant: "orange",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "accent-orange-bold" },
      criterion: "non-text",
    },
    {
      variant: "teal",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "accent-teal-bold" },
      criterion: "non-text",
    },
    {
      variant: "indigo",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "accent-indigo-bold" },
      criterion: "non-text",
    },
    {
      variant: "blue",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "accent-blue-bold" },
      criterion: "non-text",
    },
    {
      variant: "purple",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "accent-purple-bold" },
      criterion: "non-text",
    },
    {
      variant: "magenta",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "accent-magenta-bold" },
      criterion: "non-text",
    },
  ],
});

const buildMarkContrastSpec = (): ComponentContrastSpec => ({
  component: "Mark",
  containerBgs: MARK_PLACEMENT_BGS,
  internalPairs: [
    {
      variant: "red·background",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-red-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "red·background",
      state: "withText",
      fg: { category: "foreground", key: "accent-red-subtle" },
      bg: { category: "background", key: "accent-red-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "red·underline",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-red-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "red·underline",
      state: "withText",
      fg: { category: "foreground", key: "accent-red-subtle" },
      bg: { category: "background", key: "accent-red-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "orange·background",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-orange-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "orange·background",
      state: "withText",
      fg: { category: "foreground", key: "accent-orange-subtle" },
      bg: { category: "background", key: "accent-orange-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "orange·underline",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-orange-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "orange·underline",
      state: "withText",
      fg: { category: "foreground", key: "accent-orange-subtle" },
      bg: { category: "background", key: "accent-orange-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "yellow·background",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-yellow-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "yellow·background",
      state: "withText",
      fg: { category: "foreground", key: "accent-yellow-subtle" },
      bg: { category: "background", key: "accent-yellow-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "yellow·underline",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-yellow-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "yellow·underline",
      state: "withText",
      fg: { category: "foreground", key: "accent-yellow-subtle" },
      bg: { category: "background", key: "accent-yellow-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "teal·background",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-teal-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "teal·background",
      state: "withText",
      fg: { category: "foreground", key: "accent-teal-subtle" },
      bg: { category: "background", key: "accent-teal-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "teal·underline",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-teal-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "teal·underline",
      state: "withText",
      fg: { category: "foreground", key: "accent-teal-subtle" },
      bg: { category: "background", key: "accent-teal-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "blue·background",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-blue-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "blue·background",
      state: "withText",
      fg: { category: "foreground", key: "accent-blue-subtle" },
      bg: { category: "background", key: "accent-blue-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "blue·underline",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-blue-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "blue·underline",
      state: "withText",
      fg: { category: "foreground", key: "accent-blue-subtle" },
      bg: { category: "background", key: "accent-blue-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "indigo·background",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-indigo-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "indigo·background",
      state: "withText",
      fg: { category: "foreground", key: "accent-indigo-subtle" },
      bg: { category: "background", key: "accent-indigo-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "indigo·underline",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-indigo-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "indigo·underline",
      state: "withText",
      fg: { category: "foreground", key: "accent-indigo-subtle" },
      bg: { category: "background", key: "accent-indigo-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "purple·background",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-purple-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "purple·background",
      state: "withText",
      fg: { category: "foreground", key: "accent-purple-subtle" },
      bg: { category: "background", key: "accent-purple-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "purple·underline",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-purple-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "purple·underline",
      state: "withText",
      fg: { category: "foreground", key: "accent-purple-subtle" },
      bg: { category: "background", key: "accent-purple-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "magenta·background",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-magenta-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "magenta·background",
      state: "withText",
      fg: { category: "foreground", key: "accent-magenta-subtle" },
      bg: { category: "background", key: "accent-magenta-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "magenta·underline",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-magenta-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "magenta·underline",
      state: "withText",
      fg: { category: "foreground", key: "accent-magenta-subtle" },
      bg: { category: "background", key: "accent-magenta-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "gray·background",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-gray-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "gray·background",
      state: "withText",
      fg: { category: "foreground", key: "accent-gray-subtle" },
      bg: { category: "background", key: "accent-gray-xSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "gray·underline",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "accent-gray-xxSubtle" },
      criterion: "text-normal",
    },
    {
      variant: "gray·underline",
      state: "withText",
      fg: { category: "foreground", key: "accent-gray-subtle" },
      bg: { category: "background", key: "accent-gray-xxSubtle" },
      criterion: "text-normal",
    },
  ],
  containerPairs: [
    {
      variant: "background",
      fg: { category: "foreground", key: "default" },
      criterion: "text-normal",
      componentStates: [
        { state: "red", fg: { category: "foreground", key: "default" } },
        { state: "orange", fg: { category: "foreground", key: "default" } },
        { state: "yellow", fg: { category: "foreground", key: "default" } },
        { state: "teal", fg: { category: "foreground", key: "default" } },
        { state: "blue", fg: { category: "foreground", key: "default" } },
        { state: "indigo", fg: { category: "foreground", key: "default" } },
        { state: "purple", fg: { category: "foreground", key: "default" } },
        { state: "magenta", fg: { category: "foreground", key: "default" } },
        { state: "gray", fg: { category: "foreground", key: "default" } },
      ],
    },
    {
      variant: "background·withText",
      fg: { category: "foreground", key: "accent-red-subtle" },
      criterion: "text-normal",
      componentStates: [
        { state: "red", fg: { category: "foreground", key: "accent-red-subtle" } },
        { state: "orange", fg: { category: "foreground", key: "accent-orange-subtle" } },
        { state: "yellow", fg: { category: "foreground", key: "accent-yellow-subtle" } },
        { state: "teal", fg: { category: "foreground", key: "accent-teal-subtle" } },
        { state: "blue", fg: { category: "foreground", key: "accent-blue-subtle" } },
        { state: "indigo", fg: { category: "foreground", key: "accent-indigo-subtle" } },
        { state: "purple", fg: { category: "foreground", key: "accent-purple-subtle" } },
        { state: "magenta", fg: { category: "foreground", key: "accent-magenta-subtle" } },
        { state: "gray", fg: { category: "foreground", key: "accent-gray-subtle" } },
      ],
    },
    {
      variant: "underline",
      fg: { category: "foreground", key: "default" },
      criterion: "text-normal",
      componentStates: [
        { state: "red", fg: { category: "foreground", key: "default" } },
        { state: "orange", fg: { category: "foreground", key: "default" } },
        { state: "yellow", fg: { category: "foreground", key: "default" } },
        { state: "teal", fg: { category: "foreground", key: "default" } },
        { state: "blue", fg: { category: "foreground", key: "default" } },
        { state: "indigo", fg: { category: "foreground", key: "default" } },
        { state: "purple", fg: { category: "foreground", key: "default" } },
        { state: "magenta", fg: { category: "foreground", key: "default" } },
        { state: "gray", fg: { category: "foreground", key: "default" } },
      ],
    },
    {
      variant: "underline·withText",
      fg: { category: "foreground", key: "accent-red-subtle" },
      criterion: "text-normal",
      componentStates: [
        { state: "red", fg: { category: "foreground", key: "accent-red-subtle" } },
        { state: "orange", fg: { category: "foreground", key: "accent-orange-subtle" } },
        { state: "yellow", fg: { category: "foreground", key: "accent-yellow-subtle" } },
        { state: "teal", fg: { category: "foreground", key: "accent-teal-subtle" } },
        { state: "blue", fg: { category: "foreground", key: "accent-blue-subtle" } },
        { state: "indigo", fg: { category: "foreground", key: "accent-indigo-subtle" } },
        { state: "purple", fg: { category: "foreground", key: "accent-purple-subtle" } },
        { state: "magenta", fg: { category: "foreground", key: "accent-magenta-subtle" } },
        { state: "gray", fg: { category: "foreground", key: "accent-gray-subtle" } },
      ],
    },
  ],
});

const buildTagContrastSpec = (): ComponentContrastSpec => ({
  component: "Tag",
  containerBgs: BUTTON_PLACEMENT_BGS,
  internalPairs: [
    {
      variant: "outline·neutral",
      state: "text",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "neutral-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "fill·neutral",
      state: "text",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "neutral-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "outline·inverse",
      state: "text",
      fg: { category: "foreground", key: "inverse-subtle" },
      bg: { category: "background", key: "inverse-subtlest" },
      criterion: "text-normal",
      pageBgs: INVERSE_PLACEMENT_BGS,
    },
    {
      variant: "fill·inverse",
      state: "text",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "inverse-subtle" },
      criterion: "text-normal",
      pageBgs: INVERSE_PLACEMENT_BGS,
    },
    {
      variant: "outline·red",
      state: "text",
      fg: { category: "foreground", key: "accent-red" },
      bg: { category: "background", key: "accent-red-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "fill·red",
      state: "text",
      fg: { category: "foreground", key: "accent-red-bold" },
      bg: { category: "background", key: "accent-red-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "outline·yellow",
      state: "text",
      fg: { category: "foreground", key: "accent-yellow" },
      bg: { category: "background", key: "accent-yellow-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "fill·yellow",
      state: "text",
      fg: { category: "foreground", key: "accent-yellow-bold" },
      bg: { category: "background", key: "accent-yellow-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "outline·blue",
      state: "text",
      fg: { category: "foreground", key: "accent-blue" },
      bg: { category: "background", key: "accent-blue-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "fill·blue",
      state: "text",
      fg: { category: "foreground", key: "accent-blue-bold" },
      bg: { category: "background", key: "accent-blue-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "outline·teal",
      state: "text",
      fg: { category: "foreground", key: "accent-teal" },
      bg: { category: "background", key: "accent-teal-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "fill·teal",
      state: "text",
      fg: { category: "foreground", key: "accent-teal-bold" },
      bg: { category: "background", key: "accent-teal-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "outline·purple",
      state: "text",
      fg: { category: "foreground", key: "accent-purple" },
      bg: { category: "background", key: "accent-purple-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "fill·purple",
      state: "text",
      fg: { category: "foreground", key: "accent-purple-bold" },
      bg: { category: "background", key: "accent-purple-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "outline·magenta",
      state: "text",
      fg: { category: "foreground", key: "accent-magenta" },
      bg: { category: "background", key: "accent-magenta-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "fill·magenta",
      state: "text",
      fg: { category: "foreground", key: "accent-magenta-bold" },
      bg: { category: "background", key: "accent-magenta-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "outline·orange",
      state: "text",
      fg: { category: "foreground", key: "accent-orange" },
      bg: { category: "background", key: "accent-orange-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "fill·orange",
      state: "text",
      fg: { category: "foreground", key: "accent-orange-bold" },
      bg: { category: "background", key: "accent-orange-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "outline·lime",
      state: "text",
      fg: { category: "foreground", key: "accent-lime" },
      bg: { category: "background", key: "accent-lime-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "fill·lime",
      state: "text",
      fg: { category: "foreground", key: "accent-lime-bold" },
      bg: { category: "background", key: "accent-lime-subtle" },
      criterion: "text-normal",
    },
    {
      variant: "outline·indigo",
      state: "text",
      fg: { category: "foreground", key: "accent-indigo" },
      bg: { category: "background", key: "accent-indigo-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "fill·indigo",
      state: "text",
      fg: { category: "foreground", key: "accent-indigo-bold" },
      bg: { category: "background", key: "accent-indigo-subtle" },
      criterion: "text-normal",
    },
  ],
  containerPairs: [],
});

const buildActionListContrastSpec = (): ComponentContrastSpec => ({
  component: "ActionList",
  containerBgs: ["default", "neutral-xSubtle-opaque"],
  internalPairs: [
    {
      variant: "neutral",
      state: "default",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "neutral-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "neutral",
      state: "hovered",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "neutral-subtlest-hovered" },
      criterion: "text-normal",
    },
    {
      variant: "neutral",
      state: "pressed",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "neutral-subtlest-pressed" },
      criterion: "text-normal",
    },
    {
      variant: "danger",
      state: "default",
      fg: { category: "foreground", key: "danger" },
      bg: { category: "background", key: "danger-subtlest" },
      criterion: "text-normal",
    },
    {
      variant: "danger",
      state: "hovered",
      fg: { category: "foreground", key: "danger" },
      bg: { category: "background", key: "danger-subtlest-hovered" },
      criterion: "text-normal",
    },
    {
      variant: "danger",
      state: "pressed",
      fg: { category: "foreground", key: "danger" },
      bg: { category: "background", key: "danger-subtlest-pressed" },
      criterion: "text-normal",
    },
  ],
  containerPairs: [
    {
      variant: "neutral",
      fg: { category: "foreground", key: "default" },
      criterion: "text-normal",
      componentStates: [{ state: "default", fg: { category: "foreground", key: "default" } }],
    },
    {
      variant: "danger",
      fg: { category: "foreground", key: "danger" },
      criterion: "text-normal",
      componentStates: [{ state: "default", fg: { category: "foreground", key: "danger" } }],
    },
  ],
});

const buildStepperContrastSpec = (): ComponentContrastSpec => ({
  component: "Stepper",
  containerBgs: TEXT_PLACEMENT_BGS,
  internalPairs: [
    {
      variant: "normal",
      state: "icon",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "neutral-subtlest" },
      criterion: "non-text",
    },
    {
      variant: "completed",
      state: "icon",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: "neutral-bold" },
      criterion: "non-text",
    },
    {
      variant: "current",
      state: "icon",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "neutral-subtlest-pressed" },
      criterion: "non-text",
    },
  ],
  containerPairs: [
    {
      variant: "title",
      state: "default",
      fg: { category: "foreground", key: "default" },
      criterion: "text-normal",
    },
    {
      variant: "title",
      state: "error",
      fg: { category: "foreground", key: "danger" },
      criterion: "text-normal",
    },
  ],
});

// ─── Component specs ──────────────────────────────────────────────────────────

const TEXTFIELD_SPEC: ComponentContrastSpec = buildInputContrastSpec("Input");
const BUTTON_SPEC: ComponentContrastSpec = buildButtonContrastSpec();
const TEXT_SPEC: ComponentContrastSpec = buildForegroundContainerSpec(
  "Text",
  [
    { variant: "default", fgKey: "default" },
    { variant: "bold", fgKey: "bold" },
    { variant: "subtle", fgKey: "subtle" },
    { variant: "xSubtle", fgKey: "xSubtle" },
    { variant: "brand", fgKey: "brand" },
    { variant: "danger", fgKey: "danger" },
    { variant: "success", fgKey: "success" },
    { variant: "warning", fgKey: "warning" },
    { variant: "information", fgKey: "information" },
    { variant: "inverse", fgKey: "inverse", containerBgs: INVERSE_PLACEMENT_BGS },
  ],
  "text-normal",
);
const MARKUPTEXT_SPEC: ComponentContrastSpec = buildForegroundContainerSpec(
  "Markdown Content",
  [
    { variant: "default", fgKey: "default" },
    { variant: "subtle", fgKey: "subtle" },
    { variant: "danger", fgKey: "danger" },
  ],
  "text-normal",
);
const LINK_SPEC: ComponentContrastSpec = buildForegroundContainerSpec(
  "Link",
  [
    { variant: "information", fgKey: "information" },
    { variant: "default", fgKey: "default" },
    { variant: "subtle", fgKey: "subtle" },
    { variant: "inverse", fgKey: "inverse", containerBgs: INVERSE_PLACEMENT_BGS },
  ],
  "text-normal",
);
const ICON_SPEC: ComponentContrastSpec = buildForegroundContainerSpec(
  "Icon",
  [
    { variant: "default", fgKey: "default" },
    { variant: "subtle", fgKey: "subtle" },
    { variant: "danger", fgKey: "danger" },
    { variant: "information", fgKey: "information" },
    { variant: "inverse", fgKey: "inverse", containerBgs: INVERSE_PLACEMENT_BGS },
  ],
  "non-text",
);
const EMPTYSTATE_SPEC: ComponentContrastSpec = buildForegroundContainerSpec(
  "EmptyState",
  [
    { variant: "title", fgKey: "default" },
    { variant: "description", fgKey: "subtle" },
  ],
  "text-normal",
);
const FORMCONTROL_SPEC: ComponentContrastSpec = buildFormControlContrastSpec();
const ICONBUTTON_SPEC: ComponentContrastSpec = buildIconButtonContrastSpec();
const SWITCH_SPEC: ComponentContrastSpec = buildSwitchContrastSpec();
const CHECKBOX_SPEC: ComponentContrastSpec = buildCheckboxContrastSpec();
const CHECKBOX_CARD_SPEC: ComponentContrastSpec = buildCheckboxCardContrastSpec();
const TAGPICKER_SPEC: ComponentContrastSpec = buildInputContrastSpec("Input");
const CALENDAR_SPEC: ComponentContrastSpec = buildCalendarContrastSpec();
const TOOLTIP_SPEC: ComponentContrastSpec = buildTooltipContrastSpec();
const BANNER_SPEC: ComponentContrastSpec = buildBannerContrastSpec();
const SNACKBAR_SPEC: ComponentContrastSpec = buildSnackbarContrastSpec();
const FILEDROP_SPEC: ComponentContrastSpec = buildFileDropContrastSpec();
const BADGE_SPEC: ComponentContrastSpec = buildBadgeContrastSpec();
const PROGRESS_BAR_SPEC: ComponentContrastSpec = buildProgressBarContrastSpec();
const PROGRESS_CIRCLE_SPEC: ComponentContrastSpec = buildProgressCircleContrastSpec();
const PROGRESS_OVERLAY_SPEC: ComponentContrastSpec = buildProgressOverlayContrastSpec();
const STATUS_LABEL_SPEC: ComponentContrastSpec = buildStatusLabelContrastSpec();
const AVATAR_SPEC: ComponentContrastSpec = buildAvatarContrastSpec();
const MARK_SPEC: ComponentContrastSpec = buildMarkContrastSpec();
const TAG_SPEC: ComponentContrastSpec = buildTagContrastSpec();
const ACTION_LIST_SPEC: ComponentContrastSpec = buildActionListContrastSpec();
const STEPPER_SPEC: ComponentContrastSpec = buildStepperContrastSpec();

// ─── Predefined contrast pairs ────────────────────────────────────────────────

/**
 * The set of token pairs that are meaningful to check for WCAG conformance.
 * Each pair specifies which foreground token appears against which background token,
 * and which WCAG criterion applies.
 */
export const CONTRAST_PAIRS: ContrastPairDef[] = [
  // ── Text contrast (SC 1.4.3, threshold 4.5:1 for normal text) ─────────────
  {
    id: "fg-default/bg-default",
    label: "foreground-default / background-default",
    criterion: "text-normal",
    fg: { category: "foreground", key: "default" },
    bg: { category: "background", key: "default" },
    description: "Body text on default background",
  },
  {
    id: "fg-bold/bg-default",
    label: "foreground-bold / background-default",
    criterion: "text-normal",
    fg: { category: "foreground", key: "bold" },
    bg: { category: "background", key: "default" },
    description: "Bold / high-emphasis text",
  },
  {
    id: "fg-subtle/bg-default",
    label: "foreground-subtle / background-default",
    criterion: "text-normal",
    fg: { category: "foreground", key: "subtle" },
    bg: { category: "background", key: "default" },
    description: "Secondary / de-emphasized text",
  },
  {
    id: "fg-xSubtle/bg-default",
    label: "foreground-xSubtle / background-default",
    criterion: "text-normal",
    fg: { category: "foreground", key: "xSubtle" },
    bg: { category: "background", key: "default" },
    description: "Placeholder / tertiary text",
  },
  {
    id: "fg-brand/bg-default",
    label: "foreground-brand / background-default",
    criterion: "text-normal",
    fg: { category: "foreground", key: "brand" },
    bg: { category: "background", key: "default" },
    description: "Brand-colored text",
  },
  {
    id: "fg-danger/bg-default",
    label: "foreground-danger / background-default",
    criterion: "text-normal",
    fg: { category: "foreground", key: "danger" },
    bg: { category: "background", key: "default" },
    description: "Error / danger text",
  },
  {
    id: "fg-success/bg-default",
    label: "foreground-success / background-default",
    criterion: "text-normal",
    fg: { category: "foreground", key: "success" },
    bg: { category: "background", key: "default" },
    description: "Success text",
  },
  {
    id: "fg-warning/bg-default",
    label: "foreground-warning / background-default",
    criterion: "text-normal",
    fg: { category: "foreground", key: "warning" },
    bg: { category: "background", key: "default" },
    description: "Warning text",
  },
  {
    id: "fg-information/bg-default",
    label: "foreground-information / background-default",
    criterion: "text-normal",
    fg: { category: "foreground", key: "information" },
    bg: { category: "background", key: "default" },
    description: "Informational text",
  },
  {
    id: "fg-inverse/bg-brand-bold",
    label: "foreground-inverse / background-brand-bold",
    criterion: "text-normal",
    fg: { category: "foreground", key: "inverse" },
    bg: { category: "background", key: "brand-bold" },
    description: "White text on brand CTA button",
  },
  {
    id: "fg-inverse/bg-neutral-bold",
    label: "foreground-inverse / background-neutral-bold",
    criterion: "text-normal",
    fg: { category: "foreground", key: "inverse" },
    bg: { category: "background", key: "neutral-bold" },
    description: "White text on dark neutral background",
  },
  // ── Non-text contrast (SC 1.4.11, threshold 3:1) ──────────────────────────
  {
    id: "border-default/bg-default",
    label: "border-default / background-default",
    criterion: "non-text",
    fg: { category: "border", key: "default" },
    bg: { category: "background", key: "default" },
    description: "Default border on default background",
  },
  {
    id: "border-bold/bg-default",
    label: "border-bold / background-default",
    criterion: "non-text",
    fg: { category: "border", key: "bold" },
    bg: { category: "background", key: "default" },
    description: "Bold border",
  },
  {
    id: "border-input/bg-default",
    label: "border-input / background-default",
    criterion: "non-text",
    fg: { category: "border", key: "input" },
    bg: { category: "background", key: "default" },
    description: "Input field border — critical for SC 1.4.11",
  },
  {
    id: "border-neutral/bg-default",
    label: "border-neutral / background-default",
    criterion: "non-text",
    fg: { category: "border", key: "neutral" },
    bg: { category: "background", key: "default" },
    description: "Neutral / subtle border",
  },
  {
    id: "border-brand/bg-default",
    label: "border-brand / background-default",
    criterion: "non-text",
    fg: { category: "border", key: "brand" },
    bg: { category: "background", key: "default" },
    description: "Brand-colored border / indicator",
  },

  // ── Component specs ────────────────────────────────────────────────────────
  ...generateContrastPairs(TEXT_SPEC),
  ...generateContrastPairs(MARKUPTEXT_SPEC),
  ...generateContrastPairs(LINK_SPEC),
  ...generateContrastPairs(ICON_SPEC),
  ...generateContrastPairs(EMPTYSTATE_SPEC),
  ...generateContrastPairs(FORMCONTROL_SPEC),
  ...generateContrastPairs(TEXTFIELD_SPEC),
  ...generateContrastPairs(BUTTON_SPEC),
  ...generateContrastPairs(ICONBUTTON_SPEC),
  ...generateContrastPairs(SWITCH_SPEC),
  ...generateContrastPairs(CHECKBOX_SPEC),
  ...generateContrastPairs(CHECKBOX_CARD_SPEC),
  ...generateContrastPairs(TAGPICKER_SPEC),
  ...generateContrastPairs(CALENDAR_SPEC),
  ...generateContrastPairs(TOOLTIP_SPEC),
  ...generateContrastPairs(BANNER_SPEC),
  ...generateContrastPairs(SNACKBAR_SPEC),
  ...generateContrastPairs(FILEDROP_SPEC),
  ...generateContrastPairs(BADGE_SPEC),
  ...generateContrastPairs(PROGRESS_BAR_SPEC),
  ...generateContrastPairs(PROGRESS_CIRCLE_SPEC),
  ...generateContrastPairs(PROGRESS_OVERLAY_SPEC),
  ...generateContrastPairs(STATUS_LABEL_SPEC),
  ...generateContrastPairs(AVATAR_SPEC),
  ...generateContrastPairs(MARK_SPEC),
  ...generateContrastPairs(TAG_SPEC),
  ...generateContrastPairs(ACTION_LIST_SPEC),
  ...generateContrastPairs(STEPPER_SPEC),
];

// ─── Result computation ───────────────────────────────────────────────────────

/** Look up which components reference the foreground token. */
const getComponents = (pair: ContrastPairDef): string[] => {
  const key = `--aegis-color-${pair.fg.category}-${pair.fg.key}` as keyof typeof tokenUsageMap;
  return tokenUsageMap[key] ?? [];
};

export interface ContrastComputeOptions {
  /** Component-scoped overrides. Applied before global overrides for pairs with a matching component. */
  componentOverrides?: ComponentOverrides;
  /**
   * Palette refs for newly added tokens (not yet in DEFAULT_TOKEN_REFS).
   * Keyed by category, then token key → palette ref.
   */
  newTokenRefs?: Record<DesignTokenOverrideCategory, Record<string, string>>;
}

/**
 * Compute WCAG contrast results for all predefined token pairs,
 * taking current overrides into account.
 *
 * Resolution priority per token:
 *   componentOverrides[component][category][key]
 *   → overrides[category][key]
 *   → newTokenRefs[category][key]
 *   → DEFAULT_TOKEN_REFS[category][key]
 */
export const computeContrastResults = (
  overrides: DesignTokenOverrides,
  options?: ContrastComputeOptions,
): ContrastResult[] =>
  CONTRAST_PAIRS.map((pair): ContrastResult => {
    const compOverride = pair.component ? options?.componentOverrides?.[pair.component] : undefined;
    const fgNewRefs = options?.newTokenRefs?.[pair.fg.category];
    const bgNewRefs = options?.newTokenRefs?.[pair.bg.category];
    const fgRef = getEffectivePaletteRef(pair.fg.category, pair.fg.key, overrides, compOverride, fgNewRefs);
    const bgRef = getEffectivePaletteRef(pair.bg.category, pair.bg.key, overrides, compOverride, bgNewRefs);
    const threshold = CRITERION_THRESHOLD[pair.criterion];

    // Resolve page background (for 3-layer preview and accurate transparent compositing)
    const pageBgRef = pair.pageBg
      ? getEffectivePaletteRef(
          pair.pageBg.category,
          pair.pageBg.key,
          overrides,
          compOverride,
          options?.newTokenRefs?.[pair.pageBg.category],
        )
      : null;
    const pageBgRgb: RGB | null | undefined = pair.pageBg
      ? pageBgRef
        ? resolvePaletteRef(pageBgRef)
        : null
      : undefined;

    // Composite bg over page bg so semi-transparent containers are resolved correctly
    const bgRgb = bgRef ? resolvePaletteRef(bgRef, pageBgRgb ?? WHITE) : null;
    const fgRgb = fgRef ? resolvePaletteRef(fgRef, bgRgb ?? WHITE) : null;

    if (!fgRgb || !bgRgb) {
      return { pair, ratio: null, fgRgb, bgRgb, pageBgRgb, pass: null, threshold, components: getComponents(pair) };
    }

    const ratio = wcagContrastRatio(fgRgb, bgRgb);
    return {
      pair,
      ratio,
      fgRgb,
      bgRgb,
      pageBgRgb,
      pass: ratio >= threshold,
      threshold,
      components: getComponents(pair),
    };
  });
