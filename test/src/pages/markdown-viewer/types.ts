export interface MarkdownFile {
  path: string;
  title: string;
  category: "sandbox" | "docs";
}

export interface TreeItemData {
  name: string;
  children?: string[];
  isFile?: boolean;
  isCategory?: boolean;
  originalPath?: string;
}

export type TreeItems = Record<string, TreeItemData>;

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}
