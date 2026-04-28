import type { SurfaceCommentAnchor, SurfaceCommentKind } from "../features/comment-threads/types";

export interface SurfaceRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface DetectedCommentSurface {
  id: string;
  kind: SurfaceCommentKind;
  label: string;
  rect: SurfaceRect;
  legacyBaseId: string;
  legacyIds: string[];
}

interface StableSurfaceIdParams {
  kind: SurfaceCommentKind;
  rect: SurfaceRect;
  viewportWidth: number;
  viewportHeight: number;
  explicitKeys?: string[];
}

const EDGE_THRESHOLD = 24;

const sanitizeLegacySlug = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

const normalizeIdentityKey = (value: string): string => {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
};

const hashIdentityKey = (value: string): string => {
  let hash = 5381;

  for (const character of value) {
    hash = (hash * 33) ^ character.charCodeAt(0);
  }

  return (hash >>> 0).toString(36);
};

const roundViewportPercent = (value: number, total: number): number => {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
};

const getViewportEdge = (rect: SurfaceRect, viewportWidth: number, viewportHeight: number): string => {
  const distances = [
    { edge: "left", distance: Math.abs(rect.left) },
    { edge: "right", distance: Math.abs(viewportWidth - (rect.left + rect.width)) },
    { edge: "top", distance: Math.abs(rect.top) },
    { edge: "bottom", distance: Math.abs(viewportHeight - (rect.top + rect.height)) },
  ].sort((left, right) => left.distance - right.distance);

  const nearest = distances[0];
  if (!nearest || nearest.distance > EDGE_THRESHOLD) {
    return "center";
  }

  return nearest.edge;
};

export const buildLegacySurfaceBaseId = (kind: SurfaceCommentKind, label: string): string => {
  const slug = sanitizeLegacySlug(label) || "overlay";
  return `${kind}:${slug}`;
};

export const buildStableSurfaceId = ({
  kind,
  rect,
  viewportWidth,
  viewportHeight,
  explicitKeys = [],
}: StableSurfaceIdParams): string => {
  const normalizedKeys = explicitKeys.map(normalizeIdentityKey).filter(Boolean);
  if (normalizedKeys.length > 0) {
    return `${kind}:key:${hashIdentityKey(normalizedKeys.join("|"))}`;
  }

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const edge = getViewportEdge(rect, viewportWidth, viewportHeight);

  return [
    `${kind}:geo:${edge}`,
    `cx${roundViewportPercent(centerX, viewportWidth)}`,
    `cy${roundViewportPercent(centerY, viewportHeight)}`,
    `w${roundViewportPercent(rect.width, viewportWidth)}`,
    `h${roundViewportPercent(rect.height, viewportHeight)}`,
  ].join(":");
};

export const matchDetectedSurface = (
  anchor: SurfaceCommentAnchor,
  surfaces: readonly DetectedCommentSurface[],
): DetectedCommentSurface | null => {
  const exactMatch = surfaces.find(
    (surface) => surface.id === anchor.surfaceId || surface.legacyIds.includes(anchor.surfaceId),
  );
  if (exactMatch) {
    return exactMatch;
  }

  const indexedLegacyBase = anchor.surfaceId.replace(/:\d+$/, "");
  if (indexedLegacyBase !== anchor.surfaceId) {
    const indexedMatches = surfaces.filter((surface) => surface.legacyBaseId === indexedLegacyBase);
    if (indexedMatches.length === 1) {
      return indexedMatches[0] ?? null;
    }
  }

  const labelMatches = surfaces.filter(
    (surface) =>
      surface.kind === anchor.surfaceKind &&
      surface.legacyBaseId === buildLegacySurfaceBaseId(anchor.surfaceKind, anchor.surfaceLabel),
  );
  if (labelMatches.length === 1) {
    return labelMatches[0] ?? null;
  }

  const kindMatches = surfaces.filter((surface) => surface.kind === anchor.surfaceKind);
  if (kindMatches.length === 1) {
    return kindMatches[0] ?? null;
  }

  return surfaces.length === 1 ? (surfaces[0] ?? null) : null;
};
