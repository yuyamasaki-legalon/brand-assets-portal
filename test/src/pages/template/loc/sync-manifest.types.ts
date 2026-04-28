/**
 * Shared type definitions for .sync-manifest.json
 *
 * Used by:
 * - scripts/loc-sync/detect-drift.ts
 * - e2e/loc-sync-visual-comparison.spec.ts
 */

export interface SyncEntry {
  /** Name of the loc-app service (e.g. 'legal-management-f') */
  locService: string;
  /** Path to the primary source directory relative to services/{service}/src/ */
  locPagePath: string;
  /** Glob patterns for related parts, relative to services/{service}/src/ */
  locPartsGlobs: string[];
  /** Full SHA of the loc-app commit this template was last synced from */
  lastSyncedCommit: string;
  /** ISO 8601 timestamp of when the sync was performed */
  lastSyncedDate: string;
  /** Browser route for this template page (e.g. '/template/loc/case') */
  templateRoute: string;
  /** Filename in .reference-screenshots/ directory, or null if not set */
  referenceScreenshot: string | null;
}

export interface SyncManifest {
  /** Schema version */
  version: number;
  /** Relative path to the loc-app repository root from aegis-lab root */
  locAppRepo: string;
  /** Map of template file path (relative to src/pages/template/loc/) to sync metadata */
  entries: Record<string, SyncEntry>;
}
