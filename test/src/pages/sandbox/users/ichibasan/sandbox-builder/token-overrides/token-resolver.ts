/**
 * Token reference resolution utilities.
 *
 * Handles the `*.tokens.json` reference format used by Aegis:
 *   { "$value": "{internal.color.palette.scale.neutral.900}" }
 *
 * These are pure functions with no side effects, no React, no JSON loading.
 */

// ─── Shared types ─────────────────────────────────────────────────────────────

/** A plain JSON object. Used throughout the token pipeline. */
export type JsonObject = Record<string, unknown>;

/** A token leaf node: an object with a `$value` string. */
export type TokenLeaf = { $value: string; $deprecated?: boolean };

// ─── Type guards ──────────────────────────────────────────────────────────────

/** Returns true when `value` is a non-null, non-array plain object. */
export const isRecord = (value: unknown): value is JsonObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Returns true when `value` is a token leaf node (has a string `$value`). */
export const isTokenLeaf = (value: unknown): value is TokenLeaf => isRecord(value) && typeof value.$value === "string";

// ─── Token tree utilities ─────────────────────────────────────────────────────

/**
 * Recursively strip `{ "$value": "..." }` wrappers from a token tree,
 * returning a plain value tree.  `$type` keys are removed.
 */
export const unwrapTokenTree = (value: unknown): unknown => {
  if (isTokenLeaf(value)) {
    return value.$value;
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== "$type")
      .map(([key, nestedValue]) => [key, unwrapTokenTree(nestedValue)]),
  );
};

// ─── Path traversal ───────────────────────────────────────────────────────────

/**
 * Safely traverse a nested object by dot-separated path segments.
 * Returns `undefined` if any segment is missing.
 */
export const getByPath = (value: unknown, path: string[]): unknown =>
  path.reduce<unknown>((current, key) => (isRecord(current) ? current[key] : undefined), value);

// ─── Token reference resolution ───────────────────────────────────────────────

/**
 * Resolve all tokens in one semantic category of a `*.tokens.json` source into
 * a flat `{ "token.key": "resolvedValue" }` record.
 *
 * Supports two reference forms:
 *   `{internal.color.palette.<path>}` — resolved via `palette`
 *   `{color.<category>.<key>}`        — self-resolved within the same category
 *
 * @param source    The full token source object (e.g. `backgroundTokenSource`)
 * @param category  The semantic category to resolve ("background" | "foreground" | …)
 * @param palette   The current palette for `internal.color.palette.*` lookups
 */
export const resolveTokenCategory = (
  source: JsonObject,
  category: "background" | "blanket" | "foreground" | "border" | "interaction",
  palette: JsonObject,
): Record<string, string> => {
  const cache = new Map<string, string>();
  const categorySource = (((source.color as JsonObject)?.[category] as JsonObject) ?? {}) as JsonObject;

  const resolveValue = (tokenValue: string): string => {
    const match = tokenValue.match(/^\{(.+)\}$/);

    if (!match) {
      return tokenValue;
    }

    const referencePath = match[1];

    if (referencePath.startsWith("internal.color.palette.")) {
      const resolved = getByPath(palette, referencePath.replace("internal.color.palette.", "").split("."));
      return String(resolved ?? tokenValue);
    }

    if (referencePath.startsWith(`color.${category}.`)) {
      return resolveEntry(referencePath.replace(`color.${category}.`, ""));
    }

    return tokenValue;
  };

  const resolveEntry = (rawKey: string): string => {
    const cached = cache.get(rawKey);
    if (cached !== undefined) {
      return cached;
    }

    const entry = categorySource[rawKey];
    const tokenValue = isTokenLeaf(entry) ? entry.$value : "";
    const resolved = resolveValue(tokenValue);
    cache.set(rawKey, resolved);
    return resolved;
  };

  return Object.fromEntries(
    Object.keys(categorySource)
      .filter((key) => key !== "$type")
      .map((rawKey) => [rawKey.replaceAll("-", "."), resolveEntry(rawKey)]),
  );
};
