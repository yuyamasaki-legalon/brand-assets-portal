import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

/**
 * フラグ定義: ここに追加するだけで型安全に使える。
 * キーがフラグ名、description は Settings UI のラベルに表示される。
 */
export const FLAG_DEFINITIONS = {
  enableNewSidebar: {
    defaultValue: false,
    description: "New sidebar navigation layout",
  },
  enableLiveEditor: {
    defaultValue: false,
    description: "Live variant / spacing editor (localhost only)",
  },
} as const satisfies Record<string, { defaultValue: boolean; description: string }>;

export type FlagName = keyof typeof FLAG_DEFINITIONS;
export type FlagValues = { [K in FlagName]: boolean };

export interface FeatureFlagContextValue {
  flags: FlagValues;
  setFlag: (name: FlagName, value: boolean) => void;
  resetFlags: () => void;
}

export const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

function getDefaultFlags(): FlagValues {
  return Object.fromEntries(
    Object.entries(FLAG_DEFINITIONS).map(([key, def]) => [key, def.defaultValue]),
  ) as FlagValues;
}

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FlagValues>(getDefaultFlags);

  const setFlag = useCallback((name: FlagName, value: boolean) => {
    setFlags((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetFlags = useCallback(() => {
    setFlags(getDefaultFlags());
  }, []);

  const value = useMemo(() => ({ flags, setFlag, resetFlags }), [flags, setFlag, resetFlags]);

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
}

export function useFeatureFlag(name: FlagName): boolean {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error("useFeatureFlag must be used within FeatureFlagProvider");
  }
  return context.flags[name];
}

export function useFeatureFlags(): FeatureFlagContextValue {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error("useFeatureFlags must be used within FeatureFlagProvider");
  }
  return context;
}
