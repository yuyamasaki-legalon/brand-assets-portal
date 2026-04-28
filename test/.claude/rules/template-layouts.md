---
paths: src/pages/**/*.tsx
---

# Template Layout Reference

## Critical Rule
**ALWAYS reference template layouts before implementing any page.**
Do NOT design layouts from scratch - use existing templates as starting points.

## Layout Selection Guide

Use `src/pages/template/CATALOG.md` as the source of truth for the full template inventory. It contains layout categories, keywords, component hints, paths, and service-specific templates.

## Before Implementing a Page

1. **Search `src/pages/template/CATALOG.md`** with keywords from the user's request
2. **Pick the closest template** from the catalog and read its source
3. **Use `pnpm sandbox:create`** for sandbox registration when creating a sandbox page
4. **Adapt the template structure** and follow existing conventions for spacing and component composition

## Quick Decision Tree

- Full-width editor/viewer? → **Fill Layout**
- Form with header/footer? → **Form Layout**
- List/table view? → **List Page**
- Detail/document view? → **Detail Page**
- Settings with sidebar? → **Settings Page**
- Chat/conversation? → **Chat Layout** or **Chat Page**
- Dashboard with KPIs/charts? → **Dashboard Page**
- Form with validation? → **Form Page**
- Dialog patterns? → **Dialog**
- Loading states (skeleton, progress)? → **Loading**
- Error handling (API, form, dialog)? → **Error**
- Empty states? → **Empty**
- User feedback (snackbar, disabled reason)? → **Feedback**
- Basic layout structure? → **PageLayout Patterns**
