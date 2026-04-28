---
paths: src/pages/sandbox/**
---

# Sandbox Development Guidelines

## Purpose
Sandbox is for experiments and prototypes.
- Quick iterations allowed
- Relaxed quality standards (but still use Aegis)

## Creating New Sandbox Pages
Run: `pnpm sandbox:create`

When using an existing template, search `src/pages/template/CATALOG.md`, read the matched template source, then adapt the generated page.

## Navigation (導線) Requirements
When creating a new sandbox page:

1. **Using scripts (recommended)**: Navigation card is added automatically
   - `pnpm sandbox:create`

2. **Manual creation**: You MUST also add a navigation card
   - Add a Card component to the parent `index.tsx`
   - Add route to the parent `routes.tsx`
   - Follow the existing card pattern in the file

## Important Constraints
- NEVER reference sandbox code from template
- Template CAN reference sandbox patterns (for promotion)
- Sandbox code is NOT used as examples for AI agents

## Experimentation Freedom
- Try new patterns
- Test component combinations
- Prototype features before templating

## URL 表示ルール (Dev Server)

sandbox ページを**作成・編集した後**、対応する localhost URL を必ず表示すること。

### URL の導出方法

dev server: `http://localhost:5173`

| ファイルパス | URL |
|-------------|-----|
| `src/pages/sandbox/{name}/index.tsx` | `http://localhost:5173/sandbox/{name}` |
| `src/pages/sandbox/loc/{name}/index.tsx` | `http://localhost:5173/sandbox/loc/{name}` |
| `src/pages/sandbox/dealon/{name}/index.tsx` | `http://localhost:5173/sandbox/dealon/{name}` |
| `src/pages/sandbox/workon/{name}/index.tsx` | `http://localhost:5173/sandbox/workon/{name}` |
| `src/pages/sandbox/users/{user}/{name}/index.tsx` | `http://localhost:5173/sandbox/{user}/{name}` |

**注意**: `users/` ディレクトリの場合、URL では `users/` セグメントが省略される。

### 表示タイミング
- `pnpm sandbox:create` 実行後
- ページのコンポーネントファイルを新規作成・編集した後
- routes.tsx を更新した後
