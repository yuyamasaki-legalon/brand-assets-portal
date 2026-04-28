import { LfApps, LfCloseSmall, LfCode, LfComment, LfDisplay, LfPaint } from "@legalforce/aegis-icons";
import { Badge, Icon, IconButton, Tooltip } from "@legalforce/aegis-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { CommentButtonState } from "../SandboxCommentMode";
import styles from "./floatingMenu.module.css";

interface FloatingMenuProps {
  visible: boolean;
  isRecording: boolean;
  liveEditorEnabled: boolean;
  onScreenRecorderToggle: () => void;
  onSettingsOpen: () => void;
  onPickEditable: () => void;
  onCommentToggle: () => void;
  commentState: CommentButtonState;
}

/**
 * 右下に表示されるフローティング Speed Dial メニュー。
 *
 * FAB をクリックするとサブボタン（Screen Recorder / Settings）が展開される。
 * 録画開始時には自動でメニューを閉じる。
 *
 * @remarks `document.body` に {@link https://react.dev/reference/react-dom/createPortal | createPortal} でレンダリングされる。
 */
export const FloatingMenu = ({
  visible,
  isRecording,
  liveEditorEnabled,
  onScreenRecorderToggle,
  onSettingsOpen,
  onPickEditable,
  onCommentToggle,
  commentState,
}: FloatingMenuProps) => {
  const [expanded, setExpanded] = useState(false);

  // Escape key closes the menu
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [expanded]);

  const handleScreenRecorder = useCallback(() => {
    setExpanded(false);
    onScreenRecorderToggle();
  }, [onScreenRecorderToggle]);

  const handleSettings = useCallback(() => {
    setExpanded(false);
    onSettingsOpen();
  }, [onSettingsOpen]);

  const handlePickEditable = useCallback(() => {
    setExpanded(false);
    onPickEditable();
  }, [onPickEditable]);

  const handleComment = useCallback(() => {
    setExpanded(false);
    onCommentToggle();
  }, [onCommentToggle]);

  if (!visible) return null;

  const mainFabClass = [styles.mainFab, isRecording ? styles.mainFabRecording : ""].filter(Boolean).join(" ");

  const sub1Class = [styles.subButton, styles.subButton1, expanded ? styles.subButtonVisible : ""]
    .filter(Boolean)
    .join(" ");

  const sub2Class = [styles.subButton, styles.subButton2, expanded ? styles.subButtonVisible : ""]
    .filter(Boolean)
    .join(" ");

  const sub3Class = [styles.subButton, styles.subButton3, expanded ? styles.subButtonVisible : ""]
    .filter(Boolean)
    .join(" ");

  const sub4Class = [styles.subButton, styles.subButton4, expanded ? styles.subButtonVisible : ""]
    .filter(Boolean)
    .join(" ");

  const iconClass = [styles.mainFabIcon, expanded ? styles.mainFabIconExpanded : ""].filter(Boolean).join(" ");

  return createPortal(
    <div className={styles.container} data-aegis-editor-ui="true">
      {/* Backdrop - closes menu on outside click */}
      {expanded && (
        <button
          type="button"
          className={styles.backdrop}
          onClick={() => setExpanded(false)}
          aria-label="メニューを閉じる"
          tabIndex={-1}
        />
      )}

      {/* Sub-button 4: Comment (topmost) */}
      {commentState.available && (
        <div className={sub4Class}>
          <Tooltip title={commentState.active ? "Exit comment mode" : "View comments"} placement="left">
            <IconButton
              aria-label={commentState.active ? "Exit comment mode" : "View comments"}
              variant="solid"
              size="medium"
              onClick={handleComment}
            >
              <Icon size="small">
                <LfComment />
              </Icon>
            </IconButton>
          </Tooltip>
          <Badge
            color="danger"
            count={commentState.openThreadCount}
            invisible={commentState.openThreadCount === 0}
            className={styles.badgeIndicator}
          />
        </div>
      )}

      {/* Sub-button 3: Screen Recorder */}
      <div className={sub3Class}>
        <Tooltip title="Screen Recorder" placement="left">
          <IconButton aria-label="Screen Recorder を開く" variant="solid" size="medium" onClick={handleScreenRecorder}>
            <Icon size="small">
              <LfDisplay />
            </Icon>
          </IconButton>
        </Tooltip>
      </div>

      {/* Sub-button 2: Live Editor Pick */}
      {liveEditorEnabled && (
        <div className={sub2Class}>
          <Tooltip title="Pick editable element" placement="left">
            <IconButton aria-label="編集要素を選択する" variant="solid" size="medium" onClick={handlePickEditable}>
              <Icon size="small">
                <LfPaint />
              </Icon>
            </IconButton>
          </Tooltip>
        </div>
      )}

      {/* Sub-button 1: Settings (closer to FAB) */}
      <div className={sub1Class}>
        <Tooltip title="Settings" placement="left">
          <IconButton aria-label="設定を開く" variant="solid" size="medium" onClick={handleSettings}>
            <Icon size="small">
              <LfCode />
            </Icon>
          </IconButton>
        </Tooltip>
      </div>

      {/* Main FAB (bottom) */}
      <div className={mainFabClass}>
        <Tooltip title={expanded ? "Close" : "Tools"} placement="left">
          <IconButton
            aria-label={expanded ? "ツールメニューを閉じる" : "ツールメニューを開く"}
            aria-expanded={expanded}
            variant="solid"
            size="medium"
            onClick={() => setExpanded((p) => !p)}
          >
            <span className={iconClass}>
              <Icon size="small">{expanded ? <LfCloseSmall /> : <LfApps />}</Icon>
            </span>
          </IconButton>
        </Tooltip>
      </div>
    </div>,
    document.body,
  );
};
