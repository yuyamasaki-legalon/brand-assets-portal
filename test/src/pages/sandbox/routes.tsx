import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../types/routes";
import { routeFileMap as dealonRouteFileMap, routes as dealonRoutes } from "./dealon/routes";
import { routeFileMap as locRouteFileMap, routes as locRoutes } from "./loc/routes";
import { routeFileMap as workonRouteFileMap, routes as workonRoutes } from "./workon/routes";

// Auto-discover legacy user routes (for backwards compatibility)
const userRoutesModules = import.meta.glob<{
  routes: RouteConfig[];
  routeFileMap: RouteFileMap;
}>("./users/*/routes.tsx", { eager: true });

const userRoutes: RouteConfig[] = [];
const userRouteFileMap: RouteFileMap = {};

for (const module of Object.values(userRoutesModules)) {
  userRoutes.push(...module.routes);
  Object.assign(userRouteFileMap, module.routeFileMap);
}

// Shared sandbox pages
const Sandbox = lazy(() => import("./index").then((module) => ({ default: module.Sandbox })));
const CaseListPaging = lazy(() =>
  import("./case-list-paging/index").then((module) => ({ default: module.CaseListPaging })),
);
const CaseDetailLinkedFiles = lazy(() =>
  import("./case-detail-linked-files/index").then((module) => ({ default: module.CaseDetailLinkedFiles })),
);
const BrandAssetPortal = lazy(() => import("./brand-asset-portal/index"));
const sharedRoutes: RouteConfig[] = [
  {
    path: "/sandbox",
    element: <Sandbox />,
  },
  {
    path: "/sandbox/case-list-paging",
    element: <CaseListPaging />,
  },
  {
    path: "/sandbox/case-detail-linked-files",
    element: <CaseDetailLinkedFiles />,
  },
  {
    path: "/sandbox/brand-asset-portal",
    element: <BrandAssetPortal />,
  },
];

// Combine shared, user, loc, workon, and dealon routes
export const routes: RouteConfig[] = [...sharedRoutes, ...userRoutes, ...locRoutes, ...workonRoutes, ...dealonRoutes];

export const routeFileMap: RouteFileMap = {
  "/sandbox": "src/pages/sandbox/index.tsx",
  "/sandbox/case-list-paging": "src/pages/sandbox/case-list-paging/index.tsx",
  "/sandbox/case-detail-linked-files": "src/pages/sandbox/case-detail-linked-files/index.tsx",
  "/sandbox/brand-asset-portal": "src/pages/sandbox/brand-asset-portal/index.tsx",
  ...userRouteFileMap,
  ...locRouteFileMap,
  ...workonRouteFileMap,
  ...dealonRouteFileMap,
};
