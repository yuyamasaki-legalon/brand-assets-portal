# Aegis Design System Integration Guide

Complete guide to using the Aegis design system in aegis-lab.

## Overview

Aegis is LegalForce's unified design system used across all products. This project integrates Aegis components, design tokens, icons, and patterns to ensure consistency and accessibility.

## Packages

### Core Packages

- **@legalforce/aegis-react** (2.47.1) - React component library
- **@legalforce/aegis-icons** (2.12.0) - Icon set
- **@legalforce/aegis-tokens** (2.13.2) - Design tokens
- **@legalforce/aegis-illustrations** (2.1.5) - Illustrations
- **@legalforce/aegis-logos** (2.3.0) - Logos

### Development Tools

- **@legalforce/aegis-mcp-server** (1.0.1) - MCP tools for Claude Code

---

## Component Usage Workflow

Follow this workflow every time you use an Aegis component:

### Step 1: Check Layout Patterns

Read [docs/rules/ui/03_layouts.md](/docs/rules/ui/03_layouts.md) for page structure guidance.

**Why**: Understand which layout pattern to use (Basic, Form, Table, Dashboard, etc.).

### Step 2: Read Component Rules

Check `docs/rules/component/{ComponentName}.md` for specific component guidelines.

**Example**: Before using `Button`, read `docs/rules/component/Button.md`.

**Look for**:
- ⚠️ Warnings
- "RULE" markers
- "指針" (guideline) markers

### Step 3: Verify Props with MCP Tools

Use MCP tools in Claude Code to verify current props and examples.

**Available in Claude Code**:
```
mcp__aegis__get_component_detail("Button")
```

**Why**: Component APIs may change. Always verify current props.

### Step 4: Implement

Import and use the component with verified props.

**Example**:
```tsx
import { Button } from '@legalforce/aegis-react';

<Button variant="solid" onClick={handleSubmit}>
  保存
</Button>
```

---

## Importing Components

### Components

```tsx
import {
  Button,
  FormControl,
  FormControlLabel,
  TextField,
  PageLayout,
  // ... other components
} from '@legalforce/aegis-react';
```

### Icons

```tsx
import {
  LfMagnifyingGlass,
  LfCloseLarge,
  LfCheck,
  // ... other icons
} from '@legalforce/aegis-icons';
```

### Design Tokens (in CSS)

```css
/* Import tokens in CSS files */
@import '@legalforce/aegis-tokens/css/variables.css';

.container {
  padding: var(--aegis-space-medium);
  background-color: var(--aegis-color-background-default);
}
```

---

## Design Principles

Aegis follows 4 core principles:

### 1. Clear (明快)

**One purpose per screen**
- Remove unnecessary information
- Use plain language
- Make UI self-explanatory

**Example**:
- ✅ "契約を作成" (Create contract)
- ❌ "新規契約ドキュメントをシステムに登録" (verbose)

### 2. Sequential (連続的)

**Consistency across services**
- Use common patterns
- Follow Aegis conventions
- Build trust through familiarity

**Example**:
- Use standard button variants (Solid, Subtle, Plain, Gutterless)
- Follow standard form layouts

### 3. Predictive (予測的)

**Minimize user steps**
- Smart defaults
- Progressive disclosure
- Reduce cognitive load

**Example**:
- Pre-fill known information
- Show advanced options only when needed

### 4. Object-Oriented (オブジェクト指向)

**Show objects (nouns) before actions (verbs)**
- Display data first
- Provide actions second
- Give context before interaction

**Example**:
- ✅ Contract list → Edit button
- ❌ Edit button → Contract list

For more details, see [docs/rules/ui/01_principles.md](/docs/rules/ui/01_principles.md).

---

## Design Tokens

### Using Tokens in CSS

```css
/* Colors */
.container {
  background-color: var(--aegis-color-background-default);
  color: var(--aegis-color-text-default);
}

/* Spacing */
.box {
  padding: var(--aegis-space-medium);
  margin: var(--aegis-space-xLarge);
  gap: var(--aegis-space-xSmall);
}

/* Typography */
.text {
  font-size: var(--aegis-font-size-medium);
  font-weight: var(--aegis-font-weight-bold);
  line-height: var(--aegis-line-height-normal);
}

/* Border Radius */
.card {
  border-radius: var(--aegis-radius-medium);
}
```

### Token Categories

| Category | Examples |
|----------|----------|
| **Colors** | `--aegis-color-background-default`, `--aegis-color-text-default`, `--aegis-color-text-information` |
| **Spacing** | `--aegis-space-xSmall`, `--aegis-space-medium`, `--aegis-space-xLarge` |
| **Typography** | `--aegis-font-size-medium`, `--aegis-font-weight-bold`, `--aegis-line-height-normal` |
| **Radius** | `--aegis-radius-small`, `--aegis-radius-medium`, `--aegis-radius-large` |

### Finding Tokens

Use MCP tools in Claude Code:

```
mcp__aegis__list_tokens
```

---

## MCP Tools

MCP (Model Context Protocol) tools provide access to Aegis documentation in Claude Code.

### Available Tools

| Tool | Description |
|------|-------------|
| `mcp__aegis__list_components` | List all available components |
| `mcp__aegis__get_component_detail` | Get detailed component info (props, examples) |
| `mcp__aegis__list_icons` | List all available icons |
| `mcp__aegis__list_tokens` | List all design tokens |
| `mcp__aegis__list_illustrations` | List all illustrations |
| `mcp__aegis__list_component_examples` | View component usage examples |

### Using MCP Tools

**In Claude Code**, you can call these tools directly:

```
# List all components
mcp__aegis__list_components

# Get Button component details
mcp__aegis__get_component_detail("Button")

# List all icons
mcp__aegis__list_icons

# List design tokens
mcp__aegis__list_tokens
```

### MCP Configuration

MCP server is configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "aegis": {
      "command": "npx",
      "args": ["-y", "@legalforce/aegis-mcp-server@latest"]
    }
  }
}
```

When you open the project in Claude Code, MCP tools become available automatically.

---

## Common Components

### Button

```tsx
import { Button } from '@legalforce/aegis-react';

// Primary action (Solid, max 1 per screen)
<Button variant="solid">保存</Button>

// Secondary actions (Subtle)
<Button variant="subtle">キャンセル</Button>

// Destructive action (Danger)
<Button variant="subtle" color="danger">削除</Button>

// Tertiary action (Plain)
<Button variant="plain">詳細を見る</Button>
```

**Rules**:
- Maximum 1 Solid button per screen
- Deletion actions must use `danger` color

### Form Controls

```tsx
import { FormControl, FormControlLabel, TextField } from '@legalforce/aegis-react';

<FormControl>
  <FormControlLabel>
    メールアドレス
    <RequiredBadge />
  </FormControlLabel>
  <TextField
    type="email"
    placeholder="example@example.com"
  />
</FormControl>
```

**Rules**:
- Always wrap TextField in FormControl
- Include proper labels
- Use RequiredBadge for required fields (not just "*")

### PageLayout

```tsx
import { PageLayout } from '@legalforce/aegis-react';

<PageLayout
  title="ページタイトル"
  breadcrumbs={[
    { label: 'ホーム', href: '/' },
    { label: '現在のページ' }
  ]}
>
  {/* Page content */}
</PageLayout>
```

**Rules**:
- Use PageLayout for all screens
- Never override PageLayout styles

For more examples, see component rules in `docs/rules/component/`.

---

## Layout Patterns

Standard page layouts (see [docs/rules/ui/03_layouts.md](/docs/rules/ui/03_layouts.md)):

1. **Basic Layout** - Simple content pages
2. **Form Layout** - Data entry forms
3. **List Page** - Data tables with filters
4. **Dashboard Page** - Metrics and charts
5. **Detail Page** - Entity detail pages

Choose the appropriate pattern for your use case.

---

## Best Practices

### DO

- ✅ Use official Aegis components only
- ✅ Verify props with MCP tools before use
- ✅ Read component rules before implementation
- ✅ Use design tokens instead of hardcoded values
- ✅ Follow Aegis layout patterns
- ✅ Check for component updates regularly

### DON'T

- ❌ Create custom UI components
- ❌ Use inline styles
- ❌ Override Aegis component styles unnecessarily
- ❌ Ignore component rules and warnings
- ❌ Use hardcoded colors, spacing, or typography
- ❌ Skip MCP tool verification

---

## Common Mistakes

### 1. Not Checking Component Rules

**Mistake**: Using components without reading rules.

**Fix**: Always read `docs/rules/component/{Component}.md` first.

### 2. Using Multiple Solid Buttons

**Mistake**: More than 1 Solid button per screen.

**Fix**: Use maximum 1 Solid button (primary action only).

### 3. Placing Buttons in Table Cells

**Mistake**: Buttons directly in `<TableCell>`.

**Fix**: Use `<TableActionCell>` instead.

### 4. Standalone TextField

**Mistake**: Using TextField without FormControl.

**Fix**: Wrap in FormControl with proper label.

### 5. Hardcoded Values

**Mistake**: Using hardcoded colors, spacing.

**Fix**: Use Aegis design tokens.

---

## Resources

- **Component Rules**: `docs/rules/component/`
- **UI Guidelines**: `docs/rules/ui/`
- **Design Principles**: `docs/rules/ui/01_principles.md`
- **Layout Patterns**: `docs/rules/ui/03_layouts.md`
- **MCP Tools**: Available in Claude Code

---

For more information, see:
- [Development Rules](/docs/development-rules.md)
- [UI Design Principles](/docs/rules/ui/01_principles.md)
- [Component Rules Directory](/docs/rules/component/)
