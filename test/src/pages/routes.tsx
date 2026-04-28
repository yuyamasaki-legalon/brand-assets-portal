import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../types/routes";
import { routeFileMap as markdownViewerRouteFileMap, routes as markdownViewerRoutes } from "./markdown-viewer/routes";
import { routeFileMap as updatesRouteFileMap, routes as updatesRoutes } from "./updates/routes";

const Home = lazy(() => import("./Home"));
const AnalyticsPage = lazy(() => import("./analytics/index"));
const VisualEditorPage = lazy(() => import("./visual-editor/index"));

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/visual-editor",
    element: <VisualEditorPage />,
  },
  {
    path: "/analytics",
    element: <AnalyticsPage />,
  },
  ...updatesRoutes,
  ...markdownViewerRoutes,
];

export const routeFileMap: RouteFileMap = {
  "/": "src/pages/Home.tsx",
  "/visual-editor": "src/pages/visual-editor/index.tsx",
  "/analytics": "src/pages/analytics/index.tsx",
  ...updatesRouteFileMap,
  ...markdownViewerRouteFileMap,
};
