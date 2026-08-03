var e=`/**
 * Aegis typography token baseline constants.
 *
 * These values mirror Aegis's actual token system so EASYS_DEFAULTS can align
 * with native Aegis rendering instead of being heuristic guesses.
 *
 * Sources:
 *   - line-height tokens: --aegis-lineHeight-condensed / normal / expanded / expandedPlus
 *   - font-weight: Aegis design token documentation
 *   - letter-spacing: NOT a per-variant token in Aegis.
 *     Aegis applies a global \`body { letter-spacing: 0.02em }\` that all text inherits.
 *     The Typography Lab mirrors this via a preview root baseline in typography-vars.ts.
 *     The \`letterSpacing\` field in TypographySettings represents a DELTA from this baseline
 *     (0 = no adjustment, matches Aegis native; -0.02 = removes the tracking entirely).
 *
 * Note: \`data-aegis-typography\` is used in Aegis's own implementation to mark
 * typography-aware elements. The Typography Lab uses element/role selectors instead
 * to target rendered DOM output without relying on internal attribute conventions.
 */

// ─── Line-height tokens ────────────────────────────────────────────────────────

/**
 * @lab-extension — Not in Aegis's official lineHeight token set.
 * Added to the Lab for tight heading / compact UI use cases.
 * Must be annotated as lab-extension if emitted to typography.tokens.json.
 */
export const LH_TIGHT = 1.35;

/** --aegis-lineHeight-condensed (1.2) — used by title variants */
export const LH_CONDENSED = 1.2;

/** --aegis-lineHeight-normal (1.5) — used by body, label, caption, data */
export const LH_NORMAL = 1.5;

/** --aegis-lineHeight-expanded (1.7) — used by component text */
export const LH_EXPANDED = 1.7;

/** --aegis-lineHeight-expandedPlus (1.8) — used by documentBody */
export const LH_EXPANDED_PLUS = 1.8;

// ─── Font weight ───────────────────────────────────────────────────────────────

/** Regular weight (400) — body Default, caption, data Default */
export const FW_REGULAR = 400;

/**
 * Medium weight (500).
 * Currently unused in Aegis production tokens; kept for Lab token structure completeness.
 */
export const FW_MEDIUM = 500;

/**
 * Semibold weight (600).
 * Currently unused in Aegis production tokens; kept for Lab token structure completeness.
 */
export const FW_SEMIBOLD = 600;

/** Bold weight (700) — title, label Emphasis, component, and interactive text */
export const FW_BOLD = 700;

// ─── Letter-spacing baseline ───────────────────────────────────────────────────

/**
 * Aegis global letter-spacing baseline (from \`body { letter-spacing: 0.02em }\`).
 *
 * LEGACY model (TypographySettings / buildTypographyVarsCss):
 *   Per-type letter-spacing is \`calc(BASELINE + delta)\`.
 *   The preview root inherits this value; delta=0 matches Aegis native.
 *
 * NEW model (SettingState / buildTypographyVarsCssFromModel):
 *   The preview root resets letter-spacing to 0 (not this value).
 *   SettingState.letterSpacing holds absolute em values per size token, not deltas.
 *   This constant is retained as documentation of what Aegis applies globally,
 *   and is no longer injected into the preview root in the new model.
 */
export const LETTER_SPACING_BASELINE = "0.02em";
`;export{e as default};