import type { ReactNode } from "react";

/**
 * A single UI pattern/variant that can be toggled in the PatternSwitcher.
 */
export interface PatternConfig {
  /** Display name for the pattern (e.g., "Pattern A - カード型") */
  name: string;
  /** The React element to render for this pattern */
  component: ReactNode;
}

/**
 * A badge shown above the screen card in the flow map.
 */
export interface ScreenBadge {
  label: string;
  color?: "neutral" | "information" | "success" | "warning" | "danger";
}

/**
 * A screen node in the flow map.
 * Uses index signature to satisfy React Flow's Record<string, unknown> constraint.
 */
export interface ScreenNodeData {
  [key: string]: unknown;
  /** Display label for the screen (e.g., "ホーム") */
  label: string;
  /** Route path displayed next to the label (e.g., "/") */
  path?: string;
  /** Preview content rendered inside the screen card frame */
  preview?: ReactNode;
  /** Number of states this screen has (shown as badge) */
  stateCount?: number;
  /** Number of variants (shown as badge) */
  variantCount?: number;
  /** Additional custom badges */
  badges?: ScreenBadge[];
  /** Whether this screen is the focus/target of the current iteration */
  isFocus?: boolean;
  /** Pattern groups shown in the detail panel when this node is selected */
  patternGroups?: ScreenPatternGroup[];
}

/**
 * A pattern variant within a group (shown in the node detail panel).
 */
export interface ScreenPattern {
  /** Display name (e.g., "A: カード型復習") */
  name: string;
  /** Preview content */
  preview: ReactNode;
}

/**
 * A group of pattern variants for a screen (e.g., "復習UI", "次のアクション").
 */
export interface ScreenPatternGroup {
  /** Group name (e.g., "復習UI") */
  name: string;
  /** Pattern variants in this group */
  patterns: ScreenPattern[];
}

/**
 * A flow map edge representing a navigation transition.
 * Uses index signature to satisfy React Flow's Record<string, unknown> constraint.
 */
export interface FlowEdgeData {
  [key: string]: unknown;
  /** Label for the edge (e.g., "クリック", "送信") */
  label?: string;
}
