export interface DocsHashState {
  isOpen: boolean;
  fileId: string | null;
}

export interface ResolveInitialMdFileParams {
  adjacentMarkdownFiles: string[];
  selectedMdFile: string | null;
  hashFileId: string | null;
  normalizeIdentifier?: (path: string) => string;
}

export const normalizeMdIdentifier = (path: string) => path.replace(/^\//, "");

export const parseDocsHash = (hash: string): DocsHashState => {
  if (!hash.startsWith("#docs")) return { isOpen: false, fileId: null };
  const match = hash.match(/^#docs(?:=(.+))?$/);
  if (!match) return { isOpen: false, fileId: null };
  return { isOpen: true, fileId: match[1] ? decodeURIComponent(match[1]) : null };
};

export const buildDocsHash = (file: string | null, normalizeIdentifier = normalizeMdIdentifier) => {
  if (!file) return "#docs";
  const identifier = normalizeIdentifier(file);
  return `#docs=${encodeURIComponent(identifier)}`;
};

export const resolveInitialMdFile = ({
  adjacentMarkdownFiles,
  selectedMdFile,
  hashFileId,
  normalizeIdentifier = normalizeMdIdentifier,
}: ResolveInitialMdFileParams) => {
  if (adjacentMarkdownFiles.length === 0) return null;
  if (selectedMdFile) return selectedMdFile;

  const normalizedHashId = hashFileId?.replace(/^\//, "");
  if (normalizedHashId) {
    const matchingFile = adjacentMarkdownFiles.find((path) => {
      const identifier = normalizeIdentifier(path);
      const filename = path.split("/").pop();
      return identifier === normalizedHashId || filename === normalizedHashId;
    });

    if (matchingFile) {
      return matchingFile;
    }
  }

  return adjacentMarkdownFiles[0];
};
