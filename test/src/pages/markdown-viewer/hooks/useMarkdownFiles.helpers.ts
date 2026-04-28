import type { MarkdownFile } from "../types";

export const resolveSelectedMarkdownPath = (
  selectedPathParam: string | null,
  hasMarkdownFile: (path: string) => boolean,
): string | null => {
  return selectedPathParam && hasMarkdownFile(selectedPathParam) ? selectedPathParam : null;
};

export const getMissingMarkdownPaths = (files: MarkdownFile[], contentCache: Record<string, string>): string[] => {
  return files.map((file) => file.path).filter((path) => contentCache[path] === undefined);
};

export const filterMarkdownFiles = ({
  files,
  searchQuery,
  categoryFilter,
  contentCache,
}: {
  files: MarkdownFile[];
  searchQuery: string;
  categoryFilter: "all" | "sandbox" | "docs";
  contentCache: Record<string, string>;
}): MarkdownFile[] => {
  const lowerQuery = searchQuery.toLowerCase();

  return files.filter((file) => {
    if (categoryFilter !== "all" && file.category !== categoryFilter) {
      return false;
    }

    if (searchQuery) {
      const titleMatch = file.title.toLowerCase().includes(lowerQuery);
      const pathMatch = file.path.toLowerCase().includes(lowerQuery);
      const contentMatch = contentCache[file.path]?.toLowerCase().includes(lowerQuery) ?? false;
      return titleMatch || pathMatch || contentMatch;
    }

    return true;
  });
};
