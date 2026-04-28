import { describe, expect, it, vi } from "vitest";
import type { CommentAnchor, CommentThread } from "./types";
import { submitPendingSubmission } from "./useCommentSubmission";

const anchor: CommentAnchor = {
  kind: "canvas",
  xPercent: 10,
  yPercent: 20,
};

const buildThread = (id: string): CommentThread => ({
  id,
  pageRoute: "/sandbox/example",
  createdAt: "2026-04-08T00:00:00.000Z",
  updatedAt: "2026-04-08T00:00:00.000Z",
  messages: [],
});

describe("submitPendingSubmission", () => {
  it("creates a thread from pending create input and selects it", async () => {
    const createThread = vi.fn(async () => buildThread("thread-1"));
    const replyToThread = vi.fn(async () => null);
    const onThreadSelected = vi.fn();

    await submitPendingSubmission({
      pendingSubmission: {
        type: "create",
        body: "hello",
        anchor,
      },
      nextAuthorName: "Alice",
      createThread,
      replyToThread,
      onThreadSelected,
    });

    expect(createThread).toHaveBeenCalledWith({
      authorName: "Alice",
      body: "hello",
      anchor,
    });
    expect(replyToThread).not.toHaveBeenCalled();
    expect(onThreadSelected).toHaveBeenCalledWith("thread-1");
  });

  it("replies to a thread from pending reply input and selects it", async () => {
    const createThread = vi.fn(async () => null);
    const replyToThread = vi.fn(async () => buildThread("thread-2"));
    const onThreadSelected = vi.fn();

    await submitPendingSubmission({
      pendingSubmission: {
        type: "reply",
        threadId: "thread-2",
        body: "reply",
      },
      nextAuthorName: "Bob",
      createThread,
      replyToThread,
      onThreadSelected,
    });

    expect(replyToThread).toHaveBeenCalledWith({
      threadId: "thread-2",
      authorName: "Bob",
      body: "reply",
    });
    expect(createThread).not.toHaveBeenCalled();
    expect(onThreadSelected).toHaveBeenCalledWith("thread-2");
  });

  it("does nothing when there is no pending submission", async () => {
    const createThread = vi.fn(async () => buildThread("thread-1"));
    const replyToThread = vi.fn(async () => buildThread("thread-2"));
    const onThreadSelected = vi.fn();

    await submitPendingSubmission({
      pendingSubmission: null,
      nextAuthorName: "Alice",
      createThread,
      replyToThread,
      onThreadSelected,
    });

    expect(createThread).not.toHaveBeenCalled();
    expect(replyToThread).not.toHaveBeenCalled();
    expect(onThreadSelected).not.toHaveBeenCalled();
  });
});
