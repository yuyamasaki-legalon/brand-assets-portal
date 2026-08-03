var e=`/**
 * buildComponentJsxText.ts
 *
 * Converts ContentItem objects into JSX string snippets for the Generated Files dialog.
 * Each component builder mirrors the rendering logic of ComponentRenderer.tsx,
 * but outputs static JSX code strings instead of React elements.
 *
 * Design decisions:
 * - Omit props that match Aegis/sandbox defaults to keep output minimal.
 * - Props stored as "true"/"false" strings are emitted as bare boolean attributes.
 * - Icons are emitted as \`<Icon><IconName /></Icon>\` with import tracking.
 * - Complex components (DataTable, Toolbar, SideNavigation) emit structural templates.
 */

import { TREE_LABEL_DEFAULT } from "./views/AddContentView/fieldConfig/Tree";
import type { ContentItem } from "./views/AddContentView/types";

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

type Props = Record<string, string> | undefined;

/** Get string value with fallback */
function pv(props: Props, key: string, def = ""): string {
  return props?.[key] ?? def;
}

/** Get boolean value ("true" → true) */
function pb(props: Props, key: string): boolean {
  return props?.[key] === "true";
}

/** Emit string prop only when it differs from default */
function sp(name: string, val: string, def: string): string {
  return val !== def ? \` \${name}="\${val}"\` : "";
}

/** Parse comma-separated multi-values into an array of length n */
function parseN(raw: string | undefined, n: number, fallback = "Item"): string[] {
  const parts = (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from({ length: n }, (_, i) => parts[i] || \`\${fallback} \${i + 1}\`);
}

/** Repeat indent by n levels (each level = 2 spaces) */
function ind(base: string, n = 1): string {
  return base + "  ".repeat(n);
}

// ---------------------------------------------------------------------------
// Icon helpers
// ---------------------------------------------------------------------------

const ICON_IMPORT_SET = new Set<string>();

function trackIcon(iconKey: string): string {
  ICON_IMPORT_SET.add(iconKey);
  return iconKey;
}

function iconSlot(iconKey: string, childIndent: string): string {
  trackIcon(iconKey);
  return \`\${childIndent}<Icon><\${iconKey} /></Icon>\`;
}

function iconSlotInline(iconKey: string): string {
  trackIcon(iconKey);
  return \`{<Icon><\${iconKey} /></Icon>}\`;
}

// ---------------------------------------------------------------------------
// Aegis component import tracking
// ---------------------------------------------------------------------------

const COMPONENT_IMPORT_SET = new Set<string>();

function use(...names: string[]): void {
  for (const n of names) COMPONENT_IMPORT_SET.add(n);
}

// ---------------------------------------------------------------------------
// Text variant resolver (matches ComponentRenderer.tsx)
// ---------------------------------------------------------------------------

function resolveTextVariant(props: Props): string {
  const tt = pv(props, "textType", "body");
  const sizeKeyMap: Record<string, string> = {
    title: "sizeTitle",
    "document title": "sizeDocTitle",
    label: "sizeLabel",
    body: "sizeBody",
    "document body": "sizeDocBody",
    caption: "sizeCaption",
    data: "sizeData",
  };
  const sizeDefaults: Record<string, string> = { caption: "small" };
  const size = pv(props, sizeKeyMap[tt] ?? "sizeBody", sizeDefaults[tt] ?? "medium");
  const font = pv(props, "font", "sans");
  const ws = pv(props, "weight", "normal") === "bold" ? ".bold" : "";

  switch (tt) {
    case "title":
      return \`title.\${size}\`;
    case "document title":
      return \`document.title.\${size}\`;
    case "label":
      return \`label.\${size}\${ws}\`;
    case "body":
      return \`body.\${size}\${ws}\`;
    case "document body":
      return \`document.body.\${font}.\${size}\${ws}\`;
    case "caption":
      return \`caption.\${size}\`;
    case "data":
      return \`data.\${size}\${ws}\`;
    default:
      return "body.medium";
  }
}

// ---------------------------------------------------------------------------
// Button min-width map (matches ComponentRenderer.tsx)
// ---------------------------------------------------------------------------

const BTN_MIN_WIDTH_MAP: Record<string, string> = {
  "x8Large(80px)": "var(--aegis-size-x8Large)",
  "x9Large(88px)": "var(--aegis-size-x9Large)",
  "x10Large(96px)": "var(--aegis-size-x10Large)",
  "x11Large(104px)": "var(--aegis-size-x11Large)",
  "x12Large(112px)": "var(--aegis-size-x12Large)",
  "x13Large(120px)": "var(--aegis-size-x13Large)",
  "x14Large(160px)": "var(--aegis-size-x14Large)",
  "x15Large(200px)": "var(--aegis-size-x15Large)",
  "x16Large(240px)": "var(--aegis-size-x16Large)",
};

// ---------------------------------------------------------------------------
// Per-component builders
// ---------------------------------------------------------------------------

function buildButton(p: Props, indent: string): string {
  use("Button");
  const rawVariant = pv(p, "variant", "subtle");
  const isWeightGutterless = rawVariant === "Weight(gutterless)";
  const variant = isWeightGutterless ? "gutterless" : rawVariant;
  const color = pv(p, "color", "neutral");
  const size = pv(p, "size", "medium");
  const loading = pb(p, "loading");
  const withoutContent = pb(p, "withoutContent");
  const hasLeading = withoutContent || (!loading && pb(p, "leading"));
  const hasTrailing = withoutContent || (!loading && pb(p, "trailing"));
  const label = pv(p, "label", "Button");

  const minWidthKey = pv(p, "minWidth", "none");
  const minWidthToken = BTN_MIN_WIDTH_MAP[minWidthKey];
  const isFullWidth = minWidthKey === "Width";

  let attrs = "";
  attrs += sp("variant", variant, "solid");
  attrs += sp("color", color, "neutral");
  attrs += sp("size", size, "medium");
  if (isWeightGutterless) attrs += \` weight="normal"\`;
  if (loading) attrs += " loading";
  if (isFullWidth) attrs += \` width="full"\`;
  if (minWidthToken) attrs += \` style={{ minWidth: "\${minWidthToken}" }}\`;

  const buildSlot = (side: "leading" | "trailing"): string => {
    const hasSlot = side === "leading" ? hasLeading : hasTrailing;
    if (!hasSlot) return "";
    if (!withoutContent && side === "trailing" && withoutContent) {
      return iconSlotInline("LfAngleDownMiddle");
    }
    const typeKey = side === "leading" ? "leadingType" : "trailingType";
    const slotType = pv(p, typeKey, "Icon");
    if (slotType === "Icon") {
      const iconKey = pv(p, side === "leading" ? "leadingIcon" : "trailingIcon", "LfPlusLarge");
      trackIcon(iconKey);
      use("Icon");
      return \`{<Icon><\${iconKey} /></Icon>}\`;
    }
    // Badge
    const badgeColor = pv(p, side === "leading" ? "leadingBadgeColor" : "trailingBadgeColor", "information");
    const badgeType = pv(p, side === "leading" ? "leadingBadge" : "trailingBadge", "normal");
    const count =
      badgeType === "count" ? pv(p, side === "leading" ? "leadingBadgeCount" : "trailingBadgeCount", "3") : undefined;
    use("Badge");
    return count !== undefined
      ? \`{<Badge color="\${badgeColor}" count={\${count}} />}\`
      : \`{<Badge color="\${badgeColor}" />}\`;
  };

  if (hasLeading) attrs += \` leading=\${buildSlot("leading")}\`;
  if (hasTrailing) attrs += \` trailing=\${buildSlot("trailing")}\`;

  if (withoutContent) return \`\${indent}<Button\${attrs} />\`;
  return \`\${indent}<Button\${attrs}>\${label}</Button>\`;
}

function buildIconButton(p: Props, indent: string): string {
  use("IconButton", "Tooltip", "Icon");
  const iconKey = pv(p, "icon", "LfPlusLarge");
  trackIcon(iconKey);
  const variant = pv(p, "variant", "subtle");
  const size = pv(p, "size", "medium");
  const color = pv(p, "color", "neutral");
  const loading = pb(p, "loading");

  let attrs = \` aria-label="Action"\`;
  attrs += sp("variant", variant, "subtle");
  attrs += sp("color", color, "neutral");
  attrs += sp("size", size, "medium");
  if (loading) attrs += " loading";

  return \`\${indent}<Tooltip content="Action">\\n\${indent}  <IconButton\${attrs}>\\n\${iconSlot(iconKey, \`\${indent}    \`)}\\n\${indent}  </IconButton>\\n\${indent}</Tooltip>\`;
}

function buildText(p: Props, indent: string): string {
  use("Text");
  const variant = resolveTextVariant(p);
  const tt = pv(p, "textType", "body");
  const as = tt === "title" ? \` as="h2"\` : pv(p, "inputType", "Single-line") === "Multi-line" ? \` as="p"\` : "";
  const text = pv(p, "text", "") || pv(p, "textArea", "") || "Text content";
  return \`\${indent}<Text variant="\${variant}"\${as}>\${text}</Text>\`;
}

function buildBanner(p: Props, indent: string): string {
  use("Banner");
  const color = pv(p, "color", "information");
  const hasAction = pb(p, "action");
  const hasTitle = pb(p, "title");
  const withActionLabel = pb(p, "withActionLabel");
  const showCloseButton = pv(p, "closeButton", "true") !== "false";
  const titleText = pv(p, "titleText", "Information Title");
  const bodyText = pv(p, "text", 'This is a "Information" banner.');
  const linkLabel = pv(p, "linkLabel", "Link");
  const buttonLabel = pv(p, "buttonLabel", "Action");

  let attrs = sp("color", color, "information");
  if (pb(p, "inline")) attrs += " inline";
  if (!showCloseButton) attrs += " closeButton={false}";
  if (hasTitle) attrs += \` title="\${titleText}"\`;
  if (hasAction) {
    use("Button");
    attrs += \` action={<Button size="small">\${buttonLabel}</Button>}\`;
  }

  let children: string;
  if (withActionLabel) {
    use("Link");
    children = \`\${ind(indent)}<Banner.ActionLabel action={<Link href="#">\${linkLabel}</Link>}>\\n\${ind(indent, 2)}\${bodyText}\\n\${ind(indent)}</Banner.ActionLabel>\`;
  } else {
    children = \`\${ind(indent)}\${bodyText}\`;
  }

  return \`\${indent}<Banner\${attrs}>\\n\${children}\\n\${indent}</Banner>\`;
}

function buildTag(p: Props, indent: string): string {
  use("Tag");
  const color = pv(p, "color", "blue");
  const variant = pv(p, "variant", "outline");
  const size = pv(p, "size", "small");
  const label = pv(p, "label", "Tag");
  let attrs = sp("color", color, "neutral");
  attrs += sp("variant", variant, "outline");
  attrs += sp("size", size, "medium");
  return \`\${indent}<Tag\${attrs}>\${label}</Tag>\`;
}

function buildStatusLabel(p: Props, indent: string): string {
  use("StatusLabel");
  const size = pv(p, "size", "medium");
  const color = pv(p, "color", "neutral");
  const variant = pv(p, "variant", "outline");
  const label = pv(p, "label", "Status").split(",")[0] || "Status";
  let attrs = sp("size", size, "medium");
  attrs += sp("color", color, "neutral");
  attrs += sp("variant", variant, "outline");
  return \`\${indent}<StatusLabel\${attrs}>\${label}</StatusLabel>\`;
}

function buildLink(p: Props, indent: string): string {
  use("Link");
  const label = pv(p, "label", "Link");
  const href = pv(p, "url", "#");
  const external = pb(p, "external");
  let attrs = \` href="\${href}"\`;
  if (external) attrs += \` target="_blank" rel="noreferrer"\`;
  return \`\${indent}<Link\${attrs}>\${label}</Link>\`;
}

function buildSwitch(p: Props, indent: string): string {
  use("Switch");
  const size = pv(p, "size", "small");
  const color = pv(p, "color", "information");
  const labelPosition = pv(p, "labelPosition", "end");
  const label = pv(p, "label", "Toggle Option");
  let attrs = sp("size", size, "small");
  attrs += sp("color", color, "information");
  attrs += sp("labelPosition", labelPosition, "end");
  return \`\${indent}<Switch\${attrs}>\${label}</Switch>\`;
}

function buildCheckbox(p: Props, indent: string): string {
  use("Checkbox");
  const noLabel = pb(p, "noLabel");
  const label = pv(p, "label", "Checkbox");
  if (noLabel) return \`\${indent}<Checkbox />\`;
  return \`\${indent}<Checkbox>\${label}</Checkbox>\`;
}

function buildCheckboxCard(p: Props, indent: string): string {
  use("CheckboxCard");
  const size = pv(p, "size", "medium");
  const variant = pv(p, "variant", "plain");
  const color = pv(p, "color", "neutral");
  const label = pv(p, "label", "Checkbox Card");
  let attrs = sp("size", size, "medium");
  attrs += sp("variant", variant, "plain");
  attrs += sp("color", color, "neutral");
  return \`\${indent}<CheckboxCard\${attrs}>\${label}</CheckboxCard>\`;
}

function buildCheckboxGroup(p: Props, indent: string): string {
  use("CheckboxGroup", "Checkbox");
  const count = Math.min(Math.max(parseInt(pv(p, "items", "3"), 10), 2), 6);
  // fieldConfig key is "text" (not "label") for item label textarea
  const labels = parseN(pv(p, "text"), count, "Option");
  const items = labels.map((l) => \`\${ind(indent)}<Checkbox>\${l}</Checkbox>\`).join("\\n");
  return \`\${indent}<CheckboxGroup>\\n\${items}\\n\${indent}</CheckboxGroup>\`;
}

function buildRadioCard(p: Props, indent: string): string {
  use("RadioCard");
  const size = pv(p, "size", "medium");
  const variant = pv(p, "variant", "plain");
  const label = pv(p, "label", "Radio Card");
  let attrs = sp("size", size, "medium");
  attrs += sp("variant", variant, "plain");
  return \`\${indent}<RadioCard\${attrs}>\${label}</RadioCard>\`;
}

function buildRadioGroup(p: Props, indent: string): string {
  use("RadioGroup", "Radio");
  const count = Math.min(Math.max(parseInt(pv(p, "items", "3"), 10), 2), 6);
  // fieldConfig key is "text" (not "label") for item label textarea
  const labels = parseN(pv(p, "text"), count, "Option");
  const items = labels.map((l) => \`\${ind(indent)}<Radio>\${l}</Radio>\`).join("\\n");
  return \`\${indent}<RadioGroup>\\n\${items}\\n\${indent}</RadioGroup>\`;
}

function buildTextField(p: Props, indent: string): string {
  use("TextField", "FormControl");
  // fieldConfig key is "fcLabel" (not "label") for FormControl Label
  const label = pv(p, "fcLabel", "Label");
  const placeholder = pv(p, "placeholder", "");
  const size = pv(p, "size", "medium");
  let fieldAttrs = sp("size", size, "medium");
  if (placeholder) fieldAttrs += \` placeholder="\${placeholder}"\`;
  return \`\${indent}<FormControl>\\n\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\\n\${ind(indent)}<TextField\${fieldAttrs} />\\n\${indent}</FormControl>\`;
}

function buildTextarea(p: Props, indent: string): string {
  use("Textarea", "FormControl");
  // fieldConfig key is "fcLabel" (not "label") for FormControl Label
  const label = pv(p, "fcLabel", "Label");
  const placeholder = pv(p, "placeholder", "");
  // fieldConfig key is "minRows" (not "rows")
  const rows = pv(p, "minRows", "3");
  let fieldAttrs = rows !== "3" ? \` rows={\${rows}}\` : "";
  if (placeholder) fieldAttrs += \` placeholder="\${placeholder}"\`;
  return \`\${indent}<FormControl>\\n\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\\n\${ind(indent)}<Textarea\${fieldAttrs} />\\n\${indent}</FormControl>\`;
}

function buildFormControl(p: Props, indent: string): string {
  use("FormControl", "TextField");
  // fieldConfig key is "fcLabel" (not "label") for FormControl Label
  const label = pv(p, "fcLabel", "Label");
  const placeholder = pv(p, "placeholder", "");
  const required = pb(p, "required");
  // fieldConfig key is "fcCaptionText" (not "helpText") for caption text
  const helpText = pv(p, "fcCaptionText", "");
  let attrs = "";
  if (required) attrs += " required";
  const phAttr = placeholder ? \` placeholder="\${placeholder}"\` : "";
  const helpLine = helpText ? \`\\n\${ind(indent)}<FormControl.Caption>\${helpText}</FormControl.Caption>\` : "";
  return \`\${indent}<FormControl\${attrs}>\\n\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\\n\${ind(indent)}<TextField\${phAttr} />\${helpLine}\\n\${indent}</FormControl>\`;
}

function buildSearch(p: Props, indent: string): string {
  use("Search");
  const size = pv(p, "size", "medium");
  const placeholder = pv(p, "placeholder", "Search...");
  let attrs = sp("size", size, "medium");
  attrs += \` placeholder="\${placeholder}"\`;
  return \`\${indent}<Search\${attrs} />\`;
}

function buildSelect(p: Props, indent: string): string {
  use("Select", "FormControl");
  // fieldConfig key is "fcLabel" (not "label") for FormControl Label
  const label = pv(p, "fcLabel", "Label");
  const size = pv(p, "size", "medium");
  const variant = pv(p, "variant", "outline");
  const placeholder = pv(p, "placeholder", "Select...");
  const clearable = pb(p, "clearable");

  let selectAttrs = sp("size", size, "medium");
  selectAttrs += sp("variant", variant, "outline");
  if (clearable) selectAttrs += " clearable";

  // menuItems から options を構築（fieldConfig defaultValue: "Option A,Option B,Option C"）
  const rawMenuItems = pv(p, "menuItems", "Option A,Option B,Option C");
  const optionValues = rawMenuItems
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const optionLines = optionValues.map((v) => \`\${ind(indent, 3)}{ value: "\${v}", label: "\${v}" },\`).join("\\n");

  return [
    \`\${indent}<FormControl>\`,
    \`\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\`,
    \`\${ind(indent)}<Select\${selectAttrs}\`,
    \`\${ind(indent, 2)}options={[\`,
    optionLines,
    \`\${ind(indent, 2)}]}\`,
    \`\${ind(indent, 2)}placeholder="\${placeholder}"\`,
    \`\${ind(indent)}/>\`,
    \`\${indent}</FormControl>\`,
  ].join("\\n");
}

function buildCombobox(p: Props, indent: string): string {
  use("Combobox", "FormControl");
  // fieldConfig key is "fcLabel" (not "label") for FormControl Label
  const label = pv(p, "fcLabel", "Label");
  const size = pv(p, "size", "medium");
  const creatable = pb(p, "creatable");

  let comboAttrs = sp("size", size, "medium");
  if (creatable) comboAttrs += " creatable";

  // menuItems から options を構築（fieldConfig に defaultValue なし → "Option A,Option B,Option C" をフォールバック）
  const rawMenuItems = pv(p, "menuItems", "Option A,Option B,Option C");
  const optionValues = rawMenuItems
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const optionLines = optionValues.map((v) => \`\${ind(indent, 3)}{ value: "\${v}", label: "\${v}" },\`).join("\\n");

  return [
    \`\${indent}<FormControl>\`,
    \`\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\`,
    \`\${ind(indent)}<Combobox\${comboAttrs}\`,
    \`\${ind(indent, 2)}options={[\`,
    optionLines,
    \`\${ind(indent, 2)}]}\`,
    \`\${ind(indent)}/>\`,
    \`\${indent}</FormControl>\`,
  ].join("\\n");
}

function buildAvatar(p: Props, indent: string): string {
  use("Avatar");
  const name = pv(p, "text", "AB");
  const size = pv(p, "size", "medium");
  const color = pv(p, "color", "auto");
  let attrs = \` name="\${name}"\`;
  attrs += sp("size", size, "medium");
  attrs += sp("color", color, "auto");
  return \`\${indent}<Avatar\${attrs} />\`;
}

function buildAvatarGroup(p: Props, indent: string): string {
  use("AvatarGroup", "Avatar");
  const count = Math.min(Math.max(parseInt(pv(p, "items", "3"), 10), 2), 6);
  const size = pv(p, "size", "medium");
  const sizeAttr = sp("size", size, "medium");
  const avatars = Array.from(
    { length: count },
    (_, i) => \`\${ind(indent)}<Avatar name="\${String.fromCharCode(65 + i * 2)}\${String.fromCharCode(66 + i * 2)}" />\`,
  ).join("\\n");
  return \`\${indent}<AvatarGroup\${sizeAttr}>\\n\${avatars}\\n\${indent}</AvatarGroup>\`;
}

function buildMark(p: Props, indent: string): string {
  use("Mark");
  const color = pv(p, "color", "yellow");
  // fieldConfig key is "markText" (not "text") for the highlighted text content
  const text = pv(p, "markText", "important part");
  return \`\${indent}<Mark color="\${color}">\${text}</Mark>\`;
}

function buildDivider(_p: Props, indent: string): string {
  use("Divider");
  return \`\${indent}<Divider />\`;
}

function buildDividerVertical(_p: Props, indent: string): string {
  use("DividerVertical");
  return \`\${indent}<DividerVertical />\`;
}

function buildBlockquote(p: Props, indent: string): string {
  use("Blockquote");
  const text = pv(p, "text", "Sample quotation text.");
  return \`\${indent}<Blockquote>\${text}</Blockquote>\`;
}

function buildBreadcrumb(p: Props, indent: string): string {
  use("Breadcrumb");
  const count = Math.min(Math.max(parseInt(pv(p, "items", "3"), 10), 2), 10);
  const labels = parseN(pv(p, "label"), count, "Page");
  const items = labels
    .map((l, i) => {
      const isLast = i === count - 1;
      const href = isLast ? "" : \` href="#"\`;
      const current = isLast ? \` aria-current="location"\` : "";
      return \`\${ind(indent)}<Breadcrumb.Item\${href}\${current}>\${l}</Breadcrumb.Item>\`;
    })
    .join("\\n");
  return \`\${indent}<Breadcrumb>\\n\${items}\\n\${indent}</Breadcrumb>\`;
}

function buildButtonGroup(p: Props, indent: string): string {
  use("ButtonGroup", "Button");
  // fieldConfig key is "btnItems" for Button count (not "items")
  const count = Math.min(Math.max(parseInt(pv(p, "btnItems", "3"), 10), 1), 5);
  // fieldConfig key is "iconItems" for IconButton count (default 1)
  const iconCount = Math.min(Math.max(parseInt(pv(p, "iconItems", "1"), 10), 0), 5);
  const size = pv(p, "size", "medium");
  const attached = pb(p, "attached");
  // fieldConfig "attachedColor" maps to Aegis API "variant" prop on ButtonGroup
  const attachedColor = pv(p, "attachedColor", "solid");

  let groupAttrs = sp("size", size, "medium");
  if (attached) {
    groupAttrs += " attached";
    groupAttrs += sp("variant", attachedColor, "solid");
  }

  // Per-button settings (stored as btn\${n}_{key} via SubItemPopover — same pattern as DataTable colScoped)
  const buttons = Array.from({ length: count }, (_, ci) => {
    const n = ci + 1;
    const pfx = \`btn\${n}_\`;
    const label = pv(p, \`\${pfx}label\`, "Button");
    const loading = pb(p, \`\${pfx}loading\`);
    const hasLeading = !loading && pb(p, \`\${pfx}leading\`);
    const hasTrailing = !loading && pb(p, \`\${pfx}trailing\`);

    let attrs = "";
    // Per-button variant/color: suppressed when attached (group-level variant takes precedence)
    if (!attached) {
      attrs += sp("variant", pv(p, \`\${pfx}variant\`, "subtle"), "subtle");
      attrs += sp("color", pv(p, \`\${pfx}color\`, "neutral"), "neutral");
    }
    if (loading) attrs += " loading";
    // Per-button slot: Icon or Badge depending on leadingType / trailingType
    const buildBtnSlot = (side: "leading" | "trailing"): string => {
      const slotType = pv(p, \`\${pfx}\${side}Type\`, "Icon");
      if (slotType === "Icon") {
        const iconKey = pv(p, \`\${pfx}\${side}Icon\`, "LfPlusLarge");
        use("Icon");
        trackIcon(iconKey);
        return \`{<Icon><\${iconKey} /></Icon>}\`;
      }
      // Badge
      const badgeColor = pv(p, \`\${pfx}\${side}BadgeColor\`, "information");
      const badgeType = pv(p, \`\${pfx}\${side}Badge\`, "normal");
      const count = badgeType === "count" ? pv(p, \`\${pfx}\${side}BadgeCount\`, "3") : undefined;
      use("Badge");
      return count !== undefined
        ? \`{<Badge color="\${badgeColor}" count={\${count}} />}\`
        : \`{<Badge color="\${badgeColor}" />}\`;
    };
    if (hasLeading) attrs += \` leading=\${buildBtnSlot("leading")}\`;
    if (hasTrailing) attrs += \` trailing=\${buildBtnSlot("trailing")}\`;
    return \`\${ind(indent)}<Button\${attrs}>\${label}</Button>\`;
  }).join("\\n");

  let iconPart = "";
  if (iconCount > 0) {
    use("IconButton", "Tooltip", "Icon");
    // Per-iconButton settings (stored as icon\${n}_{key} via SubItemPopover)
    const iconBtns = Array.from({ length: iconCount }, (_, ci) => {
      const n = ci + 1;
      const pfx = \`icon\${n}_\`;
      const iconKey = pv(p, \`\${pfx}icon\`, "LfPlusLarge");
      const iconLoading = pb(p, \`\${pfx}loading\`);
      trackIcon(iconKey);

      let iconBtnAttrs = "";
      iconBtnAttrs += sp("variant", pv(p, \`\${pfx}variant\`, "subtle"), "subtle");
      iconBtnAttrs += sp("color", pv(p, \`\${pfx}color\`, "neutral"), "neutral");
      if (iconLoading) iconBtnAttrs += " loading";
      iconBtnAttrs += \` aria-label="Action"\`;

      return [
        \`\${ind(indent)}<Tooltip content="Action">\`,
        \`\${ind(indent, 2)}<IconButton\${iconBtnAttrs}>\`,
        \`\${ind(indent, 3)}<Icon><\${iconKey} /></Icon>\`,
        \`\${ind(indent, 2)}</IconButton>\`,
        \`\${ind(indent)}</Tooltip>\`,
      ].join("\\n");
    }).join("\\n");
    iconPart = "\\n" + iconBtns;
  }

  return \`\${indent}<ButtonGroup\${groupAttrs}>\\n\${buttons}\${iconPart}\\n\${indent}</ButtonGroup>\`;
}

function buildCalendar(_p: Props, indent: string): string {
  use("Calendar");
  return \`\${indent}<Calendar />\`;
}

function buildRangeCalendar(_p: Props, indent: string): string {
  use("RangeCalendar");
  return \`\${indent}<RangeCalendar />\`;
}

function buildDateField(p: Props, indent: string): string {
  use("DateField", "FormControl");
  // fieldConfig key is "fcLabel" for FormControl Label
  const label = pv(p, "fcLabel", "Date");
  return \`\${indent}<FormControl>\\n\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\\n\${ind(indent)}<DateField />\\n\${indent}</FormControl>\`;
}

function buildDatePicker(p: Props, indent: string): string {
  use("DatePicker", "FormControl");
  // fieldConfig key is "fcLabel" for FormControl Label
  const label = pv(p, "fcLabel", "Date");
  return \`\${indent}<FormControl>\\n\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\\n\${ind(indent)}<DatePicker />\\n\${indent}</FormControl>\`;
}

function buildRangeDateField(p: Props, indent: string): string {
  use("RangeDateField", "FormControl");
  // fieldConfig key is "fcLabel" for FormControl Label
  const label = pv(p, "fcLabel", "Date Range");
  return \`\${indent}<FormControl>\\n\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\\n\${ind(indent)}<RangeDateField />\\n\${indent}</FormControl>\`;
}

function buildRangeDatePicker(p: Props, indent: string): string {
  use("RangeDatePicker", "FormControl");
  // fieldConfig key is "fcLabel" for FormControl Label
  const label = pv(p, "fcLabel", "Date Range");
  return \`\${indent}<FormControl>\\n\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\\n\${ind(indent)}<RangeDatePicker />\\n\${indent}</FormControl>\`;
}

function buildTimeField(p: Props, indent: string): string {
  use("TimeField", "FormControl");
  // fieldConfig key is "fcLabel" for FormControl Label
  const label = pv(p, "fcLabel", "Time");
  return \`\${indent}<FormControl>\\n\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\\n\${ind(indent)}<TimeField />\\n\${indent}</FormControl>\`;
}

function buildTimePicker(p: Props, indent: string): string {
  use("TimePicker", "FormControl");
  // fieldConfig key is "fcLabel" for FormControl Label
  const label = pv(p, "fcLabel", "Time");
  return \`\${indent}<FormControl>\\n\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\\n\${ind(indent)}<TimePicker />\\n\${indent}</FormControl>\`;
}

function buildRangeTimeField(p: Props, indent: string): string {
  use("RangeTimeField", "FormControl");
  // fieldConfig key is "fcLabel" for FormControl Label
  const label = pv(p, "fcLabel", "Time Range");
  return \`\${indent}<FormControl>\\n\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\\n\${ind(indent)}<RangeTimeField />\\n\${indent}</FormControl>\`;
}

function buildRangeTimePicker(p: Props, indent: string): string {
  use("RangeTimePicker", "FormControl");
  // fieldConfig key is "fcLabel" for FormControl Label
  const label = pv(p, "fcLabel", "Time Range");
  return \`\${indent}<FormControl>\\n\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\\n\${ind(indent)}<RangeTimePicker />\\n\${indent}</FormControl>\`;
}

function buildTagInput(p: Props, indent: string): string {
  // withinFormControl=false → FormControl wrapper を省略して TagInput を直接出力
  const withinFC = pv(p, "withinFormControl", "true") !== "false";

  const label = pv(p, "fcLabel", "Label");
  const size = pv(p, "size", "medium");
  const variant = pv(p, "variant", "outline");
  const shrinkOnBlur = pb(p, "shrinkOnBlur");
  // addCaption: fieldConfig defaultValue は "true"。false のときのみ明示的に出力する
  const addCaptionOff = pv(p, "addCaption", "true") === "false";
  const hasMax = pb(p, "hasMaxSelection");
  const maxSelection = parseInt(pv(p, "maxSelection", "3"), 10);

  // fieldConfig key は "defaultTags"（textarea, comma-separated）→ defaultValue={[...]}
  const rawTags = pv(p, "defaultTags", "");
  const tagArray = rawTags
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // leading: leadingType="text" → 文字列 prop、leadingType="icon" → Icon node
  const hasLeading = pb(p, "leading");
  const leadingType = pv(p, "leadingType", "text");
  let leadingAttr = "";
  if (hasLeading) {
    if (leadingType === "icon") {
      use("Icon");
      const leadingIcon = pv(p, "leadingIcon", "LfPlusLarge");
      trackIcon(leadingIcon);
      leadingAttr = \` leading={<Icon><\${leadingIcon} /></Icon>}\`;
    } else {
      const leadingText = pv(p, "leadingText", "From:");
      leadingAttr = \` leading="\${leadingText}"\`;
    }
  }

  // trailing: icon node のみ（fieldConfig に text variant なし）
  const hasTrailing = pb(p, "trailing");
  let trailingAttr = "";
  if (hasTrailing) {
    use("Icon");
    const trailingIcon = pv(p, "trailingIcon", "LfPlusLarge");
    trackIcon(trailingIcon);
    trailingAttr = \` trailing={<Icon><\${trailingIcon} /></Icon>}\`;
  }

  let tagInputAttrs = sp("size", size, "medium");
  tagInputAttrs += sp("variant", variant, "outline");
  tagInputAttrs += leadingAttr;
  tagInputAttrs += trailingAttr;
  if (shrinkOnBlur) tagInputAttrs += " shrinkOnBlur";
  if (addCaptionOff) tagInputAttrs += " addCaption={false}";
  if (tagArray.length > 0) tagInputAttrs += \` defaultValue={[\${tagArray.map((t) => \`"\${t}"\`).join(", ")}]}\`;
  if (hasMax) tagInputAttrs += \` maxSelection={\${maxSelection}}\`;

  // withinFormControl=false → FormControl なしで TagInput を直接出力
  if (!withinFC) {
    use("TagInput");
    return \`\${indent}<TagInput\${tagInputAttrs} />\`;
  }

  // withinFormControl=true（デフォルト）→ FormControl でラップ
  use("TagInput", "FormControl");

  // withToolbar: FormControl.Toolbar を TagInput の前に出す（FormControl サブコンポーネント）
  const withToolbar = pb(p, "withToolbar");
  const ghostToolbar = withToolbar && pb(p, "withGhostToolbar");
  const toolbarCount = withToolbar ? Math.min(Math.max(parseInt(pv(p, "toolbarItems", "2"), 10), 1), 3) : 0;
  const getToolbarLabel = (n: number): string =>
    toolbarCount === 1 ? pv(p, "btnLabel", "Action") : pv(p, \`btnLabel\${n}\`, \`Action \${n}\`);

  // fcCaption: FormControl.Caption を TagInput の後に出す
  const showFcCaption = pb(p, "fcCaption");
  const captionText = pv(p, "fcCaptionText", "Caption text");

  // fcGroup: FormControl.Group で TagInput と別の入力を並列に出す
  const withFcGroup = pb(p, "fcGroup");
  const fcGroupInputType = pv(p, "fcGroupInputType", "Select");

  const lines: string[] = [\`\${indent}<FormControl>\`, \`\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\`];

  if (withToolbar) {
    use("Button", "Divider");
    const ghostAttr = ghostToolbar ? " ghost" : "";
    lines.push(\`\${ind(indent)}<FormControl.Toolbar\${ghostAttr}>\`);
    for (let i = 0; i < toolbarCount; i++) {
      if (i > 0) lines.push(\`\${ind(indent, 2)}<Divider />\`);
      lines.push(\`\${ind(indent, 2)}<Button variant="gutterless">\${getToolbarLabel(i + 1)}</Button>\`);
    }
    lines.push(\`\${ind(indent)}</FormControl.Toolbar>\`);
  }

  if (withFcGroup) {
    lines.push(\`\${ind(indent)}<FormControl.Group>\`);
    lines.push(\`\${ind(indent, 2)}<TagInput\${tagInputAttrs} />\`);
    lines.push(buildFormInputJsx(fcGroupInputType, ind(indent, 2)));
    lines.push(\`\${ind(indent)}</FormControl.Group>\`);
  } else {
    lines.push(\`\${ind(indent)}<TagInput\${tagInputAttrs} />\`);
  }

  if (showFcCaption) {
    lines.push(\`\${ind(indent)}<FormControl.Caption>\${captionText}</FormControl.Caption>\`);
  }

  lines.push(\`\${indent}</FormControl>\`);
  return lines.join("\\n");
}

function buildTagPicker(p: Props, indent: string): string {
  use("TagPicker", "FormControl");
  const label = pv(p, "fcLabel", "Tags");
  const rawOptions = pv(p, "options", "Tag A,Tag B,Tag C");
  const optionValues = rawOptions
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const optionLines = optionValues.map((v) => \`\${ind(indent, 3)}{ value: "\${v}", label: "\${v}" },\`).join("\\n");
  return [
    \`\${indent}<FormControl>\`,
    \`\${ind(indent)}<FormControl.Label>\${label}</FormControl.Label>\`,
    \`\${ind(indent)}<TagPicker\`,
    \`\${ind(indent, 2)}options={[\`,
    optionLines,
    \`\${ind(indent, 2)}]}\`,
    \`\${ind(indent)}/>\`,
    \`\${indent}</FormControl>\`,
  ].join("\\n");
}

function buildBadge(p: Props, indent: string): string {
  use("Badge");
  const color = pv(p, "color", "neutral");
  const colorAttr = sp("color", color, "neutral");
  // No fieldConfig for Badge — outputs a minimal scaffold with a count label
  return \`\${indent}<Badge\${colorAttr}>3</Badge>\`;
}

function buildRadio(_p: Props, indent: string): string {
  use("RadioGroup", "Radio");
  // Aegis: Radio must be used inside RadioGroup. Outputting a minimal RadioGroup scaffold.
  // Replace labels and add a value prop per radio as needed.
  return [
    \`\${indent}<RadioGroup>\`,
    \`\${ind(indent)}{/* Radio: ラベルと value を実際の選択肢に合わせて変更してください */}\`,
    \`\${ind(indent)}<Radio value="1">Option 1</Radio>\`,
    \`\${ind(indent)}<Radio value="2">Option 2</Radio>\`,
    \`\${indent}</RadioGroup>\`,
  ].join("\\n");
}

function buildSkeleton(_p: Props, indent: string): string {
  use("Skeleton");
  // Aegis Skeleton: width / height を実際のコンテンツサイズに合わせて変更してください
  return \`\${indent}<Skeleton width={200} height={20} />\`;
}

function buildSegmentedControl(p: Props, indent: string): string {
  use("SegmentedControl");
  const count = Math.min(Math.max(parseInt(pv(p, "items", "3"), 10), 2), 6);
  const labels = parseN(pv(p, "label"), count, "Option");
  const items = labels.map((l) => \`\${ind(indent)}<SegmentedControl.Button>\${l}</SegmentedControl.Button>\`).join("\\n");
  return \`\${indent}<SegmentedControl defaultIndex={0}>\\n\${items}\\n\${indent}</SegmentedControl>\`;
}

function buildTabs(p: Props, indent: string): string {
  use("Tabs", "TabsList", "TabsTrigger", "TabsContent");
  const count = Math.min(Math.max(parseInt(pv(p, "items", "3"), 10), 2), 10);
  const labels = parseN(pv(p, "label"), count, "Tab");
  const triggers = labels.map((l, i) => \`\${ind(indent, 2)}<TabsTrigger value="\${i + 1}">\${l}</TabsTrigger>\`).join("\\n");
  const contents = labels
    .map((_, i) => \`\${ind(indent)}<TabsContent value="\${i + 1}">{/* Tab \${i + 1} content */}</TabsContent>\`)
    .join("\\n");
  return \`\${indent}<Tabs defaultValue="1">\\n\${ind(indent)}<TabsList>\\n\${triggers}\\n\${ind(indent)}</TabsList>\\n\${contents}\\n\${indent}</Tabs>\`;
}

function buildTagGroup(p: Props, indent: string): string {
  use("TagGroup", "Tag");
  const count = Math.min(Math.max(parseInt(pv(p, "tgItems", "3"), 10) || 3, 1), 10);
  const labels = parseN(pv(p, "tagLabels"), count, "Tag");
  const tags = labels.map((l) => \`\${ind(indent)}<Tag>\${l}</Tag>\`).join("\\n");
  return \`\${indent}<TagGroup>\\n\${tags}\\n\${indent}</TagGroup>\`;
}

function buildOrderedList(p: Props, indent: string): string {
  use("OrderedList");
  // fieldConfig stores items as comma-separated text (multiValue textarea), not a count
  const labels = pv(p, "items", "AAA,BBB,CCC")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const items = labels.map((l) => \`\${ind(indent)}<OrderedList.Item>\${l}</OrderedList.Item>\`).join("\\n");
  return \`\${indent}<OrderedList>\\n\${items}\\n\${indent}</OrderedList>\`;
}

function buildUnorderedList(p: Props, indent: string): string {
  use("UnorderedList");
  // fieldConfig stores items as comma-separated text (multiValue textarea), not a count
  const labels = pv(p, "items", "AAA,BBB,CCC")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const items = labels.map((l) => \`\${ind(indent)}<UnorderedList.Item>\${l}</UnorderedList.Item>\`).join("\\n");
  return \`\${indent}<UnorderedList>\\n\${items}\\n\${indent}</UnorderedList>\`;
}

function buildNavList(p: Props, indent: string): string {
  use("NavList");
  // fieldConfig stores item labels as comma-separated text under "itemTexts" key
  const labels = pv(p, "itemTexts", "Dashboard,Settings,Reports")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const items = labels.map((l) => \`\${ind(indent)}<NavList.Item href="#">\${l}</NavList.Item>\`).join("\\n");
  return \`\${indent}<NavList>\\n\${items}\\n\${indent}</NavList>\`;
}

function buildDescriptionList(p: Props, indent: string): string {
  use("DescriptionList", "DescriptionListItem", "DescriptionListTerm", "DescriptionListDetail");
  const count = Math.min(Math.max(parseInt(pv(p, "items", "3"), 10), 1), 6);
  const terms = parseN(pv(p, "term"), count, "Term");
  const details = parseN(pv(p, "detail"), count, "Detail");
  const items = Array.from(
    { length: count },
    (_, i) =>
      \`\${ind(indent)}<DescriptionListItem>\\n\${ind(indent, 2)}<DescriptionListTerm>\${terms[i]}</DescriptionListTerm>\\n\${ind(indent, 2)}<DescriptionListDetail>\${details[i]}</DescriptionListDetail>\\n\${ind(indent)}</DescriptionListItem>\`,
  ).join("\\n");
  return \`\${indent}<DescriptionList>\\n\${items}\\n\${indent}</DescriptionList>\`;
}

function buildEmptyState(p: Props, indent: string): string {
  use("EmptyState");
  const size = pv(p, "size", "medium");
  // fieldConfig key is "titleText" (not "title" which is a checkbox boolean)
  const title = pv(p, "titleText", "No items found");
  let attrs = \` title="\${title}"\`;
  attrs += sp("size", size, "medium");
  return \`\${indent}<EmptyState\${attrs} />\`;
}

function buildFileDrop(p: Props, indent: string): string {
  use("FileDrop");
  const multiple = pb(p, "multiple");
  // fieldConfig key is "text" (not "label")
  const label = pv(p, "text", "Drop files here or click to upload");
  const multiAttr = multiple ? " multiple" : "";
  return \`\${indent}<FileDrop\${multiAttr}>\${label}</FileDrop>\`;
}

function buildCode(p: Props, indent: string): string {
  use("Code");
  // fieldConfig key is "text" (not "code")
  const code = pv(p, "text", "const x = 42;");
  return \`\${indent}<Code>\${code}</Code>\`;
}

function buildCodeBlock(p: Props, indent: string): string {
  use("CodeBlock");
  // fieldConfig key is "text" (not "code")
  const code = pv(p, "text", 'function hello() {\\n  console.log("Hello, world!");\\n}');
  return \`\${indent}<CodeBlock>{\\\`\${code}\\\`}</CodeBlock>\`;
}

function buildPagination(p: Props, indent: string): string {
  use("Pagination");
  const total = Math.min(Math.max(parseInt(pv(p, "items", "10"), 10), 1), 100);
  return \`\${indent}<Pagination total={\${total}} defaultPage={1} />\`;
}

function buildTimeline(p: Props, indent: string): string {
  use("Timeline", "TimelineItem", "TimelinePoint", "TimelineContent");
  const count = Math.min(Math.max(parseInt(pv(p, "items", "4"), 10), 2), 10);
  const labels = parseN(pv(p, "tagLabels"), count, "Event");
  const items = labels
    .map(
      (l) =>
        \`\${ind(indent)}<TimelineItem>\\n\${ind(indent, 2)}<TimelinePoint />\\n\${ind(indent, 2)}<TimelineContent>\${l}</TimelineContent>\\n\${ind(indent)}</TimelineItem>\`,
    )
    .join("\\n");
  return \`\${indent}<Timeline>\\n\${items}\\n\${indent}</Timeline>\`;
}

function buildStepper(p: Props, indent: string): string {
  use("Stepper");
  const count = Math.min(Math.max(parseInt(pv(p, "items", "3"), 10), 2), 10);
  const labels = parseN(pv(p, "label"), count, "Step");
  const orientation = pv(p, "orientation", "horizontal");
  const size = pv(p, "size", "medium");
  let attrs = sp("orientation", orientation, "horizontal");
  attrs += sp("size", size, "medium");
  // Aegis Storybook: status prop is required on Stepper.Item (e.g. "normal", "completed")
  const items = labels.map((l) => \`\${ind(indent)}<Stepper.Item status="normal" title="\${l}" />\`).join("\\n");
  return \`\${indent}<Stepper defaultIndex={0}\${attrs}>\\n\${items}\\n\${indent}</Stepper>\`;
}

function buildTree(p: Props, indent: string): string {
  use("Tree");

  const hasChildren = pb(p, "children");
  const selection = pb(p, "selection");
  const selectionType = pv(p, "selectionType", "Multiple"); // fieldConfig default: "Multiple"
  const propagateSelection = pb(p, "propagateSelection");
  const reorderable = pb(p, "reorderable");

  // Parse label textarea: each line is one item; leading spaces encode depth (2 spaces = 1 level)
  // Use TREE_LABEL_DEFAULT as fallback to keep generator output consistent with fieldConfig default
  const rawLabel = pv(p, "label", TREE_LABEL_DEFAULT);
  const MAX_TREE_ITEMS = 20;

  const parsedLines: { id: string; name: string; depth: number }[] = [];
  let counter = 1;
  for (const line of rawLabel.split("\\n")) {
    if (counter > MAX_TREE_ITEMS) break;
    const stripped = line.replace(/,\\s*$/, ""); // remove trailing comma (multiValue separator)
    const name = stripped.trim();
    if (!name) continue;
    const leadingSpaces = stripped.length - stripped.trimStart().length;
    const depth = Math.floor(leadingSpaces / 2); // 2 spaces per depth level
    parsedLines.push({ id: \`item-\${counter++}\`, name, depth });
  }

  // Build parent-child relationships
  // depthLastNode[d] = most recent node ID seen at depth d
  const childrenMap: Record<string, string[]> = { root: [] };
  const depthLastNode: string[] = [];
  for (const node of parsedLines) {
    const parentId = node.depth === 0 ? "root" : (depthLastNode[node.depth - 1] ?? "root");
    if (!childrenMap[parentId]) childrenMap[parentId] = [];
    childrenMap[parentId].push(node.id);
    depthLastNode[node.depth] = node.id;
  }

  // Nodes that have children (emit in getItemChildren map)
  const parentIds = Object.keys(childrenMap).filter((id) => childrenMap[id].length > 0);

  // items map lines
  const itemMapLines = [
    \`\${ind(indent, 2)}root: {},\`,
    ...parsedLines.map((n) => \`\${ind(indent, 2)}"\${n.id}": {},\`),
  ].join("\\n");

  // getItemName inline object
  const nameEntries = parsedLines.map((n) => \`\${ind(indent, 3)}"\${n.id}": "\${n.name}",\`).join("\\n");

  // getItemChildren inline object (only parents)
  const childrenEntries = parentIds
    .map((id) => {
      const children = childrenMap[id].map((c) => \`"\${c}"\`).join(", ");
      return \`\${ind(indent, 3)}"\${id}": [\${children}],\`;
    })
    .join("\\n");

  // defaultExpandedItems: expand root's direct children so hierarchy is visible
  const rootChildren = childrenMap["root"] ?? [];
  const expandedStr = rootChildren.map((id) => \`"\${id}"\`).join(", ");

  const propLines: string[] = [
    \`\${ind(indent)}items={{\`,
    itemMapLines,
    \`\${ind(indent)}}}\`,
    \`\${ind(indent)}rootItemId="root"\`,
    \`\${ind(indent)}getItemName={(id) => ({\`,
    nameEntries,
    \`\${ind(indent, 2)}} as Record<string, string>)[id] ?? id}\`,
    \`\${ind(indent)}getItemChildren={(id) => ({\`,
    childrenEntries,
    \`\${ind(indent, 2)}} as Record<string, string[]>)[id]}\`,
  ];

  if (expandedStr) {
    propLines.push(\`\${ind(indent)}defaultExpandedItems={[\${expandedStr}]}\`);
  }
  if (selection) {
    propLines.push(\`\${ind(indent)}selectionType="\${selectionType.toLowerCase()}"\`);
    if (propagateSelection) propLines.push(\`\${ind(indent)}propagateSelection\`);
  }
  if (reorderable) {
    propLines.push(\`\${ind(indent)}reorderable\`);
  }
  if (hasChildren) {
    // children prop は render 関数のため静的生成不可。scaffold comment を出力する
    propLines.push(
      \`\${ind(indent)}// children={(id) => (\`,
      \`\${ind(indent)}//   <>{/* TODO: custom content per item */}</>\`,
      \`\${ind(indent)}// )}\`,
    );
  }

  return [\`\${indent}<Tree\`, ...propLines, \`\${indent}/>\`].join("\\n");
}

function buildAccordion(p: Props, indent: string): string {
  use("Accordion", "AccordionItem", "AccordionButton", "AccordionPanel");
  const count = Math.min(Math.max(parseInt(pv(p, "items", "3"), 10), 1), 8);
  const labels = parseN(pv(p, "label"), count, "Section");
  const contents = parseN(pv(p, "content"), count, "Content");
  const items = labels
    .map(
      (l, i) =>
        \`\${ind(indent)}<AccordionItem>\\n\${ind(indent, 2)}<AccordionButton>\${l}</AccordionButton>\\n\${ind(indent, 2)}<AccordionPanel>\${contents[i]}</AccordionPanel>\\n\${ind(indent)}</AccordionItem>\`,
    )
    .join("\\n");
  return \`\${indent}<Accordion>\\n\${items}\\n\${indent}</Accordion>\`;
}

function buildActionList(p: Props, indent: string): string {
  use("ActionList", "ActionListItem", "ActionListBody");
  const count = Math.min(Math.max(parseInt(pv(p, "items", "3"), 10), 1), 8);
  // fieldConfig key is "listLabel" (not "label") for item label textarea
  const labels = parseN(pv(p, "listLabel"), count, "Action");
  const items = labels
    .map(
      (l) =>
        \`\${ind(indent)}<ActionListItem>\\n\${ind(indent, 2)}<ActionListBody>\${l}</ActionListBody>\\n\${ind(indent)}</ActionListItem>\`,
    )
    .join("\\n");
  return \`\${indent}<ActionList>\\n\${items}\\n\${indent}</ActionList>\`;
}

function buildContentHeader(p: Props, indent: string): string {
  use("ContentHeader", "ContentHeaderTitle");
  const size = pv(p, "size", "xLarge");
  const title = pv(p, "titleText", "Page Title");
  const hasDescTop = pb(p, "descriptionTop");
  const hasDescBottom = pb(p, "descriptionBottom");
  const descTop = pv(p, "descriptionTopText", "Description");
  const descBottom = pv(p, "descriptionBottomText", "Description");
  const hasTrailing = pb(p, "trailing");
  const trailingContent = pv(p, "trailingContent", "ButtonGroup");

  const sizeAttr = sp("size", size, "xLarge");

  // Build action prop value (flat API: action is a prop, not a compound child)
  let actionAttr = "";
  if (hasTrailing) {
    if (trailingContent === "ButtonGroup") {
      use("ButtonGroup", "Button");
      actionAttr = \` action={<ButtonGroup><Button>Action 1</Button><Button>Action 2</Button></ButtonGroup>}\`;
    } else if (trailingContent === "Button") {
      use("Button");
      actionAttr = \` action={<Button>Action</Button>}\`;
    } else {
      use("IconButton", "Icon");
      trackIcon("LfPlusLarge");
      actionAttr = \` action={<IconButton aria-label="Action"><Icon><LfPlusLarge /></Icon></IconButton>}\`;
    }
  }

  const lines = [\`\${indent}<ContentHeader\${sizeAttr}\${actionAttr}>\`];

  // description top/bottom expressed by order: descTop → title → descBottom
  if (hasDescTop) {
    use("ContentHeaderDescription");
    lines.push(\`\${ind(indent)}<ContentHeaderDescription>\${descTop}</ContentHeaderDescription>\`);
  }
  lines.push(\`\${ind(indent)}<ContentHeaderTitle>\${title}</ContentHeaderTitle>\`);
  if (hasDescBottom) {
    use("ContentHeaderDescription");
    lines.push(\`\${ind(indent)}<ContentHeaderDescription>\${descBottom}</ContentHeaderDescription>\`);
  }

  lines.push(\`\${indent}</ContentHeader>\`);
  return lines.join("\\n");
}

// ---------------------------------------------------------------------------
// Complex components — structural templates
// ---------------------------------------------------------------------------

function buildCard(p: Props, indent: string): string {
  use("Card", "CardBody");
  const size = pv(p, "size", "medium");
  const hasHeader = pb(p, "header");
  const hasBody = pb(p, "body");
  const hasFooter = pb(p, "footer");
  const headerText = pv(p, "headerText", "Card Title");
  const bodyText = pv(p, "bodyText", "Card body content.");
  const sizeAttr = sp("size", size, "medium");

  const lines = [\`\${indent}<Card\${sizeAttr}>\`];
  if (hasHeader) {
    use("CardHeader");
    lines.push(\`\${ind(indent)}<CardHeader>\${headerText}</CardHeader>\`);
  }
  if (hasBody || !hasHeader) lines.push(\`\${ind(indent)}<CardBody>\${bodyText}</CardBody>\`);
  if (hasFooter) {
    use("CardFooter");
    lines.push(\`\${ind(indent)}<CardFooter>{/* Footer content */}</CardFooter>\`);
  }
  lines.push(\`\${indent}</Card>\`);
  return lines.join("\\n");
}

/** Map colContent type to its per-column multiValue field key */
function getColContentKey(colContent: string): string {
  switch (colContent) {
    case "Tag":
    case "TagGroup":
      return "tagLabel";
    case "Button":
    case "ButtonGroup":
      return "buttonLabel";
    case "Link":
      return "linkLabel";
    case "StatusLabel":
      return "statusLabelLabel";
    default:
      return "text";
  }
}

/** Whether this colContent type passes {value} from getValue into renderCell */
function colContentUsesValue(colContent: string): boolean {
  return ["Text", "Link", "Tag", "TagGroup", "StatusLabel", "Button"].includes(colContent);
}

/**
 * Builds a per-row renderCell expression with index-based branching.
 * Returns null when no rows have per-row overrides — caller should fall back to the simple expression.
 *
 * @param rowCount      total row count (rows 1..rowCount are checked)
 * @param indent        base indent of the <DataTable> element
 * @param usesValue     true → destructure { value, index }; false → destructure { index }
 * @param hasOverride   predicate: does row n (1-based) have any per-row props set?
 * @param buildCellLines (rowNum | null, baseIndent) → JSX lines inside \`return (...)\`
 *   rowNum null = default/fallback branch; baseIndent = indent level for <DataTableCell>
 */
function buildPerRowBlocks(
  rowCount: number,
  indent: string,
  usesValue: boolean,
  hasOverride: (rowNum: number) => boolean,
  buildCellLines: (rowNum: number | null, base: string) => string[],
): string | null {
  const i3 = ind(indent, 3);
  const i4 = ind(indent, 4);
  const i5 = ind(indent, 5);

  const overrides: number[] = [];
  for (let n = 1; n <= rowCount; n++) {
    if (hasOverride(n)) overrides.push(n);
  }
  if (overrides.length === 0) return null;

  const cbArgs = usesValue ? "{ value, index }" : "{ index }";
  const lines: string[] = [\`(\${cbArgs}) => {\`];
  for (const n of overrides) {
    lines.push(\`\${i4}if (index === \${n - 1}) return (\`);
    for (const line of buildCellLines(n, i5)) lines.push(line);
    lines.push(\`\${i4});\`);
  }
  lines.push(\`\${i4}return (\`);
  for (const line of buildCellLines(null, i5)) lines.push(line);
  lines.push(\`\${i4});\`);
  lines.push(\`\${i3}}\`);
  return lines.join("\\n");
}

/** Build the renderCell function expression for a given colContent type.
 *  cp: column-scoped props (col\${ci}_ prefix already stripped).
 *  rowCount: total row count, used to detect per-row overrides. */
function buildDataTableRenderCell(
  colContent: string,
  indent: string,
  cp: Record<string, string>,
  rowCount: number,
): string {
  const i3 = ind(indent, 3);
  const i4 = ind(indent, 4);
  const i5 = ind(indent, 5);
  const i6 = ind(indent, 6);

  switch (colContent) {
    case "Link":
      use("Link");
      return [
        \`({ value }) => (\`,
        \`\${i4}<DataTableCell>\`,
        \`\${i5}<Link href="#">{value}</Link>\`,
        \`\${i4}</DataTableCell>\`,
        \`\${i3})\`,
      ].join("\\n");
    case "Tag": {
      use("Tag");
      const defaultVariant = cp["tagContent_variant"] ?? "outline";
      const defaultColor = cp["tagContent_color"] ?? "neutral";
      const size = cp["tagSize"] ?? "small";

      const buildTagCell = (rowNum: number | null, base: string): string[] => {
        const inner = ind(base);
        const variant = (rowNum !== null ? cp[\`tagRow\${rowNum}Content_variant\`] : undefined) ?? defaultVariant;
        const color = (rowNum !== null ? cp[\`tagRow\${rowNum}Content_color\`] : undefined) ?? defaultColor;
        const rowLabel = rowNum !== null ? cp[\`tagRow\${rowNum}Label\`] : undefined;
        let tagAttrs = "";
        tagAttrs += sp("variant", variant, "outline");
        tagAttrs += sp("color", color, "neutral");
        tagAttrs += sp("size", size, "medium");
        const content = rowLabel !== undefined ? rowLabel : "{value}";
        return [\`\${base}<DataTableCell>\`, \`\${inner}<Tag\${tagAttrs}>\${content}</Tag>\`, \`\${base}</DataTableCell>\`];
      };

      const perRow = buildPerRowBlocks(
        rowCount,
        indent,
        true,
        (n) =>
          cp[\`tagRow\${n}Label\`] !== undefined ||
          cp[\`tagRow\${n}Content_variant\`] !== undefined ||
          cp[\`tagRow\${n}Content_color\`] !== undefined,
        buildTagCell,
      );
      if (perRow !== null) return perRow;

      return [\`({ value }) => (\`, ...buildTagCell(null, i4), \`\${i3})\`].join("\\n");
    }
    case "TagGroup": {
      use("TagGroup", "Tag");
      const tgVariant = cp["tgVariant"] ?? "fill";
      const tgSize = cp["tgSize"] ?? "medium";

      const buildTgCell = (rowNum: number | null, base: string): string[] => {
        const inner = ind(base);
        if (rowNum === null) {
          // Default: single inline tag using {value}
          let tagAttrs = "";
          tagAttrs += sp("variant", tgVariant, "fill");
          tagAttrs += sp("size", tgSize, "medium");
          return [
            \`\${base}<DataTableCell>\`,
            \`\${inner}<TagGroup><Tag\${tagAttrs}>{value}</Tag></TagGroup>\`,
            \`\${base}</DataTableCell>\`,
          ];
        }
        // Per-row: expand to multiple tags with per-row labels and colors
        const rawLabels = cp[\`tgTagLabels\${rowNum}\`] ?? "";
        const itemCount = Math.min(Math.max(parseInt(cp[\`tgRow\${rowNum}Items\`] ?? cp["tgItems"] ?? "3", 10), 1), 10);
        const labels = parseN(rawLabels, itemCount, "Tag");
        const inner2 = ind(inner);
        const lines: string[] = [\`\${base}<DataTableCell>\`, \`\${inner}<TagGroup>\`];
        for (let m = 1; m <= itemCount; m++) {
          const color = cp[\`tgRow\${rowNum}TagColor\${m}\`] ?? cp[\`tgTagColor\${m}\`] ?? "neutral";
          let tagAttrs = "";
          tagAttrs += sp("variant", tgVariant, "fill");
          tagAttrs += sp("color", color, "neutral");
          tagAttrs += sp("size", tgSize, "medium");
          lines.push(\`\${inner2}<Tag\${tagAttrs}>\${labels[m - 1]}</Tag>\`);
        }
        lines.push(\`\${inner}</TagGroup>\`, \`\${base}</DataTableCell>\`);
        return lines;
      };

      const perRow = buildPerRowBlocks(
        rowCount,
        indent,
        true,
        (n) =>
          cp[\`tgTagLabels\${n}\`] !== undefined ||
          cp[\`tgRow\${n}Items\`] !== undefined ||
          Array.from({ length: 10 }, (_, ci) => cp[\`tgRow\${n}TagColor\${ci + 1}\`]).some((v) => v !== undefined),
        buildTgCell,
      );
      if (perRow !== null) return perRow;

      return [\`({ value }) => (\`, ...buildTgCell(null, i4), \`\${i3})\`].join("\\n");
    }
    case "StatusLabel": {
      use("StatusLabel");
      const defaultVariant = cp["statusLabelContent_variant"] ?? "outline";
      const defaultColor = cp["statusLabelContent_color"] ?? "neutral";
      const size = cp["slSize"] ?? "medium";

      const buildSlCell = (rowNum: number | null, base: string): string[] => {
        const inner = ind(base);
        const variant = (rowNum !== null ? cp[\`slRow\${rowNum}Content_variant\`] : undefined) ?? defaultVariant;
        const color = (rowNum !== null ? cp[\`slRow\${rowNum}Content_color\`] : undefined) ?? defaultColor;
        const rowLabel = rowNum !== null ? cp[\`slRow\${rowNum}Label\`] : undefined;
        let slAttrs = "";
        slAttrs += sp("variant", variant, "outline");
        slAttrs += sp("color", color, "neutral");
        slAttrs += sp("size", size, "medium");
        const content = rowLabel !== undefined ? rowLabel : "{value}";
        return [
          \`\${base}<DataTableCell>\`,
          \`\${inner}<StatusLabel\${slAttrs}>\${content}</StatusLabel>\`,
          \`\${base}</DataTableCell>\`,
        ];
      };

      const perRow = buildPerRowBlocks(
        rowCount,
        indent,
        true,
        (n) =>
          cp[\`slRow\${n}Label\`] !== undefined ||
          cp[\`slRow\${n}Content_variant\`] !== undefined ||
          cp[\`slRow\${n}Content_color\`] !== undefined,
        buildSlCell,
      );
      if (perRow !== null) return perRow;

      return [\`({ value }) => (\`, ...buildSlCell(null, i4), \`\${i3})\`].join("\\n");
    }
    case "Button": {
      use("Button");
      const defaultVariant = cp["buttonContent_variant"] ?? "subtle";
      const defaultColor = cp["buttonContent_color"] ?? "neutral";
      const size = cp["buttonSize"] ?? "small";
      const defaultLoading = cp["buttonContent_loading"] === "true";
      const defaultHasLeading = !defaultLoading && cp["buttonContent_leading"] === "true";
      const defaultHasTrailing = !defaultLoading && cp["buttonContent_trailing"] === "true";

      const buildBtnCell = (rowNum: number | null, base: string): string[] => {
        const inner = ind(base);
        const rcp = (k: string) => (rowNum !== null ? cp[\`btnRow\${rowNum}Content_\${k}\`] : undefined);
        const variant = rcp("variant") ?? defaultVariant;
        const color = rcp("color") ?? defaultColor;
        const loading = rowNum !== null ? cp[\`btnRow\${rowNum}Content_loading\`] === "true" : defaultLoading;
        const rawLeading = rowNum !== null ? cp[\`btnRow\${rowNum}Content_leading\`] === "true" : defaultHasLeading;
        const rawTrailing = rowNum !== null ? cp[\`btnRow\${rowNum}Content_trailing\`] === "true" : defaultHasTrailing;
        const hasLeading = !loading && rawLeading;
        const hasTrailing = !loading && rawTrailing;
        const rowLabel = rowNum !== null ? cp[\`btnRow\${rowNum}Label\`] : undefined;

        let attrs = "";
        attrs += sp("variant", variant, "solid");
        attrs += sp("color", color, "neutral");
        attrs += sp("size", size, "medium");
        if (loading) attrs += " loading";
        if (hasLeading) {
          use("Icon");
          const leadingIcon =
            (rowNum !== null ? cp[\`btnRow\${rowNum}Content_leadingIcon\`] : undefined) ??
            cp["buttonContent_leadingIcon"] ??
            "LfPlusLarge";
          trackIcon(leadingIcon);
          attrs += \` leading={<Icon><\${leadingIcon} /></Icon>}\`;
        }
        if (hasTrailing) {
          use("Icon");
          const trailingIcon =
            (rowNum !== null ? cp[\`btnRow\${rowNum}Content_trailingIcon\`] : undefined) ??
            cp["buttonContent_trailingIcon"] ??
            "LfPlusLarge";
          trackIcon(trailingIcon);
          attrs += \` trailing={<Icon><\${trailingIcon} /></Icon>}\`;
        }
        const content = rowLabel !== undefined ? rowLabel : "{value}";
        return [\`\${base}<DataTableCell>\`, \`\${inner}<Button\${attrs}>\${content}</Button>\`, \`\${base}</DataTableCell>\`];
      };

      const perRow = buildPerRowBlocks(
        rowCount,
        indent,
        true,
        (n) =>
          cp[\`btnRow\${n}Label\`] !== undefined ||
          cp[\`btnRow\${n}Content_variant\`] !== undefined ||
          cp[\`btnRow\${n}Content_color\`] !== undefined ||
          cp[\`btnRow\${n}Content_loading\`] !== undefined ||
          cp[\`btnRow\${n}Content_leading\`] !== undefined ||
          cp[\`btnRow\${n}Content_trailing\`] !== undefined,
        buildBtnCell,
      );
      if (perRow !== null) return perRow;

      return [\`({ value }) => (\`, ...buildBtnCell(null, i4), \`\${i3})\`].join("\\n");
    }
    case "IconButton": {
      use("Tooltip", "IconButton", "Icon");
      const defaultIconKey = cp["iconButtonContent_icon"] ?? "LfPlusLarge";
      const defaultVariant = cp["iconButtonContent_variant"] ?? "subtle";
      const defaultColor = cp["iconButtonContent_color"] ?? "neutral";
      const size = cp["iconButtonSize"] ?? "small";
      const defaultLoading = cp["iconButtonContent_loading"] === "true";
      trackIcon(defaultIconKey);

      const buildIbCell = (rowNum: number | null, base: string): string[] => {
        const inner = ind(base);
        const inner2 = ind(inner);
        const inner3 = ind(inner2);
        const iconKey = (rowNum !== null ? cp[\`ibRow\${rowNum}Content_icon\`] : undefined) ?? defaultIconKey;
        const variant = (rowNum !== null ? cp[\`ibRow\${rowNum}Content_variant\`] : undefined) ?? defaultVariant;
        const color = (rowNum !== null ? cp[\`ibRow\${rowNum}Content_color\`] : undefined) ?? defaultColor;
        const loading = rowNum !== null ? cp[\`ibRow\${rowNum}Content_loading\`] === "true" : defaultLoading;
        if (rowNum !== null && iconKey !== defaultIconKey) trackIcon(iconKey);
        let attrs = \` aria-label="Action"\`;
        attrs += sp("variant", variant, "subtle");
        attrs += sp("color", color, "neutral");
        attrs += sp("size", size, "medium");
        if (loading) attrs += " loading";
        return [
          \`\${base}<DataTableCell>\`,
          \`\${inner}<Tooltip content="Action">\`,
          \`\${inner2}<IconButton\${attrs}>\`,
          \`\${inner3}<Icon><\${iconKey} /></Icon>\`,
          \`\${inner2}</IconButton>\`,
          \`\${inner}</Tooltip>\`,
          \`\${base}</DataTableCell>\`,
        ];
      };

      const perRow = buildPerRowBlocks(
        rowCount,
        indent,
        false,
        (n) =>
          cp[\`ibRow\${n}Content_icon\`] !== undefined ||
          cp[\`ibRow\${n}Content_variant\`] !== undefined ||
          cp[\`ibRow\${n}Content_color\`] !== undefined ||
          cp[\`ibRow\${n}Content_loading\`] !== undefined,
        buildIbCell,
      );
      if (perRow !== null) return perRow;

      return [\`() => (\`, ...buildIbCell(null, i4), \`\${i3})\`].join("\\n");
    }
    case "ButtonGroup": {
      use("ButtonGroup", "Button");

      const buildBgCell = (rowNum: number | null, base: string): string[] => {
        const inner = ind(base);
        const inner2 = ind(inner);
        const inner3 = ind(inner2);
        const inner4 = ind(inner3);
        const btnCount = Math.min(
          Math.max(
            parseInt((rowNum !== null ? cp[\`bgRow\${rowNum}BtnItems\`] : undefined) ?? cp["bgBtnItems"] ?? "3", 10),
            0,
          ),
          5,
        );
        const iconCount = Math.min(
          Math.max(
            parseInt((rowNum !== null ? cp[\`bgRow\${rowNum}IconItems\`] : undefined) ?? cp["bgIconItems"] ?? "1", 10),
            0,
          ),
          5,
        );
        const bgSize = cp["bgSize"] ?? "medium";
        const groupAttrs = sp("size", bgSize, "medium");

        const lines: string[] = [\`\${base}<DataTableCell>\`, \`\${inner}<ButtonGroup\${groupAttrs}>\`];

        for (let bi = 0; bi < btnCount; bi++) {
          const n = bi + 1;
          const pfx = rowNum !== null ? \`bgRow\${rowNum}Btn\${n}_\` : \`bgBtn\${n}_\`;
          const label = cp[\`\${pfx}label\`] ?? \`Action \${n}\`;
          const btnLoading = cp[\`\${pfx}loading\`] === "true";
          const hasLeading = !btnLoading && cp[\`\${pfx}leading\`] === "true";
          const hasTrailing = !btnLoading && cp[\`\${pfx}trailing\`] === "true";
          let btnAttrs = "";
          btnAttrs += sp("variant", cp[\`\${pfx}variant\`] ?? "subtle", "subtle");
          btnAttrs += sp("color", cp[\`\${pfx}color\`] ?? "neutral", "neutral");
          if (btnLoading) btnAttrs += " loading";
          if (hasLeading) {
            use("Icon");
            const leadingIcon = cp[\`\${pfx}leadingIcon\`] ?? "LfPlusLarge";
            trackIcon(leadingIcon);
            btnAttrs += \` leading={<Icon><\${leadingIcon} /></Icon>}\`;
          }
          if (hasTrailing) {
            use("Icon");
            const trailingIcon = cp[\`\${pfx}trailingIcon\`] ?? "LfPlusLarge";
            trackIcon(trailingIcon);
            btnAttrs += \` trailing={<Icon><\${trailingIcon} /></Icon>}\`;
          }
          lines.push(\`\${inner2}<Button\${btnAttrs}>\${label}</Button>\`);
        }

        if (iconCount > 0) {
          use("IconButton", "Tooltip", "Icon");
          for (let ii = 0; ii < iconCount; ii++) {
            const n = ii + 1;
            const pfx = rowNum !== null ? \`bgRow\${rowNum}Icon\${n}_\` : \`bgIcon\${n}_\`;
            const iconKey = cp[\`\${pfx}icon\`] ?? "LfPlusLarge";
            trackIcon(iconKey);
            const iconLoading = cp[\`\${pfx}loading\`] === "true";
            let iconBtnAttrs = sp("variant", cp[\`\${pfx}variant\`] ?? "subtle", "subtle");
            iconBtnAttrs += sp("color", cp[\`\${pfx}color\`] ?? "neutral", "neutral");
            if (iconLoading) iconBtnAttrs += " loading";
            iconBtnAttrs += \` aria-label="Action"\`;
            lines.push(
              \`\${inner2}<Tooltip content="Action">\`,
              \`\${inner3}<IconButton\${iconBtnAttrs}>\`,
              \`\${inner4}<Icon><\${iconKey} /></Icon>\`,
              \`\${inner3}</IconButton>\`,
              \`\${inner2}</Tooltip>\`,
            );
          }
        }

        lines.push(\`\${inner}</ButtonGroup>\`, \`\${base}</DataTableCell>\`);
        return lines;
      };

      const perRow = buildPerRowBlocks(
        rowCount,
        indent,
        false,
        (n) => {
          if (cp[\`bgRow\${n}BtnItems\`] !== undefined || cp[\`bgRow\${n}IconItems\`] !== undefined) return true;
          for (let bi = 1; bi <= 5; bi++) {
            if (
              cp[\`bgRow\${n}Btn\${bi}_variant\`] !== undefined ||
              cp[\`bgRow\${n}Btn\${bi}_color\`] !== undefined ||
              cp[\`bgRow\${n}Btn\${bi}_loading\`] !== undefined ||
              cp[\`bgRow\${n}Btn\${bi}_label\`] !== undefined
            )
              return true;
          }
          for (let ii = 1; ii <= 5; ii++) {
            if (
              cp[\`bgRow\${n}Icon\${ii}_variant\`] !== undefined ||
              cp[\`bgRow\${n}Icon\${ii}_color\`] !== undefined ||
              cp[\`bgRow\${n}Icon\${ii}_loading\`] !== undefined ||
              cp[\`bgRow\${n}Icon\${ii}_icon\`] !== undefined
            )
              return true;
          }
          return false;
        },
        buildBgCell,
      );
      if (perRow !== null) return perRow;

      return [\`() => (\`, ...buildBgCell(null, i4), \`\${i3})\`].join("\\n");
    }
    case "AvatarGroup":
      use("AvatarGroup", "Avatar");
      return [
        \`() => (\`,
        \`\${i4}<DataTableCell>\`,
        \`\${i5}<AvatarGroup>\`,
        \`\${i6}<Avatar name="User A" />\`,
        \`\${i6}<Avatar name="User B" />\`,
        \`\${i5}</AvatarGroup>\`,
        \`\${i4}</DataTableCell>\`,
        \`\${i3})\`,
      ].join("\\n");
    case "TextField":
      use("TextField");
      return \`() => <DataTableCell><TextField /></DataTableCell>\`;
    case "Select": {
      use("Select");
      return \`() => <DataTableCell><Select options={[{ value: "A", label: "Option A" }, { value: "B", label: "Option B" }]} /></DataTableCell>\`;
    }
    case "Combobox": {
      use("Combobox");
      return \`() => <DataTableCell><Combobox options={[{ value: "A", label: "Option A" }, { value: "B", label: "Option B" }]} /></DataTableCell>\`;
    }
    case "TagPicker": {
      use("TagPicker");
      return \`() => <DataTableCell><TagPicker options={[{ value: "A", label: "Tag A" }, { value: "B", label: "Tag B" }]} /></DataTableCell>\`;
    }
    case "TagInput":
      use("TagInput");
      return \`() => <DataTableCell><TagInput /></DataTableCell>\`;
    case "DatePicker":
      use("DatePicker");
      return \`() => <DataTableCell><DatePicker /></DataTableCell>\`;
    default: // "Text"
      return \`({ value }) => <DataTableCell>{value}</DataTableCell>\`;
  }
}

function buildDataTable(p: Props, indent: string): string {
  use("DataTable", "DataTableCell");
  const colCount = Math.min(Math.max(parseInt(pv(p, "colItems", "3"), 10), 1), 8);
  const rowCount = Math.min(Math.max(parseInt(pv(p, "rowItems", "3"), 10), 1), 10);

  // Per-column settings (colScoped: stored as col\${ci}_key in flat props, 0-indexed)
  const cols = Array.from({ length: colCount }, (_, ci) => {
    const prefix = \`col\${ci}_\`;
    const cp: Record<string, string> = Object.fromEntries(
      Object.entries(p ?? {})
        .filter(([k]) => k.startsWith(prefix))
        .map(([k, v]) => [k.slice(prefix.length), v]),
    );
    const colTitle = cp["colTitle"] ?? \`Column \${ci + 1}\`;
    const colContent = cp["colContent"] ?? "Text";
    const usesVal = colContentUsesValue(colContent);
    const rawValues = usesVal ? (cp[getColContentKey(colContent)] ?? "") : "";
    const rowValues = usesVal ? parseN(rawValues, rowCount, "Item") : Array.from({ length: rowCount }, () => "—");
    return { colTitle, colContent, rowValues, cp };
  });

  // Columns using repo pattern: id, name, getValue, renderCell
  const columnEntries = cols
    .map(({ colTitle, colContent, cp }, ci) => {
      const id = \`col\${ci + 1}\`;
      const renderCell = buildDataTableRenderCell(colContent, indent, cp, rowCount);
      return [
        \`\${ind(indent, 2)}{\`,
        \`\${ind(indent, 3)}id: "\${id}",\`,
        \`\${ind(indent, 3)}name: "\${colTitle}",\`,
        \`\${ind(indent, 3)}getValue: (row) => String(row.\${id}),\`,
        \`\${ind(indent, 3)}renderCell: \${renderCell},\`,
        \`\${ind(indent, 2)}},\`,
      ].join("\\n");
    })
    .join("\\n");

  // Rows populated from per-column fieldConfig values
  const rowEntries = Array.from({ length: rowCount }, (_, ri) => {
    const fields = cols.map(({ rowValues }, ci) => \`col\${ci + 1}: "\${rowValues[ri]}"\`).join(", ");
    return \`\${ind(indent, 2)}{ \${fields} },\`;
  }).join("\\n");

  return [
    \`\${indent}<DataTable\`,
    \`\${ind(indent)}columns={[\`,
    columnEntries,
    \`\${ind(indent)}]}\`,
    \`\${ind(indent)}rows={[\`,
    rowEntries,
    \`\${ind(indent)}]}\`,
    \`\${ind(indent)}getRowId={(row) => String(row.col1)}\`,
    \`\${indent}/>\`,
  ].join("\\n");
}

function buildSideNavigation(p: Props, indent: string): string {
  // Icon is passed as IconSource (component class) directly — no <Icon> wrapper needed.
  // This matches the Storybook pattern: icon={LfMenu}
  use("SideNavigation", "SideNavigationGroup", "SideNavigationItem");

  // withGroup=true: read per-group data from custom editor flat props
  //   group\${gi}_items  — item count per group (0-indexed gi)
  //   group\${gi}_labels — comma-separated item labels for group gi
  //   group\${gi}_icon\${ii} — icon key for item ii in group gi (0-indexed)
  if (pb(p, "withGroup")) {
    const groupCount = Math.min(Math.max(parseInt(pv(p, "groups", "2"), 10), 2), 5);

    const groups = Array.from({ length: groupCount }, (_, gi) => {
      const itemCount = Math.min(Math.max(parseInt(pv(p, \`group\${gi}_items\`, "1"), 10), 1), 5);
      const rawLabels = pv(p, \`group\${gi}_labels\`, "");
      const itemLabels = parseN(rawLabels, itemCount, "Item");

      const itemLines = Array.from({ length: itemCount }, (_, ii) => {
        const iconKey = pv(p, \`group\${gi}_icon\${ii}\`, "LfPlusLarge");
        trackIcon(iconKey);
        return \`\${ind(indent, 2)}<SideNavigationItem icon={\${iconKey}} href="#">\${itemLabels[ii]}</SideNavigationItem>\`;
      });

      // Group title: not stored in withGroup editor — use placeholder
      return [
        \`\${ind(indent)}<SideNavigationGroup title="Group \${gi + 1}">\`,
        ...itemLines,
        \`\${ind(indent)}</SideNavigationGroup>\`,
      ].join("\\n");
    }).join("\\n");

    return \`\${indent}<SideNavigation>\\n\${groups}\\n\${indent}</SideNavigation>\`;
  }

  // Plan B mapping (takes priority over legacy "groups" stepper when either field is set):
  //   labels: comma-separated group names        e.g. "メニュー,サブメニュー"
  //   titles: pipe-separated groups; comma-separated items within each group
  //           e.g. "ホーム,契約,設定|レポート,分析"
  // Fallback rules:
  //   - group count = max(labels.length, pipeGroups.length), clamped [2, 5]
  //     if both empty → fall back to "groups" stepper (legacy scaffold, 2 generic items each)
  //   - label missing for index g  → "Group {g+1}"
  //   - titles segment missing for index g → empty item list → scaffold comment
  //   - empty pipe segment (e.g. "A,B||C,D") → scaffold comment for that group
  trackIcon("LfMenu");

  const rawLabels = pv(p, "labels", "");
  const rawTitles = pv(p, "titles", "");

  const groupNames = rawLabels
    ? rawLabels
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const groupItemLists = rawTitles
    ? rawTitles.split("|").map((g) =>
        g
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      )
    : [];

  const hasPlanBInput = groupNames.length > 0 || groupItemLists.length > 0;
  const derivedCount = hasPlanBInput
    ? Math.max(groupNames.length, groupItemLists.length)
    : parseInt(pv(p, "groups", "2"), 10);
  const groupCount = Math.min(Math.max(derivedCount || 2, 2), 5);

  const groups = Array.from({ length: groupCount }, (_, g) => {
    const groupLabel = groupNames[g] ?? \`Group \${g + 1}\`;
    const items = hasPlanBInput ? (groupItemLists[g] ?? []) : null;

    if (items !== null && items.length === 0) {
      // empty group: render scaffold comment so generated code stays valid
      return [
        \`\${ind(indent)}<SideNavigationGroup title="\${groupLabel}">\`,
        \`\${ind(indent, 2)}{/* TODO: add SideNavigationItem components here */}\`,
        \`\${ind(indent)}</SideNavigationGroup>\`,
      ].join("\\n");
    }

    const itemLines = (items ?? ["Item 1", "Item 2"]).map(
      (label) => \`\${ind(indent, 2)}<SideNavigationItem icon={LfMenu} href="#">\${label}</SideNavigationItem>\`,
    );
    return [
      \`\${ind(indent)}<SideNavigationGroup title="\${groupLabel}">\`,
      ...itemLines,
      \`\${ind(indent)}</SideNavigationGroup>\`,
    ].join("\\n");
  }).join("\\n");

  return \`\${indent}<SideNavigation>\\n\${groups}\\n\${indent}</SideNavigation>\`;
}

function buildToolbar(p: Props, indent: string): string {
  use("Toolbar", "ToolbarGroup");
  const groupCount = Math.min(Math.max(parseInt(pv(p, "groups", "2"), 10), 1), 5);
  const orientation = pv(p, "orientation", "horizontal");
  const orientationAttr = sp("orientation", orientation, "horizontal");

  // Helper: read per-item cfg props (stored as group\${gi}_item\${ii}_cfg_\${k})
  const cfgPv = (gi: number, ii: number, k: string, def: string) => pv(p, \`group\${gi}_item\${ii}_cfg_\${k}\`, def);
  const cfgPb = (gi: number, ii: number, k: string) => pb(p, \`group\${gi}_item\${ii}_cfg_\${k}\`);

  const bodyLines: string[] = [];

  for (let gi = 0; gi < groupCount; gi++) {
    // ToolbarSeparator between groups
    if (gi > 0) {
      use("ToolbarSeparator");
      bodyLines.push(\`\${ind(indent)}<ToolbarSeparator />\`);
    }

    const itemCount = Math.min(Math.max(parseInt(pv(p, \`group\${gi}_items\`, "3"), 10), 1), 5);
    const itemLines: string[] = [];

    for (let ii = 0; ii < itemCount; ii++) {
      const itemType = pv(p, \`group\${gi}_item\${ii}_type\`, "IconButton");

      if (itemType === "Button") {
        use("Button");
        const label = cfgPv(gi, ii, "label", "Button");
        const rawVariant = cfgPv(gi, ii, "variant", "plain");
        // "Weight(gutterless)" is stored by the editor — map to the Aegis prop value
        const btnVariant = rawVariant === "Weight(gutterless)" ? "gutterless" : rawVariant;
        const loading = cfgPb(gi, ii, "loading");
        const hasLeading = !loading && cfgPb(gi, ii, "leading");
        const hasTrailing = !loading && cfgPb(gi, ii, "trailing");

        let attrs = sp("variant", btnVariant, "subtle");
        attrs += sp("color", cfgPv(gi, ii, "color", "neutral"), "neutral");
        attrs += sp("size", cfgPv(gi, ii, "size", "medium"), "medium");
        if (loading) attrs += " loading";
        if (hasLeading) {
          use("Icon");
          const leadingIcon = cfgPv(gi, ii, "leadingIcon", "LfPlusLarge");
          trackIcon(leadingIcon);
          attrs += \` leading={<Icon><\${leadingIcon} /></Icon>}\`;
        }
        if (hasTrailing) {
          use("Icon");
          const trailingIcon = cfgPv(gi, ii, "trailingIcon", "LfPlusLarge");
          trackIcon(trailingIcon);
          attrs += \` trailing={<Icon><\${trailingIcon} /></Icon>}\`;
        }
        itemLines.push(\`\${ind(indent, 2)}<Button\${attrs}>\${label}</Button>\`);
      } else {
        // IconButton (default) — wrap in Tooltip per Aegis a11y requirement
        use("IconButton", "Icon", "Tooltip");
        const icon = cfgPv(gi, ii, "icon", "LfPlusLarge");
        trackIcon(icon);
        const loading = cfgPb(gi, ii, "loading");

        let ibAttrs = sp("variant", cfgPv(gi, ii, "variant", "plain"), "plain");
        ibAttrs += sp("color", cfgPv(gi, ii, "color", "neutral"), "neutral");
        ibAttrs += sp("size", cfgPv(gi, ii, "size", "medium"), "medium");
        if (loading) ibAttrs += " loading";
        ibAttrs += \` aria-label="Action"\`;

        itemLines.push(
          \`\${ind(indent, 2)}<Tooltip title="Action">\`,
          \`\${ind(indent, 3)}<IconButton\${ibAttrs}>\`,
          \`\${ind(indent, 4)}<Icon><\${icon} /></Icon>\`,
          \`\${ind(indent, 3)}</IconButton>\`,
          \`\${ind(indent, 2)}</Tooltip>\`,
        );
      }
    }

    bodyLines.push(\`\${ind(indent)}<ToolbarGroup>\`, ...itemLines, \`\${ind(indent)}</ToolbarGroup>\`);
  }

  return \`\${indent}<Toolbar\${orientationAttr}>\\n\${bodyLines.join("\\n")}\\n\${indent}</Toolbar>\`;
}

function buildFormInputJsx(inputType: string, baseIndent: string): string {
  // baseIndent: indentation of the input element itself (inside FormControl)
  switch (inputType) {
    case "TextField":
      use("TextField");
      return \`\${baseIndent}<TextField />\`;
    case "TextArea":
      use("Textarea");
      return \`\${baseIndent}<Textarea />\`;
    case "Search":
      use("Search");
      return \`\${baseIndent}<Search placeholder="Search..." />\`;
    case "TagInput":
      use("TagInput");
      return \`\${baseIndent}<TagInput />\`;
    case "DateField":
      use("DateField");
      return \`\${baseIndent}<DateField />\`;
    case "DatePicker":
      use("DatePicker");
      return \`\${baseIndent}<DatePicker />\`;
    case "RangeDatePicker":
      use("RangeDatePicker");
      return \`\${baseIndent}<RangeDatePicker />\`;
    case "TimeField":
      use("TimeField");
      return \`\${baseIndent}<TimeField />\`;
    case "TimePicker":
      use("TimePicker");
      return \`\${baseIndent}<TimePicker />\`;
    case "Combobox": {
      use("Combobox");
      const opts = [
        \`\${ind(baseIndent, 2)}{ value: "Option A", label: "Option A" },\`,
        \`\${ind(baseIndent, 2)}{ value: "Option B", label: "Option B" },\`,
        \`\${ind(baseIndent, 2)}{ value: "Option C", label: "Option C" },\`,
      ].join("\\n");
      return [
        \`\${baseIndent}<Combobox\`,
        \`\${ind(baseIndent)}options={[\`,
        opts,
        \`\${ind(baseIndent)}]}\`,
        \`\${baseIndent}/>\`,
      ].join("\\n");
    }
    case "TagPicker": {
      use("TagPicker");
      const opts = [
        \`\${ind(baseIndent, 2)}{ value: "Tag A", label: "Tag A" },\`,
        \`\${ind(baseIndent, 2)}{ value: "Tag B", label: "Tag B" },\`,
        \`\${ind(baseIndent, 2)}{ value: "Tag C", label: "Tag C" },\`,
      ].join("\\n");
      return [
        \`\${baseIndent}<TagPicker\`,
        \`\${ind(baseIndent)}options={[\`,
        opts,
        \`\${ind(baseIndent)}]}\`,
        \`\${baseIndent}/>\`,
      ].join("\\n");
    }
    case "CheckboxGroup":
      use("CheckboxGroup", "Checkbox");
      return [
        \`\${baseIndent}<CheckboxGroup>\`,
        \`\${ind(baseIndent)}<Checkbox>Option 1</Checkbox>\`,
        \`\${ind(baseIndent)}<Checkbox>Option 2</Checkbox>\`,
        \`\${ind(baseIndent)}<Checkbox>Option 3</Checkbox>\`,
        \`\${baseIndent}</CheckboxGroup>\`,
      ].join("\\n");
    case "RadioGroup":
      use("RadioGroup", "Radio");
      return [
        \`\${baseIndent}<RadioGroup>\`,
        \`\${ind(baseIndent)}<Radio>Option 1</Radio>\`,
        \`\${ind(baseIndent)}<Radio>Option 2</Radio>\`,
        \`\${ind(baseIndent)}<Radio>Option 3</Radio>\`,
        \`\${baseIndent}</RadioGroup>\`,
      ].join("\\n");
    default: {
      // "Select" and any unknown value → Select (matches fieldConfig default)
      use("Select");
      const opts = [
        \`\${ind(baseIndent, 2)}{ value: "Option A", label: "Option A" },\`,
        \`\${ind(baseIndent, 2)}{ value: "Option B", label: "Option B" },\`,
        \`\${ind(baseIndent, 2)}{ value: "Option C", label: "Option C" },\`,
      ].join("\\n");
      return [
        \`\${baseIndent}<Select\`,
        \`\${ind(baseIndent)}options={[\`,
        opts,
        \`\${ind(baseIndent)}]}\`,
        \`\${baseIndent}/>\`,
      ].join("\\n");
    }
  }
}

function buildForm(p: Props, indent: string): string {
  use("Form", "FormControl");
  const count = Math.min(Math.max(parseInt(pv(p, "items", "3"), 10), 1), 20);

  const fcOrientation = pv(p, "fcOrientation", "Vertical");
  const isHorizontal = fcOrientation === "Horizontal";
  const orientationAttr = isHorizontal ? ' orientation="horizontal"' : "";

  // labelWidth only applies in horizontal orientation
  const labelWidthRaw = isHorizontal ? pv(p, "labelWidth", "Off") : "Off";
  const labelWidthAttr = labelWidthRaw !== "Off" ? \` width="\${labelWidthRaw}"\` : "";

  // Build <FormControl.Toolbar> lines for a SubItemPopover prefix (e.g. "itemEdit1", "nestedItemEdit1_2")
  // fcIndent: indentation for the enclosing <FormControl> tag
  const buildFcToolbarLines = (prefix: string, fcIndent: string): string[] => {
    use("Button", "Divider");
    const ghostAttr = pb(p, \`\${prefix}_withGhostToolbar\`) ? " ghost" : "";
    const toolbarCount = Math.min(Math.max(parseInt(pv(p, \`\${prefix}_toolbarItems\`, "2"), 10), 1), 3);
    const lines = [\`\${ind(fcIndent)}<FormControl.Toolbar\${ghostAttr}>\`];
    for (let k = 0; k < toolbarCount; k++) {
      if (k > 0) lines.push(\`\${ind(fcIndent, 2)}<Divider />\`);
      const btnLabel =
        toolbarCount === 1
          ? pv(p, \`\${prefix}_btnLabel\`, "Action")
          : pv(p, \`\${prefix}_btnLabel\${k + 1}\`, \`Action \${k + 1}\`);
      lines.push(\`\${ind(fcIndent, 2)}<Button variant="gutterless">\${btnLabel}</Button>\`);
    }
    lines.push(\`\${ind(fcIndent)}</FormControl.Toolbar>\`);
    return lines;
  };

  // Build lines for a single <FormControl> block via SubItemPopover prefix.
  // prefix: e.g. "itemEdit1", "itemEdit1_2", "nestedItemEdit1_2"
  // fallbackLabel: used when prefix_fcLabel is not set
  // fcIndent: indentation for the <FormControl> opening tag
  const buildFcLines = (prefix: string, fallbackLabel: string, inputType: string, fcIndent: string): string[] => {
    const label = pv(p, \`\${prefix}_fcLabel\`, fallbackLabel);
    const required = pb(p, \`\${prefix}_required\`);
    const withToolbar = pb(p, \`\${prefix}_withToolbar\`);
    // fcCaption: FormControl.Caption をフォームコントロールの後に出す
    const hasFcCaption = pb(p, \`\${prefix}_fcCaption\`);
    const captionText = pv(p, \`\${prefix}_fcCaptionText\`, "Caption text");
    // fcGroup: FormControl.Group でメイン入力と別の入力を並列に出す
    const withFcGroup = pb(p, \`\${prefix}_fcGroup\`);
    const fcGroupInputType = pv(p, \`\${prefix}_fcGroupInputType\`, "Select");
    const requiredAttr = required ? " required" : "";
    const lines: string[] = [
      \`\${fcIndent}<FormControl\${orientationAttr}\${requiredAttr}>\`,
      \`\${ind(fcIndent)}<FormControl.Label\${labelWidthAttr}>\${label}</FormControl.Label>\`,
    ];
    if (withToolbar) {
      lines.push(...buildFcToolbarLines(prefix, fcIndent));
    }
    if (withFcGroup) {
      lines.push(\`\${ind(fcIndent)}<FormControl.Group>\`);
      lines.push(buildFormInputJsx(inputType, ind(fcIndent, 2)));
      lines.push(buildFormInputJsx(fcGroupInputType, ind(fcIndent, 2)));
      lines.push(\`\${ind(fcIndent)}</FormControl.Group>\`);
    } else {
      lines.push(buildFormInputJsx(inputType, ind(fcIndent)));
    }
    if (hasFcCaption) {
      lines.push(\`\${ind(fcIndent)}<FormControl.Caption>\${captionText}</FormControl.Caption>\`);
    }
    lines.push(\`\${fcIndent}</FormControl>\`);
    return lines;
  };

  const fieldLines: string[] = [];
  for (let i = 0; i < count; i++) {
    const n = i + 1;
    const formLayout = isHorizontal ? "default" : pv(p, \`item\${n}FormLayout\`, "default");

    if (formLayout === "with group") {
      // Two FormControls in a horizontal group — mirrors ComponentRenderer's <FormGroup> + flex-1 div pattern
      use("FormGroup");
      const type1 = pv(p, \`inputType\${n}\`, "Select");
      const type2 = pv(p, \`inputType\${n}_2\`, "Select");
      const fc1Lines = buildFcLines(\`itemEdit\${n}\`, \`Field \${n}\`, type1, ind(indent, 3));
      const fc2Lines = buildFcLines(\`itemEdit\${n}_2\`, \`Field \${n}-2\`, type2, ind(indent, 3));
      fieldLines.push(
        \`\${ind(indent)}<FormGroup>\`,
        \`\${ind(indent, 2)}<div style={{ flex: 1, minWidth: 0 }}>\`,
        ...fc1Lines,
        \`\${ind(indent, 2)}</div>\`,
        \`\${ind(indent, 2)}<div style={{ flex: 1, minWidth: 0 }}>\`,
        ...fc2Lines,
        \`\${ind(indent, 2)}</div>\`,
        \`\${ind(indent)}</FormGroup>\`,
      );
      continue;
    }

    if (formLayout === "nested") {
      // Parent FormControl + sub FormControls via FormGroup sub={[...]} prop
      use("FormGroup");
      const nestedCount = Math.min(Math.max(parseInt(pv(p, \`nestedItems\${n}\`, "3"), 10), 1), 10);
      const parentInputType = pv(p, \`inputType\${n}\`, "Select");

      // Build sub FC lines; each FC gets a trailing comma inside the sub={[...]} array
      const subFcLines: string[] = [];
      for (let j = 0; j < nestedCount; j++) {
        const m = j + 1;
        const subInputType = pv(p, \`nestedInputType\${n}_\${m}\`, "Select");
        const subFcBlock = buildFcLines(\`nestedItemEdit\${n}_\${m}\`, \`Sub Field \${m}\`, subInputType, ind(indent, 3));
        subFcBlock[subFcBlock.length - 1] += ",";
        subFcLines.push(...subFcBlock);
      }

      const parentFcLines = buildFcLines(\`itemEdit\${n}\`, \`Field \${n}\`, parentInputType, ind(indent, 2));

      fieldLines.push(
        \`\${ind(indent)}<FormGroup\`,
        \`\${ind(indent, 2)}sub={[\`,
        ...subFcLines,
        \`\${ind(indent, 2)}]}\`,
        \`\${ind(indent)}>\`,
        ...parentFcLines,
        \`\${ind(indent)}</FormGroup>\`,
      );
      continue;
    }

    // default: single FormControl with inputType\${n}
    const inputType = pv(p, \`inputType\${n}\`, "Select");
    fieldLines.push(...buildFcLines(\`itemEdit\${n}\`, \`Field \${n}\`, inputType, ind(indent)));
  }

  return \`\${indent}<Form>\\n\${fieldLines.join("\\n")}\\n\${indent}</Form>\`;
}

function buildInformationCard(_p: Props, indent: string): string {
  use("InformationCard", "InformationCardDescription", "Icon");
  trackIcon("LfTable");
  return \`\${indent}<InformationCard leading={<Icon><LfTable /></Icon>}>\\n\${ind(indent)}<InformationCardDescription>Information content.</InformationCardDescription>\\n\${indent}</InformationCard>\`;
}

function buildInformationCardGroup(_p: Props, indent: string): string {
  use("InformationCardGroup", "InformationCard", "InformationCardDescription", "Icon");
  trackIcon("LfTable");
  const card = \`\${ind(indent)}<InformationCard leading={<Icon><LfTable /></Icon>}>\\n\${ind(indent, 2)}<InformationCardDescription>Card description.</InformationCardDescription>\\n\${ind(indent)}</InformationCard>\`;
  return \`\${indent}<InformationCardGroup>\\n\${card}\\n\${card}\\n\${card}\\n\${indent}</InformationCardGroup>\`;
}

// ---------------------------------------------------------------------------
// Main dispatch
// ---------------------------------------------------------------------------

/**
 * Convert a single ContentItem into a JSX string.
 * \`indent\` is the whitespace prefix for the top-level element.
 */
export function buildComponentJsx(item: ContentItem, indent: string): string {
  const p = item.props;
  switch (item.component) {
    case "Button":
      return buildButton(p, indent);
    case "IconButton":
      return buildIconButton(p, indent);
    case "Text":
      return buildText(p, indent);
    case "Banner":
      return buildBanner(p, indent);
    case "Tag":
      return buildTag(p, indent);
    case "StatusLabel":
      return buildStatusLabel(p, indent);
    case "Link":
      return buildLink(p, indent);
    case "Switch":
      return buildSwitch(p, indent);
    case "Checkbox":
      return buildCheckbox(p, indent);
    case "CheckboxCard":
      return buildCheckboxCard(p, indent);
    case "CheckboxGroup":
      return buildCheckboxGroup(p, indent);
    case "RadioCard":
      return buildRadioCard(p, indent);
    case "RadioGroup":
      return buildRadioGroup(p, indent);
    case "TextField":
      return buildTextField(p, indent);
    case "Textarea":
      return buildTextarea(p, indent);
    case "FormControl":
      return buildFormControl(p, indent);
    case "Search":
      return buildSearch(p, indent);
    case "Select":
      return buildSelect(p, indent);
    case "Combobox":
      return buildCombobox(p, indent);
    case "Avatar":
      return buildAvatar(p, indent);
    case "AvatarGroup":
      return buildAvatarGroup(p, indent);
    case "Mark":
      return buildMark(p, indent);
    case "Divider":
      return buildDivider(p, indent);
    case "DividerVertical":
      return buildDividerVertical(p, indent);
    case "Blockquote":
      return buildBlockquote(p, indent);
    case "Breadcrumb":
      return buildBreadcrumb(p, indent);
    case "ButtonGroup":
      return buildButtonGroup(p, indent);
    case "Calendar":
      return buildCalendar(p, indent);
    case "RangeCalendar":
      return buildRangeCalendar(p, indent);
    case "DateField":
      return buildDateField(p, indent);
    case "DatePicker":
      return buildDatePicker(p, indent);
    case "RangeDateField":
      return buildRangeDateField(p, indent);
    case "RangeDatePicker":
      return buildRangeDatePicker(p, indent);
    case "TimeField":
      return buildTimeField(p, indent);
    case "TimePicker":
      return buildTimePicker(p, indent);
    case "RangeTimeField":
      return buildRangeTimeField(p, indent);
    case "RangeTimePicker":
      return buildRangeTimePicker(p, indent);
    case "TagInput":
      return buildTagInput(p, indent);
    case "TagPicker":
      return buildTagPicker(p, indent);
    case "SegmentedControl":
      return buildSegmentedControl(p, indent);
    case "Tabs":
      return buildTabs(p, indent);
    case "TagGroup":
      return buildTagGroup(p, indent);
    case "OrderedList":
      return buildOrderedList(p, indent);
    case "UnorderedList":
      return buildUnorderedList(p, indent);
    case "NavList":
      return buildNavList(p, indent);
    case "DescriptionList":
      return buildDescriptionList(p, indent);
    case "EmptyState":
      return buildEmptyState(p, indent);
    case "FileDrop":
      return buildFileDrop(p, indent);
    case "Code":
      return buildCode(p, indent);
    case "CodeBlock":
      return buildCodeBlock(p, indent);
    case "Pagination":
      return buildPagination(p, indent);
    case "Timeline":
      return buildTimeline(p, indent);
    case "Stepper":
      return buildStepper(p, indent);
    case "Tree":
      return buildTree(p, indent);
    case "Accordion":
      return buildAccordion(p, indent);
    case "ActionList":
      return buildActionList(p, indent);
    case "ContentHeader":
      return buildContentHeader(p, indent);
    case "Card":
      return buildCard(p, indent);
    case "DataTable":
      return buildDataTable(p, indent);
    case "SideNavigation":
      return buildSideNavigation(p, indent);
    case "Toolbar":
      return buildToolbar(p, indent);
    case "Form":
      return buildForm(p, indent);
    case "InformationCard":
      return buildInformationCard(p, indent);
    case "InformationCardGroup":
      return buildInformationCardGroup(p, indent);
    case "Badge":
      return buildBadge(p, indent);
    case "Radio":
      return buildRadio(p, indent);
    case "Skeleton":
      return buildSkeleton(p, indent);
    // Table: no fieldConfig; HTML table structure requires manual implementation
    case "Table":
      return [
        \`\${indent}{/* Table — HTML テーブルが必要な場合は手動で実装してください。\`,
        \`\${indent}     構造化データには DataTable の使用を推奨:\`,
        \`\${indent}     <DataTable columns={[...]} rows={[...]} getRowId={(row) => row.id} /> */}\`,
      ].join("\\n");
    default:
      return \`\${indent}{/* \${item.component} */}\`;
  }
}

/**
 * Collect all Aegis component names needed by the given items.
 * Resets internal tracking state before collecting.
 */
export function collectComponentImports(items: ContentItem[]): string[] {
  COMPONENT_IMPORT_SET.clear();
  ICON_IMPORT_SET.clear();
  // Trigger all builders to populate the sets
  for (const item of items) {
    buildComponentJsx(item, "");
  }
  return [...COMPONENT_IMPORT_SET].sort();
}

/**
 * Collect all icon names needed by the given items.
 * Must be called AFTER collectComponentImports (same render pass).
 */
export function collectIconImports(): string[] {
  // Sets are already populated from collectComponentImports pass
  return [...ICON_IMPORT_SET].sort();
}
`;export{e as default};