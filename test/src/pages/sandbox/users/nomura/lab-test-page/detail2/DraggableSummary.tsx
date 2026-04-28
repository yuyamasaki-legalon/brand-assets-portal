import { LfMenu } from "@legalforce/aegis-icons";
import { Icon, Text } from "@legalforce/aegis-react";
import type { ReactNode } from "react";
import { useState } from "react";

export type SummaryPosition = "top-left" | "bottom-left" | "top-right" | "bottom-right";

interface DraggableSummaryProps {
  children: ReactNode;
  currentPosition: SummaryPosition;
}

export function DraggableSummary({ children, currentPosition }: DraggableSummaryProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", "summary");
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
  };

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: ドラッグ&ドロップ操作に必要なイベント
    <section
      aria-label="案件概要"
      className="case-detail-summary"
      data-dragging={isDragging}
      data-position={currentPosition}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="case-detail-summary-header">
        <Text variant="body.medium.bold">案件概要</Text>
        <Icon size="small" color="subtle">
          <LfMenu />
        </Icon>
      </div>
      <div className="case-detail-summary-body">{children}</div>
    </section>
  );
}

// ドロップ可能なパネルのProps
interface DroppablePanelProps {
  children: ReactNode;
  className: string;
  side: "left" | "right";
  onDrop: (position: SummaryPosition) => void;
  currentPosition: SummaryPosition;
}

export function DroppablePanel({ children, className, side, onDrop, currentPosition }: DroppablePanelProps) {
  const [dropPosition, setDropPosition] = useState<"top" | "bottom" | null>(null);

  // 現在の案件概要のサイド
  const currentSide = currentPosition.includes("left") ? "left" : "right";
  // 同じサイドかどうか
  const isSameSide = side === currentSide;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    // マウス位置からドロップ位置を判定
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const isTop = y < rect.height / 2;
    setDropPosition(isTop ? "top" : "bottom");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setDropPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const isTop = y < rect.height / 2;

    const newPosition: SummaryPosition = isTop
      ? side === "left"
        ? "top-left"
        : "top-right"
      : side === "left"
        ? "bottom-left"
        : "bottom-right";

    // 現在位置と同じなら何もしない
    if (newPosition !== currentPosition) {
      onDrop(newPosition);
    }
    setDropPosition(null);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: ドラッグ&ドロップエリアのためイベントハンドラが必要
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: ドラッグ&ドロップ操作に必要なイベント
    <section
      className={className}
      data-drop-position={dropPosition}
      data-same-side={isSameSide}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      {dropPosition && (
        <div
          className={isSameSide ? "case-detail-drop-indicator-full" : "case-detail-drop-indicator-edge"}
          data-position={dropPosition}
        >
          <Text variant="body.small" color="subtle">
            {dropPosition === "top" ? "上" : "下"}に移動
          </Text>
        </div>
      )}
    </section>
  );
}
