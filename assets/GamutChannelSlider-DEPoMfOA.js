var e=`import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { isInGamutFor, isInSrgbGamut, oklchToHex } from "../../color/oklch";
import type { Gamut } from "../../store/types";

const TRACK_H = 28;
const THUMB_TOTAL = 32; // outer slider element height
const OVERFLOW = (THUMB_TOTAL - TRACK_H) / 2; // 2
const INVALID_COLOR = "#d4d4d4";
const DRAG_THRESHOLD = 4; // px — minimum movement to count as a drag vs. a click

type Channel = "lightness" | "chroma" | "hue";

const CHANNEL_CONFIG: Record<Channel, { min: number; max: number; steps: number; circular: boolean }> = {
  lightness: { min: 0, max: 100, steps: 200, circular: false },
  chroma: { min: 0, max: 0.4, steps: 200, circular: false },
  hue: { min: 0, max: 360, steps: 360, circular: true },
};

const KEY_STEP: Record<Channel, number> = {
  lightness: 0.1,
  chroma: 0.001,
  hue: 1,
};

const formatTick = (value: number, channel: Channel): string => {
  if (channel === "lightness") return value.toFixed(1);
  if (channel === "chroma") return value.toFixed(3);
  return value.toFixed(0);
};

// Fixed channel values used as constraints when checking gamut validity.
// For lightness channel: chroma + hue are the fixed axes.
// For chroma channel: lightness + hue are the fixed axes.
// For hue channel: lightness + chroma are the fixed axes.
export type GamutConstraint = { lightness: number; chroma: number; hue: number };

type ValidRange = readonly [number, number];

type IsInGamutFn = (l: number, c: number, h: number) => boolean;

const isValidAt = (
  channel: Channel,
  v: number,
  lightness: number,
  chroma: number,
  hue: number,
  constraints?: GamutConstraint[],
  isInGamut: IsInGamutFn = isInSrgbGamut,
): boolean => {
  if (constraints && constraints.length > 0) {
    return constraints.every((c) => {
      if (channel === "lightness") return isInGamut(v, c.chroma, c.hue);
      if (channel === "chroma") return isInGamut(c.lightness, v, c.hue);
      return isInGamut(c.lightness, c.chroma, v);
    });
  }
  if (channel === "lightness") return isInGamut(v, chroma, hue);
  if (channel === "chroma") return isInGamut(lightness, v, hue);
  return isInGamut(lightness, chroma, v);
};

// Track color uses a representative single L/C/H even in multi-family mode.
const hexAt = (channel: Channel, v: number, lightness: number, chroma: number, hue: number): string => {
  if (channel === "lightness") return oklchToHex(v, chroma, hue);
  if (channel === "chroma") return oklchToHex(lightness, v, hue);
  return oklchToHex(lightness, chroma, v);
};

const computeValidRanges = (
  channel: Channel,
  lightness: number,
  chroma: number,
  hue: number,
  constraints?: GamutConstraint[],
  isInGamut: IsInGamutFn = isInSrgbGamut,
  chromaMax?: number,
): ValidRange[] => {
  const cfg = CHANNEL_CONFIG[channel];
  const max = channel === "chroma" && chromaMax !== undefined ? chromaMax : cfg.max;
  const { min, steps } = cfg;
  const ranges: ValidRange[] = [];
  let start: number | null = null;
  for (let i = 0; i <= steps; i++) {
    const v = min + (i / steps) * (max - min);
    const valid = isValidAt(channel, v, lightness, chroma, hue, constraints, isInGamut);
    if (valid && start === null) {
      start = v;
    } else if (!valid && start !== null) {
      const prevV = min + ((i - 1) / steps) * (max - min);
      ranges.push([start, prevV] as const);
      start = null;
    }
  }
  if (start !== null) ranges.push([start, max] as const);
  return ranges;
};

const snapToValid = (
  rawVal: number,
  prevVal: number,
  ranges: ValidRange[],
  channel: Channel,
  lightness: number,
  chroma: number,
  hue: number,
  constraints?: GamutConstraint[],
  isInGamut: IsInGamutFn = isInSrgbGamut,
): number => {
  if (ranges.length === 0) return rawVal;
  if (isValidAt(channel, rawVal, lightness, chroma, hue, constraints, isInGamut)) return rawVal;
  const { circular } = CHANNEL_CONFIG[channel];
  const direction = rawVal - prevVal;
  if (direction >= 0) {
    for (const [start] of ranges) {
      if (start > rawVal) return start;
    }
    return circular ? ranges[0][0] : ranges[ranges.length - 1][1];
  }
  for (let i = ranges.length - 1; i >= 0; i--) {
    if (ranges[i][1] < rawVal) return ranges[i][1];
  }
  return circular ? ranges[ranges.length - 1][1] : ranges[0][0];
};

// Returns the outer [min, max] bounds of the valid gamut zone(s) for the given channel.
// When constraints are provided, validity is the intersection across all constraint sets.
// Use the result to clamp text input values on the right-side (multi-family) panel.
export const getConstrainedValidBounds = (
  channel: "lightness" | "chroma" | "hue",
  constraints: GamutConstraint[],
  isInGamut: IsInGamutFn = isInSrgbGamut,
  chromaMax?: number,
): readonly [number, number] => {
  const config = CHANNEL_CONFIG[channel];
  const max = channel === "chroma" && chromaMax !== undefined ? chromaMax : config.max;
  // lightness/chroma/hue args only affect track coloring, not validity when constraints present.
  const ranges = computeValidRanges(channel, 0, 0, 0, constraints, isInGamut, chromaMax);
  if (ranges.length === 0) return [config.min, max];
  return [ranges[0][0], ranges[ranges.length - 1][1]];
};

type Props = {
  channel: Channel;
  lightness: number;
  chroma: number;
  hue: number;
  value: number;
  // Absolute mode: called with the snapped channel value. Used for single-family editing.
  onChange?: (v: number) => void;
  // Delta mode: called with (currentRawPosition - dragStartRawPosition).
  // Each caller applies the delta to its own initial values independently.
  // No snapping in delta mode — caller is responsible for clamping.
  onDelta?: (delta: number) => void;
  // Called once at drag start (before the first onDelta). Use to snapshot initial values.
  onDragStart?: () => void;
  // When provided, gamut validity = intersection across all constraints (multi-family mode).
  // The lightness/chroma/hue props are still used for track coloring.
  constraints?: GamutConstraint[];
  // Hide the thumb (value is ambiguous, e.g. mixed across families).
  // Gamut gradient is still rendered from constraints.
  mixed?: boolean;
  // Color to fill out-of-gamut zones. Defaults to INVALID_COLOR. Pass neutral-50 hex for dynamic palette sync.
  invalidColor?: string;
  // Design gamut — controls which colors are considered valid on the slider track.
  gamut?: Gamut;
  // Override the maximum value for the chroma channel (defaults to CHANNEL_CONFIG.chroma.max).
  chromaMax?: number;
};

export const GamutChannelSlider = ({
  channel,
  lightness,
  chroma,
  hue,
  value,
  onChange,
  onDelta,
  onDragStart,
  constraints,
  mixed = false,
  invalidColor = INVALID_COLOR,
  gamut = "sRGB",
  chromaMax,
}: Props) => {
  const isInGamutFn = useCallback<IsInGamutFn>((l, c, h) => isInGamutFor(l, c, h, gamut), [gamut]);
  const effectiveMax = channel === "chroma" && chromaMax !== undefined ? chromaMax : CHANNEL_CONFIG[channel].max;
  const { min } = CHANNEL_CONFIG[channel];
  const max = effectiveMax;
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const prevValRef = useRef(value);
  const dragStartRawRef = useRef(0);
  const [isActive, setIsActive] = useState(false);

  const validRanges = useMemo(
    () => computeValidRanges(channel, lightness, chroma, hue, constraints, isInGamutFn, effectiveMax),
    [channel, lightness, chroma, hue, constraints, isInGamutFn, effectiveMax],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const W = canvas.offsetWidth;
      if (W === 0) return;
      canvas.width = W;
      canvas.height = TRACK_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      for (let x = 0; x < W; x++) {
        const v = min + (x / W) * (max - min);
        const valid = isValidAt(channel, v, lightness, chroma, hue, constraints, isInGamutFn);
        ctx.fillStyle = valid ? hexAt(channel, v, lightness, chroma, hue) : invalidColor;
        ctx.fillRect(x, 0, 1, TRACK_H);
      }
    };

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    draw();
    return () => observer.disconnect();
  }, [channel, lightness, chroma, hue, min, max, invalidColor, constraints, isInGamutFn]);

  // Deactivate keyboard mode when clicking outside the slider
  useEffect(() => {
    if (!isActive) return;
    const handleOutside = (e: PointerEvent) => {
      if (outerRef.current && !outerRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [isActive]);

  const rawFromClientX = (clientX: number): number => {
    const outer = outerRef.current;
    if (!outer) return value;
    const rect = outer.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return min + ratio * (max - min);
  };

  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsActive(true);

    if (onDelta) {
      const raw = rawFromClientX(e.clientX);
      const snapped = snapToValid(
        raw,
        prevValRef.current,
        validRanges,
        channel,
        lightness,
        chroma,
        hue,
        constraints,
        isInGamutFn,
      );
      dragStartRawRef.current = snapped;
      prevValRef.current = snapped;
    } else {
      prevValRef.current = value;
    }
  };

  const handleThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current) return;
    const { x, y } = pointerStartRef.current;

    if (!isDraggingRef.current) {
      if (Math.hypot(e.clientX - x, e.clientY - y) < DRAG_THRESHOLD) return;
      isDraggingRef.current = true;
      if (onDelta) onDragStart?.();
    }

    const raw = rawFromClientX(e.clientX);
    if (onDelta) {
      const snapped = snapToValid(
        raw,
        prevValRef.current,
        validRanges,
        channel,
        lightness,
        chroma,
        hue,
        constraints,
        isInGamutFn,
      );
      prevValRef.current = snapped;
      onDelta(snapped - dragStartRawRef.current);
    } else {
      const v = snapToValid(
        raw,
        prevValRef.current,
        validRanges,
        channel,
        lightness,
        chroma,
        hue,
        constraints,
        isInGamutFn,
      );
      prevValRef.current = v;
      onChange?.(v);
    }
  };

  const handleThumbPointerUp = () => {
    if (isDraggingRef.current) {
      // Drag end → deactivate
      setIsActive(false);
    } else {
      // Click → keep active for keyboard mode
      outerRef.current?.focus();
    }
    isDraggingRef.current = false;
    pointerStartRef.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isActive) return;

    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      setIsActive(false);
      outerRef.current?.blur();
      return;
    }

    if (!onChange) return;

    const step = KEY_STEP[channel];
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const newVal = Math.min(max, value + step);
      const v = snapToValid(
        newVal,
        prevValRef.current,
        validRanges,
        channel,
        lightness,
        chroma,
        hue,
        constraints,
        isInGamutFn,
      );
      prevValRef.current = v;
      onChange(v);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const newVal = Math.max(min, value - step);
      const v = snapToValid(
        newVal,
        prevValRef.current,
        validRanges,
        channel,
        lightness,
        chroma,
        hue,
        constraints,
        isInGamutFn,
      );
      prevValRef.current = v;
      onChange(v);
    }
  };

  const thumbLeft = \`\${((value - min) / (max - min)) * 100}%\`;
  const ariaLabel = \`\${channel.charAt(0).toUpperCase()}\${channel.slice(1)}: \${formatTick(value, channel)}\`;

  return (
    <div
      ref={outerRef}
      aria-label={ariaLabel}
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
      role="slider"
      style={{ cursor: "default", height: THUMB_TOTAL, position: "relative", userSelect: "none" }}
      tabIndex={0}
      onBlur={() => setIsActive(false)}
      onKeyDown={handleKeyDown}
    >
      {/* Track */}
      <div
        style={{
          border: "1px solid var(--aegis-color-border-default)",
          borderRadius: "var(--aegis-radius-medium)",
          bottom: OVERFLOW,
          left: 0,
          overflow: "hidden",
          pointerEvents: "none",
          position: "absolute",
          right: 0,
          top: OVERFLOW,
        }}
      >
        <canvas ref={canvasRef} style={{ display: "block", height: "100%", width: "100%" }} />
        {/* Stripe texture over invalid (out-of-gamut) zones */}
        {(() => {
          const zones: Array<[number, number]> = [];
          let cursor = min;
          for (const [start, end] of validRanges) {
            if (cursor < start) zones.push([cursor, start]);
            cursor = end;
          }
          if (cursor < max) zones.push([cursor, max]);
          return zones.map(([lo, hi], i) => (
            <div
              key={i}
              style={{
                background: \`repeating-linear-gradient(-45deg, var(--palette-lab-invalid-zone-texture-color, rgba(0,0,0,0.2)) 0px, var(--palette-lab-invalid-zone-texture-color, rgba(0,0,0,0.2)) 1px, transparent 1px, transparent 4px)\`,
                bottom: 0,
                left: \`\${((lo - min) / (max - min)) * 100}%\`,
                pointerEvents: "none",
                position: "absolute",
                top: 0,
                width: \`\${((hi - lo) / (max - min)) * 100}%\`,
              }}
            />
          ));
        })()}
      </div>
      {/* Thumb — hidden in mixed mode (no single unambiguous value) */}
      {!mixed && (
        <div
          style={{
            alignItems: "center",
            borderRadius: "99px",
            boxShadow: isActive ? "var(--aegis-depth-low)" : undefined,
            cursor: "grab",
            display: "flex",
            flexDirection: "column",
            height: isActive ? "28px" : "16px",
            justifyContent: "center",
            left: thumbLeft,
            outline: \`2px \${isActive ? "var(--aegis-color-foreground-bold)" : "var(--aegis-internal-color-palette-scale-neutral-transparent-500)"} solid\`,
            outlineOffset: "-2px",
            overflow: "hidden",
            padding: "2px",
            pointerEvents: "auto",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            transition:
              "width var(--aegis-motion-duration-x2Fast) var(--aegis-motion-easing-default), height var(--aegis-motion-duration-x2Fast) var(--aegis-motion-easing-default), box-shadow var(--aegis-motion-duration-x2Fast) var(--aegis-motion-easing-default), outline-color var(--aegis-motion-duration-x2Fast) var(--aegis-motion-easing-default), padding var(--aegis-motion-duration-x2Fast) var(--aegis-motion-easing-default)",
            width: isActive ? "28px" : "16px",
            zIndex: 1,
          }}
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={handleThumbPointerUp}
        >
          {/* Inner white fill */}
          <div
            style={{
              alignItems: "center",
              alignSelf: "stretch",
              backgroundColor: "var(--aegis-color-background-default)",
              borderRadius: "99px",
              display: "flex",
              flex: "1 1 0",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Center line indicator */}
            <div
              style={{
                backgroundColor: "var(--aegis-color-foreground-bold)",
                borderRadius: "99px",
                height: isActive ? "12px" : "6px",
                pointerEvents: "none",
                transition: "height var(--aegis-motion-duration-x2Fast) var(--aegis-motion-easing-default)",
                width: "1px",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
`;export{e as default};