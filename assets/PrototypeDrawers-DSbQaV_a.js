var e=`import { Button, Drawer, Text } from "@legalforce/aegis-react";
import { lazy, Suspense } from "react";
import { MarkdownRenderer } from "../../pages/markdown-viewer/components/MarkdownRenderer";
import type { usePrototypeTools } from "../prototype";
import styles from "./floatingSourceCodeViewer.module.css";

const FlowMap = lazy(() => import("../prototype/FlowMap").then((m) => ({ default: m.FlowMap })));

export type ProtoDrawerKind = "map" | "spec" | "qa";
type ProtoTools = ReturnType<typeof usePrototypeTools>;

interface PrototypeDrawersProps {
  protoTools: ProtoTools;
  protoDrawer: ProtoDrawerKind | null;
  onClose: () => void;
}

export const PrototypeDrawers = ({ protoTools, protoDrawer, onClose }: PrototypeDrawersProps) => {
  if (!protoTools) return null;

  return (
    <>
      {protoTools.mapData && protoTools.mapData.nodes.length > 0 && (
        <Drawer
          open={protoDrawer === "map"}
          onOpenChange={(open) => !open && onClose()}
          position="end"
          resizable
          width="xLarge"
          minWidth="medium"
          maxWidth="xLarge"
          closeOnOutsidePress={false}
          modal={false}
        >
          <Drawer.Header>
            <Text variant="label.medium.bold">Screen Flow Map</Text>
          </Drawer.Header>
          <Drawer.Body>
            <div className={styles.mapBody}>
              <Suspense
                fallback={
                  <div className={styles.mapFallback}>
                    <Text variant="body.small" color="subtle">
                      Loading map...
                    </Text>
                  </div>
                }
              >
                <FlowMap
                  nodes={protoTools.mapData.nodes}
                  edges={protoTools.mapData.edges ?? []}
                  onNodeClick={protoTools.onMapNodeClick}
                />
              </Suspense>
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="subtle" onClick={onClose}>
              閉じる
            </Button>
          </Drawer.Footer>
        </Drawer>
      )}

      {protoTools.specContent && (
        <Drawer
          open={protoDrawer === "spec"}
          onOpenChange={(open) => !open && onClose()}
          position="end"
          resizable
          width="xLarge"
          minWidth="small"
          maxWidth="xLarge"
          closeOnOutsidePress={false}
          modal={false}
        >
          <Drawer.Header>
            <Text variant="label.medium.bold">Spec</Text>
          </Drawer.Header>
          <Drawer.Body>
            <div className={styles.drawerBody}>
              <MarkdownRenderer content={protoTools.specContent} />
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="subtle" onClick={onClose}>
              閉じる
            </Button>
          </Drawer.Footer>
        </Drawer>
      )}

      {protoTools.qaContent && (
        <Drawer
          open={protoDrawer === "qa"}
          onOpenChange={(open) => !open && onClose()}
          position="end"
          resizable
          width="xLarge"
          minWidth="small"
          maxWidth="xLarge"
          closeOnOutsidePress={false}
          modal={false}
        >
          <Drawer.Header>
            <Text variant="label.medium.bold">QA Checklist</Text>
          </Drawer.Header>
          <Drawer.Body>
            <div className={styles.drawerBody}>
              <MarkdownRenderer content={protoTools.qaContent} />
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="subtle" onClick={onClose}>
              閉じる
            </Button>
          </Drawer.Footer>
        </Drawer>
      )}
    </>
  );
};
`;export{e as default};