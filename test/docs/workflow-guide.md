# Development Workflow Guide

Complete guide to the development workflow for aegis-lab.

## Overview

This guide covers the complete workflow from starting new work to deploying to production.

---

## Starting New Work

### 1. Ensure You're on Latest Main

```bash
git checkout main
git pull origin main
```

**Why**: Start from the latest code to avoid conflicts.

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Naming conventions**:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

**Examples**:
- `feature/add-analytics-dashboard`
- `fix/button-click-handler`
- `refactor/optimize-table-rendering`
- `docs/update-setup-guide`

---

## Development Cycle

### 1. Develop Locally

```bash
# Start development server
pnpm dev
```

Visit http://localhost:5173 and develop your feature.

### 2. Make Changes

- Edit files in `src/`
- Hot Module Replacement (HMR) auto-reloads changes
- Test your changes in the browser

### 3. Check Code Quality (Frequently)

```bash
# Run Biome check with auto-fix
pnpm format
```

**When to run**: After making significant changes, before committing.

### 4. Type Check (Before Committing)

```bash
# Type check + build
pnpm build
```

**Must succeed** before committing. Fix all TypeScript errors.

---

## Committing Changes

### 1. Stage Changes

```bash
# Stage specific files
git add src/pages/MyPage.tsx

# Or stage all changes
git add .
```

### 2. Run Quality Checks

```bash
# Biome format (auto-fix)
pnpm format

# Type check + build (required)
pnpm build
```

Both must succeed before committing.

### 3. Commit

```bash
git commit -m "feat: add analytics dashboard"
```

**Commit message conventions**:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation
- `style:` - Code style (formatting, etc.)
- `test:` - Tests
- `chore:` - Build, configs, etc.

**Examples**:
- `feat: add user analytics dashboard`
- `fix: resolve button click handler error`
- `refactor: optimize table rendering performance`
- `docs: update quick start guide`

---

## Creating a Pull Request

### 1. Push Feature Branch

```bash
# First push
git push -u origin feature/your-feature-name

# Subsequent pushes
git push
```

### 2. Ensure Build Succeeds

**Required before PR**:
```bash
pnpm build
```

Must complete without errors.

### 3. Create PR on GitHub

1. Go to repository on GitHub
2. Click "New pull request"
3. Select your feature branch
4. Fill in PR description:
   - What changes were made
   - Why the changes were needed
   - How to test the changes
5. Submit PR

### 4. Address Review Feedback

- Respond to comments
- Make requested changes
- Push updates to the same branch
- PR auto-updates with new commits

---

## Preview URL Configuration

> 日本語ガイド: [preview-url-guide.ja.md](./preview-url-guide.ja.md)

All PRs automatically get a PR-specific preview URL (`https://pr-{N}-aegis-lab.on-technologies-technical-dept.workers.dev`). To keep a **stable URL per project** (so that shared links do not break as PRs are merged), add a GitHub label of the form `preview:{slug}` to the PR.

### When to use a project label

Use `preview:{slug}` when you want to share a single URL across multiple PRs or with non-engineers (PdM, PO, sales, customers). The URL stays the same even after merge to `main`.

### Slug naming rules

- Lowercase letters (`a-z`), digits, and hyphens only
- Must start with a letter or digit
- Maximum 31 characters
- Examples: `preview:clm-report`, `preview:tabular-review`, `preview:chie-analytics`

**Reserved names** (rejected with a warning):
- `main`, `preview`, `latest`, `production`, `staging`
- `pr-{digits}` (used by the PR-specific URL)

### Resulting URL

`https://{slug}-aegis-lab.on-technologies-technical-dept.workers.dev`

### Behavior after merge to main

- **Snapshot**: After the PR is merged, the project URL keeps the content from the last preview upload. It is **not** updated by the `main` deployment.
- To refresh the snapshot, open a new PR with the same `preview:{slug}` label and merge it. The URL is overwritten with the latest preview.

### Removing a preview label

Removing a `preview:{slug}` label from a PR triggers a best-effort alias cleanup. Cloudflare Workers has no public DELETE API for preview aliases, so cleanup works by overwriting the alias with a tombstone worker that returns **410 Gone**. Cleanup runs in its own workflow job that does **not** depend on the typecheck/build checks or the deploy job, so it runs even on draft PRs and on PRs whose latest commit is failing. A separate `🧹 Preview Alias Cleanup` comment reports one of these outcomes:

- **deleted**: the alias now returns 410 Gone instead of the previous snapshot. Happens when no other **open** PR carries the same label. Merged/closed PRs with the same label are ignored, so sequential reuse (label used on PR #10, later reused on PR #20 after #10 merged) correctly lets the active PR retire the URL.
- **manual cleanup required**: tombstone upload failed (e.g. permissions, transient API error). The alias may still serve the previous snapshot — re-push or re-label to retry.
- **still in use**: another open PR still carries the same `preview:{slug}` label, so the alias is kept. The URL stays live until no open PR advertises it.
- **reserved**: the removed label used a reserved slug (e.g. `preview:pr-123`, `preview:main`). Since such labels are rejected at upload time, no deletion is attempted. This also protects unrelated PRs from having their `pr-{N}` preview URLs dropped by accident.
- **invalid slug**: the removed label did not match the slug format, so no deletion was attempted.

Merging or closing the PR without removing the label leaves the snapshot intact.

### Bulk creating labels

Repository maintainers can pre-create labels under **Settings → Labels → New label** with names like `preview:clm-report`. Non-engineers can then pick from existing labels without typing.

### Multiple labels per PR

Up to 5 `preview:{slug}` labels per PR are honored. Invalid labels are skipped and reported as warnings in the PR comment.

### Shared slugs across open PRs

Project aliases share a global Cloudflare namespace. If two open PRs carry the same `preview:{slug}` label, every deploy overwrites the alias with the most recently pushed PR's content (last deploy wins). To avoid confusion, coordinate within the team so that one slug is used by one PR at a time.

### Workflow triggers

Preview uploads run on PR `opened`, `synchronize`, `reopened`, `ready_for_review`, `labeled`, and `unlabeled`. Adding a `preview:{slug}` label to an existing PR triggers a rebuild that populates the project URL immediately.

---

## Branching Strategy

### Main Branch

- **main** - Production-ready code
- Always stable
- Protected (no direct pushes)
- Requires PR + review

### Feature Branches

- Created from `main`
- One feature per branch
- Deleted after merge

### Workflow

```
main
  └── feature/your-feature
        ├── commit 1
        ├── commit 2
        └── commit 3
          └── PR → Review → Merge back to main
```

---

## Code Review Process

### As Author

1. Create PR with clear description
2. Ensure all checks pass (build, lint)
3. Respond to review comments
4. Make requested changes
5. Re-request review if needed

### As Reviewer

1. Read PR description
2. Check code changes
3. Look for:
   - Adherence to development rules
   - Proper use of Aegis components
   - TypeScript type safety
   - Code quality
4. Provide constructive feedback
5. Approve or request changes

---

## Merging

### After Approval

1. **Squash and merge** (recommended) or **Merge**
2. Delete feature branch (automatic on GitHub)
3. Pull latest `main` locally:
   ```bash
   git checkout main
   git pull
   ```

---

## Deployment

### CI/CD Pipeline (Preferred)

Deployments should go through CI/CD pipeline automatically after merge to `main`.

### Manual Deployment (Requires Approval)

**Only with team approval**:

```bash
# Build + deploy
pnpm deploy

# Or build first, then deploy
pnpm build
pnpm cf:deploy
```

**Important**:
- ❌ Never deploy without approval
- ❌ Avoid local deployments (use CI/CD)
- ✅ Coordinate with team

---

## Complete Workflow Example

### Feature Development

```bash
# 1. Start from main
git checkout main
git pull

# 2. Create feature branch
git checkout -b feature/add-analytics-dashboard

# 3. Start dev server
pnpm dev

# 4. Develop feature
# (edit files, test in browser)

# 5. Check quality frequently
pnpm format

# 6. Before committing: build must succeed
pnpm build

# 7. Commit changes
git add .
git commit -m "feat: add analytics dashboard"

# 8. Push to GitHub
git push -u origin feature/add-analytics-dashboard

# 9. Create PR on GitHub

# 10. Address review feedback
# (make changes, commit, push)

# 11. After approval: merge PR

# 12. Pull latest main
git checkout main
git pull
```

---

## Prototyping Workflow

### Creating Prototypes

```bash
# Create sandbox page
pnpm sandbox:create

# Enter page name (e.g., "user-analytics")
# Select layout template

# Start dev server
pnpm dev

# Visit http://localhost:5173/sandbox/user-analytics

# Develop prototype
# (no need to create PR for experiments)
```

Sandbox pages are for experimentation. No PR required unless promoting to production.

---

## Best Practices

### DO

- ✅ Always branch from latest `main`
- ✅ Run `pnpm format` before committing
- ✅ Ensure `pnpm build` succeeds before PR
- ✅ Write clear commit messages
- ✅ Respond promptly to review feedback
- ✅ Keep PRs focused (one feature per PR)

### DON'T

- ❌ Push directly to `main`
- ❌ Skip linting or type checking
- ❌ Create PRs with build errors
- ❌ Force push to `main` (requires approval)
- ❌ Mix multiple unrelated changes in one PR
- ❌ Deploy without approval

---

## Troubleshooting

### Merge Conflicts

```bash
# Update your branch with latest main
git checkout main
git pull
git checkout feature/your-feature
git rebase main

# Resolve conflicts in editor
# Then:
git add .
git rebase --continue

# Force push (your feature branch only)
git push --force
```

### Build Fails

```bash
# Check error messages
pnpm build

# Fix TypeScript errors
# Then build again
pnpm build
```

### Lint Errors

```bash
# Auto-fix lint errors
pnpm format

# Or manually (read-only):
pnpm lint
```

---

## Workflow Checklist

### Before Starting Work
- [ ] On latest `main`
- [ ] Created feature branch from `main`

### During Development
- [ ] Development server running
- [ ] Changes tested in browser
- [ ] `pnpm format` run periodically

### Before Committing
- [ ] `pnpm format` succeeds
- [ ] `pnpm build` succeeds
- [ ] All TypeScript errors fixed

### Creating PR
- [ ] `pnpm build` succeeds
- [ ] Feature branch pushed
- [ ] Clear PR description
- [ ] Tests pass (if applicable)

### After Merge
- [ ] Pulled latest `main`
- [ ] Feature branch deleted

---

For more information, see:
- [Commands Reference](/docs/commands.md)
- [Development Rules](/docs/development-rules.md)
- [Onboarding Guide](/docs/onboarding-guide.md)
