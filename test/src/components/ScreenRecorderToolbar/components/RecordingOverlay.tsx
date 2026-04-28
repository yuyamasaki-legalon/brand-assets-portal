import { createPortal } from "react-dom";
import type { FinalLine } from "../hooks/useSpeechRecognition";
import styles from "../index.module.css";
import type { CursorPosition, Memo, ToolMode } from "../types";
import { CursorHighlight } from "./CursorHighlight";
import { MemoLayer } from "./MemoLayer";
import { SubtitleBar } from "./SubtitleBar";

type RecordingOverlayProps = {
  toolMode: ToolMode;
  cursorPosition: CursorPosition;
  cursorVisible: boolean;
  showSubtitles: boolean;
  transcript: string;
  finalLines: FinalLine[];
  memos: Memo[];
  onAddMemo: (x: number, y: number) => void;
  onUpdateMemo: (id: string, text: string) => void;
  onMoveMemo: (id: string, x: number, y: number) => void;
  onRemoveMemo: (id: string) => void;
};

/**
 * 録画中に画面全体を覆うオーバーレイ。
 *
 * {@link CursorHighlight}、{@link SubtitleBar}、{@link MemoLayer} を
 * `document.body` へのポータルとしてレンダリングする。
 */
export const RecordingOverlay = ({
  toolMode,
  cursorPosition,
  cursorVisible,
  showSubtitles,
  transcript,
  finalLines,
  memos,
  onAddMemo,
  onUpdateMemo,
  onMoveMemo,
  onRemoveMemo,
}: RecordingOverlayProps) => {
  return createPortal(
    <div className={styles.overlay}>
      <CursorHighlight position={cursorPosition} isVisible={cursorVisible} />
      {showSubtitles && <SubtitleBar finalLines={finalLines} transcript={transcript} />}
      <MemoLayer
        memos={memos}
        onAddMemo={onAddMemo}
        onUpdateMemo={onUpdateMemo}
        onMoveMemo={onMoveMemo}
        onRemoveMemo={onRemoveMemo}
        creationEnabled={toolMode === "memo"}
      />
    </div>,
    document.body,
  );
};
