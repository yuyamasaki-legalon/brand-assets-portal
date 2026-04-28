import { LfTrash } from "@legalforce/aegis-icons";
import { Header, Icon, IconButton, Tooltip } from "@legalforce/aegis-react";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ComponentRenderer } from "../AddContentView/ComponentRenderer";
import { ItemSettingsPopover } from "../AddContentView/ItemSettingsPopover";
import type { ContentItem } from "../AddContentView/types";
import styles from "./index.module.css";

interface HeaderItemProps {
  item: ContentItem;
  showControls: boolean;
  onRemove: (id: string) => void;
  onUpdate: (id: string, props: Record<string, string>) => void;
  onItemPopoverOpenChange?: (open: boolean) => void;
  allItems: ContentItem[];
  onReorder: (items: ContentItem[]) => void;
}

const HeaderItem = ({
  item,
  showControls,
  onRemove,
  onUpdate,
  onItemPopoverOpenChange,
  allItems,
  onReorder,
}: HeaderItemProps): React.ReactElement => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isGracePeriod, setIsGracePeriod] = useState(false);
  const [toolbarPos, setToolbarPos] = useState<{ left: number; top: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toolbarOuterRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoringEnterRef = useRef(false);
  const ignoringEnterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gracePeriodTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isVerticalDivider = item.component === "DividerVertical";
  const stretchStyle: React.CSSProperties = isVerticalDivider
    ? { display: "flex", alignItems: "stretch", alignSelf: "stretch", height: "100%" }
    : {};

  const updateToolbarPos = useCallback(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setToolbarPos({ left: rect.left + rect.width / 2, top: rect.bottom });
    }
  }, []);

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

  // Popover 閉じ時の共通処理:
  // - マウスが toolbar 上: グレース期間（300ms）で toolbar を維持 → 連続操作を可能にする
  // - マウスが toolbar 外: 即座に非表示（範囲外クリックで閉じる動作）
  // - 常に 50ms 間 handleEnter を無視（スプリアス mouseenter をブロック）
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
      if (w || t) {
        setIsHovered(true);
      }
    }, 50);
  }, []);

  const toolbarVisible = isHovered || isSettingsOpen || isGracePeriod;

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: hover detection wrapper for portal toolbar visibility */}
      <div
        ref={wrapperRef}
        role="presentation"
        className={[styles.itemWrapper, toolbarVisible ? styles.highlighted : ""].filter(Boolean).join(" ")}
        style={stretchStyle}
        onMouseEnter={() => handleEnter("wrapper")}
        onMouseLeave={() => handleLeave("wrapper")}
      >
        {showControls ? (
          <div inert style={isVerticalDivider ? { display: "contents" } : undefined}>
            <ComponentRenderer component={item.component} itemProps={item.props} />
          </div>
        ) : (
          <ComponentRenderer component={item.component} itemProps={item.props} />
        )}
      </div>

      {showControls &&
        toolbarPos &&
        createPortal(
          <>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: hover detection bridge for portal toolbar visibility */}
            <div
              ref={toolbarOuterRef}
              role="presentation"
              className={styles.toolbarOuter}
              style={{
                left: toolbarPos.left,
                top: toolbarPos.top,
                pointerEvents: toolbarVisible ? "auto" : "none",
              }}
              onMouseEnter={() => handleEnter("toolbarOuter")}
              onMouseLeave={() => handleLeave("toolbarOuter")}
            >
              <div
                role="toolbar"
                aria-label={`${item.component}の操作`}
                className={[styles.toolbar, toolbarVisible ? styles.toolbarVisible : ""].filter(Boolean).join(" ")}
              >
                <ItemSettingsPopover
                  component={item.component}
                  itemProps={item.props}
                  onUpdate={(props) => onUpdate(item.id, props)}
                  onOpenChange={(open) => {
                    setIsSettingsOpen(open);
                    if (!open) markPopoverClosed();
                    onItemPopoverOpenChange?.(open);
                  }}
                  allItems={allItems}
                  onReorder={onReorder}
                  onRemove={onRemove}
                  popoverPlacement={(item.slot ?? "start") === "end" ? "bottom-end" : "bottom-start"}
                />
                <Tooltip title="Delete" placement="top">
                  <IconButton variant="plain" size="xSmall" aria-label="Delete" onClick={() => onRemove(item.id)}>
                    <Icon>
                      <LfTrash />
                    </Icon>
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
};

interface Props {
  items: ContentItem[];
  showControls: boolean;
  onRemove: (id: string) => void;
  onUpdate: (id: string, props: Record<string, string>) => void;
  onReorder: (items: ContentItem[]) => void;
  onItemPopoverOpenChange?: (open: boolean) => void;
}

export const HeaderContentView = ({
  items,
  showControls,
  onRemove,
  onUpdate,
  onReorder,
  onItemPopoverOpenChange,
}: Props): React.ReactElement => {
  const startItems = items.filter((item) => (item.slot ?? "start") === "start");
  const endItems = items.filter((item) => item.slot === "end");

  return (
    <>
      {startItems.map((item) => (
        <Header.Item key={item.id} style={item.component === "DividerVertical" ? { alignSelf: "stretch" } : undefined}>
          <HeaderItem
            item={item}
            showControls={showControls}
            onRemove={onRemove}
            onUpdate={onUpdate}
            allItems={items}
            onReorder={onReorder}
            onItemPopoverOpenChange={onItemPopoverOpenChange}
          />
        </Header.Item>
      ))}
      <Header.Spacer />
      {endItems.map((item) => (
        <Header.Item key={item.id} style={item.component === "DividerVertical" ? { alignSelf: "stretch" } : undefined}>
          <HeaderItem
            item={item}
            showControls={showControls}
            onRemove={onRemove}
            onUpdate={onUpdate}
            allItems={items}
            onReorder={onReorder}
            onItemPopoverOpenChange={onItemPopoverOpenChange}
          />
        </Header.Item>
      ))}
    </>
  );
};
