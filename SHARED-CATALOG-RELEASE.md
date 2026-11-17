# Shared employee catalogue — 2026-11-17

> Reader authentication is superseded by PUBLIC-SEARCH-RELEASE.md. Published search is explicitly public with user approval; management authentication and the shared persistent store remain.

Supersedes the anonymous snapshot behavior in PUBLIC-WORLDMAP-RELEASE.md. The user authorized production deployment after tests and review.

## Contract

- Every company-authenticated employee uses `GET /api/brand-assets/search`, regardless of editor permission or registration author. It reads `/data/catalog.json`, the same document CMS edits. No bundled/per-user/localStorage catalogue fallback remains. Sorting/preferences can still differ.
- The server excludes drafts, archived/expired assets and ended products. Legacy publication defaults remain compatible. Search returns explicit display fields, not audit actors, import markers, owner/internal fields or links to hidden versions.
- Only configured editors may GET the full `/api/brand-assets/catalog` or PUT changes. Admin loads the full document separately, preserving drafts when saving. Revision conflicts, explicit deletion targets, actor/time, snapshots and atomic rename remain enforced.
- Anonymous/expired sessions see a company Google login prompt, not another list. Read failures clear results and offer retry. Logout clears results; failed logout offers retry. Returning from admin refreshes before displaying search. Other employees refresh on focus/reload or the existing 30-second poll.
- Chrome profile login alone is not portal authentication. Signed ID-token verification, company-domain/verified-email checks, state/nonce/PKCE, Secure HttpOnly sessions and CSRF remain. Personal/noncompany accounts are refused.

## Repository / Chat registration workflow

Persist the seed once, only when no saved catalogue exists. Never replace a saved catalogue or merge every missing seed ID; that would restore deleted assets. Previously deployed TrustOn migrations remain compatible. This release does not rewrite existing asset content or reimport the seed.

Future Chat/repository additions must append an immutable batch to `cms-imports.json` (source: `scripts/brand-asset-cms-imports.json`). Each batch has a unique lowercase/hyphenated `id` and an `assets` array of complete, validated catalogue objects with Google Drive **file** URLs and existing product IDs. Test with saved-catalogue fixtures before reviewing/deploying. Never reuse/edit an applied batch. Create new products via CMS first. Ordinary edits/deletions use CMS; seed-only edits are no longer registration.

Batches share the CMS process queue, deduplicate by asset ID and Drive file ID, preserve existing edits/products and atomically persist a server-owned marker/revision. Pre-rename failures fail the read and retry without a partial commit. Post-rename cleanup is best-effort. Once imported, subsequent CMS edits/deletions are authoritative and not undone on restart. The current manifest is intentionally empty: this deployment unifies access to already registered assets.

## Rollout and limitations

- Add `cms-imports.json` to explicit Docker COPY/context allowlists. No new env vars, secrets, OAuth clients/scopes, Volume or replica settings. Retain the existing `/data` Volume and one replica. Seed/manifest remain outside public and return 404.
- Keep historical artifacts on disk, but serve only current HTML-referenced JS/preloads. Anonymous requests receive a separate Aegis login entry with no asset inventory; the portal entry (including legacy mirror/Drive lookup metadata) requires a verified company session and is private/no-store. Public login dependencies are tested against all seed Drive IDs. Old `/assets` JS, JSON and source maps return 404. HTML/catalogue remain no-store. Copies already downloaded cannot be recalled from browsers; reload to get the new UI.
- Drive originals, sharing permissions and per-user readonly grants are unchanged. Equal search results do not grant download/thumbnail access to inaccessible Drive files. `drive-thumbnail.mjs`, media and deliberately public TOMONI remain unchanged.
- Infra MCP extraction/classification was unknown, with no evidence; read-only-scope preflight was OK. It did not verify actual Railway settings. Packaging is checked in repo/Docker CI; keep established production config/Volume.
- Verify the exact merge deployment and live health/entrypoint, anonymous gate, protected APIs and old-bundle denial. Restart expires sessions. Automated tests substitute Google responses; final real-company OAuth and Drive checks require a company user. No production secrets/assets are used in tests.
- Roll back to the prior deployment without deleting the Volume if needed. Schema stays compatible, but rollback restores the old anonymous snapshot behavior; consider that access change explicitly.

## Checks

Source TypeScript/auth/storage/map/product-order tests, production build, targeted formatting/style and secret checks. Node 24 packaged runtime/auth/thumbnail/import/fault-injection tests; Chromium viewer/editor search/logout, actual CMS form save preserving drafts, product/format order, map PNG/AI selection, download targets, failed-read retry and anonymous gating. GitHub Actions also builds Docker before merge.
