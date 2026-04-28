import type {
  CanvasCommentAnchor,
  CommentThread,
  ComponentAnchoredCommentThread,
  PinnedCommentThread,
  PositionedCommentThread,
  SurfacePinnedCommentThread,
} from "./types";
import { isCanvasAnchor, isComponentAnchor, isSurfaceAnchor } from "./types";

export interface ThreadCollections {
  orderedThreads: CommentThread[];
  pinnedThreads: PinnedCommentThread[];
  surfaceThreads: SurfacePinnedCommentThread[];
  positionedThreads: PositionedCommentThread[];
  componentThreads: ComponentAnchoredCommentThread[];
}

export const sortThreads = (threads: CommentThread[]): CommentThread[] => {
  return [...threads].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
};

export const replaceThread = (
  current: CommentThread[],
  matchId: string,
  nextThread: CommentThread,
): CommentThread[] => {
  return sortThreads(current.map((thread) => (thread.id === matchId ? nextThread : thread)));
};

export const mergeThreads = (current: CommentThread[], incoming: CommentThread[]): CommentThread[] => {
  const merged = new Map(current.map((thread) => [thread.id, thread]));
  for (const thread of incoming) {
    merged.set(thread.id, thread);
  }

  return sortThreads([...merged.values()]);
};

export const removeThread = (current: CommentThread[], matchId: string): CommentThread[] => {
  return current.filter((thread) => thread.id !== matchId);
};

export const appendThreadMessage = (
  current: CommentThread[],
  threadId: string,
  message: CommentThread["messages"][number],
  updatedAt: string,
  resolvedAt?: string | null,
): CommentThread[] => {
  return sortThreads(
    current.map((thread) => {
      if (thread.id !== threadId) {
        return thread;
      }

      return {
        ...thread,
        updatedAt,
        resolvedAt: resolvedAt ?? thread.resolvedAt,
        messages: [...thread.messages.filter((entry) => entry.id !== message.id), message],
      };
    }),
  );
};

export const updateThreadState = (
  current: CommentThread[],
  threadId: string,
  updates: Partial<Pick<CommentThread, "updatedAt" | "resolvedAt">>,
): CommentThread[] => {
  return sortThreads(
    current.map((thread) => {
      if (thread.id !== threadId) {
        return thread;
      }

      return {
        ...thread,
        ...updates,
      };
    }),
  );
};

export const updateThreadMessage = (
  current: CommentThread[],
  threadId: string,
  messageId: string,
  updates: Partial<CommentThread["messages"][number]>,
  updatedAt: string,
): CommentThread[] => {
  return sortThreads(
    current.map((thread) => {
      if (thread.id !== threadId) {
        return thread;
      }

      return {
        ...thread,
        updatedAt,
        messages: thread.messages.map((message) => (message.id === messageId ? { ...message, ...updates } : message)),
      };
    }),
  );
};

export const removeThreadMessage = (
  current: CommentThread[],
  threadId: string,
  messageId: string,
  updatedAt: string | null,
  deletedThread: boolean,
): CommentThread[] => {
  if (deletedThread) {
    return removeThread(current, threadId);
  }

  return sortThreads(
    current
      .map((thread) => {
        if (thread.id !== threadId) {
          return thread;
        }

        const messages = thread.messages.filter((message) => message.id !== messageId);
        if (messages.length === 0) {
          return null;
        }

        return {
          ...thread,
          updatedAt: updatedAt ?? thread.updatedAt,
          messages,
        };
      })
      .filter((thread): thread is CommentThread => thread !== null),
  );
};

export const countExternalComments = (threads: CommentThread[], currentAuthorName: string | null): number => {
  if (threads.length === 0) {
    return 0;
  }

  return threads.reduce((count, thread) => {
    if (thread.resolvedAt) {
      return count;
    }

    const latestMessage = thread.messages[thread.messages.length - 1];
    if (!latestMessage) {
      return count;
    }

    return !currentAuthorName || latestMessage.authorName !== currentAuthorName ? count + 1 : count;
  }, 0);
};

export const countOpenThreads = (threads: CommentThread[]): number => {
  return threads.reduce((count, thread) => (thread.resolvedAt ? count : count + 1), 0);
};

export const buildThreadCollections = (threads: CommentThread[]): ThreadCollections => {
  const orderedThreads = sortThreads(threads);
  const positionedThreads = orderedThreads
    .filter(
      (thread): thread is CommentThread & { anchor: CanvasCommentAnchor | SurfacePinnedCommentThread["anchor"] } =>
        isCanvasAnchor(thread.anchor) || isSurfaceAnchor(thread.anchor),
    )
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
    .map((thread, index) => ({
      ...thread,
      pinIndex: index + 1,
    }));
  const pinnedThreads = positionedThreads.filter((thread): thread is PinnedCommentThread =>
    isCanvasAnchor(thread.anchor),
  );
  const surfaceThreads = positionedThreads.filter((thread): thread is SurfacePinnedCommentThread =>
    isSurfaceAnchor(thread.anchor),
  );
  const componentThreads = orderedThreads.filter((thread): thread is ComponentAnchoredCommentThread =>
    isComponentAnchor(thread.anchor),
  );

  return {
    orderedThreads,
    pinnedThreads,
    surfaceThreads,
    positionedThreads,
    componentThreads,
  };
};
