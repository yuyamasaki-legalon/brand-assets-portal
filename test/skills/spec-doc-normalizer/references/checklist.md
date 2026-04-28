# Spec Normalization Checklist

Use this checklist for each target directory.

## 1) Scope

- AI-facing spec files only
- `reference` / `archive` / `source` excluded

## 2) Naming and Wording

- Prototype-specific names removed or generalized
- Legacy project aliases removed
- Functional names unified

## 3) Structure

- Purpose / terms / layout / common behavior / common style separated
- Shared rules centralized
- Duplicate content removed from per-tab/per-card docs
- Section order is readable and intentional
- Heading hierarchy is consistent and non-redundant

## 4) References

- Numeric references replaced with `file + section`
- Ambiguous cross-references removed

## 5) Portability

- No local machine paths or personal IDs
- No prototype-only implementation details
- No source-code-copy notes

## 6) Ownership (Cross-file)

- Unresolved items are in `purpose-and-goals.md`
- Chart style/color is only in `common-chart-style-and-color-spec.md`
- Card-specific details are in tab/card files
- `common-functional-spec.md` contains only cross-card common behavior

## 7) Design Tokens and Values

- Color/style labels use official names from the target design system
- No ad-hoc scale labels (numeric tiers, local labels like `base`) unless officially defined
- Prototype-local constant names removed
- Reusable values remain as `where to apply` + `value` + `purpose`

## 8) Style

- Bullet-first writing
- One requirement per bullet
- No broken bullet indentation
- Unified line pattern within each section (e.g., `ID + sentence + related ids`)

## 9) Final Scan

- No encoding artifacts (`\\x..`, `�`)
- No old words that should have been normalized
- No stale references to removed sections
- No duplicate sections with overlapping content
