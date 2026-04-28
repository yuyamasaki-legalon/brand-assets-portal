import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createCommentDebugHeaders } from "../runtime";
import {
  buildThreadCollections,
  mergeThreads,
  removeThread,
  removeThreadMessage,
  replaceThread,
  sortThreads,
  updateThreadMessage,
  updateThreadState,
} from "../threadDerivations";
import type {
  CommentAnchor,
  CommentMessageDeleteResult,
  CommentMessageUpdateResult,
  CommentReplyResult,
  CommentThread,
  CommentThreadsPage,
  ComponentAnchoredCommentThread,
  PinnedCommentThread,
  PositionedCommentThread,
  SurfacePinnedCommentThread,
} from "../types";
import {
  buildThreadListQuery,
  createOptimisticReplyMessage,
  createOptimisticThread,
  isJsonContentType,
  normalizeMessageBody,
  shouldSkipThreadLoading,
} from "./useCommentThreads.helpers";

const API_BASE = "/api/comment-threads";
interface CreateThreadInput {
  authorName: string;
  body: string;
  anchor?: CommentAnchor;
}

interface ReplyThreadInput {
  threadId: string;
  authorName: string;
  body: string;
}

interface UseCommentThreadsReturn {
  threads: CommentThread[];
  pinnedThreads: PinnedCommentThread[];
  surfaceThreads: SurfacePinnedCommentThread[];
  positionedThreads: PositionedCommentThread[];
  componentThreads: ComponentAnchoredCommentThread[];
  loading: boolean;
  loadingMore: boolean;
  hasMoreThreads: boolean;
  error: string | null;
  backendAvailable: boolean | null;
  deletingThreadId: string | null;
  updatingThreadId: string | null;
  deletingMessageId: string | null;
  updatingMessageId: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  createThread: (input: CreateThreadInput) => Promise<CommentThread | null>;
  replyToThread: (input: ReplyThreadInput) => Promise<CommentThread | null>;
  deleteThread: (threadId: string) => Promise<boolean>;
  updateThreadResolvedState: (threadId: string, resolved: boolean) => Promise<CommentThread | null>;
  updateMessage: (threadId: string, messageId: string, body: string) => Promise<boolean>;
  deleteMessage: (threadId: string, messageId: string) => Promise<boolean>;
}

interface UseCommentThreadsOptions {
  enabled?: boolean;
  debugEnabled?: boolean;
}

export const useCommentThreads = (pageRoute: string, options?: UseCommentThreadsOptions): UseCommentThreadsReturn => {
  const enabled = options?.enabled ?? true;
  const debugEnabled = options?.debugEnabled ?? false;
  const [threads, setThreads] = useState<CommentThread[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);
  const [updatingThreadId, setUpdatingThreadId] = useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [updatingMessageId, setUpdatingMessageId] = useState<string | null>(null);
  const backendAvailableRef = useRef<boolean | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const requestHeaders = useMemo(() => createCommentDebugHeaders(debugEnabled), [debugEnabled]);

  const loadThreads = useCallback(
    async ({
      signal,
      cursor,
      append = false,
    }: {
      signal?: AbortSignal;
      cursor?: string | null;
      append?: boolean;
    } = {}) => {
      if (shouldSkipThreadLoading(enabled, backendAvailableRef.current)) {
        setLoading(false);
        setLoadingMore(false);
        setNextCursor(null);
        setThreads([]);
        setError(null);
        return;
      }

      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setThreads([]);
          setNextCursor(null);
        }
        setError(null);

        const response = await fetch(`${API_BASE}?${buildThreadListQuery(pageRoute, cursor)}`, {
          signal,
          headers: requestHeaders,
        });

        if (backendAvailableRef.current === null) {
          backendAvailableRef.current = true;
          setBackendAvailable(true);
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch threads: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!isJsonContentType(contentType)) {
          backendAvailableRef.current = false;
          setBackendAvailable(false);
          return;
        }

        const data = (await response.json()) as CommentThreadsPage;
        if (signal?.aborted) {
          return;
        }

        setThreads((current) => (append ? mergeThreads(current, data.threads) : sortThreads(data.threads)));
        setNextCursor(data.nextCursor);
      } catch (err) {
        if (signal?.aborted) {
          return;
        }

        setError(err instanceof Error ? err.message : "コメントスレッドの取得に失敗しました");
      } finally {
        if (!signal?.aborted) {
          if (append) {
            setLoadingMore(false);
          } else {
            setLoading(false);
          }
        }
      }
    },
    [enabled, pageRoute, requestHeaders],
  );

  const refresh = useCallback(async () => {
    await loadThreads({ cursor: null, append: false });
  }, [loadThreads]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loading || loadingMore) {
      return;
    }

    await loadThreads({ cursor: nextCursor, append: true });
  }, [loadThreads, loading, loadingMore, nextCursor]);

  useEffect(() => {
    const controller = new AbortController();
    void loadThreads({ signal: controller.signal, cursor: null, append: false });

    return () => {
      controller.abort();
    };
  }, [loadThreads]);

  const createThread = useCallback(
    async ({ authorName, body, anchor }: CreateThreadInput) => {
      if (!enabled) {
        return null;
      }

      const now = new Date().toISOString();
      const optimisticThread: CommentThread = createOptimisticThread({
        pageRoute,
        authorName,
        body,
        anchor,
        now,
        createId: () => crypto.randomUUID(),
      });

      setError(null);
      setThreads((current) => sortThreads([optimisticThread, ...current]));

      try {
        const response = await fetch(API_BASE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...requestHeaders,
          },
          body: JSON.stringify({
            pageRoute,
            authorName,
            body,
            anchor,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create thread: ${response.status}`);
        }

        const createdThread = (await response.json()) as CommentThread;
        setThreads((current) => replaceThread(current, optimisticThread.id, createdThread));
        return createdThread;
      } catch (err) {
        setThreads((current) => current.filter((thread) => thread.id !== optimisticThread.id));
        setError(err instanceof Error ? err.message : "スレッドの作成に失敗しました");
        return null;
      }
    },
    [enabled, pageRoute, requestHeaders],
  );

  const replyToThread = useCallback(
    async ({ threadId, authorName, body }: ReplyThreadInput) => {
      if (!enabled) {
        return null;
      }

      const now = new Date().toISOString();
      const optimisticMessage = createOptimisticReplyMessage({
        authorName,
        body,
        now,
        createId: () => crypto.randomUUID(),
      });
      const optimisticMessageId = optimisticMessage.id;
      let snapshotThread: CommentThread | null = null;

      setError(null);
      setThreads((current) =>
        sortThreads(
          current.map((thread) => {
            if (thread.id !== threadId) {
              return thread;
            }

            snapshotThread = thread;

            return {
              ...thread,
              updatedAt: now,
              messages: [...thread.messages, optimisticMessage],
            };
          }),
        ),
      );

      try {
        const response = await fetch(`${API_BASE}/${threadId}/replies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...requestHeaders,
          },
          body: JSON.stringify({
            pageRoute,
            authorName,
            body,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to reply to thread: ${response.status}`);
        }

        const result = (await response.json()) as CommentReplyResult;
        let updatedThread: CommentThread | null = null;
        setThreads((current) => {
          const nextThreads = sortThreads(
            current.map((thread) => {
              if (thread.id !== threadId) {
                return thread;
              }

              return {
                ...thread,
                updatedAt: result.updatedAt,
                resolvedAt: result.resolvedAt ?? thread.resolvedAt,
                messages: thread.messages.map((message) =>
                  message.id === optimisticMessageId ? result.message : message,
                ),
              };
            }),
          );
          updatedThread = nextThreads.find((thread) => thread.id === threadId) ?? null;
          return nextThreads;
        });
        return updatedThread;
      } catch (err) {
        setThreads((current) => {
          if (!snapshotThread) {
            return current;
          }

          const restoredThread = snapshotThread;
          return sortThreads(current.map((thread) => (thread.id === threadId ? restoredThread : thread)));
        });
        setError(err instanceof Error ? err.message : "返信の投稿に失敗しました");
        return null;
      }
    },
    [enabled, pageRoute, requestHeaders],
  );

  const deleteThread = useCallback(
    async (threadId: string) => {
      if (!enabled) {
        return false;
      }

      let snapshotThread: CommentThread | null = null;
      setError(null);
      setDeletingThreadId(threadId);
      setThreads((current) => {
        snapshotThread = current.find((t) => t.id === threadId) ?? null;
        return removeThread(current, threadId);
      });

      try {
        const response = await fetch(`${API_BASE}/${threadId}?page=${encodeURIComponent(pageRoute)}`, {
          method: "DELETE",
          headers: requestHeaders,
        });

        if (!response.ok) {
          throw new Error(`Failed to delete thread: ${response.status}`);
        }

        return true;
      } catch (err) {
        setThreads((current) => {
          if (!snapshotThread) {
            return current;
          }
          const restoredThread = snapshotThread;
          return sortThreads([...current, restoredThread]);
        });
        setError(err instanceof Error ? err.message : "スレッドの削除に失敗しました");
        return false;
      } finally {
        setDeletingThreadId((current) => (current === threadId ? null : current));
      }
    },
    [enabled, pageRoute, requestHeaders],
  );

  const updateThreadResolvedState = useCallback(
    async (threadId: string, resolved: boolean) => {
      if (!enabled) {
        return null;
      }

      const now = new Date().toISOString();
      let snapshotThread: CommentThread | null = null;

      setError(null);
      setUpdatingThreadId(threadId);
      setThreads((current) =>
        sortThreads(
          current.map((thread) => {
            if (thread.id !== threadId) {
              return thread;
            }

            snapshotThread = thread;
            return {
              ...thread,
              updatedAt: now,
              resolvedAt: resolved ? now : null,
            };
          }),
        ),
      );

      try {
        const response = await fetch(`${API_BASE}/${threadId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...requestHeaders,
          },
          body: JSON.stringify({
            pageRoute,
            resolved,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update thread: ${response.status}`);
        }

        const result = (await response.json()) as { threadId: string; updatedAt: string; resolvedAt: string | null };
        let updatedThread: CommentThread | null = null;
        setThreads((current) => {
          const nextThreads = updateThreadState(current, threadId, {
            updatedAt: result.updatedAt,
            resolvedAt: result.resolvedAt,
          });
          updatedThread = nextThreads.find((thread) => thread.id === threadId) ?? null;
          return nextThreads;
        });
        return updatedThread;
      } catch (err) {
        setThreads((current) => {
          if (!snapshotThread) {
            return current;
          }

          const restoredThread = snapshotThread;
          return sortThreads(current.map((thread) => (thread.id === threadId ? restoredThread : thread)));
        });
        setError(err instanceof Error ? err.message : "スレッド状態の更新に失敗しました");
        return null;
      } finally {
        setUpdatingThreadId((current) => (current === threadId ? null : current));
      }
    },
    [enabled, pageRoute, requestHeaders],
  );

  const updateMessage = useCallback(
    async (threadId: string, messageId: string, body: string) => {
      if (!enabled) {
        return false;
      }

      const nextBody = normalizeMessageBody(body);
      if (!nextBody) {
        return false;
      }

      const now = new Date().toISOString();
      let snapshotThread: CommentThread | null = null;

      setError(null);
      setUpdatingMessageId(messageId);
      setThreads((current) => {
        snapshotThread = current.find((t) => t.id === threadId) ?? null;
        return updateThreadMessage(
          current,
          threadId,
          messageId,
          {
            body: nextBody,
            editedAt: now,
          },
          now,
        );
      });

      try {
        const response = await fetch(`${API_BASE}/${threadId}/messages/${messageId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...requestHeaders,
          },
          body: JSON.stringify({
            pageRoute,
            body: nextBody,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update message: ${response.status}`);
        }

        const result = (await response.json()) as CommentMessageUpdateResult;
        setThreads((current) =>
          updateThreadMessage(
            current,
            threadId,
            messageId,
            {
              body: result.body,
              editedAt: result.editedAt,
            },
            result.updatedAt,
          ),
        );
        return true;
      } catch (err) {
        setThreads((current) => {
          if (!snapshotThread) {
            return current;
          }
          const restoredThread = snapshotThread;
          return sortThreads(current.map((t) => (t.id === threadId ? restoredThread : t)));
        });
        setError(err instanceof Error ? err.message : "コメントの編集に失敗しました");
        return false;
      } finally {
        setUpdatingMessageId((current) => (current === messageId ? null : current));
      }
    },
    [enabled, pageRoute, requestHeaders],
  );

  const deleteMessage = useCallback(
    async (threadId: string, messageId: string) => {
      if (!enabled) {
        return false;
      }

      let snapshotThread: CommentThread | null = null;

      setError(null);
      setDeletingMessageId(messageId);
      setThreads((current) => {
        snapshotThread = current.find((t) => t.id === threadId) ?? null;
        return removeThreadMessage(current, threadId, messageId, new Date().toISOString(), false);
      });

      try {
        const response = await fetch(
          `${API_BASE}/${threadId}/messages/${messageId}?page=${encodeURIComponent(pageRoute)}`,
          {
            method: "DELETE",
            headers: requestHeaders,
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to delete message: ${response.status}`);
        }

        const result = (await response.json()) as CommentMessageDeleteResult;
        setThreads((current) =>
          removeThreadMessage(current, threadId, messageId, result.updatedAt, result.deletedThread),
        );
        return true;
      } catch (err) {
        setThreads((current) => {
          if (!snapshotThread) {
            return current;
          }
          const restoredThread = snapshotThread;
          return sortThreads(current.map((t) => (t.id === threadId ? restoredThread : t)));
        });
        setError(err instanceof Error ? err.message : "コメントの削除に失敗しました");
        return false;
      } finally {
        setDeletingMessageId((current) => (current === messageId ? null : current));
      }
    },
    [enabled, pageRoute, requestHeaders],
  );

  const { orderedThreads, pinnedThreads, surfaceThreads, positionedThreads, componentThreads } = useMemo(
    () => buildThreadCollections(threads),
    [threads],
  );

  return {
    threads: orderedThreads,
    pinnedThreads,
    surfaceThreads,
    positionedThreads,
    componentThreads,
    loading,
    loadingMore,
    hasMoreThreads: nextCursor != null,
    error,
    backendAvailable,
    deletingThreadId,
    updatingThreadId,
    deletingMessageId,
    updatingMessageId,
    refresh,
    loadMore,
    createThread,
    replyToThread,
    deleteThread,
    updateThreadResolvedState,
    updateMessage,
    deleteMessage,
  };
};
