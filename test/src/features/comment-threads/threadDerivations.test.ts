import { describe, expect, it } from "vitest";
import {
  appendThreadMessage,
  buildThreadCollections,
  countExternalComments,
  countOpenThreads,
  mergeThreads,
  removeThread,
  removeThreadMessage,
  replaceThread,
  sortThreads,
  updateThreadMessage,
  updateThreadState,
} from "./threadDerivations";
import type { CommentThread } from "./types";

const buildThread = (overrides: Partial<CommentThread>): CommentThread => ({
  id: overrides.id ?? "thread-1",
  pageRoute: overrides.pageRoute ?? "/sandbox/example",
  createdAt: overrides.createdAt ?? "2026-04-08T00:00:00.000Z",
  updatedAt: overrides.updatedAt ?? "2026-04-08T00:00:00.000Z",
  resolvedAt: overrides.resolvedAt,
  anchor: overrides.anchor,
  messages: overrides.messages ?? [
    {
      id: "message-1",
      authorName: "Alice",
      body: "hello",
      createdAt: "2026-04-08T00:00:00.000Z",
    },
  ],
  pending: overrides.pending,
});

describe("threadDerivations", () => {
  it("sorts threads by most recent update", () => {
    const threads = sortThreads([
      buildThread({ id: "old", updatedAt: "2026-04-08T09:00:00.000Z" }),
      buildThread({ id: "new", updatedAt: "2026-04-08T10:00:00.000Z" }),
    ]);

    expect(threads.map((thread) => thread.id)).toEqual(["new", "old"]);
  });

  it("replaces a thread and preserves ordering", () => {
    const next = replaceThread(
      [
        buildThread({ id: "first", updatedAt: "2026-04-08T09:00:00.000Z" }),
        buildThread({ id: "second", updatedAt: "2026-04-08T08:00:00.000Z" }),
      ],
      "second",
      buildThread({ id: "second", updatedAt: "2026-04-08T11:00:00.000Z" }),
    );

    expect(next.map((thread) => thread.id)).toEqual(["second", "first"]);
  });

  it("counts only threads whose latest message is from another author", () => {
    const threads = [
      buildThread({
        id: "external",
        messages: [{ id: "m1", authorName: "Bob", body: "reply", createdAt: "2026-04-08T00:00:00.000Z" }],
      }),
      buildThread({
        id: "mine",
        messages: [{ id: "m2", authorName: "Alice", body: "reply", createdAt: "2026-04-08T00:00:00.000Z" }],
      }),
    ];

    expect(countExternalComments(threads, "Alice")).toBe(1);
  });

  it("excludes resolved threads from external comment counts and open count", () => {
    const threads = [
      buildThread({
        id: "resolved",
        resolvedAt: "2026-04-08T12:00:00.000Z",
        messages: [{ id: "m1", authorName: "Bob", body: "done", createdAt: "2026-04-08T00:00:00.000Z" }],
      }),
      buildThread({
        id: "open",
        messages: [{ id: "m2", authorName: "Bob", body: "todo", createdAt: "2026-04-08T00:00:00.000Z" }],
      }),
    ];

    expect(countExternalComments(threads, "Alice")).toBe(1);
    expect(countOpenThreads(threads)).toBe(1);
  });

  it("removes a thread by id", () => {
    const next = removeThread([buildThread({ id: "keep" }), buildThread({ id: "drop" })], "drop");

    expect(next.map((thread) => thread.id)).toEqual(["keep"]);
  });

  it("merges paginated threads by id and preserves newest values", () => {
    const next = mergeThreads(
      [buildThread({ id: "first", updatedAt: "2026-04-08T09:00:00.000Z" })],
      [
        buildThread({ id: "first", updatedAt: "2026-04-08T10:00:00.000Z" }),
        buildThread({ id: "second", updatedAt: "2026-04-08T08:00:00.000Z" }),
      ],
    );

    expect(next.map((thread) => [thread.id, thread.updatedAt])).toEqual([
      ["first", "2026-04-08T10:00:00.000Z"],
      ["second", "2026-04-08T08:00:00.000Z"],
    ]);
  });

  it("applies message and thread mutations without replacing the entire thread", () => {
    const base = [
      buildThread({
        id: "thread-1",
        messages: [{ id: "m1", authorName: "Alice", body: "before", createdAt: "2026-04-08T00:00:00.000Z" }],
      }),
    ];

    const appended = appendThreadMessage(
      base,
      "thread-1",
      { id: "m2", authorName: "Bob", body: "after", createdAt: "2026-04-08T01:00:00.000Z" },
      "2026-04-08T01:00:00.000Z",
      null,
    );
    const updated = updateThreadMessage(
      appended,
      "thread-1",
      "m2",
      { body: "edited", editedAt: "2026-04-08T02:00:00.000Z" },
      "2026-04-08T02:00:00.000Z",
    );
    const resolved = updateThreadState(updated, "thread-1", {
      updatedAt: "2026-04-08T03:00:00.000Z",
      resolvedAt: "2026-04-08T03:00:00.000Z",
    });

    expect(resolved[0]?.messages).toEqual([
      { id: "m1", authorName: "Alice", body: "before", createdAt: "2026-04-08T00:00:00.000Z" },
      {
        id: "m2",
        authorName: "Bob",
        body: "edited",
        createdAt: "2026-04-08T01:00:00.000Z",
        editedAt: "2026-04-08T02:00:00.000Z",
      },
    ]);
    expect(resolved[0]?.resolvedAt).toBe("2026-04-08T03:00:00.000Z");
  });

  it("removes a single message and deletes the thread only when it becomes empty", () => {
    const threads = [
      buildThread({
        id: "thread-1",
        messages: [
          { id: "m1", authorName: "Alice", body: "one", createdAt: "2026-04-08T00:00:00.000Z" },
          { id: "m2", authorName: "Bob", body: "two", createdAt: "2026-04-08T01:00:00.000Z" },
        ],
      }),
    ];

    const afterOneDelete = removeThreadMessage(threads, "thread-1", "m1", "2026-04-08T02:00:00.000Z", false);
    const afterThreadDelete = removeThreadMessage(afterOneDelete, "thread-1", "m2", null, true);

    expect(afterOneDelete[0]?.messages.map((message) => message.id)).toEqual(["m2"]);
    expect(afterThreadDelete).toEqual([]);
  });

  it("builds positioned pin indexes across canvas and surface anchors", () => {
    const collections = buildThreadCollections([
      buildThread({
        id: "surface",
        createdAt: "2026-04-08T10:00:00.000Z",
        anchor: {
          kind: "surface",
          surfaceId: "drawer:right",
          surfaceLabel: "Details Drawer",
          surfaceKind: "drawer",
          xPercent: 50,
          yPercent: 50,
        },
      }),
      buildThread({
        id: "canvas",
        createdAt: "2026-04-08T09:00:00.000Z",
        anchor: { kind: "canvas", xPercent: 10, yPercent: 20 },
      }),
      buildThread({
        id: "component",
        createdAt: "2026-04-08T08:00:00.000Z",
        anchor: {
          kind: "component",
          anchorId: "cta",
          label: "Primary CTA",
          targetKind: "button",
        },
      }),
    ]);

    expect(collections.pinnedThreads.map((thread) => [thread.id, thread.pinIndex])).toEqual([["canvas", 1]]);
    expect(collections.surfaceThreads.map((thread) => [thread.id, thread.pinIndex])).toEqual([["surface", 2]]);
    expect(collections.positionedThreads.map((thread) => [thread.id, thread.pinIndex])).toEqual([
      ["canvas", 1],
      ["surface", 2],
    ]);
    expect(collections.positionedThreads.map((thread) => thread.pinIndex)).toEqual([1, 2]);
    expect(collections.componentThreads.map((thread) => thread.id)).toEqual(["component"]);
  });

  it("keeps pin indexes consistent across filtered collections", () => {
    const collections = buildThreadCollections([
      buildThread({
        id: "canvas-late",
        createdAt: "2026-04-08T11:00:00.000Z",
        anchor: { kind: "canvas", xPercent: 10, yPercent: 20 },
      }),
      buildThread({
        id: "surface-early",
        createdAt: "2026-04-08T09:00:00.000Z",
        anchor: {
          kind: "surface",
          surfaceId: "drawer:right",
          surfaceLabel: "Details Drawer",
          surfaceKind: "drawer",
          xPercent: 50,
          yPercent: 50,
        },
      }),
    ]);

    expect(collections.positionedThreads.map((thread) => [thread.id, thread.pinIndex])).toEqual([
      ["surface-early", 1],
      ["canvas-late", 2],
    ]);
    expect(collections.pinnedThreads.map((thread) => [thread.id, thread.pinIndex])).toEqual([["canvas-late", 2]]);
    expect(collections.surfaceThreads.map((thread) => [thread.id, thread.pinIndex])).toEqual([["surface-early", 1]]);
  });
});
