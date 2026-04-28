export type SandboxMode = "read-only" | "workspace-write";
export type InspectorPanel = "help" | "prompt" | "utility";

export interface ElementBox {
  height: number;
  left: number;
  top: number;
  width: number;
}

export interface ElementSnapshot {
  ariaLabel: string;
  box: ElementBox;
  className: string;
  domPath: string;
  htmlSnippet: string;
  role: string;
  selector: string;
  tagName: string;
  textSnippet: string;
}

export interface CodexHealthResponse {
  available: boolean;
  binaryPath: string | null;
  diagnostics: string[];
  version: string | null;
  workspaceDir: string | null;
}

export interface OpenInEditorResponse {
  launchedWith: string;
  target: string;
}

export interface CodexExecResponse {
  binaryPath: string;
  commandPreview: string;
  durationMs: number;
  exitCode: number;
  stderr: string;
  stdout: string;
  success: boolean;
}

export interface CodexStreamEvent {
  line: string;
  runId: string;
  stream: "stderr" | "stdout";
}

export interface CodexPhase {
  label: "Done" | "Editing" | "Failed" | "Reading" | "Stopped" | "Thinking" | "Verifying";
  tone: "danger" | "neutral" | "progress" | "success";
}

export interface CodexFeedEntry {
  durationMs: number | null;
  id: string;
  instruction: string;
  phases: CodexPhase[];
  selectionLabel: string;
  status: "completed" | "failed" | "running" | "stopped";
  stderr: string;
  streamText: string;
  summary: string | null;
}

export interface StreamTextSegment {
  content: string;
  key: string;
  type: "text";
}

export interface StreamCodeSegment {
  content: string;
  isOpen: boolean;
  key: string;
  language: string;
  type: "code";
}

export type StreamSegment = StreamCodeSegment | StreamTextSegment;

export interface FileReferenceMatch {
  absolutePath: string;
  column: number | null;
  displayText: string;
  fullMatch: string;
  line: number | null;
  pathText: string;
}

export type StreamInlineToken =
  | { key: string; type: "file"; value: FileReferenceMatch }
  | { key: string; type: "text"; value: string };
