---
name: spec-doc-normalizer
description: "AI 向け仕様書（SPEC.md 等）の表記統一・正規化。WHEN: ユーザーが仕様書の整理・クリーンアップを依頼したとき、プロジェクト固有の表現を汎用化するとき。NOT WHEN: 仕様書の新規作成（→ spec-generator）、内容レビュー（→ spec-review）。"
---

# Spec Doc Normalizer

## When To Use

- Normalize existing AI-facing spec docs
- Create or reshape a spec set for a new project with a similar structure

## Target Outcome

- Reusable across projects
- Safe to hand to AI implementation agents
- Consistent in structure, ownership, and writing style
- Prototype-driven but production-safe

## Scope Rule

- Edit only AI-facing spec docs
- Exclude `reference`, `archive`, `source`, or raw-copy folders unless explicitly requested

## Recommended Spec Set Layout

- `purpose-and-goals.md`: why, goals, scope, unresolved items
- `terms-and-definitions.md`: glossary, metric definitions, judgment rules
- `layout-and-component-map.md`: page layout and component map
- `common-functional-spec.md`: cross-unit common behavior only
- `common-chart-style-and-color-spec.md`: chart style/color only (create only when chart UI exists)
- `<Container or Area>/...`: container-level and unit-level specific requirements
- `reference/...`: source copies (excluded from normalization unless requested)

## Prototype-To-Spec Workflow (Cross-Project)

- Start from prototype behavior, not prototype code structure
- Extract requirements in this order:
  - user-visible behavior
  - data and judgment rules
  - state/persistence rules
  - permission/error/non-functional rules
- Convert extracted items into the recommended spec set layout
- Move project-specific terms to `terms-and-definitions.md`
- Move shared rules to `common-functional-spec.md`
- Keep per-screen/per-unit differences only in container/unit files
- Remove prototype-only hacks unless user explicitly requests to keep them

## New Project Bootstrap Rules

- For a new project, create the same top-level file set first
- Container file naming priority:
  - use `tab-spec.md` when the container is tab-based
  - use `container-spec.md` when the container is not tab-based
  - do not create both for the same container
- Keep unit file names stable (`<unit>-*.md` such as `card-*.md`, `section-*.md`, `panel-*.md`)
- Map UI differences inside content sections, not by changing the whole structure
- If charts are not used, do not create `common-chart-style-and-color-spec.md`
- If cards are not used, treat major UI units as equivalent requirement owners and keep ownership rules unchanged

## Per-File Content Contract

- `purpose-and-goals.md`
  - include: objective, in-scope, out-of-scope, success criteria, unresolved items
- `terms-and-definitions.md`
  - include: domain terms, metric formulas, boundary rules, date/time rules
- `layout-and-component-map.md`
  - include: mapping table only, owner-file pointers only
  - exclude: detailed behavior rules
- `common-functional-spec.md`
  - include: cross-unit UI/state/auth/API/data/error/NFR/navigation rules
  - include optional domains only when applicable (for example sort, persistence, export)
  - exclude: unit-specific branch logic
- `container-spec.md` (or `tab-spec.md` when tabs exist)
  - include: container-shared controls, shared scope, shared reset, shared persistence
  - exclude: unit-specific display/data logic
- `<unit>-*.md` (for example `card-*.md`, `section-*.md`, `panel-*.md`)
  - include: unit-specific display/interaction/data/validation
  - include references to shared definitions instead of redefining them

## Unit Segmentation Rules (Meaning + Implementation Boundary)

- Define `unit` as a coherent feature block that is likely implemented and tested as one boundary
- Infer units from prototype by combining:
  - purpose cohesion: one user intent / one question answered
  - interaction cohesion: controls that change the same output
  - data cohesion: same aggregation source and judgment rules
  - state cohesion: same local state persistence/restore scope
  - navigation cohesion: same drill-down or transition target
- Prefer split when one block has:
  - different data contract
  - different validation logic
  - different state lifecycle
  - different ownership candidate in implementation
- Prefer merge when multiple blocks only differ visually but share behavior/data/state rules
- Name units by responsibility, not visual form
  - good: `ongoing-status`, `lead-time-trend`, `unassigned-items`
  - avoid: `left-panel-1`, `top-card-a`
- If boundary is ambiguous, choose the smallest independently implementable boundary and note the assumption in `purpose-and-goals.md`
- Visualization style (chart/table/card/list/timeline) is project-specific and must not be assumed as a default

## Unit Extraction Procedure

- Step 1: list all visible behavior blocks from prototype
- Step 2: group by shared input controls and shared output updates
- Step 3: verify each group has one dominant purpose and one data/judgment contract
- Step 4: map each group to one unit spec file
- Step 5: move cross-group rules to `common-functional-spec.md`
- Step 6: keep container file as orchestration only (shared controls, scope, reset, persistence handoff)

## Optional Capability Policy

- Treat chart/table/view-toggle/persistence as optional capabilities, not baseline requirements
- Add capability-specific requirements only when the prototype or product intent explicitly includes them
- If a capability is absent, omit the section entirely rather than writing `not used` repeatedly
- Keep common specs capability-agnostic unless a capability is shared across multiple units
- Chart capability is a specialized extension, not a default UI mode

### Optional Capability Checklist

- `chart`:
  - add chart sections/files only if prototype has chart interactions or chart-specific rules
- `table`:
  - add table sections only if table-specific columns/operations exist
- `view-toggle`:
  - add only if two or more display modes can be switched by user action
- `persistence`:
  - add only if state survives navigation/reload/session boundaries
- `export`:
  - add only if explicit output contract exists (CSV/PDF/API export etc)

## Normalization Rules

- Replace prototype-specific naming with functional naming
- Remove old project tags and parenthetical prototype identifiers
- Remove migration-history prose such as "before merge" and "copied from"
- Replace section-number references (for example `3.4`) with explicit `file + section` references
- Keep one source of truth for shared behavior and remove duplicate repeated rules from container/unit docs
- Remove implementation-locked artifacts that cannot be reused in production

## Ownership Rules

- Keep unresolved or open issues in `purpose-and-goals.md`
- Keep chart style and color only in `common-chart-style-and-color-spec.md`
- Keep unit-specific behavior only in container/unit files
- Keep `common-functional-spec.md` for cross-unit common behavior
- `container-spec.md` (or `tab-spec.md`) owns only container-common behavior
- `<unit>-*.md` owns per-unit display rules, data rules, transitions, and validation points
- Reduce container unit sections to reference-only pointers when unit docs fully own details

## Design Token And Value Rules

- Use official design-system token names for color and style values
- Avoid ad-hoc scale labels that are not official in the target design system
- If a token does not exist, describe behavior semantically and keep concrete values explicit
- Keep reusable chart values in `where to apply + value + purpose` form
- Remove prototype-local constant names from normative text

## Common Functional Spec Rules

- Use one `##` section per domain (`UI`, `state`, `auth`, `API`, `data`, `error`, `NFR`, `naming`)
- Remove duplicate or near-duplicate section titles
- Remove duplicate content between sections and keep one owner section
- Keep only cross-unit common items in `画面・UI仕様`
- Use unified bullet format: ``ID` + one concise sentence + `関連ID``
- Prefer deterministic wording such as `〜は、〜する/できる/できない`

## Scenario And Functional Consolidation Rules

- Use concise functional bullets as the primary style for AI implementation handoff
- Merge duplicated facts from scenario blocks into functional bullets and validation bullets
- Keep coverage parity for boundaries, branches, transitions, and filter interactions
- Remove scenario sections that no longer add unique information
- Remove styling sections that contain only placeholders or links
- Preferred unit structure:
  - `## 機能仕様`
  - behavior bullets
  - `### 検証観点`
- Prefer a section-rich unit format for AI readability
- Keep section headers explicit even when content is short
- Section menu is defined only in `Unit Authoring Template` (single source of truth)

## Cross-Project Generalization Rules

- Keep requirement intent and avoid skin-level UI specifics
- Replace concrete screen labels with role-based labels when not essential
- Keep domain terms only when business-critical
- Avoid prototype code structures, file names, and constants in normative text
- Use portable references (`file + section`) inside the spec set
- Do not bind requirements to one UI library/component name unless mandatory
- Prefer semantic wording (`primary action`, `filter control`, `detail panel`) over product-local labels
- Keep data rules independent from visualization type (table/chart/card)

## Prototype Artifact Removal Rules

- Remove prototype-only data generation, random fallback, mock-only assumptions
- Remove temporary implementation notes such as `for demo`, `for prototype`, `hard-coded`
- Keep only production-meaningful behavior in normative sections
- If temporary behavior must remain, mark clearly as `非本番` in one dedicated bullet

## Unit And Container Boundary Hard Rules

- `container-spec.md` (or `tab-spec.md`) includes shared controls, shared filter scope, shared reset behavior, and shared persistence scope only
- `container-spec.md` (or `tab-spec.md`) must not include per-unit display rules or per-unit branch logic
- `<unit>-*.md` owns unit-specific data rules, view-mode behavior, axis/breakdown behavior, and unit-level validation points
- If the same requirement exists in both container and unit docs, keep the unit version and reduce container text to a pointer

## Spec And Implementation Diff Handling Rules

- Output factual diffs first (`spec statement` vs `implementation behavior`)
- Do not auto-fix both sides
- Apply user-selected priority:
  - `spec-first`
  - `impl-first`
  - `mixed`
- If an item is intentionally out-of-scope or unimplemented, keep one concise `未対応` statement

## Writing Consistency Rules

- Keep style uniform across sections
- Keep sentence patterns uniform
- Keep bullet granularity uniform
- Keep naming uniform for identical concepts
- Remove self-references inside the same file unless necessary to avoid ambiguity
- Remove copy-history notes, transfer notes, and full-transcription markers
- Prefer direct bullets over explanatory paragraphs

## Writing Style Rules

- Prefer concise bullet points
- Keep one requirement per bullet
- Keep one sentence per line
- Keep line breaks explicit for readability
- Fix broken bullet structures and malformed punctuation
- Keep section density high (section-rich format) for AI readability
- Keep the same writing pattern across all unit files
- Avoid mixed styles (scenario prose + functional bullets) in the same file
- Use one language consistently within a spec set (prefer Japanese when project docs are Japanese)

## Unit Authoring Template

- Use these sections as a menu, and include only applicable ones:
  - `## 機能仕様`
  - `### ユニット概要`
  - `### 表示・操作`
  - `### 表示形式別仕様` (if multiple modes exist)
  - `### グラフ表示` (if chart exists)
  - `### テーブル表示` (if table exists)
  - `### 集計・データルール`
  - `### 画面状態の保存` (if persistence exists)
  - `### 出力/エクスポート` (if applicable)
  - `### 遷移/連携` (if applicable)
  - `### 検証観点`
- Keep each bullet as one requirement line
- Put styling references in common files and only keep unit-specific exceptions
- Do not add empty placeholder sections

## Coverage Depth Checklist (Prevent Thin Specs)

- When creating a new spec set from a prototype, compare against a richer baseline spec for the same prototype and capture missing depth before finalizing
- For each container/unit file, verify these viewpoints and add missing bullets if applicable:
  - control details:
    - explicit options list
    - default value
    - visibility condition
    - reset behavior
  - range and boundary rules:
    - date/month constraints
    - inclusive/exclusive boundaries
    - missing/null handling
  - propagation scope:
    - which controls affect which units
    - which conditions are inherited on transition
  - mode-specific behavior:
    - graph/table/etc differences
    - per-mode column/series composition
    - mode switch consistency requirements
  - sorting behavior:
    - sort keys
    - asc/desc options
    - default sort
    - apply scope across modes
  - axis/breakdown behavior:
    - selectable breakdowns
    - label definitions
    - display order
  - navigation and linking:
    - transition trigger points
    - destination and initial tab/view
    - payload/filters passed
  - persistence:
    - what is stored
    - storage scope
    - restore timing
  - empty/error states:
    - 0-case rendering
    - fetch failure handling
    - user recovery action
  - validation coverage:
    - initial state
    - branch transitions
    - boundary values
    - cross-control interactions

## Thin-Spec Detection Heuristics

- Treat a unit doc as under-specified when it lacks both:
  - concrete operation rules (`default/options/reset/sort/mode`)
  - concrete data rules (`definition/boundary/mapping/order`)
- Treat a container doc as under-specified when it only lists unit links without:
  - shared control scope
  - shared reset rules
  - shared propagation rules
- If a prototype clearly has graph/table behavior but the unit doc has no mode-specific section, add it
- If a prototype clearly has sorting but the unit doc has no sort bullets, add key/order/default/apply-scope bullets
- If due-date/status/category labels exist in UI, add canonical definitions or explicit references to definition files

## Thinness Risk Extraction Checklist

- Before deciding "done", explicitly extract and list thinness risks from the draft spec
- Use this checklist to extract risks per file:
  - defaults lost:
    - initial tab/view value changed or omitted
    - default filter/sort/mode value changed or omitted
  - options collapsed:
    - selectable options reduced to abstract labels without concrete option list
    - option order that affects UX not specified
  - boundary detail dropped:
    - due-date/date-range/category boundaries removed
    - inclusive/exclusive day/month boundaries removed
  - mode parity dropped:
    - graph/table parity rules removed
    - per-mode column/series differences removed
  - navigation payload dropped:
    - pane/detail transition destination preserved but handoff filters missing
    - initial pane tab/view on transition missing
  - empty-state branch dropped:
    - hidden/visible conditions for zero data removed
    - empty rendering rules removed
  - table shape dropped:
    - fixed columns and dynamic columns by axis/mode removed
    - open/action column behavior removed
  - role/scope branch dropped:
    - main/sub/both branching behavior removed
    - same rule incorrectly generalized to all scopes
  - implementation-only quirks not triaged:
    - behavior exists in prototype but spec intent is unclear
    - no explicit decision (`spec-first` / `impl-first` / `mixed`)

## Thinness Risk Output Contract

- Output thinness risks as a flat list before finalizing edits
- Each risk item must include:
  - `file`
  - `dropped-or-ambiguous-point`
  - `impact` (implementation ambiguity, regression risk, review gap)
  - `action` (`restore detail`, `reference owner file`, `intentionally omit`)
- If no risks, explicitly state `thinness risk: none`

## Prototype Behavior Coverage Rule

- In addition to viewpoint checklists, capture implemented prototype behavior exhaustively
- Do not close a spec pass until all user-observable interactions in the prototype are represented in spec text
- Treat behavior coverage as mandatory even when project-specific features differ across projects

## Behavior Inventory Procedure

- Step 1: build an interaction inventory from prototype implementation
  - click actions
  - toggle/mode switches
  - filter/select changes
  - reset actions
  - sort changes
  - open/close transitions (pane/modal/drawer)
  - row/segment navigation
  - error/empty recovery actions
- Step 2: for each interaction, document:
  - precondition
  - input/action
  - affected scope (which units update)
  - output/render change
  - side effects (state save, filter handoff, navigation)
  - failure/empty behavior (if any)
- Step 3: place each behavior in the correct owner file
  - container-shared behavior -> container spec
  - unit-specific behavior -> unit spec
  - shared definitions -> common/terms spec

## Behavior Traceability Rule

- For each major behavior block, keep a lightweight source note during drafting
  - component/file name and handler/function name
- Remove verbose code-copy notes in final output, but preserve enough traceability for review

## Coverage Gate (Must Pass)

- Interaction inventory count and spec-covered behavior count must match before completion
- Every high-frequency user action path must have at least one validation bullet
- Every state-changing control must define:
  - default value
  - update scope
  - reset behavior
- Every navigation trigger must define:
  - destination
  - handoff payload/filters
- Thinness risk extraction checklist has been run and resolved

## Reference Hygiene Rules

- Never reference non-existent sections
- Replace old numeric references with explicit `file + section` pointers
- Prefer referencing owner files over restating duplicate rules
- Re-check all references after file split/merge/rename

## Required Validation

```bash
TARGET_SPEC_DIR="src/pages/<path>/documents/spec"
TARGET_FILE="$TARGET_SPEC_DIR/<file>.md"
rg -n "\\x[0-9A-Fa-f]{2}|�|[0-9]+\\.[0-9]+\\s*参照|3\\.4参照" "$TARGET_SPEC_DIR"
rg -n "analytics-MVP team-members|copied from|before merge|for prototype|for demo|hard-coded" "$TARGET_SPEC_DIR"
rg -n "blue-[0-9]{2,3}|\\bbase\\b" "$TARGET_SPEC_DIR"
rg -n "^(##|###|####) " "$TARGET_SPEC_DIR"/*.md
rg -n "^(##|###|####) " "$TARGET_FILE"
rg -n "## シナリオ|```gherkin" "$TARGET_SPEC_DIR"
rg -n "スタイリング仕様（別枠）|not applicable" "$TARGET_SPEC_DIR"
rg -n "layout-and-component-map\\.md.*参照" "$TARGET_SPEC_DIR"
```

- Ensure no encoding artifacts remain
- Ensure no old numeric section references remain
- Ensure no obsolete project or prototype-specific wording remains
- Ensure token and value naming follows the target design system
- Ensure section ownership is clear and non-overlapping
- Ensure container docs do not duplicate unit-owned requirements
- Ensure scenario-to-functional merge preserves boundary and branch coverage
- Ensure bullet-first style is applied consistently

## Output Contract

- files changed
- normalization categories applied
- anything intentionally left unchanged
