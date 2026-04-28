# Devin Guidelines for aegis-lab

Read `AGENTS.md` for the full project guidelines. The rules below are **critical** and must be followed at all times.

## Deployment — STRICTLY PROHIBITED

An incident occurred where an AI agent deployed this repository's code to an unintended environment. To prevent this from happening again:

- **NEVER run deploy commands**: Do not execute `wrangler deploy`, `pnpm deploy`, `pnpm cf:deploy`, or any command that deploys code to any environment
- **NEVER deploy to your own environment**: Do not deploy, host, or serve this code on Devin's infrastructure or any external platform
- **NEVER modify deployment configuration**: Do not change `wrangler.jsonc`, `.github/workflows/deploy.yml`, or `.github/workflows/preview.yml`

Deployment is handled exclusively by CI/CD pipelines (GitHub Actions). There is no scenario where you should deploy this code yourself.

## Allowed Commands

- `pnpm install` — Install dependencies
- `pnpm dev` — Start local development server (for preview only)
- `pnpm build` — Type-check and build
- `pnpm format` — Lint and format
- `pnpm fix:style` — Fix style issues
- `pnpm sandbox:create` — Create new sandbox page
