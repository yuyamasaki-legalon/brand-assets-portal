var e=`/**
 * TYPE_ELEMENT_MAP — single source of truth for typography type → CSS selector mapping.
 *
 * Fields:
 * - \`selectors\`      : Selectors for compare fixtures. Lab CSS applies only to these elements.
 * - \`forceInternals\` : Child selectors inside a fixture that must be targeted directly to
 *                      override Aegis's own component CSS (font-weight / letter-spacing / line-height).
 * - \`varPrefix\`      : Used to build CSS variable names: --typo-{varPrefix}-{prop}
 *
 * Design principle — fixture-limited selectors:
 *   All major families (title, body, label, component) use \`[data-typo-type="X"]\` attribute
 *   selectors. Broad tag-name selectors (h1–h4, p, button, label, etc.) were removed because
 *   they unintentionally caught Aegis components in template preview, causing size and weight
 *   mismatches unrelated to the Lab's comparison purpose.
 *
 *   When adding a new selector, prefer \`[data-typo-type="X"]\` over tag-name selectors to
 *   ensure Lab CSS does not leak into template preview or settings panel.
 *
 * Note on \`data-aegis-typography\`:
 *   Aegis uses this attribute internally for its own variant styling. The Typography Lab does
 *   NOT target or depend on it — Lab CSS is driven solely by \`[data-typo-type="*"]\` fixtures.
 *
 * To add a new target element, update the relevant entry here.
 * No changes to typography-vars.ts or index.tsx are required.
 */

import type { TextType } from "./easys-defaults";

export type TypeElementEntry = {
  selectors: string[];
  forceInternals?: string[];
  varPrefix: string;
};

export const TYPE_ELEMENT_MAP: Record<TextType, TypeElementEntry> = {
  title: {
    // title family targets only raw-preview fixtures that carry data-typo-type="title".
    //
    // h1–h4 tag-name selectors were removed because Aegis Text as="h3" and similar components
    // carry their own variant via data-aegis-typography, and must not be forced to the title.large
    // representative value (24px). Tag-name matching caused Text as="h3" variant="body.large.bold"
    // to be treated as title family, producing unnatural size jumps in template preview.
    //
    // raw-preview fixtures that should participate in title comparison must explicitly carry
    // data-typo-type="title". All other h elements keep their Aegis / browser native styles.
    selectors: ['[data-typo-type="title"]'],
    varPrefix: "title",
  },
  documentTitle: {
    selectors: ['[data-typo-type="documentTitle"]'],
    varPrefix: "documentTitle",
  },
  body: {
    // body family targets only raw-preview fixtures with data-typo-type="body".
    // "p" tag-name selector was removed to prevent body text in template preview and
    // settings panel from being caught by Lab CSS.
    selectors: ['[data-typo-type="body"]'],
    varPrefix: "body",
  },
  documentBody: {
    selectors: ['[data-typo-type="documentBody"]'],
    varPrefix: "documentBody",
  },
  label: {
    // label family targets only explicit fixtures with data-typo-type="label".
    // "label:not(.aegis-Checkbox)" tag-name selector was removed to prevent FormControl.Label
    // in template preview and settings panel from being caught by Lab CSS.
    // forceInternals propagates font-weight / letter-spacing / line-height to label elements
    // inside the fixture wrapper, past Aegis's component CSS.
    selectors: ['[data-typo-type="label"]'],
    forceInternals: ['[data-typo-type="label"] label'],
    varPrefix: "label",
  },
  caption: {
    selectors: ["small", '[data-typo-type="caption"]'],
    varPrefix: "caption",
  },
  data: {
    selectors: ['[data-typo-type="data"]'],
    varPrefix: "data",
  },
  component: {
    // component family targets only explicit fixtures with data-typo-type="component".
    // "button:not([role="combobox"])" tag-name selector was removed to prevent SegmentedControl,
    // Pagination, Stepper, and other button-based Aegis components in template preview from
    // being caught by Lab CSS.
    // forceInternals propagates font-weight / letter-spacing / line-height to inner spans of
    // button / tab elements inside the fixture wrapper, past Aegis's component CSS.
    // combobox buttons (Select trigger) are excluded from forceInternals so their native
    // component.default (normal 400) weight is preserved within fixtures.
    selectors: ['[data-typo-type="component"]'],
    forceInternals: [
      '[data-typo-type="component"] button:not([role="combobox"]) *',
      '[data-typo-type="component"] [role="tab"] *',
    ],
    varPrefix: "component",
  },
};
`;export{e as default};