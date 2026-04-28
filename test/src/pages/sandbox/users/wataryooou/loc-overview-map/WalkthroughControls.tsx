import { LfAngleLeft, LfAngleRight, LfArrowRight, LfCloseLarge, LfSquareFill } from "@legalforce/aegis-icons";
import { Icon, IconButton, ProgressBar, Select, Text, Tooltip } from "@legalforce/aegis-react";
import { Panel } from "@xyflow/react";
import { useMemo } from "react";
import type { WalkthroughScenario } from "./walkthrough-data";

interface WalkthroughControlsProps {
  scenarios: WalkthroughScenario[];
  scenarioIndex: number;
  stepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  currentStep?: { title: string; description?: string };
  onScenarioChange: (index: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onStop: () => void;
}

export function WalkthroughControls({
  scenarios,
  scenarioIndex,
  stepIndex,
  totalSteps,
  isPlaying,
  currentStep,
  onScenarioChange,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onStop,
}: WalkthroughControlsProps) {
  const progress = totalSteps > 0 ? ((stepIndex + 1) / totalSteps) * 100 : 0;

  const scenarioOptions = useMemo(() => scenarios.map((s, i) => ({ label: s.name, value: String(i) })), [scenarios]);

  return (
    <Panel position="bottom-center">
      <div
        style={{
          backgroundColor: "var(--aegis-color-background-default)",
          borderRadius: "var(--aegis-radius-large)",
          border: "1px solid var(--aegis-color-border-default)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          padding: "var(--aegis-space-medium)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-small)",
          minWidth: 400,
          maxWidth: 520,
        }}
      >
        {/* Top row: scenario select + close */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
          <div style={{ flex: 1 }}>
            <Select
              size="small"
              options={scenarioOptions}
              value={String(scenarioIndex)}
              onChange={(value) => onScenarioChange(Number(value))}
            />
          </div>
          <Tooltip title="終了">
            <IconButton aria-label="ウォークスルーを終了" variant="subtle" size="small" onClick={onStop}>
              <Icon size="xSmall">
                <LfCloseLarge />
              </Icon>
            </IconButton>
          </Tooltip>
        </div>

        {/* Step info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
            <Text variant="label.small" color="information">
              Step {stepIndex + 1} / {totalSteps}
            </Text>
            <Text variant="label.small.bold">{currentStep?.title}</Text>
          </div>
          {currentStep?.description && (
            <Text variant="body.xSmall" color="subtle">
              {currentStep.description}
            </Text>
          )}
        </div>

        {/* Progress bar */}
        <ProgressBar value={progress} size="small" />

        {/* Controls row */}
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--aegis-space-xSmall)" }}
        >
          <Tooltip title="前のステップ">
            <IconButton
              aria-label="前のステップ"
              variant="subtle"
              size="small"
              onClick={onPrev}
              disabled={stepIndex === 0}
            >
              <Icon size="xSmall">
                <LfAngleLeft />
              </Icon>
            </IconButton>
          </Tooltip>

          {isPlaying ? (
            <Tooltip title="一時停止">
              <IconButton aria-label="一時停止" variant="solid" size="small" onClick={onPause}>
                <Icon size="xSmall">
                  <LfSquareFill />
                </Icon>
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="再生">
              <IconButton aria-label="再生" variant="solid" size="small" onClick={onPlay}>
                <Icon size="xSmall">
                  <LfArrowRight />
                </Icon>
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="次のステップ">
            <IconButton
              aria-label="次のステップ"
              variant="subtle"
              size="small"
              onClick={onNext}
              disabled={stepIndex === totalSteps - 1}
            >
              <Icon size="xSmall">
                <LfAngleRight />
              </Icon>
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Panel>
  );
}
