# Employee Google CMS release

This package adds the CMS runtime to the existing static production repository.
The old root-level static files and Caddyfile are retained for reference/rollback;
the Docker image serves only `public/` and never copies repository secrets.

## Before merging / deploying

- Verify Railway's staged OAuth settings without publishing their values.
- Verify the attached volume mount is `/data`, matches `CMS_DATA_DIR`, and has backups.
- Keep one replica. The runtime's session map and file-update queue are process-local.
- Google web-client redirect URI must be:
  `https://brand-assets-portal.ontechnologies.tech/api/auth/google/callback`.
- The Dockerfile starts Node on port `8080` by default. If Railway defines `PORT`,
  confirm its value matches the custom-domain target port (`8080`).
- Leave custom Build/Start Commands unset. Check that Railway detects the root Dockerfile.
- Apply pending Railway settings before the CMS commit is deployed. Since main has
  automatic deployment enabled, do not merge before those settings are ready.
- Use `/health` for the deployment health check. Do not change the existing
  static deployment's health path to a route it does not serve.
- Infrastructure preflight returned `unknown`; it did not verify the actual
  Railway volume or settings. Human review is still required.

## After deployment

- Test real company Google login and rejection of a personal Google account.
- Register a test asset with a required Drive file URL; publish it and verify
  another employee can see it after login.
- Confirm persistence across redeployment, conflict rejection and volume backup.
- Remove the test from the normal list by archiving it, not deleting live files.
- Docker and real Google OAuth are not validated by the local mock-auth tests.
- Existing bundled catalogue data remains public as before. New CMS catalogue
  reads and all writes require employee authentication. Original Drive access
  permissions remain separate.

## Reproducing the artifacts

The React/Aegis source and backend source are maintained in
`aegis-lab/src/pages/sandbox/brand-asset-portal/` and
`aegis-lab/scripts/brand-asset-*.ts`.
Run `pnpm build:brand-asset-cms` there and copy the generated release package here.
Preserve `public/brand-asset-portal-media/` and `package-lock.json`;
update the lock with `npm install --package-lock-only --ignore-scripts` if the
runtime dependency version changes. Never copy `.env` or local `.brand-asset-cms/` data.

## Rollback

Retain the previous Railway deployment until real-login and persistence checks
pass. Roll back to that deployment if startup/authentication fails. Keep the
volume and a backup: rolling back code must not delete employee catalogue data.
