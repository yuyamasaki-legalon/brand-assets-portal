import { LfAngleDown, LfAngleUp, LfCheckLarge, LfTrash } from "@legalforce/aegis-icons";
import {
  Button,
  ContentHeader,
  ContentHeaderTitle,
  Drawer,
  Icon,
  IconButton,
  ProgressCircle,
  Tag,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import { formatCommentTimestamp } from "../formatTimestamp";
import type { CommentThread, PositionedCommentThread } from "../types";
import styles from "./CommentDrawer.module.css";
import { DeleteThreadDialog } from "./DeleteThreadDialog";
import { ThreadComposer } from "./ThreadComposer";
import { ThreadTimeline } from "./ThreadTimeline";

interface CommentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threads: CommentThread[];
  positionedThreads: PositionedCommentThread[];
  selectedThreadId: string | null;
  loading: boolean;
  loadingMore: boolean;
  hasMoreThreads: boolean;
  error: string | null;
  deletingThreadId: string | null;
  updatingThreadId: string | null;
  deletingMessageId: string | null;
  updatingMessageId: string | null;
  onSelectThread: (threadId: string | null) => void;
  onReplyThread: (threadId: string, body: string) => void;
  onDeleteThread: (threadId: string) => Promise<boolean>;
  onToggleResolved: (threadId: string, resolved: boolean) => Promise<void>;
  onEditMessage: (threadId: string, messageId: string, body: string) => Promise<boolean>;
  onDeleteMessage: (threadId: string, messageId: string) => Promise<boolean>;
  onLoadMore: () => Promise<void>;
  onRetry?: () => void;
}

export const CommentDrawer = ({
  open,
  onOpenChange,
  threads,
  positionedThreads,
  selectedThreadId,
  loading,
  loadingMore,
  hasMoreThreads,
  error,
  deletingThreadId,
  updatingThreadId,
  deletingMessageId,
  updatingMessageId,
  onSelectThread,
  onReplyThread,
  onDeleteThread,
  onToggleResolved,
  onEditMessage,
  onDeleteMessage,
  onLoadMore,
  onRetry,
}: CommentDrawerProps) => {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [confirmingThreadId, setConfirmingThreadId] = useState<string | null>(null);
  const pinIndexMap = useMemo(
    () => new Map(positionedThreads.map((thread) => [thread.id, thread.pinIndex])),
    [positionedThreads],
  );
  const confirmingThread = threads.find((thread) => thread.id === confirmingThreadId) ?? null;
  const confirmingPinIndex = confirmingThreadId ? pinIndexMap.get(confirmingThreadId) : undefined;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} position="start" width="medium">
      <Drawer.Header>
        <div data-comment-ui>
          <ContentHeader size="small">
            <ContentHeaderTitle>コメント一覧</ContentHeaderTitle>
          </ContentHeader>
        </div>
      </Drawer.Header>
      <Drawer.Body>
        <div data-comment-ui className={styles.stack}>
          {loading ? (
            <div className={styles.loadingState}>
              <ProgressCircle size="medium" />
            </div>
          ) : null}

          {error ? (
            <div className={styles.errorState}>
              <Text variant="body.small" color="danger">
                {error}
              </Text>
              {onRetry ? (
                <Button size="small" variant="subtle" onClick={onRetry}>
                  再試行
                </Button>
              ) : null}
            </div>
          ) : null}

          {!loading && threads.length === 0 ? (
            <div className={styles.emptyState}>
              <Text variant="body.medium">
                まだスレッドはありません。Pin を置いて、画面上の気になる場所にコメントしてください。
              </Text>
            </div>
          ) : null}

          {threads.map((thread) => {
            const draftBody = drafts[thread.id] ?? "";
            const pinIndex = pinIndexMap.get(thread.id);
            const isSelected = selectedThreadId === thread.id;
            const latestMessage = thread.messages[thread.messages.length - 1];

            return (
              <div
                key={thread.id}
                className={[
                  styles.threadCard,
                  isSelected ? styles.threadCardSelected : "",
                  thread.pending ? styles.threadCardPending : "",
                ].join(" ")}
              >
                <div className={styles.threadHeaderRow}>
                  <div className={styles.threadBadgeRow}>
                    {pinIndex != null ? (
                      <Tag variant="fill" color="blue" size="small">
                        Pin #{pinIndex}
                      </Tag>
                    ) : (
                      <Text variant="label.medium.bold">General</Text>
                    )}
                    {thread.anchor?.kind === "surface" ? (
                      <Text variant="label.small" color="subtle">
                        {thread.anchor.surfaceLabel}
                      </Text>
                    ) : null}
                  </div>
                  <div className={styles.threadHeaderActions}>
                    {isSelected ? (
                      <Tooltip title={thread.resolvedAt ? "再オープン" : "解決にする"}>
                        <IconButton
                          size="xSmall"
                          variant="plain"
                          color="information"
                          aria-label={thread.resolvedAt ? "再オープン" : "解決にする"}
                          disabled={updatingThreadId === thread.id}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            void onToggleResolved(thread.id, !thread.resolvedAt);
                          }}
                        >
                          <Icon>
                            <LfCheckLarge />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    {isSelected ? (
                      <Tooltip title="スレッドを削除">
                        <IconButton
                          size="xSmall"
                          variant="plain"
                          color="danger"
                          aria-label="スレッドを削除"
                          disabled={deletingThreadId === thread.id}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setConfirmingThreadId(thread.id);
                          }}
                        >
                          <Icon>
                            <LfTrash />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    <Tooltip title={isSelected ? "スレッドを閉じる" : "スレッドを開く"}>
                      <IconButton
                        size="xSmall"
                        variant="plain"
                        color="neutral"
                        aria-label={isSelected ? "スレッドを閉じる" : "スレッドを開く"}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onSelectThread(isSelected ? null : thread.id);
                        }}
                      >
                        <Icon>{isSelected ? <LfAngleUp /> : <LfAngleDown />}</Icon>
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>

                <div className={styles.threadMetaRow}>
                  {thread.resolvedAt ? (
                    <Tag variant="fill" color="lime" size="small">
                      解決済み
                    </Tag>
                  ) : null}
                  <Text variant="body.xSmall" color="subtle">
                    {thread.messages.length} 件のコメント
                  </Text>
                  <Text variant="body.xSmall" color="subtle">
                    ·
                  </Text>
                  <Text variant="body.xSmall" color="subtle">
                    最終更新 {formatCommentTimestamp(thread.updatedAt)}
                  </Text>
                </div>

                {isSelected ? (
                  <>
                    <ThreadTimeline
                      messages={thread.messages}
                      onEditMessage={(messageId, body) => onEditMessage(thread.id, messageId, body)}
                      onDeleteMessage={(messageId) => onDeleteMessage(thread.id, messageId)}
                      deletingMessageId={deletingMessageId}
                      updatingMessageId={updatingMessageId}
                    />
                    {!thread.resolvedAt ? (
                      <ThreadComposer
                        value={draftBody}
                        onChange={(value) => {
                          setDrafts((current) => ({
                            ...current,
                            [thread.id]: value,
                          }));
                        }}
                        onSubmit={() => {
                          const body = draftBody.trim();
                          if (!body) {
                            return;
                          }

                          onReplyThread(thread.id, body);
                          setDrafts((current) => ({
                            ...current,
                            [thread.id]: "",
                          }));
                        }}
                        compact
                        submitLabel="返信"
                        helperText="Cmd/Ctrl + Enter でも返信できます"
                      />
                    ) : null}
                  </>
                ) : latestMessage ? (
                  <div className={styles.threadPreview}>
                    <div className={styles.threadPreviewHeader}>
                      <Text variant="label.small.bold">{latestMessage.authorName}</Text>
                      <Text variant="body.xSmall" color="subtle">
                        {formatCommentTimestamp(latestMessage.createdAt)}
                      </Text>
                    </div>
                    <Text variant="body.small" className={styles.threadPreviewBody}>
                      {latestMessage.body}
                    </Text>
                  </div>
                ) : null}
              </div>
            );
          })}

          {hasMoreThreads ? (
            <Button variant="subtle" color="neutral" disabled={loadingMore} onClick={() => void onLoadMore()}>
              {loadingMore ? "読み込み中..." : "古いスレッドをさらに読み込む"}
            </Button>
          ) : null}
        </div>
      </Drawer.Body>

      <DeleteThreadDialog
        open={confirmingThread !== null}
        pending={confirmingThread != null && deletingThreadId === confirmingThread.id}
        threadLabel={confirmingPinIndex != null ? `Pin #${confirmingPinIndex}` : "全体コメント"}
        commentCount={confirmingThread?.messages.length ?? 0}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmingThreadId(null);
          }
        }}
        onConfirm={async () => {
          if (!confirmingThread) {
            return;
          }

          const deleted = await onDeleteThread(confirmingThread.id);
          if (deleted) {
            setConfirmingThreadId(null);
          }
        }}
      />
    </Drawer>
  );
};
