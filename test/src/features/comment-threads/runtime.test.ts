import { describe, expect, it } from "vitest";
import {
  COMMENT_DEBUG_HEADER_NAME,
  createCommentDebugHeaders,
  isCommentDebugRequest,
  isLocalCommentDebugEnabled,
  isLocalCommentHost,
} from "./runtime";

describe("comment runtime", () => {
  it("detects local comment hosts", () => {
    expect(isLocalCommentHost("localhost")).toBe(true);
    expect(isLocalCommentHost("127.0.0.1")).toBe(true);
    expect(isLocalCommentHost("example.com")).toBe(false);
  });

  it("reads the local comment debug flag from globalThis", () => {
    globalThis.__AEGIS_LOCAL_COMMENT_DEBUG__ = true;
    expect(isLocalCommentDebugEnabled()).toBe(true);

    globalThis.__AEGIS_LOCAL_COMMENT_DEBUG__ = false;
    expect(isLocalCommentDebugEnabled()).toBe(false);

    globalThis.__AEGIS_LOCAL_COMMENT_DEBUG__ = undefined;
  });

  it("builds and reads the debug request header", () => {
    expect(createCommentDebugHeaders(false)).toBeUndefined();
    expect(createCommentDebugHeaders(true)).toEqual({
      [COMMENT_DEBUG_HEADER_NAME]: "1",
    });

    const request = new Request("http://localhost:5173/api/comment-threads", {
      headers: {
        [COMMENT_DEBUG_HEADER_NAME]: "1",
      },
    });

    expect(isCommentDebugRequest(request)).toBe(true);
  });
});
