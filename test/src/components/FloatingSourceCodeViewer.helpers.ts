export const truncateMiddle = (text: string, maxLength = 80): string => {
  if (text.length <= maxLength) return text;
  const headLength = Math.ceil(maxLength * 0.6);
  const tailLength = Math.floor(maxLength * 0.3);
  return `${text.slice(0, headLength)}…${text.slice(-tailLength)}`;
};

export const buildMdFileOptions = ({
  adjacentMarkdownFiles,
  filePath,
}: {
  adjacentMarkdownFiles: string[];
  filePath: string;
}): Array<{ label: string; value: string }> => {
  const baseDir = filePath === "unknown" ? null : filePath.replace(/\/[^/]+$/, "");

  return adjacentMarkdownFiles.map((path) => {
    const cleanedPath = path.replace(/^\//, "");
    const filename = path.split("/").pop() || path;

    const relativePath =
      baseDir && cleanedPath.startsWith(`${baseDir}/`) ? cleanedPath.slice(baseDir.length + 1) : cleanedPath;

    const label = truncateMiddle(relativePath === filename ? filename : `${filename} - ${relativePath}`);

    return { label, value: path };
  });
};

export const resolveDocsHashForState = ({
  pathname,
  search,
  hash,
}: {
  pathname: string;
  search: string;
  hash: string;
}): string => `${pathname}${search}${hash}`;
