import styles from "../index.module.css";
import type { CursorPosition } from "../types";

type CursorHighlightProps = {
  position: CursorPosition;
  isVisible: boolean;
};

/**
 * カーソル位置に表示する円形のハイライトエフェクト。
 *
 * ハイライトツール使用中にマウスカーソルを追従し、
 * 注目箇所を視覚的に示す。
 */
export const CursorHighlight = ({ position, isVisible }: CursorHighlightProps) => {
  return (
    <div
      className={styles.cursorHighlight}
      style={{
        left: position.x,
        top: position.y,
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
};
