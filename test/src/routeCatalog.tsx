import * as homeRoutes from "./pages/routes";
import * as sandboxRoutes from "./pages/sandbox/routes";
import * as templateRoutes from "./pages/template/routes";
import type { RouteConfig, RouteFileMap } from "./types/routes";

export const allRoutes: RouteConfig[] = [...homeRoutes.routes, ...sandboxRoutes.routes, ...templateRoutes.routes];

export const routeFileMap: RouteFileMap = {
  ...homeRoutes.routeFileMap,
  ...sandboxRoutes.routeFileMap,
  ...templateRoutes.routeFileMap,
};

const ROUTE_PREFIX_PRIORITY: Array<{ prefix: string; section: string }> = [
  { prefix: "/template", section: "Templates" },
  { prefix: "/sandbox", section: "Sandbox" },
  { prefix: "/updates", section: "Updates" },
  { prefix: "/markdown-viewer", section: "Markdown" },
  { prefix: "/analytics", section: "Analytics" },
  { prefix: "/", section: "Home" },
];

export interface RouteCatalogEntry {
  path: string;
  filePath: string;
  label: string;
  section: string;
}

const toTitleCase = (value: string) => value.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const getRouteSection = (path: string) =>
  ROUTE_PREFIX_PRIORITY.find((entry) => (entry.prefix === "/" ? path === "/" : path.startsWith(entry.prefix)))
    ?.section ?? "Other";

const createRouteLabel = (path: string) => {
  if (path === "/") return "Home";

  const segments = path
    .split("/")
    .filter(Boolean)
    .map((segment) => toTitleCase(segment));

  return segments.join(" / ");
};

export const editableRouteCatalog: RouteCatalogEntry[] = Object.entries(routeFileMap)
  .filter(([path, filePath]) => {
    if (path === "/visual-editor") return false;
    if (path.startsWith("/markdown-viewer")) return false;
    return filePath.endsWith(".tsx");
  })
  .map(([path, filePath]) => ({
    path,
    filePath,
    label: createRouteLabel(path),
    section: getRouteSection(path),
  }))
  .sort((left, right) => {
    if (left.section !== right.section) {
      return left.section.localeCompare(right.section);
    }

    return left.label.localeCompare(right.label);
  });
