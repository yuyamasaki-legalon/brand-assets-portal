import { NavList, Text } from "@legalforce/aegis-react";
import type { TocEntry } from "../types";

interface TableOfContentsProps {
  headings: TocEntry[];
  activeId: string;
  onSelect: (id: string) => void;
}

const levelIndent: Record<number, string> = {
  1: "0",
  2: "var(--aegis-space-xSmall)",
  3: "var(--aegis-space-medium)",
  4: "var(--aegis-space-large)",
  5: "var(--aegis-space-xLarge)",
  6: "var(--aegis-space-xxLarge)",
};

export const TableOfContents = ({ headings, activeId, onSelect }: TableOfContentsProps) => {
  if (headings.length === 0) {
    return (
      <div style={{ padding: "var(--aegis-space-medium)" }}>
        <Text>No headings in this document</Text>
      </div>
    );
  }

  return (
    <NavList size="small">
      {headings.map((heading) => {
        const isActive = activeId === heading.id;
        return (
          <NavList.Item
            key={heading.id}
            href={`#${heading.id}`}
            aria-current={isActive ? "page" : undefined}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onSelect(heading.id);
            }}
            style={{
              paddingLeft: levelIndent[heading.level] ?? "var(--aegis-space-xxLarge)",
            }}
          >
            {heading.text}
          </NavList.Item>
        );
      })}
    </NavList>
  );
};
