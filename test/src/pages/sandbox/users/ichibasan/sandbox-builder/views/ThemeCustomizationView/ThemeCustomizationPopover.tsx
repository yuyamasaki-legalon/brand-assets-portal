import { Button, Divider, Popover, Select, Text, TextField } from "@legalforce/aegis-react";
import type React from "react";
import { useEffect, useMemo, useRef } from "react";
import { FIXED_LIGHTNESS, findNearestToneByLightness, hexToOklch } from "../../token-overrides/color-utils";
import styles from "./index.module.css";

export interface ThemeCustomizationPopoverEditorState {
  hexValue: string;
  selectedLightness: string;
  chromaValue: string;
  chromaMode: "all" | "custom";
  customChromaValues: Record<string, string>;
  baseColor: {
    l: number;
    c: number;
    h: number;
  };
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "brand" | "base";
  previewKind?: "brand" | "all" | "baseBackground" | "baseForeground";
  editorState: ThemeCustomizationPopoverEditorState;
  onEditorStateChange: React.Dispatch<React.SetStateAction<ThemeCustomizationPopoverEditorState>>;
  onSwatchesChange?: (swatches: Array<{ label: string; cssColor: string }>) => void;
  onPaletteChange?: (palette: Array<{ label: string; cssColor: string }>) => void;
  onToneChange?: (tone: string) => void;
  trigger?: React.ReactNode;
}

const LIGHTNESS_OPTIONS = [
  { label: "900", value: "900" },
  { label: "800", value: "800" },
  { label: "700", value: "700" },
  { label: "600", value: "600" },
];
const BRAND_LIGHTNESS_OPTIONS = [
  { label: "900", value: "900" },
  { label: "800", value: "800" },
  { label: "700", value: "700" },
  { label: "600", value: "600" },
  { label: "500", value: "500" },
  { label: "400", value: "400" },
];

const SWATCH_ORDER = ["900", "800", "700", "600", "500", "400", "300", "200", "100", "50"] as const;
const SELECTABLE_LIGHTNESS = ["900", "800", "700", "600"] as const;
const BRAND_BASE_LIGHTNESS = ["900", "800", "700", "600", "500", "400"] as const;
const CHROMA_MODE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Custom", value: "custom" },
] as const;
const CHROMA_SCALE = 1000;
const REFERENCE_TOP_LIGHTNESS = ["900", "800", "700", "600", "500", "400"] as const;
const REFERENCE_CURVE_HEX = {
  low_900_top: {
    "900": "#001e1f",
    "800": "#133132",
    "700": "#2f4749",
    "600": "#4e6162",
    "500": "#738181",
    alt500: "#8a9899",
    "400": "#aabcbd",
    "300": "#d4e5e6",
    "200": "#e1f0f1",
    "100": "#e9f7f7",
    "50": "#f2fbfc",
  },
  high_900_top: {
    "900": "#00005b",
    "800": "#06206e",
    "700": "#1f3c84",
    "600": "#3f5b96",
    "500": "#687da9",
    alt500: "#7f95c2",
    "400": "#aab8d3",
    "300": "#dae2f0",
    "200": "#e8edf7",
    "100": "#f0f4fa",
    "50": "#f6f9ff",
  },
  low_800_top: {
    "900": "#001e1f",
    "800": "#003235",
    "700": "#234a4b",
    "600": "#436465",
    "500": "#6f8283",
    alt500: "#839a9b",
    "400": "#aabcbd",
    "300": "#d6e5e5",
    "200": "#e3f0f0",
    "100": "#ebf6f7",
    "50": "#f2fbfc",
  },
  high_800_top: {
    "900": "#010e4d",
    "800": "#031d74",
    "700": "#193a8c",
    "600": "#405b95",
    "500": "#6a7da5",
    alt500: "#8195bf",
    "400": "#abb8d2",
    "300": "#dae2f0",
    "200": "#e8edf7",
    "100": "#eff4fc",
    "50": "#f6f9ff",
  },
  low_700_top: {
    "900": "#051d1e",
    "800": "#003235",
    "700": "#024c50",
    "600": "#326769",
    "500": "#638586",
    alt500: "#7a9d9e",
    "400": "#a7bdbe",
    "300": "#d4e5e6",
    "200": "#e3f0f0",
    "100": "#ecf6f6",
    "50": "#f3fbfb",
  },
  high_700_top: {
    "900": "#021246",
    "800": "#01187b",
    "700": "#062daa",
    "600": "#2451c4",
    "500": "#547acd",
    alt500: "#6b92e7",
    "400": "#9fb8e9",
    "300": "#d8e2f5",
    "200": "#e8edf7",
    "100": "#f0f4fa",
    "50": "#f6f9ff",
  },
  low_600_top: {
    "900": "#051d1e",
    "800": "#003235",
    "700": "#024c50",
    "600": "#136a6e",
    "500": "#458a8e",
    alt500: "#5ea3a6",
    "400": "#92c2c4",
    "300": "#cde7e8",
    "200": "#e0f1f1",
    "100": "#ebf6f7",
    "50": "#f3fbfb",
  },
  high_600_top: {
    "900": "#101042",
    "800": "#1e196e",
    "700": "#302e99",
    "600": "#464ac0",
    "500": "#6673d4",
    alt500: "#7d8bef",
    "400": "#a9b4eb",
    "300": "#dae0fa",
    "200": "#e9ecf8",
    "100": "#f1f3fa",
    "50": "#f7f9ff",
  },
  low_500_top: {
    "900": "#131827",
    "800": "#1c294d",
    "700": "#2b3e77",
    "600": "#3e58a2",
    "500": "#667cb2",
    alt500: "#7091e9",
    "400": "#9ab6fc",
    "300": "#d5e1ff",
    "200": "#e5edfe",
    "100": "#f0f3fc",
    "50": "#f7f9ff",
  },
  high_500_top: {
    "900": "#111d10",
    "800": "#1a3219",
    "700": "#1d4f1b",
    "600": "#10710e",
    "500": "#389433",
    alt500: "#34b22f",
    "400": "#6cd365",
    "300": "#acf8a5",
    "200": "#d8f7d5",
    "100": "#edf7ec",
    "50": "#f6fbf6",
  },
  low_400_top: {
    "900": "#131827",
    "800": "#202a44",
    "700": "#324167",
    "600": "#495b8c",
    "500": "#667cb2",
    alt500: "#7d94cc",
    "400": "#9eb6f2",
    "300": "#d5e1ff",
    "200": "#e5edfe",
    "100": "#eff3fd",
    "50": "#f7f9ff",
  },
  high_400_top: {
    "900": "#111d10",
    "800": "#1a3219",
    "700": "#224e1f",
    "600": "#246f21",
    "500": "#389433",
    alt500: "#52ad4d",
    "400": "#6fd368",
    "300": "#b1f6ab",
    "200": "#d9f7d6",
    "100": "#ecf7eb",
    "50": "#f6fbf6",
  },
} as const;
const BRAND_STATE_ORDER = ["default", "hovered", "pressed"] as const;
const BRAND_LIGHTNESS_MAP = {
  "900": { default: "900", hovered: "700", pressed: "600" },
  "800": { default: "800", hovered: "700", pressed: "600" },
  "700": { default: "700", hovered: "800", pressed: "900" },
  "600": { default: "600", hovered: "700", pressed: "800" },
  "500": { default: "alt500", hovered: "400", pressed: "300" },
  "400": { default: "400", hovered: "300", pressed: "200" },
} as const;

interface OklchColor {
  l: number;
  c: number;
  h: number;
}

type ChromaMode = (typeof CHROMA_MODE_OPTIONS)[number]["value"];
type ReferenceTopLightness = (typeof REFERENCE_TOP_LIGHTNESS)[number];
type SwatchLightness = (typeof SWATCH_ORDER)[number];
type CurveLightness = SwatchLightness | "alt500";

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const sanitizeHexValue = (value: string): string => value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);

const parseHexColor = (value?: string): [number, number, number] | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().replace(/^#/, "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    return null;
  }

  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ];
};

const getLightnessValue = (lightness: CurveLightness | (typeof BRAND_BASE_LIGHTNESS)[number]): number =>
  FIXED_LIGHTNESS[lightness] / 100;

const formatOklchCss = ({ l, c, h }: OklchColor): string =>
  `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(4)} ${h.toFixed(2)})`;

const oklchToLinearRgb = ({ l, c, h }: OklchColor): [number, number, number] => {
  const hueRadians = (h * Math.PI) / 180;
  const a = c * Math.cos(hueRadians);
  const b = c * Math.sin(hueRadians);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;

  return [
    4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  ];
};

const buildReferenceCurveData = () =>
  Object.fromEntries(
    REFERENCE_TOP_LIGHTNESS.map((top) => {
      const lowPalette = REFERENCE_CURVE_HEX[`low_${top}_top` as const];
      const highPalette = REFERENCE_CURVE_HEX[`high_${top}_top` as const];
      const topKey = (top === "500" ? "alt500" : top) as CurveLightness;
      const lowTopChroma = hexToOklch(lowPalette[topKey]).c;
      const highTopChroma = hexToOklch(highPalette[topKey]).c;

      return [
        top,
        {
          lowTopChroma,
          highTopChroma,
          lowLightness: Object.fromEntries(
            [...SWATCH_ORDER, "alt500" as const].map((label) => {
              return [label, hexToOklch(lowPalette[label]).l];
            }),
          ) as Record<CurveLightness, number>,
          highLightness: Object.fromEntries(
            [...SWATCH_ORDER, "alt500" as const].map((label) => {
              return [label, hexToOklch(highPalette[label]).l];
            }),
          ) as Record<CurveLightness, number>,
          lowRatios: Object.fromEntries(
            [...SWATCH_ORDER, "alt500" as const].map((label) => {
              return [label, lowTopChroma === 0 ? 0 : hexToOklch(lowPalette[label]).c / lowTopChroma];
            }),
          ) as Record<CurveLightness, number>,
          highRatios: Object.fromEntries(
            [...SWATCH_ORDER, "alt500" as const].map((label) => {
              return [label, highTopChroma === 0 ? 0 : hexToOklch(highPalette[label]).c / highTopChroma];
            }),
          ) as Record<CurveLightness, number>,
        },
      ];
    }),
  ) as Record<
    ReferenceTopLightness,
    {
      lowTopChroma: number;
      highTopChroma: number;
      lowLightness: Record<CurveLightness, number>;
      highLightness: Record<CurveLightness, number>;
      lowRatios: Record<CurveLightness, number>;
      highRatios: Record<CurveLightness, number>;
    }
  >;

const REFERENCE_CURVE_DATA = buildReferenceCurveData();

const areToneChromaValuesEqual = (
  left: Partial<Record<SwatchLightness, string>>,
  right: Partial<Record<SwatchLightness, string>>,
): boolean => SWATCH_ORDER.every((label) => (left[label] ?? "") === (right[label] ?? ""));

const getBrandStateToneLabel = (
  lightness: (typeof BRAND_BASE_LIGHTNESS)[number],
  state: (typeof BRAND_STATE_ORDER)[number],
): SwatchLightness => {
  const tone = BRAND_LIGHTNESS_MAP[lightness][state];
  return tone === "alt500" ? "500" : tone;
};

const isOklchInSrgbGamut = (color: OklchColor): boolean =>
  oklchToLinearRgb(color).every((channel) => channel >= 0 && channel <= 1);

const findMaxChromaForLightnessAndHue = (lightness: number, hue: number): number => {
  let low = 0;
  let high = 0.4;

  for (let index = 0; index < 24; index += 1) {
    const mid = (low + high) / 2;
    if (isOklchInSrgbGamut({ l: lightness, c: mid, h: hue })) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return low;
};

const getDefaultLightnessForMode = (
  mode: "brand" | "base",
  lightness: (typeof SELECTABLE_LIGHTNESS)[number] | (typeof BRAND_BASE_LIGHTNESS)[number],
): number =>
  mode === "brand"
    ? getLightnessValue(BRAND_LIGHTNESS_MAP[lightness as (typeof BRAND_BASE_LIGHTNESS)[number]].default)
    : getLightnessValue(lightness as (typeof SELECTABLE_LIGHTNESS)[number]);

const findMostColorSelectableLightness = (hue: number): (typeof SELECTABLE_LIGHTNESS)[number] =>
  SELECTABLE_LIGHTNESS.reduce((strongest, current) =>
    findMaxChromaForLightnessAndHue(getDefaultLightnessForMode("base", current), hue) >
    findMaxChromaForLightnessAndHue(getDefaultLightnessForMode("base", strongest), hue)
      ? current
      : strongest,
  );

export const ThemeCustomizationPopover = ({
  open,
  onOpenChange,
  mode,
  previewKind = mode === "brand" ? "brand" : "all",
  editorState,
  onEditorStateChange,
  onSwatchesChange,
  onPaletteChange,
  onToneChange,
  trigger,
}: Props): React.ReactElement => {
  const { hexValue, chromaValue, baseColor } = editorState;
  const chromaMode = editorState.chromaMode ?? "all";
  const customChromaValues = editorState.customChromaValues ?? {};
  const storedSelectedLightness = editorState.selectedLightness as
    | (typeof SELECTABLE_LIGHTNESS)[number]
    | (typeof BRAND_BASE_LIGHTNESS)[number];
  const locksBaseToneToStrongest = previewKind === "baseBackground" && mode === "base";
  const selectedLightness = (
    locksBaseToneToStrongest ? findMostColorSelectableLightness(baseColor.h) : storedSelectedLightness
  ) as typeof storedSelectedLightness;
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const parsedChromaValue = Number.parseFloat(chromaValue);
  const referenceTop = selectedLightness as ReferenceTopLightness;
  const activeDefaultLightness = getDefaultLightnessForMode(mode, selectedLightness);
  const maxValueChroma = useMemo(
    () => findMaxChromaForLightnessAndHue(activeDefaultLightness, baseColor.h) * CHROMA_SCALE,
    [activeDefaultLightness, baseColor.h],
  );
  const sliderValue = clamp(Number.isFinite(parsedChromaValue) ? parsedChromaValue : 0, 0, maxValueChroma);
  const sliderProgress = `${Math.max(0, Math.min(100, maxValueChroma === 0 ? 0 : (sliderValue / maxValueChroma) * 100))}%`;
  const chromaCurve = useMemo(() => {
    const curveData = REFERENCE_CURVE_DATA[referenceTop];
    const range = Math.max(curveData.highTopChroma - curveData.lowTopChroma, 0.000001);
    const strength = clamp(maxValueChroma / CHROMA_SCALE - curveData.lowTopChroma, 0, range) / range;

    return Object.fromEntries(
      [...SWATCH_ORDER, "alt500" as const].map((label) => [
        label,
        curveData.lowRatios[label] + (curveData.highRatios[label] - curveData.lowRatios[label]) * strength,
      ]),
    ) as Record<CurveLightness, number>;
  }, [maxValueChroma, referenceTop]);
  const lightnessCurve = useMemo(() => {
    const curveData = REFERENCE_CURVE_DATA[referenceTop];
    const range = Math.max(curveData.highTopChroma - curveData.lowTopChroma, 0.000001);
    const strength = clamp(maxValueChroma / CHROMA_SCALE - curveData.lowTopChroma, 0, range) / range;

    return Object.fromEntries(
      [...SWATCH_ORDER, "alt500" as const].map((label) => [
        label,
        curveData.lowLightness[label] + (curveData.highLightness[label] - curveData.lowLightness[label]) * strength,
      ]),
    ) as Record<CurveLightness, number>;
  }, [maxValueChroma, referenceTop]);
  const toneMaxChromaMap = useMemo(
    () =>
      Object.fromEntries(
        SWATCH_ORDER.map((label) => [
          label,
          findMaxChromaForLightnessAndHue(lightnessCurve[label], baseColor.h) * CHROMA_SCALE,
        ]),
      ) as Record<SwatchLightness, number>,
    [baseColor.h, lightnessCurve],
  );
  const allGeneratedPalette = useMemo(
    () =>
      SWATCH_ORDER.map((label) => ({
        label,
        color: {
          l: lightnessCurve[label],
          c: clamp((sliderValue * chromaCurve[label]) / CHROMA_SCALE, 0, 0.4),
          h: baseColor.h,
        },
      })),
    [baseColor.h, chromaCurve, lightnessCurve, sliderValue],
  );
  const generatedPalette = useMemo(() => {
    if (chromaMode === "all") {
      return allGeneratedPalette;
    }

    return SWATCH_ORDER.map((label) => {
      const parsedCustomValue = Number.parseFloat(customChromaValues[label] ?? "");
      const safeCustomValue = clamp(
        Number.isFinite(parsedCustomValue) ? parsedCustomValue : 0,
        0,
        toneMaxChromaMap[label],
      );

      return {
        label,
        color: {
          l: lightnessCurve[label],
          c: clamp(safeCustomValue / CHROMA_SCALE, 0, 0.4),
          h: baseColor.h,
        },
      };
    });
  }, [allGeneratedPalette, baseColor.h, chromaMode, customChromaValues, lightnessCurve, toneMaxChromaMap]);
  const editableToneLabels = useMemo(() => {
    if (previewKind === "baseBackground") {
      return ["200", "100", "50"] as SwatchLightness[];
    }

    if (previewKind === "baseForeground") {
      return ["900", "800", "700", "600", "500"] as SwatchLightness[];
    }

    return [...SWATCH_ORDER] as SwatchLightness[];
  }, [previewKind]);
  const swatches = useMemo(() => {
    if (mode === "brand") {
      if (chromaMode === "custom") {
        return BRAND_STATE_ORDER.map((label) => {
          const toneLabel = getBrandStateToneLabel(selectedLightness as (typeof BRAND_BASE_LIGHTNESS)[number], label);
          const stateLightness = getLightnessValue(
            BRAND_LIGHTNESS_MAP[selectedLightness as (typeof BRAND_BASE_LIGHTNESS)[number]][label],
          );
          const maxStateChroma = findMaxChromaForLightnessAndHue(stateLightness, baseColor.h) * CHROMA_SCALE;
          const parsedCustomValue = Number.parseFloat(customChromaValues[toneLabel] ?? "");
          const safeCustomValue = clamp(Number.isFinite(parsedCustomValue) ? parsedCustomValue : 0, 0, maxStateChroma);

          return {
            label,
            color: {
              l: stateLightness,
              c: clamp(safeCustomValue / CHROMA_SCALE, 0, 0.4),
              h: baseColor.h,
            },
          };
        });
      }

      return BRAND_STATE_ORDER.map((label) => ({
        label,
        color: {
          l: getLightnessValue(BRAND_LIGHTNESS_MAP[selectedLightness as (typeof BRAND_BASE_LIGHTNESS)[number]][label]),
          c: clamp(
            (sliderValue *
              chromaCurve[BRAND_LIGHTNESS_MAP[selectedLightness as (typeof BRAND_BASE_LIGHTNESS)[number]][label]]) /
              CHROMA_SCALE,
            0,
            0.4,
          ),
          h: baseColor.h,
        },
      }));
    }

    return generatedPalette;
  }, [
    baseColor.h,
    chromaCurve,
    chromaMode,
    customChromaValues,
    generatedPalette,
    mode,
    selectedLightness,
    sliderValue,
  ]);
  const previewSwatches = useMemo(() => {
    if (previewKind === "brand") {
      return swatches;
    }

    if (previewKind === "baseBackground") {
      return generatedPalette.filter(
        (swatch) => swatch.label === "200" || swatch.label === "100" || swatch.label === "50",
      );
    }

    if (previewKind === "baseForeground") {
      return generatedPalette.filter((swatch) => ["900", "800", "700", "600", "500"].includes(swatch.label));
    }

    return generatedPalette;
  }, [generatedPalette, previewKind, swatches]);
  useEffect(() => {
    if (!Number.isFinite(parsedChromaValue)) {
      return;
    }

    const clampedValue = clamp(parsedChromaValue, 0, maxValueChroma);
    if (Math.abs(clampedValue - parsedChromaValue) > 0.005) {
      onEditorStateChange((prev) => ({
        ...prev,
        chromaValue: clampedValue.toFixed(2),
      }));
    }
  }, [maxValueChroma, onEditorStateChange, parsedChromaValue]);

  useEffect(() => {
    onSwatchesChange?.(
      previewSwatches.map((swatch) => ({
        label: String(swatch.label),
        cssColor: formatOklchCss(swatch.color),
      })),
    );
  }, [onSwatchesChange, previewSwatches]);

  const hasOpenedRef = useRef(false);
  useEffect(() => {
    if (open) {
      hasOpenedRef.current = true;
    }
  }, [open]);
  useEffect(() => {
    if (!hasOpenedRef.current) return;
    onPaletteChange?.(
      generatedPalette.map((swatch) => ({
        label: String(swatch.label),
        cssColor: formatOklchCss(swatch.color),
      })),
    );
  }, [generatedPalette, onPaletteChange]);

  useEffect(() => {
    onToneChange?.(selectedLightness);
  }, [onToneChange, selectedLightness]);

  useEffect(() => {
    if (!locksBaseToneToStrongest || storedSelectedLightness === selectedLightness) {
      return;
    }

    onEditorStateChange((prev) => ({
      ...prev,
      selectedLightness,
    }));
  }, [locksBaseToneToStrongest, onEditorStateChange, selectedLightness, storedSelectedLightness]);

  useEffect(() => {
    if (chromaMode !== "custom") {
      return;
    }

    const nextCustomChromaValues = Object.fromEntries(
      SWATCH_ORDER.map((label) => {
        const fallbackValue = allGeneratedPalette.find((swatch) => swatch.label === label)?.color.c ?? 0;
        const parsedValue = Number.parseFloat(customChromaValues[label] ?? "");
        const safeValue = Number.isFinite(parsedValue) ? parsedValue : fallbackValue * CHROMA_SCALE;

        return [label, clamp(safeValue, 0, toneMaxChromaMap[label]).toFixed(2)];
      }),
    ) as Partial<Record<SwatchLightness, string>>;

    if (areToneChromaValuesEqual(customChromaValues, nextCustomChromaValues)) {
      return;
    }

    onEditorStateChange((prev) => ({
      ...prev,
      customChromaValues: nextCustomChromaValues,
    }));
  }, [allGeneratedPalette, chromaMode, customChromaValues, onEditorStateChange, toneMaxChromaMap]);

  const updateChromaFromPointer = (clientX: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onEditorStateChange((prev) => ({
      ...prev,
      chromaValue: (ratio * maxValueChroma).toFixed(2),
    }));
  };

  const handleChromaChange = (nextValue: string) => {
    const parsedValue = Number.parseFloat(nextValue);

    if (!Number.isFinite(parsedValue)) {
      onEditorStateChange((prev) => ({
        ...prev,
        chromaValue: nextValue,
      }));
      return;
    }

    onEditorStateChange((prev) => ({
      ...prev,
      chromaValue: clamp(parsedValue, 0, maxValueChroma).toFixed(2),
    }));
  };

  const handleChromaModeChange = (nextValue: ChromaMode) => {
    if (nextValue === chromaMode) {
      return;
    }

    if (nextValue === "all") {
      onEditorStateChange((prev) => ({
        ...prev,
        chromaMode: "all",
      }));
      return;
    }

    const nextCustomChromaValues = Object.fromEntries(
      allGeneratedPalette.map((swatch) => [
        swatch.label,
        clamp(swatch.color.c * CHROMA_SCALE, 0, toneMaxChromaMap[swatch.label as SwatchLightness]).toFixed(2),
      ]),
    ) as Partial<Record<SwatchLightness, string>>;

    onEditorStateChange((prev) => ({
      ...prev,
      chromaMode: "custom",
      customChromaValues: areToneChromaValuesEqual(prev.customChromaValues, nextCustomChromaValues)
        ? prev.customChromaValues
        : nextCustomChromaValues,
    }));
  };

  const handleCustomChromaValueChange = (label: SwatchLightness, nextValue: number) => {
    onEditorStateChange((prev) => ({
      ...prev,
      customChromaValues: {
        ...prev.customChromaValues,
        [label]: clamp(nextValue, 0, toneMaxChromaMap[label]).toFixed(2),
      },
    }));
  };

  const handleLightnessChange = (
    nextValue: (typeof SELECTABLE_LIGHTNESS)[number] | (typeof BRAND_BASE_LIGHTNESS)[number],
  ) => {
    const nextMaxValueChroma =
      findMaxChromaForLightnessAndHue(getDefaultLightnessForMode(mode, nextValue), baseColor.h) * CHROMA_SCALE;
    const nextChromaValue = Math.max(nextMaxValueChroma * 0.98, Math.min(sliderValue, nextMaxValueChroma));
    onEditorStateChange((prev) => ({
      ...prev,
      selectedLightness: nextValue,
      chromaValue: clamp(nextChromaValue, 0, nextMaxValueChroma).toFixed(2),
    }));
  };

  const handleHexChange = (nextValue: string) => {
    const normalizedHexValue = sanitizeHexValue(nextValue);
    const rgb = parseHexColor(normalizedHexValue);

    if (!rgb) {
      onEditorStateChange((prev) => ({
        ...prev,
        hexValue: normalizedHexValue,
      }));
      return;
    }

    const nextOklch = hexToOklch(`#${normalizedHexValue}`);
    const nextSelectedLightness =
      mode === "brand"
        ? (findNearestToneByLightness(
            `#${normalizedHexValue}`,
            BRAND_BASE_LIGHTNESS,
          ) as (typeof BRAND_BASE_LIGHTNESS)[number])
        : locksBaseToneToStrongest
          ? findMostColorSelectableLightness(nextOklch.h)
          : (findNearestToneByLightness(
              `#${normalizedHexValue}`,
              SELECTABLE_LIGHTNESS,
            ) as (typeof SELECTABLE_LIGHTNESS)[number]);
    const nextMaxValueChroma =
      findMaxChromaForLightnessAndHue(getDefaultLightnessForMode(mode, nextSelectedLightness), nextOklch.h) *
      CHROMA_SCALE;
    const nextChromaValue = clamp(nextOklch.c * CHROMA_SCALE, 0, nextMaxValueChroma);
    onEditorStateChange({
      hexValue: normalizedHexValue,
      selectedLightness: nextSelectedLightness,
      chromaValue: clamp(nextChromaValue, 0, nextMaxValueChroma).toFixed(2),
      chromaMode: editorState.chromaMode,
      customChromaValues: editorState.customChromaValues,
      baseColor: {
        l: nextOklch.l,
        c: nextOklch.c,
        // 無彩色（c≈0）の場合は既存の hue を維持する。
        // OKLch では無彩色に対して h=0（赤方向）が返るため、
        // そのまま使うとクロマを上げたときに意図しない色相が現れる。
        h: nextOklch.c > 0.001 ? nextOklch.h : editorState.baseColor.h,
      },
    });
  };

  const handleSliderPointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    updateChromaFromPointer(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleSliderPointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if ((event.buttons & 1) !== 1) return;
    updateChromaFromPointer(event.clientX);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange} placement="bottom-start">
      <Popover.Anchor>{(trigger ?? <Button>{mode}</Button>) as React.ReactElement}</Popover.Anchor>
      <Popover.Content width="medium">
        <Popover.Body>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "88px minmax(0, 1fr)",
                alignItems: "center",
                gap: "var(--aegis-space-small)",
              }}
            >
              <Text variant="body.medium">HEX</Text>
              <TextField
                aria-label="HEX"
                size="small"
                leading="#"
                value={hexValue}
                onChange={(e) => handleHexChange(e.target.value)}
              />
            </div>
            <Divider />
            {mode === "base" && !locksBaseToneToStrongest ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "88px minmax(0, 1fr)",
                  alignItems: "center",
                  gap: "var(--aegis-space-small)",
                }}
              >
                <Text variant="body.medium">Base Tone</Text>
                <Select
                  aria-label="Base Tone"
                  size="small"
                  options={LIGHTNESS_OPTIONS}
                  value={selectedLightness as (typeof SELECTABLE_LIGHTNESS)[number]}
                  onChange={(value) => handleLightnessChange(value as (typeof SELECTABLE_LIGHTNESS)[number])}
                />
              </div>
            ) : mode === "brand" ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "88px minmax(0, 1fr)",
                  alignItems: "center",
                  gap: "var(--aegis-space-small)",
                }}
              >
                <Text variant="body.medium">Base Tone</Text>
                <Select
                  aria-label="Base Tone"
                  size="small"
                  options={BRAND_LIGHTNESS_OPTIONS}
                  value={selectedLightness as (typeof BRAND_BASE_LIGHTNESS)[number]}
                  onChange={(value) => handleLightnessChange(value as (typeof BRAND_BASE_LIGHTNESS)[number])}
                />
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-small)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "88px minmax(0, 1fr)",
                  alignItems: "center",
                  gap: "var(--aegis-space-small)",
                }}
              >
                <Text variant="body.medium">Chroma</Text>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: chromaMode === "all" ? "112px minmax(0, 1fr)" : "1fr",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  <Select
                    aria-label="Chroma mode"
                    size="small"
                    options={[...CHROMA_MODE_OPTIONS]}
                    value={chromaMode}
                    onChange={(value) => handleChromaModeChange(value as ChromaMode)}
                  />
                  {chromaMode === "all" ? (
                    <TextField
                      aria-label="Chroma value"
                      size="small"
                      value={chromaValue}
                      onChange={(e) => handleChromaChange(e.target.value)}
                    />
                  ) : null}
                </div>
              </div>
              {chromaMode === "all" ? (
                <div style={{ paddingInline: "var(--aegis-space-x3Small)" }}>
                  <div
                    ref={sliderRef}
                    className={styles.slider}
                    role="slider"
                    aria-label="Chroma"
                    aria-valuemin={0}
                    aria-valuemax={Math.round(maxValueChroma)}
                    aria-valuenow={Math.round(sliderValue)}
                    tabIndex={0}
                    onPointerDown={handleSliderPointerDown}
                    onPointerMove={handleSliderPointerMove}
                  >
                    <div className={styles.sliderTrack} />
                    <div className={styles.sliderProgress} style={{ width: sliderProgress }} />
                    <div className={styles.sliderThumb} style={{ left: sliderProgress }} />
                  </div>
                </div>
              ) : (
                <div
                  className={styles.toneSliderGrid}
                  style={{ gridTemplateColumns: `repeat(${editableToneLabels.length}, minmax(0, 1fr))` }}
                >
                  {editableToneLabels.map((label) => {
                    const parsedCustomValue = Number.parseFloat(customChromaValues[label] ?? "");
                    const safeCustomValue = clamp(
                      Number.isFinite(parsedCustomValue) ? parsedCustomValue : 0,
                      0,
                      toneMaxChromaMap[label],
                    );
                    const sliderRatio = toneMaxChromaMap[label] === 0 ? 0 : safeCustomValue / toneMaxChromaMap[label];

                    return (
                      <div key={label} className={styles.toneSliderItem}>
                        <div
                          className={styles.verticalSlider}
                          role="slider"
                          aria-label={`Chroma ${label}`}
                          aria-valuemin={0}
                          aria-valuemax={Math.round(toneMaxChromaMap[label])}
                          aria-valuenow={Math.round(safeCustomValue)}
                          tabIndex={0}
                          onPointerDown={(event) => {
                            const rect = event.currentTarget.getBoundingClientRect();
                            const ratio = Math.max(0, Math.min(1, (rect.bottom - event.clientY) / rect.height));
                            handleCustomChromaValueChange(label, ratio * toneMaxChromaMap[label]);
                            event.currentTarget.setPointerCapture(event.pointerId);
                          }}
                          onPointerMove={(event) => {
                            if ((event.buttons & 1) !== 1) return;
                            const rect = event.currentTarget.getBoundingClientRect();
                            const ratio = Math.max(0, Math.min(1, (rect.bottom - event.clientY) / rect.height));
                            handleCustomChromaValueChange(label, ratio * toneMaxChromaMap[label]);
                          }}
                          onKeyDown={(event) => {
                            const step = toneMaxChromaMap[label] * (event.shiftKey ? 0.1 : 0.02);

                            if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
                              event.preventDefault();
                              handleCustomChromaValueChange(label, safeCustomValue - step);
                            }

                            if (event.key === "ArrowUp" || event.key === "ArrowRight") {
                              event.preventDefault();
                              handleCustomChromaValueChange(label, safeCustomValue + step);
                            }
                          }}
                        >
                          <div className={styles.verticalSliderTrack} />
                          <div className={styles.verticalSliderProgress} style={{ height: `${sliderRatio * 100}%` }} />
                          <div className={styles.verticalSliderThumb} style={{ bottom: `${sliderRatio * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "var(--aegis-space-x4Small)",
                borderRadius: "var(--aegis-radius-medium)",
                overflow: "hidden",
              }}
            >
              {(previewKind === "brand" ? swatches : previewSwatches).map((swatch) => {
                const isOutlineStyle = previewKind === "baseForeground";
                const usesInverse =
                  !isOutlineStyle &&
                  (previewKind === "brand" ? Number(selectedLightness) >= 600 : Number(swatch.label) >= 600);
                const cssColor = formatOklchCss(swatch.color);

                return (
                  <div
                    key={swatch.label}
                    style={{
                      height: chromaMode === "custom" ? "80px" : "32px",
                      flex: 1,
                      minWidth: 0,
                      backgroundColor: isOutlineStyle ? "transparent" : cssColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isOutlineStyle
                        ? cssColor
                        : usesInverse
                          ? "var(--aegis-color-foreground-inverse)"
                          : "var(--aegis-color-foreground-default)",
                    }}
                  >
                    <Text
                      variant={previewKind === "baseForeground" ? "body.medium" : "body.xSmall"}
                      color={usesInverse ? "inverse" : undefined}
                      style={{ fontWeight: previewKind === "baseForeground" ? "bold" : "normal" }}
                    >
                      {swatch.label}
                    </Text>
                  </div>
                );
              })}
            </div>
          </div>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
};
