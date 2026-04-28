import { describe, expect, it } from "vitest";
import type { CodexFeedEntry, CodexPhase } from "../types";
import {
  appendLog,
  appendPhase,
  classifyCodexTextPhase,
  extractCodexErrorHint,
  extractCodexErrorSummary,
  extractCodexSummary,
  formatFeedStatusLabel,
  parseCodexStreamLine,
  toStepperStatus,
} from "./codex";

describe("toStepperStatus", () => {
  it("maps completed to completed", () => {
    expect(toStepperStatus("completed")).toBe("completed");
  });

  it("maps failed to error", () => {
    expect(toStepperStatus("failed")).toBe("error");
  });

  it("maps stopped to error", () => {
    expect(toStepperStatus("stopped")).toBe("error");
  });

  it("maps running to loading", () => {
    expect(toStepperStatus("running")).toBe("loading");
  });
});

describe("formatFeedStatusLabel", () => {
  const base: CodexFeedEntry = {
    durationMs: null,
    id: "1",
    instruction: "",
    phases: [],
    selectionLabel: "",
    status: "running",
    stderr: "",
    streamText: "",
    summary: null,
  };

  it("returns Running for running status", () => {
    expect(formatFeedStatusLabel({ ...base, status: "running" })).toBe("Running");
  });

  it("returns Stopped for stopped status", () => {
    expect(formatFeedStatusLabel({ ...base, status: "stopped" })).toBe("Stopped");
  });

  it("returns formatted duration when available", () => {
    expect(formatFeedStatusLabel({ ...base, status: "completed", durationMs: 1500 })).toBe("1.5 s");
  });

  it("returns Completed when no duration", () => {
    expect(formatFeedStatusLabel({ ...base, status: "completed" })).toBe("Completed");
  });

  it("returns Failed for failed status without duration", () => {
    expect(formatFeedStatusLabel({ ...base, status: "failed" })).toBe("Failed");
  });
});

describe("appendPhase", () => {
  it("returns current when nextPhase is null", () => {
    const phases: CodexPhase[] = [{ label: "Thinking", tone: "progress" }];
    expect(appendPhase(phases, null)).toBe(phases);
  });

  it("does not duplicate identical consecutive phases", () => {
    const phases: CodexPhase[] = [{ label: "Thinking", tone: "progress" }];
    expect(appendPhase(phases, { label: "Thinking", tone: "progress" })).toBe(phases);
  });

  it("updates tone of the last phase when label matches but tone differs", () => {
    const phases: CodexPhase[] = [{ label: "Thinking", tone: "progress" }];
    const result = appendPhase(phases, { label: "Thinking", tone: "neutral" });
    expect(result).toEqual([{ label: "Thinking", tone: "neutral" }]);
  });

  it("appends a new phase with a different label", () => {
    const phases: CodexPhase[] = [{ label: "Thinking", tone: "progress" }];
    const result = appendPhase(phases, { label: "Editing", tone: "progress" });
    expect(result).toEqual([
      { label: "Thinking", tone: "progress" },
      { label: "Editing", tone: "progress" },
    ]);
  });

  it("keeps only the last 5 phases plus the new one", () => {
    const phases: CodexPhase[] = Array.from({ length: 8 }, (_, i) => ({
      label: `Phase${i}` as CodexPhase["label"],
      tone: "progress" as const,
    }));
    const result = appendPhase(phases, { label: "Done", tone: "success" });
    expect(result).toHaveLength(6);
    expect(result[result.length - 1]).toEqual({ label: "Done", tone: "success" });
  });
});

describe("classifyCodexTextPhase", () => {
  it("returns null for empty string", () => {
    expect(classifyCodexTextPhase("")).toBeNull();
  });

  it("classifies editing actions", () => {
    expect(classifyCodexTextPhase("apply_patch to file")).toEqual({ label: "Editing", tone: "progress" });
    expect(classifyCodexTextPhase("update file contents")).toEqual({ label: "Editing", tone: "progress" });
    expect(classifyCodexTextPhase("create file foo.tsx")).toEqual({ label: "Editing", tone: "progress" });
    expect(classifyCodexTextPhase("ファイルを修正します")).toEqual({ label: "Editing", tone: "progress" });
    expect(classifyCodexTextPhase("コードを変更")).toEqual({ label: "Editing", tone: "progress" });
  });

  it("classifies verifying actions", () => {
    expect(classifyCodexTextPhase("running pnpm build")).toEqual({ label: "Verifying", tone: "progress" });
    expect(classifyCodexTextPhase("format check")).toEqual({ label: "Verifying", tone: "progress" });
    expect(classifyCodexTextPhase("lint the code")).toEqual({ label: "Verifying", tone: "progress" });
  });

  it("classifies reading actions", () => {
    expect(classifyCodexTextPhase("read file.tsx")).toEqual({ label: "Reading", tone: "progress" });
    expect(classifyCodexTextPhase("open the component.ts")).toEqual({ label: "Reading", tone: "progress" });
    expect(classifyCodexTextPhase("inspect the code")).toEqual({ label: "Reading", tone: "progress" });
    expect(classifyCodexTextPhase("コードを確認")).toEqual({ label: "Reading", tone: "progress" });
  });

  it("classifies done actions", () => {
    expect(classifyCodexTextPhase("all done")).toEqual({ label: "Done", tone: "success" });
    expect(classifyCodexTextPhase("task completed")).toEqual({ label: "Done", tone: "success" });
    expect(classifyCodexTextPhase("finish")).toEqual({ label: "Done", tone: "success" });
    expect(classifyCodexTextPhase("完了しました")).toEqual({ label: "Done", tone: "success" });
    expect(classifyCodexTextPhase("反映しました")).toEqual({ label: "Done", tone: "success" });
  });

  it("classifies thinking actions", () => {
    expect(classifyCodexTextPhase("plan the approach")).toEqual({ label: "Thinking", tone: "progress" });
    expect(classifyCodexTextPhase("thinking about the fix")).toEqual({ label: "Thinking", tone: "progress" });
    expect(classifyCodexTextPhase("まず方針を整理")).toEqual({ label: "Thinking", tone: "progress" });
  });

  it("returns null for unrecognized text", () => {
    expect(classifyCodexTextPhase("some random text")).toBeNull();
  });
});

describe("extractCodexErrorSummary", () => {
  it("returns null for empty stderr", () => {
    expect(extractCodexErrorSummary("")).toBeNull();
  });

  it("returns null for whitespace-only stderr", () => {
    expect(extractCodexErrorSummary("   ")).toBeNull();
  });

  it("detects patch context mismatch", () => {
    const stderr = "apply_patch: Failed to find expected lines in /Users/dev/project/src/pages/foo/bar.tsx";
    const result = extractCodexErrorSummary(stderr);
    expect(result).toContain("Patch failed");
    expect(result).toContain("bar.tsx");
  });

  it("detects patch verification failure", () => {
    const stderr = "apply_patch verification failed: content mismatch";
    const result = extractCodexErrorSummary(stderr);
    expect(result).toContain("Patch failed");
  });

  it("detects missing file errors", () => {
    const result = extractCodexErrorSummary("No such file or directory");
    expect(result).toContain("could not find");
  });

  it("truncates generic errors", () => {
    const longError = "x".repeat(300);
    const result = extractCodexErrorSummary(longError);
    if (!result) {
      throw new Error("Expected error summary");
    }
    expect(result.length).toBeLessThanOrEqual(220);
  });
});

describe("extractCodexErrorHint", () => {
  it("returns null for empty stderr", () => {
    expect(extractCodexErrorHint("")).toBeNull();
  });

  it("returns hint for patch verification failure", () => {
    const stderr = "apply_patch verification failed";
    const result = extractCodexErrorHint(stderr);
    expect(result).toContain("Reload");
  });

  it("returns null for non-patch errors", () => {
    expect(extractCodexErrorHint("some other error")).toBeNull();
  });
});

describe("extractCodexSummary", () => {
  it("extracts message from item.completed JSON line", () => {
    const stdout = JSON.stringify({
      type: "item.completed",
      item: { type: "message", text: "Done editing the file." },
    });
    expect(extractCodexSummary(stdout)).toBe("Done editing the file.");
  });

  it("extracts message from message-type JSON line", () => {
    const stdout = JSON.stringify({ type: "message", text: "Changes applied." });
    expect(extractCodexSummary(stdout)).toBe("Changes applied.");
  });

  it("returns last message when multiple exist", () => {
    const lines = [
      JSON.stringify({ type: "message", text: "First message." }),
      JSON.stringify({ type: "message", text: "Second message." }),
    ].join("\n");
    expect(extractCodexSummary(lines)).toBe("Second message.");
  });

  it("falls back to last non-JSON line", () => {
    expect(extractCodexSummary("some plain output\n")).toBe("some plain output");
  });

  it("skips JSON-like fallback lines", () => {
    const stdout = '{"type":"unknown"}\nfallback text\n[1,2,3]';
    expect(extractCodexSummary(stdout)).toBe("fallback text");
  });

  it("returns null for empty output", () => {
    expect(extractCodexSummary("")).toBeNull();
  });
});

describe("parseCodexStreamLine", () => {
  it("returns null for empty line", () => {
    expect(parseCodexStreamLine("", "stdout")).toEqual({ phase: null, text: null });
  });

  it("parses stderr as failed phase", () => {
    const result = parseCodexStreamLine("error occurred", "stderr");
    expect(result.phase).toEqual({ label: "Failed", tone: "danger" });
    expect(result.text).toBe("error occurred");
  });

  it("parses turn.started event", () => {
    const line = JSON.stringify({ type: "turn.started" });
    const result = parseCodexStreamLine(line, "stdout");
    expect(result.phase).toEqual({ label: "Thinking", tone: "progress" });
    expect(result.text).toBeNull();
  });

  it("parses turn.completed event", () => {
    const line = JSON.stringify({ type: "turn.completed" });
    const result = parseCodexStreamLine(line, "stdout");
    expect(result.phase).toEqual({ label: "Done", tone: "success" });
  });

  it("parses reasoning item", () => {
    const line = JSON.stringify({ item: { type: "reasoning" } });
    const result = parseCodexStreamLine(line, "stdout");
    expect(result.phase).toEqual({ label: "Thinking", tone: "progress" });
  });

  it("parses item.completed with text", () => {
    const line = JSON.stringify({
      type: "item.completed",
      item: { text: "Applied patch to file.tsx" },
    });
    const result = parseCodexStreamLine(line, "stdout");
    expect(result.text).toBe("Applied patch to file.tsx");
  });

  it("parses error event", () => {
    const line = JSON.stringify({ type: "error", message: "something went wrong" });
    const result = parseCodexStreamLine(line, "stdout");
    expect(result.phase).toEqual({ label: "Failed", tone: "danger" });
    expect(result.text).toContain("something went wrong");
  });

  it("falls back to text classification for non-JSON stdout", () => {
    const result = parseCodexStreamLine("reading the source file", "stdout");
    expect(result.phase).toEqual({ label: "Reading", tone: "progress" });
    expect(result.text).toBe("reading the source file");
  });
});

describe("appendLog", () => {
  it("returns trimmed line for empty current", () => {
    expect(appendLog("", "hello")).toBe("hello");
  });

  it("appends a new line", () => {
    expect(appendLog("line1", "line2")).toBe("line1\nline2");
  });

  it("deduplicates identical consecutive lines", () => {
    expect(appendLog("line1", "line1")).toBe("line1");
  });

  it("does not deduplicate non-consecutive identical lines", () => {
    expect(appendLog("line1\nline2", "line1")).toBe("line1\nline2\nline1");
  });

  it("skips empty lines", () => {
    expect(appendLog("line1", "   ")).toBe("line1");
  });
});
