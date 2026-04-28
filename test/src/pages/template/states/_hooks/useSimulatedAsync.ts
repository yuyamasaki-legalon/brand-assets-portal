import { useCallback, useState } from "react";

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

type UseSimulatedAsyncOptions<T> = {
  delay?: number;
  shouldFail?: boolean;
  data?: T;
  errorMessage?: string;
};

export function useSimulatedAsync<T = unknown>(options: UseSimulatedAsyncOptions<T> = {}) {
  const { delay = 1500, shouldFail = false, data, errorMessage = "エラーが発生しました" } = options;
  const [state, setState] = useState<AsyncState<T>>({ status: "idle" });

  const execute = useCallback(() => {
    setState({ status: "loading" });
    const timer = setTimeout(() => {
      if (shouldFail) {
        setState({ status: "error", error: errorMessage });
      } else {
        setState({ status: "success", data: data as T });
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, shouldFail, data, errorMessage]);

  const reset = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  return { state, execute, reset };
}
