import { isRecord, type JsonObject } from "./token-resolver";

export const flattenPalette = (value: JsonObject, prefix = ""): Record<string, string> => {
  const entries: Record<string, string> = {};

  Object.entries(value).forEach(([key, nestedValue]) => {
    const nextPrefix = prefix ? `${prefix}-${key}` : key;

    if (isRecord(nestedValue)) {
      Object.assign(entries, flattenPalette(nestedValue, nextPrefix));
      return;
    }

    entries[`--aegis-internal-color-palette-${nextPrefix}`] = String(nestedValue);
  });

  return entries;
};

export const flattenColorTokens = (value: JsonObject, prefix = ""): Record<string, string> => {
  const entries: Record<string, string> = {};

  Object.entries(value).forEach(([key, nestedValue]) => {
    const nextPrefix = prefix ? `${prefix}-${key.replaceAll(".", "-")}` : key.replaceAll(".", "-");

    if (isRecord(nestedValue)) {
      Object.assign(entries, flattenColorTokens(nestedValue, nextPrefix));
      return;
    }

    entries[`--aegis-color-${nextPrefix}`] = String(nestedValue);
  });

  return entries;
};

export const flattenSimpleVars = (value: JsonObject, prefix: string): Record<string, string> =>
  Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [`--aegis-${prefix}-${key}`, String(nestedValue)]),
  );
