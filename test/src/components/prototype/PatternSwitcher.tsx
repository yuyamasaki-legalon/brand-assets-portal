import { Tab, Text } from "@legalforce/aegis-react";
import { useState } from "react";
import type { PatternConfig } from "./types";

interface PatternSwitcherProps {
  /** Array of pattern variants to switch between */
  patterns: PatternConfig[];
  /** Initial pattern index (default: 0) */
  defaultIndex?: number;
}

/**
 * Pattern switcher UI for comparing multiple UI pattern variants side-by-side.
 * Place this at the top of a prototype page to enable variant comparison.
 */
export function PatternSwitcher({ patterns, defaultIndex = 0 }: PatternSwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  if (patterns.length === 0) return null;
  if (patterns.length === 1) return <>{patterns[0].component}</>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--aegis-space-small)",
          padding: "var(--aegis-space-xSmall) var(--aegis-space-medium)",
          backgroundColor: "var(--aegis-color-background-subtle)",
          borderRadius: "var(--aegis-radius-large)",
        }}
      >
        <Text variant="label.small.bold" color="subtle">
          Pattern
        </Text>
        <Tab.Group index={activeIndex} onChange={setActiveIndex}>
          <Tab.List>
            {patterns.map((pattern) => (
              <Tab key={pattern.name}>{pattern.name}</Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
      {patterns[activeIndex].component}
    </div>
  );
}
