import { useCallback, useEffect, useRef, useState } from "react";
import type { WalkthroughScenario } from "./walkthrough-data";

interface UseWalkthroughOptions {
  scenarios: WalkthroughScenario[];
}

export function useWalkthrough({ scenarios }: UseWalkthroughOptions) {
  const [isActive, setIsActive] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentScenario = scenarios[scenarioIndex];
  const currentStep = currentScenario?.steps[stepIndex];
  const totalSteps = currentScenario?.steps.length ?? 0;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback((index = 0) => {
    setScenarioIndex(index);
    setStepIndex(0);
    setIsActive(true);
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setIsActive(false);
    setIsPlaying(false);
    setStepIndex(0);
  }, [clearTimer]);

  const next = useCallback(() => {
    setStepIndex((prev) => {
      if (prev < totalSteps - 1) return prev + 1;
      // Reached end — stop playing
      setIsPlaying(false);
      return prev;
    });
  }, [totalSteps]);

  const prev = useCallback(() => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
  }, [clearTimer]);

  // Auto-advance timer
  useEffect(() => {
    clearTimer();
    if (!isActive || !isPlaying || !currentStep) return;

    const delay = currentStep.autoAdvanceMs;
    if (!delay) {
      // No auto-advance for this step — pause
      setIsPlaying(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      next();
    }, delay);

    return clearTimer;
  }, [isActive, isPlaying, currentStep, next, clearTimer]);

  return {
    isActive,
    scenarioIndex,
    stepIndex,
    totalSteps,
    isPlaying,
    currentScenario,
    currentStep,
    start,
    stop,
    next,
    prev,
    play,
    pause,
    setScenarioIndex: (index: number) => {
      setScenarioIndex(index);
      setStepIndex(0);
      setIsPlaying(false);
    },
  };
}
