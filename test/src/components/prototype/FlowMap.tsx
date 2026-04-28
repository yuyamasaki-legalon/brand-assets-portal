import { type Node, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NodeDetailPanel } from "./NodeDetailPanel";
import { CARD_WIDTH, ScreenNode } from "./ScreenNode";
import type { ScreenNodeData } from "./types";

interface FlowMapNode {
  id: string;
  data: ScreenNodeData;
  /** Optional manual position override. If omitted, auto-layout horizontally. */
  position?: { x: number; y: number };
}

interface FlowMapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface FlowMapProps {
  /** Node definitions for the flow map */
  nodes: FlowMapNode[];
  /** Edge definitions for the flow map */
  edges: FlowMapEdge[];
  /** Called when a node with a path is clicked */
  onNodeClick?: (path: string) => void;
}

const nodeTypes = { screen: ScreenNode };

/** Horizontal gap between screen cards */
const H_GAP = 80;
/** Vertical padding from top */
const V_PAD = 20;

/** Auto-layout nodes horizontally if no position is specified */
function autoLayout(nodes: FlowMapNode[]): (FlowMapNode & { position: { x: number; y: number } })[] {
  return nodes.map((node, i) => ({
    ...node,
    position: node.position ?? { x: i * (CARD_WIDTH + H_GAP), y: V_PAD },
  }));
}

/** Default edge style: dashed, gray */
const defaultEdgeStyle = {
  stroke: "var(--aegis-color-border-neutral)",
  strokeWidth: 2,
  strokeDasharray: "8 6",
};

export function FlowMap({ nodes: initialNodes, edges: initialEdges, onNodeClick }: FlowMapProps) {
  const [selectedNode, setSelectedNode] = useState<ScreenNodeData | null>(null);

  const laid = useMemo(() => autoLayout(initialNodes), [initialNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(laid.map((n) => ({ ...n, type: "screen" as const })));
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map((e) => ({
      ...e,
      style: defaultEdgeStyle,
      type: "smoothstep" as const,
    })),
  );

  useEffect(() => {
    const newLaid = autoLayout(initialNodes);
    setNodes(newLaid.map((n) => ({ ...n, type: "screen" as const })));
    setEdges(
      initialEdges.map((e) => ({
        ...e,
        style: defaultEdgeStyle,
        type: "smoothstep" as const,
      })),
    );
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const data = node.data as unknown as ScreenNodeData;
      setSelectedNode(data);
      const path = data.path as string | undefined;
      if (path && onNodeClick) {
        onNodeClick(path);
      }
    },
    [onNodeClick],
  );

  const fitViewOptions = useMemo(() => ({ padding: 0.08 }), []);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      {/* Map area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={fitViewOptions}
          proOptions={{ hideAttribution: true }}
          panOnScroll
          zoomOnDoubleClick={false}
          minZoom={0.2}
          maxZoom={1.5}
          defaultEdgeOptions={{
            type: "smoothstep",
            style: defaultEdgeStyle,
          }}
        />
      </div>

      {/* Detail panel */}
      {selectedNode && (
        <div
          style={{
            width: 480,
            minWidth: 360,
            borderLeft: "1px solid var(--aegis-color-border-default)",
            overflow: "hidden",
          }}
        >
          <NodeDetailPanel data={selectedNode} onClose={() => setSelectedNode(null)} />
        </div>
      )}
    </div>
  );
}

export type { FlowMapEdge, FlowMapNode };
