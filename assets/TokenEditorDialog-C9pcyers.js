var e=`import { LfReply, LfWarningCircle } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  Combobox,
  ContentHeader,
  ContentHeaderTitle,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Icon,
  IconButton,
  Search,
  Tabs,
  TabsList,
  TabsTrigger,
  Tag,
  TagGroup,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import defaultTokenRefs from "../../assets/default-token-refs.json";
import tokenUsageMap from "../../assets/token-usage-map.json";
import { cssColorToRgb } from "../../color/oklch";
import { buildPrimaryScale } from "../../color/primary";
import { buildNeutralAlphaMap, getNeutralAlphaOrigin } from "../../color/transparent";
import { usePaletteLabContext } from "../../store/context";
import { isDisplayTone, toneLabel } from "../../store/types";

type TokenRefCategory = "background" | "foreground" | "border";
const DEFAULT_TOKEN_REFS = defaultTokenRefs as Record<TokenRefCategory, Record<string, string>>;

// ─── Token lists ─────────────────────────────────────────────────────────────

const BACKGROUND_TOKENS: string[] = [
  "--aegis-color-background-accent-blue-bold",
  "--aegis-color-background-accent-blue-subtle",
  "--aegis-color-background-accent-blue-subtle-disabled",
  "--aegis-color-background-accent-blue-subtle-hovered",
  "--aegis-color-background-accent-blue-subtle-pressed",
  "--aegis-color-background-accent-blue-subtlest",
  "--aegis-color-background-accent-blue-subtlest-hovered",
  "--aegis-color-background-accent-blue-subtlest-pressed",
  "--aegis-color-background-accent-blue-xSubtle",
  "--aegis-color-background-accent-gray-subtlest",
  "--aegis-color-background-accent-gray-subtlest-disabled",
  "--aegis-color-background-accent-gray-subtlest-hovered",
  "--aegis-color-background-accent-gray-subtlest-selected",
  "--aegis-color-background-accent-gray-xSubtle",
  "--aegis-color-background-accent-gray-xxSubtle",
  "--aegis-color-background-accent-indigo-bold",
  "--aegis-color-background-accent-indigo-subtle",
  "--aegis-color-background-accent-indigo-subtle-disabled",
  "--aegis-color-background-accent-indigo-subtle-hovered",
  "--aegis-color-background-accent-indigo-subtle-pressed",
  "--aegis-color-background-accent-indigo-subtlest",
  "--aegis-color-background-accent-indigo-subtlest-hovered",
  "--aegis-color-background-accent-indigo-subtlest-pressed",
  "--aegis-color-background-accent-indigo-xSubtle",
  "--aegis-color-background-accent-lime-subtle",
  "--aegis-color-background-accent-lime-subtle-disabled",
  "--aegis-color-background-accent-lime-subtle-hovered",
  "--aegis-color-background-accent-lime-subtle-pressed",
  "--aegis-color-background-accent-lime-subtlest",
  "--aegis-color-background-accent-lime-subtlest-hovered",
  "--aegis-color-background-accent-lime-subtlest-pressed",
  "--aegis-color-background-accent-magenta-bold",
  "--aegis-color-background-accent-magenta-subtle",
  "--aegis-color-background-accent-magenta-subtle-disabled",
  "--aegis-color-background-accent-magenta-subtle-hovered",
  "--aegis-color-background-accent-magenta-subtle-pressed",
  "--aegis-color-background-accent-magenta-subtlest",
  "--aegis-color-background-accent-magenta-subtlest-hovered",
  "--aegis-color-background-accent-magenta-subtlest-pressed",
  "--aegis-color-background-accent-magenta-xSubtle",
  "--aegis-color-background-accent-orange-bold",
  "--aegis-color-background-accent-orange-subtle",
  "--aegis-color-background-accent-orange-subtle-disabled",
  "--aegis-color-background-accent-orange-subtle-hovered",
  "--aegis-color-background-accent-orange-subtle-pressed",
  "--aegis-color-background-accent-orange-subtlest",
  "--aegis-color-background-accent-orange-subtlest-hovered",
  "--aegis-color-background-accent-orange-subtlest-pressed",
  "--aegis-color-background-accent-orange-xSubtle",
  "--aegis-color-background-accent-purple-bold",
  "--aegis-color-background-accent-purple-subtle",
  "--aegis-color-background-accent-purple-subtle-hovered",
  "--aegis-color-background-accent-purple-subtle-pressed",
  "--aegis-color-background-accent-purple-subtlest",
  "--aegis-color-background-accent-purple-subtlest-hovered",
  "--aegis-color-background-accent-purple-subtlest-pressed",
  "--aegis-color-background-accent-purple-xSubtle",
  "--aegis-color-background-accent-red-bold",
  "--aegis-color-background-accent-red-subtle",
  "--aegis-color-background-accent-red-subtle-disabled",
  "--aegis-color-background-accent-red-subtle-hovered",
  "--aegis-color-background-accent-red-subtle-pressed",
  "--aegis-color-background-accent-red-subtlest",
  "--aegis-color-background-accent-red-subtlest-hovered",
  "--aegis-color-background-accent-red-subtlest-pressed",
  "--aegis-color-background-accent-red-xSubtle",
  "--aegis-color-background-accent-teal-bold",
  "--aegis-color-background-accent-teal-subtle",
  "--aegis-color-background-accent-teal-subtle-disabled",
  "--aegis-color-background-accent-teal-subtle-hovered",
  "--aegis-color-background-accent-teal-subtle-pressed",
  "--aegis-color-background-accent-teal-subtlest",
  "--aegis-color-background-accent-teal-subtlest-hovered",
  "--aegis-color-background-accent-teal-subtlest-pressed",
  "--aegis-color-background-accent-teal-xSubtle",
  "--aegis-color-background-accent-yellow-subtle",
  "--aegis-color-background-accent-yellow-subtle-disabled",
  "--aegis-color-background-accent-yellow-subtle-hovered",
  "--aegis-color-background-accent-yellow-subtle-pressed",
  "--aegis-color-background-accent-yellow-subtlest",
  "--aegis-color-background-accent-yellow-subtlest-hovered",
  "--aegis-color-background-accent-yellow-subtlest-pressed",
  "--aegis-color-background-accent-yellow-xSubtle",
  "--aegis-color-background-brand-bold",
  "--aegis-color-background-brand-bold-hovered",
  "--aegis-color-background-brand-bold-pressed",
  "--aegis-color-background-danger",
  "--aegis-color-background-danger-bold",
  "--aegis-color-background-danger-bold-hovered",
  "--aegis-color-background-danger-bold-pressed",
  "--aegis-color-background-danger-hovered",
  "--aegis-color-background-danger-pressed",
  "--aegis-color-background-danger-subtle",
  "--aegis-color-background-danger-subtle-hovered",
  "--aegis-color-background-danger-subtle-pressed",
  "--aegis-color-background-danger-subtlest",
  "--aegis-color-background-danger-subtlest-disabled",
  "--aegis-color-background-danger-subtlest-hovered",
  "--aegis-color-background-danger-subtlest-pressed",
  "--aegis-color-background-danger-subtlest-selected",
  "--aegis-color-background-default",
  "--aegis-color-background-disabled",
  "--aegis-color-background-information",
  "--aegis-color-background-information-bold",
  "--aegis-color-background-information-bold-hovered",
  "--aegis-color-background-information-bold-pressed",
  "--aegis-color-background-information-hovered",
  "--aegis-color-background-information-pressed",
  "--aegis-color-background-information-subtle",
  "--aegis-color-background-information-subtle-hovered",
  "--aegis-color-background-information-subtle-pressed",
  "--aegis-color-background-information-subtlest",
  "--aegis-color-background-information-subtlest-hovered",
  "--aegis-color-background-information-subtlest-pressed",
  "--aegis-color-background-input",
  "--aegis-color-background-input-bold",
  "--aegis-color-background-input-hovered",
  "--aegis-color-background-inverse",
  "--aegis-color-background-inverse-bold",
  "--aegis-color-background-inverse-bold-hovered",
  "--aegis-color-background-inverse-bold-pressed",
  "--aegis-color-background-inverse-disabled",
  "--aegis-color-background-inverse-subtle",
  "--aegis-color-background-inverse-subtle-hovered",
  "--aegis-color-background-inverse-subtle-pressed",
  "--aegis-color-background-inverse-subtlest",
  "--aegis-color-background-inverse-subtlest-hovered",
  "--aegis-color-background-inverse-subtlest-pressed",
  "--aegis-color-background-neutral-bold",
  "--aegis-color-background-neutral-bold-hovered",
  "--aegis-color-background-neutral-opaque",
  "--aegis-color-background-neutral-subtle",
  "--aegis-color-background-neutral-subtle-hovered",
  "--aegis-color-background-neutral-subtle-opaque",
  "--aegis-color-background-neutral-subtle-pressed",
  "--aegis-color-background-neutral-subtlest",
  "--aegis-color-background-neutral-subtlest-hovered",
  "--aegis-color-background-neutral-subtlest-opaque",
  "--aegis-color-background-neutral-subtlest-opaque-hovered",
  "--aegis-color-background-neutral-subtlest-opaque-pressed",
  "--aegis-color-background-neutral-subtlest-pressed",
  "--aegis-color-background-neutral-subtlest-selected",
  "--aegis-color-background-neutral-xSubtle",
  "--aegis-color-background-neutral-xSubtle-hovered",
  "--aegis-color-background-neutral-xSubtle-opaque",
  "--aegis-color-background-neutral-xSubtle-pressed",
  "--aegis-color-background-selected",
  "--aegis-color-background-selected-bold",
  "--aegis-color-background-success",
  "--aegis-color-background-success-bold",
  "--aegis-color-background-success-hovered",
  "--aegis-color-background-success-pressed",
  "--aegis-color-background-success-subtle",
  "--aegis-color-background-success-subtlest",
  "--aegis-color-background-success-subtlest-hovered",
  "--aegis-color-background-success-subtlest-pressed",
  "--aegis-color-background-warning",
  "--aegis-color-background-warning-bold",
  "--aegis-color-background-warning-hovered",
  "--aegis-color-background-warning-pressed",
  "--aegis-color-background-warning-subtlest",
  "--aegis-color-background-warning-subtlest-disabled",
  "--aegis-color-background-warning-subtlest-hovered",
  "--aegis-color-background-warning-subtlest-pressed",
  "--aegis-color-background-warning-subtlest-selected",
];

const FOREGROUND_TOKENS: string[] = [
  "--aegis-color-foreground-accent-blue",
  "--aegis-color-foreground-accent-blue-bold",
  "--aegis-color-foreground-accent-gray",
  "--aegis-color-foreground-accent-indigo",
  "--aegis-color-foreground-accent-indigo-bold",
  "--aegis-color-foreground-accent-lime",
  "--aegis-color-foreground-accent-lime-bold",
  "--aegis-color-foreground-accent-magenta",
  "--aegis-color-foreground-accent-magenta-bold",
  "--aegis-color-foreground-accent-orange",
  "--aegis-color-foreground-accent-orange-bold",
  "--aegis-color-foreground-accent-purple",
  "--aegis-color-foreground-accent-purple-bold",
  "--aegis-color-foreground-accent-red",
  "--aegis-color-foreground-accent-red-bold",
  "--aegis-color-foreground-accent-red-subtle",
  "--aegis-color-foreground-accent-teal",
  "--aegis-color-foreground-accent-teal-bold",
  "--aegis-color-foreground-accent-yellow",
  "--aegis-color-foreground-accent-yellow-bold",
  "--aegis-color-foreground-bold",
  "--aegis-color-foreground-danger",
  "--aegis-color-foreground-danger-bold",
  "--aegis-color-foreground-danger-pressed",
  "--aegis-color-foreground-default",
  "--aegis-color-foreground-disabled",
  "--aegis-color-foreground-disabled-inverse",
  "--aegis-color-foreground-information",
  "--aegis-color-foreground-information-bold",
  "--aegis-color-foreground-information-pressed",
  "--aegis-color-foreground-inverse",
  "--aegis-color-foreground-inverse-subtle",
  "--aegis-color-foreground-pressed",
  "--aegis-color-foreground-subtle",
  "--aegis-color-foreground-success-bold",
  "--aegis-color-foreground-warning-bold",
  "--aegis-color-foreground-xSubtle",
];

const BORDER_TOKENS: string[] = [
  "--aegis-color-border-accent-blue-bold",
  "--aegis-color-border-accent-blue-bold-disabled",
  "--aegis-color-border-accent-gray-bold",
  "--aegis-color-border-accent-indigo-bold",
  "--aegis-color-border-accent-indigo-bold-disabled",
  "--aegis-color-border-accent-lime-bold",
  "--aegis-color-border-accent-lime-bold-disabled",
  "--aegis-color-border-accent-magenta-bold",
  "--aegis-color-border-accent-magenta-bold-disabled",
  "--aegis-color-border-accent-orange-bold",
  "--aegis-color-border-accent-orange-bold-disabled",
  "--aegis-color-border-accent-purple-bold",
  "--aegis-color-border-accent-purple-bold-disabled",
  "--aegis-color-border-accent-red-bold",
  "--aegis-color-border-accent-red-bold-disabled",
  "--aegis-color-border-accent-teal-bold",
  "--aegis-color-border-accent-teal-bold-disabled",
  "--aegis-color-border-accent-yellow-bold",
  "--aegis-color-border-accent-yellow-bold-disabled",
  "--aegis-color-border-bold",
  "--aegis-color-border-danger-bold",
  "--aegis-color-border-danger-subtle",
  "--aegis-color-border-danger-subtlest",
  "--aegis-color-border-danger-subtlest-hovered",
  "--aegis-color-border-danger-subtlest-pressed",
  "--aegis-color-border-default",
  "--aegis-color-border-disabled",
  "--aegis-color-border-information-bold",
  "--aegis-color-border-information-subtle",
  "--aegis-color-border-information-subtlest",
  "--aegis-color-border-information-subtlest-hovered",
  "--aegis-color-border-information-subtlest-pressed",
  "--aegis-color-border-information-xBold",
  "--aegis-color-border-input",
  "--aegis-color-border-input-focused",
  "--aegis-color-border-input-hovered",
  "--aegis-color-border-inverse",
  "--aegis-color-border-inverse-bold",
  "--aegis-color-border-inverse-disabled",
  "--aegis-color-border-inverse-subtle",
  "--aegis-color-border-inverse-subtlest",
  "--aegis-color-border-inverse-subtlest-hovered",
  "--aegis-color-border-inverse-subtlest-pressed",
  "--aegis-color-border-neutral",
  "--aegis-color-border-neutral-bold",
  "--aegis-color-border-neutral-subtle",
  "--aegis-color-border-neutral-subtlest",
  "--aegis-color-border-neutral-subtlest-hovered",
  "--aegis-color-border-neutral-subtlest-pressed",
  "--aegis-color-border-selected",
  "--aegis-color-border-warning-bold",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const UNVERIFIED_COMPONENTS = new Set(["Snackbar"]);
const TOKEN_USAGE_MAP = tokenUsageMap as Record<string, string[]>;

const readTokenValue = (tokenName: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim();

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const m = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
};

const toRgba = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex);
  return rgb ? \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, \${alpha})\` : "";
};

const componentToTokensMap: Record<string, string[]> = {};
for (const [token, components] of Object.entries(TOKEN_USAGE_MAP)) {
  for (const component of components) {
    if (!componentToTokensMap[component]) componentToTokensMap[component] = [];
    componentToTokensMap[component].push(token);
  }
}
const SORTED_COMPONENTS = Object.keys(componentToTokensMap).sort();

const TOKEN_TO_REF_LABEL: Record<string, string> = {};
for (const category of ["background", "foreground", "border"] as const) {
  const refs = DEFAULT_TOKEN_REFS[category] ?? {};
  for (const [key, ref] of Object.entries(refs)) {
    TOKEN_TO_REF_LABEL[\`--aegis-color-\${category}-\${key}\`] = ref;
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

// ─── Swatch ──────────────────────────────────────────────────────────────────

const SWATCH_SIZE = 28;
const SWATCH_OUTLINE = "1px var(--aegis-color-border-default) solid";
const SWATCH_INSET_PERCENT = "3.5714285714%";
const SWATCH_ALPHA_LEFT_PERCENT = "50%";
const SWATCH_ALPHA_WIDTH_PERCENT = "46.4285714286%";
const SWATCH_ALPHA_HEIGHT_PERCENT = "92.8571428571%";
const SWATCH_RADIUS = "var(--aegis-radius-small)";

type HexSwatchProps = { color: string; opaqueColor?: string };

const HexSwatch = ({ color, opaqueColor }: HexSwatchProps) => {
  const isAlpha = opaqueColor !== undefined;

  if (isAlpha) {
    return (
      <div
        aria-hidden="true"
        style={{
          background: "var(--aegis-color-background-default)",
          borderRadius: SWATCH_RADIUS,
          flexShrink: 0,
          height: SWATCH_SIZE,
          outline: SWATCH_OUTLINE,
          outlineOffset: -1,
          overflow: "hidden",
          position: "relative",
          width: SWATCH_SIZE,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            background:
              "repeating-linear-gradient(-45deg, var(--palette-lab-invalid-zone-texture-color, rgba(0,0,0,0.2)) 0px, var(--palette-lab-invalid-zone-texture-color, rgba(0,0,0,0.2)) 1px, transparent 1px, transparent 4px)",
            borderBottomRightRadius: SWATCH_RADIUS,
            borderTopRightRadius: SWATCH_RADIUS,
            height: SWATCH_ALPHA_HEIGHT_PERCENT,
            left: SWATCH_ALPHA_LEFT_PERCENT,
            position: "absolute",
            top: SWATCH_INSET_PERCENT,
            width: SWATCH_ALPHA_WIDTH_PERCENT,
          }}
        />
        <div
          style={{
            background: opaqueColor,
            borderBottomLeftRadius: SWATCH_RADIUS,
            borderTopLeftRadius: SWATCH_RADIUS,
            height: SWATCH_ALPHA_HEIGHT_PERCENT,
            left: SWATCH_INSET_PERCENT,
            position: "absolute",
            top: SWATCH_INSET_PERCENT,
            width: SWATCH_ALPHA_WIDTH_PERCENT,
          }}
        />
        <div
          style={{
            background: color,
            borderBottomRightRadius: SWATCH_RADIUS,
            borderTopRightRadius: SWATCH_RADIUS,
            height: SWATCH_ALPHA_HEIGHT_PERCENT,
            left: SWATCH_ALPHA_LEFT_PERCENT,
            position: "absolute",
            top: SWATCH_INSET_PERCENT,
            width: SWATCH_ALPHA_WIDTH_PERCENT,
          }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{
        background: color || "var(--aegis-color-background-default)",
        border: SWATCH_OUTLINE,
        borderRadius: SWATCH_RADIUS,
        flexShrink: 0,
        height: SWATCH_SIZE,
        width: SWATCH_SIZE,
      }}
    />
  );
};

// ─── Token map tab ───────────────────────────────────────────────────────────

const TokenMapTab = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)", height: "100%", minHeight: 0 }}
  >
    <div
      style={{
        alignItems: "center",
        background: "var(--aegis-color-background-neutral-subtlest)",
        borderRadius: "var(--aegis-radius-medium)",
        display: "flex",
        flexShrink: 0,
        gap: "var(--aegis-space-xSmall)",
        padding: "var(--aegis-space-xSmall) var(--aegis-space-small)",
      }}
    >
      <Text color="subtle" variant="label.small">
        Verified against Aegis 2025-05 &nbsp;·&nbsp; 256 tokens &nbsp;·&nbsp; 52 components
      </Text>
    </div>
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
      {SORTED_COMPONENTS.map((component) => {
        const tokens = componentToTokensMap[component] ?? [];
        const isUnverified = UNVERIFIED_COMPONENTS.has(component);
        return (
          <div
            key={component}
            style={{
              borderBottom: "1px solid var(--aegis-color-border-neutral-subtlest)",
              paddingBlock: "var(--aegis-space-xSmall)",
              paddingInline: "var(--aegis-space-xSmall)",
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: "var(--aegis-space-xxSmall)",
                marginBottom: "var(--aegis-space-x3Small)",
              }}
            >
              <Text variant="label.small">{component}</Text>
              {isUnverified && (
                <Tooltip title="Unverified — not found in current Aegis catalog">
                  <span
                    style={{ color: "var(--aegis-color-foreground-warning-bold)", cursor: "default", lineHeight: 1 }}
                  >
                    <Icon size="xSmall">
                      <LfWarningCircle />
                    </Icon>
                  </span>
                </Tooltip>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--aegis-space-x3Small)" }}>
              {tokens.map((token) => (
                <Tag key={token} size="small" variant="outline">
                  <span
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      fontSize: "10px",
                    }}
                  >
                    {token.replace(/^--aegis-color-/, "")}
                  </span>
                </Tag>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Row type & tab config ────────────────────────────────────────────────────

type TokenRow = { id: string; tokenName: string; tokenKey: string; overrideHex: string | undefined };
type TabValue = "background" | "foreground" | "border" | "token-map";

const TAB_TOKENS: Record<Exclude<TabValue, "token-map">, string[]> = {
  background: BACKGROUND_TOKENS,
  foreground: FOREGROUND_TOKENS,
  border: BORDER_TOKENS,
};

// ─── Main dialog ─────────────────────────────────────────────────────────────

export type TokenEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overrides: Record<string, string>;
  onOverrideChange: (tokenName: string, hex: string | null) => void;
};

export const TokenEditorDialog = ({ open, onOpenChange, overrides, onOverrideChange }: TokenEditorDialogProps) => {
  const { state } = usePaletteLabContext();
  const [activeTab, setActiveTab] = useState<TabValue>("background");
  const [searchQuery, setSearchQuery] = useState("");

  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const families = activeProject?.colorFamilies ?? [];
  const origin = getNeutralAlphaOrigin(activeProject?.appBgLightness ?? 100);

  const neutralFam = families.find((f) => f.name.toLowerCase() === "neutral");
  const neutralTransparentBase = origin === "white" ? "#ffffff" : "#000000";
  // inverse-transparent (legacy key: white-transparent): opposite base from neutral-transparent
  const inverseTransparentBase = origin === "white" ? "#000000" : "#ffffff";

  const neutralAlphaMap = useMemo(() => buildNeutralAlphaMap(neutralFam, origin), [neutralFam, origin]);

  const defaultHexForToken = useMemo((): Record<string, string> => {
    const result: Record<string, string> = {};
    const nFam = families.find((f) => f.name.toLowerCase() === "neutral");
    for (const category of ["background", "foreground", "border"] as const) {
      const refs = DEFAULT_TOKEN_REFS[category] ?? {};
      for (const [key, ref] of Object.entries(refs)) {
        const tokenName = \`--aegis-color-\${category}-\${key}\`;
        if (ref === "scale.transparent") continue;
        if (ref === "scale.white.1000") {
          result[tokenName] = "#ffffff";
          continue;
        }
        const neutralMatch = ref.match(/^scale\\.neutral\\.(\\d+)$/);
        if (neutralMatch && nFam) {
          const toneValue = parseInt(neutralMatch[1], 10);
          const hex = nFam.tones.find((t) => t.value === toneValue)?.hex;
          if (hex) {
            result[tokenName] = hex;
            continue;
          }
        }
        const neutralTransparentMatch = ref.match(/^scale\\.neutral-transparent\\.(\\d+)$/);
        if (neutralTransparentMatch) {
          const tone = parseInt(neutralTransparentMatch[1], 10);
          const alpha = neutralAlphaMap.get(tone);
          if (alpha !== undefined) {
            result[tokenName] = toRgba(neutralTransparentBase, alpha);
            continue;
          }
        }
        const whiteTransparentMatch = ref.match(/^scale\\.white-transparent\\.(\\d+)$/);
        if (whiteTransparentMatch) {
          const tone = parseInt(whiteTransparentMatch[1], 10);
          const alpha = neutralAlphaMap.get(tone);
          if (alpha !== undefined) {
            result[tokenName] = toRgba(inverseTransparentBase, alpha);
          }
        }
        // primary.*, scale.{color}.* — not generated by palette-lab, leave unresolved
      }
    }
    return result;
  }, [families, neutralAlphaMap, neutralTransparentBase, inverseTransparentBase]);

  const comboboxOptions = useMemo(() => {
    const WHITE_BG: [number, number, number] = [255, 255, 255];

    const primaryOptions = families.flatMap((family) => {
      if (!family.primaryBaseTone) return [];
      return buildPrimaryScale(family, neutralAlphaMap).map((entry) => {
        const label = \`primary.\${family.name}.\${toneLabel(entry.value)}\`;
        const previewRgb = cssColorToRgb(entry.oklch, WHITE_BG);
        const previewHex = previewRgb
          ? \`#\${previewRgb.map((c) => c.toString(16).padStart(2, "0")).join("")}\`
          : entry.hex;
        return {
          value: entry.oklch,
          label,
          body: (
            <div style={{ alignItems: "center", display: "flex", gap: "var(--aegis-space-xSmall)" }}>
              <HexSwatch color={previewHex} />
              <Text as="span" variant="body.medium">
                {label}
              </Text>
            </div>
          ),
        };
      });
    });

    const paletteOptions = families.flatMap((family) =>
      family.tones
        .filter((t) => isDisplayTone(t.value))
        .sort((a, b) => a.value - b.value)
        .map((tone) => {
          const label = \`\${family.name}.\${toneLabel(tone.value)}\`;
          return {
            value: tone.hex,
            label,
            body: (
              <div style={{ alignItems: "center", display: "flex", gap: "var(--aegis-space-xSmall)" }}>
                <HexSwatch color={tone.hex} />
                <Text as="span" variant="body.medium">
                  {label}
                </Text>
              </div>
            ),
          };
        }),
    );

    const whiteOption = {
      value: "#ffffff",
      label: "scale.white.1000",
      body: (
        <div style={{ alignItems: "center", display: "flex", gap: "var(--aegis-space-xSmall)" }}>
          <HexSwatch color="#ffffff" />
          <Text as="span" variant="body.medium">
            scale.white.1000
          </Text>
        </div>
      ),
    };

    const TRANSPARENT_TONES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    const neutralTransparentOptions = TRANSPARENT_TONES.flatMap((tone) => {
      const alpha = neutralAlphaMap.get(tone);
      if (alpha === undefined) return [];
      const rgbaValue = toRgba(neutralTransparentBase, alpha);
      const label = \`scale.neutral-transparent.\${tone}\`;
      return [
        {
          value: rgbaValue,
          label,
          body: (
            <div style={{ alignItems: "center", display: "flex", gap: "var(--aegis-space-xSmall)" }}>
              <HexSwatch color={rgbaValue} opaqueColor={neutralTransparentBase} />
              <Text as="span" variant="body.medium">
                {label}
              </Text>
            </div>
          ),
        },
      ];
    });

    const whiteTransparentOptions = TRANSPARENT_TONES.flatMap((tone) => {
      const alpha = neutralAlphaMap.get(tone);
      if (alpha === undefined) return [];
      const rgbaValue = toRgba(inverseTransparentBase, alpha);
      const label = \`scale.white-transparent.\${tone}\`;
      return [
        {
          value: rgbaValue,
          label,
          body: (
            <div style={{ alignItems: "center", display: "flex", gap: "var(--aegis-space-xSmall)" }}>
              <HexSwatch color={rgbaValue} opaqueColor={inverseTransparentBase} />
              <Text as="span" variant="body.medium">
                {label}
              </Text>
            </div>
          ),
        },
      ];
    });

    return [
      ...primaryOptions,
      ...paletteOptions,
      whiteOption,
      ...neutralTransparentOptions,
      ...whiteTransparentOptions,
    ];
  }, [families, neutralAlphaMap, neutralTransparentBase, inverseTransparentBase]);

  const rows = useMemo((): TokenRow[] => {
    if (activeTab === "token-map") return [];
    return TAB_TOKENS[activeTab].map((t) => ({
      id: t,
      tokenName: t,
      tokenKey: t.replace(/^--aegis-color-/, ""),
      overrideHex: overrides[t],
    }));
  }, [activeTab, overrides]);

  const highlightedRows = useMemo(() => rows.filter((r) => r.overrideHex !== undefined).map((r) => r.id), [rows]);

  const columns = useMemo(
    (): DataTableColumnDef<TokenRow, string>[] => [
      {
        id: "token",
        name: "Token name",
        sortable: false,
        pinnable: false,
        reorderable: false,
        resizable: false,
        getValue: (row) => row.tokenKey,
        renderCell: ({ row }) => (
          <DataTableCell>
            <Text
              variant="body.small"
              style={{
                display: "block",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {row.tokenKey}
            </Text>
          </DataTableCell>
        ),
      },
      {
        id: "value",
        name: "Value",
        sortable: false,
        pinnable: false,
        reorderable: false,
        resizable: false,
        getValue: (row) => row.overrideHex ?? TOKEN_TO_REF_LABEL[row.tokenName] ?? readTokenValue(row.tokenName),
        renderCell: ({ row }) => {
          const overrideHex = row.overrideHex;
          const defaultHex = defaultHexForToken[row.tokenName];
          const isOverridden = overrideHex !== undefined;
          const hasDefaultMatch = defaultHex !== undefined && comboboxOptions.some((o) => o.value === defaultHex);
          const refLabel = TOKEN_TO_REF_LABEL[row.tokenName];
          const swatchColor = overrideHex ?? defaultHex ?? readTokenValue(row.tokenName);
          // Use refLabel as combobox value for non-palette defaults → shows as selected (black text),
          // not placeholder (gray text). A ref-label option is prepended so the combobox finds a match.
          const showingRef = !overrideHex && !hasDefaultMatch && !!refLabel;
          const comboboxValue = overrideHex ?? (hasDefaultMatch ? defaultHex : refLabel) ?? undefined;
          const isWhiteTransparent = refLabel?.startsWith("scale.white-transparent.");
          const isNeutralTransparent = refLabel?.startsWith("scale.neutral-transparent.");
          const opaqueSwatchColor: string | undefined = isWhiteTransparent
            ? inverseTransparentBase
            : isNeutralTransparent
              ? neutralTransparentBase
              : undefined;
          const effectiveOptions = showingRef
            ? [
                {
                  value: refLabel,
                  label: refLabel,
                  body: (
                    <div style={{ alignItems: "center", display: "flex", gap: "var(--aegis-space-xSmall)" }}>
                      <HexSwatch color={swatchColor} opaqueColor={opaqueSwatchColor} />
                      <Text as="span" variant="body.medium">
                        {refLabel}
                      </Text>
                    </div>
                  ),
                },
                ...comboboxOptions,
              ]
            : comboboxOptions;
          return (
            <DataTableCell>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  gap: "var(--aegis-space-xSmall)",
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <HexSwatch color={swatchColor} opaqueColor={opaqueSwatchColor} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Combobox
                    aria-label="Token value"
                    filter
                    options={effectiveOptions}
                    size="medium"
                    value={comboboxValue}
                    onChange={(value) => {
                      if (value != null && comboboxOptions.some((o) => o.value === value)) {
                        onOverrideChange(row.tokenName, value);
                      }
                    }}
                    style={{ minWidth: 0, width: "100%" }}
                  />
                </div>
                {isOverridden && (
                  <Tooltip title="Reset to default" placement="top">
                    <IconButton
                      aria-label="Reset to default"
                      size="xSmall"
                      variant="plain"
                      onClick={() => onOverrideChange(row.tokenName, null)}
                    >
                      <Icon>
                        <LfReply />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </DataTableCell>
          );
        },
      },
      {
        id: "inUse",
        name: "In use",
        sortable: false,
        pinnable: false,
        reorderable: false,
        resizable: false,
        getValue: (row) => (TOKEN_USAGE_MAP[row.tokenName] ?? []).join(","),
        renderCell: ({ row }) => {
          const components = TOKEN_USAGE_MAP[row.tokenName] ?? [];
          return (
            <DataTableCell style={{ whiteSpace: "normal" }}>
              {components.length > 0 && (
                <TagGroup
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--aegis-space-xxSmall)",
                    maxWidth: "100%",
                    minWidth: 0,
                    overflowWrap: "anywhere",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {components.map((c) => (
                    <Tag key={c} size="small">
                      {c}
                    </Tag>
                  ))}
                </TagGroup>
              )}
            </DataTableCell>
          );
        },
      },
    ],
    [comboboxOptions, defaultHexForToken, onOverrideChange, neutralTransparentBase, inverseTransparentBase],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        width="auto"
        style={{
          display: "grid",
          gridTemplateRows: "auto auto minmax(0, 1fr) auto",
          height: "calc(100vh - 32px)",
          width: "calc(100vw - 32px)",
        }}
      >
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>Token Editor</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>

        <div style={{ paddingInline: "var(--aegis-space-xLarge)" }}>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
            <TabsList>
              <TabsTrigger value="background">Background</TabsTrigger>
              <TabsTrigger value="foreground">Foreground</TabsTrigger>
              <TabsTrigger value="border">Border</TabsTrigger>
              <TabsTrigger value="token-map">Token map</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-medium)",
            minHeight: 0,
            overflow: "hidden",
            paddingBlock: "var(--aegis-space-small)",
            paddingInline: "var(--aegis-space-xLarge)",
          }}
        >
          {activeTab !== "token-map" ? (
            <>
              <div style={{ flexShrink: 0 }}>
                <Search
                  aria-label="Filter tokens"
                  placeholder="Filter tokens…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
              <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                <DataTable
                  columns={columns}
                  getRowId={(row) => row.id}
                  globalFilter={searchQuery}
                  highlightScope="none"
                  highlightedRows={highlightedRows}
                  outerBordered
                  rows={rows}
                  size="small"
                  stickyHeader
                />
              </div>
            </>
          ) : (
            <TokenMapTab />
          )}
        </div>

        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
`;export{e as default};