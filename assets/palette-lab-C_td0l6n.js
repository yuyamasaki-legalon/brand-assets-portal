var e=`import {
  LfAngleLeftMiddle,
  LfAngleRightMiddle,
  LfBrowserCode,
  LfCloseLarge,
  LfContrast,
  LfPen,
} from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Header,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutPane,
  Select,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  Tabs,
  TabsList,
  TabsTrigger,
  Text,
} from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { computeRuntimeCssVars } from "./color/runtimeTokens";
import { ContrastCheckPanel } from "./components/ContrastCheckPanel";
import { ExportButton } from "./components/ExportButton";
import { FamilyChromaCurve, FamilyHueCurve, FamilyLchEditor, FamilyLightnessCurve } from "./components/FamilyAxisPanel";
import { FamilyList } from "./components/FamilyList";
import { ProjectManagerDialog } from "./components/ProjectManagerDialog";
import { SwatchRow } from "./components/SwatchRow";
import { TokenEditorDialog } from "./components/TokenEditorDialog";
import { ToneChromaCurve, ToneLchEditor, ToneLightnessCurve } from "./components/ToneAxisPanel";
import styles from "./index.module.css";
import { PaletteLabProvider, usePaletteLabContext } from "./store/context";
import type { Gamut } from "./store/types";
import { isDisplayTone, toneLabel } from "./store/types";

const GAMUT_OPTIONS: Array<{ value: Gamut; label: string }> = [
  { value: "Display P3", label: "P3" },
  { value: "sRGB", label: "sRGB" },
];

const clampAppBgLightnessInput = (value: string): string => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "100";
  const clamped = Math.max(0, Math.min(100, parsed));
  return String(Math.round(clamped * 100) / 100);
};

const FamilyColumnHeader = () => {
  const { state, dispatch } = usePaletteLabContext();
  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const families = activeProject?.colorFamilies ?? [];
  const sortedFamilies = [...families].sort((a, b) => (b.isBuiltIn ? 1 : 0) - (a.isBuiltIn ? 1 : 0));
  const activeFamily = families.find((f) => f.id === state.activeFamilyId) ?? null;

  const familyIdx = sortedFamilies.findIndex((f) => f.id === state.activeFamilyId);
  const canNavigateFamily = familyIdx !== -1 && sortedFamilies.length > 1;
  const prevFamily = canNavigateFamily
    ? sortedFamilies[(familyIdx - 1 + sortedFamilies.length) % sortedFamilies.length]
    : null;
  const nextFamily = canNavigateFamily ? sortedFamilies[(familyIdx + 1) % sortedFamilies.length] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "var(--aegis-space-xSmall)",
          minHeight: "var(--aegis-size-x4Large)",
        }}
      >
        <IconButton
          aria-label="前のファミリー"
          disabled={!prevFamily}
          size="xSmall"
          variant="subtle"
          onClick={() => prevFamily && dispatch({ type: "SELECT_FAMILY", payload: { familyId: prevFamily.id } })}
        >
          <Icon size="xSmall">
            <LfAngleLeftMiddle />
          </Icon>
        </IconButton>
        <Text variant="title.large" color="bold">
          {activeFamily?.name ?? "—"}
        </Text>
        <IconButton
          aria-label="次のファミリー"
          disabled={!nextFamily}
          size="xSmall"
          variant="subtle"
          onClick={() => nextFamily && dispatch({ type: "SELECT_FAMILY", payload: { familyId: nextFamily.id } })}
        >
          <Icon size="xSmall">
            <LfAngleRightMiddle />
          </Icon>
        </IconButton>
      </div>
      {activeFamily ? (
        <SwatchRow tones={activeFamily.tones} />
      ) : (
        <div
          style={{
            backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
            borderRadius: "var(--aegis-radius-medium)",
            height: "var(--aegis-size-x3Large)",
          }}
        />
      )}
    </div>
  );
};

const ToneColumnHeader = () => {
  const { state, dispatch } = usePaletteLabContext();
  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const activeFamily = activeProject?.colorFamilies.find((f) => f.id === state.activeFamilyId);
  const families = activeProject?.colorFamilies ?? [];
  const activeToneValue = state.activeToneValue;

  const sortedTones = [...(activeFamily?.tones ?? [])]
    .filter((t) => isDisplayTone(t.value))
    .sort((a, b) => a.value - b.value);
  const toneIdx = sortedTones.findIndex((t) => t.value === activeToneValue);
  const canNavigateTone = !!activeFamily && toneIdx !== -1 && sortedTones.length > 1;
  const prevTone = canNavigateTone ? sortedTones[(toneIdx - 1 + sortedTones.length) % sortedTones.length] : null;
  const nextTone = canNavigateTone ? sortedTones[(toneIdx + 1) % sortedTones.length] : null;

  const crossSwatches = families.map((f) => {
    const tone = f.tones.find((t) => t.value === activeToneValue);
    return {
      id: f.id,
      bgColor: tone ? \`oklch(\${tone.lightness}% \${tone.chroma} \${tone.hue})\` : null,
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "var(--aegis-space-xSmall)",
          minHeight: "var(--aegis-size-x4Large)",
        }}
      >
        <IconButton
          aria-label="前のトーン"
          disabled={!prevTone || !activeFamily}
          size="xSmall"
          variant="subtle"
          onClick={() => prevTone && dispatch({ type: "SELECT_TONE", payload: { toneValue: prevTone.value } })}
        >
          <Icon size="xSmall">
            <LfAngleLeftMiddle />
          </Icon>
        </IconButton>
        <Text variant="title.large" color="bold">
          {activeToneValue !== null ? toneLabel(activeToneValue) : "—"}
        </Text>
        <IconButton
          aria-label="次のトーン"
          disabled={!nextTone || !activeFamily}
          size="xSmall"
          variant="subtle"
          onClick={() => nextTone && dispatch({ type: "SELECT_TONE", payload: { toneValue: nextTone.value } })}
        >
          <Icon size="xSmall">
            <LfAngleRightMiddle />
          </Icon>
        </IconButton>
      </div>
      <div
        style={{
          borderRadius: "var(--aegis-radius-medium)",
          display: "flex",
          height: "var(--aegis-size-x3Large)",
          overflow: "hidden",
        }}
      >
        {crossSwatches.length > 0 ? (
          crossSwatches.map(({ id, bgColor }) => (
            <div
              key={id}
              style={{ backgroundColor: bgColor ?? "var(--aegis-color-background-neutral-xSubtle)", flex: 1 }}
            />
          ))
        ) : (
          <div style={{ backgroundColor: "var(--aegis-color-background-neutral-xSubtle)", flex: 1 }} />
        )}
      </div>
    </div>
  );
};

const PaletteLabContent = () => {
  const { state, dispatch } = usePaletteLabContext();
  const [contrastOpen, setContrastOpen] = useState(false);
  const [contrastSidebarBgCss, setContrastSidebarBgCss] = useState("var(--aegis-color-background-default)");
  const [projectManagerOpen, setProjectManagerOpen] = useState(false);
  const [curveTab, setCurveTab] = useState<"all" | "lightness" | "chroma" | "hue">("all");
  const [isTokenEditorOpen, setIsTokenEditorOpen] = useState(false);
  // Synced from store by effect on project/theme switch
  const [appBgLightnessInput, setAppBgLightnessInput] = useState("100");
  const paneRef = useRef<HTMLElement>(null);

  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const families = activeProject?.colorFamilies ?? [];
  const tokenOverrides = activeProject?.tokenOverrides ?? {};
  const paneBackgroundRef = activeProject?.paneBackgroundRef ?? "default";

  const appBgLightnessNum = Number(appBgLightnessInput);
  const appBgLightness = Number.isFinite(appBgLightnessNum)
    ? Math.max(0, Math.min(100, appBgLightnessNum))
    : (activeProject?.appBgLightness ?? 100);
  const appBgInput = \`oklch(\${appBgLightness}% 0 0)\`;
  const runtimeCssVars = useMemo(() => computeRuntimeCssVars(appBgLightness, families), [appBgLightness, families]);
  const effectiveRuntimeCssVars = useMemo(
    () => ({ ...runtimeCssVars, ...tokenOverrides }),
    [runtimeCssVars, tokenOverrides],
  );
  const resolvedBgColor = (() => {
    if (paneBackgroundRef === "default") return appBgInput;
    const colonIdx = paneBackgroundRef.indexOf(":");
    if (colonIdx === -1) return appBgInput;
    const familyId = paneBackgroundRef.slice(0, colonIdx);
    const toneValue = Number(paneBackgroundRef.slice(colonIdx + 1));
    const family = activeProject?.colorFamilies.find((f) => f.id === familyId);
    const tone = family?.tones.find((t) => t.value === toneValue);
    return tone ? \`oklch(\${tone.lightness}% \${tone.chroma} \${tone.hue})\` : appBgInput;
  })();

  // Sync appBgLightnessInput when project changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — only sync on project switch, not on every drag
  useEffect(() => {
    setAppBgLightnessInput(String(activeProject?.appBgLightness ?? 100));
  }, [activeProject?.id]);

  useEffect(() => {
    paneRef.current?.style.setProperty("--aegis-page-layout-pane-background-color", resolvedBgColor);
  }, [resolvedBgColor]);

  // Apply effectiveRuntimeCssVars to document root so Portal components (Dialog, Popover, Select, Menu, etc.)
  // inherit the same token context as the wrapper div — portals render outside and miss inline styles.
  // Cleanup removes exactly the keys set in the previous render, preventing stale token mixing across
  // theme/project switches. On unmount React runs this cleanup, clearing all vars from the root.
  useEffect(() => {
    const root = document.documentElement;
    const keys = Object.keys(effectiveRuntimeCssVars);
    for (const [k, v] of Object.entries(effectiveRuntimeCssVars)) {
      root.style.setProperty(k, v);
    }
    return () => {
      for (const key of keys) {
        root.style.removeProperty(key);
      }
    };
  }, [effectiveRuntimeCssVars]);

  const handleTokenOverrideChange = (tokenName: string, hex: string | null) => {
    dispatch({ type: "SET_TOKEN_OVERRIDE", payload: { tokenName, value: hex } });
    // Immediately update documentElement for instant visual feedback (effect fires on next render)
    if (hex === null) {
      document.documentElement.style.removeProperty(tokenName);
    } else {
      document.documentElement.style.setProperty(tokenName, hex);
    }
  };

  return (
    <div
      style={
        {
          ...effectiveRuntimeCssVars,
          color: "var(--aegis-color-foreground-default)",
          height: "100%",
        } as CSSProperties
      }
    >
      <SidebarProvider open={contrastOpen} onOpenChange={setContrastOpen}>
        <SidebarInset>
          <div
            style={{
              backgroundColor: appBgInput,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              transition: "background-color var(--aegis-motion-duration-normal) var(--aegis-motion-easing-default)",
            }}
          >
            <Header bordered>
              <Header.Item>
                <Text variant="title.medium" color="bold">
                  {activeProject?.name ?? "—"}
                </Text>
                <IconButton
                  aria-label="プロジェクトを管理"
                  size="small"
                  variant="plain"
                  onClick={() => setProjectManagerOpen(true)}
                >
                  <Icon size="xSmall">
                    <LfPen />
                  </Icon>
                </IconButton>
              </Header.Item>
              <Header.Spacer />
              <Header.Item>
                <div style={{ flexShrink: 0, width: "var(--aegis-size-x10Large)" }}>
                  <Select
                    options={GAMUT_OPTIONS}
                    size="medium"
                    value={state.gamut}
                    width="full"
                    onChange={(v) => v && dispatch({ type: "SET_GAMUT", payload: v as Gamut })}
                  />
                </div>
              </Header.Item>
              <Header.Item>
                <ButtonGroup>
                  <ExportButton tokenOverrides={tokenOverrides} />
                  <Button
                    aria-pressed={isTokenEditorOpen}
                    leading={LfBrowserCode}
                    variant={isTokenEditorOpen ? "solid" : "subtle"}
                    onClick={() => setIsTokenEditorOpen((v) => !v)}
                  >
                    Token Editor
                  </Button>
                  <Button
                    aria-pressed={contrastOpen}
                    leading={LfContrast}
                    variant={contrastOpen ? "solid" : "subtle"}
                    onClick={() => setContrastOpen((v) => !v)}
                  >
                    Contrast
                  </Button>
                </ButtonGroup>
              </Header.Item>
            </Header>

            <PageLayout style={{ flex: 1, minHeight: 0 }}>
              <PageLayoutPane ref={paneRef} className={styles.palettePane} position="start" open width="xLarge">
                <PageLayoutBody>
                  <FamilyList
                    appBgLightnessInput={appBgLightnessInput}
                    paneBackgroundRef={paneBackgroundRef}
                    onAppBgLightnessBlur={() => {
                      const clamped = clampAppBgLightnessInput(appBgLightnessInput);
                      setAppBgLightnessInput(clamped);
                      dispatch({ type: "SET_APP_BG_LIGHTNESS", payload: { lightness: Number(clamped) } });
                    }}
                    onAppBgLightnessChange={setAppBgLightnessInput}
                    onPaneBackgroundRefChange={(ref) => dispatch({ type: "SET_PANE_BACKGROUND_REF", payload: { ref } })}
                  />
                </PageLayoutBody>
                <PageLayoutFooter>
                  <Button
                    width="full"
                    variant="subtle"
                    onClick={() => dispatch({ type: "ADD_FAMILY", payload: { name: "New family" } })}
                  >
                    Add family
                  </Button>
                </PageLayoutFooter>
              </PageLayoutPane>
              <PageLayoutContent>
                <PageLayoutBody>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-large)",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    {/* Aligned header: family swatch (left) | tone cross-family swatch (right) */}
                    <div
                      style={{
                        display: "grid",
                        flexShrink: 0,
                        gap: "var(--aegis-space-large)",
                        gridTemplateColumns: "1fr 1fr",
                        paddingBlockEnd: "var(--aegis-space-large)",
                      }}
                    >
                      <FamilyColumnHeader />
                      <ToneColumnHeader />
                    </div>
                    {/* Channel tabs — above the parameter control group */}
                    <div style={{ flexShrink: 0 }}>
                      <Tabs value={curveTab} onValueChange={(v) => setCurveTab(v as typeof curveTab)}>
                        <TabsList>
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="lightness">Lightness</TabsTrigger>
                          <TabsTrigger value="chroma">Chroma</TabsTrigger>
                          <TabsTrigger value="hue">Hue</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    {/* Shared LCH params — same div for left and right alignment */}
                    <div
                      style={{
                        display: "grid",
                        flexShrink: 0,
                        gap: "var(--aegis-space-large)",
                        gridTemplateColumns: "1fr 1fr",
                      }}
                    >
                      <FamilyLchEditor />
                      <ToneLchEditor />
                    </div>
                    {/* Scrollable body - curves filtered by active tab */}
                    <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
                        {(curveTab === "all" || curveTab === "lightness") && (
                          <div
                            style={{
                              borderTop: "1px solid var(--aegis-color-border-bold)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-xSmall)",
                              paddingTop: "var(--aegis-space-large)",
                            }}
                          >
                            <Text variant="title.xSmall" color="bold">
                              Lightness
                            </Text>
                            <div
                              style={{
                                display: "grid",
                                gap: "var(--aegis-space-large)",
                                gridTemplateColumns: "1fr 1fr",
                              }}
                            >
                              <FamilyLightnessCurve />
                              <ToneLightnessCurve />
                            </div>
                          </div>
                        )}
                        {(curveTab === "all" || curveTab === "chroma") && (
                          <div
                            style={{
                              borderTop: "1px solid var(--aegis-color-border-bold)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-xSmall)",
                              paddingTop: "var(--aegis-space-large)",
                            }}
                          >
                            <Text variant="title.xSmall" color="bold">
                              Chroma
                            </Text>
                            <div
                              style={{
                                display: "grid",
                                gap: "var(--aegis-space-large)",
                                gridTemplateColumns: "1fr 1fr",
                              }}
                            >
                              <FamilyChromaCurve />
                              <ToneChromaCurve />
                            </div>
                          </div>
                        )}
                        {(curveTab === "all" || curveTab === "hue") && (
                          <div
                            style={{
                              borderTop: "1px solid var(--aegis-color-border-bold)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-xSmall)",
                              paddingTop: "var(--aegis-space-large)",
                            }}
                          >
                            <Text variant="title.xSmall" color="bold">
                              Hue
                            </Text>
                            <div
                              style={{
                                display: "grid",
                                gap: "var(--aegis-space-large)",
                                gridTemplateColumns: "1fr 1fr",
                              }}
                            >
                              <FamilyHueCurve />
                              <div />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </PageLayoutBody>
              </PageLayoutContent>
            </PageLayout>

            <ProjectManagerDialog open={projectManagerOpen} onClose={() => setProjectManagerOpen(false)} />
            <TokenEditorDialog
              open={isTokenEditorOpen}
              onOpenChange={setIsTokenEditorOpen}
              overrides={tokenOverrides}
              onOverrideChange={handleTokenOverrideChange}
            />
          </div>
        </SidebarInset>

        <Sidebar
          side="inline-end"
          behavior="push"
          collapsible="offcanvas"
          resizable
          style={
            {
              "--aegis-sidebar-background-color": contrastSidebarBgCss,
              transition: "background-color var(--aegis-motion-duration-normal) var(--aegis-motion-easing-default)",
            } as CSSProperties
          }
          width="medium"
        >
          <SidebarHeader>
            <ContentHeader
              trailing={
                <IconButton
                  aria-label="Close contrast sidebar"
                  size="small"
                  variant="plain"
                  onClick={() => setContrastOpen(false)}
                >
                  <Icon size="xSmall">
                    <LfCloseLarge />
                  </Icon>
                </IconButton>
              }
            >
              <ContentHeaderTitle>Contrast</ContentHeaderTitle>
            </ContentHeader>
          </SidebarHeader>
          <SidebarBody className={styles.contrastSidebarBody}>
            <ContrastCheckPanel
              appBgInput={appBgInput}
              appBgLightness={appBgLightness}
              runtimeCssVars={effectiveRuntimeCssVars}
              onPageBgCssChange={setContrastSidebarBgCss}
            />
          </SidebarBody>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
};

export const PaletteLab = () => {
  return (
    <PaletteLabProvider>
      <PaletteLabContent />
    </PaletteLabProvider>
  );
};
`;export{e as default};