import { classifyPreviewLabel } from "./extract-preview-labels.helpers";

/**
 * CLI that classifies a single preview label so shell-based workflow steps can
 * share the same validation rules used by {@link extractPreviewLabels}.
 *
 * Usage: pnpm tsx scripts/classify-preview-label.ts "preview:<slug>"
 *
 * Output (stdout, KEY=VALUE lines): status, slug (if known), reason (if rejected).
 * Exit code 0 for successful classification regardless of status so callers can
 * inspect the result; exit 2 only when no argument is provided.
 */
const labelName = process.argv[2];
if (!labelName) {
  console.error("Usage: classify-preview-label <label-name>");
  process.exit(2);
}

const result = classifyPreviewLabel(labelName);

switch (result.status) {
  case "valid":
    console.log("status=valid");
    console.log(`slug=${result.slug}`);
    break;
  case "reserved":
    console.log("status=reserved");
    console.log(`slug=${result.slug}`);
    console.log(`reason=${result.reason}`);
    break;
  case "invalid":
    console.log("status=invalid");
    console.log(`slug=${result.slug}`);
    console.log(`reason=${result.reason}`);
    break;
  case "not-preview":
    console.log("status=not-preview");
    console.log(`reason=${result.reason}`);
    break;
}
