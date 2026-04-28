import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../types/routes";

// Auto-discover user routes within workon/
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

// WorkOn common pages only
const WorkOnSandbox = lazy(() => import("./index").then((module) => ({ default: module.WorkOnSandbox })));
const WorkOnUser1 = lazy(() => import("./user1/index").then((module) => ({ default: module.WorkOnUser1 })));
const WorkOnUser2 = lazy(() => import("./user2/index").then((module) => ({ default: module.WorkOnUser2 })));

const workonCommonRoutes: RouteConfig[] = [
  {
    path: "/sandbox/workon",
    element: <WorkOnSandbox />,
  },
  {
    path: "/sandbox/workon/user1",
    element: <WorkOnUser1 />,
  },
  {
    path: "/sandbox/workon/user2",
    element: <WorkOnUser2 />,
  },
];

export const routes: RouteConfig[] = [...workonCommonRoutes, ...userRoutes];

export const routeFileMap: RouteFileMap = {
  "/sandbox/workon": "src/pages/sandbox/workon/index.tsx",
  "/sandbox/workon/user1": "src/pages/sandbox/workon/user1/index.tsx",
  "/sandbox/workon/user2": "src/pages/sandbox/workon/user2/index.tsx",
  ...userRouteFileMap,
};
