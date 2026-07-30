var e=`import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";

export type CurvePoint = {
  toneValue: number;
  channelValue: number;
  color?: string;
  gamutMax?: number;
  gamutMin?: number;
  gamutInvalidRanges?: Array<[number, number]>; // [lo, hi] pairs covering all invalid hue zones
};

type Channel = "lightness" | "chroma" | "hue";

const CHANNEL_RANGE: Record<Channel, [number, number]> = {
  lightness: [0, 100],
  chroma: [0, 0.4],
  hue: [0, 360],
};

const formatTick = (value: number, channel: Channel): string => {
  if (channel === "lightness") return value.toFixed(1);
  if (channel === "chroma") return value.toFixed(3);
  return value.toFixed(0);
};

const POINT_SIZE = 16;
const POINT_SIZE_ACTIVE = 20;
const CHART_PAD = POINT_SIZE_ACTIVE / 2; // vertical padding so edge knobs are never clipped
const DEFAULT_HEIGHT = 320;
const DRAG_THRESHOLD = 4;
const KEY_STEP: Record<Channel, number> = {
  lightness: 0.1,
  chroma: 0.001,
  hue: 1,
};

// Clamp \`value\` to the valid gamut range for a given point.
// Respects gamutMax/gamutMin (chroma simple bounds) and gamutInvalidRanges (hue forbidden zones).
// Falls back to the global [yMin, yMax] channel range when per-tone limits are absent.
const clampToGamut = (value: number, point: CurvePoint, yMin: number, yMax: number): number => {
  let v = Math.min(yMax, Math.max(yMin, value));
  if (point.gamutMax !== undefined) v = Math.min(point.gamutMax, v);
  if (point.gamutMin !== undefined) v = Math.max(point.gamutMin, v);
  if (point.gamutInvalidRanges) {
    for (const [lo, hi] of point.gamutInvalidRanges) {
      if (v > lo && v < hi) {
        v = v - lo < hi - v ? lo : hi;
      }
    }
  }
  return v;
};

const STRIPE = "var(--palette-lab-invalid-zone-texture-color, rgba(0,0,0,0.2))";
const INVALID_ZONE_TEXTURE: CSSProperties = {
  background: \`repeating-linear-gradient(-45deg, \${STRIPE} 0px, \${STRIPE} 1px, transparent 1px, transparent 4px)\`,
  bottom: 0,
  left: 0,
  pointerEvents: "none",
  position: "absolute",
  right: 0,
  top: 0,
};

type ToneCurveProps = {
  channel: Channel;
  points: CurvePoint[];
  onPointDrag: (toneValue: number, newChannelValue: number) => void;
  onDragStart?: () => void;
  onPointSelect?: (toneValue: number) => void;
  columnHeader?: string;
  height?: number;
  gamutZones?: ReadonlyArray<readonly [number, number]>;
  highlightToneValue?: number | null;
};

export const ToneCurve = ({
  channel,
  points,
  onPointDrag,
  onDragStart,
  onPointSelect,
  columnHeader,
  height = DEFAULT_HEIGHT,
  gamutZones,
  highlightToneValue = null,
}: ToneCurveProps) => {
  const draggingRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeToneValue, setActiveToneValue] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const pointerDownToneRef = useRef<number | null>(null);
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    if (el.clientWidth) setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (activeToneValue === null) return;
    const handleOutside = (e: Event) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveToneValue(null);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [activeToneValue]);

  const sorted = [...points].sort((a, b) => a.toneValue - b.toneValue);

  // Exact column center x in pixels, accounting for 1px border-right between columns.
  const colContentWidth = sorted.length > 0 ? (containerWidth - (sorted.length - 1)) / sorted.length : 0;
  const colCenterX = (i: number) => i * (colContentWidth + 1) + colContentWidth / 2;

  const [yMin, yMax] = CHANNEL_RANGE[channel];
  const yRange = yMax - yMin;

  // toColY: y within the chart area (used inside the background div, top=0)
  const toColY = (value: number) => height * (1 - (value - yMin) / yRange);
  // toKnobY: y within containerRef (chart area is offset by CHART_PAD from top)
  const toKnobY = (value: number) => CHART_PAD + toColY(value);
  // fromColY: convert containerRef-relative y back to channel value
  const fromColY = (px: number) => yMax - ((px - CHART_PAD) / height) * yRange;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (activeToneValue === null) return;
    if (e.key === "Escape" || e.key === "Enter") {
      e.preventDefault();
      setActiveToneValue(null);
      containerRef.current?.blur();
      return;
    }
    const step = KEY_STEP[channel];
    const currentPoint = sorted.find((p) => p.toneValue === activeToneValue);
    if (!currentPoint) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      onPointDrag(activeToneValue, clampToGamut(currentPoint.channelValue + step, currentPoint, yMin, yMax));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onPointDrag(activeToneValue, clampToGamut(currentPoint.channelValue - step, currentPoint, yMin, yMax));
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>, toneValue: number) => {
    pointerDownToneRef.current = toneValue;
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    setActiveToneValue(toneValue);
    onPointSelect?.(toneValue);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (pointerDownToneRef.current === null || !containerRef.current) return;
    if (draggingRef.current === null) {
      if (!pointerDownPosRef.current) return;
      const { x, y } = pointerDownPosRef.current;
      if (Math.hypot(e.clientX - x, e.clientY - y) < DRAG_THRESHOLD) return;
      draggingRef.current = pointerDownToneRef.current;
      if (!dragStartedRef.current) {
        dragStartedRef.current = true;
        onDragStart?.();
      }
    }
    const rect = containerRef.current.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const point = sorted.find((p) => p.toneValue === draggingRef.current);
    const clamped = point
      ? clampToGamut(fromColY(relY), point, yMin, yMax)
      : Math.min(yMax, Math.max(yMin, fromColY(relY)));
    onPointDrag(draggingRef.current, clamped);
  };

  const handlePointerUp = () => {
    if (draggingRef.current !== null) {
      draggingRef.current = null;
      setActiveToneValue(null);
    } else {
      containerRef.current?.focus();
    }
    pointerDownToneRef.current = null;
    pointerDownPosRef.current = null;
    dragStartedRef.current = false;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0, width: "100%" }}>
      {/* Value labels: one equally-spaced cell per point */}
      {sorted.length > 0 && (
        <div style={{ display: "flex" }}>
          {sorted.map((p) => (
            <div
              key={p.toneValue}
              style={{
                color: "var(--aegis-color-foreground-subtle)",
                flex: "1 1 0",
                fontSize: "10px",
                lineHeight: 1,
                overflow: "hidden",
                textAlign: "center",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {formatTick(p.channelValue, channel)}
            </div>
          ))}
        </div>
      )}
      {/* Column grid chart: CHART_PAD top/bottom so edge knobs never overflow the container */}
      {/* biome-ignore lint/a11y/useSemanticElements: custom drag-and-drop chart has no semantic HTML equivalent */}
      <div
        aria-label={columnHeader ?? "Color curve"}
        ref={containerRef}
        role="grid"
        style={{
          height: \`\${height + CHART_PAD * 2}px\`,
          overflow: "hidden",
          position: "relative",
          touchAction: "none",
          userSelect: "none",
          width: "100%",
        }}
        tabIndex={0}
        onBlur={() => setActiveToneValue(null)}
        onKeyDown={handleKeyDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Background layer: inset by CHART_PAD top/bottom — visual chart area */}
        <div
          style={{
            backgroundColor: "var(--aegis-color-background-default)",
            border: "1px solid var(--aegis-color-border-default)",
            borderRadius: "var(--aegis-radius-large)",
            bottom: CHART_PAD,
            display: "flex",
            left: 0,
            overflow: "hidden",
            pointerEvents: "none",
            position: "absolute",
            right: 0,
            top: CHART_PAD,
          }}
        >
          {/* Hue gamut zones: horizontal invalid bands spanning all columns */}
          {gamutZones?.map(([lo, hi]) => {
            const topPx = toColY(hi);
            const zonePx = toColY(lo) - topPx;
            return (
              <div
                key={\`\${lo}-\${hi}\`}
                style={{
                  height: \`\${zonePx}px\`,
                  left: 0,
                  overflow: "hidden",
                  position: "absolute",
                  right: 0,
                  top: \`\${topPx}px\`,
                }}
              >
                <div
                  style={{
                    ...INVALID_ZONE_TEXTURE,
                    opacity: "var(--palette-lab-invalid-zone-texture-opacity, 0.08)" as unknown as number,
                  }}
                />
              </div>
            );
          })}

          {/* Connecting lines: gradient between adjacent control points */}
          {sorted.length > 1 &&
            containerWidth > 0 &&
            sorted.slice(0, -1).map((p, i) => {
              const next = sorted[i + 1];
              const x1 = colCenterX(i);
              const x2 = colCenterX(i + 1);
              const y1 = toColY(p.channelValue);
              const y2 = toColY(next.channelValue);
              const dx = x2 - x1;
              const dy = y2 - y1;
              const length = Math.hypot(dx, dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              const LINE_H = 4;
              return (
                <div
                  key={\`line-\${p.toneValue}-\${next.toneValue}\`}
                  style={{
                    background: \`linear-gradient(to right, \${p.color ?? "#888888"}, \${next.color ?? "#888888"})\`,
                    borderRadius: \`\${LINE_H / 2}px\`,
                    height: \`\${LINE_H}px\`,
                    left: \`\${(x1 + x2) / 2 - length / 2}px\`,
                    pointerEvents: "none",
                    position: "absolute",
                    top: \`\${(y1 + y2) / 2 - LINE_H / 2}px\`,
                    transform: \`rotate(\${angle}deg)\`,
                    transformOrigin: "center center",
                    width: \`\${length}px\`,
                    zIndex: 0,
                  }}
                />
              );
            })}

          {/* Per-tone columns: dividers + invalid zone textures only */}
          {sorted.map((p, index) => {
            const topInvalidPx = p.gamutMax !== undefined ? Math.max(0, toColY(p.gamutMax)) : 0;
            const bottomInvalidPx = p.gamutMin !== undefined ? Math.max(0, height - toColY(p.gamutMin)) : 0;
            const isLast = index === sorted.length - 1;

            return (
              <div
                key={p.toneValue}
                style={{
                  alignSelf: "stretch",
                  borderRight: isLast ? undefined : "1px solid var(--aegis-color-border-default)",
                  flex: "1 1 0",
                  position: "relative",
                }}
              >
                {/* Top invalid zone (above gamutMax) */}
                {topInvalidPx > 0 && (
                  <div
                    style={{
                      borderBottom: "1px solid var(--aegis-internal-color-palette-scale-neutral-transparent-300)",
                      height: \`\${topInvalidPx}px\`,
                      left: 0,
                      overflow: "hidden",
                      position: "absolute",
                      right: 0,
                      top: 0,
                    }}
                  >
                    <div
                      style={{
                        ...INVALID_ZONE_TEXTURE,
                      }}
                    />
                  </div>
                )}
                {/* Bottom invalid zone (below gamutMin) */}
                {bottomInvalidPx > 0 && (
                  <div
                    style={{
                      borderTop: "1px solid var(--aegis-internal-color-palette-scale-neutral-transparent-300)",
                      bottom: 0,
                      height: \`\${bottomInvalidPx}px\`,
                      left: 0,
                      overflow: "hidden",
                      position: "absolute",
                      right: 0,
                    }}
                  >
                    <div
                      style={{
                        ...INVALID_ZONE_TEXTURE,
                      }}
                    />
                  </div>
                )}
                {/* Multiple invalid hue ranges */}
                {p.gamutInvalidRanges?.map(([lo, hi]) => {
                  const topPx = toColY(hi);
                  const zonePx = Math.max(0, toColY(lo) - topPx);
                  return zonePx > 0 ? (
                    <div
                      key={\`\${lo}-\${hi}\`}
                      style={{
                        height: \`\${zonePx}px\`,
                        left: 0,
                        overflow: "hidden",
                        position: "absolute",
                        right: 0,
                        top: \`\${topPx}px\`,
                      }}
                    >
                      <div
                        style={{
                          ...INVALID_ZONE_TEXTURE,
                          opacity: "var(--palette-lab-invalid-zone-texture-opacity, 0.08)" as unknown as number,
                        }}
                      />
                    </div>
                  ) : null;
                })}
              </div>
            );
          })}
        </div>

        {/* Knob layer: positioned in outer container so they can overflow chart edges */}
        {containerWidth > 0 &&
          sorted.map((p, index) => {
            const isActive = activeToneValue === p.toneValue;
            const isHighlighted = !isActive && highlightToneValue === p.toneValue;
            const color = p.color ?? "var(--aegis-color-foreground-default)";
            const size = isActive ? POINT_SIZE_ACTIVE : POINT_SIZE;
            return (
              <div
                key={\`knob-\${p.toneValue}\`}
                style={{
                  backgroundColor: color,
                  border: isActive
                    ? "2px solid var(--aegis-color-foreground-bold)"
                    : \`2px solid var(--aegis-internal-color-palette-scale-neutral-transparent-500)\`,
                  borderRadius: "50%",
                  boxShadow: isActive
                    ? \`0 0 0 2px var(--aegis-color-background-default), 0 0 0 4px var(--aegis-color-foreground-bold)\`
                    : isHighlighted
                      ? \`0 0 0 2px var(--aegis-color-background-default), 0 0 0 4px var(--aegis-color-foreground-subtle)\`
                      : "0 0 0 0 transparent, 0 0 0 0 transparent",
                  boxSizing: "border-box",
                  cursor: "grab",
                  height: \`\${size}px\`,
                  left: \`\${colCenterX(index)}px\`,
                  position: "absolute",
                  top: \`\${toKnobY(p.channelValue)}px\`,
                  transform: "translate(-50%, -50%)",
                  transition:
                    "width var(--aegis-motion-duration-x2Fast) var(--aegis-motion-easing-default), height var(--aegis-motion-duration-x2Fast) var(--aegis-motion-easing-default), border-color var(--aegis-motion-duration-x2Fast) var(--aegis-motion-easing-default), box-shadow var(--aegis-motion-duration-x2Fast) var(--aegis-motion-easing-default)",
                  width: \`\${size}px\`,
                  zIndex: 1,
                }}
                onPointerDown={(e) => handlePointerDown(e, p.toneValue)}
              />
            );
          })}
      </div>
    </div>
  );
};
`;export{e as default};