import { createContext, type ReactNode, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";

type Scale = "medium" | "small" | "full";

interface ScaleContextValue {
  scale: Scale;
}

const ScaleContext = createContext<ScaleContextValue | null>(null);

/**
 * クエリパラメータからスケールを判定
 * - ?scale=small → small
 * - ?scale=full → full
 * - その他 → medium
 */
function detectScaleFromSearch(search: string): Scale {
  const params = new URLSearchParams(search);
  const value = params.get("scale");
  if (value === "small" || value === "full") return value;
  return "medium";
}

interface ScaleProviderProps {
  children: ReactNode;
}

export function ScaleProvider({ children }: ScaleProviderProps) {
  const location = useLocation();
  const scale = useMemo(() => detectScaleFromSearch(location.search), [location.search]);

  return <ScaleContext.Provider value={{ scale }}>{children}</ScaleContext.Provider>;
}

export function useScale() {
  const context = useContext(ScaleContext);
  if (!context) {
    throw new Error("useScale must be used within ScaleProvider");
  }
  return context;
}
