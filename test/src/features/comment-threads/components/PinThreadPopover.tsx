import { LfCheckLarge, LfTrash } from "@legalforce/aegis-icons";
import { Icon, IconButton, Popover, Tag, Text, Tooltip } from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { useState } from "react";
import { formatCommentTimestamp } from "../formatTimestamp";
import type { PinAnchor, PositionedCommentThread } from "../types";
import { DeleteThreadDialog } from "./DeleteThreadDialog";
import { PinMarker } from "./PinMarker";
import styles from "./PinThreadPopover.module.css";
import { ThreadComposer } from "./ThreadComposer";
import { ThreadTimeline } from "./ThreadTimeline";

const buildAnchorStyle = (anchor: PinAnchor) =>
  ({
    position: "absolute",
    left: `${anchor.xPercent}%`,
    top: `${anchor.yPercent}%`,
    transform: "translate(-50%, -50%)",
    zIndex: 4,
  }) as const;

const POPOVER_CONTENT_WIDTH = "medium";

interface ExistingPinThreadPopoverProps {
  mode: "existing";
  thread: PositionedCommentThread;
  selected: boolean;
  currentAuthorName: string | null;
  anchorStyle?: CSSProperties;
  onOpenChange: (open: boolean) => void;
  onReply: (threadId: string, body: string) => void;
  onDeleteThread: (threadId: string) => Promise<boolean>;
  onToggleResolved: (threadId: string, resolved: boolean) => Promise<void>;
  onEditMessage: (threadId: string, messageId: string, body: string) => Promise<boolean>;
  onDeleteMessage: (threadId: string, messageId: string) => Promise<boolean>;
  deleting?: boolean;
  updating?: boolean;
  deletingMessageId?: string | null;
  updatingMessageId?: string | null;
}

interface NewPinThreadPopoverProps {
  mode: "new";
  anchor: PinAnchor;
  open: boolean;
  anchorStyle?: CSSProperties;
  onOpenChange: (open: boolean) => void;
  onCreateThread: (body: string, anchor: PinAnchor) => void;
}

type PinThreadPopoverProps = ExistingPinThreadPopoverProps | NewPinThreadPopoverProps;

export const PinThreadPopover = (props: PinThreadPopoverProps) => {
  const [replyBody, setReplyBody] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setReplyBody("");
    }

    props.onOpenChange(open);
  };

  if (props.mode === "new") {
    return (
      <Popover open={props.open} onOpenChange={handleOpenChange} placement="bottom-start" arrow closeButton={false}>
        <Popover.Anchor>
          <div style={props.anchorStyle ?? buildAnchorStyle(props.anchor)}>
            <div data-pin-marker className={styles.newMarker}>
              +
            </div>
          </div>
        </Popover.Anchor>
        <Popover.Content width={POPOVER_CONTENT_WIDTH}>
          <Popover.Body>
            <div data-comment-ui className={styles.contentStack}>
              <Text variant="label.medium.bold">この場所にコメント</Text>
              <Text variant="body.xSmall" color="subtle">
                まず 1 件目のコメントを置くと、ここが thread の起点になります。
              </Text>
              <ThreadComposer
                compact
                value={replyBody}
                onChange={setReplyBody}
                onSubmit={() => {
                  const body = replyBody.trim();
                  if (!body) {
                    return;
                  }

                  props.onCreateThread(body, props.anchor);
                  setReplyBody("");
                }}
                helperText="Cmd/Ctrl + Enter でも投稿できます"
              />
            </div>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    );
  }

  return (
    <>
      <Popover open={props.selected} onOpenChange={handleOpenChange} placement="bottom-start" arrow>
        <Popover.Anchor>
          <div style={props.anchorStyle ?? buildAnchorStyle(props.thread.anchor)}>
            <PinMarker
              pinIndex={props.thread.pinIndex}
              resolved={Boolean(props.thread.resolvedAt)}
              selected={props.selected}
              onClick={() => props.onOpenChange(!props.selected)}
            />
          </div>
        </Popover.Anchor>
        <Popover.Content>
          <Popover.Body>
            <div data-comment-ui className={styles.contentStack}>
              <div className={styles.headerRow}>
                <div className={styles.titleStack}>
                  <Text variant="label.medium.bold">Pin #{props.thread.pinIndex}</Text>
                  <Text variant="body.xSmall" color="subtle">
                    {props.thread.messages.length} 件の会話
                  </Text>
                </div>
                <div className={styles.headerActions}>
                  <Text variant="body.xSmall" color="subtle">
                    {formatCommentTimestamp(props.thread.updatedAt)}
                  </Text>
                  <Tooltip title={props.thread.resolvedAt ? "再オープン" : "解決にする"}>
                    <IconButton
                      size="xSmall"
                      variant="plain"
                      color="information"
                      aria-label={props.thread.resolvedAt ? "再オープン" : "解決にする"}
                      disabled={props.updating}
                      onClick={() => void props.onToggleResolved(props.thread.id, !props.thread.resolvedAt)}
                    >
                      <Icon>
                        <LfCheckLarge />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="スレッドを削除">
                    <IconButton
                      size="xSmall"
                      variant="plain"
                      color="danger"
                      aria-label="スレッドを削除"
                      disabled={props.deleting}
                      onClick={() => {
                        setDeleteDialogOpen(true);
                        props.onOpenChange(false);
                      }}
                    >
                      <Icon>
                        <LfTrash />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              {props.thread.resolvedAt ? (
                <div className={styles.statusRow}>
                  <Tag variant="fill" color="lime" size="small">
                    解決済み
                  </Tag>
                  <Text variant="body.xSmall" color="subtle">
                    再オープンすると返信できます
                  </Text>
                </div>
              ) : null}
              <ThreadTimeline
                messages={props.thread.messages}
                compact
                onEditMessage={(messageId, body) => props.onEditMessage(props.thread.id, messageId, body)}
                onDeleteMessage={(messageId) => props.onDeleteMessage(props.thread.id, messageId)}
                deletingMessageId={props.deletingMessageId}
                updatingMessageId={props.updatingMessageId}
              />
              {!props.thread.resolvedAt ? (
                <ThreadComposer
                  compact
                  value={replyBody}
                  onChange={setReplyBody}
                  onSubmit={() => {
                    const body = replyBody.trim();
                    if (!body) {
                      return;
                    }

                    props.onReply(props.thread.id, body);
                    setReplyBody("");
                  }}
                  helperText={
                    props.currentAuthorName
                      ? `${props.currentAuthorName} として返信`
                      : "初回の返信時にニックネームを入力します"
                  }
                  submitLabel="返信"
                />
              ) : null}
            </div>
          </Popover.Body>
        </Popover.Content>
      </Popover>
      <DeleteThreadDialog
        open={deleteDialogOpen}
        pending={props.deleting}
        threadLabel={`Pin #${props.thread.pinIndex}`}
        commentCount={props.thread.messages.length}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={async () => {
          const deleted = await props.onDeleteThread(props.thread.id);
          if (deleted) {
            setDeleteDialogOpen(false);
            handleOpenChange(false);
          }
        }}
      />
    </>
  );
};
