var e=`/**
 * Raw HTML preview for Typography Lab.
 *
 * Sections are kept within a content-width wrapper for readability while
 * mixing plain HTML fixtures and Aegis component fixtures in a single flow.
 */

import {
  Button,
  Card,
  CardBody,
  DataTable,
  DataTableCell,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Divider,
  FormControl,
  Select,
  Tab,
  TextField,
  UnorderedList,
} from "@legalforce/aegis-react";
import styles from "../index.module.css";
import { SAMPLE_TEXTS } from "./sample-texts";

const txt = SAMPLE_TEXTS.ja;

// ─── Raw HTML sections ─────────────────────────────────────────────────────────

const HeadingSection = () => {
  const t = txt.sections.heading;
  return (
    <>
      <h2 data-typo-type="title" style={{ margin: 0, fontSize: "1.5rem", lineHeight: "1.8rem" }}>
        {t.title}
      </h2>
      <p data-typo-type="body" style={{ margin: 0 }}>
        {t.description}
      </p>
      <Card variant="fill">
        <CardBody>
          {/*
           * Variant scale preview: data-typo-type="title" opts each row into the Lab title family.
           * inline fontSize + lineHeight pin the raw heading rows to the Aegis variant metrics so
           * size and vertical rhythm do not change between Compare ON/OFF; only weight and
           * letter-spacing are compared.
           *   title.large = 24px (1.5rem) / title.medium = 20px (1.25rem)
           *   title.small = 18px (1.125rem) / title.xSmall = 16px (1rem)
           */}
          <div style={{ paddingBlock: "var(--aegis-space-small)" }}>
            <h1 data-typo-type="title" style={{ margin: 0, fontSize: "1.5rem", lineHeight: "1.8rem" }}>
              {t.titleLarge}
            </h1>
          </div>
          <Divider />
          <div style={{ paddingBlock: "var(--aegis-space-small)" }}>
            <h2 data-typo-type="title" style={{ margin: 0, fontSize: "1.25rem", lineHeight: "1.5rem" }}>
              {t.titleMedium}
            </h2>
          </div>
          <Divider />
          <div style={{ paddingBlock: "var(--aegis-space-small)" }}>
            <h3 data-typo-type="title" style={{ margin: 0, fontSize: "1.125rem", lineHeight: "1.35rem" }}>
              {t.titleSmall}
            </h3>
          </div>
          <Divider />
          <div style={{ paddingBlock: "var(--aegis-space-small)" }}>
            <h4 data-typo-type="title" style={{ margin: 0, fontSize: "1rem", lineHeight: "1.2rem" }}>
              {t.titleXSmall}
            </h4>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

const BodySection = () => {
  const t = txt.sections.body;
  return (
    <>
      <h2 data-typo-type="title" style={{ margin: 0, fontSize: "1.5rem", lineHeight: "1.8rem" }}>
        {t.title}
      </h2>
      <p data-typo-type="body" style={{ margin: 0 }}>
        {t.description}
      </p>
      <Card variant="fill">
        <CardBody>
          {/*
           * Variant scale preview: inline fontSize pins each row to its Aegis body variant size.
           *   body.xLarge = 18px (1.125rem) / body.large = 16px (1rem)
           *   body.medium = 14px (0.875rem) / body.small = 13px (0.8125rem) / body.xSmall = 12px (0.75rem)
           * Lab CSS applies fontWeight / letterSpacing / lineHeight from --typo2-body-default-*.
           * font-size: var(--typo2-body-default-size) is overridden by inline style.
           * Lab ON: Lab weight/spacing/line-height at each variant size.
           * Lab OFF: browser-native <p> styles at each variant size.
           */}
          <div style={{ paddingBlock: "var(--aegis-space-small)" }}>
            <p data-typo-type="body" style={{ margin: 0, fontSize: "1.125rem" }}>
              {t.xLarge}
            </p>
          </div>
          <Divider />
          <div style={{ paddingBlock: "var(--aegis-space-small)" }}>
            <p data-typo-type="body" style={{ margin: 0, fontSize: "1rem" }}>
              {t.large}
            </p>
          </div>
          <Divider />
          <div style={{ paddingBlock: "var(--aegis-space-small)" }}>
            <p data-typo-type="body" style={{ margin: 0, fontSize: "0.875rem" }}>
              {t.medium}
            </p>
          </div>
          <Divider />
          <div style={{ paddingBlock: "var(--aegis-space-small)" }}>
            <p data-typo-type="body" style={{ margin: 0, fontSize: "0.8125rem" }}>
              {t.small}
            </p>
          </div>
          <Divider />
          <div style={{ paddingBlock: "var(--aegis-space-small)" }}>
            <p data-typo-type="body" style={{ margin: 0, fontSize: "0.75rem" }}>
              {t.xSmall}
            </p>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

const ParagraphSection = () => {
  const t = txt.sections.paragraph;
  return (
    <>
      <h2 data-typo-type="title" style={{ margin: 0, fontSize: "1.5rem", lineHeight: "1.8rem" }}>
        {t.title}
      </h2>
      {/*
       * documentTitle: short intro label — uses document.title family.
       * documentBody: long-form paragraphs — uses document.body family.
       * Compare ON/OFF shows Lab documentTitle vs documentBody sizing & spacing differences.
       */}
      <p data-typo-type="documentTitle" style={{ margin: 0 }}>
        {t.documentTitleLabel}
      </p>
      <p data-typo-type="documentBody" style={{ margin: 0 }}>
        {t.paragraphs.map((para, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static content, index is stable
          <span key={i}>
            {i > 0 && (
              <>
                <br />
                <br />
              </>
            )}
            {para}
          </span>
        ))}
      </p>
    </>
  );
};

const CaptionSection = () => {
  const t = txt.sections.caption;
  return (
    <>
      <h2 data-typo-type="title" style={{ margin: 0, fontSize: "1.5rem", lineHeight: "1.8rem" }}>
        {t.title}
      </h2>
      <p data-typo-type="body" style={{ margin: 0 }}>
        {t.lead}
      </p>
      <small data-typo-type="caption" style={{ display: "block" }}>
        {t.caption1}
      </small>
      <small data-typo-type="caption" style={{ display: "block" }}>
        {t.caption2}
      </small>
    </>
  );
};

const RulesSection = () => {
  const t = txt.sections.rules;
  return (
    <>
      <h2 data-typo-type="title" style={{ margin: 0, fontSize: "1.5rem", lineHeight: "1.8rem" }}>
        {t.title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
        {t.items.map((item) => (
          <div key={item.heading} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/*
             * heading: body.emphasis — all three slot properties applied inline so the full
             * emphasis slot (weight + line-height + letter-spacing) is reflected from Lab settings.
             * The <p> still matches the body CSS selector for font-family and font-size.
             * summary / detail: body.default via data-typo-type="body".
             */}
            <p
              data-typo-type="body"
              style={{
                margin: 0,
                fontWeight: "var(--typo2-body-emphasis-weight)",
                lineHeight: "var(--typo2-body-emphasis-lineheight)",
                letterSpacing: "var(--typo2-body-emphasis-spacing)",
              }}
            >
              {item.heading}
            </p>
            <p data-typo-type="body" style={{ margin: 0 }}>
              {item.summary}
            </p>
            <p data-typo-type="body" style={{ margin: 0, opacity: 0.6 }}>
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

// ─── Aegis component sections ──────────────────────────────────────────────────

const DescriptionListSection = () => {
  const t = txt.sections.descriptionList;
  return (
    <>
      <h2 data-typo-type="title" style={{ margin: 0, fontSize: "1.5rem", lineHeight: "1.8rem" }}>
        {t.title}
      </h2>
      <DescriptionList>
        {t.items.map((item) => (
          <DescriptionListItem key={item.term} orientation="horizontal">
            <DescriptionListTerm width="xLarge">{item.term}</DescriptionListTerm>
            <DescriptionListDetail>{item.detail}</DescriptionListDetail>
          </DescriptionListItem>
        ))}
      </DescriptionList>
    </>
  );
};

const ListSection = () => {
  const t = txt.sections.list;
  return (
    <>
      <h2 data-typo-type="title" style={{ margin: 0, fontSize: "1.5rem", lineHeight: "1.8rem" }}>
        {t.title}
      </h2>
      <UnorderedList>
        {t.items.map((item) => (
          <UnorderedList.Item key={item}>{item}</UnorderedList.Item>
        ))}
      </UnorderedList>
    </>
  );
};

const ComponentSection = () => {
  const t = txt.sections.component;
  return (
    <>
      <h2 data-typo-type="title" style={{ margin: 0, fontSize: "1.5rem", lineHeight: "1.8rem" }}>
        {t.title}
      </h2>
      <p data-typo-type="body" style={{ margin: 0 }}>
        {t.description}
      </p>
      <Card variant="fill">
        <CardBody>
          {/*
           * Lab CSS reaches these components only via the data-typo-type="component" wrapper below.
           * Broad tag-name selectors (button, label, etc.) were removed in Phase 3 to prevent
           * Lab CSS from hitting Aegis components in template preview.
           *
           * Inside the wrapper, TYPE_ELEMENT_MAP forceInternals selectors apply:
           *   [data-typo-type="component"] button:not([role="combobox"]) *  → Button inner spans
           *   [data-typo-type="component"] [role="tab"] *                   → Tab inner spans
           *
           * Select trigger (role="combobox") is not covered by forceInternals — its native
           * component.default weight is preserved. [role="option"] is out of scope because
           * Aegis Select renders its listbox in a Portal outside [data-typo-preview-root].
           *
           * Compare ON/OFF shows Lab's component representative slot vs Aegis native defaults.
           * Differences reflect "representative slot design", not selector issues.
           */}
          <div
            data-typo-type="component"
            style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}
          >
            <div style={{ display: "flex", gap: "var(--aegis-space-small)", flexWrap: "wrap" }}>
              <Button variant="solid">{t.buttonPrimary}</Button>
              <Button variant="subtle">{t.buttonSecondary}</Button>
              <Button variant="plain" color="danger">
                {t.buttonDanger}
              </Button>
            </div>
            <div style={{ display: "flex", gap: "var(--aegis-space-small)", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ width: "200px" }}>
                <FormControl>
                  <FormControl.Label>{t.textFieldLabel}</FormControl.Label>
                  <TextField placeholder={t.textFieldPlaceholder} />
                </FormControl>
              </div>
              <div style={{ width: "200px" }}>
                <Select aria-label={t.selectPlaceholder} options={t.selectOptions} />
              </div>
            </div>
            <Tab.Group defaultValue={t.tabLabels[0] ?? ""}>
              <Tab.List>
                {t.tabLabels.map((label) => (
                  <Tab key={label} value={label}>
                    {label}
                  </Tab>
                ))}
              </Tab.List>
            </Tab.Group>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

const TableSection = () => {
  const t = txt.sections.table;
  type Row = { id: string; c0: string; c1: string; c2: string; c3: string };
  const rows: Row[] = t.rows.map((r, i) => ({
    id: String(i),
    c0: r[0] ?? "",
    c1: r[1] ?? "",
    c2: r[2] ?? "",
    c3: r[3] ?? "",
  }));
  return (
    <>
      <h2 data-typo-type="title" style={{ margin: 0, fontSize: "1.5rem", lineHeight: "1.8rem" }}>
        {t.title}
      </h2>
      <DataTable<Row>
        size="small"
        outerBordered
        highlightRowOnHover={false}
        highlightedRows={[]}
        rowReorderable={false}
        columns={([0, 1, 2, 3] as const).map((i) => ({
          id: \`c\${i}\` as keyof Row,
          name: t.columns[i] ?? \`Col \${i}\`,
          getValue: (row: Row) => row[\`c\${i}\` as keyof Row],
          renderCell: ({ value }: { value: string }) => (
            <DataTableCell>
              {/* columns 2 (推奨サイズ) and 3 (行間) contain numeric values — data type */}
              {i === 2 || i === 3 ? <span data-typo-type="data">{value}</span> : value}
            </DataTableCell>
          ),
          pinnable: false as const,
          sortable: false as const,
          reorderable: false as const,
          resizable: false as const,
        }))}
        rows={rows}
        getRowId={(row) => row.id}
      />
    </>
  );
};

// ─── RawPreview ────────────────────────────────────────────────────────────────

export function RawPreview() {
  return (
    <div className={styles.previewRoot}>
      <div style={{ maxWidth: "var(--aegis-layout-width-medium)", width: "100%", marginInline: "auto" }}>
        {/* Hero */}
        <div style={{ paddingBlock: "var(--aegis-space-x4Large)" }}>
          <h1
            data-typo-type="title"
            style={{
              margin: 0,
              fontSize: "2.25rem", // x5Large = 36px — largest Aegis internal size token
              lineHeight: "2.7rem",
            }}
          >
            {txt.pageHero}
          </h1>
        </div>

        <Divider />

        <div className={styles.previewSection}>
          <HeadingSection />
        </div>

        <Divider />

        <div className={styles.previewSection}>
          <BodySection />
        </div>

        <Divider />

        <div className={styles.previewSection}>
          <ParagraphSection />
        </div>

        <Divider />

        <div className={styles.previewSection}>
          <CaptionSection />
        </div>

        <Divider />

        <div className={styles.previewSection}>
          <RulesSection />
        </div>

        <Divider />

        <div className={styles.previewSection}>
          <DescriptionListSection />
        </div>

        <Divider />

        <div className={styles.previewSection}>
          <ListSection />
        </div>

        <Divider />

        <div className={styles.previewSection}>
          <ComponentSection />
        </div>

        <Divider />

        <div className={styles.previewSection}>
          <TableSection />
        </div>
      </div>
    </div>
  );
}
`;export{e as default};