import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserChieSandbox = lazy(() => import("./index").then((module) => ({ default: module.UserChieSandbox })));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/loc/chie",
    element: <UserChieSandbox />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/loc/chie": "src/pages/sandbox/loc/chie/index.tsx",
};
