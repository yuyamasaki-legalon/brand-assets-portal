import {
  Button,
  ButtonGroup,
  Checkbox,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DataTableHeader,
  Divider,
  StatusLabel,
  Text,
} from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import {
  type ContrastComputeOptions,
  type ContrastPairDef,
  type ContrastResult,
  computeContrastResults,
  type RGB,
  relativeLuminance,
} from "../../token-overrides/contrast-utils";
import type {
  ComponentOverrides,
  DesignTokenOverrideCategory,
  DesignTokenOverrides,
} from "../../token-overrides/design-token-overrides";

type Props = {
  overrides: DesignTokenOverrides;
  componentOverrides?: ComponentOverrides;
  newTokenRefs?: Record<DesignTokenOverrideCategory, Record<string, string>>;
};

type SummaryRow = {
  component: string;
  passCount: number;
  failCount: number;
  totalCount: number;
  failRate: number;
};

// ─── Preview cells ────────────────────────────────────────────────────────────

const PREVIEW_W = 80;
const PREVIEW_H = 48;
const PREVIEW_CONTAINER_W = 58;
const PREVIEW_CONTAINER_H = 34;
const PREVIEW_UI_W = 42;
const PREVIEW_UI_H = 24;

type PreviewRecipe = {
  backgroundColor: string;
  border: string;
  labelColor: string;
};

const parseButtonVariant = (variant: string | undefined) => {
  if (!variant) return { kind: undefined, tone: undefined };
  const [kind, tone] = variant.split("·");
  return { kind, tone };
};

const getReadableLabelColor = (backgroundRgb: RGB | null, fallback: string) => {
  if (!backgroundRgb) {
    return fallback;
  }

  return relativeLuminance(backgroundRgb) > 0.35
    ? "var(--aegis-color-foreground-default)"
    : "var(--aegis-color-foreground-inverse)";
};

const getButtonLabelColor = (variant: string | undefined) => {
  const { kind, tone } = parseButtonVariant(variant);

  if (kind === "solid") {
    return "var(--aegis-color-foreground-inverse)";
  }

  switch (tone) {
    case "danger":
      return "var(--aegis-color-foreground-danger)";
    case "information":
      return "var(--aegis-color-foreground-information)";
    default:
      return "var(--aegis-color-foreground-default)";
  }
};

const getButtonRecipe = ({
  pair,
  fgCssVar,
  bgCssVar,
}: {
  pair: ContrastPairDef;
  fgCssVar: string;
  bgCssVar: string;
}): PreviewRecipe => {
  const { kind } = parseButtonVariant(pair.variant);

  if (pair.previewKind === "internal") {
    return {
      backgroundColor: bgCssVar,
      border: "none",
      labelColor: fgCssVar,
    };
  }

  if (pair.fg.category === "background") {
    return {
      backgroundColor: fgCssVar,
      border: "none",
      labelColor: getButtonLabelColor(pair.variant),
    };
  }

  if (kind === "plain" || kind === "gutterless") {
    return {
      backgroundColor: "transparent",
      border: "none",
      labelColor: fgCssVar,
    };
  }

  return {
    backgroundColor: "transparent",
    border: "none",
    labelColor: fgCssVar,
  };
};

const getTextFieldBackgroundColor = (state: string | undefined, stateLabel: string | undefined, fallback: string) => {
  const stateKey = [state, stateLabel].filter(Boolean).join(" / ");
  if (stateKey.includes("error")) return "var(--aegis-color-background-danger-subtle)";
  if (stateKey.includes("focused")) return "var(--aegis-color-background-input-focused)";
  if (stateKey.includes("hovered")) return "var(--aegis-color-background-input-hovered)";
  return fallback;
};

const getTextFieldRecipe = ({
  pair,
  fgCssVar,
  bgCssVar,
}: {
  pair: ContrastPairDef;
  fgCssVar: string;
  bgCssVar: string;
}): PreviewRecipe => {
  const fieldBackgroundColor =
    pair.previewKind === "internal"
      ? bgCssVar
      : getTextFieldBackgroundColor(pair.state, pair.stateLabel, "var(--aegis-color-background-input)");

  return {
    backgroundColor: fieldBackgroundColor,
    border: `1px solid ${pair.fg.category === "border" ? fgCssVar : "var(--aegis-color-border-input)"}`,
    labelColor: pair.previewKind === "internal" ? fgCssVar : "var(--aegis-color-foreground-default)",
  };
};

/**
 * Preview thumbnail — page bg → [container bg] → pseudo component.
 *
 * The goal is not a generic token swatch, but a lightweight component reenactment:
 *   - TextField keeps its input border and in-field text
 *   - Button keeps its button surface / transparent style and label
 *   - Other components fall back to a neutral rounded rect with label
 *
 * Colors always come from the actual CSS vars under test.
 */
const ContrastPreview = ({
  pair,
  fgRgb,
}: {
  pair: ContrastPairDef;
  /** Used for luminance check on component surface (background pairs). */
  fgRgb: RGB | null;
}) => {
  const fgCssVar = `var(--aegis-color-${pair.fg.category}-${pair.fg.key})`;
  const bgCssVar = `var(--aegis-color-${pair.bg.category}-${pair.bg.key})`;
  const pageBgCssVar = pair.pageBg ? `var(--aegis-color-${pair.pageBg.category}-${pair.pageBg.key})` : null;

  const isInternal = pair.previewKind === "internal";
  const isBorderFg = pair.fg.category === "border";
  const isSurfaceFg = pair.fg.category === "background";
  const isGraphicFg = pair.fg.category === "foreground" && pair.criterion === "non-text";
  const isButton = pair.component === "Button";
  const isTextField = pair.component === "Input";

  const label = (color: string) => (
    <Text
      as="span"
      variant="body.small.bold"
      style={{
        color,
        fontSize: 12,
        lineHeight: 1,
        fontFamily: "sans-serif",
        userSelect: "none",
      }}
    >
      Aa
    </Text>
  );

  const graphic = (color: string) => (
    <div
      aria-hidden="true"
      style={{
        width: "calc(var(--aegis-size-xSmall) - var(--aegis-space-xxSmall))",
        height: "calc(var(--aegis-size-xSmall) - var(--aegis-space-xxSmall))",
        borderRadius: "50%",
        backgroundColor: color,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );

  const boxStyle: CSSProperties = {
    width: PREVIEW_UI_W,
    height: PREVIEW_UI_H,
    paddingInline: "var(--aegis-space-xSmall)",
    paddingBlock: "var(--aegis-space-xxSmall)",
    boxSizing: "border-box",
    borderRadius: "var(--aegis-radius-medium)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  const renderUI = () => {
    if (isTextField) {
      const recipe = getTextFieldRecipe({ pair, fgCssVar, bgCssVar });

      return (
        <div
          style={{
            ...boxStyle,
            backgroundColor: recipe.backgroundColor,
            border: recipe.border,
          }}
        >
          {label(recipe.labelColor)}
        </div>
      );
    }

    if (isButton) {
      const recipe = getButtonRecipe({
        pair,
        fgCssVar,
        bgCssVar,
      });

      return (
        <div
          style={{
            ...boxStyle,
            backgroundColor: recipe.backgroundColor,
            border: recipe.border,
          }}
        >
          {label(recipe.labelColor)}
        </div>
      );
    }

    if (isInternal) {
      // Generic internal component: actual surface + actual label
      return <div style={{ ...boxStyle, backgroundColor: bgCssVar, border: "none" }}>{label(fgCssVar)}</div>;
    }

    if (isBorderFg) {
      // Generic border check: neutral surface + tested border token
      return (
        <div
          style={{
            ...boxStyle,
            backgroundColor: "var(--aegis-color-background-input)",
            border: `2px solid ${fgCssVar}`,
          }}
        >
          {label("var(--aegis-color-foreground-default)")}
        </div>
      );
    }

    if (isSurfaceFg) {
      // Generic surface check: show the tested surface and readable label
      return (
        <div style={{ ...boxStyle, backgroundColor: fgCssVar, border: "none" }}>
          {label(getReadableLabelColor(fgRgb, "var(--aegis-color-foreground-default)"))}
        </div>
      );
    }

    if (isGraphicFg) {
      return (
        <div
          style={{
            ...boxStyle,
            backgroundColor: isInternal ? bgCssVar : "transparent",
            border: "none",
          }}
        >
          {graphic(fgCssVar)}
        </div>
      );
    }

    // Generic text-on-container fallback
    return (
      <div
        style={{
          ...boxStyle,
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        {label(fgCssVar)}
      </div>
    );
  };

  const outerBg = isInternal ? (pageBgCssVar ?? "var(--aegis-color-background-default)") : (pageBgCssVar ?? bgCssVar);

  return (
    <div
      aria-hidden="true"
      style={{
        width: PREVIEW_W,
        height: PREVIEW_H,
        borderRadius: "var(--aegis-radius-medium)",
        backgroundColor: outerBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {!isInternal && pageBgCssVar ? (
        // 3-layer container pair: page bg (outer) → container bg (inner rect) → UI element
        <div
          style={{
            width: PREVIEW_CONTAINER_W,
            height: PREVIEW_CONTAINER_H,
            borderRadius: "var(--aegis-radius-small)",
            backgroundColor: bgCssVar,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderUI()}
        </div>
      ) : (
        // Internal pair (page bg outer → UI element) or 2-layer container pair
        renderUI()
      )}
    </div>
  );
};

// ─── Ratio + pass/fail cell ───────────────────────────────────────────────────

const RatioBadge = ({ ratio, pass }: { ratio: number | null; pass: boolean | null }) => {
  if (ratio === null || pass === null) {
    return (
      <Text variant="body.small" style={{ color: "var(--aegis-color-foreground-xSubtle)" }}>
        N/A
      </Text>
    );
  }

  return (
    <StatusLabel color={pass ? "teal" : "red"} size="small" variant="fill">
      {pass ? "Pass" : "Fail"}: {ratio.toFixed(2)}:1
    </StatusLabel>
  );
};

// ─── Column definitions ───────────────────────────────────────────────────────

const CRITERION_LABEL: Record<string, string> = {
  "text-normal": "4.5:1",
  "text-large": "3:1",
  "non-text": "3:1",
};

const STATE_COLUMN_INLINE_SIZE = "var(--aegis-layout-width-x6Small)";
const CONTEXT_COLUMN_INLINE_SIZE = "var(--aegis-layout-width-x6Small)";
const CRITERION_COLUMN_INLINE_SIZE = "var(--aegis-size-x8Large)";
const RATIO_COLUMN_INLINE_SIZE = "var(--aegis-size-x13Large)";
const LAYER_DIVIDER_INLINE_SIZE = "var(--aegis-size-x3Large)";
const formatLayerToken = (category: string, key: string) => `${category}-${key}`;
const getPairContext = (pair: ContrastPairDef) => {
  const contexts: string[] = [];
  const stateLabel = pair.stateLabel;
  if (stateLabel) {
    const [, detail] = stateLabel.split(" / ");
    if (detail && detail !== "border") {
      contexts.push(detail);
    }
  }
  if (pair.pageBg?.key && pair.pageBg.key !== "default") {
    contexts.push("pane fill");
  }

  return contexts.length > 0 ? contexts.join(" / ") : null;
};

const getLayerSections = (pair: ContrastPairDef) => {
  const rawUiLayers =
    pair.previewKind === "internal"
      ? [formatLayerToken(pair.fg.category, pair.fg.key), formatLayerToken(pair.bg.category, pair.bg.key)]
      : [formatLayerToken(pair.fg.category, pair.fg.key)];
  const uiLayers = rawUiLayers;

  const environmentLayers = [formatLayerToken(pair.bg.category, pair.bg.key)];
  if (pair.pageBg) {
    const pageBgLayer = formatLayerToken(pair.pageBg.category, pair.pageBg.key);
    environmentLayers.push(pageBgLayer);
  }

  return {
    uiLayers,
    environmentLayers: pair.previewKind === "internal" ? ["none"] : environmentLayers,
  };
};

const buildColumns = (): DataTableColumnDef<ContrastResult, string>[] => [
  {
    id: "preview",
    name: "Preview",
    width: "fit",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => row.pair.id,
    renderCell: ({ row }) => (
      <DataTableCell>
        <ContrastPreview pair={row.pair} fgRgb={row.fgRgb} />
      </DataTableCell>
    ),
  },
  {
    id: "pair",
    name: "Layers",
    width: "medium",
    minWidth: "small",
    maxWidth: "xLarge",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => row.pair.label,
    renderCell: ({ row }) => {
      const { uiLayers, environmentLayers } = getLayerSections(row.pair);

      return (
        <DataTableCell style={{ whiteSpace: "normal" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, minWidth: 0, width: "100%" }}>
            {uiLayers.map((layer) => (
              <Text
                key={layer}
                variant="body.small"
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  color: "var(--aegis-color-foreground-subtle)",
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {layer}
              </Text>
            ))}
            {environmentLayers.length > 0 && (
              <>
                <div
                  aria-hidden="true"
                  style={{
                    inlineSize: LAYER_DIVIDER_INLINE_SIZE,
                    borderTop: "1px solid var(--aegis-color-border-bold)",
                    opacity: 0.72,
                    marginBlock: "var(--aegis-space-xxSmall)",
                  }}
                />
                {environmentLayers.map((layer) => (
                  <Text
                    key={layer}
                    variant="body.xSmall"
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      color: "var(--aegis-color-foreground-xSubtle)",
                      whiteSpace: "normal",
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    {layer}
                  </Text>
                ))}
              </>
            )}
          </div>
        </DataTableCell>
      );
    },
  },
  {
    id: "ratio",
    name: "Contrast ratio",
    width: "fit",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => (row.ratio !== null ? row.ratio.toFixed(2) : "n/a"),
    renderHeader: () => (
      <DataTableHeader style={{ inlineSize: RATIO_COLUMN_INLINE_SIZE }}>Contrast ratio</DataTableHeader>
    ),
    renderCell: ({ row }) => (
      <DataTableCell style={{ inlineSize: RATIO_COLUMN_INLINE_SIZE }}>
        <RatioBadge ratio={row.ratio} pass={row.pass} />
      </DataTableCell>
    ),
  },
  {
    id: "criterion",
    name: "Criterion",
    width: "fit",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => row.pair.criterion,
    renderHeader: () => (
      <DataTableHeader style={{ inlineSize: CRITERION_COLUMN_INLINE_SIZE }}>Criterion</DataTableHeader>
    ),
    renderCell: ({ row }) => (
      <DataTableCell style={{ inlineSize: CRITERION_COLUMN_INLINE_SIZE }}>
        <Text variant="body.small" style={{ color: "var(--aegis-color-foreground-xSubtle)" }}>
          {CRITERION_LABEL[row.pair.criterion] ?? row.pair.criterion}
        </Text>
      </DataTableCell>
    ),
  },
  {
    id: "target",
    name: "Target",
    width: "fit",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => row.pair.fg.category,
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text variant="body.medium" style={{ color: "var(--aegis-color-foreground-subtle)" }}>
          {row.pair.fg.category}
        </Text>
      </DataTableCell>
    ),
  },
  {
    id: "context",
    name: "Context",
    width: "fit",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => getPairContext(row.pair) ?? "",
    renderHeader: () => <DataTableHeader style={{ inlineSize: CONTEXT_COLUMN_INLINE_SIZE }}>Context</DataTableHeader>,
    renderCell: ({ row }) => {
      const context = getPairContext(row.pair);
      return context ? (
        <DataTableCell style={{ inlineSize: CONTEXT_COLUMN_INLINE_SIZE, whiteSpace: "normal" }}>
          <Text
            variant="body.small"
            style={{
              color: "var(--aegis-color-foreground-subtle)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {context}
          </Text>
        </DataTableCell>
      ) : (
        <DataTableCell style={{ inlineSize: CONTEXT_COLUMN_INLINE_SIZE }} />
      );
    },
  },
  {
    id: "variant",
    name: "Variant",
    width: "xxSmall",
    minWidth: "xxSmall",
    maxWidth: "xxSmall",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => row.pair.variant ?? "--",
    renderCell: ({ row }) => {
      const label = row.pair.variant ?? "--";
      return (
        <DataTableCell style={{ whiteSpace: "normal" }}>
          <Text
            variant="body.small"
            style={{
              color: "var(--aegis-color-foreground-subtle)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {label}
          </Text>
        </DataTableCell>
      );
    },
  },
  {
    id: "state",
    name: "State",
    width: "fit",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => row.pair.state ?? "",
    renderHeader: () => <DataTableHeader style={{ inlineSize: STATE_COLUMN_INLINE_SIZE }}>State</DataTableHeader>,
    renderCell: ({ row }) =>
      row.pair.state ? (
        <DataTableCell style={{ inlineSize: STATE_COLUMN_INLINE_SIZE, whiteSpace: "normal" }}>
          <Text
            variant="body.small"
            style={{
              color: "var(--aegis-color-foreground-subtle)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {row.pair.state}
          </Text>
        </DataTableCell>
      ) : (
        <DataTableCell style={{ inlineSize: STATE_COLUMN_INLINE_SIZE }} />
      ),
  },
];

const buildSummaryColumns = (): DataTableColumnDef<SummaryRow, string>[] => [
  {
    id: "component",
    name: "Component",
    width: "fit",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => row.component,
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text variant="body.small" style={{ fontWeight: 600 }}>
          {row.component}
        </Text>
      </DataTableCell>
    ),
  },
  {
    id: "pass",
    name: "Pass",
    width: "xxSmall",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => String(row.passCount),
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text variant="body.small" style={{ color: "var(--aegis-color-foreground-default)" }}>
          {row.passCount}
        </Text>
      </DataTableCell>
    ),
  },
  {
    id: "fail",
    name: "Fail",
    width: "xxSmall",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => String(row.failCount),
    renderCell: ({ row }) => (
      <DataTableCell>
        {row.failCount > 0 ? (
          <StatusLabel color="red" size="small" variant="fill">
            {row.failCount}
          </StatusLabel>
        ) : (
          <Text variant="body.small" style={{ color: "var(--aegis-color-foreground-subtle)" }}>
            0
          </Text>
        )}
      </DataTableCell>
    ),
  },
  {
    id: "total",
    name: "Total",
    width: "xxSmall",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => String(row.totalCount),
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text variant="body.medium" style={{ color: "var(--aegis-color-foreground-subtle)" }}>
          {row.totalCount}
        </Text>
      </DataTableCell>
    ),
  },
  {
    id: "failRate",
    name: "Fail rate",
    width: "xxSmall",
    sortable: false,
    pinnable: false,
    reorderable: false,
    resizable: false,
    getValue: (row): string => row.failRate.toFixed(1),
    renderCell: ({ row }) => (
      <DataTableCell>
        <Text variant="body.small" style={{ color: "var(--aegis-color-foreground-subtle)" }}>
          {row.failRate.toFixed(1)}%
        </Text>
      </DataTableCell>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ALL_LABEL = "All";
const HIDDEN_COMPONENTS = new Set(["IconButton"]);

export const ContrastCheckView = ({ overrides, componentOverrides, newTokenRefs }: Props) => {
  const computeOptions = useMemo(
    (): ContrastComputeOptions => ({ componentOverrides, newTokenRefs }),
    [componentOverrides, newTokenRefs],
  );
  const allResults = useMemo(() => computeContrastResults(overrides, computeOptions), [overrides, computeOptions]);
  const visibleResults = useMemo(
    () => allResults.filter((result) => !result.pair.component || !HIDDEN_COMPONENTS.has(result.pair.component)),
    [allResults],
  );
  const columns = useMemo(buildColumns, []);
  const summaryColumns = useMemo(buildSummaryColumns, []);

  // Derive ordered list of component names that have at least one pair
  const componentLabels = useMemo(() => {
    const seen = new Set<string>();
    for (const r of visibleResults) {
      if (r.pair.component) seen.add(r.pair.component);
    }
    return [ALL_LABEL, ...Array.from(seen)];
  }, [visibleResults]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeLabel = componentLabels[activeIndex] ?? ALL_LABEL;

  const results = useMemo(
    () => (activeLabel === ALL_LABEL ? visibleResults : visibleResults.filter((r) => r.pair.component === activeLabel)),
    [visibleResults, activeLabel],
  );

  const [showFailOnly, setShowFailOnly] = useState(false);

  const summaryRows = useMemo((): SummaryRow[] => {
    const byComponent = new Map<string, Omit<SummaryRow, "failRate">>();

    for (const result of visibleResults) {
      const component = result.pair.component;
      if (!component) continue;

      const current = byComponent.get(component) ?? {
        component,
        passCount: 0,
        failCount: 0,
        totalCount: 0,
      };

      current.totalCount += 1;
      if (result.pass === true) current.passCount += 1;
      if (result.pass === false) current.failCount += 1;

      byComponent.set(component, current);
    }

    return [...byComponent.values()]
      .map((row) => ({
        ...row,
        failRate: row.totalCount > 0 ? (row.failCount / row.totalCount) * 100 : 0,
      }))
      .sort(
        (a, b) => b.failCount - a.failCount || b.totalCount - a.totalCount || a.component.localeCompare(b.component),
      );
  }, [visibleResults]);

  const passCount = useMemo(() => results.filter((r) => r.pass === true).length, [results]);
  const failCount = useMemo(() => results.filter((r) => r.pass === false).length, [results]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        gap: "var(--aegis-space-large)",
      }}
    >
      <div
        style={{
          flexShrink: 0,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <ButtonGroup style={{ flexWrap: "wrap", rowGap: "var(--aegis-space-xSmall)" } as CSSProperties}>
            {componentLabels.map((label, index) => (
              <Button
                key={label}
                variant={activeIndex === index ? "solid" : "plain"}
                size="small"
                weight="normal"
                onClick={() => setActiveIndex(index)}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
      <Divider style={{ borderColor: "var(--aegis-color-border-bold)" }} />
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "var(--aegis-space-medium)",
        }}
      >
        <div
          style={{
            width: "var(--aegis-size-x8Large)",
            minWidth: "var(--aegis-size-x8Large)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text variant="body.medium" style={{ color: "var(--aegis-color-foreground-subtle)" }}>
            Pass:{" "}
            <Text
              as="span"
              variant="data.medium.bold"
              style={{
                color: "var(--aegis-color-foreground-default)",
                fontSize: "inherit",
                lineHeight: "inherit",
              }}
            >
              {passCount}
            </Text>
          </Text>
        </div>
        <div
          style={{
            width: "var(--aegis-size-x8Large)",
            minWidth: "var(--aegis-size-x8Large)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text variant="body.medium" style={{ color: "var(--aegis-color-foreground-subtle)" }}>
            Fail:{" "}
            <Text
              as="span"
              variant="data.medium.bold"
              style={{
                color: failCount > 0 ? "var(--aegis-color-foreground-danger)" : "var(--aegis-color-foreground-default)",
                fontSize: "inherit",
                lineHeight: "inherit",
              }}
            >
              {failCount}
            </Text>
          </Text>
        </div>
        {failCount > 0 && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                height: "100%",
                paddingBlock: "var(--aegis-space-xxSmall)",
              }}
            >
              <Divider orientation="vertical" style={{ borderColor: "var(--aegis-color-border-bold)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                size="small"
                checked={showFailOnly}
                onChange={(e) => setShowFailOnly((e.target as HTMLInputElement).checked)}
              >
                Fail only
              </Checkbox>
            </div>
          </>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0, width: "100%", overflowX: "hidden", overflowY: "auto" }}>
        {activeLabel === ALL_LABEL ? (
          <DataTable
            key="contrast-summary"
            columns={summaryColumns}
            rows={showFailOnly ? summaryRows.filter((row) => row.failCount > 0) : summaryRows}
            getRowId={(row) => row.component}
            highlightScope="none"
            outerBordered
            stickyHeader
            size="small"
          />
        ) : (
          <DataTable
            key={`contrast-detail:${activeLabel}:${showFailOnly ? "fail" : "all"}`}
            columns={columns}
            rows={showFailOnly ? results.filter((r) => r.pass === false) : results}
            getRowId={(row) => row.pair.id}
            highlightScope="none"
            outerBordered
            stickyHeader
            size="small"
          />
        )}
      </div>
    </div>
  );
};
