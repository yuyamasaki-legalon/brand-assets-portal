# Troubleshooting Guide

Common issues and solutions for aegis-lab development.

---

## GitHub Authentication Errors

### Problem: 401 Unauthorized

```
npm ERR! 401 Unauthorized - GET https://npm.pkg.github.com/@legalforce/aegis-react
```

### Cause

GitHub Personal Access Token is missing or invalid.

### Solution

1. **Check `~/.npmrc`**:
   ```bash
   rg "npm.pkg.github.com" ~/.npmrc
   ```

   `rg` が使えない場合は `grep` を使う:
   ```bash
   grep "npm.pkg.github.com" ~/.npmrc
   ```

2. **Configure token**:
   ```bash
   echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> ~/.npmrc
   ```

3. **Verify token permissions**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Ensure `read:packages` scope is enabled

4. **Reinstall**:
   ```bash
   pnpm install
   ```

---

## pnpm Version Mismatch

### Problem: Wrong pnpm Version

```
Error: This project requires pnpm version 10.24.0
```

### Solution

**Option 1: Enable Corepack** (Recommended):
```bash
corepack enable
```

Corepack automatically uses the pnpm version specified in `package.json`.

**Option 2: Manual Version**:
```bash
corepack prepare pnpm@10.28.0 --activate
```

**Verify**:
```bash
pnpm --version
```

Should output `10.24.0`.

---

## TypeScript Build Errors

### Problem: Type 'X' is not assignable to type 'Y'

```
error TS2322: Type 'string | undefined' is not assignable to type 'string'.
```

### Solution

**Use nullish coalescing**:
```tsx
// ❌ Error
const name: string = user.name;

// ✅ Fix
const name: string = user.name ?? 'Unknown';
```

**Or optional type**:
```tsx
const name: string | undefined = user.name;
```

### Problem: Object is possibly 'null' or 'undefined'

```
error TS2531: Object is possibly 'null'.
```

### Solution

**Option 1: Null check**:
```tsx
const element = document.getElementById('my-id');
if (element) {
  element.textContent = 'Hello';
}
```

**Option 2: Optional chaining**:
```tsx
document.getElementById('my-id')?.setAttribute('title', 'Hello');
```

**Option 3: Non-null assertion** (if certain):
```tsx
const element = document.getElementById('my-id')!;
element.textContent = 'Hello';
```

### Problem: Cannot find module

```
error TS2307: Cannot find module '@legalforce/aegis-react'
```

### Solution

**Reinstall dependencies**:
```bash
rm -rf node_modules
pnpm install
```

**Check GitHub authentication** (see above).

---

## Cursor/VS Code Editor TypeScript Errors

### Problem: Editor Shows Many TypeScript Errors (Build Works Fine)

If you see errors like these in Cursor or VS Code:

```
'React' refers to a UMD global, but the current file is a module. ts(2686)
Cannot find module '/data' or its corresponding type declarations. ts(2307)
Type 'undefined' is not assignable to type 'Element | null'. ts(2322)
```

But `pnpm build` succeeds without errors, the issue is that your editor is using the wrong TypeScript version.

### Cause

The editor is using its own bundled TypeScript version instead of the project's workspace version specified in `node_modules/typescript`.

### Solution

**Configure editor to use workspace TypeScript**:

1. **Open the `.tsx` file** showing errors in Cursor/VS Code
2. **Open Command Palette**:
   - Mac: `Cmd + Shift + P`
   - Windows/Linux: `Ctrl + Shift + P`
3. **Type and select**: `TypeScript: Select TypeScript Version`
   - You can type `typescript` to filter the list
4. **Select**: `Use Workspace Version`
   - This is the version from `node_modules/typescript`
   - Look for the option showing `node_modules/...` path
5. **If errors persist**: Reload the editor window or restart the application

### Verification

- The status bar (bottom right) should show the workspace TypeScript version
- Editor errors should disappear or match `pnpm build` output
- Both `pnpm build` and editor should report the same errors

**Note**: This setting is per-workspace and may need to be reconfigured when switching projects or reinstalling dependencies.

---

## Aegis Component Errors

### Problem: Component Not Found

```
Error: Cannot find module '@legalforce/aegis-react'
```

### Solution

1. **Verify installation**:
   ```bash
   pnpm list @legalforce/aegis-react
   ```

2. **Reinstall**:
   ```bash
   pnpm install
   ```

3. **Check GitHub token** (see authentication section).

### Problem: Unknown Prop

```
Warning: React does not recognize the `someProps` prop on a DOM element
```

### Solution

**Verify component props**:
1. Check `docs/rules/component/{Component}.md`
2. Use MCP tools in Claude Code:
   ```
   mcp__aegis__get_component_detail("ComponentName")
   ```

3. Review Aegis version (2.28.0) for API changes.

---

## MCP Tools Not Working

### Problem: MCP Tools Not Available in Claude Code

### Cause

MCP server not configured or not running.

### Solution

1. **Verify `.mcp.json` exists**:
   ```bash
   cat .mcp.json
   ```

   Should contain:
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

2. **Restart Claude Code**.

3. **Test MCP server manually**:
   ```bash
   npx -y @legalforce/aegis-mcp-server@latest --version
   ```

4. **Update MCP server**:
   ```bash
   npx -y @legalforce/aegis-mcp-server@latest
   ```

---

## Hot Module Replacement (HMR) Not Working

### Problem: Changes Not Reflected in Browser

### Cause

HMR connection lost or file watch not working.

### Solution

1. **Restart dev server**:
   ```bash
   # Stop (Ctrl+C)
   pnpm dev
   ```

2. **Clear browser cache**:
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

3. **Check file permissions**:
   Ensure files in `src/` are readable.

---

## Build Failures

### Problem: Build Fails with Type Errors

```
pnpm build
# ... TypeScript errors
```

### Solution

1. **Read error messages carefully**:
   Identify the file and line number.

2. **Fix type errors**:
   See TypeScript troubleshooting above.

3. **Run type check only**:
   ```bash
   pnpm type-check
   ```

4. **Rebuild**:
   ```bash
   pnpm build
   ```

### Problem: Out of Memory During Build

```
FATAL ERROR: ... JavaScript heap out of memory
```

### Solution

**Increase Node.js memory**:
```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

Or add to `package.json` scripts:
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' tsc && vite build"
  }
}
```

---

## Deployment Failures

### Problem: Deployment Fails

```
pnpm deploy
# ... error
```

### Solution

1. **Ensure build succeeds locally**:
   ```bash
   pnpm build
   ```

2. **Check Cloudflare credentials**:
   Verify Wrangler is authenticated.

3. **Review `wrangler.jsonc`**:
   Ensure configuration is correct.

4. **Check deployment logs**:
   Review error messages for specific issues.

---

## Sandbox Page Errors

### Problem: Sandbox Page Creation Fails

```
pnpm sandbox:create
# ... error
```

### Solution

1. **Check `scripts/` directory exists**:
   ```bash
   ls scripts/
   ```

2. **Verify script file**:
   ```bash
   ls scripts/create-sandbox-page.ts
   ```

3. **Run with verbose output**:
   ```bash
   pnpm sandbox:create --verbose
   ```

### Problem: Sandbox Page Not Appearing

### Cause

Route not registered.

### Solution

1. **Check `src/pages/sandbox/routes.tsx`**:
   Ensure new page is exported.

2. **Restart dev server**:
   ```bash
   # Ctrl+C, then
   pnpm dev
   ```

---

## Lint Errors

### Problem: Lint Errors Prevent Commit

### Solution

**Auto-fix**:
```bash
pnpm format
```

**Manual fix**:
```bash
pnpm lint
```

**Review specific errors**:
Read Biome error messages and fix accordingly.

---

## Git Issues

### Problem: Merge Conflicts

### Solution

1. **Update branch**:
   ```bash
   git checkout main
   git pull
   git checkout feature/your-feature
   git rebase main
   ```

2. **Resolve conflicts**:
   - Edit conflicted files
   - Remove conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
   - Save files

3. **Continue rebase**:
   ```bash
   git add .
   git rebase --continue
   ```

4. **Push** (force push to your feature branch):
   ```bash
   git push --force
   ```

### Problem: Cannot Push to main

```
error: failed to push some refs
```

### Cause

Direct push to `main` is not allowed.

### Solution

**Create PR instead**:
1. Push to feature branch
2. Create pull request on GitHub
3. Merge after review

---

## Performance Issues

### Problem: Development Server Slow

### Solution

1. **Clear cache**:
   ```bash
   rm -rf node_modules/.vite
   pnpm dev
   ```

2. **Update dependencies**:
   ```bash
   pnpm update
   ```

3. **Check system resources**:
   Close unnecessary applications.

### Problem: Build Slow

### Solution

**Enable caching** (Vite does this by default).

**Reduce bundle size**:
- Remove unused imports
- Use code splitting

---

## Environment Issues

### Problem: Node.js Version Too Old

```
error: The engine "node" is incompatible
```

### Solution

**Update Node.js**:
- Download from https://nodejs.org/
- Or use version manager (nvm, fnm)

**Recommended**: Node.js 25.3.0 or higher.

### Problem: Missing Dependencies

```
Error: Cannot find module 'some-package'
```

### Solution

**Reinstall**:
```bash
pnpm install
```

---

## Getting Additional Help

If issues persist:

1. **Check documentation**:
   - [Onboarding Guide](/docs/onboarding-guide.md)
   - [Development Rules](/docs/development-rules.md)
   - [Commands Reference](/docs/commands.md)

2. **Ask the team**:
   Reach out to team members for assistance.

3. **Check Aegis documentation**:
   For Aegis-specific issues, consult Design System team.

4. **Review error logs**:
   Read complete error messages for clues.

---

## Quick Troubleshooting Checklist

### Development Issues
- [ ] Node.js version is 25.3.0+
- [ ] pnpm version is 10.24.0 (via Corepack)
- [ ] GitHub token configured in `~/.npmrc`
- [ ] Dependencies installed (`pnpm install`)
- [ ] Dev server running (`pnpm dev`)
- [ ] Editor using workspace TypeScript version (not bundled version)

### Build Issues
- [ ] `pnpm format` succeeds
- [ ] `pnpm build` succeeds
- [ ] No TypeScript errors
- [ ] No lint errors

### Deployment Issues
- [ ] Build succeeds locally
- [ ] Wrangler authenticated
- [ ] `wrangler.jsonc` configured correctly
- [ ] Team approval obtained

---

For more information, see:
- [Onboarding Guide](/docs/onboarding-guide.md)
- [Commands Reference](/docs/commands.md)
- [TypeScript Guide](/docs/typescript-guide.md)
