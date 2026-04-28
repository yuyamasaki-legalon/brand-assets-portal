import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { FlowMapEdge, FlowMapNode } from "./FlowMap";

interface PrototypeToolsData {
  mapData?: { nodes: FlowMapNode[]; edges: FlowMapEdge[] };
  specContent?: string;
  qaContent?: string;
  onMapNodeClick?: (path: string) => void;
}

interface PrototypeContextValue {
  tools: PrototypeToolsData | null;
  setTools: (tools: PrototypeToolsData | null) => void;
}

const PrototypeContext = createContext<PrototypeContextValue>({
  tools: null,
  setTools: () => {},
});

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [tools, setTools] = useState<PrototypeToolsData | null>(null);
  const value = useMemo(() => ({ tools, setTools }), [tools]);
  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

/** Read the current prototype tools data (used by FloatingSourceCodeViewer) */
export function usePrototypeTools(): PrototypeToolsData | null {
  return useContext(PrototypeContext).tools;
}

/** Register prototype tools data from a PrototypeShell page. Cleans up on unmount. */
export function useRegisterPrototypeTools(data: PrototypeToolsData) {
  const { setTools } = useContext(PrototypeContext);

  useEffect(() => {
    setTools(data);
    return () => setTools(null);
  }, [setTools, data]);
}
