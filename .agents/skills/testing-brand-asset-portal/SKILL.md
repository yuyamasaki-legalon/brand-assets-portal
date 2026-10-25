# Testing Brand Asset Portal

## Overview
Brand Asset Portal is an internal asset search/browse platform for Google Drive-hosted brand assets. The frontend is built with React + TypeScript + Vite + Tailwind CSS (`client/`), backed by an Express server that serves `assets-index.json`.

## Setup

### Backend
```bash
cd /home/ubuntu/repos/brand-assets-portal
npm install
npm start  # Express on port 3000
```

### Frontend
```bash
cd /home/ubuntu/repos/brand-assets-portal/client
npm install
npm run dev  # Vite dev server, typically port 5173 or 5174
```

### API Fallback
If Google Drive credentials are not available, the frontend falls back to loading `assets-index.json` directly via `/api/assets-index`. Verify the backend health with:
```bash
curl -s http://localhost:3000/api/health
```

## Key Data Points
- Total assets: 253 (245 displayable current, 2 deprecated, 1 archived, 5 non-displayable)
- Display groups: 57 (due to assetGroupId grouping)
- Recommended assets: 21 (current assets with `isRecommended: true`)
- PPT assets: 5 (for synonym search testing)

## Critical Test Flows

### 1. Japanese Synonym Search
- Type "パワポ" in search → should return 5+ PPT groups
- Tests `SEARCH_ALIASES` expansion (`パワポ` → `ppt`)
- Also test: "ロゴ" → logo results, "パワーポイント" → PPT results

### 2. Product Filter + Search Combination
- Select "LegalOn" product filter + type "logo"
- All results must be LegalOn brand only
- Active chips should appear in header

### 3. PNG-First Modal + Variant Switching
- Click a multi-format card (e.g., "LegalOn Logo Horizontal Black" which has PNG + SVG)
- Modal must default to PNG format (not SVG)
- Clicking SVG variant should update format display and dropdown

### 4. Deprecated/Archived Toggle
- Check "Deprecatedを表示" checkbox
- MATCHES count should increase (2 deprecated assets become visible)
- Deprecated variants appear with status label in modal

### 5. Sort Mode Change
- Default sort "推奨優先" shows recommended assets first
- Change to "名前順" → cards reorder alphabetically
- First card should change between sort modes

### 6. Modal Close + localStorage Tracking
- Click a recommended card → modal opens
- Close modal (X button or Escape key)
- Check `localStorage["brand-asset-portal.click-counts.v1"]` for updated click count

## Known Issues & Workarounds

- **Escape key testing**: The computer tool's `key` action may fail with "text is required for key" error for special keys like Escape. Workaround: use JavaScript dispatch `document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}))` via browser console, or click the X close button instead.
- **Vite port**: The dev server might use port 5173 or 5174 depending on what's already running. Check the terminal output after `npm run dev`.
- **Google Drive auth**: Without Drive credentials, download buttons won't actually download files but the UI should still render correctly.

## Lint & Build
```bash
cd client
npm run lint      # ESLint
npm run build     # TypeScript compilation + Vite build
```

## Devin Secrets Needed
None required for basic testing. Google Drive OAuth credentials would be needed for full download functionality testing but are not required for UI/UX testing.
