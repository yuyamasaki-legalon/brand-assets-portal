import type { MarkdownFile } from "../types";

const markdownModules = import.meta.glob(["/src/pages/sandbox/**/*.md", "/docs/**/*.md"], {
  query: "?raw",
  eager: false,
  import: "default",
});

const extractTitle = (path: string): string => {
  const fileName = path.split("/").pop() || "";
  return fileName.replace(/\.md$/, "");
};

const getCategory = (path: string): MarkdownFile["category"] => {
  return path.startsWith("/docs/") ? "docs" : "sandbox";
};

export const markdownFileList: MarkdownFile[] = Object.keys(markdownModules).map((path) => ({
  path,
  title: extractTitle(path),
  category: getCategory(path),
}));

export const hasMarkdownFile = (path: string): path is keyof typeof markdownModules => {
  return path in markdownModules;
};

export const loadMarkdownContent = async (path: string): Promise<string> => {
  const loader = markdownModules[path];
  if (!loader) {
    throw new Error(`Markdown file not found: ${path}`);
  }

  return (await loader()) as string;
};
