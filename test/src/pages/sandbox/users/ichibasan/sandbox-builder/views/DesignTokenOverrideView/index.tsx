import { LfPlusLarge, LfReply, LfTrash } from "@legalforce/aegis-icons";
import {
  Button,
  Combobox,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  EmptyState,
  FormControl,
  Icon,
  IconButton,
  Search,
  Tab,
  Tag,
  TagGroup,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import stripesFillTexture from "@legalforce/aegis-textures/stripes-fill.svg";
import { useMemo, useRef, useState } from "react";
import type {
  ComponentOverrides,
  DesignTokenOverrideCategory,
  DesignTokenOverrides,
  NewTokenEntry,
} from "../../token-overrides/design-token-overrides";
import {
  buildDesignTokenOverrideExportCSS,
  DEFAULT_TOKEN_REFS,
  PALETTE_OPTIONS,
} from "../../token-overrides/design-token-overrides";
import tokenUsageMap from "../../token-overrides/token-usage-map.json";

type Props = {
  overrides: DesignTokenOverrides;
  onUpsert: (category: DesignTokenOverrideCategory, key: string, value: string) => void;
  onReset: (category: DesignTokenOverrideCategory, key: string) => void;
  newTokens: Record<DesignTokenOverrideCategory, NewTokenEntry[]>;
  onSetNewTokens: React.Dispatch<React.SetStateAction<Record<DesignTokenOverrideCategory, NewTokenEntry[]>>>;
  componentOverrides: ComponentOverrides;
  onSetComponentOverride: (
    component: string,
    category: DesignTokenOverrideCategory,
    key: string,
    value: string | null,
  ) => void;
  onResetComponentOverrides: (component: string) => void;
  newTokenRefs: Record<DesignTokenOverrideCategory, Record<string, string>>;
};

type TokenRow = {
  id: string;
  tokenKey: string;
  defaultRef: string;
  isNew: boolean;
};

const CATEGORY_TABS: { id: DesignTokenOverrideCategory; label: string }[] = [
  { id: "background", label: "background" },
  { id: "foreground", label: "foreground" },
  { id: "border", label: "border" },
];

const CSS_TAB_INDEX = CATEGORY_TABS.length; // 3
const TOKEN_MAP_TAB_INDEX = CATEGORY_TABS.length + 1; // 4

const SWATCH_SIZE = 28;
const SWATCH_OUTLINE = "1px var(--border-default, rgba(0, 0, 0, 0.12)) solid";
const TOKEN_MAP_TABLE_MIN_WIDTH = 1080;
const SWATCH_INSET_PERCENT = "3.5714285714%";
const SWATCH_ALPHA_LEFT_PERCENT = "50%";
const SWATCH_ALPHA_WIDTH_PERCENT = "46.4285714286%";
const SWATCH_ALPHA_HEIGHT_PERCENT = "92.8571428571%";
const SWATCH_RADIUS = "var(--aegis-radius-small)";

const isTransparentPaletteRef = (paletteRef: string) => paletteRef === "scale.transparent";
const isAlphaPaletteRef = (paletteRef: string) => paletteRef.includes("-transparent.");
const toOpaquePaletteRef = (paletteRef: string) => {
  if (!isAlphaPaletteRef(paletteRef)) return paletteRef;
  if (paletteRef.startsWith("scale.white-transparent.")) return "scale.white.1000";
  return paletteRef.replace("-transparent", "");
};

const Swatch = ({ paletteRef }: { paletteRef: string }) => {
  const cssVar = `var(--aegis-internal-color-palette-${paletteRef.replaceAll(".", "-")})`;
  const opaqueCssVar = `var(--aegis-internal-color-palette-${toOpaquePaletteRef(paletteRef).replaceAll(".", "-")})`;

  if (isTransparentPaletteRef(paletteRef)) {
    return (
      <div
        aria-hidden="true"
        style={{
          width: SWATCH_SIZE,
          height: SWATCH_SIZE,
          position: "relative",
          background: "white",
          overflow: "hidden",
          borderRadius: SWATCH_RADIUS,
          outline: SWATCH_OUTLINE,
          outlineOffset: -1,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: SWATCH_INSET_PERCENT,
            width: "calc(100% - 2px)",
            height: "calc(100% - 2px)",
            borderRadius: SWATCH_RADIUS,
            overflow: "hidden",
          }}
        >
          <img
            aria-hidden="true"
            src={stripesFillTexture}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>
    );
  }

  if (isAlphaPaletteRef(paletteRef)) {
    return (
      <div
        aria-hidden="true"
        style={{
          width: SWATCH_SIZE,
          height: SWATCH_SIZE,
          position: "relative",
          background: "white",
          overflow: "hidden",
          borderRadius: SWATCH_RADIUS,
          outline: SWATCH_OUTLINE,
          outlineOffset: -1,
          flexShrink: 0,
        }}
      >
        <img
          aria-hidden="true"
          src={stripesFillTexture}
          alt=""
          style={{
            position: "absolute",
            left: SWATCH_ALPHA_LEFT_PERCENT,
            top: SWATCH_INSET_PERCENT,
            width: SWATCH_ALPHA_WIDTH_PERCENT,
            height: SWATCH_ALPHA_HEIGHT_PERCENT,
            objectFit: "cover",
            display: "block",
            opacity: 0.2,
            borderTopRightRadius: SWATCH_RADIUS,
            borderBottomRightRadius: SWATCH_RADIUS,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: SWATCH_INSET_PERCENT,
            top: SWATCH_INSET_PERCENT,
            width: SWATCH_ALPHA_WIDTH_PERCENT,
            height: SWATCH_ALPHA_HEIGHT_PERCENT,
            background: opaqueCssVar,
            borderTopLeftRadius: SWATCH_RADIUS,
            borderBottomLeftRadius: SWATCH_RADIUS,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: SWATCH_ALPHA_LEFT_PERCENT,
            top: SWATCH_INSET_PERCENT,
            width: SWATCH_ALPHA_WIDTH_PERCENT,
            height: SWATCH_ALPHA_HEIGHT_PERCENT,
            background: cssVar,
            borderTopRightRadius: SWATCH_RADIUS,
            borderBottomRightRadius: SWATCH_RADIUS,
          }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{
        width: SWATCH_SIZE,
        height: SWATCH_SIZE,
        flexShrink: 0,
        borderRadius: SWATCH_RADIUS,
        border: SWATCH_OUTLINE,
        position: "relative",
        background: cssVar,
      }}
    />
  );
};

const COMBOBOX_OPTIONS = PALETTE_OPTIONS.map((opt) => ({
  value: opt,
  label: opt,
  body: (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
      <Swatch paletteRef={opt} />
      <Text as="span" variant="body.medium">
        {opt}
      </Text>
    </div>
  ),
}));

const TEXTAREA_STYLE: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "120px",
  padding: "var(--aegis-space-small)",
  border: "1px solid var(--aegis-color-border-neutral)",
  borderRadius: "var(--aegis-radius-medium)",
  backgroundColor: "var(--aegis-color-background-default)",
  color: "var(--aegis-color-foreground-default)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
  fontSize: "var(--aegis-font-size-body-small)",
  lineHeight: "1.5",
  resize: "none",
  overflow: "auto",
  boxSizing: "border-box",
};

// ─── Token map static data ────────────────────────────────────────────────────

/** Sorted list of all component names in token-usage-map. */
const TOKEN_MAP_COMPONENTS = Array.from(new Set(Object.values(tokenUsageMap).flat())).sort() as string[];

/** Reverse map: component → { background: [...keys], foreground: [...keys], border: [...keys] } */
const COMPONENT_TOKEN_MAP: Record<string, Record<DesignTokenOverrideCategory, string[]>> = {};
for (const [tokenKey, components] of Object.entries(tokenUsageMap) as [string, string[]][]) {
  const match = tokenKey.match(/^--aegis-color-(background|foreground|border)-(.+)$/);
  if (!match) continue;
  const [, category, key] = match;
  for (const comp of components) {
    if (!COMPONENT_TOKEN_MAP[comp]) {
      COMPONENT_TOKEN_MAP[comp] = { background: [], foreground: [], border: [] };
    }
    COMPONENT_TOKEN_MAP[comp][category as DesignTokenOverrideCategory].push(key);
  }
}

// ─── Component override CSS output builder ────────────────────────────────────

const buildComponentCSSOutput = (componentOverrides: ComponentOverrides): string => {
  const sections: string[] = [];
  for (const [comp, overridesForComp] of Object.entries(componentOverrides)) {
    const declarations: string[] = [];
    for (const cat of ["background", "foreground", "border"] as const) {
      for (const [key, paletteRef] of Object.entries(overridesForComp[cat] ?? {})) {
        const cssVar = `--aegis-color-${cat}-${key}`;
        const paletteVar = `--aegis-internal-color-palette-${paletteRef.replaceAll(".", "-")}`;
        declarations.push(`  ${cssVar}: var(${paletteVar});`);
      }
    }
    if (declarations.length > 0) {
      sections.push(`.aegis-${comp} {\n${declarations.join("\n")}\n}`);
    }
  }
  return sections.join("\n\n");
};

// ─── Token map: component-specific override UI ───────────────────────────────

type TokenMapRow = {
  id: string;
  key: string;
  globalValue: string;
  compValue: string | null;
};

type CategoryTableProps = {
  cat: DesignTokenOverrideCategory;
  keys: string[];
  overrides: DesignTokenOverrides;
  componentOverride: DesignTokenOverrides | undefined;
  onSetComponentOverride: (category: DesignTokenOverrideCategory, key: string, value: string | null) => void;
};

const CategoryTable = ({ cat, keys, overrides, componentOverride, onSetComponentOverride }: CategoryTableProps) => {
  const rows = useMemo<TokenMapRow[]>(
    () =>
      keys.map((key) => ({
        id: `${cat}.${key}`,
        key,
        globalValue: overrides[cat]?.[key] ?? DEFAULT_TOKEN_REFS[cat]?.[key] ?? "",
        compValue: componentOverride?.[cat]?.[key] ?? null,
      })),
    [cat, keys, overrides, componentOverride],
  );

  const columns = useMemo(
    (): DataTableColumnDef<TokenMapRow, string>[] => [
      {
        id: "key",
        name: "Token",
        width: "medium",
        minWidth: "small",
        sortable: false,
        pinnable: false,
        reorderable: false,
        resizable: false,
        getValue: (row) => row.key,
        renderCell: ({ row }) => (
          <DataTableCell>
            <Text
              variant="body.small"
              style={{
                display: "block",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                whiteSpace: "nowrap",
              }}
            >
              {row.key}
            </Text>
          </DataTableCell>
        ),
      },
      {
        id: "default",
        name: "Default",
        width: "large",
        minWidth: "medium",
        sortable: false,
        pinnable: false,
        reorderable: false,
        resizable: false,
        getValue: (row) => row.globalValue,
        renderCell: ({ row }) => (
          <DataTableCell>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--aegis-space-xxSmall)",
                minWidth: 0,
              }}
            >
              {row.globalValue && <Swatch paletteRef={row.globalValue} />}
              <Text
                variant="body.xSmall"
                style={{
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "var(--aegis-color-foreground-subtle)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                }}
              >
                {row.globalValue || "—"}
              </Text>
            </div>
          </DataTableCell>
        ),
      },
      {
        id: "override",
        name: "Override",
        width: "xLarge",
        minWidth: "large",
        sortable: false,
        pinnable: false,
        reorderable: false,
        resizable: false,
        getValue: (row) => row.compValue ?? "",
        renderCell: ({ row }) => (
          <DataTableCell>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--aegis-space-xxSmall)",
                width: "100%",
                minWidth: 0,
              }}
            >
              {row.compValue && <Swatch paletteRef={row.compValue} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Combobox
                  aria-label="Component override"
                  options={COMBOBOX_OPTIONS}
                  value={row.compValue}
                  onChange={(value) => onSetComponentOverride(cat, row.key, value)}
                  filter
                  size="medium"
                  placeholder="Component override..."
                  style={{ width: "100%" }}
                />
              </div>
              {row.compValue && (
                <Tooltip title="Delete override" placement="top">
                  <IconButton
                    variant="plain"
                    size="small"
                    aria-label="Delete override"
                    onClick={() => onSetComponentOverride(cat, row.key, null)}
                  >
                    <Icon>
                      <LfReply />
                    </Icon>
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </DataTableCell>
        ),
      },
    ],
    [cat, onSetComponentOverride],
  );

  return (
    <div style={{ width: "100%", minWidth: 0, overflowX: "auto", overflowY: "hidden" }}>
      <div style={{ minWidth: TOKEN_MAP_TABLE_MIN_WIDTH }}>
        <DataTable
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          highlightScope="none"
          outerBordered
          stickyHeader
          size="small"
        />
      </div>
    </div>
  );
};

type TokenMapComponentViewProps = {
  component: string;
  overrides: DesignTokenOverrides;
  componentOverride: DesignTokenOverrides | undefined;
  onSetComponentOverride: (category: DesignTokenOverrideCategory, key: string, value: string | null) => void;
  onResetComponent: () => void;
};

const TokenMapComponentView = ({
  component,
  overrides,
  componentOverride,
  onSetComponentOverride,
  onResetComponent,
}: TokenMapComponentViewProps) => {
  const tokens = COMPONENT_TOKEN_MAP[component];
  if (!tokens) return null;

  const hasOverrides =
    componentOverride &&
    (["background", "foreground", "border"] as const).some(
      (cat) => Object.keys(componentOverride[cat] ?? {}).length > 0,
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
        <Text variant="title.small" style={{ flex: 1 }}>
          {component} Tokens
        </Text>
        {hasOverrides && (
          <Tooltip title={`Delete all ${component} overrides`} placement="top">
            <Button variant="plain" size="small" onClick={onResetComponent}>
              Reset overrides
            </Button>
          </Tooltip>
        )}
      </div>
      {(["background", "foreground", "border"] as const).map((cat) => {
        if (tokens[cat].length === 0) return null;
        return (
          <div key={cat} style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
            <Text
              variant="label.small"
              style={{ color: "var(--aegis-color-foreground-subtle)", textTransform: "uppercase" }}
            >
              {cat}
            </Text>
            <CategoryTable
              cat={cat}
              keys={tokens[cat]}
              overrides={overrides}
              componentOverride={componentOverride}
              onSetComponentOverride={onSetComponentOverride}
            />
          </div>
        );
      })}
    </div>
  );
};

type TokenMapSelectorBarProps = {
  labels: string[];
  activeIndex: number;
  onChange: (index: number) => void;
};

const TokenMapSelectorBar = ({ labels, activeIndex, onChange }: TokenMapSelectorBarProps) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "var(--aegis-space-xxSmall)",
      minWidth: 0,
      width: "100%",
    }}
  >
    {labels.map((label, index) => (
      <Button
        key={label}
        variant={index === activeIndex ? "solid" : "plain"}
        size="small"
        onClick={() => onChange(index)}
        style={{ whiteSpace: "nowrap" }}
      >
        <Text as="span" variant="body.medium">
          {label}
        </Text>
      </Button>
    ))}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const DesignTokenOverrideView = ({
  overrides,
  onUpsert,
  onReset,
  newTokens,
  onSetNewTokens,
  componentOverrides,
  onSetComponentOverride,
  onResetComponentOverrides,
}: Props) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokenMapIndex, setTokenMapIndex] = useState(0);
  const tokenMapLabel = TOKEN_MAP_COMPONENTS[tokenMapIndex] ?? "";

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [tokenRenames, setTokenRenames] = useState<Record<DesignTokenOverrideCategory, Record<string, string>>>({
    background: {},
    foreground: {},
    border: {},
  });

  const isCSSTab = tabIndex === CSS_TAB_INDEX;
  const isTokenMapTab = tabIndex === TOKEN_MAP_TAB_INDEX;
  const category = (CATEGORY_TABS[tabIndex]?.id ?? "background") as DesignTokenOverrideCategory;
  const categoryDefaults = DEFAULT_TOKEN_REFS[category] ?? {};
  const categoryOverrides = overrides[category] ?? {};

  // CSS output: global sections + component sections
  const exportCSS = useMemo(() => {
    const base = buildDesignTokenOverrideExportCSS(overrides);
    const result: Record<DesignTokenOverrideCategory, string> = { ...base };

    for (const cat of ["background", "foreground", "border"] as const) {
      const parts: string[] = [];
      if (base[cat]) parts.push(base[cat]);

      for (const [origKey, newKey] of Object.entries(tokenRenames[cat] ?? {})) {
        if (newKey !== origKey) {
          parts.push(`/* renamed: --aegis-color-${cat}-${origKey} → --aegis-color-${cat}-${newKey} */`);
        }
      }

      for (const t of newTokens[cat] ?? []) {
        if (t.key && t.value) {
          const paletteVar = `--aegis-internal-color-palette-${t.value.replaceAll(".", "-")}`;
          parts.push(`--aegis-color-${cat}-${t.key}: var(${paletteVar}); /* new token */`);
        }
      }

      result[cat] = parts.join("\n");
    }

    return result;
  }, [overrides, tokenRenames, newTokens]);

  const componentCSSOutput = useMemo(() => buildComponentCSSOutput(componentOverrides), [componentOverrides]);

  const rows = useMemo(
    () => [
      ...Object.keys(categoryDefaults).map(
        (key): TokenRow => ({
          id: key,
          tokenKey: key,
          defaultRef: categoryDefaults[key] ?? "",
          isNew: false,
        }),
      ),
      ...(newTokens[category] ?? []).map(
        (t): TokenRow => ({
          id: t.id,
          tokenKey: t.key,
          defaultRef: "",
          isNew: true,
        }),
      ),
    ],
    [categoryDefaults, newTokens, category],
  );

  const highlightedRows = useMemo(
    () => [
      ...Object.entries(categoryOverrides)
        .filter(([key, value]) => value !== (categoryDefaults[key] ?? ""))
        .map(([key]) => key),
      ...(newTokens[category] ?? []).filter((t) => t.key && t.value).map((t) => t.id),
    ],
    [categoryOverrides, categoryDefaults, newTokens, category],
  );

  const showEmpty = useMemo(() => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return !rows.some((row) => {
      const displayName = row.isNew
        ? row.tokenKey.toLowerCase()
        : (tokenRenames[category]?.[row.tokenKey] ?? row.tokenKey).toLowerCase();
      const valueText = row.isNew
        ? ((newTokens[category] ?? []).find((t) => t.id === row.id)?.value ?? "").toLowerCase()
        : (categoryOverrides[row.tokenKey] ?? row.defaultRef).toLowerCase();
      const inUseKey = `--aegis-color-${category}-${row.tokenKey}` as keyof typeof tokenUsageMap;
      const inUseText = row.isNew ? "" : (tokenUsageMap[inUseKey] ?? []).join(",").toLowerCase();
      return displayName.includes(q) || valueText.includes(q) || inUseText.includes(q);
    });
  }, [searchQuery, rows, category, categoryOverrides, newTokens, tokenRenames]);

  const columns = useMemo(
    (): DataTableColumnDef<TokenRow, string>[] => [
      {
        id: "token",
        name: "Token name",
        sortable: false,
        pinnable: false,
        reorderable: false,
        resizable: false,
        getValue: (row): string =>
          row.isNew ? row.tokenKey : (tokenRenames[category]?.[row.tokenKey] ?? row.tokenKey),
        renderCell: ({ row }) => {
          const displayName = row.isNew ? row.tokenKey : (tokenRenames[category]?.[row.tokenKey] ?? row.tokenKey);
          return (
            <DataTableCell style={{ whiteSpace: "normal" }}>
              <TextField
                aria-label="Token name"
                value={displayName}
                onChange={(e) => {
                  const newName = e.target.value;
                  if (row.isNew) {
                    onSetNewTokens((prev) => ({
                      ...prev,
                      [category]: prev[category].map((t) => (t.id === row.id ? { ...t, key: newName } : t)),
                    }));
                  } else {
                    setTokenRenames((prev) => ({
                      ...prev,
                      [category]: { ...prev[category], [row.tokenKey]: newName },
                    }));
                  }
                }}
                size="small"
                style={{
                  width: "100%",
                  minWidth: 0,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                }}
              />
            </DataTableCell>
          );
        },
      },
      {
        id: "value",
        name: "Value",
        sortable: false,
        pinnable: false,
        reorderable: false,
        resizable: false,
        getValue: (row): string => {
          if (row.isNew) return (newTokens[category] ?? []).find((t) => t.id === row.id)?.value ?? "";
          return categoryOverrides[row.tokenKey] ?? row.defaultRef;
        },
        renderCell: ({ row }) => {
          if (row.isNew) {
            const currentValue = (newTokens[category] ?? []).find((t) => t.id === row.id)?.value ?? "";
            return (
              <DataTableCell>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-small)",
                    minWidth: 0,
                    width: "100%",
                  }}
                >
                  <Swatch paletteRef={currentValue || "scale.transparent"} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Combobox
                      aria-label="Token value"
                      options={COMBOBOX_OPTIONS}
                      value={currentValue || null}
                      onChange={(value) => {
                        if (value != null) {
                          onSetNewTokens((prev) => ({
                            ...prev,
                            [category]: prev[category].map((t) => (t.id === row.id ? { ...t, value } : t)),
                          }));
                        }
                      }}
                      filter
                      size="medium"
                      style={{ width: "100%", minWidth: 0 }}
                    />
                  </div>
                  <Tooltip title="Delete" placement="top">
                    <IconButton
                      variant="plain"
                      size="xSmall"
                      aria-label="Delete token"
                      onClick={() =>
                        onSetNewTokens((prev) => ({
                          ...prev,
                          [category]: prev[category].filter((t) => t.id !== row.id),
                        }))
                      }
                    >
                      <Icon>
                        <LfTrash />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              </DataTableCell>
            );
          }

          const overrideRef = categoryOverrides[row.tokenKey];
          const currentValue = overrideRef ?? row.defaultRef;
          const isOverridden = overrideRef !== undefined && overrideRef !== row.defaultRef;

          return (
            <DataTableCell>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--aegis-space-small)",
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <Swatch paletteRef={currentValue} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Combobox
                    aria-label="Token value"
                    options={COMBOBOX_OPTIONS}
                    value={currentValue}
                    onChange={(value) => value != null && onUpsert(category, row.tokenKey, value)}
                    filter
                    size="medium"
                    style={{ width: "100%", minWidth: 0 }}
                  />
                </div>
                {isOverridden ? (
                  <Tooltip title="Reset to default" placement="top">
                    <IconButton
                      variant="plain"
                      size="xSmall"
                      aria-label="Reset to default"
                      onClick={() => onReset(category, row.tokenKey)}
                      style={{ marginLeft: "var(--aegis-space-small)" }}
                    >
                      <Icon>
                        <LfReply />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                ) : null}
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
        getValue: (row): string => {
          if (row.isNew) return "";
          const key = `--aegis-color-${category}-${row.tokenKey}` as keyof typeof tokenUsageMap;
          return (tokenUsageMap[key] ?? []).join(",");
        },
        renderCell: ({ row }) => {
          if (row.isNew) return <DataTableCell />;
          const key = `--aegis-color-${category}-${row.tokenKey}` as keyof typeof tokenUsageMap;
          const components = tokenUsageMap[key] ?? [];
          return (
            <DataTableCell style={{ whiteSpace: "normal" }}>
              {components.length > 0 ? (
                <TagGroup
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--aegis-space-xxSmall)",
                    minWidth: 0,
                    width: "auto",
                    maxWidth: "100%",
                    whiteSpace: "normal",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  {components.map((c) => (
                    <Tag key={c} size="small">
                      {c}
                    </Tag>
                  ))}
                </TagGroup>
              ) : null}
            </DataTableCell>
          );
        },
      },
    ],
    [category, categoryOverrides, onUpsert, onReset, tokenRenames, newTokens, onSetNewTokens],
  );

  const isSinglePanel = isCSSTab || isTokenMapTab;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: isSinglePanel ? "auto minmax(0, 1fr)" : "auto auto minmax(0, 1fr)",
        flex: 1,
        height: "100%",
        minHeight: 0,
        width: "100%",
        minWidth: 0,
        gap: "var(--aegis-space-medium)",
      }}
    >
      <Tab.Group index={tabIndex} onChange={setTabIndex} size="medium">
        <Tab.List>
          {CATEGORY_TABS.map(({ id, label }) => (
            <Tab key={id}>{label}</Tab>
          ))}
          <Tab>Override Design Token</Tab>
          <Tab>Token map</Tab>
        </Tab.List>
      </Tab.Group>

      {/* ── CSS output tab ─────────────────────────────────────────────────── */}
      {isCSSTab ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-large)",
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          {(["background", "foreground", "border"] as const).map((cat) => (
            <FormControl key={cat}>
              <FormControl.Label>{cat}</FormControl.Label>
              <textarea readOnly value={exportCSS[cat]} placeholder="（変更なし）" style={TEXTAREA_STYLE} />
            </FormControl>
          ))}
          {componentCSSOutput && (
            <FormControl>
              <FormControl.Label>component overrides</FormControl.Label>
              <textarea
                readOnly
                value={componentCSSOutput}
                style={{ ...TEXTAREA_STYLE, height: "var(--aegis-size-x15Large)" }}
              />
            </FormControl>
          )}
        </div>

        /* ── Token map tab ───────────────────────────────────────────────────── */
      ) : isTokenMapTab ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-small)",
            height: "100%",
            minHeight: 0,
          }}
        >
          <div style={{ flexShrink: 0, minWidth: 0 }}>
            <TokenMapSelectorBar
              labels={TOKEN_MAP_COMPONENTS}
              activeIndex={tokenMapIndex}
              onChange={setTokenMapIndex}
            />
          </div>
          <div style={{ flex: 1, overflowY: "auto", paddingBlockEnd: "var(--aegis-space-x3Large)" }}>
            {tokenMapLabel && (
              <TokenMapComponentView
                component={tokenMapLabel}
                overrides={overrides}
                componentOverride={componentOverrides[tokenMapLabel]}
                onSetComponentOverride={(cat, key, value) => onSetComponentOverride(tokenMapLabel, cat, key, value)}
                onResetComponent={() => onResetComponentOverrides(tokenMapLabel)}
              />
            )}
          </div>
        </div>

        /* ── background / foreground / border tabs ───────────────────────────── */
      ) : (
        <>
          <div style={{ display: "flex", gap: "var(--aegis-space-small)", alignItems: "center" }}>
            <Search
              aria-label="Search"
              size="medium"
              placeholder="Filter tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button
              variant="subtle"
              size="medium"
              leading={<LfPlusLarge />}
              onClick={() => {
                const id = `new-${crypto.randomUUID()}`;
                onSetNewTokens((prev) => ({
                  ...prev,
                  [category]: [...(prev[category] ?? []), { id, key: "", value: "" }],
                }));
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    const container = tableContainerRef.current;
                    if (!container) return;
                    container.scrollTop = container.scrollHeight;
                    const inputs = container.querySelectorAll<HTMLInputElement>("input");
                    inputs[inputs.length - 1]?.focus();
                  });
                });
              }}
            >
              Add New Token
            </Button>
          </div>
          <div style={{ position: "relative", height: "100%", minHeight: 0, minWidth: 0 }}>
            <div ref={tableContainerRef} style={{ height: "100%", overflow: "auto" }}>
              <DataTable
                columns={columns}
                rows={rows}
                getRowId={(row) => row.id}
                globalFilter={searchQuery}
                highlightedRows={highlightedRows}
                highlightScope="none"
                outerBordered
                stickyHeader
                size="small"
              />
            </div>
            {showEmpty && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--aegis-color-background-default)",
                }}
              >
                <EmptyState size="small" title="No tokens found">
                  Try a different search term.
                </EmptyState>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
