var e=`import {
  LfAngleLeftMiddle,
  LfAngleRightMiddle,
  LfCheckCircleFill,
  LfSetting,
  LfWarningTriangleFill,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  ActionListDescription,
  Badge,
  Card,
  Checkbox,
  Icon,
  IconButton,
  Popover,
  Select,
  Text,
} from "@legalforce/aegis-react";
import type { ChangeEvent } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type {
  BgContext,
  ComponentCheckItem,
  ComponentCheckResult,
  NeutralAlphaOrigin,
  SurfaceMode,
} from "../../color/contrast";
import {
  COMPONENT_CHECKS,
  computeChecksWithContext,
  formatContrastRatio,
  getNeutralAlphaOrigin,
  resolveTokenRgb,
  TOKEN_REFS,
} from "../../color/contrast";
import type { RGB } from "../../color/contrast/specs";
import { cssColorToRgb, parseColorToRgb } from "../../color/oklch";
import { usePaletteLabContext } from "../../store/context";
import type { ColorFamily } from "../../store/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type PageBgKey = "default" | "neutral-xSubtle-opaque" | "neutral-subtle-opaque";

type NormalSurfaceBgKey = "none" | "xSubtle" | "xSubtle-hovered" | "xSubtle-pressed" | "xSubtle-selected";
type InverseSurfaceBgKey =
  | "brand-bold"
  | "brand-bold-hovered"
  | "brand-bold-pressed"
  | "neutral-bold"
  | "danger-bold"
  | "danger-bold-hovered"
  | "danger-bold-pressed"
  | "information-bold"
  | "information-bold-hovered"
  | "information-bold-pressed"
  | "success-bold";

type SurfaceBgKey = NormalSurfaceBgKey | InverseSurfaceBgKey;

const NORMAL_SURFACE_TOKENS: Record<Exclude<NormalSurfaceBgKey, "none">, string> = {
  xSubtle: "neutral-xSubtle",
  "xSubtle-hovered": "neutral-xSubtle-hovered",
  "xSubtle-pressed": "neutral-xSubtle-pressed",
  "xSubtle-selected": "neutral-xSubtle-selected",
};

const INVERSE_SURFACE_TOKENS: Record<InverseSurfaceBgKey, string> = {
  "brand-bold": "brand-bold",
  "brand-bold-hovered": "brand-bold-hovered",
  "brand-bold-pressed": "brand-bold-pressed",
  "neutral-bold": "neutral-bold",
  "danger-bold": "danger-bold",
  "danger-bold-hovered": "danger-bold-hovered",
  "danger-bold-pressed": "danger-bold-pressed",
  "information-bold": "information-bold",
  "information-bold-hovered": "information-bold-hovered",
  "information-bold-pressed": "information-bold-pressed",
  "success-bold": "success-bold",
};

const INVERSE_KEYS: readonly InverseSurfaceBgKey[] = [
  "brand-bold",
  "brand-bold-hovered",
  "brand-bold-pressed",
  "neutral-bold",
  "danger-bold",
  "danger-bold-hovered",
  "danger-bold-pressed",
  "information-bold",
  "information-bold-hovered",
  "information-bold-pressed",
  "success-bold",
];

const isInverseSurface = (key: SurfaceBgKey): key is InverseSurfaceBgKey =>
  (INVERSE_KEYS as readonly string[]).includes(key);

const WHITE: RGB = [255, 255, 255];
const BG_COLOR_TRANSITION = "background-color var(--aegis-motion-duration-normal) var(--aegis-motion-easing-default)";
const BG_CHIP_TRANSITION = \`\${BG_COLOR_TRANSITION}, outline-color var(--aegis-motion-duration-normal) var(--aegis-motion-easing-default)\`;

// ─── Color utils ──────────────────────────────────────────────────────────────

const rgbToCss = ([r, g, b]: RGB): string => \`rgb(\${r},\${g},\${b})\`;
const rgbToHexString = ([r, g, b]: RGB): string =>
  \`#\${r.toString(16).padStart(2, "0")}\${g.toString(16).padStart(2, "0")}\${b.toString(16).padStart(2, "0")}\`;

const resolveRuntimeBackgroundRgb = (
  key: string,
  runtimeCssVars: Record<string, string>,
  families: ColorFamily[],
  overBg: RGB,
  origin: NeutralAlphaOrigin,
  appBgHex?: string,
): RGB | null => {
  const cssValue = runtimeCssVars[\`--aegis-color-background-\${key}\`];
  if (cssValue) {
    return cssColorToRgb(cssValue, overBg) ?? parseColorToRgb(cssValue, overBg);
  }
  return resolveTokenRgb("background", key, families, overBg, origin, runtimeCssVars, appBgHex);
};

// ─── BG Preview Card ──────────────────────────────────────────────────────────

type BgPreviewCardProps = {
  pageBgCss: string;
  surfaceBgCss: string;
  pageBgKey: PageBgKey;
  surfaceBgKey: SurfaceBgKey;
};

const PREVIEW_LABEL_STYLE: React.CSSProperties = {
  alignItems: "flex-start",
  alignSelf: "stretch",
  display: "flex",
  fontFamily: "Inter, sans-serif",
  fontSize: "10px",
  fontWeight: 400,
  justifyContent: "flex-start",
  overflowWrap: "anywhere",
  textAlign: "start",
};

const PreviewTokenLabel = ({ label, token }: { label: string; token: string }) => (
  <div style={PREVIEW_LABEL_STYLE}>
    <span style={{ color: "var(--aegis-color-foreground-subtle)", flexShrink: 0 }}>{label}:&nbsp;</span>
    <span
      style={{
        color: "var(--aegis-color-foreground-default)",
        minWidth: 0,
        overflowWrap: "anywhere",
        textAlign: "start",
      }}
    >
      {token}
    </span>
  </div>
);

const surfaceBgLabel = (key: SurfaceBgKey): string => {
  if (key === "none") return "none";
  if (isInverseSurface(key)) return INVERSE_SURFACE_TOKENS[key];
  return NORMAL_SURFACE_TOKENS[key];
};

const BgPreviewCard = ({ pageBgCss, surfaceBgCss, pageBgKey, surfaceBgKey }: BgPreviewCardProps) => (
  <div
    style={{
      alignItems: "flex-start",
      alignSelf: "stretch",
      backgroundColor: pageBgCss,
      borderRadius: "var(--aegis-radius-large)",
      display: "inline-flex",
      flexDirection: "column",
      gap: "var(--aegis-space-xSmall)",
      justifyContent: "flex-start",
      outline: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
      outlineOffset: "calc(var(--aegis-border-width-thinPlus) * -1)",
      paddingBlockEnd: "var(--aegis-space-medium)",
      paddingBlockStart: "var(--aegis-space-xSmall)",
      paddingInline: "var(--aegis-space-medium)",
      transition: BG_COLOR_TRANSITION,
    }}
  >
    <PreviewTokenLabel label="Page BG" token={pageBgKey} />
    <div
      style={{
        alignItems: "flex-start",
        alignSelf: "stretch",
        backgroundColor: surfaceBgCss,
        borderRadius: "var(--aegis-radius-large)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-xSmall)",
        justifyContent: "flex-start",
        outline: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
        outlineOffset: "calc(var(--aegis-border-width-thinPlus) * -1)",
        paddingBlockEnd: "var(--aegis-space-medium)",
        paddingBlockStart: "var(--aegis-space-xSmall)",
        paddingInline: "var(--aegis-space-medium)",
        transition: BG_COLOR_TRANSITION,
      }}
    >
      <PreviewTokenLabel label="Surface BG" token={surfaceBgLabel(surfaceBgKey)} />
      <div
        style={{
          alignItems: "center",
          alignSelf: "stretch",
          backgroundColor: "var(--aegis-color-background-default)",
          borderRadius: "var(--aegis-radius-medium)",
          display: "inline-flex",
          gap: "var(--aegis-size-medium)",
          justifyContent: "center",
          overflow: "hidden",
          paddingBlock: "var(--aegis-space-xxSmall)",
          paddingInline: "var(--aegis-space-xSmall)",
        }}
      >
        <div
          style={{
            color: "var(--aegis-color-foreground-default)",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: "23.8px",
            overflowWrap: "break-word",
            userSelect: "none",
          }}
        >
          Aa
        </div>
      </div>
    </div>
  </div>
);

// ─── BG settings row ──────────────────────────────────────────────────────────

const BG_LABEL_WIDTH = "120px";

const BgSettingsRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div
    style={{
      alignItems: "center",
      alignSelf: "stretch",
      display: "flex",
      gap: "var(--aegis-space-xxSmall)",
    }}
  >
    <div
      style={{
        color: "var(--aegis-color-foreground-subtle)",
        flexShrink: 0,
        fontSize: 13,
        lineHeight: "19.5px",
        width: BG_LABEL_WIDTH,
        wordWrap: "break-word",
      }}
    >
      {label}
    </div>
    <div style={{ display: "flex", flex: "1 1 0", minWidth: 0, width: "100%" }}>{children}</div>
  </div>
);

// ─── Page BG chip button ───────────────────────────────────────────────────────

type PageBgChipProps = { bgCss: string; active: boolean; onClick: () => void };

const PageBgChip = ({ bgCss, active, onClick }: PageBgChipProps) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      alignItems: "center",
      background: bgCss,
      border: "none",
      borderRadius: "var(--aegis-radius-medium)",
      cursor: "pointer",
      display: "flex",
      flex: "1 1 0",
      justifyContent: "center",
      outline: active
        ? "var(--aegis-border-width-thin) solid var(--aegis-color-border-selected)"
        : "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-neutral)",
      outlineOffset: active
        ? "calc(var(--aegis-border-width-thin) * -1)"
        : "calc(var(--aegis-border-width-thinPlus) * -1)",
      overflow: "hidden",
      padding: "var(--aegis-space-x3Small) var(--aegis-space-xSmall)",
      transition: BG_CHIP_TRANSITION,
    }}
  >
    <span
      style={{
        color: "var(--aegis-color-foreground-default)",
        fontSize: 14,
        fontWeight: "bold",
        lineHeight: "23.8px",
        userSelect: "none",
      }}
    >
      Aa
    </span>
  </button>
);

// ─── Result row (in detail view state card) ───────────────────────────────────

const formatRole = (item: ComponentCheckItem): string => {
  const role = item.role.charAt(0).toUpperCase() + item.role.slice(1);
  return item.label ? \`\${role} — \${item.label}\` : role;
};

type ResultRowProps = { result: ComponentCheckResult };

const ResultRow = ({ result }: ResultRowProps) => {
  const { item, ratio, fgRgb, bgRgb, pass } = result;

  const paletteRef = TOKEN_REFS[item.fg.category]?.[item.fg.key] ?? "—";
  const tokenName = \`\${item.fg.category}-\${item.fg.key}\`;
  const isBorder = item.fg.category === "border";
  const isBackground = item.fg.category === "background";
  const previewBgCss = isBackground
    ? fgRgb
      ? rgbToCss(fgRgb)
      : "transparent"
    : bgRgb
      ? rgbToCss(bgRgb)
      : "transparent";
  const previewOutlineCss = isBorder
    ? \`var(--aegis-border-width-thinPlus) solid \${fgRgb ? rgbToCss(fgRgb) : "var(--aegis-color-border-neutral)"}\`
    : "none";

  const passIconColor =
    pass === true
      ? "var(--aegis-color-foreground-bold)"
      : pass === false
        ? "var(--aegis-color-foreground-danger)"
        : "var(--aegis-color-foreground-disabled)";

  const targetLabel = item.contrastTarget === "currentSurface" ? "vs Surface" : "vs Component BG";

  return (
    <div
      style={{
        alignItems: "center",
        alignSelf: "stretch",
        display: "flex",
        gap: "var(--aegis-space-small)",
        paddingBlock: "var(--aegis-space-x3Small)",
      }}
    >
      {/* Preview chip */}
      <div
        style={{
          alignItems: "center",
          backgroundColor: previewBgCss,
          borderRadius: "var(--aegis-radius-medium)",
          display: "flex",
          flexShrink: 0,
          height: 32,
          inlineSize: 48,
          justifyContent: "center",
          outline: previewOutlineCss,
          outlineOffset: "calc(var(--aegis-border-width-thinPlus) * -1)",
          overflow: "hidden",
          paddingBlock: "var(--aegis-space-x3Small)",
          paddingInline: "var(--aegis-space-xSmall)",
        }}
      >
        <span
          style={{
            color: fgRgb ? rgbToCss(fgRgb) : "transparent",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: isBackground || isBorder ? 700 : 400,
            lineHeight: "23.8px",
            opacity: isBackground || isBorder ? 0 : 1,
            userSelect: "none",
          }}
        >
          Aa
        </span>
      </div>

      {/* Token info */}
      <div
        style={{
          alignItems: "flex-start",
          display: "inline-flex",
          flex: "1 1 0",
          flexDirection: "column",
          justifyContent: "center",
          minWidth: 0,
        }}
      >
        <div
          style={{
            alignSelf: "stretch",
            color: "var(--aegis-color-foreground-default)",
            fontSize: 12,
            fontWeight: 400,
            lineHeight: "15.6px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {formatRole(item)}{" "}
          <span style={{ color: "var(--aegis-color-foreground-xSubtle)", fontSize: 10 }}>{targetLabel}</span>
        </div>
        <div
          style={{
            alignSelf: "stretch",
            color: "var(--aegis-color-foreground-subtle)",
            fontSize: 9,
            fontWeight: 400,
            lineHeight: "11.7px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {tokenName}
        </div>
        <div
          style={{
            alignSelf: "stretch",
            color: "var(--aegis-color-foreground-subtle)",
            fontSize: 9,
            fontWeight: 400,
            lineHeight: "11.7px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {paletteRef}
        </div>
      </div>

      {/* Pass/fail */}
      <div style={{ alignItems: "center", display: "flex", flexShrink: 0, gap: "var(--aegis-space-xxSmall)" }}>
        {pass === true ? (
          <Icon size="xSmall" source={LfCheckCircleFill} style={{ color: passIconColor }} />
        ) : pass === false ? (
          <Icon size="xSmall" source={LfWarningTriangleFill} style={{ color: passIconColor }} />
        ) : null}
        <span
          style={{
            color: ratio != null && pass === false ? passIconColor : "var(--aegis-color-foreground-default)",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "21px",
            whiteSpace: "nowrap",
          }}
        >
          {formatContrastRatio(ratio, pass)}
        </span>
      </div>
    </div>
  );
};

// ─── State section card ───────────────────────────────────────────────────────

type StateSectionProps = { sectionLabel: string; results: ComponentCheckResult[]; surfaceBgCss: string };

const StateSection = ({ sectionLabel, results, surfaceBgCss }: StateSectionProps) => (
  <div
    style={{
      alignItems: "flex-start",
      alignSelf: "stretch",
      display: "flex",
      flexDirection: "column",
      gap: "var(--aegis-space-x3Small)",
    }}
  >
    <div
      style={{
        color: "var(--aegis-color-foreground-bold)",
        fontSize: 13,
        fontWeight: 600,
        lineHeight: "19.5px",
        overflowWrap: "break-word",
      }}
    >
      {sectionLabel}
    </div>
    <div
      style={{
        alignItems: "flex-start",
        alignSelf: "stretch",
        backgroundColor: surfaceBgCss,
        borderRadius: "var(--aegis-radius-medium)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-xSmall)",
        outline: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
        outlineOffset: "calc(var(--aegis-border-width-thinPlus) * -1)",
        padding: "var(--aegis-space-small)",
        transition: BG_COLOR_TRANSITION,
      }}
    >
      {results.map((r, i) => (
        <ResultRow key={\`\${r.item.id}-\${i}\`} result={r} />
      ))}
    </div>
  </div>
);

// ─── Component detail view ────────────────────────────────────────────────────

type ComponentDetailViewProps = {
  component: string;
  failOnly: boolean;
  results: ComponentCheckResult[];
  surfaceBgCss: string;
  onBack: () => void;
};

const ComponentDetailView = ({ component, failOnly, results, surfaceBgCss, onBack }: ComponentDetailViewProps) => {
  const sections = useMemo(() => {
    const map = new Map<string, ComponentCheckResult[]>();
    for (const r of results) {
      const key = [r.item.variant, r.item.state].filter(Boolean).join(" / ") || "default";
      const existing = map.get(key);
      if (existing) existing.push(r);
      else map.set(key, [r]);
    }
    return Array.from(map.entries())
      .map(([label, sectionResults]) => {
        const visible = failOnly ? sectionResults.filter((r) => r.pass === false) : sectionResults;
        return { label, results: visible };
      })
      .filter(({ results: r }) => r.length > 0);
  }, [results, failOnly]);

  return (
    <Card size="medium" style={{ gap: 0, padding: 0 }} variant="outline">
      <div
        style={{
          alignItems: "center",
          borderBottom: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
          display: "flex",
          flexShrink: 0,
          gap: "var(--aegis-space-xSmall)",
          padding: "var(--aegis-space-xSmall) var(--aegis-space-medium)",
        }}
      >
        <IconButton aria-label="Back" icon={LfAngleLeftMiddle} size="xSmall" variant="subtle" onClick={onBack} />
        <Text variant="title.xSmall" color="bold">
          {component}
        </Text>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-small)",
          padding: "var(--aegis-space-small)",
        }}
      >
        {sections.length > 0 ? (
          sections.map(({ label, results: sectionResults }) => (
            <StateSection key={label} results={sectionResults} sectionLabel={label} surfaceBgCss={surfaceBgCss} />
          ))
        ) : (
          <Text color="subtle" variant="body.small">
            {failOnly ? "No failed checks for this component." : "No checks for this component."}
          </Text>
        )}
      </div>
    </Card>
  );
};

// ─── Component group type ─────────────────────────────────────────────────────

type ComponentGroup = { component: string; failCount: number; total: number };

// ─── Component list view ──────────────────────────────────────────────────────

type ComponentListViewProps = {
  groups: ComponentGroup[];
  failOnly: boolean;
  onSelect: (component: string) => void;
};

const ComponentListView = ({ groups, failOnly, onSelect }: ComponentListViewProps) => {
  const visible = failOnly ? groups.filter((g) => g.failCount > 0) : groups;
  if (visible.length === 0) {
    return (
      <div style={{ paddingTop: "var(--aegis-space-medium)" }}>
        <Text color="subtle" variant="body.small">
          {failOnly ? "現在の条件で Fail なし" : "コンポーネントが見つかりません。"}
        </Text>
      </div>
    );
  }
  return (
    <Card size="medium" style={{ padding: 0 }} variant="outline">
      <ActionList bordered size="large">
        <ActionList.Group>
          {visible.map(({ component, failCount }) => (
            <ActionList.Item key={component} onClick={() => onSelect(component)}>
              <ActionList.Body
                trailing={
                  <div style={{ alignItems: "center", display: "flex", gap: "var(--aegis-space-xxSmall)" }}>
                    {failCount > 0 && <Badge color="danger" count={failCount} />}
                    <Icon color="subtle" source={LfAngleRightMiddle} />
                  </div>
                }
              >
                {component}
              </ActionList.Body>
            </ActionList.Item>
          ))}
        </ActionList.Group>
      </ActionList>
    </Card>
  );
};

// ─── Surface BG select options ────────────────────────────────────────────────

const SURFACE_BG_OPTIONS = [
  {
    value: "none",
    label: "None",
    body: (
      <ActionList.Body>
        None<ActionListDescription>Normal surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "xSubtle",
    label: "xSubtle",
    body: (
      <ActionList.Body>
        xSubtle<ActionListDescription>Normal surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "xSubtle-hovered",
    label: "xSubtle hovered",
    body: (
      <ActionList.Body>
        xSubtle hovered<ActionListDescription>Normal surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "xSubtle-pressed",
    label: "xSubtle pressed",
    body: (
      <ActionList.Body>
        xSubtle pressed<ActionListDescription>Normal surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "xSubtle-selected",
    label: "xSubtle selected",
    body: (
      <ActionList.Body>
        xSubtle selected<ActionListDescription>Normal surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "brand-bold",
    label: "Brand bold",
    body: (
      <ActionList.Body>
        Brand bold<ActionListDescription>Inverse surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "brand-bold-hovered",
    label: "Brand bold hovered",
    body: (
      <ActionList.Body>
        Brand bold hovered<ActionListDescription>Inverse surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "brand-bold-pressed",
    label: "Brand bold pressed",
    body: (
      <ActionList.Body>
        Brand bold pressed<ActionListDescription>Inverse surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "neutral-bold",
    label: "Neutral bold",
    body: (
      <ActionList.Body>
        Neutral bold<ActionListDescription>Inverse surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "danger-bold",
    label: "Danger bold",
    body: (
      <ActionList.Body>
        Danger bold<ActionListDescription>Inverse surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "danger-bold-hovered",
    label: "Danger bold hovered",
    body: (
      <ActionList.Body>
        Danger bold hovered<ActionListDescription>Inverse surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "danger-bold-pressed",
    label: "Danger bold pressed",
    body: (
      <ActionList.Body>
        Danger bold pressed<ActionListDescription>Inverse surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "information-bold",
    label: "Information bold",
    body: (
      <ActionList.Body>
        Information bold<ActionListDescription>Inverse surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "information-bold-hovered",
    label: "Information bold hovered",
    body: (
      <ActionList.Body>
        Information bold hovered<ActionListDescription>Inverse surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "information-bold-pressed",
    label: "Information bold pressed",
    body: (
      <ActionList.Body>
        Information bold pressed<ActionListDescription>Inverse surface</ActionListDescription>
      </ActionList.Body>
    ),
  },
  {
    value: "success-bold",
    label: "Success bold",
    body: (
      <ActionList.Body>
        Success bold<ActionListDescription>Inverse surface — default only</ActionListDescription>
      </ActionList.Body>
    ),
  },
];

// ─── Main export ──────────────────────────────────────────────────────────────

type ContrastCheckPanelProps = {
  appBgInput: string;
  appBgLightness: number;
  runtimeCssVars: Record<string, string>;
  onPageBgCssChange?: (backgroundColor: string) => void;
};

export const ContrastCheckPanel = ({
  appBgInput,
  appBgLightness,
  runtimeCssVars,
  onPageBgCssChange,
}: ContrastCheckPanelProps) => {
  const { state } = usePaletteLabContext();
  const families = state.projects.find((p) => p.id === state.activeProjectId)?.colorFamilies ?? [];

  const [pageBgKey, setPageBgKey] = useState<PageBgKey>("default");
  const [surfaceBgKey, setSurfaceBgKey] = useState<SurfaceBgKey>("none");
  const [failOnly, setFailOnly] = useState(false);
  const [ignorePressedChecks, setIgnorePressedChecks] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const listPanelRef = useRef<HTMLDivElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const [slideHeight, setSlideHeight] = useState<number | null>(null);

  // ── BG resolution ────────────────────────────────────────────────────────
  const neutralAlphaOrigin = getNeutralAlphaOrigin(appBgLightness);
  const appBgRgb = useMemo(() => parseColorToRgb(appBgInput), [appBgInput]);
  const appBgHex = useMemo(() => rgbToHexString(appBgRgb), [appBgRgb]);

  const pageBgRgb = useMemo(() => {
    return (
      resolveRuntimeBackgroundRgb(pageBgKey, runtimeCssVars, families, appBgRgb, neutralAlphaOrigin, appBgHex) ??
      appBgRgb
    );
  }, [pageBgKey, runtimeCssVars, families, appBgRgb, neutralAlphaOrigin, appBgHex]);

  const surfaceBgRgb = useMemo(() => {
    if (surfaceBgKey === "none") return pageBgRgb;
    if (isInverseSurface(surfaceBgKey)) {
      return (
        resolveRuntimeBackgroundRgb(
          INVERSE_SURFACE_TOKENS[surfaceBgKey],
          runtimeCssVars,
          families,
          pageBgRgb,
          neutralAlphaOrigin,
          appBgHex,
        ) ?? pageBgRgb
      );
    }
    return (
      resolveRuntimeBackgroundRgb(
        NORMAL_SURFACE_TOKENS[surfaceBgKey],
        runtimeCssVars,
        families,
        pageBgRgb,
        neutralAlphaOrigin,
        appBgHex,
      ) ?? pageBgRgb
    );
  }, [surfaceBgKey, pageBgRgb, runtimeCssVars, families, neutralAlphaOrigin, appBgHex]);

  const pageBgCss = useMemo(() => rgbToCss(pageBgRgb), [pageBgRgb]);
  const surfaceBgCss = useMemo(() => rgbToCss(surfaceBgRgb), [surfaceBgRgb]);

  useEffect(() => {
    onPageBgCssChange?.(pageBgCss);
  }, [onPageBgCssChange, pageBgCss]);

  const defaultBgCss = useMemo(
    () =>
      rgbToCss(
        resolveRuntimeBackgroundRgb("default", runtimeCssVars, families, appBgRgb, neutralAlphaOrigin, appBgHex) ??
          appBgRgb,
      ),
    [runtimeCssVars, families, appBgRgb, neutralAlphaOrigin, appBgHex],
  );
  const xSubtleBgCss = useMemo(
    () =>
      rgbToCss(
        resolveRuntimeBackgroundRgb(
          "neutral-xSubtle-opaque",
          runtimeCssVars,
          families,
          appBgRgb,
          neutralAlphaOrigin,
          appBgHex,
        ) ?? WHITE,
      ),
    [runtimeCssVars, families, appBgRgb, neutralAlphaOrigin, appBgHex],
  );
  const subtleBgCss = useMemo(
    () =>
      rgbToCss(
        resolveRuntimeBackgroundRgb(
          "neutral-subtle-opaque",
          runtimeCssVars,
          families,
          appBgRgb,
          neutralAlphaOrigin,
          appBgHex,
        ) ?? WHITE,
      ),
    [runtimeCssVars, families, appBgRgb, neutralAlphaOrigin, appBgHex],
  );

  // ── Surface mode & filtered checks ──────────────────────────────────────
  const activeSurfaceMode: SurfaceMode = isInverseSurface(surfaceBgKey) ? "inverse" : "normal";

  const filteredChecks = useMemo(
    () =>
      COMPONENT_CHECKS.filter(
        (c) => c.surfaceMode === activeSurfaceMode && (!ignorePressedChecks || c.state !== "pressed"),
      ),
    [activeSurfaceMode, ignorePressedChecks],
  );

  // ── Contrast computation ─────────────────────────────────────────────────
  const ctx = useMemo<BgContext>(
    () => ({ appBgRgb, pageBgRgb, surfaceBgRgb, neutralAlphaOrigin }),
    [appBgRgb, pageBgRgb, surfaceBgRgb, neutralAlphaOrigin],
  );

  const allResults = useMemo(
    () => computeChecksWithContext(filteredChecks, families, ctx, runtimeCssVars),
    [filteredChecks, families, ctx, runtimeCssVars],
  );

  // ── Component grouping ───────────────────────────────────────────────────
  const componentGroups = useMemo<ComponentGroup[]>(() => {
    const map = new Map<string, ComponentCheckResult[]>();
    for (const r of allResults) {
      const key = r.item.component;
      const existing = map.get(key);
      if (existing) existing.push(r);
      else map.set(key, [r]);
    }
    return Array.from(map.entries()).map(([component, results]) => ({
      component,
      failCount: results.filter((r) => r.pass === false).length,
      total: results.length,
    }));
  }, [allResults]);

  const totalFalse = componentGroups.reduce((sum, g) => sum + g.failCount, 0);
  const totalCount = allResults.length;

  // ── Selected component ───────────────────────────────────────────────────
  const selectedResults = useMemo(() => {
    if (!selectedComponent) return [];
    return allResults.filter((r) => r.item.component === selectedComponent);
  }, [allResults, selectedComponent]);

  useLayoutEffect(() => {
    const activePanel = selectedComponent ? detailPanelRef.current : listPanelRef.current;
    if (!activePanel) return;
    const updateHeight = () => setSlideHeight(activePanel.getBoundingClientRect().height);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(activePanel);
    return () => observer.disconnect();
  }, [selectedComponent]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const pageBgChips: Array<{ key: PageBgKey; bgCss: string }> = [
    { key: "neutral-subtle-opaque", bgCss: subtleBgCss },
    { key: "neutral-xSubtle-opaque", bgCss: xSubtleBgCss },
    { key: "default", bgCss: defaultBgCss },
  ];

  return (
    <>
      <BgPreviewCard
        pageBgCss={pageBgCss}
        pageBgKey={pageBgKey}
        surfaceBgCss={surfaceBgCss}
        surfaceBgKey={surfaceBgKey}
      />

      <div
        style={{
          alignItems: "flex-start",
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-xSmall)",
          justifyContent: "flex-start",
        }}
      >
        <BgSettingsRow label="Page BG">
          <div style={{ display: "flex", flex: "1 1 0", gap: "var(--aegis-space-xxSmall)", width: "100%" }}>
            {pageBgChips.map(({ key, bgCss }) => (
              <PageBgChip key={key} active={pageBgKey === key} bgCss={bgCss} onClick={() => setPageBgKey(key)} />
            ))}
          </div>
        </BgSettingsRow>

        <BgSettingsRow label="Surface BG">
          <Select
            options={SURFACE_BG_OPTIONS}
            size="small"
            style={{ width: "100%" }}
            value={surfaceBgKey}
            width="full"
            onChange={(v) => {
              if (v) setSurfaceBgKey(v as SurfaceBgKey);
            }}
          />
        </BgSettingsRow>
      </div>

      <div
        aria-hidden="true"
        style={{
          alignSelf: "stretch",
          borderBlockStart: "var(--aegis-border-width-thinPlus) solid var(--aegis-color-border-default)",
        }}
      />

      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--aegis-space-small)",
        }}
      >
        <Checkbox
          checked={failOnly}
          size="small"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFailOnly(e.target.checked)}
        >
          Fail only
        </Checkbox>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: "var(--aegis-space-xxSmall)",
            marginLeft: "auto",
          }}
        >
          <span
            style={{
              color: "var(--aegis-color-foreground-bold)",
              fontSize: "14px",
              fontWeight: 300,
              lineHeight: "23.8px",
            }}
          >
            {activeSurfaceMode === "inverse" ? "Inverse" : "Normal"} /
          </span>
          <span
            style={{
              color: "var(--aegis-color-foreground-default)",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              lineHeight: "21px",
            }}
          >
            <span style={{ color: "var(--aegis-color-background-danger-bold)" }}>{totalFalse}</span>/{totalCount}
          </span>
          <Popover closeButton={false} placement="bottom-end">
            <Popover.Anchor>
              <IconButton aria-label="Contrast settings" size="xSmall" variant="plain">
                {ignorePressedChecks ? (
                  <Badge color="information">
                    <Icon source={LfSetting} />
                  </Badge>
                ) : (
                  <Icon source={LfSetting} />
                )}
              </IconButton>
            </Popover.Anchor>
            <Popover.Content width="small">
              <Popover.Body>
                <Checkbox
                  checked={ignorePressedChecks}
                  size="small"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setIgnorePressedChecks(e.target.checked)}
                >
                  Ignore pressed states
                </Checkbox>
                <Text color="subtle" variant="body.small">
                  Pressed states will be excluded from contrast requirements.
                </Text>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        </div>
      </div>

      <div
        style={{
          blockSize: slideHeight == null ? undefined : \`\${slideHeight}px\`,
          overflow: "hidden",
          position: "relative",
          transition: "block-size var(--aegis-motion-duration-fast) var(--aegis-motion-easing-default)",
        }}
      >
        <div
          ref={listPanelRef}
          aria-hidden={selectedComponent ? true : undefined}
          style={{
            insetBlockStart: 0,
            insetInline: 0,
            pointerEvents: selectedComponent ? "none" : undefined,
            position: "absolute",
            transform: selectedComponent ? "translateX(-100%)" : "translateX(0)",
            transition: "transform var(--aegis-motion-duration-fast) var(--aegis-motion-easing-default)",
            willChange: "transform",
          }}
        >
          <ComponentListView failOnly={failOnly} groups={componentGroups} onSelect={setSelectedComponent} />
        </div>
        <div
          ref={detailPanelRef}
          aria-hidden={selectedComponent ? undefined : true}
          style={{
            insetBlockStart: 0,
            insetInline: 0,
            pointerEvents: selectedComponent ? undefined : "none",
            position: "absolute",
            transform: selectedComponent ? "translateX(0)" : "translateX(100%)",
            transition: "transform var(--aegis-motion-duration-fast) var(--aegis-motion-easing-default)",
            willChange: "transform",
          }}
        >
          {selectedComponent && (
            <ComponentDetailView
              component={selectedComponent}
              failOnly={failOnly}
              results={selectedResults}
              surfaceBgCss={surfaceBgCss}
              onBack={() => setSelectedComponent(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};
`;export{e as default};