import { useCallback, useEffect, useRef, useState } from "react";
import type { CursorPosition } from "../types";

interface UseCursorHighlightReturn {
  position: CursorPosition;
  isVisible: boolean;
}

/**
 * Tracks cursor position. Highlight is visible when:
 * - `toolActive` is true (highlight tool selected in toolbar), OR
 * - Shift key is held down (temporary highlight in any mode)
 */
export const useCursorHighlight = (toolActive: boolean, recording: boolean): UseCursorHighlightReturn => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [shiftHeld, setShiftHeld] = useState(false);
  const rafRef = useRef<number>(0);
  const posRef = useRef<CursorPosition>({ x: 0, y: 0 });

  const enabled = recording && (toolActive || shiftHeld);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setPosition({ ...posRef.current });
    });
  }, []);

  // Track shift key
  useEffect(() => {
    if (!recording) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShiftHeld(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShiftHeld(false);
    };
    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
      setShiftHeld(false);
    };
  }, [recording]);

  // Track mouse
  useEffect(() => {
    if (!recording) return;
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [recording, handleMouseMove]);

  return { position, isVisible: enabled };
};
