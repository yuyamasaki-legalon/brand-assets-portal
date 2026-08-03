var e=`import { useEffect } from "react";

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (target.isContentEditable) return true;
  return false;
};

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export const isModifierActive = (event: KeyboardEvent): boolean => (isMac ? event.metaKey : event.ctrlKey);

interface GlobalShortcutsArgs {
  enabled: boolean;
  isPickerActive: boolean;
  isQuickEditorOpen: boolean;
  onStartPick: () => void;
}

/**
 * Global shortcuts active anywhere on the page when FSCV is enabled.
 * - Shift+Alt+E (Shift+Option+E on macOS): enter pick mode.
 *   Use event.code instead of event.key so macOS dead-key composition (e.g. Option+E => ´) does not block detection.
 */
export const useGlobalShortcuts = ({
  enabled,
  isPickerActive,
  isQuickEditorOpen,
  onStartPick,
}: GlobalShortcutsArgs) => {
  useEffect(() => {
    if (!enabled) return;
    const handler = (event: KeyboardEvent) => {
      if (isPickerActive || isQuickEditorOpen) return;
      if (isTypingTarget(event.target)) return;

      const isPickShortcut = event.altKey && event.shiftKey && event.code === "KeyE";
      if (!isPickShortcut) return;

      event.preventDefault();
      onStartPick();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, isPickerActive, isQuickEditorOpen, onStartPick]);
};

interface QuickEditorShortcutsArgs {
  enabled: boolean;
  candidateIds: string[];
  selectedTargetId: string | null;
  onSelectCandidate: (id: string) => void;
  onClose: () => void;
  onApply: () => void;
  onApplyAndNext: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

/**
 * Shortcuts active while the QuickEditor floating panel is open.
 * - Esc: close
 * - Cmd/Ctrl+Enter: apply
 * - Cmd/Ctrl+Shift+Enter: apply & pick next
 * - Cmd/Ctrl+Z: undo
 * - Cmd/Ctrl+Shift+Z: redo
 * - [ / ]: cycle candidates (only when not typing)
 */
export const useQuickEditorShortcuts = ({
  enabled,
  candidateIds,
  selectedTargetId,
  onSelectCandidate,
  onClose,
  onApply,
  onApplyAndNext,
  onUndo,
  onRedo,
}: QuickEditorShortcutsArgs) => {
  useEffect(() => {
    if (!enabled) return;
    const handler = (event: KeyboardEvent) => {
      const typing = isTypingTarget(event.target);
      const modifier = isModifierActive(event);

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (modifier && event.key === "Enter") {
        event.preventDefault();
        if (event.shiftKey) onApplyAndNext();
        else onApply();
        return;
      }

      if (modifier && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) onRedo();
        else onUndo();
        return;
      }

      if (!typing && (event.key === "[" || event.key === "]") && candidateIds.length > 1) {
        event.preventDefault();
        const currentIndex = selectedTargetId ? candidateIds.indexOf(selectedTargetId) : -1;
        const delta = event.key === "]" ? 1 : -1;
        const fallback = delta === 1 ? 0 : candidateIds.length - 1;
        const nextIndex =
          currentIndex === -1 ? fallback : (currentIndex + delta + candidateIds.length) % candidateIds.length;
        onSelectCandidate(candidateIds[nextIndex]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, candidateIds, selectedTargetId, onSelectCandidate, onClose, onApply, onApplyAndNext, onUndo, onRedo]);
};
`;export{e as default};