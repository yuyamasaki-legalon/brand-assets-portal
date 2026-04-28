import { Provider } from "@legalforce/aegis-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { AppSidebarLayout } from "./components/AppSidebar";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FloatingMenu } from "./components/FloatingMenu";
import FloatingSourceCodeViewer from "./components/FloatingSourceCodeViewer";
import { PrototypeProvider } from "./components/prototype";
import type { CommentButtonState } from "./components/SandboxCommentMode";
import { SandboxCommentMode } from "./components/SandboxCommentMode";
import { ScreenRecorderToolbar } from "./components/ScreenRecorderToolbar";
import { FeatureFlagProvider, useFeatureFlag } from "./contexts/FeatureFlagContext";
import { LocaleUrlProvider } from "./contexts/LocaleUrlProvider";
import { ScaleProvider, useScale } from "./contexts/ScaleContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { useLocale } from "./hooks";
import { allRoutes, routeFileMap } from "./routeCatalog";
import { themes } from "./themes";

// Use Vite's import.meta.glob to import all source files as raw strings
const sourceFiles = import.meta.glob("/src/**/*.{ts,tsx}", {
  query: "?raw",
  eager: false,
  import: "default",
});

// Markdown files in sandbox and docs directories
const markdownFiles = import.meta.glob(["/src/pages/sandbox/**/*.md", "/docs/**/*.md"], {
  query: "?raw",
  eager: false,
  import: "default",
});

const fetchSourceCode = async (filePath: string): Promise<string> => {
  try {
    // Construct the full path that matches import.meta.glob pattern
    const fullPath = `/${filePath}`;

    // Check if we have this file in our glob
    if (sourceFiles[fullPath]) {
      const sourceModule = (await sourceFiles[fullPath]()) as string;
      return sourceModule;
    }

    // Fallback: try direct fetch (though this will be transpiled)
    const response = await fetch(`/${filePath}?raw`);
    if (response.ok) {
      const code = await response.text();
      return code;
    }
  } catch (_err) {
    // Silently fail and return fallback message
  }

  return `// Source code for ${filePath} is not available
// In development mode, you can view the file directly in your editor
// File path: ${filePath}`;
};

const fetchMarkdownContent = async (path: string): Promise<string> => {
  try {
    if (markdownFiles[path]) {
      const content = (await markdownFiles[path]()) as string;
      return content;
    }
  } catch (_err) {
    // Silently fail
  }
  return "# Error\n\nFailed to load markdown file.";
};

// Get adjacent markdown files for a given file path
const getAdjacentMarkdownFiles = (filePath: string): string[] => {
  if (filePath === "unknown") return [];

  // Extract directory from file path (e.g., "src/pages/sandbox/users/chie/analytics6/index.tsx" -> "src/pages/sandbox/users/chie/analytics6")
  const dir = filePath.replace(/\/[^/]+$/, "");

  // Find all markdown files that are in the same directory or subdirectories
  return Object.keys(markdownFiles).filter((mdPath) => {
    // mdPath starts with "/" (e.g., "/src/pages/sandbox/...")
    // dir doesn't start with "/" (e.g., "src/pages/sandbox/...")
    return mdPath.startsWith(`/${dir}/`) || mdPath.startsWith(`/${dir}`);
  });
};

const extractAegisComponents = (sourceCode: string): string[] => {
  if (!sourceCode || sourceCode.length === 0) {
    return [];
  }

  // Find import statements from @legalforce/aegis-react
  // Use [\s\S] to match across multiple lines including newlines
  const importRegex = /import\s+\{([\s\S]+?)\}\s+from\s+["']@legalforce\/aegis-react["']/g;
  const components = new Set<string>();

  let match = importRegex.exec(sourceCode);
  while (match !== null) {
    // Extract component names from the import statement
    const importedItems = match[1];

    // Split by comma and process each line
    const lines = importedItems.split("\n");

    lines.forEach((line) => {
      // Remove inline comments
      const withoutComments = line.split("//")[0];

      // Split by comma to handle multiple imports on one line
      const items = withoutComments.split(",");

      items.forEach((item) => {
        // Clean up whitespace and remove 'type' keyword
        const cleaned = item.trim().replace(/^type\s+/, "");

        // Add to set if non-empty and valid identifier
        if (cleaned && /^[A-Z][a-zA-Z0-9_]*/.test(cleaned)) {
          components.add(cleaned);
        }
      });
    });

    match = importRegex.exec(sourceCode);
  }

  // Return sorted array
  return Array.from(components).sort();
};

interface AppContentProps {
  embeddedPreview: boolean;
  viewerLauncherVisible: boolean;
  onViewerLauncherVisibilityChange: (visible: boolean) => void;
}

const AppContent = ({ embeddedPreview, viewerLauncherVisible, onViewerLauncherVisibilityChange }: AppContentProps) => {
  const location = useLocation();
  const [aegisComponents, setAegisComponents] = useState<string[]>([]);
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const screenRecorderToggleRef = useRef<(() => void) | null>(null);
  const settingsOpenRef = useRef<(() => void) | null>(null);
  const commentToggleRef = useRef<(() => void) | null>(null);
  const pickEditableRef = useRef<(() => void) | null>(null);
  const [commentState, setCommentState] = useState<CommentButtonState>({
    available: false,
    active: false,
    openThreadCount: 0,
  });
  const { theme, setTheme, isAutoDetected } = useTheme();
  const { locale, setLocale } = useLocale();
  const liveEditorFlag = useFeatureFlag("enableLiveEditor");

  const currentFilePath = routeFileMap[location.pathname] || "unknown";
  const isLocalHost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "::1";
  const liveEditorEnabled = import.meta.env.DEV && isLocalHost && liveEditorFlag;
  const githubUrl =
    currentFilePath !== "unknown" ? `https://github.com/legalforce/aegis-lab/blob/main/${currentFilePath}` : "";

  // Get adjacent markdown files for the current page
  const adjacentMarkdownFiles = useMemo(() => getAdjacentMarkdownFiles(currentFilePath), [currentFilePath]);

  useEffect(() => {
    if (currentFilePath !== "unknown") {
      fetchSourceCode(currentFilePath).then((code) => {
        const components = extractAegisComponents(code);
        setAegisComponents(components);
      });
    }
  }, [currentFilePath]);

  return (
    <>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
            }}
          >
            <div>Loading...</div>
          </div>
        }
      >
        {embeddedPreview ? (
          <Routes>
            {allRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={<ErrorBoundary>{route.element}</ErrorBoundary>} />
            ))}
          </Routes>
        ) : (
          <AppSidebarLayout>
            <SandboxCommentMode commentToggleRef={commentToggleRef} onCommentStateChange={setCommentState}>
              <Routes>
                {allRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={<ErrorBoundary>{route.element}</ErrorBoundary>} />
                ))}
              </Routes>
            </SandboxCommentMode>
          </AppSidebarLayout>
        )}
      </Suspense>
      {!embeddedPreview ? (
        <>
          <FloatingMenu
            visible={viewerLauncherVisible && !isScreenRecording}
            isRecording={isScreenRecording}
            liveEditorEnabled={liveEditorEnabled}
            onScreenRecorderToggle={() => screenRecorderToggleRef.current?.()}
            onSettingsOpen={() => settingsOpenRef.current?.()}
            onPickEditable={() => pickEditableRef.current?.()}
            onCommentToggle={() => commentToggleRef.current?.()}
            commentState={commentState}
          />
          <ScreenRecorderToolbar
            onRecordingChange={setIsScreenRecording}
            showTrigger={false}
            toggleRef={screenRecorderToggleRef}
          />
          <FloatingSourceCodeViewer
            currentPath={location.pathname}
            filePath={currentFilePath}
            githubUrl={githubUrl}
            aegisComponents={aegisComponents}
            liveEditorEnabled={liveEditorEnabled}
            locale={locale}
            onLocaleChange={setLocale}
            theme={theme}
            onThemeChange={setTheme}
            isThemeAutoDetected={isAutoDetected}
            launcherVisible={false}
            onLauncherVisibilityChange={onViewerLauncherVisibilityChange}
            adjacentMarkdownFiles={adjacentMarkdownFiles}
            fetchMarkdownContent={fetchMarkdownContent}
            onOpenSettingsRef={settingsOpenRef}
            onPickEditableRef={pickEditableRef}
          />
        </>
      ) : null}
    </>
  );
};

// Provider に動的テーマを適用するためのラッパー
interface ThemedAppProps {
  embeddedPreview: boolean;
  viewerLauncherVisible: boolean;
  onViewerLauncherVisibilityChange: (visible: boolean) => void;
}

const ThemedApp = ({ embeddedPreview, viewerLauncherVisible, onViewerLauncherVisibilityChange }: ThemedAppProps) => {
  const { theme } = useTheme();
  const { locale } = useLocale();
  const { scale } = useScale();

  return (
    <Provider theme={themes[theme]} locale={locale} scale={scale}>
      <PrototypeProvider>
        <AppContent
          embeddedPreview={embeddedPreview}
          viewerLauncherVisible={viewerLauncherVisible}
          onViewerLauncherVisibilityChange={onViewerLauncherVisibilityChange}
        />
      </PrototypeProvider>
    </Provider>
  );
};

const ALLOWED_HOSTS = ["localhost", "127.0.0.1", "aegis-lab.ontechnologies.tech"];
const isHostAllowed =
  ALLOWED_HOSTS.includes(window.location.hostname) ||
  window.location.hostname.endsWith(".on-technologies-technical-dept.workers.dev");

const App = () => {
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const embeddedPreview = searchParams.has("embedded-preview");
  const [viewerLauncherVisible, setViewerLauncherVisible] = useState(!embeddedPreview);

  // Shortcut to restore/hide launcher when it's hidden for screenshots
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (embeddedPreview) return;

      const isAltL = event.altKey && (event.code === "KeyL" || event.key.toLowerCase() === "l");
      if (isAltL) {
        event.preventDefault();
        setViewerLauncherVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [embeddedPreview]);

  if (!isHostAllowed) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p>Access Denied</p>
      </div>
    );
  }

  // Office Add-in (iframe) 環境では HashRouter を使用
  // iframe 内では BrowserRouter の History API が制限され、リンクが Office にインターセプトされるため
  // ローカルデバッグ: ?addin クエリパラメータで HashRouter を強制可能
  const isIframe = window.self !== window.top;
  const forceAddinMode = new URLSearchParams(window.location.search).has("addin");
  const Router = isIframe || forceAddinMode ? HashRouter : BrowserRouter;

  return (
    <Router>
      <LocaleUrlProvider>
        <ThemeProvider>
          <ScaleProvider>
            <FeatureFlagProvider>
              <ThemedApp
                embeddedPreview={embeddedPreview}
                viewerLauncherVisible={viewerLauncherVisible}
                onViewerLauncherVisibilityChange={setViewerLauncherVisible}
              />
            </FeatureFlagProvider>
          </ScaleProvider>
        </ThemeProvider>
      </LocaleUrlProvider>
    </Router>
  );
};

export default App;
