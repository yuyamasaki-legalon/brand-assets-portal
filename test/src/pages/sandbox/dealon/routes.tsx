import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../types/routes";

// Auto-discover user routes within dealon/
const userRoutesModules = import.meta.glob<{
  routes: RouteConfig[];
  routeFileMap: RouteFileMap;
}>("./*/routes.tsx", { eager: true });

const userRoutes: RouteConfig[] = [];
const userRouteFileMap: RouteFileMap = {};

for (const module of Object.values(userRoutesModules)) {
  userRoutes.push(...module.routes);
  Object.assign(userRouteFileMap, module.routeFileMap);
}

// DealOn common pages only
const DealOnSandbox = lazy(() => import("./index").then((module) => ({ default: module.DealOnSandbox })));

const dealonCommonRoutes: RouteConfig[] = [
  {
    path: "/sandbox/dealon",
    element: <DealOnSandbox />,
  },
];

export const routes: RouteConfig[] = [...dealonCommonRoutes, ...userRoutes];

export const routeFileMap: RouteFileMap = {
  "/sandbox/dealon": "src/pages/sandbox/dealon/index.tsx",
  ...userRouteFileMap,
};
