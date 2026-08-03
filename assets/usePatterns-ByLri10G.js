var e=`import { useEffect, useMemo, useState } from "react";
import type { AntiPatternMeta, RecipeMeta } from "../types";
import { parseAntiPattern } from "../utils/parseAntiPattern";
import { parseRecipe } from "../utils/parseRecipe";

const antiPatternFiles = import.meta.glob("/docs/anti-patterns/*.md", {
  query: "?raw",
  eager: false,
  import: "default",
});

const recipeFiles = import.meta.glob("/docs/aegis-recipes/*.md", {
  query: "?raw",
  eager: false,
  import: "default",
});

const RECIPE_EXCLUDE = new Set(["README"]);

export const usePatterns = () => {
  const [antiPatterns, setAntiPatterns] = useState<AntiPatternMeta[]>([]);
  const [recipes, setRecipes] = useState<RecipeMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const apResults: AntiPatternMeta[] = [];
      for (const path of Object.keys(antiPatternFiles)) {
        try {
          const raw = (await antiPatternFiles[path]()) as string;
          const parsed = parseAntiPattern(raw);
          if (parsed) {
            apResults.push({ ...parsed.meta, path });
          }
        } catch {
          // skip invalid files
        }
      }
      apResults.sort((a, b) => a.id.localeCompare(b.id));

      const recipeResults: RecipeMeta[] = [];
      for (const path of Object.keys(recipeFiles)) {
        const slug = path.split("/").pop()?.replace(/\\.md$/, "") ?? "";
        if (RECIPE_EXCLUDE.has(slug)) continue;
        try {
          const raw = (await recipeFiles[path]()) as string;
          const parsed = parseRecipe(raw);
          if (parsed) {
            recipeResults.push({ ...parsed.meta, slug, path });
          }
        } catch {
          // skip invalid files
        }
      }
      recipeResults.sort((a, b) => a.title.localeCompare(b.title, "ja"));

      setAntiPatterns(apResults);
      setRecipes(recipeResults);
      setIsLoading(false);
    };
    load();
  }, []);

  const components = useMemo(() => {
    const set = new Set<string>();
    for (const ap of antiPatterns) set.add(ap.component);
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [antiPatterns]);

  return { antiPatterns, recipes, isLoading, components };
};
`;export{e as default};