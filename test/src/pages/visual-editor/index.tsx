import { LfCode, LfInformationCircle, LfWand } from "@legalforce/aegis-icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Banner,
  Button,
  ContentHeader,
  ContentHeaderTitle,
  Form,
  FormControl,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  Select,
  SideNavigation,
  Stepper,
  Switch,
  Text,
  Textarea,
  TextField,
} from "@legalforce/aegis-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { editableRouteCatalog } from "../../routeCatalog";
import { CodexStreamContent } from "./components/CodexStreamContent";
import { ACTIVE_PANEL_META, DEFAULT_INSTRUCTION, DEFAULT_ROUTE } from "./constants";
import { useCodexRunner } from "./hooks/useCodexRunner";
import { useIframeInspector } from "./hooks/useIframeInspector";
import styles from "./index.module.css";
import type { InspectorPanel, SandboxMode } from "./types";
import { extractCodexErrorHint, extractCodexErrorSummary, formatFeedStatusLabel, toStepperStatus } from "./utils/codex";
import { quoteForShell, truncate } from "./utils/format";

const PHASE_TONE_CLASS: Record<string, string | undefined> = {
  danger: styles.phaseDanger,
  neutral: styles.phaseNeutral,
  progress: styles.phaseProgress,
  success: styles.phaseSuccess,
};

const VisualEditorPage = () => {
  const promptInputRef = useRef<HTMLDivElement | null>(null);

  const [selectedRoute, setSelectedRoute] = useState(DEFAULT_ROUTE);
  const [routeSearch, setRouteSearch] = useState("");
  const [editInstruction, setEditInstruction] = useState(DEFAULT_INSTRUCTION);
  const [iframeNonce, setIframeNonce] = useState(0);
  const [copyState, setCopyState] = useState<"command" | "prompt" | null>(null);
  const [workspaceDir, setWorkspaceDir] = useState(".");
  const [sandboxMode, setSandboxMode] = useState<SandboxMode>("workspace-write");
  const [activePanel, setActivePanel] = useState<InspectorPanel>("prompt");

  const {
    bindIframeRef,
    clearHover,
    clearSelection,
    hoveredElement,
    inspectMode,
    selectedElement,
    setInspectMode,
    teardownFrameListeners,
  } = useIframeInspector();

  const currentRouteEntry = useMemo(
    () => editableRouteCatalog.find((entry) => entry.path === selectedRoute) ?? editableRouteCatalog[0],
    [selectedRoute],
  );

  const selectionTitle = useMemo(() => {
    if (!selectedElement) return "Selection";
    return selectedElement.textSnippet ? truncate(selectedElement.textSnippet, 72) : `<${selectedElement.tagName}>`;
  }, [selectedElement]);

  const promptText = useMemo(() => {
    const instructions = editInstruction.trim() || DEFAULT_INSTRUCTION;
    const selectedRegion = selectedElement
      ? [
          `Target: ${selectedElement.selector}`,
          selectedElement.textSnippet ? `Text: ${selectedElement.textSnippet}` : null,
        ]
          .filter(Boolean)
          .join("\n")
      : "Target: none";

    return [
      `Route: ${selectedRoute}`,
      `File: ${currentRouteEntry?.filePath ?? "unknown"}`,
      selectedRegion,
      `Request: ${instructions}`,
      "Constraint: keep surrounding layout unchanged and stay within Aegis patterns.",
      "Constraint: read the target file before editing, and if a patch verification fails, re-read and retry with a narrower patch.",
    ]
      .filter(Boolean)
      .join("\n");
  }, [currentRouteEntry?.filePath, editInstruction, selectedElement, selectedRoute]);

  const focusPromptInput = useCallback(() => {
    window.requestAnimationFrame(() => {
      promptInputRef.current?.querySelector("textarea")?.focus();
    });
  }, []);

  const {
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
  } = useCodexRunner({
    editInstruction,
    promptText,
    sandboxMode,
    selectedElement,
    selectedRoute,
    selectionTitle,
    workspaceDir,
    onFocusPrompt: focusPromptInput,
    onWorkspaceDirChanged: setWorkspaceDir,
  });

  // Include previous result context in prompt when available
  const promptTextWithContext = useMemo(() => {
    if (!latestSettledFeedEntry?.summary) return promptText;
    const lines = promptText.split("\n");
    const constraintIndex = lines.findIndex((line) => line.startsWith("Constraint:"));
    const contextLine = `Previous result: ${latestSettledFeedEntry.summary}`;
    if (constraintIndex === -1) return `${promptText}\n${contextLine}`;
    lines.splice(constraintIndex, 0, contextLine);
    return lines.join("\n");
  }, [latestSettledFeedEntry?.summary, promptText]);

  const filteredRoutes = useMemo(() => {
    if (!routeSearch.trim()) return editableRouteCatalog;

    const query = routeSearch.toLowerCase();
    return editableRouteCatalog.filter((entry) => {
      return (
        entry.label.toLowerCase().includes(query) ||
        entry.path.toLowerCase().includes(query) ||
        entry.filePath.toLowerCase().includes(query) ||
        entry.section.toLowerCase().includes(query)
      );
    });
  }, [routeSearch]);

  const routeOptions = useMemo(
    () =>
      (filteredRoutes.length > 0 ? filteredRoutes : editableRouteCatalog).map((entry) => ({
        label: `[${entry.section}] ${entry.label}`,
        value: entry.path,
      })),
    [filteredRoutes],
  );

  const iframeSrc = useMemo(() => {
    const url = new URL("/", window.location.origin);
    url.searchParams.set("embedded-preview", "1");
    url.hash = selectedRoute;
    return url.toString();
  }, [selectedRoute]);

  const codexCommand = useMemo(() => {
    const binaryPath = codexHealth?.binaryPath ?? "codex";
    const args = ["exec", "--json"];

    if (sandboxMode === "workspace-write") {
      args.push("--full-auto");
    } else {
      args.push("--sandbox", sandboxMode);
    }

    args.push("-C", workspaceDir, "-");

    return `cat <<'__CODEX_PROMPT__' | ${quoteForShell(binaryPath)} ${args.map(quoteForShell).join(" ")}
${promptTextWithContext}
__CODEX_PROMPT__`;
  }, [codexHealth?.binaryPath, promptTextWithContext, sandboxMode, workspaceDir]);

  const copyToClipboard = useCallback(async (value: string, kind: "command" | "prompt") => {
    await navigator.clipboard.writeText(value);
    setCopyState(kind);
    window.setTimeout(() => setCopyState(null), 2000);
  }, []);

  // Reset state on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedRoute is a change signal to reset state on route change
  useEffect(() => {
    clearSelection();
    resetFeed();
  }, [selectedRoute, clearSelection, resetFeed]);

  // Focus prompt input when element is selected
  useEffect(() => {
    if (selectedElement) {
      focusPromptInput();
    }
  }, [focusPromptInput, selectedElement]);

  // Clear hover when inspect mode is turned off
  useEffect(() => {
    if (inspectMode) return;
    clearHover();
  }, [inspectMode, clearHover]);

  // Cleanup iframe listeners on unmount
  useEffect(() => {
    return () => {
      teardownFrameListeners();
    };
  }, [teardownFrameListeners]);

  const handleInstructionKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        if (!selectedElement || !codexHealth?.available || isRunningCodex || isStoppingCodex) return;
        void runCodex();
        return;
      }

      if (event.key === "Escape" && currentRunId && !isStoppingCodex) {
        event.preventDefault();
        void stopCodex();
      }
    },
    [codexHealth?.available, currentRunId, isRunningCodex, isStoppingCodex, runCodex, selectedElement, stopCodex],
  );

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Visual Editor</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>

        <PageLayoutBody>
          <div className={styles.layout}>
            <Form className={styles.stack}>
              <div className={styles.previewSurface}>
                <div className={styles.previewToolbar}>
                  <div className={styles.previewToolbarActions}>
                    <Switch checked={inspectMode} onChange={(event) => setInspectMode(event.target.checked)}>
                      Inspect mode
                    </Switch>
                  </div>

                  <div className={styles.previewToolbarActions}>
                    <Button
                      type="button"
                      size="small"
                      variant="subtle"
                      onClick={() => setIframeNonce((value) => value + 1)}
                    >
                      Reload preview
                    </Button>
                    <Button
                      type="button"
                      size="small"
                      variant="subtle"
                      onClick={() => window.open(selectedRoute, "_blank", "noopener,noreferrer")}
                    >
                      Open route
                    </Button>
                    <Button type="button" size="small" variant="subtle" onClick={clearSelection}>
                      Clear selection
                    </Button>
                  </div>
                </div>

                <div className={styles.previewViewport}>
                  <iframe
                    key={`${selectedRoute}-${iframeNonce}`}
                    ref={bindIframeRef}
                    title="Visual editor preview"
                    className={styles.iframe}
                    src={iframeSrc}
                  />

                  <div className={styles.overlayLayer} aria-hidden="true">
                    {hoveredElement && (
                      <div
                        className={styles.hoverFrame}
                        style={{
                          height: hoveredElement.box.height,
                          left: hoveredElement.box.left,
                          top: hoveredElement.box.top,
                          width: hoveredElement.box.width,
                        }}
                      />
                    )}

                    {selectedElement && (
                      <div
                        className={styles.selectionFrame}
                        style={{
                          height: selectedElement.box.height,
                          left: selectedElement.box.left,
                          top: selectedElement.box.top,
                          width: selectedElement.box.width,
                        }}
                      >
                        <span className={styles.selectionBadge}>{selectedElement.tagName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>

      <PageLayoutPane position="end" width="large" minWidth="medium" resizable open>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>{ACTIVE_PANEL_META[activePanel].title}</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div className={styles.paneContent}>
            <Text variant="body.small" className={styles.subtleText}>
              {ACTIVE_PANEL_META[activePanel].description}
            </Text>

            {activePanel === "prompt" && (
              <Form className={styles.paneSection}>
                <div className={styles.selectionSummary}>
                  <Text variant="title.xSmall">{selectedElement ? selectionTitle : "Select an area first"}</Text>
                  <Text variant="body.small" className={styles.subtleText}>
                    {selectedElement
                      ? `${selectedRoute} / ${currentRouteEntry?.filePath ?? "unknown"}`
                      : "左の preview で対象領域を選ぶと、ここでそのまま編集指示を書けます。"}
                  </Text>
                  {selectedElement && (
                    <Text variant="body.small">
                      {truncate(selectedElement.textSnippet || selectedElement.selector, 140)}
                    </Text>
                  )}
                </div>

                {codexHealth?.available ? (
                  <Banner color="success" closeButton={false}>
                    <Text variant="body.small">{codexHealth.version ?? "Codex"} ready.</Text>
                  </Banner>
                ) : (
                  <Banner color="warning" closeButton={false}>
                    <Text variant="body.small">
                      {codexHealth?.diagnostics[0] ?? "Codex CLI is not ready. Copy the command and run it manually."}
                    </Text>
                  </Banner>
                )}

                {codexError && (
                  <Banner color="danger" closeButton={false}>
                    <Text variant="body.small">{codexError}</Text>
                  </Banner>
                )}

                {codexFeed.length > 0 && (
                  <div ref={chatFeedRef} className={styles.chatFeed}>
                    <Stepper orientation="vertical" size="small" readOnly defaultIndex={null}>
                      {codexFeed.map((entry, index) => {
                        const errorSummary = extractCodexErrorSummary(entry.stderr);
                        const errorHint = extractCodexErrorHint(entry.stderr);
                        const revealedLength = revealedStreamLengths[entry.id] ?? entry.streamText.length;
                        const displayedStreamText = entry.streamText.slice(0, revealedLength);

                        return (
                          <Stepper.Item
                            key={entry.id}
                            status={toStepperStatus(entry.status)}
                            title={`Run ${index + 1}: ${truncate(entry.selectionLabel, 48)} — ${formatFeedStatusLabel(entry)}`}
                          >
                            <div className={styles.stepContent}>
                              <Text variant="body.small">{entry.instruction}</Text>

                              {entry.phases.length > 0 && (
                                <div className={styles.phaseList}>
                                  {entry.phases.map((phase, phaseIndex) => {
                                    const occurrence = entry.phases
                                      .slice(0, phaseIndex + 1)
                                      .filter(
                                        (candidate) => candidate.label === phase.label && candidate.tone === phase.tone,
                                      ).length;

                                    return (
                                      <Text
                                        as="span"
                                        key={`${entry.id}-${phase.label}-${phase.tone}-${occurrence}`}
                                        variant="body.small"
                                        className={`${styles.phasePill} ${PHASE_TONE_CLASS[phase.tone] ?? ""}`}
                                      >
                                        {phase.label}
                                      </Text>
                                    );
                                  })}
                                </div>
                              )}

                              {entry.summary && entry.status !== "running" && (
                                <div className={styles.resultCard}>
                                  <Text variant="label.small.bold">Result</Text>
                                  <Text variant="body.small">{entry.summary}</Text>
                                </div>
                              )}

                              {displayedStreamText && (
                                <CodexStreamContent
                                  content={displayedStreamText}
                                  isStreaming={entry.status === "running"}
                                  onOpenFileReference={openFileReference}
                                  workspaceDir={workspaceDir}
                                />
                              )}

                              {errorSummary && (
                                <div className={styles.errorCard}>
                                  <Text variant="label.small.bold">Issue</Text>
                                  <Text variant="body.small">{errorSummary}</Text>
                                  {errorHint && (
                                    <Text variant="body.small" className={styles.subtleText}>
                                      {errorHint}
                                    </Text>
                                  )}
                                </div>
                              )}

                              {entry.stderr && (
                                <Accordion>
                                  <AccordionItem>
                                    <AccordionButton>
                                      <Text variant="label.medium">Raw error</Text>
                                    </AccordionButton>
                                    <AccordionPanel>
                                      <pre className={styles.chatLogDanger}>{entry.stderr}</pre>
                                    </AccordionPanel>
                                  </AccordionItem>
                                </Accordion>
                              )}
                            </div>
                          </Stepper.Item>
                        );
                      })}
                    </Stepper>
                  </div>
                )}

                {codexFeed.length === 0 && (
                  <div className={styles.emptyPanel}>
                    <Text variant="body.medium">実行すると、Codex のログと結果がここにそのまま流れます。</Text>
                  </div>
                )}

                <div className={styles.composerCard}>
                  <FormControl>
                    <FormControl.Label>Edit request</FormControl.Label>
                    <Textarea
                      ref={promptInputRef}
                      minRows={4}
                      placeholder={
                        codexFeed.length > 0
                          ? "追加で直したい点を書く。Cmd/Ctrl+Enter で再実行"
                          : "何をどう直したいかを短く書く"
                      }
                      value={editInstruction}
                      onChange={(event) => setEditInstruction(event.target.value)}
                      onKeyDown={handleInstructionKeyDown}
                    />
                  </FormControl>

                  <Text variant="body.small" className={styles.subtleText}>
                    {selectedElement
                      ? "Cmd/Ctrl+Enter で実行。Esc で停止。選択範囲は維持されたまま追加指示を続けられます。"
                      : "左の preview で対象を選ぶと、この入力欄からそのまま修正を回せます。"}
                  </Text>

                  <div className={styles.actionRow}>
                    <Button
                      type="button"
                      variant="solid"
                      loading={isRunningCodex && !isStoppingCodex}
                      onClick={runCodex}
                      disabled={!selectedElement || !codexHealth?.available || isRunningCodex || isStoppingCodex}
                    >
                      Run with Codex
                    </Button>
                    <Button
                      type="button"
                      variant="subtle"
                      onClick={stopCodex}
                      disabled={!currentRunId || isStoppingCodex}
                    >
                      {isStoppingCodex ? "Stopping..." : "Stop"}
                    </Button>
                  </div>
                </div>
              </Form>
            )}

            {activePanel === "help" && (
              <div className={styles.utilityPane}>
                <section className={styles.utilitySection}>
                  <div className={styles.inspectorTitle}>
                    <Text variant="label.medium">How to use</Text>
                    <Text variant="body.small" className={styles.subtleText}>
                      Visual Editor の基本フローをここで確認できます。
                    </Text>
                  </div>

                  <div className={styles.helperList}>
                    <Text variant="body.small">
                      1. 左の preview で route を選び、inspect mode で対象領域をクリックします。
                    </Text>
                    <Text variant="body.small">
                      2. `Edit Prompt` で短い指示を書き、そのまま `Run with Codex` を実行します。
                    </Text>
                    <Text variant="body.small">
                      3. 実行ログを見ながら追加コメントを入れ、必要なら `Stop` か再実行で詰めます。
                    </Text>
                    <Text variant="body.small">
                      4. Tauri ではローカル CLI を直接実行し、browser では prompt / command をコピーして使います。
                    </Text>
                  </div>
                </section>
              </div>
            )}

            {activePanel === "utility" && (
              <div className={styles.utilityPane}>
                <section className={styles.utilitySection}>
                  <div className={styles.inspectorTitle}>
                    <Text variant="label.medium">Preview settings</Text>
                    <Text variant="body.small" className={styles.subtleText}>
                      preview 対象と inspect mode の前提をここで切り替えます。
                    </Text>
                  </div>

                  <div className={styles.stack}>
                    <div className={styles.stack}>
                      <FormControl>
                        <FormControl.Label>Route search</FormControl.Label>
                        <TextField
                          value={routeSearch}
                          placeholder="case detail / sandbox / template"
                          onChange={(event) => setRouteSearch(event.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormControl.Label>Preview route</FormControl.Label>
                        <Select
                          options={routeOptions}
                          value={selectedRoute}
                          onChange={(value) => setSelectedRoute(String(value))}
                        />
                      </FormControl>
                    </div>

                    <Banner color={inspectMode ? "information" : "warning"} closeButton={false}>
                      <Text variant="body.small">
                        {inspectMode
                          ? "Inspect mode では click が navigation ではなく selection に変わります。"
                          : "Interact mode では preview をそのまま操作できます。選択を更新したいときは Inspect mode に戻してください。"}
                      </Text>
                    </Banner>
                  </div>
                </section>

                <section className={styles.utilitySection}>
                  <div className={styles.inspectorTitle}>
                    <Text variant="label.medium">Advanced settings</Text>
                    <Text variant="body.small" className={styles.subtleText}>
                      CLI 向けの補助設定をここで確認します。
                    </Text>
                  </div>

                  <div className={styles.stack}>
                    <FormControl>
                      <FormControl.Label>Workspace dir</FormControl.Label>
                      <TextField value={workspaceDir} onChange={(event) => setWorkspaceDir(event.target.value)} />
                    </FormControl>

                    <FormControl>
                      <FormControl.Label>Sandbox mode</FormControl.Label>
                      <Select
                        options={[
                          { label: "workspace-write", value: "workspace-write" },
                          { label: "read-only", value: "read-only" },
                        ]}
                        value={sandboxMode}
                        onChange={(value) => setSandboxMode(value as SandboxMode)}
                      />
                    </FormControl>

                    <div className={styles.actionRow}>
                      <Button type="button" variant="subtle" onClick={refreshCodexHealth} disabled={isCheckingCodex}>
                        {isCheckingCodex ? "Checking..." : "Re-check CLI"}
                      </Button>
                      <Button type="button" variant="subtle" onClick={() => copyToClipboard(codexCommand, "command")}>
                        {copyState === "command" ? "Command copied" : "Copy CLI command"}
                      </Button>
                    </div>

                    {codexHealth?.diagnostics.length ? (
                      <div className={styles.helperList}>
                        {codexHealth.diagnostics.slice(1).map((line) => (
                          <Text key={line} variant="body.small" className={styles.subtleText}>
                            {line}
                          </Text>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>

                <section className={styles.utilitySection}>
                  <div className={styles.inspectorTitle}>
                    <Text variant="label.medium">Generated prompt</Text>
                    <Text variant="body.small" className={styles.subtleText}>
                      Codex に渡す最終 prompt をそのまま確認できます。
                    </Text>
                  </div>

                  <pre className={styles.codeBlock}>{promptTextWithContext}</pre>
                </section>
              </div>
            )}
          </div>
        </PageLayoutBody>
      </PageLayoutPane>

      <PageLayoutSidebar position="end">
        <SideNavigation aria-label="Visual editor pane navigation">
          <SideNavigation.Group>
            <SideNavigation.Item
              icon={LfInformationCircle}
              aria-label="How to use"
              onClick={() => setActivePanel("help")}
              aria-current={activePanel === "help" ? true : undefined}
            >
              How to use
            </SideNavigation.Item>
            <SideNavigation.Item
              icon={LfWand}
              aria-label="Edit Prompt"
              onClick={() => setActivePanel("prompt")}
              aria-current={activePanel === "prompt" ? true : undefined}
            >
              Edit Prompt
            </SideNavigation.Item>
            <SideNavigation.Item
              icon={LfCode}
              aria-label="Utilities"
              onClick={() => setActivePanel("utility")}
              aria-current={activePanel === "utility" ? true : undefined}
            >
              Utilities
            </SideNavigation.Item>
          </SideNavigation.Group>
        </SideNavigation>
      </PageLayoutSidebar>
    </PageLayout>
  );
};

export default VisualEditorPage;
