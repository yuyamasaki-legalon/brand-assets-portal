import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./EditZone.module.css";

interface Props {
  children: React.ReactNode;
  active: boolean;
  label: string;
  toolbar: React.ReactNode;
  /** body エリアなど親の高さを埋める必要がある場合は true */
  fill?: boolean;
  /** popover が開いている間 overlay を強制表示 */
  forceVisible?: boolean;
  /** overlay (toolbar) の水平位置。"end" で右寄せ */
  toolbarAlign?: "start" | "end";
  onPointerLeave?: React.PointerEventHandler<HTMLDivElement>;
  /**
   * wrapper div を追加しない。
   * Header / PageLayoutSidebar など position: sticky な子要素に使用する。
   * overlay は Portal + position: fixed で描画される。
   */
  noWrapper?: boolean;
  /**
   * toolbar を height-0 sticky コンテナに配置し、スクロール時も上部に固定する。
   * body エリア（sidebar/pane/content body）で使用する。
   */
  stickyToolbar?: boolean;
  /** overlay の top 位置を px 単位で上書き。エリアごとに微調整する場合に使用 */
  overlayTopOffset?: number;
  /**
   * noWrapper モード時、toolbar を上下中央・左右 25px 内側に配置する。
   * Inner Sidebar Start/End など縦長エリアで使用。
   */
  toolbarVerticalCenter?: boolean;
  /**
   * noWrapper モード時、子要素へのホバーイベントを透明オーバーレイでブロックする。
   * SideNavigation など hover で展開するコンポーネントに使用。
   * EditZone の枠は childRect の固定サイズのまま表示される。
   */
  blockChildHover?: boolean;
}

export const EditZone = ({
  children,
  active,
  label,
  toolbar,
  fill = false,
  forceVisible = false,
  toolbarAlign = "start",
  onPointerLeave,
  noWrapper = false,
  stickyToolbar = false,
  overlayTopOffset,
  toolbarVerticalCenter = false,
  blockChildHover = false,
}: Props): React.ReactElement => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  // forceVisible が true→false になったとき、次の wrapper 内フォーカスを blur するフラグ
  const blurNextFocusRef = useRef(false);
  const wasForceVisibleRef = useRef(false);
  // overlay 上でポインターが押下中かどうかを追跡（Floating UI の focus return と区別するため）
  const pointerDownOnOverlayRef = useRef(false);

  // noWrapper モード用: 子要素の位置追跡とホバー状態
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hovered, setHovered] = useState(false);
  const [overlayHovered, setOverlayHovered] = useState(false);
  const [childRect, setChildRect] = useState<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const borderFixedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceVisible) {
      wasForceVisibleRef.current = true;
      blurNextFocusRef.current = false;
    } else if (wasForceVisibleRef.current) {
      wasForceVisibleRef.current = false;
      blurNextFocusRef.current = true;
      // ポインター操作なしで overlay 内にフォーカスがある場合（popover close 後の focus return）は即座に blur
      if (overlayRef.current?.contains(document.activeElement) && !pointerDownOnOverlayRef.current) {
        (document.activeElement as HTMLElement)?.blur();
      }
    }
  }, [forceVisible]);

  // noWrapper モード: 子要素へのホバー追跡 + 位置追跡
  useEffect(() => {
    if (!noWrapper || !active) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const child = sentinel.nextElementSibling as HTMLElement | null;
    if (!child) return;

    const updateRect = () => setChildRect(child.getBoundingClientRect());

    // blockChildHover 時は child へのホバーリスナーを登録しない
    // (透明ブロッカーオーバーレイが hover を検知する)
    if (!blockChildHover) {
      const onEnter = () => {
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
          hideTimerRef.current = null;
        }
        setHovered(true);
      };
      const onLeave = () => {
        hideTimerRef.current = setTimeout(() => setHovered(false), 200);
      };
      child.addEventListener("mouseenter", onEnter);
      child.addEventListener("mouseleave", onLeave);

      updateRect();
      const observer = new ResizeObserver(updateRect);
      observer.observe(child);
      window.addEventListener("scroll", updateRect, { capture: true });
      window.addEventListener("resize", updateRect);

      return () => {
        child.removeEventListener("mouseenter", onEnter);
        child.removeEventListener("mouseleave", onLeave);
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
          hideTimerRef.current = null;
        }
        observer.disconnect();
        window.removeEventListener("scroll", updateRect, { capture: true });
        window.removeEventListener("resize", updateRect);
      };
    }

    // blockChildHover: 位置追跡のみ（ホバーはブロッカーに委譲）
    updateRect();
    const observer = new ResizeObserver(updateRect);
    observer.observe(child);
    window.addEventListener("scroll", updateRect, { capture: true });
    window.addEventListener("resize", updateRect);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateRect, { capture: true });
      window.removeEventListener("resize", updateRect);
    };
  }, [noWrapper, active, blockChildHover]);

  // noWrapper モード: ホバー中は RAF ループで毎フレーム DOM を直接更新
  // blockChildHover 時は子要素が展開しないため RAF 不要
  useEffect(() => {
    if (!noWrapper || !active || blockChildHover || !(hovered || overlayHovered || forceVisible)) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const child = sentinel.nextElementSibling as HTMLElement | null;
    if (!child) return;

    // root 要素が fixed-width でも内側の container が展開するケース（SideNavigation）に対応するため
    // firstElementChild の方が大きければそちらを追跡する
    const getTrackTarget = () => {
      const inner = child.firstElementChild as HTMLElement | null;
      if (!inner) return child;
      const childRect = child.getBoundingClientRect();
      const innerRect = inner.getBoundingClientRect();
      return innerRect.width > childRect.width ? inner : child;
    };
    const tick = () => {
      const target = getTrackTarget();
      const rect = target.getBoundingClientRect();
      const border = borderFixedRef.current;
      if (border) {
        border.style.top = `${rect.top + 4}px`;
        border.style.left = `${rect.left + 4}px`;
        border.style.width = `${rect.width - 8}px`;
        border.style.height = `${rect.height - 8}px`;
      }
      // childRect state も更新して overlay 位置に反映
      setChildRect(rect);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [noWrapper, active, blockChildHover, hovered, overlayHovered, forceVisible]);

  if (!active) {
    return <>{children}</>;
  }

  // noWrapper モード: wrapper div を追加せず Portal + fixed でオーバーレイを描画
  if (noWrapper) {
    const showToolbar = hovered || overlayHovered || forceVisible;
    const fixedPos: React.CSSProperties = childRect
      ? toolbarVerticalCenter
        ? toolbarAlign === "end"
          ? {
              top: childRect.top + childRect.height / 2,
              right: window.innerWidth - childRect.right + 25,
              transform: "translateY(-50%)",
            }
          : {
              top: childRect.top + childRect.height / 2,
              left: childRect.left + 25,
              transform: "translateY(-50%)",
            }
        : toolbarAlign === "end"
          ? {
              top: childRect.top + childRect.height / 2,
              right: window.innerWidth - childRect.right + 2,
              transform: "translateY(-50%)",
            }
          : {
              top: childRect.top + 6,
              left: childRect.left + 6,
            }
      : {};

    return (
      <>
        <div ref={sentinelRef} style={{ display: "none" }} />
        {children}
        {createPortal(
          <>
            {childRect && (
              <div
                ref={borderFixedRef}
                className={[styles.borderFixed, showToolbar ? styles.borderFixedVisible : ""].filter(Boolean).join(" ")}
                style={{
                  top: childRect.top + 4,
                  left: childRect.left + 4,
                  width: childRect.width - 8,
                  height: childRect.height - 8,
                }}
              />
            )}
            {blockChildHover && childRect && (
              // biome-ignore lint/a11y/noStaticElementInteractions: transparent overlay for blocking child hover propagation
              <div
                role="presentation"
                style={{
                  position: "fixed",
                  top: childRect.top,
                  left: childRect.left,
                  width: childRect.width,
                  height: childRect.height,
                  zIndex: 68,
                  background: "transparent",
                  pointerEvents: "auto",
                }}
                onMouseEnter={() => {
                  if (hideTimerRef.current) {
                    clearTimeout(hideTimerRef.current);
                    hideTimerRef.current = null;
                  }
                  setHovered(true);
                }}
                onMouseLeave={() => {
                  hideTimerRef.current = setTimeout(() => setHovered(false), 200);
                }}
              />
            )}
            {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: overlay toolbar container needs pointer/mouse events for hover detection */}
            <div
              ref={overlayRef}
              role="toolbar"
              className={[styles.overlayFixed, showToolbar ? styles.overlayFixedVisible : ""].filter(Boolean).join(" ")}
              style={fixedPos}
              aria-label={label}
              onPointerDown={() => {
                pointerDownOnOverlayRef.current = true;
              }}
              onPointerUp={() => {
                pointerDownOnOverlayRef.current = false;
              }}
              onPointerCancel={() => {
                pointerDownOnOverlayRef.current = false;
              }}
              onMouseEnter={() => {
                if (hideTimerRef.current) {
                  clearTimeout(hideTimerRef.current);
                  hideTimerRef.current = null;
                }
                setOverlayHovered(true);
              }}
              onMouseLeave={() => setOverlayHovered(false)}
            >
              {toolbar}
            </div>
          </>,
          document.body,
        )}
      </>
    );
  }

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: edit zone wrapper needs pointer/mouse events to manage hover/focus state
    // biome-ignore lint/a11y/noStaticElementInteractions: edit zone wrapper needs pointer/mouse events to manage hover/focus state
    <div
      ref={wrapperRef}
      className={[styles.wrapper, fill ? styles.wrapperFill : "", forceVisible ? styles.forceVisible : ""]
        .filter(Boolean)
        .join(" ")}
      onPointerLeave={onPointerLeave}
      onMouseDown={(e) => {
        // overlay 以外のクリックはフォーカスを取得させない
        if (overlayRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
      }}
      onFocus={(e) => {
        if (blurNextFocusRef.current) {
          blurNextFocusRef.current = false;
          const inOverlay = overlayRef.current?.contains(e.target as Node);
          // overlay 内へのフォーカスかつポインター操作中（ユーザーが能動的にクリック中）は blur しない
          if (!inOverlay || !pointerDownOnOverlayRef.current) {
            (document.activeElement as HTMLElement)?.blur();
          }
        }
      }}
    >
      {stickyToolbar && (
        <div className={styles.stickyContainer}>
          <div
            ref={overlayRef}
            role="toolbar"
            className={[styles.overlay, toolbarAlign === "end" ? styles.overlayAlignEnd : ""].filter(Boolean).join(" ")}
            style={overlayTopOffset !== undefined ? { top: overlayTopOffset, transform: "none" } : undefined}
            aria-label={label}
            onPointerDown={() => {
              pointerDownOnOverlayRef.current = true;
            }}
            onPointerUp={() => {
              pointerDownOnOverlayRef.current = false;
            }}
            onPointerCancel={() => {
              pointerDownOnOverlayRef.current = false;
            }}
          >
            {toolbar}
          </div>
        </div>
      )}
      {children}
      {!stickyToolbar && (
        <div
          ref={overlayRef}
          role="toolbar"
          className={[styles.overlay, toolbarAlign === "end" ? styles.overlayAlignEnd : ""].filter(Boolean).join(" ")}
          style={overlayTopOffset !== undefined ? { top: overlayTopOffset, transform: "none" } : undefined}
          aria-label={label}
          onPointerDown={() => {
            pointerDownOnOverlayRef.current = true;
          }}
          onPointerUp={() => {
            pointerDownOnOverlayRef.current = false;
          }}
          onPointerCancel={() => {
            pointerDownOnOverlayRef.current = false;
          }}
        >
          {toolbar}
        </div>
      )}
    </div>
  );
};
