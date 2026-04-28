import { describe, expect, it } from "vitest";
import type { DetectedCommentSurface } from "./commentSurfaceAnchors";
import { buildLegacySurfaceBaseId } from "./commentSurfaceAnchors";
import {
  buildPendingAnchorFromPoint,
  computePreviewScale,
  getAnchorViewportPosition,
  type PreviewMetrics,
} from "./SandboxCommentPreview.helpers";

const metrics: PreviewMetrics = {
  frameLeft: 100,
  frameTop: 50,
  frameWidth: 800,
  frameHeight: 600,
  scale: 0.5,
  contentWidth: 1600,
  contentHeight: 1200,
  scrollLeft: 200,
  scrollTop: 100,
};

const surface: DetectedCommentSurface = {
  id: "drawer:key:abc",
  label: "Inspector",
  kind: "drawer",
  rect: { left: 900, top: 100, width: 300, height: 400 },
  legacyBaseId: buildLegacySurfaceBaseId("drawer", "Inspector"),
  legacyIds: ["drawer:inspector:1"],
};

describe("SandboxCommentPreview helpers", () => {
  it("computes preview scale safely", () => {
    expect(computePreviewScale(600, 1200)).toBe(0.5);
    expect(computePreviewScale(1800, 1200)).toBe(1);
    expect(computePreviewScale(0, 1200)).toBe(1);
  });

  it("creates a surface anchor when clicking inside a detected overlay", () => {
    const anchor = buildPendingAnchorFromPoint({
      pointX: 650,
      pointY: 200,
      containerRect: { left: 100, top: 50 },
      metrics,
      surfaces: [surface],
    });

    expect(anchor).toEqual({
      kind: "surface",
      surfaceId: "drawer:key:abc",
      surfaceLabel: "Inspector",
      surfaceKind: "drawer",
      xPercent: 66.667,
      yPercent: 50,
    });
  });

  it("creates a canvas anchor when no overlay matches", () => {
    const anchor = buildPendingAnchorFromPoint({
      pointX: 300,
      pointY: 150,
      containerRect: { left: 100, top: 50 },
      metrics,
      surfaces: [],
    });

    expect(anchor).toEqual({
      kind: "canvas",
      xPercent: 37.5,
      yPercent: 25,
    });
  });

  it("maps canvas anchor to viewport position", () => {
    expect(
      getAnchorViewportPosition({
        anchor: { kind: "canvas", xPercent: 50, yPercent: 50 },
        metrics,
        surfaces: [],
      }),
    ).toEqual({ left: 400, top: 300 });
  });

  it("returns null when the anchor is outside the visible frame", () => {
    expect(
      getAnchorViewportPosition({
        anchor: { kind: "canvas", xPercent: 110, yPercent: 110 },
        metrics,
        surfaces: [],
      }),
    ).toBeNull();
  });
});
