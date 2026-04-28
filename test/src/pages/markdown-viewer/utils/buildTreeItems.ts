import type { MarkdownFile, TreeItems } from "../types";

interface BuildTreeItemsResult {
  items: TreeItems;
  rootId: string;
}

/**
 * MarkdownFile[] から Tree コンポーネント用の Record 型データに変換
 */
export function buildTreeItems(
  files: MarkdownFile[],
  categoryFilter: "all" | "sandbox" | "docs",
): BuildTreeItemsResult {
  const items: TreeItems = {};

  const rootId = "root";
  const rootChildren: string[] = [];

  if (categoryFilter === "all") {
    const hasSandbox = files.some((f) => f.category === "sandbox");
    const hasDocs = files.some((f) => f.category === "docs");
    if (hasSandbox) rootChildren.push("sandbox");
    if (hasDocs) rootChildren.push("docs");
  } else {
    const hasCategory = files.some((f) => f.category === categoryFilter);
    if (hasCategory) rootChildren.push(categoryFilter);
  }

  items[rootId] = { name: "Files", children: rootChildren };

  // Initialize category nodes
  if (rootChildren.includes("sandbox")) {
    items.sandbox = { name: "Sandbox", children: [], isCategory: true };
  }
  if (rootChildren.includes("docs")) {
    items.docs = { name: "Docs", children: [], isCategory: true };
  }

  for (const file of files) {
    const basePath = file.category === "sandbox" ? "/src/pages/sandbox/" : "/docs/";

    const relativePath = file.path.replace(basePath, "");
    const segments = relativePath.split("/").filter(Boolean);

    let currentPath: string = file.category;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isLast = i === segments.length - 1;
      const nodeId = `${currentPath}/${segment}`;

      const parentItem = items[currentPath];
      if (parentItem && !parentItem.children) {
        parentItem.children = [];
      }
      if (parentItem?.children && !parentItem.children.includes(nodeId)) {
        parentItem.children.push(nodeId);
      }

      if (!items[nodeId]) {
        if (isLast) {
          items[nodeId] = {
            name: segment.replace(/\.md$/, ""),
            isFile: true,
            originalPath: file.path,
          };
        } else {
          items[nodeId] = {
            name: segment,
            children: [],
          };
        }
      }

      currentPath = nodeId;
    }
  }

  return { items, rootId };
}
