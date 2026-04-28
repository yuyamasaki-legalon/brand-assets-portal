import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { ThemeName } from "../themes";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isAutoDetected: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * URL パスからテーマを自動判定
 * - /loc を含む → neutral (LegalOn)
 * - /workon を含む → green (WorkOn)
 * - /dealon を含む → navy (DealOn)
 * - その他 → null (デフォルトを使用)
 */
function detectThemeFromPath(pathname: string): ThemeName | null {
  if (pathname.includes("/loc/") || pathname.endsWith("/loc")) return "neutral";
  if (pathname.includes("/workon/") || pathname.endsWith("/workon")) return "green";
  if (pathname.includes("/dealon/") || pathname.endsWith("/dealon")) return "navy";
  return null;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const location = useLocation();
  const [manualTheme, setManualTheme] = useState<ThemeName | null>(null);

  const autoTheme = detectThemeFromPath(location.pathname);
  const isAutoDetected = autoTheme !== null && manualTheme === null;
  const theme = manualTheme ?? autoTheme ?? "neutral";

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset manual theme on path change
  useEffect(() => {
    setManualTheme(null);
  }, [location.pathname]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: setManualTheme,
        isAutoDetected,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
