/**
 * Shared type definitions for .sync-manifest.json (WorkOn / hueron-app)
 *
 * Used by:
 * - skills/hueron-sync/scripts/detect-drift.ts
 */

export interface SyncEntry {
  /** Path to the primary source directory relative to frontend/apps/main/src/app/ */
  pagePath: string;
  /** Glob patterns for related page-local files, relative to frontend/apps/main/src/app/ */
  relatedGlobs: string[];
  /** Full SHA of the hueron-app commit this template was last synced from */
  lastSyncedCommit: string;
  /** ISO 8601 timestamp of when the sync was performed */
  lastSyncedDate: string;
  /** Browser route for this template page (e.g. '/template/workon/procedure') */
  templateRoute: string;
  /** Filename in .reference-screenshots/ directory, or null if not set */
  referenceScreenshot: string | null;
}

export interface SyncManifest {
  /** Schema version */
  version: number;
  /** Relative path to the hueron-app repository root from aegis-lab root */
  hueronAppRepo: string;
  /** Map of template file path (relative to src/pages/template/workon/) to sync metadata */
  entries: Record<string, SyncEntry>;
}
