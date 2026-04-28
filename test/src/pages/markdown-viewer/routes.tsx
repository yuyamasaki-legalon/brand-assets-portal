import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../types/routes";

const MarkdownViewer = lazy(() => import("./index").then((module) => ({ default: module.MarkdownViewer })));

export const routes: RouteConfig[] = [
  {
    path: "/markdown-viewer",
    element: <MarkdownViewer />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/markdown-viewer": "src/pages/markdown-viewer/index.tsx",
};
