import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  CodexExecResponse,
  CodexFeedEntry,
  CodexHealthResponse,
  CodexStreamEvent,
  FileReferenceMatch,
  OpenInEditorResponse,
  SandboxMode,
} from "../types";
import { appendLog, appendPhase, extractCodexSummary, parseCodexStreamLine } from "../utils/codex";
import { invokeTauri, isTauriRuntime } from "../utils/tauri";

interface UseCodexRunnerOptions {
  editInstruction: string;
  promptText: string;
  sandboxMode: SandboxMode;
  selectedElement: { selector: string; textSnippet: string } | null;
  selectedRoute: string;
  selectionTitle: string;
  workspaceDir: string;
  onFocusPrompt: () => void;
  onWorkspaceDirChanged: (dir: string) => void;
}

export const useCodexRunner = ({
  editInstruction,
  promptText,
  sandboxMode,
  selectedElement,
  selectedRoute,
  selectionTitle,
  workspaceDir,
  onFocusPrompt,
  onWorkspaceDirChanged,
}: UseCodexRunnerOptions) => {
  const chatFeedRef = useRef<HTMLDivElement | null>(null);
  const stopRequestedRunIdsRef = useRef<Set<string>>(new Set());

  const [codexHealth, setCodexHealth] = useState<CodexHealthResponse | null>(null);
  const [codexError, setCodexError] = useState<string | null>(null);
  const [isCheckingCodex, setIsCheckingCodex] = useState(false);
  const [isRunningCodex, setIsRunningCodex] = useState(false);
  const [isStoppingCodex, setIsStoppingCodex] = useState(false);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [codexFeed, setCodexFeed] = useState<CodexFeedEntry[]>([]);
  const [revealedStreamLengths, setRevealedStreamLengths] = useState<Record<string, number>>({});

  const latestSettledFeedEntry = useMemo(
    () => [...codexFeed].reverse().find((entry) => entry.status !== "running") ?? null,
    [codexFeed],
  );

  const latestFeedScrollKey = useMemo(() => {
    const latest = codexFeed[codexFeed.length - 1];
    if (!latest) return "";
    return [codexFeed.length, latest.status, latest.streamText.length, latest.stderr.length].join(":");
  }, [codexFeed]);

  const latestVisibleFeedScrollKey = useMemo(() => {
    const latest = codexFeed[codexFeed.length - 1];
    if (!latest) return "";
    return [
      codexFeed.length,
      latest.status,
      revealedStreamLengths[latest.id] ?? 0,
      latest.stderr.length,
      latest.summary ?? "",
    ].join(":");
  }, [codexFeed, revealedStreamLengths]);

  const hasUnrevealedText = useMemo(
    () => codexFeed.some((entry) => (revealedStreamLengths[entry.id] ?? 0) < entry.streamText.length),
    [codexFeed, revealedStreamLengths],
  );

  const refreshCodexHealth = useCallback(async () => {
    if (!isTauriRuntime()) {
      setCodexHealth({
        available: false,
        binaryPath: null,
        diagnostics: [
          "Tauri デスクトップ環境ではないため、CLI 実行はできません。prompt / command のコピーは利用できます。",
        ],
        version: null,
        workspaceDir: null,
      });
      return;
    }

    setIsCheckingCodex(true);
    setCodexError(null);

    try {
      const response = await invokeTauri<CodexHealthResponse>("get_codex_health");
      setCodexHealth(response);
      if (response.workspaceDir) {
        onWorkspaceDirChanged(response.workspaceDir);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Codex health check failed";
      setCodexError(message);
    } finally {
      setIsCheckingCodex(false);
    }
  }, [onWorkspaceDirChanged]);

  const openFileReference = useCallback(
    async (reference: FileReferenceMatch) => {
      try {
        if (isTauriRuntime()) {
          await invokeTauri<OpenInEditorResponse>("open_in_editor", {
            column: reference.column,
            line: reference.line,
            path: reference.absolutePath,
            workspaceDir,
          });
          return;
        }

        await navigator.clipboard.writeText(reference.absolutePath);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to open the file reference.";
        setCodexError(message);
      }
    },
    [workspaceDir],
  );

  const runCodex = useCallback(async () => {
    if (!isTauriRuntime()) {
      setCodexError("Tauri デスクトップ環境でのみ Codex CLI を直接実行できます。");
      return;
    }

    setIsRunningCodex(true);
    setCodexError(null);
    const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const instruction = editInstruction.trim() || "Edit";
    const label = selectedElement ? selectionTitle : selectedRoute;
    setCurrentRunId(runId);

    // Inject previous result context into prompt for execution
    const lastSettled = [...codexFeed].reverse().find((entry) => entry.status !== "running");
    let effectivePrompt = promptText;
    if (lastSettled?.summary) {
      const lines = promptText.split("\n");
      const constraintIndex = lines.findIndex((line) => line.startsWith("Constraint:"));
      const contextLine = `Previous result: ${lastSettled.summary}`;
      if (constraintIndex !== -1) {
        lines.splice(constraintIndex, 0, contextLine);
        effectivePrompt = lines.join("\n");
      } else {
        effectivePrompt = `${promptText}\n${contextLine}`;
      }
    }

    setCodexFeed((current) => [
      ...current,
      {
        durationMs: null,
        id: runId,
        instruction,
        phases: [{ label: "Thinking", tone: "progress" }],
        selectionLabel: label,
        status: "running",
        stderr: "",
        streamText: "Running Codex...",
        summary: null,
      },
    ]);
    setRevealedStreamLengths((current) => ({ ...current, [runId]: 0 }));

    try {
      const response = await invokeTauri<CodexExecResponse>("run_codex_exec", {
        binaryPath: codexHealth?.binaryPath,
        prompt: effectivePrompt,
        runId,
        sandboxMode,
        workspaceDir,
      });
      const wasStopped = stopRequestedRunIdsRef.current.has(runId);
      setCodexFeed((current) =>
        current.map((entry) =>
          entry.id === runId
            ? {
                ...entry,
                durationMs: response.durationMs,
                phases: appendPhase(
                  entry.phases,
                  wasStopped
                    ? { label: "Stopped", tone: "danger" }
                    : response.success
                      ? { label: "Done", tone: "success" }
                      : { label: "Failed", tone: "danger" },
                ),
                status: wasStopped ? "stopped" : response.success ? "completed" : "failed",
                stderr: response.stderr.trim() ? response.stderr.trim() : entry.stderr,
                summary: extractCodexSummary(response.stdout),
              }
            : entry,
        ),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Codex execution failed";
      setCodexError(message);
      const wasStopped = stopRequestedRunIdsRef.current.has(runId);
      setCodexFeed((current) =>
        current.map((entry) =>
          entry.id === runId
            ? {
                ...entry,
                phases: appendPhase(
                  entry.phases,
                  wasStopped ? { label: "Stopped", tone: "danger" } : { label: "Failed", tone: "danger" },
                ),
                status: wasStopped ? "stopped" : "failed",
                stderr: wasStopped ? entry.stderr : appendLog(entry.stderr, message),
              }
            : entry,
        ),
      );
    } finally {
      stopRequestedRunIdsRef.current.delete(runId);
      setIsRunningCodex(false);
      setIsStoppingCodex(false);
      setCurrentRunId(null);
      onFocusPrompt();
    }
  }, [
    codexFeed,
    codexHealth?.binaryPath,
    editInstruction,
    onFocusPrompt,
    promptText,
    sandboxMode,
    selectedElement,
    selectedRoute,
    selectionTitle,
    workspaceDir,
  ]);

  const stopCodex = useCallback(async () => {
    if (!currentRunId || !isTauriRuntime()) return;

    try {
      stopRequestedRunIdsRef.current.add(currentRunId);
      setIsStoppingCodex(true);
      setCodexFeed((current) =>
        current.map((entry) =>
          entry.id === currentRunId
            ? {
                ...entry,
                phases: appendPhase(entry.phases, { label: "Stopped", tone: "danger" }),
                status: "stopped",
                stderr: appendLog(entry.stderr, "Execution stopped by user."),
              }
            : entry,
        ),
      );
      await invokeTauri<boolean>("stop_codex_exec", { runId: currentRunId });
    } catch (error) {
      stopRequestedRunIdsRef.current.delete(currentRunId);
      const message = error instanceof Error ? error.message : "Failed to stop Codex";
      setCodexError(message);
    } finally {
      setIsStoppingCodex(false);
    }
  }, [currentRunId]);

  const resetFeed = useCallback(() => {
    setCodexFeed([]);
    setCodexError(null);
    setRevealedStreamLengths({});
  }, []);

  // Check Codex health on mount
  useEffect(() => {
    refreshCodexHealth();
  }, [refreshCodexHealth]);

  // Listen to Tauri stream events
  useEffect(() => {
    if (!isTauriRuntime()) return;

    let unlisten: (() => void) | null = null;

    void (async () => {
      const { listen } = await import("@tauri-apps/api/event");
      unlisten = await listen<CodexStreamEvent>("visual-editor://codex-stream", (event) => {
        const parsedLine = parseCodexStreamLine(event.payload.line, event.payload.stream);
        if (!parsedLine.phase && !parsedLine.text) return;

        setCodexFeed((current) =>
          current.map((entry) => {
            if (entry.id !== event.payload.runId) return entry;

            if (event.payload.stream === "stderr") {
              return {
                ...entry,
                phases: appendPhase(entry.phases, parsedLine.phase),
                stderr: parsedLine.text ? appendLog(entry.stderr, parsedLine.text) : entry.stderr,
              };
            }

            return {
              ...entry,
              phases: appendPhase(entry.phases, parsedLine.phase),
              streamText:
                parsedLine.text === null
                  ? entry.streamText
                  : appendLog(entry.streamText === "Running Codex..." ? "" : entry.streamText, parsedLine.text),
            };
          }),
        );
      });
    })();

    return () => {
      unlisten?.();
    };
  }, []);

  // Auto-scroll feed
  // biome-ignore lint/correctness/useExhaustiveDependencies: latestFeedScrollKey and latestVisibleFeedScrollKey are change signals to trigger scroll
  useEffect(() => {
    const feed = chatFeedRef.current;
    if (!feed) return;

    feed.scrollTop = feed.scrollHeight;
  }, [latestFeedScrollKey, latestVisibleFeedScrollKey]);

  // Typewriter reveal animation
  useEffect(() => {
    if (!hasUnrevealedText) return;

    const intervalId = window.setInterval(() => {
      setRevealedStreamLengths((current) => {
        let changed = false;
        const next = { ...current };

        for (const entry of codexFeed) {
          const currentLength = next[entry.id] ?? 0;
          const targetLength = entry.streamText.length;
          if (currentLength >= targetLength) continue;

          const step = Math.max(8, Math.ceil((targetLength - currentLength) / 12));
          next[entry.id] = Math.min(targetLength, currentLength + step);
          changed = true;
        }

        return changed ? next : current;
      });
    }, 16);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [codexFeed, hasUnrevealedText]);

  return {
    chatFeedRef,
    codexError,
    codexFeed,
    codexHealth,
    currentRunId,
    isCheckingCodex,
    isRunningCodex,
    isStoppingCodex,
    latestSettledFeedEntry,
    openFileReference,
    refreshCodexHealth,
    resetFeed,
    revealedStreamLengths,
    runCodex,
    stopCodex,
  };
};
