var e=`import { EmptyState, Text, TextField } from "@legalforce/aegis-react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useState } from "react";

import {
  MAX_CHROMA,
  maxChromaForGamut,
  maxSrgbLightness,
  minSrgbLightness,
  srgbHueInvalidRanges,
} from "../../color/oklch";
import { usePaletteLabContext } from "../../store/context";
import { isDisplayTone } from "../../store/types";
import { GamutChannelSlider } from "../GamutChannelSlider";
import type { CurvePoint } from "../ToneCurve";
import { ToneCurve } from "../ToneCurve";

type LchChannel = "lightness" | "chroma" | "hue";

const LCH_ROWS: Array<{
  label: string;
  channel: LchChannel;
  min: number;
  max: number;
  format: (v: number) => string;
}> = [
  { label: "Lightness", channel: "lightness", min: 0, max: 100, format: (v) => v.toFixed(1) },
  { label: "Chroma", channel: "chroma", min: 0, max: 0.4, format: (v) => v.toFixed(3) },
  { label: "Hue", channel: "hue", min: 0, max: 360, format: (v) => v.toFixed(0) },
];

type LchInputProps = {
  value: number;
  min: number;
  max: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
};

const LchInput = ({ value, min, max, format, onChange }: LchInputProps) => {
  const [draft, setDraft] = useState(() => format(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDraft(format(value));
  }, [value, focused, format]);

  const commit = () => {
    const n = parseFloat(draft);
    if (!Number.isNaN(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      onChange(clamped);
      setDraft(format(clamped));
    } else {
      setDraft(format(value));
    }
    setFocused(false);
  };

  return (
    <TextField
      size="small"
      value={draft}
      onBlur={commit}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
      onFocus={() => setFocused(true)}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") commit();
      }}
    />
  );
};

/** L/C/H rows for single-family editing — rendered in the shared params section in index.tsx */
export const FamilyLchEditor = () => {
  const { state, dispatch } = usePaletteLabContext();
  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const activeFamily = activeProject?.colorFamilies.find((f) => f.id === state.activeFamilyId);
  const activeTone = activeFamily?.tones.find((t) => t.value === state.activeToneValue) ?? null;
  const neutral50Hex = activeProject?.colorFamilies
    .find((f) => f.name === "neutral")
    ?.tones.find((t) => t.value === 50)?.hex;

  if (!activeFamily) {
    return <EmptyState size="small" title="カラーファミリーを選択してください" />;
  }
  if (!activeTone) {
    return <EmptyState size="small" title="トーンを選択してください" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
      {LCH_ROWS.map(({ label, channel, min, max, format }) => {
        const effectiveMax = channel === "chroma" ? MAX_CHROMA[state.gamut] : max;
        return (
          <div
            key={channel}
            style={{
              alignItems: "center",
              columnGap: "var(--aegis-space-xSmall)",
              display: "grid",
              gridTemplateColumns: "80px 72px 1fr",
            }}
          >
            <Text color="subtle" variant="label.small">
              {label}
            </Text>
            <LchInput
              format={format}
              max={effectiveMax}
              min={min}
              onChange={(v) =>
                dispatch({
                  type: "UPDATE_TONE",
                  payload: {
                    familyId: activeFamily.id,
                    toneValue: activeTone.value,
                    patch: { [channel]: v },
                  },
                })
              }
              value={activeTone[channel]}
            />
            <GamutChannelSlider
              channel={channel}
              chroma={activeTone.chroma}
              chromaMax={channel === "chroma" ? MAX_CHROMA[state.gamut] : undefined}
              gamut={state.gamut}
              hue={activeTone.hue}
              invalidColor={neutral50Hex}
              lightness={activeTone.lightness}
              value={activeTone[channel]}
              onChange={(v) =>
                dispatch({
                  type: "UPDATE_TONE",
                  payload: {
                    familyId: activeFamily.id,
                    toneValue: activeTone.value,
                    patch: { [channel]: v },
                  },
                })
              }
            />
          </div>
        );
      })}
    </div>
  );
};

// Shared curve logic for single-family editing.
const useFamilyCurves = () => {
  const { state, dispatch } = usePaletteLabContext();
  const highlightToneValue = state.activeToneValue;
  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const activeFamily = activeProject?.colorFamilies.find((f) => f.id === state.activeFamilyId);

  const buildCurvePoints = (channel: LchChannel): CurvePoint[] =>
    activeFamily?.tones
      .filter((t) => isDisplayTone(t.value))
      .map((t) => {
        const base: CurvePoint = { toneValue: t.value, channelValue: t[channel], color: t.hex };
        if (channel === "chroma") {
          base.gamutMax = maxChromaForGamut(t.lightness, t.hue, state.gamut);
        } else if (channel === "lightness") {
          base.gamutMax = maxSrgbLightness(t.chroma, t.hue);
          base.gamutMin = minSrgbLightness(t.chroma, t.hue);
        } else if (channel === "hue") {
          const ranges = srgbHueInvalidRanges(t.lightness, t.chroma);
          if (ranges.length > 0) base.gamutInvalidRanges = ranges;
        }
        return base;
      }) ?? [];

  const handleCurveDrag = (channel: LchChannel, toneValue: number, newValue: number) => {
    if (!activeFamily) return;
    dispatch({
      type: "UPDATE_TONE_DRAG",
      payload: { familyId: activeFamily.id, toneValue, patch: { [channel]: newValue } },
    });
  };

  const handleDragStart = () => {
    dispatch({ type: "PUSH_UNDO_SNAPSHOT" });
  };

  const handleCurveSelect = (toneValue: number) => {
    if (!activeFamily) return;
    dispatch({ type: "SELECT_FAMILY", payload: { familyId: activeFamily.id } });
    dispatch({ type: "SELECT_TONE", payload: { toneValue } });
  };

  return { activeFamily, buildCurvePoints, handleCurveDrag, handleDragStart, handleCurveSelect, highlightToneValue };
};

/** Lightness curve for single-family editing — rendered in the shared body in index.tsx */
export const FamilyLightnessCurve = () => {
  const { activeFamily, buildCurvePoints, handleCurveDrag, handleDragStart, handleCurveSelect, highlightToneValue } =
    useFamilyCurves();
  if (!activeFamily) return <EmptyState size="small" title="カラーファミリーを選択してください" />;
  return (
    <ToneCurve
      channel="lightness"
      columnHeader={activeFamily.name}
      highlightToneValue={highlightToneValue}
      onDragStart={handleDragStart}
      onPointDrag={(tv, v) => handleCurveDrag("lightness", tv, v)}
      onPointSelect={handleCurveSelect}
      points={buildCurvePoints("lightness")}
    />
  );
};

/** Chroma curve for single-family editing — rendered in the shared body in index.tsx */
export const FamilyChromaCurve = () => {
  const { activeFamily, buildCurvePoints, handleCurveDrag, handleDragStart, handleCurveSelect, highlightToneValue } =
    useFamilyCurves();
  if (!activeFamily) return <EmptyState size="small" title="カラーファミリーを選択してください" />;
  return (
    <ToneCurve
      channel="chroma"
      highlightToneValue={highlightToneValue}
      onDragStart={handleDragStart}
      onPointDrag={(tv, v) => handleCurveDrag("chroma", tv, v)}
      onPointSelect={handleCurveSelect}
      points={buildCurvePoints("chroma")}
    />
  );
};

/** Hue curve for single-family editing — rendered in the shared body in index.tsx */
export const FamilyHueCurve = () => {
  const { activeFamily, buildCurvePoints, handleCurveDrag, handleDragStart, handleCurveSelect, highlightToneValue } =
    useFamilyCurves();
  if (!activeFamily) return <EmptyState size="small" title="カラーファミリーを選択してください" />;
  return (
    <ToneCurve
      channel="hue"
      highlightToneValue={highlightToneValue}
      onDragStart={handleDragStart}
      onPointDrag={(tv, v) => handleCurveDrag("hue", tv, v)}
      onPointSelect={handleCurveSelect}
      points={buildCurvePoints("hue")}
    />
  );
};
`;export{e as default};