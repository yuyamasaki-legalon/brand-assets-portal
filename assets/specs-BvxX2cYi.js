var e=`// ContrastCheck spec definitions — component check items only.
// Page BG / Surface BG are runtime contexts; no static expansion is done here.

// ─── Types ────────────────────────────────────────────────────────────────────

export type RGB = [number, number, number];
export type DesignTokenOverrideCategory = "background" | "foreground" | "border";
export type ContrastCriterion = "text-normal" | "text-large" | "non-text";
export type ContrastRole = "foreground" | "background" | "border" | "outline";
export type SurfaceMode = "normal" | "inverse";
export type ContrastTarget = "componentBackground" | "currentSurface";

/**
 * A single atomic contrast check for a component.
 *
 * contrastTarget:
 *   "componentBackground" — fg vs component's own bg token (both defined here)
 *   "currentSurface"      — fg (or component surface) vs the Surface BG chosen in UI (bg omitted)
 *
 * surfaceMode:
 *   "normal"  — shown when a normal surface is selected (None, xSubtle, …)
 *   "inverse" — shown only when an inverse surface is selected (brand-bold, …)
 */
export interface ComponentCheckItem {
  id: string;
  component: string;
  variant?: string;
  state?: string;
  role: ContrastRole;
  label?: string;
  fg: { category: DesignTokenOverrideCategory; key: string };
  bg?: { category: "background"; key: string }; // only for contrastTarget: "componentBackground"
  criterion: ContrastCriterion;
  contrastTarget: ContrastTarget;
  surfaceMode: SurfaceMode;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const slugify = (s: string) => s.toLowerCase().replace(/[·\\s/]+/g, "-");

const item = (
  component: string,
  opts: {
    variant?: string;
    state?: string;
    role: ContrastRole;
    label?: string;
    fg: { category: DesignTokenOverrideCategory; key: string };
    bg?: { category: "background"; key: string };
    criterion: ContrastCriterion;
    contrastTarget: ContrastTarget;
    surfaceMode?: SurfaceMode;
  },
): ComponentCheckItem => {
  const { variant, state, role, label, fg, bg, criterion, contrastTarget, surfaceMode = "normal" } = opts;
  const id = [component, variant, state, role]
    .filter((s): s is string => Boolean(s))
    .map(slugify)
    .join("/");
  return { id, component, variant, state, role, label, fg, bg, criterion, contrastTarget, surfaceMode };
};

/** currentSurface foreground check — no bg needed */
const fgSurface = (
  component: string,
  variant: string,
  fgKey: string,
  criterion: ContrastCriterion,
  surfaceMode: SurfaceMode = "normal",
): ComponentCheckItem =>
  item(component, {
    variant,
    role: "foreground",
    fg: { category: "foreground", key: fgKey },
    criterion,
    contrastTarget: "currentSurface",
    surfaceMode,
  });

// ─── Text / Icon / Link / EmptyState ─────────────────────────────────────────

// Text audits static foreground tokens used as authored text color.
// Component-state tokens such as *-pressed are covered by component specs instead.
// xSubtle is excluded from text checks — scrollbar thumb only (non-text, 3:1 criterion).
// Do not use foreground.xSubtle for authored text content.
const TEXT_NORMAL_FOREGROUND_KEYS = [
  "default",
  "bold",
  "subtle",
  "brand",
  "disabled",
  "danger",
  "danger-bold",
  "information",
  "information-bold",
  "success",
  "success-bold",
  "warning-subtle",
  "warning",
  "warning-bold",
  "accent-gray-subtle",
  "accent-gray",
  "accent-blue-subtle",
  "accent-blue",
  "accent-blue-bold",
  "accent-yellow-subtle",
  "accent-yellow",
  "accent-yellow-bold",
  "accent-orange-subtle",
  "accent-orange",
  "accent-orange-bold",
  "accent-red-subtle",
  "accent-red",
  "accent-red-bold",
  "accent-purple-subtle",
  "accent-purple",
  "accent-purple-bold",
  "accent-lime-subtle",
  "accent-lime",
  "accent-lime-bold",
  "accent-teal-subtle",
  "accent-teal",
  "accent-teal-bold",
  "accent-indigo-subtle",
  "accent-indigo",
  "accent-indigo-bold",
  "accent-magenta-subtle",
  "accent-magenta",
  "accent-magenta-bold",
] as const;

const TEXT_CHECKS: ComponentCheckItem[] = [
  ...TEXT_NORMAL_FOREGROUND_KEYS.map((key) => fgSurface("Text", key, key, "text-normal")),
  fgSurface("Text", "inverse", "inverse", "text-normal", "inverse"),
];

const MARKUPTEXT_CHECKS: ComponentCheckItem[] = [
  fgSurface("Markdown Content", "default", "default", "text-normal"),
  fgSurface("Markdown Content", "subtle", "subtle", "text-normal"),
  fgSurface("Markdown Content", "danger", "danger", "text-normal"),
];

const LINK_CHECKS: ComponentCheckItem[] = [
  fgSurface("Link", "information", "information", "text-normal"),
  fgSurface("Link", "default", "default", "text-normal"),
  fgSurface("Link", "subtle", "subtle", "text-normal"),
  fgSurface("Link", "inverse", "inverse", "text-normal", "inverse"),
];

const ICON_CHECKS: ComponentCheckItem[] = [
  fgSurface("Icon", "default", "default", "non-text"),
  fgSurface("Icon", "subtle", "subtle", "non-text"),
  fgSurface("Icon", "brand", "brand", "non-text"),
  fgSurface("Icon", "danger", "danger", "non-text"),
  fgSurface("Icon", "success", "success", "non-text"),
  fgSurface("Icon", "warning", "warning", "non-text"),
  fgSurface("Icon", "information", "information", "non-text"),
  fgSurface("Icon", "inverse", "inverse", "non-text", "inverse"),
];

const EMPTYSTATE_CHECKS: ComponentCheckItem[] = [
  fgSurface("EmptyState", "title", "default", "text-normal"),
  fgSurface("EmptyState", "description", "subtle", "text-normal"),
];

// ─── FormControl ──────────────────────────────────────────────────────────────

const FORMCONTROL_CHECKS: ComponentCheckItem[] = [
  fgSurface("FormControl", "label", "default", "text-normal"),
  fgSurface("FormControl", "required", "danger", "text-normal"),
  fgSurface("FormControl", "caption", "subtle", "text-normal"),
  item("FormControl", {
    variant: "caption",
    state: "error",
    role: "foreground",
    fg: { category: "foreground", key: "danger" },
    criterion: "text-normal",
    contrastTarget: "currentSurface",
  }),
];

// ─── Input ────────────────────────────────────────────────────────────────────

const buildInputChecks = (component: string): ComponentCheckItem[] => [
  // Internal: fg vs component bg
  item(component, {
    variant: "default",
    state: "placeholder",
    role: "foreground",
    fg: { category: "foreground", key: "subtle" },
    bg: { category: "background", key: "input" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item(component, {
    variant: "default",
    state: "filled",
    role: "foreground",
    fg: { category: "foreground", key: "default" },
    bg: { category: "background", key: "input" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item(component, {
    variant: "hovered",
    state: "placeholder",
    role: "foreground",
    fg: { category: "foreground", key: "subtle" },
    bg: { category: "background", key: "input-hovered" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item(component, {
    variant: "hovered",
    state: "filled",
    role: "foreground",
    fg: { category: "foreground", key: "default" },
    bg: { category: "background", key: "input-hovered" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item(component, {
    variant: "error",
    state: "danger-text",
    role: "foreground",
    fg: { category: "foreground", key: "danger" },
    bg: { category: "background", key: "danger-subtle" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  // Border vs surface
  item(component, {
    variant: "default",
    state: "border",
    role: "border",
    fg: { category: "border", key: "input" },
    criterion: "non-text",
    contrastTarget: "currentSurface",
  }),
  item(component, {
    variant: "hovered",
    state: "border",
    role: "border",
    fg: { category: "border", key: "input-hovered" },
    criterion: "non-text",
    contrastTarget: "currentSurface",
  }),
  item(component, {
    variant: "focused",
    state: "border",
    role: "border",
    fg: { category: "border", key: "input-focused" },
    criterion: "non-text",
    contrastTarget: "currentSurface",
  }),
  item(component, {
    variant: "error",
    state: "border",
    role: "border",
    fg: { category: "border", key: "danger" },
    criterion: "non-text",
    contrastTarget: "currentSurface",
  }),
];

const INPUT_CHECKS = buildInputChecks("Input");
const TAGPICKER_CHECKS = buildInputChecks("TagPicker");

// ─── Button ───────────────────────────────────────────────────────────────────

type ButtonSolidSubtle = {
  variant: "solid" | "subtle";
  color: "neutral" | "danger" | "information" | "inverse";
  fgKey: string;
  bgBase: string;
};

const BUTTON_SOLID_SUBTLE: ReadonlyArray<ButtonSolidSubtle> = [
  { variant: "solid", color: "neutral", fgKey: "inverse", bgBase: "neutral-bold" },
  { variant: "solid", color: "danger", fgKey: "inverse", bgBase: "danger-bold" },
  { variant: "solid", color: "information", fgKey: "inverse", bgBase: "information-bold" },
  { variant: "solid", color: "inverse", fgKey: "default", bgBase: "inverse-bold" },
  { variant: "subtle", color: "neutral", fgKey: "default", bgBase: "neutral-subtle" },
  { variant: "subtle", color: "danger", fgKey: "danger", bgBase: "danger-subtle" },
  { variant: "subtle", color: "information", fgKey: "information", bgBase: "information-subtle" },
  { variant: "subtle", color: "inverse", fgKey: "inverse", bgBase: "inverse-subtle" },
];

type ButtonPlainGutterless = {
  variant: "plain" | "gutterless";
  color: "neutral" | "danger" | "information" | "inverse";
  fgKey: string;
};

const BUTTON_PLAIN_GUTTERLESS: ReadonlyArray<ButtonPlainGutterless> = [
  { variant: "plain", color: "neutral", fgKey: "default" },
  { variant: "plain", color: "danger", fgKey: "danger" },
  { variant: "plain", color: "information", fgKey: "information" },
  { variant: "plain", color: "inverse", fgKey: "inverse" },
  { variant: "gutterless", color: "neutral", fgKey: "default" },
  { variant: "gutterless", color: "danger", fgKey: "danger" },
  { variant: "gutterless", color: "inverse", fgKey: "inverse" },
];

const buildButtonSolidSubtleChecks = (component: string): ComponentCheckItem[] => {
  const checks: ComponentCheckItem[] = [];
  for (const v of BUTTON_SOLID_SUBTLE) {
    const variantKey = \`\${v.variant}·\${v.color}\`;
    const surfaceMode: SurfaceMode = v.color === "inverse" ? "inverse" : "normal";
    for (const state of ["default", "hovered", "pressed"] as const) {
      const bgKey = state === "default" ? v.bgBase : \`\${v.bgBase}-\${state}\`;
      // Foreground vs component bg (text readability)
      checks.push(
        item(component, {
          variant: variantKey,
          state,
          role: "foreground",
          fg: { category: "foreground", key: v.fgKey },
          bg: { category: "background", key: bgKey },
          criterion: "text-normal",
          contrastTarget: "componentBackground",
          surfaceMode,
        }),
      );
      // Solid only: component bg visibility vs surface
      if (v.variant === "solid") {
        checks.push(
          item(component, {
            variant: variantKey,
            state,
            role: "background",
            fg: { category: "background", key: bgKey },
            criterion: "non-text",
            contrastTarget: "currentSurface",
            surfaceMode,
          }),
        );
      }
    }
  }
  return checks;
};

const buildButtonPlainGutterlessChecks = (component: string): ComponentCheckItem[] =>
  BUTTON_PLAIN_GUTTERLESS.map(({ variant, color, fgKey }) => {
    const surfaceMode: SurfaceMode = color === "inverse" ? "inverse" : "normal";
    return item(component, {
      variant: \`\${variant}·\${color}\`,
      state: "default",
      role: "foreground",
      fg: { category: "foreground", key: fgKey },
      criterion: "text-normal",
      contrastTarget: "currentSurface",
      surfaceMode,
    });
  });

const BUTTON_CHECKS: ComponentCheckItem[] = [
  ...buildButtonSolidSubtleChecks("Button"),
  ...buildButtonPlainGutterlessChecks("Button"),
];

// ─── IconButton ───────────────────────────────────────────────────────────────

const ICONBUTTON_PLAIN: ReadonlyArray<ButtonPlainGutterless> = [
  { variant: "plain", color: "neutral", fgKey: "default" },
  { variant: "plain", color: "danger", fgKey: "danger" },
  { variant: "plain", color: "information", fgKey: "information" },
  { variant: "plain", color: "inverse", fgKey: "inverse" },
];

const ICONBUTTON_CHECKS: ComponentCheckItem[] = [
  ...buildButtonSolidSubtleChecks("IconButton"),
  ...ICONBUTTON_PLAIN.map(({ variant, color, fgKey }) =>
    item("IconButton", {
      variant: \`\${variant}·\${color}\`,
      state: "default",
      role: "foreground",
      fg: { category: "foreground", key: fgKey },
      criterion: "non-text",
      contrastTarget: "currentSurface",
      surfaceMode: color === "inverse" ? "inverse" : "normal",
    }),
  ),
];

// ─── Switch ───────────────────────────────────────────────────────────────────

const SWITCH_CHECKS: ComponentCheckItem[] = [
  // Internal: knob vs track
  item("Switch", {
    variant: "neutral·off",
    state: "default",
    role: "foreground",
    fg: { category: "foreground", key: "inverse" },
    bg: { category: "background", key: "input-bold" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  item("Switch", {
    variant: "neutral·on",
    state: "checked",
    role: "foreground",
    fg: { category: "foreground", key: "inverse" },
    bg: { category: "background", key: "selected-bold" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  item("Switch", {
    variant: "information·on",
    state: "checked",
    role: "foreground",
    fg: { category: "foreground", key: "inverse" },
    bg: { category: "background", key: "information-bold" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  // Track visibility vs surface
  item("Switch", {
    variant: "neutral·off",
    state: "default",
    role: "background",
    fg: { category: "background", key: "input-bold" },
    criterion: "non-text",
    contrastTarget: "currentSurface",
  }),
  item("Switch", {
    variant: "neutral·on",
    state: "checked",
    role: "background",
    fg: { category: "background", key: "selected-bold" },
    criterion: "non-text",
    contrastTarget: "currentSurface",
  }),
  item("Switch", {
    variant: "information·on",
    state: "checked",
    role: "background",
    fg: { category: "background", key: "information-bold" },
    criterion: "non-text",
    contrastTarget: "currentSurface",
  }),
  // Label vs surface
  fgSurface("Switch", "label", "default", "text-normal"),
];

// ─── Checkbox ─────────────────────────────────────────────────────────────────

const CHECKBOX_COLORS = [
  { color: "neutral", borderKey: "input", borderHoveredKey: "input-hovered", fillKey: "selected-bold" },
  { color: "warning", borderKey: "warning-bold", borderHoveredKey: "warning-bold", fillKey: "warning-bold" },
  { color: "danger", borderKey: "danger-bold", borderHoveredKey: "danger-bold", fillKey: "danger-bold" },
] as const;

const CHECKBOX_CHECKS: ComponentCheckItem[] = [
  // Internal: checkmark vs fill
  ...CHECKBOX_COLORS.map(({ color, fillKey }) =>
    item("Checkbox", {
      variant: color,
      state: "checked",
      role: "foreground",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: fillKey },
      criterion: "non-text",
      contrastTarget: "componentBackground",
    }),
  ),
  // Border vs surface
  ...CHECKBOX_COLORS.flatMap(({ color, borderKey, borderHoveredKey, fillKey }) => [
    item("Checkbox", {
      variant: color,
      state: "default",
      role: "border",
      fg: { category: "border", key: borderKey },
      criterion: "non-text",
      contrastTarget: "currentSurface",
    }),
    item("Checkbox", {
      variant: color,
      state: "hovered",
      role: "border",
      fg: { category: "border", key: borderHoveredKey },
      criterion: "non-text",
      contrastTarget: "currentSurface",
    }),
    // Fill surface visibility
    item("Checkbox", {
      variant: color,
      state: "checked",
      role: "background",
      fg: { category: "background", key: fillKey },
      criterion: "non-text",
      contrastTarget: "currentSurface",
    }),
  ]),
  // Label
  fgSurface("Checkbox", "label", "default", "text-normal"),
];

// ─── CheckboxCard ─────────────────────────────────────────────────────────────

const CHECKBOX_CARD_VARIANTS = [
  { color: "neutral", bodyBg: "neutral-subtlest", borderChecked: "selected" },
  { color: "gray", bodyBg: "accent-gray-subtlest", borderChecked: "selected" },
  { color: "warning", bodyBg: "warning-subtlest", borderChecked: "warning-bold" },
  { color: "danger", bodyBg: "danger-subtlest", borderChecked: "danger-bold" },
] as const;

const CHECKBOX_CARD_FILL_KEYS = {
  neutral: "selected-bold",
  gray: "selected-bold",
  warning: "warning-bold",
  danger: "danger-bold",
} as const;

const CHECKBOX_CARD_CHECKS: ComponentCheckItem[] = [
  // Checked fill internals (checkbox mark on fill)
  ...CHECKBOX_CARD_VARIANTS.map(({ color }) =>
    item("CheckboxCard", {
      variant: \`\${color}·plain\`,
      state: "checked",
      role: "foreground",
      fg: { category: "foreground", key: "inverse" },
      bg: { category: "background", key: CHECKBOX_CARD_FILL_KEYS[color] },
      criterion: "non-text",
      contrastTarget: "componentBackground",
    }),
  ),
  // Body text on card bg
  ...CHECKBOX_CARD_VARIANTS.map(({ color, bodyBg }) =>
    item("CheckboxCard", {
      variant: color,
      state: "default",
      role: "foreground",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: bodyBg },
      criterion: "text-normal",
      contrastTarget: "componentBackground",
    }),
  ),
  // Border checked vs surface
  ...CHECKBOX_CARD_VARIANTS.map(({ color, borderChecked }) =>
    item("CheckboxCard", {
      variant: color,
      state: "checked",
      role: "border",
      fg: { category: "border", key: borderChecked },
      criterion: "non-text",
      contrastTarget: "currentSurface",
    }),
  ),
];

// ─── Calendar ─────────────────────────────────────────────────────────────────

const CALENDAR_CHECKS: ComponentCheckItem[] = [
  item("Calendar", {
    variant: "date",
    state: "default",
    role: "foreground",
    fg: { category: "foreground", key: "default" },
    bg: { category: "background", key: "default" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item("Calendar", {
    variant: "date",
    state: "hovered",
    role: "foreground",
    fg: { category: "foreground", key: "default" },
    bg: { category: "background", key: "neutral-subtlest-hovered" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item("Calendar", {
    variant: "date",
    state: "selected",
    role: "foreground",
    fg: { category: "foreground", key: "inverse" },
    bg: { category: "background", key: "information-bold" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item("Calendar", {
    variant: "today-indicator",
    state: "default",
    role: "border",
    fg: { category: "border", key: "input-focused" },
    bg: { category: "background", key: "default" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  // Selected cell visibility vs surface
  item("Calendar", {
    variant: "selected-cell",
    state: "selected",
    role: "background",
    fg: { category: "background", key: "information-bold" },
    criterion: "non-text",
    contrastTarget: "currentSurface",
  }),
];

// ─── Tooltip ──────────────────────────────────────────────────────────────────

const TOOLTIP_CHECKS: ComponentCheckItem[] = [
  item("Tooltip", {
    variant: "default",
    state: "default",
    role: "foreground",
    fg: { category: "foreground", key: "inverse" },
    bg: { category: "background", key: "neutral-bold" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
];

// ─── Banner ───────────────────────────────────────────────────────────────────

const BANNER_MEDIUM_VARIANTS = [
  { color: "information", fgKey: "information-bold", bgKey: "information-subtle" },
  { color: "success", fgKey: "success-bold", bgKey: "success-subtle" },
  { color: "warning", fgKey: "warning-bold", bgKey: "warning" },
  { color: "danger", fgKey: "danger-bold", bgKey: "danger" },
] as const;

const BANNER_LARGE_VARIANTS = [
  { color: "information", fgKey: "inverse", bgKey: "information-bold" },
  { color: "success", fgKey: "inverse", bgKey: "success-bold" },
  { color: "warning", fgKey: "bold", bgKey: "warning-bold" },
  { color: "danger", fgKey: "inverse", bgKey: "danger-bold" },
] as const;

const BANNER_CHECKS: ComponentCheckItem[] = [
  ...BANNER_MEDIUM_VARIANTS.flatMap(({ color, fgKey, bgKey }) => [
    item("Banner", {
      variant: \`\${color}·medium\`,
      state: "text",
      role: "foreground",
      fg: { category: "foreground", key: fgKey },
      bg: { category: "background", key: bgKey },
      criterion: "text-normal",
      contrastTarget: "componentBackground",
    }),
    item("Banner", {
      variant: \`\${color}·medium\`,
      state: "icon",
      role: "foreground",
      fg: { category: "foreground", key: fgKey },
      bg: { category: "background", key: bgKey },
      criterion: "non-text",
      contrastTarget: "componentBackground",
    }),
  ]),
  ...BANNER_LARGE_VARIANTS.flatMap(({ color, fgKey, bgKey }) => [
    item("Banner", {
      variant: \`\${color}·large\`,
      state: "text",
      role: "foreground",
      fg: { category: "foreground", key: fgKey },
      bg: { category: "background", key: bgKey },
      criterion: "text-normal",
      contrastTarget: "componentBackground",
    }),
    item("Banner", {
      variant: \`\${color}·large\`,
      state: "icon",
      role: "foreground",
      fg: { category: "foreground", key: fgKey },
      bg: { category: "background", key: bgKey },
      criterion: "non-text",
      contrastTarget: "componentBackground",
    }),
  ]),
];

// ─── Snackbar ─────────────────────────────────────────────────────────────────

const SNACKBAR_CHECKS: ComponentCheckItem[] = [
  item("Snackbar", {
    variant: "neutral",
    state: "message",
    role: "foreground",
    fg: { category: "foreground", key: "inverse" },
    bg: { category: "background", key: "neutral-bold" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item("Snackbar", {
    variant: "neutral",
    state: "action",
    role: "foreground",
    fg: { category: "foreground", key: "inverse" },
    bg: { category: "background", key: "neutral-bold" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item("Snackbar", {
    variant: "danger",
    state: "message",
    role: "foreground",
    fg: { category: "foreground", key: "inverse" },
    bg: { category: "background", key: "danger-bold" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item("Snackbar", {
    variant: "danger",
    state: "action",
    role: "foreground",
    fg: { category: "foreground", key: "inverse" },
    bg: { category: "background", key: "danger-bold" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
];

// ─── FileDrop ─────────────────────────────────────────────────────────────────

const FILEDROP_CHECKS: ComponentCheckItem[] = [
  item("FileDrop", {
    variant: "default",
    state: "placeholder",
    role: "foreground",
    fg: { category: "foreground", key: "default" },
    bg: { category: "background", key: "neutral-xSubtle" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item("FileDrop", {
    variant: "drag-active",
    state: "placeholder",
    role: "foreground",
    fg: { category: "foreground", key: "information" },
    bg: { category: "background", key: "information" },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item("FileDrop", {
    variant: "default",
    state: "border",
    role: "border",
    fg: { category: "border", key: "neutral" },
    criterion: "non-text",
    contrastTarget: "currentSurface",
  }),
  item("FileDrop", {
    variant: "drag-active",
    state: "border",
    role: "border",
    fg: { category: "border", key: "information-bold" },
    criterion: "non-text",
    contrastTarget: "currentSurface",
  }),
];

// ─── Badge ────────────────────────────────────────────────────────────────────

const BADGE_VARIANTS = [
  { color: "neutral", fgKey: "inverse", bgKey: "neutral-bold", surfaceMode: "normal" },
  { color: "danger", fgKey: "inverse", bgKey: "danger-bold", surfaceMode: "normal" },
  { color: "subtle", fgKey: "bold", bgKey: "neutral-opaque", surfaceMode: "normal" },
  { color: "success", fgKey: "inverse", bgKey: "success-bold", surfaceMode: "normal" },
  { color: "information", fgKey: "inverse", bgKey: "information-bold", surfaceMode: "normal" },
  { color: "warning", fgKey: "bold", bgKey: "warning-bold", surfaceMode: "normal" },
  { color: "inverse", fgKey: "bold", bgKey: "inverse-bold", surfaceMode: "inverse" },
] as const;

const BADGE_CHECKS: ComponentCheckItem[] = BADGE_VARIANTS.flatMap(({ color, fgKey, bgKey, surfaceMode }) => [
  item("Badge", {
    variant: color,
    state: "text",
    role: "foreground",
    fg: { category: "foreground", key: fgKey },
    bg: { category: "background", key: bgKey },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
    surfaceMode,
  }),
  item("Badge", {
    variant: color,
    state: "surface",
    role: "background",
    fg: { category: "background", key: bgKey },
    criterion: "non-text",
    contrastTarget: "currentSurface",
    surfaceMode,
  }),
]);

// ─── ProgressBar / ProgressCircle / ProgressOverlay ──────────────────────────

const PROGRESS_BAR_CHECKS: ComponentCheckItem[] = [
  item("ProgressBar", {
    variant: "information·default",
    state: "bar",
    role: "foreground",
    fg: { category: "foreground", key: "information" },
    bg: { category: "background", key: "neutral-subtle" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  item("ProgressBar", {
    variant: "information·opaque",
    state: "bar",
    role: "foreground",
    fg: { category: "foreground", key: "information" },
    bg: { category: "background", key: "neutral-subtle-opaque" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  item("ProgressBar", {
    variant: "danger·default",
    state: "bar",
    role: "foreground",
    fg: { category: "foreground", key: "danger" },
    bg: { category: "background", key: "neutral-subtle" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  item("ProgressBar", {
    variant: "danger·opaque",
    state: "bar",
    role: "foreground",
    fg: { category: "foreground", key: "danger" },
    bg: { category: "background", key: "neutral-subtle-opaque" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  item("ProgressBar", {
    variant: "disabled·default",
    state: "bar",
    role: "foreground",
    fg: { category: "foreground", key: "disabled" },
    bg: { category: "background", key: "neutral-subtle" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  item("ProgressBar", {
    variant: "disabled·opaque",
    state: "bar",
    role: "foreground",
    fg: { category: "foreground", key: "disabled" },
    bg: { category: "background", key: "neutral-subtle-opaque" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
];

const PROGRESS_CIRCLE_CHECKS: ComponentCheckItem[] = [
  item("ProgressCircle", {
    variant: "normal",
    state: "indicator",
    role: "foreground",
    fg: { category: "foreground", key: "information" },
    bg: { category: "background", key: "neutral-subtle" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
];

const PROGRESS_OVERLAY_CHECKS: ComponentCheckItem[] = [
  item("ProgressOverlay", {
    variant: "bar",
    state: "indicator",
    role: "foreground",
    fg: { category: "foreground", key: "information" },
    bg: { category: "background", key: "neutral-subtle-opaque" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
];

// ─── StatusLabel ──────────────────────────────────────────────────────────────

const STATUS_LABEL_COLORS = [
  { color: "neutral", textFg: "default", dotFg: "xSubtle" },
  { color: "red", textFg: "accent-red", dotFg: "accent-red" },
  { color: "yellow", textFg: "accent-yellow", dotFg: "accent-yellow" },
  { color: "blue", textFg: "accent-blue", dotFg: "accent-blue" },
  { color: "teal", textFg: "accent-teal", dotFg: "accent-teal" },
  { color: "gray", textFg: "accent-gray", dotFg: "accent-gray" },
  { color: "purple", textFg: "accent-purple", dotFg: "accent-purple" },
  { color: "magenta", textFg: "accent-magenta", dotFg: "accent-magenta" },
  { color: "orange", textFg: "accent-orange", dotFg: "accent-orange" },
  { color: "lime", textFg: "accent-lime", dotFg: "accent-lime" },
  { color: "indigo", textFg: "accent-indigo", dotFg: "accent-indigo" },
] as const;

const STATUS_LABEL_CHECKS: ComponentCheckItem[] = STATUS_LABEL_COLORS.flatMap(({ color, textFg, dotFg }) => [
  item("StatusLabel", {
    variant: "text",
    state: color,
    role: "foreground",
    fg: { category: "foreground", key: textFg },
    criterion: "text-normal",
    contrastTarget: "currentSurface",
  }),
  item("StatusLabel", {
    variant: "dot",
    state: color,
    role: "foreground",
    fg: { category: "foreground", key: dotFg },
    criterion: "non-text",
    contrastTarget: "currentSurface",
  }),
]);

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_VARIANTS = [
  { color: "subtle", fgKey: "default", bgKey: "neutral-subtle-opaque" },
  { color: "brand", fgKey: "inverse", bgKey: "brand-bold" },
  { color: "red", fgKey: "inverse", bgKey: "accent-red-bold" },
  { color: "orange", fgKey: "inverse", bgKey: "accent-orange-bold" },
  { color: "teal", fgKey: "inverse", bgKey: "accent-teal-bold" },
  { color: "indigo", fgKey: "inverse", bgKey: "accent-indigo-bold" },
  { color: "blue", fgKey: "inverse", bgKey: "accent-blue-bold" },
  { color: "purple", fgKey: "inverse", bgKey: "accent-purple-bold" },
  { color: "magenta", fgKey: "inverse", bgKey: "accent-magenta-bold" },
] as const;

const AVATAR_CHECKS: ComponentCheckItem[] = AVATAR_VARIANTS.flatMap(({ color, fgKey, bgKey }) => [
  // Initials vs avatar bg
  item("Avatar", {
    variant: color,
    state: "text",
    role: "foreground",
    fg: { category: "foreground", key: fgKey },
    bg: { category: "background", key: bgKey },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  // Avatar surface vs page surface
  item("Avatar", {
    variant: color,
    state: "surface",
    role: "background",
    fg: { category: "background", key: bgKey },
    criterion: "non-text",
    contrastTarget: "currentSurface",
  }),
]);

// ─── Mark ─────────────────────────────────────────────────────────────────────

const MARK_COLORS = [
  { color: "red", bgSubtle: "accent-red-subtle", bgXSubtle: "accent-red-xSubtle", textSubtle: "accent-red-subtle" },
  {
    color: "orange",
    bgSubtle: "accent-orange-subtle",
    bgXSubtle: "accent-orange-xSubtle",
    textSubtle: "accent-orange-subtle",
  },
  {
    color: "yellow",
    bgSubtle: "accent-yellow-subtle",
    bgXSubtle: "accent-yellow-xSubtle",
    textSubtle: "accent-yellow-subtle",
  },
  { color: "teal", bgSubtle: "accent-teal-subtle", bgXSubtle: "accent-teal-xSubtle", textSubtle: "accent-teal-subtle" },
  { color: "blue", bgSubtle: "accent-blue-subtle", bgXSubtle: "accent-blue-xSubtle", textSubtle: "accent-blue-subtle" },
  {
    color: "indigo",
    bgSubtle: "accent-indigo-subtle",
    bgXSubtle: "accent-indigo-xSubtle",
    textSubtle: "accent-indigo-subtle",
  },
  {
    color: "purple",
    bgSubtle: "accent-purple-subtle",
    bgXSubtle: "accent-purple-xSubtle",
    textSubtle: "accent-purple-subtle",
  },
  {
    color: "magenta",
    bgSubtle: "accent-magenta-subtle",
    bgXSubtle: "accent-magenta-xSubtle",
    textSubtle: "accent-magenta-subtle",
  },
  {
    color: "gray",
    bgSubtle: "accent-gray-xSubtle",
    bgXSubtle: "accent-gray-xxSubtle",
    textSubtle: "accent-gray-subtle",
  },
] as const;

const MARK_CHECKS: ComponentCheckItem[] = MARK_COLORS.flatMap(({ color, bgSubtle, bgXSubtle, textSubtle }) => [
  // background style
  item("Mark", {
    variant: \`\${color}·background\`,
    state: "default",
    role: "foreground",
    fg: { category: "foreground", key: "default" },
    bg: { category: "background", key: bgSubtle },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item("Mark", {
    variant: \`\${color}·background\`,
    state: "withText",
    role: "foreground",
    fg: { category: "foreground", key: textSubtle },
    bg: { category: "background", key: bgSubtle },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  // underline style
  item("Mark", {
    variant: \`\${color}·underline\`,
    state: "default",
    role: "foreground",
    fg: { category: "foreground", key: "default" },
    bg: { category: "background", key: bgXSubtle },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
  item("Mark", {
    variant: \`\${color}·underline\`,
    state: "withText",
    role: "foreground",
    fg: { category: "foreground", key: textSubtle },
    bg: { category: "background", key: bgXSubtle },
    criterion: "text-normal",
    contrastTarget: "componentBackground",
  }),
]);

// ─── Tag ──────────────────────────────────────────────────────────────────────

const TAG_NEUTRAL_INVERSE = [
  { variant: "outline·neutral", fgKey: "default", bgKey: "neutral-subtlest", surfaceMode: "normal" },
  { variant: "fill·neutral", fgKey: "default", bgKey: "neutral-subtle", surfaceMode: "normal" },
  { variant: "outline·inverse", fgKey: "inverse-subtle", bgKey: "inverse-subtlest", surfaceMode: "inverse" },
  { variant: "fill·inverse", fgKey: "inverse", bgKey: "inverse-subtle", surfaceMode: "inverse" },
] as const;

const TAG_ACCENT_COLORS = [
  {
    color: "red",
    outlineFg: "accent-red",
    outlineBg: "accent-red-subtlest",
    fillFg: "accent-red-bold",
    fillBg: "accent-red-subtle",
  },
  {
    color: "yellow",
    outlineFg: "accent-yellow",
    outlineBg: "accent-yellow-subtlest",
    fillFg: "accent-yellow-bold",
    fillBg: "accent-yellow-subtle",
  },
  {
    color: "blue",
    outlineFg: "accent-blue",
    outlineBg: "accent-blue-subtlest",
    fillFg: "accent-blue-bold",
    fillBg: "accent-blue-subtle",
  },
  {
    color: "teal",
    outlineFg: "accent-teal",
    outlineBg: "accent-teal-subtlest",
    fillFg: "accent-teal-bold",
    fillBg: "accent-teal-subtle",
  },
  {
    color: "purple",
    outlineFg: "accent-purple",
    outlineBg: "accent-purple-subtlest",
    fillFg: "accent-purple-bold",
    fillBg: "accent-purple-subtle",
  },
  {
    color: "magenta",
    outlineFg: "accent-magenta",
    outlineBg: "accent-magenta-subtlest",
    fillFg: "accent-magenta-bold",
    fillBg: "accent-magenta-subtle",
  },
  {
    color: "orange",
    outlineFg: "accent-orange",
    outlineBg: "accent-orange-subtlest",
    fillFg: "accent-orange-bold",
    fillBg: "accent-orange-subtle",
  },
  {
    color: "lime",
    outlineFg: "accent-lime",
    outlineBg: "accent-lime-subtlest",
    fillFg: "accent-lime-bold",
    fillBg: "accent-lime-subtle",
  },
  {
    color: "indigo",
    outlineFg: "accent-indigo",
    outlineBg: "accent-indigo-subtlest",
    fillFg: "accent-indigo-bold",
    fillBg: "accent-indigo-subtle",
  },
] as const;

const TAG_CHECKS: ComponentCheckItem[] = [
  ...TAG_NEUTRAL_INVERSE.map(({ variant, fgKey, bgKey, surfaceMode }) =>
    item("Tag", {
      variant,
      state: "text",
      role: "foreground",
      fg: { category: "foreground", key: fgKey },
      bg: { category: "background", key: bgKey },
      criterion: "text-normal",
      contrastTarget: "componentBackground",
      surfaceMode,
    }),
  ),
  ...TAG_ACCENT_COLORS.flatMap(({ color, outlineFg, outlineBg, fillFg, fillBg }) => [
    item("Tag", {
      variant: \`outline·\${color}\`,
      state: "text",
      role: "foreground",
      fg: { category: "foreground", key: outlineFg },
      bg: { category: "background", key: outlineBg },
      criterion: "text-normal",
      contrastTarget: "componentBackground",
    }),
    item("Tag", {
      variant: \`fill·\${color}\`,
      state: "text",
      role: "foreground",
      fg: { category: "foreground", key: fillFg },
      bg: { category: "background", key: fillBg },
      criterion: "text-normal",
      contrastTarget: "componentBackground",
    }),
  ]),
];

// ─── ActionList ───────────────────────────────────────────────────────────────

const ACTION_LIST_CHECKS: ComponentCheckItem[] = [
  ...["default", "hovered", "pressed"].flatMap((state) => [
    item("ActionList", {
      variant: "neutral",
      state,
      role: "foreground",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: state === "default" ? "neutral-subtlest" : \`neutral-subtlest-\${state}\` },
      criterion: "text-normal",
      contrastTarget: "componentBackground",
    }),
    item("ActionList", {
      variant: "danger",
      state,
      role: "foreground",
      fg: { category: "foreground", key: "danger" },
      bg: {
        category: "background",
        key: state === "default" ? "danger-subtlest" : \`danger-subtlest-\${state}\`,
      },
      criterion: "text-normal",
      contrastTarget: "componentBackground",
    }),
  ]),
  fgSurface("ActionList", "neutral", "default", "text-normal"),
  fgSurface("ActionList", "danger", "danger", "text-normal"),
];

// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEPPER_CHECKS: ComponentCheckItem[] = [
  item("Stepper", {
    variant: "normal",
    state: "icon",
    role: "foreground",
    fg: { category: "foreground", key: "default" },
    bg: { category: "background", key: "neutral-subtlest" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  item("Stepper", {
    variant: "completed",
    state: "icon",
    role: "foreground",
    fg: { category: "foreground", key: "inverse" },
    bg: { category: "background", key: "neutral-bold" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  item("Stepper", {
    variant: "current",
    state: "icon",
    role: "foreground",
    fg: { category: "foreground", key: "default" },
    bg: { category: "background", key: "neutral-subtlest-pressed" },
    criterion: "non-text",
    contrastTarget: "componentBackground",
  }),
  fgSurface("Stepper", "title", "default", "text-normal"),
  item("Stepper", {
    variant: "title",
    state: "error",
    role: "foreground",
    fg: { category: "foreground", key: "danger" },
    criterion: "text-normal",
    contrastTarget: "currentSurface",
  }),
];

// ─── Scrollbar ────────────────────────────────────────────────────────────────

// foreground.xSubtle (neutral.500, L=55.2) is used exclusively for the scrollbar thumb.
// Criterion: Non-text Contrast (WCAG 1.4.11, 3:1). Not for authored text.
const SCROLLBAR_CHECKS: ComponentCheckItem[] = [fgSurface("Scrollbar", "thumb", "xSubtle", "non-text")];

// ─── COMPONENT_CHECKS ─────────────────────────────────────────────────────────

export const COMPONENT_CHECKS: ComponentCheckItem[] = [
  ...TEXT_CHECKS,
  ...MARKUPTEXT_CHECKS,
  ...LINK_CHECKS,
  ...ICON_CHECKS,
  ...EMPTYSTATE_CHECKS,
  ...FORMCONTROL_CHECKS,
  ...INPUT_CHECKS,
  ...TAGPICKER_CHECKS,
  ...BUTTON_CHECKS,
  ...ICONBUTTON_CHECKS,
  ...SWITCH_CHECKS,
  ...CHECKBOX_CHECKS,
  ...CHECKBOX_CARD_CHECKS,
  ...CALENDAR_CHECKS,
  ...TOOLTIP_CHECKS,
  ...BANNER_CHECKS,
  ...SNACKBAR_CHECKS,
  ...FILEDROP_CHECKS,
  ...BADGE_CHECKS,
  ...PROGRESS_BAR_CHECKS,
  ...PROGRESS_CIRCLE_CHECKS,
  ...PROGRESS_OVERLAY_CHECKS,
  ...STATUS_LABEL_CHECKS,
  ...AVATAR_CHECKS,
  ...MARK_CHECKS,
  ...TAG_CHECKS,
  ...ACTION_LIST_CHECKS,
  ...STEPPER_CHECKS,
  ...SCROLLBAR_CHECKS,
];
`;export{e as default};