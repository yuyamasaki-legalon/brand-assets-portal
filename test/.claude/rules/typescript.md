# TypeScript/Biome Rules

## TypeScript
- strict mode enabled — all strict checks must pass
- No `any` — it disables type checking for that value, hiding real bugs; use proper types or `unknown`
- Remove unused variables and parameters — they signal dead code and confuse readers
- Use `import type` for type-only imports — keeps build output clean by excluding type-only references from emitted JS
- Prefer `interface` for object shapes, `type` for unions/intersections
- No `@ts-expect-error` or `as object` spread workarounds — if a prop causes a type error, update the library version or fix the type definition instead of suppressing. `tsgo` and `tsc` handle `@ts-expect-error` differently, so suppressions cause cross-tool inconsistency

## Biome Formatting

These rules are auto-applied by `pnpm format`. Follow them when writing code so diffs stay minimal:
- 2-space indentation
- Double quotes for strings
- Always use semicolons
- 120 character line width
- Arrow function parentheses always required

## Import Order (auto-organized by Biome)
1. External libraries
2. @legalforce/* packages
3. React/type imports
4. Relative imports
