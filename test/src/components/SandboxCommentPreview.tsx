import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PinThreadPopover } from "../features/comment-threads/components/PinThreadPopover";
import type {
  CommentAnchor,
  PinAnchor,
  PinnedCommentThread,
  SurfacePinnedCommentThread,
} from "../features/comment-threads/types";
import { buildLegacySurfaceBaseId, buildStableSurfaceId, type DetectedCommentSurface } from "./commentSurfaceAnchors";
import {
  buildPendingAnchorFromPoint,
  computePreviewScale,
  getAnchorViewportPosition as getAnchorViewportPositionFromMetrics,
} from "./SandboxCommentPreview.helpers";
import styles from "./SandboxCommentPreview.module.css";

interface SandboxCommentPreviewProps {
  pageRoute: string;
  width: number;
  height: number;
  pinMode: boolean;
  popoverEnabled?: boolean;
  pinnedThreads: PinnedCommentThread[];
  surfaceThreads: SurfacePinnedCommentThread[];
  selectedThreadId: string | null;
  currentAuthorName: string | null;
  onSelectThread: (threadId: string | null) => void;
  onCreateThread: (body: string, anchor: CommentAnchor) => void;
  onReplyThread: (threadId: string, body: string) => void;
  onDeleteThread: (threadId: string) => Promise<boolean>;
  deletingThreadId: string | null;
  onToggleResolved: (threadId: string, resolved: boolean) => Promise<void>;
  updatingThreadId: string | null;
  onEditMessage: (threadId: string, messageId: string, body: string) => Promise<boolean>;
  onDeleteMessage: (threadId: string, messageId: string) => Promise<boolean>;
  deletingMessageId: string | null;
  updatingMessageId: string | null;
}

interface FrameMetrics {
  frameLeft: number;
  frameTop: number;
  frameWidth: number;
  frameHeight: number;
  scale: number;
  contentWidth: number;
  contentHeight: number;
  scrollLeft: number;
  scrollTop: number;
}

const INITIAL_METRICS: FrameMetrics = {
  frameLeft: 0,
  frameTop: 0,
  frameWidth: 0,
  frameHeight: 0,
  scale: 1,
  contentWidth: 0,
  contentHeight: 0,
  scrollLeft: 0,
  scrollTop: 0,
};

export const SandboxCommentPreview = ({
  pageRoute,
  width,
  height,
  pinMode,
  popoverEnabled = true,
  pinnedThreads,
  surfaceThreads,
  selectedThreadId,
  currentAuthorName,
  onSelectThread,
  onCreateThread,
  onReplyThread,
  onDeleteThread,
  deletingThreadId,
  onToggleResolved,
  updatingThreadId,
  onEditMessage,
  onDeleteMessage,
  deletingMessageId,
  updatingMessageId,
}: SandboxCommentPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [pendingAnchor, setPendingAnchor] = useState<PinAnchor | null>(null);
  const [metrics, setMetrics] = useState<FrameMetrics>(INITIAL_METRICS);
  const [surfaces, setSurfaces] = useState<DetectedCommentSurface[]>([]);
  const [previewScale, setPreviewScale] = useState(1);

  const iframeSrc = useMemo(() => {
    const url = new URL("/", window.location.origin);
    url.searchParams.set("embedded-preview", "1");
    url.hash = pageRoute;
    return url.toString();
  }, [pageRoute]);

  const detectSurfaces = useCallback((doc: Document): DetectedCommentSurface[] => {
    const viewportWidth = doc.documentElement.clientWidth;
    const viewportHeight = doc.documentElement.clientHeight;
    const candidates = Array.from(doc.querySelectorAll<HTMLElement>('[role="dialog"], [aria-modal="true"]'));
    const seenLegacyIds = new Map<string, number>();

    return candidates
      .filter((element) => {
        if (
          element.matches("[data-comment-ui]") ||
          element.closest("[data-comment-ui]") ||
          element.querySelector("[data-comment-ui]")
        ) {
          return false;
        }

        const rect = element.getBoundingClientRect();
        const frameView = element.ownerDocument.defaultView;
        const style = frameView?.getComputedStyle(element);

        return (
          rect.width >= 240 &&
          rect.height >= 180 &&
          style?.display !== "none" &&
          style?.visibility !== "hidden" &&
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.left < viewportWidth &&
          rect.top < viewportHeight
        );
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const label =
          element.getAttribute("aria-label") ||
          element.querySelector("h1, h2, h3, [data-slot='title']")?.textContent?.trim() ||
          "Overlay";
        const nearLeft = Math.abs(rect.left) <= 24;
        const nearRight = Math.abs(viewportWidth - rect.right) <= 24;
        const edgeAttached = nearLeft || nearRight;
        const kind =
          edgeAttached && rect.height >= viewportHeight * 0.45
            ? "drawer"
            : rect.width <= viewportWidth * 0.55 && rect.height <= viewportHeight * 0.55
              ? "popover"
              : "dialog";
        const explicitKeys = [
          element.dataset.commentSurfaceId,
          element.id,
          element.getAttribute("data-testid"),
          element.getAttribute("aria-labelledby"),
          element.getAttribute("aria-describedby"),
          element.querySelector<HTMLElement>("h1[id], h2[id], h3[id], [data-slot='title'][id]")?.id,
        ].filter((value): value is string => Boolean(value?.trim()));
        const legacyBaseId = buildLegacySurfaceBaseId(kind, label);
        const occurrenceIndex = (seenLegacyIds.get(legacyBaseId) ?? 0) + 1;
        seenLegacyIds.set(legacyBaseId, occurrenceIndex);

        return {
          id: buildStableSurfaceId({
            kind,
            rect: {
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
            },
            viewportWidth,
            viewportHeight,
            explicitKeys,
          }),
          label,
          kind,
          legacyBaseId,
          legacyIds: [`${legacyBaseId}:${occurrenceIndex}`],
          rect: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          },
        } satisfies DetectedCommentSurface;
      });
  }, []);

  const syncMetrics = useCallback(() => {
    const iframe = iframeRef.current;
    const shell = shellRef.current;
    const doc = iframe?.contentDocument;
    const frameWindow = iframe?.contentWindow;

    if (!iframe || !shell || !doc || !frameWindow) {
      return;
    }

    const shellRect = shell.getBoundingClientRect();
    const docElement = doc.documentElement;
    const body = doc.body;
    const contentWidth = Math.max(
      docElement?.scrollWidth ?? 0,
      docElement?.clientWidth ?? 0,
      body?.scrollWidth ?? 0,
      body?.clientWidth ?? 0,
      width,
    );
    const contentHeight = Math.max(
      docElement?.scrollHeight ?? 0,
      docElement?.clientHeight ?? 0,
      body?.scrollHeight ?? 0,
      body?.clientHeight ?? 0,
      height,
    );

    setMetrics({
      frameLeft: shellRect.left,
      frameTop: shellRect.top,
      frameWidth: shellRect.width,
      frameHeight: shellRect.height,
      scale: shellRect.width > 0 ? shellRect.width / width : 1,
      contentWidth,
      contentHeight,
      scrollLeft: frameWindow.scrollX,
      scrollTop: frameWindow.scrollY,
    });
    setSurfaces(detectSurfaces(doc));
  }, [detectSurfaces, height, width]);

  useEffect(() => {
    const shell = shellRef.current;
    const parent = shell?.parentElement;
    if (!shell || !parent) {
      return;
    }

    const updateScale = () => {
      setPreviewScale(computePreviewScale(parent.clientWidth, width));
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });
    observer.observe(parent);
    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [width]);

  useEffect(() => {
    syncMetrics();
  }, [syncMetrics]);

  useEffect(() => {
    void iframeSrc;
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    let cleanupFrameListeners: (() => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const handleLoad = () => {
      syncMetrics();

      const doc = iframe.contentDocument;
      const frameWindow = iframe.contentWindow;
      if (!doc || !frameWindow) {
        return;
      }

      const handleViewportChange = () => {
        syncMetrics();
      };

      doc.addEventListener("scroll", handleViewportChange, true);
      frameWindow.addEventListener("scroll", handleViewportChange, true);
      frameWindow.addEventListener("resize", handleViewportChange);
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("scroll", handleViewportChange, true);

      resizeObserver = new ResizeObserver(() => {
        syncMetrics();
      });

      if (doc.documentElement) {
        resizeObserver.observe(doc.documentElement);
      }
      if (doc.body) {
        resizeObserver.observe(doc.body);
      }

      cleanupFrameListeners = () => {
        doc.removeEventListener("scroll", handleViewportChange, true);
        frameWindow.removeEventListener("scroll", handleViewportChange, true);
        frameWindow.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("scroll", handleViewportChange, true);
        resizeObserver?.disconnect();
        resizeObserver = null;
      };
    };

    iframe.addEventListener("load", handleLoad);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      cleanupFrameListeners?.();
      resizeObserver?.disconnect();
    };
  }, [iframeSrc, syncMetrics]);

  useEffect(() => {
    void iframeSrc;
    setPendingAnchor(null);
    setMetrics(INITIAL_METRICS);
    setSurfaces([]);
  }, [iframeSrc]);

  const handleCaptureClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!pinMode) {
        return;
      }

      onSelectThread(null);
      setPendingAnchor(
        buildPendingAnchorFromPoint({
          pointX: event.clientX,
          pointY: event.clientY,
          containerRect: event.currentTarget.getBoundingClientRect(),
          metrics,
          surfaces,
        }),
      );
    },
    [metrics, onSelectThread, pinMode, surfaces],
  );

  const handleCaptureWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      const frameWindow = iframeRef.current?.contentWindow;
      if (!pinMode || !frameWindow) {
        return;
      }

      event.preventDefault();
      frameWindow.scrollBy({
        left: event.deltaX / metrics.scale,
        top: event.deltaY / metrics.scale,
        behavior: "auto",
      });
      syncMetrics();
    },
    [metrics.scale, pinMode, syncMetrics],
  );

  const markerLayer = typeof document !== "undefined" && metrics.frameWidth > 0 && metrics.frameHeight > 0;
  const getAnchorViewportPosition = useCallback(
    (anchor: PinAnchor) => {
      return getAnchorViewportPositionFromMetrics({ anchor, metrics, surfaces });
    },
    [metrics, surfaces],
  );

  return (
    <div
      ref={shellRef}
      className={styles.shell}
      style={{ width: `${width * previewScale}px`, height: `${height * previewScale}px` }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${previewScale})`,
          transformOrigin: "top left",
        }}
      >
        <iframe
          key={iframeSrc}
          ref={iframeRef}
          title={`${pageRoute} comment preview`}
          src={iframeSrc}
          className={styles.iframe}
        />

        {pinMode ? (
          // biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions lint/a11y/noNoninteractiveElementInteractions: comment placement intentionally uses click capture over iframe
          <div onClick={handleCaptureClick} onWheel={handleCaptureWheel} className={styles.captureLayer} />
        ) : null}
      </div>

      {markerLayer
        ? createPortal(
            <div className={styles.portalLayer}>
              {pinnedThreads.map((thread) => {
                const position = getAnchorViewportPosition(thread.anchor);
                if (!position) {
                  return null;
                }

                return (
                  <div
                    key={`${thread.id}:${thread.resolvedAt ?? "open"}:${thread.updatedAt}`}
                    className={styles.markerHost}
                    style={{ left: `${position.left}px`, top: `${position.top}px` }}
                  >
                    <PinThreadPopover
                      mode="existing"
                      thread={thread}
                      selected={popoverEnabled && selectedThreadId === thread.id}
                      currentAuthorName={currentAuthorName}
                      anchorStyle={{ position: "relative" }}
                      onOpenChange={(open) => {
                        if (!popoverEnabled) {
                          return;
                        }
                        onSelectThread(open ? thread.id : null);
                      }}
                      onReply={onReplyThread}
                      onDeleteThread={onDeleteThread}
                      onToggleResolved={onToggleResolved}
                      deleting={deletingThreadId === thread.id}
                      updating={updatingThreadId === thread.id}
                      onEditMessage={onEditMessage}
                      onDeleteMessage={onDeleteMessage}
                      deletingMessageId={deletingMessageId}
                      updatingMessageId={updatingMessageId}
                    />
                  </div>
                );
              })}

              {surfaceThreads.map((thread) => {
                const position = getAnchorViewportPosition(thread.anchor);
                if (!position) {
                  return null;
                }

                return (
                  <div
                    key={`${thread.id}:${thread.resolvedAt ?? "open"}:${thread.updatedAt}`}
                    className={styles.markerHost}
                    style={{ left: `${position.left}px`, top: `${position.top}px` }}
                  >
                    <PinThreadPopover
                      mode="existing"
                      thread={thread}
                      selected={popoverEnabled && selectedThreadId === thread.id}
                      currentAuthorName={currentAuthorName}
                      anchorStyle={{ position: "relative" }}
                      onOpenChange={(open) => {
                        if (!popoverEnabled) {
                          return;
                        }
                        onSelectThread(open ? thread.id : null);
                      }}
                      onReply={onReplyThread}
                      onDeleteThread={onDeleteThread}
                      onToggleResolved={onToggleResolved}
                      deleting={deletingThreadId === thread.id}
                      updating={updatingThreadId === thread.id}
                      onEditMessage={onEditMessage}
                      onDeleteMessage={onDeleteMessage}
                      deletingMessageId={deletingMessageId}
                      updatingMessageId={updatingMessageId}
                    />
                  </div>
                );
              })}

              {(() => {
                if (!pendingAnchor) return null;
                const position = getAnchorViewportPosition(pendingAnchor);
                if (!position) return null;
                return (
                  <div className={styles.markerHost} style={{ left: `${position.left}px`, top: `${position.top}px` }}>
                    <PinThreadPopover
                      mode="new"
                      anchor={pendingAnchor}
                      open
                      anchorStyle={{ position: "relative" }}
                      onOpenChange={(open) => {
                        if (!open) {
                          setPendingAnchor(null);
                        }
                      }}
                      onCreateThread={(body, anchor) => {
                        onCreateThread(body, anchor);
                        setPendingAnchor(null);
                      }}
                    />
                  </div>
                );
              })()}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};
