export type PullRequestLabel = {
  name: string;
};

export type ExtractPreviewLabelsResult = {
  validAliases: string[];
  warnings: string[];
};

const PREVIEW_LABEL_PREFIX = "preview:";
const ALIAS_PATTERN = /^[a-z0-9][a-z0-9-]{0,30}$/;
const MAX_ALIAS_COUNT = 5;
const RESERVED_ALIASES = new Set(["main", "preview", "latest", "production", "staging"]);

const isReserved = (alias: string): boolean => {
  if (RESERVED_ALIASES.has(alias)) {
    return true;
  }
  // pr-{N} is used by the existing workflow and must not be overridden by project aliases
  return /^pr-\d+$/.test(alias);
};

export const extractPreviewLabels = (labels: PullRequestLabel[]): ExtractPreviewLabelsResult => {
  const validAliases: string[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();

  for (const label of labels) {
    const name = label.name ?? "";
    if (!name.startsWith(PREVIEW_LABEL_PREFIX)) {
      continue;
    }
    const raw = name.slice(PREVIEW_LABEL_PREFIX.length);

    if (raw.length === 0) {
      warnings.push(`Label "${name}" has no slug after "${PREVIEW_LABEL_PREFIX}".`);
      continue;
    }
    if (!ALIAS_PATTERN.test(raw)) {
      warnings.push(
        `Label "${name}" is invalid. Use lowercase letters, digits, and hyphens only (max 31 chars, starting with a letter or digit).`,
      );
      continue;
    }
    if (isReserved(raw)) {
      warnings.push(`Label "${name}" uses a reserved alias ("${raw}"). Please rename.`);
      continue;
    }
    if (seen.has(raw)) {
      continue;
    }

    seen.add(raw);
    validAliases.push(raw);
  }

  if (validAliases.length > MAX_ALIAS_COUNT) {
    warnings.push(
      `More than ${MAX_ALIAS_COUNT} preview labels detected. Only the first ${MAX_ALIAS_COUNT} will be used.`,
    );
    return {
      validAliases: validAliases.slice(0, MAX_ALIAS_COUNT),
      warnings,
    };
  }

  return { validAliases, warnings };
};

export const buildAliasUrl = (alias: string, workerHost: string): string => {
  return `https://${alias}-${workerHost}`;
};

export type PreviewLabelClassification =
  | { status: "valid"; slug: string }
  | { status: "reserved"; slug: string; reason: string }
  | { status: "invalid"; slug: string; reason: string }
  | { status: "not-preview"; reason: string };

/**
 * Classify a single label name the same way {@link extractPreviewLabels} does.
 * Used by the cleanup path so that reserved or malformed slugs are rejected
 * before any Cloudflare API call is made.
 */
export const classifyPreviewLabel = (labelName: string): PreviewLabelClassification => {
  if (!labelName.startsWith(PREVIEW_LABEL_PREFIX)) {
    return {
      status: "not-preview",
      reason: `Label "${labelName}" does not have the "${PREVIEW_LABEL_PREFIX}" prefix.`,
    };
  }
  const raw = labelName.slice(PREVIEW_LABEL_PREFIX.length);
  if (raw.length === 0) {
    return {
      status: "invalid",
      slug: raw,
      reason: `Label "${labelName}" has no slug after "${PREVIEW_LABEL_PREFIX}".`,
    };
  }
  if (!ALIAS_PATTERN.test(raw)) {
    return {
      status: "invalid",
      slug: raw,
      reason: `Label "${labelName}" is invalid. Use lowercase letters, digits, and hyphens only (max 31 chars, starting with a letter or digit).`,
    };
  }
  if (isReserved(raw)) {
    return {
      status: "reserved",
      slug: raw,
      reason: `Label "${labelName}" uses a reserved alias ("${raw}").`,
    };
  }
  return { status: "valid", slug: raw };
};
