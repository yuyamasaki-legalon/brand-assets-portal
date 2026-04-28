import { type MouseEvent, useCallback, useRef } from "react";
import styles from "../index.module.css";
import type { Memo } from "../types";

type MemoLayerProps = {
  memos: Memo[];
  onAddMemo: (x: number, y: number) => void;
  onUpdateMemo: (id: string, text: string) => void;
  onMoveMemo: (id: string, x: number, y: number) => void;
  onRemoveMemo: (id: string) => void;
  creationEnabled: boolean;
};

const MemoItem = ({
  memo,
  onUpdate,
  onMove,
  onRemove,
  autoFocus,
}: {
  memo: Memo;
  onUpdate: (id: string, text: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
  autoFocus: boolean;
}) => {
  const dragRef = useRef<{ startX: number; startY: number; memoX: number; memoY: number } | null>(null);

  const handleDragStart = useCallback(
    (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("textarea, button")) return;
      e.preventDefault();
      const memoX = (memo.x / 100) * window.innerWidth;
      const memoY = (memo.y / 100) * window.innerHeight;
      dragRef.current = { startX: e.clientX, startY: e.clientY, memoX, memoY };

      const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
        if (!dragRef.current) return;
        const dx = moveEvent.clientX - dragRef.current.startX;
        const dy = moveEvent.clientY - dragRef.current.startY;
        onMove(memo.id, dragRef.current.memoX + dx, dragRef.current.memoY + dy);
      };

      const handleMouseUp = () => {
        dragRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [memo.id, memo.x, memo.y, onMove],
  );

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: draggable memo
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: draggable memo
    <div className={styles.memo} style={{ left: `${memo.x}%`, top: `${memo.y}%` }} onMouseDown={handleDragStart}>
      <div className={styles.memoDragHandle}>:::</div>
      <button type="button" className={styles.memoClose} onClick={() => onRemove(memo.id)} aria-label="メモを削除">
        x
      </button>
      <textarea
        ref={(el) => {
          if (autoFocus && el) el.focus();
        }}
        className={styles.memoTextarea}
        value={memo.text}
        onChange={(e) => onUpdate(memo.id, e.target.value)}
        placeholder="メモを入力..."
        rows={3}
      />
    </div>
  );
};

/**
 * 録画オーバーレイ上のメモ管理レイヤー。
 *
 * ダブルクリックで新規メモを作成し、
 * 各メモはドラッグ移動・テキスト編集・削除が可能。
 *
 * @param props.creationEnabled - `true` のときダブルクリックによるメモ作成が有効になる
 */
export const MemoLayer = ({
  memos,
  onAddMemo,
  onUpdateMemo,
  onMoveMemo,
  onRemoveMemo,
  creationEnabled,
}: MemoLayerProps) => {
  const prevCountRef = useRef(0);
  const newMemoId = memos.length > prevCountRef.current ? memos[memos.length - 1].id : null;
  prevCountRef.current = memos.length;

  const handleDoubleClick = useCallback(
    (e: MouseEvent) => {
      if (!creationEnabled) return;
      if ((e.target as HTMLElement).closest(`.${styles.memo}`)) return;
      onAddMemo(e.clientX, e.clientY);
    },
    [creationEnabled, onAddMemo],
  );

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: overlay for memo placement
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: overlay for memo placement
    <div
      className={styles.memoLayer}
      onDoubleClick={handleDoubleClick}
      style={{
        pointerEvents: creationEnabled ? "auto" : "none",
        cursor: creationEnabled ? "crosshair" : "default",
      }}
    >
      {memos.map((memo) => (
        <MemoItem
          key={memo.id}
          memo={memo}
          onUpdate={onUpdateMemo}
          onMove={onMoveMemo}
          onRemove={onRemoveMemo}
          autoFocus={memo.id === newMemoId}
        />
      ))}
    </div>
  );
};
