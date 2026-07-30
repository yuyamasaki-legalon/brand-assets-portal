var e=`import { useCallback, useEffect, useRef, useState } from "react";
import { buildDocsHash, parseDocsHash, resolveInitialMdFile } from "../docsUrlState";
import { buildMdFileOptions, resolveDocsHashForState } from "../FloatingSourceCodeViewer.helpers";

interface UseDocsDrawerArgs {
  currentPath: string;
  filePath: string;
  adjacentMarkdownFiles: string[];
  fetchMarkdownContent: (path: string) => Promise<string>;
}

const getMdIdentifier = (path: string) => path.replace(/^\\//, "");

export const useDocsDrawer = ({
  currentPath,
  filePath,
  adjacentMarkdownFiles,
  fetchMarkdownContent,
}: UseDocsDrawerArgs) => {
  const initialHash = parseDocsHash(window.location.hash);
  const previousPathRef = useRef(currentPath);

  const [selectedMdFile, setSelectedMdFile] = useState<string | null>(() =>
    resolveInitialMdFile({
      adjacentMarkdownFiles,
      selectedMdFile: null,
      hashFileId: initialHash.fileId,
      normalizeIdentifier: getMdIdentifier,
    }),
  );
  const [initialFileIdFromHash] = useState<string | null>(initialHash.fileId);
  const [mdContent, setMdContent] = useState<string>("");
  const [isMdLoading, setIsMdLoading] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(initialHash.isOpen);

  // Auto-select file when adjacentMarkdownFiles changes (page navigation)
  const [prevAdjacentFiles, setPrevAdjacentFiles] = useState(adjacentMarkdownFiles);
  if (adjacentMarkdownFiles !== prevAdjacentFiles) {
    setPrevAdjacentFiles(adjacentMarkdownFiles);
    const resolved = resolveInitialMdFile({
      adjacentMarkdownFiles,
      selectedMdFile: null,
      hashFileId: initialFileIdFromHash,
      normalizeIdentifier: getMdIdentifier,
    });
    if (resolved) {
      setSelectedMdFile(resolved);
    } else {
      setSelectedMdFile(null);
      setMdContent("");
    }
  }

  const buildDocsHashWithIdentifier = useCallback((file: string | null) => buildDocsHash(file, getMdIdentifier), []);

  const replaceHash = useCallback((hash: string) => {
    window.history.replaceState(
      null,
      "",
      resolveDocsHashForState({
        pathname: window.location.pathname,
        search: window.location.search,
        hash,
      }),
    );
  }, []);

  const handleDocsOpenChange = useCallback(
    (open: boolean) => {
      setIsDocsOpen(open);
      replaceHash(open ? buildDocsHashWithIdentifier(selectedMdFile) : "");
    },
    [buildDocsHashWithIdentifier, replaceHash, selectedMdFile],
  );

  const handleFileSelect = useCallback(
    (file: string | null) => {
      setSelectedMdFile(file);
      if (isDocsOpen && file) {
        replaceHash(buildDocsHashWithIdentifier(file));
      }
    },
    [buildDocsHashWithIdentifier, isDocsOpen, replaceHash],
  );

  // Close Docs Drawer and reset URL hash when navigating to a different page
  useEffect(() => {
    if (previousPathRef.current === currentPath) return;
    setIsDocsOpen(false);
    replaceHash("");
    previousPathRef.current = currentPath;
  }, [currentPath, replaceHash]);

  // Load markdown content when selected file changes
  useEffect(() => {
    if (selectedMdFile) {
      setIsMdLoading(true);
      fetchMarkdownContent(selectedMdFile)
        .then((content) => {
          setMdContent(content);
        })
        .finally(() => {
          setIsMdLoading(false);
        });
    }
  }, [selectedMdFile, fetchMarkdownContent]);

  const mdFileOptions = buildMdFileOptions({ adjacentMarkdownFiles, filePath });

  return {
    selectedMdFile,
    isDocsOpen,
    setIsDocsOpen,
    mdContent,
    isMdLoading,
    handleDocsOpenChange,
    handleFileSelect,
    mdFileOptions,
  };
};

export type UseDocsDrawerReturn = ReturnType<typeof useDocsDrawer>;
`;export{e as default};