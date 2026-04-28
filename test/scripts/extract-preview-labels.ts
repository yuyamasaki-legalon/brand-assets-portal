import { appendFileSync } from "node:fs";
import { buildAliasUrl, extractPreviewLabels, type PullRequestLabel } from "./extract-preview-labels.helpers";

const DEFAULT_WORKER_HOST = "aegis-lab.on-technologies-technical-dept.workers.dev";

const parseLabels = (raw: string): PullRequestLabel[] => {
  if (!raw) {
    return [];
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`LABELS_JSON is not valid JSON: ${(error as Error).message}`);
  }
  if (!Array.isArray(parsed)) {
    throw new Error("LABELS_JSON must be a JSON array.");
  }
  return parsed
    .map((entry) => {
      if (typeof entry === "string") {
        return { name: entry };
      }
      if (
        entry &&
        typeof entry === "object" &&
        "name" in entry &&
        typeof (entry as { name: unknown }).name === "string"
      ) {
        return { name: (entry as { name: string }).name };
      }
      return null;
    })
    .filter((value): value is PullRequestLabel => value !== null);
};

const writeOutput = (name: string, value: string): void => {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) {
    console.log(`${name}=${value}`);
    return;
  }
  // Use multiline-safe delimiter syntax for values that might contain special chars
  const delimiter = `ghadelim_${Math.random().toString(36).slice(2)}`;
  appendFileSync(outputPath, `${name}<<${delimiter}\n${value}\n${delimiter}\n`);
};

const main = (): void => {
  const labelsRaw = process.env.LABELS_JSON ?? "[]";
  const workerHost = process.env.WORKER_HOST ?? DEFAULT_WORKER_HOST;
  const labels = parseLabels(labelsRaw);
  const { validAliases, warnings } = extractPreviewLabels(labels);

  const aliasUrls = validAliases.map((alias) => buildAliasUrl(alias, workerHost));

  writeOutput("valid-aliases-csv", validAliases.join(","));
  writeOutput("valid-aliases-json", JSON.stringify(validAliases));
  writeOutput("project-alias-urls-json", JSON.stringify(aliasUrls));
  writeOutput("warnings-json", JSON.stringify(warnings));

  console.log(`Valid aliases: ${validAliases.length ? validAliases.join(", ") : "(none)"}`);
  if (warnings.length > 0) {
    console.log("Warnings:");
    for (const warning of warnings) {
      console.log(`  - ${warning}`);
    }
  }
};

main();
