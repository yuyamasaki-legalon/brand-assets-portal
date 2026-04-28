import { describe, expect, it } from "vitest";
import {
  buildLegacySurfaceBaseId,
  buildStableSurfaceId,
  type DetectedCommentSurface,
  matchDetectedSurface,
} from "./commentSurfaceAnchors";

describe("commentSurfaceAnchors", () => {
  it("builds stable ids from explicit overlay keys", () => {
    expect(
      buildStableSurfaceId({
        kind: "drawer",
        rect: { left: 960, top: 0, width: 320, height: 800 },
        viewportWidth: 1280,
        viewportHeight: 800,
        explicitKeys: ["dialog-shell", "drawer-title"],
      }),
    ).toBe(
      buildStableSurfaceId({
        kind: "drawer",
        rect: { left: 960, top: 0, width: 320, height: 800 },
        viewportWidth: 1280,
        viewportHeight: 800,
        explicitKeys: ["dialog-shell", "drawer-title"],
      }),
    );
  });

  it("falls back to geometry-based ids when overlays have no stable attributes", () => {
    expect(
      buildStableSurfaceId({
        kind: "dialog",
        rect: { left: 240, top: 120, width: 800, height: 560 },
        viewportWidth: 1280,
        viewportHeight: 800,
      }),
    ).toBe("dialog:geo:center:cx50:cy50:w63:h70");
  });

  it("matches legacy indexed ids to the current surface when there is a unique legacy base", () => {
    const surfaces: DetectedCommentSurface[] = [
      {
        id: "drawer:key:abc123",
        kind: "drawer",
        label: "Inspector",
        rect: { left: 960, top: 0, width: 320, height: 800 },
        legacyBaseId: buildLegacySurfaceBaseId("drawer", "Inspector"),
        legacyIds: ["drawer:inspector:1"],
      },
    ];

    expect(
      matchDetectedSurface(
        {
          kind: "surface",
          surfaceId: "drawer:inspector:2",
          surfaceLabel: "Inspector",
          surfaceKind: "drawer",
          xPercent: 50,
          yPercent: 50,
        },
        surfaces,
      ),
    ).toEqual(surfaces[0]);
  });

  it("falls back to a unique visible surface kind when a title changed", () => {
    const surfaces: DetectedCommentSurface[] = [
      {
        id: "drawer:key:abc123",
        kind: "drawer",
        label: "詳細",
        rect: { left: 960, top: 0, width: 320, height: 800 },
        legacyBaseId: buildLegacySurfaceBaseId("drawer", "詳細"),
        legacyIds: ["drawer:overlay:1"],
      },
    ];

    expect(
      matchDetectedSurface(
        {
          kind: "surface",
          surfaceId: "drawer:inspector:1",
          surfaceLabel: "Inspector",
          surfaceKind: "drawer",
          xPercent: 50,
          yPercent: 50,
        },
        surfaces,
      ),
    ).toEqual(surfaces[0]);
  });
});
