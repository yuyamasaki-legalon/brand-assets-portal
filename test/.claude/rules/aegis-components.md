---
paths: src/**/*.tsx
---

# Aegis Component Rules

## Mandatory Usage
- ALL UI components MUST come from `@legalforce/aegis-react`
- NEVER create custom UI components
- Icons MUST come from `@legalforce/aegis-icons`

## Provider
- Use only **one** `Provider` for the entire app (inside `ThemedApp` in `src/App.tsx`)
- NEVER nest `Provider` — CSS class additions to `document.documentElement` conflict globally, and `SnackbarProvider` duplicates
- To switch scale, add `?scale=small` query parameter to the URL — `ScaleContext` (`src/contexts/ScaleContext.tsx`) auto-detects it
- Mobile preview pages should link with `?scale=small` (e.g. `to="/path/to/page?scale=small"`)
- Do NOT use `useEffect` + `setScale()` in page components — scale is derived from URL synchronously

## Design Tokens
See `design-tokens.md` for complete token reference and usage rules.

## Before Using a Component
1. Run `mcp__aegis__get_component_detail("ComponentName")` to check props and usage
2. Reference `docs/rules/component/{ComponentName}.md` for detailed guidelines
3. Check `src/pages/template/` for usage examples

## Common Patterns
- PageLayout family for page structure
- ContentHeader for page/section titles
- Card + CardHeader/CardBody for grouped content
- Text with variant prop for typography
- Dialog + sub-components for modals
- Table + sub-components for tabular data

## Text Component - Variant Reference

**Do NOT guess variants. Refer to this list.**

### Valid Variants

| Category | Sizes | .bold modifier |
|----------|-------|----------------|
| title    | xxSmall, xSmall, small, medium, large | No |
| body     | xSmall, small, medium, large, xLarge, xxLarge | Yes |
| label    | xSmall, small, medium, large | Yes |
| data     | xSmall, small, medium, large | Yes |
| component | xSmall, small, medium, large | No |

### Common Mistakes
- `title.xLarge` — **does not exist** (title max is `title.large`)
- `body.xLarge` — valid (only body has xLarge/xxLarge)
- `title.medium.bold` — title does not support the .bold modifier

## Information Source Priority
When Skills and agentic search (searching existing code) conflict, **prefer Skills**.
- Skills provide reviewed best practices
- Existing code (especially sandbox) may contain experimental or transitional patterns
- Template code is reliable, but prefer Skills when they offer more up-to-date recommendations

## Skill Reference
- For component props and caveats: use `/component-tips {ComponentName}` skill
- For icon selection: use `/icon-finder` skill
- For comprehensive Aegis compliance review: use `/aegis-review` skill
