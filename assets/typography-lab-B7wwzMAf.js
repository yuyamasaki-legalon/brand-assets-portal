var e=`import { LfArrowDown, LfArrowUp, LfCloseLarge, LfLayoutFillRightAlt } from "@legalforce/aegis-icons";
import {
  ActionList,
  Button,
  ButtonGroup,
  Checkbox,
  Combobox,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Divider,
  FormControl,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  Provider,
  Select,
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  Tab,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { themes } from "../../../../../themes";
import { buildTokensJson, buildTypographiesJs } from "./assets/export-model";
import paletteJsonSeed from "./assets/palette.json";
import { buildSemanticTokenStyle } from "./assets/palette-resolver";
import { PREVIEW_PAGE_GROUPS, PREVIEW_PAGES } from "./assets/preview-pages";
import { RawPreview } from "./assets/raw-preview";
import {
  LINE_HEIGHT_IS_AEGIS_OFFICIAL,
  LINE_HEIGHT_TOKEN_KEYS,
  type LineHeightTokenKey,
  SETTING_DEFAULTS,
  type SettingState,
  SIZE_TOKEN_KEYS,
  SIZE_TOKEN_PX,
  type SizeTokenKey,
  WEIGHT_TOKEN_KEYS,
  type WeightTokenKey,
} from "./assets/setting-model";
import {
  buildTypographyVarsCssFromModel,
  PREVIEW_ROOT_ATTR,
  STATIC_AEGIS_CSS_V2,
  STATIC_TYPOGRAPHY_CSS_V2,
} from "./assets/typography-vars";
import {
  getDefinedSlots,
  VARIANT_FAMILY_KEYS,
  VARIANT_FAMILY_LABELS,
  VARIANT_MAP_DEFAULTS,
  type VariantFamilyKey,
  type VariantMapState,
  type WeightSlot,
} from "./assets/variant-map-model";
import styles from "./index.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Settings Sidebar behavior mode.
 * - "push": sidebar shifts content inline when open
 * Typography Lab now uses push permanently.
 *
 * ─── push 切り替え前の確認観点 ──────────────────────────────────────────────────
 *
 * [1] 横幅の責務
 *   SidebarInset 直下に PreviewComponent を直接 render しているため、push にすると
 *   preview 領域全体が右へ押される。以下の点が崩れないかを確認する:
 *   - template 側の PageLayoutPane / Sidebar: 既存 pane が幅を食っている場合、
 *     さらに左から push されると content 幅が極端に狭くなる
 *   - template 側の overflow: template 内で overflow:hidden を前提にしている場合、
 *     横スクロールが発生する可能性がある
 *   - narrow width 時の折り返し: 1280px 未満のウィンドウでの確認が必須
 *
 * [2] template 自身の pane/sidebar との共存
 *   sandbox-builder など自前で pane/sidebar を持つ template では:
 *   - Lab settings sidebar (左) + template sidebar/pane (左右) が同時に存在する
 *   - content width が合計で 400px + template pane幅 分だけ圧迫される
 *   - preview としての最低幅 (おおむね 800px) を保てるか確認が必要
 *   → push 時は raw preview 専用で使うか、template preview では overlay に戻す、
 *     という conditional behavior も将来の選択肢として残しておく
 *
 * [3] reopen トリガー位置
 *   現在は SidebarInset 内の左上に position:absolute で配置している。
 *   push 時はコンテンツ全体が右へ動くため、このボタンも一緒に動く。
 *   - "content と一緒に動く" 仕様で十分か
 *   - あるいは SidebarProvider の外側 (viewport 固定) に移動させるか
 *   → ユースケース上は content と一緒に動く方が自然と思われるが、
 *     template preview 中に sidebar が閉じている状態では viewport 左端に欲しい可能性もある
 *
 * [4] compare scope の影響
 *   push 時は Sidebar が layout の一部として視覚的により強く存在する。
 *   compare=false では Sidebar 内の UI にも Lab typography が適用されるため、
 *   settings 操作中に設定 UI 自体の見た目が変わる現象が layout 感として目立ちやすくなる。
 *   これは仕様上の想定動作 (Sidebar も preview scope に含める方針) だが、
 *   push 切り替え時に「Sidebar を scope 外にしたい」という判断が生じる可能性に備えておく。
 *
 * [5] "window 全体 preview" とのトレードオフ
 *   overlay: preview の全体感を維持しやすい。サイドバーが上から重なるだけで幅は全幅。
 *   push:    操作しやすいが、sidebar を開いている間 preview 幅が縮む。
 *   → Typography Lab の本来の目的 (template を window 全体として見る) には overlay が適している。
 *     push は token/variant 編集作業を頻繁に行う場合の操作性改善目的で検討する。
 *
 * [6] width / minWidth の影響
 *   現在 width="medium" / minWidth="medium" (≈400px)。push 時はこの 400px が
 *   そのまま preview の圧迫幅になる。将来の調整余地:
 *   - previewPageId が空 (raw preview) の場合は広め (medium)
 *   - template preview 時は狭め (small) にして preview 幅を確保
 *   - resizable なので利用者が手動調整する前提で許容するか
 * ────────────────────────────────────────────────────────────────────────────────
 */
const SIDEBAR_BEHAVIOR: "push" = "push";

/** Japanese font priority presets. Inter is always first; only the Japanese candidate order changes. */
const HIRAGINO_PRIORITY_FAMILIES = [
  "Inter",
  "Hiragino Sans",
  "Hiragino Kaku Gothic ProN",
  "Noto Sans JP",
  "system-ui",
  "sans-serif",
];
const NOTO_PRIORITY_FAMILIES = [
  "Inter",
  "Noto Sans JP",
  "Hiragino Sans",
  "Hiragino Kaku Gothic ProN",
  "system-ui",
  "sans-serif",
];

type FontPriority = "hiragino" | "noto";

const FONT_PRIORITY_OPTIONS: { label: string; value: FontPriority }[] = [
  { label: "Hiragino First", value: "hiragino" },
  { label: "Noto First", value: "noto" },
];

const INITIAL_PALETTE_JSON = JSON.stringify(paletteJsonSeed, null, 2);

const DEFAULT_FONT_FACE_CSS = \`/* =========================
   Google Fonts
   Inter: 英語・数字・記号
   Noto Sans JP: 日本語
========================= */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Noto+Sans+JP:wght@100..900&display=swap');


/* =========================
   Base
========================= */

html,
body {
  font-family: var(--aegis-internal-font-family-base);
  font-weight: var(--aegis-internal-font-weight-normal);

  /* 擬似ボールド防止（重要） */
  font-synthesis-weight: none;
}


/* =========================
   Utility（任意）
========================= */

.aegis-fw-100 { font-weight: 100; }
.aegis-fw-300 { font-weight: 300; }
.aegis-fw-400 { font-weight: 400; }
.aegis-fw-500 { font-weight: 500; }
.aegis-fw-600 { font-weight: 600; }
.aegis-fw-700 { font-weight: 700; }
.aegis-fw-900 { font-weight: 900; }\`;

/** Font-weight options for weight token selects (numeric values). */
const WEIGHT_OPTIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => ({
  label: String(w),
  value: String(w),
}));

/** Weight token key options for Variant Map selects (selects which token to reference). */
const WEIGHT_TOKEN_OPTIONS = WEIGHT_TOKEN_KEYS.map((k) => ({ label: k, value: k }));

/** Line-height token key options for Variant Map selects. */
const LINE_HEIGHT_TOKEN_OPTIONS = LINE_HEIGHT_TOKEN_KEYS.map((k) => ({
  label: \`\${k}\${!LINE_HEIGHT_IS_AEGIS_OFFICIAL[k] ? " @lab" : ""}\`,
  value: k,
}));

/** Family filter options: "all" + each family key. */
const FAMILY_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: "All families", value: "" },
  ...VARIANT_FAMILY_KEYS.map((k) => ({ label: VARIANT_FAMILY_LABELS[k], value: k })),
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** CSS-safe font-family value from an ordered name list. */
const toFontFamilyCss = (names: string[]): string => names.map((f) => (f.includes(" ") ? \`"\${f}"\` : f)).join(", ");

// ─── Sub-components ───────────────────────────────────────────────────────────

type SliderWithFieldProps = {
  value: number;
  min?: number;
  max: number;
  step?: number;
  decimals?: number;
  onChange: (value: number) => void;
};

const SliderWithField = ({ value, min = 0, max, step = 0.02, decimals = 2, onChange }: SliderWithFieldProps) => {
  const range = max - min;
  const progress = \`\${((value - min) / range) * 100}%\`;

  const updateFromPointer = (clientX: number, currentTarget: HTMLDivElement) => {
    const rect = currentTarget.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    onChange(Number((min + ratio * range).toFixed(decimals)));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 76px",
        alignItems: "center",
        gap: "var(--aegis-space-small)",
      }}
    >
      <div
        className={styles.slider}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(value * 1000) / 1000}
        tabIndex={0}
        onPointerDown={(event) => {
          updateFromPointer(event.clientX, event.currentTarget);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if ((event.buttons & 1) !== 1) return;
          updateFromPointer(event.clientX, event.currentTarget);
        }}
        onKeyDown={(event) => {
          const delta = event.shiftKey ? step * 5 : step;
          if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            onChange(Number(clamp(value - delta, min, max).toFixed(decimals)));
          }
          if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            onChange(Number(clamp(value + delta, min, max).toFixed(decimals)));
          }
        }}
      >
        <div className={styles.sliderTrack} />
        <div className={styles.sliderProgress} style={{ width: progress }} />
        <div className={styles.sliderThumb} style={{ left: progress }} />
      </div>
      <TextField
        size="small"
        value={value.toFixed(decimals)}
        onChange={(event) => {
          const next = Number.parseFloat(event.target.value);
          if (Number.isFinite(next)) onChange(Number(clamp(next, min, max).toFixed(decimals)));
        }}
      />
    </div>
  );
};

/** Compact section header label used inside pane tab content. */
const SectionLabel = ({ children }: { children: string }) => (
  <Text variant="title.xSmall" as="p" style={{ margin: 0 }}>
    {children}
  </Text>
);

// ─── Main component ───────────────────────────────────────────────────────────

const DIALOG_TABS = ["Palette", "Font Family", "Font CSS", "Typography CSS"] as const;
const PANE_TABS = ["Setting", "Variant Map"] as const;

type ExportFormat = "css" | "json" | "js";
const EXPORT_FORMATS: { label: string; value: ExportFormat }[] = [
  { label: "CSS", value: "css" },
  { label: "Tokens JSON", value: "json" },
  { label: "Typographies JS", value: "js" },
];

const createInitialSettingState = (): SettingState => ({
  weights: { ...SETTING_DEFAULTS.weights },
  letterSpacing: { ...SETTING_DEFAULTS.letterSpacing },
  lineHeights: { ...SETTING_DEFAULTS.lineHeights },
  fontFamily: {
    sans: { families: [...SETTING_DEFAULTS.fontFamily.sans.families] },
    serif: { families: [...SETTING_DEFAULTS.fontFamily.serif.families] },
  },
});

// ─── Persistence ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "typography-lab:v1";

type TypographyLabPersistedState = {
  settingState: SettingState;
  variantMapState: VariantMapState;
  fontPriority: FontPriority;
  previewPageId: string;
  compareMode: boolean;
  paneTabIndex: number;
  familyFilter: VariantFamilyKey | "";
  isSidebarOpen: boolean;
  fontFaceCss: string;
  paletteJson: string;
};

function migrateAegisInter(families: string[]): string[] {
  return families.map((f) => (f === "Aegis Inter" ? "Inter" : f));
}

function loadPersistedState(): Partial<TypographyLabPersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const p = parsed as Partial<TypographyLabPersistedState>;
    // Migrate "Aegis Inter" -> "Inter" in saved font families
    const savedFamilies = p.settingState?.fontFamily?.sans?.families;
    const savedSettingState = p.settingState;
    const savedFontFamily = savedSettingState?.fontFamily;
    if (
      savedSettingState &&
      savedFontFamily &&
      Array.isArray(savedFamilies) &&
      savedFamilies.some((f) => f === "Aegis Inter")
    ) {
      const migratedSettingState: SettingState = {
        ...savedSettingState,
        fontFamily: {
          ...savedFontFamily,
          sans: { families: migrateAegisInter(savedFamilies) },
        },
      };
      return { ...p, settingState: migratedSettingState };
    }
    return p;
  } catch {
    return {};
  }
}

function savePersistedState(state: TypographyLabPersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export const TypographyLab = () => {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  // Load persisted state once on first render
  const [persisted] = useState(loadPersistedState);

  // Global typography CSS (font-face declarations; font-family stack is managed via settingState)
  const [fontFaceCss, setFontFaceCss] = useState(() => persisted.fontFaceCss ?? DEFAULT_FONT_FACE_CSS);
  // Japanese font priority: controls which preset stack is applied (Hiragino-first vs Noto-first).
  // Changing this updates settingState.fontFamily.sans.families to the corresponding preset.
  const [fontPriority, setFontPriority] = useState<FontPriority>(() => {
    const saved = persisted.fontPriority;
    return saved === "hiragino" || saved === "noto" ? saved : "hiragino";
  });

  // NEW MODEL: token actual values (Setting tab) + structural mapping (Variant Map tab)
  const [settingState, setSettingState] = useState<SettingState>(() => {
    const saved = persisted.settingState;
    if (!saved || typeof saved !== "object") return createInitialSettingState();
    const initial = createInitialSettingState();
    return {
      weights: {
        ...initial.weights,
        ...(typeof saved.weights === "object" && saved.weights !== null ? saved.weights : {}),
      },
      letterSpacing: {
        ...initial.letterSpacing,
        ...(typeof saved.letterSpacing === "object" && saved.letterSpacing !== null ? saved.letterSpacing : {}),
      },
      lineHeights: {
        ...initial.lineHeights,
        ...(typeof saved.lineHeights === "object" && saved.lineHeights !== null ? saved.lineHeights : {}),
      },
      fontFamily: {
        sans: {
          families: Array.isArray(saved.fontFamily?.sans?.families)
            ? saved.fontFamily.sans.families
            : initial.fontFamily.sans.families,
        },
        serif: {
          families: Array.isArray(saved.fontFamily?.serif?.families)
            ? saved.fontFamily.serif.families
            : initial.fontFamily.serif.families,
        },
      },
    };
  });
  const [variantMapState, setVariantMapState] = useState<VariantMapState>(() => {
    const saved = persisted.variantMapState;
    if (!saved || typeof saved !== "object") return { ...VARIANT_MAP_DEFAULTS };
    return { ...VARIANT_MAP_DEFAULTS, ...saved };
  });

  // Font Family tab: input for adding a new font name
  const [newFontName, setNewFontName] = useState("");

  // Compare mode — URL first, then localStorage, then default true.
  const [compareMode, setCompareMode] = useState(() => {
    const urlVal = searchParams.get("compare");
    if (urlVal !== null) return urlVal === "true";
    if (typeof persisted.compareMode === "boolean") return persisted.compareMode;
    return true;
  });

  // outerRef: wraps both the preview area and the settings sidebar under [data-typo-preview-root],
  // so compare mode applies to the full Lab surface (preview + sidebar).
  // Template preview is protected from broad-selector leakage by TYPE_ELEMENT_MAP's
  // [data-typo-type] fixture selectors — not by scope restriction.
  const outerRef = useRef<HTMLDivElement>(null);

  // Sidebar open state — restored from localStorage or starts open on first load.
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => persisted.isSidebarOpen ?? true);
  // Dialog + pane tab state
  const [paletteJson, setPaletteJson] = useState(() => {
    const saved = persisted.paletteJson;
    return typeof saved === "string" ? saved : INITIAL_PALETTE_JSON;
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTabIndex, setDialogTabIndex] = useState(0);
  const [paneTabIndex, setPaneTabIndex] = useState(() => {
    const saved = persisted.paneTabIndex;
    return typeof saved === "number" && Number.isInteger(saved) && saved >= 0 && saved < PANE_TABS.length ? saved : 0;
  });
  const [exportFormat, setExportFormat] = useState<ExportFormat>("css");

  const activeDialogTab = DIALOG_TABS[dialogTabIndex] ?? DIALOG_TABS[0];
  const activePaneTab = PANE_TABS[paneTabIndex] ?? PANE_TABS[0];

  // Derived
  const semanticTokenStyles = useMemo(() => buildSemanticTokenStyle(paletteJson), [paletteJson]);

  // Japanese font priority stack.
  // settingState.fontFamily.sans.families is the source of truth; fontPriority sets the preset on change.
  const activeFamilies = useMemo(() => settingState.fontFamily.sans.families, [settingState.fontFamily.sans.families]);

  // Switching fontPriority updates the font stack to the corresponding preset.
  const handleFontPriorityChange = useCallback((priority: FontPriority) => {
    setFontPriority(priority);
    setSettingState((prev) => ({
      ...prev,
      fontFamily: {
        ...prev.fontFamily,
        sans: { families: priority === "noto" ? NOTO_PRIORITY_FAMILIES : HIRAGINO_PRIORITY_FAMILIES },
      },
    }));
  }, []);

  // Setting state updaters
  const updateWeight = useCallback((key: WeightTokenKey, value: number) => {
    setSettingState((prev) => ({ ...prev, weights: { ...prev.weights, [key]: value } }));
  }, []);
  const updateLetterSpacing = useCallback((key: SizeTokenKey, value: number) => {
    setSettingState((prev) => ({ ...prev, letterSpacing: { ...prev.letterSpacing, [key]: value } }));
  }, []);
  const updateLineHeight = useCallback((key: LineHeightTokenKey, value: number) => {
    setSettingState((prev) => ({ ...prev, lineHeights: { ...prev.lineHeights, [key]: value } }));
  }, []);
  const resetSettings = useCallback(
    () =>
      setSettingState((prev) => ({
        ...prev,
        weights: { ...SETTING_DEFAULTS.weights },
        letterSpacing: { ...SETTING_DEFAULTS.letterSpacing },
        lineHeights: { ...SETTING_DEFAULTS.lineHeights },
      })),
    [],
  );

  // Font Family updaters
  const addFontFamily = useCallback(() => {
    const trimmed = newFontName.trim();
    if (!trimmed) return;
    setSettingState((prev) => ({
      ...prev,
      fontFamily: { ...prev.fontFamily, sans: { families: [...prev.fontFamily.sans.families, trimmed] } },
    }));
    setNewFontName("");
  }, [newFontName]);

  const removeFontFamily = useCallback((index: number) => {
    setSettingState((prev) => {
      if (prev.fontFamily.sans.families.length <= 1) return prev;
      return {
        ...prev,
        fontFamily: {
          ...prev.fontFamily,
          sans: { families: prev.fontFamily.sans.families.filter((_, i) => i !== index) },
        },
      };
    });
  }, []);

  const moveFontFamilyUp = useCallback((index: number) => {
    if (index === 0) return;
    setSettingState((prev) => {
      const families = [...prev.fontFamily.sans.families];
      [families[index - 1], families[index]] = [families[index], families[index - 1]];
      return { ...prev, fontFamily: { ...prev.fontFamily, sans: { families } } };
    });
  }, []);

  const moveFontFamilyDown = useCallback((index: number) => {
    setSettingState((prev) => {
      if (index >= prev.fontFamily.sans.families.length - 1) return prev;
      const families = [...prev.fontFamily.sans.families];
      [families[index], families[index + 1]] = [families[index + 1], families[index]];
      return { ...prev, fontFamily: { ...prev.fontFamily, sans: { families } } };
    });
  }, []);

  const resetFontFamily = useCallback(() => {
    setSettingState((prev) => ({
      ...prev,
      fontFamily: { ...SETTING_DEFAULTS.fontFamily },
    }));
  }, []);

  const hasFontFamilyChange = useMemo(() => {
    const defaults = SETTING_DEFAULTS.fontFamily.sans.families;
    const current = settingState.fontFamily.sans.families;
    return current.length !== defaults.length || current.some((f, i) => f !== defaults[i]);
  }, [settingState.fontFamily.sans.families]);

  // Variant Map state updaters
  const [familyFilter, setFamilyFilter] = useState<VariantFamilyKey | "">(() => {
    const saved = persisted.familyFilter;
    if (saved === undefined || saved === "") return "";
    return (VARIANT_FAMILY_KEYS as readonly string[]).includes(saved) ? (saved as VariantFamilyKey) : "";
  });

  const updateSlotWeight = useCallback((familyKey: VariantFamilyKey, slot: WeightSlot, token: WeightTokenKey) => {
    setVariantMapState((prev) => {
      const currentSlot = prev[familyKey].slots[slot];
      if (!currentSlot) return prev;
      return {
        ...prev,
        [familyKey]: {
          ...prev[familyKey],
          slots: { ...prev[familyKey].slots, [slot]: { ...currentSlot, weightToken: token } },
        },
      };
    });
  }, []);

  const updateSlotLineHeight = useCallback(
    (familyKey: VariantFamilyKey, slot: WeightSlot, token: LineHeightTokenKey) => {
      setVariantMapState((prev) => {
        const currentSlot = prev[familyKey].slots[slot];
        if (!currentSlot) return prev;
        return {
          ...prev,
          [familyKey]: {
            ...prev[familyKey],
            slots: { ...prev[familyKey].slots, [slot]: { ...currentSlot, lineHeightToken: token } },
          },
        };
      });
    },
    [],
  );

  const updateSlotLetterSpacing = useCallback((familyKey: VariantFamilyKey, slot: WeightSlot, value: number) => {
    setVariantMapState((prev) => {
      const currentSlot = prev[familyKey].slots[slot];
      if (!currentSlot) return prev;
      return {
        ...prev,
        [familyKey]: {
          ...prev[familyKey],
          slots: {
            ...prev[familyKey].slots,
            [slot]: { ...currentSlot, letterSpacingOverride: value },
          },
        },
      };
    });
  }, []);

  const resetVariantMap = useCallback(() => setVariantMapState({ ...VARIANT_MAP_DEFAULTS }), []);

  const hasVariantMapChange = useMemo(
    () =>
      VARIANT_FAMILY_KEYS.some((fk) =>
        getDefinedSlots(variantMapState[fk]).some(([slot, slotDef]) => {
          const d = VARIANT_MAP_DEFAULTS[fk].slots[slot];
          if (!d) return false;
          return (
            slotDef.weightToken !== d.weightToken ||
            slotDef.lineHeightToken !== d.lineHeightToken ||
            slotDef.letterSpacingOverride !== d.letterSpacingOverride
          );
        }),
      ),
    [variantMapState],
  );

  const hasSettingChange = useMemo(
    () =>
      WEIGHT_TOKEN_KEYS.some((k) => settingState.weights[k] !== SETTING_DEFAULTS.weights[k]) ||
      SIZE_TOKEN_KEYS.some((k) => settingState.letterSpacing[k] !== SETTING_DEFAULTS.letterSpacing[k]) ||
      LINE_HEIGHT_TOKEN_KEYS.some((k) => settingState.lineHeights[k] !== SETTING_DEFAULTS.lineHeights[k]),
    [settingState],
  );

  // One-time migration for sessions that still hold the old "all zero" letter-spacing defaults.
  // This preserves real user edits while updating untouched state to the new per-size defaults.
  useEffect(() => {
    const isOldZeroSpacingState = SIZE_TOKEN_KEYS.every((key) => settingState.letterSpacing[key] === 0);
    if (!isOldZeroSpacingState) return;
    setSettingState((prev) => ({
      ...prev,
      letterSpacing: { ...SETTING_DEFAULTS.letterSpacing },
    }));
  }, [settingState.letterSpacing]);

  // CSS overriding --aegis-internal-font-family-base from the Font Family tab.
  // This appears after fontFaceCss in injectedCss so it always wins.
  const fontFamilyOverrideCss = useMemo(() => {
    const value = toFontFamilyCss(activeFamilies);
    return \`:root {\\n  --aegis-internal-font-family-base: \${value};\\n}\`;
  }, [activeFamilies]);

  // Model CSS vars — uses activeFamilies (priority-ordered font stack) for --typo2-font-family.
  const modelVarsCss = useMemo(() => {
    const stateWithFont: SettingState = {
      ...settingState,
      fontFamily: { ...settingState.fontFamily, sans: { families: activeFamilies } },
    };
    return buildTypographyVarsCssFromModel(stateWithFont, variantMapState);
  }, [settingState, variantMapState, activeFamilies]);

  // Full injected CSS: @font-face + font-family override + static selectors (v2) + model vars.
  // When compareMode is on, inject nothing so Aegis renders with its own built-in styles.
  //
  // CSS layers (compare OFF):
  //   1. STATIC_TYPOGRAPHY_CSS_V2  — raw fixture compare ([data-typo-type="X"]; all 5 props)
  //   2. STATIC_AEGIS_CSS_V2       — Aegis component compare ([data-aegis-typography^="family."];
  //                                   weight / spacing / line-height only; no font-size)
  //   3. modelVarsCss              — --typo2-* custom property values from current Lab settings
  const injectedCss = useMemo(
    () =>
      compareMode
        ? ""
        : [fontFaceCss, fontFamilyOverrideCss, STATIC_TYPOGRAPHY_CSS_V2, STATIC_AEGIS_CSS_V2, modelVarsCss].join(
            "\\n\\n",
          ),
    [compareMode, fontFaceCss, fontFamilyOverrideCss, modelVarsCss],
  );

  // Preview Template — URL-persisted (?page=...) with localStorage fallback.
  const [previewPageId, setPreviewPageId] = useState<string>(() => {
    const urlPage = searchParams.get("page") ?? "";
    if (PREVIEW_PAGES.some((p) => p.id === urlPage)) return urlPage;
    const savedPage = persisted.previewPageId ?? "";
    return PREVIEW_PAGES.some((p) => p.id === savedPage) ? savedPage : "";
  });
  const selectedPreviewPage = useMemo(
    () => PREVIEW_PAGES.find((page) => page.id === previewPageId) ?? null,
    [previewPageId],
  );

  const previewPageOptions = useMemo(
    () => [
      { label: "None", value: "" },
      ...PREVIEW_PAGE_GROUPS.map((group) => ({
        options: group.pages.map((page) => ({
          label: page.label,
          value: page.id,
          meta: { category: group.category },
          body: (
            <ActionList.Body trailing={<ActionList.Description>{group.category}</ActionList.Description>}>
              {page.label}
            </ActionList.Body>
          ),
        })),
      })),
    ],
    [],
  );

  // Persist Lab state to localStorage whenever relevant state changes.
  // Reset functions update state which triggers this effect, so localStorage stays in sync.
  useEffect(() => {
    savePersistedState({
      settingState,
      variantMapState,
      fontPriority,
      previewPageId,
      compareMode,
      paneTabIndex,
      familyFilter,
      isSidebarOpen,
      fontFaceCss,
      paletteJson,
    });
  }, [
    settingState,
    variantMapState,
    fontPriority,
    previewPageId,
    compareMode,
    paneTabIndex,
    familyFilter,
    isSidebarOpen,
    fontFaceCss,
    paletteJson,
  ]);

  // Sync URL params whenever persisted state values change.
  // Uses replace:true to avoid polluting browser history with every toggle.
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("compare", String(compareMode));
        if (previewPageId) {
          next.set("page", previewPageId);
        } else {
          next.delete("page");
        }
        return next;
      },
      { replace: true },
    );
  }, [compareMode, previewPageId, setSearchParams]);

  // Export outputs — derived from current state.
  // Export uses settingState.fontFamily.sans.families directly (same as activeFamilies).
  const tokensJson = useMemo(() => buildTokensJson(settingState), [settingState]);
  const typographiesJs = useMemo(
    () => buildTypographiesJs(settingState, variantMapState),
    [settingState, variantMapState],
  );
  const activeExportContent = useMemo(() => {
    if (exportFormat === "json") return tokensJson;
    if (exportFormat === "js") return typographiesJs;
    return modelVarsCss;
  }, [exportFormat, tokensJson, typographiesJs, modelVarsCss]);

  // Copy the currently visible export format to clipboard.
  const copyActiveExport = () => {
    void navigator.clipboard.writeText(activeExportContent);
  };

  return (
    <Provider theme={themes[theme]} scale="full">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: @font-face from user input + generated override/base/vars; scoped to Typography Lab mount */}
      <style dangerouslySetInnerHTML={{ __html: injectedCss }} />
      {/*
       * data-typo-preview-root: compare scope covers the full Lab surface — both the preview area
       * (SidebarInset) and the settings sidebar (Sidebar). This means FormControl.Label, Select,
       * Button, Tab, and other elements inside the settings panel participate in compare mode.
       *
       * Template preview is protected separately: TYPE_ELEMENT_MAP uses [data-typo-type="X"]
       * fixture selectors rather than broad tag-name selectors, so Aegis components in template
       * preview (SegmentedControl, Pagination, Stepper, Text as="h3", etc.) are not targeted.
       *
       * Dialog is naturally excluded — Aegis Dialog renders into a portal outside this element.
       */}
      <div
        ref={outerRef}
        {...{ [PREVIEW_ROOT_ATTR]: "" }}
        style={{ position: "relative", height: "100%", ...(semanticTokenStyles as CSSProperties) }}
      >
        <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          {/*
           * SidebarInset: main preview area.
           * With behavior="push", content shifts inline when the settings sidebar opens.
           *
           * Template mode: PreviewComponent renders directly at the inset root — no wrapping
           * PageLayout, so the template's own header and layout fill the full surface without
           * any offset from Lab-level PageLayoutHeader or PageLayoutBody padding.
           *
           * Default mode: PageLayout with Lab header and RawPreview.
           */}
          <SidebarInset>
            <div style={{ position: "relative", height: "100%" }}>
              {previewPageId !== "" ? (
                // Template preview — render directly; outer PageLayout intentionally absent
                selectedPreviewPage ? (
                  <Suspense
                    fallback={
                      <div style={{ display: "flex", justifyContent: "center", padding: "var(--aegis-space-xLarge)" }}>
                        Loading...
                      </div>
                    }
                  >
                    {selectedPreviewPage.element}
                  </Suspense>
                ) : (
                  <div style={{ display: "flex", justifyContent: "center", padding: "var(--aegis-space-xLarge)" }}>
                    Loading...
                  </div>
                )
              ) : (
                <PageLayout>
                  <PageLayoutContent>
                    <PageLayoutBody>
                      <RawPreview />
                    </PageLayoutBody>
                  </PageLayoutContent>
                </PageLayout>
              )}

              {/*
               * Reopen trigger — shown only when sidebar is closed.
               * Fixed at the viewport top-right so it remains accessible in template
               * preview mode where the Lab header is hidden.
               */}
              {!isSidebarOpen && (
                <div
                  style={{
                    position: "fixed",
                    top: "var(--aegis-space-xLarge)",
                    right: "var(--aegis-space-xLarge)",
                    zIndex: "var(--aegis-zIndex-progressOverlay)",
                  }}
                >
                  <Tooltip title="Settings" placement="left">
                    <IconButton
                      size="small"
                      variant="solid"
                      aria-label="Open settings"
                      icon={LfLayoutFillRightAlt}
                      onClick={() => setIsSidebarOpen(true)}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          </SidebarInset>

          {/*
           * ── Typography Lab Settings Sidebar ──────────────────────────────────
           * side="inline-end": Aegis end-side pattern places Sidebar AFTER SidebarInset.
           * behavior="push": preview shifts inline when the sidebar is open.
           * collapsible="offcanvas": sidebar hides completely when closed (no icon rail).
           * Renders inside [data-typo-preview-root] so Lab CSS / compare mode apply here.
           */}
          <Sidebar
            side="inline-end"
            behavior={SIDEBAR_BEHAVIOR}
            collapsible="offcanvas"
            resizable
            width="medium"
            minWidth="medium"
          >
            <SidebarHeader>
              <ContentHeader trailing={<SidebarTrigger />}>
                <ContentHeaderTitle>Typography settings</ContentHeaderTitle>
              </ContentHeader>
            </SidebarHeader>
            <SidebarBody>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
                {/* Preview page selector */}
                <FormControl>
                  <FormControl.Label>Preview page</FormControl.Label>
                  <Combobox
                    aria-label="preview page"
                    placeholder="Select a template"
                    options={previewPageOptions}
                    filter={(query) => {
                      const normalizedQuery = query.trim().toLowerCase();
                      if (!normalizedQuery) return () => true;
                      return (option: { label: string; value: string; meta?: unknown }) => {
                        const category =
                          typeof option.meta === "object" && option.meta !== null && "category" in option.meta
                            ? String((option.meta as { category?: string }).category ?? "")
                            : "";
                        return [option.label, category].some((value) => value.toLowerCase().includes(normalizedQuery));
                      };
                    }}
                    value={previewPageId}
                    onChange={(value) => setPreviewPageId(value ?? "")}
                  />
                </FormControl>

                {/* Font priority */}
                <FormControl>
                  <FormControl.Label>Font priority</FormControl.Label>
                  <Select
                    aria-label="Japanese font priority"
                    options={FONT_PRIORITY_OPTIONS}
                    value={fontPriority}
                    disabled={compareMode}
                    onChange={(value) => handleFontPriorityChange(value as FontPriority)}
                  />
                </FormControl>

                <Checkbox size="small" checked={compareMode} onChange={(e) => setCompareMode(e.target.checked)}>
                  Compare Aegis defaults
                </Checkbox>

                <Divider style={{ backgroundColor: "var(--aegis-color-border-bold)" }} />

                {/* Sidebar tabs: Setting | Variant Map */}
                <Tab.Group index={paneTabIndex} onChange={setPaneTabIndex} size="small">
                  <Tab.List>
                    {PANE_TABS.map((tab) => (
                      <Tab key={tab}>{tab}</Tab>
                    ))}
                  </Tab.List>
                </Tab.Group>

                {/* ── Setting tab ─────────────────────────────────────────────── */}
                {activePaneTab === "Setting" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
                    {/* Weight tokens */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                      <SectionLabel>Weight tokens</SectionLabel>
                      <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", flexWrap: "wrap" }}>
                        {WEIGHT_TOKEN_KEYS.map((key) => (
                          <FormControl key={key} style={{ flex: "1 1 0", minWidth: 0 }}>
                            <FormControl.Label>{key}</FormControl.Label>
                            <Select
                              aria-label={\`weight \${key}\`}
                              options={WEIGHT_OPTIONS}
                              value={String(settingState.weights[key])}
                              onChange={(value) => updateWeight(key, Number(value))}
                            />
                          </FormControl>
                        ))}
                      </div>
                    </div>

                    <Divider />

                    {/* Letter-spacing per size token (absolute em values) */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                      <SectionLabel>Letter-spacing</SectionLabel>
                      {SIZE_TOKEN_KEYS.map((key) => (
                        <FormControl key={key}>
                          <FormControl.Label>{\`\${key} (\${SIZE_TOKEN_PX[key]}px)\`}</FormControl.Label>
                          <SliderWithField
                            value={settingState.letterSpacing[key]}
                            min={-0.05}
                            max={0.1}
                            step={0.005}
                            decimals={3}
                            onChange={(v) => updateLetterSpacing(key, v)}
                          />
                        </FormControl>
                      ))}
                    </div>

                    <Divider />

                    {/* Line-height tokens */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                      <SectionLabel>Line-height tokens</SectionLabel>
                      {LINE_HEIGHT_TOKEN_KEYS.map((key) => (
                        <FormControl key={key}>
                          <FormControl.Label>
                            {\`\${key}\${!LINE_HEIGHT_IS_AEGIS_OFFICIAL[key] ? " @lab" : ""}\`}
                          </FormControl.Label>
                          <SliderWithField
                            value={settingState.lineHeights[key]}
                            min={1.0}
                            max={2.5}
                            step={0.05}
                            decimals={2}
                            onChange={(v) => updateLineHeight(key, v)}
                          />
                        </FormControl>
                      ))}
                    </div>

                    <Button size="small" variant="gutterless" disabled={!hasSettingChange} onClick={resetSettings}>
                      Reset to defaults
                    </Button>
                  </div>
                )}

                {/* ── Variant Map tab ──────────────────────────────────────────── */}
                {activePaneTab === "Variant Map" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
                    {/* Family filter */}
                    <FormControl>
                      <FormControl.Label>Family</FormControl.Label>
                      <Select
                        aria-label="family filter"
                        options={FAMILY_FILTER_OPTIONS}
                        value={familyFilter}
                        onChange={(v) => setFamilyFilter(v as VariantFamilyKey | "")}
                      />
                    </FormControl>

                    {/* One section per family (filtered or all) */}
                    {(familyFilter ? [familyFilter as VariantFamilyKey] : VARIANT_FAMILY_KEYS).map((fk, fkIndex) => {
                      const familyDef = variantMapState[fk];
                      const slots = getDefinedSlots(familyDef);
                      return (
                        <div key={fk} style={{ display: "contents" }}>
                          {fkIndex > 0 && <Divider />}
                          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                            <SectionLabel>{VARIANT_FAMILY_LABELS[fk]}</SectionLabel>

                            {slots.map(([slot, slotDef]) => (
                              <div
                                key={slot}
                                style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}
                              >
                                {/* Weight + Line-height token selects — equal-width flex row */}
                                <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)" }}>
                                  <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                                    <FormControl style={{ width: "100%" }}>
                                      <FormControl.Label>Weight</FormControl.Label>
                                      <Select
                                        aria-label={\`\${fk} \${slot} weight token\`}
                                        options={WEIGHT_TOKEN_OPTIONS}
                                        value={slotDef.weightToken}
                                        onChange={(v) => updateSlotWeight(fk, slot, v as WeightTokenKey)}
                                        style={{ width: "100%" }}
                                      />
                                    </FormControl>
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                                    <FormControl style={{ width: "100%" }}>
                                      <FormControl.Label>Line-height</FormControl.Label>
                                      <Select
                                        aria-label={\`\${fk} \${slot} line-height token\`}
                                        options={LINE_HEIGHT_TOKEN_OPTIONS}
                                        value={slotDef.lineHeightToken}
                                        onChange={(v) => updateSlotLineHeight(fk, slot, v as LineHeightTokenKey)}
                                        style={{ width: "100%" }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>

                                {/* Letter-spacing: editable for component/data only */}
                                {familyDef.letterSpacingEditable && (
                                  <FormControl>
                                    <FormControl.Label>Letter-spacing</FormControl.Label>
                                    <SliderWithField
                                      value={
                                        slotDef.letterSpacingOverride ??
                                        settingState.letterSpacing[slotDef.sizeTokenKey]
                                      }
                                      min={-0.05}
                                      max={0.1}
                                      step={0.005}
                                      decimals={3}
                                      onChange={(v) => updateSlotLetterSpacing(fk, slot, v)}
                                    />
                                  </FormControl>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    <Button size="small" variant="gutterless" disabled={!hasVariantMapChange} onClick={resetVariantMap}>
                      Reset to defaults
                    </Button>
                  </div>
                )}
              </div>
            </SidebarBody>
            <SidebarFooter>
              <Button size="large" variant="solid" width="full" onClick={() => setIsDialogOpen(true)}>
                Tokens / Export
              </Button>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>

        {/* Token / Export dialog — declared here but renders via Aegis portal outside scope */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent
            width="large"
            style={{
              height: "70vh",
              maxHeight: "calc(100vh - 32px)",
              display: "grid",
              gridTemplateRows: "auto minmax(0, 1fr) auto",
            }}
          >
            <DialogHeader>
              <ContentHeader>
                <ContentHeaderTitle>Tokens / Export</ContentHeaderTitle>
              </ContentHeader>
            </DialogHeader>

            <div
              style={{
                display: "grid",
                gridTemplateRows: "auto minmax(0, 1fr)",
                gap: "var(--aegis-space-large)",
                paddingTop: "var(--aegis-space-small)",
                paddingInline: "var(--aegis-space-xLarge)",
                paddingBottom: "var(--aegis-space-small)",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <Tab.Group index={dialogTabIndex} onChange={setDialogTabIndex} size="medium">
                <Tab.List>
                  {DIALOG_TABS.map((tab) => (
                    <Tab key={tab}>{tab}</Tab>
                  ))}
                </Tab.List>
              </Tab.Group>

              <div
                style={{
                  position: "relative",
                  minHeight: 0,
                  height: "100%",
                  inlineSize: "100%",
                  maxInlineSize: "100%",
                  overflow: "hidden",
                }}
              >
                {/* ── Font Family tab: structured font stack editor ─────────── */}
                {activeDialogTab === "Font Family" ? (
                  <div
                    style={{
                      height: "100%",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-medium)",
                    }}
                  >
                    {/* Active stack label */}
                    <div>
                      <p
                        style={{
                          margin: "0 0 var(--aegis-space-xSmall)",
                          fontSize: "0.6875rem",
                          color: "var(--aegis-color-text-subtle)",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          fontWeight: 600,
                        }}
                      >
                        Sans — {fontPriority === "noto" ? "Noto-first" : "Hiragino-first"}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--aegis-color-text-subtle)" }}>
                        {toFontFamilyCss(activeFamilies)}
                      </p>
                    </div>

                    {/* Ordered font list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                      {settingState.fontFamily.sans.families.map((name, idx) => {
                        return (
                          <div
                            key={\`\${name}-\${String(idx)}\`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--aegis-space-xSmall)",
                              padding: "var(--aegis-space-xSmall) var(--aegis-space-small)",
                              border: "1px solid var(--aegis-color-border-default)",
                              borderRadius: "var(--aegis-radius-medium)",
                            }}
                          >
                            <span
                              style={{
                                flex: 1,
                                fontSize: "0.8125rem",
                                fontFamily: \`\${name.includes(" ") ? \`"\${name}"\` : name}, sans-serif\`,
                              }}
                            >
                              {name}
                            </span>
                            <IconButton
                              size="xSmall"
                              variant="plain"
                              disabled={idx === 0}
                              onClick={() => moveFontFamilyUp(idx)}
                              aria-label="Move up"
                            >
                              <LfArrowUp />
                            </IconButton>
                            <IconButton
                              size="xSmall"
                              variant="plain"
                              disabled={idx === settingState.fontFamily.sans.families.length - 1}
                              onClick={() => moveFontFamilyDown(idx)}
                              aria-label="Move down"
                            >
                              <LfArrowDown />
                            </IconButton>
                            <IconButton
                              size="xSmall"
                              variant="plain"
                              disabled={settingState.fontFamily.sans.families.length <= 1}
                              onClick={() => removeFontFamily(idx)}
                              aria-label="Remove"
                            >
                              <LfCloseLarge />
                            </IconButton>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add font */}
                    <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "flex-start" }}>
                      <TextField
                        size="small"
                        placeholder="Font name..."
                        value={newFontName}
                        style={{ flex: 1 }}
                        onChange={(e) => setNewFontName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addFontFamily();
                        }}
                      />
                      <Button size="small" variant="subtle" disabled={!newFontName.trim()} onClick={addFontFamily}>
                        Add
                      </Button>
                    </div>

                    <Button size="small" variant="gutterless" disabled={!hasFontFamilyChange} onClick={resetFontFamily}>
                      Reset to defaults
                    </Button>
                  </div>
                ) : activeDialogTab === "Typography CSS" ? (
                  /* ── Typography CSS tab: CSS / Tokens JSON / Typographies JS ── */
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-small)",
                    }}
                  >
                    {/* Sub-format selector */}
                    <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", flexShrink: 0 }}>
                      {EXPORT_FORMATS.map(({ label, value }) => (
                        <Button
                          key={value}
                          size="small"
                          variant={exportFormat === value ? "subtle" : "plain"}
                          onClick={() => setExportFormat(value)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                    {/* Textarea — needs position:relative parent for absolute-positioned dialogTextareaField */}
                    <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
                      <div className={styles.dialogTextareaField}>
                        <textarea className={styles.dialogTextareaInput} value={activeExportContent} readOnly />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── Textarea tabs: Palette / Font CSS ──────────────────────── */
                  <div className={styles.dialogTextareaField}>
                    {activeDialogTab === "Palette" ? (
                      <textarea
                        className={styles.dialogTextareaInput}
                        value={paletteJson}
                        onChange={(e) => setPaletteJson(e.target.value)}
                      />
                    ) : (
                      <textarea
                        className={styles.dialogTextareaInput}
                        value={fontFaceCss}
                        onChange={(e) => setFontFaceCss(e.target.value)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <ButtonGroup>
                <Button variant="plain" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {activeDialogTab === "Typography CSS" && (
                  <Button variant="subtle" onClick={copyActiveExport}>
                    {exportFormat === "json" ? "Copy JSON" : exportFormat === "js" ? "Copy JS" : "Copy CSS"}
                  </Button>
                )}
              </ButtonGroup>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Provider>
  );
};
`;export{e as default};