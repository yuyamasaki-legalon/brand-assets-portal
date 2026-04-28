import { LfComment, LfPin, LfPinFill } from "@legalforce/aegis-icons";
import { Badge, Button, Icon } from "@legalforce/aegis-react";
import { type MutableRefObject, type ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthorNameDialog, getStoredAuthor } from "../features/comment-threads/components/AuthorNameDialog";
import { CommentCanvasFrame } from "../features/comment-threads/components/CommentCanvasFrame";
import { CommentDrawer } from "../features/comment-threads/components/CommentDrawer";
import { useCommentThreads } from "../features/comment-threads/hooks/useCommentThreads";
import { isLocalCommentDebugEnabled, isLocalCommentHost } from "../features/comment-threads/runtime";
import { countExternalComments, countOpenThreads } from "../features/comment-threads/threadDerivations";
import { useCommentSubmission } from "../features/comment-threads/useCommentSubmission";
import styles from "./SandboxCommentMode.module.css";
import { SandboxCommentPreview } from "./SandboxCommentPreview";

type CommentMode = "prototype" | "comment";

const COMMENT_VIEWPORT_WIDTH = 1280;
const COMMENT_VIEWPORT_MIN_HEIGHT = 800;
export interface CommentButtonState {
  available: boolean;
  active: boolean;
  openThreadCount: number;
}

interface SandboxCommentModeProps {
  children: ReactNode;
  commentToggleRef?: MutableRefObject<(() => void) | null>;
  onCommentStateChange?: (state: CommentButtonState) => void;
}

const isSandboxCommentablePath = (pathname: string): boolean => {
  return pathname.startsWith("/sandbox");
};

export const SandboxCommentMode = ({ children, commentToggleRef, onCommentStateChange }: SandboxCommentModeProps) => {
  const location = useLocation();
  const pageRoute = location.pathname;
  const localCommentHost = isLocalCommentHost(window.location.hostname);
  const localDebugEnabled = isLocalCommentDebugEnabled();
  const localCommentAccessEnabled = !localCommentHost || localDebugEnabled;
  const commentable = isSandboxCommentablePath(pageRoute) && localCommentAccessEnabled;
  const [mode, setMode] = useState<CommentMode>("prototype");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pinMode, setPinMode] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const {
    threads,
    pinnedThreads,
    surfaceThreads,
    positionedThreads,
    loading,
    loadingMore,
    hasMoreThreads,
    error,
    backendAvailable,
    deletingThreadId,
    updatingThreadId,
    deletingMessageId,
    updatingMessageId,
    createThread,
    replyToThread,
    deleteThread,
    updateThreadResolvedState,
    updateMessage,
    deleteMessage,
    refresh,
    loadMore,
  } = useCommentThreads(pageRoute, {
    enabled: commentable,
    debugEnabled: localDebugEnabled,
  });
  const {
    authorName,
    authorDialogOpen,
    openAuthorDialog,
    handleAuthorDialogOpenChange,
    handleCreateThreadSubmission,
    handleReplySubmission,
    handleAuthorSubmit,
    resetTransientState,
  } = useCommentSubmission({
    getInitialAuthorName: getStoredAuthor,
    createThread,
    replyToThread,
    onThreadSelected: setSelectedThreadId,
  });
  const commentModeActive = commentable && mode === "comment";
  const externalCommentCount = useMemo(() => countExternalComments(threads, authorName), [authorName, threads]);
  const openThreadCount = useMemo(() => countOpenThreads(threads), [threads]);

  useEffect(() => {
    if (!pageRoute) {
      return;
    }

    setMode("prototype");
    setDrawerOpen(false);
    setPinMode(false);
    setSelectedThreadId(null);
    resetTransientState();
  }, [pageRoute, resetTransientState]);

  const enterCommentMode = () => {
    setMode("comment");
  };

  const exitCommentMode = () => {
    setMode("prototype");
    setDrawerOpen(false);
    setPinMode(false);
    setSelectedThreadId(null);
    resetTransientState();
  };

  // Expose toggle function via ref for external control (FloatingMenu)
  useEffect(() => {
    if (!commentToggleRef) return;
    commentToggleRef.current = commentModeActive ? exitCommentMode : enterCommentMode;
    return () => {
      commentToggleRef.current = null;
    };
  });

  // Report comment state changes to parent
  useEffect(() => {
    onCommentStateChange?.({
      available: backendAvailable !== false && commentable,
      active: commentModeActive,
      openThreadCount,
    });
  }, [onCommentStateChange, backendAvailable, commentable, commentModeActive, openThreadCount]);

  const handleDeleteThread = async (threadId: string) => {
    setSelectedThreadId((current) => (current === threadId ? null : current));
    return deleteThread(threadId);
  };
  const handleToggleResolved = async (threadId: string, resolved: boolean) => {
    setSelectedThreadId(threadId);
    await updateThreadResolvedState(threadId, resolved);
  };
  const handleEditMessage = async (threadId: string, messageId: string, body: string) => {
    setSelectedThreadId(threadId);
    return updateMessage(threadId, messageId, body);
  };
  const handleDeleteMessage = async (threadId: string, messageId: string) => {
    setSelectedThreadId(threadId);
    return deleteMessage(threadId, messageId);
  };

  if (!commentable || backendAvailable === false) {
    return <>{children}</>;
  }

  return (
    <>
      <div className={styles.root}>
        <div className={`${styles.viewportHost} ${commentModeActive ? styles.viewportHostActive : ""}`}>
          <div className={`${styles.viewportFrame} ${commentModeActive ? styles.viewportFrameActive : ""}`}>
            {commentModeActive ? (
              <CommentCanvasFrame active>
                <SandboxCommentPreview
                  pageRoute={pageRoute}
                  width={COMMENT_VIEWPORT_WIDTH}
                  height={COMMENT_VIEWPORT_MIN_HEIGHT}
                  pinMode={pinMode}
                  popoverEnabled={!drawerOpen}
                  pinnedThreads={pinnedThreads}
                  surfaceThreads={surfaceThreads}
                  selectedThreadId={selectedThreadId}
                  currentAuthorName={authorName}
                  onSelectThread={setSelectedThreadId}
                  onCreateThread={handleCreateThreadSubmission}
                  onReplyThread={handleReplySubmission}
                  onDeleteThread={handleDeleteThread}
                  deletingThreadId={deletingThreadId}
                  onToggleResolved={handleToggleResolved}
                  updatingThreadId={updatingThreadId}
                  onEditMessage={handleEditMessage}
                  onDeleteMessage={handleDeleteMessage}
                  deletingMessageId={deletingMessageId}
                  updatingMessageId={updatingMessageId}
                />
              </CommentCanvasFrame>
            ) : (
              children
            )}
          </div>
        </div>
      </div>

      <CommentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        threads={threads}
        positionedThreads={positionedThreads}
        selectedThreadId={selectedThreadId}
        loading={loading}
        loadingMore={loadingMore}
        hasMoreThreads={hasMoreThreads}
        error={error}
        deletingThreadId={deletingThreadId}
        updatingThreadId={updatingThreadId}
        deletingMessageId={deletingMessageId}
        updatingMessageId={updatingMessageId}
        onSelectThread={setSelectedThreadId}
        onReplyThread={handleReplySubmission}
        onDeleteThread={handleDeleteThread}
        onToggleResolved={handleToggleResolved}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onLoadMore={loadMore}
        onRetry={refresh}
      />

      <AuthorNameDialog
        open={authorDialogOpen}
        initialValue={authorName ?? ""}
        onOpenChange={handleAuthorDialogOpenChange}
        onSubmit={handleAuthorSubmit}
      />

      {commentModeActive ? (
        <div data-comment-ui className={styles.toolbarHost}>
          <div className={styles.toolbar}>
            <Button
              color="information"
              variant={pinMode ? "solid" : "subtle"}
              leading={<Icon>{pinMode ? <LfPinFill /> : <LfPin />}</Icon>}
              onClick={() => setPinMode((current) => !current)}
            >
              {pinMode ? "Pin モードを終了" : "Pin を置く"}
            </Button>
            <Button
              color="information"
              variant={drawerOpen ? "solid" : "subtle"}
              leading={
                <Badge color="danger" count={externalCommentCount} invisible={externalCommentCount === 0}>
                  <Icon>
                    <LfComment />
                  </Icon>
                </Badge>
              }
              onClick={() => setDrawerOpen(true)}
            >
              コメント一覧
            </Button>
            <Button variant="subtle" color="neutral" onClick={openAuthorDialog}>
              {authorName ? authorName : "名前を設定"}
            </Button>
            <Button variant="subtle" color="neutral" onClick={exitCommentMode}>
              終了
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};
