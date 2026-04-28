export const isTauriRuntime = () => typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

export const invokeTauri = async <T>(command: string, args?: Record<string, unknown>) => {
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<T>(command, args);
};
