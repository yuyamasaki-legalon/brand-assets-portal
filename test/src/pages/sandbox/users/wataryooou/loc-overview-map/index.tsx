import { LfArrowRight } from "@legalforce/aegis-icons";
import { Button, Icon, Text } from "@legalforce/aegis-react";
import {
  Background,
  BackgroundVariant,
  MiniMap,
  type Node,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NodeDetailPanel } from "../../../../../components/prototype/NodeDetailPanel";
import { ScreenNode } from "../../../../../components/prototype/ScreenNode";
import type { ScreenNodeData } from "../../../../../components/prototype/types";
import { AnimatedEdge } from "./AnimatedEdge";
import { GroupNode } from "./GroupNode";
import { initialEdges, initialNodes, nodeDetailMap } from "./map-data";
import { useWalkthrough } from "./useWalkthrough";
import { WalkthroughControls } from "./WalkthroughControls";
import { walkthroughScenarios } from "./walkthrough-data";

const nodeTypes = {
  screen: ScreenNode,
  group: GroupNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

const MAP_PATH = "/sandbox/wataryooou/loc-overview-map";

function LocOverviewMapInner() {
  const navigate = useNavigate();
  const reactFlow = useReactFlow();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<ScreenNodeData | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const walkthrough = useWalkthrough({ scenarios: walkthroughScenarios });

  // Auto-pan to current walkthrough step node
  useEffect(() => {
    if (!walkthrough.isActive || !walkthrough.currentStep) return;
    const node = nodes.find((n) => n.id === walkthrough.currentStep?.nodeId);
    if (node) {
      reactFlow.fitView({
        nodes: [node],
        duration: 800,
        padding: 0.5,
      });
    }
  }, [walkthrough.isActive, walkthrough.currentStep, nodes, reactFlow]);

  // Apply walkthrough visual state to nodes
  const nodesWithWalkthrough = useMemo(() => {
    if (!walkthrough.isActive || !walkthrough.currentStep) return nodes;
    return nodes.map((node) => {
      if (node.type === "group") return node;
      const isCurrent = node.id === walkthrough.currentStep?.nodeId;
      return {
        ...node,
        data: {
          ...node.data,
          isFocus: isCurrent,
        },
        style: {
          ...node.style,
          opacity: isCurrent ? 1 : 0.35,
          transition: "opacity 0.3s ease",
        },
      };
    });
  }, [nodes, walkthrough.isActive, walkthrough.currentStep]);

  // Update edge state based on hover + walkthrough
  const edgesWithState = useMemo(() => {
    if (walkthrough.isActive && walkthrough.currentStep) {
      return edges.map((edge) => {
        const isTraversingEdge = edge.id === walkthrough.currentStep?.edgeId;
        return {
          ...edge,
          data: {
            ...edge.data,
            isHighlighted: false,
            isDimmed: !isTraversingEdge,
            isTraversing: isTraversingEdge,
          },
        };
      });
    }

    if (!hoveredNodeId) return edges;
    return edges.map((edge) => {
      const isConnected = edge.source === hoveredNodeId || edge.target === hoveredNodeId;
      return {
        ...edge,
        data: {
          ...edge.data,
          isHighlighted: isConnected,
          isDimmed: !isConnected,
        },
      };
    });
  }, [edges, hoveredNodeId, walkthrough.isActive, walkthrough.currentStep]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === "group") return;
    const detailData = nodeDetailMap[node.id];
    if (detailData) {
      setSelectedNode(detailData);
    }
  }, []);

  const handleNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === "group") return;
    setHoveredNodeId(node.id);
  }, []);

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(`${path}?from=${MAP_PATH}`);
    },
    [navigate],
  );

  const handleNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === "group") return;
      const detail = nodeDetailMap[node.id];
      if (detail?.path) {
        handleNavigate(detail.path as string);
      }
    },
    [handleNavigate],
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const fitViewOptions = useMemo(() => ({ padding: 0.08 }), []);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
      {/* Hide ReactFlow handles (connection dots) - ScreenNode is shared, so override via CSS */}
      <style>
        {`
          .react-flow__handle { opacity: 0 !important; }
          .react-flow__node-group { background: none !important; border: none !important; padding: 0 !important; }
        `}
      </style>
      {/* Map area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <ReactFlow
          nodes={nodesWithWalkthrough}
          edges={edgesWithState}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          onNodeMouseEnter={handleNodeMouseEnter}
          onNodeMouseLeave={handleNodeMouseLeave}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={fitViewOptions}
          proOptions={{ hideAttribution: true }}
          panOnScroll
          zoomOnDoubleClick={false}
          minZoom={0.1}
          maxZoom={1.5}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--aegis-color-border-neutral)" />
          <MiniMap
            pannable
            zoomable
            style={{
              backgroundColor: "var(--aegis-color-background-default)",
              border: "1px solid var(--aegis-color-border-default)",
              borderRadius: "var(--aegis-radius-large)",
            }}
            maskColor="rgba(0, 0, 0, 0.08)"
          />
          <Panel position="top-left">
            <div
              style={{
                padding: "var(--aegis-space-small) var(--aegis-space-medium)",
                backgroundColor: "var(--aegis-color-background-default)",
                borderRadius: "var(--aegis-radius-large)",
                border: "1px solid var(--aegis-color-border-default)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <div>
                <Text variant="title.small">LOC Overview Map</Text>
                <Text variant="body.xSmall" color="subtle" style={{ display: "block", marginTop: 2 }}>
                  LegalOn 画面遷移フロー
                </Text>
              </div>
              {!walkthrough.isActive && (
                <Button variant="subtle" size="small" onClick={() => walkthrough.start(0)}>
                  <Icon size="xSmall">
                    <LfArrowRight />
                  </Icon>
                  ウォークスルー
                </Button>
              )}
            </div>
          </Panel>
          {walkthrough.isActive && (
            <WalkthroughControls
              scenarios={walkthroughScenarios}
              scenarioIndex={walkthrough.scenarioIndex}
              stepIndex={walkthrough.stepIndex}
              totalSteps={walkthrough.totalSteps}
              isPlaying={walkthrough.isPlaying}
              currentStep={walkthrough.currentStep}
              onScenarioChange={walkthrough.setScenarioIndex}
              onPlay={walkthrough.play}
              onPause={walkthrough.pause}
              onNext={walkthrough.next}
              onPrev={walkthrough.prev}
              onStop={walkthrough.stop}
            />
          )}
        </ReactFlow>
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
          <NodeDetailPanel data={selectedNode} onClose={() => setSelectedNode(null)} onNavigate={handleNavigate} />
        </div>
      )}
    </div>
  );
}

// Wrap with ReactFlowProvider to enable useReactFlow hook
import { ReactFlowProvider } from "@xyflow/react";

export function LocOverviewMap() {
  return (
    <ReactFlowProvider>
      <LocOverviewMapInner />
    </ReactFlowProvider>
  );
}
