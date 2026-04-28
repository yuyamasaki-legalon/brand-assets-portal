import { Button, ButtonGroup, Text, Textarea } from "@legalforce/aegis-react";
import { useState } from "react";
import { formatCommentTimestamp } from "../formatTimestamp";
import type { CommentMessage } from "../types";
import styles from "./ThreadTimeline.module.css";

interface ThreadTimelineProps {
  messages: CommentMessage[];
  compact?: boolean;
  onEditMessage?: (messageId: string, body: string) => Promise<boolean>;
  onDeleteMessage?: (messageId: string) => Promise<boolean>;
  updatingMessageId?: string | null;
  deletingMessageId?: string | null;
}

export const ThreadTimeline = ({
  messages,
  compact = false,
  onEditMessage,
  onDeleteMessage,
  updatingMessageId = null,
  deletingMessageId = null,
}: ThreadTimelineProps) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [draftBody, setDraftBody] = useState("");

  return (
    <div
      className={styles.timeline}
      style={{
        gap: compact ? "var(--aegis-space-small)" : "var(--aegis-space-medium)",
      }}
    >
      {messages.map((message) => {
        const isEditing = editingMessageId === message.id;
        const canMutate = !message.pending && Boolean(onEditMessage || onDeleteMessage);

        return (
          <div
            key={message.id}
            className={styles.messageCard}
            style={{
              padding: compact ? "var(--aegis-space-small)" : "var(--aegis-space-medium)",
              opacity: message.pending ? 0.72 : 1,
            }}
          >
            <div className={styles.messageHeader}>
              <Text variant={compact ? "label.small.bold" : "label.medium.bold"}>{message.authorName}</Text>
              <div className={styles.messageMetaRow}>
                <Text variant="body.xSmall" color="subtle" className={styles.messageMetaText}>
                  {formatCommentTimestamp(message.createdAt)}
                  {message.editedAt ? "（編集済み）" : ""}
                </Text>
                {canMutate ? (
                  <div className={styles.messageActions}>
                    {onEditMessage ? (
                      <Button
                        size="small"
                        variant="plain"
                        disabled={updatingMessageId === message.id || deletingMessageId === message.id}
                        onClick={() => {
                          setEditingMessageId(message.id);
                          setDraftBody(message.body);
                        }}
                      >
                        編集
                      </Button>
                    ) : null}
                    {onDeleteMessage ? (
                      <Button
                        size="small"
                        variant="plain"
                        color="danger"
                        disabled={updatingMessageId === message.id || deletingMessageId === message.id}
                        loading={deletingMessageId === message.id}
                        onClick={() => void onDeleteMessage(message.id)}
                      >
                        削除
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
            {isEditing ? (
              <div className={styles.messageEditor}>
                <Textarea
                  value={draftBody}
                  onChange={(event) => setDraftBody(event.target.value)}
                  minRows={compact ? 2 : 3}
                  maxRows={compact ? 4 : 6}
                />
                <div className={styles.messageEditorActions}>
                  <ButtonGroup>
                    <Button
                      size="small"
                      variant="plain"
                      disabled={updatingMessageId === message.id}
                      onClick={() => {
                        setEditingMessageId(null);
                        setDraftBody("");
                      }}
                    >
                      キャンセル
                    </Button>
                    <Button
                      size="small"
                      color="information"
                      loading={updatingMessageId === message.id}
                      disabled={!draftBody.trim()}
                      onClick={async () => {
                        if (!onEditMessage) {
                          return;
                        }

                        const updated = await onEditMessage(message.id, draftBody);
                        if (updated) {
                          setEditingMessageId(null);
                          setDraftBody("");
                        }
                      }}
                    >
                      保存
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            ) : (
              <Text variant={compact ? "body.small" : "body.medium"} className={styles.messageBody}>
                {message.body}
              </Text>
            )}
          </div>
        );
      })}
    </div>
  );
};
