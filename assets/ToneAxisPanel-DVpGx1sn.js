var e=`import { EmptyState, Text, TextField } from "@legalforce/aegis-react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { MAX_CHROMA, maxChromaForGamut, maxSrgbLightness, minSrgbLightness } from "../../color/oklch";
import { usePaletteLabContext } from "../../store/context";
import type { ColorFamily, ToneEntry } from "../../store/types";
import { toneLabel } from "../../store/types";
import type { GamutConstraint } from "../GamutChannelSlider";
import { GamutChannelSlider, getConstrainedValidBounds } from "../GamutChannelSlider";
import type { CurvePoint } from "../ToneCurve";
import { ToneCurve } from "../ToneCurve";

const DEFAULT_BASE_TONE = 500;

const getFamilyRepresentativeHex = (family: ColorFamily): string => {
  const baseTone = family.primaryBaseTone ?? DEFAULT_BASE_TONE;
  return family.tones.find((t) => t.value === baseTone)?.hex ?? family.tones[0]?.hex ?? "#888888";
};

type LchChannel = "lightness" | "chroma" | "hue";

const LC_ROWS: Array<{ label: string; channel: "lightness" | "chroma"; format: (v: number) => string }> = [
  { label: "Lightness", channel: "lightness", format: (v) => v.toFixed(1) },
  { label: "Chroma", channel: "chroma", format: (v) => v.toFixed(3) },
];

const getChannelValue = (
  entries: Array<{ tone: ToneEntry | null }>,
  channel: LchChannel,
): { value: number; isMixed: boolean } => {
  const tones = entries.filter((e): e is { tone: ToneEntry } => e.tone !== null).map((e) => e.tone[channel]);
  if (tones.length === 0) return { value: 0, isMixed: false };
  const allSame = tones.every((v) => v === tones[0]);
  return { value: tones[0], isMixed: !allSame };
};

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

/** L/C rows + Hue placeholder for cross-family editing — rendered in the shared params section in index.tsx */
export const ToneLchEditor = () => {
  const { state, dispatch } = usePaletteLabContext();
  // Snapshots each family's chroma at the moment a drag begins, for delta-based bulk editing.
  const chromaDragInitRef = useRef<Map<string, number>>(new Map());
  const activeToneValue = state.activeToneValue;
  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const families = activeProject?.colorFamilies ?? [];
  const neutral50Hex = families.find((f) => f.name === "neutral")?.tones.find((t) => t.value === 50)?.hex;

  if (activeToneValue === null) {
    return <EmptyState size="small" title="トーン値を選択してください" />;
  }

  const entries = families.map((family) => ({
    family,
    tone: family.tones.find((t) => t.value === activeToneValue) ?? null,
  }));

  // Neutral is excluded: its chroma is always 0, so it would collapse the intersection to near-zero.
  const constraints: GamutConstraint[] = entries
    .filter((e): e is { family: ColorFamily; tone: ToneEntry } => e.tone !== null && e.family.name !== "neutral")
    .map((e) => ({ lightness: e.tone.lightness, chroma: e.tone.chroma, hue: e.tone.hue }));

  const firstTone = entries.find((e) => e.tone !== null && e.family.name !== "neutral")?.tone ?? null;
  const repLightness = firstTone?.lightness ?? 50;
  const repChroma = firstTone?.chroma ?? 0.1;
  const repHue = firstTone?.hue ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
      {LC_ROWS.map(({ label, channel, format }) => {
        const { value: channelValue, isMixed } = getChannelValue(entries, channel);
        const isChroma = channel === "chroma";

        const chromaMax = MAX_CHROMA[state.gamut];
        const [inputMin, inputMax] = isChroma
          ? ([0, chromaMax] as const)
          : getConstrainedValidBounds("lightness", constraints);
        const inputValue = isChroma ? repChroma : channelValue;

        const handleInputCommit = (v: number) => {
          if (isChroma) {
            const delta = v - repChroma;
            entries.forEach((e) => {
              if (e.tone === null || e.family.name === "neutral") return;
              const newChroma = Math.max(0, Math.min(chromaMax, e.tone.chroma + delta));
              dispatch({
                type: "UPDATE_TONE",
                payload: { familyId: e.family.id, toneValue: activeToneValue, patch: { chroma: newChroma } },
              });
            });
          } else {
            dispatch({ type: "UPDATE_TONE_BULK", payload: { toneValue: activeToneValue, patch: { lightness: v } } });
          }
        };

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
            <LchInput format={format} max={inputMax} min={inputMin} value={inputValue} onChange={handleInputCommit} />
            {isChroma ? (
              <GamutChannelSlider
                channel="chroma"
                chroma={repChroma}
                chromaMax={chromaMax}
                constraints={constraints}
                gamut={state.gamut}
                hue={repHue}
                invalidColor={neutral50Hex}
                lightness={repLightness}
                value={repChroma}
                onDragStart={() => {
                  const map = new Map<string, number>();
                  entries.forEach((e) => {
                    if (e.tone !== null) map.set(e.family.id, e.tone.chroma);
                  });
                  chromaDragInitRef.current = map;
                }}
                onDelta={(delta) => {
                  entries.forEach((e) => {
                    if (e.tone === null || e.family.name === "neutral") return;
                    const initial = chromaDragInitRef.current.get(e.family.id) ?? e.tone.chroma;
                    const newChroma = Math.max(0, Math.min(chromaMax, initial + delta));
                    dispatch({
                      type: "UPDATE_TONE",
                      payload: { familyId: e.family.id, toneValue: activeToneValue, patch: { chroma: newChroma } },
                    });
                  });
                }}
              />
            ) : (
              <GamutChannelSlider
                channel="lightness"
                chroma={repChroma}
                constraints={constraints}
                hue={repHue}
                invalidColor={neutral50Hex}
                lightness={repLightness}
                mixed={isMixed}
                value={channelValue}
                onChange={(v) =>
                  dispatch({
                    type: "UPDATE_TONE_BULK",
                    payload: { toneValue: activeToneValue, patch: { lightness: v } },
                  })
                }
              />
            )}
          </div>
        );
      })}
      {/* Hue row — read-only placeholder for alignment with the left panel */}
      <div
        style={{
          alignItems: "center",
          columnGap: "var(--aegis-space-xSmall)",
          display: "grid",
          gridTemplateColumns: "80px 72px 1fr",
        }}
      >
        <Text color="subtle" variant="label.small">
          Hue
        </Text>
      </div>
    </div>
  );
};

// Shared curve logic for cross-family editing.
const useToneCurves = () => {
  const { state, dispatch } = usePaletteLabContext();
  const activeToneValue = state.activeToneValue;
  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
  const families = activeProject?.colorFamilies ?? [];

  const entries = families.map((family) => ({
    family,
    tone: family.tones.find((t) => t.value === activeToneValue) ?? null,
  }));

  const filteredEntries = entries.filter((e): e is { family: ColorFamily; tone: ToneEntry } => e.tone !== null);

  // Index of the active family within filteredEntries — used as highlightToneValue for the cross-family curve.
  const highlightIndex = filteredEntries.findIndex((e) => e.family.id === state.activeFamilyId);
  const highlightToneValue = highlightIndex >= 0 ? highlightIndex : null;

  const buildCrossPoints = (channel: LchChannel): CurvePoint[] =>
    filteredEntries.map((e, i) => {
      const base: CurvePoint = {
        toneValue: i,
        channelValue: e.tone[channel],
        color: getFamilyRepresentativeHex(e.family),
      };
      if (channel === "chroma") {
        base.gamutMax = maxChromaForGamut(e.tone.lightness, e.tone.hue, state.gamut);
      } else if (channel === "lightness") {
        base.gamutMax = maxSrgbLightness(e.tone.chroma, e.tone.hue);
        base.gamutMin = minSrgbLightness(e.tone.chroma, e.tone.hue);
      }
      return base;
    });

  const handleDrag = (channel: LchChannel, newValue: number) => {
    if (activeToneValue === null) return;
    dispatch({
      type: "UPDATE_TONE_BULK_DRAG",
      payload: { toneValue: activeToneValue, patch: { [channel]: newValue } },
    });
  };

  // Per-family drag: only the family at \`index\` is updated. Used for the chroma curve
  // where each family is expected to maintain its own chroma value (e.g. red 500 lower
  // than yellow 500). Lightness keeps the bulk behavior so the L curve stays aligned.
  const handleDragForIndex = (channel: LchChannel, index: number, newValue: number) => {
    if (activeToneValue === null) return;
    const entry = filteredEntries[index];
    if (!entry) return;
    dispatch({
      type: "UPDATE_TONE_DRAG",
      payload: { familyId: entry.family.id, toneValue: activeToneValue, patch: { [channel]: newValue } },
    });
  };

  const handleDragStart = () => {
    dispatch({ type: "PUSH_UNDO_SNAPSHOT" });
  };

  const handleCrossSelect = (index: number) => {
    const entry = filteredEntries[index];
    if (!entry) return;
    dispatch({ type: "SELECT_FAMILY", payload: { familyId: entry.family.id } });
  };

  return {
    activeToneValue,
    buildCrossPoints,
    handleDrag,
    handleDragForIndex,
    handleDragStart,
    handleCrossSelect,
    highlightToneValue,
  };
};

/** Cross-family lightness curve — rendered in the shared body in index.tsx */
export const ToneLightnessCurve = () => {
  const { activeToneValue, buildCrossPoints, handleDrag, handleDragStart, handleCrossSelect, highlightToneValue } =
    useToneCurves();
  if (activeToneValue === null) return <EmptyState size="small" title="トーン値を選択してください" />;
  return (
    <ToneCurve
      channel="lightness"
      columnHeader={toneLabel(activeToneValue)}
      highlightToneValue={highlightToneValue}
      onDragStart={handleDragStart}
      onPointDrag={(_i, v) => handleDrag("lightness", v)}
      onPointSelect={handleCrossSelect}
      points={buildCrossPoints("lightness")}
    />
  );
};

/** Cross-family chroma curve — per-family update (each family keeps its own chroma). */
export const ToneChromaCurve = () => {
  const {
    activeToneValue,
    buildCrossPoints,
    handleDragForIndex,
    handleDragStart,
    handleCrossSelect,
    highlightToneValue,
  } = useToneCurves();
  if (activeToneValue === null) return <EmptyState size="small" title="トーン値を選択してください" />;
  return (
    <ToneCurve
      channel="chroma"
      highlightToneValue={highlightToneValue}
      onDragStart={handleDragStart}
      onPointDrag={(i, v) => handleDragForIndex("chroma", i, v)}
      onPointSelect={handleCrossSelect}
      points={buildCrossPoints("chroma")}
    />
  );
};
`;export{e as default};