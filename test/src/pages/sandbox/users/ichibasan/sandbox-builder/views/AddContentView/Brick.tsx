import { LfTrash } from "@legalforce/aegis-icons";
import { ButtonGroup, Icon, IconButton, Tooltip } from "@legalforce/aegis-react";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ContentArea } from "../../types";
import styles from "./Brick.module.css";
import { ComponentRenderer } from "./ComponentRenderer";
import { ItemSettingsPopover } from "./ItemSettingsPopover";
import type { ContentItem } from "./types";

interface Props {
  item: ContentItem;
  area?: ContentArea;
  onRemove: (id: string) => void;
  onUpdate: (id: string, props: Record<string, string>) => void;
  onItemPopoverOpenChange?: (open: boolean) => void;
  style?: React.CSSProperties;
  toolbarPlacement?: "above" | "below";
  toolbarSide?: "start" | "end";
  allItems?: ContentItem[];
  onReorder?: (items: ContentItem[]) => void;
  popoverPlacement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end";
}

/** CSS :hover が効かないコンポーネント（SideNavigation など）は透明オーバーレイで hover を検知する */
const NEEDS_HOVER_BLOCKER = new Set<string>(["SideNavigation"]);

export const Brick = ({
  item,
  area,
  onRemove,
  onUpdate,
  onItemPopoverOpenChange,
  style,
  toolbarPlacement,
  toolbarSide,
  allItems,
  onReorder,
  popoverPlacement,
}: Props): React.ReactElement => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isVerticalDivider = item.component === "DividerVertical";
  const isDivider = item.component === "Divider" || item.component === "Pagination";
  const needsHoverBlocker = !toolbarPlacement && NEEDS_HOVER_BLOCKER.has(item.component);
  const [isBlockerHovered, setIsBlockerHovered] = useState(false);

  // Portal-based hover state — used only when toolbarPlacement is set
  const [isHovered, setIsHovered] = useState(false);
  const [isGracePeriod, setIsGracePeriod] = useState(false);
  const [toolbarPos, setToolbarPos] = useState<{ left: number; top?: number; bottom?: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toolbarOuterRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoringEnterRef = useRef(false);
  const ignoringEnterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gracePeriodTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateToolbarPos = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    if (toolbarPlacement === "above") {
      setToolbarPos({ left: cx, bottom: window.innerHeight - rect.top });
    } else {
      setToolbarPos({ left: cx, top: rect.bottom });
    }
  }, [toolbarPlacement]);

  const handleEnter = useCallback(
    (_source: "wrapper" | "toolbarOuter") => {
      if (ignoringEnterRef.current) return;
      if (gracePeriodTimerRef.current) {
        clearTimeout(gracePeriodTimerRef.current);
        gracePeriodTimerRef.current = null;
      }
      setIsGracePeriod(false);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setIsHovered(true);
      updateToolbarPos();
    },
    [updateToolbarPos],
  );

  const handleLeave = useCallback((_source: "wrapper" | "toolbarOuter") => {
    hideTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  }, []);

  const markPopoverClosed = useCallback(() => {
    const onWrapper = wrapperRef.current?.matches(":hover") ?? false;
    const onToolbar = toolbarOuterRef.current?.matches(":hover") ?? false;

    if (onWrapper || onToolbar) {
      setIsGracePeriod(true);
      if (gracePeriodTimerRef.current) clearTimeout(gracePeriodTimerRef.current);
      gracePeriodTimerRef.current = setTimeout(() => {
        setIsGracePeriod(false);
        gracePeriodTimerRef.current = null;
      }, 300);
    } else {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setIsHovered(false);
    }

    ignoringEnterRef.current = true;
    if (ignoringEnterTimerRef.current) clearTimeout(ignoringEnterTimerRef.current);
    ignoringEnterTimerRef.current = setTimeout(() => {
      ignoringEnterRef.current = false;
      const w = wrapperRef.current?.matches(":hover") ?? false;
      const t = toolbarOuterRef.current?.matches(":hover") ?? false;
      if (w || t) setIsHovered(true);
    }, 50);
  }, []);

  const handleSettingsOpenChange = (open: boolean) => {
    setIsSettingsOpen(open);
    if (!open && toolbarPlacement) markPopoverClosed();
    onItemPopoverOpenChange?.(open);
  };

  const toolbarVisible = isHovered || isSettingsOpen || isGracePeriod;

  // Portal toolbar — used when toolbarPlacement is set to escape the EditZone stacking context
  if (toolbarPlacement) {
    return (
      <>
        {/* biome-ignore lint/a11y/useSemanticElements: wrapper div cannot be replaced with fieldset as it wraps arbitrary component renderers */}
        {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: hover detection wrapper for portal toolbar visibility */}
        <div
          ref={wrapperRef}
          role="group"
          className={[styles.wrapper, isDivider ? styles.dividerWrapper : "", toolbarVisible ? styles.highlighted : ""]
            .filter(Boolean)
            .join(" ")}
          aria-label={item.component}
          data-item-id={item.id}
          style={style}
          onMouseEnter={() => handleEnter("wrapper")}
          onMouseLeave={() => handleLeave("wrapper")}
        >
          <div inert style={isVerticalDivider ? { display: "contents" } : undefined}>
            <ComponentRenderer
              component={item.component}
              itemProps={item.props}
              area={area}
              onUpdate={(props) => onUpdate(item.id, props)}
            />
          </div>
        </div>

        {toolbarPos &&
          createPortal(
            <>
              {/* biome-ignore lint/a11y/noStaticElementInteractions: hover detection bridge for portal toolbar visibility */}
              <div
                ref={toolbarOuterRef}
                role="presentation"
                className={styles.portalToolbarOuter}
                style={{
                  left: toolbarPos.left,
                  ...(toolbarPos.top !== undefined ? { top: toolbarPos.top } : { bottom: toolbarPos.bottom }),
                  pointerEvents: toolbarVisible ? "auto" : "none",
                }}
                onMouseEnter={() => handleEnter("toolbarOuter")}
                onMouseLeave={() => handleLeave("toolbarOuter")}
              >
                <div
                  role="toolbar"
                  aria-label={`${item.component}の操作`}
                  className={[styles.portalToolbar, toolbarVisible ? styles.portalToolbarVisible : ""]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <ButtonGroup>
                    {!isDivider && (
                      <ItemSettingsPopover
                        component={item.component}
                        itemProps={item.props}
                        itemId={item.id}
                        area={area}
                        onUpdate={(props) => onUpdate(item.id, props)}
                        onOpenChange={handleSettingsOpenChange}
                        allItems={allItems}
                        onReorder={onReorder}
                        onRemove={onRemove}
                        popoverPlacement={popoverPlacement}
                      />
                    )}
                    <Tooltip title="Delete" placement="top">
                      <IconButton variant="plain" size="xSmall" aria-label="Delete" onClick={() => onRemove(item.id)}>
                        <Icon>
                          <LfTrash />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </div>
              </div>
            </>,
            document.body,
          )}
      </>
    );
  }

  // Default inline toolbar — used when toolbarPlacement is not set
  return (
    // biome-ignore lint/a11y/useSemanticElements: this wrapper div cannot be replaced with fieldset as it wraps arbitrary component renderers
    <div
      role="group"
      className={[
        styles.wrapper,
        isSettingsOpen ? styles.settingsOpen : "",
        toolbarSide === "start" ? styles.toolbarStart : "",
        isDivider ? styles.dividerWrapper : "",
        needsHoverBlocker && isBlockerHovered ? styles.hoverActive : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={item.component}
      data-item-id={item.id}
      style={style}
    >
      <div inert style={isVerticalDivider ? { display: "contents" } : undefined}>
        <ComponentRenderer
          component={item.component}
          itemProps={item.props}
          area={area}
          onUpdate={(props) => onUpdate(item.id, props)}
        />
      </div>
      {needsHoverBlocker && (
        // biome-ignore lint/a11y/noStaticElementInteractions: transparent overlay for hover detection on components that block CSS :hover
        <div
          role="presentation"
          className={styles.hoverBlocker}
          onMouseEnter={() => setIsBlockerHovered(true)}
          onMouseLeave={() => setIsBlockerHovered(false)}
        />
      )}
      <div className={styles.toolbar} role="toolbar" aria-label={`${item.component}の操作`}>
        <ButtonGroup>
          {!isDivider && (
            <ItemSettingsPopover
              component={item.component}
              itemProps={item.props}
              itemId={item.id}
              area={area}
              onUpdate={(props) => onUpdate(item.id, props)}
              onOpenChange={handleSettingsOpenChange}
              allItems={allItems}
              onReorder={onReorder}
              onRemove={onRemove}
              popoverPlacement={popoverPlacement}
            />
          )}
          <Tooltip title="Delete" placement="top">
            <IconButton variant="plain" size="xSmall" aria-label="Delete" onClick={() => onRemove(item.id)}>
              <Icon>
                <LfTrash />
              </Icon>
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </div>
    </div>
  );
};
