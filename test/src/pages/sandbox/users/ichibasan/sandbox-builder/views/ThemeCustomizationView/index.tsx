import {
  LfArrowLeft,
  LfBook,
  LfCloseCircle,
  LfCode,
  LfEllipsisDot,
  LfEye,
  LfEyeSlash,
  LfFaceMoodSmile,
  LfFileCode,
  LfInformationCircle,
  LfLayoutHorizon,
  LfMagnifyingGlass,
  LfPlusLarge,
  LfReply,
  LfSetting,
  LfTag,
  LfTrash,
} from "@legalforce/aegis-icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  ActionList,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxCard,
  Combobox,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DateField,
  DatePicker,
  Divider,
  FileDrop,
  Form,
  FormControl,
  Icon,
  IconButton,
  NavList,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  Radio,
  RadioCard,
  RadioGroup,
  Search,
  SegmentedControl,
  Select,
  Skeleton,
  StatusLabel,
  Tab,
  Tag,
  TagPicker,
  Text,
  Textarea,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { hexToRgba } from "../../token-overrides/color-utils";
import {
  BASE_BACKGROUND_TOKEN_SPECS,
  type BaseBackgroundTokenSpec,
  buildBaseForegroundTokens,
  buildBrandAccentPrimaryScale,
  buildBrandTokensFromSwatches,
  computeBaseBackgroundTokenValue as computeSharedBaseBackgroundTokenValue,
  createPaletteMap,
} from "../../token-overrides/palette-computer";
import { COMPUTED_TRANSPARENT_SCALES, NEUTRAL_PALETTE } from "../../token-overrides/tokens";
import type { GlobalStylingSettings, PaneSettings } from "../SizingAndStylingView/types";
import styles from "./index.module.css";
import { ThemeCustomizationPopover, type ThemeCustomizationPopoverEditorState } from "./ThemeCustomizationPopover";

interface Props {
  globalStyling: GlobalStylingSettings;
  paneEndSettings: PaneSettings;
  onOpenTokenDialog: () => void;
  brandForegroundColor?: string;
  themeState: ThemeCustomizationState;
  onThemeStateChange: React.Dispatch<React.SetStateAction<ThemeCustomizationState>>;
  onBrandTokensChange: (tokens: {
    background?: Record<string, string>;
    backgroundManagedKeys?: string[];
    forground?: Record<string, string>;
    forgroundManagedKeys?: string[];
    Brand?: { default: string };
    BrandBackground?: { bold: string; "bold.hovered": string; "bold.pressed": string };
    BrandForeground?: { default: string };
    ThemeAccent?: Record<string, unknown>;
  }) => void;
}

const DEFAULT_POPOVER_EDITOR_STATE: ThemeCustomizationPopoverEditorState = {
  hexValue: "000000",
  selectedLightness: "900",
  chromaValue: "0.00",
  chromaMode: "all",
  customChromaValues: {},
  baseColor: { l: 0.213, c: 0, h: 0 },
};

const cardListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--aegis-space-large)",
};

const galleryGridStyle: React.CSSProperties = {
  columnWidth: "280px",
  columnGap: "var(--aegis-space-medium)",
};

const previewCardBodyStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--aegis-space-small)",
};

type PreviewTableRow = {
  id: string;
  title: string;
  status: "draft" | "active" | "closed";
};

const previewTableRows: PreviewTableRow[] = [
  { id: "row-1", title: "Master service agreement", status: "active" },
  { id: "row-2", title: "Employment guideline update", status: "draft" },
  { id: "row-3", title: "Vendor onboarding policy", status: "closed" },
];

const previewStatusColorMap: Record<PreviewTableRow["status"], "blue" | "yellow" | "neutral"> = {
  active: "blue",
  draft: "yellow",
  closed: "neutral",
};

const previewStatusLabelColors = [
  "neutral",
  "red",
  "yellow",
  "blue",
  "teal",
  "gray",
  "purple",
  "magenta",
  "orange",
  "lime",
  "indigo",
] as const;

const previewTagColors = [
  "neutral",
  "red",
  "orange",
  "yellow",
  "lime",
  "teal",
  "blue",
  "indigo",
  "purple",
  "magenta",
  "transparent",
] as const;

const previewBadgeColors = ["neutral", "subtle", "danger", "success", "information", "warning"] as const;

const previewCountBadgeValues = [3, 20, 8, 100, 999, 9999] as const;

const PANE_WIDTH_ORDER = ["small", "medium", "large", "xLarge", "xxLarge"] as const;

const getRaisedPaneWidth = (paneWidth: string): string => {
  const currentIndex = PANE_WIDTH_ORDER.indexOf(paneWidth as (typeof PANE_WIDTH_ORDER)[number]);
  if (currentIndex === -1) return paneWidth;

  return PANE_WIDTH_ORDER[Math.min(currentIndex + 2, PANE_WIDTH_ORDER.length - 1)];
};

const previewTableColumns: DataTableColumnDef<PreviewTableRow, string>[] = [
  {
    id: "title",
    name: "Title",
    getValue: (row): string => row.title,
    renderCell: ({ value }) => <DataTableCell>{value}</DataTableCell>,
  },
  {
    id: "status",
    name: "Status",
    getValue: (row): string => row.status,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel color={previewStatusColorMap[row.status]}>{row.status}</StatusLabel>
      </DataTableCell>
    ),
  },
];

function PreviewGalleryCard({
  title,
  description,
  variant,
  children,
}: {
  title: string;
  description: string;
  variant: "plain" | "outline" | "fill";
  children: React.ReactNode;
}) {
  return (
    <Card
      size="medium"
      variant={variant}
      style={{
        breakInside: "avoid",
        marginBottom: "var(--aegis-space-medium)",
        width: "100%",
      }}
    >
      <CardHeader>
        <Text variant="title.small">{title}</Text>
      </CardHeader>
      <CardBody>
        <div style={previewCardBodyStyle}>
          <Text variant="body.small" color="subtle">
            {description}
          </Text>
          <Divider />
          {children}
        </div>
      </CardBody>
    </Card>
  );
}

export type SwatchItem = { label: string; cssColor: string };
type PopoverMode = "brand" | "base";
export type ThemeCardId = "brandColor" | "brandAccentColor" | "baseColorBackground" | "baseColorForeground";
export type ThemeSelectionValue =
  | "neutral"
  | "none"
  | "useBrandColor"
  | "useBrandColorXSubtle"
  | "useBrandAccentColor"
  | "useBrandAccentColorXSubtle"
  | "useBaseColorXSubtle"
  | "custom";
type PopoverPreviewKind = "brand" | "all" | "baseBackground" | "baseForeground";
export type ChromaAdjustmentValue = Record<"useBrandColor" | "useBrandAccentColor", number>;
/**
 * User-specified HEX overrides for semantic tokens that are otherwise
 * auto-computed.  When a field is set, it takes priority over the
 * auto-computed value; when absent, the auto-computed value is used.
 *
 * Priority rule (applied in token computation useEffect):
 *   hexOverrides.{field} > auto-computed value > (nothing / Aegis default)
 */
export interface ThemeHexOverrides {
  /** Override for BrandForeground.default (auto-computed from palette.800 when brand tone is 400/500). */
  brandForeground?: string;
}

export interface ThemeCustomizationState {
  contentVariant: "plain" | "outline" | "fill";
  themeSelections: Record<ThemeCardId, ThemeSelectionValue>;
  popoverOpenCardId: ThemeCardId | null;
  selectedBrandTone: string;
  popoverSwatches: Record<ThemeCardId, SwatchItem[]>;
  paletteSwatches: Record<ThemeCardId, SwatchItem[]>;
  chromaAdjustments: Record<ThemeCardId, ChromaAdjustmentValue>;
  popoverEditorStates: Record<ThemeCardId, ThemeCustomizationPopoverEditorState>;
  spotOverrides: {
    baseColorBackground: Partial<Record<string, ThemeSelectionValue>>;
  };
  /** Explicit HEX overrides; take priority over auto-computed values. */
  hexOverrides: ThemeHexOverrides;
}

const CONTENT_VARIANTS = ["plain", "outline", "fill"] as const;
const CONTENT_TO_CARD_VARIANT: Record<ThemeCustomizationState["contentVariant"], "plain" | "outline" | "fill"> = {
  plain: "fill",
  outline: "outline",
  fill: "plain",
};

const normalizeBrandSwatchesForBase = (swatches: SwatchItem[]): SwatchItem[] =>
  swatches.map((swatch) => ({
    ...swatch,
    label: swatch.label === "alt500" ? "500" : swatch.label,
  }));

const createThemeAccentDefinition = (swatches: SwatchItem[]) => {
  const scale = createPaletteMap(swatches, normalizeColorForTokenOutput);
  const primaryBase = scale["900"];

  if (!primaryBase) {
    return null;
  }

  return {
    internal: {
      color: {
        palette: {
          scale: {
            themeAccent: scale,
          },
          primary: {
            themeAccent: buildBrandAccentPrimaryScale(primaryBase, COMPUTED_TRANSPARENT_SCALES),
          },
        },
      },
    },
    color: {
      $type: "color",
      background: {
        "brand-bold": { $value: "{internal.color.palette.scale.themeAccent.800}" },
        "brand-bold-hovered": { $value: "{internal.color.palette.scale.themeAccent.700}" },
        "brand-bold-pressed": { $value: "{internal.color.palette.scale.themeAccent.600}" },
        disabled: { $value: "{internal.color.palette.primary.themeAccent.50}" },
        "input-hovered": { $value: "{internal.color.palette.primary.themeAccent.100}" },
        "input-bold": { $value: "{internal.color.palette.scale.themeAccent.400}" },
        selected: { $value: "{internal.color.palette.primary.themeAccent.200}" },
        "selected-bold": { $value: "{internal.color.palette.scale.themeAccent.800}" },
        neutral: { $value: "{internal.color.palette.primary.themeAccent.300}" },
        "neutral-opaque": { $value: "{internal.color.palette.scale.themeAccent.100}" },
        "neutral-subtlest-hovered": { $value: "{internal.color.palette.primary.themeAccent.100}" },
        "neutral-subtlest-pressed": { $value: "{internal.color.palette.primary.themeAccent.200}" },
        "neutral-subtlest-selected": { $value: "{internal.color.palette.primary.themeAccent.100}" },
        "neutral-subtlest-opaque-hovered": { $value: "{internal.color.palette.scale.themeAccent.100}" },
        "neutral-subtlest-opaque-pressed": { $value: "{internal.color.palette.scale.themeAccent.200}" },
        "neutral-subtlest-opaque-selected": { $value: "{internal.color.palette.scale.themeAccent.100}" },
        "neutral-xSubtle": { $value: "{internal.color.palette.primary.themeAccent.50}" },
        "neutral-xSubtle-hovered": { $value: "{internal.color.palette.primary.themeAccent.100}" },
        "neutral-xSubtle-pressed": { $value: "{internal.color.palette.primary.themeAccent.200}" },
        "neutral-xSubtle-selected": { $value: "{internal.color.palette.primary.themeAccent.100}" },
        "neutral-xSubtle-opaque": { $value: "{internal.color.palette.scale.themeAccent.50}" },
        "neutral-subtle": { $value: "{internal.color.palette.primary.themeAccent.100}" },
        "neutral-subtle-hovered": { $value: "{internal.color.palette.primary.themeAccent.200}" },
        "neutral-subtle-pressed": { $value: "{internal.color.palette.primary.themeAccent.300}" },
        "neutral-subtle-opaque": { $value: "{internal.color.palette.scale.themeAccent.100}" },
      },
      foreground: {
        brand: { $value: "{internal.color.palette.scale.themeAccent.800}" },
        default: { $value: "{internal.color.palette.scale.themeAccent.900}" },
        bold: { $value: "{internal.color.palette.scale.themeAccent.900}" },
        disabled: { $value: "{internal.color.palette.scale.themeAccent.300}" },
        "disabled-inverse": { $value: "{internal.color.palette.scale.themeAccent.400}" },
        pressed: { $value: "{internal.color.palette.scale.themeAccent.900}" },
      },
      border: {
        brand: { $value: "{internal.color.palette.scale.themeAccent.800}" },
        default: { $value: "{internal.color.palette.primary.themeAccent.200}" },
        bold: { $value: "{internal.color.palette.scale.themeAccent.400}" },
        disabled: { $value: "{internal.color.palette.primary.themeAccent.200}" },
        selected: { $value: "{internal.color.palette.scale.themeAccent.800}" },
        input: { $value: "{internal.color.palette.scale.themeAccent.500}" },
        "input-hovered": { $value: "{internal.color.palette.scale.themeAccent.800}" },
        "input-focused": { $value: "{internal.color.palette.scale.themeAccent.800}" },
        neutral: { $value: "{internal.color.palette.primary.themeAccent.300}" },
        "neutral-subtlest-hovered": { $value: "{internal.color.palette.primary.themeAccent.300}" },
        "neutral-subtlest-pressed": { $value: "{internal.color.palette.scale.themeAccent.900}" },
        "neutral-subtle": { $value: "{internal.color.palette.primary.themeAccent.200}" },
        "neutral-bold": { $value: "{internal.color.palette.primary.themeAccent.500}" },
      },
    },
  } as const;
};

const areSwatchesEqual = (left: SwatchItem[], right: SwatchItem[]): boolean =>
  left.length === right.length &&
  left.every((swatch, index) => swatch.label === right[index]?.label && swatch.cssColor === right[index]?.cssColor);

const pickSwatchesByLabels = (swatches: SwatchItem[], labels: string[]): SwatchItem[] => {
  const swatchMap = new Map(swatches.map((swatch) => [swatch.label, swatch]));
  return labels.map((label) => swatchMap.get(label)).filter((swatch): swatch is SwatchItem => swatch !== undefined);
};

const parseOklchCss = (value: string): { l: number; c: number; h: number } | null => {
  const match = value.match(/^oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)$/);
  if (!match) {
    return null;
  }

  return {
    l: Number.parseFloat(match[1]),
    c: Number.parseFloat(match[2]),
    h: Number.parseFloat(match[3]),
  };
};

let colorNormalizationCanvasContext: CanvasRenderingContext2D | null = null;

const getColorNormalizationContext = (): CanvasRenderingContext2D | null => {
  if (typeof document === "undefined") {
    return null;
  }

  if (colorNormalizationCanvasContext) {
    return colorNormalizationCanvasContext;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  colorNormalizationCanvasContext = canvas.getContext("2d");
  return colorNormalizationCanvasContext;
};

const normalizeColorForTokenOutput = (value: string): string => {
  const context = getColorNormalizationContext();
  if (!context) {
    return value;
  }

  context.clearRect(0, 0, 1, 1);
  context.fillStyle = "#000000";
  context.fillStyle = value;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;

  if ([r, g, b, a].some((channel) => Number.isNaN(channel))) {
    return value;
  }

  if (a < 255) {
    const alpha = Number((a / 255).toFixed(3));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
};

const getSwatchColorByLabel = (swatches: SwatchItem[], label: string): string | undefined =>
  swatches.find((swatch) => swatch.label === label)?.cssColor;

const scaleSwatchChroma = (swatches: SwatchItem[], factor: number): SwatchItem[] =>
  swatches.map((swatch) => {
    const parsed = parseOklchCss(swatch.cssColor);
    if (!parsed) {
      return swatch;
    }

    return {
      ...swatch,
      cssColor: `oklch(${parsed.l.toFixed(2)}% ${(parsed.c * factor).toFixed(4)} ${parsed.h.toFixed(2)})`,
    };
  });

const AEGIS_BRAND_NEUTRAL_SWATCHES: SwatchItem[] = [
  { label: "default", cssColor: "var(--aegis-color-background-brand-bold)" },
  { label: "hovered", cssColor: "var(--aegis-color-background-brand-bold-hovered)" },
  { label: "pressed", cssColor: "var(--aegis-color-background-brand-bold-pressed)" },
];

const BASE_BACKGROUND_NEUTRAL_SWATCHES: SwatchItem[] = [
  { label: "200", cssColor: "#e8e8e8" },
  { label: "100", cssColor: "#f3f3f3" },
  { label: "50", cssColor: "#f9f9f9" },
];

const BASE_FOREGROUND_NEUTRAL_SWATCHES: SwatchItem[] = [
  { label: "900", cssColor: "#252525" },
  { label: "800", cssColor: "#2f2f2f" },
  { label: "700", cssColor: "#3e3e3e" },
  { label: "600", cssColor: "#545454" },
  { label: "500", cssColor: "#747474" },
];

const pickBaseBackgroundSwatches = (swatches: SwatchItem[]): SwatchItem[] => {
  if (swatches.length === 0) {
    return BASE_BACKGROUND_NEUTRAL_SWATCHES;
  }

  if (swatches.length === 1) {
    return [swatches[0], swatches[0], swatches[0]];
  }

  if (swatches.length === 2) {
    return [swatches[0], swatches[1], swatches[1]];
  }

  return [swatches[swatches.length - 3], swatches[swatches.length - 2], swatches[swatches.length - 1]];
};

const pickBaseForegroundSwatches = (swatches: SwatchItem[]): SwatchItem[] => {
  if (swatches.length === 0) {
    return [];
  }

  return swatches.slice(0, 5);
};

const BASE_BACKGROUND_MANAGED_KEYS = [
  "selected.bold",
  "neutral.xSubtle",
  "neutral.xSubtle.hovered",
  "neutral.xSubtle.pressed",
  "neutral.xSubtle.selected",
  "neutral.xSubtle.opaque",
  "neutral.subtle",
  "neutral.subtle.hovered",
  "neutral.subtle.pressed",
  "neutral.subtle.opaque",
  "neutral",
  "neutral.opaque",
  "neutral.subtlest.hovered",
  "neutral.subtlest.pressed",
  "neutral.subtlest.selected",
  "neutral.subtlest.opaque.hovered",
  "neutral.subtlest.opaque.pressed",
  "neutral.subtlest.opaque.selected",
  "disabled",
  "input.hovered",
  "selected",
] as const;
const BASE_FORGROUND_MANAGED_KEYS = ["default", "bold", "pressed", "subtle"] as const;

// selected.bold は現在未生成のため spec なし

const BASE_BACKGROUND_TOKEN_GROUPS: ReadonlyArray<{
  label: string;
  keys: ReadonlyArray<(typeof BASE_BACKGROUND_MANAGED_KEYS)[number]>;
}> = [
  {
    label: "xSubtle",
    keys: [
      "neutral.xSubtle",
      "neutral.xSubtle.hovered",
      "neutral.xSubtle.pressed",
      "neutral.xSubtle.selected",
      "neutral.xSubtle.opaque",
    ],
  },
  {
    label: "subtle",
    keys: ["neutral.subtle", "neutral.subtle.hovered", "neutral.subtle.pressed", "neutral.subtle.opaque"],
  },
  { label: "neutral", keys: ["neutral", "neutral.opaque"] },
  {
    label: "subtlest",
    keys: [
      "neutral.subtlest.hovered",
      "neutral.subtlest.pressed",
      "neutral.subtlest.selected",
      "neutral.subtlest.opaque.hovered",
      "neutral.subtlest.opaque.pressed",
      "neutral.subtlest.opaque.selected",
    ],
  },
  { label: "misc", keys: ["disabled", "input.hovered", "selected"] },
];

// Derive xSubtle alpha from the neutral transparent scale (tone 50) so it matches
// the new palette: rgba(neutral_900, computeWhiteEquivAlpha(neutral[50])).
const XSUBTLE_ALPHA = COMPUTED_TRANSPARENT_SCALES.find(([tone]) => tone === 50)?.[1] ?? 0.02;

const isXSubtleSelection = (selection: ThemeSelectionValue): boolean =>
  selection === "useBrandColorXSubtle" ||
  selection === "useBrandAccentColorXSubtle" ||
  selection === "useBaseColorXSubtle";

const getPaletteForBaseBackgroundSelection = (
  selection: ThemeSelectionValue,
  brandColorPalette: SwatchItem[],
  brandAccentPalette: SwatchItem[],
  customPalette: SwatchItem[],
): SwatchItem[] => {
  switch (selection) {
    case "useBrandColor":
    case "useBrandColorXSubtle":
      return normalizeBrandSwatchesForBase(brandColorPalette);
    case "useBrandAccentColor":
    case "useBrandAccentColorXSubtle":
      return brandAccentPalette;
    case "custom":
    case "useBaseColorXSubtle":
      return customPalette;
    default:
      return [];
  }
};

const themeCardConfigs = [
  {
    id: "brandColor",
    title: "BrandColor",
    popoverMode: "brand",
    popoverPreviewKind: "brand",
    popoverSwatchId: "brandColor",
    defaultSelection: "neutral",
    toneStops: ["#202020", "#929292", "#f3f3f3"],
  },
  {
    id: "brandAccentColor",
    title: "BrandAccentColor",
    popoverMode: "base",
    popoverPreviewKind: "all",
    popoverSwatchId: "brandAccentColor",
    defaultSelection: "none",
    toneStops: [
      "#13233d",
      "#1d3458",
      "#2b4a78",
      "#40659e",
      "#5e82c1",
      "#87a6dd",
      "#acc4eb",
      "#d5e2f7",
      "#edf3fc",
      "#f8fbff",
    ],
  },
  {
    id: "baseColorBackground",
    title: "BaseColor",
    subtext: "Background",
    popoverMode: "base",
    popoverPreviewKind: "baseBackground",
    popoverSwatchId: "baseColorBackground",
    defaultSelection: "neutral",
    toneStops: [
      "#142010",
      "#223619",
      "#2f5021",
      "#426f2e",
      "#5e9443",
      "#7cb45f",
      "#a1d089",
      "#cce9be",
      "#ecf7e7",
      "#f8fdf6",
    ],
  },
  {
    id: "baseColorForeground",
    title: "BaseColor",
    subtext: "ForeGround",
    popoverMode: "base",
    popoverPreviewKind: "baseForeground",
    popoverSwatchId: "baseColorForeground",
    defaultSelection: "neutral",
    toneStops: [
      "#291415",
      "#431d1f",
      "#63292b",
      "#87383b",
      "#b24c4f",
      "#d66a6d",
      "#eda0a2",
      "#f6cfd1",
      "#fcebec",
      "#fff8f8",
    ],
  },
] as const satisfies ReadonlyArray<{
  id: ThemeCardId;
  title: string;
  subtext?: string;
  popoverMode?: PopoverMode;
  popoverPreviewKind?: PopoverPreviewKind;
  popoverSwatchId: ThemeCardId;
  defaultSelection: ThemeSelectionValue;
  toneStops: string[];
}>;

const getThemeOptions = (
  cardId: ThemeCardId,
  _brandColorSelection: ThemeSelectionValue,
  _brandAccentSelection: ThemeSelectionValue,
): Array<{ label: string; value: ThemeSelectionValue }> => {
  if (cardId === "brandColor") {
    return [
      { label: "Neutral", value: "neutral" },
      { label: "Custom Color", value: "custom" },
    ];
  }

  if (cardId === "brandAccentColor") {
    return [
      { label: "None", value: "none" },
      { label: "Custom Color", value: "custom" },
    ];
  }

  return [
    { label: "None", value: "neutral" },
    { label: "Custom Color", value: "custom" },
  ];
};

const getDisplayedSwatches = ({
  cardId,
  selection,
  sourceCardId,
  fallbackToneStops,
  popoverSwatches,
  paletteSwatches,
  chromaAdjustment,
}: {
  cardId: ThemeCardId;
  selection: ThemeSelectionValue;
  sourceCardId: ThemeCardId;
  fallbackToneStops: string[];
  popoverSwatches: Record<ThemeCardId, SwatchItem[]>;
  paletteSwatches: Record<ThemeCardId, SwatchItem[]>;
  chromaAdjustment: number;
}): SwatchItem[] => {
  if (cardId === "brandColor" && selection === "neutral") {
    return AEGIS_BRAND_NEUTRAL_SWATCHES;
  }

  if (cardId === "baseColorBackground" && selection === "neutral") {
    return BASE_BACKGROUND_NEUTRAL_SWATCHES;
  }

  if (cardId === "baseColorForeground" && selection === "neutral") {
    return BASE_FOREGROUND_NEUTRAL_SWATCHES;
  }

  if (selection === "useBrandColor" || selection === "useBrandColorXSubtle") {
    const brandSwatches = scaleSwatchChroma(
      normalizeBrandSwatchesForBase(paletteSwatches.brandColor ?? []),
      selection === "useBrandColor" ? chromaAdjustment : 1,
    );
    if (cardId === "baseColorBackground") {
      return pickSwatchesByLabels(brandSwatches, ["200", "100", "50"]);
    }

    if (cardId === "baseColorForeground") {
      return pickSwatchesByLabels(brandSwatches, ["900", "800", "700", "600", "500"]);
    }

    return brandSwatches;
  }

  if (selection === "useBrandAccentColor" || selection === "useBrandAccentColorXSubtle") {
    const accentSwatches = scaleSwatchChroma(
      popoverSwatches.brandAccentColor ?? [],
      selection === "useBrandAccentColor" ? chromaAdjustment : 1,
    );
    if (cardId === "baseColorBackground") {
      return pickBaseBackgroundSwatches(accentSwatches);
    }

    if (cardId === "baseColorForeground") {
      return pickBaseForegroundSwatches(accentSwatches);
    }

    return accentSwatches;
  }

  if (selection === "custom" || selection === "useBaseColorXSubtle") {
    const customSwatches = popoverSwatches[sourceCardId] ?? [];
    if (cardId === "baseColorBackground") {
      return pickBaseBackgroundSwatches(customSwatches);
    }

    if (cardId === "baseColorForeground") {
      return pickBaseForegroundSwatches(customSwatches);
    }

    return customSwatches;
  }

  const fallbackSwatches = fallbackToneStops.map((tone) => ({ label: tone, cssColor: tone }));

  if (cardId === "baseColorForeground") {
    return pickBaseForegroundSwatches(fallbackSwatches);
  }

  return fallbackSwatches;
};

const shouldShowSwatchSection = (cardId: ThemeCardId, selection: ThemeSelectionValue): boolean =>
  !(cardId === "brandAccentColor" && selection === "none");

const shouldShowEditColor = (selection: ThemeSelectionValue): boolean => selection === "custom";

const sanitizeHexOverride = (value: string): string => value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);

const normalizeHexOverride = (value?: string): string | undefined => {
  const sanitized = sanitizeHexOverride(value ?? "");
  return sanitized.length === 6 ? `#${sanitized}` : undefined;
};

const ReferenceChromaSlider = ({
  ariaLabel,
  value,
  onChange,
}: {
  ariaLabel: string;
  value: number;
  onChange: (value: number) => void;
}): React.ReactElement => {
  const sliderRef = React.useRef<HTMLDivElement | null>(null);
  const sliderProgress = `${Math.max(0, Math.min(100, value * 100))}%`;

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const slider = sliderRef.current;
      if (!slider) return;

      const rect = slider.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onChange(ratio);
    },
    [onChange],
  );

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    updateFromPointer(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if ((event.buttons & 1) !== 1) return;
    updateFromPointer(event.clientX);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const step = event.shiftKey ? 0.1 : 0.01;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(Math.max(0, value - step));
    }

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(Math.min(1, value + step));
    }
  };

  return (
    <div style={{ paddingInline: "var(--aegis-space-x3Small)" }}>
      <div
        ref={sliderRef}
        className={styles.slider}
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.sliderTrack} />
        <div className={styles.sliderProgress} style={{ width: sliderProgress }} />
        <div className={styles.sliderThumb} style={{ left: sliderProgress }} />
      </div>
    </div>
  );
};

const SPOT_OVERRIDE_INHERIT = "_inherit" as const;
type SpotOverrideSelectValue = ThemeSelectionValue | typeof SPOT_OVERRIDE_INHERIT;

function SpotOverridesSection({
  spotOverrides,
  cardSelection,
  brandColorSelection,
  brandAccentSelection,
  onChange,
}: {
  spotOverrides: Partial<Record<string, ThemeSelectionValue>>;
  cardSelection: ThemeSelectionValue;
  brandColorSelection: ThemeSelectionValue;
  brandAccentSelection: ThemeSelectionValue;
  onChange: (key: string, value: ThemeSelectionValue | null) => void;
}): React.ReactElement {
  const baseOptions = getThemeOptions("baseColorBackground", brandColorSelection, brandAccentSelection);
  const spotOptions: Array<{ label: string; value: SpotOverrideSelectValue }> = [
    {
      label: `Inherited (${baseOptions.find((o) => o.value === cardSelection)?.label ?? cardSelection})`,
      value: SPOT_OVERRIDE_INHERIT,
    },
    ...baseOptions,
  ];
  const activeOverrideCount = Object.values(spotOverrides).filter((v) => v !== undefined).length;

  return (
    <div style={{ borderTop: "1px solid var(--aegis-color-border-default)" }}>
      <Accordion size="small">
        <AccordionItem>
          <AccordionButton iconPosition="start">
            Token Overrides{activeOverrideCount > 0 ? ` (${activeOverrideCount})` : ""}
          </AccordionButton>
          <AccordionPanel closeButton={false}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
              {BASE_BACKGROUND_TOKEN_GROUPS.map((group) => (
                <div
                  key={group.label}
                  style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-x4Small)" }}
                >
                  <Text variant="body.xSmall" color="subtle">
                    {group.label}
                  </Text>
                  {group.keys.map((key) => (
                    <div
                      key={key}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        alignItems: "center",
                        gap: "var(--aegis-space-xSmall)",
                      }}
                    >
                      <Text variant="body.xSmall" style={{ fontFamily: "monospace", wordBreak: "break-all" }}>
                        {key}
                      </Text>
                      <div style={{ minWidth: "var(--aegis-size-x13Large)" }}>
                        <Select
                          aria-label={key}
                          size="small"
                          options={spotOptions}
                          value={(spotOverrides[key] as SpotOverrideSelectValue | undefined) ?? SPOT_OVERRIDE_INHERIT}
                          onChange={(value) => {
                            onChange(key, value === SPOT_OVERRIDE_INHERIT ? null : (value as ThemeSelectionValue));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export const createInitialThemeCustomizationState = (): ThemeCustomizationState => ({
  contentVariant: "fill",
  themeSelections: Object.fromEntries(themeCardConfigs.map((card) => [card.id, card.defaultSelection])) as Record<
    ThemeCardId,
    ThemeSelectionValue
  >,
  popoverOpenCardId: null,
  selectedBrandTone: "900",
  popoverSwatches: {
    brandColor: [],
    brandAccentColor: [],
    baseColorBackground: [],
    baseColorForeground: [],
  },
  paletteSwatches: {
    brandColor: [],
    brandAccentColor: [],
    baseColorBackground: [],
    baseColorForeground: [],
  },
  hexOverrides: {},
  chromaAdjustments: {
    brandColor: { useBrandColor: 1, useBrandAccentColor: 1 },
    brandAccentColor: { useBrandColor: 1, useBrandAccentColor: 1 },
    baseColorBackground: { useBrandColor: 1, useBrandAccentColor: 1 },
    baseColorForeground: { useBrandColor: 1, useBrandAccentColor: 1 },
  },
  popoverEditorStates: {
    brandColor: { ...DEFAULT_POPOVER_EDITOR_STATE },
    brandAccentColor: { ...DEFAULT_POPOVER_EDITOR_STATE },
    baseColorBackground: { ...DEFAULT_POPOVER_EDITOR_STATE },
    baseColorForeground: { ...DEFAULT_POPOVER_EDITOR_STATE },
  },
  spotOverrides: {
    baseColorBackground: {},
  },
});

type CardDemoSelection = "useBrandColorXSubtle" | "useBrandAccentColorXSubtle" | "useBaseColorXSubtle";

const CARD_DEMO_OPTIONS: Array<{ label: string; value: CardDemoSelection }> = [
  { label: "Brand · xSubtle", value: "useBrandColorXSubtle" },
  { label: "Brand Accent · xSubtle", value: "useBrandAccentColorXSubtle" },
  { label: "Base · xSubtle", value: "useBaseColorXSubtle" },
];

function CardPreviewDemo({
  paletteSwatches,
}: {
  paletteSwatches: Record<ThemeCardId, SwatchItem[]>;
}): React.ReactElement {
  const [selection, setSelection] = useState<CardDemoSelection>("useBrandColorXSubtle");

  const tokenOverride = useMemo(() => {
    const paletteMap: Record<CardDemoSelection, SwatchItem[]> = {
      useBrandColorXSubtle: normalizeBrandSwatchesForBase(paletteSwatches.brandColor ?? []),
      useBrandAccentColorXSubtle: paletteSwatches.brandAccentColor ?? [],
      useBaseColorXSubtle: paletteSwatches.baseColorBackground ?? [],
    };
    const palette = paletteMap[selection];
    const raw = getSwatchColorByLabel(palette, "900");
    if (!raw) return undefined;
    const hex = normalizeColorForTokenOutput(raw);
    return hexToRgba(hex, XSUBTLE_ALPHA);
  }, [selection, paletteSwatches]);

  return (
    <div
      style={
        {
          "--aegis-color-background-neutral-xSubtle": tokenOverride,
        } as React.CSSProperties
      }
    >
      <Card size="medium" variant="fill" style={{ backgroundColor: "var(--aegis-color-background-neutral-xSubtle)" }}>
        <CardBody>
          <Select
            aria-label="Card preview theme"
            size="medium"
            variant="gutterless"
            options={CARD_DEMO_OPTIONS}
            value={selection}
            onChange={(value) => setSelection(value as CardDemoSelection)}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export const ThemeCustomizationModeView = ({
  globalStyling,
  paneEndSettings,
  onOpenTokenDialog,
  brandForegroundColor,
  themeState,
  onThemeStateChange,
  onBrandTokensChange,
}: Props): React.ReactElement => {
  const {
    contentVariant,
    themeSelections,
    popoverOpenCardId,
    selectedBrandTone,
    popoverSwatches,
    paletteSwatches,
    chromaAdjustments,
    popoverEditorStates,
    spotOverrides,
    hexOverrides,
  } = themeState;
  const [galleryReady, setGalleryReady] = useState(false);
  const raisedPaneEndWidth = getRaisedPaneWidth(paneEndSettings.paneWidth);
  useEffect(() => {
    setGalleryReady(true);
  }, []);
  const handlePopoverSwatchesChange = useCallback(
    (cardId: ThemeCardId, swatches: SwatchItem[]) => {
      onThemeStateChange((prev) => {
        if (areSwatchesEqual(prev.popoverSwatches[cardId] ?? [], swatches)) {
          return prev;
        }

        return {
          ...prev,
          popoverSwatches: {
            ...prev.popoverSwatches,
            [cardId]: swatches,
          },
        };
      });
    },
    [onThemeStateChange],
  );
  const handlePaletteSwatchesChange = useCallback(
    (cardId: ThemeCardId, swatches: SwatchItem[]) => {
      onThemeStateChange((prev) => {
        if (areSwatchesEqual(prev.paletteSwatches[cardId] ?? [], swatches)) {
          return prev;
        }

        return {
          ...prev,
          paletteSwatches: {
            ...prev.paletteSwatches,
            [cardId]: swatches,
          },
        };
      });
    },
    [onThemeStateChange],
  );
  const swatchChangeHandlers = useMemo(
    () => ({
      brandColor: (swatches: SwatchItem[]) => handlePopoverSwatchesChange("brandColor", swatches),
      brandAccentColor: (swatches: SwatchItem[]) => handlePopoverSwatchesChange("brandAccentColor", swatches),
      baseColorBackground: (swatches: SwatchItem[]) => handlePopoverSwatchesChange("baseColorBackground", swatches),
      baseColorForeground: (swatches: SwatchItem[]) => handlePopoverSwatchesChange("baseColorForeground", swatches),
    }),
    [handlePopoverSwatchesChange],
  );
  const paletteChangeHandlers = useMemo(
    () => ({
      brandColor: (swatches: SwatchItem[]) => handlePaletteSwatchesChange("brandColor", swatches),
      brandAccentColor: (swatches: SwatchItem[]) => handlePaletteSwatchesChange("brandAccentColor", swatches),
      baseColorBackground: (swatches: SwatchItem[]) => handlePaletteSwatchesChange("baseColorBackground", swatches),
      baseColorForeground: (swatches: SwatchItem[]) => handlePaletteSwatchesChange("baseColorForeground", swatches),
    }),
    [handlePaletteSwatchesChange],
  );
  const handleBrandToneChange = useCallback(
    (tone: string) => {
      onThemeStateChange((prev) =>
        prev.selectedBrandTone === tone
          ? prev
          : {
              ...prev,
              selectedBrandTone: tone,
            },
      );
    },
    [onThemeStateChange],
  );
  React.useEffect(() => {
    if (themeSelections.brandColor !== "neutral") {
      return;
    }

    onThemeStateChange((prev) => {
      let changed = false;
      const next = { ...prev.themeSelections };

      if (next.baseColorBackground === "useBrandColor" || next.baseColorBackground === "useBrandColorXSubtle") {
        next.baseColorBackground = "neutral";
        changed = true;
      }

      if (next.baseColorForeground === "useBrandColor" || next.baseColorForeground === "useBrandColorXSubtle") {
        next.baseColorForeground = "neutral";
        changed = true;
      }

      return changed
        ? {
            ...prev,
            themeSelections: next,
          }
        : prev;
    });
  }, [onThemeStateChange, themeSelections.brandColor]);
  const previewBaseForegroundSwatches = useMemo(() => {
    const baseColorForegroundConfig = themeCardConfigs.find((card) => card.id === "baseColorForeground");

    if (!baseColorForegroundConfig) {
      return [];
    }

    return getDisplayedSwatches({
      cardId: "baseColorForeground",
      selection: themeSelections.baseColorForeground,
      sourceCardId: baseColorForegroundConfig.popoverSwatchId,
      fallbackToneStops: baseColorForegroundConfig.toneStops,
      popoverSwatches,
      paletteSwatches,
      chromaAdjustment:
        chromaAdjustments.baseColorForeground[themeSelections.baseColorForeground as keyof ChromaAdjustmentValue] ?? 1,
    });
  }, [chromaAdjustments.baseColorForeground, paletteSwatches, popoverSwatches, themeSelections.baseColorForeground]);
  const previewBaseForegroundTypographyVars = useMemo(() => {
    const defaultColor = previewBaseForegroundSwatches.find((swatch) => swatch.label === "900")?.cssColor;
    const pressedColor =
      previewBaseForegroundSwatches.find((swatch) => swatch.label === "800")?.cssColor ??
      previewBaseForegroundSwatches.find((swatch) => swatch.label === "900")?.cssColor;
    const subtleColor =
      previewBaseForegroundSwatches.find((swatch) => swatch.label === "700")?.cssColor ??
      previewBaseForegroundSwatches.find((swatch) => swatch.label === "600")?.cssColor;

    if (!defaultColor) {
      return undefined;
    }

    return {
      "--aegis-color-foreground-default": defaultColor,
      "--aegis-color-foreground-bold": defaultColor,
      "--aegis-color-foreground-pressed": pressedColor ?? defaultColor,
      ...(subtleColor
        ? {
            "--aegis-color-foreground-subtle": subtleColor,
          }
        : {}),
      "--aegis-color-text-default": defaultColor,
      "--aegis-color-text-neutral-default": defaultColor,
      ...(subtleColor
        ? {
            "--aegis-color-text-subtle": subtleColor,
            "--aegis-color-text-neutral-subtle": subtleColor,
          }
        : {}),
    } as React.CSSProperties;
  }, [previewBaseForegroundSwatches]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally selective deps; full dep list would cause infinite re-render loops
  React.useEffect(() => {
    const normalizedBrandForegroundOverride = normalizeHexOverride(hexOverrides.brandForeground);
    const themeAccent =
      themeSelections.brandAccentColor === "custom"
        ? createThemeAccentDefinition(paletteSwatches.brandAccentColor)
        : undefined;
    const bgSpotOverrides = spotOverrides.baseColorBackground;
    const cardBgSelection = themeSelections.baseColorBackground;
    const baseBackgroundTokens = Object.fromEntries(
      (
        Object.entries(BASE_BACKGROUND_TOKEN_SPECS) as Array<
          [(typeof BASE_BACKGROUND_MANAGED_KEYS)[number], BaseBackgroundTokenSpec]
        >
      ).map(([key, spec]) => {
        const effectiveSelection = bgSpotOverrides[key] ?? cardBgSelection;
        if (effectiveSelection === "none") {
          return [key, undefined];
        }
        if (effectiveSelection === "neutral") {
          // When ThemeAccent is active (brand accent set), let it own the neutral background
          // tokens — it applies the accent tint using COMPUTED_TRANSPARENT_SCALES (same alpha),
          // so lightness is already consistent with the new palette.
          if (themeAccent != null) return [key, undefined];
          // Without ThemeAccent, the Aegis CSS default persists (e.g. rgba(0,0,0,0.04),
          // #f6f6f6 for solid). Override with updated palette.json values so lightness
          // matches the rest of the computed scale.
          return [
            key,
            computeSharedBaseBackgroundTokenValue(
              spec,
              NEUTRAL_PALETTE,
              normalizeColorForTokenOutput,
              COMPUTED_TRANSPARENT_SCALES,
            ),
          ];
        }
        const palette = getPaletteForBaseBackgroundSelection(
          effectiveSelection,
          paletteSwatches.brandColor ?? [],
          paletteSwatches.brandAccentColor ?? [],
          paletteSwatches.baseColorBackground ?? [],
        );
        const paletteMap = createPaletteMap(palette, normalizeColorForTokenOutput);
        // When the palette is empty (e.g. custom selected but no color entered yet),
        // fall back to neutral to prevent ThemeAccent's neutral-xSubtle override from
        // leaking through as an unintended purple tint.
        const resolvedPaletteMap = Object.keys(paletteMap).length > 0 ? paletteMap : NEUTRAL_PALETTE;
        const effectiveSpec = isXSubtleSelection(effectiveSelection)
          ? ({ type: "transparent", tone: 50 as const } satisfies BaseBackgroundTokenSpec)
          : spec;
        return [
          key,
          computeSharedBaseBackgroundTokenValue(
            effectiveSpec,
            resolvedPaletteMap,
            normalizeColorForTokenOutput,
            COMPUTED_TRANSPARENT_SCALES,
          ),
        ];
      }),
    ) as Record<string, string | undefined>;
    const baseForegroundSwatches = getDisplayedSwatches({
      cardId: "baseColorForeground",
      selection: themeSelections.baseColorForeground,
      sourceCardId: "baseColorForeground",
      fallbackToneStops: themeCardConfigs.find((card) => card.id === "baseColorForeground")?.toneStops ?? [],
      popoverSwatches,
      paletteSwatches,
      chromaAdjustment:
        chromaAdjustments.baseColorForeground[themeSelections.baseColorForeground as keyof ChromaAdjustmentValue] ?? 1,
    });
    const baseForegroundTokens = buildBaseForegroundTokens(
      createPaletteMap(baseForegroundSwatches, normalizeColorForTokenOutput),
      normalizeColorForTokenOutput,
    );
    const nextTokens: {
      background?: Record<string, string>;
      backgroundManagedKeys: string[];
      forground?: Record<string, string>;
      forgroundManagedKeys: string[];
      Brand?: { default: string };
      BrandBackground?: { bold: string; "bold.hovered": string; "bold.pressed": string };
      BrandForeground?: { default: string };
      ThemeAccent?: Record<string, unknown>;
      BaseBackground?: Record<string, string>;
      BaseForeground?: Record<string, string>;
    } = {
      backgroundManagedKeys: [...BASE_BACKGROUND_MANAGED_KEYS],
      forgroundManagedKeys: [...BASE_FORGROUND_MANAGED_KEYS],
      ThemeAccent: themeAccent ?? undefined,
    };

    if (Object.values(baseBackgroundTokens).some((v) => v !== undefined)) {
      const baseBackgroundOverrides: Record<string, string> = Object.fromEntries(
        Object.entries(baseBackgroundTokens).filter(([, v]) => v !== undefined) as [string, string][],
      );
      nextTokens.background = { ...(nextTokens.background ?? {}), ...baseBackgroundOverrides };
      nextTokens.BaseBackground = baseBackgroundOverrides;
    }

    if (themeSelections.baseColorForeground !== "neutral" && baseForegroundTokens) {
      nextTokens.forground = { ...baseForegroundTokens };
      nextTokens.BaseForeground = { ...baseForegroundTokens };
    }

    const brandTokens =
      themeSelections.brandColor !== "neutral"
        ? buildBrandTokensFromSwatches(
            popoverSwatches.brandColor,
            paletteSwatches.brandColor,
            selectedBrandTone,
            normalizeColorForTokenOutput,
            normalizedBrandForegroundOverride,
          )
        : null;

    if (brandTokens) {
      nextTokens.Brand = brandTokens.Brand;
      nextTokens.BrandBackground = brandTokens.BrandBackground;
      nextTokens.BrandForeground = brandTokens.BrandForeground;
    }

    onBrandTokensChange(nextTokens);
  }, [
    onBrandTokensChange,
    chromaAdjustments.baseColorForeground,
    paletteSwatches.baseColorBackground,
    paletteSwatches.brandColor,
    paletteSwatches.brandAccentColor,
    popoverEditorStates.baseColorBackground.selectedLightness,
    popoverEditorStates.brandAccentColor.selectedLightness,
    popoverSwatches.brandColor,
    popoverSwatches.baseColorBackground,
    popoverSwatches.baseColorForeground,
    selectedBrandTone,
    themeSelections.brandAccentColor,
    themeSelections.baseColorBackground,
    themeSelections.baseColorForeground,
    themeSelections.brandColor,
    popoverSwatches,
    paletteSwatches,
    spotOverrides.baseColorBackground,
    hexOverrides.brandForeground,
  ]);
  const previewBrandButtonTextColor = brandForegroundColor;
  const contentVariantIndex = Math.max(0, CONTENT_VARIANTS.indexOf(contentVariant));
  const previewCardVariant = CONTENT_TO_CARD_VARIANT[contentVariant];
  const resetSection = useCallback(
    (cardId: ThemeCardId) => {
      const cardConfig = themeCardConfigs.find((card) => card.id === cardId);
      if (!cardConfig) {
        return;
      }

      onThemeStateChange((prev) => ({
        ...prev,
        themeSelections: { ...prev.themeSelections, [cardId]: cardConfig.defaultSelection },
        popoverSwatches: { ...prev.popoverSwatches, [cardId]: [] },
        paletteSwatches: { ...prev.paletteSwatches, [cardId]: [] },
        hexOverrides: cardId === "brandColor" ? {} : prev.hexOverrides,
        chromaAdjustments: {
          ...prev.chromaAdjustments,
          [cardId]: { useBrandColor: 1, useBrandAccentColor: 1 },
        },
        popoverEditorStates: {
          ...prev.popoverEditorStates,
          [cardId]: createInitialThemeCustomizationState().popoverEditorStates[cardId],
        },
        popoverOpenCardId: prev.popoverOpenCardId === cardId ? null : prev.popoverOpenCardId,
        spotOverrides:
          cardId === "baseColorBackground" ? { ...prev.spotOverrides, baseColorBackground: {} } : prev.spotOverrides,
      }));
    },
    [onThemeStateChange],
  );
  const themeControlsContent = (
    <div style={cardListStyle}>
      {themeCardConfigs.map((card, index) => (
        <React.Fragment key={card.id}>
          {index > 0 ? <Divider /> : null}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-small)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
                <Text variant="title.xSmall">{card.title}</Text>
                {(card as { subtext?: string }).subtext ? (
                  <Text variant="body.xSmall" color="subtle">
                    {(card as { subtext?: string }).subtext}
                  </Text>
                ) : null}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-small)",
              }}
            >
              {(() => {
                const selection = themeSelections[card.id];
                const brandColorSelection = themeSelections.brandColor;
                const brandAccentSelection = themeSelections.brandAccentColor;
                const chromaAdjustment =
                  selection === "useBrandColor" || selection === "useBrandAccentColor"
                    ? chromaAdjustments[card.id][selection]
                    : 1;
                const displayedSwatches = getDisplayedSwatches({
                  cardId: card.id,
                  selection,
                  sourceCardId: card.popoverSwatchId,
                  fallbackToneStops: card.toneStops,
                  popoverSwatches,
                  paletteSwatches,
                  chromaAdjustment,
                });
                const selectOptions = getThemeOptions(card.id, brandColorSelection, brandAccentSelection);
                const showSwatchSection = shouldShowSwatchSection(card.id, selection);
                const showEditColor = shouldShowEditColor(selection);
                const isResetDisabled =
                  selection === card.defaultSelection &&
                  chromaAdjustments[card.id].useBrandColor === 1 &&
                  chromaAdjustments[card.id].useBrandAccentColor === 1;
                const showsReferenceChromaSlider =
                  (card.id === "baseColorBackground" || card.id === "baseColorForeground") &&
                  (selection === "useBrandColor" || selection === "useBrandAccentColor");
                const chromaSelectionKey = showsReferenceChromaSlider ? selection : null;

                return (
                  <>
                    <Select
                      aria-label={`${card.title} theme selection`}
                      size="small"
                      options={selectOptions}
                      value={selection}
                      onChange={(value) =>
                        onThemeStateChange((prev) => ({
                          ...prev,
                          themeSelections: {
                            ...prev.themeSelections,
                            [card.id]: value as ThemeSelectionValue,
                          },
                        }))
                      }
                    />
                    {card.id === "brandColor" && selection !== "neutral" ? (
                      <FormControl>
                        <FormControl.Label>
                          <Text variant="body.small">Brand Foreground HEX Override</Text>
                        </FormControl.Label>
                        <TextField
                          size="small"
                          leading="#"
                          placeholder="optional"
                          value={sanitizeHexOverride(hexOverrides.brandForeground ?? "")}
                          onChange={(event) => {
                            const nextHex = sanitizeHexOverride(event.target.value);
                            onThemeStateChange((prev) => ({
                              ...prev,
                              hexOverrides: {
                                ...prev.hexOverrides,
                                brandForeground: nextHex.length > 0 ? nextHex : undefined,
                              },
                            }));
                          }}
                        />
                      </FormControl>
                    ) : null}
                    {showSwatchSection ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-xSmall)",
                          padding: "var(--aegis-space-small)",
                          borderRadius: "var(--aegis-radius-medium)",
                          backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${displayedSwatches.length}, minmax(0, 1fr))`,
                            overflow: "hidden",
                            borderRadius: "var(--aegis-radius-medium)",
                            border: "1px solid var(--aegis-color-border-default)",
                            backgroundColor: "var(--aegis-color-background-default)",
                          }}
                        >
                          {displayedSwatches.map((swatch) => (
                            <div
                              key={`${card.id}-${swatch.label}-${swatch.cssColor}`}
                              style={{
                                height: "var(--aegis-size-x3Large)",
                                backgroundColor: swatch.cssColor,
                              }}
                            />
                          ))}
                        </div>
                        {showEditColor ? (
                          <ThemeCustomizationPopover
                            mode={card.popoverMode ?? "base"}
                            previewKind={card.popoverPreviewKind ?? "all"}
                            open={popoverOpenCardId === card.id}
                            editorState={popoverEditorStates[card.id]}
                            onEditorStateChange={(nextState) =>
                              onThemeStateChange((prev) => ({
                                ...prev,
                                popoverEditorStates: {
                                  ...prev.popoverEditorStates,
                                  [card.id]:
                                    typeof nextState === "function"
                                      ? nextState(prev.popoverEditorStates[card.id])
                                      : nextState,
                                },
                              }))
                            }
                            onOpenChange={(open) =>
                              onThemeStateChange((prev) => ({
                                ...prev,
                                popoverOpenCardId: open ? card.id : null,
                              }))
                            }
                            onSwatchesChange={swatchChangeHandlers[card.popoverSwatchId]}
                            onPaletteChange={paletteChangeHandlers[card.popoverSwatchId]}
                            onToneChange={card.id === "brandColor" ? handleBrandToneChange : undefined}
                            trigger={
                              <Button size="small" variant="subtle" style={{ width: "100%" }}>
                                Edit color
                              </Button>
                            }
                          />
                        ) : null}
                        {showsReferenceChromaSlider ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-x4Small)",
                              paddingInline: "var(--aegis-space-x3Small)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Text variant="body.small" color="subtle">
                                Chroma
                              </Text>
                              <Text variant="data.small" color="subtle">
                                {Math.round(chromaAdjustment * 100)}%
                              </Text>
                            </div>
                            <ReferenceChromaSlider
                              ariaLabel={`${card.title} ${(card as { subtext?: string }).subtext ?? ""} chroma`}
                              value={chromaAdjustment}
                              onChange={(nextValue) => {
                                if (!chromaSelectionKey) {
                                  return;
                                }
                                onThemeStateChange((prev) => ({
                                  ...prev,
                                  chromaAdjustments: {
                                    ...prev.chromaAdjustments,
                                    [card.id]: {
                                      ...prev.chromaAdjustments[card.id],
                                      [chromaSelectionKey]: nextValue,
                                    },
                                  },
                                }));
                              }}
                            />
                          </div>
                        ) : null}
                        {card.id === "baseColorBackground" ? (
                          <SpotOverridesSection
                            spotOverrides={spotOverrides.baseColorBackground}
                            cardSelection={selection}
                            brandColorSelection={brandColorSelection}
                            brandAccentSelection={brandAccentSelection}
                            onChange={(key, value) => {
                              onThemeStateChange((prev) => ({
                                ...prev,
                                spotOverrides: {
                                  ...prev.spotOverrides,
                                  baseColorBackground: {
                                    ...prev.spotOverrides.baseColorBackground,
                                    [key]: value ?? undefined,
                                  },
                                },
                              }));
                            }}
                          />
                        ) : null}
                      </div>
                    ) : null}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        size="xSmall"
                        variant="gutterless"
                        disabled={isResetDisabled}
                        onClick={() => resetSection(card.id)}
                      >
                        Reset
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: "100dvh" }}>
      <PageLayout variant={globalStyling.pageLayout}>
        <PageLayoutContent variant={contentVariant}>
          <PageLayoutHeader>
            <SegmentedControl
              variant="solid"
              size="medium"
              weight="bold"
              index={contentVariantIndex}
              onChange={(index) =>
                onThemeStateChange((prev) => ({
                  ...prev,
                  contentVariant: CONTENT_VARIANTS[index] ?? "fill",
                }))
              }
            >
              <SegmentedControl.Button>Plain</SegmentedControl.Button>
              <SegmentedControl.Button>Outline</SegmentedControl.Button>
              <SegmentedControl.Button>Fill</SegmentedControl.Button>
            </SegmentedControl>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                height: "100%",
                minHeight: "var(--aegis-layout-width-medium)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-large)",
                  width: "100%",
                }}
              >
                {galleryReady ? (
                  <div style={galleryGridStyle}>
                    <PreviewGalleryCard
                      title="Button"
                      description="This is the Button component."
                      variant={previewCardVariant}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-xSmall)",
                          ...(previewBrandButtonTextColor
                            ? ({
                                "--aegis-color-foreground-inverse": previewBrandButtonTextColor,
                              } as React.CSSProperties)
                            : {}),
                        }}
                      >
                        <Button size="small" variant="solid" width="full">
                          Button
                        </Button>
                        <Button size="small" variant="subtle" width="full">
                          Button
                        </Button>
                        <Button size="small" variant="plain" width="full">
                          Button
                        </Button>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <Button size="small" variant="gutterless">
                            Button
                          </Button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <Button size="small" variant="gutterless" weight="normal">
                            Button
                          </Button>
                        </div>
                        <Button size="small" variant="solid" width="full" disabled>
                          Button
                        </Button>
                        <Button size="small" variant="plain" width="full" disabled>
                          Button
                        </Button>
                      </div>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="Checkbox / Radio"
                      description="This is the Checkbox and Radio component."
                      variant={previewCardVariant}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                        <Checkbox defaultChecked>Pizza</Checkbox>
                        <Checkbox>Sushi</Checkbox>
                        <Checkbox>Taco</Checkbox>
                        <RadioGroup title="" defaultValue="ramen">
                          <Radio value="ramen">Ramen</Radio>
                          <Radio value="curry">Curry</Radio>
                          <Radio value="burger">Burger</Radio>
                        </RadioGroup>
                      </div>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="Form"
                      description="This is the Form component."
                      variant={previewCardVariant}
                    >
                      <Form style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                        <FormControl>
                          <FormControl.Label>textField</FormControl.Label>
                          <TextField defaultValue="Input text" />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>select</FormControl.Label>
                          <Select
                            options={[
                              { label: "Select", value: "select" },
                              { label: "Option A", value: "option-a" },
                            ]}
                            defaultValue="select"
                          />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>combobox</FormControl.Label>
                          <Combobox
                            options={[
                              { label: "Tokyo", value: "tokyo" },
                              { label: "Osaka", value: "osaka" },
                              { label: "Kyoto", value: "kyoto" },
                            ]}
                            placeholder="Choose a city"
                          />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>search</FormControl.Label>
                          <Search placeholder="Search..." />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>dateField</FormControl.Label>
                          <DateField granularity="day" />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>datePicker</FormControl.Label>
                          <DatePicker aria-label="Pick a date" granularity="day" />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>tagPicker</FormControl.Label>
                          <TagPicker
                            options={[
                              { label: "Apple", value: "apple" },
                              { label: "Orange", value: "orange" },
                              { label: "Grape", value: "grape" },
                            ]}
                            placeholder="Select fruits"
                          />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>textarea</FormControl.Label>
                          <Textarea placeholder="Write a note..." />
                        </FormControl>
                      </Form>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="FileDrop"
                      description="This is the FileDrop component."
                      variant={previewCardVariant}
                    >
                      <FileDrop uploadButtonTitle="Upload">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "var(--aegis-space-xSmall)",
                            padding: "var(--aegis-space-large)",
                          }}
                        >
                          <Text variant="body.medium">Drop files here</Text>
                          <Text variant="body.small" color="subtle">
                            Or click the upload button to choose files
                          </Text>
                        </div>
                      </FileDrop>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="Card"
                      description="This is the Card component."
                      variant={previewCardVariant}
                    >
                      <CardPreviewDemo paletteSwatches={paletteSwatches} />
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="Tag"
                      description="This is the Tag component."
                      variant={previewCardVariant}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--aegis-space-medium)",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                        }}
                      >
                        {(["outline", "fill"] as const).map((variant) => (
                          <div
                            key={variant}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-xSmall)",
                              minWidth: 0,
                            }}
                          >
                            {previewTagColors.map((color) => (
                              <Tag
                                key={`${variant}-${color}`}
                                size="small"
                                color={color}
                                variant={variant}
                                leading={LfTag}
                              >
                                Label
                              </Tag>
                            ))}
                          </div>
                        ))}
                      </div>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="Text"
                      description="This is the Text component."
                      variant={previewCardVariant}
                    >
                      <div
                        style={{
                          ...previewBaseForegroundTypographyVars,
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-xSmall)",
                        }}
                      >
                        <Text variant="title.large">Title large</Text>
                        <Text variant="title.medium">Title medium</Text>
                        <Text variant="title.small">Title small</Text>
                        <Text variant="title.xSmall">Title xSmall</Text>
                        <Text variant="title.xxSmall">Title xxSmall</Text>
                        <Text variant="title.xxSmall">Title xxSmall (min)</Text>
                        <Divider />
                        <Text variant="body.xLarge">Body xLarge</Text>
                        <Text variant="body.large">Body large</Text>
                        <Text variant="body.medium">Body medium</Text>
                        <Text variant="body.small">Body small</Text>
                        <Text variant="body.xSmall">Body xSmall</Text>
                        <Text variant="body.xxSmall">Body xxSmall</Text>
                      </div>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="Avatar"
                      description="This is the Avatar component."
                      variant={previewCardVariant}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--aegis-space-xSmall)" }}>
                        <div
                          style={
                            previewBrandButtonTextColor
                              ? ({
                                  "--aegis-color-foreground-inverse": previewBrandButtonTextColor,
                                } as React.CSSProperties)
                              : undefined
                          }
                        >
                          <Avatar name="John Doe" size="medium" color="brand" />
                        </div>
                        <Avatar name="John Doe" size="medium" color="auto" />
                        <Avatar name="John Doe" size="medium" color="red" />
                        <Avatar name="John Doe" size="medium" color="orange" />
                        <Avatar name="John Doe" size="medium" color="teal" />
                        <Avatar name="John Doe" size="medium" color="indigo" />
                        <Avatar name="John Doe" size="medium" color="blue" />
                        <Avatar name="John Doe" size="medium" color="purple" />
                        <Avatar name="John Doe" size="medium" color="magenta" />
                        <Avatar name="John Doe" size="medium" color="subtle" />
                      </div>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="ActionList"
                      description="This is the ActionList component."
                      variant={previewCardVariant}
                    >
                      <ActionList size="large">
                        <ActionList.Item>
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfBook />
                              </Icon>
                            }
                          >
                            Open knowledge base
                          </ActionList.Body>
                        </ActionList.Item>
                        <ActionList.Item>
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfMagnifyingGlass />
                              </Icon>
                            }
                          >
                            Search related items
                          </ActionList.Body>
                        </ActionList.Item>
                        <ActionList.Item>
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfPlusLarge />
                              </Icon>
                            }
                          >
                            Create new component
                          </ActionList.Body>
                        </ActionList.Item>
                        <ActionList.Item>
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfSetting />
                              </Icon>
                            }
                          >
                            Open preferences
                          </ActionList.Body>
                        </ActionList.Item>
                        <ActionList.Item>
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfBook />
                              </Icon>
                            }
                          >
                            Open documentation
                          </ActionList.Body>
                        </ActionList.Item>
                        <ActionList.Item>
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfMagnifyingGlass />
                              </Icon>
                            }
                          >
                            Inspect token usage
                          </ActionList.Body>
                        </ActionList.Item>
                        <ActionList.Item>
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfInformationCircle />
                              </Icon>
                            }
                          >
                            View component details
                          </ActionList.Body>
                        </ActionList.Item>
                        <ActionList.Item color="danger">
                          <ActionList.Body
                            leading={
                              <Icon>
                                <LfTrash />
                              </Icon>
                            }
                          >
                            Delete component
                          </ActionList.Body>
                        </ActionList.Item>
                      </ActionList>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="Checkbox / Radio Card"
                      description="This is the card selection component."
                      variant={previewCardVariant}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                        <CheckboxCard checked size="large" onChange={() => undefined}>
                          <Text variant="body.small">Pizza</Text>
                        </CheckboxCard>
                        <CheckboxCard size="large" onChange={() => undefined}>
                          <Text variant="body.small">Sushi</Text>
                        </CheckboxCard>
                        <CheckboxCard size="large" onChange={() => undefined}>
                          <Text variant="body.small">Taco</Text>
                        </CheckboxCard>
                        <RadioGroup title="" defaultValue="ramen">
                          <RadioCard value="ramen" size="large">
                            <Text variant="body.small">Ramen</Text>
                          </RadioCard>
                          <RadioCard value="curry" size="large">
                            <Text variant="body.small">Curry</Text>
                          </RadioCard>
                          <RadioCard value="burger" size="large">
                            <Text variant="body.small">Burger</Text>
                          </RadioCard>
                        </RadioGroup>
                      </div>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="DataTable"
                      description="This is the DataTable component."
                      variant={previewCardVariant}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                        <DataTable
                          size="small"
                          badgedRows={previewTableRows.map((row) => row.id)}
                          columns={previewTableColumns}
                          rows={previewTableRows}
                          getRowId={(row) => row.id}
                        />
                      </div>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="Badge"
                      description="This is the Badge component."
                      variant={previewCardVariant}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                        {previewBadgeColors.map((color) => (
                          <div
                            key={`badge-${color}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "var(--aegis-space-small)",
                            }}
                          >
                            <Text variant="body.small">{`badge color ${color}`}</Text>
                            <Badge color={color} />
                          </div>
                        ))}
                        <Divider />
                        {previewBadgeColors.map((color, index) => (
                          <div
                            key={`count-badge-${color}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "var(--aegis-space-small)",
                            }}
                          >
                            <Text variant="body.small">{`count badge color ${color}`}</Text>
                            <Badge
                              color={color}
                              count={previewCountBadgeValues[index % previewCountBadgeValues.length]}
                            />
                          </div>
                        ))}
                      </div>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="StatusLabel"
                      description="This is the StatusLabel component."
                      variant={previewCardVariant}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--aegis-space-medium)",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                        }}
                      >
                        {(["outline", "fill"] as const).map((variant) => (
                          <div
                            key={variant}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-xSmall)",
                              minWidth: 0,
                            }}
                          >
                            {previewStatusLabelColors.map((color) => (
                              <StatusLabel key={`${variant}-${color}`} color={color} variant={variant}>
                                Status
                              </StatusLabel>
                            ))}
                          </div>
                        ))}
                      </div>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="SegmentedControl"
                      description="This is the SegmentedControl component."
                      variant={previewCardVariant}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                        <SegmentedControl variant="solid" size="small" defaultValue="solid-a">
                          <SegmentedControl.Button value="solid-a">Button</SegmentedControl.Button>
                          <SegmentedControl.Button value="solid-b">Button</SegmentedControl.Button>
                          <SegmentedControl.Button value="solid-c">Button</SegmentedControl.Button>
                        </SegmentedControl>
                        <SegmentedControl variant="plain" size="small" defaultValue="plain-a">
                          <SegmentedControl.Button value="plain-a">Button</SegmentedControl.Button>
                          <SegmentedControl.Button value="plain-b">Button</SegmentedControl.Button>
                          <SegmentedControl.Button value="plain-c">Button</SegmentedControl.Button>
                        </SegmentedControl>
                      </div>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="Icon"
                      description="This is the Icon component."
                      variant={previewCardVariant}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                          gap: "var(--aegis-space-small)",
                        }}
                      >
                        {[
                          LfPlusLarge,
                          LfMagnifyingGlass,
                          LfBook,
                          LfSetting,
                          LfInformationCircle,
                          LfTrash,
                          LfArrowLeft,
                          LfCloseCircle,
                          LfCode,
                          LfEllipsisDot,
                          LfEye,
                          LfEyeSlash,
                          LfFaceMoodSmile,
                          LfFileCode,
                          LfLayoutHorizon,
                          LfReply,
                        ].map((IconSource) => (
                          <div
                            key={IconSource.displayName ?? IconSource.name}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              aspectRatio: "1 / 1",
                              border: "1px solid var(--aegis-color-border-subtle)",
                              borderRadius: "var(--aegis-radius-small)",
                              backgroundColor: "var(--aegis-color-background-default)",
                            }}
                          >
                            <Icon color="default">
                              <IconSource />
                            </Icon>
                          </div>
                        ))}
                      </div>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="NavList"
                      description="This is the NavList component."
                      variant={previewCardVariant}
                    >
                      <NavList>
                        <NavList.Group title="Asia">
                          <NavList.Item aria-current="page">Tokyo</NavList.Item>
                          <NavList.Item>Seoul</NavList.Item>
                          <NavList.Item>Bangkok</NavList.Item>
                          <NavList.Item>Singapore</NavList.Item>
                        </NavList.Group>
                        <NavList.Group title="Europe">
                          <NavList.Item>Paris</NavList.Item>
                          <NavList.Item>London</NavList.Item>
                        </NavList.Group>
                      </NavList>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="IconButton"
                      description="This is the IconButton component."
                      variant={previewCardVariant}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--aegis-space-small)",
                          ...(previewBrandButtonTextColor
                            ? ({
                                "--aegis-color-foreground-inverse": previewBrandButtonTextColor,
                              } as React.CSSProperties)
                            : {}),
                        }}
                      >
                        {(["solid", "subtle", "plain"] as const).map((variant) => (
                          <div
                            key={variant}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--aegis-space-small)",
                              flexWrap: "wrap",
                            }}
                          >
                            {(["large", "medium", "small", "xSmall"] as const).map((size) => (
                              <Tooltip key={`${variant}-${size}`} title={`${variant} ${size}`}>
                                <IconButton variant={variant} size={size} aria-label={`${variant} ${size}`}>
                                  <Icon>
                                    <LfPlusLarge />
                                  </Icon>
                                </IconButton>
                              </Tooltip>
                            ))}
                          </div>
                        ))}
                      </div>
                    </PreviewGalleryCard>
                    <PreviewGalleryCard
                      title="Tabs"
                      description="This is the Tabs component."
                      variant={previewCardVariant}
                    >
                      <Tab.Group variant="plain" defaultIndex={0}>
                        <Tab.List bordered={false}>
                          <Tab>tab1</Tab>
                          <Tab>tab2</Tab>
                        </Tab.List>
                        <Tab.Panels>
                          <Tab.Panel>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              <Text variant="body.small" color="subtle">
                                First panel
                              </Text>
                            </div>
                          </Tab.Panel>
                          <Tab.Panel>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              <Text variant="body.small" color="subtle">
                                Second panel
                              </Text>
                            </div>
                          </Tab.Panel>
                        </Tab.Panels>
                      </Tab.Group>
                    </PreviewGalleryCard>
                  </div>
                ) : (
                  <div style={galleryGridStyle} role="alert" aria-busy="true" aria-live="polite">
                    {Array.from({ length: 8 }, (_, i) => i).map((i) => (
                      <div
                        key={`skeleton-${i}`}
                        style={{ breakInside: "avoid", marginBottom: "var(--aegis-space-medium)" }}
                      >
                        <Skeleton height="200px" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
        <PageLayoutPane
          position="end"
          aria-label="End Pane"
          width={raisedPaneEndWidth as Parameters<typeof PageLayoutPane>[0]["width"]}
          resizable={paneEndSettings.resizable}
          maxWidth={paneEndSettings.maxWidth as Parameters<typeof PageLayoutPane>[0]["maxWidth"]}
          variant={globalStyling.paneEnd}
        >
          <PageLayoutBody>{themeControlsContent}</PageLayoutBody>
          <PageLayoutFooter>
            <Button
              variant="solid"
              size="large"
              width="full"
              onClick={onOpenTokenDialog}
              style={
                previewBrandButtonTextColor
                  ? ({
                      "--aegis-color-foreground-inverse": previewBrandButtonTextColor,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              Download code
            </Button>
          </PageLayoutFooter>
        </PageLayoutPane>
      </PageLayout>
    </div>
  );
};
