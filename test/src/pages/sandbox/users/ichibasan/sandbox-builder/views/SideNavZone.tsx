import { ButtonGroup } from "@legalforce/aegis-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ContentArea } from "../types";
import { ItemSettingsPopover } from "./AddContentView/ItemSettingsPopover";
import styles from "./SideNavZone.module.css";

interface Props {
  active: boolean;
  children: React.ReactNode;
  itemProps: Record<string, string>;
  onUpdate: (props: Record<string, string>) => void;
  area: ContentArea;
  toolbarAlign?: "start" | "end";
}

/**
 * Inner Sidebar 専用ゾーン。
 * - SideNavigation のホバーをブロックし、Edit ツールバー（設定ギアのみ）を表示する
 * - EditZone の黒枠・[+] ボタンは一切表示しない
 * - active=false のときは children をそのまま描画する
 */
export const SideNavZone = ({
  active,
  children,
  itemProps,
  onUpdate,
  area,
  toolbarAlign: _toolbarAlign = "start",
}: Props): React.ReactElement => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hovered, setHovered] = useState(false);
  const [overlayHovered, setOverlayHovered] = useState(false);
  const [childRect, setChildRect] = useState<DOMRect | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (!active) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const child = sentinel.nextElementSibling as HTMLElement | null;
    if (!child) return;

    const updateRect = () => setChildRect(child.getBoundingClientRect());
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
  }, [active]);

  if (!active) return <>{children}</>;

  const showToolbar = hovered || overlayHovered || isSettingsOpen;

  const toolbarStyle: React.CSSProperties = childRect
    ? {
        position: "fixed",
        top: childRect.top + 6,
        right: window.innerWidth - childRect.right + 6,
        zIndex: 110,
      }
    : { display: "none" };

  const handleMouseEnter = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setHovered(true);
  };

  const handleMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => setHovered(false), 200);
  };

  const handleSettingsOpenChange = (open: boolean) => {
    setIsSettingsOpen(open);
    if (!open) {
      hideTimerRef.current = setTimeout(() => {
        if (!overlayHovered) setHovered(false);
      }, 200);
    }
  };

  return (
    <>
      <div ref={sentinelRef} style={{ display: "none" }} />
      {children}
      {createPortal(
        <>
          {childRect && (
            // biome-ignore lint/a11y/noStaticElementInteractions: transparent hover-blocker overlay
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
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          )}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: toolbar wrapper for hover continuity */}
          <div
            role="presentation"
            className={[styles.toolbar, showToolbar ? styles.toolbarVisible : ""].filter(Boolean).join(" ")}
            style={toolbarStyle}
            onMouseEnter={() => {
              if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
                hideTimerRef.current = null;
              }
              setOverlayHovered(true);
            }}
            onMouseLeave={() => {
              setOverlayHovered(false);
              if (!isSettingsOpen) {
                hideTimerRef.current = setTimeout(() => setHovered(false), 200);
              }
            }}
          >
            <ButtonGroup>
              <ItemSettingsPopover
                component="SideNavigation"
                itemProps={itemProps}
                area={area}
                onUpdate={onUpdate}
                onOpenChange={handleSettingsOpenChange}
              />
            </ButtonGroup>
          </div>
        </>,
        document.body,
      )}
    </>
  );
};
