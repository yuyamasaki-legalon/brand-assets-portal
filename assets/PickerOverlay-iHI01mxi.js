var e=`import { Button, Text } from "@legalforce/aegis-react";
import { useEffect } from "react";
import styles from "./floatingSourceCodeViewer.module.css";

interface PickerOverlayProps {
  hoveredElementRect: DOMRect | null;
  hoveredElementVariant: string | null;
  hoveredTargetLabel: string | null;
  hoveredCandidateCount: number;
  onCancel: () => void;
}

export const PickerOverlay = ({
  hoveredElementRect,
  hoveredElementVariant,
  hoveredTargetLabel,
  hoveredCandidateCount,
  onCancel,
}: PickerOverlayProps) => {
  // Show crosshair cursor on the whole page while picker is active to indicate selection mode.
  useEffect(() => {
    document.documentElement.dataset.aegisPickerActive = "true";
    return () => {
      delete document.documentElement.dataset.aegisPickerActive;
    };
  }, []);

  const hasHover = hoveredElementRect !== null;

  return (
    <>
      <div data-aegis-editor-ui="true" className={styles.pickerInfoPanel} aria-live="polite">
        <div className={styles.pickerInfoRow}>
          <Text variant="label.small.bold">ピックモード</Text>
          <Button size="small" variant="subtle" onClick={onCancel}>
            キャンセル
          </Button>
        </div>
        <Text as="p" variant="body.xSmall" color="subtle">
          {hasHover ? "クリックで選択 / 別の要素にホバーで切替" : "編集したい要素にカーソルを合わせてください"}
        </Text>
        <div className={styles.pickerShortcutRow}>
          <kbd className={styles.pickerKbd}>Click</kbd>
          <Text as="span" variant="body.xSmall" color="subtle">
            選択
          </Text>
          <kbd className={styles.pickerKbd}>Esc</kbd>
          <Text as="span" variant="body.xSmall" color="subtle">
            キャンセル
          </Text>
        </div>
        {hoveredTargetLabel && (
          <Text as="p" variant="body.xSmall">
            <span className={styles.pickerInfoMuted}>候補:</span> {hoveredTargetLabel}
            {hoveredCandidateCount > 1 ? \` 他 \${hoveredCandidateCount - 1} 件\` : ""}
            {hoveredElementVariant ? \` · variant: \${hoveredElementVariant}\` : ""}
          </Text>
        )}
      </div>

      {hoveredElementRect && (
        <>
          <div
            className={styles.pickerHighlight}
            style={{
              left: hoveredElementRect.left,
              top: hoveredElementRect.top,
              width: hoveredElementRect.width,
              height: hoveredElementRect.height,
            }}
          />
          {hoveredTargetLabel && (
            <div
              className={styles.pickerHighlightLabel}
              style={{
                left: Math.min(Math.max(hoveredElementRect.left, 8), window.innerWidth - 240),
                top: hoveredElementRect.top - 26 < 8 ? hoveredElementRect.bottom + 4 : hoveredElementRect.top - 26,
              }}
            >
              {hoveredTargetLabel}
              {hoveredCandidateCount > 1 ? \` +\${hoveredCandidateCount - 1}\` : ""}
            </div>
          )}
        </>
      )}
    </>
  );
};
`;export{e as default};