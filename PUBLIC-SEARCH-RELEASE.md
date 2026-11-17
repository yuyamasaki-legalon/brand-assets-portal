# Anonymous shared search (2026-11-17)

Supersedes reader authentication in SHARED-CATALOG-RELEASE.md. The user explicitly approved that anyone with the URL, including outside the company, can read published listing metadata, public thumbnails and Drive links. Original Drive permissions are unchanged.

- Everyone receives the same portal shell and GET /api/brand-assets/search projection from /data/catalog.json, including CMS registrations and explicit repository import batches.
- Only this read-only published projection is anonymous. Management GET/PUT /api/brand-assets/catalog still requires company Google authentication and the editor allowlist; mutation Origin/CSRF checks remain. Thumbnail proxy authorization, OAuth scopes, Drive sharing and existing public media are unchanged.
- Draft, archived, expired and ended-product records, audit actors and import markers are excluded from search. Admin loads the full catalogue separately so a save cannot discard excluded drafts.
- Remove embedded mirror/popularity/icon Drive inventories from the browser. The server enriches only already-projected visible records, including map family metadata. Current JS is public; stale JS/JSON/maps remain denied. Persistent data, seed/import batches and secrets are not publicly served.
- An absent/expired/failed optional management session does not gate search. Logging out reloads the public catalogue. The management button initiates OAuth when anonymous; non-editor sessions do not receive editing controls.

Tests: anonymous/viewer/editor response equality, CMS + repository registrations, publish/archive/expiry/end/delete/restart behavior, admin permission/CSRF guards, import idempotence, history fault injection, browser anonymous search/detail, management OAuth entry, optional session failure, logout search, product order, map PNG/AI selection and TrustOn POTX. Real Drive permissions remain enforced by Google.

No environment variable, secret, dependency, Drive sharing, stored catalogue or TOMONI change is required. Deploy by reviewed PR to main; retain the Railway /data volume. Roll back code through a follow-up PR without replacing persistent data.
