import type { ReactNode } from "react";

interface CommentCanvasFrameProps {
  active: boolean;
  children: ReactNode;
}

export const CommentCanvasFrame = ({ active, children }: CommentCanvasFrameProps) => {
  return (
    <div
      style={{
        position: "relative",
        padding: active ? "var(--aegis-space-xLarge)" : "0",
        borderRadius: "calc(var(--aegis-radius-xLarge) + var(--aegis-space-large))",
        background: active
          ? "color-mix(in srgb, var(--aegis-color-background-neutral-subtle) 92%, #d7dee8)"
          : "transparent",
        transition: "padding 160ms ease, background 160ms ease",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};
