import type { FC, ReactNode } from "react";

interface PlaceholderProps {
  children?: ReactNode;
  style?: React.CSSProperties;
}

export const Placeholder: FC<PlaceholderProps> = ({ children, style }) => {
  return (
    <div
      style={{
        padding: "var(--aegis-space-medium)",
        backgroundColor: "var(--aegis-color-background-neutral-subtle)",
        border: "1px dashed var(--aegis-color-border-neutral-default)",
        borderRadius: "var(--aegis-radius-medium)",
        color: "var(--aegis-color-text-neutral-default)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
