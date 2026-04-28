import { Text } from "@legalforce/aegis-react";
import { type NodeProps, useStore } from "@xyflow/react";

interface GroupNodeData {
  [key: string]: unknown;
  label: string;
  width: number;
  height: number;
}

export function GroupNode({ data }: NodeProps) {
  const { label, width, height } = data as unknown as GroupNodeData;
  const zoom = useStore((s) => s.transform[2]);
  const fontSize = Math.max(12, 14 / zoom);

  return (
    <div
      style={{
        width,
        height,
        borderRadius: "var(--aegis-radius-large)",
        border: "2px dashed var(--aegis-color-border-neutral)",
        backgroundColor: "var(--aegis-color-surface-neutral-xSubtle)",
        opacity: 0.6,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "var(--aegis-space-small)",
          left: "var(--aegis-space-medium)",
        }}
      >
        <Text
          variant="label.medium.bold"
          style={{
            color: "var(--aegis-color-text-subtle)",
            fontSize,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
      </div>
    </div>
  );
}
