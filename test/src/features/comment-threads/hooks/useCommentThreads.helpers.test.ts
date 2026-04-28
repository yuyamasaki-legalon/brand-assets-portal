import { describe, expect, it } from "vitest";
import type { CommentAnchor } from "../types";
import {
  buildThreadListQuery,
  createOptimisticReplyMessage,
  createOptimisticThread,
  isJsonContentType,
  normalizeMessageBody,
  shouldSkipThreadLoading,
  THREAD_PAGE_SIZE,
} from "./useCommentThreads.helpers";

describe("useCommentThreads helpers", () => {
  it("skips loading when disabled or backend is known unavailable", () => {
    expect(shouldSkipThreadLoading(false, null)).toBe(true);
    expect(shouldSkipThreadLoading(true, false)).toBe(true);
    expect(shouldSkipThreadLoading(true, true)).toBe(false);
  });

  it("builds thread list query with cursor", () => {
    expect(buildThreadListQuery("/sandbox/foo", "abc")).toBe(
      `page=%2Fsandbox%2Ffoo&limit=${THREAD_PAGE_SIZE}&cursor=abc`,
    );
  });

  it("detects json content-type loosely", () => {
    expect(isJsonContentType("application/json; charset=utf-8")).toBe(true);
    expect(isJsonContentType("text/html")).toBe(false);
    expect(isJsonContentType(null)).toBe(false);
  });

  it("creates optimistic thread with stable shape", () => {
    const anchor: CommentAnchor = { kind: "canvas", xPercent: 10, yPercent: 20 };
    const ids = ["thread-1", "message-1"];
    const thread = createOptimisticThread({
      pageRoute: "/sandbox/foo",
      authorName: "Ryo",
      body: "hello",
      anchor,
      now: "2026-04-15T10:00:00.000Z",
      createId: () => ids.shift() ?? "fallback",
    });

    expect(thread).toEqual({
      id: "local-thread-thread-1",
      pageRoute: "/sandbox/foo",
      createdAt: "2026-04-15T10:00:00.000Z",
      updatedAt: "2026-04-15T10:00:00.000Z",
      anchor,
      pending: true,
      messages: [
        {
          id: "local-message-message-1",
          authorName: "Ryo",
          body: "hello",
          createdAt: "2026-04-15T10:00:00.000Z",
          pending: true,
        },
      ],
    });
  });

  it("creates optimistic reply messages with null editedAt", () => {
    expect(
      createOptimisticReplyMessage({
        authorName: "Ryo",
        body: "reply",
        now: "2026-04-15T10:00:00.000Z",
        createId: () => "message-2",
      }),
    ).toEqual({
      id: "local-message-message-2",
      authorName: "Ryo",
      body: "reply",
      createdAt: "2026-04-15T10:00:00.000Z",
      editedAt: null,
      pending: true,
    });
  });

  it("trims message body before updates", () => {
    expect(normalizeMessageBody("  hello  ")).toBe("hello");
  });
});
