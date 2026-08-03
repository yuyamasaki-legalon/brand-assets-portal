var e=`import {
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

import { FIXED_PALETTE, TOKEN_REFS } from "../../color/contrast";
import { usePaletteLabContext } from "../../store/context";
import { generateDesignTokensMarkdown } from "../../utils/designTokensMarkdown";
import { exportToPaletteJson, exportToPaletteJsonOklch } from "../../utils/export";
import { exportToPaletteTokensJs } from "../../utils/exportTokens";
import type { TokenData } from "../../utils/parseAegisV2Css";
import { parseAegisV2TokenRefs } from "../../utils/parseAegisV2Css";
import { DesignTokensTab } from "../DesignTokensTab";

const V3_STORAGE_KEY = "palette-lab-v3-figma-tokens";

const loadV3Data = (): TokenData | null => {
  try {
    const raw = localStorage.getItem(V3_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TokenData) : null;
  } catch {
    return null;
  }
};

const CSS_VAR_TO_DEFAULT_REF: Record<string, string> = {};
for (const category of ["background", "foreground", "border"] as const) {
  for (const [key, ref] of Object.entries(TOKEN_REFS[category] ?? {})) {
    CSS_VAR_TO_DEFAULT_REF[\`--aegis-color-\${category}-\${key}\`] = ref;
  }
}

type ExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenOverrides: Record<string, string>;
};

type TabValue = "base-hex" | "base-oklch" | "primary" | "tokens" | "design-tokens";

const TEXTAREA_STYLE: CSSProperties = {
  backgroundColor: "var(--aegis-color-background-default)",
  border: "1px solid var(--aegis-color-border-neutral)",
  borderRadius: "var(--aegis-radius-medium)",
  boxSizing: "border-box",
  color: "var(--aegis-color-foreground-default)",
  display: "block",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
  fontSize: "var(--aegis-font-size-body-small)",
  height: "100%",
  lineHeight: "1.5",
  minHeight: 0,
  overflow: "auto",
  padding: "var(--aegis-space-small)",
  resize: "none",
  width: "100%",
};

const downloadBlob = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const ExportDialog = ({ open, onOpenChange, tokenOverrides }: ExportDialogProps) => {
  const { state } = usePaletteLabContext();
  const [tab, setTab] = useState<TabValue>("base-hex");
  const [v3Data, setV3Data] = useState<TokenData | null>(() => loadV3Data());

  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const families = activeProject?.colorFamilies ?? [];

  const baseHexJson = activeProject ? JSON.stringify(exportToPaletteJson(activeProject), null, 2) : "";
  const baseOklchJson = activeProject ? JSON.stringify(exportToPaletteJsonOklch(activeProject), null, 2) : "";
  const primaryJs = activeProject ? exportToPaletteTokensJs(activeProject) : "";

  const hexToTokenName = useMemo(() => {
    const map = new Map<string, string>();
    for (const family of families) {
      for (const tone of family.tones) {
        if (tone.hex) map.set(tone.hex.toLowerCase(), \`\${family.name}.\${tone.value}\`);
      }
    }
    for (const [colorName, tones] of Object.entries(FIXED_PALETTE)) {
      for (const [toneKey, hex] of Object.entries(tones)) {
        if (!map.has(hex.toLowerCase())) map.set(hex.toLowerCase(), \`\${colorName}.\${toneKey}\`);
      }
    }
    return map;
  }, [families]);

  const tokenCss = useMemo(() => {
    if (Object.keys(tokenOverrides).length === 0) return "/* No token overrides */";
    const lines = Object.entries(tokenOverrides).map(([cssVar, hexValue]) => {
      const tokenName = hexToTokenName.get(hexValue.toLowerCase());
      const originalRef = CSS_VAR_TO_DEFAULT_REF[cssVar];
      const valueStr = tokenName ?? hexValue;
      const comment = originalRef ? \` /* was: \${originalRef} */\` : "";
      return \`  \${cssVar}: \${valueStr};\${comment}\`;
    });
    return \`:root {\\n\${lines.join("\\n")}\\n}\`;
  }, [tokenOverrides, hexToTokenName]);

  const handleV3Upload = (data: TokenData) => {
    setV3Data(data);
    try {
      localStorage.setItem(V3_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore storage errors
    }
  };

  const activeContent =
    tab === "base-hex" ? baseHexJson : tab === "base-oklch" ? baseOklchJson : tab === "primary" ? primaryJs : tokenCss;

  const handleDownload = () => {
    if (tab === "design-tokens") {
      const v2Data = parseAegisV2TokenRefs();
      const md = generateDesignTokensMarkdown(v2Data, v3Data);
      downloadBlob(md, "design-tokens-comparison.md", "text/markdown");
      return;
    }
    if (tab === "tokens") {
      downloadBlob(tokenCss, "token-overrides.css", "text/css");
      return;
    }
    if (!activeProject) return;
    const sanitized = activeProject.name.trim().replace(/\\s+/g, "-").toLowerCase() || "palette";
    if (tab === "base-hex") {
      downloadBlob(baseHexJson, \`\${sanitized}-palette.json\`, "application/json");
    } else if (tab === "base-oklch") {
      downloadBlob(baseOklchJson, \`\${sanitized}-palette.oklch.json\`, "application/json");
    } else {
      downloadBlob(primaryJs, "palette.tokens.js", "text/javascript");
    }
  };

  const isDesignTokens = tab === "design-tokens";
  const bodyWidth = isDesignTokens ? "var(--aegis-layout-width-x4Large)" : "var(--aegis-layout-width-medium)";

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        width="auto"
        style={{
          display: "grid",
          gridTemplateRows: "auto minmax(0, 1fr) auto",
          height: "70vh",
          maxHeight: "calc(100vh - 32px)",
        }}
      >
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>Download code</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <div
          style={{
            display: "grid",
            gap: "var(--aegis-space-large)",
            gridTemplateRows: "auto minmax(0, 1fr)",
            minHeight: 0,
            overflow: "hidden",
            paddingBlock: "var(--aegis-space-small)",
            paddingInline: "var(--aegis-space-xLarge)",
          }}
        >
          <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
            <TabsList>
              <TabsTrigger value="base-hex">Base hex</TabsTrigger>
              <TabsTrigger value="base-oklch">Base oklch</TabsTrigger>
              <TabsTrigger value="primary">Primary</TabsTrigger>
              <TabsTrigger value="tokens">Token Overrides</TabsTrigger>
              <TabsTrigger value="design-tokens">Design Tokens</TabsTrigger>
            </TabsList>
          </Tabs>
          <div
            style={{
              height: "100%",
              inlineSize: bodyWidth,
              maxInlineSize: "100%",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {isDesignTokens ? (
              <DesignTokensTab v3Data={v3Data} onV3Upload={handleV3Upload} />
            ) : (
              <textarea readOnly style={TEXTAREA_STYLE} value={activeContent} />
            )}
          </div>
        </div>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button disabled={tab !== "tokens" && tab !== "design-tokens" && !activeProject} onClick={handleDownload}>
              Download
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
`;export{e as default};