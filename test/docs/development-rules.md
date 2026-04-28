# Development Rules and Constraints

Comprehensive rules and constraints for development in aegis-lab.

## Security Constraints

### NEVER Commit Secrets

**Prohibited**:
- `.env` files
- API keys and tokens
- Passwords and credentials
- Any sensitive configuration

**Action if committed**:
1. Immediately invalidate the secret
2. Remove from git history
3. Rotate credentials

### NEVER Expose Sensitive Data

**Prohibited**:
- Logging secrets via `console.log()`
- Including secrets in error messages
- Storing secrets in logs or temporary files

**Best practice**: Use environment variables and never log them.

### NEVER Bypass Authentication

**Requirements**:
- All protected routes must validate authentication
- All API endpoints must verify authorization
- Never implement "TODO: add auth later"

---

## File & Directory Constraints

### NEVER Modify `dist/`

**Why**: Vite auto-generates this directory on every build.

**Impact**: Manual changes will be overwritten on next `pnpm build`.

**What to do**: Edit source files in `src/`, not compiled files in `dist/`.

### NEVER Modify `node_modules/`

**Why**: pnpm manages this directory.

**Impact**: Manual changes will be lost on next `pnpm install`.

**What to do**: Modify dependencies in `package.json`, then run `pnpm install`.

### NEVER Commit Lock Files Manually

**File**: `pnpm-lock.yaml`

**Why**: pnpm auto-generates this file.

**What to do**: Let pnpm manage it automatically. Never manually edit.

---

## Code Reference Constraints

### Reference Guidelines

When providing code examples or learning from existing code:

✅ **DO reference**:
- `src/pages/template/` - Production-quality template code
- `docs/` - Official documentation and guidelines
- `src/components/` - Shared components (review quality first)

❌ **DO NOT reference**:
- `src/pages/sandbox/` - Experimental/prototype code of varying quality
- Not suitable as examples or patterns to follow
- Created for rapid experimentation, not production standards

### Why This Matters

**Sandbox code (`src/pages/sandbox/`)**:
- Created quickly for prototyping
- May not follow best practices
- May have shortcuts or incomplete implementations
- Quality varies significantly

**Template code (`src/pages/template/`)**:
- Production-quality examples
- Follows all development rules
- Proper Aegis component usage
- Suitable as reference patterns

### When Writing New Code

1. **Study templates first**: Review `src/pages/template/` for patterns
2. **Check documentation**: Use `docs/` for guidance
3. **Avoid sandbox code**: Do not copy patterns from `src/pages/sandbox/`
4. **Ask if unsure**: Request clarification rather than copying from sandbox

---

## Code Pattern Constraints

### NEVER Create Custom UI Components

**Rule**: Always use Aegis design system components.

**Prohibited**:
```tsx
// ❌ Bad
const CustomButton = ({ children }) => (
  <button style={{ padding: '10px' }}>{children}</button>
);
```

**Required**:
```tsx
// ✅ Good
import { Button } from '@legalforce/aegis-react';

<Button variant="solid">Submit</Button>
```

**Why**:
- Design consistency
- Accessibility compliance
- Reduced maintenance

### NEVER Use Inline Styles

**Prohibited**:
```tsx
// ❌ Bad
<div style={{ padding: '16px', color: '#333' }}>Content</div>
```

**Required**:
```tsx
// ✅ Good (CSS Modules)
import styles from './MyComponent.module.css';
<div className={styles.container}>Content</div>

// ✅ Good (Aegis tokens)
<div style={{ padding: 'var(--aegis-space-medium)' }}>Content</div>
```

### NEVER Ignore TypeScript Errors

**Prohibited**:
```tsx
// ❌ Bad
// @ts-ignore
const data: any = fetchData();
```

**When acceptable** (with justification):
```tsx
// ✅ Acceptable (with reason)
// @ts-ignore - External library type definitions are incomplete
import { CustomShape } from 'recharts';
```

**Best practice**: Fix type errors at the root cause.

### ALWAYS Verify Aegis Component APIs

**Before using a component**:
1. Check `docs/rules/component/{Component}.md`
2. Verify props with MCP tools: `mcp__aegis__get_component_detail("Button")`
3. Review existing usage in codebase

**Why**: Aegis component APIs change. Always verify current props.

### ALWAYS Fix All Build Errors

**Rule**: `pnpm build` must succeed before PR.

**Includes**:
- TypeScript errors in new code
- TypeScript errors in existing code
- Syntax errors
- Import errors

**No exceptions**: All errors must be resolved.

---

## UI Design Constraints

### NEVER Modify PageLayout Styles

**Rule**: Do not apply style overrides to PageLayout component.

**If changes needed**: Consult Design System team (AG).

**Why**: PageLayout is a standardized component across services.

### NEVER Use Multiple Solid Buttons

**Rule**: Maximum 1 Solid button per screen.

**Solid button usage**: Primary action only (e.g., Save, Submit).

**Example**:
```tsx
// ✅ Good
<Button variant="solid">保存</Button>
<Button variant="subtle">キャンセル</Button>

// ❌ Bad
<Button variant="solid">保存</Button>
<Button variant="solid" color="danger">削除</Button>
```

### NEVER Place Buttons in Table Cells

**Rule**: Use `TableActionCell` instead.

**Why**: Ensures visibility during horizontal scroll.

**Example**:
```tsx
// ✅ Good
<TableActionCell>
  <Button>編集</Button>
</TableActionCell>

// ❌ Bad
<TableCell>
  <Button>編集</Button>
</TableCell>
```

### NEVER Use TextField Standalone

**Rule**: Always wrap in `FormControl` with proper label.

**Example**:
```tsx
// ✅ Good
<FormControl>
  <FormControlLabel>メールアドレス</FormControlLabel>
  <TextField />
</FormControl>

// ❌ Bad
<TextField placeholder="メールアドレス" />
```

**Why**: Accessibility and consistent UX.

### ALWAYS Check Component Rules

**Before using any component**:

1. Read `docs/rules/component/{ComponentName}.md`
2. Look for ⚠️ warnings
3. Follow "RULE" and "指針" markers

### ALWAYS Use PageLayout

**Rule**: All screens must be built on `PageLayout` component.

**Why**: Consistent layout, navigation, and spacing across app.

### ALWAYS Follow Object-Oriented UI

**Rule**: Show objects (nouns) before actions (verbs).

**Good**: Contract list → Edit button
**Bad**: Edit button → Contract list

**Why**: Users need context before taking action.

### ALWAYS Use Danger Color for Deletion

**Rule**: Deletion actions must use `danger` color.

**Example**:
```tsx
<Button variant="subtle" color="danger">削除</Button>
```

### ALWAYS Keep Required Labels Visible

**Rule**: Display "必須" text, not just "*".

**Good**:
```tsx
<FormControlLabel>
  メールアドレス<RequiredBadge />
</FormControlLabel>
```

**Bad**:
```tsx
<FormControlLabel>メールアドレス *</FormControlLabel>
```

**Why**: Accessibility (screen readers cannot interpret "*").

---

## Development Workflow Constraints

### NEVER Skip Linting

**Rule**: Run `pnpm lint` before every commit.

**Better**: Run `pnpm format` (lint + format).

**Why**: Catches issues early, maintains code quality.

### NEVER Skip Type Checking

**Rule**: Run `pnpm build` before every PR.

**Why**: Ensures no type errors in production.

**No exceptions**: Build must succeed.

### NEVER Push Directly to main/master

**Rule**: Always use feature branches and PRs.

**Workflow**:
1. Create feature branch
2. Develop
3. Create PR
4. Get review
5. Merge

### ALWAYS Branch from main

**Rule**: Start new work from latest main.

**Command**:
```bash
git checkout main && git pull && git checkout -b feature/your-feature
```

**Why**: Prevents merge conflicts, ensures latest code.

### NEVER Force Push to main/master

**Rule**: Force push to main/master requires explicit approval.

**When needed**: Coordinate with team first.

---

## Deployment Constraints

### NEVER Deploy Without Approval

**Rule**: `pnpm deploy` requires team approval.

**Why**: Deployment affects production.

**Process**:
1. Request approval
2. Get confirmation
3. Deploy

### NEVER Deploy from Local Machine

**Preferred**: Deploy via CI/CD pipeline.

**Local deployment**: Emergency only, with approval.

---

## Additional Constraints

### NEVER Install Unlisted Dependencies

**Rule**: Discuss new dependencies with team before adding.

**Consider**:
- Is it really needed?
- License compatibility?
- Maintenance status?
- Bundle size impact?

### NEVER Modify Deployment Configs

**File**: `wrangler.jsonc`

**Rule**: Changes require team review.

**Why**: Security and infrastructure implications.

---

## Design Principles

Follow Aegis design principles (see [docs/rules/ui/01_principles.md](/docs/rules/ui/01_principles.md)):

1. **Clear (明快)**: One purpose per screen, plain language
2. **Sequential (連続的)**: Consistent with Aegis patterns
3. **Predictive (予測的)**: Minimize steps, smart defaults
4. **Object-Oriented (オブジェクト指向)**: Objects → Actions

---

## Quick Reference

### Before Committing
- ✅ Run `pnpm format`
- ✅ Fix all lint errors
- ✅ Run `pnpm build`
- ✅ Fix all type errors

### Before PR
- ✅ Branch from main
- ✅ Run `pnpm build` (must succeed)
- ✅ No TypeScript errors
- ✅ No Aegis component violations

### Using Aegis Components
- ✅ Read component rules
- ✅ Verify props with MCP tools
- ✅ Use design tokens
- ✅ Never create custom components

---

For more details, see:
- [Aegis Integration Guide](/docs/aegis-integration-guide.md)
- [Workflow Guide](/docs/workflow-guide.md)
- [TypeScript Guide](/docs/typescript-guide.md)
