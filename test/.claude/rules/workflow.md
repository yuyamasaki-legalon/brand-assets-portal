# Git Workflow Rules

## Before Every Commit
Run: `pnpm format && pnpm fix:style`

CI will reject unformatted or non-conforming code, so catching issues locally avoids failed checks and extra roundtrips.

## Before Opening PR
Run: `pnpm build`

This catches TypeScript and build errors before reviewers spend time on the PR.

## Branch Strategy
- NEVER push directly to main — direct pushes are irreversible and bypass code review
- Create feature branch from main
- Submit PR for all changes
- Wait for review before merge

## Deployment
- NEVER deploy without team approval — unauthorized deploys can affect production users
