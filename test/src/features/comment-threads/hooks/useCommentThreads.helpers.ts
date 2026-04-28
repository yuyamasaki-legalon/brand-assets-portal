import type { CommentAnchor, CommentMessage, CommentThread } from "../types";

export const THREAD_PAGE_SIZE = 50;

export const shouldSkipThreadLoading = (enabled: boolean, backendAvailable: boolean | null): boolean => {
  return !enabled || backendAvailable === false;
};

export const buildThreadListQuery = (pageRoute: string, cursor?: string | null): string => {
  const params = new URLSearchParams({
    page: pageRoute,
    limit: String(THREAD_PAGE_SIZE),
  });

  if (cursor) {
    params.set("cursor", cursor);
  }

  return params.toString();
};

export const isJsonContentType = (contentType: string | null): boolean => {
  return contentType?.includes("application/json") ?? false;
};

export const createOptimisticThread = ({
  pageRoute,
  authorName,
  body,
  anchor,
  now,
  createId,
}: {
  pageRoute: string;
  authorName: string;
  body: string;
  anchor?: CommentAnchor;
  now: string;
  createId: () => string;
}): CommentThread => ({
  id: `local-thread-${createId()}`,
  pageRoute,
  createdAt: now,
  updatedAt: now,
  anchor,
  pending: true,
  messages: [
    {
      id: `local-message-${createId()}`,
      authorName,
      body,
      createdAt: now,
      pending: true,
    },
  ],
});

export const createOptimisticReplyMessage = ({
  authorName,
  body,
  now,
  createId,
}: {
  authorName: string;
  body: string;
  now: string;
  createId: () => string;
}): CommentMessage => ({
  id: `local-message-${createId()}`,
  authorName,
  body,
  createdAt: now,
  editedAt: null,
  pending: true,
});

export const normalizeMessageBody = (body: string): string => body.trim();
