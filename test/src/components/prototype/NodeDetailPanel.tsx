import { LfArrowUpRightFromSquare, LfCloseSmall, LfLayoutHorizon, LfLayoutVertical } from "@legalforce/aegis-icons";
import { Badge, Button, Icon, IconButton, Text, Tooltip } from "@legalforce/aegis-react";
import { useState } from "react";
import type { ScreenBadge, ScreenNodeData, ScreenPatternGroup } from "./types";

type LayoutMode = "single" | "side-by-side";

interface NodeDetailPanelProps {
  data: ScreenNodeData;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

function PatternGroupSection({ group, layout }: { group: ScreenPatternGroup; layout: LayoutMode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
        <Text variant="label.small" color="information">
          {group.name}
        </Text>
        <Text variant="body.xSmall" color="subtle">
          {group.patterns.length}
        </Text>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: layout === "side-by-side" ? `repeat(${Math.min(group.patterns.length, 2)}, 1fr)` : "1fr",
          gap: "var(--aegis-space-medium)",
        }}
      >
        {group.patterns.map((pattern) => (
          <div
            key={pattern.name}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-xxSmall)",
            }}
          >
            <Text variant="label.small">{pattern.name}</Text>
            <div
              style={{
                border: "1px solid var(--aegis-color-border-default)",
                borderRadius: "var(--aegis-radius-large)",
                overflow: "hidden",
                backgroundColor: "var(--aegis-color-background-default)",
              }}
            >
              {pattern.preview}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NodeDetailPanel({ data, onClose, onNavigate }: NodeDetailPanelProps) {
  const [layout, setLayout] = useState<LayoutMode>("side-by-side");

  const patternGroups = (data.patternGroups as ScreenPatternGroup[] | undefined) ?? [];
  const totalPatterns = patternGroups.reduce((sum, g) => sum + g.patterns.length, 0);

  const allBadges: ScreenBadge[] = [];
  if (data.stateCount && (data.stateCount as number) > 0) {
    allBadges.push({ label: `${data.stateCount} states`, color: "neutral" });
  }
  if (data.variantCount && (data.variantCount as number) > 0) {
    allBadges.push({ label: `${data.variantCount} variants`, color: "success" });
  }
  if (data.badges) {
    allBadges.push(...(data.badges as ScreenBadge[]));
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--aegis-color-background-default)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "var(--aegis-space-medium)",
          borderBottom: "1px solid var(--aegis-color-border-default)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
          <Text variant="title.small">{data.label as string}</Text>
          {data.path && (
            <Text
              variant="body.xSmall"
              style={{
                fontFamily:
                  "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
                color: "var(--aegis-color-text-subtle)",
              }}
            >
              {data.path as string}
            </Text>
          )}
          {allBadges.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: "var(--aegis-space-xxSmall)" }}>
              {allBadges.map((badge) => (
                <Badge key={badge.label} color={badge.color || "neutral"}>
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "var(--aegis-space-xxSmall)", alignItems: "center" }}>
          {onNavigate && data.path && (
            <Button variant="subtle" size="small" onClick={() => onNavigate(data.path as string)}>
              <Icon size="xSmall">
                <LfArrowUpRightFromSquare />
              </Icon>
              ページを開く
            </Button>
          )}
          <Tooltip title="1 column">
            <IconButton
              aria-label="Single column"
              variant={layout === "single" ? "solid" : "subtle"}
              size="small"
              onClick={() => setLayout("single")}
            >
              <Icon size="xSmall">
                <LfLayoutVertical />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Side by side">
            <IconButton
              aria-label="Side by side"
              variant={layout === "side-by-side" ? "solid" : "subtle"}
              size="small"
              onClick={() => setLayout("side-by-side")}
            >
              <Icon size="xSmall">
                <LfLayoutHorizon />
              </Icon>
            </IconButton>
          </Tooltip>
          <IconButton aria-label="Close" variant="subtle" size="small" onClick={onClose}>
            <Icon size="xSmall">
              <LfCloseSmall />
            </Icon>
          </IconButton>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "var(--aegis-space-medium)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-large)",
        }}
      >
        {patternGroups.length > 0 ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
              <Text variant="label.medium.bold" color="success">
                PATTERNS
              </Text>
              <Text variant="body.small" color="subtle">
                {totalPatterns} patterns
              </Text>
            </div>
            {patternGroups.map((group) => (
              <PatternGroupSection key={group.name} group={group} layout={layout} />
            ))}
          </>
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
              No patterns defined for this screen.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
