import type { CodexFeedEntry, CodexPhase } from "../types";
import { compressWhitespace, formatDuration, truncate } from "./format";

export const toStepperStatus = (status: CodexFeedEntry["status"]): "completed" | "error" | "loading" | "normal" => {
  if (status === "completed") return "completed";
  if (status === "failed" || status === "stopped") return "error";
  if (status === "running") return "loading";
  return "normal";
};

export const formatFeedStatusLabel = (entry: CodexFeedEntry) => {
  if (entry.status === "running") return "Running";
  if (entry.status === "stopped") return "Stopped";
  if (entry.durationMs) return formatDuration(entry.durationMs);
  if (entry.status === "completed") return "Completed";
  return "Failed";
};

export const appendPhase = (current: CodexPhase[], nextPhase: CodexPhase | null) => {
  if (!nextPhase) return current;

  const lastPhase = current[current.length - 1];
  if (lastPhase?.label === nextPhase.label) {
    if (lastPhase.tone === nextPhase.tone) return current;
    return [...current.slice(0, -1), nextPhase];
  }

  const trimmed = current.slice(-5);
  return [...trimmed, nextPhase];
};

export const classifyCodexTextPhase = (value: string): CodexPhase | null => {
  const normalized = compressWhitespace(value).toLowerCase();
  if (!normalized) return null;

  if (
    normalized.includes("apply_patch") ||
    normalized.includes("update file") ||
    normalized.includes("create file") ||
    normalized.includes("edit ") ||
    normalized.includes("editing") ||
    normalized.includes("修正") ||
    normalized.includes("変更") ||
    normalized.includes("追加") ||
    normalized.includes("書き換")
  ) {
    return { label: "Editing", tone: "progress" };
  }

  if (
    normalized.includes("build") ||
    normalized.includes("format") ||
    normalized.includes("lint") ||
    normalized.includes("cargo check") ||
    normalized.includes("pnpm build") ||
    normalized.includes("verify") ||
    normalized.includes("verifying") ||
    normalized.includes("検証")
  ) {
    return { label: "Verifying", tone: "progress" };
  }

  if (
    normalized.includes(".tsx") ||
    normalized.includes(".ts") ||
    normalized.includes("read") ||
    normalized.includes("reading") ||
    normalized.includes("open ") ||
    normalized.includes("opening") ||
    normalized.includes("inspect") ||
    normalized.includes("search") ||
    normalized.includes("find ") ||
    normalized.includes("確認") ||
    normalized.includes("見ます") ||
    normalized.includes("読み") ||
    normalized.includes("参照")
  ) {
    return { label: "Reading", tone: "progress" };
  }

  if (
    normalized.includes("done") ||
    normalized.includes("completed") ||
    normalized.includes("finish") ||
    normalized.includes("完了") ||
    normalized.includes("反映")
  ) {
    return { label: "Done", tone: "success" };
  }

  if (
    normalized.includes("plan") ||
    normalized.includes("thinking") ||
    normalized.includes("analy") ||
    normalized.includes("まず") ||
    normalized.includes("方針") ||
    normalized.includes("整理")
  ) {
    return { label: "Thinking", tone: "progress" };
  }

  return null;
};

export const extractCodexErrorSummary = (stderr: string) => {
  const normalized = compressWhitespace(stderr);
  if (!normalized) return null;

  const missingContextMatch = normalized.match(/Failed to find expected lines in\s+([^\s]+)/);
  if (normalized.includes("apply_patch") && missingContextMatch) {
    const filePath = missingContextMatch[1];
    const shortPath = filePath.split("/").slice(-4).join("/");
    return `Patch failed because ${shortPath} no longer matched the expected context. The file changed while Codex was editing.`;
  }

  if (normalized.includes("apply_patch") && normalized.includes("verification failed")) {
    return "Patch failed because Codex's expected context no longer matched the file contents.";
  }

  if (normalized.includes("No such file or directory")) {
    return "Codex could not find one of the files it expected to edit or inspect.";
  }

  return truncate(normalized, 220);
};

export const extractCodexErrorHint = (stderr: string) => {
  const normalized = compressWhitespace(stderr);
  if (!normalized) return null;

  if (normalized.includes("apply_patch") && normalized.includes("verification failed")) {
    return "Reload the preview if needed, keep the selection narrow, and re-run with a more specific request.";
  }

  return null;
};

export const extractCodexSummary = (stdout: string) => {
  const messages: string[] = [];

  for (const line of stdout.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    try {
      const payload = JSON.parse(trimmed) as {
        item?: { text?: string; type?: string };
        text?: string;
        type?: string;
      };

      if (payload.type === "item.completed" && payload.item?.type === "message" && payload.item.text) {
        messages.push(compressWhitespace(payload.item.text));
        continue;
      }

      if (payload.type === "message" && payload.text) {
        messages.push(compressWhitespace(payload.text));
      }
    } catch {
      // Non-JSON lines are expected in Codex output — skip silently
    }
  }

  if (messages.length > 0) {
    return messages[messages.length - 1];
  }

  const fallbackCandidates = stdout
    .split(/\r?\n/)
    .map((line) => compressWhitespace(line))
    .filter(Boolean);

  let fallback: string | null = null;
  for (let index = fallbackCandidates.length - 1; index >= 0; index -= 1) {
    const line = fallbackCandidates[index];
    if (!line.startsWith("{") && !line.startsWith("[")) {
      fallback = line;
      break;
    }
  }

  return fallback ?? null;
};

export const parseCodexStreamLine = (
  line: string,
  stream: "stderr" | "stdout",
): { phase: CodexPhase | null; text: string | null } => {
  const trimmed = line.trim();
  if (!trimmed) return { phase: null, text: null };

  if (stream === "stderr") {
    return {
      phase: trimmed ? { label: "Failed", tone: "danger" } : null,
      text: trimmed,
    };
  }

  try {
    const payload = JSON.parse(trimmed) as {
      item?: { name?: string; text?: string; type?: string };
      message?: string;
      text?: string;
      type?: string;
    };

    if (payload.type === "turn.started") {
      return {
        phase: { label: "Thinking", tone: "progress" },
        text: null,
      };
    }

    if (payload.type === "turn.completed") {
      return {
        phase: { label: "Done", tone: "success" },
        text: null,
      };
    }

    if (payload.item?.type === "reasoning") {
      return {
        phase: { label: "Thinking", tone: "progress" },
        text: null,
      };
    }

    if (payload.item?.name) {
      const toolPhase = classifyCodexTextPhase(payload.item.name);
      return { phase: toolPhase, text: null };
    }

    if (payload.type === "item.completed" && payload.item?.text) {
      const text = payload.item.text.trim();
      return {
        phase: classifyCodexTextPhase(compressWhitespace(text)),
        text,
      };
    }

    if (payload.type === "message" && payload.text) {
      const text = payload.text.trim();
      return {
        phase: classifyCodexTextPhase(compressWhitespace(text)),
        text,
      };
    }

    if (payload.type === "error" && payload.message) {
      return {
        phase: { label: "Failed", tone: "danger" },
        text: `Error: ${compressWhitespace(payload.message)}`,
      };
    }

    return {
      phase: null,
      text: null,
    };
  } catch {
    return {
      phase: classifyCodexTextPhase(trimmed),
      text: trimmed,
    };
  }
};

export const appendLog = (current: string, nextLine: string) => {
  const trimmed = nextLine.trimEnd();
  if (!trimmed) return current;

  // Deduplicate only if the last line is identical (collapse exact repeats)
  const lines = current.split("\n");
  const lastLine = lines.length > 0 ? lines[lines.length - 1] : undefined;
  if (lastLine === trimmed) return current;

  return current ? `${current}\n${trimmed}` : trimmed;
};
