import type { PinAnchor } from "../features/comment-threads/types";
import { type DetectedCommentSurface, matchDetectedSurface } from "./commentSurfaceAnchors";

export interface PreviewMetrics {
  frameLeft: number;
  frameTop: number;
  frameWidth: number;
  frameHeight: number;
  scale: number;
  contentWidth: number;
  contentHeight: number;
  scrollLeft: number;
  scrollTop: number;
}

export interface PreviewRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const roundAnchorPercent = (value: number): number => Math.round(value * 1000) / 1000;

export const computePreviewScale = (parentWidth: number, contentWidth: number): number => {
  const nextScale = Math.min(1, parentWidth / contentWidth);
  return Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1;
};

export const buildPendingAnchorFromPoint = ({
  pointX,
  pointY,
  containerRect,
  metrics,
  surfaces,
}: {
  pointX: number;
  pointY: number;
  containerRect: Pick<PreviewRect, "left" | "top">;
  metrics: PreviewMetrics;
  surfaces: DetectedCommentSurface[];
}): PinAnchor => {
  const localX = (pointX - containerRect.left) / metrics.scale;
  const localY = (pointY - containerRect.top) / metrics.scale;
  const matchedSurface = [...surfaces]
    .reverse()
    .find(
      (surface) =>
        localX >= surface.rect.left &&
        localX <= surface.rect.left + surface.rect.width &&
        localY >= surface.rect.top &&
        localY <= surface.rect.top + surface.rect.height,
    );

  if (matchedSurface) {
    const xPercent = ((localX - matchedSurface.rect.left) / matchedSurface.rect.width) * 100;
    const yPercent = ((localY - matchedSurface.rect.top) / matchedSurface.rect.height) * 100;

    return {
      kind: "surface",
      surfaceId: matchedSurface.id,
      surfaceLabel: matchedSurface.label,
      surfaceKind: matchedSurface.kind,
      xPercent: roundAnchorPercent(xPercent),
      yPercent: roundAnchorPercent(yPercent),
    };
  }

  const xPercent = ((localX + metrics.scrollLeft) / metrics.contentWidth) * 100;
  const yPercent = ((localY + metrics.scrollTop) / metrics.contentHeight) * 100;
  return {
    kind: "canvas",
    xPercent: roundAnchorPercent(xPercent),
    yPercent: roundAnchorPercent(yPercent),
  };
};

export const getAnchorViewportPosition = ({
  anchor,
  metrics,
  surfaces,
}: {
  anchor: PinAnchor;
  metrics: PreviewMetrics;
  surfaces: DetectedCommentSurface[];
}): { left: number; top: number } | null => {
  let left: number;
  let top: number;

  if (anchor.kind === "surface") {
    const surface = matchDetectedSurface(anchor, surfaces);
    if (!surface) {
      return null;
    }

    left = metrics.frameLeft + (surface.rect.left + (surface.rect.width * anchor.xPercent) / 100) * metrics.scale;
    top = metrics.frameTop + (surface.rect.top + (surface.rect.height * anchor.yPercent) / 100) * metrics.scale;
  } else {
    left = metrics.frameLeft + ((metrics.contentWidth * anchor.xPercent) / 100 - metrics.scrollLeft) * metrics.scale;
    top = metrics.frameTop + ((metrics.contentHeight * anchor.yPercent) / 100 - metrics.scrollTop) * metrics.scale;
  }

  if (
    left < metrics.frameLeft ||
    left > metrics.frameLeft + metrics.frameWidth ||
    top < metrics.frameTop ||
    top > metrics.frameTop + metrics.frameHeight
  ) {
    return null;
  }

  return { left, top };
};
