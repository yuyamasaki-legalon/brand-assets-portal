import { LfLink } from "@legalforce/aegis-icons";
import { Badge, Icon, Text } from "@legalforce/aegis-react";
import { Handle, Position } from "@xyflow/react";
import type { ScreenBadge, ScreenNodeData } from "./types";

interface ScreenNodeProps {
  data: ScreenNodeData;
}

const CARD_WIDTH = 280;
const CARD_HEIGHT = 480;

export function ScreenNode({ data }: ScreenNodeProps) {
  const allBadges: ScreenBadge[] = [];

  if (data.stateCount && data.stateCount > 0) {
    allBadges.push({ label: `${data.stateCount} states`, color: "neutral" });
  }
  if (data.variantCount && data.variantCount > 0) {
    allBadges.push({ label: `${data.variantCount} variants`, color: "success" });
  }
  if (data.badges) {
    allBadges.push(...(data.badges as ScreenBadge[]));
  }

  const routePath = data.path as string | undefined;
  const preview = data.preview as React.ReactNode | undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
      {/* Badges row */}
      {allBadges.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {allBadges.map((badge) => (
            <Badge key={badge.label} color={badge.color || "neutral"}>
              {badge.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Title + path */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <Text variant="title.xSmall">{data.label as string}</Text>
        {routePath && (
          <Text
            variant="body.xSmall"
            style={{
              fontFamily:
                "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
              color: "var(--aegis-color-text-subtle)",
            }}
          >
            {routePath}
          </Text>
        )}
      </div>

      {/* Screen card frame */}
      <div
        style={{
          position: "relative",
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 20,
          border: data.isFocus
            ? "3px solid var(--aegis-color-border-information)"
            : "1px solid var(--aegis-color-border-default)",
          backgroundColor: "var(--aegis-color-background-default)",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          cursor: routePath ? "pointer" : "default",
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: "var(--aegis-color-border-neutral)",
            width: 8,
            height: 8,
            left: -4,
          }}
        />

        {/* Preview content */}
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {preview ? (
            preview
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "var(--aegis-color-text-subtle)",
              }}
            >
              <Text variant="body.small" color="subtle">
                {data.label as string}
              </Text>
            </div>
          )}
        </div>

        {routePath && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              color: "var(--aegis-color-text-subtle)",
              opacity: 0.6,
            }}
          >
            <Icon size="xSmall">
              <LfLink />
            </Icon>
          </div>
        )}

        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: "var(--aegis-color-border-neutral)",
            width: 8,
            height: 8,
            right: -4,
          }}
        />
      </div>
    </div>
  );
}

export { CARD_HEIGHT, CARD_WIDTH };
