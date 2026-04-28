import {
  LfCircleFill,
  LfComment,
  LfDisplay,
  LfEye,
  LfMicrophone,
  LfNote,
  LfPen,
  LfSquareFill,
} from "@legalforce/aegis-icons";
import { Icon, IconButton, Tooltip } from "@legalforce/aegis-react";
import type { MutableRefObject, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RecordingOverlay } from "./components/RecordingOverlay";
import { useCursorHighlight } from "./hooks/useCursorHighlight";
import { useMemos } from "./hooks/useMemos";
import { useRecordingTimer } from "./hooks/useRecordingTimer";
import { useScreenRecording } from "./hooks/useScreenRecording";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import styles from "./index.module.css";
import type { ToolMode } from "./types";

const ToolButton = ({
  active,
  disabled,
  onClick,
  title,
  className,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <Tooltip title={title}>
      <IconButton
        aria-label={title}
        variant="plain"
        size="small"
        className={`${styles.toolBtn} ${active ? styles.toolBtnActive : ""} ${className ?? ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        <Icon size="small">{children}</Icon>
      </IconButton>
    </Tooltip>
  );
};

interface ScreenRecorderToolbarProps {
  onRecordingChange?: (recording: boolean) => void;
  showTrigger?: boolean;
  toggleRef?: MutableRefObject<(() => void) | null>;
}

/**
 * 画面録画ツールバー。
 *
 * 録画の開始/停止、ツールモード切替（選択・ハイライト・メモ）、
 * マイク/字幕トグル、経過時間表示を提供する。
 * 録画中は {@link RecordingOverlay} をオーバーレイとして描画する。
 *
 * @param props.onRecordingChange - 録画状態が変化したときのコールバック
 * @param props.showTrigger - 右下のトリガーボタンを表示するか（デフォルト: `true`）
 * @param props.toggleRef - 外部からツールバーの開閉を制御するための ref
 */
export const ScreenRecorderToolbar = ({
  onRecordingChange,
  showTrigger = true,
  toggleRef,
}: ScreenRecorderToolbarProps = {}) => {
  const [open, setOpen] = useState(false);
  const [toolMode, setToolMode] = useState<ToolMode>("select");
  const [subtitles, setSubtitles] = useState(false);
  const [mic, setMic] = useState(false);

  const speech = useSpeechRecognition();
  const handleRecordingStopped = useCallback(() => {
    speech.stop();
    setToolMode("select");
  }, [speech]);
  const {
    state: recordingState,
    startRecording,
    stopRecording,
    error,
    warning,
  } = useScreenRecording({
    onStopped: handleRecordingStopped,
    onRecordingChange,
  });
  const isRecording = recordingState === "recording";
  const timer = useRecordingTimer(isRecording);
  const { position: cursorPosition, isVisible: cursorVisible } = useCursorHighlight(
    toolMode === "highlight",
    isRecording,
  );
  const { memos, addMemo, updateMemo, moveMemo, removeMemo, clearMemos } = useMemos();

  const handleStartRecording = useCallback(async () => {
    clearMemos();
    setToolMode("select");
    const { started, micActive } = await startRecording({ mic });
    if (!started) return;
    // Sync mic state if hardware acquisition failed
    if (mic && !micActive) {
      setMic(false);
    }
    // Only start speech recognition when mic is actually active
    if (micActive && subtitles && speech.isSupported) {
      speech.start();
    }
  }, [startRecording, clearMemos, mic, subtitles, speech]);

  const handleStopRecording = useCallback(() => {
    stopRecording();
    speech.stop();
    setToolMode("select");
  }, [stopRecording, speech]);

  // Expose toggle function via ref for external control (FloatingMenu)
  useEffect(() => {
    if (toggleRef) {
      toggleRef.current = () => setOpen((p) => !p);
      return () => {
        toggleRef.current = null;
      };
    }
  }, [toggleRef]);

  const handleToggleTool = useCallback((mode: ToolMode) => {
    setToolMode((prev) => (prev === mode ? "select" : mode));
  }, []);

  const handleToggleSubtitles = useCallback(() => {
    setSubtitles((prev) => {
      const next = !prev;
      if (isRecording && speech.isSupported) {
        if (next) speech.start();
        else speech.stop();
      }
      return next;
    });
  }, [isRecording, speech]);

  // Trigger button (always visible, bottom-right)
  const trigger = (
    <div className={`${styles.triggerBtn} ${isRecording ? styles.triggerBtnRecording : ""}`}>
      <Tooltip title="Screen Recorder">
        <IconButton
          aria-label="Screen Recorder を開く"
          variant="solid"
          size="medium"
          onClick={() => setOpen((p) => !p)}
          className={styles.triggerIconBtn}
        >
          <Icon size="small">
            <LfDisplay />
          </Icon>
        </IconButton>
      </Tooltip>
    </div>
  );

  // Main toolbar (shown when open or recording)
  const toolbar = (open || isRecording) && (
    <div className={styles.toolbar}>
      <div className={styles.toolGroup}>
        <ToolButton active={toolMode === "select"} onClick={() => setToolMode("select")} title="選択モード">
          <LfEye />
        </ToolButton>
        <ToolButton
          active={toolMode === "highlight"}
          onClick={() => handleToggleTool("highlight")}
          disabled={!isRecording}
          title="ハイライト (Shift 長押しでも可)"
        >
          <LfPen />
        </ToolButton>
        <ToolButton
          active={toolMode === "memo"}
          onClick={() => handleToggleTool("memo")}
          disabled={!isRecording}
          title="メモ (ダブルクリックで追加)"
        >
          <LfNote />
        </ToolButton>
      </div>

      <div className={styles.separator} />

      <div className={styles.toolGroup}>
        {isRecording ? (
          <ToolButton onClick={handleStopRecording} className={styles.stopBtn} title="録画停止">
            <LfSquareFill />
          </ToolButton>
        ) : (
          <ToolButton onClick={handleStartRecording} className={styles.recordBtn} title="録画開始">
            <LfCircleFill />
          </ToolButton>
        )}
        <ToolButton
          active={mic}
          onClick={() => setMic((p) => !p)}
          disabled={isRecording}
          title={`マイク ${mic ? "ON" : "OFF"}${isRecording ? " (録画中は変更不可)" : ""}`}
        >
          <LfMicrophone />
        </ToolButton>
        <ToolButton
          active={subtitles}
          onClick={handleToggleSubtitles}
          disabled={isRecording || !speech.isSupported}
          title={`字幕 ${subtitles ? "ON" : "OFF"}${!speech.isSupported ? " (Chrome/Edge のみ)" : isRecording ? " (録画中は変更不可)" : ""}`}
        >
          <LfComment />
        </ToolButton>
      </div>

      {isRecording && (
        <>
          <div className={styles.separator} />
          <div className={styles.timerGroup}>
            <span className={styles.recDot} />
            <span className={styles.timerText}>{timer}</span>
          </div>
        </>
      )}

      {(error || warning) && (
        <>
          <div className={styles.separator} />
          <span className={error ? styles.errorText : styles.warningText}>{error || warning}</span>
        </>
      )}
    </div>
  );

  return (
    <>
      {createPortal(
        <>
          {showTrigger && trigger}
          {toolbar}
        </>,
        document.body,
      )}
      {isRecording && (
        <RecordingOverlay
          toolMode={toolMode}
          cursorPosition={cursorPosition}
          cursorVisible={cursorVisible}
          showSubtitles={subtitles}
          transcript={speech.transcript}
          finalLines={speech.finalLines}
          memos={memos}
          onAddMemo={addMemo}
          onUpdateMemo={updateMemo}
          onMoveMemo={moveMemo}
          onRemoveMemo={removeMemo}
        />
      )}
    </>
  );
};
