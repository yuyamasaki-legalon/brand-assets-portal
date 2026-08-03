# Custom Domain Recovery Checklist

This repository is currently using a temporary redirect:

- `brand-portal-assets.ontechnologies.tech` -> `brand-assets-portal-production.up.railway.app`

The redirect should stay in place until the custom domain can serve the SPA
directly without a blank screen.

## Changes already prepared

- `Caddyfile` keeps the temporary redirect active.
- `Caddyfile` also adds `no-cache` headers for the SPA shell routes:
  - `/`
  - `/index.html`
  - `/sandbox*`

These headers are meant to reduce HTML / JS chunk mismatch after deployments
when the redirect is removed.

## Safe rollback plan for removing the redirect

1. Purge the custom domain cache in Cloudflare.
2. Deploy this repository with the current `Caddyfile`.
3. Verify the Railway host still works:
   - `https://brand-assets-portal-production.up.railway.app/`
   - `https://brand-assets-portal-production.up.railway.app/viewonly.html`
   - `https://brand-assets-portal-production.up.railway.app/sandbox/yu.yamasaki/brand-asset-portal`
4. Temporarily comment out or remove this line from `Caddyfile`:
   - `redir @custom_domain https://brand-assets-portal-production.up.railway.app{uri} 308`
5. Redeploy.
6. Test the custom domain in a private window with hard reload:
   - `https://brand-portal-assets.ontechnologies.tech/`
   - `https://brand-portal-assets.ontechnologies.tech/viewonly.html`
   - `https://brand-portal-assets.ontechnologies.tech/sandbox/yu.yamasaki/brand-asset-portal`
7. Open browser devtools and confirm:
   - `index.html` returns `Cache-Control: no-cache, no-store, must-revalidate`
   - JS chunks under `/assets/` load with `200`
   - no `Failed to fetch dynamically imported module` error appears
8. If any blank screen returns, restore the redirect immediately and redeploy.

## Exit criteria

The redirect can stay removed only if all of the following remain true:

- root page renders
- `viewonly.html` renders
- sandbox route renders
- no chunk load error appears
- a private window also works after reload
