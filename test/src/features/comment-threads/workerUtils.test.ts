import { describe, expect, it } from "vitest";
import { buildThreadsFromRows, normalizePercent, normalizeText, parseAnchor } from "./workerUtils";

describe("workerUtils", () => {
  it("normalizes trimmed text and enforces max length", () => {
    expect(normalizeText("  hello  ", 10)).toBe("hello");
    expect(normalizeText("long-value", 4)).toBe("long");
    expect(normalizeText("   ", 10)).toBeNull();
  });

  it("clamps percent values into the valid range", () => {
    expect(normalizePercent(-5)).toBe(0);
    expect(normalizePercent(42.12349)).toBe(42.123);
    expect(normalizePercent(105)).toBe(100);
  });

  it("parses surface and component anchors", () => {
    expect(
      parseAnchor({
        kind: "surface",
        surfaceId: "drawer:right",
        surfaceLabel: "Inspector",
        surfaceKind: "drawer",
        xPercent: 25,
        yPercent: 50,
      }),
    ).toEqual({
      kind: "surface",
      surfaceId: "drawer:right",
      surfaceLabel: "Inspector",
      surfaceKind: "drawer",
      xPercent: 25,
      yPercent: 50,
    });

    expect(
      parseAnchor({
        kind: "component",
        anchorId: "save-button",
        label: "保存",
        targetKind: "button",
        contextLabel: "Footer",
      }),
    ).toEqual({
      kind: "component",
      anchorId: "save-button",
      label: "保存",
      targetKind: "button",
      contextLabel: "Footer",
    });

    expect(
      parseAnchor({
        kind: "component",
        anchorId: "save-button",
        label: "保存",
        targetKind: "unexpected",
      }),
    ).toBeUndefined();
  });

  it("builds thread aggregates from joined DB rows", () => {
    const threads = buildThreadsFromRows([
      {
        thread_id: "thread-1",
        page_route: "/sandbox/example",
        thread_created_at: "2026-04-08T09:00:00.000Z",
        thread_updated_at: "2026-04-08T11:00:00.000Z",
        thread_resolved_at: null,
        anchor_kind: "surface",
        anchor_id: "drawer:right",
        anchor_label: "Inspector",
        anchor_target_kind: "drawer",
        anchor_context_label: null,
        anchor_x_percent: 20,
        anchor_y_percent: 30,
        message_id: "message-1",
        author_name: "Alice",
        body: "First",
        message_created_at: "2026-04-08T09:00:00.000Z",
        message_edited_at: null,
      },
      {
        thread_id: "thread-1",
        page_route: "/sandbox/example",
        thread_created_at: "2026-04-08T09:00:00.000Z",
        thread_updated_at: "2026-04-08T11:00:00.000Z",
        thread_resolved_at: null,
        anchor_kind: "surface",
        anchor_id: "drawer:right",
        anchor_label: "Inspector",
        anchor_target_kind: "drawer",
        anchor_context_label: null,
        anchor_x_percent: 20,
        anchor_y_percent: 30,
        message_id: "message-2",
        author_name: "Bob",
        body: "Reply",
        message_created_at: "2026-04-08T11:00:00.000Z",
        message_edited_at: null,
      },
    ]);

    expect(threads).toHaveLength(1);
    expect(threads[0]?.messages).toHaveLength(2);
    expect(threads[0]?.anchor).toEqual({
      kind: "surface",
      surfaceId: "drawer:right",
      surfaceLabel: "Inspector",
      surfaceKind: "drawer",
      xPercent: 20,
      yPercent: 30,
    });
  });

  it("drops invalid surface kinds when rebuilding threads from rows", () => {
    const threads = buildThreadsFromRows([
      {
        thread_id: "thread-1",
        page_route: "/sandbox/example",
        thread_created_at: "2026-04-08T09:00:00.000Z",
        thread_updated_at: "2026-04-08T11:00:00.000Z",
        thread_resolved_at: null,
        anchor_kind: "surface",
        anchor_id: "drawer:right",
        anchor_label: "Inspector",
        anchor_target_kind: "sheet",
        anchor_context_label: null,
        anchor_x_percent: 20,
        anchor_y_percent: 30,
        message_id: "message-1",
        author_name: "Alice",
        body: "First",
        message_created_at: "2026-04-08T09:00:00.000Z",
        message_edited_at: null,
      },
    ]);

    expect(threads[0]?.anchor).toBeUndefined();
  });

  it("does not coerce unknown anchor kinds into canvas anchors", () => {
    const threads = buildThreadsFromRows([
      {
        thread_id: "thread-1",
        page_route: "/sandbox/example",
        thread_created_at: "2026-04-08T09:00:00.000Z",
        thread_updated_at: "2026-04-08T11:00:00.000Z",
        thread_resolved_at: null,
        anchor_kind: "sheet",
        anchor_id: null,
        anchor_label: null,
        anchor_target_kind: null,
        anchor_context_label: null,
        anchor_x_percent: 20,
        anchor_y_percent: 30,
        message_id: "message-1",
        author_name: "Alice",
        body: "First",
        message_created_at: "2026-04-08T09:00:00.000Z",
        message_edited_at: null,
      },
    ]);

    expect(threads[0]?.anchor).toBeUndefined();
  });

  it("preserves resolved timestamp from DB rows", () => {
    const threads = buildThreadsFromRows([
      {
        thread_id: "thread-1",
        page_route: "/sandbox/example",
        thread_created_at: "2026-04-08T09:00:00.000Z",
        thread_updated_at: "2026-04-08T11:00:00.000Z",
        thread_resolved_at: "2026-04-08T12:00:00.000Z",
        anchor_kind: "canvas",
        anchor_id: null,
        anchor_label: null,
        anchor_target_kind: null,
        anchor_context_label: null,
        anchor_x_percent: 20,
        anchor_y_percent: 30,
        message_id: "message-1",
        author_name: "Alice",
        body: "First",
        message_created_at: "2026-04-08T09:00:00.000Z",
        message_edited_at: "2026-04-08T12:30:00.000Z",
      },
    ]);

    expect(threads[0]?.resolvedAt).toBe("2026-04-08T12:00:00.000Z");
    expect(threads[0]?.messages[0]?.editedAt).toBe("2026-04-08T12:30:00.000Z");
  });
});
