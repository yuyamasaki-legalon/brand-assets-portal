import { useCallback, useRef, useState } from "react";
import type { ElementSnapshot } from "../types";
import { createSnapshot, resolveInspectableElement } from "../utils/dom";

export const useIframeInspector = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const inspectModeRef = useRef(true);
  const hoveredElementRef = useRef<HTMLElement | null>(null);
  const selectedElementRef = useRef<HTMLElement | null>(null);

  const [inspectMode, setInspectMode] = useState(true);
  const [hoveredElement, setHoveredElement] = useState<ElementSnapshot | null>(null);
  const [selectedElement, setSelectedElement] = useState<ElementSnapshot | null>(null);

  inspectModeRef.current = inspectMode;

  const refreshSnapshots = useCallback(() => {
    setHoveredElement(createSnapshot(hoveredElementRef.current));
    setSelectedElement(createSnapshot(selectedElementRef.current));
  }, []);

  const clearHover = useCallback(() => {
    hoveredElementRef.current = null;
    setHoveredElement(null);
  }, []);

  const clearSelection = useCallback(() => {
    hoveredElementRef.current = null;
    selectedElementRef.current = null;
    setHoveredElement(null);
    setSelectedElement(null);
  }, []);

  const teardownFrameListeners = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  const handleFrameLoad = useCallback(() => {
    teardownFrameListeners();
    clearSelection();

    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    const frameWindow = iframe?.contentWindow;

    if (!iframe || !doc || !frameWindow) return;

    const onMouseMove = (event: MouseEvent) => {
      if (!inspectModeRef.current) return;

      const element = resolveInspectableElement(event.target);
      if (element === hoveredElementRef.current) return;

      hoveredElementRef.current = element;
      setHoveredElement(createSnapshot(element));
    };

    const onClick = (event: MouseEvent) => {
      if (!inspectModeRef.current) return;

      event.preventDefault();
      event.stopPropagation();

      const element = resolveInspectableElement(event.target);
      selectedElementRef.current = element;
      setSelectedElement(createSnapshot(element));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearSelection();
      }
    };

    const onScrollOrResize = () => {
      refreshSnapshots();
    };

    doc.addEventListener("mousemove", onMouseMove, true);
    doc.addEventListener("click", onClick, true);
    doc.addEventListener("keydown", onKeyDown, true);
    doc.addEventListener("scroll", onScrollOrResize, true);
    frameWindow.addEventListener("resize", onScrollOrResize);
    frameWindow.addEventListener("scroll", onScrollOrResize, true);

    cleanupRef.current = () => {
      doc.removeEventListener("mousemove", onMouseMove, true);
      doc.removeEventListener("click", onClick, true);
      doc.removeEventListener("keydown", onKeyDown, true);
      doc.removeEventListener("scroll", onScrollOrResize, true);
      frameWindow.removeEventListener("resize", onScrollOrResize);
      frameWindow.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [clearSelection, refreshSnapshots, teardownFrameListeners]);

  const bindIframeRef = useCallback(
    (node: HTMLIFrameElement | null) => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener("load", handleFrameLoad);
      }

      iframeRef.current = node;

      if (node) {
        node.addEventListener("load", handleFrameLoad);
      }
    },
    [handleFrameLoad],
  );

  return {
    bindIframeRef,
    clearHover,
    clearSelection,
    handleFrameLoad,
    hoveredElement,
    inspectMode,
    selectedElement,
    setInspectMode,
    teardownFrameListeners,
  };
};
