import { LfArrowLeft } from "@legalforce/aegis-icons";
import {
  Button,
  ContentHeader,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
} from "@legalforce/aegis-react";
import { type ReactNode, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { FlowMapEdge, FlowMapNode } from "./FlowMap";
import { PatternSwitcher } from "./PatternSwitcher";
import { useRegisterPrototypeTools } from "./PrototypeContext";
import type { PatternConfig } from "./types";

interface PrototypeShellProps {
  /** Page title */
  title: string;
  /** Optional description */
  description?: string;
  /** Back link path */
  backTo?: string;
  /** The main prototype content */
  children: ReactNode;
  /** Pattern variants for the PatternSwitcher */
  patterns?: PatternConfig[];
  /** Map data for the FlowMap */
  mapData?: {
    nodes: FlowMapNode[];
    edges: FlowMapEdge[];
  };
  /** Called when a map node is clicked */
  onMapNodeClick?: (path: string) => void;
  /** Spec markdown content */
  specContent?: string;
  /** QA checklist markdown content */
  qaContent?: string;
}

/**
 * PrototypeShell wraps a sandbox prototype page with:
 * - Pattern switching (tab-based variant comparison)
 * - Registers Map/Spec/QA data for access via the FloatingSourceCodeViewer (bottom-right button)
 */
export function PrototypeShell({
  title,
  description,
  backTo,
  children,
  patterns,
  mapData,
  onMapNodeClick,
  specContent,
  qaContent,
}: PrototypeShellProps) {
  const [searchParams] = useSearchParams();
  const fromPath = searchParams.get("from");
  const hasPatterns = patterns && patterns.length > 1;

  // Register tools data so FloatingSourceCodeViewer can access it
  const toolsData = useMemo(
    () => ({ mapData, specContent, qaContent, onMapNodeClick }),
    [mapData, specContent, qaContent, onMapNodeClick],
  );
  useRegisterPrototypeTools(toolsData);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>{title}</ContentHeader.Title>
            {(backTo || description || fromPath) && (
              <ContentHeader.Description>
                {description}
                {fromPath && (
                  <>
                    {description && " "}
                    <Button as={Link} to={fromPath} variant="subtle" size="small">
                      <Icon size="xSmall">
                        <LfArrowLeft />
                      </Icon>
                      マップに戻る
                    </Button>
                  </>
                )}
                {backTo && (
                  <>
                    {(description || fromPath) && " "}
                    <Button as={Link} to={backTo} variant="subtle" size="small">
                      <Icon size="xSmall">
                        <LfArrowLeft />
                      </Icon>
                      Back
                    </Button>
                  </>
                )}
              </ContentHeader.Description>
            )}
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>{hasPatterns ? <PatternSwitcher patterns={patterns} /> : children}</PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
