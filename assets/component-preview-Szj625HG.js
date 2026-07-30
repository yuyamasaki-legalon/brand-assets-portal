var e=`/**
 * Component mode preview fixture for Typography Lab — Phase 2 / Phase 3.
 *
 * Renders Aegis components grouped by labType, reproducing the exact
 * component/props combinations measured via Playwright.
 *
 * Usage:
 *   compareMode ON  + Component mode → Aegis native rendering (primary comparison axis)
 *   compareMode OFF + Component mode → Lab settings applied to components
 *
 * Design decisions:
 *   - Button and Tab are both "component" labType; shown as separate sub-roles.
 *   - TextType is NOT split at this stage; sub-role distinction lives here in the fixture.
 *   - ★ marks the variant where Aegis native values match Lab defaults across all three
 *     dimensions: fontSizeKey, fontWeight, and lineHeight (computed, not hardcoded).
 *   - Annotation elements use letterSpacing:"normal" + inline styles to prevent
 *     inheritance from [data-typo-preview-root] or Aegis global body { letter-spacing }.
 *
 * Phase 3 additions:
 *   - TypoDiff: structured per-dimension diff object for future extensibility.
 *   - buildTypoDiff(): computes diff against Lab defaults for a given variant.
 *   - formatDiffAnnotation(): renders diff as "14px · [700 ≠ 400] · lh 1.5 · ls baseline".
 *   - VariantRow now accepts a diff prop; measured annotation is generated, not hardcoded.
 */

import {
  Button,
  ContentHeader,
  ContentHeaderTitle,
  DataTable,
  DataTableCell,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Divider,
  FormControl,
  Tab,
} from "@legalforce/aegis-react";
import { EASYS_DEFAULTS, type TextType } from "./easys-defaults";
import { FONT_SIZE_OPTIONS } from "./font-size-tokens";

// ─── TypoDiff ──────────────────────────────────────────────────────────────────

/**
 * Structured diff between an Aegis native variant and the Lab's current defaults.
 *
 * Each dimension tracks actual (Aegis measured) and lab (EASYS_DEFAULTS) values
 * independently, so consumers can format, display, or compare them without
 * re-computing. Exported for potential use in future panels or tooling.
 */
export type TypoDiff = {
  /** Font size in integer px (rem × 16, rounded). */
  fontSize: { actual: number; lab: number; match: boolean };
  fontWeight: { actual: number; lab: number; match: boolean };
  lineHeight: { actual: number; lab: number; match: boolean };
  /**
   * "baseline" — component inherits Aegis global body { letter-spacing: 0.02em }
   * "normal"   — component resets letter-spacing to 0 internally (e.g. Button)
   */
  nativeLetterSpacing: "baseline" | "normal";
};

/**
 * Computes a TypoDiff for one Aegis component variant against EASYS_DEFAULTS[labType].
 * Font size is resolved via FONT_SIZE_OPTIONS (rem → px), not from the key name string.
 */
function buildTypoDiff(
  labType: TextType,
  fontSizeKey: string,
  fontWeight: number,
  lineHeight: number,
  nativeLetterSpacing: "baseline" | "normal",
): TypoDiff {
  const d = EASYS_DEFAULTS[labType];
  const variantRem = FONT_SIZE_OPTIONS[labType].find((e) => e.key === fontSizeKey)?.rem ?? 0;
  const defaultRem = FONT_SIZE_OPTIONS[labType].find((e) => e.key === d.fontSizeKey)?.rem ?? 0;
  const actualPx = Math.round(variantRem * 16);
  const labPx = Math.round(defaultRem * 16);

  return {
    fontSize: { actual: actualPx, lab: labPx, match: actualPx === labPx },
    fontWeight: { actual: fontWeight, lab: d.fontWeight, match: fontWeight === d.fontWeight },
    lineHeight: { actual: lineHeight, lab: d.lineHeight, match: lineHeight === d.lineHeight },
    nativeLetterSpacing,
  };
}

/** Returns true when ALL three dimensions (size, weight, lineHeight) match the Lab default. */
function isMatchFromDiff(diff: TypoDiff): boolean {
  return diff.fontSize.match && diff.fontWeight.match && diff.lineHeight.match;
}

/**
 * Formats a TypoDiff as a concise annotation string.
 * Matched dimensions are shown as plain values; unmatched dimensions are shown as [actual ≠ lab].
 *
 * Examples:
 *   "14px · 700 · lh 1.7 · ls baseline"           — all dimensions match
 *   "14px · [400 ≠ 700] · lh 1.5 · ls baseline"   — weight mismatch
 *   "[24px ≠ 20px] · 700 · lh 1.2 · ls baseline"  — size mismatch
 *   "14px · 700 · lh [1.7 ≠ 1.5] · ls baseline"   — lineHeight mismatch
 */
function formatDiffAnnotation(diff: TypoDiff): string {
  const sizeStr = diff.fontSize.match
    ? \`\${diff.fontSize.actual}px\`
    : \`[\${diff.fontSize.actual}px ≠ \${diff.fontSize.lab}px]\`;
  const weightStr = diff.fontWeight.match
    ? \`\${diff.fontWeight.actual}\`
    : \`[\${diff.fontWeight.actual} ≠ \${diff.fontWeight.lab}]\`;
  const lhStr = diff.lineHeight.match
    ? \`lh \${diff.lineHeight.actual}\`
    : \`lh [\${diff.lineHeight.actual} ≠ \${diff.lineHeight.lab}]\`;
  const lsStr = diff.nativeLetterSpacing === "normal" ? "ls normal ⚠" : "ls baseline";
  return \`\${sizeStr} · \${weightStr} · \${lhStr} · \${lsStr}\`;
}

// ─── Layout helpers ────────────────────────────────────────────────────────────

/** Section with a label isolated from Lab CSS via inline styles. */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
      <div
        style={{
          fontSize: "10px",
          fontFamily: "monospace",
          // Explicit letterSpacing to prevent inheritance from body / [data-typo-preview-root]
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--aegis-color-text-subtle)",
          paddingBottom: "var(--aegis-space-xxSmall)",
          borderBottom: "1px solid var(--aegis-color-border-xSubtle)",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

/**
 * Row: component on left, annotation (component/props + diff annotation) on right.
 *
 * Receives a TypoDiff and derives both the measured annotation string and the ★ flag
 * internally — callers pass raw measurement values via buildTypoDiff(), not hardcoded strings.
 *
 * Annotation isolation:
 *   - fontSize: explicit px value (not rem/em)
 *   - letterSpacing: "normal" — prevents inheritance from body { letter-spacing: 0.02em }
 *     and from [data-typo-preview-root]'s 0.02em baseline in Lab CSS
 *   - fontFamily: "monospace" — avoids Lab's --typo-font-family variable
 */
function VariantRow({
  componentLabel,
  diff,
  typoType,
  children,
}: {
  componentLabel: string;
  diff: TypoDiff;
  typoType?: string;
  children: React.ReactNode;
}) {
  const isDefault = isMatchFromDiff(diff);
  const measured = formatDiffAnnotation(diff);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--aegis-space-large)",
        minHeight: "var(--aegis-size-x4Large)",
        paddingBlock: "var(--aegis-space-xSmall)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }} {...(typoType ? { "data-typo-type": typoType } : {})}>
        {children}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
        <span
          style={{
            fontSize: "11px",
            fontFamily: "monospace",
            letterSpacing: "normal", // prevent body/root letter-spacing inheritance
            color: isDefault ? "var(--aegis-color-text-information)" : "var(--aegis-color-text-subtle)",
          }}
        >
          {componentLabel}
          {isDefault ? " ★" : ""}
        </span>
        <span
          style={{
            fontSize: "10px",
            fontFamily: "monospace",
            letterSpacing: "normal", // prevent body/root letter-spacing inheritance
            color: "var(--aegis-color-text-xSubtle)",
          }}
        >
          {measured}
        </span>
      </div>
    </div>
  );
}

/** Small note block isolated from Lab CSS. */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "10px",
        fontFamily: "monospace",
        letterSpacing: "normal",
        color: "var(--aegis-color-text-xSubtle)",
        paddingTop: "var(--aegis-space-xxSmall)",
      }}
    >
      {children}
    </div>
  );
}

// ─── DataTable fixture ─────────────────────────────────────────────────────────

type DtRow = { id: string; col1: string; col2: string };

const DT_COLUMNS = [
  {
    id: "col1" as keyof DtRow,
    name: "Header column",
    getValue: (row: DtRow) => row.col1,
    renderCell: ({ value }: { value: string }) => <DataTableCell>{value}</DataTableCell>,
    pinnable: false as const,
    sortable: false as const,
    reorderable: false as const,
    resizable: false as const,
  },
  {
    id: "col2" as keyof DtRow,
    name: "Second column",
    getValue: (row: DtRow) => row.col2,
    renderCell: ({ value }: { value: string }) => <DataTableCell>{value}</DataTableCell>,
    pinnable: false as const,
    sortable: false as const,
    reorderable: false as const,
    resizable: false as const,
  },
];

const DT_ROWS: DtRow[] = [
  { id: "1", col1: "Body cell value", col2: "Another value" },
  { id: "2", col1: "Body cell value 2", col2: "Another value 2" },
];

// ─── ComponentPreview ──────────────────────────────────────────────────────────

export function ComponentPreview() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-xLarge)",
        padding: "var(--aegis-space-large)",
      }}
    >
      {/* ── Title ────────────────────────────────────────────────────────── */}
      <Section label="Title — ContentHeaderTitle">
        <VariantRow
          componentLabel='ContentHeader size="xLarge"'
          diff={buildTypoDiff("title", "title.xLarge", 700, 1.2, "baseline")}
        >
          <ContentHeader size="xLarge">
            <ContentHeaderTitle>Sample heading text</ContentHeaderTitle>
          </ContentHeader>
        </VariantRow>
        <Divider />
        <VariantRow
          componentLabel='ContentHeader size="large"'
          diff={buildTypoDiff("title", "title.large", 700, 1.2, "baseline")}
        >
          <ContentHeader size="large">
            <ContentHeaderTitle>Sample heading text</ContentHeaderTitle>
          </ContentHeader>
        </VariantRow>
        <Divider />
        <VariantRow
          componentLabel='ContentHeader size="medium" (default)'
          diff={buildTypoDiff("title", "title.medium", 700, 1.2, "baseline")}
        >
          <ContentHeader size="medium">
            <ContentHeaderTitle>Sample heading text</ContentHeaderTitle>
          </ContentHeader>
        </VariantRow>
        <Divider />
        <VariantRow
          componentLabel='ContentHeader size="small"'
          diff={buildTypoDiff("title", "title.small", 700, 1.2, "baseline")}
        >
          <ContentHeader size="small">
            <ContentHeaderTitle>Sample heading text</ContentHeaderTitle>
          </ContentHeader>
        </VariantRow>
        <Divider />
        <VariantRow
          componentLabel='ContentHeader size="xSmall"'
          diff={buildTypoDiff("title", "title.xSmall", 700, 1.2, "baseline")}
        >
          <ContentHeader size="xSmall">
            <ContentHeaderTitle>Sample heading text</ContentHeaderTitle>
          </ContentHeader>
        </VariantRow>
      </Section>

      {/* ── Label ────────────────────────────────────────────────────────── */}
      <Section label="Label — FormControl / DescriptionList">
        <VariantRow
          componentLabel="FormControl.Label"
          diff={buildTypoDiff("label", "label.small", 700, 1.5, "baseline")}
          typoType="label"
        >
          <FormControl>
            <FormControl.Label>フォームフィールドのラベル</FormControl.Label>
          </FormControl>
        </VariantRow>
        <Divider />
        <VariantRow
          componentLabel="DescriptionListTerm (all sizes identical)"
          diff={buildTypoDiff("label", "label.small", 700, 1.5, "baseline")}
          typoType="label"
        >
          <DescriptionList size="large">
            <DescriptionListItem>
              <DescriptionListTerm>用語ラベル</DescriptionListTerm>
              <DescriptionListDetail>説明テキスト</DescriptionListDetail>
            </DescriptionListItem>
          </DescriptionList>
        </VariantRow>
      </Section>

      {/* ── Component: Button (bold / interactive) ───────────────────────── */}
      <Section label="Component — Button (sub-role: interactive / bold)">
        <VariantRow
          componentLabel='Button size="medium" (default)'
          diff={buildTypoDiff("component", "component.medium", 700, 1.7, "normal")}
          typoType="component"
        >
          <Button size="medium" variant="solid">
            保存する
          </Button>
        </VariantRow>
        <Divider />
        <VariantRow
          componentLabel='Button size="small"'
          diff={buildTypoDiff("component", "component.medium", 700, 1.7, "normal")}
          typoType="component"
        >
          <div style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
            <Button size="small" variant="solid">
              保存する
            </Button>
            <Button size="small" variant="subtle">
              キャンセル
            </Button>
            <Button size="small" variant="plain" color="danger">
              削除する
            </Button>
          </div>
        </VariantRow>
        <Divider />
        <VariantRow
          componentLabel='Button size="xSmall"'
          diff={buildTypoDiff("component", "component.small", 700, 1.7, "normal")}
          typoType="component"
        >
          <Button size="xSmall" variant="solid">
            保存する
          </Button>
        </VariantRow>
        <Note>
          ⚠ Button resets letter-spacing to normal (0) via Aegis internal CSS.
          <br />
          compareMode OFF: Lab injects calc(0.02em + delta) — differs from native.
        </Note>
      </Section>

      {/* ── Component: Tab (regular / navigation) ────────────────────────── */}
      <Section label="Component — Tab (sub-role: navigation / regular weight)">
        <VariantRow
          componentLabel="TabsTrigger (no size prop)"
          diff={buildTypoDiff("component", "component.medium", 400, 1.5, "baseline")}
          typoType="component"
        >
          <Tab.Group defaultValue="tab1">
            <Tab.List>
              <Tab value="tab1">概要</Tab>
              <Tab value="tab2">詳細</Tab>
              <Tab value="tab3">設定</Tab>
              <Tab value="tab4">履歴</Tab>
            </Tab.List>
          </Tab.Group>
        </VariantRow>
        <Note>
          Tab uses weight=400 (not 700). Differs from Lab component default (700 = Button sub-role).
          <br />
          isMatchFromDiff → false because weight(400) ≠ EASYS_DEFAULTS.component.fontWeight(700).
        </Note>
      </Section>

      {/* ── Component: DataTable (header 700 + body 400) ─────────────────── */}
      <Section label="Component — DataTable (header · body)">
        <Note>
          Header: {formatDiffAnnotation(buildTypoDiff("component", "component.medium", 700, 1.7, "baseline"))}
          {"  |  "}
          Body: {formatDiffAnnotation(buildTypoDiff("component", "component.medium", 400, 1.7, "baseline"))}
          {"  |  "}
          size prop is layout-only (medium/small typography identical)
        </Note>
        <div data-typo-type="component" style={{ marginTop: "var(--aegis-space-xSmall)" }}>
          <DataTable<DtRow>
            size="medium"
            outerBordered
            highlightRowOnHover={false}
            highlightedRows={[]}
            rowReorderable={false}
            columns={DT_COLUMNS}
            rows={DT_ROWS}
            getRowId={(row) => row.id}
          />
        </div>
      </Section>
    </div>
  );
}
`;export{e as default};