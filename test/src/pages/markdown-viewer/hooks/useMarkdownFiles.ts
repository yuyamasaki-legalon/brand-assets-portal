import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { hasMarkdownFile, loadMarkdownContent, markdownFileList } from "../utils/markdownRegistry";
import { filterMarkdownFiles, getMissingMarkdownPaths, resolveSelectedMarkdownPath } from "./useMarkdownFiles.helpers";

export const useMarkdownFiles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "sandbox" | "docs">("all");
  const [contentCache, setContentCache] = useState<Record<string, string>>({});

  const selectedPathParam = searchParams.get("file");
  const selectedPath = resolveSelectedMarkdownPath(selectedPathParam, hasMarkdownFile);
  const cachedSelectedContent = selectedPath ? contentCache[selectedPath] : undefined;

  useEffect(() => {
    let isCancelled = false;

    if (!selectedPath) {
      setContent("");
      setIsLoading(false);
      return () => {
        isCancelled = true;
      };
    }

    if (cachedSelectedContent !== undefined) {
      setContent(cachedSelectedContent);
      setIsLoading(false);
      return () => {
        isCancelled = true;
      };
    }

    setIsLoading(true);

    loadMarkdownContent(selectedPath)
      .then((fileContent) => {
        if (isCancelled) {
          return;
        }

        setContent(fileContent);
        setContentCache((current) => ({
          ...current,
          [selectedPath]: fileContent,
        }));
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }

        const fallback = "# Error\n\nFailed to load file.";
        setContent(fallback);
        setContentCache((current) => ({
          ...current,
          [selectedPath]: fallback,
        }));
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedPath, cachedSelectedContent]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const missingPaths = getMissingMarkdownPaths(markdownFileList, contentCache);

    if (missingPaths.length === 0) {
      return;
    }

    let isCancelled = false;

    void Promise.all(
      missingPaths.map(async (path) => {
        try {
          return [path, await loadMarkdownContent(path)] as const;
        } catch {
          return [path, ""] as const;
        }
      }),
    ).then((entries) => {
      if (isCancelled) {
        return;
      }

      setContentCache((current) => {
        let next = current;

        for (const [path, fileContent] of entries) {
          if (next[path] !== undefined) {
            continue;
          }

          if (next === current) {
            next = { ...current };
          }

          next[path] = fileContent;
        }

        return next;
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [searchQuery, contentCache]);

  const loadFile = useCallback(
    (path: string) => {
      setSearchParams({ file: path });
    },
    [setSearchParams],
  );

  const filteredFiles = useMemo(() => {
    return filterMarkdownFiles({ files: markdownFileList, searchQuery, categoryFilter, contentCache });
  }, [searchQuery, categoryFilter, contentCache]);

  return {
    files: filteredFiles,
    selectedPath,
    content,
    isLoading,
    searchQuery,
    categoryFilter,
    loadFile,
    setSearchQuery,
    setCategoryFilter,
  };
};
