import { useCallback, useRef, useState } from "react";
import type { CommentAnchor, CommentThread } from "./types";

type PendingSubmission =
  | {
      type: "create";
      body: string;
      anchor: CommentAnchor;
    }
  | {
      type: "reply";
      threadId: string;
      body: string;
    };

interface CreateThreadInput {
  authorName: string;
  body: string;
  anchor: CommentAnchor;
}

interface ReplyThreadInput {
  threadId: string;
  authorName: string;
  body: string;
}

interface UseCommentSubmissionOptions {
  getInitialAuthorName: () => string | null;
  createThread: (input: CreateThreadInput) => Promise<CommentThread | null>;
  replyToThread: (input: ReplyThreadInput) => Promise<CommentThread | null>;
  onThreadSelected?: (threadId: string | null) => void;
}

interface UseCommentSubmissionResult {
  authorName: string | null;
  authorDialogOpen: boolean;
  openAuthorDialog: () => void;
  handleAuthorDialogOpenChange: (open: boolean) => void;
  handleCreateThreadSubmission: (body: string, anchor: CommentAnchor) => Promise<void>;
  handleReplySubmission: (threadId: string, body: string) => Promise<void>;
  handleAuthorSubmit: (nextAuthorName: string) => Promise<void>;
  resetTransientState: () => void;
}

interface SubmitPendingSubmissionParams {
  pendingSubmission: PendingSubmission | null;
  nextAuthorName: string;
  createThread: (input: CreateThreadInput) => Promise<CommentThread | null>;
  replyToThread: (input: ReplyThreadInput) => Promise<CommentThread | null>;
  onThreadSelected?: (threadId: string | null) => void;
}

export const submitPendingSubmission = async ({
  pendingSubmission,
  nextAuthorName,
  createThread,
  replyToThread,
  onThreadSelected,
}: SubmitPendingSubmissionParams): Promise<void> => {
  if (!pendingSubmission) {
    return;
  }

  if (pendingSubmission.type === "create") {
    const createdThread = await createThread({
      authorName: nextAuthorName,
      body: pendingSubmission.body,
      anchor: pendingSubmission.anchor,
    });

    if (createdThread) {
      onThreadSelected?.(createdThread.id);
    }

    return;
  }

  const updatedThread = await replyToThread({
    threadId: pendingSubmission.threadId,
    authorName: nextAuthorName,
    body: pendingSubmission.body,
  });

  if (updatedThread) {
    onThreadSelected?.(updatedThread.id);
  }
};

export const useCommentSubmission = ({
  getInitialAuthorName,
  createThread,
  replyToThread,
  onThreadSelected,
}: UseCommentSubmissionOptions): UseCommentSubmissionResult => {
  const [authorName, setAuthorName] = useState<string | null>(() => getInitialAuthorName());
  const [authorDialogOpen, setAuthorDialogOpen] = useState(false);
  const pendingSubmissionRef = useRef<PendingSubmission | null>(null);

  const selectThread = useCallback(
    (threadId: string | null) => {
      onThreadSelected?.(threadId);
    },
    [onThreadSelected],
  );

  const openAuthorDialog = useCallback(() => {
    setAuthorDialogOpen(true);
  }, []);

  const handleCreateThreadSubmission = useCallback(
    async (body: string, anchor: CommentAnchor) => {
      if (!authorName) {
        pendingSubmissionRef.current = { type: "create", body, anchor };
        setAuthorDialogOpen(true);
        return;
      }

      const createdThread = await createThread({
        authorName,
        body,
        anchor,
      });

      if (createdThread) {
        selectThread(createdThread.id);
      }
    },
    [authorName, createThread, selectThread],
  );

  const handleReplySubmission = useCallback(
    async (threadId: string, body: string) => {
      if (!authorName) {
        pendingSubmissionRef.current = { type: "reply", threadId, body };
        setAuthorDialogOpen(true);
        return;
      }

      const updatedThread = await replyToThread({
        threadId,
        authorName,
        body,
      });

      if (updatedThread) {
        selectThread(updatedThread.id);
      }
    },
    [authorName, replyToThread, selectThread],
  );

  const handleAuthorDialogOpenChange = useCallback((open: boolean) => {
    setAuthorDialogOpen(open);
    if (!open) {
      pendingSubmissionRef.current = null;
    }
  }, []);

  const handleAuthorSubmit = useCallback(
    async (nextAuthorName: string) => {
      setAuthorName(nextAuthorName);
      setAuthorDialogOpen(false);

      const currentPending = pendingSubmissionRef.current;
      pendingSubmissionRef.current = null;
      await submitPendingSubmission({
        pendingSubmission: currentPending,
        nextAuthorName,
        createThread,
        replyToThread,
        onThreadSelected: selectThread,
      });
    },
    [createThread, replyToThread, selectThread],
  );

  const resetTransientState = useCallback(() => {
    setAuthorDialogOpen(false);
    pendingSubmissionRef.current = null;
  }, []);

  return {
    authorName,
    authorDialogOpen,
    openAuthorDialog,
    handleAuthorDialogOpenChange,
    handleCreateThreadSubmission,
    handleReplySubmission,
    handleAuthorSubmit,
    resetTransientState,
  };
};
