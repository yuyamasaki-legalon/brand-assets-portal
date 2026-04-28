import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getSmoothStepPath } from "@xyflow/react";

const animationStyle = `
@keyframes dashFlow {
  to {
    stroke-dashoffset: -20;
  }
}
`;

interface AnimatedEdgeData {
  [key: string]: unknown;
  label?: string;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  isTraversing?: boolean;
}

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
}: EdgeProps) {
  const edgeData = (data ?? {}) as AnimatedEdgeData;
  const isHighlighted = edgeData.isHighlighted ?? false;
  const isDimmed = edgeData.isDimmed ?? false;
  const isTraversing = edgeData.isTraversing ?? false;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
  });

  const strokeColor =
    isHighlighted || isTraversing
      ? "var(--aegis-color-border-information)"
      : isDimmed
        ? "var(--aegis-color-border-neutral)"
        : "var(--aegis-color-border-neutral)";

  const strokeWidth = isHighlighted || isTraversing ? 3 : 1.5;
  const strokeOpacity = isDimmed ? 0.25 : 1;

  return (
    <>
      <style>{animationStyle}</style>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth,
          opacity: strokeOpacity,
          strokeDasharray: isHighlighted || isTraversing ? "8 4" : "none",
          animation: isHighlighted || isTraversing ? "dashFlow 0.6s linear infinite" : "none",
          transition: "stroke 0.2s, stroke-width 0.2s, opacity 0.2s",
        }}
        markerEnd={`url(#marker-${id})`}
      />
      <svg role="img" aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <marker
            id={`marker-${id}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeColor} opacity={strokeOpacity} />
          </marker>
        </defs>
      </svg>
      {isTraversing && (
        <circle r="6" fill="var(--aegis-color-background-information)" opacity="0.9">
          <animateMotion dur="1s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
      {edgeData.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "none",
              fontSize: 11,
              fontWeight: 500,
              color: isHighlighted ? "var(--aegis-color-text-information)" : "var(--aegis-color-text-subtle)",
              backgroundColor: "var(--aegis-color-background-default)",
              padding: "2px 6px",
              borderRadius: "var(--aegis-radius-medium)",
              opacity: isDimmed ? 0.3 : 1,
              transition: "opacity 0.2s, color 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
