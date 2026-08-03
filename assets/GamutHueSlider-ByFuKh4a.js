var e=`import { useEffect, useMemo, useRef } from "react";

import { isInSrgbGamut, oklchToHex } from "../../color/oklch";

const TRACK_H = 20;
const THUMB_D = 24;
const OVERFLOW = (THUMB_D - TRACK_H) / 2;
const INVALID_COLOR = "#d4d4d4";

type ValidRange = readonly [number, number];

const computeValidRanges = (lightness: number, chroma: number): ValidRange[] => {
  const ranges: ValidRange[] = [];
  let start: number | null = null;
  for (let h = 0; h < 360; h++) {
    const valid = isInSrgbGamut(lightness, chroma, h);
    if (valid && start === null) start = h;
    else if (!valid && start !== null) {
      ranges.push([start, h - 1] as const);
      start = null;
    }
  }
  if (start !== null) ranges.push([start, 359] as const);
  return ranges;
};

const snapToValid = (
  rawHue: number,
  prevHue: number,
  lightness: number,
  chroma: number,
  ranges: ValidRange[],
): number => {
  if (ranges.length === 0) return rawHue;
  if (isInSrgbGamut(lightness, chroma, rawHue)) return rawHue;
  const direction = rawHue - prevHue;
  if (direction >= 0) {
    for (const [start] of ranges) {
      if (start > rawHue) return start;
    }
    return ranges[0][0];
  }
  for (let i = ranges.length - 1; i >= 0; i--) {
    if (ranges[i][1] < rawHue) return ranges[i][1];
  }
  return ranges[ranges.length - 1][1];
};

type Props = {
  lightness: number;
  chroma: number;
  value: number;
  onChange: (hue: number) => void;
};

export const GamutHueSlider = ({ lightness, chroma, value, onChange }: Props) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggingRef = useRef(false);
  const prevHueRef = useRef(value);

  const validRanges = useMemo(() => computeValidRanges(lightness, chroma), [lightness, chroma]);

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
        const h = (x / W) * 360;
        ctx.fillStyle = isInSrgbGamut(lightness, chroma, h) ? oklchToHex(lightness, chroma, h) : INVALID_COLOR;
        ctx.fillRect(x, 0, 1, TRACK_H);
      }
    };

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    draw();
    return () => observer.disconnect();
  }, [lightness, chroma]);

  const resolveHue = (clientX: number): number => {
    const outer = outerRef.current;
    if (!outer) return value;
    const rect = outer.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return snapToValid(ratio * 360, prevHueRef.current, lightness, chroma, validRanges);
  };

  return (
    <div
      ref={outerRef}
      aria-label="Hue"
      aria-valuemax={360}
      aria-valuemin={0}
      aria-valuenow={Math.round(value)}
      role="slider"
      style={{ cursor: "pointer", height: THUMB_D, position: "relative", userSelect: "none" }}
      tabIndex={0}
      onPointerDown={(e) => {
        draggingRef.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        prevHueRef.current = value;
        const h = resolveHue(e.clientX);
        prevHueRef.current = h;
        onChange(h);
      }}
      onPointerLeave={() => {
        draggingRef.current = false;
      }}
      onPointerMove={(e) => {
        if (!draggingRef.current) return;
        const h = resolveHue(e.clientX);
        prevHueRef.current = h;
        onChange(h);
      }}
      onPointerUp={() => {
        draggingRef.current = false;
      }}
    >
      {/* Colored track */}
      <div
        style={{
          borderRadius: "var(--aegis-radius-full)",
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
      </div>
      {/* Thumb */}
      <div
        style={{
          backgroundColor: oklchToHex(lightness, chroma, value),
          border: "2px solid var(--aegis-color-background-default)",
          borderRadius: "50%",
          boxShadow: "var(--aegis-depth-low)",
          height: THUMB_D,
          left: \`\${(value / 360) * 100}%\`,
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          transform: "translateX(-50%)",
          width: THUMB_D,
        }}
      />
    </div>
  );
};
`;export{e as default};