import { useCallback, useState } from "react";
import type { Memo } from "../types";

export const toPercentPosition = (px: number, viewportSize: number): number => {
  return (px / viewportSize) * 100;
};

interface UseMemosReturn {
  memos: Memo[];
  addMemo: (x: number, y: number) => void;
  updateMemo: (id: string, text: string) => void;
  moveMemo: (id: string, x: number, y: number) => void;
  removeMemo: (id: string) => void;
  clearMemos: () => void;
}

export const useMemos = (): UseMemosReturn => {
  const [memos, setMemos] = useState<Memo[]>([]);

  const addMemo = useCallback((x: number, y: number) => {
    const memo: Memo = {
      id: crypto.randomUUID(),
      x: toPercentPosition(x, window.innerWidth),
      y: toPercentPosition(y, window.innerHeight),
      text: "",
    };
    setMemos((prev) => [...prev, memo]);
  }, []);

  const updateMemo = useCallback((id: string, text: string) => {
    setMemos((prev) => prev.map((m) => (m.id === id ? { ...m, text } : m)));
  }, []);

  const moveMemo = useCallback((id: string, x: number, y: number) => {
    setMemos((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, x: toPercentPosition(x, window.innerWidth), y: toPercentPosition(y, window.innerHeight) }
          : m,
      ),
    );
  }, []);

  const removeMemo = useCallback((id: string) => {
    setMemos((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clearMemos = useCallback(() => {
    setMemos([]);
  }, []);

  return { memos, addMemo, updateMemo, moveMemo, removeMemo, clearMemos };
};
