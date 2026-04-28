/**
 * Override Design Token utilities.
 *
 * Manages overrides that change which palette slot a semantic token references.
 * Hue (color values) is handled by Customize Theme; this module handles which
 * palette slot (Lightness) each semantic token points to.
 */

import type React from "react";
import backgroundTokenSource from "./background.tokens.json";
import borderTokenSource from "./border.tokens.json";
import foregroundTokenSource from "./foreground.tokens.json";
import paletteScaleSource from "./palette.json";
import { TRANSPARENT_TONE_KEYS } from "./palette-computer";
import paletteConfigSource from "./palette-config.json";
import { isTokenLeaf, type JsonObject } from "./token-resolver";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DesignTokenOverrideCategory = "background" | "foreground" | "border";

/**
 * Overrides keyed by token name (hyphen-separated, e.g. "inverse-subtle").
 * Values are palette path references (e.g. "scale.neutral.800").
 */
export type DesignTokenOverrides = Record<DesignTokenOverrideCategory, Record<string, string>>;

export const EMPTY_OVERRIDES: DesignTokenOverrides = { background: {}, foreground: {}, border: {} };

/** Component-scoped token overrides. Keys are component names (e.g. "Banner"). */
export type ComponentOverrides = Record<string, DesignTokenOverrides>;
export const EMPTY_COMPONENT_OVERRIDES: ComponentOverrides = {};

/** A user-added token entry (not yet in the token JSON files). */
export type NewTokenEntry = { id: string; key: string; value: string };

export const NEW_TOKENS_STORAGE_KEY = "sandbox-builder:newTokens";

// ─── Default reference extraction ────────────────────────────────────────────

/**
 * Extract default palette references from a token source JSON.
 * Only includes tokens that directly reference `internal.color.palette.*`.
 * Skips deprecated tokens and self-referencing tokens.
 *
 * @returns Record of { "token-key": "scale.neutral.900" }
 */
const extractDefaultRefs = (source: JsonObject, category: string): Record<string, string> => {
  const categorySource = ((source.color as JsonObject)?.[category] as JsonObject) ?? {};
  const result: Record<string, string> = {};

  for (const [rawKey, entry] of Object.entries(categorySource)) {
    if (rawKey === "$type") continue;
    if (!isTokenLeaf(entry)) continue;
    if (entry.$deprecated) continue;

    const match = entry.$value.match(/^\{internal\.color\.palette\.(.+)\}$/);
    if (!match) continue; // skip self-references like {color.foreground.xSubtle}

    result[rawKey] = match[1]; // e.g. "scale.white.1000" or "scale.white-transparent.100"
  }

  return result;
};

/**
 * Default palette references for each semantic token category.
 * Used to compute diffs (only overridden tokens differ from these).
 */
export const DEFAULT_TOKEN_REFS: Record<DesignTokenOverrideCategory, Record<string, string>> = {
  background: extractDefaultRefs(backgroundTokenSource as JsonObject, "background"),
  foreground: extractDefaultRefs(foregroundTokenSource as JsonObject, "foreground"),
  border: extractDefaultRefs(borderTokenSource as JsonObject, "border"),
};

// ─── Palette options ──────────────────────────────────────────────────────────

const buildPaletteOptions = (): string[] => {
  const options: string[] = [];

  // Special: transparent and white.1000
  options.push("scale.transparent");
  options.push("scale.white.1000");

  // From palette.json: neutral, red, orange, etc.
  for (const [colorName, tones] of Object.entries(paletteScaleSource as Record<string, Record<string, string>>)) {
    for (const tone of Object.keys(tones)) {
      options.push(`scale.${colorName}.${tone}`);
    }
  }

  // Transparent derived scales (same tone keys as neutral)
  const transparentTones = [...TRANSPARENT_TONE_KEYS].map(String);
  for (const tone of transparentTones) {
    options.push(`scale.white-transparent.${tone}`);
  }
  for (const tone of transparentTones) {
    options.push(`scale.neutral-transparent.${tone}`);
  }

  // Primary derived scales — transparent-alpha overlays anchored to each
  // color's designated base tone (e.g. primary.red.600 = full-opacity red,
  // primary.red.100 = rgba(red, ~7%)).  All TRANSPARENT_TONE_KEYS are listed
  // so Combobox can display any primary.* ref found in token source files.
  const primaryBaseColors = paletteConfigSource.primaryBaseColors as Record<string, string>;
  for (const colorName of Object.keys(primaryBaseColors)) {
    for (const tone of transparentTones) {
      options.push(`primary.${colorName}.${tone}`);
    }
  }

  return options;
};

/** All available palette slot references for use in the Combobox/select. */
export const PALETTE_OPTIONS: string[] = buildPaletteOptions();

// ─── CSS property builders ────────────────────────────────────────────────────

/**
 * Build React.CSSProperties for sandbox preview.
 * Uses `--aegis-internal-color-palette-*` vars that the sandbox computes.
 * Only emits entries that differ from the default.
 */
export const buildDesignTokenOverrideCSSProperties = (overrides: DesignTokenOverrides): React.CSSProperties => {
  const result: Record<string, string> = {};

  for (const [category, categoryOverrides] of Object.entries(overrides) as [
    DesignTokenOverrideCategory,
    Record<string, string>,
  ][]) {
    const defaults = DEFAULT_TOKEN_REFS[category] ?? {};

    for (const [key, paletteRef] of Object.entries(categoryOverrides)) {
      if (paletteRef === (defaults[key] ?? "")) continue; // unchanged

      const cssVar = `--aegis-color-${category}-${key}`;
      const paletteVar = `--aegis-internal-color-palette-${paletteRef.replaceAll(".", "-")}`;
      result[cssVar] = `var(${paletteVar})`;
    }
  }

  return result as React.CSSProperties;
};

/**
 * Build export CSS text for download (uses production `--aegis-palette-*` vars).
 * Returns diff-only CSS lines per category, empty string when no changes.
 */
export const buildDesignTokenOverrideExportCSS = (
  overrides: DesignTokenOverrides,
): Record<DesignTokenOverrideCategory, string> => {
  const buildCategory = (category: DesignTokenOverrideCategory): string => {
    const categoryOverrides = overrides[category] ?? {};
    const categoryDefaults = DEFAULT_TOKEN_REFS[category] ?? {};

    const lines = Object.entries(categoryOverrides)
      .filter(([key, value]) => value !== (categoryDefaults[key] ?? ""))
      .map(([key, value]) => {
        const cssVar = `--aegis-color-${category}-${key}`;
        // "scale.neutral.800" → "--aegis-palette-neutral-800" (strip "scale.")
        // "scale.white-transparent.200" → "--aegis-palette-white-transparent-200"
        const paletteVarName = value.startsWith("scale.")
          ? `--aegis-palette-${value.slice("scale.".length).replaceAll(".", "-")}`
          : `--aegis-internal-color-palette-${value.replaceAll(".", "-")}`;

        return `${cssVar}: var(${paletteVarName});`;
      });

    return lines.join("\n");
  };

  return {
    background: buildCategory("background"),
    foreground: buildCategory("foreground"),
    border: buildCategory("border"),
  };
};
