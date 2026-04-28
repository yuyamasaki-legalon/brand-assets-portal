import { LfFile, LfFolder } from "@legalforce/aegis-icons";
import { MagnifyingGlass } from "@legalforce/aegis-illustrations/react";
import { EmptyState, Icon, Text, Tooltip, Tree, TreeItem } from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import type { MarkdownFile } from "../types";
import { buildTreeItems } from "../utils/buildTreeItems";

interface FileListProps {
  files: MarkdownFile[];
  selectedPath: string | null;
  categoryFilter: "all" | "sandbox" | "docs";
  searchQuery: string;
  onFileSelect: (path: string) => void;
}

export const FileList = ({ files, selectedPath, categoryFilter, searchQuery, onFileSelect }: FileListProps) => {
  const { items, rootId } = useMemo(() => buildTreeItems(files, categoryFilter), [files, categoryFilter]);

  const selectedItemIds = useMemo(() => {
    if (!selectedPath) return [];
    const entry = Object.entries(items).find(([, data]) => data.originalPath === selectedPath);
    return entry ? [entry[0]] : [];
  }, [selectedPath, items]);

  const [expandedItems, setExpandedItems] = useState<string[]>(() => [rootId, "sandbox", "docs"]);

  const handleSelectedItemsChange = (selectedIds: string[]) => {
    if (selectedIds.length === 0) return;
    const nodeId = selectedIds[0];
    const nodeData = items[nodeId];

    if (nodeData?.isFile && nodeData.originalPath) {
      onFileSelect(nodeData.originalPath);
    } else if (!nodeData?.isFile) {
      setExpandedItems((prev) => (prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]));
    }
  };

  if (files.length === 0) {
    return (
      <div style={{ padding: "var(--aegis-space-large)", display: "flex", justifyContent: "center" }}>
        {searchQuery ? (
          <EmptyState size="small" visual={<MagnifyingGlass />} title="No results found">
            Try a different search term.
          </EmptyState>
        ) : (
          <EmptyState size="small" title="No files available">
            No markdown files were found.
          </EmptyState>
        )}
      </div>
    );
  }

  return (
    <Tree
      items={items}
      rootItemId={rootId}
      selectionType="single"
      selectedItems={selectedItemIds}
      onSelectedItemsChange={handleSelectedItemsChange}
      expandedItems={expandedItems}
      onExpandedItemsChange={setExpandedItems}
    >
      {(itemId) => {
        const itemData = items[itemId];
        if (!itemData) return null;

        const isFile = itemData.isFile;
        const isCategory = itemData.isCategory;
        const IconComponent = isFile ? LfFile : LfFolder;

        return (
          <TreeItem
            leading={
              <Icon size="small" color={isCategory ? "information" : undefined}>
                <IconComponent />
              </Icon>
            }
          >
            <Tooltip title={itemData.name} onlyOnOverflow>
              <Text
                as="span"
                variant={isCategory ? "label.small" : "body.small"}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {itemData.name}
              </Text>
            </Tooltip>
          </TreeItem>
        );
      }}
    </Tree>
  );
};
