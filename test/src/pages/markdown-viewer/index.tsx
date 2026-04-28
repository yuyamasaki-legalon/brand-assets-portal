import { LfList } from "@legalforce/aegis-icons";
import { Book } from "@legalforce/aegis-illustrations/react";
import {
  Breadcrumb,
  ContentHeader,
  EmptyState,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  Search,
  SideNavigation,
  Skeleton,
  Tag,
} from "@legalforce/aegis-react";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { FileList } from "./components/FileList";
import { MarkdownRenderer } from "./components/MarkdownRenderer";
import { TableOfContents } from "./components/TableOfContents";
import { useMarkdownFiles } from "./hooks/useMarkdownFiles";
import { useTableOfContents } from "./hooks/useTableOfContents";
import styles from "./index.module.css";
import { extractMarkdownHeadings } from "./utils/markdownHeadings";

function ErrorFallback({ onError }: { onError: () => void }) {
  useEffect(() => onError(), [onError]);
  return (
    <EmptyState visual={<Book />} title="Rendering failed">
      This markdown file could not be rendered. Try selecting a different file.
    </EmptyState>
  );
}

export const MarkdownViewer = () => {
  const {
    files,
    selectedPath,
    content,
    isLoading,
    searchQuery,
    categoryFilter,
    loadFile,
    setSearchQuery,
    setCategoryFilter,
  } = useMarkdownFiles();

  const headings = useMemo(() => extractMarkdownHeadings(content), [content]);
  const { activeId, scrollToHeading } = useTableOfContents(headings);
  const [tocOpen, setTocOpen] = useState(false);
  const [renderError, setRenderError] = useState(false);

  // Reset error state when a different file is selected (boundary remounts via key)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-run when selectedPath changes
  useEffect(() => setRenderError(false), [selectedPath]);

  const tocEffectiveOpen = tocOpen && !renderError;

  // Breadcrumb: remove base path, prepend category
  const breadcrumbItems = useMemo(() => {
    if (!selectedPath) return [];
    const isDocsCategory = selectedPath.startsWith("/docs/");
    const basePath = isDocsCategory ? "/docs/" : "/src/pages/sandbox/";
    const categoryLabel = isDocsCategory ? "Docs" : "Sandbox";
    const relative = selectedPath.replace(basePath, "").replace(/\.md$/, "");
    return [categoryLabel, ...relative.split("/").filter(Boolean)];
  }, [selectedPath]);

  const documentTitle = breadcrumbItems.length > 0 ? breadcrumbItems[breadcrumbItems.length - 1] : "Document";

  return (
    <PageLayout variant="outline" scrollBehavior="inside">
      {/* Left Pane – file browser */}
      <PageLayoutPane position="start" open width="medium">
        <PageLayoutHeader>
          <div className={styles.headerContent}>
            <ContentHeader size="small">
              <ContentHeader.Title>Markdown Viewer</ContentHeader.Title>
              <ContentHeader.Description>{files.length} files</ContentHeader.Description>
            </ContentHeader>
            <div style={{ padding: "0 var(--aegis-space-medium)" }}>
              <Search
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                clearable
                placeholder="Search files..."
                size="small"
              />
            </div>
            <div className={styles.categoryFilters}>
              <Tag
                variant={categoryFilter === "all" ? "fill" : "outline"}
                color="neutral"
                onClick={() => setCategoryFilter("all")}
              >
                All
              </Tag>
              <Tag
                variant={categoryFilter === "sandbox" ? "fill" : "outline"}
                color="blue"
                onClick={() => setCategoryFilter("sandbox")}
              >
                Sandbox
              </Tag>
              <Tag
                variant={categoryFilter === "docs" ? "fill" : "outline"}
                color="teal"
                onClick={() => setCategoryFilter("docs")}
              >
                Docs
              </Tag>
            </div>
          </div>
        </PageLayoutHeader>
        <PageLayoutBody>
          <FileList
            files={files}
            selectedPath={selectedPath}
            categoryFilter={categoryFilter}
            searchQuery={searchQuery}
            onFileSelect={loadFile}
          />
        </PageLayoutBody>
      </PageLayoutPane>

      {/* Main Content */}
      <PageLayoutContent align="start">
        <PageLayoutHeader>
          {selectedPath ? (
            <ContentHeader>
              <ContentHeader.Title>{documentTitle}</ContentHeader.Title>
              <ContentHeader.Description>
                <Breadcrumb>
                  {breadcrumbItems.map((item) => (
                    <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              </ContentHeader.Description>
            </ContentHeader>
          ) : (
            <ContentHeader>
              <ContentHeader.Title>Markdown Viewer</ContentHeader.Title>
              <ContentHeader.Description>Select a document to get started</ContentHeader.Description>
            </ContentHeader>
          )}
        </PageLayoutHeader>
        <PageLayoutBody>
          {!selectedPath ? (
            <div className={styles.emptyStateWrapper}>
              <EmptyState visual={<Book />} title="Select a document">
                Choose a markdown file from the left panel to view its content.
              </EmptyState>
            </div>
          ) : isLoading ? (
            <output aria-busy="true" aria-live="polite" className={styles.skeletonContainer}>
              <Skeleton width="60%" height={28} />
              <div className={styles.skeletonLines}>
                <Skeleton width="100%" height={14} />
                <Skeleton width="95%" height={14} />
                <Skeleton width="80%" height={14} />
              </div>
              <Skeleton width="40%" height={22} />
              <div className={styles.skeletonLines}>
                <Skeleton width="100%" height={14} />
                <Skeleton width="90%" height={14} />
              </div>
              <Skeleton width="100%" height={120} />
            </output>
          ) : (
            <ErrorBoundary key={selectedPath} fallback={<ErrorFallback onError={() => setRenderError(true)} />}>
              <MarkdownRenderer content={content} />
            </ErrorBoundary>
          )}
        </PageLayoutBody>
      </PageLayoutContent>

      {/* Right Pane – TOC */}
      <PageLayoutPane position="end" open={tocEffectiveOpen} width="small">
        <PageLayoutHeader>
          <ContentHeader size="small">
            <ContentHeader.Title>Contents</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <TableOfContents headings={headings} activeId={activeId} onSelect={scrollToHeading} />
        </PageLayoutBody>
      </PageLayoutPane>

      {/* Right Sidebar – TOC toggle */}
      <PageLayoutSidebar position="end">
        <SideNavigation>
          <SideNavigation.Group>
            <SideNavigation.Item
              icon={LfList}
              onClick={() => setTocOpen((prev) => !prev)}
              aria-current={tocEffectiveOpen ? true : undefined}
            >
              Contents
            </SideNavigation.Item>
          </SideNavigation.Group>
        </SideNavigation>
      </PageLayoutSidebar>
    </PageLayout>
  );
};
