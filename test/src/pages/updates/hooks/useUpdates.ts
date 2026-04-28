import { useEffect, useMemo, useState } from "react";
import type { UpdateSection } from "../types";
import { parseUpdateFile } from "../utils/parseUpdateFile";

const updateFiles = import.meta.glob("/updates/*.md", {
  query: "?raw",
  eager: false,
  import: "default",
});

export const useUpdates = () => {
  const [sections, setSections] = useState<UpdateSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>("All");

  useEffect(() => {
    const loadAll = async () => {
      const results: UpdateSection[] = [];
      for (const path of Object.keys(updateFiles)) {
        try {
          const raw = (await updateFiles[path]()) as string;
          results.push(parseUpdateFile(raw));
        } catch {
          // skip invalid files
        }
      }
      // Sort by date descending
      results.sort((a, b) => b.meta.date.localeCompare(a.meta.date));
      setSections(results);
      setIsLoading(false);
    };
    loadAll();
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const section of sections) {
      for (const item of section.items) {
        if (item.tag) tagSet.add(item.tag);
      }
    }
    return ["All", ...Array.from(tagSet).sort()];
  }, [sections]);

  const filteredSections = useMemo(() => {
    if (activeTag === "All") return sections;
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.tag === activeTag),
      }))
      .filter((section) => section.items.length > 0);
  }, [sections, activeTag]);

  return {
    sections: filteredSections,
    allSections: sections,
    isLoading,
    allTags,
    activeTag,
    setActiveTag,
  };
};
