import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

// DealOn wataryooou pages
const DealOnWataryooou = lazy(() => import("./index").then((module) => ({ default: module.DealOnWataryooou })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/dealon/wataryooou",
    element: <DealOnWataryooou />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/dealon/wataryooou": "src/pages/sandbox/dealon/wataryooou/index.tsx",
};
