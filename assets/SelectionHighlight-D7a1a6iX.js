var e=`import { useEffect, useState } from "react";
import styles from "./floatingSourceCodeViewer.module.css";

interface SelectionHighlightProps {
  element: HTMLElement | null;
  label: string | null;
  extraCount: number;
}

const rectsEqual = (a: DOMRect | null, b: DOMRect | null): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.left === b.left && a.top === b.top && a.width === b.width && a.height === b.height;
};

export const SelectionHighlight = ({ element, label, extraCount }: SelectionHighlightProps) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!element) {
      setRect(null);
      return;
    }

    let frameId = 0;
    let cancelled = false;
    let lastRect: DOMRect | null = null;

    const tick = () => {
      if (cancelled) return;
      if (!element.isConnected) {
        if (lastRect !== null) {
          lastRect = null;
          setRect(null);
        }
        frameId = requestAnimationFrame(tick);
        return;
      }
      const nextRect = element.getBoundingClientRect();
      if (!rectsEqual(lastRect, nextRect)) {
        lastRect = nextRect;
        setRect(nextRect);
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [element]);

  if (!rect) return null;

  const labelText = label ? \`\${label}\${extraCount > 0 ? \` +\${extraCount}\` : ""}\` : null;
  const labelTop = rect.top - 26 < 8 ? rect.bottom + 4 : rect.top - 26;
  const labelLeft = Math.min(Math.max(rect.left, 8), window.innerWidth - 240);

  return (
    <>
      <div
        data-aegis-editor-ui="true"
        className={styles.selectionHighlight}
        style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
      />
      {labelText && (
        <div
          data-aegis-editor-ui="true"
          className={styles.selectionHighlightLabel}
          style={{ left: labelLeft, top: labelTop }}
        >
          {labelText}
        </div>
      )}
    </>
  );
};
`;export{e as default};