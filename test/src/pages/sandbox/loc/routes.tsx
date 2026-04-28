import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../types/routes";

// Auto-discover user routes within loc/
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

// LOC common pages only
const LocSandbox = lazy(() => import("./index").then((module) => ({ default: module.LocSandbox })));
const LocUser1 = lazy(() => import("./user1/index").then((module) => ({ default: module.LocUser1 })));
const LocUser2 = lazy(() => import("./user2/index").then((module) => ({ default: module.LocUser2 })));

const locCommonRoutes: RouteConfig[] = [
  {
    path: "/sandbox/loc",
    element: <LocSandbox />,
  },
  {
    path: "/sandbox/loc/user1",
    element: <LocUser1 />,
  },
  {
    path: "/sandbox/loc/user2",
    element: <LocUser2 />,
  },
];

export const routes: RouteConfig[] = [...locCommonRoutes, ...userRoutes];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc": "src/pages/sandbox/loc/index.tsx",
  "/sandbox/loc/user1": "src/pages/sandbox/loc/user1/index.tsx",
  "/sandbox/loc/user2": "src/pages/sandbox/loc/user2/index.tsx",
  ...userRouteFileMap,
};
