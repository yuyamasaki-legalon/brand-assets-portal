# Shared catalogue source overlay

Reviewable source files from the local `aegis-lab` application used to generate this release. These are not a standalone npm project. Existing components/types/Drive helpers remain in the application. No secrets or employee email lists belong here.

Overlay corresponding paths in `aegis-lab`, typecheck/test/build there. Build the standalone portal with the public browser Drive client ID (not the server client secret), then copy only its generated portal HTML/JS and any changed CSS/font assets into `public`. Do not copy the full Aegis development build or local CMS data. The frontend imports no catalogue seed.

The standalone Vite input must include both `brand-asset-portal/index.html` and `brand-asset-portal/login.html`; apply vite.config.patch. Copy BOTH HTML entrypoints and their generated JS/shared preload/CSS files. The anonymous login entry must never import the portal or any asset/Drive metadata module. Portal-only JS is session protected and private/no-store; login JS and safe shared UI dependencies are public. The package test prevents seed Drive IDs from appearing in public login dependencies.

Bundle `scripts/brand-asset-production-server.ts` as Vite SSR with `configFile:false`; the release keeps `./brand-asset-drive-thumbnail` external, mapped to the unchanged `./drive-thumbnail.mjs` via an enforce-pre resolve plugin. Export both createProductionServer and readProductionConfig. Keep the root Dockerfile and explicit context allowlist authoritative; include cms-imports.json outside public. Validate the packaged files with npm test and the Chromium suite, then CI Docker build.

Future asset registrations from code/Chat append complete records in immutable batches to the root cms-imports.json (source scripts/brand-asset-cms-imports.json), not just assets-index.json. See SHARED-CATALOG-RELEASE.md. Management is still restricted by the existing editor-list environment variable; search is not restricted to editors.
